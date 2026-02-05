/**
 * equipment.js - Cat Equipment System
 * "A well-equipped cat is a formidable cultivator."
 */

// Equipment Slots
const EQUIPMENT_SLOTS = {
  hat: { id: 'hat', name: 'Hat', emoji: '🎩', primaryStats: ['critChance', 'wisdom'] },
  collar: { id: 'collar', name: 'Collar', emoji: '📿', primaryStats: ['hp', 'defense'] },
  weapon: { id: 'weapon', name: 'Weapon', emoji: '⚔️', primaryStats: ['attack', 'boopDamage'] },
  armor: { id: 'armor', name: 'Armor', emoji: '🛡️', primaryStats: ['defense', 'damageReduction'] },
  paws: { id: 'paws', name: 'Paws', emoji: '🐾', primaryStats: ['speed', 'dodge'] },
  tail: { id: 'tail', name: 'Tail', emoji: '🎀', primaryStats: ['luck', 'specialEffect'] }
};

// Equipment Rarities
const EQUIPMENT_RARITIES = {
  common: { id: 'common', name: 'Common', color: '#9CA3AF', multiplier: 1.0, maxSubs: 1 },
  uncommon: { id: 'uncommon', name: 'Uncommon', color: '#10B981', multiplier: 1.25, maxSubs: 2 },
  rare: { id: 'rare', name: 'Rare', color: '#3B82F6', multiplier: 1.5, maxSubs: 3 },
  epic: { id: 'epic', name: 'Epic', color: '#8B5CF6', multiplier: 2.0, maxSubs: 4 },
  legendary: { id: 'legendary', name: 'Legendary', color: '#F59E0B', multiplier: 3.0, maxSubs: 4 },
  mythic: { id: 'mythic', name: 'Mythic', color: '#EF4444', multiplier: 5.0, maxSubs: 5 },
  transcendent: { id: 'transcendent', name: 'Transcendent', color: '#EC4899', multiplier: 10.0, maxSubs: 6 }
};

// Equipment Sets
const EQUIPMENT_SETS = {
  jade_emperor: {
    id: 'jade_emperor',
    name: 'Jade Emperor',
    pieces: ['jade_crown', 'jade_collar', 'jade_sword', 'jade_armor', 'jade_boots', 'jade_tail_ring'],
    bonuses: {
      2: { allStats: 0.1, description: '+10% all stats' },
      4: { allStats: 0.3, critChance: 0.1, description: '+30% all stats, +10% crit' },
      6: { allStats: 1.0, deathImmune: true, description: '+100% all stats, immune to first death' }
    }
  },
  thunder_god: {
    id: 'thunder_god',
    name: 'Thunder God',
    pieces: ['storm_cap', 'thunder_collar', 'lightning_claws', 'storm_vest'],
    bonuses: {
      2: { attackSpeed: 0.15, description: '+15% attack speed' },
      4: { chainLightning: true, description: 'Crits trigger chain lightning' }
    }
  },
  void_walker: {
    id: 'void_walker',
    name: 'Void Walker',
    pieces: ['void_hood', 'void_pendant', 'shadow_blade', 'void_cloak'],
    bonuses: {
      2: { dodge: 0.1, description: '+10% dodge chance' },
      4: { phaseChance: 0.2, description: '20% chance to phase through attacks' }
    }
  },
  nature_blessing: {
    id: 'nature_blessing',
    name: "Nature's Blessing",
    pieces: ['flower_crown', 'vine_collar', 'thorn_claws', 'leaf_armor'],
    bonuses: {
      2: { regenPerSecond: 0.01, description: 'Regen 1% HP per second' },
      4: { regenPerSecond: 0.02, description: 'Regen 2% HP per second' }
    }
  },
  inferno: {
    id: 'inferno',
    name: 'Inferno',
    pieces: ['flame_helm', 'ember_collar', 'fire_claws', 'magma_armor'],
    bonuses: {
      2: { fireDamage: 0.2, description: '+20% fire damage' },
      4: { burningAttacks: true, description: 'Attacks apply burning DOT' }
    }
  },
  celestial: {
    id: 'celestial',
    name: 'Celestial',
    pieces: ['star_crown', 'moon_pendant', 'sun_blade', 'cosmic_robe', 'astral_boots', 'comet_tail'],
    bonuses: {
      2: { bpMultiplier: 0.25, description: '+25% BP from all sources' },
      4: { ppMultiplier: 0.25, description: '+25% PP from all sources' },
      6: { ascensionDamage: 0.5, description: '+50% damage in Pagoda' }
    }
  },
  ancient_one: {
    id: 'ancient_one',
    name: 'Ancient One',
    pieces: ['elder_hat', 'primordial_collar', 'forgotten_blade', 'timeless_armor', 'eternal_paws', 'infinity_tail'],
    bonuses: {
      2: { expGain: 0.3, description: '+30% experience gain' },
      4: { cooldownReduction: 0.2, description: '-20% ability cooldowns' },
      6: { timeDilation: true, description: 'Slow time during combat' }
    }
  }
};

