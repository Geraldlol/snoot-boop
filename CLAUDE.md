# CLAUDE.md - Snoot Booper: Wuxia Development Guide

> *"The journey of a thousand boops begins with a single snoot."*
> — The Celestial Snoot Scripture

**Document Version:** 2.0 (Grand Enhancement Edition)
**Last Updated:** Phase 8 Complete

---

## Project Overview

**Game:** Snoot Booper: Idle Wuxia Cat Sanctuary
**Genre:** 8-bit AFK Idle/Clicker with Wuxia/Cultivation Theme
**Platform:** Web (Discord-shareable for the boys)
**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (or React if complexity grows)
**Vibe:** Cute cats, martial arts mysticism, waifu masters, BOOP THE SNOOTS
**Inspiration:** Age of Wushu, classic Wuxia novels, Cookie Clicker, Hades, Slay the Spire, Vampire Survivors, cat memes

### Design Pillars
1. **Deep, Layered Progression** — Cookie Clicker depth with meaningful choices
2. **Wuxia Authenticity** — Age of Wushu theming done right
3. **Polish & Juice** — Hades-level feedback on every action
4. **Social Competition** — Built for seven Discord friends to compare and compete
5. **Respect Player Time** — AFK should feel rewarding, not punishing

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
├── index.html                  # Main game entry
├── css/
│   ├── main.css                # Core styles
│   ├── wuxia-theme.css         # Chinese aesthetic, scrolls, jade
│   ├── 8bit.css                # Pixel art utilities
│   ├── animations.css          # Qi effects, boops, cultivation
│   └── dungeon.css             # Dungeon-specific styles
├── js/
│   ├── core/
│   │   ├── game.js             # Main game loop & state
│   │   ├── eventBus.js         # Cross-system communication
│   │   ├── bigNumber.js        # Late-game number handling
│   │   └── constants.js        # Global constants
│   ├── systems/
│   │   ├── masters.js          # The Seven (Eight) Masters
│   │   ├── cultivation.js      # Realm progression & tribulations
│   │   ├── boop.js             # Boop system & techniques
│   │   ├── cats.js             # Cat collection & cultivation
│   │   ├── catTeam.js          # Team formation & synergies
│   │   ├── catFusion.js        # Fusion & evolution
│   │   ├── waifus.js           # Waifu bonding & teaching
│   │   ├── goose.js            # The Way of the Goose
│   │   ├── resources.js        # Multi-currency economy
│   │   ├── idle.js             # AFK & Dream Realm
│   │   ├── buildings.js        # Sect buildings & territory
│   │   ├── equipment.js        # Gear system & sets
│   │   ├── relics.js           # Dungeon relics
│   │   └── prestige.js         # Ascension/Reincarnation/Transcendence
│   ├── dungeons/
│   │   ├── pagoda.js           # Infinite Pagoda
│   │   ├── bambooForest.js     # Wave survival mode
│   │   ├── tournament.js       # Celestial Tournament
│   │   ├── dreamRealm.js       # Procedural dream dungeon
│   │   └── gooseDimension.js   # Comedy horror dungeon
│   ├── ui/
│   │   ├── screens.js          # Screen management
│   │   ├── modals.js           # Modal dialogs
│   │   ├── notifications.js    # Toast & alerts
│   │   ├── particles.js        # Visual effects
│   │   └── tutorial.js         # Progressive disclosure
│   ├── data/
│   │   ├── save.js             # Save/Load with migration
│   │   ├── achievements.js     # Achievement tracking
│   │   ├── lore.js             # Story fragments
│   │   └── secrets.js          # Easter eggs
│   ├── social/
│   │   ├── sectwar.js          # Competitive features
│   │   ├── sharing.js          # Discord integration
│   │   └── leaderboard.js      # Rankings
│   └── events/
│       ├── random.js           # Jianghu random events
│       ├── daily.js            # Daily challenges
│       ├── seasonal.js         # Festivals & holidays
│       └── time.js             # Day/night & seasons
├── assets/
│   ├── sprites/
│   │   ├── masters/            # Gerald, Rusty, Steve, etc. (per realm)
│   │   ├── cats/               # All cat sprites by realm & element
│   │   ├── waifus/             # Twelve Immortal Masters
│   │   ├── enemies/            # Dungeon enemies
│   │   ├── geese/              # All goose variants
│   │   ├── equipment/          # Gear sprites
│   │   └── effects/            # Qi, boops, tribulation FX
│   ├── audio/
│   │   ├── music/              # Chiptune + Chinese instruments
│   │   ├── sfx/                # Boops (with variation), mrrps, gongs
│   │   └── voice/              # Waifu voice lines (optional)
│   ├── backgrounds/            # Sect buildings, dungeons, territories
│   └── fonts/                  # Pixel fonts, brush fonts
├── data/
│   ├── masters.json            # Eight Masters definitions
│   ├── cats.json               # Cat collection (100+ cats)
│   ├── waifus.json             # Twelve waifus with full dialogue
│   ├── techniques.json         # Boop techniques & stances
│   ├── cultivation.json        # Realm requirements & tribulations
│   ├── equipment.json          # All gear & sets
│   ├── relics.json             # Dungeon relics
│   ├── enemies.json            # Enemy definitions
│   ├── events.json             # Random & seasonal events
│   ├── achievements.json       # All achievements
│   ├── lore.json               # Story fragments
│   └── balance.json            # All scaling curves & formulas
├── PROMPT.md                   # Game design document
├── CLAUDE.md                   # This file
└── README.md                   # Setup instructions
```

---

## Core Systems Implementation

---

### 0. Master Cultivation Realm System

The primary progression axis for players. Inspired by Xianxia novel cultivation with 10 major realms, each containing 9 sub-ranks.

```javascript
// cultivation.json - The Path to Immortality
const CULTIVATION_REALMS = {
  mortal: {
    id: 'mortal',
    name: 'Mortal Realm',
    order: 1,
    ranks: 9,
    description: 'The beginning of the path. You are but a wanderer in the Jianghu.',
    color: '#A0A0A0',
    xpBase: 100,
    xpScale: 1.15,      // Per rank within realm
    realmScale: 3.0,     // Multiplier when entering this realm
    tribulation: null,   // No tribulation to enter Mortal
    unlocks: ['basic_boop', 'cat_sanctuary'],
    passives: {
      1: { name: 'Awakened Spirit', effect: { boopPower: 1.1 } },
      5: { name: 'Mortal Foundation', effect: { ppGeneration: 1.15 } },
      9: { name: 'Mortal Peak', effect: { critChance: 0.02 } }
    },
    spriteVariant: 'mortal'
  },

  qiCondensation: {
    id: 'qiCondensation',
    name: 'Qi Condensation',
    order: 2,
    ranks: 9,
    description: 'You have begun to sense the Qi of the world. The snoots call to you.',
    color: '#87CEEB',
    xpBase: 1000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Tribulation of Awakening',
      type: 'boss',
      enemy: 'inner_demon_kitten',
      failPenalty: { xpLoss: 0.5 },
      rewards: { jadeCatnip: 100 }
    },
    unlocks: ['technique_stances', 'cat_training'],
    passives: {
      1: { name: 'Qi Sense', effect: { eventDiscovery: 1.1 } },
      5: { name: 'Meridian Opening', effect: { boopPower: 1.25 } },
      9: { name: 'Condensation Complete', effect: { afkEfficiency: 1.2 } }
    },
    spriteVariant: 'qi_condensation'
  },

  foundationEstablishment: {
    id: 'foundationEstablishment',
    name: 'Foundation Establishment',
    order: 3,
    ranks: 9,
    description: 'Your foundation is set. The cats recognize you as a true cultivator.',
    color: '#8B4513',
    xpBase: 10000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Tribulation of Foundation',
      type: 'survival',
      waves: 5,
      failPenalty: { xpLoss: 0.5, catHappiness: -10 },
      rewards: { jadeCatnip: 500, cat: 'earth_realm_random' }
    },
    unlocks: ['cat_teams', 'first_waifu', 'meditation_garden'],
    passives: {
      1: { name: 'Stable Foundation', effect: { multiplierDecay: 0.5 } },
      5: { name: 'Inner Strength', effect: { tribulationPower: 1.2 } },
      9: { name: 'Foundation Peak', effect: { catCapacity: 10 } }
    },
    spriteVariant: 'foundation'
  },

  coreFormation: {
    id: 'coreFormation',
    name: 'Core Formation',
    order: 4,
    ranks: 9,
    description: 'A golden core forms within you. Your boops shake the heavens.',
    color: '#FFD700',
    xpBase: 100000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Tribulation of the Golden Core',
      type: 'boss',
      enemy: 'shadow_goose',
      failPenalty: { xpLoss: 0.5, coreDamage: true },
      rewards: { jadeCatnip: 2000, technique: 'golden_boop' }
    },
    unlocks: ['infinite_pagoda', 'equipment_system', 'waifu_teaching'],
    passives: {
      1: { name: 'Golden Core', effect: { allStats: 1.1 } },
      5: { name: 'Core Resonance', effect: { catSynergy: 1.25 } },
      9: { name: 'Perfect Core', effect: { critDamage: 1.5 } }
    },
    spriteVariant: 'core_formation'
  },

  nascentSoul: {
    id: 'nascentSoul',
    name: 'Nascent Soul',
    order: 5,
    ranks: 9,
    description: 'A nascent soul emerges. You are no longer bound by mortal limits.',
    color: '#9370DB',
    xpBase: 1000000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Soul Tribulation',
      type: 'puzzle',
      challenge: 'soul_fragments',
      failPenalty: { xpLoss: 0.5, soulDamage: true },
      rewards: { jadeCatnip: 10000, cat: 'sky_realm_random' }
    },
    unlocks: ['dream_realm', 'cat_fusion', 'territory_expansion'],
    passives: {
      1: { name: 'Soul Awakening', effect: { offlineGains: 1.5 } },
      5: { name: 'Soul Projection', effect: { dungeonSpeed: 1.25 } },
      9: { name: 'Complete Soul', effect: { deathDefiance: 1 } }
    },
    spriteVariant: 'nascent_soul'
  },

  spiritSevering: {
    id: 'spiritSevering',
    name: 'Spirit Severing',
    order: 6,
    ranks: 9,
    description: 'You sever ties with the mundane. Only the Dao of Snoot remains.',
    color: '#DC143C',
    xpBase: 10000000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Severing Tribulation',
      type: 'choice',
      challenge: 'heart_demons',
      failPenalty: { xpLoss: 0.5, permanentScar: true },
      rewards: { jadeCatnip: 50000, forbiddenTechnique: 1 }
    },
    unlocks: ['ascension_preview', 'legendary_cats', 'waifu_cultivation'],
    passives: {
      1: { name: 'Severed Attachments', effect: { immuneToTheft: true } },
      5: { name: 'Spirit Blade', effect: { boopPower: 2.0 } },
      9: { name: 'Complete Severance', effect: { allPassives: 1.1 } }
    },
    spriteVariant: 'spirit_severing'
  },

  daoSeeking: {
    id: 'daoSeeking',
    name: 'Dao Seeking',
    order: 7,
    ranks: 9,
    description: 'You seek the ultimate truth. What is the Dao of the Snoot?',
    color: '#4169E1',
    xpBase: 100000000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Dao Heart Tribulation',
      type: 'gauntlet',
      stages: 9,
      failPenalty: { xpLoss: 0.75, daoWounds: true },
      rewards: { jadeCatnip: 250000, cat: 'heaven_realm_random' }
    },
    unlocks: ['reincarnation_preview', 'divine_cats', 'goose_dimension'],
    passives: {
      1: { name: 'Dao Glimpse', effect: { rareEventChance: 2.0 } },
      5: { name: 'Dao Comprehension', effect: { xpGain: 1.5 } },
      9: { name: 'Dao Heart', effect: { tribulationSuccess: 1.25 } }
    },
    spriteVariant: 'dao_seeking'
  },

  immortalAscension: {
    id: 'immortalAscension',
    name: 'Immortal Ascension',
    order: 8,
    ranks: 9,
    description: 'You stand at the threshold of immortality. The heavens take notice.',
    color: '#FFD700',
    xpBase: 1000000000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Heavenly Tribulation',
      type: 'epic_boss',
      enemy: 'cosmic_goose',
      failPenalty: { death: true }, // Full reset without prestige
      rewards: { heavenlySeals: 10, cat: 'divine_realm_guaranteed' }
    },
    unlocks: ['ascension_system', 'eighth_master_hints', 'celestial_realm'],
    passives: {
      1: { name: 'Immortal Body', effect: { hpRegen: 2.0 } },
      5: { name: 'Immortal Qi', effect: { qiCapacity: 2.0 } },
      9: { name: 'Almost Immortal', effect: { permanentBonus: 1.5 } }
    },
    spriteVariant: 'immortal_ascension'
  },

  trueImmortal: {
    id: 'trueImmortal',
    name: 'True Immortal',
    order: 9,
    ranks: 9,
    description: 'You have transcended mortality. The cats bow before your eternal snoot.',
    color: '#FFFFFF',
    xpBase: 10000000000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Transcendence Tribulation',
      type: 'ultimate',
      challenge: 'face_the_void',
      failPenalty: { reincarnationForced: true },
      rewards: { transcendencePoints: 1, legendaryTitle: true }
    },
    unlocks: ['transcendence_preview', 'true_form', 'cosmic_cats'],
    passives: {
      1: { name: 'Eternal Life', effect: { offlineTimeLimit: null } }, // Unlimited AFK
      5: { name: 'True Understanding', effect: { allMultipliers: 2.0 } },
      9: { name: 'True Immortal Peak', effect: { readyForTranscendence: true } }
    },
    spriteVariant: 'true_immortal'
  },

  heavenlySovereign: {
    id: 'heavenlySovereign',
    name: 'Heavenly Sovereign',
    order: 10,
    ranks: Infinity, // Infinite scaling
    description: 'You have become one with the heavens. Your snoot IS the Dao.',
    color: '#FFD700',
    xpBase: 100000000000,
    xpScale: 1.2, // Steeper scaling for infinite content
    realmScale: null, // N/A - infinite
    tribulation: null, // No more tribulations - you ARE the tribulation
    unlocks: ['everything'], // All content unlocked
    passives: {
      // Every 10 ranks grants a new passive
      scaling: {
        every: 10,
        effect: { allStats: 1.1 }
      }
    },
    spriteVariant: 'heavenly_sovereign'
  }
};

