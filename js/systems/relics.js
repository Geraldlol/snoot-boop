/**
 * relics.js - Dungeon Relic System
 * "Ancient artifacts of power, scattered throughout the Pagoda."
 *
 * Relics provide run-wide powerful buffs that stack and synergize,
 * creating unique builds each dungeon run.
 */

// ============================================================================
// RELIC DATABASE - 35+ Relics across 5 rarities
// ============================================================================

const RELICS = {
  // ============================================================================
  // COMMON RELICS (Most frequent drops, foundational bonuses)
  // ============================================================================

  lucky_coin: {
    id: 'lucky_coin',
    name: 'Lucky Coin',
    rarity: 'common',
    emoji: '🪙',
    effect: {
      type: 'lootBonus',
      value: 0.1
    },
    description: '+10% loot drop rate',
    flavor: 'Flip it for luck. Always lands on cats.',
    stackable: true,
    maxStacks: 5
  },

  catnip_pouch: {
    id: 'catnip_pouch',
    name: 'Emergency Catnip Pouch',
    rarity: 'common',
    emoji: '🌿',
    effect: {
      type: 'qiRegen',
      value: 0.2
    },
    description: '+20% Qi regeneration rate',
    flavor: 'The good stuff, for emergencies only.',
    stackable: true,
    maxStacks: 5
  },

  iron_whiskers: {
    id: 'iron_whiskers',
    name: 'Iron Whiskers',
    rarity: 'common',
    emoji: '🐱',
    effect: {
      type: 'defense',
      value: 5
    },
    description: '+5 Defense',
    flavor: 'Forged from the whiskers of a legendary battle cat.',
    stackable: true,
    maxStacks: 10
  },

  warriors_bandana: {
    id: 'warriors_bandana',
    name: "Warrior's Bandana",
    rarity: 'common',
    emoji: '🎀',
    effect: {
      type: 'attack',
      value: 3
    },
    description: '+3 Attack',
    flavor: 'Worn by the bravest kittens.',
    stackable: true,
    maxStacks: 10
  },

  scratching_post_splinter: {
    id: 'scratching_post_splinter',
    name: 'Scratching Post Splinter',
    rarity: 'common',
    emoji: '🪵',
    effect: {
      type: 'critChance',
      value: 0.03
    },
    description: '+3% critical hit chance',
    flavor: 'Sharpened claws, sharper strikes.',
    stackable: true,
    maxStacks: 10
  },

  milk_bottle: {
    id: 'milk_bottle',
    name: 'Warm Milk Bottle',
    rarity: 'common',
    emoji: '🍼',
    effect: {
      type: 'healingBonus',
      value: 0.15
    },
    description: '+15% healing received',
    flavor: 'Mother cat approved.',
    stackable: true,
    maxStacks: 5
  },

  lucky_yarn: {
    id: 'lucky_yarn',
    name: 'Lucky Yarn Ball',
    rarity: 'common',
    emoji: '🧶',
    effect: {
      type: 'dodgeChance',
      value: 0.05
    },
    description: '+5% dodge chance',
    flavor: 'The chase never ends.',
    stackable: true,
    maxStacks: 5
  },

  fish_bone: {
    id: 'fish_bone',
    name: 'Ancient Fish Bone',
    rarity: 'common',
    emoji: '🐟',
    effect: {
      type: 'maxHp',
      value: 15
    },
    description: '+15 Max HP',
    flavor: 'From a fish that defied the ages.',
    stackable: true,
    maxStacks: 10
  },

  // ============================================================================
  // RARE RELICS (Moderate drops, stronger effects)
  // ============================================================================

  box_dimension: {
    id: 'box_dimension',
    name: 'Pocket Dimension Box',
    rarity: 'rare',
    emoji: '📦',
    effect: {
      type: 'doubleLootChance',
      value: 0.25
    },
    description: '25% chance enemies drop double loot',
    flavor: "It's bigger on the inside. Much bigger.",
    stackable: false
  },

  nine_lives_charm: {
    id: 'nine_lives_charm',
    name: 'Nine Lives Charm',
    rarity: 'rare',
    emoji: '🐱',
    effect: {
      type: 'reviveChance',
      value: 0.15
    },
    description: '15% chance to auto-revive when a cat falls',
    flavor: 'Lives 1-8 sold separately.',
    stackable: true,
    maxStacks: 3
  },

  thunderpaw_gauntlet: {
    id: 'thunderpaw_gauntlet',
    name: 'Thunderpaw Gauntlet',
    rarity: 'rare',
    emoji: '⚡',
    effect: {
      type: 'critDamage',
      value: 0.5
    },
    description: '+50% critical hit damage',
    flavor: 'Strikes like lightning, purrs like thunder.',
    stackable: true,
    maxStacks: 3
  },

  moonstone_pendant: {
    id: 'moonstone_pendant',
    name: 'Moonstone Pendant',
    rarity: 'rare',
    emoji: '🌙',
    effect: {
      type: 'nightBonus',
      value: 0.3
    },
    description: '+30% damage during night floors',
    flavor: 'The moon watches over all nocturnal hunters.',
    stackable: false
  },

  sunfire_collar: {
    id: 'sunfire_collar',
    name: 'Sunfire Collar',
    rarity: 'rare',
    emoji: '☀️',
    effect: {
      type: 'dayBonus',
      value: 0.3
    },
    description: '+30% damage during day floors',
    flavor: 'Blessed by the morning sun.',
    stackable: false
  },

  jade_bell: {
    id: 'jade_bell',
    name: 'Jade Bell',
    rarity: 'rare',
    emoji: '🔔',
    effect: {
      type: 'cooldownReduction',
      value: 0.15
    },
    description: '-15% skill cooldowns',
    flavor: 'Its chime echoes through time.',
    stackable: true,
    maxStacks: 3
  },

  spirit_compass: {
    id: 'spirit_compass',
    name: 'Spirit Compass',
    rarity: 'rare',
    emoji: '🧭',
    effect: {
      type: 'secretRoomChance',
      value: 0.2
    },
    description: '+20% chance to find secret rooms',
    flavor: 'Points toward treasures unseen.',
    stackable: false
  },

  bloodstone_ring: {
    id: 'bloodstone_ring',
    name: 'Bloodstone Ring',
    rarity: 'rare',
    emoji: '💍',
    effect: {
      type: 'lifesteal',
      value: 0.1
    },
    description: 'Heal for 10% of damage dealt',
    flavor: 'Life flows from foe to friend.',
    stackable: true,
    maxStacks: 3
  },

  spectral_cloak: {
    id: 'spectral_cloak',
    name: 'Spectral Cloak',
    rarity: 'rare',
    emoji: '👻',
    effect: {
      type: 'firstStrikeBonus',
      value: 0.5
    },
    description: '+50% damage on first attack each combat',
    flavor: 'Strike from the shadows.',
    stackable: false
  },

  feather_of_speed: {
    id: 'feather_of_speed',
    name: 'Feather of Speed',
    rarity: 'rare',
    emoji: '🪶',
    effect: {
      type: 'speedBonus',
      value: 0.25
    },
    description: '+25% attack speed',
    flavor: 'Light as a feather, fast as the wind.',
    stackable: true,
    maxStacks: 3
  },

  // ============================================================================
  // EPIC RELICS (Rare drops, powerful effects)
  // ============================================================================

  goose_horn: {
    id: 'goose_horn',
    name: 'Horn of the Goose',
    rarity: 'epic',
    emoji: '📯',
    effect: {
      type: 'summonGoose',
      floors: 5
    },
    description: 'Summon a wild goose every 5 floors to attack enemies',
    flavor: 'HONK!',
    stackable: false
  },

  waifu_blessing: {
    id: 'waifu_blessing',
    name: 'Concentrated Waifu Energy',
    rarity: 'epic',
    emoji: '💕',
    effect: {
      type: 'waifuSkillCooldown',
      value: 0.5
    },
    description: 'Waifu active skill cooldown reduced by 50%',
    flavor: 'Their love empowers you.',
    stackable: false
  },

  void_shard: {
    id: 'void_shard',
    name: 'Shard of the Void',
    rarity: 'epic',
    emoji: '🌑',
    effect: {
      type: 'voidDamage',
      value: 0.2
    },
    description: '20% of damage ignores defense',
    flavor: 'A fragment of nothingness.',
    stackable: true,
    maxStacks: 3
  },

  phoenix_feather: {
    id: 'phoenix_feather',
    name: 'Phoenix Feather',
    rarity: 'epic',
    emoji: '🔥',
    effect: {
      type: 'guaranteedRevive',
      value: 1
    },
    description: 'Revive once with 50% HP when defeated',
    flavor: 'From the ashes, rise again.',
    stackable: true,
    maxStacks: 3
  },

  dragon_scale: {
    id: 'dragon_scale',
    name: 'Dragon Scale',
    rarity: 'epic',
    emoji: '🐉',
    effect: {
      type: 'damageReduction',
      value: 0.2
    },
    description: 'Take 20% less damage',
    flavor: 'Impenetrable armor of the ancients.',
    stackable: true,
    maxStacks: 2
  },

  tigers_eye: {
    id: 'tigers_eye',
    name: "Tiger's Eye",
    rarity: 'epic',
    emoji: '🐯',
    effect: {
      type: 'executionThreshold',
      value: 0.15
    },
    description: 'Instantly slay enemies below 15% HP',
    flavor: 'The predator sees all weakness.',
    stackable: true,
    maxStacks: 2
  },

  ancestral_paw_print: {
    id: 'ancestral_paw_print',
    name: 'Ancestral Paw Print',
    rarity: 'epic',
    emoji: '🐾',
    effect: {
      type: 'ancestorPower',
      value: 0.05
    },
    description: '+5% damage for each floor cleared',
    flavor: 'The spirits of ancient cats guide your paws.',
    stackable: false
  },

  chaos_crystal: {
    id: 'chaos_crystal',
    name: 'Chaos Crystal',
    rarity: 'epic',
    emoji: '💎',
    effect: {
      type: 'randomBonus',
      minValue: 0.8,
      maxValue: 1.5
    },
    description: 'Random 80%-150% damage multiplier each attack',
    flavor: 'Embrace the chaos.',
    stackable: false
  },

  infinity_collar: {
    id: 'infinity_collar',
    name: 'Infinity Collar',
    rarity: 'epic',
    emoji: '♾️',
    effect: {
      type: 'stackingPower',
      perKill: 0.01,
      maxStacks: 100
    },
    description: '+1% damage per enemy defeated (max 100%)',
    flavor: 'Power without end.',
    stackable: false
  },

  mirror_of_reflection: {
    id: 'mirror_of_reflection',
    name: 'Mirror of Reflection',
    rarity: 'epic',
    emoji: '🪞',
    effect: {
      type: 'reflectDamage',
      value: 0.25
    },
    description: 'Reflect 25% of damage taken back to enemies',
    flavor: 'Your attacks are your downfall.',
    stackable: false
  },

  // ============================================================================
  // LEGENDARY RELICS (Very rare, game-changing effects)
  // ============================================================================

  eternal_catnip: {
    id: 'eternal_catnip',
    name: 'Eternal Catnip',
    rarity: 'legendary',
    emoji: '🌟',
    effect: {
      type: 'multiple',
      effects: [
        { type: 'allStats', value: 0.2 },
        { type: 'startFullQi', value: true }
      ]
    },
    description: 'All cats have +20% stats. Start each floor with full Qi.',
    flavor: 'The good stuff. The really good stuff.',
    stackable: false
  },

  developers_mouse: {
    id: 'developers_mouse',
    name: "The Developer's Mouse",
    rarity: 'legendary',
    emoji: '🖱️',
    effect: {
      type: 'debugMode',
      value: true
    },
    description: 'See enemy HP, next floor preview, hidden loot',
    flavor: 'With great power comes great debug logs.',
    stackable: false
  },

  crown_of_the_cat_king: {
    id: 'crown_of_the_cat_king',
    name: 'Crown of the Cat King',
    rarity: 'legendary',
    emoji: '👑',
    effect: {
      type: 'multiple',
      effects: [
        { type: 'allStats', value: 0.15 },
        { type: 'teamMorale', value: 0.25 },
        { type: 'lootBonus', value: 0.5 }
      ]
    },
    description: '+15% all stats, +25% team morale, +50% loot',
    flavor: 'All hail the King of Cats.',
    stackable: false
  },

  scroll_of_infinite_wisdom: {
    id: 'scroll_of_infinite_wisdom',
    name: 'Scroll of Infinite Wisdom',
    rarity: 'legendary',
    emoji: '📜',
    effect: {
      type: 'multiple',
      effects: [
        { type: 'expBonus', value: 0.5 },
        { type: 'cooldownReduction', value: 0.25 }
      ]
    },
    description: '+50% experience gained, -25% all cooldowns',
    flavor: 'Knowledge is the ultimate power.',
    stackable: false
  },

  heart_of_the_mountain: {
    id: 'heart_of_the_mountain',
    name: 'Heart of the Mountain',
    rarity: 'legendary',
    emoji: '🏔️',
    effect: {
      type: 'multiple',
      effects: [
        { type: 'maxHp', value: 100 },
        { type: 'damageReduction', value: 0.15 },
        { type: 'defense', value: 20 }
      ]
    },
    description: '+100 Max HP, +15% damage reduction, +20 Defense',
    flavor: 'Immovable. Unbreakable. Eternal.',
    stackable: false
  },

  blade_of_a_thousand_boops: {
    id: 'blade_of_a_thousand_boops',
    name: 'Blade of a Thousand Boops',
    rarity: 'legendary',
    emoji: '⚔️',
    effect: {
      type: 'multiple',
      effects: [
        { type: 'attack', value: 25 },
        { type: 'critChance', value: 0.15 },
        { type: 'critDamage', value: 1.0 }
      ]
    },
    description: '+25 Attack, +15% crit chance, +100% crit damage',
    flavor: 'Each boop echoes with the power of those before.',
    stackable: false
  },

  celestial_tear: {
    id: 'celestial_tear',
    name: 'Celestial Tear',
    rarity: 'legendary',
    emoji: '💧',
    effect: {
      type: 'celestialBlessing',
      value: true
    },
    description: 'Fully heal after every boss fight. Immune to debuffs.',
    flavor: 'A tear from the heavens themselves.',
    stackable: false
  },

  // ============================================================================
  // MYTHIC RELICS (Extremely rare, ultimate power)
  // ============================================================================

  snoot_prime: {
    id: 'snoot_prime',
    name: 'Fragment of Snoot Prime',
    rarity: 'mythic',
    emoji: '✨',
    effect: {
      type: 'boopDamage',
      value: 3.0
    },
    description: 'All Boop Commands deal 3x damage',
    flavor: 'The first snoot. The original boop.',
    source: 'Floor 100 boss only',
    stackable: false
  },

  cosmic_yarn_ball: {
    id: 'cosmic_yarn_ball',
    name: 'Cosmic Yarn Ball',
    rarity: 'mythic',
    emoji: '🌌',
    effect: {
      type: 'multiple',
      effects: [
        { type: 'allStats', value: 0.5 },
        { type: 'infiniteQi', value: true },
        { type: 'cosmicPower', value: true }
      ]
    },
    description: '+50% all stats. Unlimited Qi. Attacks hit all enemies.',
    flavor: 'Unravel the secrets of the universe.',
    source: 'Celestial Cat God only',
    stackable: false
  },

  primordial_honk: {
    id: 'primordial_honk',
    name: 'The Primordial Honk',
    rarity: 'mythic',
    emoji: '🦢',
    effect: {
      type: 'multiple',
      effects: [
        { type: 'summonGoose', floors: 1 },
        { type: 'gooseDamageBonus', value: 5.0 },
        { type: 'chaosAura', value: true }
      ]
    },
    description: 'Summon a Chaos Goose every floor. 5x goose damage. Random effects each attack.',
    flavor: 'HONK HONK HONK HONK HONK',
    source: 'Goose Dimension only',
    stackable: false
  },

  void_heart: {
    id: 'void_heart',
    name: 'Heart of the Void',
    rarity: 'mythic',
    emoji: '🖤',
    effect: {
      type: 'multiple',
      effects: [
        { type: 'voidDamage', value: 1.0 },
        { type: 'immuneToVoid', value: true },
        { type: 'voidAbsorption', value: 0.25 }
      ]
    },
    description: 'All damage ignores defense. Immune to void damage. Heal 25% of void damage dealt.',
    flavor: 'Embrace the nothing. Become the nothing.',
    source: 'Void Sovereign only',
    stackable: false
  }
};

