// memory-system.ts - Memory Fragments: Story-driven chapters with lore
// "Every master has a past. Every past has a snoot."

// -----------------------------------------------------------------------------
// Enemy definitions
// -----------------------------------------------------------------------------

export interface MemoryEnemy {
  id: string;
  name: string;
  hp: number;
  damage: number;
  defense: number;
}

export const MEMORY_ENEMIES: Record<string, MemoryEnemy> = {
  memory_shadow: { id: 'memory_shadow', name: 'Memory Shadow', hp: 80, damage: 15, defense: 5 },
  past_doubt: { id: 'past_doubt', name: 'Past Doubt', hp: 60, damage: 20, defense: 3 },
  forgotten_fear: { id: 'forgotten_fear', name: 'Forgotten Fear', hp: 70, damage: 25, defense: 2 },
  past_bandit: { id: 'past_bandit', name: 'Past Bandit', hp: 100, damage: 18, defense: 8 },
  guilt_phantom: { id: 'guilt_phantom', name: 'Guilt Phantom', hp: 90, damage: 22, defense: 5 },
  logic_error: { id: 'logic_error', name: 'Logic Error', hp: 50, damage: 30, defense: 0 },
  burning_memory: { id: 'burning_memory', name: 'Burning Memory', hp: 85, damage: 20, defense: 4 },
  erased_memory: { id: 'erased_memory', name: 'Erased Memory', hp: 150, damage: 35, defense: 15 },
  void_remnant: { id: 'void_remnant', name: 'Void Remnant', hp: 200, damage: 40, defense: 20 },
  proto_goose: { id: 'proto_goose', name: 'Proto-Goose', hp: 180, damage: 45, defense: 10 },
};

// -----------------------------------------------------------------------------
// Boss definitions
// -----------------------------------------------------------------------------

export interface MemoryBoss {
  id: string;
  name: string;
  hp: number;
  damage: number;
  defense: number;
  phases: number;
}

export const MEMORY_BOSSES: Record<string, MemoryBoss> = {
  young_gerald_reflection: {
    id: 'young_gerald_reflection',
    name: 'Young Gerald (Reflection)',
    hp: 300, damage: 30, defense: 15, phases: 2,
  },
  crimson_terror: {
    id: 'crimson_terror',
    name: 'The Crimson Terror',
    hp: 400, damage: 45, defense: 20, phases: 2,
  },
  eighth_master_shadow: {
    id: 'eighth_master_shadow',
    name: 'Shadow of the Eighth Master',
    hp: 800, damage: 60, defense: 30, phases: 3,
  },
  eighth_master_echo: {
    id: 'eighth_master_echo',
    name: 'Echo of the Eighth Master',
    hp: 1500, damage: 80, defense: 40, phases: 4,
  },
  primordial_honk: {
    id: 'primordial_honk',
    name: 'The Primordial Honk',
    hp: 2000, damage: 100, defense: 50, phases: 5,
  },
  ultimate_snoot_guardian: {
    id: 'ultimate_snoot_guardian',
    name: 'Ultimate Snoot Guardian',
    hp: 3000, damage: 120, defense: 60, phases: 5,
  },
};

// -----------------------------------------------------------------------------
// Lore entries
// -----------------------------------------------------------------------------

export interface MemoryLoreEntry {
  id: string;
  title: string;
  character: string;
  requiredFragments: number;
  story: string;
}

