/**
 * CultivationSystem - Realm progression, breakthroughs, tribulations, passives
 * Ported from js/cultivation.js (~1,200 lines)
 */

import type { CultivationRealm } from '../../types';

// ─── Realm Data ─────────────────────────────────────────────

export interface RealmData {
  id: CultivationRealm;
  name: string;
  order: number;
  ranks: number;           // 9 for most, Infinity for heavenly_sovereign
  xpBase: number;
  xpScale: number;
  color: string;
  passives: RealmPassive[];
  contentUnlocks: string[];
}

export interface RealmPassive {
  rank: number;
  name: string;
  description: string;
  effect: Record<string, number | boolean>;
}

export const CULTIVATION_REALMS: Record<CultivationRealm, RealmData> = {
  mortal: {
    id: 'mortal', name: 'Mortal Realm', order: 1, ranks: 9, xpBase: 100, xpScale: 1.15, color: '#A0A0A0',
    passives: [
      { rank: 1, name: 'Awakened Spirit', description: '+10% Boop Power', effect: { boopPower: 1.1 } },
      { rank: 5, name: 'Mortal Foundation', description: '+15% PP Generation', effect: { ppGeneration: 1.15 } },
      { rank: 9, name: 'Mortal Peak', description: '+2% Critical Chance', effect: { critChance: 0.02 } },
    ],
    contentUnlocks: ['basic_boop', 'cat_sanctuary'],
  },
  qi_condensation: {
    id: 'qi_condensation', name: 'Qi Condensation', order: 2, ranks: 9, xpBase: 1000, xpScale: 1.15, color: '#87CEEB',
    passives: [
      { rank: 1, name: 'Qi Sense', description: '+10% Event Discovery', effect: { eventDiscovery: 1.1 } },
      { rank: 5, name: 'Meridian Opening', description: '+25% Boop Power', effect: { boopPower: 1.25 } },
      { rank: 9, name: 'Condensation Complete', description: '+20% AFK Efficiency', effect: { afkEfficiency: 1.2 } },
    ],
    contentUnlocks: ['technique_stances', 'training', 'expeditions'],
  },
  foundation: {
    id: 'foundation', name: 'Foundation Establishment', order: 3, ranks: 9, xpBase: 10000, xpScale: 1.15, color: '#8B4513',
    passives: [
      { rank: 1, name: 'Stable Foundation', description: 'Combo decay slowed 50%', effect: { comboDecayReduction: 0.5 } },
      { rank: 5, name: 'Inner Strength', description: '+20% Tribulation Power', effect: { tribulationPower: 1.2 } },
      { rank: 9, name: 'Foundation Peak', description: '+10 Cat Capacity', effect: { catCapacity: 10 } },
    ],
    contentUnlocks: ['cat_teams', 'first_waifu', 'meditation_garden'],
  },
  core_formation: {
    id: 'core_formation', name: 'Core Formation', order: 4, ranks: 9, xpBase: 100000, xpScale: 1.15, color: '#FFD700',
    passives: [
      { rank: 1, name: 'Golden Core', description: '+10% All Stats', effect: { allStats: 1.1 } },
      { rank: 5, name: 'Core Resonance', description: '+25% Cat Synergy', effect: { catSynergy: 1.25 } },
      { rank: 9, name: 'Perfect Core', description: '+50% Critical Damage', effect: { critDamage: 1.5 } },
    ],
    contentUnlocks: ['infinite_pagoda'],
  },
  nascent_soul: {
    id: 'nascent_soul', name: 'Nascent Soul', order: 5, ranks: 9, xpBase: 1000000, xpScale: 1.15, color: '#9370DB',
    passives: [
      { rank: 1, name: 'Soul Awakening', description: '+50% Offline Gains', effect: { afkEfficiency: 1.5 } },
      { rank: 5, name: 'Soul Projection', description: '+25% Dungeon Speed', effect: { dungeonSpeed: 1.25 } },
      { rank: 9, name: 'Complete Soul', description: '+1 Death Defiance', effect: { deathDefiance: 1 } },
    ],
    contentUnlocks: ['soul_techniques', 'advanced_dungeons'],
  },
  dao_seeking: {
    id: 'dao_seeking', name: 'Dao Seeking', order: 6, ranks: 9, xpBase: 100000000, xpScale: 1.15, color: '#4169E1',
    passives: [
      { rank: 1, name: 'Dao Glimpse', description: '2x Rare Event Chance', effect: { rareEventChance: 2.0 } },
      { rank: 5, name: 'Dao Comprehension', description: '+50% XP Gain', effect: { xpGain: 1.5 } },
      { rank: 9, name: 'Dao Heart', description: '+25% Tribulation Success', effect: { tribulationSuccess: 1.25 } },
    ],
    contentUnlocks: ['divine_cats', 'reincarnation_preview'],
  },
  tribulation: {
    id: 'tribulation', name: 'Immortal Ascension', order: 7, ranks: 9, xpBase: 1000000000, xpScale: 1.15, color: '#FFD700',
    passives: [
      { rank: 1, name: 'Immortal Body', description: '2x HP Regeneration', effect: { hpRegen: 2.0 } },
      { rank: 5, name: 'Immortal Qi', description: '2x Qi Capacity', effect: { qiCapacity: 2.0 } },
      { rank: 9, name: 'Almost Immortal', description: '+50% Permanent Bonus', effect: { permanentBonus: 1.5 } },
    ],
    contentUnlocks: ['ascension_system', 'eighth_master_hints'],
  },
  immortal: {
    id: 'immortal', name: 'True Immortal', order: 8, ranks: 9, xpBase: 10000000000, xpScale: 1.15, color: '#FFFFFF',
    passives: [
      { rank: 1, name: 'Eternal Life', description: 'Unlimited AFK Time', effect: { unlimitedAfk: true } },
      { rank: 5, name: 'True Understanding', description: '2x All Multipliers', effect: { allMultipliers: 2.0 } },
      { rank: 9, name: 'True Immortal Peak', description: 'Ready for Transcendence', effect: { transcendenceReady: true } },
    ],
    contentUnlocks: ['transcendence_path'],
  },
  heavenly_sovereign: {
    id: 'heavenly_sovereign', name: 'Heavenly Sovereign', order: 9, ranks: 999, xpBase: 100000000000, xpScale: 1.2, color: '#FFD700',
    passives: [
      { rank: 10, name: "Sovereign's Blessing", description: '+10% All Stats (per 10 ranks)', effect: { allStats: 1.1 } },
    ],
    contentUnlocks: ['infinite_scaling'],
  },
};

