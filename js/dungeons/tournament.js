/**
 * tournament.js - The Celestial Tournament
 * "Face the Seven Masters and prove your sect's supremacy."
 *
 * A PvP bracket system where players fight AI versions of the Seven Masters.
 * Unlocked at Core Formation cultivation realm.
 */

// ===================================
// TOURNAMENT OPPONENT AI CONFIGURATIONS
// ===================================

/**
 * AI configurations for each of the Seven Masters
 * Each has a unique difficulty and fighting style
 */
const TOURNAMENT_OPPONENTS = {
  gerald: {
    id: 'gerald',
    name: 'Gerald',
    title: 'The Jade Palm',
    emoji: '🐉',
    color: '#50C878',
    difficulty: 'balanced',
    aiStyle: 'meditation_bursts',
    description: 'Sect Leader. Master of balance and tranquil combat.',
    portrait: 'assets/masters/gerald.png',

    // AI Behavior Configuration
    ai: {
      // Meditation bursts: Alternates between passive and aggressive phases
      style: 'meditation_bursts',
      passivePhaseLength: 3, // Turns in passive mode
      aggressivePhaseLength: 2, // Turns in aggressive mode
      passiveMultiplier: 0.6, // Damage during passive phase
      aggressiveMultiplier: 1.8, // Damage during aggressive phase
      healThreshold: 0.4, // HP % to trigger heal
      healAmount: 0.2 // Heal 20% of max HP
    },

    // Base stats (scaled by player team power)
    baseStats: {
      hp: 1000,
      attack: 80,
      defense: 60,
      speed: 1.0,
      critChance: 0.1,
      critDamage: 1.5
    },

    // Special abilities
    abilities: [
      {
        id: 'tranquil_boop',
        name: 'Tranquil Boop',
        description: 'A perfectly balanced strike',
        damage: 1.0,
        cooldown: 0,
        chance: 0.6
      },
      {
        id: 'jade_meditation',
        name: 'Jade Meditation',
        description: 'Enters meditative state, reducing damage taken and healing',
        damage: 0,
        heal: 0.15,
        buff: { damageReduction: 0.3, duration: 2 },
        cooldown: 4,
        chance: 0.3
      },
      {
        id: 'celestial_palm',
        name: 'Celestial Palm Strike',
        description: 'Devastating palm strike after meditation',
        damage: 2.5,
        requiresPhase: 'aggressive',
        cooldown: 5,
        chance: 0.4
      }
    ],

    quotes: {
      intro: "Let us test your cultivation with balance and wisdom.",
      attack: "Balance in all things!",
      ability: "Feel the tranquility of the jade palm.",
      damaged: "Your foundation is strong.",
      victory: "Well fought. The Sect would be proud.",
      defeat: "You have surpassed me. Continue your path."
    }
  },

  rusty: {
    id: 'rusty',
    name: 'Rusty',
    title: 'The Crimson Fist',
    emoji: '👊',
    color: '#DC143C',
    difficulty: 'aggressive',
    aiStyle: 'constant_pressure',
    description: 'War General. Relentless aggression and overwhelming force.',
    portrait: 'assets/masters/rusty.png',

    ai: {
      style: 'constant_pressure',
      multiHitChance: 0.3, // Chance to attack multiple times
      maxMultiHits: 3,
      rageThreshold: 0.5, // HP % to enter rage mode
      rageMultiplier: 1.5, // Damage multiplier in rage
      neverDefend: true // Never uses defensive abilities
    },

    baseStats: {
      hp: 900,
      attack: 120,
      defense: 40,
      speed: 1.3,
      critChance: 0.15,
      critDamage: 1.8
    },

    abilities: [
      {
        id: 'crimson_strike',
        name: 'Crimson Strike',
        description: 'A fierce punch that never stops',
        damage: 1.2,
        cooldown: 0,
        chance: 0.5
      },
      {
        id: 'thousand_boop_barrage',
        name: 'Thousand Boop Barrage',
        description: 'RAPID FIRE BOOPS!',
        damage: 0.4,
        hits: { min: 3, max: 7 },
        cooldown: 4,
        chance: 0.35
      },
      {
        id: 'crimson_rage',
        name: 'Crimson Rage',
        description: 'UNLEASH THE FURY!',
        damage: 0,
        buff: { attackBoost: 0.5, speedBoost: 0.3, duration: 3 },
        selfDamage: 0.1,
        cooldown: 5,
        chance: 0.3
      }
    ],

    quotes: {
      intro: "You want a fight? YOU GOT ONE!",
      attack: "BOOP HARDER!",
      ability: "THOUSAND BOOP BARRAGE!!!",
      damaged: "Is that all you've got?!",
      victory: "THAT'S THE SPIRIT! Get stronger and try again!",
      defeat: "Hah! Now THAT was a fight!"
    }
  },

  steve: {
    id: 'steve',
    name: 'Steve',
    title: 'The Flowing River',
    emoji: '🌊',
    color: '#4169E1',
    difficulty: 'strategic',
    aiStyle: 'optimal_timing',
    description: 'Strategist. Calculates the perfect moment to strike.',
    portrait: 'assets/masters/steve.png',

    ai: {
      style: 'optimal_timing',
      analysisTime: 2, // Turns spent analyzing before big attack
      counterChance: 0.4, // Chance to counter after analysis
      counterMultiplier: 2.0, // Counter damage multiplier
      patternDetection: true, // Adapts to player patterns
      adaptationRate: 0.1 // How quickly AI adapts
    },

    baseStats: {
      hp: 950,
      attack: 90,
      defense: 70,
      speed: 0.9,
      critChance: 0.2,
      critDamage: 2.0
    },

    abilities: [
      {
        id: 'calculated_strike',
        name: 'Calculated Strike',
        description: 'Precisely timed attack',
        damage: 1.1,
        cooldown: 0,
        chance: 0.5
      },
      {
        id: 'analyze_weakness',
        name: 'Analyze Weakness',
        description: 'Studies opponent for critical weakness',
        damage: 0,
        buff: { nextCritGuaranteed: true, critDamageBoost: 0.5, duration: 1 },
        cooldown: 3,
        chance: 0.35
      },
      {
        id: 'eternal_flow',
        name: 'Eternal Flow',
        description: 'Channels the river to outlast opponents',
        damage: 0.8,
        heal: 0.1,
        debuff: { target: 'speed', value: -0.2, duration: 2 },
        cooldown: 4,
        chance: 0.3
      }
    ],

    quotes: {
      intro: "I've calculated your defeat probability at 73.2%.",
      attack: "As predicted.",
      ability: "The optimal strategy reveals itself.",
      damaged: "Interesting. Recalculating...",
      victory: "The math was inevitable.",
      defeat: "A statistical anomaly. Impressive."
    }
  },

  andrew: {
    id: 'andrew',
    name: 'Andrew',
    title: 'The Thunder Step',
    emoji: '⚡',
    color: '#FFD700',
    difficulty: 'fast',
    aiStyle: 'speed_rush',
    description: 'Scout. Blazing speed and first-strike advantage.',
    portrait: 'assets/masters/andrew.png',

    ai: {
      style: 'speed_rush',
      alwaysFirst: true, // Always attacks first unless stunned
      dodgeChance: 0.25, // Base dodge chance
      dodgeOnLowHp: 0.5, // Increased dodge when HP < 30%
      hitAndRun: true, // Alternates between attack and defensive turns
      burstCombo: 3 // Every 3rd turn does a combo
    },

    baseStats: {
      hp: 750,
      attack: 100,
      defense: 35,
      speed: 2.0,
      critChance: 0.12,
      critDamage: 1.6
    },

    abilities: [
      {
        id: 'lightning_strike',
        name: 'Lightning Strike',
        description: 'Faster than the eye can see',
        damage: 0.9,
        alwaysFirst: true,
        cooldown: 0,
        chance: 0.6
      },
      {
        id: 'thunder_step',
        name: 'Thunder Step',
        description: 'Moves so fast he attacks twice',
        damage: 0.7,
        hits: 2,
        cooldown: 2,
        chance: 0.35
      },
      {
        id: 'flash_dodge',
        name: 'Flash Dodge',
        description: 'Becomes untargetable for a turn',
        damage: 0,
        buff: { invulnerable: true, duration: 1 },
        cooldown: 4,
        chance: 0.25
      }
    ],

    quotes: {
      intro: "Catch me if you can!",
      attack: "Too slow!",
      ability: "THUNDER STEP!",
      damaged: "Lucky hit!",
      victory: "Maybe next time you'll be faster!",
      defeat: "You... actually kept up? Impressive!"
    }
  },

  nik: {
    id: 'nik',
    name: 'Nik',
    title: 'The Shadow Moon',
    emoji: '🌙',
    color: '#483D8B',
    difficulty: 'critical',
    aiStyle: 'crit_fishing',
    description: 'Assassin. Strikes from the shadows with devastating criticals.',
    portrait: 'assets/masters/nik.png',

    ai: {
      style: 'crit_fishing',
      baseCritChance: 0.35, // Much higher crit chance
      shadowStacks: 0, // Builds up to 3 stacks for guaranteed crit
      shadowStackGain: 1, // Stacks gained per turn
      shadowCritMultiplier: 3.0, // Crit multiplier when using stacks
      stealthOnLowHp: true, // Goes stealth when below 30% HP
      stealthDuration: 2
    },

    baseStats: {
      hp: 700,
      attack: 110,
      defense: 30,
      speed: 1.4,
      critChance: 0.35,
      critDamage: 2.5
    },

    abilities: [
      {
        id: 'shadow_strike',
        name: 'Shadow Strike',
        description: '...boop.',
        damage: 1.0,
        bonusCritChance: 0.15,
        cooldown: 0,
        chance: 0.5
      },
      {
        id: 'phantom_boop',
        name: 'Phantom Boop',
        description: 'Strikes from the void itself',
        damage: 1.5,
        guaranteedCrit: true,
        requiresShadowStacks: 3,
        cooldown: 5,
        chance: 0.4
      },
      {
        id: 'shadow_veil',
        name: 'Shadow Veil',
        description: '*vanishes*',
        damage: 0,
        buff: { stealth: true, nextAttackBonus: 1.0, duration: 2 },
        cooldown: 4,
        chance: 0.3
      }
    ],

    quotes: {
      intro: "...",
      attack: "*appears from shadows* ...boop.",
      ability: "...",
      damaged: "*winces silently*",
      victory: "...you fought well.",
      defeat: "...impressive."
    }
  },

  yuelin: {
    id: 'yuelin',
    name: 'Yuelin',
    title: 'The Lotus Sage',
    emoji: '🪷',
    color: '#FFB6C1',
    difficulty: 'sustain',
    aiStyle: 'healing_focus',
    description: 'Healer. Outlasts opponents through restoration and harmony.',
    portrait: 'assets/masters/yuelin.png',

    ai: {
      style: 'healing_focus',
      healPriority: true, // Will heal over attacking if HP < threshold
      healThreshold: 0.6, // Heal when below 60% HP
      healAmount: 0.15, // Base heal amount
      harmonyStacks: 0, // Builds harmony for big heal
      harmonyThreshold: 5, // Stacks needed for ultimate heal
      buffTeammates: true // In team mode, buffs allies
    },

    baseStats: {
      hp: 1200,
      attack: 60,
      defense: 50,
      speed: 0.8,
      critChance: 0.05,
      critDamage: 1.3
    },

    abilities: [
      {
        id: 'lotus_touch',
        name: 'Lotus Touch',
        description: 'A gentle but firm boop',
        damage: 0.8,
        heal: 0.05,
        cooldown: 0,
        chance: 0.5
      },
      {
        id: 'harmonious_aura',
        name: 'Harmonious Aura',
        description: 'Surrounds self with healing energy',
        damage: 0,
        heal: 0.2,
        buff: { regenPerTurn: 0.05, duration: 3 },
        cooldown: 3,
        chance: 0.4
      },
      {
        id: 'ancient_restoration',
        name: 'Ancient Restoration',
        description: 'The ancient cat tongue heals all wounds',
        damage: 0,
        heal: 0.4,
        cleanse: true,
        requiresHarmonyStacks: 5,
        cooldown: 6,
        chance: 0.35
      }
    ],

    quotes: {
      intro: "The cats tell me you have a kind heart. Let us spar gently.",
      attack: "Forgive me, this must be done.",
      ability: "Harmony brings the greatest power.",
      damaged: "Pain is temporary, cultivation is eternal.",
      victory: "You fought beautifully. The cats are pleased.",
      defeat: "Your spirit shines bright. Continue your path."
    }
  },

  scott: {
    id: 'scott',
    name: 'Scott',
    title: 'The Mountain',
    emoji: '⛰️',
    color: '#8B4513',
    difficulty: 'tank',
    aiStyle: 'stack_and_wait',
    description: 'Guardian. Immovable defense that grows stronger over time.',
    portrait: 'assets/masters/scott.png',

    ai: {
      style: 'stack_and_wait',
      fortifyStacks: 0, // Builds stacks that increase defense
      fortifyPerTurn: 1, // Stacks gained per turn
      maxFortify: 10, // Maximum stacks
      fortifyDefenseBonus: 0.1, // +10% defense per stack
      counterOnFortify: true, // Counters attacks when fortified
      counterChance: 0.3,
      ultimateThreshold: 10 // Stacks needed for ultimate
    },

    baseStats: {
      hp: 1500,
      attack: 50,
      defense: 100,
      speed: 0.5,
      critChance: 0.05,
      critDamage: 1.2
    },

    abilities: [
      {
        id: 'mountain_strike',
        name: 'Mountain Strike',
        description: 'Slow but inevitable',
        damage: 0.7,
        cooldown: 0,
        chance: 0.5
      },
      {
        id: 'unshakeable_stance',
        name: 'Unshakeable Stance',
        description: 'Becomes even more immovable',
        damage: 0,
        buff: { defenseBoost: 0.5, fortifyGain: 2, duration: 2 },
        cooldown: 3,
        chance: 0.4
      },
      {
        id: 'avalanche',
        name: 'Avalanche',
        description: 'Releases all built-up power',
        damage: 0.3, // Per fortify stack
        usesAllFortify: true,
        damagePerStack: 0.3,
        cooldown: 6,
        chance: 0.35
      }
    ],

    quotes: {
      intro: "...I have been standing here... for three days... for this moment.",
      attack: "...like a mountain falling.",
      ability: "...unshakeable.",
      damaged: "...is that... all?",
      victory: "...patience... always wins.",
      defeat: "...you moved... the mountain. ...respect."
    }
  }
};

