/**
 * sectwar.js - Competitive Features for the Celestial Snoot Sect
 * "The Seven Masters compete not for glory, but for the eternal boop."
 *
 * Weekly Sect Wars, leaderboards, and competitive challenges
 * for the Discord friend group.
 */

// =============================================================================
// WAR CONFIGURATION
// =============================================================================

const WAR_TYPES = {
  boop_count: {
    id: 'boop_count',
    name: 'Boop Championship',
    description: 'Who can boop the most snoots?',
    emoji: '👆',
    duration: 7 * 24 * 60 * 60 * 1000, // 1 week
    getValue: (gameState) => gameState.totalBoops || 0,
    getSessionValue: (sessionStats) => sessionStats.boopsDuringWar || 0,
    reward: {
      winner: { jadeCatnip: 500, title: 'Boop Champion' },
      top3: { jadeCatnip: 200 },
      participant: { jadeCatnip: 50 }
    }
  },
  cats_recruited: {
    id: 'cats_recruited',
    name: 'Cat Collector Challenge',
    description: 'Who can recruit the most cats?',
    emoji: '🐱',
    duration: 7 * 24 * 60 * 60 * 1000,
    getValue: (gameState, systems) => {
      const catSystem = systems?.catSystem || window.catSystem;
      return catSystem?.getCatCount?.() || 0;
    },
    getSessionValue: (sessionStats) => sessionStats.catsRecruitedDuringWar || 0,
    reward: {
      winner: { jadeCatnip: 500, title: 'Master Collector' },
      top3: { jadeCatnip: 200 },
      participant: { jadeCatnip: 50 }
    }
  },
  dungeon_floors: {
    id: 'dungeon_floors',
    name: 'Pagoda Ascension',
    description: 'Who can climb the highest in the Infinite Pagoda?',
    emoji: '🏯',
    duration: 7 * 24 * 60 * 60 * 1000,
    getValue: (gameState, systems) => {
      const pagodaSystem = systems?.pagodaSystem || window.pagodaSystem;
      return pagodaSystem?.getHighestFloor?.() || 0;
    },
    getSessionValue: (sessionStats) => sessionStats.floorsClimbedDuringWar || 0,
    reward: {
      winner: { jadeCatnip: 500, spiritStones: 100, title: 'Pagoda Master' },
      top3: { jadeCatnip: 200, spiritStones: 50 },
      participant: { jadeCatnip: 50 }
    }
  },
  goose_boops: {
    id: 'goose_boops',
    name: 'Goose Hunter',
    description: 'Who can boop the most geese? HONK!',
    emoji: '🦢',
    duration: 7 * 24 * 60 * 60 * 1000,
    getValue: (gameState) => gameState.gooseBoops || 0,
    getSessionValue: (sessionStats) => sessionStats.gooseBoopsDuringWar || 0,
    reward: {
      winner: { jadeCatnip: 500, gooseFeathers: 50, title: 'Goose Slayer' },
      top3: { jadeCatnip: 200, gooseFeathers: 25 },
      participant: { jadeCatnip: 50 }
    }
  },
  cultivation_xp: {
    id: 'cultivation_xp',
    name: 'Cultivation Race',
    description: 'Who can gain the most cultivation XP?',
    emoji: '☯️',
    duration: 7 * 24 * 60 * 60 * 1000,
    getValue: (gameState, systems) => {
      const cultivationSystem = systems?.cultivationSystem || window.cultivationSystem;
      return cultivationSystem?.getTotalXP?.() || gameState.totalCultivationXP || 0;
    },
    getSessionValue: (sessionStats) => sessionStats.cultivationXPDuringWar || 0,
    reward: {
      winner: { jadeCatnip: 500, cultivationXP: 1000, title: 'Supreme Cultivator' },
      top3: { jadeCatnip: 200, cultivationXP: 500 },
      participant: { jadeCatnip: 50 }
    }
  },
  waifu_bonds: {
    id: 'waifu_bonds',
    name: 'Heart Cultivation',
    description: 'Who can gain the most waifu bond points?',
    emoji: '💕',
    duration: 7 * 24 * 60 * 60 * 1000,
    getValue: (gameState, systems) => {
      const waifuSystem = systems?.waifuSystem || window.waifuSystem;
      const waifus = waifuSystem?.getUnlockedWaifus?.() || [];
      return waifus.reduce((sum, w) => sum + (w.bondLevel || 0), 0);
    },
    getSessionValue: (sessionStats) => sessionStats.bondGainedDuringWar || 0,
    reward: {
      winner: { jadeCatnip: 500, waifuTokens: 50, title: 'Heart Champion' },
      top3: { jadeCatnip: 200, waifuTokens: 25 },
      participant: { jadeCatnip: 50 }
    }
  }
};

