/**
 * UpgradeSystem - Cultivation Upgrade Trees
 *
 * Pure TypeScript, zero React imports.
 * 14 upgrades across 3 categories with cost scaling and prerequisites.
 */

// ─── Types ─────────────────────────────────────────────────

export interface UpgradeCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface UpgradeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
  effect: {
    type: string;
    baseValue: number;
    perLevel: number;
  };
  requires?: Array<{ upgradeId: string; level: number }>;
}

export interface CombinedUpgradeEffects {
  bpPerBoop: number;
  bpMultiplier: number;
  ppMultiplier: number;
  afkMultiplier: number;
  critChance: number;
  critMultiplier: number;
  autoBoopRate: number;
  passiveBpPerSecond: number;
  catCapacity: number;
  happinessDecayReduction: number;
  happinessGain: number;
  eventChanceBonus: number;
  megaBoopMultiplier: number;
}

// ─── Static Data ───────────────────────────────────────────

export const UPGRADE_CATEGORIES: UpgradeCategory[] = [
  { id: 'snootArts', name: 'Snoot Arts', emoji: '👆', color: '#E94560' },
  { id: 'innerCultivation', name: 'Inner Cultivation', emoji: '☯️', color: '#50C878' },
  { id: 'sectFacilities', name: 'Sect Facilities', emoji: '🏯', color: '#FFD700' },
];

