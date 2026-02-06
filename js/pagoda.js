/**
 * pagoda.js - Infinite Pagoda Roguelike Dungeon
 * "Each floor brings you closer to enlightenment... or death."
 */

// Enemy Templates by Floor Range
const PAGODA_ENEMIES = {
  // Floor 1-10: Spirit Animals (HP scaled to match player damage ~25-30)
  spirit_mouse: {
    id: 'spirit_mouse',
    name: 'Spirit Mouse',
    emoji: '🐭',
    floorRange: [1, 10],
    baseHp: 60,
    baseDamage: 8,
    baseDefense: 3,
    speed: 1.2,
    element: null,
    abilities: [],
    dropChance: 0.5
  },
  phantom_fish: {
    id: 'phantom_fish',
    name: 'Phantom Fish',
    emoji: '🐟',
    floorRange: [1, 10],
    baseHp: 50,
    baseDamage: 12,
    baseDefense: 2,
    speed: 1.5,
    element: 'water',
    abilities: ['splash'],
    dropChance: 0.55
  },
  shadow_moth: {
    id: 'shadow_moth',
    name: 'Shadow Moth',
    emoji: '🦋',
    floorRange: [1, 10],
    baseHp: 40,
    baseDamage: 15,
    baseDefense: 0,
    speed: 2.0,
    element: 'void',
    abilities: ['flutter'],
    dropChance: 0.45
  },

  // Floor 11-30: Mystical Beasts
  jade_serpent: {
    id: 'jade_serpent',
    name: 'Jade Serpent',
    emoji: '🐍',
    floorRange: [11, 30],
    baseHp: 120,
    baseDamage: 18,
    baseDefense: 10,
    speed: 1.0,
    element: 'nature',
    abilities: ['constrict', 'poison_bite'],
    dropChance: 0.6
  },
  thunder_sparrow: {
    id: 'thunder_sparrow',
    name: 'Thunder Sparrow',
    emoji: '🐦',
    floorRange: [11, 30],
    baseHp: 90,
    baseDamage: 28,
    baseDefense: 5,
    speed: 2.5,
    element: 'light',
    abilities: ['lightning_dive'],
    dropChance: 0.55
  },
  frost_fox: {
    id: 'frost_fox',
    name: 'Frost Fox',
    emoji: '🦊',
    floorRange: [11, 30],
    baseHp: 100,
    baseDamage: 22,
    baseDefense: 8,
    speed: 1.8,
    element: 'water',
    abilities: ['freeze', 'ice_breath'],
    dropChance: 0.65
  },

  // Floor 31-50: Legendary Creatures
  void_wolf: {
    id: 'void_wolf',
    name: 'Void Wolf',
    emoji: '🐺',
    floorRange: [31, 50],
    baseHp: 200,
    baseDamage: 40,
    baseDefense: 18,
    speed: 1.5,
    element: 'void',
    abilities: ['shadow_step', 'howl'],
    dropChance: 0.7
  },
  celestial_crane: {
    id: 'celestial_crane',
    name: 'Celestial Crane',
    emoji: '🦢',
    floorRange: [31, 50],
    baseHp: 180,
    baseDamage: 45,
    baseDefense: 12,
    speed: 2.0,
    element: 'light',
    abilities: ['divine_wind', 'feather_storm'],
    dropChance: 0.65
  },
  storm_dragon: {
    id: 'storm_dragon',
    name: 'Storm Dragon',
    emoji: '🐲',
    floorRange: [31, 50],
    baseHp: 280,
    baseDamage: 35,
    baseDefense: 25,
    speed: 1.0,
    element: 'water',
    abilities: ['thunder_breath', 'tail_sweep'],
    dropChance: 0.75
  },

  // Floor 51+: Ancient Horrors
  ancient_beast: {
    id: 'ancient_beast',
    name: 'Ancient Beast',
    emoji: '🦖',
    floorRange: [51, 100],
    baseHp: 400,
    baseDamage: 55,
    baseDefense: 30,
    speed: 0.8,
    element: 'nature',
    abilities: ['primal_roar', 'crushing_blow'],
    dropChance: 0.85
  },
  corrupted_spirit: {
    id: 'corrupted_spirit',
    name: 'Corrupted Spirit',
    emoji: '👹',
    floorRange: [51, 100],
    baseHp: 320,
    baseDamage: 70,
    baseDefense: 20,
    speed: 1.5,
    element: 'void',
    abilities: ['corruption', 'soul_drain'],
    dropChance: 0.8
  },
  dimensional_entity: {
    id: 'dimensional_entity',
    name: 'Dimensional Entity',
    emoji: '👁️',
    floorRange: [51, 100],
    baseHp: 350,
    baseDamage: 60,
    baseDefense: 35,
    speed: 1.2,
    element: 'void',
    abilities: ['reality_warp', 'gaze'],
    dropChance: 0.9
  }
};

// Boss Templates (Every 10 floors) - HP scaled for multi-turn fights
const PAGODA_BOSSES = {
  eternal_napper: {
    id: 'eternal_napper',
    name: 'The Eternal Napper',
    emoji: '😴',
    floor: 10,
    baseHp: 250,
    baseDamage: 25,
    baseDefense: 15,
    speed: 0.5,
    element: null,
    phases: 2,
    abilities: ['sleep_aura', 'dream_attack', 'nightmare'],
    rewards: { bp: 500, tokens: 3 },
    flavorText: '"Disturbing its slumber was a grave mistake."'
  },
  goose_emperor: {
    id: 'goose_emperor',
    name: 'The Goose Emperor',
    emoji: '🦢',
    floor: 20,
    baseHp: 500,
    baseDamage: 40,
    baseDefense: 20,
    speed: 1.2,
    element: 'water',
    phases: 3,
    abilities: ['imperial_honk', 'wing_buffet', 'summon_geese'],
    rewards: { bp: 1500, tokens: 6 },
    flavorText: '"ALL SHALL BOW BEFORE THE HONK."'
  },
  nine_tailed_menace: {
    id: 'nine_tailed_menace',
    name: 'Nine-Tailed Menace',
    emoji: '🦊',
    floor: 30,
    baseHp: 800,
    baseDamage: 55,
    baseDefense: 25,
    speed: 1.5,
    element: 'fire',
    phases: 3,
    abilities: ['fox_fire', 'illusion', 'tail_whip', 'charm'],
    rewards: { bp: 3000, tokens: 10 },
    flavorText: '"Each tail holds a century of cunning."'
  },
  jade_guardian: {
    id: 'jade_guardian',
    name: 'Jade Guardian',
    emoji: '🗿',
    floor: 40,
    baseHp: 1200,
    baseDamage: 50,
    baseDefense: 45,
    speed: 0.7,
    element: 'nature',
    phases: 2,
    abilities: ['stone_skin', 'jade_blast', 'earthquake'],
    rewards: { bp: 5000, tokens: 15 },
    flavorText: '"Protector of the ancient jade."'
  },
  void_sovereign: {
    id: 'void_sovereign',
    name: 'Void Sovereign',
    emoji: '🌑',
    floor: 50,
    baseHp: 2000,
    baseDamage: 80,
    baseDefense: 40,
    speed: 1.0,
    element: 'void',
    phases: 4,
    abilities: ['void_rend', 'dimension_shift', 'absolute_zero', 'annihilate'],
    rewards: { bp: 10000, tokens: 25 },
    flavorText: '"The lord of nothingness."'
  },
  celestial_cat: {
    id: 'celestial_cat',
    name: 'Celestial Cat God',
    emoji: '🐱',
    floor: 100,
    baseHp: 10000,
    baseDamage: 150,
    baseDefense: 80,
    speed: 2.0,
    element: 'light',
    phases: 5,
    abilities: ['divine_boop', 'heaven_fall', 'purr_of_doom', 'nine_lives'],
    rewards: { bp: 50000, tokens: 100, special: 'celestial_blessing' },
    flavorText: '"The ultimate snoot awaits."'
  }
};

