// goose-dimension-system.ts - The Goose Dimension: a comedy dungeon with sanity mechanics
// "You don't enter the Goose Dimension. The Goose Dimension enters you."

// ---------------------------------------------------------------------------
// Data Constants
// ---------------------------------------------------------------------------

export type GooseEnemyTier = 'normal' | 'elite' | 'boss' | 'final';

export interface GooseDimensionEnemy {
  id: string;
  name: string;
  tier: GooseEnemyTier;
  baseHp: number;
  baseDamage: number;
  baseDefense: number;
  speed: number;
  honkValue: number;
  sanityDrain: number;
  bossFloor?: number;
  phases?: number;
}

export const GOOSE_DIMENSION_ENEMIES: GooseDimensionEnemy[] = [
  // Normal tier
  { id: 'goose', name: 'Goose', tier: 'normal', baseHp: 30, baseDamage: 8, baseDefense: 2, speed: 1.0, honkValue: 1, sanityDrain: 1 },
  { id: 'goose_with_knife', name: 'Goose With a Knife', tier: 'normal', baseHp: 25, baseDamage: 18, baseDefense: 0, speed: 1.3, honkValue: 2, sanityDrain: 3 },
  { id: 'goose_in_disguise', name: 'Goose in Disguise', tier: 'normal', baseHp: 40, baseDamage: 10, baseDefense: 5, speed: 0.8, honkValue: 3, sanityDrain: 5 },
  { id: 'bread_goose', name: 'Bread Goose', tier: 'normal', baseHp: 35, baseDamage: 12, baseDefense: 3, speed: 1.5, honkValue: 2, sanityDrain: 2 },

  // Elite tier
  { id: 'mecha_goose', name: 'Mecha-Goose', tier: 'elite', baseHp: 150, baseDamage: 25, baseDefense: 15, speed: 0.7, honkValue: 8, sanityDrain: 10 },
  { id: 'goose_hydra', name: 'Goose Hydra', tier: 'elite', baseHp: 200, baseDamage: 15, baseDefense: 8, speed: 0.5, honkValue: 10, sanityDrain: 15 },
  { id: 'stealth_goose', name: 'Stealth Goose', tier: 'elite', baseHp: 80, baseDamage: 35, baseDefense: 3, speed: 2.0, honkValue: 7, sanityDrain: 20 },
  { id: 'goose_scholar', name: 'Goose Scholar', tier: 'elite', baseHp: 120, baseDamage: 20, baseDefense: 10, speed: 0.6, honkValue: 12, sanityDrain: 25 },

  // Boss tier
  { id: 'the_original_goose', name: 'The Original Goose', tier: 'boss', baseHp: 500, baseDamage: 30, baseDefense: 10, speed: 1.0, honkValue: 50, sanityDrain: 30, bossFloor: 10, phases: 2 },
  { id: 'goose_king', name: 'The Goose King', tier: 'boss', baseHp: 1000, baseDamage: 45, baseDefense: 15, speed: 1.0, honkValue: 100, sanityDrain: 50, bossFloor: 20, phases: 3 },
  { id: 'cosmic_honk', name: 'The Cosmic Honk', tier: 'boss', baseHp: 2000, baseDamage: 60, baseDefense: 20, speed: 1.0, honkValue: 200, sanityDrain: 80, bossFloor: 30, phases: 4 },

  // Final boss
  { id: 'the_primordial_honk', name: 'The Primordial Honk', tier: 'final', baseHp: 10000, baseDamage: 100, baseDefense: 30, speed: 1.0, honkValue: 1000, sanityDrain: 100, bossFloor: 50, phases: 5 },
];

// ---------------------------------------------------------------------------
// Sanity thresholds
// ---------------------------------------------------------------------------

export interface SanityModifiers {
  dmgDealt: number;
  dmgTaken: number;
  defenseZero: boolean;
}

interface SanityThreshold {
  minSanity: number;
  dmgDealt: number;
  dmgTaken: number;
  label: string;
}

const SANITY_THRESHOLDS: SanityThreshold[] = [
  { minSanity: 75, dmgDealt: 1.0, dmgTaken: 1.0, label: 'Sane' },
  { minSanity: 50, dmgDealt: 1.15, dmgTaken: 1.1, label: 'Uneasy' },
  { minSanity: 25, dmgDealt: 1.3, dmgTaken: 1.25, label: 'Unhinged' },
  { minSanity: 1, dmgDealt: 1.5, dmgTaken: 1.5, label: 'Losing It' },
  { minSanity: 0, dmgDealt: 2.0, dmgTaken: 2.0, label: 'GOOSE MODE' },
];

// ---------------------------------------------------------------------------
// Dimension Jokes
// ---------------------------------------------------------------------------

