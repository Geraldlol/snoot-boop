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

// HUD overlays (Phase 2 + 7)
import AudioController from '../hud/AudioController';
import ComboMeter from '../hud/ComboMeter';
import StatOverlay from '../hud/StatOverlay';
import BarkToast from '../hud/BarkToast';
import AscendCinematic from '../hud/AscendCinematic';

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
import TournamentPanel from '../ui/TournamentPanel';

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
  // 'reincarnation' is rendered as PrestigePanel with tabHint='reincarnation' in PanelRouter.
  crafting: CraftingPanel,
  daily: DailyPanel,
  catino: CatinoPanel,
  social: SocialPanel,
  sectWar: SectWarPanel,
  tournament: TournamentPanel,
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

      {/* Phase 2 + 7 HUDs */}
      <AudioController />
      <ComboMeter />
      <StatOverlay />
      <BarkToast />
      <AscendCinematic />
    </div>
  );
}

// Panels that have already been reskinned for the wuxia shell handle their
// own .panel framing. Wrapping them again would double up.
const SELF_STYLED: ReadonlyArray<PanelId> = [
  'sanctuary', 'cats', 'waifus', 'equipment', 'goose',
  'upgrades', 'techniques', 'cultivation', 'buildings', 'prestige', 'reincarnation',
  'achievements', 'lore', 'daily', 'social', 'sectWar', 'tournament',
];

function PanelRouter({ id }: { id: PanelId }) {
  if (id === 'sanctuary') return <SnootAltar />;
  if (id === 'prestige') return <PrestigePanel key="prestige" />;
  if (id === 'reincarnation') return <PrestigePanel key="reincarnation" tabHint="reincarnation" />;

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

  // Reskinned panels render bare (they own their .panel framing).
  // Legacy panels render inside a wuxia frame until reskinned in later phases.
  if (SELF_STYLED.includes(id)) {
    return <Component />;
  }
  return (
    <div className="panel panel-ornate p-6 min-h-[480px]">
      <Component />
    </div>
  );
}
