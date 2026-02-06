/**
 * time.js - Day/Night Cycle & Seasonal System
 * "The Jianghu changes with the sun and moon."
 */

// ============================================
// SEASONAL EVENTS - Major themed events
// ============================================
const SEASONAL_EVENTS = {
  lunar_new_year: {
    id: 'lunar_new_year',
    name: 'Lunar New Year Festival',
    emoji: '🧧',
    description: 'The Celestial Snoot Sect celebrates the new year with fireworks and fortune!',
    duration: 14, // days
    checkDate: (date) => {
      // Simplified: Late January to early February
      const month = date.getMonth();
      const day = date.getDate();
      return (month === 0 && day >= 20) || (month === 1 && day <= 10);
    },
    bonuses: {
      allProduction: 2.0,
      luckySpins: true,
      jadeCatnipDropRate: 1.5
    },
    exclusiveCat: 'fortune_dragon_cat',
    cosmetics: ['red_envelope_hat', 'firework_aura', 'golden_tassel'],
    specialShop: true,
    dialogue: {
      greeting: "Gong Xi Fa Cai! May fortune smile upon your snoots!",
      farewell: "The Year of the Cat blesses us all~"
    }
  },

  mid_autumn: {
    id: 'mid_autumn',
    name: 'Mid-Autumn Moon Festival',
    emoji: '🥮',
    description: 'Gaze upon the full moon and share mooncakes with your waifus.',
    duration: 7, // days
    checkDate: (date) => {
      // Simplified: Mid-September
      const month = date.getMonth();
      const day = date.getDate();
      return month === 8 && day >= 10 && day <= 20;
    },
    bonuses: {
      waifuBonds: 1.5,
      nightBonus: 2.0,
      lunaSpecial: true
    },
    exclusiveCat: 'moon_rabbit_cat',
    cosmetics: ['mooncake_hat', 'lantern_trail', 'jade_rabbit_companion'],
    specialShop: true,
    dialogue: {
      greeting: "The moon is full and bright! Luna is especially happy tonight~",
      farewell: "May the moon light your path until next year..."
    }
  },

  spring_festival: {
    id: 'spring_festival',
    name: 'Spring Blossom Festival',
    emoji: '🌸',
    description: 'Cherry blossoms fall as love blooms throughout the sect.',
    duration: 10, // days
    checkDate: (date) => {
      // Late March to early April
      const month = date.getMonth();
      const day = date.getDate();
      return (month === 2 && day >= 20) || (month === 3 && day <= 10);
    },
    bonuses: {
      waifuBonds: 2.0,
      happinessDecay: 0.5,
      catRecruitCost: 0.75
    },
    exclusiveCat: 'sakura_spirit_cat',
    cosmetics: ['cherry_blossom_crown', 'petal_trail'],
    specialShop: true,
    dialogue: {
      greeting: "The blossoms are in full bloom! What a romantic season~",
      farewell: "The petals may fall, but our bonds remain eternal..."
    }
  },

  summer_solstice: {
    id: 'summer_solstice',
    name: 'Summer Solstice Celebration',
    emoji: '☀️',
    description: 'The longest day brings endless energy and adventure!',
    duration: 5, // days
    checkDate: (date) => {
      // Around June 21
      const month = date.getMonth();
      const day = date.getDate();
      return month === 5 && day >= 19 && day <= 23;
    },
    bonuses: {
      bpGeneration: 1.5,
      expeditionSpeed: 2.0,
      dayBonus: 2.0
    },
    exclusiveCat: 'solar_cat',
    cosmetics: ['sun_hat', 'heat_shimmer_aura'],
    specialShop: true,
    dialogue: {
      greeting: "The sun never sets on our cultivation today!",
      farewell: "As the days shorten, we carry this energy within us..."
    }
  },

  winter_solstice: {
    id: 'winter_solstice',
    name: 'Winter Solstice Gathering',
    emoji: '❄️',
    description: 'The longest night is perfect for meditation and gift-giving.',
    duration: 5, // days
    checkDate: (date) => {
      // Around December 21
      const month = date.getMonth();
      const day = date.getDate();
      return month === 11 && day >= 19 && day <= 23;
    },
    bonuses: {
      giftQuality: 2.0,
      meditationEfficiency: 2.0,
      afkGains: 1.5
    },
    exclusiveCat: 'frost_cat',
    cosmetics: ['snowflake_crown', 'frost_trail'],
    specialShop: true,
    dialogue: {
      greeting: "The longest night... perfect for cuddling by the fire~",
      farewell: "As light returns, so does our strength..."
    }
  },

  halloween: {
    id: 'halloween',
    name: 'Spooky Goose Night',
    emoji: '🎃',
    description: 'The geese are especially chaotic tonight... HONK!',
    duration: 7, // days
    checkDate: (date) => {
      // Late October
      const month = date.getMonth();
      const day = date.getDate();
      return month === 9 && day >= 25 && day <= 31;
    },
    bonuses: {
      gooseSpawnRate: 3.0,
      gooseRewards: 2.0,
      spookyEvents: true
    },
    exclusiveCat: 'phantom_cat',
    cosmetics: ['pumpkin_hat', 'ghost_trail', 'bat_wings'],
    specialShop: true,
    dialogue: {
      greeting: "HONK... I mean... Boo! Happy Spooky Season!",
      farewell: "The spirits rest until next year... but the geese remain eternal."
    }
  },

  birthday: {
    id: 'birthday',
    name: 'Your Special Day',
    emoji: '🎂',
    description: 'The entire sect celebrates YOU!',
    duration: 1, // day
    checkDate: (date, gameState) => {
      if (!gameState?.userBirthday) return false;
      const [bMonth, bDay] = gameState.userBirthday.split('-').map(Number);
      return date.getMonth() === bMonth - 1 && date.getDate() === bDay;
    },
    bonuses: {
      allProduction: 3.0,
      freeSpins: 10,
      critChance: 0.25
    },
    exclusiveCat: null, // Random legendary
    cosmetics: ['birthday_crown', 'confetti_trail'],
    specialShop: false,
    waifuMessages: true,
    dialogue: {
      greeting: "HAPPY BIRTHDAY! 🎉 The entire sect celebrates you today!",
      farewell: "What a wonderful day! See you next year~"
    }
  },

  anniversary: {
    id: 'anniversary',
    name: 'Sect Anniversary',
    emoji: '🎊',
    description: 'Celebrate the founding of the Celestial Snoot Sect!',
    duration: 3, // days
    checkDate: (date, gameState) => {
      if (!gameState?.sectFoundedDate) return false;
      const founded = new Date(gameState.sectFoundedDate);
      return date.getMonth() === founded.getMonth() &&
             date.getDate() === founded.getDate() &&
             date.getFullYear() > founded.getFullYear();
    },
    bonuses: {
      allProduction: 2.0,
      prestigeBonus: 1.5,
      veteranRewards: true
    },
    exclusiveCat: 'anniversary_cat',
    cosmetics: ['founder_badge'],
    specialShop: true,
    dialogue: {
      greeting: "Happy Anniversary! Thank you for your dedication to the sect!",
      farewell: "Here's to another year of booping snoots!"
    }
  }
};

