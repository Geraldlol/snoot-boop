/**
 * masters.js - The Seven Wandering Masters of the Celestial Snoot Sect
 *
 * This file supports loading data from data/masters.json via dataLoader,
 * with fallback to hardcoded data if dataLoader is not available.
 */

// Hardcoded fallback data - used when dataLoader is not available
const MASTERS_FALLBACK = {
  gerald: {
    id: 'gerald',
    name: 'Gerald',
    title: 'The Jade Palm',
    role: 'Sect Leader',
    description: 'Founder of the Celestial Snoot Sect. His balanced approach to cultivation has brought harmony to all snoots under his care.',
    passive: {
      name: 'Tranquil Boop',
      description: 'Meditation multiplier applies to active booping. +25% BP while calm.',
      effect: {
        type: 'conditional_multiplier',
        condition: 'isMeditating',
        stat: 'bpMultiplier',
        value: 1.25
      }
    },
    emoji: '🐉',
    portrait: 'assets/masters/gerald.png',
    sprite: 'masters/gerald.png',
    color: '#50C878',
    quotes: [
      "Balance in all things. Especially snoots.",
      "The Sect grows stronger with each boop.",
      "I see potential in you, young cultivator.",
      "A thousand boops begin with a single touch.",
      "Harmony is the path to ultimate snoot mastery."
    ],
    unlockCondition: 'starter'
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
      effect: {
        type: 'active_ability',
        duration: 10000,
        cooldown: 300000,
        stat: 'boopSpeedMultiplier',
        value: 5
      }
    },
    emoji: '👊',
    portrait: 'assets/masters/rusty.png',
    sprite: 'masters/rusty.png',
    color: '#DC143C',
    quotes: [
      "When in doubt, boop harder!",
      "These paws were made for booping!",
      "THOUSAND BOOP BARRAGE!",
      "Weakness is just strength waiting to happen!",
      "Every snoot is a challenge. ACCEPTED!"
    ],
    unlockCondition: 'starter'
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
      effect: {
        type: 'multiplier',
        stat: 'afkMultiplier',
        value: 2.0
      }
    },
    emoji: '🌊',
    portrait: 'assets/masters/steve.png',
    sprite: 'masters/steve.png',
    color: '#4169E1',
    quotes: [
      "Patience yields the greatest gains.",
      "The math is clear: more cats = more PP.",
      "I've optimized our cultivation schedule.",
      "Efficiency is the highest form of respect.",
      "Let the river of time carry your cultivation."
    ],
    unlockCondition: 'starter'
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
      effect: {
        type: 'multiplier',
        stats: {
          eventDiscoveryBonus: 1.5,
          rareCatBonus: 1.5
        }
      }
    },
    emoji: '⚡',
    portrait: 'assets/masters/andrew.png',
    sprite: 'masters/andrew.png',
    color: '#FFD700',
    quotes: [
      "Already found three cats while you were reading this.",
      "Speed is the essence of cultivation!",
      "New event spotted! Follow me!",
      "Gotta go fast! Snoots await!",
      "First to the boop, first to the glory!"
    ],
    unlockCondition: 'starter'
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
      effect: {
        type: 'additive',
        stat: 'critChanceBonus',
        value: 0.25
      }
    },
    emoji: '🌙',
    portrait: 'assets/masters/nik.png',
    sprite: 'masters/nik.png',
    color: '#483D8B',
    quotes: [
      "...",
      "*appears from shadows* ...boop.",
      "The night is full of snoots.",
      "Silence. Then, the critical strike.",
      "You didn't see me. Neither did the snoot."
    ],
    unlockCondition: 'starter'
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
      effect: {
        type: 'multiplier',
        stat: 'catHappinessMultiplier',
        value: 1.5
      }
    },
    emoji: '🪷',
    portrait: 'assets/masters/yuelin.png',
    sprite: 'masters/yuelin.png',
    color: '#FFB6C1',
    quotes: [
      "The cats tell me you have a kind heart.",
      "Harmony brings the greatest power.",
      "Each cat carries ancient wisdom.",
      "Listen... the snoots are singing.",
      "With love, even the shyest cat will boop."
    ],
    unlockCondition: 'starter'
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
      effect: {
        type: 'special',
        stat: 'preventDecay',
        value: true
      }
    },
    emoji: '⛰️',
    portrait: 'assets/masters/scott.png',
    sprite: 'masters/scott.png',
    color: '#8B4513',
    quotes: [
      "I am the mountain. The cats are my snow.",
      "Patience. Stability. Snoots.",
      "...I haven't moved in three days. Worth it.",
      "The foundation supports all cultivation.",
      "Stillness is the ultimate technique."
    ],
    unlockCondition: 'starter'
  },

  mythic: {
    id: 'mythic',
    name: '???',
    title: 'The Forgotten One',
    role: 'Unknown',
    description: 'A master erased from history. Why? Their echoes of eternity grant partial access to all other masters\' powers.',
    passive: {
      name: 'Echoes of Eternity',
      description: 'All other masters\' passives are active at 25% power',
      effect: {
        type: 'special',
        stat: 'allPassivesPartial',
        value: true,
        partialStrength: 0.25
      }
    },
    emoji: '✨',
    portrait: 'assets/masters/eighth.png',
    sprite: 'masters/eighth.png',
    color: '#FFFFFF',
    quotes: [
      "...I remember now.",
      "The Sect... it was always meant to be eight.",
      "Boop... yes... I remember booping.",
      "Time erases all... but not the snoots.",
      "The eighth path was hidden, not destroyed."
    ],
    unlockCondition: {
      type: 'heavenlySeals',
      value: 100
    },
    unlockLore: "Long before Gerald found the Snoot Scrolls, there was another. The Eighth Master walked the path alone, their techniques so powerful that the heavens themselves conspired to erase their memory. Only those who accumulate 100 Heavenly Seals can pierce the veil of forgotten time."
  }
};

