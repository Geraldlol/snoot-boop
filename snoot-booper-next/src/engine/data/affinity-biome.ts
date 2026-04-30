/**
 * Affinity × Biome bonus matrix.
 * Maps a cat's element type to a multiplier for a given dungeon biome.
 *
 * Used by the Pagoda system when computing a cat's contribution to run power.
 */

import type { ElementType } from '../types';

export type BiomeId = 'mossy_cellar' | 'bamboo_hollow' | 'misty_bamboo' | 'plum_cloud_vault' | 'pagoda_default';

export interface BiomeDef {
  id: BiomeId;
  name: string;
  description: string;
  glyph: string;
  /** Multiplier for each element. Values >1 favor, <1 punish. Defaults to 1. */
  affinityBonus: Partial<Record<ElementType, number>>;
}

export const BIOMES: Record<BiomeId, BiomeDef> = {
  mossy_cellar: {
    id: 'mossy_cellar',
    name: 'Mossy Cellar',
    description: 'Cold, damp, full of small terrors.',
    glyph: '霜',
    affinityBonus: { water: 1.5, fire: 0.75, wood: 1.10 },
  },
  bamboo_hollow: {
    id: 'bamboo_hollow',
    name: 'Bamboo Hollow',
    description: 'Hollowed groves where qi pools.',
    glyph: '火',
    affinityBonus: { fire: 1.50, water: 0.75, earth: 1.10 },
  },
  misty_bamboo: {
    id: 'misty_bamboo',
    name: 'Misty Bamboo',
    description: 'Beyond the mist, the bamboo whispers.',
    glyph: '速',
    affinityBonus: { wood: 1.50, metal: 0.75, void: 1.10 },
  },
  plum_cloud_vault: {
    id: 'plum_cloud_vault',
    name: 'Plum-Cloud Vault',
    description: 'A vault carved into a frozen cloud.',
    glyph: '玄',
    affinityBonus: { void: 1.50, chaos: 1.20, fire: 0.70 },
  },
  pagoda_default: {
    id: 'pagoda_default',
    name: 'The Pagoda',
    description: 'Neutral cultivation arena.',
    glyph: '塔',
    affinityBonus: {},
  },
};

export const BIOME_IDS = Object.keys(BIOMES) as BiomeId[];

/** Get the multiplier for a cat's element in a specific biome. Defaults to 1.0 if unmapped. */
export function getAffinityBonus(element: ElementType, biome: BiomeId): number {
  return BIOMES[biome]?.affinityBonus[element] ?? 1.0;
}
