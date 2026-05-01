/**
 * CelestialTournamentSystem - Weekly PvP tournament with AI opponents
 *
 * Pure TypeScript, zero React imports.
 * Pattern: serialize()/deserialize() for save/load.
 */

import type { MasterId } from '../../types';

// ─── Interfaces ─────────────────────────────────────────────

export interface TournamentAbility {
  name: string;
  multiplier: number;
  cooldown: number;
  special?: string;
}

export interface TournamentOpponent {
  id: MasterId;
  name: string;
  title: string;
  aiStyle: string;
  baseStats: CombatStats;
  abilities: TournamentAbility[];
  color: string;
}

export interface CombatStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  critChance: number;
  critDamage: number;
}

export interface TournamentCatUnit {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  critChance: number;
  critDamage: number;
  alive: boolean;
}

export interface OpponentAIState {
  aiStyle: string;
  /** Gerald: cycles passive(3)/aggressive(2) */
  geraldPhase: 'passive' | 'aggressive';
  geraldPhaseTimer: number;
  /** Rusty: rage below 50% */
  rustyRage: boolean;
  /** Steve: analyze counter, guaranteed crit next */
  steveAnalyzeTurns: number;
  steveGuaranteedCrit: boolean;
  /** Andrew: turn counter for burst combo */
  andrewTurnCount: number;
  /** Nik: shadow stacks (0-3) */
  nikShadowStacks: number;
  /** Yuelin: harmony stacks (0-5) */
  yuelinHarmonyStacks: number;
  /** Scott: fortify stacks (0-10) */
  scottFortifyStacks: number;
}

export interface BattleState {
  playerTeam: TournamentCatUnit[];
  opponent: TournamentOpponent;
  opponentHp: number;
  opponentMaxHp: number;
  opponentBuffedStats: CombatStats;
  turnCount: number;
  maxTurns: number;
  opponentAIState: OpponentAIState;
  battleLog: string[];
  finished: boolean;
  victory: boolean | null;
}

export interface TournamentWeeklyData {
  weekStart: number;
  completed: boolean;
  rewardsClaimed: boolean;
  wins: number;
  losses: number;
  bestRound: number;
}

export interface TournamentStats {
  totalTournaments: number;
  totalWins: number;
  totalLosses: number;
  championCount: number;
  defeatedMasters: Record<string, number>;
  highestStreak: number;
  currentStreak: number;
}

export interface LeaderboardEntry {
  name: string;
  masterId: MasterId;
  wins: number;
  championCount: number;
  timestamp: number;
}

export interface TournamentRewards {
  reputation: number;
  jadeCatnip: number;
  destinyThreads: number;
}

export interface BattleResult {
  victory: boolean;
  turnsTaken: number;
  opponentId: MasterId;
  rewards: TournamentRewards | null;
  log: string[];
}

// ─── Constants ──────────────────────────────────────────────

