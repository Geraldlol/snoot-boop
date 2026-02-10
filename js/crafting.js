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

// =============================================
// ENCHANTMENT MATERIALS (Additional)
// =============================================

const ENCHANT_MATERIALS = {
  enchant_scroll_common: {
    id: 'enchant_scroll_common',
    name: 'Common Enchant Scroll',
    category: 'refined',
    emoji: '📃',
    description: 'Scroll for basic enchantments.',
    maxStack: 100
  },
  enchant_scroll_rare: {
    id: 'enchant_scroll_rare',
    name: 'Rare Enchant Scroll',
    category: 'rare',
    emoji: '📄',
    description: 'Scroll for powerful enchantments.',
    maxStack: 50
  },
  enchant_scroll_legendary: {
    id: 'enchant_scroll_legendary',
    name: 'Legendary Enchant Scroll',
    category: 'legendary',
    emoji: '📜',
    description: 'Scroll for legendary enchantments.',
    maxStack: 25
  },
  reroll_stone: {
    id: 'reroll_stone',
    name: 'Reroll Stone',
    category: 'rare',
    emoji: '🎲',
    description: 'Reroll enchantment effects.',
    maxStack: 50
  },
  cleansing_orb: {
    id: 'cleansing_orb',
    name: 'Cleansing Orb',
    category: 'refined',
    emoji: '🔮',
    description: 'Remove all enchantments.',
    maxStack: 50
  },
  upgrade_stone_1: {
    id: 'upgrade_stone_1',
    name: 'Minor Upgrade Stone',
    category: 'basic',
    emoji: '🪨',
    description: 'Upgrade common/uncommon gear.',
    maxStack: 200
  },
  upgrade_stone_2: {
    id: 'upgrade_stone_2',
    name: 'Greater Upgrade Stone',
    category: 'refined',
    emoji: '💎',
    description: 'Upgrade rare/epic gear.',
    maxStack: 100
  },
  upgrade_stone_3: {
    id: 'upgrade_stone_3',
    name: 'Supreme Upgrade Stone',
    category: 'legendary',
    emoji: '⭐',
    description: 'Upgrade legendary+ gear.',
    maxStack: 50
  },
  protection_charm: {
    id: 'protection_charm',
    name: 'Protection Charm',
    category: 'rare',
    emoji: '🛡️',
    description: 'Prevents upgrade failure.',
    maxStack: 25
  },
  lucky_clover: {
    id: 'lucky_clover',
    name: 'Lucky Clover',
    category: 'refined',
    emoji: '🍀',
    description: '+10% upgrade success rate.',
    maxStack: 100
  }
};

// Merge enchant materials into main templates
Object.assign(MATERIAL_TEMPLATES, ENCHANT_MATERIALS);

// =============================================
// ENCHANTMENT DEFINITIONS
// =============================================

