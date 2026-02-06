/**
 * DataLoader - JSON Data Loading Utility for Snoot Booper
 *
 * "The Sect's knowledge is vast. This scroll helps you access it."
 * -- The Celestial Snoot Scripture
 *
 * Loads all game data JSON files with caching, error handling,
 * and fallback support for local (file://) testing.
 *
 * Events emitted via eventBus:
 * - 'dataLoaded' - When all data files have been loaded { loaded, failed, timestamp }
 */

class DataLoader {
  constructor() {
    // Data cache - Map for efficient key/value storage
    this._cache = new Map();

    // Loading state
    this._loaded = false;
    this._loading = false;
    this._loadPromise = null;

    // Legacy compatibility - object-based storage
    this.loadedData = {};
    this.loadPromises = {};
    this.isReady = {};
    this.errors = {};
    this.pendingCallbacks = {};

    // Ready callbacks (for loadAll completion)
    this._readyCallbacks = [];

    // List of all data files to load
    this._dataFiles = [
      'masters',
      'cats',
      'waifus',
      'techniques',
      'cultivation',
      'equipment',
      'relics',
      'enemies',
      'events',
      'achievements',
      'lore',
      'balance'
    ];

    // Base path for data files (relative to document root)
    this._basePath = 'data/';

    // Detect file:// protocol for local testing
    this._isLocalFile = typeof window !== 'undefined' &&
      window.location.protocol === 'file:';

    // Debug mode
    this._debug = false;
  }

  /**
   * Set debug mode
   * @param {boolean} enabled
   */
  setDebug(enabled) {
    this._debug = enabled;
    if (enabled) {
      console.log('[DataLoader] Debug mode enabled');
    }
  }

  /**
   * Set the base path for data files
   * @param {string} path
   */
  setBasePath(path) {
    this._basePath = path.endsWith('/') ? path : path + '/';
  }

  /**
   * Check if all data has been loaded via loadAll()
   * @returns {boolean}
   */
  isLoaded() {
    return this._loaded;
  }

  /**
   * Check if data is currently loading
   * @returns {boolean}
   */
  isLoading() {
    return this._loading;
  }

  /**
   * Register a callback for when all data is ready (via loadAll)
   * If data is already loaded, callback fires immediately
   * @param {Function} callback
   */
  onReady(callback) {
    if (typeof callback !== 'function') {
      console.error('[DataLoader] onReady: callback must be a function');
      return;
    }

    if (this._loaded) {
      // Already loaded, call immediately
      try {
        callback();
      } catch (error) {
        console.error('[DataLoader] Error in ready callback:', error);
      }
    } else {
      // Queue for later
      this._readyCallbacks.push(callback);
    }
  }

  /**
   * Register a callback for when a specific data key is ready
   * @param {string} key - The data key to wait for
   * @param {Function} callback - Function to call when data is ready (receives data or null)
   */
  onKeyReady(key, callback) {
    // If already loaded, call immediately
    if (this._cache.has(key)) {
      callback(this._cache.get(key));
      return;
    }

    // Otherwise queue the callback
    if (!this.pendingCallbacks[key]) {
      this.pendingCallbacks[key] = [];
    }
    this.pendingCallbacks[key].push(callback);
  }

  /**
   * Register callbacks for multiple data keys
   * @param {string[]} keys - Array of data keys to wait for
   * @param {Function} callback - Function called when ALL data is ready
   */
  onAllReady(keys, callback) {
    let loadedCount = 0;
    const results = {};

    const checkComplete = (key, data) => {
      results[key] = data;
      loadedCount++;

      if (loadedCount === keys.length) {
        callback(results);
      }
    };

    keys.forEach(key => {
      this.onKeyReady(key, (data) => checkComplete(key, data));
    });
  }

  /**
   * Load a single JSON file
   * @param {string} filename - Name without extension (e.g., 'masters')
   * @returns {Promise<Object>} Parsed JSON data
   */
  async load(filename) {
    // Check cache first
    if (this._cache.has(filename)) {
      if (this._debug) {
        console.log(`[DataLoader] Cache hit for '${filename}'`);
      }
      return this._cache.get(filename);
    }

    // Check if already loading
    if (this.loadPromises[filename]) {
      return this.loadPromises[filename];
    }

    const url = `${this._basePath}${filename}.json`;

    if (this._debug) {
      console.log(`[DataLoader] Loading '${url}'...`);
    }

    // Create and cache the promise
    this.loadPromises[filename] = this._fetchJSON(filename, url);
    return this.loadPromises[filename];
  }

