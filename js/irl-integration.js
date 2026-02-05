/**
 * irl-integration.js - Real World Integration System
 * "Touch grass, gain snoots"
 */

// Time of Day Bonuses
const TIME_BONUSES = {
  early_bird: {
    id: 'early_bird',
    name: 'Early Bird',
    emoji: '🌅',
    hours: [6, 7, 8],
    effects: { expMultiplier: 1.2 },
    description: '+20% EXP gain'
  },
  morning: {
    id: 'morning',
    name: 'Morning Routine',
    emoji: '☀️',
    hours: [9, 10, 11],
    effects: { bpMultiplier: 1.1 },
    description: '+10% BP gain'
  },
  afternoon: {
    id: 'afternoon',
    name: 'Afternoon Grind',
    emoji: '🌤️',
    hours: [12, 13, 14, 15, 16],
    effects: {},
    description: 'Normal rates'
  },
  after_work: {
    id: 'after_work',
    name: 'After Work',
    emoji: '🌆',
    hours: [17, 18, 19, 20],
    effects: { lootMultiplier: 1.1 },
    description: '+10% loot quality'
  },
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    emoji: '🌙',
    hours: [21, 22, 23],
    effects: { ppMultiplier: 1.15 },
    description: '+15% PP gain'
  },
  cursed_hours: {
    id: 'cursed_hours',
    name: 'Cursed Hours',
    emoji: '👁️',
    hours: [0, 1, 2],
    effects: {
      bpMultiplier: 1.5,
      ppMultiplier: 1.5,
      weirdEventChance: 0.1
    },
    description: '+50% everything, strange things may happen...'
  },
  why_awake: {
    id: 'why_awake',
    name: 'Why Are You Awake?',
    emoji: '😴',
    hours: [3, 4, 5],
    effects: { afkMultiplier: 2.0 },
    description: '+100% AFK gains, concerned waifus'
  }
};

// Weather Effects (simulated based on random + date)
const WEATHER_TYPES = {
  sunny: {
    id: 'sunny',
    name: 'Sunny',
    emoji: '☀️',
    effects: { catHappiness: 1.1 },
    description: '+10% cat happiness'
  },
  rainy: {
    id: 'rainy',
    name: 'Rainy',
    emoji: '🌧️',
    effects: { ppMultiplier: 1.25 },
    description: '+25% PP (cats love naps)'
  },
  cloudy: {
    id: 'cloudy',
    name: 'Cloudy',
    emoji: '☁️',
    effects: {},
    description: 'Neutral conditions'
  },
  snowy: {
    id: 'snowy',
    name: 'Snowy',
    emoji: '❄️',
    effects: { eventBonus: 1.5 },
    description: '+50% event rewards'
  },
  stormy: {
    id: 'stormy',
    name: 'Stormy',
    emoji: '⛈️',
    effects: { critChance: 0.1 },
    description: '+10% crit chance (lightning boosts)'
  },
  extreme_heat: {
    id: 'extreme_heat',
    name: 'Extreme Heat',
    emoji: '🔥',
    effects: { activeMultiplier: 0.9, afkMultiplier: 1.5 },
    description: '-10% active gains, +50% AFK (lazy cats)'
  }
};

// Weird Events for Cursed Hours
const WEIRD_EVENTS = [
  {
    id: 'void_whisper',
    name: 'Void Whisper',
    message: 'The void whispers secrets...',
    effect: { destinyThreads: 1 }
  },
  {
    id: 'ghost_cat',
    name: 'Ghost Cat Visit',
    message: 'A translucent cat phases through the wall, nods, and vanishes.',
    effect: { pp: 1000 }
  },
  {
    id: 'time_loop',
    name: 'Minor Time Loop',
    message: 'Wait, didn\'t this just happen? You gain deja vu... and BP.',
    effect: { bp: 5000 }
  },
  {
    id: 'eldritch_honk',
    name: 'Eldritch Honk',
    message: 'You hear a honk from dimensions unknown...',
    effect: { gooseFeathers: 5 }
  },
  {
    id: 'ceiling_blessing',
    name: 'Ceiling Cat Blessing',
    message: 'Ceiling Cat watches. Ceiling Cat approves.',
    effect: { allMultiplier: 2, duration: 60000 }
  },
  {
    id: 'screen_flicker',
    name: 'Screen Flicker',
    message: 'Your screen flickers. For a moment, you see... cats. So many cats.',
    effect: { catRecruitDiscount: 0.5, duration: 300000 }
  },
  {
    id: 'backwards_text',
    name: 'sdrawkcaB',
    message: '.eno doog a saw taht ,haey hO .sdrawkcab nur ot deirt emaG',
    effect: { bp: 3333 }
  },
  {
    id: 'fourth_wall',
    name: 'Fourth Wall Crack',
    message: 'A cat looks directly at you. Not your avatar. YOU.',
    effect: { critMultiplier: 0.5, duration: 30000 }
  }
];

