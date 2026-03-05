/**
 * ParasiteSystem - Cookie Clicker wrinkler-style parasites
 * Ported from js/parasites.js
 * "These little pests drain your Qi... but perhaps that's not all bad."
 */

// ─── Types ──────────────────────────────────────────────────

export interface ParasiteTypeData {
  id: string;
  name: string;
  color: string;
  drainPercent: number;     // fraction of production drained per second
  returnMultiplier: number; // multiplier on stored when popped
  spawnWeight: number;
  description: string;
  isElder?: boolean;
  bonusMaterials?: boolean;
  drainsPP?: boolean;       // drains PP instead of BP
}

export interface ParasiteUpgradeTemplate {
  id: string;
  name: string;
  description: string;
  costPerLevel: (level: number) => number;
  maxLevel: number;
}

export interface ParasitePosition {
  angle: number;
  distance: number;
  wiggle: number;
}

export interface ActiveParasite {
  id: string;
  typeId: string;
  storedAmount: number;
  totalDrained: number;
  spawnedAt: number;
  position: ParasitePosition;
}

export interface PopResult {
  parasiteId: string;
  typeId: string;
  returnAmount: number;
  returnType: 'bp' | 'pp';
  bonusMaterials: boolean;
  storedAmount: number;
}

export interface ParasiteStats {
  totalPopped: number;
  totalDrained: number;
  totalReturned: number;
  eldersPopped: number;
  materialsFromShinies: number;
}

export interface ParasiteSerializedData {
  parasites: Array<{
    id: string;
    typeId: string;
    storedAmount: number;
    totalDrained: number;
    spawnedAt: number;
    position: ParasitePosition;
  }>;
  upgrades: Record<string, number>;
  stats: ParasiteStats;
  lastSpawnCheck: number;
}

// ─── Data ───────────────────────────────────────────────────

export const PARASITE_TYPES: Record<string, ParasiteTypeData> = {
  wrinkler: {
    id: 'wrinkler',
    name: 'Qi Wrinkler',
    color: '#8B4513',
    drainPercent: 0.02,
    returnMultiplier: 1.1,
    spawnWeight: 70,
    description: 'A common parasite that siphons your Qi.',
  },
  chonkler: {
    id: 'chonkler',
    name: 'Chonkler',
    color: '#228B22',
    drainPercent: 0.05,
    returnMultiplier: 1.15,
    spawnWeight: 20,
    description: 'A rotund parasite with a bigger appetite.',
  },
  elder_wrinkler: {
    id: 'elder_wrinkler',
    name: 'Elder Wrinkler',
    color: '#4B0082',
    drainPercent: 0.03,
    returnMultiplier: 1.5,
    spawnWeight: 5,
    description: 'An ancient parasite that stores Qi more efficiently.',
    isElder: true,
  },
  shiny_wrinkler: {
    id: 'shiny_wrinkler',
    name: 'Shiny Wrinkler',
    color: '#FFD700',
    drainPercent: 0.02,
    returnMultiplier: 1.1,
    spawnWeight: 4,
    description: 'A rare glittering parasite that drops materials.',
    bonusMaterials: true,
  },
  void_wrinkler: {
    id: 'void_wrinkler',
    name: 'Void Wrinkler',
    color: '#1a1a2e',
    drainPercent: 0.04,
    returnMultiplier: 1.25,
    spawnWeight: 8,
    description: 'A shadowy parasite that feeds on Purr Power instead.',
    drainsPP: true,
  },
};