export const TOURNAMENT_OPPONENTS: Record<string, TournamentOpponent> = {
  gerald: {
    id: 'gerald',
    name: 'Gerald',
    title: 'The Jade Palm',
    aiStyle: 'meditation_bursts',
    baseStats: { hp: 1000, attack: 80, defense: 60, speed: 1.0, critChance: 0.10, critDamage: 1.5 },
    abilities: [
      { name: 'Tranquil Palm', multiplier: 0.6, cooldown: 0, special: 'passive_phase' },
      { name: 'Jade Burst', multiplier: 1.8, cooldown: 0, special: 'aggressive_phase' },
      { name: 'Meditation Heal', multiplier: 0, cooldown: 4, special: 'heal_30' },
    ],
    color: '#50C878',
  },
  rusty: {
    id: 'rusty',
    name: 'Rusty',
    title: 'The Crimson Fist',
    aiStyle: 'constant_pressure',
    baseStats: { hp: 900, attack: 120, defense: 40, speed: 1.3, critChance: 0.15, critDamage: 1.8 },
    abilities: [
      { name: 'Crimson Strike', multiplier: 1.0, cooldown: 0, special: 'multi_hit' },
      { name: 'Thousand Boop Barrage', multiplier: 0.5, cooldown: 3, special: 'triple_hit' },
      { name: 'Rage Mode', multiplier: 1.5, cooldown: 0, special: 'rage_passive' },
    ],
    color: '#DC143C',
  },
  steve: {
    id: 'steve',
    name: 'Steve',
    title: 'The Flowing River',
    aiStyle: 'optimal_timing',
    baseStats: { hp: 950, attack: 90, defense: 70, speed: 0.9, critChance: 0.20, critDamage: 2.0 },
    abilities: [
      { name: 'Calculated Strike', multiplier: 1.2, cooldown: 0, special: 'analyze' },
      { name: 'Perfect Timing', multiplier: 2.5, cooldown: 0, special: 'guaranteed_crit' },
      { name: 'Counter Flow', multiplier: 2.0, cooldown: 0, special: 'counter' },
    ],
    color: '#4169E1',
  },
  andrew: {
    id: 'andrew',
    name: 'Andrew',
    title: 'The Thunder Step',
    aiStyle: 'speed_rush',
    baseStats: { hp: 750, attack: 100, defense: 35, speed: 2.0, critChance: 0.12, critDamage: 1.6 },
    abilities: [
      { name: 'Lightning Strike', multiplier: 1.0, cooldown: 0, special: 'always_first' },
      { name: 'Thunder Dodge', multiplier: 0, cooldown: 0, special: 'dodge' },
      { name: 'Burst Combo', multiplier: 2.2, cooldown: 3, special: 'burst_every_3' },
    ],
    color: '#FFD700',
  },
  nik: {
    id: 'nik',
    name: 'Nik',
    title: 'The Shadow Moon',
    aiStyle: 'crit_fishing',
    baseStats: { hp: 700, attack: 110, defense: 30, speed: 1.4, critChance: 0.35, critDamage: 2.5 },
    abilities: [
      { name: 'Shadow Strike', multiplier: 1.0, cooldown: 0, special: 'shadow_stack' },
      { name: 'Phantom Boop', multiplier: 1.5, cooldown: 0, special: 'phantom_consume' },
      { name: 'Vanishing Step', multiplier: 0, cooldown: 5, special: 'evade_all' },
    ],
    color: '#483D8B',
  },
  yuelin: {
    id: 'yuelin',
    name: 'Yuelin',
    title: 'The Lotus Sage',
    aiStyle: 'healing_focus',
    baseStats: { hp: 1200, attack: 60, defense: 50, speed: 0.8, critChance: 0.05, critDamage: 1.3 },
    abilities: [
      { name: 'Lotus Palm', multiplier: 1.0, cooldown: 0, special: 'harmony_stack' },
      { name: 'Gentle Mend', multiplier: 0, cooldown: 2, special: 'heal_20' },
      { name: 'Harmonious Cleanse', multiplier: 0, cooldown: 0, special: 'full_heal_cleanse' },
    ],
    color: '#FFB6C1',
  },
  scott: {
    id: 'scott',
    name: 'Scott',
    title: 'The Mountain',
    aiStyle: 'stack_and_wait',
    baseStats: { hp: 1500, attack: 50, defense: 100, speed: 0.5, critChance: 0.05, critDamage: 1.2 },
    abilities: [
      { name: 'Stone Fist', multiplier: 0.8, cooldown: 0, special: 'fortify_stack' },
      { name: 'Mountain Guard', multiplier: 0, cooldown: 0, special: 'fortify_passive' },
      { name: 'Avalanche', multiplier: 0.3, cooldown: 0, special: 'avalanche_consume' },
    ],
    color: '#8B4513',
  },
};

export const TOURNAMENT_CONFIG = {
  totalRounds: 6,
  teamSize: 4,
  perRoundScaling: 0.15,
  rewardsPerWin: { reputation: 100, jadeCatnip: 500, destinyThreads: 25 } as TournamentRewards,
  championBonus: {
    title: 'Tournament Champion',
    jadeCatnip: 5000,
    reputation: 1000,
    destinyThreads: 100,
  },
  maxLeaderboardSize: 50,
};

// ─── System ─────────────────────────────────────────────────

export class CelestialTournamentSystem {
  // Persistent state
  private weeklyData: TournamentWeeklyData = {
    weekStart: 0,
    completed: false,
    rewardsClaimed: false,
    wins: 0,
    losses: 0,
    bestRound: 0,
  };

  private stats: TournamentStats = {
    totalTournaments: 0,
    totalWins: 0,
    totalLosses: 0,
    championCount: 0,
    defeatedMasters: {},
    highestStreak: 0,
    currentStreak: 0,
  };

  private leaderboard: LeaderboardEntry[] = [];

  // Run state (non-persisted)
  private inTournament = false;
  private currentRound = 0;
  private bracket: TournamentOpponent[] = [];
  private battleState: BattleState | null = null;
  private playerMasterId: MasterId | null = null;
  private pendingRewards: TournamentRewards = { reputation: 0, jadeCatnip: 0, destinyThreads: 0 };

  // ── Getters ──────────────────────────────────────────────

  getWeeklyData(): Readonly<TournamentWeeklyData> { return this.weeklyData; }
  getStats(): Readonly<TournamentStats> { return this.stats; }
  getLeaderboard(): readonly LeaderboardEntry[] { return this.leaderboard; }
  isInTournament(): boolean { return this.inTournament; }
  getCurrentRound(): number { return this.currentRound; }
  getBracket(): readonly TournamentOpponent[] { return this.bracket; }
  getBattleState(): Readonly<BattleState> | null { return this.battleState; }
  getPendingRewards(): Readonly<TournamentRewards> { return this.pendingRewards; }

  // ── Weekly Reset ─────────────────────────────────────────