// ===================================
// TOURNAMENT BRACKET CONFIGURATION
// ===================================

const TOURNAMENT_CONFIG = {
  totalRounds: 6,
  teamSize: 4,
  preparationTimeSeconds: 60,

  // Unlock requirement
  unlockRequirement: {
    cultivationRealm: 'coreFormation',
    description: 'Reach Core Formation realm to participate'
  },

  // Weekly reset (Sunday midnight UTC)
  resetDay: 0, // Sunday
  resetHour: 0,

  // Rewards
  rewards: {
    perWin: {
      sectReputation: 100,
      jadeCatnip: 500,
      destinyThreads: 25
    },
    champion: {
      title: 'Tournament Champion',
      cosmetic: 'champion_crown',
      jadeCatnip: 5000,
      sectReputation: 1000,
      destinyThreads: 100,
      specialCat: null // Could be a tournament-exclusive cat
    },
    participation: {
      jadeCatnip: 100,
      sectReputation: 25
    }
  },

  // Scaling
  powerScaling: {
    base: 1.0,
    perRound: 0.15 // +15% per round
  }
};

// ===================================
// TOURNAMENT STATES
// ===================================

const TOURNAMENT_STATES = {
  IDLE: 'idle',
  PREPARATION: 'preparation',
  BATTLE: 'battle',
  ROUND_COMPLETE: 'round_complete',
  TOURNAMENT_COMPLETE: 'tournament_complete',
  WEEKLY_CLAIMED: 'weekly_claimed'
};

