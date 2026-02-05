/**
 * cats.js - Martial Cat Collection System
 * "In the world of Jianghu, the mightiest warrior collects the fluffiest cats."
 */

// Cat Cultivation Realms
const REALMS = {
  mortal: {
    id: 'mortal',
    name: 'Mortal',
    dropRate: 0.60,
    ppMultiplier: 1,
    color: '#A0A0A0',
    description: 'Initiate Snoot'
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    dropRate: 0.25,
    ppMultiplier: 2,
    color: '#8B4513',
    description: 'Tempered Snoot'
  },
  sky: {
    id: 'sky',
    name: 'Sky',
    dropRate: 0.10,
    ppMultiplier: 5,
    color: '#87CEEB',
    description: 'Enlightened Snoot'
  },
  heaven: {
    id: 'heaven',
    name: 'Heaven',
    dropRate: 0.04,
    ppMultiplier: 15,
    color: '#FFD700',
    description: 'Celestial Snoot'
  },
  divine: {
    id: 'divine',
    name: 'Divine',
    dropRate: 0.01,
    ppMultiplier: 50,
    color: '#FFFFFF',
    description: 'LEGENDARY SNOOT'
  }
};

// Martial Arts Schools
const SCHOOLS = {
  shaolin: { id: 'shaolin', name: 'Shaolin', bonus: 'stability', color: '#FF8C00', emoji: '🥋' },
  wudang: { id: 'wudang', name: 'Wudang', bonus: 'grace', color: '#4682B4', emoji: '☯️' },
  emei: { id: 'emei', name: 'Emei', bonus: 'beauty', color: '#FF69B4', emoji: '🌸' },
  beggar: { id: 'beggar', name: 'Beggar', bonus: 'resourcefulness', color: '#8B4513', emoji: '🥢' },
  scholar: { id: 'scholar', name: 'Scholar', bonus: 'wisdom', color: '#9370DB', emoji: '📚' },
  royal_guard: { id: 'royal_guard', name: 'Royal Guard', bonus: 'loyalty', color: '#FFD700', emoji: '🛡️' },
  wanderer: { id: 'wanderer', name: 'Wanderer', bonus: 'mystery', color: '#708090', emoji: '🌙' },
  divine: { id: 'divine', name: 'Divine', bonus: 'transcendence', color: '#FFFFFF', emoji: '✨' }
};