const ENCHANTMENTS = {
  // === OFFENSIVE ===
  sharpness: {
    id: 'sharpness', name: 'Sharpness', tier: 'common', maxLevel: 5,
    slots: ['weapon'], effect: { attack: 8 },
    description: '+8 Attack per level', color: '#EF4444'
  },
  critical_strike: {
    id: 'critical_strike', name: 'Critical Strike', tier: 'common', maxLevel: 5,
    slots: ['weapon', 'paws'], effect: { critChance: 0.03 },
    description: '+3% Crit Chance per level', color: '#F59E0B'
  },
  devastation: {
    id: 'devastation', name: 'Devastation', tier: 'rare', maxLevel: 3,
    slots: ['weapon'], effect: { critDamage: 0.15 },
    description: '+15% Crit Damage per level', color: '#DC2626'
  },
  berserk: {
    id: 'berserk', name: 'Berserk', tier: 'rare', maxLevel: 3,
    slots: ['weapon', 'armor'], effect: { attack: 15, defense: -5 },
    description: '+15 Attack, -5 Defense per level', color: '#991B1B'
  },
  executioner: {
    id: 'executioner', name: 'Executioner', tier: 'legendary', maxLevel: 2,
    slots: ['weapon'], effect: { executeThreshold: 0.15 },
    description: 'Execute enemies below 15% HP per level', color: '#7F1D1D'
  },

  // === DEFENSIVE ===
  fortification: {
    id: 'fortification', name: 'Fortification', tier: 'common', maxLevel: 5,
    slots: ['armor', 'collar'], effect: { defense: 5 },
    description: '+5 Defense per level', color: '#3B82F6'
  },
  vitality: {
    id: 'vitality', name: 'Vitality', tier: 'common', maxLevel: 5,
    slots: ['armor', 'collar', 'hat'], effect: { hp: 30 },
    description: '+30 HP per level', color: '#10B981'
  },
  resilience: {
    id: 'resilience', name: 'Resilience', tier: 'rare', maxLevel: 3,
    slots: ['armor'], effect: { damageReduction: 0.05 },
    description: '+5% Damage Reduction per level', color: '#1D4ED8'
  },
  thorns: {
    id: 'thorns', name: 'Thorns', tier: 'rare', maxLevel: 3,
    slots: ['armor', 'collar'], effect: { thornDamage: 0.15 },
    description: 'Reflect 15% damage per level', color: '#7C3AED'
  },
  guardian: {
    id: 'guardian', name: 'Guardian', tier: 'legendary', maxLevel: 2,
    slots: ['armor'], effect: { blockChance: 0.1 },
    description: '10% chance to block per level', color: '#2563EB'
  },

  // === UTILITY ===
  swiftness: {
    id: 'swiftness', name: 'Swiftness', tier: 'common', maxLevel: 5,
    slots: ['paws', 'tail'], effect: { speed: 8 },
    description: '+8 Speed per level', color: '#06B6D4'
  },
  evasion: {
    id: 'evasion', name: 'Evasion', tier: 'rare', maxLevel: 3,
    slots: ['paws', 'armor'], effect: { dodge: 0.04 },
    description: '+4% Dodge per level', color: '#8B5CF6'
  },
  fortune: {
    id: 'fortune', name: 'Fortune', tier: 'common', maxLevel: 5,
    slots: ['tail', 'hat'], effect: { luck: 10 },
    description: '+10 Luck per level', color: '#F59E0B'
  },
  wealth: {
    id: 'wealth', name: 'Wealth', tier: 'rare', maxLevel: 3,
    slots: ['tail', 'collar'], effect: { bpMultiplier: 0.08 },
    description: '+8% BP per level', color: '#FBBF24'
  },
  cultivation: {
    id: 'cultivation', name: 'Cultivation', tier: 'rare', maxLevel: 3,
    slots: ['hat', 'collar'], effect: { ppMultiplier: 0.08 },
    description: '+8% PP per level', color: '#A78BFA'
  },

  // === ELEMENTAL ===
  flame_aspect: {
    id: 'flame_aspect', name: 'Flame Aspect', tier: 'rare', maxLevel: 3,
    slots: ['weapon'], effect: { fireDamage: 0.15, burnChance: 0.1 },
    description: '+15% Fire Damage, 10% burn chance', color: '#F97316'
  },
  frost_touch: {
    id: 'frost_touch', name: 'Frost Touch', tier: 'rare', maxLevel: 3,
    slots: ['weapon'], effect: { iceDamage: 0.15, slowChance: 0.15 },
    description: '+15% Ice Damage, 15% slow chance', color: '#22D3EE'
  },
  lightning: {
    id: 'lightning', name: 'Lightning', tier: 'rare', maxLevel: 3,
    slots: ['weapon'], effect: { chainLightning: 0.1, shockDamage: 0.1 },
    description: '10% chain lightning, +10% shock damage', color: '#FACC15'
  },
  void_touch: {
    id: 'void_touch', name: 'Void Touch', tier: 'legendary', maxLevel: 2,
    slots: ['weapon'], effect: { armorPen: 0.15, voidDamage: 0.1 },
    description: '15% Armor Pen, +10% void damage', color: '#6366F1'
  },

  // === LEGENDARY ===
  lifesteal: {
    id: 'lifesteal', name: 'Lifesteal', tier: 'legendary', maxLevel: 2,
    slots: ['weapon'], effect: { lifeSteal: 0.08 },
    description: '8% Lifesteal per level', color: '#DC2626'
  },
  immortality: {
    id: 'immortality', name: 'Immortality', tier: 'legendary', maxLevel: 1,
    slots: ['armor'], effect: { reviveChance: 0.15 },
    description: '15% chance to revive on death', color: '#FCD34D'
  },
  chaos: {
    id: 'chaos', name: 'Chaos', tier: 'legendary', maxLevel: 2,
    slots: ['weapon', 'tail'], effect: { randomDamage: 0.5, chaosProc: 0.1 },
    description: '+50% random damage, 10% chaos effect', color: '#EC4899'
  },
  transcendence: {
    id: 'transcendence', name: 'Transcendence', tier: 'legendary', maxLevel: 1,
    slots: ['hat'], effect: { allStats: 0.15 },
    description: '+15% All Stats', color: '#E879F9'
  },

  // === MEME ENCHANTMENTS ===
  stonks: {
    id: 'stonks', name: 'Stonks', tier: 'legendary', maxLevel: 3,
    slots: ['tail', 'collar'], effect: { bpMultiplier: 0.2, volatility: true },
    description: '+20% BP (volatile!)', color: '#22C55E'
  },
  mlg: {
    id: 'mlg', name: 'MLG Pro', tier: 'rare', maxLevel: 3,
    slots: ['hat', 'weapon'], effect: { critChance: 0.08, noscope: true },
    description: '+8% Crit with AIRHORN', color: '#14B8A6'
  },
  gamer_rage: {
    id: 'gamer_rage', name: 'Gamer Rage', tier: 'rare', maxLevel: 3,
    slots: ['weapon'], effect: { lowHpDamage: 0.25 },
    description: '+25% Damage below 30% HP', color: '#EF4444'
  },
  uwu_power: {
    id: 'uwu_power', name: 'UwU Power', tier: 'legendary', maxLevel: 1,
    slots: ['collar'], effect: { charmChance: 0.08, cuteness: 999 },
    description: 'Charm enemies with cuteness', color: '#F472B6'
  },
  big_brain: {
    id: 'big_brain', name: 'Big Brain', tier: 'legendary', maxLevel: 2,
    slots: ['hat'], effect: { wisdom: 50, expBonus: 0.15 },
    description: '+50 Wisdom, +15% EXP per level', color: '#8B5CF6'
  },
  yeet: {
    id: 'yeet', name: 'YEET', tier: 'rare', maxLevel: 3,
    slots: ['paws', 'weapon'], effect: { knockback: 0.3, launchChance: 0.1 },
    description: '30% knockback, 10% launch enemies', color: '#F97316'
  }
};

