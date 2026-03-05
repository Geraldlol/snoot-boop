// DramaSystem - Waifu drama events, relationships, and interpersonal chaos

// ─── Types ──────────────────────────────────────────────────

export type DramaEventType = 'positive' | 'negative' | 'maximum';

export interface DramaEventEffect {
  ppMult?: number;
  bpMult?: number;
  allMult?: number;
  bondGainMult?: number;
  expeditionRewards?: number;
  penalty?: number;
  partySeparation?: number;  // duration in ms
  allWaifuPenalty?: number;
}

export interface DramaEventDef {
  id: string;
  name: string;
  emoji: string;
  type: DramaEventType;
  dramaPoints: number;
  duration: number;  // ms
  effect: DramaEventEffect;
  description: string;
  requiresAllWaifus?: boolean;
}

export interface ActiveDramaEvent {
  eventId: string;
  waifu1: string;
  waifu2: string;
  startTime: number;
  expiresAt: number;
  effect: DramaEventEffect;
}

export interface DramaStats {
  totalEventsTriggered: number;
  totalDramaGenerated: number;
  totalDramaHarvested: number;
  bpFromHarvest: number;
  maximumDramaCount: number;
  jealousyEvents: number;
  dramasResolved: number;
}

// ─── Data ───────────────────────────────────────────────────

export const DRAMA_EVENTS: Record<string, DramaEventDef> = {
  // Positive (5)
  tea_time: {
    id: 'tea_time',
    name: 'Tea Time Together',
    emoji: '\uD83C\uDF75',
    type: 'positive',
    dramaPoints: 5,
    duration: 60 * 60 * 1000,  // 1h
    effect: { ppMult: 1.1 },
    description: 'Two waifus share a pleasant afternoon tea, boosting harmony.',
  },
  story_time: {
    id: 'story_time',
    name: 'Story Time',
    emoji: '\uD83D\uDCDA',
    type: 'positive',
    dramaPoints: 8,
    duration: 24 * 60 * 60 * 1000,  // 24h
    effect: { expeditionRewards: 1.15 },
    description: 'Waifus swap tales of adventure, inspiring better expedition outcomes.',
  },
  harmony: {
    id: 'harmony',
    name: 'Perfect Harmony',
    emoji: '\u2728',
    type: 'positive',
    dramaPoints: 15,
    duration: 60 * 60 * 1000,  // 1h
    effect: { allMult: 1.05 },
    description: 'All waifus are in perfect sync. A rare and beautiful moment.',
    requiresAllWaifus: true,
  },
  training_together: {
    id: 'training_together',
    name: 'Training Together',
    emoji: '\u2694\uFE0F',
    type: 'positive',
    dramaPoints: 6,
    duration: 30 * 60 * 1000,  // 30min
    effect: { bpMult: 1.1 },
    description: 'Sparring partners push each other to new heights.',
  },
  gift_exchange: {
    id: 'gift_exchange',
    name: 'Gift Exchange',
    emoji: '\uD83C\uDF81',
    type: 'positive',
    dramaPoints: 10,
    duration: 2 * 60 * 60 * 1000,  // 2h
    effect: { bondGainMult: 1.2 },
    description: 'The waifus exchange thoughtful gifts, deepening all bonds.',
  },

  // Negative (4)
  jealousy: {
    id: 'jealousy',
    name: 'Jealousy Flare',
    emoji: '\uD83D\uDE24',
    type: 'negative',
    dramaPoints: 20,
    duration: 60 * 60 * 1000,  // 1h
    effect: { penalty: 0.5 },
    description: 'A waifu feels neglected. Production suffers as tension rises.',
  },
  argument: {
    id: 'argument',
    name: 'Heated Argument',
    emoji: '\uD83D\uDCA2',
    type: 'negative',
    dramaPoints: 25,
    duration: 24 * 60 * 60 * 1000,  // 24h
    effect: { partySeparation: 24 * 60 * 60 * 1000 },
    description: 'Two waifus refuse to work together. They cannot be in the same party.',
  },
  neglect: {
    id: 'neglect',
    name: 'Feeling Neglected',
    emoji: '\uD83D\uDE14',
    type: 'negative',
    dramaPoints: 15,
    duration: 2 * 60 * 60 * 1000,  // 2h
    effect: { penalty: 0.3 },
    description: 'A waifu has not been interacted with in too long.',
  },
  misunderstanding: {
    id: 'misunderstanding',
    name: 'Misunderstanding',
    emoji: '\u2753',
    type: 'negative',
    dramaPoints: 12,
    duration: 60 * 60 * 1000,  // 1h
    effect: { penalty: 0.2 },
    description: 'A waifu misinterprets your actions. Slight production dip.',
  },

  // Maximum
  critical_mass: {
    id: 'critical_mass',
    name: 'CRITICAL DRAMA MASS',
    emoji: '\uD83D\uDCA5',
    type: 'maximum',
    dramaPoints: 0,  // triggered at 100
    duration: 2 * 60 * 60 * 1000,  // 2h
    effect: { allWaifuPenalty: 0.5 },
    description: 'Drama has reached critical mass! All waifus are at half effectiveness!',
  },
};

