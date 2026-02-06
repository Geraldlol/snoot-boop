/**
 * idle.js - AFK Cultivation Engine
 * "In stillness, the cat cultivates. In patience, the master prospers."
 *
 * Handles all offline/AFK gain calculations with proper scaling
 * and event generation for returning players.
 */

// =============================================================================
// CONSTANTS
// =============================================================================

const IDLE_CONSTANTS = {
  MAX_AFK_TIME: 24 * 60 * 60 * 1000, // 24 hours maximum
  MIN_AFK_TIME: 60 * 1000, // 1 minute minimum to count
  IDLE_THRESHOLD: 30 * 1000, // 30 seconds without input = idle
  EVENT_BASE_CHANCE: 0.3, // 30% chance per hour for events
  STRAY_CAT_BASE_CHANCE: 0.02, // 2% per hour base chance for stray cats
  HAPPINESS_DECAY_RATE: 0.5, // Happiness decay per hour while AFK
  AFK_EFFICIENCY: 0.75 // AFK gains are 75% of active gains by default
};

// =============================================================================
// AFK EVENT TYPES
// =============================================================================

const AFK_EVENTS = {
  // Common events (60% of events)
  common: [
    {
      id: 'meditation',
      name: 'Group Meditation',
      description: 'Your cats achieved group meditation!',
      emoji: '🧘',
      weight: 20,
      rewards: (gameState) => ({
        pp: Math.max(50, Math.floor((gameState.purrPower || 100) * 0.05))
      })
    },
    {
      id: 'visitor',
      name: 'Merchant Visit',
      description: 'A wandering merchant visited with gifts!',
      emoji: '🎁',
      weight: 20,
      rewards: (gameState) => ({
        bp: Math.max(100, Math.floor((gameState.boopPoints || 1000) * 0.05))
      })
    },
    {
      id: 'zoomies',
      name: 'Mass Zoomies',
      description: 'Mass zoomies outbreak! Cats are energized!',
      emoji: '💨',
      weight: 15,
      rewards: () => ({
        happiness: 15
      })
    },
    {
      id: 'sunbeam',
      name: 'Perfect Sunbeam',
      description: 'Perfect sunbeam alignment blessed your sect!',
      emoji: '☀️',
      weight: 15,
      rewards: (gameState) => ({
        pp: Math.max(25, Math.floor((gameState.purrPower || 100) * 0.03)),
        bp: Math.max(50, Math.floor((gameState.boopPoints || 1000) * 0.02))
      })
    },
    {
      id: 'treat',
      name: 'Mysterious Treats',
      description: 'Mysterious treats appeared from nowhere!',
      emoji: '🐟',
      weight: 10,
      rewards: () => ({
        happiness: 10
      })
    },
    {
      id: 'gossip',
      name: 'Cat Gossip',
      description: 'The cats shared cultivation secrets among themselves!',
      emoji: '🗣️',
      weight: 10,
      rewards: (gameState) => ({
        cultivationXP: Math.max(10, Math.floor((gameState.totalBoops || 1000) * 0.001))
      })
    },
    {
      id: 'grooming',
      name: 'Grooming Session',
      description: 'The cats had a communal grooming session!',
      emoji: '✨',
      weight: 10,
      rewards: () => ({
        happiness: 8,
        pp: 20
      })
    }
  ],

  // Rare events (25% of events)
  rare: [
    {
      id: 'golden_visitor',
      name: 'Golden Merchant',
      description: 'A GOLDEN MERCHANT appeared with treasures!',
      emoji: '👑',
      weight: 25,
      rewards: (gameState) => ({
        bp: Math.max(500, Math.floor((gameState.boopPoints || 1000) * 0.15)),
        jadeCatnip: 5
      })
    },
    {
      id: 'cultivation_breakthrough',
      name: 'Cultivation Breakthrough',
      description: 'Your cats achieved a CULTIVATION BREAKTHROUGH!',
      emoji: '💫',
      weight: 25,
      rewards: (gameState) => ({
        pp: Math.max(250, Math.floor((gameState.purrPower || 100) * 0.15)),
        cultivationXP: 50
      })
    },
    {
      id: 'celestial_blessing',
      name: 'Celestial Blessing',
      description: 'The heavens smiled upon your sect!',
      emoji: '🌟',
      weight: 20,
      rewards: (gameState) => ({
        bp: Math.max(300, Math.floor((gameState.boopPoints || 1000) * 0.10)),
        pp: Math.max(150, Math.floor((gameState.purrPower || 100) * 0.10))
      })
    },
    {
      id: 'ancient_scroll',
      name: 'Ancient Scroll',
      description: 'An ancient scroll was discovered in your sect!',
      emoji: '📜',
      weight: 15,
      rewards: () => ({
        jadeCatnip: 10,
        cultivationXP: 25
      })
    },
    {
      id: 'spirit_stone_vein',
      name: 'Spirit Stone Vein',
      description: 'A vein of spirit stones was uncovered!',
      emoji: '💎',
      weight: 15,
      rewards: () => ({
        spiritStones: 10
      })
    }
  ],

  // Legendary events (10% of events)
  legendary: [
    {
      id: 'immortal_visit',
      name: 'Immortal Cat Visit',
      description: 'AN IMMORTAL CAT VISITED YOUR SECT!',
      emoji: '🐉',
      weight: 40,
      rewards: (gameState) => ({
        bp: Math.max(2000, Math.floor((gameState.boopPoints || 1000) * 0.25)),
        pp: Math.max(500, Math.floor((gameState.purrPower || 100) * 0.20)),
        jadeCatnip: 25
      })
    },
    {
      id: 'heaven_blessing',
      name: 'Jade Emperor Blessing',
      description: 'BLESSING FROM THE JADE EMPEROR!',
      emoji: '👑',
      weight: 30,
      rewards: () => ({
        jadeCatnip: 50,
        heavenlySeals: 1
      })
    },
    {
      id: 'cosmic_alignment',
      name: 'Cosmic Alignment',
      description: 'COSMIC ALIGNMENT! All cultivation enhanced!',
      emoji: '🌌',
      weight: 30,
      rewards: () => ({
        temporaryBonus: {
          type: 'all_multiplier',
          value: 1.5,
          duration: 3600000 // 1 hour
        },
        cultivationXP: 100
      })
    }
  ],

  // Special events (5% of events)
  special: [
    {
      id: 'goose_sighting',
      name: 'Goose Sighting',
      description: 'A wild goose was spotted near your sect! HONK!',
      emoji: '🦢',
      weight: 50,
      condition: (gameState) => (gameState.gooseBoops || 0) > 0,
      rewards: () => ({
        gooseFeathers: 5,
        message: 'The goose left some feathers behind...'
      })
    },
    {
      id: 'waifu_gift',
      name: 'Waifu Gift',
      description: 'One of your waifus left a gift while you were away!',
      emoji: '💕',
      weight: 50,
      condition: (gameState, systems) => {
        const waifuSystem = systems?.waifuSystem || window.waifuSystem;
        return waifuSystem?.getUnlockedWaifus?.()?.length > 0;
      },
      rewards: () => ({
        waifuTokens: 5,
        happiness: 20
      })
    }
  ]
};

