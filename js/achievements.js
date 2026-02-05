/**
 * achievements.js - Achievement Scroll System
 * "Each jade tablet marks a milestone on the path of cultivation."
 */

// Achievement Categories
const ACHIEVEMENT_CATEGORIES = {
  booping: { id: 'booping', name: 'Way of the Boop', emoji: '👆', color: '#E94560' },
  cats: { id: 'cats', name: 'Cat Cultivation', emoji: '🐱', color: '#50C878' },
  waifus: { id: 'waifus', name: 'Bonds of Destiny', emoji: '💕', color: '#FFB6C1' },
  goose: { id: 'goose', name: 'Goose Mastery', emoji: '🦢', color: '#FFD700' },
  cultivation: { id: 'cultivation', name: 'Inner Power', emoji: '☯️', color: '#9370DB' },
  secret: { id: 'secret', name: 'Hidden Scrolls', emoji: '🔮', color: '#483D8B' }
};

// Achievement Definitions
const ACHIEVEMENTS = {
  // === BOOPING ACHIEVEMENTS ===
  first_boop: {
    id: 'first_boop',
    name: 'First Touch',
    description: 'Boop your first snoot',
    category: 'booping',
    condition: (state) => state.totalBoops >= 1,
    reward: { bp: 10 },
    emoji: '👆'
  },
  hundred_boops: {
    id: 'hundred_boops',
    name: 'Initiate Booper',
    description: 'Perform 100 boops',
    category: 'booping',
    condition: (state) => state.totalBoops >= 100,
    reward: { bp: 100 },
    emoji: '✋'
  },
  thousand_boops: {
    id: 'thousand_boops',
    name: 'Adept of the Snoot',
    description: 'Perform 1,000 boops',
    category: 'booping',
    condition: (state) => state.totalBoops >= 1000,
    reward: { bp: 500 },
    emoji: '🖐️'
  },
  ten_thousand_boops: {
    id: 'ten_thousand_boops',
    name: 'Master Booper',
    description: 'Perform 10,000 boops',
    category: 'booping',
    condition: (state) => state.totalBoops >= 10000,
    reward: { bp: 2500, jadeCatnip: 1 },
    emoji: '👊'
  },
  hundred_thousand_boops: {
    id: 'hundred_thousand_boops',
    name: 'Grandmaster of Snoots',
    description: 'Perform 100,000 boops',
    category: 'booping',
    condition: (state) => state.totalBoops >= 100000,
    reward: { bp: 10000, jadeCatnip: 5 },
    emoji: '🙌'
  },
  first_crit: {
    id: 'first_crit',
    name: 'Critical Hit!',
    description: 'Land your first critical boop',
    category: 'booping',
    condition: (state) => state.criticalBoops >= 1,
    reward: { bp: 50 },
    emoji: '💥'
  },
  crit_master: {
    id: 'crit_master',
    name: 'Meridian Striker',
    description: 'Land 100 critical boops',
    category: 'booping',
    condition: (state) => state.criticalBoops >= 100,
    reward: { bp: 1000 },
    emoji: '⚡'
  },
  combo_10: {
    id: 'combo_10',
    name: 'Combo Initiate',
    description: 'Reach a 10x combo',
    category: 'booping',
    condition: (state) => state.maxCombo >= 10,
    reward: { bp: 100 },
    emoji: '🔥'
  },
  combo_50: {
    id: 'combo_50',
    name: 'Chain Lightning',
    description: 'Reach a 50x combo',
    category: 'booping',
    condition: (state) => state.maxCombo >= 50,
    reward: { bp: 500 },
    emoji: '⚡'
  },
  combo_100: {
    id: 'combo_100',
    name: 'Unstoppable',
    description: 'Reach a 100x combo',
    category: 'booping',
    condition: (state) => state.maxCombo >= 100,
    reward: { bp: 2000, jadeCatnip: 1 },
    emoji: '🌟'
  },

  // === CAT ACHIEVEMENTS ===
  first_cat: {
    id: 'first_cat',
    name: 'First Disciple',
    description: 'Recruit your first cat',
    category: 'cats',
    condition: (state) => state.catCount >= 1,
    reward: { bp: 50 },
    emoji: '🐱'
  },
  ten_cats: {
    id: 'ten_cats',
    name: 'Growing Sect',
    description: 'Recruit 10 cats',
    category: 'cats',
    condition: (state) => state.catCount >= 10,
    reward: { bp: 500 },
    emoji: '🐱'
  },
  fifty_cats: {
    id: 'fifty_cats',
    name: 'Cat Army',
    description: 'Recruit 50 cats',
    category: 'cats',
    condition: (state) => state.catCount >= 50,
    reward: { bp: 2500, jadeCatnip: 2 },
    emoji: '😺'
  },
  hundred_cats: {
    id: 'hundred_cats',
    name: 'Cat Empire',
    description: 'Recruit 100 cats',
    category: 'cats',
    condition: (state) => state.catCount >= 100,
    reward: { bp: 10000, jadeCatnip: 5 },
    emoji: '😻'
  },
  earth_realm_cat: {
    id: 'earth_realm_cat',
    name: 'Earthly Cultivation',
    description: 'Recruit an Earth realm cat',
    category: 'cats',
    condition: (state) => state.hasRealmCat?.earth,
    reward: { bp: 200 },
    emoji: '🌍'
  },
  sky_realm_cat: {
    id: 'sky_realm_cat',
    name: 'Reaching the Sky',
    description: 'Recruit a Sky realm cat',
    category: 'cats',
    condition: (state) => state.hasRealmCat?.sky,
    reward: { bp: 1000 },
    emoji: '☁️'
  },
  heaven_realm_cat: {
    id: 'heaven_realm_cat',
    name: 'Heavenly Blessing',
    description: 'Recruit a Heaven realm cat',
    category: 'cats',
    condition: (state) => state.hasRealmCat?.heaven,
    reward: { bp: 5000, jadeCatnip: 1 },
    emoji: '✨'
  },
  divine_realm_cat: {
    id: 'divine_realm_cat',
    name: 'Divine Encounter',
    description: 'Recruit a Divine realm cat',
    category: 'cats',
    condition: (state) => state.hasRealmCat?.divine,
    reward: { bp: 25000, jadeCatnip: 5 },
    emoji: '👑'
  },
  all_schools: {
    id: 'all_schools',
    name: 'United Jianghu',
    description: 'Collect cats from all 8 schools',
    category: 'cats',
    condition: (state) => state.schoolsCollected >= 8,
    reward: { bp: 5000, jadeCatnip: 3 },
    emoji: '🏆'
  },

  // === WAIFU ACHIEVEMENTS ===
  first_bond: {
    id: 'first_bond',
    name: 'First Connection',
    description: 'Reach 10 bond with a waifu',
    category: 'waifus',
    condition: (state) => state.maxBondLevel >= 10,
    reward: { bp: 100, destinyThreads: 1 },
    emoji: '💕'
  },
  devoted_cultivator: {
    id: 'devoted_cultivator',
    name: 'Devoted Cultivator',
    description: 'Reach 50 bond with a waifu',
    category: 'waifus',
    condition: (state) => state.maxBondLevel >= 50,
    reward: { bp: 500, destinyThreads: 3 },
    emoji: '💖'
  },
  true_love: {
    id: 'true_love',
    name: 'True Love',
    description: 'Reach max bond (100) with a waifu',
    category: 'waifus',
    condition: (state) => state.maxBondLevel >= 100,
    reward: { bp: 2500, destinyThreads: 10 },
    emoji: '💗'
  },
  harem_protagonist: {
    id: 'harem_protagonist',
    name: 'Beloved by All',
    description: 'Unlock all 6 waifus',
    category: 'waifus',
    condition: (state) => state.waifusUnlocked >= 6,
    reward: { bp: 10000, jadeCatnip: 5 },
    emoji: '👑'
  },

  // === GOOSE ACHIEVEMENTS ===
  honk: {
    id: 'honk',
    name: 'Honk.',
    description: 'Boop your first Goose',
    category: 'goose',
    condition: (state) => state.gooseBoops >= 1,
    reward: { bp: 500, gooseFeathers: 1 },
    emoji: '🦢'
  },
  goose_hunter: {
    id: 'goose_hunter',
    name: 'Goose Hunter',
    description: 'Boop 10 Geese',
    category: 'goose',
    condition: (state) => state.gooseBoops >= 10,
    reward: { bp: 2000, gooseFeathers: 3 },
    emoji: '🎯'
  },
  peace_never_option: {
    id: 'peace_never_option',
    name: 'Peace Was Never An Option',
    description: 'Boop 100 Geese',
    category: 'goose',
    condition: (state) => state.gooseBoops >= 100,
    reward: { bp: 10000, gooseFeathers: 10 },
    emoji: '⚔️'
  },
  rage_goose: {
    id: 'rage_goose',
    name: 'The Negotiator',
    description: 'Boop a RAGE mode Goose',
    category: 'goose',
    condition: (state) => state.rageGooseBooped,
    reward: { bp: 5000, jadeCatnip: 2 },
    emoji: '😤'
  },
  cobra_chicken_slayer: {
    id: 'cobra_chicken_slayer',
    name: 'Cobra Chicken Slayer',
    description: 'Defeat the Avatar of Chaos',
    category: 'goose',
    condition: (state) => state.cobraChickenDefeated,
    reward: { bp: 25000, jadeCatnip: 10 },
    emoji: '🏆'
  },
  goose_whisperer: {
    id: 'goose_whisperer',
    name: 'Goose Whisperer',
    description: 'Recruit your first Goose Ally',
    category: 'goose',
    condition: (state) => state.gooseAlly !== null,
    reward: { bp: 5000 },
    emoji: '🤝'
  },
  hjönk: {
    id: 'hjönk',
    name: 'HJÖNK',
    description: 'Critical boop a Golden Goose',
    category: 'goose',
    condition: (state) => state.goldenGooseCrit,
    reward: { bp: 50000, goldenFeathers: 5 },
    emoji: '✨'
  },

  // === CULTIVATION ACHIEVEMENTS ===
  first_upgrade: {
    id: 'first_upgrade',
    name: 'Path of Power',
    description: 'Purchase your first upgrade',
    category: 'cultivation',
    condition: (state) => state.upgradesPurchased >= 1,
    reward: { bp: 50 },
    emoji: '⬆️'
  },
  technique_master: {
    id: 'technique_master',
    name: 'Technique Master',
    description: 'Max out any upgrade',
    category: 'cultivation',
    condition: (state) => state.maxedUpgrades >= 1,
    reward: { bp: 1000 },
    emoji: '🎓'
  },
  millionaire: {
    id: 'millionaire',
    name: 'Qi Millionaire',
    description: 'Accumulate 1,000,000 BP total',
    category: 'cultivation',
    condition: (state) => state.lifetimeBP >= 1000000,
    reward: { jadeCatnip: 5 },
    emoji: '💰'
  },
  afk_master: {
    id: 'afk_master',
    name: 'Meditation Master',
    description: 'Accumulate 24 hours of AFK time',
    category: 'cultivation',
    condition: (state) => state.totalAfkTime >= 86400000,
    reward: { bp: 5000 },
    emoji: '🧘'
  },

  // === SECRET ACHIEVEMENTS ===
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Perform 10 boops in 1 second',
    category: 'secret',
    hidden: true,
    condition: (state) => state.boopsPerSecondRecord >= 10,
    reward: { bp: 1000 },
    emoji: '💨'
  },
  night_owl: {
    id: 'night_owl',
    name: 'Night Cultivator',
    description: 'Play between 2 AM and 4 AM',
    category: 'secret',
    hidden: true,
    condition: (state) => state.nightOwl,
    reward: { bp: 500, destinyThreads: 1 },
    emoji: '🦉'
  },
  dedication: {
    id: 'dedication',
    name: 'True Dedication',
    description: 'Play for 7 consecutive days',
    category: 'secret',
    hidden: true,
    condition: (state) => state.consecutiveDays >= 7,
    reward: { jadeCatnip: 3 },
    emoji: '📅'
  }
};