const POSITIVE_EVENT_IDS = ['tea_time', 'story_time', 'harmony', 'training_together', 'gift_exchange'];
const NEGATIVE_EVENT_IDS = ['jealousy', 'argument', 'neglect', 'misunderstanding'];
const NEGLECT_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;  // 7 days
const DRAMA_DECAY_PER_MS = 0.5 / 60000;  // 0.5 per minute
const RANDOM_DRAMA_CHANCE_PER_MS = 0.02 / 60000;  // 2% per minute
const HARVEST_THRESHOLD = 50;
const HARVEST_BP_PER_POINT = 1000;
const HARVEST_KEEP_RATIO = 0.5;
const MAXIMUM_DRAMA_THRESHOLD = 100;
const DRAMA_QUEEN_UNLOCK_COUNT = 10;

// ─── Drama Queen Secret Waifu ───────────────────────────────

export interface DramaQueen {
  id: string;
  name: string;
  title: string;
  description: string;
  unlockCondition: string;
}

export const DRAMA_QUEEN: DramaQueen = {
  id: 'valentina',
  name: 'Valentina',
  title: 'The Drama Queen',
  description: 'Born from the chaos of a thousand arguments. She thrives on drama.',
  unlockCondition: 'Trigger maximum drama 10 times',
};

// ─── Serialization ──────────────────────────────────────────

export interface DramaSystemSave {
  dramaPoints: number;
  waifuRelations: Record<string, number>;
  lastInteractionTime: Record<string, number>;
  activeEvents: ActiveDramaEvent[];
  maximumDramaCount: number;
  dramaQueenUnlocked: boolean;
  stats: DramaStats;
}

// ─── DramaSystem Class ─────────────────────────────────────

export class DramaSystem {
  dramaPoints = 0;
  waifuRelations: Record<string, number> = {};
  lastInteractionTime: Record<string, number> = {};
  activeEvents: ActiveDramaEvent[] = [];
  maximumDramaCount = 0;
  dramaQueenUnlocked = false;

  stats: DramaStats = {
    totalEventsTriggered: 0,
    totalDramaGenerated: 0,
    totalDramaHarvested: 0,
    bpFromHarvest: 0,
    maximumDramaCount: 0,
    jealousyEvents: 0,
    dramasResolved: 0,
  };

  // ── Core Update ──────────────────────────────────────────

  update(deltaMs: number, unlockedWaifuIds: string[]): { events: ActiveDramaEvent[]; maximumTriggered: boolean } {
    const now = Date.now();
    const newEvents: ActiveDramaEvent[] = [];
    let maximumTriggered = false;

    // Decay drama over time
    this.dramaPoints = Math.max(0, this.dramaPoints - DRAMA_DECAY_PER_MS * deltaMs);

    // Expire old events
    this.activeEvents = this.activeEvents.filter(e => now < e.expiresAt);

    // Random drama chance
    if (unlockedWaifuIds.length >= 2) {
      const chance = RANDOM_DRAMA_CHANCE_PER_MS * deltaMs;
      if (Math.random() < chance) {
        const event = this.generateRandomDrama(unlockedWaifuIds);
        if (event) {
          newEvents.push(event);
        }
      }
    }

    // Check neglect for each waifu
    for (const waifuId of unlockedWaifuIds) {
      const lastTime = this.lastInteractionTime[waifuId] ?? 0;
      if (lastTime > 0 && now - lastTime >= NEGLECT_THRESHOLD_MS) {
        // Only trigger neglect if not already active for this waifu
        const alreadyNeglected = this.activeEvents.some(
          e => e.eventId === 'neglect' && (e.waifu1 === waifuId || e.waifu2 === waifuId)
        );
        if (!alreadyNeglected) {
          const event = this.triggerDramaEvent('neglect', waifuId, waifuId);
          if (event) newEvents.push(event);
        }
      }
    }

    // Check maximum drama
    if (this.dramaPoints >= MAXIMUM_DRAMA_THRESHOLD) {
      maximumTriggered = true;
      this.maximumDramaCount++;
      this.stats.maximumDramaCount = this.maximumDramaCount;

      // Add critical_mass event if not already active
      const alreadyCritical = this.activeEvents.some(e => e.eventId === 'critical_mass');
      if (!alreadyCritical) {
        const def = DRAMA_EVENTS.critical_mass;
        const critEvent: ActiveDramaEvent = {
          eventId: 'critical_mass',
          waifu1: 'all',
          waifu2: 'all',
          startTime: now,
          expiresAt: now + def.duration,
          effect: { ...def.effect },
        };
        this.activeEvents.push(critEvent);
        newEvents.push(critEvent);
      }

      // Check Drama Queen unlock
      if (this.maximumDramaCount >= DRAMA_QUEEN_UNLOCK_COUNT && !this.dramaQueenUnlocked) {
        this.dramaQueenUnlocked = true;
      }
    }

    return { events: newEvents, maximumTriggered };
  }

