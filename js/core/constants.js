/**
 * Constants - Global constants for Snoot Booper
 *
 * "The Dao that can be told is not the eternal Dao.
 *  But these constants? These are eternal."
 * — The Celestial Snoot Scripture
 *
 * All game constants centralized for easy balancing and reference.
 */

// =============================================================================
// TIME CONSTANTS
// =============================================================================

const TIME = {
  // Milliseconds
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,

  // Game timing
  MAX_AFK_TIME: 24 * 60 * 60 * 1000, // 24 hours maximum offline gains
  SAVE_INTERVAL: 30 * 1000,          // Auto-save every 30 seconds
  GAME_TICK: 100,                    // Main game loop tick (ms)
  UI_TICK: 250,                      // UI update tick (ms)
  GOOSE_CHECK_INTERVAL: 60 * 1000,   // Check for goose spawn every minute
  FREE_SPIN_COOLDOWN: 60 * 60 * 1000, // Wheel of Fate free spin (1 hour)

  // Combo timing
  DEFAULT_COMBO_DECAY: 2000,         // Combo resets after 2 seconds

  // Activity durations (seconds)
  TEA_CEREMONY_DURATION: 300,
  SPARRING_DURATION: 600,
  MEDITATION_DURATION: 900,
  STARGAZING_DURATION: 600,
  COOKING_DURATION: 450,
  EXPLORING_DURATION: 1200,
  HOT_SPRINGS_DURATION: 600
};

// =============================================================================
// CULTIVATION REALMS
// =============================================================================

const REALMS = {
  // Player realms (10 major realms, each with 9 ranks)
  MORTAL: 'mortal',
  QI_CONDENSATION: 'qiCondensation',
  FOUNDATION_ESTABLISHMENT: 'foundationEstablishment',
  CORE_FORMATION: 'coreFormation',
  NASCENT_SOUL: 'nascentSoul',
  SPIRIT_SEVERING: 'spiritSevering',
  DAO_SEEKING: 'daoSeeking',
  IMMORTAL_ASCENSION: 'immortalAscension',
  TRUE_IMMORTAL: 'trueImmortal',
  HEAVENLY_SOVEREIGN: 'heavenlySovereign'
};

const REALM_ORDER = [
  REALMS.MORTAL,
  REALMS.QI_CONDENSATION,
  REALMS.FOUNDATION_ESTABLISHMENT,
  REALMS.CORE_FORMATION,
  REALMS.NASCENT_SOUL,
  REALMS.SPIRIT_SEVERING,
  REALMS.DAO_SEEKING,
  REALMS.IMMORTAL_ASCENSION,
  REALMS.TRUE_IMMORTAL,
  REALMS.HEAVENLY_SOVEREIGN
];

const REALM_COLORS = {
  [REALMS.MORTAL]: '#A0A0A0',
  [REALMS.QI_CONDENSATION]: '#87CEEB',
  [REALMS.FOUNDATION_ESTABLISHMENT]: '#8B4513',
  [REALMS.CORE_FORMATION]: '#FFD700',
  [REALMS.NASCENT_SOUL]: '#9370DB',
  [REALMS.SPIRIT_SEVERING]: '#DC143C',
  [REALMS.DAO_SEEKING]: '#4169E1',
  [REALMS.IMMORTAL_ASCENSION]: '#FFD700',
  [REALMS.TRUE_IMMORTAL]: '#FFFFFF',
  [REALMS.HEAVENLY_SOVEREIGN]: '#FFD700'
};

