/**
 * CatPopulation - Renders all owned cats in the 3D sanctuary.
 * Assigns wandering positions, handles click selection.
 * Max ~100 rendered, rest "inside buildings".
 */

'use client';

import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCatStore } from '@/store/cat-store';
import Cat3D from './Cat3D';
import type { CatAnimMode } from './Cat3D';

const MAX_RENDERED = 100;
const WANDER_BOUNDS = { minX: -12, maxX: 12, minZ: -8, maxZ: 8 };
const WANDER_SPEED = 0.3; // units per second
const ANIM_TRANSITION_DURATION = 0.5; // seconds to fully transition

// Animation roll weights: idle 40%, sleeping 20%, grooming 15%, playing 15%, loaf 10%
const ANIM_ROLL_TABLE: { mode: CatAnimMode; weight: number }[] = [
  { mode: 'idle', weight: 40 },
  { mode: 'sleeping', weight: 20 },
  { mode: 'grooming', weight: 15 },
  { mode: 'playing', weight: 15 },
  { mode: 'loaf', weight: 10 },
];

function rollAnimMode(): CatAnimMode {
  let roll = Math.random() * 100;
  for (const entry of ANIM_ROLL_TABLE) {
    roll -= entry.weight;
    if (roll <= 0) return entry.mode;
  }
  return 'idle';
}

interface CatWanderState {
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  waitTimer: number;
  rotation: number;
  animMode: CatAnimMode;
  animTransition: number; // 0-1, increases over ANIM_TRANSITION_DURATION
}

export default function CatPopulation() {
  const cats = useCatStore((s) => s.cats);
  const selectedCatId = useCatStore((s) => s.selectedCatId);
  const selectCat = useCatStore((s) => s.selectCat);

  // Only render up to MAX_RENDERED
  const visibleCats = useMemo(() => cats.slice(0, MAX_RENDERED), [cats]);

  // Wander state for each cat (persisted in ref)
  const wanderStates = useRef<Map<string, CatWanderState>>(new Map());

  // Initialize wander positions
  useMemo(() => {
    for (const cat of visibleCats) {
      if (!wanderStates.current.has(cat.instanceId)) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 2 + Math.random() * 8;
        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist;
        wanderStates.current.set(cat.instanceId, {
          x, z,
          targetX: x, targetZ: z,
          waitTimer: Math.random() * 5, // stagger initial movement
          rotation: Math.random() * Math.PI * 2,
          animMode: 'idle',
          animTransition: 1,
        });
      }
    }
  }, [visibleCats]);

  // Animate wander
  useFrame((_, delta) => {
    for (const cat of visibleCats) {
      const state = wanderStates.current.get(cat.instanceId);
      if (!state) continue;

      if (state.waitTimer > 0) {
        state.waitTimer -= delta;
        // While waiting, ramp up animation transition
        if (state.animTransition < 1) {
          state.animTransition = Math.min(1, state.animTransition + delta / ANIM_TRANSITION_DURATION);
        }
        continue;
      }

      // Move toward target
      const dx = state.targetX - state.x;
      const dz = state.targetZ - state.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 0.1) {
        // Arrived — pick new target after a wait, roll new animation
        const newAnim = rollAnimMode();
        state.animMode = newAnim;
        state.animTransition = 0;

        // Sleeping cats wait longer
        if (newAnim === 'sleeping') {
          state.waitTimer = 5 + Math.random() * 7;
        } else {
          state.waitTimer = 2 + Math.random() * 6;
        }

        state.targetX = WANDER_BOUNDS.minX + Math.random() * (WANDER_BOUNDS.maxX - WANDER_BOUNDS.minX);
        state.targetZ = WANDER_BOUNDS.minZ + Math.random() * (WANDER_BOUNDS.maxZ - WANDER_BOUNDS.minZ);
      } else {
        // Moving — always idle with full transition
        state.animMode = 'idle';
        state.animTransition = 1;

        const speed = WANDER_SPEED * delta;
        const moveRatio = Math.min(speed / dist, 1);
        state.x += dx * moveRatio;
        state.z += dz * moveRatio;
        state.rotation = Math.atan2(dx, dz);
      }
    }
  });

  const handleCatClick = useCallback((instanceId: string) => {
    selectCat(selectedCatId === instanceId ? null : instanceId);
  }, [selectCat, selectedCatId]);

  return (
    <group>
      {visibleCats.map((cat) => {
        const state = wanderStates.current.get(cat.instanceId);
        const x = state?.x ?? 0;
        const z = state?.z ?? 0;
        const ry = state?.rotation ?? 0;

        return (
          <group key={cat.instanceId} position={[x, 0, z]} rotation={[0, ry, 0]}>
            <Cat3D
              cat={cat}
              position={[0, 0, 0]}
              selected={selectedCatId === cat.instanceId}
              onClick={() => handleCatClick(cat.instanceId)}
              animState={{
                mode: state?.animMode ?? 'idle',
                transitionProgress: state?.animTransition ?? 1,
              }}
            />
          </group>
        );
      })}
    </group>
  );
}