export const MEMORY_LORE_ENTRIES: MemoryLoreEntry[] = [
  // Gerald (3 entries: 5, 7, 10 fragments)
  { id: 'gerald_1', title: 'The Day He Found the Scrolls', character: 'gerald', requiredFragments: 5, story: 'Gerald discovered the Celestial Snoot Scripture beneath an old tea house, wrapped around a sleeping kitten.' },
  { id: 'gerald_2', title: 'A Leader Forged in Doubt', character: 'gerald', requiredFragments: 7, story: 'Before founding the sect, Gerald wandered alone for a year, questioning whether the path of the boop was real.' },
  { id: 'gerald_3', title: 'The Jade Palm Awakens', character: 'gerald', requiredFragments: 10, story: 'His palm turned jade-green the first time he booped a divine cat -- the sect was born in that moment.' },

  // Rusty (3 entries: 5, 7, 8 fragments)
  { id: 'rusty_1', title: 'The Bandit King\'s Last Raid', character: 'rusty', requiredFragments: 5, story: 'Rusty led the Red Fang gang until a tabby sat on his lap mid-heist and he could not bring himself to move.' },
  { id: 'rusty_2', title: 'Crimson Redemption', character: 'rusty', requiredFragments: 7, story: 'Gerald offered him a place in the sect with only two words: "Boop this."' },
  { id: 'rusty_3', title: 'Thousand Fists, One Heart', character: 'rusty', requiredFragments: 8, story: 'His barrage technique was born not from rage, but from the desperate need to boop every snoot at once.' },

  // Steve (3 entries: 5, 7, 9 fragments)
  { id: 'steve_1', title: 'The Calculation Begins', character: 'steve', requiredFragments: 5, story: 'Steve\'s first contribution to the sect was a spreadsheet tracking optimal boop-per-minute ratios.' },
  { id: 'steve_2', title: 'The Flowing River Theory', character: 'steve', requiredFragments: 7, story: 'He theorized that idle cultivation mirrors a river -- the less you force it, the more powerful it becomes.' },
  { id: 'steve_3', title: 'Eternal Flow Achieved', character: 'steve', requiredFragments: 9, story: 'Steve once went AFK for three days straight; when he returned, the cats had organized themselves into a perfect grid.' },

  // Andrew (3 entries: 5, 7, 8 fragments)
  { id: 'andrew_1', title: 'First to Arrive', character: 'andrew', requiredFragments: 5, story: 'Andrew joined the sect before the invitation was even sent -- he\'d already scouted the location.' },
  { id: 'andrew_2', title: 'Thunder Step Origins', character: 'andrew', requiredFragments: 7, story: 'His legendary speed came from chasing a rare cat across three mountains in a single afternoon.' },
  { id: 'andrew_3', title: 'The Lightning Scout\'s Promise', character: 'andrew', requiredFragments: 8, story: 'He swore to find every stray cat in the Jianghu, and he has never broken that promise.' },

  // Nik (3 entries: 5, 7, 9 fragments)
  { id: 'nik_1', title: '...', character: 'nik', requiredFragments: 5, story: 'No one saw Nik join the sect. One day, he was simply there, silently booping.' },
  { id: 'nik_2', title: 'The Shadow\'s Whisper', character: 'nik', requiredFragments: 7, story: 'The cats trust Nik because he never makes a sound -- they think he is one of them.' },
  { id: 'nik_3', title: 'Phantom Boop Mastered', character: 'nik', requiredFragments: 9, story: 'His critical technique was perfected in absolute darkness; even the snoot does not see him coming.' },

  // Yuelin (3 entries: 5, 7, 10 fragments)
  { id: 'yuelin_1', title: 'The Healer\'s Calling', character: 'yuelin', requiredFragments: 5, story: 'Yuelin heard the cats speaking in dreams long before she understood what they were saying.' },
  { id: 'yuelin_2', title: 'Lotus Sage\'s Garden', character: 'yuelin', requiredFragments: 7, story: 'She planted a garden where injured strays could recover, and the flowers bloomed in the shape of paw prints.' },
  { id: 'yuelin_3', title: 'Harmonious Aura Unlocked', character: 'yuelin', requiredFragments: 10, story: 'When Yuelin is near, even the most feral cat purrs -- her aura is the sect\'s greatest treasure.' },

  // Scott (3 entries: 5, 7, 10 fragments)
  { id: 'scott_1', title: 'The Mountain Sits', character: 'scott', requiredFragments: 5, story: 'Scott sat down to meditate and a cat climbed onto his lap; he did not move for a thousand days.' },
  { id: 'scott_2', title: 'Unshakeable Foundation', character: 'scott', requiredFragments: 7, story: 'During the great Goose Invasion, Scott was the only one who did not flinch -- the cat on his lap didn\'t either.' },
  { id: 'scott_3', title: 'The Mountain Speaks', character: 'scott', requiredFragments: 10, story: 'After three years of silence, Scott spoke a single word: "Boop." The sect wept.' },

  // Secret entries
  { id: 'secret_eighth_master', title: 'The Forgotten Eighth', character: 'eighth_master', requiredFragments: 15, story: 'Before Gerald, before the sect, there was an eighth master whose name was erased from all scrolls.' },
  { id: 'secret_cobra_chicken_origin', title: 'Birth of the Cobra Chicken', character: 'cobra_chicken', requiredFragments: 12, story: 'The Cobra Chicken was once a normal goose who gazed into the Void and honked back.' },
  { id: 'secret_ultimate_snoot', title: 'The First Snoot', character: 'snoot_prime', requiredFragments: 20, story: 'Before all things, there was a single snoot -- and it was booped, and the universe began.' },
  { id: 'secret_waifu_council', title: 'The Waifu Council Convenes', character: 'waifu_council', requiredFragments: 10, story: 'Once a year, all six Immortal Masters meet in secret to discuss which cultivator is the cutest.' },
];

