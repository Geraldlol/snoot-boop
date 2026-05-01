// Infinite Pagoda - Turn-based roguelike dungeon system

export type Element = 'water' | 'fire' | 'nature' | 'light' | 'void' | null;

export type CombatState =
  | 'idle'
  | 'selecting'
  | 'player_turn'
  | 'enemy_turn'
  | 'animating'
  | 'victory'
  | 'defeat'
  | 'fled';

export type SkillCategory = 'basic' | 'offensive' | 'defensive' | 'utility' | 'ultimate' | 'meme';
export type EffectType = 'damage' | 'heal' | 'shield' | 'flee' | 'buff' | 'debuff' | 'special';
export type LootRarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic';
export type UpgradeType = 'maxHpBonus' | 'damageBonus' | 'defenseBonus' | 'startingShields' | 'healingBonus';

export interface EnemyTemplate {
  id: string;
  name: string;
  emoji: string;
  floorRange: [number, number];
  baseHp: number;
  baseDamage: number;
  baseDefense: number;
  speed: number;
  element: Element;
  dropChance: number;
}

export interface BossTemplate {
  id: string;
  name: string;
  emoji: string;
  floor: number;
  baseHp: number;
  baseDamage: number;
  baseDefense: number;
  speed: number;
  phases: number;
  element: Element;
  rewards: { bp: number; tokens: number };
}

export interface BoopCommand {
  id: string;
  name: string;
  emoji: string;
  category: SkillCategory;
  description: string;
  unlockFloor: number;
  cooldown: number;
  oncePerRun: boolean;
  effect: {
    type: EffectType;
    multiplier?: number;
    hitCount?: number;
    healPercent?: number;
    shieldCount?: number;
    dodgeCount?: number;
    duration?: number;
    stat?: string;
    value?: number;
    element?: Element;
    guaranteedCrit?: boolean;
    damageReduction?: number;
    selfDamagePercent?: number;
    counterChance?: number;
    reflect?: number;
    lifesteal?: number;
    stunChance?: number;
  };
}

export interface LootRarityDef {
  weight: number;
  multiplier: number;
}

export interface ActiveEnemy {
  templateId: string;
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  damage: number;
  defense: number;
  speed: number;
  element: Element;
  isBoss: boolean;
  phase: number;
  maxPhases: number;
  buffs: Buff[];
  debuffs: Debuff[];
}

export interface Buff {
  id: string;
  stat: string;
  value: number;
  turnsLeft: number;
}

export interface Debuff {
  id: string;
  stat: string;
  value: number;
  turnsLeft: number;
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  damage: number;
  defense: number;
  crit: number;
  critMult: number;
  shieldCharges: number;
  dodgeCharges: number;
  buffs: Buff[];
  debuffs: Debuff[];
}

export interface FloorModifier {
  id: string;
  name: string;
  description: string;
  effect: Record<string, number>;
}

export interface LootItem {
  id: string;
  name: string;
  rarity: LootRarity;
  floor: number;
  value: number;
}

export interface RunRecord {
  id: string;
  timestamp: number;
  floorsCleared: number;
  reason: string;
  rewards: { bp: number; tokens: number; spiritStones: number; items: LootItem[] };
  duration: number;
}

export interface PagodaPersistent {
  highestFloor: number;
  tokens: number;
  upgrades: Record<UpgradeType, number>;
  stats: {
    totalRuns: number;
    totalFloors: number;
    totalKills: number;
    totalDeaths: number;
    bossKills: number;
    highestDamage: number;
  };
  runHistory: RunRecord[];
  unlockedSkills: string[];
}

export interface PagodaRunState {
  inRun: boolean;
  currentFloor: number;
  combatState: CombatState;
  player: PlayerState;
  enemy: ActiveEnemy | null;
  cooldowns: Record<string, number>;
  rewards: { bp: number; tokens: number; spiritStones: number; items: LootItem[] };
  floorModifiers: FloorModifier[];
  startTime: number;
  usedOncePerRun: Set<string>;
}

// --- DATA CONSTANTS ---

export const PAGODA_ENEMIES: EnemyTemplate[] = [
  // Spirit Animals (floor 1-10)
  { id: 'spirit_mouse', name: 'Spirit Mouse', emoji: '\uD83D\uDC2D', floorRange: [1, 10], baseHp: 40, baseDamage: 8, baseDefense: 0, speed: 1.2, element: null, dropChance: 0.3 },
  { id: 'phantom_fish', name: 'Phantom Fish', emoji: '\uD83D\uDC1F', floorRange: [1, 10], baseHp: 50, baseDamage: 12, baseDefense: 2, speed: 1.5, element: 'water', dropChance: 0.35 },
  { id: 'shadow_moth', name: 'Shadow Moth', emoji: '\uD83E\uDD8B', floorRange: [1, 10], baseHp: 60, baseDamage: 15, baseDefense: 3, speed: 2.0, element: 'void', dropChance: 0.25 },
  // Mystical Beasts (floor 11-30)
  { id: 'jade_serpent', name: 'Jade Serpent', emoji: '\uD83D\uDC0D', floorRange: [11, 30], baseHp: 90, baseDamage: 18, baseDefense: 5, speed: 1.0, element: 'nature', dropChance: 0.4 },
  { id: 'thunder_sparrow', name: 'Thunder Sparrow', emoji: '\u26A1', floorRange: [11, 30], baseHp: 100, baseDamage: 22, baseDefense: 7, speed: 2.5, element: 'light', dropChance: 0.35 },
  { id: 'frost_fox', name: 'Frost Fox', emoji: '\uD83E\uDD8A', floorRange: [11, 30], baseHp: 120, baseDamage: 28, baseDefense: 10, speed: 1.5, element: 'water', dropChance: 0.45 },
  // Legendary Creatures (floor 31-50)
  { id: 'void_wolf', name: 'Void Wolf', emoji: '\uD83D\uDC3A', floorRange: [31, 50], baseHp: 180, baseDamage: 35, baseDefense: 12, speed: 1.5, element: 'void', dropChance: 0.5 },
  { id: 'celestial_crane', name: 'Celestial Crane', emoji: '\uD83E\uDDA2', floorRange: [31, 50], baseHp: 220, baseDamage: 38, baseDefense: 18, speed: 2.0, element: 'light', dropChance: 0.45 },
  { id: 'storm_dragon', name: 'Storm Dragon', emoji: '\uD83D\uDC09', floorRange: [31, 50], baseHp: 280, baseDamage: 45, baseDefense: 25, speed: 1.0, element: 'fire', dropChance: 0.55 },
  // Ancient Horrors (floor 51-100)
  { id: 'ancient_beast', name: 'Ancient Beast', emoji: '\uD83D\uDC32', floorRange: [51, 100], baseHp: 320, baseDamage: 55, baseDefense: 20, speed: 0.8, element: 'nature', dropChance: 0.6 },
  { id: 'corrupted_spirit', name: 'Corrupted Spirit', emoji: '\uD83D\uDC7B', floorRange: [51, 100], baseHp: 350, baseDamage: 60, baseDefense: 25, speed: 1.2, element: 'void', dropChance: 0.55 },
  { id: 'dimensional_entity', name: 'Dimensional Entity', emoji: '\uD83C\uDF00', floorRange: [51, 100], baseHp: 400, baseDamage: 70, baseDefense: 35, speed: 1.5, element: null, dropChance: 0.65 },
];