// Rarity weights for generation
const RELIC_RARITIES = {
  common: { weight: 55, color: '#9CA3AF', glowColor: 'rgba(156, 163, 175, 0.5)' },
  rare: { weight: 28, color: '#3B82F6', glowColor: 'rgba(59, 130, 246, 0.5)' },
  epic: { weight: 12, color: '#A855F7', glowColor: 'rgba(168, 85, 247, 0.5)' },
  legendary: { weight: 4, color: '#F59E0B', glowColor: 'rgba(245, 158, 11, 0.5)' },
  mythic: { weight: 1, color: '#EF4444', glowColor: 'rgba(239, 68, 68, 0.5)' }
};

// Floor requirements for higher rarity relics
const RELIC_FLOOR_REQUIREMENTS = {
  common: 1,
  rare: 5,
  epic: 15,
  legendary: 30,
  mythic: 50
};

// ============================================================================
// RELIC SYSTEM CLASS
// ============================================================================

class RelicSystem {
  /**
   * Create a new RelicSystem
   * @param {Object} run - Reference to the current dungeon run
   */
  constructor(run = null) {
    this.run = run;
    this.activeRelics = [];
    this.relicStacks = {}; // Track stacks for stackable relics
    this.modifiers = {}; // Calculated modifiers from relics
    this.floorEffects = {}; // Track floor-based effects
    this.killCount = 0; // For stacking power relics
    this.gooseTimer = 0; // For goose horn
    this.firstStrikeUsed = false; // Track first strike bonus
    this.celestialBlessingActive = false;
  }

