/**
 * prestige.js - Rebirth/Prestige System
 * "The cycle of cultivation never ends... it only grows stronger."
 */

// Rebirth Tiers
const REBIRTH_TIERS = {
  1: {
    tier: 1,
    name: 'Qi Condensation',
    title: 'Awakened',
    requirement: 100000, // Total BP earned
    multiplier: 1.1, // 10% permanent bonus
    color: '#98D8C8',
    unlocks: ['second_expedition_slot']
  },
  2: {
    tier: 2,
    name: 'Foundation Establishment',
    title: 'Foundation Builder',
    requirement: 500000,
    multiplier: 1.25,
    color: '#7EC8E3',
    unlocks: ['auto_boop_boost']
  },
  3: {
    tier: 3,
    name: 'Core Formation',
    title: 'Core Disciple',
    requirement: 2000000,
    multiplier: 1.5,
    color: '#A8E6CF',
    unlocks: ['starting_cats', 'master_switch']
  },
  4: {
    tier: 4,
    name: 'Nascent Soul',
    title: 'Soul Cultivator',
    requirement: 10000000,
    multiplier: 2.0,
    color: '#FFD93D',
    unlocks: ['starting_pp', 'jade_dot_boost']
  },
  5: {
    tier: 5,
    name: 'Spirit Severing',
    title: 'Spirit Severer',
    requirement: 50000000,
    multiplier: 3.0,
    color: '#FF8B94',
    unlocks: ['starting_upgrades']
  },
  6: {
    tier: 6,
    name: 'Dao Seeking',
    title: 'Dao Seeker',
    requirement: 200000000,
    multiplier: 5.0,
    color: '#C9B1FF',
    unlocks: ['waifu_bond_retain', 'goose_ally_boost']
  },
  7: {
    tier: 7,
    name: 'Immortal Ascension',
    title: 'Immortal',
    requirement: 1000000000,
    multiplier: 10.0,
    color: '#FFD700',
    unlocks: ['immortal_bonuses', 'all_waifus']
  }
};

// Rebirth Perks
const REBIRTH_PERKS = {
  second_expedition_slot: {
    id: 'second_expedition_slot',
    name: 'Dual Expeditions',
    description: 'Unlocks a second expedition slot.',
    effect: { maxExpeditions: 3 }
  },
  auto_boop_boost: {
    id: 'auto_boop_boost',
    name: 'Cultivated Reflexes',
    description: 'Auto-boop speed increased by 50%.',
    effect: { autoBoopMultiplier: 1.5 }
  },
  starting_cats: {
    id: 'starting_cats',
    name: 'Loyal Disciples',
    description: 'Start each rebirth with 3 random cats.',
    effect: { startingCats: 3 }
  },
  starting_pp: {
    id: 'starting_pp',
    name: 'Accumulated Wisdom',
    description: 'Start each rebirth with 1000 PP.',
    effect: { startingPP: 1000 }
  },
  jade_dot_boost: {
    id: 'jade_dot_boost',
    name: 'Enhanced Focus',
    description: 'Jade Dot game rewards doubled.',
    effect: { jadeDotMultiplier: 2 }
  },
  starting_upgrades: {
    id: 'starting_upgrades',
    name: 'Innate Knowledge',
    description: 'Start with first tier of basic upgrades.',
    effect: { startingUpgrades: true }
  },
  master_switch: {
    id: 'master_switch',
    name: 'Path Flexibility',
    description: 'Can switch masters without rebirth (once per day).',
    effect: { masterSwitch: true }
  },
  waifu_bond_retain: {
    id: 'waifu_bond_retain',
    name: 'Eternal Bonds',
    description: 'Retain 25% of waifu bond levels on rebirth.',
    effect: { bondRetention: 0.25 }
  },
  immortal_bonuses: {
    id: 'immortal_bonuses',
    name: 'Immortal Cultivation',
    description: 'All BP and PP gains increased by 100%.',
    effect: { immortalMultiplier: 2.0 }
  },
  all_waifus: {
    id: 'all_waifus',
    name: 'Harem Transcendence',
    description: 'All waifus unlocked from start.',
    effect: { allWaifusUnlocked: true }
  },
  goose_ally_boost: {
    id: 'goose_ally_boost',
    name: 'Goose Empowerment',
    description: 'Goose ally effects are 50% stronger.',
    effect: { gooseAllyBoost: 1.5 }
  }
};

/**
 * PrestigeSystem - Manages rebirth/prestige mechanics
 */
