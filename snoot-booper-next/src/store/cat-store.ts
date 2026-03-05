/**
 * Cat Store - Cat collection state (synced from engine.cat)
 *
 * The CatSystem in the engine is the source of truth.
 * This store mirrors it for React rendering.
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Cat, CatRealmId } from '@/engine/types';

interface CatState {
  cats: Cat[];
  selectedCatId: string | null;

  // Actions
  syncFromEngine: (cats: Cat[]) => void;
  selectCat: (instanceId: string | null) => void;
  getCat: (instanceId: string) => Cat | undefined;
  getCatsByRealm: (realm: CatRealmId) => Cat[];
  getCatCount: () => number;

  // Serialization (delegates to engine)
  serialize: () => { cats: Cat[] };
}

export const useCatStore = create<CatState>()(
  subscribeWithSelector((set, get) => ({
    cats: [],
    selectedCatId: null,

    syncFromEngine: (cats: Cat[]) => {
      set({ cats });
    },

    selectCat: (instanceId: string | null) => {
      set({ selectedCatId: instanceId });
    },

    getCat: (instanceId: string) => {
      return get().cats.find((c) => c.instanceId === instanceId);
    },

    getCatsByRealm: (realm: CatRealmId) => {
      return get().cats.filter((c) => c.realm === realm);
    },

    getCatCount: () => {
      return get().cats.length;
    },

    serialize: () => {
      return { cats: get().cats };
    },
  }))
);
