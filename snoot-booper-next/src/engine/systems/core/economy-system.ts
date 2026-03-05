/**
 * EconomySystem - 9-Currency Management
 *
 * Pure TypeScript, zero React imports.
 */

import { eventBus, EVENTS } from '../../event-bus';
import type { CurrencyId, Currencies } from '../../types';

// ─── Currency Definitions ──────────────────────────────────

export interface CurrencyDef {
  id: CurrencyId;
  name: string;
  icon: string;
  description: string;
  hasCap: boolean;
  premium: boolean;
  displayPriority: number;
}

const CURRENCY_DEFS: Record<CurrencyId, CurrencyDef> = {
  bp: { id: 'bp', name: 'Boop Points', icon: '👆', description: 'Active booping currency', hasCap: false, premium: false, displayPriority: 1 },
  pp: { id: 'pp', name: 'Purr Power', icon: '😺', description: 'Passive AFK generation', hasCap: false, premium: false, displayPriority: 2 },
  qi: { id: 'qi', name: 'Qi', icon: '✨', description: 'Cultivation energy (capped)', hasCap: true, premium: false, displayPriority: 3 },
  jadeCatnip: { id: 'jadeCatnip', name: 'Jade Catnip', icon: '💎', description: 'Premium rare drops', hasCap: false, premium: true, displayPriority: 4 },
  spiritStones: { id: 'spiritStones', name: 'Spirit Stones', icon: '💠', description: 'Dungeon equipment currency', hasCap: false, premium: false, displayPriority: 5 },
  heavenlySeals: { id: 'heavenlySeals', name: 'Heavenly Seals', icon: '🔮', description: 'Prestige currency', hasCap: false, premium: false, displayPriority: 6 },
  sectReputation: { id: 'sectReputation', name: 'Sect Reputation', icon: '🏆', description: 'Social achievements', hasCap: false, premium: false, displayPriority: 7 },
  waifuTokens: { id: 'waifuTokens', name: 'Waifu Tokens', icon: '💕', description: 'Relationship bonds', hasCap: false, premium: false, displayPriority: 8 },
  gooseFeathers: { id: 'gooseFeathers', name: 'Goose Feathers', icon: '🪶', description: 'Goose combat drops', hasCap: false, premium: false, displayPriority: 9 },
};

// ─── Qi Cap by Realm ───────────────────────────────────────

const QI_CAPS: Record<string, number> = {
  mortal: 100,
  qi_condensation: 200,
  foundation: 500,
  core_formation: 1000,
  nascent_soul: 2500,
  dao_seeking: 5000,
  tribulation: 10000,
  immortal: 50000,
  heavenly_sovereign: Infinity,
};

// ─── Currency Conversions ──────────────────────────────────

export interface CurrencyConversion {
  id: string;
  from: CurrencyId;
  to: CurrencyId;
  rate: number;        // units of 'from' per 1 unit of 'to'
  minAmount: number;
  cooldown: number;    // ms, 0 = no cooldown
  unlockCondition: string;
}

const CONVERSIONS: CurrencyConversion[] = [
  { id: 'bp_to_pp', from: 'bp', to: 'pp', rate: 1000, minAmount: 1000, cooldown: 0, unlockCondition: 'qi_condensation' },
  { id: 'jc_to_bp', from: 'jadeCatnip', to: 'bp', rate: 0.0001, minAmount: 1, cooldown: 0, unlockCondition: 'none' }, // 1 JC → 10000 BP
  { id: 'gf_to_jc', from: 'gooseFeathers', to: 'jadeCatnip', rate: 100, minAmount: 100, cooldown: 0, unlockCondition: 'cobra_chicken' },
  { id: 'rep_to_wt', from: 'sectReputation', to: 'waifuTokens', rate: 50, minAmount: 50, cooldown: 3600000, unlockCondition: 'waifu_unlocked' },
  { id: 'ss_to_bp', from: 'spiritStones', to: 'bp', rate: 0.0002, minAmount: 1, cooldown: 0, unlockCondition: 'pagoda_10' }, // 1 SS → 5000 BP
];

