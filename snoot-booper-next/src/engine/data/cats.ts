/**
 * Cat data definitions — realms, elements, personalities, schools, templates, techniques
 * Ported from data/cats.json + js/cats.js
 */

import type { CatRealmId, ElementType, CatPersonality, CatStats } from '../types';

// ─── Realms ──────────────────────────────────────────────────

export interface RealmData {
  id: CatRealmId;
  name: string;
  order: number;
  ppMultiplier: number;
  statsMultiplier: number;
  dropRate: number;
  maxLevel: number;
  xpBase: number;
  xpScale: number;
  color: string;
  emoji: string;
  breakthroughCost: { jadeCatnip?: number; spiritStones?: number; heavenlySeals?: number };
}

export const CAT_REALMS: Record<CatRealmId, RealmData> = {
  kittenMortal: {
    id: 'kittenMortal', name: 'Mortal Kitten', order: 1,
    ppMultiplier: 1, statsMultiplier: 1.0, dropRate: 0.50,
    maxLevel: 9, xpBase: 100, xpScale: 1.5,
    color: '#A0A0A0', emoji: '🐱',
    breakthroughCost: { jadeCatnip: 10 },
  },
  earthKitten: {
    id: 'earthKitten', name: 'Earth Kitten', order: 2,
    ppMultiplier: 2, statsMultiplier: 1.5, dropRate: 0.25,
    maxLevel: 9, xpBase: 500, xpScale: 1.6,
    color: '#8B4513', emoji: '🌍',
    breakthroughCost: { jadeCatnip: 50, spiritStones: 10 },
  },
  skyKitten: {
    id: 'skyKitten', name: 'Sky Kitten', order: 3,
    ppMultiplier: 5, statsMultiplier: 2.0, dropRate: 0.12,
    maxLevel: 9, xpBase: 2000, xpScale: 1.7,
    color: '#87CEEB', emoji: '☁️',
    breakthroughCost: { jadeCatnip: 200, spiritStones: 50 },
  },
  heavenKitten: {
    id: 'heavenKitten', name: 'Heaven Kitten', order: 4,
    ppMultiplier: 15, statsMultiplier: 3.0, dropRate: 0.08,
    maxLevel: 9, xpBase: 10000, xpScale: 1.8,
    color: '#FFD700', emoji: '✨',
    breakthroughCost: { jadeCatnip: 1000, spiritStones: 200, heavenlySeals: 5 },
  },
  divineBeast: {
    id: 'divineBeast', name: 'Divine Beast', order: 5,
    ppMultiplier: 50, statsMultiplier: 5.0, dropRate: 0.04,
    maxLevel: 9, xpBase: 50000, xpScale: 2.0,
    color: '#FFFFFF', emoji: '🐉',
    breakthroughCost: { jadeCatnip: 5000, spiritStones: 1000, heavenlySeals: 25 },
  },
  celestialBeast: {
    id: 'celestialBeast', name: 'Celestial Beast', order: 6,
    ppMultiplier: 200, statsMultiplier: 10.0, dropRate: 0.009,
    maxLevel: 9, xpBase: 250000, xpScale: 2.2,
    color: '#E6E6FA', emoji: '🌟',
    breakthroughCost: { jadeCatnip: 25000, spiritStones: 5000, heavenlySeals: 100 },
  },
  cosmicEntity: {
    id: 'cosmicEntity', name: 'Cosmic Entity', order: 7,
    ppMultiplier: 1000, statsMultiplier: 25.0, dropRate: 0.001,
    maxLevel: Infinity, xpBase: 1000000, xpScale: 2.5,
    color: '#FF00FF', emoji: '🌌',
    breakthroughCost: {},
  },
};

export const REALM_ORDER: CatRealmId[] = [
  'kittenMortal', 'earthKitten', 'skyKitten', 'heavenKitten',
  'divineBeast', 'celestialBeast', 'cosmicEntity',
];

/** Map legacy realm names to new IDs */
export const LEGACY_REALM_MAP: Record<string, CatRealmId> = {
  mortal: 'kittenMortal', earth: 'earthKitten', sky: 'skyKitten',
  heaven: 'heavenKitten', divine: 'divineBeast',
};

// ─── Elements ────────────────────────────────────────────────

