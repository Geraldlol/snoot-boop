/**
 * Save Migration - Convert v2.6.0 (vanilla JS) saves to v3.0.0 (React rewrite)
 *
 * The old save is preserved as a backup in localStorage before migration.
 */

import type { SaveDataV2, SaveDataV3, Currencies, GameStats } from '../types';

/**
 * Run all v2.x migrations to bring legacy data up to v2.6.0 shape.
 * Mirrors the original save.js migrate() chain.
 */
function migrateV2Chain(data: SaveDataV2): SaveDataV2 {
  if (!data.version) data.version = '0.0.1';

  // 1.x / 0.x → 2.0.0
  if (data.version.startsWith('1.') || data.version === '0.0.1') {
    data.elemental = data.elemental ?? { reactionHistory: [] };
    data.equipment = data.equipment ?? { inventory: [], equipped: {}, nextId: 1 };
    data.crafting = data.crafting ?? { materials: {}, blueprints: {}, craftingQueue: [] };
    data.pagoda = data.pagoda ?? { highestFloor: 0, tokens: 0, upgrades: {}, stats: {}, runHistory: [] };
    data.blessings = data.blessings ?? { permanentBlessings: [], stats: {} };
    data.survival = data.survival ?? { stats: {}, unlocks: [] };
    data.goldenSnoot = data.goldenSnoot ?? { stats: {} };
    data.daily = data.daily ?? { commissions: [], currentStreak: 0, stats: {} };
    data.parasites = data.parasites ?? { parasites: [], upgrades: {}, stats: {} };
    data.version = '2.0.0';
  }

  // 2.0.0 → 2.1.0
  if (data.version === '2.0.0') {
    data.irlIntegration = data.irlIntegration ?? { stats: {} };
    data.drama = data.drama ?? { drama: 0, relations: {}, stats: {} };
    data.nemesis = data.nemesis ?? { nemeses: [], defeatedNemeses: [], defectedNemeses: [], stats: {} };
    data.catino = data.catino ?? { chips: 0, stats: {} };
    data.hardcore = data.hardcore ?? { completedModes: [], stats: {} };
    data.partners = data.partners ?? { ownedPartners: [], stats: {} };
    data.version = '2.1.0';
  }

  // 2.1.0 → 2.2.0
  if (data.version === '2.1.0') {
    data.cultivation = data.cultivation ?? {
      currentRealm: 'mortal', currentRank: 1, cultivationXP: 0, totalCultivationXP: 0,
      tribulationAttempts: {}, passivesUnlocked: [], unlockedContent: ['basic_boop', 'cat_sanctuary'],
      severingChoices: {}, daoWounds: 0, permanentScars: 0, stats: {},
    };
    data.version = '2.2.0';
  }

  // 2.2.0 → 2.3.0
  if (data.version === '2.2.0') {
    data.buildings = data.buildings ?? {
      buildings: {}, currentTerritory: 'humble_courtyard',
      unlockedTerritories: ['humble_courtyard'], stats: {},
    };
    data.version = '2.3.0';
  }

  // 2.3.0 → 2.4.0
  if (data.version === '2.3.0') {
    const p = (data.prestige ?? {}) as Record<string, unknown>;
    p.reincarnationCount = p.reincarnationCount ?? 0;
    p.karmaPoints = p.karmaPoints ?? 0;
    p.pastLifeMemory = p.pastLifeMemory ?? null;
    p.karmaShopPurchases = p.karmaShopPurchases ?? {};
    p.maxWaifuBonds = p.maxWaifuBonds ?? {};
    p.maxRealmReached = p.maxRealmReached ?? 'mortal';
    p.lifetimeBoops = p.lifetimeBoops ?? (data.stats as Record<string, unknown>)?.totalBoops ?? 0;
    p.lifetimeGooseBoops = p.lifetimeGooseBoops ?? (data.stats as Record<string, unknown>)?.gooseBoops ?? 0;
    p.transcendenceCount = p.transcendenceCount ?? 0;
    p.transcendencePoints = p.transcendencePoints ?? 0;
    p.celestialUnlocks = p.celestialUnlocks ?? [];
    data.prestige = p;
    data.version = '2.4.0';
  }

  // 2.4.0 → 2.5.0
  if (data.version === '2.4.0') {
    const r = data.resources ?? {} as Record<string, number>;
    r.qi = r.qi ?? 0;
    r.spiritStones = r.spiritStones ?? 0;
    r.heavenlySeals = r.heavenlySeals ?? 0;
    r.sectReputation = r.sectReputation ?? 0;
    r.destinyThreads = r.destinyThreads ?? 0;
    r.waifuTokens = r.waifuTokens ?? 0;
    data.economy = data.economy ?? {
      currencies: { ...r }, gooseShopPurchases: {}, conversionCooldowns: {},
      permanentEffects: {}, activeEffects: [], consumables: {},
      stats: { totalEarned: {}, totalSpent: {}, conversionsPerformed: 0, gooseShopPurchases: 0 },
    };
    data.version = '2.5.0';
  }

  // 2.5.0 → 2.6.0
  if (data.version === '2.5.0') {
    data.time = data.time ?? { stats: { dawnsSeen: 0, nightsSpent: 0, festivalsParticipated: [], totalNightBoops: 0 } };
    data.events = data.events ?? { eventHistory: [], weeklyChallenge: null, lastWeeklyReset: null, triggeredHiddenEvents: [], hiddenEventCooldowns: {} };
    data.version = '2.6.0';
  }

  return data;
}

