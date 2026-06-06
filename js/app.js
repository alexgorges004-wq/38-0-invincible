// ============ GLOBAL STATE ============
const draftState = {
    selectedPool: 'Global',
    selectedMode: 'Classic',
    selectedFormation: '4-3-3',
    roster: [],
    pitch: {},
    currentRound: 1,
    currentTeam: 'Unknown',
    currentEra: '00s',
    teamSkips: 1,
    eraSkips: 1,
    selectedPlayer: null,
};

const TEAMS = ['Manchester United', 'Liverpool', 'Arsenal', 'Chelsea', 'Barcelona', 'Real Madrid', 'AC Milan', 'Juventus', 'Bayern Munich', 'Manchester City'];
const ERAS = ['00s', '10s', '20s'];

const FORMATIONS = {
    '4-3-3': { GK: 1, DF: 4, MF: 3, FW: 3 },
    '4-4-2': { GK: 1, DF: 4, MF: 4, FW: 2 },
    '3-4-3': { GK: 1, DF: 3, MF: 4, FW: 3 },
};

const POSITION_ORDER = {
    'GK': 0,
    'DF': 1,
    'MF': 2,
    'FW': 3,
};

// ============ INITIALIZATION ============
function initGame() {
    attachEventListeners();
    resetPitch();
}

function startGame() {
    const error = document.getElementById('start-error');
    const pool = document.querySelector('.pool-btn.active')?.dataset.pool || 'Global';
    const mode = document.querySelector('.mode-card.active')?.dataset.mode || 'Classic';
    const formation = document.querySelector('.form-btn.active')?.dataset.form || '4-3-3';
    
    const filtered = filterByPool(playersDB, pool);
    
    if (filtered.length < 11) {
        error.classList.remove('hidden');
        return;
    }
    error.classList.add('hidden');
    
    draftState.selectedPool = pool;
    draftState.selectedMode = mode;
    draftState.selectedFormation = formation;
    draftState.currentRound = 1;
    draftState.roster = [];
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    
    updateHeader();
    initPitch();
    renderPlayerList();
    spinSlotMachine();
}

function attachEventListeners() {
    document.querySelectorAll('.pool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.pool-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
    
    document.querySelectorAll('.form-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.form-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', renderPlayerList);
    }
    
    document.querySelectorAll('.pos-filter').forEach(btn => {
        btn.addEventListener('click', renderPlayerList);
    });
}

// ============ HEADER UPDATE ============
function updateHeader() {
    document.getElementById('header-formation').textContent = draftState.selectedFormation;
    document.getElementById('header-pool').textContent = draftState.selectedPool;
    document.getElementById('header-mode').textContent = draftState.selectedMode;
}

// ============ DRAFT MECHANICS ============
function spinSlotMachine() {
    const teamSpinner = document.getElementById('slot-team');
    const eraSpinner = document.getElementById('slot-era');
    
    if (!teamSpinner || !eraSpinner) return;
    
    teamSpinner.textContent = 'ROLLING...';
    eraSpinner.textContent = '--';
    
    let spinCount = 0;
    const spinInterval = setInterval(() => {
        const randomTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)];
        const randomEra = ERAS[Math.floor(Math.random() * ERAS.length)];
        
        teamSpinner.textContent = randomTeam;
        eraSpinner.textContent = randomEra;
        
        spinCount++;
        if (spinCount > 20) {
            clearInterval(spinInterval);
            draftState.currentTeam = randomTeam;
            draftState.currentEra = randomEra;
        }
    }, 100);
}

function reroll(type) {
    if (type === 'team' && draftState.teamSkips > 0) {
        draftState.teamSkips--;
        document.getElementById('skips-team').textContent = draftState.teamSkips;
        
        let spins = 0;
        const interval = setInterval(() => {
            document.getElementById('slot-team').textContent = TEAMS[Math.floor(Math.random() * TEAMS.length)];
            spins++;
            if (spins > 15) {
                clearInterval(interval);
                draftState.currentTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)];
                document.getElementById('slot-team').textContent = draftState.currentTeam;
            }
        }, 80);
    } else if (type === 'era' && draftState.eraSkips > 0) {
        draftState.eraSkips--;
        document.getElementById('skips-era').textContent = draftState.eraSkips;
        
        let spins = 0;
        const interval = setInterval(() => {
            document.getElementById('slot-era').textContent = ERAS[Math.floor(Math.random() * ERAS.length)];
            spins++;
            if (spins > 15) {
                clearInterval(interval);
                draftState.currentEra = ERAS[Math.floor(Math.random() * ERAS.length)];
                document.getElementById('slot-era').textContent = draftState.currentEra;
            }
        }, 80);
    }
}