// =============================================
// UPGRADE COSTS BY RARITY
// =============================================

const UPGRADE_COSTS = {
  common: {
    stone: 'upgrade_stone_1', stoneCount: 2,
    materials: { iron_scrap: 10 },
    bpCost: 100, successRate: 0.95, scaling: 1.3
  },
  uncommon: {
    stone: 'upgrade_stone_1', stoneCount: 3,
    materials: { iron_scrap: 15, leather_strip: 5 },
    bpCost: 300, successRate: 0.90, scaling: 1.4
  },
  rare: {
    stone: 'upgrade_stone_2', stoneCount: 2,
    materials: { steel_ingot: 5, beast_core: 3 },
    bpCost: 1000, successRate: 0.80, scaling: 1.5
  },
  epic: {
    stone: 'upgrade_stone_2', stoneCount: 4,
    materials: { mithril_ore: 3, dragon_scale: 2 },
    bpCost: 5000, successRate: 0.70, scaling: 1.6
  },
  legendary: {
    stone: 'upgrade_stone_3', stoneCount: 2,
    materials: { void_essence: 3, celestial_dust: 2 },
    bpCost: 25000, successRate: 0.55, scaling: 1.7
  },
  mythic: {
    stone: 'upgrade_stone_3', stoneCount: 4,
    materials: { primordial_matter: 2, reality_shard: 2 },
    bpCost: 100000, successRate: 0.40, scaling: 1.8
  },
  transcendent: {
    stone: 'upgrade_stone_3', stoneCount: 6,
    materials: { cosmic_heart: 1, reality_shard: 3 },
    bpCost: 500000, successRate: 0.25, scaling: 2.0
  }
};

// =============================================
// ENCHANT COSTS BY TIER
// =============================================

const ENCHANT_COSTS = {
  common: {
    scroll: 'enchant_scroll_common', scrollCount: 1,
    materials: { spirit_essence: 3 },
    bpCost: 500
  },
  rare: {
    scroll: 'enchant_scroll_rare', scrollCount: 1,
    materials: { spirit_essence: 5, moonstone: 2 },
    bpCost: 3000
  },
  legendary: {
    scroll: 'enchant_scroll_legendary', scrollCount: 1,
    materials: { void_essence: 2, ancient_rune: 1 },
    bpCost: 25000
  }
};

