/**
 * parasites.js - Resource Parasites (Wrinkler-style)
 * "These little pests drain your Qi... but perhaps that's not all bad."
 */

// Parasite Types
const PARASITE_TYPES = {
  wrinkler: {
    id: 'wrinkler',
    name: 'Qi Wrinkler',
    emoji: '🐛',
    color: '#8B4513',
    drainPercent: 0.02, // 2% of production
    returnMultiplier: 1.1, // Return 110% when popped
    spawnWeight: 70,
    description: 'A common parasite that siphons your Qi.'
  },
  chonkler: {
    id: 'chonkler',
    name: 'Chonkler',
    emoji: '🐌',
    color: '#228B22',
    drainPercent: 0.05, // 5% of production
    returnMultiplier: 1.15, // Return 115% when popped
    spawnWeight: 20,
    description: 'A rotund parasite with a bigger appetite.'
  },
  elder_wrinkler: {
    id: 'elder_wrinkler',
    name: 'Elder Wrinkler',
    emoji: '👴',
    color: '#4B0082',
    drainPercent: 0.03,
    returnMultiplier: 1.5, // Return 150% when popped!
    spawnWeight: 5,
    description: 'An ancient parasite that stores Qi more efficiently.',
    isElder: true
  },
  shiny_wrinkler: {
    id: 'shiny_wrinkler',
    name: 'Shiny Wrinkler',
    emoji: '✨',
    color: '#FFD700',
    drainPercent: 0.02,
    returnMultiplier: 1.1,
    bonusMaterials: true, // Drops materials when popped
    spawnWeight: 4,
    description: 'A rare glittering parasite that drops materials.'
  },
  void_wrinkler: {
    id: 'void_wrinkler',
    name: 'Void Wrinkler',
    emoji: '🌑',
    color: '#1a1a2e',
    drainPercent: 0.04,
    returnMultiplier: 1.25,
    drainsPP: true, // Drains PP instead of BP
    spawnWeight: 8,
    description: 'A shadowy parasite that feeds on Purr Power instead.'
  }
};

// Parasite Upgrades (purchased with popped parasites)
const PARASITE_UPGRADES = {
  faster_spawn: {
    id: 'faster_spawn',
    name: 'Pheromone Trail',
    description: 'Parasites spawn 20% faster',
    effect: { spawnRateMultiplier: 0.8 },
    cost: 10,
    maxLevel: 5
  },
  better_return: {
    id: 'better_return',
    name: 'Qi Fermentation',
    description: '+5% return multiplier for all parasites',
    effect: { returnBonus: 0.05 },
    cost: 15,
    maxLevel: 10
  },
  elder_chance: {
    id: 'elder_chance',
    name: 'Ancient Attractor',
    description: '+2% chance for Elder parasites',
    effect: { elderChanceBonus: 0.02 },
    cost: 25,
    maxLevel: 5
  },
  max_parasites: {
    id: 'max_parasites',
    name: 'Expanded Habitat',
    description: '+2 maximum parasites',
    effect: { maxParasitesBonus: 2 },
    cost: 20,
    maxLevel: 5
  },
  auto_pop: {
    id: 'auto_pop',
    name: 'Auto-Harvester',
    description: 'Automatically pop parasites at 1M stored',
    effect: { autoPopThreshold: 1000000 },
    cost: 50,
    maxLevel: 1
  }
};

/**
 * ParasiteSystem - Manages resource-draining parasites
 */
class ParasiteSystem {
  constructor() {
    this.parasiteTypes = PARASITE_TYPES;
    this.upgradeTemplates = PARASITE_UPGRADES;

    // Active parasites
    this.parasites = [];
    this.maxParasites = 10;

    // Spawning
    this.spawnInterval = 120000; // 2 minutes base
    this.lastSpawnTime = 0;
    this.spawnChance = 0.3; // 30% chance per interval

    // Upgrades
    this.upgrades = {};
    for (const id of Object.keys(PARASITE_UPGRADES)) {
      this.upgrades[id] = 0;
    }

    // Statistics
    this.stats = {
      totalPopped: 0,
      totalDrained: 0,
      totalReturned: 0,
      eldersPoppied: 0,
      materialsFromShinies: 0
    };
  }

