/**
 * GameScreen — Wuxia shell.
 *
 * Layout: WorldCanvas + ParallaxMountains (fixed bg) → Header (sticky HUD) →
 *         max-width container → SectTicker → [Sidebar | active panel].
 *
 * The 3D sanctuary was removed in favor of the parallax canvas + Snoot Altar.
 * Panels mount full-width inside the main content area. Phases 3–6 will reskin
 * each panel to match the new visual language; for now they render in their
 * existing styles inside a wuxia panel frame.
 */

'use client';

import { useUIStore, type PanelId } from '@/store/ui-store';
import { useGameStore } from '@/store/game-store';
import { MASTERS } from '@/engine/data/masters';
import { useTimeVisuals } from '@/hooks/useTimeVisuals';

import WorldCanvas from '../shell/WorldCanvas';
import ParallaxMountains from '../shell/ParallaxMountains';
import Header from '../shell/Header';
import Sidebar from '../shell/Sidebar';
import SectTicker from '../shell/SectTicker';
import SnootAltar from '../altar/SnootAltar';

// Existing panels — kept as-is in Phase 1, reskinned in later phases.
import UpgradePanel from '../ui/UpgradePanel';
import CatPanel from '../ui/CatPanel';
import AchievementsPanel from '../ui/AchievementsPanel';
import SocialPanel from '../ui/SocialPanel';
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
import SectWarPanel from '../ui/SectWarPanel';

// Overlays
import NotificationToast from '../ui/NotificationToast';
import GooseOverlay from '../ui/GooseOverlay';

const PANEL_COMPONENTS: Partial<Record<PanelId, React.ComponentType>> = {
  cats: CatPanel,
  waifus: WaifuPanel,
  upgrades: UpgradePanel,
  equipment: EquipmentPanel,
  buildings: BuildingPanel,
  cultivation: CultivationPanel,
  techniques: TechniquePanel,
  goose: GoosePanel,
  achievements: AchievementsPanel,
  lore: LorePanel,
  settings: SettingsPanel,
  prestige: PrestigePanel,
  reincarnation: PrestigePanel, // shares engine.prestige; tab inside selects reincarnation view in Phase 4
  crafting: CraftingPanel,
  daily: DailyPanel,
  catino: CatinoPanel,
  social: SocialPanel,
  sectWar: SectWarPanel,
  // Phase 5 will add a real TournamentPanel; for Phase 1 we render a placeholder.
};

export default function GameScreen() {
  const selectedMaster = useGameStore((s) => s.selectedMaster);
  const activePanel = useUIStore((s) => s.activePanel);

  // Engine ticks day/night visuals via this hook (kept from old shell).
  useTimeVisuals();

  if (!selectedMaster) return null;
  const master = MASTERS[selectedMaster];
  if (!master) return null;

  return (
    <div className="min-h-screen w-full">
      {/* Atmospheric backdrop */}
      <WorldCanvas />
      <ParallaxMountains />

      {/* Top HUD */}
      <Header />

      {/* Main content */}
      <div className="max-w-[1600px] mx-auto px-8 pb-24 pt-6 relative" style={{ zIndex: 5 }}>
        <SectTicker />

        <div className="flex gap-6 items-start">
          <Sidebar />

          <div className="flex-1 min-w-0">
            <PanelRouter id={activePanel} />
          </div>
        </div>
      </div>

      {/* Overlays */}
      <NotificationToast />
      <GooseOverlay />
    </div>
  );
}

function PanelRouter({ id }: { id: PanelId }) {
  if (id === 'sanctuary') return <SnootAltar />;

  if (id === 'tournament') {
    return (
      <div className="panel panel-ornate p-8 min-h-[480px] flex flex-col items-center justify-center text-center">
        <div className="glyph-badge mb-4" style={{ color: 'var(--gold-bright)', width: 56, height: 56 }}>
          <span style={{ fontSize: 22 }}>盃</span>
        </div>
        <div className="h-section mb-2">Celestial Tournament</div>
        <div className="h-eyebrow mb-6">Weekly bracket of the Seven Friends</div>
        <p className="text-sm max-w-md" style={{ color: 'var(--ink-mute)' }}>
          The tournament hall is being prepared. Visit again once the engine
          extensions in Phase 2 are complete.
        </p>
      </div>
    );
  }

  const Component = PANEL_COMPONENTS[id];
  if (!Component) {
    return (
      <div className="panel panel-ornate p-8 text-center">
        <div className="h-eyebrow">unknown sanctum</div>
        <p className="text-sm mt-2" style={{ color: 'var(--ink-mute)' }}>
          The path to {id} is not yet open.
        </p>
      </div>
    );
  }

  // Existing panels render inside a wuxia frame. Their internals stay the
  // current style until Phases 3–6 reskin them.
  return (
    <div className="panel panel-ornate p-6 min-h-[480px]">
      <Component />
    </div>
  );
}