const REALM_NAMES = {
  [REALMS.MORTAL]: 'Mortal Realm',
  [REALMS.QI_CONDENSATION]: 'Qi Condensation',
  [REALMS.FOUNDATION_ESTABLISHMENT]: 'Foundation Establishment',
  [REALMS.CORE_FORMATION]: 'Core Formation',
  [REALMS.NASCENT_SOUL]: 'Nascent Soul',
  [REALMS.SPIRIT_SEVERING]: 'Spirit Severing',
  [REALMS.DAO_SEEKING]: 'Dao Seeking',
  [REALMS.IMMORTAL_ASCENSION]: 'Immortal Ascension',
  [REALMS.TRUE_IMMORTAL]: 'True Immortal',
  [REALMS.HEAVENLY_SOVEREIGN]: 'Heavenly Sovereign'
};

const MAX_RANK_PER_REALM = 9;

// Cat realms
const CAT_REALMS = {
  KITTEN_MORTAL: 'kittenMortal',
  EARTH_KITTEN: 'earthKitten',
  SKY_KITTEN: 'skyKitten',
  HEAVEN_KITTEN: 'heavenKitten',
  DIVINE_BEAST: 'divineBeast',
  CELESTIAL_BEAST: 'celestialBeast',
  COSMIC_ENTITY: 'cosmicEntity'
};

const CAT_REALM_ORDER = [
  CAT_REALMS.KITTEN_MORTAL,
  CAT_REALMS.EARTH_KITTEN,
  CAT_REALMS.SKY_KITTEN,
  CAT_REALMS.HEAVEN_KITTEN,
  CAT_REALMS.DIVINE_BEAST,
  CAT_REALMS.CELESTIAL_BEAST,
  CAT_REALMS.COSMIC_ENTITY
];

const CAT_REALM_NAMES = {
  [CAT_REALMS.KITTEN_MORTAL]: 'Mortal Kitten',
  [CAT_REALMS.EARTH_KITTEN]: 'Earth Kitten',
  [CAT_REALMS.SKY_KITTEN]: 'Sky Kitten',
  [CAT_REALMS.HEAVEN_KITTEN]: 'Heaven Kitten',
  [CAT_REALMS.DIVINE_BEAST]: 'Divine Beast',
  [CAT_REALMS.CELESTIAL_BEAST]: 'Celestial Beast',
  [CAT_REALMS.COSMIC_ENTITY]: 'Cosmic Entity'
};

const CAT_REALM_PP_MULTIPLIERS = {
  [CAT_REALMS.KITTEN_MORTAL]: 1,
  [CAT_REALMS.EARTH_KITTEN]: 2,
  [CAT_REALMS.SKY_KITTEN]: 5,
  [CAT_REALMS.HEAVEN_KITTEN]: 15,
  [CAT_REALMS.DIVINE_BEAST]: 50,
  [CAT_REALMS.CELESTIAL_BEAST]: 200,
  [CAT_REALMS.COSMIC_ENTITY]: 1000
};

// =============================================================================
// CURRENCIES
// =============================================================================

const CURRENCIES = {
  BP: 'bp',           // Boop Points
  PP: 'pp',           // Purr Power
  QI: 'qi',           // Qi Energy
  JADE_CATNIP: 'jc',  // Jade Catnip (premium)
  SPIRIT_STONES: 'ss', // Spirit Stones
  HEAVENLY_SEALS: 'hs', // Heavenly Seals (prestige)
  SECT_REPUTATION: 'rep', // Sect Reputation
  WAIFU_TOKENS: 'wt',  // Waifu Tokens
  GOOSE_FEATHERS: 'gf', // Goose Feathers
  KARMA_POINTS: 'kp',  // Karma Points (reincarnation)
  TRANSCENDENCE_POINTS: 'tp' // Transcendence Points
};

const CURRENCY_NAMES = {
  [CURRENCIES.BP]: 'Boop Points',
  [CURRENCIES.PP]: 'Purr Power',
  [CURRENCIES.QI]: 'Qi',
  [CURRENCIES.JADE_CATNIP]: 'Jade Catnip',
  [CURRENCIES.SPIRIT_STONES]: 'Spirit Stones',
  [CURRENCIES.HEAVENLY_SEALS]: 'Heavenly Seals',
  [CURRENCIES.SECT_REPUTATION]: 'Sect Reputation',
  [CURRENCIES.WAIFU_TOKENS]: 'Waifu Tokens',
  [CURRENCIES.GOOSE_FEATHERS]: 'Goose Feathers',
  [CURRENCIES.KARMA_POINTS]: 'Karma Points',
  [CURRENCIES.TRANSCENDENCE_POINTS]: 'Transcendence Points'
};