  /**
   * Update parasites (call every frame/tick)
   */
  update(deltaTime, currentBpRate, currentPpRate) {
    const now = Date.now();

    // Check for spawning
    if (now - this.lastSpawnTime >= this.getSpawnInterval()) {
      if (Math.random() < this.spawnChance && this.parasites.length < this.getMaxParasites()) {
        this.spawnParasite();
      }
      this.lastSpawnTime = now;
    }

    // Update each parasite
    for (const parasite of this.parasites) {
      // Calculate drain amount
      const drainRate = parasite.type.drainsPP ? currentPpRate : currentBpRate;
      const drainAmount = drainRate * parasite.type.drainPercent * (deltaTime / 1000);

      parasite.storedAmount += drainAmount;
      parasite.totalDrained += drainAmount;
      this.stats.totalDrained += drainAmount;

      // Check auto-pop threshold
      const autoPopThreshold = this.getAutopopThreshold();
      if (autoPopThreshold > 0 && parasite.storedAmount >= autoPopThreshold) {
        this.popParasite(parasite.id);
      }
    }
  }

  /**
   * Spawn a new parasite
   */
  spawnParasite() {
    if (this.parasites.length >= this.getMaxParasites()) return null;

    // Pick random type (weighted)
    const type = this.pickRandomType();
    if (!type) return null;

    const parasite = {
      id: `parasite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      storedAmount: 0,
      totalDrained: 0,
      spawnedAt: Date.now(),
      position: this.getRandomPosition()
    };

    this.parasites.push(parasite);

    if (window.audioSystem) {
      if (type.isElder) {
        window.audioSystem.playSFX('elderSpawn');
      } else {
        window.audioSystem.playSFX('parasiteSpawn');
      }
    }

    return parasite;
  }

  /**
   * Pick random parasite type (weighted)
   */
  pickRandomType() {
    const types = Object.values(this.parasiteTypes);

    // Adjust weights based on upgrades
    const elderBonus = this.upgrades.elder_chance * 0.02;

    let totalWeight = 0;
    const weighted = [];

    for (const type of types) {
      let weight = type.spawnWeight;
      if (type.isElder) {
        weight += elderBonus * 100; // Convert to weight points
      }
      totalWeight += weight;
      weighted.push({ type, weight });
    }

    let roll = Math.random() * totalWeight;
    for (const { type, weight } of weighted) {
      roll -= weight;
      if (roll <= 0) return type;
    }

    return types[0];
  }

  /**
   * Get random position for parasite
   */
  getRandomPosition() {
    // Position around the BP display area
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 40;
    return {
      angle,
      distance,
      wiggle: Math.random() * Math.PI * 2
    };
  }

  /**
   * Pop a parasite (harvest it)
   */
  popParasite(parasiteId) {
    const index = this.parasites.findIndex(p => p.id === parasiteId);
    if (index < 0) return null;

    const parasite = this.parasites[index];
    this.parasites.splice(index, 1);

    // Calculate return amount
    let returnMultiplier = parasite.type.returnMultiplier;
    returnMultiplier += this.upgrades.better_return * 0.05;

    const returnAmount = parasite.storedAmount * returnMultiplier;

    this.stats.totalPopped++;
    this.stats.totalReturned += returnAmount;

    if (parasite.type.isElder) {
      this.stats.eldersPoppied++;
    }

    // Result object
    const result = {
      parasite,
      returnAmount,
      returnType: parasite.type.drainsPP ? 'pp' : 'bp',
      bonusMaterials: null
    };

    // Shiny wrinkler bonus materials
    if (parasite.type.bonusMaterials && window.craftingSystem) {
      const materials = window.craftingSystem.generateDrop({
        floor: 10,
        isBoss: false
      });
      result.bonusMaterials = materials;
      this.stats.materialsFromShinies += materials.length;
    }

    if (window.audioSystem) {
      window.audioSystem.playSFX('parasitePop');
    }

    return result;
  }

  /**
   * Pop all parasites
   */
  popAllParasites() {
    const results = [];

    // Pop in reverse order to avoid index issues
    const ids = this.parasites.map(p => p.id);
    for (const id of ids) {
      const result = this.popParasite(id);
      if (result) results.push(result);
    }

    return results;
  }

  /**
   * Get total drain rate
   */
  getTotalDrainRate(resourceType = 'bp') {
    let totalDrain = 0;

    for (const parasite of this.parasites) {
      const drainsBP = !parasite.type.drainsPP;
      if ((resourceType === 'bp' && drainsBP) || (resourceType === 'pp' && !drainsBP)) {
        totalDrain += parasite.type.drainPercent;
      }
    }

    return totalDrain;
  }

  /**
   * Get effective production (after parasite drain)
   */
  getEffectiveProduction(baseProduction, resourceType = 'bp') {
    const drainRate = this.getTotalDrainRate(resourceType);
    return baseProduction * (1 - drainRate);
  }

  /**
   * Get total stored in all parasites
   */
  getTotalStored() {
    return this.parasites.reduce((sum, p) => sum + p.storedAmount, 0);
  }

  /**
   * Get potential return if all popped now
   */
  getPotentialReturn() {
    let total = 0;

    for (const parasite of this.parasites) {
      let returnMultiplier = parasite.type.returnMultiplier;
      returnMultiplier += this.upgrades.better_return * 0.05;
      total += parasite.storedAmount * returnMultiplier;
    }

    return total;
  }

  /**
   * Purchase upgrade
   */
  purchaseUpgrade(upgradeId) {
    const template = this.upgradeTemplates[upgradeId];
    if (!template) return false;

    const currentLevel = this.upgrades[upgradeId] || 0;
    if (currentLevel >= template.maxLevel) return false;

    const cost = template.cost * (currentLevel + 1);
    if (this.stats.totalPopped < cost) return false;

    // Note: In actual implementation, would track "pop currency" separately
    this.upgrades[upgradeId] = currentLevel + 1;

    return true;
  }

  /**
   * Get spawn interval (with upgrades)
   */
  getSpawnInterval() {
    let interval = this.spawnInterval;
    const multiplier = Math.pow(0.8, this.upgrades.faster_spawn || 0);
    return interval * multiplier;
  }

  /**
   * Get max parasites (with upgrades)
   */
  getMaxParasites() {
    return this.maxParasites + (this.upgrades.max_parasites || 0) * 2;
  }

  /**
   * Get auto-pop threshold (0 if not unlocked)
   */
  getAutopopThreshold() {
    if (!this.upgrades.auto_pop) return 0;
    return PARASITE_UPGRADES.auto_pop.effect.autoPopThreshold;
  }

  /**
   * Get parasite count by type
   */
  getParasiteCountByType() {
    const counts = {};
    for (const parasite of this.parasites) {
      const typeId = parasite.type.id;
      counts[typeId] = (counts[typeId] || 0) + 1;
    }
    return counts;
  }

  /**
   * Force spawn (for testing)
   */
  forceSpawn(typeId = null) {
    if (this.parasites.length >= this.getMaxParasites()) return null;

    let type;
    if (typeId && this.parasiteTypes[typeId]) {
      type = this.parasiteTypes[typeId];
    } else {
      type = this.pickRandomType();
    }

    const parasite = {
      id: `parasite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      storedAmount: 0,
      totalDrained: 0,
      spawnedAt: Date.now(),
      position: this.getRandomPosition()
    };

    this.parasites.push(parasite);
    return parasite;
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      parasites: this.parasites.map(p => ({
        id: p.id,
        typeId: p.type.id,
        storedAmount: p.storedAmount,
        totalDrained: p.totalDrained,
        spawnedAt: p.spawnedAt,
        position: p.position
      })),
      upgrades: this.upgrades,
      stats: this.stats,
      lastSpawnTime: this.lastSpawnTime
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.parasites) {
      this.parasites = data.parasites.map(p => ({
        ...p,
        type: this.parasiteTypes[p.typeId]
      })).filter(p => p.type); // Filter out invalid types
    }
    if (data.upgrades) {
      this.upgrades = { ...this.upgrades, ...data.upgrades };
    }
    if (data.stats) {
      this.stats = { ...this.stats, ...data.stats };
    }
    if (data.lastSpawnTime) {
      this.lastSpawnTime = data.lastSpawnTime;
    }
  }

  /**
   * Reset system
   */
  reset() {
    this.parasites = [];
    this.lastSpawnTime = 0;

    for (const id of Object.keys(PARASITE_UPGRADES)) {
      this.upgrades[id] = 0;
    }

    this.stats = {
      totalPopped: 0,
      totalDrained: 0,
      totalReturned: 0,
      eldersPoppied: 0,
      materialsFromShinies: 0
    };
  }
}

// Export
window.PARASITE_TYPES = PARASITE_TYPES;
window.PARASITE_UPGRADES = PARASITE_UPGRADES;
window.ParasiteSystem = ParasiteSystem;
