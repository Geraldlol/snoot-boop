/**
 * BlessingSystem - Per-run waifu blessings (Hades-style), permanent blessings
 * Ported from js/blessings.js (~600 lines)
 */

// ─── Blessing Data ──────────────────────────────────────────

export type BlessingRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BlessingData {
  id: string;
  waifuId: string;
  name: string;
  description: string;
  rarity: BlessingRarity;
  effect: Record<string, number | boolean>;
}

export interface WaifuBlessingSet {
  waifuId: string;
  name: string;
  emoji: string;
  color: string;
  blessings: BlessingData[];
  synergy: { count: number; name: string; description: string; effect: Record<string, number | boolean> };
}

const RARITY_WEIGHTS: Record<BlessingRarity, number> = {
  common: 60,
  rare: 25,
  epic: 12,
  legendary: 3,
};

export const WAIFU_BLESSINGS: WaifuBlessingSet[] = [
  {
    waifuId: 'mei_lin', name: 'Mei Lin', emoji: '\uD83C\uDF38', color: '#DC143C',
    blessings: [
      { id: 'precision_strike', waifuId: 'mei_lin', name: 'Precision Strike', description: '+5% crit chance', rarity: 'common', effect: { critChance: 0.05 } },
      { id: 'crimson_fury', waifuId: 'mei_lin', name: 'Crimson Fury', description: '+15% crit damage', rarity: 'common', effect: { critDamage: 0.15 } },
      { id: 'chain_reaction', waifuId: 'mei_lin', name: 'Chain Reaction', description: '20% chance crit triggers another', rarity: 'rare', effect: { chainCrit: 0.2 } },
      { id: 'executioner', waifuId: 'mei_lin', name: 'Executioner', description: '+50% dmg to low HP enemies', rarity: 'rare', effect: { executeBonus: 0.5 } },
      { id: 'dragons_fury', waifuId: 'mei_lin', name: "Dragon's Fury", description: 'Every 3rd attack guaranteed crit', rarity: 'legendary', effect: { guaranteedCritEvery: 3 } },
    ],
    synergy: { count: 3, name: 'Crimson Tempest', description: 'Crits deal AOE damage', effect: { critAOE: true } },
  },
  {
    waifuId: 'sakura', name: 'Sakura', emoji: '\uD83C\uDF3A', color: '#FF69B4',
    blessings: [
      { id: 'gentle_breeze', waifuId: 'sakura', name: 'Gentle Breeze', description: '+1% HP regen/sec', rarity: 'common', effect: { hpRegen: 0.01 } },
      { id: 'petal_shield', waifuId: 'sakura', name: 'Petal Shield', description: 'Start with 2 shields', rarity: 'common', effect: { startingShields: 2 } },
      { id: 'life_bloom', waifuId: 'sakura', name: 'Life Bloom', description: 'Heal 10% of damage dealt', rarity: 'rare', effect: { lifesteal: 0.1 } },
      { id: 'second_wind', waifuId: 'sakura', name: 'Second Wind', description: '30% heal at low HP', rarity: 'rare', effect: { secondWind: 0.3 } },
      { id: 'eternal_bloom', waifuId: 'sakura', name: 'Eternal Bloom', description: 'Survive fatal damage once', rarity: 'legendary', effect: { deathSave: true } },
    ],
    synergy: { count: 3, name: 'Garden of Life', description: 'Healing grants temp damage boost', effect: { healDamageBoost: true } },
  },
  {
    waifuId: 'luna', name: 'Luna', emoji: '\uD83C\uDF19', color: '#C4A7E7',
    blessings: [
      { id: 'moonlit_bounty', waifuId: 'luna', name: 'Moonlit Bounty', description: '+15% BP from all sources', rarity: 'common', effect: { bpMult: 1.15 } },
      { id: 'starlight_purrs', waifuId: 'luna', name: 'Starlight Purrs', description: '+15% PP from all sources', rarity: 'common', effect: { ppMult: 1.15 } },
      { id: 'cosmic_flow', waifuId: 'luna', name: 'Cosmic Flow', description: '5 BP per second in combat', rarity: 'rare', effect: { combatBpPerSec: 5 } },
      { id: 'fortunes_favor', waifuId: 'luna', name: "Fortune's Favor", description: '+25% loot drop chance', rarity: 'rare', effect: { lootBonus: 1.25 } },
      { id: 'cosmic_harvest', waifuId: 'luna', name: 'Cosmic Harvest', description: 'Double all resource gains', rarity: 'legendary', effect: { allResourceMult: 2.0 } },
    ],
    synergy: { count: 3, name: 'Celestial Windfall', description: 'Bonus resources on floor clear', effect: { floorClearBonus: true } },
  },
  {
    waifuId: 'storm', name: 'Storm', emoji: '\u26A1', color: '#FFD700',
    blessings: [
      { id: 'thunder_strike', waifuId: 'storm', name: 'Thunder Strike', description: '+10% damage', rarity: 'common', effect: { damageMult: 1.1 } },
      { id: 'lightning_speed', waifuId: 'storm', name: 'Lightning Speed', description: '+15% attack speed', rarity: 'common', effect: { attackSpeed: 1.15 } },
      { id: 'chain_lightning', waifuId: 'storm', name: 'Chain Lightning', description: 'Attacks chain to 1 extra enemy', rarity: 'rare', effect: { chainTargets: 1 } },
      { id: 'overcharge', waifuId: 'storm', name: 'Overcharge', description: 'Every 5th attack = 2x damage', rarity: 'rare', effect: { overchargeEvery: 5 } },
      { id: 'tempest_unleashed', waifuId: 'storm', name: 'Tempest Unleashed', description: '300% AOE every 10s', rarity: 'legendary', effect: { tempestDamage: 3.0, tempestCooldown: 10 } },
    ],
    synergy: { count: 3, name: "Thunder God's Wrath", description: '15% stun chance on attacks', effect: { stunChance: 0.15 } },
  },
  {
    waifuId: 'celestia', name: 'Celestia', emoji: '\uD83D\uDC7C', color: '#00CED1',
    blessings: [
      { id: 'divine_haste', waifuId: 'celestia', name: 'Divine Haste', description: '-15% ability cooldowns', rarity: 'common', effect: { cooldownReduction: 0.15 } },
      { id: 'empowered_boop', waifuId: 'celestia', name: 'Empowered Boop', description: '+25% MEGA BOOP damage', rarity: 'common', effect: { megaBoopDamage: 1.25 } },
      { id: 'shield_restoration', waifuId: 'celestia', name: 'Shield Restoration', description: 'Gain 1 shield every 20s', rarity: 'rare', effect: { shieldRegenInterval: 20 } },
      { id: 'divine_reset', waifuId: 'celestia', name: 'Divine Reset', description: '20% chance reset cooldowns on kill', rarity: 'rare', effect: { cooldownResetChance: 0.2 } },
      { id: 'ascension', waifuId: 'celestia', name: 'Ascension', description: '+100% ability damage after MEGA BOOP', rarity: 'legendary', effect: { postMegaBoopDamage: 2.0 } },
    ],
    synergy: { count: 3, name: 'Divine Authority', description: 'Start each floor with abilities ready', effect: { startAbilitiesReady: true } },
  },
];

