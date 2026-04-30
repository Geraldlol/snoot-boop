/**
 * WaifuSystem - Waifu collection, bonding, activities, combined bonuses
 * Ported from js/waifus.js (1,632 lines)
 */

import { WAIFU_TEMPLATES, BOND_ACTIVITIES, ACTIVITY_PREFERENCE_BONUS, type WaifuTemplate, type BondActivity } from '../../data/waifus';

// ─── Types ───────────────────────────────────────────────────

export interface WaifuState {
  id: string;
  bondLevel: number;    // 0-100
  giftsGiven: number;
  totalActivities: number;
  unlocked: boolean;
}

export interface ActivityState {
  waifuId: string;
  activityId: string;
  startTime: number;
  duration: number;      // seconds
  bondGain: number;
}

export interface WaifuBonuses {
  bpMultiplier: number;
  ppMultiplier: number;
  afkMultiplier: number;
  catHappinessBonus: number;
}

// ─── WaifuSystem Class ──────────────────────────────────────

export class WaifuSystem {
  private waifuStates: Record<string, WaifuState> = {};
  private currentActivity: ActivityState | null = null;
  private activityHistory: Array<{ waifuId: string; activityId: string; time: number }> = [];
  private attentionTracker: Record<string, number> = {};

  init(): void {
    // Unlock starter waifu (Mochi)
    this.unlockWaifu('mochi');
  }

  // ── Unlock ─────────────────────────────────────────────────

  unlockWaifu(waifuId: string): boolean {
    if (this.waifuStates[waifuId]) return false;
    const template = WAIFU_TEMPLATES[waifuId];
    if (!template) return false;

    this.waifuStates[waifuId] = {
      id: waifuId,
      bondLevel: 0,
      giftsGiven: 0,
      totalActivities: 0,
      unlocked: true,
    };
    this.attentionTracker[waifuId] = 0;
    return true;
  }

  checkUnlockConditions(gameState: {
    catCount: number;
    totalAfkTime: number;
    allBasicUpgrades: boolean;
    allWaifusMaxBond: boolean;
  }): string[] {
    const newUnlocks: string[] = [];
    for (const [id, template] of Object.entries(WAIFU_TEMPLATES)) {
      if (this.waifuStates[id]) continue;
      const cond = template.unlockCondition;
      let met = false;

      switch (cond.type) {
        case 'starter': met = true; break;
        case 'catCount': met = gameState.catCount >= (cond.value as number); break;
        case 'afkTime': met = gameState.totalAfkTime >= (cond.value as number); break;
        case 'allBasicUpgrades': met = gameState.allBasicUpgrades; break;
        case 'maxBondAll': met = gameState.allWaifusMaxBond; break;
      }

      if (met) {
        this.unlockWaifu(id);
        newUnlocks.push(id);
      }
    }
    return newUnlocks;
  }

  // ── Bond ───────────────────────────────────────────────────

  increaseBond(waifuId: string, amount: number): number {
    const state = this.waifuStates[waifuId];
    if (!state) return 0;
    state.bondLevel = Math.min(100, state.bondLevel + amount);
    return state.bondLevel;
  }

  getBondLevel(waifuId: string): number {
    return this.waifuStates[waifuId]?.bondLevel ?? 0;
  }

  // ── Dialogue ───────────────────────────────────────────────

