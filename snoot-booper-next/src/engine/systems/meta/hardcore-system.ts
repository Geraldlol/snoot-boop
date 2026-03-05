// HardcoreSystem - Challenge modes with unique restrictions and rewards

// ─── Types ──────────────────────────────────────────────────

export type HardcoreAction = 'manualBoop' | 'attack' | 'recruitCat' | 'prestige' | 'revive';

export interface HardcoreModeModifiers {
  permadeath?: boolean;
  noPrestige?: boolean;
  noRevive?: boolean;
  singleSave?: boolean;
  noManualBoop?: boolean;
  maxCats?: number;
  playAsGoose?: boolean;
  invertedMorality?: boolean;
  timer?: boolean;
  noAttack?: boolean;
  chaosMode?: boolean;
}

export interface HardcoreModeReward {
  badge: string;
  title: string;
  cosmetics: string[];
}

export interface HardcoreModeDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  modifiers: HardcoreModeModifiers;
  goal: { type: 'pagoda'; floor: number } | { type: 'survive'; minutes: number };
  reward: HardcoreModeReward;
}

export interface ChaosMultipliers {
  bpMult: number;
  ppMult: number;
  critChance: number;
}

export interface HardcoreStats {
  totalModesStarted: number;
  totalModesCompleted: number;
  totalModesFailed: number;
  fastestCompletions: Record<string, number>;
}

// ─── Data ───────────────────────────────────────────────────

export const HARDCORE_MODES: Record<string, HardcoreModeDef> = {
  ironman: {
    id: 'ironman',
    name: 'Ironman',
    emoji: '\uD83D\uDEE1\uFE0F',
    description: 'Permadeath. No prestige. No revives. One save file. Reach Pagoda floor 100.',
    modifiers: {
      permadeath: true,
      noPrestige: true,
      noRevive: true,
      singleSave: true,
    },
    goal: { type: 'pagoda', floor: 100 },
    reward: {
      badge: 'badge_ironman',
      title: 'The Unbreakable',
      cosmetics: ['ironman_aura', 'steel_hat', 'iron_paws'],
    },
  },
  no_boop: {
    id: 'no_boop',
    name: 'No Boop Challenge',
    emoji: '\uD83D\uDEAB',
    description: 'You may not manually boop any snoots. Automation only. Reach Pagoda floor 50.',
    modifiers: {
      noManualBoop: true,
    },
    goal: { type: 'pagoda', floor: 50 },
    reward: {
      badge: 'badge_no_boop',
      title: 'The Untouched',
      cosmetics: ['ghost_paws', 'zen_aura'],
    },
  },
  one_cat_army: {
    id: 'one_cat_army',
    name: 'One Cat Army',
    emoji: '\uD83D\uDC31',
    description: 'You may only ever have one cat. Make it count. Reach Pagoda floor 50.',
    modifiers: {
      maxCats: 1,
    },
    goal: { type: 'pagoda', floor: 50 },
    reward: {
      badge: 'badge_one_cat',
      title: 'The Lone Wolf... Cat',
      cosmetics: ['solo_crown', 'champion_cape'],
    },
  },
  goose_mode: {
    id: 'goose_mode',
    name: 'Goose Mode',
    emoji: '\uD83E\uDD86',
    description: 'Play as a goose. Morality is inverted. Chaos reigns. Reach Pagoda floor 50.',
    modifiers: {
      playAsGoose: true,
      invertedMorality: true,
    },
    goal: { type: 'pagoda', floor: 50 },
    reward: {
      badge: 'badge_goose_mode',
      title: 'Horrible Goose',
      cosmetics: ['goose_skin', 'honk_trail', 'feather_crown'],
    },
  },
  speed_run: {
    id: 'speed_run',
    name: 'Speed Run',
    emoji: '\u23F1\uFE0F',
    description: 'Race against the clock. Reach Pagoda floor 50 as fast as possible.',
    modifiers: {
      timer: true,
    },
    goal: { type: 'pagoda', floor: 50 },
    reward: {
      badge: 'badge_speed_run',
      title: 'The Flash Paw',
      cosmetics: ['lightning_trail', 'stopwatch_hat'],
    },
  },
  pacifist: {
    id: 'pacifist',
    name: 'Pacifist',
    emoji: '\u262E\uFE0F',
    description: 'No attacking. Find another way. Reach Pagoda floor 50.',
    modifiers: {
      noAttack: true,
    },
    goal: { type: 'pagoda', floor: 50 },
    reward: {
      badge: 'badge_pacifist',
      title: 'The Peaceful Paw',
      cosmetics: ['halo_hat', 'flower_trail', 'dove_pet'],
    },
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos Mode',
    emoji: '\uD83C\uDF00',
    description: 'All stats are randomized every 60 seconds. Embrace the madness. Reach Pagoda floor 50.',
    modifiers: {
      chaosMode: true,
    },
    goal: { type: 'pagoda', floor: 50 },
    reward: {
      badge: 'badge_chaos',
      title: 'Agent of Chaos',
      cosmetics: ['chaos_aura', 'glitch_hat', 'static_trail'],
    },
  },
};

