/**
 * useGameLoop - React hook that drives the game loop
 *
 * Runs game logic via requestAnimationFrame, separate from R3F's useFrame.
 */

'use client';

import { useEffect, useRef } from 'react';
import { gameLoop } from '@/engine/game-loop';
import { useGameStore } from '@/store/game-store';

export function useGameLoop() {
  const initialized = useGameStore((s) => s.initialized);
  const paused = useGameStore((s) => s.paused);
  const tick = useGameStore((s) => s.tick);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!initialized || startedRef.current) return;

    // Register the store's tick as a game loop callback
    const unregister = gameLoop.register((ctx) => {
      tick(ctx.deltaMs);
    });

    gameLoop.start();
    startedRef.current = true;

    return () => {
      gameLoop.stop();
      unregister();
      startedRef.current = false;
    };
  }, [initialized, tick]);

  useEffect(() => {
    gameLoop.setPaused(paused);
  }, [paused]);
}
