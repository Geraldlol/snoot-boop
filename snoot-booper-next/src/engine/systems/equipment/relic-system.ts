/**
 * RelicSystem - Run-wide powerful buffs, stacking, synergies
 * Ported from js/systems/relics.js (~1,655 lines)
 */

// ─── Types ───────────────────────────────────────────────────

export type RelicRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface RelicData {
  id: string;
  name: string;
  rarity: RelicRarity;
  description: string;
  flavor?: string;
  effect: RelicEffect;
  stackable: boolean;
  maxStacks: number;
  minFloor: number;
}

export interface RelicEffect {
  type: string;
  value: number | boolean;
  effects?: RelicEffect[];
}

export interface RelicSynergy {
  id: string;
  name: string;
  requires: string[];
  bonus: Record<string, number | boolean>;
  description: string;
}

// ─── Static Data ─────────────────────────────────────────────

const RARITY_WEIGHTS: Record<RelicRarity, number> = {
  common: 55,
  rare: 28,
  epic: 12,
  legendary: 4,
  mythic: 1,
};

const FLOOR_REQUIREMENTS: Record<RelicRarity, number> = {
  common: 1,
  rare: 5,
  epic: 15,
  legendary: 30,
  mythic: 50,
};

export const RELICS: RelicData[] = [
  // ── Common ────────────────────────────────
  { id: 'lucky_coin',       name: 'Lucky Coin',         rarity: 'common', description: '+10% loot drop rate',        flavor: 'Always lands on cats.',            effect: { type: 'lootBonus', value: 0.1 },       stackable: true,  maxStacks: 5, minFloor: 1 },
  { id: 'catnip_pouch',     name: 'Emergency Catnip',   rarity: 'common', description: '+20% Qi regen rate',         flavor: 'The good stuff.',                  effect: { type: 'qiRegen', value: 0.2 },         stackable: true,  maxStacks: 5, minFloor: 1 },
  { id: 'iron_whiskers',    name: 'Iron Whiskers',       rarity: 'common', description: '+5 defense',                                                             effect: { type: 'defense', value: 5 },           stackable: true,  maxStacks: 10, minFloor: 1 },
  { id: 'warrior_bandana',  name: "Warrior's Bandana",   rarity: 'common', description: '+3% crit chance',                                                        effect: { type: 'critChance', value: 0.03 },     stackable: true,  maxStacks: 5, minFloor: 1 },
  { id: 'healing_herb',     name: 'Healing Herb',        rarity: 'common', description: '+2 HP regen per second',                                                 effect: { type: 'hpRegen', value: 2 },           stackable: true,  maxStacks: 10, minFloor: 1 },
  { id: 'shield_charm',     name: 'Shield Charm',        rarity: 'common', description: '+10 max HP',                                                             effect: { type: 'maxHp', value: 10 },            stackable: true,  maxStacks: 10, minFloor: 1 },
  { id: 'speed_boots',      name: 'Speed Boots',         rarity: 'common', description: '+5% attack speed',                                                       effect: { type: 'attackSpeed', value: 0.05 },    stackable: true,  maxStacks: 5, minFloor: 1 },
  { id: 'exp_crystal',      name: 'Experience Crystal',  rarity: 'common', description: '+10% EXP gain',                                                          effect: { type: 'expGain', value: 0.1 },         stackable: true,  maxStacks: 5, minFloor: 1 },
  // ── Rare ──────────────────────────────────
  { id: 'box_dimension',    name: 'Pocket Dimension Box',rarity: 'rare',   description: '25% double loot chance',     flavor: "Bigger on the inside.",             effect: { type: 'doubleLootChance', value: 0.25 },stackable: false, maxStacks: 1, minFloor: 5 },
  { id: 'nine_lives_charm', name: 'Nine Lives Charm',    rarity: 'rare',   description: '15% auto-revive chance',     flavor: 'Lives 1-8 sold separately.',        effect: { type: 'reviveChance', value: 0.15 },   stackable: true,  maxStacks: 3, minFloor: 5 },
  { id: 'thunderpaw',       name: 'Thunderpaw Gauntlet', rarity: 'rare',   description: '+15 attack, +5% crit dmg',                                               effect: { type: 'multiple', value: 0, effects: [{ type: 'attack', value: 15 }, { type: 'critDamage', value: 0.05 }] }, stackable: false, maxStacks: 1, minFloor: 5 },
  { id: 'dragon_scale',     name: 'Dragon Scale Shield', rarity: 'rare',   description: '20% damage reduction',                                                   effect: { type: 'damageReduction', value: 0.2 }, stackable: false, maxStacks: 1, minFloor: 10 },
  { id: 'ancestor_medal',   name: 'Ancestor Medal',      rarity: 'rare',   description: '+5% damage per floor',                                                   effect: { type: 'ancestorBonus', value: 0.05 },  stackable: false, maxStacks: 1, minFloor: 10 },
  { id: 'stacking_power',   name: 'Stacking Power Gem',  rarity: 'rare',   description: '+1% damage per enemy killed',                                            effect: { type: 'stackingBonus', value: 0.01 },  stackable: false, maxStacks: 1, minFloor: 10 },
  // ── Epic ──────────────────────────────────
  { id: 'goose_horn',       name: 'Horn of the Goose',   rarity: 'epic',   description: 'Summon goose every 5 floors', flavor: 'HONK!',                            effect: { type: 'summonGoose', value: 5 },       stackable: false, maxStacks: 1, minFloor: 15 },
  { id: 'waifu_blessing',   name: 'Waifu Blessing',      rarity: 'epic',   description: 'Waifu skill cooldown -50%',                                              effect: { type: 'waifuCooldown', value: 0.5 },   stackable: false, maxStacks: 1, minFloor: 15 },
  { id: 'void_shard',       name: 'Void Shard',          rarity: 'epic',   description: '+20% void penetration',                                                  effect: { type: 'voidPen', value: 0.2 },         stackable: true,  maxStacks: 3, minFloor: 20 },
  { id: 'phoenix_feather_r',name: 'Phoenix Feather',     rarity: 'epic',   description: 'Guaranteed revive at 50% HP',                                            effect: { type: 'guaranteedRevive', value: 0.5 },stackable: true,  maxStacks: 3, minFloor: 20 },
  { id: 'infinity_collar',  name: 'Infinity Collar',     rarity: 'epic',   description: '+1% power per kill (stacking)',                                           effect: { type: 'stackingBonus', value: 0.01 },  stackable: false, maxStacks: 1, minFloor: 25 },
  // ── Legendary ─────────────────────────────
  { id: 'eternal_catnip',   name: 'Eternal Catnip',      rarity: 'legendary',description: '+20% all stats, full Qi start',flavor: 'The really good stuff.',         effect: { type: 'multiple', value: 0, effects: [{ type: 'allStats', value: 0.2 }, { type: 'startFullQi', value: true }] }, stackable: false, maxStacks: 1, minFloor: 30 },
  { id: 'cat_king_crown',   name: 'Crown of Cat King',   rarity: 'legendary',description: '+15% all stats, +50% loot',                                            effect: { type: 'multiple', value: 0, effects: [{ type: 'allStats', value: 0.15 }, { type: 'lootBonus', value: 0.5 }] },  stackable: false, maxStacks: 1, minFloor: 30 },
  { id: 'thousand_boops',   name: 'Blade of 1000 Boops', rarity: 'legendary',description: '3x boop command damage',                                               effect: { type: 'boopDamage', value: 3.0 },      stackable: false, maxStacks: 1, minFloor: 40 },
  { id: 'celestial_tear',   name: 'Celestial Tear',      rarity: 'legendary',description: 'Full heal on boss defeat',                                              effect: { type: 'bossHeal', value: true },       stackable: false, maxStacks: 1, minFloor: 40 },
  // ── Mythic ────────────────────────────────
  { id: 'snoot_prime',      name: 'Fragment of Snoot Prime',rarity: 'mythic',description: '3x all Boop damage',       flavor: 'The first snoot. The original boop.', effect: { type: 'boopDamage', value: 3.0 },    stackable: false, maxStacks: 1, minFloor: 100 },
  { id: 'cosmic_yarn',      name: 'Cosmic Yarn Ball',    rarity: 'mythic', description: '+50% all stats, infinite Qi',                                             effect: { type: 'multiple', value: 0, effects: [{ type: 'allStats', value: 0.5 }, { type: 'infiniteQi', value: true }] }, stackable: false, maxStacks: 1, minFloor: 75 },
  { id: 'primordial_honk',  name: 'Primordial Honk',     rarity: 'mythic', description: 'Chaos goose every floor',    flavor: 'HJÖNK.',                           effect: { type: 'chaosGoose', value: true },     stackable: false, maxStacks: 1, minFloor: 80 },
  { id: 'void_heart',       name: 'Void Heart',          rarity: 'mythic', description: 'All damage ignores defense',                                              effect: { type: 'ignoreDefense', value: true },  stackable: false, maxStacks: 1, minFloor: 90 },
];

