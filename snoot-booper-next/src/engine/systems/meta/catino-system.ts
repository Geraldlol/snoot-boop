// catino-system.ts - Cat casino gambling
// "Fortune favors the bold. And the foolish. Mostly the foolish."

// --- Types ---

interface SlotSymbol {
  id: string;
  name: string;
  weight: number;
}

interface SlotPayout {
  triple: number;
  pair?: number;
}

interface RaceGoose {
  id: string;
  name: string;
  odds: number;
  speed: number;
  consistency: number;
  quirk?: {
    type: string;
    chance: number;
    value: number;
  };
}

interface WheelSegment {
  id: string;
  name: string;
  weight: number;
  effect: WheelEffect;
}

interface WheelEffect {
  type: string;
  value?: number;
  duration?: number;
  description: string;
}

interface ActiveEffect {
  type: string;
  value: number;
  expiresAt: number;
  description: string;
}

interface SlotResult {
  reels: [string, string, string];
  bet: number;
  payout: number;
  multiplier: number;
  isTriple: boolean;
  isPair: boolean;
  netGain: number;
}

interface RaceTick {
  positions: Record<string, number>;
  events: string[];
}

interface RaceResult {
  winner: string;
  winnerName: string;
  ticks: RaceTick[];
  bets: Record<string, number>;
  payouts: Record<string, number>;
  totalPayout: number;
  totalBet: number;
  netGain: number;
}

interface WheelResult {
  segment: string;
  segmentName: string;
  cost: number;
  effect: WheelEffect;
}

interface CatinoStats {
  slotsPlayed: number;
  slotsWon: number;
  racesPlayed: number;
  racesWon: number;
  wheelsSpun: number;
  biggestSlotWin: number;
  biggestRaceWin: number;
  totalGambled: number;
  totalWon: number;
  totalLost: number;
}

interface CatinoSerializedData {
  unlocked: boolean;
  totalGambled: number;
  totalWon: number;
  totalLost: number;
  activeEffects: ActiveEffect[];
  stats: CatinoStats;
}

// --- Data ---

const SLOT_SYMBOLS: SlotSymbol[] = [
  { id: 'cat', name: 'Cat', weight: 30 },
  { id: 'snoot', name: 'Snoot', weight: 10 },
  { id: 'fish', name: 'Fish', weight: 25 },
  { id: 'yarn', name: 'Yarn', weight: 20 },
  { id: 'goose', name: 'Goose', weight: 10 },
  { id: 'star', name: 'Star', weight: 5 },
];

const SLOT_PAYOUTS: Record<string, SlotPayout> = {
  cat: { triple: 10, pair: 2 },
  snoot: { triple: 100, pair: 5 },
  fish: { triple: 15 },
  yarn: { triple: 12 },
  goose: { triple: 50 },
  star: { triple: 500, pair: 25 },
};

const RACE_GEESE: RaceGoose[] = [
  {
    id: 'speedy',
    name: 'Speedy Gonzgoose',
    odds: 3,
    speed: 1.2,
    consistency: 0.8,
  },
  {
    id: 'chaos',
    name: 'Chaos Honker',
    odds: 5,
    speed: 1.0,
    consistency: 0.3,
  },
  {
    id: 'sure',
    name: 'Sure Thing Suzy',
    odds: 1.5,
    speed: 0.9,
    consistency: 0.95,
    quirk: { type: 'quit', chance: 0.4, value: 0 },
  },
  {
    id: 'mystery',
    name: 'Mystery Goose X',
    odds: 50,
    speed: 0.5,
    consistency: 0.1,
    quirk: { type: 'burst', chance: 0.05, value: 50 },
  },
];

const WHEEL_SEGMENTS: WheelSegment[] = [
  {
    id: 'double_bp',
    name: 'Double BP',
    weight: 15,
    effect: { type: 'bp_multiplier', value: 2, duration: 3600000, description: '2x BP for 1 hour' },
  },
  {
    id: 'free_cat',
    name: 'Free Cat!',
    weight: 10,
    effect: { type: 'free_cat', description: 'A random cat joins your sect!' },
  },
  {
    id: 'sad_cats',
    name: 'Sad Cats',
    weight: 12,
    effect: { type: 'happiness_penalty', value: -50, description: 'All cats lose 50 happiness' },
  },
  {
    id: 'goose_attack',
    name: 'Goose Attack!',
    weight: 15,
    effect: { type: 'goose_attack', description: 'A wild goose appears and causes chaos!' },
  },
  {
    id: 'mystery_box',
    name: 'Mystery Box',
    weight: 18,
    effect: { type: 'mystery_box', description: 'Could be anything... literally anything.' },
  },
  {
    id: 'lose_half',
    name: 'Lose Half',
    weight: 8,
    effect: { type: 'bp_loss', value: -0.5, description: 'Lose 50% of your current BP' },
  },
  {
    id: 'jackpot',
    name: 'JACKPOT!',
    weight: 2,
    effect: { type: 'bp_multiplier_payout', value: 10, description: '10x your spin cost returned!' },
  },
  {
    id: 'spin_again',
    name: 'Spin Again',
    weight: 20,
    effect: { type: 'spin_again', description: 'Free spin! Go again!' },
  },
];