class PrestigeSystem {
  constructor() {
    this.currentTier = 0;
    this.totalRebirths = 0;
    this.lifetimeBP = 0;
    this.lifetimePP = 0;
    this.lifetimeCats = 0;
    this.unlockedPerks = new Set();
    this.lastMasterSwitch = 0;
  }

  /**
   * Get current tier info
   */
  getCurrentTier() {
    return REBIRTH_TIERS[this.currentTier] || null;
  }

  /**
   * Get next tier info
   */
  getNextTier() {
    return REBIRTH_TIERS[this.currentTier + 1] || null;
  }

  /**
   * Calculate total multiplier from all perks
   */
  getTotalMultiplier() {
    let multiplier = 1;

    for (let tier = 1; tier <= this.currentTier; tier++) {
      const tierInfo = REBIRTH_TIERS[tier];
      if (tierInfo) {
        multiplier *= tierInfo.multiplier;
      }
    }

    return multiplier;
  }

  /**
   * Check if rebirth is available
   */
  canRebirth(gameState) {
    const nextTier = this.getNextTier();
    if (!nextTier) return { can: false, reason: 'Maximum tier reached' };

    if (this.lifetimeBP < nextTier.requirement) {
      return {
        can: false,
        reason: `Need ${this.formatNumber(nextTier.requirement)} lifetime BP (have ${this.formatNumber(this.lifetimeBP)})`
      };
    }

    return { can: true };
  }

  /**
   * Perform rebirth
   */
  rebirth(gameState, masterSystem, catSystem, waifuSystem, upgradeSystem) {
    const check = this.canRebirth(gameState);
    if (!check.can) return { success: false, reason: check.reason };

    const previousTier = this.currentTier;
    this.currentTier++;
    this.totalRebirths++;

    const newTier = REBIRTH_TIERS[this.currentTier];

    // Unlock perks from new tier
    for (const perkId of newTier.unlocks) {
      this.unlockedPerks.add(perkId);
    }

    // Calculate what to keep
    const bondRetention = this.hasPerk('waifu_bond_retain') ? 0.25 : 0;

    // Store waifu bonds if retention is active
    const waifuBonds = {};
    if (bondRetention > 0) {
      const waifuStates = waifuSystem.serialize();
      for (const [id, state] of Object.entries(waifuStates.waifuStates || {})) {
        waifuBonds[id] = Math.floor((state.bondLevel || 0) * bondRetention);
      }
    }

    // Reset game state
    this.resetGameState(gameState, masterSystem, catSystem, waifuSystem, upgradeSystem);

    // Apply retained waifu bonds
    if (bondRetention > 0) {
      for (const [id, bond] of Object.entries(waifuBonds)) {
        waifuSystem.waifuStates[id] = waifuSystem.waifuStates[id] || { bondLevel: 0, unlocked: false };
        waifuSystem.waifuStates[id].bondLevel = bond;
      }
    }

    // Apply starting bonuses from perks
    this.applyStartingBonuses(gameState, catSystem, waifuSystem, upgradeSystem);

    // Play sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('achievement');
    }

