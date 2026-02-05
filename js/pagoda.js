/**
 * pagoda.js - Infinite Pagoda Roguelike Dungeon
 * "Each floor brings you closer to enlightenment... or death."
 */

// Enemy Templates by Floor Range
const PAGODA_ENEMIES = {
  // Floor 1-10: Spirit Animals
  spirit_mouse: {
    id: 'spirit_mouse',
    name: 'Spirit Mouse',
    emoji: '🐭',
    floorRange: [1, 10],
    baseHp: 20,
    baseDamage: 5,
    baseDefense: 2,
    speed: 1.2,
    element: null,
    abilities: [],
    dropChance: 0.3
  },
  phantom_fish: {
    id: 'phantom_fish',
    name: 'Phantom Fish',
    emoji: '🐟',
    floorRange: [1, 10],
    baseHp: 15,
    baseDamage: 8,
    baseDefense: 1,
    speed: 1.5,
    element: 'water',
    abilities: ['splash'],
    dropChance: 0.35
  },
  shadow_moth: {
    id: 'shadow_moth',
    name: 'Shadow Moth',
    emoji: '🦋',
    floorRange: [1, 10],
    baseHp: 10,
    baseDamage: 12,
    baseDefense: 0,
    speed: 2.0,
    element: 'void',
    abilities: ['flutter'],
    dropChance: 0.25
  },

  // Floor 11-30: Mystical Beasts
  jade_serpent: {
    id: 'jade_serpent',
    name: 'Jade Serpent',
    emoji: '🐍',
    floorRange: [11, 30],
    baseHp: 50,
    baseDamage: 15,
    baseDefense: 8,
    speed: 1.0,
    element: 'nature',
    abilities: ['constrict', 'poison_bite'],
    dropChance: 0.4
  },
  thunder_sparrow: {
    id: 'thunder_sparrow',
    name: 'Thunder Sparrow',
    emoji: '🐦',
    floorRange: [11, 30],
    baseHp: 35,
    baseDamage: 25,
    baseDefense: 3,
    speed: 2.5,
    element: 'light',
    abilities: ['lightning_dive'],
    dropChance: 0.35
  },
  frost_fox: {
    id: 'frost_fox',
    name: 'Frost Fox',
    emoji: '🦊',
    floorRange: [11, 30],
    baseHp: 45,
    baseDamage: 18,
    baseDefense: 5,
    speed: 1.8,
    element: 'water',
    abilities: ['freeze', 'ice_breath'],
    dropChance: 0.45
  },

  // Floor 31-50: Legendary Creatures
  void_wolf: {
    id: 'void_wolf',
    name: 'Void Wolf',
    emoji: '🐺',
    floorRange: [31, 50],
    baseHp: 100,
    baseDamage: 35,
    baseDefense: 15,
    speed: 1.5,
    element: 'void',
    abilities: ['shadow_step', 'howl'],
    dropChance: 0.5
  },
  celestial_crane: {
    id: 'celestial_crane',
    name: 'Celestial Crane',
    emoji: '🦢',
    floorRange: [31, 50],
    baseHp: 80,
    baseDamage: 40,
    baseDefense: 10,
    speed: 2.0,
    element: 'light',
    abilities: ['divine_wind', 'feather_storm'],
    dropChance: 0.45
  },
  storm_dragon: {
    id: 'storm_dragon',
    name: 'Storm Dragon',
    emoji: '🐲',
    floorRange: [31, 50],
    baseHp: 150,
    baseDamage: 30,
    baseDefense: 20,
    speed: 1.0,
    element: 'water',
    abilities: ['thunder_breath', 'tail_sweep'],
    dropChance: 0.6
  },

  // Floor 51+: Ancient Horrors
  ancient_beast: {
    id: 'ancient_beast',
    name: 'Ancient Beast',
    emoji: '🦖',
    floorRange: [51, 100],
    baseHp: 250,
    baseDamage: 50,
    baseDefense: 25,
    speed: 0.8,
    element: 'nature',
    abilities: ['primal_roar', 'crushing_blow'],
    dropChance: 0.7
  },
  corrupted_spirit: {
    id: 'corrupted_spirit',
    name: 'Corrupted Spirit',
    emoji: '👹',
    floorRange: [51, 100],
    baseHp: 180,
    baseDamage: 65,
    baseDefense: 15,
    speed: 1.5,
    element: 'void',
    abilities: ['corruption', 'soul_drain'],
    dropChance: 0.65
  },
  dimensional_entity: {
    id: 'dimensional_entity',
    name: 'Dimensional Entity',
    emoji: '👁️',
    floorRange: [51, 100],
    baseHp: 200,
    baseDamage: 55,
    baseDefense: 30,
    speed: 1.2,
    element: 'void',
    abilities: ['reality_warp', 'gaze'],
    dropChance: 0.8
  }
};

