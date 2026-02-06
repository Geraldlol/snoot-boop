/**
 * sharing.js - Discord Integration & Save Sharing
 * "The Celestial Snoot Sect shares its glory across realms."
 *
 * Features:
 * - Sect Card generation for Discord sharing
 * - Achievement announcements
 * - Milestone sharing
 * - Sect comparison tools
 * - Enhanced save export/import
 * - Discord webhook integration (optional)
 */

// =============================================================================
// SHARING TEMPLATES
// =============================================================================

const SHARE_TEMPLATES = {
  sectCard: {
    full: `
{border}
{emoji} **{masterName}** - {masterTitle}
{border}

**Cultivation Records:**
- Total Boops: {totalBoops}
- Max Combo: {maxCombo}x
- Critical Boops: {criticalBoops}
- Geese Booped: {gooseBoops}

**Sect Progress:**
- Cats Recruited: {catCount}
- Highest Realm: {highestRealm}
- Cultivation: {cultivationRealm} (Rank {cultivationRank})
- Prestige Tier: {prestigeTier}

**Bonds:**
- Total Bond: {totalBonds}
- Favorite: {favoriteWaifu}

**Achievements:** {achievementsUnlocked}/{achievementsTotal} ({achievementsPercent}%)
{latestAchievement}

**Power Score:** {powerScore}

{border}
*Snoot Booper: Idle Wuxia Cat Sanctuary*
`.trim(),

    compact: `{emoji} **{masterName}** | {totalBoops} boops | {catCount} cats | {cultivationRealm} | Power: {powerScore}`,

    minimal: `{emoji} {masterName}: {totalBoops} boops, {catCount} cats`
  },

  achievement: {
    single: `
**ACHIEVEMENT UNLOCKED!**

{emoji} **{masterName}** {verb}:
{achievementEmoji} **{achievementName}**
*"{achievementDescription}"*

{suffix}
`.trim(),

    batch: `
**ACHIEVEMENT STORM!**

{emoji} **{masterName}** unlocked {count} achievements!

{achievementList}

*The path of cultivation grows ever stronger!*
`.trim()
  },

  milestone: {
    boops: `{emoji} **{masterName}** has reached **{value} BOOPS!** The heavens tremble!`,
    cats: `{emoji} **{masterName}** has recruited their **{value}th CAT!** The sect grows!`,
    realm: `{emoji} **{masterName}** has achieved **{value} REALM!** A new era begins!`,
    prestige: `{emoji} **{masterName}** has completed **PRESTIGE {value}!** Reborn anew!`,
    goose: `{emoji} **{masterName}** has booped **{value} GEESE!** HONK! Peace was never an option!`,
    bond: `{emoji} **{masterName}** has reached **MAX BOND** with **{waifuName}!** True love!`
  },

  comparison: {
    header: `
**SECT COMPARISON**
{emoji1} {name1} vs {emoji2} {name2}
{border}
`.trim(),

    row: `{category}: {value1} vs {value2} {winner}`,

    footer: `
{border}
**Overall: {overallWinner}** {trophy}
*May your snoots ever be boopable!*
`.trim()
  }
};

// =============================================================================
// ACHIEVEMENT STYLES
// =============================================================================

const ACHIEVEMENT_STYLES = {
  booping: { prefix: '👆', verb: 'achieved', suffix: 'through the art of the boop!' },
  cats: { prefix: '🐱', verb: 'earned', suffix: 'by mastering cat cultivation!' },
  waifus: { prefix: '💕', verb: 'unlocked', suffix: 'through the bonds of destiny!' },
  goose: { prefix: '🦢', verb: 'conquered', suffix: 'HONK! Peace was never an option!' },
  cultivation: { prefix: '☯️', verb: 'attained', suffix: 'through inner cultivation!' },
  secret: { prefix: '🔮', verb: 'discovered', suffix: '...how did they find this?' },
  dungeon: { prefix: '🏯', verb: 'completed', suffix: 'through dungeon mastery!' },
  prestige: { prefix: '✨', verb: 'transcended', suffix: 'beyond mortal limits!' }
};

// =============================================================================
// MILESTONE THRESHOLDS
// =============================================================================