// Boop Commands (Abilities)
const BOOP_COMMANDS = {
  // === BASIC SKILLS ===
  power_strike: {
    id: 'power_strike',
    name: 'Power Strike',
    emoji: '💪',
    description: 'A powerful boop dealing 150% damage.',
    cooldown: 0,
    effect: { type: 'damage', multiplier: 1.5 },
    cost: 0,
    unlocked: true
  },
  healing_touch: {
    id: 'healing_touch',
    name: 'Healing Touch',
    emoji: '💚',
    description: 'Restore 25% of max HP.',
    cooldown: 15000,
    effect: { type: 'heal', amount: 0.25 },
    cost: 0,
    unlocked: true
  },
  shield_wall: {
    id: 'shield_wall',
    name: 'Shield Wall',
    emoji: '🛡️',
    description: 'Block the next 3 attacks.',
    cooldown: 20000,
    effect: { type: 'shield', charges: 3 },
    cost: 0,
    unlocked: true
  },
  mega_boop: {
    id: 'mega_boop',
    name: 'MEGA BOOP',
    emoji: '💥',
    description: 'Devastating attack dealing 500% damage. Long cooldown.',
    cooldown: 45000,
    effect: { type: 'damage', multiplier: 5.0 },
    cost: 0,
    unlocked: true
  },
  emergency_exit: {
    id: 'emergency_exit',
    name: 'Emergency Exit',
    emoji: '🚪',
    description: 'Flee the dungeon, keeping all loot gained.',
    cooldown: 0,
    effect: { type: 'flee' },
    cost: 0,
    unlocked: true
  },

  // === OFFENSIVE SKILLS ===
  critical_boop: {
    id: 'critical_boop',
    name: 'Critical Boop',
    emoji: '🎯',
    description: 'Guaranteed critical hit dealing 300% damage.',
    cooldown: 25000,
    effect: { type: 'damage', multiplier: 3.0, guaranteedCrit: true },
    cost: 0,
    unlockFloor: 10
  },
  combo_attack: {
    id: 'combo_attack',
    name: 'Combo Attack',
    emoji: '⚡',
    description: 'Strike 3 times at 80% damage each.',
    cooldown: 20000,
    effect: { type: 'multi_damage', multiplier: 0.8, hits: 3 },
    cost: 0,
    unlockFloor: 15
  },
  execute: {
    id: 'execute',
    name: 'Execute',
    emoji: '💀',
    description: 'Deals 200% damage. Instant kill below 20% HP.',
    cooldown: 30000,
    effect: { type: 'execute', multiplier: 2.0, threshold: 0.2 },
    cost: 0,
    unlockFloor: 25
  },
  fury_swipes: {
    id: 'fury_swipes',
    name: 'Fury Swipes',
    emoji: '🐾',
    description: 'Attack 5 times rapidly at 60% damage. Each hit gains +10% damage.',
    cooldown: 35000,
    effect: { type: 'ramping_damage', baseMultiplier: 0.6, rampingBonus: 0.1, hits: 5 },
    cost: 0,
    unlockFloor: 30
  },
  void_strike: {
    id: 'void_strike',
    name: 'Void Strike',
    emoji: '🌑',
    description: 'Ignore enemy defense. Deal 250% true damage.',
    cooldown: 40000,
    effect: { type: 'true_damage', multiplier: 2.5 },
    cost: 0,
    unlockFloor: 40
  },
  celestial_beam: {
    id: 'celestial_beam',
    name: 'Celestial Beam',
    emoji: '✨',
    description: 'Channel the heavens for 800% holy damage.',
    cooldown: 60000,
    effect: { type: 'damage', multiplier: 8.0, element: 'light' },
    cost: 0,
    unlockFloor: 50
  },

  // === DEFENSIVE SKILLS ===
  dodge_roll: {
    id: 'dodge_roll',
    name: 'Dodge Roll',
    emoji: '🔄',
    description: 'Dodge the next attack completely.',
    cooldown: 12000,
    effect: { type: 'dodge', charges: 1 },
    cost: 0,
    unlockFloor: 5
  },
  counter_stance: {
    id: 'counter_stance',
    name: 'Counter Stance',
    emoji: '⚔️',
    description: 'Counter the next attack for 200% reflected damage.',
    cooldown: 18000,
    effect: { type: 'counter', multiplier: 2.0 },
    cost: 0,
    unlockFloor: 20
  },
  iron_fur: {
    id: 'iron_fur',
    name: 'Iron Fur',
    emoji: '🦔',
    description: 'Reduce damage taken by 50% for 3 turns.',
    cooldown: 30000,
    effect: { type: 'buff', stat: 'damageReduction', value: 0.5, duration: 3 },
    cost: 0,
    unlockFloor: 25
  },
  second_wind: {
    id: 'second_wind',
    name: 'Second Wind',
    emoji: '💨',
    description: 'Restore 50% HP and clear all debuffs.',
    cooldown: 60000,
    effect: { type: 'heal', amount: 0.5, cleanse: true },
    cost: 0,
    unlockFloor: 35
  },
  death_defiance: {
    id: 'death_defiance',
    name: 'Death Defiance',
    emoji: '💫',
    description: 'If you would die this turn, survive with 1 HP instead.',
    cooldown: 120000,
    effect: { type: 'death_save', duration: 1 },
    cost: 0,
    unlockFloor: 50
  },

  // === UTILITY SKILLS ===
  weaken: {
    id: 'weaken',
    name: 'Weaken',
    emoji: '📉',
    description: 'Reduce enemy damage by 30% for 3 turns.',
    cooldown: 20000,
    effect: { type: 'debuff', stat: 'damage', value: -0.3, duration: 3 },
    cost: 0,
    unlockFloor: 10
  },
  armor_break: {
    id: 'armor_break',
    name: 'Armor Break',
    emoji: '🔨',
    description: 'Reduce enemy defense by 50% for 3 turns.',
    cooldown: 25000,
    effect: { type: 'debuff', stat: 'defense', value: -0.5, duration: 3 },
    cost: 0,
    unlockFloor: 15
  },
  lifesteal_bite: {
    id: 'lifesteal_bite',
    name: 'Lifesteal Bite',
    emoji: '🧛',
    description: 'Deal 150% damage and heal for 50% of damage dealt.',
    cooldown: 20000,
    effect: { type: 'lifesteal', multiplier: 1.5, stealPercent: 0.5 },
    cost: 0,
    unlockFloor: 20
  },
  battle_cry: {
    id: 'battle_cry',
    name: 'Battle Cry',
    emoji: '📣',
    description: 'Increase your damage by 50% for 3 turns.',
    cooldown: 30000,
    effect: { type: 'buff', stat: 'damage', value: 0.5, duration: 3 },
    cost: 0,
    unlockFloor: 15
  },
  focus: {
    id: 'focus',
    name: 'Focus',
    emoji: '🎯',
    description: 'Increase crit chance by 30% for 3 turns.',
    cooldown: 25000,
    effect: { type: 'buff', stat: 'critChance', value: 0.3, duration: 3 },
    cost: 0,
    unlockFloor: 20
  },
  treasure_sense: {
    id: 'treasure_sense',
    name: 'Treasure Sense',
    emoji: '💰',
    description: 'Next enemy drops 3x loot.',
    cooldown: 90000,
    effect: { type: 'loot_boost', multiplier: 3 },
    cost: 0,
    unlockFloor: 25
  },

  // === ULTIMATE SKILLS ===
  nine_lives: {
    id: 'nine_lives',
    name: 'Nine Lives',
    emoji: '🐱',
    description: 'Auto-revive 3 times this run at 30% HP.',
    cooldown: 180000,
    effect: { type: 'revive_stack', charges: 3, hpPercent: 0.3 },
    cost: 0,
    unlockFloor: 60
  },
  ragnarok: {
    id: 'ragnarok',
    name: 'Ragnarök',
    emoji: '🔥',
    description: 'Deal 1000% damage but take 30% of your HP as recoil.',
    cooldown: 90000,
    effect: { type: 'recoil_damage', multiplier: 10.0, recoilPercent: 0.3 },
    cost: 0,
    unlockFloor: 70
  },
  time_stop: {
    id: 'time_stop',
    name: 'Time Stop',
    emoji: '⏱️',
    description: 'Take 3 actions without enemy retaliation.',
    cooldown: 120000,
    effect: { type: 'extra_turns', turns: 3 },
    cost: 0,
    unlockFloor: 80
  },
  final_boop: {
    id: 'final_boop',
    name: 'FINAL BOOP',
    emoji: '💢',
    description: 'THE ULTIMATE BOOP. 2000% damage. Only usable once per run.',
    cooldown: 999999999,
    effect: { type: 'damage', multiplier: 20.0, oncePerRun: true },
    cost: 0,
    unlockFloor: 100
  },

  // === MEME SKILLS ===
  honk: {
    id: 'honk',
    name: 'HONK',
    emoji: '🦆',
    description: 'Summon a goose to attack for 300% damage. May steal enemy items.',
    cooldown: 45000,
    effect: { type: 'summon_goose', multiplier: 3.0, stealChance: 0.2 },
    cost: 0,
    unlockFloor: 20
  },
  nyan: {
    id: 'nyan',
    name: 'Nyan Mode',
    emoji: '🌈',
    description: 'RAINBOW POWER! Random element 400% damage.',
    cooldown: 35000,
    effect: { type: 'random_element', multiplier: 4.0 },
    cost: 0,
    unlockFloor: 30
  },
  dramatic_pose: {
    id: 'dramatic_pose',
    name: 'Dramatic Pose',
    emoji: '✨',
    description: 'Strike a pose. Next attack deals 500% damage but has 50% chance to miss.',
    cooldown: 40000,
    effect: { type: 'risky_buff', multiplier: 5.0, missChance: 0.5 },
    cost: 0,
    unlockFloor: 35
  },
  button_mash: {
    id: 'button_mash',
    name: 'Button Mash',
    emoji: '🎮',
    description: 'Wildly attack 1-10 times at random damage (50%-200%).',
    cooldown: 30000,
    effect: { type: 'random_multi', minHits: 1, maxHits: 10, minMult: 0.5, maxMult: 2.0 },
    cost: 0,
    unlockFloor: 25
  },
  gg_ez: {
    id: 'gg_ez',
    name: 'GG EZ',
    emoji: '😎',
    description: 'Assert dominance. 50% chance to instantly win. 50% chance to take 50% HP damage.',
    cooldown: 120000,
    effect: { type: 'gamble_win', winChance: 0.5, failDamage: 0.5 },
    cost: 0,
    unlockFloor: 50
  }
};

