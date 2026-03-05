/**
 * TechniqueSystem - Stances, techniques, skills, passives, legendary internals
 * Ported from js/techniques.js (~1,836 lines)
 */

// ─── Stance Data ────────────────────────────────────────────

export interface StanceData {
  id: string;
  name: string;
  description: string;
  unlockRealm: string;
  color: string;
  stats: {
    boopPower: number;
    boopSpeed: number;
    critChance: number;
    critMultiplier: number;
    comboDecay: number;
  };
  special: {
    name: string;
    description: string;
    trigger: { type: string; value: number };
    effect: Record<string, number | boolean>;
  };
  mastery: { maxLevel: number; xpPerBoop: number; bonusPerLevel: number };
}

export const STANCES: Record<string, StanceData> = {
  jadePalm: {
    id: 'jadePalm', name: 'Jade Palm', description: 'Balanced starter stance',
    unlockRealm: 'mortal', color: '#50C878',
    stats: { boopPower: 1, boopSpeed: 1, critChance: 0.05, critMultiplier: 10, comboDecay: 1 },
    special: { name: 'Balanced Strike', description: 'Steady and reliable', trigger: { type: 'always', value: 0 }, effect: {} },
    mastery: { maxLevel: 10, xpPerBoop: 1, bonusPerLevel: 0.05 },
  },
  ironFinger: {
    id: 'ironFinger', name: 'Iron Finger', description: 'Slow but devastating hits',
    unlockRealm: 'qi_condensation', color: '#8B4513',
    stats: { boopPower: 3, boopSpeed: 0.5, critChance: 0.15, critMultiplier: 15, comboDecay: 1.5 },
    special: { name: 'Mountain Crusher', description: 'Every 10th boop deals 10x damage', trigger: { type: 'everyNBoops', value: 10 }, effect: { damageMult: 10 } },
    mastery: { maxLevel: 10, xpPerBoop: 1.5, bonusPerLevel: 0.08 },
  },
  drunkenPaw: {
    id: 'drunkenPaw', name: 'Drunken Paw', description: 'Chaotic and unpredictable',
    unlockRealm: 'foundation', color: '#DC143C',
    stats: { boopPower: 2.5, boopSpeed: 1.2, critChance: 0.25, critMultiplier: 12, comboDecay: 0.8 },
    special: { name: 'Lucky Stumble', description: '5% chance for 100x damage', trigger: { type: 'chance', value: 0.05 }, effect: { damageMult: 100 } },
    mastery: { maxLevel: 10, xpPerBoop: 1.2, bonusPerLevel: 0.06 },
  },
  shadowStep: {
    id: 'shadowStep', name: 'Shadow Step', description: 'Speed-based combo stance',
    unlockRealm: 'core_formation', color: '#483D8B',
    stats: { boopPower: 0.3, boopSpeed: 2, critChance: 0.1, critMultiplier: 8, comboDecay: 0.5 },
    special: { name: 'Shadow Burst', description: 'After 20 combo, burst damage', trigger: { type: 'afterCombo', value: 20 }, effect: { damageMult: 5 } },
    mastery: { maxLevel: 10, xpPerBoop: 2, bonusPerLevel: 0.04 },
  },
  flowingRiver: {
    id: 'flowingRiver', name: 'Flowing River', description: 'Steady sustained power',
    unlockRealm: 'nascent_soul', color: '#4169E1',
    stats: { boopPower: 1.5, boopSpeed: 0.8, critChance: 0.08, critMultiplier: 12, comboDecay: 0.3 },
    special: { name: 'Eternal Flow', description: 'Combo never resets below 10%', trigger: { type: 'always', value: 0 }, effect: { minComboPercent: 0.1 } },
    mastery: { maxLevel: 10, xpPerBoop: 1, bonusPerLevel: 0.07 },
  },
  forbiddenTechnique: {
    id: 'forbiddenTechnique', name: 'Forbidden Technique', description: 'Ultimate power at great cost',
    unlockRealm: 'dao_seeking', color: '#FF0000',
    stats: { boopPower: 10, boopSpeed: 3, critChance: 0.5, critMultiplier: 50, comboDecay: 2 },
    special: { name: 'Annihilation', description: 'Costs 5 Qi per boop, AOE damage', trigger: { type: 'always', value: 0 }, effect: { qiCost: 5, aoeDamage: true } },
    mastery: { maxLevel: 10, xpPerBoop: 3, bonusPerLevel: 0.1 },
  },
};

// ─── Hidden Skills ──────────────────────────────────────────

