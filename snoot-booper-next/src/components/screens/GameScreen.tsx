/**
 * GameScreen - Main game view with 3D sanctuary + HTML overlay
 *
 * Phase 2: Full 3D sanctuary with cats, boop button overlay, panels.
 */

'use client';

import { useGameStore } from '@/store/game-store';
import { useCatStore } from '@/store/cat-store';
import { useUIStore, type PanelId } from '@/store/ui-store';
import { formatNumber, formatDetailed } from '@/engine/big-number';
import { MASTERS } from '@/engine/data/masters';
import { engine } from '@/engine/engine';
import { useEffectsStore } from '@/store/effects-store';
import { useTimeVisuals } from '@/hooks/useTimeVisuals';
import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
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

// Nav button groups
const NAV_GROUPS = [
  {
    label: 'Core',
    buttons: [
      { label: 'Upgrades', emoji: '\u2B06\uFE0F', panelId: 'upgrades' as PanelId, color: '#50C878' },
      { label: 'Cats', emoji: '\uD83D\uDC31', panelId: 'cats' as PanelId, color: '#FFD700', showCount: true },
      { label: 'Waifus', emoji: '\uD83D\uDC95', panelId: 'waifus' as PanelId, color: '#FFB6C1' },
    ],
  },
  {
    label: 'Combat',
    buttons: [
      { label: 'Techniques', emoji: '\u2694\uFE0F', panelId: 'techniques' as PanelId, color: '#DC143C' },
      { label: 'Equipment', emoji: '\uD83D\uDEE1\uFE0F', panelId: 'equipment' as PanelId, color: '#9370DB' },
      { label: 'Crafting', emoji: '\uD83D\uDD28', panelId: 'crafting' as PanelId, color: '#DC143C' },
    ],
  },
  {
    label: 'Systems',
    buttons: [
      { label: 'Cultivation', emoji: '\uD83E\uDDD8', panelId: 'cultivation' as PanelId, color: '#9370DB' },
      { label: 'Buildings', emoji: '\uD83C\uDFEF', panelId: 'buildings' as PanelId, color: '#8B4513' },
      { label: 'Prestige', emoji: '\u2728', panelId: 'prestige' as PanelId, color: '#FFD700' },
    ],
  },
  {
    label: 'Info',
    buttons: [
      { label: 'Achievements', emoji: '\uD83C\uDFC6', panelId: 'achievements' as PanelId, color: '#FFD700' },
      { label: 'Daily', emoji: '\uD83D\uDCCB', panelId: 'daily' as PanelId, color: '#FFD700' },
      { label: 'Lore', emoji: '\uD83D\uDCD6', panelId: 'lore' as PanelId, color: '#C4A7E7' },
      { label: 'Social', emoji: '\uD83D\uDCDC', panelId: 'social' as PanelId, color: '#E94560' },
    ],
  },
  {
    label: 'Fun',
    buttons: [
      { label: 'Cat-ino', emoji: '\uD83C\uDFB0', panelId: 'catino' as PanelId, color: '#8B0000' },
      { label: 'Goose', emoji: '\uD83E\uDDA2', panelId: 'goose' as PanelId, color: '#F5F5F5' },
    ],
  },
  {
    label: 'Meta',
    buttons: [
      { label: 'Settings', emoji: '\u2699\uFE0F', panelId: 'settings' as PanelId, color: '#888' },
    ],
  },
];

// Panel component map
const PANEL_COMPONENTS: Record<string, React.ComponentType> = {
  upgrades: UpgradePanel,
  cats: CatPanel,
  achievements: AchievementsPanel,
  social: SocialPanel,
  cultivation: CultivationPanel,
  buildings: BuildingPanel,
  techniques: TechniquePanel,
  prestige: PrestigePanel,
  waifus: WaifuPanel,
  equipment: EquipmentPanel,
  crafting: CraftingPanel,
  daily: DailyPanel,
  lore: LorePanel,
  catino: CatinoPanel,
  goose: GoosePanel,
  settings: SettingsPanel,
};