// Boss Templates (Every 10 floors)
const PAGODA_BOSSES = {
  eternal_napper: {
    id: 'eternal_napper',
    name: 'The Eternal Napper',
    emoji: '😴',
    floor: 10,
    baseHp: 500,
    baseDamage: 30,
    baseDefense: 20,
    speed: 0.5,
    element: null,
    phases: 2,
    abilities: ['sleep_aura', 'dream_attack', 'nightmare'],
    rewards: { bp: 1000, tokens: 5 },
    flavorText: '"Disturbing its slumber was a grave mistake."'
  },
  goose_emperor: {
    id: 'goose_emperor',
    name: 'The Goose Emperor',
    emoji: '🦢',
    floor: 20,
    baseHp: 1200,
    baseDamage: 50,
    baseDefense: 30,
    speed: 1.2,
    element: 'water',
    phases: 3,
    abilities: ['imperial_honk', 'wing_buffet', 'summon_geese'],
    rewards: { bp: 3000, tokens: 10 },
    flavorText: '"ALL SHALL BOW BEFORE THE HONK."'
  },
  nine_tailed_menace: {
    id: 'nine_tailed_menace',
    name: 'Nine-Tailed Menace',
    emoji: '🦊',
    floor: 30,
    baseHp: 2000,
    baseDamage: 70,
    baseDefense: 35,
    speed: 1.5,
    element: 'fire',
    phases: 3,
    abilities: ['fox_fire', 'illusion', 'tail_whip', 'charm'],
    rewards: { bp: 5000, tokens: 15 },
    flavorText: '"Each tail holds a century of cunning."'
  },
  jade_guardian: {
    id: 'jade_guardian',
    name: 'Jade Guardian',
    emoji: '🗿',
    floor: 40,
    baseHp: 3500,
    baseDamage: 60,
    baseDefense: 60,
    speed: 0.7,
    element: 'nature',
    phases: 2,
    abilities: ['stone_skin', 'jade_blast', 'earthquake'],
    rewards: { bp: 8000, tokens: 20 },
    flavorText: '"Protector of the ancient jade."'
  },
  void_sovereign: {
    id: 'void_sovereign',
    name: 'Void Sovereign',
    emoji: '🌑',
    floor: 50,
    baseHp: 5000,
    baseDamage: 100,
    baseDefense: 50,
    speed: 1.0,
    element: 'void',
    phases: 4,
    abilities: ['void_rend', 'dimension_shift', 'absolute_zero', 'annihilate'],
    rewards: { bp: 15000, tokens: 30 },
    flavorText: '"The lord of nothingness."'
  },
  celestial_cat: {
    id: 'celestial_cat',
    name: 'Celestial Cat God',
    emoji: '🐱',
    floor: 100,
    baseHp: 50000,
    baseDamage: 200,
    baseDefense: 100,
    speed: 2.0,
    element: 'light',
    phases: 5,
    abilities: ['divine_boop', 'heaven_fall', 'purr_of_doom', 'nine_lives'],
    rewards: { bp: 100000, tokens: 100, special: 'celestial_blessing' },
    flavorText: '"The ultimate snoot awaits."'
  }
};