// --- Helpers ---

const TOTAL_SYMBOL_WEIGHT = SLOT_SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
const TOTAL_WHEEL_WEIGHT = WHEEL_SEGMENTS.reduce((sum, s) => sum + s.weight, 0);

function rollSymbol(): string {
  let roll = Math.random() * TOTAL_SYMBOL_WEIGHT;
  for (const symbol of SLOT_SYMBOLS) {
    roll -= symbol.weight;
    if (roll <= 0) return symbol.id;
  }
  return SLOT_SYMBOLS[0].id;
}

function rollWheelSegment(): WheelSegment {
  let roll = Math.random() * TOTAL_WHEEL_WEIGHT;
  for (const segment of WHEEL_SEGMENTS) {
    roll -= segment.weight;
    if (roll <= 0) return segment;
  }
  return WHEEL_SEGMENTS[0];
}

// --- Class ---

export class CatinoSystem {
  unlocked: boolean;
  totalGambled: number;
  totalWon: number;
  totalLost: number;
  activeEffects: ActiveEffect[];
  stats: CatinoStats;

  constructor() {
    this.unlocked = false;
    this.totalGambled = 0;
    this.totalWon = 0;
    this.totalLost = 0;
    this.activeEffects = [];
    this.stats = {
      slotsPlayed: 0,
      slotsWon: 0,
      racesPlayed: 0,
      racesWon: 0,
      wheelsSpun: 0,
      biggestSlotWin: 0,
      biggestRaceWin: 0,
      totalGambled: 0,
      totalWon: 0,
      totalLost: 0,
    };
  }

  playSlots(bet: number): SlotResult {
    if (bet <= 0) {
      return {
        reels: ['cat', 'cat', 'cat'],
        bet: 0,
        payout: 0,
        multiplier: 0,
        isTriple: false,
        isPair: false,
        netGain: 0,
      };
    }

    this.totalGambled += bet;
    this.stats.totalGambled += bet;
    this.stats.slotsPlayed++;

    // Spin 3 reels
    const reels: [string, string, string] = [rollSymbol(), rollSymbol(), rollSymbol()];

    let multiplier = 0;
    let isTriple = false;
    let isPair = false;

    // Check triple (all 3 match)
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      const symbolId = reels[0];
      multiplier = SLOT_PAYOUTS[symbolId]?.triple ?? 0;
      isTriple = true;
    }
    // Check pair (first two match)
    else if (reels[0] === reels[1]) {
      const symbolId = reels[0];
      multiplier = SLOT_PAYOUTS[symbolId]?.pair ?? 0;
      isPair = multiplier > 0;
    }

    const payout = bet * multiplier;
    const netGain = payout - bet;

    if (payout > 0) {
      this.totalWon += payout;
      this.stats.totalWon += payout;
      this.stats.slotsWon++;
      if (payout > this.stats.biggestSlotWin) {
        this.stats.biggestSlotWin = payout;
      }
    } else {
      this.totalLost += bet;
      this.stats.totalLost += bet;
    }