    return {
      success: true,
      previousTier,
      newTier: this.currentTier,
      tierInfo: newTier,
      totalMultiplier: this.getTotalMultiplier()
    };
  }

  /**
   * Reset game state for rebirth
   */
  resetGameState(gameState, masterSystem, catSystem, waifuSystem, upgradeSystem) {
    // Reset resources
    gameState.boopPoints = 0;
    gameState.purrPower = 0;
    gameState.jadeCatnip = 0;
    gameState.destinyThreads = 0;
    gameState.gooseFeathers = 0;
    gameState.goldenFeathers = 0;

    // Reset stats (keep lifetime stats)
    gameState.totalBoops = 0;
    gameState.maxCombo = 0;
    gameState.criticalBoops = 0;

    // Reset cats (but not lifetime count)
    catSystem.reset();

    // Reset waifus (unless perks say otherwise)
    if (!this.hasPerk('all_waifus')) {
      waifuSystem.reset();
    } else {
      waifuSystem.unlockAll();
    }

    // Reset upgrades (unless perks say otherwise)
    upgradeSystem.reset();

    // Reset goose stats (keep ally if unlocked)
    if (window.gooseSystem) {
      window.gooseSystem.gooseBoops = 0;
      window.gooseSystem.goldenGooseBoops = 0;
    }
  }

  /**
   * Apply starting bonuses from perks
   */
  applyStartingBonuses(gameState, catSystem, waifuSystem, upgradeSystem) {
    // Starting PP
    if (this.hasPerk('starting_pp')) {
      gameState.purrPower = REBIRTH_PERKS.starting_pp.effect.startingPP;
    }

    // Starting cats
    if (this.hasPerk('starting_cats')) {
      const numCats = REBIRTH_PERKS.starting_cats.effect.startingCats;
      for (let i = 0; i < numCats; i++) {
        catSystem.recruitCat(0); // Free recruitment
      }
    }

    // Starting upgrades
    if (this.hasPerk('starting_upgrades')) {
      // Give level 1 of basic upgrades
      upgradeSystem.setLevel('snoot_training', 1);
      upgradeSystem.setLevel('inner_peace', 1);
    }

    // Update expedition slots
    if (this.hasPerk('second_expedition_slot') && window.expeditionSystem) {
      window.expeditionSystem.maxConcurrentExpeditions = 3;
    }
  }

  /**
   * Check if a perk is unlocked
   */
  hasPerk(perkId) {
    return this.unlockedPerks.has(perkId);
  }

  /**
   * Get all active perk effects
   */
  getPerkEffects() {
    const effects = {};

    for (const perkId of this.unlockedPerks) {
      const perk = REBIRTH_PERKS[perkId];
      if (perk?.effect) {
        Object.assign(effects, perk.effect);
      }
    }

    return effects;
  }

  /**
   * Can switch master (Dao Seeking perk)
   */
  canSwitchMaster() {
    if (!this.hasPerk('master_switch')) return false;

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    return (now - this.lastMasterSwitch) >= oneDayMs;
  }

  /**
   * Use master switch
   */
  useMasterSwitch() {
    if (!this.canSwitchMaster()) return false;
    this.lastMasterSwitch = Date.now();
    return true;
  }

  /**
   * Track BP earned (for lifetime total)
   */
  trackBP(amount) {
    this.lifetimeBP += amount;
  }

  /**
   * Track PP earned
   */
  trackPP(amount) {
    this.lifetimePP += amount;
  }

  /**
   * Track cats recruited
   */
  trackCat() {
    this.lifetimeCats++;
  }

  /**
   * Get rebirth progress percentage
   */
  getProgress() {
    const nextTier = this.getNextTier();
    if (!nextTier) return 100;

    return Math.min(100, (this.lifetimeBP / nextTier.requirement) * 100);
  }

  /**
   * Format large numbers
   */
  formatNumber(n) {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qi'];
    if (n < 1000) return Math.floor(n).toString();

    const tier = Math.min(Math.floor(Math.log10(n) / 3), suffixes.length - 1);
    return (n / Math.pow(10, tier * 3)).toFixed(1) + suffixes[tier];
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      currentTier: this.currentTier,
      totalRebirths: this.totalRebirths,
      lifetimeBP: this.lifetimeBP,
      lifetimePP: this.lifetimePP,
      lifetimeCats: this.lifetimeCats,
      unlockedPerks: Array.from(this.unlockedPerks),
      lastMasterSwitch: this.lastMasterSwitch
    };
  }

  /**
   * Load from save
   */
  deserialize(data) {
    if (!data) return;

    this.currentTier = data.currentTier || 0;
    this.totalRebirths = data.totalRebirths || 0;
    this.lifetimeBP = data.lifetimeBP || 0;
    this.lifetimePP = data.lifetimePP || 0;
    this.lifetimeCats = data.lifetimeCats || 0;
    this.unlockedPerks = new Set(data.unlockedPerks || []);
    this.lastMasterSwitch = data.lastMasterSwitch || 0;
  }
}

// ===================================
// LAYER 2: REINCARNATION SYSTEM
// ===================================

const REINCARNATION_SYSTEM = {
  name: 'Reincarnation',
  threshold: {
    rebirths: 7, // Must reach max rebirth tier (Immortal Ascension)
    lifetimeBP: 10000000000 // 10 billion lifetime BP
  },
  currency: 'karmaPoints',

  resets: [
    'rebirthTier',      // Rebirth tier resets
    'lifetimeBP',       // Lifetime BP resets (keep 10%)
    'currencies',       // All currencies reset
    'cats',             // Cats reset
    'buildings',        // Buildings reset
    'equipment'         // Equipment resets
  ],

  keeps: [
    'karmaPoints',
    'reincarnationCount',
    'achievements',
    'cosmetics',
    'gooseAlly',
    'maxWaifuBonds',    // If reached max bond, remember it
    'loreFragments'
  ],

  multiplierPerReincarnation: 2 // 2x, 4x, 8x...
};

