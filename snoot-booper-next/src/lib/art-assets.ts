import type { PanelId } from '@/store/ui-store';

const PUBLIC_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const STARTER_PACK = '/assets/generated/starter-pack/runtime';

export function publicAsset(path: string): string {
  return `${PUBLIC_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

function starterAsset(path: string): string {
  return publicAsset(`${STARTER_PACK}/${path}`);
}

export const starterArt = {
  icons: {
    boopCoin: starterAsset('icons/jade-boop-coin.png'),
    pawSpirit: starterAsset('icons/paw-spirit-token.png'),
    qiOrb: starterAsset('icons/qi-orb.png'),
    scroll: starterAsset('icons/parchment-scroll.png'),
    koiTreat: starterAsset('icons/koi-treat.png'),
    bell: starterAsset('icons/bronze-bell.png'),
    talisman: starterAsset('icons/crimson-talisman.png'),
    moonTea: starterAsset('icons/moon-tea.png'),
    clawCharm: starterAsset('icons/cat-claw-charm.png'),
    lotusBadge: starterAsset('icons/lotus-badge.png'),
    incense: starterAsset('icons/incense-bundle.png'),
    tournamentMedallion: starterAsset('icons/tournament-medallion.png'),
  },
  masters: {
    gerald: starterAsset('masters/jade-sword-tabby.png'),
    rusty: starterAsset('masters/crimson-talisman-calico.png'),
    steve: starterAsset('masters/flowing-river-strategist.png'),
    andrew: starterAsset('masters/golden-pagoda-lion.png'),
    nik: starterAsset('masters/moon-robed-black.png'),
    yuelin: starterAsset('masters/koi-garden-white.png'),
    scott: starterAsset('masters/storm-cloud-gray.png'),
  },
  backgrounds: {
    sanctuary: starterAsset('backgrounds/celestial-sanctuary.png'),
    pagoda: starterAsset('backgrounds/jade-pagoda-arena.png'),
    koiGarden: starterAsset('backgrounds/moonlit-koi-garden.png'),
    tournament: starterAsset('backgrounds/crimson-tournament-platform.png'),
  },
  ui: {
    inkPanel: starterAsset('ui/panel-ink-wide.png'),
    parchmentPanel: starterAsset('ui/panel-parchment-scroll.png'),
    jadePanel: starterAsset('ui/panel-jade-wide.png'),
    moonPanel: starterAsset('ui/panel-moon-wide.png'),
    lotusDivider: starterAsset('ui/divider-lotus.png'),
    crimsonSeal: starterAsset('ui/seal-crimson-cat.png'),
    jadeBadge: starterAsset('ui/badge-cat-jade.png'),
    goldBadge: starterAsset('ui/badge-cat-gold.png'),
    lotusFrame: starterAsset('ui/frame-lotus-ring.png'),
  },
} as const;

export const panelBackdropById: Partial<Record<PanelId, string>> = {
  sanctuary: starterArt.backgrounds.sanctuary,
  cats: starterArt.backgrounds.koiGarden,
  waifus: starterArt.backgrounds.koiGarden,
  equipment: starterArt.backgrounds.pagoda,
  crafting: starterArt.backgrounds.pagoda,
  upgrades: starterArt.backgrounds.sanctuary,
  techniques: starterArt.backgrounds.pagoda,
  cultivation: starterArt.backgrounds.sanctuary,
  buildings: starterArt.backgrounds.pagoda,
  prestige: starterArt.backgrounds.sanctuary,
  reincarnation: starterArt.backgrounds.sanctuary,
  achievements: starterArt.backgrounds.koiGarden,
  lore: starterArt.backgrounds.koiGarden,
  daily: starterArt.backgrounds.koiGarden,
  social: starterArt.backgrounds.koiGarden,
  sectWar: starterArt.backgrounds.tournament,
  tournament: starterArt.backgrounds.tournament,
  goose: starterArt.backgrounds.koiGarden,
  catino: starterArt.backgrounds.tournament,
  settings: starterArt.backgrounds.sanctuary,
};
