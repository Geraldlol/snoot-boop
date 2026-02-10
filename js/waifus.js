/**
 * waifus.js - The Twelve Immortal Masters
 * "A waifu's guidance is worth ten thousand boops."
 *
 * Data can be loaded from data/waifus.json via dataLoader.
 * Hardcoded values serve as fallback if JSON not available.
 */

// ============================================
// BOND ACTIVITIES - Time-based bonding system
// ============================================
let BOND_ACTIVITIES = {
  teaCeremony: {
    id: 'teaCeremony',
    name: 'Tea Ceremony',
    emoji: '🍵',
    description: 'Share a quiet moment over tea. A traditional bonding ritual.',
    duration: 300, // 5 minutes in seconds
    bondGain: 10,
    preferredBy: ['mochi', 'fluffington', 'luna'],
    unlockBond: 0,
    timeRestriction: null,
    producesItem: false,
    afkCompatible: true,
    dialogue: {
      start: [
        "Let us share a cup of tranquility...",
        "The tea is ready. Please, join me.",
        "A moment of peace in our busy cultivation~"
      ],
      complete: [
        "That was a lovely ceremony. Thank you for sharing it with me.",
        "The tea has calmed my spirit. I feel closer to you now~",
        "Such peaceful moments are treasures..."
      ]
    }
  },

  sparring: {
    id: 'sparring',
    name: 'Sparring Match',
    emoji: '⚔️',
    description: 'Train together in combat. Builds respect and understanding.',
    duration: 600, // 10 minutes
    bondGain: 15,
    preferredBy: ['nyanta', 'meowlina'],
    unlockBond: 20,
    timeRestriction: null,
    producesItem: false,
    afkCompatible: false,
    minigame: 'combat_practice',
    dialogue: {
      start: [
        "Ready yourself, cultivator! Show me your strength!",
        "The best bonds are forged in battle!",
        "Let us test our techniques against each other!"
      ],
      complete: [
        "Excellent form! You've grown stronger.",
        "A worthy opponent! My respect for you has grown.",
        "That was invigorating! We must do this again~"
      ]
    }
  },

  meditation: {
    id: 'meditation',
    name: 'Meditation',
    emoji: '🧘',
    description: 'Cultivate together in silence. Deepens spiritual connection.',
    duration: 900, // 15 minutes
    bondGain: 20,
    preferredBy: ['luna', 'fluffington', 'mochi'],
    unlockBond: 30,
    timeRestriction: null,
    producesItem: false,
    afkCompatible: true,
    dialogue: {
      start: [
        "Close your eyes... let us find inner peace together...",
        "In stillness, we discover each other's true nature...",
        "Breathe with me... *slowly inhales*"
      ],
      complete: [
        "I felt our Qi resonate as one...",
        "Such profound tranquility... Thank you for sharing this with me.",
        "My cultivation has deepened through our connection~"
      ]
    }
  },

  stargazing: {
    id: 'stargazing',
    name: 'Stargazing',
    emoji: '🌟',
    description: 'Watch the stars together. Only available at night.',
    duration: 600, // 10 minutes
    bondGain: 25,
    preferredBy: ['luna', 'fluffington'],
    unlockBond: 40,
    timeRestriction: 'night', // Only available 22:00 - 06:00
    producesItem: false,
    afkCompatible: true,
    dialogue: {
      start: [
        "The stars are beautiful tonight... just like you~",
        "Each star tells a story... Let me share them with you.",
        "*looks up at the night sky* ...so many wonders..."
      ],
      complete: [
        "I'll never forget this night with you...",
        "The stars witnessed our bond growing stronger~",
        "Perhaps one day, we'll have a star of our own..."
      ]
    }
  },

  cooking: {
    id: 'cooking',
    name: 'Cooking Together',
    emoji: '🍳',
    description: 'Prepare a meal together. May produce special treats!',
    duration: 450, // 7.5 minutes
    bondGain: 18,
    preferredBy: ['mochi', 'sakura'],
    unlockBond: 25,
    timeRestriction: null,
    producesItem: true,
    itemPool: [
      { id: 'homemade_treat', name: 'Homemade Treat', effect: { happiness: 20 }, chance: 0.6 },
      { id: 'cultivation_meal', name: 'Cultivation Meal', effect: { ppBoost: 1.1, duration: 300 }, chance: 0.3 },
      { id: 'special_dish', name: 'Special Dish', effect: { bondBonus: 5 }, chance: 0.1 }
    ],
    afkCompatible: false,
    dialogue: {
      start: [
        "Let's cook something delicious together~",
        "The secret ingredient is love! ...and also fish.",
        "I have a special recipe I want to try with you~"
      ],
      complete: [
        "It smells wonderful! Let's taste it together~",
        "Cooking with you makes everything taste better!",
        "We made something special together!"
      ]
    }
  },

  exploring: {
    id: 'exploring',
    name: 'Sect Exploration',
    emoji: '🗺️',
    description: 'Explore hidden areas together. May discover secrets!',
    duration: 1200, // 20 minutes
    bondGain: 30,
    preferredBy: ['nyanta', 'sakura'],
    unlockBond: 50,
    timeRestriction: null,
    producesItem: false,
    discoversSecrets: true,
    secretChance: 0.15,
    afkCompatible: true,
    dialogue: {
      start: [
        "Adventure awaits! Follow me~",
        "I know some hidden paths... let me show you.",
        "The sect holds many mysteries. Let's uncover them together!"
      ],
      complete: [
        "What an adventure! I've learned so much about you.",
        "Every corner of the sect feels different with you by my side~",
        "We should explore again soon!"
      ]
    }
  },

  hotSprings: {
    id: 'hotSprings',
    name: 'Hot Springs Visit',
    emoji: '♨️',
    description: 'Relax at the hot springs. Maximum bond gain!',
    duration: 600, // 10 minutes
    bondGain: 35,
    preferredBy: ['mochi', 'sakura', 'luna', 'nyanta', 'fluffington', 'meowlina'], // Everyone likes this
    unlockBond: 60,
    timeRestriction: null,
    requiresBuilding: 'hot_springs',
    producesItem: false,
    afkCompatible: true,
    dialogue: {
      start: [
        "The water is perfect... please, join me~",
        "Finally, a chance to relax together...",
        "The hot springs will soothe both body and soul~"
      ],
      complete: [
        "I feel so refreshed... and closer to you than ever.",
        "Such blissful relaxation... *happy sigh*",
        "We should make this a regular tradition~"
      ]
    }
  },

  training: {
    id: 'training',
    name: 'Joint Training',
    emoji: '💪',
    description: 'Practice cultivation techniques together.',
    duration: 480, // 8 minutes
    bondGain: 12,
    preferredBy: ['nyanta', 'meowlina'],
    unlockBond: 15,
    timeRestriction: null,
    producesItem: false,
    afkCompatible: false,
    grantsCultivationXP: true,
    xpAmount: 50,
    dialogue: {
      start: [
        "Let me teach you a new technique~",
        "Training together makes us both stronger!",
        "Focus your Qi... like this..."
      ],
      complete: [
        "Your technique has improved significantly!",
        "I can feel your cultivation advancing~",
        "You learn quickly. I'm impressed!"
      ]
    }
  },

  reading: {
    id: 'reading',
    name: 'Reading Together',
    emoji: '📚',
    description: 'Study ancient texts side by side.',
    duration: 540, // 9 minutes
    bondGain: 14,
    preferredBy: ['fluffington', 'luna'],
    unlockBond: 10,
    timeRestriction: null,
    producesItem: false,
    afkCompatible: true,
    grantsLoreFragment: true,
    loreChance: 0.2,
    dialogue: {
      start: [
        "I found an interesting scroll... shall we read it together?",
        "Knowledge shared is knowledge doubled~",
        "These ancient texts hold many secrets..."
      ],
      complete: [
        "A most enlightening session!",
        "I love discussing these ideas with you~",
        "The wisdom of the ancients flows through us both now."
      ]
    }
  },

  catWatching: {
    id: 'catWatching',
    name: 'Cat Watching',
    emoji: '🐱',
    description: 'Watch the cats play together. Simple but heartwarming.',
    duration: 360, // 6 minutes
    bondGain: 8,
    preferredBy: ['mochi', 'sakura', 'luna'],
    unlockBond: 0,
    timeRestriction: null,
    producesItem: false,
    afkCompatible: true,
    catHappinessBonus: 5,
    dialogue: {
      start: [
        "Look at them play! Aren't they adorable~",
        "Watching the cats always brings me peace...",
        "Each cat has its own personality. Let me tell you about them~"
      ],
      complete: [
        "The cats seem happier when we watch over them together.",
        "Simple moments like this are what I treasure most~",
        "Your presence calms both me and the cats."
      ]
    }
  }
};

