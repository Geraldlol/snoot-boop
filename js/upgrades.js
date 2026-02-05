/**
 * upgrades.js - Cultivation Techniques
 * "The wise cultivator knows many techniques, but masters only one: the boop."
 */

// Upgrade Categories
const UPGRADE_CATEGORIES = {
  snootArts: {
    id: 'snootArts',
    name: 'Snoot Arts',
    description: 'Active booping techniques',
    emoji: '👆',
    color: '#E94560'
  },
  innerCultivation: {
    id: 'innerCultivation',
    name: 'Inner Cultivation',
    description: 'Passive gains and efficiency',
    emoji: '☯️',
    color: '#50C878'
  },
  sectFacilities: {
    id: 'sectFacilities',
    name: 'Sect Facilities',
    description: 'Buildings and infrastructure',
    emoji: '🏯',
    color: '#FFD700'
  }
};

// Upgrade Templates
const UPGRADE_TEMPLATES = {
  // === SNOOT ARTS (Active Booping) ===
  gentle_palm: {
    id: 'gentle_palm',
    name: 'Gentle Palm',
    category: 'snootArts',
    description: 'Refine your booping technique for more Qi per boop.',
    emoji: '🖐️',
    maxLevel: 50,
    baseCost: 50,
    costMultiplier: 1.15,
    effect: {
      type: 'bpPerBoop',
      baseValue: 0.5,
      perLevel: 0.5
    },
    flavorText: '"Softness overcomes hardness." — Snoot Sutra'
  },

  twin_dragon_fingers: {
    id: 'twin_dragon_fingers',
    name: 'Twin Dragon Fingers',
    category: 'snootArts',
    description: 'Channel Qi through two fingers, doubling your booping potential.',
    emoji: '🐲',
    maxLevel: 25,
    baseCost: 500,
    costMultiplier: 1.25,
    effect: {
      type: 'bpMultiplier',
      baseValue: 1.0,
      perLevel: 0.05 // 5% per level
    },
    requires: { gentle_palm: 5 },
    flavorText: '"Two dragons, one snoot."'
  },

  critical_meridian_strike: {
    id: 'critical_meridian_strike',
    name: 'Critical Meridian Strike',
    category: 'snootArts',
    description: 'Target the snoot\'s vital points for devastating critical boops.',
    emoji: '💥',
    maxLevel: 20,
    baseCost: 1000,
    costMultiplier: 1.3,
    effect: {
      type: 'critChance',
      baseValue: 0,
      perLevel: 0.02 // 2% per level
    },
    requires: { gentle_palm: 10 },
    flavorText: '"Strike where the Qi flows strongest."'
  },

  critical_mastery: {
    id: 'critical_mastery',
    name: 'Critical Mastery',
    category: 'snootArts',
    description: 'When you crit, you REALLY crit.',
    emoji: '⚡',
    maxLevel: 15,
    baseCost: 2500,
    costMultiplier: 1.35,
    effect: {
      type: 'critMultiplier',
      baseValue: 0,
      perLevel: 2 // +2x per level
    },
    requires: { critical_meridian_strike: 5 },
    flavorText: '"The snoot that shook the heavens."'
  },

  qi_aura_projection: {
    id: 'qi_aura_projection',
    name: 'Qi Aura Projection',
    category: 'snootArts',
    description: 'Your Qi aura passively boops nearby snoots.',
    emoji: '🌀',
    maxLevel: 10,
    baseCost: 10000,
    costMultiplier: 1.5,
    effect: {
      type: 'autoBoopRate',
      baseValue: 0,
      perLevel: 0.1 // boops per second
    },
    requires: { twin_dragon_fingers: 10 },
    flavorText: '"The boop that needs no finger."'
  },

  heaven_sundering_boop: {
    id: 'heaven_sundering_boop',
    name: 'HEAVEN SUNDERING BOOP',
    category: 'snootArts',
    description: 'The ultimate technique. Screen-wide snoot devastation.',
    emoji: '☄️',
    maxLevel: 5,
    baseCost: 100000,
    costMultiplier: 2.0,
    effect: {
      type: 'megaBoopMultiplier',
      baseValue: 0,
      perLevel: 1.0 // +100% per level
    },
    requires: { qi_aura_projection: 5, critical_mastery: 10 },
    flavorText: '"AND THE HEAVENS TREMBLED."'
  },

  // === INNER CULTIVATION (Passive Gains) ===
  iron_fur_body: {
    id: 'iron_fur_body',
    name: 'Iron Fur Body',
    category: 'innerCultivation',
    description: 'Cats take longer to become unhappy.',
    emoji: '🛡️',
    maxLevel: 20,
    baseCost: 200,
    costMultiplier: 1.2,
    effect: {
      type: 'happinessDecayReduction',
      baseValue: 0,
      perLevel: 0.05 // 5% reduction per level
    },
    flavorText: '"The content cat needs nothing."'
  },

  qi_circulation: {
    id: 'qi_circulation',
    name: 'Qi Circulation',
    category: 'innerCultivation',
    description: 'Improve your sect\'s Qi flow for more PP.',
    emoji: '🔄',
    maxLevel: 50,
    baseCost: 100,
    costMultiplier: 1.12,
    effect: {
      type: 'ppMultiplier',
      baseValue: 1.0,
      perLevel: 0.1 // 10% per level
    },
    flavorText: '"As the river flows, so does the Purr."'
  },

  lightness_cat: {
    id: 'lightness_cat',
    name: 'Lightness Cat',
    category: 'innerCultivation',
    description: 'Cats move faster, triggering events more often.',
    emoji: '💨',
    maxLevel: 15,
    baseCost: 750,
    costMultiplier: 1.25,
    effect: {
      type: 'eventChanceBonus',
      baseValue: 0,
      perLevel: 0.05 // 5% per level
    },
    requires: { qi_circulation: 5 },
    flavorText: '"The cat that moves like wind."'
  },

  eternal_slumber: {
    id: 'eternal_slumber',
    name: 'Eternal Slumber',
    category: 'innerCultivation',
    description: 'Massively boost AFK cultivation gains.',
    emoji: '😴',
    maxLevel: 25,
    baseCost: 2000,
    costMultiplier: 1.3,
    effect: {
      type: 'afkMultiplier',
      baseValue: 1.0,
      perLevel: 0.2 // 20% per level
    },
    requires: { qi_circulation: 10 },
    flavorText: '"Sleep is the highest form of cultivation."'
  },

  one_with_snoot: {
    id: 'one_with_snoot',
    name: 'One With Snoot',
    category: 'innerCultivation',
    description: 'Generate BP passively by simply existing.',
    emoji: '🧘',
    maxLevel: 20,
    baseCost: 5000,
    costMultiplier: 1.4,
    effect: {
      type: 'passiveBpPerSecond',
      baseValue: 0,
      perLevel: 1 // 1 BP per second per level
    },
    requires: { eternal_slumber: 10 },
    flavorText: '"I am the snoot. The snoot is me."'
  },

  // === SECT FACILITIES ===
  cat_pagoda: {
    id: 'cat_pagoda',
    name: 'Cat Pagoda',
    category: 'sectFacilities',
    description: 'A towering sanctuary. More cats can reside here.',
    emoji: '🏯',
    maxLevel: 10,
    baseCost: 500,
    costMultiplier: 1.5,
    effect: {
      type: 'catCapacity',
      baseValue: 10,
      perLevel: 5
    },
    flavorText: '"Seven stories of snoot."'
  },

  scratching_pillars: {
    id: 'scratching_pillars',
    name: 'Scratching Pillars',
    category: 'sectFacilities',
    description: 'Ancient pillars that boost cat happiness.',
    emoji: '🪵',
    maxLevel: 15,
    baseCost: 300,
    costMultiplier: 1.25,
    effect: {
      type: 'happinessGain',
      baseValue: 0,
      perLevel: 1 // +1% happiness per minute per level
    },
    flavorText: '"Scratch away worldly attachments."'
  },

  sunny_window_perches: {
    id: 'sunny_window_perches',
    name: 'Sunny Window Perches',
    category: 'sectFacilities',
    description: 'Cats bask in sunlight, generating passive BP.',
    emoji: '☀️',
    maxLevel: 20,
    baseCost: 1000,
    costMultiplier: 1.3,
    effect: {
      type: 'passiveBpPerSecond',
      baseValue: 0,
      perLevel: 0.5
    },
    requires: { cat_pagoda: 3 },
    flavorText: '"Where sun touches fur, Qi flows."'
  },

  heated_meditation_mats: {
    id: 'heated_meditation_mats',
    name: 'Heated Meditation Mats',
    category: 'sectFacilities',
    description: 'Warm mats for deep cultivation. Boost AFK efficiency.',
    emoji: '🧶',
    maxLevel: 15,
    baseCost: 1500,
    costMultiplier: 1.35,
    effect: {
      type: 'afkMultiplier',
      baseValue: 1.0,
      perLevel: 0.1
    },
    requires: { cat_pagoda: 5 },
    flavorText: '"Warmth accelerates enlightenment."'
  },

  sacred_cardboard_boxes: {
    id: 'sacred_cardboard_boxes',
    name: 'Sacred Cardboard Boxes',
    category: 'sectFacilities',
    description: 'The holiest of cat furniture. Massive PP boost.',
    emoji: '📦',
    maxLevel: 10,
    baseCost: 5000,
    costMultiplier: 1.5,
    effect: {
      type: 'ppMultiplier',
      baseValue: 1.0,
      perLevel: 0.25
    },
    requires: { scratching_pillars: 10 },
    flavorText: '"If it fits, it cultivates."'
  },

  jade_laser_array: {
    id: 'jade_laser_array',
    name: 'Jade Laser Array',
    category: 'sectFacilities',
    description: 'Automated boop system using ancient jade technology.',
    emoji: '🔴',
    maxLevel: 10,
    baseCost: 25000,
    costMultiplier: 1.75,
    effect: {
      type: 'autoBoopRate',
      baseValue: 0,
      perLevel: 0.5
    },
    requires: { sunny_window_perches: 10, sacred_cardboard_boxes: 5 },
    flavorText: '"The red dot of destiny."'
  }
};