// Tribulation System
class TribulationSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.activeTribulation = null;
  }

  canAttemptBreakthrough(targetRealm) {
    const realm = CULTIVATION_REALMS[targetRealm];
    const currentXP = this.gameState.cultivationXP;
    const requiredXP = this.calculateXPRequired(targetRealm);

    return currentXP >= requiredXP;
  }

  calculateXPRequired(realmId) {
    const realm = CULTIVATION_REALMS[realmId];
    let totalXP = 0;

    // Sum XP from all previous realms
    for (const [id, r] of Object.entries(CULTIVATION_REALMS)) {
      if (r.order < realm.order) {
        for (let rank = 1; rank <= r.ranks; rank++) {
          totalXP += r.xpBase * Math.pow(r.xpScale, rank - 1);
        }
        totalXP *= r.realmScale || 1;
      }
    }

    return totalXP;
  }

  startTribulation(targetRealm) {
    const realm = CULTIVATION_REALMS[targetRealm];
    if (!realm.tribulation) {
      // Auto-succeed for realms without tribulations
      return this.succeedTribulation(targetRealm);
    }

    this.activeTribulation = {
      realm: targetRealm,
      tribulation: realm.tribulation,
      startTime: Date.now(),
      attempts: (this.gameState.tribulationAttempts[targetRealm] || 0) + 1
    };

    return {
      status: 'started',
      type: realm.tribulation.type,
      name: realm.tribulation.name
    };
  }

  succeedTribulation(realmId) {
    const realm = CULTIVATION_REALMS[realmId];

    this.gameState.cultivationRealm = realmId;
    this.gameState.cultivationRank = 1;

    // Apply unlocks
    for (const unlock of realm.unlocks) {
      this.gameState.unlocked[unlock] = true;
    }

    // Grant rewards
    if (realm.tribulation?.rewards) {
      this.grantRewards(realm.tribulation.rewards);
    }

    this.activeTribulation = null;

    return {
      status: 'success',
      newRealm: realm.name,
      unlocks: realm.unlocks,
      rewards: realm.tribulation?.rewards
    };
  }

  failTribulation() {
    const realm = CULTIVATION_REALMS[this.activeTribulation.realm];
    const penalty = realm.tribulation.failPenalty;

    // Apply penalties
    if (penalty.xpLoss) {
      this.gameState.cultivationXP *= (1 - penalty.xpLoss);
    }

    // Grant consolation rewards (always give something)
    const consolation = {
      jadeCatnip: Math.floor((realm.tribulation.rewards?.jadeCatnip || 100) * 0.1),
      message: 'The heavens test those who persist. Rise again, cultivator.'
    };

    this.activeTribulation = null;

    return {
      status: 'failed',
      penalty: penalty,
      consolation: consolation
    };
  }
}

// Realm-based visual evolution
const MASTER_SPRITES_BY_REALM = {
  gerald: {
    mortal: 'gerald_mortal.png',
    qiCondensation: 'gerald_qi.png',
    foundationEstablishment: 'gerald_foundation.png',
    coreFormation: 'gerald_core.png',
    nascentSoul: 'gerald_soul.png',
    spiritSevering: 'gerald_severing.png',
    daoSeeking: 'gerald_dao.png',
    immortalAscension: 'gerald_immortal.png',
    trueImmortal: 'gerald_true.png',
    heavenlySovereign: 'gerald_sovereign.png'
  },
  // ... same structure for all masters
};
```

---

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

The core gameplay loop, now with technique stances, rhythm bonuses, and mastery progression.

```javascript
// boop.js - The heart of the game
// "Every snoot must be boopable." — First Sacred Law

// Technique Stances - Unlockable boop styles
const TECHNIQUE_STANCES = {
  jadePalm: {
    id: 'jadePalm',
    name: 'Jade Palm',
    description: 'The balanced way. Default stance for all cultivators.',
    unlockRealm: 'mortal',
    stats: {
      boopPower: 1.0,
      boopSpeed: 1.0,
      critChance: 0.05,
      critMultiplier: 10,
      comboDecay: 2000 // ms before combo resets
    },
    special: null,
    mastery: {
      maxLevel: 10,
      xpPerBoop: 1,
      bonusPerLevel: { boopPower: 0.05 }
    }
  },

  ironFinger: {
    id: 'ironFinger',
    name: 'Iron Finger',
    description: 'Slow but devastating. Each boop carries the weight of a mountain.',
    unlockRealm: 'qiCondensation',
    stats: {
      boopPower: 3.0,
      boopSpeed: 0.5, // Halved speed
      critChance: 0.15,
      critMultiplier: 15,
      comboDecay: 3000
    },
    special: {
      name: 'Mountain Crusher',
      description: 'Every 10th boop deals 10x damage',
      trigger: { everyNBoops: 10 },
      effect: { damageMultiplier: 10 }
    },
    mastery: {
      maxLevel: 10,
      xpPerBoop: 2, // Fewer boops but more XP each
      bonusPerLevel: { critMultiplier: 1 }
    }
  },

  drunkenPaw: {
    id: 'drunkenPaw',
    name: 'Drunken Paw',
    description: 'Chaotic and unpredictable. Embrace the randomness.',
    unlockRealm: 'foundationEstablishment',
    stats: {
      boopPower: { min: 0.5, max: 5.0 }, // Random range
      boopSpeed: 1.2,
      critChance: 0.25,
      critMultiplier: { min: 5, max: 25 },
      comboDecay: 1500
    },
    special: {
      name: 'Lucky Stumble',
      description: '5% chance for JACKPOT (100x damage)',
      trigger: { chance: 0.05 },
      effect: { damageMultiplier: 100 }
    },
    mastery: {
      maxLevel: 10,
      xpPerBoop: 1,
      bonusPerLevel: { jackpotChance: 0.005 }
    }
  },

  shadowStep: {
    id: 'shadowStep',
    name: 'Shadow Step',
    description: 'Rapid strikes with diminishing returns, then a devastating burst.',
    unlockRealm: 'coreFormation',
    stats: {
      boopPower: 0.3, // Low base
      boopSpeed: 2.0, // Double speed
      critChance: 0.1,
      critMultiplier: 8,
      comboDecay: 1000
    },
    special: {
      name: 'Shadow Burst',
      description: 'After 20 rapid boops, next boop deals combo × 5 damage',
      trigger: { afterCombo: 20 },
      effect: { burstMultiplier: 5 }
    },
    mastery: {
      maxLevel: 10,
      xpPerBoop: 0.5,
      bonusPerLevel: { burstMultiplier: 0.5 }
    }
  },

  flowingRiver: {
    id: 'flowingRiver',
    name: 'Flowing River',
    description: 'Steady and consistent. Optimized for AFK synergy.',
    unlockRealm: 'nascentSoul',
    stats: {
      boopPower: 1.5,
      boopSpeed: 0.8,
      critChance: 0.08,
      critMultiplier: 12,
      comboDecay: 5000 // Very long combo window
    },
    special: {
      name: 'Eternal Flow',
      description: 'Combo never fully resets, minimum 10%',
      trigger: { always: true },
      effect: { minComboPercent: 0.1 }
    },
    mastery: {
      maxLevel: 10,
      xpPerBoop: 1.5,
      bonusPerLevel: { comboDecay: 500 }
    }
  },

  forbiddenTechnique: {
    id: 'forbiddenTechnique',
    name: 'Thousand Snoot Annihilation',
    description: 'THE ULTIMATE TECHNIQUE. Costs Qi to activate.',
    unlockRealm: 'spiritSevering',
    unlockCondition: { masterAllStances: true },
    stats: {
      boopPower: 10.0,
      boopSpeed: 3.0,
      critChance: 0.5,
      critMultiplier: 50,
      comboDecay: 500
    },
    special: {
      name: 'Annihilation',
      description: 'Costs 5 Qi per boop. All boops hit all cats on screen.',
      trigger: { always: true },
      effect: { aoe: true, qiCost: 5 }
    },
    mastery: {
      maxLevel: 10,
      xpPerBoop: 5,
      bonusPerLevel: { qiCostReduction: 0.3 }
    }
  }
};

// Fusion Techniques - Unlocked by mastering multiple stances
const FUSION_TECHNIQUES = {
  jadeMountain: {
    name: 'Jade Mountain Strike',
    requires: ['jadePalm', 'ironFinger'],
    requiredMastery: 5,
    description: 'Balanced power with devastating follow-ups',
    effect: { boopPower: 2.0, everyNth: { n: 5, multiplier: 5 } }
  },
  drunkenShadow: {
    name: 'Drunken Shadow Dance',
    requires: ['drunkenPaw', 'shadowStep'],
    requiredMastery: 5,
    description: 'Chaotic rapid strikes with burst potential',
    effect: { randomMultiplier: { min: 1, max: 3 }, burstAfter: 15 }
  },
  riverOfJade: {
    name: 'River of Jade',
    requires: ['jadePalm', 'flowingRiver'],
    requiredMastery: 5,
    description: 'Endless combos with steady power',
    effect: { comboNeverResets: true, boopPower: 1.75 }
  },
  ultimateSynthesis: {
    name: 'Celestial Snoot Synthesis',
    requires: ['jadePalm', 'ironFinger', 'drunkenPaw', 'shadowStep', 'flowingRiver'],
    requiredMastery: 10,
    description: 'THE ULTIMATE FUSION. Combines all stance benefits.',
    effect: { allStancePassives: true, uniqueAnimation: 'celestial_boop' }
  }
};

class BoopSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.currentStance = 'jadePalm';
    this.stanceMastery = {};
    this.comboCount = 0;
    this.comboTimer = null;
    this.lastBoopTime = 0;
    this.rhythmMultiplier = 1.0;
    this.shadowBurstReady = false;
  }

  switchStance(stanceId) {
    const stance = TECHNIQUE_STANCES[stanceId];
    if (!stance) return { error: 'Unknown stance' };

    // Check unlock condition
    const playerRealm = this.gameState.cultivationRealm;
    if (CULTIVATION_REALMS[playerRealm].order < CULTIVATION_REALMS[stance.unlockRealm].order) {
      return { error: `Requires ${stance.unlockRealm} realm` };
    }

    if (stance.unlockCondition?.masterAllStances) {
      const allMastered = Object.keys(TECHNIQUE_STANCES)
        .filter(id => id !== 'forbiddenTechnique')
        .every(id => (this.stanceMastery[id] || 0) >= 10);
      if (!allMastered) {
        return { error: 'Must master all other stances first' };
      }
    }

    this.currentStance = stanceId;
    return { success: true, stance: stance };
  }

  boop(cat, master) {
    const stance = TECHNIQUE_STANCES[this.currentStance];
    const now = Date.now();

    // Check Qi cost for forbidden technique
    if (stance.special?.qiCost) {
      if (this.gameState.qi < stance.special.qiCost) {
        return { error: 'Not enough Qi!' };
      }
      this.gameState.qi -= stance.special.qiCost;
    }

    // Calculate base boop power (handle random ranges)
    let basePower = typeof stance.stats.boopPower === 'object'
      ? this.randomRange(stance.stats.boopPower.min, stance.stats.boopPower.max)
      : stance.stats.boopPower;

    // Apply mastery bonus
    const masteryLevel = this.stanceMastery[this.currentStance] || 0;
    const masteryBonus = masteryLevel * (stance.mastery.bonusPerLevel.boopPower || 0);
    basePower *= (1 + masteryBonus);

    // Combo system
    this.comboCount++;
    clearTimeout(this.comboTimer);
    this.comboTimer = setTimeout(() => {
      // Check for Flowing River's minimum combo
      if (stance.special?.minComboPercent) {
        this.comboCount = Math.floor(this.comboCount * stance.special.minComboPercent);
      } else {
        this.comboCount = 0;
      }
    }, stance.stats.comboDecay);

    const comboBonus = 1 + (Math.min(this.comboCount, 100) * 0.01);

    // Rhythm bonus - hitting on beat with music
    const rhythmBonus = this.calculateRhythmBonus(now);

    // Critical calculation
    let critChance = stance.stats.critChance + (master.passive.critChanceBonus || 0);
    let critMult = typeof stance.stats.critMultiplier === 'object'
      ? this.randomRange(stance.stats.critMultiplier.min, stance.stats.critMultiplier.max)
      : stance.stats.critMultiplier;

    const isCrit = Math.random() < critChance;

    // Calculate final BP
    let bp = basePower * comboBonus * rhythmBonus * (isCrit ? critMult : 1);

    // Apply special effects
    const specialResult = this.processSpecialEffects(stance, bp, isCrit);
    bp = specialResult.bp;

    // Master bonuses
    bp *= (master.passive.bpMultiplier || 1);

    // Gain mastery XP
    this.gainMasteryXP(stance.mastery.xpPerBoop);

    // JUICE IT UP
    this.playBoopSound(isCrit, this.currentStance);
    this.showQiParticles(cat, isCrit, specialResult.special);
    this.showCultivationText(bp, isCrit, this.comboCount, specialResult.special);
    this.wiggleCat(cat);

    this.lastBoopTime = now;

    return {
      bp,
      isCrit,
      combo: this.comboCount,
      rhythm: rhythmBonus > 1,
      special: specialResult.special,
      stance: this.currentStance
    };
  }

  processSpecialEffects(stance, bp, isCrit) {
    let special = null;

    if (!stance.special) return { bp, special };

    // Mountain Crusher (Iron Finger)
    if (stance.special.trigger?.everyNBoops) {
      if (this.gameState.totalBoops % stance.special.trigger.everyNBoops === 0) {
        bp *= stance.special.effect.damageMultiplier;
        special = 'MOUNTAIN CRUSHER!';
      }
    }

    // Lucky Stumble (Drunken Paw)
    if (stance.special.trigger?.chance) {
      const bonusChance = (this.stanceMastery[this.currentStance] || 0) *
        (stance.mastery.bonusPerLevel.jackpotChance || 0);
      if (Math.random() < (stance.special.trigger.chance + bonusChance)) {
        bp *= stance.special.effect.damageMultiplier;
        special = '🎰 JACKPOT! 🎰';
      }
    }

    // Shadow Burst (Shadow Step)
    if (stance.special.trigger?.afterCombo) {
      if (this.comboCount === stance.special.trigger.afterCombo) {
        this.shadowBurstReady = true;
      }
      if (this.shadowBurstReady && this.comboCount > stance.special.trigger.afterCombo) {
        const burstBonus = (this.stanceMastery[this.currentStance] || 0) *
          (stance.mastery.bonusPerLevel.burstMultiplier || 0);
        bp *= (this.comboCount * (stance.special.effect.burstMultiplier + burstBonus));
        special = 'SHADOW BURST!';
        this.shadowBurstReady = false;
      }
    }

    return { bp, special };
  }

  calculateRhythmBonus(now) {
    // Sync with game music BPM (default 120 BPM = 500ms per beat)
    const bpm = this.gameState.musicBPM || 120;
    const beatInterval = 60000 / bpm;
    const timeSinceLastBoop = now - this.lastBoopTime;

    // Check if boop is on beat (within 50ms tolerance)
    const beatOffset = timeSinceLastBoop % beatInterval;
    const onBeat = beatOffset < 50 || beatOffset > (beatInterval - 50);

    if (onBeat) {
      return 1.25; // 25% bonus for rhythm
    }
    return 1.0;
  }

  gainMasteryXP(amount) {
    const currentMastery = this.stanceMastery[this.currentStance] || 0;
    const stance = TECHNIQUE_STANCES[this.currentStance];

    if (currentMastery >= stance.mastery.maxLevel) return;

    const xpNeeded = Math.pow(currentMastery + 1, 2) * 100;
    this.gameState.stanceMasteryXP[this.currentStance] =
      (this.gameState.stanceMasteryXP[this.currentStance] || 0) + amount;

    if (this.gameState.stanceMasteryXP[this.currentStance] >= xpNeeded) {
      this.stanceMastery[this.currentStance] = currentMastery + 1;
      this.gameState.stanceMasteryXP[this.currentStance] = 0;
      this.onMasteryLevelUp(this.currentStance, currentMastery + 1);
    }
  }

  onMasteryLevelUp(stanceId, newLevel) {
    const stance = TECHNIQUE_STANCES[stanceId];
    this.gameState.notifications.push({
      type: 'mastery',
      title: `${stance.name} Mastery Level ${newLevel}!`,
      message: `Your ${stance.name} technique grows stronger.`
    });

    // Check for fusion technique unlocks
    this.checkFusionUnlocks();
  }

  checkFusionUnlocks() {
    for (const [fusionId, fusion] of Object.entries(FUSION_TECHNIQUES)) {
      if (this.gameState.unlockedFusions?.includes(fusionId)) continue;

      const allRequired = fusion.requires.every(stanceId =>
        (this.stanceMastery[stanceId] || 0) >= fusion.requiredMastery
      );

      if (allRequired) {
        this.gameState.unlockedFusions = this.gameState.unlockedFusions || [];
        this.gameState.unlockedFusions.push(fusionId);
        this.gameState.notifications.push({
          type: 'fusion_unlocked',
          title: `FUSION TECHNIQUE UNLOCKED!`,
          message: `${fusion.name}: ${fusion.description}`
        });
      }
    }
  }

  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  // Audio & Visual methods
  playBoopSound(isCrit, stance) {
    // Different sounds per stance, with variation
    const sounds = {
      jadePalm: ['boop_jade_1', 'boop_jade_2', 'boop_jade_3'],
      ironFinger: ['boop_iron_1', 'boop_iron_2'],
      drunkenPaw: ['boop_drunk_1', 'boop_drunk_2', 'boop_drunk_3', 'boop_drunk_4'],
      shadowStep: ['boop_shadow_1', 'boop_shadow_2'],
      flowingRiver: ['boop_flow_1', 'boop_flow_2'],
      forbiddenTechnique: ['boop_forbidden']
    };
    const pool = sounds[stance] || sounds.jadePalm;
    const sound = pool[Math.floor(Math.random() * pool.length)];

    if (isCrit) {
      // Layer with crit sound
      this.gameState.audio.play(sound);
      this.gameState.audio.play('crit_impact');
    } else {
      this.gameState.audio.play(sound);
    }
  }

  showQiParticles(cat, isCrit, special) { /* ... */ }
  showCultivationText(bp, isCrit, combo, special) { /* ... */ }
  wiggleCat(cat) { /* ... */ }
}
```

### 3. Cat Cultivation System (Expanded)

Cats are now their own deep progression system with cultivation realms, techniques, elements, and personalities.

```javascript
// cats.js - "Cats are never wrong." — Second Sacred Law

// Elemental Affinity System (Five Elements + Hidden)
const CAT_ELEMENTS = {
  metal: {
    id: 'metal',
    name: 'Metal',
    color: '#C0C0C0',
    strengths: ['wood'],
    weaknesses: ['fire'],
    bonus: { critDamage: 1.2 },
    resonance: { metal: 1.1, earth: 1.05 }
  },
  wood: {
    id: 'wood',
    name: 'Wood',
    color: '#228B22',
    strengths: ['earth'],
    weaknesses: ['metal'],
    bonus: { hpRegen: 1.2 },
    resonance: { wood: 1.1, water: 1.05 }
  },
  water: {
    id: 'water',
    name: 'Water',
    color: '#4169E1',
    strengths: ['fire'],
    weaknesses: ['earth'],
    bonus: { afkEfficiency: 1.2 },
    resonance: { water: 1.1, metal: 1.05 }
  },
  fire: {
    id: 'fire',
    name: 'Fire',
    color: '#FF4500',
    strengths: ['metal'],
    weaknesses: ['water'],
    bonus: { boopPower: 1.2 },
    resonance: { fire: 1.1, wood: 1.05 }
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    color: '#8B4513',
    strengths: ['water'],
    weaknesses: ['wood'],
    bonus: { defense: 1.2 },
    resonance: { earth: 1.1, fire: 1.05 }
  },
  // Hidden elements - unlocked later
  void: {
    id: 'void',
    name: 'Void',
    color: '#000000',
    hidden: true,
    unlockRealm: 'spiritSevering',
    strengths: ['all'],
    weaknesses: [],
    bonus: { allStats: 1.15 },
    resonance: { void: 1.2 }
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos',
    color: '#FF00FF',
    hidden: true,
    unlockCondition: { defeatCobraChicken: true },
    strengths: [],
    weaknesses: [],
    bonus: { randomMultiplier: { min: 0.5, max: 2.0 } },
    resonance: { chaos: 1.5, void: 1.1 }
  }
};

// Cat Personality System
const CAT_PERSONALITIES = {
  disciplined: {
    name: 'Disciplined',
    description: 'Learns techniques faster',
    effect: { techniqueXP: 1.25 },
    preferredWaifus: ['mochi', 'jade'],
    dialogue: ['*trains diligently*', 'Mrrp. (I will master this.)']
  },
  lazy: {
    name: 'Lazy',
    description: 'Better AFK gains, slower active',
    effect: { afkBonus: 1.5, activeBonus: 0.8 },
    preferredWaifus: ['luna'],
    dialogue: ['*yawns*', 'Mrrp... (Five more minutes...)']
  },
  playful: {
    name: 'Playful',
    description: 'Higher happiness, more events',
    effect: { happinessGain: 1.3, eventChance: 1.2 },
    preferredWaifus: ['sakura', 'nyanta'],
    dialogue: ['*zoomies*', 'Mrrp! (Play with me!)']
  },
  mysterious: {
    name: 'Mysterious',
    description: 'Higher crit chance, finds secrets',
    effect: { critChance: 0.05, secretFind: 1.5 },
    preferredWaifus: ['yuki', 'luna'],
    dialogue: ['*stares knowingly*', '...']
  },
  brave: {
    name: 'Brave',
    description: 'Bonus vs. Geese, dungeon power',
    effect: { gooseDamage: 1.5, dungeonPower: 1.2 },
    preferredWaifus: ['nyanta', 'mei'],
    dialogue: ['*faces danger*', 'MRRP! (I fear nothing!)']
  },
  gluttonous: {
    name: 'Gluttonous',
    description: 'Gains more from food, higher maintenance',
    effect: { foodBonus: 2.0, happinessDecay: 1.2 },
    preferredWaifus: ['mochi'],
    dialogue: ['*stares at food*', 'Mrrp? (Is that... fish?)']
  }
};

// Cat Techniques (learnable moves)
const CAT_TECHNIQUES = {
  // Active techniques (4 slots)
  pawSwipe: {
    id: 'pawSwipe',
    name: 'Paw Swipe',
    type: 'active',
    element: 'metal',
    cooldown: 5,
    damage: 50,
    description: 'Basic attack',
    unlockLevel: 1
  },
  hairballBarrage: {
    id: 'hairballBarrage',
    name: 'Hairball Barrage',
    type: 'active',
    element: 'earth',
    cooldown: 15,
    damage: 150,
    aoe: true,
    description: 'AOE attack',
    unlockLevel: 5
  },
  nineLivesDance: {
    id: 'nineLivesDance',
    name: 'Nine Lives Dance',
    type: 'active',
    element: 'void',
    cooldown: 60,
    effect: 'revive',
    description: 'Revive once per dungeon run',
    unlockLevel: 20,
    elementRequired: 'void'
  },
  // ... more techniques

  // Passive techniques (2 slots)
  softLanding: {
    id: 'softLanding',
    name: 'Soft Landing',
    type: 'passive',
    effect: { dodgeChance: 0.1 },
    description: '+10% dodge chance',
    unlockLevel: 3
  },
  loudPurr: {
    id: 'loudPurr',
    name: 'Loud Purr',
    type: 'passive',
    effect: { teamHappiness: 1.1 },
    description: '+10% team happiness',
    unlockLevel: 8
  }
};

// Cat Realms (mirrors player cultivation)
const CAT_REALMS = {
  kittenMortal: { order: 1, name: 'Mortal Kitten', ppMult: 1, stats: 1.0 },
  earthKitten: { order: 2, name: 'Earth Kitten', ppMult: 2, stats: 1.5 },
  skyKitten: { order: 3, name: 'Sky Kitten', ppMult: 5, stats: 2.0 },
  heavenKitten: { order: 4, name: 'Heaven Kitten', ppMult: 15, stats: 3.0 },
  divineBeast: { order: 5, name: 'Divine Beast', ppMult: 50, stats: 5.0 },
  celestialBeast: { order: 6, name: 'Celestial Beast', ppMult: 200, stats: 10.0 },
  cosmicEntity: { order: 7, name: 'Cosmic Entity', ppMult: 1000, stats: 25.0 }
};

// Star System (duplicate cats increase stars)
const STAR_BONUSES = {
  1: { stats: 1.0, visualEffect: null },
  2: { stats: 1.1, visualEffect: 'subtle_glow' },
  3: { stats: 1.25, visualEffect: 'sparkle' },
  4: { stats: 1.5, visualEffect: 'aura' },
  5: { stats: 2.0, visualEffect: 'golden_aura' },
  6: { stats: 3.0, visualEffect: 'celestial_aura', awakening: true }
};

