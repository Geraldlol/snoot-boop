/**
 * SectWarSystem - Weekly competitive wars between sects
 *
 * Tracks a single active war (or null), records session stats, calculates
 * standings, archives results. Pure TypeScript, zero React imports.
 */

// ─── Data ────────────────────────────────────────────────────

export type WarType =
  | 'boop_count'
  | 'cats_recruited'
  | 'dungeon_floors'
  | 'goose_boops'
  | 'cultivation_xp'
  | 'waifu_bonds';

export interface WarTypeDef {
  id: WarType;
  name: string;
  description: string;
  unit: string;
}

export const WAR_TYPES: Record<WarType, WarTypeDef> = {
  boop_count:      { id: 'boop_count',      name: 'Boop Blitz',          description: 'Most boops in one week',             unit: 'boops' },
  cats_recruited:  { id: 'cats_recruited',   name: 'Great Cat Roundup',   description: 'Most cats recruited in one week',    unit: 'cats' },
  dungeon_floors:  { id: 'dungeon_floors',   name: 'Pagoda Ascent',       description: 'Most dungeon floors cleared',        unit: 'floors' },
  goose_boops:     { id: 'goose_boops',      name: 'Goose Hunter',        description: 'Most geese booped in one week',      unit: 'geese' },
  cultivation_xp:  { id: 'cultivation_xp',   name: 'Cultivation Sprint',  description: 'Most cultivation XP earned',         unit: 'XP' },
  waifu_bonds:     { id: 'waifu_bonds',      name: 'Heart of the Sect',   description: 'Most waifu bond points earned',      unit: 'bond' },
};

const WAR_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

// ─── Rewards ─────────────────────────────────────────────────

export interface WarReward {
  placement: 'winner' | 'top3' | 'participant';
  jadeCatnip: number;
}

const WAR_REWARDS: Record<string, WarReward> = {
  winner:      { placement: 'winner',      jadeCatnip: 500 },
  top3:        { placement: 'top3',        jadeCatnip: 200 },
  participant: { placement: 'participant', jadeCatnip: 50 },
};

// ─── Participant ─────────────────────────────────────────────

export interface WarParticipant {
  id: string;       // master id or player id
  name: string;
  score: number;
}

// ─── War Instance ────────────────────────────────────────────

export interface SectWar {
  id: string;
  warType: WarType;
  startTime: number;
  endTime: number;
  participants: WarParticipant[];
  finished: boolean;
  winnerId: string | null;
}

// ─── War History Entry ───────────────────────────────────────

export interface WarHistoryEntry {
  id: string;
  warType: WarType;
  startTime: number;
  endTime: number;
  participants: WarParticipant[];
  winnerId: string | null;
}

// ─── Session Stats ───────────────────────────────────────────

export type SessionStats = Record<WarType, number>;

function emptySessionStats(): SessionStats {
  return {
    boop_count: 0,
    cats_recruited: 0,
    dungeon_floors: 0,
    goose_boops: 0,
    cultivation_xp: 0,
    waifu_bonds: 0,
  };
}

// ─── Aggregate Stats ─────────────────────────────────────────

export interface SectWarStats {
  totalWarsParticipated: number;
  totalWarsWon: number;
  totalJadeCatnipEarned: number;
}

// ─── System ──────────────────────────────────────────────────

export class SectWarSystem {
  private currentWar: SectWar | null = null;
  private warHistory: WarHistoryEntry[] = [];
  private sessionStats: SessionStats = emptySessionStats();
  private stats: SectWarStats = {
    totalWarsParticipated: 0,
    totalWarsWon: 0,
    totalJadeCatnipEarned: 0,
  };

  private static readonly MAX_HISTORY = 10;

  // ── War Lifecycle ─────────────────────────────────────────

  /**
   * Start a new weekly war. Returns the war instance or null if one is
   * already in progress.
   */
  startWeeklyWar(warType: WarType): SectWar | null {
    if (this.currentWar && !this.currentWar.finished) return null;

    const now = Date.now();
    const war: SectWar = {
      id: `war_${now}`,
      warType,
      startTime: now,
      endTime: now + WAR_DURATION_MS,
      participants: [],
      finished: false,
      winnerId: null,
    };

    this.currentWar = war;
    this.sessionStats = emptySessionStats();

    return war;
  }