const CHAOS_RANDOMIZATION_INTERVAL_MS = 60 * 1000;  // 60 seconds

// ─── Serialization ──────────────────────────────────────────

export interface HardcoreSystemSave {
  activeMode: string | null;
  modeStartTime: number | null;
  completedModes: string[];
  unlockedBadges: string[];
  unlockedCosmetics: string[];
  modeBestTimes: Record<string, number>;
  stats: HardcoreStats;
}

// ─── HardcoreSystem Class ───────────────────────────────────

export class HardcoreSystem {
  activeMode: string | null = null;
  modeStartTime: number | null = null;
  completedModes: string[] = [];
  unlockedBadges: string[] = [];
  unlockedCosmetics: string[] = [];
  modeBestTimes: Record<string, number> = {};

  // Chaos tracking
  private lastChaosRandomization = 0;
  private currentChaosMultipliers: ChaosMultipliers | null = null;

  stats: HardcoreStats = {
    totalModesStarted: 0,
    totalModesCompleted: 0,
    totalModesFailed: 0,
    fastestCompletions: {},
  };

  // ── Mode Lifecycle ────────────────────────────────────────

  startMode(modeId: string): { success: boolean; mode?: HardcoreModeDef; error?: string } {
    const mode = HARDCORE_MODES[modeId];
    if (!mode) return { success: false, error: 'Unknown mode' };
    if (this.activeMode) return { success: false, error: 'A mode is already active' };

    this.activeMode = modeId;
    this.modeStartTime = Date.now();
    this.lastChaosRandomization = Date.now();
    this.currentChaosMultipliers = null;
    this.stats.totalModesStarted++;

    return { success: true, mode };
  }

  endMode(success: boolean): {
    modeId: string;
    success: boolean;
    elapsed: number;
    rewards?: HardcoreModeReward;
    newBest?: boolean;
  } | null {
    if (!this.activeMode || !this.modeStartTime) return null;

    const modeId = this.activeMode;
    const mode = HARDCORE_MODES[modeId];
    const elapsed = Date.now() - this.modeStartTime;

    let rewards: HardcoreModeReward | undefined;
    let newBest = false;

    if (success) {
      this.stats.totalModesCompleted++;

      if (!this.completedModes.includes(modeId)) {
        this.completedModes.push(modeId);
      }

      // Grant rewards
      rewards = mode.reward;
      if (!this.unlockedBadges.includes(rewards.badge)) {
        this.unlockedBadges.push(rewards.badge);
      }
      for (const cosmetic of rewards.cosmetics) {
        if (!this.unlockedCosmetics.includes(cosmetic)) {
          this.unlockedCosmetics.push(cosmetic);
        }
      }

      // Record best time
      const prev = this.modeBestTimes[modeId];
      if (prev === undefined || elapsed < prev) {
        this.modeBestTimes[modeId] = elapsed;
        this.stats.fastestCompletions[modeId] = elapsed;
        newBest = true;
      }
    } else {
      this.stats.totalModesFailed++;
    }

    // Reset
    this.activeMode = null;
    this.modeStartTime = null;
    this.currentChaosMultipliers = null;

    return { modeId, success, elapsed, rewards, newBest };
  }

  // ── Completion Check ──────────────────────────────────────

  checkModeCompletion(highestPagodaFloor: number): boolean {
    if (!this.activeMode) return false;

    const mode = HARDCORE_MODES[this.activeMode];
    if (!mode) return false;

    if (mode.goal.type === 'pagoda') {
      return highestPagodaFloor >= mode.goal.floor;
    }

    return false;
  }

  // ── Action Validation ─────────────────────────────────────