// Master sprites by realm - fallback data
const MASTER_SPRITES_BY_REALM_FALLBACK = {
  gerald: {
    mortal: 'masters/gerald_mortal.png',
    qiCondensation: 'masters/gerald_qi.png',
    foundationEstablishment: 'masters/gerald_foundation.png',
    coreFormation: 'masters/gerald_core.png',
    nascentSoul: 'masters/gerald_soul.png',
    spiritSevering: 'masters/gerald_severing.png',
    daoSeeking: 'masters/gerald_dao.png',
    immortalAscension: 'masters/gerald_immortal.png',
    trueImmortal: 'masters/gerald_true.png',
    heavenlySovereign: 'masters/gerald_sovereign.png'
  },
  rusty: {
    mortal: 'masters/rusty_mortal.png',
    qiCondensation: 'masters/rusty_qi.png',
    foundationEstablishment: 'masters/rusty_foundation.png',
    coreFormation: 'masters/rusty_core.png',
    nascentSoul: 'masters/rusty_soul.png',
    spiritSevering: 'masters/rusty_severing.png',
    daoSeeking: 'masters/rusty_dao.png',
    immortalAscension: 'masters/rusty_immortal.png',
    trueImmortal: 'masters/rusty_true.png',
    heavenlySovereign: 'masters/rusty_sovereign.png'
  },
  steve: {
    mortal: 'masters/steve_mortal.png',
    qiCondensation: 'masters/steve_qi.png',
    foundationEstablishment: 'masters/steve_foundation.png',
    coreFormation: 'masters/steve_core.png',
    nascentSoul: 'masters/steve_soul.png',
    spiritSevering: 'masters/steve_severing.png',
    daoSeeking: 'masters/steve_dao.png',
    immortalAscension: 'masters/steve_immortal.png',
    trueImmortal: 'masters/steve_true.png',
    heavenlySovereign: 'masters/steve_sovereign.png'
  },
  andrew: {
    mortal: 'masters/andrew_mortal.png',
    qiCondensation: 'masters/andrew_qi.png',
    foundationEstablishment: 'masters/andrew_foundation.png',
    coreFormation: 'masters/andrew_core.png',
    nascentSoul: 'masters/andrew_soul.png',
    spiritSevering: 'masters/andrew_severing.png',
    daoSeeking: 'masters/andrew_dao.png',
    immortalAscension: 'masters/andrew_immortal.png',
    trueImmortal: 'masters/andrew_true.png',
    heavenlySovereign: 'masters/andrew_sovereign.png'
  },
  nik: {
    mortal: 'masters/nik_mortal.png',
    qiCondensation: 'masters/nik_qi.png',
    foundationEstablishment: 'masters/nik_foundation.png',
    coreFormation: 'masters/nik_core.png',
    nascentSoul: 'masters/nik_soul.png',
    spiritSevering: 'masters/nik_severing.png',
    daoSeeking: 'masters/nik_dao.png',
    immortalAscension: 'masters/nik_immortal.png',
    trueImmortal: 'masters/nik_true.png',
    heavenlySovereign: 'masters/nik_sovereign.png'
  },
  yuelin: {
    mortal: 'masters/yuelin_mortal.png',
    qiCondensation: 'masters/yuelin_qi.png',
    foundationEstablishment: 'masters/yuelin_foundation.png',
    coreFormation: 'masters/yuelin_core.png',
    nascentSoul: 'masters/yuelin_soul.png',
    spiritSevering: 'masters/yuelin_severing.png',
    daoSeeking: 'masters/yuelin_dao.png',
    immortalAscension: 'masters/yuelin_immortal.png',
    trueImmortal: 'masters/yuelin_true.png',
    heavenlySovereign: 'masters/yuelin_sovereign.png'
  },
  scott: {
    mortal: 'masters/scott_mortal.png',
    qiCondensation: 'masters/scott_qi.png',
    foundationEstablishment: 'masters/scott_foundation.png',
    coreFormation: 'masters/scott_core.png',
    nascentSoul: 'masters/scott_soul.png',
    spiritSevering: 'masters/scott_severing.png',
    daoSeeking: 'masters/scott_dao.png',
    immortalAscension: 'masters/scott_immortal.png',
    trueImmortal: 'masters/scott_true.png',
    heavenlySovereign: 'masters/scott_sovereign.png'
  },
  mythic: {
    mortal: 'masters/mythic_mortal.png',
    qiCondensation: 'masters/mythic_qi.png',
    foundationEstablishment: 'masters/mythic_foundation.png',
    coreFormation: 'masters/mythic_core.png',
    nascentSoul: 'masters/mythic_soul.png',
    spiritSevering: 'masters/mythic_severing.png',
    daoSeeking: 'masters/mythic_dao.png',
    immortalAscension: 'masters/mythic_immortal.png',
    trueImmortal: 'masters/mythic_true.png',
    heavenlySovereign: 'masters/mythic_sovereign.png'
  }
};