export const PAGODA_BOSSES: BossTemplate[] = [
  { id: 'eternal_napper', name: 'The Eternal Napper', emoji: '\uD83D\uDE34', floor: 10, baseHp: 250, baseDamage: 25, baseDefense: 15, speed: 0.5, phases: 2, element: null, rewards: { bp: 2500, tokens: 5 } },
  { id: 'goose_emperor', name: 'Goose Emperor', emoji: '\uD83E\uDDA2', floor: 20, baseHp: 500, baseDamage: 40, baseDefense: 20, speed: 1.2, phases: 3, element: 'water', rewards: { bp: 10000, tokens: 10 } },
  { id: 'nine_tailed_menace', name: 'Nine-Tailed Menace', emoji: '\uD83E\uDD8A', floor: 30, baseHp: 800, baseDamage: 55, baseDefense: 25, speed: 1.5, phases: 3, element: 'fire', rewards: { bp: 25000, tokens: 18 } },
  { id: 'jade_guardian', name: 'Jade Guardian', emoji: '\uD83D\uDDFF', floor: 40, baseHp: 1200, baseDamage: 50, baseDefense: 45, speed: 0.7, phases: 2, element: 'nature', rewards: { bp: 60000, tokens: 30 } },
  { id: 'void_sovereign', name: 'Void Sovereign', emoji: '\uD83D\uDD73\uFE0F', floor: 50, baseHp: 2000, baseDamage: 80, baseDefense: 40, speed: 1.0, phases: 4, element: 'void', rewards: { bp: 150000, tokens: 50 } },
  { id: 'celestial_cat_god', name: 'Celestial Cat God', emoji: '\uD83D\uDC31\u200D\uD83D\uDC51', floor: 100, baseHp: 10000, baseDamage: 150, baseDefense: 80, speed: 2.0, phases: 5, element: 'light', rewards: { bp: 1000000, tokens: 150 } },
];

