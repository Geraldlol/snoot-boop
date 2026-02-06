/**
 * events.js - Multi-Layer Event System
 * "In the Jianghu, fortune and chaos walk hand in hand."
 */

// ============================================
// RANDOM JIANGHU EVENTS - Spawn while playing
// ============================================
const EVENT_TEMPLATES = {
  // === POSITIVE EVENTS ===
  merchant_visit: {
    id: 'merchant_visit',
    name: 'Wandering Merchant',
    emoji: '🏪',
    description: 'A merchant from distant lands visits your sect!',
    rarity: 'common',
    weight: 20,
    duration: 30000, // 30 seconds to interact
    rewards: {
      bp: { min: 100, max: 500 },
      items: ['rare_tea', 'silk_ribbon']
    },
    dialogue: [
      "Fine goods from across the Jianghu!",
      "Special prices for the Celestial Snoot Sect!",
      "I have wares if you have coin~"
    ]
  },

  zoomies_outbreak: {
    id: 'zoomies_outbreak',
    name: 'ZOOMIES OUTBREAK!',
    emoji: '💨',
    description: 'All cats enter rapid cultivation mode!',
    rarity: 'uncommon',
    weight: 15,
    duration: 60000, // 1 minute
    effect: {
      type: 'ppMultiplier',
      value: 3,
      duration: 60000
    },
    dialogue: [
      "The cats have gone WILD!",
      "*thundering paws everywhere*",
      "MAXIMUM ZOOMIES ACHIEVED!"
    ]
  },

  mass_meditation: {
    id: 'mass_meditation',
    name: 'Mass Meditation',
    emoji: '🧘',
    description: 'All cats achieve synchronized meditation!',
    rarity: 'uncommon',
    weight: 15,
    duration: 45000,
    effect: {
      type: 'ppMultiplier',
      value: 2,
      duration: 45000
    },
    rewards: {
      pp: { min: 50, max: 200 }
    },
    dialogue: [
      "Perfect harmony achieved...",
      "*synchronized purring intensifies*",
      "The Qi flows as one."
    ]
  },

  mysterious_box: {
    id: 'mysterious_box',
    name: 'Mysterious Box',
    emoji: '📦',
    description: 'A mysterious box has appeared! Something stirs within...',
    rarity: 'rare',
    weight: 8,
    duration: 20000,
    rewards: {
      catChance: 0.5, // 50% chance for free cat
      bp: { min: 200, max: 1000 }
    },
    dialogue: [
      "What could be inside...?",
      "*box rustles ominously*",
      "If it fits, it sits!"
    ]
  },

  sunbeam_blessing: {
    id: 'sunbeam_blessing',
    name: 'Perfect Sunbeam',
    emoji: '☀️',
    description: 'A perfect sunbeam illuminates the sanctuary!',
    rarity: 'common',
    weight: 20,
    duration: 30000,
    effect: {
      type: 'happinessBoost',
      value: 20
    },
    rewards: {
      pp: { min: 30, max: 100 }
    },
    dialogue: [
      "Warm... so warm...",
      "*cats migrate to the sunbeam*",
      "Peak cultivation conditions!"
    ],
    timeRestriction: 'day'
  },

  wandering_cat: {
    id: 'wandering_cat',
    name: 'Wandering Cat',
    emoji: '🐱',
    description: 'A wandering cat seeks to join your sect!',
    rarity: 'rare',
    weight: 5,
    duration: 30000,
    rewards: {
      freeCat: true
    },
    dialogue: [
      "A new disciple approaches!",
      "*curious mrrp*",
      "They've heard of your legendary snoots."
    ]
  },

  treat_rain: {
    id: 'treat_rain',
    name: 'Treat Rain',
    emoji: '🐟',
    description: 'Treats fall from the heavens!',
    rarity: 'common',
    weight: 18,
    duration: 20000,
    effect: {
      type: 'happinessBoost',
      value: 15
    },
    rewards: {
      bp: { min: 50, max: 200 }
    },
    dialogue: [
      "IT'S RAINING TREATS!",
      "*happy chomping sounds*",
      "The heavens smile upon us!"
    ]
  },

  qi_surge: {
    id: 'qi_surge',
    name: 'Qi Surge',
    emoji: '⚡',
    description: 'A surge of Qi energy flows through the sect!',
    rarity: 'uncommon',
    weight: 12,
    duration: 30000,
    effect: {
      type: 'bpMultiplier',
      value: 2,
      duration: 30000
    },
    dialogue: [
      "POWER OVERWHELMING!",
      "*crackles with energy*",
      "Channel the Qi!"
    ]
  },

  waifu_gift: {
    id: 'waifu_gift',
    name: "Master's Gift",
    emoji: '🎁',
    description: 'Your waifu master brings a special gift!',
    rarity: 'uncommon',
    weight: 10,
    duration: 15000,
    rewards: {
      bp: { min: 100, max: 400 },
      bondIncrease: 5
    },
    dialogue: [
      "I brought something for you~",
      "A token of my appreciation!",
      "Please accept this humble gift."
    ]
  },

  moonlight_cultivation: {
    id: 'moonlight_cultivation',
    name: 'Moonlight Cultivation',
    emoji: '🌙',
    description: 'The full moon enhances cultivation!',
    rarity: 'uncommon',
    weight: 10,
    duration: 45000,
    effect: {
      type: 'ppMultiplier',
      value: 2.5,
      duration: 45000
    },
    rewards: {
      pp: { min: 100, max: 300 }
    },
    dialogue: [
      "The moon blesses our cultivation...",
      "*Luna smiles approvingly*",
      "Night cultivators rejoice!"
    ],
    timeRestriction: 'night'
  },

  ancient_scroll: {
    id: 'ancient_scroll',
    name: 'Ancient Scroll Found',
    emoji: '📜',
    description: 'An ancient cultivation scroll has been discovered!',
    rarity: 'rare',
    weight: 5,
    duration: 20000,
    rewards: {
      cultivationXP: { min: 50, max: 200 },
      bp: { min: 500, max: 1000 }
    },
    dialogue: [
      "Ancient wisdom contained within...",
      "A technique from the Founding Masters!",
      "This scroll holds secrets long forgotten..."
    ]
  },

  spirit_stone_vein: {
    id: 'spirit_stone_vein',
    name: 'Spirit Stone Vein',
    emoji: '💎',
    description: 'A vein of spirit stones has been found!',
    rarity: 'rare',
    weight: 6,
    duration: 25000,
    rewards: {
      jadeCatnip: { min: 5, max: 20 },
      materials: { min: 10, max: 30 }
    },
    dialogue: [
      "The earth reveals its treasures!",
      "Spirit stones of high quality!",
      "The sect's fortune increases!"
    ]
  },

  // === CHALLENGE EVENTS ===
  challenger_appears: {
    id: 'challenger_appears',
    name: 'Challenger Appears!',
    emoji: '⚔️',
    description: 'A rival cultivator challenges your sect!',
    rarity: 'uncommon',
    weight: 10,
    duration: 20000,
    isChallenge: true,
    challengeType: 'boop_battle',
    targetBoops: 20,
    rewards: {
      bp: { min: 300, max: 800 },
      jadeCatnip: 1
    },
    failPenalty: {
      bp: -100
    },
    dialogue: [
      "Your boop technique is WEAK!",
      "Face me in honorable combat!",
      "I challenge your sect's honor!"
    ]
  },

  qi_deviation_crisis: {
    id: 'qi_deviation_crisis',
    name: 'Qi Deviation Crisis!',
    emoji: '😵',
    description: 'A cat is experiencing qi deviation! Help stabilize them!',
    rarity: 'uncommon',
    weight: 8,
    duration: 15000,
    isChallenge: true,
    challengeType: 'boop_battle',
    targetBoops: 15,
    rewards: {
      pp: { min: 200, max: 500 },
      happinessBoost: 30
    },
    failPenalty: {
      happinessDrop: 20
    },
    dialogue: [
      "The qi is destabilizing!",
      "Quick, channel your energy!",
      "We must restore harmony!"
    ]
  },

  speed_cultivation: {
    id: 'speed_cultivation',
    name: 'Speed Cultivation!',
    emoji: '⏱️',
    description: 'Rapid boop training session! How fast can you go?',
    rarity: 'uncommon',
    weight: 8,
    duration: 10000,
    isChallenge: true,
    challengeType: 'boop_battle',
    targetBoops: 30,
    rewards: {
      bp: { min: 500, max: 1200 },
      critBonus: 0.05 // Temporary crit bonus
    },
    failPenalty: {
      bp: -50
    },
    dialogue: [
      "SPEED IS THE ESSENCE!",
      "Show me your fastest boops!",
      "No time to rest, GO GO GO!"
    ]
  },

  // === NEGATIVE EVENTS (rare) ===
  lazy_day: {
    id: 'lazy_day',
    name: 'Lazy Day',
    emoji: '😴',
    description: 'The cats are feeling extra lazy today...',
    rarity: 'common',
    weight: 8,
    duration: 30000,
    effect: {
      type: 'ppMultiplier',
      value: 0.5,
      duration: 30000
    },
    dialogue: [
      "*yawwwwn*",
      "Too comfy to cultivate...",
      "Five more minutes..."
    ]
  },

  hairball_incident: {
    id: 'hairball_incident',
    name: 'Hairball Incident',
    emoji: '🤢',
    description: 'A chain reaction of hairballs!',
    rarity: 'uncommon',
    weight: 5,
    duration: 15000,
    effect: {
      type: 'happinessDrop',
      value: 10
    },
    dialogue: [
      "*hurk hurk hurk*",
      "Not on the meditation mats!",
      "The cleanup begins..."
    ]
  },

  // === SPECIAL EVENTS (very rare) ===
  golden_visitor: {
    id: 'golden_visitor',
    name: 'Golden Visitor',
    emoji: '✨',
    description: 'A mysterious golden cat appears!',
    rarity: 'legendary',
    weight: 1,
    duration: 15000,
    rewards: {
      goldenFeathers: 1,
      bp: { min: 1000, max: 5000 }
    },
    dialogue: [
      "A being of pure golden light!",
      "The celestial cat has blessed us!",
      "Quick, boop before it vanishes!"
    ]
  },

  elder_teaching: {
    id: 'elder_teaching',
    name: "Elder's Teaching",
    emoji: '👴',
    description: 'An elder master shares ancient wisdom!',
    rarity: 'legendary',
    weight: 2,
    duration: 20000,
    rewards: {
      cultivationXP: { min: 200, max: 500 },
      permanentBpBonus: 0.01 // +1% permanent BP
    },
    dialogue: [
      "Listen well, young cultivator...",
      "In my years, I have learned much...",
      "Let me share the wisdom of ages..."
    ]
  }
};

