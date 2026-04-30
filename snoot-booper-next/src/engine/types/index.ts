/**
 * Snoot Booper: Type Definitions
 * All TypeScript interfaces for the game engine.
 * Engine has ZERO React imports — pure game logic types.
 */

// ─── Masters ───────────────────────────────────────────────

export type MasterId = 'gerald' | 'rusty' | 'steve' | 'andrew' | 'nik' | 'yuelin' | 'scott' | 'mythic';

export interface MasterPassive {
  name: string;
  description: string;
  effect: Record<string, number | boolean>;
}

export interface Master {
  id: MasterId;
  name: string;
  title: string;
  role: string;
  description: string;
  passive: MasterPassive;
  sprite: string;
  color: string;
  quotes: string[];
}

// ─── Currencies ────────────────────────────────────────────

export type CurrencyId =
  | 'bp'           // Boop Points
  | 'pp'           // Purr Power
  | 'qi'           // Qi (energy, capped)
  | 'jadeCatnip'   // Premium
  | 'spiritStones' // Dungeon reward
  | 'heavenlySeals'// Prestige tier 1
  | 'sectReputation'// Social
  | 'waifuTokens'  // Relationship
  | 'gooseFeathers';// Humor + real benefits

export type Currencies = Record<CurrencyId, number>;

// ─── Cats ──────────────────────────────────────────────────

export type CatRealmId = 'kittenMortal' | 'earthKitten' | 'skyKitten' | 'heavenKitten' | 'divineBeast' | 'celestialBeast' | 'cosmicEntity';
export type CatSchool = string; // 25+ schools in data, keep flexible
export type ElementType = 'metal' | 'wood' | 'water' | 'fire' | 'earth' | 'void' | 'chaos';
export type CatPersonality = 'disciplined' | 'lazy' | 'playful' | 'mysterious' | 'brave' | 'gluttonous';

export interface CatStats {
  snootMeridians: number;
  innerPurr: number;
  floofArmor: number;
  zoomieSteps: number;
  loafMastery: number;
  courage?: number;
}

export interface CatTechniques {
  active: (string | null)[];   // 4 slots
  passive: (string | null)[];  // 2 slots
}

export interface Cat {
  id: string;                   // template id
  instanceId: string;           // unique per owned cat
  name: string;
  school: CatSchool;
  realm: CatRealmId;
  element: ElementType;
  personality: CatPersonality;
  description: string;
  stats: CatStats;              // calculated final stats
  baseStats: CatStats;          // template stats
  statVariation: Record<string, number>; // 0.9-1.1 per stat
  calculatedStats: Record<string, number>;
  happiness: number;            // 0-100
  level: number;                // cultivation level within realm (1-9)
  stars: number;                // 1-6
  cultivationXP: number;
  techniques: CatTechniques;
  learnedTechniques: string[];
  techniqueXP: Record<string, number>;
  equipment: Record<string, string | null>;
  braveHeart: boolean;
  legendary: boolean;
  mythic?: boolean;
  obtainedAt: number;
  totalBoops: number;
  emoji?: string;
  quotes?: string[];
  // 3D world
  position?: { x: number; y: number; z: number };
}

// ─── Waifus ────────────────────────────────────────────────

export type WaifuId = 'mochi' | 'luna' | 'nyanta' | 'sakura' | 'mei' | 'yuki';

export interface WaifuBonus {
  type: string;
  value: number;
  description: string;
}

export interface Waifu {
  id: WaifuId;
  name: string;
  title: string;
  role: string;
  cultivationStyle: string;
  bonus: WaifuBonus;
  unlockCondition: string | { type: string; value: number };
  maxBondReward: string;
  giftAffinities: {
    loves: string[];
    likes: string[];
    neutral: string[];
    dislikes: string[];
  };
  dialogues: Record<string, string[]>;
  sprite: string;
  color: string;
  // Runtime state
  bondLevel: number;
  giftsGiven: number;
  dialogueUnlocked: string[];
  unlocked: boolean;
}

// ─── Equipment ─────────────────────────────────────────────

