/**
 * expeditions.js - Cat Expedition System
 * "Send your disciples to seek fortune in the Jianghu!"
 */

// Expedition Destinations
const EXPEDITION_DESTINATIONS = {
  bamboo_forest: {
    id: 'bamboo_forest',
    name: 'Bamboo Forest',
    emoji: '🎋',
    description: 'A peaceful grove where cats hunt bugs and find treasures.',
    difficulty: 1,
    duration: 60000, // 1 minute
    minCats: 1,
    maxCats: 3,
    requiredRealm: 'mortal',
    rewards: {
      bp: { min: 50, max: 150 },
      pp: { min: 10, max: 30 }
    },
    rareDrops: [
      { item: 'yarn_ball', chance: 0.2 },
      { item: 'catnip', chance: 0.1 }
    ],
    events: ['found_bug', 'nice_nap', 'bird_watching']
  },

  misty_mountains: {
    id: 'misty_mountains',
    name: 'Misty Mountains',
    emoji: '⛰️',
    description: 'Ancient peaks shrouded in mystery and cultivation energy.',
    difficulty: 2,
    duration: 180000, // 3 minutes
    minCats: 2,
    maxCats: 5,
    requiredRealm: 'earth',
    rewards: {
      bp: { min: 200, max: 500 },
      pp: { min: 50, max: 100 }
    },
    rareDrops: [
      { item: 'rare_tea', chance: 0.15 },
      { item: 'silk_ribbon', chance: 0.1 },
      { item: 'jadeCatnip', chance: 0.05 }
    ],
    events: ['meditation_spot', 'ancient_scroll', 'mountain_spirit']
  },

  dragon_temple: {
    id: 'dragon_temple',
    name: 'Dragon Temple',
    emoji: '🐉',
    description: 'Ruins of an ancient temple. Dangerous but rewarding.',
    difficulty: 3,
    duration: 300000, // 5 minutes
    minCats: 3,
    maxCats: 6,
    requiredRealm: 'sky',
    rewards: {
      bp: { min: 500, max: 1500 },
      pp: { min: 100, max: 300 }
    },
    rareDrops: [
      { item: 'jade_cup', chance: 0.1 },
      { item: 'ancient_scroll', chance: 0.08 },
      { item: 'jadeCatnip', chance: 0.15 }
    ],
    events: ['dragon_blessing', 'treasure_room', 'trap_avoided']
  },

  celestial_palace: {
    id: 'celestial_palace',
    name: 'Celestial Palace',
    emoji: '🏯',
    description: 'The legendary palace in the clouds. Only the worthy may enter.',
    difficulty: 4,
    duration: 600000, // 10 minutes
    minCats: 4,
    maxCats: 8,
    requiredRealm: 'heaven',
    rewards: {
      bp: { min: 2000, max: 5000 },
      pp: { min: 500, max: 1000 }
    },
    rareDrops: [
      { item: 'celestial_flower', chance: 0.2 },
      { item: 'golden_hairpin', chance: 0.02 },
      { item: 'jadeCatnip', chance: 0.3 },
      { item: 'destinyThread', chance: 0.05 }
    ],
    events: ['heavenly_blessing', 'immortal_encounter', 'golden_path']
  },

  void_realm: {
    id: 'void_realm',
    name: 'The Void Realm',
    emoji: '🌌',
    description: 'Beyond reality itself. Only Divine cats dare venture here.',
    difficulty: 5,
    duration: 900000, // 15 minutes
    minCats: 2,
    maxCats: 4,
    requiredRealm: 'divine',
    rewards: {
      bp: { min: 10000, max: 25000 },
      pp: { min: 2000, max: 5000 }
    },
    rareDrops: [
      { item: 'destiny_thread', chance: 0.15 },
      { item: 'golden_hairpin', chance: 0.05 },
      { item: 'jadeCatnip', chance: 0.5 }
    ],
    events: ['void_wisdom', 'cosmic_treasure', 'reality_warp']
  }
};

