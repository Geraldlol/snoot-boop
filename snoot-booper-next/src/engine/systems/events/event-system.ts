/**
 * EventSystem - Random events, weekly challenges, hidden events
 * Ported from js/events.js (1,895 lines)
 */

import type { GameModifiers } from '../../types';

// ─── Event Templates ────────────────────────────────────────

export interface EventTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  weight: number;
  effects: EventEffect[];
  duration?: number; // seconds, if temporary
  choices?: EventChoice[];
}

export interface EventEffect {
  type: 'bp' | 'pp' | 'jadeCatnip' | 'happiness' | 'bpMult' | 'ppMult' | 'catDrop' | 'gooseFeather';
  value: number;
  duration?: number; // seconds for temporary effects
}

export interface EventChoice {
  label: string;
  effects: EventEffect[];
  successChance?: number;
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  // COMMON
  { id: 'wandering_merchant', name: 'Wandering Merchant', emoji: '\uD83D\uDCB0', description: 'A merchant passes through!', rarity: 'common', weight: 20, effects: [{ type: 'bp', value: 500 }] },
  { id: 'training_day', name: 'Training Day', emoji: '\uD83D\uDCAA', description: 'Extra intense training session!', rarity: 'common', weight: 20, effects: [{ type: 'bpMult', value: 1.25, duration: 300 }] },
  { id: 'catnip_garden', name: 'Catnip Garden Blooms', emoji: '\uD83C\uDF3F', description: 'The garden is flourishing!', rarity: 'common', weight: 15, effects: [{ type: 'happiness', value: 10 }] },
  { id: 'qi_surge', name: 'Qi Surge', emoji: '\u26A1', description: 'A burst of spiritual energy!', rarity: 'common', weight: 15, effects: [{ type: 'pp', value: 200 }] },
  { id: 'meditation_bonus', name: 'Deep Meditation', emoji: '\uD83E\uDDD8', description: 'The sect enters deep meditation.', rarity: 'common', weight: 15, effects: [{ type: 'ppMult', value: 1.5, duration: 180 }] },

  // UNCOMMON
  { id: 'spirit_rain', name: 'Spirit Rain', emoji: '\uD83C\uDF27\uFE0F', description: 'Spiritual rain nourishes the cats!', rarity: 'uncommon', weight: 10, effects: [{ type: 'happiness', value: 25 }, { type: 'pp', value: 500 }] },
  { id: 'treasure_chest', name: 'Treasure Chest', emoji: '\uD83C\uDF81', description: 'A treasure chest appears!', rarity: 'uncommon', weight: 8, effects: [{ type: 'bp', value: 5000 }] },
  { id: 'double_cultivation', name: 'Double Cultivation', emoji: '\u2728', description: 'Cultivation efficiency doubles!', rarity: 'uncommon', weight: 8, effects: [{ type: 'bpMult', value: 2.0, duration: 120 }, { type: 'ppMult', value: 2.0, duration: 120 }] },
  { id: 'stray_cat', name: 'Stray Cat Arrives', emoji: '\uD83D\uDC31', description: 'A cat wants to join!', rarity: 'uncommon', weight: 6, effects: [{ type: 'catDrop', value: 1 }] },

  // RARE
  { id: 'golden_shower', name: 'Golden Qi Rain', emoji: '\uD83C\uDF1F', description: 'Golden energy rains from the heavens!', rarity: 'rare', weight: 3, effects: [{ type: 'bp', value: 25000 }, { type: 'pp', value: 2500 }] },
  { id: 'ancient_scroll', name: 'Ancient Scroll Found', emoji: '\uD83D\uDCDC', description: 'An ancient cultivation scroll!', rarity: 'rare', weight: 2, effects: [{ type: 'bpMult', value: 3.0, duration: 600 }] },
  { id: 'jade_discovery', name: 'Jade Catnip Discovery', emoji: '\uD83D\uDC8E', description: 'A vein of Jade Catnip!', rarity: 'rare', weight: 2, effects: [{ type: 'jadeCatnip', value: 5 }] },

  // LEGENDARY
  { id: 'celestial_convergence', name: 'Celestial Convergence', emoji: '\uD83C\uDF0C', description: 'The stars align for the sect!', rarity: 'legendary', weight: 1, effects: [{ type: 'bpMult', value: 5.0, duration: 300 }, { type: 'ppMult', value: 5.0, duration: 300 }, { type: 'happiness', value: 50 }] },
  { id: 'divine_cat', name: 'Divine Visitation', emoji: '\uD83D\uDE07', description: 'A divine cat descends!', rarity: 'legendary', weight: 0.5, effects: [{ type: 'catDrop', value: 1 }, { type: 'bp', value: 100000 }] },
];