export interface ElementData {
  id: ElementType;
  name: string;
  color: string;
  strengths: ElementType[];
  weaknesses: ElementType[];
  bonus: { type: string; value: number };
  hidden?: boolean;
  unlockCondition?: string;
  resonance: Partial<Record<ElementType, number>>;
}

export const CAT_ELEMENTS: Record<ElementType, ElementData> = {
  metal: {
    id: 'metal', name: 'Metal', color: '#C0C0C0',
    strengths: ['wood'], weaknesses: ['fire'],
    bonus: { type: 'critDamage', value: 0.20 },
    resonance: { earth: 0.1, water: 0.05 },
  },
  wood: {
    id: 'wood', name: 'Wood', color: '#228B22',
    strengths: ['earth'], weaknesses: ['metal'],
    bonus: { type: 'hpRegen', value: 0.20 },
    resonance: { water: 0.1, fire: 0.05 },
  },
  water: {
    id: 'water', name: 'Water', color: '#4169E1',
    strengths: ['fire'], weaknesses: ['earth'],
    bonus: { type: 'afkEfficiency', value: 0.20 },
    resonance: { wood: 0.1, metal: 0.05 },
  },
  fire: {
    id: 'fire', name: 'Fire', color: '#FF4500',
    strengths: ['metal'], weaknesses: ['water'],
    bonus: { type: 'boopPower', value: 0.20 },
    resonance: { earth: 0.05, wood: 0.1 },
  },
  earth: {
    id: 'earth', name: 'Earth', color: '#8B4513',
    strengths: ['water'], weaknesses: ['wood'],
    bonus: { type: 'defense', value: 0.20 },
    resonance: { metal: 0.1, fire: 0.05 },
  },
  void: {
    id: 'void', name: 'Void', color: '#000000',
    strengths: [], weaknesses: [],
    bonus: { type: 'allStats', value: 0.15 },
    hidden: true, unlockCondition: 'divineBeast_realm',
    resonance: { chaos: 0.15 },
  },
  chaos: {
    id: 'chaos', name: 'Chaos', color: '#FF00FF',
    strengths: [], weaknesses: [],
    bonus: { type: 'randomMultiplier', value: 1.5 },
    hidden: true, unlockCondition: 'cobra_chicken_defeated',
    resonance: { void: 0.15 },
  },
};

export const BASIC_ELEMENTS: ElementType[] = ['metal', 'wood', 'water', 'fire', 'earth'];

// ─── Personalities ───────────────────────────────────────────

export interface PersonalityData {
  id: CatPersonality;
  name: string;
  description: string;
  effects: Record<string, number>;
  preferredWaifus: string[];
}

export const CAT_PERSONALITIES: Record<CatPersonality, PersonalityData> = {
  disciplined: {
    id: 'disciplined', name: 'Disciplined',
    description: 'Focused on technique cultivation',
    effects: { techniqueXPBonus: 0.25 },
    preferredWaifus: ['mochi', 'jade'],
  },
  lazy: {
    id: 'lazy', name: 'Lazy',
    description: 'Better at AFK, worse when active',
    effects: { afkBonus: 0.50, activeBonus: -0.20 },
    preferredWaifus: ['luna'],
  },
  playful: {
    id: 'playful', name: 'Playful',
    description: 'More happiness, more events',
    effects: { happinessGain: 0.30, eventChance: 0.20 },
    preferredWaifus: ['sakura', 'nyanta'],
  },
  mysterious: {
    id: 'mysterious', name: 'Mysterious',
    description: 'Better crits, finds secrets',
    effects: { critChance: 0.05, secretFinding: 0.50 },
    preferredWaifus: ['yuki', 'luna'],
  },
  brave: {
    id: 'brave', name: 'Brave',
    description: 'Strong against geese and in dungeons',
    effects: { gooseDamage: 0.50, dungeonPower: 0.20 },
    preferredWaifus: ['nyanta', 'mei'],
  },
  gluttonous: {
    id: 'gluttonous', name: 'Gluttonous',
    description: 'Loves food, eats more',
    effects: { foodBonus: 1.0, happinessDecay: 0.20 },
    preferredWaifus: ['mochi'],
  },
};

// ─── Star Bonuses ────────────────────────────────────────────

export interface StarBonus {
  stats: number;
  visual: string;
  awakened?: boolean;
}