// Activity preference multiplier when a waifu prefers an activity
let ACTIVITY_PREFERENCE_BONUS = 1.5;

// ============================================
// WAIFU SCHOOLS - Teaching and technique system
// ============================================
let WAIFU_SCHOOLS = {
  hospitalityArts: {
    id: 'hospitalityArts',
    name: 'Hospitality Arts',
    teacher: 'mochi',
    techniques: ['welcomingBoop', 'teaTimeHealing', 'guestProtection'],
    masteryExams: [
      { level: 1, type: 'serve_100_teas', reward: 'technique:welcomingBoop' },
      { level: 2, type: 'happiness_threshold', value: 1000, reward: 'technique:teaTimeHealing' },
      { level: 3, type: 'boss_fight', enemy: 'angry_customer', reward: 'technique:guestProtection' }
    ],
    schoolBonus: { catHappiness: 1.2 }
  },
  yinEnergyArts: {
    id: 'yinEnergyArts',
    name: 'Yin Energy Arts',
    teacher: 'luna',
    techniques: ['moonlightBoop', 'dreamWalking', 'nightVision'],
    masteryExams: [
      { level: 1, type: 'afk_hours', value: 24, reward: 'technique:moonlightBoop' },
      { level: 2, type: 'night_boops', value: 10000, reward: 'technique:dreamWalking' },
      { level: 3, type: 'dream_realm_clear', floor: 10, reward: 'technique:nightVision' }
    ],
    schoolBonus: { afkEfficiency: 1.3 }
  },
  adventureArts: {
    id: 'adventureArts',
    name: 'Adventure Arts',
    teacher: 'nyanta',
    techniques: ['treasureHunter', 'seaLegs', 'captainCommand'],
    masteryExams: [
      { level: 1, type: 'expeditions_complete', value: 10, reward: 'technique:treasureHunter' },
      { level: 2, type: 'rare_cats_found', value: 20, reward: 'technique:seaLegs' },
      { level: 3, type: 'boss_fight', enemy: 'kraken', reward: 'technique:captainCommand' }
    ],
    schoolBonus: { expeditionSpeed: 1.5 }
  },
  combatArts: {
    id: 'combatArts',
    name: 'Combat Arts',
    teacher: 'mei',
    techniques: ['fierceStrike', 'battleCry', 'warriorSpirit'],
    masteryExams: [
      { level: 1, type: 'dungeon_floors', value: 50, reward: 'technique:fierceStrike' },
      { level: 2, type: 'enemies_defeated', value: 10000, reward: 'technique:battleCry' },
      { level: 3, type: 'pagoda_floor', value: 100, reward: 'technique:warriorSpirit' }
    ],
    schoolBonus: { dungeonDamage: 1.25 }
  }
};

// ============================================
// ATTENTION BALANCE - Harmony/Jealousy system
// ============================================
let ATTENTION_BALANCE = {
  harmonyThreshold: 0.8,    // 80% balance = harmony
  jealousyThreshold: 0.3,   // <30% of average = jealousy
  harmonyBonus: { allBonds: 1.1 },
  jealousyPenalty: null     // No penalty, just funny dialogue
};

// Helper to check if it's currently night time
function isNightTime() {
  const hour = new Date().getHours();
  return hour >= 22 || hour < 6;
}

