/**
 * golden-snoot.js - Golden Snoot Click Events (Cookie Clicker style)
 * "When fortune smiles, the golden snoot appears."
 */

// Golden Snoot Event Types
const GOLDEN_SNOOT_EVENTS = {
  boop_frenzy: {
    id: 'boop_frenzy',
    name: 'Boop Frenzy',
    emoji: '🤯',
    description: '7x BP for 77 seconds!',
    duration: 77000,
    effect: { bpMultiplier: 7 },
    weight: 25,
    color: '#FF6B6B'
  },
  lucky_snoot: {
    id: 'lucky_snoot',
    name: 'Lucky Snoot',
    emoji: '🍀',
    description: 'Gain 13% of your total BP!',
    duration: 0, // Instant
    effect: { bpPercentBonus: 0.13 },
    weight: 20,
    color: '#4ECB71'
  },
  click_storm: {
    id: 'click_storm',
    name: 'Click Storm',
    emoji: '⚡',
    description: 'Next 777 boops worth 777x each!',
    duration: 0, // Until clicks used
    effect: { superBoops: 777, superMultiplier: 777 },
    weight: 10,
    color: '#FFE66D'
  },
  catnip_rain: {
    id: 'catnip_rain',
    name: 'Catnip Rain',
    emoji: '🌧️',
    description: 'Bonus resources rain from the sky!',
    duration: 30000,
    effect: { resourceRain: true },
    weight: 15,
    color: '#A8E6CF'
  },
  golden_hour: {
    id: 'golden_hour',
    name: 'Golden Hour',
    emoji: '🌅',
    description: 'All production doubled for 1 hour!',
    duration: 3600000,
    effect: { productionMultiplier: 2 },
    weight: 8,
    color: '#FFD93D'
  },
  mega_crit: {
    id: 'mega_crit',
    name: 'Mega Crit',
    emoji: '💥',
    description: 'Next 100 boops are guaranteed crits!',
    duration: 0,
    effect: { guaranteedCrits: 100 },
    weight: 18,
    color: '#C9184A'
  },
  time_warp: {
    id: 'time_warp',
    name: 'Time Warp',
    emoji: '⏰',
    description: 'Instant 1 hour of offline progress!',
    duration: 0,
    effect: { offlineProgress: 3600000 },
    weight: 5,
    color: '#845EC2'
  },
  jackpot: {
    id: 'jackpot',
    name: 'JACKPOT',
    emoji: '🎰',
    description: 'Random massive resource bonus!',
    duration: 0,
    effect: { jackpot: true },
    weight: 3,
    color: '#FF9671'
  }
};

/**
 * GoldenSnootSystem - Manages golden click events
 */
class GoldenSnootSystem {
  constructor() {
    this.events = GOLDEN_SNOOT_EVENTS;

    // Spawn timing
    this.minSpawnInterval = 180000; // 3 minutes minimum
    this.maxSpawnInterval = 600000; // 10 minutes maximum
    this.nextSpawnTime = 0;
    this.spawnChancePerSecond = 0.001; // 0.1% per second base

    // Current golden snoot
    this.activeSnoot = null;
    this.snootPosition = { x: 0, y: 0 };
    this.snootLifetime = 10000; // 10 seconds to click
    this.snootSpawnedAt = 0;

    // Active effects
    this.activeEffects = [];

    // Click storm / mega crit counters
    this.remainingSuperBoops = 0;
    this.superBoopMultiplier = 1;
    this.remainingGuaranteedCrits = 0;

    // Statistics
    this.stats = {
      totalClicked: 0,
      totalMissed: 0,
      effectsTriggered: {},
      totalBpFromGolden: 0
    };

    // Initialize next spawn time
    this.scheduleNextSpawn();
  }

  /**
   * Schedule next golden snoot spawn
   */
  scheduleNextSpawn() {
    const interval = this.minSpawnInterval +
      Math.random() * (this.maxSpawnInterval - this.minSpawnInterval);
    this.nextSpawnTime = Date.now() + interval;
  }

  /**
   * Update system (call every frame/tick)
   */
  update(deltaTime) {
    const now = Date.now();

    // Check if should spawn new golden snoot
    if (!this.activeSnoot && now >= this.nextSpawnTime) {
      // Additional random chance check
      if (Math.random() < this.spawnChancePerSecond * (deltaTime / 1000) * 100) {
        this.spawnGoldenSnoot();
      }
    }

    // Check if active snoot expired
    if (this.activeSnoot && now > this.snootSpawnedAt + this.snootLifetime) {
      this.missGoldenSnoot();
    }

    // Update active effects
    this.updateActiveEffects(deltaTime);

    // Resource rain effect
    this.updateResourceRain(deltaTime);
  }