// ============================================
// WEEKLY SECT CHALLENGES
// ============================================
const WEEKLY_CHALLENGES = {
  weekly_boops: {
    id: 'weekly_boops',
    name: 'Sect Boop Marathon',
    description: 'The entire sect must boop together!',
    type: 'boops',
    baseTarget: 10000,
    scaling: 1.2,
    rewards: {
      jadeCatnip: 50,
      destinyThreads: 10,
      title: 'Weekly Boop Champion'
    }
  },
  weekly_cats: {
    id: 'weekly_cats',
    name: 'Cat Recruitment Drive',
    description: 'Recruit new disciples to the sect!',
    type: 'catsRecruited',
    baseTarget: 10,
    scaling: 1.1,
    rewards: {
      freeCat: { rarity: 'rare' },
      jadeCatnip: 30
    }
  },
  weekly_pagoda: {
    id: 'weekly_pagoda',
    name: 'Pagoda Ascension',
    description: 'Climb the Infinite Pagoda!',
    type: 'pagodaFloors',
    baseTarget: 50,
    scaling: 1.15,
    rewards: {
      pagodaTokens: 100,
      jadeCatnip: 40
    }
  },
  weekly_bonds: {
    id: 'weekly_bonds',
    name: 'Harmonious Bonds',
    description: 'Strengthen your bonds with the masters!',
    type: 'bondGained',
    baseTarget: 100,
    scaling: 1.1,
    rewards: {
      waifuTokens: 50,
      giftBox: { rarity: 'epic' }
    }
  },
  weekly_expedition: {
    id: 'weekly_expedition',
    name: 'Grand Expedition',
    description: 'Complete expeditions across the Jianghu!',
    type: 'expeditionsCompleted',
    baseTarget: 20,
    scaling: 1.1,
    rewards: {
      materials: 100,
      jadeCatnip: 35
    }
  }
};