const REALM_ORDER: CultivationRealm[] = [
  'mortal', 'qi_condensation', 'foundation', 'core_formation',
  'nascent_soul', 'dao_seeking', 'tribulation', 'immortal', 'heavenly_sovereign',
];

// ─── CultivationSystem Class ────────────────────────────────

export class CultivationSystem {
  currentRealm: CultivationRealm = 'mortal';
  currentRank = 1;
  cultivationXP = 0;
  totalCultivationXP = 0;
  passivesUnlocked: string[] = [];
  unlockedContent: string[] = ['basic_boop', 'cat_sanctuary'];
  tribulationAttempts: Record<string, number> = {};
  severingChoices: Record<string, string> = {};
  daoWounds = 0;
  permanentScars = 0;

  private stats = {
    realmBreakthroughs: 0,
    tribulationSuccesses: 0,
    tribulationFailures: 0,
    totalXPEarned: 0,
    highestRealm: 'mortal' as string,
    highestRank: 1,
  };

  // ── XP & Leveling ──────────────────────────────────────

  getXPForNextRank(): number {
    const realm = CULTIVATION_REALMS[this.currentRealm];
    return Math.floor(realm.xpBase * Math.pow(realm.xpScale, this.currentRank - 1));
  }

  addXP(amount: number): { leveledUp: boolean; newPassives: string[] } {
    this.cultivationXP += amount;
    this.totalCultivationXP += amount;
    this.stats.totalXPEarned += amount;

    const newPassives: string[] = [];
    let leveledUp = false;

    const realm = CULTIVATION_REALMS[this.currentRealm];
    let xpNeeded = this.getXPForNextRank();

    while (this.cultivationXP >= xpNeeded && this.currentRank < realm.ranks) {
      this.cultivationXP -= xpNeeded;
      this.currentRank++;
      leveledUp = true;

      // Check passive unlock
      const passive = realm.passives.find(p => p.rank === this.currentRank);
      if (passive) {
        const key = `${this.currentRealm}_${this.currentRank}`;
        if (!this.passivesUnlocked.includes(key)) {
          this.passivesUnlocked.push(key);
          newPassives.push(passive.name);
        }
      }

      // Update stats
      if (this.currentRank > this.stats.highestRank ||
          REALM_ORDER.indexOf(this.currentRealm) > REALM_ORDER.indexOf(this.stats.highestRealm as CultivationRealm)) {
        this.stats.highestRank = this.currentRank;
        this.stats.highestRealm = this.currentRealm;
      }

      xpNeeded = this.getXPForNextRank();
    }

    return { leveledUp, newPassives };
  }

