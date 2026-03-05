/**
 * PrestigeSystem - 3-tier prestige: Rebirth, Reincarnation, Transcendence
 * Ported from js/prestige.js (~1,500 lines)
 */

import type { CultivationRealm } from '../../types';

// ─── Tier 1: Rebirth ───────────────────────────────────────

export interface RebirthTier {
  tier: number;
  name: string;
  title: string;
  bpRequired: number;
  multiplier: number;
  perks: string[];
}

export const REBIRTH_TIERS: RebirthTier[] = [
  { tier: 1, name: 'Qi Condensation', title: 'Awakened', bpRequired: 100000, multiplier: 1.1, perks: ['second_expedition_slot'] },
  { tier: 2, name: 'Foundation Establishment', title: 'Foundation Builder', bpRequired: 500000, multiplier: 1.25, perks: ['auto_boop_boost'] },
  { tier: 3, name: 'Core Formation', title: 'Core Disciple', bpRequired: 2000000, multiplier: 1.5, perks: ['starting_cats', 'master_switch'] },
  { tier: 4, name: 'Nascent Soul', title: 'Soul Cultivator', bpRequired: 10000000, multiplier: 2.0, perks: ['starting_pp', 'jade_dot_boost'] },
  { tier: 5, name: 'Spirit Severing', title: 'Spirit Severer', bpRequired: 50000000, multiplier: 3.0, perks: ['starting_upgrades'] },
  { tier: 6, name: 'Dao Seeking', title: 'Dao Seeker', bpRequired: 200000000, multiplier: 5.0, perks: ['waifu_bond_retain', 'goose_ally_boost'] },
  { tier: 7, name: 'Immortal Ascension', title: 'Immortal', bpRequired: 1000000000, multiplier: 10.0, perks: ['immortal_bonuses', 'all_waifus'] },
];

// ─── Tier 2: Karma Shop ────────────────────────────────────

export interface KarmaShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxPurchases: number;
  effect: Record<string, number | boolean | string>;
}

export const KARMA_SHOP: KarmaShopItem[] = [
  { id: 'karma_start_cats', name: 'Feline Legacy', description: '+5 starting cats', cost: 10, maxPurchases: 10, effect: { startingCats: 5 } },
  { id: 'karma_start_bp', name: 'Inherited Wealth', description: '+100K starting BP', cost: 5, maxPurchases: 20, effect: { startingBP: 100000 } },
  { id: 'karma_start_pp', name: 'Ancestral Wisdom', description: '+5K starting PP', cost: 8, maxPurchases: 10, effect: { startingPP: 5000 } },
  { id: 'karma_start_realm', name: 'Reborn Cultivator', description: 'Start at Qi Condensation', cost: 50, maxPurchases: 1, effect: { startingRealm: 'qi_condensation' } },
  { id: 'karma_production', name: 'Eternal Production', description: '+25% production', cost: 25, maxPurchases: 10, effect: { productionMult: 1.25 } },
  { id: 'karma_crit', name: 'Karmic Precision', description: '+5% crit chance', cost: 30, maxPurchases: 5, effect: { critChance: 0.05 } },
  { id: 'karma_afk', name: 'Dream Cultivation', description: '+50% AFK gains', cost: 40, maxPurchases: 1, effect: { afkMult: 1.5 } },
  { id: 'karma_unlock_eighth', name: 'The Forgotten One', description: 'Unlock eighth master', cost: 250, maxPurchases: 1, effect: { unlockEighthMaster: true } },
  { id: 'karma_unlock_transcendence', name: 'Path to Transcendence', description: 'Preview transcendence', cost: 500, maxPurchases: 1, effect: { transcendencePreview: true } },
];

// ─── Tier 3: Celestial Bonuses ──────────────────────────────

export interface CelestialBonus {
  minPoints: number;
  name: string;
  description: string;
  effect: Record<string, number | boolean>;
}

