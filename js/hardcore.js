/**
 * hardcore.js - Hardcore Challenge Modes
 * "For those who crave suffering"
 */

const HARDCORE_MODES = {
  ironman: {
    id: 'ironman',
    name: 'Ironman Mode',
    emoji: '💀',
    description: 'One save. No backups. Permadeath for cats.',
    rules: [
      'Single save file - no backups',
      'Cats that die are GONE FOREVER',
      'No prestige/ascension',
      'No revives in dungeons'
    ],
    modifiers: {
      permadeath: true,
      noPrestige: true,
      noRevive: true,
      singleSave: true
    },
    rewards: {
      badge: 'ironman_survivor',
      title: 'The Ironman',
      cosmetics: ['dark_aura', 'skull_collar']
    }
  },

  no_boop: {
    id: 'no_boop',
    name: 'No-Boop Challenge',
    emoji: '🚫',
    description: 'Cannot manually boop. Rely entirely on auto-systems.',
    rules: [
      'Manual boop button disabled',
      'Must use auto-boop upgrades',
      'Waifus must do all the work',
      'Tests AFK optimization'
    ],
    modifiers: {
      noManualBoop: true
    },
    rewards: {
      badge: 'hands_free',
      title: 'The Lazy Master',
      cosmetics: ['zen_pose']
    }
  },

  one_cat_army: {
    id: 'one_cat_army',
    name: 'One Cat Army',
    emoji: '🐱',
    description: 'Only ONE cat allowed. Ever. Choose wisely.',
    rules: [
      'Can only recruit ONE cat total',
      'That cat must do everything',
      'Cannot recruit more cats',
      'Bond deeply with your chosen one'
    ],
    modifiers: {
      maxCats: 1
    },
    rewards: {
      badge: 'lone_wolf',
      title: 'The One Cat Master',
      cosmetics: ['legendary_bond']
    }
  },

  goose_mode: {
    id: 'goose_mode',
    name: 'Goose Mode',
    emoji: '🦢',
    description: 'You ARE a goose. Cause chaos. Be evil.',
    rules: [
      'Play as a goose',
      'Inverted gameplay',
      'Steal from other players (simulated)',
      'Cause chaos for points'
    ],
    modifiers: {
      playAsGoose: true,
      invertedMorality: true
    },
    rewards: {
      badge: 'chaotic_evil',
      title: 'The Untitled Goose',
      cosmetics: ['goose_crown', 'chaos_trail']
    }
  },

  speed_run: {
    id: 'speed_run',
    name: 'Speed Run',
    emoji: '⚡',
    description: 'Reach Floor 50 as fast as possible.',
    rules: [
      'Timer starts immediately',
      'Goal: Clear Pagoda Floor 50',
      'Leaderboard tracked',
      'No time bonuses'
    ],
    modifiers: {
      timerEnabled: true,
      goal: { type: 'pagodaFloor', target: 50 }
    },
    rewards: {
      badge: 'speedster',
      title: 'The Swift',
      cosmetics: ['blur_effect']
    }
  },

  pacifist: {
    id: 'pacifist',
    name: 'Pacifist Run',
    emoji: '☮️',
    description: 'Never attack. Win through other means.',
    rules: [
      'Cannot use attack abilities',
      'Must heal, shield, or flee',
      'Enemies can still attack you',
      'Find creative solutions'
    ],
    modifiers: {
      noAttack: true
    },
    rewards: {
      badge: 'pacifist',
      title: 'The Peaceful',
      cosmetics: ['peace_aura']
    }
  },

  chaos: {
    id: 'chaos',
    name: 'Chaos Mode',
    emoji: '🌀',
    description: 'All stats randomized every minute.',
    rules: [
      'Your stats change randomly',
      'Enemy stats change randomly',
      'Embrace the chaos',
      'Nothing is predictable'
    ],
    modifiers: {
      chaosMode: true,
      statRandomizationInterval: 60000
    },
    rewards: {
      badge: 'chaos_master',
      title: 'The Chaotic',
      cosmetics: ['glitch_effect']
    }
  }
};

/**
 * HardcoreSystem - Manages challenge modes
 */
class HardcoreSystem {
  constructor() {
    this.activeMode = null;
    this.modeStartTime = null;
    this.modeBestTimes = {};

    this.completedModes = [];
    this.unlockedBadges = [];
    this.unlockedTitles = [];
    this.unlockedCosmetics = [];

    this.currentRunStats = {
      startTime: null,
      deaths: 0,
      boops: 0,
      floorsCleared: 0,
      goosesCaused: 0
    };

    this.stats = {
      ironmanAttempts: 0,
      ironmanCompletions: 0,
      noBoopCompletions: 0,
      oneCatCompletions: 0,
      gooseModeScore: 0,
      fastestSpeedRun: Infinity,
      pacifistFloors: 0
    };
  }

  /**
   * Start a hardcore mode
   */
  startMode(modeId) {
    const mode = HARDCORE_MODES[modeId];
    if (!mode) return false;

    // Can't start if already in a mode
    if (this.activeMode) return false;

    this.activeMode = mode;
    this.modeStartTime = Date.now();

    this.currentRunStats = {
      startTime: Date.now(),
      deaths: 0,
      boops: 0,
      floorsCleared: 0,
      goosesCaused: 0
    };

    // Track attempts
    if (modeId === 'ironman') {
      this.stats.ironmanAttempts++;
    }

    console.log(`[HARDCORE] Started ${mode.name}!`);

    return true;
  }

