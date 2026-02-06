/**
 * cultivation.js - Master Cultivation Realm System
 * "The journey of a thousand boops begins with a single snoot."
 *
 * The PRIMARY progression axis for players. Inspired by Xianxia novels.
 * 10 major realms × 9 sub-ranks = 90 levels of cultivation
 */

console.log('Loading Cultivation System...');

// ===================================
// CULTIVATION REALMS
// ===================================

const CULTIVATION_REALMS = {
  mortal: {
    id: 'mortal',
    name: 'Mortal Realm',
    order: 1,
    ranks: 9,
    description: 'The beginning of the path. You are but a wanderer in the Jianghu.',
    color: '#A0A0A0',
    xpBase: 100,
    xpScale: 1.15,
    realmScale: 1.0,
    tribulation: null,
    unlocks: ['basic_boop', 'cat_sanctuary'],
    passives: {
      1: { name: 'Awakened Spirit', description: '+10% Boop Power', effect: { boopPower: 1.1 } },
      5: { name: 'Mortal Foundation', description: '+15% PP Generation', effect: { ppGeneration: 1.15 } },
      9: { name: 'Mortal Peak', description: '+2% Critical Chance', effect: { critChance: 0.02 } }
    },
    spriteVariant: 'mortal',
    bgColor: '#2a2a3a'
  },

  qiCondensation: {
    id: 'qiCondensation',
    name: 'Qi Condensation',
    order: 2,
    ranks: 9,
    description: 'You have begun to sense the Qi of the world. The snoots call to you.',
    color: '#87CEEB',
    xpBase: 1000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Tribulation of Awakening',
      type: 'boss',
      description: 'Face your inner demons and prove your resolve.',
      enemy: {
        name: 'Inner Demon Kitten',
        hp: 500,
        attack: 10,
        defense: 5,
        special: 'Reflects 10% damage'
      },
      failPenalty: { xpLoss: 0.3 },
      rewards: { jadeCatnip: 100, destinyThreads: 10 }
    },
    unlocks: ['technique_stances', 'cat_training', 'expeditions'],
    passives: {
      1: { name: 'Qi Sense', description: '+10% Event Discovery', effect: { eventDiscovery: 1.1 } },
      5: { name: 'Meridian Opening', description: '+25% Boop Power', effect: { boopPower: 1.25 } },
      9: { name: 'Condensation Complete', description: '+20% AFK Efficiency', effect: { afkEfficiency: 1.2 } }
    },
    spriteVariant: 'qi_condensation',
    bgColor: '#1a2a4a'
  },

  foundationEstablishment: {
    id: 'foundationEstablishment',
    name: 'Foundation Establishment',
    order: 3,
    ranks: 9,
    description: 'Your foundation is set. The cats recognize you as a true cultivator.',
    color: '#8B4513',
    xpBase: 10000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Tribulation of Foundation',
      type: 'survival',
      description: 'Survive 5 waves of spirit beasts to prove your foundation is solid.',
      waves: 5,
      enemies: [
        { name: 'Spirit Fox', hp: 200, attack: 15 },
        { name: 'Spirit Wolf', hp: 300, attack: 20 },
        { name: 'Spirit Tiger', hp: 400, attack: 25 },
        { name: 'Spirit Dragon Cub', hp: 500, attack: 30 },
        { name: 'Foundation Guardian', hp: 1000, attack: 50 }
      ],
      failPenalty: { xpLoss: 0.4, catHappiness: -10 },
      rewards: { jadeCatnip: 500, destinyThreads: 25, cat: { minRealm: 'earth' } }
    },
    unlocks: ['cat_teams', 'first_waifu', 'meditation_garden', 'equipment_basic'],
    passives: {
      1: { name: 'Stable Foundation', description: 'Combo decay slowed by 50%', effect: { comboDecay: 0.5 } },
      5: { name: 'Inner Strength', description: '+20% Tribulation Power', effect: { tribulationPower: 1.2 } },
      9: { name: 'Foundation Peak', description: '+10 Cat Capacity', effect: { catCapacity: 10 } }
    },
    spriteVariant: 'foundation',
    bgColor: '#3a2a1a'
  },

  coreFormation: {
    id: 'coreFormation',
    name: 'Core Formation',
    order: 4,
    ranks: 9,
    description: 'A golden core forms within you. Your boops shake the heavens.',
    color: '#FFD700',
    xpBase: 100000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Tribulation of the Golden Core',
      type: 'boss',
      description: 'The Shadow Goose tests all who seek to form their core.',
      enemy: {
        name: 'Shadow Goose',
        hp: 5000,
        attack: 100,
        defense: 50,
        special: 'HONK: Stuns for 2 seconds every 10 seconds',
        phases: 3
      },
      failPenalty: { xpLoss: 0.5, coreDamage: true },
      rewards: { jadeCatnip: 2000, destinyThreads: 100, technique: 'golden_boop' }
    },
    unlocks: ['infinite_pagoda', 'equipment_advanced', 'waifu_teaching', 'golden_snoot'],
    passives: {
      1: { name: 'Golden Core', description: '+10% All Stats', effect: { allStats: 1.1 } },
      5: { name: 'Core Resonance', description: '+25% Cat Synergy Bonuses', effect: { catSynergy: 1.25 } },
      9: { name: 'Perfect Core', description: '+50% Critical Damage', effect: { critDamage: 1.5 } }
    },
    spriteVariant: 'core_formation',
    bgColor: '#4a3a1a'
  },

  nascentSoul: {
    id: 'nascentSoul',
    name: 'Nascent Soul',
    order: 5,
    ranks: 9,
    description: 'A nascent soul emerges. You are no longer bound by mortal limits.',
    color: '#9370DB',
    xpBase: 1000000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Soul Tribulation',
      type: 'puzzle',
      description: 'Gather the 7 fragments of your soul scattered across the dream realm.',
      challenge: 'soul_fragments',
      fragments: 7,
      timeLimit: 300,
      failPenalty: { xpLoss: 0.5, soulDamage: true },
      rewards: { jadeCatnip: 10000, destinyThreads: 500, cat: { minRealm: 'sky' } }
    },
    unlocks: ['dream_realm', 'cat_fusion', 'territory_expansion', 'elemental_mastery'],
    passives: {
      1: { name: 'Soul Awakening', description: '+50% Offline Gains', effect: { offlineGains: 1.5 } },
      5: { name: 'Soul Projection', description: '+25% Dungeon Speed', effect: { dungeonSpeed: 1.25 } },
      9: { name: 'Complete Soul', description: 'Gain 1 Death Defiance', effect: { deathDefiance: 1 } }
    },
    spriteVariant: 'nascent_soul',
    bgColor: '#3a2a4a'
  },

  spiritSevering: {
    id: 'spiritSevering',
    name: 'Spirit Severing',
    order: 6,
    ranks: 9,
    description: 'You sever ties with the mundane. Only the Dao of Snoot remains.',
    color: '#DC143C',
    xpBase: 10000000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Severing Tribulation',
      type: 'choice',
      description: 'Face your heart demons. Each choice shapes your path.',
      challenge: 'heart_demons',
      choices: [
        { demon: 'Pride', sacrifice: 'critDamage', gain: 'boopPower' },
        { demon: 'Greed', sacrifice: 'ppGeneration', gain: 'jadeCatnipBonus' },
        { demon: 'Sloth', sacrifice: 'afkEfficiency', gain: 'activeBonus' }
      ],
      failPenalty: { xpLoss: 0.5, permanentScar: true },
      rewards: { jadeCatnip: 50000, destinyThreads: 2000, forbiddenTechnique: 1 }
    },
    unlocks: ['ascension_preview', 'legendary_cats', 'waifu_cultivation', 'forbidden_techniques'],
    passives: {
      1: { name: 'Severed Attachments', description: 'Immune to negative events', effect: { immuneToTheft: true } },
      5: { name: 'Spirit Blade', description: '2x Boop Power', effect: { boopPower: 2.0 } },
      9: { name: 'Complete Severance', description: '+10% All Passives', effect: { allPassives: 1.1 } }
    },
    spriteVariant: 'spirit_severing',
    bgColor: '#4a1a1a'
  },

  daoSeeking: {
    id: 'daoSeeking',
    name: 'Dao Seeking',
    order: 7,
    ranks: 9,
    description: 'You seek the ultimate truth. What is the Dao of the Snoot?',
    color: '#4169E1',
    xpBase: 100000000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Dao Heart Tribulation',
      type: 'gauntlet',
      description: 'Face the 9 trials of the Dao. Each tests a different aspect of your cultivation.',
      stages: 9,
      trials: [
        { name: 'Trial of Patience', type: 'time' },
        { name: 'Trial of Courage', type: 'boss' },
        { name: 'Trial of Wisdom', type: 'puzzle' },
        { name: 'Trial of Compassion', type: 'choice' },
        { name: 'Trial of Balance', type: 'survival' },
        { name: 'Trial of Sacrifice', type: 'resource' },
        { name: 'Trial of Unity', type: 'team' },
        { name: 'Trial of Mastery', type: 'technique' },
        { name: 'Trial of Transcendence', type: 'final' }
      ],
      failPenalty: { xpLoss: 0.75, daoWounds: true },
      rewards: { jadeCatnip: 250000, destinyThreads: 10000, cat: { realm: 'heaven' } }
    },
    unlocks: ['reincarnation_preview', 'divine_cats', 'goose_dimension', 'celestial_tournament'],
    passives: {
      1: { name: 'Dao Glimpse', description: '2x Rare Event Chance', effect: { rareEventChance: 2.0 } },
      5: { name: 'Dao Comprehension', description: '+50% XP Gain', effect: { xpGain: 1.5 } },
      9: { name: 'Dao Heart', description: '+25% Tribulation Success', effect: { tribulationSuccess: 1.25 } }
    },
    spriteVariant: 'dao_seeking',
    bgColor: '#1a2a5a'
  },

  immortalAscension: {
    id: 'immortalAscension',
    name: 'Immortal Ascension',
    order: 8,
    ranks: 9,
    description: 'You stand at the threshold of immortality. The heavens take notice.',
    color: '#FFD700',
    xpBase: 1000000000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Heavenly Tribulation',
      type: 'epic_boss',
      description: 'The Cosmic Goose descends from the heavens. This is your final test.',
      enemy: {
        name: 'Cosmic Goose',
        hp: 1000000,
        attack: 10000,
        defense: 5000,
        special: 'COSMIC HONK: Reality-warping attacks',
        phases: 7,
        enrage: true
      },
      failPenalty: { death: true },
      rewards: { heavenlySeals: 10, cat: { realm: 'divine' }, title: 'Heaven-Touched' }
    },
    unlocks: ['ascension_system', 'eighth_master_hints', 'celestial_realm_preview'],
    passives: {
      1: { name: 'Immortal Body', description: '2x HP Regeneration', effect: { hpRegen: 2.0 } },
      5: { name: 'Immortal Qi', description: '2x Qi Capacity', effect: { qiCapacity: 2.0 } },
      9: { name: 'Almost Immortal', description: '+50% Permanent Bonus', effect: { permanentBonus: 1.5 } }
    },
    spriteVariant: 'immortal_ascension',
    bgColor: '#4a4a1a'
  },

  trueImmortal: {
    id: 'trueImmortal',
    name: 'True Immortal',
    order: 9,
    ranks: 9,
    description: 'You have transcended mortality. The cats bow before your eternal snoot.',
    color: '#FFFFFF',
    xpBase: 10000000000,
    xpScale: 1.15,
    realmScale: 3.0,
    tribulation: {
      name: 'Transcendence Tribulation',
      type: 'ultimate',
      description: 'Face the Void itself. Only the worthy may transcend.',
      challenge: 'face_the_void',
      failPenalty: { reincarnationForced: true },
      rewards: { transcendencePoints: 1, legendaryTitle: 'Void Walker', cosmicCat: true }
    },
    unlocks: ['transcendence_preview', 'true_form', 'cosmic_cats', 'eighth_master'],
    passives: {
      1: { name: 'Eternal Life', description: 'Unlimited AFK Time', effect: { offlineTimeLimit: Infinity } },
      5: { name: 'True Understanding', description: '2x All Multipliers', effect: { allMultipliers: 2.0 } },
      9: { name: 'True Immortal Peak', description: 'Ready for Transcendence', effect: { readyForTranscendence: true } }
    },
    spriteVariant: 'true_immortal',
    bgColor: '#5a5a5a'
  },

  heavenlySovereign: {
    id: 'heavenlySovereign',
    name: 'Heavenly Sovereign',
    order: 10,
    ranks: Infinity,
    description: 'You have become one with the heavens. Your snoot IS the Dao.',
    color: '#FFD700',
    xpBase: 100000000000,
    xpScale: 1.2,
    realmScale: null,
    tribulation: null,
    unlocks: ['everything'],
    passives: {
      scaling: {
        every: 10,
        name: 'Sovereign\'s Blessing',
        description: '+10% All Stats per 10 ranks',
        effect: { allStats: 1.1 }
      }
    },
    spriteVariant: 'heavenly_sovereign',
    bgColor: '#3a3a1a'
  }
};

