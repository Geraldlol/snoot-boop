// lore-system.ts - Fragment collection and story unlocks
// "Every cat has a tale. Every master, a secret."

// --- Types ---

interface LoreCondition {
  boops?: number;
  gooseBoops?: number;
  catsCollected?: number;
  afkHours?: number;
  playBoth?: { masters: [string, string]; hours: number };
  masterPlaytime?: { master: string; hours: number };
  waifuBond?: { waifuId: string; level: number };
  totalBoops?: number;
  heavenlySeals?: number;
  transcendence?: boolean;
  playtimeHours?: number;
}

interface LoreRewards {
  jadeCatnip?: number;
  gooseFeathers?: number;
  cosmetic?: string;
  technique?: string;
  cat?: string;
}

interface LoreEntry {
  id: string;
  title: string;
  fragments: number;
  story: string;
  unlockedBy: LoreCondition;
  rewards: LoreRewards;
}

interface LoreCategory {
  [entryId: string]: LoreEntry;
}

interface LoreEntries {
  [category: string]: LoreCategory;
}

interface LoreGameState {
  totalBoops: number;
  gooseBoops: number;
  catCount: number;
  waifuBonds: Record<string, number>;
  afkHours: number;
  masterPlaytime: Record<string, number>;
  heavenlySeals: number;
  transcended: boolean;
  playtimeHours?: number;
  catsCollected?: number;
}

interface FragmentDropResult {
  entryId: string;
  category: string;
  current: number;
  required: number;
  title: string;
  completed: boolean;
  rewards?: LoreRewards;
}

interface LoreProgress {
  total: number;
  unlocked: number;
  percentComplete: number;
}

interface LoreStats {
  totalFragmentsFound: number;
  storiesUnlocked: number;
  lastFragmentTime: number | null;
}

interface LoreSerializedData {
  collectedFragments: Record<string, number>;
  unlockedStories: string[];
  stats: LoreStats;
}

// --- Data ---

