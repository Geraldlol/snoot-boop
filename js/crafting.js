/**
 * crafting.js - Crafting System
 * "The path to mastery is forged one item at a time."
 */

// Material Categories
const MATERIAL_CATEGORIES = {
  basic: { id: 'basic', name: 'Basic Materials', emoji: '🪨', color: '#9CA3AF' },
  refined: { id: 'refined', name: 'Refined Materials', emoji: '✨', color: '#10B981' },
  rare: { id: 'rare', name: 'Rare Materials', emoji: '💎', color: '#3B82F6' },
  legendary: { id: 'legendary', name: 'Legendary Materials', emoji: '🌟', color: '#F59E0B' },
  mythic: { id: 'mythic', name: 'Mythic Materials', emoji: '🔮', color: '#EF4444' }
};

// Material Templates
const MATERIAL_TEMPLATES = {
  // === BASIC ===
  iron_scrap: {
    id: 'iron_scrap',
    name: 'Iron Scrap',
    category: 'basic',
    emoji: '🔩',
    description: 'Common metal scraps from defeated enemies.',
    maxStack: 999
  },
  leather_strip: {
    id: 'leather_strip',
    name: 'Leather Strip',
    category: 'basic',
    emoji: '🥾',
    description: 'Flexible leather for armor crafting.',
    maxStack: 999
  },
  cloth_scrap: {
    id: 'cloth_scrap',
    name: 'Cloth Scrap',
    category: 'basic',
    emoji: '🧵',
    description: 'Soft fabric for lightweight gear.',
    maxStack: 999
  },
  wood_splinter: {
    id: 'wood_splinter',
    name: 'Wood Splinter',
    category: 'basic',
    emoji: '🪵',
    description: 'Sturdy wood for handles and frames.',
    maxStack: 999
  },
  monster_fang: {
    id: 'monster_fang',
    name: 'Monster Fang',
    category: 'basic',
    emoji: '🦷',
    description: 'Sharp fangs from defeated creatures.',
    maxStack: 999
  },

  // === REFINED ===
  steel_ingot: {
    id: 'steel_ingot',
    name: 'Steel Ingot',
    category: 'refined',
    emoji: '🔧',
    description: 'Refined steel for quality equipment.',
    maxStack: 500
  },
  fine_leather: {
    id: 'fine_leather',
    name: 'Fine Leather',
    category: 'refined',
    emoji: '👜',
    description: 'High-quality treated leather.',
    maxStack: 500
  },
  silk_thread: {
    id: 'silk_thread',
    name: 'Silk Thread',
    category: 'refined',
    emoji: '🕸️',
    description: 'Delicate thread for magical weaving.',
    maxStack: 500
  },
  enchanted_wood: {
    id: 'enchanted_wood',
    name: 'Enchanted Wood',
    category: 'refined',
    emoji: '🌳',
    description: 'Wood imbued with natural magic.',
    maxStack: 500
  },
  beast_core: {
    id: 'beast_core',
    name: 'Beast Core',
    category: 'refined',
    emoji: '💠',
    description: 'Crystallized essence of powerful beasts.',
    maxStack: 500
  },

  // === RARE ===
  mithril_ore: {
    id: 'mithril_ore',
    name: 'Mithril Ore',
    category: 'rare',
    emoji: '🪙',
    description: 'Legendary light metal.',
    maxStack: 200
  },
  dragon_scale: {
    id: 'dragon_scale',
    name: 'Dragon Scale',
    category: 'rare',
    emoji: '🐉',
    description: 'Scales from ancient dragons.',
    maxStack: 200
  },
  phoenix_feather: {
    id: 'phoenix_feather',
    name: 'Phoenix Feather',
    category: 'rare',
    emoji: '🔥',
    description: 'Feathers of eternal flame.',
    maxStack: 200
  },
  moonstone: {
    id: 'moonstone',
    name: 'Moonstone',
    category: 'rare',
    emoji: '🌙',
    description: 'Crystals charged by moonlight.',
    maxStack: 200
  },
  spirit_essence: {
    id: 'spirit_essence',
    name: 'Spirit Essence',
    category: 'rare',
    emoji: '👻',
    description: 'Condensed spiritual energy.',
    maxStack: 200
  },

  // === LEGENDARY ===
  void_essence: {
    id: 'void_essence',
    name: 'Void Essence',
    category: 'legendary',
    emoji: '🌑',
    description: 'Matter from the void between worlds.',
    maxStack: 100
  },
  celestial_dust: {
    id: 'celestial_dust',
    name: 'Celestial Dust',
    category: 'legendary',
    emoji: '⭐',
    description: 'Stardust from the heavens.',
    maxStack: 100
  },
  time_fragment: {
    id: 'time_fragment',
    name: 'Time Fragment',
    category: 'legendary',
    emoji: '⏳',
    description: 'Crystallized moments in time.',
    maxStack: 100
  },
  divine_thread: {
    id: 'divine_thread',
    name: 'Divine Thread',
    category: 'legendary',
    emoji: '🧬',
    description: 'Thread woven by celestial beings.',
    maxStack: 100
  },
  ancient_rune: {
    id: 'ancient_rune',
    name: 'Ancient Rune',
    category: 'legendary',
    emoji: '🔣',
    description: 'Runes from forgotten civilizations.',
    maxStack: 100
  },

  // === MYTHIC ===
  primordial_matter: {
    id: 'primordial_matter',
    name: 'Primordial Matter',
    category: 'mythic',
    emoji: '💫',
    description: 'The stuff of creation itself.',
    maxStack: 50
  },
  reality_shard: {
    id: 'reality_shard',
    name: 'Reality Shard',
    category: 'mythic',
    emoji: '🔮',
    description: 'Fragments of broken realities.',
    maxStack: 50
  },
  cosmic_heart: {
    id: 'cosmic_heart',
    name: 'Cosmic Heart',
    category: 'mythic',
    emoji: '💖',
    description: 'The beating heart of a dying star.',
    maxStack: 50
  }
};

