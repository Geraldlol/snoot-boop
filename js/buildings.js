/**
 * buildings.js - Sect Building System
 * "A great sect needs great halls."
 *
 * Buildings provide bonuses to other systems (cat capacity, PP generation, dungeon prep, etc.)
 * Each building has visual upgrades at certain levels and deep sub-systems.
 */

// ===================================
// TERRITORIES - Sect Expansion
// ===================================

const TERRITORIES = {
  humble_courtyard: {
    id: 'humble_courtyard',
    name: 'Humble Courtyard',
    description: 'A modest beginning for any aspiring sect.',
    catCapacity: 10,
    buildingSlots: 3,
    theme: 'starter',
    emoji: '🏠',
    unlockCost: 0,
    unlocked: true
  },
  mountain_sanctuary: {
    id: 'mountain_sanctuary',
    name: 'Mountain Sanctuary',
    description: 'Nestled in the peaks, closer to the heavens.',
    catCapacity: 30,
    buildingSlots: 6,
    theme: 'mountain',
    emoji: '⛰️',
    unlockCost: 1000000,
    unlocked: false,
    bonuses: {
      ppMultiplier: 1.1,
      meditationBonus: 1.25
    }
  },
  floating_palace: {
    id: 'floating_palace',
    name: 'Floating Palace',
    description: 'A palace among the clouds. Only the worthy may enter.',
    catCapacity: 75,
    buildingSlots: 9,
    theme: 'sky',
    emoji: '🏯',
    unlockCost: 50000000,
    unlocked: false,
    requires: { territory: 'mountain_sanctuary' },
    bonuses: {
      ppMultiplier: 1.25,
      bpMultiplier: 1.15,
      afkMultiplier: 1.2
    }
  },
  celestial_realm: {
    id: 'celestial_realm',
    name: 'Celestial Realm',
    description: 'Beyond mortal comprehension. Your sect has transcended.',
    catCapacity: 200,
    buildingSlots: 12,
    theme: 'divine',
    emoji: '✨',
    unlockCost: 1000000000,
    unlocked: false,
    requires: { territory: 'floating_palace', cultivationRealm: 'immortalAscension' },
    bonuses: {
      ppMultiplier: 1.5,
      bpMultiplier: 1.3,
      afkMultiplier: 1.5,
      allStats: 1.2
    }
  }
};

// ===================================
// BUILDING CATEGORIES
// ===================================

const BUILDING_CATEGORIES = {
  core: {
    id: 'core',
    name: 'Core Facilities',
    description: 'Essential buildings for sect operations',
    emoji: '🏛️',
    color: '#FFD700'
  },
  production: {
    id: 'production',
    name: 'Production',
    description: 'Generate resources and craft items',
    emoji: '⚒️',
    color: '#50C878'
  },
  social: {
    id: 'social',
    name: 'Social',
    description: 'Bond with waifus and compete with others',
    emoji: '💕',
    color: '#FFB6C1'
  },
  utility: {
    id: 'utility',
    name: 'Utility',
    description: 'Support systems and quality of life',
    emoji: '🔧',
    color: '#4169E1'
  },
  special: {
    id: 'special',
    name: 'Special',
    description: 'Unique buildings with powerful effects',
    emoji: '⭐',
    color: '#9370DB'
  }
};

// ===================================
// BUILDINGS DATA
// ===================================