// ─── Weekly Challenges ──────────────────────────────────────

export interface WeeklyChallenge {
  id: string;
  name: string;
  description: string;
  target: number;
  trackingType: 'boops' | 'cats' | 'gooseBoops' | 'criticalBoops' | 'happiness';
  rewards: EventEffect[];
}

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  { id: 'boop_master', name: 'Boop Master', description: 'Perform 10,000 boops', target: 10000, trackingType: 'boops', rewards: [{ type: 'bp', value: 50000 }] },
  { id: 'cat_collector', name: 'Cat Collector', description: 'Recruit 5 new cats', target: 5, trackingType: 'cats', rewards: [{ type: 'jadeCatnip', value: 10 }] },
  { id: 'goose_hunter', name: 'Goose Hunter', description: 'Boop 10 geese', target: 10, trackingType: 'gooseBoops', rewards: [{ type: 'gooseFeather', value: 5 }] },
  { id: 'critical_strike', name: 'Critical Strike', description: 'Land 100 critical boops', target: 100, trackingType: 'criticalBoops', rewards: [{ type: 'bp', value: 25000 }] },
  { id: 'joy_bringer', name: 'Joy Bringer', description: 'Maintain 90+ avg happiness', target: 90, trackingType: 'happiness', rewards: [{ type: 'pp', value: 10000 }] },
];

// ─── Hidden Events ──────────────────────────────────────────

export interface HiddenEvent {
  id: string;
  name: string;
  description: string;
  condition: { type: string; value: number | string };
  reward: EventEffect[];
  oneTime: boolean;
}

export const HIDDEN_EVENTS: HiddenEvent[] = [
  { id: 'midnight_boop', name: 'Midnight Boop', description: 'Booped at the stroke of midnight!', condition: { type: 'hour', value: 0 }, reward: [{ type: 'bp', value: 10000 }], oneTime: true },
  { id: 'lucky_number', name: 'Lucky Number', description: 'Your boops reached 77777!', condition: { type: 'totalBoops', value: 77777 }, reward: [{ type: 'jadeCatnip', value: 7 }], oneTime: true },
  { id: 'cat_army', name: 'Cat Army', description: '100 cats in your sect!', condition: { type: 'catCount', value: 100 }, reward: [{ type: 'bp', value: 100000 }], oneTime: true },
  { id: 'patience', name: 'Patience of the Mountain', description: 'Waited 10 minutes without booping', condition: { type: 'idleTime', value: 600 }, reward: [{ type: 'pp', value: 5000 }], oneTime: true },
];

// ─── EventSystem Class ─────────────────────────────────────

export interface ActiveEvent {
  templateId: string;
  name: string;
  emoji: string;
  description: string;
  effects: EventEffect[];
  startTime: number;
  expiresAt?: number;
}

export class EventSystem {
  private eventHistory: Array<{ eventId: string; time: number }> = [];
  private triggeredHiddenEvents: string[] = [];
  private hiddenEventCooldowns: Record<string, number> = {};
  private lastEventCheck = 0;
  private eventCheckInterval = 60000; // 1 minute between checks

  // Weekly challenge
  private weeklyChallenge: { challengeId: string; progress: number; startTime: number } | null = null;
  private lastWeeklyReset: number | null = null;

  // Active temporary effects
  private activeEffects: Array<{ type: string; value: number; expiresAt: number }> = [];

  // ── Random Events ───────────────────────────────────────

  checkForEvent(modifiers: Partial<GameModifiers>): ActiveEvent | null {
    const now = Date.now();
    if (now - this.lastEventCheck < this.eventCheckInterval) return null;
    this.lastEventCheck = now;

    // Base 15% chance per check
    let chance = 0.15;
    if (modifiers.eventDiscoveryBonus) chance *= modifiers.eventDiscoveryBonus;

    if (Math.random() >= chance) return null;

    return this.rollEvent();
  }

  private rollEvent(): ActiveEvent {
    const totalWeight = EVENT_TEMPLATES.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * totalWeight;

    let selected = EVENT_TEMPLATES[0];
    for (const template of EVENT_TEMPLATES) {
      roll -= template.weight;
      if (roll <= 0) {
        selected = template;
        break;
      }
    }

    const now = Date.now();
    const hasDuration = selected.effects.some(e => e.duration);
    const durations = selected.effects.map(e => e.duration ?? 0);
    const maxDuration = durations.length > 0 ? Math.max(0, ...durations) : 0;

    this.eventHistory.push({ eventId: selected.id, time: now });
    if (this.eventHistory.length > 100) this.eventHistory.shift();

    return {
      templateId: selected.id,
      name: selected.name,
      emoji: selected.emoji,
      description: selected.description,
      effects: selected.effects,
      startTime: now,
      expiresAt: hasDuration ? now + maxDuration * 1000 : undefined,
    };
  }

