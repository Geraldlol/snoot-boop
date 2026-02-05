/**
 * events.js - Jianghu Random Events System
 * "In the Jianghu, fortune and chaos walk hand in hand."
 */

// Event Templates
const EVENT_TEMPLATES = {
  // === POSITIVE EVENTS ===
  merchant_visit: {
    id: 'merchant_visit',
    name: 'Wandering Merchant',
    emoji: '🏪',
    description: 'A merchant from distant lands visits your sect!',
    rarity: 'common',
    weight: 20,
    duration: 30000, // 30 seconds to interact
    rewards: {
      bp: { min: 100, max: 500 },
      items: ['rare_tea', 'silk_ribbon']
    },
    dialogue: [
      "Fine goods from across the Jianghu!",
      "Special prices for the Celestial Snoot Sect!",
      "I have wares if you have coin~"
    ]
  },

  zoomies_outbreak: {
    id: 'zoomies_outbreak',
    name: 'ZOOMIES OUTBREAK!',
    emoji: '💨',
    description: 'All cats enter rapid cultivation mode!',
    rarity: 'uncommon',
    weight: 15,
    duration: 60000, // 1 minute
    effect: {
      type: 'ppMultiplier',
      value: 3,
      duration: 60000
    },
    dialogue: [
      "The cats have gone WILD!",
      "*thundering paws everywhere*",
      "MAXIMUM ZOOMIES ACHIEVED!"
    ]
  },

  mass_meditation: {
    id: 'mass_meditation',
    name: 'Mass Meditation',
    emoji: '🧘',
    description: 'All cats achieve synchronized meditation!',
    rarity: 'uncommon',
    weight: 15,
    duration: 45000,
    effect: {
      type: 'ppMultiplier',
      value: 2,
      duration: 45000
    },
    rewards: {
      pp: { min: 50, max: 200 }
    },
    dialogue: [
      "Perfect harmony achieved...",
      "*synchronized purring intensifies*",
      "The Qi flows as one."
    ]
  },

  mysterious_box: {
    id: 'mysterious_box',
    name: 'Mysterious Box',
    emoji: '📦',
    description: 'A mysterious box has appeared! Something stirs within...',
    rarity: 'rare',
    weight: 8,
    duration: 20000,
    rewards: {
      catChance: 0.5, // 50% chance for free cat
      bp: { min: 200, max: 1000 }
    },
    dialogue: [
      "What could be inside...?",
      "*box rustles ominously*",
      "If it fits, it sits!"
    ]
  },

  sunbeam_blessing: {
    id: 'sunbeam_blessing',
    name: 'Perfect Sunbeam',
    emoji: '☀️',
    description: 'A perfect sunbeam illuminates the sanctuary!',
    rarity: 'common',
    weight: 20,
    duration: 30000,
    effect: {
      type: 'happinessBoost',
      value: 20
    },
    rewards: {
      pp: { min: 30, max: 100 }
    },
    dialogue: [
      "Warm... so warm...",
      "*cats migrate to the sunbeam*",
      "Peak cultivation conditions!"
    ]
  },

  wandering_cat: {
    id: 'wandering_cat',
    name: 'Wandering Cat',
    emoji: '🐱',
    description: 'A wandering cat seeks to join your sect!',
    rarity: 'rare',
    weight: 5,
    duration: 30000,
    rewards: {
      freeCat: true
    },
    dialogue: [
      "A new disciple approaches!",
      "*curious mrrp*",
      "They've heard of your legendary snoots."
    ]
  },

  treat_rain: {
    id: 'treat_rain',
    name: 'Treat Rain',
    emoji: '🐟',
    description: 'Treats fall from the heavens!',
    rarity: 'common',
    weight: 18,
    duration: 20000,
    effect: {
      type: 'happinessBoost',
      value: 15
    },
    rewards: {
      bp: { min: 50, max: 200 }
    },
    dialogue: [
      "IT'S RAINING TREATS!",
      "*happy chomping sounds*",
      "The heavens smile upon us!"
    ]
  },

  qi_surge: {
    id: 'qi_surge',
    name: 'Qi Surge',
    emoji: '⚡',
    description: 'A surge of Qi energy flows through the sect!',
    rarity: 'uncommon',
    weight: 12,
    duration: 30000,
    effect: {
      type: 'bpMultiplier',
      value: 2,
      duration: 30000
    },
    dialogue: [
      "POWER OVERWHELMING!",
      "*crackles with energy*",
      "Channel the Qi!"
    ]
  },

  waifu_gift: {
    id: 'waifu_gift',
    name: 'Master\'s Gift',
    emoji: '🎁',
    description: 'Your waifu master brings a special gift!',
    rarity: 'uncommon',
    weight: 10,
    duration: 15000,
    rewards: {
      bp: { min: 100, max: 400 },
      bondIncrease: 5
    },
    dialogue: [
      "I brought something for you~",
      "A token of my appreciation!",
      "Please accept this humble gift."
    ]
  },

  // === CHALLENGE EVENTS ===
  challenger_appears: {
    id: 'challenger_appears',
    name: 'Challenger Appears!',
    emoji: '⚔️',
    description: 'A rival cultivator challenges your sect!',
    rarity: 'uncommon',
    weight: 10,
    duration: 20000,
    isChallenge: true,
    challengeType: 'boop_battle',
    targetBoops: 20,
    rewards: {
      bp: { min: 300, max: 800 },
      jadeCatnip: 1
    },
    failPenalty: {
      bp: -100
    },
    dialogue: [
      "Your boop technique is WEAK!",
      "Face me in honorable combat!",
      "I challenge your sect's honor!"
    ]
  },

  // === NEGATIVE EVENTS (rare) ===
  lazy_day: {
    id: 'lazy_day',
    name: 'Lazy Day',
    emoji: '😴',
    description: 'The cats are feeling extra lazy today...',
    rarity: 'common',
    weight: 8,
    duration: 30000,
    effect: {
      type: 'ppMultiplier',
      value: 0.5,
      duration: 30000
    },
    dialogue: [
      "*yawwwwn*",
      "Too comfy to cultivate...",
      "Five more minutes..."
    ]
  },

  hairball_incident: {
    id: 'hairball_incident',
    name: 'Hairball Incident',
    emoji: '🤢',
    description: 'A chain reaction of hairballs!',
    rarity: 'uncommon',
    weight: 5,
    duration: 15000,
    effect: {
      type: 'happinessDrop',
      value: 10
    },
    dialogue: [
      "*hurk hurk hurk*",
      "Not on the meditation mats!",
      "The cleanup begins..."
    ]
  }
};