// Loot Rarities
const LOOT_RARITIES = {
  common: { weight: 60, color: '#9CA3AF', multiplier: 1.0 },
  uncommon: { weight: 25, color: '#10B981', multiplier: 1.5 },
  rare: { weight: 10, color: '#3B82F6', multiplier: 2.5 },
  legendary: { weight: 4, color: '#F59E0B', multiplier: 5.0 },
  mythic: { weight: 1, color: '#EF4444', multiplier: 10.0 }
};

// Combat States
const COMBAT_STATES = {
  IDLE: 'idle',
  SELECTING: 'selecting',
  PLAYER_TURN: 'player_turn',
  ENEMY_TURN: 'enemy_turn',
  ANIMATING: 'animating',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
  FLED: 'fled'
};

/**
 * PagodaSystem - Manages the Infinite Pagoda dungeon
 */
class PagodaSystem {
  constructor() {
    this.enemies = PAGODA_ENEMIES;
    this.bosses = PAGODA_BOSSES;
    this.commands = BOOP_COMMANDS;

    // Run state
    this.inRun = false;
    this.currentFloor = 0;
    this.highestFloor = 0;

    // Player state
    this.playerHp = 100;
    this.playerMaxHp = 100;
    this.playerDamage = 10;
    this.playerDefense = 5;
    this.playerShields = 0;
    this.cooldowns = {};

    // Enemy state
    this.currentEnemy = null;
    this.enemyHp = 0;
    this.enemyMaxHp = 0;

    // Combat state
    this.combatState = COMBAT_STATES.IDLE;
    this.combatLog = [];

    // Run rewards
    this.runRewards = {
      bp: 0,
      tokens: 0,
      materials: [],
      equipment: [],
      techniques: [],
      consumables: []
    };

    // Buffs/Debuffs
    this.activeBuffs = [];
    this.activeDebuffs = [];

    // Modifiers (stack per floor)
    this.floorModifiers = [];

    // Tokens and upgrades
    this.tokens = 0;
    this.upgrades = {
      maxHpBonus: 0,
      damageBonus: 0,
      defenseBonus: 0,
      startingShields: 0,
      healingBonus: 0
    };

    // Statistics
    this.stats = {
      totalRuns: 0,
      totalFloors: 0,
      totalKills: 0,
      totalDeaths: 0,
      bossKills: 0,
      highestDamage: 0
    };

    // Run history
    this.runHistory = [];
  }