// ===================================
// CULTIVATION SYSTEM CLASS
// ===================================

class CultivationSystem {
  constructor() {
    this.currentRealm = 'mortal';
    this.currentRank = 1;
    this.cultivationXP = 0;
    this.totalCultivationXP = 0;
    this.activeTribulation = null;
    this.tribulationAttempts = {};
    this.passivesUnlocked = [];
    this.unlockedContent = ['basic_boop', 'cat_sanctuary'];
    this.severingChoices = {};
    this.daoWounds = 0;
    this.permanentScars = 0;
    this.stats = {
      realmBreakthroughs: 0,
      tribulationSuccesses: 0,
      tribulationFailures: 0,
      totalXPEarned: 0,
      highestRealm: 'mortal',
      highestRank: 1
    };
  }

  // ===================================
  // XP & PROGRESSION
  // ===================================

  /**
   * Calculate XP needed for next rank within current realm
   */
  getXPForNextRank() {
    const realm = CULTIVATION_REALMS[this.currentRealm];
    if (this.currentRank >= realm.ranks && realm.ranks !== Infinity) {
      return Infinity; // Need tribulation to progress
    }
    return Math.floor(realm.xpBase * Math.pow(realm.xpScale, this.currentRank - 1));
  }

  /**
   * Calculate total XP needed to reach a specific realm
   */
  getTotalXPForRealm(realmId) {
    let totalXP = 0;
    for (const [id, realm] of Object.entries(CULTIVATION_REALMS)) {
      if (realm.order < CULTIVATION_REALMS[realmId].order) {
        for (let rank = 1; rank <= realm.ranks; rank++) {
          totalXP += Math.floor(realm.xpBase * Math.pow(realm.xpScale, rank - 1));
        }
        if (realm.realmScale) {
          totalXP *= realm.realmScale;
        }
      }
    }
    return totalXP;
  }