// Sample cat data structure
const SAMPLE_CATS = {
  shaolin_tabby: {
    id: 'shaolin_tabby',
    name: 'Shaolin Tabby',
    school: 'shaolin',
    element: 'earth',
    baseRealm: 'kittenMortal',
    personality: 'disciplined',
    description: 'A disciplined cat who practices the ways of the temple.',
    baseStats: {
      snootMeridians: 1.0,
      innerPurr: 1.0,
      floofArmor: 1.2,
      zoomieSteps: 0.8,
      loafMastery: 1.1
    },
    learnableTechniques: ['pawSwipe', 'ironPaw', 'templeGuard'],
    sprite: 'cats/shaolin_tabby.png',
    quotes: [
      'Mrrp. (Balance in all things.)',
      '*meditates intensely*'
    ]
  },

  ceiling_god: {
    id: 'ceiling_god',
    name: 'Ceiling Cat, the All-Seeing',
    school: 'divine',
    element: 'void',
    baseRealm: 'divineBeast',
    personality: 'mysterious',
    legendary: true,
    description: 'Watches from the heavens. Grants vision of all snoots.',
    baseStats: {
      snootMeridians: 5.0,
      innerPurr: 10.0,
      floofArmor: 5.0,
      zoomieSteps: 3.0,
      loafMastery: 8.0
    },
    learnableTechniques: ['allSeeingGaze', 'judgementFromAbove', 'ceilingDrop'],
    signatureEquipment: 'ceiling_eye',
    unlockedBy: { achievement: 'eyes_of_heaven' },
    sprite: 'cats/ceiling_god.png'
  }
};

// Cat Team Formation System
const TEAM_FORMATIONS = {
  default: {
    name: 'Standard Formation',
    positions: ['front', 'front', 'back', 'back'],
    bonus: null
  },
  aggressive: {
    name: 'Aggressive Formation',
    positions: ['front', 'front', 'front', 'back'],
    bonus: { teamAttack: 1.2, teamDefense: 0.9 }
  },
  defensive: {
    name: 'Defensive Formation',
    positions: ['front', 'back', 'back', 'back'],
    bonus: { teamAttack: 0.9, teamDefense: 1.3 }
  },
  balanced: {
    name: 'Balanced Formation',
    positions: ['front', 'mid', 'mid', 'back'],
    bonus: { teamAttack: 1.1, teamDefense: 1.1 }
  }
};

// Team Synergy System
const TEAM_SYNERGIES = {
  elementalHarmony: {
    name: 'Elemental Harmony',
    condition: { uniqueElements: 4 },
    bonus: { allStats: 1.15 },
    description: '4 different elements = +15% all stats'
  },
  schoolReunion: {
    name: 'School Reunion',
    condition: { sameSchool: 4 },
    bonus: { schoolBonus: 2.0 },
    description: '4 cats from same school = 2x school bonus'
  },
  personalityClash: {
    name: 'Personality Clash',
    condition: { specificPair: ['brave', 'lazy'] },
    bonus: { eventChance: 1.5, comedyDialogue: true },
    description: 'Brave + Lazy cat = funny interactions'
  },
  legendaryPresence: {
    name: 'Legendary Presence',
    condition: { legendaryCount: 1 },
    bonus: { teamMorale: 1.25 },
    description: 'Having a legendary cat inspires the team'
  },
  // Specific cat combos
  ceilingAndFloor: {
    name: 'Ceiling and Floor',
    condition: { specificCats: ['ceiling_god', 'basement_cat'] },
    bonus: { universalVision: true, dungeonMapReveal: true },
    description: 'Ceiling Cat + Basement Cat = see all'
  }
};

class CatSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.activeTeam = { cats: [], formation: 'default', reserve: null };
  }

  // Cat Cultivation
  cultivateCat(catId, xpAmount) {
    const cat = this.gameState.getCat(catId);
    cat.cultivationXP += xpAmount;

    const currentRealm = CAT_REALMS[cat.realm];
    const xpNeeded = currentRealm.order * 1000 * Math.pow(1.5, cat.cultivationLevel);

    if (cat.cultivationXP >= xpNeeded) {
      this.levelUpCat(cat);
    }
  }

  levelUpCat(cat) {
    cat.cultivationLevel++;
    cat.cultivationXP = 0;

    // Check for realm breakthrough
    const currentRealm = CAT_REALMS[cat.realm];
    if (cat.cultivationLevel >= 9) {
      const nextRealm = Object.values(CAT_REALMS)
        .find(r => r.order === currentRealm.order + 1);
      if (nextRealm) {
        this.breakthroughCatRealm(cat, nextRealm);
      }
    }

    // Check for technique unlocks
    this.checkTechniqueUnlocks(cat);
  }

  // Star System
  addDuplicateCat(catId) {
    const cat = this.gameState.getCat(catId);
    if (!cat) {
      // New cat
      return this.addNewCat(catId);
    }

    // Duplicate - increase stars
    if (cat.stars < 6) {
      cat.stars++;
      this.recalculateStats(cat);
      return { type: 'star_up', newStars: cat.stars };
    } else {
      // Max stars - convert to resources
      return {
        type: 'max_stars',
        reward: { jadeCatnip: 100 * CAT_REALMS[cat.realm].order }
      };
    }
  }

  // Team Management
  setTeam(catIds, formationId) {
    if (catIds.length > 4) return { error: 'Max 4 cats in team' };

    this.activeTeam.cats = catIds.map(id => this.gameState.getCat(id));
    this.activeTeam.formation = formationId || 'default';

    this.calculateTeamSynergies();
    this.applyFormationBonus();

    return { success: true, synergies: this.activeTeam.synergies };
  }

  calculateTeamSynergies() {
    const team = this.activeTeam.cats;
    const activeSynergies = [];

    for (const [synergyId, synergy] of Object.entries(TEAM_SYNERGIES)) {
      if (this.checkSynergyCondition(team, synergy.condition)) {
        activeSynergies.push({ id: synergyId, ...synergy });
      }
    }

    this.activeTeam.synergies = activeSynergies;
  }

  checkSynergyCondition(team, condition) {
    if (condition.uniqueElements) {
      const elements = new Set(team.map(c => c.element));
      return elements.size >= condition.uniqueElements;
    }
    if (condition.sameSchool) {
      const schools = team.map(c => c.school);
      return schools.every(s => s === schools[0]) && team.length >= condition.sameSchool;
    }
    if (condition.legendaryCount) {
      return team.filter(c => c.legendary).length >= condition.legendaryCount;
    }
    if (condition.specificCats) {
      return condition.specificCats.every(id => team.some(c => c.id === id));
    }
    return false;
  }

  // Elemental Resonance
  calculateElementalBonus(team) {
    let totalBonus = 1.0;

    for (let i = 0; i < team.length; i++) {
      for (let j = i + 1; j < team.length; j++) {
        const elem1 = CAT_ELEMENTS[team[i].element];
        const elem2 = CAT_ELEMENTS[team[j].element];

        // Check resonance
        if (elem1.resonance[team[j].element]) {
          totalBonus *= elem1.resonance[team[j].element];
        }
      }
    }

    return totalBonus;
  }
}

// Cat Fusion System
const FUSION_RECIPES = {
  yin_yang_cat: {
    name: 'Yin-Yang Cat',
    ingredients: [
      { element: 'fire', minStars: 3 },
      { element: 'water', minStars: 3 }
    ],
    result: {
      id: 'yin_yang_cat',
      element: 'void',
      realm: 'heavenKitten',
      unique: true
    }
  },
  chaos_kitty: {
    name: 'Chaos Kitty',
    ingredients: [
      { id: 'goose_touched_cat' },
      { personality: 'brave', minStars: 5 }
    ],
    result: {
      id: 'chaos_kitty',
      element: 'chaos',
      realm: 'divineBeast',
      unique: true
    }
  },
  legendary_loaf: {
    name: 'The Eternal Loaf',
    ingredients: [
      { school: 'any', count: 5, minStars: 4 } // 5 different 4-star cats
    ],
    result: {
      id: 'eternal_loaf',
      legendary: true,
      unique: true
    }
  }
};

class CatFusionSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }

  canFuse(recipe) {
    const fusionRecipe = FUSION_RECIPES[recipe];
    if (!fusionRecipe) return { canFuse: false, reason: 'Unknown recipe' };

    for (const ingredient of fusionRecipe.ingredients) {
      if (!this.hasIngredient(ingredient)) {
        return { canFuse: false, reason: 'Missing ingredients', missing: ingredient };
      }
    }

    if (fusionRecipe.result.unique && this.gameState.hasCat(fusionRecipe.result.id)) {
      return { canFuse: false, reason: 'Already own this unique cat' };
    }

    return { canFuse: true };
  }

  performFusion(recipeId, ingredientCatIds) {
    const check = this.canFuse(recipeId);
    if (!check.canFuse) return check;

    const recipe = FUSION_RECIPES[recipeId];

    // Remove ingredient cats
    for (const catId of ingredientCatIds) {
      this.gameState.removeCat(catId);
    }

    // Create fused cat
    const fusedCat = this.createFusedCat(recipe.result);
    this.gameState.addCat(fusedCat);

    return {
      success: true,
      newCat: fusedCat,
      message: `${recipe.name} has been born!`
    };
  }

  hasIngredient(requirement) {
    const cats = this.gameState.cats;

    if (requirement.id) {
      return cats.some(c => c.id === requirement.id);
    }
    if (requirement.element) {
      return cats.some(c =>
        c.element === requirement.element &&
        c.stars >= (requirement.minStars || 1)
      );
    }
    if (requirement.count) {
      const matching = cats.filter(c => c.stars >= (requirement.minStars || 1));
      return matching.length >= requirement.count;
    }
    return false;
  }
}
```

### 4. Waifu Master System (Expanded to 12+)

Deep bonding system with activities, teaching schools, and waifu cultivation.

```javascript
// waifus.js - The Twelve Immortal Masters (and secrets)
// "The Sect comes first." — Third Sacred Law (but waifus are important too)

// Bond Activities - Different ways to increase bond
const BOND_ACTIVITIES = {
  teaCeremony: {
    id: 'teaCeremony',
    name: 'Tea Ceremony',
    duration: 300, // 5 minutes
    bondGain: 10,
    preferredBy: ['mochi', 'jade', 'luna'],
    description: 'Share a quiet moment over tea',
    unlockBond: 0
  },
  sparring: {
    id: 'sparring',
    name: 'Sparring Match',
    duration: 600,
    bondGain: 15,
    preferredBy: ['mei', 'nyanta', 'crimson'],
    minigame: 'combat_practice',
    description: 'Train together in combat',
    unlockBond: 20
  },
  meditation: {
    id: 'meditation',
    name: 'Meditation',
    duration: 900,
    bondGain: 20,
    preferredBy: ['luna', 'yuki', 'jade'],
    afkCompatible: true,
    description: 'Cultivate together in silence',
    unlockBond: 30
  },
  stargazing: {
    id: 'stargazing',
    name: 'Stargazing',
    duration: 600,
    bondGain: 25,
    preferredBy: ['luna', 'yuki', 'grandmother'],
    timeRestriction: 'night',
    description: 'Watch the stars together',
    unlockBond: 40
  },
  cooking: {
    id: 'cooking',
    name: 'Cooking Together',
    duration: 450,
    bondGain: 18,
    preferredBy: ['mochi', 'sakura'],
    producesItem: true,
    description: 'Prepare a meal together',
    unlockBond: 25
  },
  exploring: {
    id: 'exploring',
    name: 'Sect Exploration',
    duration: 1200,
    bondGain: 30,
    preferredBy: ['nyanta', 'sakura', 'mei'],
    discoversSecrets: true,
    description: 'Explore hidden areas together',
    unlockBond: 50
  },
  hotSprings: {
    id: 'hotSprings',
    name: 'Hot Springs Visit',
    duration: 600,
    bondGain: 35,
    preferredBy: ['all'],
    requiresBuilding: 'hot_springs',
    description: 'Relax at the hot springs',
    unlockBond: 60
  }
};

// Waifu Teaching Schools
const WAIFU_SCHOOLS = {
  hospitalityArts: {
    id: 'hospitalityArts',
    name: 'Hospitality Arts',
    teacher: 'mochi',
    techniques: ['welcomingBoop', 'teaTimeHealing', 'guestProtection'],
    masteryExams: [
      { level: 1, type: 'serve_100_teas', reward: 'technique:welcomingBoop' },
      { level: 2, type: 'happiness_threshold', value: 1000, reward: 'technique:teaTimeHealing' },
      { level: 3, type: 'boss_fight', enemy: 'angry_customer', reward: 'technique:guestProtection' }
    ],
    schoolBonus: { catHappiness: 1.2 }
  },
  yinEnergyArts: {
    id: 'yinEnergyArts',
    name: 'Yin Energy Arts',
    teacher: 'luna',
    techniques: ['moonlightBoop', 'dreamWalking', 'nightVision'],
    masteryExams: [
      { level: 1, type: 'afk_hours', value: 24, reward: 'technique:moonlightBoop' },
      { level: 2, type: 'night_boops', value: 10000, reward: 'technique:dreamWalking' },
      { level: 3, type: 'dream_realm_clear', floor: 10, reward: 'technique:nightVision' }
    ],
    schoolBonus: { afkEfficiency: 1.3 }
  },
  adventureArts: {
    id: 'adventureArts',
    name: 'Adventure Arts',
    teacher: 'nyanta',
    techniques: ['treasureHunter', 'seaLegs', 'captainCommand'],
    masteryExams: [
      { level: 1, type: 'expeditions_complete', value: 10, reward: 'technique:treasureHunter' },
      { level: 2, type: 'rare_cats_found', value: 20, reward: 'technique:seaLegs' },
      { level: 3, type: 'boss_fight', enemy: 'kraken', reward: 'technique:captainCommand' }
    ],
    schoolBonus: { expeditionSpeed: 1.5 }
  },
  combatArts: {
    id: 'combatArts',
    name: 'Combat Arts',
    teacher: 'mei',
    techniques: ['fierceStrike', 'battleCry', 'warriorSpirit'],
    masteryExams: [
      { level: 1, type: 'dungeon_floors', value: 50, reward: 'technique:fierceStrike' },
      { level: 2, type: 'enemies_defeated', value: 10000, reward: 'technique:battleCry' },
      { level: 3, type: 'pagoda_floor', value: 100, reward: 'technique:warriorSpirit' }
    ],
    schoolBonus: { dungeonDamage: 1.25 }
  },
  // ... more schools for each waifu
};