// Add upgrade/enchant methods to CraftingSystem prototype
CraftingSystem.prototype.getUpgradeCost = function(equipment) {
  const baseCost = UPGRADE_COSTS[equipment.rarity];
  if (!baseCost) return null;

  const level = equipment.level || 1;
  const scaling = Math.pow(baseCost.scaling, level - 1);

  const cost = {
    stone: baseCost.stone,
    stoneCount: Math.ceil(baseCost.stoneCount * scaling),
    materials: {},
    bp: Math.floor(baseCost.bpCost * scaling),
    successRate: Math.max(0.1, baseCost.successRate - (level * 0.05))
  };

  for (const [matId, amount] of Object.entries(baseCost.materials)) {
    cost.materials[matId] = Math.ceil(amount * scaling);
  }

  return cost;
};

CraftingSystem.prototype.canUpgrade = function(equipment, gameState) {
  if (!equipment || equipment.level >= (equipment.maxLevel || 40)) return false;

  const cost = this.getUpgradeCost(equipment);
  if (!cost) return false;

  // Check BP
  if (gameState.boopPoints < cost.bp) return false;

  // Check upgrade stones
  if (this.getMaterialCount(cost.stone) < cost.stoneCount) return false;

  // Check materials
  for (const [matId, amount] of Object.entries(cost.materials)) {
    if (this.getMaterialCount(matId) < amount) return false;
  }

  return true;
};

CraftingSystem.prototype.upgradeEquipment = function(equipment, gameState, useProtection = false, useClover = false) {
  if (!this.canUpgrade(equipment, gameState)) {
    return { success: false, reason: 'Cannot upgrade - missing requirements' };
  }

  const cost = this.getUpgradeCost(equipment);

  // Check protection charm
  if (useProtection && this.getMaterialCount('protection_charm') < 1) {
    useProtection = false;
  }

  // Check lucky clover
  if (useClover && this.getMaterialCount('lucky_clover') < 1) {
    useClover = false;
  }

  // Consume resources (with safety check to prevent negative values)
  gameState.boopPoints = Math.max(0, gameState.boopPoints - cost.bp);
  this.removeMaterial(cost.stone, cost.stoneCount);
  for (const [matId, amount] of Object.entries(cost.materials)) {
    this.removeMaterial(matId, amount);
  }

  if (useProtection) this.removeMaterial('protection_charm', 1);
  if (useClover) this.removeMaterial('lucky_clover', 1);

  // Calculate success rate
  let successRate = cost.successRate;
  if (useClover) successRate += 0.1;

  const succeeded = Math.random() < successRate;

  if (succeeded) {
    equipment.level = (equipment.level || 1) + 1;

    // Boost stats by 10%
    for (const stat in equipment.stats) {
      if (typeof equipment.stats[stat] === 'number') {
        equipment.stats[stat] *= 1.10;
        equipment.stats[stat] = Math.round(equipment.stats[stat] * 100) / 100;
      }
    }

    if (window.audioSystem) window.audioSystem.playSFX('upgradeSuccess');

    return {
      success: true,
      newLevel: equipment.level,
      message: `✨ Upgrade SUCCESS! Now +${equipment.level}`
    };
  } else {
    // Failed - protection charm prevents downgrade
    if (!useProtection && equipment.level > 1 && Math.random() < 0.3) {
      equipment.level--;
      return {
        success: false,
        downgraded: true,
        message: `💔 Upgrade FAILED and downgraded to +${equipment.level}!`
      };
    }

    if (window.audioSystem) window.audioSystem.playSFX('upgradeFail');

    return {
      success: false,
      message: useProtection ? '🛡️ Upgrade failed but Protection Charm saved it!' : '💔 Upgrade FAILED! Materials consumed.'
    };
  }
};

CraftingSystem.prototype.getEnchantCost = function(enchantment) {
  return ENCHANT_COSTS[enchantment.tier] || ENCHANT_COSTS.common;
};

CraftingSystem.prototype.getAvailableEnchantments = function(slot) {
  return Object.values(ENCHANTMENTS).filter(e => e.slots.includes(slot));
};