const BUILDINGS = {
  // === CORE BUILDINGS ===
  cat_pagoda: {
    id: 'cat_pagoda',
    name: 'Cat Pagoda',
    category: 'core',
    description: 'Sacred tower that houses your feline disciples.',
    emoji: '🏯',
    maxLevel: 10,
    baseCost: 10000,
    costScale: 1.5,
    effect: (level) => ({
      catCapacity: level * 10
    }),
    effectDescription: (level) => `+${level * 10} cat capacity`,
    visualUpgrades: [1, 5, 10],
    flavorText: '"Many stories, many snoots."',
    subSystem: null
  },

  meditation_garden: {
    id: 'meditation_garden',
    name: 'Meditation Garden',
    category: 'core',
    description: 'A tranquil space where cats cultivate their inner Qi.',
    emoji: '🌸',
    maxLevel: 10,
    baseCost: 50000,
    costScale: 2.0,
    effect: (level) => ({
      idlePPBonus: 0.25 * level,
      idleThreshold: Math.max(60, 600 - (level * 54)), // Seconds until "idle" kicks in
      seasonalBonus: level >= 5
    }),
    effectDescription: (level) => `+${(0.25 * level * 100).toFixed(0)}% PP when idle`,
    visualUpgrades: [1, 5, 10],
    flavorText: '"In stillness, the snoot reveals its secrets."',
    subSystem: {
      type: 'garden_cultivation',
      features: ['herb_growing', 'spirit_stone_formation', 'seasonal_events'],
      minigame: 'zen_garden'
    },
    unlockCondition: { totalBoops: 1000 }
  },

  training_dojo: {
    id: 'training_dojo',
    name: 'Training Dojo',
    category: 'core',
    description: 'Where cats hone their combat techniques.',
    emoji: '🥋',
    maxLevel: 10,
    baseCost: 100000,
    costScale: 2.0,
    effect: (level) => ({
      catExpPerHour: 10 * level,
      techniqueSlots: 4 + Math.floor(level / 3),
      sparringBonus: level >= 5 ? 1.5 : 1.0
    }),
    effectDescription: (level) => `+${10 * level} cat XP/hour, ${4 + Math.floor(level / 3)} technique slots`,
    visualUpgrades: [1, 5, 10],
    flavorText: '"The snoot that trains a thousand times becomes iron."',
    subSystem: {
      type: 'training',
      features: ['technique_learning', 'sparring_arena', 'training_dummies'],
      unlocks: { 5: 'advanced_techniques', 10: 'secret_techniques' }
    },
    unlockCondition: { catsRecruited: 5 }
  },

  // === PRODUCTION BUILDINGS ===
  alchemy_lab: {
    id: 'alchemy_lab',
    name: 'Alchemy Laboratory',
    category: 'production',
    description: 'Brew potions, refine materials, and create cat treats.',
    emoji: '⚗️',
    maxLevel: 10,
    baseCost: 250000,
    costScale: 2.5,
    effect: (level) => ({
      recipeSlots: 2 + level,
      craftingSpeed: 1 + (level * 0.1),
      rareIngredientChance: level * 0.02
    }),
    effectDescription: (level) => `${2 + level} recipes, +${(level * 10)}% craft speed`,
    visualUpgrades: [1, 5, 10],
    flavorText: '"The cauldron bubbles with forbidden fish essence."',
    subSystem: {
      type: 'crafting',
      features: ['recipe_discovery', 'ingredient_storage', 'auto_craft'],
      minigame: 'potion_brewing',
      recipes: {
        basic: ['health_potion', 'qi_potion', 'happiness_treat'],
        advanced: ['realm_boost_elixir', 'goose_repellent', 'waifu_gift'],
        legendary: ['eternal_catnip', 'void_essence', 'transcendence_pill']
      }
    },
    unlockCondition: { building: { meditation_garden: 3 } }
  },

  library: {
    id: 'library',
    name: 'Sect Library',
    category: 'production',
    description: 'Repository of ancient techniques and forbidden knowledge.',
    emoji: '📚',
    maxLevel: 10,
    baseCost: 500000,
    costScale: 2.0,
    effect: (level) => ({
      researchSpeed: 1 + (level * 0.15),
      loreDropBonus: level * 0.05,
      techniqueUnlockCost: Math.max(0.5, 1 - (level * 0.05))
    }),
    effectDescription: (level) => `+${(level * 15)}% research, +${(level * 5)}% lore drops`,
    visualUpgrades: [1, 5, 10],
    flavorText: '"Knowledge is the ultimate boop."',
    subSystem: {
      type: 'research',
      features: ['technique_research', 'lore_collection', 'forbidden_section'],
      unlocks: { 5: 'ancient_texts', 10: 'forbidden_knowledge' }
    },
    unlockCondition: { cultivationRealm: 'qiCondensation' }
  },

  treasury_vault: {
    id: 'treasury_vault',
    name: 'Treasury Vault',
    category: 'production',
    description: 'Secure storage that generates passive wealth.',
    emoji: '💰',
    maxLevel: 10,
    baseCost: 1000000,
    costScale: 3.0,
    effect: (level) => ({
      passiveBpPerSecond: 100 * Math.pow(level, 1.5),
      currencyCap: 1 + (level * 0.1),
      theftProtection: level >= 5
    }),
    effectDescription: (level) => `+${Math.floor(100 * Math.pow(level, 1.5))} BP/sec`,
    visualUpgrades: [1, 5, 10],
    flavorText: '"Gold attracts cats. Cats attract more gold."',
    subSystem: {
      type: 'storage',
      features: ['currency_interest', 'item_vault', 'security_system']
    },
    unlockCondition: { totalBP: 500000 }
  },

  spirit_mine: {
    id: 'spirit_mine',
    name: 'Spirit Stone Mine',
    category: 'production',
    description: 'Extract spirit stones from beneath the sect.',
    emoji: '💎',
    maxLevel: 10,
    baseCost: 750000,
    costScale: 2.5,
    effect: (level) => ({
      spiritStonePerHour: 5 * level,
      jadeCatnipChance: 0.01 * level,
      autoMining: level >= 3
    }),
    effectDescription: (level) => `+${5 * level} spirit stones/hour`,
    visualUpgrades: [1, 5, 10],
    flavorText: '"Deep beneath, the earth purrs."',
    subSystem: {
      type: 'mining',
      features: ['auto_extraction', 'gem_discovery', 'earthquake_events']
    },
    unlockCondition: { building: { treasury_vault: 1 } }
  },

  // === SOCIAL BUILDINGS ===
  waifu_quarters: {
    id: 'waifu_quarters',
    name: 'Waifu Quarters',
    category: 'social',
    description: 'Comfortable living spaces for your immortal masters.',
    emoji: '🏠',
    maxLevel: 10,
    baseCost: 200000,
    costScale: 2.5,
    effect: (level) => ({
      dailyGifts: level,
      bondGainBonus: 1 + (level * 0.05),
      waifuCapacity: 6 + Math.floor(level / 2)
    }),
    effectDescription: (level) => `+${level} daily gifts, +${(level * 5)}% bond gain`,
    visualUpgrades: [1, 5, 10],
    flavorText: '"Happy waifus, happy sect."',
    subSystem: {
      type: 'housing',
      features: ['room_customization', 'gift_schedule', 'special_events'],
      unlocks: { 5: 'couple_activities', 10: 'harmony_system' }
    },
    unlockCondition: { waifuBondTotal: 50 }
  },

  hot_springs: {
    id: 'hot_springs',
    name: 'Hot Springs',
    category: 'social',
    description: 'Natural springs for relaxation and recovery.',
    emoji: '♨️',
    maxLevel: 5,
    baseCost: 750000,
    costScale: 2.0,
    effect: (level) => ({
      catHappinessRegen: level * 10,
      bondActivityBonus: 1.5 + (level * 0.1),
      postDungeonRecovery: level >= 3
    }),
    effectDescription: (level) => `+${level * 10} happiness regen, +${((0.5 + level * 0.1) * 100).toFixed(0)}% bond activity`,
    visualUpgrades: [1, 3, 5],
    flavorText: '"Steam rises, stress melts away."',
    subSystem: {
      type: 'activity',
      features: ['group_soaking', 'waifu_events', 'cat_spa'],
      specialEvents: ['full_moon_soak', 'festival_bath', 'couples_retreat']
    },
    unlockCondition: { building: { waifu_quarters: 5 } }
  },

  arena: {
    id: 'arena',
    name: 'Combat Arena',
    category: 'social',
    description: 'Pit your cats against others for glory and rewards.',
    emoji: '🏟️',
    maxLevel: 5,
    baseCost: 2000000,
    costScale: 2.0,
    effect: (level) => ({
      matchmakingSpeed: 1 + (level * 0.2),
      rankRewards: level,
      spectatorBonus: level >= 3
    }),
    effectDescription: (level) => `+${(level * 20)}% matchmaking, Rank ${level} rewards`,
    visualUpgrades: [1, 3, 5],
    flavorText: '"Two snoots enter. One snoot leaves victorious."',
    subSystem: {
      type: 'pvp',
      features: ['ranked_matches', 'tournaments', 'spectate_friends'],
      unlocks: { 3: 'weekly_tournament', 5: 'championship' }
    },
    unlockCondition: { pagodaFloor: 20 }
  },

  portal_gate: {
    id: 'portal_gate',
    name: 'Portal Gate',
    category: 'social',
    description: 'Connect with other sects across the Jianghu.',
    emoji: '🌀',
    maxLevel: 1,
    baseCost: 5000000,
    costScale: 1.0,
    effect: () => ({
      sectVisits: true,
      trading: true,
      giftSending: true
    }),
    effectDescription: () => 'Enables sect visits, trading, gifts',
    visualUpgrades: [1],
    flavorText: '"The Jianghu is vast, but now within reach."',
    subSystem: {
      type: 'social',
      features: ['sect_tourism', 'gift_exchange', 'collaborative_events']
    },
    unlockCondition: { territory: 'mountain_sanctuary' }
  },

  // === UTILITY BUILDINGS ===
  celestial_kitchen: {
    id: 'celestial_kitchen',
    name: 'Celestial Kitchen',
    category: 'utility',
    description: 'Auto-feed cats and prepare stat-boosting meals.',
    emoji: '🍳',
    maxLevel: 10,
    baseCost: 500000,
    costScale: 2.0,
    effect: (level) => ({
      autoFeed: true,
      happinessDecayReduction: 0.5 + (level * 0.05),
      mealBuffDuration: 1 + (level * 0.1)
    }),
    effectDescription: (level) => `Auto-feed, -${((0.5 + level * 0.05) * 100).toFixed(0)}% happiness decay`,
    visualUpgrades: [1, 5, 10],
    flavorText: '"The way to a cat\'s heart is through their stomach."',
    subSystem: {
      type: 'cooking',
      features: ['recipe_collection', 'cat_preferences', 'feast_events'],
      recipes: {
        meals: ['basic_kibble', 'gourmet_fish', 'celestial_feast'],
        buffs: ['speed_snack', 'power_protein', 'lucky_treat']
      }
    },
    unlockCondition: { catsRecruited: 10 }
  },

  goose_watchtower: {
    id: 'goose_watchtower',
    name: 'Goose Watchtower',
    category: 'utility',
    description: 'Early warning system for incoming geese.',
    emoji: '🗼',
    maxLevel: 10,
    baseCost: 250000,
    costScale: 2.0,
    effect: (level) => ({
      gooseSpawnBonus: 0.05 * level,
      gooseWarning: level >= 1,
      gooseRewardBonus: 1 + (level * 0.1),
      gooseTraps: level >= 5 ? Math.floor(level / 5) : 0
    }),
    effectDescription: (level) => `+${(level * 5)}% goose spawns, +${(level * 10)}% rewards`,
    visualUpgrades: [1, 5, 10],
    flavorText: '"HONK detected. Prepare defenses."',
    subSystem: {
      type: 'goose_management',
      features: ['early_warning', 'trap_placement', 'goose_research'],
      unlocks: { 5: 'goose_traps', 10: 'goose_summoning' }
    },
    unlockCondition: { gooseBoops: 10 }
  },

  observatory: {
    id: 'observatory',
    name: 'Celestial Observatory',
    category: 'utility',
    description: 'Track celestial events and predict favorable conditions.',
    emoji: '🔭',
    maxLevel: 5,
    baseCost: 1500000,
    costScale: 2.0,
    effect: (level) => ({
      eventPrediction: level,
      celestialBonusWindow: level * 60, // Minutes of bonus active
      nightBonus: 1 + (level * 0.1)
    }),
    effectDescription: (level) => `Predict ${level} events, +${(level * 10)}% night bonus`,
    visualUpgrades: [1, 3, 5],
    flavorText: '"The stars whisper of snoots yet to come."',
    subSystem: {
      type: 'astrology',
      features: ['event_calendar', 'celestial_alignment', 'horoscope'],
      predictions: ['rare_cat_sighting', 'golden_goose', 'waifu_event']
    },
    unlockCondition: { building: { library: 5 } }
  },

  // === SPECIAL BUILDINGS ===
  hall_of_legends: {
    id: 'hall_of_legends',
    name: 'Hall of Legends',
    category: 'special',
    description: 'Display your achievements for all to admire.',
    emoji: '🏆',
    maxLevel: 5,
    baseCost: 3000000,
    costScale: 3.0,
    effect: (level) => ({
      achievementDisplay: true,
      visitorBonus: 1 + (level * 0.05),
      legendaryShowcase: level >= 3,
      sectPrestige: level * 100
    }),
    effectDescription: (level) => `+${(level * 5)}% visitor bonus, +${level * 100} prestige`,
    visualUpgrades: [1, 3, 5],
    flavorText: '"Here rest the legends of the Celestial Snoot Sect."',
    subSystem: {
      type: 'museum',
      features: ['trophy_room', 'cat_gallery', 'lore_archive']
    },
    unlockCondition: { achievementsUnlocked: 20 }
  },

  goose_pen: {
    id: 'goose_pen',
    name: 'Goose Pen',
    category: 'special',
    description: 'Yes, really. Tamed geese. HONK.',
    emoji: '🦢',
    maxLevel: 5,
    baseCost: 10000000,
    costScale: 2.0,
    effect: (level) => ({
      tamedGeese: level,
      gooseIncomePerHour: 100 * level,
      chaosEvents: true
    }),
    effectDescription: (level) => `${level} tamed geese, +${100 * level} feathers/hour`,
    visualUpgrades: [1, 3, 5],
    flavorText: '"If you can\'t boop \'em, join \'em."',
    subSystem: {
      type: 'goose_husbandry',
      features: ['goose_breeding', 'goose_racing', 'honk_choir'],
      comedy: true
    },
    unlockCondition: { cobraChickenDefeated: true }
  },

  pagoda_entrance: {
    id: 'pagoda_entrance',
    name: 'Pagoda Entrance',
    category: 'special',
    description: 'Grand gateway to the Infinite Pagoda.',
    emoji: '⛩️',
    maxLevel: 5,
    baseCost: 5000000,
    costScale: 2.0,
    effect: (level) => ({
      dungeonPrepTime: Math.max(0, 30 - (level * 5)),
      relicStorage: 5 + (level * 5),
      checkpointSaves: level
    }),
    effectDescription: (level) => `-${level * 5}s prep time, ${5 + level * 5} relic slots`,
    visualUpgrades: [1, 3, 5],
    flavorText: '"Beyond this gate lies endless challenge."',
    subSystem: {
      type: 'dungeon_prep',
      features: ['formation_planning', 'relic_management', 'party_templates']
    },
    unlockCondition: { pagodaFloor: 10 }
  },

  eighth_master_shrine: {
    id: 'eighth_master_shrine',
    name: 'Shrine of the Eighth',
    category: 'special',
    description: 'A mysterious shrine to the forgotten master.',
    emoji: '🕯️',
    maxLevel: 1,
    baseCost: 100000000,
    costScale: 1.0,
    effect: () => ({
      eighthMasterHints: true,
      mysteryBonus: 1.08,
      secretLoreChance: 0.1
    }),
    effectDescription: () => '+8% mystery bonus, unlocks hidden lore',
    visualUpgrades: [1],
    flavorText: '"Who was the Eighth? The answer lies within..."',
    subSystem: {
      type: 'mystery',
      features: ['lore_fragments', 'hidden_quests', 'eighth_master_unlock']
    },
    hidden: true,
    unlockCondition: { loreFragments: 50, ascensions: 5 }
  }
};

