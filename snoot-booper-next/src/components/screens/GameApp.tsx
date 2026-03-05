/**
 * GameApp - Root game component. Routes between screens.
 * Initializes the engine, connects it to Zustand, and routes screens.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { useCatStore } from '@/store/cat-store';
import { useUIStore } from '@/store/ui-store';
import { useAutoSave } from '@/hooks/useAutoSave';
import { SaveManager } from '@/engine/save';
import { engine } from '@/engine/engine';
import { gameLoop } from '@/engine/game-loop';
import MasterSelect from './MasterSelect';
import GameScreen_ from './GameScreen';
import DungeonScreen from './DungeonScreen';
import AFKReturnModal from '../ui/AFKReturnModal';
import type { MasterId } from '@/engine/types';
import type { AFKGainsResult } from '@/engine/systems/core/idle-system';

const saveManager = new SaveManager();

export default function GameApp() {
  const initialized = useGameStore((s) => s.initialized);
  const selectedMaster = useGameStore((s) => s.selectedMaster);
  const currentScreen = useUIStore((s) => s.currentScreen);
  const bootedRef = useRef(false);
  const [afkResult, setAfkResult] = useState<AFKGainsResult | null>(null);

  // Boot: load save, init engine, connect to Zustand, start loop
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    // Connect engine → Zustand
    engine.setOnStateChange((patch) => {
      const updates: Record<string, unknown> = {};
      if (patch.currencies) updates.currencies = patch.currencies;
      if (patch.stats) {
        const current = useGameStore.getState().stats;
        updates.stats = { ...current, ...patch.stats };
      }
      if (patch.modifiers) updates.modifiers = patch.modifiers;
      if (patch.activeGoose !== undefined) updates.activeGoose = patch.activeGoose ?? null;
      if (patch.buildings) updates.buildings = patch.buildings;
      useGameStore.setState(updates);
      if (patch.cats) useCatStore.setState({ cats: patch.cats });

      // Dispatch notifications as custom events for NotificationToast
      if (patch.notifications) {
        for (const note of patch.notifications) {
          window.dispatchEvent(new CustomEvent('game-notification', { detail: note }));
        }
      }
    });

    // Load save
    const saveData = saveManager.load();

    // Init engine with save data
    engine.init(saveData ? {
      master: saveData.master as MasterId | null,
      resources: saveData.resources,
      stats: {
        totalBoops: saveData.stats.totalBoops,
        maxCombo: saveData.stats.maxCombo,
        criticalBoops: saveData.stats.criticalBoops,
      },
      upgrades: saveData.upgrades,
      economy: saveData.economy,
      cats: saveData.cats as { cats?: unknown[]; catIdCounter?: number; version?: number },
      waifus: saveData.waifus as unknown as Record<string, unknown> | undefined,
      goose: saveData.goose as unknown as Record<string, unknown> | undefined,
      events: saveData.events as unknown as Record<string, unknown> | undefined,
      time: saveData.time as unknown as Record<string, unknown> | undefined,
      daily: saveData.daily as unknown as Record<string, unknown> | undefined,
      achievements: saveData.achievements as unknown as Record<string, unknown> | undefined,
      // Phase 4
      cultivation: saveData.cultivation as unknown as Record<string, unknown> | undefined,
      prestige: saveData.prestige as unknown as Record<string, unknown> | undefined,
      buildings: saveData.buildings as unknown as Record<string, unknown> | undefined,
      techniques: saveData.techniques as unknown as Record<string, unknown> | undefined,
      blessings: saveData.blessings as unknown as Record<string, unknown> | undefined,
      // Phase 5
      equipment: saveData.equipment as unknown as Record<string, unknown> | undefined,
      crafting: saveData.crafting as unknown as Record<string, unknown> | undefined,
      // Phase 6
      pagoda: saveData.pagoda as unknown as Record<string, unknown> | undefined,
      survival: saveData.survival as unknown as Record<string, unknown> | undefined,
      tournament: saveData.tournament as unknown as Record<string, unknown> | undefined,
      dreamRealm: saveData.dreamRealm as unknown as Record<string, unknown> | undefined,
      gooseDimension: saveData.gooseDimension as unknown as Record<string, unknown> | undefined,
      memoryFragments: saveData.memoryFragments as unknown as Record<string, unknown> | undefined,
      // Phase 7
      lore: saveData.lore as unknown as Record<string, unknown> | undefined,
      secrets: saveData.secrets as unknown as Record<string, unknown> | undefined,
      catino: saveData.catino as unknown as Record<string, unknown> | undefined,
      drama: saveData.drama as unknown as Record<string, unknown> | undefined,
      nemesis: saveData.nemesis as unknown as Record<string, unknown> | undefined,
      hardcore: saveData.hardcore as unknown as Record<string, unknown> | undefined,
      irlIntegration: saveData.irlIntegration as unknown as Record<string, unknown> | undefined,
      partners: saveData.partners as unknown as Record<string, unknown> | undefined,
      parasites: saveData.parasites as unknown as Record<string, unknown> | undefined,
      goldenSnoot: saveData.goldenSnoot as unknown as Record<string, unknown> | undefined,
      elemental: (saveData as unknown as Record<string, unknown>).elemental as Record<string, unknown> | undefined,
      sectWar: (saveData as unknown as Record<string, unknown>).sectWar as Record<string, unknown> | undefined,
      idle: (saveData as unknown as Record<string, unknown>).idle as Record<string, unknown> | undefined,
    } : undefined);

    // Sync initial engine state to stores
    useCatStore.setState({ cats: engine.cat.getAllCats() });
    if (saveData?.master) {
      useGameStore.setState({ selectedMaster: saveData.master as MasterId });
      useUIStore.setState({ currentScreen: 'game' });
    }

    // Check AFK return
    const afk = engine.calculateAFKReturn();
    if (afk && afk.timeAway > 0) {
      setAfkResult(afk);
    }

    // Start game loop
    gameLoop.start();
    useGameStore.setState({ initialized: true, sessionStartTime: Date.now(), lastTickTime: Date.now() });
  }, []);

  // Auto-save
  useAutoSave();

  if (!initialized) return null;

  const handleCollectAFK = () => {
    if (afkResult) {
      engine.applyAFKReturn(afkResult);
      setAfkResult(null);
    }
  };

  switch (currentScreen) {
    case 'master_select':
      return <MasterSelect />;
    case 'game':
      return (
        <>
          <GameScreen_ />
          {afkResult && selectedMaster && (
            <AFKReturnModal
              result={afkResult}
              masterId={selectedMaster}
              onCollect={handleCollectAFK}
            />
          )}
        </>
      );
    case 'dungeon':
      return <DungeonScreen />;
    default:
      return <MasterSelect />;
  }
}
