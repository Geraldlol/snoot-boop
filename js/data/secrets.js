/**
 * secrets.js - Easter Eggs System
 * "The masters hid many treasures for the worthy."
 *
 * Snoot Booper: Idle Wuxia Cat Sanctuary
 */

// ===================================
// SECRET DEFINITIONS
// ===================================

const SECRETS = {
  // Luna's moon secret
  moonSecret: {
    id: 'moonSecret',
    name: "Luna's Moonbeam",
    description: "Clicked the moon 100 times",
    trigger: 'moonClicks',
    threshold: 100,
    rewards: {
      cosmetic: 'moonbeam_aura',
      dialogue: true
    }
  },

  // Nyan cat easter egg
  nyanCat: {
    id: 'nyanCat',
    name: 'Nyan~',
    description: "Named a cat 'nyan'",
    trigger: 'catName',
    pattern: /^nyan$/i,
    rewards: {
      trail: 'rainbow',
      achievement: 'nyan_easter_egg'
    }
  },

  // Konami code
  konamiCode: {
    id: 'konamiCode',
    name: 'RETRO MODE',
    description: 'Entered the Konami code',
    trigger: 'keySequence',
    sequence: ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'],
    rewards: {
      visualMode: 'retro',
      achievement: 'konami_master'
    }
  },

  // Nice number
  niceNumber: {
    id: 'niceNumber',
    name: 'Nice.',
    description: 'Had exactly 69420 BP',
    trigger: 'bpValue',
    value: 69420,
    rewards: {
      achievement: 'nice'
    }
  },

  // AFK mystery cat
  afkMystery: {
    id: 'afkMystery',
    name: 'The Patient One',
    description: "Didn't boop for 10 minutes",
    trigger: 'afkTime',
    duration: 600000, // 10 minutes
    rewards: {
      cat: 'mystery_cat'
    }
  },

  // Nik fourth wall break
  nikFourthWall: {
    id: 'nikFourthWall',
    name: '...!',
    description: "Caught Nik looking at you",
    trigger: 'random',
    chance: 0.01, // 1%
    context: 'viewingNik',
    rewards: {
      achievement: 'fourth_wall_break',
      cosmetic: 'nik_stare'
    }
  },

  // Mochi playtime warning
  mochiWarning: {
    id: 'mochiWarning',
    name: 'Take a Break~',
    description: "Played for 5 hours straight",
    trigger: 'sessionTime',
    duration: 18000000, // 5 hours
    character: 'mochi',
    recurring: true
  },

  // Goose steals UI
  gooseStealUI: {
    id: 'gooseStealUI',
    name: 'HONK!',
    description: 'A goose stole part of your UI',
    trigger: 'random',
    chance: 0.001, // 0.1%
    elements: ['boop_button', 'resource_counter', 'settings_icon', 'cat_display'],
    duration: 5000
  },

  // Hidden cat combos
  ceilingBasement: {
    id: 'ceilingBasement',
    name: 'Full Perspective',
    description: 'Own both Ceiling Cat and Basement Cat',
    trigger: 'catCombo',
    required: ['ceiling_god', 'basement_cat'],
    rewards: {
      ability: 'universal_vision',
      achievement: 'full_perspective'
    }
  },

  // All masters befriended
  allMastersBond: {
    id: 'allMastersBond',
    name: 'The Eighth Bond',
    description: 'Played as all seven masters',
    trigger: 'allMastersPlayed',
    minHours: 1,
    rewards: {
      hint: 'eighth_master',
      title: 'Friend of All Masters'
    }
  },

  // Goose alliance
  gooseAlliance: {
    id: 'gooseAlliance',
    name: 'Chaotic Good',
    description: 'Recruited a goose ally while owning 50+ cats',
    trigger: 'condition',
    conditions: ['gooseAlly', 'cats50'],
    rewards: {
      achievement: 'chaotic_neutral',
      dialogue: 'goose_cat_peace'
    }
  },

  // Speed demon
  speedBoop: {
    id: 'speedBoop',
    name: 'Speed Demon',
    description: 'Booped 100 times in 10 seconds',
    trigger: 'boopSpeed',
    count: 100,
    window: 10000,
    rewards: {
      achievement: 'speed_demon',
      title: 'Lightning Fingers'
    }
  },

  // Patience master
  slowBoop: {
    id: 'slowBoop',
    name: 'Patience Incarnate',
    description: 'Waited exactly 60 seconds between boops',
    trigger: 'boopTiming',
    exactDelay: 60000,
    tolerance: 500,
    rewards: {
      achievement: 'patience_incarnate',
      technique: 'measured_boop'
    }
  }
};