  /**
   * End current hardcore mode (success or failure)
   */
  endMode(success = false) {
    if (!this.activeMode) return null;

    const mode = this.activeMode;
    const duration = Date.now() - this.modeStartTime;

    const result = {
      mode: mode,
      success: success,
      duration: duration,
      stats: { ...this.currentRunStats }
    };

    if (success) {
      // Grant rewards
      this.completedModes.push(mode.id);
      this.unlockedBadges.push(mode.rewards.badge);
      this.unlockedTitles.push(mode.rewards.title);
      this.unlockedCosmetics.push(...mode.rewards.cosmetics);

      // Update best times
      if (!this.modeBestTimes[mode.id] || duration < this.modeBestTimes[mode.id]) {
        this.modeBestTimes[mode.id] = duration;
      }

      // Update stats
      if (mode.id === 'ironman') this.stats.ironmanCompletions++;
      if (mode.id === 'no_boop') this.stats.noBoopCompletions++;
      if (mode.id === 'one_cat_army') this.stats.oneCatCompletions++;
      if (mode.id === 'speed_run' && duration < this.stats.fastestSpeedRun) {
        this.stats.fastestSpeedRun = duration;
      }

      result.rewards = mode.rewards;
    }

    this.activeMode = null;
    this.modeStartTime = null;

    return result;
  }

  /**
   * Check if mode conditions are met
   */
  checkModeCompletion() {
    if (!this.activeMode) return false;

    const mode = this.activeMode;

    // Check goal conditions
    if (mode.modifiers.goal) {
      if (mode.modifiers.goal.type === 'pagodaFloor') {
        if (window.pagodaSystem && window.pagodaSystem.highestFloor >= mode.modifiers.goal.target) {
          return true;
        }
      }
    }

    // Ironman: Must reach certain milestone
    if (mode.id === 'ironman') {
      // Considered complete if floor 100 reached
      if (window.pagodaSystem && window.pagodaSystem.highestFloor >= 100) {
        return true;
      }
    }

    return false;
  }

  /**
   * Apply mode modifiers to game
   */
  applyModifiers() {
    if (!this.activeMode) return {};

    return this.activeMode.modifiers;
  }

  /**
   * Check if action is allowed in current mode
   */
  isActionAllowed(action) {
    if (!this.activeMode) return true;

    const mods = this.activeMode.modifiers;

    if (action === 'manualBoop' && mods.noManualBoop) return false;
    if (action === 'attack' && mods.noAttack) return false;
    if (action === 'recruitCat' && mods.maxCats && window.catSystem) {
      if (window.catSystem.getCatCount() >= mods.maxCats) return false;
    }
    if (action === 'prestige' && mods.noPrestige) return false;
    if (action === 'revive' && mods.noRevive) return false;

    return true;
  }

  /**
   * Handle cat death in hardcore modes
   */
  onCatDeath(cat) {
    if (!this.activeMode) return;

    this.currentRunStats.deaths++;

    // Ironman: Permadeath
    if (this.activeMode.modifiers.permadeath) {
      // Cat is gone forever - handled by cat system
      console.log(`[HARDCORE] ${cat.name} has died permanently!`);
    }
  }

  /**
   * Record a boop
   */
  onBoop() {
    if (this.activeMode) {
      this.currentRunStats.boops++;
    }
  }

  /**
   * Record floor clear
   */
  onFloorCleared() {
    if (this.activeMode) {
      this.currentRunStats.floorsCleared++;

      // Check completion
      if (this.checkModeCompletion()) {
        this.endMode(true);
      }
    }
  }

  /**
   * Goose mode: record chaos caused
   */
  onGooseChaos() {
    if (this.activeMode && this.activeMode.id === 'goose_mode') {
      this.currentRunStats.goosesCaused++;
      this.stats.gooseModeScore += 10;
    }
  }

  /**
   * Apply chaos mode randomization
   */
  applyChaosRandomization() {
    if (!this.activeMode || !this.activeMode.modifiers.chaosMode) return null;

    return {
      bpMultiplier: 0.5 + Math.random() * 2,
      ppMultiplier: 0.5 + Math.random() * 2,
      critChance: Math.random() * 0.5,
      critMultiplier: 5 + Math.random() * 20
    };
  }

  /**
   * Get available modes
   */
  getAvailableModes() {
    return Object.values(HARDCORE_MODES).map(mode => ({
      ...mode,
      completed: this.completedModes.includes(mode.id),
      bestTime: this.modeBestTimes[mode.id] || null
    }));
  }

  /**
   * Get current mode status
   */
  getCurrentModeStatus() {
    if (!this.activeMode) return null;

    return {
      mode: this.activeMode,
      duration: Date.now() - this.modeStartTime,
      stats: this.currentRunStats,
      modifiers: this.applyModifiers()
    };
  }

  /**
   * Get unlocked rewards
   */
  getRewards() {
    return {
      badges: this.unlockedBadges,
      titles: this.unlockedTitles,
      cosmetics: this.unlockedCosmetics
    };
  }

  /**
   * Serialize
   */
  serialize() {
    return {
      completedModes: this.completedModes,
      unlockedBadges: this.unlockedBadges,
      unlockedTitles: this.unlockedTitles,
      unlockedCosmetics: this.unlockedCosmetics,
      modeBestTimes: this.modeBestTimes,
      stats: this.stats
    };
  }

  /**
   * Deserialize
   */
  deserialize(data) {
    if (data.completedModes) this.completedModes = data.completedModes;
    if (data.unlockedBadges) this.unlockedBadges = data.unlockedBadges;
    if (data.unlockedTitles) this.unlockedTitles = data.unlockedTitles;
    if (data.unlockedCosmetics) this.unlockedCosmetics = data.unlockedCosmetics;
    if (data.modeBestTimes) this.modeBestTimes = data.modeBestTimes;
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
  }
}

// Export
window.HARDCORE_MODES = HARDCORE_MODES;
window.HardcoreSystem = HardcoreSystem;
