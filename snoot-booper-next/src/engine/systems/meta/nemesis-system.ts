// NemesisSystem - Persistent enemies born from dungeon deaths

// ─── Types ──────────────────────────────────────────────────

export interface NemesisAbility {
  id: string;
  name: string;
  emoji: string;
  description: string;
  effect: Record<string, number>;
}

export interface Nemesis {
  id: string;
  baseEnemyId: string;
  baseEnemyName: string;
  emoji: string;
  name: string;
  level: number;
  kills: string[];
  abilities: string[];
  hpMultiplier: number;
  damageMultiplier: number;
  grudgeTarget: string | null;  // cat name the nemesis hates most
}

export interface NemesisComputedStats {
  hp: number;
  damage: number;
  defense: number;
  abilities: NemesisAbility[];
}

export interface NemesisDefeatReward {
  bp: number;
  nemesisTokens: number;
  level: number;
  name: string;
}

export interface NemesisStats {
  totalNemesesCreated: number;
  totalNemesesDefeated: number;
  totalNemesesDefected: number;
  highestNemesisLevel: number;
  totalKillsByNemeses: number;
  tokensEarned: number;
}

// ─── Data ───────────────────────────────────────────────────

export const NEMESIS_ABILITIES: Record<string, NemesisAbility> = {
  enrage: {
    id: 'enrage',
    name: 'Enrage',
    emoji: '\uD83D\uDD25',
    description: 'Deals 1.5x damage for 3 turns when below 50% HP',
    effect: { damageMult: 1.5, duration: 3 },
  },
  regen: {
    id: 'regen',
    name: 'Regeneration',
    emoji: '\uD83D\uDC9A',
    description: 'Heals 5% of max HP each turn',
    effect: { healPercent: 0.05 },
  },
  armor: {
    id: 'armor',
    name: 'Hardened Armor',
    emoji: '\uD83D\uDEE1\uFE0F',
    description: 'Reduces all incoming damage by 20%',
    effect: { dmgReduction: 0.2 },
  },
  thorns: {
    id: 'thorns',
    name: 'Thorns',
    emoji: '\uD83C\uDF35',
    description: 'Reflects 10% of damage taken back to the attacker',
    effect: { reflect: 0.1 },
  },
  summon: {
    id: 'summon',
    name: 'Summon Minions',
    emoji: '\uD83D\uDC7E',
    description: 'Summons 2 lesser minions at the start of combat',
    effect: { count: 2 },
  },
  execute: {
    id: 'execute',
    name: 'Execute',
    emoji: '\uD83D\uDDE1\uFE0F',
    description: 'Instantly kills targets below 20% HP',
    effect: { threshold: 0.2 },
  },
  lifesteal: {
    id: 'lifesteal',
    name: 'Lifesteal',
    emoji: '\uD83E\uDE78',
    description: 'Heals for 15% of damage dealt',
    effect: { lifesteal: 0.15 },
  },
  fear: {
    id: 'fear',
    name: 'Dreadful Presence',
    emoji: '\uD83D\uDC80',
    description: 'Reduces all enemy attack by 20%',
    effect: { atkReduction: 0.2 },
  },
};

const ABILITY_IDS = Object.keys(NEMESIS_ABILITIES);
const MAX_ABILITIES = 4;
const MAX_DEFEATED_HISTORY = 20;
const DEFECTION_MIN_LEVEL = 4;
const DEFECTION_CHANCE = 0.05;

// ─── Name Generation ────────────────────────────────────────

const NEMESIS_TITLES: string[] = [
  'the Relentless', 'the Wrathful', 'the Undying', 'the Cruel',
  'the Merciless', 'the Vengeful', 'of a Thousand Cuts', 'the Insatiable',
  'Bane of Snoots', 'the Devourer', 'Shadow-born', 'the Nemesis',
  'Doom-bringer', 'the Scourge', 'Cat-slayer', 'the Unstoppable',
];

function generateNemesisName(baseEnemyName: string): string {
  const title = NEMESIS_TITLES[Math.floor(Math.random() * NEMESIS_TITLES.length)];
  return `${baseEnemyName} ${title}`;
}

