/**
 * dreamRealm.js - The Dream Realm Procedural Story Dungeon
 * "A surreal dungeon generated from YOUR play data."
 *
 * Unlocks at Nascent Soul cultivation realm.
 * Uses player data to create personalized dream content.
 */

// Dream Modifiers - Surreal effects that alter gameplay
const DREAM_MODIFIERS = {
  gravity_shift: {
    id: 'gravity_shift',
    name: 'Gravity Shift',
    emoji: '🔄',
    description: 'Up is down, down is up. Controls are inverted.',
    effect: { invertControls: true },
    rarity: 'uncommon',
    flavorText: '"The world spins beneath your paws..."'
  },
  time_loop: {
    id: 'time_loop',
    name: 'Time Loop',
    emoji: '🔁',
    description: 'Every 5th floor repeats with stronger enemies.',
    effect: { loopEvery: 5, strengthMultiplier: 1.5 },
    rarity: 'rare',
    flavorText: '"Have we been here before? The cats remember..."'
  },
  mirror_world: {
    id: 'mirror_world',
    name: 'Mirror World',
    emoji: '🪞',
    description: 'Fight shadow versions of your own team.',
    effect: { spawnMirrors: true, mirrorDamagePercent: 0.75 },
    rarity: 'rare',
    flavorText: '"Your reflection stares back... and attacks."'
  },
  memory_lane: {
    id: 'memory_lane',
    name: 'Memory Lane',
    emoji: '💭',
    description: 'Relive past game moments as challenges.',
    effect: { usePlayerHistory: true },
    rarity: 'epic',
    flavorText: '"The past is never truly gone..."'
  },
  fading_reality: {
    id: 'fading_reality',
    name: 'Fading Reality',
    emoji: '👻',
    description: 'Everything becomes translucent. 20% chance to phase through attacks.',
    effect: { phaseChance: 0.2 },
    rarity: 'uncommon',
    flavorText: '"Are you really here? Does it matter?"'
  },
  dream_cascade: {
    id: 'dream_cascade',
    name: 'Dream Cascade',
    emoji: '🌊',
    description: 'Damage dealt echoes 3 times at 30% power.',
    effect: { echoHits: 3, echoDamage: 0.3 },
    rarity: 'epic',
    flavorText: '"Every action ripples through eternity..."'
  },
  nightmare_surge: {
    id: 'nightmare_surge',
    name: 'Nightmare Surge',
    emoji: '😱',
    description: 'Enemies deal 50% more damage but drop 100% more loot.',
    effect: { enemyDamageBonus: 0.5, lootBonus: 1.0 },
    rarity: 'uncommon',
    flavorText: '"Face your fears... and their rewards."'
  },
  lucid_control: {
    id: 'lucid_control',
    name: 'Lucid Control',
    emoji: '🧠',
    description: 'You realize this is a dream. All cooldowns reduced by 50%.',
    effect: { cooldownReduction: 0.5 },
    rarity: 'rare',
    flavorText: '"With awareness comes power."'
  },
  collective_unconscious: {
    id: 'collective_unconscious',
    name: 'Collective Unconscious',
    emoji: '🌐',
    description: 'All cats share HP pool but gain +100% combined power.',
    effect: { sharedHP: true, powerBonus: 1.0 },
    rarity: 'epic',
    flavorText: '"We are all one in dreams..."'
  },
  deja_vu: {
    id: 'deja_vu',
    name: 'Deja Vu',
    emoji: '👁️',
    description: 'See enemy attacks before they happen. +25% dodge.',
    effect: { dodgeBonus: 0.25, previewAttacks: true },
    rarity: 'uncommon',
    flavorText: '"This has all happened before..."'
  }
};

// Dream Floor Templates
const DREAM_FLOORS = {
  // Memory Floor - Based on player's game history
  memory: {
    id: 'memory',
    name: 'Memory Fragment',
    emoji: '💭',
    description: 'A crystallized memory from your journey',
    bgColor: '#9370DB',
    types: ['first_boop', 'first_cat', 'first_waifu', 'first_goose', 'achievement_memory', 'milestone_memory'],
    rewardMultiplier: 1.2
  },
  // Nightmare Floor - Based on player's failures/fears
  nightmare: {
    id: 'nightmare',
    name: 'Nightmare Manifestation',
    emoji: '😈',
    description: 'Your fears made manifest',
    bgColor: '#8B0000',
    types: ['death_memory', 'failed_tribulation', 'escaped_goose', 'lost_run', 'broken_combo'],
    rewardMultiplier: 1.5,
    dangerLevel: 'high'
  },
  // Wish Floor - Based on player's aspirations
  wish: {
    id: 'wish',
    name: 'Dream Wish',
    emoji: '🌟',
    description: 'A glimpse of what could be',
    bgColor: '#FFD700',
    types: ['ultimate_cat', 'max_bond_waifu', 'infinite_power', 'perfect_run', 'legendary_drop'],
    rewardMultiplier: 1.3,
    bonusLoot: true
  },
  // Reflection Floor - Based on playstyle
  reflection: {
    id: 'reflection',
    name: 'Soul Reflection',
    emoji: '🪞',
    description: 'A mirror of your cultivation path',
    bgColor: '#4169E1',
    types: ['shadow_self', 'alternate_master', 'inverted_style', 'what_if'],
    rewardMultiplier: 1.4,
    encounterType: 'boss'
  },
  // Void Floor - Random surreal content
  void: {
    id: 'void',
    name: 'Void Between Dreams',
    emoji: '🕳️',
    description: 'The space between thoughts',
    bgColor: '#000000',
    types: ['abstract', 'paradox', 'impossible', 'undefined'],
    rewardMultiplier: 2.0,
    rarity: 'rare'
  }
};

