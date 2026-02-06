/**
 * gooseDimension.js - The Goose Dimension
 * "EVERYTHING is geese. HONK."
 *
 * A comedy horror dungeon where reality has been consumed by geese.
 * Unlocked after defeating Cobra Chicken AND achieving 500 goose boops.
 */

// ===================================
// GOOSE ENEMIES
// ===================================

const GOOSE_DIMENSION_ENEMIES = {
  // === NORMAL GEESE ===
  goose: {
    id: 'goose',
    name: 'Goose',
    emoji: '🦢',
    title: 'Just a Goose',
    description: 'Or is it? It stares at you with knowing eyes.',
    tier: 'normal',
    baseHp: 30,
    baseDamage: 8,
    baseDefense: 2,
    speed: 1.0,
    honkValue: 1,
    sanityDrain: 1,
    abilities: ['honk'],
    dropChance: 0.5,
    dialogue: [
      'Honk.',
      '*stares*',
      '*aggressive waddling*'
    ]
  },

  goose_with_knife: {
    id: 'goose_with_knife',
    name: 'Goose (With Knife)',
    emoji: '🦢🔪',
    title: 'Armed and Dangerous',
    description: 'Where did it get that knife? WHERE?!',
    tier: 'normal',
    baseHp: 25,
    baseDamage: 18,
    baseDefense: 0,
    speed: 1.3,
    honkValue: 2,
    sanityDrain: 3,
    abilities: ['stab', 'menacing_waddle'],
    dropChance: 0.6,
    dialogue: [
      '*twirls knife menacingly*',
      'Honk. (Translation: Nothing personal, kid.)',
      '*approaches with malicious intent*'
    ]
  },

  goose_in_disguise: {
    id: 'goose_in_disguise',
    name: 'Definitely Not a Goose',
    emoji: '🥸',
    title: 'Totally a Normal Cat',
    description: 'A perfectly normal cat. Pay no attention to the honking.',
    tier: 'normal',
    baseHp: 40,
    baseDamage: 10,
    baseDefense: 5,
    speed: 0.8,
    honkValue: 3,
    sanityDrain: 5,
    abilities: ['disguise_fail', 'surprise_honk'],
    dropChance: 0.55,
    dialogue: [
      'Meow? ...I mean... HONK!',
      '*adjusts fake cat ears nervously*',
      'Fellow cats, am I right?'
    ],
    revealAnimation: true
  },

  bread_goose: {
    id: 'bread_goose',
    name: 'Bread-Seeking Goose',
    emoji: '🦢🍞',
    title: 'Carbohydrate Enthusiast',
    description: 'It can smell the bread crumbs in your inventory.',
    tier: 'normal',
    baseHp: 35,
    baseDamage: 12,
    baseDefense: 3,
    speed: 1.5,
    honkValue: 2,
    sanityDrain: 2,
    abilities: ['bread_sense', 'frantic_pecking'],
    dropChance: 0.5,
    stealsBreadCrumbs: true,
    dialogue: [
      'HONK?! (Translation: IS THAT BREAD?!)',
      '*sniffs aggressively*',
      '*eyes widen at your pockets*'
    ]
  },

  // === ELITE GEESE ===
  mecha_goose: {
    id: 'mecha_goose',
    name: 'MECHA-GOOSE 9000',
    emoji: '🤖🦢',
    title: 'Technological Terror',
    description: 'Half goose. Half machine. All honk.',
    tier: 'elite',
    baseHp: 150,
    baseDamage: 25,
    baseDefense: 15,
    speed: 0.7,
    honkValue: 8,
    sanityDrain: 10,
    abilities: ['laser_honk', 'rocket_waddle', 'target_acquired'],
    dropChance: 0.75,
    dialogue: [
      'HONK PROTOCOL: ENGAGED',
      '*mechanical whirring* THREAT DETECTED',
      '01001000 01001111 01001110 01001011' // Binary for HONK
    ],
    bossMusic: true
  },

  goose_hydra: {
    id: 'goose_hydra',
    name: 'The Goose Hydra',
    emoji: '🦢🦢🦢',
    title: 'Many Heads, One Honk',
    description: 'Cut off one head, two more honk in its place.',
    tier: 'elite',
    baseHp: 200,
    baseDamage: 15,
    baseDefense: 8,
    speed: 0.5,
    heads: 3,
    maxHeads: 7,
    honkValue: 10,
    sanityDrain: 15,
    abilities: ['multi_honk', 'head_regeneration', 'synchronized_attack'],
    dropChance: 0.8,
    dialogue: [
      '*TRIPLE HONK*',
      '*heads argue among themselves*',
      'HONK! HONK! honk? HONK!'
    ]
  },

  stealth_goose: {
    id: 'stealth_goose',
    name: 'Stealth Goose',
    emoji: '👻🦢',
    title: 'The Silent Honk',
    description: 'You cannot see it. But it can see you. Always.',
    tier: 'elite',
    baseHp: 80,
    baseDamage: 35,
    baseDefense: 3,
    speed: 2.0,
    honkValue: 7,
    sanityDrain: 20,
    abilities: ['invisibility', 'backstab', 'whispered_honk'],
    dropChance: 0.7,
    startsInvisible: true,
    dialogue: [
      '*silence*',
      '...honk...',
      '*appears behind you* Nothing personnel, kid.'
    ]
  },

  goose_scholar: {
    id: 'goose_scholar',
    name: 'The Goose Scholar',
    emoji: '🦢📚',
    title: 'Keeper of Forbidden Honks',
    description: 'It has read the ancient texts. It knows things.',
    tier: 'elite',
    baseHp: 120,
    baseDamage: 20,
    baseDefense: 10,
    speed: 0.6,
    honkValue: 12,
    sanityDrain: 25,
    abilities: ['eldritch_knowledge', 'summon_minions', 'reality_honk'],
    dropChance: 0.85,
    dialogue: [
      '*adjusts tiny glasses* Honk. (Translation: According to my calculations...)',
      'The prophecy spoke of you...',
      '*reads from forbidden tome* Ph\'nglui mglw\'nafh HONK R\'lyeh wgah\'nagl fhtagn'
    ]
  },

  // === BOSSES ===
  the_original_goose: {
    id: 'the_original_goose',
    name: 'The Original Goose',
    emoji: '🦢👑',
    title: 'First of Its Kind',
    description: 'The one that started it all. The Untitled one fears it.',
    tier: 'boss',
    floor: 10,
    baseHp: 500,
    baseDamage: 30,
    baseDefense: 15,
    speed: 1.0,
    phases: 2,
    honkValue: 50,
    sanityDrain: 30,
    abilities: ['primordial_honk', 'summon_the_flock', 'ancestral_rage'],
    rewards: { breadCrumbs: 100, sanityRestore: 20 },
    dialogue: [
      'I was there at the beginning. I shall be there at the end.',
      'HONK! (Translation: YOU DARE CHALLENGE THE ORIGINAL?!)',
      '*all other geese bow*'
    ],
    flavorText: '"Before there was chaos, there was... HONK."'
  },

  goose_king: {
    id: 'goose_king',
    name: 'The Goose King',
    emoji: '🦢👑✨',
    title: 'Ruler of the Dimension',
    description: 'All geese serve the King. Even you will, eventually.',
    tier: 'boss',
    floor: 20,
    baseHp: 1000,
    baseDamage: 45,
    baseDefense: 25,
    speed: 0.8,
    phases: 3,
    honkValue: 100,
    sanityDrain: 50,
    abilities: ['royal_decree', 'bread_tax', 'crown_of_chaos', 'summon_royal_guard'],
    rewards: { breadCrumbs: 250, goldenFeathers: 3 },
    dialogue: [
      'KNEEL BEFORE YOUR KING!',
      '*adjusts crown made of bread*',
      'My subjects! TO WAR!'
    ],
    flavorText: '"Heavy is the head that wears the crown. Unless you\'re a goose."'
  },

  cosmic_honk: {
    id: 'cosmic_honk',
    name: 'Cosmic Honk',
    emoji: '🌌🦢',
    title: 'Echo of the Void',
    description: 'A honk so powerful it echoes through dimensions.',
    tier: 'boss',
    floor: 30,
    baseHp: 2000,
    baseDamage: 60,
    baseDefense: 30,
    speed: 1.2,
    phases: 4,
    honkValue: 200,
    sanityDrain: 80,
    abilities: ['dimension_tear', 'cosmic_screech', 'void_waddle', 'reality_unmaking'],
    rewards: { breadCrumbs: 500, voidEssence: 1 },
    dialogue: [
      '*speaks in frequencies that shouldn\'t exist*',
      'H̷̨̛O̴̢̧N̷̡K̵̢',
      'YOUR REALITY IS BUT A POND I WADE THROUGH'
    ],
    flavorText: '"When you gaze into the void, the void honks back."'
  },

  // === FINAL BOSS ===
  the_primordial_honk: {
    id: 'the_primordial_honk',
    name: 'THE PRIMORDIAL HONK',
    emoji: '🌟🦢🌟',
    title: 'Beginning and End',
    description: 'The first goose. The last goose. The eternal goose. The HONK that created all things.',
    tier: 'final',
    floor: 50,
    baseHp: 10000,
    baseDamage: 100,
    baseDefense: 50,
    speed: 1.5,
    phases: 5,
    honkValue: 1000,
    sanityDrain: 100,
    abilities: [
      'genesis_honk',
      'apocalypse_waddle',
      'create_goose',
      'unmake_reality',
      'eternal_silence',
      'the_final_honk'
    ],
    phaseTransitions: {
      1: { hp: 0.8, ability: 'summon_aspects', dialogue: 'YOU FACE THE PRIMORDIAL! OBSERVE MY ASPECTS!' },
      2: { hp: 0.6, ability: 'dimension_collapse', dialogue: 'THIS DIMENSION BENDS TO MY WILL!' },
      3: { hp: 0.4, ability: 'time_honk', dialogue: 'I HAVE HONKED BEFORE TIME. I WILL HONK AFTER.' },
      4: { hp: 0.2, ability: 'desperate_measure', dialogue: 'NO! I AM ETERNAL! I AM... HONK!' },
      5: { hp: 0.0, ability: 'the_final_honk', dialogue: '...' }
    },
    rewards: {
      title: 'Goose Dimension Survivor',
      cat: 'goose_touched_cat',
      permanent: { gooseSpawnRate: 0.5, gooseRewards: 2.0 },
      breadCrumbs: 10000,
      achievement: 'primordial_slayer'
    },
    dialogue: [
      '...',
      'ḨONK',
      'I AM THAT I AM. I AM HONK.',
      'BEFORE THE FIRST CAT, THERE WAS GOOSE.',
      'AFTER THE LAST CAT, THERE WILL BE GOOSE.',
      'YOU CANNOT DEFEAT WHAT HAS ALWAYS BEEN.'
    ],
    flavorText: '"In the beginning, there was the HONK. And the HONK was good."'
  }
};

