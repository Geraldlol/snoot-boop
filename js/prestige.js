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
    unlocks: ['starting_cats']
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
    unlocks: ['master_switch', 'waifu_bond_retain']
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

// Export
window.REBIRTH_TIERS = REBIRTH_TIERS;
window.REBIRTH_PERKS = REBIRTH_PERKS;
window.PrestigeSystem = PrestigeSystem;
