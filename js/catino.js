/**
 * catino.js - The Cat Casino
 * "The house always wins. But it's YOUR house."
 */

// Slot Machine Symbols
const SLOT_SYMBOLS = [
  { id: 'cat', emoji: '🐱', weight: 30 },
  { id: 'snoot', emoji: '👃', weight: 10 },
  { id: 'fish', emoji: '🐟', weight: 25 },
  { id: 'yarn', emoji: '🧶', weight: 20 },
  { id: 'goose', emoji: '🦢', weight: 10 },
  { id: 'star', emoji: '⭐', weight: 5 }
];

const SLOT_PAYOUTS = {
  'cat_cat_cat': { multiplier: 10, name: 'Triple Cat!' },
  'snoot_snoot_snoot': { multiplier: 100, name: 'SNOOT JACKPOT!' },
  'fish_fish_fish': { multiplier: 15, name: 'Fish Feast!' },
  'yarn_yarn_yarn': { multiplier: 12, name: 'Yarn Ball!' },
  'goose_goose_goose': { multiplier: 50, name: 'Goose Attack!', gooseAttack: true },
  'star_star_star': { multiplier: 500, name: 'MEGA JACKPOT!' },
  // Two of a kind
  'cat_cat_*': { multiplier: 2, name: 'Two Cats' },
  'snoot_snoot_*': { multiplier: 5, name: 'Two Snoots' },
  'star_star_*': { multiplier: 25, name: 'Two Stars' }
};

// Goose Race Contestants
const RACE_GEESE = [
  { id: 'speedy', name: 'Speedy Honk', emoji: '🦢💨', odds: 3, speed: 1.2, consistency: 0.8 },
  { id: 'chaos', name: 'Chaos Waddle', emoji: '🦢🌀', odds: 5, speed: 1.0, consistency: 0.3 },
  { id: 'sure', name: 'The Sure Thing', emoji: '🦢✓', odds: 1.5, speed: 0.9, consistency: 0.95, quitChance: 0.4 },
  { id: 'mystery', name: '???', emoji: '🦢❓', odds: 50, speed: 0.5, consistency: 0.1, surpriseChance: 0.05 }
];

// Wheel of Misfortune Segments
const WHEEL_SEGMENTS = [
  { id: 'double_bp', name: '2x BP for 1 hour', emoji: '💰', effect: { bpMultiplier: 2, duration: 3600000 }, weight: 15 },
  { id: 'free_cat', name: 'Free Rare Cat', emoji: '🐱', effect: { freeCat: 'rare' }, weight: 10 },
  { id: 'sad_cats', name: 'All Cats Sad', emoji: '😱', effect: { catHappiness: -50 }, weight: 12 },
  { id: 'goose_attack', name: 'Goose Attack!', emoji: '🦢', effect: { gooseAttack: true }, weight: 15 },
  { id: 'mystery_box', name: 'Mystery Box', emoji: '🎁', effect: { mysteryBox: true }, weight: 18 },
  { id: 'lose_half', name: 'Lose Half BP', emoji: '💀', effect: { loseBpPercent: 0.5 }, weight: 8 },
  { id: 'jackpot', name: 'JACKPOT', emoji: '⭐', effect: { bpMultiplier: 10, instant: true }, weight: 2 },
  { id: 'spin_again', name: 'Spin Again', emoji: '🔄', effect: { spinAgain: true }, weight: 20 }
];

/**
 * CatinoSystem - The Cat Casino
 */
class CatinoSystem {
  constructor() {
    this.unlocked = false;
    this.unlockCost = 50000000; // 50 Million BP

    this.totalGambled = 0;
    this.totalWon = 0;
    this.totalLost = 0;

    this.highRollerUnlocked = false;
    this.highRollerThreshold = 1000000;

    this.activeEffects = [];

    this.stats = {
      slotsPlayed: 0,
      slotsJackpots: 0,
      racesWatched: 0,
      racesWon: 0,
      wheelSpins: 0,
      biggestWin: 0,
      biggestLoss: 0,
      gooseAttacks: 0,
      consecutiveLosses: 0,
      maxConsecutiveLosses: 0
    };
  }