// ===================================
// DIMENSION JOKES & FOURTH WALL BREAKS
// ===================================

const DIMENSION_JOKES = {
  // Fourth wall breaks that can happen randomly
  fourthWallBreaks: [
    { trigger: 'random', chance: 0.02, text: '*goose looks directly at your screen* You know this is all just a game, right? ...HONK!', sanityDrain: 5 },
    { trigger: 'random', chance: 0.01, text: 'Hey, you. Yes, YOU, the one holding the phone/mouse. Feed me bread.', sanityDrain: 10 },
    { trigger: 'lowHealth', text: 'Pro tip from a goose: Maybe try using the healing button? Just a thought. HONK.', sanityDrain: 0 },
    { trigger: 'highSanity', text: '*a goose whispers* Your sanity is too high. We\'ll fix that.', sanityDrain: 15 },
    { trigger: 'longSession', text: 'You\'ve been here a while. The geese appreciate your dedication. Join us.', sanityDrain: 20 },
    { trigger: 'bossDefeat', text: '*slow clap from all geese* Nice. The developers would be proud. I mean... HONK!', sanityDrain: 0 }
  ],

  // Random honk messages that appear in the UI
  randomHonks: [
    'Honk.',
    'HONK!',
    'H O N K',
    'honk?',
    '*aggressive honking*',
    '(distant honking)',
    'Honk honk honk... (goose morse code)',
    '01001000 01001111 01001110 01001011',
    'hjOnK',
    '*ominous honking*',
    'The honking... it never stops...',
    'Honk. (Translation: Honk.)',
    '~HONK~',
    'h o n k w a v e',
    '*existential honking*'
  ],

  // UI elements the goose can "steal"
  stealableUIElements: [
    { element: 'boop_button', stealMessage: '*a goose waddles away with your boop button*', returnTime: 5000 },
    { element: 'health_bar', stealMessage: '*a goose steals your health bar* (don\'t worry, you still have health. probably.)', returnTime: 3000 },
    { element: 'bread_counter', stealMessage: '*a goose guards your bread crumbs jealously*', returnTime: 8000 },
    { element: 'honk_meter', stealMessage: 'The honk meter has honked itself out of existence. Temporarily.', returnTime: 4000 },
    { element: 'sanity_display', stealMessage: 'What sanity? HONK!', returnTime: 6000 }
  ],

  // Environment descriptions
  environmentDescriptions: [
    'The trees are geese. The floor is geese. You look up and see only... goose.',
    'A goose-shaped cloud floats overhead. It honks. Clouds shouldn\'t honk.',
    'The river flows with liquid goose. Don\'t ask.',
    'Every blade of grass is actually a very flat goose.',
    'The sun rises. It\'s a goose. Of course it is.',
    'You step on what you think is a rock. It honks.',
    'The wind whispers. It says "honk".',
    'Mountains in the distance. They\'re geese standing on each other\'s shoulders.',
    'A bush rustles. Seven geese emerge. Where were they all fitting?',
    'The stars at night are big and bright. And shaped like geese.'
  ],

  // Surreal events
  surrealEvents: [
    { name: 'Bread Rain', effect: '+50 Bread Crumbs', description: 'It\'s raining bread! The geese are in a frenzy!', visual: 'bread_falling' },
    { name: 'Goose Parade', effect: 'All enemies briefly stop attacking', description: 'The geese form a parade. They expect you to watch.', visual: 'parade' },
    { name: 'Honk Echo', effect: 'Double HONK meter gain', description: 'Your honks echo through the dimension. Even the boss pauses to listen.', visual: 'echo_waves' },
    { name: 'Dimensional Hiccup', effect: 'Random teleport', description: 'Reality burps. You\'re somewhere else now.', visual: 'glitch' },
    { name: 'Goose Philosophy', effect: '+5 Sanity (surprisingly)', description: 'A goose sits beside you and discusses the meaning of life. It\'s actually quite insightful.', visual: 'thinking_goose' },
    { name: 'Bread Shortage', effect: 'Enemies become aggressive', description: 'The bread supplies are low. The geese are ANGRY.', visual: 'red_tint' },
    { name: 'Mirror Dimension', effect: 'Everything is backwards', description: 'KNOH! Wait, that\'s HONK backwards...', visual: 'mirror_flip' },
    { name: 'Goose Time', effect: 'Time moves at goose speed', description: 'Time slows to a waddle. Everything... takes... longer...', visual: 'slowmo' }
  ]
};

