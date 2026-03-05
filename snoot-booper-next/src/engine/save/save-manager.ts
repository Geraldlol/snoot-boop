/**
 * SaveManager - Save/Load/Export/Import with auto-save
 */

import type { SaveDataV3, SaveDataV2 } from '../types';
import { migrateV2ToV3 } from './migration';

const SAVE_KEY = 'celestial_snoot_sect_v3';
const LEGACY_SAVE_KEY = 'celestial_snoot_sect';
const BACKUP_KEY = 'celestial_snoot_sect_backup';
const AUTO_SAVE_INTERVAL = 30_000; // 30 seconds

export class SaveManager {
  private autoSaveTimer: ReturnType<typeof setInterval> | null = null;

  /**
   * Save v3.0.0 data to localStorage
   */
  save(data: SaveDataV3): boolean {
    try {
      data.timestamp = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('[SaveManager] Save failed:', e);
      return false;
    }
  }

  /**
   * Load save data. Checks v3 first, then attempts v2 migration.
   */
  load(): SaveDataV3 | null {
    // Try v3 first
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as SaveDataV3;
        if (data.version === '3.0.0') return data;
      }
    } catch (e) {
      console.error('[SaveManager] v3 load failed:', e);
    }

    // Try legacy v2
    try {
      const legacyRaw = localStorage.getItem(LEGACY_SAVE_KEY);
      if (legacyRaw) {
        console.log('[SaveManager] Found legacy save, migrating...');
        // Backup the old save
        localStorage.setItem(BACKUP_KEY, legacyRaw);

        const legacyData = JSON.parse(legacyRaw) as SaveDataV2;
        const migrated = migrateV2ToV3(legacyData);

        // Save the migrated data
        this.save(migrated);
        return migrated;
      }
    } catch (e) {
      console.error('[SaveManager] Legacy migration failed:', e);
    }

    return null;
  }

  /**
   * Check if any save exists
   */
  hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null || localStorage.getItem(LEGACY_SAVE_KEY) !== null;
  }

  /**
   * Delete save data
   */
  deleteSave(): void {
    localStorage.removeItem(SAVE_KEY);
  }

  /**
   * Export save as base64 string (for Discord sharing)
   */
  exportSave(): string | null {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return btoa(raw);
  }

  /**
   * Import save from base64 string
   */
  importSave(encoded: string): SaveDataV3 | null {
    try {
      const decoded = atob(encoded);
      const data = JSON.parse(decoded);

      // Check if it's v3
      if (data.version === '3.0.0') {
        if (!this.validateV3(data)) return null;
        localStorage.setItem(SAVE_KEY, decoded);
        return data;
      }

      // Try as v2 legacy
      if (data.version && data.resources) {
        const migrated = migrateV2ToV3(data as SaveDataV2);
        this.save(migrated);
        return migrated;
      }

      return null;
    } catch (e) {
      console.error('[SaveManager] Import failed:', e);
      return null;
    }
  }

  /**
   * Validate v3 save structure
   */
  private validateV3(data: unknown): data is SaveDataV3 {
    if (!data || typeof data !== 'object') return false;
    const d = data as Record<string, unknown>;
    return (
      d.version === '3.0.0' &&
      typeof d.timestamp === 'number' &&
      typeof d.resources === 'object' &&
      d.resources !== null
    );
  }

  /**
   * Start auto-save timer
   */
  startAutoSave(getSaveData: () => SaveDataV3): void {
    this.stopAutoSave();
    this.autoSaveTimer = setInterval(() => {
      const data = getSaveData();
      this.save(data);
    }, AUTO_SAVE_INTERVAL);
  }

  /**
   * Stop auto-save timer
   */
  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Get the timestamp of the last save
   */
  getLastSaveTime(): number | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data.timestamp ?? null;
    } catch {
      return null;
    }
  }
}
