/**
 * daily.js - Daily Commissions System
 * "Each day brings new tasks for the diligent cultivator."
 */

// Commission Types
const COMMISSION_TYPES = {
  boops: {
    id: 'boops',
    name: 'Boop Master',
    verb: 'Boop',
    unit: 'times',
    emoji: '👆',
    baseTarget: 100,
    scaling: 1.5,
    trackKey: 'boops'
  },
  combo: {
    id: 'combo',
    name: 'Combo King',
    verb: 'Reach a combo of',
    unit: '',
    emoji: '🔥',
    baseTarget: 25,
    scaling: 1.3,
    trackKey: 'combo'
  },
  bp_earned: {
    id: 'bp_earned',
    name: 'Qi Gatherer',
    verb: 'Earn',
    unit: 'BP',
    emoji: '💫',
    baseTarget: 1000,
    scaling: 2.0,
    trackKey: 'bpEarned'
  },
  pp_earned: {
    id: 'pp_earned',
    name: 'Purr Collector',
    verb: 'Earn',
    unit: 'PP',
    emoji: '😺',
    baseTarget: 100,
    scaling: 2.0,
    trackKey: 'ppEarned'
  },
  cats_fed: {
    id: 'cats_fed',
    name: 'Cat Caretaker',
    verb: 'Feed cats',
    unit: 'times',
    emoji: '🐱',
    baseTarget: 5,
    scaling: 1.2,
    trackKey: 'catsFed'
  },
  expeditions: {
    id: 'expeditions',
    name: 'Explorer',
    verb: 'Complete',
    unit: 'expeditions',
    emoji: '🗺️',
    baseTarget: 2,
    scaling: 1.1,
    trackKey: 'expeditions'
  },
  pagoda_floors: {
    id: 'pagoda_floors',
    name: 'Dungeon Delver',
    verb: 'Clear',
    unit: 'pagoda floors',
    emoji: '🏯',
    baseTarget: 5,
    scaling: 1.3,
    trackKey: 'pagodaFloors'
  },
  enemies_defeated: {
    id: 'enemies_defeated',
    name: 'Monster Hunter',
    verb: 'Defeat',
    unit: 'enemies',
    emoji: '⚔️',
    baseTarget: 20,
    scaling: 1.4,
    trackKey: 'enemiesDefeated'
  },
  items_crafted: {
    id: 'items_crafted',
    name: 'Artisan',
    verb: 'Craft',
    unit: 'items',
    emoji: '🔨',
    baseTarget: 3,
    scaling: 1.2,
    trackKey: 'itemsCrafted'
  },
  critical_boops: {
    id: 'critical_boops',
    name: 'Critical Expert',
    verb: 'Land',
    unit: 'critical boops',
    emoji: '💥',
    baseTarget: 10,
    scaling: 1.3,
    trackKey: 'criticalBoops'
  },
  upgrades_purchased: {
    id: 'upgrades_purchased',
    name: 'Scholar',
    verb: 'Purchase',
    unit: 'upgrades',
    emoji: '📖',
    baseTarget: 3,
    scaling: 1.2,
    trackKey: 'upgradesPurchased'
  },
  golden_snoots: {
    id: 'golden_snoots',
    name: 'Fortune Seeker',
    verb: 'Click',
    unit: 'golden snoots',
    emoji: '✨',
    baseTarget: 2,
    scaling: 1.1,
    trackKey: 'goldenSnoots'
  },
  survival_time: {
    id: 'survival_time',
    name: 'Survivor',
    verb: 'Survive for',
    unit: 'minutes',
    emoji: '⏱️',
    baseTarget: 5,
    scaling: 1.2,
    trackKey: 'survivalMinutes'
  },
  materials_gathered: {
    id: 'materials_gathered',
    name: 'Scavenger',
    verb: 'Gather',
    unit: 'materials',
    emoji: '📦',
    baseTarget: 20,
    scaling: 1.5,
    trackKey: 'materialsGathered'
  },
  waifu_gifts: {
    id: 'waifu_gifts',
    name: 'Gift Giver',
    verb: 'Give',
    unit: 'gifts to waifus',
    emoji: '🎁',
    baseTarget: 3,
    scaling: 1.1,
    trackKey: 'waifuGifts'
  }
};

// Reward Tiers based on commission difficulty
const COMMISSION_REWARDS = {
  easy: {
    bp: 100,
    pp: 10
  },
  medium: {
    bp: 300,
    pp: 30,
    materials: 5
  },
  hard: {
    bp: 750,
    pp: 75,
    materials: 15,
    tokens: 2
  }
};

// Streak Bonuses
const STREAK_BONUSES = {
  3: { multiplier: 1.25, description: '3-day streak: +25% rewards' },
  5: { multiplier: 1.5, description: '5-day streak: +50% rewards' },
  7: { multiplier: 2.0, description: '7-day streak: +100% rewards' },
  14: { multiplier: 2.5, description: '14-day streak: +150% rewards' },
  30: { multiplier: 3.0, description: '30-day streak: +200% rewards' }
};

/**
 * DailySystem - Manages daily commissions
 */
