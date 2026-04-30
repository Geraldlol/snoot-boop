/**
 * UI Store - Screens, panels, modals, notifications
 */

import { create } from 'zustand';

export type GameScreen = 'master_select' | 'game' | 'dungeon' | 'afk_return';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'achievement' | 'secret' | 'lore';
  title: string;
  message: string;
  emoji?: string;
  duration?: number;
  timestamp: number;
}

export type PanelId =
  | 'sanctuary'    // The Snoot Altar (default view, boop happens here)
  | 'cats'         // Roster
  | 'waifus'       // Bond Hall
  | 'upgrades'
  | 'equipment'    // Relics
  | 'buildings'    // Sect Hall
  | 'cultivation'  // Realms
  | 'techniques'
  | 'goose'
  | 'achievements'
  | 'lore'
  | 'settings'
  | 'prestige'     // Dao Tree (Ascend)
  | 'reincarnation'// Reincarnation (separate from prestige in design)
  | 'wheel'
  | 'crafting'
  | 'daily'
  | 'catino'
  | 'social'       // Friends
  | 'sectWar'      // Sect War
  | 'tournament';  // Celestial Tournament

interface UIState {
  currentScreen: GameScreen;
  activePanel: PanelId;
  modalStack: string[];
  notifications: Notification[];
  showSaveIndicator: boolean;
  debugMode: boolean;

  // Actions
  setScreen: (screen: GameScreen) => void;
  openPanel: (panel: PanelId) => void;
  closePanel: () => void; // returns to sanctuary
  togglePanel: (panel: PanelId) => void;
  pushModal: (modalId: string) => void;
  popModal: () => void;
  closeAllModals: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  flashSaveIndicator: () => void;
  setDebugMode: (enabled: boolean) => void;
}

let notifCounter = 0;

export const useUIStore = create<UIState>()((set, get) => ({
  currentScreen: 'master_select',
  activePanel: 'sanctuary',
  modalStack: [],
  notifications: [],
  showSaveIndicator: false,
  debugMode: false,

  setScreen: (screen: GameScreen) => {
    set({ currentScreen: screen });
  },

  openPanel: (panel: PanelId) => {
    set({ activePanel: panel });
  },

  closePanel: () => {
    set({ activePanel: 'sanctuary' });
  },

  togglePanel: (panel: PanelId) => {
    set((state) => ({
      activePanel: state.activePanel === panel ? 'sanctuary' : panel,
    }));
  },

  pushModal: (modalId: string) => {
    set((state) => ({
      modalStack: [...state.modalStack, modalId],
    }));
  },

  popModal: () => {
    set((state) => ({
      modalStack: state.modalStack.slice(0, -1),
    }));
  },

  closeAllModals: () => {
    set({ modalStack: [] });
  },

  addNotification: (notification) => {
    const id = `notif_${++notifCounter}`;
    const full: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
    };

    set((state) => ({
      notifications: [...state.notifications, full].slice(-50), // Keep last 50
    }));

    // Auto-remove after duration
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  flashSaveIndicator: () => {
    set({ showSaveIndicator: true });
    setTimeout(() => set({ showSaveIndicator: false }), 2000);
  },

  setDebugMode: (enabled: boolean) => {
    set({ debugMode: enabled });
  },
}));