// ===================================
// CELESTIAL TOURNAMENT SYSTEM CLASS
// ===================================

/**
 * CelestialTournamentSystem - Manages the PvP bracket against AI Masters
 */
class CelestialTournamentSystem {
  constructor() {
    this.config = TOURNAMENT_CONFIG;
    this.opponents = TOURNAMENT_OPPONENTS;

    // Tournament state
    this.state = TOURNAMENT_STATES.IDLE;
    this.currentRun = null;
    this.currentBattle = null;

    // Weekly tracking
    this.weeklyData = {
      weekStart: null,
      tournamentCompleted: false,
      rewardsClaimed: false,
      wins: 0,
      losses: 0,
      bestRound: 0
    };

    // Statistics
    this.stats = {
      totalTournaments: 0,
      totalWins: 0,
      totalLosses: 0,
      championCount: 0,
      defeatedMasters: {},
      highestStreak: 0,
      currentStreak: 0
    };

    // Leaderboard (local)
    this.leaderboard = [];

    // Initialize defeated masters tracking
    for (const masterId of Object.keys(TOURNAMENT_OPPONENTS)) {
      this.stats.defeatedMasters[masterId] = 0;
    }
  }

  // ===================================
  // UNLOCK & AVAILABILITY
  // ===================================

  /**
   * Check if tournament is unlocked
   */
  isUnlocked() {
    if (!window.cultivationSystem) return false;

    const requiredRealm = this.config.unlockRequirement.cultivationRealm;
    const currentRealm = window.cultivationSystem.currentRealm;

    const requiredOrder = window.CULTIVATION_REALMS?.[requiredRealm]?.order || 4;
    const currentOrder = window.CULTIVATION_REALMS?.[currentRealm]?.order || 1;

    return currentOrder >= requiredOrder;
  }

  /**
   * Check if weekly tournament is available
   */
  isWeeklyAvailable() {
    this.checkWeeklyReset();
    return !this.weeklyData.tournamentCompleted;
  }

  /**
   * Check for weekly reset
   */
  checkWeeklyReset() {
    const now = new Date();
    const currentWeekStart = this.getWeekStart(now);

    if (!this.weeklyData.weekStart ||
        new Date(this.weeklyData.weekStart).getTime() < currentWeekStart.getTime()) {
      // New week - reset
      this.weeklyData = {
        weekStart: currentWeekStart.toISOString(),
        tournamentCompleted: false,
        rewardsClaimed: false,
        wins: 0,
        losses: 0,
        bestRound: 0
      };
    }
  }

  /**
   * Get the start of the current week (Sunday)
   */
  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // ===================================
  // TOURNAMENT FLOW
  // ===================================

  /**
   * Start a new tournament run
   */
  startTournament(catTeam) {
    // Validate unlock
    if (!this.isUnlocked()) {
      return {
        success: false,
        error: 'Tournament not unlocked',
        requirement: this.config.unlockRequirement.description
      };
    }

    // Validate team
    if (!catTeam || catTeam.length !== this.config.teamSize) {
      return {
        success: false,
        error: `Must select exactly ${this.config.teamSize} cats for your team`
      };
    }

    // Validate cats exist
    const team = this.buildTeam(catTeam);
    if (!team) {
      return {
        success: false,
        error: 'One or more selected cats not found'
      };
    }

    // Check weekly availability
    this.checkWeeklyReset();

    // Generate bracket (random order of opponents)
    const bracket = this.generateBracket();

    // Initialize tournament run
    this.currentRun = {
      id: `tournament_${Date.now()}`,
      startTime: Date.now(),
      team: team,
      bracket: bracket,
      currentRound: 0,
      wins: 0,
      losses: 0,
      rewards: {
        jadeCatnip: 0,
        sectReputation: 0,
        destinyThreads: 0,
        titles: [],
        cosmetics: []
      },
      history: []
    };

    this.state = TOURNAMENT_STATES.PREPARATION;
    this.stats.totalTournaments++;

    // Play sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('tournamentStart');
    }

