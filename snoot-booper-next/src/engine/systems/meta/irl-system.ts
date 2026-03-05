/**
 * IRLIntegrationSystem - Real-world time bonuses, weather, weird events
 * Ported from js/irl-integration.js
 * "Touch grass, gain snoots"
 */

// ─── Types ──────────────────────────────────────────────────

export interface TimeBonusEffects {
  expMultiplier?: number;
  bpMultiplier?: number;
  ppMultiplier?: number;
  lootMultiplier?: number;
  afkMultiplier?: number;
  weirdEventChance?: number;
}

export interface TimeBonus {
  id: string;
  name: string;
  hours: number[];
  effects: TimeBonusEffects;
  description: string;
}

export interface WeatherEffects {
  catHappiness?: number;
  ppMultiplier?: number;
  eventBonus?: number;
  critChance?: number;
  activeMultiplier?: number;
  afkMultiplier?: number;
}

export interface WeatherType {
  id: string;
  name: string;
  effects: WeatherEffects;
  description: string;
}

export interface WeirdEvent {
  id: string;
  name: string;
  message: string;
  effect: WeirdEventEffect;
}

export interface WeirdEventEffect {
  destinyThreads?: number;
  pp?: number;
  bp?: number;
  gooseFeathers?: number;
  allMultiplier?: number;
  catRecruitDiscount?: number;
  critMultiplier?: number;
  duration?: number;
}

export interface ActiveEffect {
  name: string;
  allMultiplier?: number;
  catRecruitDiscount?: number;
  critMultiplier?: number;
  endsAt: number;
}

export interface IRLCombinedEffects {
  bpMultiplier: number;
  ppMultiplier: number;
  expMultiplier: number;
  lootMultiplier: number;
  critChance: number;
  critMultiplier: number;
  afkMultiplier: number;
  catHappiness: number;
  eventBonus: number;
  activeMultiplier: number;
}

export interface IRLStats {
  cursedHoursPlayed: number;
  weirdEventsExperienced: number;
  earlyBirdSessions: number;
  nightOwlSessions: number;
}

export interface WeirdEventRecord {
  event: WeirdEvent;
  timestamp: number;
}

export interface IRLSerializedData {
  stats: IRLStats;
  weirdEventsTriggered: WeirdEventRecord[];
  lastWeatherChange: number;
  currentWeatherId: string | null;
}

// ─── Data ───────────────────────────────────────────────────

export const TIME_BONUSES: Record<string, TimeBonus> = {
  early_bird: {
    id: 'early_bird',
    name: 'Early Bird',
    hours: [6, 7, 8],
    effects: { expMultiplier: 1.2 },
    description: '+20% EXP gain',
  },
  morning: {
    id: 'morning',
    name: 'Morning Routine',
    hours: [9, 10, 11],
    effects: { bpMultiplier: 1.1 },
    description: '+10% BP gain',
  },
  afternoon: {
    id: 'afternoon',
    name: 'Afternoon Grind',
    hours: [12, 13, 14, 15, 16],
    effects: {},
    description: 'Normal rates',
  },
  after_work: {
    id: 'after_work',
    name: 'After Work',
    hours: [17, 18, 19, 20],
    effects: { lootMultiplier: 1.1 },
    description: '+10% loot quality',
  },
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    hours: [21, 22, 23],
    effects: { ppMultiplier: 1.15 },
    description: '+15% PP gain',
  },
  cursed_hours: {
    id: 'cursed_hours',
    name: 'Cursed Hours',
    hours: [0, 1, 2],
    effects: {
      bpMultiplier: 1.5,
      ppMultiplier: 1.5,
      weirdEventChance: 0.1,
    },
    description: '+50% everything, strange things may happen...',
  },
  why_awake: {
    id: 'why_awake',
    name: 'Why Are You Awake?',
    hours: [3, 4, 5],
    effects: { afkMultiplier: 2.0 },
    description: '+100% AFK gains, concerned waifus',
  },
};

