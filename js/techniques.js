/**
 * techniques.js - Secret Techniques & Internal Cultivation
 * "True power lies not in the boop, but in the cultivator who boops."
 */

// ===================================
// SECRET TECHNIQUES (Boss Drops)
// ===================================

const SECRET_TECHNIQUES = {
  // Floor 10 Boss: The Eternal Napper
  dream_walker: {
    id: 'dream_walker',
    name: 'Dream Walker Sutra',
    emoji: '💤',
    tier: 1,
    boss: 'eternal_napper',
    dropChance: 0.25,
    description: 'Channel the power of dreams to boost AFK gains.',
    lore: 'Stolen from the Eternal Napper\'s dreams. Contains visions of infinite slumber.',
    effects: {
      afkMultiplier: 1.5,
      passivePpPerSecond: 0.5
    },
    unlockMessage: 'You have learned the Dream Walker Sutra! AFK gains increased by 50%!'
  },

  // Floor 20 Boss: The Goose Emperor
  honk_of_authority: {
    id: 'honk_of_authority',
    name: 'Honk of Authority',
    emoji: '📢',
    tier: 2,
    boss: 'goose_emperor',
    dropChance: 0.20,
    description: 'Intimidate your enemies with the power of HONK.',
    lore: 'The Emperor\'s final honk, crystallized into pure technique.',
    effects: {
      enemyDamageReduction: 0.15,
      critDamageBonus: 0.25
    },
    activeAbility: {
      name: 'IMPERIAL HONK',
      description: 'Stun all enemies for 3 seconds. 60s cooldown.',
      cooldown: 60000,
      effect: 'stun_all'
    },
    unlockMessage: 'HONK! You have mastered the Honk of Authority!'
  },

  // Floor 30 Boss: Nine-Tailed Menace
  fox_fire_mastery: {
    id: 'fox_fire_mastery',
    name: 'Nine-Tails Fox Fire',
    emoji: '🔥',
    tier: 3,
    boss: 'nine_tailed_menace',
    dropChance: 0.15,
    description: 'Mystical flames that burn with each boop.',
    lore: 'A single tail\'s worth of power. Eight more remain hidden.',
    effects: {
      bpMultiplier: 1.2,
      fireDamageBonus: 0.3,
      burnChance: 0.1
    },
    activeAbility: {
      name: 'Fox Fire Burst',
      description: 'Deal 300% fire damage to all enemies.',
      cooldown: 45000,
      effect: 'fire_aoe'
    },
    unlockMessage: 'The fox fire burns within you! BP gains increased by 20%!'
  },

  // Floor 40 Boss: Jade Guardian
  jade_body: {
    id: 'jade_body',
    name: 'Jade Body Technique',
    emoji: '💎',
    tier: 4,
    boss: 'jade_guardian',
    dropChance: 0.12,
    description: 'Transform your body into living jade.',
    lore: 'The Guardian\'s core secret. Your skin shimmers with green energy.',
    effects: {
      damageReduction: 0.2,
      maxHpBonus: 0.3,
      reflectDamage: 0.1
    },
    activeAbility: {
      name: 'Jade Barrier',
      description: 'Become immune to damage for 5 seconds. 90s cooldown.',
      cooldown: 90000,
      effect: 'invulnerable'
    },
    unlockMessage: 'Your body hardens like jade! Defense greatly increased!'
  },

  // Floor 50 Boss: Void Sovereign
  void_step: {
    id: 'void_step',
    name: 'Void Step Manual',
    emoji: '🌀',
    tier: 5,
    boss: 'void_sovereign',
    dropChance: 0.10,
    description: 'Step between dimensions to avoid attacks.',
    lore: 'Reality bends around you. Nothing is certain anymore.',
    effects: {
      dodgeChance: 0.2,
      critChance: 0.15,
      phaseChance: 0.05
    },
    activeAbility: {
      name: 'Dimension Shift',
      description: 'Phase out of reality, dodging all attacks for 3s.',
      cooldown: 60000,
      effect: 'phase'
    },
    unlockMessage: 'You have glimpsed the void! Reality bends to your will!'
  },

  // Floor 100 Boss: Celestial Cat God
  celestial_ascension: {
    id: 'celestial_ascension',
    name: 'Celestial Ascension Scripture',
    emoji: '✨',
    tier: 6,
    boss: 'celestial_cat',
    dropChance: 0.05,
    description: 'The ultimate technique. Transcend mortality.',
    lore: 'Given only to those who have booped the divine snoot.',
    effects: {
      allStatsMultiplier: 1.5,
      bpMultiplier: 2.0,
      ppMultiplier: 2.0,
      divineProtection: true
    },
    activeAbility: {
      name: 'DIVINE BOOP',
      description: 'Channel celestial energy for 1000% damage.',
      cooldown: 120000,
      effect: 'divine_strike'
    },
    unlockMessage: 'You have achieved CELESTIAL ASCENSION! All powers doubled!'
  }
};