// =============================================================================
// IDLE SYSTEM CLASS
// =============================================================================

/**
 * IdleSystem - Manages all AFK/offline calculations
 */
class IdleSystem {
  constructor() {
    this.MAX_AFK_TIME = IDLE_CONSTANTS.MAX_AFK_TIME;
    this.lastActiveTime = Date.now();
    this.lastUpdateTime = Date.now();
    this.isIdle = false;
    this.idleStartTime = null;
    this.accumulatedIdleTime = 0;
    this.pendingRewards = null;
  }

  /**
   * Main AFK gain calculation
   * @param {number} lastSaveTime - Timestamp of last save
   * @param {Object} gameState - Current game state
   * @param {Object} systems - Game systems (masterSystem, catSystem, etc.)
   * @returns {Object} AFK gains summary
   */
  calculateAFKGains(lastSaveTime, gameState, systems = {}) {
    const now = Date.now();
    const elapsed = Math.min(now - lastSaveTime, this.MAX_AFK_TIME);

    // Skip if less than minimum AFK time
    if (elapsed < IDLE_CONSTANTS.MIN_AFK_TIME) {
      return null;
    }

    const seconds = elapsed / 1000;
    const hours = elapsed / (1000 * 60 * 60);

    // Get systems with fallbacks
    const masterSystem = systems.masterSystem || window.masterSystem;
    const catSystem = systems.catSystem || window.catSystem;
    const waifuSystem = systems.waifuSystem || window.waifuSystem;
    const upgradeSystem = systems.upgradeSystem || window.upgradeSystem;
    const gooseSystem = systems.gooseSystem || window.gooseSystem;
    const buildingSystem = systems.buildingSystem || window.buildingSystem;

    // Calculate base PP from cats
    const masterEffects = masterSystem?.getPassiveEffects?.(gameState) || {};
    let basePPPerSecond = catSystem?.calculatePPPerSecond?.(masterEffects) || 0;

    // Apply AFK efficiency
    basePPPerSecond *= IDLE_CONSTANTS.AFK_EFFICIENCY;

    // Apply master AFK bonus (Steve's Eternal Flow = 2x)
    const masterAFKMultiplier = masterEffects.afkMultiplier || 1.0;
    basePPPerSecond *= masterAFKMultiplier;

    // Apply waifu bonuses (Luna = 1.5x AFK)
    const waifuBonuses = waifuSystem?.getCombinedBonuses?.() || {};
    const waifuAFKMultiplier = waifuBonuses.afkMultiplier || 1.0;
    const waifuPPMultiplier = waifuBonuses.ppMultiplier || 1.0;
    basePPPerSecond *= waifuAFKMultiplier * waifuPPMultiplier;

    // Apply goose ally bonus (Honk Goose = 1.25x)
    const gooseAlly = gooseSystem?.getActiveAlly?.() || gameState.gooseAlly;
    let gooseMultiplier = 1.0;
    if (gooseAlly?.effect?.ppGenerationBonus) {
      gooseMultiplier = gooseAlly.effect.ppGenerationBonus;
    } else if (gooseAlly?.id === 'honk' || gooseAlly?.type === 'honk') {
      gooseMultiplier = 1.25;
    }
    basePPPerSecond *= gooseMultiplier;

    // Apply upgrade bonuses
    const upgradeEffects = upgradeSystem?.getCombinedEffects?.() || {};
    const upgradePPMultiplier = upgradeEffects.ppMultiplier || 1.0;
    const upgradeAFKMultiplier = upgradeEffects.afkMultiplier || 1.0;
    basePPPerSecond *= upgradePPMultiplier * upgradeAFKMultiplier;

    // Apply building bonuses
    const buildingEffects = buildingSystem?.getActiveEffects?.() || {};
    const buildingAFKBonus = 1 + (buildingEffects.idlePPBonus || 0);
    basePPPerSecond *= buildingAFKBonus;

    // Calculate total PP
    const totalPP = basePPPerSecond * seconds;

    // Calculate passive BP from upgrades/buildings
    const passiveBPPerSecond = upgradeEffects.passiveBpPerSecond || 0;
    const totalBP = passiveBPPerSecond * seconds;

    // Generate AFK events
    const events = this.generateAFKEvents(elapsed, gameState, systems);

    // Calculate event rewards
    let eventRewards = {
      bp: 0,
      pp: 0,
      jadeCatnip: 0,
      spiritStones: 0,
      gooseFeathers: 0,
      waifuTokens: 0,
      heavenlySeals: 0,
      happiness: 0,
      cultivationXP: 0,
      temporaryBonuses: []
    };

    for (const event of events) {
      const rewards = event.calculatedRewards || {};
      eventRewards.bp += rewards.bp || 0;
      eventRewards.pp += rewards.pp || 0;
      eventRewards.jadeCatnip += rewards.jadeCatnip || 0;
      eventRewards.spiritStones += rewards.spiritStones || 0;
      eventRewards.gooseFeathers += rewards.gooseFeathers || 0;
      eventRewards.waifuTokens += rewards.waifuTokens || 0;
      eventRewards.heavenlySeals += rewards.heavenlySeals || 0;
      eventRewards.happiness += rewards.happiness || 0;
      eventRewards.cultivationXP += rewards.cultivationXP || 0;
      if (rewards.temporaryBonus) {
        eventRewards.temporaryBonuses.push(rewards.temporaryBonus);
      }
    }

    // Calculate happiness decay
    const happinessDecay = hours * IDLE_CONSTANTS.HAPPINESS_DECAY_RATE;

    // Generate summary
    const summary = this.generateReturnSummary(totalPP + eventRewards.pp, events, masterSystem, elapsed);

    return {
      timeAway: elapsed,
      timeAwayFormatted: this.formatTime(elapsed),
      pp: totalPP,
      bp: totalBP,
      events: events,
      eventRewards: eventRewards,
      happinessDecay: happinessDecay,
      summary: summary,
      multipliers: {
        master: masterAFKMultiplier,
        waifu: waifuAFKMultiplier * waifuPPMultiplier,
        goose: gooseMultiplier,
        upgrade: upgradePPMultiplier * upgradeAFKMultiplier,
        building: buildingAFKBonus
      }
    };
  }

