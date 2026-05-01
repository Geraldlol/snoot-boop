'use client';

import Image from 'next/image';
import { useUIStore, type PanelId } from '@/store/ui-store';
import { useGameStore } from '@/store/game-store';
import { useCatStore } from '@/store/cat-store';
import { engine } from '@/engine/engine';
import { starterArt } from '@/lib/art-assets';

interface NavAction {
  type: 'panel' | 'screen';
  panelId?: PanelId;
  screenId?: 'dungeon';
}

interface NavItem {
  id: string;
  glyph: string;
  iconSrc: string;
  label: string;
  action: NavAction;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    group: 'Sanctuary',
    items: [
      { id: 'sanctuary', glyph: 'SB', iconSrc: starterArt.icons.boopCoin, label: 'Snoot Altar', action: { type: 'panel', panelId: 'sanctuary' } },
      { id: 'cats', glyph: 'CT', iconSrc: starterArt.icons.pawSpirit, label: 'Roster', action: { type: 'panel', panelId: 'cats' } },
      { id: 'waifus', glyph: 'BD', iconSrc: starterArt.icons.moonTea, label: 'Bond Hall', action: { type: 'panel', panelId: 'waifus' } },
      { id: 'equipment', glyph: 'RL', iconSrc: starterArt.icons.clawCharm, label: 'Relics', action: { type: 'panel', panelId: 'equipment' } },
      { id: 'goose', glyph: 'GW', iconSrc: starterArt.icons.koiTreat, label: 'Goose Watch', action: { type: 'panel', panelId: 'goose' } },
    ],
  },
  {
    group: 'Progression',
    items: [
      { id: 'upgrades', glyph: 'UP', iconSrc: starterArt.icons.qiOrb, label: 'Upgrades', action: { type: 'panel', panelId: 'upgrades' } },
      { id: 'techniques', glyph: 'TC', iconSrc: starterArt.icons.scroll, label: 'Techniques', action: { type: 'panel', panelId: 'techniques' } },
      { id: 'cultivation', glyph: 'RM', iconSrc: starterArt.icons.lotusBadge, label: 'Realms', action: { type: 'panel', panelId: 'cultivation' } },
      { id: 'buildings', glyph: 'SH', iconSrc: starterArt.icons.bell, label: 'Sect Hall', action: { type: 'panel', panelId: 'buildings' } },
      { id: 'crafting', glyph: 'FG', iconSrc: starterArt.icons.incense, label: 'Forge', action: { type: 'panel', panelId: 'crafting' } },
      { id: 'dungeon', glyph: 'DG', iconSrc: starterArt.icons.talisman, label: 'Dungeon', action: { type: 'screen', screenId: 'dungeon' } },
      { id: 'prestige', glyph: 'DT', iconSrc: starterArt.icons.tournamentMedallion, label: 'Dao Tree', action: { type: 'panel', panelId: 'prestige' } },
    ],
  },
  {
    group: 'Sect',
    items: [
      { id: 'achievements', glyph: 'AC', iconSrc: starterArt.icons.tournamentMedallion, label: 'Achievements', action: { type: 'panel', panelId: 'achievements' } },
      { id: 'lore', glyph: 'LR', iconSrc: starterArt.icons.scroll, label: 'Lore', action: { type: 'panel', panelId: 'lore' } },
      { id: 'daily', glyph: 'DY', iconSrc: starterArt.icons.moonTea, label: 'Daily', action: { type: 'panel', panelId: 'daily' } },
      { id: 'social', glyph: 'FR', iconSrc: starterArt.icons.pawSpirit, label: 'Friends', action: { type: 'panel', panelId: 'social' } },
      { id: 'sectWar', glyph: 'SW', iconSrc: starterArt.icons.talisman, label: 'Sect War', action: { type: 'panel', panelId: 'sectWar' } },
    ],
  },
  {
    group: 'Special',
    items: [
      { id: 'catino', glyph: 'CN', iconSrc: starterArt.icons.boopCoin, label: 'Catino', action: { type: 'panel', panelId: 'catino' } },
      { id: 'tournament', glyph: 'TR', iconSrc: starterArt.icons.tournamentMedallion, label: 'Tournament', action: { type: 'panel', panelId: 'tournament' } },
      { id: 'reincarnation', glyph: 'RC', iconSrc: starterArt.icons.qiOrb, label: 'Reincarnation', action: { type: 'panel', panelId: 'reincarnation' } },
      { id: 'settings', glyph: 'ST', iconSrc: starterArt.icons.bell, label: 'Settings', action: { type: 'panel', panelId: 'settings' } },
    ],
  },
];

export default function Sidebar() {
  const activePanel = useUIStore((s) => s.activePanel);
  const openPanel = useUIStore((s) => s.openPanel);
  const setScreen = useUIStore((s) => s.setScreen);
  const catCount = useCatStore((s) => s.cats.length);
  const activeGoose = useGameStore((s) => s.activeGoose);

  const canRebirth = engine.prestige.canRebirth?.() ?? false;
  const claimableAch = (() => {
    try {
      const p = engine.achievement.getProgress() as unknown as { claimable?: number };
      return typeof p.claimable === 'number' ? p.claimable : 0;
    } catch {
      return 0;
    }
  })();
  const claimableDaily = (() => {
    try {
      return engine.daily.getCommissions().filter((c) => c.completed).length;
    } catch {
      return 0;
    }
  })();

  const badges: Record<string, { tone?: 'gold' | 'jade'; text: string } | null> = {
    sanctuary: null,
    cats: catCount > 0 ? { tone: 'jade', text: String(catCount) } : null,
    goose: activeGoose ? { text: '!' } : null,
    prestige: canRebirth ? { tone: 'gold', text: '*' } : null,
    achievements: claimableAch > 0 ? { tone: 'jade', text: String(claimableAch) } : null,
    daily: claimableDaily > 0 ? { tone: 'jade', text: String(claimableDaily) } : null,
  };

  function activate(item: NavItem) {
    if (item.action.type === 'screen' && item.action.screenId) {
      setScreen(item.action.screenId);
    } else if (item.action.type === 'panel' && item.action.panelId) {
      openPanel(item.action.panelId);
    }
  }

  return (
    <nav className="sidebar shrink-0" aria-label="Sect navigation">
      {NAV.map((g) => (
        <div key={g.group}>
          <div className="nav-group-title">{g.group}</div>
          {g.items.map((item) => {
            const active = item.action.type === 'panel' && activePanel === item.action.panelId;
            const b = badges[item.id];
            return (
              <button
                key={item.id}
                onClick={() => activate(item)}
                className={`nav-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
              >
                <span className="nav-glyph nav-glyph-art">
                  <Image
                    src={item.iconSrc}
                    alt=""
                    width={24}
                    height={24}
                    className="nav-icon-art"
                  />
                  <span className="sr-only">{item.glyph}</span>
                </span>
                <span>{item.label}</span>
                {b && <span className={`nav-badge ${b.tone ?? ''}`}>{b.text}</span>}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
