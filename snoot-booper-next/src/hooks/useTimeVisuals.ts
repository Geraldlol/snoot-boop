import { useEffect, useRef } from 'react';
import { engine } from '@/engine/engine';
import { useEffectsStore } from '@/store/effects-store';

export function useTimeVisuals() {
  const setSkyState = useEffectsStore((s) => s.setSkyState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      const sky = engine.time.getSkyInfo();
      const timeOfDay = engine.time.getCurrentTimeOfDay();
      const season = engine.time.getCurrentSeason();
      setSkyState({
        ambientColor: sky.ambientColor,
        sunIntensity: sky.sunIntensity,
        fogDensity: sky.fogDensity,
        timeOfDay,
        season,
      });
    };

    update(); // immediate
    intervalRef.current = setInterval(update, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [setSkyState]);
}