// Jealousy/Harmony System
const ATTENTION_BALANCE = {
  harmonyThreshold: 0.8, // 80% balance = harmony
  jealousyThreshold: 0.3, // <30% of average = jealousy

  calculateHarmony(waifuAttention) {
    const values = Object.values(waifuAttention);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const minRatio = Math.min(...values) / avg;

    if (minRatio >= this.harmonyThreshold) {
      return { status: 'harmony', bonus: { allBonds: 1.1 } };
    } else if (minRatio < this.jealousyThreshold) {
      const jealous = Object.entries(waifuAttention)
        .filter(([_, v]) => v / avg < this.jealousyThreshold)
        .map(([k, _]) => k);
      return {
        status: 'jealousy',
        jealousWaifus: jealous,
        penalty: null, // Never punishing, just funny dialogue
        dialogue: true
      };
    }
    return { status: 'neutral' };
  }
};

// The Twelve Immortal Masters (Full List)
const WAIFUS = {
  // === STARTER WAIFUS (Available from start) ===
  mochi: {
    id: 'mochi',
    name: 'Mochi-chan',
    title: 'The Welcoming Dawn',
    role: 'Innkeeper of the Celestial Teahouse',
    school: 'hospitalityArts',
    element: 'earth',
    personality: 'warm',
    bonus: { type: 'bpMultiplier', value: 1.10 },
    unlockCondition: 'starter',
    maxBondReward: { cat: 'lucky_teacup_cat', technique: 'perfect_hospitality' },
    giftAffinities: {
      loves: ['rare_tea', 'jade_cup', 'silk_ribbon'],
      likes: ['yarn_ball', 'fish_treats'],
      neutral: ['catnip', 'bells'],
      dislikes: ['loud_toys', 'spicy_food']
    },
    cultivation: {
      currentRealm: 'foundationEstablishment',
      canCultivate: true,
      helpReward: { jadeCatnip: 1000, technique: 'tea_blessing' }
    },
    sprite: 'waifus/mochi.png',
    color: '#FFB7C5',
    voiceLines: {
      greeting: { morning: 'Good morning~', evening: 'Welcome back, nya~' },
      jealous: "Hmph! You've been spending time with others... *pouts cutely*",
      harmony: "Everyone is getting along so well! This makes me happy~"
    }
  },

  // === UNLOCKABLE WAIFUS ===
  luna: {
    id: 'luna',
    name: 'Luna Whiskerbell',
    title: 'The Midnight Watcher',
    role: 'Night Cultivation Instructor',
    school: 'yinEnergyArts',
    element: 'water',
    personality: 'sleepy',
    bonus: { type: 'afkMultiplier', value: 1.50 },
    unlockCondition: { type: 'afkTime', value: 86400 },
    maxBondReward: { cat: 'moonlight_siamese', technique: 'eternal_slumber' },
    giftAffinities: {
      loves: ['pillow', 'moon_charm', 'warm_blanket'],
      likes: ['chamomile_tea', 'quiet_toys'],
      neutral: ['most_things'],
      dislikes: ['loud_noises', 'bright_lights', 'coffee']
    },
    sprite: 'waifus/luna.png',
    color: '#C4A7E7',
    voiceLines: {
      greeting: { morning: '*yawn* ...morning already...?', night: 'Ah... the moon is beautiful tonight...' },
      jealous: "It's fine... I'll just... sleep... *sad yawn*",
      harmony: "Everyone... resting peacefully... that's nice... zzz..."
    }
  },

  nyanta: {
    id: 'nyanta',
    name: 'Captain Nyanta',
    title: 'The Sea Sovereign',
    role: 'Expedition Leader',
    school: 'adventureArts',
    element: 'water',
    personality: 'boisterous',
    bonus: { type: 'expeditionUnlock', value: true },
    unlockCondition: { type: 'catCount', value: 50 },
    maxBondReward: { cat: 'kraken_kitty', technique: 'sea_shanty_boop' },
    giftAffinities: {
      loves: ['treasure_map', 'rum_barrel', 'golden_compass'],
      likes: ['fish', 'rope', 'sea_shells'],
      neutral: ['land_food'],
      dislikes: ['anchors', 'landlubber_talk']
    },
    sprite: 'waifus/nyanta.png',
    color: '#8B0000'
  },

  mei: {
    id: 'mei',
    name: 'Mei Ironpaw',
    title: 'The Unbreakable',
    role: 'Combat Instructor',
    school: 'combatArts',
    element: 'metal',
    personality: 'fierce',
    bonus: { type: 'dungeonDamage', value: 1.25 },
    unlockCondition: { type: 'pagodaFloor', value: 20 },
    maxBondReward: { cat: 'iron_tiger', technique: 'iron_paw_strike' },
    giftAffinities: {
      loves: ['training_weights', 'battle_scars_ointment', 'protein_treats'],
      likes: ['simple_food', 'bandages'],
      neutral: ['fancy_things'],
      dislikes: ['weakness', 'giving_up']
    },
    sprite: 'waifus/mei.png',
    color: '#C0C0C0'
  },

  sakura: {
    id: 'sakura',
    name: 'Sakura Petalpaw',
    title: 'The Eternal Spring',
    role: 'Garden Keeper',
    school: 'natureArts',
    element: 'wood',
    personality: 'gentle',
    bonus: { type: 'catHappiness', value: 1.20 },
    unlockCondition: { type: 'building', building: 'meditation_garden', level: 3 },
    maxBondReward: { cat: 'cherry_blossom_cat', technique: 'petal_dance' },
    sprite: 'waifus/sakura.png',
    color: '#FFB7C5'
  },

  yuki: {
    id: 'yuki',
    name: 'Yuki Frostwhisker',
    title: 'The Silent Snow',
    role: 'Meditation Master',
    school: 'stillnessArts',
    element: 'water',
    personality: 'serene',
    bonus: { type: 'meditationEfficiency', value: 1.50 },
    unlockCondition: { type: 'meditationHours', value: 100 },
    maxBondReward: { cat: 'ice_crystal_cat', technique: 'frozen_clarity' },
    sprite: 'waifus/yuki.png',
    color: '#E0FFFF'
  },

  jade: {
    id: 'jade',
    name: 'Jade Silkpaw',
    title: 'The Refined',
    role: 'Etiquette Instructor',
    school: 'graceArts',
    element: 'earth',
    personality: 'elegant',
    bonus: { type: 'critDamage', value: 1.30 },
    unlockCondition: { type: 'prestigeCount', value: 1 },
    maxBondReward: { cat: 'jade_emperor_cat', technique: 'elegant_strike' },
    sprite: 'waifus/jade.png',
    color: '#50C878'
  },

  crimson: {
    id: 'crimson',
    name: 'Crimson Blazepaw',
    title: 'The Inferno',
    role: 'Forge Master',
    school: 'forgeArts',
    element: 'fire',
    personality: 'passionate',
    bonus: { type: 'equipmentCrafting', value: 1.40 },
    unlockCondition: { type: 'equipmentCrafted', value: 50 },
    maxBondReward: { cat: 'phoenix_cat', technique: 'flame_forged_boop' },
    sprite: 'waifus/crimson.png',
    color: '#FF4500'
  },

  // === HIDDEN/SECRET WAIFUS ===
  grandmother: {
    id: 'grandmother',
    name: 'Grandmother Whiskers',
    title: 'The All-Knowing',
    role: 'Sect Elder',
    school: 'ancientArts',
    element: 'void',
    personality: 'wise',
    hidden: true,
    bonus: { type: 'allStats', value: 1.15 },
    unlockCondition: { type: 'loreFragments', value: 50 },
    maxBondReward: { cat: 'ancient_guardian', technique: 'elder_wisdom' },
    sprite: 'waifus/grandmother.png',
    color: '#D3D3D3',
    specialDialogue: {
      knowsSecrets: true,
      hintSystem: true
    }
  },

  rival: {
    id: 'rival',
    name: 'Scarlet Shadowclaw',
    title: 'The Rival',
    role: 'Competing Sect Leader',
    school: 'rivalArts',
    element: 'fire',
    personality: 'tsundere',
    hidden: true,
    antiWaifu: true, // Starts as antagonist
    bonus: { type: 'competitiveBonus', value: 1.25 },
    unlockCondition: { type: 'defeatInTournament', times: 3 },
    maxBondReward: { cat: 'reformed_rival_cat', technique: 'begrudging_respect' },
    sprite: 'waifus/rival.png',
    color: '#8B0000',
    specialDialogue: {
      startAsEnemy: true,
      redemptionArc: true
    }
  },

  void_waifu: {
    id: 'void_waifu',
    name: '???',
    title: 'The Forgotten',
    role: 'Unknown',
    school: 'voidArts',
    element: 'void',
    personality: 'mysterious',
    hidden: true,
    transcendenceOnly: true,
    bonus: { type: 'voidPower', value: 2.0 },
    unlockCondition: { type: 'transcendence', value: true },
    maxBondReward: { cat: 'void_cat', technique: 'reality_boop' },
    sprite: 'waifus/void.png',
    color: '#000000'
  },

  honk_maiden: {
    id: 'honk_maiden',
    name: 'The Honk Maiden',
    title: 'Avatar of Chaos',
    role: 'Goose Whisperer',
    school: 'chaosArts',
    element: 'chaos',
    personality: 'chaotic',
    hidden: true,
    bonus: { type: 'gooseBonus', value: 2.0 },
    unlockCondition: { type: 'gooseBoops', value: 1000, cobraChickenDefeated: true },
    maxBondReward: { cat: 'goose_cat_hybrid', technique: 'HONK_BOOP' },
    sprite: 'waifus/honk_maiden.png',
    color: '#FFFFFF',
    specialDialogue: {
      speaksInHonks: true,
      translationNeeded: true
    }
  }
};

class WaifuSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.activeWaifu = null;
    this.attentionTracker = {};
    this.currentActivity = null;
  }

  // Bond Level Rewards
  getBondRewards(waifuId, bondLevel) {
    const rewards = [];
    const thresholds = [10, 25, 50, 75, 100];

    for (const threshold of thresholds) {
      if (bondLevel >= threshold) {
        rewards.push(BOND_REWARDS[waifuId]?.[threshold] || GENERIC_BOND_REWARDS[threshold]);
      }
    }

    return rewards;
  }

  // Activity System
  startActivity(waifuId, activityId) {
    const waifu = WAIFUS[waifuId];
    const activity = BOND_ACTIVITIES[activityId];

    if (!activity) return { error: 'Unknown activity' };
    if (this.gameState.waifuBonds[waifuId] < activity.unlockBond) {
      return { error: `Requires bond level ${activity.unlockBond}` };
    }
    if (activity.timeRestriction === 'night' && !this.gameState.isNightTime()) {
      return { error: 'This activity is only available at night' };
    }

    this.currentActivity = {
      waifuId,
      activityId,
      startTime: Date.now(),
      duration: activity.duration * 1000
    };

    // Preference bonus
    const isPreferred = activity.preferredBy.includes(waifuId) ||
      activity.preferredBy.includes('all');
    const bondGain = isPreferred ? activity.bondGain * 1.5 : activity.bondGain;

    return {
      started: true,
      duration: activity.duration,
      bondGain,
      isPreferred
    };
  }

  completeActivity() {
    if (!this.currentActivity) return null;

    const activity = BOND_ACTIVITIES[this.currentActivity.activityId];
    const waifuId = this.currentActivity.waifuId;

    // Calculate bond gain
    const isPreferred = activity.preferredBy.includes(waifuId);
    let bondGain = isPreferred ? activity.bondGain * 1.5 : activity.bondGain;

    // Harmony bonus
    const harmonyStatus = ATTENTION_BALANCE.calculateHarmony(this.attentionTracker);
    if (harmonyStatus.status === 'harmony') {
      bondGain *= harmonyStatus.bonus.allBonds;
    }

    // Apply bond
    this.gameState.waifuBonds[waifuId] =
      Math.min(100, (this.gameState.waifuBonds[waifuId] || 0) + bondGain);

    // Track attention
    this.attentionTracker[waifuId] = (this.attentionTracker[waifuId] || 0) + 1;

    // Check for special outcomes
    const result = {
      bondGained: bondGain,
      newBondLevel: this.gameState.waifuBonds[waifuId]
    };

    if (activity.producesItem) {
      result.item = this.generateActivityItem(activity, waifuId);
    }

    if (activity.discoversSecrets) {
      result.secret = this.checkSecretDiscovery(waifuId);
    }

    this.currentActivity = null;
    return result;
  }

  // Waifu Cultivation (help them break through)
  helpWaifuCultivate(waifuId) {
    const waifu = WAIFUS[waifuId];
    if (!waifu.cultivation?.canCultivate) {
      return { error: 'This waifu cannot cultivate further' };
    }

    // Requires high bond
    if (this.gameState.waifuBonds[waifuId] < 75) {
      return { error: 'Requires bond level 75+' };
    }

    // Requires resources
    const cost = { jadeCatnip: 10000, destinyThreads: 100 };
    if (!this.gameState.canAfford(cost)) {
      return { error: 'Insufficient resources' };
    }

    this.gameState.spend(cost);

    // Breakthrough attempt
    const success = Math.random() < 0.7; // 70% base success
    if (success) {
      return {
        success: true,
        rewards: waifu.cultivation.helpReward,
        newRealm: this.advanceWaifuRealm(waifuId)
      };
    } else {
      return {
        success: false,
        consolation: { jadeCatnip: cost.jadeCatnip * 0.1 }
      };
    }
  }
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