  // ── Drama Generation ─────────────────────────────────────

  generateRandomDrama(waifuIds: string[]): ActiveDramaEvent | null {
    if (waifuIds.length < 2) return null;

    // Pick two random waifus
    const shuffled = [...waifuIds].sort(() => Math.random() - 0.5);
    const waifu1 = shuffled[0];
    const waifu2 = shuffled[1];

    // Determine positive vs negative based on their relation
    const relationKey = this.getRelationKey(waifu1, waifu2);
    const relation = this.waifuRelations[relationKey] ?? 0;
    const positiveChance = 0.5 + relation * 0.3;  // -1 to 1 maps to 0.2 to 0.8

    const isPositive = Math.random() < positiveChance;
    const pool = isPositive ? POSITIVE_EVENT_IDS : NEGATIVE_EVENT_IDS;

    // Filter harmony: requires all waifus (handled separately)
    const filtered = pool.filter(id => {
      const def = DRAMA_EVENTS[id];
      if (def.requiresAllWaifus && waifuIds.length < 3) return false;
      return true;
    });

    if (filtered.length === 0) return null;

    const eventId = filtered[Math.floor(Math.random() * filtered.length)];
    return this.triggerDramaEvent(eventId, waifu1, waifu2);
  }

  triggerDramaEvent(eventId: string, waifu1: string, waifu2: string): ActiveDramaEvent | null {
    const def = DRAMA_EVENTS[eventId];
    if (!def) return null;

    const now = Date.now();

    // Add drama points
    this.dramaPoints = Math.min(MAXIMUM_DRAMA_THRESHOLD, this.dramaPoints + def.dramaPoints);
    this.stats.totalDramaGenerated += def.dramaPoints;
    this.stats.totalEventsTriggered++;

    if (eventId === 'jealousy') {
      this.stats.jealousyEvents++;
    }

    // Adjust relations
    const relationKey = this.getRelationKey(waifu1, waifu2);
    const currentRelation = this.waifuRelations[relationKey] ?? 0;

    if (def.type === 'positive') {
      this.waifuRelations[relationKey] = Math.min(1, currentRelation + 0.1);
    } else if (def.type === 'negative') {
      this.waifuRelations[relationKey] = Math.max(-1, currentRelation - 0.15);
    }

    const event: ActiveDramaEvent = {
      eventId,
      waifu1,
      waifu2,
      startTime: now,
      expiresAt: now + def.duration,
      effect: { ...def.effect },
    };

    this.activeEvents.push(event);
    return event;
  }

  // ── Gift Interaction ──────────────────────────────────────

  onGiftGiven(giftedWaifuId: string, allWaifuIds: string[]): ActiveDramaEvent | null {
    const now = Date.now();
    this.lastInteractionTime[giftedWaifuId] = now;

    // 10% chance of jealousy from another waifu
    if (allWaifuIds.length >= 2 && Math.random() < 0.1) {
      const others = allWaifuIds.filter(id => id !== giftedWaifuId);
      const jealousWaifu = others[Math.floor(Math.random() * others.length)];
      return this.triggerDramaEvent('jealousy', jealousWaifu, giftedWaifuId);
    }

    return null;
  }

  // ── Resolution & Harvest ──────────────────────────────────