// ─── BlessingSystem Class ──────────────────────────────────

export class BlessingSystem {
  private currentBlessings: BlessingData[] = [];
  private permanentBlessings: string[] = [];
  private activeSynergies: string[] = [];

  private stats = {
    totalBlessingsReceived: 0,
    blessingsByWaifu: {} as Record<string, number>,
    synergiesTriggered: 0,
  };

  // ── Blessing Selection ────────────────────────────────

  generateBlessingOptions(count: number): BlessingData[] {
    const pool = this.getAvailablePool();
    if (pool.length === 0) return [];

    const options: BlessingData[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < count && pool.length > 0; i++) {
      const rarity = this.rollRarity();
      const candidates = pool.filter(b => b.rarity === rarity && !usedIds.has(b.id));

      if (candidates.length === 0) {
        // Fallback to any rarity
        const fallback = pool.filter(b => !usedIds.has(b.id));
        if (fallback.length === 0) break;
        const pick = fallback[Math.floor(Math.random() * fallback.length)];
        options.push(pick);
        usedIds.add(pick.id);
      } else {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        options.push(pick);
        usedIds.add(pick.id);
      }
    }

    return options;
  }

  selectBlessing(blessingId: string): boolean {
    const allBlessings = WAIFU_BLESSINGS.flatMap(w => w.blessings);
    const blessing = allBlessings.find(b => b.id === blessingId);
    if (!blessing) return false;

    this.currentBlessings.push(blessing);
    this.stats.totalBlessingsReceived++;
    this.stats.blessingsByWaifu[blessing.waifuId] = (this.stats.blessingsByWaifu[blessing.waifuId] ?? 0) + 1;

    this.checkSynergies();
    return true;
  }

