/**
 * wave-survival.js - 30-Minute Wave Survival Mode
 * "How long can you survive the endless horde?"
 */

// Survival Upgrades (Pick 1 of 3 on level up)
const SURVIVAL_UPGRADES = {
  // Damage
  damage_up: {
    id: 'damage_up',
    name: 'Power Up',
    category: 'damage',
    emoji: '⚔️',
    description: '+10% attack damage',
    effect: { damageMultiplier: 0.1 },
    weight: 100
  },
  crit_chance: {
    id: 'crit_chance',
    name: 'Precision',
    category: 'damage',
    emoji: '🎯',
    description: '+5% critical chance',
    effect: { critChance: 0.05 },
    weight: 80
  },
  crit_damage: {
    id: 'crit_damage',
    name: 'Devastation',
    category: 'damage',
    emoji: '💥',
    description: '+20% critical damage',
    effect: { critDamage: 0.2 },
    weight: 70
  },
  attack_speed: {
    id: 'attack_speed',
    name: 'Swift Strikes',
    category: 'damage',
    emoji: '⚡',
    description: '+15% attack speed',
    effect: { attackSpeed: 0.15 },
    weight: 90
  },
  projectile: {
    id: 'projectile',
    name: 'Multi-Boop',
    category: 'damage',
    emoji: '🔱',
    description: '+1 projectile per attack',
    effect: { projectiles: 1 },
    weight: 40
  },

  // Defense
  hp_up: {
    id: 'hp_up',
    name: 'Vitality',
    category: 'defense',
    emoji: '❤️',
    description: '+20 max HP',
    effect: { maxHp: 20 },
    weight: 100
  },
  dodge: {
    id: 'dodge',
    name: 'Evasion',
    category: 'defense',
    emoji: '💨',
    description: '+5% dodge chance',
    effect: { dodge: 0.05 },
    weight: 80
  },
  armor: {
    id: 'armor',
    name: 'Armor Up',
    category: 'defense',
    emoji: '🛡️',
    description: '+5 armor (reduces damage)',
    effect: { armor: 5 },
    weight: 90
  },
  regen: {
    id: 'regen',
    name: 'Regeneration',
    category: 'defense',
    emoji: '💚',
    description: '+1 HP per second',
    effect: { regenPerSecond: 1 },
    weight: 70
  },
  lifesteal: {
    id: 'lifesteal',
    name: 'Vampiric',
    category: 'defense',
    emoji: '🩸',
    description: '+5% lifesteal',
    effect: { lifesteal: 0.05 },
    weight: 50
  },

  // Utility
  xp_gain: {
    id: 'xp_gain',
    name: 'Quick Learner',
    category: 'utility',
    emoji: '📚',
    description: '+15% XP gain',
    effect: { xpMultiplier: 0.15 },
    weight: 80
  },
  pickup_radius: {
    id: 'pickup_radius',
    name: 'Magnet',
    category: 'utility',
    emoji: '🧲',
    description: '+20% pickup radius',
    effect: { pickupRadius: 0.2 },
    weight: 90
  },
  luck: {
    id: 'luck',
    name: 'Lucky',
    category: 'utility',
    emoji: '🍀',
    description: '+10% luck (better drops)',
    effect: { luck: 0.1 },
    weight: 70
  },
  cooldown: {
    id: 'cooldown',
    name: 'Haste',
    category: 'utility',
    emoji: '⏱️',
    description: '-10% ability cooldowns',
    effect: { cooldownReduction: 0.1 },
    weight: 60
  },

  // Special
  fire_aura: {
    id: 'fire_aura',
    name: 'Fire Aura',
    category: 'special',
    emoji: '🔥',
    description: 'Deal damage to nearby enemies',
    effect: { fireAura: true, auraDamage: 5 },
    weight: 30
  },
  frost_nova: {
    id: 'frost_nova',
    name: 'Frost Nova',
    category: 'special',
    emoji: '❄️',
    description: 'Periodically freeze nearby enemies',
    effect: { frostNova: true, freezeDuration: 2000 },
    weight: 25
  },
  companion: {
    id: 'companion',
    name: 'Cat Companion',
    category: 'special',
    emoji: '🐱',
    description: 'Summon a cat that attacks enemies',
    effect: { companions: 1 },
    weight: 20
  },
  ultimate_charge: {
    id: 'ultimate_charge',
    name: 'Ultimate Power',
    category: 'special',
    emoji: '💫',
    description: '+1 ultimate charge',
    effect: { ultimateCharges: 1 },
    weight: 15
  }
};

