/**
 * Game Loop - Core tick logic (pure, no React)
 *
 * Called by useGameLoop hook via requestAnimationFrame.
 * Updates all engine systems each frame.
 */

import { eventBus, EVENTS } from './event-bus';

export interface GameLoopContext {
  /** Milliseconds since last tick */
  deltaMs: number;
  /** Total elapsed game time in ms */
  totalTimeMs: number;
  /** Whether the game is paused */
  paused: boolean;
}

type TickCallback = (ctx: GameLoopContext) => void;

export class GameLoop {
  private callbacks: TickCallback[] = [];
  private running = false;
  private lastTime = 0;
  private totalTime = 0;
  private animFrameId: number | null = null;
  private paused = false;

  /**
   * Register a system to receive tick updates
   */
  register(callback: TickCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick();
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.running = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  /**
   * Pause/unpause
   */
  setPaused(paused: boolean): void {
    this.paused = paused;
    eventBus.emit(paused ? EVENTS.GAME_PAUSE : EVENTS.GAME_RESUME);
  }

  private tick = (): void => {
    if (!this.running) return;

    const now = performance.now();
    const deltaMs = Math.min(now - this.lastTime, 100); // Cap at 100ms to prevent spiral
    this.lastTime = now;

    if (!this.paused) {
      this.totalTime += deltaMs;

      const ctx: GameLoopContext = {
        deltaMs,
        totalTimeMs: this.totalTime,
        paused: this.paused,
      };

      for (const callback of this.callbacks) {
        try {
          callback(ctx);
        } catch (error) {
          console.error('[GameLoop] Error in tick callback:', error);
        }
      }

      eventBus.emit(EVENTS.GAME_TICK, ctx);
    }

    this.animFrameId = requestAnimationFrame(this.tick);
  };
}

// Singleton
export const gameLoop = new GameLoop();