// Blueprint Templates
const BLUEPRINT_TEMPLATES = {
  // === BASIC EQUIPMENT ===
  craft_training_cap: {
    id: 'craft_training_cap',
    name: 'Training Cap Blueprint',
    result: 'training_cap',
    resultType: 'equipment',
    materials: {
      cloth_scrap: 5,
      leather_strip: 2
    },
    craftTime: 5000,
    unlocked: true
  },
  craft_leather_collar: {
    id: 'craft_leather_collar',
    name: 'Leather Collar Blueprint',
    result: 'leather_collar',
    resultType: 'equipment',
    materials: {
      leather_strip: 8,
      iron_scrap: 3
    },
    craftTime: 5000,
    unlocked: true
  },
  craft_wooden_claws: {
    id: 'craft_wooden_claws',
    name: 'Wooden Claws Blueprint',
    result: 'wooden_claws',
    resultType: 'equipment',
    materials: {
      wood_splinter: 10,
      monster_fang: 2
    },
    craftTime: 5000,
    unlocked: true
  },
  craft_cloth_vest: {
    id: 'craft_cloth_vest',
    name: 'Cloth Vest Blueprint',
    result: 'cloth_vest',
    resultType: 'equipment',
    materials: {
      cloth_scrap: 10,
      leather_strip: 3
    },
    craftTime: 5000,
    unlocked: true
  },
  craft_simple_boots: {
    id: 'craft_simple_boots',
    name: 'Simple Boots Blueprint',
    result: 'simple_boots',
    resultType: 'equipment',
    materials: {
      leather_strip: 6,
      cloth_scrap: 4
    },
    craftTime: 5000,
    unlocked: true
  },
  craft_ribbon_tail: {
    id: 'craft_ribbon_tail',
    name: 'Ribbon Tail Blueprint',
    result: 'ribbon_tail',
    resultType: 'equipment',
    materials: {
      silk_thread: 3,
      cloth_scrap: 5
    },
    craftTime: 5000,
    unlocked: true
  },

  // === REFINED EQUIPMENT ===
  craft_storm_cap: {
    id: 'craft_storm_cap',
    name: 'Storm Cap Blueprint',
    result: 'storm_cap',
    resultType: 'equipment',
    materials: {
      steel_ingot: 5,
      beast_core: 3,
      spirit_essence: 2
    },
    craftTime: 30000,
    unlocked: false
  },
  craft_lightning_claws: {
    id: 'craft_lightning_claws',
    name: 'Lightning Claws Blueprint',
    result: 'lightning_claws',
    resultType: 'equipment',
    materials: {
      steel_ingot: 8,
      beast_core: 5,
      moonstone: 2
    },
    craftTime: 45000,
    unlocked: false
  },
  craft_void_hood: {
    id: 'craft_void_hood',
    name: 'Void Hood Blueprint',
    result: 'void_hood',
    resultType: 'equipment',
    materials: {
      silk_thread: 10,
      void_essence: 3,
      spirit_essence: 5
    },
    craftTime: 60000,
    unlocked: false
  },
  craft_flower_crown: {
    id: 'craft_flower_crown',
    name: 'Flower Crown Blueprint',
    result: 'flower_crown',
    resultType: 'equipment',
    materials: {
      enchanted_wood: 5,
      silk_thread: 8,
      phoenix_feather: 1
    },
    craftTime: 30000,
    unlocked: false
  },

  // === LEGENDARY EQUIPMENT ===
  craft_jade_crown: {
    id: 'craft_jade_crown',
    name: 'Jade Emperor Crown Blueprint',
    result: 'jade_crown',
    resultType: 'equipment',
    materials: {
      celestial_dust: 10,
      divine_thread: 5,
      ancient_rune: 3
    },
    craftTime: 300000,
    unlocked: false
  },
  craft_jade_sword: {
    id: 'craft_jade_sword',
    name: 'Jade Emperor Sword Blueprint',
    result: 'jade_sword',
    resultType: 'equipment',
    materials: {
      mithril_ore: 15,
      dragon_scale: 10,
      void_essence: 5
    },
    craftTime: 300000,
    unlocked: false
  },
  craft_star_crown: {
    id: 'craft_star_crown',
    name: 'Star Crown Blueprint',
    result: 'star_crown',
    resultType: 'equipment',
    materials: {
      celestial_dust: 15,
      moonstone: 10,
      cosmic_heart: 1
    },
    craftTime: 300000,
    unlocked: false
  },

  // === MATERIAL REFINEMENT ===
  refine_steel: {
    id: 'refine_steel',
    name: 'Steel Refinement',
    result: 'steel_ingot',
    resultType: 'material',
    resultCount: 1,
    materials: {
      iron_scrap: 10
    },
    craftTime: 10000,
    unlocked: true
  },
  refine_leather: {
    id: 'refine_leather',
    name: 'Leather Treatment',
    result: 'fine_leather',
    resultType: 'material',
    resultCount: 1,
    materials: {
      leather_strip: 8
    },
    craftTime: 10000,
    unlocked: true
  },
  refine_silk: {
    id: 'refine_silk',
    name: 'Silk Spinning',
    result: 'silk_thread',
    resultType: 'material',
    resultCount: 1,
    materials: {
      cloth_scrap: 10
    },
    craftTime: 10000,
    unlocked: true
  },
  refine_enchanted_wood: {
    id: 'refine_enchanted_wood',
    name: 'Wood Enchantment',
    result: 'enchanted_wood',
    resultType: 'material',
    resultCount: 1,
    materials: {
      wood_splinter: 8,
      spirit_essence: 1
    },
    craftTime: 15000,
    unlocked: false
  },
  refine_beast_core: {
    id: 'refine_beast_core',
    name: 'Core Extraction',
    result: 'beast_core',
    resultType: 'material',
    resultCount: 1,
    materials: {
      monster_fang: 15
    },
    craftTime: 20000,
    unlocked: true
  }
};