// -----------------------------------------------------------------------------
// Realm stat bonuses
// -----------------------------------------------------------------------------

export interface RealmStats {
  hp: number;
  damage: number;
  defense: number;
}

export const REALM_STAT_BONUSES: Record<string, RealmStats> = {
  mortal:              { hp: 100,  damage: 10,  defense: 5 },
  qi_condensation:     { hp: 150,  damage: 15,  defense: 8 },
  foundation:          { hp: 200,  damage: 20,  defense: 10 },
  core_formation:      { hp: 300,  damage: 25,  defense: 15 },
  nascent_soul:        { hp: 400,  damage: 35,  defense: 18 },
  dao_seeking:         { hp: 600,  damage: 50,  defense: 25 },
  tribulation:         { hp: 1000, damage: 80,  defense: 40 },
  immortal:            { hp: 1500, damage: 150, defense: 75 },
  heavenly_sovereign:  { hp: 2500, damage: 300, defense: 150 },
};

// -----------------------------------------------------------------------------
// Chapter definitions
// -----------------------------------------------------------------------------

export type DifficultyTier = 'normal' | 'hard' | 'nightmare' | 'legendary';

const DIFFICULTY_MULTIPLIERS: Record<DifficultyTier, number> = {
  normal: 1.0,
  hard: 1.3,
  nightmare: 1.6,
  legendary: 2.0,
};

export interface ChapterReward {
  jadeCatnip: number;
  technique?: string;
  uniqueCat?: string;
  gooseFeathers?: number;
  permanentPPBonus?: number;
  permanentBondBonus?: number;
  voidMastery?: number;
}

export type UnlockConditionType =
  | { type: 'loreFragments'; count: number }
  | { type: 'chapterComplete'; chapterId: string }
  | { type: 'allMasterCh3Complete' }
  | { type: 'cobraChickenDefeated' }
  | { type: 'transcendenceReached' }
  | { type: 'allWaifuMaxBond' }
  | { type: 'totalFragments'; count: number };

export interface MemoryChapter {
  id: string;
  name: string;
  character: string;
  floors: number;
  difficulty: DifficultyTier;
  enemyPool: string[];
  bossId: string;
  unlockCondition: UnlockConditionType;
  reward: ChapterReward;
}