### Additional Dungeon Types

Beyond the Infinite Pagoda and Wave Survival, these dungeons provide variety and challenge.

```javascript
// dungeons/additional.js - "The Jianghu holds many secrets."

// === THE BAMBOO FOREST === (Survival Mode)
const BAMBOO_FOREST = {
  id: 'bamboo_forest',
  name: 'The Bamboo Forest',
  type: 'survival',
  description: 'Survive as long as possible against endless waves of enemies.',
  unlockCondition: { pagodaFloor: 30 },
  rules: {
    duration: 30 * 60, // 30 minutes to "win"
    singleCat: true,
    autoAttack: true,
    levelUpChoices: 3,
    bossEvery: 5 * 60 // Boss every 5 minutes
  },
  rewards: {
    perMinute: { jadeCatnip: 10 },
    completion: { cat: 'bamboo_guardian', technique: 'forest_walk' },
    highScore: 'leaderboard'
  }
};

// === THE CELESTIAL TOURNAMENT ===
const CELESTIAL_TOURNAMENT = {
  id: 'celestial_tournament',
  name: 'The Celestial Tournament',
  type: 'pvp_bracket',
  description: 'Face AI versions of the other Six Masters in bracket combat.',
  unlockCondition: { cultivationRealm: 'coreFormation' },
  rules: {
    rounds: 6, // Face all 6 other masters
    teamSize: 4,
    preparation: true,
    masterAbilities: true // AI uses master passives
  },
  opponents: {
    gerald: { difficulty: 'balanced', aiStyle: 'meditation_bursts' },
    rusty: { difficulty: 'aggressive', aiStyle: 'constant_pressure' },
    steve: { difficulty: 'strategic', aiStyle: 'optimal_timing' },
    andrew: { difficulty: 'fast', aiStyle: 'speed_rush' },
    nik: { difficulty: 'critical', aiStyle: 'crit_fishing' },
    yuelin: { difficulty: 'sustain', aiStyle: 'healing_focus' },
    scott: { difficulty: 'tank', aiStyle: 'stack_and_wait' }
  },
  rewards: {
    perWin: { sectReputation: 100 },
    champion: { title: 'Tournament Champion', cosmetic: 'champion_crown' },
    weekly: { jadeCatnip: 5000 }
  }
};

// === THE DREAM REALM ===
const DREAM_REALM = {
  id: 'dream_realm',
  name: 'The Dream Realm',
  type: 'procedural_story',
  description: 'A surreal dungeon generated from YOUR play data.',
  unlockCondition: { cultivationRealm: 'nascentSoul' },
  rules: {
    generatedFrom: ['playtime', 'favoriteCats', 'waifuBonds', 'achievements'],
    floors: 'variable',
    narrative: true,
    surrealModifiers: true
  },
  generation: {
    // Uses player data to create personalized content
    favoriteWaifuAppears: true,
    mostUsedCatsBecomeAllies: true,
    failedTribulationsBecomeBosses: true,
    achievementsUnlockAreas: true
  },
  modifiers: [
    { id: 'gravity_shift', description: 'Up is down, down is up' },
    { id: 'time_loop', description: 'Every 5th floor repeats' },
    { id: 'mirror_world', description: 'Fight shadow versions of your team' },
    { id: 'memory_lane', description: 'Relive past game moments as challenges' }
  ],
  rewards: {
    loreFragments: true,
    dreamEssence: 'currency',
    exclusiveCat: 'dream_walker_cat'
  }
};

// === THE GOOSE DIMENSION ===
const GOOSE_DIMENSION = {
  id: 'goose_dimension',
  name: 'The Goose Dimension',
  type: 'comedy_horror',
  description: 'EVERYTHING is geese. HONK.',
  unlockCondition: { cobraChickenDefeated: true, gooseBoops: 500 },
  rules: {
    allEnemiesAreGeese: true,
    environmentIsGoose: true, // Goose trees, goose floors, goose sky
    honkMeter: true, // Fill the HONK meter to progress
    sanityMechanic: true // Cats lose sanity, affects abilities
  },
  enemies: {
    normal: ['goose', 'goose_with_knife', 'goose_in_disguise'],
    elite: ['mecha_goose', 'goose_hydra', 'stealth_goose'],
    boss: ['the_original_goose', 'goose_king', 'cosmic_honk']
  },
  finalBoss: {
    name: 'THE PRIMORDIAL HONK',
    description: 'The first goose. The last goose. The eternal goose.',
    phases: 5,
    rewards: {
      title: 'Goose Dimension Survivor',
      cat: 'goose_touched_cat',
      permanent: { gooseSpawnRate: 0.5, gooseRewards: 2.0 }
    }
  },
  jokes: {
    fourthWallBreaks: true,
    randomHonks: true,
    gooseStealingUI: true, // Goose steals buttons occasionally
    breadCrumbCurrency: true // HONK
  }
};

// === MEMORY FRAGMENTS DUNGEON ===
const MEMORY_FRAGMENTS = {
  id: 'memory_fragments',
  name: 'Memory Fragments',
  type: 'story_dungeon',
  description: 'Short story-driven dungeons that unlock lore pieces.',
  unlockCondition: { loreFragmentsCollected: 10 },
  structure: {
    chaptersPerMaster: 3,
    chaptersPerWaifu: 2,
    secretChapters: 5
  },
  chapters: {
    gerald_ch1: {
      name: 'The Founding',
      description: 'How Gerald discovered the Snoot Scrolls',
      enemies: 'memory_shadows',
      reward: { lore: 'gerald_origin', cat: 'memory_jade_cat' }
    },
    rusty_ch1: {
      name: 'The Redemption',
      description: 'Rusty\'s life before joining the Sect',
      enemies: 'past_bandits',
      reward: { lore: 'rusty_origin', technique: 'reformed_strike' }
    },
    // ... more chapters for all masters and waifus
    secret_ch1: {
      name: 'The Eighth Master',
      description: '???',
      unlockCondition: { allMasterLoreComplete: true },
      reward: { lore: 'eighth_master_truth', unlocks: 'eighth_master' }
    }
  }
};
```

### Expanded Equipment System

Six equipment slots with deep customization.

```javascript
// equipment.js - Expanded system

const EQUIPMENT_SLOTS = {
  weapon: { name: 'Weapon', primary: true },
  armor: { name: 'Armor', primary: true },
  accessory: { name: 'Accessory', primary: false },
  mount: { name: 'Mount', primary: false, unlockRealm: 'coreFormation' },
  companion: { name: 'Companion', primary: false, unlockRealm: 'nascentSoul' },
  secretScroll: { name: 'Secret Technique Scroll', primary: false, unlockRealm: 'spiritSevering' }
};

// Equipment can cultivate (level up)
const EQUIPMENT_CULTIVATION = {
  maxLevel: 100,
  xpPerFloor: (floorNum) => floorNum * 10,
  breakpoints: {
    10: { stats: 1.2, visualUpgrade: true },
    25: { stats: 1.5, newPassive: true },
    50: { stats: 2.0, visualUpgrade: true, evolveOption: true },
    75: { stats: 3.0, newPassive: true },
    100: { stats: 5.0, mythicTransform: true }
  }
};

// Socket System
const SOCKET_SYSTEM = {
  maxSockets: { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 6 },
  spiritStones: {
    attack_stone: { stats: { attack: 10 }, stackable: true },
    defense_stone: { stats: { defense: 10 }, stackable: true },
    crit_stone: { stats: { critChance: 0.02 }, stackable: false },
    void_stone: { stats: { voidDamage: 0.1 }, rarity: 'legendary' },
    chaos_stone: { stats: { randomBonus: true }, rarity: 'mythic' }
  }
};

// Transmog System
const TRANSMOG_SYSTEM = {
  description: 'Separate appearance from stats',
  unlockCondition: { equipmentCrafted: 100 },
  cost: { jadeCatnip: 100 },
  restrictions: {
    sameSlotOnly: true,
    mustOwnAppearance: true
  }
};

// More Equipment Sets
const ADDITIONAL_SETS = {
  goose_slayer: {
    name: 'Goose Slayer Set',
    pieces: ['anti_goose_blade', 'honk_proof_armor', 'goose_tracker'],
    bonuses: {
      2: { gooseDamage: 1.5 },
      3: { gooseSpawnWarning: true, gooseRewards: 1.5 }
    }
  },
  waifu_blessed: {
    name: 'Waifu Blessed Set',
    pieces: ['heart_pendant', 'bond_ring', 'devotion_cloak', 'blessed_paws'],
    bonuses: {
      2: { bondGain: 1.25 },
      4: { waifuSkillCooldown: 0.5, harmonyCost: 0 }
    }
  },
  afk_master: {
    name: 'AFK Master Set',
    pieces: ['meditation_mat', 'auto_boop_gloves', 'time_dilation_hat'],
    bonuses: {
      2: { afkEfficiency: 1.5 },
      3: { afkCap: 48, dreamRealmAuto: true }
    }
  },
  prestige_legacy: {
    name: 'Prestige Legacy Set',
    pieces: ['seal_of_heavens', 'reincarnation_band', 'karma_cloak'],
    obtainedFrom: 'prestige_only',
    bonuses: {
      2: { heavenlySealGain: 1.25 },
      3: { startingBonus: 'random_legendary_cat' }
    }
  }
};
```

---

### 1. Prestige/Ascension System (Three Layers)

### Multi-Currency Economy

Nine currencies create interesting choices throughout the game.

```javascript
// economy.js - "Wealth without wisdom is poverty."

const CURRENCIES = {
  boopPoints: {
    id: 'bp',
    name: 'Boop Points',
    icon: '👆',
    source: 'Active booping',
    primarySink: 'Cat recruitment, basic upgrades',
    interestingChoice: 'Spend now vs. save for expensive cats',
    color: '#E94560'
  },

  purrPower: {
    id: 'pp',
    name: 'Purr Power',
    icon: '😺',
    source: 'Passive cat generation',
    primarySink: 'Technique upgrades, buildings',
    interestingChoice: 'Invest in PP generation vs. spend PP',
    color: '#FFD700'
  },

  qi: {
    id: 'qi',
    name: 'Qi',
    icon: '✨',
    source: 'Cultivation + booping',
    primarySink: 'Realm breakthroughs, abilities',
    interestingChoice: 'Use for power or save for tribulations',
    color: '#00BFFF',
    cap: (realm) => CULTIVATION_REALMS[realm].qiCap || 100
  },

  jadeCatnip: {
    id: 'jc',
    name: 'Jade Catnip',
    icon: '💎',
    source: 'Rare drops, events, achievements',
    primarySink: 'High-tier cat recruitment, waifu gifts',
    interestingChoice: 'Which rare cat to target',
    color: '#50C878',
    premium: true
  },

  spiritStones: {
    id: 'ss',
    name: 'Spirit Stones',
    icon: '💠',
    source: 'Dungeons, PvP',
    primarySink: 'Equipment enhancement, socketing',
    interestingChoice: 'Socket for stats vs. trade for materials',
    color: '#9370DB'
  },

  heavenlySeals: {
    id: 'hs',
    name: 'Heavenly Seals',
    icon: '🔮',
    source: 'Prestige/Ascension only',
    primarySink: 'Permanent upgrades',
    interestingChoice: 'Which permanent bonus to buy',
    color: '#FFFFFF',
    prestige: true
  },

  sectReputation: {
    id: 'rep',
    name: 'Sect Reputation',
    icon: '🏆',
    source: 'Social features, events, achievements',
    primarySink: 'Cosmetics, titles',
    interestingChoice: 'Flex vs. functional unlocks',
    color: '#FFD700'
  },

  waifuTokens: {
    id: 'wt',
    name: 'Waifu Tokens',
    icon: '💕',
    source: 'Bond activities',
    primarySink: 'Gifts, special interactions',
    interestingChoice: 'Which waifu to invest in',
    color: '#FFB6C1'
  },

  gooseFeathers: {
    id: 'gf',
    name: 'Goose Feathers',
    icon: '🪶',
    source: 'Goose kills only',
    primarySink: 'Joke shop with actually good items',
    interestingChoice: 'Humor vs. power tradeoff',
    color: '#F5F5F5',
    special: 'goose_only'
  }
};

// Conversion rates (where applicable)
const CURRENCY_CONVERSIONS = {
  bp_to_pp: { rate: 1000, direction: 'bp > pp' }, // 1000 BP = 1 PP
  jc_to_bp: { rate: 10000, direction: 'jc > bp' }, // 1 JC = 10000 BP
  gf_to_jc: { rate: 100, direction: 'gf > jc' } // 100 GF = 1 JC
};
```

### Three-Layer Prestige System