  /**
   * Set the run reference (useful when run is created after relic system)
   * @param {Object} run - The dungeon run reference
   */
  setRun(run) {
    this.run = run;
  }

  /**
   * Add a relic to active relics
   * @param {string} relicId - The ID of the relic to add
   * @returns {Object|null} The added relic or null if failed
   */
  addRelic(relicId) {
    const relic = RELICS[relicId];
    if (!relic) {
      console.warn(`Relic not found: ${relicId}`);
      return null;
    }

    // Check for stackable relics
    if (relic.stackable) {
      const currentStacks = this.relicStacks[relicId] || 0;
      if (currentStacks >= (relic.maxStacks || 1)) {
        // Max stacks reached, convert to resources or reject
        console.log(`${relic.name} is at max stacks (${relic.maxStacks})`);
        return { maxed: true, relic: relic };
      }
      this.relicStacks[relicId] = currentStacks + 1;
    } else {
      // Non-stackable relic - check if already owned
      if (this.activeRelics.includes(relicId)) {
        console.log(`Already have non-stackable relic: ${relic.name}`);
        return { duplicate: true, relic: relic };
      }
    }

    // Add to active relics (only once per unique relic)
    if (!this.activeRelics.includes(relicId)) {
      this.activeRelics.push(relicId);
    }

    // Apply the relic effect
    this.applyRelicEffect(relic);

    // Play acquisition sound
    if (window.audioSystem) {
      const soundMap = {
        common: 'itemPickup',
        rare: 'rareFind',
        epic: 'epicFind',
        legendary: 'legendaryFind',
        mythic: 'mythicFind'
      };
      window.audioSystem.playSFX(soundMap[relic.rarity] || 'itemPickup');
    }

    console.log(`Acquired relic: ${relic.name} (${relic.rarity})`);
    return relic;
  }