// =============================================================================
// SECT WAR SYSTEM CLASS
// =============================================================================

/**
 * SectWarSystem - Manages weekly competitive wars between the Seven Masters
 */
class SectWarSystem {
  constructor() {
    this.STORAGE_KEY = 'snoot_sect_wars';
    this.currentWar = null;
    this.warHistory = [];
    this.rankings = {};
    this.sessionStats = {};
    this.load();
  }

  /**
   * Start a new weekly war
   * @param {string} warType - Type of war from WAR_TYPES
   * @param {Object} options - Optional configuration
   * @returns {Object} War object
   */
  startWeeklyWar(warType = null, options = {}) {
    // End any existing war first
    if (this.currentWar && !this.currentWar.ended) {
      this.endWeeklyWar();
    }

    // Random war type if not specified
    if (!warType) {
      const types = Object.keys(WAR_TYPES);
      warType = types[Math.floor(Math.random() * types.length)];
    }

    const warConfig = WAR_TYPES[warType];
    if (!warConfig) {
      return { error: 'Unknown war type' };
    }

    const now = Date.now();
    const duration = options.duration || warConfig.duration;

    this.currentWar = {
      id: `war_${now}`,
      type: warType,
      config: warConfig,
      startTime: now,
      endTime: now + duration,
      participants: {},
      ended: false,
      winners: null
    };

    // Reset session stats
    this.sessionStats = {
      warId: this.currentWar.id,
      boopsDuringWar: 0,
      catsRecruitedDuringWar: 0,
      floorsClimbedDuringWar: 0,
      gooseBoopsDuringWar: 0,
      cultivationXPDuringWar: 0,
      bondGainedDuringWar: 0
    };

    this.save();

    return {
      success: true,
      war: this.currentWar,
      message: `${warConfig.emoji} ${warConfig.name} has begun! May the best master win!`
    };
  }

  /**
   * End the current war and calculate winners
   * @returns {Object} War results
   */
  endWeeklyWar() {
    if (!this.currentWar || this.currentWar.ended) {
      return { error: 'No active war to end' };
    }

    const war = this.currentWar;
    war.ended = true;
    war.endedAt = Date.now();

    // Calculate final standings
    const standings = this.calculateStandings();
    war.finalStandings = standings;

    // Determine winners
    if (standings.length > 0) {
      war.winners = {
        first: standings[0] || null,
        second: standings[1] || null,
        third: standings[2] || null
      };
    }

    // Archive war
    this.warHistory.unshift({
      ...war,
      participants: { ...war.participants }
    });

    // Keep only last 10 wars
    if (this.warHistory.length > 10) {
      this.warHistory = this.warHistory.slice(0, 10);
    }

    // Clear current war
    const results = {
      success: true,
      war: war,
      standings: standings,
      winners: war.winners,
      rewards: this.calculateRewards(standings, war.config)
    };

    this.currentWar = null;
    this.save();

    return results;
  }

  /**
   * Submit a score for the current war
   * @param {string} masterId - Master ID (participant identifier)
   * @param {number} score - Score to submit
   * @param {Object} metadata - Optional metadata
   * @returns {Object} Submission result
   */
  submitScore(masterId, score, metadata = {}) {
    if (!this.currentWar || this.currentWar.ended) {
      return { error: 'No active war' };
    }

    const now = Date.now();
    if (now > this.currentWar.endTime) {
      // War has expired, end it first
      this.endWeeklyWar();
      return { error: 'War has ended' };
    }

    // Get or create participant entry
    if (!this.currentWar.participants[masterId]) {
      this.currentWar.participants[masterId] = {
        masterId: masterId,
        scores: [],
        bestScore: 0,
        lastUpdated: now
      };
    }

    const participant = this.currentWar.participants[masterId];

    // Add score
    participant.scores.push({
      score: score,
      timestamp: now,
      metadata: metadata
    });

    // Update best score
    if (score > participant.bestScore) {
      participant.bestScore = score;
    }

    participant.lastUpdated = now;

    this.save();

    return {
      success: true,
      participant: participant,
      rank: this.getParticipantRank(masterId)
    };
  }