// Dream Enemies - Generated based on player data
const DREAM_ENEMIES = {
  // Memory-based enemies
  shadow_cat: {
    id: 'shadow_cat',
    name: 'Shadow of a Forgotten Cat',
    emoji: '🐱',
    baseHp: 100,
    baseDamage: 15,
    description: 'A cat that was never recruited',
    sourceType: 'missed_recruitment'
  },
  echo_goose: {
    id: 'echo_goose',
    name: 'Echo of Escaped Goose',
    emoji: '🦢',
    baseHp: 150,
    baseDamage: 25,
    description: 'That goose you failed to boop',
    sourceType: 'escaped_goose'
  },
  phantom_waifu: {
    id: 'phantom_waifu',
    name: 'Phantom of Neglected Bonds',
    emoji: '👻',
    baseHp: 200,
    baseDamage: 20,
    description: 'The waifu you never visited',
    sourceType: 'low_bond_waifu'
  },
  memory_fragment: {
    id: 'memory_fragment',
    name: 'Fractured Memory',
    emoji: '💎',
    baseHp: 80,
    baseDamage: 10,
    description: 'A piece of forgotten progress',
    sourceType: 'lost_progress'
  },
  nightmare_self: {
    id: 'nightmare_self',
    name: 'Nightmare Self',
    emoji: '😱',
    baseHp: 300,
    baseDamage: 35,
    description: 'Your darkest cultivation fears',
    sourceType: 'failed_tribulation',
    isBoss: true
  },
  dream_doppelganger: {
    id: 'dream_doppelganger',
    name: 'Dream Doppelganger',
    emoji: '🎭',
    baseHp: 250,
    baseDamage: 30,
    description: 'A mirror of your chosen master',
    sourceType: 'player_reflection',
    isBoss: true
  },
  void_entity: {
    id: 'void_entity',
    name: 'Void Entity',
    emoji: '🌀',
    baseHp: 400,
    baseDamage: 40,
    description: 'Something from beyond dreams',
    sourceType: 'abstract',
    isBoss: true
  },
  celestial_memory: {
    id: 'celestial_memory',
    name: 'Celestial Memory',
    emoji: '✨',
    baseHp: 500,
    baseDamage: 50,
    description: 'An echo of your greatest achievement',
    sourceType: 'achievement',
    isBoss: true
  }
};

// Dream Rewards
const DREAM_REWARDS = {
  dream_essence: {
    id: 'dream_essence',
    name: 'Dream Essence',
    emoji: '💜',
    description: 'Currency of the Dream Realm',
    baseAmount: 10
  },
  lore_fragment: {
    id: 'lore_fragment',
    name: 'Lore Fragment',
    emoji: '📜',
    description: 'A piece of hidden knowledge',
    dropChance: 0.15
  },
  dream_cosmetic: {
    id: 'dream_cosmetic',
    name: 'Dream Cosmetic',
    emoji: '🎨',
    description: 'Ethereal visual enhancement',
    dropChance: 0.05
  },
  dream_walker_cat: {
    id: 'dream_walker_cat',
    name: 'Dream Walker Cat',
    emoji: '🐱',
    description: 'A legendary cat that walks between dreams',
    dropChance: 0.01,
    uniqueDrop: true,
    legendary: true
  }
};

// Dream Cosmetics
const DREAM_COSMETICS = [
  { id: 'ethereal_aura', name: 'Ethereal Aura', emoji: '👻', rarity: 'rare' },
  { id: 'starlight_trail', name: 'Starlight Trail', emoji: '✨', rarity: 'rare' },
  { id: 'dream_mist', name: 'Dream Mist', emoji: '🌫️', rarity: 'uncommon' },
  { id: 'void_whispers', name: 'Void Whispers', emoji: '🕳️', rarity: 'epic' },
  { id: 'memory_sparkles', name: 'Memory Sparkles', emoji: '💫', rarity: 'uncommon' },
  { id: 'nightmare_flames', name: 'Nightmare Flames', emoji: '🔥', rarity: 'epic' },
  { id: 'lucid_glow', name: 'Lucid Glow', emoji: '💡', rarity: 'rare' },
  { id: 'cosmic_dust', name: 'Cosmic Dust', emoji: '🌌', rarity: 'legendary' }
];

/**
 * DreamRealmSystem - Manages the procedural dream dungeon
 */
