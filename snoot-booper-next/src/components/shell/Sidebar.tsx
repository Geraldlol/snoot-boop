'use client';

import { useUIStore, type PanelId } from '@/store/ui-store';
import { useGameStore } from '@/store/game-store';
import { useCatStore } from '@/store/cat-store';
import { engine } from '@/engine/engine';

interface NavAction {
  type: 'panel' | 'screen';
  panelId?: PanelId;
  screenId?: 'dungeon';
}

interface NavItem {
  id: string;          // unique key (matches PanelId or screen target)
  glyph: string;       // single Chinese character
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
      { id: 'sanctuary', glyph: '鼻', label: 'Snoot Altar', action: { type: 'panel', panelId: 'sanctuary' } },
      { id: 'cats',      glyph: '貓', label: 'Roster',      action: { type: 'panel', panelId: 'cats' } },
      { id: 'waifus',    glyph: '情', label: 'Bond Hall',   action: { type: 'panel', panelId: 'waifus' } },
      { id: 'equipment', glyph: '甲', label: 'Relics',      action: { type: 'panel', panelId: 'equipment' } },
      { id: 'goose',     glyph: '鵝', label: 'Goose Watch', action: { type: 'panel', panelId: 'goose' } },
    ],
  },
  {
    group: 'Progression',
    items: [
      { id: 'upgrades',    glyph: '增', label: 'Upgrades',   action: { type: 'panel', panelId: 'upgrades' } },
      { id: 'techniques',  glyph: '技', label: 'Techniques', action: { type: 'panel', panelId: 'techniques' } },
      { id: 'cultivation', glyph: '境', label: 'Realms',     action: { type: 'panel', panelId: 'cultivation' } },
      { id: 'buildings',   glyph: '殿', label: 'Sect Hall',  action: { type: 'panel', panelId: 'buildings' } },
      { id: 'crafting',    glyph: '匠', label: 'Forge',      action: { type: 'panel', panelId: 'crafting' } },
      { id: 'dungeon',     glyph: '穴', label: 'Dungeon',    action: { type: 'screen', screenId: 'dungeon' } },
      { id: 'prestige',    glyph: '道', label: 'Dao Tree',   action: { type: 'panel', panelId: 'prestige' } },
    ],
  },
  {
    group: 'Sect',
    items: [
      { id: 'achievements', glyph: '勳', label: 'Achievements', action: { type: 'panel', panelId: 'achievements' } },
      { id: 'lore',         glyph: '經', label: 'Lore',         action: { type: 'panel', panelId: 'lore' } },
      { id: 'daily',        glyph: '務', label: 'Daily',        action: { type: 'panel', panelId: 'daily' } },
      { id: 'social',       glyph: '朋', label: 'Friends',      action: { type: 'panel', panelId: 'social' } },
      { id: 'sectWar',      glyph: '戰', label: 'Sect War',     action: { type: 'panel', panelId: 'sectWar' } },
    ],
  },
  {
    group: 'Special',
    items: [
      { id: 'catino',        glyph: '賭', label: 'Catino',        action: { type: 'panel', panelId: 'catino' } },
      { id: 'tournament',    glyph: '盃', label: 'Tournament',    action: { type: 'panel', panelId: 'tournament' } },
      { id: 'reincarnation', glyph: '輪', label: 'Reincarnation', action: { type: 'panel', panelId: 'reincarnation' } },
      { id: 'settings',      glyph: '齒', label: 'Settings',      action: { type: 'panel', panelId: 'settings' } },
    ],
  },
];

export default function Sidebar() {
  const activePanel = useUIStore((s) => s.activePanel);
  const openPanel = useUIStore((s) => s.openPanel);
  const setScreen = useUIStore((s) => s.setScreen);
  const catCount = useCatStore((s) => s.cats.length);
  const activeGoose = useGameStore((s) => s.activeGoose);

  // Lightweight badge derivation. No new engine calls — just safe reads.
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
    prestige: canRebirth ? { tone: 'gold', text: '✦' } : null,
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
              >
                <span className="nav-glyph">{item.glyph}</span>
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