  /**
   * Unlock the Catino
   */
  unlock() {
    if (window.gameState && window.gameState.boopPoints >= this.unlockCost) {
      window.gameState.boopPoints = Math.max(0, window.gameState.boopPoints - this.unlockCost);
      this.unlocked = true;
      return true;
    }
    return false;
  }

  /**
   * Play the slot machine
   */
  playSlots(bet) {
    if (!this.unlocked) return null;
    if (!window.gameState || window.gameState.boopPoints < bet) return null;

    window.gameState.boopPoints = Math.max(0, window.gameState.boopPoints - bet);
    this.totalGambled += bet;
    this.stats.slotsPlayed++;

    // Spin the reels
    const reels = [
      this.spinReel(),
      this.spinReel(),
      this.spinReel()
    ];

    // Check for wins
    const result = this.checkSlotWin(reels);

    if (result.win) {
      const winAmount = bet * result.multiplier;
      window.gameState.boopPoints += winAmount;
      this.totalWon += winAmount;
      this.stats.consecutiveLosses = 0;

      if (winAmount > this.stats.biggestWin) {
        this.stats.biggestWin = winAmount;
      }

      if (result.multiplier >= 100) {
        this.stats.slotsJackpots++;
      }

      // Goose attack on goose triple
      if (result.gooseAttack && window.gooseSystem) {
        window.gooseSystem.spawnGoose();
        this.stats.gooseAttacks++;
      }
    } else {
      this.totalLost += bet;
      this.stats.consecutiveLosses++;
      if (this.stats.consecutiveLosses > this.stats.maxConsecutiveLosses) {
        this.stats.maxConsecutiveLosses = this.stats.consecutiveLosses;
      }

      if (bet > this.stats.biggestLoss) {
        this.stats.biggestLoss = bet;
      }
    }

    // Check high roller unlock
    if (this.totalGambled >= this.highRollerThreshold) {
      this.highRollerUnlocked = true;
    }

    // Responsible gambling message
    if (this.stats.consecutiveLosses >= 10) {
      result.responsibleGamblingMessage = "Hey... maybe take a break? Go boop some snoots.";
    }

    return {
      reels: reels.map(r => r.emoji),
      ...result,
      bet,
      newBalance: window.gameState.boopPoints
    };
  }

  /**
   * Spin a single reel
   */
  spinReel() {
    const totalWeight = SLOT_SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const symbol of SLOT_SYMBOLS) {
      roll -= symbol.weight;
      if (roll <= 0) return symbol;
    }