export type EquipmentSlot = 'hat' | 'collar' | 'weapon' | 'armor' | 'paws' | 'tail';
export type EquipmentRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface EquipmentPassive {
  name: string;
  effect: string;
  value: number | boolean;
  condition?: string;
  multiplier?: number;
}

export interface Equipment {
  id: string;
  instanceId: number;
  name: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  stats: Record<string, number>;
  passive?: EquipmentPassive;
  setId?: string;
  exclusiveTo?: string;
  lore?: string;
  level: number;
}

export interface EquipmentSet {
  name: string;
  pieces: string[];
  bonuses: Record<string | number, { description: string; effect?: string; [key: string]: unknown }>;
}

// ─── Goose ─────────────────────────────────────────────────

export type GooseMood = 'calm' | 'suspicious' | 'aggressive' | 'rage';
export type GooseAllyType = 'guard' | 'attack' | 'chaos' | 'honk';

export interface GooseMoodStats {
  speed: number;
  dodgeChance: number;
  rewardMult: number;
}

export interface Goose {
  id: string;
  name: string;
  title: string;
  description: string;
  mood: GooseMood;
  moodStats: GooseMoodStats;
  position: { x: number; y: number };
  hp: number;
  special?: string;
  drops: string[];
  legendary: boolean;
}

export interface GooseAlly {
  id: GooseAllyType;
  name: string;
  description: string;
  effect: Record<string, number | boolean>;
  quote: string;
}

// ─── Dungeons ──────────────────────────────────────────────

export type FloorType = 'combat' | 'elite' | 'boss' | 'treasure' | 'event' | 'shop';

export interface DungeonEnemy {
  id: string;
  name: string;
  currentHP: number;
  maxHP: number;
  attack: number;
  defense: number;
  speed: number;
  abilities: string[];
}

export interface DungeonFloor {
  number: number;
  type: FloorType;
  enemies: DungeonEnemy[];
  completed: boolean;
  loot: LootItem[];
}

export interface DungeonRun {
  id: string;
  party: DungeonParty;
  floor: number;
  currentFloor: DungeonFloor | null;
  loot: LootItem[];
  relics: string[];
  qiMeter: number;
  maxQi: number;
  checkpointFloor: number;
  deathDefiances: number;
  startTime: number;
}

export interface DungeonParty {
  cats: Cat[];
  waifu: Waifu | null;
  goose: GooseAlly | null;
  formation: string;
}

export type BoopCommand = 'powerBoop' | 'healingBoop' | 'shieldBoop' | 'megaBoop' | 'emergencyBoop';

// ─── Loot / Items ──────────────────────────────────────────

export interface LootItem {
  id: string;
  type: 'equipment' | 'material' | 'currency' | 'blueprint' | 'cosmetic' | 'relic';
  quantity: number;
  data?: unknown;
}

// ─── Relics ────────────────────────────────────────────────

export interface Relic {
  id: string;
  name: string;
  rarity: EquipmentRarity;
  effect: RelicEffect;
  description: string;
  flavor?: string;
}

export interface RelicEffect {
  type: string;
  value: number | boolean;
  effects?: RelicEffect[];
}

// ─── Cultivation / Progression ─────────────────────────────

export type CultivationRealm =
  | 'mortal'
  | 'qi_condensation'
  | 'foundation'
  | 'core_formation'
  | 'nascent_soul'
  | 'dao_seeking'
  | 'tribulation'
  | 'immortal'
  | 'heavenly_sovereign';

export interface CultivationState {
  currentRealm: CultivationRealm;
  currentRank: number;
  cultivationXP: number;
  totalCultivationXP: number;
  passivesUnlocked: string[];
  unlockedContent: string[];
  tribulationAttempts: Record<string, number>;
  severingChoices: Record<string, string>;
  daoWounds: number;
  permanentScars: number;
}

// ─── Buildings ─────────────────────────────────────────────

export type TerritoryId = 'humble_courtyard' | 'mountain_sanctuary' | 'floating_palace' | 'celestial_realm';

export interface BuildingState {
  buildings: Record<string, number>;  // buildingId -> level
  currentTerritory: TerritoryId;
  unlockedTerritories: TerritoryId[];
}

// ─── Prestige ──────────────────────────────────────────────