// ===================================
// GOOSE DIMENSION SYSTEM
// ===================================

class GooseDimensionSystem {
  constructor() {
    this.enemies = GOOSE_DIMENSION_ENEMIES;
    this.jokes = DIMENSION_JOKES;

    // Run state
    this.inDimension = false;
    this.currentFloor = 0;
    this.highestFloor = 0;

    // Currencies
    this.breadCrumbs = 0;
    this.voidEssence = 0;

    // Player state
    this.playerHp = 100;
    this.playerMaxHp = 100;
    this.playerDamage = 15;
    this.playerDefense = 5;

    // Cat team state (each cat has sanity)
    this.catTeam = [];
    this.catSanity = {}; // catId -> sanity (0-100)

    // Combat
    this.currentEnemy = null;
    this.enemyHp = 0;
    this.enemyMaxHp = 0;
    this.combatLog = [];

    // Special meters
    this.honkMeter = 0;
    this.maxHonkMeter = 100;
    this.sanityLevel = 100;
    this.maxSanity = 100;

    // UI Theft state
    this.stolenElements = {};
    this.elementReturnTimers = {};

    // Active effects
    this.activeEffects = [];
    this.activeSurrealEvent = null;

    // Fourth wall break cooldown
    this.lastFourthWallBreak = 0;
    this.fourthWallCooldown = 60000; // 1 minute minimum between breaks

    // Stats
    this.stats = {
      totalRuns: 0,
      floorsCleared: 0,
      geeseBonked: 0,
      breadCrumbsCollected: 0,
      sanityLost: 0,
      sanityRecovered: 0,
      fourthWallBreaksExperienced: 0,
      uiElementsStolen: 0,
      primordialDefeated: false,
      fastestPrimordialKill: null
    };

    // Rewards (unlocked after defeating Primordial Honk)
    this.rewards = {
      unlocked: false,
      titleEarned: false,
      catEarned: false,
      permanentEffectsApplied: false
    };

    // Random honk interval
    this.honkInterval = null;
  }

  // ===================================
  // UNLOCK CHECK
  // ===================================

  canEnterDimension() {
    // Check requirements: Cobra Chicken defeated AND 500 goose boops
    const cobraDefeated = window.gameState?.cobraChickenDefeated ||
      window.gooseSystem?.cobraChickenDefeated || false;
    const gooseBoops = window.gameState?.gooseBoops ||
      window.gooseSystem?.gooseBoops || 0;

    return cobraDefeated && gooseBoops >= 500;
  }

  getUnlockProgress() {
    const cobraDefeated = window.gameState?.cobraChickenDefeated ||
      window.gooseSystem?.cobraChickenDefeated || false;
    const gooseBoops = window.gameState?.gooseBoops ||
      window.gooseSystem?.gooseBoops || 0;

    return {
      cobraChickenDefeated: cobraDefeated,
      gooseBoops: gooseBoops,
      requiredBoops: 500,
      progress: Math.min(1, gooseBoops / 500),
      canEnter: cobraDefeated && gooseBoops >= 500
    };
  }

  // ===================================
  // RUN MANAGEMENT
  // ===================================