    return SLOT_SYMBOLS[0];
  }

  /**
   * Check slot machine result
   */
  checkSlotWin(reels) {
    const key = reels.map(r => r.id).join('_');

    // Check exact matches
    if (SLOT_PAYOUTS[key]) {
      return { win: true, ...SLOT_PAYOUTS[key] };
    }

    // Check two of a kind
    if (reels[0].id === reels[1].id) {
      const twoKey = `${reels[0].id}_${reels[1].id}_*`;
      if (SLOT_PAYOUTS[twoKey]) {
        return { win: true, ...SLOT_PAYOUTS[twoKey] };
      }
    }

    return { win: false, multiplier: 0, name: 'No win' };
  }

  /**
   * Start a goose race
   */
  startGooseRace(bets) {
    if (!this.unlocked) return null;

    // bets = { gooseId: betAmount, ... }
    const totalBet = Object.values(bets).reduce((sum, b) => sum + b, 0);
    if (!window.gameState || window.gameState.boopPoints < totalBet) return null;

    window.gameState.boopPoints = Math.max(0, window.gameState.boopPoints - totalBet);
    this.totalGambled += totalBet;
    this.stats.racesWatched++;

    // Simulate race
    const raceResults = this.simulateRace();

    // Calculate winnings
    let totalWinnings = 0;
    const winningGoose = raceResults.winner;

    if (bets[winningGoose.id]) {
      totalWinnings = bets[winningGoose.id] * winningGoose.odds;
      this.stats.racesWon++;
    }

    if (totalWinnings > 0) {
      window.gameState.boopPoints += totalWinnings;
      this.totalWon += totalWinnings;
    } else {
      this.totalLost += totalBet;
    }

    return {
      results: raceResults,
      bets,
      winnings: totalWinnings,
      newBalance: window.gameState.boopPoints
    };
  }

  /**
   * Simulate a goose race
   */
  simulateRace() {
    const positions = {};
    const geese = [...RACE_GEESE];

    // Initialize positions
    for (const goose of geese) {
      positions[goose.id] = 0;
    }

    const raceLog = [];
    const raceLength = 100;

    // Simulate race
    for (let tick = 0; tick < 50; tick++) {
      for (const goose of geese) {
        // Check for quit (The Sure Thing)
        if (goose.quitChance && Math.random() < goose.quitChance / 50) {
          if (!positions[goose.id + '_quit']) {
            positions[goose.id + '_quit'] = true;
            raceLog.push(`${goose.name} just... leaves mid-race.`);
            continue;
          }
        }

        if (positions[goose.id + '_quit']) continue;

        // Check for surprise burst (Mystery goose)
        if (goose.surpriseChance && Math.random() < goose.surpriseChance) {
          positions[goose.id] += 50;
          raceLog.push(`${goose.name} has a mysterious burst of speed!`);
        }

        // Normal movement
        const consistency = Math.random() < goose.consistency ? 1 : Math.random();
        const movement = goose.speed * consistency * (1 + Math.random() * 0.5) * 2;
        positions[goose.id] += movement;
      }
    }

    // Determine winner
    let winner = null;
    let maxPosition = -1;

    for (const goose of geese) {
      if (positions[goose.id + '_quit']) continue;
      if (positions[goose.id] > maxPosition) {
        maxPosition = positions[goose.id];
        winner = goose;
      }
    }

    // Order results
    const finalOrder = geese
      .filter(g => !positions[g.id + '_quit'])
      .sort((a, b) => positions[b.id] - positions[a.id]);

    return {
      winner,
      order: finalOrder,
      positions,
      log: raceLog
    };
  }

  /**
   * Spin the Wheel of Misfortune
   */
  spinWheel(cost = 10000) {
    if (!this.unlocked) return null;
    if (!window.gameState || window.gameState.boopPoints < cost) return null;

    window.gameState.boopPoints = Math.max(0, window.gameState.boopPoints - cost);
    this.totalGambled += cost;
    this.stats.wheelSpins++;

    // Spin the wheel
    const segment = this.pickWheelSegment();

    // Apply effect
    const result = this.applyWheelEffect(segment, cost);

    return {
      segment,
      ...result,
      newBalance: window.gameState.boopPoints
    };
  }

  /**
   * Pick a wheel segment
   */
  pickWheelSegment() {
    const totalWeight = WHEEL_SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const segment of WHEEL_SEGMENTS) {
      roll -= segment.weight;
      if (roll <= 0) return segment;
    }

    return WHEEL_SEGMENTS[0];
  }

  /**
   * Apply wheel effect
   */
  applyWheelEffect(segment, cost) {
    const effect = segment.effect;
    const result = { applied: [], spinAgain: false };

    if (effect.bpMultiplier && effect.instant) {
      // Instant multiplier
      const bonus = cost * effect.bpMultiplier;
      window.gameState.boopPoints += bonus;
      this.totalWon += bonus;
      result.applied.push(`Won ${bonus} BP!`);
    }

    if (effect.bpMultiplier && effect.duration) {
      // Timed multiplier
      this.activeEffects.push({
        type: 'bpMultiplier',
        value: effect.bpMultiplier,
        endsAt: Date.now() + effect.duration,
        name: segment.name
      });
      result.applied.push(`${effect.bpMultiplier}x BP for ${effect.duration / 60000} minutes!`);
    }

    if (effect.freeCat && window.catSystem) {
      const cat = window.catSystem.recruitCat();
      result.applied.push(`Recruited ${cat.name}!`);
      result.freeCat = cat;
    }

    if (effect.catHappiness && window.catSystem) {
      // Reduce all cat happiness
      result.applied.push('All cats are sad!');
    }

    if (effect.gooseAttack && window.gooseSystem) {
      window.gooseSystem.spawnGoose();
      this.stats.gooseAttacks++;
      result.applied.push('A goose attacks!');
    }

    if (effect.mysteryBox) {
      const mysteryReward = this.openMysteryBox();
      result.applied.push(`Mystery Box: ${mysteryReward.description}`);
      result.mysteryReward = mysteryReward;
    }

    if (effect.loseBpPercent) {
      const loss = Math.floor(window.gameState.boopPoints * effect.loseBpPercent);
      window.gameState.boopPoints -= loss;
      this.totalLost += loss;
      result.applied.push(`Lost ${loss} BP!`);
    }

    if (effect.spinAgain) {
      result.spinAgain = true;
      result.applied.push('Spin again!');
    }

    return result;
  }

  /**
   * Open mystery box
   */
  openMysteryBox() {
    const roll = Math.random();

    if (roll < 0.4) {
      const bp = Math.floor(Math.random() * 10000) + 1000;
      window.gameState.boopPoints += bp;
      return { type: 'bp', amount: bp, description: `${bp} BP` };
    } else if (roll < 0.6) {
      const pp = Math.floor(Math.random() * 5000) + 500;
      window.gameState.purrPower += pp;
      return { type: 'pp', amount: pp, description: `${pp} PP` };
    } else if (roll < 0.75) {
      return { type: 'equipment', description: 'Random equipment!' };
    } else if (roll < 0.9) {
      return { type: 'nothing', description: 'The box was empty...' };
    } else {
      // Jackpot in mystery box
      const jackpot = 100000;
      window.gameState.boopPoints += jackpot;
      return { type: 'jackpot', amount: jackpot, description: `JACKPOT! ${jackpot} BP!` };
    }
  }

  /**
   * Update active effects
   */
  update(deltaTime) {
    const now = Date.now();
    this.activeEffects = this.activeEffects.filter(e => e.endsAt > now);
  }

  /**
   * Get current BP multiplier from casino effects
   */
  getBpMultiplier() {
    let multiplier = 1;
    for (const effect of this.activeEffects) {
      if (effect.type === 'bpMultiplier') {
        multiplier *= effect.value;
      }
    }
    return multiplier;
  }

  /**
   * Get casino status
   */
  getStatus() {
    return {
      unlocked: this.unlocked,
      highRollerUnlocked: this.highRollerUnlocked,
      totalGambled: this.totalGambled,
      totalWon: this.totalWon,
      totalLost: this.totalLost,
      netProfit: this.totalWon - this.totalLost,
      activeEffects: this.activeEffects,
      stats: this.stats
    };
  }

  /**
   * Serialize
   */
  serialize() {
    return {
      unlocked: this.unlocked,
      highRollerUnlocked: this.highRollerUnlocked,
      totalGambled: this.totalGambled,
      totalWon: this.totalWon,
      totalLost: this.totalLost,
      stats: this.stats
    };
  }

  /**
   * Deserialize
   */
  deserialize(data) {
    if (data.unlocked !== undefined) this.unlocked = data.unlocked;
    if (data.highRollerUnlocked !== undefined) this.highRollerUnlocked = data.highRollerUnlocked;
    if (data.totalGambled !== undefined) this.totalGambled = data.totalGambled;
    if (data.totalWon !== undefined) this.totalWon = data.totalWon;
    if (data.totalLost !== undefined) this.totalLost = data.totalLost;
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
  }
}

// Export
window.SLOT_SYMBOLS = SLOT_SYMBOLS;
window.RACE_GEESE = RACE_GEESE;
window.WHEEL_SEGMENTS = WHEEL_SEGMENTS;
window.CatinoSystem = CatinoSystem;