  /**
   * Start a new pagoda run
   */
  startRun(selectedCats = []) {
    if (this.inRun) return false;

    this.inRun = true;
    this.currentFloor = 0;
    this.combatState = COMBAT_STATES.IDLE;
    this.combatLog = [];

    // Reset run rewards
    this.runRewards = {
      bp: 0,
      tokens: 0,
      materials: [],
      equipment: [],
      techniques: [],
      consumables: []
    };

    // Calculate player stats from cats + equipment + upgrades
    this.calculatePlayerStats(selectedCats);

    // Reset cooldowns
    for (const cmdId of Object.keys(this.commands)) {
      this.cooldowns[cmdId] = 0;
    }

    // Apply starting shields from upgrades
    this.playerShields = this.upgrades.startingShields;

    // Clear buffs/debuffs
    this.activeBuffs = [];
    this.activeDebuffs = [];
    this.floorModifiers = [];

    // Clear combat state
    this.enemyDebuffs = [];
    this.dodgeCharges = 0;
    this.counterActive = null;
    this.deathSaveActive = false;
    this.reviveCharges = 0;
    this.reviveHpPercent = 0.3;
    this.extraTurns = 0;
    this.lootMultiplier = 1;
    this.usedOnceSkills = [];

    this.stats.totalRuns++;

    if (window.audioSystem) {
      window.audioSystem.playSFX('dungeonStart');
    }

    // Advance to floor 1
    this.advanceFloor();

    return true;
  }

  /**
   * Calculate player stats from cats and equipment
   */
  calculatePlayerStats(selectedCats) {
    let hp = 100;
    let damage = 10;
    let defense = 5;

    // Add cat bonuses (if cat system available)
    if (window.catSystem && selectedCats.length > 0) {
      for (const catId of selectedCats) {
        const cat = window.catSystem.getCatById(catId);
        if (cat) {
          hp += cat.stats?.hp || 10;
          damage += cat.stats?.attack || 2;
          defense += cat.stats?.defense || 1;
        }
      }
    }

    // Add equipment bonuses (if equipment system available)
    if (window.equipmentSystem && selectedCats.length > 0) {
      for (const catId of selectedCats) {
        const eqStats = window.equipmentSystem.calculateEquipmentStats(catId);
        hp += eqStats.hp || 0;
        damage += eqStats.attack || 0;
        defense += eqStats.defense || 0;
      }
    }

    // Add upgrade bonuses
    hp += this.upgrades.maxHpBonus;
    damage += this.upgrades.damageBonus;
    defense += this.upgrades.defenseBonus;

    this.playerMaxHp = hp;
    this.playerHp = hp;
    this.playerDamage = damage;
    this.playerDefense = defense;
  }

  /**
   * Advance to next floor
   */
  advanceFloor() {
    this.currentFloor++;
    this.stats.totalFloors++;

    if (this.currentFloor > this.highestFloor) {
      this.highestFloor = this.currentFloor;
    }

    // Check for boss floor
    if (this.currentFloor % 10 === 0) {
      this.spawnBoss();
    } else {
      this.spawnEnemy();
    }

    // Add floor modifier (every 5 floors)
    if (this.currentFloor % 5 === 0) {
      this.addFloorModifier();
    }

    if (window.audioSystem) {
      window.audioSystem.playSFX('floorClear');
    }

    this.combatState = COMBAT_STATES.SELECTING;
  }

  /**
   * Spawn a regular enemy
   */
  spawnEnemy() {
    // Find enemies for current floor
    const validEnemies = Object.values(this.enemies).filter(e =>
      this.currentFloor >= e.floorRange[0] && this.currentFloor <= e.floorRange[1]
    );

    if (validEnemies.length === 0) {
      // Use highest tier enemies for floors beyond defined ranges
      const highestEnemies = Object.values(this.enemies).filter(e =>
        e.floorRange[1] >= 51
      );
      this.currentEnemy = highestEnemies[Math.floor(Math.random() * highestEnemies.length)];
    } else {
      this.currentEnemy = validEnemies[Math.floor(Math.random() * validEnemies.length)];
    }

    // Scale enemy stats based on floor
    const scaling = 1 + (this.currentFloor - 1) * 0.1;
    this.enemyMaxHp = Math.floor(this.currentEnemy.baseHp * scaling);
    this.enemyHp = this.enemyMaxHp;

    this.logCombat(`${this.currentEnemy.emoji} ${this.currentEnemy.name} appears!`);
  }

  /**
   * Spawn a boss
   */
  spawnBoss() {
    const bossFloor = this.currentFloor;

    // Find appropriate boss
    let boss = Object.values(this.bosses).find(b => b.floor === bossFloor);

    if (!boss) {
      // Use highest defined boss for floors beyond 100
      boss = this.bosses.celestial_cat;
    }

    this.currentEnemy = {
      ...boss,
      isBoss: true,
      currentPhase: 1
    };

    // Scale boss stats
    const scaling = 1 + (this.currentFloor / 10 - 1) * 0.2;
    this.enemyMaxHp = Math.floor(boss.baseHp * scaling);
    this.enemyHp = this.enemyMaxHp;

    this.logCombat(`BOSS: ${boss.emoji} ${boss.name} awakens!`);

    if (window.audioSystem) {
      window.audioSystem.playSFX('bossSpawn');
    }
  }

  /**
   * Add a random floor modifier
   */
  addFloorModifier() {
    const modifiers = [
      { id: 'damage_up', name: 'Empowered', effect: { playerDamage: 1.1 } },
      { id: 'defense_up', name: 'Fortified', effect: { playerDefense: 1.1 } },
      { id: 'enemy_damage_up', name: 'Dangerous', effect: { enemyDamage: 1.2 } },
      { id: 'enemy_hp_up', name: 'Resilient Foes', effect: { enemyHp: 1.2 } },
      { id: 'loot_bonus', name: 'Treasure Floor', effect: { lootBonus: 1.5 } },
      { id: 'crit_up', name: 'Precision', effect: { critChance: 0.1 } }
    ];

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    this.floorModifiers.push(modifier);

    this.logCombat(`Floor Modifier: ${modifier.name}`);
  }

  /**
   * Check if skill is unlocked
   */
  isSkillUnlocked(commandId) {
    const command = this.commands[commandId];
    if (!command) return false;
    if (command.unlocked) return true;
    if (command.unlockFloor && this.highestFloor >= command.unlockFloor) return true;
    return this.unlockedSkills?.includes(commandId) || false;
  }

  /**
   * Get all available (unlocked) skills
   */
  getAvailableSkills() {
    return Object.values(this.commands).filter(cmd => this.isSkillUnlocked(cmd.id));
  }