// Cat Templates - The cats that can be recruited
const CAT_TEMPLATES = {
  // === MORTAL REALM ===
  tabby_disciple: {
    id: 'tabby_disciple',
    name: 'Tabby Disciple',
    school: 'shaolin',
    realm: 'mortal',
    description: 'A humble tabby beginning the path of cultivation.',
    baseStats: {
      snootMeridians: 1.0,
      innerPurr: 1.0,
      floofArmor: 1.0,
      zoomieSteps: 1.0,
      loafMastery: 1.0
    },
    emoji: '🐱',
    quotes: ["Mrrp.", "*practices paw strikes*"]
  },
  tuxedo_monk: {
    id: 'tuxedo_monk',
    name: 'Tuxedo Monk',
    school: 'shaolin',
    realm: 'mortal',
    description: 'Always dressed for the occasion. Very formal boops.',
    baseStats: {
      snootMeridians: 1.1,
      innerPurr: 1.2,
      floofArmor: 0.9,
      zoomieSteps: 0.8,
      loafMastery: 1.3
    },
    emoji: '🐈‍⬛',
    quotes: ["*adjusts invisible tie*", "Dignity in all things."]
  },
  orange_wanderer: {
    id: 'orange_wanderer',
    name: 'Orange Wanderer',
    school: 'wanderer',
    realm: 'mortal',
    description: 'Shares one brain cell with all orange cats. Uses it wisely.',
    baseStats: {
      snootMeridians: 1.3,
      innerPurr: 0.8,
      floofArmor: 1.2,
      zoomieSteps: 1.4,
      loafMastery: 0.7
    },
    emoji: '🧡',
    quotes: ["*the brain cell has left*", "FOOD?!"]
  },
  calico_initiate: {
    id: 'calico_initiate',
    name: 'Calico Initiate',
    school: 'emei',
    realm: 'mortal',
    description: 'Three colors, three times the attitude.',
    baseStats: {
      snootMeridians: 1.0,
      innerPurr: 1.1,
      floofArmor: 1.1,
      zoomieSteps: 1.0,
      loafMastery: 1.0
    },
    emoji: '🎨',
    quotes: ["*judges silently*", "I suppose you may boop."]
  },
  grey_student: {
    id: 'grey_student',
    name: 'Grey Student',
    school: 'scholar',
    realm: 'mortal',
    description: 'Studies the ancient texts. Mostly naps on them.',
    baseStats: {
      snootMeridians: 0.9,
      innerPurr: 1.3,
      floofArmor: 0.9,
      zoomieSteps: 0.8,
      loafMastery: 1.4
    },
    emoji: '🩶',
    quotes: ["*intellectual purring*", "I've read about this..."]
  },
  street_scrapper: {
    id: 'street_scrapper',
    name: 'Street Scrapper',
    school: 'beggar',
    realm: 'mortal',
    description: 'Learned to fight in the alleys. Surprisingly cuddly.',
    baseStats: {
      snootMeridians: 1.2,
      innerPurr: 0.9,
      floofArmor: 1.3,
      zoomieSteps: 1.1,
      loafMastery: 0.8
    },
    emoji: '😼',
    quotes: ["You want some?!", "*aggressive purring*"]
  },

  // === EARTH REALM ===
  siamese_blade: {
    id: 'siamese_blade',
    name: 'Siamese Blade',
    school: 'wudang',
    realm: 'earth',
    description: 'Graceful and vocal. Very, very vocal.',
    baseStats: {
      snootMeridians: 1.3,
      innerPurr: 1.4,
      floofArmor: 1.0,
      zoomieSteps: 1.5,
      loafMastery: 1.2
    },
    emoji: '🗡️',
    quotes: ["MRROOOWW!", "*elegant screaming*"]
  },
  void_stalker: {
    id: 'void_stalker',
    name: 'Void Stalker',
    school: 'wanderer',
    realm: 'earth',
    description: 'A black cat who has seen the void. The void booped back.',
    baseStats: {
      snootMeridians: 1.2,
      innerPurr: 1.5,
      floofArmor: 1.1,
      zoomieSteps: 1.3,
      loafMastery: 1.4
    },
    emoji: '🖤',
    quotes: ["*stares into nothing*", "...I have seen things."]
  },
  persian_noble: {
    id: 'persian_noble',
    name: 'Persian Noble',
    school: 'royal_guard',
    realm: 'earth',
    description: 'Demands only the finest boops. Accepts adequate ones.',
    baseStats: {
      snootMeridians: 1.1,
      innerPurr: 1.6,
      floofArmor: 1.4,
      zoomieSteps: 0.8,
      loafMastery: 1.5
    },
    emoji: '👑',
    quotes: ["*regal sniff*", "This is... acceptable."]
  },
  maine_coon_guardian: {
    id: 'maine_coon_guardian',
    name: 'Maine Coon Guardian',
    school: 'royal_guard',
    realm: 'earth',
    description: 'Absolutely massive. Absolutely gentle. Absolute unit.',
    baseStats: {
      snootMeridians: 1.5,
      innerPurr: 1.3,
      floofArmor: 1.8,
      zoomieSteps: 0.9,
      loafMastery: 1.3
    },
    emoji: '🦁',
    quotes: ["*protective stance*", "I am... large."]
  },

  // === SKY REALM ===
  folded_ear_master: {
    id: 'folded_ear_master',
    name: 'Folded Ear Master',
    school: 'wudang',
    realm: 'sky',
    description: 'Ears folded from centuries of listening to the wind.',
    baseStats: {
      snootMeridians: 1.6,
      innerPurr: 1.8,
      floofArmor: 1.3,
      zoomieSteps: 1.4,
      loafMastery: 1.7
    },
    emoji: '🌬️',
    quotes: ["I hear... everything.", "*wise ear twitch*"]
  },
  munchkin_sage: {
    id: 'munchkin_sage',
    name: 'Munchkin Sage',
    school: 'scholar',
    realm: 'sky',
    description: 'Short legs, tall wisdom. Master of low-altitude cultivation.',
    baseStats: {
      snootMeridians: 1.4,
      innerPurr: 2.0,
      floofArmor: 1.2,
      zoomieSteps: 1.1,
      loafMastery: 1.9
    },
    emoji: '📜',
    quotes: ["Size matters not.", "*waddles wisely*"]
  },
  floof_immortal: {
    id: 'floof_immortal',
    name: 'Floof Immortal',
    school: 'emei',
    realm: 'sky',
    description: '90% floof, 10% cat, 100% cultivated.',
    baseStats: {
      snootMeridians: 1.5,
      innerPurr: 1.7,
      floofArmor: 2.2,
      zoomieSteps: 1.0,
      loafMastery: 1.8
    },
    emoji: '☁️',
    quotes: ["*disappears into own floof*", "Find me if you can."]
  },

  // === HEAVEN REALM ===
  galaxy_cultivator: {
    id: 'galaxy_cultivator',
    name: 'Galaxy Cultivator',
    school: 'divine',
    realm: 'heaven',
    description: 'Fur contains actual stars. Do not ask how.',
    baseStats: {
      snootMeridians: 2.0,
      innerPurr: 2.5,
      floofArmor: 1.8,
      zoomieSteps: 2.0,
      loafMastery: 2.2
    },
    emoji: '🌌',
    quotes: ["*cosmic purring*", "I contain multitudes."]
  },
  chonk_emperor: {
    id: 'chonk_emperor',
    name: 'Chonk Emperor',
    school: 'royal_guard',
    realm: 'heaven',
    description: 'Has transcended diet. Rules through sheer mass.',
    baseStats: {
      snootMeridians: 2.2,
      innerPurr: 2.3,
      floofArmor: 3.0,
      zoomieSteps: 0.5,
      loafMastery: 2.8
    },
    emoji: '👑',
    quotes: ["*gravitational purring*", "All shall boop the chonk."]
  },
  nyan_ancestor: {
    id: 'nyan_ancestor',
    name: 'Nyan Ancestor',
    school: 'divine',
    realm: 'heaven',
    description: 'First to achieve rainbow body cultivation. Still nyaning.',
    baseStats: {
      snootMeridians: 1.8,
      innerPurr: 2.8,
      floofArmor: 1.5,
      zoomieSteps: 3.0,
      loafMastery: 2.0
    },
    emoji: '🌈',
    quotes: ["Nyan~", "*rainbow trail intensifies*"]
  },

  // === DIVINE REALM ===
  ceiling_cat: {
    id: 'ceiling_cat',
    name: 'Ceiling Cat, the All-Seeing',
    school: 'divine',
    realm: 'divine',
    description: 'Watches from the heavens. Grants vision of all snoots.',
    baseStats: {
      snootMeridians: 3.0,
      innerPurr: 4.0,
      floofArmor: 2.5,
      zoomieSteps: 2.0,
      loafMastery: 3.5
    },
    emoji: '👁️',
    legendary: true,
    quotes: ["I see you.", "*omniscient judging*"]
  },
  keyboard_cat: {
    id: 'keyboard_cat',
    name: 'Keyboard Cat, Melody of Ages',
    school: 'divine',
    realm: 'divine',
    description: 'His songs buff all sect members. Play him off!',
    baseStats: {
      snootMeridians: 2.5,
      innerPurr: 5.0,
      floofArmor: 2.0,
      zoomieSteps: 2.5,
      loafMastery: 3.0
    },
    emoji: '🎹',
    legendary: true,
    quotes: ["*epic keyboard solo*", "Play me off!"]
  },
  longcat: {
    id: 'longcat',
    name: 'Longcat, the Infinite',
    school: 'divine',
    realm: 'divine',
    description: 'So long he exists in multiple realms simultaneously.',
    baseStats: {
      snootMeridians: 4.0,
      innerPurr: 3.5,
      floofArmor: 3.0,
      zoomieSteps: 1.5,
      loafMastery: 4.0
    },
    emoji: '📏',
    legendary: true,
    quotes: ["Looooooong.", "*extends infinitely*"]
  },
  eternal_loaf: {
    id: 'eternal_loaf',
    name: 'The Eternal Loaf',
    school: 'divine',
    realm: 'divine',
    description: 'Has transcended movement itself. Pure loaf energy.',
    baseStats: {
      snootMeridians: 2.0,
      innerPurr: 3.0,
      floofArmor: 4.0,
      zoomieSteps: 0.1,
      loafMastery: 10.0
    },
    emoji: '🍞',
    legendary: true,
    quotes: ["...", "*transcendent loafing*"]
  }
};