  /**
   * Get current leaderboard/standings
   * @returns {Array} Sorted standings
   */
  getLeaderboard() {
    return this.calculateStandings();
  }

  /**
   * Calculate current standings
   * @returns {Array} Sorted array of participants
   */
  calculateStandings() {
    if (!this.currentWar) return [];

    const participants = Object.values(this.currentWar.participants);

    return participants
      .map(p => ({
        ...p,
        masterInfo: window.MASTERS?.[p.masterId] || window.SECT_MEMBERS?.[p.masterId] || { name: p.masterId }
      }))
      .sort((a, b) => b.bestScore - a.bestScore)
      .map((p, index) => ({
        ...p,
        rank: index + 1
      }));
  }

  /**
   * Get a participant's current rank
   * @param {string} masterId - Master ID
   * @returns {number} Rank (1-indexed) or 0 if not participating
   */
  getParticipantRank(masterId) {
    const standings = this.calculateStandings();
    const index = standings.findIndex(p => p.masterId === masterId);
    return index >= 0 ? index + 1 : 0;
  }

  /**
   * Get war rewards based on placement
   * @param {number} placement - 1, 2, 3, or other
   * @returns {Object} Reward object
   */
  getWarRewards(placement) {
    if (!this.currentWar?.config?.reward) {
      return { jadeCatnip: 0 };
    }

    const rewards = this.currentWar.config.reward;

    if (placement === 1) {
      return rewards.winner || {};
    } else if (placement <= 3) {
      return rewards.top3 || {};
    } else {
      return rewards.participant || {};
    }
  }

  /**
   * Calculate rewards for all participants
   * @param {Array} standings - Final standings
   * @param {Object} warConfig - War configuration
   * @returns {Object} Rewards by master ID
   */
  calculateRewards(standings, warConfig) {
    const rewards = {};

    for (const participant of standings) {
      let reward;

      if (participant.rank === 1) {
        reward = { ...warConfig.reward.winner };
      } else if (participant.rank <= 3) {
        reward = { ...warConfig.reward.top3 };
      } else {
        reward = { ...warConfig.reward.participant };
      }

      rewards[participant.masterId] = {
        rank: participant.rank,
        reward: reward
      };
    }

    return rewards;
  }

  /**
   * Check if war should auto-end
   * @returns {boolean} Whether war was ended
   */
  checkWarExpiration() {
    if (!this.currentWar || this.currentWar.ended) {
      return false;
    }

    if (Date.now() > this.currentWar.endTime) {
      this.endWeeklyWar();
      return true;
    }

    return false;
  }

  /**
   * Get time remaining in current war
   * @returns {number} Milliseconds remaining, or 0
   */
  getTimeRemaining() {
    if (!this.currentWar || this.currentWar.ended) {
      return 0;
    }

    return Math.max(0, this.currentWar.endTime - Date.now());
  }