// ============================================
// TIME OF DAY EFFECTS
// ============================================
const TIME_OF_DAY_EFFECTS = {
  morning: {
    id: 'morning',
    name: 'Morning',
    hours: { start: 6, end: 12 },
    emoji: '🌅',
    description: 'The sect awakens. Fresh energy fills the air.',
    effects: {
      ppGeneration: 1.1,
      happiness: 1.05
    },
    ambiance: 'morning_birds',
    bgTint: '#FFE4B5'
  },
  afternoon: {
    id: 'afternoon',
    name: 'Afternoon',
    hours: { start: 12, end: 18 },
    emoji: '☀️',
    description: 'Peak cultivation hours. The sun provides strength.',
    effects: {
      bpGeneration: 1.1,
      expeditionSpeed: 1.1
    },
    ambiance: 'wind_chimes',
    bgTint: '#FFFACD'
  },
  evening: {
    id: 'evening',
    name: 'Evening',
    hours: { start: 18, end: 22 },
    emoji: '🌆',
    description: 'The sect winds down. Perfect for bonding.',
    effects: {
      waifuBonds: 1.15,
      happinessDecay: 0.9
    },
    ambiance: 'crickets',
    bgTint: '#DDA0DD'
  },
  night: {
    id: 'night',
    name: 'Night',
    hours: { start: 22, end: 6 },
    emoji: '🌙',
    description: 'The moon rises. Nocturnal cats thrive.',
    effects: {
      lunaBonus: 1.5,
      nocturnalCats: 1.25,
      afkEfficiency: 1.1,
      mysteryChance: 1.25
    },
    ambiance: 'night_ambient',
    bgTint: '#191970'
  }
};

