/**
 * GooseSystem - Goose spawning, combat, allies, rewards
 * Ported from js/goose.js (715 lines)
 */

import type { GooseMood, GooseAllyType, GameModifiers } from '../../types';

// ─── Data ────────────────────────────────────────────────────

export interface GooseMoodData {
  id: GooseMood;
  speed: number;
  dodgeChance: number;
  rewardMult: number;
  color: string;
}

export const GOOSE_MOODS: Record<GooseMood, GooseMoodData> = {
  calm: { id: 'calm', speed: 1, dodgeChance: 0.10, rewardMult: 10, color: '#87CEEB' },
  suspicious: { id: 'suspicious', speed: 2, dodgeChance: 0.30, rewardMult: 25, color: '#FFD700' },
  aggressive: { id: 'aggressive', speed: 3, dodgeChance: 0.50, rewardMult: 50, color: '#FF6347' },
  rage: { id: 'rage', speed: 5, dodgeChance: 0.70, rewardMult: 100, color: '#FF0000' },
};

export interface LegendaryGooseTemplate {
  id: string;
  name: string;
  title: string;
  baseMood: GooseMood;
  hp: number;
  special: string;
  rewardMultiplier: number;
  rarity: number;
}

export const LEGENDARY_GEESE: Record<string, LegendaryGooseTemplate> = {
  untitled: { id: 'untitled', name: 'The Untitled Goose', title: 'Horrible', baseMood: 'aggressive', hp: 1, special: 'steals_items', rewardMultiplier: 1, rarity: 0.15 },
  elder: { id: 'elder', name: 'Goose Elder', title: 'The Honking Sage', baseMood: 'calm', hp: 3, special: 'wisdom_test', rewardMultiplier: 2, rarity: 0.10 },
  golden: { id: 'golden', name: 'The Golden Goose', title: 'Fortune Incarnate', baseMood: 'suspicious', hp: 1, special: 'extreme_speed', rewardMultiplier: 1, rarity: 0.05 },
  cobraChicken: { id: 'cobraChicken', name: 'Cobra Chicken', title: 'Avatar of Chaos', baseMood: 'rage', hp: 10, special: 'final_boss', rewardMultiplier: 1, rarity: 0 },
};

export interface GooseAllyData {
  id: GooseAllyType;
  name: string;
  description: string;
  effect: Record<string, number | boolean>;
  quote: string;
}

export const GOOSE_ALLIES: Record<GooseAllyType, GooseAllyData> = {
  guard: { id: 'guard', name: 'Guard Goose', description: 'Protects AFK gains from theft', effect: { preventTheft: true }, quote: 'HONK! None shall pass!' },
  attack: { id: 'attack', name: 'Attack Goose', description: '+25% boop damage', effect: { boopDamageBonus: 1.25 }, quote: 'HONK! Violence is always the answer.' },
  chaos: { id: 'chaos', name: 'Chaos Goose', description: '2x event frequency', effect: { eventFrequencyMult: 2.0 }, quote: 'HONK! Let\'s make things interesting.' },
  honk: { id: 'honk', name: 'Honk Goose', description: '+25% PP generation', effect: { ppGenerationBonus: 1.25 }, quote: 'HONK! WORK HARDER, FELINES.' },
};

// ─── Active Goose Instance ───────────────────────────────────

export interface ActiveGoose {
  id: string;
  name: string;
  title: string;
  mood: GooseMood;
  currentHp: number;
  maxHp: number;
  special: string;
  rewardMultiplier: number;
  isLegendary: boolean;
  position: { x: number; y: number };
  timeRemaining: number;  // ms
}

export interface GooseBoopResult {
  hit: boolean;
  dodged: boolean;
  defeated: boolean;
  critical: boolean;
  damage: number;
  hpRemaining: number;
  rewards?: { bp: number; feathers: number; goldenFeathers: number; jadeCatnip: number };
  message: string;
}

// ─── GooseSystem Class ──────────────────────────────────────