class DreamRealmSystem {
  constructor() {
    this.modifiers = DREAM_MODIFIERS;
    this.floors = DREAM_FLOORS;
    this.enemies = DREAM_ENEMIES;
    this.rewards = DREAM_REWARDS;
    this.cosmetics = DREAM_COSMETICS;

    // Run state
    this.inDream = false;
    this.currentFloor = 0;
    this.dreamDepth = 0; // How deep into the dream
    this.maxDepth = 10; // Base depth, can increase

    // Active modifiers for current run
    this.activeModifiers = [];

    // Player state in dream
    this.dreamHP = 100;
    this.dreamMaxHP = 100;
    this.dreamPower = 10;
    this.dreamDefense = 5;

    // Current floor data
    this.currentFloorData = null;
    this.currentEnemy = null;
    this.enemyHP = 0;
    this.enemyMaxHP = 0;

    // Combat state
    this.combatState = 'idle'; // idle, selecting, player_turn, enemy_turn, victory, defeat
    this.combatLog = [];

    // Run rewards
    this.runRewards = {
      dreamEssence: 0,
      loreFragments: [],
      cosmetics: [],
      specialCat: null
    };

    // Persistent data
    this.dreamEssence = 0;
    this.unlockedCosmetics = [];
    this.hasWalkerCat = false;
    this.deepestDream = 0;

    // Statistics
    this.stats = {
      totalDreams: 0,
      floorsExplored: 0,
      memoriesRecovered: 0,
      nightmaresConquered: 0,
      wishesGranted: 0,
      reflectionsDefeated: 0,
      voidTravels: 0,
      modifiersExperienced: {},
      bossesDefeated: 0,
      dreamEssenceEarned: 0
    };

    // Dream generation seed (for reproducible dreams)
    this.dreamSeed = null;
  }

  /**
   * Check if player can enter the Dream Realm
   */
  canEnterDreamRealm() {
    // Requires Nascent Soul cultivation realm
    if (!window.cultivationSystem) {
      return { canEnter: false, reason: 'Cultivation system not available' };
    }

    const realmOrder = {
      mortal: 1, qiCondensation: 2, foundationEstablishment: 3,
      coreFormation: 4, nascentSoul: 5, spiritSevering: 6,
      daoSeeking: 7, immortalAscension: 8, trueImmortal: 9,
      heavenlySovereign: 10
    };

    const currentRealm = window.cultivationSystem.currentRealm || 'mortal';
    const currentOrder = realmOrder[currentRealm] || 1;

    if (currentOrder < 5) {
      return {
        canEnter: false,
        reason: `Requires Nascent Soul realm (currently: ${currentRealm})`
      };
    }

    if (this.inDream) {
      return { canEnter: false, reason: 'Already in a dream' };
    }

    return { canEnter: true };
  }

  /**
   * Generate a personalized dream dungeon
   */
  generateDreamDungeon(playerData) {
    const check = this.canEnterDreamRealm();
    if (!check.canEnter) {
      return { success: false, reason: check.reason };
    }

    // Extract player data for personalization
    const data = this.extractPlayerData(playerData);

    // Generate dream seed based on player data
    this.dreamSeed = this.generateDreamSeed(data);

    // Calculate dream depth based on progression
    this.maxDepth = 10 + Math.floor(data.cultivationProgress * 5);

    // Generate floor sequence
    const floorSequence = this.generateFloorSequence(data);

    // Select active modifiers based on playstyle
    this.activeModifiers = this.selectModifiers(data);

    // Initialize run state
    this.inDream = true;
    this.currentFloor = 0;
    this.dreamDepth = 0;
    this.combatState = 'idle';
    this.combatLog = [];

    // Reset run rewards
    this.runRewards = {
      dreamEssence: 0,
      loreFragments: [],
      cosmetics: [],
      specialCat: null
    };

    // Calculate dream stats based on player power
    this.calculateDreamStats(data);

    this.stats.totalDreams++;

    if (window.audioSystem) {
      window.audioSystem.playSFX('dreamEnter');
    }

    this.logCombat('You drift into the Dream Realm...');
    this.logCombat(`Active Modifiers: ${this.activeModifiers.map(m => m.name).join(', ')}`);

    // Advance to first floor
    return this.advanceFloor(floorSequence);
  }

  /**
   * Extract relevant player data for dream generation
   */
  extractPlayerData(playerData) {
    const gs = window.gameState || {};
    const cs = window.catSystem;
    const ws = window.waifuSystem;
    const as = window.achievementSystem;
    const ps = window.pagodaSystem;
    const cultSys = window.cultivationSystem;

    return {
      // Playtime and engagement
      playtime: gs.playtime || 0,
      totalBoops: gs.totalBoops || 0,
      maxCombo: gs.maxCombo || 0,

      // Cat data
      catCount: cs ? cs.getCatCount() : 0,
      favoriteCat: cs ? cs.getMostUsedCat() : null,
      catRealms: cs ? cs.getCatsByRealm() : {},

      // Waifu data
      waifuBonds: ws ? ws.getAllBonds() : {},
      favoriteWaifu: ws ? ws.getHighestBondWaifu() : null,
      neglectedWaifus: ws ? ws.getLowBondWaifus() : [],

      // Achievements
      achievements: as ? as.getUnlockedAchievements() : [],
      achievementProgress: as ? as.getProgressPercent() : 0,

      // Combat history
      pagodaFloor: ps ? ps.highestFloor : 0,
      pagodaDeaths: ps ? (ps.stats?.totalDeaths || 0) : 0,
      bossesDefeated: ps ? (ps.stats?.bossKills || 0) : 0,

      // Cultivation
      cultivationRealm: cultSys ? cultSys.currentRealm : 'mortal',
      cultivationProgress: cultSys ? cultSys.getRealmProgress() : 0,
      tribulationFailures: cultSys ? (cultSys.stats?.tribulationFailures || 0) : 0,

      // Goose data
      gooseBoops: gs.gooseBoops || 0,
      escapedGeese: gs.escapedGeese || 0,
      cobraChickenDefeated: gs.cobraChickenDefeated || false,

      // Master
      selectedMaster: window.masterSystem?.selectedMaster?.id || 'gerald'
    };
  }