```javascript
// prestige.js - "To reach the highest heavens, one must first return to nothing."

// === LAYER 1: ASCENSION ===
const ASCENSION = {
  name: 'Ascension',
  threshold: 1e9, // 1 Billion PP
  currency: 'heavenlySeals',

  resets: [
    'cultivationRealm', // Back to Mortal
    'catsBelow', 'immortal', // Lose non-immortal cats
    'currencies', // BP, PP, Qi, Spirit Stones reset
    'buildings', // Buildings reset
    'equipment' // Equipment resets
  ],

  keeps: [
    'heavenlySeals',
    'permanentUpgrades',
    'waifuBondProgress', // Halved but not reset
    'achievements',
    'cosmetics',
    'gooseAlly',
    'unlockedMasters',
    'forbiddenTechniques',
    'loreFragments'
  ],

  gains: {
    ascensionMultiplier: (count) => 1 + (count * 0.5), // 1.5x, 2x, 2.5x...
    heavenlySeals: 'calculated',
    unlocks: ['heavenly_decree']
  },

  newMechanic: {
    name: 'Heavenly Decree',
    description: 'Choose a permanent modifier for this ascension run',
    options: [
      { id: 'speed', name: 'Decree of Swiftness', effect: { boopSpeed: 1.5 } },
      { id: 'wealth', name: 'Decree of Prosperity', effect: { currencyGain: 1.5 } },
      { id: 'fortune', name: 'Decree of Fortune', effect: { rareCatChance: 2.0 } },
      { id: 'bonds', name: 'Decree of Bonds', effect: { waifuBondGain: 2.0 } },
      { id: 'combat', name: 'Decree of War', effect: { dungeonPower: 1.5 } }
    ]
  }
};

const HEAVENLY_SEAL_BONUSES = {
  1: { productionMult: 1.10, desc: '+10% all production permanently' },
  5: { startingCats: { count: 3, minRealm: 'earth' }, desc: 'Start with 3 Earth-realm cats' },
  10: { unlocks: 'forbidden_techniques', desc: 'Unlock Forbidden Techniques tree' },
  25: { startingWaifu: { bondPercent: 0.5 }, desc: 'Start with a random Waifu at 50% bond' },
  50: { gooseMoodBonus: 1, desc: 'Geese spawn with +1 mood level' },
  100: { unlocks: 'eighth_master', desc: 'Unlock The Eighth Master' },
  200: { unlocks: 'reincarnation_preview', desc: 'Glimpse the path beyond Ascension' },
  500: { allStats: 2.0, desc: 'Double all stats permanently' }
};

// === LAYER 2: REINCARNATION ===
const REINCARNATION = {
  name: 'Reincarnation',
  threshold: { ascensions: 10, heavenlySeals: 500 },
  currency: 'karmaPoints',

  resets: [
    ...ASCENSION.resets,
    'ascensionCount', // Ascension count resets
    'heavenlySeals' // Partial seal reset (keep 10%)
  ],

  keeps: [
    'karmaPoints',
    'reincarnationKarma',
    'coreUnlocks', // Key progression unlocks
    'waifuMaxBonds', // If reached max bond, remember it
    'achievementsPlus', // Achievements + meta achievements
    'cosmeticsPlus',
    'loreComplete' // Completed lore stays
  ],

  gains: {
    karmaPoints: 'calculated',
    reincarnationMultiplier: (count) => Math.pow(2, count), // 2x, 4x, 8x...
    unlocks: ['past_life_memories', 'karma_shop']
  },

  newMechanic: {
    name: 'Past Life Memories',
    description: 'Start with a random powerful buff based on previous runs',
    examples: [
      { id: 'memory_warrior', trigger: 'previous_high_combat', effect: { combatPower: 3.0 } },
      { id: 'memory_merchant', trigger: 'previous_high_wealth', effect: { startingBP: 1e6 } },
      { id: 'memory_lover', trigger: 'previous_max_bond', effect: { waifuStartBond: 50 } },
      { id: 'memory_hunter', trigger: 'previous_many_cats', effect: { catDropRate: 2.0 } }
    ]
  }
};

const KARMA_SHOP = {
  categories: {
    starting: [
      { id: 'start_cats', cost: 10, effect: { startingCats: 5 }, repeatable: true },
      { id: 'start_bp', cost: 5, effect: { startingBP: 1e6 }, repeatable: true },
      { id: 'start_realm', cost: 50, effect: { startingRealm: 'qiCondensation' } }
    ],
    permanent: [
      { id: 'perm_production', cost: 25, effect: { permanentProduction: 1.25 }, repeatable: true },
      { id: 'perm_crit', cost: 30, effect: { permanentCrit: 0.05 }, repeatable: true },
      { id: 'perm_afk', cost: 40, effect: { permanentAFK: 1.5 } }
    ],
    unlocks: [
      { id: 'unlock_secret_waifu', cost: 100, effect: { unlock: 'grandmother' } },
      { id: 'unlock_void_element', cost: 150, effect: { unlock: 'void_element' } },
      { id: 'unlock_transcendence', cost: 500, effect: { unlock: 'transcendence_preview' } }
    ]
  }
};

// === LAYER 3: TRANSCENDENCE ===
const TRANSCENDENCE = {
  name: 'Transcendence',
  threshold: { reincarnations: 5, karmaPoints: 1000, trueImmortalReached: true },
  currency: 'transcendencePoints',

  description: 'The ultimate prestige. Near-total reset, but unlocks the true endgame.',

  resets: [
    'almost_everything' // Near-total reset
  ],

  keeps: [
    'transcendencePoints',
    'metaAchievements',
    'ultimateCosmetics',
    'celestialProgress' // Progress in Celestial Realm
  ],

  gains: {
    transcendencePoints: 1, // Very rare
    unlocks: ['celestial_realm', 'true_endgame', 'story_conclusion']
  },

  celestialRealm: {
    description: 'An entirely new progression track. Snoot Booper 2 within Snoot Booper.',
    features: [
      'New cultivaiton system',
      'Celestial cats',
      'The true story conclusion',
      'Infinite scaling content',
      'Leaderboard eternal'
    ]
  }
};

class PrestigeSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }

  // Check what prestiges are available
  getAvailablePrestiges() {
    const available = [];

    if (this.canAscend()) available.push('ascension');
    if (this.canReincarnate()) available.push('reincarnation');
    if (this.canTranscend()) available.push('transcendence');

    return available;
  }

  canAscend() {
    return this.gameState.purrPower >= ASCENSION.threshold;
  }

  canReincarnate() {
    return this.gameState.totalAscensions >= REINCARNATION.threshold.ascensions &&
      this.gameState.heavenlySeals >= REINCARNATION.threshold.heavenlySeals;
  }

  canTranscend() {
    return this.gameState.totalReincarnations >= TRANSCENDENCE.threshold.reincarnations &&
      this.gameState.karmaPoints >= TRANSCENDENCE.threshold.karmaPoints &&
      this.gameState.reachedRealm === 'trueImmortal';
  }

  // Preview what you'll get
  previewPrestige(type) {
    switch (type) {
      case 'ascension':
        return {
          sealsEarned: this.calculateSealsEarned(),
          multiplier: ASCENSION.gains.ascensionMultiplier(this.gameState.totalAscensions + 1),
          newUnlocks: this.getNewAscensionUnlocks()
        };
      case 'reincarnation':
        return {
          karmaEarned: this.calculateKarmaEarned(),
          sealRetention: Math.floor(this.gameState.heavenlySeals * 0.1),
          multiplier: REINCARNATION.gains.reincarnationMultiplier(this.gameState.totalReincarnations + 1),
          newUnlocks: this.getNewReincarnationUnlocks()
        };
      case 'transcendence':
        return {
          transcendencePoints: 1,
          celestialRealmAccess: true,
          warning: 'This is the ultimate reset. Are you ready to begin anew?'
        };
    }
  }

  performPrestige(type, options = {}) {
    switch (type) {
      case 'ascension':
        return this.performAscension(options.decree);
      case 'reincarnation':
        return this.performReincarnation();
      case 'transcendence':
        return this.performTranscendence();
    }
  }

  calculateSealsEarned() {
    const pp = this.gameState.purrPower;
    const cats = this.gameState.cats.length;
    const waifuBonds = Object.values(this.gameState.waifuBonds).reduce((a, b) => a + b, 0);
    const gooseBoops = this.gameState.gooseBoops;
    const pagodaFloor = this.gameState.highestPagodaFloor;

    let seals = Math.floor(Math.log10(pp) - 8);
    seals += Math.floor(cats / 20);
    seals += Math.floor(waifuBonds / 100);
    seals += Math.floor(gooseBoops / 50);
    seals += Math.floor(pagodaFloor / 10);

    return Math.max(1, seals);
  }

  calculateKarmaEarned() {
    const seals = this.gameState.heavenlySeals;
    const ascensions = this.gameState.totalAscensions;
    const maxBonds = Object.values(this.gameState.waifuBonds).filter(b => b >= 100).length;

    let karma = Math.floor(seals / 50);
    karma += ascensions * 2;
    karma += maxBonds * 10;

    return Math.max(1, karma);
  }
}

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

### 2. Building System (Expanded to 15+)

Each building has deep sub-systems and visual evolution.

```javascript
// buildings.js - "A great sect needs great halls."