// ============================================
// SEASONAL BONUSES
// ============================================
const SEASONAL_BONUSES = {
  spring: {
    id: 'spring',
    name: 'Spring',
    months: [2, 3, 4], // March, April, May
    emoji: '🌸',
    description: 'Season of growth and new bonds.',
    bonuses: {
      waifuBondGain: 1.25,
      catRecruitChance: 1.1
    },
    dialogue: "Spring brings new life and deeper connections~"
  },
  summer: {
    id: 'summer',
    name: 'Summer',
    months: [5, 6, 7], // June, July, August
    emoji: '☀️',
    description: 'Season of action and events.',
    bonuses: {
      eventFrequency: 1.2,
      expeditionSpeed: 1.15
    },
    dialogue: "The heat of summer fuels our adventures!"
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn',
    months: [8, 9, 10], // September, October, November
    emoji: '🍂',
    description: 'Season of harvest and rest.',
    bonuses: {
      afkGains: 1.25,
      lootQuality: 1.15
    },
    dialogue: "Autumn's bounty rewards the patient cultivator..."
  },
  winter: {
    id: 'winter',
    name: 'Winter',
    months: [11, 0, 1], // December, January, February
    emoji: '❄️',
    description: 'Season of gifts and reflection.',
    bonuses: {
      giftQuality: 1.5,
      meditationEfficiency: 1.2
    },
    dialogue: "Winter's chill brings warmth to our hearts~"
  }
};

/**
 * TimeSystem - Manages day/night cycle and seasonal effects
 */
class TimeSystem {
  constructor() {
    this.currentTimeOfDay = null;
    this.currentSeason = null;
    this.activeSeasonalEvent = null;
    this.lastTimeCheck = Date.now();
    this.sunriseTime = 6;
    this.sunsetTime = 22;

    // Track special dates
    this.specialDates = {};

    // Statistics
    this.stats = {
      dawnsSeen: 0,
      nightsSpent: 0,
      festivalsParticipated: [],
      totalNightBoops: 0
    };

    // Initialize
    this.updateTimeState();
  }

  /**
   * Update time state (call periodically)
   */
  update(deltaTime) {
    const now = Date.now();

    // Check every minute for time changes
    if (now - this.lastTimeCheck >= 60000) {
      this.lastTimeCheck = now;
      this.updateTimeState();
    }
  }

  /**
   * Update all time-based states
   */
  updateTimeState() {
    const previousTimeOfDay = this.currentTimeOfDay;

    this.currentTimeOfDay = this.getCurrentTimeOfDay();
    this.currentSeason = this.getCurrentSeason();

    // Check for dawn/dusk transitions
    if (previousTimeOfDay !== this.currentTimeOfDay) {
      this.onTimeOfDayChange(previousTimeOfDay, this.currentTimeOfDay);
    }

    // Check for seasonal events
    this.checkSeasonalEvents();
  }

  /**
   * Get current time of day
   */
  getCurrentTimeOfDay() {
    const hour = new Date().getHours();

    for (const [id, period] of Object.entries(TIME_OF_DAY_EFFECTS)) {
      const { start, end } = period.hours;

      // Handle overnight period (night: 22-6)
      if (start > end) {
        if (hour >= start || hour < end) return id;
      } else {
        if (hour >= start && hour < end) return id;
      }
    }

    return 'afternoon'; // Default fallback
  }