// ============================================
// MONTHLY FESTIVALS
// ============================================
const MONTHLY_FESTIVALS = {
  1: {
    id: 'new_year_celebration',
    name: 'New Year Celebration',
    emoji: '🎆',
    description: 'Celebrate the new year with special bonuses!',
    bonuses: {
      allProduction: 1.5,
      giftQuality: 2.0
    }
  },
  2: {
    id: 'love_festival',
    name: 'Festival of Love',
    emoji: '💕',
    description: 'A romantic month for deepening bonds!',
    bonuses: {
      waifuBonds: 2.0,
      happinessGain: 1.5
    }
  },
  3: {
    id: 'spring_awakening',
    name: 'Spring Awakening',
    emoji: '🌱',
    description: 'New growth and new beginnings!',
    bonuses: {
      catRecruitChance: 1.5,
      expeditionSpeed: 1.3
    }
  },
  4: {
    id: 'blossom_festival',
    name: 'Blossom Festival',
    emoji: '🌸',
    description: 'Cherry blossoms bloom throughout the sect!',
    bonuses: {
      waifuBonds: 1.5,
      happinessDecay: 0.5
    }
  },
  5: {
    id: 'cultivation_month',
    name: 'Cultivation Month',
    emoji: '🧘',
    description: 'Focus on cultivation and inner growth!',
    bonuses: {
      cultivationXP: 1.5,
      ppGeneration: 1.3
    }
  },
  6: {
    id: 'adventure_season',
    name: 'Adventure Season',
    emoji: '🗺️',
    description: 'The perfect time for expeditions!',
    bonuses: {
      expeditionRewards: 1.5,
      eventFrequency: 1.3
    }
  },
  7: {
    id: 'summer_festival',
    name: 'Summer Festival',
    emoji: '🎐',
    description: 'Cool off with summer fun!',
    bonuses: {
      bpGeneration: 1.3,
      gooseSpawnRate: 1.5
    }
  },
  8: {
    id: 'harvest_preparation',
    name: 'Harvest Preparation',
    emoji: '🌾',
    description: 'Prepare for the autumn harvest!',
    bonuses: {
      materialGain: 1.5,
      craftingSpeed: 1.3
    }
  },
  9: {
    id: 'moon_festival',
    name: 'Moon Festival',
    emoji: '🌙',
    description: 'Honor the moon with Luna!',
    bonuses: {
      nightBonus: 2.0,
      lunaSpecial: true
    }
  },
  10: {
    id: 'spooky_season',
    name: 'Spooky Season',
    emoji: '🎃',
    description: 'The geese are extra chaotic!',
    bonuses: {
      gooseSpawnRate: 2.0,
      gooseRewards: 1.5
    }
  },
  11: {
    id: 'gratitude_month',
    name: 'Gratitude Month',
    emoji: '🍂',
    description: 'Give thanks for your sect!',
    bonuses: {
      giftQuality: 1.5,
      bondGain: 1.3
    }
  },
  12: {
    id: 'winter_celebration',
    name: 'Winter Celebration',
    emoji: '❄️',
    description: 'Celebrate the end of the year!',
    bonuses: {
      allProduction: 1.5,
      freeSpins: 5
    }
  }
};

