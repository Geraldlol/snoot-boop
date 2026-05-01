/**
 * BuildingSystem - Sect buildings, territories, persistent bonuses
 * Ported from js/buildings.js (~900 lines)
 */

import type { TerritoryId } from '../../types';

// ─── Territory Data ─────────────────────────────────────────

export interface TerritoryData {
  id: TerritoryId;
  name: string;
  catCapacity: number;
  buildingSlots: number;
  theme: string;
  cost: number;
  bonuses: Record<string, number>;
}

export const TERRITORIES: Record<TerritoryId, TerritoryData> = {
  humble_courtyard: { id: 'humble_courtyard', name: 'Humble Courtyard', catCapacity: 10, buildingSlots: 3, theme: 'starter', cost: 0, bonuses: {} },
  mountain_sanctuary: { id: 'mountain_sanctuary', name: 'Mountain Sanctuary', catCapacity: 30, buildingSlots: 6, theme: 'mountain', cost: 1000000, bonuses: { ppMult: 1.1, meditationBonus: 1.25 } },
  floating_palace: { id: 'floating_palace', name: 'Floating Palace', catCapacity: 75, buildingSlots: 9, theme: 'sky', cost: 50000000, bonuses: { ppMult: 1.25, bpMult: 1.15, afkMult: 1.2 } },
  celestial_realm: { id: 'celestial_realm', name: 'Celestial Realm', catCapacity: 200, buildingSlots: 12, theme: 'divine', cost: 1000000000, bonuses: { ppMult: 1.5, bpMult: 1.5, afkMult: 1.5, allStats: 1.2 } },
};

// ─── Building Data ──────────────────────────────────────────

export interface BuildingData {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'production' | 'social' | 'utility' | 'special';
  baseCost: number;
  costScale: number;
  maxLevel: number;
  effect: (level: number) => Record<string, number | boolean>;
  unlockCondition?: { type: string; value: number | string | boolean };
}