export interface PrestigeState {
  // Tier 1: Ascension
  currentTier: number;
  totalRebirths: number;
  lifetimeBP: number;
  unlockedPerks: string[];
  heavenlySeals: number;

  // Tier 2: Reincarnation
  reincarnationCount: number;
  karmaPoints: number;
  pastLifeMemory: string | null;
  karmaShopPurchases: Record<string, number>;
  maxWaifuBonds: Record<string, number>;
  maxRealmReached: string;
  lifetimeBoops: number;
  lifetimeGooseBoops: number;

  // Tier 3: Transcendence
  transcendenceCount: number;
  transcendencePoints: number;
  celestialUnlocks: string[];
}

// ─── Upgrades ──────────────────────────────────────────────

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  costCurrency: CurrencyId;
  costScale: number;
  maxLevel: number;
  currentLevel: number;
  effects: Record<string, number>;
  category: string;
  unlockCondition?: string;
}

// ─── Events ────────────────────────────────────────────────

export interface GameEvent {
  id: string;
  type: string;
  message: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
  bpBonus?: number;
  ppBonus?: number;
  happinessBonus?: number;
  permanentBonus?: { type: string; value: number };
  temporaryBonus?: { type: string; value: number; duration: number };
}

// ─── Achievements ──────────────────────────────────────────

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: string;
  reward?: { type: string; value: number | string };
  unlocked: boolean;
  unlockedAt?: number;
}

// ─── Game Stats ────────────────────────────────────────────

export interface GameStats {
  totalBoops: number;
  maxCombo: number;
  playtime: number;
  criticalBoops: number;
  gooseBoops: number;
  totalAfkTime: number;
  rageGooseBooped: boolean;
  goldenGooseCrit: boolean;
  catsRecruited: number;
  gooseCriticals: number;
}

// ─── Modifiers (aggregated bonuses) ────────────────────────

export interface GameModifiers {
  bpMultiplier: number;
  ppMultiplier: number;
  afkMultiplier: number;
  critChanceBonus: number;
  critMultiplier: number;
  catHappinessMultiplier: number;
  eventDiscoveryBonus: number;
  rareCatBonus: number;
  boopSpeedMultiplier: number;
  preventDecay: boolean;
  lootBonus: number;
  qiRegen: number;
  allStats: number;
  boopDamage: number;
}

// ─── Full Save Data (v3.0.0) ──────────────────────────────

export interface SaveDataV3 {
  version: '3.0.0';
  timestamp: number;
  master: MasterId | null;
  resources: Currencies;
  stats: GameStats;

  // System serialized states
  cats: { cats: SerializedCat[]; catIdCounter: number; version: number };
  waifus: { waifus: SerializedWaifu[]; giftHistory: unknown[] };
  upgrades: { upgrades: Record<string, number> };
  goose: SerializedGoose;
  achievements: { unlocked: string[] };
  cultivation: CultivationState;
  buildings: BuildingState;
  prestige: PrestigeState;
  economy: SerializedEconomy;
  equipment: { inventory: unknown[]; equipped: Record<string, unknown>; nextId: number };
  crafting: { materials: Record<string, number>; blueprints: Record<string, boolean>; craftingQueue: unknown[] };
  pagoda: { highestFloor: number; tokens: number; upgrades: Record<string, number>; stats: Record<string, number>; runHistory: unknown[] };
  techniques: { learnedTechniques: string[]; learnedSkills: string[]; cultivationPassives: string[]; legendaryInternals: Record<string, unknown>; consumables: Record<string, number> };
  blessings: { permanentBlessings: string[]; stats: Record<string, number> };
  survival: { stats: Record<string, number>; unlocks: string[] };
  goldenSnoot: { stats: Record<string, number> };
  daily: { commissions: unknown[]; currentStreak: number; stats: Record<string, number> };
  parasites: { parasites: unknown[]; upgrades: Record<string, number>; stats: Record<string, number> };
  time: { stats: Record<string, unknown> };
  events: { eventHistory: unknown[]; weeklyChallenge: unknown; lastWeeklyReset: number | null; triggeredHiddenEvents: string[]; hiddenEventCooldowns: Record<string, number> };
  lore: { collectedFragments: Record<string, number>; unlockedStories: string[]; stats: Record<string, unknown> };
  secrets: { moonClicks: number; discoveredSecrets: string[]; stats: Record<string, number> };
  tournament: { weeklyData: unknown; stats: Record<string, number>; leaderboard: unknown[] };
  dreamRealm: { dreamEssence: number; unlockedCosmetics: string[]; hasWalkerCat: boolean; deepestDream: number; stats: Record<string, number> };
  gooseDimension: { highestFloor: number; stats: Record<string, number>; rewards: Record<string, unknown> };
  memoryFragments: { completedChapters: string[]; unlockedLore: string[]; collectedFragments: Record<string, number>; totalFragmentsCollected: number; stats: Record<string, number> };

