/**
 * cats.js - Martial Cat Collection System (Expanded)
 * "In the world of Jianghu, the mightiest warrior collects the fluffiest cats."
 *
 * Version 2.0 - Grand Enhancement Edition
 * - 7 Cat Cultivation Realms (Kitten Mortal → Cosmic Entity)
 * - Cat Cultivation XP & Breakthrough System
 * - Star System (1-6 stars from duplicates)
 * - Cat Techniques (4 active + 2 passive slots)
 * - Elemental Affinities (5 basic + void + chaos)
 * - Full backward compatibility with v1 saves
 */

// =============================================================================
// CAT CULTIVATION REALMS
// =============================================================================

/**
 * The Seven Realms of Cat Cultivation
 * Each realm increases PP generation exponentially
 * Cats can breakthrough to higher realms through cultivation
 */
const CAT_REALMS = {
  kittenMortal: {
    id: 'kittenMortal',
    order: 1,
    name: 'Mortal Kitten',
    ppMultiplier: 1,
    statsMultiplier: 1.0,
    dropRate: 0.50,
    color: '#A0A0A0',
    description: 'Initiate Snoot - The beginning of the cultivation path',
    maxLevel: 9,
    xpBase: 100,
    xpScale: 1.3,
    breakthroughCost: { jadeCatnip: 50 },
    sprite: 'mortal'
  },
  earthKitten: {
    id: 'earthKitten',
    order: 2,
    name: 'Earth Kitten',
    ppMultiplier: 2,
    statsMultiplier: 1.5,
    dropRate: 0.25,
    color: '#8B4513',
    description: 'Tempered Snoot - Grounded in martial wisdom',
    maxLevel: 9,
    xpBase: 500,
    xpScale: 1.35,
    breakthroughCost: { jadeCatnip: 200 },
    sprite: 'earth'
  },
  skyKitten: {
    id: 'skyKitten',
    order: 3,
    name: 'Sky Kitten',
    ppMultiplier: 5,
    statsMultiplier: 2.0,
    dropRate: 0.12,
    color: '#87CEEB',
    description: 'Enlightened Snoot - Walking among clouds',
    maxLevel: 9,
    xpBase: 2000,
    xpScale: 1.4,
    breakthroughCost: { jadeCatnip: 1000 },
    sprite: 'sky'
  },
  heavenKitten: {
    id: 'heavenKitten',
    order: 4,
    name: 'Heaven Kitten',
    ppMultiplier: 15,
    statsMultiplier: 3.0,
    dropRate: 0.08,
    color: '#FFD700',
    description: 'Celestial Snoot - Blessed by the heavens',
    maxLevel: 9,
    xpBase: 10000,
    xpScale: 1.45,
    breakthroughCost: { jadeCatnip: 5000 },
    sprite: 'heaven'
  },
  divineBeast: {
    id: 'divineBeast',
    order: 5,
    name: 'Divine Beast',
    ppMultiplier: 50,
    statsMultiplier: 5.0,
    dropRate: 0.04,
    color: '#FF6B9D',
    description: 'Transcendent Snoot - Beyond mortal comprehension',
    maxLevel: 9,
    xpBase: 50000,
    xpScale: 1.5,
    breakthroughCost: { jadeCatnip: 25000, spiritStones: 100 },
    sprite: 'divine'
  },
  celestialBeast: {
    id: 'celestialBeast',
    order: 6,
    name: 'Celestial Beast',
    ppMultiplier: 200,
    statsMultiplier: 10.0,
    dropRate: 0.009,
    color: '#E0FFFF',
    description: 'LEGENDARY SNOOT - One with the cosmos',
    maxLevel: 9,
    xpBase: 250000,
    xpScale: 1.55,
    breakthroughCost: { jadeCatnip: 100000, spiritStones: 500, heavenlySeals: 1 },
    sprite: 'celestial'
  },
  cosmicEntity: {
    id: 'cosmicEntity',
    order: 7,
    name: 'Cosmic Entity',
    ppMultiplier: 1000,
    statsMultiplier: 25.0,
    dropRate: 0.001,
    color: '#FFFFFF',
    description: 'MYTHIC SNOOT - The snoot that boops reality itself',
    maxLevel: Infinity, // Infinite scaling
    xpBase: 1000000,
    xpScale: 1.6,
    breakthroughCost: null, // Cannot breakthrough further
    sprite: 'cosmic'
  }
};

// Legacy realm mapping for backward compatibility
const LEGACY_REALM_MAP = {
  'mortal': 'kittenMortal',
  'earth': 'earthKitten',
  'sky': 'skyKitten',
  'heaven': 'heavenKitten',
  'divine': 'divineBeast'
};

// Expose REALMS for backward compatibility (maps to new CAT_REALMS)
const REALMS = {
  mortal: CAT_REALMS.kittenMortal,
  earth: CAT_REALMS.earthKitten,
  sky: CAT_REALMS.skyKitten,
  heaven: CAT_REALMS.heavenKitten,
  divine: CAT_REALMS.divineBeast
};

// =============================================================================
// ELEMENTAL AFFINITY SYSTEM
// =============================================================================

/**
 * The Seven Elements of Cat Cultivation
 * Based on the Five Elements (Wu Xing) plus hidden elements
 */
const CAT_ELEMENTS = {
  metal: {
    id: 'metal',
    name: 'Metal',
    color: '#C0C0C0',
    icon: '⚔️',
    strengths: ['wood'],
    weaknesses: ['fire'],
    bonus: { critDamage: 1.2 },
    resonance: { metal: 1.1, earth: 1.05 },
    description: 'Sharp and precise, devastating critical strikes'
  },
  wood: {
    id: 'wood',
    name: 'Wood',
    color: '#228B22',
    icon: '🌿',
    strengths: ['earth'],
    weaknesses: ['metal'],
    bonus: { hpRegen: 1.2 },
    resonance: { wood: 1.1, water: 1.05 },
    description: 'Resilient and regenerating, never stays down'
  },
  water: {
    id: 'water',
    name: 'Water',
    color: '#4169E1',
    icon: '💧',
    strengths: ['fire'],
    weaknesses: ['earth'],
    bonus: { afkEfficiency: 1.2 },
    resonance: { water: 1.1, metal: 1.05 },
    description: 'Flowing and patient, excels while you rest'
  },
  fire: {
    id: 'fire',
    name: 'Fire',
    color: '#FF4500',
    icon: '🔥',
    strengths: ['metal'],
    weaknesses: ['water'],
    bonus: { boopPower: 1.2 },
    resonance: { fire: 1.1, wood: 1.05 },
    description: 'Fierce and powerful, amplifies boop damage'
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    color: '#8B4513',
    icon: '🪨',
    strengths: ['water'],
    weaknesses: ['wood'],
    bonus: { defense: 1.2 },
    resonance: { earth: 1.1, fire: 1.05 },
    description: 'Steadfast and enduring, unshakeable defense'
  },
  // Hidden Elements - Unlocked through special conditions
  void: {
    id: 'void',
    name: 'Void',
    color: '#000000',
    icon: '🕳️',
    hidden: true,
    unlockCondition: { realm: 'divineBeast' },
    strengths: ['all'], // Strong against all basic elements
    weaknesses: [],
    bonus: { allStats: 1.15 },
    resonance: { void: 1.2 },
    description: 'Beyond the elements, pure cultivation energy'
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos',
    color: '#FF00FF',
    icon: '🌀',
    hidden: true,
    unlockCondition: { defeatCobraChicken: true },
    strengths: [],
    weaknesses: [],
    bonus: { randomMultiplier: { min: 0.5, max: 2.0 } },
    resonance: { chaos: 1.5, void: 1.1 },
    description: 'Unpredictable and wild, embraces randomness'
  }
};

// =============================================================================
// CAT PERSONALITY SYSTEM
// =============================================================================

/**
 * Cat Personalities affect technique learning and waifu compatibility
 */