// Helper to build master chapters
function masterChapters(
  masterId: string,
  masterName: string,
  bossId: string,
  ch1Enemies: string[],
  ch2Enemies: string[],
  ch3Enemies: string[],
  ch2Technique: string,
  ch3Cat: string,
): MemoryChapter[] {
  return [
    {
      id: `${masterId}_ch1`,
      name: `${masterName}: Awakening`,
      character: masterId,
      floors: 5,
      difficulty: 'normal',
      enemyPool: ch1Enemies,
      bossId,
      unlockCondition: { type: 'loreFragments', count: 10 },
      reward: { jadeCatnip: 500 },
    },
    {
      id: `${masterId}_ch2`,
      name: `${masterName}: Tribulation`,
      character: masterId,
      floors: 7,
      difficulty: 'hard',
      enemyPool: ch2Enemies,
      bossId,
      unlockCondition: { type: 'chapterComplete', chapterId: `${masterId}_ch1` },
      reward: { jadeCatnip: 750, technique: ch2Technique },
    },
    {
      id: `${masterId}_ch3`,
      name: `${masterName}: Transcendence`,
      character: masterId,
      floors: 10,
      difficulty: 'nightmare',
      enemyPool: ch3Enemies,
      bossId,
      unlockCondition: { type: 'chapterComplete', chapterId: `${masterId}_ch2` },
      reward: { jadeCatnip: 1500, uniqueCat: ch3Cat },
    },
  ];
}

export const MEMORY_CHAPTERS: MemoryChapter[] = [
  // Gerald
  ...masterChapters('gerald', 'Gerald', 'young_gerald_reflection',
    ['memory_shadow', 'past_doubt', 'forgotten_fear'],
    ['memory_shadow', 'past_doubt', 'forgotten_fear', 'guilt_phantom'],
    ['memory_shadow', 'past_doubt', 'forgotten_fear', 'guilt_phantom', 'burning_memory'],
    'tranquil_palm_strike', 'jade_spirit_cat',
  ),
  // Rusty
  ...masterChapters('rusty', 'Rusty', 'crimson_terror',
    ['past_bandit', 'memory_shadow', 'burning_memory'],
    ['past_bandit', 'memory_shadow', 'burning_memory', 'guilt_phantom'],
    ['past_bandit', 'memory_shadow', 'burning_memory', 'guilt_phantom', 'forgotten_fear'],
    'crimson_barrage', 'scarlet_fang_cat',
  ),
  // Steve
  ...masterChapters('steve', 'Steve', 'young_gerald_reflection',
    ['logic_error', 'past_doubt', 'memory_shadow'],
    ['logic_error', 'past_doubt', 'memory_shadow', 'erased_memory'],
    ['logic_error', 'past_doubt', 'memory_shadow', 'erased_memory', 'void_remnant'],
    'eternal_flow_mastery', 'river_oracle_cat',
  ),
  // Andrew
  ...masterChapters('andrew', 'Andrew', 'crimson_terror',
    ['forgotten_fear', 'memory_shadow', 'past_bandit'],
    ['forgotten_fear', 'memory_shadow', 'past_bandit', 'burning_memory'],
    ['forgotten_fear', 'memory_shadow', 'past_bandit', 'burning_memory', 'proto_goose'],
    'thunder_flash_step', 'storm_chaser_cat',
  ),
  // Nik
  ...masterChapters('nik', 'Nik', 'eighth_master_shadow',
    ['memory_shadow', 'forgotten_fear', 'guilt_phantom'],
    ['memory_shadow', 'forgotten_fear', 'guilt_phantom', 'void_remnant'],
    ['memory_shadow', 'forgotten_fear', 'guilt_phantom', 'void_remnant', 'erased_memory'],
    'phantom_strike', 'shadow_wraith_cat',
  ),
  // Yuelin
  ...masterChapters('yuelin', 'Yuelin', 'young_gerald_reflection',
    ['past_doubt', 'guilt_phantom', 'burning_memory'],
    ['past_doubt', 'guilt_phantom', 'burning_memory', 'forgotten_fear'],
    ['past_doubt', 'guilt_phantom', 'burning_memory', 'forgotten_fear', 'erased_memory'],
    'lotus_healing_art', 'celestial_lotus_cat',
  ),
  // Scott
  ...masterChapters('scott', 'Scott', 'eighth_master_shadow',
    ['memory_shadow', 'past_bandit', 'erased_memory'],
    ['memory_shadow', 'past_bandit', 'erased_memory', 'void_remnant'],
    ['memory_shadow', 'past_bandit', 'erased_memory', 'void_remnant', 'proto_goose'],
    'mountain_stance', 'granite_guardian_cat',
  ),

  // Secret chapters
  {
    id: 'secret_ch1',
    name: 'Eighth Master: Echoes of the Forgotten',
    character: 'eighth_master',
    floors: 15,
    difficulty: 'legendary',
    enemyPool: ['void_remnant', 'erased_memory', 'guilt_phantom', 'burning_memory', 'proto_goose'],
    bossId: 'eighth_master_echo',
    unlockCondition: { type: 'allMasterCh3Complete' },
    reward: { jadeCatnip: 3000, uniqueCat: 'echo_of_eight' },
  },
  {
    id: 'secret_ch2',
    name: 'Birth of Chaos',
    character: 'cobra_chicken',
    floors: 15,
    difficulty: 'legendary',
    enemyPool: ['proto_goose', 'void_remnant', 'burning_memory', 'logic_error', 'erased_memory'],
    bossId: 'primordial_honk',
    unlockCondition: { type: 'cobraChickenDefeated' },
    reward: { jadeCatnip: 3000, gooseFeathers: 50 },
  },
  {
    id: 'secret_ch3',
    name: 'Ultimate Snoot: The Origin',
    character: 'snoot_prime',
    floors: 20,
    difficulty: 'legendary',
    enemyPool: ['void_remnant', 'erased_memory', 'proto_goose', 'burning_memory', 'guilt_phantom', 'logic_error'],
    bossId: 'ultimate_snoot_guardian',
    unlockCondition: { type: 'transcendenceReached' },
    reward: { jadeCatnip: 5000, permanentPPBonus: 0.1 },
  },
  {
    id: 'secret_ch4',
    name: 'Council of Masters',
    character: 'waifu_council',
    floors: 15,
    difficulty: 'legendary',
    enemyPool: ['memory_shadow', 'past_doubt', 'forgotten_fear', 'guilt_phantom', 'burning_memory'],
    bossId: 'eighth_master_echo',
    unlockCondition: { type: 'allWaifuMaxBond' },
    reward: { jadeCatnip: 3000, permanentBondBonus: 0.05 },
  },
  {
    id: 'secret_ch5',
    name: 'What the Void Knows',
    character: 'void',
    floors: 20,
    difficulty: 'legendary',
    enemyPool: ['void_remnant', 'erased_memory', 'proto_goose', 'logic_error', 'burning_memory', 'guilt_phantom'],
    bossId: 'ultimate_snoot_guardian',
    unlockCondition: { type: 'totalFragments', count: 100 },
    reward: { jadeCatnip: 5000, voidMastery: 0.1 },
  },
];