    return { reels, bet, payout, multiplier, isTriple, isPair, netGain };
  }

  startGooseRace(bets: Record<string, number>): RaceResult {
    const totalBet = Object.values(bets).reduce((sum, b) => sum + b, 0);
    this.totalGambled += totalBet;
    this.stats.totalGambled += totalBet;
    this.stats.racesPlayed++;

    // Initialize positions
    const positions: Record<string, number> = {};
    const eliminated: Set<string> = new Set();
    for (const goose of RACE_GEESE) {
      positions[goose.id] = 0;
    }

    const ticks: RaceTick[] = [];
    const finishLine = 100;
    let winner: string | null = null;

    // Simulate 50 ticks
    for (let tick = 0; tick < 50; tick++) {
      const events: string[] = [];

      for (const goose of RACE_GEESE) {
        if (eliminated.has(goose.id)) continue;
        if (positions[goose.id] >= finishLine) continue;

        // Base movement: speed * consistency roll
        const consistencyRoll = Math.random() < goose.consistency ? 1.0 : Math.random();
        let movement = goose.speed * consistencyRoll * (3 + Math.random() * 4);

        // Check quirks
        if (goose.quirk) {
          if (goose.quirk.type === 'quit' && Math.random() < goose.quirk.chance / 50) {
            eliminated.add(goose.id);
            positions[goose.id] = -1;
            events.push(`${goose.name} quit the race!`);
            continue;
          }
          if (goose.quirk.type === 'burst' && Math.random() < goose.quirk.chance) {
            movement += goose.quirk.value;
            events.push(`${goose.name} had a BURST of speed!`);
          }
        }

        positions[goose.id] += movement;

        if (positions[goose.id] >= finishLine && !winner) {
          winner = goose.id;
          events.push(`${goose.name} crosses the finish line!`);
        }
      }

      ticks.push({
        positions: { ...positions },
        events: [...events],
      });

      if (winner) break;
    }

    // If no one finished in 50 ticks, pick the leader
    if (!winner) {
      let bestDist = -Infinity;
      for (const goose of RACE_GEESE) {
        if (!eliminated.has(goose.id) && positions[goose.id] > bestDist) {
          bestDist = positions[goose.id];
          winner = goose.id;
        }
      }
    }

    // Fallback: if all eliminated, first goose
    if (!winner) {
      winner = RACE_GEESE[0].id;
    }

    // Calculate payouts
    const payouts: Record<string, number> = {};
    let totalPayout = 0;
    const winningGoose = RACE_GEESE.find((g) => g.id === winner)!;

    for (const [gooseId, betAmount] of Object.entries(bets)) {
      if (gooseId === winner && betAmount > 0) {
        const payout = betAmount * winningGoose.odds;
        payouts[gooseId] = payout;
        totalPayout += payout;
      } else {
        payouts[gooseId] = 0;
      }
    }

    const netGain = totalPayout - totalBet;

    if (totalPayout > 0) {
      this.totalWon += totalPayout;
      this.stats.totalWon += totalPayout;
      this.stats.racesWon++;
      if (totalPayout > this.stats.biggestRaceWin) {
        this.stats.biggestRaceWin = totalPayout;
      }
    } else {
      this.totalLost += totalBet;
      this.stats.totalLost += totalBet;
    }

    return {
      winner,
      winnerName: winningGoose.name,
      ticks,
      bets,
      payouts,
      totalPayout,
      totalBet,
      netGain,
    };
  }

  spinWheel(cost: number = 10000): WheelResult {
    this.totalGambled += cost;
    this.stats.totalGambled += cost;
    this.stats.wheelsSpun++;

    const segment = rollWheelSegment();

    // Apply timed effects
    if (segment.effect.type === 'bp_multiplier' && segment.effect.duration && segment.effect.value) {
      this.activeEffects.push({
        type: 'bp_multiplier',
        value: segment.effect.value,
        expiresAt: Date.now() + segment.effect.duration,
        description: segment.effect.description,
      });
    }

    // Jackpot: 10x cost returned as payout tracked
    if (segment.effect.type === 'bp_multiplier_payout' && segment.effect.value) {
      const jackpotWin = cost * segment.effect.value;
      this.totalWon += jackpotWin;
      this.stats.totalWon += jackpotWin;
    }

    // Loss tracking for negative outcomes
    if (segment.effect.type === 'bp_loss' || segment.effect.type === 'happiness_penalty') {
      this.totalLost += cost;
      this.stats.totalLost += cost;
    }

    return {
      segment: segment.id,
      segmentName: segment.name,
      cost,
      effect: segment.effect,
    };
  }

  update(deltaMs: number): void {
    const now = Date.now();

    // Remove expired effects
    this.activeEffects = this.activeEffects.filter((effect) => effect.expiresAt > now);
  }

  getBpMultiplier(): number {
    let multiplier = 1;
    const now = Date.now();

    for (const effect of this.activeEffects) {
      if (effect.type === 'bp_multiplier' && effect.expiresAt > now) {
        multiplier *= effect.value;
      }
    }

    return multiplier;
  }

  getActiveEffectDescriptions(): string[] {
    const now = Date.now();
    return this.activeEffects
      .filter((e) => e.expiresAt > now)
      .map((e) => {
        const remaining = Math.ceil((e.expiresAt - now) / 1000);
        return `${e.description} (${remaining}s remaining)`;
      });
  }

  serialize(): CatinoSerializedData {
    return {
      unlocked: this.unlocked,
      totalGambled: this.totalGambled,
      totalWon: this.totalWon,
      totalLost: this.totalLost,
      activeEffects: this.activeEffects.map((e) => ({ ...e })),
      stats: { ...this.stats },
    };
  }

  deserialize(data: CatinoSerializedData): void {
    this.unlocked = data.unlocked ?? false;
    this.totalGambled = data.totalGambled ?? 0;
    this.totalWon = data.totalWon ?? 0;
    this.totalLost = data.totalLost ?? 0;
    this.activeEffects = (data.activeEffects ?? []).map((e) => ({ ...e }));
    this.stats = data.stats ?? {
      slotsPlayed: 0,
      slotsWon: 0,
      racesPlayed: 0,
      racesWon: 0,
      wheelsSpun: 0,
      biggestSlotWin: 0,
      biggestRaceWin: 0,
      totalGambled: 0,
      totalWon: 0,
      totalLost: 0,
    };

    // Clean up expired effects on load
    const now = Date.now();
    this.activeEffects = this.activeEffects.filter((e) => e.expiresAt > now);
  }
}

export { SLOT_SYMBOLS, SLOT_PAYOUTS, RACE_GEESE, WHEEL_SEGMENTS };
export type {
  SlotSymbol,
  SlotPayout,
  RaceGoose,
  WheelSegment,
  WheelEffect,
  ActiveEffect,
  SlotResult,
  RaceTick,
  RaceResult,
  WheelResult,
  CatinoStats,
  CatinoSerializedData,
};