  /**
   * Remove a relic from active relics
   * @param {string} relicId - The ID of the relic to remove
   * @returns {boolean} Whether the relic was removed
   */
  removeRelic(relicId) {
    const index = this.activeRelics.indexOf(relicId);
    if (index === -1) return false;

    const relic = RELICS[relicId];

    // Handle stackable relics
    if (relic.stackable && this.relicStacks[relicId] > 1) {
      this.relicStacks[relicId]--;
    } else {
      this.activeRelics.splice(index, 1);
      delete this.relicStacks[relicId];
    }

    // Recalculate all modifiers
    this.recalculateModifiers();

    return true;
  }

  /**
   * Apply a single relic's effect to the modifiers
   * @param {Object} relic - The relic object
   */
  applyRelicEffect(relic) {
    const effect = relic.effect;
    const stacks = this.relicStacks[relic.id] || 1;

    if (effect.type === 'multiple') {
      for (const e of effect.effects) {
        this.applySingleEffect(e, stacks);
      }
    } else {
      this.applySingleEffect(effect, stacks);
    }
  }

  /**
   * Process a single effect type
   * @param {Object} effect - The effect to apply
   * @param {number} stacks - Number of stacks
   */
  applySingleEffect(effect, stacks = 1) {
    switch (effect.type) {
      // ===== MULTIPLICATIVE BONUSES =====
      case 'lootBonus':
        this.modifiers.lootBonus = (this.modifiers.lootBonus || 1) + (effect.value * stacks);
        break;

      case 'qiRegen':
        this.modifiers.qiRegen = (this.modifiers.qiRegen || 1) + (effect.value * stacks);
        break;

      case 'doubleLootChance':
        this.modifiers.doubleLootChance = (this.modifiers.doubleLootChance || 0) + effect.value;
        break;

      case 'reviveChance':
        this.modifiers.reviveChance = (this.modifiers.reviveChance || 0) + (effect.value * stacks);
        break;

      case 'allStats':
        this.modifiers.allStats = (this.modifiers.allStats || 1) + effect.value;
        break;

      case 'boopDamage':
        this.modifiers.boopDamage = (this.modifiers.boopDamage || 1) * effect.value;
        break;

      case 'critChance':
        this.modifiers.critChance = (this.modifiers.critChance || 0) + (effect.value * stacks);
        break;

      case 'critDamage':
        this.modifiers.critDamage = (this.modifiers.critDamage || 1) + (effect.value * stacks);
        break;

      case 'cooldownReduction':
        this.modifiers.cooldownReduction = (this.modifiers.cooldownReduction || 0) + (effect.value * stacks);
        break;

      case 'healingBonus':
        this.modifiers.healingBonus = (this.modifiers.healingBonus || 1) + (effect.value * stacks);
        break;

      case 'damageReduction':
        // Multiplicative to prevent 100% reduction
        const current = this.modifiers.damageReduction || 0;
        this.modifiers.damageReduction = 1 - ((1 - current) * (1 - effect.value * stacks));
        break;

      case 'lifesteal':
        this.modifiers.lifesteal = (this.modifiers.lifesteal || 0) + (effect.value * stacks);
        break;

      case 'expBonus':
        this.modifiers.expBonus = (this.modifiers.expBonus || 1) + effect.value;
        break;

      case 'teamMorale':
        this.modifiers.teamMorale = (this.modifiers.teamMorale || 1) + effect.value;
        break;

      // ===== FLAT BONUSES =====
      case 'defense':
        this.modifiers.defense = (this.modifiers.defense || 0) + (effect.value * stacks);
        break;

      case 'attack':
        this.modifiers.attack = (this.modifiers.attack || 0) + (effect.value * stacks);
        break;

      case 'maxHp':
        this.modifiers.maxHp = (this.modifiers.maxHp || 0) + (effect.value * stacks);
        break;

      case 'speedBonus':
        this.modifiers.speedBonus = (this.modifiers.speedBonus || 1) + (effect.value * stacks);
        break;

      case 'dodgeChance':
        this.modifiers.dodgeChance = (this.modifiers.dodgeChance || 0) + (effect.value * stacks);
        break;

      // ===== CONDITIONAL BONUSES =====
      case 'nightBonus':
        this.modifiers.nightBonus = (this.modifiers.nightBonus || 0) + effect.value;
        break;

      case 'dayBonus':
        this.modifiers.dayBonus = (this.modifiers.dayBonus || 0) + effect.value;
        break;

      case 'firstStrikeBonus':
        this.modifiers.firstStrikeBonus = (this.modifiers.firstStrikeBonus || 0) + effect.value;
        break;

      case 'executionThreshold':
        this.modifiers.executionThreshold = Math.max(
          this.modifiers.executionThreshold || 0,
          effect.value * stacks
        );
        break;

      case 'voidDamage':
        this.modifiers.voidDamage = (this.modifiers.voidDamage || 0) + (effect.value * stacks);
        break;

      case 'secretRoomChance':
        this.modifiers.secretRoomChance = (this.modifiers.secretRoomChance || 0) + effect.value;
        break;

      case 'reflectDamage':
        this.modifiers.reflectDamage = (this.modifiers.reflectDamage || 0) + effect.value;
        break;

      // ===== SPECIAL EFFECTS =====
      case 'startFullQi':
        this.modifiers.startFullQi = true;
        break;

      case 'debugMode':
        this.modifiers.debugMode = true;
        break;

      case 'guaranteedRevive':
        this.modifiers.guaranteedRevives = (this.modifiers.guaranteedRevives || 0) + (effect.value * stacks);
        break;

      case 'summonGoose':
        this.modifiers.gooseSummonFloors = effect.floors;
        break;

      case 'waifuSkillCooldown':
        this.modifiers.waifuSkillCooldown = (this.modifiers.waifuSkillCooldown || 1) * (1 - effect.value);
        break;

      case 'ancestorPower':
        this.modifiers.ancestorPowerPerFloor = effect.value;
        break;

      case 'randomBonus':
        this.modifiers.randomBonus = { min: effect.minValue, max: effect.maxValue };
        break;

      case 'stackingPower':
        this.modifiers.stackingPower = {
          perKill: effect.perKill,
          maxStacks: effect.maxStacks
        };
        break;

      case 'celestialBlessing':
        this.modifiers.celestialBlessing = true;
        this.celestialBlessingActive = true;
        break;

      case 'infiniteQi':
        this.modifiers.infiniteQi = true;
        break;

      case 'cosmicPower':
        this.modifiers.cosmicPower = true;
        break;

      case 'gooseDamageBonus':
        this.modifiers.gooseDamageBonus = (this.modifiers.gooseDamageBonus || 1) * effect.value;
        break;

      case 'chaosAura':
        this.modifiers.chaosAura = true;
        break;

      case 'immuneToVoid':
        this.modifiers.immuneToVoid = true;
        break;

      case 'voidAbsorption':
        this.modifiers.voidAbsorption = (this.modifiers.voidAbsorption || 0) + effect.value;
        break;

      default:
        console.warn(`Unknown relic effect type: ${effect.type}`);
    }
  }