// ===================================
// LEGENDARY INTERNAL CULTIVATION
// (Age of Wushu Inspired)
// ===================================

const LEGENDARY_INTERNALS = {
  // Sunflower Manual - Ultimate speed and evasion, but requires sacrifice
  sunflower_manual: {
    id: 'sunflower_manual',
    name: 'Sunflower Manual',
    emoji: '🌻',
    tier: 'legendary',
    category: 'forbidden',
    description: 'The forbidden sunflower technique. Unmatched speed at a terrible cost.',
    lore: 'To master the Sunflower, one must first sacrifice that which they hold dear. The ancient text reads: "To achieve the ultimate boop, one must abandon all hesitation."',
    unlockCondition: {
      type: 'sacrifice',
      requirement: 'Reset 50% of your current BP to unlock',
      bpSacrificePercent: 0.5,
      minBP: 100000
    },
    stages: [
      {
        stage: 1,
        name: 'Budding Sunflower',
        requirement: { bpSacrificed: 100000 },
        effects: { attackSpeed: 0.25, dodgeChance: 0.1 }
      },
      {
        stage: 2,
        name: 'Blooming Radiance',
        requirement: { bpSacrificed: 500000 },
        effects: { attackSpeed: 0.5, dodgeChance: 0.2, critChance: 0.1 }
      },
      {
        stage: 3,
        name: 'Sunflower Transcendence',
        requirement: { bpSacrificed: 2000000 },
        effects: { attackSpeed: 1.0, dodgeChance: 0.35, critChance: 0.2, phaseChance: 0.1 }
      },
      {
        stage: 4,
        name: 'Solar Apotheosis',
        requirement: { bpSacrificed: 10000000 },
        effects: { attackSpeed: 2.0, dodgeChance: 0.5, critChance: 0.3, phaseChance: 0.2, bpMultiplier: 1.5 }
      }
    ],
    activeAbility: {
      name: 'Sunflower Phantom Step',
      description: 'Move so fast you become invisible. Dodge ALL attacks for 5 seconds and deal 10 rapid strikes.',
      cooldown: 90000,
      effect: 'phantom_barrage',
      unlockStage: 2
    },
    ultimateAbility: {
      name: 'THOUSAND PETAL STORM',
      description: 'Unleash the full power of the Sunflower. 50 instant strikes dealing 2000% total damage.',
      cooldown: 180000,
      effect: 'petal_storm',
      unlockStage: 4
    }
  },

  // Star Vortex - Cosmic power, scales with time played
  star_vortex: {
    id: 'star_vortex',
    name: 'Star Vortex Scripture',
    emoji: '⭐',
    tier: 'legendary',
    category: 'celestial',
    description: 'Channel the power of the stars. Grows stronger with each passing moment.',
    lore: 'The cosmos flows through your meridians. As above, so below. The longer you cultivate, the more stars align in your favor.',
    unlockCondition: {
      type: 'achievement',
      requirement: 'Reach Pagoda Floor 50 and have 24+ hours total playtime',
      pagodaFloor: 50,
      playtimeHours: 24
    },
    stages: [
      {
        stage: 1,
        name: 'Stargazer',
        requirement: { playtimeHours: 24 },
        effects: { ppMultiplier: 1.1, afkMultiplier: 1.1 }
      },
      {
        stage: 2,
        name: 'Constellation Walker',
        requirement: { playtimeHours: 48 },
        effects: { ppMultiplier: 1.25, afkMultiplier: 1.25, critDamage: 0.2 }
      },
      {
        stage: 3,
        name: 'Celestial Navigator',
        requirement: { playtimeHours: 100 },
        effects: { ppMultiplier: 1.5, afkMultiplier: 1.5, critDamage: 0.4, allStatsBonus: 0.15 }
      },
      {
        stage: 4,
        name: 'Star Sovereign',
        requirement: { playtimeHours: 200 },
        effects: { ppMultiplier: 2.0, afkMultiplier: 2.0, critDamage: 0.75, allStatsBonus: 0.3, starPower: true }
      }
    ],
    passiveAbility: {
      name: 'Stellar Accumulation',
      description: 'Gain 0.1% increased damage for every hour played. Stacks infinitely.',
      effect: 'time_scaling_damage'
    },
    activeAbility: {
      name: 'Meteor Shower',
      description: 'Call down a rain of stars dealing 500% damage to all enemies.',
      cooldown: 60000,
      effect: 'meteor_shower',
      unlockStage: 2
    },
    ultimateAbility: {
      name: 'BLACK HOLE SINGULARITY',
      description: 'Create a black hole that pulls in all enemies and deals 3000% void damage.',
      cooldown: 240000,
      effect: 'black_hole',
      unlockStage: 4
    }
  }
};

