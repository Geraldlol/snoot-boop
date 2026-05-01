/**
 * useAutoSave - Auto-save hook using engine state
 */

'use client';

import { useEffect, useRef } from 'react';
import { SaveManager } from '@/engine/save';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { engine } from '@/engine/engine';
import type { SaveDataV3 } from '@/engine/types';

const saveManager = new SaveManager();

export function buildSaveData(): SaveDataV3 {
  const game = useGameStore.getState();
  const engineData = engine.buildSaveData();

  return {
    version: '3.0.0',
    timestamp: Date.now(),
    master: engineData.master,
    resources: engineData.resources,
    stats: game.stats,
    cats: engineData.cats,
    upgrades: engineData.upgrades,
    economy: engineData.economy as SaveDataV3['economy'],
    // Phase 3 systems
    waifus: engineData.waifus as unknown as SaveDataV3['waifus'],
    goose: engineData.goose as unknown as SaveDataV3['goose'],
    achievements: engineData.achievements as unknown as SaveDataV3['achievements'],
    cultivation: engineData.cultivation as unknown as SaveDataV3['cultivation'],
    buildings: engineData.buildings as unknown as SaveDataV3['buildings'],
    prestige: engineData.prestige as unknown as SaveDataV3['prestige'],
    equipment: engineData.equipment as unknown as SaveDataV3['equipment'],
    crafting: engineData.crafting as unknown as SaveDataV3['crafting'],
    pagoda: engineData.pagoda as unknown as SaveDataV3['pagoda'],
    techniques: engineData.techniques as unknown as SaveDataV3['techniques'],
    blessings: engineData.blessings as unknown as SaveDataV3['blessings'],
    survival: engineData.survival as unknown as SaveDataV3['survival'],
    goldenSnoot: engineData.goldenSnoot as unknown as SaveDataV3['goldenSnoot'],
    daily: engineData.daily as unknown as SaveDataV3['daily'],
    parasites: engineData.parasites as unknown as SaveDataV3['parasites'],
    time: engineData.time as unknown as SaveDataV3['time'],
    events: engineData.events as unknown as SaveDataV3['events'],
    lore: engineData.lore as unknown as SaveDataV3['lore'],
    secrets: engineData.secrets as unknown as SaveDataV3['secrets'],
    tournament: engineData.tournament as unknown as SaveDataV3['tournament'],
    dreamRealm: engineData.dreamRealm as unknown as SaveDataV3['dreamRealm'],
    gooseDimension: engineData.gooseDimension as unknown as SaveDataV3['gooseDimension'],
    memoryFragments: engineData.memoryFragments as unknown as SaveDataV3['memoryFragments'],
    irlIntegration: engineData.irlIntegration as unknown as SaveDataV3['irlIntegration'],
    drama: engineData.drama as unknown as SaveDataV3['drama'],
    nemesis: engineData.nemesis as unknown as SaveDataV3['nemesis'],
    catino: engineData.catino as unknown as SaveDataV3['catino'],
    hardcore: engineData.hardcore as unknown as SaveDataV3['hardcore'],
    partners: engineData.partners as unknown as SaveDataV3['partners'],
  };
}

export function saveGameNow(): boolean {
  return saveManager.save(buildSaveData());
}

export function useAutoSave() {
  const initialized = useGameStore((s) => s.initialized);
  const flashSave = useUIStore((s) => s.flashSaveIndicator);
  const managerRef = useRef(saveManager);

  useEffect(() => {
    if (!initialized) return;

    const manager = managerRef.current;

    manager.startAutoSave(() => {
      flashSave();
      return buildSaveData();
    });

    return () => {
      manager.stopAutoSave();
    };
  }, [initialized, flashSave]);
}