/**
 * IRLIntegrationSystem - Connects real world to game
 */
class IRLIntegrationSystem {
  constructor() {
    this.currentTimeBonus = null;
    this.currentWeather = null;
    this.lastWeatherChange = 0;
    this.weatherDuration = 3600000; // 1 hour

    this.activeEffects = [];
    this.weirdEventsTriggered = [];

    this.stats = {
      cursedHoursPlayed: 0,
      weirdEventsExperienced: 0,
      earlyBirdSessions: 0,
      nightOwlSessions: 0
    };

    // Track session for achievements
    this.sessionStartHour = new Date().getHours();
  }

  /**
   * Update IRL systems (call periodically)
   */
  update(deltaTime) {
    this.updateTimeBonus();
    this.updateWeather();
    this.updateActiveEffects(deltaTime);
    this.checkWeirdEvents(deltaTime);
  }

  /**
   * Get current time of day bonus
   */
  updateTimeBonus() {
    const hour = new Date().getHours();
    let newBonus = null;

    for (const bonus of Object.values(TIME_BONUSES)) {
      if (bonus.hours.includes(hour)) {
        newBonus = bonus;
        break;
      }
    }

    if (newBonus && (!this.currentTimeBonus || this.currentTimeBonus.id !== newBonus.id)) {
      this.currentTimeBonus = newBonus;
      this.onTimeBonusChange(newBonus);
    }
  }

  /**
   * Handle time bonus change
   */
  onTimeBonusChange(bonus) {
    // Track stats
    if (bonus.id === 'cursed_hours') {
      this.stats.cursedHoursPlayed++;
    } else if (bonus.id === 'early_bird') {
      this.stats.earlyBirdSessions++;
    } else if (bonus.id === 'night_owl') {
      this.stats.nightOwlSessions++;
    }

    // Show notification
    if (window.showFloatingText) {
      window.showFloatingText(`${bonus.emoji} ${bonus.name} active!`, false);
    }

    // Special "Why Are You Awake?" message
    if (bonus.id === 'why_awake' && window.waifuSystem) {
      const waifu = window.waifuSystem.getActiveWaifu();
      if (waifu) {
        setTimeout(() => {
          this.showConcernedWaifuMessage(waifu);
        }, 5000);
      }
    }
  }

  /**
   * Show concerned waifu message for late night play
   */
  showConcernedWaifuMessage(waifu) {
    const messages = [
      `${waifu.name}: "It's very late... please take care of yourself."`,
      `${waifu.name}: "Shouldn't you be sleeping? I worry about you..."`,
      `${waifu.name}: "The snoots will still be here tomorrow, you know."`,
      `${waifu.name}: "I appreciate your dedication, but rest is important too!"`,
      `${waifu.name}: "Even cultivators need sleep... *yawns*"`
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];

    // Could show as a special dialogue or notification
    console.log(message);
  }

  /**
   * Update weather (simulated)
   */
  updateWeather() {
    const now = Date.now();

    if (!this.currentWeather || now - this.lastWeatherChange > this.weatherDuration) {
      this.currentWeather = this.generateWeather();
      this.lastWeatherChange = now;
    }
  }

  /**
   * Generate weather based on date and randomness
   */
  generateWeather() {
    const date = new Date();
    const month = date.getMonth();
    const seed = date.getDate() + date.getHours();

    // Seasonal weights
    let weights = {
      sunny: 30,
      rainy: 20,
      cloudy: 30,
      snowy: 5,
      stormy: 10,
      extreme_heat: 5
    };

    // Adjust for "seasons" (northern hemisphere style)
    if (month >= 11 || month <= 1) { // Winter
      weights.snowy = 30;
      weights.sunny = 10;
      weights.extreme_heat = 0;
    } else if (month >= 5 && month <= 7) { // Summer
      weights.extreme_heat = 20;
      weights.snowy = 0;
      weights.sunny = 40;
    } else if (month >= 2 && month <= 4) { // Spring
      weights.rainy = 35;
      weights.stormy = 15;
    } else { // Fall
      weights.cloudy = 40;
      weights.rainy = 25;
    }

    // Pick weather
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = (seed * 7919) % total; // Pseudo-random based on date

    for (const [weatherId, weight] of Object.entries(weights)) {
      roll -= weight;
      if (roll <= 0) {
        return WEATHER_TYPES[weatherId];
      }
    }

    return WEATHER_TYPES.cloudy;
  }

  /**
   * Check for weird events during cursed hours
   */
  checkWeirdEvents(deltaTime) {
    if (!this.currentTimeBonus || this.currentTimeBonus.id !== 'cursed_hours') {
      return;
    }

    const chance = (this.currentTimeBonus.effects.weirdEventChance || 0) * (deltaTime / 60000);

    if (Math.random() < chance) {
      this.triggerWeirdEvent();
    }
  }