  /**
   * Recalculate all modifiers from scratch
   */
  recalculateModifiers() {
    this.modifiers = {};

    for (const relicId of this.activeRelics) {
      const relic = RELICS[relicId];
      if (relic) {
        this.applyRelicEffect(relic);
      }
    }
  }

  /**
   * Process floor-based relic effects
   * @param {number} floorNum - The current floor number
   */
  processFloorRelics(floorNum) {
    const events = [];

    // Goose Horn - summon goose every N floors
    if (this.modifiers.gooseSummonFloors) {
      if (floorNum % this.modifiers.gooseSummonFloors === 0) {
        events.push({
          type: 'summonGoose',
          message: 'HONK! A goose has been summoned!',
          damage: this.calculateGooseDamage()
        });
      }
    }

    // Ancestor Power - calculate stacking damage
    if (this.modifiers.ancestorPowerPerFloor) {
      const bonusDamage = floorNum * this.modifiers.ancestorPowerPerFloor;
      this.modifiers.ancestorBonus = bonusDamage;
    }

    // Start with full Qi
    if (this.modifiers.startFullQi && this.run) {
      events.push({
        type: 'restoreQi',
        message: 'Eternal Catnip restores your Qi!'
      });
    }

    // Reset first strike for new floor
    this.firstStrikeUsed = false;

    return events;
  }