  /**
   * Add cultivation XP (earned from booping, meditation, events, etc.)
   */
  addXP(amount) {
    // Apply XP bonuses
    const bonusMult = this.getXPMultiplier();
    const finalAmount = Math.floor(amount * bonusMult);

    this.cultivationXP += finalAmount;
    this.totalCultivationXP += finalAmount;
    this.stats.totalXPEarned += finalAmount;

    // Check for rank up
    this.checkRankUp();

    return finalAmount;
  }

  /**
   * Get current XP multiplier from passives and effects
   */
  getXPMultiplier() {
    let mult = 1.0;

    // Check passives
    for (const passiveId of this.passivesUnlocked) {
      const [realmId, rank] = passiveId.split('_');
      const realm = CULTIVATION_REALMS[realmId];
      if (realm && realm.passives[rank]?.effect?.xpGain) {
        mult *= realm.passives[rank].effect.xpGain;
      }
    }

    // Check master bonuses
    if (window.masterSystem?.selectedMaster?.id === 'steve') {
      // Steve's strategic approach helps with cultivation
      mult *= 1.1;
    }

    return mult;
  }

  /**
   * Check if player can rank up
   */
  checkRankUp() {
    const realm = CULTIVATION_REALMS[this.currentRealm];
    const xpNeeded = this.getXPForNextRank();

    while (this.cultivationXP >= xpNeeded && this.currentRank < realm.ranks) {
      this.cultivationXP -= xpNeeded;
      this.currentRank++;
      this.onRankUp();
    }
  }

