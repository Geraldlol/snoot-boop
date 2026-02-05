/**
 * blessings.js - Waifu Blessing System (Hades-style)
 * "The waifus bestow their favor upon worthy cultivators."
 */

// Blessing Rarities
const BLESSING_RARITIES = {
  common: { id: 'common', name: 'Common', color: '#9CA3AF', weight: 60 },
  rare: { id: 'rare', name: 'Rare', color: '#3B82F6', weight: 25 },
  epic: { id: 'epic', name: 'Epic', color: '#8B5CF6', weight: 12 },
  legendary: { id: 'legendary', name: 'Legendary', color: '#F59E0B', weight: 3 }
};

// Waifu Blessing Pools
const WAIFU_BLESSINGS = {
  mei_lin: {
    waifuId: 'mei_lin',
    waifuName: 'Mei Lin',
    waifuEmoji: '🌸',
    theme: 'Critical Strikes',
    color: '#E94560',
    blessings: [
      {
        id: 'mei_precision',
        name: 'Precision Strike',
        rarity: 'common',
        description: '+5% critical chance',
        effect: { critChance: 0.05 }
      },
      {
        id: 'mei_fury',
        name: 'Crimson Fury',
        rarity: 'common',
        description: '+15% critical damage',
        effect: { critDamage: 0.15 }
      },
      {
        id: 'mei_chain',
        name: 'Chain Reaction',
        rarity: 'rare',
        description: 'Crits have 20% chance to trigger another crit',
        effect: { chainCrit: 0.2 }
      },
      {
        id: 'mei_execute',
        name: 'Executioner',
        rarity: 'rare',
        description: 'Deal 50% more damage to enemies below 30% HP',
        effect: { executeBonus: 0.5, executeThreshold: 0.3 }
      },
      {
        id: 'mei_dragons_fury',
        name: "Dragon's Fury",
        rarity: 'legendary',
        description: 'Every 3rd attack is guaranteed critical',
        effect: { guaranteedCritEvery: 3 }
      }
    ],
    synergy: {
      count: 3,
      name: 'Mei Lin\'s Wrath',
      description: 'Crits deal AOE damage to nearby enemies',
      effect: { critAoe: true }
    }
  },

  sakura: {
    waifuId: 'sakura',
    waifuName: 'Sakura',
    waifuEmoji: '🌺',
    theme: 'Healing & Recovery',
    color: '#FFB6C1',
    blessings: [
      {
        id: 'sakura_regen',
        name: 'Gentle Breeze',
        rarity: 'common',
        description: 'Regenerate 1% HP per second',
        effect: { regenPerSecond: 0.01 }
      },
      {
        id: 'sakura_shield',
        name: 'Petal Shield',
        rarity: 'common',
        description: 'Start combat with 2 shields',
        effect: { startingShields: 2 }
      },
      {
        id: 'sakura_lifesteal',
        name: 'Life Bloom',
        rarity: 'rare',
        description: 'Heal 10% of damage dealt',
        effect: { lifesteal: 0.1 }
      },
      {
        id: 'sakura_second_wind',
        name: 'Second Wind',
        rarity: 'rare',
        description: 'Heal 30% HP when dropping below 25%',
        effect: { secondWind: 0.3, secondWindThreshold: 0.25 }
      },
      {
        id: 'sakura_eternal_bloom',
        name: 'Eternal Bloom',
        rarity: 'legendary',
        description: 'Survive fatal damage once per run (1 HP)',
        effect: { deathDefiance: 1 }
      }
    ],
    synergy: {
      count: 3,
      name: 'Sakura\'s Embrace',
      description: 'Healing also grants temporary damage boost',
      effect: { healDamageBoost: true }
    }
  },

  luna: {
    waifuId: 'luna',
    waifuName: 'Luna',
    waifuEmoji: '🌙',
    theme: 'Passive Generation',
    color: '#7B68EE',
    blessings: [
      {
        id: 'luna_bp_boost',
        name: 'Moonlit Bounty',
        rarity: 'common',
        description: '+15% BP from all sources',
        effect: { bpMultiplier: 0.15 }
      },
      {
        id: 'luna_pp_boost',
        name: 'Starlight Purrs',
        rarity: 'common',
        description: '+15% PP from all sources',
        effect: { ppMultiplier: 0.15 }
      },
      {
        id: 'luna_passive_bp',
        name: 'Cosmic Flow',
        rarity: 'rare',
        description: 'Generate 5 BP per second in combat',
        effect: { passiveBpPerSecond: 5 }
      },
      {
        id: 'luna_loot_luck',
        name: 'Fortune\'s Favor',
        rarity: 'rare',
        description: '+25% loot drop chance',
        effect: { lootBonus: 0.25 }
      },
      {
        id: 'luna_cosmic_harvest',
        name: 'Cosmic Harvest',
        rarity: 'legendary',
        description: 'Double all resource gains from current run',
        effect: { resourceDoubler: true }
      }
    ],
    synergy: {
      count: 3,
      name: 'Luna\'s Abundance',
      description: 'Gain bonus resources on floor clear',
      effect: { floorClearBonus: true }
    }
  },

  jade: {
    waifuId: 'jade',
    waifuName: 'Jade',
    waifuEmoji: '💎',
    theme: 'Equipment & Crafting',
    color: '#50C878',
    blessings: [
      {
        id: 'jade_equipment_stats',
        name: 'Artisan\'s Touch',
        rarity: 'common',
        description: '+10% equipment stat bonuses',
        effect: { equipmentStatBonus: 0.1 }
      },
      {
        id: 'jade_material_bonus',
        name: 'Material Mastery',
        rarity: 'common',
        description: '+20% material drops',
        effect: { materialDropBonus: 0.2 }
      },
      {
        id: 'jade_rarity_up',
        name: 'Refined Taste',
        rarity: 'rare',
        description: 'Equipment drops are 1 rarity higher',
        effect: { rarityUpgrade: 1 }
      },
      {
        id: 'jade_set_power',
        name: 'Set Synergy',
        rarity: 'rare',
        description: '+50% set bonus effects',
        effect: { setBonusMultiplier: 0.5 }
      },
      {
        id: 'jade_perfect_craft',
        name: 'Perfect Craft',
        rarity: 'legendary',
        description: 'Crafted equipment has max substats',
        effect: { perfectSubstats: true }
      }
    ],
    synergy: {
      count: 3,
      name: 'Jade\'s Perfection',
      description: 'Chance for equipment to drop with set piece',
      effect: { guaranteedSetPiece: true }
    }
  },

  storm: {
    waifuId: 'storm',
    waifuName: 'Storm',
    waifuEmoji: '⚡',
    theme: 'Damage & Speed',
    color: '#FFD700',
    blessings: [
      {
        id: 'storm_damage',
        name: 'Thunder Strike',
        rarity: 'common',
        description: '+10% damage',
        effect: { damageMultiplier: 0.1 }
      },
      {
        id: 'storm_speed',
        name: 'Lightning Speed',
        rarity: 'common',
        description: '+15% attack speed',
        effect: { attackSpeed: 0.15 }
      },
      {
        id: 'storm_chain',
        name: 'Chain Lightning',
        rarity: 'rare',
        description: 'Attacks chain to 1 additional enemy',
        effect: { chainTargets: 1 }
      },
      {
        id: 'storm_overcharge',
        name: 'Overcharge',
        rarity: 'rare',
        description: 'Every 5th attack deals double damage',
        effect: { overchargeEvery: 5, overchargeMultiplier: 2 }
      },
      {
        id: 'storm_tempest',
        name: 'Tempest Unleashed',
        rarity: 'legendary',
        description: 'Deal 300% damage every 10 seconds automatically',
        effect: { tempestDamage: 3.0, tempestInterval: 10000 }
      }
    ],
    synergy: {
      count: 3,
      name: 'Storm\'s Wrath',
      description: 'Attacks have chance to stun enemies',
      effect: { stunChance: 0.15 }
    }
  },

  celestia: {
    waifuId: 'celestia',
    waifuName: 'Celestia',
    waifuEmoji: '👼',
    theme: 'Ultimate Abilities',
    color: '#E0FFFF',
    blessings: [
      {
        id: 'celestia_cooldown',
        name: 'Divine Haste',
        rarity: 'common',
        description: '-15% ability cooldowns',
        effect: { cooldownReduction: 0.15 }
      },
      {
        id: 'celestia_mega_power',
        name: 'Empowered Boop',
        rarity: 'common',
        description: '+25% MEGA BOOP damage',
        effect: { megaBoopBonus: 0.25 }
      },
      {
        id: 'celestia_shield_restore',
        name: 'Shield Restoration',
        rarity: 'rare',
        description: 'Gain 1 shield every 20 seconds',
        effect: { shieldRegenInterval: 20000 }
      },
      {
        id: 'celestia_ability_reset',
        name: 'Divine Reset',
        rarity: 'rare',
        description: '20% chance to reset cooldowns on kill',
        effect: { cooldownResetOnKill: 0.2 }
      },
      {
        id: 'celestia_ascension',
        name: 'Ascension',
        rarity: 'legendary',
        description: 'All abilities deal +100% damage for 10s after using MEGA BOOP',
        effect: { ascensionBonus: 1.0, ascensionDuration: 10000 }
      }
    ],
    synergy: {
      count: 3,
      name: 'Celestia\'s Grace',
      description: 'Start each floor with all abilities ready',
      effect: { freshCooldowns: true }
    }
  }
};

