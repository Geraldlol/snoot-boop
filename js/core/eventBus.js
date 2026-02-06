/**
 * EventBus - Cross-system communication for Snoot Booper
 *
 * "When the Seven Masters unite, no snoot shall go un-booped."
 * — The Celestial Snoot Scripture
 *
 * Pub/sub event system for decoupled communication between game systems.
 *
 * Events:
 * - 'boop' - Player booped a cat { cat, bp, isCrit, combo, stance }
 * - 'catRecruited' - New cat joined the sect { cat, source }
 * - 'catLevelUp' - Cat gained a cultivation level { cat, newLevel }
 * - 'catRealmBreakthrough' - Cat advanced to new realm { cat, oldRealm, newRealm }
 * - 'waifuBondUp' - Waifu bond level increased { waifu, oldLevel, newLevel }
 * - 'waifuUnlocked' - New waifu unlocked { waifu }
 * - 'realmBreakthrough' - Player advanced to new cultivation realm { oldRealm, newRealm }
 * - 'tribulationStart' - Tribulation challenge began { realm, tribulation }
 * - 'tribulationComplete' - Tribulation resolved { realm, success, rewards }
 * - 'gooseSpawn' - A goose appeared { goose, mood }
 * - 'gooseBooped' - Player booped a goose { goose, reward, isCrit }
 * - 'gooseEscaped' - Goose escaped { goose, stolenAmount }
 * - 'currencyChange' - Currency amount changed { currency, oldAmount, newAmount, source }
 * - 'achievementUnlock' - Achievement unlocked { achievement }
 * - 'dungeonStart' - Dungeon run started { dungeon, party }
 * - 'dungeonFloorComplete' - Dungeon floor cleared { dungeon, floor, loot }
 * - 'dungeonComplete' - Dungeon run ended { dungeon, success, rewards }
 * - 'relicFound' - Relic obtained in dungeon { relic }
 * - 'equipmentEquipped' - Equipment changed { cat, slot, item }
 * - 'techniqueUnlocked' - New technique learned { technique, source }
 * - 'stanceMasteryUp' - Stance mastery increased { stance, newLevel }
 * - 'fusionTechniqueUnlocked' - Fusion technique unlocked { fusion }
 * - 'buildingBuilt' - Building constructed/upgraded { building, newLevel }
 * - 'territoryUnlocked' - New territory unlocked { territory }
 * - 'loreFragmentFound' - Lore fragment discovered { entry, current, required }
 * - 'loreUnlocked' - Complete lore story unlocked { entry }
 * - 'secretDiscovered' - Easter egg found { secret }
 * - 'ascension' - Player ascended { sealsEarned, totalAscensions }
 * - 'reincarnation' - Player reincarnated { karmaEarned, totalReincarnations }
 * - 'transcendence' - Player transcended { transcendencePoints }
 * - 'eventStart' - Random/seasonal event started { event }
 * - 'eventComplete' - Event completed { event, rewards }
 * - 'timeChange' - Time of day changed { oldTime, newTime }
 * - 'seasonChange' - Season changed { oldSeason, newSeason }
 * - 'saveComplete' - Game saved { timestamp }
 * - 'loadComplete' - Game loaded { saveData }
 */

class EventBus {
  constructor() {
    // Map of event names to arrays of listener objects
    this._listeners = new Map();

    // Map of event names to arrays of one-time listener objects
    this._onceListeners = new Map();

    // Event history for debugging (limited size)
    this._history = [];
    this._maxHistorySize = 100;

    // Debug mode flag
    this._debug = false;
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Function to call when event fires
   * @param {Object} [context] - Optional context (this) for callback
   * @returns {Function} Unsubscribe function
   */
  on(event, callback, context = null) {
    if (typeof callback !== 'function') {
      throw new Error(`EventBus.on: callback must be a function, got ${typeof callback}`);
    }

    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }

    const listener = { callback, context };
    this._listeners.get(event).push(listener);

    if (this._debug) {
      console.log(`[EventBus] Subscribed to '${event}'`);
    }

    // Return unsubscribe function
    return () => this.off(event, callback, context);
  }