// Recruitment costs by realm
const RECRUITMENT_COSTS = {
  mortal: 100,
  earth: 500,
  sky: 2500,
  heaven: 15000,
  divine: 100000
};

/**
 * CatSystem - Manages the cat collection
 */
class CatSystem {
  constructor() {
    this.ownedCats = [];
    this.catIdCounter = 0;
  }

  /**
   * Recruit a random cat of a specific realm
   */
  recruitCat(realm = null) {
    // If no realm specified, roll for realm based on drop rates
    if (!realm) {
      realm = this.rollRealm();
    }

    // Get all cats of this realm
    const realmCats = Object.values(CAT_TEMPLATES).filter(c => c.realm === realm);
    if (realmCats.length === 0) return null;

    // Pick a random cat template
    const template = realmCats[Math.floor(Math.random() * realmCats.length)];

    // Create a new cat instance
    const cat = this.createCatInstance(template);
    this.ownedCats.push(cat);

    return cat;
  }

  /**
   * Roll for a realm based on drop rates
   */
  rollRealm() {
    const roll = Math.random();
    let cumulative = 0;

    for (const [realmId, realm] of Object.entries(REALMS)) {
      cumulative += realm.dropRate;
      if (roll < cumulative) {
        return realmId;
      }
    }

    return 'mortal'; // Fallback
  }