// Equipment Templates
const EQUIPMENT_TEMPLATES = {
  // === HATS ===
  training_cap: {
    id: 'training_cap',
    name: 'Training Cap',
    slot: 'hat',
    rarity: 'common',
    stats: { critChance: 0.02, wisdom: 5 },
    flavorText: '"Every journey begins with a single hat."'
  },
  jade_crown: {
    id: 'jade_crown',
    name: 'Jade Emperor Crown',
    slot: 'hat',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { critChance: 0.15, wisdom: 100, allStats: 0.1 },
    element: 'light',
    flavorText: '"Worn by the first Cat Emperor."'
  },
  storm_cap: {
    id: 'storm_cap',
    name: 'Storm Cap',
    slot: 'hat',
    rarity: 'epic',
    set: 'thunder_god',
    stats: { critChance: 0.1, attackSpeed: 0.1 },
    element: 'water',
    flavorText: '"Crackles with static electricity."'
  },
  void_hood: {
    id: 'void_hood',
    name: 'Void Hood',
    slot: 'hat',
    rarity: 'epic',
    set: 'void_walker',
    stats: { dodge: 0.08, critChance: 0.05 },
    element: 'void',
    flavorText: '"See into the darkness."'
  },
  flower_crown: {
    id: 'flower_crown',
    name: 'Flower Crown',
    slot: 'hat',
    rarity: 'rare',
    set: 'nature_blessing',
    stats: { wisdom: 30, regenPerSecond: 0.005 },
    element: 'nature',
    flavorText: '"Blooms with inner peace."'
  },
  flame_helm: {
    id: 'flame_helm',
    name: 'Flame Helm',
    slot: 'hat',
    rarity: 'epic',
    set: 'inferno',
    stats: { attack: 20, fireDamage: 0.1 },
    element: 'fire',
    flavorText: '"The flames never burn the wearer."'
  },
  star_crown: {
    id: 'star_crown',
    name: 'Star Crown',
    slot: 'hat',
    rarity: 'legendary',
    set: 'celestial',
    stats: { critChance: 0.12, wisdom: 80, bpMultiplier: 0.1 },
    element: 'light',
    flavorText: '"Forged from a dying star."'
  },
  elder_hat: {
    id: 'elder_hat',
    name: 'Elder Hat',
    slot: 'hat',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { wisdom: 150, expGain: 0.15, cooldownReduction: 0.1 },
    flavorText: '"Older than time itself."'
  },

  // === COLLARS ===
  leather_collar: {
    id: 'leather_collar',
    name: 'Leather Collar',
    slot: 'collar',
    rarity: 'common',
    stats: { hp: 20, defense: 5 },
    flavorText: '"Simple but effective."'
  },
  jade_collar: {
    id: 'jade_collar',
    name: 'Jade Emperor Collar',
    slot: 'collar',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { hp: 200, defense: 50, allStats: 0.1 },
    element: 'light',
    flavorText: '"Pulses with imperial authority."'
  },
  thunder_collar: {
    id: 'thunder_collar',
    name: 'Thunder Collar',
    slot: 'collar',
    rarity: 'epic',
    set: 'thunder_god',
    stats: { hp: 100, attackSpeed: 0.1 },
    element: 'water',
    flavorText: '"Hums with electrical energy."'
  },
  void_pendant: {
    id: 'void_pendant',
    name: 'Void Pendant',
    slot: 'collar',
    rarity: 'epic',
    set: 'void_walker',
    stats: { hp: 80, dodge: 0.05, damageReduction: 0.1 },
    element: 'void',
    flavorText: '"A window to nothingness."'
  },
  vine_collar: {
    id: 'vine_collar',
    name: 'Vine Collar',
    slot: 'collar',
    rarity: 'rare',
    set: 'nature_blessing',
    stats: { hp: 60, regenPerSecond: 0.008 },
    element: 'nature',
    flavorText: '"Living vines that heal wounds."'
  },
  ember_collar: {
    id: 'ember_collar',
    name: 'Ember Collar',
    slot: 'collar',
    rarity: 'epic',
    set: 'inferno',
    stats: { hp: 80, fireDamage: 0.15 },
    element: 'fire',
    flavorText: '"Warm to the touch, burning to enemies."'
  },
  moon_pendant: {
    id: 'moon_pendant',
    name: 'Moon Pendant',
    slot: 'collar',
    rarity: 'legendary',
    set: 'celestial',
    stats: { hp: 150, defense: 40, ppMultiplier: 0.1 },
    element: 'light',
    flavorText: '"Glows brighter at night."'
  },
  primordial_collar: {
    id: 'primordial_collar',
    name: 'Primordial Collar',
    slot: 'collar',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { hp: 300, defense: 80, expGain: 0.1 },
    flavorText: '"From before the first dawn."'
  },

  // === WEAPONS ===
  wooden_claws: {
    id: 'wooden_claws',
    name: 'Wooden Claws',
    slot: 'weapon',
    rarity: 'common',
    stats: { attack: 10, boopDamage: 1 },
    flavorText: '"A beginner\'s first weapon."'
  },
  jade_sword: {
    id: 'jade_sword',
    name: 'Jade Emperor Sword',
    slot: 'weapon',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { attack: 150, boopDamage: 50, critDamage: 0.5 },
    element: 'light',
    flavorText: '"Cuts through fate itself."'
  },
  lightning_claws: {
    id: 'lightning_claws',
    name: 'Lightning Claws',
    slot: 'weapon',
    rarity: 'epic',
    set: 'thunder_god',
    stats: { attack: 80, attackSpeed: 0.15 },
    element: 'water',
    flavorText: '"Strike with the speed of lightning."'
  },
  shadow_blade: {
    id: 'shadow_blade',
    name: 'Shadow Blade',
    slot: 'weapon',
    rarity: 'epic',
    set: 'void_walker',
    stats: { attack: 70, critChance: 0.1, critDamage: 0.3 },
    element: 'void',
    flavorText: '"Strikes from unseen angles."'
  },
  thorn_claws: {
    id: 'thorn_claws',
    name: 'Thorn Claws',
    slot: 'weapon',
    rarity: 'rare',
    set: 'nature_blessing',
    stats: { attack: 40, poisonDamage: 0.1 },
    element: 'nature',
    flavorText: '"Nature\'s sharp defense."'
  },
  fire_claws: {
    id: 'fire_claws',
    name: 'Fire Claws',
    slot: 'weapon',
    rarity: 'epic',
    set: 'inferno',
    stats: { attack: 90, fireDamage: 0.25 },
    element: 'fire',
    flavorText: '"Leave burning trails."'
  },
  sun_blade: {
    id: 'sun_blade',
    name: 'Sun Blade',
    slot: 'weapon',
    rarity: 'legendary',
    set: 'celestial',
    stats: { attack: 120, boopDamage: 40, lightDamage: 0.2 },
    element: 'light',
    flavorText: '"Blazes with solar fury."'
  },
  forgotten_blade: {
    id: 'forgotten_blade',
    name: 'Forgotten Blade',
    slot: 'weapon',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { attack: 200, boopDamage: 80, trueDamage: 0.1 },
    flavorText: '"Its name was lost to time."'
  },

  // === ARMOR ===
  cloth_vest: {
    id: 'cloth_vest',
    name: 'Cloth Vest',
    slot: 'armor',
    rarity: 'common',
    stats: { defense: 10, damageReduction: 0.02 },
    flavorText: '"Better than nothing."'
  },
  jade_armor: {
    id: 'jade_armor',
    name: 'Jade Emperor Armor',
    slot: 'armor',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { defense: 100, damageReduction: 0.2, hp: 100 },
    element: 'light',
    flavorText: '"Impervious to mortal weapons."'
  },
  storm_vest: {
    id: 'storm_vest',
    name: 'Storm Vest',
    slot: 'armor',
    rarity: 'epic',
    set: 'thunder_god',
    stats: { defense: 60, attackSpeed: 0.08, shockOnHit: true },
    element: 'water',
    flavorText: '"Shocks those who strike you."'
  },
  void_cloak: {
    id: 'void_cloak',
    name: 'Void Cloak',
    slot: 'armor',
    rarity: 'epic',
    set: 'void_walker',
    stats: { defense: 50, dodge: 0.1, phaseChance: 0.05 },
    element: 'void',
    flavorText: '"Partially exists in another dimension."'
  },
  leaf_armor: {
    id: 'leaf_armor',
    name: 'Leaf Armor',
    slot: 'armor',
    rarity: 'rare',
    set: 'nature_blessing',
    stats: { defense: 35, regenPerSecond: 0.01 },
    element: 'nature',
    flavorText: '"Living leaves that regenerate."'
  },
  magma_armor: {
    id: 'magma_armor',
    name: 'Magma Armor',
    slot: 'armor',
    rarity: 'epic',
    set: 'inferno',
    stats: { defense: 70, fireDamage: 0.1, thornDamage: 0.15 },
    element: 'fire',
    flavorText: '"Burns those who touch it."'
  },
  cosmic_robe: {
    id: 'cosmic_robe',
    name: 'Cosmic Robe',
    slot: 'armor',
    rarity: 'legendary',
    set: 'celestial',
    stats: { defense: 80, damageReduction: 0.15, allStats: 0.1 },
    element: 'light',
    flavorText: '"Woven from starlight."'
  },
  timeless_armor: {
    id: 'timeless_armor',
    name: 'Timeless Armor',
    slot: 'armor',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { defense: 150, damageReduction: 0.25, cooldownReduction: 0.1 },
    flavorText: '"Unchanged by eons."'
  },

  // === PAWS ===
  simple_boots: {
    id: 'simple_boots',
    name: 'Simple Boots',
    slot: 'paws',
    rarity: 'common',
    stats: { speed: 5, dodge: 0.01 },
    flavorText: '"Basic footwear."'
  },
  jade_boots: {
    id: 'jade_boots',
    name: 'Jade Emperor Boots',
    slot: 'paws',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { speed: 50, dodge: 0.15, allStats: 0.1 },
    element: 'light',
    flavorText: '"Walk on clouds."'
  },
  astral_boots: {
    id: 'astral_boots',
    name: 'Astral Boots',
    slot: 'paws',
    rarity: 'legendary',
    set: 'celestial',
    stats: { speed: 40, dodge: 0.1, bpMultiplier: 0.1 },
    element: 'light',
    flavorText: '"Step between stars."'
  },
  eternal_paws: {
    id: 'eternal_paws',
    name: 'Eternal Paws',
    slot: 'paws',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { speed: 60, dodge: 0.2, expGain: 0.1 },
    flavorText: '"Have walked infinite paths."'
  },

  // === TAILS ===
  ribbon_tail: {
    id: 'ribbon_tail',
    name: 'Ribbon Tail',
    slot: 'tail',
    rarity: 'common',
    stats: { luck: 5 },
    flavorText: '"A simple decoration."'
  },
  jade_tail_ring: {
    id: 'jade_tail_ring',
    name: 'Jade Emperor Tail Ring',
    slot: 'tail',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { luck: 50, critChance: 0.1, allStats: 0.1 },
    element: 'light',
    flavorText: '"Channel imperial luck."'
  },
  comet_tail: {
    id: 'comet_tail',
    name: 'Comet Tail',
    slot: 'tail',
    rarity: 'legendary',
    set: 'celestial',
    stats: { luck: 40, speed: 20, ppMultiplier: 0.1 },
    element: 'light',
    flavorText: '"Trails stardust."'
  },
  infinity_tail: {
    id: 'infinity_tail',
    name: 'Infinity Tail',
    slot: 'tail',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { luck: 80, allStats: 0.15, cooldownReduction: 0.1 },
    flavorText: '"Contains infinite possibilities."'
  },

  // =============================================
  // === CRAZY LEGENDARY & MYTHIC DROPS ===
  // =============================================

  // === MEME TIER HATS ===
  tin_foil_hat: {
    id: 'tin_foil_hat',
    name: 'Tin Foil Hat of Conspiracy',
    slot: 'hat',
    rarity: 'legendary',
    stats: { wisdom: 999, dodge: 0.25, critChance: 0.2 },
    special: { immuneToMindControl: true, paranoia: 0.5 },
    flavorText: '"THEY are watching. But now YOU are watching THEM."'
  },
  gamer_headset: {
    id: 'gamer_headset',
    name: 'RGB Gamer Headset',
    slot: 'hat',
    rarity: 'epic',
    stats: { attackSpeed: 0.3, critChance: 0.15, critDamage: 0.5 },
    special: { mlgMode: true },
    flavorText: '"360 no-scope boops activated."'
  },
  clown_wig: {
    id: 'clown_wig',
    name: 'Honkler\'s Wig',
    slot: 'hat',
    rarity: 'legendary',
    stats: { luck: 200, bpMultiplier: 0.5, allStats: 0.2 },
    special: { gooseAttraction: 2.0 },
    flavorText: '"Honk honk. The geese approve."'
  },
  galaxy_brain: {
    id: 'galaxy_brain',
    name: 'Galaxy Brain',
    slot: 'hat',
    rarity: 'mythic',
    stats: { wisdom: 500, ppMultiplier: 1.0, expGain: 0.5 },
    special: { bigBrain: true, transcendentThoughts: true },
    flavorText: '"Your IQ is now visible from space."'
  },
  anime_protagonist_hair: {
    id: 'anime_protagonist_hair',
    name: 'Anime Protagonist Hair',
    slot: 'hat',
    rarity: 'transcendent',
    stats: { allStats: 0.5, critChance: 0.3, critDamage: 1.0 },
    special: { plotArmor: true, powerOfFriendship: true },
    flavorText: '"This isn\'t even my final form!"'
  },
  cat_ears_on_cat: {
    id: 'cat_ears_on_cat',
    name: 'Cat Ears (For Cats)',
    slot: 'hat',
    rarity: 'legendary',
    stats: { allStats: 0.25, ppMultiplier: 0.5 },
    special: { metaCuteness: true, confusedEnemies: 0.3 },
    flavorText: '"Yo dawg, I heard you like cats..."'
  },

  // === INSANE COLLARS ===
  infinity_collar: {
    id: 'infinity_collar',
    name: 'Infinity Collar',
    slot: 'collar',
    rarity: 'transcendent',
    stats: { hp: 9999, defense: 500, allStats: 0.5 },
    special: { infiniteRetries: 3, realityWarp: true },
    flavorText: '"Perfectly balanced, as all things should be."'
  },
  bitcoin_chain: {
    id: 'bitcoin_chain',
    name: 'Bitcoin Blockchain',
    slot: 'collar',
    rarity: 'legendary',
    stats: { bpMultiplier: 1.0, luck: 100 },
    special: { volatileGains: true, toTheMoon: 0.1 },
    flavorText: '"HODL your boops. Diamond paws."'
  },
  nokia_collar: {
    id: 'nokia_collar',
    name: 'Nokia 3310 Collar',
    slot: 'collar',
    rarity: 'mythic',
    stats: { hp: 5000, defense: 999, damageReduction: 0.5 },
    special: { indestructible: true },
    flavorText: '"Literally cannot be destroyed."'
  },
  uwu_choker: {
    id: 'uwu_choker',
    name: 'UwU Power Choker',
    slot: 'collar',
    rarity: 'epic',
    stats: { luck: 150, ppMultiplier: 0.4, allStats: 0.15 },
    special: { uwuAura: true },
    flavorText: '"*notices your cultivation* OwO what\'s this?"'
  },
  collar_of_infinite_treats: {
    id: 'collar_of_infinite_treats',
    name: 'Collar of Infinite Treats',
    slot: 'collar',
    rarity: 'legendary',
    stats: { hp: 300, regenPerSecond: 0.05, ppMultiplier: 0.3 },
    special: { infiniteTreats: true, happinessLock: true },
    flavorText: '"The treats... they never end..."'
  },

  // === GAME-BREAKING WEAPONS ===
  banhammer: {
    id: 'banhammer',
    name: 'The Banhammer',
    slot: 'weapon',
    rarity: 'transcendent',
    stats: { attack: 9999, critChance: 0.5, critDamage: 5.0 },
    special: { instantBan: 0.1, adminPower: true },
    flavorText: '"You have been permanently banned from existing."'
  },
  legendary_fish: {
    id: 'legendary_fish',
    name: 'Legendary Fish of Slapping',
    slot: 'weapon',
    rarity: 'legendary',
    stats: { attack: 500, attackSpeed: 0.5, critChance: 0.25 },
    special: { fishSlap: true, wetDebuff: true },
    flavorText: '"*SLAP* *SLAP* *SLAP* *SLAP*"'
  },
  keyboard_warrior: {
    id: 'keyboard_warrior',
    name: 'Mechanical Keyboard of Rage',
    slot: 'weapon',
    rarity: 'epic',
    stats: { attack: 200, attackSpeed: 0.4, critDamage: 0.8 },
    special: { capsLockRage: true, typoStrike: 0.2 },
    flavorText: '"FIGHT ME IRL BRO (clicks aggressively)"'
  },
  nerf_bat: {
    id: 'nerf_bat',
    name: 'Nerf Bat of the Devs',
    slot: 'weapon',
    rarity: 'mythic',
    stats: { attack: 1, allStats: -0.5 },
    special: { nerfEnemies: 0.9, patchNotes: true },
    flavorText: '"We felt this was too strong. -The Devs"'
  },
  debug_stick: {
    id: 'debug_stick',
    name: 'Debug Stick',
    slot: 'weapon',
    rarity: 'transcendent',
    stats: { attack: 1337, critChance: 0.99, boopDamage: 500 },
    special: { godMode: true, clipThroughWalls: true },
    flavorText: '"You\'re not supposed to have this."'
  },
  uno_reverse: {
    id: 'uno_reverse',
    name: 'Uno Reverse Card',
    slot: 'weapon',
    rarity: 'legendary',
    stats: { attack: 100, damageReduction: 0.5 },
    special: { reflectDamage: 1.0, noU: true },
    flavorText: '"No u."'
  },
  bonk_stick: {
    id: 'bonk_stick',
    name: 'Bonk Stick of Horni Jail',
    slot: 'weapon',
    rarity: 'epic',
    stats: { attack: 250, critChance: 0.2 },
    special: { bonk: true, sendToHorniJail: true },
    flavorText: '"Go to horni jail. BONK!"'
  },
  laser_pointer: {
    id: 'laser_pointer',
    name: 'Infinite Laser Pointer',
    slot: 'weapon',
    rarity: 'legendary',
    stats: { attack: 300, attackSpeed: 1.0, critChance: 0.3 },
    special: { catDistraction: true, unlimitedPower: true },
    flavorText: '"The red dot... I MUST CATCH IT!"'
  },

  // === OVERPOWERED ARMOR ===
  plot_armor: {
    id: 'plot_armor',
    name: 'Plot Armor',
    slot: 'armor',
    rarity: 'transcendent',
    stats: { hp: 10000, defense: 1000, damageReduction: 0.75 },
    special: { cannotDieToNonBoss: true, dramaticRevive: true },
    flavorText: '"The main character never dies."'
  },
  cardboard_box: {
    id: 'cardboard_box',
    name: 'Tactical Cardboard Box',
    slot: 'armor',
    rarity: 'legendary',
    stats: { dodge: 0.5, defense: 100 },
    special: { stealth: true, solidSnake: true },
    flavorText: '"!" (Alert sound)"'
  },
  bubble_wrap: {
    id: 'bubble_wrap',
    name: 'Bubble Wrap of Protection',
    slot: 'armor',
    rarity: 'epic',
    stats: { hp: 500, damageReduction: 0.3 },
    special: { popPop: true, satisfying: true },
    flavorText: '"*pop* *pop* *pop* So satisfying."'
  },
  thicc_armor: {
    id: 'thicc_armor',
    name: 'THICC Armor',
    slot: 'armor',
    rarity: 'legendary',
    stats: { hp: 2000, defense: 300, damageReduction: 0.4 },
    special: { absoluteUnit: true, inAweAtTheSize: true },
    flavorText: '"In awe at the size of this lad."'
  },
  hoodie: {
    id: 'hoodie',
    name: 'Hoodie of Unlimited Comfort',
    slot: 'armor',
    rarity: 'mythic',
    stats: { hp: 800, regenPerSecond: 0.03, allStats: 0.2 },
    special: { cozyMode: true, neverCold: true, ppMultiplier: 0.25 },
    flavorText: '"Maximum comf achieved."'
  },

  // === SPEEDY PAWS ===
  heelies: {
    id: 'heelies',
    name: 'Heelies of Infinite Rolling',
    slot: 'paws',
    rarity: 'legendary',
    stats: { speed: 200, dodge: 0.3, attackSpeed: 0.2 },
    special: { smoothRolling: true, coolKid: true },
    flavorText: '"They see me rollin\', they hatin\'."'
  },
  crocs: {
    id: 'crocs',
    name: 'Crocs of MAXIMUM POWER',
    slot: 'paws',
    rarity: 'mythic',
    stats: { allStats: 0.4, speed: 150, luck: 100 },
    special: { sportMode: true, comfortable: true },
    flavorText: '"When the Crocs come off, it\'s serious."'
  },
  rocket_boots: {
    id: 'rocket_boots',
    name: 'Rocket Boots',
    slot: 'paws',
    rarity: 'transcendent',
    stats: { speed: 500, dodge: 0.4, attackSpeed: 0.5 },
    special: { flight: true, explosiveEntry: true },
    flavorText: '"NYOOOOOOM"'
  },
  gamer_socks: {
    id: 'gamer_socks',
    name: 'RGB Gamer Socks',
    slot: 'paws',
    rarity: 'epic',
    stats: { speed: 100, attackSpeed: 0.25, critChance: 0.1 },
    special: { gamingEnhanced: true },
    flavorText: '"They actually improve performance. Science."'
  },
  moon_shoes: {
    id: 'moon_shoes',
    name: 'Moon Shoes',
    slot: 'paws',
    rarity: 'legendary',
    stats: { speed: 150, dodge: 0.35, luck: 50 },
    special: { lowGravity: true, bouncy: true },
    flavorText: '"Boing boing boing boing"'
  },

  // === RIDICULOUS TAILS ===
  wifi_router_tail: {
    id: 'wifi_router_tail',
    name: 'WiFi Router Tail',
    slot: 'tail',
    rarity: 'legendary',
    stats: { allStats: 0.25, attackSpeed: 0.3, ppMultiplier: 0.4 },
    special: { strongSignal: true, noLag: true },
    flavorText: '"Full bars. Always."'
  },
  nine_tails: {
    id: 'nine_tails',
    name: 'Nine Tails of Power',
    slot: 'tail',
    rarity: 'transcendent',
    stats: { allStats: 0.9, attack: 500, critDamage: 1.0 },
    special: { kitsunePower: true, multiTail: 9 },
    flavorText: '"Believe it!"'
  },
  propeller_tail: {
    id: 'propeller_tail',
    name: 'Propeller Tail',
    slot: 'tail',
    rarity: 'epic',
    stats: { speed: 100, attackSpeed: 0.4, dodge: 0.2 },
    special: { helicopter: true, takeoff: true },
    flavorText: '"BRRRRRRRRRR"'
  },
  lucky_rabbits_tail: {
    id: 'lucky_rabbits_tail',
    name: 'Lucky Rabbit\'s Tail',
    slot: 'tail',
    rarity: 'legendary',
    stats: { luck: 300, critChance: 0.25, bpMultiplier: 0.5 },
    special: { extremeLuck: true, doubleDrops: 0.3 },
    flavorText: '"Lucky for you, not the rabbit."'
  },
  usb_tail: {
    id: 'usb_tail',
    name: 'USB Tail (Always Right)',
    slot: 'tail',
    rarity: 'mythic',
    stats: { luck: 500, wisdom: 200 },
    special: { alwaysPlugsInFirst: true, impossibleLuck: true },
    flavorText: '"Plugs in on the first try. EVERY. TIME."'
  },
  disco_ball_tail: {
    id: 'disco_ball_tail',
    name: 'Disco Ball Tail',
    slot: 'tail',
    rarity: 'legendary',
    stats: { luck: 100, allStats: 0.2, bpMultiplier: 0.3 },
    special: { partyMode: true, groovy: true },
    flavorText: '"Stayin\' alive, stayin\' alive."'
  },

  // === ULTIMATE MEME SET ===
  stonks_crown: {
    id: 'stonks_crown',
    name: 'Stonks Crown',
    slot: 'hat',
    rarity: 'mythic',
    stats: { bpMultiplier: 2.0, luck: 200 },
    special: { stonksOnly: true, lineGoUp: true },
    flavorText: '"Stonks only go up."'
  },
  doge_collar: {
    id: 'doge_collar',
    name: 'Doge Collar',
    slot: 'collar',
    rarity: 'mythic',
    stats: { luck: 300, bpMultiplier: 1.0, allStats: 0.3 },
    special: { muchWow: true, suchValue: true },
    flavorText: '"Much boop. Very cultivate. Wow."'
  },
  diamond_paws: {
    id: 'diamond_paws',
    name: 'Diamond Paws',
    slot: 'paws',
    rarity: 'transcendent',
    stats: { attack: 300, defense: 300, bpMultiplier: 1.5 },
    special: { neverSell: true, hodl: true },
    flavorText: '"DIAMOND PAWS BABY! NEVER SELLING!"'
  },

  // === FORBIDDEN ITEMS ===
  forbidden_catnip: {
    id: 'forbidden_catnip',
    name: 'The Forbidden Catnip',
    slot: 'weapon',
    rarity: 'transcendent',
    stats: { attack: 2000, allStats: 1.0, critChance: 0.5 },
    special: { cosmicHigh: true, seeingColors: true, unlimited: true },
    flavorText: '"They said it couldn\'t be done. They were wrong."'
  },
  developers_console: {
    id: 'developers_console',
    name: 'Developer\'s Console',
    slot: 'collar',
    rarity: 'transcendent',
    stats: { allStats: 5.0 },
    special: { cheatsEnabled: true, noclip: true, godMode: true },
    flavorText: '"sv_cheats 1"'
  },
  golden_boop_button: {
    id: 'golden_boop_button',
    name: 'Golden Boop Button',
    slot: 'weapon',
    rarity: 'transcendent',
    stats: { boopDamage: 1000, critChance: 0.75, critDamage: 3.0 },
    special: { goldenBoops: true, satisfaction: 999 },
    flavorText: '"The ultimate boop. The final snoot."'
  },

  // =============================================
  // === FLOOR 1-10 DROPS (Common/Uncommon) ===
  // =============================================
  rusty_helmet: { id: 'rusty_helmet', name: 'Rusty Helmet', slot: 'hat', rarity: 'common', stats: { defense: 5, hp: 10 }, flavorText: '"It\'s seen better days."' },
  moth_eaten_cap: { id: 'moth_eaten_cap', name: 'Moth-Eaten Cap', slot: 'hat', rarity: 'common', stats: { wisdom: 3, luck: 2 }, flavorText: '"The holes add character."' },
  apprentice_hood: { id: 'apprentice_hood', name: 'Apprentice Hood', slot: 'hat', rarity: 'uncommon', stats: { wisdom: 10, critChance: 0.02 }, flavorText: '"Every master was once a student."' },
  lucky_bandana: { id: 'lucky_bandana', name: 'Lucky Bandana', slot: 'hat', rarity: 'uncommon', stats: { luck: 15, dodge: 0.03 }, flavorText: '"Found in a dumpster. Feels lucky."' },

  worn_collar: { id: 'worn_collar', name: 'Worn Collar', slot: 'collar', rarity: 'common', stats: { hp: 15, defense: 3 }, flavorText: '"Comfortable but shabby."' },
  beaded_necklace: { id: 'beaded_necklace', name: 'Beaded Necklace', slot: 'collar', rarity: 'common', stats: { luck: 5, wisdom: 5 }, flavorText: '"108 beads for good fortune."' },
  iron_collar: { id: 'iron_collar', name: 'Iron Collar', slot: 'collar', rarity: 'uncommon', stats: { hp: 30, defense: 10 }, flavorText: '"Heavy but protective."' },
  charm_necklace: { id: 'charm_necklace', name: 'Charm Necklace', slot: 'collar', rarity: 'uncommon', stats: { luck: 20, critChance: 0.03 }, flavorText: '"Jingling with potential."' },

  twig_claws: { id: 'twig_claws', name: 'Twig Claws', slot: 'weapon', rarity: 'common', stats: { attack: 5, boopDamage: 1 }, flavorText: '"Better than nothing."' },
  sharpened_stick: { id: 'sharpened_stick', name: 'Sharpened Stick', slot: 'weapon', rarity: 'common', stats: { attack: 8, critChance: 0.01 }, flavorText: '"Pointy end goes in enemy."' },
  iron_claws: { id: 'iron_claws', name: 'Iron Claws', slot: 'weapon', rarity: 'uncommon', stats: { attack: 15, boopDamage: 3 }, flavorText: '"Now we\'re talking."' },
  hunting_knife: { id: 'hunting_knife', name: 'Hunting Knife', slot: 'weapon', rarity: 'uncommon', stats: { attack: 18, critChance: 0.04 }, flavorText: '"Sharp and reliable."' },

  ragged_vest: { id: 'ragged_vest', name: 'Ragged Vest', slot: 'armor', rarity: 'common', stats: { hp: 20, defense: 5 }, flavorText: '"More holes than fabric."' },
  padded_tunic: { id: 'padded_tunic', name: 'Padded Tunic', slot: 'armor', rarity: 'common', stats: { hp: 30, defense: 8 }, flavorText: '"Stuffed with cotton."' },
  leather_vest: { id: 'leather_vest', name: 'Leather Vest', slot: 'armor', rarity: 'uncommon', stats: { hp: 50, defense: 15 }, flavorText: '"Smells like adventure."' },
  chain_shirt: { id: 'chain_shirt', name: 'Chain Shirt', slot: 'armor', rarity: 'uncommon', stats: { hp: 60, defense: 20, damageReduction: 0.05 }, flavorText: '"Jingly protection."' },

  worn_sandals: { id: 'worn_sandals', name: 'Worn Sandals', slot: 'paws', rarity: 'common', stats: { speed: 5, dodge: 0.01 }, flavorText: '"They flap when you walk."' },
  cloth_wraps: { id: 'cloth_wraps', name: 'Cloth Wraps', slot: 'paws', rarity: 'common', stats: { speed: 8, attackSpeed: 0.02 }, flavorText: '"Protects the beans."' },
  runner_boots: { id: 'runner_boots', name: 'Runner Boots', slot: 'paws', rarity: 'uncommon', stats: { speed: 20, dodge: 0.05 }, flavorText: '"Made for running."' },
  soft_pads: { id: 'soft_pads', name: 'Soft Paw Pads', slot: 'paws', rarity: 'uncommon', stats: { speed: 15, attackSpeed: 0.05, dodge: 0.03 }, flavorText: '"Silent but deadly."' },

  string_tail: { id: 'string_tail', name: 'String Tail Tie', slot: 'tail', rarity: 'common', stats: { luck: 3 }, flavorText: '"A simple decoration."' },
  bell_tail: { id: 'bell_tail', name: 'Bell Tail Ring', slot: 'tail', rarity: 'common', stats: { luck: 5, dodge: 0.02 }, flavorText: '"Jingle jingle."' },
  feather_tail: { id: 'feather_tail', name: 'Feather Tail Charm', slot: 'tail', rarity: 'uncommon', stats: { luck: 12, speed: 5 }, flavorText: '"Light and airy."' },
  copper_ring: { id: 'copper_ring', name: 'Copper Tail Ring', slot: 'tail', rarity: 'uncommon', stats: { luck: 15, bpMultiplier: 0.05 }, flavorText: '"Shiny!"' },

  // =============================================
  // === FLOOR 11-25 DROPS (Rare) ===
  // =============================================
  warrior_helm: { id: 'warrior_helm', name: 'Warrior\'s Helm', slot: 'hat', rarity: 'rare', stats: { defense: 25, hp: 50, attack: 10 }, flavorText: '"Battle-tested."' },
  mystic_circlet: { id: 'mystic_circlet', name: 'Mystic Circlet', slot: 'hat', rarity: 'rare', stats: { wisdom: 40, critChance: 0.08, ppMultiplier: 0.1 }, flavorText: '"Hums with energy."' },
  bandit_mask: { id: 'bandit_mask', name: 'Bandit Mask', slot: 'hat', rarity: 'rare', stats: { critChance: 0.1, critDamage: 0.2, dodge: 0.05 }, flavorText: '"This is a robbery."' },
  scholar_cap: { id: 'scholar_cap', name: 'Scholar\'s Cap', slot: 'hat', rarity: 'rare', stats: { wisdom: 50, expGain: 0.15 }, flavorText: '"Knowledge is power."' },
  horned_helmet: { id: 'horned_helmet', name: 'Horned Helmet', slot: 'hat', rarity: 'rare', stats: { attack: 30, defense: 20, critDamage: 0.15 }, flavorText: '"Very intimidating."' },

  steel_collar: { id: 'steel_collar', name: 'Steel Collar', slot: 'collar', rarity: 'rare', stats: { hp: 100, defense: 30, damageReduction: 0.08 }, flavorText: '"Solid protection."' },
  mana_crystal_pendant: { id: 'mana_crystal_pendant', name: 'Mana Crystal Pendant', slot: 'collar', rarity: 'rare', stats: { wisdom: 35, ppMultiplier: 0.15, regenPerSecond: 0.008 }, flavorText: '"Pulses with arcane energy."' },
  tooth_necklace: { id: 'tooth_necklace', name: 'Fang Necklace', slot: 'collar', rarity: 'rare', stats: { attack: 25, critChance: 0.06, hp: 50 }, flavorText: '"Trophies from fallen foes."' },
  blessed_amulet: { id: 'blessed_amulet', name: 'Blessed Amulet', slot: 'collar', rarity: 'rare', stats: { hp: 80, regenPerSecond: 0.01, luck: 20 }, flavorText: '"Divine protection."' },

  steel_claws: { id: 'steel_claws', name: 'Steel Claws', slot: 'weapon', rarity: 'rare', stats: { attack: 40, boopDamage: 10, critChance: 0.05 }, flavorText: '"Gleaming death."' },
  assassin_blade: { id: 'assassin_blade', name: 'Assassin\'s Blade', slot: 'weapon', rarity: 'rare', stats: { attack: 35, critChance: 0.15, critDamage: 0.3 }, flavorText: '"Silent and deadly."' },
  war_hammer: { id: 'war_hammer', name: 'War Hammer', slot: 'weapon', rarity: 'rare', stats: { attack: 60, boopDamage: 15 }, flavorText: '"BONK!"' },
  dual_daggers: { id: 'dual_daggers', name: 'Dual Daggers', slot: 'weapon', rarity: 'rare', stats: { attack: 30, attackSpeed: 0.2, critChance: 0.08 }, flavorText: '"Twice the stabby."' },
  flame_sword: { id: 'flame_sword', name: 'Flame Sword', slot: 'weapon', rarity: 'rare', stats: { attack: 45, fireDamage: 0.15 }, element: 'fire', flavorText: '"Burns with passion."' },

  scale_mail: { id: 'scale_mail', name: 'Scale Mail', slot: 'armor', rarity: 'rare', stats: { hp: 120, defense: 40, damageReduction: 0.1 }, flavorText: '"Like a dragon!"' },
  shadow_cloak: { id: 'shadow_cloak', name: 'Shadow Cloak', slot: 'armor', rarity: 'rare', stats: { dodge: 0.15, defense: 20, critChance: 0.05 }, flavorText: '"One with the shadows."' },
  battle_armor: { id: 'battle_armor', name: 'Battle Armor', slot: 'armor', rarity: 'rare', stats: { hp: 150, defense: 50, attack: 15 }, flavorText: '"Built for war."' },
  mage_robes: { id: 'mage_robes', name: 'Mage Robes', slot: 'armor', rarity: 'rare', stats: { wisdom: 40, ppMultiplier: 0.1, hp: 60 }, flavorText: '"Arcane threads."' },

  swift_boots: { id: 'swift_boots', name: 'Swift Boots', slot: 'paws', rarity: 'rare', stats: { speed: 40, dodge: 0.1, attackSpeed: 0.08 }, flavorText: '"Gotta go fast."' },
  iron_paws: { id: 'iron_paws', name: 'Iron Paw Guards', slot: 'paws', rarity: 'rare', stats: { attack: 20, defense: 25, speed: 15 }, flavorText: '"Punchy."' },
  wind_walkers: { id: 'wind_walkers', name: 'Wind Walker Boots', slot: 'paws', rarity: 'rare', stats: { speed: 50, dodge: 0.12 }, element: 'wind', flavorText: '"Light as air."' },

  silver_tail_ring: { id: 'silver_tail_ring', name: 'Silver Tail Ring', slot: 'tail', rarity: 'rare', stats: { luck: 30, bpMultiplier: 0.1, critChance: 0.05 }, flavorText: '"Precious metal."' },
  fox_tail: { id: 'fox_tail', name: 'Fox Tail Charm', slot: 'tail', rarity: 'rare', stats: { luck: 25, dodge: 0.08, speed: 15 }, flavorText: '"Cunning and quick."' },
  lightning_tail: { id: 'lightning_tail', name: 'Lightning Tail', slot: 'tail', rarity: 'rare', stats: { attackSpeed: 0.15, critChance: 0.08, speed: 20 }, element: 'water', flavorText: '"Crackles with static."' },

  // =============================================
  // === FLOOR 26-50 DROPS (Epic) ===
  // =============================================
  dragon_helm: { id: 'dragon_helm', name: 'Dragon Helm', slot: 'hat', rarity: 'epic', stats: { defense: 60, attack: 40, fireDamage: 0.2 }, element: 'fire', flavorText: '"Forged in dragon fire."' },
  crown_of_thorns: { id: 'crown_of_thorns', name: 'Crown of Thorns', slot: 'hat', rarity: 'epic', stats: { attack: 50, critChance: 0.12, hp: -50 }, special: { thornDamage: 0.2 }, flavorText: '"Pain is power."' },
  mind_crown: { id: 'mind_crown', name: 'Crown of the Mind', slot: 'hat', rarity: 'epic', stats: { wisdom: 100, ppMultiplier: 0.25, cooldownReduction: 0.1 }, flavorText: '"Expand your consciousness."' },
  berserker_helm: { id: 'berserker_helm', name: 'Berserker Helm', slot: 'hat', rarity: 'epic', stats: { attack: 80, critDamage: 0.4, defense: -20 }, special: { rageMode: true }, flavorText: '"RAAAAAAAGE!"' },
  ice_crown: { id: 'ice_crown', name: 'Ice Crown', slot: 'hat', rarity: 'epic', stats: { wisdom: 60, defense: 40, damageReduction: 0.15 }, element: 'ice', special: { freezeChance: 0.1 }, flavorText: '"Cold as ice."' },
  ninja_hood: { id: 'ninja_hood', name: 'Ninja Hood', slot: 'hat', rarity: 'epic', stats: { dodge: 0.2, critChance: 0.15, speed: 30 }, flavorText: '"Unseen, unheard."' },

  dragon_heart_pendant: { id: 'dragon_heart_pendant', name: 'Dragon Heart Pendant', slot: 'collar', rarity: 'epic', stats: { hp: 300, fireDamage: 0.25, regenPerSecond: 0.015 }, element: 'fire', flavorText: '"Still warm."' },
  vampiric_collar: { id: 'vampiric_collar', name: 'Vampiric Collar', slot: 'collar', rarity: 'epic', stats: { attack: 40, hp: 150 }, special: { lifeSteal: 0.15 }, flavorText: '"Drain their essence."' },
  amulet_of_giants: { id: 'amulet_of_giants', name: 'Amulet of Giants', slot: 'collar', rarity: 'epic', stats: { hp: 500, defense: 80, attack: 30 }, special: { sizeIncrease: 0.3 }, flavorText: '"BECOME LARGE."' },
  spirit_collar: { id: 'spirit_collar', name: 'Spirit Collar', slot: 'collar', rarity: 'epic', stats: { dodge: 0.15, ppMultiplier: 0.2, wisdom: 50 }, special: { phaseChance: 0.1 }, flavorText: '"Half in this world."' },

  dragon_claws: { id: 'dragon_claws', name: 'Dragon Claws', slot: 'weapon', rarity: 'epic', stats: { attack: 100, critDamage: 0.5, fireDamage: 0.2 }, element: 'fire', flavorText: '"Rip and tear."' },
  soul_reaver: { id: 'soul_reaver', name: 'Soul Reaver', slot: 'weapon', rarity: 'epic', stats: { attack: 90, critChance: 0.2 }, special: { lifeSteal: 0.2, soulGather: true }, flavorText: '"Feeds on souls."' },
  thunder_maul: { id: 'thunder_maul', name: 'Thunder Maul', slot: 'weapon', rarity: 'epic', stats: { attack: 120, boopDamage: 30 }, element: 'water', special: { chainLightning: 0.2 }, flavorText: '"CRACK!"' },
  void_blade: { id: 'void_blade', name: 'Void Blade', slot: 'weapon', rarity: 'epic', stats: { attack: 85, critChance: 0.18, critDamage: 0.4 }, element: 'void', special: { armorPen: 0.3 }, flavorText: '"Cuts through reality."' },
  frost_fang: { id: 'frost_fang', name: 'Frost Fang', slot: 'weapon', rarity: 'epic', stats: { attack: 75, attackSpeed: 0.15 }, element: 'ice', special: { freezeChance: 0.15, slowOnHit: 0.3 }, flavorText: '"Chilling strikes."' },
  nature_scythe: { id: 'nature_scythe', name: 'Nature\'s Scythe', slot: 'weapon', rarity: 'epic', stats: { attack: 95, critChance: 0.12 }, element: 'nature', special: { lifeSteal: 0.1, regenOnKill: 0.05 }, flavorText: '"The harvest comes."' },

  dragon_scale_armor: { id: 'dragon_scale_armor', name: 'Dragon Scale Armor', slot: 'armor', rarity: 'epic', stats: { hp: 400, defense: 100, fireDamage: 0.15 }, element: 'fire', special: { fireImmune: true }, flavorText: '"Impervious to flame."' },
  phantom_armor: { id: 'phantom_armor', name: 'Phantom Armor', slot: 'armor', rarity: 'epic', stats: { dodge: 0.25, defense: 50, hp: 200 }, special: { phaseChance: 0.15 }, flavorText: '"Now you see me..."' },
  titan_plate: { id: 'titan_plate', name: 'Titan Plate', slot: 'armor', rarity: 'epic', stats: { hp: 600, defense: 150, speed: -20 }, special: { unstoppable: true }, flavorText: '"Immovable object."' },
  assassin_garb: { id: 'assassin_garb', name: 'Assassin\'s Garb', slot: 'armor', rarity: 'epic', stats: { critChance: 0.2, critDamage: 0.5, dodge: 0.15 }, flavorText: '"Strike from shadows."' },

  rocket_paws: { id: 'rocket_paws', name: 'Rocket Paws', slot: 'paws', rarity: 'epic', stats: { speed: 80, attackSpeed: 0.2, dodge: 0.15 }, special: { dashAbility: true }, flavorText: '"ZOOM!"' },
  titan_stompers: { id: 'titan_stompers', name: 'Titan Stompers', slot: 'paws', rarity: 'epic', stats: { attack: 50, defense: 40, hp: 100 }, special: { groundPound: 0.2 }, flavorText: '"Feel the earth shake."' },
  shadow_steps: { id: 'shadow_steps', name: 'Shadow Steps', slot: 'paws', rarity: 'epic', stats: { speed: 60, dodge: 0.2, critChance: 0.1 }, special: { teleportStrike: 0.1 }, flavorText: '"Blink and miss it."' },

  phoenix_tail: { id: 'phoenix_tail', name: 'Phoenix Tail Feather', slot: 'tail', rarity: 'epic', stats: { luck: 50, hp: 100, regenPerSecond: 0.02 }, special: { reviveOnce: true }, flavorText: '"Rise from ashes."' },
  demon_tail: { id: 'demon_tail', name: 'Demon Tail', slot: 'tail', rarity: 'epic', stats: { attack: 40, critDamage: 0.4, fireDamage: 0.2 }, element: 'fire', flavorText: '"Sinfully powerful."' },
  angel_tail: { id: 'angel_tail', name: 'Angel Tail Ribbon', slot: 'tail', rarity: 'epic', stats: { luck: 60, regenPerSecond: 0.025, defense: 30 }, special: { holyProtection: true }, flavorText: '"Blessed be."' },

  // =============================================
  // === FLOOR 51-75 DROPS (Legendary) ===
  // =============================================
  godslayer_helm: { id: 'godslayer_helm', name: 'Godslayer Helm', slot: 'hat', rarity: 'legendary', stats: { attack: 100, critChance: 0.2, critDamage: 0.6 }, special: { bonusVsBosses: 0.5 }, flavorText: '"Even gods fear this."' },
  crown_of_madness: { id: 'crown_of_madness', name: 'Crown of Madness', slot: 'hat', rarity: 'legendary', stats: { allStats: 0.3, critChance: 0.25 }, special: { chaosMode: true, randomEffects: true }, flavorText: '"Sanity is overrated."' },
  halo_of_light: { id: 'halo_of_light', name: 'Halo of Light', slot: 'hat', rarity: 'legendary', stats: { wisdom: 150, hp: 200, regenPerSecond: 0.03 }, element: 'light', special: { holyDamage: 0.3 }, flavorText: '"Divine radiance."' },

  heart_of_the_mountain: { id: 'heart_of_the_mountain', name: 'Heart of the Mountain', slot: 'collar', rarity: 'legendary', stats: { hp: 1000, defense: 200, damageReduction: 0.25 }, special: { earthquakeOnHit: 0.1 }, flavorText: '"Unbreakable."' },
  necklace_of_skulls: { id: 'necklace_of_skulls', name: 'Necklace of Skulls', slot: 'collar', rarity: 'legendary', stats: { attack: 80, critDamage: 0.8 }, special: { fearAura: true, bonusPerKill: 0.01 }, flavorText: '"Each skull tells a story."' },
  cosmic_pendant: { id: 'cosmic_pendant', name: 'Cosmic Pendant', slot: 'collar', rarity: 'legendary', stats: { allStats: 0.25, ppMultiplier: 0.4 }, special: { cosmicPower: true }, flavorText: '"Contains a galaxy."' },

  excalibur: { id: 'excalibur', name: 'Excalibur', slot: 'weapon', rarity: 'legendary', stats: { attack: 200, critChance: 0.2, boopDamage: 80 }, element: 'light', special: { holyDamage: 0.4, worthyOnly: true }, flavorText: '"The sword of kings."' },
  mjolnir: { id: 'mjolnir', name: 'Mjolnir', slot: 'weapon', rarity: 'legendary', stats: { attack: 180, boopDamage: 100 }, element: 'water', special: { chainLightning: 0.4, thunderGod: true }, flavorText: '"Whosoever holds this hammer..."' },
  masamune: { id: 'masamune', name: 'Masamune', slot: 'weapon', rarity: 'legendary', stats: { attack: 150, critChance: 0.3, critDamage: 1.0, attackSpeed: 0.25 }, flavorText: '"One strike, one kill."' },
  gungnir: { id: 'gungnir', name: 'Gungnir', slot: 'weapon', rarity: 'legendary', stats: { attack: 170, critChance: 0.25 }, special: { neverMiss: true, piercing: true }, flavorText: '"The spear of Odin."' },
  chaos_blade: { id: 'chaos_blade', name: 'Chaos Blade', slot: 'weapon', rarity: 'legendary', stats: { attack: 250, critDamage: 1.2 }, special: { chaosStrike: true, randomElement: true }, flavorText: '"Order is illusion."' },

  aegis_shield: { id: 'aegis_shield', name: 'Aegis', slot: 'armor', rarity: 'legendary', stats: { hp: 800, defense: 300, damageReduction: 0.35 }, special: { reflectDamage: 0.3 }, flavorText: '"The shield of Zeus."' },
  armor_of_achilles: { id: 'armor_of_achilles', name: 'Armor of Achilles', slot: 'armor', rarity: 'legendary', stats: { hp: 600, defense: 250, attack: 60 }, special: { invulnChance: 0.1, heelWeakness: true }, flavorText: '"Near invincible."' },
  cosmic_robe: { id: 'cosmic_robe', name: 'Cosmic Robe', slot: 'armor', rarity: 'legendary', stats: { wisdom: 200, ppMultiplier: 0.5, dodge: 0.2 }, special: { starPower: true }, flavorText: '"Woven from starlight."' },

  hermes_sandals: { id: 'hermes_sandals', name: 'Hermes\' Sandals', slot: 'paws', rarity: 'legendary', stats: { speed: 200, dodge: 0.3, attackSpeed: 0.3 }, special: { flight: true }, flavorText: '"Fleet-footed messenger."' },
  boots_of_speed: { id: 'boots_of_speed', name: 'Boots of Infinite Speed', slot: 'paws', rarity: 'legendary', stats: { speed: 300, attackSpeed: 0.4 }, special: { timeSlow: 0.2 }, flavorText: '"Everything else seems slow."' },

  chaos_tail: { id: 'chaos_tail', name: 'Chaos Tail', slot: 'tail', rarity: 'legendary', stats: { allStats: 0.3, luck: 100 }, special: { randomBuff: true, chaosAura: true }, flavorText: '"Anything can happen."' },
  world_serpent_tail: { id: 'world_serpent_tail', name: 'World Serpent Tail', slot: 'tail', rarity: 'legendary', stats: { hp: 500, attack: 100, defense: 100 }, special: { poison: 0.3, constrict: true }, flavorText: '"Jörmungandr\'s blessing."' },

  // =============================================
  // === FLOOR 76-100 DROPS (Mythic/Transcendent) ===
  // =============================================
  crown_of_creation: { id: 'crown_of_creation', name: 'Crown of Creation', slot: 'hat', rarity: 'mythic', stats: { allStats: 0.5, ppMultiplier: 0.75 }, special: { createMinions: true, godMode: 0.05 }, flavorText: '"Let there be light."' },
  omega_helm: { id: 'omega_helm', name: 'Omega Helm', slot: 'hat', rarity: 'mythic', stats: { attack: 200, critChance: 0.35, critDamage: 1.5 }, special: { omegaStrike: true }, flavorText: '"The end of all things."' },

  heart_of_the_universe: { id: 'heart_of_the_universe', name: 'Heart of the Universe', slot: 'collar', rarity: 'mythic', stats: { allStats: 0.75, hp: 2000 }, special: { realityWarp: true, omnipotent: 0.01 }, flavorText: '"Contains everything."' },
  chain_of_binding: { id: 'chain_of_binding', name: 'Chain of Eternal Binding', slot: 'collar', rarity: 'mythic', stats: { defense: 400, hp: 1500 }, special: { bindEnemies: true, unbreakable: true }, flavorText: '"None escape."' },

  sword_of_a_thousand_truths: { id: 'sword_of_a_thousand_truths', name: 'Sword of a Thousand Truths', slot: 'weapon', rarity: 'mythic', stats: { attack: 500, critChance: 0.4, boopDamage: 200 }, special: { instantKill: 0.05 }, flavorText: '"The truth hurts."' },
  infinity_blade: { id: 'infinity_blade', name: 'Infinity Blade', slot: 'weapon', rarity: 'transcendent', stats: { attack: 1000, allStats: 0.5 }, special: { infiniteDamage: true, scaleWithFloor: true }, flavorText: '"Power without limit."' },
  reality_cutter: { id: 'reality_cutter', name: 'Reality Cutter', slot: 'weapon', rarity: 'transcendent', stats: { attack: 800, critChance: 0.5, critDamage: 2.0 }, special: { cutThroughAnything: true, dimensionSlash: true }, flavorText: '"Slices through dimensions."' },

  armor_of_god: { id: 'armor_of_god', name: 'Armor of God', slot: 'armor', rarity: 'mythic', stats: { hp: 5000, defense: 500, damageReduction: 0.5 }, special: { divineProtection: true }, flavorText: '"Faith made manifest."' },
  quantum_suit: { id: 'quantum_suit', name: 'Quantum Suit', slot: 'armor', rarity: 'transcendent', stats: { allStats: 0.75, dodge: 0.4 }, special: { quantumState: true, existEverywhere: true }, flavorText: '"Exists in all states."' },

  boots_of_creation: { id: 'boots_of_creation', name: 'Boots of Creation', slot: 'paws', rarity: 'mythic', stats: { speed: 400, allStats: 0.4 }, special: { createPath: true, walkOnAir: true }, flavorText: '"Create your own path."' },
  dimensional_striders: { id: 'dimensional_striders', name: 'Dimensional Striders', slot: 'paws', rarity: 'transcendent', stats: { speed: 999, dodge: 0.5 }, special: { teleportAtWill: true, phaseShift: true }, flavorText: '"Step between worlds."' },

  tail_of_eternity: { id: 'tail_of_eternity', name: 'Tail of Eternity', slot: 'tail', rarity: 'mythic', stats: { allStats: 0.6, luck: 200 }, special: { timeManip: true, rewindDeath: true }, flavorText: '"Time has no meaning."' },
  reality_anchor: { id: 'reality_anchor', name: 'Reality Anchor', slot: 'tail', rarity: 'transcendent', stats: { allStats: 1.0, luck: 500 }, special: { anchorReality: true, immuneToChaos: true, stabilize: true }, flavorText: '"Keeps you grounded in existence."' }
};