  /**
   * Increment a session stat. Only counts toward the active war if the
   * stat matches the current war type.
   */
  updateProgress(stat: WarType, amount: number): void {
    this.sessionStats[stat] += amount;

    // Update participant score if stat matches active war
    if (this.currentWar && !this.currentWar.finished && stat === this.currentWar.warType) {
      this.ensureParticipant();
      const participant = this.currentWar.participants.find(p => p.id === 'player');
      if (participant) {
        participant.score += amount;
      }
    }
  }

  /**
   * End the current war, calculate standings, and archive.
   * Returns the reward earned, or null if no war was active.
   */
  endWeeklyWar(): WarReward | null {
    if (!this.currentWar || this.currentWar.finished) return null;

    const war = this.currentWar;
    war.finished = true;

    // Sort participants by score descending
    war.participants.sort((a, b) => b.score - a.score);

    // Determine winner
    if (war.participants.length > 0) {
      war.winnerId = war.participants[0].id;
    }

    // Calculate player placement
    const playerIndex = war.participants.findIndex(p => p.id === 'player');
    let reward: WarReward;

    if (playerIndex === 0) {
      reward = WAR_REWARDS.winner;
    } else if (playerIndex > 0 && playerIndex < 3) {
      reward = WAR_REWARDS.top3;
    } else {
      reward = WAR_REWARDS.participant;
    }

    // Update aggregate stats
    this.stats.totalWarsParticipated++;
    if (war.winnerId === 'player') {
      this.stats.totalWarsWon++;
    }
    this.stats.totalJadeCatnipEarned += reward.jadeCatnip;

    // Archive
    this.warHistory.push({
      id: war.id,
      warType: war.warType,
      startTime: war.startTime,
      endTime: war.endTime,
      participants: war.participants,
      winnerId: war.winnerId,
    });
    if (this.warHistory.length > SectWarSystem.MAX_HISTORY) {
      this.warHistory.shift();
    }

    this.currentWar = null;
    return reward;
  }

  /**
   * Check whether the active war's time has elapsed and auto-end if so.
   * Returns a reward if the war was ended, otherwise null.
   */
  checkWarExpiry(): WarReward | null {
    if (!this.currentWar || this.currentWar.finished) return null;
    if (Date.now() >= this.currentWar.endTime) {
      return this.endWeeklyWar();
    }
    return null;
  }

  // ── Participant Management ────────────────────────────────

  /**
   * Add an NPC participant (e.g. another master) with a simulated score.
   */
  addNpcParticipant(id: string, name: string, score: number): void {
    if (!this.currentWar) return;
    const existing = this.currentWar.participants.find(p => p.id === id);
    if (existing) {
      existing.score = score;
    } else {
      this.currentWar.participants.push({ id, name, score });
    }
  }

  private ensureParticipant(): void {
    if (!this.currentWar) return;
    if (!this.currentWar.participants.find(p => p.id === 'player')) {
      this.currentWar.participants.push({ id: 'player', name: 'Player', score: 0 });
    }
  }

  // ── Queries ───────────────────────────────────────────────

  getCurrentWar(): Readonly<SectWar> | null {
    return this.currentWar;
  }

  getWarHistory(): readonly WarHistoryEntry[] {
    return this.warHistory;
  }

  getSessionStats(): Readonly<SessionStats> {
    return this.sessionStats;
  }

  getStats(): Readonly<SectWarStats> {
    return this.stats;
  }

  isWarActive(): boolean {
    return this.currentWar !== null && !this.currentWar.finished;
  }

  getWarTimeRemaining(): number {
    if (!this.currentWar || this.currentWar.finished) return 0;
    return Math.max(0, this.currentWar.endTime - Date.now());
  }

  getPlayerRank(): number {
    if (!this.currentWar) return -1;
    const sorted = [...this.currentWar.participants].sort((a, b) => b.score - a.score);
    const idx = sorted.findIndex(p => p.id === 'player');
    return idx >= 0 ? idx + 1 : -1;
  }

  // ── Serialization ─────────────────────────────────────────

  serialize(): Record<string, unknown> {
    return {
      currentWar: this.currentWar,
      warHistory: this.warHistory,
      sessionStats: this.sessionStats,
      stats: this.stats,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.currentWar) this.currentWar = data.currentWar as SectWar;
    if (Array.isArray(data.warHistory)) {
      this.warHistory = (data.warHistory as WarHistoryEntry[]).slice(-SectWarSystem.MAX_HISTORY);
    }
    if (data.sessionStats) this.sessionStats = data.sessionStats as SessionStats;
    if (data.stats) this.stats = data.stats as SectWarStats;
  }
}