export interface FourthWallBreak {
  trigger: string;
  chance: number;
  text: string;
  sanityDrain: number;
}

export const FOURTH_WALL_BREAKS: FourthWallBreak[] = [
  { trigger: 'floor_advance', chance: 0.08, text: 'The goose looks directly at you. Not your character. YOU.', sanityDrain: 5 },
  { trigger: 'enemy_defeat', chance: 0.05, text: 'A speech bubble appears: "You know this is all just JavaScript, right?"', sanityDrain: 3 },
  { trigger: 'take_damage', chance: 0.06, text: 'The damage number floats up and says "sorry" before disappearing.', sanityDrain: 4 },
  { trigger: 'honk_burst', chance: 0.10, text: 'Your honk echoes beyond the game window. Did... did your speakers just quack?', sanityDrain: 8 },
  { trigger: 'low_sanity', chance: 0.15, text: 'The game briefly shows you its own source code. There are too many goose references.', sanityDrain: 10 },
  { trigger: 'boss_encounter', chance: 0.12, text: 'The boss health bar starts loading its own health bar. It has a health bar for its health bar.', sanityDrain: 7 },
];

export const RANDOM_HONKS: string[] = [
  'HONK',
  'honk.',
  'H O N K',
  '*aggressive honking*',
  'honk? honk honk.',
  'HJÖNK HJÖNK',
  '...honk (but with feeling)',
  'honk honk honk honk honk honk honk',
  '*ominous distant honking*',
  'h o n k w a v e',
  'HONK (the goose is not sorry)',
  'the honk is coming from inside the house',
  '*dial-up internet noises but it\'s honking*',
  'honk.exe has stopped responding',
  'HONK HONK HONK (this is a threat)',
];

export interface StealableUIElement {
  id: string;
  name: string;
  stealMessage: string;
  returnTime: number; // seconds
}

export const STEALABLE_UI_ELEMENTS: StealableUIElement[] = [
  { id: 'boop_button', name: 'Boop Button', stealMessage: 'A goose waddles off with your Boop Button!', returnTime: 5 },
  { id: 'health_bar', name: 'Health Bar', stealMessage: 'Your health bar has been confiscated by a goose.', returnTime: 4 },
  { id: 'bread_counter', name: 'Bread Counter', stealMessage: 'The goose ate your bread counter. It was delicious.', returnTime: 3 },
  { id: 'honk_meter', name: 'Honk Meter', stealMessage: 'Ironic. The goose stole the honk meter.', returnTime: 6 },
  { id: 'sanity_display', name: 'Sanity Display', stealMessage: 'You can\'t lose sanity if you can\'t see it! *taps beak*', returnTime: 8 },
];

export interface SurrealEvent {
  id: string;
  name: string;
  description: string;
  effect: {
    type: 'breadRain' | 'gooseParade' | 'honkEcho' | 'gravityShuffle' | 'dimensionFlicker' | 'goosePhilosophy' | 'timeLoop' | 'mirrorMatch';
    value?: number;
  };
}

export const SURREAL_EVENTS: SurrealEvent[] = [
  { id: 'bread_rain', name: 'Bread Rain', description: 'It\'s raining bread! Hallelujah, it\'s raining bread!', effect: { type: 'breadRain', value: 50 } },
  { id: 'goose_parade', name: 'Goose Parade', description: 'A solemn procession of geese marches through. Combat pauses.', effect: { type: 'gooseParade' } },
  { id: 'honk_echo', name: 'Honk Echo', description: 'The dimension resonates. Your honk meter fills twice as fast this floor.', effect: { type: 'honkEcho', value: 2 } },
  { id: 'gravity_shuffle', name: 'Gravity Shuffle', description: 'Up is down. Down is left. The geese don\'t seem to notice.', effect: { type: 'gravityShuffle', value: 10 } },
  { id: 'dimension_flicker', name: 'Dimension Flicker', description: 'Reality glitches. All enemies lose 15% HP.', effect: { type: 'dimensionFlicker', value: 0.15 } },
  { id: 'goose_philosophy', name: 'Goose Philosophy', description: 'A goose asks: "If a goose honks in a dimension and no one hears it, does it still drain sanity?" Yes. -5 sanity.', effect: { type: 'goosePhilosophy', value: 5 } },
  { id: 'time_loop', name: 'Time Loop', description: 'Wait, didn\'t we already clear this floor? +20 bread crumbs but enemies respawn at half HP.', effect: { type: 'timeLoop', value: 20 } },
  { id: 'mirror_match', name: 'Mirror Match', description: 'You encounter... yourself? But goose-ified. Defeat your goose-self for double rewards.', effect: { type: 'mirrorMatch', value: 2 } },
];

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export interface GooseDimensionAchievement {
  id: string;
  name: string;
  description: string;
  condition: string;
}