const MILESTONE_THRESHOLDS = {
  boops: [1000, 10000, 100000, 1000000, 10000000, 100000000],
  cats: [10, 25, 50, 75, 100],
  goose: [10, 50, 100, 500, 1000],
  combo: [10, 25, 50, 100, 200],
  bonds: [100, 250, 500, 1000]
};

// =============================================================================
// SHARING SYSTEM CLASS
// =============================================================================

/**
 * SharingSystem - Handles all Discord sharing and save export/import
 */
class SharingSystem {
  constructor() {
    this.webhookUrl = null;
    this.lastSharedMilestones = {};
    this.shareHistory = [];
  }

  /**
   * Generate a shareable sect card
   * @param {Object} gameState - Current game state
   * @param {Object} systems - Game systems
   * @param {string} format - 'full', 'compact', or 'minimal'
   * @returns {Object} Sect card data
   */
  generateSectCard(gameState, systems = {}, format = 'full') {
    const masterSystem = systems.masterSystem || window.masterSystem;
    const catSystem = systems.catSystem || window.catSystem;
    const waifuSystem = systems.waifuSystem || window.waifuSystem;
    const achievementSystem = systems.achievementSystem || window.achievementSystem;
    const cultivationSystem = systems.cultivationSystem || window.cultivationSystem;
    const prestigeSystem = systems.prestigeSystem || window.prestigeSystem;

    // Get master info
    const master = masterSystem?.selectedMaster || { name: 'Unknown', title: 'Wanderer', emoji: '❓' };

    // Gather stats
    const stats = {
      totalBoops: gameState.totalBoops || 0,
      maxCombo: gameState.maxCombo || 0,
      criticalBoops: gameState.criticalBoops || 0,
      gooseBoops: gameState.gooseBoops || 0
    };

    // Cat stats
    const cats = catSystem?.getAllCats?.() || [];
    const catCount = cats.length;
    const highestRealmCat = this.getHighestRealmCat(cats);

    // Waifu stats
    const waifuStats = this.getWaifuStats(waifuSystem);

    // Achievement stats
    const achievementProgress = achievementSystem?.getProgress?.() || { unlocked: 0, total: 0, percent: 0 };
    const latestAchievement = achievementSystem?.recentUnlocks?.slice(-1)?.[0]?.achievement;

    // Cultivation
    const cultivationRealm = cultivationSystem?.getCurrentRealm?.()?.name || 'Mortal Realm';
    const cultivationRank = cultivationSystem?.getCurrentRank?.() || 1;

    // Prestige
    const prestigeTier = prestigeSystem?.currentTier || 0;

    // Power score
    const powerScore = this.calculatePowerScore(gameState, catSystem, waifuSystem);

    // Build card data
    const cardData = {
      // Master info
      masterName: master.name,
      masterTitle: master.title,
      emoji: master.emoji || '🐱',
      masterColor: master.color || '#50C878',

      // Stats
      totalBoops: this.formatNumber(stats.totalBoops),
      maxCombo: stats.maxCombo,
      criticalBoops: this.formatNumber(stats.criticalBoops),
      gooseBoops: this.formatNumber(stats.gooseBoops),

      // Cats
      catCount: catCount,
      highestRealm: highestRealmCat?.realmName || 'None',

      // Waifus
      totalBonds: waifuStats.totalBonds,
      favoriteWaifu: waifuStats.favorite?.name || 'None',

      // Achievements
      achievementsUnlocked: achievementProgress.unlocked,
      achievementsTotal: achievementProgress.total,
      achievementsPercent: achievementProgress.percent,
      latestAchievement: latestAchievement
        ? `- Latest: ${latestAchievement.emoji || '🏆'} ${latestAchievement.name}`
        : '',

      // Cultivation
      cultivationRealm: cultivationRealm,
      cultivationRank: cultivationRank,
      prestigeTier: prestigeTier,

      // Power
      powerScore: this.formatNumber(powerScore),

      // Formatting
      border: '═'.repeat(40),

      // Timestamp
      timestamp: Date.now()
    };

    // Generate formatted text
    const template = SHARE_TEMPLATES.sectCard[format] || SHARE_TEMPLATES.sectCard.full;
    const formattedText = this.formatTemplate(template, cardData);

    return {
      data: cardData,
      text: formattedText,
      format: format
    };
  }