const CURRENCY_ICONS = {
  [CURRENCIES.BP]: '👆',
  [CURRENCIES.PP]: '😺',
  [CURRENCIES.QI]: '✨',
  [CURRENCIES.JADE_CATNIP]: '💎',
  [CURRENCIES.SPIRIT_STONES]: '💠',
  [CURRENCIES.HEAVENLY_SEALS]: '🔮',
  [CURRENCIES.SECT_REPUTATION]: '🏆',
  [CURRENCIES.WAIFU_TOKENS]: '💕',
  [CURRENCIES.GOOSE_FEATHERS]: '🪶',
  [CURRENCIES.KARMA_POINTS]: '☯️',
  [CURRENCIES.TRANSCENDENCE_POINTS]: '🌟'
};

const CURRENCY_COLORS = {
  [CURRENCIES.BP]: '#E94560',
  [CURRENCIES.PP]: '#FFD700',
  [CURRENCIES.QI]: '#00BFFF',
  [CURRENCIES.JADE_CATNIP]: '#50C878',
  [CURRENCIES.SPIRIT_STONES]: '#9370DB',
  [CURRENCIES.HEAVENLY_SEALS]: '#FFFFFF',
  [CURRENCIES.SECT_REPUTATION]: '#FFD700',
  [CURRENCIES.WAIFU_TOKENS]: '#FFB6C1',
  [CURRENCIES.GOOSE_FEATHERS]: '#F5F5F5',
  [CURRENCIES.KARMA_POINTS]: '#B8860B',
  [CURRENCIES.TRANSCENDENCE_POINTS]: '#E6E6FA'
};

// =============================================================================
// ELEMENTS
// =============================================================================

const ELEMENTS = {
  METAL: 'metal',
  WOOD: 'wood',
  WATER: 'water',
  FIRE: 'fire',
  EARTH: 'earth',
  VOID: 'void',     // Hidden element
  CHAOS: 'chaos'    // Hidden element
};

const ELEMENT_NAMES = {
  [ELEMENTS.METAL]: 'Metal',
  [ELEMENTS.WOOD]: 'Wood',
  [ELEMENTS.WATER]: 'Water',
  [ELEMENTS.FIRE]: 'Fire',
  [ELEMENTS.EARTH]: 'Earth',
  [ELEMENTS.VOID]: 'Void',
  [ELEMENTS.CHAOS]: 'Chaos'
};

const ELEMENT_COLORS = {
  [ELEMENTS.METAL]: '#C0C0C0',
  [ELEMENTS.WOOD]: '#228B22',
  [ELEMENTS.WATER]: '#4169E1',
  [ELEMENTS.FIRE]: '#FF4500',
  [ELEMENTS.EARTH]: '#8B4513',
  [ELEMENTS.VOID]: '#000000',
  [ELEMENTS.CHAOS]: '#FF00FF'
};

// Five Elements cycle (generating/overcoming)
const ELEMENT_GENERATES = {
  [ELEMENTS.METAL]: ELEMENTS.WATER,
  [ELEMENTS.WATER]: ELEMENTS.WOOD,
  [ELEMENTS.WOOD]: ELEMENTS.FIRE,
  [ELEMENTS.FIRE]: ELEMENTS.EARTH,
  [ELEMENTS.EARTH]: ELEMENTS.METAL
};

