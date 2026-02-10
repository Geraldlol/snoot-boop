/**
 * gifts.js - Waifu Gift System
 * "A token of affection speaks louder than a thousand boops."
 */

// Gift Items
const GIFT_ITEMS = {
  // Common Gifts (purchasable with BP)
  yarn_ball: {
    id: 'yarn_ball',
    name: 'Yarn Ball',
    description: 'A simple but beloved toy.',
    emoji: '🧶',
    rarity: 'common',
    cost: { bp: 100 },
    bondValue: 2
  },
  fish_treats: {
    id: 'fish_treats',
    name: 'Fish Treats',
    description: 'Dried fish snacks. Cats and waifus both approve.',
    emoji: '🐟',
    rarity: 'common',
    cost: { bp: 150 },
    bondValue: 3
  },
  catnip: {
    id: 'catnip',
    name: 'Fresh Catnip',
    description: 'Locally grown, very potent.',
    emoji: '🌿',
    rarity: 'common',
    cost: { bp: 200 },
    bondValue: 3
  },
  bells: {
    id: 'bells',
    name: 'Silver Bells',
    description: 'Jingle softly in the wind.',
    emoji: '🔔',
    rarity: 'common',
    cost: { bp: 250 },
    bondValue: 4
  },

  // Uncommon Gifts (purchasable with PP)
  silk_ribbon: {
    id: 'silk_ribbon',
    name: 'Silk Ribbon',
    description: 'Finest silk from the Eastern markets.',
    emoji: '🎀',
    rarity: 'uncommon',
    cost: { pp: 500 },
    bondValue: 8
  },
  rare_tea: {
    id: 'rare_tea',
    name: 'Rare Mountain Tea',
    description: 'Grown on misty peaks, steeped in tradition.',
    emoji: '🍵',
    rarity: 'uncommon',
    cost: { pp: 750 },
    bondValue: 10
  },
  poetry_scroll: {
    id: 'poetry_scroll',
    name: 'Poetry Scroll',
    description: 'Ancient verses about snoots and cultivation.',
    emoji: '📜',
    rarity: 'uncommon',
    cost: { pp: 1000 },
    bondValue: 12
  },

  // Rare Gifts (purchasable with Jade Catnip)
  jade_cup: {
    id: 'jade_cup',
    name: 'Jade Tea Cup',
    description: 'Carved from a single piece of imperial jade.',
    emoji: '🍵',
    rarity: 'rare',
    cost: { jadeCatnip: 1 },
    bondValue: 25
  },
  celestial_flower: {
    id: 'celestial_flower',
    name: 'Celestial Flower',
    description: 'Blooms only under the full moon.',
    emoji: '🌸',
    rarity: 'rare',
    cost: { jadeCatnip: 2 },
    bondValue: 35
  },
  ancient_scroll: {
    id: 'ancient_scroll',
    name: 'Ancient Technique Scroll',
    description: 'Contains a secret cultivation technique.',
    emoji: '📿',
    rarity: 'rare',
    cost: { jadeCatnip: 3 },
    bondValue: 50
  },

  // Legendary Gifts (special drops only)
  golden_hairpin: {
    id: 'golden_hairpin',
    name: 'Golden Phoenix Hairpin',
    description: 'Once worn by an empress. Priceless.',
    emoji: '📍',
    rarity: 'legendary',
    cost: null, // Cannot be purchased
    bondValue: 100,
    special: true
  },
  destiny_thread: {
    id: 'destiny_thread',
    name: 'Destiny Thread',
    description: 'A thread of fate that binds two souls.',
    emoji: '🧵',
    rarity: 'legendary',
    cost: { destinyThreads: 1 },
    bondValue: 75,
    special: true
  }
};