  /**
   * Format time remaining for display
   * @returns {string} Formatted time string
   */
  getTimeRemainingFormatted() {
    const ms = this.getTimeRemaining();

    if (ms <= 0) return 'Ended';

    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  /**
   * Update session stats (call during gameplay)
   * @param {string} stat - Stat key to update
   * @param {number} amount - Amount to add
   */
  updateSessionStat(stat, amount = 1) {
    if (!this.currentWar || this.currentWar.ended) return;

    if (this.sessionStats[stat] !== undefined) {
      this.sessionStats[stat] += amount;
    }
  }

  /**
   * Get current war status
   * @returns {Object} Status object
   */
  getStatus() {
    if (!this.currentWar) {
      return {
        active: false,
        message: 'No active war. Start one to compete!'
      };
    }

    if (this.currentWar.ended) {
      return {
        active: false,
        ended: true,
        winners: this.currentWar.winners
      };
    }

    const standings = this.calculateStandings();

    return {
      active: true,
      war: this.currentWar,
      type: this.currentWar.type,
      config: this.currentWar.config,
      timeRemaining: this.getTimeRemaining(),
      timeRemainingFormatted: this.getTimeRemainingFormatted(),
      participantCount: Object.keys(this.currentWar.participants).length,
      standings: standings.slice(0, 7), // Top 7 (for the Seven Masters)
      leader: standings[0] || null
    };
  }

  /**
   * Format leaderboard for Discord
   * @returns {string} Discord-formatted leaderboard
   */
  formatForDiscord() {
    if (!this.currentWar) {
      return '**No active Sect War!** Start one with `/sectwar start`';
    }

    const config = this.currentWar.config;
    const standings = this.calculateStandings();
    const medals = ['🥇', '🥈', '🥉'];

    let text = `${config.emoji} **${config.name}**\n`;
    text += `*${config.description}*\n`;
    text += `${'─'.repeat(30)}\n`;
    text += `⏱️ Time Remaining: **${this.getTimeRemainingFormatted()}**\n\n`;

    if (standings.length === 0) {
      text += '*No participants yet!*\n';
    } else {
      for (let i = 0; i < Math.min(standings.length, 7); i++) {
        const p = standings[i];
        const medal = medals[i] || `#${i + 1}`;
        const name = p.masterInfo?.name || p.masterId;
        text += `${medal} **${name}**: ${this.formatNumber(p.bestScore)}\n`;
      }
    }

    text += `\n${'─'.repeat(30)}\n`;
    text += `*Snoot Booper - Sect Wars*`;

    return text;
  }

  /**
   * Format number for display
   * @param {number} n - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(n) {
    if (n === null || n === undefined) return '0';
    if (n < 1000) return Math.floor(n).toString();

    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const tier = Math.min(Math.floor(Math.log10(Math.abs(n)) / 3), suffixes.length - 1);
    return (n / Math.pow(10, tier * 3)).toFixed(1) + suffixes[tier];
  }

  /**
   * Save to localStorage
   */
  save() {
    try {
      const data = {
        currentWar: this.currentWar,
        warHistory: this.warHistory,
        sessionStats: this.sessionStats
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save sect war data:', e);
    }
  }

  /**
   * Load from localStorage
   */
  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        this.currentWar = data.currentWar || null;
        this.warHistory = data.warHistory || [];
        this.sessionStats = data.sessionStats || {};

        // Check if war should have ended
        this.checkWarExpiration();
      }
    } catch (e) {
      console.error('Failed to load sect war data:', e);
    }
  }

  /**
   * Clear all war data
   */
  clear() {
    this.currentWar = null;
    this.warHistory = [];
    this.sessionStats = {};
    this.save();
  }

  /**
   * Export war data for sharing
   * @returns {string} Base64 encoded data
   */
  export() {
    return btoa(JSON.stringify({
      version: '1.0',
      timestamp: Date.now(),
      currentWar: this.currentWar,
      warHistory: this.warHistory.slice(0, 5) // Last 5 wars
    }));
  }

  /**
   * Import war data
   * @param {string} encoded - Base64 encoded data
   * @returns {Object} Import result
   */
  import(encoded) {
    try {
      const data = JSON.parse(atob(encoded));

      if (data.currentWar) {
        this.currentWar = data.currentWar;
      }

      if (data.warHistory) {
        // Merge histories, avoiding duplicates
        const existingIds = new Set(this.warHistory.map(w => w.id));
        for (const war of data.warHistory) {
          if (!existingIds.has(war.id)) {
            this.warHistory.push(war);
          }
        }

        // Sort by start time and keep latest 10
        this.warHistory.sort((a, b) => b.startTime - a.startTime);
        this.warHistory = this.warHistory.slice(0, 10);
      }

      this.save();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

// Export war types
window.WAR_TYPES = WAR_TYPES;

// Export class
window.SectWarSystem = SectWarSystem;