  /**
   * Generate achievement share text
   * @param {Object} achievement - Achievement object
   * @param {Object} master - Master object (optional)
   * @returns {string} Formatted share text
   */
  generateAchievementShare(achievement, master = null) {
    const masterInfo = master || window.masterSystem?.selectedMaster || { name: 'A Cultivator', emoji: '🐱' };
    const style = ACHIEVEMENT_STYLES[achievement.category] || ACHIEVEMENT_STYLES.booping;

    const data = {
      emoji: masterInfo.emoji || '🐱',
      masterName: masterInfo.name,
      verb: style.verb,
      achievementEmoji: achievement.emoji || '🏆',
      achievementName: achievement.name,
      achievementDescription: achievement.description,
      suffix: style.suffix
    };

    return this.formatTemplate(SHARE_TEMPLATES.achievement.single, data);
  }

  /**
   * Generate batch achievement share text
   * @param {Array} achievements - Array of achievement objects
   * @param {Object} master - Master object (optional)
   * @returns {string} Formatted share text
   */
  generateAchievementBatchShare(achievements, master = null) {
    if (achievements.length === 0) return '';
    if (achievements.length === 1) return this.generateAchievementShare(achievements[0], master);

    const masterInfo = master || window.masterSystem?.selectedMaster || { name: 'A Cultivator', emoji: '🐱' };

    const achievementList = achievements
      .map(a => `${a.emoji || '🏆'} **${a.name}**`)
      .join('\n');

    const data = {
      emoji: masterInfo.emoji || '🐱',
      masterName: masterInfo.name,
      count: achievements.length,
      achievementList: achievementList
    };

    return this.formatTemplate(SHARE_TEMPLATES.achievement.batch, data);
  }

  /**
   * Generate milestone share text
   * @param {string} type - Milestone type ('boops', 'cats', etc.)
   * @param {number|string} value - Milestone value
   * @param {Object} master - Master object (optional)
   * @param {Object} extra - Extra data (like waifuName for bond milestones)
   * @returns {string} Formatted share text
   */
  generateMilestoneShare(type, value, master = null, extra = {}) {
    const masterInfo = master || window.masterSystem?.selectedMaster || { name: 'A Cultivator', emoji: '🐱' };
    const template = SHARE_TEMPLATES.milestone[type];

    if (!template) return '';

    const data = {
      emoji: masterInfo.emoji || '🐱',
      masterName: masterInfo.name,
      value: typeof value === 'number' ? this.formatNumber(value) : value,
      ...extra
    };

    return this.formatTemplate(template, data);
  }

  /**
   * Check for new milestones
   * @param {Object} gameState - Current game state
   * @param {Object} systems - Game systems
   * @returns {Array} Array of milestone objects
   */
  checkMilestones(gameState, systems = {}) {
    const milestones = [];

    // Check boop milestones
    for (const threshold of MILESTONE_THRESHOLDS.boops) {
      if (gameState.totalBoops >= threshold && !this.lastSharedMilestones[`boops_${threshold}`]) {
        milestones.push({ type: 'boops', value: threshold });
        this.lastSharedMilestones[`boops_${threshold}`] = true;
      }
    }

    // Check cat milestones
    const catSystem = systems.catSystem || window.catSystem;
    const catCount = catSystem?.getCatCount?.() || 0;
    for (const threshold of MILESTONE_THRESHOLDS.cats) {
      if (catCount >= threshold && !this.lastSharedMilestones[`cats_${threshold}`]) {
        milestones.push({ type: 'cats', value: threshold });
        this.lastSharedMilestones[`cats_${threshold}`] = true;
      }
    }

    // Check goose milestones
    for (const threshold of MILESTONE_THRESHOLDS.goose) {
      if ((gameState.gooseBoops || 0) >= threshold && !this.lastSharedMilestones[`goose_${threshold}`]) {
        milestones.push({ type: 'goose', value: threshold });
        this.lastSharedMilestones[`goose_${threshold}`] = true;
      }
    }

    return milestones;
  }