// ===================================
// BUILDING SYSTEM CLASS
// ===================================

class BuildingSystem {
  constructor() {
    this.buildings = {}; // { buildingId: level }
    this.currentTerritory = 'humble_courtyard';
    this.unlockedTerritories = ['humble_courtyard'];
    this.buildingEffects = {};
    this.stats = {
      totalBuilt: 0,
      totalUpgrades: 0,
      highestBuildingLevel: 0,
      bpSpentOnBuildings: 0
    };
  }

  /**
   * Get the cost to build/upgrade a building
   */
  getBuildingCost(buildingId, currentLevel = null) {
    const building = BUILDINGS[buildingId];
    if (!building) return Infinity;

    const level = currentLevel !== null ? currentLevel : (this.buildings[buildingId] || 0);
    return Math.floor(building.baseCost * Math.pow(building.costScale, level));
  }

  /**
   * Check if a building can be built/upgraded
   */
  canBuild(buildingId, gameState) {
    const building = BUILDINGS[buildingId];
    if (!building) return { canBuild: false, reason: 'Unknown building' };

    const currentLevel = this.buildings[buildingId] || 0;

    // Check max level
    if (currentLevel >= building.maxLevel) {
      return { canBuild: false, reason: 'Max level reached' };
    }

    // Check building slots
    if (currentLevel === 0) {
      const usedSlots = this.getUsedSlots();
      const maxSlots = this.getAvailableSlots();
      if (usedSlots >= maxSlots) {
        return { canBuild: false, reason: 'No building slots available' };
      }
    }

    // Check cost
    const cost = this.getBuildingCost(buildingId, currentLevel);
    if (gameState.boopPoints < cost) {
      return { canBuild: false, reason: 'Not enough BP', cost };
    }

    // Check unlock conditions
    if (building.unlockCondition && currentLevel === 0) {
      const unlocked = this.checkUnlockCondition(building.unlockCondition, gameState);
      if (!unlocked.met) {
        return { canBuild: false, reason: unlocked.reason };
      }
    }

    // Check hidden buildings
    if (building.hidden && currentLevel === 0) {
      const unlocked = this.checkUnlockCondition(building.unlockCondition, gameState);
      if (!unlocked.met) {
        return { canBuild: false, reason: 'Requirements not met', hidden: true };
      }
    }

    return { canBuild: true, cost };
  }