  isActionAllowed(action: HardcoreAction): boolean {
    if (!this.activeMode) return true;

    const mode = HARDCORE_MODES[this.activeMode];
    if (!mode) return true;

    const m = mode.modifiers;

    switch (action) {
      case 'manualBoop':
        return !m.noManualBoop;
      case 'attack':
        return !m.noAttack;
      case 'recruitCat':
        // One Cat Army doesn't block recruiting outright - that's checked via maxCats
        return true;
      case 'prestige':
        return !m.noPrestige;
      case 'revive':
        return !m.noRevive;
      default:
        return true;
    }
  }

  getMaxCats(): number | null {
    if (!this.activeMode) return null;

    const mode = HARDCORE_MODES[this.activeMode];
    if (!mode) return null;

    return mode.modifiers.maxCats ?? null;
  }

  isPermadeath(): boolean {
    if (!this.activeMode) return false;
    const mode = HARDCORE_MODES[this.activeMode];
    return mode?.modifiers.permadeath ?? false;
  }

  isTimerMode(): boolean {
    if (!this.activeMode) return false;
    const mode = HARDCORE_MODES[this.activeMode];
    return mode?.modifiers.timer ?? false;
  }

  isChaosMode(): boolean {
    if (!this.activeMode) return false;
    const mode = HARDCORE_MODES[this.activeMode];
    return mode?.modifiers.chaosMode ?? false;
  }

  isGooseMode(): boolean {
    if (!this.activeMode) return false;
    const mode = HARDCORE_MODES[this.activeMode];
    return mode?.modifiers.playAsGoose ?? false;
  }

  getElapsedTime(): number {
    if (!this.modeStartTime) return 0;
    return Date.now() - this.modeStartTime;
  }

  // ── Chaos Randomization ───────────────────────────────────

  applyChaosRandomization(): ChaosMultipliers {
    const now = Date.now();

    // Check if it's time to re-randomize
    if (
      this.currentChaosMultipliers &&
      now - this.lastChaosRandomization < CHAOS_RANDOMIZATION_INTERVAL_MS
    ) {
      return this.currentChaosMultipliers;
    }

    // Generate new random multipliers
    this.lastChaosRandomization = now;
    this.currentChaosMultipliers = {
      bpMult: 0.5 + Math.random() * 2.0,     // 0.5 - 2.5
      ppMult: 0.5 + Math.random() * 2.0,     // 0.5 - 2.5
      critChance: Math.random() * 0.5,        // 0.0 - 0.5
    };

    return this.currentChaosMultipliers;
  }

  getChaosMultipliers(): ChaosMultipliers | null {
    if (!this.isChaosMode()) return null;
    return this.currentChaosMultipliers;
  }

  // ── Query ─────────────────────────────────────────────────

  getActiveModeDef(): HardcoreModeDef | null {
    if (!this.activeMode) return null;
    return HARDCORE_MODES[this.activeMode] ?? null;
  }

  isModeCompleted(modeId: string): boolean {
    return this.completedModes.includes(modeId);
  }

  getAllModes(): HardcoreModeDef[] {
    return Object.values(HARDCORE_MODES);
  }

  // ── Serialization ─────────────────────────────────────────

  serialize(): HardcoreSystemSave {
    return {
      activeMode: this.activeMode,
      modeStartTime: this.modeStartTime,
      completedModes: [...this.completedModes],
      unlockedBadges: [...this.unlockedBadges],
      unlockedCosmetics: [...this.unlockedCosmetics],
      modeBestTimes: { ...this.modeBestTimes },
      stats: {
        ...this.stats,
        fastestCompletions: { ...this.stats.fastestCompletions },
      },
    };
  }

  deserialize(data: HardcoreSystemSave): void {
    this.activeMode = data.activeMode ?? null;
    this.modeStartTime = data.modeStartTime ?? null;
    this.completedModes = data.completedModes ?? [];
    this.unlockedBadges = data.unlockedBadges ?? [];
    this.unlockedCosmetics = data.unlockedCosmetics ?? [];
    this.modeBestTimes = data.modeBestTimes ?? {};

    // Reset chaos state (will re-randomize on next tick)
    this.lastChaosRandomization = 0;
    this.currentChaosMultipliers = null;

    this.stats = {
      totalModesStarted: data.stats?.totalModesStarted ?? 0,
      totalModesCompleted: data.stats?.totalModesCompleted ?? 0,
      totalModesFailed: data.stats?.totalModesFailed ?? 0,
      fastestCompletions: data.stats?.fastestCompletions ?? {},
    };
  }
}
