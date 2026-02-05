# CLAUDE.md - Snoot Booper: Wuxia Development Guide

## Project Overview

**Game:** Snoot Booper: Idle Wuxia Cat Sanctuary
**Genre:** 8-bit AFK Idle/Clicker with Wuxia/Cultivation Theme
**Platform:** Web (Discord-shareable for the boys)
**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (or React if complexity grows)
**Vibe:** Cute cats, martial arts mysticism, waifu masters, BOOP THE SNOOTS
**Inspiration:** Age of Wushu, classic Wuxia novels, Cookie Clicker, cat memes

---

## The Seven Wandering Masters

These are the main characters — the Discord friends who form the **Celestial Snoot Sect**:

| Master | Title | Playstyle | Special Ability |
|--------|-------|-----------|-----------------|
| **Gerald** | Sect Leader, Jade Palm | Balanced cultivation | Tranquil Boop - meditation bonus |
| **Rusty** | War General, Crimson Fist | Aggressive, high crit | Thousand Boop Barrage |
| **Steve** | Strategist, Flowing River | AFK optimization | Eternal Flow - 2x offline PP |
| **Andrew** | Scout, Thunder Step | Speed runs, events | Lightning Reflexes - first to find |
| **Nik** | Assassin, Shadow Moon | Critical precision | Phantom Boop - 50% crit chance |
| **Yuelin** | Healer, Lotus Sage | Happiness, bonds | Harmonious Aura - +50% happiness |
| **Scott** | Guardian, The Mountain | Stacking multipliers | Unshakeable Foundation - no decay |

Each master should have:
- Unique pixel portrait (32x32 or 64x64)
- Character select at game start
- Passive ability that affects gameplay
- Dialogue lines that reflect their personality
- Stats page showing their cultivation progress

---

## Development Philosophy

### The Three Sacred Laws of Snoot Booper
1. **Every snoot must be boopable** - If it has a snoot, it can be booped
2. **Cats are never wrong** - Game balance serves cat happiness
3. **The Sect comes first** - Features should be fun for the friend group

### Wuxia Design Principles
- "Cultivation" = Progression (leveling, upgrading)
- "Qi" = Energy/Currency
- "Jianghu" = The game world
- "Sect" = Your save file/sanctuary
- "Realm" = Rarity tier

### Code Mantras
- "Is this boopable?" - Ask before adding any feature
- "Would the Seven Masters approve?" - Is it fun for the group?
- "Does it feel like Wuxia?" - Maintain thematic consistency

---

## Architecture Overview

```
snoot-booper/
├── index.html              # Main game entry
├── css/
│   ├── main.css            # Core styles
│   ├── wuxia-theme.css     # Chinese aesthetic, scrolls, jade
│   ├── 8bit.css            # Pixel art utilities
│   └── animations.css      # Qi effects, boops, cultivation
├── js/
│   ├── game.js             # Main game loop
│   ├── masters.js          # The Seven Masters system
│   ├── cats.js             # Cat collection & cultivation
│   ├── waifus.js           # Waifu master system & bonding
│   ├── resources.js        # BP, PP, Jade Catnip
│   ├── cultivation.js      # Upgrade/technique trees
│   ├── idle.js             # AFK calculations
│   ├── save.js             # LocalStorage + cloud sync
│   ├── events.js           # Jianghu random events
│   ├── sectwar.js          # Competitive features
│   └── ui.js               # DOM manipulation
├── assets/
│   ├── sprites/
│   │   ├── masters/        # Gerald, Rusty, Steve, etc.
│   │   ├── cats/           # All cat sprites by realm
│   │   ├── waifus/         # Six Immortal Masters
│   │   └── effects/        # Qi, boops, cultivation FX
│   ├── audio/
│   │   ├── music/          # Chiptune + Chinese instruments
│   │   └── sfx/            # Boops, mrrps, gongs
│   ├── backgrounds/        # Sect buildings, mountains
│   └── fonts/              # Pixel fonts, brush fonts
├── data/
│   ├── masters.json        # Seven Masters definitions
│   ├── cats.json           # Cat collection data
│   ├── waifus.json         # Waifu stats & dialogue
│   ├── techniques.json     # Cultivation upgrades
│   └── events.json         # Random event definitions
├── PROMPT.md               # Game design document
├── CLAUDE.md               # This file
└── README.md               # Setup instructions
```

---

## Core Systems Implementation

### 1. The Seven Masters System

```javascript
// masters.js - Character selection and bonuses
const MASTERS = {
  gerald: {
    id: 'gerald',
    name: 'Gerald',
    title: 'The Jade Palm',
    role: 'Sect Leader',
    description: 'Founder of the Celestial Snoot Sect',
    passive: {
      name: 'Tranquil Boop',
      description: 'Boops during meditation generate +25% BP',
      effect: (gameState) => {
        if (gameState.isMeditating) {
          return { bpMultiplier: 1.25 };
        }
        return {};
      }
    },
    sprite: 'masters/gerald.png',
    color: '#50C878', // Jade green
    quotes: [
      "Balance in all things. Especially snoots.",
      "The Sect grows stronger with each boop.",
      "I see potential in you, young cultivator."
    ]
  },
  
  rusty: {
    id: 'rusty',
    name: 'Rusty',
    title: 'The Crimson Fist',
    role: 'War General',
    description: 'Former bandit king, reformed cat lover',
    passive: {
      name: 'Thousand Boop Barrage',
      description: 'Active ability: 10 seconds of rapid boops (5 min cooldown)',
      effect: (gameState) => {
        return { 
          activeAbility: true,
          duration: 10000,
          cooldown: 300000,
          boopSpeedMultiplier: 5
        };
      }
    },
    sprite: 'masters/rusty.png',
    color: '#DC143C', // Crimson
    quotes: [
      "When in doubt, boop harder!",
      "These paws were made for booping!",
      "THOUSAND BOOP BARRAGE!"
    ]
  },
  
  steve: {
    id: 'steve',
    name: 'Steve',
    title: 'The Flowing River',
    role: 'Strategist',
    description: 'Calculated the optimal snoot-to-boop ratio',
    passive: {
      name: 'Eternal Flow',
      description: 'Offline PP generation is doubled',
      effect: (gameState) => {
        return { afkMultiplier: 2.0 };
      }
    },
    sprite: 'masters/steve.png',
    color: '#4169E1', // Royal blue
    quotes: [
      "Patience yields the greatest gains.",
      "The math is clear: more cats = more PP.",
      "I've optimized our cultivation schedule."
    ]
  },
  
  andrew: {
    id: 'andrew',
    name: 'Andrew',
    title: 'The Thunder Step',
    role: 'Scout',
    description: 'Fastest courier in the Jianghu',
    passive: {
      name: 'Lightning Reflexes',
      description: '+50% chance to discover events and rare cats first',
      effect: (gameState) => {
        return { 
          eventDiscoveryBonus: 1.5,
          rareCatBonus: 1.5 
        };
      }
    },
    sprite: 'masters/andrew.png',
    color: '#FFD700', // Gold/lightning
    quotes: [
      "Already found three cats while you were reading this.",
      "Speed is the essence of cultivation!",
      "New event spotted! Follow me!"
    ]
  },
  
  nik: {
    id: 'nik',
    name: 'Nik',
    title: 'The Shadow Moon',
    role: 'Assassin',
    description: 'Mysterious. The cats trust him. No one knows why.',
    passive: {
      name: 'Phantom Boop',
      description: '+50% critical boop chance',
      effect: (gameState) => {
        return { critChanceBonus: 0.5 };
      }
    },
    sprite: 'masters/nik.png',
    color: '#483D8B', // Dark slate blue
    quotes: [
      "...",
      "*appears from shadows* ...boop.",
      "The night is full of snoots."
    ]
  },
  
  yuelin: {
    id: 'yuelin',
    name: 'Yuelin',
    title: 'The Lotus Sage',
    role: 'Healer',
    description: 'Speaks to cats in their ancient tongue',
    passive: {
      name: 'Harmonious Aura',
      description: 'All cats gain +50% happiness',
      effect: (gameState) => {
        return { catHappinessMultiplier: 1.5 };
      }
    },
    sprite: 'masters/yuelin.png',
    color: '#FFB6C1', // Light pink (lotus)
    quotes: [
      "The cats tell me you have a kind heart.",
      "Harmony brings the greatest power.",
      "Each cat carries ancient wisdom."
    ]
  },
  
  scott: {
    id: 'scott',
    name: 'Scott',
    title: 'The Mountain',
    role: 'Guardian',
    description: 'Meditated for 1000 days. A cat sat on him the whole time.',
    passive: {
      name: 'Unshakeable Foundation',
      description: 'Multiplier bonuses never decay or reset',
      effect: (gameState) => {
        return { preventDecay: true };
      }
    },
    sprite: 'masters/scott.png',
    color: '#8B4513', // Saddle brown (mountain)
    quotes: [
      "I am the mountain. The cats are my snow.",
      "Patience. Stability. Snoots.",
      "...I haven't moved in three days. Worth it."
    ]
  }
};

class MasterSystem {
  constructor() {
    this.selectedMaster = null;
    this.allMasters = MASTERS;
  }
  
  selectMaster(masterId) {
    this.selectedMaster = this.allMasters[masterId];
    this.applyPassive();
    return this.selectedMaster;
  }
  
  applyPassive() {
    // Apply the selected master's passive to game state
    const effects = this.selectedMaster.passive.effect(gameState);
    Object.assign(gameState.modifiers, effects);
  }
  
  getRandomQuote() {
    const quotes = this.selectedMaster.quotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}
```

### 2. The Sacred Boop System (Wuxia Enhanced)

```javascript
// The heart of the game - now with Qi effects
class BoopSystem {
  constructor() {
    this.boopCount = 0;
    this.boopPower = 1;
    this.critChance = 0.05;
    this.critMultiplier = 10;
    this.comboCount = 0;
    this.comboTimer = null;
  }

  boop(cat, master) {
    // Calculate base boop with master bonus
    let isCrit = Math.random() < (this.critChance + (master.passive.critChanceBonus || 0));
    let bp = this.boopPower;
    
    // Combo system (Wuxia chain attacks)
    this.comboCount++;
    clearTimeout(this.comboTimer);
    this.comboTimer = setTimeout(() => this.comboCount = 0, 2000);
    
    // Combo multiplier
    const comboBonus = 1 + (Math.min(this.comboCount, 100) * 0.01);
    bp *= comboBonus;
    
    // Critical boop
    if (isCrit) {
      bp *= this.critMultiplier;
    }
    
    // JUICE IT UP - Wuxia style
    this.playBoopSound(isCrit);
    this.showQiParticles(cat, isCrit);
    this.showCultivationText(bp, isCrit, this.comboCount);
    this.wiggleCat(cat);
    
    return { bp, isCrit, combo: this.comboCount };
  }
  
  showCultivationText(bp, isCrit, combo) {
    const messages = isCrit ? 
      ['CRITICAL MERIDIAN STRIKE!', 'QI EXPLOSION!', 'HEAVEN-SPLITTING BOOP!'] :
      [`+${formatNumber(bp)} Qi`, 'Snoot cultivated!', 'Boop successful!'];
    
    if (combo >= 50) {
      messages.push(`${combo} HIT COMBO!`);
    }
    
    // Display floating text with Wuxia flair
    this.displayFloatingText(messages[Math.floor(Math.random() * messages.length)]);
  }
}
```

### 3. Cat Cultivation System

```javascript
// cats.json structure - Age of Wushu inspired
{
  "cats": [
    {
      "id": "shaolin_tabby",
      "name": "Shaolin Tabby",
      "school": "shaolin",
      "realm": "mortal",
      "description": "A disciplined cat who practices the ways of the temple.",
      "stats": {
        "snootMeridians": 1.0,
        "innerPurr": 1.0,
        "floofArmor": 1.2,
        "zoomieSteps": 0.8,
        "loafMastery": 1.1
      },
      "sprite": "cats/shaolin_tabby.png",
      "quotes": [
        "Mrrp. (Translation: Balance in all things.)",
        "*meditates intensely*"
      ]
    },
    {
      "id": "wudang_persian",
      "name": "Wudang Persian",
      "school": "wudang",
      "realm": "earth",
      "description": "Graceful and flowing, this cat has mastered inner peace.",
      "stats": {
        "snootMeridians": 1.2,
        "innerPurr": 1.5,
        "floofArmor": 0.9,
        "zoomieSteps": 1.3,
        "loafMastery": 1.4
      },
      "sprite": "cats/wudang_persian.png"
    },
    {
      "id": "ceiling_god",
      "name": "Ceiling Cat, the All-Seeing",
      "school": "divine",
      "realm": "divine",
      "description": "Watches from the heavens. Grants vision of all snoots.",
      "stats": {
        "snootMeridians": 5.0,
        "innerPurr": 10.0,
        "floofArmor": 5.0,
        "zoomieSteps": 3.0,
        "loafMastery": 8.0
      },
      "sprite": "cats/ceiling_god.png",
      "legendary": true,
      "unlockedBy": "Complete the 'Eyes of Heaven' achievement"
    }
  ],
  
  "schools": {
    "shaolin": { "bonus": "stability", "color": "#FF8C00" },
    "wudang": { "bonus": "grace", "color": "#4682B4" },
    "emei": { "bonus": "beauty", "color": "#FF69B4" },
    "beggar": { "bonus": "resourcefulness", "color": "#8B4513" },
    "scholar": { "bonus": "wisdom", "color": "#9370DB" },
    "royal_guard": { "bonus": "loyalty", "color": "#FFD700" },
    "wanderer": { "bonus": "mystery", "color": "#708090" },
    "divine": { "bonus": "transcendence", "color": "#FFFFFF" }
  },
  
  "realms": {
    "mortal": { "dropRate": 0.60, "ppMultiplier": 1 },
    "earth": { "dropRate": 0.25, "ppMultiplier": 2 },
    "sky": { "dropRate": 0.10, "ppMultiplier": 5 },
    "heaven": { "dropRate": 0.04, "ppMultiplier": 15 },
    "divine": { "dropRate": 0.01, "ppMultiplier": 50 }
  }
}
```