export interface HiddenSkill {
  id: string;
  name: string;
  description: string;
  discoveryCondition: { type: string; value: number | string | boolean };
  effect: Record<string, number | boolean>;
}

export const HIDDEN_SKILLS: HiddenSkill[] = [
  { id: 'thousand_paw', name: 'Thousand Paw Strike', description: 'Boops hit 3 times', discoveryCondition: { type: 'maxCombo', value: 100 }, effect: { multiHit: 3 } },
  { id: 'critical_meridian', name: 'Critical Meridian', description: '+10% crit chance', discoveryCondition: { type: 'criticalBoops', value: 500 }, effect: { critChance: 0.1 } },
  { id: 'eternal_meditation', name: 'Eternal Flow Meditation', description: '+100% AFK gains', discoveryCondition: { type: 'totalAfkHours', value: 48 }, effect: { afkMult: 2.0 } },
  { id: 'golden_core', name: 'Golden Core', description: '+50% PP generation', discoveryCondition: { type: 'totalPP', value: 1000000 }, effect: { ppMult: 1.5 } },
  { id: 'cat_whisperer', name: "Cat Whisperer's Gift", description: 'Cats gain +25% happiness', discoveryCondition: { type: 'catCount', value: 30 }, effect: { catHappiness: 1.25 } },
  { id: 'bond_of_fate', name: 'Bond of Fate', description: '+25% waifu bond gain', discoveryCondition: { type: 'maxWaifuBond', value: 100 }, effect: { bondGain: 1.25 } },
  { id: 'way_of_goose', name: 'Way of the Goose', description: '2x goose rewards', discoveryCondition: { type: 'gooseBoops', value: 200 }, effect: { gooseRewardMult: 2.0 } },
  { id: 'embrace_chaos', name: 'Embrace of Chaos', description: 'Random 1-5x on all gains', discoveryCondition: { type: 'cobraChickenDefeated', value: true }, effect: { chaosMultiplier: true } },
];

// ─── TechniqueSystem Class ──────────────────────────────────

export class TechniqueSystem {
  learnedTechniques: string[] = [];
  learnedSkills: string[] = [];
  cultivationPassives: string[] = [];
  legendaryInternals: Record<string, { unlocked: boolean; stage: number; bpSacrificed: number }> = {};
  consumables: Record<string, number> = {};

  // Stance
  currentStance = 'jadePalm';
  stanceMastery: Record<string, number> = { jadePalm: 1 };
  stanceMasteryXP: Record<string, number> = { jadePalm: 0 };
  unlockedStances: string[] = ['jadePalm'];
  unlockedFusions: string[] = [];

  // Buffs
  private activeBuffs: Array<{ stat: string; value: number; expiresAt: number }> = [];

  // ── Stance Management ─────────────────────────────────

  checkStanceUnlocks(currentRealm: string): string[] {
    const newUnlocks: string[] = [];
    const REALM_ORDER = ['mortal', 'qi_condensation', 'foundation', 'core_formation', 'nascent_soul', 'dao_seeking', 'tribulation', 'immortal', 'heavenly_sovereign'];
    const currentIdx = REALM_ORDER.indexOf(currentRealm);

    for (const [id, stance] of Object.entries(STANCES)) {
      if (this.unlockedStances.includes(id)) continue;
      const requiredIdx = REALM_ORDER.indexOf(stance.unlockRealm);
      if (currentIdx >= requiredIdx) {
        this.unlockedStances.push(id);
        newUnlocks.push(id);
      }
    }
    return newUnlocks;
  }

  switchStance(stanceId: string): boolean {
    if (!this.unlockedStances.includes(stanceId)) return false;
    this.currentStance = stanceId;
    return true;
  }

  getCurrentStance(): StanceData {
    return STANCES[this.currentStance];
  }

  getStanceBoopModifiers(): { boopPower: number; boopSpeed: number; critChance: number; critMultiplier: number } {
    const stance = STANCES[this.currentStance];
    const mastery = this.stanceMastery[this.currentStance] ?? 1;
    const bonus = stance.mastery.bonusPerLevel * (mastery - 1);

    return {
      boopPower: stance.stats.boopPower * (1 + bonus),
      boopSpeed: stance.stats.boopSpeed,
      critChance: stance.stats.critChance + bonus * 0.5,
      critMultiplier: stance.stats.critMultiplier * (1 + bonus * 0.3),
    };
  }

