// Local Storage Management

function saveDraft() {
    const draft = {
        round: draftState.round,
        roster: draftState.roster,
        formation: draftState.formation,
        pool: draftState.pool,
        mode: draftState.mode,
        skipsTeam: draftState.skipsTeam,
        skipsEra: draftState.skipsEra,
        timestamp: new Date().toISOString()
    };
    
    let drafts = JSON.parse(localStorage.getItem('38-0-drafts') || '[]');
    drafts.unshift(draft);
    drafts = drafts.slice(0, 10);
    
    localStorage.setItem('38-0-drafts', JSON.stringify(drafts));
    showToast('✅ Draft saved successfully!', 'success');
}

function loadDraft() {
    const drafts = JSON.parse(localStorage.getItem('38-0-drafts') || '[]');
    
    if (drafts.length === 0) {
        showToast('No saved drafts found', 'info');
        return;
    }
    
    const draftList = drafts.map((d, i) => {
        const date = new Date(d.timestamp).toLocaleString();
        return `${i + 1}. Round ${d.round}/11 - ${d.formation} - ${date}`;
    }).join('\n');
    
    const choice = prompt('Select draft to load (1-' + drafts.length + '):\n\n' + draftList, '1');
    
    if (choice && choice > 0 && choice <= drafts.length) {
        const draft = drafts[parseInt(choice) - 1];
        Object.assign(draftState, draft);
        
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-ui').classList.remove('hidden');
        
        document.getElementById('header-formation').innerText = draftState.formation;
        document.getElementById('header-pool').innerText = draftState.pool;
        document.getElementById('header-mode').innerText = draftState.mode;
        document.getElementById('round-counter').innerText = draftState.round;
        
        renderPitch();
        updateStats();
        renderPlayerList();
        
        showToast('✅ Draft loaded!', 'success');
    }
}

function exportDraft() {
    const exportData = {
        round: draftState.round,
        roster: draftState.roster.map(r => ({\n            name: r.player.name,
            position: r.player.pos[0],
            club: r.player.club,
            ovr: r.player.ovr
        })),
        formation: draftState.formation,
        pool: draftState.pool,
        mode: draftState.mode,
        stats: {
            ovr: document.getElementById('team-ovr').innerText,
            chem: document.getElementById('team-chem').innerText,
            gls: document.getElementById('tot-gls').innerText,
            ast: document.getElementById('tot-ast').innerText
        },
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `38-0-draft-${new Date().getTime()}.json`;
    link.click();
    
    showToast('📥 Draft exported!', 'success');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-lg font-semibold z-[1000] transition-all duration-300 ${type === 'success' ? 'bg-emerald-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
