// AI Integration with Google Gemini

async function requestAIAnalysis(playerId, event) {
    event.stopPropagation();
    const player = playersDB.find(p => p.id === playerId);
    
    document.getElementById('ai-modal').style.display = 'flex';
    document.getElementById('ai-content').classList.add('hidden');
    document.getElementById('ai-loading').classList.remove('hidden');
    document.getElementById('ai-player-name').innerText = `${player.name} • ${player.club} (${player.decade})`;
    
    try {
        setTimeout(() => generateMockScoutReport(player), 1500);
    } catch (e) {
        generateMockScoutReport(player);
    }
}

function generateMockScoutReport(player) {
    document.getElementById('ai-loading').classList.add('hidden');
    document.getElementById('ai-content').classList.remove('hidden');
    
    const mainPos = player.pos[0];
    let verdict = '';
    let strength1 = '';
    let strength2 = '';
    
    if (['ST', 'CF', 'LW', 'RW'].includes(mainPos)) {
        strength1 = `${player.stats.gls} goals per season`;
        strength2 = `${player.stats.drb} dribbles`;
        verdict = `Elite finisher. Lethal in front of goal and capable of creating space through dribbling. Essential for a 38-0 run.`;
    } else if (['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(mainPos)) {
        strength1 = `${player.stats.ast} assists per season`;
        strength2 = `${player.stats.drb} dribbles`;
        verdict = `Midfield maestro. His vision dictates match tempo. Perfect for controlling possession.`;
    } else if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(mainPos)) {
        strength1 = `${player.stats.tck} tackles per season`;
        strength2 = `${player.stats.int} interceptions`;
        verdict = `Defensive rock. Nearly impossible to break down. The foundation for an undefeated season.`;
    } else {
        strength1 = 'Elite distribution';
        strength2 = `${player.stats.int} interceptions`;
        verdict = `Commands the backline. Shot-stopping and distribution initiate attacks.`;
    }
    
    document.getElementById('ai-content').innerHTML = `
        <div class="space-y-3">
            <p><span class="text-white font-bold">${player.name}</span> during his ${player.decade} peak was outstanding.</p>
            <div class="grid grid-cols-2 gap-2">
                <div class="bg-blue-900/10 p-2 rounded border border-blue-900/50">
                    <div class="text-[10px] text-blue-400 font-bold mb-1">Strength 1</div>
                    <div class="text-sm text-white">${strength1}</div>
                </div>
                <div class="bg-blue-900/10 p-2 rounded border border-blue-900/50">
                    <div class="text-[10px] text-blue-400 font-bold mb-1">Strength 2</div>
                    <div class="text-sm text-white">${strength2}</div>
                </div>
            </div>
            <p class="text-[#c9d1d9]">${verdict}</p>
            <div class="bg-emerald-900/10 p-3 rounded-lg border border-emerald-900/50">
                <span class="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Scout Verdict</span>
                <p class="text-emerald-300 font-medium mt-1 text-xs">High-value target for 38-0 consideration.</p>
            </div>
        </div>
    `;
}

async function generatePunditAnalysis(passed, weakestStat) {
    const punditLoading = document.getElementById('pundit-loading');
    const punditText = document.getElementById('pundit-text');
    
    setTimeout(() => {
        punditLoading.classList.add('hidden');
        punditText.classList.remove('hidden');
        
        let analysis = '';
        if (passed) {
            const verdicts = [
                `"Absolutely flawless." This squad is perfect. The chemistry is perfect. Greatest team ever assembled.`,
                `"A masterclass in team construction." Every player fits their role. Unquestionably 38-0 material.`,
                `"Invincible." There isn't a weakness to exploit. From defense to attack, every department is elite.`
            ];
            analysis = verdicts[Math.floor(Math.random() * verdicts.length)];
        } else {
            const statNames = {
                gls: 'Goalscoring',
                ast: 'Creativity',
                drb: 'Ball Progression',
                tck: 'Defense',
                int: 'Awareness'
            };
            
            const critiques = [
                `"Exposed." They lacked in ${statNames[weakestStat]}. Can't survive 38 games with that deficiency.`,
                `"Structurally flawed." The weakness in ${statNames[weakestStat]} ultimately proved undoing.`,
                `"Ambitious but incomplete." The lack of ${statNames[weakestStat]} cost them.`
            ];
            analysis = critiques[Math.floor(Math.random() * critiques.length)];
        }
        
        punditText.innerHTML = analysis;
    }, 2500);
}