export const GOOSE_DIMENSION_ACHIEVEMENTS: GooseDimensionAchievement[] = [
  { id: 'first_honk', name: 'First Honk', description: 'Enter the Goose Dimension for the first time', condition: 'totalRuns >= 1' },
  { id: 'goose_slayer_10', name: 'Goose Slayer', description: 'Bonk 100 geese in total', condition: 'geeseBonked >= 100' },
  { id: 'bread_hoarder', name: 'Bread Hoarder', description: 'Collect 1000 bread crumbs in a single run', condition: 'breadCrumbsInRun >= 1000' },
  { id: 'sanity_optional', name: 'Sanity Is Optional', description: 'Reach floor 10 with 0 sanity', condition: 'floor >= 10 && sanity === 0' },
  { id: 'full_honk', name: 'FULL HONK', description: 'Fill the Honk Meter 10 times in a single run', condition: 'honkMeterFills >= 10' },
  { id: 'original_defeated', name: 'Return to Sender', description: 'Defeat The Original Goose on floor 10', condition: 'defeatedOriginalGoose' },
  { id: 'king_slayer', name: 'Regicide (Honk)', description: 'Defeat The Goose King on floor 20', condition: 'defeatedGooseKing' },
  { id: 'cosmic_silencer', name: 'Cosmic Silencer', description: 'Defeat The Cosmic Honk on floor 30', condition: 'defeatedCosmicHonk' },
  { id: 'primordial_vanquished', name: 'HONK NO MORE', description: 'Defeat The Primordial Honk on floor 50', condition: 'primordialDefeated' },
  { id: 'speed_honker', name: 'Speed Honker', description: 'Defeat The Primordial Honk in under 30 minutes', condition: 'fastestPrimordialKill <= 1800000 && fastestPrimordialKill > 0' },
];

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface DimensionStats {
  totalRuns: number;
  floorsCleared: number;
  geeseBonked: number;
  breadCrumbsCollected: number;
  sanityLost: number;
  primordialDefeated: boolean;
  fastestPrimordialKill: number; // ms, 0 means never
  honkMeterFills: number;
  totalBreadEarned: number;
  bossesDefeated: number;
}

interface DimensionRewards {
  unlocked: string[];
  titleEarned: string | null;
  catEarned: string | null;
  permanentEffectsApplied: string[];
}

interface ActiveDimensionEnemy {
  templateId: string;
  name: string;
  tier: GooseEnemyTier;
  hp: number;
  maxHp: number;
  damage: number;
  defense: number;
  speed: number;
  honkValue: number;
  sanityDrain: number;
  phase: number;
  maxPhases: number;
}

interface CatTeamMember {
  index: number;
  sanity: number;
}

interface RunState {
  inRun: boolean;
  currentFloor: number;
  sanity: number;
  maxSanity: number;
  honkMeter: number;
  maxHonkMeter: number;
  breadCrumbs: number;
  player: {
    hp: number;
    maxHp: number;
    damage: number;
    defense: number;
  };
  enemy: ActiveDimensionEnemy | null;
  catTeam: CatTeamMember[];
  fourthWallCooldown: number; // ms remaining
  stolenElements: { elementId: string; returnTimer: number }[];
  startTime: number;
  honkMeterFillsThisRun: number;
  breadCrumbsThisRun: number;
  activeSurrealEffect: SurrealEvent | null;
  honkEchoActive: boolean;
  mirrorMatchActive: boolean;
  combatPaused: boolean;
}

interface SerializedGooseDimensionSystem {
  highestFloor: number;
  stats: DimensionStats;
  rewards: DimensionRewards;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// GooseDimensionSystem
// ---------------------------------------------------------------------------

export class GooseDimensionSystem {
  // Persistent state
  public highestFloor: number = 0;
  public stats: DimensionStats;
  public rewards: DimensionRewards;

  // Transient run state
  private run: RunState | null = null;

  constructor() {
    this.stats = {
      totalRuns: 0,
      floorsCleared: 0,
      geeseBonked: 0,
      breadCrumbsCollected: 0,
      sanityLost: 0,
      primordialDefeated: false,
      fastestPrimordialKill: 0,
      honkMeterFills: 0,
      totalBreadEarned: 0,
      bossesDefeated: 0,
    };
    this.rewards = {
      unlocked: [],
      titleEarned: null,
      catEarned: null,
      permanentEffectsApplied: [],
    };
  }

  // ---- Accessors for UI ----

  get inRun(): boolean {
    return this.run?.inRun ?? false;
  }

  get currentFloor(): number {
    return this.run?.currentFloor ?? 0;
  }

