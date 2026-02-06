/**
 * social.js - Social Features for the Celestial Snoot Sect
 * "The Seven Masters compete not for glory, but for the eternal boop."
 *
 * Features:
 * - Sect Card Generator for Discord sharing
 * - Friend comparison system
 * - Leaderboard tracking
 * - Achievement announcements
 * - Enhanced save sharing
 */

// ============================================
// THE SEVEN MASTERS - Friend Group Metadata
// ============================================

const SECT_MEMBERS = {
  gerald: {
    id: 'gerald',
    name: 'Gerald',
    title: 'Sect Leader, The Jade Palm',
    role: 'Sect Leader',
    rivalryTitle: 'Grand Master',
    color: '#50C878',
    emoji: '🐉'
  },
  rusty: {
    id: 'rusty',
    name: 'Rusty',
    title: 'War General, The Crimson Fist',
    role: 'War General',
    rivalryTitle: 'War Champion',
    color: '#DC143C',
    emoji: '👊'
  },
  steve: {
    id: 'steve',
    name: 'Steve',
    title: 'Strategist, The Flowing River',
    role: 'Strategist',
    rivalryTitle: 'Supreme Calculator',
    color: '#4169E1',
    emoji: '🌊'
  },
  andrew: {
    id: 'andrew',
    name: 'Andrew',
    title: 'Scout, The Thunder Step',
    role: 'Scout',
    rivalryTitle: 'Speed Demon',
    color: '#FFD700',
    emoji: '⚡'
  },
  nik: {
    id: 'nik',
    name: 'Nik',
    title: 'Assassin, The Shadow Moon',
    role: 'Assassin',
    rivalryTitle: 'Silent Strike',
    color: '#483D8B',
    emoji: '🌙'
  },
  yuelin: {
    id: 'yuelin',
    name: 'Yuelin',
    title: 'Healer, The Lotus Sage',
    role: 'Healer',
    rivalryTitle: 'Heart Guardian',
    color: '#FFB6C1',
    emoji: '🪷'
  },
  scott: {
    id: 'scott',
    name: 'Scott',
    title: 'Guardian, The Mountain',
    role: 'Guardian',
    rivalryTitle: 'Unmovable One',
    color: '#8B4513',
    emoji: '⛰️'
  }
};

// ============================================
// RIVALRY MESSAGES - Fun competitive banter
// ============================================

const RIVALRY_MESSAGES = {
  boops: {
    crushing: [
      "{{winner}} has achieved snoot dominance over {{loser}}! ({diff} boops ahead)",
      "{{winner}}'s finger is mightier than {{loser}}'s entire sect! ({diff} boop advantage)",
      "The legends speak of {{winner}}'s booping prowess... {{loser}}? Not so much.",
    ],
    close: [
      "{{winner}} edges out {{loser}} by just {diff} boops! The rivalry intensifies!",
      "A photo finish! {{winner}} barely beats {{loser}} ({diff} boops)!",
      "{{loser}} is breathing down {{winner}}'s neck! Only {diff} boops between them!",
    ],
    equal: [
      "{{player1}} and {{player2}} are perfectly matched! A true rivalry!",
      "The balance of boops is absolute between {{player1}} and {{player2}}!",
    ]
  },
  cats: {
    crushing: [
      "{{winner}}'s cat army dwarfs {{loser}}'s meager collection! ({diff} more cats)",
      "{{winner}} is the true Cat Collector Supreme! {{loser}} needs more snoots!",
    ],
    close: [
      "{{winner}} has {diff} more cats than {{loser}}. Every floof counts!",
      "The cat count is tight! {{winner}} leads by just {diff}!",
    ]
  },
  bonds: {
    crushing: [
      "{{winner}} is clearly the sect's romantic hero! {{loser}} should take notes.",
      "The waifus have chosen {{winner}} over {{loser}}! ({diff} more bond)",
    ],
    close: [
      "Both {{winner}} and {{loser}} are charming! Only {diff} bond difference!",
    ]
  },
  generic: [
    "The Celestial Snoot Sect is blessed to have such dedicated cultivators!",
    "May your snoots ever be boopable, friends!",
    "The Seven Masters grow stronger together!",
  ]
};

// ============================================
// SECT CARD GENERATOR
// ============================================

/**
 * Generates a shareable sect card summary for Discord
 * @param {Object} gameState - The current game state
 * @param {Object} systems - Object containing game systems (masterSystem, catSystem, waifuSystem, etc.)
 * @returns {Object} Sect card data
 */