  /**
   * Execute a boop command
   */
  executeCommand(commandId) {
    if (this.combatState !== COMBAT_STATES.SELECTING) return false;

    const command = this.commands[commandId];
    if (!command) return false;

    // Check if unlocked
    if (!this.isSkillUnlocked(commandId)) {
      this.logCombat(`${command.name} is locked! Reach floor ${command.unlockFloor}.`);
      return false;
    }

    // Check cooldown
    if (this.cooldowns[commandId] > Date.now()) {
      this.logCombat(`${command.name} is on cooldown!`);
      return false;
    }

    // Check once per run skills
    if (command.effect.oncePerRun && this.usedOnceSkills?.includes(commandId)) {
      this.logCombat(`${command.name} can only be used once per run!`);
      return false;
    }

    this.combatState = COMBAT_STATES.PLAYER_TURN;

    // Track extra turns
    let skipEnemyTurn = false;

    // Execute effect based on type
    const effect = command.effect;
    switch (effect.type) {
      case 'damage':
        this.playerAttack(effect.multiplier, effect.guaranteedCrit, effect.element);
        break;

      case 'multi_damage':
        for (let i = 0; i < effect.hits; i++) {
          if (this.enemyHp > 0) {
            this.playerAttack(effect.multiplier, false, null);
          }
        }
        break;

      case 'ramping_damage':
        for (let i = 0; i < effect.hits; i++) {
          if (this.enemyHp > 0) {
            const mult = effect.baseMultiplier + (effect.rampingBonus * i);
            this.playerAttack(mult, false, null);
          }
        }
        break;

      case 'execute':
        const hpPercent = this.enemyHp / this.enemyMaxHp;
        if (hpPercent < effect.threshold) {
          this.enemyHp = 0;
          this.logCombat(`💀 EXECUTED! Enemy slain instantly!`);
        } else {
          this.playerAttack(effect.multiplier);
        }
        break;

      case 'true_damage':
        const trueDmg = Math.floor(this.playerDamage * effect.multiplier);
        this.enemyHp = Math.max(0, this.enemyHp - trueDmg);
        this.logCombat(`🌑 Void Strike deals ${trueDmg} TRUE damage!`);
        break;

      case 'heal':
        this.playerHeal(effect.amount);
        if (effect.cleanse) {
          this.activeDebuffs = [];
          this.logCombat('All debuffs cleansed!');
        }
        break;

      case 'shield':
        this.playerShields += effect.charges;
        this.logCombat(`🛡️ Gained ${effect.charges} shields!`);
        break;

      case 'dodge':
        this.dodgeCharges = (this.dodgeCharges || 0) + effect.charges;
        this.logCombat(`🔄 Ready to dodge ${effect.charges} attack(s)!`);
        break;

      case 'counter':
        this.counterActive = { multiplier: effect.multiplier };
        this.logCombat(`⚔️ Counter stance ready!`);
        break;

      case 'buff':
        this.activeBuffs.push({
          stat: effect.stat,
          value: effect.value,
          duration: effect.duration
        });
        this.logCombat(`📈 ${effect.stat} increased by ${Math.round(effect.value * 100)}%!`);
        break;

      case 'debuff':
        this.enemyDebuffs = this.enemyDebuffs || [];
        this.enemyDebuffs.push({
          stat: effect.stat,
          value: effect.value,
          duration: effect.duration
        });
        this.logCombat(`📉 Enemy ${effect.stat} reduced!`);
        break;

      case 'lifesteal':
        const lsDamage = this.playerAttack(effect.multiplier);
        const healAmt = Math.floor((lsDamage || this.playerDamage) * effect.stealPercent);
        this.playerHp = Math.min(this.playerMaxHp, this.playerHp + healAmt);
        this.logCombat(`🧛 Healed ${healAmt} HP from lifesteal!`);
        break;

      case 'loot_boost':
        this.lootMultiplier = effect.multiplier;
        this.logCombat(`💰 Next enemy drops ${effect.multiplier}x loot!`);
        break;

      case 'revive_stack':
        this.reviveCharges = (this.reviveCharges || 0) + effect.charges;
        this.reviveHpPercent = effect.hpPercent;
        this.logCombat(`🐱 Nine Lives activated! ${this.reviveCharges} lives remaining.`);
        break;

      case 'recoil_damage':
        const recoilDmg = Math.floor(this.playerMaxHp * effect.recoilPercent);
        this.playerHp = Math.max(1, this.playerHp - recoilDmg);
        this.logCombat(`🔥 Took ${recoilDmg} recoil damage!`);
        this.playerAttack(effect.multiplier);
        break;

      case 'extra_turns':
        this.extraTurns = (this.extraTurns || 0) + effect.turns;
        skipEnemyTurn = true;
        this.logCombat(`⏱️ TIME STOP! ${effect.turns} free actions!`);
        break;

      case 'death_save':
        this.deathSaveActive = true;
        this.logCombat(`💫 Death Defiance active!`);
        break;

      case 'summon_goose':
        this.playerAttack(effect.multiplier);
        this.logCombat(`🦆 HONK! Goose attacks!`);
        if (Math.random() < effect.stealChance) {
          const bonusBp = Math.floor(this.currentFloor * 50);
          this.runRewards.bp += bonusBp;
          this.logCombat(`🦆 Goose stole ${bonusBp} BP!`);
        }
        break;

      case 'random_element':
        const elements = ['fire', 'water', 'light', 'void', 'nature'];
        const element = elements[Math.floor(Math.random() * elements.length)];
        this.logCombat(`🌈 NYAN! ${element.toUpperCase()} element!`);
        this.playerAttack(effect.multiplier, false, element);
        break;

      case 'risky_buff':
        if (Math.random() < effect.missChance) {
          this.logCombat(`✨ Struck a dramatic pose but... MISSED!`);
        } else {
          this.playerAttack(effect.multiplier);
        }
        break;

      case 'random_multi':
        const hits = effect.minHits + Math.floor(Math.random() * (effect.maxHits - effect.minHits + 1));
        for (let i = 0; i < hits; i++) {
          if (this.enemyHp > 0) {
            const mult = effect.minMult + Math.random() * (effect.maxMult - effect.minMult);
            this.playerAttack(mult);
          }
        }
        this.logCombat(`🎮 Button mash! ${hits} hits!`);
        break;

      case 'gamble_win':
        if (Math.random() < effect.winChance) {
          this.enemyHp = 0;
          this.logCombat(`😎 GG EZ! Enemy defeated instantly!`);
        } else {
          const failDmg = Math.floor(this.playerMaxHp * effect.failDamage);
          this.playerHp = Math.max(1, this.playerHp - failDmg);
          this.logCombat(`😎 GG... NOT EZ! Took ${failDmg} damage!`);
        }
        break;

      case 'flee':
        this.endRun('fled');
        return true;

      default:
        this.playerAttack(effect.multiplier || 1.0);
    }

    // Mark once-per-run skills as used
    if (effect.oncePerRun) {
      this.usedOnceSkills = this.usedOnceSkills || [];
      this.usedOnceSkills.push(commandId);
    }

    // Set cooldown
    if (command.cooldown > 0) {
      this.cooldowns[commandId] = Date.now() + command.cooldown;
    }

    // Check for victory
    if (this.enemyHp <= 0) {
      this.onEnemyDefeated();
      return true;
    }

    // Check for defeat
    if (this.playerHp <= 0) {
      if (this.handlePotentialDeath()) {
        this.combatState = COMBAT_STATES.SELECTING;
        return true;
      }
      this.endRun('defeat');
      return true;
    }

    // Handle extra turns
    if (this.extraTurns > 0) {
      this.extraTurns--;
      this.combatState = COMBAT_STATES.SELECTING;
      return true;
    }

    // Enemy turn
    if (!skipEnemyTurn) {
      setTimeout(() => this.enemyTurn(), 500);
    } else {
      this.combatState = COMBAT_STATES.SELECTING;
    }

    return true;
  }