const BUILDINGS = {
  // === CORE BUILDINGS ===
  cat_pagoda: {
    id: 'cat_pagoda',
    name: 'Cat Pagoda',
    category: 'core',
    description: '+10 cat capacity per level',
    baseCost: 10000,
    costScale: 1.5,
    maxLevel: 10,
    effect: (level) => ({ catCapacity: level * 10 }),
    visualUpgrades: [1, 5, 10], // Sprite changes at these levels
    subSystem: null
  },

  meditation_garden: {
    id: 'meditation_garden',
    name: 'Meditation Garden',
    category: 'core',
    description: '+25% PP when idle, environmental bonuses',
    baseCost: 50000,
    costScale: 2.0,
    maxLevel: 10,
    effect: (level) => ({
      idlePPBonus: 0.25 * level,
      idleThreshold: Math.max(600, 3600 - (level * 300)), // Less time needed at higher levels
      seasonalBonus: level >= 5
    }),
    subSystem: {
      type: 'garden_cultivation',
      features: ['herb_growing', 'spirit_stone_formation', 'seasonal_events'],
      minigame: 'zen_garden'
    }
  },

  training_dojo: {
    id: 'training_dojo',
    name: 'Training Dojo',
    category: 'core',
    description: 'Cats train techniques, sparring matches',
    baseCost: 100000,
    costScale: 2.0,
    maxLevel: 10,
    effect: (level) => ({
      catExpPerHour: 10 * level,
      techniqueSlots: 4 + Math.floor(level / 3),
      sparringBonus: level >= 5 ? 1.5 : 1.0
    }),
    subSystem: {
      type: 'training',
      features: ['technique_learning', 'sparring_arena', 'training_dummies'],
      unlocks: { 5: 'advanced_techniques', 10: 'secret_techniques' }
    }
  },

  // === PRODUCTION BUILDINGS ===
  alchemy_lab: {
    id: 'alchemy_lab',
    name: 'Alchemy Laboratory',
    category: 'production',
    description: 'Craft potions, materials, and cat treats',
    baseCost: 250000,
    costScale: 2.5,
    maxLevel: 10,
    effect: (level) => ({
      recipeSlots: 2 + level,
      craftingSpeed: 1 + (level * 0.1),
      rareIngredientChance: level * 0.02
    }),
    subSystem: {
      type: 'crafting',
      features: ['recipe_discovery', 'ingredient_storage', 'auto_craft'],
      minigame: 'potion_brewing',
      recipes: {
        basic: ['health_potion', 'qi_potion', 'happiness_treat'],
        advanced: ['realm_boost_elixir', 'goose_repellent', 'waifu_gift'],
        legendary: ['eternal_catnip', 'void_essence', 'transcendence_pill']
      }
    }
  },

  library: {
    id: 'library',
    name: 'Sect Library',
    category: 'production',
    description: 'Research techniques, unlock lore',
    baseCost: 500000,
    costScale: 2.0,
    maxLevel: 10,
    effect: (level) => ({
      researchSpeed: 1 + (level * 0.15),
      loreDropBonus: level * 0.05,
      techniqueUnlockCost: Math.max(0.5, 1 - (level * 0.05))
    }),
    subSystem: {
      type: 'research',
      features: ['technique_research', 'lore_collection', 'forbidden_section'],
      unlocks: { 5: 'ancient_texts', 10: 'forbidden_knowledge' }
    }
  },

  treasury_vault: {
    id: 'treasury_vault',
    name: 'Treasury Vault',
    category: 'production',
    description: 'Generate passive BP, store valuables',
    baseCost: 1000000,
    costScale: 3.0,
    maxLevel: 10,
    effect: (level) => ({
      afkBPPerSecond: 100 * Math.pow(level, 1.5),
      currencyCap: 1 + (level * 0.1),
      theftProtection: level >= 5
    }),
    subSystem: {
      type: 'storage',
      features: ['currency_interest', 'item_vault', 'security_system']
    }
  },

  // === SOCIAL BUILDINGS ===
  waifu_quarters: {
    id: 'waifu_quarters',
    name: 'Waifu Quarters',
    category: 'social',
    description: 'Waifu housing, daily gifts, special events',
    baseCost: 200000,
    costScale: 2.5,
    maxLevel: 10,
    effect: (level) => ({
      dailyGifts: level,
      bondGainBonus: 1 + (level * 0.05),
      waifuCapacity: 6 + Math.floor(level / 2)
    }),
    subSystem: {
      type: 'housing',
      features: ['room_customization', 'gift_schedule', 'special_events'],
      unlocks: { 5: 'couple_activities', 10: 'harmony_system' }
    }
  },

  hot_springs: {
    id: 'hot_springs',
    name: 'Hot Springs',
    category: 'social',
    description: 'Recovery, bond events, relaxation',
    baseCost: 750000,
    costScale: 2.0,
    maxLevel: 5,
    effect: (level) => ({
      catHappinessRegen: level * 10,
      bondActivityBonus: 1.5 + (level * 0.1),
      postDungeonRecovery: level >= 3
    }),
    subSystem: {
      type: 'activity',
      features: ['group_soaking', 'waifu_events', 'cat_spa'],
      specialEvents: ['full_moon_soak', 'festival_bath', 'couples_retreat']
    }
  },

  arena: {
    id: 'arena',
    name: 'Combat Arena',
    category: 'social',
    description: 'PvP matches, tournaments, rankings',
    baseCost: 2000000,
    costScale: 2.0,
    maxLevel: 5,
    effect: (level) => ({
      matchmakingSpeed: 1 + (level * 0.2),
      rankRewards: level,
      spectatorBonus: level >= 3
    }),
    subSystem: {
      type: 'pvp',
      features: ['ranked_matches', 'tournaments', 'spectate_friends'],
      unlocks: { 3: 'weekly_tournament', 5: 'championship' }
    }
  },

  portal_gate: {
    id: 'portal_gate',
    name: 'Portal Gate',
    category: 'social',
    description: 'Visit friends\' sects, trading',
    baseCost: 5000000,
    costScale: 1.0,
    maxLevel: 1,
    effect: () => ({
      sectVisits: true,
      trading: true,
      giftSending: true
    }),
    subSystem: {
      type: 'social',
      features: ['sect_tourism', 'gift_exchange', 'collaborative_events']
    }
  },

  // === UTILITY BUILDINGS ===
  celestial_kitchen: {
    id: 'celestial_kitchen',
    name: 'Celestial Kitchen',
    category: 'utility',
    description: 'Auto-feed cats, cook buffs',
    baseCost: 500000,
    costScale: 2.0,
    maxLevel: 10,
    effect: (level) => ({
      autoFeed: true,
      happinessDecayReduction: 0.5 + (level * 0.05),
      mealBuffDuration: 1 + (level * 0.1)
    }),
    subSystem: {
      type: 'cooking',
      features: ['recipe_collection', 'cat_preferences', 'feast_events'],
      recipes: {
        meals: ['basic_kibble', 'gourmet_fish', 'celestial_feast'],
        buffs: ['speed_snack', 'power_protein', 'lucky_treat']
      }
    }
  },

  goose_watchtower: {
    id: 'goose_watchtower',
    name: 'Goose Watchtower',
    category: 'utility',
    description: 'Goose detection, traps, rewards',
    baseCost: 250000,
    costScale: 2.0,
    maxLevel: 10,
    effect: (level) => ({
      gooseSpawnBonus: 0.05 * level,
      gooseWarning: level >= 1,
      gooseRewardBonus: 1 + (level * 0.1),
      gooseTraps: level >= 5 ? Math.floor(level / 5) : 0
    }),
    subSystem: {
      type: 'goose_management',
      features: ['early_warning', 'trap_placement', 'goose_research'],
      unlocks: { 5: 'goose_traps', 10: 'goose_summoning' }
    }
  },

  observatory: {
    id: 'observatory',
    name: 'Celestial Observatory',
    category: 'utility',
    description: 'Track time, predict events, star bonuses',
    baseCost: 1500000,
    costScale: 2.0,
    maxLevel: 5,
    effect: (level) => ({
      eventPrediction: level,
      celestialBonusWindow: level * 60, // Minutes of bonus active
      nightBonus: 1 + (level * 0.1)
    }),
    subSystem: {
      type: 'astrology',
      features: ['event_calendar', 'celestial_alignment', 'horoscope'],
      predictions: ['rare_cat_sighting', 'golden_goose', 'waifu_event']
    }
  },

  // === SPECIAL BUILDINGS ===
  hall_of_legends: {
    id: 'hall_of_legends',
    name: 'Hall of Legends',
    category: 'special',
    description: 'Display achievements, visitor bonuses',
    baseCost: 3000000,
    costScale: 3.0,
    maxLevel: 5,
    effect: (level) => ({
      achievementDisplay: true,
      visitorBonus: 1 + (level * 0.05),
      legendaryShowcase: level >= 3,
      sectPrestige: level * 100
    }),
    subSystem: {
      type: 'museum',
      features: ['trophy_room', 'cat_gallery', 'lore_archive']
    }
  },

  goose_pen: {
    id: 'goose_pen',
    name: 'Goose Pen',
    category: 'special',
    description: 'Yes, really. Tamed geese.',
    baseCost: 10000000,
    costScale: 2.0,
    maxLevel: 5,
    unlockCondition: { cobraChickenDefeated: true },
    effect: (level) => ({
      tamedGeese: level,
      gooseIncomePerHour: 100 * level,
      chaosEvents: true
    }),
    subSystem: {
      type: 'goose_husbandry',
      features: ['goose_breeding', 'goose_racing', 'honk_choir'],
      comedy: true
    }
  },

  pagoda_entrance: {
    id: 'pagoda_entrance',
    name: 'Pagoda Entrance',
    category: 'special',
    description: 'Dungeon prep, relic storage',
    baseCost: 5000000,
    costScale: 2.0,
    maxLevel: 5,
    effect: (level) => ({
      dungeonPrepTime: Math.max(0, 30 - (level * 5)),
      relicStorage: 5 + (level * 5),
      checkpointSaves: level
    }),
    subSystem: {
      type: 'dungeon_prep',
      features: ['formation_planning', 'relic_management', 'party_templates']
    }
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

## Testing Checklist (Expanded)

### Core Mechanics
- [ ] Boop registers correctly, Qi particles appear
- [ ] Each Master's passive works correctly (all 8 masters)
- [ ] Combo system tracks and displays properly
- [ ] Critical boops trigger at correct rate (+ Nik bonus)
- [ ] PP generates while tab is open
- [ ] PP generates correctly while AFK (+ Steve bonus)
- [ ] All Eight Masters are selectable (Eighth unlocks at 100 seals)

### Cultivation System (NEW)
- [ ] All 10 realms progress correctly (Mortal → Heavenly Sovereign)
- [ ] XP scaling follows exponential curves
- [ ] Tribulations trigger at realm boundaries
- [ ] Tribulation failure gives consolation rewards
- [ ] Realm passives unlock at correct thresholds
- [ ] Player sprite evolves with realm
- [ ] Realm-specific dialogue from NPCs/waifus

### Technique Stances (NEW)
- [ ] All 6 stances unlock at correct realms
- [ ] Stance switching works mid-session
- [ ] Each stance's special ability triggers correctly
- [ ] Mastery XP tracks per stance
- [ ] Fusion techniques unlock when requirements met
- [ ] Rhythm bonus triggers when on-beat
- [ ] Forbidden Technique costs Qi correctly

### Cat System (EXPANDED)
- [ ] All cat realms (Kitten Mortal → Cosmic Entity) obtainable
- [ ] Cat cultivation XP and leveling works
- [ ] All 7 elements (5 basic + void + chaos) function correctly
- [ ] Element resonance bonuses calculate properly
- [ ] Cat personality affects technique learning
- [ ] Star system (1-6) upgrades on duplicates
- [ ] Cat team of 4+1 reserve functions
- [ ] Formation bonuses apply correctly
- [ ] Team synergies detect and apply
- [ ] Cat fusion recipes work
- [ ] Legendary cats require proper unlock conditions

### Waifu System (EXPANDED)
- [ ] All 12+ waifus unlockable via conditions
- [ ] Hidden waifus (Grandmother, Rival, etc.) unlock correctly
- [ ] Bond levels persist and increase correctly (0-100)
- [ ] Bond activities (tea, sparring, etc.) work
- [ ] Activity preferences give bonus bond
- [ ] Gift affinities working (love/like/neutral/dislike)
- [ ] Dialogue changes with bond level
- [ ] Max bond rewards legendary cat + technique
- [ ] Waifu teaching schools function
- [ ] Mastery exams challenge and reward
- [ ] Jealousy/harmony system tracks attention
- [ ] Waifu cultivation (helping them breakthrough) works

### Dungeon Systems (EXPANDED)
- [ ] Infinite Pagoda 100+ floors function
- [ ] Boss every 10th floor
- [ ] Floor modifiers apply correctly
- [ ] Relics drop and stack bonuses
- [ ] Branching paths offer choices
- [ ] Checkpoints save every 10 floors
- [ ] Bamboo Forest survival mode works
- [ ] Celestial Tournament bracket functions
- [ ] Dream Realm generates from player data
- [ ] Goose Dimension is sufficiently chaotic
- [ ] Memory Fragments unlock lore

### Equipment System (EXPANDED)
- [ ] All 6 slots equip correctly (weapon, armor, accessory, mount, companion, scroll)
- [ ] Equipment cultivation (leveling gear) works
- [ ] Socket system functions
- [ ] Set bonuses apply at thresholds
- [ ] Transmog separates appearance from stats
- [ ] Equipment evolution triggers with right materials

### Economy & Prestige (NEW)
- [ ] All 9 currencies track correctly
- [ ] Currency conversions work where applicable
- [ ] Ascension triggers at 1B PP
- [ ] Heavenly Seals calculate and award correctly
- [ ] Heavenly Decree choice applies
- [ ] Reincarnation triggers after 10 ascensions
- [ ] Karma Points calculate and award
- [ ] Past Life Memories grant random buff
- [ ] Transcendence triggers at requirements
- [ ] Celestial Realm unlocks post-transcendence

### Buildings (EXPANDED)
- [ ] All 15+ buildings purchasable and upgradeable
- [ ] Building sub-systems function (alchemy recipes, etc.)
- [ ] Territory expansion unlocks
- [ ] Building visual upgrades at thresholds

### Events & Time
- [ ] Day/night cycle affects gameplay
- [ ] Seasonal bonuses apply
- [ ] Daily events rotate
- [ ] Weekly sect challenges function
- [ ] Monthly festivals trigger
- [ ] Random Jianghu events spawn
- [ ] Hidden events trigger on conditions

### Save/Load (EXPANDED)
- [ ] Auto-save triggers every 30 seconds
- [ ] All new systems persist in save
- [ ] Prestige data persists correctly
- [ ] Version migration doesn't break saves
- [ ] Export/Import for sharing works
- [ ] BigNumber values save/load correctly

### Goose System 🦢
- [ ] Geese spawn at correct rate
- [ ] Goose Dimension dungeon functions
- [ ] Goose Pen building works (tamed geese)
- [ ] Honk Maiden waifu unlocks correctly

### Social Features
- [ ] Sect visits work via Portal Gate
- [ ] Gift exchange functions
- [ ] Leaderboards update
- [ ] Tournament matchmaking works

### The Seven Masters Test
Before shipping, verify each Master has compelling content:
- [ ] Gerald: Meditation and balance feel rewarding
- [ ] Rusty: Combat is satisfying and impactful
- [ ] Steve: AFK builds are viable and rewarding
- [ ] Andrew: Speed runs and events are exciting
- [ ] Nik: Crit builds feel powerful
- [ ] Yuelin: Story/bond content is engaging
- [ ] Scott: Stacking strategies are viable

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

---

## Version History

### Version 2.0 - Grand Enhancement Edition

**Summary:** Comprehensive expansion of all systems to create deep, layered progression that keeps players hooked for months.

#### Major Additions

| System | Changes |
|--------|---------|
| **Cultivation** | Expanded from 5 tiers to 10 realms × 9 ranks (90 levels), added Tribulation bosses |
| **Boop System** | Added 6 Technique Stances with mastery progression, rhythm bonuses, fusion techniques |
| **Cat Collection** | Added cat cultivation, 7 elements, personalities, techniques, teams (4+1), fusion recipes, 6-star system |
| **Waifus** | Expanded from 6 to 12+ waifus, added teaching schools, bond activities, harmony/jealousy, waifu cultivation |
| **Dungeons** | Added 5 dungeon types (Pagoda, Bamboo Forest, Tournament, Dream Realm, Goose Dimension), Slay the Spire-style relics |
| **Equipment** | Expanded to 6 slots, added set bonuses, socketing, equipment cultivation, transmog |
| **Economy** | Added 9 currencies with meaningful choices |
| **Prestige** | Expanded to 3 layers (Ascension → Reincarnation → Transcendence) |
| **Buildings** | Expanded to 15+ buildings with deep sub-systems |
| **Events** | Added daily/weekly/monthly/hidden event layers |

#### New Systems
- Tribulation system with boss fights for realm breakthroughs
- Dream Realm dungeon that generates from player data
- Goose Dimension comedy horror dungeon
- Past Life Memories buff system for reincarnation
- Heavenly Decree run modifiers for ascension
- Karma Shop for permanent upgrades
- Celestial Realm true endgame content

#### Architecture Changes
- Modular file structure with event bus for cross-system communication
- BigNumber support for late-game values
- Comprehensive save system with migration support
- All balance values externalized to JSON files

### Version 1.0 - Original Release
- Core boop mechanics
- Seven Masters
- Basic cat collection (5 realms)
- Six waifus
- Goose system
- Infinite Pagoda
- Basic buildings
- Single-layer prestige

---

*"The Sect does not ship features. We ship experiences."*
— Implementation Philosophy