// Enemy Waves
const WAVE_ENEMIES = {
  // Early game (0-5 min)
  slime: {
    id: 'slime',
    name: 'Slime',
    emoji: '🟢',
    hp: 10,
    damage: 5,
    speed: 0.8,
    xp: 5,
    spawnWeight: 100,
    timeRange: [0, 300000]
  },
  bat: {
    id: 'bat',
    name: 'Bat',
    emoji: '🦇',
    hp: 8,
    damage: 8,
    speed: 1.5,
    xp: 7,
    spawnWeight: 80,
    timeRange: [0, 600000]
  },

  // Mid game (5-15 min)
  skeleton: {
    id: 'skeleton',
    name: 'Skeleton',
    emoji: '💀',
    hp: 25,
    damage: 12,
    speed: 1.0,
    xp: 15,
    spawnWeight: 70,
    timeRange: [300000, 900000]
  },
  ghost: {
    id: 'ghost',
    name: 'Ghost',
    emoji: '👻',
    hp: 20,
    damage: 15,
    speed: 1.2,
    xp: 18,
    spawnWeight: 60,
    timeRange: [300000, 1200000]
  },
  wolf: {
    id: 'wolf',
    name: 'Wolf',
    emoji: '🐺',
    hp: 35,
    damage: 18,
    speed: 1.8,
    xp: 20,
    spawnWeight: 50,
    timeRange: [600000, 1500000]
  },

  // Late game (15-25 min)
  demon: {
    id: 'demon',
    name: 'Demon',
    emoji: '😈',
    hp: 60,
    damage: 25,
    speed: 1.0,
    xp: 35,
    spawnWeight: 40,
    timeRange: [900000, 1800000]
  },
  golem: {
    id: 'golem',
    name: 'Golem',
    emoji: '🗿',
    hp: 100,
    damage: 20,
    speed: 0.5,
    xp: 50,
    spawnWeight: 30,
    timeRange: [900000, 1800000]
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon',
    emoji: '🐉',
    hp: 80,
    damage: 35,
    speed: 1.3,
    xp: 60,
    spawnWeight: 20,
    timeRange: [1200000, 1800000]
  },

  // End game (25-30 min)
  reaper: {
    id: 'reaper',
    name: 'Reaper',
    emoji: '💀',
    hp: 150,
    damage: 50,
    speed: 2.0,
    xp: 100,
    spawnWeight: 10,
    timeRange: [1500000, 1800000]
  },
  elder_god: {
    id: 'elder_god',
    name: 'Elder God',
    emoji: '👁️',
    hp: 500,
    damage: 100,
    speed: 0.7,
    xp: 250,
    spawnWeight: 5,
    timeRange: [1500000, 1800000]
  }
};

// Reward Tiers
const SURVIVAL_REWARDS = {
  bronze: {
    time: 300000, // 5 min
    bp: 500,
    materials: 5,
    description: 'Bronze Survivor'
  },
  silver: {
    time: 900000, // 15 min
    bp: 2000,
    materials: 15,
    tokens: 5,
    description: 'Silver Survivor'
  },
  gold: {
    time: 1500000, // 25 min
    bp: 5000,
    materials: 30,
    tokens: 15,
    equipment: true,
    description: 'Gold Survivor'
  },
  platinum: {
    time: 1800000, // 30 min
    bp: 15000,
    materials: 50,
    tokens: 30,
    equipment: true,
    special: 'survivor_crown',
    description: 'Platinum Survivor - COMPLETE!'
  }
};

/**
 * WaveSurvivalSystem - Manages the survival mode
 */
