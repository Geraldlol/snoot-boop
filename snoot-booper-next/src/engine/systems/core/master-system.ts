/**
 * MasterSystem - The Seven Wandering Masters
 *
 * Pure TypeScript, zero React imports.
 */

import { MASTERS } from '../../data/masters';
import type { Master, MasterId, GameModifiers } from '../../types';

export class MasterSystem {
  private selectedMaster: Master | null = null;
  private allMasters = MASTERS;

  selectMaster(masterId: MasterId): Master | null {
    const master = this.allMasters[masterId];
    if (!master) return null;
    this.selectedMaster = master;
    return master;
  }

  getSelected(): Master | null {
    return this.selectedMaster;
  }

  getSelectedId(): MasterId | null {
    return this.selectedMaster?.id ?? null;
  }

  /**
   * Get the passive effects for the current master.
   * Some passives are conditional (e.g., Gerald's meditation bonus).
   */
  getPassiveEffects(context: { isMeditating?: boolean }): Partial<GameModifiers> {
    void context;
    if (!this.selectedMaster) return {};

    const effects = { ...this.selectedMaster.passive.effect };
    const result: Partial<GameModifiers> = {};

    // Map effect keys to GameModifiers
    if (effects.bpMultiplier) result.bpMultiplier = effects.bpMultiplier as number;
    if (effects.afkMultiplier) result.afkMultiplier = effects.afkMultiplier as number;
    if (effects.critChanceBonus) result.critChanceBonus = effects.critChanceBonus as number;
    if (effects.catHappinessMultiplier) result.catHappinessMultiplier = effects.catHappinessMultiplier as number;
    if (effects.eventDiscoveryBonus) result.eventDiscoveryBonus = effects.eventDiscoveryBonus as number;
    if (effects.rareCatBonus) result.rareCatBonus = effects.rareCatBonus as number;
    if (effects.boopSpeedMultiplier) result.boopSpeedMultiplier = effects.boopSpeedMultiplier as number;
    if (effects.preventDecay) result.preventDecay = true;

    return result;
  }

  getRandomQuote(): string {
    if (!this.selectedMaster) return '';
    const quotes = this.selectedMaster.quotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  getMasterById(id: string): Master | undefined {
    return this.allMasters[id];
  }

  getAllMasters(): Master[] {
    return Object.values(this.allMasters);
  }

  /**
   * Check if the Eighth Master (mythic) is unlocked.
   */
  isMythicUnlocked(heavenlySeals: number): boolean {
    return heavenlySeals >= 100;
  }

  serialize(): { selectedMaster: MasterId | null } {
    return { selectedMaster: this.selectedMaster?.id ?? null };
  }

  deserialize(data: { selectedMaster?: MasterId | null }): void {
    if (data.selectedMaster) {
      this.selectMaster(data.selectedMaster);
    }
  }
}
