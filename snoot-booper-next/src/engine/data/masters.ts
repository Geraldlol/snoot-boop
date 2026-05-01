/**
 * Master definitions - The Seven Wandering Masters of the Celestial Snoot Sect
 */

import type { Master } from '../types';

export const MASTERS: Record<string, Master> = {
  gerald: {
    id: 'gerald',
    name: 'Gerald',
    title: 'The Jade Palm',
    role: 'Sect Leader',
    description: 'Founder of the Celestial Snoot Sect. Balance in all things.',
    passive: {
      name: 'Tranquil Boop',
      description: '+25% BP from all boops',
      effect: { bpMultiplier: 1.25, requiresMeditation: true },
    },
    sprite: 'masters/gerald.png',
    color: '#50C878',
    quotes: [
      'Balance in all things. Especially snoots.',
      'The Sect grows stronger with each boop.',
      'I see potential in you, young cultivator.',
    ],
  },
  rusty: {
    id: 'rusty',
    name: 'Rusty',
    title: 'The Crimson Fist',
    role: 'War General',
    description: 'Former bandit king, reformed cat lover. BOOP HARDER!',
    passive: {
      name: 'Relentless Barrage',
      description: '+15% BP and +50% auto-boop speed',
      effect: { bpMultiplier: 1.15, boopSpeedMultiplier: 1.5 },
    },
    sprite: 'masters/rusty.png',
    color: '#DC143C',
    quotes: [
      'When in doubt, boop harder!',
      'These paws were made for booping!',
      'THOUSAND BOOP BARRAGE!',
    ],
  },
  steve: {
    id: 'steve',
    name: 'Steve',
    title: 'The Flowing River',
    role: 'Strategist',
    description: 'Calculated the optimal snoot-to-boop ratio.',
    passive: {
      name: 'Eternal Flow',
      description: 'Offline PP generation is doubled',
      effect: { afkMultiplier: 2.0 },
    },
    sprite: 'masters/steve.png',
    color: '#4169E1',
    quotes: [
      'Patience yields the greatest gains.',
      'The math is clear: more cats = more PP.',
      "I've optimized our cultivation schedule.",
    ],
  },
  andrew: {
    id: 'andrew',
    name: 'Andrew',
    title: 'The Thunder Step',
    role: 'Scout',
    description: 'Fastest courier in the Jianghu.',
    passive: {
      name: 'Lightning Reflexes',
      description: '+50% chance to discover events and rare cats first',
      effect: { eventDiscoveryBonus: 1.5, rareCatBonus: 1.5 },
    },
    sprite: 'masters/andrew.png',
    color: '#FFD700',
    quotes: [
      'Already found three cats while you were reading this.',
      'Speed is the essence of cultivation!',
      'New event spotted! Follow me!',
    ],
  },
  nik: {
    id: 'nik',
    name: 'Nik',
    title: 'The Shadow Moon',
    role: 'Assassin',
    description: 'Mysterious. The cats trust him. No one knows why.',
    passive: {
      name: 'Phantom Boop',
      description: '+50% critical boop chance',
      effect: { critChanceBonus: 0.5 },
    },
    sprite: 'masters/nik.png',
    color: '#483D8B',
    quotes: [
      '...',
      '*appears from shadows* ...boop.',
      'The night is full of snoots.',
    ],
  },
  yuelin: {
    id: 'yuelin',
    name: 'Yuelin',
    title: 'The Lotus Sage',
    role: 'Healer',
    description: 'Speaks to cats in their ancient tongue.',
    passive: {
      name: 'Harmonious Aura',
      description: 'All cats gain +50% happiness',
      effect: { catHappinessMultiplier: 1.5 },
    },
    sprite: 'masters/yuelin.png',
    color: '#FFB6C1',
    quotes: [
      'The cats tell me you have a kind heart.',
      'Harmony brings the greatest power.',
      'Each cat carries ancient wisdom.',
    ],
  },
  scott: {
    id: 'scott',
    name: 'Scott',
    title: 'The Mountain',
    role: 'Guardian',
    description: 'Meditated for 1000 days. A cat sat on him the whole time.',
    passive: {
      name: 'Unshakeable Foundation',
      description: 'Cat happiness never decays',
      effect: { preventDecay: true },
    },
    sprite: 'masters/scott.png',
    color: '#8B4513',
    quotes: [
      "I am the mountain. The cats are my snow.",
      'Patience. Stability. Snoots.',
      "...I haven't moved in three days. Worth it.",
    ],
  },
};

export const MASTER_IDS = Object.keys(MASTERS) as Array<keyof typeof MASTERS>;