  /**
   * Check if unlock conditions are met
   */
  checkUnlockCondition(condition, gameState) {
    if (!condition) return { met: true };

    // Check total boops
    if (condition.totalBoops && gameState.totalBoops < condition.totalBoops) {
      return { met: false, reason: `Requires ${this.formatNumber(condition.totalBoops)} total boops` };
    }

    // Check cats recruited
    if (condition.catsRecruited) {
      const catCount = window.catSystem ? window.catSystem.getCatCount() : 0;
      if (catCount < condition.catsRecruited) {
        return { met: false, reason: `Requires ${condition.catsRecruited} cats` };
      }
    }

    // Check total BP
    if (condition.totalBP && gameState.boopPoints < condition.totalBP) {
      return { met: false, reason: `Requires ${this.formatNumber(condition.totalBP)} BP` };
    }

    // Check goose boops
    if (condition.gooseBoops && gameState.gooseBoops < condition.gooseBoops) {
      return { met: false, reason: `Requires ${condition.gooseBoops} goose boops` };
    }

    // Check cobra chicken
    if (condition.cobraChickenDefeated && !gameState.cobraChickenDefeated) {
      return { met: false, reason: 'Requires defeating Cobra Chicken' };
    }

    // Check pagoda floor
    if (condition.pagodaFloor) {
      const highestFloor = window.pagodaSystem ? window.pagodaSystem.highestFloor : 0;
      if (highestFloor < condition.pagodaFloor) {
        return { met: false, reason: `Requires Pagoda floor ${condition.pagodaFloor}` };
      }
    }

    // Check building requirements
    if (condition.building) {
      for (const [buildingId, level] of Object.entries(condition.building)) {
        if ((this.buildings[buildingId] || 0) < level) {
          const buildingName = BUILDINGS[buildingId]?.name || buildingId;
          return { met: false, reason: `Requires ${buildingName} level ${level}` };
        }
      }
    }

    // Check waifu bond total
    if (condition.waifuBondTotal) {
      const bondTotal = window.waifuSystem ? window.waifuSystem.getTotalBondLevel() : 0;
      if (bondTotal < condition.waifuBondTotal) {
        return { met: false, reason: `Requires ${condition.waifuBondTotal} total waifu bond` };
      }
    }

    // Check achievements
    if (condition.achievementsUnlocked) {
      const achievementCount = window.achievementSystem ? window.achievementSystem.getUnlockedCount() : 0;
      if (achievementCount < condition.achievementsUnlocked) {
        return { met: false, reason: `Requires ${condition.achievementsUnlocked} achievements` };
      }
    }

    // Check cultivation realm
    if (condition.cultivationRealm) {
      const currentRealm = window.cultivationSystem ? window.cultivationSystem.currentRealm : 'mortal';
      const realmOrder = { mortal: 1, qiCondensation: 2, foundationEstablishment: 3, coreFormation: 4, nascentSoul: 5, spiritSevering: 6, daoSeeking: 7, immortalAscension: 8, trueImmortal: 9, heavenlySovereign: 10 };
      if ((realmOrder[currentRealm] || 1) < (realmOrder[condition.cultivationRealm] || 1)) {
        return { met: false, reason: `Requires ${condition.cultivationRealm} realm` };
      }
    }

    // Check territory
    if (condition.territory) {
      if (!this.unlockedTerritories.includes(condition.territory)) {
        const territoryName = TERRITORIES[condition.territory]?.name || condition.territory;
        return { met: false, reason: `Requires ${territoryName}` };
      }
    }

    // Check lore fragments
    if (condition.loreFragments) {
      const loreCount = window.loreSystem ? window.loreSystem.getFragmentCount() : 0;
      if (loreCount < condition.loreFragments) {
        return { met: false, reason: `Requires ${condition.loreFragments} lore fragments` };
      }
    }

    // Check ascensions
    if (condition.ascensions) {
      const ascensionCount = window.prestigeSystem ? window.prestigeSystem.totalRebirths : 0;
      if (ascensionCount < condition.ascensions) {
        return { met: false, reason: `Requires ${condition.ascensions} ascensions` };
      }
    }

    return { met: true };
  }