export const PARASITE_UPGRADES: Record<string, ParasiteUpgradeTemplate> = {
  faster_spawn: {
    id: 'faster_spawn',
    name: 'Pheromone Trail',
    description: 'Parasites spawn 20% faster per level',
    costPerLevel: (lvl) => 10 * (lvl + 1),
    maxLevel: 5,
  },
  better_return: {
    id: 'better_return',
    name: 'Qi Fermentation',
    description: '+5% return multiplier per level',
    costPerLevel: (lvl) => 15 * (lvl + 1),
    maxLevel: 10,
  },
  elder_chance: {
    id: 'elder_chance',
    name: 'Ancient Attractor',
    description: '+2% chance for Elder parasites per level',
    costPerLevel: (lvl) => 25 * (lvl + 1),
    maxLevel: 5,
  },
  max_parasites: {
    id: 'max_parasites',
    name: 'Expanded Habitat',
    description: '+2 maximum parasites per level',
    costPerLevel: (lvl) => 20 * (lvl + 1),
    maxLevel: 5,
  },
  auto_pop: {
    id: 'auto_pop',
    name: 'Auto-Harvester',
    description: 'Automatically pop parasites at 1M stored',
    costPerLevel: (_lvl) => 50,
    maxLevel: 1,
  },
};

// ─── ParasiteSystem Class ───────────────────────────────────

const AUTO_POP_THRESHOLD = 1_000_000;
const BASE_SPAWN_INTERVAL = 120_000; // 2 minutes
const BASE_SPAWN_CHANCE = 0.3;
const BASE_MAX_PARASITES = 10;

export class ParasiteSystem {
  parasites: ActiveParasite[] = [];
  upgrades: Record<string, number> = {};
  stats: ParasiteStats = {
    totalPopped: 0,
    totalDrained: 0,
    totalReturned: 0,
    eldersPopped: 0,
    materialsFromShinies: 0,
  };
  lastSpawnCheck = 0;

  constructor() {
    // Initialise all upgrade levels to 0
    for (const id of Object.keys(PARASITE_UPGRADES)) {
      this.upgrades[id] = 0;
    }
  }

  // ── Core Update ─────────────────────────────────────────────

  /**
   * Main tick.  Call every game-loop frame.
   * @param deltaMs        ms since last tick
   * @param currentBpRate  current BP produced per second (before drain)
   * @param currentPpRate  current PP produced per second (before drain)
   * @returns  Array of auto-pop results (empty most ticks)
   */
  update(deltaMs: number, currentBpRate: number, currentPpRate: number): PopResult[] {
    const autoPopResults: PopResult[] = [];
    const now = Date.now();

    // ── Spawn Check ──────────────────────────────────────────
    if (now - this.lastSpawnCheck >= this.getSpawnInterval()) {
      if (Math.random() < BASE_SPAWN_CHANCE && this.parasites.length < this.getMaxParasites()) {
        this.spawnParasite();
      }
      this.lastSpawnCheck = now;
    }

    // ── Drain & Auto-pop ─────────────────────────────────────
    const autoPopThreshold = this.getAutoPopThreshold();

    for (let i = this.parasites.length - 1; i >= 0; i--) {
      const p = this.parasites[i];
      const typeData = PARASITE_TYPES[p.typeId];
      if (!typeData) continue;

      const rate = typeData.drainsPP ? currentPpRate : currentBpRate;
      const drainAmount = rate * typeData.drainPercent * (deltaMs / 1000);

      p.storedAmount += drainAmount;
      p.totalDrained += drainAmount;
      this.stats.totalDrained += drainAmount;

      // Auto-pop check
      if (autoPopThreshold > 0 && p.storedAmount >= autoPopThreshold) {
        const result = this.popParasiteByIndex(i);
        if (result) autoPopResults.push(result);
      }
    }

    return autoPopResults;
  }

  // ── Spawning ────────────────────────────────────────────────