export const WEATHER_TYPES: Record<string, WeatherType> = {
  sunny: {
    id: 'sunny',
    name: 'Sunny',
    effects: { catHappiness: 1.1 },
    description: '+10% cat happiness',
  },
  rainy: {
    id: 'rainy',
    name: 'Rainy',
    effects: { ppMultiplier: 1.25 },
    description: '+25% PP (cats love naps)',
  },
  cloudy: {
    id: 'cloudy',
    name: 'Cloudy',
    effects: {},
    description: 'Neutral conditions',
  },
  snowy: {
    id: 'snowy',
    name: 'Snowy',
    effects: { eventBonus: 1.5 },
    description: '+50% event rewards',
  },
  stormy: {
    id: 'stormy',
    name: 'Stormy',
    effects: { critChance: 0.1 },
    description: '+10% crit chance (lightning boosts)',
  },
  extreme_heat: {
    id: 'extreme_heat',
    name: 'Extreme Heat',
    effects: { activeMultiplier: 0.9, afkMultiplier: 1.5 },
    description: '-10% active gains, +50% AFK (lazy cats)',
  },
};

export const WEIRD_EVENTS: WeirdEvent[] = [
  {
    id: 'void_whisper',
    name: 'Void Whisper',
    message: 'The void whispers secrets...',
    effect: { destinyThreads: 1 },
  },
  {
    id: 'ghost_cat',
    name: 'Ghost Cat Visit',
    message: 'A translucent cat phases through the wall, nods, and vanishes.',
    effect: { pp: 1000 },
  },
  {
    id: 'time_loop',
    name: 'Minor Time Loop',
    message: "Wait, didn't this just happen? You gain deja vu... and BP.",
    effect: { bp: 5000 },
  },
  {
    id: 'backwards_text',
    name: 'sdrawkcaB',
    message: '.eno doog a saw taht ,haey hO .sdrawkcab nur ot deirt emaG',
    effect: { bp: 3333 },
  },
  {
    id: 'eldritch_honk',
    name: 'Eldritch Honk',
    message: 'You hear a honk from dimensions unknown...',
    effect: { gooseFeathers: 5 },
  },
  {
    id: 'ceiling_blessing',
    name: 'Ceiling Cat Blessing',
    message: 'Ceiling Cat watches. Ceiling Cat approves.',
    effect: { allMultiplier: 2, duration: 60000 },
  },
  {
    id: 'screen_flicker',
    name: 'Screen Flicker',
    message: 'Your screen flickers. For a moment, you see... cats. So many cats.',
    effect: { catRecruitDiscount: 0.5, duration: 300000 },
  },
  {
    id: 'fourth_wall',
    name: 'Fourth Wall Crack',
    message: 'A cat looks directly at you. Not your avatar. YOU.',
    effect: { critMultiplier: 0.5, duration: 30000 },
  },
];

// ─── IRLIntegrationSystem Class ─────────────────────────────

export class IRLIntegrationSystem {
  currentTimeBonus: TimeBonus | null = null;
  currentWeather: WeatherType | null = null;
  activeEffects: ActiveEffect[] = [];
  lastWeatherChange = 0;
  private weatherDuration = 3600000; // 1 hour
  private weirdEventsTriggered: WeirdEventRecord[] = [];

  stats: IRLStats = {
    cursedHoursPlayed: 0,
    weirdEventsExperienced: 0,
    earlyBirdSessions: 0,
    nightOwlSessions: 0,
  };

  /** Pending resource grants from weird events, consumed by engine */
  pendingGrants: WeirdEventEffect[] = [];

  // ── Core Update ─────────────────────────────────────────────

  /**
   * Main update tick.  Call every frame / game-loop tick.
   * @param deltaMs  milliseconds since last tick
   */
  update(deltaMs: number): void {
    this.updateTimeBonus();
    this.updateWeather();
    this.updateActiveEffects();
    this.checkWeirdEvents(deltaMs);
  }