// Past Life Memories - Random buff at reincarnation start
const PAST_LIFE_MEMORIES = {
  memory_warrior: {
    id: 'memory_warrior',
    name: 'Warrior\'s Echo',
    description: 'Combat experience from a past life',
    trigger: { lifetimeBoops: 1000000 },
    effect: { boopPower: 2.0, critChance: 0.1 },
    duration: 'permanent_this_run'
  },
  memory_merchant: {
    id: 'memory_merchant',
    name: 'Merchant\'s Fortune',
    description: 'Wealth follows you from another life',
    trigger: { lifetimeBP: 100000000 },
    effect: { startingBP: 100000, currencyGain: 1.5 },
    duration: 'permanent_this_run'
  },
  memory_lover: {
    id: 'memory_lover',
    name: 'Bonds of Eternity',
    description: 'Your waifus remember you...',
    trigger: { maxBondCount: 3 },
    effect: { waifuStartBond: 25, bondGain: 2.0 },
    duration: 'permanent_this_run'
  },
  memory_hunter: {
    id: 'memory_hunter',
    name: 'Hunter\'s Instinct',
    description: 'Cats are drawn to your presence',
    trigger: { lifetimeCats: 100 },
    effect: { catDropRate: 2.0, startingCats: 5 },
    duration: 'permanent_this_run'
  },
  memory_cultivator: {
    id: 'memory_cultivator',
    name: 'Cultivator\'s Wisdom',
    description: 'The path to immortality is familiar',
    trigger: { maxRealmReached: 'spiritSevering' },
    effect: { cultivationXP: 2.0, startingRealm: 'qiCondensation' },
    duration: 'permanent_this_run'
  },
  memory_goose: {
    id: 'memory_goose',
    name: 'Honk of Destiny',
    description: 'Even the geese respect you',
    trigger: { gooseBoops: 500 },
    effect: { gooseRewards: 3.0, gooseSpawnRate: 2.0 },
    duration: 'permanent_this_run'
  }
};

// Karma Shop - Permanent upgrades bought with Karma Points
const KARMA_SHOP = {
  categories: {
    starting: {
      name: 'Starting Bonuses',
      items: [
        { id: 'karma_start_cats', name: 'Feline Legacy', cost: 10, effect: { startingCats: 5 }, repeatable: true, maxPurchases: 10 },
        { id: 'karma_start_bp', name: 'Inherited Wealth', cost: 5, effect: { startingBP: 100000 }, repeatable: true, maxPurchases: 20 },
        { id: 'karma_start_pp', name: 'Ancestral Wisdom', cost: 8, effect: { startingPP: 5000 }, repeatable: true, maxPurchases: 10 },
        { id: 'karma_start_realm', name: 'Reborn Cultivator', cost: 50, effect: { startingRealm: 'qiCondensation' }, repeatable: false }
      ]
    },
    permanent: {
      name: 'Permanent Bonuses',
      items: [
        { id: 'karma_production', name: 'Eternal Production', cost: 25, effect: { permanentProduction: 1.25 }, repeatable: true, maxPurchases: 10 },
        { id: 'karma_crit', name: 'Karmic Precision', cost: 30, effect: { permanentCrit: 0.05 }, repeatable: true, maxPurchases: 5 },
        { id: 'karma_afk', name: 'Dream Cultivation', cost: 40, effect: { permanentAFK: 1.5 }, repeatable: false },
        { id: 'karma_combo', name: 'Eternal Combo', cost: 35, effect: { comboDecayReduction: 0.25 }, repeatable: true, maxPurchases: 3 }
      ]
    },
    unlocks: {
      name: 'Special Unlocks',
      items: [
        { id: 'karma_unlock_grandmother', name: 'Grandmother\'s Blessing', cost: 100, effect: { unlock: 'grandmother_waifu' }, repeatable: false },
        { id: 'karma_unlock_void', name: 'Void Awakening', cost: 150, effect: { unlock: 'void_element' }, repeatable: false },
        { id: 'karma_unlock_eighth', name: 'The Forgotten One', cost: 250, effect: { unlock: 'eighth_master' }, repeatable: false },
        { id: 'karma_unlock_transcendence', name: 'Path to Transcendence', cost: 500, effect: { unlock: 'transcendence_preview' }, repeatable: false }
      ]
    }
  }
};

// ===================================
// LAYER 3: TRANSCENDENCE SYSTEM
// ===================================