  /**
   * Generate a seed for dream generation
   */
  generateDreamSeed(data) {
    // Combine various player stats into a seed
    const components = [
      data.totalBoops,
      data.catCount,
      data.pagodaFloor,
      Object.values(data.waifuBonds || {}).reduce((a, b) => a + b, 0),
      data.achievements.length,
      Date.now()
    ];

    return components.reduce((acc, val) => (acc * 31 + val) % 2147483647, 1);
  }

  /**
   * Generate the floor sequence for this dream
   */
  generateFloorSequence(data) {
    const floors = [];
    const floorTypes = Object.keys(this.floors);

    for (let i = 0; i < this.maxDepth; i++) {
      let floorType;

      // Boss floors every 5 levels
      if ((i + 1) % 5 === 0) {
        floorType = Math.random() < 0.5 ? 'reflection' : 'nightmare';
      } else {
        // Weight floor types based on player data
        const weights = this.calculateFloorWeights(data, i);
        floorType = this.weightedRandom(floorTypes, weights);
      }

      const floor = this.generateFloorContent(floorType, data, i);
      floors.push(floor);
    }

    return floors;
  }

  /**
   * Calculate floor type weights based on player data
   */
  calculateFloorWeights(data, floorIndex) {
    const weights = {
      memory: 30,
      nightmare: 20,
      wish: 25,
      reflection: 15,
      void: 10
    };

    // More memories early, more nightmares late
    if (floorIndex < 3) {
      weights.memory += 20;
      weights.nightmare -= 10;
    } else if (floorIndex > 7) {
      weights.nightmare += 20;
      weights.void += 10;
    }

    // Player with high achievements sees more wishes
    if (data.achievementProgress > 50) {
      weights.wish += 15;
    }

    // Player with tribulation failures sees more nightmares
    if (data.tribulationFailures > 0) {
      weights.nightmare += data.tribulationFailures * 5;
    }

    return weights;
  }

  /**
   * Generate specific content for a floor
   */
  generateFloorContent(floorType, data, floorIndex) {
    const template = this.floors[floorType];
    const subType = template.types[Math.floor(Math.random() * template.types.length)];

    const floor = {
      index: floorIndex,
      type: floorType,
      subType: subType,
      ...template,
      enemies: this.generateEnemiesForFloor(floorType, subType, data, floorIndex),
      narrative: this.generateNarrative(floorType, subType, data),
      modifierEffects: this.calculateModifierEffects(floorType)
    };

    return floor;
  }

  /**
   * Generate enemies for a floor based on type and player data
   */
  generateEnemiesForFloor(floorType, subType, data, floorIndex) {
    const enemies = [];
    const scaling = 1 + floorIndex * 0.15;
    const isBoss = (floorIndex + 1) % 5 === 0;

    if (isBoss) {
      // Generate boss based on floor type
      const bossTemplate = this.selectBossForFloor(floorType, data);
      enemies.push(this.createEnemy(bossTemplate, scaling * 1.5, data));
    } else {
      // Generate 1-3 regular enemies
      const enemyCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < enemyCount; i++) {
        const template = this.selectEnemyForFloor(floorType, subType, data);
        enemies.push(this.createEnemy(template, scaling, data));
      }
    }

