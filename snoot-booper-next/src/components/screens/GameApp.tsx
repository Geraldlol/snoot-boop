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
    // SaveDataV3 fields are structurally compatible with engine.init's expected types.
    // We spread saveData and only override fields that need specific shaping.
    engine.init(saveData ? {
      ...saveData as unknown as Parameters<typeof engine.init>[0],
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
    } : undefined);

    // Sync initial engine state to stores
    useCatStore.setState({ cats: engine.cat.getAllCats() });
    if (saveData?.master) {
      useGameStore.setState({ selectedMaster: saveData.master as MasterId });
      useUIStore.setState({ currentScreen: 'game' });
    }

    // Check AFK return
    let afkTimeout: number | undefined;
    const afk = engine.calculateAFKReturn();
    if (afk && afk.timeAway > 0) {
      afkTimeout = window.setTimeout(() => setAfkResult(afk), 0);
    }

    // Start game loop
    gameLoop.start();
    useGameStore.setState({ initialized: true, sessionStartTime: Date.now(), lastTickTime: Date.now() });

    return () => {
      if (afkTimeout !== undefined) window.clearTimeout(afkTimeout);
    };
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
