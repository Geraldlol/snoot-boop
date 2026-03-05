/**
 * BoopSystem - The Sacred Boop Mechanics
 *
 * Pure TypeScript, zero React imports.
 * Handles boop power calculation, crits, combos, stance modifiers.
 */

import { eventBus, EVENTS } from '../../event-bus';
import type { GameModifiers } from '../../types';

export interface BoopResult {
  bp: number;
  isCrit: boolean;
  combo: number;
  comboMultiplier: number;
  cultivationXP: number;
}

export interface StanceModifiers {
  boopPower: number;
  critChance: number;
  critMultiplier: number;
  comboDecay: number;
}

const DEFAULT_STANCE: StanceModifiers = {
  boopPower: 1.0,
  critChance: 0.05,
  critMultiplier: 10,
  comboDecay: 4000,
};

export class BoopSystem {
  private boopPower = 1;
  private comboCount = 0;
  private comboTimer: ReturnType<typeof setTimeout> | null = null;
  private maxCombo = 0;
  private totalBoops = 0;
  private criticalBoops = 0;
  private stanceModifiers: StanceModifiers = { ...DEFAULT_STANCE };

  /**
   * Perform a boop. Returns the result with BP earned.
   */
  boop(modifiers: GameModifiers, extraBpPerBoop = 0, waifuBpMult = 1): BoopResult {
    // Base BP with stance modifier
    let bp = this.boopPower * this.stanceModifiers.boopPower;
    bp += extraBpPerBoop;
    bp *= modifiers.bpMultiplier;
    bp *= waifuBpMult;

    // Critical check
    let critChance = this.stanceModifiers.critChance + modifiers.critChanceBonus;
    const isCrit = Math.random() < critChance;

    if (isCrit) {
      const critMult = this.stanceModifiers.critMultiplier + (modifiers.critMultiplier - 10); // base is 10
      bp *= critMult;
      this.criticalBoops++;
    }

    // Combo system
    this.comboCount++;
    if (this.comboCount > this.maxCombo) {
      this.maxCombo = this.comboCount;
    }

    // Reset combo timer
    if (this.comboTimer) clearTimeout(this.comboTimer);
    this.comboTimer = setTimeout(() => {
      this.comboCount = 0;
    }, this.stanceModifiers.comboDecay);

    // Combo multiplier (up to 2x at 100)
    const comboMultiplier = 1 + Math.min(this.comboCount, 100) * 0.01;
    bp *= comboMultiplier;

    // Boop damage modifier (from relics, etc.)
    bp *= modifiers.boopDamage;

    this.totalBoops++;

    // Cultivation XP: base 1, +1 for crits, +1 per 25 combo
    let cultivationXP = 1;
    if (isCrit) cultivationXP += 1;
    cultivationXP += Math.floor(this.comboCount / 25);

    const result: BoopResult = {
      bp,
      isCrit,
      combo: this.comboCount,
      comboMultiplier,
      cultivationXP,
    };

    eventBus.emit(EVENTS.BOOP, result);
    return result;
  }

  /**
   * Set boop power (from upgrades).
   */
  setBoopPower(power: number): void {
    this.boopPower = power;
  }

  getBoopPower(): number {
    return this.boopPower;
  }

  getComboCount(): number {
    return this.comboCount;
  }

  getMaxCombo(): number {
    return this.maxCombo;
  }

  getTotalBoops(): number {
    return this.totalBoops;
  }

  getCriticalBoops(): number {
    return this.criticalBoops;
  }

  setStanceModifiers(mods: Partial<StanceModifiers>): void {
    this.stanceModifiers = { ...this.stanceModifiers, ...mods };
  }

  resetStanceModifiers(): void {
    this.stanceModifiers = { ...DEFAULT_STANCE };
  }

  /**
   * Restore state from save data.
   */
  restore(data: {
    boopPower?: number;
    maxCombo?: number;
    totalBoops?: number;
    criticalBoops?: number;
  }): void {
    if (data.boopPower !== undefined) this.boopPower = data.boopPower;
    if (data.maxCombo !== undefined) this.maxCombo = data.maxCombo;
    if (data.totalBoops !== undefined) this.totalBoops = data.totalBoops;
    if (data.criticalBoops !== undefined) this.criticalBoops = data.criticalBoops;
  }

  /**
   * Reset for prestige.
   */
  reset(): void {
    this.boopPower = 1;
    this.comboCount = 0;
    this.maxCombo = 0;
    this.totalBoops = 0;
    this.criticalBoops = 0;
    this.stanceModifiers = { ...DEFAULT_STANCE };
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
      this.comboTimer = null;
    }
  }
}