  getProgress(): number {
    return this.cultivationXP / this.getXPForNextRank();
  }

  // ── Breakthrough ───────────────────────────────────────

  canBreakthrough(): boolean {
    const realm = CULTIVATION_REALMS[this.currentRealm];
    if (this.currentRank < realm.ranks) return false;
    const nextRealm = this.getNextRealm();
    return nextRealm !== null;
  }

  attemptBreakthrough(): { success: boolean; newRealm?: CultivationRealm; content?: string[] } {
    if (!this.canBreakthrough()) return { success: false };

    const nextRealm = this.getNextRealm()!;
    const realmData = CULTIVATION_REALMS[nextRealm];

    // Simple success check (can be expanded with tribulation mini-games later)
    const attempts = (this.tribulationAttempts[nextRealm] ?? 0) + 1;
    this.tribulationAttempts[nextRealm] = attempts;

    // Success chance increases with attempts (base 60%, +5% per attempt)
    const successChance = Math.min(0.95, 0.6 + (attempts - 1) * 0.05);
    const success = Math.random() < successChance;

    if (success) {
      this.currentRealm = nextRealm;
      this.currentRank = 1;
      this.cultivationXP = 0;
      this.stats.realmBreakthroughs++;
      this.stats.tribulationSuccesses++;
      this.stats.highestRealm = nextRealm;
      this.stats.highestRank = 1;

      // Unlock content
      for (const content of realmData.contentUnlocks) {
        if (!this.unlockedContent.includes(content)) {
          this.unlockedContent.push(content);
        }
      }

      // Unlock first passive
      const firstPassive = realmData.passives.find(p => p.rank === 1);
      if (firstPassive) {
        const key = `${nextRealm}_1`;
        if (!this.passivesUnlocked.includes(key)) {
          this.passivesUnlocked.push(key);
        }
      }

      return { success: true, newRealm: nextRealm, content: realmData.contentUnlocks };
    }

    // Failure
    this.stats.tribulationFailures++;
    const xpLoss = Math.floor(this.totalCultivationXP * 0.1);
    this.cultivationXP = Math.max(0, this.cultivationXP - xpLoss);

    return { success: false };
  }

  private getNextRealm(): CultivationRealm | null {
    const idx = REALM_ORDER.indexOf(this.currentRealm);
    if (idx < 0 || idx >= REALM_ORDER.length - 1) return null;
    return REALM_ORDER[idx + 1];
  }

  // ── Passives ───────────────────────────────────────────

  ensureCurrentRankPassivesUnlocked(): string[] {
    const realm = CULTIVATION_REALMS[this.currentRealm];
    const newPassives: string[] = [];

    for (const passive of realm.passives) {
      if (passive.rank > this.currentRank) continue;
      const key = `${this.currentRealm}_${passive.rank}`;
      if (this.passivesUnlocked.includes(key)) continue;
      this.passivesUnlocked.push(key);
      newPassives.push(passive.name);
    }

    return newPassives;
  }