  get sanity(): number {
    return this.run?.sanity ?? 100;
  }

  get maxSanity(): number {
    return this.run?.maxSanity ?? 100;
  }

  get honkMeter(): number {
    return this.run?.honkMeter ?? 0;
  }

  get maxHonkMeter(): number {
    return this.run?.maxHonkMeter ?? 100;
  }

  get breadCrumbs(): number {
    return this.run?.breadCrumbs ?? 0;
  }

  get player(): RunState['player'] | null {
    return this.run?.player ?? null;
  }

  get enemy(): ActiveDimensionEnemy | null {
    return this.run?.enemy ?? null;
  }

  get catTeam(): CatTeamMember[] {
    return this.run?.catTeam ?? [];
  }

  get stolenElements(): { elementId: string; returnTimer: number }[] {
    return this.run?.stolenElements ?? [];
  }

  get activeSurrealEffect(): SurrealEvent | null {
    return this.run?.activeSurrealEffect ?? null;
  }

  // ---- Core Methods ----

  startRun(selectedCatStats: { hp: number; attack: number; defense: number }[]): void {
    // Aggregate cat stats into player base
    const totalHp = selectedCatStats.reduce((sum, c) => sum + c.hp, 0);
    const totalAtk = selectedCatStats.reduce((sum, c) => sum + c.attack, 0);
    const totalDef = selectedCatStats.reduce((sum, c) => sum + c.defense, 0);
    const catCount = Math.max(1, selectedCatStats.length);

    this.run = {
      inRun: true,
      currentFloor: 0,
      sanity: 100,
      maxSanity: 100,
      honkMeter: 0,
      maxHonkMeter: 100,
      breadCrumbs: 0,
      player: {
        hp: Math.floor(totalHp / catCount) + 50,
        maxHp: Math.floor(totalHp / catCount) + 50,
        damage: Math.floor(totalAtk / catCount) + 10,
        defense: Math.floor(totalDef / catCount) + 5,
      },
      enemy: null,
      catTeam: selectedCatStats.map((_, i) => ({ index: i, sanity: 100 })),
      fourthWallCooldown: 0,
      stolenElements: [],
      startTime: Date.now(),
      honkMeterFillsThisRun: 0,
      breadCrumbsThisRun: 0,
      activeSurrealEffect: null,
      honkEchoActive: false,
      mirrorMatchActive: false,
      combatPaused: false,
    };

    this.stats.totalRuns++;

    // Enter floor 1
    this.advanceFloor();
  }

  advanceFloor(): {
    floor: number;
    enemy: ActiveDimensionEnemy;
    surrealEvent?: SurrealEvent;
    fourthWallBreak?: FourthWallBreak;
    uiTheft?: StealableUIElement;
    randomHonk?: string;
  } | null {
    const run = this.run;
    if (!run || !run.inRun) return null;

    run.currentFloor++;
    run.activeSurrealEffect = null;
    run.honkEchoActive = false;
    run.mirrorMatchActive = false;
    run.combatPaused = false;

    const floor = run.currentFloor;
    const result: {
      floor: number;
      enemy: ActiveDimensionEnemy;
      surrealEvent?: SurrealEvent;
      fourthWallBreak?: FourthWallBreak;
      uiTheft?: StealableUIElement;
      randomHonk?: string;
    } = { floor, enemy: null! };

    // Determine enemy for this floor
    const enemy = this.spawnEnemyForFloor(floor);
    run.enemy = enemy;
    result.enemy = enemy;

    // Surreal event: 15% chance
    if (Math.random() < 0.15) {
      const event = this.triggerSurrealEvent();
      if (event) {
        result.surrealEvent = event;
      }
    }

    // Fourth wall break: check with 1 minute cooldown
    if (run.fourthWallCooldown <= 0) {
      const fwb = this.triggerFourthWallBreak('floor_advance');
      if (fwb) {
        result.fourthWallBreak = fwb;
        run.fourthWallCooldown = 60_000; // 1 minute cooldown
      }
    }

    // UI theft: 5% chance
    if (Math.random() < 0.05) {
      const theft = this.triggerUITheft();
      if (theft) {
        result.uiTheft = theft;
      }
    }

    // Random honk (always, for flavor)
    result.randomHonk = pickRandom(RANDOM_HONKS);

    // Update highest floor
    if (floor > this.highestFloor) {
      this.highestFloor = floor;
    }

    return result;
  }