  /**
   * Generate random events that occurred while AFK
   * @param {number} elapsed - Time elapsed in ms
   * @param {Object} gameState - Current game state
   * @param {Object} systems - Game systems
   * @returns {Array} Array of events
   */
  generateAFKEvents(elapsed, gameState, systems = {}) {
    const events = [];
    const hours = elapsed / (1000 * 60 * 60);

    // Get master bonus for event discovery
    const masterSystem = systems.masterSystem || window.masterSystem;
    const masterEffects = masterSystem?.getPassiveEffects?.(gameState) || {};
    const eventBonus = masterEffects.eventDiscoveryBonus || 1.0;

    // Calculate number of event rolls based on hours
    const eventRolls = Math.floor(hours) + (Math.random() < (hours % 1) ? 1 : 0);

    for (let i = 0; i < eventRolls; i++) {
      // Check if an event occurs
      if (Math.random() < IDLE_CONSTANTS.EVENT_BASE_CHANCE * eventBonus) {
        const event = this.rollEvent(gameState, systems);
        if (event) {
          events.push(event);
        }
      }
    }

    // Check for stray cat event (Andrew's bonus helps)
    const catSystem = systems.catSystem || window.catSystem;
    const rareCatBonus = masterEffects.rareCatBonus || 1.0;
    const strayCatChance = IDLE_CONSTANTS.STRAY_CAT_BASE_CHANCE * hours * rareCatBonus;

    if (Math.random() < strayCatChance) {
      const catCount = catSystem?.getCatCount?.() || 0;
      if (catCount < 100) { // Only if under cat cap
        events.push({
          id: 'stray_cat',
          name: 'Stray Cat Arrived',
          description: 'A wandering cat has joined your sect!',
          emoji: '🐱',
          rarity: 'rare',
          calculatedRewards: {
            newCat: true
          }
        });
      }
    }

    return events;
  }