const ELEMENT_OVERCOMES = {
  [ELEMENTS.METAL]: ELEMENTS.WOOD,
  [ELEMENTS.WOOD]: ELEMENTS.EARTH,
  [ELEMENTS.EARTH]: ELEMENTS.WATER,
  [ELEMENTS.WATER]: ELEMENTS.FIRE,
  [ELEMENTS.FIRE]: ELEMENTS.METAL
};

// =============================================================================
// PERSONALITIES (Cats)
// =============================================================================

const PERSONALITIES = {
  DISCIPLINED: 'disciplined',
  LAZY: 'lazy',
  PLAYFUL: 'playful',
  MYSTERIOUS: 'mysterious',
  BRAVE: 'brave',
  GLUTTONOUS: 'gluttonous'
};

const PERSONALITY_NAMES = {
  [PERSONALITIES.DISCIPLINED]: 'Disciplined',
  [PERSONALITIES.LAZY]: 'Lazy',
  [PERSONALITIES.PLAYFUL]: 'Playful',
  [PERSONALITIES.MYSTERIOUS]: 'Mysterious',
  [PERSONALITIES.BRAVE]: 'Brave',
  [PERSONALITIES.GLUTTONOUS]: 'Gluttonous'
};

const PERSONALITY_DESCRIPTIONS = {
  [PERSONALITIES.DISCIPLINED]: 'Learns techniques faster',
  [PERSONALITIES.LAZY]: 'Better AFK gains, slower active',
  [PERSONALITIES.PLAYFUL]: 'Higher happiness, more events',
  [PERSONALITIES.MYSTERIOUS]: 'Higher crit chance, finds secrets',
  [PERSONALITIES.BRAVE]: 'Bonus vs. Geese, dungeon power',
  [PERSONALITIES.GLUTTONOUS]: 'Gains more from food, higher maintenance'
};

// =============================================================================
// MASTERS
// =============================================================================

const MASTERS = {
  GERALD: 'gerald',
  RUSTY: 'rusty',
  STEVE: 'steve',
  ANDREW: 'andrew',
  NIK: 'nik',
  YUELIN: 'yuelin',
  SCOTT: 'scott',
  EIGHTH: 'eighth' // The Forgotten One
};

const MASTER_NAMES = {
  [MASTERS.GERALD]: 'Gerald',
  [MASTERS.RUSTY]: 'Rusty',
  [MASTERS.STEVE]: 'Steve',
  [MASTERS.ANDREW]: 'Andrew',
  [MASTERS.NIK]: 'Nik',
  [MASTERS.YUELIN]: 'Yuelin',
  [MASTERS.SCOTT]: 'Scott',
  [MASTERS.EIGHTH]: '???'
};

const MASTER_TITLES = {
  [MASTERS.GERALD]: 'The Jade Palm',
  [MASTERS.RUSTY]: 'The Crimson Fist',
  [MASTERS.STEVE]: 'The Flowing River',
  [MASTERS.ANDREW]: 'The Thunder Step',
  [MASTERS.NIK]: 'The Shadow Moon',
  [MASTERS.YUELIN]: 'The Lotus Sage',
  [MASTERS.SCOTT]: 'The Mountain',
  [MASTERS.EIGHTH]: 'The Forgotten One'
};

const MASTER_COLORS = {
  [MASTERS.GERALD]: '#50C878',  // Jade green
  [MASTERS.RUSTY]: '#DC143C',   // Crimson
  [MASTERS.STEVE]: '#4169E1',   // Royal blue
  [MASTERS.ANDREW]: '#FFD700',  // Gold/lightning
  [MASTERS.NIK]: '#483D8B',     // Dark slate blue
  [MASTERS.YUELIN]: '#FFB6C1',  // Light pink (lotus)
  [MASTERS.SCOTT]: '#8B4513',   // Saddle brown (mountain)
  [MASTERS.EIGHTH]: '#FFFFFF'   // White
};

// =============================================================================
// BUILDINGS
// =============================================================================

const BUILDING_CATEGORIES = {
  CORE: 'core',
  PRODUCTION: 'production',
  SOCIAL: 'social',
  UTILITY: 'utility',
  SPECIAL: 'special'
};