export const BUILDINGS: Record<string, BuildingData> = {
  cat_pagoda: {
    id: 'cat_pagoda', name: 'Cat Pagoda', description: '+10 cat capacity per level',
    category: 'core', baseCost: 10000, costScale: 1.5, maxLevel: 10,
    effect: (level) => ({ catCapacity: level * 10 }),
  },
  meditation_garden: {
    id: 'meditation_garden', name: 'Meditation Garden', description: '+25% PP generation per level',
    category: 'core', baseCost: 50000, costScale: 2.0, maxLevel: 10,
    effect: (level) => ({ idlePPBonus: 0.25 * level }),
  },
  training_dojo: {
    id: 'training_dojo', name: 'Training Dojo', description: 'Cats gain training XP over time',
    category: 'core', baseCost: 100000, costScale: 2.0, maxLevel: 10,
    effect: (level) => ({ catExpPerHour: 240 * level }),
  },
  treasury_vault: {
    id: 'treasury_vault', name: 'Treasury Vault', description: 'Passive BP generation',
    category: 'production', baseCost: 1000000, costScale: 2.5, maxLevel: 10,
    effect: (level) => ({ passiveBpPerSecond: Math.floor(100 * Math.pow(level, 1.5)) }),
  },
  alchemy_lab: {
    id: 'alchemy_lab', name: 'Alchemy Lab', description: 'Unlock crafting recipes',
    category: 'production', baseCost: 250000, costScale: 2.0, maxLevel: 10,
    effect: (level) => ({ craftingSpeed: 1 + level * 0.1, recipeSlots: level }),
  },
  library: {
    id: 'library', name: 'Library', description: '+10% event discovery and lore drops per level',
    category: 'production', baseCost: 500000, costScale: 2.0, maxLevel: 10,
    effect: (level) => ({ eventDiscoveryBonus: 0.1 * level, loreDropBonus: 1 + level * 0.1 }),
  },
  spirit_mine: {
    id: 'spirit_mine', name: 'Spirit Mine', description: 'Generate spirit stones',
    category: 'production', baseCost: 750000, costScale: 2.0, maxLevel: 10,
    effect: (level) => ({ spiritStonesPerHour: level * 60 }),
  },
  waifu_quarters: {
    id: 'waifu_quarters', name: 'Waifu Quarters', description: '+8% companion bond gain per level',
    category: 'social', baseCost: 200000, costScale: 2.5, maxLevel: 10,
    effect: (level) => ({ bondGainBonus: 1 + level * 0.08 }),
  },
  hot_springs: {
    id: 'hot_springs', name: 'Hot Springs', description: 'Happiness regen + bond bonus',
    category: 'social', baseCost: 750000, costScale: 3.0, maxLevel: 5,
    effect: (level) => ({ happinessRegen: level * 2, bondActivityBonus: 1 + level * 0.1 }),
  },
  celestial_kitchen: {
    id: 'celestial_kitchen', name: 'Celestial Kitchen', description: 'Auto-feed cats, reduce decay',
    category: 'utility', baseCost: 500000, costScale: 2.0, maxLevel: 10,
    effect: (level) => ({ autoFeed: level >= 1, happinessDecayReduction: 0.05 * level }),
  },
  goose_watchtower: {
    id: 'goose_watchtower', name: 'Goose Watchtower', description: '+5% goose spawn rate',
    category: 'utility', baseCost: 250000, costScale: 2.0, maxLevel: 10,
    effect: (level) => ({ gooseSpawnBonus: 0.05 * level, gooseWarning: level >= 1 }),
  },
  observatory: {
    id: 'observatory', name: 'Observatory', description: '+15% event discovery per level, stronger at night',
    category: 'utility', baseCost: 1500000, costScale: 3.0, maxLevel: 5,
    effect: (level) => ({ eventDiscoveryBonus: 0.15 * level, nightBonus: 1 + level * 0.1 }),
  },
  hall_of_legends: {
    id: 'hall_of_legends', name: 'Hall of Legends', description: '+10% BP from visitor offerings per level',
    category: 'special', baseCost: 3000000, costScale: 3.0, maxLevel: 5,
    effect: (level) => ({ achievementDisplay: level >= 1, visitorBonus: 1 + level * 0.1 }),
  },
  pagoda_entrance: {
    id: 'pagoda_entrance', name: 'Pagoda Entrance', description: 'Dungeon cooldowns and relic storage',
    category: 'special', baseCost: 5000000, costScale: 3.0, maxLevel: 5,
    effect: (level) => ({ dungeonPrepReduction: 0.1 * level, relicStorage: level * 2 }),
  },
};

// ─── BuildingSystem Class ──────────────────────────────────

export class BuildingSystem {
  private buildings: Record<string, number> = {};
  private currentTerritory: TerritoryId = 'humble_courtyard';
  private unlockedTerritories: TerritoryId[] = ['humble_courtyard'];
  private cachedEffects: Record<string, number | boolean> = {};

  private stats = {
    totalBuilt: 0,
    totalUpgrades: 0,
    highestBuildingLevel: 0,
    bpSpentOnBuildings: 0,
  };

  // ── Cost Calculation ──────────────────────────────────

  getBuildingCost(buildingId: string): number {
    const building = BUILDINGS[buildingId];
    if (!building) return Infinity;
    const level = this.buildings[buildingId] ?? 0;
    return Math.floor(building.baseCost * Math.pow(building.costScale, level));
  }

  // ── Building ──────────────────────────────────────────

  canBuild(buildingId: string, currentBP: number): boolean {
    const building = BUILDINGS[buildingId];
    if (!building) return false;
    const level = this.buildings[buildingId] ?? 0;
    if (level >= building.maxLevel) return false;
    if (this.getUsedSlots() >= this.getAvailableSlots() && level === 0) return false;
    return currentBP >= this.getBuildingCost(buildingId);
  }

