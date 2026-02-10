/**
 * drama.js - The Drama System (8th Resource)
 * "Where there are waifus, there is drama."
 */

// Drama Event Types
const DRAMA_EVENTS = {
  // Positive Drama
  tea_time: {
    id: 'tea_time',
    name: 'Lovely Tea Time',
    emoji: '☕',
    type: 'positive',
    message: '{waifu1} and {waifu2} had a lovely tea time!',
    effects: { ppMultiplier: 1.1, duration: 3600000 },
    dramaGain: 5
  },
  story_time: {
    id: 'story_time',
    name: 'Story Sharing',
    emoji: '📖',
    type: 'positive',
    message: '{waifu1} told {waifu2} a great story!',
    effects: { expeditionRewards: 1.15, duration: 86400000 },
    dramaGain: 8
  },
  harmony: {
    id: 'harmony',
    name: 'Perfect Harmony',
    emoji: '💕',
    type: 'positive',
    message: 'All waifus are getting along harmoniously!',
    effects: { allMultiplier: 1.05, duration: 3600000 },
    dramaGain: 15,
    requiresAll: true
  },
  training_together: {
    id: 'training_together',
    name: 'Training Partners',
    emoji: '⚔️',
    type: 'positive',
    message: '{waifu1} and {waifu2} trained together!',
    effects: { bpMultiplier: 1.1, duration: 1800000 },
    dramaGain: 6
  },
  gift_exchange: {
    id: 'gift_exchange',
    name: 'Gift Exchange',
    emoji: '🎁',
    type: 'positive',
    message: '{waifu1} gave {waifu2} a thoughtful gift!',
    effects: { bondGainMultiplier: 1.2, duration: 7200000 },
    dramaGain: 10
  },

  // Negative Drama
  jealousy: {
    id: 'jealousy',
    name: 'Jealousy',
    emoji: '😤',
    type: 'negative',
    message: '{waifu1} is upset you spent time with {waifu2}!',
    effects: { waifuPenalty: '{waifu1}', penaltyAmount: 0.5 },
    dramaGain: 20
  },
  argument: {
    id: 'argument',
    name: 'Heated Argument',
    emoji: '🗡️',
    type: 'negative',
    message: '{waifu1} and {waifu2} had a disagreement!',
    effects: { partySeparation: ['{waifu1}', '{waifu2}'], duration: 86400000 },
    dramaGain: 25
  },
  neglect: {
    id: 'neglect',
    name: 'Feeling Neglected',
    emoji: '😢',
    type: 'negative',
    message: "You haven't visited {waifu1} in a while. She's worried.",
    effects: { waifuPenalty: '{waifu1}', penaltyAmount: 0.3 },
    dramaGain: 15
  },
  misunderstanding: {
    id: 'misunderstanding',
    name: 'Misunderstanding',
    emoji: '❓',
    type: 'negative',
    message: '{waifu1} misunderstood something you said...',
    effects: { waifuPenalty: '{waifu1}', penaltyAmount: 0.2 },
    dramaGain: 12
  },

  // Maximum Drama
  critical_mass: {
    id: 'critical_mass',
    name: 'CRITICAL MASS',
    emoji: '💔🔥',
    type: 'maximum',
    message: 'THE DRAMA HAS REACHED CRITICAL MASS!',
    effects: { allWaifuPenalty: 0.5 },
    dramaGain: 0,
    triggerThreshold: 100
  }
};

// Drama Queen - Secret Waifu unlocked through drama
const DRAMA_QUEEN = {
  id: 'drama_queen',
  name: 'Valentina',
  title: 'The Drama Queen',
  emoji: '👑',
  portrait: '💅',
  description: 'Thrives on chaos and conflict. The more drama, the stronger she becomes.',
  unlockCondition: 'Reach Maximum Drama 10 times',
  bonuses: {
    dramaGeneration: 3.0,
    dramaConversion: 1.5
  },
  dialogues: {
    greeting: "Oh my, did I cause that? Ohohoho~",
    onDrama: "Delicious! More drama, more power!",
    onHarmony: "How... boring. Let me fix that.",
    onGift: "A gift? How transparent. I love it.",
    stirPot: "Let me just... stir things up a bit~"
  }
};

/**
 * DramaSystem - Manages waifu drama and its effects
 */