// ===================================
// HIDDEN SKILLS (Random Discovery)
// ===================================

const HIDDEN_SKILLS = {
  // Combat Skills
  thousand_paw_strike: {
    id: 'thousand_paw_strike',
    name: 'Thousand Paw Strike',
    emoji: '👊',
    category: 'combat',
    rarity: 'rare',
    discoveryCondition: { type: 'combo', value: 100 },
    description: 'Attack rapidly with phantom paws.',
    effects: {
      attackSpeedBonus: 0.5,
      multistrikeChance: 0.2
    },
    unlockMessage: 'Your paws blur with speed! Thousand Paw Strike learned!'
  },

  critical_meridian: {
    id: 'critical_meridian',
    name: 'Critical Meridian Strike',
    emoji: '🎯',
    category: 'combat',
    rarity: 'epic',
    discoveryCondition: { type: 'criticalBoops', value: 500 },
    description: 'Target vital points for devastating criticals.',
    effects: {
      critChance: 0.1,
      critDamage: 0.5
    },
    unlockMessage: 'You can see the enemy\'s weak points! Critical Meridian Strike learned!'
  },

  // Cultivation Skills
  eternal_flow: {
    id: 'eternal_flow',
    name: 'Eternal Flow Meditation',
    emoji: '🌊',
    category: 'cultivation',
    rarity: 'rare',
    discoveryCondition: { type: 'afkHours', value: 48 },
    description: 'Your cultivation continues even in deep sleep.',
    effects: {
      afkMultiplier: 1.25,
      afkCapHours: 36
    },
    unlockMessage: 'The river of time flows through you! Eternal Flow Meditation learned!'
  },

  golden_core: {
    id: 'golden_core',
    name: 'Golden Core Formation',
    emoji: '🔮',
    category: 'cultivation',
    rarity: 'legendary',
    discoveryCondition: { type: 'totalPP', value: 1000000 },
    description: 'Form a golden core within your dantian.',
    effects: {
      ppMultiplier: 1.5,
      allStatsBonus: 0.2
    },
    unlockMessage: 'A golden core forms within you! PP generation greatly increased!'
  },

  // Support Skills
  cat_whisperer: {
    id: 'cat_whisperer',
    name: 'Cat Whisperer\'s Gift',
    emoji: '🐱',
    category: 'support',
    rarity: 'rare',
    discoveryCondition: { type: 'totalCats', value: 30 },
    description: 'Communicate with cats on a deeper level.',
    effects: {
      catHappinessBonus: 0.3,
      catPpBonus: 0.2
    },
    unlockMessage: 'The cats speak to you now! Cat Whisperer\'s Gift learned!'
  },

  bond_of_fate: {
    id: 'bond_of_fate',
    name: 'Bond of Fate',
    emoji: '💕',
    category: 'support',
    rarity: 'epic',
    discoveryCondition: { type: 'maxBondWaifu', value: 1 },
    description: 'Your bonds strengthen all around you.',
    effects: {
      waifuBonusMultiplier: 1.5,
      bondGainBonus: 0.5
    },
    unlockMessage: 'Your heart connects with another! Bond of Fate learned!'
  },

  // Goose Skills
  goose_tamer: {
    id: 'goose_tamer',
    name: 'Way of the Goose',
    emoji: '🦢',
    category: 'special',
    rarity: 'legendary',
    discoveryCondition: { type: 'gooseBoops', value: 200 },
    description: 'You have earned the respect of geese.',
    effects: {
      gooseDropBonus: 0.5,
      gooseDamageBonus: 0.3
    },
    unlockMessage: 'HONK! The geese acknowledge you! Way of the Goose learned!'
  },

  chaos_embrace: {
    id: 'chaos_embrace',
    name: 'Embrace of Chaos',
    emoji: '🌪️',
    category: 'special',
    rarity: 'mythic',
    discoveryCondition: { type: 'cobraChickenDefeated', value: true },
    description: 'Channel pure chaos energy.',
    effects: {
      randomBonusChance: 0.1,
      chaosMultiplier: 1.3
    },
    unlockMessage: 'Chaos flows through you! Embrace of Chaos learned!'
  }
};

// ===================================
// INTERNAL CULTIVATION PASSIVES
// ===================================