function generateSectCard(gameState, systems = {}) {
  const masterSystem = systems.masterSystem || window.masterSystem;
  const catSystem = systems.catSystem || window.catSystem;
  const waifuSystem = systems.waifuSystem || window.waifuSystem;
  const achievementSystem = systems.achievementSystem || window.achievementSystem;
  const cultivationSystem = systems.cultivationSystem || window.cultivationSystem;
  const prestigeSystem = systems.prestigeSystem || window.prestigeSystem;

  // Get master info
  const master = masterSystem?.selectedMaster || { id: 'unknown', name: 'Unknown', title: 'Wanderer', emoji: '❓' };
  const sectMember = SECT_MEMBERS[master.id] || { color: '#888888', rivalryTitle: 'Cultivator' };

  // Calculate stats
  const totalBoops = gameState.totalBoops || 0;
  const maxCombo = gameState.maxCombo || 0;
  const gooseBoops = gameState.gooseBoops || 0;
  const criticalBoops = gameState.criticalBoops || 0;

  // Cat stats
  const catCount = catSystem?.getCatCount?.() || 0;
  const cats = catSystem?.getAllCats?.() || [];
  const highestRealmCat = getHighestRealmCat(cats);

  // Waifu stats
  const waifuStats = getWaifuStats(waifuSystem);

  // Achievement stats
  const achievementProgress = achievementSystem?.getProgress?.() || { unlocked: 0, total: 0, percent: 0 };
  const latestAchievement = getLatestAchievement(achievementSystem);

  // Cultivation realm
  const cultivationRealm = cultivationSystem?.getCurrentRealm?.()?.name || 'Mortal Realm';
  const cultivationRank = cultivationSystem?.getCurrentRank?.() || 1;

  // Prestige info
  const prestigeTier = prestigeSystem?.currentTier || 0;
  const totalRebirths = prestigeSystem?.totalRebirths || 0;

  // Calculate "power score" - a fun aggregate metric
  const powerScore = calculatePowerScore(gameState, catSystem, waifuSystem);

  return {
    // Header
    masterName: master.name,
    masterTitle: master.title,
    masterEmoji: master.emoji,
    masterColor: sectMember.color,
    rivalryTitle: sectMember.rivalryTitle,

    // Core Stats
    stats: {
      totalBoops: totalBoops,
      maxCombo: maxCombo,
      criticalBoops: criticalBoops,
      gooseBoops: gooseBoops,
      catCount: catCount,
      highestRealm: highestRealmCat?.realmName || 'None',
      totalBonds: waifuStats.totalBonds,
      favoriteWaifu: waifuStats.favorite?.name || 'None',
      cultivationRealm: cultivationRealm,
      cultivationRank: cultivationRank,
      prestigeTier: prestigeTier,
      totalRebirths: totalRebirths
    },

    // Achievements
    achievements: {
      unlocked: achievementProgress.unlocked,
      total: achievementProgress.total,
      percent: achievementProgress.percent,
      latest: latestAchievement
    },

    // Power Score
    powerScore: powerScore,

    // Timestamp
    timestamp: Date.now(),
    version: '1.0'
  };
}

/**
 * Formats a sect card for Discord text sharing
 * @param {Object} card - Sect card data from generateSectCard
 * @returns {string} Discord-formatted text
 */
function formatSectCardForDiscord(card) {
  const stats = card.stats;
  const achievements = card.achievements;

  let text = `
${'='.repeat(40)}
${card.masterEmoji} **${card.masterName}** - ${card.masterTitle}
${'='.repeat(40)}

**Cultivation Records:**
- Total Boops: ${formatNumber(stats.totalBoops)}
- Max Combo: ${stats.maxCombo}x
- Critical Boops: ${formatNumber(stats.criticalBoops)}
- Geese Booped: ${formatNumber(stats.gooseBoops)} 🦢

**Sect Progress:**
- Cats Recruited: ${stats.catCount}
- Highest Realm: ${stats.highestRealm}
- Cultivation: ${stats.cultivationRealm} (Rank ${stats.cultivationRank})
- Prestige Tier: ${stats.prestigeTier} (${stats.totalRebirths} rebirths)

**Bonds:**
- Total Bond: ${stats.totalBonds}
- Favorite: ${stats.favoriteWaifu} 💕

**Achievements:** ${achievements.unlocked}/${achievements.total} (${achievements.percent}%)
${achievements.latest ? `- Latest: ${achievements.latest.emoji} ${achievements.latest.name}` : ''}

**Power Score:** ${formatNumber(card.powerScore)} ⚡

${'='.repeat(40)}
*Snoot Booper: Idle Wuxia Cat Sanctuary*
`.trim();

  return text;
}