// -----------------------------------------------------------------------------
// Runtime combat state interfaces
// -----------------------------------------------------------------------------

interface CombatEntity {
  hp: number;
  maxHp: number;
  damage: number;
  defense: number;
}

interface ActiveEnemy extends CombatEntity {
  id: string;
  name: string;
  isBoss: boolean;
  phase: number;
  maxPhases: number;
}

interface PlayerData {
  cultivationRealm: string;
  catCount: number;
}

interface GameStateSnapshot {
  completedChapters: string[];
  cobraChickenDefeated: boolean;
  transcendenceReached: boolean;
  allWaifuMaxBond: boolean;
  totalFragments: number;
}

interface CombatResult {
  damage: number;
  isCritical: boolean;
  enemyDefeated: boolean;
  message: string;
}

interface FloorAdvanceResult {
  floor: number;
  enemy: ActiveEnemy;
}

interface ChapterCompleteResult {
  chapterId: string;
  reward: ChapterReward;
  loreUnlocked: MemoryLoreEntry[];
}

// -----------------------------------------------------------------------------
// Serializable persistent state
// -----------------------------------------------------------------------------

interface MemoryPersistentState {
  completedChapters: string[];
  unlockedLore: string[];
  collectedFragments: Record<string, number>;
  totalFragmentsCollected: number;
  stats: {
    totalChaptersCompleted: number;
    totalLoreUnlocked: number;
    secretsDiscovered: number;
    memoriesExplored: number;
  };
}