  /**
   * Build or upgrade a building
   */
  build(buildingId, gameState) {
    const check = this.canBuild(buildingId, gameState);
    if (!check.canBuild) {
      return { success: false, reason: check.reason };
    }

    const building = BUILDINGS[buildingId];
    const currentLevel = this.buildings[buildingId] || 0;
    const cost = check.cost;

    // Deduct cost
    gameState.boopPoints -= cost;

    // Increase level
    this.buildings[buildingId] = currentLevel + 1;

    // Update stats
    if (currentLevel === 0) {
      this.stats.totalBuilt++;
    } else {
      this.stats.totalUpgrades++;
    }
    this.stats.highestBuildingLevel = Math.max(this.stats.highestBuildingLevel, currentLevel + 1);
    this.stats.bpSpentOnBuildings += cost;

    // Recalculate effects
    this.recalculateEffects();

    // Check for visual upgrade
    const hasVisualUpgrade = building.visualUpgrades && building.visualUpgrades.includes(currentLevel + 1);

    return {
      success: true,
      building: buildingId,
      newLevel: currentLevel + 1,
      cost,
      visualUpgrade: hasVisualUpgrade,
      effects: building.effect(currentLevel + 1)
    };
  }

  /**
   * Recalculate all building effects
   */
  recalculateEffects() {
    const effects = {
      // Cat capacity
      catCapacity: 0,

      // Multipliers
      ppMultiplier: 1,
      bpMultiplier: 1,
      afkMultiplier: 1,

      // Bonuses
      idlePPBonus: 0,
      bondGainBonus: 1,
      gooseSpawnBonus: 0,
      gooseRewardBonus: 1,
      loreDropBonus: 0,
      craftingSpeed: 1,
      researchSpeed: 1,

      // Passive generation
      passiveBpPerSecond: 0,
      spiritStonePerHour: 0,
      gooseIncomePerHour: 0,

      // Reduction
      happinessDecayReduction: 0,
      dungeonPrepTime: 30,

      // Capacity
      techniqueSlots: 4,
      recipeSlots: 2,
      relicStorage: 5,
      waifuCapacity: 6,

      // Flags
      autoFeed: false,
      theftProtection: false,
      gooseWarning: false,
      sectVisits: false,
      trading: false
    };

    // Apply building effects
    for (const [buildingId, level] of Object.entries(this.buildings)) {
      if (level > 0) {
        const building = BUILDINGS[buildingId];
        if (building && building.effect) {
          const buildingEffects = building.effect(level);

          // Merge effects
          for (const [key, value] of Object.entries(buildingEffects)) {
            if (typeof value === 'boolean') {
              effects[key] = effects[key] || value;
            } else if (key.includes('Multiplier') || key.includes('Bonus') && !key.includes('passiv')) {
              effects[key] = (effects[key] || 1) * value;
            } else if (typeof value === 'number') {
              effects[key] = (effects[key] || 0) + value;
            }
          }
        }
      }
    }

    // Apply territory bonuses
    const territory = TERRITORIES[this.currentTerritory];
    if (territory && territory.bonuses) {
      for (const [key, value] of Object.entries(territory.bonuses)) {
        if (key.includes('Multiplier')) {
          effects[key] = (effects[key] || 1) * value;
        } else if (typeof value === 'number') {
          effects[key] = (effects[key] || 0) + value;
        }
      }
    }

    this.buildingEffects = effects;
    return effects;
  }