### 4. Waifu Master System

```javascript
// waifus.json - The Six Immortal Masters
{
  "waifus": [
    {
      "id": "mochi",
      "name": "Mochi-chan",
      "title": "The Welcoming Dawn",
      "role": "Innkeeper of the Celestial Teahouse",
      "cultivationStyle": "Hospitality Arts",
      "bonus": {
        "type": "bpMultiplier",
        "value": 1.10,
        "description": "+10% BP from all boops"
      },
      "unlockCondition": "starter",
      "maxBondReward": "cat:lucky_teacup",
      "giftAffinities": {
        "loves": ["rare_tea", "jade_cup", "silk_ribbon"],
        "likes": ["yarn_ball", "fish_treats"],
        "neutral": ["catnip", "bells"],
        "dislikes": ["loud_toys", "spicy_food"]
      },
      "dialogues": {
        "greeting": [
          "Welcome back to the teahouse, cultivator~",
          "The cats have been waiting for you, nya~"
        ],
        "lowBond": [
          "Every guest is a friend. Every snoot, a blessing.",
          "Would you like some tea while you cultivate?"
        ],
        "midBond": [
          "Your dedication to the sect is admirable!",
          "The cats speak highly of your booping technique~"
        ],
        "highBond": [
          "You've become like family to us all.",
          "I... I made this tea specially for you. *blush*"
        ],
        "maxBond": [
          "With you by my side, our teahouse will flourish forever.",
          "You are the greatest cultivator I have ever known, nya~"
        ]
      },
      "sprite": "waifus/mochi.png",
      "color": "#FFB7C5"
    },
    {
      "id": "luna",
      "name": "Luna Whiskerbell",
      "title": "The Midnight Watcher",
      "role": "Night Cultivation Instructor",
      "cultivationStyle": "Yin Energy Arts",
      "bonus": {
        "type": "afkMultiplier",
        "value": 1.50,
        "description": "+50% offline gains"
      },
      "unlockCondition": { "type": "afkTime", "value": 86400 },
      "maxBondReward": "cat:moonlight_siamese",
      "dialogues": {
        "greeting": [
          "*yawn* Oh... you're here... good...",
          "The night shift... is peaceful..."
        ],
        "lowBond": [
          "While others sleep... we cultivate... *yawn*",
          "The moon... watches over our snoots..."
        ],
        "highBond": [
          "I feel... most awake... when you're here...",
          "Stay with me... through the night...? *sleepy smile*"
        ]
      },
      "sprite": "waifus/luna.png",
      "color": "#C4A7E7"
    },
    {
      "id": "nyanta",
      "name": "Captain Nyanta",
      "title": "The Sea Sovereign",
      "role": "Expedition Leader",
      "cultivationStyle": "Adventure Arts",
      "bonus": {
        "type": "expeditionUnlock",
        "value": true,
        "description": "Unlocks rare cat expeditions"
      },
      "unlockCondition": { "type": "catCount", "value": 50 },
      "maxBondReward": "cat:kraken_kitty",
      "dialogues": {
        "greeting": [
          "YARR! Welcome aboard, matey!",
          "The seas be calm and full of snoots today!"
        ],
        "lowBond": [
          "The greatest snoots lie beyond the horizon!",
          "Adventure awaits! Set sail for boops!"
        ],
        "highBond": [
          "Ye be the finest first mate a captain could ask for!",
          "Together we'll find the legendary treasures of the Jianghu!"
        ]
      },
      "sprite": "waifus/nyanta.png",
      "color": "#8B0000"
    }
  ]
}
```

### 5. Idle/AFK Cultivation Calculations

```javascript
// idle.js - The way of the patient cultivator
const MAX_AFK_TIME = 24 * 60 * 60 * 1000; // 24 hours

function calculateAFKGains(lastSaveTime, master, cats, waifus, upgrades, gooseAlly) {
  const now = Date.now();
  const elapsed = Math.min(now - lastSaveTime, MAX_AFK_TIME);
  const seconds = elapsed / 1000;
  
  // Base PP from all cats
  let basePP = cats.reduce((sum, cat) => {
    const realmMultiplier = REALMS[cat.realm].ppMultiplier;
    return sum + (cat.stats.innerPurr * cat.happiness * cat.stats.loafMastery * realmMultiplier);
  }, 0);
  
  // Master bonus (Steve's Eternal Flow doubles this)
  const masterMultiplier = master.passive.afkMultiplier || 1.0;
  
  // Waifu bonuses (Luna Whiskerbell adds +50%)
  const waifuMultiplier = waifus.reduce((mult, waifu) => {
    if (waifu.bonus.type === 'afkMultiplier') {
      return mult * waifu.bonus.value;
    }
    return mult;
  }, 1.0);
  
  // Goose Ally bonus (Honk Goose intimidates cats into working harder)
  const gooseMultiplier = gooseAlly?.type === 'honk' ? 1.25 : 1.0;
  
  // Upgrade bonuses
  const upgradeMultiplier = getUpgradeMultiplier('afk_efficiency', upgrades);
  
  // Calculate total PP
  const totalPP = basePP * seconds * masterMultiplier * waifuMultiplier * gooseMultiplier * upgradeMultiplier;
  
  // Generate AFK events (Chaos Goose doubles event frequency)
  const eventMultiplier = gooseAlly?.type === 'chaos' ? 2.0 : 1.0;
  const events = generateAFKEvents(elapsed, master, cats, eventMultiplier);
  
  // Guard Goose protects from theft events
  if (gooseAlly?.type === 'guard') {
    events = events.filter(e => e.type !== 'theft');
  }
  
  return {
    pp: totalPP,
    timeAway: elapsed,
    events: events,
    summary: generateReturnSummary(totalPP, events, master)
  };
}
```

### 6. The Way of the Goose System 🦢

```javascript
// goose.js - HONK
// "Peace was never an option."

const GOOSE_MOODS = {
  calm: { speed: 1, dodgeChance: 0.1, rewardMult: 10 },
  suspicious: { speed: 2, dodgeChance: 0.3, rewardMult: 25 },
  aggressive: { speed: 3, dodgeChance: 0.5, rewardMult: 50 },
  rage: { speed: 5, dodgeChance: 0.7, rewardMult: 100 }
};

const LEGENDARY_GEESE = {
  untitled: {
    id: 'untitled',
    name: 'The Untitled Goose',
    title: 'Horrible',
    description: "It's a lovely day in the Jianghu, and you are a horrible goose.",
    baseMood: 'aggressive',
    special: 'steals_items',
    drops: ['stolen_treasure', 'chaos_energy'],
    sprite: 'geese/untitled.png',
    honkSound: 'honk_menacing.mp3'
  },
  elder: {
    id: 'elder',
    name: 'Goose Elder',
    title: 'The Honking Sage',
    description: 'His honk shattered a mountain. His waddle toppled an empire.',
    baseMood: 'calm',
    special: 'wisdom_test',
    drops: ['elder_feather', 'wisdom_of_honk'],
    sprite: 'geese/elder.png',
    honkSound: 'honk_ancient.mp3'
  },
  golden: {
    id: 'golden',
    name: 'The Golden Goose',
    title: 'Fortune Incarnate',
    description: 'Legends say its feathers are made of pure Jade Catnip.',
    baseMood: 'suspicious',
    special: 'extreme_speed',
    drops: ['golden_feather', 'lucky_egg'],
    rarity: 0.01, // 1% of goose spawns
    sprite: 'geese/golden.png',
    honkSound: 'honk_magical.mp3'
  },
  cobraChicken: {
    id: 'cobraChicken',
    name: 'Cobra Chicken',
    title: 'Avatar of Chaos',
    description: 'Not a cobra. Not a chicken. Somehow worse than both.',
    baseMood: 'rage',
    special: 'final_boss',
    drops: ['chaos_feather', 'goose_ally_unlock'],
    unlockCondition: { gooseBoops: 1000 },
    sprite: 'geese/cobra_chicken.png',
    honkSound: 'honk_eldritch.mp3'
  }
};

const GOOSE_ALLIES = {
  guard: {
    id: 'guard',
    name: 'Guard Goose',
    description: 'Protects your AFK gains from random theft events',
    effect: { preventTheft: true },
    quote: "HONK! (Translation: None shall pass!)"
  },
  attack: {
    id: 'attack', 
    name: 'Attack Goose',
    description: '+25% damage to all boops',
    effect: { boopDamageBonus: 1.25 },
    quote: "HONK! (Translation: Violence is always the answer.)"
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos Goose',
    description: 'Random events happen 2x more often (good AND bad)',
    effect: { eventFrequencyMult: 2.0 },
    quote: "HONK! (Translation: Let's make things interesting.)"
  },
  honk: {
    id: 'honk',
    name: 'Honk Goose', 
    description: 'Intimidates cats into working harder (+25% PP)',
    effect: { ppGenerationBonus: 1.25 },
    quote: "HONK! (Translation: WORK HARDER, FELINES.)"
  }
};

class GooseSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.activeGoose = null;
    this.gooseTimer = null;
    this.spawnChance = 0.02; // 2% per minute
    this.timeLimit = 30000; // 30 seconds to boop
  }
  
  startGooseSpawnTimer() {
    setInterval(() => {
      if (!this.activeGoose && Math.random() < this.spawnChance) {
        this.spawnGoose();
      }
    }, 60000); // Check every minute
  }
  
  spawnGoose() {
    // Check for legendary goose spawns
    let goose;
    
    // Cobra Chicken only after 1000 boops
    if (this.gameState.gooseBoops >= 1000 && 
        !this.gameState.cobraChickenDefeated &&
        Math.random() < 0.05) {
      goose = this.createGoose(LEGENDARY_GEESE.cobraChicken);
    }
    // Golden Goose is very rare
    else if (Math.random() < 0.01) {
      goose = this.createGoose(LEGENDARY_GEESE.golden);
    }
    // Other legendaries
    else if (Math.random() < 0.1) {
      const legendaries = [LEGENDARY_GEESE.untitled, LEGENDARY_GEESE.elder];
      goose = this.createGoose(legendaries[Math.floor(Math.random() * legendaries.length)]);
    }
    // Normal goose
    else {
      goose = this.createNormalGoose();
    }
    
    this.activeGoose = goose;
    this.onGooseAppear(goose);
    
    // Start countdown
    this.gooseTimer = setTimeout(() => {
      this.onGooseEscape(goose);
    }, this.timeLimit);
  }
  
  createGoose(template) {
    const mood = template.baseMood || this.rollRandomMood();
    return {
      ...template,
      mood: mood,
      moodStats: GOOSE_MOODS[mood],
      position: { x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 },
      hp: template.special === 'final_boss' ? 10 : 1 // Cobra Chicken needs multiple boops
    };
  }
  
  createNormalGoose() {
    const mood = this.rollRandomMood();
    return {
      id: 'normal_' + Date.now(),
      name: 'Wild Goose',
      title: 'Wandering Terror',
      description: 'A goose has appeared! Boop its snoot before it escapes!',
      mood: mood,
      moodStats: GOOSE_MOODS[mood],
      position: { x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 },
      drops: ['goose_feather'],
      hp: 1
    };
  }
  
  rollRandomMood() {
    const roll = Math.random();
    if (roll < 0.4) return 'calm';
    if (roll < 0.7) return 'suspicious';
    if (roll < 0.9) return 'aggressive';
    return 'rage';
  }
  
  onGooseAppear(goose) {
    // HONK!
    this.playHonk(goose);
    this.shakeScreen();
    this.scatterCats(goose);
    this.showGooseUI(goose);
    
    console.log(`🦢 ${goose.name} has appeared! Mood: ${goose.mood.toUpperCase()}`);
  }
  
  attemptBoop(clickPosition) {
    if (!this.activeGoose) return null;
    
    const goose = this.activeGoose;
    const distance = this.calculateDistance(clickPosition, goose.position);
    const hitbox = 15; // Base hitbox size
    
    // Check for dodge
    if (Math.random() < goose.moodStats.dodgeChance) {
      this.gooseDodge(goose);
      this.playHonk(goose, 'dodge');
      return { hit: false, dodged: true };
    }
    
    // Check for hit
    if (distance < hitbox) {
      goose.hp--;
      
      if (goose.hp <= 0) {
        return this.onGooseBooped(goose);
      } else {
        // Multi-hit boss (Cobra Chicken)
        this.playHonk(goose, 'angry');
        return { hit: true, defeated: false, hpRemaining: goose.hp };
      }
    }
    
    return { hit: false, dodged: false };
  }
  
  onGooseBooped(goose) {
    clearTimeout(this.gooseTimer);
    
    // Calculate rewards
    const baseReward = 1000;
    const moodMultiplier = goose.moodStats.rewardMult;
    const isCrit = Math.random() < (0.1 + (this.gameState.master.passive.critChanceBonus || 0));
    const critMultiplier = isCrit ? 5 : 1;
    
    const bpReward = baseReward * moodMultiplier * critMultiplier;
    
    // Attack Goose bonus
    const attackBonus = this.gameState.gooseAlly?.type === 'attack' ? 1.25 : 1;
    const finalReward = bpReward * attackBonus;
    
    // Generate drops
    const drops = this.generateDrops(goose, isCrit);
    
    // Special handling for Cobra Chicken
    if (goose.id === 'cobraChicken') {
      this.gameState.cobraChickenDefeated = true;
      this.unlockGooseAllySystem();
    }
    
    // Check for brave cats
    this.checkBraveHearts();
    
    // Update stats
    this.gameState.gooseBoops++;
    if (isCrit) this.gameState.gooseCriticals++;
    
    // Celebration!
    this.showVictoryScreen(goose, finalReward, drops, isCrit);
    this.activeGoose = null;
    
    return {
      hit: true,
      defeated: true,
      reward: finalReward,
      drops: drops,
      critical: isCrit,
      message: isCrit ? 'CRITICAL HONK DESTRUCTION!' : 'Snoot booped successfully!'
    };
  }
  
  onGooseEscape(goose) {
    // Untitled Goose steals items!
    if (goose.special === 'steals_items') {
      const stolenAmount = Math.floor(this.gameState.boopPoints * 0.05);
      this.gameState.boopPoints -= stolenAmount;
      this.showMessage(`The Untitled Goose stole ${formatNumber(stolenAmount)} BP!`);
    }
    
    this.playHonk(goose, 'escape');
    this.showEscapeAnimation(goose);
    this.activeGoose = null;
    
    console.log(`🦢 ${goose.name} escaped! HONK!`);
  }
  
  gooseDodge(goose) {
    // Move to new position
    goose.position = {
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20
    };
    this.animateDodge(goose);
  }
  
  scatterCats(goose) {
    // Cats become temporarily unhappy/scared
    this.gameState.cats.forEach(cat => {
      // Ceiling Cat is immune
      if (cat.id === 'ceiling_god') return;
      
      // High courage cats might stand their ground
      const courage = cat.stats.courage || 0.1;
      if (Math.random() > courage) {
        cat.temporaryFear = true;
        cat.happiness *= 0.8;
      } else {
        // This cat is BRAVE
        cat.facedGoose = true;
      }
    });
  }
  
  checkBraveHearts() {
    // Cats that faced the goose get permanent buff
    this.gameState.cats.forEach(cat => {
      if (cat.facedGoose && !cat.braveHeart) {
        cat.braveHeart = true;
        cat.stats.courage = 1.0; // Max courage now
        cat.stats.floofArmor *= 1.2; // Bonus stats
        this.showMessage(`${cat.name} earned the Brave Heart buff!`);
      }
      cat.facedGoose = false;
      cat.temporaryFear = false;
    });
  }
  
  generateDrops(goose, isCrit) {
    const drops = [...goose.drops];
    
    if (isCrit) {
      drops.push('legendary_goose_feather');
    }
    
    if (goose.id === 'golden') {
      drops.push('golden_feather');
      this.gameState.goldenFeathers++;
    }
    
    return drops;
  }
  
  unlockGooseAllySystem() {
    this.showMessage('🦢 COBRA CHICKEN DEFEATED! You can now recruit a Goose Ally!');
    this.gameState.gooseAllyUnlocked = true;
  }
  
  selectGooseAlly(allyType) {
    if (!this.gameState.gooseAllyUnlocked) return false;
    
    const ally = GOOSE_ALLIES[allyType];
    this.gameState.gooseAlly = ally;
    this.applyGooseAllyEffects(ally);
    
    return ally;
  }
  
  applyGooseAllyEffects(ally) {
    Object.assign(this.gameState.modifiers, ally.effect);
  }
  
  // Audio & Visual methods (implement based on your setup)
  playHonk(goose, type = 'normal') { /* ... */ }
  shakeScreen() { /* ... */ }
  showGooseUI(goose) { /* ... */ }
  animateDodge(goose) { /* ... */ }
  showVictoryScreen(goose, reward, drops, isCrit) { /* ... */ }
  showEscapeAnimation(goose) { /* ... */ }
  showMessage(msg) { /* ... */ }
  calculateDistance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
}

// Goose-related achievements
const GOOSE_ACHIEVEMENTS = [
  { id: 'first_honk', name: 'Honk.', desc: 'Boop your first Goose', condition: g => g.gooseBoops >= 1 },
  { id: 'peace_never', name: 'Peace Was Never An Option', desc: 'Boop 100 Geese', condition: g => g.gooseBoops >= 100 },
  { id: 'negotiator', name: 'The Negotiator', desc: 'Boop a RAGE mode Goose', condition: g => g.rageGooseBooped },
  { id: 'cobra_slayer', name: 'Cobra Chicken Slayer', desc: 'Defeat the Avatar of Chaos', condition: g => g.cobraChickenDefeated },
  { id: 'goose_whisperer', name: 'Goose Whisperer', desc: 'Recruit your first Goose Ally', condition: g => g.gooseAlly != null },
  { id: 'chaotic_neutral', name: 'Chaotic Neutral', desc: 'Have a Goose Ally and 50 cats', condition: g => g.gooseAlly && g.cats.length >= 50 },
  { id: 'hjönk', name: 'HJÖNK', desc: 'Critical boop a Golden Goose', condition: g => g.goldenGooseCrit }
];
```