class DailySystem {
  constructor() {
    this.commissionTypes = COMMISSION_TYPES;
    this.rewardTiers = COMMISSION_REWARDS;
    this.streakBonuses = STREAK_BONUSES;

    // Current commissions (4 per day)
    this.commissions = [];
    this.commissionsPerDay = 4;

    // Progress tracking (reset daily)
    this.dailyProgress = {};

    // Streak tracking
    this.currentStreak = 0;
    this.lastCompletionDate = null;
    this.allCommissionsCompletedToday = false;

    // Timestamps
    this.lastResetDate = null;
    this.nextResetTime = 0;

    // Statistics
    this.stats = {
      totalCommissionsCompleted: 0,
      longestStreak: 0,
      totalRewardsClaimed: {
        bp: 0,
        pp: 0,
        materials: 0,
        tokens: 0
      }
    };

    // Initialize
    this.checkForReset();
  }

  /**
   * Check if daily reset is needed
   */
  checkForReset() {
    const now = new Date();
    const today = this.getDateString(now);

    if (this.lastResetDate !== today) {
      this.performDailyReset();
    }

    // Calculate next reset time (midnight local)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    this.nextResetTime = tomorrow.getTime();
  }

  /**
   * Perform daily reset
   */
  performDailyReset() {
    const now = new Date();
    const today = this.getDateString(now);
    const yesterday = this.getDateString(new Date(now.getTime() - 86400000));

    // Check streak
    if (this.lastCompletionDate === yesterday) {
      // Continue streak if completed all yesterday
      if (!this.allCommissionsCompletedToday) {
        this.currentStreak = 0;
      }
    } else if (this.lastCompletionDate !== today) {
      // Reset streak if missed a day
      this.currentStreak = 0;
    }

    // Generate new commissions
    this.generateCommissions();

    // Reset daily progress
    this.dailyProgress = {};
    this.allCommissionsCompletedToday = false;

    this.lastResetDate = today;
  }

  /**
   * Generate daily commissions
   */
  generateCommissions() {
    this.commissions = [];

    // Get player progress level (affects commission difficulty)
    const progressLevel = this.getProgressLevel();

    // Pick random commission types
    const types = Object.keys(this.commissionTypes);
    const shuffled = types.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, this.commissionsPerDay);