// ─── Economy System Class ──────────────────────────────────

export class EconomySystem {
  private currencies: Currencies;
  private conversionCooldowns: Record<string, number> = {};
  private permanentEffects: Record<string, number> = {};
  private activeEffects: Array<{ type: string; value: number; expiresAt: number }> = [];
  private consumables: Record<string, number> = {};
  private stats = {
    totalEarned: {} as Record<string, number>,
    totalSpent: {} as Record<string, number>,
    conversionsPerformed: 0,
    gooseShopPurchases: 0,
  };

  private currentRealm = 'mortal';

  constructor() {
    this.currencies = {
      bp: 0, pp: 0, qi: 0, jadeCatnip: 0, spiritStones: 0,
      heavenlySeals: 0, sectReputation: 0, waifuTokens: 0, gooseFeathers: 0,
    };
  }

  // ─── Core Currency Operations ──────────────────────────

  getBalance(id: CurrencyId): number {
    return this.currencies[id];
  }

  getAllBalances(): Currencies {
    return { ...this.currencies };
  }

  setBalances(currencies: Currencies): void {
    this.currencies = { ...currencies };
  }

  addCurrency(id: CurrencyId, amount: number, source?: string): number {
    if (amount <= 0) return 0;

    // Qi cap
    if (id === 'qi') {
      const cap = this.getQiCap();
      const space = cap - this.currencies.qi;
      amount = Math.min(amount, space);
      if (amount <= 0) return 0;
    }

    this.currencies[id] += amount;
    this.stats.totalEarned[id] = (this.stats.totalEarned[id] ?? 0) + amount;

    eventBus.emit(EVENTS.CURRENCY_GAIN, { currency: id, amount, source, newBalance: this.currencies[id] });
    return amount;
  }

  spendCurrency(id: CurrencyId, amount: number, purpose?: string): boolean {
    if (amount <= 0) return true;
    if (this.currencies[id] < amount) return false;

    this.currencies[id] -= amount;
    this.stats.totalSpent[id] = (this.stats.totalSpent[id] ?? 0) + amount;

    eventBus.emit(EVENTS.CURRENCY_SPEND, { currency: id, amount, purpose, newBalance: this.currencies[id] });
    return true;
  }

  canAfford(costs: Partial<Currencies>): boolean {
    for (const [id, amount] of Object.entries(costs)) {
      if (amount && this.currencies[id as CurrencyId] < amount) return false;
    }
    return true;
  }

  spendMultiple(costs: Partial<Currencies>, purpose?: string): boolean {
    if (!this.canAfford(costs)) return false;
    for (const [id, amount] of Object.entries(costs)) {
      if (amount) this.spendCurrency(id as CurrencyId, amount, purpose);
    }
    return true;
  }

  // ─── Qi Cap ────────────────────────────────────────────

  getQiCap(): number {
    return QI_CAPS[this.currentRealm] ?? 100;
  }

  setCurrentRealm(realm: string): void {
    this.currentRealm = realm;
  }

  // ─── Conversions ───────────────────────────────────────

  getConversions(): CurrencyConversion[] {
    return CONVERSIONS;
  }

  canConvert(conversionId: string): boolean {
    const conv = CONVERSIONS.find((c) => c.id === conversionId);
    if (!conv) return false;

    // Cooldown check
    const lastUsed = this.conversionCooldowns[conversionId] ?? 0;
    if (conv.cooldown > 0 && Date.now() - lastUsed < conv.cooldown) return false;

    // Balance check
    if (this.currencies[conv.from] < conv.minAmount) return false;

    return true;
  }

