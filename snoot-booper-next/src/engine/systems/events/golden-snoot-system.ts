/**
 * GoldenSnootSystem - Golden cookie-style random events
 *
 * Spawns clickable golden snoots at random intervals. Each snoot carries
 * a weighted random effect (frenzy, lucky payout, click storm, etc.).
 * Pure TypeScript, zero React imports.
 */

// ─── Data ────────────────────────────────────────────────────

export type GoldenSnootEventId =
  | 'boop_frenzy'
  | 'lucky_snoot'
  | 'click_storm'
  | 'catnip_rain'
  | 'golden_hour'
  | 'mega_crit'
  | 'time_warp'
  | 'jackpot';

export interface GoldenSnootEventDef {
  id: GoldenSnootEventId;
  name: string;
  description: string;
  weight: number;
  /** Duration in ms.  0 = instant effect. */
  duration: number;
  effect: Record<string, number | boolean>;
}

export const GOLDEN_SNOOT_EVENTS: Record<GoldenSnootEventId, GoldenSnootEventDef> = {
  boop_frenzy: {
    id: 'boop_frenzy',
    name: 'Boop Frenzy',
    description: 'All boops earn 7x BP for 77 seconds!',
    weight: 25,
    duration: 77_000,
    effect: { bpMultiplier: 7 },
  },
  lucky_snoot: {
    id: 'lucky_snoot',
    name: 'Lucky Snoot',
    description: 'Instantly gain 13% of your total BP earned!',
    weight: 20,
    duration: 0,
    effect: { instantBpPercent: 0.13 },
  },
  click_storm: {
    id: 'click_storm',
    name: 'Click Storm',
    description: '777 super-boops at 777x power!',
    weight: 10,
    duration: 0,
    effect: { superBoops: 777, superBoopMultiplier: 777 },
  },
  catnip_rain: {
    id: 'catnip_rain',
    name: 'Catnip Rain',
    description: 'Resources rain from the sky for 30 seconds!',
    weight: 15,
    duration: 30_000,
    effect: { resourceRain: true },
  },
  golden_hour: {
    id: 'golden_hour',
    name: 'Golden Hour',
    description: 'All production doubled for 1 hour!',
    weight: 8,
    duration: 3_600_000,
    effect: { productionMultiplier: 2 },
  },
  mega_crit: {
    id: 'mega_crit',
    name: 'Mega Crit',
    description: 'Your next 100 boops are guaranteed crits!',
    weight: 18,
    duration: 0,
    effect: { guaranteedCrits: 100 },
  },
  time_warp: {
    id: 'time_warp',
    name: 'Time Warp',
    description: 'Instantly gain 1 hour of offline progress!',
    weight: 5,
    duration: 0,
    effect: { offlineProgressMs: 3_600_000 },
  },
  jackpot: {
    id: 'jackpot',
    name: 'Jackpot',
    description: 'A massive random bonus!',
    weight: 3,
    duration: 0,
    effect: { jackpot: true },
  },
};

const ALL_EVENTS = Object.values(GOLDEN_SNOOT_EVENTS);
const TOTAL_WEIGHT = ALL_EVENTS.reduce((s, e) => s + e.weight, 0);

// ─── Active Effect ───────────────────────────────────────────

export interface ActiveGoldenEffect {
  eventId: GoldenSnootEventId;
  remaining: number; // ms remaining (0 for instant effects already applied)
  effect: Record<string, number | boolean>;
}

// ─── Active Snoot ────────────────────────────────────────────

export interface ActiveSnoot {
  eventId: GoldenSnootEventId;
  position: { x: number; y: number };
  spawnedAt: number; // timestamp
}

// ─── Click Result ────────────────────────────────────────────

export interface GoldenSnootClickResult {
  eventId: GoldenSnootEventId;
  name: string;
  description: string;
  duration: number;
  effect: Record<string, number | boolean>;
}

// ─── Stats ───────────────────────────────────────────────────

export interface GoldenSnootStats {
  totalSpawned: number;
  totalClicked: number;
  totalMissed: number;
  eventCounts: Partial<Record<GoldenSnootEventId, number>>;
}

