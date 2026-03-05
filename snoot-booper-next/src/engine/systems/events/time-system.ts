/**
 * TimeSystem - Day/night cycle, seasons, time-based modifiers
 * Ported from js/time.js (826 lines)
 */

// ─── Types ──────────────────────────────────────────────────

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface TimeModifiers {
  lunaBonus: number;
  nocturnalCatBonus: number;
  waifuBondGain: number;
  eventFrequency: number;
  afkGains: number;
  giftQuality: number;
}

export interface SpecialDate {
  event: string;
  name: string;
  bonus: number;
}

// ─── TimeSystem Class ──────────────────────────────────────

export class TimeSystem {
  private totalPlaytime = 0;     // seconds
  private sessionStart = Date.now();
  private totalAfkTime = 0;      // ms

  getCurrentTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  isNightTime(): boolean {
    const hour = new Date().getHours();
    return hour >= 22 || hour < 6;
  }

  getCurrentSeason(): Season {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  getTimeModifiers(): TimeModifiers {
    const mods: TimeModifiers = {
      lunaBonus: 1,
      nocturnalCatBonus: 1,
      waifuBondGain: 1,
      eventFrequency: 1,
      afkGains: 1,
      giftQuality: 1,
    };

    if (this.isNightTime()) {
      mods.lunaBonus = 1.5;
      mods.nocturnalCatBonus = 1.25;
    }

    switch (this.getCurrentSeason()) {
      case 'spring': mods.waifuBondGain = 1.25; break;
      case 'summer': mods.eventFrequency = 1.2; break;
      case 'autumn': mods.afkGains = 1.25; break;
      case 'winter': mods.giftQuality = 1.5; break;
    }

    return mods;
  }

  checkSpecialDates(): SpecialDate | null {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    // Lunar New Year (late Jan / early Feb)
    if ((month === 0 && day >= 20) || (month === 1 && day <= 10)) {
      return { event: 'lunar_new_year', name: 'Lunar New Year Festival', bonus: 2.0 };
    }

    // Mid-Autumn Festival
    if (month === 8 && day >= 10 && day <= 20) {
      return { event: 'mid_autumn', name: 'Mid-Autumn Moon Festival', bonus: 1.5 };
    }

    // April Fools
    if (month === 3 && day === 1) {
      return { event: 'april_fools', name: 'Day of the Goose', bonus: 1.5 };
    }

    return null;
  }

  // ── Playtime Tracking ─────────────────────────────────────

  updatePlaytime(deltaSec: number): void {
    this.totalPlaytime += deltaSec;
  }

  getTotalPlaytime(): number {
    return this.totalPlaytime;
  }

  getSessionTime(): number {
    return (Date.now() - this.sessionStart) / 1000;
  }

  addAfkTime(ms: number): void {
    this.totalAfkTime += ms;
  }

  getTotalAfkTime(): number {
    return this.totalAfkTime;
  }

  // ── Day/Night Visual Info ─────────────────────────────────

  getSkyInfo(): { ambientColor: string; sunIntensity: number; fogDensity: number } {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 8) {
      // Dawn
      return { ambientColor: '#FFD4A0', sunIntensity: 0.5, fogDensity: 0.02 };
    } else if (hour >= 8 && hour < 17) {
      // Day
      return { ambientColor: '#FFFBE6', sunIntensity: 1.0, fogDensity: 0.005 };
    } else if (hour >= 17 && hour < 19) {
      // Sunset
      return { ambientColor: '#FF8040', sunIntensity: 0.6, fogDensity: 0.015 };
    } else if (hour >= 19 && hour < 22) {
      // Evening
      return { ambientColor: '#4040A0', sunIntensity: 0.2, fogDensity: 0.01 };
    }
    // Night
    return { ambientColor: '#1a1a3e', sunIntensity: 0.05, fogDensity: 0.02 };
  }

  // ── Serialization ─────────────────────────────────────────

  serialize() {
    return {
      totalPlaytime: this.totalPlaytime,
      totalAfkTime: this.totalAfkTime,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.totalPlaytime) this.totalPlaytime = data.totalPlaytime as number;
    if (data.totalAfkTime) this.totalAfkTime = data.totalAfkTime as number;
  }
}