/**
 * CraftingSystem - Manages material crafting
 */
class CraftingSystem {
  constructor() {
    this.materials = {}; // materialId -> count
    this.blueprints = {}; // blueprintId -> unlocked state
    this.craftingQueue = []; // Active crafting jobs
    this.maxQueueSize = 3;
    this.autoCraft = false;
    this.craftingSpeed = 1.0;

    // Initialize blueprints
    for (const [id, blueprint] of Object.entries(BLUEPRINT_TEMPLATES)) {
      this.blueprints[id] = blueprint.unlocked || false;
    }
  }

  /**
   * Get material count
   */
  getMaterialCount(materialId) {
    return this.materials[materialId] || 0;
  }

  /**
   * Add materials
   */
  addMaterial(materialId, count = 1) {
    const template = MATERIAL_TEMPLATES[materialId];
    if (!template) return false;

    if (!this.materials[materialId]) {
      this.materials[materialId] = 0;
    }

    const maxStack = template.maxStack || 999;
    this.materials[materialId] = Math.min(
      this.materials[materialId] + count,
      maxStack
    );

    return true;
  }

  /**
   * Remove materials
   */
  removeMaterial(materialId, count = 1) {
    if (this.getMaterialCount(materialId) < count) return false;
    this.materials[materialId] -= count;
    return true;
  }