  // ── Hidden Events ───────────────────────────────────────

  checkHiddenEvents(gameState: {
    totalBoops: number;
    catCount: number;
    gooseBoops: number;
    idleSeconds: number;
  }): HiddenEvent | null {
    const now = Date.now();
    const hour = new Date().getHours();

    for (const event of HIDDEN_EVENTS) {
      if (this.triggeredHiddenEvents.includes(event.id)) continue;
      if (this.hiddenEventCooldowns[event.id] && now < this.hiddenEventCooldowns[event.id]) continue;

      let triggered = false;
      switch (event.condition.type) {
        case 'hour': triggered = hour === event.condition.value; break;
        case 'totalBoops': triggered = gameState.totalBoops >= (event.condition.value as number); break;
        case 'catCount': triggered = gameState.catCount >= (event.condition.value as number); break;
        case 'idleTime': triggered = gameState.idleSeconds >= (event.condition.value as number); break;
      }

      if (triggered) {
        if (event.oneTime) this.triggeredHiddenEvents.push(event.id);
        else this.hiddenEventCooldowns[event.id] = now + 86400000; // 24h cooldown
        return event;
      }
    }
    return null;
  }

  // ── Weekly Challenge ──────────────────────────────────────

  getWeeklyChallenge(): { challenge: WeeklyChallenge; progress: number } | null {
    if (!this.weeklyChallenge) this.rollWeeklyChallenge();
    if (!this.weeklyChallenge) return null;

    const challenge = WEEKLY_CHALLENGES.find(c => c.id === this.weeklyChallenge!.challengeId);
    if (!challenge) return null;

    return { challenge, progress: this.weeklyChallenge.progress };
  }

  updateWeeklyProgress(type: string, amount: number): boolean {
    if (!this.weeklyChallenge) return false;
    const challenge = WEEKLY_CHALLENGES.find(c => c.id === this.weeklyChallenge!.challengeId);
    if (!challenge || challenge.trackingType !== type) return false;

    this.weeklyChallenge.progress += amount;
    return this.weeklyChallenge.progress >= challenge.target;
  }

  private rollWeeklyChallenge(): void {
    const now = Date.now();
    // Reset weekly
    if (this.lastWeeklyReset && now - this.lastWeeklyReset < 604800000) return;

    const challenge = WEEKLY_CHALLENGES[Math.floor(Math.random() * WEEKLY_CHALLENGES.length)];
    this.weeklyChallenge = { challengeId: challenge.id, progress: 0, startTime: now };
    this.lastWeeklyReset = now;
  }

  // ── Temporary Effects ─────────────────────────────────────

  addTemporaryEffect(type: string, value: number, durationSeconds: number): void {
    this.activeEffects.push({
      type,
      value,
      expiresAt: Date.now() + durationSeconds * 1000,
    });
  }

  getActiveEffectMultiplier(type: string): number {
    const now = Date.now();
    this.activeEffects = this.activeEffects.filter(e => e.expiresAt > now);
    let mult = 1;
    for (const e of this.activeEffects) {
      if (e.type === type) mult *= e.value;
    }
    return mult;
  }

  getActiveEffects(): Array<{ type: string; value: number; expiresAt: number }> {
    const now = Date.now();
    this.activeEffects = this.activeEffects.filter(e => e.expiresAt > now);
    return [...this.activeEffects];
  }

  // ── Serialization ─────────────────────────────────────────

  serialize() {
    return {
      eventHistory: this.eventHistory,
      weeklyChallenge: this.weeklyChallenge,
      lastWeeklyReset: this.lastWeeklyReset,
      triggeredHiddenEvents: this.triggeredHiddenEvents,
      hiddenEventCooldowns: this.hiddenEventCooldowns,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.eventHistory) this.eventHistory = data.eventHistory as typeof this.eventHistory;
    if (data.weeklyChallenge) this.weeklyChallenge = data.weeklyChallenge as typeof this.weeklyChallenge;
    if (data.lastWeeklyReset !== undefined) this.lastWeeklyReset = data.lastWeeklyReset as number | null;
    if (data.triggeredHiddenEvents) this.triggeredHiddenEvents = data.triggeredHiddenEvents as string[];
    if (data.hiddenEventCooldowns) this.hiddenEventCooldowns = data.hiddenEventCooldowns as Record<string, number>;
  }
}