// Master ch3 ids for secret_ch1 unlock check
const ALL_MASTER_CH3_IDS = [
  'gerald_ch3', 'rusty_ch3', 'steve_ch3', 'andrew_ch3',
  'nik_ch3', 'yuelin_ch3', 'scott_ch3',
];

// -----------------------------------------------------------------------------
// Main system
// -----------------------------------------------------------------------------

export class MemoryFragmentsSystem {
  // Persistent state
  completedChapters: string[] = [];
  unlockedLore: string[] = [];
  collectedFragments: Record<string, number> = {};
  totalFragmentsCollected: number = 0;
  stats = {
    totalChaptersCompleted: 0,
    totalLoreUnlocked: 0,
    secretsDiscovered: 0,
    memoriesExplored: 0,
  };

  // Run state
  inChapter: boolean = false;
  currentChapterId: string | null = null;
  currentFloor: number = 0;
  totalFloors: number = 0;
  player: CombatEntity | null = null;
  enemy: ActiveEnemy | null = null;
  difficultyMult: number = 1.0;

  // -------------------------------------------------------------------------
  // Fragment collection
  // -------------------------------------------------------------------------

  addFragments(amount: number): void {
    this.totalFragmentsCollected += amount;
  }

  // -------------------------------------------------------------------------
  // Chapter lifecycle
  // -------------------------------------------------------------------------

  startChapter(
    chapterId: string,
    playerData: PlayerData,
  ): FloorAdvanceResult | { error: string } {
    const chapter = MEMORY_CHAPTERS.find((c) => c.id === chapterId);
    if (!chapter) return { error: 'Chapter not found.' };

    if (this.inChapter) return { error: 'Already in a chapter.' };

    // Unlock check using own completedChapters as a minimal game state
    if (
      !this.checkUnlockConditions(chapterId, {
        completedChapters: this.completedChapters,
        cobraChickenDefeated: false,
        transcendenceReached: false,
        allWaifuMaxBond: false,
        totalFragments: this.totalFragmentsCollected,
      })
    ) {
      return { error: 'Chapter unlock conditions not met.' };
    }

    const realmStats = REALM_STAT_BONUSES[playerData.cultivationRealm] ?? REALM_STAT_BONUSES.mortal;

    this.inChapter = true;
    this.currentChapterId = chapterId;
    this.currentFloor = 0;
    this.totalFloors = chapter.floors;
    this.difficultyMult = DIFFICULTY_MULTIPLIERS[chapter.difficulty];
    this.player = {
      hp: realmStats.hp,
      maxHp: realmStats.hp,
      damage: realmStats.damage,
      defense: realmStats.defense,
    };

    this.stats.memoriesExplored++;

    return this.advanceFloor();
  }

  advanceFloor(): FloorAdvanceResult | { error: string } {
    if (!this.inChapter || !this.currentChapterId) {
      return { error: 'Not in a chapter.' };
    }

    this.currentFloor++;

    const chapter = MEMORY_CHAPTERS.find((c) => c.id === this.currentChapterId)!;

    // Boss on last floor
    if (this.currentFloor >= this.totalFloors) {
      this.enemy = this.spawnBoss(chapter.bossId);
    } else {
      this.enemy = this.spawnEnemy(chapter.enemyPool);
    }

    return { floor: this.currentFloor, enemy: this.enemy };
  }

  // -------------------------------------------------------------------------
  // Combat
  // -------------------------------------------------------------------------

  attack(multiplier: number = 1.0): CombatResult | { error: string } {
    if (!this.inChapter || !this.player || !this.enemy) {
      return { error: 'No active combat.' };
    }

    const isCritical = Math.random() < 0.15;
    const critMult = isCritical ? 2.0 : 1.0;
    const rawDamage = this.player.damage * multiplier * critMult;
    const effectiveDef = this.enemy.defense * 0.5;
    const damage = Math.max(1, Math.floor(rawDamage - effectiveDef));

    this.enemy.hp -= damage;
    const enemyDefeated = this.enemy.hp <= 0;

    let message = isCritical
      ? `Critical strike! Dealt ${damage} damage!`
      : `Dealt ${damage} damage.`;

    if (enemyDefeated) {
      message += ` ${this.enemy.name} defeated!`;
    }

    return { damage, isCritical, enemyDefeated, message };
  }