// Event rarity weights for rolling
const RARITY_WEIGHTS = {
  common: 1.0,
  uncommon: 0.5,
  rare: 0.2,
  legendary: 0.05
};

/**
 * EventSystem - Manages random Jianghu events
 */
class EventSystem {
  constructor() {
    this.activeEvent = null;
    this.eventTimer = null;
    this.eventHistory = [];
    this.activeEffects = [];
    this.challengeProgress = 0;

    // Event check interval (check every 30 seconds)
    this.checkInterval = 30000;
    this.baseEventChance = 0.15; // 15% chance per check
  }

  /**
   * Start the event system
   */
  start() {
    setInterval(() => this.checkForEvent(), this.checkInterval);
  }

  /**
   * Check if an event should trigger
   */
  checkForEvent() {
    if (this.activeEvent) return; // Don't trigger while event is active

    // Base chance modified by game state
    let chance = this.baseEventChance;

    // Andrew's Lightning Reflexes bonus
    if (window.gameState?.modifiers?.eventChanceBonus) {
      chance *= (1 + window.gameState.modifiers.eventChanceBonus);
    }

    // Chaos Goose doubles event frequency
    if (window.gameState?.gooseAlly?.id === 'chaos') {
      chance *= 2;
    }

    if (Math.random() < chance) {
      this.triggerRandomEvent();
    }
  }

  /**
   * Trigger a random event based on weights
   */
  triggerRandomEvent() {
    const event = this.rollEvent();
    if (event) {
      this.startEvent(event);
    }
  }