export default function GameScreen() {
  const selectedMaster = useGameStore((s) => s.selectedMaster);
  const stats = useGameStore((s) => s.stats);
  const catCount = useCatStore((s) => s.cats.length);
  const activePanel = useUIStore((s) => s.activePanel);
  const togglePanel = useUIStore((s) => s.togglePanel);
  const [lastBoop, setLastBoop] = useState<{ bp: number; isCrit: boolean; combo: number } | null>(null);
  const [boopKey, setBoopKey] = useState(0);
  const [boopRipple, setBoopRipple] = useState(false);
  const [critFlash, setCritFlash] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const addBoopEffect = useEffectsStore((s) => s.addBoopEffect);
  const triggerShake = useEffectsStore((s) => s.triggerShake);

  // Panel transition state
  const [panelVisible, setPanelVisible] = useState(false);
  const prevPanelRef = useRef<PanelId | null>(null);

  useEffect(() => {
    if (activePanel && activePanel !== prevPanelRef.current) {
      setPanelVisible(false);
      const t = setTimeout(() => setPanelVisible(true), 20);
      prevPanelRef.current = activePanel;
      return () => clearTimeout(t);
    } else if (!activePanel) {
      setPanelVisible(false);
      prevPanelRef.current = null;
    }
  }, [activePanel]);

  useTimeVisuals();

  const master = selectedMaster ? MASTERS[selectedMaster] : null;

  const handleBoop = useCallback(() => {
    const result = engine.performBoop();
    setLastBoop(result);
    setBoopKey((k) => k + 1);
    setBoopRipple(true);
    setTimeout(() => setBoopRipple(false), 400);

    addBoopEffect({ position: [0, 0.5, 0], bp: result.bp, isCrit: result.isCrit });
    if (result.isCrit) {
      triggerShake(0.15, 200);
      setCritFlash(true);
      setTimeout(() => setCritFlash(false), 100);
    }
  }, [addBoopEffect, triggerShake]);

  if (!master) return null;

  const ActivePanelComponent = activePanel ? PANEL_COMPONENTS[activePanel] : null;

  return (
    <div className="relative w-full h-screen bg-[#1a1a2e] overflow-hidden">
      {/* Crit flash overlay */}
      {critFlash && (
        <div className="absolute inset-0 z-50 bg-white/10 pointer-events-none" />
      )}

      {/* 3D Canvas (behind everything) */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [0, 12, 16], fov: 45 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={<SceneLoadingFallback onReady={() => setSceneLoaded(true)} />}>
            <SanctuaryScene />
            <OnSceneReady onReady={() => setSceneLoaded(true)} />
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

      {/* Loading overlay */}
      {!sceneLoaded && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#1a1a2e]">
          <div className="w-8 h-8 border-2 border-[#50C878] border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-sm font-mono text-[#50C878]/80">Loading Sanctuary...</span>
        </div>
      )}

      {/* Resource Bar (top) */}
      <ResourceBar />

      {/* Notifications */}
      <NotificationToast />

      {/* Goose overlay (HP bar, timer) */}
      <GooseOverlay />

      {/* Nav buttons (left side) — scrollable with groups */}
      <div className="absolute top-16 left-4 z-10 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-5rem)] pr-1 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <span className="text-[9px] text-white/50 font-mono uppercase tracking-widest px-3 py-1 block">
              {group.label}
            </span>
            {group.buttons.map((btn) => (
              <NavButton
                key={btn.panelId}
                label={btn.showCount ? `${btn.label} (${catCount})` : btn.label}
                emoji={btn.emoji}
                panelId={btn.panelId}
                active={activePanel === btn.panelId}
                onClick={() => togglePanel(btn.panelId)}
                color={btn.color}
              />
            ))}
          </div>
        ))}
        {/* Pagoda button */}
        <div className="mt-2">
          <button
            className="flex items-center gap-2 px-3 py-3 rounded-lg border text-xs font-mono transition-all cursor-pointer w-full focus-visible:ring-2 focus-visible:ring-[#50C878]"
            style={{
              borderColor: '#E94560',
              backgroundColor: 'rgba(233,69,96,0.15)',
              color: '#E94560',
            }}
            onClick={() => useUIStore.getState().setScreen('dungeon')}
            aria-label="Enter the Infinite Pagoda dungeon"
          >
            <span>{'\uD83C\uDFEF'}</span>
            <span>Pagoda</span>
          </button>
        </div>
        {/* Bottom fade gradient */}
        <div className="h-4 flex-shrink-0" />
      </div>

      {/* Side Panel with slide-in transition */}
      {activePanel && ActivePanelComponent && (
        <div
          className="absolute top-16 left-28 bottom-10 w-96 max-w-[calc(100vw-8rem)] z-20 overflow-y-auto bg-[#16213e]/95 backdrop-blur-md border border-white/10 rounded-lg p-4 transition-all duration-200"
          style={{
            transform: panelVisible ? 'translateX(0)' : 'translateX(-20px)',
            opacity: panelVisible ? 1 : 0,
          }}
          role="dialog"
          aria-label={`${activePanel} panel`}
        >
          {/* Mobile close button */}
          <button
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded text-white/40 hover:text-white/80 hover:bg-white/10 md:hidden focus-visible:ring-2 focus-visible:ring-[#50C878]"
            onClick={() => togglePanel(activePanel)}
            aria-label="Close panel"
          >
            {'\u2715'}
          </button>
          <ActivePanelComponent />
        </div>
      )}

      {/* Boop Button (bottom-right overlay) */}
      <div className="absolute bottom-20 right-8 z-10 flex flex-col items-center">
        <div className="relative">
          <button
            className="w-36 h-36 rounded-full font-mono text-sm text-white font-bold cursor-pointer transition-transform active:scale-95 select-none focus-visible:ring-4 focus-visible:ring-[#50C878]"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #E94560, #b8304f)',
              border: '6px solid #8B0000',
              boxShadow: '0 8px 0 #5c0a0a, 0 0 30px rgba(233, 69, 96, 0.5)',
              textShadow: '2px 2px 0 #000',
            }}
            onClick={handleBoop}
            aria-label="Boop the snoot"
          >
            BOOP
            <br />
            THE
            <br />
            SNOOT
          </button>
          {/* Ripple effect on click */}
          {boopRipple && (
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: '3px solid rgba(233, 69, 96, 0.6)',
                animation: 'boopRipple 0.4s ease-out forwards',
              }}
            />
          )}
        </div>

        {/* Boop feedback — floating number */}
        <div className="mt-2 h-8 relative" key={boopKey}>
          {lastBoop && (
            <span
              className={`absolute left-1/2 -translate-x-1/2 text-xs font-mono font-bold whitespace-nowrap ${
                lastBoop.isCrit ? 'text-[#FFD700] text-base' : 'text-[#00BFFF]'
              }`}
              style={{ animation: 'boopFloat 0.6s ease-out forwards' }}
            >
              {lastBoop.isCrit ? 'CRITICAL! ' : ''}+{formatNumber(lastBoop.bp)} BP
              {lastBoop.combo > 1 && (
                <span
                  className="text-[#7FFFD4] ml-1 font-bold"
                  style={{
                    textShadow: lastBoop.combo > 10 ? '0 0 8px #7FFFD4' : 'none',
                    fontSize: Math.min(1.2, 0.8 + lastBoop.combo * 0.02) + 'em',
                  }}
                >
                  x{lastBoop.combo}
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Stats (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-6 px-6 py-2 bg-black/50 backdrop-blur-sm border-t border-white/10">
        <StatItem icon={'\uD83D\uDC46'} label="Boops" value={formatNumber(stats.totalBoops)} full={formatDetailed(stats.totalBoops)} />
        <StatItem icon={'\uD83D\uDD25'} label="Combo" value={String(stats.maxCombo)} />
        <StatItem icon={'\uD83C\uDFAF'} label="Crits" value={formatNumber(stats.criticalBoops)} full={formatDetailed(stats.criticalBoops)} />
        <StatItem icon={'\uD83D\uDC31'} label="Cats" value={String(catCount)} />
        <span className="ml-auto" />
        <StatItem icon={'\uD83D\uDE3A'} label="PP/s" value={`${formatNumber(engine.cat.calculatePPPerSecond(engine.getModifiers()))}/s`} />
        <StatItem icon={'\u26A1'} label="Auto BP/s" value={`${formatNumber(engine.upgrade.getCombinedEffects().passiveBpPerSecond)}/s`} />
      </div>

      {/* Boop animation keyframes */}
      <style>{`
        @keyframes boopFloat {
          0% { transform: translateX(-50%) translateY(0); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-30px); opacity: 0; }
        }
        @keyframes boopRipple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}

// ─── Scene loading helpers ─────────────────────────────────

function SceneLoadingFallback({ onReady: _ }: { onReady: () => void }) {
  // Minimal 3D fallback (just ambient light while loading)
  return <ambientLight intensity={0.2} />;
}

function OnSceneReady({ onReady }: { onReady: () => void }) {
  const calledRef = useRef(false);
  useEffect(() => {
    if (!calledRef.current) {
      calledRef.current = true;
      onReady();
    }
  }, [onReady]);
  return null;
}

// ─── Stat Item ─────────────────────────────────────────────

function StatItem({ icon, label, value, full }: { icon: string; label: string; value: string; full?: string }) {
  return (
    <span className="text-xs text-white/50 font-mono flex items-center gap-1" title={full ?? value}>
      <span className="text-xs">{icon}</span>
      <span className="text-white/35">{label}:</span>
      <span>{value}</span>
    </span>
  );
}

// ─── Nav Button ────────────────────────────────────────────

function NavButton({ label, emoji, panelId, active, onClick, color }: {
  label: string; emoji: string; panelId: PanelId; active: boolean; onClick: () => void; color: string;
}) {
  return (
    <button
      className="flex items-center gap-2 px-3 py-3 rounded-lg border text-xs font-mono transition-all cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#50C878]"
      style={{
        borderColor: active ? color : 'rgba(255,255,255,0.1)',
        backgroundColor: active ? `${color}20` : 'rgba(0,0,0,0.4)',
        color: active ? color : 'rgba(255,255,255,0.5)',
      }}
      onClick={onClick}
      aria-label={`Open ${panelId} panel`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