  /**
   * Internal fetch method
   * @private
   */
  async _fetchJSON(filename, url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Store in both cache systems for compatibility
      this._cache.set(filename, data);
      this.loadedData[filename] = data;
      this.isReady[filename] = true;

      // Trigger any pending key-specific callbacks
      this._triggerKeyCallbacks(filename, data);

      if (this._debug) {
        console.log(`[DataLoader] Loaded '${filename}' successfully`);
      }

      return data;

    } catch (fetchError) {
      if (this._debug) {
        console.warn(`[DataLoader] Fetch failed for '${filename}':`, fetchError.message);
      }

      // Store error
      this.errors[filename] = fetchError;

      // Try fallback data for critical systems
      const fallback = this._getFallbackData(filename);
      if (fallback) {
        console.warn(`[DataLoader] Using fallback data for '${filename}'`);

        // Store fallback in both cache systems
        this._cache.set(filename, fallback);
        this.loadedData[filename] = fallback;
        this.isReady[filename] = true;

        // Trigger callbacks with fallback data
        this._triggerKeyCallbacks(filename, fallback);

        return fallback;
      }

      // Trigger callbacks with null to indicate failure
      this._triggerKeyCallbacks(filename, null);

      // No fallback available
      console.error(`[DataLoader] Failed to load '${filename}' and no fallback available`);
      return null;
    }
  }

  /**
   * Load all JSON data files
   * @returns {Promise<Map<string, Object>>} Map of all loaded data
   */
  async loadAll() {
    // Return existing promise if already loading
    if (this._loadPromise) {
      return this._loadPromise;
    }

    // Return cached data if already loaded
    if (this._loaded) {
      return this._cache;
    }

    this._loading = true;

    this._loadPromise = (async () => {
      if (this._debug) {
        console.log('[DataLoader] Starting bulk load of all data files...');
      }

      const startTime = Date.now();
      const results = {
        loaded: [],
        failed: []
      };

      // Load all files in parallel
      const loadPromises = this._dataFiles.map(async (filename) => {
        try {
          const data = await this.load(filename);
          if (data !== null) {
            results.loaded.push(filename);
          } else {
            results.failed.push({ filename, error: 'No data returned' });
          }
        } catch (error) {
          results.failed.push({ filename, error: error.message });
        }
      });

      await Promise.all(loadPromises);

      const elapsed = Date.now() - startTime;

      console.log(`[DataLoader] Bulk load complete in ${elapsed}ms`);
      console.log(`[DataLoader] Loaded: ${results.loaded.join(', ')}`);
      if (results.failed.length > 0) {
        console.warn('[DataLoader] Failed:', results.failed.map(f => f.filename).join(', '));
      }

      this._loaded = true;
      this._loading = false;

      // Execute ready callbacks
      this._executeReadyCallbacks();

      // Emit event via eventBus if available
      this._emitDataLoadedEvent(results);

      return this._cache;
    })();

    return this._loadPromise;
  }

  /**
   * Get loaded data by key
   * @param {string} key - Data key (e.g., 'masters', 'cats')
   * @returns {Object|null} The data or null if not loaded
   */
  get(key) {
    if (this._cache.has(key)) {
      return this._cache.get(key);
    }
    // Fallback to legacy object
    if (this.loadedData[key]) {
      return this.loadedData[key];
    }
    if (this._debug) {
      console.warn(`[DataLoader] Data '${key}' not found in cache`);
    }
    return null;
  }

  /**
   * Get all loaded data keys
   * @returns {string[]}
   */
  getLoadedKeys() {
    return Array.from(this._cache.keys());
  }

  /**
   * Check if specific data has been loaded
   * @param {string} key - The data key
   * @returns {boolean} True if data is loaded
   */
  hasLoaded(key) {
    return this._cache.has(key) || this.isReady[key] === true;
  }

  /**
   * Check if loading failed for a specific key
   * @param {string} key - The data key
   * @returns {boolean} True if loading failed
   */
  hasFailed(key) {
    return this.errors[key] !== undefined;
  }

  /**
   * Get loading error for a specific key
   * @param {string} key - The data key
   * @returns {Error|undefined} The error if loading failed
   */
  getError(key) {
    return this.errors[key];
  }

  /**
   * Clear the cache (useful for hot reload during development)
   * @param {string} [key] - Specific key to clear, or all if not specified
   */
  clearCache(key) {
    if (key) {
      this._cache.delete(key);
      delete this.loadedData[key];
      delete this.loadPromises[key];
      delete this.isReady[key];
      delete this.errors[key];
    } else {
      this._cache.clear();
      this.loadedData = {};
      this.loadPromises = {};
      this.isReady = {};
      this.errors = {};
      this._loaded = false;
      this._loadPromise = null;
    }
    if (this._debug) {
      console.log(`[DataLoader] Cache cleared${key ? ` for '${key}'` : ''}`);
    }
  }

  /**
   * Alias for clearCache for legacy compatibility
   */
  clear(key) {
    this.clearCache(key);
  }

  /**
   * Reload a specific data file (bypasses cache)
   * @param {string} filename
   * @returns {Promise<Object>}
   */
  async reload(filename) {
    this.clearCache(filename);
    return this.load(filename);
  }

  /**
   * Reload all data files
   * @returns {Promise<Map<string, Object>>}
   */
  async reloadAll() {
    this.clearCache();
    return this.loadAll();
  }

  /**
   * Trigger pending callbacks for a specific key
   * @private
   */
  _triggerKeyCallbacks(key, data) {
    const callbacks = this.pendingCallbacks[key];
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (error) {
          console.error(`[DataLoader] Callback error for ${key}:`, error);
        }
      });
      delete this.pendingCallbacks[key];
    }
  }

  /**
   * Execute all queued ready callbacks (for loadAll completion)
   * @private
   */
  _executeReadyCallbacks() {
    while (this._readyCallbacks.length > 0) {
      const callback = this._readyCallbacks.shift();
      try {
        callback();
      } catch (error) {
        console.error('[DataLoader] Error in ready callback:', error);
      }
    }
  }

  /**
   * Emit dataLoaded event via eventBus
   * @private
   */
  _emitDataLoadedEvent(results) {
    if (typeof window !== 'undefined' && window.eventBus) {
      window.eventBus.emit('dataLoaded', {
        loaded: results.loaded,
        failed: results.failed,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Get fallback data for critical systems when fetch fails
   * This allows local file:// testing without a server
   * @private
   * @param {string} filename
   * @returns {Object|null}
   */
  _getFallbackData(filename) {
    const fallbacks = {
      // Critical: Masters data - needed for character selection
      masters: {
        masters: {
          gerald: {
            id: 'gerald',
            name: 'Gerald',
            title: 'The Jade Palm',
            role: 'Sect Leader',
            description: 'Founder of the Celestial Snoot Sect. His balanced approach to cultivation has guided countless souls on the path of the snoot.',
            passive: {
              name: 'Tranquil Boop',
              description: 'Boops during meditation generate +25% BP',
              effect: { type: 'conditional_multiplier', condition: 'isMeditating', stat: 'bpMultiplier', value: 1.25 }
            },
            sprite: 'masters/gerald.png',
            color: '#50C878',
            quotes: [
              'Balance in all things. Especially snoots.',
              'The Sect grows stronger with each boop.',
              'I see potential in you, young cultivator.'
            ],
            unlockCondition: 'starter'
          },
          rusty: {
            id: 'rusty',
            name: 'Rusty',
            title: 'The Crimson Fist',
            role: 'War General',
            description: 'Former bandit king, reformed cat lover. His fierce determination and unmatched aggression make him a force to be reckoned with.',
            passive: {
              name: 'Thousand Boop Barrage',
              description: 'Active ability: 10 seconds of rapid boops (5 min cooldown)',
              effect: { type: 'active_ability', duration: 10000, cooldown: 300000, stat: 'boopSpeedMultiplier', value: 5 }
            },
            sprite: 'masters/rusty.png',
            color: '#DC143C',
            quotes: [
              'When in doubt, boop harder!',
              'These paws were made for booping!',
              'THOUSAND BOOP BARRAGE!'
            ],
            unlockCondition: 'starter'
          },
          steve: {
            id: 'steve',
            name: 'Steve',
            title: 'The Flowing River',
            role: 'Strategist',
            description: 'Calculated the optimal snoot-to-boop ratio. His patient approach to cultivation yields the greatest long-term gains.',
            passive: {
              name: 'Eternal Flow',
              description: 'Offline PP generation is doubled',
              effect: { type: 'multiplier', stat: 'afkMultiplier', value: 2.0 }
            },
            sprite: 'masters/steve.png',
            color: '#4169E1',
            quotes: [
              'Patience yields the greatest gains.',
              'The math is clear: more cats = more PP.',
              'I have optimized our cultivation schedule.'
            ],
            unlockCondition: 'starter'
          },
          andrew: {
            id: 'andrew',
            name: 'Andrew',
            title: 'The Thunder Step',
            role: 'Scout',
            description: 'Fastest courier in the Jianghu. His lightning reflexes help him discover rare events and cats before anyone else.',
            passive: {
              name: 'Lightning Reflexes',
              description: '+50% chance to discover events and rare cats first',
              effect: { type: 'multiplier', stats: { eventDiscoveryBonus: 1.5, rareCatBonus: 1.5 } }
            },
            sprite: 'masters/andrew.png',
            color: '#FFD700',
            quotes: [
              'Already found three cats while you were reading this.',
              'Speed is the essence of cultivation!',
              'New event spotted! Follow me!'
            ],
            unlockCondition: 'starter'
          },
          nik: {
            id: 'nik',
            name: 'Nik',
            title: 'The Shadow Moon',
            role: 'Assassin',
            description: 'Mysterious. The cats trust him. No one knows why. His silent presence brings devastating critical strikes.',
            passive: {
              name: 'Phantom Boop',
              description: '+50% critical boop chance',
              effect: { type: 'additive', stat: 'critChanceBonus', value: 0.5 }
            },
            sprite: 'masters/nik.png',
            color: '#483D8B',
            quotes: [
              '...',
              '*appears from shadows* ...boop.',
              'The night is full of snoots.'
            ],
            unlockCondition: 'starter'
          },
          yuelin: {
            id: 'yuelin',
            name: 'Yuelin',
            title: 'The Lotus Sage',
            role: 'Healer',
            description: 'Speaks to cats in their ancient tongue. Her harmonious aura brings peace and happiness to all felines.',
            passive: {
              name: 'Harmonious Aura',
              description: 'All cats gain +50% happiness',
              effect: { type: 'multiplier', stat: 'catHappinessMultiplier', value: 1.5 }
            },
            sprite: 'masters/yuelin.png',
            color: '#FFB6C1',
            quotes: [
              'The cats tell me you have a kind heart.',
              'Harmony brings the greatest power.',
              'Each cat carries ancient wisdom.'
            ],
            unlockCondition: 'starter'
          },
          scott: {
            id: 'scott',
            name: 'Scott',
            title: 'The Mountain',
            role: 'Guardian',
            description: 'Meditated for 1000 days. A cat sat on him the whole time. His unshakeable foundation prevents any progress from being lost.',
            passive: {
              name: 'Unshakeable Foundation',
              description: 'Multiplier bonuses never decay or reset',
              effect: { type: 'special', stat: 'preventDecay', value: true }
            },
            sprite: 'masters/scott.png',
            color: '#8B4513',
            quotes: [
              'I am the mountain. The cats are my snow.',
              'Patience. Stability. Snoots.',
              '...I have not moved in three days. Worth it.'
            ],
            unlockCondition: 'starter'
          },
          mythic: {
            id: 'mythic',
            name: '???',
            title: 'The Forgotten One',
            role: 'Unknown',
            description: 'A master erased from history. Why? Their echoes of eternity grant partial access to all other masters powers.',
            passive: {
              name: 'Echoes of Eternity',
              description: 'All other masters passives are active at 25% power',
              effect: { type: 'special', stat: 'allPassivesPartial', value: true, partialStrength: 0.25 }
            },
            sprite: 'masters/eighth.png',
            color: '#FFFFFF',
            quotes: [
              '...I remember now.',
              'The Sect... it was always meant to be eight.',
              'Boop... yes... I remember booping.'
            ],
            unlockCondition: { type: 'heavenlySeals', value: 100 }
          }
        }
      },

      // Critical: Balance data - needed for game mechanics
      balance: {
        boop: {
          basePower: 1,
          baseCritChance: 0.05,
          baseCritMultiplier: 10,
          comboDecayMs: 2000,
          maxCombo: 100,
          comboBonus: 0.01
        },
        cultivation: {
          xpScalePerRank: 1.15,
          realmScale: 3.0,
          ranksPerRealm: 9
        },
        cats: {
          baseCapacity: 10,
          maxStars: 6,
          happinessDecayRate: 0.01
        },
        afk: {
          maxHours: 24,
          efficiencyBase: 0.5
        },
        goose: {
          spawnChance: 0.02,
          timeLimitMs: 30000
        },
        prestige: {
          ascensionThreshold: 1e9,
          reincarnationAscensions: 10,
          reincarnationSeals: 500,
          transcendenceReincarnations: 5,
          transcendenceKarma: 1000
        }
      },

      // Critical: Cultivation data - needed for progression
      cultivation: {
        realms: {
          mortal: {
            id: 'mortal',
            name: 'Mortal Realm',
            order: 1,
            ranks: 9,
            description: 'The beginning of the path. You are but a wanderer in the Jianghu.',
            xpBase: 100,
            xpScale: 1.15,
            realmScale: 3.0,
            color: '#A0A0A0',
            tribulation: null,
            unlocks: ['basic_boop', 'cat_sanctuary'],
            passives: {
              1: { name: 'Awakened Spirit', effect: { boopPower: 1.1 } },
              5: { name: 'Mortal Foundation', effect: { ppGeneration: 1.15 } },
              9: { name: 'Mortal Peak', effect: { critChance: 0.02 } }
            }
          },
          qiCondensation: {
            id: 'qiCondensation',
            name: 'Qi Condensation',
            order: 2,
            ranks: 9,
            description: 'You have begun to sense the Qi of the world. The snoots call to you.',
            xpBase: 1000,
            xpScale: 1.15,
            realmScale: 3.0,
            color: '#87CEEB',
            tribulation: { name: 'Tribulation of Awakening', type: 'boss', enemy: 'inner_demon_kitten' },
            unlocks: ['technique_stances', 'cat_training'],
            passives: {
              1: { name: 'Qi Sense', effect: { eventDiscovery: 1.1 } },
              5: { name: 'Meridian Opening', effect: { boopPower: 1.25 } },
              9: { name: 'Condensation Complete', effect: { afkEfficiency: 1.2 } }
            }
          },
          foundationEstablishment: {
            id: 'foundationEstablishment',
            name: 'Foundation Establishment',
            order: 3,
            ranks: 9,
            description: 'Your foundation is set. The cats recognize you as a true cultivator.',
            xpBase: 10000,
            xpScale: 1.15,
            realmScale: 3.0,
            color: '#8B4513',
            tribulation: { name: 'Tribulation of Foundation', type: 'survival', waves: 5 },
            unlocks: ['cat_teams', 'first_waifu', 'meditation_garden'],
            passives: {
              1: { name: 'Stable Foundation', effect: { multiplierDecay: 0.5 } },
              5: { name: 'Inner Strength', effect: { tribulationPower: 1.2 } },
              9: { name: 'Foundation Peak', effect: { catCapacity: 10 } }
            }
          },
          coreFormation: {
            id: 'coreFormation',
            name: 'Core Formation',
            order: 4,
            ranks: 9,
            description: 'A golden core forms within you. Your boops shake the heavens.',
            xpBase: 100000,
            xpScale: 1.15,
            realmScale: 3.0,
            color: '#FFD700',
            tribulation: { name: 'Tribulation of the Golden Core', type: 'boss', enemy: 'shadow_goose' },
            unlocks: ['infinite_pagoda', 'equipment_system', 'waifu_teaching'],
            passives: {
              1: { name: 'Golden Core', effect: { allStats: 1.1 } },
              5: { name: 'Core Resonance', effect: { catSynergy: 1.25 } },
              9: { name: 'Perfect Core', effect: { critDamage: 1.5 } }
            }
          },
          nascentSoul: {
            id: 'nascentSoul',
            name: 'Nascent Soul',
            order: 5,
            ranks: 9,
            description: 'A nascent soul emerges. You are no longer bound by mortal limits.',
            xpBase: 1000000,
            xpScale: 1.15,
            realmScale: 3.0,
            color: '#9370DB',
            tribulation: { name: 'Soul Tribulation', type: 'puzzle', challenge: 'soul_fragments' },
            unlocks: ['dream_realm', 'cat_fusion', 'territory_expansion'],
            passives: {
              1: { name: 'Soul Awakening', effect: { offlineGains: 1.5 } },
              5: { name: 'Soul Projection', effect: { dungeonSpeed: 1.25 } },
              9: { name: 'Complete Soul', effect: { deathDefiance: 1 } }
            }
          }
        }
      },

      // Critical: Techniques data - needed for boop system
      techniques: {
        stances: {
          jadePalm: {
            id: 'jadePalm',
            name: 'Jade Palm',
            description: 'The balanced way. Default stance for all cultivators.',
            unlockRealm: 'mortal',
            stats: {
              boopPower: 1.0,
              boopSpeed: 1.0,
              critChance: 0.05,
              critMultiplier: 10,
              comboDecay: 2000
            },
            special: null,
            mastery: { maxLevel: 10, xpPerBoop: 1, bonusPerLevel: { boopPower: 0.05 } }
          },
          ironFinger: {
            id: 'ironFinger',
            name: 'Iron Finger',
            description: 'Slow but devastating. Each boop carries the weight of a mountain.',
            unlockRealm: 'qiCondensation',
            stats: {
              boopPower: 3.0,
              boopSpeed: 0.5,
              critChance: 0.15,
              critMultiplier: 15,
              comboDecay: 3000
            },
            special: { name: 'Mountain Crusher', description: 'Every 10th boop deals 10x damage', trigger: { everyNBoops: 10 }, effect: { damageMultiplier: 10 } },
            mastery: { maxLevel: 10, xpPerBoop: 2, bonusPerLevel: { critMultiplier: 1 } }
          },
          drunkenPaw: {
            id: 'drunkenPaw',
            name: 'Drunken Paw',
            description: 'Chaotic and unpredictable. Embrace the randomness.',
            unlockRealm: 'foundationEstablishment',
            stats: {
              boopPower: { min: 0.5, max: 5.0 },
              boopSpeed: 1.2,
              critChance: 0.25,
              critMultiplier: { min: 5, max: 25 },
              comboDecay: 1500
            },
            special: { name: 'Lucky Stumble', description: '5% chance for JACKPOT (100x damage)', trigger: { chance: 0.05 }, effect: { damageMultiplier: 100 } },
            mastery: { maxLevel: 10, xpPerBoop: 1, bonusPerLevel: { jackpotChance: 0.005 } }
          }
        },
        fusions: {
          jadeMountain: {
            name: 'Jade Mountain Strike',
            requires: ['jadePalm', 'ironFinger'],
            requiredMastery: 5,
            description: 'Balanced power with devastating follow-ups',
            effect: { boopPower: 2.0, everyNth: { n: 5, multiplier: 5 } }
          }
        }
      },

      // Cats data - starter cats
      cats: {
        cats: {
          shaolin_tabby: {
            id: 'shaolin_tabby',
            name: 'Shaolin Tabby',
            school: 'shaolin',
            element: 'earth',
            baseRealm: 'kittenMortal',
            personality: 'disciplined',
            description: 'A disciplined cat who practices the ways of the temple.',
            baseStats: {
              snootMeridians: 1.0,
              innerPurr: 1.0,
              floofArmor: 1.2,
              zoomieSteps: 0.8,
              loafMastery: 1.1
            },
            sprite: 'cats/shaolin_tabby.png',
            quotes: ['Mrrp. (Balance in all things.)', '*meditates intensely*']
          },
          wudang_persian: {
            id: 'wudang_persian',
            name: 'Wudang Persian',
            school: 'wudang',
            element: 'water',
            baseRealm: 'kittenMortal',
            personality: 'mysterious',
            description: 'A flowing cat whose movements are like water.',
            baseStats: {
              snootMeridians: 1.1,
              innerPurr: 1.2,
              floofArmor: 0.9,
              zoomieSteps: 1.0,
              loafMastery: 1.0
            },
            sprite: 'cats/wudang_persian.png',
            quotes: ['*stares mysteriously*', 'Mrrp...']
          }
        },
        elements: {
          metal: { name: 'Metal', color: '#C0C0C0', strengths: ['wood'], weaknesses: ['fire'] },
          wood: { name: 'Wood', color: '#228B22', strengths: ['earth'], weaknesses: ['metal'] },
          water: { name: 'Water', color: '#4169E1', strengths: ['fire'], weaknesses: ['earth'] },
          fire: { name: 'Fire', color: '#FF4500', strengths: ['metal'], weaknesses: ['water'] },
          earth: { name: 'Earth', color: '#8B4513', strengths: ['water'], weaknesses: ['wood'] }
        },
        realms: {
          kittenMortal: { order: 1, name: 'Mortal Kitten', ppMult: 1, stats: 1.0 },
          earthKitten: { order: 2, name: 'Earth Kitten', ppMult: 2, stats: 1.5 },
          skyKitten: { order: 3, name: 'Sky Kitten', ppMult: 5, stats: 2.0 },
          heavenKitten: { order: 4, name: 'Heaven Kitten', ppMult: 15, stats: 3.0 },
          divineBeast: { order: 5, name: 'Divine Beast', ppMult: 50, stats: 5.0 }
        }
      },

      // Waifus data - starter waifus
      waifus: {
        waifus: {
          mochi: {
            id: 'mochi',
            name: 'Mochi-chan',
            title: 'The Welcoming Dawn',
            role: 'Innkeeper of the Celestial Teahouse',
            school: 'hospitalityArts',
            element: 'earth',
            personality: 'warm',
            bonus: { type: 'bpMultiplier', value: 1.10 },
            unlockCondition: 'starter',
            sprite: 'waifus/mochi.png',
            color: '#FFB7C5',
            quotes: ['Good morning~', 'Welcome back, nya~']
          },
          luna: {
            id: 'luna',
            name: 'Luna Whiskerbell',
            title: 'The Midnight Watcher',
            role: 'Night Cultivation Instructor',
            school: 'yinEnergyArts',
            element: 'water',
            personality: 'sleepy',
            bonus: { type: 'afkMultiplier', value: 1.50 },
            unlockCondition: { type: 'afkTime', value: 86400 },
            sprite: 'waifus/luna.png',
            color: '#C4A7E7',
            quotes: ['*yawn* ...morning already...?', 'Ah... the moon is beautiful tonight...']
          }
        },
        bondActivities: {
          teaCeremony: { id: 'teaCeremony', name: 'Tea Ceremony', duration: 300, bondGain: 10 },
          sparring: { id: 'sparring', name: 'Sparring Match', duration: 600, bondGain: 15 },
          meditation: { id: 'meditation', name: 'Meditation', duration: 900, bondGain: 20 }
        }
      },

      // Equipment placeholder
      equipment: {
        items: {},
        sets: {},
        slots: ['weapon', 'armor', 'accessory', 'hat', 'collar', 'paws']
      },

      // Relics placeholder
      relics: {
        relics: {}
      },

      // Enemies placeholder
      enemies: {
        enemies: {},
        bosses: {}
      },

      // Events placeholder
      events: {
        random: [],
        daily: [],
        seasonal: []
      },

      // Achievements placeholder
      achievements: {
        achievements: []
      },

      // Lore placeholder
      lore: {
        entries: {}
      }
    };

    return fallbacks[filename] || null;
  }
}

// Create singleton instance
const dataLoader = new DataLoader();

/**
 * Initialize the data loader on DOMContentLoaded
 * Automatically starts loading all data files
 */
function initDataLoader() {
  console.log('[DataLoader] Initializing...');

  // Start loading all data
  dataLoader.loadAll()
    .then(() => {
      console.log('[DataLoader] All data loaded and ready');
    })
    .catch((error) => {
      console.error('[DataLoader] Failed to load some data:', error);
    });
}

// Auto-initialize on DOMContentLoaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataLoader);
  } else {
    // DOM already loaded, initialize immediately
    initDataLoader();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DataLoader, dataLoader, initDataLoader };
} else {
  // Browser global
  window.DataLoader = DataLoader;
  window.dataLoader = dataLoader;
  window.initDataLoader = initDataLoader;
}