  enemyTurn(): CombatResult | { error: string } {
    if (!this.inChapter || !this.player || !this.enemy) {
      return { error: 'No active combat.' };
    }

    if (this.enemy.hp <= 0) {
      return { error: 'Enemy already defeated.' };
    }

    const rawDamage = this.enemy.damage;
    const effectiveDef = this.player.defense * 0.5;
    const damage = Math.max(1, Math.floor(rawDamage - effectiveDef));

    this.player.hp -= damage;
    const playerDefeated = this.player.hp <= 0;

    const message = playerDefeated
      ? `${this.enemy.name} dealt ${damage} damage. You have fallen!`
      : `${this.enemy.name} dealt ${damage} damage.`;

    return { damage, isCritical: false, enemyDefeated: false, message };
  }

  onEnemyDefeated(): ChapterCompleteResult | FloorAdvanceResult | { error: string } {
    if (!this.inChapter || !this.enemy || this.enemy.hp > 0) {
      return { error: 'Enemy not defeated.' };
    }

    // Boss with remaining phases
    if (this.enemy.isBoss && this.enemy.phase < this.enemy.maxPhases) {
      this.enemy.phase++;
      const bossTemplate = MEMORY_BOSSES[this.enemy.id];
      const phaseScale = 1 + (this.enemy.phase - 1) * 0.3;
      const floorScale = (1 + (this.currentFloor - 1) * 0.15) * this.difficultyMult;
      this.enemy.hp = Math.floor(bossTemplate.hp * phaseScale * floorScale);
      this.enemy.maxHp = this.enemy.hp;
      this.enemy.damage = Math.floor(bossTemplate.damage * phaseScale * floorScale);
      this.enemy.defense = Math.floor(bossTemplate.defense * phaseScale * floorScale);
      return { floor: this.currentFloor, enemy: this.enemy };
    }

    // Last floor -- chapter complete
    if (this.currentFloor >= this.totalFloors) {
      return this.completeChapter();
    }

    // Advance to next floor
    return this.advanceFloor();
  }

  // -------------------------------------------------------------------------
  // Chapter completion
  // -------------------------------------------------------------------------

  private completeChapter(): ChapterCompleteResult {
    const chapterId = this.currentChapterId!;
    const chapter = MEMORY_CHAPTERS.find((c) => c.id === chapterId)!;

    if (!this.completedChapters.includes(chapterId)) {
      this.completedChapters.push(chapterId);
      this.stats.totalChaptersCompleted++;

      if (chapterId.startsWith('secret_')) {
        this.stats.secretsDiscovered++;
      }
    }

    // Unlock matching lore entries
    const newlyUnlocked: MemoryLoreEntry[] = [];
    for (const entry of MEMORY_LORE_ENTRIES) {
      if (this.unlockedLore.includes(entry.id)) continue;
      if (
        entry.character === chapter.character &&
        this.totalFragmentsCollected >= entry.requiredFragments
      ) {
        this.unlockedLore.push(entry.id);
        this.stats.totalLoreUnlocked++;
        newlyUnlocked.push(entry);
      }
    }

    // Reset run state
    this.inChapter = false;
    this.currentChapterId = null;
    this.currentFloor = 0;
    this.totalFloors = 0;
    this.player = null;
    this.enemy = null;
    this.difficultyMult = 1.0;

    return {
      chapterId,
      reward: chapter.reward,
      loreUnlocked: newlyUnlocked,
    };
  }

  // -------------------------------------------------------------------------
  // Unlock condition checks
  // -------------------------------------------------------------------------