  // ── Time Bonus ──────────────────────────────────────────────

  getCurrentTimeBonus(): TimeBonus | null {
    const hour = new Date().getHours();
    for (const bonus of Object.values(TIME_BONUSES)) {
      if (bonus.hours.includes(hour)) {
        return bonus;
      }
    }
    return null;
  }

  private updateTimeBonus(): void {
    const newBonus = this.getCurrentTimeBonus();
    if (newBonus && (!this.currentTimeBonus || this.currentTimeBonus.id !== newBonus.id)) {
      this.currentTimeBonus = newBonus;
      this.onTimeBonusChange(newBonus);
    } else if (!newBonus) {
      this.currentTimeBonus = null;
    }
  }

  private onTimeBonusChange(bonus: TimeBonus): void {
    if (bonus.id === 'cursed_hours') this.stats.cursedHoursPlayed++;
    else if (bonus.id === 'early_bird') this.stats.earlyBirdSessions++;
    else if (bonus.id === 'night_owl') this.stats.nightOwlSessions++;
  }

  // ── Weather ─────────────────────────────────────────────────

  /**
   * Generate weather deterministically from date+hour seed, adjusted by season.
   */
  generateWeather(): WeatherType {
    const date = new Date();
    const month = date.getMonth();
    const seed = (date.getDate() + date.getHours()) * 7919;

    // Season-adjusted weights
    const weights: Record<string, number> = {
      sunny: 30,
      rainy: 20,
      cloudy: 30,
      snowy: 5,
      stormy: 10,
      extreme_heat: 5,
    };

    // Winter (Dec, Jan, Feb)
    if (month >= 11 || month <= 1) {
      weights.snowy = 30;
      weights.sunny = 10;
      weights.extreme_heat = 0;
    }
    // Summer (Jun, Jul, Aug)
    else if (month >= 5 && month <= 7) {
      weights.extreme_heat = 20;
      weights.snowy = 0;
      weights.sunny = 40;
    }
    // Spring (Mar, Apr, May)
    else if (month >= 2 && month <= 4) {
      weights.rainy = 35;
      weights.stormy = 15;
    }
    // Fall (Sep, Oct, Nov)
    else {
      weights.cloudy = 40;
      weights.rainy = 25;
    }

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = seed % totalWeight;

    for (const [weatherId, weight] of Object.entries(weights)) {
      roll -= weight;
      if (roll <= 0) {
        return WEATHER_TYPES[weatherId];
      }
    }

    return WEATHER_TYPES.cloudy;
  }

  private updateWeather(): void {
    const now = Date.now();
    if (!this.currentWeather || now - this.lastWeatherChange > this.weatherDuration) {
      this.currentWeather = this.generateWeather();
      this.lastWeatherChange = now;
    }
  }

  // ── Weird Events (cursed hours only) ────────────────────────

  private checkWeirdEvents(deltaMs: number): void {
    if (!this.currentTimeBonus || this.currentTimeBonus.id !== 'cursed_hours') return;

    const weirdChance = (this.currentTimeBonus.effects.weirdEventChance ?? 0);
    // Scale chance by elapsed time in minutes
    const chance = weirdChance * (deltaMs / 60000);

    if (Math.random() < chance) {
      this.triggerWeirdEvent();
    }
  }