export const STAR_BONUSES: Record<number, StarBonus> = {
  1: { stats: 1.0, visual: 'none' },
  2: { stats: 1.1, visual: 'subtle_glow' },
  3: { stats: 1.25, visual: 'sparkle' },
  4: { stats: 1.5, visual: 'aura' },
  5: { stats: 2.0, visual: 'golden_aura' },
  6: { stats: 3.0, visual: 'celestial_aura', awakened: true },
};

// ─── Recruitment Costs ───────────────────────────────────────

export const RECRUITMENT_COSTS: Record<CatRealmId, number> = {
  kittenMortal: 100,
  earthKitten: 1000,
  skyKitten: 10000,
  heavenKitten: 100000,
  divineBeast: 1000000,
  celestialBeast: 5000000,
  cosmicEntity: 10000000,
};

// ─── Cat Techniques ──────────────────────────────────────────

export interface TechniqueData {
  id: string;
  name: string;
  type: 'active' | 'passive';
  element?: ElementType;
  description: string;
  levelReq: number;
  realmReq?: CatRealmId;
  xpCost: number;
  effects: Record<string, number>;
}

export const CAT_TECHNIQUES: Record<string, TechniqueData> = {
  pawSwipe: { id: 'pawSwipe', name: 'Paw Swipe', type: 'active', description: 'Basic melee attack', levelReq: 1, xpCost: 0, effects: { damage: 10, cooldown: 1.0 } },
  fireBite: { id: 'fireBite', name: 'Fire Bite', type: 'active', element: 'fire', description: 'Fire-infused bite', levelReq: 3, xpCost: 50, effects: { damage: 25, burn: 5, cooldown: 2.0 } },
  hairballBarrage: { id: 'hairballBarrage', name: 'Hairball Barrage', type: 'active', description: 'Ranged AoE attack', levelReq: 5, xpCost: 100, effects: { damage: 15, aoe: 30, cooldown: 3.0 } },
  shadowPounce: { id: 'shadowPounce', name: 'Shadow Pounce', type: 'active', element: 'void', description: 'Teleport behind enemy', levelReq: 7, realmReq: 'divineBeast', xpCost: 300, effects: { damage: 50, critBonus: 0.5, cooldown: 5.0 } },
  waterWhiskers: { id: 'waterWhiskers', name: 'Water Whiskers', type: 'active', element: 'water', description: 'Heal self and nearby allies', levelReq: 4, xpCost: 80, effects: { heal: 30, aoe: 20, cooldown: 4.0 } },
  woodenClaw: { id: 'woodenClaw', name: 'Wooden Claw', type: 'active', element: 'wood', description: 'Entangle enemies', levelReq: 4, xpCost: 80, effects: { damage: 20, slow: 0.3, cooldown: 3.0 } },
  chaosHonk: { id: 'chaosHonk', name: 'Chaos Honk', type: 'active', element: 'chaos', description: 'Random powerful effect', levelReq: 8, realmReq: 'divineBeast', xpCost: 500, effects: { randomDamage: 100, cooldown: 8.0 } },
  nineLivesDance: { id: 'nineLivesDance', name: 'Nine Lives Dance', type: 'active', description: 'Become invulnerable briefly', levelReq: 9, realmReq: 'heavenKitten', xpCost: 400, effects: { invulnDuration: 3.0, cooldown: 30.0 } },
  // Passives
  softLanding: { id: 'softLanding', name: 'Soft Landing', type: 'passive', description: 'Reduce fall damage', levelReq: 2, xpCost: 30, effects: { fallDamageReduction: 0.5 } },
  loudPurr: { id: 'loudPurr', name: 'Loud Purr', type: 'passive', description: 'Boost team morale', levelReq: 3, xpCost: 50, effects: { teamMorale: 0.1 } },
  ironFloof: { id: 'ironFloof', name: 'Iron Floof', type: 'passive', description: 'Increase defense', levelReq: 4, xpCost: 80, effects: { defenseBonus: 0.2 } },
  predatorInstinct: { id: 'predatorInstinct', name: 'Predator Instinct', type: 'passive', description: 'Bonus crit chance', levelReq: 5, xpCost: 100, effects: { critChance: 0.1 } },
  eternaLoaf: { id: 'eternaLoaf', name: 'Eterna-Loaf', type: 'passive', description: 'Boost PP generation', levelReq: 6, xpCost: 200, effects: { ppGeneration: 0.5 } },
  voidGaze: { id: 'voidGaze', name: 'Void Gaze', type: 'passive', element: 'void', description: 'See enemy weaknesses', levelReq: 7, realmReq: 'divineBeast', xpCost: 300, effects: { revealWeakness: 1.0 } },
};