  /**
   * Check if can craft blueprint
   */
  canCraft(blueprintId) {
    const blueprint = BLUEPRINT_TEMPLATES[blueprintId];
    if (!blueprint) return false;

    // Check if unlocked
    if (!this.blueprints[blueprintId]) return false;

    // Check queue space
    if (this.craftingQueue.length >= this.maxQueueSize) return false;

    // Check materials
    for (const [matId, count] of Object.entries(blueprint.materials)) {
      if (this.getMaterialCount(matId) < count) return false;
    }

    return true;
  }

  /**
   * Start crafting
   */
  startCraft(blueprintId) {
    if (!this.canCraft(blueprintId)) return false;

    const blueprint = BLUEPRINT_TEMPLATES[blueprintId];

    // Consume materials
    for (const [matId, count] of Object.entries(blueprint.materials)) {
      this.removeMaterial(matId, count);
    }

    // Add to queue
    const craftJob = {
      id: `craft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      blueprintId: blueprintId,
      startTime: Date.now(),
      duration: blueprint.craftTime / this.craftingSpeed,
      complete: false
    };

    this.craftingQueue.push(craftJob);

    if (window.audioSystem) {
      window.audioSystem.playSFX('craftStart');
    }

    return craftJob;
  }

  /**
   * Update crafting progress
   */
  update(deltaTime) {
    const now = Date.now();
    const completed = [];

    for (const job of this.craftingQueue) {
      if (job.complete) continue;

      const elapsed = now - job.startTime;
      if (elapsed >= job.duration) {
        job.complete = true;
        completed.push(job);
      }
    }

    // Process completed jobs
    for (const job of completed) {
      this.completeCraft(job);
    }

    // Remove completed jobs
    this.craftingQueue = this.craftingQueue.filter(j => !j.complete);
  }

  /**
   * Complete a craft job
   */
  completeCraft(job) {
    const blueprint = BLUEPRINT_TEMPLATES[job.blueprintId];
    if (!blueprint) return null;

    let result = null;

    if (blueprint.resultType === 'equipment') {
      // Create equipment via EquipmentSystem
      if (window.equipmentSystem) {
        result = window.equipmentSystem.createEquipment(blueprint.result);
        window.equipmentSystem.addToInventory(result);
      }
    } else if (blueprint.resultType === 'material') {
      // Add material
      const count = blueprint.resultCount || 1;
      this.addMaterial(blueprint.result, count);
      result = { materialId: blueprint.result, count };
    }

    if (window.audioSystem) {
      window.audioSystem.playSFX('craftComplete');
    }

    return result;
  }

  /**
   * Get crafting progress for a job
   */
  getCraftProgress(jobId) {
    const job = this.craftingQueue.find(j => j.id === jobId);
    if (!job) return null;

    const elapsed = Date.now() - job.startTime;
    return Math.min(elapsed / job.duration, 1.0);
  }

  /**
   * Cancel crafting job (refunds 50% materials)
   */
  cancelCraft(jobId) {
    const jobIndex = this.craftingQueue.findIndex(j => j.id === jobId);
    if (jobIndex < 0) return false;

    const job = this.craftingQueue[jobIndex];
    const blueprint = BLUEPRINT_TEMPLATES[job.blueprintId];

    // Refund 50% of materials
    for (const [matId, count] of Object.entries(blueprint.materials)) {
      this.addMaterial(matId, Math.floor(count * 0.5));
    }

    this.craftingQueue.splice(jobIndex, 1);
    return true;
  }

  /**
   * Unlock a blueprint
   */
  unlockBlueprint(blueprintId) {
    if (!BLUEPRINT_TEMPLATES[blueprintId]) return false;
    this.blueprints[blueprintId] = true;

    if (window.audioSystem) {
      window.audioSystem.playSFX('blueprintUnlock');
    }

    return true;
  }

  /**
   * Get all unlocked blueprints
   */
  getUnlockedBlueprints() {
    return Object.entries(this.blueprints)
      .filter(([id, unlocked]) => unlocked)
      .map(([id]) => ({
        ...BLUEPRINT_TEMPLATES[id],
        canCraft: this.canCraft(id)
      }));
  }

  /**
   * Get all materials grouped by category
   */
  getMaterialsByCategory() {
    const grouped = {};

    for (const [id, count] of Object.entries(this.materials)) {
      if (count <= 0) continue;

      const template = MATERIAL_TEMPLATES[id];
      if (!template) continue;

      const category = template.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push({
        ...template,
        count
      });
    }

    return grouped;
  }

  /**
   * Get total material count
   */
  getTotalMaterialCount() {
    return Object.values(this.materials).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Drop materials based on context (floor, enemy type, etc.)
   */
  generateDrop(context = {}) {
    const floor = context.floor || 1;
    const luck = context.luck || 0;
    const isBoss = context.isBoss || false;

    const drops = [];

    // Determine drop count
    let dropCount = 1 + Math.floor(floor / 10);
    if (isBoss) dropCount *= 3;
    dropCount += Math.floor(luck * 0.1);

    // Determine material tier based on floor
    const tierChances = this.calculateTierChances(floor, luck);

    for (let i = 0; i < dropCount; i++) {
      const tier = this.rollTier(tierChances);
      const material = this.pickRandomMaterial(tier);

      if (material) {
        const count = this.rollDropCount(tier, isBoss);
        this.addMaterial(material.id, count);
        drops.push({ materialId: material.id, count });
      }
    }

    return drops;
  }

  /**
   * Calculate tier chances based on floor
   */
  calculateTierChances(floor, luck) {
    const base = {
      basic: 0.6,
      refined: 0.25,
      rare: 0.1,
      legendary: 0.04,
      mythic: 0.01
    };

    // Shift chances based on floor
    const floorBonus = Math.min(floor * 0.005, 0.3);
    const luckBonus = luck * 0.001;

    return {
      basic: Math.max(base.basic - floorBonus, 0.2),
      refined: base.refined + floorBonus * 0.3,
      rare: base.rare + floorBonus * 0.4 + luckBonus,
      legendary: base.legendary + floorBonus * 0.2 + luckBonus * 0.5,
      mythic: base.mythic + floorBonus * 0.1 + luckBonus * 0.3
    };
  }

  /**
   * Roll for material tier
   */
  rollTier(chances) {
    const roll = Math.random();
    let cumulative = 0;

    for (const [tier, chance] of Object.entries(chances)) {
      cumulative += chance;
      if (roll < cumulative) return tier;
    }

    return 'basic';
  }

  /**
   * Pick random material from tier
   */
  pickRandomMaterial(tier) {
    const materials = Object.values(MATERIAL_TEMPLATES).filter(m => m.category === tier);
    if (materials.length === 0) return null;
    return materials[Math.floor(Math.random() * materials.length)];
  }

  /**
   * Roll drop count
   */
  rollDropCount(tier, isBoss) {
    const baseCounts = {
      basic: { min: 2, max: 5 },
      refined: { min: 1, max: 3 },
      rare: { min: 1, max: 2 },
      legendary: { min: 1, max: 1 },
      mythic: { min: 1, max: 1 }
    };

    const { min, max } = baseCounts[tier] || baseCounts.basic;
    let count = min + Math.floor(Math.random() * (max - min + 1));

    if (isBoss) count *= 2;

    return count;
  }

  /**
   * Set crafting speed multiplier
   */
  setCraftingSpeed(multiplier) {
    this.craftingSpeed = multiplier;
  }

  /**
   * Increase max queue size
   */
  increaseQueueSize(amount = 1) {
    this.maxQueueSize += amount;
  }

  /**
   * Toggle auto-craft
   */
  toggleAutoCraft() {
    this.autoCraft = !this.autoCraft;
    return this.autoCraft;
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      materials: this.materials,
      blueprints: this.blueprints,
      craftingQueue: this.craftingQueue,
      maxQueueSize: this.maxQueueSize,
      autoCraft: this.autoCraft,
      craftingSpeed: this.craftingSpeed
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.materials) this.materials = data.materials;
    if (data.blueprints) this.blueprints = data.blueprints;
    if (data.craftingQueue) this.craftingQueue = data.craftingQueue;
    if (data.maxQueueSize) this.maxQueueSize = data.maxQueueSize;
    if (data.autoCraft !== undefined) this.autoCraft = data.autoCraft;
    if (data.craftingSpeed) this.craftingSpeed = data.craftingSpeed;
  }

  /**
   * Reset system
   */
  reset() {
    this.materials = {};
    this.craftingQueue = [];

    // Reset blueprints to default unlock state
    for (const [id, blueprint] of Object.entries(BLUEPRINT_TEMPLATES)) {
      this.blueprints[id] = blueprint.unlocked || false;
    }
  }
}

// Export
window.MATERIAL_CATEGORIES = MATERIAL_CATEGORIES;
window.MATERIAL_TEMPLATES = MATERIAL_TEMPLATES;
window.BLUEPRINT_TEMPLATES = BLUEPRINT_TEMPLATES;
window.CraftingSystem = CraftingSystem;