// Gift affinities by waifu
const WAIFU_GIFT_AFFINITIES = {
  mochi: {
    loves: ['rare_tea', 'jade_cup', 'silk_ribbon'],
    likes: ['yarn_ball', 'fish_treats', 'bells'],
    neutral: ['catnip', 'poetry_scroll'],
    dislikes: []
  },
  sakura: {
    loves: ['celestial_flower', 'rare_tea', 'silk_ribbon'],
    likes: ['catnip', 'poetry_scroll'],
    neutral: ['yarn_ball', 'fish_treats'],
    dislikes: ['bells']
  },
  luna: {
    loves: ['celestial_flower', 'poetry_scroll', 'ancient_scroll'],
    likes: ['rare_tea', 'silk_ribbon'],
    neutral: ['catnip', 'yarn_ball'],
    dislikes: ['bells']
  },
  nyanta: {
    loves: ['fish_treats', 'ancient_scroll', 'jade_cup'],
    likes: ['yarn_ball', 'bells'],
    neutral: ['silk_ribbon', 'rare_tea'],
    dislikes: ['poetry_scroll']
  },
  fluffington: {
    loves: ['poetry_scroll', 'ancient_scroll', 'rare_tea'],
    likes: ['jade_cup', 'celestial_flower'],
    neutral: ['silk_ribbon', 'catnip'],
    dislikes: ['yarn_ball', 'bells']
  },
  meowlina: {
    loves: ['golden_hairpin', 'jade_cup', 'celestial_flower'],
    likes: ['silk_ribbon', 'rare_tea', 'ancient_scroll'],
    neutral: ['poetry_scroll'],
    dislikes: ['yarn_ball', 'fish_treats', 'catnip', 'bells']
  }
};

// Gift reaction dialogues
const GIFT_REACTIONS = {
  loves: [
    "This is exactly what I wanted! How did you know?!",
    "I... I'm so happy! Thank you!",
    "My heart is overflowing with joy~",
    "You truly understand me..."
  ],
  likes: [
    "Oh, how thoughtful of you!",
    "This is lovely, thank you~",
    "You remembered! I'm touched.",
    "A wonderful gift!"
  ],
  neutral: [
    "Thank you for thinking of me.",
    "I appreciate the gesture.",
    "This is... nice. Thank you.",
    "How kind of you."
  ],
  dislikes: [
    "Oh... um... thank you...?",
    "I... see. Well, it's the thought that counts.",
    "Perhaps this would suit someone else better...",
    "*forced smile*"
  ]
};

/**
 * GiftSystem - Manages gift giving to waifus
 */
class GiftSystem {
  constructor() {
    this.inventory = {};
    this.giftHistory = [];
  }

  /**
   * Initialize inventory
   */
  init() {
    // Start with a few basic gifts
    this.addToInventory('yarn_ball', 3);
    this.addToInventory('fish_treats', 2);
  }

  /**
   * Add items to inventory
   */
  addToInventory(itemId, quantity = 1) {
    if (!this.inventory[itemId]) {
      this.inventory[itemId] = 0;
    }
    this.inventory[itemId] += quantity;
  }

  /**
   * Remove items from inventory
   */
  removeFromInventory(itemId, quantity = 1) {
    if (!this.inventory[itemId] || this.inventory[itemId] < quantity) {
      return false;
    }
    this.inventory[itemId] -= quantity;
    if (this.inventory[itemId] <= 0) {
      delete this.inventory[itemId];
    }
    return true;
  }

  /**
   * Get inventory count for an item
   */
  getInventoryCount(itemId) {
    return this.inventory[itemId] || 0;
  }

  /**
   * Check if player can afford a gift
   */
  canAfford(itemId, gameState) {
    const item = GIFT_ITEMS[itemId];
    if (!item || !item.cost) return false;

    if (item.cost.bp && gameState.boopPoints < item.cost.bp) return false;
    if (item.cost.pp && gameState.purrPower < item.cost.pp) return false;
    if (item.cost.jadeCatnip && gameState.jadeCatnip < item.cost.jadeCatnip) return false;
    if (item.cost.destinyThreads && gameState.destinyThreads < item.cost.destinyThreads) return false;

    return true;
  }