  /**
   * Get combined building effects
   */
  getCombinedEffects() {
    return this.buildingEffects;
  }

  /**
   * Get total cat capacity from buildings + base
   */
  getTotalCatCapacity() {
    const territory = TERRITORIES[this.currentTerritory];
    const baseCapacity = territory ? territory.catCapacity : 10;
    return baseCapacity + (this.buildingEffects.catCapacity || 0);
  }

  /**
   * Get available building slots
   */
  getAvailableSlots() {
    const territory = TERRITORIES[this.currentTerritory];
    return territory ? territory.buildingSlots : 3;
  }

  /**
   * Get used building slots
   */
  getUsedSlots() {
    return Object.values(this.buildings).filter(level => level > 0).length;
  }

  /**
   * Check if territory can be unlocked
   */
  canUnlockTerritory(territoryId, gameState) {
    const territory = TERRITORIES[territoryId];
    if (!territory) return { canUnlock: false, reason: 'Unknown territory' };

    if (this.unlockedTerritories.includes(territoryId)) {
      return { canUnlock: false, reason: 'Already unlocked' };
    }

    // Check cost
    if (gameState.boopPoints < territory.unlockCost) {
      return { canUnlock: false, reason: 'Not enough BP', cost: territory.unlockCost };
    }

    // Check requirements
    if (territory.requires) {
      if (territory.requires.territory && !this.unlockedTerritories.includes(territory.requires.territory)) {
        const reqTerritoryName = TERRITORIES[territory.requires.territory]?.name || territory.requires.territory;
        return { canUnlock: false, reason: `Requires ${reqTerritoryName}` };
      }

      if (territory.requires.cultivationRealm) {
        const currentRealm = window.cultivationSystem ? window.cultivationSystem.currentRealm : 'mortal';
        const realmOrder = { mortal: 1, qiCondensation: 2, foundationEstablishment: 3, coreFormation: 4, nascentSoul: 5, spiritSevering: 6, daoSeeking: 7, immortalAscension: 8, trueImmortal: 9, heavenlySovereign: 10 };
        if ((realmOrder[currentRealm] || 1) < (realmOrder[territory.requires.cultivationRealm] || 1)) {
          return { canUnlock: false, reason: `Requires ${territory.requires.cultivationRealm} realm` };
        }
      }
    }

    return { canUnlock: true, cost: territory.unlockCost };
  }