CraftingSystem.prototype.canEnchant = function(equipment, enchantmentId, gameState) {
  const enchant = ENCHANTMENTS[enchantmentId];
  if (!enchant) return false;

  // Check slot
  if (!enchant.slots.includes(equipment.slot)) return false;

  // Check max enchants by rarity
  const maxEnchants = { common: 1, uncommon: 2, rare: 2, epic: 3, legendary: 3, mythic: 4, transcendent: 5 };
  const currentEnchants = equipment.enchantments || [];

  // Check if already at max enchants (unless upgrading existing)
  const existing = currentEnchants.find(e => e.id === enchantmentId);
  if (!existing && currentEnchants.length >= (maxEnchants[equipment.rarity] || 1)) return false;

  // Check if existing is at max level
  if (existing && existing.level >= enchant.maxLevel) return false;

  // Check costs
  const cost = this.getEnchantCost(enchant);
  if (gameState.boopPoints < cost.bpCost) return false;
  if (this.getMaterialCount(cost.scroll) < cost.scrollCount) return false;

  for (const [matId, amount] of Object.entries(cost.materials)) {
    if (this.getMaterialCount(matId) < amount) return false;
  }

  return true;
};

CraftingSystem.prototype.applyEnchantment = function(equipment, enchantmentId, gameState) {
  if (!this.canEnchant(equipment, enchantmentId, gameState)) {
    return { success: false, reason: 'Cannot enchant - missing requirements' };
  }

  const enchant = ENCHANTMENTS[enchantmentId];
  const cost = this.getEnchantCost(enchant);

  // Consume resources
  gameState.boopPoints -= cost.bpCost;
  this.removeMaterial(cost.scroll, cost.scrollCount);
  for (const [matId, amount] of Object.entries(cost.materials)) {
    this.removeMaterial(matId, amount);
  }

  // Initialize enchantments array
  if (!equipment.enchantments) equipment.enchantments = [];

  // Apply or upgrade
  const existing = equipment.enchantments.find(e => e.id === enchantmentId);
  if (existing) {
    existing.level++;
  } else {
    equipment.enchantments.push({ id: enchantmentId, level: 1 });
  }

  if (window.audioSystem) window.audioSystem.playSFX('enchant');

  return {
    success: true,
    enchantment: enchant,
    level: existing ? existing.level : 1,
    message: `✨ Applied ${enchant.name}!`
  };
};

CraftingSystem.prototype.removeEnchantment = function(equipment, index) {
  if (!equipment.enchantments || !equipment.enchantments[index]) {
    return { success: false, reason: 'No enchantment at index' };
  }

  if (this.getMaterialCount('cleansing_orb') < 1) {
    return { success: false, reason: 'Need Cleansing Orb' };
  }

  this.removeMaterial('cleansing_orb', 1);
  const removed = equipment.enchantments.splice(index, 1)[0];
  const enchant = ENCHANTMENTS[removed.id];

  return { success: true, message: `Removed ${enchant?.name || 'enchantment'}` };
};

CraftingSystem.prototype.rerollEnchantment = function(equipment, index) {
  if (!equipment.enchantments || !equipment.enchantments[index]) {
    return { success: false, reason: 'No enchantment at index' };
  }

  if (this.getMaterialCount('reroll_stone') < 1) {
    return { success: false, reason: 'Need Reroll Stone' };
  }

  this.removeMaterial('reroll_stone', 1);

  const available = this.getAvailableEnchantments(equipment.slot);
  const currentId = equipment.enchantments[index].id;
  const filtered = available.filter(e => e.id !== currentId);

  if (filtered.length === 0) {
    return { success: false, reason: 'No other enchantments available' };
  }

  const newEnchant = filtered[Math.floor(Math.random() * filtered.length)];
  equipment.enchantments[index] = { id: newEnchant.id, level: 1 };

  return { success: true, newEnchant, message: `Rerolled to ${newEnchant.name}!` };
};

CraftingSystem.prototype.calculateEnchantBonuses = function(equipment) {
  const bonuses = {};
  if (!equipment.enchantments) return bonuses;

  for (const applied of equipment.enchantments) {
    const enchant = ENCHANTMENTS[applied.id];
    if (!enchant) continue;

    for (const [stat, value] of Object.entries(enchant.effect)) {
      if (typeof value === 'number') {
        bonuses[stat] = (bonuses[stat] || 0) + (value * applied.level);
      } else {
        bonuses[stat] = value;
      }
    }
  }

  return bonuses;
};