// ─── Serialization ──────────────────────────────────────────

export interface NemesisSystemSave {
  nemeses: Nemesis[];
  defeatedNemeses: Nemesis[];
  defectedNemeses: Nemesis[];
  stats: NemesisStats;
}

// ─── NemesisSystem Class ────────────────────────────────────

export class NemesisSystem {
  nemeses: Nemesis[] = [];
  defeatedNemeses: Nemesis[] = [];
  defectedNemeses: Nemesis[] = [];

  stats: NemesisStats = {
    totalNemesesCreated: 0,
    totalNemesesDefeated: 0,
    totalNemesesDefected: 0,
    highestNemesisLevel: 0,
    totalKillsByNemeses: 0,
    tokensEarned: 0,
  };

  // ── Creation ──────────────────────────────────────────────

  createNemesis(enemyId: string, enemyName: string, emoji: string, killedCatName: string): Nemesis {
    const nemesis: Nemesis = {
      id: `nemesis_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      baseEnemyId: enemyId,
      baseEnemyName: enemyName,
      emoji,
      name: generateNemesisName(enemyName),
      level: 1,
      kills: [killedCatName],
      abilities: [this.rollRandomAbility([])],
      hpMultiplier: 1.5,
      damageMultiplier: 1.3,
      grudgeTarget: killedCatName,
    };

    this.nemeses.push(nemesis);
    this.stats.totalNemesesCreated++;
    this.stats.totalKillsByNemeses++;
    this.updateHighestLevel(nemesis.level);

    return nemesis;
  }

  // ── Level Up ──────────────────────────────────────────────

  levelUpNemesis(nemesisId: string, killedCatName: string): Nemesis | null {
    const nemesis = this.nemeses.find(n => n.id === nemesisId);
    if (!nemesis) return null;

    nemesis.level++;
    nemesis.kills.push(killedCatName);
    nemesis.grudgeTarget = killedCatName;

    // HP scales: 1 + level * 0.5
    nemesis.hpMultiplier = 1 + nemesis.level * 0.5;
    // Damage scales: 1 + level * 0.25
    nemesis.damageMultiplier = 1 + nemesis.level * 0.25;

    // New ability every 2 levels, max 4
    if (nemesis.level % 2 === 0 && nemesis.abilities.length < MAX_ABILITIES) {
      const newAbility = this.rollRandomAbility(nemesis.abilities);
      nemesis.abilities.push(newAbility);
    }

    this.stats.totalKillsByNemeses++;
    this.updateHighestLevel(nemesis.level);

    return nemesis;
  }

  // ── Stat Computation ──────────────────────────────────────

  getNemesisStats(nemesis: Nemesis, baseHp: number, baseDmg: number, baseDef: number): NemesisComputedStats {
    const abilities = nemesis.abilities
      .map(id => NEMESIS_ABILITIES[id])
      .filter((a): a is NemesisAbility => !!a);

    let hp = baseHp * nemesis.hpMultiplier;
    let damage = baseDmg * nemesis.damageMultiplier;
    let defense = baseDef * (1 + nemesis.level * 0.1);

    // Apply armor ability to defense
    const hasArmor = abilities.find(a => a.id === 'armor');
    if (hasArmor) {
      defense *= 1 + (hasArmor.effect.dmgReduction ?? 0);
    }

    return {
      hp: Math.floor(hp),
      damage: Math.floor(damage),
      defense: Math.floor(defense),
      abilities,
    };
  }

  // ── Defeat ────────────────────────────────────────────────

  onNemesisDefeated(nemesisId: string): NemesisDefeatReward | null {
    const index = this.nemeses.findIndex(n => n.id === nemesisId);
    if (index === -1) return null;

    const nemesis = this.nemeses.splice(index, 1)[0];

    // Add to defeated history (capped)
    this.defeatedNemeses.push(nemesis);
    if (this.defeatedNemeses.length > MAX_DEFEATED_HISTORY) {
      this.defeatedNemeses.shift();
    }

    // Compute rewards: bp = 1000 * 2^(level-1), tokens = 10 * level
    const bp = 1000 * Math.pow(2, nemesis.level - 1);
    const tokens = 10 * nemesis.level;

    this.stats.totalNemesesDefeated++;
    this.stats.tokensEarned += tokens;

    return {
      bp,
      nemesisTokens: tokens,
      level: nemesis.level,
      name: nemesis.name,
    };
  }

  // ── Defection ─────────────────────────────────────────────

  checkDefection(nemesisId: string): boolean {
    const nemesis = this.nemeses.find(n => n.id === nemesisId);
    if (!nemesis) return false;

    // Must be level 4+ and 5% chance
    if (nemesis.level < DEFECTION_MIN_LEVEL) return false;
    return Math.random() < DEFECTION_CHANCE;
  }

  acceptDefection(nemesisId: string): Nemesis | null {
    const index = this.nemeses.findIndex(n => n.id === nemesisId);
    if (index === -1) return null;

    const nemesis = this.nemeses.splice(index, 1)[0];
    this.defectedNemeses.push(nemesis);
    this.stats.totalNemesesDefected++;

    return nemesis;
  }

  // ── Dungeon Appearance ────────────────────────────────────

  shouldNemesisAppear(floor: number): boolean {
    if (this.nemeses.length === 0) return false;
    const chance = 0.1 + floor * 0.005;
    return Math.random() < Math.min(chance, 0.8);  // cap at 80%
  }

  getRandomNemesis(): Nemesis | null {
    if (this.nemeses.length === 0) return null;
    return this.nemeses[Math.floor(Math.random() * this.nemeses.length)];
  }

  getNemesisById(id: string): Nemesis | null {
    return this.nemeses.find(n => n.id === id) ?? null;
  }

  // ── Helpers ───────────────────────────────────────────────

  private rollRandomAbility(existing: string[]): string {
    const available = ABILITY_IDS.filter(id => !existing.includes(id));
    if (available.length === 0) {
      // All abilities taken, pick random anyway (shouldn't happen with max 4)
      return ABILITY_IDS[Math.floor(Math.random() * ABILITY_IDS.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  private updateHighestLevel(level: number): void {
    if (level > this.stats.highestNemesisLevel) {
      this.stats.highestNemesisLevel = level;
    }
  }

  // ── Serialization ─────────────────────────────────────────

  serialize(): NemesisSystemSave {
    return {
      nemeses: this.nemeses.map(n => ({ ...n, kills: [...n.kills], abilities: [...n.abilities] })),
      defeatedNemeses: this.defeatedNemeses.map(n => ({ ...n, kills: [...n.kills], abilities: [...n.abilities] })),
      defectedNemeses: this.defectedNemeses.map(n => ({ ...n, kills: [...n.kills], abilities: [...n.abilities] })),
      stats: { ...this.stats },
    };
  }

  deserialize(data: NemesisSystemSave): void {
    this.nemeses = (data.nemeses ?? []).map(n => ({
      ...n,
      kills: [...(n.kills ?? [])],
      abilities: [...(n.abilities ?? [])],
    }));
    this.defeatedNemeses = (data.defeatedNemeses ?? []).map(n => ({
      ...n,
      kills: [...(n.kills ?? [])],
      abilities: [...(n.abilities ?? [])],
    }));
    this.defectedNemeses = (data.defectedNemeses ?? []).map(n => ({
      ...n,
      kills: [...(n.kills ?? [])],
      abilities: [...(n.abilities ?? [])],
    }));
    this.stats = {
      totalNemesesCreated: data.stats?.totalNemesesCreated ?? 0,
      totalNemesesDefeated: data.stats?.totalNemesesDefeated ?? 0,
      totalNemesesDefected: data.stats?.totalNemesesDefected ?? 0,
      highestNemesisLevel: data.stats?.highestNemesisLevel ?? 0,
      totalKillsByNemeses: data.stats?.totalKillsByNemeses ?? 0,
      tokensEarned: data.stats?.tokensEarned ?? 0,
    };
  }
}