/**
 * Generates a compact sect card for quick sharing
 * @param {Object} card - Sect card data
 * @returns {string} Compact Discord-formatted text
 */
function formatCompactSectCard(card) {
  return `${card.masterEmoji} **${card.masterName}** | ${formatNumber(card.stats.totalBoops)} boops | ${card.stats.catCount} cats | ${card.stats.cultivationRealm} | Power: ${formatNumber(card.powerScore)} ⚡`;
}

// ============================================
// COMPARISON SYSTEM
// ============================================

/**
 * Compares two sects and determines winners in each category
 * @param {Object} myState - Your game state
 * @param {Object} friendState - Friend's game state
 * @param {Object} mySystems - Your game systems
 * @param {Object} friendSystems - Friend's game systems
 * @returns {Object} Comparison results
 */
function compareSects(myState, friendState, mySystems = {}, friendSystems = {}) {
  const myCard = generateSectCard(myState, mySystems);
  const friendCard = generateSectCard(friendState, friendSystems);

  const comparisons = {
    boops: compareMetric(myCard.stats.totalBoops, friendCard.stats.totalBoops, myCard.masterName, friendCard.masterName),
    cats: compareMetric(myCard.stats.catCount, friendCard.stats.catCount, myCard.masterName, friendCard.masterName),
    bonds: compareMetric(myCard.stats.totalBonds, friendCard.stats.totalBonds, myCard.masterName, friendCard.masterName),
    goose: compareMetric(myCard.stats.gooseBoops, friendCard.stats.gooseBoops, myCard.masterName, friendCard.masterName),
    combo: compareMetric(myCard.stats.maxCombo, friendCard.stats.maxCombo, myCard.masterName, friendCard.masterName),
    achievements: compareMetric(myCard.achievements.unlocked, friendCard.achievements.unlocked, myCard.masterName, friendCard.masterName),
    powerScore: compareMetric(myCard.powerScore, friendCard.powerScore, myCard.masterName, friendCard.masterName),
  };

  // Determine overall winner
  let myWins = 0;
  let friendWins = 0;

  for (const key in comparisons) {
    if (comparisons[key].winner === myCard.masterName) myWins++;
    else if (comparisons[key].winner === friendCard.masterName) friendWins++;
  }

  const overallWinner = myWins > friendWins ? myCard.masterName :
                        friendWins > myWins ? friendCard.masterName : 'tie';

  return {
    myCard,
    friendCard,
    comparisons,
    myWins,
    friendWins,
    overallWinner,
    message: generateRivalryMessage(comparisons, myCard.masterName, friendCard.masterName, overallWinner)
  };
}

/**
 * Compare a single metric between two players
 */
function compareMetric(myValue, friendValue, myName, friendName) {
  const diff = Math.abs(myValue - friendValue);
  const percentDiff = myValue > 0 || friendValue > 0
    ? Math.round((diff / Math.max(myValue, friendValue)) * 100)
    : 0;

  return {
    myValue,
    friendValue,
    diff,
    percentDiff,
    winner: myValue > friendValue ? myName : friendValue > myValue ? friendName : 'tie',
    isCrushingVictory: percentDiff > 50,
    isClose: percentDiff < 10
  };
}

/**
 * Generate fun rivalry message based on comparisons
 */
function generateRivalryMessage(comparisons, myName, friendName, overallWinner) {
  const messages = [];

  // Boops rivalry message
  const boopComp = comparisons.boops;
  if (boopComp.winner !== 'tie') {
    const pool = boopComp.isCrushingVictory ? RIVALRY_MESSAGES.boops.crushing :
                 boopComp.isClose ? RIVALRY_MESSAGES.boops.close : RIVALRY_MESSAGES.boops.crushing;
    const template = pool[Math.floor(Math.random() * pool.length)];
    messages.push(formatRivalryTemplate(template, boopComp.winner,
      boopComp.winner === myName ? friendName : myName, boopComp.diff));
  }

  // Cats rivalry message
  const catComp = comparisons.cats;
  if (catComp.winner !== 'tie' && catComp.diff > 0) {
    const pool = catComp.isCrushingVictory ? RIVALRY_MESSAGES.cats.crushing : RIVALRY_MESSAGES.cats.close;
    const template = pool[Math.floor(Math.random() * pool.length)];
    messages.push(formatRivalryTemplate(template, catComp.winner,
      catComp.winner === myName ? friendName : myName, catComp.diff));
  }

  // Overall message
  if (overallWinner !== 'tie') {
    messages.push(`\n**Overall Victory: ${overallWinner}!** 🏆`);
  } else {
    messages.push(`\n**It's a perfect tie!** The balance of cultivation is maintained! ⚖️`);
  }

  // Generic message
  messages.push(RIVALRY_MESSAGES.generic[Math.floor(Math.random() * RIVALRY_MESSAGES.generic.length)]);

  return messages.join('\n');
}