    return {
      success: true,
      run: this.currentRun,
      firstOpponent: bracket[0],
      message: `The Celestial Tournament begins! Your first opponent: ${bracket[0].name}, ${bracket[0].title}`
    };
  }

  /**
   * Build team data from cat IDs
   */
  buildTeam(catIds) {
    if (!window.catSystem) return null;

    const team = [];
    for (const catId of catIds) {
      const cat = window.catSystem.getCatById(catId);
      if (!cat) return null;

      // Calculate combat stats
      const combatCat = this.buildCombatCat(cat);
      team.push(combatCat);
    }

    return team;
  }

  /**
   * Build combat-ready cat data
   */
  buildCombatCat(cat) {
    const realm = window.CAT_REALMS?.[cat.realm] || { statsMultiplier: 1 };
    const starBonus = window.STAR_BONUSES?.[cat.stars || 1] || { stats: 1 };

    // Base stats from cat
    const baseAttack = (cat.stats?.snootMeridians || 1) * 20;
    const baseDefense = (cat.stats?.floofArmor || 1) * 15;
    const baseHp = (cat.stats?.innerPurr || 1) * 100 + (cat.stats?.loafMastery || 1) * 50;
    const baseSpeed = (cat.stats?.zoomieSteps || 1);

    // Apply multipliers
    const multiplier = realm.statsMultiplier * starBonus.stats * ((cat.cultivationLevel || 1) * 0.1 + 0.9);

    return {
      id: cat.instanceId || cat.id,
      name: cat.name,
      emoji: cat.emoji,
      realm: cat.realm,
      element: cat.element,
      personality: cat.personality,
      stars: cat.stars || 1,

      // Combat stats
      maxHp: Math.floor(baseHp * multiplier),
      currentHp: Math.floor(baseHp * multiplier),
      attack: Math.floor(baseAttack * multiplier),
      defense: Math.floor(baseDefense * multiplier),
      speed: baseSpeed,

      critChance: 0.1 + ((cat.personality === 'mysterious') ? 0.05 : 0),
      critDamage: 1.5,

      // Status
      buffs: [],
      debuffs: [],
      techniques: cat.techniques || { active: [], passive: [] }
    };
  }

  /**
   * Generate tournament bracket
   */
  generateBracket() {
    const playerMasterId = window.masterSystem?.selectedMaster?.id;

    // Get all opponents except the player's master
    let opponents = Object.values(this.opponents)
      .filter(o => o.id !== playerMasterId);

    // Shuffle using Fisher-Yates
    for (let i = opponents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opponents[i], opponents[j]] = [opponents[j], opponents[i]];
    }

    // Take first 6 for the bracket
    return opponents.slice(0, 6);
  }

  /**
   * Start a battle against current opponent
   */
  startBattle() {
    if (!this.currentRun || this.state !== TOURNAMENT_STATES.PREPARATION) {
      return { success: false, error: 'No tournament in progress' };
    }

    const round = this.currentRun.currentRound;
    const opponent = this.currentRun.bracket[round];

    if (!opponent) {
      return { success: false, error: 'No opponent for this round' };
    }

    // Scale opponent based on round
    const scaledOpponent = this.scaleOpponent(opponent, round);

    // Initialize battle state
    this.currentBattle = {
      round: round,
      opponent: scaledOpponent,
      playerTeam: this.currentRun.team.map(cat => ({
        ...cat,
        currentHp: cat.maxHp, // Reset HP for each battle
        buffs: [],
        debuffs: []
      })),
      turn: 0,
      log: [],
      aiState: {
        phase: 'passive',
        phaseCounter: 0,
        shadowStacks: 0,
        fortifyStacks: 0,
        harmonyStacks: 0,
        cooldowns: {}
      }
    };

    this.state = TOURNAMENT_STATES.BATTLE;

    // Log battle start
    this.logBattle(`=== Round ${round + 1}: vs ${opponent.name} ===`);
    this.logBattle(opponent.quotes.intro);

    if (window.audioSystem) {
      window.audioSystem.playSFX('battleStart');
    }

    return {
      success: true,
      battle: this.currentBattle,
      opponent: scaledOpponent
    };
  }

  /**
   * Scale opponent stats based on round and player power
   */
  scaleOpponent(opponent, round) {
    // Calculate player team power
    const teamPower = this.calculateTeamPower(this.currentRun.team);

    // Base scaling from round
    const roundScale = 1 + (round * this.config.powerScaling.perRound);

    // Power matching (opponent should be ~80-120% of player power)
    const powerTarget = teamPower * (0.8 + (round * 0.1));
    const basePower = opponent.baseStats.hp + opponent.baseStats.attack * 5;
    const powerScale = powerTarget / basePower;

    // Apply scaling
    const scaledStats = {
      hp: Math.floor(opponent.baseStats.hp * roundScale * powerScale),
      maxHp: Math.floor(opponent.baseStats.hp * roundScale * powerScale),
      currentHp: Math.floor(opponent.baseStats.hp * roundScale * powerScale),
      attack: Math.floor(opponent.baseStats.attack * roundScale * powerScale),
      defense: Math.floor(opponent.baseStats.defense * roundScale * powerScale),
      speed: opponent.baseStats.speed,
      critChance: opponent.baseStats.critChance,
      critDamage: opponent.baseStats.critDamage
    };

    return {
      ...opponent,
      stats: scaledStats,
      buffs: [],
      debuffs: []
    };
  }

  /**
   * Calculate team's total power
   */
  calculateTeamPower(team) {
    return team.reduce((total, cat) => {
      return total + cat.maxHp + (cat.attack * 5) + (cat.defense * 3);
    }, 0);
  }

  /**
   * Simulate a battle (auto-battle)
   */
  simulateBattle(playerTeam, opponent) {
    if (!this.currentBattle) {
      return { success: false, error: 'No active battle' };
    }

    const maxTurns = 100; // Prevent infinite battles
    let turn = 0;

    while (turn < maxTurns) {
      turn++;
      this.currentBattle.turn = turn;

      // Player team attacks
      const playerResult = this.processPlayerTurn();
      if (playerResult.battleEnd) {
        return this.endBattle(playerResult.victory);
      }

      // Opponent attacks
      const opponentResult = this.processOpponentTurn();
      if (opponentResult.battleEnd) {
        return this.endBattle(opponentResult.victory);
      }

      // Tick buffs/debuffs
      this.tickStatusEffects();
    }

    // Timeout - whoever has more HP% wins
    const playerHpPercent = this.getTeamHpPercent(this.currentBattle.playerTeam);
    const opponentHpPercent = this.currentBattle.opponent.stats.currentHp / this.currentBattle.opponent.stats.maxHp;

    return this.endBattle(playerHpPercent > opponentHpPercent);
  }

  /**
   * Process player team's turn
   */
  processPlayerTurn() {
    const team = this.currentBattle.playerTeam;
    const opponent = this.currentBattle.opponent;

    for (const cat of team) {
      if (cat.currentHp <= 0) continue;

      // Calculate damage
      let damage = cat.attack;

      // Apply buffs
      for (const buff of cat.buffs) {
        if (buff.attackBoost) damage *= (1 + buff.attackBoost);
      }

      // Apply opponent debuffs
      for (const debuff of opponent.debuffs) {
        if (debuff.defenseReduction) {
          damage *= (1 + debuff.defenseReduction);
        }
      }

      // Apply opponent defense
      const defense = this.getEffectiveDefense(opponent);
      damage = Math.max(1, damage - defense * 0.5);

      // Crit check
      const isCrit = Math.random() < cat.critChance;
      if (isCrit) {
        damage *= cat.critDamage;
      }

      // Apply damage
      damage = Math.floor(damage);
      opponent.stats.currentHp -= damage;

      this.logBattle(`${cat.emoji} ${cat.name} deals ${damage} damage!${isCrit ? ' CRITICAL!' : ''}`);

      // Check for opponent defeat
      if (opponent.stats.currentHp <= 0) {
        this.logBattle(opponent.quotes.defeat);
        return { battleEnd: true, victory: true };
      }
    }

    return { battleEnd: false };
  }

  /**
   * Process opponent's turn using AI
   */
  processOpponentTurn() {
    const opponent = this.currentBattle.opponent;
    const team = this.currentBattle.playerTeam;
    const aiState = this.currentBattle.aiState;

    // Check if opponent can act (not stunned)
    if (opponent.debuffs?.some(d => d.stun)) {
      this.logBattle(`${opponent.emoji} ${opponent.name} is stunned!`);
      return { battleEnd: false };
    }

    // Select ability based on AI style
    const ability = this.selectAIAbility(opponent, team, aiState);

    // Execute ability
    const result = this.executeAIAbility(opponent, team, ability, aiState);

    // Update AI state
    this.updateAIState(opponent, aiState);

    // Check for player team wipe
    const aliveCount = team.filter(c => c.currentHp > 0).length;
    if (aliveCount === 0) {
      this.logBattle(opponent.quotes.victory);
      return { battleEnd: true, victory: false };
    }

    return { battleEnd: false };
  }

  /**
   * Select ability based on AI style
   */
  selectAIAbility(opponent, team, aiState) {
    const ai = opponent.ai;
    const abilities = opponent.abilities;

    // Reduce cooldowns
    for (const abilityId of Object.keys(aiState.cooldowns)) {
      if (aiState.cooldowns[abilityId] > 0) {
        aiState.cooldowns[abilityId]--;
      }
    }

    // AI-specific logic
    switch (ai.style) {
      case 'meditation_bursts':
        return this.selectMeditationAbility(opponent, abilities, aiState);

      case 'constant_pressure':
        return this.selectPressureAbility(opponent, abilities, aiState);

      case 'optimal_timing':
        return this.selectTimingAbility(opponent, abilities, aiState);

      case 'speed_rush':
        return this.selectSpeedAbility(opponent, abilities, aiState);

      case 'crit_fishing':
        return this.selectCritAbility(opponent, abilities, aiState);

      case 'healing_focus':
        return this.selectHealAbility(opponent, abilities, aiState);

      case 'stack_and_wait':
        return this.selectStackAbility(opponent, abilities, aiState);

      default:
        return abilities[0]; // Default attack
    }
  }

  /**
   * Gerald's meditation burst AI
   */
  selectMeditationAbility(opponent, abilities, aiState) {
    const ai = opponent.ai;

    // Toggle between phases
    aiState.phaseCounter++;
    if (aiState.phase === 'passive' && aiState.phaseCounter >= ai.passivePhaseLength) {
      aiState.phase = 'aggressive';
      aiState.phaseCounter = 0;
    } else if (aiState.phase === 'aggressive' && aiState.phaseCounter >= ai.aggressivePhaseLength) {
      aiState.phase = 'passive';
      aiState.phaseCounter = 0;
    }

    // Heal if needed
    const hpPercent = opponent.stats.currentHp / opponent.stats.maxHp;
    if (hpPercent < ai.healThreshold) {
      const healAbility = abilities.find(a => a.heal && (!aiState.cooldowns[a.id] || aiState.cooldowns[a.id] === 0));
      if (healAbility) {
        aiState.cooldowns[healAbility.id] = healAbility.cooldown;
        return healAbility;
      }
    }

    // In aggressive phase, use big attack
    if (aiState.phase === 'aggressive') {
      const bigAttack = abilities.find(a => a.requiresPhase === 'aggressive' &&
        (!aiState.cooldowns[a.id] || aiState.cooldowns[a.id] === 0));
      if (bigAttack) {
        aiState.cooldowns[bigAttack.id] = bigAttack.cooldown;
        return bigAttack;
      }
    }

    return abilities[0]; // Default
  }

  /**
   * Rusty's constant pressure AI
   */
  selectPressureAbility(opponent, abilities, aiState) {
    const ai = opponent.ai;
    const hpPercent = opponent.stats.currentHp / opponent.stats.maxHp;

    // Check for rage activation
    if (hpPercent < ai.rageThreshold && !opponent.buffs?.some(b => b.rage)) {
      const rageAbility = abilities.find(a => a.buff?.attackBoost);
      if (rageAbility && (!aiState.cooldowns[rageAbility.id] || aiState.cooldowns[rageAbility.id] === 0)) {
        aiState.cooldowns[rageAbility.id] = rageAbility.cooldown;
        return rageAbility;
      }
    }

    // Try multi-hit ability
    const multiHit = abilities.find(a => a.hits && (!aiState.cooldowns[a.id] || aiState.cooldowns[a.id] === 0));
    if (multiHit && Math.random() < ai.multiHitChance) {
      aiState.cooldowns[multiHit.id] = multiHit.cooldown;
      return multiHit;
    }

    return abilities[0];
  }

  /**
   * Steve's optimal timing AI
   */
  selectTimingAbility(opponent, abilities, aiState) {
    const ai = opponent.ai;

    // Analysis counter
    aiState.analysisCounter = (aiState.analysisCounter || 0) + 1;

    // After analysis, use guaranteed crit
    if (aiState.analysisCounter >= ai.analysisTime) {
      const analyzeAbility = abilities.find(a => a.buff?.nextCritGuaranteed);
      if (analyzeAbility && (!aiState.cooldowns[analyzeAbility.id] || aiState.cooldowns[analyzeAbility.id] === 0)) {
        aiState.cooldowns[analyzeAbility.id] = analyzeAbility.cooldown;
        aiState.analysisCounter = 0;
        return analyzeAbility;
      }
    }

    // Use debuff ability
    const debuffAbility = abilities.find(a => a.debuff && (!aiState.cooldowns[a.id] || aiState.cooldowns[a.id] === 0));
    if (debuffAbility && Math.random() < 0.3) {
      aiState.cooldowns[debuffAbility.id] = debuffAbility.cooldown;
      return debuffAbility;
    }

    return abilities[0];
  }

  /**
   * Andrew's speed rush AI
   */
  selectSpeedAbility(opponent, abilities, aiState) {
    const ai = opponent.ai;
    const hpPercent = opponent.stats.currentHp / opponent.stats.maxHp;

    // Low HP - try to dodge
    if (hpPercent < 0.3) {
      const dodgeAbility = abilities.find(a => a.buff?.invulnerable);
      if (dodgeAbility && (!aiState.cooldowns[dodgeAbility.id] || aiState.cooldowns[dodgeAbility.id] === 0)) {
        aiState.cooldowns[dodgeAbility.id] = dodgeAbility.cooldown;
        return dodgeAbility;
      }
    }

    // Burst combo every 3rd turn
    aiState.comboCounter = (aiState.comboCounter || 0) + 1;
    if (aiState.comboCounter >= ai.burstCombo) {
      const doubleHit = abilities.find(a => a.hits === 2);
      if (doubleHit && (!aiState.cooldowns[doubleHit.id] || aiState.cooldowns[doubleHit.id] === 0)) {
        aiState.cooldowns[doubleHit.id] = doubleHit.cooldown;
        aiState.comboCounter = 0;
        return doubleHit;
      }
    }

    return abilities[0];
  }

  /**
   * Nik's crit fishing AI
   */
  selectCritAbility(opponent, abilities, aiState) {
    const ai = opponent.ai;

    // Build shadow stacks
    aiState.shadowStacks = (aiState.shadowStacks || 0) + ai.shadowStackGain;

    // Stealth when low HP
    const hpPercent = opponent.stats.currentHp / opponent.stats.maxHp;
    if (hpPercent < 0.3 && ai.stealthOnLowHp) {
      const stealthAbility = abilities.find(a => a.buff?.stealth);
      if (stealthAbility && (!aiState.cooldowns[stealthAbility.id] || aiState.cooldowns[stealthAbility.id] === 0)) {
        aiState.cooldowns[stealthAbility.id] = stealthAbility.cooldown;
        return stealthAbility;
      }
    }

    // Use phantom boop at 3 stacks
    if (aiState.shadowStacks >= 3) {
      const phantomBoop = abilities.find(a => a.requiresShadowStacks);
      if (phantomBoop && (!aiState.cooldowns[phantomBoop.id] || aiState.cooldowns[phantomBoop.id] === 0)) {
        aiState.cooldowns[phantomBoop.id] = phantomBoop.cooldown;
        aiState.shadowStacks = 0;
        return phantomBoop;
      }
    }

    return abilities[0];
  }

  /**
   * Yuelin's healing focus AI
   */
  selectHealAbility(opponent, abilities, aiState) {
    const ai = opponent.ai;
    const hpPercent = opponent.stats.currentHp / opponent.stats.maxHp;

    // Build harmony
    aiState.harmonyStacks = (aiState.harmonyStacks || 0) + 1;

    // Priority heal when low
    if (hpPercent < ai.healThreshold) {
      // Try big heal if enough harmony
      if (aiState.harmonyStacks >= ai.harmonyThreshold) {
        const bigHeal = abilities.find(a => a.requiresHarmonyStacks);
        if (bigHeal && (!aiState.cooldowns[bigHeal.id] || aiState.cooldowns[bigHeal.id] === 0)) {
          aiState.cooldowns[bigHeal.id] = bigHeal.cooldown;
          aiState.harmonyStacks = 0;
          return bigHeal;
        }
      }

      // Regular heal
      const healAbility = abilities.find(a => a.heal && !a.requiresHarmonyStacks &&
        (!aiState.cooldowns[a.id] || aiState.cooldowns[a.id] === 0));
      if (healAbility) {
        aiState.cooldowns[healAbility.id] = healAbility.cooldown;
        return healAbility;
      }
    }

    return abilities[0];
  }

  /**
   * Scott's stack and wait AI
   */
  selectStackAbility(opponent, abilities, aiState) {
    const ai = opponent.ai;

    // Build fortify stacks
    aiState.fortifyStacks = Math.min(
      (aiState.fortifyStacks || 0) + ai.fortifyPerTurn,
      ai.maxFortify
    );

    // Use avalanche at max stacks
    if (aiState.fortifyStacks >= ai.ultimateThreshold) {
      const avalanche = abilities.find(a => a.usesAllFortify);
      if (avalanche && (!aiState.cooldowns[avalanche.id] || aiState.cooldowns[avalanche.id] === 0)) {
        const savedStacks = aiState.fortifyStacks;
        aiState.cooldowns[avalanche.id] = avalanche.cooldown;
        aiState.fortifyStacks = 0;
        // Store stacks for damage calculation
        avalanche.currentStacks = savedStacks;
        return avalanche;
      }
    }

    // Use defensive stance
    const stance = abilities.find(a => a.buff?.defenseBoost &&
      (!aiState.cooldowns[a.id] || aiState.cooldowns[a.id] === 0));
    if (stance && Math.random() < 0.4) {
      aiState.cooldowns[stance.id] = stance.cooldown;
      return stance;
    }

    return abilities[0];
  }

  /**
   * Execute the selected AI ability
   */
  executeAIAbility(opponent, team, ability, aiState) {
    const ai = opponent.ai;
    let totalDamage = 0;

    // Log ability use
    if (ability.damage > 0 || ability.hits) {
      this.logBattle(`${opponent.emoji} ${opponent.quotes.attack}`);
    } else {
      this.logBattle(`${opponent.emoji} ${opponent.quotes.ability}`);
    }

    // Calculate base damage
    let baseDamage = opponent.stats.attack * (ability.damage || 1);

    // Apply AI-specific modifiers
    if (ai.style === 'meditation_bursts') {
      baseDamage *= aiState.phase === 'aggressive' ? ai.aggressiveMultiplier : ai.passiveMultiplier;
    }
    if (ai.style === 'constant_pressure' && opponent.buffs?.some(b => b.rage)) {
      baseDamage *= ai.rageMultiplier;
    }
    if (ai.style === 'crit_fishing' && opponent.buffs?.some(b => b.stealth)) {
      baseDamage *= (1 + opponent.buffs.find(b => b.stealth)?.nextAttackBonus || 0);
    }

    // Handle multi-hit abilities
    const hits = ability.hits ?
      (typeof ability.hits === 'object' ?
        ability.hits.min + Math.floor(Math.random() * (ability.hits.max - ability.hits.min + 1)) :
        ability.hits) : 1;

    // Handle avalanche (damage per stack)
    if (ability.usesAllFortify && ability.currentStacks) {
      baseDamage = opponent.stats.attack * ability.damagePerStack * ability.currentStacks;
    }

    // Apply damage to random alive cats
    const aliveCats = team.filter(c => c.currentHp > 0);
    for (let i = 0; i < hits; i++) {
      if (aliveCats.length === 0) break;

      const target = aliveCats[Math.floor(Math.random() * aliveCats.length)];
      let damage = baseDamage;

      // Apply target defense
      const defense = this.getEffectiveDefense(target);
      damage = Math.max(1, damage - defense * 0.5);

      // Crit check
      let isCrit = Math.random() < (opponent.stats.critChance + (ability.bonusCritChance || 0));
      if (ability.guaranteedCrit || opponent.buffs?.some(b => b.nextCritGuaranteed)) {
        isCrit = true;
        // Remove the buff
        opponent.buffs = opponent.buffs?.filter(b => !b.nextCritGuaranteed) || [];
      }
      if (isCrit) {
        const critMult = ai.style === 'crit_fishing' ? ai.shadowCritMultiplier : opponent.stats.critDamage;
        damage *= critMult;
      }

      damage = Math.floor(damage);
      target.currentHp = Math.max(0, target.currentHp - damage);
      totalDamage += damage;

      this.logBattle(`  ${target.emoji} ${target.name} takes ${damage} damage!${isCrit ? ' CRITICAL!' : ''}`);

      // Remove from alive list if dead
      if (target.currentHp <= 0) {
        const idx = aliveCats.indexOf(target);
        if (idx > -1) aliveCats.splice(idx, 1);
      }
    }

    // Handle healing
    if (ability.heal) {
      const healAmount = Math.floor(opponent.stats.maxHp * ability.heal);
      opponent.stats.currentHp = Math.min(opponent.stats.maxHp, opponent.stats.currentHp + healAmount);
      this.logBattle(`  ${opponent.emoji} heals for ${healAmount}!`);
    }

    // Handle buffs
    if (ability.buff) {
      opponent.buffs = opponent.buffs || [];
      opponent.buffs.push({
        ...ability.buff,
        turnsRemaining: ability.buff.duration || 1
      });
    }

    // Handle self damage (Rusty's rage)
    if (ability.selfDamage) {
      const selfDmg = Math.floor(opponent.stats.maxHp * ability.selfDamage);
      opponent.stats.currentHp = Math.max(1, opponent.stats.currentHp - selfDmg);
      this.logBattle(`  ${opponent.emoji} takes ${selfDmg} recoil damage!`);
    }

    return { damage: totalDamage };
  }

  /**
   * Update AI state after turn
   */
  updateAIState(opponent, aiState) {
    // Tick down buff durations
    if (opponent.buffs) {
      opponent.buffs = opponent.buffs.filter(buff => {
        buff.turnsRemaining--;
        return buff.turnsRemaining > 0;
      });
    }
  }

  /**
   * Get effective defense considering buffs/debuffs
   */
  getEffectiveDefense(entity) {
    let defense = entity.defense || entity.stats?.defense || 0;

    // Apply buffs
    for (const buff of (entity.buffs || [])) {
      if (buff.defenseBoost) defense *= (1 + buff.defenseBoost);
      if (buff.damageReduction) defense *= (1 + buff.damageReduction);
    }

    // Apply debuffs
    for (const debuff of (entity.debuffs || [])) {
      if (debuff.defenseReduction) defense *= (1 - debuff.defenseReduction);
    }

    // Apply fortify stacks (Scott)
    const fortifyStacks = this.currentBattle?.aiState?.fortifyStacks || 0;
    if (entity === this.currentBattle?.opponent && fortifyStacks > 0) {
      defense *= (1 + fortifyStacks * 0.1);
    }

    return defense;
  }

  /**
   * Tick status effects at end of round
   */
  tickStatusEffects() {
    // Player team
    for (const cat of this.currentBattle.playerTeam) {
      // Tick buffs
      cat.buffs = (cat.buffs || []).filter(buff => {
        buff.turnsRemaining--;
        return buff.turnsRemaining > 0;
      });

      // Tick debuffs
      cat.debuffs = (cat.debuffs || []).filter(debuff => {
        debuff.turnsRemaining--;
        return debuff.turnsRemaining > 0;
      });

      // Apply regen
      const regen = cat.buffs?.find(b => b.regenPerTurn);
      if (regen) {
        const healAmount = Math.floor(cat.maxHp * regen.regenPerTurn);
        cat.currentHp = Math.min(cat.maxHp, cat.currentHp + healAmount);
      }
    }

    // Opponent
    const opponent = this.currentBattle.opponent;
    const opponentRegen = opponent.buffs?.find(b => b.regenPerTurn);
    if (opponentRegen) {
      const healAmount = Math.floor(opponent.stats.maxHp * opponentRegen.regenPerTurn);
      opponent.stats.currentHp = Math.min(opponent.stats.maxHp, opponent.stats.currentHp + healAmount);
    }
  }

  /**
   * Get team HP percentage
   */
  getTeamHpPercent(team) {
    const totalMax = team.reduce((sum, c) => sum + c.maxHp, 0);
    const totalCurrent = team.reduce((sum, c) => sum + Math.max(0, c.currentHp), 0);
    return totalCurrent / totalMax;
  }

  /**
   * End the current battle
   */
  endBattle(victory) {
    if (!this.currentBattle || !this.currentRun) {
      return { success: false, error: 'No active battle' };
    }

    const opponent = this.currentBattle.opponent;
    const round = this.currentRun.currentRound;

    // Record result
    this.currentRun.history.push({
      round: round,
      opponent: opponent.id,
      opponentName: opponent.name,
      victory: victory,
      turns: this.currentBattle.turn,
      log: this.currentBattle.log
    });

    if (victory) {
      this.currentRun.wins++;
      this.stats.totalWins++;
      this.stats.currentStreak++;
      this.stats.defeatedMasters[opponent.id]++;

      if (this.stats.currentStreak > this.stats.highestStreak) {
        this.stats.highestStreak = this.stats.currentStreak;
      }

      // Award per-win rewards
      this.currentRun.rewards.sectReputation += this.config.rewards.perWin.sectReputation;
      this.currentRun.rewards.jadeCatnip += this.config.rewards.perWin.jadeCatnip;
      this.currentRun.rewards.destinyThreads += this.config.rewards.perWin.destinyThreads;

      this.logBattle(`Victory! +${this.config.rewards.perWin.sectReputation} Sect Reputation`);

      // Play victory sound
      if (window.audioSystem) {
        window.audioSystem.playSFX('victory');
      }

    } else {
      this.currentRun.losses++;
      this.stats.totalLosses++;
      this.stats.currentStreak = 0;

      this.logBattle(`Defeat. The path of cultivation continues.`);

      if (window.audioSystem) {
        window.audioSystem.playSFX('defeat');
      }
    }

    // Clear battle state
    this.currentBattle = null;

    // Check if tournament is over
    if (!victory || this.currentRun.currentRound >= 5) {
      return this.completeTournament(victory && this.currentRun.currentRound >= 5);
    }

    // Advance to next round
    this.currentRun.currentRound++;
    this.state = TOURNAMENT_STATES.ROUND_COMPLETE;

    return {
      success: true,
      victory: victory,
      round: round + 1,
      nextOpponent: this.currentRun.bracket[this.currentRun.currentRound],
      rewards: this.config.rewards.perWin,
      totalRewards: this.currentRun.rewards
    };
  }

  /**
   * Advance to the next round
   */
  advanceRound() {
    if (this.state !== TOURNAMENT_STATES.ROUND_COMPLETE) {
      return { success: false, error: 'Cannot advance round in current state' };
    }

    this.state = TOURNAMENT_STATES.PREPARATION;

    return {
      success: true,
      round: this.currentRun.currentRound + 1,
      opponent: this.currentRun.bracket[this.currentRun.currentRound]
    };
  }

  /**
   * Complete the tournament
   */
  completeTournament(isChampion) {
    if (!this.currentRun) {
      return { success: false, error: 'No tournament to complete' };
    }

    const rewards = { ...this.currentRun.rewards };

    if (isChampion) {
      // Champion rewards
      this.stats.championCount++;
      rewards.jadeCatnip += this.config.rewards.champion.jadeCatnip;
      rewards.sectReputation += this.config.rewards.champion.sectReputation;
      rewards.destinyThreads += this.config.rewards.champion.destinyThreads;
      rewards.titles.push(this.config.rewards.champion.title);
      rewards.cosmetics.push(this.config.rewards.champion.cosmetic);

      this.logBattle(`=== TOURNAMENT CHAMPION! ===`);
      this.logBattle(`Earned title: ${this.config.rewards.champion.title}`);
      this.logBattle(`Earned cosmetic: ${this.config.rewards.champion.cosmetic}`);

      if (window.audioSystem) {
        window.audioSystem.playSFX('championVictory');
      }
    } else {
      // Participation rewards
      rewards.jadeCatnip += this.config.rewards.participation.jadeCatnip;
      rewards.sectReputation += this.config.rewards.participation.sectReputation;
    }

    // Apply rewards to game state
    this.applyRewards(rewards);

    // Update weekly tracking
    this.weeklyData.tournamentCompleted = true;
    this.weeklyData.wins = this.currentRun.wins;
    this.weeklyData.losses = this.currentRun.losses;
    this.weeklyData.bestRound = this.currentRun.currentRound + 1;

    // Update leaderboard
    this.updateLeaderboard({
      masterId: window.masterSystem?.selectedMaster?.id,
      masterName: window.masterSystem?.selectedMaster?.name,
      wins: this.currentRun.wins,
      rounds: this.currentRun.currentRound + 1,
      isChampion: isChampion,
      timestamp: Date.now()
    });

    // Clear tournament state
    const finalRun = this.currentRun;
    this.currentRun = null;
    this.state = TOURNAMENT_STATES.TOURNAMENT_COMPLETE;

    return {
      success: true,
      isChampion: isChampion,
      finalRound: finalRun.currentRound + 1,
      totalWins: finalRun.wins,
      rewards: rewards,
      history: finalRun.history
    };
  }

  /**
   * Apply rewards to game state
   */
  applyRewards(rewards) {
    if (window.gameState) {
      window.gameState.jadeCatnip = (window.gameState.jadeCatnip || 0) + rewards.jadeCatnip;
      window.gameState.destinyThreads = (window.gameState.destinyThreads || 0) + rewards.destinyThreads;
      window.gameState.sectReputation = (window.gameState.sectReputation || 0) + rewards.sectReputation;
    }

    // Apply titles
    for (const title of rewards.titles) {
      if (window.gameState && !window.gameState.unlockedTitles?.includes(title)) {
        window.gameState.unlockedTitles = window.gameState.unlockedTitles || [];
        window.gameState.unlockedTitles.push(title);
      }
    }

    // Apply cosmetics
    for (const cosmetic of rewards.cosmetics) {
      if (window.gameState && !window.gameState.unlockedCosmetics?.includes(cosmetic)) {
        window.gameState.unlockedCosmetics = window.gameState.unlockedCosmetics || [];
        window.gameState.unlockedCosmetics.push(cosmetic);
      }
    }
  }

  /**
   * Claim weekly rewards
   */
  claimRewards() {
    this.checkWeeklyReset();

    if (this.weeklyData.rewardsClaimed) {
      return { success: false, error: 'Weekly rewards already claimed' };
    }

    if (!this.weeklyData.tournamentCompleted) {
      return { success: false, error: 'Must complete tournament first' };
    }

    const rewards = {
      jadeCatnip: this.config.rewards.champion.jadeCatnip,
      sectReputation: this.weeklyData.wins * 50
    };

    this.applyRewards(rewards);
    this.weeklyData.rewardsClaimed = true;

    return {
      success: true,
      rewards: rewards,
      message: 'Weekly tournament rewards claimed!'
    };
  }

  /**
   * Get tournament leaderboard
   */
  getLeaderboard() {
    return this.leaderboard.slice(0, 10); // Top 10
  }

  /**
   * Update leaderboard with new entry
   */
  updateLeaderboard(entry) {
    this.leaderboard.push(entry);

    // Sort by wins, then by rounds
    this.leaderboard.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.rounds !== a.rounds) return b.rounds - a.rounds;
      return a.timestamp - b.timestamp;
    });

    // Keep only top 50
    this.leaderboard = this.leaderboard.slice(0, 50);
  }

  /**
   * Log battle message
   */
  logBattle(message) {
    if (this.currentBattle) {
      this.currentBattle.log.push({
        message,
        timestamp: Date.now()
      });
    }
    console.log(`[Tournament] ${message}`);
  }

  // ===================================
  // GETTERS
  // ===================================

  /**
   * Get current tournament state
   */
  getState() {
    return {
      state: this.state,
      currentRun: this.currentRun,
      currentBattle: this.currentBattle,
      weeklyData: this.weeklyData,
      stats: this.stats
    };
  }

  /**
   * Get all opponents info
   */
  getAllOpponents() {
    return Object.values(this.opponents);
  }

  /**
   * Get opponent by ID
   */
  getOpponent(id) {
    return this.opponents[id];
  }

  // ===================================
  // SERIALIZATION
  // ===================================

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      weeklyData: this.weeklyData,
      stats: this.stats,
      leaderboard: this.leaderboard.slice(0, 20)
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (!data) return;

    if (data.weeklyData) {
      this.weeklyData = data.weeklyData;
      this.checkWeeklyReset();
    }

    if (data.stats) {
      this.stats = {
        ...this.stats,
        ...data.stats
      };
      // Ensure defeatedMasters has all masters
      for (const masterId of Object.keys(TOURNAMENT_OPPONENTS)) {
        if (!this.stats.defeatedMasters[masterId]) {
          this.stats.defeatedMasters[masterId] = 0;
        }
      }
    }

    if (data.leaderboard) {
      this.leaderboard = data.leaderboard;
    }
  }

  /**
   * Reset system (for prestige)
   */
  reset(keepStats = false) {
    this.state = TOURNAMENT_STATES.IDLE;
    this.currentRun = null;
    this.currentBattle = null;

    if (!keepStats) {
      this.weeklyData = {
        weekStart: null,
        tournamentCompleted: false,
        rewardsClaimed: false,
        wins: 0,
        losses: 0,
        bestRound: 0
      };

      this.stats = {
        totalTournaments: 0,
        totalWins: 0,
        totalLosses: 0,
        championCount: 0,
        defeatedMasters: {},
        highestStreak: 0,
        currentStreak: 0
      };

      for (const masterId of Object.keys(TOURNAMENT_OPPONENTS)) {
        this.stats.defeatedMasters[masterId] = 0;
      }

      this.leaderboard = [];
    }
  }
}

// ===================================
// EXPORTS
// ===================================

window.TOURNAMENT_OPPONENTS = TOURNAMENT_OPPONENTS;
window.TOURNAMENT_CONFIG = TOURNAMENT_CONFIG;
window.TOURNAMENT_STATES = TOURNAMENT_STATES;
window.CelestialTournamentSystem = CelestialTournamentSystem;