  /**
   * Handle potential death (nine lives, death defiance, etc.)
   */
  handlePotentialDeath() {
    // Check death save
    if (this.deathSaveActive) {
      this.playerHp = 1;
      this.deathSaveActive = false;
      this.logCombat(`💫 Death Defiance triggered! Survived with 1 HP!`);
      return true;
    }

    // Check nine lives
    if (this.reviveCharges > 0) {
      this.reviveCharges--;
      this.playerHp = Math.floor(this.playerMaxHp * (this.reviveHpPercent || 0.3));
      this.logCombat(`🐱 Nine Lives! ${this.reviveCharges} lives remaining.`);
      return true;
    }

    return false;
  }

  /**
   * Player attacks enemy
   */
  playerAttack(multiplier = 1.0, guaranteedCrit = false, element = null) {
    let damage = this.playerDamage * multiplier;

    // Apply damage buffs
    for (const buff of this.activeBuffs) {
      if (buff.stat === 'damage') {
        damage *= (1 + buff.value);
      }
    }

    // Apply floor modifiers
    for (const mod of this.floorModifiers) {
      if (mod.effect.playerDamage) {
        damage *= mod.effect.playerDamage;
      }
    }

    // Calculate crit chance
    let critChance = 0.1;
    for (const mod of this.floorModifiers) {
      if (mod.effect.critChance) {
        critChance += mod.effect.critChance;
      }
    }
    for (const buff of this.activeBuffs) {
      if (buff.stat === 'critChance') {
        critChance += buff.value;
      }
    }

    // Check for crit
    let isCrit = guaranteedCrit || (Math.random() < critChance);
    if (isCrit) {
      damage *= 2;
    }

    // Apply enemy defense (reduced by debuffs)
    let enemyDef = this.currentEnemy.baseDefense || 0;
    if (this.enemyDebuffs) {
      for (const debuff of this.enemyDebuffs) {
        if (debuff.stat === 'defense') {
          enemyDef *= (1 + debuff.value);
        }
      }
    }
    damage = Math.max(1, damage - enemyDef * 0.5);

    // Apply elemental bonus/weakness
    if (element) {
      const enemyElement = this.currentEnemy.element;
      const elementChart = {
        fire: { weak: 'nature', strong: 'water' },
        water: { weak: 'fire', strong: 'nature' },
        nature: { weak: 'water', strong: 'fire' },
        light: { weak: 'void', strong: 'void' },
        void: { weak: 'light', strong: 'light' }
      };
      if (elementChart[element]?.weak === enemyElement) {
        damage *= 1.5;
        this.logCombat(`Super effective!`);
      } else if (elementChart[element]?.strong === enemyElement) {
        damage *= 0.75;
        this.logCombat(`Not very effective...`);
      }
    }

    damage = Math.floor(damage);
    this.enemyHp = Math.max(0, this.enemyHp - damage);

    if (damage > this.stats.highestDamage) {
      this.stats.highestDamage = damage;
    }

    const critText = isCrit ? ' 💥CRIT!' : '';
    const elementText = element ? ` [${element.toUpperCase()}]` : '';
    this.logCombat(`You deal ${damage}${elementText} damage!${critText}`);

    if (window.audioSystem) {
      window.audioSystem.playSFX(isCrit ? 'criticalBoop' : 'boop');
    }

    return damage;
  }

  /**
   * Player heals
   */
  playerHeal(percentage) {
    let healAmount = Math.floor(this.playerMaxHp * percentage);

    // Apply healing bonus
    healAmount += Math.floor(healAmount * this.upgrades.healingBonus);

    this.playerHp = Math.min(this.playerMaxHp, this.playerHp + healAmount);

    this.logCombat(`You heal for ${healAmount} HP!`);

    if (window.audioSystem) {
      window.audioSystem.playSFX('heal');
    }
  }

  /**
   * Enemy turn
   */
  enemyTurn() {
    if (this.combatState === COMBAT_STATES.VICTORY ||
        this.combatState === COMBAT_STATES.DEFEAT ||
        this.combatState === COMBAT_STATES.FLED) {
      return;
    }

    this.combatState = COMBAT_STATES.ENEMY_TURN;

    // Tick buff/debuff durations
    this.tickBuffDurations();

    let damage = this.currentEnemy.baseDamage || 10;

    // Apply floor scaling
    const scaling = 1 + (this.currentFloor - 1) * 0.1;
    damage = Math.floor(damage * scaling);

    // Apply floor modifiers
    for (const mod of this.floorModifiers) {
      if (mod.effect.enemyDamage) {
        damage *= mod.effect.enemyDamage;
      }
    }

    // Apply enemy debuffs
    if (this.enemyDebuffs) {
      for (const debuff of this.enemyDebuffs) {
        if (debuff.stat === 'damage') {
          damage *= (1 + debuff.value);
        }
      }
    }

    damage = Math.floor(damage);

    // Check for dodge
    if (this.dodgeCharges > 0) {
      this.dodgeCharges--;
      this.logCombat(`🔄 Dodged the attack! (${this.dodgeCharges} charges left)`);
      this.combatState = COMBAT_STATES.SELECTING;
      return;
    }

    // Check for counter
    if (this.counterActive) {
      const counterDamage = Math.floor(damage * this.counterActive.multiplier);
      this.enemyHp = Math.max(0, this.enemyHp - counterDamage);
      this.logCombat(`⚔️ COUNTER! Reflected ${counterDamage} damage!`);
      this.counterActive = null;

      // Still take reduced damage
      damage = Math.floor(damage * 0.5);
    }

    // Check for shields
    if (this.playerShields > 0) {
      this.playerShields--;
      this.logCombat(`🛡️ Shield blocks the attack! (${this.playerShields} remaining)`);
    } else {
      // Apply player defense
      let effectiveDefense = this.playerDefense;

      // Apply damage reduction buffs
      let damageReduction = 0;
      for (const buff of this.activeBuffs) {
        if (buff.stat === 'damageReduction') {
          damageReduction += buff.value;
        }
      }

      damage = Math.floor(damage * (1 - damageReduction));
      damage = Math.max(1, damage - effectiveDefense);
      damage = Math.floor(damage);

      this.playerHp = Math.max(0, this.playerHp - damage);
      this.logCombat(`${this.currentEnemy.emoji} deals ${damage} damage!`);

      if (window.audioSystem) {
        window.audioSystem.playSFX('playerHit');
      }
    }

    // Check enemy defeat from counter
    if (this.enemyHp <= 0) {
      this.onEnemyDefeated();
      return;
    }

    // Check for player defeat
    if (this.playerHp <= 0) {
      if (this.handlePotentialDeath()) {
        this.combatState = COMBAT_STATES.SELECTING;
        return;
      }
      this.endRun('defeat');
      return;
    }

    this.combatState = COMBAT_STATES.SELECTING;
  }