  gainStanceMasteryXP(amount: number): boolean {
    const stanceId = this.currentStance;
    const stance = STANCES[stanceId];
    const currentLevel = this.stanceMastery[stanceId] ?? 1;
    if (currentLevel >= stance.mastery.maxLevel) return false;

    this.stanceMasteryXP[stanceId] = (this.stanceMasteryXP[stanceId] ?? 0) + amount;
    const xpNeeded = Math.pow(currentLevel + 1, 2) * 100;

    if (this.stanceMasteryXP[stanceId] >= xpNeeded) {
      this.stanceMasteryXP[stanceId] -= xpNeeded;
      this.stanceMastery[stanceId] = currentLevel + 1;
      return true;
    }
    return false;
  }

  // ── Skill Discovery ───────────────────────────────────

  checkSkillDiscovery(gameState: Record<string, number | boolean>): HiddenSkill[] {
    const discovered: HiddenSkill[] = [];
    for (const skill of HIDDEN_SKILLS) {
      if (this.learnedSkills.includes(skill.id)) continue;
      const cond = skill.discoveryCondition;
      let met = false;

      if (typeof cond.value === 'boolean') {
        met = gameState[cond.type] === cond.value;
      } else if (typeof cond.value === 'number') {
        met = (gameState[cond.type] as number) >= cond.value;
      }

      if (met) {
        this.learnedSkills.push(skill.id);
        discovered.push(skill);
      }
    }
    return discovered;
  }

  // ── Combined Effects ──────────────────────────────────

  getCombinedEffects(): Record<string, number | boolean> {
    const effects: Record<string, number | boolean> = {};

    // Stance modifiers
    const stance = this.getStanceBoopModifiers();
    effects.stanceBoopPower = stance.boopPower;
    effects.stanceBoopSpeed = stance.boopSpeed;
    effects.stanceCritChance = stance.critChance;
    effects.stanceCritMultiplier = stance.critMultiplier;

    // Hidden skills
    for (const skillId of this.learnedSkills) {
      const skill = HIDDEN_SKILLS.find(s => s.id === skillId);
      if (!skill) continue;
      for (const [key, value] of Object.entries(skill.effect)) {
        if (typeof value === 'boolean') effects[key] = value;
        else effects[key] = ((effects[key] as number) ?? 1) * value;
      }
    }

    // Active buffs
    const now = Date.now();
    this.activeBuffs = this.activeBuffs.filter(b => b.expiresAt > now);
    for (const buff of this.activeBuffs) {
      effects[buff.stat] = ((effects[buff.stat] as number) ?? 1) * buff.value;
    }

    return effects;
  }

  addBuff(stat: string, value: number, durationMs: number): void {
    this.activeBuffs.push({ stat, value, expiresAt: Date.now() + durationMs });
  }

  // ── Consumables ───────────────────────────────────────

  addConsumable(itemId: string, quantity: number): void {
    this.consumables[itemId] = (this.consumables[itemId] ?? 0) + quantity;
  }

  getConsumableCount(itemId: string): number {
    return this.consumables[itemId] ?? 0;
  }

  useConsumable(itemId: string): boolean {
    if ((this.consumables[itemId] ?? 0) <= 0) return false;
    this.consumables[itemId]--;
    return true;
  }

  // ── Serialization ─────────────────────────────────────

  serialize() {
    return {
      learnedTechniques: [...this.learnedTechniques],
      learnedSkills: [...this.learnedSkills],
      cultivationPassives: [...this.cultivationPassives],
      legendaryInternals: { ...this.legendaryInternals },
      consumables: { ...this.consumables },
      currentStance: this.currentStance,
      stanceMastery: { ...this.stanceMastery },
      stanceMasteryXP: { ...this.stanceMasteryXP },
      unlockedStances: [...this.unlockedStances],
      unlockedFusions: [...this.unlockedFusions],
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.learnedTechniques) this.learnedTechniques = data.learnedTechniques as string[];
    if (data.learnedSkills) this.learnedSkills = data.learnedSkills as string[];
    if (data.cultivationPassives) this.cultivationPassives = data.cultivationPassives as string[];
    if (data.legendaryInternals) this.legendaryInternals = data.legendaryInternals as typeof this.legendaryInternals;
    if (data.consumables) this.consumables = data.consumables as Record<string, number>;
    if (data.currentStance) this.currentStance = data.currentStance as string;
    if (data.stanceMastery) this.stanceMastery = data.stanceMastery as Record<string, number>;
    if (data.stanceMasteryXP) this.stanceMasteryXP = data.stanceMasteryXP as Record<string, number>;
    if (data.unlockedStances) this.unlockedStances = data.unlockedStances as string[];
    if (data.unlockedFusions) this.unlockedFusions = data.unlockedFusions as string[];
  }
}