// Mixed Synergies (require blessings from multiple waifus)
const MIXED_SYNERGIES = {
  elemental_mastery: {
    id: 'elemental_mastery',
    name: 'Elemental Mastery',
    requirements: { mei_lin: 1, storm: 1 },
    description: 'Fire and Lightning combine for devastating damage',
    effect: { elementalCombo: true, comboDamage: 0.5 }
  },
  balanced_cultivator: {
    id: 'balanced_cultivator',
    name: 'Balanced Cultivator',
    requirements: { sakura: 1, luna: 1, jade: 1 },
    description: 'Perfect balance grants +25% to all stats',
    effect: { allStats: 0.25 }
  },
  divine_storm: {
    id: 'divine_storm',
    name: 'Divine Storm',
    requirements: { storm: 2, celestia: 1 },
    description: 'Lightning strikes on ability use',
    effect: { lightningOnAbility: true }
  }
};

/**
 * BlessingSystem - Manages waifu blessings
 */
class BlessingSystem {
  constructor() {
    this.waifuBlessings = WAIFU_BLESSINGS;
    this.mixedSynergies = MIXED_SYNERGIES;
    this.rarities = BLESSING_RARITIES;

    // Current run blessings
    this.currentBlessings = [];

    // Permanent unlocks (special blessings that persist)
    this.permanentBlessings = [];

    // Blessing selection state
    this.pendingSelection = null; // { options: [], callback: fn }

    // Statistics
    this.stats = {
      totalBlessingsReceived: 0,
      blessingsByWaifu: {},
      synergiesTriggered: 0
    };
  }