  /**
   * Tick down buff and debuff durations
   */
  tickBuffDurations() {
    // Player buffs
    this.activeBuffs = this.activeBuffs.filter(buff => {
      buff.duration--;
      if (buff.duration <= 0) {
        this.logCombat(`Buff expired: ${buff.stat}`);
        return false;
      }
      return true;
    });

    // Enemy debuffs
    if (this.enemyDebuffs) {
      this.enemyDebuffs = this.enemyDebuffs.filter(debuff => {
        debuff.duration--;
        return debuff.duration > 0;
      });
    }
  }

  /**
   * Handle enemy defeated
   */
  onEnemyDefeated() {
    this.stats.totalKills++;
    this.combatState = COMBAT_STATES.VICTORY;

    const isBoss = this.currentEnemy.isBoss;

    if (isBoss) {
      this.stats.bossKills++;
      this.logCombat(`BOSS DEFEATED: ${this.currentEnemy.name}!`);

      // Boss rewards
      const rewards = this.currentEnemy.rewards;
      this.runRewards.bp += rewards.bp;
      this.runRewards.tokens += rewards.tokens;

      if (window.audioSystem) {
        window.audioSystem.playSFX('bossDefeat');
      }
    } else {
      this.logCombat(`Defeated ${this.currentEnemy.name}!`);

      // Regular rewards
      const floorBp = this.currentFloor * 10;
      this.runRewards.bp += floorBp;
      this.runRewards.tokens += 1;
    }

    // Generate loot
    this.generateLoot(isBoss);

    // Auto-advance after delay
    setTimeout(() => {
      if (this.inRun && this.combatState === COMBAT_STATES.VICTORY) {
        this.advanceFloor();
      }
    }, 1500);
  }

  /**
   * Generate loot drops
   */
  generateLoot(isBoss) {
    let lootMessages = [];

    // Apply loot multiplier from skills
    const lootMult = this.lootMultiplier || 1;
    this.lootMultiplier = 1; // Reset after use

    // Guaranteed BP drop based on floor
    const bonusBp = Math.floor(this.currentFloor * 5 * (isBoss ? 3 : 1) * lootMult);
    this.runRewards.bp += bonusBp;

    // Material drops
    if (window.craftingSystem) {
      try {
        const drops = window.craftingSystem.generateDrop({
          floor: this.currentFloor,
          luck: this.playerDefense,
          isBoss: isBoss
        });
        if (drops && drops.length > 0) {
          this.runRewards.materials.push(...drops);
          lootMessages.push(`+${drops.length} materials`);
        }
      } catch (e) {
        console.warn('Crafting drop failed:', e);
      }
    }

    // Equipment drops (chance based)
    if (window.equipmentSystem) {
      const baseDropChance = isBoss ? 0.8 : (this.currentEnemy.dropChance || 0.5);

      // Apply loot bonus modifier
      let finalChance = baseDropChance;
      for (const mod of this.floorModifiers) {
        if (mod.effect.lootBonus) {
          finalChance *= mod.effect.lootBonus;
        }
      }

      if (Math.random() < finalChance) {
        try {
          const equipment = window.equipmentSystem.generateDrop(this.currentFloor);
          if (equipment) {
            this.runRewards.equipment.push(equipment);
            lootMessages.push(`🗡️ ${equipment.name}`);
          }
        } catch (e) {
          console.warn('Equipment drop failed:', e);
        }
      }
    }

    // Secret Technique drops (boss only)
    if (isBoss && window.techniqueSystem && typeof rollBossTechniqueDrop === 'function') {
      try {
        const techniqueId = rollBossTechniqueDrop(this.currentEnemy.id);
        if (techniqueId) {
          const technique = window.techniqueSystem.learnTechnique(techniqueId);
          if (technique) {
            this.logCombat(`📜 SECRET TECHNIQUE DISCOVERED: ${technique.name}!`);
            this.runRewards.techniques = this.runRewards.techniques || [];
            this.runRewards.techniques.push(techniqueId);
            lootMessages.push(`📜 ${technique.name}`);
          }
        }
      } catch (e) {
        console.warn('Technique drop failed:', e);
      }
    }

    // Consumable drops
    if (window.techniqueSystem && typeof rollConsumableDrop === 'function') {
      try {
        const consumables = rollConsumableDrop(this.currentFloor, isBoss);
        if (consumables && consumables.length > 0) {
          for (const consumableId of consumables) {
            window.techniqueSystem.addConsumable(consumableId);
            const consumable = CULTIVATION_CONSUMABLES[consumableId];
            if (consumable) {
              lootMessages.push(`💊 ${consumable.name}`);
            }
          }
          this.runRewards.consumables = this.runRewards.consumables || [];
          this.runRewards.consumables.push(...consumables);
        }
      } catch (e) {
        console.warn('Consumable drop failed:', e);
      }
    }

    // Always log loot gained
    if (lootMessages.length > 0) {
      this.logCombat(`Loot: ${lootMessages.join(', ')}`);
    }
    this.logCombat(`+${bonusBp} BP`);
  }

  /**
   * End the current run
   */
  endRun(reason) {
    if (!this.inRun) return;

    this.inRun = false;

    switch (reason) {
      case 'defeat':
        this.combatState = COMBAT_STATES.DEFEAT;
        this.stats.totalDeaths++;
        this.logCombat('You have fallen...');
        if (window.audioSystem) {
          window.audioSystem.playSFX('defeat');
        }
        break;
      case 'fled':
        this.combatState = COMBAT_STATES.FLED;
        this.logCombat('You escaped with your loot!');
        break;
    }

    // Award tokens
    this.tokens += this.runRewards.tokens;

    // Save run to history
    this.runHistory.push({
      floor: this.currentFloor,
      reason: reason,
      rewards: { ...this.runRewards },
      timestamp: Date.now()
    });

    // Keep only last 50 runs
    if (this.runHistory.length > 50) {
      this.runHistory = this.runHistory.slice(-50);
    }

    return this.runRewards;
  }

  /**
   * Purchase a permanent upgrade
   */
  purchaseUpgrade(upgradeType, cost) {
    if (this.tokens < cost) return false;

    this.tokens -= cost;

    switch (upgradeType) {
      case 'maxHp':
        this.upgrades.maxHpBonus += 10;
        break;
      case 'damage':
        this.upgrades.damageBonus += 2;
        break;
      case 'defense':
        this.upgrades.defenseBonus += 1;
        break;
      case 'startingShields':
        this.upgrades.startingShields += 1;
        break;
      case 'healing':
        this.upgrades.healingBonus += 0.1;
        break;
    }

    return true;
  }

  /**
   * Get upgrade cost
   */
  getUpgradeCost(upgradeType) {
    const baseCosts = {
      maxHp: 5,
      damage: 10,
      defense: 8,
      startingShields: 15,
      healing: 12
    };

    const level = this.getUpgradeLevel(upgradeType);
    return Math.floor(baseCosts[upgradeType] * Math.pow(1.5, level));
  }