// ─── Cat Templates ───────────────────────────────────────────

export interface CatTemplate {
  id: string;
  name: string;
  school: string;
  element: ElementType;
  baseRealm: CatRealmId;
  personality: CatPersonality;
  description: string;
  baseStats: CatStats;
  learnableTechniques: string[];
  sprite: string;
  quotes: string[];
  emoji: string;
  legendary?: boolean;
  mythic?: boolean;
  unlockedBy?: { type: string; value: string | number };
  signatureEquipment?: string;
}

export const CAT_TEMPLATES: CatTemplate[] = [
  // ── Mortal Kitten ──
  {
    id: 'shaolin_tabby', name: 'Shaolin Tabby', school: 'shaolin', element: 'earth', baseRealm: 'kittenMortal', personality: 'disciplined',
    description: 'A disciplined cat who practices the ways of the temple.',
    baseStats: { snootMeridians: 1.0, innerPurr: 1.0, floofArmor: 1.2, zoomieSteps: 0.8, loafMastery: 1.1 },
    learnableTechniques: ['pawSwipe', 'ironFloof', 'loudPurr'],
    sprite: 'cats/shaolin_tabby.png', emoji: '🐱',
    quotes: ['Mrrp. (Balance in all things.)', '*meditates intensely*'],
  },
  {
    id: 'tuxedo_monk', name: 'Tuxedo Monk', school: 'wudang', element: 'water', baseRealm: 'kittenMortal', personality: 'mysterious',
    description: 'Always dressed for the occasion. Master of inner peace.',
    baseStats: { snootMeridians: 0.9, innerPurr: 1.3, floofArmor: 0.8, zoomieSteps: 1.0, loafMastery: 1.2 },
    learnableTechniques: ['waterWhiskers', 'softLanding', 'loudPurr'],
    sprite: 'cats/tuxedo_monk.png', emoji: '🎩',
    quotes: ['*adjusts invisible bow tie*', 'The water flows... as I nap.'],
  },
  {
    id: 'orange_wanderer', name: 'Orange Wanderer', school: 'wanderer', element: 'fire', baseRealm: 'kittenMortal', personality: 'brave',
    description: 'A fearless orange tabby who fears nothing. Shares one brain cell.',
    baseStats: { snootMeridians: 1.4, innerPurr: 0.7, floofArmor: 1.0, zoomieSteps: 1.2, loafMastery: 0.8 },
    learnableTechniques: ['pawSwipe', 'fireBite', 'predatorInstinct'],
    sprite: 'cats/orange_wanderer.png', emoji: '🟠',
    quotes: ['No thought. Head empty. Only boop.', '*charges headfirst at goose*'],
  },
  {
    id: 'calico_initiate', name: 'Calico Initiate', school: 'emei', element: 'wood', baseRealm: 'kittenMortal', personality: 'playful',
    description: 'A cheerful calico with healing potential.',
    baseStats: { snootMeridians: 0.8, innerPurr: 1.1, floofArmor: 0.9, zoomieSteps: 1.1, loafMastery: 1.3 },
    learnableTechniques: ['woodenClaw', 'softLanding', 'eternaLoaf'],
    sprite: 'cats/calico_initiate.png', emoji: '🌸',
    quotes: ['Every day is play day~', '*chases butterfly*'],
  },
  {
    id: 'grey_student', name: 'Grey Student', school: 'scholar', element: 'metal', baseRealm: 'kittenMortal', personality: 'disciplined',
    description: 'Studious and focused. Has read every scroll in the library.',
    baseStats: { snootMeridians: 0.7, innerPurr: 1.4, floofArmor: 0.7, zoomieSteps: 0.9, loafMastery: 1.5 },
    learnableTechniques: ['loudPurr', 'ironFloof', 'eternaLoaf'],
    sprite: 'cats/grey_student.png', emoji: '📚',
    quotes: ['*pushes glasses up*', 'According to my calculations...'],
  },
  {
    id: 'street_scrapper', name: 'Street Scrapper', school: 'beggar', element: 'fire', baseRealm: 'kittenMortal', personality: 'brave',
    description: 'Survived the alleys. Now thrives in the sect.',
    baseStats: { snootMeridians: 1.3, innerPurr: 0.6, floofArmor: 1.1, zoomieSteps: 1.3, loafMastery: 0.7 },
    learnableTechniques: ['pawSwipe', 'fireBite', 'predatorInstinct'],
    sprite: 'cats/street_scrapper.png', emoji: '💪',
    quotes: ['You want a piece of this?!', '*hisses at nothing*'],
  },
  // ── Earth Kitten ──
  {
    id: 'siamese_blade', name: 'Siamese Blade', school: 'emei', element: 'metal', baseRealm: 'earthKitten', personality: 'disciplined',
    description: 'Graceful and deadly. Her claws are sharper than any sword.',
    baseStats: { snootMeridians: 1.8, innerPurr: 1.2, floofArmor: 1.0, zoomieSteps: 1.5, loafMastery: 1.0 },
    learnableTechniques: ['pawSwipe', 'predatorInstinct', 'ironFloof'],
    sprite: 'cats/siamese_blade.png', emoji: '⚔️',
    quotes: ['My claws speak louder than words.', '*elegant fighting stance*'],
  },
  {
    id: 'void_stalker', name: 'Void Stalker', school: 'wanderer', element: 'void', baseRealm: 'earthKitten', personality: 'mysterious',
    description: 'Walks between shadows. Nobody hears him coming.',
    baseStats: { snootMeridians: 1.5, innerPurr: 1.0, floofArmor: 0.8, zoomieSteps: 1.8, loafMastery: 0.9 },
    learnableTechniques: ['shadowPounce', 'softLanding', 'voidGaze'],
    sprite: 'cats/void_stalker.png', emoji: '🌑',
    quotes: ['...', '*appears from nowhere*'],
  },
  {
    id: 'persian_noble', name: 'Persian Noble', school: 'royal', element: 'earth', baseRealm: 'earthKitten', personality: 'lazy',
    description: 'Descended from feline royalty. Expects to be carried.',
    baseStats: { snootMeridians: 0.9, innerPurr: 2.0, floofArmor: 1.3, zoomieSteps: 0.6, loafMastery: 1.8 },
    learnableTechniques: ['loudPurr', 'ironFloof', 'eternaLoaf'],
    sprite: 'cats/persian_noble.png', emoji: '👑',
    quotes: ['Servant, fetch my cushion.', '*yawns regally*'],
  },
  {
    id: 'maine_coon_guardian', name: 'Maine Coon Guardian', school: 'royal', element: 'earth', baseRealm: 'earthKitten', personality: 'brave',
    description: 'Absolute unit. Protects the smaller cats.',
    baseStats: { snootMeridians: 1.6, innerPurr: 1.0, floofArmor: 2.0, zoomieSteps: 0.7, loafMastery: 1.1 },
    learnableTechniques: ['ironFloof', 'pawSwipe', 'loudPurr'],
    sprite: 'cats/maine_coon_guardian.png', emoji: '🛡️',
    quotes: ['None shall pass!', '*sits on enemy*'],
  },
  // ── Sky Kitten ──
  {
    id: 'folded_ear_master', name: 'Folded Ear Master', school: 'wudang', element: 'water', baseRealm: 'skyKitten', personality: 'disciplined',
    description: 'Has mastered the art of stillness.',
    baseStats: { snootMeridians: 1.5, innerPurr: 2.5, floofArmor: 1.5, zoomieSteps: 1.2, loafMastery: 2.0 },
    learnableTechniques: ['waterWhiskers', 'eternaLoaf', 'ironFloof'],
    sprite: 'cats/folded_ear_master.png', emoji: '🧘',
    quotes: ['True power comes from within.', '*meditates under waterfall*'],
  },
  {
    id: 'munchkin_sage', name: 'Munchkin Sage', school: 'scholar', element: 'wood', baseRealm: 'skyKitten', personality: 'playful',
    description: 'Short legs, tall wisdom.',
    baseStats: { snootMeridians: 1.2, innerPurr: 2.8, floofArmor: 1.0, zoomieSteps: 0.8, loafMastery: 2.5 },
    learnableTechniques: ['woodenClaw', 'loudPurr', 'eternaLoaf'],
    sprite: 'cats/munchkin_sage.png', emoji: '🌿',
    quotes: ['Size matters not.', '*waddles wisely*'],
  },
  {
    id: 'floof_immortal', name: 'Floof Immortal', school: 'emei', element: 'metal', baseRealm: 'skyKitten', personality: 'lazy',
    description: 'So fluffy, attacks bounce off.',
    baseStats: { snootMeridians: 1.0, innerPurr: 2.2, floofArmor: 3.0, zoomieSteps: 0.5, loafMastery: 2.3 },
    learnableTechniques: ['ironFloof', 'softLanding', 'eternaLoaf'],
    sprite: 'cats/floof_immortal.png', emoji: '☁️',
    quotes: ['*is 90% floof*', 'Cannot... move... too... fluffy...'],
  },
  // ── Heaven Kitten ──
  {
    id: 'galaxy_cultivator', name: 'Galaxy Cultivator', school: 'divine', element: 'void', baseRealm: 'heavenKitten', personality: 'mysterious',
    description: 'Contemplates the cosmos between naps.',
    baseStats: { snootMeridians: 2.5, innerPurr: 3.0, floofArmor: 2.0, zoomieSteps: 1.5, loafMastery: 2.8 },
    learnableTechniques: ['shadowPounce', 'voidGaze', 'eternaLoaf'],
    sprite: 'cats/galaxy_cultivator.png', emoji: '🌌',
    quotes: ['The stars whisper to those who listen.', '*gazes into void*'],
  },
  {
    id: 'chonk_emperor', name: 'Chonk Emperor', school: 'royal', element: 'earth', baseRealm: 'heavenKitten', personality: 'gluttonous',
    description: 'Rules with an iron paw and an insatiable appetite.',
    baseStats: { snootMeridians: 2.0, innerPurr: 2.5, floofArmor: 4.0, zoomieSteps: 0.3, loafMastery: 3.5 },
    learnableTechniques: ['ironFloof', 'loudPurr', 'eternaLoaf'],
    sprite: 'cats/chonk_emperor.png', emoji: '👑',
    quotes: ['More food. Now.', '*sits on throne (the couch)*'],
  },
  {
    id: 'nyan_ancestor', name: 'Nyan Ancestor', school: 'divine', element: 'chaos', baseRealm: 'heavenKitten', personality: 'playful',
    description: 'The original rainbow cat. Ancient beyond measure.',
    baseStats: { snootMeridians: 2.2, innerPurr: 3.5, floofArmor: 1.5, zoomieSteps: 3.0, loafMastery: 2.0 },
    learnableTechniques: ['chaosHonk', 'nineLivesDance', 'predatorInstinct'],
    sprite: 'cats/nyan_ancestor.png', emoji: '🌈',
    quotes: ['Nyan nyan nyan~', '*leaves rainbow trail*'],
  },
  // ── Divine Beast ──
  {
    id: 'ceiling_cat', name: 'Ceiling Cat, the All-Seeing', school: 'divine', element: 'void', baseRealm: 'divineBeast', personality: 'mysterious',
    description: 'Watches from the heavens. Grants vision of all snoots.',
    baseStats: { snootMeridians: 5.0, innerPurr: 10.0, floofArmor: 5.0, zoomieSteps: 3.0, loafMastery: 8.0 },
    learnableTechniques: ['voidGaze', 'nineLivesDance', 'shadowPounce'],
    sprite: 'cats/ceiling_god.png', emoji: '👁️', legendary: true,
    unlockedBy: { type: 'achievement', value: 'eyes_of_heaven' },
    signatureEquipment: 'ceiling_eye',
    quotes: ['I see all snoots.', '*watches from above*'],
  },
  {
    id: 'keyboard_cat', name: 'Keyboard Cat, Melody of Ages', school: 'divine', element: 'water', baseRealm: 'divineBeast', personality: 'playful',
    description: 'His music echoes through eternity.',
    baseStats: { snootMeridians: 3.0, innerPurr: 8.0, floofArmor: 3.0, zoomieSteps: 4.0, loafMastery: 7.0 },
    learnableTechniques: ['loudPurr', 'waterWhiskers', 'eternaLoaf'],
    sprite: 'cats/keyboard_cat.png', emoji: '🎹', legendary: true,
    unlockedBy: { type: 'achievement', value: 'musical_master' },
    quotes: ['*plays epic riff*', 'The melody never ends.'],
  },
  {
    id: 'longcat', name: 'Longcat, the Infinite', school: 'cosmic', element: 'void', baseRealm: 'celestialBeast', personality: 'lazy',
    description: 'How long? Yes.',
    baseStats: { snootMeridians: 4.0, innerPurr: 12.0, floofArmor: 6.0, zoomieSteps: 1.0, loafMastery: 10.0 },
    learnableTechniques: ['voidGaze', 'eternaLoaf', 'ironFloof'],
    sprite: 'cats/longcat.png', emoji: '📏', legendary: true,
    unlockedBy: { type: 'achievement', value: 'infinite_patience' },
    quotes: ['Loooooooong.', '*stretches infinitely*'],
  },
  {
    id: 'eternal_loaf', name: 'The Eternal Loaf', school: 'cosmic', element: 'earth', baseRealm: 'cosmicEntity', personality: 'lazy',
    description: 'Has transcended all forms. Is now loaf.',
    baseStats: { snootMeridians: 3.0, innerPurr: 25.0, floofArmor: 10.0, zoomieSteps: 0.1, loafMastery: 100.0 },
    learnableTechniques: ['eternaLoaf', 'ironFloof', 'nineLivesDance'],
    sprite: 'cats/eternal_loaf.png', emoji: '🍞', legendary: true, mythic: true,
    unlockedBy: { type: 'fusion', value: 'eternal_loaf_recipe' },
    quotes: ['...', '*is loaf*', 'I have become bread, destroyer of hunger.'],
  },
];