// ============================================
// WAIFU TEMPLATES - Full waifu definitions
// ============================================
let WAIFU_TEMPLATES = {
  mochi: {
    id: 'mochi',
    name: 'Mochi-chan',
    title: 'The Welcoming Dawn',
    role: 'Innkeeper of the Celestial Teahouse',
    cultivationStyle: 'Hospitality Arts',
    description: 'A warm and caring innkeeper who welcomes all cultivators to her teahouse. Her gentle presence makes even the grumpiest cats purr.',
    emoji: '🍡',
    color: '#FFB7C5',
    bonus: {
      type: 'bpMultiplier',
      value: 1.10,
      description: '+10% BP from all boops'
    },
    unlockCondition: { type: 'starter' },
    maxBondReward: 'lucky_teacup_cat',
    giftAffinities: {
      loves: ['rare_tea', 'jade_cup', 'silk_ribbon'],
      likes: ['yarn_ball', 'fish_treats'],
      neutral: ['catnip', 'bells'],
      dislikes: ['loud_toys', 'spicy_food']
    },
    dialogues: {
      greeting: [
        "Welcome back to the teahouse, cultivator~",
        "The cats have been waiting for you, nya~",
        "Ah! You've returned! Let me prepare some tea~"
      ],
      lowBond: [
        "Every guest is a friend. Every snoot, a blessing.",
        "Would you like some tea while you cultivate?",
        "The cats seem to like you already~",
        "Please, make yourself at home!"
      ],
      midBond: [
        "Your dedication to the sect is admirable!",
        "The cats speak highly of your booping technique~",
        "I've been practicing a new tea recipe... for you~",
        "Your presence brightens the teahouse!"
      ],
      highBond: [
        "You've become like family to us all.",
        "I... I made this tea specially for you. *blush*",
        "The teahouse feels empty when you're away...",
        "Promise me you'll always come back, okay?"
      ],
      maxBond: [
        "With you by my side, our teahouse will flourish forever.",
        "You are the greatest cultivator I have ever known, nya~",
        "My heart... it purrs only for you~",
        "Together, we shall boop every snoot in the Jianghu!"
      ],
      onBoop: [
        "Nice boop!",
        "Your Qi flows beautifully~",
        "The cats approve!",
        "Excellent form!"
      ],
      onCritical: [
        "AMAZING! Such power!",
        "The heavens smile upon that boop!",
        "Kyaa~! A critical strike!",
        "You've mastered the way of the snoot!"
      ]
    }
  },

  sakura: {
    id: 'sakura',
    name: 'Sakura Pawson',
    title: 'The Healing Petal',
    role: 'Medicine Master',
    cultivationStyle: 'Restoration Arts',
    description: 'A skilled healer who tends to sick and unhappy cats. Her herbal remedies can cure any ailment.',
    emoji: '🌸',
    color: '#FFB6C1',
    bonus: {
      type: 'catHealing',
      value: 1.25,
      description: '+25% cat happiness, heals unhappy cats'
    },
    unlockCondition: { type: 'catCount', value: 10 },
    maxBondReward: 'healing_blossom_cat',
    dialogues: {
      greeting: [
        "Ah, you're here. The cats need their check-up~",
        "Welcome! I was just preparing some medicine.",
        "Good timing! A patient just recovered!"
      ],
      lowBond: [
        "A healthy snoot is a happy snoot.",
        "Prevention is the best medicine.",
        "Have you been taking care of yourself?",
        "Your cats are in excellent health!"
      ],
      midBond: [
        "You care for your cats so well...",
        "I've developed a new treatment, thanks to your support!",
        "The sick cats always perk up when you visit~",
        "Your kindness is the best medicine."
      ],
      highBond: [
        "I want to heal not just cats... but your heart too.",
        "When you're hurt, I feel it as well...",
        "Let me take care of you, for once?",
        "You're my most important patient~"
      ],
      maxBond: [
        "My medicine is love. And it's all for you.",
        "Together, we'll heal every cat in the Jianghu!",
        "You are the cure I never knew I needed~",
        "Stay healthy... stay with me... forever."
      ]
    }
  },

  luna: {
    id: 'luna',
    name: 'Luna Whiskerbell',
    title: 'The Midnight Watcher',
    role: 'Night Cultivation Instructor',
    cultivationStyle: 'Yin Energy Arts',
    description: 'A mysterious night owl who teaches the secrets of cultivating while others sleep. Often found yawning.',
    emoji: '🌙',
    color: '#C4A7E7',
    bonus: {
      type: 'afkMultiplier',
      value: 1.50,
      description: '+50% offline gains'
    },
    unlockCondition: { type: 'afkTime', value: 86400 }, // 24 hours
    maxBondReward: 'moonlight_siamese',
    dialogues: {
      greeting: [
        "*yawn* Oh... you're here... good...",
        "The night shift... is peaceful...",
        "Mmm... the moon is bright tonight..."
      ],
      lowBond: [
        "While others sleep... we cultivate... *yawn*",
        "The moon... watches over our snoots...",
        "Darkness is... not so scary... with cats...",
        "Sleep is... also cultivation..."
      ],
      midBond: [
        "I saved you... a spot by the window...",
        "The stars... remind me of your eyes... *yawn*",
        "You make the night... less lonely...",
        "Stay... a little longer...?"
      ],
      highBond: [
        "I feel... most awake... when you're here...",
        "Stay with me... through the night...? *sleepy smile*",
        "My dreams... are always of you...",
        "The moon shines... brighter now..."
      ],
      maxBond: [
        "You are... my sun and my moon...",
        "I'll never sleep... as long as you need me...",
        "Every night... I wait for you... *yawn*",
        "Together... forever... under the stars..."
      ]
    }
  },

  nyanta: {
    id: 'nyanta',
    name: 'Captain Nyanta',
    title: 'The Sea Sovereign',
    role: 'Expedition Leader',
    cultivationStyle: 'Adventure Arts',
    description: 'A boisterous pirate captain who leads expeditions to find rare cats across the seven seas.',
    emoji: '🏴‍☠️',
    color: '#8B0000',
    bonus: {
      type: 'expeditionUnlock',
      value: true,
      description: 'Unlocks rare cat expeditions'
    },
    unlockCondition: { type: 'catCount', value: 50 },
    maxBondReward: 'kraken_kitty',
    dialogues: {
      greeting: [
        "YARR! Welcome aboard, matey!",
        "The seas be calm and full of snoots today!",
        "Ahoy! Ready for adventure?!"
      ],
      lowBond: [
        "The greatest snoots lie beyond the horizon!",
        "Adventure awaits! Set sail for boops!",
        "A true cultivator fears no storm!",
        "YARR! That's the spirit!"
      ],
      midBond: [
        "Ye've got the heart of a true sailor!",
        "I'd sail to the end of the world with ye!",
        "The crew speaks highly of ye, matey!",
        "Best first mate a captain could ask for!"
      ],
      highBond: [
        "Ye be the finest first mate a captain could ask for!",
        "Together we'll find the legendary treasures!",
        "The sea... reminds me of yer eyes...",
        "I've never felt this way about a landlubber before..."
      ],
      maxBond: [
        "Ye be my treasure, matey. The only one I need.",
        "Let's sail the Jianghu together... forever!",
        "My heart belongs to ye. YARR!",
        "Captain and First Mate... for eternity!"
      ]
    }
  },

  fluffington: {
    id: 'fluffington',
    name: 'Professor Fluffington',
    title: 'The Grand Scholar',
    role: 'Technique Researcher',
    cultivationStyle: 'Knowledge Arts',
    description: 'A brilliant scholar who has calculated the optimal snoot-booping techniques through rigorous study.',
    emoji: '📚',
    color: '#9370DB',
    bonus: {
      type: 'ppMultiplier',
      value: 2.0,
      description: '+100% PP generation'
    },
    unlockCondition: { type: 'allBasicUpgrades', value: true },
    maxBondReward: 'wisdom_sphinx',
    dialogues: {
      greeting: [
        "Ah, a fellow seeker of knowledge!",
        "I've made a fascinating discovery!",
        "The mathematics are quite clear..."
      ],
      lowBond: [
        "The mathematics of snoot-booping are profound indeed.",
        "My research suggests optimal boop angles of 45 degrees.",
        "Fascinating! Your Qi patterns are unique!",
        "Have you considered the theoretical implications?"
      ],
      midBond: [
        "Your progress validates my theories!",
        "I've been writing a paper... about you.",
        "The data suggests you're quite remarkable...",
        "Would you like to review my findings?"
      ],
      highBond: [
        "My calculations never accounted for... feelings.",
        "You've disproven my theory that love is illogical...",
        "The heart... defies mathematics...",
        "I find myself... wanting to study only you."
      ],
      maxBond: [
        "You are my greatest discovery.",
        "Love, I've concluded, is the ultimate technique.",
        "Let us research happiness... together.",
        "My heart's equation has only one variable: you."
      ]
    }
  },

  meowlina: {
    id: 'meowlina',
    name: 'Empress Meowlina',
    title: 'The Cat Sovereign',
    role: 'Supreme Leader',
    cultivationStyle: 'Imperial Arts',
    description: 'The hidden supreme ruler of all cats. Her favor transforms all snoots into legendary snoots.',
    emoji: '👑',
    color: '#FFD700',
    bonus: {
      type: 'legendaryBoost',
      value: true,
      description: 'ALL snoots become LEGENDARY SNOOTS'
    },
    unlockCondition: { type: 'maxBondAll', value: true },
    maxBondReward: 'imperial_sovereign',
    dialogues: {
      greeting: [
        "You dare approach the throne?",
        "Hmph. You again.",
        "The Empress acknowledges your presence."
      ],
      lowBond: [
        "You have earned my attention. Barely.",
        "Continue to prove yourself.",
        "The cats speak of you. Interesting.",
        "Do not waste my time."
      ],
      midBond: [
        "You show promise, cultivator.",
        "Perhaps you are worthy of my notice.",
        "I find myself... curious about you.",
        "You may approach closer. This once."
      ],
      highBond: [
        "No one has ever reached this level of my favor...",
        "You make me feel... less like an Empress.",
        "When you're away, the throne feels cold...",
        "I command you to... stay with me."
      ],
      maxBond: [
        "You have earned my favor. Now... boop.",
        "Rule by my side. This is not a request.",
        "The Empress... loves only you.",
        "Together, we shall reign over all snoots."
      ]
    }
  }
};