  getUnlockedPassives(): RealmPassive[] {
    const result: RealmPassive[] = [];
    for (const key of this.passivesUnlocked) {
      const splitAt = key.lastIndexOf('_');
      if (splitAt <= 0) continue;
      const realmId = key.slice(0, splitAt);
      const rankStr = key.slice(splitAt + 1);
      const rank = parseInt(rankStr);
      const realm = CULTIVATION_REALMS[realmId as CultivationRealm];
      if (!realm) continue;
      const passive = realm.passives.find(p => p.rank === rank);
      if (passive) result.push(passive);
    }
    return result;
  }

  getCombinedPassiveEffects(): Record<string, number | boolean> {
    const effects: Record<string, number | boolean> = {};
    for (const passive of this.getUnlockedPassives()) {
      for (const [key, value] of Object.entries(passive.effect)) {
        if (typeof value === 'boolean') {
          effects[key] = value;
        } else if (typeof value === 'number') {
          // Additive for some, multiplicative for others
          if (key === 'critChance' || key === 'catCapacity' || key === 'deathDefiance') {
            effects[key] = ((effects[key] as number) ?? 0) + value;
          } else {
            effects[key] = ((effects[key] as number) ?? 1) * value;
          }
        }
      }
    }

    // Heavenly Sovereign scaling: +10% allStats per 10 ranks
    if (this.currentRealm === 'heavenly_sovereign') {
      const bonusCount = Math.floor(this.currentRank / 10);
      if (bonusCount > 0) {
        effects.allStats = ((effects.allStats as number) ?? 1) * Math.pow(1.1, bonusCount);
      }
    }

    return effects;
  }

  getRealmIndex(realm: CultivationRealm | string): number {
    return REALM_ORDER.indexOf(realm as CultivationRealm);
  }

  hasReachedRealm(realm: CultivationRealm): boolean {
    return this.getRealmIndex(this.currentRealm) >= this.getRealmIndex(realm);
  }

  isContentUnlocked(contentId: string): boolean {
    return this.unlockedContent.includes(contentId);
  }

  // ── Queries ────────────────────────────────────────────

  getCurrentRealmData(): RealmData {
    return CULTIVATION_REALMS[this.currentRealm];
  }

  getStats() {
    return { ...this.stats };
  }

  // ── Serialization ─────────────────────────────────────

  serialize() {
    return {
      currentRealm: this.currentRealm,
      currentRank: this.currentRank,
      cultivationXP: this.cultivationXP,
      totalCultivationXP: this.totalCultivationXP,
      passivesUnlocked: [...this.passivesUnlocked],
      unlockedContent: [...this.unlockedContent],
      tribulationAttempts: { ...this.tribulationAttempts },
      severingChoices: { ...this.severingChoices },
      daoWounds: this.daoWounds,
      permanentScars: this.permanentScars,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.currentRealm) this.currentRealm = data.currentRealm as CultivationRealm;
    if (data.currentRank) this.currentRank = data.currentRank as number;
    if (data.cultivationXP) this.cultivationXP = data.cultivationXP as number;
    if (data.totalCultivationXP) this.totalCultivationXP = data.totalCultivationXP as number;
    if (data.passivesUnlocked) this.passivesUnlocked = data.passivesUnlocked as string[];
    if (data.unlockedContent) this.unlockedContent = data.unlockedContent as string[];
    if (data.tribulationAttempts) this.tribulationAttempts = data.tribulationAttempts as Record<string, number>;
    if (data.severingChoices) this.severingChoices = data.severingChoices as Record<string, string>;
    if (data.daoWounds !== undefined) this.daoWounds = data.daoWounds as number;
    if (data.permanentScars !== undefined) this.permanentScars = data.permanentScars as number;
  }
}
