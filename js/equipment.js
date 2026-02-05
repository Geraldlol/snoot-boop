/**
 * equipment.js - Cat Equipment System
 * "A well-equipped cat is a formidable cultivator."
 */

// Equipment Slots
const EQUIPMENT_SLOTS = {
  hat: { id: 'hat', name: 'Hat', emoji: '🎩', primaryStats: ['critChance', 'wisdom'] },
  collar: { id: 'collar', name: 'Collar', emoji: '📿', primaryStats: ['hp', 'defense'] },
  weapon: { id: 'weapon', name: 'Weapon', emoji: '⚔️', primaryStats: ['attack', 'boopDamage'] },
  armor: { id: 'armor', name: 'Armor', emoji: '🛡️', primaryStats: ['defense', 'damageReduction'] },
  paws: { id: 'paws', name: 'Paws', emoji: '🐾', primaryStats: ['speed', 'dodge'] },
  tail: { id: 'tail', name: 'Tail', emoji: '🎀', primaryStats: ['luck', 'specialEffect'] }
};

// Equipment Rarities
const EQUIPMENT_RARITIES = {
  common: { id: 'common', name: 'Common', color: '#9CA3AF', multiplier: 1.0, maxSubs: 1 },
  uncommon: { id: 'uncommon', name: 'Uncommon', color: '#10B981', multiplier: 1.25, maxSubs: 2 },
  rare: { id: 'rare', name: 'Rare', color: '#3B82F6', multiplier: 1.5, maxSubs: 3 },
  epic: { id: 'epic', name: 'Epic', color: '#8B5CF6', multiplier: 2.0, maxSubs: 4 },
  legendary: { id: 'legendary', name: 'Legendary', color: '#F59E0B', multiplier: 3.0, maxSubs: 4 },
  mythic: { id: 'mythic', name: 'Mythic', color: '#EF4444', multiplier: 5.0, maxSubs: 5 },
  transcendent: { id: 'transcendent', name: 'Transcendent', color: '#EC4899', multiplier: 10.0, maxSubs: 6 }
};

// Equipment Sets
const EQUIPMENT_SETS = {
  jade_emperor: {
    id: 'jade_emperor',
    name: 'Jade Emperor',
    pieces: ['jade_crown', 'jade_collar', 'jade_sword', 'jade_armor', 'jade_boots', 'jade_tail_ring'],
    bonuses: {
      2: { allStats: 0.1, description: '+10% all stats' },
      4: { allStats: 0.3, critChance: 0.1, description: '+30% all stats, +10% crit' },
      6: { allStats: 1.0, deathImmune: true, description: '+100% all stats, immune to first death' }
    }
  },
  thunder_god: {
    id: 'thunder_god',
    name: 'Thunder God',
    pieces: ['storm_cap', 'thunder_collar', 'lightning_claws', 'storm_vest'],
    bonuses: {
      2: { attackSpeed: 0.15, description: '+15% attack speed' },
      4: { chainLightning: true, description: 'Crits trigger chain lightning' }
    }
  },
  void_walker: {
    id: 'void_walker',
    name: 'Void Walker',
    pieces: ['void_hood', 'void_pendant', 'shadow_blade', 'void_cloak'],
    bonuses: {
      2: { dodge: 0.1, description: '+10% dodge chance' },
      4: { phaseChance: 0.2, description: '20% chance to phase through attacks' }
    }
  },
  nature_blessing: {
    id: 'nature_blessing',
    name: "Nature's Blessing",
    pieces: ['flower_crown', 'vine_collar', 'thorn_claws', 'leaf_armor'],
    bonuses: {
      2: { regenPerSecond: 0.01, description: 'Regen 1% HP per second' },
      4: { regenPerSecond: 0.02, description: 'Regen 2% HP per second' }
    }
  },
  inferno: {
    id: 'inferno',
    name: 'Inferno',
    pieces: ['flame_helm', 'ember_collar', 'fire_claws', 'magma_armor'],
    bonuses: {
      2: { fireDamage: 0.2, description: '+20% fire damage' },
      4: { burningAttacks: true, description: 'Attacks apply burning DOT' }
    }
  },
  celestial: {
    id: 'celestial',
    name: 'Celestial',
    pieces: ['star_crown', 'moon_pendant', 'sun_blade', 'cosmic_robe', 'astral_boots', 'comet_tail'],
    bonuses: {
      2: { bpMultiplier: 0.25, description: '+25% BP from all sources' },
      4: { ppMultiplier: 0.25, description: '+25% PP from all sources' },
      6: { ascensionDamage: 0.5, description: '+50% damage in Pagoda' }
    }
  },
  ancient_one: {
    id: 'ancient_one',
    name: 'Ancient One',
    pieces: ['elder_hat', 'primordial_collar', 'forgotten_blade', 'timeless_armor', 'eternal_paws', 'infinity_tail'],
    bonuses: {
      2: { expGain: 0.3, description: '+30% experience gain' },
      4: { cooldownReduction: 0.2, description: '-20% ability cooldowns' },
      6: { timeDilation: true, description: 'Slow time during combat' }
    }
  }
};