  private rollRarity(): BlessingRarity {
    const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
      roll -= weight;
      if (roll <= 0) return rarity as BlessingRarity;
    }
    return 'common';
  }

  private getAvailablePool(): BlessingData[] {
    const currentIds = new Set(this.currentBlessings.map(b => b.id));
    return WAIFU_BLESSINGS.flatMap(w => w.blessings).filter(b => !currentIds.has(b.id));
  }

  // ── Synergies ─────────────────────────────────────────

  private checkSynergies(): void {
    const counts: Record<string, number> = {};
    for (const b of this.currentBlessings) {
      counts[b.waifuId] = (counts[b.waifuId] ?? 0) + 1;
    }

    this.activeSynergies = [];
    for (const set of WAIFU_BLESSINGS) {
      if ((counts[set.waifuId] ?? 0) >= set.synergy.count) {
        if (!this.activeSynergies.includes(set.waifuId)) {
          this.activeSynergies.push(set.waifuId);
          this.stats.synergiesTriggered++;
        }
      }
    }
  }

  getActiveSynergies(): Array<{ waifuId: string; name: string; effect: Record<string, number | boolean> }> {
    return this.activeSynergies.map(id => {
      const set = WAIFU_BLESSINGS.find(w => w.waifuId === id)!;
      return { waifuId: id, name: set.synergy.name, effect: set.synergy.effect };
    });
  }

  // ── Combined Effects ──────────────────────────────────

  getCombinedEffects(): Record<string, number | boolean> {
    const effects: Record<string, number | boolean> = {};

    for (const blessing of this.currentBlessings) {
      for (const [key, value] of Object.entries(blessing.effect)) {
        if (typeof value === 'boolean') {
          effects[key] = value;
        } else {
          effects[key] = ((effects[key] as number) ?? 0) + value;
        }
      }
    }

    // Synergy effects
    for (const synergy of this.getActiveSynergies()) {
      for (const [key, value] of Object.entries(synergy.effect)) {
        if (typeof value === 'boolean') effects[key] = value;
        else effects[key] = ((effects[key] as number) ?? 0) + value;
      }
    }

    return effects;
  }

  // ── Run Management ────────────────────────────────────

  startRun(): void {
    this.currentBlessings = [];
    this.activeSynergies = [];

    // Load permanent blessings
    const allBlessings = WAIFU_BLESSINGS.flatMap(w => w.blessings);
    for (const id of this.permanentBlessings) {
      const blessing = allBlessings.find(b => b.id === id);
      if (blessing) this.currentBlessings.push(blessing);
    }
    this.checkSynergies();
  }

  endRun(): void {
    this.currentBlessings = this.currentBlessings.filter(b =>
      this.permanentBlessings.includes(b.id)
    );
    this.activeSynergies = [];
  }

  addPermanentBlessing(blessingId: string): void {
    if (!this.permanentBlessings.includes(blessingId)) {
      this.permanentBlessings.push(blessingId);
    }
  }

  getCurrentBlessings(): BlessingData[] {
    return [...this.currentBlessings];
  }

  // ── Serialization ─────────────────────────────────────

  serialize() {
    return {
      permanentBlessings: [...this.permanentBlessings],
      stats: { ...this.stats },
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.permanentBlessings) this.permanentBlessings = data.permanentBlessings as string[];
    if (data.stats) this.stats = data.stats as typeof this.stats;
  }
}