export const BOOP_COMMANDS: BoopCommand[] = [
  // Basic (6)
  { id: 'snoot_boop', name: 'Snoot Boop', emoji: '\uD83D\uDC3E', category: 'basic', description: 'A basic boop attack', unlockFloor: 0, cooldown: 0, oncePerRun: false, effect: { type: 'damage', multiplier: 1.0 } },
  { id: 'double_tap', name: 'Double Tap', emoji: '\u270A', category: 'basic', description: 'Two quick boops', unlockFloor: 0, cooldown: 3, oncePerRun: false, effect: { type: 'damage', multiplier: 0.7, hitCount: 2 } },
  { id: 'gentle_boop', name: 'Gentle Boop', emoji: '\uD83D\uDC96', category: 'basic', description: 'A soft boop that heals slightly', unlockFloor: 0, cooldown: 4, oncePerRun: false, effect: { type: 'heal', healPercent: 0.1 } },
  { id: 'quick_swipe', name: 'Quick Swipe', emoji: '\uD83D\uDCA8', category: 'basic', description: 'Fast attack, low damage', unlockFloor: 0, cooldown: 1, oncePerRun: false, effect: { type: 'damage', multiplier: 0.6 } },
  { id: 'paw_slap', name: 'Paw Slap', emoji: '\uD83D\uDC51', category: 'basic', description: 'Slap with authority', unlockFloor: 2, cooldown: 2, oncePerRun: false, effect: { type: 'damage', multiplier: 1.2 } },
  { id: 'tail_whip', name: 'Tail Whip', emoji: '\uD83C\uDF00', category: 'basic', description: 'Whip with tail, chance to stun', unlockFloor: 3, cooldown: 5, oncePerRun: false, effect: { type: 'damage', multiplier: 0.8, stunChance: 0.25 } },

  // Offensive (6)
  { id: 'critical_boop', name: 'Critical Boop', emoji: '\uD83D\uDCA5', category: 'offensive', description: 'Guaranteed critical hit', unlockFloor: 5, cooldown: 8, oncePerRun: false, effect: { type: 'damage', multiplier: 1.0, guaranteedCrit: true } },
  { id: 'qi_blast', name: 'Qi Blast', emoji: '\uD83D\uDD25', category: 'offensive', description: 'Fire-element energy blast', unlockFloor: 8, cooldown: 6, oncePerRun: false, effect: { type: 'damage', multiplier: 1.8, element: 'fire' } },
  { id: 'void_strike', name: 'Void Strike', emoji: '\uD83D\uDD73\uFE0F', category: 'offensive', description: 'Void-element piercing attack (ignores 50% def)', unlockFloor: 15, cooldown: 10, oncePerRun: false, effect: { type: 'damage', multiplier: 1.5, element: 'void' } },
  { id: 'flurry_of_paws', name: 'Flurry of Paws', emoji: '\uD83D\uDCAB', category: 'offensive', description: 'Rapid multi-hit combo', unlockFloor: 12, cooldown: 10, oncePerRun: false, effect: { type: 'damage', multiplier: 0.5, hitCount: 5 } },
  { id: 'water_cannon', name: 'Water Cannon', emoji: '\uD83D\uDCA6', category: 'offensive', description: 'Pressurized water blast', unlockFloor: 10, cooldown: 7, oncePerRun: false, effect: { type: 'damage', multiplier: 1.6, element: 'water' } },
  { id: 'nature_thorns', name: 'Nature Thorns', emoji: '\uD83C\uDF3F', category: 'offensive', description: 'Entangle with thorns, damage + debuff', unlockFloor: 10, cooldown: 8, oncePerRun: false, effect: { type: 'damage', multiplier: 1.2, element: 'nature' } },

  // Defensive (6)
  { id: 'shield_boop', name: 'Shield Boop', emoji: '\uD83D\uDEE1\uFE0F', category: 'defensive', description: 'Raise a shield that blocks next hit', unlockFloor: 3, cooldown: 8, oncePerRun: false, effect: { type: 'shield', shieldCount: 1 } },
  { id: 'healing_purr', name: 'Healing Purr', emoji: '\uD83D\uDC9A', category: 'defensive', description: 'Purr to restore 25% HP', unlockFloor: 5, cooldown: 12, oncePerRun: false, effect: { type: 'heal', healPercent: 0.25 } },
  { id: 'dodge_roll', name: 'Dodge Roll', emoji: '\uD83C\uDFBD', category: 'defensive', description: 'Gain 2 dodge charges', unlockFloor: 7, cooldown: 15, oncePerRun: false, effect: { type: 'special', dodgeCount: 2 } },
  { id: 'iron_fur', name: 'Iron Fur', emoji: '\uD83E\uDDF1', category: 'defensive', description: 'Buff defense for 3 turns', unlockFloor: 10, cooldown: 12, oncePerRun: false, effect: { type: 'buff', stat: 'defense', value: 0.5, duration: 3 } },
  { id: 'counter_stance', name: 'Counter Stance', emoji: '\u2694\uFE0F', category: 'defensive', description: 'Chance to counter next attack', unlockFloor: 15, cooldown: 10, oncePerRun: false, effect: { type: 'special', counterChance: 0.6, duration: 2 } },
  { id: 'reflect_barrier', name: 'Reflect Barrier', emoji: '\uD83D\uDD04', category: 'defensive', description: 'Reflect 30% damage for 2 turns', unlockFloor: 20, cooldown: 15, oncePerRun: false, effect: { type: 'special', reflect: 0.3, duration: 2 } },

  // Utility (6)
  { id: 'tactical_retreat', name: 'Tactical Retreat', emoji: '\uD83C\uDFC3', category: 'utility', description: 'Flee the dungeon, keep partial rewards', unlockFloor: 0, cooldown: 0, oncePerRun: false, effect: { type: 'flee' } },
  { id: 'power_up', name: 'Power Up', emoji: '\u2B06\uFE0F', category: 'utility', description: 'Buff attack for 3 turns', unlockFloor: 5, cooldown: 10, oncePerRun: false, effect: { type: 'buff', stat: 'damage', value: 0.4, duration: 3 } },
  { id: 'weaken', name: 'Weaken', emoji: '\u2B07\uFE0F', category: 'utility', description: 'Debuff enemy damage for 3 turns', unlockFloor: 8, cooldown: 10, oncePerRun: false, effect: { type: 'debuff', stat: 'damage', value: 0.3, duration: 3 } },
  { id: 'analyze', name: 'Analyze', emoji: '\uD83D\uDD0D', category: 'utility', description: 'Reveal enemy stats, reduce defense 20%', unlockFloor: 5, cooldown: 15, oncePerRun: false, effect: { type: 'debuff', stat: 'defense', value: 0.2, duration: 99 } },
  { id: 'lifesteal_fang', name: 'Lifesteal Fang', emoji: '\uD83E\uDDB7', category: 'utility', description: 'Attack that heals for 40% damage dealt', unlockFloor: 18, cooldown: 10, oncePerRun: false, effect: { type: 'damage', multiplier: 1.0, lifesteal: 0.4 } },
  { id: 'speed_boost', name: 'Speed Boost', emoji: '\u26A1', category: 'utility', description: 'Act twice next turn', unlockFloor: 20, cooldown: 20, oncePerRun: false, effect: { type: 'buff', stat: 'speed', value: 1.0, duration: 1 } },

  // Ultimate (3)
  { id: 'mega_boop', name: 'MEGA BOOP', emoji: '\uD83D\uDCA3', category: 'ultimate', description: 'Devastating attack at 3x power', unlockFloor: 25, cooldown: 30, oncePerRun: false, effect: { type: 'damage', multiplier: 3.0, guaranteedCrit: true } },
  { id: 'nine_lives', name: 'Nine Lives', emoji: '\u2764\uFE0F', category: 'ultimate', description: 'Fully restore HP (once per run)', unlockFloor: 30, cooldown: 0, oncePerRun: true, effect: { type: 'heal', healPercent: 1.0 } },
  { id: 'heaven_splitter', name: 'Heaven Splitter', emoji: '\u2728', category: 'ultimate', description: 'Light-element nuke, 5 hits at 1.5x', unlockFloor: 40, cooldown: 45, oncePerRun: false, effect: { type: 'damage', multiplier: 1.5, hitCount: 5, element: 'light' } },

  // Meme (3)
  { id: 'keyboard_smash', name: 'Keyboard Smash', emoji: '\u2328\uFE0F', category: 'meme', description: 'Random damage between 1 and 999', unlockFloor: 1, cooldown: 15, oncePerRun: false, effect: { type: 'damage', multiplier: 0 } },
  { id: 'intimidating_loaf', name: 'Intimidating Loaf', emoji: '\uD83C\uDF5E', category: 'meme', description: 'Assert dominance. 50% chance to stun or do nothing.', unlockFloor: 5, cooldown: 10, oncePerRun: false, effect: { type: 'special', stunChance: 0.5 } },
  { id: 'honk', name: 'HONK', emoji: '\uD83E\uDDA2', category: 'meme', description: 'Summon a goose. Chaos ensues. Damages both sides.', unlockFloor: 10, cooldown: 20, oncePerRun: false, effect: { type: 'damage', multiplier: 2.5, selfDamagePercent: 0.15 } },
];

export const LOOT_RARITIES: Record<LootRarity, LootRarityDef> = {
  common: { weight: 60, multiplier: 1.0 },
  uncommon: { weight: 25, multiplier: 1.5 },
  rare: { weight: 10, multiplier: 2.5 },
  legendary: { weight: 4, multiplier: 5.0 },
  mythic: { weight: 1, multiplier: 10.0 },
};