/**
 * WaifuSystem - Manages waifu masters and bonding
 */
class WaifuSystem {
  constructor() {
    this.unlockedWaifus = [];
    this.waifuStates = {};

    // Activity system state
    this.currentActivity = null;
    this.activityHistory = [];
    this.attentionTracker = {}; // Track attention given to each waifu
  }

  /**
   * Initialize with starter waifu
   */
  init() {
    this.unlockWaifu('mochi');
  }

  /**
   * Unlock a waifu
   */
  unlockWaifu(waifuId) {
    const template = WAIFU_TEMPLATES[waifuId];
    if (!template) return null;
    if (this.unlockedWaifus.find(w => w.id === waifuId)) return null;

    const waifu = {
      id: template.id,
      name: template.name,
      title: template.title,
      role: template.role,
      emoji: template.emoji,
      color: template.color,
      bonus: template.bonus,
      bondLevel: 0,
      giftsGiven: 0,
      dialoguesSeen: [],
      unlockedAt: Date.now()
    };

    this.unlockedWaifus.push(waifu);
    this.waifuStates[waifuId] = waifu;

    return waifu;
  }

  /**
   * Get waifu by ID
   */
  getWaifu(waifuId) {
    return this.waifuStates[waifuId] || null;
  }

  /**
   * Get all unlocked waifus
   */
  getUnlockedWaifus() {
    return this.unlockedWaifus;
  }

  /**
   * Get waifu template
   */
  getTemplate(waifuId) {
    return WAIFU_TEMPLATES[waifuId];
  }

  /**
   * Check if waifu unlock conditions are met
   */
  checkUnlockConditions(gameState) {
    const newUnlocks = [];

    for (const [id, template] of Object.entries(WAIFU_TEMPLATES)) {
      // Skip if already unlocked
      if (this.waifuStates[id]) continue;

      // Skip hidden waifus unless conditions met
      if (template.hidden && !this.checkHiddenCondition(template, gameState)) continue;

      // Skip transcendence-only waifus
      if (template.transcendenceOnly && !gameState.hasTranscended) continue;

      const condition = template.unlockCondition;
      if (!condition) continue;

      let shouldUnlock = false;

      switch (condition.type) {
        case 'starter':
          shouldUnlock = true;
          break;
        case 'catCount':
          shouldUnlock = (gameState.catCount || 0) >= condition.value;
          break;
        case 'afkTime':
          shouldUnlock = (gameState.totalAfkTime || 0) >= condition.value;
          break;
        case 'allBasicUpgrades':
          shouldUnlock = gameState.allBasicUpgradesPurchased;
          break;
        case 'maxBondAll':
          shouldUnlock = this.unlockedWaifus.length >= 5 &&
            this.unlockedWaifus.every(w => w.bondLevel >= 100);
          break;
        case 'pagodaFloor':
          shouldUnlock = (gameState.highestPagodaFloor || 0) >= condition.value;
          break;
        case 'building':
          shouldUnlock = this.checkBuildingCondition(condition, gameState);
          break;
        case 'meditationHours':
          shouldUnlock = (gameState.meditationHours || 0) >= condition.value;
          break;
        case 'prestigeCount':
          shouldUnlock = (gameState.prestigeCount || gameState.totalAscensions || 0) >= condition.value;
          break;
        case 'equipmentCrafted':
          shouldUnlock = (gameState.equipmentCrafted || 0) >= condition.value;
          break;
        case 'loreFragments':
          shouldUnlock = (gameState.loreFragmentsCollected || 0) >= condition.value;
          break;
        case 'defeatInTournament':
          shouldUnlock = (gameState.tournamentWins || 0) >= condition.times;
          break;
        case 'transcendence':
          shouldUnlock = gameState.hasTranscended === true;
          break;
        case 'gooseBoops':
          shouldUnlock = (gameState.gooseBoops || 0) >= condition.value &&
            (!condition.cobraChickenDefeated || gameState.cobraChickenDefeated);
          break;
      }

      if (shouldUnlock) {
        this.unlockWaifu(id);
        newUnlocks.push(template);
      }
    }

    return newUnlocks;
  }

