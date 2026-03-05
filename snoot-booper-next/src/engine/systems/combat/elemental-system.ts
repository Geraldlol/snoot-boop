/**
 * ElementalSystem - Element interactions, auras, and reactions
 *
 * Five-element system with strength/weakness multipliers and two-element
 * reactions (like Genshin-style). Auras are runtime-only; only reaction
 * history is persisted.
 * Pure TypeScript, zero React imports.
 */

// ─── Elements ────────────────────────────────────────────────

export type ElementId = 'fire' | 'water' | 'nature' | 'void' | 'light';

export interface ElementDef {
  id: ElementId;
  name: string;
  strong: ElementId;   // 1.5x against this
  weak: ElementId;     // 0.5x against this
  color: string;
}

export const ELEMENTS: Record<ElementId, ElementDef> = {
  fire:   { id: 'fire',   name: 'Fire',   strong: 'nature', weak: 'water',  color: '#FF4500' },
  water:  { id: 'water',  name: 'Water',  strong: 'fire',   weak: 'nature', color: '#1E90FF' },
  nature: { id: 'nature', name: 'Nature', strong: 'water',  weak: 'fire',   color: '#32CD32' },
  void:   { id: 'void',   name: 'Void',   strong: 'light',  weak: 'light',  color: '#4B0082' },
  light:  { id: 'light',  name: 'Light',  strong: 'void',   weak: 'void',   color: '#FFD700' },
};

const STRENGTH_MULT = 1.5;
const WEAKNESS_MULT = 0.5;

// ─── Reactions ───────────────────────────────────────────────

export type ReactionId =
  | 'steam'
  | 'wildfire'
  | 'growth'
  | 'annihilation'
  | 'hellfire'
  | 'purify'
  | 'corruption'
  | 'bloom';

export interface ReactionDef {
  id: ReactionId;
  name: string;
  elements: [ElementId, ElementId];
  description: string;
  damageMultiplier: number;
  /** Special effect data. */
  special: Record<string, number | boolean | string>;
}

export const ELEMENTAL_REACTIONS: Record<ReactionId, ReactionDef> = {
  steam: {
    id: 'steam',
    name: 'Steam',
    elements: ['fire', 'water'],
    description: 'AoE 1.5x damage + blind for 3s',
    damageMultiplier: 1.5,
    special: { aoe: true, applyDebuff: 'blind', debuffDuration: 3000 },
  },
  wildfire: {
    id: 'wildfire',
    name: 'Wildfire',
    elements: ['fire', 'nature'],
    description: 'DoT 10%/s for 5s',
    damageMultiplier: 1.0,
    special: { dot: true, dotPercent: 0.10, dotDuration: 5000 },
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    elements: ['water', 'nature'],
    description: 'HoT 5% maxHP/s for 8s',
    damageMultiplier: 0,
    special: { hot: true, hotPercent: 0.05, hotDuration: 8000 },
  },
  annihilation: {
    id: 'annihilation',
    name: 'Annihilation',
    elements: ['void', 'light'],
    description: 'Burst 3.0x damage, ignores defense',
    damageMultiplier: 3.0,
    special: { ignoreDefense: true },
  },
  hellfire: {
    id: 'hellfire',
    name: 'Hellfire',
    elements: ['fire', 'void'],
    description: 'True damage 2.0x',
    damageMultiplier: 2.0,
    special: { trueDamage: true },
  },
  purify: {
    id: 'purify',
    name: 'Purify',
    elements: ['water', 'light'],
    description: 'Cleanse debuffs + heal 20% maxHP',
    damageMultiplier: 0,
    special: { cleanse: true, healPercent: 0.20 },
  },
  corruption: {
    id: 'corruption',
    name: 'Corruption',
    elements: ['nature', 'void'],
    description: '10% damage per active buff on target',
    damageMultiplier: 1.0,
    special: { damagePerBuff: 0.10 },
  },
  bloom: {
    id: 'bloom',
    name: 'Bloom',
    elements: ['nature', 'light'],
    description: '+25% ATK and DEF for 10s',
    damageMultiplier: 0,
    special: { atkBuff: 0.25, defBuff: 0.25, buffDuration: 10_000 },
  },
};

// Build a quick lookup: sorted element pair -> reactionId
const REACTION_LOOKUP = new Map<string, ReactionId>();
for (const r of Object.values(ELEMENTAL_REACTIONS)) {
  const key = [...r.elements].sort().join('+');
  REACTION_LOOKUP.set(key, r.id);
}

// ─── Auras ───────────────────────────────────────────────────

export type AuraId = 'burning' | 'wet' | 'overgrown' | 'voided' | 'illuminated' | 'blind';

export interface AuraDef {
  id: AuraId;
  name: string;
  element: ElementId | null;  // blind has no element
  baseDuration: number;       // ms
  effect: Record<string, number | boolean>;
}