// Mystery cat definition
const MYSTERY_CAT = {
  id: 'mystery_cat',
  name: '??? Cat',
  title: 'The Patient One',
  description: 'This cat only appears to those who wait...',
  realm: 'divine',
  rarity: 'secret',
  element: 'void',
  baseStats: {
    snootMeridians: 5.0,
    innerPurr: 10.0,
    floofArmor: 5.0,
    zoomieSteps: 1.0,
    loafMastery: 10.0
  },
  passive: {
    name: 'Patience Rewarded',
    description: 'AFK gains increased by 50%',
    effect: { afkMultiplier: 1.5 }
  },
  quotes: [
    '...',
    '*waits*',
    'Mrrp. (Good things come to those who wait.)'
  ]
};

// ===================================
// SECRET SYSTEM CLASS
// ===================================

class SecretSystem {
  constructor(gameState) {
    this.gameState = gameState;

    // Tracking variables
    this.moonClicks = 0;
    this.konamiProgress = 0;
    this.lastBoopTime = Date.now();
    this.sessionStartTime = Date.now();
    this.boopTimestamps = [];
    this.lastWarningTime = 0;

    // Discovered secrets
    this.discoveredSecrets = [];

    // Stats
    this.stats = {
      secretsFound: 0,
      moonClicksTotal: 0,
      konamiAttempts: 0,
      nikStares: 0,
      gooseSteals: 0
    };
  }

  /**
   * Handle moon click for Luna's secret
   * @returns {Object|null} Secret trigger result
   */
  onMoonClick() {
    this.moonClicks++;
    this.stats.moonClicksTotal++;

    if (this.moonClicks >= 100 && !this.isSecretDiscovered('moonSecret')) {
      return this.triggerLunaSecret();
    }

    // Provide feedback at milestones
    if (this.moonClicks === 25) {
      return { type: 'hint', message: 'The moon glimmers softly...' };
    }
    if (this.moonClicks === 50) {
      return { type: 'hint', message: 'Luna seems to notice your interest...' };
    }
    if (this.moonClicks === 75) {
      return { type: 'hint', message: "You feel Luna's gaze upon you..." };
    }

    return null;
  }

  /**
   * Trigger Luna's moon secret
   * @returns {Object} Secret result
   */
  triggerLunaSecret() {
    this.discoverSecret('moonSecret');

    // Grant cosmetic
    this.gameState.cosmeticsOwned = this.gameState.cosmeticsOwned || [];
    if (!this.gameState.cosmeticsOwned.includes('moonbeam_aura')) {
      this.gameState.cosmeticsOwned.push('moonbeam_aura');
    }

    return {
      type: 'secret',
      id: 'moonSecret',
      title: 'Luna noticed you...',
      message: '"You... like the moon too? *sleepy smile* Here, take this..."',
      reward: { cosmetic: 'moonbeam_aura' },
      character: 'luna',
      animation: 'luna_special'
    };
  }

