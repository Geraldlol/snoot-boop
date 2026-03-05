/**
 * IdleSystem - AFK calculations and return-from-idle
 *
 * Handles offline progress (PP, BP, events), idle detection, and
 * happiness decay while away. Pure TypeScript, zero React imports.
 */

// ─── Constants ───────────────────────────────────────────────

export const IDLE_CONSTANTS = {
  MAX_AFK_TIME: 24 * 60 * 60 * 1000,    // 24 hours
  MIN_AFK_TIME: 60 * 1000,               // 1 minute
  IDLE_THRESHOLD: 30 * 1000,             // 30 seconds
  EVENT_BASE_CHANCE: 0.3,                // per hour
  STRAY_CAT_BASE_CHANCE: 0.02,           // per hour
  HAPPINESS_DECAY_RATE: 0.5,             // per hour
  AFK_EFFICIENCY: 0.75,                  // 75% of online rates
} as const;

// ─── AFK Events ──────────────────────────────────────────────

export type AFKEventTier = 'common' | 'rare' | 'legendary' | 'special';

export interface AFKEventDef {
  id: string;
  name: string;
  description: string;
  tier: AFKEventTier;
  reward: AFKEventReward;
}

export interface AFKEventReward {
  type: 'bp' | 'pp' | 'jadeCatnip' | 'gooseFeather' | 'cat' | 'equipment' | 'technique';
  /** For percentage-based rewards, this is 0..1 fraction. For flat, absolute value. */
  value: number;
  isPercent: boolean;
}

// ── Common (60%) ─────────────────────────────────────────────

const COMMON_EVENTS: AFKEventDef[] = [
  { id: 'afk_c1', name: 'Cat Nap Bonus',       description: 'Your cats napped productively.',   tier: 'common', reward: { type: 'pp',  value: 0.02, isPercent: true } },
  { id: 'afk_c2', name: 'Stray Visitor',        description: 'A stray left a small gift.',       tier: 'common', reward: { type: 'bp',  value: 0.03, isPercent: true } },
  { id: 'afk_c3', name: 'Meditation Progress',  description: 'Passive cultivation bore fruit.',  tier: 'common', reward: { type: 'pp',  value: 0.04, isPercent: true } },
  { id: 'afk_c4', name: 'Feather Find',         description: 'A goose feather blew in.',         tier: 'common', reward: { type: 'bp',  value: 0.02, isPercent: true } },
  { id: 'afk_c5', name: 'Snoot Dreams',         description: 'Your cats dreamed of boops.',      tier: 'common', reward: { type: 'pp',  value: 0.05, isPercent: true } },
  { id: 'afk_c6', name: 'Loose Change',         description: 'BP found under the cushions.',     tier: 'common', reward: { type: 'bp',  value: 0.03, isPercent: true } },
  { id: 'afk_c7', name: 'Quiet Cultivation',    description: 'The sect cultivated in peace.',    tier: 'common', reward: { type: 'pp',  value: 0.03, isPercent: true } },
];

// ── Rare (25%) ───────────────────────────────────────────────

const RARE_EVENTS: AFKEventDef[] = [
  { id: 'afk_r1', name: 'Jade Discovery',       description: 'A vein of jade catnip was found!',  tier: 'rare', reward: { type: 'jadeCatnip',   value: 3,    isPercent: false } },
  { id: 'afk_r2', name: 'Merchant Visit',        description: 'A merchant left generous gifts.',    tier: 'rare', reward: { type: 'bp',           value: 0.10, isPercent: true } },
  { id: 'afk_r3', name: 'Goose Feather Storm',   description: 'A flock dropped feathers.',          tier: 'rare', reward: { type: 'gooseFeather',  value: 5,    isPercent: false } },
  { id: 'afk_r4', name: 'PP Surge',              description: 'Cats meditated together.',            tier: 'rare', reward: { type: 'pp',           value: 0.15, isPercent: true } },
  { id: 'afk_r5', name: 'BP Windfall',           description: 'A generous donation appeared.',       tier: 'rare', reward: { type: 'bp',           value: 0.12, isPercent: true } },
];

// ── Legendary (10%) ──────────────────────────────────────────

const LEGENDARY_EVENTS: AFKEventDef[] = [
  { id: 'afk_l1', name: 'Celestial Alignment',  description: 'The stars blessed your sect.',  tier: 'legendary', reward: { type: 'jadeCatnip',  value: 10,   isPercent: false } },
  { id: 'afk_l2', name: 'Qi Explosion',         description: 'Massive qi buildup released.',   tier: 'legendary', reward: { type: 'pp',          value: 0.30, isPercent: true } },
  { id: 'afk_l3', name: 'Ancient Treasure',     description: 'A buried treasure was unearthed.', tier: 'legendary', reward: { type: 'bp',       value: 0.25, isPercent: true } },
];

// ── Special (5%) ─────────────────────────────────────────────

const SPECIAL_EVENTS: AFKEventDef[] = [
  { id: 'afk_s1', name: 'Stray Cat Arrived',    description: 'A wandering cat joined your sect!',  tier: 'special', reward: { type: 'cat',       value: 1, isPercent: false } },
  { id: 'afk_s2', name: 'Lost Technique Scroll', description: 'An ancient scroll was found.',      tier: 'special', reward: { type: 'technique', value: 1, isPercent: false } },
];

const EVENT_TIERS: { tier: AFKEventTier; threshold: number; pool: AFKEventDef[] }[] = [
  { tier: 'special',   threshold: 0.05, pool: SPECIAL_EVENTS },
  { tier: 'legendary', threshold: 0.15, pool: LEGENDARY_EVENTS },
  { tier: 'rare',      threshold: 0.40, pool: RARE_EVENTS },
  { tier: 'common',    threshold: 1.00, pool: COMMON_EVENTS },
];