export const RELIC_SYNERGIES: RelicSynergy[] = [
  { id: 'catTriumvirate', name: 'Cat Triumvirate', requires: ['iron_whiskers', 'warrior_bandana', 'healing_herb'], bonus: { allStats: 0.5 }, description: '+50% all stats' },
  { id: 'gooseMaster',    name: 'Goose Master',    requires: ['goose_horn', 'lucky_coin'],                        bonus: { permanentGoose: true }, description: 'Permanent goose ally' },
  { id: 'chaosEmbrace',   name: 'Chaos Embrace',   requires: ['void_shard', 'primordial_honk'],                   bonus: { voidDamageBonus: 1.0 }, description: '+100% void damage' },
  { id: 'phoenixRebirth',  name: 'Phoenix Rebirth',  requires: ['phoenix_feather_r', 'eternal_catnip'],             bonus: { reviveWithFullHp: true }, description: 'Revive at full HP' },
  { id: 'speedDemon',      name: 'Speed Demon',      requires: ['speed_boots', 'exp_crystal', 'lucky_coin'],        bonus: { attackSpeed: 0.3, expGain: 0.2 }, description: '+30% speed, +20% EXP' },
];

// ─── RelicSystem Class ───────────────────────────────────────

export class RelicSystem {
  private activeRelics: string[] = [];
  private relicStacks: Record<string, number> = {};
  private modifiers: Record<string, number | boolean> = {};
  private killCount = 0;
  private gooseTimer = 0;
  private firstStrikeUsed = false;