const CAT_PERSONALITIES = {
  disciplined: {
    id: 'disciplined',
    name: 'Disciplined',
    description: 'Learns techniques faster',
    effect: { techniqueXP: 1.25 },
    preferredWaifus: ['mochi', 'jade'],
    dialogue: ['*trains diligently*', 'Mrrp. (I will master this.)']
  },
  lazy: {
    id: 'lazy',
    name: 'Lazy',
    description: 'Better AFK gains, slower active',
    effect: { afkBonus: 1.5, activeBonus: 0.8 },
    preferredWaifus: ['luna'],
    dialogue: ['*yawns*', 'Mrrp... (Five more minutes...)']
  },
  playful: {
    id: 'playful',
    name: 'Playful',
    description: 'Higher happiness, more events',
    effect: { happinessGain: 1.3, eventChance: 1.2 },
    preferredWaifus: ['sakura', 'nyanta'],
    dialogue: ['*zoomies*', 'Mrrp! (Play with me!)']
  },
  mysterious: {
    id: 'mysterious',
    name: 'Mysterious',
    description: 'Higher crit chance, finds secrets',
    effect: { critChance: 0.05, secretFind: 1.5 },
    preferredWaifus: ['yuki', 'luna'],
    dialogue: ['*stares knowingly*', '...']
  },
  brave: {
    id: 'brave',
    name: 'Brave',
    description: 'Bonus vs. Geese, dungeon power',
    effect: { gooseDamage: 1.5, dungeonPower: 1.2 },
    preferredWaifus: ['nyanta', 'mei'],
    dialogue: ['*faces danger*', 'MRRP! (I fear nothing!)']
  },
  gluttonous: {
    id: 'gluttonous',
    name: 'Gluttonous',
    description: 'Gains more from food, higher maintenance',
    effect: { foodBonus: 2.0, happinessDecay: 1.2 },
    preferredWaifus: ['mochi'],
    dialogue: ['*stares at food*', 'Mrrp? (Is that... fish?)']
  }
};

// =============================================================================
// CAT TECHNIQUE SYSTEM
// =============================================================================

/**
 * Techniques cats can learn and equip
 * 4 Active slots + 2 Passive slots
 */
const CAT_TECHNIQUES = {
  // === ACTIVE TECHNIQUES (damage, abilities) ===
  pawSwipe: {
    id: 'pawSwipe',
    name: 'Paw Swipe',
    type: 'active',
    element: 'metal',
    cooldown: 5,
    damage: 50,
    description: 'Basic claw attack',
    unlockLevel: 1,
    xpToLearn: 100
  },
  fireBite: {
    id: 'fireBite',
    name: 'Fire Bite',
    type: 'active',
    element: 'fire',
    cooldown: 8,
    damage: 80,
    effect: { burn: { duration: 3, dps: 10 } },
    description: 'Fiery chomp that leaves a burning mark',
    unlockLevel: 5,
    xpToLearn: 500
  },
  hairballBarrage: {
    id: 'hairballBarrage',
    name: 'Hairball Barrage',
    type: 'active',
    element: 'earth',
    cooldown: 15,
    damage: 150,
    aoe: true,
    description: 'Launch a volley of devastating hairballs',
    unlockLevel: 10,
    xpToLearn: 1000
  },
  shadowPounce: {
    id: 'shadowPounce',
    name: 'Shadow Pounce',
    type: 'active',
    element: 'void',
    cooldown: 12,
    damage: 120,
    effect: { stun: 2 },
    description: 'Strike from the shadows, stunning the target',
    unlockLevel: 15,
    unlockElement: 'void',
    xpToLearn: 2000
  },
  waterWhiskers: {
    id: 'waterWhiskers',
    name: 'Water Whiskers',
    type: 'active',
    element: 'water',
    cooldown: 10,
    damage: 60,
    effect: { heal: 30 },
    description: 'Flowing attack that heals the user',
    unlockLevel: 8,
    xpToLearn: 800
  },
  woodenClaw: {
    id: 'woodenClaw',
    name: 'Wooden Claw',
    type: 'active',
    element: 'wood',
    cooldown: 7,
    damage: 70,
    effect: { regen: { duration: 5, hps: 5 } },
    description: 'Nature-infused strike with regeneration',
    unlockLevel: 6,
    xpToLearn: 600
  },
  chaosHonk: {
    id: 'chaosHonk',
    name: 'Chaos Honk',
    type: 'active',
    element: 'chaos',
    cooldown: 20,
    damage: { min: 50, max: 500 },
    aoe: true,
    description: 'HONK! Random damage to all enemies',
    unlockLevel: 20,
    unlockElement: 'chaos',
    xpToLearn: 5000
  },
  nineLivesDance: {
    id: 'nineLivesDance',
    name: 'Nine Lives Dance',
    type: 'active',
    element: 'void',
    cooldown: 60,
    effect: { revive: true },
    description: 'Cheat death once per dungeon run',
    unlockLevel: 25,
    unlockRealm: 'divineBeast',
    xpToLearn: 10000
  },

  // === PASSIVE TECHNIQUES (always active) ===
  softLanding: {
    id: 'softLanding',
    name: 'Soft Landing',
    type: 'passive',
    effect: { dodgeChance: 0.1 },
    description: '+10% dodge chance',
    unlockLevel: 3,
    xpToLearn: 300
  },
  loudPurr: {
    id: 'loudPurr',
    name: 'Loud Purr',
    type: 'passive',
    effect: { teamHappiness: 1.1 },
    description: '+10% team happiness',
    unlockLevel: 5,
    xpToLearn: 400
  },
  ironFloof: {
    id: 'ironFloof',
    name: 'Iron Floof',
    type: 'passive',
    effect: { defense: 1.2 },
    description: '+20% defense',
    unlockLevel: 7,
    xpToLearn: 600
  },
  predatorInstinct: {
    id: 'predatorInstinct',
    name: 'Predator Instinct',
    type: 'passive',
    effect: { critChance: 0.15, critDamage: 1.25 },
    description: '+15% crit chance, +25% crit damage',
    unlockLevel: 12,
    xpToLearn: 1500
  },
  eternaLoaf: {
    id: 'eternaLoaf',
    name: 'Eterna-Loaf',
    type: 'passive',
    effect: { ppGeneration: 1.5, happinessDecay: 0.5 },
    description: '+50% PP generation, -50% happiness decay',
    unlockLevel: 15,
    xpToLearn: 2500
  },
  voidGaze: {
    id: 'voidGaze',
    name: 'Void Gaze',
    type: 'passive',
    effect: { allElementalDamage: 1.15, secretFind: 2.0 },
    description: '+15% all elemental damage, 2x secret finding',
    unlockLevel: 20,
    unlockElement: 'void',
    xpToLearn: 5000
  }
};

// =============================================================================
// STAR SYSTEM
// =============================================================================

/**
 * Star bonuses from duplicate cats
 * Getting a duplicate cat increases stars instead of adding new cat
 */
const STAR_BONUSES = {
  1: { stats: 1.0, visualEffect: null, description: 'Base power' },
  2: { stats: 1.1, visualEffect: 'subtle_glow', description: '+10% stats' },
  3: { stats: 1.25, visualEffect: 'sparkle', description: '+25% stats' },
  4: { stats: 1.5, visualEffect: 'aura', description: '+50% stats' },
  5: { stats: 2.0, visualEffect: 'golden_aura', description: '+100% stats' },
  6: { stats: 3.0, visualEffect: 'celestial_aura', awakening: true, description: '+200% stats, Awakened' }
};

// =============================================================================
// MARTIAL ARTS SCHOOLS
// =============================================================================

const SCHOOLS = {
  shaolin: { id: 'shaolin', name: 'Shaolin', bonus: 'stability', color: '#FF8C00', emoji: '🥋' },
  wudang: { id: 'wudang', name: 'Wudang', bonus: 'grace', color: '#4682B4', emoji: '☯️' },
  emei: { id: 'emei', name: 'Emei', bonus: 'beauty', color: '#FF69B4', emoji: '🌸' },
  beggar: { id: 'beggar', name: 'Beggar', bonus: 'resourcefulness', color: '#8B4513', emoji: '🥢' },
  scholar: { id: 'scholar', name: 'Scholar', bonus: 'wisdom', color: '#9370DB', emoji: '📚' },
  royal_guard: { id: 'royal_guard', name: 'Royal Guard', bonus: 'loyalty', color: '#FFD700', emoji: '🛡️' },
  wanderer: { id: 'wanderer', name: 'Wanderer', bonus: 'mystery', color: '#708090', emoji: '🌙' },
  divine: { id: 'divine', name: 'Divine', bonus: 'transcendence', color: '#FFFFFF', emoji: '✨' }
};

// =============================================================================
// CAT TEMPLATES
// =============================================================================