// ─── AFK Gains Result ───────────────────────────────────────

export interface AFKGainsResult {
  timeAway: number;          // ms actually counted
  pp: number;
  bp: number;
  events: AFKEventInstance[];
  happinessDecay: number;    // total percentage points lost
}

export interface AFKEventInstance {
  event: AFKEventDef;
  /** Resolved absolute reward value. */
  resolvedValue: number;
}

// ─── System ──────────────────────────────────────────────────

export class IdleSystem {
  private lastActiveTime: number = Date.now();
  private isIdle = false;
  private idleStartTime = 0;
  private accumulatedIdleTime = 0;

  // ── AFK Gains Calculation ─────────────────────────────────

  /**
   * Calculate what the player earned while away.
   *
   * @param lastSaveTime Timestamp of the last save.
   * @param modifiers    Current game modifier values.
   * @returns The computed gains, events, and happiness decay.
   */
  calculateAFKGains(
    lastSaveTime: number,
    modifiers: {
      ppPerSec: number;
      bpPerSec?: number;
      afkMultiplier: number;
      masterAfkBonus: number;
      waifuAfkBonus: number;
    },
  ): AFKGainsResult {
    const now = Date.now();
    const rawElapsed = now - lastSaveTime;

    // Clamp to allowed range
    if (rawElapsed < IDLE_CONSTANTS.MIN_AFK_TIME) {
      return { timeAway: 0, pp: 0, bp: 0, events: [], happinessDecay: 0 };
    }

    const elapsed = Math.min(rawElapsed, IDLE_CONSTANTS.MAX_AFK_TIME);
    const seconds = elapsed / 1000;
    const hours = elapsed / (1000 * 60 * 60);

    // ── PP ──
    const ppMultiplier =
      IDLE_CONSTANTS.AFK_EFFICIENCY *
      modifiers.afkMultiplier *
      modifiers.masterAfkBonus *
      modifiers.waifuAfkBonus;

    const pp = modifiers.ppPerSec * seconds * ppMultiplier;

    // ── BP (passive / building based) ──
    const bpPerSec = modifiers.bpPerSec ?? 0;
    const bp = bpPerSec * seconds * IDLE_CONSTANTS.AFK_EFFICIENCY * modifiers.afkMultiplier;

    // ── Events ──
    const events = this.generateAFKEvents(elapsed);

    // ── Happiness Decay ──
    const happinessDecay = hours * IDLE_CONSTANTS.HAPPINESS_DECAY_RATE;

    return {
      timeAway: elapsed,
      pp,
      bp,
      events,
      happinessDecay,
    };
  }

  // ── Event Generation ──────────────────────────────────────

  generateAFKEvents(elapsedMs: number): AFKEventInstance[] {
    const hours = elapsedMs / (1000 * 60 * 60);
    const eventRolls = Math.floor(hours * IDLE_CONSTANTS.EVENT_BASE_CHANCE + Math.random());
    const events: AFKEventInstance[] = [];

    for (let i = 0; i < eventRolls; i++) {
      const roll = Math.random();

      // Pick tier
      let pool: AFKEventDef[] = COMMON_EVENTS;
      for (const tier of EVENT_TIERS) {
        if (roll < tier.threshold) {
          pool = tier.pool;
          break;
        }
      }

      // Pick random event from pool
      const event = pool[Math.floor(Math.random() * pool.length)];
      events.push({
        event,
        resolvedValue: event.reward.value, // caller resolves % later
      });
    }

    return events;
  }

  // ── Idle Detection ────────────────────────────────────────

  /** Call this whenever the player performs an action (boop, click, etc.). */
  recordActivity(): void {
    const now = Date.now();

    if (this.isIdle) {
      this.accumulatedIdleTime += now - this.idleStartTime;
    }

    this.lastActiveTime = now;
    this.isIdle = false;
    this.idleStartTime = 0;
  }

  /**
   * Check whether the player has gone idle. Call from the game loop.
   * Returns true if the player just transitioned to idle.
   */
  checkIdleStatus(now: number = Date.now()): boolean {
    if (this.isIdle) return false;

    if (now - this.lastActiveTime >= IDLE_CONSTANTS.IDLE_THRESHOLD) {
      this.isIdle = true;
      this.idleStartTime = now;
      return true;
    }

    return false;
  }

  // ── Queries ───────────────────────────────────────────────

  getIsIdle(): boolean {
    return this.isIdle;
  }

  getLastActiveTime(): number {
    return this.lastActiveTime;
  }

  getIdleDuration(): number {
    if (!this.isIdle) return 0;
    return Date.now() - this.idleStartTime;
  }

  getAccumulatedIdleTime(): number {
    let total = this.accumulatedIdleTime;
    if (this.isIdle) {
      total += Date.now() - this.idleStartTime;
    }
    return total;
  }

  // ── Serialization ─────────────────────────────────────────

  serialize(): Record<string, unknown> {
    return {
      lastActiveTime: this.lastActiveTime,
      isIdle: this.isIdle,
      idleStartTime: this.idleStartTime,
      accumulatedIdleTime: this.accumulatedIdleTime,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (typeof data.lastActiveTime === 'number') this.lastActiveTime = data.lastActiveTime;
    if (typeof data.isIdle === 'boolean') this.isIdle = data.isIdle;
    if (typeof data.idleStartTime === 'number') this.idleStartTime = data.idleStartTime;
    if (typeof data.accumulatedIdleTime === 'number') this.accumulatedIdleTime = data.accumulatedIdleTime;
  }
}
