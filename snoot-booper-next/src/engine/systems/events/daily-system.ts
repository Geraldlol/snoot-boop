/**
 * DailySystem - Daily commissions and streak bonuses
 * Ported from js/daily.js (603 lines)
 */

// ─── Types ──────────────────────────────────────────────────

export interface DailyCommission {
  id: string;
  name: string;
  description: string;
  type: 'boops' | 'cats' | 'goose' | 'happiness' | 'cultivation' | 'waifu';
  target: number;
  progress: number;
  completed: boolean;
  rewards: { type: string; value: number }[];
}

export interface DailyReward {
  day: number;
  rewards: { type: string; value: number }[];
  special?: string;
}

// ─── Commission Templates ───────────────────────────────────

const COMMISSION_POOL: Omit<DailyCommission, 'progress' | 'completed'>[] = [
  { id: 'daily_boops', name: 'Daily Cultivation', description: 'Perform 500 boops', type: 'boops', target: 500, rewards: [{ type: 'bp', value: 2000 }] },
  { id: 'daily_boops_hard', name: 'Intensive Training', description: 'Perform 2000 boops', type: 'boops', target: 2000, rewards: [{ type: 'bp', value: 10000 }] },
  { id: 'daily_recruit', name: 'Cat Scout', description: 'Recruit 2 cats', type: 'cats', target: 2, rewards: [{ type: 'pp', value: 1000 }] },
  { id: 'daily_goose', name: 'Goose Patrol', description: 'Boop a goose', type: 'goose', target: 1, rewards: [{ type: 'gooseFeather', value: 2 }] },
  { id: 'daily_happy', name: 'Keeper of Joy', description: 'Get a cat to 100% happiness', type: 'happiness', target: 100, rewards: [{ type: 'pp', value: 500 }] },
  { id: 'daily_waifu', name: 'Quality Time', description: 'Complete a waifu activity', type: 'waifu', target: 1, rewards: [{ type: 'waifuTokens', value: 5 }] },
];

// ─── Streak Rewards ─────────────────────────────────────────

const STREAK_REWARDS: DailyReward[] = [
  { day: 1, rewards: [{ type: 'bp', value: 1000 }] },
  { day: 2, rewards: [{ type: 'bp', value: 2000 }] },
  { day: 3, rewards: [{ type: 'pp', value: 1000 }] },
  { day: 4, rewards: [{ type: 'bp', value: 5000 }] },
  { day: 5, rewards: [{ type: 'jadeCatnip', value: 3 }] },
  { day: 6, rewards: [{ type: 'bp', value: 10000 }] },
  { day: 7, rewards: [{ type: 'jadeCatnip', value: 10 }, { type: 'gooseFeather', value: 5 }], special: 'weekly_bonus' },
];

// ─── DailySystem Class ─────────────────────────────────────

export class DailySystem {
  private commissions: DailyCommission[] = [];
  private currentStreak = 0;
  private lastLoginDate: string | null = null;
  private lastCommissionDate: string | null = null;
  private totalCommissionsCompleted = 0;

  // ── Daily Login ─────────────────────────────────────────

  checkDailyLogin(): { isNew: boolean; streak: number; reward: DailyReward | null } {
    const today = this.getDateString();

    if (this.lastLoginDate === today) {
      return { isNew: false, streak: this.currentStreak, reward: null };
    }

    // Check streak
    const yesterday = this.getDateString(new Date(Date.now() - 86400000));
    if (this.lastLoginDate === yesterday) {
      this.currentStreak++;
    } else {
      this.currentStreak = 1;
    }

    this.lastLoginDate = today;

    // Get streak reward (cycle after 7)
    const streakDay = ((this.currentStreak - 1) % 7) + 1;
    const reward = STREAK_REWARDS.find(r => r.day === streakDay) ?? STREAK_REWARDS[0];

    return { isNew: true, streak: this.currentStreak, reward };
  }

  // ── Commissions ─────────────────────────────────────────

  getCommissions(): DailyCommission[] {
    const today = this.getDateString();
    if (this.lastCommissionDate !== today) {
      this.generateDailyCommissions();
      this.lastCommissionDate = today;
    }
    return this.commissions;
  }

  private generateDailyCommissions(): void {
    // Pick 3 random commissions
    const shuffled = [...COMMISSION_POOL].sort(() => Math.random() - 0.5);
    this.commissions = shuffled.slice(0, 3).map(c => ({
      ...c,
      progress: 0,
      completed: false,
    }));
  }

  updateProgress(type: string, amount: number): DailyCommission[] {
    const completed: DailyCommission[] = [];

    for (const commission of this.commissions) {
      if (commission.completed) continue;
      if (commission.type !== type) continue;

      commission.progress = Math.min(commission.target, commission.progress + amount);
      if (commission.progress >= commission.target) {
        commission.completed = true;
        this.totalCommissionsCompleted++;
        completed.push(commission);
      }
    }

    return completed;
  }

  allCommissionsComplete(): boolean {
    return this.commissions.length > 0 && this.commissions.every(c => c.completed);
  }

  // ── Queries ─────────────────────────────────────────────

  getCurrentStreak(): number {
    return this.currentStreak;
  }

  getTotalCompleted(): number {
    return this.totalCommissionsCompleted;
  }

  // ── Helpers ─────────────────────────────────────────────

  private getDateString(date: Date = new Date()): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  // ── Serialization ─────────────────────────────────────────

  serialize() {
    return {
      commissions: this.commissions,
      currentStreak: this.currentStreak,
      lastLoginDate: this.lastLoginDate,
      lastCommissionDate: this.lastCommissionDate,
      totalCommissionsCompleted: this.totalCommissionsCompleted,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.commissions) this.commissions = data.commissions as DailyCommission[];
    if (data.currentStreak) this.currentStreak = data.currentStreak as number;
    if (data.lastLoginDate) this.lastLoginDate = data.lastLoginDate as string;
    if (data.lastCommissionDate) this.lastCommissionDate = data.lastCommissionDate as string;
    if (data.totalCommissionsCompleted) this.totalCommissionsCompleted = data.totalCommissionsCompleted as number;
  }
}