  /**
   * Calculate goose summon damage
   * @returns {number} The damage the goose will deal
   */
  calculateGooseDamage() {
    let baseDamage = 100;

    if (this.run) {
      baseDamage = (this.run.playerDamage || 10) * 3;
    }

    // Apply goose damage bonus
    if (this.modifiers.gooseDamageBonus) {
      baseDamage *= this.modifiers.gooseDamageBonus;
    }

    return Math.floor(baseDamage);
  }

  /**
   * Process kill event for stacking relics
   */
  onEnemyKilled() {
    this.killCount++;

    // Update stacking power bonus
    if (this.modifiers.stackingPower) {
      const stacks = Math.min(this.killCount, this.modifiers.stackingPower.maxStacks);
      this.modifiers.stackingBonus = stacks * this.modifiers.stackingPower.perKill;
    }
  }

  /**
   * Process damage dealt for lifesteal and other effects
   * @param {number} damage - The damage dealt
   * @returns {Object} Effects to apply (healing, etc.)
   */
  onDamageDealt(damage) {
    const effects = {};

    // Lifesteal
    if (this.modifiers.lifesteal > 0) {
      effects.heal = Math.floor(damage * this.modifiers.lifesteal);
    }

    // Void absorption
    if (this.modifiers.voidAbsorption > 0 && this.modifiers.voidDamage > 0) {
      const voidDamage = damage * this.modifiers.voidDamage;
      effects.heal = (effects.heal || 0) + Math.floor(voidDamage * this.modifiers.voidAbsorption);
    }

    return effects;
  }