export const UPGRADE_TEMPLATES: UpgradeTemplate[] = [
  // ─── Snoot Arts ──────────────────────────────────────
  {
    id: 'gentle_palm', name: 'Gentle Palm', category: 'snootArts',
    description: '+0.5 BP per boop per level',
    baseCost: 50, costMultiplier: 1.15, maxLevel: 50,
    effect: { type: 'bpPerBoop', baseValue: 0.5, perLevel: 0.5 },
  },
  {
    id: 'twin_dragon_fingers', name: 'Twin Dragon Fingers', category: 'snootArts',
    description: '+5% BP multiplier per level',
    baseCost: 500, costMultiplier: 1.25, maxLevel: 25,
    effect: { type: 'bpMultiplier', baseValue: 0.05, perLevel: 0.05 },
    requires: [{ upgradeId: 'gentle_palm', level: 5 }],
  },
  {
    id: 'critical_meridian_strike', name: 'Critical Meridian Strike', category: 'snootArts',
    description: '+2% crit chance per level',
    baseCost: 1000, costMultiplier: 1.3, maxLevel: 20,
    effect: { type: 'critChance', baseValue: 0.02, perLevel: 0.02 },
    requires: [{ upgradeId: 'gentle_palm', level: 10 }],
  },
  {
    id: 'critical_mastery', name: 'Critical Mastery', category: 'snootArts',
    description: '+2x crit multiplier per level',
    baseCost: 2500, costMultiplier: 1.35, maxLevel: 15,
    effect: { type: 'critMultiplier', baseValue: 2.0, perLevel: 2.0 },
    requires: [{ upgradeId: 'critical_meridian_strike', level: 5 }],
  },
  {
    id: 'qi_aura_projection', name: 'Qi Aura Projection', category: 'snootArts',
    description: '+0.1 auto-boops/sec per level',
    baseCost: 10000, costMultiplier: 1.5, maxLevel: 10,
    effect: { type: 'autoBoopRate', baseValue: 0.1, perLevel: 0.1 },
    requires: [{ upgradeId: 'twin_dragon_fingers', level: 10 }],
  },
  {
    id: 'heaven_sundering_boop', name: 'Heaven-Sundering Boop', category: 'snootArts',
    description: '+100% mega-boop damage per level',
    baseCost: 100000, costMultiplier: 2.0, maxLevel: 5,
    effect: { type: 'megaBoopMultiplier', baseValue: 1.0, perLevel: 1.0 },
    requires: [
      { upgradeId: 'qi_aura_projection', level: 5 },
      { upgradeId: 'critical_mastery', level: 10 },
    ],
  },

  // ─── Inner Cultivation ───────────────────────────────
  {
    id: 'iron_fur_body', name: 'Iron Fur Body', category: 'innerCultivation',
    description: '-5% happiness decay per level',
    baseCost: 200, costMultiplier: 1.2, maxLevel: 20,
    effect: { type: 'happinessDecayReduction', baseValue: 0.05, perLevel: 0.05 },
  },
  {
    id: 'qi_circulation', name: 'Qi Circulation', category: 'innerCultivation',
    description: '+10% PP multiplier per level',
    baseCost: 100, costMultiplier: 1.12, maxLevel: 50,
    effect: { type: 'ppMultiplier', baseValue: 0.1, perLevel: 0.1 },
  },
  {
    id: 'lightness_cat', name: 'Lightness Cat', category: 'innerCultivation',
    description: '+5% event chance per level',
    baseCost: 750, costMultiplier: 1.25, maxLevel: 15,
    effect: { type: 'eventChanceBonus', baseValue: 0.05, perLevel: 0.05 },
    requires: [{ upgradeId: 'qi_circulation', level: 5 }],
  },
  {
    id: 'eternal_slumber', name: 'Eternal Slumber', category: 'innerCultivation',
    description: '+20% AFK multiplier per level',
    baseCost: 2000, costMultiplier: 1.3, maxLevel: 25,
    effect: { type: 'afkMultiplier', baseValue: 0.2, perLevel: 0.2 },
    requires: [{ upgradeId: 'qi_circulation', level: 10 }],
  },
  {
    id: 'one_with_snoot', name: 'One With Snoot', category: 'innerCultivation',
    description: '+1 passive BP/sec per level',
    baseCost: 5000, costMultiplier: 1.4, maxLevel: 20,
    effect: { type: 'passiveBpPerSecond', baseValue: 1, perLevel: 1 },
    requires: [{ upgradeId: 'eternal_slumber', level: 10 }],
  },

  // ─── Sect Facilities ─────────────────────────────────
  {
    id: 'cat_pagoda', name: 'Cat Pagoda', category: 'sectFacilities',
    description: '+5 cat capacity per level',
    baseCost: 500, costMultiplier: 1.5, maxLevel: 10,
    effect: { type: 'catCapacity', baseValue: 5, perLevel: 5 },
  },
  {
    id: 'scratching_pillars', name: 'Scratching Pillars', category: 'sectFacilities',
    description: '+1% happiness gain/min per level',
    baseCost: 300, costMultiplier: 1.25, maxLevel: 15,
    effect: { type: 'happinessGain', baseValue: 0.01, perLevel: 0.01 },
  },
  {
    id: 'sunny_window_perches', name: 'Sunny Window Perches', category: 'sectFacilities',
    description: '+0.5 passive BP/sec per level',
    baseCost: 1000, costMultiplier: 1.3, maxLevel: 20,
    effect: { type: 'passiveBpPerSecond', baseValue: 0.5, perLevel: 0.5 },
    requires: [{ upgradeId: 'cat_pagoda', level: 3 }],
  },
  {
    id: 'heated_meditation_mats', name: 'Heated Meditation Mats', category: 'sectFacilities',
    description: '+10% AFK multiplier per level',
    baseCost: 1500, costMultiplier: 1.35, maxLevel: 15,
    effect: { type: 'afkMultiplier', baseValue: 0.1, perLevel: 0.1 },
    requires: [{ upgradeId: 'cat_pagoda', level: 5 }],
  },
  {
    id: 'sacred_cardboard_boxes', name: 'Sacred Cardboard Boxes', category: 'sectFacilities',
    description: '+25% PP multiplier per level',
    baseCost: 5000, costMultiplier: 1.5, maxLevel: 10,
    effect: { type: 'ppMultiplier', baseValue: 0.25, perLevel: 0.25 },
    requires: [{ upgradeId: 'scratching_pillars', level: 10 }],
  },
  {
    id: 'jade_laser_array', name: 'Jade Laser Array', category: 'sectFacilities',
    description: '+0.5 auto-boops/sec per level',
    baseCost: 25000, costMultiplier: 1.75, maxLevel: 10,
    effect: { type: 'autoBoopRate', baseValue: 0.5, perLevel: 0.5 },
    requires: [
      { upgradeId: 'sunny_window_perches', level: 10 },
      { upgradeId: 'sacred_cardboard_boxes', level: 5 },
    ],
  },
];

// ─── Upgrade System Class ──────────────────────────────────

export class UpgradeSystem {
  private purchasedUpgrades: Record<string, number> = {};