  resolveDrama(): { success: boolean; dramaCleared: number } {
    const cleared = this.dramaPoints;
    this.dramaPoints = 0;
    this.stats.dramasResolved++;

    // Remove all negative active events
    this.activeEvents = this.activeEvents.filter(e => {
      const def = DRAMA_EVENTS[e.eventId];
      return def && def.type === 'positive';
    });

    return { success: true, dramaCleared: cleared };
  }

  harvestDrama(): { success: boolean; bpGained: number; dramaRemaining: number } {
    if (this.dramaPoints < HARVEST_THRESHOLD) {
      return { success: false, bpGained: 0, dramaRemaining: this.dramaPoints };
    }

    const harvestable = this.dramaPoints;
    const bpGained = Math.floor(harvestable * HARVEST_BP_PER_POINT);
    this.dramaPoints = Math.floor(harvestable * HARVEST_KEEP_RATIO);

    this.stats.totalDramaHarvested += harvestable - this.dramaPoints;
    this.stats.bpFromHarvest += bpGained;

    return { success: true, bpGained, dramaRemaining: this.dramaPoints };
  }

  // ── Effects ───────────────────────────────────────────────

  getCombinedEffects(): DramaEventEffect {
    const now = Date.now();
    const combined: DramaEventEffect = {
      ppMult: 1,
      bpMult: 1,
      allMult: 1,
      bondGainMult: 1,
      expeditionRewards: 1,
    };

    for (const event of this.activeEvents) {
      if (now >= event.expiresAt) continue;

      const eff = event.effect;

      // Multiplicative stacking
      if (eff.ppMult) combined.ppMult! *= eff.ppMult;
      if (eff.bpMult) combined.bpMult! *= eff.bpMult;
      if (eff.allMult) combined.allMult! *= eff.allMult;
      if (eff.bondGainMult) combined.bondGainMult! *= eff.bondGainMult;
      if (eff.expeditionRewards) combined.expeditionRewards! *= eff.expeditionRewards;

      // Penalties reduce the multipliers
      if (eff.penalty) {
        combined.ppMult! *= (1 - eff.penalty);
        combined.bpMult! *= (1 - eff.penalty);
      }

      // All waifu penalty (critical mass)
      if (eff.allWaifuPenalty) {
        combined.ppMult! *= eff.allWaifuPenalty;
        combined.bpMult! *= eff.allWaifuPenalty;
        combined.bondGainMult! *= eff.allWaifuPenalty;
      }
    }

    return combined;
  }

  // ── Helpers ───────────────────────────────────────────────

  private getRelationKey(a: string, b: string): string {
    return a < b ? `${a}:${b}` : `${b}:${a}`;
  }

  getRelation(waifu1: string, waifu2: string): number {
    return this.waifuRelations[this.getRelationKey(waifu1, waifu2)] ?? 0;
  }

  isDramaQueenUnlocked(): boolean {
    return this.dramaQueenUnlocked;
  }

  // ── Serialization ─────────────────────────────────────────

  serialize(): DramaSystemSave {
    return {
      dramaPoints: this.dramaPoints,
      waifuRelations: { ...this.waifuRelations },
      lastInteractionTime: { ...this.lastInteractionTime },
      activeEvents: this.activeEvents.map(e => ({ ...e, effect: { ...e.effect } })),
      maximumDramaCount: this.maximumDramaCount,
      dramaQueenUnlocked: this.dramaQueenUnlocked,
      stats: { ...this.stats },
    };
  }

  deserialize(data: DramaSystemSave): void {
    this.dramaPoints = data.dramaPoints ?? 0;
    this.waifuRelations = data.waifuRelations ?? {};
    this.lastInteractionTime = data.lastInteractionTime ?? {};
    this.activeEvents = (data.activeEvents ?? []).map(e => ({
      ...e,
      effect: { ...e.effect },
    }));
    this.maximumDramaCount = data.maximumDramaCount ?? 0;
    this.dramaQueenUnlocked = data.dramaQueenUnlocked ?? false;
    this.stats = {
      totalEventsTriggered: data.stats?.totalEventsTriggered ?? 0,
      totalDramaGenerated: data.stats?.totalDramaGenerated ?? 0,
      totalDramaHarvested: data.stats?.totalDramaHarvested ?? 0,
      bpFromHarvest: data.stats?.bpFromHarvest ?? 0,
      maximumDramaCount: data.stats?.maximumDramaCount ?? 0,
      jealousyEvents: data.stats?.jealousyEvents ?? 0,
      dramasResolved: data.stats?.dramasResolved ?? 0,
    };
  }
}