class DramaSystem {
  constructor() {
    this.dramaPoints = 0;
    this.maxDrama = 100;
    this.dramaDecayRate = 0.5; // Per minute

    this.activeEvents = [];
    this.eventHistory = [];
    this.dramaLog = [];

    this.maximumDramaCount = 0;
    this.dramaQueenUnlocked = false;

    this.waifuRelations = {}; // Track relations between waifus
    this.lastInteractionTime = {}; // Track last interaction per waifu

    this.stats = {
      totalDramaGenerated: 0,
      totalDramaHarvested: 0,
      positiveEvents: 0,
      negativeEvents: 0,
      harmoniesAchieved: 0,
      criticalMassReached: 0
    };
  }

  /**
   * Update drama system
   */
  update(deltaTime) {
    // Decay drama over time (but slowly)
    const decayAmount = this.dramaDecayRate * (deltaTime / 60000);
    this.dramaPoints = Math.max(0, this.dramaPoints - decayAmount);

    // Update active events
    this.updateActiveEvents(deltaTime);

    // Check for random drama generation
    this.checkRandomDrama(deltaTime);

    // Check for maximum drama
    this.checkMaximumDrama();

    // Check neglect
    this.checkNeglect();
  }

  /**
   * Update active events
   */
  updateActiveEvents(deltaTime) {
    const now = Date.now();
    this.activeEvents = this.activeEvents.filter(event => {
      if (event.endsAt && event.endsAt < now) {
        this.onEventEnd(event);
        return false;
      }
      return true;
    });
  }

  /**
   * Check for random drama between waifus
   */
  checkRandomDrama(deltaTime) {
    if (!window.waifuSystem) return;

    const unlockedWaifus = window.waifuSystem.getUnlockedWaifus();
    if (unlockedWaifus.length < 2) return;

    // Small chance per minute for drama
    const chance = 0.02 * (deltaTime / 60000);

    if (Math.random() < chance) {
      this.generateRandomDrama(unlockedWaifus);
    }
  }

  /**
   * Generate random drama event
   */
  generateRandomDrama(waifus) {
    // Pick two random waifus
    const shuffled = [...waifus].sort(() => Math.random() - 0.5);
    const waifu1 = shuffled[0];
    const waifu2 = shuffled[1];

    // Determine positive or negative based on relations
    const relationScore = this.getRelationScore(waifu1.id, waifu2.id);
    const isPositive = Math.random() < (0.5 + relationScore * 0.3);

    // Pick event type
    const eventPool = Object.values(DRAMA_EVENTS).filter(e =>
      e.type === (isPositive ? 'positive' : 'negative') && !e.requiresAll
    );

    const eventTemplate = eventPool[Math.floor(Math.random() * eventPool.length)];

    this.triggerDramaEvent(eventTemplate, waifu1, waifu2);
  }

  /**
   * Trigger a drama event
   */
  triggerDramaEvent(template, waifu1, waifu2 = null) {
    const event = {
      ...template,
      waifu1: waifu1,
      waifu2: waifu2,
      timestamp: Date.now(),
      endsAt: template.effects.duration ? Date.now() + template.effects.duration : null
    };

    // Format message
    event.formattedMessage = template.message
      .replace('{waifu1}', waifu1?.name || 'Someone')
      .replace('{waifu2}', waifu2?.name || 'Someone');

    // Add drama points
    this.dramaPoints = Math.min(this.maxDrama, this.dramaPoints + template.dramaGain);
    this.stats.totalDramaGenerated += template.dramaGain;

    // Track stats
    if (template.type === 'positive') {
      this.stats.positiveEvents++;
      this.improveRelation(waifu1?.id, waifu2?.id);
    } else if (template.type === 'negative') {
      this.stats.negativeEvents++;
      this.worsenRelation(waifu1?.id, waifu2?.id);
    }

    // Add to active events
    this.activeEvents.push(event);
    this.eventHistory.push(event);
    this.dramaLog.push({
      message: event.formattedMessage,
      emoji: template.emoji,
      type: template.type,
      timestamp: Date.now()
    });

    // Keep log manageable
    if (this.dramaLog.length > 100) {
      this.dramaLog = this.dramaLog.slice(-100);
    }

    // Notify
    this.onDramaEvent(event);

    return event;
  }