/**
 * UpgradeSystem - Manages cultivation techniques
 */
class UpgradeSystem {
  constructor() {
    this.purchasedUpgrades = {};
    this.categories = UPGRADE_CATEGORIES;
    this.templates = UPGRADE_TEMPLATES;
  }

  /**
   * Get current level of an upgrade
   */
  getLevel(upgradeId) {
    return this.purchasedUpgrades[upgradeId] || 0;
  }

  /**
   * Get cost for next level
   */
  getCost(upgradeId) {
    const template = this.templates[upgradeId];
    if (!template) return Infinity;

    const currentLevel = this.getLevel(upgradeId);
    if (currentLevel >= template.maxLevel) return Infinity;

    return Math.floor(template.baseCost * Math.pow(template.costMultiplier, currentLevel));
  }

  /**
   * Check if requirements are met
   */
  canPurchase(upgradeId, currentBP) {
    const template = this.templates[upgradeId];
    if (!template) return false;

    const currentLevel = this.getLevel(upgradeId);
    if (currentLevel >= template.maxLevel) return false;

    // Check cost
    if (currentBP < this.getCost(upgradeId)) return false;

    // Check requirements
    if (template.requires) {
      for (const [reqId, reqLevel] of Object.entries(template.requires)) {
        if (this.getLevel(reqId) < reqLevel) return false;
      }
    }

    return true;
  }