// ============================================
// HIDDEN EVENTS (Easter Eggs / Secrets)
// ============================================
const HIDDEN_EVENTS = {
  // Triggers at exactly 69420 BP
  nice_number: {
    id: 'nice_number',
    name: 'Nice.',
    emoji: '😏',
    triggerCondition: (gameState) => gameState.boopPoints === 69420,
    oneTime: true,
    rewards: {
      achievement: 'nice',
      cosmetic: 'sunglasses_hat'
    },
    dialogue: '( \u0361\u00b0 \u035c\u0296 \u0361\u00b0)'
  },

  // Triggers after 100 moon clicks (requires tracking)
  moon_secret: {
    id: 'moon_secret',
    name: "Luna's Secret",
    emoji: '🌙',
    triggerCondition: (gameState) => gameState.moonClicks >= 100,
    oneTime: true,
    rewards: {
      cosmetic: 'moonbeam_aura',
      bondIncrease: { waifu: 'luna', amount: 20 }
    },
    dialogue: 'You... like the moon too? *sleepy smile* Here, take this...'
  },

  // Triggers after naming a cat "Nyan"
  nyan_cat: {
    id: 'nyan_cat',
    name: 'Nyan!',
    emoji: '🌈',
    triggerCondition: (gameState) => gameState.catNamed === 'nyan',
    oneTime: true,
    rewards: {
      achievement: 'nyan_easter_egg',
      catTrait: 'rainbow_trail'
    },
    dialogue: 'Nyan nyan nyan~'
  },

  // Triggers after 10 minutes AFK
  afk_cat: {
    id: 'afk_cat',
    name: 'The Patient One',
    emoji: '😶',
    triggerCondition: (gameState) => {
      const timeSinceLastBoop = Date.now() - gameState.lastBoopTime;
      return timeSinceLastBoop >= 600000;
    },
    oneTime: true,
    rewards: {
      freeCat: { id: 'mystery_cat', name: '??? Cat', rarity: 'divine' }
    },
    dialogue: 'This cat only appears to those who wait...'
  },

  // Triggers at exactly midnight
  midnight_visitor: {
    id: 'midnight_visitor',
    name: 'Midnight Visitor',
    emoji: '🦉',
    triggerCondition: () => {
      const now = new Date();
      return now.getHours() === 0 && now.getMinutes() === 0;
    },
    oneTime: false, // Can trigger once per night
    cooldown: 86400000, // 24 hours
    rewards: {
      jadeCatnip: 10,
      mysteryItem: true
    },
    dialogue: 'The night owl brings gifts for those who stay awake...'
  },

  // Triggers on Friday the 13th
  unlucky_day: {
    id: 'unlucky_day',
    name: 'Unlucky Day?',
    emoji: '🐈‍⬛',
    triggerCondition: () => {
      const now = new Date();
      return now.getDate() === 13 && now.getDay() === 5;
    },
    oneTime: false,
    cooldown: 86400000,
    rewards: {
      luckyBoost: 2.0, // Actually LUCKY
      freeCat: { id: 'black_cat', rarity: 'rare' }
    },
    dialogue: 'They say black cats are unlucky... but not in our sect!'
  },

  // Triggers after 1000 goose boops
  goose_whisperer: {
    id: 'goose_whisperer',
    name: 'Goose Whisperer',
    emoji: '🦢',
    triggerCondition: (gameState) => gameState.gooseBoops >= 1000,
    oneTime: true,
    rewards: {
      achievement: 'goose_whisperer',
      unlocksWaifu: 'honk_maiden'
    },
    dialogue: 'HONK... I mean... You have earned the respect of the geese.'
  },

  // Triggers after maxing bond with all waifus
  harem_protagonist: {
    id: 'harem_protagonist',
    name: 'Ultimate Cultivator',
    emoji: '💖',
    triggerCondition: (gameState) => {
      if (!window.waifuSystem) return false;
      return window.waifuSystem.allWaifusMaxBond();
    },
    oneTime: true,
    rewards: {
      achievement: 'harem_protagonist',
      permanentBonus: { allProduction: 1.25 },
      title: 'Beloved of the Masters'
    },
    dialogue: 'You have won the hearts of all the masters. The sect has never been stronger!'
  },

  // Konami code easter egg
  konami_activated: {
    id: 'konami_activated',
    name: 'RETRO MODE',
    emoji: '🕹️',
    triggerCondition: (gameState) => gameState.konamiActivated,
    oneTime: true,
    rewards: {
      visualMode: 'retro',
      achievement: 'old_school'
    },
    dialogue: '[ RETRO MODE ACTIVATED ] The ancient ways have been restored!'
  },

  // Play for 100 hours total
  dedicated_cultivator: {
    id: 'dedicated_cultivator',
    name: 'Dedicated Cultivator',
    emoji: '🏅',
    triggerCondition: (gameState) => gameState.playtime >= 360000000, // 100 hours in ms
    oneTime: true,
    rewards: {
      achievement: 'dedicated_cultivator',
      jadeCatnip: 100,
      title: 'Eternal Cultivator'
    },
    dialogue: 'Your dedication knows no bounds. The heavens acknowledge you!'
  }
};

// Event rarity weights for rolling
const RARITY_WEIGHTS = {
  common: 1.0,
  uncommon: 0.5,
  rare: 0.2,
  legendary: 0.05
};

/**
 * EventSystem - Manages all event types
 */
class EventSystem {
  constructor() {
    // Random event state
    this.activeEvent = null;
    this.eventTimer = null;
    this.eventHistory = [];
    this.activeEffects = [];
    this.challengeProgress = 0;

    // Event check interval (check every 30 seconds)
    this.checkInterval = 30000;
    this.baseEventChance = 0.15; // 15% chance per check

    // Weekly challenge state
    this.weeklyChallenge = null;
    this.weeklyProgress = {};
    this.weeklyResetDay = 1; // Monday
    this.lastWeeklyReset = null;

    // Monthly festival state
    this.currentMonthlyFestival = null;

    // Hidden event tracking
    this.triggeredHiddenEvents = [];
    this.hiddenEventCooldowns = {};

    // Track last event triggers
    this.lastEventTime = 0;
    this.eventCooldown = 60000; // 1 minute minimum between events
  }

  /**
   * Start the event system
   */
  start() {
    setInterval(() => this.checkForEvent(), this.checkInterval);

    // Check weekly challenge
    this.checkWeeklyChallenge();

    // Check monthly festival
    this.checkMonthlyFestival();

    // Check hidden events periodically
    setInterval(() => this.checkHiddenEvents(), 5000);
  }