export class GooseSystem {
  activeGoose: ActiveGoose | null = null;

  // Stats
  gooseBoops = 0;
  goldenGooseBoops = 0;
  cobraChickenDefeated = false;
  gooseAllyUnlocked = false;
  selectedAlly: GooseAllyType | null = null;
  rageGooseBooped = false;
  goldenGooseCrit = false;

  // Config
  private spawnChance = 0.15;
  private timeLimit = 30000;  // 30s

  // ── Spawning ───────────────────────────────────────────────

  checkForSpawn(modifiers: Partial<GameModifiers>): ActiveGoose | null {
    if (this.activeGoose) return null;

    let chance = this.spawnChance;
    // Chaos goose doubles spawn chance
    if (this.selectedAlly === 'chaos') chance *= 2;
    if (modifiers.gooseSpawnBonus) chance *= (1 + modifiers.gooseSpawnBonus);

    if (Math.random() >= chance) return null;

    return this.spawnGoose();
  }

  forceSpawnGoose(): ActiveGoose {
    if (this.activeGoose) return this.activeGoose;
    return this.spawnGoose();
  }

  private spawnGoose(): ActiveGoose {
    const type = this.selectGooseType();
    const mood = type.baseMood ?? this.rollMood();

    this.activeGoose = {
      id: type.id ?? `normal_${Date.now()}`,
      name: type.name ?? 'Wild Goose',
      title: type.title ?? 'Wandering Terror',
      mood,
      currentHp: type.hp ?? 1,
      maxHp: type.hp ?? 1,
      special: type.special ?? '',
      rewardMultiplier: type.rewardMultiplier ?? 1,
      isLegendary: !!type.id,
      position: { x: 10 + Math.random() * 80, y: 10 + Math.random() * 70 },
      timeRemaining: this.timeLimit,
    };

    return this.activeGoose;
  }

  private selectGooseType(): Partial<LegendaryGooseTemplate> {
    // Cobra Chicken check
    if (this.gooseBoops >= 1000 && !this.cobraChickenDefeated && Math.random() < 0.10) {
      return LEGENDARY_GEESE.cobraChicken;
    }

    // Legendary roll
    const roll = Math.random();
    let cumulative = 0;
    for (const goose of Object.values(LEGENDARY_GEESE)) {
      if (goose.id === 'cobraChicken') continue;
      cumulative += goose.rarity;
      if (roll < cumulative) return goose;
    }

    // Normal goose
    return { baseMood: this.rollMood() as GooseMood };
  }

  private rollMood(): GooseMood {
    const roll = Math.random();
    if (roll < 0.40) return 'calm';
    if (roll < 0.70) return 'suspicious';
    if (roll < 0.95) return 'aggressive';
    return 'rage';
  }

  // ── Combat ─────────────────────────────────────────────────

  attemptBoop(critChance: number): GooseBoopResult {
    if (!this.activeGoose) {
      return { hit: false, dodged: false, defeated: false, critical: false, damage: 0, hpRemaining: 0, message: 'No goose!' };
    }

    const goose = this.activeGoose;
    const moodData = GOOSE_MOODS[goose.mood];

    // Dodge check
    if (Math.random() < moodData.dodgeChance) {
      goose.position = { x: 10 + Math.random() * 80, y: 10 + Math.random() * 70 };
      return { hit: false, dodged: true, defeated: false, critical: false, damage: 0, hpRemaining: goose.currentHp, message: 'Dodged! HONK!' };
    }

    // Hit
    const isCrit = Math.random() < critChance;
    let damage = 1;
    if (isCrit && goose.currentHp > 1) damage = 2;

    goose.currentHp -= damage;

    if (goose.currentHp <= 0) {
      return this.gooseDefeated(isCrit);
    }

    return { hit: true, dodged: false, defeated: false, critical: isCrit, damage, hpRemaining: goose.currentHp, message: isCrit ? 'CRITICAL HIT!' : 'Hit!' };
  }