  /**
   * Subscribe to an event only once
   * @param {string} event - Event name
   * @param {Function} callback - Function to call when event fires
   * @param {Object} [context] - Optional context (this) for callback
   * @returns {Function} Unsubscribe function
   */
  once(event, callback, context = null) {
    if (typeof callback !== 'function') {
      throw new Error(`EventBus.once: callback must be a function, got ${typeof callback}`);
    }

    if (!this._onceListeners.has(event)) {
      this._onceListeners.set(event, []);
    }

    const listener = { callback, context };
    this._onceListeners.get(event).push(listener);

    if (this._debug) {
      console.log(`[EventBus] Subscribed once to '${event}'`);
    }

    // Return unsubscribe function
    return () => {
      const listeners = this._onceListeners.get(event);
      if (listeners) {
        const index = listeners.findIndex(
          l => l.callback === callback && l.context === context
        );
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - The callback to remove
   * @param {Object} [context] - The context used when subscribing
   * @returns {boolean} True if listener was found and removed
   */
  off(event, callback, context = null) {
    const listeners = this._listeners.get(event);
    if (!listeners) return false;

    const index = listeners.findIndex(
      l => l.callback === callback && l.context === context
    );

    if (index !== -1) {
      listeners.splice(index, 1);
      if (this._debug) {
        console.log(`[EventBus] Unsubscribed from '${event}'`);
      }
      return true;
    }

    return false;
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} [data] - Data to pass to listeners
   * @returns {number} Number of listeners that received the event
   */
  emit(event, data = null) {
    let listenerCount = 0;

    // Add to history
    this._addToHistory(event, data);

    if (this._debug) {
      console.log(`[EventBus] Emitting '${event}'`, data);
    }

    // Process regular listeners
    const listeners = this._listeners.get(event);
    if (listeners) {
      // Create a copy to avoid issues if listeners modify the array
      const listenersCopy = [...listeners];
      for (const listener of listenersCopy) {
        try {
          if (listener.context) {
            listener.callback.call(listener.context, data);
          } else {
            listener.callback(data);
          }
          listenerCount++;
        } catch (error) {
          console.error(`[EventBus] Error in listener for '${event}':`, error);
        }
      }
    }

    // Process once listeners (and remove them)
    const onceListeners = this._onceListeners.get(event);
    if (onceListeners && onceListeners.length > 0) {
      // Get all once listeners and clear the array
      const onceListenersCopy = [...onceListeners];
      this._onceListeners.set(event, []);

      for (const listener of onceListenersCopy) {
        try {
          if (listener.context) {
            listener.callback.call(listener.context, data);
          } else {
            listener.callback(data);
          }
          listenerCount++;
        } catch (error) {
          console.error(`[EventBus] Error in once listener for '${event}':`, error);
        }
      }
    }

    return listenerCount;
  }

  /**
   * Check if there are any listeners for an event
   * @param {string} event - Event name
   * @returns {boolean}
   */
  hasListeners(event) {
    const regular = this._listeners.get(event);
    const once = this._onceListeners.get(event);
    return (regular && regular.length > 0) || (once && once.length > 0);
  }

  /**
   * Get the number of listeners for an event
   * @param {string} event - Event name
   * @returns {number}
   */
  listenerCount(event) {
    const regular = this._listeners.get(event)?.length || 0;
    const once = this._onceListeners.get(event)?.length || 0;
    return regular + once;
  }

  /**
   * Remove all listeners for an event (or all events)
   * @param {string} [event] - Event name, or omit to clear all
   */
  clear(event = null) {
    if (event) {
      this._listeners.delete(event);
      this._onceListeners.delete(event);
      if (this._debug) {
        console.log(`[EventBus] Cleared all listeners for '${event}'`);
      }
    } else {
      this._listeners.clear();
      this._onceListeners.clear();
      if (this._debug) {
        console.log('[EventBus] Cleared all listeners');
      }
    }
  }

  /**
   * Get list of all registered event names
   * @returns {string[]}
   */
  getEventNames() {
    const names = new Set([
      ...this._listeners.keys(),
      ...this._onceListeners.keys()
    ]);
    return Array.from(names);
  }

  /**
   * Get recent event history (for debugging)
   * @param {number} [count] - Number of recent events to return
   * @returns {Array}
   */
  getHistory(count = 10) {
    return this._history.slice(-count);
  }

  /**
   * Enable or disable debug logging
   * @param {boolean} enabled
   */
  setDebug(enabled) {
    this._debug = enabled;
    console.log(`[EventBus] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Add event to history (internal)
   * @private
   */
  _addToHistory(event, data) {
    this._history.push({
      event,
      data,
      timestamp: Date.now()
    });

    // Trim history if too long
    if (this._history.length > this._maxHistorySize) {
      this._history = this._history.slice(-this._maxHistorySize);
    }
  }
}

// Create and export singleton instance
const eventBus = new EventBus();

// Event name constants for type safety and autocomplete
const EVENTS = {
  // Boop events
  BOOP: 'boop',

  // Cat events
  CAT_RECRUITED: 'catRecruited',
  CAT_LEVEL_UP: 'catLevelUp',
  CAT_REALM_BREAKTHROUGH: 'catRealmBreakthrough',
  CAT_HAPPINESS_CHANGE: 'catHappinessChange',
  CAT_TECHNIQUE_LEARNED: 'catTechniqueLearned',
  CAT_STAR_UP: 'catStarUp',
  CAT_FUSED: 'catFused',

  // Team events
  TEAM_CHANGED: 'teamChanged',
  TEAM_SYNERGY_ACTIVATED: 'teamSynergyActivated',

  // Waifu events
  WAIFU_UNLOCKED: 'waifuUnlocked',
  WAIFU_BOND_UP: 'waifuBondUp',
  WAIFU_MAX_BOND: 'waifuMaxBond',
  WAIFU_ACTIVITY_START: 'waifuActivityStart',
  WAIFU_ACTIVITY_COMPLETE: 'waifuActivityComplete',
  WAIFU_GIFT_GIVEN: 'waifuGiftGiven',

  // Player cultivation events
  REALM_BREAKTHROUGH: 'realmBreakthrough',
  RANK_UP: 'rankUp',
  CULTIVATION_XP_GAIN: 'cultivationXpGain',
  TRIBULATION_START: 'tribulationStart',
  TRIBULATION_COMPLETE: 'tribulationComplete',

  // Technique events
  TECHNIQUE_UNLOCKED: 'techniqueUnlocked',
  STANCE_CHANGED: 'stanceChanged',
  STANCE_MASTERY_UP: 'stanceMasteryUp',
  FUSION_TECHNIQUE_UNLOCKED: 'fusionTechniqueUnlocked',

  // Goose events
  GOOSE_SPAWN: 'gooseSpawn',
  GOOSE_BOOPED: 'gooseBooped',
  GOOSE_ESCAPED: 'gooseEscaped',
  GOOSE_ALLY_SELECTED: 'gooseAllySelected',
  COBRA_CHICKEN_DEFEATED: 'cobraChickenDefeated',

  // Currency events
  CURRENCY_CHANGE: 'currencyChange',
  CURRENCY_SPEND: 'currencySpend',
  CURRENCY_GAIN: 'currencyGain',

  // Achievement events
  ACHIEVEMENT_UNLOCK: 'achievementUnlock',
  ACHIEVEMENT_PROGRESS: 'achievementProgress',

  // Dungeon events
  DUNGEON_START: 'dungeonStart',
  DUNGEON_FLOOR_START: 'dungeonFloorStart',
  DUNGEON_FLOOR_COMPLETE: 'dungeonFloorComplete',
  DUNGEON_COMPLETE: 'dungeonComplete',
  DUNGEON_WIPE: 'dungeonWipe',
  RELIC_FOUND: 'relicFound',
  BOOP_COMMAND_USED: 'boopCommandUsed',

  // Equipment events
  EQUIPMENT_EQUIPPED: 'equipmentEquipped',
  EQUIPMENT_UNEQUIPPED: 'equipmentUnequipped',
  EQUIPMENT_UPGRADED: 'equipmentUpgraded',
  EQUIPMENT_EVOLVED: 'equipmentEvolved',
  SET_BONUS_ACTIVATED: 'setBonusActivated',

  // Building events
  BUILDING_BUILT: 'buildingBuilt',
  BUILDING_UPGRADED: 'buildingUpgraded',
  TERRITORY_UNLOCKED: 'territoryUnlocked',

  // Lore events
  LORE_FRAGMENT_FOUND: 'loreFragmentFound',
  LORE_UNLOCKED: 'loreUnlocked',
  SECRET_DISCOVERED: 'secretDiscovered',

  // Prestige events
  ASCENSION: 'ascension',
  REINCARNATION: 'reincarnation',
  TRANSCENDENCE: 'transcendence',
  HEAVENLY_DECREE_SELECTED: 'heavenlyDecreeSelected',
  FORBIDDEN_TECHNIQUE_PURCHASED: 'forbiddenTechniquePurchased',

  // Event system events
  EVENT_START: 'eventStart',
  EVENT_COMPLETE: 'eventComplete',
  DAILY_RESET: 'dailyReset',
  WEEKLY_RESET: 'weeklyReset',

  // Time events
  TIME_CHANGE: 'timeChange',
  SEASON_CHANGE: 'seasonChange',

  // Save/Load events
  SAVE_START: 'saveStart',
  SAVE_COMPLETE: 'saveComplete',
  LOAD_START: 'loadStart',
  LOAD_COMPLETE: 'loadComplete',

  // UI events
  SCREEN_CHANGE: 'screenChange',
  MODAL_OPEN: 'modalOpen',
  MODAL_CLOSE: 'modalClose',
  NOTIFICATION_SHOW: 'notificationShow',

  // Game state events
  GAME_INIT: 'gameInit',
  GAME_PAUSE: 'gamePause',
  GAME_RESUME: 'gameResume',
  GAME_TICK: 'gameTick',

  // Wheel of Fate events
  WHEEL_SPIN: 'wheelSpin',
  WHEEL_REWARD: 'wheelReward',

  // Social events
  SECT_VISIT: 'sectVisit',
  GIFT_SENT: 'giftSent',
  GIFT_RECEIVED: 'giftReceived',
  TOURNAMENT_MATCH: 'tournamentMatch'
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { eventBus, EventBus, EVENTS };
} else {
  // Browser global
  window.eventBus = eventBus;
  window.EventBus = EventBus;
  window.EVENTS = EVENTS;
}