  /** Returns true if a reset occurred. */
  checkWeeklyReset(): boolean {
    const now = Date.now();
    const currentWeekStart = this.getWeekStartUTC(now);

    if (this.weeklyData.weekStart < currentWeekStart) {
      this.weeklyData = {
        weekStart: currentWeekStart,
        completed: false,
        rewardsClaimed: false,
        wins: 0,
        losses: 0,
        bestRound: 0,
      };
      this.inTournament = false;
      this.currentRound = 0;
      this.bracket = [];
      this.battleState = null;
      this.pendingRewards = { reputation: 0, jadeCatnip: 0, destinyThreads: 0 };
      return true;
    }
    return false;
  }

  /** Get the timestamp of the most recent Sunday 00:00 UTC. */
  private getWeekStartUTC(timestamp: number): number {
    const d = new Date(timestamp);
    d.setUTCHours(0, 0, 0, 0);
    // setUTCDate to the previous Sunday
    const day = d.getUTCDay(); // 0=Sunday
    d.setUTCDate(d.getUTCDate() - day);
    return d.getTime();
  }

  // ── Start Tournament ─────────────────────────────────────

  startTournament(
    catTeam: { id: string; name: string; hp: number; attack: number; defense: number; speed: number; critChance: number; critDamage: number }[],
    playerMasterId: MasterId,
  ): { success: boolean; error?: string } {
    this.checkWeeklyReset();

    if (this.inTournament) return { success: false, error: 'Already in a tournament' };
    if (this.weeklyData.completed) return { success: false, error: 'Weekly tournament already completed' };
    if (catTeam.length !== TOURNAMENT_CONFIG.teamSize) {
      return { success: false, error: `Team must have exactly ${TOURNAMENT_CONFIG.teamSize} cats` };
    }

    this.playerMasterId = playerMasterId;
    this.inTournament = true;
    this.currentRound = 0;
    this.pendingRewards = { reputation: 0, jadeCatnip: 0, destinyThreads: 0 };

    // Generate bracket: all 7 masters, exclude player's, shuffle, take 6
    const available = Object.values(TOURNAMENT_OPPONENTS).filter(
      (o) => o.id !== playerMasterId,
    );
    this.bracket = this.shuffle([...available]).slice(0, TOURNAMENT_CONFIG.totalRounds);

    this.stats.totalTournaments++;

    return { success: true };
  }

  // ── Start Battle ─────────────────────────────────────────

  startBattle(
    catTeam: { id: string; name: string; hp: number; attack: number; defense: number; speed: number; critChance: number; critDamage: number }[],
  ): { success: boolean; error?: string; battleState?: BattleState } {
    if (!this.inTournament) return { success: false, error: 'Not in a tournament' };
    if (this.currentRound >= this.bracket.length) return { success: false, error: 'No more rounds' };
    if (this.battleState?.finished === false) return { success: false, error: 'Battle already in progress' };

    const opponent = this.bracket[this.currentRound];
    const roundScale = 1 + this.currentRound * TOURNAMENT_CONFIG.perRoundScaling;

    const scaledStats: CombatStats = {
      hp: Math.floor(opponent.baseStats.hp * roundScale),
      attack: Math.floor(opponent.baseStats.attack * roundScale),
      defense: Math.floor(opponent.baseStats.defense * roundScale),
      speed: opponent.baseStats.speed,
      critChance: opponent.baseStats.critChance,
      critDamage: opponent.baseStats.critDamage,
    };

    const playerUnits: TournamentCatUnit[] = catTeam.map((c) => ({
      id: c.id,
      name: c.name,
      hp: c.hp,
      maxHp: c.hp,
      attack: c.attack,
      defense: c.defense,
      speed: c.speed,
      critChance: c.critChance,
      critDamage: c.critDamage,
      alive: true,
    }));

    this.battleState = {
      playerTeam: playerUnits,
      opponent,
      opponentHp: scaledStats.hp,
      opponentMaxHp: scaledStats.hp,
      opponentBuffedStats: scaledStats,
      turnCount: 0,
      maxTurns: 100,
      opponentAIState: this.createAIState(opponent.aiStyle),
      battleLog: [`Round ${this.currentRound + 1}: VS ${opponent.name} ${opponent.title}`],
      finished: false,
      victory: null,
    };

    return { success: true, battleState: this.battleState };
  }

  private createAIState(aiStyle: string): OpponentAIState {
    return {
      aiStyle,
      geraldPhase: 'passive',
      geraldPhaseTimer: 3,
      rustyRage: false,
      steveAnalyzeTurns: 0,
      steveGuaranteedCrit: false,
      andrewTurnCount: 0,
      nikShadowStacks: 0,
      yuelinHarmonyStacks: 0,
      scottFortifyStacks: 0,
    };
  }

  // ── Simulate Full Battle ─────────────────────────────────