  /**
   * Called when player ranks up
   */
  onRankUp() {
    const realm = CULTIVATION_REALMS[this.currentRealm];

    // Update stats
    if (this.currentRank > this.stats.highestRank ||
        CULTIVATION_REALMS[this.currentRealm].order > CULTIVATION_REALMS[this.stats.highestRealm].order) {
      this.stats.highestRank = this.currentRank;
      this.stats.highestRealm = this.currentRealm;
    }

    // Check for passive unlocks
    if (realm.passives[this.currentRank]) {
      const passiveId = `${this.currentRealm}_${this.currentRank}`;
      if (!this.passivesUnlocked.includes(passiveId)) {
        this.passivesUnlocked.push(passiveId);
        this.onPassiveUnlocked(realm.passives[this.currentRank], passiveId);
      }
    }

    // Notification
    this.showRankUpNotification();

    // Audio
    if (window.audioSystem) {
      window.audioSystem.playSFX('levelup');
    }

    // Check achievements
    if (window.achievementSystem) {
      window.achievementSystem.checkAchievements(window.gameState);
    }
  }

  /**
   * Called when a passive is unlocked
   */
  onPassiveUnlocked(passive, passiveId) {
    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: 'cultivation',
        title: 'Passive Unlocked!',
        message: `${passive.name}: ${passive.description}`,
        duration: 5000
      });
    }

    // Apply passive effects
    this.applyPassiveEffects();
  }

  // ===================================
  // REALM BREAKTHROUGH
  // ===================================

  /**
   * Check if player can attempt realm breakthrough
   */
  canAttemptBreakthrough() {
    const realm = CULTIVATION_REALMS[this.currentRealm];

    // Must be at max rank of current realm
    if (this.currentRank < realm.ranks) {
      return { can: false, reason: `Must reach rank ${realm.ranks} first` };
    }

    // Must have enough XP overflow
    const xpNeeded = this.getXPForNextRank();
    if (this.cultivationXP < xpNeeded * 0.5) {
      return { can: false, reason: 'Need more cultivation XP to stabilize breakthrough' };
    }

    // Check if next realm exists
    const nextRealm = this.getNextRealm();
    if (!nextRealm) {
      return { can: false, reason: 'You have reached the pinnacle of cultivation!' };
    }

    // Check if in tribulation cooldown
    if (this.activeTribulation) {
      return { can: false, reason: 'Already in tribulation' };
    }

    return { can: true };
  }

  /**
   * Get the next realm after current
   */
  getNextRealm() {
    const currentOrder = CULTIVATION_REALMS[this.currentRealm].order;
    for (const [id, realm] of Object.entries(CULTIVATION_REALMS)) {
      if (realm.order === currentOrder + 1) {
        return realm;
      }
    }
    return null;
  }

  /**
   * Start realm breakthrough tribulation
   */
  startBreakthrough() {
    const check = this.canAttemptBreakthrough();
    if (!check.can) {
      return { success: false, reason: check.reason };
    }

    const nextRealm = this.getNextRealm();
    if (!nextRealm.tribulation) {
      // Auto-succeed for realms without tribulations
      return this.completeBreakthrough(nextRealm.id);
    }

    // Start tribulation
    this.activeTribulation = {
      realmId: nextRealm.id,
      tribulation: nextRealm.tribulation,
      startTime: Date.now(),
      attempts: (this.tribulationAttempts[nextRealm.id] || 0) + 1,
      state: 'active',
      progress: 0,
      data: {}
    };

    this.tribulationAttempts[nextRealm.id] = this.activeTribulation.attempts;

    // Show tribulation UI
    this.showTribulationUI();

    return {
      success: true,
      tribulation: nextRealm.tribulation,
      message: `Beginning ${nextRealm.tribulation.name}...`
    };
  }

  /**
   * Complete a tribulation successfully
   */
  completeTribulation() {
    if (!this.activeTribulation) return { success: false };

    const realmId = this.activeTribulation.realmId;
    const tribulation = this.activeTribulation.tribulation;

    // Clear tribulation state
    this.activeTribulation = null;

    // Complete breakthrough
    return this.completeBreakthrough(realmId, tribulation.rewards);
  }

  /**
   * Fail a tribulation
   */
  failTribulation() {
    if (!this.activeTribulation) return { success: false };

    const realmId = this.activeTribulation.realmId;
    const tribulation = this.activeTribulation.tribulation;
    const penalty = tribulation.failPenalty;

    this.stats.tribulationFailures++;

    // Apply penalties
    if (penalty.xpLoss) {
      const lostXP = Math.floor(this.cultivationXP * penalty.xpLoss);
      this.cultivationXP -= lostXP;
    }

    if (penalty.catHappiness && window.catSystem) {
      window.catSystem.modifyAllCatHappiness(penalty.catHappiness);
    }

    if (penalty.permanentScar) {
      this.permanentScars++;
    }

    if (penalty.daoWounds) {
      this.daoWounds++;
    }

    // Consolation rewards
    const consolation = {
      jadeCatnip: Math.floor((tribulation.rewards?.jadeCatnip || 100) * 0.1),
      destinyThreads: Math.floor((tribulation.rewards?.destinyThreads || 10) * 0.1)
    };

    // Grant consolation
    if (window.gameState) {
      window.gameState.jadeCatnip += consolation.jadeCatnip;
      window.gameState.destinyThreads += consolation.destinyThreads;
    }

    // Clear tribulation state
    this.activeTribulation = null;

    // Hide tribulation UI
    this.hideTribulationUI();

    // Notification
    if (window.showNotification) {
      window.showNotification({
        type: 'warning',
        title: 'Tribulation Failed',
        message: 'The heavens test those who persist. Rise again, cultivator.',
        duration: 5000
      });
    }

    return {
      success: false,
      penalty,
      consolation,
      message: 'The heavens test those who persist. Rise again, cultivator.'
    };
  }

  /**
   * Complete realm breakthrough
   */
  completeBreakthrough(realmId, rewards = {}) {
    const oldRealm = this.currentRealm;
    const newRealm = CULTIVATION_REALMS[realmId];

    // Update realm
    this.currentRealm = realmId;
    this.currentRank = 1;
    this.cultivationXP = 0;

    // Update stats
    this.stats.realmBreakthroughs++;
    this.stats.tribulationSuccesses++;
    this.stats.highestRealm = realmId;
    this.stats.highestRank = 1;

    // Unlock content
    for (const unlock of newRealm.unlocks) {
      if (!this.unlockedContent.includes(unlock)) {
        this.unlockedContent.push(unlock);
      }
    }

    // Unlock first passive
    if (newRealm.passives[1]) {
      const passiveId = `${realmId}_1`;
      if (!this.passivesUnlocked.includes(passiveId)) {
        this.passivesUnlocked.push(passiveId);
      }
    }

    // Grant rewards
    if (window.gameState) {
      if (rewards.jadeCatnip) window.gameState.jadeCatnip += rewards.jadeCatnip;
      if (rewards.destinyThreads) window.gameState.destinyThreads += rewards.destinyThreads;
      if (rewards.heavenlySeals && window.prestigeSystem) {
        window.prestigeSystem.addHeavenlySeals(rewards.heavenlySeals);
      }
    }

    // Grant cat reward
    if (rewards.cat && window.catSystem) {
      const catReward = window.catSystem.generateRandomCat(rewards.cat);
      if (catReward) {
        window.catSystem.addCat(catReward);
      }
    }

    // Grant technique reward
    if (rewards.technique && window.techniqueSystem) {
      window.techniqueSystem.unlockTechnique(rewards.technique);
    }

    // Apply passive effects
    this.applyPassiveEffects();

    // Hide tribulation UI
    this.hideTribulationUI();

    // Epic notification
    this.showBreakthroughNotification(oldRealm, realmId);

    // Achievement check
    if (window.achievementSystem) {
      window.achievementSystem.checkAchievements(window.gameState);
    }

    return {
      success: true,
      oldRealm,
      newRealm: realmId,
      unlocks: newRealm.unlocks,
      rewards,
      message: `You have broken through to ${newRealm.name}!`
    };
  }

  // ===================================
  // PASSIVE EFFECTS
  // ===================================

  /**
   * Get all active passive effects
   */
  getPassiveEffects() {
    const effects = {
      boopPower: 1,
      ppGeneration: 1,
      critChance: 0,
      critDamage: 1,
      afkEfficiency: 1,
      offlineGains: 1,
      eventDiscovery: 1,
      comboDecay: 1,
      tribulationPower: 1,
      catCapacity: 0,
      catSynergy: 1,
      deathDefiance: 0,
      dungeonSpeed: 1,
      allStats: 1,
      allPassives: 1,
      rareEventChance: 1,
      xpGain: 1,
      tribulationSuccess: 1,
      hpRegen: 1,
      qiCapacity: 1,
      permanentBonus: 1,
      offlineTimeLimit: 24 * 60 * 60 * 1000, // 24 hours default
      allMultipliers: 1
    };

    // Apply unlocked passives
    for (const passiveId of this.passivesUnlocked) {
      const [realmId, rank] = passiveId.split('_');
      const realm = CULTIVATION_REALMS[realmId];
      if (realm && realm.passives[rank]) {
        const passive = realm.passives[rank];
        for (const [key, value] of Object.entries(passive.effect)) {
          if (typeof effects[key] === 'number') {
            if (key === 'critChance' || key === 'catCapacity' || key === 'deathDefiance') {
              effects[key] += value;
            } else {
              effects[key] *= value;
            }
          } else {
            effects[key] = value;
          }
        }
      }
    }

    // Apply Heavenly Sovereign scaling
    if (this.currentRealm === 'heavenlySovereign') {
      const realm = CULTIVATION_REALMS.heavenlySovereign;
      const bonusCount = Math.floor(this.currentRank / realm.passives.scaling.every);
      effects.allStats *= Math.pow(realm.passives.scaling.effect.allStats, bonusCount);
    }

    // Apply allPassives multiplier
    if (effects.allPassives !== 1) {
      for (const key of Object.keys(effects)) {
        if (key !== 'allPassives' && typeof effects[key] === 'number' && effects[key] !== 0) {
          if (key === 'critChance' || key === 'catCapacity' || key === 'deathDefiance') {
            effects[key] *= effects.allPassives;
          } else {
            effects[key] *= effects.allPassives;
          }
        }
      }
    }

    return effects;
  }

  /**
   * Apply passive effects to game state
   */
  applyPassiveEffects() {
    const effects = this.getPassiveEffects();

    if (window.gameState) {
      window.gameState.cultivationEffects = effects;
    }

    return effects;
  }

  // ===================================
  // UI HELPERS
  // ===================================

  showRankUpNotification() {
    const realm = CULTIVATION_REALMS[this.currentRealm];
    if (window.showNotification) {
      window.showNotification({
        type: 'cultivation',
        title: 'Rank Up!',
        message: `${realm.name} Rank ${this.currentRank}`,
        duration: 3000
      });
    }
  }

  showBreakthroughNotification(oldRealmId, newRealmId) {
    const oldRealm = CULTIVATION_REALMS[oldRealmId];
    const newRealm = CULTIVATION_REALMS[newRealmId];

    if (window.showNotification) {
      window.showNotification({
        type: 'epic',
        title: 'REALM BREAKTHROUGH!',
        message: `You have ascended from ${oldRealm.name} to ${newRealm.name}!`,
        duration: 8000
      });
    }

    // Screen flash effect
    if (typeof triggerScreenFlash === 'function') {
      triggerScreenFlash(newRealm.color);
    }

    // Play breakthrough sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('breakthrough');
    }
  }

  showTribulationUI() {
    // Will be implemented in UI updates
    console.log('Tribulation UI would show here');

    // Dispatch event for UI to handle
    window.dispatchEvent(new CustomEvent('tribulationStart', {
      detail: this.activeTribulation
    }));
  }

  hideTribulationUI() {
    window.dispatchEvent(new CustomEvent('tribulationEnd'));
  }

  // ===================================
  // GETTERS
  // ===================================

  getCurrentRealm() {
    return CULTIVATION_REALMS[this.currentRealm];
  }

  getRealmProgress() {
    const xpNeeded = this.getXPForNextRank();
    return {
      current: this.cultivationXP,
      needed: xpNeeded,
      percent: xpNeeded === Infinity ? 100 : (this.cultivationXP / xpNeeded) * 100
    };
  }

  getOverallProgress() {
    const realm = CULTIVATION_REALMS[this.currentRealm];
    const realmProgress = ((this.currentRank - 1) / realm.ranks) +
                         (this.getRealmProgress().percent / 100 / realm.ranks);
    const totalRealms = Object.keys(CULTIVATION_REALMS).length - 1; // Exclude infinite realm
    const overallProgress = ((realm.order - 1) + realmProgress) / totalRealms;
    return Math.min(overallProgress * 100, 100);
  }

  getDisplayTitle() {
    const realm = CULTIVATION_REALMS[this.currentRealm];
    if (this.currentRealm === 'heavenlySovereign') {
      return `${realm.name} (Rank ${this.currentRank})`;
    }
    return `${realm.name} Rank ${this.currentRank}`;
  }

  isContentUnlocked(contentId) {
    return this.unlockedContent.includes(contentId) || this.unlockedContent.includes('everything');
  }

  // ===================================
  // SERIALIZATION
  // ===================================

  serialize() {
    return {
      currentRealm: this.currentRealm,
      currentRank: this.currentRank,
      cultivationXP: this.cultivationXP,
      totalCultivationXP: this.totalCultivationXP,
      tribulationAttempts: this.tribulationAttempts,
      passivesUnlocked: this.passivesUnlocked,
      unlockedContent: this.unlockedContent,
      severingChoices: this.severingChoices,
      daoWounds: this.daoWounds,
      permanentScars: this.permanentScars,
      stats: this.stats
    };
  }

  deserialize(data) {
    if (!data) return;

    this.currentRealm = data.currentRealm || 'mortal';
    this.currentRank = data.currentRank || 1;
    this.cultivationXP = data.cultivationXP || 0;
    this.totalCultivationXP = data.totalCultivationXP || 0;
    this.tribulationAttempts = data.tribulationAttempts || {};
    this.passivesUnlocked = data.passivesUnlocked || [];
    this.unlockedContent = data.unlockedContent || ['basic_boop', 'cat_sanctuary'];
    this.severingChoices = data.severingChoices || {};
    this.daoWounds = data.daoWounds || 0;
    this.permanentScars = data.permanentScars || 0;
    this.stats = data.stats || {
      realmBreakthroughs: 0,
      tribulationSuccesses: 0,
      tribulationFailures: 0,
      totalXPEarned: 0,
      highestRealm: 'mortal',
      highestRank: 1
    };

    // Re-apply passive effects
    this.applyPassiveEffects();
  }
}