class WaveSurvivalSystem {
  constructor() {
    this.upgrades = SURVIVAL_UPGRADES;
    this.enemyTemplates = WAVE_ENEMIES;
    this.rewardTiers = SURVIVAL_REWARDS;

    // Game state
    this.inGame = false;
    this.paused = false;
    this.gameTime = 0;
    this.maxGameTime = 1800000; // 30 minutes

    // Player state
    this.playerLevel = 1;
    this.playerXp = 0;
    this.xpToNextLevel = 100;
    this.playerHp = 100;
    this.playerMaxHp = 100;
    this.playerX = 400; // Canvas center
    this.playerY = 300;

    // Player stats (from upgrades)
    this.playerStats = {
      damageMultiplier: 1,
      critChance: 0.1,
      critDamage: 1.5,
      attackSpeed: 1,
      projectiles: 1,
      dodge: 0,
      armor: 0,
      regenPerSecond: 0,
      lifesteal: 0,
      xpMultiplier: 1,
      pickupRadius: 50,
      luck: 0,
      cooldownReduction: 0,
      companions: 0,
      ultimateCharges: 0
    };

    // Active effects
    this.hasFireAura = false;
    this.hasFrostNova = false;
    this.auraDamage = 0;
    this.freezeDuration = 0;

    // Collected upgrades
    this.collectedUpgrades = [];

    // Enemies
    this.enemies = [];
    this.maxEnemies = 50;
    this.spawnInterval = 1000;
    this.lastSpawnTime = 0;

    // Companions
    this.companions = [];

    // XP orbs
    this.xpOrbs = [];

    // Pending level up
    this.pendingLevelUp = null;

    // Statistics
    this.stats = {
      totalRuns: 0,
      bestTime: 0,
      totalKills: 0,
      totalXpGained: 0,
      highestLevel: 0
    };

    // Unlocks
    this.unlocks = [];
  }

  /**
   * Start a new survival run
   */
  startGame() {
    if (this.inGame) return false;

    this.inGame = true;
    this.paused = false;
    this.gameTime = 0;

    // Reset player
    this.playerLevel = 1;
    this.playerXp = 0;
    this.xpToNextLevel = 100;
    this.playerMaxHp = 100;
    this.playerHp = this.playerMaxHp;
    this.playerX = 400;
    this.playerY = 300;

    // Reset stats
    this.playerStats = {
      damageMultiplier: 1,
      critChance: 0.1,
      critDamage: 1.5,
      attackSpeed: 1,
      projectiles: 1,
      dodge: 0,
      armor: 0,
      regenPerSecond: 0,
      lifesteal: 0,
      xpMultiplier: 1,
      pickupRadius: 50,
      luck: 0,
      cooldownReduction: 0,
      companions: 0,
      ultimateCharges: 0
    };

    this.hasFireAura = false;
    this.hasFrostNova = false;
    this.auraDamage = 0;
    this.freezeDuration = 0;

    // Reset collections
    this.collectedUpgrades = [];
    this.enemies = [];
    this.companions = [];
    this.xpOrbs = [];
    this.pendingLevelUp = null;

    this.stats.totalRuns++;

    if (window.audioSystem) {
      window.audioSystem.playSFX('survivalStart');
    }

    return true;
  }

  /**
   * Update game state (call every frame)
   */
  update(deltaTime) {
    if (!this.inGame || this.paused || this.pendingLevelUp) return;

    this.gameTime += deltaTime;

    // Check for win condition
    if (this.gameTime >= this.maxGameTime) {
      this.endGame('victory');
      return;
    }

    // Spawn enemies
    this.updateSpawning(deltaTime);

    // Update enemies
    this.updateEnemies(deltaTime);

    // Update player
    this.updatePlayer(deltaTime);

    // Update companions
    this.updateCompanions(deltaTime);

    // Update XP orbs
    this.updateXpOrbs(deltaTime);

    // Check collisions
    this.checkCollisions();

    // Apply aura effects
    this.applyAuraEffects(deltaTime);
  }

  /**
   * Spawn enemies based on time
   */
  updateSpawning(deltaTime) {
    this.lastSpawnTime += deltaTime;

    // Spawn rate increases over time
    const spawnRate = Math.max(200, this.spawnInterval - this.gameTime * 0.0005);

    if (this.lastSpawnTime >= spawnRate && this.enemies.length < this.maxEnemies) {
      this.spawnEnemy();
      this.lastSpawnTime = 0;
    }
  }

