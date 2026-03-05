/**
 * AchievementSystem - Achievements across all game systems
 * Ported from js/achievements.js (814 lines)
 */

// ─── Achievement Template ───────────────────────────────────

export interface AchievementTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: AchievementCategory;
  condition: AchievementCondition;
  reward?: { type: string; value: number | string };
  hidden?: boolean;
}

export type AchievementCategory = 'booping' | 'cats' | 'waifus' | 'goose' | 'cultivation' | 'secret';

export interface AchievementCondition {
  type: string;
  value: number | boolean | string;
}

// ─── Achievement Data ───────────────────────────────────────

export const ACHIEVEMENTS: AchievementTemplate[] = [
  // BOOPING
  { id: 'first_boop', name: 'First Steps', description: 'Perform your first boop', emoji: '\uD83D\uDC63', category: 'booping', condition: { type: 'totalBoops', value: 1 }, reward: { type: 'bp', value: 100 } },
  { id: 'hundred_boops', name: 'Getting Started', description: 'Perform 100 boops', emoji: '\u2B50', category: 'booping', condition: { type: 'totalBoops', value: 100 }, reward: { type: 'bp', value: 500 } },
  { id: 'thousand_boops', name: 'Dedicated Booper', description: 'Perform 1,000 boops', emoji: '\uD83C\uDF1F', category: 'booping', condition: { type: 'totalBoops', value: 1000 }, reward: { type: 'bp', value: 5000 } },
  { id: 'ten_thousand_boops', name: 'Boop Master', description: 'Perform 10,000 boops', emoji: '\uD83D\uDCAB', category: 'booping', condition: { type: 'totalBoops', value: 10000 }, reward: { type: 'bp', value: 50000 } },
  { id: 'hundred_thousand_boops', name: 'Snoot Sovereign', description: 'Perform 100,000 boops', emoji: '\uD83D\uDC51', category: 'booping', condition: { type: 'totalBoops', value: 100000 }, reward: { type: 'jadeCatnip', value: 25 } },
  { id: 'first_crit', name: 'Critical Strike!', description: 'Land your first critical boop', emoji: '\u26A1', category: 'booping', condition: { type: 'criticalBoops', value: 1 }, reward: { type: 'bp', value: 200 } },
  { id: 'combo_10', name: 'Combo Starter', description: 'Reach a 10x combo', emoji: '\uD83D\uDD25', category: 'booping', condition: { type: 'maxCombo', value: 10 } },
  { id: 'combo_50', name: 'Combo Master', description: 'Reach a 50x combo', emoji: '\uD83D\uDD25', category: 'booping', condition: { type: 'maxCombo', value: 50 }, reward: { type: 'bp', value: 10000 } },
  { id: 'combo_100', name: 'UNLIMITED COMBO', description: 'Reach a 100x combo', emoji: '\uD83D\uDCA5', category: 'booping', condition: { type: 'maxCombo', value: 100 }, reward: { type: 'jadeCatnip', value: 5 } },

  // CATS
  { id: 'first_cat', name: 'Cat Whisperer', description: 'Recruit your first cat', emoji: '\uD83D\uDC31', category: 'cats', condition: { type: 'catCount', value: 1 }, reward: { type: 'bp', value: 500 } },
  { id: 'ten_cats', name: 'Cat Collector', description: 'Recruit 10 cats', emoji: '\uD83D\uDC08', category: 'cats', condition: { type: 'catCount', value: 10 }, reward: { type: 'bp', value: 5000 } },
  { id: 'fifty_cats', name: 'Cat Army', description: 'Recruit 50 cats', emoji: '\uD83D\uDC31\u200D\uD83D\uDCBB', category: 'cats', condition: { type: 'catCount', value: 50 }, reward: { type: 'jadeCatnip', value: 10 } },
  { id: 'hundred_cats', name: 'Cat Empire', description: 'Recruit 100 cats', emoji: '\uD83C\uDFEF', category: 'cats', condition: { type: 'catCount', value: 100 }, reward: { type: 'jadeCatnip', value: 25 } },
  { id: 'sky_cat', name: 'Touching the Sky', description: 'Obtain a Sky Kitten cat', emoji: '\u2601\uFE0F', category: 'cats', condition: { type: 'catRealm', value: 'skyKitten' } },
  { id: 'heaven_cat', name: 'Heavenly Ascension', description: 'Obtain a Heaven Kitten cat', emoji: '\uD83C\uDF1F', category: 'cats', condition: { type: 'catRealm', value: 'heavenKitten' } },
  { id: 'divine_cat', name: 'Divine Beast', description: 'Obtain a Divine Beast cat', emoji: '\uD83D\uDE07', category: 'cats', condition: { type: 'catRealm', value: 'divineBeast' }, reward: { type: 'jadeCatnip', value: 50 } },

  // WAIFUS
  { id: 'first_waifu', name: 'New Friend', description: 'Unlock your first waifu', emoji: '\uD83D\uDC95', category: 'waifus', condition: { type: 'waifuCount', value: 1 } },
  { id: 'bond_50', name: 'Growing Closer', description: 'Reach 50 bond with any waifu', emoji: '\uD83D\uDC9E', category: 'waifus', condition: { type: 'maxBond', value: 50 }, reward: { type: 'waifuTokens', value: 10 } },
  { id: 'bond_100', name: 'Soulmate', description: 'Max bond with any waifu', emoji: '\uD83D\uDC96', category: 'waifus', condition: { type: 'maxBond', value: 100 }, reward: { type: 'jadeCatnip', value: 15 } },
  { id: 'all_waifus', name: 'Harem Protagonist', description: 'Unlock all 6 waifus', emoji: '\uD83C\uDF38', category: 'waifus', condition: { type: 'waifuCount', value: 6 }, reward: { type: 'waifuTokens', value: 50 } },

  // GOOSE
  { id: 'first_honk', name: 'Honk.', description: 'Boop your first goose', emoji: '\uD83E\uDEB6', category: 'goose', condition: { type: 'gooseBoops', value: 1 }, reward: { type: 'gooseFeather', value: 1 } },
  { id: 'peace_never', name: 'Peace Was Never An Option', description: 'Boop 100 geese', emoji: '\uD83E\uDEB6', category: 'goose', condition: { type: 'gooseBoops', value: 100 }, reward: { type: 'gooseFeather', value: 25 } },
  { id: 'negotiator', name: 'The Negotiator', description: 'Boop a RAGE mode goose', emoji: '\uD83D\uDD25', category: 'goose', condition: { type: 'rageGooseBooped', value: true }, reward: { type: 'bp', value: 25000 } },
  { id: 'cobra_slayer', name: 'Cobra Chicken Slayer', description: 'Defeat the Avatar of Chaos', emoji: '\uD83D\uDC14', category: 'goose', condition: { type: 'cobraChickenDefeated', value: true }, reward: { type: 'jadeCatnip', value: 25 } },
  { id: 'hjonk', name: 'HJ\u00D6NK', description: 'Critical boop a Golden Goose', emoji: '\uD83E\uDEB6', category: 'goose', condition: { type: 'goldenGooseCrit', value: true }, reward: { type: 'jadeCatnip', value: 50 } },

  // CULTIVATION
  { id: 'first_upgrade', name: 'Path of Power', description: 'Purchase your first upgrade', emoji: '\u2B06\uFE0F', category: 'cultivation', condition: { type: 'upgradeCount', value: 1 } },
  { id: 'bp_millionaire', name: 'BP Millionaire', description: 'Accumulate 1,000,000 BP', emoji: '\uD83D\uDCB0', category: 'cultivation', condition: { type: 'totalBP', value: 1000000 }, reward: { type: 'bp', value: 100000 } },

  // SECRET
  { id: 'nice', name: 'Nice.', description: 'Reach exactly 69,420 BP', emoji: '\uD83D\uDE0F', category: 'secret', condition: { type: 'exactBP', value: 69420 }, hidden: true },
  { id: 'patient_one', name: 'The Patient One', description: 'Wait 10 minutes without booping', emoji: '\uD83E\uDDD8', category: 'secret', condition: { type: 'idleMinutes', value: 10 }, hidden: true },
];