function generateAFKEvents(elapsed, master, cats) {
  const events = [];
  const hours = elapsed / (1000 * 60 * 60);
  
  // Event chances per hour
  const eventChance = 0.3 + (master.passive.eventDiscoveryBonus || 0);
  
  for (let i = 0; i < Math.floor(hours); i++) {
    if (Math.random() < eventChance) {
      events.push(pickRandomEvent());
    }
  }
  
  // Chance for stray cat (Andrew's bonus helps)
  const strayCatChance = 0.05 * hours * (master.passive.rareCatBonus || 1);
  if (Math.random() < strayCatChance) {
    events.push({
      type: 'stray_cat',
      message: 'A wandering cat has joined your sect!',
      reward: generateRandomCat()
    });
  }
  
  return events;
}

function generateReturnSummary(pp, events, master) {
  return {
    title: `Welcome back, ${master.name}!`,
    subtitle: master.title,
    quote: getRandomQuote(master),
    ppGained: pp,
    eventCount: events.length,
    specialEvents: events.filter(e => e.type === 'stray_cat' || e.rare)
  };
}
```

### 6. Save System with Sect Data

```javascript
// save.js - Preserve the Sect's cultivation
const SaveSystem = {
  SAVE_KEY: 'celestial_snoot_sect',
  AUTO_SAVE_INTERVAL: 30000,
  VERSION: '1.0.0',
  
  save(gameState) {
    const data = {
      version: this.VERSION,
      timestamp: Date.now(),
      master: gameState.selectedMaster.id,
      resources: {
        bp: gameState.boopPoints,
        pp: gameState.purrPower,
        jc: gameState.jadeCatnip,
        destinyThreads: gameState.destinyThreads,
        gooseFeathers: gameState.gooseFeathers,
        goldenFeathers: gameState.goldenFeathers
      },
      cats: gameState.cats.map(cat => ({
        id: cat.id,
        happiness: cat.happiness,
        cultivationLevel: cat.level,
        obtained: cat.obtainedAt,
        braveHeart: cat.braveHeart || false
      })),
      waifus: gameState.waifus.map(waifu => ({
        id: waifu.id,
        bondLevel: waifu.bondLevel,
        giftsGiven: waifu.giftsGiven,
        dialogueUnlocked: waifu.dialogueUnlocked
      })),
      goose: {
        totalBooped: gameState.gooseBoops,
        ally: gameState.gooseAlly,
        cobraChickenDefeated: gameState.cobraChickenDefeated
      },
      techniques: gameState.unlockedTechniques,
      facilities: gameState.facilities,
      stats: {
        totalBoops: gameState.totalBoops,
        maxCombo: gameState.maxCombo,
        playtime: gameState.playtime,
        catsRecruited: gameState.catsRecruited,
        criticalBoops: gameState.criticalBoops,
        gooseCriticals: gameState.gooseCriticals
      }
    };
    
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    this.showSaveIndicator();
  },
  
  load() {
    const raw = localStorage.getItem(this.SAVE_KEY);
    if (!raw) return null;
    
    const data = JSON.parse(raw);
    return this.migrate(data);
  },
  
  migrate(data) {
    // Handle version migrations here
    if (data.version !== this.VERSION) {
      console.log(`Migrating save from ${data.version} to ${this.VERSION}`);
      // Add migration logic as needed
    }
    return data;
  },
  
  exportSave() {
    // For Discord sharing / backup
    const save = localStorage.getItem(this.SAVE_KEY);
    return btoa(save); // Base64 encode
  },
  
  importSave(encoded) {
    const decoded = atob(encoded);
    const data = JSON.parse(decoded);
    if (this.validateSave(data)) {
      localStorage.setItem(this.SAVE_KEY, decoded);
      return true;
    }
    return false;
  }
};
```

---

## 🗡️ Roguelike Dungeon Implementation 🗡️

### Dungeon Core System

```javascript
// dungeon.js - THE INFINITE PAGODA

const FLOOR_TYPES = {
  combat: { weight: 60, generator: generateCombatFloor },
  elite: { weight: 15, generator: generateEliteFloor },
  boss: { weight: 0, generator: generateBossFloor }, // Every 10th floor
  treasure: { weight: 10, generator: generateTreasureFloor },
  event: { weight: 10, generator: generateEventFloor },
  shop: { weight: 5, generator: generateShopFloor }
};

class InfinitePagoda {
  constructor(gameState) {
    this.gameState = gameState;
    this.currentRun = null;
    this.highestFloor = 0;
  }
  
  startRun(party) {
    // Party: { cats: [4 cats], waifu: waifuId, goose: gooseAllyId? }
    if (!this.validateParty(party)) return { error: 'Invalid party composition' };
    
    this.currentRun = {
      id: generateRunId(),
      party: this.initializeParty(party),
      floor: 1,
      loot: [],
      relics: [],
      abilityCards: [],
      qiMeter: 0,
      maxQi: 10,
      checkpointFloor: 0,
      startTime: Date.now(),
      deathDefiances: this.gameState.deathDefianceCount || 1
    };
    
    return this.generateFloor(1);
  }
  
  initializeParty(party) {
    return {
      cats: party.cats.map(catId => {
        const cat = this.gameState.getCat(catId);
        return {
          ...cat,
          currentHP: this.calculateMaxHP(cat),
          maxHP: this.calculateMaxHP(cat),
          equipment: this.gameState.getEquipment(catId),
          buffs: [],
          debuffs: [],
          position: null // Set during formation
        };
      }),
      waifu: this.initializeWaifu(party.waifu),
      goose: party.goose ? this.initializeGoose(party.goose) : null,
      formation: party.formation || 'default'
    };
  }
  
  initializeWaifu(waifuId) {
    const waifu = WAIFUS[waifuId];
    return {
      ...waifu,
      level: 1,
      exp: 0,
      activeSkillReady: true,
      passiveActive: true
    };
  }
  
  generateFloor(floorNum) {
    // Boss floors every 10
    if (floorNum % 10 === 0) {
      return this.generateBossFloor(floorNum);
    }
    
    // Roll floor type
    const floorType = this.rollFloorType();
    const floor = FLOOR_TYPES[floorType].generator(floorNum, this.currentRun);
    
    this.currentRun.currentFloor = {
      number: floorNum,
      type: floorType,
      ...floor,
      completed: false
    };
    
    return this.currentRun.currentFloor;
  }
  
  rollFloorType() {
    const totalWeight = Object.values(FLOOR_TYPES)
      .reduce((sum, ft) => sum + ft.weight, 0);
    let roll = Math.random() * totalWeight;
    
    for (const [type, data] of Object.entries(FLOOR_TYPES)) {
      roll -= data.weight;
      if (roll <= 0) return type;
    }
    return 'combat';
  }
  
  // Combat resolution
  processCombatTick() {
    if (!this.currentRun?.currentFloor?.enemies) return;
    
    const floor = this.currentRun.currentFloor;
    const party = this.currentRun.party;
    
    // Cat auto-attacks
    for (const cat of party.cats) {
      if (cat.currentHP <= 0) continue;
      
      const target = this.selectTarget(cat, floor.enemies);
      if (target) {
        const damage = this.calculateDamage(cat, target);
        target.currentHP -= damage;
        
        // Trigger on-hit effects
        this.processOnHitEffects(cat, target, damage);
      }
    }
    
    // Enemy attacks
    for (const enemy of floor.enemies) {
      if (enemy.currentHP <= 0) continue;
      
      const target = this.selectEnemyTarget(enemy, party);
      if (target) {
        const damage = this.calculateEnemyDamage(enemy, target);
        target.currentHP -= damage;
        
        // Check for death
        if (target.currentHP <= 0) {
          this.handleCatDown(target);
        }
      }
    }
    
    // Qi regeneration
    this.currentRun.qiMeter = Math.min(
      this.currentRun.qiMeter + 0.5,
      this.currentRun.maxQi
    );
    
    // Check floor completion
    if (floor.enemies.every(e => e.currentHP <= 0)) {
      return this.completeFloor();
    }
    
    // Check party wipe
    if (party.cats.every(c => c.currentHP <= 0)) {
      return this.handlePartyWipe();
    }
    
    return { status: 'ongoing', floor: this.currentRun.currentFloor };
  }
  
  // Boop Commands - Player abilities
  executeBoopCommand(command, targetId) {
    const costs = {
      powerBoop: 1,
      healingBoop: 1,
      shieldBoop: 1,
      megaBoop: 3,
      emergencyBoop: 5
    };
    
    if (this.currentRun.qiMeter < costs[command]) {
      return { error: 'Not enough Qi!' };
    }
    
    this.currentRun.qiMeter -= costs[command];
    
    switch (command) {
      case 'powerBoop':
        return this.executePowerBoop(targetId);
      case 'healingBoop':
        return this.executeHealingBoop(targetId);
      case 'shieldBoop':
        return this.executeShieldBoop(targetId);
      case 'megaBoop':
        return this.executeMegaBoop();
      case 'emergencyBoop':
        return this.executeEmergencyBoop(targetId);
    }
  }
  