  /**
   * Check building-based unlock condition
   */
  checkBuildingCondition(condition, gameState) {
    const buildingLevel = gameState.buildings?.[condition.building] || 0;
    return buildingLevel >= (condition.level || 1);
  }

  /**
   * Check if hidden waifu conditions are met
   */
  checkHiddenCondition(template, gameState) {
    const condition = template.unlockCondition;
    if (!condition) return false;

    // Hidden waifus need their specific conditions met
    switch (condition.type) {
      case 'loreFragments':
        return (gameState.loreFragmentsCollected || 0) >= condition.value;
      case 'defeatInTournament':
        return (gameState.tournamentWins || 0) >= condition.times;
      case 'transcendence':
        return gameState.hasTranscended === true;
      case 'gooseBoops':
        return (gameState.gooseBoops || 0) >= condition.value &&
          (!condition.cobraChickenDefeated || gameState.cobraChickenDefeated);
      default:
        return false;
    }
  }

  /**
   * Increase bond with a waifu
   */
  increaseBond(waifuId, amount) {
    const waifu = this.waifuStates[waifuId];
    if (!waifu) return;

    waifu.bondLevel = Math.min(100, waifu.bondLevel + amount);
    return waifu.bondLevel;
  }

  /**
   * Get dialogue based on bond level
   */
  getDialogue(waifuId, type = 'greeting') {
    const template = WAIFU_TEMPLATES[waifuId];
    const waifu = this.waifuStates[waifuId];
    if (!template || !waifu) return '';

    let dialoguePool;

    if (type === 'greeting' || type === 'onBoop' || type === 'onCritical') {
      dialoguePool = template.dialogues[type] || template.dialogues.greeting;
    } else {
      // Bond-based dialogue
      if (waifu.bondLevel >= 100) {
        dialoguePool = template.dialogues.maxBond;
      } else if (waifu.bondLevel >= 75) {
        dialoguePool = template.dialogues.highBond;
      } else if (waifu.bondLevel >= 40) {
        dialoguePool = template.dialogues.midBond;
      } else {
        dialoguePool = template.dialogues.lowBond;
      }
    }

    return dialoguePool[Math.floor(Math.random() * dialoguePool.length)];
  }

  /**
   * Get combined bonuses from all unlocked waifus
   */
  getCombinedBonuses() {
    const bonuses = {
      bpMultiplier: 1,
      ppMultiplier: 1,
      afkMultiplier: 1,
      catHappinessBonus: 0
    };

    for (const waifu of this.unlockedWaifus) {
      const template = WAIFU_TEMPLATES[waifu.id];
      if (!template) continue;

      switch (template.bonus.type) {
        case 'bpMultiplier':
          bonuses.bpMultiplier *= template.bonus.value;
          break;
        case 'ppMultiplier':
          bonuses.ppMultiplier *= template.bonus.value;
          break;
        case 'afkMultiplier':
          bonuses.afkMultiplier *= template.bonus.value;
          break;
        case 'catHealing':
          bonuses.catHappinessBonus += (template.bonus.value - 1);
          break;
      }
    }

    return bonuses;
  }

  /**
   * Get the primary/active waifu (first unlocked for now)
   */
  getActiveWaifu() {
    return this.unlockedWaifus[0] || null;
  }

  /**
   * Reset waifus for rebirth
   */
  reset() {
    this.unlockedWaifus = [];
    this.waifuStates = {};
    this.init(); // Re-init with starter waifu
  }

  /**
   * Unlock all waifus (for prestige perk)
   */
  unlockAll() {
    for (const waifuId of Object.keys(WAIFU_TEMPLATES)) {
      // Use .some() to check object array, and use unlockWaifu for consistency
      if (!this.unlockedWaifus.some(w => w.id === waifuId)) {
        this.unlockWaifu(waifuId);
      }
    }
  }

  // ============================================
  // BOND ACTIVITY SYSTEM
  // ============================================

  /**
   * Get available activities for a waifu based on bond level
   */
  getAvailableActivities(waifuId) {
    const waifu = this.waifuStates[waifuId];
    if (!waifu) return [];

    const available = [];
    for (const [activityId, activity] of Object.entries(BOND_ACTIVITIES)) {
      // Check bond level requirement
      if (waifu.bondLevel < activity.unlockBond) continue;

      // Check time restriction
      if (activity.timeRestriction === 'night' && !isNightTime()) continue;

      // Check building requirement (if applicable)
      if (activity.requiresBuilding) {
        const facilities = window.upgradeSystem?.getPurchasedUpgrades() || {};
        if (!facilities[activity.requiresBuilding]) continue;
      }

      // Check if activity is preferred by this waifu
      const isPreferred = activity.preferredBy.includes(waifuId);

      available.push({
        ...activity,
        isPreferred,
        effectiveBondGain: isPreferred ? Math.floor(activity.bondGain * ACTIVITY_PREFERENCE_BONUS) : activity.bondGain
      });
    }

    return available;
  }