  /**
   * Unlock a new territory
   */
  unlockTerritory(territoryId, gameState) {
    const check = this.canUnlockTerritory(territoryId, gameState);
    if (!check.canUnlock) {
      return { success: false, reason: check.reason };
    }

    // Deduct cost
    gameState.boopPoints -= check.cost;

    // Unlock territory
    this.unlockedTerritories.push(territoryId);

    return {
      success: true,
      territory: territoryId,
      cost: check.cost
    };
  }

  /**
   * Move to a different territory
   */
  moveToTerritory(territoryId) {
    if (!this.unlockedTerritories.includes(territoryId)) {
      return { success: false, reason: 'Territory not unlocked' };
    }

    this.currentTerritory = territoryId;
    this.recalculateEffects();

    return {
      success: true,
      territory: territoryId,
      bonuses: TERRITORIES[territoryId].bonuses
    };
  }

  /**
   * Get all buildings by category
   */
  getBuildingsByCategory(categoryId) {
    return Object.values(BUILDINGS).filter(b => b.category === categoryId);
  }

  /**
   * Get all unlockable buildings
   */
  getUnlockableBuildings(gameState) {
    return Object.values(BUILDINGS).filter(building => {
      if (building.hidden) return false;
      const currentLevel = this.buildings[building.id] || 0;
      if (currentLevel > 0) return false;

      const check = this.canBuild(building.id, gameState);
      return check.canBuild || !check.hidden;
    });
  }