  executePowerBoop(targetId) {
    const target = this.getEnemy(targetId);
    if (!target) return { error: 'Invalid target' };
    
    const baseDamage = 1000;
    const masterBonus = this.getMasterBoopBonus();
    const damage = baseDamage * masterBonus;
    
    target.currentHP -= damage;
    
    return {
      type: 'powerBoop',
      target: targetId,
      damage: damage,
      animation: 'power_boop',
      sound: 'boop_power'
    };
  }
  
  executeMegaBoop() {
    const enemies = this.currentRun.currentFloor.enemies;
    const baseDamage = 500;
    const results = [];
    
    for (const enemy of enemies) {
      if (enemy.currentHP > 0) {
        enemy.currentHP -= baseDamage;
        results.push({ id: enemy.id, damage: baseDamage });
      }
    }
    
    return {
      type: 'megaBoop',
      hits: results,
      animation: 'mega_boop_explosion',
      sound: 'boop_mega',
      screenShake: true
    };
  }
  
  handlePartyWipe() {
    // Check for Death Defiance
    if (this.currentRun.deathDefiances > 0) {
      this.currentRun.deathDefiances--;
      
      // Revive all cats at 30% HP
      for (const cat of this.currentRun.party.cats) {
        cat.currentHP = Math.floor(cat.maxHP * 0.3);
      }
      
      return {
        status: 'death_defied',
        message: 'Death Defiance activated! Your cats refuse to fall!',
        defiancesRemaining: this.currentRun.deathDefiances
      };
    }
    
    // Actual run end
    return this.endRun(false);
  }
  
  completeFloor() {
    const floor = this.currentRun.currentFloor;
    floor.completed = true;
    
    // Generate loot
    const loot = this.generateFloorLoot(floor);
    this.currentRun.loot.push(...loot);
    
    // Waifu EXP
    this.currentRun.party.waifu.exp += floor.number * 10;
    this.checkWaifuLevelUp();
    
    // Update highest floor
    if (floor.number > this.highestFloor) {
      this.highestFloor = floor.number;
    }
    
    // Checkpoint?
    if (floor.number % 10 === 0) {
      this.currentRun.checkpointFloor = floor.number;
    }
    
    return {
      status: 'floor_complete',
      floor: floor.number,
      loot: loot,
      nextFloor: this.generateFloor(floor.number + 1)
    };
  }
  
  endRun(victory) {
    const run = this.currentRun;
    
    // Apply loot to main game
    for (const item of run.loot) {
      this.gameState.addItem(item);
    }
    
    // Record stats
    this.gameState.dungeonStats.runsCompleted++;
    this.gameState.dungeonStats.highestFloor = Math.max(
      this.gameState.dungeonStats.highestFloor,
      run.floor
    );
    
    const result = {
      status: victory ? 'victory' : 'defeat',
      floorsCleared: run.floor - 1,
      lootGained: run.loot,
      relicsFound: run.relics,
      timeElapsed: Date.now() - run.startTime
    };
    
    this.currentRun = null;
    return result;
  }
}
```

### Equipment System

```javascript
// equipment.js - "A well-dressed cat is a deadly cat."

const EQUIPMENT_SLOTS = ['hat', 'collar', 'weapon', 'armor', 'paws', 'tail'];

const EQUIPMENT_DATABASE = {
  // WEAPONS
  fish_blade: {
    id: 'fish_blade',
    name: 'Ancient Fish Blade',
    slot: 'weapon',
    rarity: 'rare',
    stats: { attack: 25, critChance: 5 },
    passive: {
      name: 'Delicious Scent',
      effect: 'aggroBonus',
      value: 0.1
    },
    lore: 'Forged from a legendary tuna that defied the heavens.',
    source: 'Floor 15+ treasure rooms'
  },
  
  laser_claw: {
    id: 'laser_claw',
    name: 'Laser-Guided Claws',
    slot: 'weapon',
    rarity: 'epic',
    stats: { attack: 40, accuracy: 20 },
    passive: {
      name: 'Lock On',
      effect: 'cantMiss',
      value: true
    },
    setId: 'tech_cat',
    lore: 'The red dot was inside you all along.',
    source: 'Floor 30+ elite enemies'
  },
  
  cardboard_sword: {
    id: 'cardboard_sword',
    name: 'Legendary Cardboard Sword',
    slot: 'weapon',
    rarity: 'legendary',
    stats: { attack: 100, critChance: 25 },
    passive: {
      name: 'Box Synergy',
      effect: 'conditionalAttack',
      condition: 'inBox',
      multiplier: 2.0
    },
    lore: 'The box is mightier than the sword. But what if... both?',
    source: 'Crafted from blueprint (Floor 50+ boss)'
  },
  
  // ARMOR
  cardboard_chest: {
    id: 'cardboard_chest',
    name: 'Cardboard Chestplate',
    slot: 'armor',
    rarity: 'rare',
    stats: { defense: 30, hp: 100 },
    setId: 'box_knight',
    passive: {
      name: 'Comfy',
      effect: 'hpRegen',
      value: 5
    }
  },
  
  void_cloak: {
    id: 'void_cloak',
    name: 'Cloak of the Void',
    slot: 'armor',
    rarity: 'epic',
    stats: { defense: 20, dodge: 30 },
    setId: 'void_stalker',
    passive: {
      name: 'Phase',
      effect: 'firstStrikeDamageBonus',
      value: 3.0
    }
  },
  
  // HATS
  tiny_wizard_hat: {
    id: 'tiny_wizard_hat',
    name: 'Tiny Wizard Hat',
    slot: 'hat',
    rarity: 'uncommon',
    stats: { wisdom: 15, critDamage: 10 },
    passive: {
      name: 'Arcane Floof',
      effect: 'abilityDamageBonus',
      value: 0.15
    }
  },
  
  battle_helmet: {
    id: 'battle_helmet',
    name: 'Battle Helmet of the Ancients',
    slot: 'hat',
    rarity: 'legendary',
    stats: { defense: 50, hp: 200, attack: 30 },
    passive: {
      name: 'Unbreakable',
      effect: 'damageReduction',
      value: 0.2
    },
    lore: 'Worn by the legendary Cat General Meowcius.'
  },
  
  // SIGNATURE ITEMS (Legendary cat exclusives)
  ceiling_eye: {
    id: 'ceiling_eye',
    name: "Ceiling Cat's All-Seeing Eye",
    slot: 'hat',
    rarity: 'mythic',
    exclusiveTo: 'ceiling_god',
    stats: { wisdom: 100, critChance: 50 },
    passive: {
      name: 'Omniscience',
      effect: 'revealWeaknesses',
      value: true
    },
    ultimate: {
      name: 'JUDGEMENT FROM ABOVE',
      effect: 'instantKillBelow',
      threshold: 0.3
    }
  }
};

const EQUIPMENT_SETS = {
  box_knight: {
    name: 'Box Knight Set',
    pieces: ['cardboard_helm', 'cardboard_chest', 'cardboard_paws'],
    bonuses: {
      2: { defense: 0.2, description: '+20% defense' },
      3: { 
        effect: 'immuneFirstHit', 
        description: 'Immune to first hit each room'
      },
      full: { 
        effect: 'megaBoxTransform',
        description: 'Transform into MEGA BOX — taunt all enemies for 5 seconds'
      }
    }
  },
  
  void_stalker: {
    name: 'Void Stalker Set',
    pieces: ['shadow_hood', 'void_cloak', 'silent_paws', 'ghost_tail'],
    bonuses: {
      2: { dodge: 0.3, description: '+30% dodge' },
      3: { 
        effect: 'stealthStrike', 
        multiplier: 3.0,
        description: 'First attack from stealth deals 3x damage'
      },
      full: { 
        effect: 'phaseShift',
        uses: 1,
        description: 'Can phase through one lethal attack per floor'
      }
    }
  },
  
  tech_cat: {
    name: 'Tech Cat Set',
    pieces: ['laser_claw', 'battery_collar', 'rocket_boots', 'antenna_hat'],
    bonuses: {
      2: { critDamage: 0.15, description: '+15% crit damage' },
      3: { 
        effect: 'overcharge',
        description: 'Crits have 25% chance to crit again'
      },
      full: {
        effect: 'orbitalStrike',
        cooldown: 60,
        description: 'Every 60s, call down an orbital laser strike'
      }
    }
  }
};

class EquipmentSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  equipItem(catId, itemId) {
    const cat = this.gameState.getCat(catId);
    const item = this.gameState.getInventoryItem(itemId);
    
    if (!item) return { error: 'Item not found' };
    if (item.exclusiveTo && item.exclusiveTo !== cat.id) {
      return { error: `This item can only be equipped by ${item.exclusiveTo}` };
    }
    
    const slot = item.slot;
    
    // Unequip current item in slot
    const currentItem = cat.equipment[slot];
    if (currentItem) {
      this.unequipItem(catId, slot);
    }
    
    // Equip new item
    cat.equipment[slot] = itemId;
    this.gameState.removeFromInventory(itemId);
    
    // Recalculate stats
    this.recalculateCatStats(cat);
    
    // Check set bonuses
    this.checkSetBonuses(cat);
    
    return { success: true, cat, item };
  }
  
  recalculateCatStats(cat) {
    // Base stats
    const stats = { ...cat.baseStats };
    
    // Add equipment stats
    for (const slot of EQUIPMENT_SLOTS) {
      const itemId = cat.equipment[slot];
      if (itemId) {
        const item = EQUIPMENT_DATABASE[itemId];
        for (const [stat, value] of Object.entries(item.stats)) {
          stats[stat] = (stats[stat] || 0) + value;
        }
      }
    }
    
    // Apply set bonuses
    if (cat.activeSets) {
      for (const setBonus of cat.activeSets) {
        if (setBonus.stats) {
          for (const [stat, value] of Object.entries(setBonus.stats)) {
            if (typeof value === 'number' && value < 1) {
              // Percentage bonus
              stats[stat] = (stats[stat] || 0) * (1 + value);
            } else {
              stats[stat] = (stats[stat] || 0) + value;
            }
          }
        }
      }
    }
    
    cat.calculatedStats = stats;
  }
  
  checkSetBonuses(cat) {
    const equippedSets = {};
    
    // Count set pieces
    for (const slot of EQUIPMENT_SLOTS) {
      const itemId = cat.equipment[slot];
      if (itemId) {
        const item = EQUIPMENT_DATABASE[itemId];
        if (item.setId) {
          equippedSets[item.setId] = (equippedSets[item.setId] || 0) + 1;
        }
      }
    }
    
    // Determine active bonuses
    cat.activeSets = [];
    
    for (const [setId, count] of Object.entries(equippedSets)) {
      const set = EQUIPMENT_SETS[setId];
      
      for (const [threshold, bonus] of Object.entries(set.bonuses)) {
        const required = threshold === 'full' ? set.pieces.length : parseInt(threshold);
        if (count >= required) {
          cat.activeSets.push({
            setId,
            threshold,
            ...bonus
          });
        }
      }
    }
  }
  
  // Weapon Evolution (Vampire Survivors style)
  canEvolve(weaponId, passiveId) {
    const evolution = WEAPON_EVOLUTIONS[weaponId];
    if (!evolution) return false;
    return evolution.requires === passiveId;
  }
  
  evolveWeapon(catId, weaponId) {
    const cat = this.gameState.getCat(catId);
    const evolution = WEAPON_EVOLUTIONS[weaponId];
    
    if (!evolution) return { error: 'No evolution available' };
    
    // Check requirements
    const hasPassive = this.catHasPassive(cat, evolution.requires);
    const weaponMaxed = this.isWeaponMaxed(catId, weaponId);
    
    if (!hasPassive || !weaponMaxed) {
      return { error: 'Requirements not met' };
    }
    
    // Perform evolution
    cat.equipment.weapon = evolution.result;
    this.removePassive(cat, evolution.requires);
    
    return {
      success: true,
      evolved: EQUIPMENT_DATABASE[evolution.result],
      message: `${weaponId} has evolved into ${evolution.result}!`
    };
  }
}

const WEAPON_EVOLUTIONS = {
  laser_pointer: {
    requires: 'battery_pack',
    result: 'orbital_laser_array'
  },
  fish_blade: {
    requires: 'chef_hat',
    result: 'sashimi_slasher'
  },
  yarn_ball: {
    requires: 'caffeine_pills',
    result: 'infinite_yarn_dimension'
  },
  spray_bottle: {
    requires: 'void_essence_passive',
    result: 'black_hole_mister'
  },
  cardboard_sword: {
    requires: 'duct_tape',
    result: 'mega_cardboard_mech'
  }
};
```

### Relic System

```javascript
// relics.js - Run-wide powerful buffs

