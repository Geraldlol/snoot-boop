/**
 * save.js - Save/Load System
 * "The wise cultivator preserves their progress."
 */

const SaveSystem = {
  SAVE_KEY: 'celestial_snoot_sect',
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  VERSION: '2.1.0',
  MAX_AFK_TIME: 24 * 60 * 60 * 1000, // 24 hours

  autoSaveTimer: null,

  /**
   * Save the game state
   */
  save(gameState, masterSystem, catSystem, waifuSystem, upgradeSystem) {
    // Get goose and achievement systems from window
    const gooseSystem = window.gooseSystem;
    const achievementSystem = window.achievementSystem;

    const data = {
      version: this.VERSION,
      timestamp: Date.now(),

      // Core state
      master: masterSystem.selectedMaster?.id || null,

      // Resources
      resources: {
        bp: gameState.boopPoints,
        pp: gameState.purrPower,
        jadeCatnip: gameState.jadeCatnip || 0,
        destinyThreads: gameState.destinyThreads || 0,
        gooseFeathers: gameState.gooseFeathers || 0,
        goldenFeathers: gameState.goldenFeathers || 0
      },

      // Stats
      stats: {
        totalBoops: gameState.totalBoops,
        maxCombo: gameState.maxCombo,
        playtime: gameState.playtime || 0,
        criticalBoops: gameState.criticalBoops || 0,
        gooseBoops: gameState.gooseBoops || 0,
        totalAfkTime: gameState.totalAfkTime || 0,
        rageGooseBooped: gameState.rageGooseBooped || false,
        goldenGooseCrit: gameState.goldenGooseCrit || false
      },

      // Systems
      cats: catSystem.serialize(),
      waifus: waifuSystem.serialize(),
      upgrades: upgradeSystem.serialize(),

      // Goose system
      goose: gooseSystem ? gooseSystem.serialize() : {
        gooseBoops: gameState.gooseBoops || 0,
        cobraChickenDefeated: gameState.cobraChickenDefeated || false,
        gooseAlly: gameState.gooseAlly || null
      },

      // Achievements
      achievements: achievementSystem ? achievementSystem.serialize() : { unlockedAchievements: [] },

      // Expeditions
      expeditions: window.expeditionSystem ? window.expeditionSystem.serialize() : { activeExpeditions: [], expeditionHistory: [] },

      // Prestige
      prestige: window.prestigeSystem ? window.prestigeSystem.serialize() : { currentTier: 0, totalRebirths: 0, lifetimeBP: 0, unlockedPerks: [] },

      // Phase 3 Systems
      elemental: window.elementalSystem ? window.elementalSystem.serialize() : { reactionHistory: [] },
      equipment: window.equipmentSystem ? window.equipmentSystem.serialize() : { inventory: [], equipped: {}, nextId: 1 },
      crafting: window.craftingSystem ? window.craftingSystem.serialize() : { materials: {}, blueprints: {}, craftingQueue: [] },
      pagoda: window.pagodaSystem ? window.pagodaSystem.serialize() : { highestFloor: 0, tokens: 0, upgrades: {}, stats: {}, runHistory: [] },
      blessings: window.blessingSystem ? window.blessingSystem.serialize() : { permanentBlessings: [], stats: {} },
      survival: window.waveSurvivalSystem ? window.waveSurvivalSystem.serialize() : { stats: {}, unlocks: [] },
      goldenSnoot: window.goldenSnootSystem ? window.goldenSnootSystem.serialize() : { stats: {} },
      daily: window.dailySystem ? window.dailySystem.serialize() : { commissions: [], currentStreak: 0, stats: {} },
      parasites: window.parasiteSystem ? window.parasiteSystem.serialize() : { parasites: [], upgrades: {}, stats: {} },

      // POST-LAUNCH Systems
      irlIntegration: window.irlIntegrationSystem ? window.irlIntegrationSystem.serialize() : { stats: {} },
      drama: window.dramaSystem ? window.dramaSystem.serialize() : { drama: 0, relations: {}, stats: {} },
      nemesis: window.nemesisSystem ? window.nemesisSystem.serialize() : { nemeses: [], defeatedNemeses: [], defectedNemeses: [], stats: {} },
      catino: window.catinoSystem ? window.catinoSystem.serialize() : { chips: 0, stats: {} },
      hardcore: window.hardcoreSystem ? window.hardcoreSystem.serialize() : { completedModes: [], stats: {} },
      partners: window.partnerGenerator ? window.partnerGenerator.serialize() : { ownedPartners: [], stats: {} }
    };

    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
      this.showSaveIndicator();
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  },

  /**
   * Load the game state
   */
  load() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return null;

      const data = JSON.parse(raw);
      return this.migrate(data);
    } catch (e) {
      console.error('Load failed:', e);
      return null;
    }
  },

  /**
   * Migrate save data to current version
   */
  migrate(data) {
    if (!data.version) {
      data.version = '0.0.1';
    }

    // Migrate from 1.x to 2.0.0 (Phase 3 systems)
    if (data.version.startsWith('1.') || data.version === '0.0.1') {
      // Add Phase 3 system defaults
      data.elemental = data.elemental || { reactionHistory: [] };
      data.equipment = data.equipment || { inventory: [], equipped: {}, nextId: 1 };
      data.crafting = data.crafting || { materials: {}, blueprints: {}, craftingQueue: [] };
      data.pagoda = data.pagoda || { highestFloor: 0, tokens: 0, upgrades: {}, stats: {}, runHistory: [] };
      data.blessings = data.blessings || { permanentBlessings: [], stats: {} };
      data.survival = data.survival || { stats: {}, unlocks: [] };
      data.goldenSnoot = data.goldenSnoot || { stats: {} };
      data.daily = data.daily || { commissions: [], currentStreak: 0, stats: {} };
      data.parasites = data.parasites || { parasites: [], upgrades: {}, stats: {} };
      data.version = '2.0.0';
      console.log('Migrated save to version 2.0.0 (Phase 3 systems)');
    }

    // Migrate to 2.1.0 (POST-LAUNCH systems)
    if (data.version === '2.0.0') {
      data.irlIntegration = data.irlIntegration || { stats: {} };
      data.drama = data.drama || { drama: 0, relations: {}, stats: {} };
      data.nemesis = data.nemesis || { nemeses: [], defeatedNemeses: [], defectedNemeses: [], stats: {} };
      data.catino = data.catino || { chips: 0, stats: {} };
      data.hardcore = data.hardcore || { completedModes: [], stats: {} };
      data.partners = data.partners || { ownedPartners: [], stats: {} };
      data.version = '2.1.0';
      console.log('Migrated save to version 2.1.0 (POST-LAUNCH systems)');
    }

    console.log(`Loaded save version ${data.version}`);
    return data;
  },

  /**
   * Calculate AFK gains since last save
   */
  calculateAFKGains(saveData, masterSystem, catSystem, waifuSystem, upgradeSystem) {
    if (!saveData || !saveData.timestamp) return null;

    const now = Date.now();
    const elapsed = Math.min(now - saveData.timestamp, this.MAX_AFK_TIME);
    const seconds = elapsed / 1000;

    if (seconds < 60) return null; // Less than a minute, skip

    // Calculate PP generated while away
    let basePP = catSystem.calculatePPPerSecond(masterSystem.getPassiveEffects({}));

    // Apply waifu bonuses
    const waifuBonuses = waifuSystem.getCombinedBonuses();
    basePP *= waifuBonuses.ppMultiplier;
    basePP *= waifuBonuses.afkMultiplier;

    // Apply upgrade bonuses
    const upgradeEffects = upgradeSystem.getCombinedEffects();
    basePP *= upgradeEffects.ppMultiplier;
    basePP *= upgradeEffects.afkMultiplier;

    // Apply master AFK bonus (Steve)
    const masterEffects = masterSystem.getPassiveEffects({});
    if (masterEffects.afkMultiplier) {
      basePP *= masterEffects.afkMultiplier;
    }

    const totalPP = basePP * seconds;

    // Calculate passive BP from upgrades
    const passiveBP = upgradeEffects.passiveBpPerSecond * seconds;

    // Generate AFK events
    const events = this.generateAFKEvents(elapsed, masterSystem, catSystem);

    return {
      timeAway: elapsed,
      timeAwayFormatted: this.formatTime(elapsed),
      ppGained: totalPP,
      bpGained: passiveBP,
      events: events,
      message: this.generateReturnMessage(elapsed, totalPP, events, masterSystem)
    };
  },

  /**
   * Generate random events that happened while away
   */
  generateAFKEvents(elapsed, masterSystem, catSystem) {
    const events = [];
    const hours = elapsed / (1000 * 60 * 60);

    // Event chance per hour
    const eventChance = 0.3;
    const masterEffects = masterSystem.getPassiveEffects({});
    const eventBonus = masterEffects.eventDiscoveryBonus || 1;

    for (let i = 0; i < Math.floor(hours); i++) {
      if (Math.random() < eventChance * eventBonus) {
        events.push(this.pickRandomEvent());
      }
    }

    // Chance for stray cat (Andrew's bonus helps)
    const strayCatChance = 0.02 * hours * (masterEffects.rareCatBonus || 1);
    if (Math.random() < strayCatChance && catSystem.getCatCount() < 100) {
      events.push({
        type: 'stray_cat',
        message: 'A wandering cat joined your sect!',
        emoji: '🐱'
      });
    }

    return events;
  },

  /**
   * Pick a random AFK event
   */
  pickRandomEvent() {
    const events = [
      { type: 'meditation', message: 'Cats achieved group meditation!', emoji: '🧘', ppBonus: 100 },
      { type: 'visitor', message: 'A merchant visited with gifts!', emoji: '🎁', bpBonus: 50 },
      { type: 'zoomies', message: 'Mass zoomies outbreak!', emoji: '💨', happinessBonus: 10 },
      { type: 'sunbeam', message: 'Perfect sunbeam alignment!', emoji: '☀️', ppBonus: 50 },
      { type: 'treat', message: 'Mysterious treats appeared!', emoji: '🐟', happinessBonus: 5 }
    ];

    return events[Math.floor(Math.random() * events.length)];
  },

  /**
   * Generate return message
   */
  generateReturnMessage(elapsed, pp, events, masterSystem) {
    const master = masterSystem.selectedMaster;
    const timeStr = this.formatTime(elapsed);

    let message = `Welcome back, cultivator!\n`;
    message += `You were away for ${timeStr}.\n`;
    message += `Your cats generated ${this.formatNumber(pp)} PP!\n`;

    if (events.length > 0) {
      message += `\n${events.length} event(s) occurred while you were away.`;
    }

    return message;
  },

  /**
   * Format time duration
   */
  formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },

  /**
   * Format large numbers
   */
  formatNumber(n) {
    if (n < 1000) return Math.floor(n).toString();
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qi'];
    const tier = Math.min(Math.floor(Math.log10(n) / 3), suffixes.length - 1);
    return (n / Math.pow(10, tier * 3)).toFixed(1) + suffixes[tier];
  },

  /**
   * Start auto-save timer
   */
  startAutoSave(saveCallback) {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      saveCallback();
    }, this.AUTO_SAVE_INTERVAL);
  },

  /**
   * Stop auto-save
   */
  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  },

  /**
   * Show save indicator
   */
  showSaveIndicator() {
    const indicator = document.getElementById('save-indicator');
    if (indicator) {
      indicator.classList.add('visible');
      setTimeout(() => indicator.classList.remove('visible'), 2000);
    }
  },

  /**
   * Export save for sharing
   */
  exportSave() {
    const raw = localStorage.getItem(this.SAVE_KEY);
    if (!raw) return null;
    return btoa(raw);
  },

  /**
   * Import save from shared string
   */
  importSave(encoded) {
    try {
      const decoded = atob(encoded);
      const data = JSON.parse(decoded);

      if (!this.validateSave(data)) {
        throw new Error('Invalid save data');
      }

      localStorage.setItem(this.SAVE_KEY, decoded);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  /**
   * Validate save data structure
   */
  validateSave(data) {
    return data &&
           data.version &&
           data.timestamp &&
           data.resources &&
           typeof data.resources.bp === 'number';
  },

  /**
   * Delete save data
   */
  deleteSave() {
    localStorage.removeItem(this.SAVE_KEY);
  },

  /**
   * Check if a save exists
   */
  hasSave() {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }
};

// Export
window.SaveSystem = SaveSystem;