// Equipment Templates
const EQUIPMENT_TEMPLATES = {
  // === HATS ===
  training_cap: {
    id: 'training_cap',
    name: 'Training Cap',
    slot: 'hat',
    rarity: 'common',
    stats: { critChance: 0.02, wisdom: 5 },
    flavorText: '"Every journey begins with a single hat."'
  },
  jade_crown: {
    id: 'jade_crown',
    name: 'Jade Emperor Crown',
    slot: 'hat',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { critChance: 0.15, wisdom: 100, allStats: 0.1 },
    element: 'light',
    flavorText: '"Worn by the first Cat Emperor."'
  },
  storm_cap: {
    id: 'storm_cap',
    name: 'Storm Cap',
    slot: 'hat',
    rarity: 'epic',
    set: 'thunder_god',
    stats: { critChance: 0.1, attackSpeed: 0.1 },
    element: 'water',
    flavorText: '"Crackles with static electricity."'
  },
  void_hood: {
    id: 'void_hood',
    name: 'Void Hood',
    slot: 'hat',
    rarity: 'epic',
    set: 'void_walker',
    stats: { dodge: 0.08, critChance: 0.05 },
    element: 'void',
    flavorText: '"See into the darkness."'
  },
  flower_crown: {
    id: 'flower_crown',
    name: 'Flower Crown',
    slot: 'hat',
    rarity: 'rare',
    set: 'nature_blessing',
    stats: { wisdom: 30, regenPerSecond: 0.005 },
    element: 'nature',
    flavorText: '"Blooms with inner peace."'
  },
  flame_helm: {
    id: 'flame_helm',
    name: 'Flame Helm',
    slot: 'hat',
    rarity: 'epic',
    set: 'inferno',
    stats: { attack: 20, fireDamage: 0.1 },
    element: 'fire',
    flavorText: '"The flames never burn the wearer."'
  },
  star_crown: {
    id: 'star_crown',
    name: 'Star Crown',
    slot: 'hat',
    rarity: 'legendary',
    set: 'celestial',
    stats: { critChance: 0.12, wisdom: 80, bpMultiplier: 0.1 },
    element: 'light',
    flavorText: '"Forged from a dying star."'
  },
  elder_hat: {
    id: 'elder_hat',
    name: 'Elder Hat',
    slot: 'hat',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { wisdom: 150, expGain: 0.15, cooldownReduction: 0.1 },
    flavorText: '"Older than time itself."'
  },

  // === COLLARS ===
  leather_collar: {
    id: 'leather_collar',
    name: 'Leather Collar',
    slot: 'collar',
    rarity: 'common',
    stats: { hp: 20, defense: 5 },
    flavorText: '"Simple but effective."'
  },
  jade_collar: {
    id: 'jade_collar',
    name: 'Jade Emperor Collar',
    slot: 'collar',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { hp: 200, defense: 50, allStats: 0.1 },
    element: 'light',
    flavorText: '"Pulses with imperial authority."'
  },
  thunder_collar: {
    id: 'thunder_collar',
    name: 'Thunder Collar',
    slot: 'collar',
    rarity: 'epic',
    set: 'thunder_god',
    stats: { hp: 100, attackSpeed: 0.1 },
    element: 'water',
    flavorText: '"Hums with electrical energy."'
  },
  void_pendant: {
    id: 'void_pendant',
    name: 'Void Pendant',
    slot: 'collar',
    rarity: 'epic',
    set: 'void_walker',
    stats: { hp: 80, dodge: 0.05, damageReduction: 0.1 },
    element: 'void',
    flavorText: '"A window to nothingness."'
  },
  vine_collar: {
    id: 'vine_collar',
    name: 'Vine Collar',
    slot: 'collar',
    rarity: 'rare',
    set: 'nature_blessing',
    stats: { hp: 60, regenPerSecond: 0.008 },
    element: 'nature',
    flavorText: '"Living vines that heal wounds."'
  },
  ember_collar: {
    id: 'ember_collar',
    name: 'Ember Collar',
    slot: 'collar',
    rarity: 'epic',
    set: 'inferno',
    stats: { hp: 80, fireDamage: 0.15 },
    element: 'fire',
    flavorText: '"Warm to the touch, burning to enemies."'
  },
  moon_pendant: {
    id: 'moon_pendant',
    name: 'Moon Pendant',
    slot: 'collar',
    rarity: 'legendary',
    set: 'celestial',
    stats: { hp: 150, defense: 40, ppMultiplier: 0.1 },
    element: 'light',
    flavorText: '"Glows brighter at night."'
  },
  primordial_collar: {
    id: 'primordial_collar',
    name: 'Primordial Collar',
    slot: 'collar',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { hp: 300, defense: 80, expGain: 0.1 },
    flavorText: '"From before the first dawn."'
  },

  // === WEAPONS ===
  wooden_claws: {
    id: 'wooden_claws',
    name: 'Wooden Claws',
    slot: 'weapon',
    rarity: 'common',
    stats: { attack: 10, boopDamage: 1 },
    flavorText: '"A beginner\'s first weapon."'
  },
  jade_sword: {
    id: 'jade_sword',
    name: 'Jade Emperor Sword',
    slot: 'weapon',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { attack: 150, boopDamage: 50, critDamage: 0.5 },
    element: 'light',
    flavorText: '"Cuts through fate itself."'
  },
  lightning_claws: {
    id: 'lightning_claws',
    name: 'Lightning Claws',
    slot: 'weapon',
    rarity: 'epic',
    set: 'thunder_god',
    stats: { attack: 80, attackSpeed: 0.15 },
    element: 'water',
    flavorText: '"Strike with the speed of lightning."'
  },
  shadow_blade: {
    id: 'shadow_blade',
    name: 'Shadow Blade',
    slot: 'weapon',
    rarity: 'epic',
    set: 'void_walker',
    stats: { attack: 70, critChance: 0.1, critDamage: 0.3 },
    element: 'void',
    flavorText: '"Strikes from unseen angles."'
  },
  thorn_claws: {
    id: 'thorn_claws',
    name: 'Thorn Claws',
    slot: 'weapon',
    rarity: 'rare',
    set: 'nature_blessing',
    stats: { attack: 40, poisonDamage: 0.1 },
    element: 'nature',
    flavorText: '"Nature\'s sharp defense."'
  },
  fire_claws: {
    id: 'fire_claws',
    name: 'Fire Claws',
    slot: 'weapon',
    rarity: 'epic',
    set: 'inferno',
    stats: { attack: 90, fireDamage: 0.25 },
    element: 'fire',
    flavorText: '"Leave burning trails."'
  },
  sun_blade: {
    id: 'sun_blade',
    name: 'Sun Blade',
    slot: 'weapon',
    rarity: 'legendary',
    set: 'celestial',
    stats: { attack: 120, boopDamage: 40, lightDamage: 0.2 },
    element: 'light',
    flavorText: '"Blazes with solar fury."'
  },
  forgotten_blade: {
    id: 'forgotten_blade',
    name: 'Forgotten Blade',
    slot: 'weapon',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { attack: 200, boopDamage: 80, trueDamage: 0.1 },
    flavorText: '"Its name was lost to time."'
  },

  // === ARMOR ===
  cloth_vest: {
    id: 'cloth_vest',
    name: 'Cloth Vest',
    slot: 'armor',
    rarity: 'common',
    stats: { defense: 10, damageReduction: 0.02 },
    flavorText: '"Better than nothing."'
  },
  jade_armor: {
    id: 'jade_armor',
    name: 'Jade Emperor Armor',
    slot: 'armor',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { defense: 100, damageReduction: 0.2, hp: 100 },
    element: 'light',
    flavorText: '"Impervious to mortal weapons."'
  },
  storm_vest: {
    id: 'storm_vest',
    name: 'Storm Vest',
    slot: 'armor',
    rarity: 'epic',
    set: 'thunder_god',
    stats: { defense: 60, attackSpeed: 0.08, shockOnHit: true },
    element: 'water',
    flavorText: '"Shocks those who strike you."'
  },
  void_cloak: {
    id: 'void_cloak',
    name: 'Void Cloak',
    slot: 'armor',
    rarity: 'epic',
    set: 'void_walker',
    stats: { defense: 50, dodge: 0.1, phaseChance: 0.05 },
    element: 'void',
    flavorText: '"Partially exists in another dimension."'
  },
  leaf_armor: {
    id: 'leaf_armor',
    name: 'Leaf Armor',
    slot: 'armor',
    rarity: 'rare',
    set: 'nature_blessing',
    stats: { defense: 35, regenPerSecond: 0.01 },
    element: 'nature',
    flavorText: '"Living leaves that regenerate."'
  },
  magma_armor: {
    id: 'magma_armor',
    name: 'Magma Armor',
    slot: 'armor',
    rarity: 'epic',
    set: 'inferno',
    stats: { defense: 70, fireDamage: 0.1, thornDamage: 0.15 },
    element: 'fire',
    flavorText: '"Burns those who touch it."'
  },
  cosmic_robe: {
    id: 'cosmic_robe',
    name: 'Cosmic Robe',
    slot: 'armor',
    rarity: 'legendary',
    set: 'celestial',
    stats: { defense: 80, damageReduction: 0.15, allStats: 0.1 },
    element: 'light',
    flavorText: '"Woven from starlight."'
  },
  timeless_armor: {
    id: 'timeless_armor',
    name: 'Timeless Armor',
    slot: 'armor',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { defense: 150, damageReduction: 0.25, cooldownReduction: 0.1 },
    flavorText: '"Unchanged by eons."'
  },

  // === PAWS ===
  simple_boots: {
    id: 'simple_boots',
    name: 'Simple Boots',
    slot: 'paws',
    rarity: 'common',
    stats: { speed: 5, dodge: 0.01 },
    flavorText: '"Basic footwear."'
  },
  jade_boots: {
    id: 'jade_boots',
    name: 'Jade Emperor Boots',
    slot: 'paws',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { speed: 50, dodge: 0.15, allStats: 0.1 },
    element: 'light',
    flavorText: '"Walk on clouds."'
  },
  astral_boots: {
    id: 'astral_boots',
    name: 'Astral Boots',
    slot: 'paws',
    rarity: 'legendary',
    set: 'celestial',
    stats: { speed: 40, dodge: 0.1, bpMultiplier: 0.1 },
    element: 'light',
    flavorText: '"Step between stars."'
  },
  eternal_paws: {
    id: 'eternal_paws',
    name: 'Eternal Paws',
    slot: 'paws',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { speed: 60, dodge: 0.2, expGain: 0.1 },
    flavorText: '"Have walked infinite paths."'
  },

  // === TAILS ===
  ribbon_tail: {
    id: 'ribbon_tail',
    name: 'Ribbon Tail',
    slot: 'tail',
    rarity: 'common',
    stats: { luck: 5 },
    flavorText: '"A simple decoration."'
  },
  jade_tail_ring: {
    id: 'jade_tail_ring',
    name: 'Jade Emperor Tail Ring',
    slot: 'tail',
    rarity: 'legendary',
    set: 'jade_emperor',
    stats: { luck: 50, critChance: 0.1, allStats: 0.1 },
    element: 'light',
    flavorText: '"Channel imperial luck."'
  },
  comet_tail: {
    id: 'comet_tail',
    name: 'Comet Tail',
    slot: 'tail',
    rarity: 'legendary',
    set: 'celestial',
    stats: { luck: 40, speed: 20, ppMultiplier: 0.1 },
    element: 'light',
    flavorText: '"Trails stardust."'
  },
  infinity_tail: {
    id: 'infinity_tail',
    name: 'Infinity Tail',
    slot: 'tail',
    rarity: 'mythic',
    set: 'ancient_one',
    stats: { luck: 80, allStats: 0.15, cooldownReduction: 0.1 },
    flavorText: '"Contains infinite possibilities."'
  }
};

