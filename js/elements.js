/**
 * elements.js - Elemental Reactions System
 * "The five elements flow through all things, even the boopiest of snoots."
 */

// Element Definitions
const ELEMENTS = {
  fire: {
    id: 'fire',
    name: 'Fire',
    emoji: '🔥',
    color: '#FF4500',
    description: 'High damage, DOT effects',
    strengths: ['nature'],
    weaknesses: ['water']
  },
  water: {
    id: 'water',
    name: 'Water',
    emoji: '💧',
    color: '#1E90FF',
    description: 'Healing, cooldown reduction',
    strengths: ['fire'],
    weaknesses: ['nature']
  },
  nature: {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿',
    color: '#32CD32',
    description: 'Buffs, regeneration',
    strengths: ['water'],
    weaknesses: ['fire']
  },
  void: {
    id: 'void',
    name: 'Void',
    emoji: '🌑',
    color: '#4B0082',
    description: 'True damage, debuffs',
    strengths: ['light'],
    weaknesses: ['light']
  },
  light: {
    id: 'light',
    name: 'Light',
    emoji: '✨',
    color: '#FFD700',
    description: 'Crit bonuses, shields',
    strengths: ['void'],
    weaknesses: ['void']
  }
};

// Elemental Reactions
const ELEMENTAL_REACTIONS = {
  steam: {
    id: 'steam',
    name: 'Steam Burst',
    elements: ['fire', 'water'],
    emoji: '💨',
    color: '#87CEEB',
    description: 'AOE damage + blind effect',
    effect: {
      type: 'aoe_damage',
      multiplier: 1.5,
      debuff: 'blind',
      debuffDuration: 3000
    },
    flavorText: '"The hiss of opposing forces."'
  },
  wildfire: {
    id: 'wildfire',
    name: 'Wildfire',
    elements: ['fire', 'nature'],
    emoji: '🔥',
    color: '#FF6B35',
    description: 'Spreading DOT damage',
    effect: {
      type: 'dot',
      damagePerSecond: 0.1, // 10% of initial damage per second
      duration: 5000,
      spreads: true
    },
    flavorText: '"Nature fuels the flame."'
  },
  growth: {
    id: 'growth',
    name: 'Verdant Growth',
    elements: ['water', 'nature'],
    emoji: '🌱',
    color: '#90EE90',
    description: 'Massive heal over time',
    effect: {
      type: 'hot',
      healPerSecond: 0.05, // 5% max HP per second
      duration: 8000
    },
    flavorText: '"Life finds a way to flourish."'
  },
  annihilation: {
    id: 'annihilation',
    name: 'Annihilation',
    elements: ['void', 'light'],
    emoji: '💫',
    color: '#FFFFFF',
    description: 'Massive burst damage',
    effect: {
      type: 'burst',
      multiplier: 3.0,
      ignoresDefense: true
    },
    flavorText: '"When light meets darkness, only destruction remains."'
  },
  hellfire: {
    id: 'hellfire',
    name: 'Hellfire',
    elements: ['fire', 'void'],
    emoji: '🖤',
    color: '#8B0000',
    description: 'Ignores all resistance',
    effect: {
      type: 'true_damage',
      multiplier: 2.0,
      ignoresResistance: true
    },
    flavorText: '"Flames from the abyss."'
  },
  purify: {
    id: 'purify',
    name: 'Purification',
    elements: ['water', 'light'],
    emoji: '🌊',
    color: '#E0FFFF',
    description: 'Remove all debuffs + heal',
    effect: {
      type: 'cleanse',
      heals: true,
      healAmount: 0.2 // 20% max HP
    },
    flavorText: '"Cleansed by sacred waters."'
  },
  corruption: {
    id: 'corruption',
    name: 'Corruption',
    elements: ['nature', 'void'],
    emoji: '🦠',
    color: '#556B2F',
    description: 'Convert enemy buffs to debuffs',
    effect: {
      type: 'convert_buffs',
      damagePerBuff: 0.1 // 10% damage per converted buff
    },
    flavorText: '"Even growth can be twisted."'
  },
  bloom: {
    id: 'bloom',
    name: 'Radiant Bloom',
    elements: ['nature', 'light'],
    emoji: '🌸',
    color: '#FFB6C1',
    description: 'Party-wide buff',
    effect: {
      type: 'party_buff',
      attackBonus: 0.25,
      defenseBonus: 0.25,
      duration: 10000
    },
    flavorText: '"In harmony, we flourish."'
  }
};