  startRun(selectedCats = []) {
    if (this.inDimension) return { success: false, reason: 'Already in dimension' };
    if (!this.canEnterDimension()) return { success: false, reason: 'Requirements not met' };

    this.inDimension = true;
    this.currentFloor = 0;
    this.combatLog = [];

    // Initialize cat team with sanity
    this.catTeam = selectedCats;
    this.catSanity = {};
    for (const catId of selectedCats) {
      this.catSanity[catId] = 100; // Start at full sanity
    }

    // Calculate player stats from cats
    this.calculatePlayerStats(selectedCats);

    // Reset meters
    this.honkMeter = 0;
    this.sanityLevel = 100;
    this.breadCrumbs = 0;
    this.activeEffects = [];
    this.activeSurrealEvent = null;

    // Clear stolen UI elements
    this.stolenElements = {};
    for (const timerId of Object.values(this.elementReturnTimers)) {
      clearTimeout(timerId);
    }
    this.elementReturnTimers = {};

    this.stats.totalRuns++;

    // Play entrance dialogue
    this.logCombat('You step through the portal...');
    this.logCombat('Everything is geese.');
    this.logCombat('The geese are everything.');
    this.logCombat('HONK.');

    // Start random honk generator
    this.startRandomHonks();

    // Start the first floor
    this.advanceFloor();

    if (window.audioSystem) {
      window.audioSystem.playSFX('dimensionEnter');
    }

    return { success: true, message: 'Welcome to the Goose Dimension.' };
  }

  calculatePlayerStats(selectedCats) {
    let hp = 100;
    let damage = 15;
    let defense = 5;

    if (window.catSystem && selectedCats.length > 0) {
      for (const catId of selectedCats) {
        const cat = window.catSystem.getCatById(catId);
        if (cat) {
          hp += cat.stats?.hp || 10;
          damage += cat.stats?.attack || 3;
          defense += cat.stats?.defense || 1;
        }
      }
    }

    this.playerMaxHp = hp;
    this.playerHp = hp;
    this.playerDamage = damage;
    this.playerDefense = defense;
  }

  advanceFloor() {
    this.currentFloor++;
    this.stats.floorsCleared++;

    if (this.currentFloor > this.highestFloor) {
      this.highestFloor = this.currentFloor;
    }

    // Check for boss floors
    if (this.currentFloor === 50) {
      this.spawnFinalBoss();
    } else if (this.currentFloor % 10 === 0) {
      this.spawnBoss();
    } else {
      this.spawnEnemy();
    }

    // Random surreal event chance
    if (Math.random() < 0.15) {
      this.triggerSurrealEvent();
    }

    // Fourth wall break check
    this.checkFourthWallBreak('random');

    // UI theft check
    this.checkUITheft();

    // Show environment description
    if (Math.random() < 0.3) {
      const desc = this.jokes.environmentDescriptions[
        Math.floor(Math.random() * this.jokes.environmentDescriptions.length)
      ];
      this.logCombat(desc);
    }

    return this.currentFloor;
  }

  // ===================================
  // ENEMY SPAWNING
  // ===================================

  spawnEnemy() {
    // Determine enemy tier based on floor
    let tier = 'normal';
    if (Math.random() < 0.15 + (this.currentFloor * 0.005)) {
      tier = 'elite';
    }

    // Get valid enemies for tier
    const validEnemies = Object.values(this.enemies).filter(e => e.tier === tier);
    if (validEnemies.length === 0) {
      // Fallback to normal goose
      this.currentEnemy = { ...this.enemies.goose };
    } else {
      this.currentEnemy = { ...validEnemies[Math.floor(Math.random() * validEnemies.length)] };
    }

    // Scale enemy stats
    const scaling = 1 + (this.currentFloor - 1) * 0.15;
    this.enemyMaxHp = Math.floor(this.currentEnemy.baseHp * scaling);
    this.enemyHp = this.enemyMaxHp;

    // Show spawn message
    const dialogue = this.currentEnemy.dialogue[
      Math.floor(Math.random() * this.currentEnemy.dialogue.length)
    ];
    this.logCombat(`${this.currentEnemy.emoji} ${this.currentEnemy.name} appears!`);
    this.logCombat(`"${dialogue}"`);

    if (window.audioSystem) {
      window.audioSystem.playSFX('goose');
    }
  }

  spawnBoss() {
    // Find boss for current floor
    const bossFloor = this.currentFloor;
    let boss = Object.values(this.enemies).find(e =>
      e.tier === 'boss' && e.floor === bossFloor
    );

    if (!boss) {
      // Use Cosmic Honk as default high-floor boss
      boss = this.enemies.cosmic_honk;
    }

    this.currentEnemy = {
      ...boss,
      isBoss: true,
      currentPhase: 1
    };

    const scaling = 1 + (this.currentFloor / 10 - 1) * 0.3;
    this.enemyMaxHp = Math.floor(boss.baseHp * scaling);
    this.enemyHp = this.enemyMaxHp;

    this.logCombat(`=== BOSS BATTLE ===`);
    this.logCombat(`${boss.emoji} ${boss.name} - ${boss.title}!`);
    this.logCombat(boss.flavorText || 'HONK.');

    if (window.audioSystem) {
      window.audioSystem.playSFX('bossSpawn');
    }
  }

  spawnFinalBoss() {
    const primordial = this.enemies.the_primordial_honk;

    this.currentEnemy = {
      ...primordial,
      isBoss: true,
      isFinalBoss: true,
      currentPhase: 1,
      startTime: Date.now()
    };

    this.enemyMaxHp = primordial.baseHp;
    this.enemyHp = this.enemyMaxHp;

    this.logCombat(`=======================================`);
    this.logCombat(`THE PRIMORDIAL HONK AWAKENS`);
    this.logCombat(`=======================================`);
    this.logCombat(primordial.flavorText);
    this.logCombat(`...`);

    // Dramatic pause
    setTimeout(() => {
      this.logCombat(`H O N K`);
    }, 2000);

    if (window.audioSystem) {
      window.audioSystem.playSFX('finalBossSpawn');
    }
  }

  // ===================================
  // COMBAT
  // ===================================