  /**
   * Start an activity with a waifu
   */
  startActivity(waifuId, activityId) {
    // Check if already in an activity
    if (this.currentActivity) {
      return {
        success: false,
        error: 'Already in an activity! Complete or cancel the current one first.'
      };
    }

    const waifu = this.waifuStates[waifuId];
    const activity = BOND_ACTIVITIES[activityId];

    if (!waifu) {
      return { success: false, error: 'Waifu not found or not unlocked.' };
    }

    if (!activity) {
      return { success: false, error: 'Unknown activity.' };
    }

    // Check bond level requirement
    if (waifu.bondLevel < activity.unlockBond) {
      return {
        success: false,
        error: `Requires bond level ${activity.unlockBond}. Current: ${waifu.bondLevel}`
      };
    }

    // Check time restriction
    if (activity.timeRestriction === 'night' && !isNightTime()) {
      return {
        success: false,
        error: 'This activity is only available at night (22:00 - 06:00).'
      };
    }

    // Check building requirement
    if (activity.requiresBuilding) {
      const facilities = window.upgradeSystem?.getPurchasedUpgrades() || {};
      if (!facilities[activity.requiresBuilding]) {
        return {
          success: false,
          error: `Requires the ${activity.requiresBuilding.replace('_', ' ')} facility.`
        };
      }
    }

    // Calculate preference bonus
    const isPreferred = activity.preferredBy.includes(waifuId);
    const effectiveBondGain = isPreferred
      ? Math.floor(activity.bondGain * ACTIVITY_PREFERENCE_BONUS)
      : activity.bondGain;

    // Start the activity
    this.currentActivity = {
      waifuId,
      activityId,
      startTime: Date.now(),
      duration: activity.duration * 1000, // Convert to milliseconds
      bondGain: effectiveBondGain,
      isPreferred,
      completed: false
    };

    // Get start dialogue
    const template = WAIFU_TEMPLATES[waifuId];
    const startDialogue = activity.dialogue.start[
      Math.floor(Math.random() * activity.dialogue.start.length)
    ];

    return {
      success: true,
      activity: activity,
      waifuName: template.name,
      dialogue: startDialogue,
      duration: activity.duration,
      bondGain: effectiveBondGain,
      isPreferred
    };
  }

  /**
   * Get progress of current activity
   */
  getActivityProgress() {
    if (!this.currentActivity) return null;

    const elapsed = Date.now() - this.currentActivity.startTime;
    const progress = Math.min(1, elapsed / this.currentActivity.duration);
    const remaining = Math.max(0, this.currentActivity.duration - elapsed);

    return {
      ...this.currentActivity,
      activity: BOND_ACTIVITIES[this.currentActivity.activityId],
      waifu: WAIFU_TEMPLATES[this.currentActivity.waifuId],
      elapsed,
      progress,
      remaining,
      isComplete: progress >= 1,
      remainingFormatted: this.formatTime(remaining)
    };
  }

  /**
   * Complete the current activity and collect rewards
   */
  completeActivity() {
    if (!this.currentActivity) {
      return { success: false, error: 'No activity in progress.' };
    }

    const progress = this.getActivityProgress();

    if (!progress.isComplete) {
      return {
        success: false,
        error: 'Activity not yet complete!',
        remaining: progress.remainingFormatted
      };
    }

    const activity = BOND_ACTIVITIES[this.currentActivity.activityId];
    const waifu = this.waifuStates[this.currentActivity.waifuId];
    const template = WAIFU_TEMPLATES[this.currentActivity.waifuId];

    // Apply bond gain
    const bondGained = this.currentActivity.bondGain;
    const oldBondLevel = waifu.bondLevel;
    waifu.bondLevel = Math.min(100, waifu.bondLevel + bondGained);
    const newBondLevel = waifu.bondLevel;

    // Track attention
    this.attentionTracker[this.currentActivity.waifuId] =
      (this.attentionTracker[this.currentActivity.waifuId] || 0) + 1;

    // Generate rewards
    const rewards = {
      bondGained,
      oldBondLevel,
      newBondLevel
    };

    // Check for produced items (cooking)
    if (activity.producesItem && activity.itemPool) {
      const roll = Math.random();
      let cumulative = 0;
      for (const item of activity.itemPool) {
        cumulative += item.chance;
        if (roll <= cumulative) {
          rewards.item = item;
          // Add to inventory if gift system exists
          if (window.giftSystem && window.giftSystem.addToInventory) {
            window.giftSystem.addToInventory(item.id, 1);
          }
          break;
        }
      }
    }

    // Check for secret discovery (exploring)
    if (activity.discoversSecrets && Math.random() < activity.secretChance) {
      rewards.secretDiscovered = true;
      // Could trigger lore system here
      if (window.loreSystem && window.loreSystem.checkForFragmentDrop) {
        rewards.loreFragment = window.loreSystem.checkForFragmentDrop();
      }
    }

    // Check for cultivation XP (training)
    if (activity.grantsCultivationXP && activity.xpAmount) {
      rewards.cultivationXP = activity.xpAmount;
      if (window.cultivationSystem && window.cultivationSystem.addXP) {
        window.cultivationSystem.addXP(activity.xpAmount);
      }
    }

    // Check for lore fragment (reading)
    if (activity.grantsLoreFragment && Math.random() < activity.loreChance) {
      rewards.loreFragment = true;
    }

    // Check for cat happiness bonus (cat watching)
    if (activity.catHappinessBonus) {
      rewards.catHappinessBonus = activity.catHappinessBonus;
      // Apply to cats if system exists (use boostHappiness method)
      if (window.catSystem && window.catSystem.boostHappiness) {
        window.catSystem.boostHappiness(activity.catHappinessBonus);
      }
    }

    // Get completion dialogue
    const completeDialogue = activity.dialogue.complete[
      Math.floor(Math.random() * activity.dialogue.complete.length)
    ];

    // Record in history
    this.activityHistory.push({
      waifuId: this.currentActivity.waifuId,
      activityId: this.currentActivity.activityId,
      completedAt: Date.now(),
      bondGained
    });

    // Keep only last 50 activities in history
    if (this.activityHistory.length > 50) {
      this.activityHistory = this.activityHistory.slice(-50);
    }

    // Clear current activity
    this.currentActivity = null;

    return {
      success: true,
      waifuName: template.name,
      waifuEmoji: template.emoji,
      activityName: activity.name,
      dialogue: completeDialogue,
      rewards
    };
  }

  /**
   * Cancel the current activity (no rewards)
   */
  cancelActivity() {
    if (!this.currentActivity) {
      return { success: false, error: 'No activity in progress.' };
    }

    const activity = BOND_ACTIVITIES[this.currentActivity.activityId];
    const template = WAIFU_TEMPLATES[this.currentActivity.waifuId];

    this.currentActivity = null;

    return {
      success: true,
      message: `Cancelled ${activity.name} with ${template.name}.`
    };
  }

  /**
   * Check if an activity is currently in progress
   */
  isInActivity() {
    return this.currentActivity !== null;
  }