const CAT_TEMPLATES = {
  // === MORTAL KITTEN REALM ===
  tabby_disciple: {
    id: 'tabby_disciple',
    name: 'Tabby Disciple',
    school: 'shaolin',
    realm: 'kittenMortal',
    element: 'earth',
    personality: 'disciplined',
    description: 'A humble tabby beginning the path of cultivation.',
    baseStats: {
      snootMeridians: 1.0,
      innerPurr: 1.0,
      floofArmor: 1.0,
      zoomieSteps: 1.0,
      loafMastery: 1.0
    },
    learnableTechniques: ['pawSwipe', 'softLanding', 'ironFloof'],
    emoji: '🐱',
    quotes: ["Mrrp.", "*practices paw strikes*"]
  },
  tuxedo_monk: {
    id: 'tuxedo_monk',
    name: 'Tuxedo Monk',
    school: 'shaolin',
    realm: 'kittenMortal',
    element: 'metal',
    personality: 'disciplined',
    description: 'Always dressed for the occasion. Very formal boops.',
    baseStats: {
      snootMeridians: 1.1,
      innerPurr: 1.2,
      floofArmor: 0.9,
      zoomieSteps: 0.8,
      loafMastery: 1.3
    },
    learnableTechniques: ['pawSwipe', 'loudPurr'],
    emoji: '🐈‍⬛',
    quotes: ["*adjusts invisible tie*", "Dignity in all things."]
  },
  orange_wanderer: {
    id: 'orange_wanderer',
    name: 'Orange Wanderer',
    school: 'wanderer',
    realm: 'kittenMortal',
    element: 'fire',
    personality: 'playful',
    description: 'Shares one brain cell with all orange cats. Uses it wisely.',
    baseStats: {
      snootMeridians: 1.3,
      innerPurr: 0.8,
      floofArmor: 1.2,
      zoomieSteps: 1.4,
      loafMastery: 0.7
    },
    learnableTechniques: ['pawSwipe', 'fireBite', 'softLanding'],
    emoji: '🧡',
    quotes: ["*the brain cell has left*", "FOOD?!"]
  },
  calico_initiate: {
    id: 'calico_initiate',
    name: 'Calico Initiate',
    school: 'emei',
    realm: 'kittenMortal',
    element: 'wood',
    personality: 'mysterious',
    description: 'Three colors, three times the attitude.',
    baseStats: {
      snootMeridians: 1.0,
      innerPurr: 1.1,
      floofArmor: 1.1,
      zoomieSteps: 1.0,
      loafMastery: 1.0
    },
    learnableTechniques: ['pawSwipe', 'woodenClaw'],
    emoji: '🎨',
    quotes: ["*judges silently*", "I suppose you may boop."]
  },
  grey_student: {
    id: 'grey_student',
    name: 'Grey Student',
    school: 'scholar',
    realm: 'kittenMortal',
    element: 'water',
    personality: 'lazy',
    description: 'Studies the ancient texts. Mostly naps on them.',
    baseStats: {
      snootMeridians: 0.9,
      innerPurr: 1.3,
      floofArmor: 0.9,
      zoomieSteps: 0.8,
      loafMastery: 1.4
    },
    learnableTechniques: ['pawSwipe', 'waterWhiskers', 'eternaLoaf'],
    emoji: '🩶',
    quotes: ["*intellectual purring*", "I've read about this..."]
  },
  street_scrapper: {
    id: 'street_scrapper',
    name: 'Street Scrapper',
    school: 'beggar',
    realm: 'kittenMortal',
    element: 'metal',
    personality: 'brave',
    description: 'Learned to fight in the alleys. Surprisingly cuddly.',
    baseStats: {
      snootMeridians: 1.2,
      innerPurr: 0.9,
      floofArmor: 1.3,
      zoomieSteps: 1.1,
      loafMastery: 0.8
    },
    learnableTechniques: ['pawSwipe', 'predatorInstinct'],
    emoji: '😼',
    quotes: ["You want some?!", "*aggressive purring*"]
  },

  // === EARTH KITTEN REALM ===
  siamese_blade: {
    id: 'siamese_blade',
    name: 'Siamese Blade',
    school: 'wudang',
    realm: 'earthKitten',
    element: 'metal',
    personality: 'disciplined',
    description: 'Graceful and vocal. Very, very vocal.',
    baseStats: {
      snootMeridians: 1.3,
      innerPurr: 1.4,
      floofArmor: 1.0,
      zoomieSteps: 1.5,
      loafMastery: 1.2
    },
    learnableTechniques: ['pawSwipe', 'predatorInstinct', 'ironFloof'],
    emoji: '🗡️',
    quotes: ["MRROOOWW!", "*elegant screaming*"]
  },
  void_stalker: {
    id: 'void_stalker',
    name: 'Void Stalker',
    school: 'wanderer',
    realm: 'earthKitten',
    element: 'void',
    personality: 'mysterious',
    description: 'A black cat who has seen the void. The void booped back.',
    baseStats: {
      snootMeridians: 1.2,
      innerPurr: 1.5,
      floofArmor: 1.1,
      zoomieSteps: 1.3,
      loafMastery: 1.4
    },
    learnableTechniques: ['pawSwipe', 'shadowPounce', 'voidGaze'],
    emoji: '🖤',
    quotes: ["*stares into nothing*", "...I have seen things."]
  },
  persian_noble: {
    id: 'persian_noble',
    name: 'Persian Noble',
    school: 'royal_guard',
    realm: 'earthKitten',
    element: 'earth',
    personality: 'gluttonous',
    description: 'Demands only the finest boops. Accepts adequate ones.',
    baseStats: {
      snootMeridians: 1.1,
      innerPurr: 1.6,
      floofArmor: 1.4,
      zoomieSteps: 0.8,
      loafMastery: 1.5
    },
    learnableTechniques: ['pawSwipe', 'ironFloof', 'eternaLoaf'],
    emoji: '👑',
    quotes: ["*regal sniff*", "This is... acceptable."]
  },
  maine_coon_guardian: {
    id: 'maine_coon_guardian',
    name: 'Maine Coon Guardian',
    school: 'royal_guard',
    realm: 'earthKitten',
    element: 'earth',
    personality: 'brave',
    description: 'Absolutely massive. Absolutely gentle. Absolute unit.',
    baseStats: {
      snootMeridians: 1.5,
      innerPurr: 1.3,
      floofArmor: 1.8,
      zoomieSteps: 0.9,
      loafMastery: 1.3
    },
    learnableTechniques: ['pawSwipe', 'hairballBarrage', 'ironFloof'],
    emoji: '🦁',
    quotes: ["*protective stance*", "I am... large."]
  },

  // === SKY KITTEN REALM ===
  folded_ear_master: {
    id: 'folded_ear_master',
    name: 'Folded Ear Master',
    school: 'wudang',
    realm: 'skyKitten',
    element: 'water',
    personality: 'mysterious',
    description: 'Ears folded from centuries of listening to the wind.',
    baseStats: {
      snootMeridians: 1.6,
      innerPurr: 1.8,
      floofArmor: 1.3,
      zoomieSteps: 1.4,
      loafMastery: 1.7
    },
    learnableTechniques: ['pawSwipe', 'waterWhiskers', 'softLanding', 'predatorInstinct'],
    emoji: '🌬️',
    quotes: ["I hear... everything.", "*wise ear twitch*"]
  },
  munchkin_sage: {
    id: 'munchkin_sage',
    name: 'Munchkin Sage',
    school: 'scholar',
    realm: 'skyKitten',
    element: 'wood',
    personality: 'lazy',
    description: 'Short legs, tall wisdom. Master of low-altitude cultivation.',
    baseStats: {
      snootMeridians: 1.4,
      innerPurr: 2.0,
      floofArmor: 1.2,
      zoomieSteps: 1.1,
      loafMastery: 1.9
    },
    learnableTechniques: ['pawSwipe', 'woodenClaw', 'eternaLoaf', 'loudPurr'],
    emoji: '📜',
    quotes: ["Size matters not.", "*waddles wisely*"]
  },
  floof_immortal: {
    id: 'floof_immortal',
    name: 'Floof Immortal',
    school: 'emei',
    realm: 'skyKitten',
    element: 'earth',
    personality: 'playful',
    description: '90% floof, 10% cat, 100% cultivated.',
    baseStats: {
      snootMeridians: 1.5,
      innerPurr: 1.7,
      floofArmor: 2.2,
      zoomieSteps: 1.0,
      loafMastery: 1.8
    },
    learnableTechniques: ['pawSwipe', 'hairballBarrage', 'ironFloof', 'softLanding'],
    emoji: '☁️',
    quotes: ["*disappears into own floof*", "Find me if you can."]
  },

  // === HEAVEN KITTEN REALM ===
  galaxy_cultivator: {
    id: 'galaxy_cultivator',
    name: 'Galaxy Cultivator',
    school: 'divine',
    realm: 'heavenKitten',
    element: 'void',
    personality: 'mysterious',
    description: 'Fur contains actual stars. Do not ask how.',
    baseStats: {
      snootMeridians: 2.0,
      innerPurr: 2.5,
      floofArmor: 1.8,
      zoomieSteps: 2.0,
      loafMastery: 2.2
    },
    learnableTechniques: ['shadowPounce', 'voidGaze', 'nineLivesDance'],
    emoji: '🌌',
    quotes: ["*cosmic purring*", "I contain multitudes."]
  },
  chonk_emperor: {
    id: 'chonk_emperor',
    name: 'Chonk Emperor',
    school: 'royal_guard',
    realm: 'heavenKitten',
    element: 'earth',
    personality: 'gluttonous',
    description: 'Has transcended diet. Rules through sheer mass.',
    baseStats: {
      snootMeridians: 2.2,
      innerPurr: 2.3,
      floofArmor: 3.0,
      zoomieSteps: 0.5,
      loafMastery: 2.8
    },
    learnableTechniques: ['hairballBarrage', 'ironFloof', 'eternaLoaf'],
    emoji: '👑',
    quotes: ["*gravitational purring*", "All shall boop the chonk."]
  },
  nyan_ancestor: {
    id: 'nyan_ancestor',
    name: 'Nyan Ancestor',
    school: 'divine',
    realm: 'heavenKitten',
    element: 'chaos',
    personality: 'playful',
    description: 'First to achieve rainbow body cultivation. Still nyaning.',
    baseStats: {
      snootMeridians: 1.8,
      innerPurr: 2.8,
      floofArmor: 1.5,
      zoomieSteps: 3.0,
      loafMastery: 2.0
    },
    learnableTechniques: ['chaosHonk', 'softLanding', 'loudPurr'],
    emoji: '🌈',
    quotes: ["Nyan~", "*rainbow trail intensifies*"]
  },

  // === DIVINE BEAST REALM ===
  ceiling_cat: {
    id: 'ceiling_cat',
    name: 'Ceiling Cat, the All-Seeing',
    school: 'divine',
    realm: 'divineBeast',
    element: 'void',
    personality: 'mysterious',
    description: 'Watches from the heavens. Grants vision of all snoots.',
    baseStats: {
      snootMeridians: 3.0,
      innerPurr: 4.0,
      floofArmor: 2.5,
      zoomieSteps: 2.0,
      loafMastery: 3.5
    },
    learnableTechniques: ['shadowPounce', 'voidGaze', 'nineLivesDance'],
    signatureEquipment: 'ceiling_eye',
    emoji: '👁️',
    legendary: true,
    quotes: ["I see you.", "*omniscient judging*"]
  },
  keyboard_cat: {
    id: 'keyboard_cat',
    name: 'Keyboard Cat, Melody of Ages',
    school: 'divine',
    realm: 'divineBeast',
    element: 'water',
    personality: 'playful',
    description: 'His songs buff all sect members. Play him off!',
    baseStats: {
      snootMeridians: 2.5,
      innerPurr: 5.0,
      floofArmor: 2.0,
      zoomieSteps: 2.5,
      loafMastery: 3.0
    },
    learnableTechniques: ['waterWhiskers', 'loudPurr', 'eternaLoaf'],
    emoji: '🎹',
    legendary: true,
    quotes: ["*epic keyboard solo*", "Play me off!"]
  },
  longcat: {
    id: 'longcat',
    name: 'Longcat, the Infinite',
    school: 'divine',
    realm: 'divineBeast',
    element: 'void',
    personality: 'lazy',
    description: 'So long he exists in multiple realms simultaneously.',
    baseStats: {
      snootMeridians: 4.0,
      innerPurr: 3.5,
      floofArmor: 3.0,
      zoomieSteps: 1.5,
      loafMastery: 4.0
    },
    learnableTechniques: ['shadowPounce', 'voidGaze', 'eternaLoaf'],
    emoji: '📏',
    legendary: true,
    quotes: ["Looooooong.", "*extends infinitely*"]
  },
  eternal_loaf: {
    id: 'eternal_loaf',
    name: 'The Eternal Loaf',
    school: 'divine',
    realm: 'divineBeast',
    element: 'earth',
    personality: 'lazy',
    description: 'Has transcended movement itself. Pure loaf energy.',
    baseStats: {
      snootMeridians: 2.0,
      innerPurr: 3.0,
      floofArmor: 4.0,
      zoomieSteps: 0.1,
      loafMastery: 10.0
    },
    learnableTechniques: ['hairballBarrage', 'ironFloof', 'eternaLoaf'],
    emoji: '🍞',
    legendary: true,
    quotes: ["...", "*transcendent loafing*"]
  },

  // === CELESTIAL BEAST REALM ===
  primordial_tiger: {
    id: 'primordial_tiger',
    name: 'Primordial Tiger Spirit',
    school: 'divine',
    realm: 'celestialBeast',
    element: 'fire',
    personality: 'brave',
    description: 'The first great cat, ancestor of all feline cultivation.',
    baseStats: {
      snootMeridians: 5.0,
      innerPurr: 6.0,
      floofArmor: 4.0,
      zoomieSteps: 5.0,
      loafMastery: 4.5
    },
    learnableTechniques: ['fireBite', 'predatorInstinct', 'nineLivesDance'],
    emoji: '🐯',
    legendary: true,
    quotes: ["*primal roar echoes through realms*", "I am the FIRST."]
  },
  jade_emperor_cat: {
    id: 'jade_emperor_cat',
    name: 'Jade Emperor Cat',
    school: 'divine',
    realm: 'celestialBeast',
    element: 'earth',
    personality: 'disciplined',
    description: 'Rules the celestial court. All snoots bow before him.',
    baseStats: {
      snootMeridians: 6.0,
      innerPurr: 7.0,
      floofArmor: 5.0,
      zoomieSteps: 3.0,
      loafMastery: 6.0
    },
    learnableTechniques: ['hairballBarrage', 'ironFloof', 'voidGaze', 'eternaLoaf'],
    emoji: '🏯',
    legendary: true,
    quotes: ["*imperial decree*", "The heavens recognize your boop."]
  },

  // === COSMIC ENTITY REALM ===
  schrodingers_observer: {
    id: 'schrodingers_observer',
    name: "Schrödinger's Observer",
    school: 'divine',
    realm: 'cosmicEntity',
    element: 'chaos',
    personality: 'mysterious',
    description: 'Simultaneously booped and unbooped until observed.',
    baseStats: {
      snootMeridians: 10.0,
      innerPurr: 12.0,
      floofArmor: 8.0,
      zoomieSteps: 8.0,
      loafMastery: 10.0
    },
    learnableTechniques: ['chaosHonk', 'shadowPounce', 'voidGaze', 'nineLivesDance'],
    emoji: '⚛️',
    legendary: true,
    mythic: true,
    quotes: ["I am... and am not.", "*exists in superposition*"]
  },
  cosmic_snoot_primordial: {
    id: 'cosmic_snoot_primordial',
    name: 'The Cosmic Snoot Primordial',
    school: 'divine',
    realm: 'cosmicEntity',
    element: 'void',
    personality: 'mysterious',
    description: 'The first snoot. The original boop. The beginning and end.',
    baseStats: {
      snootMeridians: 15.0,
      innerPurr: 15.0,
      floofArmor: 15.0,
      zoomieSteps: 15.0,
      loafMastery: 15.0
    },
    learnableTechniques: ['shadowPounce', 'voidGaze', 'nineLivesDance', 'chaosHonk'],
    emoji: '✨',
    legendary: true,
    mythic: true,
    quotes: ["BOOP.", "*reality trembles*"]
  }
};