// Active data - starts with fallback, can be updated from dataLoader
let MASTERS = { ...MASTERS_FALLBACK };
let MASTER_SPRITES_BY_REALM = { ...MASTER_SPRITES_BY_REALM_FALLBACK };

/**
 * Convert JSON effect data to executable effect function
 * This bridges the gap between JSON data and the function-based API
 */
function createEffectFunction(effectData) {
  if (!effectData) {
    return () => ({});
  }

  return (gameState) => {
    const result = {};

    switch (effectData.type) {
      case 'conditional_multiplier':
        // Only apply if condition is met
        if (gameState && gameState[effectData.condition]) {
          result[effectData.stat] = effectData.value;
        }
        break;

      case 'active_ability':
        result.activeAbility = true;
        result.duration = effectData.duration;
        result.cooldown = effectData.cooldown;
        result[effectData.stat] = effectData.value;
        break;

      case 'multiplier':
        if (effectData.stats) {
          // Multiple stats
          Object.assign(result, effectData.stats);
        } else {
          // Single stat
          result[effectData.stat] = effectData.value;
        }
        break;

      case 'additive':
        result[effectData.stat] = effectData.value;
        break;

      case 'special':
        result[effectData.stat] = effectData.value;
        if (effectData.partialStrength !== undefined) {
          result.partialStrength = effectData.partialStrength;
        }
        break;

      default:
        // Fallback: just return the value directly
        if (effectData.stat) {
          result[effectData.stat] = effectData.value;
        }
    }

    return result;
  };
}

/**
 * Process loaded masters data to add effect functions
 */
function processMastersData(mastersData) {
  const processed = {};

  for (const [key, master] of Object.entries(mastersData)) {
    processed[key] = {
      ...master,
      passive: {
        ...master.passive,
        // Create executable effect function from JSON data
        effect: createEffectFunction(master.passive?.effect)
      }
    };
  }

  return processed;
}

/**
 * Initialize masters data from dataLoader if available
 */