export const CELESTIAL_BONUSES: CelestialBonus[] = [
  { minPoints: 1, name: 'Celestial Being', description: '+50% all stats permanently', effect: { allStats: 1.5 } },
  { minPoints: 3, name: 'Past Life Echo', description: 'Start with 2 Past Life Memories', effect: { pastLifeMemories: 2 } },
  { minPoints: 5, name: 'Celestial Cats', description: 'Unlock Celestial Cat tier', effect: { celestialCats: true } },
  { minPoints: 10, name: 'Instant Path', description: 'Instant rebirth to Tier 3', effect: { instantRebirthTier: 3 } },
  { minPoints: 25, name: 'Eternal Karma', description: 'Passively generate Karma Points', effect: { passiveKarma: true } },
  { minPoints: 50, name: 'Ultimate Forms', description: 'Unlock Ultimate Master Forms', effect: { ultimateForms: true } },
];

// ─── PrestigeSystem Class ──────────────────────────────────

export class PrestigeSystem {
  // Tier 1: Rebirth
  currentTier = 0;
  totalRebirths = 0;
  lifetimeBP = 0;
  lifetimePP = 0;
  lifetimeCats = 0;
  unlockedPerks = new Set<string>();

  // Tier 2: Reincarnation
  reincarnationCount = 0;
  karmaPoints = 0;
  pastLifeMemory: string | null = null;
  karmaShopPurchases: Record<string, number> = {};
  maxWaifuBonds: Record<string, number> = {};
  maxRealmReached: CultivationRealm = 'mortal';
  lifetimeBoops = 0;
  lifetimeGooseBoops = 0;

  // Tier 3: Transcendence
  transcendenceCount = 0;
  transcendencePoints = 0;
  celestialUnlocks: string[] = [];

  // ── Tracking ───────────────────────────────────────────

  trackBP(amount: number): void { this.lifetimeBP += amount; }
  trackPP(amount: number): void { this.lifetimePP += amount; }
  trackCat(): void { this.lifetimeCats++; }
  trackBoops(count: number): void { this.lifetimeBoops += count; }
  trackGooseBoops(count: number): void { this.lifetimeGooseBoops += count; }

  trackWaifuBond(waifuId: string, bondLevel: number): void {
    this.maxWaifuBonds[waifuId] = Math.max(this.maxWaifuBonds[waifuId] ?? 0, bondLevel);
  }

  trackRealmReached(realmId: CultivationRealm): void {
    const REALM_ORDER: CultivationRealm[] = ['mortal', 'qi_condensation', 'foundation', 'core_formation', 'nascent_soul', 'dao_seeking', 'tribulation', 'immortal', 'heavenly_sovereign'];
    if (REALM_ORDER.indexOf(realmId) > REALM_ORDER.indexOf(this.maxRealmReached)) {
      this.maxRealmReached = realmId;
    }
  }

  // ── Tier 1: Rebirth ────────────────────────────────────

  canRebirth(): { can: boolean; reason?: string } {
    if (this.currentTier >= 7) return { can: false, reason: 'Maximum tier reached' };
    const nextTier = REBIRTH_TIERS[this.currentTier];
    if (this.lifetimeBP < nextTier.bpRequired) {
      return { can: false, reason: `Need ${nextTier.bpRequired} lifetime BP` };
    }
    return { can: true };
  }

  getRebirthProgress(): number {
    if (this.currentTier >= 7) return 1;
    const nextTier = REBIRTH_TIERS[this.currentTier];
    return Math.min(1, this.lifetimeBP / nextTier.bpRequired);
  }

  rebirth(): { success: boolean; tier?: number; perks?: string[] } {
    const check = this.canRebirth();
    if (!check.can) return { success: false };

    const tier = REBIRTH_TIERS[this.currentTier];
    this.currentTier++;
    this.totalRebirths++;

    for (const perk of tier.perks) {
      this.unlockedPerks.add(perk);
    }

    return { success: true, tier: this.currentTier, perks: tier.perks };
  }

