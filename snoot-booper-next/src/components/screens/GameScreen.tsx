/**
 * GameScreen - Main game view with 3D sanctuary + HTML overlay
 *
 * Phase 2: Full 3D sanctuary with cats, boop button overlay, panels.
 */

'use client';

import { useGameStore } from '@/store/game-store';
import { useCatStore } from '@/store/cat-store';
import { useUIStore, type PanelId } from '@/store/ui-store';
import { formatNumber } from '@/engine/big-number';
import { MASTERS } from '@/engine/data/masters';
import { engine } from '@/engine/engine';
import { useEffectsStore } from '@/store/effects-store';
import { useTimeVisuals } from '@/hooks/useTimeVisuals';
import { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SanctuaryScene from '../three/sanctuary/SanctuaryScene';
import UpgradePanel from '../ui/UpgradePanel';
import CatPanel from '../ui/CatPanel';
import AchievementsPanel from '../ui/AchievementsPanel';
import SocialPanel from '../ui/SocialPanel';
import ResourceBar from '../ui/ResourceBar';
import NotificationToast from '../ui/NotificationToast';
import GooseOverlay from '../ui/GooseOverlay';
import CultivationPanel from '../ui/CultivationPanel';
import BuildingPanel from '../ui/BuildingPanel';
import TechniquePanel from '../ui/TechniquePanel';
import PrestigePanel from '../ui/PrestigePanel';
import WaifuPanel from '../ui/WaifuPanel';
import EquipmentPanel from '../ui/EquipmentPanel';
import CraftingPanel from '../ui/CraftingPanel';
import DailyPanel from '../ui/DailyPanel';
import LorePanel from '../ui/LorePanel';
import CatinoPanel from '../ui/CatinoPanel';
import GoosePanel from '../ui/GoosePanel';
import SettingsPanel from '../ui/SettingsPanel';

export default function GameScreen() {
  const selectedMaster = useGameStore((s) => s.selectedMaster);
  const stats = useGameStore((s) => s.stats);
  const catCount = useCatStore((s) => s.cats.length);
  const activePanel = useUIStore((s) => s.activePanel);
  const togglePanel = useUIStore((s) => s.togglePanel);
  const [lastBoop, setLastBoop] = useState<{ bp: number; isCrit: boolean; combo: number } | null>(null);
  const [boopKey, setBoopKey] = useState(0);
  const addBoopEffect = useEffectsStore((s) => s.addBoopEffect);
  const triggerShake = useEffectsStore((s) => s.triggerShake);

  useTimeVisuals();

  const master = selectedMaster ? MASTERS[selectedMaster] : null;

  const handleBoop = useCallback(() => {
    const result = engine.performBoop();
    setLastBoop(result);
    setBoopKey((k) => k + 1);

    addBoopEffect({ position: [0, 0.5, 0], bp: result.bp, isCrit: result.isCrit });
    if (result.isCrit) {
      triggerShake(0.15, 200);
    }
  }, [addBoopEffect, triggerShake]);

  if (!master) return null;

  return (
    <div className="relative w-full h-screen bg-[#1a1a2e] overflow-hidden">
      {/* 3D Canvas (behind everything) */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [0, 12, 16], fov: 45 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <SanctuaryScene />
          </Suspense>
          <OrbitControls
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            minDistance={5}
            maxDistance={30}
            enablePan={true}
            panSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Resource Bar (top) */}
      <ResourceBar />

      {/* Notifications */}
      <NotificationToast />

      {/* Goose overlay (HP bar, timer) */}
      <GooseOverlay />

      {/* Nav buttons (left side) */}
      <div className="absolute top-16 left-4 z-10 flex flex-col gap-2">
        <NavButton label="Upgrades" emoji="⬆️" panelId="upgrades" active={activePanel === 'upgrades'} onClick={() => togglePanel('upgrades')} color="#50C878" />
        <NavButton label={`Cats (${catCount})`} emoji="🐱" panelId="cats" active={activePanel === 'cats'} onClick={() => togglePanel('cats')} color="#FFD700" />
        <NavButton label="Waifus" emoji="💕" panelId="waifus" active={activePanel === 'waifus'} onClick={() => togglePanel('waifus')} color="#FFB6C1" />
        <NavButton label="Achievements" emoji="🏆" panelId="achievements" active={activePanel === 'achievements'} onClick={() => togglePanel('achievements')} color="#FFD700" />
        <NavButton label="Social" emoji="📜" panelId="social" active={activePanel === 'social'} onClick={() => togglePanel('social')} color="#E94560" />
        <NavButton label="Cultivation" emoji="🧘" panelId="cultivation" active={activePanel === 'cultivation'} onClick={() => togglePanel('cultivation')} color="#9370DB" />
        <NavButton label="Buildings" emoji="🏯" panelId="buildings" active={activePanel === 'buildings'} onClick={() => togglePanel('buildings')} color="#8B4513" />
        <NavButton label="Techniques" emoji="⚔️" panelId="techniques" active={activePanel === 'techniques'} onClick={() => togglePanel('techniques')} color="#DC143C" />
        <NavButton label="Equipment" emoji="⚔️" panelId="equipment" active={activePanel === 'equipment'} onClick={() => togglePanel('equipment')} color="#9370DB" />
        <NavButton label="Crafting" emoji="🔨" panelId="crafting" active={activePanel === 'crafting'} onClick={() => togglePanel('crafting')} color="#DC143C" />
        <NavButton label="Daily" emoji="📋" panelId="daily" active={activePanel === 'daily'} onClick={() => togglePanel('daily')} color="#FFD700" />
        <NavButton label="Lore" emoji="📖" panelId="lore" active={activePanel === 'lore'} onClick={() => togglePanel('lore')} color="#C4A7E7" />
        <NavButton label="Cat-ino" emoji="🎰" panelId="catino" active={activePanel === 'catino'} onClick={() => togglePanel('catino')} color="#8B0000" />
        <NavButton label="Goose" emoji="🦢" panelId="goose" active={activePanel === 'goose'} onClick={() => togglePanel('goose')} color="#F5F5F5" />
        <NavButton label="Prestige" emoji="✨" panelId="prestige" active={activePanel === 'prestige'} onClick={() => togglePanel('prestige')} color="#FFD700" />
        <NavButton label="Settings" emoji="⚙️" panelId="settings" active={activePanel === 'settings'} onClick={() => togglePanel('settings')} color="#888" />
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono transition-all cursor-pointer mt-2"
          style={{
            borderColor: '#E94560',
            backgroundColor: 'rgba(233,69,96,0.15)',
            color: '#E94560',
          }}
          onClick={() => useUIStore.getState().setScreen('dungeon')}
        >
          <span>🏯</span>
          <span>Pagoda</span>
        </button>
      </div>

      {/* Side Panel */}
      {activePanel === 'upgrades' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <UpgradePanel />
        </div>
      )}
      {activePanel === 'cats' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <CatPanel />
        </div>
      )}
      {activePanel === 'achievements' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <AchievementsPanel />
        </div>
      )}
      {activePanel === 'social' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <SocialPanel />
        </div>
      )}
      {activePanel === 'cultivation' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <CultivationPanel />
        </div>
      )}
      {activePanel === 'buildings' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <BuildingPanel />
        </div>
      )}
      {activePanel === 'techniques' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <TechniquePanel />
        </div>
      )}
      {activePanel === 'prestige' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <PrestigePanel />
        </div>
      )}
      {activePanel === 'waifus' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <WaifuPanel />
        </div>
      )}
      {activePanel === 'equipment' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <EquipmentPanel />
        </div>
      )}
      {activePanel === 'crafting' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <CraftingPanel />
        </div>
      )}
      {activePanel === 'daily' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <DailyPanel />
        </div>
      )}
      {activePanel === 'lore' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <LorePanel />
        </div>
      )}
      {activePanel === 'catino' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <CatinoPanel />
        </div>
      )}
      {activePanel === 'goose' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <GoosePanel />
        </div>
      )}
      {activePanel === 'settings' && (
        <div className="absolute top-16 left-28 bottom-10 w-96 z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <SettingsPanel />
        </div>
      )}

      {/* Boop Button (bottom-right overlay) */}
      <div className="absolute bottom-20 right-8 z-10 flex flex-col items-center">
        <button
          className="w-36 h-36 rounded-full font-mono text-sm text-white font-bold cursor-pointer transition-transform active:scale-95 select-none"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #E94560, #b8304f)',
            border: '6px solid #8B0000',
            boxShadow: '0 8px 0 #5c0a0a, 0 0 30px rgba(233, 69, 96, 0.5)',
            textShadow: '2px 2px 0 #000',
          }}
          onClick={handleBoop}
        >
          BOOP
          <br />
          THE
          <br />
          SNOOT
        </button>

        {/* Boop feedback */}
        <div className="mt-2 h-6" key={boopKey}>
          {lastBoop && (
            <span
              className={`text-xs font-mono font-bold animate-bounce ${
                lastBoop.isCrit ? 'text-[#FFD700] text-sm' : 'text-[#00BFFF]'
              }`}
            >
              {lastBoop.isCrit ? 'CRITICAL! ' : ''}+{formatNumber(lastBoop.bp)} BP
              {lastBoop.combo > 1 && (
                <span className="text-[#7FFFD4] ml-1">x{lastBoop.combo}</span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Stats (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-6 px-6 py-2 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <span className="text-[10px] text-white/30 font-mono">
          Boops: {formatNumber(stats.totalBoops)}
        </span>
        <span className="text-[10px] text-white/30 font-mono">
          Combo: {stats.maxCombo}
        </span>
        <span className="text-[10px] text-white/30 font-mono">
          Crits: {formatNumber(stats.criticalBoops)}
        </span>
        <span className="text-[10px] text-white/30 font-mono">
          Cats: {catCount}
        </span>
        <span className="text-[10px] text-white/30 font-mono ml-auto">
          PP/s: {formatNumber(engine.cat.calculatePPPerSecond(engine.getModifiers()))}/s
        </span>
        <span className="text-[10px] text-white/30 font-mono">
          Auto BP/s: {formatNumber(engine.upgrade.getCombinedEffects().passiveBpPerSecond)}/s
        </span>
      </div>
    </div>
  );
}

// ─── Nav Button ────────────────────────────────────────────

function NavButton({ label, emoji, panelId, active, onClick, color }: {
  label: string; emoji: string; panelId: PanelId; active: boolean; onClick: () => void; color: string;
}) {
  return (
    <button
      className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono transition-all cursor-pointer"
      style={{
        borderColor: active ? color : 'rgba(255,255,255,0.1)',
        backgroundColor: active ? `${color}20` : 'rgba(0,0,0,0.4)',
        color: active ? color : 'rgba(255,255,255,0.5)',
      }}
      onClick={onClick}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