const TRANSCENDENCE_SYSTEM = {
  name: 'Transcendence',
  threshold: {
    reincarnations: 5,
    karmaPoints: 1000,
    realmReached: 'trueImmortal'
  },
  currency: 'transcendencePoints',

  description: 'The ultimate prestige. Near-total reset, but unlocks the true endgame.',

  resets: [
    'almost_everything' // Near-total reset
  ],

  keeps: [
    'transcendencePoints',
    'transcendenceCount',
    'metaAchievements',
    'ultimateCosmetics',
    'celestialProgress'
  ],

  unlocks: ['celestial_realm', 'true_endgame', 'story_conclusion']
};

// Celestial Realm bonuses per Transcendence Point
const CELESTIAL_BONUSES = {
  1: { allStats: 1.5, description: '+50% all stats permanently' },
  3: { startWithMemories: 2, description: 'Start with 2 Past Life Memories' },
  5: { celestialCats: true, description: 'Unlock Celestial Cat tier' },
  10: { instantRebirth: true, description: 'Instant rebirth to Tier 3' },
  25: { karmaGeneration: true, description: 'Passively generate Karma Points' },
  50: { ultimateForm: true, description: 'Unlock Ultimate Master Forms' }
};

/**
 * Enhanced PrestigeSystem with Reincarnation and Transcendence
 */
// Add methods to existing PrestigeSystem
PrestigeSystem.prototype.initializeAdvancedPrestige = function() {
  // Reincarnation tracking
  this.reincarnationCount = this.reincarnationCount || 0;
  this.karmaPoints = this.karmaPoints || 0;
  this.pastLifeMemory = this.pastLifeMemory || null;
  this.karmaShopPurchases = this.karmaShopPurchases || {};
  this.maxWaifuBonds = this.maxWaifuBonds || {};
  this.maxRealmReached = this.maxRealmReached || 'mortal';

  // Transcendence tracking
  this.transcendenceCount = this.transcendenceCount || 0;
  this.transcendencePoints = this.transcendencePoints || 0;
  this.celestialUnlocks = this.celestialUnlocks || [];
};

/**
 * Check if reincarnation is available
 */
PrestigeSystem.prototype.canReincarnate = function() {
  const threshold = REINCARNATION_SYSTEM.threshold;

  if (this.currentTier < 7) {
    return { can: false, reason: 'Must reach Immortal Ascension rebirth tier first' };
  }

  if (this.lifetimeBP < threshold.lifetimeBP) {
    return {
      can: false,
      reason: `Need ${this.formatNumber(threshold.lifetimeBP)} lifetime BP (have ${this.formatNumber(this.lifetimeBP)})`
    };
  }

  return { can: true };
};

/**
 * Calculate karma points earned from reincarnation
 */
PrestigeSystem.prototype.calculateKarmaEarned = function() {
  let karma = Math.floor(this.lifetimeBP / 1000000000); // 1 per billion BP
  karma += this.totalRebirths * 2;
  karma += Object.keys(this.maxWaifuBonds).filter(k => this.maxWaifuBonds[k] >= 100).length * 10;

  // Bonus for high cultivation realm
  const realmBonuses = {
    'spiritSevering': 5,
    'daoSeeking': 10,
    'immortalAscension': 20,
    'trueImmortal': 50,
    'heavenlySovereign': 100
  };
  karma += realmBonuses[this.maxRealmReached] || 0;

  return Math.max(1, karma);
};

/**
 * Perform reincarnation
 */
PrestigeSystem.prototype.reincarnate = function(gameState, systems) {
  const check = this.canReincarnate();
  if (!check.can) return { success: false, reason: check.reason };

  const karmaEarned = this.calculateKarmaEarned();
  this.karmaPoints += karmaEarned;
  this.reincarnationCount++;

  // Keep 10% of lifetime BP
  const retainedBP = Math.floor(this.lifetimeBP * 0.1);

  // Reset rebirth tier and lifetime stats
  this.currentTier = 0;
  this.totalRebirths = 0;
  this.lifetimeBP = retainedBP;
  this.unlockedPerks = new Set();

  // Full game reset
  if (systems.gameState) {
    this.resetGameState(systems.gameState, systems.masterSystem, systems.catSystem, systems.waifuSystem, systems.upgradeSystem);
  }

  // Roll Past Life Memory
  this.pastLifeMemory = this.rollPastLifeMemory();

  // Apply karma shop bonuses
  this.applyKarmaShopBonuses(gameState, systems);

  // Apply past life memory
  if (this.pastLifeMemory) {
    this.applyPastLifeMemory(gameState);
  }

  return {
    success: true,
    karmaEarned,
    totalKarma: this.karmaPoints,
    reincarnationCount: this.reincarnationCount,
    multiplier: Math.pow(REINCARNATION_SYSTEM.multiplierPerReincarnation, this.reincarnationCount),
    pastLifeMemory: this.pastLifeMemory
  };
};