  /**
   * Purchase a gift
   */
  purchaseGift(itemId, gameState) {
    const item = GIFT_ITEMS[itemId];
    if (!item || !item.cost) return false;
    if (!this.canAfford(itemId, gameState)) return false;

    // Deduct cost (with safety checks to prevent negative values)
    if (item.cost.bp) gameState.boopPoints = Math.max(0, gameState.boopPoints - item.cost.bp);
    if (item.cost.pp) gameState.purrPower = Math.max(0, gameState.purrPower - item.cost.pp);
    if (item.cost.jadeCatnip) gameState.jadeCatnip = Math.max(0, gameState.jadeCatnip - item.cost.jadeCatnip);
    if (item.cost.destinyThreads) gameState.destinyThreads = Math.max(0, gameState.destinyThreads - item.cost.destinyThreads);

    // Add to inventory
    this.addToInventory(itemId);

    return true;
  }

  /**
   * Give a gift to a waifu
   */
  giveGift(itemId, waifuId, waifuSystem) {
    if (!this.removeFromInventory(itemId)) return null;

    const item = GIFT_ITEMS[itemId];
    const affinity = this.getAffinity(itemId, waifuId);

    // Calculate bond increase
    let bondIncrease = item.bondValue;
    let multiplier = 1;

    switch (affinity) {
      case 'loves':
        multiplier = 2.0;
        break;
      case 'likes':
        multiplier = 1.5;
        break;
      case 'neutral':
        multiplier = 1.0;
        break;
      case 'dislikes':
        multiplier = 0.25;
        break;
    }

    bondIncrease = Math.floor(bondIncrease * multiplier);

    // Apply bond increase
    waifuSystem.increaseBond(waifuId, bondIncrease);

    // Play gift sound based on affinity
    if (window.audioSystem) {
      if (affinity === 'loves') {
        window.audioSystem.playSFX('achievement');
      } else if (affinity === 'likes' || affinity === 'neutral') {
        window.audioSystem.playSFX('purchase');
      } else {
        window.audioSystem.playSFX('error');
      }
    }

    // Get reaction dialogue
    const reactions = GIFT_REACTIONS[affinity];
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];

    // Log gift
    this.giftHistory.push({
      itemId,
      waifuId,
      affinity,
      bondIncrease,
      timestamp: Date.now()
    });

    return {
      item,
      affinity,
      bondIncrease,
      reaction
    };
  }

  /**
   * Get affinity level for a gift/waifu combo
   */
  getAffinity(itemId, waifuId) {
    const affinities = WAIFU_GIFT_AFFINITIES[waifuId];
    if (!affinities) return 'neutral';

    if (affinities.loves?.includes(itemId)) return 'loves';
    if (affinities.likes?.includes(itemId)) return 'likes';
    if (affinities.dislikes?.includes(itemId)) return 'dislikes';
    return 'neutral';
  }

  /**
   * Get all purchasable gifts
   */
  getPurchasableGifts() {
    return Object.values(GIFT_ITEMS).filter(g => g.cost !== null);
  }

  /**
   * Get gifts by rarity
   */
  getGiftsByRarity(rarity) {
    return Object.values(GIFT_ITEMS).filter(g => g.rarity === rarity);
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      inventory: this.inventory,
      giftHistory: this.giftHistory.slice(-100) // Keep last 100 gifts
    };
  }

  /**
   * Load from save
   */
  deserialize(data) {
    if (data.inventory) {
      this.inventory = data.inventory;
    }
    if (data.giftHistory) {
      this.giftHistory = data.giftHistory;
    }
  }
}

// Export
window.GIFT_ITEMS = GIFT_ITEMS;
window.WAIFU_GIFT_AFFINITIES = WAIFU_GIFT_AFFINITIES;
window.GIFT_REACTIONS = GIFT_REACTIONS;
window.GiftSystem = GiftSystem;