  private triggerWeirdEvent(): WeirdEvent {
    const event = WEIRD_EVENTS[Math.floor(Math.random() * WEIRD_EVENTS.length)];

    this.stats.weirdEventsExperienced++;
    this.weirdEventsTriggered.push({ event, timestamp: Date.now() });

    // Queue instant resource grants for the engine to consume
    const grant: WeirdEventEffect = {};
    if (event.effect.bp) grant.bp = event.effect.bp;
    if (event.effect.pp) grant.pp = event.effect.pp;
    if (event.effect.destinyThreads) grant.destinyThreads = event.effect.destinyThreads;
    if (event.effect.gooseFeathers) grant.gooseFeathers = event.effect.gooseFeathers;
    if (Object.keys(grant).length > 0) {
      this.pendingGrants.push(grant);
    }

    // Temporary timed effects
    if (event.effect.duration) {
      const active: ActiveEffect = {
        name: event.name,
        endsAt: Date.now() + event.effect.duration,
      };
      if (event.effect.allMultiplier) active.allMultiplier = event.effect.allMultiplier;
      if (event.effect.catRecruitDiscount) active.catRecruitDiscount = event.effect.catRecruitDiscount;
      if (event.effect.critMultiplier) active.critMultiplier = event.effect.critMultiplier;
      this.activeEffects.push(active);
    }

    return event;
  }

  private updateActiveEffects(): void {
    const now = Date.now();
    this.activeEffects = this.activeEffects.filter(e => e.endsAt > now);
  }

  // ── Combined Effects ────────────────────────────────────────

  /**
   * Aggregate all IRL modifiers (time + weather + active weird effects).
   */
  getCombinedEffects(): IRLCombinedEffects {
    const effects: IRLCombinedEffects = {
      bpMultiplier: 1,
      ppMultiplier: 1,
      expMultiplier: 1,
      lootMultiplier: 1,
      critChance: 0,
      critMultiplier: 0,
      afkMultiplier: 1,
      catHappiness: 1,
      eventBonus: 1,
      activeMultiplier: 1,
    };

    // Time bonus
    if (this.currentTimeBonus) {
      const te = this.currentTimeBonus.effects;
      if (te.bpMultiplier) effects.bpMultiplier *= te.bpMultiplier;
      if (te.ppMultiplier) effects.ppMultiplier *= te.ppMultiplier;
      if (te.expMultiplier) effects.expMultiplier *= te.expMultiplier;
      if (te.lootMultiplier) effects.lootMultiplier *= te.lootMultiplier;
      if (te.afkMultiplier) effects.afkMultiplier *= te.afkMultiplier;
    }

    // Weather
    if (this.currentWeather) {
      const we = this.currentWeather.effects;
      if (we.ppMultiplier) effects.ppMultiplier *= we.ppMultiplier;
      if (we.critChance) effects.critChance += we.critChance;
      if (we.catHappiness) effects.catHappiness *= we.catHappiness;
      if (we.eventBonus) effects.eventBonus *= we.eventBonus;
      if (we.afkMultiplier) effects.afkMultiplier *= we.afkMultiplier;
      if (we.activeMultiplier) effects.activeMultiplier *= we.activeMultiplier;
    }

    // Active weird effects
    for (const active of this.activeEffects) {
      if (active.allMultiplier) {
        effects.bpMultiplier *= active.allMultiplier;
        effects.ppMultiplier *= active.allMultiplier;
      }
      if (active.critMultiplier) {
        effects.critMultiplier += active.critMultiplier;
      }
    }

    return effects;
  }

  // ── Serialization ───────────────────────────────────────────

  serialize(): IRLSerializedData {
    return {
      stats: { ...this.stats },
      weirdEventsTriggered: this.weirdEventsTriggered.slice(-50),
      lastWeatherChange: this.lastWeatherChange,
      currentWeatherId: this.currentWeather?.id ?? null,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    const d = data as Partial<IRLSerializedData>;

    if (d.stats) {
      this.stats = { ...this.stats, ...d.stats };
    }
    if (d.weirdEventsTriggered) {
      this.weirdEventsTriggered = d.weirdEventsTriggered;
    }
    if (typeof d.lastWeatherChange === 'number') {
      this.lastWeatherChange = d.lastWeatherChange;
    }
    if (d.currentWeatherId && WEATHER_TYPES[d.currentWeatherId]) {
      this.currentWeather = WEATHER_TYPES[d.currentWeatherId];
    }
  }
}