  /**
   * Offer blessing selection (pick 1 of 3)
   */
  offerBlessings(count = 3, callback = null) {
    const options = this.generateBlessingOptions(count);

    this.pendingSelection = {
      options,
      callback
    };

    if (window.audioSystem) {
      window.audioSystem.playSFX('blessingOffered');
    }

    return options;
  }

  /**
   * Generate random blessing options
   */
  generateBlessingOptions(count) {
    const options = [];
    const usedIds = new Set(this.currentBlessings.map(b => b.id));

    // Get all available blessings
    const allBlessings = [];
    for (const [waifuId, waifuData] of Object.entries(this.waifuBlessings)) {
      for (const blessing of waifuData.blessings) {
        if (!usedIds.has(blessing.id)) {
          allBlessings.push({
            ...blessing,
            waifuId,
            waifuName: waifuData.waifuName,
            waifuEmoji: waifuData.waifuEmoji,
            waifuColor: waifuData.color
          });
        }
      }
    }

    // Weight by rarity
    const weightedBlessings = [];
    for (const blessing of allBlessings) {
      const rarity = this.rarities[blessing.rarity];
      for (let i = 0; i < rarity.weight; i++) {
        weightedBlessings.push(blessing);
      }
    }

    // Pick random options
    for (let i = 0; i < count && weightedBlessings.length > 0; i++) {
      const index = Math.floor(Math.random() * weightedBlessings.length);
      const blessing = weightedBlessings[index];

      options.push(blessing);

      // Remove all instances of this blessing from pool
      for (let j = weightedBlessings.length - 1; j >= 0; j--) {
        if (weightedBlessings[j].id === blessing.id) {
          weightedBlessings.splice(j, 1);
        }
      }
    }

    return options;
  }

