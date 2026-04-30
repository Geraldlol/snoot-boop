/**
 * Cat traits — rolled at recruit, modify global game multipliers.
 * Ten archetypes ported from the Claude Design wuxia bundle.
 */

export type TraitId =
  | 'brave'
  | 'lazy'
  | 'glutton'
  | 'cursed'
  | 'lucky'
  | 'stoic'
  | 'soft'
  | 'fierce'
  | 'ancient'
  | 'feral';

export interface TraitDef {
  id: TraitId;
  name: string;
  description: string;
  glyph: string;            // single Chinese-character ornament
  color: string;            // chip tint
  /** Per-cat trait multipliers. Aggregated multiplicatively across all cats by CatSystem. */
  mods: {
    bp?: number;             // boop burst (1.0 = no change)
    pp?: number;             // qi/idle generation
    bond?: number;           // bond/happiness gain
    crit?: number;           // additive crit chance bonus (e.g. +0.02 = +2%)
    dungeon?: number;        // dungeon power multiplier (Phase 5 will hook this)
    loot?: number;           // loot drop bonus
    courage?: number;        // -goose-fear / brave heart (additive 0..1)
  };
}

export const TRAITS: Record<TraitId, TraitDef> = {
  brave:   { id: 'brave',   name: 'Brave',   glyph: '勇', color: '#ff8b6e', description: '+5% boop, +2% crit, faces the goose.', mods: { bp: 1.05, crit: 0.02, dungeon: 1.05, courage: 0.5 } },
  lazy:    { id: 'lazy',    name: 'Lazy',    glyph: '怠', color: '#b3a385', description: '+15% qi, but slower in combat.',          mods: { pp: 1.15, bp: 0.92, dungeon: 0.85 } },
  glutton: { id: 'glutton', name: 'Glutton', glyph: '饕', color: '#e6c275', description: 'Doubles food drops on dungeon runs.',     mods: { loot: 1.50 } },
  cursed:  { id: 'cursed',  name: 'Cursed',  glyph: '咒', color: '#8a7cc0', description: '−15% qi but +20% boop and +10% bond.',    mods: { pp: 0.85, bp: 1.20, bond: 1.10, crit: 0.02 } },
  lucky:   { id: 'lucky',   name: 'Lucky',   glyph: '福', color: '#ffe7a8', description: 'Small bonuses to everything.',            mods: { pp: 1.05, bp: 1.05, bond: 1.05, crit: 0.04, loot: 1.10 } },
  stoic:   { id: 'stoic',   name: 'Stoic',   glyph: '靜', color: '#76b6d4', description: '+10% qi, slightly less bond.',            mods: { pp: 1.10, bond: 0.95, courage: 0.30 } },
  soft:    { id: 'soft',    name: 'Soft',    glyph: '柔', color: '#FFB6C1', description: '+20% bond. Easily startled.',             mods: { bond: 1.20, courage: -0.10 } },
  fierce:  { id: 'fierce',  name: 'Fierce',  glyph: '猛', color: '#d65b40', description: '+15% boop, +3% crit, less bond.',         mods: { bp: 1.15, bond: 0.95, crit: 0.03 } },
  ancient: { id: 'ancient', name: 'Ancient', glyph: '古', color: '#98ecd0', description: 'Old soul. Bonuses across the board.',     mods: { pp: 1.20, bp: 1.10, bond: 1.10, crit: 0.01, dungeon: 1.10 } },
  feral:   { id: 'feral',   name: 'Feral',   glyph: '野', color: '#6dc5a8', description: 'Untamed. High crit, low bond.',           mods: { pp: 0.95, bp: 1.10, bond: 0.90, crit: 0.05, dungeon: 1.05 } },
};

export const TRAIT_IDS: TraitId[] = Object.keys(TRAITS) as TraitId[];

/**
 * Roll 1–2 random traits for a newly recruited cat.
 * 60% chance of one, 35% chance of two, 5% chance of zero.
 */
export function rollTraits(rng: () => number = Math.random): TraitId[] {
  const r = rng();
  let count: number;
  if (r < 0.05) count = 0;
  else if (r < 0.65) count = 1;
  else count = 2;

  const pool = [...TRAIT_IDS];
  const picked: TraitId[] = [];
  while (picked.length < count && pool.length > 0) {
    const idx = Math.floor(rng() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

export interface AggregateTraitMods {
  bp: number;
  pp: number;
  bond: number;
  crit: number;
  dungeon: number;
  loot: number;
}

export const NEUTRAL_AGGREGATE: AggregateTraitMods = {
  bp: 1, pp: 1, bond: 1, crit: 0, dungeon: 1, loot: 1,
};

/** Combine all traits across all cats into a single set of multipliers. */
export function aggregateTraitMods(traitsPerCat: TraitId[][]): AggregateTraitMods {
  const out: AggregateTraitMods = { ...NEUTRAL_AGGREGATE };
  for (const traits of traitsPerCat) {
    for (const id of traits) {
      const def = TRAITS[id];
      if (!def) continue;
      const m = def.mods;
      if (m.bp) out.bp *= m.bp;
      if (m.pp) out.pp *= m.pp;
      if (m.bond) out.bond *= m.bond;
      if (m.crit) out.crit += m.crit;
      if (m.dungeon) out.dungeon *= m.dungeon;
      if (m.loot) out.loot *= m.loot;
    }
  }
  return out;
}