  attack(multiplier = 1.0) {
    if (!this.inDimension || !this.currentEnemy) return null;

    // Calculate damage
    let damage = this.playerDamage * multiplier;

    // Apply sanity modifier (lower sanity = more damage but also more damage taken)
    const sanityMod = this.getSanityModifier();
    damage *= sanityMod.damageDealt;

    // Apply cat sanity effects
    damage *= this.getCatSanityBonus();

    // Crit check
    const critChance = 0.1 + (this.honkMeter / 500); // Honk meter increases crit chance
    const isCrit = Math.random() < critChance;
    if (isCrit) {
      damage *= 2;
    }

    // Apply defense
    const enemyDef = this.currentEnemy.baseDefense || 0;
    damage = Math.max(1, damage - enemyDef * 0.5);
    damage = Math.floor(damage);

    this.enemyHp = Math.max(0, this.enemyHp - damage);

    // Log attack
    const critText = isCrit ? ' CRITICAL HONK!' : '';
    this.logCombat(`You boop for ${damage} damage!${critText}`);

    // Gain HONK meter
    const honkGain = this.currentEnemy.honkValue || 1;
    this.gainHonk(honkGain);

    // Lose sanity from combat
    const sanityLoss = this.currentEnemy.sanityDrain || 1;
    this.loseSanity(sanityLoss);

    // Check for kill
    if (this.enemyHp <= 0) {
      return this.onEnemyDefeated();
    }

    // Enemy counterattack
    return this.enemyAttack();
  }

  enemyAttack() {
    if (!this.currentEnemy) return null;

    let damage = this.currentEnemy.baseDamage || 10;

    // Scale with floor
    const scaling = 1 + (this.currentFloor - 1) * 0.1;
    damage = Math.floor(damage * scaling);

    // Apply sanity modifier
    const sanityMod = this.getSanityModifier();
    damage = Math.floor(damage * sanityMod.damageTaken);

    // Apply defense
    damage = Math.max(1, damage - this.playerDefense);

    this.playerHp = Math.max(0, this.playerHp - damage);

    // Pick a random dialogue
    const dialogue = this.currentEnemy.dialogue[
      Math.floor(Math.random() * this.currentEnemy.dialogue.length)
    ];
    this.logCombat(`${this.currentEnemy.emoji} attacks for ${damage}! "${dialogue}"`);

    // Additional sanity loss from being attacked
    this.loseSanity(Math.ceil(this.currentEnemy.sanityDrain / 2));

    // Check for defeat
    if (this.playerHp <= 0) {
      return this.endRun('defeat');
    }

    // Check for phase transition (bosses)
    if (this.currentEnemy.isBoss) {
      this.checkPhaseTransition();
    }

    return { status: 'ongoing', playerHp: this.playerHp, enemyHp: this.enemyHp };
  }

  onEnemyDefeated() {
    this.stats.geeseBonked++;

    const isBoss = this.currentEnemy.isBoss;
    const isFinalBoss = this.currentEnemy.isFinalBoss;

    // Award bread crumbs
    let crumbReward = this.currentFloor * 5;
    if (isBoss) crumbReward *= 5;
    if (isFinalBoss) crumbReward *= 10;

    // Check if enemy steals bread crumbs
    if (this.currentEnemy.stealsBreadCrumbs && this.breadCrumbs > 0) {
      const stolen = Math.floor(this.breadCrumbs * 0.1);
      this.breadCrumbs -= stolen;
      this.logCombat(`The goose managed to steal ${stolen} bread crumbs in its death throes!`);
    }

    this.breadCrumbs += crumbReward;
    this.stats.breadCrumbsCollected += crumbReward;

    this.logCombat(`${this.currentEnemy.name} has been BONKED!`);
    this.logCombat(`+${crumbReward} Bread Crumbs!`);

    // Fourth wall break on boss defeat
    if (isBoss) {
      this.checkFourthWallBreak('bossDefeat');
    }

    // Final boss special handling
    if (isFinalBoss) {
      return this.onPrimordialDefeated();
    }

    // Boss rewards
    if (isBoss && this.currentEnemy.rewards) {
      if (this.currentEnemy.rewards.sanityRestore) {
        this.recoverSanity(this.currentEnemy.rewards.sanityRestore);
      }
      if (this.currentEnemy.rewards.goldenFeathers) {
        if (window.gameState) {
          window.gameState.goldenFeathers =
            (window.gameState.goldenFeathers || 0) + this.currentEnemy.rewards.goldenFeathers;
        }
        this.logCombat(`+${this.currentEnemy.rewards.goldenFeathers} Golden Feathers!`);
      }
    }

    if (window.audioSystem) {
      window.audioSystem.playSFX(isBoss ? 'bossDefeat' : 'goose_hit');
    }

    // Advance to next floor
    setTimeout(() => {
      if (this.inDimension) {
        this.advanceFloor();
      }
    }, 1500);

    return { status: 'victory', floor: this.currentFloor };
  }

  onPrimordialDefeated() {
    const killTime = Date.now() - this.currentEnemy.startTime;

    this.stats.primordialDefeated = true;
    if (!this.stats.fastestPrimordialKill || killTime < this.stats.fastestPrimordialKill) {
      this.stats.fastestPrimordialKill = killTime;
    }

    this.logCombat(`=======================================`);
    this.logCombat(`THE PRIMORDIAL HONK HAS FALLEN`);
    this.logCombat(`=======================================`);
    this.logCombat(`...`);
    this.logCombat(`*The dimension trembles*`);
    this.logCombat(`*All geese bow*`);
    this.logCombat(`...honk.`);

    // Grant rewards
    this.applyPrimordialRewards();

    return this.endRun('victory');
  }