/**
 * Format rivalry message template
 */
function formatRivalryTemplate(template, winner, loser, diff) {
  return template
    .replace(/{{winner}}/g, winner)
    .replace(/{{loser}}/g, loser)
    .replace(/{{player1}}/g, winner)
    .replace(/{{player2}}/g, loser)
    .replace(/{diff}/g, formatNumber(diff));
}

// ============================================
// LEADERBOARD SYSTEM
// ============================================

/**
 * LeaderboardSystem - Tracks high scores for local/friend group competition
 */
class LeaderboardSystem {
  constructor() {
    this.STORAGE_KEY = 'snoot_leaderboard';
    this.entries = [];
    this.categories = [
      { id: 'boops', name: 'Total Boops', emoji: '👆', getValue: (c) => c.stats.totalBoops },
      { id: 'cats', name: 'Cats Recruited', emoji: '🐱', getValue: (c) => c.stats.catCount },
      { id: 'bonds', name: 'Total Bonds', emoji: '💕', getValue: (c) => c.stats.totalBonds },
      { id: 'goose', name: 'Geese Booped', emoji: '🦢', getValue: (c) => c.stats.gooseBoops },
      { id: 'combo', name: 'Max Combo', emoji: '🔥', getValue: (c) => c.stats.maxCombo },
      { id: 'power', name: 'Power Score', emoji: '⚡', getValue: (c) => c.powerScore },
      { id: 'achievements', name: 'Achievements', emoji: '🏆', getValue: (c) => c.achievements.unlocked },
    ];
    this.load();
  }

  /**
   * Add or update a leaderboard entry
   */
  submitScore(sectCard) {
    const existingIndex = this.entries.findIndex(e => e.masterName === sectCard.masterName);

    const entry = {
      masterName: sectCard.masterName,
      masterTitle: sectCard.masterTitle,
      masterEmoji: sectCard.masterEmoji,
      masterColor: sectCard.masterColor,
      stats: { ...sectCard.stats },
      achievements: { ...sectCard.achievements },
      powerScore: sectCard.powerScore,
      timestamp: Date.now()
    };

    if (existingIndex >= 0) {
      // Update existing entry if score is higher
      const existing = this.entries[existingIndex];
      if (entry.powerScore >= existing.powerScore) {
        this.entries[existingIndex] = entry;
      }
    } else {
      this.entries.push(entry);
    }

    this.save();
    return entry;
  }

  /**
   * Get leaderboard for a specific category
   */
  getLeaderboard(categoryId, limit = 10) {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) return [];

    return [...this.entries]
      .map(entry => ({
        ...entry,
        value: category.getValue(entry)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry
      }));
  }

  /**
   * Get all leaderboards
   */
  getAllLeaderboards(limit = 7) {
    const result = {};
    for (const category of this.categories) {
      result[category.id] = {
        ...category,
        entries: this.getLeaderboard(category.id, limit)
      };
    }
    return result;
  }

  /**
   * Format leaderboard for Discord
   */
  formatForDiscord(categoryId, limit = 7) {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) return 'Unknown category';

    const entries = this.getLeaderboard(categoryId, limit);

    let text = `${category.emoji} **${category.name} Leaderboard**\n`;
    text += `${'─'.repeat(30)}\n`;

    const medals = ['🥇', '🥈', '🥉'];

    entries.forEach((entry, index) => {
      const medal = medals[index] || `#${index + 1}`;
      text += `${medal} **${entry.masterName}**: ${formatNumber(entry.value)}\n`;
    });

    if (entries.length === 0) {
      text += '*No entries yet!*\n';
    }

    return text.trim();
  }

  /**
   * Export leaderboard data for sharing
   */
  export() {
    return btoa(JSON.stringify({
      version: '1.0',
      timestamp: Date.now(),
      entries: this.entries
    }));
  }

  /**
   * Import leaderboard data from shared string
   */
  import(encoded) {
    try {
      const data = JSON.parse(atob(encoded));
      if (!data.entries || !Array.isArray(data.entries)) {
        return { success: false, error: 'Invalid leaderboard data' };
      }

      // Merge entries
      for (const entry of data.entries) {
        if (this.validateEntry(entry)) {
          this.submitScore(entry);
        }
      }

      this.save();
      return { success: true, imported: data.entries.length };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Validate a leaderboard entry
   */
  validateEntry(entry) {
    return entry &&
           entry.masterName &&
           entry.stats &&
           typeof entry.powerScore === 'number';
  }

  /**
   * Clear all leaderboard data
   */
  clear() {
    this.entries = [];
    this.save();
  }

  /**
   * Save to localStorage
   */
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.entries));
    } catch (e) {
      console.error('Failed to save leaderboard:', e);
    }
  }

  /**
   * Load from localStorage
   */
  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        this.entries = JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
      this.entries = [];
    }
  }
}