  /**
   * Roll for a random event
   * @param {Object} gameState - Current game state
   * @param {Object} systems - Game systems
   * @returns {Object|null} Event object or null
   */
  rollEvent(gameState, systems) {
    // Determine rarity tier
    const rarityRoll = Math.random() * 100;
    let eventPool;
    let rarity;

    if (rarityRoll < 5) {
      eventPool = AFK_EVENTS.special;
      rarity = 'special';
    } else if (rarityRoll < 15) {
      eventPool = AFK_EVENTS.legendary;
      rarity = 'legendary';
    } else if (rarityRoll < 40) {
      eventPool = AFK_EVENTS.rare;
      rarity = 'rare';
    } else {
      eventPool = AFK_EVENTS.common;
      rarity = 'common';
    }

    // Filter by conditions
    const validEvents = eventPool.filter(e =>
      !e.condition || e.condition(gameState, systems)
    );

    if (validEvents.length === 0) {
      // Fall back to common events
      eventPool = AFK_EVENTS.common;
      rarity = 'common';
    }

    // Weighted random selection
    const totalWeight = validEvents.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const event of validEvents) {
      roll -= event.weight;
      if (roll <= 0) {
        // Calculate rewards
        const rewards = event.rewards ? event.rewards(gameState) : {};

        return {
          id: event.id,
          name: event.name,
          description: event.description,
          emoji: event.emoji,
          rarity: rarity,
          calculatedRewards: rewards
        };
      }
    }