  /**
   * Check if it's currently night time
   */
  isNightTime() {
    const hour = new Date().getHours();
    return hour >= 22 || hour < 6;
  }

  /**
   * Check if it's currently day time
   */
  isDayTime() {
    return !this.isNightTime();
  }

  /**
   * Get current season
   */
  getCurrentSeason() {
    const month = new Date().getMonth();

    for (const [id, season] of Object.entries(SEASONAL_BONUSES)) {
      if (season.months.includes(month)) {
        return id;
      }
    }

    return 'spring'; // Default fallback
  }

  /**
   * Get combined time modifiers (day/night + season + events)
   */
  getTimeModifiers() {
    const modifiers = {
      bpMultiplier: 1,
      ppMultiplier: 1,
      waifuBondMultiplier: 1,
      afkMultiplier: 1,
      eventChanceMultiplier: 1,
      giftQualityMultiplier: 1,
      expeditionSpeedMultiplier: 1,
      happinessDecayMultiplier: 1,
      lunaBonus: 1,
      nocturnalCatBonus: 1,
      gooseSpawnMultiplier: 1,
      gooseRewardMultiplier: 1,
      critChanceBonus: 0
    };

    // Apply time of day effects
    const timeEffects = TIME_OF_DAY_EFFECTS[this.currentTimeOfDay];
    if (timeEffects?.effects) {
      if (timeEffects.effects.ppGeneration) {
        modifiers.ppMultiplier *= timeEffects.effects.ppGeneration;
      }
      if (timeEffects.effects.bpGeneration) {
        modifiers.bpMultiplier *= timeEffects.effects.bpGeneration;
      }
      if (timeEffects.effects.waifuBonds) {
        modifiers.waifuBondMultiplier *= timeEffects.effects.waifuBonds;
      }
      if (timeEffects.effects.lunaBonus) {
        modifiers.lunaBonus = timeEffects.effects.lunaBonus;
      }
      if (timeEffects.effects.nocturnalCats) {
        modifiers.nocturnalCatBonus = timeEffects.effects.nocturnalCats;
      }
      if (timeEffects.effects.afkEfficiency) {
        modifiers.afkMultiplier *= timeEffects.effects.afkEfficiency;
      }
      if (timeEffects.effects.happinessDecay) {
        modifiers.happinessDecayMultiplier *= timeEffects.effects.happinessDecay;
      }
      if (timeEffects.effects.expeditionSpeed) {
        modifiers.expeditionSpeedMultiplier *= timeEffects.effects.expeditionSpeed;
      }
    }

    // Apply seasonal bonuses
    const seasonBonuses = SEASONAL_BONUSES[this.currentSeason];
    if (seasonBonuses?.bonuses) {
      if (seasonBonuses.bonuses.waifuBondGain) {
        modifiers.waifuBondMultiplier *= seasonBonuses.bonuses.waifuBondGain;
      }
      if (seasonBonuses.bonuses.eventFrequency) {
        modifiers.eventChanceMultiplier *= seasonBonuses.bonuses.eventFrequency;
      }
      if (seasonBonuses.bonuses.afkGains) {
        modifiers.afkMultiplier *= seasonBonuses.bonuses.afkGains;
      }
      if (seasonBonuses.bonuses.giftQuality) {
        modifiers.giftQualityMultiplier *= seasonBonuses.bonuses.giftQuality;
      }
      if (seasonBonuses.bonuses.expeditionSpeed) {
        modifiers.expeditionSpeedMultiplier *= seasonBonuses.bonuses.expeditionSpeed;
      }
    }

    // Apply seasonal event bonuses (strongest effects)
    if (this.activeSeasonalEvent) {
      const event = SEASONAL_EVENTS[this.activeSeasonalEvent];
      if (event?.bonuses) {
        if (event.bonuses.allProduction) {
          modifiers.bpMultiplier *= event.bonuses.allProduction;
          modifiers.ppMultiplier *= event.bonuses.allProduction;
        }
        if (event.bonuses.waifuBonds) {
          modifiers.waifuBondMultiplier *= event.bonuses.waifuBonds;
        }
        if (event.bonuses.nightBonus && this.isNightTime()) {
          modifiers.ppMultiplier *= event.bonuses.nightBonus;
        }
        if (event.bonuses.dayBonus && this.isDayTime()) {
          modifiers.bpMultiplier *= event.bonuses.dayBonus;
        }
        if (event.bonuses.giftQuality) {
          modifiers.giftQualityMultiplier *= event.bonuses.giftQuality;
        }
        if (event.bonuses.afkGains) {
          modifiers.afkMultiplier *= event.bonuses.afkGains;
        }
        if (event.bonuses.gooseSpawnRate) {
          modifiers.gooseSpawnMultiplier *= event.bonuses.gooseSpawnRate;
        }
        if (event.bonuses.gooseRewards) {
          modifiers.gooseRewardMultiplier *= event.bonuses.gooseRewards;
        }
        if (event.bonuses.expeditionSpeed) {
          modifiers.expeditionSpeedMultiplier *= event.bonuses.expeditionSpeed;
        }
        if (event.bonuses.critChance) {
          modifiers.critChanceBonus += event.bonuses.critChance;
        }
      }
    }

    return modifiers;
  }