  getLevel(upgradeId: string): number {
    return this.purchasedUpgrades[upgradeId] ?? 0;
  }

  /**
   * Get the BP cost for the next level of an upgrade.
   */
  getCost(upgradeId: string): number {
    const template = UPGRADE_TEMPLATES.find((t) => t.id === upgradeId);
    if (!template) return Infinity;

    const currentLevel = this.getLevel(upgradeId);
    if (currentLevel >= template.maxLevel) return Infinity;

    return Math.floor(template.baseCost * Math.pow(template.costMultiplier, currentLevel));
  }

  /**
   * Check if an upgrade can be purchased.
   */
  canPurchase(upgradeId: string, currentBP: number): boolean {
    const template = UPGRADE_TEMPLATES.find((t) => t.id === upgradeId);
    if (!template) return false;

    const currentLevel = this.getLevel(upgradeId);
    if (currentLevel >= template.maxLevel) return false;

    // Check cost
    if (currentBP < this.getCost(upgradeId)) return false;

    // Check prerequisites
    if (template.requires) {
      for (const req of template.requires) {
        if (this.getLevel(req.upgradeId) < req.level) return false;
      }
    }

    return true;
  }

  /**
   * Purchase an upgrade. Returns the cost spent, or 0 if failed.
   */
  purchase(upgradeId: string): number {
    const cost = this.getCost(upgradeId);
    if (cost === Infinity) return 0;

    this.purchasedUpgrades[upgradeId] = this.getLevel(upgradeId) + 1;
    return cost;
  }

  /**
   * Get the current effect value for an upgrade.
   */
  getEffectValue(upgradeId: string): number {
    const template = UPGRADE_TEMPLATES.find((t) => t.id === upgradeId);
    if (!template) return 0;

    const level = this.getLevel(upgradeId);
    if (level === 0) return 0;

    return template.effect.baseValue + template.effect.perLevel * (level - 1);
  }

  /**
   * Get combined effects from all purchased upgrades.
   */
  getCombinedEffects(): CombinedUpgradeEffects {
    const effects: CombinedUpgradeEffects = {
      bpPerBoop: 0,
      bpMultiplier: 1,
      ppMultiplier: 1,
      afkMultiplier: 1,
      critChance: 0,
      critMultiplier: 0,
      autoBoopRate: 0,
      passiveBpPerSecond: 0,
      catCapacity: 10, // base capacity
      happinessDecayReduction: 0,
      happinessGain: 0,
      eventChanceBonus: 0,
      megaBoopMultiplier: 1,
    };

    for (const template of UPGRADE_TEMPLATES) {
      const level = this.getLevel(template.id);
      if (level === 0) continue;

      const value = template.effect.baseValue + template.effect.perLevel * (level - 1);

      switch (template.effect.type) {
        case 'bpPerBoop':
          effects.bpPerBoop += value;
          break;
        case 'bpMultiplier':
          effects.bpMultiplier += value; // additive stacking
          break;
        case 'ppMultiplier':
          effects.ppMultiplier += value;
          break;
        case 'afkMultiplier':
          effects.afkMultiplier += value;
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
          effects.catCapacity += value;
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
   * Get upgrades filtered by category.
   */
  getUpgradesByCategory(categoryId: string): UpgradeTemplate[] {
    return UPGRADE_TEMPLATES.filter((t) => t.category === categoryId);
  }

  /**
   * Check if all basic upgrades are at level 5+.
   */
  areAllBasicUpgradesPurchased(): boolean {
    const basics = ['gentle_palm', 'qi_circulation', 'iron_fur_body', 'cat_pagoda'];
    return basics.every((id) => this.getLevel(id) >= 5);
  }

  /**
   * Reset all upgrades (for prestige).
   */
  reset(): void {
    this.purchasedUpgrades = {};
  }

  /**
   * Directly set a level (used by prestige perks).
   */
  setLevel(upgradeId: string, level: number): void {
    this.purchasedUpgrades[upgradeId] = level;
  }

  serialize(): { upgrades: Record<string, number> } {
    return { upgrades: { ...this.purchasedUpgrades } };
  }

  deserialize(data: { upgrades?: Record<string, number>; purchasedUpgrades?: Record<string, number> }): void {
    this.purchasedUpgrades = { ...(data.upgrades ?? data.purchasedUpgrades ?? {}) };
  }
}