  getDialogue(waifuId: string, type?: string): string {
    const template = WAIFU_TEMPLATES[waifuId];
    if (!template) return '';

    if (type && template.dialogues[type]?.length) {
      const pool = template.dialogues[type];
      return pool[Math.floor(Math.random() * pool.length)];
    }

    const bond = this.getBondLevel(waifuId);
    let tier: string;
    if (bond >= 100) tier = 'maxBond';
    else if (bond >= 75) tier = 'highBond';
    else if (bond >= 40) tier = 'midBond';
    else tier = 'lowBond';

    const pool = template.dialogues[tier] ?? template.dialogues.greeting ?? ['...'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ── Activities ─────────────────────────────────────────────

  getAvailableActivities(waifuId: string): (BondActivity & { preferred: boolean })[] {
    const state = this.waifuStates[waifuId];
    if (!state) return [];

    const hour = new Date().getHours();
    const isNight = hour >= 22 || hour < 6;

    return BOND_ACTIVITIES
      .filter((a) => state.bondLevel >= a.unlockBond)
      .filter((a) => {
        if (a.timeRestriction === 'night' && !isNight) return false;
        if (a.timeRestriction === 'day' && isNight) return false;
        return true;
      })
      .map((a) => ({ ...a, preferred: a.preferredBy.includes(waifuId) }));
  }

  startActivity(waifuId: string, activityId: string): { success: boolean; dialogue?: string } {
    if (this.currentActivity) return { success: false };
    const state = this.waifuStates[waifuId];
    if (!state) return { success: false };

    const activity = BOND_ACTIVITIES.find((a) => a.id === activityId);
    if (!activity) return { success: false };
    if (state.bondLevel < activity.unlockBond) return { success: false };

    const preferred = activity.preferredBy.includes(waifuId);
    const bondGain = activity.bondGain * (preferred ? ACTIVITY_PREFERENCE_BONUS : 1);

    this.currentActivity = {
      waifuId,
      activityId,
      startTime: Date.now(),
      duration: activity.duration,
      bondGain,
    };

    const template = WAIFU_TEMPLATES[waifuId];
    const dialogue = template?.dialogues.greeting?.[0] ?? '';
    return { success: true, dialogue };
  }

  getActivityProgress(): { elapsed: number; progress: number; remaining: number; isComplete: boolean } | null {
    if (!this.currentActivity) return null;
    const elapsed = (Date.now() - this.currentActivity.startTime) / 1000;
    const progress = Math.min(1, elapsed / this.currentActivity.duration);
    return {
      elapsed,
      progress,
      remaining: Math.max(0, this.currentActivity.duration - elapsed),
      isComplete: progress >= 1,
    };
  }

  completeActivity(): { bondGain: number; effects: Record<string, number> } | null {
    if (!this.currentActivity) return null;
    const { waifuId, activityId, bondGain } = this.currentActivity;
    const activity = BOND_ACTIVITIES.find((a) => a.id === activityId);

    this.increaseBond(waifuId, bondGain);
    const state = this.waifuStates[waifuId];
    if (state) state.totalActivities++;
    this.attentionTracker[waifuId] = (this.attentionTracker[waifuId] ?? 0) + 1;

    this.activityHistory.push({ waifuId, activityId, time: Date.now() });
    if (this.activityHistory.length > 50) this.activityHistory.shift();

    this.currentActivity = null;
    return { bondGain, effects: activity?.effects ?? {} };
  }

  cancelActivity(): void {
    this.currentActivity = null;
  }

  isInActivity(): boolean {
    return this.currentActivity !== null;
  }

  getActiveWaifuId(): string | null {
    return this.currentActivity?.waifuId ?? null;
  }

  checkPendingActivity(): { bondGain: number; effects: Record<string, number> } | null {
    const progress = this.getActivityProgress();
    if (progress?.isComplete) {
      return this.completeActivity();
    }
    return null;
  }

  // ── Combined Bonuses ───────────────────────────────────────

  getCombinedBonuses(): WaifuBonuses {
    const bonuses: WaifuBonuses = { bpMultiplier: 1, ppMultiplier: 1, afkMultiplier: 1, catHappinessBonus: 1 };

    for (const state of Object.values(this.waifuStates)) {
      if (!state.unlocked) continue;
      const template = WAIFU_TEMPLATES[state.id];
      if (!template) continue;

      // Scale bonus by bond level (0-100%)
      const scale = state.bondLevel / 100;
      switch (template.bonus.type) {
        case 'bpMultiplier': bonuses.bpMultiplier += (template.bonus.value - 1) * scale; break;
        case 'ppMultiplier': bonuses.ppMultiplier += (template.bonus.value - 1) * scale; break;
        case 'afkMultiplier': bonuses.afkMultiplier += (template.bonus.value - 1) * scale; break;
        case 'catHappinessBonus': bonuses.catHappinessBonus += (template.bonus.value - 1) * scale; break;
      }
    }

    return bonuses;
  }

  // ── Queries ────────────────────────────────────────────────

  getUnlockedWaifus(): WaifuState[] {
    return Object.values(this.waifuStates).filter((s) => s.unlocked);
  }

  getWaifu(waifuId: string): WaifuState | null {
    return this.waifuStates[waifuId] ?? null;
  }

  getTemplate(waifuId: string): WaifuTemplate | undefined {
    return WAIFU_TEMPLATES[waifuId];
  }

  allMaxBond(): boolean {
    const unlocked = this.getUnlockedWaifus();
    // Need all 5 base waifus (excluding meowlina) at max bond
    const baseWaifus = ['mochi', 'sakura', 'luna', 'nyanta', 'fluffington'];
    return baseWaifus.every((id) => (this.waifuStates[id]?.bondLevel ?? 0) >= 100);
  }

  // ── Reset ──────────────────────────────────────────────────

  reset(): void {
    this.waifuStates = {};
    this.currentActivity = null;
    this.activityHistory = [];
    this.attentionTracker = {};
    this.init();
  }

  // ── Serialization ──────────────────────────────────────────

  serialize(): { waifuStates: Record<string, WaifuState>; activityHistory: unknown[]; attentionTracker: Record<string, number> } {
    return {
      waifuStates: { ...this.waifuStates },
      activityHistory: [...this.activityHistory],
      attentionTracker: { ...this.attentionTracker },
    };
  }

  deserialize(data: { waifuStates?: Record<string, WaifuState>; activityHistory?: unknown[]; attentionTracker?: Record<string, number> }): void {
    if (data.waifuStates) this.waifuStates = data.waifuStates;
    if (data.activityHistory) this.activityHistory = data.activityHistory as typeof this.activityHistory;
    if (data.attentionTracker) this.attentionTracker = data.attentionTracker;
  }
}