  /**
   * Create a cat instance from a template
   */
  createCatInstance(template) {
    this.catIdCounter++;

    // Add some random variation to stats (+/- 10%)
    const stats = {};
    for (const [stat, value] of Object.entries(template.baseStats)) {
      const variation = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
      stats[stat] = value * variation;
    }

    return {
      instanceId: this.catIdCounter,
      templateId: template.id,
      name: template.name,
      school: template.school,
      realm: template.realm,
      description: template.description,
      stats: stats,
      emoji: template.emoji,
      quotes: template.quotes,
      legendary: template.legendary || false,
      happiness: 100,
      level: 1,
      obtainedAt: Date.now(),
      braveHeart: false,
      totalBoops: 0
    };
  }

  /**
   * Get recruitment cost for a realm
   */
  getRecruitmentCost(realm = null) {
    if (realm) {
      return RECRUITMENT_COSTS[realm] || RECRUITMENT_COSTS.mortal;
    }
    // Base cost for random recruitment
    return RECRUITMENT_COSTS.mortal;
  }

  /**
   * Calculate total PP per second from all cats
   */
  calculatePPPerSecond(modifiers = {}) {
    let totalPP = 0;

    for (const cat of this.ownedCats) {
      const realm = REALMS[cat.realm];
      const realmMultiplier = realm.ppMultiplier;

      // Base PP from cat stats
      let catPP = cat.stats.innerPurr * cat.stats.loafMastery;

      // Apply realm multiplier
      catPP *= realmMultiplier;

      // Apply happiness (0-100 -> 0.5-1.5 multiplier)
      const happinessMultiplier = 0.5 + (cat.happiness / 100);
      catPP *= happinessMultiplier;

      // Apply cat happiness modifier (Yuelin's bonus)
      if (modifiers.catHappinessMultiplier) {
        catPP *= modifiers.catHappinessMultiplier;
      }

      totalPP += catPP;
    }

    return totalPP;
  }

  /**
   * Get all owned cats
   */
  getAllCats() {
    return this.ownedCats;
  }

  /**
   * Get a cat by ID
   */
  getCatById(catId) {
    return this.ownedCats.find(c => c.id === catId || c.instanceId === catId);
  }

  /**
   * Get cats by realm
   */
  getCatsByRealm(realm) {
    return this.ownedCats.filter(c => c.realm === realm);
  }

  /**
   * Get cat count
   */
  getCatCount() {
    return this.ownedCats.length;
  }

  /**
   * Get a random quote from a random cat
   */
  getRandomCatQuote() {
    if (this.ownedCats.length === 0) return null;
    const cat = this.ownedCats[Math.floor(Math.random() * this.ownedCats.length)];
    const quote = cat.quotes[Math.floor(Math.random() * cat.quotes.length)];
    return { cat: cat.name, quote };
  }

  /**
   * Update cat happiness over time
   */
  updateHappiness(deltaSeconds, modifiers = {}) {
    for (const cat of this.ownedCats) {
      // Happiness decays slowly (1% per minute)
      cat.happiness -= (deltaSeconds / 60) * 1;

      // Apply Iron Fur Body or similar mods
      if (modifiers.happinessDecayReduction) {
        cat.happiness += (deltaSeconds / 60) * modifiers.happinessDecayReduction;
      }

      // Clamp happiness
      cat.happiness = Math.max(0, Math.min(100, cat.happiness));
    }
  }

  /**
   * Boost all cat happiness (from events, waifus, etc.)
   */
  boostHappiness(amount) {
    for (const cat of this.ownedCats) {
      cat.happiness = Math.min(100, cat.happiness + amount);
    }
  }

  /**
   * Reset cats for rebirth
   */
  reset() {
    this.ownedCats = [];
    this.catIdCounter = 0;
  }

  /**
   * Serialize cats for saving
   */
  serialize() {
    return {
      cats: this.ownedCats,
      catIdCounter: this.catIdCounter
    };
  }

  /**
   * Load cats from save data
   */
  deserialize(data) {
    if (data.cats) {
      this.ownedCats = data.cats;
    }
    if (data.catIdCounter) {
      this.catIdCounter = data.catIdCounter;
    }
  }
}

// Export for use in other modules
window.REALMS = REALMS;
window.SCHOOLS = SCHOOLS;
window.CAT_TEMPLATES = CAT_TEMPLATES;
window.CatSystem = CatSystem;