  /**
   * Compare two sects
   * @param {Object} myState - Your game state
   * @param {Object} friendState - Friend's game state
   * @param {Object} mySystems - Your game systems (optional)
   * @param {Object} friendSystems - Friend's game systems (optional)
   * @returns {Object} Comparison result
   */
  compareSects(myState, friendState, mySystems = {}, friendSystems = {}) {
    const myCard = this.generateSectCard(myState, mySystems).data;
    const friendCard = this.generateSectCard(friendState, friendSystems).data;

    const categories = [
      { id: 'boops', name: 'Boops', emoji: '👆' },
      { id: 'cats', name: 'Cats', emoji: '🐱' },
      { id: 'bonds', name: 'Bonds', emoji: '💕' },
      { id: 'goose', name: 'Geese', emoji: '🦢' },
      { id: 'combo', name: 'Combo', emoji: '🔥' },
      { id: 'power', name: 'Power', emoji: '⚡' }
    ];

    const comparisons = {};
    let myWins = 0;
    let friendWins = 0;

    for (const cat of categories) {
      let myValue, friendValue;

      switch (cat.id) {
        case 'boops':
          myValue = parseInt(myCard.totalBoops.replace(/[^\d]/g, '')) || 0;
          friendValue = parseInt(friendCard.totalBoops.replace(/[^\d]/g, '')) || 0;
          break;
        case 'cats':
          myValue = myCard.catCount;
          friendValue = friendCard.catCount;
          break;
        case 'bonds':
          myValue = myCard.totalBonds;
          friendValue = friendCard.totalBonds;
          break;
        case 'goose':
          myValue = parseInt(myCard.gooseBoops.replace(/[^\d]/g, '')) || 0;
          friendValue = parseInt(friendCard.gooseBoops.replace(/[^\d]/g, '')) || 0;
          break;
        case 'combo':
          myValue = myCard.maxCombo;
          friendValue = friendCard.maxCombo;
          break;
        case 'power':
          myValue = parseInt(myCard.powerScore.replace(/[^\d]/g, '')) || 0;
          friendValue = parseInt(friendCard.powerScore.replace(/[^\d]/g, '')) || 0;
          break;
      }

      const winner = myValue > friendValue ? myCard.masterName :
                     friendValue > myValue ? friendCard.masterName : 'tie';

      if (winner === myCard.masterName) myWins++;
      else if (winner === friendCard.masterName) friendWins++;

      comparisons[cat.id] = {
        category: cat,
        myValue: myValue,
        friendValue: friendValue,
        winner: winner,
        diff: Math.abs(myValue - friendValue)
      };
    }

    const overallWinner = myWins > friendWins ? myCard.masterName :
                          friendWins > myWins ? friendCard.masterName : 'tie';

    // Generate text
    let text = this.formatTemplate(SHARE_TEMPLATES.comparison.header, {
      emoji1: myCard.emoji,
      name1: myCard.masterName,
      emoji2: friendCard.emoji,
      name2: friendCard.masterName,
      border: '─'.repeat(30)
    });

    text += '\n';

    for (const cat of categories) {
      const comp = comparisons[cat.id];
      const winnerEmoji = comp.winner === myCard.masterName ? '👈' :
                          comp.winner === friendCard.masterName ? '👉' : '🤝';

      text += `${cat.emoji} ${cat.name}: ${this.formatNumber(comp.myValue)} vs ${this.formatNumber(comp.friendValue)} ${winnerEmoji}\n`;
    }

    text += this.formatTemplate(SHARE_TEMPLATES.comparison.footer, {
      border: '─'.repeat(30),
      overallWinner: overallWinner === 'tie' ? 'TIE!' : overallWinner,
      trophy: overallWinner === 'tie' ? '⚖️' : '🏆'
    });

    return {
      myCard: myCard,
      friendCard: friendCard,
      comparisons: comparisons,
      myWins: myWins,
      friendWins: friendWins,
      overallWinner: overallWinner,
      text: text
    };
  }

  /**
   * Export save for sharing (enhanced with metadata)
   * @param {boolean} includeTimestamp - Include export timestamp
   * @returns {string} Base64 encoded save
   */
  exportSaveForSharing(includeTimestamp = true) {
    const raw = localStorage.getItem('celestial_snoot_sect');
    if (!raw) return null;

    try {
      const saveData = JSON.parse(raw);

      const exportData = {
        meta: {
          version: '1.0',
          exportTime: includeTimestamp ? Date.now() : null,
          masterName: saveData.master || 'unknown',
          quickStats: {
            boops: saveData.stats?.totalBoops || 0,
            cats: saveData.cats?.cats?.length || 0,
            playtime: saveData.stats?.playtime || 0
          }
        },
        save: saveData
      };

      return btoa(JSON.stringify(exportData));
    } catch (e) {
      console.error('Export failed:', e);
      return null;
    }
  }