  /**
   * Handle cat being named
   * @param {Object} cat - Cat object
   * @param {string} name - New name
   * @returns {Object|null} Secret trigger result
   */
  onCatNamed(cat, name) {
    const normalizedName = name.toLowerCase().trim();

    // Check for 'nyan' easter egg
    if (normalizedName === 'nyan' && !cat.permanentTrail) {
      cat.permanentTrail = 'rainbow';

      if (!this.isSecretDiscovered('nyanCat')) {
        this.discoverSecret('nyanCat');

        return {
          type: 'secret',
          id: 'nyanCat',
          title: 'Nyan~',
          message: `${cat.name} has been blessed with the legendary rainbow trail!`,
          reward: { trail: 'rainbow' },
          animation: 'rainbow_burst',
          sound: 'nyan_music'
        };
      }
    }

    // Check for other name-based secrets
    if (normalizedName === 'ceiling cat' || normalizedName === 'ceilingcat') {
      return {
        type: 'hint',
        message: 'Ceiling Cat watches over all snoots...'
      };
    }

    if (normalizedName === 'honk' || normalizedName === 'goose') {
      return {
        type: 'hint',
        message: 'HONK! ...wait, that was a cat, not a goose.'
      };
    }

    return null;
  }

  /**
   * Check Konami code input
   * @param {string} key - Key pressed ('up', 'down', 'left', 'right', 'a', 'b')
   * @returns {Object|null} Secret trigger result
   */
  checkKonamiCode(key) {
    const KONAMI = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

    if (key === KONAMI[this.konamiProgress]) {
      this.konamiProgress++;

      if (this.konamiProgress >= KONAMI.length) {
        this.konamiProgress = 0;
        this.stats.konamiAttempts++;

        if (!this.isSecretDiscovered('konamiCode')) {
          return this.activateRetroMode();
        } else {
          // Toggle retro mode if already discovered
          this.gameState.visualMode = this.gameState.visualMode === 'retro' ? 'normal' : 'retro';
          return {
            type: 'toggle',
            mode: this.gameState.visualMode,
            message: this.gameState.visualMode === 'retro' ? 'RETRO MODE ACTIVATED!' : 'Normal mode restored.'
          };
        }
      }
    } else {
      this.konamiProgress = 0;
    }

    return null;
  }

  /**
   * Activate retro visual mode
   * @returns {Object} Secret result
   */
  activateRetroMode() {
    this.discoverSecret('konamiCode');
    this.gameState.visualMode = 'retro';

    return {
      type: 'secret',
      id: 'konamiCode',
      title: '[ RETRO MODE ACTIVATED ]',
      message: 'The ancient ways have been restored!',
      reward: { visualMode: 'retro' },
      animation: 'screen_flash',
      sound: 'retro_chime'
    };
  }

  /**
   * Check for the nice number (69420 BP)
   * @returns {Object|null} Secret trigger result
   */
  checkNiceNumber() {
    if (this.gameState.boopPoints === 69420 && !this.isSecretDiscovered('niceNumber')) {
      this.discoverSecret('niceNumber');

      // Unlock achievement
      if (this.gameState.achievements?.unlock) {
        this.gameState.achievements.unlock('nice');
      }

      return {
        type: 'secret',
        id: 'niceNumber',
        title: 'Nice.',
        message: '( \u0361\u00b0 \u035c\u0296 \u0361\u00b0)',
        reward: { achievement: 'nice' },
        animation: 'nice_sparkle'
      };
    }

    return null;
  }

  /**
   * Check for AFK mystery cat (10 minutes no boop)
   * @returns {Object|null} Secret trigger result
   */
  checkAFKCat() {
    const timeSinceLastBoop = Date.now() - this.lastBoopTime;

    // 10 minutes of no booping
    if (timeSinceLastBoop >= 600000 && !this.isSecretDiscovered('afkMystery')) {
      return this.spawnMysteriousCat();
    }

    return null;
  }

  /**
   * Spawn the mysterious AFK cat
   * @returns {Object} Secret result
   */
  spawnMysteriousCat() {
    this.discoverSecret('afkMystery');

    // Add the mystery cat to game state
    const mysteryCat = { ...MYSTERY_CAT, obtainedAt: Date.now() };
    this.gameState.cats = this.gameState.cats || [];
    this.gameState.cats.push(mysteryCat);

    return {
      type: 'secret',
      id: 'afkMystery',
      title: 'A presence emerges from the stillness...',
      message: '??? Cat has joined your sect! Sometimes, the best cultivation is no cultivation at all.',
      reward: { cat: mysteryCat },
      animation: 'fade_in_mysterious',
      sound: 'mystery_chime'
    };
  }