// ─── Fusion Recipes ──────────────────────────────────────────

export interface FusionRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: Array<{ type: string; value: string | number; count?: number; minStars?: number }>;
  resultCatId: string;
  unique: boolean;
}

export const FUSION_RECIPES: FusionRecipe[] = [
  {
    id: 'yin_yang_cat', name: 'Yin-Yang Fusion', description: 'Combine fire and water',
    ingredients: [
      { type: 'element', value: 'fire', count: 1, minStars: 3 },
      { type: 'element', value: 'water', count: 1, minStars: 3 },
    ],
    resultCatId: 'yin_yang_cat', unique: true,
  },
  {
    id: 'chaos_kitty', name: 'Chaos Fusion', description: 'Goose-touched meets bravery',
    ingredients: [
      { type: 'id', value: 'goose_touched_cat', count: 1 },
      { type: 'personality', value: 'brave', count: 1, minStars: 5 },
    ],
    resultCatId: 'chaos_kitty', unique: true,
  },
  {
    id: 'legendary_loaf', name: 'Legendary Loaf Fusion', description: 'Five cats at 4+ stars',
    ingredients: [
      { type: 'any', value: 'any', count: 5, minStars: 4 },
    ],
    resultCatId: 'eternal_loaf', unique: true,
  },
];