const RELICS = {
  // COMMON RELICS
  lucky_coin: {
    id: 'lucky_coin',
    name: 'Lucky Coin',
    rarity: 'common',
    effect: {
      type: 'lootBonus',
      value: 0.1
    },
    description: '+10% loot drop rate',
    flavor: 'Flip it for luck. Always lands on cats.'
  },
  
  catnip_pouch: {
    id: 'catnip_pouch',
    name: 'Emergency Catnip Pouch',
    rarity: 'common',
    effect: {
      type: 'qiRegen',
      value: 0.2
    },
    description: '+20% Qi regeneration rate'
  },
  
  // RARE RELICS
  box_dimension: {
    id: 'box_dimension',
    name: 'Pocket Dimension Box',
    rarity: 'rare',
    effect: {
      type: 'doubleLootChance',
      value: 0.25
    },
    description: '25% chance enemies drop double loot',
    flavor: 'It\'s bigger on the inside. Much bigger.'
  },
  
  nine_lives_charm: {
    id: 'nine_lives_charm',
    name: 'Nine Lives Charm',
    rarity: 'rare',
    effect: {
      type: 'reviveChance',
      value: 0.15
    },
    description: '15% chance to auto-revive when a cat falls',
    flavor: 'Lives 1-8 sold separately.'
  },
  
  // EPIC RELICS
  goose_horn: {
    id: 'goose_horn',
    name: 'Horn of the Goose',
    rarity: 'epic',
    effect: {
      type: 'summonGoose',
      floors: 5
    },
    description: 'Summon a wild goose every 5 floors to attack enemies',
    flavor: 'HONK!'
  },
  
  waifu_blessing: {
    id: 'waifu_blessing',
    name: 'Concentrated Waifu Energy',
    rarity: 'epic',
    effect: {
      type: 'waifuSkillCooldown',
      value: 0.5
    },
    description: 'Waifu active skill cooldown reduced by 50%'
  },
  
  // LEGENDARY RELICS
  eternal_catnip: {
    id: 'eternal_catnip',
    name: 'Eternal Catnip',
    rarity: 'legendary',
    effect: {
      type: 'multiple',
      effects: [
        { type: 'allStats', value: 0.2 },
        { type: 'startFullQi', value: true }
      ]
    },
    description: 'All cats have +20% stats. Start each floor with full Qi.',
    flavor: 'The good stuff. The really good stuff.'
  },
  
  developers_mouse: {
    id: 'developers_mouse',
    name: "The Developer's Mouse",
    rarity: 'legendary',
    effect: {
      type: 'debugMode',
      value: true
    },
    description: 'See enemy HP, next floor preview, hidden loot',
    flavor: 'With great power comes great debug logs.'
  },
  
  // MYTHIC RELICS
  snoot_prime: {
    id: 'snoot_prime',
    name: 'Fragment of Snoot Prime',
    rarity: 'mythic',
    effect: {
      type: 'boopDamage',
      value: 3.0
    },
    description: 'All Boop Commands deal 3x damage',
    flavor: 'The first snoot. The original boop.',
    source: 'Floor 100 boss only'
  }
};

class RelicSystem {
  constructor(run) {
    this.run = run;
    this.activeRelics = [];
  }
  
  addRelic(relicId) {
    const relic = RELICS[relicId];
    if (!relic) return false;
    
    this.activeRelics.push(relicId);
    this.applyRelicEffect(relic);
    
    return relic;
  }
  
  applyRelicEffect(relic) {
    const effect = relic.effect;
    
    if (effect.type === 'multiple') {
      for (const e of effect.effects) {
        this.applySingleEffect(e);
      }
    } else {
      this.applySingleEffect(effect);
    }
  }
  
  applySingleEffect(effect) {
    switch (effect.type) {
      case 'lootBonus':
        this.run.modifiers.lootBonus = (this.run.modifiers.lootBonus || 1) + effect.value;
        break;
      case 'qiRegen':
        this.run.modifiers.qiRegen = (this.run.modifiers.qiRegen || 1) + effect.value;
        break;
      case 'allStats':
        this.run.modifiers.allStats = (this.run.modifiers.allStats || 1) + effect.value;
        break;
      case 'boopDamage':
        this.run.modifiers.boopDamage = (this.run.modifiers.boopDamage || 1) * effect.value;
        break;
      // ... more effect types
    }
  }
  
  processFloorRelics(floorNum) {
    // Goose Horn - summon goose every 5 floors
    if (this.hasRelic('goose_horn') && floorNum % 5 === 0) {
      this.summonAllyGoose();
    }
  }
  
  hasRelic(relicId) {
    return this.activeRelics.includes(relicId);
  }
}
```

### Offline Dungeon Progress

```javascript
// offlineDungeon.js - AFK roguelike

class OfflineDungeonSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  startOfflineRun(party, settings) {
    // Settings: { retreatAtHpPercent, useConsumables, maxFloors }
    
    const offlineRun = {
      party: party,
      settings: settings,
      startTime: Date.now(),
      startFloor: settings.startFloor || 1,
      status: 'running'
    };
    
    this.gameState.offlineDungeonRun = offlineRun;
    return offlineRun;
  }
  
  resolveOfflineRun() {
    const run = this.gameState.offlineDungeonRun;
    if (!run || run.status !== 'running') return null;
    
    const elapsed = Date.now() - run.startTime;
    const secondsElapsed = elapsed / 1000;
    
    // Calculate floors cleared (slower than active play)
    const secondsPerFloor = this.calculateSecondsPerFloor(run.party);
    const floorsAttempted = Math.floor(secondsElapsed / secondsPerFloor);
    
    // Simulate each floor
    let currentFloor = run.startFloor;
    let floorsCleared = 0;
    const loot = [];
    let partyWiped = false;
    
    for (let i = 0; i < floorsAttempted; i++) {
      const floorResult = this.simulateFloor(currentFloor, run);
      
      if (floorResult.survived) {
        floorsCleared++;
        currentFloor++;
        loot.push(...floorResult.loot);
        
        // Check settings
        if (run.settings.maxFloors && floorsCleared >= run.settings.maxFloors) {
          break;
        }
        if (floorResult.partyHpPercent < run.settings.retreatAtHpPercent) {
          break;
        }
      } else {
        partyWiped = true;
        break;
      }
    }
    
    // Apply results
    for (const item of loot) {
      this.gameState.addItem(item);
    }
    
    const result = {
      floorsCleared,
      highestFloor: currentFloor - 1,
      loot,
      partyWiped,
      timeElapsed: elapsed
    };
    
    this.gameState.offlineDungeonRun = null;
    return result;
  }
  
  simulateFloor(floorNum, run) {
    const partyPower = this.calculatePartyPower(run.party);
    const floorDifficulty = this.calculateFloorDifficulty(floorNum);
    
    // Survival based on power vs difficulty
    const survivalChance = partyPower / (partyPower + floorDifficulty);
    const survived = Math.random() < survivalChance;
    
    // Loot generation
    const loot = survived ? this.generateOfflineLoot(floorNum) : [];
    
    // HP estimation
    const damageRatio = 1 - survivalChance;
    const partyHpPercent = Math.max(0, 1 - (damageRatio * 1.5));
    
    return {
      survived,
      loot,
      partyHpPercent
    };
  }
  
  calculatePartyPower(party) {
    let power = 0;
    
    for (const catId of party.cats) {
      const cat = this.gameState.getCat(catId);
      power += cat.calculatedStats.attack || 0;
      power += cat.calculatedStats.defense || 0;
      power += (cat.calculatedStats.hp || 0) / 10;
    }
    
    // Waifu bonus
    const waifu = WAIFUS[party.waifu];
    power *= (1 + (waifu.powerBonus || 0));
    
    // Goose bonus
    if (party.goose) {
      power *= 1.15;
    }
    
    return power;
  }
  
  calculateFloorDifficulty(floorNum) {
    // Exponential scaling
    return Math.pow(floorNum, 1.5) * 100;
  }
  
  calculateSecondsPerFloor(party) {
    // Base: 60 seconds per floor, reduced by party power
    const power = this.calculatePartyPower(party);
    const base = 60;
    const speedFactor = Math.max(0.3, 1 - (power / 10000));
    return base * speedFactor;
  }
}
```

### Wave Survival Mode (Vampire Survivors Style)

```javascript
// survival.js - "Survive 30 minutes"

class WaveSurvivalMode {
  constructor(gameState) {
    this.gameState = gameState;
    this.currentRun = null;
  }
  
  startRun(catId) {
    // Single cat survival mode
    const cat = this.gameState.getCat(catId);
    
    this.currentRun = {
      cat: this.prepareSurvivorCat(cat),
      level: 1,
      exp: 0,
      expToLevel: 100,
      time: 0,
      maxTime: 30 * 60, // 30 minutes
      weapons: [cat.equipment.weapon],
      passives: [],
      enemies: [],
      pickups: [],
      bossesDefeated: 0
    };
    
    return this.currentRun;
  }
  
  prepareSurvivorCat(cat) {
    return {
      ...cat,
      x: 400,
      y: 300,
      hp: cat.calculatedStats.hp * 2, // Double HP for survival
      maxHp: cat.calculatedStats.hp * 2,
      moveSpeed: 5,
      pickupRadius: 50,
      weapons: []
    };
  }
  
  update(deltaTime) {
    if (!this.currentRun) return;
    
    this.currentRun.time += deltaTime;
    
    // Spawn enemies based on time
    this.spawnEnemies(deltaTime);
    
    // Auto-attack (weapons fire automatically)
    this.processWeapons(deltaTime);
    
    // Enemy AI
    this.processEnemies(deltaTime);
    
    // Pickup magnet
    this.processPickups(deltaTime);
    
    // Check level up
    if (this.currentRun.exp >= this.currentRun.expToLevel) {
      return this.levelUp();
    }
    
    // Check win/lose
    if (this.currentRun.time >= this.currentRun.maxTime) {
      return this.win();
    }
    if (this.currentRun.cat.hp <= 0) {
      return this.lose();
    }
    
    return { status: 'ongoing' };
  }
  
  levelUp() {
    this.currentRun.level++;
    this.currentRun.exp = 0;
    this.currentRun.expToLevel = Math.floor(this.currentRun.expToLevel * 1.2);
    
    // Generate upgrade choices
    const choices = this.generateUpgradeChoices(3);
    
    return {
      status: 'level_up',
      level: this.currentRun.level,
      choices: choices
    };
  }
  
  generateUpgradeChoices(count) {
    const pool = [...SURVIVAL_WEAPONS, ...SURVIVAL_PASSIVES];
    const choices = [];
    
    for (let i = 0; i < count; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      
      // Check if already owned (then it's an upgrade)
      const owned = this.currentRun.weapons.includes(item.id) || 
                    this.currentRun.passives.includes(item.id);
      
      choices.push({
        ...item,
        isUpgrade: owned,
        currentLevel: owned ? this.getItemLevel(item.id) : 0
      });
    }
    
    return choices;
  }
  
  selectUpgrade(choiceIndex) {
    const choice = this.currentRun.levelUpChoices[choiceIndex];
    
    if (choice.type === 'weapon') {
      if (choice.isUpgrade) {
        this.upgradeWeapon(choice.id);
      } else {
        this.currentRun.weapons.push(choice.id);
      }
    } else {
      if (choice.isUpgrade) {
        this.upgradePassive(choice.id);
      } else {
        this.currentRun.passives.push(choice.id);
      }
    }
    
    // Check for evolution
    this.checkEvolutions();
    
    return { status: 'ongoing' };
  }
  
  checkEvolutions() {
    for (const [weaponId, evolution] of Object.entries(SURVIVAL_EVOLUTIONS)) {
      if (!this.currentRun.weapons.includes(weaponId)) continue;
      if (!this.currentRun.passives.includes(evolution.requires)) continue;
      if (this.getItemLevel(weaponId) < evolution.maxLevel) continue;
      
      // EVOLVE!
      this.evolveWeapon(weaponId, evolution);
    }
  }
}

const SURVIVAL_WEAPONS = [
  {
    id: 'claw_swipe',
    name: 'Claw Swipe',
    type: 'weapon',
    description: 'Basic claw attack in front',
    levels: [
      { damage: 10, cooldown: 1.0 },
      { damage: 15, cooldown: 0.9 },
      { damage: 20, cooldown: 0.8, projectiles: 2 },
      { damage: 30, cooldown: 0.7, projectiles: 2 },
      { damage: 40, cooldown: 0.6, projectiles: 3 }
    ]
  },
  {
    id: 'hairball',
    name: 'Hairball Artillery',
    type: 'weapon',
    description: 'Lob hairballs at enemies',
    levels: [
      { damage: 25, cooldown: 3.0, aoe: 30 },
      { damage: 35, cooldown: 2.8, aoe: 40 },
      { damage: 50, cooldown: 2.5, aoe: 50, projectiles: 2 },
      { damage: 70, cooldown: 2.2, aoe: 60, projectiles: 2 },
      { damage: 100, cooldown: 2.0, aoe: 80, projectiles: 3 }
    ]
  },
  {
    id: 'laser_eyes',
    name: 'Laser Eyes',
    type: 'weapon',
    description: 'Continuous laser beam',
    levels: [
      { dps: 15, duration: 1.0, cooldown: 5.0 },
      { dps: 25, duration: 1.5, cooldown: 4.5 },
      { dps: 40, duration: 2.0, cooldown: 4.0 },
      { dps: 60, duration: 2.5, cooldown: 3.5 },
      { dps: 100, duration: 3.0, cooldown: 3.0, piercing: true }
    ]
  }
];

const SURVIVAL_PASSIVES = [
  {
    id: 'fluffy_armor',
    name: 'Fluffy Armor',
    type: 'passive',
    description: 'Reduce incoming damage',
    levels: [
      { damageReduction: 0.05 },
      { damageReduction: 0.10 },
      { damageReduction: 0.15 },
      { damageReduction: 0.20 },
      { damageReduction: 0.30 }
    ]
  },
  {
    id: 'zoomies',
    name: 'Zoomies',
    type: 'passive', 
    description: 'Move faster',
    levels: [
      { moveSpeed: 0.10 },
      { moveSpeed: 0.20 },
      { moveSpeed: 0.30 },
      { moveSpeed: 0.40 },
      { moveSpeed: 0.50 }
    ]
  }
];

