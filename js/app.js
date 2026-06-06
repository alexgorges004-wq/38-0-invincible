// 38-0 Invincible - Main Application Logic

let draftState = {
    selectedPool: 'Global',
    selectedMode: 'Classic',
    selectedFormation: '4-3-3',
    currentRound: 1,
    roster: [],
    teamSkips: 1,
    eraSkips: 1,
    currentTeam: null,
    currentEra: null,
    selectedPlayer: null,
};

const TEAMS = ['Barcelona', 'Real Madrid', 'AC Milan', 'Man City', 'Liverpool', 'Arsenal', 'Napoli', 'Man Utd', 'Juventus', 'Bayern Munich', 'Chelsea', 'Atlético Madrid', 'AS Roma', 'Tottenham', 'Inter Milan'];
const ERAS = ['00s', '10s', '20s'];
const FORMATIONS = {
    '4-3-3': {gk: 1, def: 4, mid: 3, fwd: 3, positions: ['GK', 'CB', 'CB', 'RB', 'LB', 'CDM', 'CM', 'CAM', 'RW', 'ST', 'LW']},
    '4-4-2': {gk: 1, def: 4, mid: 4, fwd: 2, positions: ['GK', 'CB', 'CB', 'RB', 'LB', 'RM', 'CM', 'CM', 'LM', 'ST', 'ST']},
    '3-4-3': {gk: 1, def: 3, mid: 4, fwd: 3, positions: ['GK', 'CB', 'CB', 'CB', 'RWB', 'CM', 'CM', 'LWB', 'RW', 'ST', 'LW']}
};

// ============ INITIALIZATION ============
function initGame() {
    renderPlayerList();
    attachEventListeners();
    spinSlotMachine();
}

function startGame() {
    const error = document.getElementById('start-error');
    const pool = draftState.selectedPool;
    const filtered = filterByPool(playersDB, pool);
    
    if (filtered.length < 11) {
        error.classList.remove('hidden');
        return;
    }
    error.classList.add('hidden');
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    
    updateHeader();
    initPitch();
    renderPlayerList();
    spinSlotMachine();
}