/**
 * Roll for a Past Life Memory based on previous run stats
 */
PrestigeSystem.prototype.rollPastLifeMemory = function() {
  const eligible = [];

  for (const [id, memory] of Object.entries(PAST_LIFE_MEMORIES)) {
    const trigger = memory.trigger;

    if (trigger.lifetimeBoops && (this.lifetimeBoops || 0) >= trigger.lifetimeBoops) {
      eligible.push(memory);
    }
    if (trigger.lifetimeBP && this.lifetimeBP >= trigger.lifetimeBP) {
      eligible.push(memory);
    }
    if (trigger.maxBondCount && Object.keys(this.maxWaifuBonds).filter(k => this.maxWaifuBonds[k] >= 100).length >= trigger.maxBondCount) {
      eligible.push(memory);
    }
    if (trigger.lifetimeCats && this.lifetimeCats >= trigger.lifetimeCats) {
      eligible.push(memory);
    }
    if (trigger.gooseBoops && (this.lifetimeGooseBoops || 0) >= trigger.gooseBoops) {
      eligible.push(memory);
    }
  }

  if (eligible.length === 0) return null;

  // Random selection from eligible memories
  return eligible[Math.floor(Math.random() * eligible.length)];
};

/**
 * Apply Past Life Memory effects
 */
PrestigeSystem.prototype.applyPastLifeMemory = function(gameState) {
  if (!this.pastLifeMemory) return;

  const effect = this.pastLifeMemory.effect;

  if (effect.boopPower) gameState.modifiers.boopPower = (gameState.modifiers.boopPower || 1) * effect.boopPower;
  if (effect.critChance) gameState.modifiers.critChance = (gameState.modifiers.critChance || 0) + effect.critChance;
  if (effect.startingBP) gameState.boopPoints += effect.startingBP;
  if (effect.currencyGain) gameState.modifiers.currencyGain = (gameState.modifiers.currencyGain || 1) * effect.currencyGain;
  if (effect.waifuStartBond && window.waifuSystem) {
    // Apply starting bond to all waifus
    for (const waifu of Object.values(window.waifuSystem.waifuStates || {})) {
      waifu.bondLevel = Math.max(waifu.bondLevel || 0, effect.waifuStartBond);
    }
  }
  if (effect.bondGain) gameState.modifiers.bondGain = (gameState.modifiers.bondGain || 1) * effect.bondGain;
  if (effect.catDropRate) gameState.modifiers.catDropRate = (gameState.modifiers.catDropRate || 1) * effect.catDropRate;
  if (effect.startingCats && window.catSystem) {
    for (let i = 0; i < effect.startingCats; i++) {
      window.catSystem.recruitCat(0);
    }
  }
  if (effect.cultivationXP) gameState.modifiers.cultivationXP = (gameState.modifiers.cultivationXP || 1) * effect.cultivationXP;
  if (effect.gooseRewards) gameState.modifiers.gooseRewards = (gameState.modifiers.gooseRewards || 1) * effect.gooseRewards;
  if (effect.gooseSpawnRate) gameState.modifiers.gooseSpawnRate = (gameState.modifiers.gooseSpawnRate || 1) * effect.gooseSpawnRate;
};

/**
 * Purchase from Karma Shop
 */
PrestigeSystem.prototype.purchaseKarmaShopItem = function(itemId) {
  // Find item in shop
  let item = null;
  for (const category of Object.values(KARMA_SHOP.categories)) {
    item = category.items.find(i => i.id === itemId);
    if (item) break;
  }

  if (!item) return { success: false, reason: 'Item not found' };

  // Check if already at max purchases
  const purchases = this.karmaShopPurchases[itemId] || 0;
  if (!item.repeatable && purchases >= 1) {
    return { success: false, reason: 'Already purchased' };
  }
  if (item.maxPurchases && purchases >= item.maxPurchases) {
    return { success: false, reason: 'Maximum purchases reached' };
  }

  // Check karma
  if (this.karmaPoints < item.cost) {
    return { success: false, reason: `Need ${item.cost} Karma Points (have ${this.karmaPoints})` };
  }

  // Purchase
  this.karmaPoints -= item.cost;
  this.karmaShopPurchases[itemId] = purchases + 1;

  return {
    success: true,
    item,
    remainingKarma: this.karmaPoints,
    totalPurchases: this.karmaShopPurchases[itemId]
  };
};

