/**
 * waifus.js - The Six Immortal Masters
 * "A waifu's guidance is worth ten thousand boops."
 */

// Waifu Templates
const WAIFU_TEMPLATES = {
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

      const condition = template.unlockCondition;
      let shouldUnlock = false;

      switch (condition.type) {
        case 'starter':
          shouldUnlock = true;
          break;
        case 'catCount':
          shouldUnlock = gameState.catCount >= condition.value;
          break;
        case 'afkTime':
          shouldUnlock = gameState.totalAfkTime >= condition.value;
          break;
        case 'allBasicUpgrades':
          shouldUnlock = gameState.allBasicUpgradesPurchased;
          break;
        case 'maxBondAll':
          shouldUnlock = this.unlockedWaifus.length >= 5 &&
            this.unlockedWaifus.every(w => w.bondLevel >= 100);
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
      if (!this.unlockedWaifus.includes(waifuId)) {
        this.unlockedWaifus.push(waifuId);
        this.waifuStates[waifuId] = {
          bondLevel: 0,
          unlocked: true
        };
      }
    }
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      unlockedWaifus: this.unlockedWaifus,
      waifuStates: this.waifuStates
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
  }
}

// Export
window.WAIFU_TEMPLATES = WAIFU_TEMPLATES;
window.WaifuSystem = WaifuSystem;