// ─── AchievementSystem Class ────────────────────────────────

export class AchievementSystem {
  private unlocked: Set<string> = new Set();
  private unlockedAt: Record<string, number> = {};

  checkAll(gameState: {
    totalBoops: number;
    criticalBoops: number;
    maxCombo: number;
    catCount: number;
    gooseBoops: number;
    rageGooseBooped: boolean;
    cobraChickenDefeated: boolean;
    goldenGooseCrit: boolean;
    waifuCount: number;
    maxBond: number;
    upgradeCount: number;
    totalBP: number;
    highestCatRealm: string;
  }): AchievementTemplate[] {
    const newlyUnlocked: AchievementTemplate[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (this.unlocked.has(achievement.id)) continue;

      if (this.checkCondition(achievement.condition, gameState)) {
        this.unlock(achievement.id);
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  private checkCondition(
    condition: AchievementCondition,
    state: Record<string, unknown>,
  ): boolean {
    switch (condition.type) {
      case 'totalBoops': return (state.totalBoops as number) >= (condition.value as number);
      case 'criticalBoops': return (state.criticalBoops as number) >= (condition.value as number);
      case 'maxCombo': return (state.maxCombo as number) >= (condition.value as number);
      case 'catCount': return (state.catCount as number) >= (condition.value as number);
      case 'gooseBoops': return (state.gooseBoops as number) >= (condition.value as number);
      case 'rageGooseBooped': return (state.rageGooseBooped as boolean) === true;
      case 'cobraChickenDefeated': return (state.cobraChickenDefeated as boolean) === true;
      case 'goldenGooseCrit': return (state.goldenGooseCrit as boolean) === true;
      case 'waifuCount': return (state.waifuCount as number) >= (condition.value as number);
      case 'maxBond': return (state.maxBond as number) >= (condition.value as number);
      case 'upgradeCount': return (state.upgradeCount as number) >= (condition.value as number);
      case 'totalBP': return (state.totalBP as number) >= (condition.value as number);
      case 'catRealm': return state.highestCatRealm === condition.value;
      default: return false;
    }
  }

  unlock(id: string): boolean {
    if (this.unlocked.has(id)) return false;
    this.unlocked.add(id);
    this.unlockedAt[id] = Date.now();
    return true;
  }

  isUnlocked(id: string): boolean {
    return this.unlocked.has(id);
  }

  getUnlocked(): AchievementTemplate[] {
    return ACHIEVEMENTS.filter(a => this.unlocked.has(a.id));
  }

  getAll(): (AchievementTemplate & { unlocked: boolean; unlockedAt?: number })[] {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: this.unlocked.has(a.id),
      unlockedAt: this.unlockedAt[a.id],
    }));
  }

  getProgress(): { total: number; unlocked: number; percentage: number } {
    const total = ACHIEVEMENTS.filter(a => !a.hidden).length;
    const unlocked = ACHIEVEMENTS.filter(a => !a.hidden && this.unlocked.has(a.id)).length;
    return { total, unlocked, percentage: total > 0 ? (unlocked / total) * 100 : 0 };
  }

  getByCategory(category: AchievementCategory): AchievementTemplate[] {
    return ACHIEVEMENTS.filter(a => a.category === category);
  }

  getCount(): number {
    return this.unlocked.size;
  }

  // ── Serialization ─────────────────────────────────────────

  serialize() {
    return {
      unlocked: [...this.unlocked],
      unlockedAt: { ...this.unlockedAt },
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.unlocked) {
      this.unlocked = new Set(data.unlocked as string[]);
    }
    if (data.unlockedAt) {
      this.unlockedAt = data.unlockedAt as Record<string, number>;
    }
  }
}