  /**
   * Calculate damage modifier from relics
   * @param {boolean} isFirstStrike - Whether this is the first attack
   * @returns {number} The damage multiplier
   */
  getDamageMultiplier(isFirstStrike = false) {
    let multiplier = 1.0;

    // All stats bonus
    if (this.modifiers.allStats) {
      multiplier *= this.modifiers.allStats;
    }

    // Boop damage multiplier
    if (this.modifiers.boopDamage) {
      multiplier *= this.modifiers.boopDamage;
    }

    // Stacking power bonus
    if (this.modifiers.stackingBonus) {
      multiplier *= (1 + this.modifiers.stackingBonus);
    }

    // Ancestor power bonus
    if (this.modifiers.ancestorBonus) {
      multiplier *= (1 + this.modifiers.ancestorBonus);
    }

    // First strike bonus
    if (isFirstStrike && !this.firstStrikeUsed && this.modifiers.firstStrikeBonus) {
      multiplier *= (1 + this.modifiers.firstStrikeBonus);
      this.firstStrikeUsed = true;
    }

    // Random bonus (chaos crystal)
    if (this.modifiers.randomBonus) {
      const { min, max } = this.modifiers.randomBonus;
      multiplier *= min + Math.random() * (max - min);
    }

    return multiplier;
  }

  /**
   * Check if a relic is active
   * @param {string} relicId - The relic ID to check
   * @returns {boolean} Whether the relic is active
   */
  hasRelic(relicId) {
    return this.activeRelics.includes(relicId);
  }

  /**
   * Get all active relics
   * @returns {Array} Array of active relic objects
   */
  getActiveRelics() {
    return this.activeRelics.map(id => ({
      ...RELICS[id],
      stacks: this.relicStacks[id] || 1
    }));
  }

  /**
   * Get relics filtered by rarity
   * @param {string} rarity - The rarity to filter by
   * @returns {Array} Array of relic objects matching the rarity
   */
  getRelicsByRarity(rarity) {
    return Object.values(RELICS).filter(r => r.rarity === rarity);
  }

  /**
   * Generate a random relic reward for a floor
   * @param {number} floorNum - The current floor number
   * @param {string} forceRarity - Force a specific rarity (optional)
   * @returns {Object|null} The generated relic or null
   */
  generateRelicReward(floorNum, forceRarity = null) {
    // Determine rarity
    let rarity;

    if (forceRarity) {
      rarity = forceRarity;
    } else {
      rarity = this.rollRarity(floorNum);
    }

    // Get eligible relics of this rarity that aren't maxed
    const eligibleRelics = this.getRelicsByRarity(rarity).filter(relic => {
      // Check if already at max stacks
      if (relic.stackable) {
        const currentStacks = this.relicStacks[relic.id] || 0;
        return currentStacks < (relic.maxStacks || 1);
      }
      // Non-stackable - check if already owned
      return !this.hasRelic(relic.id);
    });

    // If no eligible relics at this rarity, try lower rarities
    if (eligibleRelics.length === 0) {
      const rarityOrder = ['mythic', 'legendary', 'epic', 'rare', 'common'];
      const currentIndex = rarityOrder.indexOf(rarity);

      for (let i = currentIndex + 1; i < rarityOrder.length; i++) {
        const lowerRarity = rarityOrder[i];
        const lowerRelics = this.getRelicsByRarity(lowerRarity).filter(r => {
          if (r.stackable) {
            return (this.relicStacks[r.id] || 0) < (r.maxStacks || 1);
          }
          return !this.hasRelic(r.id);
        });

        if (lowerRelics.length > 0) {
          return lowerRelics[Math.floor(Math.random() * lowerRelics.length)];
        }
      }

      // All relics maxed - return null
      return null;
    }

    // Pick a random eligible relic
    return eligibleRelics[Math.floor(Math.random() * eligibleRelics.length)];
  }