  /**
   * Check for Nik fourth wall break
   * @returns {Object|null} Secret trigger result
   */
  checkNikFourthWall() {
    // 1% chance when viewing Nik
    if (Math.random() < 0.01) {
      this.stats.nikStares++;

      const firstTime = !this.isSecretDiscovered('nikFourthWall');
      if (firstTime) {
        this.discoverSecret('nikFourthWall');
      }

      return {
        type: firstTime ? 'secret' : 'event',
        id: 'nikFourthWall',
        sprite: 'nik_fourth_wall.png',
        duration: 500,
        message: firstTime ? 'Nik... is looking directly at you.' : null,
        firstTime: firstTime
      };
    }

    return null;
  }

  /**
   * Check for Mochi's playtime warning (5 hours)
   * @returns {Object|null} Warning message result
   */
  checkMochiPlaytimeWarning() {
    const sessionTime = Date.now() - this.sessionStartTime;
    const FIVE_HOURS = 5 * 60 * 60 * 1000;
    const WARNING_COOLDOWN = 30 * 60 * 1000; // 30 minutes between warnings

    if (sessionTime >= FIVE_HOURS) {
      // Only warn every 30 minutes
      if (Date.now() - this.lastWarningTime >= WARNING_COOLDOWN) {
        this.lastWarningTime = Date.now();

        const messages = [
          "You've been cultivating for quite a while, nya~ Maybe take a break? I'll watch the cats for you!",
          "Ah, still here? Your dedication is admirable, but even masters need rest~",
          "The cats are starting to worry about you... and so am I! Take a break, okay?",
          "*gently places tea in front of you* ...This is a hint. Please rest.",
          "The Celestial Snoot Sect will still be here when you return! Go stretch those legs~"
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];

        return {
          type: 'warning',
          character: 'mochi',
          title: 'Take a Break~',
          message: message,
          sprite: 'mochi_concerned.png',
          sessionTime: sessionTime
        };
      }
    }

    return null;
  }

  /**
   * Check for goose stealing UI element
   * @returns {Object|null} Goose steal result
   */
  onGooseStealUI() {
    // 0.1% chance (very rare)
    if (Math.random() < 0.001) {
      this.stats.gooseSteals++;

      const elements = ['boop_button', 'resource_counter', 'settings_icon', 'cat_display'];
      const stolenElement = elements[Math.floor(Math.random() * elements.length)];

      return {
        type: 'goose_steal',
        stolenElement: stolenElement,
        duration: 5000,
        message: 'HONK! *waddles away with your ' + stolenElement.replace('_', ' ') + '*',
        animation: 'goose_waddle',
        sound: 'honk_menacing'
      };
    }

    return null;
  }

  /**
   * Record a boop timestamp for speed tracking
   */
  onBoop() {
    const now = Date.now();
    this.lastBoopTime = now;
    this.boopTimestamps.push(now);

    // Keep only last 10 seconds of boops
    const cutoff = now - 10000;
    this.boopTimestamps = this.boopTimestamps.filter(t => t > cutoff);

    // Check for speed demon (100 boops in 10 seconds)
    if (this.boopTimestamps.length >= 100 && !this.isSecretDiscovered('speedBoop')) {
      this.discoverSecret('speedBoop');
      return {
        type: 'secret',
        id: 'speedBoop',
        title: 'SPEED DEMON!',
        message: '100 boops in 10 seconds! Your fingers are blessed by Thunder Step himself!',
        reward: { achievement: 'speed_demon', title: 'Lightning Fingers' }
      };
    }

    return null;
  }

  /**
   * Check for patience secret (exactly 60 second delay)
   * @param {number} timeSinceLast - Time since last boop in ms
   * @returns {Object|null} Secret trigger result
   */
  checkPatienceBoop(timeSinceLast) {
    const TARGET = 60000;
    const TOLERANCE = 500;

    if (Math.abs(timeSinceLast - TARGET) <= TOLERANCE && !this.isSecretDiscovered('slowBoop')) {
      this.discoverSecret('slowBoop');
      return {
        type: 'secret',
        id: 'slowBoop',
        title: 'Patience Incarnate',
        message: 'You waited exactly 60 seconds. Scott would be proud.',
        reward: { achievement: 'patience_incarnate', technique: 'measured_boop' }
      };
    }

    return null;
  }