  /**
   * Get activity history for a specific waifu
   */
  getWaifuActivityHistory(waifuId) {
    return this.activityHistory.filter(h => h.waifuId === waifuId);
  }

  /**
   * Calculate harmony/jealousy status based on attention distribution
   */
  getHarmonyStatus() {
    const unlockedCount = this.unlockedWaifus.length;
    if (unlockedCount <= 1) return { status: 'harmony', bonus: {} };

    const values = Object.values(this.attentionTracker);
    if (values.length === 0) return { status: 'neutral', bonus: {} };

    const avg = values.reduce((a, b) => a + b, 0) / unlockedCount;
    const minRatio = Math.min(...values) / (avg || 1);

    // Use ATTENTION_BALANCE settings (can be loaded from JSON)
    const harmonyThreshold = ATTENTION_BALANCE.harmonyThreshold || 0.8;
    const jealousyThreshold = ATTENTION_BALANCE.jealousyThreshold || 0.3;
    const harmonyBonus = ATTENTION_BALANCE.harmonyBonus || { allBonds: 1.1 };

    if (minRatio >= harmonyThreshold) {
      return { status: 'harmony', bonus: harmonyBonus, message: 'All waifus are happy with your attention!' };
    } else if (minRatio < jealousyThreshold) {
      const neglected = Object.entries(this.attentionTracker)
        .filter(([_, v]) => v / (avg || 1) < jealousyThreshold)
        .map(([k, _]) => k);
      return {
        status: 'jealousy',
        neglectedWaifus: neglected,
        penalty: ATTENTION_BALANCE.jealousyPenalty,
        message: 'Some waifus feel neglected...'
      };
    }
    return { status: 'neutral', bonus: {} };
  }

  /**
   * Format time in MM:SS
   */
  formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      unlockedWaifus: this.unlockedWaifus,
      waifuStates: this.waifuStates,
      currentActivity: this.currentActivity,
      activityHistory: this.activityHistory,
      attentionTracker: this.attentionTracker
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.unlockedWaifus) {
      this.unlockedWaifus = data.unlockedWaifus;
    }
    if (data.waifuStates) {
      this.waifuStates = data.waifuStates;
    }
    if (data.currentActivity) {
      this.currentActivity = data.currentActivity;
    }
    if (data.activityHistory) {
      this.activityHistory = data.activityHistory;
    }
    if (data.attentionTracker) {
      this.attentionTracker = data.attentionTracker;
    }
  }

  /**
   * Check and auto-complete activity if time has passed (for AFK returns)
   */
  checkPendingActivity() {
    if (!this.currentActivity) return null;

    const progress = this.getActivityProgress();
    if (progress.isComplete) {
      return this.completeActivity();
    }

    return null;
  }

  // ============================================
  // SCHOOL SYSTEM METHODS
  // ============================================

  /**
   * Get waifu's teaching school
   */
  getWaifuSchool(waifuId) {
    const template = WAIFU_TEMPLATES[waifuId];
    if (!template || !template.school) return null;
    return WAIFU_SCHOOLS[template.school] || null;
  }

  /**
   * Get all available schools
   */
  getAllSchools() {
    return { ...WAIFU_SCHOOLS };
  }

  /**
   * Get school by ID
   */
  getSchool(schoolId) {
    return WAIFU_SCHOOLS[schoolId] || null;
  }

  /**
   * Check if player can take mastery exam
   */
  canTakeMasteryExam(waifuId, examLevel, gameState) {
    const waifu = this.waifuStates[waifuId];
    if (!waifu) return { canTake: false, reason: 'Waifu not unlocked' };

    const school = this.getWaifuSchool(waifuId);
    if (!school) return { canTake: false, reason: 'Waifu has no school' };

    const exam = school.masteryExams?.find(e => e.level === examLevel);
    if (!exam) return { canTake: false, reason: 'Exam not found' };

    // Check bond level (need at least 25 per exam level)
    const requiredBond = examLevel * 25;
    if (waifu.bondLevel < requiredBond) {
      return { canTake: false, reason: `Requires bond level ${requiredBond}` };
    }

    return { canTake: true, exam };
  }

  /**
   * Get waifu cultivation info for helping them breakthrough
   */
  getWaifuCultivation(waifuId) {
    const template = WAIFU_TEMPLATES[waifuId];
    if (!template) return null;
    return template.cultivation || null;
  }

  /**
   * Check if player can help waifu cultivate
   */
  canHelpCultivate(waifuId, gameState) {
    const waifu = this.waifuStates[waifuId];
    if (!waifu) return { canHelp: false, reason: 'Waifu not unlocked' };

    const template = WAIFU_TEMPLATES[waifuId];
    if (!template.cultivation?.canCultivate) {
      return { canHelp: false, reason: 'Waifu cannot cultivate further' };
    }

    // Requires high bond (75+)
    if (waifu.bondLevel < 75) {
      return { canHelp: false, reason: 'Requires bond level 75+' };
    }

    return { canHelp: true, reward: template.cultivation.helpReward };
  }
}

// ============================================
// DATA LOADER INTEGRATION
// ============================================

/**
 * Initialize waifu data from JSON if available
 * Falls back to hardcoded data if dataLoader not ready
 */