  /**
   * Preview a save before importing
   * @param {string} encoded - Base64 encoded save
   * @returns {Object} Preview data
   */
  previewSharedSave(encoded) {
    try {
      const decoded = atob(encoded);
      const data = JSON.parse(decoded);

      // Handle both formats
      const saveData = data.save || data;
      const meta = data.meta || null;

      if (!saveData.version || !saveData.timestamp || !saveData.resources) {
        return { valid: false, error: 'Invalid save structure' };
      }

      return {
        valid: true,
        meta: meta,
        masterName: saveData.master || 'Unknown',
        saveVersion: saveData.version,
        saveDate: new Date(saveData.timestamp).toLocaleString(),
        stats: {
          totalBoops: saveData.stats?.totalBoops || 0,
          maxCombo: saveData.stats?.maxCombo || 0,
          playtime: this.formatPlaytime(saveData.stats?.playtime || 0)
        },
        resources: {
          bp: saveData.resources?.bp || 0,
          pp: saveData.resources?.pp || 0,
          jadeCatnip: saveData.resources?.jadeCatnip || 0
        },
        cats: {
          count: saveData.cats?.cats?.length || 0
        },
        prestige: {
          tier: saveData.prestige?.currentTier || 0
        }
      };
    } catch (e) {
      return { valid: false, error: e.message };
    }
  }