export const ELEMENT_AURAS: Record<AuraId, AuraDef> = {
  burning:     { id: 'burning',     name: 'Burning',     element: 'fire',   baseDuration: 5000, effect: { dmgPerSec: 0.02 } },
  wet:         { id: 'wet',         name: 'Wet',         element: 'water',  baseDuration: 8000, effect: { healingMult: 1.2 } },
  overgrown:   { id: 'overgrown',   name: 'Overgrown',   element: 'nature', baseDuration: 6000, effect: { regenPerSec: 0.01 } },
  voided:      { id: 'voided',      name: 'Voided',      element: 'void',   baseDuration: 4000, effect: { dmgReceivedMult: 1.3 } },
  illuminated: { id: 'illuminated', name: 'Illuminated', element: 'light',  baseDuration: 5000, effect: { critBonus: 0.2 } },
  blind:       { id: 'blind',       name: 'Blind',       element: null,     baseDuration: 3000, effect: { accuracyMult: 0.5 } },
};

// Map element -> default aura
const ELEMENT_TO_AURA: Partial<Record<ElementId, AuraId>> = {
  fire: 'burning',
  water: 'wet',
  nature: 'overgrown',
  void: 'voided',
  light: 'illuminated',
};

// ─── Runtime Aura Instance ───────────────────────────────────

export interface AuraInstance {
  auraId: AuraId;
  element: ElementId | null;
  remaining: number; // ms
}

// ─── Reaction Result ─────────────────────────────────────────

export interface ReactionResult {
  reactionId: ReactionId;
  name: string;
  damage: number;
  healing: number;
  buffs: { stat: string; value: number; duration: number }[];
  debuffs: { stat: string; value: number; duration: number }[];
}

// ─── Reaction History Entry ──────────────────────────────────

export interface ReactionHistoryEntry {
  reactionId: ReactionId;
  timestamp: number;
}

// ─── System ──────────────────────────────────────────────────

export class ElementalSystem {
  /** Runtime-only aura state, keyed by target id. */
  private activeAuras: Map<string, AuraInstance[]> = new Map();

  /** Persisted history of reactions triggered (capped at 100). */
  private reactionHistory: ReactionHistoryEntry[] = [];

  // ── Element Multiplier ────────────────────────────────────

  /** Returns the type-advantage multiplier for an attack. */
  getElementalMultiplier(attackElement: ElementId, defenseElement: ElementId): number {
    if (attackElement === defenseElement) return 1.0;
    const attackDef = ELEMENTS[attackElement];
    if (attackDef.strong === defenseElement) return STRENGTH_MULT;
    if (attackDef.weak === defenseElement) return WEAKNESS_MULT;
    return 1.0;
  }

  // ── Auras ─────────────────────────────────────────────────

  /**
   * Apply an elemental aura to a target. If a second element is already
   * present that would form a reaction, the reaction triggers and both
   * auras are consumed.
   */
  applyAura(targetId: string, elementId: ElementId): ReactionResult | null {
    const auraId = ELEMENT_TO_AURA[elementId];
    if (!auraId) return null;

    const auraDef = ELEMENT_AURAS[auraId];
    const instance: AuraInstance = {
      auraId,
      element: elementId,
      remaining: auraDef.baseDuration,
    };

    if (!this.activeAuras.has(targetId)) {
      this.activeAuras.set(targetId, []);
    }

    const auras = this.activeAuras.get(targetId)!;
    auras.push(instance);

    // Check for reactions between any two different-element auras
    return this.checkReactions(targetId);
  }

  /** Apply a non-elemental aura (e.g. blind) directly. */
  applyRawAura(targetId: string, auraId: AuraId, durationMs?: number): void {
    const def = ELEMENT_AURAS[auraId];
    const instance: AuraInstance = {
      auraId,
      element: def.element,
      remaining: durationMs ?? def.baseDuration,
    };

    if (!this.activeAuras.has(targetId)) {
      this.activeAuras.set(targetId, []);
    }
    this.activeAuras.get(targetId)!.push(instance);
  }

  /**
   * Check if any two auras on the target form a reaction.
   * If so, consume both and return the result.
   */
  checkReactions(targetId: string): ReactionResult | null {
    const auras = this.activeAuras.get(targetId);
    if (!auras || auras.length < 2) return null;

    // Collect unique elements
    const elementAuras: { element: ElementId; index: number }[] = [];
    for (let i = 0; i < auras.length; i++) {
      if (auras[i].element) {
        elementAuras.push({ element: auras[i].element!, index: i });
      }
    }

    // Check every pair
    for (let i = 0; i < elementAuras.length; i++) {
      for (let j = i + 1; j < elementAuras.length; j++) {
        const a = elementAuras[i];
        const b = elementAuras[j];
        if (a.element === b.element) continue;

        const key = [a.element, b.element].sort().join('+');
        const reactionId = REACTION_LOOKUP.get(key);
        if (!reactionId) continue;

        // Consume both auras (remove higher index first to keep indices valid)
        const indicesToRemove = [a.index, b.index].sort((x, y) => y - x);
        for (const idx of indicesToRemove) {
          auras.splice(idx, 1);
        }

        // Record in history
        this.reactionHistory.push({ reactionId, timestamp: Date.now() });
        if (this.reactionHistory.length > 100) {
          this.reactionHistory.shift();
        }

        // Return result placeholder (caller provides context)
        return this.buildReactionResult(reactionId);
      }
    }

    return null;
  }