// ============ PLAYER FILTERING ============
function filterByPool(players, pool) {
    if (pool === 'Global') return players;
    return players.filter(p => p.league === pool);
}

function getFilteredPlayers() {
    const pool = draftState.selectedPool;
    const allPlayers = filterByPool(playersDB, pool);
    
    const posFilter = document.querySelector('.pos-filter.active')?.dataset.pos || 'All';
    const searchTerm = (document.getElementById('search-input')?.value || '').toLowerCase();
    
    let filtered = allPlayers;
    
    if (posFilter !== 'All') {
        filtered = filtered.filter(p => p.pos.includes(posFilter));
    }
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.club.toLowerCase().includes(searchTerm)
        );
    }
    
    // Remove already selected players
    filtered = filtered.filter(p => !draftState.roster.find(r => r.id === p.id));
    
    return filtered;
}

// ============ PLAYER LIST RENDERING ============
function renderPlayerList() {
    const container = document.getElementById('player-list-container');
    if (!container) return;
    
    const players = getFilteredPlayers();
    container.innerHTML = '';
    
    if (players.length === 0) {
        container.innerHTML = `<div style="padding: 20px; text-align: center; color: #8b949e; font-size: 14px;">No players available</div>`;
        return;
    }
    
    players.slice(0, 50).forEach(player => {
        const playerEl = document.createElement('div');
        playerEl.className = 'player-card';
        playerEl.style.cssText = `
            padding: 10px;
            margin: 8px;
            background: rgba(30, 30, 30, 0.6);
            border: 1px solid #30363d;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        const ovr = draftState.selectedMode === 'IQ' ? '?' : player.ovr;
        const stats = draftState.selectedMode === 'IQ' ? '?' : `${player.pace}/${player.shoot}/${player.pass}`;
        
        playerEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <div style="font-weight: bold; color: #58a6ff;">${player.name}</div>
                <div style="font-size: 14px; font-weight: bold; color: #2ea043;">${ovr}</div>
            </div>
            <div style="font-size: 12px; color: #8b949e; margin-bottom: 5px;">${player.club} • ${player.pos}</div>
            <div style="font-size: 11px; color: #6e7681;">${stats}</div>
        `;
        
        playerEl.onclick = () => selectPlayer(player);
        playerEl.onmouseover = () => playerEl.style.borderColor = '#58a6ff';
        playerEl.onmouseout = () => playerEl.style.borderColor = '#30363d';
        
        container.appendChild(playerEl);
    });
}

// ============ PLAYER SELECTION ============
function selectPlayer(player) {
    if (draftState.roster.length >= 11) {
        alert('Squad is full!');
        return;
    }
    
    draftState.roster.push(player);
    draftState.selectedPlayer = player;
    draftState.currentRound = draftState.roster.length;
    
    document.getElementById('round-counter').textContent = draftState.currentRound;
    updateStats();
    renderPlayerList();
    renderPitch();
    
    if (draftState.currentRound === 11) {
        showSimulateButton();
    } else {
        spinSlotMachine();
    }
}

// ============ PITCH RENDERING ============
function initPitch() {
    resetPitch();
    renderPitch();
}

function resetPitch() {
    const formation = draftState.selectedFormation;
    const config = FORMATIONS[formation];
    draftState.pitch = {};
    
    let posIndex = 0;
    for (const [pos, count] of Object.entries(config)) {
        draftState.pitch[pos] = [];
        for (let i = 0; i < count; i++) {
            draftState.pitch[pos].push(null);
        }
    }
}