  /**
   * Called when drama event triggers
   */
  onDramaEvent(event) {
    console.log(`[DRAMA] ${event.emoji} ${event.formattedMessage}`);

    if (window.showFloatingText) {
      window.showFloatingText(`${event.emoji} Drama!`, event.type === 'positive');
    }
  }

  /**
   * Called when event ends
   */
  onEventEnd(event) {
    console.log(`[DRAMA] Event ended: ${event.name}`);
  }

  /**
   * Check for maximum drama
   */
  checkMaximumDrama() {
    if (this.dramaPoints >= this.maxDrama) {
      this.triggerMaximumDrama();
    }
  }

  /**
   * Trigger maximum drama state
   */
  triggerMaximumDrama() {
    this.stats.criticalMassReached++;
    this.maximumDramaCount++;

    // Check for Drama Queen unlock
    if (this.maximumDramaCount >= 10 && !this.dramaQueenUnlocked) {
      this.unlockDramaQueen();
    }

    console.log('[DRAMA] CRITICAL MASS REACHED!');
  }

  /**
   * Unlock Drama Queen waifu
   */
  unlockDramaQueen() {
    this.dramaQueenUnlocked = true;

    // Add to waifu system if possible
    if (window.waifuSystem && window.waifuSystem.addCustomWaifu) {
      window.waifuSystem.addCustomWaifu(DRAMA_QUEEN);
    }

    console.log('[DRAMA] Drama Queen Valentina has been unlocked!');
  }

  /**
   * Check for neglected waifus
   */
  checkNeglect() {
    if (!window.waifuSystem) return;

    const now = Date.now();
    const neglectThreshold = 7 * 24 * 60 * 60 * 1000; // 7 days

    const waifus = window.waifuSystem.getUnlockedWaifus();
    for (const waifu of waifus) {
      const lastInteraction = this.lastInteractionTime[waifu.id] || now;
      if (now - lastInteraction > neglectThreshold) {
        // Trigger neglect event (once per session)
        if (!this.activeEvents.some(e => e.id === 'neglect' && e.waifu1?.id === waifu.id)) {
          this.triggerDramaEvent(DRAMA_EVENTS.neglect, waifu);
        }
      }
    }
  }

  /**
   * Record waifu interaction
   */
  recordInteraction(waifuId) {
    this.lastInteractionTime[waifuId] = Date.now();
  }

  /**
   * Gift one waifu while others watch (generates drama)
   */
  onGiftGiven(giftedWaifuId) {
    this.recordInteraction(giftedWaifuId);

    if (!window.waifuSystem) return;

    const waifus = window.waifuSystem.getUnlockedWaifus();
    const giftedWaifu = waifus.find(w => w.id === giftedWaifuId);

    // Small chance for jealousy from other waifus
    for (const waifu of waifus) {
      if (waifu.id === giftedWaifuId) continue;

      const jealousyChance = 0.1 - this.getRelationScore(waifu.id, giftedWaifuId) * 0.05;
      if (Math.random() < jealousyChance) {
        this.triggerDramaEvent(DRAMA_EVENTS.jealousy, waifu, giftedWaifu);
        break; // Only one jealousy event at a time
      }
    }
  }

  /**
   * Resolve drama (costs resources, restores harmony)
   */
  resolveDrama(cost = null) {
    if (this.dramaPoints <= 0) return false;

    // Calculate cost if not provided
    const resolveCost = cost || Math.floor(this.dramaPoints * 100);

    if (window.gameState && window.gameState.boopPoints < resolveCost) {
      return false;
    }

    if (window.gameState) {
      window.gameState.boopPoints = Math.max(0, window.gameState.boopPoints - resolveCost);
    }

    // Clear negative events
    this.activeEvents = this.activeEvents.filter(e => e.type !== 'negative');
    this.dramaPoints = 0;

    // Trigger harmony event
    if (window.waifuSystem) {
      const waifus = window.waifuSystem.getUnlockedWaifus();
      if (waifus.length >= 2) {
        this.triggerDramaEvent(DRAMA_EVENTS.harmony, waifus[0], waifus[1]);
        this.stats.harmoniesAchieved++;
      }
    }

    return true;
  }