const BUILDINGS = {
  // Core
  CAT_PAGODA: 'cat_pagoda',
  MEDITATION_GARDEN: 'meditation_garden',
  TRAINING_DOJO: 'training_dojo',

  // Production
  ALCHEMY_LAB: 'alchemy_lab',
  LIBRARY: 'library',
  TREASURY_VAULT: 'treasury_vault',

  // Social
  WAIFU_QUARTERS: 'waifu_quarters',
  HOT_SPRINGS: 'hot_springs',
  ARENA: 'arena',
  PORTAL_GATE: 'portal_gate',

  // Utility
  CELESTIAL_KITCHEN: 'celestial_kitchen',
  GOOSE_WATCHTOWER: 'goose_watchtower',
  OBSERVATORY: 'observatory',

  // Special
  HALL_OF_LEGENDS: 'hall_of_legends',
  GOOSE_PEN: 'goose_pen',
  PAGODA_ENTRANCE: 'pagoda_entrance'
};

// =============================================================================
// TERRITORIES
// =============================================================================

const TERRITORIES = {
  HUMBLE_COURTYARD: 'humble_courtyard',
  MOUNTAIN_SANCTUARY: 'mountain_sanctuary',
  FLOATING_PALACE: 'floating_palace',
  CELESTIAL_REALM: 'celestial_realm'
};

const TERRITORY_NAMES = {
  [TERRITORIES.HUMBLE_COURTYARD]: 'Humble Courtyard',
  [TERRITORIES.MOUNTAIN_SANCTUARY]: 'Mountain Sanctuary',
  [TERRITORIES.FLOATING_PALACE]: 'Floating Palace',
  [TERRITORIES.CELESTIAL_REALM]: 'Celestial Realm'
};

// =============================================================================
// DUNGEONS
// =============================================================================

const DUNGEONS = {
  INFINITE_PAGODA: 'infinite_pagoda',
  BAMBOO_FOREST: 'bamboo_forest',
  CELESTIAL_TOURNAMENT: 'celestial_tournament',
  DREAM_REALM: 'dream_realm',
  GOOSE_DIMENSION: 'goose_dimension',
  MEMORY_FRAGMENTS: 'memory_fragments'
};

const DUNGEON_NAMES = {
  [DUNGEONS.INFINITE_PAGODA]: 'The Infinite Pagoda',
  [DUNGEONS.BAMBOO_FOREST]: 'The Bamboo Forest',
  [DUNGEONS.CELESTIAL_TOURNAMENT]: 'The Celestial Tournament',
  [DUNGEONS.DREAM_REALM]: 'The Dream Realm',
  [DUNGEONS.GOOSE_DIMENSION]: 'The Goose Dimension',
  [DUNGEONS.MEMORY_FRAGMENTS]: 'Memory Fragments'
};

const FLOOR_TYPES = {
  COMBAT: 'combat',
  ELITE: 'elite',
  BOSS: 'boss',
  TREASURE: 'treasure',
  EVENT: 'event',
  SHOP: 'shop',
  REST: 'rest'
};

// =============================================================================
// TECHNIQUE STANCES
// =============================================================================

const STANCES = {
  JADE_PALM: 'jadePalm',
  IRON_FINGER: 'ironFinger',
  DRUNKEN_PAW: 'drunkenPaw',
  SHADOW_STEP: 'shadowStep',
  FLOWING_RIVER: 'flowingRiver',
  FORBIDDEN_TECHNIQUE: 'forbiddenTechnique'
};

const STANCE_NAMES = {
  [STANCES.JADE_PALM]: 'Jade Palm',
  [STANCES.IRON_FINGER]: 'Iron Finger',
  [STANCES.DRUNKEN_PAW]: 'Drunken Paw',
  [STANCES.SHADOW_STEP]: 'Shadow Step',
  [STANCES.FLOWING_RIVER]: 'Flowing River',
  [STANCES.FORBIDDEN_TECHNIQUE]: 'Thousand Snoot Annihilation'
};