  /**
   * Spawn a random enemy
   */
  spawnEnemy() {
    // Get valid enemies for current time
    const validEnemies = Object.values(this.enemyTemplates).filter(e =>
      this.gameTime >= e.timeRange[0] && this.gameTime <= e.timeRange[1]
    );

    if (validEnemies.length === 0) return;

    // Weighted random selection
    const totalWeight = validEnemies.reduce((sum, e) => sum + e.spawnWeight, 0);
    let roll = Math.random() * totalWeight;
    let selected = validEnemies[0];

    for (const enemy of validEnemies) {
      roll -= enemy.spawnWeight;
      if (roll <= 0) {
        selected = enemy;
        break;
      }
    }

    // Scale enemy stats based on time
    const timeScale = 1 + this.gameTime / 600000; // +100% every 10 min

    // Spawn at random edge
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    switch (edge) {
      case 0: x = -50; y = Math.random() * 600; break; // Left
      case 1: x = 850; y = Math.random() * 600; break; // Right
      case 2: x = Math.random() * 800; y = -50; break; // Top
      case 3: x = Math.random() * 800; y = 650; break; // Bottom
    }

    this.enemies.push({
      ...selected,
      x,
      y,
      currentHp: Math.floor(selected.hp * timeScale),
      maxHp: Math.floor(selected.hp * timeScale),
      damage: Math.floor(selected.damage * timeScale),
      frozen: false,
      frozenUntil: 0
    });
  }

  /**
   * Update enemies
   */
  updateEnemies(deltaTime) {
    const now = Date.now();

    for (const enemy of this.enemies) {
      // Check if frozen
      if (enemy.frozen && enemy.frozenUntil > now) {
        continue;
      }
      enemy.frozen = false;

      // Move toward player
      const dx = this.playerX - enemy.x;
      const dy = this.playerY - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        const speed = enemy.speed * (deltaTime / 16);
        enemy.x += (dx / dist) * speed;
        enemy.y += (dy / dist) * speed;
      }
    }