  /**
   * Check if a secret has been discovered
   * @param {string} secretId - Secret ID
   * @returns {boolean} Whether secret is discovered
   */
  isSecretDiscovered(secretId) {
    return this.discoveredSecrets.includes(secretId);
  }

  /**
   * Mark a secret as discovered
   * @param {string} secretId - Secret ID
   */
  discoverSecret(secretId) {
    if (!this.discoveredSecrets.includes(secretId)) {
      this.discoveredSecrets.push(secretId);
      this.stats.secretsFound++;
    }
  }

  /**
   * Get all discovered secrets with their data
   * @returns {Array} Discovered secrets
   */
  getDiscoveredSecrets() {
    return this.discoveredSecrets.map(id => ({
      id,
      ...SECRETS[id]
    }));
  }

  /**
   * Get total secret count
   * @returns {Object} Count info
   */
  getSecretProgress() {
    const total = Object.keys(SECRETS).length;
    const found = this.discoveredSecrets.length;
    return {
      found,
      total,
      percentage: Math.floor((found / total) * 100)
    };
  }

  /**
   * Update method - called each game tick
   * @returns {Array} Any triggered secrets/events
   */
  update() {
    const results = [];

    // Check AFK cat
    const afkResult = this.checkAFKCat();
    if (afkResult) results.push(afkResult);

    // Check nice number
    const niceResult = this.checkNiceNumber();
    if (niceResult) results.push(niceResult);

    // Check Mochi warning
    const mochiResult = this.checkMochiPlaytimeWarning();
    if (mochiResult) results.push(mochiResult);

    // Random goose UI steal
    const gooseResult = this.onGooseStealUI();
    if (gooseResult) results.push(gooseResult);

    return results;
  }

  /**
   * Reset session timer (for tracking playtime warnings)
   */
  resetSession() {
    this.sessionStartTime = Date.now();
    this.lastWarningTime = 0;
  }

  /**
   * Serialize for save
   * @returns {Object} Serialized data
   */
  serialize() {
    return {
      moonClicks: this.moonClicks,
      discoveredSecrets: this.discoveredSecrets,
      stats: this.stats,
      lastBoopTime: this.lastBoopTime
    };
  }

  /**
   * Deserialize from save
   * @param {Object} data - Saved data
   */
  deserialize(data) {
    if (!data) return;

    this.moonClicks = data.moonClicks || 0;
    this.discoveredSecrets = data.discoveredSecrets || [];
    this.stats = data.stats || {
      secretsFound: 0,
      moonClicksTotal: 0,
      konamiAttempts: 0,
      nikStares: 0,
      gooseSteals: 0
    };
    this.lastBoopTime = data.lastBoopTime || Date.now();
  }

  /**
   * Reset for prestige (preserves discovered secrets)
   */
  reset() {
    // Keep discovered secrets as permanent progress
    // Reset session-specific state
    this.moonClicks = 0;
    this.lastBoopTime = Date.now();
    this.sessionStartTime = Date.now();
    this.lastWarningTime = 0;
  }
}

// ===================================
// KEYBOARD INPUT HANDLER FOR KONAMI
// ===================================

/**
 * Convert keyboard event to konami key
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {string|null} Konami key or null
 */
function keyToKonami(event) {
  const keyMap = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'KeyB': 'b',
    'KeyA': 'a',
    'b': 'b',
    'B': 'b',
    'a': 'a',
    'A': 'a'
  };
  return keyMap[event.code] || keyMap[event.key] || null;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SECRETS, MYSTERY_CAT, SecretSystem, keyToKonami };
}

// Also make available globally
window.SECRETS = SECRETS;
window.MYSTERY_CAT = MYSTERY_CAT;
window.SecretSystem = SecretSystem;
window.keyToKonami = keyToKonami;

console.log('Snoot Booper: secrets.js loaded - "The masters hid many treasures for the worthy."');