const FLOOR_MODIFIERS: FloorModifier[] = [
  { id: 'empowered_foes', name: 'Empowered Foes', description: 'Enemies deal 25% more damage', effect: { enemyDamage: 0.25 } },
  { id: 'armored_foes', name: 'Armored Foes', description: 'Enemies have 25% more defense', effect: { enemyDefense: 0.25 } },
  { id: 'treasure_floor', name: 'Treasure Floor', description: 'Double loot drops', effect: { lootMultiplier: 1.0 } },
  { id: 'qi_surge', name: 'Qi Surge', description: 'Cooldowns reduced by 30%', effect: { cooldownReduction: 0.3 } },
  { id: 'thin_veil', name: 'Thin Veil', description: 'Crits deal 50% more damage', effect: { critDamageBonus: 0.5 } },
  { id: 'healing_mist', name: 'Healing Mist', description: 'Recover 10% HP after each fight', effect: { postFightHeal: 0.1 } },
];

const ELEMENT_CHART: Record<string, string[]> = {
  fire: ['nature'],
  nature: ['water'],
  water: ['fire'],
  light: ['void'],
  void: ['light'],
};

const UPGRADE_BASE_COSTS: Record<UpgradeType, number> = {
  maxHpBonus: 5,
  damageBonus: 8,
  defenseBonus: 6,
  startingShields: 15,
  healingBonus: 10,
};

const UPGRADE_VALUES: Record<UpgradeType, number> = {
  maxHpBonus: 20,
  damageBonus: 3,
  defenseBonus: 2,
  startingShields: 1,
  healingBonus: 0.05,
};

const LOOT_NAMES: Record<LootRarity, string[]> = {
  common: ['Dusty Scroll', 'Cracked Bell', 'Tattered Ribbon', 'Mouse Bone'],
  uncommon: ['Jade Shard', 'Spirit Incense', 'Moon Tea', 'Silver Yarn'],
  rare: ['Phoenix Feather', 'Dragon Scale', 'Void Crystal', 'Ancient Sutra'],
  legendary: ['Celestial Thread', 'Heart of the Pagoda', 'Ninth Life Fragment'],
  mythic: ['Snoot Prime Shard', 'Tear of the Cat God', 'Eternal Catnip Essence'],
};

function randomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function rollWeighted<T extends string>(weights: Record<T, { weight: number }>): T {
  const entries = Object.entries(weights) as [T, { weight: number }][];
  const total = entries.reduce((s, [, v]) => s + v.weight, 0);
  let roll = Math.random() * total;
  for (const [key, val] of entries) {
    roll -= val.weight;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

export class PagodaSystem {
  // Persistent state
  highestFloor: number = 0;
  tokens: number = 0;
  upgrades: Record<UpgradeType, number> = {
    maxHpBonus: 0,
    damageBonus: 0,
    defenseBonus: 0,
    startingShields: 0,
    healingBonus: 0,
  };
  stats = {
    totalRuns: 0,
    totalFloors: 0,
    totalKills: 0,
    totalDeaths: 0,
    bossKills: 0,
    highestDamage: 0,
  };
  runHistory: RunRecord[] = [];
  unlockedSkills: string[] = [];

  // Run state
  inRun: boolean = false;
  currentFloor: number = 0;
  combatState: CombatState = 'idle';
  player: PlayerState = this.emptyPlayer();
  enemy: ActiveEnemy | null = null;
  cooldowns: Record<string, number> = {};
  rewards: { bp: number; tokens: number; spiritStones: number; items: LootItem[] } = { bp: 0, tokens: 0, spiritStones: 0, items: [] };
  floorModifiers: FloorModifier[] = [];
  startTime: number = 0;
  usedOncePerRun: Set<string> = new Set();
  private commandDamageMultipliers: Record<string, number> = {};

  private emptyPlayer(): PlayerState {
    return {
      hp: 100, maxHp: 100, damage: 10, defense: 5,
      crit: 0.1, critMult: 2.0,
      shieldCharges: 0, dodgeCharges: 0,
      buffs: [], debuffs: [],
    };
  }

  startRun(selectedCatStats: { hp: number; attack: number; defense: number; crit?: number; critMult?: number }[]): { success: boolean; error?: string } {
    if (this.inRun) return { success: false, error: 'Already in a run' };

    const totalCatHp = selectedCatStats.reduce((s, c) => s + c.hp, 0);
    const totalCatAtk = selectedCatStats.reduce((s, c) => s + c.attack, 0);
    const totalCatDef = selectedCatStats.reduce((s, c) => s + c.defense, 0);
    const averageCrit = selectedCatStats.length > 0
      ? selectedCatStats.reduce((s, c) => s + (c.crit ?? 0.1), 0) / selectedCatStats.length
      : 0.1;
    const averageCritMult = selectedCatStats.length > 0
      ? selectedCatStats.reduce((s, c) => s + (c.critMult ?? 2), 0) / selectedCatStats.length
      : 2;

    const baseHp = 100 + totalCatHp + this.upgrades.maxHpBonus * UPGRADE_VALUES.maxHpBonus;
    const baseDmg = 10 + totalCatAtk + this.upgrades.damageBonus * UPGRADE_VALUES.damageBonus;
    const baseDef = 5 + totalCatDef + this.upgrades.defenseBonus * UPGRADE_VALUES.defenseBonus;

    this.player = {
      hp: baseHp, maxHp: baseHp,
      damage: baseDmg, defense: baseDef,
      crit: Math.min(0.75, Math.max(0, averageCrit)),
      critMult: Math.min(4.5, Math.max(1.2, averageCritMult)),
      shieldCharges: this.upgrades.startingShields * UPGRADE_VALUES.startingShields,
      dodgeCharges: 0,
      buffs: [], debuffs: [],
    };

    this.inRun = true;
    this.currentFloor = 0;
    this.combatState = 'idle';
    this.enemy = null;
    this.cooldowns = {};
    this.rewards = { bp: 0, tokens: 0, spiritStones: 0, items: [] };
    this.floorModifiers = [];
    this.startTime = Date.now();
    this.usedOncePerRun = new Set();
    this.stats.totalRuns++;

    return { success: true };
  }

  advanceFloor(): { floor: number; enemy: ActiveEnemy; modifier?: FloorModifier } | { error: string } {
    if (!this.inRun) return { error: 'No active run' };

    this.currentFloor++;
    this.tickCooldowns();
    this.applyPostFightHeal();

    if (this.currentFloor % 5 === 0 && this.currentFloor % 10 !== 0) {
      this.addFloorModifier();
    }

    if (this.currentFloor % 10 === 0) {
      this.spawnBoss();
    } else {
      this.spawnEnemy();
    }

    this.combatState = 'selecting';
    this.stats.totalFloors++;

    const lastMod = this.currentFloor % 5 === 0 && this.currentFloor % 10 !== 0
      ? this.floorModifiers[this.floorModifiers.length - 1]
      : undefined;

    return { floor: this.currentFloor, enemy: this.enemy!, modifier: lastMod };
  }

  spawnEnemy(): void {
    const eligible = PAGODA_ENEMIES.filter(
      e => this.currentFloor >= e.floorRange[0] && this.currentFloor <= e.floorRange[1]
    );
    // If no eligible enemies (floor > max range), use highest tier
    const pool = eligible.length > 0 ? eligible : PAGODA_ENEMIES.filter(e => e.floorRange[1] === 100);
    const template = pool[Math.floor(Math.random() * pool.length)];
    const scale = 1 + (this.currentFloor - 1) * 0.1;

    this.enemy = {
      templateId: template.id,
      name: template.name,
      emoji: template.emoji,
      hp: Math.floor(template.baseHp * scale),
      maxHp: Math.floor(template.baseHp * scale),
      damage: Math.floor(template.baseDamage * scale),
      defense: Math.floor(template.baseDefense * scale),
      speed: template.speed,
      element: template.element,
      isBoss: false,
      phase: 1,
      maxPhases: 1,
      buffs: [],
      debuffs: [],
    };

    this.applyModifiersToEnemy();
  }

  spawnBoss(): void {
    const boss = PAGODA_BOSSES.find(b => b.floor === this.currentFloor)
      || PAGODA_BOSSES[PAGODA_BOSSES.length - 1];
    const scale = 1 + (this.currentFloor / 10 - 1) * 0.2;

    this.enemy = {
      templateId: boss.id,
      name: boss.name,
      emoji: boss.emoji,
      hp: Math.floor(boss.baseHp * scale),
      maxHp: Math.floor(boss.baseHp * scale),
      damage: Math.floor(boss.baseDamage * scale),
      defense: Math.floor(boss.baseDefense * scale),
      speed: boss.speed,
      element: boss.element,
      isBoss: true,
      phase: 1,
      maxPhases: boss.phases,
      buffs: [],
      debuffs: [],
    };

    this.applyModifiersToEnemy();
  }

  private applyModifiersToEnemy(): void {
    if (!this.enemy) return;
    for (const mod of this.floorModifiers) {
      if (mod.effect.enemyDamage) {
        this.enemy.damage = Math.floor(this.enemy.damage * (1 + mod.effect.enemyDamage));
      }
      if (mod.effect.enemyDefense) {
        this.enemy.defense = Math.floor(this.enemy.defense * (1 + mod.effect.enemyDefense));
      }
    }
  }

  executeCommand(commandId: string): {
    success: boolean;
    error?: string;
    playerAction?: Record<string, unknown>;
    enemyAction?: Record<string, unknown>;
    combatState?: CombatState;
  } {
    if (!this.inRun || !this.enemy) return { success: false, error: 'No active combat' };
    if (this.combatState !== 'selecting') return { success: false, error: 'Not your turn' };

    const cmd = BOOP_COMMANDS.find(c => c.id === commandId);
    if (!cmd) return { success: false, error: 'Unknown command' };

    if (cmd.unlockFloor > this.highestFloor) return { success: false, error: 'Skill not unlocked' };
    if (cmd.oncePerRun && this.usedOncePerRun.has(cmd.id)) return { success: false, error: 'Already used this run' };
    if (this.cooldowns[cmd.id] && this.cooldowns[cmd.id] > 0) return { success: false, error: `On cooldown (${this.cooldowns[cmd.id]} turns)` };

    this.combatState = 'player_turn';
    if (cmd.oncePerRun) this.usedOncePerRun.add(cmd.id);
    if (cmd.cooldown > 0) {
      const cdReduction = this.getModifierValue('cooldownReduction');
      this.cooldowns[cmd.id] = Math.max(1, Math.floor(cmd.cooldown * (1 - cdReduction)));
    }

    const playerResult = this.resolvePlayerAction(cmd);

    // Check if enemy is dead
    if (this.enemy && this.enemy.hp <= 0) {
      const defeated = this.onEnemyDefeated();
      Object.assign(playerResult, defeated);
      return { success: true, playerAction: playerResult, combatState: this.combatState, ...defeated };
    }

    // Flee check
    if (playerResult.fled) {
      this.combatState = 'fled';
      this.endRun('fled');
      return { success: true, playerAction: playerResult, combatState: 'fled' };
    }

    // Enemy turn
    const enemyResult = this.enemyTurn();

    if (this.player.hp <= 0) {
      this.combatState = 'defeat';
      this.stats.totalDeaths++;
      this.endRun('defeat');
      return { success: true, playerAction: playerResult, enemyAction: enemyResult, combatState: 'defeat' };
    }

    this.combatState = 'selecting';
    return { success: true, playerAction: playerResult, enemyAction: enemyResult, combatState: 'selecting' };
  }

  private resolvePlayerAction(cmd: BoopCommand): Record<string, unknown> {
    const eff = cmd.effect;
    const result: Record<string, unknown> = { commandId: cmd.id, type: eff.type };

    switch (eff.type) {
      case 'damage': {
        if (cmd.id === 'keyboard_smash') {
          const randomDmg = Math.floor(Math.random() * 999) + 1;
          const { dealt } = this.dealDamageToEnemy(randomDmg, false, null);
          result.damage = dealt;
          result.random = true;
          break;
        }
        const hits = eff.hitCount || 1;
        const commandDamageMult = this.commandDamageMultipliers[cmd.id] ?? 1;
        let totalDealt = 0;
        const hitResults: number[] = [];
        for (let i = 0; i < hits; i++) {
          const { dealt } = this.playerAttack((eff.multiplier || 1.0) * commandDamageMult, eff.guaranteedCrit, eff.element || null);
          totalDealt += dealt;
          hitResults.push(dealt);
        }
        if (eff.lifesteal && eff.lifesteal > 0) {
          const healed = Math.floor(totalDealt * eff.lifesteal);
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + healed);
          result.healed = healed;
        }
        if (eff.selfDamagePercent && eff.selfDamagePercent > 0) {
          const selfDmg = Math.floor(this.player.maxHp * eff.selfDamagePercent);
          this.player.hp = Math.max(1, this.player.hp - selfDmg);
          result.selfDamage = selfDmg;
        }
        if (eff.stunChance && Math.random() < eff.stunChance && this.enemy) {
          this.enemy.debuffs.push({ id: 'stun', stat: 'stun', value: 1, turnsLeft: 1 });
          result.stunned = true;
        }
        result.damage = totalDealt;
        result.hits = hitResults;
        break;
      }
      case 'heal': {
        const healMult = 1 + this.upgrades.healingBonus * UPGRADE_VALUES.healingBonus;
        const amount = Math.floor(this.player.maxHp * (eff.healPercent || 0) * healMult);
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + amount);
        result.healed = amount;
        break;
      }
      case 'shield': {
        this.player.shieldCharges += eff.shieldCount || 1;
        result.shields = this.player.shieldCharges;
        break;
      }
      case 'flee': {
        result.fled = true;
        break;
      }
      case 'buff': {
        this.player.buffs.push({
          id: cmd.id,
          stat: eff.stat || 'damage',
          value: eff.value || 0,
          turnsLeft: eff.duration || 3,
        });
        result.buffApplied = eff.stat;
        break;
      }
      case 'debuff': {
        if (this.enemy) {
          this.enemy.debuffs.push({
            id: cmd.id,
            stat: eff.stat || 'damage',
            value: eff.value || 0,
            turnsLeft: eff.duration || 3,
          });
          result.debuffApplied = eff.stat;
        }
        break;
      }
      case 'special': {
        if (eff.dodgeCount) {
          this.player.dodgeCharges += eff.dodgeCount;
          result.dodgeCharges = this.player.dodgeCharges;
        }
        if (eff.counterChance) {
          this.player.buffs.push({
            id: 'counter_' + cmd.id,
            stat: 'counter',
            value: eff.counterChance,
            turnsLeft: eff.duration || 2,
          });
          result.counterReady = true;
        }
        if (eff.reflect) {
          this.player.buffs.push({
            id: 'reflect_' + cmd.id,
            stat: 'reflect',
            value: eff.reflect,
            turnsLeft: eff.duration || 2,
          });
          result.reflectReady = true;
        }
        if (eff.stunChance && !eff.dodgeCount && !eff.counterChance && !eff.reflect) {
          // Intimidating Loaf
          if (Math.random() < eff.stunChance && this.enemy) {
            this.enemy.debuffs.push({ id: 'stun', stat: 'stun', value: 1, turnsLeft: 1 });
            result.stunned = true;
          } else {
            result.whiffed = true;
          }
        }
        break;
      }
    }

    return result;
  }

  playerAttack(multiplier: number, guaranteedCrit?: boolean, element?: Element): { dealt: number; crit: boolean } {
    const buffedDmg = this.getBuffedStat(this.player.damage, 'damage', this.player.buffs);
    let dmg = buffedDmg * multiplier;

    const critBonus = this.getModifierValue('critDamageBonus');
    const isCrit = guaranteedCrit || Math.random() < this.player.crit;
    if (isCrit) {
      dmg *= this.player.critMult + critBonus;
    }

    return this.dealDamageToEnemy(Math.floor(dmg), isCrit, element);
  }

  setCommandDamageMultiplier(commandId: string, multiplier: number): void {
    this.commandDamageMultipliers[commandId] = Math.max(0.1, multiplier);
  }

  private dealDamageToEnemy(rawDamage: number, isCrit: boolean, element?: Element): { dealt: number; crit: boolean } {
    if (!this.enemy) return { dealt: 0, crit: isCrit };

    let def = this.getBuffedStat(this.enemy.defense, 'defense', this.enemy.buffs, this.enemy.debuffs);

    // Void strike halves defense
    if (element === 'void') {
      def = Math.floor(def * 0.5);
    }

    let dealt = Math.max(1, rawDamage - Math.floor(def * 0.5));

    // Element advantage
    if (element && this.enemy.element) {
      if (ELEMENT_CHART[element]?.includes(this.enemy.element)) {
        dealt = Math.floor(dealt * 1.5);
      } else if (ELEMENT_CHART[this.enemy.element]?.includes(element)) {
        dealt = Math.floor(dealt * 0.75);
      }
    }

    this.enemy.hp = Math.max(0, this.enemy.hp - dealt);
    this.stats.highestDamage = Math.max(this.stats.highestDamage, dealt);

    // Boss phase transition
    if (this.enemy.isBoss && this.enemy.phase < this.enemy.maxPhases) {
      const phaseThreshold = this.enemy.maxHp * (1 - this.enemy.phase / this.enemy.maxPhases);
      if (this.enemy.hp <= phaseThreshold && this.enemy.hp > 0) {
        this.enemy.phase++;
        this.enemy.damage = Math.floor(this.enemy.damage * 1.2);
        this.enemy.speed *= 1.1;
      }
    }

    return { dealt, crit: isCrit };
  }

  enemyTurn(): Record<string, unknown> {
    if (!this.enemy || this.enemy.hp <= 0) return { skipped: true };

    // Tick player buffs/debuffs
    this.player.buffs = this.player.buffs.filter(b => { b.turnsLeft--; return b.turnsLeft > 0; });
    this.player.debuffs = this.player.debuffs.filter(d => { d.turnsLeft--; return d.turnsLeft > 0; });

    // Check enemy stun
    const stunIdx = this.enemy.debuffs.findIndex(d => d.stat === 'stun');
    if (stunIdx >= 0) {
      this.enemy.debuffs.splice(stunIdx, 1);
      return { stunned: true };
    }

    // Tick enemy buffs/debuffs
    this.enemy.buffs = this.enemy.buffs.filter(b => { b.turnsLeft--; return b.turnsLeft > 0; });
    this.enemy.debuffs = this.enemy.debuffs.filter(d => { d.turnsLeft--; return d.turnsLeft > 0; });

    // Calculate enemy damage
    const enemyDmg = this.getBuffedStat(this.enemy.damage, 'damage', this.enemy.buffs, this.enemy.debuffs);

    // Dodge check
    if (this.player.dodgeCharges > 0) {
      this.player.dodgeCharges--;
      return { dodged: true, dodgeChargesLeft: this.player.dodgeCharges };
    }

    // Counter check
    const counterBuff = this.player.buffs.find(b => b.stat === 'counter');
    if (counterBuff && Math.random() < counterBuff.value) {
      const counterDmg = Math.floor(this.player.damage * 0.5);
      this.enemy.hp = Math.max(0, this.enemy.hp - counterDmg);
      return { countered: true, counterDamage: counterDmg };
    }

    // Shield check
    if (this.player.shieldCharges > 0) {
      this.player.shieldCharges--;
      return { shielded: true, shieldChargesLeft: this.player.shieldCharges };
    }

    // Defense calculation
    const playerDef = this.getBuffedStat(this.player.defense, 'defense', this.player.buffs, this.player.debuffs);
    const incoming = Math.max(1, enemyDmg - Math.floor(playerDef * 0.5));

    // Reflect
    const reflectBuff = this.player.buffs.find(b => b.stat === 'reflect');
    let reflected = 0;
    if (reflectBuff) {
      reflected = Math.floor(incoming * reflectBuff.value);
      this.enemy.hp = Math.max(0, this.enemy.hp - reflected);
    }

    this.player.hp = Math.max(0, this.player.hp - incoming);

    return { damage: incoming, reflected, enemyHp: this.enemy.hp, playerHp: this.player.hp };
  }

  private onEnemyDefeated(): Record<string, unknown> {
    if (!this.enemy) return {};

    this.stats.totalKills++;
    const result: Record<string, unknown> = { enemyDefeated: true, enemyName: this.enemy.name };

    if (this.enemy.isBoss) {
      this.stats.bossKills++;
      const bossTemplate = PAGODA_BOSSES.find(b => b.id === this.enemy!.templateId);
      if (bossTemplate) {
        this.rewards.bp += bossTemplate.rewards.bp;
        this.rewards.tokens += bossTemplate.rewards.tokens;
        const spiritStones = Math.max(5, bossTemplate.floor);
        this.rewards.spiritStones += spiritStones;
        result.bossRewards = { ...bossTemplate.rewards, spiritStones };
      }
    } else {
      const floorBp = this.getFloorBpReward(this.currentFloor);
      const spiritStones = Math.floor(this.currentFloor / 3);
      this.rewards.bp += floorBp;
      result.bpEarned = floorBp;
      if (spiritStones > 0) {
        this.rewards.spiritStones += spiritStones;
        result.spiritStonesEarned = spiritStones;
      }

      // Token chance from regular enemies
      if (Math.random() < 0.1) {
        this.rewards.tokens += 1;
        result.tokenEarned = true;
      }
    }

    // Loot
    const template = PAGODA_ENEMIES.find(e => e.id === this.enemy!.templateId);
    const dropChance = template?.dropChance ?? 0.3;
    const lootMult = 1 + this.getModifierValue('lootMultiplier');
    if (Math.random() < dropChance * lootMult) {
      const item = this.generateLoot();
      this.rewards.items.push(item);
      result.loot = item;
    }

    if (this.currentFloor > this.highestFloor) {
      this.highestFloor = this.currentFloor;
    }

    // Unlock skills at this floor
    for (const cmd of BOOP_COMMANDS) {
      if (cmd.unlockFloor <= this.highestFloor && !this.unlockedSkills.includes(cmd.id)) {
        this.unlockedSkills.push(cmd.id);
      }
    }

    this.enemy = null;
    this.combatState = 'victory';
    return result;
  }

  private getFloorBpReward(floor: number): number {
    return Math.floor(20 * floor * (1 + floor / 20));
  }

  endRun(reason: string): RunRecord {
    const record: RunRecord = {
      id: randomId(),
      timestamp: Date.now(),
      floorsCleared: this.currentFloor,
      reason,
      rewards: { ...this.rewards, items: [...this.rewards.items] },
      duration: Date.now() - this.startTime,
    };

    this.runHistory.unshift(record);
    if (this.runHistory.length > 50) {
      this.runHistory = this.runHistory.slice(0, 50);
    }

    // Apply tokens
    this.tokens += this.rewards.tokens;

    this.inRun = false;
    this.combatState = 'idle';
    this.enemy = null;

    return record;
  }

  purchaseUpgrade(type: UpgradeType): { success: boolean; cost?: number; level?: number; error?: string } {
    const currentLevel = this.upgrades[type];
    const baseCost = UPGRADE_BASE_COSTS[type];
    const cost = Math.floor(baseCost * Math.pow(1.5, currentLevel));

    if (this.tokens < cost) return { success: false, error: `Need ${cost} tokens, have ${this.tokens}` };

    this.tokens -= cost;
    this.upgrades[type]++;

    return { success: true, cost, level: this.upgrades[type] };
  }

  getUpgradeCost(type: UpgradeType): number {
    return Math.floor(UPGRADE_BASE_COSTS[type] * Math.pow(1.5, this.upgrades[type]));
  }

  autoClear(targetFloor: number): { floorsCleared: number; rewards: { bp: number; tokens: number; spiritStones: number } } | { error: string } {
    if (this.inRun) return { error: 'Already in a run' };
    const maxAuto = Math.max(0, this.highestFloor - 1);
    const floor = Math.min(targetFloor, maxAuto);
    if (floor <= 0) return { error: 'No floors available to auto-clear' };

    let bp = 0;
    let tokens = 0;
    let spiritStones = 0;
    for (let f = 1; f <= floor; f++) {
      bp += Math.floor(this.getFloorBpReward(f) * 0.5); // 50% reward rate
      spiritStones += Math.floor(Math.floor(f / 3) * 0.5);
      if (f % 10 === 0) {
        const boss = PAGODA_BOSSES.find(b => b.floor === f);
        if (boss) {
          bp += Math.floor(boss.rewards.bp * 0.5);
          tokens += Math.floor(boss.rewards.tokens * 0.5);
          spiritStones += Math.floor(Math.max(5, boss.floor) * 0.5);
        }
      }
    }

    this.tokens += tokens;
    return { floorsCleared: floor, rewards: { bp, tokens, spiritStones } };
  }

  addFloorModifier(): void {
    const available = FLOOR_MODIFIERS.filter(m => !this.floorModifiers.find(fm => fm.id === m.id));
    const pool = available.length > 0 ? available : FLOOR_MODIFIERS;
    const mod = pool[Math.floor(Math.random() * pool.length)];
    this.floorModifiers.push({ ...mod });
  }

  getAvailableCommands(): BoopCommand[] {
    return BOOP_COMMANDS.filter(cmd => {
      if (cmd.unlockFloor > this.highestFloor) return false;
      if (cmd.oncePerRun && this.usedOncePerRun.has(cmd.id)) return false;
      if (this.cooldowns[cmd.id] && this.cooldowns[cmd.id] > 0) return false;
      return true;
    });
  }

  getAllCommands(): (BoopCommand & { locked: boolean; onCooldown: boolean; cooldownLeft: number; used: boolean })[] {
    return BOOP_COMMANDS.map(cmd => ({
      ...cmd,
      locked: cmd.unlockFloor > this.highestFloor,
      onCooldown: (this.cooldowns[cmd.id] || 0) > 0,
      cooldownLeft: this.cooldowns[cmd.id] || 0,
      used: cmd.oncePerRun && this.usedOncePerRun.has(cmd.id),
    }));
  }

  private generateLoot(): LootItem {
    const rarity = rollWeighted(LOOT_RARITIES);
    const names = LOOT_NAMES[rarity];
    const name = names[Math.floor(Math.random() * names.length)];
    const value = Math.floor(this.currentFloor * 10 * LOOT_RARITIES[rarity].multiplier);

    return { id: randomId(), name, rarity, floor: this.currentFloor, value };
  }

  private tickCooldowns(): void {
    for (const key of Object.keys(this.cooldowns)) {
      if (this.cooldowns[key] > 0) this.cooldowns[key]--;
    }
  }

  private applyPostFightHeal(): void {
    const healRate = this.getModifierValue('postFightHeal');
    if (healRate > 0) {
      const amount = Math.floor(this.player.maxHp * healRate);
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + amount);
    }
  }

  private getModifierValue(key: string): number {
    let total = 0;
    for (const mod of this.floorModifiers) {
      if (mod.effect[key]) total += mod.effect[key];
    }
    return total;
  }

  private getBuffedStat(base: number, stat: string, buffs: Buff[], debuffs?: Debuff[]): number {
    let mult = 1;
    for (const b of buffs) {
      if (b.stat === stat) mult += b.value;
    }
    if (debuffs) {
      for (const d of debuffs) {
        if (d.stat === stat) mult -= d.value;
      }
    }
    return Math.max(0, Math.floor(base * Math.max(0.1, mult)));
  }

  serialize(): PagodaPersistent & { run?: unknown } {
    const persistent: PagodaPersistent & { run?: unknown } = {
      highestFloor: this.highestFloor,
      tokens: this.tokens,
      upgrades: { ...this.upgrades },
      stats: { ...this.stats },
      runHistory: this.runHistory.map(r => ({ ...r, rewards: { ...r.rewards, items: [...r.rewards.items] } })),
      unlockedSkills: [...this.unlockedSkills],
    };

    if (this.inRun) {
      persistent.run = {
        inRun: true,
        currentFloor: this.currentFloor,
        combatState: this.combatState,
        player: {
          ...this.player,
          buffs: this.player.buffs.map(b => ({ ...b })),
          debuffs: this.player.debuffs.map(d => ({ ...d })),
        },
        enemy: this.enemy ? {
          ...this.enemy,
          buffs: this.enemy.buffs.map(b => ({ ...b })),
          debuffs: this.enemy.debuffs.map(d => ({ ...d })),
        } : null,
        cooldowns: { ...this.cooldowns },
        rewards: { ...this.rewards, items: [...this.rewards.items] },
        floorModifiers: this.floorModifiers.map(m => ({ ...m, effect: { ...m.effect } })),
        startTime: this.startTime,
        usedOncePerRun: [...this.usedOncePerRun],
      };
    }

    return persistent;
  }

  deserialize(data: ReturnType<PagodaSystem['serialize']>): void {
    this.highestFloor = data.highestFloor ?? 0;
    this.tokens = data.tokens ?? 0;
    this.upgrades = {
      maxHpBonus: data.upgrades?.maxHpBonus ?? 0,
      damageBonus: data.upgrades?.damageBonus ?? 0,
      defenseBonus: data.upgrades?.defenseBonus ?? 0,
      startingShields: data.upgrades?.startingShields ?? 0,
      healingBonus: data.upgrades?.healingBonus ?? 0,
    };
    this.stats = {
      totalRuns: data.stats?.totalRuns ?? 0,
      totalFloors: data.stats?.totalFloors ?? 0,
      totalKills: data.stats?.totalKills ?? 0,
      totalDeaths: data.stats?.totalDeaths ?? 0,
      bossKills: data.stats?.bossKills ?? 0,
      highestDamage: data.stats?.highestDamage ?? 0,
    };
    this.runHistory = (data.runHistory ?? []).map((run) => ({
      ...run,
      rewards: {
        ...run.rewards,
        spiritStones: run.rewards.spiritStones ?? 0,
        items: [...(run.rewards.items ?? [])],
      },
    }));
    this.unlockedSkills = data.unlockedSkills ?? [];

    if (data.run && typeof data.run === 'object') {
      const run = data.run as Record<string, unknown>;
      this.inRun = true;
      this.currentFloor = (run.currentFloor as number) ?? 0;
      this.combatState = (run.combatState as CombatState) ?? 'idle';
      this.player = (run.player as PlayerState) ?? this.emptyPlayer();
      this.enemy = (run.enemy as ActiveEnemy | null) ?? null;
      this.cooldowns = (run.cooldowns as Record<string, number>) ?? {};
      const rewards = run.rewards as Partial<{ bp: number; tokens: number; spiritStones: number; items: LootItem[] }> | undefined;
      this.rewards = {
        bp: rewards?.bp ?? 0,
        tokens: rewards?.tokens ?? 0,
        spiritStones: rewards?.spiritStones ?? 0,
        items: rewards?.items ?? [],
      };
      this.floorModifiers = (run.floorModifiers as FloorModifier[]) ?? [];
      this.startTime = (run.startTime as number) ?? Date.now();
      this.usedOncePerRun = new Set((run.usedOncePerRun as string[]) ?? []);
    } else {
      this.inRun = false;
      this.currentFloor = 0;
      this.combatState = 'idle';
      this.player = this.emptyPlayer();
      this.enemy = null;
      this.cooldowns = {};
      this.rewards = { bp: 0, tokens: 0, spiritStones: 0, items: [] };
      this.floorModifiers = [];
      this.startTime = 0;
      this.usedOncePerRun = new Set();
    }
  }
}