/**
 * EquipmentSystem - Manages cat equipment
 */
class EquipmentSystem {
  constructor() {
    this.slots = EQUIPMENT_SLOTS;
    this.rarities = EQUIPMENT_RARITIES;
    this.sets = EQUIPMENT_SETS;
    this.templates = EQUIPMENT_TEMPLATES;
    this.inventory = []; // Array of equipment instances
    this.equipped = {}; // catId -> { slot: equipmentId }
    this.nextId = 1;
  }

  /**
   * Create equipment instance from template
   */
  createEquipment(templateId, bonusRarity = null) {
    const template = this.templates[templateId];
    if (!template) return null;

    const rarity = bonusRarity || template.rarity;
    const rarityData = this.rarities[rarity];

    // Generate substats
    const substats = this.generateSubstats(template, rarityData);

    const equipment = {
      id: `equip_${this.nextId++}`,
      templateId: templateId,
      name: template.name,
      slot: template.slot,
      rarity: rarity,
      set: template.set || null,
      element: template.element || null,
      level: 1,
      maxLevel: this.getMaxLevel(rarity),
      stats: { ...template.stats },
      substats: substats,
      flavorText: template.flavorText,
      createdAt: Date.now()
    };

    // Apply rarity multiplier to base stats
    for (const stat in equipment.stats) {
      if (typeof equipment.stats[stat] === 'number') {
        equipment.stats[stat] *= rarityData.multiplier;
      }
    }

    return equipment;
  }