const CULTIVATION_PASSIVES = {
  // Unlocked by floor progress
  iron_body_1: {
    id: 'iron_body_1',
    name: 'Iron Body I',
    tier: 1,
    requirement: { type: 'pagodaFloor', value: 5 },
    effects: { maxHp: 50, defense: 5 },
    description: '+50 Max HP, +5 Defense'
  },
  iron_body_2: {
    id: 'iron_body_2',
    name: 'Iron Body II',
    tier: 2,
    requirement: { type: 'pagodaFloor', value: 15 },
    effects: { maxHp: 150, defense: 15 },
    description: '+150 Max HP, +15 Defense'
  },
  iron_body_3: {
    id: 'iron_body_3',
    name: 'Iron Body III',
    tier: 3,
    requirement: { type: 'pagodaFloor', value: 30 },
    effects: { maxHp: 300, defense: 30 },
    description: '+300 Max HP, +30 Defense'
  },

  qi_refinement_1: {
    id: 'qi_refinement_1',
    name: 'Qi Refinement I',
    tier: 1,
    requirement: { type: 'totalBoops', value: 1000 },
    effects: { bpPerBoop: 1, ppPerSecond: 0.1 },
    description: '+1 BP per boop, +0.1 PP/s'
  },
  qi_refinement_2: {
    id: 'qi_refinement_2',
    name: 'Qi Refinement II',
    tier: 2,
    requirement: { type: 'totalBoops', value: 10000 },
    effects: { bpPerBoop: 5, ppPerSecond: 0.5 },
    description: '+5 BP per boop, +0.5 PP/s'
  },
  qi_refinement_3: {
    id: 'qi_refinement_3',
    name: 'Qi Refinement III',
    tier: 3,
    requirement: { type: 'totalBoops', value: 100000 },
    effects: { bpPerBoop: 25, ppPerSecond: 2 },
    description: '+25 BP per boop, +2 PP/s'
  },

  snoot_mastery_1: {
    id: 'snoot_mastery_1',
    name: 'Snoot Mastery I',
    tier: 1,
    requirement: { type: 'criticalBoops', value: 100 },
    effects: { critChance: 0.02, critDamage: 0.1 },
    description: '+2% Crit Chance, +10% Crit Damage'
  },
  snoot_mastery_2: {
    id: 'snoot_mastery_2',
    name: 'Snoot Mastery II',
    tier: 2,
    requirement: { type: 'criticalBoops', value: 1000 },
    effects: { critChance: 0.05, critDamage: 0.25 },
    description: '+5% Crit Chance, +25% Crit Damage'
  },
  snoot_mastery_3: {
    id: 'snoot_mastery_3',
    name: 'Snoot Mastery III',
    tier: 3,
    requirement: { type: 'criticalBoops', value: 10000 },
    effects: { critChance: 0.1, critDamage: 0.5 },
    description: '+10% Crit Chance, +50% Crit Damage'
  }
};

// ===================================
// CONSUMABLE ITEMS
// ===================================

const CULTIVATION_CONSUMABLES = {
  qi_pill_minor: {
    id: 'qi_pill_minor',
    name: 'Minor Qi Pill',
    emoji: '💊',
    rarity: 'common',
    description: 'Instantly gain 1,000 PP.',
    effect: { type: 'instant_pp', value: 1000 },
    dropSource: 'pagoda_floor_1_10'
  },
  qi_pill_major: {
    id: 'qi_pill_major',
    name: 'Major Qi Pill',
    emoji: '💊',
    rarity: 'uncommon',
    description: 'Instantly gain 10,000 PP.',
    effect: { type: 'instant_pp', value: 10000 },
    dropSource: 'pagoda_floor_20_30'
  },
  qi_pill_supreme: {
    id: 'qi_pill_supreme',
    name: 'Supreme Qi Pill',
    emoji: '💊',
    rarity: 'rare',
    description: 'Instantly gain 100,000 PP.',
    effect: { type: 'instant_pp', value: 100000 },
    dropSource: 'pagoda_boss'
  },

  boop_elixir: {
    id: 'boop_elixir',
    name: 'Boop Elixir',
    emoji: '🧪',
    rarity: 'uncommon',
    description: '2x BP for 5 minutes.',
    effect: { type: 'buff', stat: 'bpMultiplier', value: 2, duration: 300000 },
    dropSource: 'pagoda_floor_10_20'
  },
  cultivation_incense: {
    id: 'cultivation_incense',
    name: 'Cultivation Incense',
    emoji: '🕯️',
    rarity: 'rare',
    description: '3x PP generation for 10 minutes.',
    effect: { type: 'buff', stat: 'ppMultiplier', value: 3, duration: 600000 },
    dropSource: 'pagoda_floor_30_40'
  },
  golden_catnip: {
    id: 'golden_catnip',
    name: 'Golden Catnip',
    emoji: '🌟',
    rarity: 'legendary',
    description: 'All cats gain +50% happiness permanently.',
    effect: { type: 'permanent', stat: 'catHappiness', value: 0.5 },
    dropSource: 'pagoda_boss'
  },

  phoenix_feather: {
    id: 'phoenix_feather',
    name: 'Phoenix Feather',
    emoji: '🪶',
    rarity: 'epic',
    description: 'Revive once upon defeat in Pagoda.',
    effect: { type: 'revive', charges: 1 },
    dropSource: 'pagoda_floor_40_50'
  },
  void_essence: {
    id: 'void_essence',
    name: 'Void Essence',
    emoji: '🌑',
    rarity: 'legendary',
    description: 'Phase through the next fatal attack.',
    effect: { type: 'immunity', charges: 1 },
    dropSource: 'void_sovereign'
  },
  celestial_nectar: {
    id: 'celestial_nectar',
    name: 'Celestial Nectar',
    emoji: '🍯',
    rarity: 'mythic',
    description: 'Permanently increase all stats by 5%.',
    effect: { type: 'permanent', stat: 'allStats', value: 0.05 },
    dropSource: 'celestial_cat'
  }
};