// =============================================================================
// EQUIPMENT
// =============================================================================

const EQUIPMENT_SLOTS = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  ACCESSORY: 'accessory',
  HAT: 'hat',
  COLLAR: 'collar',
  PAWS: 'paws',
  TAIL: 'tail',
  MOUNT: 'mount',
  COMPANION: 'companion',
  SECRET_SCROLL: 'secretScroll'
};

const EQUIPMENT_RARITIES = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  MYTHIC: 'mythic'
};

const RARITY_COLORS = {
  [EQUIPMENT_RARITIES.COMMON]: '#A0A0A0',
  [EQUIPMENT_RARITIES.UNCOMMON]: '#2ECC71',
  [EQUIPMENT_RARITIES.RARE]: '#3498DB',
  [EQUIPMENT_RARITIES.EPIC]: '#9B59B6',
  [EQUIPMENT_RARITIES.LEGENDARY]: '#F39C12',
  [EQUIPMENT_RARITIES.MYTHIC]: '#E74C3C'
};

// =============================================================================
// GOOSE
// =============================================================================

const GOOSE_MOODS = {
  CALM: 'calm',
  SUSPICIOUS: 'suspicious',
  AGGRESSIVE: 'aggressive',
  RAGE: 'rage'
};

const GOOSE_TYPES = {
  NORMAL: 'normal',
  UNTITLED: 'untitled',
  ELDER: 'elder',
  GOLDEN: 'golden',
  COBRA_CHICKEN: 'cobraChicken'
};

const GOOSE_ALLY_TYPES = {
  GUARD: 'guard',
  ATTACK: 'attack',
  CHAOS: 'chaos',
  HONK: 'honk'
};

// =============================================================================
// PRESTIGE
// =============================================================================

const PRESTIGE_TYPES = {
  ASCENSION: 'ascension',
  REINCARNATION: 'reincarnation',
  TRANSCENDENCE: 'transcendence'
};

const PRESTIGE_THRESHOLDS = {
  ASCENSION_PP: 1e9,              // 1 Billion PP
  REINCARNATION_ASCENSIONS: 10,
  REINCARNATION_SEALS: 500,
  TRANSCENDENCE_REINCARNATIONS: 5,
  TRANSCENDENCE_KARMA: 1000
};

// =============================================================================
// WAIFUS
// =============================================================================

const WAIFUS = {
  MOCHI: 'mochi',
  LUNA: 'luna',
  NYANTA: 'nyanta',
  MEI: 'mei',
  SAKURA: 'sakura',
  YUKI: 'yuki',
  JADE: 'jade',
  CRIMSON: 'crimson',
  GRANDMOTHER: 'grandmother',
  RIVAL: 'rival',
  VOID_WAIFU: 'void_waifu',
  HONK_MAIDEN: 'honk_maiden'
};

const MAX_BOND_LEVEL = 100;

// =============================================================================
// GAME BALANCE CONSTANTS
// =============================================================================

const BALANCE = {
  // Boop system
  BASE_CRIT_CHANCE: 0.05,
  BASE_CRIT_MULTIPLIER: 10,
  MAX_COMBO: 100,
  COMBO_BONUS_PER_STACK: 0.01,

  // Cat system
  MAX_TEAM_SIZE: 4,
  MAX_RESERVE_SIZE: 1,
  MAX_CAT_STARS: 6,
  MAX_CAT_LEVEL: 100,

  // Waifu system
  MAX_BOND_LEVEL: 100,
  BOND_DECAY_THRESHOLD: 0.3, // Jealousy threshold

  // Goose system
  GOOSE_SPAWN_CHANCE: 0.02,  // 2% per minute
  GOOSE_TIME_LIMIT: 30000,   // 30 seconds to boop

  // Wheel of Fate
  WHEEL_COST_THREADS: 10,
  WHEEL_PITY_THRESHOLD: 50,

  // Scaling
  XP_SCALE_PER_RANK: 1.15,
  REALM_SCALE: 3.0,
  COST_SCALE_DEFAULT: 1.5,

  // Caps
  CAT_CAPACITY_BASE: 10,
  BUILDING_MAX_LEVEL_DEFAULT: 10,

  // Rates
  PP_BASE_RATE: 1,
  AFK_EFFICIENCY_BASE: 0.5
};