  simulateBattle(): BattleResult | null {
    if (!this.battleState || this.battleState.finished) return null;

    while (!this.battleState.finished) {
      this.battleState.turnCount++;

      if (this.battleState.turnCount > this.battleState.maxTurns) {
        // Timeout: higher HP% wins
        const playerHpPercent = this.getTeamHpPercent();
        const opponentHpPercent = this.battleState.opponentHp / this.battleState.opponentMaxHp;
        const victory = playerHpPercent >= opponentHpPercent;
        this.battleState.battleLog.push(
          `Turn limit reached! ${victory ? 'Player' : this.battleState.opponent.name} wins by HP%.`,
        );
        return this.endBattle(victory);
      }

      // Andrew always goes first
      if (this.battleState.opponent.aiStyle === 'speed_rush') {
        this.processOpponentTurn();
        if (this.checkBattleEnd()) continue;
        this.processPlayerTurn();
      } else {
        this.processPlayerTurn();
        if (this.checkBattleEnd()) continue;
        this.processOpponentTurn();
      }

      this.checkBattleEnd();
    }

    return {
      victory: this.battleState.victory!,
      turnsTaken: this.battleState.turnCount,
      opponentId: this.battleState.opponent.id,
      rewards: this.battleState.victory ? { ...TOURNAMENT_CONFIG.rewardsPerWin } : null,
      log: this.battleState.battleLog,
    };
  }

  // ── Player Turn ──────────────────────────────────────────

  private processPlayerTurn(): void {
    const bs = this.battleState!;

    for (const cat of bs.playerTeam) {
      if (!cat.alive) continue;

      const isCrit = Math.random() < cat.critChance;
      const baseDmg = cat.attack * (isCrit ? cat.critDamage : 1.0);
      const damage = this.applyDefense(baseDmg, bs.opponentBuffedStats.defense);

      bs.opponentHp -= damage;
      bs.battleLog.push(
        `${cat.name} hits ${bs.opponent.name} for ${damage}${isCrit ? ' CRIT!' : ''}`,
      );

      if (bs.opponentHp <= 0) {
        bs.opponentHp = 0;
        return;
      }
    }
  }

  // ── Opponent Turn ────────────────────────────────────────

  private processOpponentTurn(): void {
    const bs = this.battleState!;
    const ai = bs.opponentAIState;
    const stats = bs.opponentBuffedStats;
    const hpPercent = bs.opponentHp / bs.opponentMaxHp;

    switch (ai.aiStyle) {
      case 'meditation_bursts':
        this.aiGerald(bs, ai, stats, hpPercent);
        break;
      case 'constant_pressure':
        this.aiRusty(bs, ai, stats, hpPercent);
        break;
      case 'optimal_timing':
        this.aiSteve(bs, ai, stats, hpPercent);
        break;
      case 'speed_rush':
        this.aiAndrew(bs, ai, stats, hpPercent);
        break;
      case 'crit_fishing':
        this.aiNik(bs, ai, stats, hpPercent);
        break;
      case 'healing_focus':
        this.aiYuelin(bs, ai, stats, hpPercent);
        break;
      case 'stack_and_wait':
        this.aiScott(bs, ai, stats, hpPercent);
        break;
    }
  }

  // ── AI: Gerald - meditation_bursts ───────────────────────

  private aiGerald(bs: BattleState, ai: OpponentAIState, stats: CombatStats, hpPercent: number): void {
    // Heal at <40% HP
    if (hpPercent < 0.4 && Math.random() < 0.5) {
      const healAmount = Math.floor(bs.opponentMaxHp * 0.3);
      bs.opponentHp = Math.min(bs.opponentMaxHp, bs.opponentHp + healAmount);
      bs.battleLog.push(`${bs.opponent.name} meditates and heals for ${healAmount}!`);
      return;
    }

    // Cycle phases
    ai.geraldPhaseTimer--;
    if (ai.geraldPhaseTimer <= 0) {
      if (ai.geraldPhase === 'passive') {
        ai.geraldPhase = 'aggressive';
        ai.geraldPhaseTimer = 2;
        bs.battleLog.push(`${bs.opponent.name} shifts to aggressive stance!`);
      } else {
        ai.geraldPhase = 'passive';
        ai.geraldPhaseTimer = 3;
        bs.battleLog.push(`${bs.opponent.name} returns to meditation.`);
      }
    }

    const mult = ai.geraldPhase === 'passive' ? 0.6 : 1.8;
    const target = this.pickAliveTarget(bs);
    if (!target) return;

    const isCrit = Math.random() < stats.critChance;
    const baseDmg = stats.attack * mult * (isCrit ? stats.critDamage : 1.0);
    const damage = this.applyDefense(baseDmg, target.defense);
    target.hp -= damage;

    bs.battleLog.push(
      `${bs.opponent.name} uses ${ai.geraldPhase === 'passive' ? 'Tranquil Palm' : 'Jade Burst'} on ${target.name} for ${damage}${isCrit ? ' CRIT!' : ''}`,
    );

    if (target.hp <= 0) {
      target.hp = 0;
      target.alive = false;
      bs.battleLog.push(`${target.name} has fallen!`);
    }
  }

  // ── AI: Rusty - constant_pressure ────────────────────────