function initWaifuDataFromJSON() {
  if (!window.dataLoader) {
    console.log('[WaifuSystem] No dataLoader found, using hardcoded waifu data');
    return;
  }

  dataLoader.onReady(() => {
    const waifuData = dataLoader.get('waifus');
    if (!waifuData) {
      console.log('[WaifuSystem] No waifu data in dataLoader, using hardcoded values');
      return;
    }

    console.log('[WaifuSystem] Loading waifu data from JSON...');

    // Update WAIFU_TEMPLATES (waifus object in JSON)
    if (waifuData.waifus) {
      // Merge JSON waifus with hardcoded, JSON takes precedence
      const jsonWaifus = waifuData.waifus;
      for (const [waifuId, waifuDef] of Object.entries(jsonWaifus)) {
        // Convert JSON format to match expected WAIFU_TEMPLATES structure
        const template = convertJSONWaifuToTemplate(waifuDef);
        if (template) {
          WAIFU_TEMPLATES[waifuId] = template;
        }
      }
      console.log(`[WaifuSystem] Loaded ${Object.keys(jsonWaifus).length} waifus from JSON`);
    }

    // Update BOND_ACTIVITIES
    if (waifuData.bondActivities) {
      for (const [activityId, activityDef] of Object.entries(waifuData.bondActivities)) {
        // Merge with existing activity or add new one
        // Preserve hardcoded dialogue if JSON doesn't have it
        const existingActivity = BOND_ACTIVITIES[activityId];
        BOND_ACTIVITIES[activityId] = {
          ...existingActivity,
          ...activityDef,
          // Ensure dialogue is preserved from hardcoded if not in JSON
          dialogue: activityDef.dialogue || (existingActivity ? existingActivity.dialogue : null)
        };
      }
      console.log(`[WaifuSystem] Loaded ${Object.keys(waifuData.bondActivities).length} activities from JSON`);
    }

    // Update WAIFU_SCHOOLS
    if (waifuData.waifuSchools) {
      for (const [schoolId, schoolDef] of Object.entries(waifuData.waifuSchools)) {
        WAIFU_SCHOOLS[schoolId] = schoolDef;
      }
      console.log(`[WaifuSystem] Loaded ${Object.keys(waifuData.waifuSchools).length} schools from JSON`);
    }

    // Update ATTENTION_BALANCE settings
    if (waifuData.attentionBalance) {
      ATTENTION_BALANCE = {
        ...ATTENTION_BALANCE,
        ...waifuData.attentionBalance
      };
      console.log('[WaifuSystem] Loaded attention balance settings from JSON');
    }

    // Update exports after loading
    window.WAIFU_TEMPLATES = WAIFU_TEMPLATES;
    window.BOND_ACTIVITIES = BOND_ACTIVITIES;
    window.WAIFU_SCHOOLS = WAIFU_SCHOOLS;
    window.ATTENTION_BALANCE = ATTENTION_BALANCE;

    console.log('[WaifuSystem] Data loading complete');
  });
}

/**
 * Convert JSON waifu format to WAIFU_TEMPLATES format
 * Handles differences between JSON structure and expected template structure
 */
function convertJSONWaifuToTemplate(jsonWaifu) {
  if (!jsonWaifu || !jsonWaifu.id) return null;

  // Build the template object with all expected fields
  const template = {
    id: jsonWaifu.id,
    name: jsonWaifu.name,
    title: jsonWaifu.title,
    role: jsonWaifu.role,
    cultivationStyle: jsonWaifu.school ? `${jsonWaifu.school.charAt(0).toUpperCase() + jsonWaifu.school.slice(1)} Arts` : 'Unknown Arts',
    description: jsonWaifu.description || `A mysterious master of the ${jsonWaifu.school || 'unknown'} school.`,
    emoji: jsonWaifu.emoji || getDefaultEmoji(jsonWaifu.personality),
    color: jsonWaifu.color || '#FFFFFF',
    bonus: jsonWaifu.bonus || { type: 'bpMultiplier', value: 1.0 },
    unlockCondition: normalizeUnlockCondition(jsonWaifu.unlockCondition),
    maxBondReward: jsonWaifu.maxBondReward,
    giftAffinities: jsonWaifu.giftAffinities || {
      loves: [],
      likes: [],
      neutral: [],
      dislikes: []
    },
    // Convert voiceLines to dialogues format if needed
    dialogues: convertVoiceLinesToDialogues(jsonWaifu.voiceLines, jsonWaifu.personality),
    // Additional fields from JSON
    school: jsonWaifu.school,
    element: jsonWaifu.element,
    personality: jsonWaifu.personality,
    hidden: jsonWaifu.hidden || false,
    antiWaifu: jsonWaifu.antiWaifu || false,
    transcendenceOnly: jsonWaifu.transcendenceOnly || false,
    cultivation: jsonWaifu.cultivation,
    sprite: jsonWaifu.sprite,
    specialDialogue: jsonWaifu.specialDialogue
  };

  return template;
}

/**
 * Normalize unlock condition from JSON format
 */
function normalizeUnlockCondition(condition) {
  if (!condition) return { type: 'starter' };
  if (condition === 'starter') return { type: 'starter' };
  if (typeof condition === 'object') return condition;
  return { type: 'starter' };
}

/**
 * Convert voiceLines from JSON to dialogues format
 */
function convertVoiceLinesToDialogues(voiceLines, personality) {
  // Default dialogues structure
  const defaultDialogues = {
    greeting: ['Welcome, cultivator.'],
    lowBond: ['Let us train together.'],
    midBond: ['You show great promise.'],
    highBond: ['I enjoy your company.'],
    maxBond: ['You mean everything to me.'],
    onBoop: ['Nice boop!'],
    onCritical: ['Amazing!']
  };

  if (!voiceLines) return defaultDialogues;

  // Build dialogues from voiceLines
  const dialogues = { ...defaultDialogues };

  // Convert greeting object to array
  if (voiceLines.greeting) {
    if (typeof voiceLines.greeting === 'object') {
      dialogues.greeting = Object.values(voiceLines.greeting);
    } else if (Array.isArray(voiceLines.greeting)) {
      dialogues.greeting = voiceLines.greeting;
    }
  }

  // Map voice lines to bond levels
  if (voiceLines.jealous) {
    dialogues.midBond = [...(dialogues.midBond || []), voiceLines.jealous];
  }
  if (voiceLines.harmony) {
    dialogues.highBond = [...(dialogues.highBond || []), voiceLines.harmony];
  }
  if (voiceLines.maxBond) {
    dialogues.maxBond = [voiceLines.maxBond];
  }

  return dialogues;
}

/**
 * Get default emoji based on personality
 */
function getDefaultEmoji(personality) {
  const emojiMap = {
    warm: '🍡',
    sleepy: '🌙',
    boisterous: '🏴‍☠️',
    fierce: '⚔️',
    gentle: '🌸',
    serene: '❄️',
    elegant: '💎',
    passionate: '🔥',
    wise: '📜',
    tsundere: '😤',
    mysterious: '❓',
    chaotic: '🦢'
  };
  return emojiMap[personality] || '✨';
}

// Initialize data from JSON when script loads
initWaifuDataFromJSON();

// ============================================
// EXPORTS
// ============================================
window.WAIFU_TEMPLATES = WAIFU_TEMPLATES;
window.BOND_ACTIVITIES = BOND_ACTIVITIES;
window.WAIFU_SCHOOLS = WAIFU_SCHOOLS;
window.ATTENTION_BALANCE = ATTENTION_BALANCE;
window.WaifuSystem = WaifuSystem;
window.initWaifuDataFromJSON = initWaifuDataFromJSON;