// ===================================
// TECHNIQUE SYSTEM CLASS
// ===================================

class TechniqueSystem {
  constructor() {
    this.learnedTechniques = [];
    this.learnedSkills = [];
    this.cultivationPassives = [];
    this.legendaryInternals = {}; // { id: { unlocked: true, stage: 1, bpSacrificed: 0 } }
    this.consumables = {};
    this.activeBuffs = [];
    this.cooldowns = {};
  }

  init() {
    // Start with no techniques
    this.learnedTechniques = [];
    this.learnedSkills = [];
    this.cultivationPassives = [];
    this.legendaryInternals = {};
    this.consumables = {};
  }

  // ===================================
  // TECHNIQUE LEARNING
  // ===================================

  learnTechnique(techniqueId) {
    if (this.learnedTechniques.includes(techniqueId)) return false;

    const technique = SECRET_TECHNIQUES[techniqueId];
    if (!technique) return false;

    this.learnedTechniques.push(techniqueId);
    return technique;
  }

  hasTechnique(techniqueId) {
    return this.learnedTechniques.includes(techniqueId);
  }

  getTechnique(techniqueId) {
    return SECRET_TECHNIQUES[techniqueId];
  }

  getAllLearnedTechniques() {
    return this.learnedTechniques.map(id => SECRET_TECHNIQUES[id]).filter(Boolean);
  }

  // ===================================
  // SKILL DISCOVERY
  // ===================================

  checkSkillDiscovery(gameState) {
    const newSkills = [];

    for (const [id, skill] of Object.entries(HIDDEN_SKILLS)) {
      if (this.learnedSkills.includes(id)) continue;

      const cond = skill.discoveryCondition;
      let discovered = false;

      switch (cond.type) {
        case 'combo':
          discovered = gameState.maxCombo >= cond.value;
          break;
        case 'criticalBoops':
          discovered = gameState.criticalBoops >= cond.value;
          break;
        case 'afkHours':
          discovered = (gameState.totalAfkTime / 3600000) >= cond.value;
          break;
        case 'totalPP':
          discovered = gameState.purrPower >= cond.value;
          break;
        case 'totalCats':
          discovered = (window.catSystem?.getCatCount() || 0) >= cond.value;
          break;
        case 'maxBondWaifu':
          const waifus = window.waifuSystem?.getUnlockedWaifus() || [];
          discovered = waifus.some(w => w.bondLevel >= 100);
          break;
        case 'gooseBoops':
          discovered = gameState.gooseBoops >= cond.value;
          break;
        case 'cobraChickenDefeated':
          discovered = gameState.cobraChickenDefeated === true;
          break;
      }

      if (discovered) {
        this.learnedSkills.push(id);
        newSkills.push(skill);
      }
    }

    return newSkills;
  }

  hasSkill(skillId) {
    return this.learnedSkills.includes(skillId);
  }

  getSkill(skillId) {
    return HIDDEN_SKILLS[skillId];
  }

  getAllLearnedSkills() {
    return this.learnedSkills.map(id => HIDDEN_SKILLS[id]).filter(Boolean);
  }

  // ===================================
  // CULTIVATION PASSIVES
  // ===================================

  checkCultivationPassives(gameState) {
    const newPassives = [];

    for (const [id, passive] of Object.entries(CULTIVATION_PASSIVES)) {
      if (this.cultivationPassives.includes(id)) continue;

      const req = passive.requirement;
      let unlocked = false;

      switch (req.type) {
        case 'pagodaFloor':
          const highestFloor = window.pagodaSystem?.highestFloor || 0;
          unlocked = highestFloor >= req.value;
          break;
        case 'totalBoops':
          unlocked = gameState.totalBoops >= req.value;
          break;
        case 'criticalBoops':
          unlocked = gameState.criticalBoops >= req.value;
          break;
      }

      if (unlocked) {
        this.cultivationPassives.push(id);
        newPassives.push(passive);
      }
    }

    return newPassives;
  }

  hasPassive(passiveId) {
    return this.cultivationPassives.includes(passiveId);
  }