  private spawnEnemyForFloor(floor: number): ActiveDimensionEnemy {
    // Check for boss floors
    const bossEnemy = GOOSE_DIMENSION_ENEMIES.find(e =>
      (e.tier === 'boss' || e.tier === 'final') && e.bossFloor === floor
    );

    if (bossEnemy) {
      const bossScale = 1 + (floor / 10 - 1) * 0.3;
      return {
        templateId: bossEnemy.id,
        name: bossEnemy.name,
        tier: bossEnemy.tier,
        hp: Math.floor(bossEnemy.baseHp * bossScale),
        maxHp: Math.floor(bossEnemy.baseHp * bossScale),
        damage: Math.floor(bossEnemy.baseDamage * bossScale),
        defense: Math.floor(bossEnemy.baseDefense * bossScale),
        speed: bossEnemy.speed,
        honkValue: bossEnemy.honkValue,
        sanityDrain: bossEnemy.sanityDrain,
        phase: 1,
        maxPhases: bossEnemy.phases ?? 1,
      };
    }

    // Elite chance: 0.15 + floor * 0.005
    const eliteChance = 0.15 + floor * 0.005;
    const isElite = Math.random() < eliteChance;

    const tier: GooseEnemyTier = isElite ? 'elite' : 'normal';
    const candidates = GOOSE_DIMENSION_ENEMIES.filter(e => e.tier === tier);
    const template = pickRandom(candidates);

    const normalScale = 1 + (floor - 1) * 0.15;

    return {
      templateId: template.id,
      name: template.name,
      tier: template.tier,
      hp: Math.floor(template.baseHp * normalScale),
      maxHp: Math.floor(template.baseHp * normalScale),
      damage: Math.floor(template.baseDamage * normalScale),
      defense: Math.floor(template.baseDefense * normalScale),
      speed: template.speed,
      honkValue: template.honkValue,
      sanityDrain: template.sanityDrain,
      phase: 1,
      maxPhases: 1,
    };
  }

  attack(multiplier: number = 1): {
    damageDealt: number;
    damageTaken: number;
    honkGained: number;
    sanityLost: number;
    enemyDefeated: boolean;
    playerDefeated: boolean;
    honkMeterFull: boolean;
    fourthWallBreak?: FourthWallBreak;
  } | null {
    const run = this.run;
    if (!run || !run.inRun || !run.enemy || run.combatPaused) return null;

    const enemy = run.enemy;
    const sanityMod = this.getSanityModifiers();

    // Calculate average cat sanity
    const avgCatSanity = run.catTeam.length > 0
      ? run.catTeam.reduce((sum, c) => sum + c.sanity, 0) / run.catTeam.length
      : 50;
    const catSanityBonus = 0.5 + avgCatSanity / 200; // ranges from 0.5 to 1.0

    // Player damage to enemy
    const rawDamage = run.player.damage * multiplier * sanityMod.dmgDealt * catSanityBonus;
    const effectiveDamage = Math.max(1, Math.floor(rawDamage - enemy.defense));
    enemy.hp -= effectiveDamage;

    // Gain honk meter from enemy's honk value
    const honkGain = enemy.honkValue * (run.honkEchoActive ? 2 : 1);
    run.honkMeter = Math.min(run.maxHonkMeter, run.honkMeter + honkGain);

    // Lose sanity from enemy's drain
    const sanityDrained = enemy.sanityDrain;
    run.sanity = Math.max(0, run.sanity - sanityDrained);
    this.stats.sanityLost += sanityDrained;

    // Drain cat team sanity too (half the player drain rate)
    for (const cat of run.catTeam) {
      cat.sanity = Math.max(0, cat.sanity - Math.floor(sanityDrained / 2));
    }

    // Enemy counterattack
    const playerDef = sanityMod.defenseZero ? 0 : run.player.defense;
    const enemyDamage = Math.max(1, Math.floor(enemy.damage * sanityMod.dmgTaken - playerDef));
    run.player.hp -= enemyDamage;

    // Check honk meter full
    let honkMeterFull = false;
    if (run.honkMeter >= run.maxHonkMeter) {
      this.handleFullHonkMeter();
      honkMeterFull = true;
    }

    // Check enemy defeated
    let enemyDefeated = false;
    if (enemy.hp <= 0) {
      // Check for phase transition on bosses
      if (enemy.phase < enemy.maxPhases) {
        enemy.phase++;
        // Restore to phase percentage of max HP
        const phaseHpPercent = 1 - (enemy.phase - 1) / enemy.maxPhases;
        enemy.hp = Math.floor(enemy.maxHp * phaseHpPercent);
        enemy.damage = Math.floor(enemy.damage * 1.2); // Each phase hits harder
      } else {
        enemyDefeated = true;
        this.onEnemyDefeated();
      }
    }

    // Check player defeated
    const playerDefeated = run.player.hp <= 0;
    if (playerDefeated) {
      this.endRun('defeated');
    }

    // Fourth wall break check on damage taken
    let fourthWallBreak: FourthWallBreak | undefined;
    if (run.fourthWallCooldown <= 0) {
      fourthWallBreak = this.triggerFourthWallBreak('take_damage') ?? undefined;
      if (fourthWallBreak) {
        run.fourthWallCooldown = 60_000;
      }
    }

    return {
      damageDealt: effectiveDamage,
      damageTaken: enemyDamage,
      honkGained: honkGain,
      sanityLost: sanityDrained,
      enemyDefeated,
      playerDefeated,
      honkMeterFull,
      fourthWallBreak,
    };
  }

