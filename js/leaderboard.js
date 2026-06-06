// Leaderboard Management

function showLeaderboard() {
    const leaderboard = loadLeaderboard();
    const content = document.getElementById('leaderboard-content');
    
    if (leaderboard.length === 0) {
        content.innerHTML = '<div class="text-center text-[#8b949e] py-8">No submissions yet. Be the first!</div>';
    } else {
        content.innerHTML = leaderboard.slice(0, 10).map((entry, index) => `
            <div class="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-[#161b22] flex items-center justify-center font-bold text-white">${index + 1}</div>
                        <div>
                            <div class="font-bold text-white">${entry.username || 'Anonymous'}</div>
                            <div class="text-[10px] text-[#8b949e]">${entry.formation} • ${entry.mode}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-black text-emerald-400 text-lg">${entry.ovr}</div>
                        <div class="text-[10px] text-[#8b949e]">OVR</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('leaderboard-modal').style.display = 'flex';
}

function loadLeaderboard() {
    return JSON.parse(localStorage.getItem('38-0-leaderboard') || '[]');
}

function submitLeaderboard() {
    const username = prompt('Enter your name (leave blank for Anonymous):', '');
    if (username === null) return;
    
    const entry = {
        username: username || 'Anonymous',
        formation: draftState.formation,
        pool: draftState.pool,
        mode: draftState.mode,
        ovr: parseInt(document.getElementById('result-ovr').innerText) || 85,
        chem: parseInt(document.getElementById('result-chem').innerText) || 50,
        record: document.getElementById('result-record').innerText,
        roster: draftState.roster.map(r => r.player.name),
        timestamp: new Date().toISOString()
    };
    
    let leaderboard = loadLeaderboard();
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.ovr - a.ovr);
    leaderboard = leaderboard.slice(0, 100);
    
    localStorage.setItem('38-0-leaderboard', JSON.stringify(leaderboard));
    
    showToast('✅ Team submitted to leaderboard!', 'success');
}