    // Remove dead enemies
    this.enemies = this.enemies.filter(e => e.currentHp > 0);
  }

  /**
   * Update player
   */
  updatePlayer(deltaTime) {
    // Regeneration
    if (this.playerStats.regenPerSecond > 0) {
      const regen = this.playerStats.regenPerSecond * (deltaTime / 1000);
      this.playerHp = Math.min(this.playerMaxHp, this.playerHp + regen);
    }
  }

  /**
   * Update companions
   */
  updateCompanions(deltaTime) {
    // Companions auto-attack nearby enemies
    for (const companion of this.companions) {
      companion.attackCooldown -= deltaTime;

      if (companion.attackCooldown <= 0 && this.enemies.length > 0) {
        // Find nearest enemy
        let nearest = null;
        let nearestDist = Infinity;

        for (const enemy of this.enemies) {
          const dx = enemy.x - companion.x;
          const dy = enemy.y - companion.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = enemy;
          }
        }

        if (nearest && nearestDist < 200) {
          this.damageEnemy(nearest, companion.damage);
          companion.attackCooldown = 1000;
        }
      }

      // Follow player loosely
      const dx = this.playerX - companion.x;
      const dy = this.playerY - companion.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 100) {
        companion.x += (dx / dist) * 2;
        companion.y += (dy / dist) * 2;
      }
    }
  }

  /**
   * Update XP orbs
   */
  updateXpOrbs(deltaTime) {
    const pickupDist = this.playerStats.pickupRadius;

    for (let i = this.xpOrbs.length - 1; i >= 0; i--) {
      const orb = this.xpOrbs[i];

      // Move toward player if in range
      const dx = this.playerX - orb.x;
      const dy = this.playerY - orb.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < pickupDist) {
        // Accelerate toward player
        orb.x += (dx / dist) * 8;
        orb.y += (dy / dist) * 8;

        // Collect if close enough
        if (dist < 20) {
          this.collectXp(orb.amount);
          this.xpOrbs.splice(i, 1);
        }
      }
    }
  }

  /**
   * Check collisions
   */
  checkCollisions() {
    // Player-enemy collisions
    for (const enemy of this.enemies) {
      const dx = this.playerX - enemy.x;
      const dy = this.playerY - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 30) {
        // Check dodge
        if (Math.random() < this.playerStats.dodge) {
          // Dodged!
          continue;
        }

        // Take damage
        const damage = Math.max(1, enemy.damage - this.playerStats.armor);
        this.playerHp -= damage;

        // Knockback enemy
        enemy.x -= (dx / dist) * 50;
        enemy.y -= (dy / dist) * 50;

        if (this.playerHp <= 0) {
          this.endGame('defeat');
          return;
        }
      }
    }
  }

  /**
   * Apply aura effects
   */
  applyAuraEffects(deltaTime) {
    if (this.hasFireAura) {
      for (const enemy of this.enemies) {
        const dx = this.playerX - enemy.x;
        const dy = this.playerY - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          this.damageEnemy(enemy, this.auraDamage * (deltaTime / 1000));
        }
      }
    }
  }

  /**
   * Damage an enemy
   */
  damageEnemy(enemy, baseDamage) {
    let damage = baseDamage * this.playerStats.damageMultiplier;

    // Crit check
    if (Math.random() < this.playerStats.critChance) {
      damage *= this.playerStats.critDamage;
    }

    enemy.currentHp -= damage;

    // Lifesteal
    if (this.playerStats.lifesteal > 0) {
      const heal = damage * this.playerStats.lifesteal;
      this.playerHp = Math.min(this.playerMaxHp, this.playerHp + heal);
    }

    // Check for kill
    if (enemy.currentHp <= 0) {
      this.onEnemyKilled(enemy);
    }
  }

  /**
   * Handle enemy killed
   */
  onEnemyKilled(enemy) {
    this.stats.totalKills++;

    // Spawn XP orb
    this.xpOrbs.push({
      x: enemy.x,
      y: enemy.y,
      amount: Math.floor(enemy.xp * this.playerStats.xpMultiplier)
    });
  }

  /**
   * Collect XP
   */
  collectXp(amount) {
    this.playerXp += amount;
    this.stats.totalXpGained += amount;

    // Check for level up
    while (this.playerXp >= this.xpToNextLevel) {
      this.playerXp -= this.xpToNextLevel;
      this.levelUp();
    }
  }

  /**
   * Level up player
   */
  levelUp() {
    this.playerLevel++;

    if (this.playerLevel > this.stats.highestLevel) {
      this.stats.highestLevel = this.playerLevel;
    }

    // Increase XP requirement
    this.xpToNextLevel = Math.floor(100 * Math.pow(1.15, this.playerLevel - 1));

    // Offer upgrade selection
    this.offerUpgradeSelection();

    if (window.audioSystem) {
      window.audioSystem.playSFX('levelUp');
    }
  }

  /**
   * Offer upgrade selection (pick 1 of 3)
   */
  offerUpgradeSelection() {
    const options = this.generateUpgradeOptions(3);
    this.pendingLevelUp = { options };
    this.paused = true;
  }

  /**
   * Generate random upgrade options
   */
  generateUpgradeOptions(count) {
    const options = [];
    const available = Object.values(this.upgrades);

    // Weight by rarity
    const weighted = [];
    for (const upgrade of available) {
      for (let i = 0; i < upgrade.weight; i++) {
        weighted.push(upgrade);
      }
    }

    for (let i = 0; i < count && weighted.length > 0; i++) {
      const index = Math.floor(Math.random() * weighted.length);
      const upgrade = weighted[index];
      options.push(upgrade);

      // Remove this upgrade from pool (to avoid duplicates)
      for (let j = weighted.length - 1; j >= 0; j--) {
        if (weighted[j].id === upgrade.id) {
          weighted.splice(j, 1);
        }
      }
    }

    return options;
  }

  /**
   * Select an upgrade
   */
  selectUpgrade(upgradeId) {
    if (!this.pendingLevelUp) return false;

    const upgrade = this.pendingLevelUp.options.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    this.applyUpgrade(upgrade);
    this.collectedUpgrades.push(upgrade.id);

    this.pendingLevelUp = null;
    this.paused = false;

    return true;
  }

  /**
   * Apply upgrade effects
   */
  applyUpgrade(upgrade) {
    const effect = upgrade.effect;

    for (const [key, value] of Object.entries(effect)) {
      switch (key) {
        case 'damageMultiplier':
          this.playerStats.damageMultiplier += value;
          break;
        case 'critChance':
          this.playerStats.critChance += value;
          break;
        case 'critDamage':
          this.playerStats.critDamage += value;
          break;
        case 'attackSpeed':
          this.playerStats.attackSpeed += value;
          break;
        case 'projectiles':
          this.playerStats.projectiles += value;
          break;
        case 'maxHp':
          this.playerMaxHp += value;
          this.playerHp += value;
          break;
        case 'dodge':
          this.playerStats.dodge += value;
          break;
        case 'armor':
          this.playerStats.armor += value;
          break;
        case 'regenPerSecond':
          this.playerStats.regenPerSecond += value;
          break;
        case 'lifesteal':
          this.playerStats.lifesteal += value;
          break;
        case 'xpMultiplier':
          this.playerStats.xpMultiplier += value;
          break;
        case 'pickupRadius':
          this.playerStats.pickupRadius *= (1 + value);
          break;
        case 'luck':
          this.playerStats.luck += value;
          break;
        case 'cooldownReduction':
          this.playerStats.cooldownReduction += value;
          break;
        case 'companions':
          this.playerStats.companions += value;
          this.spawnCompanion();
          break;
        case 'ultimateCharges':
          this.playerStats.ultimateCharges += value;
          break;
        case 'fireAura':
          this.hasFireAura = true;
          break;
        case 'auraDamage':
          this.auraDamage += value;
          break;
        case 'frostNova':
          this.hasFrostNova = true;
          break;
        case 'freezeDuration':
          this.freezeDuration = value;
          break;
      }
    }
  }

  /**
   * Spawn a companion
   */
  spawnCompanion() {
    this.companions.push({
      x: this.playerX + (Math.random() - 0.5) * 100,
      y: this.playerY + (Math.random() - 0.5) * 100,
      damage: 10,
      attackCooldown: 0
    });
  }

  /**
   * Move player (called from input handler)
   */
  movePlayer(dx, dy) {
    this.playerX = Math.max(20, Math.min(780, this.playerX + dx * 5));
    this.playerY = Math.max(20, Math.min(580, this.playerY + dy * 5));
  }

  /**
   * Player auto-attack (called periodically)
   */
  playerAttack() {
    if (this.enemies.length === 0) return;

    // Find nearest enemy
    let nearest = null;
    let nearestDist = Infinity;

    for (const enemy of this.enemies) {
      const dx = enemy.x - this.playerX;
      const dy = enemy.y - this.playerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = enemy;
      }
    }

    if (nearest) {
      // Attack with all projectiles
      for (let i = 0; i < this.playerStats.projectiles; i++) {
        this.damageEnemy(nearest, 10);
      }
    }
  }

  /**
   * End the game
   */
  endGame(reason) {
    if (!this.inGame) return;

    this.inGame = false;

    // Update best time
    if (this.gameTime > this.stats.bestTime) {
      this.stats.bestTime = this.gameTime;
    }

    // Calculate rewards
    const rewards = this.calculateRewards();

    if (window.audioSystem) {
      window.audioSystem.playSFX(reason === 'victory' ? 'survivalVictory' : 'survivalDefeat');
    }

    return {
      reason,
      time: this.gameTime,
      level: this.playerLevel,
      kills: this.enemies.length,
      rewards
    };
  }

  /**
   * Calculate rewards based on survival time
   */
  calculateRewards() {
    const rewards = {
      bp: 0,
      materials: 0,
      tokens: 0,
      equipment: false,
      special: null,
      tier: null
    };

    // Find highest tier reached
    for (const [tierId, tier] of Object.entries(this.rewardTiers)) {
      if (this.gameTime >= tier.time) {
        rewards.bp = tier.bp;
        rewards.materials = tier.materials;
        rewards.tokens = tier.tokens || 0;
        rewards.equipment = tier.equipment || false;
        rewards.special = tier.special || null;
        rewards.tier = tierId;
      }
    }

    // Apply luck bonus
    rewards.bp = Math.floor(rewards.bp * (1 + this.playerStats.luck));
    rewards.materials = Math.floor(rewards.materials * (1 + this.playerStats.luck));

    return rewards;
  }

  /**
   * Get formatted time string
   */
  formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      stats: this.stats,
      unlocks: this.unlocks
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.stats) {
      this.stats = { ...this.stats, ...data.stats };
    }
    if (data.unlocks) {
      this.unlocks = data.unlocks;
    }
  }

  /**
   * Reset system
   */
  reset() {
    this.inGame = false;
    this.stats = {
      totalRuns: 0,
      bestTime: 0,
      totalKills: 0,
      totalXpGained: 0,
      highestLevel: 0
    };
    this.unlocks = [];
  }
}

// Export
window.SURVIVAL_UPGRADES = SURVIVAL_UPGRADES;
window.WAVE_ENEMIES = WAVE_ENEMIES;
window.SURVIVAL_REWARDS = SURVIVAL_REWARDS;
window.WaveSurvivalSystem = WaveSurvivalSystem;