  useHonkBurst(): { damage: number; success: boolean } {
    const run = this.run;
    if (!run || !run.inRun || !run.enemy) return { damage: 0, success: false };

    if (run.honkMeter < 50) return { damage: 0, success: false };

    run.honkMeter -= 50;

    const burstDamage = Math.floor(run.player.damage * 3);
    const enemy = run.enemy;
    enemy.hp -= burstDamage;

    // Fourth wall break chance on honk burst
    if (run.fourthWallCooldown <= 0) {
      const fwb = this.triggerFourthWallBreak('honk_burst');
      if (fwb) {
        run.fourthWallCooldown = 60_000;
      }
    }

    if (enemy.hp <= 0) {
      if (enemy.phase < enemy.maxPhases) {
        enemy.phase++;
        const phaseHpPercent = 1 - (enemy.phase - 1) / enemy.maxPhases;
        enemy.hp = Math.floor(enemy.maxHp * phaseHpPercent);
        enemy.damage = Math.floor(enemy.damage * 1.2);
      } else {
        this.onEnemyDefeated();
      }
    }

    return { damage: burstDamage, success: true };
  }

  handleFullHonkMeter(): void {
    const run = this.run;
    if (!run || !run.inRun) return;

    // Heal player +20 HP
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + 20);

    // Restore +10 sanity
    run.sanity = Math.min(run.maxSanity, run.sanity + 10);

    // Deal player damage * 2 to current enemy
    if (run.enemy && run.enemy.hp > 0) {
      const bonusDamage = Math.floor(run.player.damage * 2);
      run.enemy.hp -= bonusDamage;

      // Check kill after bonus damage
      if (run.enemy.hp <= 0) {
        if (run.enemy.phase < run.enemy.maxPhases) {
          run.enemy.phase++;
          const phaseHpPercent = 1 - (run.enemy.phase - 1) / run.enemy.maxPhases;
          run.enemy.hp = Math.floor(run.enemy.maxHp * phaseHpPercent);
          run.enemy.damage = Math.floor(run.enemy.damage * 1.2);
        } else {
          this.onEnemyDefeated();
        }
      }
    }

    // Reset meter
    run.honkMeter = 0;
    run.honkMeterFillsThisRun++;
    this.stats.honkMeterFills++;
  }

  private onEnemyDefeated(): void {
    const run = this.run;
    if (!run || !run.enemy) return;

    const enemy = run.enemy;
    const floor = run.currentFloor;

    // Bread crumb rewards
    let crumbs = floor * 5;
    if (enemy.tier === 'boss') crumbs *= 5;
    if (enemy.tier === 'final') crumbs *= 10;
    if (run.mirrorMatchActive) crumbs *= 2;

    run.breadCrumbs += crumbs;
    run.breadCrumbsThisRun += crumbs;
    this.stats.breadCrumbsCollected += crumbs;
    this.stats.geeseBonked++;
    this.stats.floorsCleared++;

    if (enemy.tier === 'boss' || enemy.tier === 'final') {
      this.stats.bossesDefeated++;
    }

    // Check primordial defeat
    if (enemy.templateId === 'the_primordial_honk') {
      this.stats.primordialDefeated = true;
      const runTime = Date.now() - run.startTime;
      if (this.stats.fastestPrimordialKill === 0 || runTime < this.stats.fastestPrimordialKill) {
        this.stats.fastestPrimordialKill = runTime;
      }
      // Award special rewards
      if (!this.rewards.titleEarned) {
        this.rewards.titleEarned = 'Silencer of the Primordial Honk';
      }
      if (!this.rewards.catEarned) {
        this.rewards.catEarned = 'goose_dimension_cat';
      }
      this.rewards.unlocked.push('primordial_defeated');
    }

    // Fourth wall break chance on enemy defeat
    if (run.fourthWallCooldown <= 0) {
      const fwb = this.triggerFourthWallBreak('enemy_defeat');
      if (fwb) {
        run.fourthWallCooldown = 60_000;
      }
    }

    // Clear enemy
    run.enemy = null;
  }