// =============================================================================
// RECRUITMENT COSTS
// =============================================================================

const RECRUITMENT_COSTS = {
  kittenMortal: 100,
  earthKitten: 500,
  skyKitten: 2500,
  heavenKitten: 15000,
  divineBeast: 100000,
  celestialBeast: 1000000,
  cosmicEntity: 10000000,
  // Legacy mappings
  mortal: 100,
  earth: 500,
  sky: 2500,
  heaven: 15000,
  divine: 100000
};

// =============================================================================
// CAT SYSTEM CLASS
// =============================================================================

/**
 * CatSystem - Manages the cat collection with cultivation, techniques, and stars
 */
class CatSystem {
  constructor() {
    this.ownedCats = [];
    this.catIdCounter = 0;
  }

  /**
   * Migrate a cat from legacy realm format to new format
   */
  migrateRealm(realmId) {
    return LEGACY_REALM_MAP[realmId] || realmId;
  }

  /**
   * Get realm data with backward compatibility
   */
  getRealmData(realmId) {
    const migratedId = this.migrateRealm(realmId);
    return CAT_REALMS[migratedId] || CAT_REALMS.kittenMortal;
  }

  /**
   * Recruit a random cat of a specific realm
   */
  recruitCat(realm = null) {
    // If no realm specified, roll for realm based on drop rates
    if (!realm) {
      realm = this.rollRealm();
    }

    // Migrate legacy realm IDs
    realm = this.migrateRealm(realm);

    // Get all cats of this realm
    const realmCats = Object.values(CAT_TEMPLATES).filter(c => c.realm === realm);
    if (realmCats.length === 0) return null;

    // Pick a random cat template
    const template = realmCats[Math.floor(Math.random() * realmCats.length)];

    // Check if we already own this cat (duplicate = star upgrade)
    const existingCat = this.ownedCats.find(c => c.templateId === template.id);
    if (existingCat) {
      return this.addDuplicateCat(existingCat);
    }

    // Create a new cat instance
    const cat = this.createCatInstance(template);
    this.ownedCats.push(cat);

    return { type: 'new_cat', cat };
  }