  /**
   * Select a blessing from offered options
   */
  selectBlessing(blessingId) {
    if (!this.pendingSelection) return false;

    const blessing = this.pendingSelection.options.find(b => b.id === blessingId);
    if (!blessing) return false;

    // Add blessing to current run
    this.currentBlessings.push(blessing);

    // Update stats
    this.stats.totalBlessingsReceived++;
    if (!this.stats.blessingsByWaifu[blessing.waifuId]) {
      this.stats.blessingsByWaifu[blessing.waifuId] = 0;
    }
    this.stats.blessingsByWaifu[blessing.waifuId]++;

    // Check for synergies
    this.checkSynergies();

    // Call callback if provided
    if (this.pendingSelection.callback) {
      this.pendingSelection.callback(blessing);
    }

    this.pendingSelection = null;

    if (window.audioSystem) {
      window.audioSystem.playSFX('blessingSelected');
    }

    return true;
  }

  /**
   * Skip blessing selection
   */
  skipSelection() {
    this.pendingSelection = null;
  }

  /**
   * Check for activated synergies
   */
  checkSynergies() {
    // Check waifu-specific synergies
    const waifuCounts = {};
    for (const blessing of this.currentBlessings) {
      waifuCounts[blessing.waifuId] = (waifuCounts[blessing.waifuId] || 0) + 1;
    }

    // Single-waifu synergies
    for (const [waifuId, waifuData] of Object.entries(this.waifuBlessings)) {
      const count = waifuCounts[waifuId] || 0;
      if (count >= waifuData.synergy.count) {
        // Synergy activated!
        const synergyId = `${waifuId}_synergy`;
        if (!this.currentBlessings.find(b => b.id === synergyId)) {
          this.currentBlessings.push({
            id: synergyId,
            name: waifuData.synergy.name,
            description: waifuData.synergy.description,
            effect: waifuData.synergy.effect,
            waifuId,
            waifuName: waifuData.waifuName,
            waifuEmoji: waifuData.waifuEmoji,
            isSynergy: true
          });
          this.stats.synergiesTriggered++;
        }
      }
    }

    // Mixed synergies
    for (const [synergyId, synergy] of Object.entries(this.mixedSynergies)) {
      let meetsRequirements = true;
      for (const [waifuId, required] of Object.entries(synergy.requirements)) {
        if ((waifuCounts[waifuId] || 0) < required) {
          meetsRequirements = false;
          break;
        }
      }

      if (meetsRequirements) {
        const fullSynergyId = `mixed_${synergyId}`;
        if (!this.currentBlessings.find(b => b.id === fullSynergyId)) {
          this.currentBlessings.push({
            id: fullSynergyId,
            name: synergy.name,
            description: synergy.description,
            effect: synergy.effect,
            isSynergy: true,
            isMixed: true
          });
          this.stats.synergiesTriggered++;
        }
      }
    }
  }