  /**
   * Generate random substats
   */
  generateSubstats(template, rarityData) {
    const substats = {};
    const possibleStats = ['attack', 'defense', 'hp', 'critChance', 'critDamage', 'speed', 'luck', 'dodge'];
    const slot = this.slots[template.slot];

    // Remove primary stats from possible substats
    const available = possibleStats.filter(s => !slot.primaryStats.includes(s));

    const numSubstats = Math.min(rarityData.maxSubs, available.length);
    const shuffled = available.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numSubstats; i++) {
      const stat = shuffled[i];
      substats[stat] = this.getRandomSubstatValue(stat, rarityData.multiplier);
    }

    return substats;
  }

  /**
   * Get random substat value
   */
  getRandomSubstatValue(stat, multiplier) {
    const baseValues = {
      attack: 5,
      defense: 3,
      hp: 10,
      critChance: 0.01,
      critDamage: 0.05,
      speed: 2,
      luck: 3,
      dodge: 0.01
    };

    const base = baseValues[stat] || 1;
    const variance = 0.5 + Math.random(); // 0.5 - 1.5
    return base * variance * multiplier;
  }

  /**
   * Get max level for rarity
   */
  getMaxLevel(rarity) {
    const maxLevels = {
      common: 5,
      uncommon: 10,
      rare: 15,
      epic: 20,
      legendary: 25,
      mythic: 30,
      transcendent: 40
    };
    return maxLevels[rarity] || 5;
  }

  /**
   * Add equipment to inventory
   */
  addToInventory(equipment) {
    this.inventory.push(equipment);
    return equipment;
  }

  /**
   * Remove equipment from inventory
   */
  removeFromInventory(equipmentId) {
    const index = this.inventory.findIndex(e => e.id === equipmentId);
    if (index >= 0) {
      return this.inventory.splice(index, 1)[0];
    }
    return null;
  }

  /**
   * Get equipment by ID
   */
  getEquipment(equipmentId) {
    return this.inventory.find(e => e.id === equipmentId) || null;
  }

  /**
   * Equip item to cat
   */
  equip(catId, equipmentId) {
    const equipment = this.getEquipment(equipmentId);
    if (!equipment) return false;

    if (!this.equipped[catId]) {
      this.equipped[catId] = {};
    }

    // Unequip existing item in slot
    const existingId = this.equipped[catId][equipment.slot];
    if (existingId) {
      // Item returns to inventory (already there)
    }

    this.equipped[catId][equipment.slot] = equipmentId;

    if (window.audioSystem) {
      window.audioSystem.playSFX('equip');
    }

    return true;
  }

  /**
   * Unequip item from cat
   */
  unequip(catId, slot) {
    if (!this.equipped[catId] || !this.equipped[catId][slot]) {
      return false;
    }

    delete this.equipped[catId][slot];

    if (window.audioSystem) {
      window.audioSystem.playSFX('unequip');
    }

    return true;
  }

  /**
   * Get all equipped items for a cat
   */
  getEquippedItems(catId) {
    const equipped = this.equipped[catId] || {};
    const items = {};

    for (const [slot, equipmentId] of Object.entries(equipped)) {
      items[slot] = this.getEquipment(equipmentId);
    }

    return items;
  }

  /**
   * Calculate total stats from equipment
   */
  calculateEquipmentStats(catId) {
    const items = this.getEquippedItems(catId);
    const stats = {
      attack: 0,
      defense: 0,
      hp: 0,
      critChance: 0,
      critDamage: 0,
      speed: 0,
      luck: 0,
      dodge: 0,
      boopDamage: 0,
      damageReduction: 0,
      wisdom: 0,
      allStats: 0,
      bpMultiplier: 0,
      ppMultiplier: 0,
      regenPerSecond: 0,
      attackSpeed: 0,
      expGain: 0,
      cooldownReduction: 0
    };

    // Sum all equipment stats
    for (const equipment of Object.values(items)) {
      if (!equipment) continue;

      // Add base stats
      for (const [stat, value] of Object.entries(equipment.stats)) {
        if (stats[stat] !== undefined && typeof value === 'number') {
          stats[stat] += value;
        }
      }

      // Add substats
      for (const [stat, value] of Object.entries(equipment.substats)) {
        if (stats[stat] !== undefined) {
          stats[stat] += value;
        }
      }
    }

    // Add set bonuses
    const setBonuses = this.calculateSetBonuses(catId);
    for (const bonus of setBonuses) {
      for (const [stat, value] of Object.entries(bonus.effects)) {
        if (stats[stat] !== undefined && typeof value === 'number') {
          stats[stat] += value;
        }
      }
    }

    return stats;
  }

  /**
   * Calculate active set bonuses
   */
  calculateSetBonuses(catId) {
    const items = this.getEquippedItems(catId);
    const setCounts = {};

    // Count pieces per set
    for (const equipment of Object.values(items)) {
      if (!equipment || !equipment.set) continue;
      setCounts[equipment.set] = (setCounts[equipment.set] || 0) + 1;
    }

    const activeBonuses = [];

    // Check each set for active bonuses
    for (const [setId, count] of Object.entries(setCounts)) {
      const set = this.sets[setId];
      if (!set) continue;

      for (const [pieces, bonus] of Object.entries(set.bonuses)) {
        if (count >= parseInt(pieces)) {
          activeBonuses.push({
            setId,
            setName: set.name,
            pieces: parseInt(pieces),
            description: bonus.description,
            effects: bonus
          });
        }
      }
    }

    return activeBonuses;
  }

  /**
   * Level up equipment
   */
  levelUp(equipmentId, materials) {
    const equipment = this.getEquipment(equipmentId);
    if (!equipment || equipment.level >= equipment.maxLevel) return false;

    equipment.level++;

    // Increase stats by 10% per level
    const levelBonus = 1 + (equipment.level - 1) * 0.1;
    // Stats are recalculated based on template + level

    if (window.audioSystem) {
      window.audioSystem.playSFX('upgradeSuccess');
    }

    return true;
  }

  /**
   * Salvage equipment for materials
   */
  salvage(equipmentId) {
    const equipment = this.getEquipment(equipmentId);
    if (!equipment) return null;

    // Check if equipped
    for (const [catId, slots] of Object.entries(this.equipped)) {
      for (const [slot, eqId] of Object.entries(slots)) {
        if (eqId === equipmentId) {
          this.unequip(catId, slot);
        }
      }
    }

    // Calculate materials returned
    const rarityData = this.rarities[equipment.rarity];
    const materials = {
      scrap: Math.floor(10 * rarityData.multiplier),
      essence: Math.floor(equipment.level * rarityData.multiplier)
    };

    this.removeFromInventory(equipmentId);

    return materials;
  }

  /**
   * Get inventory filtered by slot
   */
  getInventoryBySlot(slot) {
    return this.inventory.filter(e => e.slot === slot);
  }

  /**
   * Get inventory filtered by rarity
   */
  getInventoryByRarity(rarity) {
    return this.inventory.filter(e => e.rarity === rarity);
  }

  /**
   * Check if equipment is equipped by any cat
   */
  isEquipped(equipmentId) {
    for (const slots of Object.values(this.equipped)) {
      for (const eqId of Object.values(slots)) {
        if (eqId === equipmentId) return true;
      }
    }
    return false;
  }

  /**
   * Get total inventory count
   */
  getInventoryCount() {
    return this.inventory.length;
  }

  /**
   * Drop random equipment based on floor/context
   */
  generateDrop(floor = 1, bonusLuck = 0) {
    // Determine rarity based on floor and luck
    const rarityRoll = Math.random() + bonusLuck * 0.01;
    let rarity;

    if (floor >= 50 && rarityRoll > 0.99) {
      rarity = 'mythic';
    } else if (floor >= 30 && rarityRoll > 0.96) {
      rarity = 'legendary';
    } else if (floor >= 20 && rarityRoll > 0.9) {
      rarity = 'epic';
    } else if (floor >= 10 && rarityRoll > 0.75) {
      rarity = 'rare';
    } else if (rarityRoll > 0.5) {
      rarity = 'uncommon';
    } else {
      rarity = 'common';
    }

    // Pick random template of appropriate rarity or lower
    const templates = Object.values(this.templates).filter(t =>
      this.rarities[t.rarity].multiplier <= this.rarities[rarity].multiplier
    );

    if (templates.length === 0) return null;

    const template = templates[Math.floor(Math.random() * templates.length)];
    const equipment = this.createEquipment(template.id, rarity);

    return this.addToInventory(equipment);
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      inventory: this.inventory,
      equipped: this.equipped,
      nextId: this.nextId
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.inventory) {
      this.inventory = data.inventory;
    }
    if (data.equipped) {
      this.equipped = data.equipped;
    }
    if (data.nextId) {
      this.nextId = data.nextId;
    }
  }

  /**
   * Reset system
   */
  reset() {
    this.inventory = [];
    this.equipped = {};
    this.nextId = 1;
  }
}

// Export
window.EQUIPMENT_SLOTS = EQUIPMENT_SLOTS;
window.EQUIPMENT_RARITIES = EQUIPMENT_RARITIES;
window.EQUIPMENT_SETS = EQUIPMENT_SETS;
window.EQUIPMENT_TEMPLATES = EQUIPMENT_TEMPLATES;
window.EquipmentSystem = EquipmentSystem;