// ─── System ──────────────────────────────────────────────────

export class GoldenSnootSystem {
  // Spawn timing
  private readonly minSpawnInterval = 180_000;  // 3 min
  private readonly maxSpawnInterval = 600_000;  // 10 min
  private readonly snootLifetime = 10_000;      // 10s to click

  // Current snoot on screen (or null)
  private activeSnoot: ActiveSnoot | null = null;
  private snootSpawnedAt = 0;
  private nextSpawnAt: number;

  // Active timed effects
  private activeEffects: ActiveGoldenEffect[] = [];

  // Super-boop tracking (from click_storm)
  private remainingSuperBoops = 0;
  private superBoopMultiplier = 1;

  // Guaranteed crits (from mega_crit)
  private remainingGuaranteedCrits = 0;

  // Lifetime stats
  private stats: GoldenSnootStats = {
    totalSpawned: 0,
    totalClicked: 0,
    totalMissed: 0,
    eventCounts: {},
  };

  constructor() {
    this.nextSpawnAt = Date.now() + this.rollSpawnDelay();
  }

  // ── Update (call every tick) ──────────────────────────────

  update(deltaMs: number): void {
    const now = Date.now();

    // Tick active timed effects
    for (let i = this.activeEffects.length - 1; i >= 0; i--) {
      this.activeEffects[i].remaining -= deltaMs;
      if (this.activeEffects[i].remaining <= 0) {
        this.activeEffects.splice(i, 1);
      }
    }

    // Check if active snoot expired
    if (this.activeSnoot && now - this.activeSnoot.spawnedAt >= this.snootLifetime) {
      this.missGoldenSnoot();
    }

    // Check if it is time to spawn a new snoot
    if (!this.activeSnoot && now >= this.nextSpawnAt) {
      this.spawnGoldenSnoot();
    }
  }

  // ── Spawning ──────────────────────────────────────────────

  spawnGoldenSnoot(): ActiveSnoot {
    const eventDef = this.rollEvent();
    const snoot: ActiveSnoot = {
      eventId: eventDef.id,
      position: {
        x: 100 + Math.random() * 600,
        y: 100 + Math.random() * 400,
      },
      spawnedAt: Date.now(),
    };

    this.activeSnoot = snoot;
    this.snootSpawnedAt = snoot.spawnedAt;
    this.stats.totalSpawned++;
    this.nextSpawnAt = Date.now() + this.snootLifetime + this.rollSpawnDelay();

    return snoot;
  }

  // ── Clicking ──────────────────────────────────────────────

  clickGoldenSnoot(): GoldenSnootClickResult | null {
    if (!this.activeSnoot) return null;

    const eventDef = GOLDEN_SNOOT_EVENTS[this.activeSnoot.eventId];
    this.activeSnoot = null;
    this.stats.totalClicked++;
    this.stats.eventCounts[eventDef.id] = (this.stats.eventCounts[eventDef.id] ?? 0) + 1;

    // Apply effect
    this.activateEffect(eventDef);

    return {
      eventId: eventDef.id,
      name: eventDef.name,
      description: eventDef.description,
      duration: eventDef.duration,
      effect: { ...eventDef.effect },
    };
  }

  // ── Missing ───────────────────────────────────────────────

  missGoldenSnoot(): void {
    if (!this.activeSnoot) return;
    this.activeSnoot = null;
    this.stats.totalMissed++;
  }

  // ── Effect activation ─────────────────────────────────────

  private activateEffect(def: GoldenSnootEventDef): void {
    // Instant effects
    if (def.effect.superBoops) {
      this.remainingSuperBoops += def.effect.superBoops as number;
      this.superBoopMultiplier = def.effect.superBoopMultiplier as number;
    }
    if (def.effect.guaranteedCrits) {
      this.remainingGuaranteedCrits += def.effect.guaranteedCrits as number;
    }

    // Timed effects (duration > 0)
    if (def.duration > 0) {
      this.activeEffects.push({
        eventId: def.id,
        remaining: def.duration,
        effect: { ...def.effect },
      });
    }
  }