  convert(conversionId: string, amount?: number): { success: boolean; input: number; output: number } {
    const conv = CONVERSIONS.find((c) => c.id === conversionId);
    if (!conv || !this.canConvert(conversionId)) {
      return { success: false, input: 0, output: 0 };
    }

    const input = amount ?? conv.minAmount;
    if (this.currencies[conv.from] < input) {
      return { success: false, input: 0, output: 0 };
    }

    const output = conv.rate < 1 ? input / conv.rate : input / conv.rate;

    this.spendCurrency(conv.from, input, `convert_${conversionId}`);
    this.addCurrency(conv.to, output, `convert_${conversionId}`);
    this.conversionCooldowns[conversionId] = Date.now();
    this.stats.conversionsPerformed++;

    return { success: true, input, output };
  }

  // ─── Temporary Effects ─────────────────────────────────

  addTemporaryEffect(type: string, value: number, durationMs: number): void {
    this.activeEffects.push({
      type,
      value,
      expiresAt: Date.now() + durationMs,
    });
  }

  getActiveEffects(): Array<{ type: string; value: number }> {
    const now = Date.now();
    this.activeEffects = this.activeEffects.filter((e) => e.expiresAt > now);
    return this.activeEffects.map(({ type, value }) => ({ type, value }));
  }

  /**
   * Get a combined multiplier from all active temporary effects of a given type.
   */
  getEffectMultiplier(type: string): number {
    const active = this.getActiveEffects();
    let mult = 1;
    for (const e of active) {
      if (e.type === type) mult *= e.value;
    }
    return mult;
  }

  // ─── Permanent Effects (Goose Shop) ────────────────────

  setPermanentEffect(key: string, value: number): void {
    this.permanentEffects[key] = value;
  }

  getPermanentEffect(key: string): number {
    return this.permanentEffects[key] ?? 0;
  }

  // ─── Currency Info ─────────────────────────────────────

  getCurrencyDef(id: CurrencyId): CurrencyDef {
    return CURRENCY_DEFS[id];
  }

  getAllCurrencyDefs(): CurrencyDef[] {
    return Object.values(CURRENCY_DEFS).sort((a, b) => a.displayPriority - b.displayPriority);
  }

  // ─── Serialization ─────────────────────────────────────

  serialize() {
    return {
      currencies: { ...this.currencies },
      conversionCooldowns: { ...this.conversionCooldowns },
      permanentEffects: { ...this.permanentEffects },
      activeEffects: this.activeEffects.filter((e) => e.expiresAt > Date.now()),
      consumables: { ...this.consumables },
      stats: { ...this.stats },
      gooseShopPurchases: {},
    };
  }

  deserialize(data: {
    currencies?: Partial<Currencies>;
    conversionCooldowns?: Record<string, number>;
    permanentEffects?: Record<string, number>;
    activeEffects?: Array<{ type: string; value: number; expiresAt: number }>;
    consumables?: Record<string, number>;
    stats?: { totalEarned: Record<string, number>; totalSpent: Record<string, number>; conversionsPerformed: number; gooseShopPurchases: number };
  }): void {
    if (data.currencies) {
      for (const [key, val] of Object.entries(data.currencies)) {
        if (key in this.currencies && typeof val === 'number') {
          this.currencies[key as CurrencyId] = val;
        }
      }
    }
    if (data.conversionCooldowns) this.conversionCooldowns = data.conversionCooldowns;
    if (data.permanentEffects) this.permanentEffects = data.permanentEffects;
    if (data.activeEffects) this.activeEffects = data.activeEffects;
    if (data.consumables) this.consumables = data.consumables;
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
  }

  /**
   * Reset for prestige (keep heavenlySeals).
   */
  resetForPrestige(): void {
    const seals = this.currencies.heavenlySeals;
    this.currencies = {
      bp: 0, pp: 0, qi: 0, jadeCatnip: 0, spiritStones: 0,
      heavenlySeals: seals, sectReputation: 0, waifuTokens: 0, gooseFeathers: 0,
    };
    this.activeEffects = [];
    this.currentRealm = 'mortal';
  }
}