// ============ DRAFT MECHANICS ============
function spinSlotMachine() {
    const teamSpinner = document.getElementById('slot-team');
    const eraSpinner = document.getElementById('slot-era');
    
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

// ============ PLAYER SELECTION ============
function selectPlayer(playerId) {
    if (draftState.roster.length >= 11) return;
    
    const player = playersDB.find(p => p.id === playerId);
    if (!player) return;
    
    draftState.roster.push(player);
    draftState.selectedPlayer = player;
    draftState.currentRound++;
    
    document.getElementById('round-counter').textContent = draftState.currentRound;
    updateStats();
    renderPlayerList();
    
    if (draftState.currentRound === 12) {
        showSimulateButton();
    } else {
        spinSlotMachine();
    }
    
    highlightEligiblePositions(player);
}

function highlightEligiblePositions(player) {
    const positions = player.pos;
    const pitchSlots = document.querySelectorAll('.pitch-slot');
    
    pitchSlots.forEach(slot => {
        if (positions.includes(slot.dataset.position)) {
            slot.classList.add('eligible');
        } else {
            slot.classList.remove('eligible');
        }
    });
}

// ============ PITCH PLACEMENT ============
function initPitch() {
    const container = document.getElementById('pitch-container');
    const formation = draftState.selectedFormation;
    const formData = FORMATIONS[formation];
    
    container.innerHTML = '<div class="pitch-markings"></div>';
    
    const positions = formData.positions;
    positions.forEach((pos, idx) => {
        const slot = document.createElement('div');
        slot.className = 'pitch-slot';
        slot.dataset.position = pos;
        slot.dataset.index = idx;
        slot.innerHTML = `<span class="slot-label">${pos}</span>`;
        slot.onclick = () => placeBestFitPlayer(pos);
        container.appendChild(slot);
    });
}

function placeBestFitPlayer(position) {
    const available = draftState.roster.filter(p => !isPlaced(p) && p.pos.includes(position));
    if (available.length > 0) {
        const player = available[0];
        const slot = document.querySelector(`[data-position="${position}"]:not(.filled)`);
        if (slot) {
            slot.innerHTML = `<img class="player-thumb" src="https://via.placeholder.com/40?text=${player.name.substring(0, 3)}" alt="${player.name}"><span class="player-name">${player.name}</span>`;
            slot.classList.add('filled');
            slot.dataset.playerId = player.id;
        }
    }
}

function isPlaced(player) {
    return document.querySelector(`[data-player-id="${player.id}"]`) !== null;
}

// ============ STATS & CHEMISTRY ============
function updateStats() {
    const roster = draftState.roster;
    
    let totalGls = 0, totalAst = 0, totalDrb = 0, totalTck = 0, totalInt = 0;
    let totalOvr = 0;
    
    roster.forEach(p => {
        totalGls += p.stats.gls;
        totalAst += p.stats.ast;
        totalDrb += p.stats.drb;
        totalTck += p.stats.tck;
        totalInt += p.stats.int;
        totalOvr += p.ovr;
    });
    
    const chemBonus = calculateChemistry(roster);
    const chemPercentage = Math.round(chemBonus);
    
    totalGls = Math.round(totalGls * (1 + chemBonus / 100));
    totalAst = Math.round(totalAst * (1 + chemBonus / 100));
    totalDrb = Math.round(totalDrb * (1 + chemBonus / 100));
    totalTck = Math.round(totalTck * (1 + chemBonus / 100));
    totalInt = Math.round(totalInt * (1 + chemBonus / 100));
    
    const avgOvr = Math.round(totalOvr / Math.max(roster.length, 1));
    
    document.getElementById('tot-gls').textContent = totalGls;
    document.getElementById('tot-ast').textContent = totalAst;
    document.getElementById('tot-drb').textContent = totalDrb;
    document.getElementById('tot-tck').textContent = totalTck;
    document.getElementById('tot-int').textContent = totalInt;
    document.getElementById('team-ovr').textContent = avgOvr;
    document.getElementById('team-chem').textContent = chemPercentage;
    
    updateProgressBars(totalGls, totalAst, totalDrb, totalTck, totalInt);
}

function calculateChemistry(roster) {
    if (roster.length === 0) return 0;
    
    let chemPoints = 0;
    const clubCounts = {};
    const leagueCounts = {};
    const nationCounts = {};
    
    roster.forEach(p => {
        clubCounts[p.club] = (clubCounts[p.club] || 0) + 1;
        leagueCounts[p.league] = (leagueCounts[p.league] || 0) + 1;
        nationCounts[p.nat] = (nationCounts[p.nat] || 0) + 1;
    });
    
    Object.values(clubCounts).forEach(count => {
        if (count >= 2) chemPoints += (count - 1) * 3;
    });
    
    Object.values(leagueCounts).forEach(count => {
        if (count >= 3) chemPoints += (count - 2) * 2;
    });
    
    Object.values(nationCounts).forEach(count => {
        if (count >= 2) chemPoints += (count - 1) * 1;
    });
    
    return Math.min(chemPoints, 10);
}

function updateProgressBars(gls, ast, drb, tck, int) {
    const targets = {gls: 180, ast: 150, drb: 650, tck: 550, int: 500};
    
    document.getElementById('prog-gls').style.width = Math.min((gls / targets.gls) * 100, 100) + '%';
    document.getElementById('prog-ast').style.width = Math.min((ast / targets.ast) * 100, 100) + '%';
    document.getElementById('prog-drb').style.width = Math.min((drb / targets.drb) * 100, 100) + '%';
    document.getElementById('prog-tck').style.width = Math.min((tck / targets.tck) * 100, 100) + '%';
    document.getElementById('prog-int').style.width = Math.min((int / targets.int) * 100, 100) + '%';
}

// ============ PLAYER FILTERING & RENDERING ============
function filterByPool(players, pool) {
    if (pool === 'Global') return players;
    return players.filter(p => p.league === pool);
}

function filterByTeamAndEra(players) {
    return players.filter(p => 
        filterByPool(players, draftState.selectedPool).includes(p) &&
        (!draftState.currentTeam || p.club === draftState.currentTeam) &&
        (!draftState.currentEra || p.decade === draftState.currentEra)
    );
}

function renderPlayerList() {
    const container = document.getElementById('player-list-container');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedPos = document.querySelector('.pos-filter.active')?.dataset.pos || 'All';
    
    let filtered = filterByTeamAndEra(playersDB);
    
    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }
    
    if (selectedPos !== 'All') {
        filtered = filtered.filter(p => p.pos.includes(selectedPos));
    }
    
    const placed = draftState.roster.map(p => p.id);
    filtered = filtered.filter(p => !placed.includes(p.id));
    
    container.innerHTML = filtered.map(player => `
        <div class="player-card" onclick="selectPlayer(${player.id})">
            <div class="player-header">
                <h4 class="player-name">${player.name}</h4>
                <span class="player-ovr">${player.ovr}</span>
            </div>
            <div class="player-meta">
                <span class="badge-club">${player.club}</span>
                <span class="badge-pos">${player.pos[0]}</span>
            </div>
            <div class="player-stats-mini">
                <span>⚽ ${player.stats.gls}</span>
                <span>🎯 ${player.stats.ast}</span>
                <span>🏃 ${player.stats.drb}</span>
            </div>
        </div>
    `).join('');
}