  endRun(reason: 'defeated' | 'fled' | 'victory'): {
    reason: string;
    floorsCleared: number;
    breadCrumbs: number;
    bpEarned: number;
    gooseFeathers: number;
    timeElapsed: number;
  } {
    const run = this.run!;
    run.inRun = false;

    const floorsCleared = run.currentFloor - (run.enemy ? 1 : 0);
    const bpEarned = run.breadCrumbs * 10;
    const gooseFeathers = Math.floor(run.currentFloor / 5);
    const timeElapsed = Date.now() - run.startTime;

    this.stats.totalBreadEarned += run.breadCrumbs;

    const result = {
      reason,
      floorsCleared,
      breadCrumbs: run.breadCrumbs,
      bpEarned,
      gooseFeathers,
      timeElapsed,
    };

    // Clear transient state
    this.run = null;

    return result;
  }

  getSanityModifiers(): SanityModifiers {
    const run = this.run;
    const currentSanity = run?.sanity ?? 100;

    // Check thresholds from highest to lowest
    if (currentSanity === 0) {
      return { dmgDealt: 2.0, dmgTaken: 2.0, defenseZero: true };
    }

    for (const threshold of SANITY_THRESHOLDS) {
      if (currentSanity >= threshold.minSanity) {
        return {
          dmgDealt: threshold.dmgDealt,
          dmgTaken: threshold.dmgTaken,
          defenseZero: false,
        };
      }
    }

    // Fallback (should not reach here)
    return { dmgDealt: 2.0, dmgTaken: 2.0, defenseZero: true };
  }

  triggerSurrealEvent(): SurrealEvent | null {
    const run = this.run;
    if (!run || !run.inRun) return null;

    const event = pickRandom(SURREAL_EVENTS);
    run.activeSurrealEffect = event;

    // Apply immediate effects
    switch (event.effect.type) {
      case 'breadRain':
        run.breadCrumbs += event.effect.value ?? 50;
        run.breadCrumbsThisRun += event.effect.value ?? 50;
        this.stats.breadCrumbsCollected += event.effect.value ?? 50;
        break;
      case 'gooseParade':
        run.combatPaused = true;
        break;
      case 'honkEcho':
        run.honkEchoActive = true;
        break;
      case 'gravityShuffle':
        // Lose some sanity from confusion
        run.sanity = Math.max(0, run.sanity - (event.effect.value ?? 10));
        this.stats.sanityLost += event.effect.value ?? 10;
        break;
      case 'dimensionFlicker':
        if (run.enemy) {
          const hpLoss = Math.floor(run.enemy.maxHp * (event.effect.value ?? 0.15));
          run.enemy.hp = Math.max(1, run.enemy.hp - hpLoss);
        }
        break;
      case 'goosePhilosophy':
        run.sanity = Math.max(0, run.sanity - (event.effect.value ?? 5));
        this.stats.sanityLost += event.effect.value ?? 5;
        break;
      case 'timeLoop':
        run.breadCrumbs += event.effect.value ?? 20;
        run.breadCrumbsThisRun += event.effect.value ?? 20;
        this.stats.breadCrumbsCollected += event.effect.value ?? 20;
        // Reset enemy to half HP (simulating respawn)
        if (run.enemy) {
          run.enemy.hp = Math.floor(run.enemy.maxHp * 0.5);
        }
        break;
      case 'mirrorMatch':
        run.mirrorMatchActive = true;
        break;
    }

    return event;
  }

  triggerFourthWallBreak(trigger: string): FourthWallBreak | null {
    const run = this.run;
    if (!run || !run.inRun) return null;

    // Also check if low sanity should trigger the low_sanity break
    const applicableTrigger = run.sanity < 25 && trigger === 'floor_advance' ? 'low_sanity' : trigger;

    const candidates = FOURTH_WALL_BREAKS.filter(fwb =>
      fwb.trigger === applicableTrigger && Math.random() < fwb.chance
    );

    if (candidates.length === 0) return null;

    const fwb = pickRandom(candidates);
    run.sanity = Math.max(0, run.sanity - fwb.sanityDrain);
    this.stats.sanityLost += fwb.sanityDrain;

    return fwb;
  }

  triggerUITheft(): StealableUIElement | null {
    const run = this.run;
    if (!run || !run.inRun) return null;

    // Don't steal elements that are already stolen
    const alreadyStolen = new Set(run.stolenElements.map(s => s.elementId));
    const available = STEALABLE_UI_ELEMENTS.filter(el => !alreadyStolen.has(el.id));

    if (available.length === 0) return null;

    const stolen = pickRandom(available);
    run.stolenElements.push({
      elementId: stolen.id,
      returnTimer: stolen.returnTime * 1000, // convert to ms
    });

    return stolen;
  }