// Boop Commands (Abilities)
const BOOP_COMMANDS = {
  power_strike: {
    id: 'power_strike',
    name: 'Power Strike',
    emoji: '💪',
    description: 'A powerful boop dealing 150% damage.',
    cooldown: 0,
    effect: { type: 'damage', multiplier: 1.5 },
    cost: 0
  },
  healing_touch: {
    id: 'healing_touch',
    name: 'Healing Touch',
    emoji: '💚',
    description: 'Restore 25% of max HP.',
    cooldown: 15000,
    effect: { type: 'heal', amount: 0.25 },
    cost: 0
  },
  shield_wall: {
    id: 'shield_wall',
    name: 'Shield Wall',
    emoji: '🛡️',
    description: 'Block the next 3 attacks.',
    cooldown: 20000,
    effect: { type: 'shield', charges: 3 },
    cost: 0
  },
  mega_boop: {
    id: 'mega_boop',
    name: 'MEGA BOOP',
    emoji: '💥',
    description: 'Devastating attack dealing 500% damage. Long cooldown.',
    cooldown: 45000,
    effect: { type: 'damage', multiplier: 5.0 },
    cost: 0
  },
  emergency_exit: {
    id: 'emergency_exit',
    name: 'Emergency Exit',
    emoji: '🚪',
    description: 'Flee the dungeon, keeping all loot gained.',
    cooldown: 0,
    effect: { type: 'flee' },
    cost: 0
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
      equipment: []
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
      equipment: []
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
   * Execute a boop command
   */
  executeCommand(commandId) {
    if (this.combatState !== COMBAT_STATES.SELECTING) return false;

    const command = this.commands[commandId];
    if (!command) return false;

    // Check cooldown
    if (this.cooldowns[commandId] > Date.now()) {
      this.logCombat(`${command.name} is on cooldown!`);
      return false;
    }

    this.combatState = COMBAT_STATES.PLAYER_TURN;

    // Execute effect
    switch (command.effect.type) {
      case 'damage':
        this.playerAttack(command.effect.multiplier);
        break;
      case 'heal':
        this.playerHeal(command.effect.amount);
        break;
      case 'shield':
        this.playerShields += command.effect.charges;
        this.logCombat(`Gained ${command.effect.charges} shields!`);
        break;
      case 'flee':
        this.endRun('fled');
        return true;
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

    // Enemy turn
    setTimeout(() => this.enemyTurn(), 500);

    return true;
  }

  /**
   * Player attacks enemy
   */
  playerAttack(multiplier = 1.0) {
    let damage = this.playerDamage * multiplier;

    // Apply modifiers
    for (const mod of this.floorModifiers) {
      if (mod.effect.playerDamage) {
        damage *= mod.effect.playerDamage;
      }
    }

    // Check for crit
    let isCrit = false;
    let critChance = 0.1;
    for (const mod of this.floorModifiers) {
      if (mod.effect.critChance) {
        critChance += mod.effect.critChance;
      }
    }

    if (Math.random() < critChance) {
      damage *= 2;
      isCrit = true;
    }

    // Apply enemy defense
    const enemyDef = this.currentEnemy.baseDefense || 0;
    damage = Math.max(1, damage - enemyDef * 0.5);

    damage = Math.floor(damage);
    this.enemyHp = Math.max(0, this.enemyHp - damage);

    if (damage > this.stats.highestDamage) {
      this.stats.highestDamage = damage;
    }

    const critText = isCrit ? ' CRIT!' : '';
    this.logCombat(`You deal ${damage} damage!${critText}`);

    if (window.audioSystem) {
      window.audioSystem.playSFX(isCrit ? 'criticalBoop' : 'boop');
    }
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

    let damage = this.currentEnemy.baseDamage || 10;

    // Apply floor scaling
    const scaling = 1 + (this.currentFloor - 1) * 0.1;
    damage = Math.floor(damage * scaling);

    // Apply modifiers
    for (const mod of this.floorModifiers) {
      if (mod.effect.enemyDamage) {
        damage *= mod.effect.enemyDamage;
      }
    }

    // Check for shields
    if (this.playerShields > 0) {
      this.playerShields--;
      this.logCombat(`Shield blocks the attack! (${this.playerShields} remaining)`);
    } else {
      // Apply defense
      damage = Math.max(1, damage - this.playerDefense);
      damage = Math.floor(damage);

      this.playerHp = Math.max(0, this.playerHp - damage);
      this.logCombat(`${this.currentEnemy.emoji} deals ${damage} damage!`);

      if (window.audioSystem) {
        window.audioSystem.playSFX('playerHit');
      }
    }

    // Check for defeat
    if (this.playerHp <= 0) {
      this.endRun('defeat');
      return;
    }

    this.combatState = COMBAT_STATES.SELECTING;
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
    // Material drops
    if (window.craftingSystem) {
      const drops = window.craftingSystem.generateDrop({
        floor: this.currentFloor,
        luck: this.playerDefense, // Use defense as luck proxy
        isBoss: isBoss
      });
      this.runRewards.materials.push(...drops);
    }

    // Equipment drops (chance based)
    if (window.equipmentSystem) {
      const dropChance = isBoss ? 0.5 : this.currentEnemy.dropChance || 0.2;

      // Apply loot bonus modifier
      let finalChance = dropChance;
      for (const mod of this.floorModifiers) {
        if (mod.effect.lootBonus) {
          finalChance *= mod.effect.lootBonus;
        }
      }

      if (Math.random() < finalChance) {
        const equipment = window.equipmentSystem.generateDrop(this.currentFloor);
        if (equipment) {
          this.runRewards.equipment.push(equipment);
          this.logCombat(`Found: ${equipment.name}!`);
        }
      }
    }
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
      runHistory: this.runHistory.slice(-20) // Keep last 20 for save size
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