  private aiRusty(bs: BattleState, ai: OpponentAIState, stats: CombatStats, hpPercent: number): void {
    // Rage at <50% HP
    if (hpPercent < 0.5 && !ai.rustyRage) {
      ai.rustyRage = true;
      bs.battleLog.push(`${bs.opponent.name} enters RAGE MODE!`);
    }

    const rageMult = ai.rustyRage ? 1.5 : 1.0;

    // 30% chance for multi-hit (up to 3)
    const hits = Math.random() < 0.3 ? (1 + Math.floor(Math.random() * 3)) : 1;

    for (let i = 0; i < hits; i++) {
      const target = this.pickAliveTarget(bs);
      if (!target) return;

      const isCrit = Math.random() < stats.critChance;
      const baseDmg = stats.attack * rageMult * (isCrit ? stats.critDamage : 1.0);
      const damage = this.applyDefense(baseDmg, target.defense);
      target.hp -= damage;

      bs.battleLog.push(
        `${bs.opponent.name} Crimson Strikes ${target.name} for ${damage}${isCrit ? ' CRIT!' : ''}${hits > 1 ? ` (hit ${i + 1}/${hits})` : ''}`,
      );

      if (target.hp <= 0) {
        target.hp = 0;
        target.alive = false;
        bs.battleLog.push(`${target.name} has fallen!`);
      }
    }
  }

  // ── AI: Steve - optimal_timing ───────────────────────────

  private aiSteve(bs: BattleState, ai: OpponentAIState, stats: CombatStats, _hpPercent: number): void {
    // Counter chance on every turn (0.4)
    if (Math.random() < 0.4) {
      const target = this.pickAliveTarget(bs);
      if (target) {
        const counterDmg = this.applyDefense(stats.attack * 2.0, target.defense);
        target.hp -= counterDmg;
        bs.battleLog.push(`${bs.opponent.name} counter-attacks ${target.name} for ${counterDmg}!`);
        if (target.hp <= 0) {
          target.hp = 0;
          target.alive = false;
          bs.battleLog.push(`${target.name} has fallen!`);
        }
      }
    }

    // Analyze for 2 turns, then guaranteed crit
    if (ai.steveGuaranteedCrit) {
      ai.steveGuaranteedCrit = false;
      ai.steveAnalyzeTurns = 0;
      const target = this.pickAliveTarget(bs);
      if (!target) return;

      const baseDmg = stats.attack * 2.5 * stats.critDamage;
      const damage = this.applyDefense(baseDmg, target.defense);
      target.hp -= damage;

      bs.battleLog.push(`${bs.opponent.name} uses Perfect Timing on ${target.name} for ${damage} GUARANTEED CRIT!`);
      if (target.hp <= 0) {
        target.hp = 0;
        target.alive = false;
        bs.battleLog.push(`${target.name} has fallen!`);
      }
      return;
    }

    ai.steveAnalyzeTurns++;
    if (ai.steveAnalyzeTurns >= 2) {
      ai.steveGuaranteedCrit = true;
      bs.battleLog.push(`${bs.opponent.name} finishes analyzing... Next strike will be perfect.`);
    }

    // Normal calculated strike
    const target = this.pickAliveTarget(bs);
    if (!target) return;

    const isCrit = Math.random() < stats.critChance;
    const baseDmg = stats.attack * 1.2 * (isCrit ? stats.critDamage : 1.0);
    const damage = this.applyDefense(baseDmg, target.defense);
    target.hp -= damage;

    bs.battleLog.push(
      `${bs.opponent.name} Calculated Strike on ${target.name} for ${damage}${isCrit ? ' CRIT!' : ''}`,
    );
    if (target.hp <= 0) {
      target.hp = 0;
      target.alive = false;
      bs.battleLog.push(`${target.name} has fallen!`);
    }
  }

  // ── AI: Andrew - speed_rush ──────────────────────────────