  /**
   * Check for active seasonal events
   */
  checkSeasonalEvents() {
    const now = new Date();
    const gameState = window.gameState;

    let foundEvent = null;

    for (const [eventId, event] of Object.entries(SEASONAL_EVENTS)) {
      if (event.checkDate(now, gameState)) {
        foundEvent = eventId;
        break;
      }
    }

    // Handle event changes
    if (foundEvent !== this.activeSeasonalEvent) {
      if (this.activeSeasonalEvent) {
        this.onSeasonalEventEnd(this.activeSeasonalEvent);
      }

      this.activeSeasonalEvent = foundEvent;

      if (foundEvent) {
        this.onSeasonalEventStart(foundEvent);
      }
    }
  }

  /**
   * Handle time of day change
   */
  onTimeOfDayChange(from, to) {
    // Track statistics
    if (to === 'morning' && from === 'night') {
      this.stats.dawnsSeen++;
    }
    if (to === 'night') {
      this.stats.nightsSpent++;
    }

    // Notify player
    const timeInfo = TIME_OF_DAY_EFFECTS[to];
    if (timeInfo && window.showNotification) {
      window.showNotification({
        type: 'time',
        title: `${timeInfo.emoji} ${timeInfo.name}`,
        message: timeInfo.description,
        duration: 3000
      });
    }

    // Luna special dialogue at night
    if (to === 'night' && window.waifuSystem) {
      const luna = window.waifuSystem.getWaifuById('luna');
      if (luna && luna.unlocked) {
        setTimeout(() => {
          window.waifuSystem.showSpecialDialogue('luna',
            "The moon rises... I feel stronger now~ Let us cultivate together...");
        }, 2000);
      }
    }
  }

  /**
   * Handle seasonal event start
   */
  onSeasonalEventStart(eventId) {
    const event = SEASONAL_EVENTS[eventId];
    if (!event) return;

    // Track participation
    if (!this.stats.festivalsParticipated.includes(eventId)) {
      this.stats.festivalsParticipated.push(eventId);
    }

    // Show announcement
    if (window.showModal) {
      window.showModal({
        title: `${event.emoji} ${event.name}!`,
        message: event.description,
        subtext: event.dialogue.greeting,
        type: 'festival'
      });
    }

    // Play festival music if available
    if (window.audioSystem && event.id !== 'birthday') {
      window.audioSystem.playMusic('festival');
    }

    console.log(`[TimeSystem] Seasonal event started: ${event.name}`);
  }

  /**
   * Handle seasonal event end
   */
  onSeasonalEventEnd(eventId) {
    const event = SEASONAL_EVENTS[eventId];
    if (!event) return;

    // Show farewell
    if (window.showNotification) {
      window.showNotification({
        type: 'festival_end',
        title: `${event.emoji} ${event.name} Ends`,
        message: event.dialogue.farewell,
        duration: 5000
      });
    }

    console.log(`[TimeSystem] Seasonal event ended: ${event.name}`);
  }