  // ── Multiplier queries ────────────────────────────────────

  /** Product of all active BP multiplier effects. */
  getBpMultiplier(): number {
    let mult = 1;
    for (const eff of this.activeEffects) {
      if (typeof eff.effect.bpMultiplier === 'number') {
        mult *= eff.effect.bpMultiplier;
      }
    }
    return mult;
  }

  /** Product of all active production multiplier effects. */
  getProductionMultiplier(): number {
    let mult = 1;
    for (const eff of this.activeEffects) {
      if (typeof eff.effect.productionMultiplier === 'number') {
        mult *= eff.effect.productionMultiplier;
      }
    }
    return mult;
  }

  /** Whether catnip rain is active. */
  isResourceRainActive(): boolean {
    return this.activeEffects.some(e => e.effect.resourceRain === true);
  }

  /**
   * Consume one super-boop charge. Returns the multiplier if charges
   * remain, otherwise returns 1.
   */
  consumeSuperBoop(): number {
    if (this.remainingSuperBoops <= 0) return 1;
    this.remainingSuperBoops--;
    return this.superBoopMultiplier;
  }

  /**
   * Consume one guaranteed-crit charge. Returns true if a charge was
   * available (and consumed).
   */
  consumeGuaranteedCrit(): boolean {
    if (this.remainingGuaranteedCrits <= 0) return false;
    this.remainingGuaranteedCrits--;
    return true;
  }

  // ── Getters ───────────────────────────────────────────────

  getActiveSnoot(): ActiveSnoot | null {
    return this.activeSnoot;
  }

  getActiveEffects(): readonly ActiveGoldenEffect[] {
    return this.activeEffects;
  }

  getRemainingSuperBoops(): number {
    return this.remainingSuperBoops;
  }

  getRemainingGuaranteedCrits(): number {
    return this.remainingGuaranteedCrits;
  }

  getStats(): Readonly<GoldenSnootStats> {
    return this.stats;
  }

  getSnootLifetime(): number {
    return this.snootLifetime;
  }

  getSnootTimeRemaining(): number {
    if (!this.activeSnoot) return 0;
    const elapsed = Date.now() - this.activeSnoot.spawnedAt;
    return Math.max(0, this.snootLifetime - elapsed);
  }

  // ── Internals ─────────────────────────────────────────────

  private rollSpawnDelay(): number {
    return this.minSpawnInterval + Math.random() * (this.maxSpawnInterval - this.minSpawnInterval);
  }

  private rollEvent(): GoldenSnootEventDef {
    let roll = Math.random() * TOTAL_WEIGHT;
    for (const ev of ALL_EVENTS) {
      roll -= ev.weight;
      if (roll <= 0) return ev;
    }
    return ALL_EVENTS[0];
  }

  // ── Serialization ─────────────────────────────────────────

  serialize(): Record<string, unknown> {
    return {
      nextSpawnAt: this.nextSpawnAt,
      activeEffects: this.activeEffects.map(e => ({
        eventId: e.eventId,
        remaining: e.remaining,
        effect: e.effect,
      })),
      remainingSuperBoops: this.remainingSuperBoops,
      superBoopMultiplier: this.superBoopMultiplier,
      remainingGuaranteedCrits: this.remainingGuaranteedCrits,
      stats: this.stats,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (typeof data.nextSpawnAt === 'number') this.nextSpawnAt = data.nextSpawnAt;
    if (Array.isArray(data.activeEffects)) {
      this.activeEffects = (data.activeEffects as ActiveGoldenEffect[]).map(e => ({
        eventId: e.eventId,
        remaining: e.remaining,
        effect: e.effect,
      }));
    }
    if (typeof data.remainingSuperBoops === 'number') this.remainingSuperBoops = data.remainingSuperBoops;
    if (typeof data.superBoopMultiplier === 'number') this.superBoopMultiplier = data.superBoopMultiplier;
    if (typeof data.remainingGuaranteedCrits === 'number') this.remainingGuaranteedCrits = data.remainingGuaranteedCrits;
    if (data.stats) this.stats = data.stats as GoldenSnootStats;
  }
}