  /**
   * Process a reaction effect given combat context.
   * Caller should use this after checkReactions for damage/heal numbers.
   */
  processReactionEffect(
    reactionId: ReactionId,
    context: { baseDamage: number; maxHp: number; buffCount?: number },
  ): ReactionResult {
    const def = ELEMENTAL_REACTIONS[reactionId];
    let damage = 0;
    let healing = 0;
    const buffs: { stat: string; value: number; duration: number }[] = [];
    const debuffs: { stat: string; value: number; duration: number }[] = [];

    // Damage multiplier
    if (def.damageMultiplier > 0) {
      damage = context.baseDamage * def.damageMultiplier;
    }

    const sp = def.special;

    // DoT
    if (sp.dot) {
      const totalDot = context.maxHp * (sp.dotPercent as number) * ((sp.dotDuration as number) / 1000);
      damage += totalDot;
    }

    // HoT
    if (sp.hot) {
      healing = context.maxHp * (sp.hotPercent as number) * ((sp.hotDuration as number) / 1000);
    }

    // Heal percent
    if (typeof sp.healPercent === 'number') {
      healing += context.maxHp * sp.healPercent;
    }

    // Damage per buff (corruption)
    if (typeof sp.damagePerBuff === 'number') {
      const buffCount = context.buffCount ?? 0;
      damage += context.baseDamage * sp.damagePerBuff * buffCount;
    }

    // Buffs
    if (typeof sp.atkBuff === 'number') {
      buffs.push({ stat: 'attack', value: sp.atkBuff as number, duration: sp.buffDuration as number });
    }
    if (typeof sp.defBuff === 'number') {
      buffs.push({ stat: 'defense', value: sp.defBuff as number, duration: sp.buffDuration as number });
    }

    // Debuffs
    if (sp.applyDebuff === 'blind') {
      debuffs.push({ stat: 'accuracy', value: 0.5, duration: sp.debuffDuration as number });
    }

    return { reactionId, name: def.name, damage, healing, buffs, debuffs };
  }

  // ── Aura Ticking ──────────────────────────────────────────

  /** Tick all aura durations. Remove expired ones. */
  updateAuras(deltaMs: number): void {
    const toDelete: string[] = [];

    this.activeAuras.forEach((auras, targetId) => {
      for (let i = auras.length - 1; i >= 0; i--) {
        auras[i].remaining -= deltaMs;
        if (auras[i].remaining <= 0) {
          auras.splice(i, 1);
        }
      }
      if (auras.length === 0) {
        toDelete.push(targetId);
      }
    });

    for (const id of toDelete) {
      this.activeAuras.delete(id);
    }
  }

  /** Remove all auras from a target (e.g. combat end). */
  clearAuras(targetId: string): void {
    this.activeAuras.delete(targetId);
  }

  /** Remove all auras from all targets. */
  clearAllAuras(): void {
    this.activeAuras.clear();
  }

  // ── Queries ───────────────────────────────────────────────

  getAuras(targetId: string): readonly AuraInstance[] {
    return this.activeAuras.get(targetId) ?? [];
  }

  hasAura(targetId: string, auraId: AuraId): boolean {
    const auras = this.activeAuras.get(targetId);
    return auras ? auras.some(a => a.auraId === auraId) : false;
  }

  getReactionHistory(): readonly ReactionHistoryEntry[] {
    return this.reactionHistory;
  }

  // ── Internals ─────────────────────────────────────────────

  private buildReactionResult(reactionId: ReactionId): ReactionResult {
    const def = ELEMENTAL_REACTIONS[reactionId];
    return {
      reactionId,
      name: def.name,
      damage: 0,
      healing: 0,
      buffs: [],
      debuffs: [],
    };
  }

  // ── Serialization ─────────────────────────────────────────
  // Only reaction history is persisted. Auras are runtime-only.

  serialize(): Record<string, unknown> {
    return {
      reactionHistory: this.reactionHistory,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (Array.isArray(data.reactionHistory)) {
      this.reactionHistory = (data.reactionHistory as ReactionHistoryEntry[]).slice(-100);
    }
  }
}