  applyPrimordialRewards() {
    const rewards = this.enemies.the_primordial_honk.rewards;

    // Title
    if (!this.rewards.titleEarned) {
      this.rewards.titleEarned = true;
      if (window.gameState) {
        window.gameState.titles = window.gameState.titles || [];
        window.gameState.titles.push(rewards.title);
      }
      this.logCombat(`TITLE EARNED: ${rewards.title}`);
    }

    // Cat
    if (!this.rewards.catEarned && window.catSystem) {
      this.rewards.catEarned = true;
      const gooseCat = {
        id: rewards.cat,
        name: 'Goose-Touched Cat',
        title: 'Survivor of the Honk',
        description: 'This cat has seen things. Goose things.',
        emoji: '🐱👁️',
        realm: 'divine',
        element: 'chaos',
        rarity: 'legendary',
        stats: {
          hp: 50,
          attack: 30,
          defense: 20,
          speed: 15
        },
        special: {
          name: 'Honk Immunity',
          effect: 'Immune to goose attacks. Understands goose language.'
        }
      };
      window.catSystem.addCat(gooseCat);
      this.logCombat(`NEW CAT: ${gooseCat.name}!`);
    }

    // Permanent effects
    if (!this.rewards.permanentEffectsApplied) {
      this.rewards.permanentEffectsApplied = true;
      if (window.gameState) {
        window.gameState.gooseDimensionBonus = rewards.permanent;
      }
      this.logCombat(`PERMANENT BONUS: Goose spawn rate halved, goose rewards doubled!`);
    }

    // Bread crumbs
    this.breadCrumbs += rewards.breadCrumbs;
    this.logCombat(`+${rewards.breadCrumbs} Bread Crumbs!`);

    this.rewards.unlocked = true;
  }

  checkPhaseTransition() {
    if (!this.currentEnemy.phaseTransitions) return;

    const hpPercent = this.enemyHp / this.enemyMaxHp;
    const transitions = this.currentEnemy.phaseTransitions;

    for (let phase = this.currentEnemy.currentPhase + 1; phase <= 5; phase++) {
      const transition = transitions[phase];
      if (transition && hpPercent <= transition.hp) {
        this.currentEnemy.currentPhase = phase;
        this.logCombat(`=== PHASE ${phase} ===`);
        this.logCombat(`"${transition.dialogue}"`);

        // Trigger phase ability
        this.triggerPhaseAbility(transition.ability);
        break;
      }
    }
  }

  triggerPhaseAbility(abilityName) {
    switch (abilityName) {
      case 'summon_aspects':
        this.logCombat('*Three aspects of HONK manifest!*');
        // Could spawn mini-enemies here
        break;
      case 'dimension_collapse':
        this.logCombat('*Reality warps around you!*');
        this.loseSanity(30);
        break;
      case 'time_honk':
        this.logCombat('*Time itself honks!*');
        this.honkMeter = Math.floor(this.honkMeter * 0.5);
        break;
      case 'desperate_measure':
        this.logCombat('*The Primordial enters a frenzy!*');
        this.currentEnemy.baseDamage *= 1.5;
        break;
      case 'the_final_honk':
        this.logCombat('*...*');
        this.logCombat('*Silence.*');
        break;
    }
  }

  // ===================================
  // HONK METER
  // ===================================

  gainHonk(amount) {
    const oldMeter = this.honkMeter;
    this.honkMeter = Math.min(this.maxHonkMeter, this.honkMeter + amount);

    // Check if meter filled
    if (this.honkMeter >= this.maxHonkMeter && oldMeter < this.maxHonkMeter) {
      this.onHonkMeterFull();
    }
  }

  onHonkMeterFull() {
    this.logCombat('=== HONK METER FULL ===');
    this.logCombat('*The dimension resonates with your HONK!*');

    // Bonus effects when meter fills
    this.playerHp = Math.min(this.playerMaxHp, this.playerHp + 20);
    this.recoverSanity(10);

    // Deal bonus damage to current enemy
    if (this.currentEnemy) {
      const bonusDamage = Math.floor(this.playerDamage * 2);
      this.enemyHp = Math.max(0, this.enemyHp - bonusDamage);
      this.logCombat(`RESONANCE HONK deals ${bonusDamage} bonus damage!`);
    }

    // Reset meter
    this.honkMeter = 0;
  }

  useHonkBurst() {
    if (this.honkMeter < 50) {
      return { success: false, reason: 'Not enough HONK energy (need 50)' };
    }

    this.honkMeter -= 50;

    // Super attack
    const burstDamage = Math.floor(this.playerDamage * 3);
    this.enemyHp = Math.max(0, this.enemyHp - burstDamage);

    this.logCombat(`HONK BURST! ${burstDamage} damage!`);
    this.logCombat('*HHHHOOOOOONNNNNNKKKKKK!*');

    if (this.enemyHp <= 0) {
      return this.onEnemyDefeated();
    }

    return { success: true, damage: burstDamage };
  }

  // ===================================
  // SANITY SYSTEM
  // ===================================

  loseSanity(amount) {
    const oldSanity = this.sanityLevel;
    this.sanityLevel = Math.max(0, this.sanityLevel - amount);
    this.stats.sanityLost += amount;

    // Update cat sanity
    for (const catId of this.catTeam) {
      this.catSanity[catId] = Math.max(0, (this.catSanity[catId] || 100) - amount);
    }

    // Sanity threshold effects
    if (oldSanity >= 75 && this.sanityLevel < 75) {
      this.logCombat('*Your vision blurs slightly. The geese seem... closer.*');
    }
    if (oldSanity >= 50 && this.sanityLevel < 50) {
      this.logCombat('*The honking. It\'s all you can hear now.*');
      this.checkFourthWallBreak('highSanity'); // Ironic trigger
    }
    if (oldSanity >= 25 && this.sanityLevel < 25) {
      this.logCombat('*You begin to understand the geese. This is not a good sign.*');
    }
    if (oldSanity > 0 && this.sanityLevel <= 0) {
      this.onSanityDepleted();
    }
  }

  recoverSanity(amount) {
    this.sanityLevel = Math.min(this.maxSanity, this.sanityLevel + amount);
    this.stats.sanityRecovered += amount;

    // Recover cat sanity
    for (const catId of this.catTeam) {
      this.catSanity[catId] = Math.min(100, (this.catSanity[catId] || 0) + amount);
    }

    this.logCombat(`Sanity restored: +${amount}`);
  }

  onSanityDepleted() {
    this.logCombat('=================================');
    this.logCombat('Your sanity has been consumed by the HONK.');
    this.logCombat('You are now one with the geese.');
    this.logCombat('HONK.');
    this.logCombat('=================================');

    // Not game over - but severe penalties
    this.playerDamage = Math.floor(this.playerDamage * 1.5); // More damage
    this.playerDefense = 0; // No defense
    this.logCombat('*You fight with the fury of a goose, but with none of its resilience.*');
  }