const LORE_ENTRIES: LoreEntries = {
  cats: {
    ceiling_god: {
      id: 'ceiling_god',
      title: 'The All-Seeing',
      fragments: 5,
      story: 'In the beginning, there was only the Ceiling. And from the Ceiling, a pair of eyes watched. They watched the first snoot. They watched the first boop. Ceiling Cat sees all, judges none, and boops eternal.',
      unlockedBy: { boops: 1000 },
      rewards: { jadeCatnip: 500, cosmetic: 'ceiling_halo' },
    },
    untitled_goose: {
      id: 'untitled_goose',
      title: 'Origin of Chaos',
      fragments: 7,
      story: 'Before the Celestial Snoot Sect, before the Seven Masters, there was a goose. It did not honk out of malice. It honked because that is what geese do. The first snoot it booped was its own. And from that paradox, chaos was born.',
      unlockedBy: { gooseBoops: 500 },
      rewards: { gooseFeathers: 50, cosmetic: 'chaos_feather_crown' },
    },
    basement_cat: {
      id: 'basement_cat',
      title: 'The Lurker Below',
      fragments: 6,
      story: 'Where Ceiling Cat watches from above, Basement Cat plots from below. Not evil, merely... patient. It collects the snoots that fall through the cracks. One day it will rise, and every snoot shall tremble.',
      unlockedBy: { catsCollected: 50 },
      rewards: { jadeCatnip: 300, cat: 'basement_cat' },
    },
    eternal_loaf: {
      id: 'eternal_loaf',
      title: 'The Motionless Master',
      fragments: 5,
      story: 'They say the Eternal Loaf has not moved in ten thousand years. Its cultivation is beyond mortal comprehension. Some say it is asleep. Others say it has transcended movement itself. Its snoot remains perfectly boopable either way.',
      unlockedBy: { afkHours: 100 },
      rewards: { technique: 'loaf_stance', jadeCatnip: 200 },
    },
  },

  masters: {
    gerald_rusty: {
      id: 'gerald_rusty',
      title: 'The First Meeting',
      fragments: 10,
      story: 'They met on opposite sides of a battlefield. Gerald offered tea. Rusty threw a punch. The punch missed. The tea was excellent. By sunset, they had booped seventeen cats together and sworn an oath of brotherhood.',
      unlockedBy: { playBoth: { masters: ['gerald', 'rusty'], hours: 5 } },
      rewards: { jadeCatnip: 800, cosmetic: 'brotherhood_banner' },
    },
    steve_andrew: {
      id: 'steve_andrew',
      title: 'Speed vs Strategy',
      fragments: 8,
      story: '"You can\'t out-calculate instinct!" Andrew shouted, already three hills ahead. Steve smiled, took a sip of tea, and checked his spreadsheet. By the time Andrew returned, Steve had already found seven cats. The spreadsheet never lies.',
      unlockedBy: { playBoth: { masters: ['steve', 'andrew'], hours: 5 } },
      rewards: { jadeCatnip: 600, technique: 'calculated_sprint' },
    },
    nik_yuelin: {
      id: 'nik_yuelin',
      title: 'The Silent and the Sage',
      fragments: 12,
      story: 'Yuelin was the first to hear Nik speak. Not with words — Nik never used those. But in the way he held each cat, in the gentleness of each boop, Yuelin heard a story louder than any shout. "You speak beautifully," she told him. "..." he replied.',
      unlockedBy: { playBoth: { masters: ['nik', 'yuelin'], hours: 5 } },
      rewards: { jadeCatnip: 1000, cosmetic: 'silent_lotus_aura' },
    },
    scott_origin: {
      id: 'scott_origin',
      title: 'The Thousand Day Meditation',
      fragments: 15,
      story: 'On the first day, Scott sat. On the hundredth day, moss grew on his shoulders. On the five hundredth day, birds nested in his hair. On the thousandth day, a cat sat on his head and purred. Scott smiled. That was the whole point.',
      unlockedBy: { afkHours: 100 },
      rewards: { jadeCatnip: 1200, technique: 'mountain_stance' },
    },
    gerald_origin: {
      id: 'gerald_origin',
      title: 'The Jade Palm Awakens',
      fragments: 10,
      story: 'Gerald did not seek the Snoot Scrolls. The Snoot Scrolls found him. On a quiet morning, a jade tablet fell from the sky and landed on his breakfast. Inscribed upon it: "Boop." He has not stopped since.',
      unlockedBy: { masterPlaytime: { master: 'gerald', hours: 20 } },
      rewards: { jadeCatnip: 1500, cosmetic: 'jade_palm_mark' },
    },
  },

  waifus: {
    mochi_secret: {
      id: 'mochi_secret',
      title: "The Warrior's Tea",
      fragments: 10,
      story: 'Few know that Mochi-chan was once a fierce warrior known as the Crimson Kettle. She brewed tea so hot it could melt steel. One day, a stray cat wandered into her teahouse. She set down her blade and picked up a ladle. She has not looked back.',
      unlockedBy: { waifuBond: { waifuId: 'mochi', level: 100 } },
      rewards: { jadeCatnip: 1000, cosmetic: 'crimson_kettle_apron' },
    },
    luna_past: {
      id: 'luna_past',
      title: 'Why She Watches the Night',
      fragments: 12,
      story: "Luna doesn't sleep because she fears the dreams. In them, she sees a sky without stars, a world without snoots. So she stays awake, counting each one, making sure they're all still there. *yawn* ...They always are.",
      unlockedBy: { waifuBond: { waifuId: 'luna', level: 100 } },
      rewards: { jadeCatnip: 1000, cosmetic: 'starlight_pajamas' },
    },
    nyanta_treasure: {
      id: 'nyanta_treasure',
      title: 'The Real Treasure',
      fragments: 8,
      story: "Captain Nyanta sailed the seven seas seeking gold. She found islands of fish, mountains of yarn, and seas of catnip. But the greatest treasure was the friends she made along the way. Just kidding — it was definitely the catnip.",
      unlockedBy: { waifuBond: { waifuId: 'nyanta', level: 100 } },
      rewards: { jadeCatnip: 800, cat: 'treasure_parrot_cat' },
    },
    grandmother_wisdom: {
      id: 'grandmother_wisdom',
      title: "Grandmother's Final Lesson",
      fragments: 15,
      story: "Grandmother Whiskers taught every waifu in the sect. Her final lesson was always the same: 'A boop given freely is worth ten thousand forced.' She vanished one morning, leaving behind only a single white whisker and a faint purr on the wind.",
      unlockedBy: {
        waifuBond: { waifuId: 'grandmother', level: 100 },
        totalBoops: 100000,
      },
      rewards: { jadeCatnip: 2000, technique: 'grandmothers_touch', cosmetic: 'white_whisker' },
    },
  },

  sect: {
    founding_story: {
      id: 'founding_story',
      title: 'The Founding of the Celestial Snoot Sect',
      fragments: 8,
      story: 'Seven strangers. One cat. The cat had a snoot. The snoot demanded booping. In that moment, the Celestial Snoot Sect was born. No charter was signed. No oaths were sworn. Just seven people, one cat, and a sacred boop.',
      unlockedBy: { playtimeHours: 10 },
      rewards: { jadeCatnip: 500, cosmetic: 'founders_seal' },
    },
    eighth_master_mystery: {
      id: 'eighth_master_mystery',
      title: 'The Forgotten Eighth',
      fragments: 20,
      story: 'There were always eight. The histories say seven, but the Snoot Scrolls tell a different tale. An eighth master, erased from memory, sealed beyond the heavens. Their name is lost. Their boops echo still. Who were they? Why were they forgotten? The answer lies beyond ascension.',
      unlockedBy: { totalBoops: 1000000, heavenlySeals: 100 },
      rewards: { jadeCatnip: 5000, technique: 'forgotten_palm', cat: 'eighth_masters_cat' },
    },
    primordial_snoot: {
      id: 'primordial_snoot',
      title: 'The Primordial Snoot',
      fragments: 25,
      story: 'Before the universe, before time, before cats — there was the Snoot. The first thing to exist. The first thing to be booped. From that primordial boop, all of creation sprang forth. Stars are but scattered boop particles. You are made of ancient snoots.',
      unlockedBy: { transcendence: true },
      rewards: { jadeCatnip: 10000, cosmetic: 'primordial_aura', technique: 'snoot_of_creation' },
    },
  },
};