  /**
   * Import a shared save
   * @param {string} encoded - Base64 encoded save
   * @param {boolean} confirm - Whether to actually apply the save
   * @returns {Object} Import result
   */
  importSharedSave(encoded, confirm = false) {
    const preview = this.previewSharedSave(encoded);

    if (!preview.valid) {
      return { success: false, error: preview.error };
    }

    if (!confirm) {
      return { success: false, needsConfirm: true, preview: preview };
    }

    try {
      const decoded = atob(encoded);
      const data = JSON.parse(decoded);
      const saveData = data.save || data;

      localStorage.setItem('celestial_snoot_sect', JSON.stringify(saveData));
      return { success: true, preview: preview };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Set Discord webhook URL for automated sharing
   * @param {string} url - Discord webhook URL
   */
  setWebhookUrl(url) {
    this.webhookUrl = url;
  }

  /**
   * Send message to Discord webhook
   * @param {string} content - Message content
   * @param {Object} options - Embed options
   * @returns {Promise<boolean>} Success status
   */
  async sendToDiscord(content, options = {}) {
    if (!this.webhookUrl) {
      console.warn('No Discord webhook URL configured');
      return false;
    }

    try {
      const payload = {
        content: content,
        username: 'Snoot Booper',
        avatar_url: 'https://example.com/snoot-booper-avatar.png' // Replace with actual URL
      };

      // Add embed if provided
      if (options.embed) {
        payload.embeds = [this.formatDiscordEmbed(options.embed)];
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (e) {
      console.error('Discord webhook failed:', e);
      return false;
    }
  }

  /**
   * Format data for Discord embed
   * @param {Object} embedData - Embed data
   * @returns {Object} Discord embed object
   */
  formatDiscordEmbed(embedData) {
    return {
      title: embedData.title || 'Snoot Booper',
      description: embedData.description || '',
      color: parseInt((embedData.color || '#50C878').replace('#', ''), 16),
      fields: embedData.fields || [],
      footer: {
        text: 'Snoot Booper: Idle Wuxia Cat Sanctuary'
      },
      timestamp: new Date().toISOString()
    };
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  /**
   * Format a template string with data
   * @param {string} template - Template string with {placeholders}
   * @param {Object} data - Data to fill placeholders
   * @returns {string} Formatted string
   */
  formatTemplate(template, data) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  }

  /**
   * Get highest realm cat
   * @param {Array} cats - Array of cats
   * @returns {Object|null} Highest realm cat with realmName
   */
  getHighestRealmCat(cats) {
    if (!cats || cats.length === 0) return null;

    const realmOrder = {
      'kittenMortal': 1, 'mortal': 1,
      'earthKitten': 2, 'earth': 2,
      'skyKitten': 3, 'sky': 3,
      'heavenKitten': 4, 'heaven': 4,
      'divineBeast': 5, 'divine': 5,
      'celestialBeast': 6,
      'cosmicEntity': 7
    };

    const realmNames = {
      'kittenMortal': 'Mortal Kitten', 'mortal': 'Mortal',
      'earthKitten': 'Earth Kitten', 'earth': 'Earth',
      'skyKitten': 'Sky Kitten', 'sky': 'Sky',
      'heavenKitten': 'Heaven Kitten', 'heaven': 'Heaven',
      'divineBeast': 'Divine Beast', 'divine': 'Divine',
      'celestialBeast': 'Celestial Beast',
      'cosmicEntity': 'Cosmic Entity'
    };

    let highest = null;
    let highestOrder = 0;

    for (const cat of cats) {
      const order = realmOrder[cat.realm] || 1;
      if (order > highestOrder) {
        highestOrder = order;
        highest = cat;
      }
    }

    return highest ? { ...highest, realmName: realmNames[highest.realm] || highest.realm } : null;
  }

  /**
   * Get waifu statistics
   * @param {Object} waifuSystem - Waifu system
   * @returns {Object} Waifu stats
   */
  getWaifuStats(waifuSystem) {
    const waifus = waifuSystem?.getUnlockedWaifus?.() || [];

    let totalBonds = 0;
    let favorite = null;
    let highestBond = 0;

    for (const waifu of waifus) {
      const bond = waifu.bondLevel || 0;
      totalBonds += bond;
      if (bond > highestBond) {
        highestBond = bond;
        favorite = waifu;
      }
    }

    return { count: waifus.length, totalBonds, favorite };
  }

  /**
   * Calculate power score
   * @param {Object} gameState - Game state
   * @param {Object} catSystem - Cat system
   * @param {Object} waifuSystem - Waifu system
   * @returns {number} Power score
   */
  calculatePowerScore(gameState, catSystem, waifuSystem) {
    let score = 0;

    // Boops contribute
    score += (gameState.totalBoops || 0) * 0.1;

    // Combo contributes
    score += (gameState.maxCombo || 0) * 10;

    // Crits contribute
    score += (gameState.criticalBoops || 0) * 0.5;

    // Geese contribute significantly
    score += (gameState.gooseBoops || 0) * 100;

    // Cats by realm
    const cats = catSystem?.getAllCats?.() || [];
    const realmValues = {
      'kittenMortal': 1, 'mortal': 1,
      'earthKitten': 5, 'earth': 5,
      'skyKitten': 20, 'sky': 20,
      'heavenKitten': 100, 'heaven': 100,
      'divineBeast': 500, 'divine': 500,
      'celestialBeast': 2000,
      'cosmicEntity': 10000
    };

    for (const cat of cats) {
      score += realmValues[cat.realm] || 1;
    }

    // Waifu bonds
    const waifuStats = this.getWaifuStats(waifuSystem);
    score += waifuStats.totalBonds * 10;

    // Prestige
    const prestigeTier = window.prestigeSystem?.currentTier || 0;
    score += prestigeTier * 10000;

    return Math.floor(score);
  }

  /**
   * Format number for display
   * @param {number} n - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(n) {
    if (n === null || n === undefined) return '0';
    if (n < 1000) return Math.floor(n).toString();

    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qi', 'Sx'];
    const tier = Math.min(Math.floor(Math.log10(Math.abs(n)) / 3), suffixes.length - 1);
    return (n / Math.pow(10, tier * 3)).toFixed(1) + suffixes[tier];
  }

  /**
   * Format playtime for display
   * @param {number} ms - Milliseconds
   * @returns {string} Formatted playtime
   */
  formatPlaytime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  }

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

// Export templates
window.SHARE_TEMPLATES = SHARE_TEMPLATES;
window.ACHIEVEMENT_STYLES = ACHIEVEMENT_STYLES;
window.MILESTONE_THRESHOLDS = MILESTONE_THRESHOLDS;

// Export class
window.SharingSystem = SharingSystem;