  getSanityModifier() {
    // Lower sanity = more damage dealt AND taken
    const sanityPercent = this.sanityLevel / this.maxSanity;

    if (sanityPercent >= 0.75) {
      return { damageDealt: 1.0, damageTaken: 1.0 };
    } else if (sanityPercent >= 0.50) {
      return { damageDealt: 1.15, damageTaken: 1.1 };
    } else if (sanityPercent >= 0.25) {
      return { damageDealt: 1.3, damageTaken: 1.25 };
    } else if (sanityPercent > 0) {
      return { damageDealt: 1.5, damageTaken: 1.5 };
    } else {
      return { damageDealt: 2.0, damageTaken: 2.0 }; // GOOSE MODE
    }
  }

  getCatSanityBonus() {
    if (this.catTeam.length === 0) return 1.0;

    let totalSanity = 0;
    for (const catId of this.catTeam) {
      totalSanity += this.catSanity[catId] || 0;
    }
    const avgSanity = totalSanity / this.catTeam.length;

    // Cats with low sanity are less effective
    return 0.5 + (avgSanity / 200); // 0.5 to 1.0
  }

  // ===================================
  // COMEDY SYSTEMS
  // ===================================

  startRandomHonks() {
    if (this.honkInterval) {
      clearInterval(this.honkInterval);
    }

    this.honkInterval = setInterval(() => {
      if (this.inDimension && Math.random() < 0.3) {
        const honk = this.jokes.randomHonks[
          Math.floor(Math.random() * this.jokes.randomHonks.length)
        ];
        this.showRandomHonk(honk);
      }
    }, 10000); // Every 10 seconds
  }

  showRandomHonk(honkText) {
    // Could display in UI
    console.log(`[HONK] ${honkText}`);

    // Dispatch event for UI to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gooseHonk', {
        detail: { text: honkText }
      }));
    }
  }

  checkFourthWallBreak(trigger) {
    const now = Date.now();
    if (now - this.lastFourthWallBreak < this.fourthWallCooldown) {
      return;
    }

    // Find matching breaks
    const matchingBreaks = this.jokes.fourthWallBreaks.filter(b => {
      if (b.trigger === trigger) return true;
      if (b.trigger === 'random' && trigger === 'random' && Math.random() < b.chance) return true;
      if (b.trigger === 'lowHealth' && trigger === 'lowHealth' && this.playerHp < this.playerMaxHp * 0.25) return true;
      return false;
    });

    if (matchingBreaks.length > 0) {
      const selectedBreak = matchingBreaks[Math.floor(Math.random() * matchingBreaks.length)];

      this.lastFourthWallBreak = now;
      this.stats.fourthWallBreaksExperienced++;

      this.logCombat(`[FOURTH WALL BREAK]`);
      this.logCombat(selectedBreak.text);

      if (selectedBreak.sanityDrain > 0) {
        this.loseSanity(selectedBreak.sanityDrain);
      }
    }
  }

  checkUITheft() {
    if (Math.random() > 0.05) return; // 5% chance per floor

    const availableElements = this.jokes.stealableUIElements.filter(
      e => !this.stolenElements[e.element]
    );

    if (availableElements.length === 0) return;

    const stolen = availableElements[Math.floor(Math.random() * availableElements.length)];

    this.stolenElements[stolen.element] = true;
    this.stats.uiElementsStolen++;

    this.logCombat(stolen.stealMessage);

    // Dispatch event for UI
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gooseStealUI', {
        detail: { element: stolen.element, duration: stolen.returnTime }
      }));
    }

    // Return element after timeout
    this.elementReturnTimers[stolen.element] = setTimeout(() => {
      this.stolenElements[stolen.element] = false;
      this.logCombat(`*a goose reluctantly returns your ${stolen.element.replace('_', ' ')}*`);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gooseReturnUI', {
          detail: { element: stolen.element }
        }));
      }
    }, stolen.returnTime);
  }

  triggerSurrealEvent() {
    const event = this.jokes.surrealEvents[
      Math.floor(Math.random() * this.jokes.surrealEvents.length)
    ];

    this.activeSurrealEvent = event;
    this.logCombat(`=== SURREAL EVENT: ${event.name} ===`);
    this.logCombat(event.description);
    this.logCombat(`Effect: ${event.effect}`);

    // Apply effect
    this.applySurrealEventEffect(event);

    // Clear after duration
    setTimeout(() => {
      if (this.activeSurrealEvent === event) {
        this.activeSurrealEvent = null;
        this.logCombat(`*${event.name} fades...*`);
      }
    }, 15000);
  }

  applySurrealEventEffect(event) {
    switch (event.name) {
      case 'Bread Rain':
        this.breadCrumbs += 50;
        break;
      case 'Goose Parade':
        // Enemies don't attack for a bit - handled in UI
        break;
      case 'Honk Echo':
        this.activeEffects.push({ type: 'doubleHonk', duration: 15000 });
        break;
      case 'Goose Philosophy':
        this.recoverSanity(5);
        break;
      case 'Bread Shortage':
        if (this.currentEnemy) {
          this.currentEnemy.baseDamage = Math.floor(this.currentEnemy.baseDamage * 1.3);
        }
        break;
      default:
        // Visual-only effects
        break;
    }
  }

  // ===================================
  // RUN END
  // ===================================

  endRun(reason) {
    if (!this.inDimension) return null;

    this.inDimension = false;

    // Stop random honks
    if (this.honkInterval) {
      clearInterval(this.honkInterval);
      this.honkInterval = null;
    }

    // Clear timers
    for (const timerId of Object.values(this.elementReturnTimers)) {
      clearTimeout(timerId);
    }
    this.elementReturnTimers = {};
    this.stolenElements = {};

    // Calculate rewards
    const rewards = {
      breadCrumbs: this.breadCrumbs,
      floorsCleared: this.currentFloor,
      geeseBonked: this.stats.geeseBonked,
      reason: reason
    };

    // Convert bread crumbs to BP
    const bpReward = Math.floor(this.breadCrumbs * 10);
    if (window.gameState) {
      window.gameState.boopPoints += bpReward;
      window.gameState.gooseFeathers = (window.gameState.gooseFeathers || 0) + Math.floor(this.currentFloor / 5);
    }
    rewards.bpConverted = bpReward;

    if (reason === 'victory') {
      this.logCombat('=== DIMENSION CLEARED ===');
      this.logCombat('The geese... are at peace. For now.');
      this.logCombat('HONK. (Translation: Well played.)');
    } else {
      this.logCombat('=== RUN ENDED ===');
      this.logCombat('The geese have claimed another soul.');
      this.logCombat('*distant honking grows louder*');
    }

    if (window.audioSystem) {
      window.audioSystem.playSFX(reason === 'victory' ? 'dimensionVictory' : 'dimensionDefeat');
    }

    return rewards;
  }

  flee() {
    this.logCombat('You attempt to flee...');
    this.logCombat('*The geese watch you go. They always watch.*');
    return this.endRun('fled');
  }

  // ===================================
  // UTILITY
  // ===================================

  logCombat(message) {
    this.combatLog.push({
      message,
      timestamp: Date.now()
    });

    // Keep last 100 messages
    if (this.combatLog.length > 100) {
      this.combatLog = this.combatLog.slice(-100);
    }
  }

  getState() {
    return {
      inDimension: this.inDimension,
      currentFloor: this.currentFloor,
      playerHp: this.playerHp,
      playerMaxHp: this.playerMaxHp,
      enemyHp: this.enemyHp,
      enemyMaxHp: this.enemyMaxHp,
      currentEnemy: this.currentEnemy,
      honkMeter: this.honkMeter,
      maxHonkMeter: this.maxHonkMeter,
      sanityLevel: this.sanityLevel,
      maxSanity: this.maxSanity,
      breadCrumbs: this.breadCrumbs,
      catSanity: this.catSanity,
      stolenElements: this.stolenElements,
      activeSurrealEvent: this.activeSurrealEvent
    };
  }

  // ===================================
  // SERIALIZATION
  // ===================================

  serialize() {
    return {
      highestFloor: this.highestFloor,
      stats: this.stats,
      rewards: this.rewards
    };
  }

  deserialize(data) {
    if (!data) return;

    if (data.highestFloor) this.highestFloor = data.highestFloor;
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
    if (data.rewards) this.rewards = { ...this.rewards, ...data.rewards };
  }

  reset() {
    this.inDimension = false;
    this.currentFloor = 0;
    this.highestFloor = 0;
    this.stats = {
      totalRuns: 0,
      floorsCleared: 0,
      geeseBonked: 0,
      breadCrumbsCollected: 0,
      sanityLost: 0,
      sanityRecovered: 0,
      fourthWallBreaksExperienced: 0,
      uiElementsStolen: 0,
      primordialDefeated: false,
      fastestPrimordialKill: null
    };
    this.rewards = {
      unlocked: false,
      titleEarned: false,
      catEarned: false,
      permanentEffectsApplied: false
    };
  }
}