  build(buildingId: string): number {
    const building = BUILDINGS[buildingId];
    if (!building) return 0;

    const level = this.buildings[buildingId] ?? 0;
    if (level >= building.maxLevel) return 0;

    const cost = this.getBuildingCost(buildingId);
    this.buildings[buildingId] = level + 1;

    if (level === 0) this.stats.totalBuilt++;
    this.stats.totalUpgrades++;
    this.stats.highestBuildingLevel = Math.max(this.stats.highestBuildingLevel, level + 1);
    this.stats.bpSpentOnBuildings += cost;

    this.recalculateEffects();
    return cost;
  }

  getBuildingLevel(buildingId: string): number {
    return this.buildings[buildingId] ?? 0;
  }

  // ── Territory ─────────────────────────────────────────

  canUnlockTerritory(territoryId: TerritoryId, currentBP: number): boolean {
    if (this.unlockedTerritories.includes(territoryId)) return false;
    const territory = TERRITORIES[territoryId];
    return currentBP >= territory.cost;
  }

  unlockTerritory(territoryId: TerritoryId): number {
    if (this.unlockedTerritories.includes(territoryId)) return 0;
    const territory = TERRITORIES[territoryId];
    this.unlockedTerritories.push(territoryId);
    this.currentTerritory = territoryId;
    this.recalculateEffects();
    return territory.cost;
  }

  getCurrentTerritory(): TerritoryData {
    return TERRITORIES[this.currentTerritory];
  }

  getUnlockedTerritories(): TerritoryId[] {
    return [...this.unlockedTerritories];
  }

  // ── Effects ───────────────────────────────────────────

  private recalculateEffects(): void {
    const effects: Record<string, number | boolean> = {};

    // Building effects
    for (const [buildingId, level] of Object.entries(this.buildings)) {
      if (level <= 0) continue;
      const building = BUILDINGS[buildingId];
      if (!building) continue;
      const buildingEffects = building.effect(level);
      for (const [key, value] of Object.entries(buildingEffects)) {
        if (typeof value === 'boolean') {
          effects[key] = value;
        } else {
          effects[key] = ((effects[key] as number) ?? 0) + value;
        }
      }
    }

    // Territory bonuses
    const territory = TERRITORIES[this.currentTerritory];
    for (const [key, value] of Object.entries(territory.bonuses)) {
      effects[key] = ((effects[key] as number) ?? 1) * value;
    }

    this.cachedEffects = effects;
  }

  getCombinedEffects(): Record<string, number | boolean> {
    return { ...this.cachedEffects };
  }

  getTotalCatCapacity(): number {
    const territory = TERRITORIES[this.currentTerritory];
    const buildingCap = (this.cachedEffects.catCapacity as number) ?? 0;
    return territory.catCapacity + buildingCap;
  }

  getAvailableSlots(): number {
    return TERRITORIES[this.currentTerritory].buildingSlots;
  }

  getUsedSlots(): number {
    return Object.values(this.buildings).filter(l => l > 0).length;
  }

  // ── Queries ───────────────────────────────────────────

  getAllBuildings(): { id: string; data: BuildingData; level: number; cost: number }[] {
    return Object.values(BUILDINGS).map(b => ({
      id: b.id,
      data: b,
      level: this.buildings[b.id] ?? 0,
      cost: this.getBuildingCost(b.id),
    }));
  }

  getBuildingsByCategory(category: string): { id: string; data: BuildingData; level: number }[] {
    return Object.values(BUILDINGS)
      .filter(b => b.category === category)
      .map(b => ({ id: b.id, data: b, level: this.buildings[b.id] ?? 0 }));
  }

  // ── Serialization ─────────────────────────────────────

  serialize() {
    return {
      buildings: { ...this.buildings },
      currentTerritory: this.currentTerritory,
      unlockedTerritories: [...this.unlockedTerritories],
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.buildings) {
      this.buildings = data.buildings as Record<string, number>;
    }
    if (data.currentTerritory) {
      this.currentTerritory = data.currentTerritory as TerritoryId;
    }
    if (data.unlockedTerritories) {
      this.unlockedTerritories = data.unlockedTerritories as TerritoryId[];
    }
    this.recalculateEffects();
  }
}