function renderPitch() {
    const container = document.getElementById('pitch-container');
    if (!container) return;
    
    container.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 300 400" style="background: linear-gradient(135deg, #1a472a, #0f1219); border: 2px solid #30363d; border-radius: 8px;">
            <!-- Pitch markings -->
            <rect width="300" height="400" fill="none" stroke="#30363d" stroke-width="2"/>
            <line x1="150" y1="0" x2="150" y2="400" stroke="#30363d" stroke-width="1" stroke-dasharray="5,5"/>
            <circle cx="150" cy="200" r="40" fill="none" stroke="#30363d" stroke-width="1"/>
            <circle cx="150" cy="200" r="3" fill="#30363d"/>
            <!-- Goal areas -->
            <rect x="100" y="10" width="100" height="60" fill="none" stroke="#30363d" stroke-width="1"/>
            <rect x="100" y="330" width="100" height="60" fill="none" stroke="#30363d" stroke-width="1"/>
        </svg>
        <div id="pitch-players" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: auto;"></div>
    `;
    
    renderPitchPlayers();
}

function renderPitchPlayers() {
    const playersContainer = document.querySelector('#pitch-container #pitch-players');
    if (!playersContainer) return;
    
    playersContainer.innerHTML = '';
    
    const formation = draftState.selectedFormation;
    const config = FORMATIONS[formation];
    
    // Position coordinates for different formations
    const positionMap = {
        '4-3-3': {
            'GK': [[150, 30]],
            'DF': [[75, 100], [125, 100], [175, 100], [225, 100]],
            'MF': [[75, 200], [150, 200], [225, 200]],
            'FW': [[75, 320], [150, 320], [225, 320]]
        },
        '4-4-2': {
            'GK': [[150, 30]],
            'DF': [[75, 100], [125, 100], [175, 100], [225, 100]],
            'MF': [[50, 200], [100, 200], [200, 200], [250, 200]],
            'FW': [[100, 320], [200, 320]]
        },
        '3-4-3': {
            'GK': [[150, 30]],
            'DF': [[100, 100], [150, 100], [200, 100]],
            'MF': [[50, 200], [100, 200], [200, 200], [250, 200]],
            'FW': [[75, 320], [150, 320], [225, 320]]
        }
    };
    
    const coords = positionMap[formation] || positionMap['4-3-3'];
    let globalIndex = 0;
    
    for (const pos of ['GK', 'DF', 'MF', 'FW']) {
        const players = draftState.pitch[pos] || [];
        const posCoords = coords[pos] || [];
        
        players.forEach((player, idx) => {
            if (!posCoords[idx]) return;
            
            const [x, y] = posCoords[idx];
            const playerDiv = document.createElement('div');
            
            if (player) {
                playerDiv.innerHTML = `
                    <div style="position: absolute; left: ${x}px; top: ${y}px; transform: translate(-50%, -50%); text-align: center;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #58a6ff, #1f6feb); border: 2px solid #ffd700; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: bold; color: white; font-size: 12px; box-shadow: 0 0 10px rgba(88, 166, 255, 0.3);">
                            ${player.num || globalIndex + 1}
                        </div>
                        <div style="font-size: 10px; color: #c9d1d9; margin-top: 3px; max-width: 50px; word-break: break-word;">${player.name}</div>
                    </div>
                `;
                playerDiv.onclick = () => removePlayerFromPitch(globalIndex);
            } else {
                playerDiv.innerHTML = `
                    <div style="position: absolute; left: ${x}px; top: ${y}px; transform: translate(-50%, -50%); text-align: center;">
                        <div style="width: 40px; height: 40px; background: rgba(48, 54, 61, 0.5); border: 2px dashed #30363d; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6e7681; font-size: 12px; font-weight: bold;">
                            ${pos}
                        </div>
                    </div>
                `;
                playerDiv.onclick = () => showEligiblePlayers(pos);
            }
            
            playersContainer.appendChild(playerDiv);
            globalIndex++;
        });
    }
}

function showEligiblePlayers(pos) {
    const eligible = draftState.roster.filter(p => p.pos.includes(pos) && !Object.values(draftState.pitch).flat().includes(p));
    if (eligible.length === 0) {
        alert('No available players for this position');
        return;
    }
    alert(`Click a player card to place them at ${pos}`);
}

function removePlayerFromPitch(index) {
    let count = 0;
    for (const pos of ['GK', 'DF', 'MF', 'FW']) {
        for (let i = 0; i < draftState.pitch[pos].length; i++) {
            if (count === index) {
                draftState.pitch[pos][i] = null;
                renderPitchPlayers();
                updateStats();
                return;
            }
            count++;
        }
    }
}

function placeBestFitPlayer(pos) {
    const eligible = draftState.roster.filter(p => p.pos.includes(pos));
    if (eligible.length === 0) return;
    
    for (let i = 0; i < draftState.pitch[pos].length; i++) {
        if (!draftState.pitch[pos][i]) {
            draftState.pitch[pos][i] = eligible[0];
            renderPitchPlayers();
            updateStats();
            break;
        }
    }
}

// ============ STATS CALCULATION ============
function updateStats() {
    const pitchPlayers = Object.values(draftState.pitch).flat().filter(p => p);
    
    if (pitchPlayers.length === 0) {
        resetStats();
        return;
    }
    
    const stats = {
        goals: pitchPlayers.reduce((sum, p) => sum + (p.goals || 0), 0),
        assists: pitchPlayers.reduce((sum, p) => sum + (p.assists || 0), 0),
        dribbles: pitchPlayers.reduce((sum, p) => sum + (p.dribbles || 0), 0),
        tackles: pitchPlayers.reduce((sum, p) => sum + (p.tackles || 0), 0),
        interceptions: pitchPlayers.reduce((sum, p) => sum + (p.interceptions || 0), 0),
    };
    
    const ovr = Math.round(pitchPlayers.reduce((sum, p) => sum + (p.ovr || 0), 0) / pitchPlayers.length);
    const chemistry = calculateChemistry(pitchPlayers);
    
    document.getElementById('tot-gls').textContent = stats.goals;
    document.getElementById('tot-ast').textContent = stats.assists;
    document.getElementById('tot-drb').textContent = stats.dribbles;
    document.getElementById('tot-tck').textContent = stats.tackles;
    document.getElementById('tot-int').textContent = stats.interceptions;
    document.getElementById('team-ovr').textContent = ovr;
    document.getElementById('team-chem').textContent = `${chemistry}/100`;
    
    // Update progress bars
    document.getElementById('prog-gls').style.width = Math.min(100, (stats.goals / 180) * 100) + '%';
    document.getElementById('prog-ast').style.width = Math.min(100, (stats.assists / 150) * 100) + '%';
    document.getElementById('prog-drb').style.width = Math.min(100, (stats.dribbles / 650) * 100) + '%';
    document.getElementById('prog-tck').style.width = Math.min(100, (stats.tackles / 550) * 100) + '%';
    document.getElementById('prog-int').style.width = Math.min(100, (stats.interceptions / 500) * 100) + '%';
}

function resetStats() {
    document.getElementById('tot-gls').textContent = '0';
    document.getElementById('tot-ast').textContent = '0';
    document.getElementById('tot-drb').textContent = '0';
    document.getElementById('tot-tck').textContent = '0';
    document.getElementById('tot-int').textContent = '0';
    document.getElementById('team-ovr').textContent = '0';
    document.getElementById('team-chem').textContent = '0/100';
}

function calculateChemistry(players) {
    if (players.length < 2) return 0;
    
    let chemistry = 50;
    const clubs = {};
    const leagues = {};
    const nations = {};
    
    players.forEach(p => {
        clubs[p.club] = (clubs[p.club] || 0) + 1;
        leagues[p.league] = (leagues[p.league] || 0) + 1;
        nations[p.nation] = (nations[p.nation] || 0) + 1;
    });
    
    Object.values(clubs).forEach(count => {
        if (count >= 2) chemistry += Math.min(count * 5, 15);
    });
    
    Object.values(leagues).forEach(count => {
        if (count >= 3) chemistry += Math.min(count * 3, 10);
    });
    
    Object.values(nations).forEach(count => {
        if (count >= 2) chemistry += Math.min(count * 3, 10);
    });
    
    return Math.min(chemistry, 100);
}

// ============ SIMULATION ============
function showSimulateButton() {
    const container = document.getElementById('simulate-container');
    if (container) {
        container.classList.remove('hidden');
    }
}

function simulateSeason() {
    const pitchPlayers = Object.values(draftState.pitch).flat().filter(p => p);
    if (pitchPlayers.length < 11) {
        alert('Squad incomplete! Place all 11 players first.');
        return;
    }
    
    const results = {
        wins: Math.floor(Math.random() * 5) + 32,
        draws: Math.floor(Math.random() * 3),
        losses: 0
    };
    results.losses = 38 - results.wins - results.draws;
    
    showResults(results);
}

function showResults(results) {
    const modal = document.getElementById('result-modal');
    if (!modal) return;
    
    document.getElementById('result-record').textContent = `${results.wins}-${results.draws}-${results.losses}`;
    
    const chemistry = calculateChemistry(Object.values(draftState.pitch).flat().filter(p => p));
    document.getElementById('result-chem').textContent = `${chemistry}/100`;
    
    modal.classList.remove('hidden');
    generatePuntitVerdict();
}

function generatePuntitVerdict() {
    const verdictEl = document.getElementById('pundit-text');
    if (!verdictEl) return;
    
    const verdicts = [
        'Outstanding teamwork and exceptional execution. This is how football is meant to be played.',
        'A masterclass in squad building. Every player complements the others perfectly.',
        'Historic performance! This team will be remembered for generations.',
        'Perfect balance between offense and defense. Truly invincible.',
        'The chemistry between these players is something special.'
    ];
    
    verdictEl.classList.remove('hidden');
    verdictEl.textContent = verdicts[Math.floor(Math.random() * verdicts.length)];
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}

function saveDraft() {
    localStorage.setItem('draftState', JSON.stringify(draftState));
    alert('Draft saved!');
}

function exportDraft() {
    const data = JSON.stringify(draftState, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'draft.json';
    a.click();
}

function loadDraft() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const loaded = JSON.parse(event.target.result);
            Object.assign(draftState, loaded);
            alert('Draft loaded!');
        };
        reader.readAsText(file);
    };
    input.click();
}

function showLeaderboard() {
    alert('Leaderboard coming soon!');
}

// Initialize on page load
window.addEventListener('load', initGame);