  /**
   * Spawn a golden snoot
   */
  spawnGoldenSnoot() {
    // Pick random event
    const totalWeight = Object.values(this.events).reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * totalWeight;
    let selectedEvent = null;

    for (const event of Object.values(this.events)) {
      roll -= event.weight;
      if (roll <= 0) {
        selectedEvent = event;
        break;
      }
    }

    if (!selectedEvent) return;

    // Random position (within visible area)
    this.snootPosition = {
      x: 100 + Math.random() * 600,
      y: 100 + Math.random() * 400
    };

    this.activeSnoot = selectedEvent;
    this.snootSpawnedAt = Date.now();

    if (window.audioSystem) {
      window.audioSystem.playSFX('goldenSpawn');
    }

    // Schedule next spawn
    this.scheduleNextSpawn();
  }

  /**
   * Click the golden snoot
   */
  clickGoldenSnoot() {
    if (!this.activeSnoot) return null;

    const event = this.activeSnoot;
    this.activeSnoot = null;

    this.stats.totalClicked++;
    if (!this.stats.effectsTriggered[event.id]) {
      this.stats.effectsTriggered[event.id] = 0;
    }
    this.stats.effectsTriggered[event.id]++;

    // Activate effect
    const result = this.activateEffect(event);

    if (window.audioSystem) {
      window.audioSystem.playSFX('goldenClick');
    }

    return result;
  }

  /**
   * Miss the golden snoot
   */
  missGoldenSnoot() {
    if (!this.activeSnoot) return;

    this.activeSnoot = null;
    this.stats.totalMissed++;
  }

  /**
   * Activate a golden snoot effect
   */
  activateEffect(event) {
    const effect = event.effect;
    const result = {
      event,
      rewards: {}
    };

    // Instant effects
    if (effect.bpPercentBonus) {
      // Lucky Snoot - gain % of total BP
      const bonus = Math.floor(window.gameState?.boopPoints * effect.bpPercentBonus) || 1000;
      result.rewards.bp = bonus;
      this.stats.totalBpFromGolden += bonus;
    }

    if (effect.superBoops) {
      // Click Storm
      this.remainingSuperBoops = effect.superBoops;
      this.superBoopMultiplier = effect.superMultiplier;
    }

    if (effect.guaranteedCrits) {
      // Mega Crit
      this.remainingGuaranteedCrits = effect.guaranteedCrits;
    }

    if (effect.offlineProgress) {
      // Time Warp - grant offline progress
      result.rewards.offlineTime = effect.offlineProgress;
    }

    if (effect.jackpot) {
      // Jackpot - random massive bonus
      const jackpotType = Math.floor(Math.random() * 4);
      switch (jackpotType) {
        case 0:
          result.rewards.bp = Math.floor((window.gameState?.boopPoints || 1000) * 0.5);
          break;
        case 1:
          result.rewards.pp = Math.floor((window.gameState?.purrPower || 100) * 0.5);
          break;
        case 2:
          result.rewards.jadeCatnip = Math.floor(Math.random() * 10) + 5;
          break;
        case 3:
          result.rewards.tokens = Math.floor(Math.random() * 20) + 10;
          break;
      }
      this.stats.totalBpFromGolden += result.rewards.bp || 0;
    }

    // Duration-based effects
    if (event.duration > 0) {
      this.activeEffects.push({
        ...event,
        startTime: Date.now(),
        endTime: Date.now() + event.duration
      });
    }

    return result;
  }

  /**
   * Update active effects
   */
  updateActiveEffects(deltaTime) {
    const now = Date.now();
    this.activeEffects = this.activeEffects.filter(e => e.endTime > now);
  }

  /**
   * Update resource rain effect
   */
  updateResourceRain(deltaTime) {
    const rainEffect = this.activeEffects.find(e => e.effect.resourceRain);
    if (!rainEffect) return;

    // Generate random resources periodically
    // (In actual implementation, would spawn visual falling resources)
    if (Math.random() < 0.1 * (deltaTime / 1000)) {
      // Trigger resource pickup
      if (window.gameState) {
        window.gameState.boopPoints += 10;
      }
    }
  }