  getTotalMultiplier(): number {
    let mult = 1;
    for (let i = 0; i < this.currentTier; i++) {
      mult *= REBIRTH_TIERS[i].multiplier;
    }
    return mult;
  }

  hasPerk(perkId: string): boolean {
    return this.unlockedPerks.has(perkId);
  }

  // ── Tier 2: Reincarnation ──────────────────────────────

  canReincarnate(): { can: boolean; reason?: string } {
    if (this.currentTier < 7) return { can: false, reason: 'Must reach Tier 7 first' };
    if (this.lifetimeBP < 10000000000) return { can: false, reason: 'Need 10B lifetime BP' };
    return { can: true };
  }

  calculateKarmaEarned(): number {
    let karma = Math.floor(this.lifetimeBP / 1000000000);
    karma += this.totalRebirths * 2;

    const maxBondCount = Object.values(this.maxWaifuBonds).filter(b => b >= 100).length;
    karma += maxBondCount * 10;

    const realmBonuses: Partial<Record<CultivationRealm, number>> = {
      dao_seeking: 10, tribulation: 20, immortal: 50, heavenly_sovereign: 100,
    };
    karma += realmBonuses[this.maxRealmReached] ?? 0;

    return Math.max(1, karma);
  }

  reincarnate(): { success: boolean; karmaEarned?: number } {
    const check = this.canReincarnate();
    if (!check.can) return { success: false };

    const karmaEarned = this.calculateKarmaEarned();
    this.karmaPoints += karmaEarned;
    this.reincarnationCount++;

    // Reset tier 1 progress
    this.currentTier = 0;
    this.totalRebirths = 0;
    this.lifetimeBP = Math.floor(this.lifetimeBP * 0.1); // Keep 10%
    this.lifetimePP = 0;
    this.lifetimeCats = 0;
    this.unlockedPerks = new Set();

    return { success: true, karmaEarned };
  }

  getReincarnationMultiplier(): number {
    return Math.pow(2, this.reincarnationCount);
  }

  // ── Karma Shop ─────────────────────────────────────────

  canPurchaseKarma(itemId: string): boolean {
    const item = KARMA_SHOP.find(i => i.id === itemId);
    if (!item) return false;
    if (this.karmaPoints < item.cost) return false;
    const purchased = this.karmaShopPurchases[itemId] ?? 0;
    return purchased < item.maxPurchases;
  }

  purchaseKarma(itemId: string): boolean {
    if (!this.canPurchaseKarma(itemId)) return false;
    const item = KARMA_SHOP.find(i => i.id === itemId)!;
    this.karmaPoints -= item.cost;
    this.karmaShopPurchases[itemId] = (this.karmaShopPurchases[itemId] ?? 0) + 1;
    return true;
  }

  getKarmaShopEffects(): Record<string, number | boolean | string> {
    const effects: Record<string, number | boolean | string> = {};
    for (const item of KARMA_SHOP) {
      const count = this.karmaShopPurchases[item.id] ?? 0;
      if (count === 0) continue;
      for (const [key, value] of Object.entries(item.effect)) {
        if (typeof value === 'boolean') {
          effects[key] = value;
        } else if (typeof value === 'number') {
          effects[key] = ((effects[key] as number) ?? 0) + value * count;
        } else {
          effects[key] = value;
        }
      }
    }
    return effects;
  }

  // ── Tier 3: Transcendence ──────────────────────────────

  canTranscend(): { can: boolean; reason?: string } {
    if (this.reincarnationCount < 5) return { can: false, reason: 'Need 5 reincarnations' };
    if (this.karmaPoints < 1000) return { can: false, reason: 'Need 1000 Karma Points' };
    const REALM_ORDER: CultivationRealm[] = ['mortal', 'qi_condensation', 'foundation', 'core_formation', 'nascent_soul', 'dao_seeking', 'tribulation', 'immortal', 'heavenly_sovereign'];
    if (REALM_ORDER.indexOf(this.maxRealmReached) < REALM_ORDER.indexOf('immortal')) {
      return { can: false, reason: 'Must reach True Immortal realm' };
    }
    return { can: true };
  }

