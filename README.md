# ⚽ 38-0: Invincible

**Build the ultimate historical football team and achieve perfection.**

A viral browser-based football draft simulator where you assemble an 11-man squad from 250+ legendary players across different eras and attempt to win all 38 games undefeated.

## 🎮 Features

### Core Gameplay
- **Draft Mechanics**: Spin a wheel to get a random team + era, then pick players
- **Tactical Formations**: Choose from 4-3-3, 4-4-2, or 3-4-3 setups
- **Squad Building**: Interactive pitch with drag-and-drop player placement
- **Chemistry System**: Bonus stats for players from same club/nation/league (up to 10%)
- **Season Simulation**: See if your squad can go 38-0
- **250+ Players**: Extended database covering all major teams (00s, 10s, 20s)

### Game Modes
- **Classic**: All player stats and OVR visible
- **Football IQ**: Blind draft - stats hidden, rely on knowledge

### Draft Pools
- Global (all players)
- Premier League
- La Liga
- Serie A
- Bundesliga

### Teams Included
- Barcelona (00s, 10s)
- Real Madrid (00s, 10s)
- AC Milan (00s)
- Manchester City (20s)
- Liverpool (20s)
- Arsenal (00s)
- Napoli (20s)
- Manchester United (00s)
- Juventus (10s)
- Bayern Munich (10s)
- Chelsea (00s, 10s)
- Atlético Madrid (10s)
- AS Roma (00s)
- Tottenham (10s)
- Inter Milan

## 🚀 Getting Started

### Play Online
Visit: **[alexgorges004-wq.github.io/38-0-invincible](https://alexgorges004-wq.github.io/38-0-invincible)**

### Run Locally
```bash
git clone https://github.com/alexgorges004-wq/38-0-invincible.git
cd 38-0-invincible
# Open index.html in your browser
python -m http.server 8000  # or any local server
```

## 📊 Player Database

**250+ Legendary Players** from:
- All major European leagues (Premier League, La Liga, Serie A, Bundesliga)
- Multiple eras: 2000s, 2010s, 2020s
- Complete stats: Goals, Assists, Dribbles, Tackles, Interceptions
- OVR ratings from 80-99

### Squad Statistics

Your team is evaluated on:
- **Goals**: Target 180 (with chemistry boost)
- **Assists**: Target 150 (with chemistry boost)
- **Dribbles**: Target 650 (with chemistry boost)
- **Tackles**: Target 550 (with chemistry boost)
- **Interceptions**: Target 500 (with chemistry boost)

With **Chemistry Boost**: Up to 10% stat increase based on team cohesion

## 💾 Features

✅ **Local Storage**: Save and load draft history  
✅ **Export/Import**: Download your team as JSON or load a previous draft  
✅ **AI Pundit**: AI-generated commentary on season results  
✅ **Mobile Responsive**: Play on any device  
✅ **Leaderboard**: Submit and compare your teams (coming soon)  
✅ **Dark Theme**: Modern GitHub-inspired UI  
✅ **Real-time Stats**: Live squad evaluation as you draft  

## 🔧 Tech Stack

- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript
- **Icons**: Lucide Icons
- **Storage**: LocalStorage API
- **AI**: Google Gemini API (integration ready)
- **Hosting**: GitHub Pages (automatic via main branch)

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎮 How to Play

1. **Select Draft Pool**: Choose Global, Premier League, La Liga, Serie A, or Bundesliga
2. **Choose Game Mode**: Classic (visible stats) or Football IQ (blind)
3. **Pick Formation**: Select 4-3-3, 4-4-2, or 3-4-3 tactical setup
4. **Start Draft**: Press "Enter Draft" to begin
5. **Roll for Team/Era**: Spin the slot machine to get random team and decade
   - Use "Roll Team" (1 skip available)
   - Use "Roll Era" (1 skip available)
6. **Pick Players**: Browse and select 11 players from the filtered pool
   - Use search to find specific players
   - Filter by position (FW, MF, DF, GK)
7. **Place on Pitch**: Click positions to auto-place or drag players
   - Eligible positions highlight based on player skills
8. **Simulate Season**: After drafting, simulate your 38-game season
   - View final stats and chemistry rating
   - Get AI pundit analysis of your team

## 🤖 AI Features

- **Pundit Verdict**: Post-simulation AI commentary (mock implementation)
- **Scout Analysis**: Player historical context (ready for Gemini API)
- Framework ready for Google Gemini integration

## 💾 Save & Share

- **Auto-Save**: Drafts saved to browser localStorage (last 10 stored)
- **Export**: Download your team as JSON file
- **Import**: Load previously exported drafts
- **Share**: Generate unique shareable links (coming in v1.2)

## 🏆 Leaderboard

Features coming in v1.1:
- Top teams by Squad OVR
- Best Chemistry Scores
- Most Goals Generated
- Best Defensive Records

## 📊 Chemistry System

Chemistry bonus calculated on:
- **Club**: +3% per additional player from same club (max 2 players)
- **League**: +2% per additional player from same league (3+ players)
- **Nation**: +1% per additional player from same nation (2+ players)
- **Max Bonus**: 10%

Example: Barcelona 3-players + La Liga boost = 8% bonus

## 🐛 Known Issues & Roadmap

### v1.0 (✅ Complete)
- ✅ Core draft mechanics
- ✅ Pitch builder (4-3-3, 4-4-2, 3-4-3)
- ✅ Real-time stats calculation
- ✅ Mobile responsive UI
- ✅ 250+ player database
- ✅ Season simulation engine
- ✅ Chemistry system
- ✅ Save/Export functionality

### v1.1 (In Progress)
- 🔄 Real Gemini API integration for AI analysis
- 🔄 Firebase leaderboard with cloud sync
- 🔄 Social sharing (Twitter, Facebook)
- 🔄 Player comparison tool
- 🔄 Achievement system

### v1.2
- 🔄 Expanded player database (400+ players)
- 🔄 Historical match data integration
- 🔄 Career progression tracking
- 🔄 Tournament mode (knockout competitions)
- 🔄 Multiplayer drafts

## 📄 License

MIT License - feel free to fork and modify!

## 🙏 Credits

Inspired by the viral [82-0.com](https://82-0.com) NBA draft simulator.

Built with ❤️ by Alexg20049

---

## 🚀 Deployment to GitHub Pages

The project automatically deploys to GitHub Pages from the `main` branch.

**To view live:**
1. Go to Repository Settings → Pages
2. Select `main` branch as source
3. Site will be available at: `https://alexgorges004-wq.github.io/38-0-invincible`

**To test locally:**
```bash
git clone https://github.com/alexgorges004-wq/38-0-invincible.git
cd 38-0-invincible
python -m http.server 8000
# Visit http://localhost:8000
```

---

**Ready to build the invincible team? ⚽ [Play Now](https://alexgorges004-wq.github.io/38-0-invincible)**