    return null;
  }

  /**
   * Generate welcome back summary message
   * @param {number} pp - PP gained
   * @param {Array} events - Events that occurred
   * @param {Object} masterSystem - Master system
   * @param {number} elapsed - Time elapsed in ms
   * @returns {Object} Summary object
   */
  generateReturnSummary(pp, events, masterSystem, elapsed) {
    const master = masterSystem?.selectedMaster;
    const timeStr = this.formatTime(elapsed);
    const quote = masterSystem?.getRandomQuote?.() || 'Welcome back, cultivator!';

    // Count event rarities
    const rarityCount = {
      common: events.filter(e => e.rarity === 'common').length,
      rare: events.filter(e => e.rarity === 'rare').length,
      legendary: events.filter(e => e.rarity === 'legendary').length,
      special: events.filter(e => e.rarity === 'special').length
    };

    // Find special events
    const specialEvents = events.filter(e =>
      e.rarity === 'legendary' ||
      e.rarity === 'special' ||
      e.id === 'stray_cat'
    );

    return {
      title: `Welcome back, ${master?.name || 'Cultivator'}!`,
      subtitle: master?.title || 'of the Celestial Snoot Sect',
      quote: quote,
      timeAway: timeStr,
      ppGained: pp,
      ppFormatted: this.formatNumber(pp),
      eventCount: events.length,
      rarityCount: rarityCount,
      specialEvents: specialEvents,
      hasLegendary: rarityCount.legendary > 0 || rarityCount.special > 0
    };
  }

  /**
   * Check if player is currently idle
   * @returns {boolean} Whether player is idle
   */
  checkIdleStatus() {
    const now = Date.now();
    const timeSinceActive = now - this.lastActiveTime;

    if (timeSinceActive >= IDLE_CONSTANTS.IDLE_THRESHOLD) {
      if (!this.isIdle) {
        this.isIdle = true;
        this.idleStartTime = this.lastActiveTime;
      }
      return true;
    }

    this.isIdle = false;
    this.idleStartTime = null;
    return false;
  }

  /**
   * Record player activity (resets idle timer)
   */
  recordActivity() {
    const wasIdle = this.isIdle;
    const idleDuration = wasIdle ? Date.now() - this.idleStartTime : 0;

    this.lastActiveTime = Date.now();
    this.isIdle = false;
    this.idleStartTime = null;

    if (wasIdle && idleDuration > IDLE_CONSTANTS.MIN_AFK_TIME) {
      this.accumulatedIdleTime += idleDuration;
    }
  }

  /**
   * Process return from idle/AFK
   * @param {Object} gameState - Current game state
   * @param {Object} systems - Game systems
   * @returns {Object|null} AFK gains or null if not applicable
   */
  onReturnFromIdle(gameState, systems = {}) {
    if (!this.isIdle || !this.idleStartTime) {
      return null;
    }

    const gains = this.calculateAFKGains(this.idleStartTime, gameState, systems);
    this.recordActivity();

    return gains;
  }

  /**
   * Get current idle duration
   * @returns {number} Idle duration in ms, or 0 if not idle
   */
  getIdleDuration() {
    if (!this.isIdle || !this.idleStartTime) {
      return 0;
    }
    return Date.now() - this.idleStartTime;
  }

  /**
   * Get total accumulated idle time
   * @returns {number} Total idle time in ms
   */
  getTotalIdleTime() {
    return this.accumulatedIdleTime + this.getIdleDuration();
  }

  /**
   * Apply AFK gains to game state
   * @param {Object} gains - AFK gains object
   * @param {Object} gameState - Game state to modify
   * @param {Object} systems - Game systems
   */
  applyGains(gains, gameState, systems = {}) {
    if (!gains) return;

    // Apply PP
    gameState.purrPower = (gameState.purrPower || 0) + gains.pp;

    // Apply BP
    gameState.boopPoints = (gameState.boopPoints || 0) + gains.bp;

    // Apply event rewards
    const rewards = gains.eventRewards;
    if (rewards) {
      gameState.boopPoints += rewards.bp || 0;
      gameState.purrPower += rewards.pp || 0;
      gameState.jadeCatnip = (gameState.jadeCatnip || 0) + (rewards.jadeCatnip || 0);
      gameState.spiritStones = (gameState.spiritStones || 0) + (rewards.spiritStones || 0);
      gameState.gooseFeathers = (gameState.gooseFeathers || 0) + (rewards.gooseFeathers || 0);
      gameState.waifuTokens = (gameState.waifuTokens || 0) + (rewards.waifuTokens || 0);
      gameState.heavenlySeals = (gameState.heavenlySeals || 0) + (rewards.heavenlySeals || 0);

      // Apply happiness to cats
      if (rewards.happiness > 0) {
        const catSystem = systems.catSystem || window.catSystem;
        catSystem?.boostHappiness?.(rewards.happiness);
      }

      // Apply cultivation XP
      if (rewards.cultivationXP > 0) {
        const cultivationSystem = systems.cultivationSystem || window.cultivationSystem;
        cultivationSystem?.addXP?.(rewards.cultivationXP);
      }

      // Apply temporary bonuses
      if (rewards.temporaryBonuses?.length > 0) {
        for (const bonus of rewards.temporaryBonuses) {
          this.applyTemporaryBonus(bonus, gameState);
        }
      }
    }

    // Apply happiness decay
    if (gains.happinessDecay > 0) {
      const catSystem = systems.catSystem || window.catSystem;
      const cats = catSystem?.getAllCats?.() || [];
      for (const cat of cats) {
        cat.happiness = Math.max(0, (cat.happiness || 100) - gains.happinessDecay);
      }
    }

    // Handle stray cat event
    for (const event of gains.events) {
      if (event.calculatedRewards?.newCat) {
        const catSystem = systems.catSystem || window.catSystem;
        catSystem?.recruitCat?.();
      }
    }

    // Track AFK time
    gameState.totalAfkTime = (gameState.totalAfkTime || 0) + gains.timeAway;
  }

  /**
   * Apply a temporary bonus
   * @param {Object} bonus - Bonus object
   * @param {Object} gameState - Game state
   */
  applyTemporaryBonus(bonus, gameState) {
    if (!gameState.temporaryBonuses) {
      gameState.temporaryBonuses = [];
    }

    gameState.temporaryBonuses.push({
      type: bonus.type,
      value: bonus.value,
      expiresAt: Date.now() + (bonus.duration || 3600000)
    });
  }

  /**
   * Format time duration for display
   * @param {number} ms - Milliseconds
   * @returns {string} Formatted time string
   */
  formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Format large numbers for display
   * @param {number} n - Number to format
   * @returns {string} Formatted number string
   */
  formatNumber(n) {
    if (n === null || n === undefined) return '0';
    if (n < 1000) return Math.floor(n).toString();

    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qi', 'Sx', 'Sp', 'Oc'];
    const tier = Math.min(Math.floor(Math.log10(Math.abs(n)) / 3), suffixes.length - 1);

    if (tier === 0) return Math.floor(n).toString();

    const scaled = n / Math.pow(10, tier * 3);
    return scaled.toFixed(1) + suffixes[tier];
  }

  /**
   * Serialize idle system state for saving
   * @returns {Object} Serialized state
   */
  serialize() {
    return {
      lastActiveTime: this.lastActiveTime,
      accumulatedIdleTime: this.accumulatedIdleTime
    };
  }

  /**
   * Deserialize idle system state from save
   * @param {Object} data - Saved data
   */
  deserialize(data) {
    if (data) {
      this.lastActiveTime = data.lastActiveTime || Date.now();
      this.accumulatedIdleTime = data.accumulatedIdleTime || 0;
    }
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

// Export constants
window.IDLE_CONSTANTS = IDLE_CONSTANTS;
window.AFK_EVENTS = AFK_EVENTS;

// Export class
window.IdleSystem = IdleSystem;