  /**
   * Handle duplicate cat - increase stars
   */
  addDuplicateCat(existingCat) {
    const currentStars = existingCat.stars || 1;

    if (currentStars < 6) {
      existingCat.stars = currentStars + 1;
      this.recalculateStats(existingCat);

      return {
        type: 'star_up',
        cat: existingCat,
        newStars: existingCat.stars,
        message: `${existingCat.name} reached ${existingCat.stars} stars!`
      };
    } else {
      // Max stars - convert to resources
      const realm = this.getRealmData(existingCat.realm);
      const reward = { jadeCatnip: 100 * realm.order };

      return {
        type: 'max_stars',
        cat: existingCat,
        reward,
        message: `${existingCat.name} is at max stars! Received ${reward.jadeCatnip} Jade Catnip.`
      };
    }
  }

  /**
   * Recalculate cat stats after star upgrade or cultivation
   */
  recalculateStats(cat) {
    const template = CAT_TEMPLATES[cat.templateId];
    if (!template) return;

    const starBonus = STAR_BONUSES[cat.stars || 1];
    const realm = this.getRealmData(cat.realm);
    const levelBonus = 1 + ((cat.cultivationLevel || 1) - 1) * 0.05; // 5% per level

    for (const [stat, baseValue] of Object.entries(template.baseStats)) {
      const variation = cat.statVariation?.[stat] || 1;
      cat.stats[stat] = baseValue * variation * starBonus.stats * realm.statsMultiplier * levelBonus;
    }
  }

  /**
   * Roll for a realm based on drop rates
   */
  rollRealm() {
    const roll = Math.random();
    let cumulative = 0;

    for (const [realmId, realm] of Object.entries(CAT_REALMS)) {
      cumulative += realm.dropRate;
      if (roll < cumulative) {
        return realmId;
      }
    }

    return 'kittenMortal'; // Fallback
  }

  /**
   * Create a cat instance from a template
   */
  createCatInstance(template) {
    this.catIdCounter++;

    // Store stat variation for recalculation
    const statVariation = {};
    const stats = {};
    for (const [stat, value] of Object.entries(template.baseStats)) {
      const variation = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
      statVariation[stat] = variation;
      stats[stat] = value * variation;
    }

    // Roll for personality if not specified in template
    const personality = template.personality ||
      Object.keys(CAT_PERSONALITIES)[Math.floor(Math.random() * Object.keys(CAT_PERSONALITIES).length)];

    // Roll for element if not specified
    const basicElements = ['metal', 'wood', 'water', 'fire', 'earth'];
    const element = template.element ||
      basicElements[Math.floor(Math.random() * basicElements.length)];

    return {
      instanceId: this.catIdCounter,
      templateId: template.id,
      name: template.name,
      school: template.school,
      realm: template.realm,
      element: element,
      personality: personality,
      description: template.description,
      stats: stats,
      statVariation: statVariation,
      emoji: template.emoji,
      quotes: template.quotes,
      legendary: template.legendary || false,
      mythic: template.mythic || false,

      // Cultivation System
      stars: 1,
      cultivationLevel: 1,
      cultivationXP: 0,

      // Technique System (4 active + 2 passive slots)
      techniques: {
        active: [null, null, null, null],
        passive: [null, null]
      },
      learnedTechniques: [], // All techniques this cat has learned
      techniqueXP: {}, // XP progress for techniques being learned

      // Status
      happiness: 100,
      obtainedAt: Date.now(),
      braveHeart: false,
      totalBoops: 0,

      // Equipment (for dungeon)
      equipment: {
        weapon: null,
        armor: null,
        accessory: null
      }
    };
  }

  /**
   * Add cultivation XP to a cat
   */
  addCultivationXP(catId, xpAmount) {
    const cat = this.getCatById(catId);
    if (!cat) return null;

    const realm = this.getRealmData(cat.realm);
    const xpNeeded = realm.xpBase * Math.pow(realm.xpScale, cat.cultivationLevel - 1);

    cat.cultivationXP += xpAmount;

    // Check for level up (within realm)
    if (cat.cultivationXP >= xpNeeded && cat.cultivationLevel < realm.maxLevel) {
      cat.cultivationXP -= xpNeeded;
      cat.cultivationLevel++;
      this.recalculateStats(cat);

      return {
        type: 'level_up',
        cat,
        newLevel: cat.cultivationLevel,
        message: `${cat.name} reached cultivation level ${cat.cultivationLevel}!`
      };
    }

    // Check if ready for breakthrough
    if (cat.cultivationLevel >= realm.maxLevel && realm.breakthroughCost) {
      return {
        type: 'breakthrough_ready',
        cat,
        message: `${cat.name} is ready for realm breakthrough!`
      };
    }

    return { type: 'xp_gained', cat, xpGained: xpAmount };
  }

  /**
   * Attempt realm breakthrough
   */
  attemptBreakthrough(catId, resources) {
    const cat = this.getCatById(catId);
    if (!cat) return { success: false, error: 'Cat not found' };

    const currentRealm = this.getRealmData(cat.realm);
    if (cat.cultivationLevel < currentRealm.maxLevel) {
      return { success: false, error: 'Not at max level for current realm' };
    }

    if (!currentRealm.breakthroughCost) {
      return { success: false, error: 'Cannot breakthrough from this realm' };
    }

    // Check resources
    for (const [resource, cost] of Object.entries(currentRealm.breakthroughCost)) {
      if ((resources[resource] || 0) < cost) {
        return { success: false, error: `Not enough ${resource}`, required: currentRealm.breakthroughCost };
      }
    }

    // Find next realm
    const nextRealm = Object.values(CAT_REALMS).find(r => r.order === currentRealm.order + 1);
    if (!nextRealm) {
      return { success: false, error: 'Already at highest realm' };
    }

    // Breakthrough success!
    cat.realm = nextRealm.id;
    cat.cultivationLevel = 1;
    cat.cultivationXP = 0;
    this.recalculateStats(cat);

    return {
      success: true,
      cat,
      oldRealm: currentRealm.name,
      newRealm: nextRealm.name,
      cost: currentRealm.breakthroughCost,
      message: `${cat.name} has broken through to ${nextRealm.name}!`
    };
  }