  getAllCultivationPassives() {
    return this.cultivationPassives.map(id => CULTIVATION_PASSIVES[id]).filter(Boolean);
  }

  // ===================================
  // LEGENDARY INTERNALS
  // ===================================

  canUnlockLegendaryInternal(internalId, gameState) {
    const internal = LEGENDARY_INTERNALS[internalId];
    if (!internal) return { can: false, reason: 'Unknown internal' };

    if (this.legendaryInternals[internalId]?.unlocked) {
      return { can: false, reason: 'Already unlocked' };
    }

    const cond = internal.unlockCondition;

    if (cond.type === 'sacrifice') {
      if (gameState.boopPoints < cond.minBP) {
        return { can: false, reason: `Need at least ${cond.minBP} BP to attempt` };
      }
      return { can: true, cost: Math.floor(gameState.boopPoints * cond.bpSacrificePercent) };
    }

    if (cond.type === 'achievement') {
      const highestFloor = window.pagodaSystem?.highestFloor || 0;
      const playtimeHours = (gameState.playtime || 0) / 3600000;

      if (highestFloor < cond.pagodaFloor) {
        return { can: false, reason: `Reach Pagoda Floor ${cond.pagodaFloor} (current: ${highestFloor})` };
      }
      if (playtimeHours < cond.playtimeHours) {
        return { can: false, reason: `Need ${cond.playtimeHours}h playtime (current: ${Math.floor(playtimeHours)}h)` };
      }
      return { can: true };
    }

    return { can: false, reason: 'Unknown unlock condition' };
  }

  unlockLegendaryInternal(internalId, gameState) {
    const check = this.canUnlockLegendaryInternal(internalId, gameState);
    if (!check.can) return { success: false, reason: check.reason };

    const internal = LEGENDARY_INTERNALS[internalId];

    // Apply cost if any
    if (check.cost) {
      gameState.boopPoints -= check.cost;
      this.legendaryInternals[internalId] = {
        unlocked: true,
        stage: 1,
        bpSacrificed: check.cost,
        unlockedAt: Date.now()
      };
    } else {
      this.legendaryInternals[internalId] = {
        unlocked: true,
        stage: 1,
        bpSacrificed: 0,
        unlockedAt: Date.now()
      };
    }

    return {
      success: true,
      internal: internal,
      stage: 1,
      message: `You have unlocked ${internal.name}!`
    };
  }

  hasLegendaryInternal(internalId) {
    return this.legendaryInternals[internalId]?.unlocked === true;
  }

  getLegendaryInternalStage(internalId) {
    return this.legendaryInternals[internalId]?.stage || 0;
  }

  progressLegendaryInternal(internalId, gameState) {
    if (!this.hasLegendaryInternal(internalId)) return null;

    const internal = LEGENDARY_INTERNALS[internalId];
    const state = this.legendaryInternals[internalId];
    const currentStage = state.stage;

    if (currentStage >= internal.stages.length) return null; // Already maxed

    const nextStage = internal.stages[currentStage]; // stages are 0-indexed for next
    if (!nextStage) return null;

    // Check if can progress
    let canProgress = false;
    const req = nextStage.requirement;

    if (req.bpSacrificed !== undefined) {
      canProgress = state.bpSacrificed >= req.bpSacrificed;
    } else if (req.playtimeHours !== undefined) {
      const playtimeHours = (gameState.playtime || 0) / 3600000;
      canProgress = playtimeHours >= req.playtimeHours;
    }

    if (canProgress) {
      state.stage = currentStage + 1;
      return {
        newStage: state.stage,
        stageName: nextStage.name,
        effects: nextStage.effects
      };
    }

    return null;
  }

  sacrificeBPForInternal(internalId, amount, gameState) {
    if (!this.hasLegendaryInternal(internalId)) return false;

    const internal = LEGENDARY_INTERNALS[internalId];
    if (internal.unlockCondition.type !== 'sacrifice') return false;

    if (gameState.boopPoints < amount) return false;

    gameState.boopPoints -= amount;
    this.legendaryInternals[internalId].bpSacrificed += amount;

    // Check for stage progression
    return this.progressLegendaryInternal(internalId, gameState);
  }

  getLegendaryInternalEffects(internalId) {
    if (!this.hasLegendaryInternal(internalId)) return {};

    const internal = LEGENDARY_INTERNALS[internalId];
    const stage = this.getLegendaryInternalStage(internalId);

    if (stage === 0 || !internal.stages[stage - 1]) return {};

    return internal.stages[stage - 1].effects || {};
  }