  /**
   * Roll for rarity based on floor and weights
   * @param {number} floorNum - The current floor number
   * @returns {string} The rolled rarity
   */
  rollRarity(floorNum) {
    // Filter rarities by floor requirement
    const availableRarities = Object.entries(RELIC_RARITIES).filter(
      ([rarity, _]) => floorNum >= RELIC_FLOOR_REQUIREMENTS[rarity]
    );

    // Calculate total weight
    const totalWeight = availableRarities.reduce((sum, [_, data]) => sum + data.weight, 0);

    // Roll
    let roll = Math.random() * totalWeight;

    for (const [rarity, data] of availableRarities) {
      roll -= data.weight;
      if (roll <= 0) {
        return rarity;
      }
    }

    return 'common';
  }

  /**
   * Get the number of stacks for a relic
   * @param {string} relicId - The relic ID
   * @returns {number} The number of stacks
   */
  getRelicStacks(relicId) {
    return this.relicStacks[relicId] || 0;
  }

  /**
   * Check for auto-revive from relics
   * @returns {Object|null} Revive info or null if no revive available
   */
  checkAutoRevive() {
    // Check guaranteed revives first (Phoenix Feather)
    if (this.modifiers.guaranteedRevives > 0) {
      this.modifiers.guaranteedRevives--;
      return {
        source: 'Phoenix Feather',
        hpPercent: 0.5,
        guaranteed: true
      };
    }

    // Check chance-based revive (Nine Lives Charm)
    if (this.modifiers.reviveChance > 0) {
      if (Math.random() < this.modifiers.reviveChance) {
        return {
          source: 'Nine Lives Charm',
          hpPercent: 0.3,
          guaranteed: false
        };
      }
    }

    return null;
  }

  /**
   * Process boss defeat for celestial blessing
   * @returns {Object|null} Healing info or null
   */
  onBossDefeated() {
    if (this.modifiers.celestialBlessing) {
      return {
        fullHeal: true,
        source: 'Celestial Tear'
      };
    }
    return null;
  }

  /**
   * Get modifier value with default
   * @param {string} key - The modifier key
   * @param {*} defaultValue - Default value if not set
   * @returns {*} The modifier value
   */
  getModifier(key, defaultValue = 0) {
    return this.modifiers[key] !== undefined ? this.modifiers[key] : defaultValue;
  }

  /**
   * Get all current modifiers
   * @returns {Object} All active modifiers
   */
  getAllModifiers() {
    return { ...this.modifiers };
  }

  /**
   * Reset the relic system for a new run
   */
  reset() {
    this.activeRelics = [];
    this.relicStacks = {};
    this.modifiers = {};
    this.floorEffects = {};
    this.killCount = 0;
    this.gooseTimer = 0;
    this.firstStrikeUsed = false;
    this.celestialBlessingActive = false;
  }

  /**
   * Serialize for saving
   * @returns {Object} Serialized state
   */
  serialize() {
    return {
      activeRelics: this.activeRelics,
      relicStacks: this.relicStacks,
      killCount: this.killCount
    };
  }

  /**
   * Load from save data
   * @param {Object} data - Saved data
   */
  deserialize(data) {
    if (!data) return;

    this.activeRelics = data.activeRelics || [];
    this.relicStacks = data.relicStacks || {};
    this.killCount = data.killCount || 0;

    // Recalculate modifiers
    this.recalculateModifiers();
  }

  /**
   * Get relic display info for UI
   * @param {string} relicId - The relic ID
   * @returns {Object} Display info
   */
  getRelicDisplayInfo(relicId) {
    const relic = RELICS[relicId];
    if (!relic) return null;

    const rarityInfo = RELIC_RARITIES[relic.rarity];
    const stacks = this.relicStacks[relicId] || 0;

    return {
      ...relic,
      color: rarityInfo.color,
      glowColor: rarityInfo.glowColor,
      stacks: stacks,
      isMaxed: relic.stackable && stacks >= (relic.maxStacks || 1)
    };
  }

  /**
   * Generate multiple relic choices for selection
   * @param {number} floorNum - Current floor
   * @param {number} count - Number of choices (default 3)
   * @returns {Array} Array of relic options
   */
  generateRelicChoices(floorNum, count = 3) {
    const choices = [];
    const usedIds = new Set();

    for (let i = 0; i < count; i++) {
      let relic = null;
      let attempts = 0;

      while (!relic && attempts < 50) {
        attempts++;
        const candidate = this.generateRelicReward(floorNum);

        if (candidate && !usedIds.has(candidate.id)) {
          relic = candidate;
          usedIds.add(candidate.id);
        }
      }

      if (relic) {
        choices.push(relic);
      }
    }

    return choices;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

// Export for use in other modules
window.RELICS = RELICS;
window.RELIC_RARITIES = RELIC_RARITIES;
window.RELIC_FLOOR_REQUIREMENTS = RELIC_FLOOR_REQUIREMENTS;
window.RelicSystem = RelicSystem;

// ES6 module export (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RELICS, RELIC_RARITIES, RELIC_FLOOR_REQUIREMENTS, RelicSystem };
}