const SURVIVAL_EVOLUTIONS = {
  claw_swipe: {
    requires: 'zoomies',
    maxLevel: 5,
    result: {
      id: 'thousand_claw_barrage',
      name: 'THOUSAND CLAW BARRAGE',
      damage: 100,
      cooldown: 0.1,
      projectiles: 10,
      description: 'UNLIMITED CLAW WORKS'
    }
  },
  laser_eyes: {
    requires: 'fluffy_armor',
    maxLevel: 5,
    result: {
      id: 'death_star_beam',
      name: 'DEATH STAR BEAM',
      dps: 500,
      duration: 5.0,
      cooldown: 10.0,
      screenWide: true,
      description: 'That\'s no moon...'
    }
  }
};
```

### 1. Prestige/Ascension System

```javascript
// ascension.js - "To reach the highest heavens, one must first return to nothing."

const ASCENSION_THRESHOLD = 1e9; // 1 Billion PP

const HEAVENLY_SEAL_BONUSES = {
  1: { productionMult: 1.10, desc: '+10% all production permanently' },
  5: { startingCats: { count: 3, minRealm: 'earth' }, desc: 'Start with 3 Earth-realm cats' },
  10: { unlocks: 'forbidden_techniques', desc: 'Unlock Forbidden Techniques tree' },
  25: { startingWaifu: { bondPercent: 0.5 }, desc: 'Start with a random Waifu at 50% bond' },
  50: { gooseMoodBonus: 1, desc: 'Geese spawn with +1 mood level' },
  100: { unlocks: 'eighth_master', desc: 'Unlock The Eighth Master' }
};

const FORBIDDEN_TECHNIQUES = {
  void_palm: {
    name: 'Void Palm',
    description: 'Boops hit all cats on screen',
    cost: { seals: 5 },
    effect: { aoeBoops: true }
  },
  time_reversal: {
    name: 'Time Reversal Sutra', 
    description: 'AFK time cap increased to 48 hours',
    cost: { seals: 10 },
    effect: { afkCapHours: 48 }
  },
  reincarnation_wheel: {
    name: 'Reincarnation Wheel',
    description: 'Merge duplicate cats to upgrade realm',
    cost: { seals: 15 },
    effect: { catMerging: true }
  },
  heaven_defying: {
    name: 'Heaven Defying Snoot',
    description: '1% chance for cats to spawn one realm higher',
    cost: { seals: 25 },
    effect: { realmUpgradeChance: 0.01 }
  }
};

class AscensionSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  canAscend() {
    return this.gameState.purrPower >= ASCENSION_THRESHOLD;
  }
  
  calculateSealsEarned() {
    // Seals based on total progress
    const pp = this.gameState.purrPower;
    const cats = this.gameState.cats.length;
    const waifuBonds = this.gameState.waifus.reduce((sum, w) => sum + w.bondLevel, 0);
    const gooseBoops = this.gameState.gooseBoops;
    
    let seals = Math.floor(Math.log10(pp) - 8); // Base from PP
    seals += Math.floor(cats / 20);              // Bonus from cats
    seals += Math.floor(waifuBonds / 100);       // Bonus from bonds
    seals += Math.floor(gooseBoops / 50);        // Bonus from geese
    
    return Math.max(1, seals);
  }
  
  performAscension() {
    if (!this.canAscend()) return false;
    
    const sealsEarned = this.calculateSealsEarned();
    
    // Store persistent data
    const persistent = {
      heavenlySeals: (this.gameState.heavenlySeals || 0) + sealsEarned,
      totalAscensions: (this.gameState.totalAscensions || 0) + 1,
      waifus: this.gameState.waifus.map(w => ({
        id: w.id,
        bondLevel: Math.floor(w.bondLevel * 0.5) // Halved bonds
      })),
      gooseAlly: this.gameState.gooseAlly,
      achievements: this.gameState.achievements,
      unlockedMasters: this.gameState.unlockedMasters,
      forbiddenTechniques: this.gameState.forbiddenTechniques,
      cosmeticsOwned: this.gameState.cosmeticsOwned
    };
    
    // Reset the game
    this.gameState.reset();
    
    // Restore persistent data
    Object.assign(this.gameState, persistent);
    
    // Apply seal bonuses
    this.applyHeavenlySealBonuses();
    
    // Grant starting bonuses
    this.grantStartingBonuses();
    
    return { sealsEarned, totalSeals: this.gameState.heavenlySeals };
  }
  
  applyHeavenlySealBonuses() {
    const seals = this.gameState.heavenlySeals;
    
    for (const [threshold, bonus] of Object.entries(HEAVENLY_SEAL_BONUSES)) {
      if (seals >= parseInt(threshold)) {
        if (bonus.productionMult) {
          this.gameState.permanentMultipliers.production *= bonus.productionMult;
        }
        if (bonus.unlocks) {
          this.gameState.unlocked[bonus.unlocks] = true;
        }
        if (bonus.gooseMoodBonus) {
          this.gameState.gooseMoodBonus = bonus.gooseMoodBonus;
        }
      }
    }
  }
  
  grantStartingBonuses() {
    const seals = this.gameState.heavenlySeals;
    
    // Starting cats at 5 seals
    if (seals >= 5) {
      for (let i = 0; i < 3; i++) {
        const cat = generateRandomCat({ minRealm: 'earth' });
        this.gameState.cats.push(cat);
      }
    }
    
    // Starting waifu at 25 seals
    if (seals >= 25) {
      const randomWaifu = this.gameState.waifus[Math.floor(Math.random() * this.gameState.waifus.length)];
      randomWaifu.bondLevel = Math.max(randomWaifu.bondLevel, 50);
    }
  }
  
  purchaseForbiddenTechnique(techId) {
    const tech = FORBIDDEN_TECHNIQUES[techId];
    if (!tech) return false;
    
    if (this.gameState.heavenlySeals < tech.cost.seals) return false;
    if (this.gameState.forbiddenTechniques.includes(techId)) return false;
    
    this.gameState.heavenlySeals -= tech.cost.seals;
    this.gameState.forbiddenTechniques.push(techId);
    this.applyForbiddenTechnique(tech);
    
    return true;
  }
}

// The Eighth Master - unlocked at 100 seals
const EIGHTH_MASTER = {
  id: 'mythic',
  name: '???',
  title: 'The Forgotten One',
  role: 'Unknown',
  description: 'A master erased from history. Why?',
  passive: {
    name: 'Echoes of Eternity',
    description: 'All other masters\' passives are active at 25% power',
    effect: (gameState) => {
      return { 
        allPassivesPartial: true,
        partialStrength: 0.25 
      };
    }
  },
  sprite: 'masters/eighth.png',
  color: '#FFFFFF',
  quotes: [
    "...I remember now.",
    "The Sect... it was always meant to be eight.",
    "Boop... yes... I remember booping."
  ],
  unlockLore: "Long before Gerald found the Snoot Scrolls, there was another..."
};
```

### 2. Building System

```javascript
// buildings.js - "A great sect needs great halls."

const BUILDINGS = {
  cat_pagoda: {
    id: 'cat_pagoda',
    name: 'Cat Pagoda',
    description: '+10 cat capacity per level',
    baseCost: 10000,
    costScale: 1.5,
    maxLevel: 10,
    effect: (level) => ({ catCapacity: level * 10 })
  },
  meditation_garden: {
    id: 'meditation_garden', 
    name: 'Meditation Garden',
    description: '+25% PP when idle >1 hour',
    baseCost: 50000,
    costScale: 2.0,
    maxLevel: 5,
    effect: (level) => ({ idlePPBonus: 0.25 * level, idleThreshold: 3600 })
  },
  waifu_quarters: {
    id: 'waifu_quarters',
    name: 'Waifu Quarters', 
    description: 'Waifus give daily gifts',
    baseCost: 100000,
    costScale: 2.5,
    maxLevel: 3,
    effect: (level) => ({ dailyGifts: level })
  },
  goose_watchtower: {
    id: 'goose_watchtower',
    name: 'Goose Watchtower',
    description: '+5% Goose spawn rate, early warning',
    baseCost: 250000,
    costScale: 2.0,
    maxLevel: 5,
    effect: (level) => ({ 
      gooseSpawnBonus: 0.05 * level, 
      gooseWarning: level >= 1 
    })
  },
  hall_of_legends: {
    id: 'hall_of_legends',
    name: 'Hall of Legends',
    description: 'Display achievements, visitor bonus',
    baseCost: 500000,
    costScale: 3.0,
    maxLevel: 1,
    effect: () => ({ achievementDisplay: true, visitorBonus: 1.1 })
  },
  celestial_kitchen: {
    id: 'celestial_kitchen',
    name: 'Celestial Kitchen',
    description: 'Auto-feed cats, happiness decay -50%',
    baseCost: 1000000,
    costScale: 2.0,
    maxLevel: 3,
    effect: (level) => ({ 
      autoFeed: true, 
      happinessDecayReduction: 0.5 * level 
    })
  },
  training_dojo: {
    id: 'training_dojo',
    name: 'Training Dojo',
    description: 'Cats slowly gain cultivation EXP',
    baseCost: 2500000,
    costScale: 2.5,
    maxLevel: 5,
    effect: (level) => ({ catExpPerHour: 10 * level })
  },
  treasury_vault: {
    id: 'treasury_vault',
    name: 'Treasury Vault',
    description: 'AFK BP generation',
    baseCost: 5000000,
    costScale: 3.0,
    maxLevel: 5,
    effect: (level) => ({ afkBPPerSecond: 100 * level })
  },
  portal_gate: {
    id: 'portal_gate',
    name: 'Portal Gate',
    description: 'Visit friends\' sects',
    baseCost: 10000000,
    costScale: 1.0, // Only 1 level
    maxLevel: 1,
    effect: () => ({ sectVisits: true })
  }
};

const TERRITORIES = {
  humble_courtyard: {
    name: 'Humble Courtyard',
    catCapacity: 10,
    buildingSlots: 3,
    theme: 'starter',
    unlockCost: 0
  },
  mountain_sanctuary: {
    name: 'Mountain Sanctuary', 
    catCapacity: 30,
    buildingSlots: 6,
    theme: 'mountain',
    unlockCost: 1000000
  },
  floating_palace: {
    name: 'Floating Palace',
    catCapacity: 75,
    buildingSlots: 9,
    theme: 'sky',
    unlockCost: 50000000
  },
  celestial_realm: {
    name: 'Celestial Realm',
    catCapacity: 200,
    buildingSlots: 12,
    theme: 'divine',
    unlockCost: 1000000000
  }
};

class BuildingSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.buildings = {};
  }
  
  getBuildingCost(buildingId, currentLevel = 0) {
    const building = BUILDINGS[buildingId];
    return Math.floor(building.baseCost * Math.pow(building.costScale, currentLevel));
  }
  
  canBuild(buildingId) {
    const currentLevel = this.buildings[buildingId] || 0;
    const building = BUILDINGS[buildingId];
    
    if (currentLevel >= building.maxLevel) return false;
    if (this.getUsedSlots() >= this.getAvailableSlots()) return false;
    if (this.gameState.boopPoints < this.getBuildingCost(buildingId, currentLevel)) return false;
    
    return true;
  }
  
  build(buildingId) {
    if (!this.canBuild(buildingId)) return false;
    
    const currentLevel = this.buildings[buildingId] || 0;
    const cost = this.getBuildingCost(buildingId, currentLevel);
    
    this.gameState.boopPoints -= cost;
    this.buildings[buildingId] = currentLevel + 1;
    
    this.recalculateEffects();
    return true;
  }
  
  recalculateEffects() {
    const effects = {};
    
    for (const [buildingId, level] of Object.entries(this.buildings)) {
      if (level > 0) {
        const buildingEffects = BUILDINGS[buildingId].effect(level);
        Object.assign(effects, buildingEffects);
      }
    }
    
    this.gameState.buildingEffects = effects;
  }
  
  getAvailableSlots() {
    return TERRITORIES[this.gameState.currentTerritory].buildingSlots;
  }
  
  getUsedSlots() {
    return Object.values(this.buildings).filter(level => level > 0).length;
  }
}
```

### 3. Ethical Gacha - Wheel of Fate

```javascript
// gacha.js - "The heavens favor the persistent, not the wealthy."

const WHEEL_REWARDS = {
  common: {
    weight: 50,
    rewards: [
      { type: 'bp_boost', value: 1000, duration: 300 },
      { type: 'pp', value: 500 },
      { type: 'cosmetic', pool: 'common_hats' }
    ]
  },
  uncommon: {
    weight: 30,
    rewards: [
      { type: 'upgrade_material', value: 5 },
      { type: 'waifu_gift', rarity: 'nice' },
      { type: 'bp', value: 10000 }
    ]
  },
  rare: {
    weight: 15,
    rewards: [
      { type: 'cat', minRealm: 'earth' },
      { type: 'golden_feather', value: 1 },
      { type: 'destiny_thread', value: 10 }
    ]
  },
  epic: {
    weight: 4,
    rewards: [
      { type: 'cat', minRealm: 'heaven' },
      { type: 'legendary_material', value: 1 },
      { type: 'waifu_gift', rarity: 'legendary' }
    ]
  },
  legendary: {
    weight: 1,
    rewards: [
      { type: 'cat', realm: 'divine' },
      { type: 'exclusive_cosmetic', pool: 'legendary' },
      { type: 'secret_lore', value: 1 }
    ]
  }
};

const PITY_THRESHOLD = 50;