  /**
   * Roll for an event based on weights
   */
  rollEvent() {
    const events = Object.values(EVENT_TEMPLATES);
    const totalWeight = events.reduce((sum, e) => sum + (e.weight || 10), 0);

    let roll = Math.random() * totalWeight;

    for (const event of events) {
      roll -= (event.weight || 10);
      if (roll <= 0) {
        return { ...event }; // Return a copy
      }
    }

    return events[0]; // Fallback
  }

  /**
   * Start an event
   */
  startEvent(event) {
    this.activeEvent = event;
    this.challengeProgress = 0;

    // Play event sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('event');
    }

    // Show event UI
    this.showEventUI(event);

    // Apply immediate effects
    if (event.effect) {
      this.applyEffect(event.effect);
    }

    // Set timer for event duration
    this.eventTimer = setTimeout(() => {
      this.endEvent(event.isChallenge ? false : true);
    }, event.duration);

    // Log event
    this.eventHistory.push({
      id: event.id,
      timestamp: Date.now(),
      completed: false
    });
  }

  /**
   * End the current event
   */
  endEvent(success = true) {
    if (!this.activeEvent) return;

    clearTimeout(this.eventTimer);

    const event = this.activeEvent;

    if (success) {
      this.grantRewards(event);
      // Play success sound
      if (window.audioSystem) {
        window.audioSystem.playSFX('levelup');
      }
    } else if (event.failPenalty) {
      this.applyPenalty(event.failPenalty);
      // Play failure sound
      if (window.audioSystem) {
        window.audioSystem.playSFX('error');
      }
    }

    // Update history
    const historyEntry = this.eventHistory[this.eventHistory.length - 1];
    if (historyEntry) {
      historyEntry.completed = success;
    }

    // Hide UI
    this.hideEventUI();

    this.activeEvent = null;
  }

  /**
   * Handle interaction with event (clicking, etc.)
   */
  interactWithEvent() {
    if (!this.activeEvent) return;

    const event = this.activeEvent;

    if (event.isChallenge && event.challengeType === 'boop_battle') {
      this.challengeProgress++;

      if (this.challengeProgress >= event.targetBoops) {
        this.endEvent(true);
      }
    } else {
      // Non-challenge events end on interaction
      this.endEvent(true);
    }
  }

  /**
   * Apply an effect to the game
   */
  applyEffect(effect) {
    const effectEntry = {
      ...effect,
      startTime: Date.now(),
      endTime: Date.now() + (effect.duration || 30000)
    };

    this.activeEffects.push(effectEntry);

    // Apply to game state
    switch (effect.type) {
      case 'ppMultiplier':
        window.gameState.modifiers.eventPPMultiplier = effect.value;
        break;
      case 'bpMultiplier':
        window.gameState.modifiers.eventBPMultiplier = effect.value;
        break;
      case 'happinessBoost':
        if (window.catSystem) {
          window.catSystem.boostHappiness(effect.value);
        }
        break;
      case 'happinessDrop':
        if (window.catSystem) {
          window.catSystem.boostHappiness(-effect.value);
        }
        break;
    }

    // Remove effect after duration
    setTimeout(() => {
      this.removeEffect(effectEntry);
    }, effect.duration || 30000);
  }

  /**
   * Remove an effect
   */
  removeEffect(effect) {
    const index = this.activeEffects.indexOf(effect);
    if (index > -1) {
      this.activeEffects.splice(index, 1);
    }

    // Reset game state modifier
    switch (effect.type) {
      case 'ppMultiplier':
        window.gameState.modifiers.eventPPMultiplier = 1;
        break;
      case 'bpMultiplier':
        window.gameState.modifiers.eventBPMultiplier = 1;
        break;
    }
  }

  /**
   * Grant rewards from an event
   */
  grantRewards(event) {
    if (!event.rewards) return;

    const rewards = event.rewards;
    let rewardText = [];

    // BP reward
    if (rewards.bp) {
      const bp = this.randomRange(rewards.bp.min, rewards.bp.max);
      window.gameState.boopPoints += bp;
      rewardText.push(`+${bp} BP`);
    }

    // PP reward
    if (rewards.pp) {
      const pp = this.randomRange(rewards.pp.min, rewards.pp.max);
      window.gameState.purrPower += pp;
      rewardText.push(`+${pp} PP`);
    }

    // Jade Catnip reward
    if (rewards.jadeCatnip) {
      window.gameState.jadeCatnip += rewards.jadeCatnip;
      rewardText.push(`+${rewards.jadeCatnip} Jade Catnip`);
    }

    // Free cat reward
    if (rewards.freeCat || (rewards.catChance && Math.random() < rewards.catChance)) {
      if (window.catSystem) {
        const newCat = window.catSystem.recruitCat();
        if (newCat) {
          rewardText.push(`New cat: ${newCat.name}!`);
        }
      }
    }

    // Bond increase
    if (rewards.bondIncrease && window.waifuSystem) {
      const waifu = window.waifuSystem.getActiveWaifu();
      if (waifu) {
        window.waifuSystem.increaseBond(waifu.id, rewards.bondIncrease);
        rewardText.push(`+${rewards.bondIncrease} Bond`);
      }
    }

    // Show reward notification
    if (rewardText.length > 0) {
      this.showRewardNotification(rewardText.join(', '));
    }
  }

  /**
   * Apply penalty for failed events
   */
  applyPenalty(penalty) {
    if (penalty.bp) {
      window.gameState.boopPoints = Math.max(0, window.gameState.boopPoints + penalty.bp);
      this.showRewardNotification(`${penalty.bp} BP`);
    }
  }

  /**
   * Random range helper
   */
  randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Show event UI
   */
  showEventUI(event) {
    let eventBanner = document.getElementById('event-banner');

    if (!eventBanner) {
      eventBanner = document.createElement('div');
      eventBanner.id = 'event-banner';
      eventBanner.className = 'event-banner';
      document.body.appendChild(eventBanner);
    }

    const dialogue = event.dialogue[Math.floor(Math.random() * event.dialogue.length)];

    eventBanner.innerHTML = `
      <div class="event-content" onclick="window.eventSystem.interactWithEvent()">
        <span class="event-emoji">${event.emoji}</span>
        <div class="event-text">
          <h3>${event.name}</h3>
          <p>${event.description}</p>
          <p class="event-dialogue">"${dialogue}"</p>
          ${event.isChallenge ? `<div class="challenge-progress">Progress: <span id="challenge-count">${this.challengeProgress}</span>/${event.targetBoops}</div>` : ''}
          <p class="event-hint">Click to ${event.isChallenge ? 'fight back!' : 'collect!'}</p>
        </div>
        <div class="event-timer-bar">
          <div class="event-timer-fill" style="animation-duration: ${event.duration}ms"></div>
        </div>
      </div>
    `;

    eventBanner.classList.add('visible');
  }

  /**
   * Update challenge progress display
   */
  updateChallengeUI() {
    const counter = document.getElementById('challenge-count');
    if (counter) {
      counter.textContent = this.challengeProgress;
    }
  }

  /**
   * Hide event UI
   */
  hideEventUI() {
    const eventBanner = document.getElementById('event-banner');
    if (eventBanner) {
      eventBanner.classList.remove('visible');
    }
  }

  /**
   * Show reward notification
   */
  showRewardNotification(text) {
    const notification = document.createElement('div');
    notification.className = 'event-reward-notification';
    notification.textContent = text;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('visible'), 10);
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  /**
   * Get active effects for display
   */
  getActiveEffects() {
    return this.activeEffects.filter(e => Date.now() < e.endTime);
  }

  /**
   * Get combined effect multipliers
   */
  getEffectMultipliers() {
    return {
      pp: window.gameState?.modifiers?.eventPPMultiplier || 1,
      bp: window.gameState?.modifiers?.eventBPMultiplier || 1
    };
  }
}

// Export
window.EVENT_TEMPLATES = EVENT_TEMPLATES;
window.EventSystem = EventSystem;