// Export for use
window.CultivationSystem = CultivationSystem;
window.CULTIVATION_REALMS = CULTIVATION_REALMS;

// ===================================
// DATA LOADER INTEGRATION
// ===================================

/**
 * Load cultivation data from JSON and merge with hardcoded defaults.
 * Hardcoded values serve as fallback if JSON not available.
 */
function loadCultivationDataFromJSON(data) {
  if (!data) return;

  // Update CULTIVATION_REALMS from JSON
  if (data.realms) {
    for (const [realmId, realmData] of Object.entries(data.realms)) {
      if (CULTIVATION_REALMS[realmId]) {
        // Merge JSON data with existing, JSON takes precedence
        Object.assign(CULTIVATION_REALMS[realmId], realmData);

        // Handle special case for Infinity ranks (JSON stores as null)
        if (realmData.ranks === null && realmId === 'heavenlySovereign') {
          CULTIVATION_REALMS[realmId].ranks = Infinity;
        }

        // Handle special case for Infinity offline time limit
        if (realmData.passives) {
          for (const [rank, passive] of Object.entries(realmData.passives)) {
            if (passive.effect?.offlineTimeLimit === null) {
              CULTIVATION_REALMS[realmId].passives[rank].effect.offlineTimeLimit = Infinity;
            }
          }
        }
      } else {
        // New realm from JSON
        CULTIVATION_REALMS[realmId] = realmData;
        if (realmData.ranks === null) {
          CULTIVATION_REALMS[realmId].ranks = Infinity;
        }
      }
    }
  }

  // Store tribulation types if present
  if (data.tribulationTypes) {
    window.TRIBULATION_TYPES = data.tribulationTypes;
  }

  // Store prestige layers data if present
  if (data.prestigeLayers) {
    window.PRESTIGE_LAYERS = data.prestigeLayers;
  }

  // Store heavenly seal bonuses if present
  if (data.heavenlySealBonuses) {
    window.HEAVENLY_SEAL_BONUSES = data.heavenlySealBonuses;
  }

  // Store karma shop if present
  if (data.karmaShop) {
    window.KARMA_SHOP = data.karmaShop;
  }

  console.log('Cultivation data loaded from JSON');
}

// Integration with dataLoader when available
if (window.dataLoader) {
  dataLoader.onReady(() => {
    const data = dataLoader.get('cultivation');
    if (data) {
      loadCultivationDataFromJSON(data);
    }
  });
} else {
  // If dataLoader doesn't exist yet, set up a listener for when it becomes available
  Object.defineProperty(window, 'dataLoader', {
    configurable: true,
    set: function(loader) {
      Object.defineProperty(window, 'dataLoader', {
        configurable: true,
        writable: true,
        value: loader
      });
      // Now that dataLoader is available, register our callback
      if (loader && loader.onReady) {
        loader.onReady(() => {
          const data = loader.get('cultivation');
          if (data) {
            loadCultivationDataFromJSON(data);
          }
        });
      }
    },
    get: function() {
      return undefined;
    }
  });
}

// Export the loader function for manual use if needed
window.loadCultivationDataFromJSON = loadCultivationDataFromJSON;

console.log('Cultivation System loaded!');