// --- Helpers ---

function getAllLoreEntries(): Array<{ id: string; category: string; entry: LoreEntry }> {
  const results: Array<{ id: string; category: string; entry: LoreEntry }> = [];
  for (const category of Object.keys(LORE_ENTRIES)) {
    for (const [id, entry] of Object.entries(LORE_ENTRIES[category])) {
      results.push({ id, category, entry });
    }
  }
  return results;
}

function getTotalLoreCount(): number {
  return getAllLoreEntries().length;
}

// --- Class ---

export class LoreSystem {
  collectedFragments: Record<string, number>;
  unlockedStories: string[];
  stats: LoreStats;

  constructor() {
    this.collectedFragments = {};
    this.unlockedStories = [];
    this.stats = {
      totalFragmentsFound: 0,
      storiesUnlocked: 0,
      lastFragmentTime: null,
    };
  }

  checkForFragmentDrop(gameState: LoreGameState): FragmentDropResult | null {
    if (Math.random() >= 0.01) {
      return null;
    }

    const eligible = this.getEligibleLoreEntries(gameState);
    if (eligible.length === 0) {
      return null;
    }

    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    const entryId = pick.id;

    if (!this.collectedFragments[entryId]) {
      this.collectedFragments[entryId] = 0;
    }
    this.collectedFragments[entryId]++;
    this.stats.totalFragmentsFound++;
    this.stats.lastFragmentTime = Date.now();

    const current = this.collectedFragments[entryId];
    const required = pick.entry.fragments;
    const completed = current >= required;

    let rewards: LoreRewards | undefined;
    if (completed) {
      rewards = this.unlockStory(entryId);
    }

    return {
      entryId,
      category: pick.category,
      current: Math.min(current, required),
      required,
      title: pick.entry.title,
      completed,
      rewards,
    };
  }