  getAllLegendaryInternalEffects() {
    const effects = {};

    for (const [id, state] of Object.entries(this.legendaryInternals)) {
      if (!state.unlocked) continue;

      const internalEffects = this.getLegendaryInternalEffects(id);
      for (const [key, value] of Object.entries(internalEffects)) {
        if (key.endsWith('Multiplier')) {
          effects[key] = (effects[key] || 1) * value;
        } else if (typeof value === 'number') {
          effects[key] = (effects[key] || 0) + value;
        } else {
          effects[key] = value;
        }
      }
    }

    return effects;
  }

  // ===================================
  // CONSUMABLES
  // ===================================

  addConsumable(itemId, quantity = 1) {
    if (!CULTIVATION_CONSUMABLES[itemId]) return false;
    this.consumables[itemId] = (this.consumables[itemId] || 0) + quantity;
    return true;
  }

  useConsumable(itemId, gameState) {
    if (!this.consumables[itemId] || this.consumables[itemId] <= 0) return null;

    const item = CULTIVATION_CONSUMABLES[itemId];
    if (!item) return null;

    this.consumables[itemId]--;
    if (this.consumables[itemId] <= 0) delete this.consumables[itemId];

    const result = this.applyConsumableEffect(item, gameState);
    return { ...result, name: item.name, emoji: item.emoji };
  }

  applyConsumableEffect(item, gameState) {
    const effect = item.effect;

    switch (effect.type) {
      case 'instant_pp':
        gameState.purrPower += effect.value;
        return { message: `Gained ${effect.value} PP!`, value: effect.value };

      case 'buff':
        const buff = {
          id: item.id,
          stat: effect.stat,
          value: effect.value,
          endTime: Date.now() + effect.duration,
          name: item.name
        };
        this.activeBuffs.push(buff);
        return { message: `${item.name} activated!`, buff };

      case 'permanent':
        // Handle permanent stat increases
        if (effect.stat === 'allStats') {
          gameState.permanentBonuses = gameState.permanentBonuses || {};
          gameState.permanentBonuses.allStats = (gameState.permanentBonuses.allStats || 0) + effect.value;
        } else if (effect.stat === 'catHappiness') {
          // Apply to all cats
          if (window.catSystem) {
            window.catSystem.getAllCats().forEach(cat => {
              cat.happiness = Math.min(100, cat.happiness * (1 + effect.value));
            });
          }
        }
        return { message: `Permanent bonus applied!`, permanent: true };

      case 'revive':
      case 'immunity':
        // These are handled by the combat system
        return { message: `${item.name} ready!`, charges: effect.charges };

      default:
        return null;
    }
  }

  getConsumableCount(itemId) {
    return this.consumables[itemId] || 0;
  }

  // ===================================
  // ACTIVE BUFFS
  // ===================================

  updateBuffs() {
    const now = Date.now();
    this.activeBuffs = this.activeBuffs.filter(buff => buff.endTime > now);
  }

  getActiveBuffs() {
    this.updateBuffs();
    return this.activeBuffs;
  }

  getBuffMultiplier(stat) {
    this.updateBuffs();
    let multiplier = 1;
    for (const buff of this.activeBuffs) {
      if (buff.stat === stat) {
        multiplier *= buff.value;
      }
    }
    return multiplier;
  }

  // ===================================
  // COMBINED EFFECTS
  // ===================================

  getCombinedEffects() {
    const effects = {
      bpMultiplier: 1,
      ppMultiplier: 1,
      afkMultiplier: 1,
      critChance: 0,
      critDamage: 0,
      damageReduction: 0,
      maxHpBonus: 0,
      dodgeChance: 0,
      attackSpeedBonus: 0,
      bpPerBoop: 0,
      ppPerSecond: 0
    };

    // Add technique effects
    for (const technique of this.getAllLearnedTechniques()) {
      if (technique.effects) {
        for (const [key, value] of Object.entries(technique.effects)) {
          if (key.endsWith('Multiplier')) {
            effects[key] = (effects[key] || 1) * value;
          } else if (typeof effects[key] === 'number') {
            effects[key] += value;
          }
        }
      }
    }

    // Add skill effects
    for (const skill of this.getAllLearnedSkills()) {
      if (skill.effects) {
        for (const [key, value] of Object.entries(skill.effects)) {
          if (key.endsWith('Multiplier') || key.endsWith('Bonus')) {
            effects[key] = (effects[key] || 1) * value;
          } else if (typeof effects[key] === 'number') {
            effects[key] += value;
          }
        }
      }
    }

    // Add cultivation passive effects
    for (const passive of this.getAllCultivationPassives()) {
      if (passive.effects) {
        for (const [key, value] of Object.entries(passive.effects)) {
          if (typeof effects[key] === 'number') {
            effects[key] += value;
          }
        }
      }
    }

    // Add legendary internal effects
    const legendaryEffects = this.getAllLegendaryInternalEffects();
    for (const [key, value] of Object.entries(legendaryEffects)) {
      if (key.endsWith('Multiplier')) {
        effects[key] = (effects[key] || 1) * value;
      } else if (typeof value === 'number') {
        effects[key] = (effects[key] || 0) + value;
      }
    }

    // Add active buff effects
    effects.bpMultiplier *= this.getBuffMultiplier('bpMultiplier');
    effects.ppMultiplier *= this.getBuffMultiplier('ppMultiplier');

    return effects;
  }