  /**
   * Update (called from game loop)
   */
  update(deltaTime) {
    // Update active effects
    this.updateActiveEffects();
  }

  // ============================================
  // RANDOM JIANGHU EVENTS
  // ============================================

  /**
   * Check if an event should trigger
   */
  checkForEvent() {
    if (this.activeEvent) return; // Don't trigger while event is active
    if (Date.now() - this.lastEventTime < this.eventCooldown) return;

    // Base chance modified by game state
    let chance = this.baseEventChance;

    // Andrew's Lightning Reflexes bonus
    if (window.gameState?.modifiers?.eventChanceBonus) {
      chance *= (1 + window.gameState.modifiers.eventChanceBonus);
    }

    // Chaos Goose doubles event frequency
    if (window.gameState?.gooseAlly?.id === 'chaos') {
      chance *= 2;
    }

    // Time system event chance modifier
    if (window.timeSystem) {
      const timeModifiers = window.timeSystem.getTimeModifiers();
      chance *= timeModifiers.eventChanceMultiplier || 1;
    }

    // Seasonal bonus
    const season = window.timeSystem?.currentSeason;
    if (season === 'summer') {
      chance *= 1.2; // +20% event frequency in summer
    }

    if (Math.random() < chance) {
      this.triggerRandomEvent();
    }
  }

  /**
   * Trigger a random event based on weights
   */
  triggerRandomEvent() {
    const event = this.rollEvent();
    if (event) {
      this.startEvent(event);
    }
  }

  /**
   * Roll for an event based on weights
   */
  rollEvent() {
    const events = Object.values(EVENT_TEMPLATES);
    const isNight = window.timeSystem?.isNightTime() || false;
    const isDay = !isNight;

    // Filter events by time restriction
    const availableEvents = events.filter(e => {
      if (e.timeRestriction === 'night' && !isNight) return false;
      if (e.timeRestriction === 'day' && !isDay) return false;
      return true;
    });

    const totalWeight = availableEvents.reduce((sum, e) => sum + (e.weight || 10), 0);
    let roll = Math.random() * totalWeight;

    for (const event of availableEvents) {
      roll -= (event.weight || 10);
      if (roll <= 0) {
        return { ...event }; // Return a copy
      }
    }

    return availableEvents[0]; // Fallback
  }

  /**
   * Start an event
   */
  startEvent(event) {
    this.activeEvent = event;
    this.challengeProgress = 0;
    this.lastEventTime = Date.now();

    // Play event sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('event');
    }

    // Show event UI
    this.showEventUI(event);

    // Apply immediate effects
    if (event.effect) {
      this.applyEffect(event.effect);
    }

    // Set timer for event duration
    this.eventTimer = setTimeout(() => {
      this.endEvent(event.isChallenge ? false : true);
    }, event.duration);