  /**
   * Get current BP multiplier from active effects
   */
  getBpMultiplier() {
    let multiplier = 1;

    for (const effect of this.activeEffects) {
      if (effect.effect.bpMultiplier) {
        multiplier *= effect.effect.bpMultiplier;
      }
      if (effect.effect.productionMultiplier) {
        multiplier *= effect.effect.productionMultiplier;
      }
    }

    return multiplier;
  }

  /**
   * Check and consume super boop
   */
  consumeSuperBoop() {
    if (this.remainingSuperBoops > 0) {
      this.remainingSuperBoops--;
      return this.superBoopMultiplier;
    }
    return 1;
  }

  /**
   * Check and consume guaranteed crit
   */
  consumeGuaranteedCrit() {
    if (this.remainingGuaranteedCrits > 0) {
      this.remainingGuaranteedCrits--;
      return true;
    }
    return false;
  }

  /**
   * Get remaining time on active effects
   */
  getActiveEffectsStatus() {
    const now = Date.now();
    return this.activeEffects.map(e => ({
      id: e.id,
      name: e.name,
      emoji: e.emoji,
      color: e.color,
      remainingTime: e.endTime - now,
      totalDuration: e.duration
    }));
  }

  /**
   * Check if golden snoot is active
   */
  isSnootActive() {
    return this.activeSnoot !== null;
  }

  /**
   * Get snoot render data
   */
  getSnootRenderData() {
    if (!this.activeSnoot) return null;

    const now = Date.now();
    const elapsed = now - this.snootSpawnedAt;
    const remaining = this.snootLifetime - elapsed;

    return {
      event: this.activeSnoot,
      position: this.snootPosition,
      remainingTime: remaining,
      progress: 1 - (elapsed / this.snootLifetime)
    };
  }

  /**
   * Force spawn (for testing/cheats)
   */
  forceSpawn(eventId = null) {
    if (eventId && this.events[eventId]) {
      this.snootPosition = {
        x: 100 + Math.random() * 600,
        y: 100 + Math.random() * 400
      };
      this.activeSnoot = this.events[eventId];
      this.snootSpawnedAt = Date.now();
    } else {
      this.nextSpawnTime = 0;
      this.update(0);
    }
  }

  /**
   * Reduce spawn interval (from upgrades)
   */
  reduceSpawnInterval(reduction) {
    this.minSpawnInterval *= (1 - reduction);
    this.maxSpawnInterval *= (1 - reduction);
  }

  /**
   * Increase spawn duration (from upgrades)
   */
  increaseLifetime(bonus) {
    this.snootLifetime += bonus;
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      stats: this.stats,
      remainingSuperBoops: this.remainingSuperBoops,
      superBoopMultiplier: this.superBoopMultiplier,
      remainingGuaranteedCrits: this.remainingGuaranteedCrits,
      minSpawnInterval: this.minSpawnInterval,
      maxSpawnInterval: this.maxSpawnInterval,
      snootLifetime: this.snootLifetime
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
    if (data.remainingSuperBoops) this.remainingSuperBoops = data.remainingSuperBoops;
    if (data.superBoopMultiplier) this.superBoopMultiplier = data.superBoopMultiplier;
    if (data.remainingGuaranteedCrits) this.remainingGuaranteedCrits = data.remainingGuaranteedCrits;
    if (data.minSpawnInterval) this.minSpawnInterval = data.minSpawnInterval;
    if (data.maxSpawnInterval) this.maxSpawnInterval = data.maxSpawnInterval;
    if (data.snootLifetime) this.snootLifetime = data.snootLifetime;

    this.scheduleNextSpawn();
  }

  /**
   * Reset system
   */
  reset() {
    this.activeSnoot = null;
    this.activeEffects = [];
    this.remainingSuperBoops = 0;
    this.superBoopMultiplier = 1;
    this.remainingGuaranteedCrits = 0;
    this.minSpawnInterval = 180000;
    this.maxSpawnInterval = 600000;
    this.snootLifetime = 10000;
    this.stats = {
      totalClicked: 0,
      totalMissed: 0,
      effectsTriggered: {},
      totalBpFromGolden: 0
    };
    this.scheduleNextSpawn();
  }
}

// Export
window.GOLDEN_SNOOT_EVENTS = GOLDEN_SNOOT_EVENTS;
window.GoldenSnootSystem = GoldenSnootSystem;