  /**
   * Purchase an upgrade
   */
  purchase(upgradeId) {
    const cost = this.getCost(upgradeId);
    if (!this.purchasedUpgrades[upgradeId]) {
      this.purchasedUpgrades[upgradeId] = 0;
    }
    this.purchasedUpgrades[upgradeId]++;
    return cost;
  }

  /**
   * Get all upgrades by category
   */
  getUpgradesByCategory(categoryId) {
    return Object.values(this.templates).filter(u => u.category === categoryId);
  }

  /**
   * Get current effect value for an upgrade
   */
  getEffectValue(upgradeId) {
    const template = this.templates[upgradeId];
    if (!template) return 0;

    const level = this.getLevel(upgradeId);
    return template.effect.baseValue + (template.effect.perLevel * level);
  }

  /**
   * Calculate all combined effects
   */
  getCombinedEffects() {
    const effects = {
      bpPerBoop: 0,
      bpMultiplier: 1,
      ppMultiplier: 1,
      afkMultiplier: 1,
      critChance: 0,
      critMultiplier: 0,
      autoBoopRate: 0,
      passiveBpPerSecond: 0,
      catCapacity: 10,
      happinessDecayReduction: 0,
      happinessGain: 0,
      eventChanceBonus: 0,
      megaBoopMultiplier: 0
    };

    for (const [upgradeId, level] of Object.entries(this.purchasedUpgrades)) {
      if (level === 0) continue;

      const template = this.templates[upgradeId];
      if (!template) continue;

      const value = template.effect.baseValue + (template.effect.perLevel * level);

      switch (template.effect.type) {
        case 'bpPerBoop':
          effects.bpPerBoop += value;
          break;
        case 'bpMultiplier':
          effects.bpMultiplier *= value;
          break;
        case 'ppMultiplier':
          effects.ppMultiplier *= value;
          break;
        case 'afkMultiplier':
          effects.afkMultiplier *= value;
          break;
        case 'critChance':
          effects.critChance += value;
          break;
        case 'critMultiplier':
          effects.critMultiplier += value;
          break;
        case 'autoBoopRate':
          effects.autoBoopRate += value;
          break;
        case 'passiveBpPerSecond':
          effects.passiveBpPerSecond += value;
          break;
        case 'catCapacity':
          effects.catCapacity += value - 10; // Subtract base since we start at 10
          break;
        case 'happinessDecayReduction':
          effects.happinessDecayReduction += value;
          break;
        case 'happinessGain':
          effects.happinessGain += value;
          break;
        case 'eventChanceBonus':
          effects.eventChanceBonus += value;
          break;
        case 'megaBoopMultiplier':
          effects.megaBoopMultiplier += value;
          break;
      }
    }

    return effects;
  }

  /**
   * Check if all basic upgrades are purchased (for waifu unlock)
   */
  areAllBasicUpgradesPurchased() {
    const basicUpgrades = ['gentle_palm', 'qi_circulation', 'iron_fur_body', 'cat_pagoda'];
    return basicUpgrades.every(id => this.getLevel(id) >= 5);
  }

  /**
   * Reset upgrades for rebirth
   */
  reset() {
    this.purchasedUpgrades = {};
  }

  /**
   * Set upgrade level directly (for prestige perks)
   */
  setLevel(upgradeId, level) {
    this.purchasedUpgrades[upgradeId] = level;
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      purchasedUpgrades: this.purchasedUpgrades
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.purchasedUpgrades) {
      this.purchasedUpgrades = data.purchasedUpgrades;
    }
  }
}

// Export
window.UPGRADE_CATEGORIES = UPGRADE_CATEGORIES;
window.UPGRADE_TEMPLATES = UPGRADE_TEMPLATES;
window.UpgradeSystem = UpgradeSystem;