/**
 * Apply Karma Shop bonuses at start
 */
PrestigeSystem.prototype.applyKarmaShopBonuses = function(gameState, systems) {
  for (const [itemId, count] of Object.entries(this.karmaShopPurchases)) {
    if (count <= 0) continue;

    // Find item
    let item = null;
    for (const category of Object.values(KARMA_SHOP.categories)) {
      item = category.items.find(i => i.id === itemId);
      if (item) break;
    }

    if (!item) continue;

    const effect = item.effect;
    const multiplier = item.repeatable ? count : 1;

    if (effect.startingCats && systems.catSystem) {
      for (let i = 0; i < effect.startingCats * multiplier; i++) {
        systems.catSystem.recruitCat(0);
      }
    }
    if (effect.startingBP) gameState.boopPoints += effect.startingBP * multiplier;
    if (effect.startingPP) gameState.purrPower += effect.startingPP * multiplier;
    if (effect.permanentProduction) {
      gameState.modifiers.permanentProduction = (gameState.modifiers.permanentProduction || 1) * Math.pow(effect.permanentProduction, multiplier);
    }
    if (effect.permanentCrit) {
      gameState.modifiers.permanentCrit = (gameState.modifiers.permanentCrit || 0) + (effect.permanentCrit * multiplier);
    }
    if (effect.permanentAFK) {
      gameState.modifiers.permanentAFK = (gameState.modifiers.permanentAFK || 1) * effect.permanentAFK;
    }
    if (effect.comboDecayReduction) {
      gameState.modifiers.comboDecayReduction = (gameState.modifiers.comboDecayReduction || 0) + (effect.comboDecayReduction * multiplier);
    }
    if (effect.unlock) {
      gameState.unlocks = gameState.unlocks || {};
      gameState.unlocks[effect.unlock] = true;
    }
  }
};

/**
 * Check if transcendence is available
 */
PrestigeSystem.prototype.canTranscend = function() {
  const threshold = TRANSCENDENCE_SYSTEM.threshold;

  if (this.reincarnationCount < threshold.reincarnations) {
    return { can: false, reason: `Need ${threshold.reincarnations} reincarnations (have ${this.reincarnationCount})` };
  }

  if (this.karmaPoints < threshold.karmaPoints) {
    return { can: false, reason: `Need ${threshold.karmaPoints} Karma Points (have ${this.karmaPoints})` };
  }

  if (!this.hasReachedRealm(threshold.realmReached)) {
    return { can: false, reason: `Must reach ${threshold.realmReached} cultivation realm` };
  }

  return { can: true };
};

/**
 * Check if a realm has been reached
 */
PrestigeSystem.prototype.hasReachedRealm = function(realmId) {
  const realmOrder = ['mortal', 'qiCondensation', 'foundationEstablishment', 'coreFormation',
    'nascentSoul', 'spiritSevering', 'daoSeeking', 'immortalAscension', 'trueImmortal', 'heavenlySovereign'];

  const targetIndex = realmOrder.indexOf(realmId);
  const currentIndex = realmOrder.indexOf(this.maxRealmReached);

  return currentIndex >= targetIndex;
};

/**
 * Perform transcendence
 */
PrestigeSystem.prototype.transcend = function(gameState, systems) {
  const check = this.canTranscend();
  if (!check.can) return { success: false, reason: check.reason };

  this.transcendencePoints++;
  this.transcendenceCount++;

  // Near-total reset
  this.currentTier = 0;
  this.totalRebirths = 0;
  this.lifetimeBP = 0;
  this.lifetimePP = 0;
  this.lifetimeCats = 0;
  this.unlockedPerks = new Set();

  this.reincarnationCount = 0;
  this.karmaPoints = 0;
  this.pastLifeMemory = null;
  this.karmaShopPurchases = {};

  // Full game reset
  if (systems.gameState) {
    this.resetGameState(systems.gameState, systems.masterSystem, systems.catSystem, systems.waifuSystem, systems.upgradeSystem);
  }

  // Unlock celestial bonuses
  this.updateCelestialUnlocks();

  return {
    success: true,
    transcendencePoints: this.transcendencePoints,
    transcendenceCount: this.transcendenceCount,
    celestialUnlocks: this.celestialUnlocks
  };
};

/**
 * Update celestial unlocks based on transcendence points
 */