  /**
   * Spawn a weighted-random parasite.  Returns null if at capacity.
   */
  spawnParasite(): ActiveParasite | null {
    if (this.parasites.length >= this.getMaxParasites()) return null;

    const typeData = this.pickWeightedType();
    if (!typeData) return null;

    const parasite: ActiveParasite = {
      id: `parasite_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      typeId: typeData.id,
      storedAmount: 0,
      totalDrained: 0,
      spawnedAt: Date.now(),
      position: this.randomPosition(),
    };

    this.parasites.push(parasite);
    return parasite;
  }

  private pickWeightedType(): ParasiteTypeData | null {
    const elderBonus = (this.upgrades.elder_chance ?? 0) * 0.02;
    let totalWeight = 0;
    const entries: Array<{ type: ParasiteTypeData; weight: number }> = [];

    for (const type of Object.values(PARASITE_TYPES)) {
      let w = type.spawnWeight;
      if (type.isElder) w += elderBonus * 100;
      totalWeight += w;
      entries.push({ type, weight: w });
    }

    let roll = Math.random() * totalWeight;
    for (const { type, weight } of entries) {
      roll -= weight;
      if (roll <= 0) return type;
    }

    return entries[0]?.type ?? null;
  }

  private randomPosition(): ParasitePosition {
    return {
      angle: Math.random() * Math.PI * 2,
      distance: 80 + Math.random() * 40,
      wiggle: Math.random() * Math.PI * 2,
    };
  }

  // ── Popping ─────────────────────────────────────────────────

  /**
   * Pop (harvest) a single parasite by id.
   */
  popParasite(parasiteId: string): PopResult | null {
    const idx = this.parasites.findIndex(p => p.id === parasiteId);
    if (idx < 0) return null;
    return this.popParasiteByIndex(idx);
  }

  private popParasiteByIndex(index: number): PopResult | null {
    const p = this.parasites[index];
    if (!p) return null;

    this.parasites.splice(index, 1);

    const typeData = PARASITE_TYPES[p.typeId];
    if (!typeData) return null;

    let returnMult = typeData.returnMultiplier;
    returnMult += (this.upgrades.better_return ?? 0) * 0.05;

    const returnAmount = p.storedAmount * returnMult;

    this.stats.totalPopped++;
    this.stats.totalReturned += returnAmount;
    if (typeData.isElder) this.stats.eldersPopped++;
    if (typeData.bonusMaterials) this.stats.materialsFromShinies++;

    return {
      parasiteId: p.id,
      typeId: p.typeId,
      returnAmount,
      returnType: typeData.drainsPP ? 'pp' : 'bp',
      bonusMaterials: !!typeData.bonusMaterials,
      storedAmount: p.storedAmount,
    };
  }

  /**
   * Pop every active parasite.  Returns aggregated results.
   */
  popAllParasites(): PopResult[] {
    const results: PopResult[] = [];
    // Pop from end to avoid index shifting issues
    for (let i = this.parasites.length - 1; i >= 0; i--) {
      const r = this.popParasiteByIndex(i);
      if (r) results.push(r);
    }
    return results;
  }

  // ── Drain Queries ───────────────────────────────────────────

  /**
   * Sum of drain percents for the given resource type across all active parasites.
   */
  getTotalDrainRate(type: 'bp' | 'pp'): number {
    let total = 0;
    for (const p of this.parasites) {
      const td = PARASITE_TYPES[p.typeId];
      if (!td) continue;
      const drainsBP = !td.drainsPP;
      if ((type === 'bp' && drainsBP) || (type === 'pp' && td.drainsPP)) {
        total += td.drainPercent;
      }
    }
    return total;
  }

  /**
   * Returns base production reduced by parasite drain (capped at 100%).
   */
  getEffectiveProduction(base: number, type: 'bp' | 'pp'): number {
    const drain = Math.min(this.getTotalDrainRate(type), 1);
    return base * (1 - drain);
  }

  /**
   * Total resources stored across all parasites.
   */
  getTotalStored(): number {
    return this.parasites.reduce((sum, p) => sum + p.storedAmount, 0);
  }

  /**
   * Potential return if all parasites were popped right now.
   */
  getPotentialReturn(): number {
    let total = 0;
    const returnBonus = (this.upgrades.better_return ?? 0) * 0.05;
    for (const p of this.parasites) {
      const td = PARASITE_TYPES[p.typeId];
      if (!td) continue;
      total += p.storedAmount * (td.returnMultiplier + returnBonus);
    }
    return total;
  }

  // ── Upgrades ────────────────────────────────────────────────

  /**
   * Attempt to purchase an upgrade level.
   * @returns  cost paid, or null if purchase failed
   */
  purchaseUpgrade(upgradeId: string): number | null {
    const template = PARASITE_UPGRADES[upgradeId];
    if (!template) return null;

    const currentLevel = this.upgrades[upgradeId] ?? 0;
    if (currentLevel >= template.maxLevel) return null;

    const cost = template.costPerLevel(currentLevel);
    // Caller is responsible for currency check; we just record the level.
    // Return cost so caller can deduct.
    this.upgrades[upgradeId] = currentLevel + 1;
    return cost;
  }

  /**
   * Get the cost of the next level of an upgrade, or null if maxed.
   */
  getUpgradeCost(upgradeId: string): number | null {
    const template = PARASITE_UPGRADES[upgradeId];
    if (!template) return null;
    const currentLevel = this.upgrades[upgradeId] ?? 0;
    if (currentLevel >= template.maxLevel) return null;
    return template.costPerLevel(currentLevel);
  }

  // ── Derived Config ──────────────────────────────────────────

  getSpawnInterval(): number {
    const mult = Math.pow(0.8, this.upgrades.faster_spawn ?? 0);
    return BASE_SPAWN_INTERVAL * mult;
  }

  getMaxParasites(): number {
    return BASE_MAX_PARASITES + (this.upgrades.max_parasites ?? 0) * 2;
  }

  private getAutoPopThreshold(): number {
    return (this.upgrades.auto_pop ?? 0) > 0 ? AUTO_POP_THRESHOLD : 0;
  }

  // ── Utility ─────────────────────────────────────────────────

  getParasiteCountByType(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const p of this.parasites) {
      counts[p.typeId] = (counts[p.typeId] ?? 0) + 1;
    }
    return counts;
  }

  /**
   * Force-spawn a parasite (for testing / debug).
   */
  forceSpawn(typeId?: string): ActiveParasite | null {
    if (this.parasites.length >= this.getMaxParasites()) return null;

    const typeData = typeId && PARASITE_TYPES[typeId]
      ? PARASITE_TYPES[typeId]
      : this.pickWeightedType();

    if (!typeData) return null;

    const parasite: ActiveParasite = {
      id: `parasite_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      typeId: typeData.id,
      storedAmount: 0,
      totalDrained: 0,
      spawnedAt: Date.now(),
      position: this.randomPosition(),
    };

    this.parasites.push(parasite);
    return parasite;
  }