  // ===================================
  // ACTIVE ABILITIES
  // ===================================

  canUseAbility(techniqueId) {
    if (!this.hasTechnique(techniqueId)) return false;

    const technique = SECRET_TECHNIQUES[techniqueId];
    if (!technique?.activeAbility) return false;

    const cooldownEnd = this.cooldowns[techniqueId] || 0;
    return Date.now() >= cooldownEnd;
  }

  useAbility(techniqueId) {
    if (!this.canUseAbility(techniqueId)) return null;

    const technique = SECRET_TECHNIQUES[techniqueId];
    const ability = technique.activeAbility;

    this.cooldowns[techniqueId] = Date.now() + ability.cooldown;

    return {
      technique,
      ability,
      effect: ability.effect
    };
  }

  getAbilityCooldown(techniqueId) {
    const cooldownEnd = this.cooldowns[techniqueId] || 0;
    return Math.max(0, cooldownEnd - Date.now());
  }

  // ===================================
  // SERIALIZATION
  // ===================================

  serialize() {
    return {
      learnedTechniques: this.learnedTechniques,
      learnedSkills: this.learnedSkills,
      cultivationPassives: this.cultivationPassives,
      legendaryInternals: this.legendaryInternals,
      consumables: this.consumables,
      activeBuffs: this.activeBuffs.filter(b => b.endTime > Date.now()),
      cooldowns: this.cooldowns
    };
  }

  deserialize(data) {
    if (data.learnedTechniques) this.learnedTechniques = data.learnedTechniques;
    if (data.learnedSkills) this.learnedSkills = data.learnedSkills;
    if (data.cultivationPassives) this.cultivationPassives = data.cultivationPassives;
    if (data.legendaryInternals) this.legendaryInternals = data.legendaryInternals;
    if (data.consumables) this.consumables = data.consumables;
    if (data.activeBuffs) this.activeBuffs = data.activeBuffs;
    if (data.cooldowns) this.cooldowns = data.cooldowns;
  }
}

// ===================================
// BOSS DROP HANDLER
// ===================================

function rollBossTechniqueDrop(bossId) {
  // Find technique for this boss
  for (const [id, technique] of Object.entries(SECRET_TECHNIQUES)) {
    if (technique.boss === bossId) {
      // Check if already learned
      if (window.techniqueSystem?.hasTechnique(id)) {
        return null; // Already have it
      }

      // Roll for drop
      if (Math.random() < technique.dropChance) {
        return id;
      }
    }
  }
  return null;
}

function rollConsumableDrop(floorNum, isBoss) {
  const drops = [];

  for (const [id, item] of Object.entries(CULTIVATION_CONSUMABLES)) {
    let shouldDrop = false;
    let dropChance = 0;

    switch (item.dropSource) {
      case 'pagoda_floor_1_10':
        if (floorNum >= 1 && floorNum <= 10) dropChance = 0.15;
        break;
      case 'pagoda_floor_10_20':
        if (floorNum >= 10 && floorNum <= 20) dropChance = 0.12;
        break;
      case 'pagoda_floor_20_30':
        if (floorNum >= 20 && floorNum <= 30) dropChance = 0.10;
        break;
      case 'pagoda_floor_30_40':
        if (floorNum >= 30 && floorNum <= 40) dropChance = 0.08;
        break;
      case 'pagoda_floor_40_50':
        if (floorNum >= 40 && floorNum <= 50) dropChance = 0.06;
        break;
      case 'pagoda_boss':
        if (isBoss) dropChance = 0.20;
        break;
      case 'void_sovereign':
        if (isBoss && floorNum === 50) dropChance = 0.30;
        break;
      case 'celestial_cat':
        if (isBoss && floorNum === 100) dropChance = 0.50;
        break;
    }

    if (dropChance > 0 && Math.random() < dropChance) {
      drops.push(id);
    }
  }

  return drops;
}

// Export everything
window.SECRET_TECHNIQUES = SECRET_TECHNIQUES;
window.LEGENDARY_INTERNALS = LEGENDARY_INTERNALS;
window.HIDDEN_SKILLS = HIDDEN_SKILLS;
window.CULTIVATION_PASSIVES = CULTIVATION_PASSIVES;
window.CULTIVATION_CONSUMABLES = CULTIVATION_CONSUMABLES;
window.TechniqueSystem = TechniqueSystem;
window.rollBossTechniqueDrop = rollBossTechniqueDrop;
window.rollConsumableDrop = rollConsumableDrop;