// =============================================================================
// UI/VISUAL CONSTANTS
// =============================================================================

const UI = {
  // Particle limits
  MAX_PARTICLES: 50,
  PARTICLE_LIFETIME: 1000,

  // Animation durations
  BOOP_ANIMATION_MS: 200,
  NOTIFICATION_DURATION: 3000,
  MODAL_FADE_MS: 300,

  // Screen shake
  SCREEN_SHAKE_INTENSITY: 5,
  SCREEN_SHAKE_DURATION: 100,

  // Z-indices
  Z_INDEX_MODAL: 1000,
  Z_INDEX_NOTIFICATION: 1100,
  Z_INDEX_TOOLTIP: 1200
};

// =============================================================================
// AUDIO
// =============================================================================

const AUDIO = {
  MASTER_VOLUME: 0.7,
  MUSIC_VOLUME: 0.5,
  SFX_VOLUME: 0.8,

  // Music BPM for rhythm system
  DEFAULT_BPM: 120,
  RHYTHM_TOLERANCE_MS: 50
};

// =============================================================================
// SAVE/LOAD
// =============================================================================

const SAVE = {
  KEY: 'celestial_snoot_sect',
  VERSION: '2.0.0',
  MAX_BACKUP_COUNT: 5
};

// =============================================================================
// Export all constants
// =============================================================================

const CONSTANTS = {
  TIME,
  REALMS,
  REALM_ORDER,
  REALM_COLORS,
  REALM_NAMES,
  MAX_RANK_PER_REALM,
  CAT_REALMS,
  CAT_REALM_ORDER,
  CAT_REALM_NAMES,
  CAT_REALM_PP_MULTIPLIERS,
  CURRENCIES,
  CURRENCY_NAMES,
  CURRENCY_ICONS,
  CURRENCY_COLORS,
  ELEMENTS,
  ELEMENT_NAMES,
  ELEMENT_COLORS,
  ELEMENT_GENERATES,
  ELEMENT_OVERCOMES,
  PERSONALITIES,
  PERSONALITY_NAMES,
  PERSONALITY_DESCRIPTIONS,
  MASTERS,
  MASTER_NAMES,
  MASTER_TITLES,
  MASTER_COLORS,
  BUILDING_CATEGORIES,
  BUILDINGS,
  TERRITORIES,
  TERRITORY_NAMES,
  DUNGEONS,
  DUNGEON_NAMES,
  FLOOR_TYPES,
  STANCES,
  STANCE_NAMES,
  EQUIPMENT_SLOTS,
  EQUIPMENT_RARITIES,
  RARITY_COLORS,
  GOOSE_MOODS,
  GOOSE_TYPES,
  GOOSE_ALLY_TYPES,
  PRESTIGE_TYPES,
  PRESTIGE_THRESHOLDS,
  WAIFUS,
  MAX_BOND_LEVEL,
  BALANCE,
  UI,
  AUDIO,
  SAVE
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONSTANTS;
} else {
  // Browser global - expose both the container and individual constants
  window.CONSTANTS = CONSTANTS;

  // Also expose commonly used constant groups directly
  window.TIME = TIME;
  window.REALMS = REALMS;
  window.CURRENCIES = CURRENCIES;
  window.ELEMENTS = ELEMENTS;
  window.MASTERS = MASTERS;
  window.BALANCE = BALANCE;
}