  // ── Serialization ───────────────────────────────────────────

  serialize(): ParasiteSerializedData {
    return {
      parasites: this.parasites.map(p => ({
        id: p.id,
        typeId: p.typeId,
        storedAmount: p.storedAmount,
        totalDrained: p.totalDrained,
        spawnedAt: p.spawnedAt,
        position: p.position,
      })),
      upgrades: { ...this.upgrades },
      stats: { ...this.stats },
      lastSpawnCheck: this.lastSpawnCheck,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    const d = data as Partial<ParasiteSerializedData>;

    if (d.parasites) {
      this.parasites = d.parasites
        .filter(p => PARASITE_TYPES[p.typeId]) // skip invalid types
        .map(p => ({
          id: p.id,
          typeId: p.typeId,
          storedAmount: p.storedAmount,
          totalDrained: p.totalDrained,
          spawnedAt: p.spawnedAt,
          position: p.position,
        }));
    }

    if (d.upgrades) {
      this.upgrades = { ...this.upgrades, ...d.upgrades };
    }

    if (d.stats) {
      this.stats = { ...this.stats, ...d.stats };
    }

    if (typeof d.lastSpawnCheck === 'number') {
      this.lastSpawnCheck = d.lastSpawnCheck;
    }
  }

  /**
   * Full reset (e.g. on prestige / ascension).
   */
  reset(): void {
    this.parasites = [];
    this.lastSpawnCheck = 0;
    for (const id of Object.keys(PARASITE_UPGRADES)) {
      this.upgrades[id] = 0;
    }
    this.stats = {
      totalPopped: 0,
      totalDrained: 0,
      totalReturned: 0,
      eldersPopped: 0,
      materialsFromShinies: 0,
    };
  }
}