/**
 * EquipmentSystem - Manages cat equipment
 */
class EquipmentSystem {
  constructor() {
    this.slots = EQUIPMENT_SLOTS;
    this.rarities = EQUIPMENT_RARITIES;
    this.sets = EQUIPMENT_SETS;
    this.templates = EQUIPMENT_TEMPLATES;
    this.inventory = []; // Array of equipment instances
    this.equipped = {}; // catId -> { slot: equipmentId }
    this.nextId = 1;
  }

  /**
   * Create equipment instance from template
   */
  createEquipment(templateId, bonusRarity = null) {
    const template = this.templates[templateId];
    if (!template) return null;

    const rarity = bonusRarity || template.rarity;
    const rarityData = this.rarities[rarity];

    // Generate substats
    const substats = this.generateSubstats(template, rarityData);

    const equipment = {
      id: `equip_${this.nextId++}`,
      templateId: templateId,
      name: template.name,
      slot: template.slot,
      rarity: rarity,
      set: template.set || null,
      element: template.element || null,
      level: 1,
      maxLevel: this.getMaxLevel(rarity),
      stats: { ...template.stats },
      substats: substats,
      flavorText: template.flavorText,
      createdAt: Date.now()
    };

    // Apply rarity multiplier to base stats
    for (const stat in equipment.stats) {
      if (typeof equipment.stats[stat] === 'number') {
        equipment.stats[stat] *= rarityData.multiplier;
      }
    }

    return equipment;
  }