  /**
   * Learn a technique
   */
  learnTechnique(catId, techniqueId) {
    const cat = this.getCatById(catId);
    if (!cat) return { success: false, error: 'Cat not found' };

    const technique = CAT_TECHNIQUES[techniqueId];
    if (!technique) return { success: false, error: 'Technique not found' };

    // Check if already learned
    if (cat.learnedTechniques.includes(techniqueId)) {
      return { success: false, error: 'Already learned this technique' };
    }

    // Check level requirement
    if (cat.cultivationLevel < technique.unlockLevel) {
      return { success: false, error: `Requires cultivation level ${technique.unlockLevel}` };
    }

    // Check element requirement
    if (technique.unlockElement && cat.element !== technique.unlockElement) {
      return { success: false, error: `Requires ${technique.unlockElement} element` };
    }

    // Check realm requirement
    if (technique.unlockRealm) {
      const requiredRealm = this.getRealmData(technique.unlockRealm);
      const catRealm = this.getRealmData(cat.realm);
      if (catRealm.order < requiredRealm.order) {
        return { success: false, error: `Requires ${requiredRealm.name} realm` };
      }
    }

    // Check XP requirement
    const currentXP = cat.techniqueXP[techniqueId] || 0;
    if (currentXP < technique.xpToLearn) {
      return { success: false, error: `Need ${technique.xpToLearn - currentXP} more technique XP` };
    }

    // Learn the technique!
    cat.learnedTechniques.push(techniqueId);

    return {
      success: true,
      cat,
      technique,
      message: `${cat.name} learned ${technique.name}!`
    };
  }

  /**
   * Equip a technique to a slot
   */
  equipTechnique(catId, techniqueId, slotType, slotIndex) {
    const cat = this.getCatById(catId);
    if (!cat) return { success: false, error: 'Cat not found' };

    const technique = CAT_TECHNIQUES[techniqueId];
    if (!technique) return { success: false, error: 'Technique not found' };

    // Check if learned
    if (!cat.learnedTechniques.includes(techniqueId)) {
      return { success: false, error: 'Technique not learned' };
    }

    // Check slot type matches
    if (technique.type !== slotType) {
      return { success: false, error: `${technique.name} is ${technique.type}, not ${slotType}` };
    }

    // Validate slot index
    const maxSlots = slotType === 'active' ? 4 : 2;
    if (slotIndex < 0 || slotIndex >= maxSlots) {
      return { success: false, error: 'Invalid slot index' };
    }

    // Equip!
    cat.techniques[slotType][slotIndex] = techniqueId;

    return {
      success: true,
      cat,
      message: `${cat.name} equipped ${technique.name} to ${slotType} slot ${slotIndex + 1}`
    };
  }

  /**
   * Add technique XP
   */
  addTechniqueXP(catId, techniqueId, xpAmount) {
    const cat = this.getCatById(catId);
    if (!cat) return null;

    const technique = CAT_TECHNIQUES[techniqueId];
    if (!technique) return null;

    // Apply personality bonus
    const personality = CAT_PERSONALITIES[cat.personality];
    if (personality?.effect?.techniqueXP) {
      xpAmount *= personality.effect.techniqueXP;
    }

    cat.techniqueXP[techniqueId] = (cat.techniqueXP[techniqueId] || 0) + xpAmount;

    // Check if can learn
    if (cat.techniqueXP[techniqueId] >= technique.xpToLearn && !cat.learnedTechniques.includes(techniqueId)) {
      return {
        type: 'ready_to_learn',
        cat,
        technique,
        message: `${cat.name} can now learn ${technique.name}!`
      };
    }

    return { type: 'xp_gained', cat, technique, xpGained: xpAmount };
  }

  /**
   * Get recruitment cost for a realm
   */
  getRecruitmentCost(realm = null) {
    if (realm) {
      const migratedRealm = this.migrateRealm(realm);
      return RECRUITMENT_COSTS[migratedRealm] || RECRUITMENT_COSTS.kittenMortal;
    }
    return RECRUITMENT_COSTS.kittenMortal;
  }

  /**
   * Calculate total PP per second from all cats
   */
  calculatePPPerSecond(modifiers = {}) {
    let totalPP = 0;

    for (const cat of this.ownedCats) {
      const realm = this.getRealmData(cat.realm);
      const realmMultiplier = realm.ppMultiplier;
      const starBonus = STAR_BONUSES[cat.stars || 1];

      // Base PP from cat stats
      let catPP = cat.stats.innerPurr * cat.stats.loafMastery;

      // Apply realm multiplier
      catPP *= realmMultiplier;

      // Apply star bonus
      catPP *= starBonus.stats;

      // Apply happiness (0-100 -> 0.5-1.5 multiplier)
      const happinessMultiplier = 0.5 + (cat.happiness / 100);
      catPP *= happinessMultiplier;

      // Apply cat happiness modifier (Yuelin's bonus)
      if (modifiers.catHappinessMultiplier) {
        catPP *= modifiers.catHappinessMultiplier;
      }

      // Apply personality bonuses
      const personality = CAT_PERSONALITIES[cat.personality];
      if (personality?.effect?.afkBonus && modifiers.isAFK) {
        catPP *= personality.effect.afkBonus;
      }

      // Apply elemental bonus
      const element = CAT_ELEMENTS[cat.element];
      if (element?.bonus?.afkEfficiency && modifiers.isAFK) {
        catPP *= element.bonus.afkEfficiency;
      }

      // Apply technique passive bonuses
      for (const passiveSlot of cat.techniques?.passive || []) {
        if (passiveSlot) {
          const technique = CAT_TECHNIQUES[passiveSlot];
          if (technique?.effect?.ppGeneration) {
            catPP *= technique.effect.ppGeneration;
          }
        }
      }

      totalPP += catPP;
    }

    return totalPP;
  }

  /**
   * Get elemental resonance bonus for a cat team
   */
  calculateTeamResonance(catIds) {
    const cats = catIds.map(id => this.getCatById(id)).filter(c => c);
    if (cats.length < 2) return 1.0;

    let totalBonus = 1.0;

    for (let i = 0; i < cats.length; i++) {
      for (let j = i + 1; j < cats.length; j++) {
        const elem1 = CAT_ELEMENTS[cats[i].element];
        const elem2 = CAT_ELEMENTS[cats[j].element];

        if (elem1?.resonance?.[cats[j].element]) {
          totalBonus *= elem1.resonance[cats[j].element];
        }
        if (elem2?.resonance?.[cats[i].element]) {
          totalBonus *= elem2.resonance[cats[i].element];
        }
      }
    }

    return totalBonus;
  }

  /**
   * Get all owned cats
   */
  getAllCats() {
    return this.ownedCats;
  }

  /**
   * Get a cat by ID
   */
  getCatById(catId) {
    const numId = parseInt(catId);
    return this.ownedCats.find(c =>
      c.id === catId ||
      c.instanceId === catId ||
      c.instanceId === numId ||
      c.id == catId
    );
  }

  /**
   * Get cats by realm
   */
  getCatsByRealm(realm) {
    const migratedRealm = this.migrateRealm(realm);
    return this.ownedCats.filter(c =>
      c.realm === migratedRealm ||
      c.realm === realm
    );
  }

  /**
   * Get cats by element
   */
  getCatsByElement(element) {
    return this.ownedCats.filter(c => c.element === element);
  }

  /**
   * Get cat count
   */
  getCatCount() {
    return this.ownedCats.length;
  }

  /**
   * Get a random quote from a random cat
   */
  getRandomCatQuote() {
    if (this.ownedCats.length === 0) return null;
    const cat = this.ownedCats[Math.floor(Math.random() * this.ownedCats.length)];
    const quote = cat.quotes[Math.floor(Math.random() * cat.quotes.length)];
    return { cat: cat.name, quote };
  }

  /**
   * Update cat happiness over time
   */
  updateHappiness(deltaSeconds, modifiers = {}) {
    for (const cat of this.ownedCats) {
      // Base happiness decay (1% per minute)
      let decayRate = 1;

      // Apply personality modifier
      const personality = CAT_PERSONALITIES[cat.personality];
      if (personality?.effect?.happinessDecay) {
        decayRate *= personality.effect.happinessDecay;
      }

      // Apply technique modifier
      for (const passiveSlot of cat.techniques?.passive || []) {
        if (passiveSlot) {
          const technique = CAT_TECHNIQUES[passiveSlot];
          if (technique?.effect?.happinessDecay) {
            decayRate *= technique.effect.happinessDecay;
          }
        }
      }

      cat.happiness -= (deltaSeconds / 60) * decayRate;

      // Apply building modifiers
      if (modifiers.happinessDecayReduction) {
        cat.happiness += (deltaSeconds / 60) * modifiers.happinessDecayReduction;
      }

      // Clamp happiness
      cat.happiness = Math.max(0, Math.min(100, cat.happiness));
    }
  }