    return enemies;
  }

  /**
   * Select a boss template for a floor
   */
  selectBossForFloor(floorType, data) {
    switch (floorType) {
      case 'nightmare':
        return this.enemies.nightmare_self;
      case 'reflection':
        return this.enemies.dream_doppelganger;
      case 'void':
        return this.enemies.void_entity;
      default:
        return this.enemies.celestial_memory;
    }
  }

  /**
   * Select an enemy template for a floor
   */
  selectEnemyForFloor(floorType, subType, data) {
    const options = [];

    switch (floorType) {
      case 'memory':
        options.push(this.enemies.shadow_cat, this.enemies.memory_fragment);
        break;
      case 'nightmare':
        options.push(this.enemies.echo_goose, this.enemies.nightmare_self);
        break;
      case 'wish':
        options.push(this.enemies.celestial_memory, this.enemies.memory_fragment);
        break;
      case 'reflection':
        options.push(this.enemies.dream_doppelganger, this.enemies.phantom_waifu);
        break;
      case 'void':
        options.push(this.enemies.void_entity, this.enemies.memory_fragment);
        break;
    }

    // Filter out bosses for regular encounters
    const regularEnemies = options.filter(e => !e.isBoss);
    if (regularEnemies.length === 0) {
      return this.enemies.memory_fragment;
    }

    return regularEnemies[Math.floor(Math.random() * regularEnemies.length)];
  }

  /**
   * Create an enemy instance with scaling
   */
  createEnemy(template, scaling, data) {
    // Personalize enemy based on player data
    let name = template.name;
    let description = template.description;

    // Add personal touches based on source type
    if (template.sourceType === 'low_bond_waifu' && data.neglectedWaifus.length > 0) {
      const waifu = data.neglectedWaifus[Math.floor(Math.random() * data.neglectedWaifus.length)];
      name = `Phantom of ${waifu.name || 'Neglected Bond'}`;
    } else if (template.sourceType === 'player_reflection') {
      const master = window.masterSystem?.selectedMaster;
      if (master) {
        name = `Shadow ${master.name}`;
        description = `A dark reflection of ${master.name}, ${master.title}`;
      }
    }

    return {
      ...template,
      name,
      description,
      currentHp: Math.floor(template.baseHp * scaling),
      maxHp: Math.floor(template.baseHp * scaling),
      damage: Math.floor(template.baseDamage * scaling),
      scaling
    };
  }

  /**
   * Generate narrative text for a floor
   */
  generateNarrative(floorType, subType, data) {
    const narratives = {
      memory: {
        first_boop: "The echo of your first boop reverberates through the dream...",
        first_cat: `You see ${data.favoriteCat?.name || 'a familiar cat'} gazing at you from the mist.`,
        first_waifu: `${data.favoriteWaifu?.name || 'A gentle presence'} appears before you.`,
        first_goose: "HONK! The memory of your first goose encounter returns!",
        achievement_memory: "Crystallized moments of triumph float around you.",
        milestone_memory: "The path you've walked stretches behind you..."
      },
      nightmare: {
        death_memory: "The sting of defeat washes over you...",
        failed_tribulation: "Lightning crackles as your past failure manifests!",
        escaped_goose: "That goose you couldn't catch... it remembers too.",
        lost_run: "The rewards you lost to carelessness swirl before you.",
        broken_combo: "Your perfect rhythm shatters into discordant echoes."
      },
      wish: {
        ultimate_cat: "A legendary feline of impossible rarity appears...",
        max_bond_waifu: "Perfect harmony... the bond you seek materializes.",
        infinite_power: "Raw cultivation energy flows without limit!",
        perfect_run: "Every boop is critical. Every dodge is perfect.",
        legendary_drop: "Golden light spills from an infinite treasure chest."
      },
      reflection: {
        shadow_self: "You face the darkness within your cultivation.",
        alternate_master: "Another path you could have chosen...",
        inverted_style: "What if you were the opposite of who you are?",
        what_if: "A thousand possibilities collapse into one."
      },
      void: {
        abstract: "Concepts without form drift past you.",
        paradox: "You exist and do not exist simultaneously.",
        impossible: "This place defies all cultivation logic.",
        undefined: "..."
      }
    };

    return narratives[floorType]?.[subType] || "The dream shifts around you...";
  }

  /**
   * Select modifiers based on player data
   */
  selectModifiers(data) {
    const selected = [];
    const available = Object.values(this.modifiers);

    // Always include 1-3 modifiers
    const modifierCount = 1 + Math.floor(Math.random() * 3);

    // Weight modifiers based on player style
    const weights = available.map(mod => {
      let weight = 10;

      // Players with high goose boops get goose-related effects
      if (data.gooseBoops > 100 && mod.id === 'nightmare_surge') {
        weight += 20;
      }

      // Players with high combo get time-related effects
      if (data.maxCombo > 50 && (mod.id === 'time_loop' || mod.id === 'deja_vu')) {
        weight += 15;
      }

      // Players who struggled get easier modifiers
      if (data.pagodaDeaths > 10 && mod.id === 'lucid_control') {
        weight += 25;
      }

      return weight;
    });

    for (let i = 0; i < modifierCount; i++) {
      const index = this.weightedRandomIndex(weights);
      if (index >= 0 && !selected.includes(available[index])) {
        selected.push(available[index]);
        // Track modifier usage
        this.stats.modifiersExperienced[available[index].id] =
          (this.stats.modifiersExperienced[available[index].id] || 0) + 1;
      }
    }

    return selected;
  }

  /**
   * Calculate combined modifier effects for a floor
   */
  calculateModifierEffects(floorType) {
    const effects = {
      damageBonus: 0,
      defenseBonus: 0,
      cooldownReduction: 0,
      dodgeBonus: 0,
      lootBonus: 0,
      enemyDamageBonus: 0,
      phaseChance: 0,
      echoHits: 0,
      echoDamage: 0
    };

    for (const mod of this.activeModifiers) {
      if (mod.effect.cooldownReduction) {
        effects.cooldownReduction += mod.effect.cooldownReduction;
      }
      if (mod.effect.dodgeBonus) {
        effects.dodgeBonus += mod.effect.dodgeBonus;
      }
      if (mod.effect.lootBonus) {
        effects.lootBonus += mod.effect.lootBonus;
      }
      if (mod.effect.enemyDamageBonus) {
        effects.enemyDamageBonus += mod.effect.enemyDamageBonus;
      }
      if (mod.effect.phaseChance) {
        effects.phaseChance += mod.effect.phaseChance;
      }
      if (mod.effect.echoHits) {
        effects.echoHits = mod.effect.echoHits;
        effects.echoDamage = mod.effect.echoDamage;
      }
    }

    return effects;
  }

  /**
   * Calculate dream stats based on player power
   */
  calculateDreamStats(data) {
    let hp = 100;
    let power = 10;
    let defense = 5;

    // Scale with cultivation
    const realmBonuses = {
      mortal: 1, qiCondensation: 1.2, foundationEstablishment: 1.5,
      coreFormation: 2, nascentSoul: 3, spiritSevering: 4,
      daoSeeking: 6, immortalAscension: 10, trueImmortal: 20,
      heavenlySovereign: 50
    };

    const realmMult = realmBonuses[data.cultivationRealm] || 1;
    hp *= realmMult;
    power *= realmMult;
    defense *= realmMult;

    // Add cat bonuses
    hp += data.catCount * 5;
    power += data.catCount * 1;

    // Add waifu bond bonuses
    const totalBonds = Object.values(data.waifuBonds || {}).reduce((a, b) => a + b, 0);
    power += totalBonds * 0.1;

    // Add pagoda progress bonuses
    power += data.pagodaFloor * 0.5;
    defense += data.pagodaFloor * 0.2;

    this.dreamMaxHP = Math.floor(hp);
    this.dreamHP = this.dreamMaxHP;
    this.dreamPower = Math.floor(power);
    this.dreamDefense = Math.floor(defense);
  }

  /**
   * Advance to the next floor
   */
  advanceFloor(floorSequence) {
    this.currentFloor++;
    this.dreamDepth++;
    this.stats.floorsExplored++;

    if (this.currentFloor > floorSequence.length) {
      return this.endDream('victory');
    }

    const floor = floorSequence[this.currentFloor - 1];
    this.currentFloorData = floor;

    // Set up first enemy
    if (floor.enemies.length > 0) {
      this.currentEnemy = floor.enemies[0];
      this.enemyHP = this.currentEnemy.currentHp;
      this.enemyMaxHP = this.currentEnemy.maxHp;
    }

    // Track floor type stats
    switch (floor.type) {
      case 'memory': this.stats.memoriesRecovered++; break;
      case 'nightmare': /* tracked on defeat */ break;
      case 'wish': this.stats.wishesGranted++; break;
      case 'reflection': /* tracked on defeat */ break;
      case 'void': this.stats.voidTravels++; break;
    }

    this.logCombat(`--- Floor ${this.currentFloor}: ${floor.name} ---`);
    this.logCombat(floor.narrative);

    if (this.currentEnemy) {
      this.logCombat(`${this.currentEnemy.emoji} ${this.currentEnemy.name} appears!`);
      this.combatState = 'selecting';
    }

    if (window.audioSystem) {
      window.audioSystem.playSFX('dreamFloor');
    }

    return {
      success: true,
      floor: floor,
      enemy: this.currentEnemy,
      modifiers: this.activeModifiers
    };
  }

  /**
   * Execute a dream attack
   */
  dreamAttack(multiplier = 1.0) {
    if (this.combatState !== 'selecting' || !this.currentEnemy) return null;

    this.combatState = 'player_turn';

    let damage = this.dreamPower * multiplier;

    // Apply modifier effects
    const effects = this.currentFloorData?.modifierEffects || {};

    // Echo damage
    let totalDamage = damage;
    if (effects.echoHits > 0) {
      for (let i = 0; i < effects.echoHits; i++) {
        totalDamage += damage * effects.echoDamage;
      }
      this.logCombat(`Dream Cascade echoes ${effects.echoHits} times!`);
    }

    // Check for crit
    const isCrit = Math.random() < 0.15;
    if (isCrit) {
      totalDamage *= 2;
      this.logCombat('CRITICAL HIT!');
    }

    totalDamage = Math.floor(totalDamage);
    this.enemyHP = Math.max(0, this.enemyHP - totalDamage);

    this.logCombat(`You deal ${totalDamage} dream damage!`);

    if (window.audioSystem) {
      window.audioSystem.playSFX(isCrit ? 'criticalBoop' : 'boop');
    }

    // Check for enemy defeat
    if (this.enemyHP <= 0) {
      return this.onEnemyDefeated();
    }

    // Enemy turn
    setTimeout(() => this.enemyTurn(), 500);
    return { damage: totalDamage, isCrit };
  }

  /**
   * Dream heal ability
   */
  dreamHeal(percentage = 0.25) {
    if (this.combatState !== 'selecting') return null;

    this.combatState = 'player_turn';

    const healAmount = Math.floor(this.dreamMaxHP * percentage);
    this.dreamHP = Math.min(this.dreamMaxHP, this.dreamHP + healAmount);

    this.logCombat(`You restore ${healAmount} dream HP!`);

    if (window.audioSystem) {
      window.audioSystem.playSFX('heal');
    }

    // Enemy turn
    setTimeout(() => this.enemyTurn(), 500);
    return { healed: healAmount };
  }

  /**
   * Enemy turn
   */
  enemyTurn() {
    if (this.combatState === 'victory' || this.combatState === 'defeat') return;

    this.combatState = 'enemy_turn';

    if (!this.currentEnemy) {
      this.combatState = 'selecting';
      return;
    }

    let damage = this.currentEnemy.damage;

    // Apply modifier effects
    const effects = this.currentFloorData?.modifierEffects || {};
    damage *= (1 + effects.enemyDamageBonus);

    // Check for phase (from Fading Reality modifier)
    if (effects.phaseChance > 0 && Math.random() < effects.phaseChance) {
      this.logCombat('You phase through the attack!');
      this.combatState = 'selecting';
      return;
    }

    // Check for dodge
    if (effects.dodgeBonus > 0 && Math.random() < effects.dodgeBonus) {
      this.logCombat('You dodge the attack!');
      this.combatState = 'selecting';
      return;
    }

    // Apply defense
    damage = Math.max(1, damage - this.dreamDefense);
    damage = Math.floor(damage);

    this.dreamHP = Math.max(0, this.dreamHP - damage);

    this.logCombat(`${this.currentEnemy.emoji} deals ${damage} damage!`);

    if (window.audioSystem) {
      window.audioSystem.playSFX('playerHit');
    }

    // Check for player defeat
    if (this.dreamHP <= 0) {
      this.endDream('defeat');
      return;
    }

    this.combatState = 'selecting';
  }

  /**
   * Handle enemy defeated
   */
  onEnemyDefeated() {
    const enemy = this.currentEnemy;
    const floor = this.currentFloorData;

    this.logCombat(`${enemy.emoji} ${enemy.name} fades away...`);

    // Track boss defeats
    if (enemy.isBoss) {
      this.stats.bossesDefeated++;
      if (floor.type === 'nightmare') {
        this.stats.nightmaresConquered++;
      } else if (floor.type === 'reflection') {
        this.stats.reflectionsDefeated++;
      }
    }

    // Calculate rewards
    const rewards = this.calculateFloorRewards(floor, enemy);
    this.runRewards.dreamEssence += rewards.dreamEssence;

    if (rewards.loreFragment) {
      this.runRewards.loreFragments.push(rewards.loreFragment);
    }

    if (rewards.cosmetic) {
      this.runRewards.cosmetics.push(rewards.cosmetic);
    }

    if (rewards.specialCat) {
      this.runRewards.specialCat = rewards.specialCat;
    }

    this.logCombat(`Gained ${rewards.dreamEssence} Dream Essence!`);

    // Check for more enemies on this floor
    const nextEnemyIndex = floor.enemies.indexOf(enemy) + 1;
    if (nextEnemyIndex < floor.enemies.length) {
      this.currentEnemy = floor.enemies[nextEnemyIndex];
      this.enemyHP = this.currentEnemy.currentHp;
      this.enemyMaxHP = this.currentEnemy.maxHp;
      this.logCombat(`${this.currentEnemy.emoji} ${this.currentEnemy.name} appears!`);
      this.combatState = 'selecting';
      return { victory: false, rewards };
    }

    // Floor complete - move to next
    this.combatState = 'victory';

    if (window.audioSystem) {
      window.audioSystem.playSFX('floorClear');
    }

    return { victory: true, rewards, advanceFloor: true };
  }

  /**
   * Calculate rewards for completing a floor
   */
  calculateFloorRewards(floor, enemy) {
    const rewards = {
      dreamEssence: 0,
      loreFragment: null,
      cosmetic: null,
      specialCat: null
    };

    // Base essence
    const baseEssence = this.rewards.dream_essence.baseAmount;
    rewards.dreamEssence = Math.floor(baseEssence * floor.rewardMultiplier * (enemy.isBoss ? 3 : 1));

    // Apply loot bonus from modifiers
    const effects = floor.modifierEffects || {};
    rewards.dreamEssence = Math.floor(rewards.dreamEssence * (1 + effects.lootBonus));

    // Check for lore fragment
    if (Math.random() < this.rewards.lore_fragment.dropChance * (floor.bonusLoot ? 2 : 1)) {
      rewards.loreFragment = {
        id: `dream_lore_${floor.type}_${this.currentFloor}`,
        type: floor.type,
        content: this.generateLoreFragment(floor)
      };
    }

    // Check for cosmetic (boss only)
    if (enemy.isBoss && Math.random() < this.rewards.dream_cosmetic.dropChance) {
      const available = this.cosmetics.filter(c => !this.unlockedCosmetics.includes(c.id));
      if (available.length > 0) {
        rewards.cosmetic = available[Math.floor(Math.random() * available.length)];
      }
    }

    // Check for Dream Walker Cat (very rare, deep dreams only)
    if (!this.hasWalkerCat && this.currentFloor >= 8 && enemy.isBoss) {
      if (Math.random() < this.rewards.dream_walker_cat.dropChance * (this.currentFloor / 10)) {
        rewards.specialCat = {
          id: 'dream_walker_cat',
          name: 'Dream Walker Cat',
          emoji: '🌙',
          realm: 'divine',
          description: 'A legendary cat that walks between dreams',
          stats: {
            innerPurr: 10,
            snootMeridians: 15,
            floofArmor: 8,
            zoomieSteps: 12,
            loafMastery: 10
          }
        };
        this.logCombat('LEGENDARY DROP: Dream Walker Cat!');
      }
    }

    return rewards;
  }

  /**
   * Generate lore fragment content
   */
  generateLoreFragment(floor) {
    const loreTemplates = {
      memory: [
        "In the beginning, there was only the desire to boop...",
        "The first cats were not cats at all, but dreams of cats.",
        "Those who master the snoot, master the dream."
      ],
      nightmare: [
        "Fear not the darkness, for even it can be booped.",
        "Every failure is a lesson written in shadow.",
        "The nightmare ends when you face it with courage."
      ],
      wish: [
        "Dreams manifest for those who believe.",
        "The ultimate cat exists in the space between wishes.",
        "All bonds begin with a single hope."
      ],
      reflection: [
        "Know thyself, cultivator, and know all paths.",
        "The mirror shows not what is, but what could be.",
        "Shadow and light are but two sides of the same boop."
      ],
      void: [
        "In the void, all distinctions fade.",
        "Nothing and everything coexist here.",
        "The void is not empty - it is full of possibility."
      ]
    };

    const templates = loreTemplates[floor.type] || loreTemplates.void;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Flee from the dream
   */
  fleeDream() {
    if (!this.inDream) return null;
    return this.endDream('fled');
  }

  /**
   * End the dream run
   */
  endDream(reason) {
    if (!this.inDream) return null;

    this.inDream = false;

    // Update deepest dream record
    if (this.currentFloor > this.deepestDream) {
      this.deepestDream = this.currentFloor;
    }

    // Apply rewards to persistent storage
    this.dreamEssence += this.runRewards.dreamEssence;
    this.stats.dreamEssenceEarned += this.runRewards.dreamEssence;

    // Unlock cosmetics
    for (const cosmetic of this.runRewards.cosmetics) {
      if (!this.unlockedCosmetics.includes(cosmetic.id)) {
        this.unlockedCosmetics.push(cosmetic.id);
      }
    }

    // Add Dream Walker Cat if obtained
    if (this.runRewards.specialCat) {
      this.hasWalkerCat = true;
      // Add to cat system if available
      if (window.catSystem && typeof window.catSystem.addCat === 'function') {
        window.catSystem.addCat(this.runRewards.specialCat);
      }
    }

    // Deliver lore fragments
    if (window.loreSystem) {
      for (const lore of this.runRewards.loreFragments) {
        window.loreSystem.addFragment(lore);
      }
    }

    const result = {
      reason,
      floorsCleared: this.currentFloor - 1,
      dreamEssenceEarned: this.runRewards.dreamEssence,
      loreFragments: this.runRewards.loreFragments.length,
      cosmeticsUnlocked: this.runRewards.cosmetics.length,
      specialCat: this.runRewards.specialCat
    };

    if (window.audioSystem) {
      window.audioSystem.playSFX(reason === 'victory' ? 'dreamVictory' : 'dreamEnd');
    }

    this.logCombat(`--- Dream ${reason === 'victory' ? 'Complete' : 'Ended'} ---`);
    this.logCombat(`Floors: ${result.floorsCleared}, Essence: ${result.dreamEssenceEarned}`);

    this.combatState = reason;
    return result;
  }

  /**
   * Weighted random selection
   */
  weightedRandom(items, weights) {
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;

    for (const item of items) {
      roll -= weights[item] || 0;
      if (roll <= 0) return item;
    }

    return items[0];
  }

  /**
   * Weighted random index selection
   */
  weightedRandomIndex(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;

    for (let i = 0; i < weights.length; i++) {
      roll -= weights[i];
      if (roll <= 0) return i;
    }

    return 0;
  }

  /**
   * Log combat message
   */
  logCombat(message) {
    this.combatLog.push({
      message,
      timestamp: Date.now()
    });

    if (this.combatLog.length > 100) {
      this.combatLog = this.combatLog.slice(-100);
    }
  }

  /**
   * Get dream shop items (spend dream essence)
   */
  getDreamShopItems() {
    return [
      { id: 'essence_boost', name: 'Dream Clarity', cost: 50, effect: { nextRunEssenceBonus: 0.25 }, description: '+25% Dream Essence next run' },
      { id: 'hp_boost', name: 'Resilient Dreamer', cost: 100, effect: { permanentHpBonus: 10 }, description: '+10 permanent Dream HP' },
      { id: 'power_boost', name: 'Dream Mastery', cost: 150, effect: { permanentPowerBonus: 2 }, description: '+2 permanent Dream Power' },
      { id: 'depth_increase', name: 'Deep Dreaming', cost: 200, effect: { maxDepthBonus: 2 }, description: '+2 max Dream Depth' },
      { id: 'modifier_choice', name: 'Lucid Selection', cost: 300, effect: { canChooseModifier: true }, description: 'Choose one modifier next run' }
    ];
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      dreamEssence: this.dreamEssence,
      unlockedCosmetics: this.unlockedCosmetics,
      hasWalkerCat: this.hasWalkerCat,
      deepestDream: this.deepestDream,
      stats: this.stats
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (!data) return;

    if (typeof data.dreamEssence === 'number') this.dreamEssence = data.dreamEssence;
    if (Array.isArray(data.unlockedCosmetics)) this.unlockedCosmetics = data.unlockedCosmetics;
    if (typeof data.hasWalkerCat === 'boolean') this.hasWalkerCat = data.hasWalkerCat;
    if (typeof data.deepestDream === 'number') this.deepestDream = data.deepestDream;
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
  }

  /**
   * Reset system (for prestige)
   */
  reset(keepUnlocks = false) {
    this.inDream = false;
    this.currentFloor = 0;
    this.dreamDepth = 0;
    this.activeModifiers = [];
    this.combatLog = [];

    if (!keepUnlocks) {
      this.dreamEssence = 0;
      this.unlockedCosmetics = [];
      this.hasWalkerCat = false;
      this.deepestDream = 0;
      this.stats = {
        totalDreams: 0,
        floorsExplored: 0,
        memoriesRecovered: 0,
        nightmaresConquered: 0,
        wishesGranted: 0,
        reflectionsDefeated: 0,
        voidTravels: 0,
        modifiersExperienced: {},
        bossesDefeated: 0,
        dreamEssenceEarned: 0
      };
    }
  }
}

// Export
window.DREAM_MODIFIERS = DREAM_MODIFIERS;
window.DREAM_FLOORS = DREAM_FLOORS;
window.DREAM_ENEMIES = DREAM_ENEMIES;
window.DREAM_REWARDS = DREAM_REWARDS;
window.DREAM_COSMETICS = DREAM_COSMETICS;
window.DreamRealmSystem = DreamRealmSystem;