  /**
   * Harvest drama for massive bonus
   */
  harvestDrama() {
    if (this.dramaPoints < this.maxDrama * 0.5) return null;

    const harvestAmount = this.dramaPoints;
    const bpBonus = harvestAmount * 1000; // 10x BP per drama point

    this.stats.totalDramaHarvested += harvestAmount;
    this.dramaPoints = Math.floor(this.dramaPoints * 0.5); // Keep some drama

    if (window.gameState) {
      window.gameState.boopPoints += bpBonus;
    }

    return {
      dramaHarvested: harvestAmount,
      bpGained: bpBonus
    };
  }

  /**
   * Get relation score between two waifus (-1 to 1)
   */
  getRelationScore(waifuId1, waifuId2) {
    if (!waifuId1 || !waifuId2) return 0;

    const key = [waifuId1, waifuId2].sort().join('_');
    return this.waifuRelations[key] || 0;
  }

  /**
   * Improve relation between waifus
   */
  improveRelation(waifuId1, waifuId2) {
    if (!waifuId1 || !waifuId2) return;

    const key = [waifuId1, waifuId2].sort().join('_');
    this.waifuRelations[key] = Math.min(1, (this.waifuRelations[key] || 0) + 0.1);
  }

  /**
   * Worsen relation between waifus
   */
  worsenRelation(waifuId1, waifuId2) {
    if (!waifuId1 || !waifuId2) return;

    const key = [waifuId1, waifuId2].sort().join('_');
    this.waifuRelations[key] = Math.max(-1, (this.waifuRelations[key] || 0) - 0.15);
  }

  /**
   * Get combined effects from drama
   */
  getCombinedEffects() {
    const effects = {
      ppMultiplier: 1,
      bpMultiplier: 1,
      allMultiplier: 1,
      bondGainMultiplier: 1,
      expeditionRewards: 1
    };

    for (const event of this.activeEvents) {
      if (event.effects.ppMultiplier) effects.ppMultiplier *= event.effects.ppMultiplier;
      if (event.effects.bpMultiplier) effects.bpMultiplier *= event.effects.bpMultiplier;
      if (event.effects.allMultiplier) effects.allMultiplier *= event.effects.allMultiplier;
      if (event.effects.bondGainMultiplier) effects.bondGainMultiplier *= event.effects.bondGainMultiplier;
      if (event.effects.expeditionRewards) effects.expeditionRewards *= event.effects.expeditionRewards;
    }

    // Penalty from maximum drama
    if (this.dramaPoints >= this.maxDrama) {
      effects.allMultiplier *= 0.5;
    }

    return effects;
  }

  /**
   * Get drama status for UI
   */
  getStatus() {
    return {
      current: this.dramaPoints,
      max: this.maxDrama,
      percent: (this.dramaPoints / this.maxDrama) * 100,
      isMaximum: this.dramaPoints >= this.maxDrama,
      activeEvents: this.activeEvents,
      recentLog: this.dramaLog.slice(-10),
      dramaQueenUnlocked: this.dramaQueenUnlocked,
      effects: this.getCombinedEffects()
    };
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      dramaPoints: this.dramaPoints,
      waifuRelations: this.waifuRelations,
      lastInteractionTime: this.lastInteractionTime,
      maximumDramaCount: this.maximumDramaCount,
      dramaQueenUnlocked: this.dramaQueenUnlocked,
      dramaLog: this.dramaLog.slice(-50),
      stats: this.stats
    };
  }

  /**
   * Load from save
   */
  deserialize(data) {
    if (data.dramaPoints !== undefined) this.dramaPoints = data.dramaPoints;
    if (data.waifuRelations) this.waifuRelations = data.waifuRelations;
    if (data.lastInteractionTime) this.lastInteractionTime = data.lastInteractionTime;
    if (data.maximumDramaCount !== undefined) this.maximumDramaCount = data.maximumDramaCount;
    if (data.dramaQueenUnlocked !== undefined) this.dramaQueenUnlocked = data.dramaQueenUnlocked;
    if (data.dramaLog) this.dramaLog = data.dramaLog;
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
  }
}

// Export
window.DRAMA_EVENTS = DRAMA_EVENTS;
window.DRAMA_QUEEN = DRAMA_QUEEN;
window.DramaSystem = DramaSystem;