/**
 * Convert a fully-migrated v2.6.0 save into v3.0.0 format.
 */
export function migrateV2ToV3(raw: SaveDataV2): SaveDataV3 {
  // First ensure it's at v2.6.0
  const data = migrateV2Chain(raw);
  const res = data.resources ?? {} as Record<string, number>;
  const stats = (data.stats ?? {}) as Partial<GameStats>;

  const currencies: Currencies = {
    bp: res.bp ?? 0,
    pp: res.pp ?? 0,
    qi: res.qi ?? 0,
    jadeCatnip: res.jadeCatnip ?? 0,
    spiritStones: res.spiritStones ?? 0,
    heavenlySeals: res.heavenlySeals ?? 0,
    sectReputation: res.sectReputation ?? 0,
    destinyThreads: res.destinyThreads ?? 0,
    waifuTokens: res.waifuTokens ?? 0,
    gooseFeathers: res.gooseFeathers ?? 0,
  };

  const gameStats: GameStats = {
    totalBoops: stats.totalBoops ?? 0,
    maxCombo: stats.maxCombo ?? 0,
    playtime: stats.playtime ?? 0,
    criticalBoops: stats.criticalBoops ?? 0,
    gooseBoops: stats.gooseBoops ?? 0,
    totalAfkTime: stats.totalAfkTime ?? 0,
    rageGooseBooped: stats.rageGooseBooped ?? false,
    goldenGooseCrit: stats.goldenGooseCrit ?? false,
    catsRecruited: stats.catsRecruited ?? 0,
    gooseCriticals: stats.gooseCriticals ?? 0,
  };

  // Helper to safely extract or default. Returns unknown so callers must cast.
  const obj = (v: unknown, def: Record<string, unknown> = {}): unknown =>
    (v && typeof v === 'object' ? v : def);

  const save: SaveDataV3 = {
    version: '3.0.0',
    timestamp: data.timestamp ?? Date.now(),
    master: (data.master as SaveDataV3['master']) ?? null,
    resources: currencies,
    stats: gameStats,

    cats: obj(data.cats, { cats: [], nextInstanceId: 1 }) as SaveDataV3['cats'],
    waifus: obj(data.waifus, { waifus: [], giftHistory: [] }) as SaveDataV3['waifus'],
    upgrades: obj(data.upgrades, { upgrades: {} }) as SaveDataV3['upgrades'],
    goose: obj(data.goose, { gooseBoops: 0, cobraChickenDefeated: false, gooseAlly: null, goldenFeathers: 0, gooseCriticals: 0 }) as SaveDataV3['goose'],
    achievements: obj(data.achievements, { unlocked: [] }) as SaveDataV3['achievements'],
    cultivation: obj(data.cultivation, { currentRealm: 'mortal', currentRank: 1, cultivationXP: 0, totalCultivationXP: 0, passivesUnlocked: [], unlockedContent: ['basic_boop', 'cat_sanctuary'], tribulationAttempts: {}, severingChoices: {}, daoWounds: 0, permanentScars: 0 }) as SaveDataV3['cultivation'],
    buildings: obj(data.buildings, { buildings: {}, currentTerritory: 'humble_courtyard', unlockedTerritories: ['humble_courtyard'] }) as SaveDataV3['buildings'],
    prestige: obj(data.prestige, { currentTier: 0, totalRebirths: 0, lifetimeBP: 0, unlockedPerks: [], heavenlySeals: 0, reincarnationCount: 0, karmaPoints: 0, pastLifeMemory: null, karmaShopPurchases: {}, maxWaifuBonds: {}, maxRealmReached: 'mortal', lifetimeBoops: 0, lifetimeGooseBoops: 0, transcendenceCount: 0, transcendencePoints: 0, celestialUnlocks: [] }) as SaveDataV3['prestige'],
    economy: obj(data.economy, { currencies, gooseShopPurchases: {}, conversionCooldowns: {}, permanentEffects: {}, activeEffects: [], consumables: {}, stats: { totalEarned: {}, totalSpent: {}, conversionsPerformed: 0, gooseShopPurchases: 0 } }) as SaveDataV3['economy'],
    equipment: obj(data.equipment, { inventory: [], equipped: {}, nextId: 1 }) as SaveDataV3['equipment'],
    crafting: obj(data.crafting, { materials: {}, blueprints: {}, craftingQueue: [] }) as SaveDataV3['crafting'],
    pagoda: obj(data.pagoda, { highestFloor: 0, tokens: 0, upgrades: {}, stats: {}, runHistory: [] }) as SaveDataV3['pagoda'],
    techniques: obj(data.techniques, { learnedTechniques: [], learnedSkills: [], cultivationPassives: [], legendaryInternals: {}, consumables: {} }) as SaveDataV3['techniques'],
    blessings: obj(data.blessings, { permanentBlessings: [], stats: {} }) as SaveDataV3['blessings'],
    survival: obj(data.survival, { stats: {}, unlocks: [] }) as SaveDataV3['survival'],
    goldenSnoot: obj(data.goldenSnoot, { stats: {} }) as SaveDataV3['goldenSnoot'],
    daily: obj(data.daily, { commissions: [], currentStreak: 0, stats: {} }) as SaveDataV3['daily'],
    parasites: obj(data.parasites, { parasites: [], upgrades: {}, stats: {} }) as SaveDataV3['parasites'],
    time: obj(data.time, { stats: {} }) as SaveDataV3['time'],
    events: obj(data.events, { eventHistory: [], weeklyChallenge: null, lastWeeklyReset: null, triggeredHiddenEvents: [], hiddenEventCooldowns: {} }) as SaveDataV3['events'],
    lore: obj(data.lore, { collectedFragments: {}, unlockedStories: [], stats: {} }) as SaveDataV3['lore'],
    secrets: obj(data.secrets, { moonClicks: 0, discoveredSecrets: [], stats: {} }) as SaveDataV3['secrets'],
    tournament: obj(data.tournament, { weeklyData: null, stats: {}, leaderboard: [] }) as SaveDataV3['tournament'],
    dreamRealm: obj(data.dreamRealm, { dreamEssence: 0, unlockedCosmetics: [], hasWalkerCat: false, deepestDream: 0, stats: {} }) as SaveDataV3['dreamRealm'],
    gooseDimension: obj(data.gooseDimension, { highestFloor: 0, stats: {}, rewards: {} }) as SaveDataV3['gooseDimension'],
    memoryFragments: obj(data.memoryFragments, { completedChapters: [], unlockedLore: [], collectedFragments: {}, totalFragmentsCollected: 0, stats: {} }) as SaveDataV3['memoryFragments'],
    irlIntegration: obj(data.irlIntegration, { stats: {} }) as SaveDataV3['irlIntegration'],
    drama: obj(data.drama, { drama: 0, relations: {}, stats: {} }) as SaveDataV3['drama'],
    nemesis: obj(data.nemesis, { nemeses: [], defeatedNemeses: [], defectedNemeses: [], stats: {} }) as SaveDataV3['nemesis'],
    catino: obj(data.catino, { chips: 0, stats: {} }) as SaveDataV3['catino'],
    hardcore: obj(data.hardcore, { completedModes: [], stats: {} }) as SaveDataV3['hardcore'],
    partners: obj(data.partners, { ownedPartners: [], stats: {} }) as SaveDataV3['partners'],
  };

  console.log(`[SaveMigration] Migrated v${data.version} → v3.0.0`);
  return save;
}