  checkUnlockConditions(chapterId: string, gameState: GameStateSnapshot): boolean {
    const chapter = MEMORY_CHAPTERS.find((c) => c.id === chapterId);
    if (!chapter) return false;

    const cond = chapter.unlockCondition;

    switch (cond.type) {
      case 'loreFragments':
        return gameState.totalFragments >= cond.count;

      case 'chapterComplete':
        return gameState.completedChapters.includes(cond.chapterId);

      case 'allMasterCh3Complete':
        return ALL_MASTER_CH3_IDS.every((id) => gameState.completedChapters.includes(id));

      case 'cobraChickenDefeated':
        return gameState.cobraChickenDefeated;

      case 'transcendenceReached':
        return gameState.transcendenceReached;

      case 'allWaifuMaxBond':
        return gameState.allWaifuMaxBond;

      case 'totalFragments':
        return gameState.totalFragments >= cond.count;

      default:
        return false;
    }
  }

  getAvailableChapters(gameState: GameStateSnapshot): MemoryChapter[] {
    return MEMORY_CHAPTERS.filter((ch) => this.checkUnlockConditions(ch.id, gameState));
  }

  // -------------------------------------------------------------------------
  // Lore access
  // -------------------------------------------------------------------------

  getLoreEntries(): MemoryLoreEntry[] {
    return MEMORY_LORE_ENTRIES.filter((entry) => this.unlockedLore.includes(entry.id));
  }

  // -------------------------------------------------------------------------
  // Spawning helpers
  // -------------------------------------------------------------------------

  private spawnEnemy(pool: string[]): ActiveEnemy {
    const id = pool[Math.floor(Math.random() * pool.length)];
    const template = MEMORY_ENEMIES[id];
    const floorScale = (1 + (this.currentFloor - 1) * 0.15) * this.difficultyMult;

    return {
      id: template.id,
      name: template.name,
      hp: Math.floor(template.hp * floorScale),
      maxHp: Math.floor(template.hp * floorScale),
      damage: Math.floor(template.damage * floorScale),
      defense: Math.floor(template.defense * floorScale),
      isBoss: false,
      phase: 1,
      maxPhases: 1,
    };
  }

  private spawnBoss(bossId: string): ActiveEnemy {
    const template = MEMORY_BOSSES[bossId];
    const floorScale = (1 + (this.currentFloor - 1) * 0.15) * this.difficultyMult;

    return {
      id: template.id,
      name: template.name,
      hp: Math.floor(template.hp * floorScale),
      maxHp: Math.floor(template.hp * floorScale),
      damage: Math.floor(template.damage * floorScale),
      defense: Math.floor(template.defense * floorScale),
      isBoss: true,
      phase: 1,
      maxPhases: template.phases,
    };
  }

  // -------------------------------------------------------------------------
  // Serialization
  // -------------------------------------------------------------------------

  serialize(): MemoryPersistentState {
    return {
      completedChapters: [...this.completedChapters],
      unlockedLore: [...this.unlockedLore],
      collectedFragments: { ...this.collectedFragments },
      totalFragmentsCollected: this.totalFragmentsCollected,
      stats: { ...this.stats },
    };
  }

  deserialize(data: MemoryPersistentState): void {
    this.completedChapters = data.completedChapters ?? [];
    this.unlockedLore = data.unlockedLore ?? [];
    this.collectedFragments = data.collectedFragments ?? {};
    this.totalFragmentsCollected = data.totalFragmentsCollected ?? 0;
    this.stats = {
      totalChaptersCompleted: data.stats?.totalChaptersCompleted ?? 0,
      totalLoreUnlocked: data.stats?.totalLoreUnlocked ?? 0,
      secretsDiscovered: data.stats?.secretsDiscovered ?? 0,
      memoriesExplored: data.stats?.memoriesExplored ?? 0,
    };

    // Reset any lingering run state
    this.inChapter = false;
    this.currentChapterId = null;
    this.currentFloor = 0;
    this.totalFloors = 0;
    this.player = null;
    this.enemy = null;
    this.difficultyMult = 1.0;
  }
}