// ============================================
// ACHIEVEMENT ANNOUNCEMENTS
// ============================================

/**
 * Format achievement for Discord announcement
 * @param {Object} achievement - Achievement object
 * @param {Object} master - Master object (optional)
 * @returns {string} Discord-formatted announcement
 */
function formatAchievementAnnouncement(achievement, master = null) {
  const masterInfo = master || window.masterSystem?.selectedMaster;
  const masterName = masterInfo?.name || 'A Cultivator';
  const masterEmoji = masterInfo?.emoji || '🐱';

  // Different announcement styles based on category
  const styles = {
    booping: {
      prefix: '👆',
      verb: 'achieved',
      suffix: 'through the art of the boop!'
    },
    cats: {
      prefix: '🐱',
      verb: 'earned',
      suffix: 'by mastering cat cultivation!'
    },
    waifus: {
      prefix: '💕',
      verb: 'unlocked',
      suffix: 'through the bonds of destiny!'
    },
    goose: {
      prefix: '🦢',
      verb: 'conquered',
      suffix: 'HONK! Peace was never an option!'
    },
    cultivation: {
      prefix: '☯️',
      verb: 'attained',
      suffix: 'through inner cultivation!'
    },
    secret: {
      prefix: '🔮',
      verb: 'discovered',
      suffix: '...how did they find this?'
    }
  };

  const style = styles[achievement.category] || styles.booping;

  // Build announcement
  let announcement = `🏆 **ACHIEVEMENT UNLOCKED!** 🏆\n\n`;
  announcement += `${masterEmoji} **${masterName}** ${style.verb}:\n`;
  announcement += `${style.prefix} **${achievement.name}** ${achievement.emoji}\n`;
  announcement += `*"${achievement.description}"*\n\n`;
  announcement += `${style.suffix}`;

  return announcement;
}

/**
 * Format multiple achievements for batch announcement
 */
function formatAchievementBatch(achievements, master = null) {
  if (achievements.length === 0) return '';
  if (achievements.length === 1) return formatAchievementAnnouncement(achievements[0], master);

  const masterInfo = master || window.masterSystem?.selectedMaster;
  const masterName = masterInfo?.name || 'A Cultivator';
  const masterEmoji = masterInfo?.emoji || '🐱';

  let text = `🏆 **ACHIEVEMENT STORM!** 🏆\n\n`;
  text += `${masterEmoji} **${masterName}** unlocked ${achievements.length} achievements!\n\n`;

  for (const achievement of achievements) {
    text += `${achievement.emoji} **${achievement.name}**\n`;
  }

  text += `\n*The path of cultivation grows ever stronger!*`;

  return text;
}

// ============================================
// ENHANCED SAVE SHARING
// ============================================

/**
 * SocialSaveSystem - Enhanced save export/import with validation and preview
 */