// ============ SEASON SIMULATION ============
function showSimulateButton() {
    document.getElementById('simulate-container').classList.remove('hidden');
}

function simulateSeason() {
    const roster = draftState.roster;
    if (roster.length < 11) {
        alert('Complete your squad first!');
        return;
    }
    
    const results = performSeasonSimulation(roster);
    displaySeasonResults(results);
}

function performSeasonSimulation(roster) {
    const avgOvr = Math.round(roster.reduce((sum, p) => sum + p.ovr, 0) / roster.length);
    const wins = 38;
    const draws = 0;
    const losses = 0;
    
    let totalGls = 0, totalAst = 0;
    roster.forEach(p => {
        totalGls += p.stats.gls * 2;
        totalAst += p.stats.ast * 1.5;
    });
    
    const chemBonus = calculateChemistry(roster);
    totalGls = Math.round(totalGls * (1 + chemBonus / 100));
    totalAst = Math.round(totalAst * (1 + chemBonus / 100));
    
    return {
        record: `${wins} - ${draws} - ${losses}`,
        ovr: avgOvr,
        chem: Math.round(chemBonus),
        goals: totalGls,
        assists: totalAst,
        roster: roster
    };
}

function displaySeasonResults(results) {
    const modal = document.getElementById('result-modal');
    document.getElementById('result-record').textContent = results.record;
    document.getElementById('result-ovr').textContent = results.ovr;
    document.getElementById('result-chem').textContent = results.chem + '/100';
    
    modal.classList.remove('hidden');
    generatePunditAnalysis(results);
}

function generatePunditAnalysis(results) {
    const loading = document.getElementById('pundit-loading');
    const text = document.getElementById('pundit-text');
    
    setTimeout(() => {
        loading.classList.add('hidden');
        text.classList.remove('hidden');
        text.textContent = `An absolutely dominant season. The team showed exceptional cohesion with a ${results.chem}/100 chemistry rating. With an average OVR of ${results.ovr}, this squad proved unstoppable, scoring ${results.goals} goals while maintaining a fortress at the back. The invincible dream became reality.`;
    }, 2000);
}

// ============ EVENT LISTENERS & HELPERS ============
function attachEventListeners() {
    document.querySelectorAll('.pool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.pool-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            draftState.selectedPool = e.target.dataset.pool;
            renderPlayerList();
        });
    });
    
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');
            draftState.selectedMode = e.currentTarget.dataset.mode;
        });
    });
    
    document.querySelectorAll('.form-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.form-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            draftState.selectedFormation = e.target.dataset.form;
        });
    });
    
    document.querySelectorAll('.pos-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.pos-filter').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderPlayerList();
        });
    });
    
    document.getElementById('search-input').addEventListener('input', renderPlayerList);
}

function updateHeader() {
    document.getElementById('header-formation').textContent = draftState.selectedFormation;
    document.getElementById('header-pool').textContent = draftState.selectedPool;
    document.getElementById('header-mode').textContent = draftState.selectedMode;
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function saveDraft() {
    localStorage.setItem('draft_' + Date.now(), JSON.stringify(draftState));
    alert('Draft saved!');
}

function exportDraft() {
    const data = JSON.stringify({draftState, timestamp: new Date().toISOString()}, null, 2);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'draft_' + Date.now() + '.json';
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
            try {
                const data = JSON.parse(event.target.result);
                draftState = data.draftState;
                alert('Draft loaded!');
                location.reload();
            } catch (err) {
                alert('Error loading draft');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function submitLeaderboard() {
    alert('Leaderboard submission coming soon!');
}

function showLeaderboard() {
    const modal = document.getElementById('leaderboard-modal');
    modal.classList.remove('hidden');
    // Populate with mock data for now
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initGame);