  /**
   * Boost all cat happiness
   */
  boostHappiness(amount) {
    for (const cat of this.ownedCats) {
      cat.happiness = Math.min(100, cat.happiness + amount);
    }
  }

  /**
   * Reset cats for rebirth
   */
  reset() {
    this.ownedCats = [];
    this.catIdCounter = 0;
  }

  /**
   * Serialize cats for saving
   */
  serialize() {
    return {
      cats: this.ownedCats,
      catIdCounter: this.catIdCounter,
      version: 2 // Track save version for migration
    };
  }

  /**
   * Load cats from save data with migration support
   */
  deserialize(data) {
    if (data.catIdCounter) {
      this.catIdCounter = data.catIdCounter;
    }

    if (data.cats) {
      // Migrate old save format
      this.ownedCats = data.cats.map(cat => this.migrateCat(cat, data.version || 1));
    }
  }

  /**
   * Migrate cat data from old versions
   */
  migrateCat(cat, version) {
    // Version 1 -> 2 migration
    if (version < 2) {
      // Migrate realm
      cat.realm = this.migrateRealm(cat.realm);

      // Add missing fields
      if (!cat.stars) cat.stars = 1;
      if (!cat.cultivationLevel) cat.cultivationLevel = cat.level || 1;
      if (!cat.cultivationXP) cat.cultivationXP = 0;
      if (!cat.techniques) {
        cat.techniques = {
          active: [null, null, null, null],
          passive: [null, null]
        };
      }
      if (!cat.learnedTechniques) cat.learnedTechniques = [];
      if (!cat.techniqueXP) cat.techniqueXP = {};
      if (!cat.element) {
        // Assign random element for old cats
        const basicElements = ['metal', 'wood', 'water', 'fire', 'earth'];
        cat.element = basicElements[Math.floor(Math.random() * basicElements.length)];
      }
      if (!cat.personality) {
        // Assign random personality for old cats
        const personalities = Object.keys(CAT_PERSONALITIES);
        cat.personality = personalities[Math.floor(Math.random() * personalities.length)];
      }
      if (!cat.statVariation) {
        cat.statVariation = {};
        for (const stat of Object.keys(cat.stats)) {
          cat.statVariation[stat] = 1;
        }
      }
      if (!cat.equipment) {
        cat.equipment = { weapon: null, armor: null, accessory: null };
      }
    }

    return cat;
  }
}

// =============================================================================
// TEAM FORMATION SYSTEM
// =============================================================================

/**
 * Team Formations - Different tactical arrangements for cat teams
 */
const TEAM_FORMATIONS = {
  default: {
    id: 'default',
    name: 'Standard Formation',
    positions: ['front', 'front', 'back', 'back'],
    bonus: null
  },
  aggressive: {
    id: 'aggressive',
    name: 'Aggressive Formation',
    positions: ['front', 'front', 'front', 'back'],
    bonus: { teamAttack: 1.2, teamDefense: 0.9 }
  },
  defensive: {
    id: 'defensive',
    name: 'Defensive Formation',
    positions: ['front', 'back', 'back', 'back'],
    bonus: { teamAttack: 0.9, teamDefense: 1.3 }
  },
  balanced: {
    id: 'balanced',
    name: 'Balanced Formation',
    positions: ['front', 'mid', 'mid', 'back'],
    bonus: { teamAttack: 1.1, teamDefense: 1.1 }
  }
};

// =============================================================================
// TEAM SYNERGY SYSTEM
// =============================================================================

/**
 * Team Synergies - Bonuses for specific team compositions
 */
const TEAM_SYNERGIES = {
  elementalHarmony: {
    id: 'elementalHarmony',
    name: 'Elemental Harmony',
    condition: { uniqueElements: 4 },
    bonus: { allStats: 1.15 },
    description: '4 different elements = +15% all stats'
  },
  schoolReunion: {
    id: 'schoolReunion',
    name: 'School Reunion',
    condition: { sameSchool: 4 },
    bonus: { schoolBonus: 2.0 },
    description: '4 cats from same school = 2x school bonus'
  },
  personalityClash: {
    id: 'personalityClash',
    name: 'Personality Clash',
    condition: { specificPair: ['brave', 'lazy'] },
    bonus: { eventChance: 1.5, comedyDialogue: true },
    description: 'Brave + Lazy cat = funny interactions'
  },
  legendaryPresence: {
    id: 'legendaryPresence',
    name: 'Legendary Presence',
    condition: { legendaryCount: 1 },
    bonus: { teamMorale: 1.25 },
    description: 'Having a legendary cat inspires the team'
  },
  ceilingAndFloor: {
    id: 'ceilingAndFloor',
    name: 'Ceiling and Floor',
    condition: { specificCats: ['ceiling_god', 'basement_cat'] },
    bonus: { universalVision: true, dungeonMapReveal: true },
    description: 'Ceiling Cat + Basement Cat = see all'
  },
  longAndAntiLong: {
    id: 'longAndAntiLong',
    name: 'Infinite Opposition',
    condition: { specificCats: ['longcat', 'tacgnol'] },
    bonus: { infiniteStretch: true, teamLength: 9999 },
    description: 'Longcat + Tacgnol = infinite team length'
  },
  chaosSquad: {
    id: 'chaosSquad',
    name: 'Chaos Squad',
    condition: { elementCount: { chaos: 2 } },
    bonus: { randomEvents: 2.0, unpredictability: true },
    description: '2+ Chaos cats = double random events'
  },
  voidTrio: {
    id: 'voidTrio',
    name: 'Void Trio',
    condition: { elementCount: { void: 3 } },
    bonus: { dimensionalPower: 1.5, phaseChance: 0.1 },
    description: '3 Void cats = phase through attacks'
  }
};

// =============================================================================
// CAT FUSION SYSTEM
// =============================================================================

/**
 * Fusion Recipes - Combine cats to create new ones
 */
const FUSION_RECIPES = {
  yin_yang_cat: {
    id: 'yin_yang_cat',
    name: 'Yin-Yang Cat',
    ingredients: [
      { element: 'fire', minStars: 3 },
      { element: 'water', minStars: 3 }
    ],
    result: {
      id: 'yin_yang_cat',
      element: 'void',
      realm: 'divineBeast',
      unique: true
    }
  },
  chaos_kitty: {
    id: 'chaos_kitty',
    name: 'Chaos Kitty',
    ingredients: [
      { id: 'goose_touched_cat' },
      { personality: 'brave', minStars: 5 }
    ],
    result: {
      id: 'chaos_kitty',
      element: 'chaos',
      realm: 'divineBeast',
      unique: true
    }
  },
  legendary_loaf: {
    id: 'legendary_loaf',
    name: 'The Eternal Loaf',
    ingredients: [
      { school: 'any', count: 5, minStars: 4 }
    ],
    result: {
      id: 'eternal_loaf',
      legendary: true,
      unique: true
    }
  }
};

// =============================================================================
// CAT FUSION SYSTEM CLASS
// =============================================================================

/**
 * CatFusionSystem - Handles cat fusion mechanics
 */
class CatFusionSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }

  /**
   * Check if a fusion recipe can be performed
   */
  canFuse(recipeId) {
    const recipe = FUSION_RECIPES[recipeId];
    if (!recipe) return { canFuse: false, reason: 'Unknown recipe' };

    for (const ingredient of recipe.ingredients) {
      if (!this.hasIngredient(ingredient)) {
        return { canFuse: false, reason: 'Missing ingredients', missing: ingredient };
      }
    }

    if (recipe.result.unique && this.gameState.hasCat && this.gameState.hasCat(recipe.result.id)) {
      return { canFuse: false, reason: 'Already own this unique cat' };
    }

    return { canFuse: true };
  }

  /**
   * Perform a fusion
   */
  performFusion(recipeId, ingredientCatIds) {
    const check = this.canFuse(recipeId);
    if (!check.canFuse) return check;

    const recipe = FUSION_RECIPES[recipeId];

    // Remove ingredient cats
    for (const catId of ingredientCatIds) {
      if (this.gameState.removeCat) {
        this.gameState.removeCat(catId);
      }
    }

    // Create fused cat
    const fusedCat = this.createFusedCat(recipe.result);
    if (this.gameState.addCat) {
      this.gameState.addCat(fusedCat);
    }

    return {
      success: true,
      newCat: fusedCat,
      message: `${recipe.name} has been born!`
    };
  }

  /**
   * Check if the game state has the required ingredient
   */
  hasIngredient(requirement) {
    const cats = this.gameState.cats || [];

    if (requirement.id) {
      return cats.some(c => c.id === requirement.id || c.templateId === requirement.id);
    }
    if (requirement.element) {
      return cats.some(c =>
        c.element === requirement.element &&
        (c.stars || 1) >= (requirement.minStars || 1)
      );
    }
    if (requirement.personality) {
      return cats.some(c =>
        c.personality === requirement.personality &&
        (c.stars || 1) >= (requirement.minStars || 1)
      );
    }
    if (requirement.count) {
      const matching = cats.filter(c => (c.stars || 1) >= (requirement.minStars || 1));
      return matching.length >= requirement.count;
    }
    return false;
  }

  /**
   * Create a fused cat from a recipe result
   */
  createFusedCat(result) {
    // Get template if exists, otherwise create basic structure
    const template = CAT_TEMPLATES[result.id] || {
      id: result.id,
      name: result.id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      realm: result.realm || 'divineBeast',
      element: result.element || 'void',
      legendary: result.legendary || false,
      baseStats: {
        snootMeridians: 3.0,
        innerPurr: 3.0,
        floofArmor: 3.0,
        zoomieSteps: 3.0,
        loafMastery: 3.0
      }
    };

    return {
      instanceId: Date.now(),
      templateId: template.id,
      name: template.name,
      realm: result.realm || template.realm,
      element: result.element || template.element,
      legendary: result.legendary || template.legendary || false,
      stars: 1,
      cultivationLevel: 1,
      happiness: 100,
      obtainedAt: Date.now(),
      stats: { ...template.baseStats },
      techniques: { active: [null, null, null, null], passive: [null, null] },
      learnedTechniques: [],
      techniqueXP: {},
      equipment: { weapon: null, armor: null, accessory: null }
    };
  }
}

// =============================================================================
// DATA LOADER INTEGRATION
// =============================================================================

/**
 * Load cat data from JSON and merge with hardcoded defaults.
 * Hardcoded values serve as fallback if JSON not available.
 */
function loadCatDataFromJSON(data) {
  if (!data) return;

  // Update CAT_REALMS from JSON (mapped from catRealms in JSON)
  if (data.catRealms) {
    for (const [realmId, realmData] of Object.entries(data.catRealms)) {
      if (CAT_REALMS[realmId]) {
        // Merge JSON data with existing, JSON takes precedence
        // Map JSON keys to our expected keys
        if (realmData.ppMult !== undefined) {
          CAT_REALMS[realmId].ppMultiplier = realmData.ppMult;
        }
        if (realmData.stats !== undefined) {
          CAT_REALMS[realmId].statsMultiplier = realmData.stats;
        }
        if (realmData.name !== undefined) {
          CAT_REALMS[realmId].name = realmData.name;
        }
        if (realmData.order !== undefined) {
          CAT_REALMS[realmId].order = realmData.order;
        }
      }
    }
  }

  // Update CAT_ELEMENTS from JSON
  if (data.elements) {
    for (const [elementId, elementData] of Object.entries(data.elements)) {
      if (CAT_ELEMENTS[elementId]) {
        Object.assign(CAT_ELEMENTS[elementId], elementData);
      } else {
        // New element from JSON
        CAT_ELEMENTS[elementId] = { id: elementId, ...elementData };
      }
    }
  }

  // Update CAT_PERSONALITIES from JSON
  if (data.personalities) {
    for (const [personalityId, personalityData] of Object.entries(data.personalities)) {
      if (CAT_PERSONALITIES[personalityId]) {
        Object.assign(CAT_PERSONALITIES[personalityId], personalityData);
      } else {
        // New personality from JSON
        CAT_PERSONALITIES[personalityId] = { id: personalityId, ...personalityData };
      }
    }
  }

  // Update STAR_BONUSES from JSON
  if (data.starBonuses) {
    for (const [starLevel, bonusData] of Object.entries(data.starBonuses)) {
      const level = parseInt(starLevel);
      if (STAR_BONUSES[level]) {
        Object.assign(STAR_BONUSES[level], bonusData);
      } else {
        STAR_BONUSES[level] = bonusData;
      }
    }
  }

  // Update CAT_TEMPLATES from JSON (mapped from cats in JSON)
  if (data.cats) {
    for (const [catId, catData] of Object.entries(data.cats)) {
      // Map JSON format to our expected format
      const mappedData = { ...catData };
      if (catData.baseRealm && !catData.realm) {
        mappedData.realm = catData.baseRealm;
      }

      if (CAT_TEMPLATES[catId]) {
        Object.assign(CAT_TEMPLATES[catId], mappedData);
      } else {
        // New cat template from JSON
        CAT_TEMPLATES[catId] = { id: catId, ...mappedData };
      }
    }
  }

  // Update TEAM_FORMATIONS from JSON
  if (data.teamFormations) {
    for (const [formationId, formationData] of Object.entries(data.teamFormations)) {
      if (TEAM_FORMATIONS[formationId]) {
        Object.assign(TEAM_FORMATIONS[formationId], formationData);
      } else {
        TEAM_FORMATIONS[formationId] = { id: formationId, ...formationData };
      }
    }
  }

  // Update TEAM_SYNERGIES from JSON
  if (data.teamSynergies) {
    for (const [synergyId, synergyData] of Object.entries(data.teamSynergies)) {
      if (TEAM_SYNERGIES[synergyId]) {
        Object.assign(TEAM_SYNERGIES[synergyId], synergyData);
      } else {
        TEAM_SYNERGIES[synergyId] = { id: synergyId, ...synergyData };
      }
    }
  }

  // Update FUSION_RECIPES from JSON
  if (data.fusionRecipes) {
    for (const [recipeId, recipeData] of Object.entries(data.fusionRecipes)) {
      if (FUSION_RECIPES[recipeId]) {
        Object.assign(FUSION_RECIPES[recipeId], recipeData);
      } else {
        FUSION_RECIPES[recipeId] = { id: recipeId, ...recipeData };
      }
    }
  }

  console.log('[CatSystem] Cat data loaded from JSON');
}

// Integration with dataLoader when available
if (window.dataLoader) {
  dataLoader.onReady('cats', (data) => {
    if (data) {
      loadCatDataFromJSON(data);
    }
  });
  // Also try to get already-loaded data
  const existingData = dataLoader.get('cats');
  if (existingData) {
    loadCatDataFromJSON(existingData);
  }
} else {
  // If dataLoader doesn't exist yet, set up a listener for when it becomes available
  const descriptor = Object.getOwnPropertyDescriptor(window, 'dataLoader');
  if (!descriptor || descriptor.configurable) {
    const existingSetter = descriptor?.set;

    Object.defineProperty(window, 'dataLoader', {
      configurable: true,
      set: function(loader) {
        Object.defineProperty(window, 'dataLoader', {
          configurable: true,
          writable: true,
          value: loader
        });
        // Call existing setter if there was one
        if (existingSetter) {
          existingSetter.call(window, loader);
        }
        // Now that dataLoader is available, register our callback
        if (loader && loader.onReady) {
          loader.onReady('cats', (data) => {
            if (data) {
              loadCatDataFromJSON(data);
            }
          });
        }
      },
      get: function() {
        return undefined;
      }
    });
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

// Export for use in other modules
window.CAT_REALMS = CAT_REALMS;
window.CAT_ELEMENTS = CAT_ELEMENTS;
window.CAT_PERSONALITIES = CAT_PERSONALITIES;
window.CAT_TECHNIQUES = CAT_TECHNIQUES;
window.STAR_BONUSES = STAR_BONUSES;
window.REALMS = REALMS; // Legacy compatibility
window.SCHOOLS = SCHOOLS;
window.CAT_TEMPLATES = CAT_TEMPLATES;
window.RECRUITMENT_COSTS = RECRUITMENT_COSTS;
window.TEAM_FORMATIONS = TEAM_FORMATIONS;
window.TEAM_SYNERGIES = TEAM_SYNERGIES;
window.FUSION_RECIPES = FUSION_RECIPES;
window.CatSystem = CatSystem;
window.CatFusionSystem = CatFusionSystem;
window.loadCatDataFromJSON = loadCatDataFromJSON;