const SocialSaveSystem = {
  VERSION: '1.0',

  /**
   * Export save with compression and metadata
   */
  exportSave(includeTimestamp = true) {
    const raw = localStorage.getItem('celestial_snoot_sect');
    if (!raw) return null;

    try {
      const saveData = JSON.parse(raw);

      // Add export metadata
      const exportData = {
        meta: {
          exportVersion: this.VERSION,
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

      // Encode and return
      return btoa(JSON.stringify(exportData));
    } catch (e) {
      console.error('Export failed:', e);
      return null;
    }
  },

  /**
   * Preview a save before importing
   */
  previewSave(encoded) {
    try {
      const decoded = atob(encoded);
      const data = JSON.parse(decoded);

      // Handle both old format (direct save) and new format (with meta)
      let saveData, meta;

      if (data.meta && data.save) {
        // New format
        meta = data.meta;
        saveData = data.save;
      } else {
        // Old format - it's the raw save data
        meta = null;
        saveData = data;
      }

      // Validate basic structure
      if (!saveData.version || !saveData.timestamp || !saveData.resources) {
        return { valid: false, error: 'Invalid save data structure' };
      }

      // Build preview
      const preview = {
        valid: true,
        exportMeta: meta,
        masterName: saveData.master || 'Unknown',
        saveVersion: saveData.version,
        saveDate: new Date(saveData.timestamp).toLocaleString(),
        stats: {
          totalBoops: saveData.stats?.totalBoops || 0,
          maxCombo: saveData.stats?.maxCombo || 0,
          criticalBoops: saveData.stats?.criticalBoops || 0,
          gooseBoops: saveData.stats?.gooseBoops || 0,
          playtime: formatPlaytime(saveData.stats?.playtime || 0)
        },
        resources: {
          bp: saveData.resources?.bp || 0,
          pp: saveData.resources?.pp || 0,
          jadeCatnip: saveData.resources?.jadeCatnip || 0
        },
        cats: {
          count: saveData.cats?.cats?.length || 0
        },
        waifus: {
          unlocked: saveData.waifus?.unlockedWaifus?.length || 0,
          totalBond: (saveData.waifus?.unlockedWaifus || []).reduce((sum, w) => sum + (w.bondLevel || 0), 0)
        },
        achievements: {
          unlocked: saveData.achievements?.unlockedAchievements?.length || 0
        },
        prestige: {
          tier: saveData.prestige?.currentTier || 0,
          rebirths: saveData.prestige?.totalRebirths || 0
        }
      };

      return preview;
    } catch (e) {
      return { valid: false, error: 'Failed to decode save: ' + e.message };
    }
  },

  /**
   * Import save with validation
   */
  importSave(encoded, confirm = false) {
    const preview = this.previewSave(encoded);

    if (!preview.valid) {
      return { success: false, error: preview.error };
    }

    if (!confirm) {
      return { success: false, needsConfirm: true, preview };
    }

    try {
      const decoded = atob(encoded);
      const data = JSON.parse(decoded);

      // Extract save data from new or old format
      const saveData = data.save || data;

      // Apply the save
      localStorage.setItem('celestial_snoot_sect', JSON.stringify(saveData));

      return { success: true, preview };
    } catch (e) {
      return { success: false, error: 'Import failed: ' + e.message };
    }
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the highest realm cat from a collection
 */
function getHighestRealmCat(cats) {
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
    const realm = cat.realm || 'mortal';
    const order = realmOrder[realm] || 1;
    if (order > highestOrder) {
      highestOrder = order;
      highest = cat;
    }
  }

  return highest ? {
    ...highest,
    realmName: realmNames[highest.realm] || highest.realm
  } : null;
}

/**
 * Get waifu statistics
 */
function getWaifuStats(waifuSystem) {
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

  return {
    count: waifus.length,
    totalBonds,
    favorite
  };
}

/**
 * Get latest achievement
 */
function getLatestAchievement(achievementSystem) {
  const recent = achievementSystem?.recentUnlocks || [];
  if (recent.length === 0) return null;

  const latest = recent[recent.length - 1];
  return latest?.achievement || null;
}

/**
 * Calculate power score - a fun aggregate metric
 */
function calculatePowerScore(gameState, catSystem, waifuSystem) {
  let score = 0;

  // Boops contribute
  score += (gameState.totalBoops || 0) * 0.1;

  // Combo contributes
  score += (gameState.maxCombo || 0) * 10;

  // Critical boops contribute
  score += (gameState.criticalBoops || 0) * 0.5;

  // Geese booped contribute significantly
  score += (gameState.gooseBoops || 0) * 100;

  // Cats contribute based on realm
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

  // Waifu bonds contribute
  const waifuStats = getWaifuStats(waifuSystem);
  score += waifuStats.totalBonds * 10;

  // Prestige contributes hugely
  const prestigeTier = window.prestigeSystem?.currentTier || 0;
  score += prestigeTier * 10000;

  return Math.floor(score);
}

/**
 * Format number for display
 */
function formatNumber(n) {
  if (n === null || n === undefined) return '0';
  if (n < 1000) return Math.floor(n).toString();

  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qi', 'Sx'];
  const tier = Math.min(Math.floor(Math.log10(Math.abs(n)) / 3), suffixes.length - 1);
  return (n / Math.pow(10, tier * 3)).toFixed(1) + suffixes[tier];
}

/**
 * Format playtime for display
 */
function formatPlaytime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m`;
  }
}

// ============================================
// SOCIAL UI MANAGER
// ============================================

/**
 * SocialUIManager - Handles social feature UI
 */
const SocialUIManager = {
  leaderboard: null,

  /**
   * Initialize social features
   */
  init() {
    this.leaderboard = new LeaderboardSystem();
    this.setupEventListeners();
    console.log('Social features initialized!');
  },

  /**
   * Setup event listeners for social UI
   */
  setupEventListeners() {
    // Modal open button
    const openBtn = document.getElementById('open-social-btn');
    if (openBtn) {
      openBtn.addEventListener('click', () => this.openSocialModal());
    }

    // Modal close button
    const closeBtn = document.getElementById('social-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeSocialModal());
    }

    // Tab switching
    document.querySelectorAll('.social-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.socialTab));
    });

    // Copy buttons
    document.getElementById('copy-sect-card')?.addEventListener('click', () => this.copySectCard());
    document.getElementById('copy-compact-card')?.addEventListener('click', () => this.copyCompactCard());

    // Leaderboard category selector
    document.getElementById('leaderboard-category')?.addEventListener('change', (e) => {
      this.updateLeaderboardDisplay(e.target.value);
    });

    // Submit score button
    document.getElementById('submit-score-btn')?.addEventListener('click', () => this.submitScore());

    // Export leaderboard
    document.getElementById('export-leaderboard-btn')?.addEventListener('click', () => this.exportLeaderboard());

    // Import leaderboard
    document.getElementById('import-leaderboard-btn')?.addEventListener('click', () => this.importLeaderboard());

    // Save export/import
    document.getElementById('export-social-save')?.addEventListener('click', () => this.exportSave());
    document.getElementById('preview-import')?.addEventListener('click', () => this.previewImport());
    document.getElementById('confirm-import')?.addEventListener('click', () => this.confirmImport());
  },

  /**
   * Open social modal
   */
  openSocialModal() {
    const modal = document.getElementById('social-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.updateSectCardPreview();
      this.updateLeaderboardDisplay();
    }
  },

  /**
   * Close social modal
   */
  closeSocialModal() {
    const modal = document.getElementById('social-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  },

  /**
   * Switch tabs in social modal
   */
  switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.social-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.socialTab === tabId);
    });

    // Update tab content
    document.querySelectorAll('.social-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `social-${tabId}-tab`);
    });
  },

  /**
   * Update sect card preview
   */
  updateSectCardPreview() {
    const card = generateSectCard(window.gameState || {});

    // Update preview elements
    document.getElementById('card-master-emoji').textContent = card.masterEmoji;
    document.getElementById('card-master-name').textContent = card.masterName;
    document.getElementById('card-master-title').textContent = card.masterTitle;

    document.getElementById('card-stat-boops').textContent = formatNumber(card.stats.totalBoops);
    document.getElementById('card-stat-cats').textContent = card.stats.catCount;
    document.getElementById('card-stat-realm').textContent = card.stats.highestRealm;
    document.getElementById('card-stat-bonds').textContent = card.stats.totalBonds;
    document.getElementById('card-stat-waifu').textContent = card.stats.favoriteWaifu;
    document.getElementById('card-stat-combo').textContent = card.stats.maxCombo + 'x';
    document.getElementById('card-stat-goose').textContent = formatNumber(card.stats.gooseBoops);
    document.getElementById('card-stat-power').textContent = formatNumber(card.powerScore);

    document.getElementById('card-achievement-progress').textContent =
      `${card.achievements.unlocked}/${card.achievements.total} (${card.achievements.percent}%)`;

    if (card.achievements.latest) {
      document.getElementById('card-latest-achievement').textContent =
        `${card.achievements.latest.emoji} ${card.achievements.latest.name}`;
    } else {
      document.getElementById('card-latest-achievement').textContent = 'None yet';
    }

    // Store card for copying
    this.currentCard = card;
  },

  /**
   * Copy sect card to clipboard
   */
  async copySectCard() {
    const text = formatSectCardForDiscord(this.currentCard);
    await this.copyToClipboard(text, 'Sect card copied!');
  },

  /**
   * Copy compact card to clipboard
   */
  async copyCompactCard() {
    const text = formatCompactSectCard(this.currentCard);
    await this.copyToClipboard(text, 'Compact card copied!');
  },

  /**
   * Update leaderboard display
   */
  updateLeaderboardDisplay(categoryId = null) {
    categoryId = categoryId || document.getElementById('leaderboard-category')?.value || 'power';

    const entries = this.leaderboard.getLeaderboard(categoryId, 7);
    const container = document.getElementById('leaderboard-entries');

    if (!container) return;

    if (entries.length === 0) {
      container.innerHTML = '<p class="empty-message">No entries yet! Submit your score to be first!</p>';
      return;
    }

    const medals = ['🥇', '🥈', '🥉'];

    container.innerHTML = entries.map((entry, index) => `
      <div class="leaderboard-entry ${index < 3 ? 'top-three' : ''}">
        <span class="entry-rank">${medals[index] || '#' + entry.rank}</span>
        <span class="entry-emoji">${entry.masterEmoji}</span>
        <span class="entry-name">${entry.masterName}</span>
        <span class="entry-value">${formatNumber(entry.value)}</span>
      </div>
    `).join('');
  },

  /**
   * Submit current score to leaderboard
   */
  submitScore() {
    const card = generateSectCard(window.gameState || {});
    this.leaderboard.submitScore(card);
    this.updateLeaderboardDisplay();
    this.showNotification('Score submitted!');
  },

  /**
   * Export leaderboard
   */
  async exportLeaderboard() {
    const encoded = this.leaderboard.export();
    document.getElementById('leaderboard-code').value = encoded;
    await this.copyToClipboard(encoded, 'Leaderboard exported and copied!');
  },

  /**
   * Import leaderboard
   */
  importLeaderboard() {
    const code = document.getElementById('leaderboard-code').value.trim();
    if (!code) {
      this.showNotification('Please paste a leaderboard code first!');
      return;
    }

    const result = this.leaderboard.import(code);
    if (result.success) {
      this.updateLeaderboardDisplay();
      this.showNotification(`Imported ${result.imported} entries!`);
    } else {
      this.showNotification('Import failed: ' + result.error);
    }
  },

  /**
   * Export save
   */
  async exportSave() {
    const encoded = SocialSaveSystem.exportSave();
    if (encoded) {
      document.getElementById('social-save-code').value = encoded;
      await this.copyToClipboard(encoded, 'Save exported and copied!');
    } else {
      this.showNotification('No save data found!');
    }
  },

  /**
   * Preview import
   */
  previewImport() {
    const code = document.getElementById('social-save-code').value.trim();
    if (!code) {
      this.showNotification('Please paste a save code first!');
      return;
    }

    const preview = SocialSaveSystem.previewSave(code);
    const container = document.getElementById('import-preview');

    if (!preview.valid) {
      container.innerHTML = `<p class="error-message">Invalid save: ${preview.error}</p>`;
      document.getElementById('confirm-import').classList.add('hidden');
      return;
    }

    container.innerHTML = `
      <div class="import-preview-content">
        <h4>${preview.masterName}'s Save</h4>
        <p>Save Date: ${preview.saveDate}</p>
        <p>Version: ${preview.saveVersion}</p>
        <div class="preview-stats">
          <p>Boops: ${formatNumber(preview.stats.totalBoops)}</p>
          <p>Cats: ${preview.cats.count}</p>
          <p>Waifus: ${preview.waifus.unlocked}</p>
          <p>Playtime: ${preview.stats.playtime}</p>
        </div>
        <p class="warning-text">Warning: This will replace your current save!</p>
      </div>
    `;

    document.getElementById('confirm-import').classList.remove('hidden');
    this.pendingImport = code;
  },

  /**
   * Confirm import
   */
  confirmImport() {
    if (!this.pendingImport) return;

    const result = SocialSaveSystem.importSave(this.pendingImport, true);
    if (result.success) {
      this.showNotification('Save imported! Refreshing...');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      this.showNotification('Import failed: ' + result.error);
    }
  },

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text, successMessage = 'Copied!') {
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification(successMessage);
    } catch (e) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showNotification(successMessage);
    }
  },

  /**
   * Show notification
   */
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'social-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('visible'), 10);
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
};

// ============================================
// EXPORTS
// ============================================

// Export to window for global access
window.SECT_MEMBERS = SECT_MEMBERS;
window.generateSectCard = generateSectCard;
window.formatSectCardForDiscord = formatSectCardForDiscord;
window.formatCompactSectCard = formatCompactSectCard;
window.compareSects = compareSects;
window.LeaderboardSystem = LeaderboardSystem;
window.formatAchievementAnnouncement = formatAchievementAnnouncement;
window.formatAchievementBatch = formatAchievementBatch;
window.SocialSaveSystem = SocialSaveSystem;
window.SocialUIManager = SocialUIManager;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SocialUIManager.init());
} else {
  SocialUIManager.init();
}