  private aiAndrew(bs: BattleState, ai: OpponentAIState, stats: CombatStats, hpPercent: number): void {
    ai.andrewTurnCount++;

    // Dodge chance (25%, 50% when <30% HP)
    const dodgeChance = hpPercent < 0.3 ? 0.5 : 0.25;
    // (Dodge is checked when receiving damage, but we represent it as a "dodge turn" flavor)

    // Burst combo every 3rd turn
    if (ai.andrewTurnCount % 3 === 0) {
      bs.battleLog.push(`${bs.opponent.name} unleashes a Burst Combo!`);
      for (let i = 0; i < 3; i++) {
        const target = this.pickAliveTarget(bs);
        if (!target) return;

        const isCrit = Math.random() < stats.critChance;
        const baseDmg = stats.attack * 2.2 / 3 * (isCrit ? stats.critDamage : 1.0);
        const damage = this.applyDefense(baseDmg, target.defense);
        target.hp -= damage;

        bs.battleLog.push(
          `  Burst hit ${i + 1}: ${target.name} takes ${damage}${isCrit ? ' CRIT!' : ''}`,
        );
        if (target.hp <= 0) {
          target.hp = 0;
          target.alive = false;
          bs.battleLog.push(`  ${target.name} has fallen!`);
        }
      }
      return;
    }

    // Normal attack
    const target = this.pickAliveTarget(bs);
    if (!target) return;

    // Apply dodge to player attacks logically: Andrew's dodge reduces incoming
    // We store dodge for use in player damage reduction (simplified: just attack normally here)
    const isCrit = Math.random() < stats.critChance;
    const baseDmg = stats.attack * (isCrit ? stats.critDamage : 1.0);
    const damage = this.applyDefense(baseDmg, target.defense);

    // Andrew has a dodge chance to avoid damage dealt TO him — handled in processPlayerTurn implicitly
    // For the opponent's attack, just deal normal damage
    target.hp -= damage;
    bs.battleLog.push(
      `${bs.opponent.name} Lightning Strikes ${target.name} for ${damage}${isCrit ? ' CRIT!' : ''}`,
    );

    if (target.hp <= 0) {
      target.hp = 0;
      target.alive = false;
      bs.battleLog.push(`${target.name} has fallen!`);
    }
  }

  // ── AI: Nik - crit_fishing ───────────────────────────────

  private aiNik(bs: BattleState, ai: OpponentAIState, stats: CombatStats, _hpPercent: number): void {
    // Gain a shadow stack each turn
    ai.nikShadowStacks = Math.min(ai.nikShadowStacks + 1, 3);

    // At 3 stacks, consume for Phantom Boop (3.0x crit multiplier)
    if (ai.nikShadowStacks >= 3) {
      ai.nikShadowStacks = 0;
      const target = this.pickAliveTarget(bs);
      if (!target) return;

      // Phantom Boop: guaranteed crit at 3.0x
      const baseDmg = stats.attack * 1.5 * 3.0;
      const damage = this.applyDefense(baseDmg, target.defense);
      target.hp -= damage;

      bs.battleLog.push(
        `${bs.opponent.name} emerges from shadow — PHANTOM BOOP on ${target.name} for ${damage} CRIT!`,
      );
      if (target.hp <= 0) {
        target.hp = 0;
        target.alive = false;
        bs.battleLog.push(`${target.name} has fallen!`);
      }
      return;
    }

    // Normal attack with 35% crit
    const target = this.pickAliveTarget(bs);
    if (!target) return;

    const isCrit = Math.random() < stats.critChance;
    const baseDmg = stats.attack * (isCrit ? stats.critDamage : 1.0);
    const damage = this.applyDefense(baseDmg, target.defense);
    target.hp -= damage;

    bs.battleLog.push(
      `${bs.opponent.name} Shadow Strikes ${target.name} for ${damage}${isCrit ? ' CRIT!' : ''} [${ai.nikShadowStacks}/3 shadow stacks]`,
    );
    if (target.hp <= 0) {
      target.hp = 0;
      target.alive = false;
      bs.battleLog.push(`${target.name} has fallen!`);
    }
  }

  // ── AI: Yuelin - healing_focus ───────────────────────────

  private aiYuelin(bs: BattleState, ai: OpponentAIState, stats: CombatStats, hpPercent: number): void {
    // Gain harmony stack each turn
    ai.yuelinHarmonyStacks = Math.min(ai.yuelinHarmonyStacks + 1, 5);

    // At 5 stacks: big heal + cleanse
    if (ai.yuelinHarmonyStacks >= 5) {
      ai.yuelinHarmonyStacks = 0;
      const healAmount = Math.floor(bs.opponentMaxHp * 0.4);
      bs.opponentHp = Math.min(bs.opponentMaxHp, bs.opponentHp + healAmount);
      bs.battleLog.push(
        `${bs.opponent.name} channels Harmonious Cleanse — heals ${healAmount} and purifies!`,
      );
      return;
    }

    // Heal at <60% HP
    if (hpPercent < 0.6 && Math.random() < 0.5) {
      const healAmount = Math.floor(bs.opponentMaxHp * 0.2);
      bs.opponentHp = Math.min(bs.opponentMaxHp, bs.opponentHp + healAmount);
      bs.battleLog.push(`${bs.opponent.name} uses Gentle Mend — heals ${healAmount} [${ai.yuelinHarmonyStacks}/5 harmony]`);
      return;
    }

    // Normal attack
    const target = this.pickAliveTarget(bs);
    if (!target) return;

    const isCrit = Math.random() < stats.critChance;
    const baseDmg = stats.attack * (isCrit ? stats.critDamage : 1.0);
    const damage = this.applyDefense(baseDmg, target.defense);
    target.hp -= damage;

    bs.battleLog.push(
      `${bs.opponent.name} Lotus Palms ${target.name} for ${damage}${isCrit ? ' CRIT!' : ''} [${ai.yuelinHarmonyStacks}/5 harmony]`,
    );
    if (target.hp <= 0) {
      target.hp = 0;
      target.alive = false;
      bs.battleLog.push(`${target.name} has fallen!`);
    }
  }