  getEligibleLoreEntries(
    gameState: LoreGameState
  ): Array<{ id: string; category: string; entry: LoreEntry }> {
    return getAllLoreEntries().filter(({ id, entry }) => {
      if (this.unlockedStories.includes(id)) {
        return false;
      }
      if ((this.collectedFragments[id] || 0) >= entry.fragments) {
        return false;
      }
      return this.meetsUnlockCondition(entry.unlockedBy, gameState);
    });
  }

  meetsUnlockCondition(condition: LoreCondition, gameState: LoreGameState): boolean {
    if (condition.boops !== undefined) {
      if (gameState.totalBoops < condition.boops) return false;
    }

    if (condition.gooseBoops !== undefined) {
      if (gameState.gooseBoops < condition.gooseBoops) return false;
    }

    if (condition.catsCollected !== undefined) {
      const count = gameState.catsCollected ?? gameState.catCount;
      if (count < condition.catsCollected) return false;
    }

    if (condition.afkHours !== undefined) {
      if (gameState.afkHours < condition.afkHours) return false;
    }

    if (condition.playBoth !== undefined) {
      const { masters, hours } = condition.playBoth;
      const thresholdSeconds = hours * 3600;
      for (const masterId of masters) {
        if ((gameState.masterPlaytime[masterId] || 0) < thresholdSeconds) {
          return false;
        }
      }
    }

    if (condition.masterPlaytime !== undefined) {
      const { master, hours } = condition.masterPlaytime;
      const thresholdSeconds = hours * 3600;
      if ((gameState.masterPlaytime[master] || 0) < thresholdSeconds) {
        return false;
      }
    }

    if (condition.waifuBond !== undefined) {
      const { waifuId, level } = condition.waifuBond;
      if ((gameState.waifuBonds[waifuId] || 0) < level) return false;
    }

    if (condition.totalBoops !== undefined) {
      if (gameState.totalBoops < condition.totalBoops) return false;
    }

    if (condition.heavenlySeals !== undefined) {
      if (gameState.heavenlySeals < condition.heavenlySeals) return false;
    }

    if (condition.transcendence !== undefined) {
      if (condition.transcendence && !gameState.transcended) return false;
    }

    if (condition.playtimeHours !== undefined) {
      const playtime = gameState.playtimeHours ?? 0;
      if (playtime < condition.playtimeHours) return false;
    }

    return true;
  }

  unlockStory(id: string): LoreRewards {
    if (!this.unlockedStories.includes(id)) {
      this.unlockedStories.push(id);
      this.stats.storiesUnlocked++;
    }

    const allEntries = getAllLoreEntries();
    const found = allEntries.find((e) => e.id === id);
    return found ? found.entry.rewards : {};
  }

  getProgress(): LoreProgress {
    const total = getTotalLoreCount();
    const unlocked = this.unlockedStories.length;
    return {
      total,
      unlocked,
      percentComplete: total > 0 ? Math.round((unlocked / total) * 10000) / 100 : 0,
    };
  }

  getEntryProgress(entryId: string): { current: number; required: number; unlocked: boolean } | null {
    const allEntries = getAllLoreEntries();
    const found = allEntries.find((e) => e.id === entryId);
    if (!found) return null;
    return {
      current: Math.min(this.collectedFragments[entryId] || 0, found.entry.fragments),
      required: found.entry.fragments,
      unlocked: this.unlockedStories.includes(entryId),
    };
  }

  serialize(): LoreSerializedData {
    return {
      collectedFragments: { ...this.collectedFragments },
      unlockedStories: [...this.unlockedStories],
      stats: { ...this.stats },
    };
  }

  deserialize(data: LoreSerializedData): void {
    this.collectedFragments = data.collectedFragments ?? {};
    this.unlockedStories = data.unlockedStories ?? [];
    this.stats = data.stats ?? {
      totalFragmentsFound: 0,
      storiesUnlocked: 0,
      lastFragmentTime: null,
    };
  }
}

export { LORE_ENTRIES };
export type {
  LoreEntry,
  LoreCondition,
  LoreRewards,
  LoreGameState,
  FragmentDropResult,
  LoreProgress,
  LoreStats,
  LoreSerializedData,
};