// ===================================
// ACHIEVEMENTS
// ===================================

const GOOSE_DIMENSION_ACHIEVEMENTS = [
  {
    id: 'dimension_entered',
    name: 'Into the Honk',
    description: 'Enter the Goose Dimension for the first time',
    condition: (s) => s.stats.totalRuns >= 1,
    reward: { gooseFeathers: 10 }
  },
  {
    id: 'floor_10',
    name: 'Deeper Into Madness',
    description: 'Reach floor 10 in the Goose Dimension',
    condition: (s) => s.highestFloor >= 10,
    reward: { gooseFeathers: 25 }
  },
  {
    id: 'floor_25',
    name: 'The Honking Intensifies',
    description: 'Reach floor 25 in the Goose Dimension',
    condition: (s) => s.highestFloor >= 25,
    reward: { gooseFeathers: 50 }
  },
  {
    id: 'sanity_zero',
    name: 'One of Us',
    description: 'Reach 0 sanity and continue fighting',
    condition: (s) => s.stats.sanityLost >= 100,
    reward: { title: 'Honorary Goose' }
  },
  {
    id: 'fourth_wall_veteran',
    name: 'Meta Awareness',
    description: 'Experience 10 fourth wall breaks',
    condition: (s) => s.stats.fourthWallBreaksExperienced >= 10,
    reward: { gooseFeathers: 30 }
  },
  {
    id: 'ui_theft_victim',
    name: 'Hey, Give That Back!',
    description: 'Have UI elements stolen 5 times',
    condition: (s) => s.stats.uiElementsStolen >= 5,
    reward: { cosmetic: 'goose_cursor' }
  },
  {
    id: 'bread_hoarder',
    name: 'Carbohydrate King',
    description: 'Collect 10,000 bread crumbs total',
    condition: (s) => s.stats.breadCrumbsCollected >= 10000,
    reward: { title: 'Lord of Loaves' }
  },
  {
    id: 'goose_slayer',
    name: 'HONK Silencer',
    description: 'Bonk 500 geese in the dimension',
    condition: (s) => s.stats.geeseBonked >= 500,
    reward: { gooseFeathers: 100 }
  },
  {
    id: 'primordial_slayer',
    name: 'Primordial Slayer',
    description: 'Defeat THE PRIMORDIAL HONK',
    condition: (s) => s.stats.primordialDefeated,
    reward: { title: 'Goose Dimension Survivor', cat: 'goose_touched_cat', permanent: { gooseSpawnRate: 0.5, gooseRewards: 2.0 } }
  },
  {
    id: 'speed_runner',
    name: 'Honk% Speedrun',
    description: 'Defeat the Primordial Honk in under 30 minutes',
    condition: (s) => s.stats.fastestPrimordialKill && s.stats.fastestPrimordialKill < 1800000,
    reward: { title: 'Goose Dimension Speedrunner', cosmetic: 'rainbow_goose_trail' }
  }
];

// ===================================
// EXPORTS
// ===================================

window.GOOSE_DIMENSION_ENEMIES = GOOSE_DIMENSION_ENEMIES;
window.DIMENSION_JOKES = DIMENSION_JOKES;
window.GOOSE_DIMENSION_ACHIEVEMENTS = GOOSE_DIMENSION_ACHIEVEMENTS;
window.GooseDimensionSystem = GooseDimensionSystem;