  // POST-LAUNCH systems
  irlIntegration: { stats: Record<string, unknown> };
  drama: { drama: number; relations: Record<string, number>; stats: Record<string, number> };
  nemesis: { nemeses: unknown[]; defeatedNemeses: string[]; defectedNemeses: string[]; stats: Record<string, number> };
  catino: { chips: number; stats: Record<string, number> };
  hardcore: { completedModes: string[]; stats: Record<string, number> };
  partners: { ownedPartners: unknown[]; stats: Record<string, number> };

  // Late additions
  sectWar?: Record<string, unknown>;
  idle?: Record<string, unknown>;
}

// Serialized sub-types for save data
export interface SerializedCat {
  id: string;
  instanceId: string;
  name: string;
  school: CatSchool;
  realm: CatRealmId;
  element: ElementType;
  personality: CatPersonality;
  happiness: number;
  level: number;
  stars: number;
  cultivationXP: number;
  statVariation: Record<string, number>;
  techniques: CatTechniques;
  learnedTechniques: string[];
  techniqueXP: Record<string, number>;
  equipment: Record<string, string | null>;
  braveHeart: boolean;
  totalBoops: number;
  obtainedAt: number;
}

export interface SerializedWaifu {
  id: WaifuId;
  bondLevel: number;
  giftsGiven: number;
  dialogueUnlocked: string[];
  unlocked: boolean;
}

export interface SerializedGoose {
  gooseBoops: number;
  cobraChickenDefeated: boolean;
  gooseAlly: GooseAllyType | null;
  goldenFeathers: number;
  gooseCriticals: number;
}

export interface SerializedEconomy {
  currencies: Currencies;
  gooseShopPurchases: Record<string, number>;
  conversionCooldowns: Record<string, number>;
  permanentEffects: Record<string, number>;
  activeEffects: { type: string; value: number; expiresAt: number }[];
  consumables: Record<string, number>;
  stats: { totalEarned: Record<string, number>; totalSpent: Record<string, number>; conversionsPerformed: number; gooseShopPurchases: number };
}

// Legacy save format (v2.6.0) for migration
export interface SaveDataV2 {
  version: string;
  timestamp: number;
  master: string | null;
  resources: {
    bp: number;
    pp: number;
    qi?: number;
    jadeCatnip?: number;
    destinyThreads?: number;
    gooseFeathers?: number;
    goldenFeathers?: number;
    spiritStones?: number;
    heavenlySeals?: number;
    sectReputation?: number;
    waifuTokens?: number;
  };
  stats: Partial<GameStats>;
  cats: unknown;
  waifus: unknown;
  gifts?: unknown;
  upgrades: unknown;
  goose: unknown;
  achievements: unknown;
  prestige: unknown;
  cultivation?: unknown;
  buildings?: unknown;
  economy?: unknown;
  equipment?: unknown;
  crafting?: unknown;
  pagoda?: unknown;
  techniques?: unknown;
  blessings?: unknown;
  survival?: unknown;
  goldenSnoot?: unknown;
  daily?: unknown;
  parasites?: unknown;
  time?: unknown;
  events?: unknown;
  lore?: unknown;
  secrets?: unknown;
  elemental?: unknown;
  tournament?: unknown;
  dreamRealm?: unknown;
  gooseDimension?: unknown;
  memoryFragments?: unknown;
  irlIntegration?: unknown;
  drama?: unknown;
  nemesis?: unknown;
  catino?: unknown;
  hardcore?: unknown;
  partners?: unknown;
}