  /**
   * Trigger a random weird event
   */
  triggerWeirdEvent() {
    const event = WEIRD_EVENTS[Math.floor(Math.random() * WEIRD_EVENTS.length)];

    this.stats.weirdEventsExperienced++;
    this.weirdEventsTriggered.push({
      event: event,
      timestamp: Date.now()
    });

    // Apply effects
    if (event.effect.bp && window.gameState) {
      window.gameState.boopPoints += event.effect.bp;
    }
    if (event.effect.pp && window.gameState) {
      window.gameState.purrPower += event.effect.pp;
    }
    if (event.effect.destinyThreads && window.gameState) {
      window.gameState.destinyThreads += event.effect.destinyThreads;
    }
    if (event.effect.gooseFeathers && window.gameState) {
      window.gameState.gooseFeathers += event.effect.gooseFeathers;
    }

    // Temporary effects
    if (event.effect.duration) {
      this.activeEffects.push({
        ...event.effect,
        name: event.name,
        endsAt: Date.now() + event.effect.duration
      });
    }

    // Show event
    this.showWeirdEvent(event);

    // Screen effects for extra weirdness
    if (event.id === 'screen_flicker') {
      this.triggerScreenFlicker();
    }

    return event;
  }

  /**
   * Show weird event notification
   */
  showWeirdEvent(event) {
    console.log(`[WEIRD EVENT] ${event.name}: ${event.message}`);

    // Could create a special modal or notification
    if (window.showFloatingText) {
      window.showFloatingText(`👁️ ${event.name}`, true);
    }
  }

  /**
   * Trigger screen flicker effect
   */
  triggerScreenFlicker() {
    const container = document.getElementById('game-container');
    if (!container) return;

    let flickers = 5;
    const flicker = () => {
      container.style.opacity = Math.random() > 0.5 ? '0.5' : '1';
      flickers--;
      if (flickers > 0) {
        setTimeout(flicker, 100);
      } else {
        container.style.opacity = '1';
      }
    };
    flicker();
  }

  /**
   * Update active temporary effects
   */
  updateActiveEffects(deltaTime) {
    const now = Date.now();
    this.activeEffects = this.activeEffects.filter(effect => effect.endsAt > now);
  }

  /**
   * Get combined effects from time, weather, and active effects
   */
  getCombinedEffects() {
    const effects = {
      bpMultiplier: 1,
      ppMultiplier: 1,
      expMultiplier: 1,
      lootMultiplier: 1,
      critChance: 0,
      critMultiplier: 0,
      afkMultiplier: 1,
      catHappiness: 1,
      eventBonus: 1,
      activeMultiplier: 1
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

    // Weather bonus
    if (this.currentWeather) {
      const we = this.currentWeather.effects;
      if (we.bpMultiplier) effects.bpMultiplier *= we.bpMultiplier;
      if (we.ppMultiplier) effects.ppMultiplier *= we.ppMultiplier;
      if (we.critChance) effects.critChance += we.critChance;
      if (we.catHappiness) effects.catHappiness *= we.catHappiness;
      if (we.eventBonus) effects.eventBonus *= we.eventBonus;
      if (we.afkMultiplier) effects.afkMultiplier *= we.afkMultiplier;
      if (we.activeMultiplier) effects.activeMultiplier *= we.activeMultiplier;
    }

    // Active weird effects
    for (const effect of this.activeEffects) {
      if (effect.allMultiplier) {
        effects.bpMultiplier *= effect.allMultiplier;
        effects.ppMultiplier *= effect.allMultiplier;
      }
      if (effect.critMultiplier) {
        effects.critMultiplier += effect.critMultiplier;
      }
    }

    return effects;
  }

  /**
   * Get current status for UI
   */
  getStatus() {
    return {
      timeBonus: this.currentTimeBonus,
      weather: this.currentWeather,
      activeEffects: this.activeEffects,
      effects: this.getCombinedEffects()
    };
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      stats: this.stats,
      weirdEventsTriggered: this.weirdEventsTriggered.slice(-50), // Keep last 50
      lastWeatherChange: this.lastWeatherChange,
      currentWeatherId: this.currentWeather?.id
    };
  }

  /**
   * Load from save
   */
  deserialize(data) {
    if (data.stats) {
      this.stats = { ...this.stats, ...data.stats };
    }
    if (data.weirdEventsTriggered) {
      this.weirdEventsTriggered = data.weirdEventsTriggered;
    }
    if (data.lastWeatherChange) {
      this.lastWeatherChange = data.lastWeatherChange;
    }
    if (data.currentWeatherId && WEATHER_TYPES[data.currentWeatherId]) {
      this.currentWeather = WEATHER_TYPES[data.currentWeatherId];
    }
  }
}

// Export
window.TIME_BONUSES = TIME_BONUSES;
window.WEATHER_TYPES = WEATHER_TYPES;
window.WEIRD_EVENTS = WEIRD_EVENTS;
window.IRLIntegrationSystem = IRLIntegrationSystem;