    for (let i = 0; i < selected.length; i++) {
      const typeId = selected[i];
      const type = this.commissionTypes[typeId];

      // Determine difficulty (1 hard, 1-2 medium, rest easy)
      let difficulty;
      if (i === 0) {
        difficulty = 'hard';
      } else if (i <= 2) {
        difficulty = 'medium';
      } else {
        difficulty = 'easy';
      }

      // Calculate target based on progress and difficulty
      const difficultyMultiplier = { easy: 0.5, medium: 1.0, hard: 2.0 };
      const target = Math.floor(
        type.baseTarget *
        Math.pow(type.scaling, progressLevel) *
        difficultyMultiplier[difficulty]
      );

      this.commissions.push({
        id: `commission_${Date.now()}_${i}`,
        typeId: typeId,
        type: type,
        difficulty: difficulty,
        target: Math.max(1, target),
        progress: 0,
        completed: false,
        claimed: false
      });
    }
  }

  /**
   * Get approximate player progress level
   */
  getProgressLevel() {
    // Based on various game progress indicators
    let level = 0;

    if (window.gameState) {
      level += Math.floor(Math.log10(window.gameState.totalBoops + 1));
      level += Math.floor(Math.log10(window.gameState.boopPoints + 1) / 2);
    }

    if (window.pagodaSystem) {
      level += Math.floor(window.pagodaSystem.highestFloor / 10);
    }

    return Math.min(level, 20); // Cap at 20
  }

  /**
   * Track progress for a commission type
   */
  trackProgress(trackKey, amount = 1) {
    // Update daily progress
    if (!this.dailyProgress[trackKey]) {
      this.dailyProgress[trackKey] = 0;
    }
    this.dailyProgress[trackKey] += amount;

    // Update commission progress
    for (const commission of this.commissions) {
      if (commission.completed) continue;
      if (commission.type.trackKey !== trackKey) continue;

      commission.progress = this.dailyProgress[trackKey];

      // Check for completion
      if (commission.progress >= commission.target) {
        this.completeCommission(commission);
      }
    }
  }

  /**
   * Complete a commission
   */
  completeCommission(commission) {
    if (commission.completed) return;

    commission.completed = true;
    commission.progress = commission.target;

    if (window.audioSystem) {
      window.audioSystem.playSFX('commissionComplete');
    }

    // Check if all completed
    this.checkAllCompleted();
  }

  /**
   * Check if all commissions are completed
   */
  checkAllCompleted() {
    const allCompleted = this.commissions.every(c => c.completed);

    if (allCompleted && !this.allCommissionsCompletedToday) {
      this.allCommissionsCompletedToday = true;
      this.currentStreak++;
      this.lastCompletionDate = this.getDateString(new Date());

      if (this.currentStreak > this.stats.longestStreak) {
        this.stats.longestStreak = this.currentStreak;
      }

      if (window.audioSystem) {
        window.audioSystem.playSFX('streakBonus');
      }
    }
  }

  /**
   * Claim commission reward
   */
  claimReward(commissionId) {
    const commission = this.commissions.find(c => c.id === commissionId);
    if (!commission || !commission.completed || commission.claimed) {
      return null;
    }

    commission.claimed = true;
    this.stats.totalCommissionsCompleted++;

    // Get base rewards
    const baseRewards = { ...this.rewardTiers[commission.difficulty] };

    // Apply streak multiplier
    const streakMultiplier = this.getStreakMultiplier();
    const rewards = {
      bp: Math.floor((baseRewards.bp || 0) * streakMultiplier),
      pp: Math.floor((baseRewards.pp || 0) * streakMultiplier),
      materials: Math.floor((baseRewards.materials || 0) * streakMultiplier),
      tokens: Math.floor((baseRewards.tokens || 0) * streakMultiplier)
    };

    // Track claimed rewards
    this.stats.totalRewardsClaimed.bp += rewards.bp;
    this.stats.totalRewardsClaimed.pp += rewards.pp;
    this.stats.totalRewardsClaimed.materials += rewards.materials || 0;
    this.stats.totalRewardsClaimed.tokens += rewards.tokens || 0;

    return rewards;
  }

  /**
   * Claim all completed commission rewards
   */
  claimAllRewards() {
    const allRewards = {
      bp: 0,
      pp: 0,
      materials: 0,
      tokens: 0
    };

    for (const commission of this.commissions) {
      if (commission.completed && !commission.claimed) {
        const rewards = this.claimReward(commission.id);
        if (rewards) {
          allRewards.bp += rewards.bp;
          allRewards.pp += rewards.pp;
          allRewards.materials += rewards.materials;
          allRewards.tokens += rewards.tokens;
        }
      }
    }

    return allRewards;
  }

  /**
   * Get current streak multiplier
   */
  getStreakMultiplier() {
    let multiplier = 1;

    for (const [days, bonus] of Object.entries(this.streakBonuses)) {
      if (this.currentStreak >= parseInt(days)) {
        multiplier = bonus.multiplier;
      }
    }

    return multiplier;
  }

  /**
   * Get streak description
   */
  getStreakDescription() {
    for (const [days, bonus] of Object.entries(this.streakBonuses).reverse()) {
      if (this.currentStreak >= parseInt(days)) {
        return bonus.description;
      }
    }
    return `${this.currentStreak}-day streak`;
  }

  /**
   * Get time until reset
   */
  getTimeUntilReset() {
    return Math.max(0, this.nextResetTime - Date.now());
  }

  /**
   * Format time remaining
   */
  formatTimeRemaining() {
    const remaining = this.getTimeUntilReset();
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);

    return `${hours}h ${minutes}m`;
  }

  /**
   * Get date string (YYYY-MM-DD)
   */
  getDateString(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get commission status
   */
  getCommissionStatus() {
    return {
      commissions: this.commissions,
      streak: this.currentStreak,
      streakMultiplier: this.getStreakMultiplier(),
      streakDescription: this.getStreakDescription(),
      timeUntilReset: this.getTimeUntilReset(),
      allCompleted: this.allCommissionsCompletedToday
    };
  }

  /**
   * Update (call periodically)
   */
  update(deltaTime) {
    // Check for daily reset
    if (Date.now() >= this.nextResetTime) {
      this.checkForReset();
    }
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      commissions: this.commissions,
      dailyProgress: this.dailyProgress,
      currentStreak: this.currentStreak,
      lastCompletionDate: this.lastCompletionDate,
      lastResetDate: this.lastResetDate,
      allCommissionsCompletedToday: this.allCommissionsCompletedToday,
      stats: this.stats
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.commissions) this.commissions = data.commissions;
    if (data.dailyProgress) this.dailyProgress = data.dailyProgress;
    if (data.currentStreak !== undefined) this.currentStreak = data.currentStreak;
    if (data.lastCompletionDate) this.lastCompletionDate = data.lastCompletionDate;
    if (data.lastResetDate) this.lastResetDate = data.lastResetDate;
    if (data.allCommissionsCompletedToday !== undefined) {
      this.allCommissionsCompletedToday = data.allCommissionsCompletedToday;
    }
    if (data.stats) this.stats = { ...this.stats, ...data.stats };

    // Check for reset after loading
    this.checkForReset();
  }

  /**
   * Reset system
   */
  reset() {
    this.commissions = [];
    this.dailyProgress = {};
    this.currentStreak = 0;
    this.lastCompletionDate = null;
    this.lastResetDate = null;
    this.allCommissionsCompletedToday = false;
    this.stats = {
      totalCommissionsCompleted: 0,
      longestStreak: 0,
      totalRewardsClaimed: {
        bp: 0,
        pp: 0,
        materials: 0,
        tokens: 0
      }
    };
    this.checkForReset();
  }
}

// Export
window.COMMISSION_TYPES = COMMISSION_TYPES;
window.COMMISSION_REWARDS = COMMISSION_REWARDS;
window.STREAK_BONUSES = STREAK_BONUSES;
window.DailySystem = DailySystem;
