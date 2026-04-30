/**
 * EventBus - Typed cross-system communication
 *
 * "When the Seven Masters unite, no snoot shall go un-booped."
 * — The Celestial Snoot Scripture
 */

// All game event names as a const enum for type safety
export const EVENTS = {
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
  TOURNAMENT_MATCH: 'tournamentMatch',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

interface Listener {
  callback: (data: unknown) => void;
  context: unknown;
}

interface HistoryEntry {
  event: string;
  data: unknown;
  timestamp: number;
}

export class EventBus {
  private listeners = new Map<string, Listener[]>();
  private onceListeners = new Map<string, Listener[]>();
  private history: HistoryEntry[] = [];
  private maxHistorySize = 100;
  private debug = false;
  private onError: ((event: string, error: unknown) => void) | null = null;

  on(event: string, callback: (data: unknown) => void, context: unknown = null): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    const listener: Listener = { callback, context };
    this.listeners.get(event)!.push(listener);

    if (this.debug) console.log(`[EventBus] Subscribed to '${event}'`);

    return () => this.off(event, callback, context);
  }

  once(event: string, callback: (data: unknown) => void, context: unknown = null): () => void {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, []);
    }
    const listener: Listener = { callback, context };
    this.onceListeners.get(event)!.push(listener);

    return () => {
      const listeners = this.onceListeners.get(event);
      if (listeners) {
        const index = listeners.findIndex(l => l.callback === callback && l.context === context);
        if (index !== -1) listeners.splice(index, 1);
      }
    };
  }

  off(event: string, callback: (data: unknown) => void, context: unknown = null): boolean {
    const listeners = this.listeners.get(event);
    if (!listeners) return false;

    const index = listeners.findIndex(l => l.callback === callback && l.context === context);
    if (index !== -1) {
      listeners.splice(index, 1);
      return true;
    }
    return false;
  }

  emit(event: string, data: unknown = null): number {
    let listenerCount = 0;

    this.addToHistory(event, data);
    if (this.debug) console.log(`[EventBus] Emitting '${event}'`, data);

    // Regular listeners
    const listeners = this.listeners.get(event);
    if (listeners) {
      for (const listener of [...listeners]) {
        try {
          if (listener.context) {
            listener.callback.call(listener.context, data);
          } else {
            listener.callback(data);
          }
          listenerCount++;
        } catch (error) {
          console.error(`[EventBus] Error in listener for '${event}':`, error);
          this.handleError(event, error);
        }
      }
    }

    // Once listeners
    const onceListeners = this.onceListeners.get(event);
    if (onceListeners && onceListeners.length > 0) {
      const copy = [...onceListeners];
      this.onceListeners.set(event, []);
      for (const listener of copy) {
        try {
          if (listener.context) {
            listener.callback.call(listener.context, data);
          } else {
            listener.callback(data);
          }
          listenerCount++;
        } catch (error) {
          console.error(`[EventBus] Error in once listener for '${event}':`, error);
          this.handleError(event, error);
        }
      }
    }

    return listenerCount;
  }

  hasListeners(event: string): boolean {
    const regular = this.listeners.get(event);
    const once = this.onceListeners.get(event);
    return (!!regular && regular.length > 0) || (!!once && once.length > 0);
  }

  listenerCount(event: string): number {
    return (this.listeners.get(event)?.length ?? 0) + (this.onceListeners.get(event)?.length ?? 0);
  }

  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event);
      this.onceListeners.delete(event);
    } else {
      this.listeners.clear();
      this.onceListeners.clear();
    }
  }

  getEventNames(): string[] {
    return Array.from(new Set([...this.listeners.keys(), ...this.onceListeners.keys()]));
  }

  getHistory(count = 10): HistoryEntry[] {
    return this.history.slice(-count);
  }

  setDebug(enabled: boolean): void {
    this.debug = enabled;
  }

  setOnError(handler: ((event: string, error: unknown) => void) | null): void {
    this.onError = handler;
  }

  private handleError(event: string, error: unknown): void {
    if (this.onError) {
      this.onError(event, error);
    }
    if (this.debug) {
      throw error;
    }
  }

  private addToHistory(event: string, data: unknown): void {
    this.history.push({ event, data, timestamp: Date.now() });
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }
  }
}

// Singleton instance
export const eventBus = new EventBus();