// Expedition Events
const EXPEDITION_EVENTS = {
  // Bamboo Forest
  found_bug: { message: 'Found a fascinating bug!', bonusBp: 20 },
  nice_nap: { message: 'Had a lovely nap in the sun.', bonusHappiness: 10 },
  bird_watching: { message: 'Watched birds for hours.', bonusPp: 15 },

  // Misty Mountains
  meditation_spot: { message: 'Found a perfect meditation spot!', bonusPp: 50 },
  ancient_scroll: { message: 'Discovered an ancient technique!', bonusBp: 100 },
  mountain_spirit: { message: 'Blessed by a mountain spirit!', bonusAll: 1.5 },

  // Dragon Temple
  dragon_blessing: { message: 'Received the dragon\'s blessing!', bonusAll: 2.0 },
  treasure_room: { message: 'Found a hidden treasure room!', bonusBp: 500 },
  trap_avoided: { message: 'Skillfully avoided ancient traps.', bonusPp: 100 },

  // Celestial Palace
  heavenly_blessing: { message: 'Bathed in heavenly light!', bonusAll: 2.5 },
  immortal_encounter: { message: 'Met an immortal cultivator!', bonusPp: 500 },
  golden_path: { message: 'Walked the golden path!', bonusBp: 1000 },

  // Void Realm
  void_wisdom: { message: 'Glimpsed the secrets of the void!', bonusPp: 2000 },
  cosmic_treasure: { message: 'Found a cosmic treasure!', bonusBp: 5000 },
  reality_warp: { message: 'Reality bent to their will!', bonusAll: 3.0 }
};

/**
 * ExpeditionSystem - Manages cat expeditions
 */
class ExpeditionSystem {
  constructor() {
    this.activeExpeditions = [];
    this.expeditionHistory = [];
    this.maxConcurrentExpeditions = 2;
    this.updateInterval = null;
  }

  /**
   * Start the expedition update loop
   */
  start() {
    this.updateInterval = setInterval(() => {
      this.updateExpeditions();
    }, 1000);
  }

  /**
   * Stop the expedition system
   */
  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  /**
   * Check if a destination is unlocked
   */
  isDestinationUnlocked(destinationId, catSystem) {
    const destination = EXPEDITION_DESTINATIONS[destinationId];
    if (!destination) return false;

    // Check if player has cats of required realm
    const cats = catSystem.getAllCats();
    const realmOrder = ['mortal', 'earth', 'sky', 'heaven', 'divine'];
    const requiredIndex = realmOrder.indexOf(destination.requiredRealm);

    return cats.some(cat => {
      const catRealmIndex = realmOrder.indexOf(cat.realm);
      return catRealmIndex >= requiredIndex;
    });
  }

  /**
   * Get available cats for expedition
   */
  getAvailableCats(catSystem) {
    const cats = catSystem.getAllCats();
    const busyCatIds = new Set();

    // Mark cats on expeditions as busy
    for (const exp of this.activeExpeditions) {
      for (const catId of exp.catIds) {
        busyCatIds.add(catId);
      }
    }

    return cats.filter(cat => !busyCatIds.has(cat.id));
  }

  /**
   * Check if can start expedition
   */
  canStartExpedition(destinationId, catIds, catSystem) {
    if (this.activeExpeditions.length >= this.maxConcurrentExpeditions) {
      return { can: false, reason: 'Maximum expeditions active' };
    }

    const destination = EXPEDITION_DESTINATIONS[destinationId];
    if (!destination) {
      return { can: false, reason: 'Invalid destination' };
    }

    if (catIds.length < destination.minCats) {
      return { can: false, reason: `Need at least ${destination.minCats} cats` };
    }

    if (catIds.length > destination.maxCats) {
      return { can: false, reason: `Maximum ${destination.maxCats} cats allowed` };
    }

    // Check if cats are available
    const availableCats = this.getAvailableCats(catSystem);
    const availableIds = new Set(availableCats.map(c => c.id));

    for (const catId of catIds) {
      if (!availableIds.has(catId)) {
        return { can: false, reason: 'Some cats are unavailable' };
      }
    }

    // Check realm requirement
    const realmOrder = ['mortal', 'earth', 'sky', 'heaven', 'divine'];
    const requiredIndex = realmOrder.indexOf(destination.requiredRealm);

    const hasQualifiedCat = catIds.some(catId => {
      const cat = catSystem.getCatById(catId);
      if (!cat) return false;
      const catRealmIndex = realmOrder.indexOf(cat.realm);
      return catRealmIndex >= requiredIndex;
    });

    if (!hasQualifiedCat) {
      return { can: false, reason: `Need at least one ${destination.requiredRealm} realm cat` };
    }

    return { can: true };
  }