    // Log event
    this.eventHistory.push({
      id: event.id,
      timestamp: Date.now(),
      completed: false
    });
  }

  /**
   * End the current event
   */
  endEvent(success = true) {
    if (!this.activeEvent) return;

    clearTimeout(this.eventTimer);

    const event = this.activeEvent;

    if (success) {
      this.grantRewards(event);
      // Play success sound
      if (window.audioSystem) {
        window.audioSystem.playSFX('levelup');
      }
    } else if (event.failPenalty) {
      this.applyPenalty(event.failPenalty);
      // Play failure sound
      if (window.audioSystem) {
        window.audioSystem.playSFX('error');
      }
    }

    // Track progress for daily/weekly challenges
    if (success && window.dailySystem) {
      if (event.isChallenge) {
        window.dailySystem.trackProgress('eventsCompleted', 1);
      }
    }

    // Update history
    const historyEntry = this.eventHistory[this.eventHistory.length - 1];
    if (historyEntry) {
      historyEntry.completed = success;
    }

    // Hide UI
    this.hideEventUI();

    this.activeEvent = null;
  }

  /**
   * Handle interaction with event (clicking, etc.)
   */
  interactWithEvent() {
    if (!this.activeEvent) return;

    const event = this.activeEvent;

    if (event.isChallenge && event.challengeType === 'boop_battle') {
      this.challengeProgress++;
      this.updateChallengeUI();

      if (this.challengeProgress >= event.targetBoops) {
        this.endEvent(true);
      }
    } else {
      // Non-challenge events end on interaction
      this.endEvent(true);
    }
  }

  /**
   * Apply an effect to the game
   */
  applyEffect(effect) {
    const effectEntry = {
      ...effect,
      startTime: Date.now(),
      endTime: Date.now() + (effect.duration || 30000)
    };

    this.activeEffects.push(effectEntry);

    // Apply to game state
    switch (effect.type) {
      case 'ppMultiplier':
        window.gameState.modifiers.eventPPMultiplier = effect.value;
        break;
      case 'bpMultiplier':
        window.gameState.modifiers.eventBPMultiplier = effect.value;
        break;
      case 'happinessBoost':
        if (window.catSystem) {
          window.catSystem.boostHappiness(effect.value);
        }
        break;
      case 'happinessDrop':
        if (window.catSystem) {
          window.catSystem.boostHappiness(-effect.value);
        }
        break;
    }

    // Remove effect after duration
    setTimeout(() => {
      this.removeEffect(effectEntry);
    }, effect.duration || 30000);
  }

  /**
   * Remove an effect
   */
  removeEffect(effect) {
    const index = this.activeEffects.indexOf(effect);
    if (index > -1) {
      this.activeEffects.splice(index, 1);
    }

    // Reset game state modifier
    switch (effect.type) {
      case 'ppMultiplier':
        window.gameState.modifiers.eventPPMultiplier = 1;
        break;
      case 'bpMultiplier':
        window.gameState.modifiers.eventBPMultiplier = 1;
        break;
    }
  }

  /**
   * Update active effects
   */
  updateActiveEffects() {
    const now = Date.now();
    this.activeEffects = this.activeEffects.filter(e => now < e.endTime);
  }

  /**
   * Grant rewards from an event
   */
  grantRewards(event) {
    if (!event.rewards) return;

    const rewards = event.rewards;
    let rewardText = [];

    // BP reward
    if (rewards.bp) {
      const bp = this.randomRange(rewards.bp.min, rewards.bp.max);
      window.gameState.boopPoints += bp;
      rewardText.push(`+${bp} BP`);
    }

    // PP reward
    if (rewards.pp) {
      const pp = this.randomRange(rewards.pp.min, rewards.pp.max);
      window.gameState.purrPower += pp;
      rewardText.push(`+${pp} PP`);
    }

    // Jade Catnip reward
    if (rewards.jadeCatnip) {
      const jc = typeof rewards.jadeCatnip === 'object'
        ? this.randomRange(rewards.jadeCatnip.min, rewards.jadeCatnip.max)
        : rewards.jadeCatnip;
      window.gameState.jadeCatnip = (window.gameState.jadeCatnip || 0) + jc;
      rewardText.push(`+${jc} Jade Catnip`);
    }

    // Golden Feathers
    if (rewards.goldenFeathers) {
      window.gameState.goldenFeathers = (window.gameState.goldenFeathers || 0) + rewards.goldenFeathers;
      rewardText.push(`+${rewards.goldenFeathers} Golden Feather!`);
    }

    // Cultivation XP
    if (rewards.cultivationXP && window.cultivationSystem) {
      const xp = this.randomRange(rewards.cultivationXP.min, rewards.cultivationXP.max);
      window.cultivationSystem.addCultivationXP(xp);
      rewardText.push(`+${xp} Cultivation XP`);
    }

    // Free cat reward
    if (rewards.freeCat || (rewards.catChance && Math.random() < rewards.catChance)) {
      if (window.catSystem) {
        const newCat = window.catSystem.recruitCat();
        if (newCat) {
          rewardText.push(`New cat: ${newCat.name}!`);
        }
      }
    }

    // Bond increase
    if (rewards.bondIncrease && window.waifuSystem) {
      const waifu = window.waifuSystem.getActiveWaifu();
      if (waifu) {
        window.waifuSystem.increaseBond(waifu.id, rewards.bondIncrease);
        rewardText.push(`+${rewards.bondIncrease} Bond`);
      }
    }

    // Materials
    if (rewards.materials && window.craftingSystem) {
      const mats = typeof rewards.materials === 'object'
        ? this.randomRange(rewards.materials.min, rewards.materials.max)
        : rewards.materials;
      window.craftingSystem.addRandomMaterials(mats);
      rewardText.push(`+${mats} Materials`);
    }

    // Show reward notification
    if (rewardText.length > 0) {
      this.showRewardNotification(rewardText.join(', '));
    }
  }

  /**
   * Apply penalty for failed events
   */
  applyPenalty(penalty) {
    if (penalty.bp) {
      window.gameState.boopPoints = Math.max(0, window.gameState.boopPoints + penalty.bp);
      this.showRewardNotification(`${penalty.bp} BP`);
    }
    if (penalty.happinessDrop && window.catSystem) {
      window.catSystem.boostHappiness(-penalty.happinessDrop);
    }
  }

  // ============================================
  // WEEKLY SECT CHALLENGES
  // ============================================

  /**
   * Check and update weekly challenge
   */
  checkWeeklyChallenge() {
    const now = new Date();
    const today = now.getDay();

    // Check if we need to reset (Monday)
    const needsReset = today === this.weeklyResetDay &&
      (!this.lastWeeklyReset || this.getDaysSince(this.lastWeeklyReset) >= 7);

    if (needsReset || !this.weeklyChallenge) {
      this.generateWeeklyChallenge();
    }
  }

  /**
   * Generate a new weekly challenge
   */
  generateWeeklyChallenge() {
    const challengeIds = Object.keys(WEEKLY_CHALLENGES);
    const challengeId = challengeIds[Math.floor(Math.random() * challengeIds.length)];
    const template = WEEKLY_CHALLENGES[challengeId];

    // Scale target based on player progress
    const progressLevel = this.getProgressLevel();
    const target = Math.floor(template.baseTarget * Math.pow(template.scaling, progressLevel));

    this.weeklyChallenge = {
      ...template,
      target: target,
      progress: 0,
      completed: false,
      claimed: false,
      startDate: Date.now()
    };

    this.lastWeeklyReset = new Date().toISOString().split('T')[0];

    console.log(`[EventSystem] New weekly challenge: ${template.name} (Target: ${target})`);
  }

  /**
   * Track weekly challenge progress
   */
  trackWeeklyProgress(type, amount) {
    if (!this.weeklyChallenge || this.weeklyChallenge.completed) return;
    if (this.weeklyChallenge.type !== type) return;

    this.weeklyChallenge.progress += amount;

    if (this.weeklyChallenge.progress >= this.weeklyChallenge.target) {
      this.weeklyChallenge.completed = true;

      if (window.audioSystem) {
        window.audioSystem.playSFX('achievement');
      }

      this.showRewardNotification(`Weekly Challenge Complete: ${this.weeklyChallenge.name}!`);
    }
  }

  /**
   * Claim weekly challenge rewards
   */
  claimWeeklyRewards() {
    if (!this.weeklyChallenge?.completed || this.weeklyChallenge.claimed) {
      return null;
    }

    this.weeklyChallenge.claimed = true;
    const rewards = this.weeklyChallenge.rewards;

    // Grant rewards
    if (rewards.jadeCatnip) {
      window.gameState.jadeCatnip = (window.gameState.jadeCatnip || 0) + rewards.jadeCatnip;
    }
    if (rewards.destinyThreads) {
      window.gameState.destinyThreads = (window.gameState.destinyThreads || 0) + rewards.destinyThreads;
    }
    if (rewards.pagodaTokens && window.pagodaSystem) {
      window.pagodaSystem.addTokens(rewards.pagodaTokens);
    }

    return rewards;
  }

  /**
   * Get weekly challenge status
   */
  getWeeklyChallengeStatus() {
    if (!this.weeklyChallenge) return null;

    return {
      ...this.weeklyChallenge,
      timeRemaining: this.getTimeUntilWeeklyReset()
    };
  }

  /**
   * Get time until weekly reset
   */
  getTimeUntilWeeklyReset() {
    const now = new Date();
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday.getTime() - now.getTime();
  }

  // ============================================
  // MONTHLY FESTIVALS
  // ============================================

  /**
   * Check and update monthly festival
   */
  checkMonthlyFestival() {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-indexed

    const festival = MONTHLY_FESTIVALS[month];
    if (festival && this.currentMonthlyFestival?.id !== festival.id) {
      this.currentMonthlyFestival = festival;
      this.onMonthlyFestivalStart(festival);
    }
  }

  /**
   * Handle monthly festival start
   */
  onMonthlyFestivalStart(festival) {
    console.log(`[EventSystem] Monthly festival: ${festival.name}`);

    // Show notification if function exists
    if (window.showNotification) {
      window.showNotification({
        type: 'festival',
        title: `${festival.emoji} ${festival.name}`,
        message: festival.description,
        duration: 5000
      });
    }
  }

  /**
   * Get monthly festival bonuses
   */
  getMonthlyFestivalBonuses() {
    return this.currentMonthlyFestival?.bonuses || {};
  }

  // ============================================
  // HIDDEN EVENTS
  // ============================================

  /**
   * Check for hidden events
   */
  checkHiddenEvents() {
    const gameState = window.gameState;
    if (!gameState) return;

    for (const [eventId, event] of Object.entries(HIDDEN_EVENTS)) {
      // Skip if already triggered (for one-time events)
      if (event.oneTime && this.triggeredHiddenEvents.includes(eventId)) {
        continue;
      }

      // Check cooldown
      if (this.hiddenEventCooldowns[eventId] &&
          Date.now() < this.hiddenEventCooldowns[eventId]) {
        continue;
      }

      // Check trigger condition
      try {
        if (event.triggerCondition(gameState)) {
          this.triggerHiddenEvent(eventId, event);
        }
      } catch (e) {
        // Condition check failed, skip
      }
    }
  }

  /**
   * Trigger a hidden event
   */
  triggerHiddenEvent(eventId, event) {
    console.log(`[EventSystem] Hidden event triggered: ${event.name}`);

    // Mark as triggered
    if (event.oneTime) {
      this.triggeredHiddenEvents.push(eventId);
    }

    // Set cooldown
    if (event.cooldown) {
      this.hiddenEventCooldowns[eventId] = Date.now() + event.cooldown;
    }

    // Play special sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('secret');
    }

    // Show special notification
    this.showHiddenEventUI(event);

    // Grant rewards
    if (event.rewards) {
      this.grantHiddenEventRewards(event.rewards);
    }
  }

  /**
   * Grant hidden event rewards
   */
  grantHiddenEventRewards(rewards) {
    if (rewards.achievement && window.achievementSystem) {
      window.achievementSystem.unlock(rewards.achievement);
    }

    if (rewards.cosmetic) {
      window.gameState.cosmeticsOwned = window.gameState.cosmeticsOwned || [];
      window.gameState.cosmeticsOwned.push(rewards.cosmetic);
    }

    if (rewards.jadeCatnip) {
      window.gameState.jadeCatnip = (window.gameState.jadeCatnip || 0) + rewards.jadeCatnip;
    }

    if (rewards.freeCat && window.catSystem) {
      if (typeof rewards.freeCat === 'object') {
        window.catSystem.addSpecificCat(rewards.freeCat);
      } else {
        window.catSystem.recruitCat();
      }
    }

    if (rewards.bondIncrease && window.waifuSystem) {
      window.waifuSystem.increaseBond(
        rewards.bondIncrease.waifu,
        rewards.bondIncrease.amount
      );
    }

    if (rewards.permanentBonus) {
      window.gameState.permanentBonuses = window.gameState.permanentBonuses || {};
      Object.assign(window.gameState.permanentBonuses, rewards.permanentBonus);
    }

    if (rewards.title) {
      window.gameState.titles = window.gameState.titles || [];
      window.gameState.titles.push(rewards.title);
    }

    if (rewards.unlocksWaifu && window.waifuSystem) {
      window.waifuSystem.unlockWaifu(rewards.unlocksWaifu);
    }

    if (rewards.visualMode) {
      window.gameState.visualMode = rewards.visualMode;
    }
  }

  /**
   * Show hidden event UI
   */
  showHiddenEventUI(event) {
    let secretBanner = document.getElementById('secret-banner');

    if (!secretBanner) {
      secretBanner = document.createElement('div');
      secretBanner.id = 'secret-banner';
      secretBanner.className = 'secret-banner';
      document.body.appendChild(secretBanner);
    }

    secretBanner.innerHTML = `
      <div class="secret-content">
        <span class="secret-emoji">${event.emoji}</span>
        <div class="secret-text">
          <h3>SECRET DISCOVERED!</h3>
          <h4>${event.name}</h4>
          <p class="secret-dialogue">"${event.dialogue}"</p>
        </div>
      </div>
    `;

    secretBanner.classList.add('visible');

    setTimeout(() => {
      secretBanner.classList.remove('visible');
    }, 5000);
  }

  // ============================================
  // UI METHODS
  // ============================================

  /**
   * Show event UI
   */
  showEventUI(event) {
    let eventBanner = document.getElementById('event-banner');

    if (!eventBanner) {
      eventBanner = document.createElement('div');
      eventBanner.id = 'event-banner';
      eventBanner.className = 'event-banner';
      document.body.appendChild(eventBanner);
    }

    const dialogue = event.dialogue[Math.floor(Math.random() * event.dialogue.length)];

    eventBanner.innerHTML = `
      <div class="event-content" onclick="window.eventSystem.interactWithEvent()">
        <span class="event-emoji">${event.emoji}</span>
        <div class="event-text">
          <h3>${event.name}</h3>
          <p>${event.description}</p>
          <p class="event-dialogue">"${dialogue}"</p>
          ${event.isChallenge ? `<div class="challenge-progress">Progress: <span id="challenge-count">${this.challengeProgress}</span>/${event.targetBoops}</div>` : ''}
          <p class="event-hint">Click to ${event.isChallenge ? 'fight back!' : 'collect!'}</p>
        </div>
        <div class="event-timer-bar">
          <div class="event-timer-fill" style="animation-duration: ${event.duration}ms"></div>
        </div>
      </div>
    `;

    eventBanner.classList.add('visible');
  }

  /**
   * Update challenge progress display
   */
  updateChallengeUI() {
    const counter = document.getElementById('challenge-count');
    if (counter) {
      counter.textContent = this.challengeProgress;
    }
  }

  /**
   * Hide event UI
   */
  hideEventUI() {
    const eventBanner = document.getElementById('event-banner');
    if (eventBanner) {
      eventBanner.classList.remove('visible');
    }
  }

  /**
   * Show reward notification
   */
  showRewardNotification(text) {
    const notification = document.createElement('div');
    notification.className = 'event-reward-notification';
    notification.textContent = text;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('visible'), 10);
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Random range helper
   */
  randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get days since a date
   */
  getDaysSince(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now - date) / 86400000);
  }

  /**
   * Get player progress level
   */
  getProgressLevel() {
    let level = 0;

    if (window.gameState) {
      level += Math.floor(Math.log10(window.gameState.totalBoops + 1));
      level += Math.floor(Math.log10(window.gameState.boopPoints + 1) / 2);
    }

    if (window.pagodaSystem) {
      level += Math.floor(window.pagodaSystem.highestFloor / 10);
    }

    return Math.min(level, 20);
  }

  /**
   * Get active effects for display
   */
  getActiveEffects() {
    return this.activeEffects.filter(e => Date.now() < e.endTime);
  }

  /**
   * Get combined effect multipliers
   */
  getEffectMultipliers() {
    return {
      pp: window.gameState?.modifiers?.eventPPMultiplier || 1,
      bp: window.gameState?.modifiers?.eventBPMultiplier || 1
    };
  }

  /**
   * Get all active events for display
   */
  getActiveEvents() {
    const events = [];

    if (this.activeEvent) {
      events.push({
        type: 'random',
        event: this.activeEvent
      });
    }

    if (this.weeklyChallenge && !this.weeklyChallenge.completed) {
      events.push({
        type: 'weekly',
        event: this.weeklyChallenge
      });
    }

    if (this.currentMonthlyFestival) {
      events.push({
        type: 'monthly',
        event: this.currentMonthlyFestival
      });
    }

    return events;
  }

  // ============================================
  // SERIALIZATION
  // ============================================

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      eventHistory: this.eventHistory.slice(-50), // Keep last 50
      weeklyChallenge: this.weeklyChallenge,
      lastWeeklyReset: this.lastWeeklyReset,
      triggeredHiddenEvents: this.triggeredHiddenEvents,
      hiddenEventCooldowns: this.hiddenEventCooldowns
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data?.eventHistory) this.eventHistory = data.eventHistory;
    if (data?.weeklyChallenge) this.weeklyChallenge = data.weeklyChallenge;
    if (data?.lastWeeklyReset) this.lastWeeklyReset = data.lastWeeklyReset;
    if (data?.triggeredHiddenEvents) this.triggeredHiddenEvents = data.triggeredHiddenEvents;
    if (data?.hiddenEventCooldowns) this.hiddenEventCooldowns = data.hiddenEventCooldowns;

    // Check for resets
    this.checkWeeklyChallenge();
    this.checkMonthlyFestival();
  }

  /**
   * Reset system
   */
  reset() {
    this.activeEvent = null;
    this.eventHistory = [];
    this.activeEffects = [];
    this.weeklyChallenge = null;
    this.lastWeeklyReset = null;
    this.triggeredHiddenEvents = [];
    this.hiddenEventCooldowns = {};

    this.checkWeeklyChallenge();
    this.checkMonthlyFestival();
  }
}

// Export
window.EVENT_TEMPLATES = EVENT_TEMPLATES;
window.WEEKLY_CHALLENGES = WEEKLY_CHALLENGES;
window.MONTHLY_FESTIVALS = MONTHLY_FESTIVALS;
window.HIDDEN_EVENTS = HIDDEN_EVENTS;
window.EventSystem = EventSystem;