  /**
   * Generate random substats
   */
  generateSubstats(template, rarityData) {
    const substats = {};
    const possibleStats = ['attack', 'defense', 'hp', 'critChance', 'critDamage', 'speed', 'luck', 'dodge'];
    const slot = this.slots[template.slot];

    // Remove primary stats from possible substats
    const available = possibleStats.filter(s => !slot.primaryStats.includes(s));

    const numSubstats = Math.min(rarityData.maxSubs, available.length);
    const shuffled = available.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numSubstats; i++) {
      const stat = shuffled[i];
      substats[stat] = this.getRandomSubstatValue(stat, rarityData.multiplier);
    }

    return substats;
  }

  /**
   * Get random substat value
   */
  getRandomSubstatValue(stat, multiplier) {
    const baseValues = {
      attack: 5,
      defense: 3,
      hp: 10,
      critChance: 0.01,
      critDamage: 0.05,
      speed: 2,
      luck: 3,
      dodge: 0.01
    };

    const base = baseValues[stat] || 1;
    const variance = 0.5 + Math.random(); // 0.5 - 1.5
    return base * variance * multiplier;
  }

  /**
   * Get max level for rarity
   */
  getMaxLevel(rarity) {
    const maxLevels = {
      common: 5,
      uncommon: 10,
      rare: 15,
      epic: 20,
      legendary: 25,
      mythic: 30,
      transcendent: 40
    };
    return maxLevels[rarity] || 5;
  }

  /**
   * Add equipment to inventory
   */
  addToInventory(equipment) {
    this.inventory.push(equipment);
    return equipment;
  }

  /**
   * Remove equipment from inventory
   */
  removeFromInventory(equipmentId) {
    const index = this.inventory.findIndex(e => e.id === equipmentId);
    if (index >= 0) {
      return this.inventory.splice(index, 1)[0];
    }
    return null;
  }

  /**
   * Get equipment by ID
   */
  getEquipment(equipmentId) {
    return this.inventory.find(e => e.id === equipmentId) || null;
  }

  /**
   * Equip item to cat
   */
  equip(catId, equipmentId) {
    const equipment = this.getEquipment(equipmentId);
    if (!equipment) return false;

    if (!this.equipped[catId]) {
      this.equipped[catId] = {};
    }

    // Unequip existing item in slot
    const existingId = this.equipped[catId][equipment.slot];
    if (existingId) {
      // Item returns to inventory (already there)
    }

    this.equipped[catId][equipment.slot] = equipmentId;

    if (window.audioSystem) {
      window.audioSystem.playSFX('equip');
    }

    return true;
  }

  /**
   * Unequip item from cat
   */
  unequip(catId, slot) {
    if (!this.equipped[catId] || !this.equipped[catId][slot]) {
      return false;
    }

    delete this.equipped[catId][slot];

    if (window.audioSystem) {
      window.audioSystem.playSFX('unequip');
    }

    return true;
  }

  /**
   * Get all equipped items for a cat
   */
  getEquippedItems(catId) {
    const equipped = this.equipped[catId] || {};
    const items = {};

    for (const [slot, equipmentId] of Object.entries(equipped)) {
      items[slot] = this.getEquipment(equipmentId);
    }

    return items;
  }

  /**
   * Calculate total stats from equipment
   */
  calculateEquipmentStats(catId) {
    const items = this.getEquippedItems(catId);
    const stats = {
      attack: 0,
      defense: 0,
      hp: 0,
      critChance: 0,
      critDamage: 0,
      speed: 0,
      luck: 0,
      dodge: 0,
      boopDamage: 0,
      damageReduction: 0,
      wisdom: 0,
      allStats: 0,
      bpMultiplier: 0,
      ppMultiplier: 0,
      regenPerSecond: 0,
      attackSpeed: 0,
      expGain: 0,
      cooldownReduction: 0
    };

    // Sum all equipment stats
    for (const equipment of Object.values(items)) {
      if (!equipment) continue;

      // Add base stats
      for (const [stat, value] of Object.entries(equipment.stats)) {
        if (stats[stat] !== undefined && typeof value === 'number') {
          stats[stat] += value;
        }
      }

      // Add substats
      for (const [stat, value] of Object.entries(equipment.substats)) {
        if (stats[stat] !== undefined) {
          stats[stat] += value;
        }
      }
    }

    // Add set bonuses
    const setBonuses = this.calculateSetBonuses(catId);
    for (const bonus of setBonuses) {
      for (const [stat, value] of Object.entries(bonus.effects)) {
        if (stats[stat] !== undefined && typeof value === 'number') {
          stats[stat] += value;
        }
      }
    }

    return stats;
  }

  /**
   * Calculate active set bonuses
   */
  calculateSetBonuses(catId) {
    const items = this.getEquippedItems(catId);
    const setCounts = {};

    // Count pieces per set
    for (const equipment of Object.values(items)) {
      if (!equipment || !equipment.set) continue;
      setCounts[equipment.set] = (setCounts[equipment.set] || 0) + 1;
    }

    const activeBonuses = [];

    // Check each set for active bonuses
    for (const [setId, count] of Object.entries(setCounts)) {
      const set = this.sets[setId];
      if (!set) continue;

      for (const [pieces, bonus] of Object.entries(set.bonuses)) {
        if (count >= parseInt(pieces)) {
          activeBonuses.push({
            setId,
            setName: set.name,
            pieces: parseInt(pieces),
            description: bonus.description,
            effects: bonus
          });
        }
      }
    }

    return activeBonuses;
  }

  /**
   * Level up equipment
   */
  levelUp(equipmentId, materials) {
    const equipment = this.getEquipment(equipmentId);
    if (!equipment || equipment.level >= equipment.maxLevel) return false;

    equipment.level++;

    // Increase stats by 10% per level
    const levelBonus = 1 + (equipment.level - 1) * 0.1;
    // Stats are recalculated based on template + level

    if (window.audioSystem) {
      window.audioSystem.playSFX('upgradeSuccess');
    }

    return true;
  }

  /**
   * Salvage equipment for materials
   */
  salvage(equipmentId) {
    const equipment = this.getEquipment(equipmentId);
    if (!equipment) return null;

    // Check if equipped
    for (const [catId, slots] of Object.entries(this.equipped)) {
      for (const [slot, eqId] of Object.entries(slots)) {
        if (eqId === equipmentId) {
          this.unequip(catId, slot);
        }
      }
    }

    // Calculate materials returned
    const rarityData = this.rarities[equipment.rarity];
    const materials = {
      scrap: Math.floor(10 * rarityData.multiplier),
      essence: Math.floor(equipment.level * rarityData.multiplier)
    };

    this.removeFromInventory(equipmentId);

    return materials;
  }

  /**
   * Get inventory filtered by slot
   */
  getInventoryBySlot(slot) {
    return this.inventory.filter(e => e.slot === slot);
  }

  /**
   * Get inventory filtered by rarity
   */
  getInventoryByRarity(rarity) {
    return this.inventory.filter(e => e.rarity === rarity);
  }

  /**
   * Check if equipment is equipped by any cat
   */
  isEquipped(equipmentId) {
    for (const slots of Object.values(this.equipped)) {
      for (const eqId of Object.values(slots)) {
        if (eqId === equipmentId) return true;
      }
    }
    return false;
  }

  /**
   * Get total inventory count
   */
  getInventoryCount() {
    return this.inventory.length;
  }

  /**
   * Drop random equipment based on floor/context
   */
  generateDrop(floor = 1, bonusLuck = 0) {
    // Determine rarity based on floor and luck
    const rarityRoll = Math.random() + bonusLuck * 0.01 + (floor * 0.002); // Floor bonus
    let rarity;
    let maxRarity;

    // Floor determines max possible rarity AND increases chances dramatically
    if (floor >= 76) {
      // Floor 76-100: Can drop ANYTHING including Transcendent
      if (rarityRoll > 0.97) rarity = 'transcendent';
      else if (rarityRoll > 0.90) rarity = 'mythic';
      else if (rarityRoll > 0.75) rarity = 'legendary';
      else if (rarityRoll > 0.50) rarity = 'epic';
      else rarity = 'rare';
      maxRarity = 'transcendent';
    } else if (floor >= 51) {
      // Floor 51-75: Up to Mythic
      if (rarityRoll > 0.95) rarity = 'mythic';
      else if (rarityRoll > 0.80) rarity = 'legendary';
      else if (rarityRoll > 0.55) rarity = 'epic';
      else if (rarityRoll > 0.30) rarity = 'rare';
      else rarity = 'uncommon';
      maxRarity = 'mythic';
    } else if (floor >= 26) {
      // Floor 26-50: Up to Legendary
      if (rarityRoll > 0.92) rarity = 'legendary';
      else if (rarityRoll > 0.70) rarity = 'epic';
      else if (rarityRoll > 0.40) rarity = 'rare';
      else rarity = 'uncommon';
      maxRarity = 'legendary';
    } else if (floor >= 11) {
      // Floor 11-25: Up to Epic
      if (rarityRoll > 0.88) rarity = 'epic';
      else if (rarityRoll > 0.60) rarity = 'rare';
      else if (rarityRoll > 0.30) rarity = 'uncommon';
      else rarity = 'common';
      maxRarity = 'epic';
    } else {
      // Floor 1-10: Up to Rare
      if (rarityRoll > 0.90) rarity = 'rare';
      else if (rarityRoll > 0.50) rarity = 'uncommon';
      else rarity = 'common';
      maxRarity = 'rare';
    }

    // Get templates of the rolled rarity
    let templates = Object.values(this.templates).filter(t => t.rarity === rarity);

    // If no templates of exact rarity, fall back to lower rarities
    if (templates.length === 0) {
      templates = Object.values(this.templates).filter(t =>
        this.rarities[t.rarity] && this.rarities[t.rarity].multiplier <= this.rarities[rarity].multiplier
      );
    }

    if (templates.length === 0) return null;

    // Pick random template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Create equipment (might upgrade rarity on high floors)
    let finalRarity = template.rarity;
    if (floor >= 50 && Math.random() < 0.1) {
      // 10% chance to upgrade rarity on floor 50+
      const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'transcendent'];
      const currentIdx = rarityOrder.indexOf(finalRarity);
      if (currentIdx < rarityOrder.indexOf(maxRarity)) {
        finalRarity = rarityOrder[currentIdx + 1];
      }
    }

    const equipment = this.createEquipment(template.id, finalRarity);

    // Bonus: High floors can add extra random stats
    if (floor >= 30 && equipment) {
      const bonusStats = Math.floor(floor / 25); // 1 bonus at 30, 2 at 50, 3 at 75, 4 at 100
      for (let i = 0; i < bonusStats; i++) {
        const bonusStat = ['attack', 'hp', 'critChance', 'critDamage', 'luck', 'speed'][Math.floor(Math.random() * 6)];
        const bonusValue = bonusStat.includes('Chance') ? 0.02 + Math.random() * 0.05 : 5 + Math.floor(Math.random() * floor);
        equipment.stats[bonusStat] = (equipment.stats[bonusStat] || 0) + bonusValue;
      }
    }

    return this.addToInventory(equipment);
  }

  /**
   * Alias for calculateEquipmentStats for UI compatibility
   */
  getCombinedStats(catId) {
    return this.calculateEquipmentStats(catId);
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      inventory: this.inventory,
      equipped: this.equipped,
      nextId: this.nextId
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.inventory) {
      this.inventory = data.inventory;
    }
    if (data.equipped) {
      this.equipped = data.equipped;
    }
    if (data.nextId) {
      this.nextId = data.nextId;
    }
  }

  /**
   * Reset system
   */
  reset() {
    this.inventory = [];
    this.equipped = {};
    this.nextId = 1;
  }
}

// Export
window.EQUIPMENT_SLOTS = EQUIPMENT_SLOTS;
window.EQUIPMENT_RARITIES = EQUIPMENT_RARITIES;
window.EQUIPMENT_SETS = EQUIPMENT_SETS;
window.EQUIPMENT_TEMPLATES = EQUIPMENT_TEMPLATES;
window.EquipmentSystem = EquipmentSystem;