CraftingSystem.prototype.salvageForMaterials = function(equipment) {
  const tierMaterials = {
    common: ['iron_scrap', 'cloth_scrap'],
    uncommon: ['iron_scrap', 'leather_strip', 'wood_splinter'],
    rare: ['steel_ingot', 'beast_core', 'silk_thread'],
    epic: ['mithril_ore', 'dragon_scale', 'spirit_essence'],
    legendary: ['void_essence', 'celestial_dust', 'ancient_rune'],
    mythic: ['primordial_matter', 'time_fragment', 'divine_thread'],
    transcendent: ['primordial_matter', 'reality_shard', 'cosmic_heart']
  };

  const mats = tierMaterials[equipment.rarity] || tierMaterials.common;
  const level = equipment.level || 1;
  const returns = [];

  for (const matId of mats) {
    const amount = Math.max(1, Math.floor(level * (0.3 + Math.random() * 0.4)));
    this.addMaterial(matId, amount);
    returns.push({ id: matId, amount });
  }

  // Chance to return enchant scrolls
  if (equipment.enchantments && equipment.enchantments.length > 0) {
    const scrollChance = 0.3;
    for (const enc of equipment.enchantments) {
      if (Math.random() < scrollChance) {
        const enchant = ENCHANTMENTS[enc.id];
        const scrollId = `enchant_scroll_${enchant?.tier || 'common'}`;
        this.addMaterial(scrollId, 1);
        returns.push({ id: scrollId, amount: 1 });
      }
    }
  }

  return returns;
};

// Enhanced drop generation with enchant materials
const originalGenerateDrop = CraftingSystem.prototype.generateDrop;
CraftingSystem.prototype.generateDrop = function(context = {}) {
  const drops = originalGenerateDrop.call(this, context);
  const floor = context.floor || 1;
  const isBoss = context.isBoss || false;

  // Chance to drop upgrade stones
  if (Math.random() < 0.15 + (floor * 0.003)) {
    let stoneId = 'upgrade_stone_1';
    if (floor >= 50) stoneId = 'upgrade_stone_3';
    else if (floor >= 25) stoneId = 'upgrade_stone_2';

    const count = isBoss ? 3 : 1;
    this.addMaterial(stoneId, count);
    drops.push({ materialId: stoneId, count });
  }

  // Chance to drop enchant scrolls
  if (Math.random() < 0.08 + (floor * 0.002)) {
    let scrollId = 'enchant_scroll_common';
    if (floor >= 60 && Math.random() < 0.2) scrollId = 'enchant_scroll_legendary';
    else if (floor >= 30 && Math.random() < 0.4) scrollId = 'enchant_scroll_rare';

    const count = isBoss ? 2 : 1;
    this.addMaterial(scrollId, count);
    drops.push({ materialId: scrollId, count });
  }

  // Rare chance for special items
  if (isBoss) {
    if (Math.random() < 0.15) {
      this.addMaterial('protection_charm', 1);
      drops.push({ materialId: 'protection_charm', count: 1 });
    }
    if (Math.random() < 0.2) {
      this.addMaterial('lucky_clover', 1);
      drops.push({ materialId: 'lucky_clover', count: 1 });
    }
  }

  if (Math.random() < 0.05) {
    this.addMaterial('reroll_stone', 1);
    drops.push({ materialId: 'reroll_stone', count: 1 });
  }

  if (Math.random() < 0.03) {
    this.addMaterial('cleansing_orb', 1);
    drops.push({ materialId: 'cleansing_orb', count: 1 });
  }

  return drops;
};

// Export
window.MATERIAL_CATEGORIES = MATERIAL_CATEGORIES;
window.MATERIAL_TEMPLATES = MATERIAL_TEMPLATES;
window.BLUEPRINT_TEMPLATES = BLUEPRINT_TEMPLATES;
window.ENCHANTMENTS = ENCHANTMENTS;
window.UPGRADE_COSTS = UPGRADE_COSTS;
window.ENCHANT_COSTS = ENCHANT_COSTS;
window.CraftingSystem = CraftingSystem;