// Element Auras (applied status effects)
const ELEMENT_AURAS = {
  burning: {
    id: 'burning',
    name: 'Burning',
    element: 'fire',
    emoji: '🔥',
    duration: 5000,
    effect: { damagePerSecond: 0.02 }
  },
  wet: {
    id: 'wet',
    name: 'Wet',
    element: 'water',
    emoji: '💧',
    duration: 8000,
    effect: { healingReceived: 1.2 }
  },
  overgrown: {
    id: 'overgrown',
    name: 'Overgrown',
    element: 'nature',
    emoji: '🌿',
    duration: 6000,
    effect: { regenPerSecond: 0.01 }
  },
  voided: {
    id: 'voided',
    name: 'Voided',
    element: 'void',
    emoji: '🌑',
    duration: 4000,
    effect: { damageReceived: 1.3 }
  },
  illuminated: {
    id: 'illuminated',
    name: 'Illuminated',
    element: 'light',
    emoji: '✨',
    duration: 5000,
    effect: { critChance: 0.2 }
  },
  blind: {
    id: 'blind',
    name: 'Blinded',
    element: 'none',
    emoji: '😵',
    duration: 3000,
    effect: { accuracy: 0.5 }
  }
};

/**
 * ElementalSystem - Manages elemental interactions
 */
class ElementalSystem {
  constructor() {
    this.elements = ELEMENTS;
    this.reactions = ELEMENTAL_REACTIONS;
    this.auras = ELEMENT_AURAS;
    this.activeAuras = new Map(); // targetId -> [auras]
    this.reactionHistory = [];
  }

  /**
   * Get element data
   */
  getElement(elementId) {
    return this.elements[elementId] || null;
  }

  /**
   * Calculate elemental damage multiplier
   */
  getElementalMultiplier(attackElement, defenseElement) {
    const attacker = this.elements[attackElement];
    const defender = this.elements[defenseElement];

    if (!attacker || !defender) return 1.0;

    if (attacker.strengths.includes(defenseElement)) {
      return 1.5; // 50% bonus damage
    }
    if (attacker.weaknesses.includes(defenseElement)) {
      return 0.5; // 50% reduced damage
    }
    return 1.0;
  }

  /**
   * Apply elemental aura to target
   */
  applyAura(targetId, elementId) {
    const auraTemplate = Object.values(this.auras).find(a => a.element === elementId);
    if (!auraTemplate) return null;

    if (!this.activeAuras.has(targetId)) {
      this.activeAuras.set(targetId, []);
    }

    const auras = this.activeAuras.get(targetId);

    // Check for existing aura of same type
    const existingIndex = auras.findIndex(a => a.element === elementId);
    if (existingIndex >= 0) {
      // Refresh duration
      auras[existingIndex].expiresAt = Date.now() + auraTemplate.duration;
      return null; // No reaction
    }

    // Add new aura
    const newAura = {
      ...auraTemplate,
      appliedAt: Date.now(),
      expiresAt: Date.now() + auraTemplate.duration
    };
    auras.push(newAura);

    // Check for reactions
    return this.checkReactions(targetId, auras);
  }

  /**
   * Check for elemental reactions
   */
  checkReactions(targetId, auras) {
    const activeElements = auras.map(a => a.element).filter(e => e !== 'none');

    for (const reaction of Object.values(this.reactions)) {
      const hasAll = reaction.elements.every(e => activeElements.includes(e));
      if (hasAll) {
        // Trigger reaction!
        this.triggerReaction(targetId, reaction);

        // Remove consumed auras
        const remaining = auras.filter(a => !reaction.elements.includes(a.element));
        this.activeAuras.set(targetId, remaining);

        return reaction;
      }
    }

    return null;
  }

  /**
   * Trigger an elemental reaction
   */
  triggerReaction(targetId, reaction) {
    this.reactionHistory.push({
      targetId,
      reactionId: reaction.id,
      timestamp: Date.now()
    });

    // Play sound if audio available
    if (window.audioSystem) {
      window.audioSystem.playSFX('elementReaction');
    }

    // Return reaction for external handling
    return reaction;
  }