// ─── Team Formations ─────────────────────────────────────────

export interface TeamFormation {
  id: string;
  name: string;
  positions: Array<{ row: string; col: number }>;
  bonuses: { attack: number; defense: number };
}

export const TEAM_FORMATIONS: TeamFormation[] = [
  { id: 'default', name: 'Standard', positions: [{ row: 'front', col: 0 }, { row: 'front', col: 1 }, { row: 'back', col: 0 }, { row: 'back', col: 1 }], bonuses: { attack: 0, defense: 0 } },
  { id: 'aggressive', name: 'Aggressive', positions: [{ row: 'front', col: 0 }, { row: 'front', col: 1 }, { row: 'front', col: 2 }, { row: 'back', col: 0 }], bonuses: { attack: 0.20, defense: -0.10 } },
  { id: 'defensive', name: 'Defensive', positions: [{ row: 'front', col: 0 }, { row: 'back', col: 0 }, { row: 'back', col: 1 }, { row: 'back', col: 2 }], bonuses: { attack: -0.10, defense: 0.30 } },
  { id: 'balanced', name: 'Balanced', positions: [{ row: 'front', col: 0 }, { row: 'mid', col: 0 }, { row: 'mid', col: 1 }, { row: 'back', col: 0 }], bonuses: { attack: 0.10, defense: 0.10 } },
];