  /**
   * Get building info
   */
  getBuildingInfo(buildingId) {
    const building = BUILDINGS[buildingId];
    if (!building) return null;

    const currentLevel = this.buildings[buildingId] || 0;
    return {
      ...building,
      currentLevel,
      nextCost: currentLevel < building.maxLevel ? this.getBuildingCost(buildingId, currentLevel) : null,
      currentEffects: currentLevel > 0 ? building.effect(currentLevel) : null,
      nextEffects: currentLevel < building.maxLevel ? building.effect(currentLevel + 1) : null,
      effectDescription: building.effectDescription(currentLevel || 1)
    };
  }

  /**
   * Format number for display
   */
  formatNumber(n) {
    if (n < 1000) return n.toString();
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const tier = Math.min(Math.floor(Math.log10(n) / 3), suffixes.length - 1);
    return (n / Math.pow(10, tier * 3)).toFixed(1) + suffixes[tier];
  }

  /**
   * Serialize for save
   */
  serialize() {
    return {
      buildings: this.buildings,
      currentTerritory: this.currentTerritory,
      unlockedTerritories: this.unlockedTerritories,
      stats: this.stats
    };
  }

  /**
   * Deserialize from save
   */
  deserialize(data) {
    if (!data) return;

    this.buildings = data.buildings || {};
    this.currentTerritory = data.currentTerritory || 'humble_courtyard';
    this.unlockedTerritories = data.unlockedTerritories || ['humble_courtyard'];
    this.stats = data.stats || {
      totalBuilt: 0,
      totalUpgrades: 0,
      highestBuildingLevel: 0,
      bpSpentOnBuildings: 0
    };

    // Recalculate effects
    this.recalculateEffects();
  }
}

// ===================================
// EXPORTS
// ===================================

window.TERRITORIES = TERRITORIES;
window.BUILDING_CATEGORIES = BUILDING_CATEGORIES;
window.BUILDINGS = BUILDINGS;
window.BuildingSystem = BuildingSystem;

console.log('buildings.js loaded: Sect Building System ready');