/**
 * AchievementSystem - Tracks and awards achievements
 */
class AchievementSystem {
  constructor() {
    this.unlockedAchievements = new Set();
    this.recentUnlocks = [];
  }

  /**
   * Check all achievements against current state
   */
  checkAchievements(gameState, catSystem, waifuSystem, upgradeSystem) {
    // Build check state object
    const checkState = this.buildCheckState(gameState, catSystem, waifuSystem, upgradeSystem);

    const newUnlocks = [];

    for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
      // Skip if already unlocked
      if (this.unlockedAchievements.has(id)) continue;

      // Check condition
      if (achievement.condition(checkState)) {
        this.unlock(id);
        newUnlocks.push(achievement);
      }
    }

    return newUnlocks;
  }

  /**
   * Build a state object for checking conditions
   */
  buildCheckState(gameState, catSystem, waifuSystem, upgradeSystem) {
    // Count cats by realm
    const hasRealmCat = {};
    const schoolsCollected = new Set();

    if (catSystem) {
      for (const cat of catSystem.getAllCats()) {
        hasRealmCat[cat.realm] = true;
        schoolsCollected.add(cat.school);
      }
    }

    // Get max bond level
    let maxBondLevel = 0;
    let waifusUnlocked = 0;
    if (waifuSystem) {
      for (const waifu of waifuSystem.getUnlockedWaifus()) {
        maxBondLevel = Math.max(maxBondLevel, waifu.bondLevel);
        waifusUnlocked++;
      }
    }

    // Count upgrades
    let upgradesPurchased = 0;
    let maxedUpgrades = 0;
    if (upgradeSystem) {
      for (const [id, level] of Object.entries(upgradeSystem.purchasedUpgrades)) {
        if (level > 0) upgradesPurchased++;
        const template = upgradeSystem.templates[id];
        if (template && level >= template.maxLevel) maxedUpgrades++;
      }
    }

    // Check night owl
    const hour = new Date().getHours();
    const nightOwl = hour >= 2 && hour < 4;

    return {
      totalBoops: gameState.totalBoops || 0,
      criticalBoops: gameState.criticalBoops || 0,
      maxCombo: gameState.maxCombo || 0,
      catCount: catSystem ? catSystem.getCatCount() : 0,
      hasRealmCat,
      schoolsCollected: schoolsCollected.size,
      maxBondLevel,
      waifusUnlocked,
      gooseBoops: gameState.gooseBoops || 0,
      cobraChickenDefeated: gameState.cobraChickenDefeated || false,
      gooseAlly: gameState.gooseAlly,
      rageGooseBooped: gameState.rageGooseBooped || false,
      goldenGooseCrit: gameState.goldenGooseCrit || false,
      upgradesPurchased,
      maxedUpgrades,
      lifetimeBP: gameState.lifetimeBP || gameState.boopPoints,
      totalAfkTime: gameState.totalAfkTime || 0,
      boopsPerSecondRecord: gameState.boopsPerSecondRecord || 0,
      nightOwl,
      consecutiveDays: gameState.consecutiveDays || 0
    };
  }

  /**
   * Unlock an achievement
   */
  unlock(achievementId) {
    if (this.unlockedAchievements.has(achievementId)) return;

    this.unlockedAchievements.add(achievementId);
    const achievement = ACHIEVEMENTS[achievementId];

    if (achievement) {
      // Grant rewards
      this.grantReward(achievement.reward);

      // Add to recent unlocks for display
      this.recentUnlocks.push({
        achievement,
        timestamp: Date.now()
      });

      // Show notification
      this.showUnlockNotification(achievement);

      // Play achievement sound
      if (window.audioSystem) {
        window.audioSystem.playSFX('achievement');
      }
    }
  }

  /**
   * Grant achievement reward
   */
  grantReward(reward) {
    if (!reward || !window.gameState) return;

    if (reward.bp) window.gameState.boopPoints += reward.bp;
    if (reward.pp) window.gameState.purrPower += reward.pp;
    if (reward.jadeCatnip) window.gameState.jadeCatnip += reward.jadeCatnip;
    if (reward.destinyThreads) window.gameState.destinyThreads += reward.destinyThreads;
    if (reward.gooseFeathers) window.gameState.gooseFeathers += reward.gooseFeathers;
    if (reward.goldenFeathers) window.gameState.goldenFeathers += reward.goldenFeathers;
  }

  /**
   * Show unlock notification
   */
  showUnlockNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-badge">${achievement.emoji}</div>
      <div class="achievement-info">
        <span class="achievement-unlocked">Achievement Unlocked!</span>
        <span class="achievement-name">${achievement.name}</span>
        <span class="achievement-desc">${achievement.description}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('visible'), 10);
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }

  /**
   * Get all achievements by category
   */
  getAchievementsByCategory(categoryId) {
    return Object.values(ACHIEVEMENTS).filter(a => a.category === categoryId);
  }

  /**
   * Get unlock progress
   */
  getProgress() {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = this.unlockedAchievements.size;
    return { unlocked, total, percent: Math.floor((unlocked / total) * 100) };
  }

  /**
   * Check if achievement is unlocked
   */
  isUnlocked(achievementId) {
    return this.unlockedAchievements.has(achievementId);
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      unlockedAchievements: Array.from(this.unlockedAchievements)
    };
  }

  /**
   * Load from save
   */
  deserialize(data) {
    if (data.unlockedAchievements) {
      this.unlockedAchievements = new Set(data.unlockedAchievements);
    }
  }
}

// Export
window.ACHIEVEMENT_CATEGORIES = ACHIEVEMENT_CATEGORIES;
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.AchievementSystem = AchievementSystem;
