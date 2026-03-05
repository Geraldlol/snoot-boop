/**
 * Combat Store - Active dungeon/combat state
 */

import { create } from 'zustand';
import type { DungeonRun, DungeonFloor, BoopCommand } from '@/engine/types';

type CombatScreen = 'none' | 'pagoda' | 'survival' | 'tournament' | 'dream' | 'goose_dimension' | 'memory';

interface CombatState {
  activeScreen: CombatScreen;
  currentRun: DungeonRun | null;
  currentFloor: DungeonFloor | null;
  qiMeter: number;
  maxQi: number;
  isPaused: boolean;

  // Actions
  startRun: (run: DungeonRun) => void;
  endRun: () => void;
  setFloor: (floor: DungeonFloor) => void;
  setQi: (qi: number) => void;
  addQi: (amount: number) => void;
  spendQi: (amount: number) => boolean;
  setScreen: (screen: CombatScreen) => void;
  setPaused: (paused: boolean) => void;
}

export const useCombatStore = create<CombatState>()((set, get) => ({
  activeScreen: 'none',
  currentRun: null,
  currentFloor: null,
  qiMeter: 0,
  maxQi: 10,
  isPaused: false,

  startRun: (run: DungeonRun) => {
    set({
      currentRun: run,
      currentFloor: run.currentFloor,
      qiMeter: 0,
      maxQi: run.maxQi,
    });
  },

  endRun: () => {
    set({
      currentRun: null,
      currentFloor: null,
      qiMeter: 0,
      activeScreen: 'none',
    });
  },

  setFloor: (floor: DungeonFloor) => {
    set({ currentFloor: floor });
  },

  setQi: (qi: number) => {
    set({ qiMeter: Math.min(qi, get().maxQi) });
  },

  addQi: (amount: number) => {
    set((state) => ({
      qiMeter: Math.min(state.qiMeter + amount, state.maxQi),
    }));
  },

  spendQi: (amount: number): boolean => {
    const state = get();
    if (state.qiMeter < amount) return false;
    set({ qiMeter: state.qiMeter - amount });
    return true;
  },

  setScreen: (screen: CombatScreen) => {
    set({ activeScreen: screen });
  },

  setPaused: (paused: boolean) => {
    set({ isPaused: paused });
  },
}));