  /**
   * Get combined effects from all current blessings
   */
  getCombinedEffects() {
    const effects = {
      critChance: 0,
      critDamage: 0,
      chainCrit: 0,
      executeBonus: 0,
      executeThreshold: 0,
      guaranteedCritEvery: 0,
      regenPerSecond: 0,
      startingShields: 0,
      lifesteal: 0,
      secondWind: 0,
      secondWindThreshold: 0,
      deathDefiance: 0,
      bpMultiplier: 0,
      ppMultiplier: 0,
      passiveBpPerSecond: 0,
      lootBonus: 0,
      resourceDoubler: false,
      equipmentStatBonus: 0,
      materialDropBonus: 0,
      rarityUpgrade: 0,
      setBonusMultiplier: 0,
      perfectSubstats: false,
      damageMultiplier: 0,
      attackSpeed: 0,
      chainTargets: 0,
      overchargeEvery: 0,
      overchargeMultiplier: 0,
      tempestDamage: 0,
      tempestInterval: 0,
      cooldownReduction: 0,
      megaBoopBonus: 0,
      shieldRegenInterval: 0,
      cooldownResetOnKill: 0,
      ascensionBonus: 0,
      ascensionDuration: 0,
      // Synergy effects
      critAoe: false,
      healDamageBoost: false,
      floorClearBonus: false,
      guaranteedSetPiece: false,
      stunChance: 0,
      freshCooldowns: false,
      elementalCombo: false,
      comboDamage: 0,
      allStats: 0,
      lightningOnAbility: false
    };

    for (const blessing of this.currentBlessings) {
      if (!blessing.effect) continue;

      for (const [key, value] of Object.entries(blessing.effect)) {
        if (typeof value === 'boolean') {
          effects[key] = value;
        } else if (typeof value === 'number') {
          effects[key] += value;
        }
      }
    }

    return effects;
  }

  /**
   * Get blessings by waifu
   */
  getBlessingsByWaifu(waifuId) {
    return this.currentBlessings.filter(b => b.waifuId === waifuId);
  }

  /**
   * Get all active synergies
   */
  getActiveSynergies() {
    return this.currentBlessings.filter(b => b.isSynergy);
  }

  /**
   * Add permanent blessing
   */
  addPermanentBlessing(blessingId) {
    if (this.permanentBlessings.includes(blessingId)) return false;
    this.permanentBlessings.push(blessingId);
    return true;
  }

  /**
   * Start new run (reset current blessings)
   */
  startRun() {
    this.currentBlessings = [];
    this.pendingSelection = null;

    // Add permanent blessings
    for (const blessingId of this.permanentBlessings) {
      const blessing = this.findBlessingById(blessingId);
      if (blessing) {
        this.currentBlessings.push({ ...blessing, isPermanent: true });
      }
    }
  }

  /**
   * Find blessing by ID across all waifus
   */
  findBlessingById(blessingId) {
    for (const waifuData of Object.values(this.waifuBlessings)) {
      const blessing = waifuData.blessings.find(b => b.id === blessingId);
      if (blessing) {
        return {
          ...blessing,
          waifuId: waifuData.waifuId,
          waifuName: waifuData.waifuName,
          waifuEmoji: waifuData.waifuEmoji
        };
      }
    }
    return null;
  }

  /**
   * End run (clear non-permanent blessings)
   */
  endRun() {
    this.currentBlessings = [];
    this.pendingSelection = null;
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      permanentBlessings: this.permanentBlessings,
      stats: this.stats
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.permanentBlessings) {
      this.permanentBlessings = data.permanentBlessings;
    }
    if (data.stats) {
      this.stats = { ...this.stats, ...data.stats };
    }
  }

  /**
   * Reset system
   */
  reset() {
    this.currentBlessings = [];
    this.permanentBlessings = [];
    this.pendingSelection = null;
    this.stats = {
      totalBlessingsReceived: 0,
      blessingsByWaifu: {},
      synergiesTriggered: 0
    };
  }
}

// Export
window.BLESSING_RARITIES = BLESSING_RARITIES;
window.WAIFU_BLESSINGS = WAIFU_BLESSINGS;
window.MIXED_SYNERGIES = MIXED_SYNERGIES;
window.BlessingSystem = BlessingSystem;
