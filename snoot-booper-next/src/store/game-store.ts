/**
 * Game Store - Core game state (currencies, boop, master, modifiers)
 * Zustand slice for the main game loop state.
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { MasterId, Currencies, CurrencyId, GameStats, GameModifiers } from '@/engine/types';
import type { ActiveGoose } from '@/engine/systems/events/goose-system';

interface BoopState {
  boopPower: number;
  critChance: number;
  critMultiplier: number;
  comboCount: number;
  comboTimer: ReturnType<typeof setTimeout> | null;
  isMeditating: boolean;
}

interface GameState {
  // Core
  initialized: boolean;
  paused: boolean;
  selectedMaster: MasterId | null;

  // Currencies
  currencies: Currencies;

  // Boop
  boop: BoopState;

  // Stats
  stats: GameStats;

  // Aggregated modifiers from all systems
  modifiers: GameModifiers;

  // Active goose (if any)
  activeGoose: ActiveGoose | null;

  // Buildings (synced from engine for 3D rendering)
  buildings: Record<string, number>;

  // Playtime tracking
  sessionStartTime: number;
  lastTickTime: number;

  // Actions
  initialize: () => void;
  selectMaster: (id: MasterId) => void;
  addCurrency: (id: CurrencyId, amount: number) => void;
  spendCurrency: (id: CurrencyId, amount: number) => boolean;
  getCurrency: (id: CurrencyId) => number;
  performBoop: () => { bp: number; isCrit: boolean; combo: number };
  updateModifiers: (mods: Partial<GameModifiers>) => void;
  tick: (deltaMs: number) => void;
  setPaused: (paused: boolean) => void;
  resetForPrestige: (keepData: Partial<GameState>) => void;
}

const DEFAULT_CURRENCIES: Currencies = {
  bp: 0,
  pp: 0,
  qi: 0,
  jadeCatnip: 0,
  spiritStones: 0,
  heavenlySeals: 0,
  sectReputation: 0,
  destinyThreads: 0,
  waifuTokens: 0,
  gooseFeathers: 0,
};

const DEFAULT_STATS: GameStats = {
  totalBoops: 0,
  maxCombo: 0,
  playtime: 0,
  criticalBoops: 0,
  gooseBoops: 0,
  totalAfkTime: 0,
  rageGooseBooped: false,
  goldenGooseCrit: false,
  catsRecruited: 0,
  gooseCriticals: 0,
};

const DEFAULT_MODIFIERS: GameModifiers = {
  bpMultiplier: 1,
  ppMultiplier: 1,
  afkMultiplier: 1,
  critChanceBonus: 0,
  critMultiplier: 10,
  catHappinessMultiplier: 1,
  happinessDecayReduction: 0,
  happinessGain: 0,
  catCapacity: 10,
  eventDiscoveryBonus: 1,
  gooseSpawnBonus: 0,
  rareCatBonus: 1,
  boopSpeedMultiplier: 1,
  preventDecay: false,
  lootBonus: 1,
  qiRegen: 1,
  allStats: 1,
  boopDamage: 1,
};

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    initialized: false,
    paused: false,
    selectedMaster: null,
    currencies: { ...DEFAULT_CURRENCIES },
    boop: {
      boopPower: 1,
      critChance: 0.05,
      critMultiplier: 10,
      comboCount: 0,
      comboTimer: null,
      isMeditating: false,
    },
    stats: { ...DEFAULT_STATS },
    modifiers: { ...DEFAULT_MODIFIERS },
    activeGoose: null,
    buildings: {},
    sessionStartTime: Date.now(),
    lastTickTime: Date.now(),

    initialize: () => {
      set({
        initialized: true,
        sessionStartTime: Date.now(),
        lastTickTime: Date.now(),
      });
    },

    selectMaster: (id: MasterId) => {
      set({ selectedMaster: id });
    },

    addCurrency: (id: CurrencyId, amount: number) => {
      set((state) => ({
        currencies: {
          ...state.currencies,
          [id]: state.currencies[id] + amount,
        },
      }));
    },

    spendCurrency: (id: CurrencyId, amount: number): boolean => {
      const state = get();
      if (state.currencies[id] < amount) return false;
      set((s) => ({
        currencies: {
          ...s.currencies,
          [id]: s.currencies[id] - amount,
        },
      }));
      return true;
    },

    getCurrency: (id: CurrencyId): number => {
      return get().currencies[id];
    },

    performBoop: () => {
      const state = get();
      const { boop, modifiers } = state;

      // Critical check
      const critChance = boop.critChance + modifiers.critChanceBonus;
      const isCrit = Math.random() < critChance;

      // Combo
      const newCombo = boop.comboCount + 1;
      if (boop.comboTimer) clearTimeout(boop.comboTimer);
      const comboTimer = setTimeout(() => {
        set((s) => ({ boop: { ...s.boop, comboCount: 0, comboTimer: null } }));
      }, 2000);

      // Calculate BP
      const comboBonus = 1 + Math.min(newCombo, 100) * 0.01;
      let bp = boop.boopPower * modifiers.bpMultiplier * comboBonus * modifiers.boopDamage;
      if (isCrit) bp *= boop.critMultiplier;

      // Meditation bonus (Gerald)
      if (boop.isMeditating) bp *= 1.25;

      set((s) => ({
        currencies: {
          ...s.currencies,
          bp: s.currencies.bp + bp,
        },
        boop: {
          ...s.boop,
          comboCount: newCombo,
          comboTimer,
        },
        stats: {
          ...s.stats,
          totalBoops: s.stats.totalBoops + 1,
          maxCombo: Math.max(s.stats.maxCombo, newCombo),
          criticalBoops: s.stats.criticalBoops + (isCrit ? 1 : 0),
        },
      }));

      return { bp, isCrit, combo: newCombo };
    },

    updateModifiers: (mods: Partial<GameModifiers>) => {
      set((state) => ({
        modifiers: { ...state.modifiers, ...mods },
      }));
    },

    tick: (deltaMs: number) => {
      set((state) => ({
        stats: {
          ...state.stats,
          playtime: state.stats.playtime + deltaMs,
        },
        lastTickTime: Date.now(),
      }));
    },

    setPaused: (paused: boolean) => {
      set({ paused });
    },

    resetForPrestige: (keepData: Partial<GameState>) => {
      set({
        currencies: { ...DEFAULT_CURRENCIES },
        boop: {
          boopPower: 1,
          critChance: 0.05,
          critMultiplier: 10,
          comboCount: 0,
          comboTimer: null,
          isMeditating: false,
        },
        stats: { ...DEFAULT_STATS },
        modifiers: { ...DEFAULT_MODIFIERS },
        ...keepData,
      });
    },
  }))
);
