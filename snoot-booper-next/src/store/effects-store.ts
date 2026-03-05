import { create } from 'zustand';

interface BoopEffect {
  id: number;
  position: [number, number, number];
  bp: number;
  isCrit: boolean;
  timestamp: number;
}

interface EffectsState {
  // Boop effects queue
  boopEffects: BoopEffect[];
  addBoopEffect: (effect: Omit<BoopEffect, 'id' | 'timestamp'>) => void;
  removeBoopEffect: (id: number) => void;
  clearOldBoopEffects: () => void;

  // Screen shake
  shakeIntensity: number;
  triggerShake: (intensity: number, duration: number) => void;

  // Sky / time-of-day targets (lerped by 3D scene)
  skyAmbientColor: string;
  sunIntensity: number;
  fogDensity: number;
  timeOfDay: string;
  season: string;
  setSkyState: (sky: { ambientColor: string; sunIntensity: number; fogDensity: number; timeOfDay: string; season: string }) => void;

  // Audio
  musicEnabled: boolean;
  sfxEnabled: boolean;
  masterVolume: number;
  setMusicEnabled: (enabled: boolean) => void;
  setSfxEnabled: (enabled: boolean) => void;
  setMasterVolume: (volume: number) => void;
}

let nextBoopId = 0;

export const useEffectsStore = create<EffectsState>((set) => ({
  boopEffects: [],
  addBoopEffect: (effect) =>
    set((s) => ({
      boopEffects: [...s.boopEffects.slice(-20), { ...effect, id: nextBoopId++, timestamp: Date.now() }],
    })),
  removeBoopEffect: (id) =>
    set((s) => ({ boopEffects: s.boopEffects.filter((e) => e.id !== id) })),
  clearOldBoopEffects: () =>
    set((s) => ({ boopEffects: s.boopEffects.filter((e) => Date.now() - e.timestamp < 2000) })),

  shakeIntensity: 0,
  triggerShake: (intensity, _duration) => {
    set({ shakeIntensity: intensity });
    // Decay handled in ScreenShake component via useFrame
  },

  skyAmbientColor: '#FFFBE6',
  sunIntensity: 1.0,
  fogDensity: 0.005,
  timeOfDay: 'afternoon',
  season: 'spring',
  setSkyState: (sky) =>
    set({
      skyAmbientColor: sky.ambientColor,
      sunIntensity: sky.sunIntensity,
      fogDensity: sky.fogDensity,
      timeOfDay: sky.timeOfDay,
      season: sky.season,
    }),

  musicEnabled: true,
  sfxEnabled: true,
  masterVolume: 0.7,
  setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
  setSfxEnabled: (enabled) => set({ sfxEnabled: enabled }),
  setMasterVolume: (volume) => set({ masterVolume: volume }),
}));