class WheelOfFate {
  constructor(gameState) {
    this.gameState = gameState;
    this.pityCounter = 0;
    this.lastFreeSpinTime = 0;
    this.FREE_SPIN_COOLDOWN = 3600000; // 1 hour
  }
  
  canFreeSpin() {
    return Date.now() - this.lastFreeSpinTime >= this.FREE_SPIN_COOLDOWN;
  }
  
  canSpinWithThreads() {
    return this.gameState.destinyThreads >= 10;
  }
  
  getTimeUntilFreeSpin() {
    const elapsed = Date.now() - this.lastFreeSpinTime;
    return Math.max(0, this.FREE_SPIN_COOLDOWN - elapsed);
  }
  
  spin(useFree = true) {
    if (useFree && !this.canFreeSpin()) return null;
    if (!useFree && !this.canSpinWithThreads()) return null;
    
    if (useFree) {
      this.lastFreeSpinTime = Date.now();
    } else {
      this.gameState.destinyThreads -= 10;
    }
    
    // Determine rarity
    let rarity = this.rollRarity();
    
    // Pity system
    this.pityCounter++;
    if (rarity !== 'legendary' && this.pityCounter >= PITY_THRESHOLD) {
      rarity = 'legendary';
      this.pityCounter = 0;
      this.showPityMessage();
    } else if (rarity === 'legendary') {
      this.pityCounter = 0;
    }
    
    // Get reward from pool
    const rewardPool = WHEEL_REWARDS[rarity].rewards;
    const reward = rewardPool[Math.floor(Math.random() * rewardPool.length)];
    
    // Apply reward
    const result = this.applyReward(reward, rarity);
    
    return {
      rarity,
      reward: result,
      pityCounter: this.pityCounter,
      animation: this.getSpinAnimation(rarity)
    };
  }
  
  rollRarity() {
    const totalWeight = Object.values(WHEEL_REWARDS).reduce((sum, r) => sum + r.weight, 0);
    let roll = Math.random() * totalWeight;
    
    for (const [rarity, data] of Object.entries(WHEEL_REWARDS)) {
      roll -= data.weight;
      if (roll <= 0) return rarity;
    }
    
    return 'common';
  }
  
  applyReward(reward, rarity) {
    switch (reward.type) {
      case 'bp':
      case 'bp_boost':
        this.gameState.boopPoints += reward.value;
        return { ...reward, message: `+${formatNumber(reward.value)} BP!` };
        
      case 'pp':
        this.gameState.purrPower += reward.value;
        return { ...reward, message: `+${formatNumber(reward.value)} PP!` };
        
      case 'cat':
        const cat = generateRandomCat({ 
          minRealm: reward.minRealm, 
          realm: reward.realm 
        });
        this.gameState.cats.push(cat);
        return { ...reward, cat, message: `New cat: ${cat.name}!` };
        
      case 'golden_feather':
        this.gameState.goldenFeathers += reward.value;
        return { ...reward, message: `+${reward.value} Golden Feather!` };
        
      case 'cosmetic':
      case 'exclusive_cosmetic':
        const cosmetic = this.rollCosmetic(reward.pool);
        this.gameState.cosmeticsOwned.push(cosmetic.id);
        return { ...reward, cosmetic, message: `New cosmetic: ${cosmetic.name}!` };
        
      default:
        return reward;
    }
  }
  
  showPityMessage() {
    // "The heavens have smiled upon you after your perseverance!"
  }
}
```

### 4. Lore & Memory Fragment System

```javascript
// lore.js - "Every cat has a tale. Every master, a secret."

const LORE_ENTRIES = {
  // Cat lore (unlocked by booping 1000 times)
  cats: {
    ceiling_god: {
      title: "The All-Seeing",
      fragments: 5,
      story: `In the beginning, there was only the Ceiling...`,
      unlockedBy: { boops: 1000 }
    },
    untitled_goose: {
      title: "Origin of Chaos", 
      fragments: 7,
      story: `Before the Celestial Snoot Sect, before the Seven Masters...`,
      unlockedBy: { gooseBoops: 500 }
    }
  },
  
  // Master relationships
  masters: {
    gerald_rusty: {
      title: "The First Meeting",
      fragments: 10,
      story: `They met on opposite sides of a battlefield...`,
      unlockedBy: { playBoth: ['gerald', 'rusty'], hours: 5 }
    },
    steve_andrew: {
      title: "Speed vs Strategy",
      fragments: 8,
      story: `"You can't out-calculate instinct!" Andrew shouted...`,
      unlockedBy: { playBoth: ['steve', 'andrew'], hours: 5 }
    },
    nik_yuelin: {
      title: "The Silent and the Sage",
      fragments: 12,
      story: `Yuelin was the first to hear Nik speak...`,
      unlockedBy: { playBoth: ['nik', 'yuelin'], hours: 5 }
    },
    scott_origin: {
      title: "The Thousand Day Meditation",
      fragments: 15,
      story: `On the first day, Scott sat. On the thousandth day...`,
      unlockedBy: { afkHours: 100 }
    }
  },
  
  // Waifu secrets
  waifus: {
    mochi_secret: {
      title: "The Warrior's Tea",
      fragments: 10,
      story: `Few know that Mochi-chan was once a fierce warrior...`,
      unlockedBy: { bond: 100 }
    },
    luna_past: {
      title: "Why She Watches the Night",
      fragments: 12,
      story: `Luna doesn't sleep because she fears the dreams...`,
      unlockedBy: { bond: 100 }
    },
    nyanta_treasure: {
      title: "The Real Treasure",
      fragments: 8,
      story: `Captain Nyanta sailed the seven seas seeking gold...`,
      unlockedBy: { bond: 100 }
    }
  }
};

class LoreSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.collectedFragments = {};
    this.unlockedStories = [];
  }
  
  checkForFragmentDrop() {
    // 1% chance per boop to find a fragment
    if (Math.random() > 0.01) return null;
    
    // Find eligible lore entries
    const eligible = this.getEligibleLoreEntries();
    if (eligible.length === 0) return null;
    
    // Pick random entry
    const entry = eligible[Math.floor(Math.random() * eligible.length)];
    
    // Add fragment
    if (!this.collectedFragments[entry.id]) {
      this.collectedFragments[entry.id] = 0;
    }
    this.collectedFragments[entry.id]++;
    
    // Check if complete
    if (this.collectedFragments[entry.id] >= entry.data.fragments) {
      this.unlockStory(entry.id, entry.data);
    }
    
    return {
      entryId: entry.id,
      current: this.collectedFragments[entry.id],
      required: entry.data.fragments,
      title: entry.data.title
    };
  }
  
  getEligibleLoreEntries() {
    const eligible = [];
    
    for (const [category, entries] of Object.entries(LORE_ENTRIES)) {
      for (const [id, data] of Object.entries(entries)) {
        if (this.unlockedStories.includes(id)) continue;
        if (this.meetsUnlockCondition(data.unlockedBy)) {
          eligible.push({ id, data, category });
        }
      }
    }
    
    return eligible;
  }
  
  meetsUnlockCondition(condition) {
    if (condition.boops) {
      return this.gameState.totalBoops >= condition.boops;
    }
    if (condition.gooseBoops) {
      return this.gameState.gooseBoops >= condition.gooseBoops;
    }
    if (condition.bond) {
      return this.gameState.waifus.some(w => w.bondLevel >= condition.bond);
    }
    if (condition.playBoth) {
      // Check if both masters have been played
      return condition.playBoth.every(m => 
        this.gameState.masterPlaytime[m] >= (condition.hours * 3600)
      );
    }
    if (condition.afkHours) {
      return this.gameState.totalAfkTime >= condition.afkHours * 3600000;
    }
    return true;
  }
  
  unlockStory(id, data) {
    this.unlockedStories.push(id);
    this.gameState.notifications.push({
      type: 'lore_unlocked',
      title: `Lore Unlocked: ${data.title}`,
      message: 'Visit the Codex to read the full story!'
    });
  }
}
```

### 5. Day/Night & Seasonal Events

```javascript
// time.js - "The Jianghu changes with the sun and moon."

class TimeSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  getCurrentTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }
  
  isNightTime() {
    const hour = new Date().getHours();
    return hour >= 22 || hour < 6;
  }
  
  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }
  
  getTimeModifiers() {
    const modifiers = {};
    const timeOfDay = this.getCurrentTimeOfDay();
    const season = this.getCurrentSeason();
    
    // Night bonuses
    if (this.isNightTime()) {
      modifiers.lunaBonus = 1.5; // Luna Whiskerbell bonus increased
      modifiers.nocturnalCatBonus = 1.25; // Nocturnal cats produce more
    }
    
    // Seasonal bonuses
    switch (season) {
      case 'spring':
        modifiers.waifuBondGain = 1.25;
        break;
      case 'summer':
        modifiers.eventFrequency = 1.2;
        break;
      case 'autumn':
        modifiers.afkGains = 1.25;
        break;
      case 'winter':
        modifiers.giftQuality = 1.5;
        break;
    }
    
    return modifiers;
  }
  
  checkSpecialDates() {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    
    // Lunar New Year (late Jan/early Feb - simplified)
    if (month === 0 && day >= 20 || month === 1 && day <= 10) {
      return { event: 'lunar_new_year', bonus: 2.0 };
    }
    
    // Mid-Autumn Festival (mid September - simplified)
    if (month === 8 && day >= 10 && day <= 20) {
      return { event: 'mid_autumn', bonus: 1.5 };
    }
    
    // Check user's birthday
    if (this.gameState.userBirthday) {
      const [bMonth, bDay] = this.gameState.userBirthday.split('-').map(Number);
      if (month === bMonth - 1 && day === bDay) {
        return { event: 'birthday', bonus: 3.0 };
      }
    }
    
    return null;
  }
}

const SEASONAL_EVENTS = {
  lunar_new_year: {
    name: 'Lunar New Year Festival',
    duration: 14, // days
    bonuses: { allProduction: 2.0, luckySpins: true },
    exclusiveCat: 'fortune_dragon_cat',
    cosmetics: ['red_envelope_hat', 'firework_aura']
  },
  mid_autumn: {
    name: 'Mid-Autumn Moon Festival',
    duration: 7,
    bonuses: { waifuBonds: 1.5, nightBonus: 2.0 },
    exclusiveCat: 'moon_rabbit_cat',
    cosmetics: ['mooncake_hat', 'lantern_trail']
  },
  birthday: {
    name: 'Your Special Day',
    duration: 1,
    bonuses: { allProduction: 3.0, freeSpins: 10 },
    exclusiveCat: null,
    cosmetics: ['birthday_hat'],
    waifuMessages: true
  }
};
```

### 6. Easter Eggs

```javascript
// secrets.js - "The masters hid many treasures for the worthy."

class SecretSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.moonClicks = 0;
    this.konamiProgress = 0;
    this.lastBoopTime = Date.now();
  }
  
  onMoonClick() {
    this.moonClicks++;
    if (this.moonClicks >= 100 && !this.gameState.secrets.moonSecret) {
      this.gameState.secrets.moonSecret = true;
      this.triggerLunaSecret();
    }
  }
  
  triggerLunaSecret() {
    // Luna appears with special dialogue
    this.gameState.notifications.push({
      type: 'secret',
      title: 'Luna noticed you...',
      message: '"You... like the moon too? *sleepy smile* Here, take this..."',
      reward: { cosmetic: 'moonbeam_aura' }
    });
  }
  
  onCatNamed(cat, name) {
    if (name.toLowerCase() === 'nyan') {
      cat.permanentTrail = 'rainbow';
      this.gameState.achievements.unlock('nyan_easter_egg');
    }
  }
  
  checkKonamiCode(key) {
    const KONAMI = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
    
    if (key === KONAMI[this.konamiProgress]) {
      this.konamiProgress++;
      if (this.konamiProgress >= KONAMI.length) {
        this.activateRetroMode();
        this.konamiProgress = 0;
      }
    } else {
      this.konamiProgress = 0;
    }
  }
  
  activateRetroMode() {
    this.gameState.visualMode = 'retro';
    this.gameState.notifications.push({
      type: 'secret',
      title: '[ RETRO MODE ACTIVATED ]',
      message: 'The ancient ways have been restored!'
    });
  }
  
  checkNiceNumber() {
    if (this.gameState.boopPoints === 69420 && !this.gameState.achievements.has('nice')) {
      this.gameState.achievements.unlock('nice');
      this.gameState.notifications.push({
        type: 'achievement',
        title: 'Nice.',
        message: '( ͡° ͜ʖ ͡°)'
      });
    }
  }
  
  checkAFKCat() {
    const timeSinceLastBoop = Date.now() - this.lastBoopTime;
    
    // 10 minutes of no booping
    if (timeSinceLastBoop >= 600000 && !this.gameState.secrets.afkCatAppeared) {
      this.gameState.secrets.afkCatAppeared = true;
      this.spawnMysteriousCat();
    }
  }
  
  spawnMysteriousCat() {
    const mysteryCat = {
      id: 'mystery_cat',
      name: '??? Cat',
      title: 'The Patient One',
      description: 'This cat only appears to those who wait...',
      realm: 'divine',
      rarity: 'secret',
      stats: { /* special stats */ }
    };
    
    this.gameState.cats.push(mysteryCat);
    this.gameState.notifications.push({
      type: 'secret',
      title: 'A presence emerges from the stillness...',
      message: '??? Cat has joined your sect!'
    });
  }
  
  checkNikFourthWall() {
    // 1% chance when viewing Nik
    if (Math.random() < 0.01) {
      // Nik's sprite briefly looks at camera
      return { sprite: 'nik_fourth_wall.png', duration: 500 };
    }
    return null;
  }
  
  checkMochiPlaytimeWarning() {
    if (this.gameState.currentSessionTime >= 5 * 3600000) { // 5 hours
      return {
        character: 'mochi',
        message: "You've been cultivating for quite a while, nya~ Maybe take a break? I'll watch the cats for you! 💕"
      };
    }
    return null;
  }
  
  onGooseStealUI() {
    // Untitled Goose occasionally "steals" UI elements
    if (Math.random() < 0.001) { // Very rare
      return {
        stolenElement: 'boop_button', // or 'resource_counter', 'settings_icon'
        duration: 5000,
        message: 'HONK! *waddles away with your button*'
      };
    }
    return null;
  }
}
```

### Wuxia 8-Bit Color Palette

```css
:root {
  /* Base colors - inspired by traditional Chinese art */
  --bg-dark: #1a1a2e;           /* Night sky */
  --bg-light: #16213e;          /* Deep water */
  --bg-parchment: #f4e4bc;      /* Scroll paper */
  
  /* Primary - Jade (Gerald's color) */
  --jade: #50C878;
  --jade-light: #7FFFD4;
  --jade-dark: #3D9970;
  
  /* Accent colors - The Seven Masters */
  --crimson: #DC143C;           /* Rusty */
  --river-blue: #4169E1;        /* Steve */
  --thunder-gold: #FFD700;      /* Andrew */
  --shadow-purple: #483D8B;     /* Nik */
  --lotus-pink: #FFB6C1;        /* Yuelin */
  --mountain-brown: #8B4513;    /* Scott */
  
  /* Goose colors 🦢 */
  --goose-white: #F5F5F5;       /* Normal Goose */
  --goose-rage: #FF4500;        /* RAGE mode */
  --goose-golden: #FFD700;      /* Golden Goose */
  --goose-chaos: #8B008B;       /* Cobra Chicken */
  --honk-yellow: #FFFF00;       /* HONK text */
  
  /* UI Elements */
  --gold-accent: #FFD700;       /* Important highlights */
  --red-accent: #E94560;        /* Boop button, alerts */
  --qi-blue: #00BFFF;           /* Qi effects */
  --critical-gold: #FFF8DC;     /* Crit boops */
  
  /* Cat happiness indicators */
  --happy: #6bc5d2;
  --neutral: #f9ed69;
  --unhappy: #ff6b6b;
  
  /* Realms */
  --mortal: #A0A0A0;
  --earth: #8B4513;
  --sky: #87CEEB;
  --heaven: #FFD700;
  --divine: #FFFFFF;
}
```

### Wuxia UI Elements

```css
/* Scroll-style panels */
.scroll-panel {
  background: linear-gradient(to bottom, 
    var(--bg-parchment) 0%,
    #e8d4a8 50%,
    var(--bg-parchment) 100%
  );
  border: 4px solid var(--mountain-brown);
  border-radius: 2px;
  box-shadow: 
    inset 0 0 20px rgba(0,0,0,0.1),
    4px 4px 0 rgba(0,0,0,0.3);
  padding: 16px;
  image-rendering: pixelated;
}