  // ── AI: Scott - stack_and_wait ───────────────────────────

  private aiScott(bs: BattleState, ai: OpponentAIState, stats: CombatStats, _hpPercent: number): void {
    // Gain fortify stack (+10% defense each, max 10)
    ai.scottFortifyStacks = Math.min(ai.scottFortifyStacks + 1, 10);

    // Apply fortify to buffed defense
    bs.opponentBuffedStats.defense = Math.floor(
      bs.opponent.baseStats.defense *
        (1 + bs.turnCount * TOURNAMENT_CONFIG.perRoundScaling / TOURNAMENT_CONFIG.totalRounds) * // round scaling base
        (1 + ai.scottFortifyStacks * 0.1),
    );

    // At 10 stacks: AVALANCHE (0.3x per stack = 3.0x total)
    if (ai.scottFortifyStacks >= 10) {
      ai.scottFortifyStacks = 0;
      bs.battleLog.push(`${bs.opponent.name} unleashes AVALANCHE!`);

      // Hit all alive cats
      for (const cat of bs.playerTeam) {
        if (!cat.alive) continue;
        const baseDmg = stats.attack * 0.3 * 10; // 0.3x per stack, 10 stacks = 3.0x
        const damage = this.applyDefense(baseDmg, cat.defense);
        cat.hp -= damage;

        bs.battleLog.push(`  Avalanche hits ${cat.name} for ${damage}!`);
        if (cat.hp <= 0) {
          cat.hp = 0;
          cat.alive = false;
          bs.battleLog.push(`  ${cat.name} has fallen!`);
        }
      }

      // Reset defense to round-scaled base
      const roundScale = 1 + this.currentRound * TOURNAMENT_CONFIG.perRoundScaling;
      bs.opponentBuffedStats.defense = Math.floor(bs.opponent.baseStats.defense * roundScale);
      return;
    }

    // Normal attack
    const target = this.pickAliveTarget(bs);
    if (!target) return;

    const isCrit = Math.random() < stats.critChance;
    const baseDmg = stats.attack * 0.8 * (isCrit ? stats.critDamage : 1.0);
    const damage = this.applyDefense(baseDmg, target.defense);
    target.hp -= damage;

    bs.battleLog.push(
      `${bs.opponent.name} Stone Fists ${target.name} for ${damage}${isCrit ? ' CRIT!' : ''} [${ai.scottFortifyStacks}/10 fortify, +${ai.scottFortifyStacks * 10}% DEF]`,
    );
    if (target.hp <= 0) {
      target.hp = 0;
      target.alive = false;
      bs.battleLog.push(`${target.name} has fallen!`);
    }
  }

  // ── Combat Helpers ───────────────────────────────────────

  private applyDefense(rawDamage: number, defense: number): number {
    return Math.max(1, Math.floor(rawDamage - defense * 0.5));
  }

  private pickAliveTarget(bs: BattleState): TournamentCatUnit | null {
    const alive = bs.playerTeam.filter((c) => c.alive);
    if (alive.length === 0) return null;
    return alive[Math.floor(Math.random() * alive.length)];
  }

  private getTeamHpPercent(): number {
    const bs = this.battleState;
    if (!bs) return 0;
    let totalHp = 0;
    let totalMaxHp = 0;
    for (const cat of bs.playerTeam) {
      totalHp += Math.max(0, cat.hp);
      totalMaxHp += cat.maxHp;
    }
    return totalMaxHp > 0 ? totalHp / totalMaxHp : 0;
  }

  private checkBattleEnd(): boolean {
    const bs = this.battleState;
    if (!bs || bs.finished) return true;

    // Opponent defeated
    if (bs.opponentHp <= 0) {
      this.endBattle(true);
      return true;
    }

    // All cats down
    if (bs.playerTeam.every((c) => !c.alive)) {
      this.endBattle(false);
      return true;
    }

    return false;
  }

  // ── End Battle ───────────────────────────────────────────

  private endBattle(victory: boolean): BattleResult {
    const bs = this.battleState!;
    bs.finished = true;
    bs.victory = victory;

    const opponentId = bs.opponent.id;

    if (victory) {
      this.weeklyData.wins++;
      this.stats.totalWins++;
      this.stats.currentStreak++;
      if (this.stats.currentStreak > this.stats.highestStreak) {
        this.stats.highestStreak = this.stats.currentStreak;
      }
      this.stats.defeatedMasters[opponentId] = (this.stats.defeatedMasters[opponentId] ?? 0) + 1;

      // Accumulate per-win rewards
      const r = TOURNAMENT_CONFIG.rewardsPerWin;
      this.pendingRewards.reputation += r.reputation;
      this.pendingRewards.jadeCatnip += r.jadeCatnip;
      this.pendingRewards.destinyThreads += r.destinyThreads;

      bs.battleLog.push(`Victory! ${bs.opponent.name} has been defeated.`);

      // Update best round
      if (this.currentRound + 1 > this.weeklyData.bestRound) {
        this.weeklyData.bestRound = this.currentRound + 1;
      }

      this.currentRound++;

      // Check if champion
      if (this.currentRound >= TOURNAMENT_CONFIG.totalRounds) {
        this.completeTournament(true);
      }
    } else {
      this.weeklyData.losses++;
      this.stats.totalLosses++;
      this.stats.currentStreak = 0;

      bs.battleLog.push(`Defeat... ${bs.opponent.name} was too strong.`);

      this.completeTournament(false);
    }

    return {
      victory,
      turnsTaken: bs.turnCount,
      opponentId,
      rewards: victory ? { ...TOURNAMENT_CONFIG.rewardsPerWin } : null,
      log: bs.battleLog,
    };
  }