  // ── Acquisition ──────────────────────────────────────────

  addRelic(relicId: string): boolean {
    const relic = RELICS.find(r => r.id === relicId);
    if (!relic) return false;

    if (relic.stackable) {
      const stacks = this.relicStacks[relicId] ?? 0;
      if (stacks >= relic.maxStacks) return false;
      this.relicStacks[relicId] = stacks + 1;
      if (!this.activeRelics.includes(relicId)) {
        this.activeRelics.push(relicId);
      }
    } else {
      if (this.activeRelics.includes(relicId)) return false;
      this.activeRelics.push(relicId);
      this.relicStacks[relicId] = 1;
    }

    this.recalculateModifiers();
    return true;
  }

  hasRelic(relicId: string): boolean {
    return this.activeRelics.includes(relicId);
  }

  getRelicStacks(relicId: string): number {
    return this.relicStacks[relicId] ?? 0;
  }

  getActiveRelics(): Array<{ relic: RelicData; stacks: number }> {
    return this.activeRelics.map(id => {
      const relic = RELICS.find(r => r.id === id)!;
      return { relic, stacks: this.relicStacks[id] ?? 1 };
    });
  }

  // ── Relic Reward Generation ──────────────────────────────

  generateRelicReward(floorNum: number): RelicData | null {
    const rarity = this.rollRarity(floorNum);
    const candidates = RELICS.filter(r => {
      if (r.rarity !== rarity) return false;
      if (r.minFloor > floorNum) return false;
      // Don't offer maxed relics
      if (r.stackable) {
        return (this.relicStacks[r.id] ?? 0) < r.maxStacks;
      }
      return !this.activeRelics.includes(r.id);
    });

    if (candidates.length === 0) {
      // Fallback to lower rarity
      const fallback = RELICS.filter(r => {
        if (r.minFloor > floorNum) return false;
        if (r.stackable) return (this.relicStacks[r.id] ?? 0) < r.maxStacks;
        return !this.activeRelics.includes(r.id);
      });
      if (fallback.length === 0) return null;
      return fallback[Math.floor(Math.random() * fallback.length)];
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  private rollRarity(floorNum: number): RelicRarity {
    const available: [RelicRarity, number][] = [];
    for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS) as [RelicRarity, number][]) {
      if (floorNum >= FLOOR_REQUIREMENTS[rarity]) {
        available.push([rarity, weight]);
      }
    }

    const total = available.reduce((s, [, w]) => s + w, 0);
    let roll = Math.random() * total;
    for (const [rarity, weight] of available) {
      roll -= weight;
      if (roll <= 0) return rarity;
    }
    return 'common';
  }

  // ── Modifiers ────────────────────────────────────────────

  recalculateModifiers(): void {
    const mods: Record<string, number | boolean> = {};

    for (const relicId of this.activeRelics) {
      const relic = RELICS.find(r => r.id === relicId);
      if (!relic) continue;
      const stacks = this.relicStacks[relicId] ?? 1;
      this.applySingleEffect(mods, relic.effect, stacks);
    }

    // Synergy bonuses
    for (const synergy of this.getActiveSynergies()) {
      for (const [key, value] of Object.entries(synergy.bonus)) {
        if (typeof value === 'boolean') mods[key] = value;
        else if (typeof value === 'number') mods[key] = ((mods[key] as number) ?? 0) + value;
      }
    }

    this.modifiers = mods;
  }