  private gooseDefeated(isCrit: boolean): GooseBoopResult {
    const goose = this.activeGoose!;
    const moodData = GOOSE_MOODS[goose.mood];

    // Calculate rewards
    const baseBP = 1000;
    let bpReward = baseBP * moodData.rewardMult * goose.rewardMultiplier;
    if (isCrit) bpReward *= 3;
    if (this.selectedAlly === 'attack') bpReward *= 1.25;

    const feathers = 1;
    let goldenFeathers = 0;
    let jadeCatnip = 0;

    // Special handling
    if (goose.id === 'golden') {
      goldenFeathers = 1;
      jadeCatnip = 1;
      this.goldenGooseBoops++;
      if (isCrit) this.goldenGooseCrit = true;
    }

    if (goose.id === 'cobraChicken') {
      this.cobraChickenDefeated = true;
      this.gooseAllyUnlocked = true;
    }

    if (goose.mood === 'rage') {
      this.rageGooseBooped = true;
    }

    this.gooseBoops++;
    this.activeGoose = null;

    const message = isCrit ? 'CRITICAL HONK DESTRUCTION!' : `${goose.name} defeated!`;

    return {
      hit: true, dodged: false, defeated: true, critical: isCrit, damage: 1, hpRemaining: 0,
      rewards: { bp: bpReward, feathers, goldenFeathers, jadeCatnip },
      message,
    };
  }

  // ── Escape ─────────────────────────────────────────────────

  gooseEscapes(): { stolenBp: number } {
    const goose = this.activeGoose;
    let stolenBp = 0;

    if (goose?.special === 'steals_items') {
      // Guard goose prevents theft
      if (this.selectedAlly !== 'guard') {
        stolenBp = -1; // Signal to caller to steal 10% of BP
      }
    }

    this.activeGoose = null;
    return { stolenBp };
  }

  // ── Tick ───────────────────────────────────────────────────

  update(deltaMs: number): { escaped: boolean } {
    if (!this.activeGoose) return { escaped: false };

    this.activeGoose.timeRemaining -= deltaMs;

    // Random movement
    const moodData = GOOSE_MOODS[this.activeGoose.mood];
    if (Math.random() < moodData.speed * 0.03) {
      this.activeGoose.position = { x: 10 + Math.random() * 80, y: 10 + Math.random() * 70 };
    }

    if (this.activeGoose.timeRemaining <= 0) {
      this.gooseEscapes();
      return { escaped: true };
    }

    return { escaped: false };
  }

  // ── Ally ───────────────────────────────────────────────────

  selectAlly(allyId: GooseAllyType): boolean {
    if (!this.gooseAllyUnlocked) return false;
    this.selectedAlly = allyId;
    return true;
  }

  getAllyEffects(): Record<string, number | boolean> {
    if (!this.selectedAlly) return {};
    return GOOSE_ALLIES[this.selectedAlly]?.effect ?? {};
  }

  // ── Serialization ──────────────────────────────────────────

  serialize() {
    return {
      gooseBoops: this.gooseBoops,
      goldenGooseBoops: this.goldenGooseBoops,
      cobraChickenDefeated: this.cobraChickenDefeated,
      gooseAllyUnlocked: this.gooseAllyUnlocked,
      selectedAlly: this.selectedAlly,
      rageGooseBooped: this.rageGooseBooped,
      goldenGooseCrit: this.goldenGooseCrit,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    this.gooseBoops = (data.gooseBoops as number) ?? 0;
    this.goldenGooseBoops = (data.goldenGooseBoops as number) ?? 0;
    this.cobraChickenDefeated = (data.cobraChickenDefeated as boolean) ?? false;
    this.gooseAllyUnlocked = (data.gooseAllyUnlocked as boolean) ?? false;
    this.selectedAlly = (data.selectedAlly as GooseAllyType) ?? null;
    this.rageGooseBooped = (data.rageGooseBooped as boolean) ?? false;
    this.goldenGooseCrit = (data.goldenGooseCrit as boolean) ?? false;
  }
}