PrestigeSystem.prototype.updateCelestialUnlocks = function() {
  this.celestialUnlocks = [];

  for (const [threshold, bonus] of Object.entries(CELESTIAL_BONUSES)) {
    if (this.transcendencePoints >= parseInt(threshold)) {
      this.celestialUnlocks.push({ threshold: parseInt(threshold), ...bonus });
    }
  }
};

/**
 * Get reincarnation multiplier
 */
PrestigeSystem.prototype.getReincarnationMultiplier = function() {
  return Math.pow(REINCARNATION_SYSTEM.multiplierPerReincarnation, this.reincarnationCount);
};

/**
 * Get transcendence multiplier
 */
PrestigeSystem.prototype.getTranscendenceMultiplier = function() {
  let mult = 1;

  for (const unlock of this.celestialUnlocks) {
    if (unlock.allStats) mult *= unlock.allStats;
  }

  return mult;
};

/**
 * Track max waifu bond (for reincarnation bonuses)
 */
PrestigeSystem.prototype.trackWaifuBond = function(waifuId, bondLevel) {
  this.maxWaifuBonds[waifuId] = Math.max(this.maxWaifuBonds[waifuId] || 0, bondLevel);
};

/**
 * Track max realm reached
 */
PrestigeSystem.prototype.trackRealmReached = function(realmId) {
  const realmOrder = ['mortal', 'qiCondensation', 'foundationEstablishment', 'coreFormation',
    'nascentSoul', 'spiritSevering', 'daoSeeking', 'immortalAscension', 'trueImmortal', 'heavenlySovereign'];

  const newIndex = realmOrder.indexOf(realmId);
  const currentIndex = realmOrder.indexOf(this.maxRealmReached);

  if (newIndex > currentIndex) {
    this.maxRealmReached = realmId;
  }
};

/**
 * Enhanced serialize with reincarnation/transcendence data
 */
const originalSerialize = PrestigeSystem.prototype.serialize;
PrestigeSystem.prototype.serialize = function() {
  const base = originalSerialize.call(this);

  return {
    ...base,
    // Reincarnation data
    reincarnationCount: this.reincarnationCount || 0,
    karmaPoints: this.karmaPoints || 0,
    pastLifeMemory: this.pastLifeMemory,
    karmaShopPurchases: this.karmaShopPurchases || {},
    maxWaifuBonds: this.maxWaifuBonds || {},
    maxRealmReached: this.maxRealmReached || 'mortal',
    lifetimeBoops: this.lifetimeBoops || 0,
    lifetimeGooseBoops: this.lifetimeGooseBoops || 0,

    // Transcendence data
    transcendenceCount: this.transcendenceCount || 0,
    transcendencePoints: this.transcendencePoints || 0,
    celestialUnlocks: this.celestialUnlocks || []
  };
};

/**
 * Enhanced deserialize with reincarnation/transcendence data
 */
const originalDeserialize = PrestigeSystem.prototype.deserialize;
PrestigeSystem.prototype.deserialize = function(data) {
  originalDeserialize.call(this, data);

  if (!data) return;

  // Reincarnation data
  this.reincarnationCount = data.reincarnationCount || 0;
  this.karmaPoints = data.karmaPoints || 0;
  this.pastLifeMemory = data.pastLifeMemory || null;
  this.karmaShopPurchases = data.karmaShopPurchases || {};
  this.maxWaifuBonds = data.maxWaifuBonds || {};
  this.maxRealmReached = data.maxRealmReached || 'mortal';
  this.lifetimeBoops = data.lifetimeBoops || 0;
  this.lifetimeGooseBoops = data.lifetimeGooseBoops || 0;

  // Transcendence data
  this.transcendenceCount = data.transcendenceCount || 0;
  this.transcendencePoints = data.transcendencePoints || 0;
  this.celestialUnlocks = data.celestialUnlocks || [];

  // Recalculate celestial unlocks
  this.updateCelestialUnlocks();
};

// Export
window.REBIRTH_TIERS = REBIRTH_TIERS;
window.REBIRTH_PERKS = REBIRTH_PERKS;
window.REINCARNATION_SYSTEM = REINCARNATION_SYSTEM;
window.PAST_LIFE_MEMORIES = PAST_LIFE_MEMORIES;
window.KARMA_SHOP = KARMA_SHOP;
window.TRANSCENDENCE_SYSTEM = TRANSCENDENCE_SYSTEM;
window.CELESTIAL_BONUSES = CELESTIAL_BONUSES;
window.PrestigeSystem = PrestigeSystem;