  // ── Complete Tournament ──────────────────────────────────

  private completeTournament(isChampion: boolean): void {
    this.weeklyData.completed = true;
    this.inTournament = false;

    if (isChampion) {
      this.stats.championCount++;

      const cb = TOURNAMENT_CONFIG.championBonus;
      this.pendingRewards.reputation += cb.reputation;
      this.pendingRewards.jadeCatnip += cb.jadeCatnip;
      this.pendingRewards.destinyThreads += cb.destinyThreads;

      // Add to leaderboard
      this.addLeaderboardEntry({
        name: this.playerMasterId ?? 'unknown',
        masterId: this.playerMasterId ?? 'gerald',
        wins: this.weeklyData.wins,
        championCount: this.stats.championCount,
        timestamp: Date.now(),
      });
    }
  }

  /** Claim accumulated rewards. Returns the rewards to be applied externally. */
  claimRewards(): TournamentRewards | null {
    if (!this.weeklyData.completed || this.weeklyData.rewardsClaimed) return null;

    this.weeklyData.rewardsClaimed = true;
    const rewards = { ...this.pendingRewards };
    this.pendingRewards = { reputation: 0, jadeCatnip: 0, destinyThreads: 0 };
    return rewards;
  }

  // ── Leaderboard ──────────────────────────────────────────

  private addLeaderboardEntry(entry: LeaderboardEntry): void {
    this.leaderboard.push(entry);
    this.leaderboard.sort((a, b) => {
      if (b.championCount !== a.championCount) return b.championCount - a.championCount;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.timestamp - b.timestamp;
    });
    if (this.leaderboard.length > TOURNAMENT_CONFIG.maxLeaderboardSize) {
      this.leaderboard = this.leaderboard.slice(0, TOURNAMENT_CONFIG.maxLeaderboardSize);
    }
  }

  // ── Utils ────────────────────────────────────────────────

  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // ── Serialization ────────────────────────────────────────

  serialize(): Record<string, unknown> {
    return {
      weeklyData: { ...this.weeklyData },
      stats: {
        ...this.stats,
        defeatedMasters: { ...this.stats.defeatedMasters },
      },
      leaderboard: this.leaderboard.map((e) => ({ ...e })),
      pendingRewards: { ...this.pendingRewards },
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (!data) return;

    const wd = data.weeklyData as Record<string, unknown> | undefined;
    if (wd) {
      this.weeklyData = {
        weekStart: (wd.weekStart as number) ?? 0,
        completed: (wd.completed as boolean) ?? false,
        rewardsClaimed: (wd.rewardsClaimed as boolean) ?? false,
        wins: (wd.wins as number) ?? 0,
        losses: (wd.losses as number) ?? 0,
        bestRound: (wd.bestRound as number) ?? 0,
      };
    }

    const st = data.stats as Record<string, unknown> | undefined;
    if (st) {
      this.stats = {
        totalTournaments: (st.totalTournaments as number) ?? 0,
        totalWins: (st.totalWins as number) ?? 0,
        totalLosses: (st.totalLosses as number) ?? 0,
        championCount: (st.championCount as number) ?? 0,
        defeatedMasters: (st.defeatedMasters as Record<string, number>) ?? {},
        highestStreak: (st.highestStreak as number) ?? 0,
        currentStreak: (st.currentStreak as number) ?? 0,
      };
    }

    const lb = data.leaderboard as LeaderboardEntry[] | undefined;
    if (Array.isArray(lb)) {
      this.leaderboard = lb.map((e) => ({
        name: e.name ?? 'unknown',
        masterId: e.masterId ?? 'gerald',
        wins: e.wins ?? 0,
        championCount: e.championCount ?? 0,
        timestamp: e.timestamp ?? 0,
      }));
    }

    const pr = data.pendingRewards as Record<string, number> | undefined;
    if (pr) {
      this.pendingRewards = {
        reputation: pr.reputation ?? 0,
        jadeCatnip: pr.jadeCatnip ?? 0,
        destinyThreads: pr.destinyThreads ?? 0,
      };
    }

    // Non-persisted run state stays at defaults (not in tournament)
    this.inTournament = false;
    this.currentRound = 0;
    this.bracket = [];
    this.battleState = null;
  }
}