function initMastersData() {
  if (window.dataLoader) {
    // Try to get data immediately if already loaded
    const loadedData = window.dataLoader.get('masters');
    if (loadedData) {
      updateMastersFromData(loadedData);
    }

    // Also register for when data becomes ready
    if (typeof window.dataLoader.onReady === 'function') {
      window.dataLoader.onReady(() => {
        const data = window.dataLoader.get('masters');
        if (data) {
          updateMastersFromData(data);
        }
      });
    }
  }
}

/**
 * Update MASTERS and MASTER_SPRITES_BY_REALM from loaded data
 */
function updateMastersFromData(data) {
  if (data.masters) {
    MASTERS = processMastersData(data.masters);
    console.log('Masters data loaded from dataLoader');
  }

  if (data.masterSpritesByRealm) {
    MASTER_SPRITES_BY_REALM = data.masterSpritesByRealm;
    console.log('Master sprites by realm loaded from dataLoader');
  }

  // Notify any existing MasterSystem instances to refresh
  if (window.masterSystem) {
    window.masterSystem.refreshData();
  }

  // Emit event for other systems that might need to know
  if (window.eventBus) {
    window.eventBus.emit('mastersDataLoaded', { masters: MASTERS, sprites: MASTER_SPRITES_BY_REALM });
  }
}

/**
 * MasterSystem - Handles master selection and bonuses
 */
class MasterSystem {
  constructor() {
    this.selectedMaster = null;
    this.allMasters = MASTERS;
    this.spritesByRealm = MASTER_SPRITES_BY_REALM;

    // Initialize data loading
    initMastersData();
  }

  /**
   * Refresh data reference after dataLoader updates
   */
  refreshData() {
    this.allMasters = MASTERS;
    this.spritesByRealm = MASTER_SPRITES_BY_REALM;

    // Re-select current master to update reference
    if (this.selectedMaster && this.selectedMaster.id) {
      const updatedMaster = this.allMasters[this.selectedMaster.id];
      if (updatedMaster) {
        this.selectedMaster = updatedMaster;
      }
    }
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

    const passive = this.selectedMaster.passive;
    if (!passive) return {};

    // Handle both function-based and data-based effects
    if (typeof passive.effect === 'function') {
      return passive.effect(gameState);
    } else if (passive.effect) {
      // Create function on the fly if needed
      return createEffectFunction(passive.effect)(gameState);
    }

    return {};
  }

  getRandomQuote() {
    if (!this.selectedMaster) return '';
    const quotes = this.selectedMaster.quotes;
    if (!quotes || quotes.length === 0) return '';
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  getMasterById(id) {
    return this.allMasters[id] || null;
  }

  getAllMasters() {
    return Object.values(this.allMasters);
  }

  /**
   * Get unlockable masters (those not unlocked by 'starter')
   */
  getUnlockableMasters() {
    return Object.values(this.allMasters).filter(master =>
      master.unlockCondition !== 'starter'
    );
  }

  /**
   * Check if a master is unlocked based on game state
   */
  isMasterUnlocked(masterId, gameState) {
    const master = this.allMasters[masterId];
    if (!master) return false;

    const condition = master.unlockCondition;

    // Starter masters are always unlocked
    if (condition === 'starter') return true;

    // Check complex unlock conditions
    if (typeof condition === 'object') {
      switch (condition.type) {
        case 'heavenlySeals':
          return (gameState?.heavenlySeals || 0) >= condition.value;
        case 'achievement':
          return gameState?.achievements?.has?.(condition.value) || false;
        case 'ascensions':
          return (gameState?.totalAscensions || 0) >= condition.value;
        default:
          return false;
      }
    }

    return false;
  }

  /**
   * Get sprite for master based on cultivation realm
   */
  getMasterSprite(masterId, realmId) {
    const masterSprites = this.spritesByRealm[masterId];
    if (!masterSprites) {
      // Fallback to basic sprite
      const master = this.allMasters[masterId];
      return master?.sprite || master?.portrait || null;
    }

    return masterSprites[realmId] || masterSprites.mortal || null;
  }
}

// Export to window
window.MASTERS = MASTERS;
window.MASTERS_FALLBACK = MASTERS_FALLBACK;
window.MASTER_SPRITES_BY_REALM = MASTER_SPRITES_BY_REALM;
window.MasterSystem = MasterSystem;
window.initMastersData = initMastersData;
window.updateMastersFromData = updateMastersFromData;