  /**
   * Process reaction effect
   */
  processReactionEffect(reaction, context) {
    const effect = reaction.effect;
    const results = {
      damage: 0,
      healing: 0,
      buffs: [],
      debuffs: []
    };

    switch (effect.type) {
      case 'aoe_damage':
        results.damage = context.baseDamage * effect.multiplier;
        if (effect.debuff) {
          results.debuffs.push({
            type: effect.debuff,
            duration: effect.debuffDuration
          });
        }
        break;

      case 'dot':
        results.debuffs.push({
          type: 'dot',
          damagePerSecond: context.baseDamage * effect.damagePerSecond,
          duration: effect.duration,
          spreads: effect.spreads
        });
        break;

      case 'hot':
        results.buffs.push({
          type: 'hot',
          healPerSecond: context.maxHp * effect.healPerSecond,
          duration: effect.duration
        });
        break;

      case 'burst':
        results.damage = context.baseDamage * effect.multiplier;
        results.ignoresDefense = effect.ignoresDefense;
        break;

      case 'true_damage':
        results.damage = context.baseDamage * effect.multiplier;
        results.ignoresResistance = effect.ignoresResistance;
        break;

      case 'cleanse':
        results.cleanse = true;
        if (effect.heals) {
          results.healing = context.maxHp * effect.healAmount;
        }
        break;

      case 'convert_buffs':
        results.convertBuffs = true;
        results.damagePerBuff = context.baseDamage * effect.damagePerBuff;
        break;

      case 'party_buff':
        results.buffs.push({
          type: 'party_buff',
          attackBonus: effect.attackBonus,
          defenseBonus: effect.defenseBonus,
          duration: effect.duration
        });
        break;
    }

    return results;
  }

  /**
   * Get active auras for target
   */
  getActiveAuras(targetId) {
    const auras = this.activeAuras.get(targetId) || [];
    const now = Date.now();

    // Filter expired auras
    const active = auras.filter(a => a.expiresAt > now);
    this.activeAuras.set(targetId, active);

    return active;
  }

  /**
   * Clear all auras for target
   */
  clearAuras(targetId) {
    this.activeAuras.delete(targetId);
  }

  /**
   * Update auras (call each frame/tick)
   */
  update(deltaTime) {
    const now = Date.now();

    for (const [targetId, auras] of this.activeAuras) {
      // Remove expired auras
      const active = auras.filter(a => a.expiresAt > now);
      if (active.length !== auras.length) {
        this.activeAuras.set(targetId, active);
      }
    }
  }

  /**
   * Get combined elemental bonuses from equipment/cats
   */
  getCombinedElementalPower(sources) {
    const power = {
      fire: 0,
      water: 0,
      nature: 0,
      void: 0,
      light: 0
    };

    for (const source of sources) {
      if (source.element) {
        power[source.element] += source.elementalPower || 1;
      }
    }

    return power;
  }

  /**
   * Get dominant element from power
   */
  getDominantElement(power) {
    let maxPower = 0;
    let dominant = null;

    for (const [element, value] of Object.entries(power)) {
      if (value > maxPower) {
        maxPower = value;
        dominant = element;
      }
    }

    return dominant;
  }

  /**
   * Calculate elemental resistance
   */
  getResistance(element, resistances) {
    return resistances[element] || 0;
  }

  /**
   * Apply resistance to damage
   */
  applyResistance(damage, element, resistances) {
    const resistance = this.getResistance(element, resistances);
    return damage * (1 - Math.min(resistance, 0.75)); // Cap at 75% reduction
  }

  /**
   * Get reaction between two elements (if any)
   */
  getReaction(element1, element2) {
    for (const reaction of Object.values(this.reactions)) {
      if (reaction.elements.includes(element1) && reaction.elements.includes(element2)) {
        return reaction;
      }
    }
    return null;
  }

  /**
   * Get all possible reactions for an element
   */
  getPossibleReactions(element) {
    return Object.values(this.reactions).filter(r => r.elements.includes(element));
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      reactionHistory: this.reactionHistory.slice(-100) // Keep last 100
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.reactionHistory) {
      this.reactionHistory = data.reactionHistory;
    }
  }

  /**
   * Reset system
   */
  reset() {
    this.activeAuras.clear();
    this.reactionHistory = [];
  }
}

// Export
window.ELEMENTS = ELEMENTS;
window.ELEMENTAL_REACTIONS = ELEMENTAL_REACTIONS;
window.ELEMENT_AURAS = ELEMENT_AURAS;
window.ElementalSystem = ElementalSystem;