  private applySingleEffect(mods: Record<string, number | boolean>, effect: RelicEffect, stacks: number): void {
    if (effect.type === 'multiple' && effect.effects) {
      for (const sub of effect.effects) {
        this.applySingleEffect(mods, sub, stacks);
      }
      return;
    }

    if (typeof effect.value === 'boolean') {
      mods[effect.type] = effect.value;
    } else {
      // Multiplicative types vs additive
      const multiplicative = ['lootBonus', 'qiRegen', 'allStats', 'boopDamage', 'attackSpeed'];
      if (multiplicative.includes(effect.type)) {
        mods[effect.type] = ((mods[effect.type] as number) ?? 1) * Math.pow(1 + effect.value, stacks);
      } else {
        mods[effect.type] = ((mods[effect.type] as number) ?? 0) + effect.value * stacks;
      }
    }
  }

  getModifiers(): Record<string, number | boolean> {
    return { ...this.modifiers };
  }

  getModifier(key: string): number | boolean {
    return this.modifiers[key] ?? 0;
  }

  // ── Synergies ────────────────────────────────────────────

  getActiveSynergies(): RelicSynergy[] {
    return RELIC_SYNERGIES.filter(s =>
      s.requires.every(relicId => this.activeRelics.includes(relicId))
    );
  }

  hasSynergy(synergyId: string): boolean {
    return this.getActiveSynergies().some(s => s.id === synergyId);
  }

  // ── Floor Events ─────────────────────────────────────────

  processFloorStart(floorNum: number): { gooseSummoned: boolean } {
    this.firstStrikeUsed = false;
    let gooseSummoned = false;

    // Goose horn: summon every N floors
    const gooseInterval = this.modifiers.summonGoose;
    if (typeof gooseInterval === 'number' && gooseInterval > 0) {
      if (floorNum % gooseInterval === 0) {
        gooseSummoned = true;
      }
    }

    return { gooseSummoned };
  }

  onEnemyKilled(): void {
    this.killCount++;
  }

  onBossDefeated(): { fullHeal: boolean } {
    return { fullHeal: !!this.modifiers.bossHeal };
  }

  checkAutoRevive(): { canRevive: boolean; hpPercent: number } {
    // Guaranteed revive (phoenix feather)
    if (this.modifiers.guaranteedRevive) {
      const hp = typeof this.modifiers.guaranteedRevive === 'number' ? this.modifiers.guaranteedRevive : 0.5;
      return { canRevive: true, hpPercent: hp };
    }

    // Chance revive (nine lives charm)
    const chance = this.modifiers.reviveChance;
    if (typeof chance === 'number' && Math.random() < chance) {
      return { canRevive: true, hpPercent: 0.3 };
    }

    return { canRevive: false, hpPercent: 0 };
  }

  getDamageMultiplier(isFirstStrike = false): number {
    let mult = 1;
    if (typeof this.modifiers.allStats === 'number') mult *= this.modifiers.allStats;
    if (typeof this.modifiers.boopDamage === 'number') mult *= this.modifiers.boopDamage;
    if (typeof this.modifiers.stackingBonus === 'number') mult *= (1 + this.modifiers.stackingBonus * this.killCount);
    if (typeof this.modifiers.ancestorBonus === 'number') mult *= (1 + this.modifiers.ancestorBonus);

    if (isFirstStrike && !this.firstStrikeUsed) {
      this.firstStrikeUsed = true;
      mult *= 1.5;
    }

    return mult;
  }

  // ── Run Management ───────────────────────────────────────

  reset(): void {
    this.activeRelics = [];
    this.relicStacks = {};
    this.modifiers = {};
    this.killCount = 0;
    this.gooseTimer = 0;
    this.firstStrikeUsed = false;
  }

  // ── Serialization ────────────────────────────────────────

  serialize() {
    return {
      activeRelics: [...this.activeRelics],
      relicStacks: { ...this.relicStacks },
      killCount: this.killCount,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.activeRelics) this.activeRelics = data.activeRelics as string[];
    if (data.relicStacks) this.relicStacks = data.relicStacks as Record<string, number>;
    if (data.killCount !== undefined) this.killCount = data.killCount as number;
    this.recalculateModifiers();
  }
}
