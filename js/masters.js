/**
 * masters.js - The Seven Wandering Masters of the Celestial Snoot Sect
 */

const MASTERS = {
  gerald: {
    id: 'gerald',
    name: 'Gerald',
    title: 'The Jade Palm',
    role: 'Sect Leader',
    description: 'Founder of the Celestial Snoot Sect. His balanced approach to cultivation has brought harmony to all snoots under his care.',
    passive: {
      name: 'Tranquil Boop',
      description: 'Meditation multiplier applies to active booping. +25% BP while calm.',
      effect: (gameState) => {
        return { bpMultiplier: 1.25 };
      }
    },
    emoji: '🐉',
    color: '#50C878',
    quotes: [
      "Balance in all things. Especially snoots.",
      "The Sect grows stronger with each boop.",
      "I see potential in you, young cultivator.",
      "A thousand boops begin with a single touch.",
      "Harmony is the path to ultimate snoot mastery."
    ]
  },

  rusty: {
    id: 'rusty',
    name: 'Rusty',
    title: 'The Crimson Fist',
    role: 'War General',
    description: 'Former bandit king, reformed cat lover. His aggressive booping style has earned him legendary status.',
    passive: {
      name: 'Thousand Boop Barrage',
      description: 'Active ability: 10 seconds of 5x boop speed (5 min cooldown).',
      effect: (gameState) => {
        return {
          activeAbility: true,
          duration: 10000,
          cooldown: 300000,
          boopSpeedMultiplier: 5
        };
      }
    },
    emoji: '👊',
    color: '#DC143C',
    quotes: [
      "When in doubt, boop harder!",
      "These paws were made for booping!",
      "THOUSAND BOOP BARRAGE!",
      "Weakness is just strength waiting to happen!",
      "Every snoot is a challenge. ACCEPTED!"
    ]
  },

  steve: {
    id: 'steve',
    name: 'Steve',
    title: 'The Flowing River',
    role: 'Strategist',
    description: 'Calculated the optimal snoot-to-boop ratio. His patience yields the greatest cultivation gains.',
    passive: {
      name: 'Eternal Flow',
      description: 'Offline PP generation is doubled. Patience rewards.',
      effect: (gameState) => {
        return { afkMultiplier: 2.0 };
      }
    },
    emoji: '🌊',
    color: '#4169E1',
    quotes: [
      "Patience yields the greatest gains.",
      "The math is clear: more cats = more PP.",
      "I've optimized our cultivation schedule.",
      "Efficiency is the highest form of respect.",
      "Let the river of time carry your cultivation."
    ]
  },

  andrew: {
    id: 'andrew',
    name: 'Andrew',
    title: 'The Thunder Step',
    role: 'Scout',
    description: 'Fastest courier in the Jianghu. Always first to discover new snoots and rare events.',
    passive: {
      name: 'Lightning Reflexes',
      description: '+50% chance to discover events and rare cats first.',
      effect: (gameState) => {
        return {
          eventDiscoveryBonus: 1.5,
          rareCatBonus: 1.5
        };
      }
    },
    emoji: '⚡',
    color: '#FFD700',
    quotes: [
      "Already found three cats while you were reading this.",
      "Speed is the essence of cultivation!",
      "New event spotted! Follow me!",
      "Gotta go fast! Snoots await!",
      "First to the boop, first to the glory!"
    ]
  },

  nik: {
    id: 'nik',
    name: 'Nik',
    title: 'The Shadow Moon',
    role: 'Assassin',
    description: 'Mysterious. The cats trust him. No one knows why. His critical strikes are legendary.',
    passive: {
      name: 'Phantom Boop',
      description: '+25% critical boop chance. Strike from the shadows.',
      effect: (gameState) => {
        return { critChanceBonus: 0.25 };
      }
    },
    emoji: '🌙',
    color: '#483D8B',
    quotes: [
      "...",
      "*appears from shadows* ...boop.",
      "The night is full of snoots.",
      "Silence. Then, the critical strike.",
      "You didn't see me. Neither did the snoot."
    ]
  },

  yuelin: {
    id: 'yuelin',
    name: 'Yuelin',
    title: 'The Lotus Sage',
    role: 'Healer',
    description: 'Speaks to cats in their ancient tongue. Her presence brings happiness to all felines.',
    passive: {
      name: 'Harmonious Aura',
      description: 'All cats gain +50% happiness. Happy cats = more PP.',
      effect: (gameState) => {
        return { catHappinessMultiplier: 1.5 };
      }
    },
    emoji: '🪷',
    color: '#FFB6C1',
    quotes: [
      "The cats tell me you have a kind heart.",
      "Harmony brings the greatest power.",
      "Each cat carries ancient wisdom.",
      "Listen... the snoots are singing.",
      "With love, even the shyest cat will boop."
    ]
  },

  scott: {
    id: 'scott',
    name: 'Scott',
    title: 'The Mountain',
    role: 'Guardian',
    description: 'Meditated for 1000 days. A cat sat on him the whole time. His foundation is unshakeable.',
    passive: {
      name: 'Unshakeable Foundation',
      description: 'Multiplier bonuses never decay or reset.',
      effect: (gameState) => {
        return { preventDecay: true };
      }
    },
    emoji: '⛰️',
    color: '#8B4513',
    quotes: [
      "I am the mountain. The cats are my snow.",
      "Patience. Stability. Snoots.",
      "...I haven't moved in three days. Worth it.",
      "The foundation supports all cultivation.",
      "Stillness is the ultimate technique."
    ]
  }
};

/**
 * MasterSystem - Handles master selection and bonuses
 */
class MasterSystem {
  constructor() {
    this.selectedMaster = null;
    this.allMasters = MASTERS;
  }

  selectMaster(masterId) {
    if (this.allMasters[masterId]) {
      this.selectedMaster = this.allMasters[masterId];
      return this.selectedMaster;
    }
    return null;
  }

  getPassiveEffects(gameState) {
    if (!this.selectedMaster) return {};
    return this.selectedMaster.passive.effect(gameState);
  }

  getRandomQuote() {
    if (!this.selectedMaster) return '';
    const quotes = this.selectedMaster.quotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  getMasterById(id) {
    return this.allMasters[id] || null;
  }

  getAllMasters() {
    return Object.values(this.allMasters);
  }
}

// Export to window
window.MASTERS = MASTERS;
window.MasterSystem = MasterSystem;