  /**
   * Start an expedition
   */
  startExpedition(destinationId, catIds, catSystem) {
    const check = this.canStartExpedition(destinationId, catIds, catSystem);
    if (!check.can) return { success: false, reason: check.reason };

    const destination = EXPEDITION_DESTINATIONS[destinationId];

    // Calculate power based on cats
    let totalPower = 0;
    const catDetails = [];

    for (const catId of catIds) {
      const cat = catSystem.getCatById(catId);
      if (cat) {
        const power = this.calculateCatPower(cat);
        totalPower += power;
        catDetails.push({ id: cat.id, name: cat.name, power });
      }
    }

    const expedition = {
      id: Date.now().toString(),
      destinationId,
      destination,
      catIds,
      catDetails,
      totalPower,
      startTime: Date.now(),
      endTime: Date.now() + destination.duration,
      events: [],
      completed: false
    };

    this.activeExpeditions.push(expedition);

    // Play sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('event');
    }

    return { success: true, expedition };
  }

  /**
   * Calculate a cat's expedition power
   */
  calculateCatPower(cat) {
    const realmMultipliers = {
      mortal: 1,
      earth: 2,
      sky: 4,
      heaven: 8,
      divine: 16
    };

    let power = 10 * (realmMultipliers[cat.realm] || 1);

    // Add stat bonuses
    power += (cat.snootMeridians || 0) * 2;
    power += (cat.innerPurr || 0) * 1.5;
    power += (cat.zoomieSteps || 0) * 1;

    // Brave heart bonus
    if (cat.braveHeart) power *= 1.25;

    // Happiness bonus
    power *= (0.5 + (cat.happiness || 50) / 100);

    return Math.floor(power);
  }

  /**
   * Update active expeditions
   */
  updateExpeditions() {
    const now = Date.now();
    const completed = [];

    for (const expedition of this.activeExpeditions) {
      if (now >= expedition.endTime && !expedition.completed) {
        expedition.completed = true;
        const results = this.completeExpedition(expedition);
        completed.push({ expedition, results });
      }
    }

    // Remove completed expeditions
    this.activeExpeditions = this.activeExpeditions.filter(e => !e.completed);

    // Show completion UI for each
    for (const { expedition, results } of completed) {
      this.showCompletionUI(expedition, results);
    }
  }

  /**
   * Complete an expedition and calculate rewards
   */
  completeExpedition(expedition) {
    const destination = expedition.destination;
    const powerBonus = Math.min(2, 1 + expedition.totalPower / 100);

    // Base rewards
    let bpReward = this.randomInRange(destination.rewards.bp.min, destination.rewards.bp.max);
    let ppReward = this.randomInRange(destination.rewards.pp.min, destination.rewards.pp.max);

    // Apply power bonus
    bpReward = Math.floor(bpReward * powerBonus);
    ppReward = Math.floor(ppReward * powerBonus);

    // Roll for events
    const events = [];
    const numEvents = Math.floor(Math.random() * 3); // 0-2 events

    for (let i = 0; i < numEvents; i++) {
      const eventId = destination.events[Math.floor(Math.random() * destination.events.length)];
      const event = EXPEDITION_EVENTS[eventId];
      if (event) {
        events.push({ id: eventId, ...event });

        // Apply event bonuses
        if (event.bonusBp) bpReward += event.bonusBp;
        if (event.bonusPp) ppReward += event.bonusPp;
        if (event.bonusAll) {
          bpReward = Math.floor(bpReward * event.bonusAll);
          ppReward = Math.floor(ppReward * event.bonusAll);
        }
      }
    }

    // Roll for rare drops
    const drops = [];
    for (const drop of destination.rareDrops) {
      if (Math.random() < drop.chance * powerBonus) {
        drops.push(drop.item);
      }
    }

    // Apply rewards to game state
    if (window.gameState) {
      window.gameState.boopPoints += bpReward;
      window.gameState.purrPower += ppReward;
    }

    // Add drops to gift inventory
    if (window.giftSystem && drops.length > 0) {
      for (const drop of drops) {
        if (drop === 'jadeCatnip' && window.gameState) {
          window.gameState.jadeCatnip = (window.gameState.jadeCatnip || 0) + 1;
        } else if (drop === 'destinyThread' && window.gameState) {
          window.gameState.destinyThreads = (window.gameState.destinyThreads || 0) + 1;
        } else {
          window.giftSystem.addToInventory(drop);
        }
      }
    }

    // Increase cat happiness for participating
    if (window.catSystem) {
      for (const catId of expedition.catIds) {
        const cat = window.catSystem.getCatById(catId);
        if (cat) {
          cat.happiness = Math.min(100, (cat.happiness || 50) + 10);
        }
      }
    }

    // Log to history
    const results = {
      bpReward,
      ppReward,
      events,
      drops,
      completedAt: Date.now()
    };

    this.expeditionHistory.push({
      ...expedition,
      results
    });

    // Keep only last 50 expeditions
    if (this.expeditionHistory.length > 50) {
      this.expeditionHistory = this.expeditionHistory.slice(-50);
    }

    return results;
  }

  /**
   * Random number in range
   */
  randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get time remaining for expedition
   */
  getTimeRemaining(expeditionId) {
    const expedition = this.activeExpeditions.find(e => e.id === expeditionId);
    if (!expedition) return 0;
    return Math.max(0, expedition.endTime - Date.now());
  }

  /**
   * Format time for display
   */
  formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Show completion notification
   */
  showCompletionUI(expedition, results) {
    // Play sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('levelup');
    }

    const notification = document.createElement('div');
    notification.className = 'expedition-complete-notification';
    notification.innerHTML = `
      <div class="expedition-complete-header">
        <span class="expedition-emoji">${expedition.destination.emoji}</span>
        <span class="expedition-title">Expedition Complete!</span>
      </div>
      <p class="expedition-destination">${expedition.destination.name}</p>
      <div class="expedition-rewards">
        <span class="reward-item">+${results.bpReward} BP</span>
        <span class="reward-item">+${results.ppReward} PP</span>
        ${results.drops.length > 0 ? `<span class="reward-item drops">Found: ${results.drops.join(', ')}</span>` : ''}
      </div>
      ${results.events.length > 0 ? `
        <div class="expedition-events">
          ${results.events.map(e => `<p class="event-message">${e.message}</p>`).join('')}
        </div>
      ` : ''}
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('visible'), 10);
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      activeExpeditions: this.activeExpeditions,
      expeditionHistory: this.expeditionHistory.slice(-20),
      maxConcurrentExpeditions: this.maxConcurrentExpeditions
    };
  }

  /**
   * Load from save
   */
  deserialize(data) {
    if (!data) return;

    // Restore active expeditions (check if still valid)
    if (data.activeExpeditions) {
      const now = Date.now();
      for (const exp of data.activeExpeditions) {
        // Restore destination reference
        exp.destination = EXPEDITION_DESTINATIONS[exp.destinationId];
        if (exp.destination) {
          // Check if expedition should have completed while away
          if (now >= exp.endTime) {
            exp.completed = true;
            const results = this.completeExpedition(exp);
            this.showCompletionUI(exp, results);
          } else {
            this.activeExpeditions.push(exp);
          }
        }
      }
    }

    if (data.expeditionHistory) {
      this.expeditionHistory = data.expeditionHistory;
    }

    if (data.maxConcurrentExpeditions) {
      this.maxConcurrentExpeditions = data.maxConcurrentExpeditions;
    }
  }
}

// Export
window.EXPEDITION_DESTINATIONS = EXPEDITION_DESTINATIONS;
window.EXPEDITION_EVENTS = EXPEDITION_EVENTS;
window.ExpeditionSystem = ExpeditionSystem;