  transcend(): { success: boolean } {
    const check = this.canTranscend();
    if (!check.can) return { success: false };

    this.transcendenceCount++;
    this.transcendencePoints++;

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

    this.updateCelestialUnlocks();
    return { success: true };
  }

  getTranscendenceMultiplier(): number {
    return Math.pow(1.5, this.transcendencePoints);
  }

  private updateCelestialUnlocks(): void {
    this.celestialUnlocks = [];
    for (const bonus of CELESTIAL_BONUSES) {
      if (this.transcendencePoints >= bonus.minPoints) {
        this.celestialUnlocks.push(bonus.name);
      }
    }
  }

  getCelestialEffects(): Record<string, number | boolean> {
    const effects: Record<string, number | boolean> = {};
    for (const bonus of CELESTIAL_BONUSES) {
      if (this.transcendencePoints >= bonus.minPoints) {
        for (const [key, value] of Object.entries(bonus.effect)) {
          if (typeof value === 'boolean') effects[key] = value;
          else if (typeof value === 'number') effects[key] = ((effects[key] as number) ?? 1) * value;
        }
      }
    }
    return effects;
  }

  // ── Serialization ─────────────────────────────────────

  serialize() {
    return {
      currentTier: this.currentTier,
      totalRebirths: this.totalRebirths,
      lifetimeBP: this.lifetimeBP,
      unlockedPerks: [...this.unlockedPerks],
      heavenlySeals: 0,
      reincarnationCount: this.reincarnationCount,
      karmaPoints: this.karmaPoints,
      pastLifeMemory: this.pastLifeMemory,
      karmaShopPurchases: { ...this.karmaShopPurchases },
      maxWaifuBonds: { ...this.maxWaifuBonds },
      maxRealmReached: this.maxRealmReached,
      lifetimeBoops: this.lifetimeBoops,
      lifetimeGooseBoops: this.lifetimeGooseBoops,
      transcendenceCount: this.transcendenceCount,
      transcendencePoints: this.transcendencePoints,
      celestialUnlocks: [...this.celestialUnlocks],
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.currentTier !== undefined) this.currentTier = data.currentTier as number;
    if (data.totalRebirths !== undefined) this.totalRebirths = data.totalRebirths as number;
    if (data.lifetimeBP !== undefined) this.lifetimeBP = data.lifetimeBP as number;
    if (data.unlockedPerks) this.unlockedPerks = new Set(data.unlockedPerks as string[]);
    if (data.reincarnationCount !== undefined) this.reincarnationCount = data.reincarnationCount as number;
    if (data.karmaPoints !== undefined) this.karmaPoints = data.karmaPoints as number;
    if (data.pastLifeMemory !== undefined) this.pastLifeMemory = data.pastLifeMemory as string | null;
    if (data.karmaShopPurchases) this.karmaShopPurchases = data.karmaShopPurchases as Record<string, number>;
    if (data.maxWaifuBonds) this.maxWaifuBonds = data.maxWaifuBonds as Record<string, number>;
    if (data.maxRealmReached) this.maxRealmReached = data.maxRealmReached as CultivationRealm;
    if (data.lifetimeBoops !== undefined) this.lifetimeBoops = data.lifetimeBoops as number;
    if (data.lifetimeGooseBoops !== undefined) this.lifetimeGooseBoops = data.lifetimeGooseBoops as number;
    if (data.transcendenceCount !== undefined) this.transcendenceCount = data.transcendenceCount as number;
    if (data.transcendencePoints !== undefined) this.transcendencePoints = data.transcendencePoints as number;
    if (data.celestialUnlocks) this.celestialUnlocks = data.celestialUnlocks as string[];
  }
}