  /**
   * Get upgrade level
   */
  getUpgradeLevel(upgradeType) {
    switch (upgradeType) {
      case 'maxHp': return Math.floor(this.upgrades.maxHpBonus / 10);
      case 'damage': return Math.floor(this.upgrades.damageBonus / 2);
      case 'defense': return this.upgrades.defenseBonus;
      case 'startingShields': return this.upgrades.startingShields;
      case 'healing': return Math.floor(this.upgrades.healingBonus / 0.1);
      default: return 0;
    }
  }

  /**
   * Get cooldown remaining
   */
  getCooldownRemaining(commandId) {
    const cooldownEnd = this.cooldowns[commandId] || 0;
    return Math.max(0, cooldownEnd - Date.now());
  }

  /**
   * Log combat message
   */
  logCombat(message) {
    this.combatLog.push({
      message,
      timestamp: Date.now()
    });

    // Keep only last 50 messages
    if (this.combatLog.length > 50) {
      this.combatLog = this.combatLog.slice(-50);
    }
  }

  /**
   * Update cooldowns
   */
  update(deltaTime) {
    // Cooldowns are timestamp-based, no update needed
    // Could add buff/debuff duration handling here
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      highestFloor: this.highestFloor,
      tokens: this.tokens,
      upgrades: this.upgrades,
      stats: this.stats,
      runHistory: this.runHistory.slice(-20),
      unlockedSkills: this.unlockedSkills || []
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.highestFloor) this.highestFloor = data.highestFloor;
    if (data.tokens) this.tokens = data.tokens;
    if (data.upgrades) this.upgrades = { ...this.upgrades, ...data.upgrades };
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
    if (data.runHistory) this.runHistory = data.runHistory;
    if (data.unlockedSkills) this.unlockedSkills = data.unlockedSkills;
  }

  /**
   * Unlock a skill manually (from shop/achievement)
   */
  unlockSkill(skillId) {
    if (!this.commands[skillId]) return false;
    this.unlockedSkills = this.unlockedSkills || [];
    if (!this.unlockedSkills.includes(skillId)) {
      this.unlockedSkills.push(skillId);
      if (window.audioSystem) window.audioSystem.playSFX('skillUnlock');
      return true;
    }
    return false;
  }

  /**
   * Auto-clear floors up to a target floor (fastest achieved floor)
   * Returns rewards earned from auto-clearing
   */
  autoClear(targetFloor = null) {
    // Default to highest floor minus 1 (so player still fights something new)
    const maxAutoClear = targetFloor || Math.max(0, this.highestFloor - 1);

    if (maxAutoClear <= 0) {
      return { success: false, message: 'No floors to auto-clear yet!' };
    }

    if (this.inRun) {
      return { success: false, message: 'Cannot auto-clear while in a run!' };
    }

    // Calculate rewards for auto-clearing
    let totalBp = 0;
    let totalTokens = 0;

    for (let floor = 1; floor <= maxAutoClear; floor++) {
      // BP per floor (reduced rate for auto-clear - 50%)
      totalBp += Math.floor(floor * 5 * 0.5);

      // Tokens per floor (reduced rate - 50%)
      totalTokens += Math.floor(0.5);

      // Boss floors give bonus
      if (floor % 10 === 0) {
        totalBp += Math.floor(floor * 20 * 0.5);
        totalTokens += Math.floor(floor / 10);
      }
    }

    // Add tokens
    this.tokens += totalTokens;

    // Update stats
    this.stats.totalFloors += maxAutoClear;
    this.stats.totalKills += maxAutoClear;
    this.stats.bossKills += Math.floor(maxAutoClear / 10);

    // Start a new run at the target floor
    this.inRun = true;
    this.currentFloor = maxAutoClear;
    this.combatState = COMBAT_STATES.IDLE;
    this.combatLog = [];

    // Reset run rewards
    this.runRewards = {
      bp: totalBp,
      tokens: totalTokens,
      materials: [],
      equipment: [],
      techniques: [],
      consumables: []
    };

    // Calculate player stats
    this.calculatePlayerStats([]);

    // Reset cooldowns
    for (const cmdId of Object.keys(this.commands)) {
      this.cooldowns[cmdId] = 0;
    }

    // Apply starting shields from upgrades
    this.playerShields = this.upgrades.startingShields;

    // Clear buffs/debuffs
    this.activeBuffs = [];
    this.activeDebuffs = [];
    this.floorModifiers = [];
    this.enemyDebuffs = [];
    this.dodgeCharges = 0;
    this.counterActive = null;
    this.deathSaveActive = false;
    this.reviveCharges = 0;
    this.extraTurns = 0;
    this.lootMultiplier = 1;
    this.usedOnceSkills = [];

    this.stats.totalRuns++;

    this.logCombat(`⚡ AUTO-CLEARED to Floor ${maxAutoClear}!`);
    this.logCombat(`Earned: ${totalBp} BP, ${totalTokens} tokens`);

    if (window.audioSystem) {
      window.audioSystem.playSFX('dungeonStart');
    }

    // Advance to next floor
    this.advanceFloor();

    return {
      success: true,
      message: `Auto-cleared to floor ${maxAutoClear}!`,
      rewards: { bp: totalBp, tokens: totalTokens },
      currentFloor: this.currentFloor
    };
  }

  /**
   * Get auto-clear info for UI
   */
  getAutoClearInfo() {
    const maxAutoClear = Math.max(0, this.highestFloor - 1);

    if (maxAutoClear <= 0) {
      return {
        available: false,
        targetFloor: 0,
        estimatedBp: 0,
        estimatedTokens: 0
      };
    }

    // Estimate rewards
    let estimatedBp = 0;
    let estimatedTokens = 0;

    for (let floor = 1; floor <= maxAutoClear; floor++) {
      estimatedBp += Math.floor(floor * 5 * 0.5);
      estimatedTokens += Math.floor(0.5);
      if (floor % 10 === 0) {
        estimatedBp += Math.floor(floor * 20 * 0.5);
        estimatedTokens += Math.floor(floor / 10);
      }
    }

    return {
      available: true,
      targetFloor: maxAutoClear,
      estimatedBp: estimatedBp,
      estimatedTokens: estimatedTokens
    };
  }

  /**
   * Reset system (for prestige)
   */
  reset(keepUpgrades = false) {
    this.inRun = false;
    this.currentFloor = 0;
    this.combatState = COMBAT_STATES.IDLE;
    this.combatLog = [];
    this.currentEnemy = null;

    if (!keepUpgrades) {
      this.highestFloor = 0;
      this.tokens = 0;
      this.upgrades = {
        maxHpBonus: 0,
        damageBonus: 0,
        defenseBonus: 0,
        startingShields: 0,
        healingBonus: 0
      };
      this.stats = {
        totalRuns: 0,
        totalFloors: 0,
        totalKills: 0,
        totalDeaths: 0,
        bossKills: 0,
        highestDamage: 0
      };
      this.runHistory = [];
    }
  }
}

// Export
window.PAGODA_ENEMIES = PAGODA_ENEMIES;
window.PAGODA_BOSSES = PAGODA_BOSSES;
window.BOOP_COMMANDS = BOOP_COMMANDS;
window.LOOT_RARITIES = LOOT_RARITIES;
window.COMBAT_STATES = COMBAT_STATES;
window.PagodaSystem = PagodaSystem;