  /**
   * Check for special date (birthday, anniversary, etc.)
   */
  checkSpecialDates() {
    const now = new Date();
    const gameState = window.gameState;
    const results = [];

    // Check birthday
    if (gameState?.userBirthday) {
      const [bMonth, bDay] = gameState.userBirthday.split('-').map(Number);
      if (now.getMonth() === bMonth - 1 && now.getDate() === bDay) {
        results.push({
          event: 'birthday',
          bonus: 3.0,
          message: 'Happy Birthday! All production tripled today!'
        });
      }
    }

    // Check sect anniversary
    if (gameState?.sectFoundedDate) {
      const founded = new Date(gameState.sectFoundedDate);
      if (now.getMonth() === founded.getMonth() &&
          now.getDate() === founded.getDate() &&
          now.getFullYear() > founded.getFullYear()) {
        const years = now.getFullYear() - founded.getFullYear();
        results.push({
          event: 'anniversary',
          bonus: 1.5 + (years * 0.1), // +10% per year
          years: years,
          message: `Happy ${years} Year Anniversary! The sect celebrates!`
        });
      }
    }

    return results.length > 0 ? results : null;
  }

  /**
   * Set user birthday
   */
  setUserBirthday(month, day) {
    if (window.gameState) {
      window.gameState.userBirthday = `${month}-${day}`;
    }
  }

  /**
   * Get current time info for display
   */
  getCurrentTimeInfo() {
    const timeOfDay = TIME_OF_DAY_EFFECTS[this.currentTimeOfDay];
    const season = SEASONAL_BONUSES[this.currentSeason];
    const event = this.activeSeasonalEvent ? SEASONAL_EVENTS[this.activeSeasonalEvent] : null;

    return {
      timeOfDay: {
        id: this.currentTimeOfDay,
        name: timeOfDay?.name || 'Unknown',
        emoji: timeOfDay?.emoji || '⏰',
        description: timeOfDay?.description || ''
      },
      season: {
        id: this.currentSeason,
        name: season?.name || 'Unknown',
        emoji: season?.emoji || '🌍',
        description: season?.description || ''
      },
      activeEvent: event ? {
        id: this.activeSeasonalEvent,
        name: event.name,
        emoji: event.emoji,
        description: event.description,
        bonuses: event.bonuses
      } : null,
      isNight: this.isNightTime(),
      realTime: new Date().toLocaleTimeString()
    };
  }

  /**
   * Get time until next period
   */
  getTimeUntilNextPeriod() {
    const now = new Date();
    const currentHour = now.getHours();

    // Find next transition
    let nextHour;
    if (currentHour < 6) nextHour = 6;
    else if (currentHour < 12) nextHour = 12;
    else if (currentHour < 18) nextHour = 18;
    else if (currentHour < 22) nextHour = 22;
    else nextHour = 6; // Tomorrow morning

    const nextTime = new Date(now);
    if (nextHour <= currentHour) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
    nextTime.setHours(nextHour, 0, 0, 0);

    return nextTime.getTime() - now.getTime();
  }

  /**
   * Format time remaining
   */
  formatTimeRemaining(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      stats: this.stats,
      activeSeasonalEvent: this.activeSeasonalEvent
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data?.stats) {
      this.stats = { ...this.stats, ...data.stats };
    }
    if (data?.activeSeasonalEvent) {
      this.activeSeasonalEvent = data.activeSeasonalEvent;
    }

    // Update current state
    this.updateTimeState();
  }

  /**
   * Reset system
   */
  reset() {
    this.stats = {
      dawnsSeen: 0,
      nightsSpent: 0,
      festivalsParticipated: [],
      totalNightBoops: 0
    };
    this.activeSeasonalEvent = null;
    this.updateTimeState();
  }
}

// Export
window.SEASONAL_EVENTS = SEASONAL_EVENTS;
window.TIME_OF_DAY_EFFECTS = TIME_OF_DAY_EFFECTS;
window.SEASONAL_BONUSES = SEASONAL_BONUSES;
window.TimeSystem = TimeSystem;