  /** Call periodically to tick down stolen element return timers and fourth wall cooldown. */
  updateTimers(deltaMs: number): { returnedElements: string[] } {
    const run = this.run;
    if (!run || !run.inRun) return { returnedElements: [] };

    // Fourth wall cooldown
    if (run.fourthWallCooldown > 0) {
      run.fourthWallCooldown = Math.max(0, run.fourthWallCooldown - deltaMs);
    }

    // Stolen elements
    const returned: string[] = [];
    for (let i = run.stolenElements.length - 1; i >= 0; i--) {
      run.stolenElements[i].returnTimer -= deltaMs;
      if (run.stolenElements[i].returnTimer <= 0) {
        returned.push(run.stolenElements[i].elementId);
        run.stolenElements.splice(i, 1);
      }
    }

    // Unpause combat if goose parade was active and enough time passed
    if (run.combatPaused && run.activeSurrealEffect?.effect.type === 'gooseParade') {
      // Auto-unpause after a tick (parade is brief)
      run.combatPaused = false;
    }

    return { returnedElements: returned };
  }

  /** Resume combat after a goose parade event. */
  resumeCombat(): void {
    const run = this.run;
    if (!run) return;
    run.combatPaused = false;
  }

  /** Get a random honk string for flavor text. */
  getRandomHonk(): string {
    return pickRandom(RANDOM_HONKS);
  }

  /** Check if an achievement condition is met. Returns newly unlocked achievements. */
  checkAchievements(): GooseDimensionAchievement[] {
    const newly: GooseDimensionAchievement[] = [];

    for (const ach of GOOSE_DIMENSION_ACHIEVEMENTS) {
      if (this.rewards.unlocked.includes(ach.id)) continue;

      let met = false;
      switch (ach.id) {
        case 'first_honk':
          met = this.stats.totalRuns >= 1;
          break;
        case 'goose_slayer_10':
          met = this.stats.geeseBonked >= 100;
          break;
        case 'bread_hoarder':
          met = (this.run?.breadCrumbsThisRun ?? 0) >= 1000;
          break;
        case 'sanity_optional':
          met = (this.run?.currentFloor ?? 0) >= 10 && (this.run?.sanity ?? 100) === 0;
          break;
        case 'full_honk':
          met = (this.run?.honkMeterFillsThisRun ?? 0) >= 10;
          break;
        case 'original_defeated':
          met = this.stats.bossesDefeated >= 1 && this.highestFloor >= 10;
          break;
        case 'king_slayer':
          met = this.highestFloor >= 20;
          break;
        case 'cosmic_silencer':
          met = this.highestFloor >= 30;
          break;
        case 'primordial_vanquished':
          met = this.stats.primordialDefeated;
          break;
        case 'speed_honker':
          met = this.stats.fastestPrimordialKill > 0 && this.stats.fastestPrimordialKill <= 1_800_000;
          break;
      }

      if (met) {
        this.rewards.unlocked.push(ach.id);
        newly.push(ach);
      }
    }

    return newly;
  }

  // ---- Serialization (persistent data only) ----

  serialize(): SerializedGooseDimensionSystem {
    return {
      highestFloor: this.highestFloor,
      stats: { ...this.stats },
      rewards: {
        unlocked: [...this.rewards.unlocked],
        titleEarned: this.rewards.titleEarned,
        catEarned: this.rewards.catEarned,
        permanentEffectsApplied: [...this.rewards.permanentEffectsApplied],
      },
    };
  }

  deserialize(data: SerializedGooseDimensionSystem): void {
    this.highestFloor = data.highestFloor ?? 0;

    if (data.stats) {
      this.stats = {
        totalRuns: data.stats.totalRuns ?? 0,
        floorsCleared: data.stats.floorsCleared ?? 0,
        geeseBonked: data.stats.geeseBonked ?? 0,
        breadCrumbsCollected: data.stats.breadCrumbsCollected ?? 0,
        sanityLost: data.stats.sanityLost ?? 0,
        primordialDefeated: data.stats.primordialDefeated ?? false,
        fastestPrimordialKill: data.stats.fastestPrimordialKill ?? 0,
        honkMeterFills: data.stats.honkMeterFills ?? 0,
        totalBreadEarned: data.stats.totalBreadEarned ?? 0,
        bossesDefeated: data.stats.bossesDefeated ?? 0,
      };
    }

    if (data.rewards) {
      this.rewards = {
        unlocked: data.rewards.unlocked ? [...data.rewards.unlocked] : [],
        titleEarned: data.rewards.titleEarned ?? null,
        catEarned: data.rewards.catEarned ?? null,
        permanentEffectsApplied: data.rewards.permanentEffectsApplied
          ? [...data.rewards.permanentEffectsApplied]
          : [],
      };
    }

    // Run state is never persisted - runs are transient
    this.run = null;
  }
}