/* Jade button style */
.jade-button {
  background: linear-gradient(135deg, var(--jade-light), var(--jade-dark));
  border: 3px solid var(--jade-dark);
  color: #fff;
  text-shadow: 1px 1px 0 #000;
  font-family: 'Press Start 2P', monospace;
  padding: 12px 24px;
  cursor: pointer;
  transition: transform 0.1s;
}

.jade-button:active {
  transform: scale(0.95);
}

/* THE SACRED BOOP BUTTON */
.boop-button {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, 
    var(--red-accent), 
    #b8304f
  );
  border: 6px solid #8B0000;
  box-shadow: 
    0 8px 0 #5c0a0a,
    0 0 30px rgba(233, 69, 96, 0.5);
  font-family: 'Press Start 2P', monospace;
  font-size: 14px;
  color: white;
  text-shadow: 2px 2px 0 #000;
  cursor: pointer;
  transition: all 0.1s;
}

.boop-button:active {
  transform: translateY(4px);
  box-shadow: 
    0 4px 0 #5c0a0a,
    0 0 50px rgba(233, 69, 96, 0.8);
}

/* Qi effect animations */
@keyframes qi-flow {
  0% { 
    transform: translateY(0) scale(1); 
    opacity: 1; 
  }
  100% { 
    transform: translateY(-50px) scale(1.5); 
    opacity: 0; 
  }
}

.qi-particle {
  animation: qi-flow 0.8s ease-out forwards;
  color: var(--qi-blue);
  text-shadow: 0 0 10px var(--qi-blue);
}

.qi-particle.critical {
  color: var(--critical-gold);
  text-shadow: 0 0 20px var(--thunder-gold);
  font-size: 1.5em;
}
```

### Master Select Screen

```javascript
// Character select at game start
function renderMasterSelect() {
  return `
    <div class="master-select-screen">
      <h1 class="title">Choose Your Path</h1>
      <p class="subtitle">Select a Master of the Celestial Snoot Sect</p>
      
      <div class="masters-grid">
        ${Object.values(MASTERS).map(master => `
          <div class="master-card" data-master="${master.id}" 
               style="--master-color: ${master.color}">
            <img src="${master.sprite}" class="master-portrait" />
            <h3>${master.name}</h3>
            <p class="title">${master.title}</p>
            <p class="passive">${master.passive.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
```

---

## Content Guidelines

### Cat Naming - Wuxia Style

**Format:** `[School] [Descriptor] [Cat Type]`
- Shaolin Iron Tabby
- Wudang Flowing Persian
- Emei Jade Beauty
- Beggar Street Scrapper
- Scholar's Wise Siamese

**Legendary Format:** `[Title], the [Epithet]`
- Ceiling Cat, the All-Seeing
- Keyboard Cat, Melody of Ages
- Longcat, the Infinite
- The Eternal Loaf, Master of Stillness

### Waifu Dialogue - Age of Wushu Inspired

**Greeting Patterns:**
```
[Morning] "The sun rises on our sect. Another day of cultivation awaits."
[Afternoon] "The Qi flows strong at this hour. Perfect for booping."
[Evening] "As the day ends, the cats prepare for their night meditation."
[Night] "The moon watches over our snoots. Cultivate well."
```

**Bond Level Progression:**
- **Low (0-25):** Formal, instructional, distant
- **Mid (26-50):** Warmer, shares personal stories
- **High (51-75):** Affectionate, protective, opens up
- **Max (76-100):** Devoted, romantic undertones (tasteful), grants legendary cat

### The Seven Masters Dialogue Style

| Master | Speech Pattern | Example |
|--------|---------------|---------|
| Gerald | Calm, wise, balanced | "Every boop brings us closer to enlightenment." |
| Rusty | Intense, enthusiastic, loud | "THAT'S THE SPIRIT! BOOP HARDER!" |
| Steve | Analytical, measured, patient | "At this rate, we'll reach 10K PP in approximately 3.7 hours." |
| Andrew | Energetic, rushed, excited | "Newcatneweventgottago--!" |
| Nik | Minimal, cryptic, dramatic | "...the snoot calls." |
| Yuelin | Gentle, nurturing, mystical | "The cats sense your kindness. They are grateful." |
| Scott | Stoic, slow, profound | "...I have been booping this cat...for six hours...worth it." |

---

## Testing Checklist

### Core Mechanics
- [ ] Boop registers correctly, Qi particles appear
- [ ] Each Master's passive works correctly
- [ ] Combo system tracks and displays properly
- [ ] Critical boops trigger at correct rate (+ Nik bonus)
- [ ] PP generates while tab is open
- [ ] PP generates correctly while AFK (+ Steve bonus)
- [ ] All Seven Masters are selectable

### Cat System
- [ ] All realms (Mortal→Divine) can be obtained
- [ ] All schools (Shaolin, Wudang, etc.) represented
- [ ] Cat stats affect gameplay correctly
- [ ] Legendary cats require proper unlock conditions
- [ ] Andrew's rare cat bonus works

### Waifu System
- [ ] All six waifus unlockable via conditions
- [ ] Bond levels persist and increase correctly
- [ ] Gift affinities working (love/like/neutral/dislike)
- [ ] Dialogue changes with bond level
- [ ] Max bond rewards legendary cat

### Save/Load
- [ ] Auto-save triggers every 30 seconds
- [ ] Master selection persists
- [ ] AFK calculations correct (Steve's bonus applied)
- [ ] Goose Ally selection persists
- [ ] Export/Import for sharing works
- [ ] Version migration doesn't break saves

### Goose System 🦢
- [ ] Geese spawn at correct rate (~2% per minute)
- [ ] All mood states behave correctly (speed, dodge, rewards)
- [ ] Legendary Geese spawn at correct rarities
- [ ] Untitled Goose steals resources on escape
- [ ] Golden Goose drops premium currency
- [ ] Cobra Chicken requires 1000 boops to appear
- [ ] Cobra Chicken requires multiple hits to defeat
- [ ] Goose Ally system unlocks after Cobra Chicken
- [ ] All four Goose Allies apply bonuses correctly
- [ ] Cats scatter/fear when Goose appears
- [ ] Brave Heart buff applies to courageous cats
- [ ] Ceiling Cat immune to Goose fear
- [ ] HJÖNK achievement triggers on Golden Goose crit

### Sect War (Multiplayer Prep)
- [ ] Stats tracked for leaderboard
- [ ] Export format includes competitive data
- [ ] Friend comparison data structure ready

---

## Discord Integration for The Sect

### Shareable Elements

```javascript
// Generate shareable cultivation summary
function generateSectCard(gameState) {
  return {
    title: `${gameState.master.name}'s Cultivation Record`,
    subtitle: gameState.master.title,
    stats: {
      'Total Boops': formatNumber(gameState.totalBoops),
      'Cats Recruited': gameState.cats.length,
      'Highest Realm': getHighestRealm(gameState.cats),
      'Waifu Bonds': getTotalBondLevel(gameState.waifus),
      'Max Combo': gameState.maxCombo
    },
    favoriteCat: getMostBooopedCat(gameState),
    favoriteWaifu: getHighestBondWaifu(gameState),
    achievement: getLatestAchievement(gameState)
  };
}

// Competitive comparison
function compareSects(myState, friendState) {
  return {
    boopWinner: myState.totalBoops > friendState.totalBoops ? 'you' : 'friend',
    catWinner: myState.cats.length > friendState.cats.length ? 'you' : 'friend',
    rareWinner: getRarityScore(myState.cats) > getRarityScore(friendState.cats) ? 'you' : 'friend'
  };
}
```

### Achievement Announcements

```
🏆 Gerald the Jade Palm has achieved "Ten Thousand Boops"!
🐱 Rusty the Crimson Fist recruited a DIVINE realm cat!
💕 Steve the Flowing River reached max bond with Luna Whiskerbell!
⚔️ SECT WAR: Andrew leads with 50,000 boops this week!
```

---

## Performance Optimization

### Big Number Handling (Late Game Cultivation)

```javascript
// Wuxia-themed number suffixes
const CULTIVATION_SUFFIXES = [
  '', 'K', 'M', 'B', 'T',
  'Qi', 'Dao', 'Xian', 'Tian', 'Shen'
  // Thousand, Million, Billion, Trillion,
  // Qi (Energy), Dao (Way), Xian (Immortal), Tian (Heaven), Shen (Divine)
];

function formatCultivationNumber(n) {
  if (n < 1000) return Math.floor(n).toString();
  
  const tier = Math.min(
    Math.floor(Math.log10(Math.abs(n)) / 3),
    CULTIVATION_SUFFIXES.length - 1
  );
  
  const suffix = CULTIVATION_SUFFIXES[tier];
  const scaled = n / Math.pow(10, tier * 3);
  
  return scaled.toFixed(1) + ' ' + suffix;
}

// Examples:
// 999 → "999"
// 1500 → "1.5 K"
// 1000000000000 → "1.0 T"
// 1e15 → "1.0 Qi"
// 1e24 → "1.0 Tian"
```

---

## Quick Reference

### Key Formulas

**BP per Boop:**
```
BP = basePower 
   * (1 + upgradeBonus) 
   * masterBonus 
   * waifuBonus 
   * comboMultiplier 
   * (isCrit ? critMultiplier : 1)
```

**PP per Second:**
```
PP = Σ(cat.innerPurr * cat.happiness * cat.loafMastery * realmMultiplier) 
   * waifuBonus 
   * upgradeBonus 
   * (isAFK ? masterAFKBonus : 1)
```

**Critical Chance:**
```
critChance = baseCrit + nikBonus + upgradeBonus
```

**Combo Multiplier:**
```
comboMult = 1 + (min(comboCount, 100) * 0.01)
// Max 2x at 100 combo
```

---

## The Seven Maxims (For Reference)

1. *"The journey of a thousand boops begins with a single snoot."*
2. *"In stillness, the cat cultivates. In booping, the master cultivates."*
3. *"Gerald says: Balance in all things. Especially snoots."*
4. *"Rusty says: When in doubt, boop harder."*
5. *"Steve says: Optimal cultivation requires optimal patience."*
6. *"Nik says: ..."*
7. *"The ultimate technique? Enjoying the journey with friends."*

---

## Final Reminders

1. **Playtest with the boys** - Get Gerald, Rusty, Steve, Andrew, Nik, Yuelin, and Scott to test
2. **Maintain the vibe** - Wuxia + cats + waifus + friendship
3. **Each Master should feel unique** - Their passives should matter
4. **Keep it competitive but friendly** - Sect Wars should be fun, not toxic
5. **The snoots are sacred** - Never compromise on boop satisfaction

---

*"When the Seven Masters unite, no snoot shall go un-booped."*
— The Celestial Snoot Scripture 🐱⚔️✨