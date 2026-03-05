/**
 * Cat3D - Procedural voxel cat made of ~15 box primitives.
 * MeshToonMaterial for cel-shaded Wuxia look.
 * Realm tier adds glow effects.
 * Supports 5 animation states: idle, sleeping, grooming, playing, loaf.
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Cat } from '@/engine/types';
import { CAT_REALMS, CAT_ELEMENTS, STAR_BONUSES } from '@/engine/data/cats';

export type CatAnimMode = 'idle' | 'sleeping' | 'grooming' | 'playing' | 'loaf';

interface CatAnimState {
  mode: CatAnimMode;
  transitionProgress: number; // 0-1
}

interface Cat3DProps {
  cat: Cat;
  position: [number, number, number];
  onClick?: () => void;
  selected?: boolean;
  animState?: CatAnimState;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export default function Cat3D({ cat, position, onClick, selected, animState }: Cat3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const legFLRef = useRef<THREE.Mesh>(null);
  const legFRRef = useRef<THREE.Mesh>(null);
  const legBLRef = useRef<THREE.Mesh>(null);
  const legBRRef = useRef<THREE.Mesh>(null);

  const realm = CAT_REALMS[cat.realm];
  const element = CAT_ELEMENTS[cat.element];
  const starVisual = STAR_BONUSES[cat.stars];

  // Cat color based on element
  const bodyColor = useMemo(() => element?.color ?? '#888888', [element]);
  const accentColor = useMemo(() => {
    // Lighter shade for belly/paws
    const col = new THREE.Color(bodyColor);
    col.lerp(new THREE.Color('#ffffff'), 0.4);
    return '#' + col.getHexString();
  }, [bodyColor]);

  // Glow for higher realms
  const glowIntensity = useMemo(() => {
    if (realm.order <= 2) return 0;
    return (realm.order - 2) * 0.15;
  }, [realm.order]);

  const mode = animState?.mode ?? 'idle';
  const tp = animState?.transitionProgress ?? 1;

  // Animation state machine
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const phase = position[0]; // per-cat phase offset

    // --- Defaults (idle state values) ---
    let scaleY = 1 + Math.sin(t * 2 + phase) * 0.02;
    let scaleX = 1;
    let bodyScaleX = 1;
    let tailRotZ = Math.sin(t * 3 + position[2]) * 0.4;
    let tailRotBase = 0.8; // base x-rotation for tail
    let headRotY = 0;
    let headRotZ = cat.happiness > 70 ? Math.sin(t * 4 + phase) * 0.05 : 0;
    let eyeScaleY = 1;
    let legScale = 1;
    let posYOffset = 0;

    // --- Compute target values per animation mode ---
    if (mode === 'sleeping') {
      const sleepBreath = 1 + Math.sin(t * 1 + phase) * 0.01; // slower breathing
      scaleY = lerp(scaleY, sleepBreath * 0.7, tp);
      eyeScaleY = lerp(1, 0, tp); // eyes closed
      tailRotZ = lerp(tailRotZ, Math.sin(t * 0.5 + position[2]) * 0.1, tp); // barely moving tail
      headRotZ = lerp(headRotZ, 0, tp); // no head bob
    } else if (mode === 'grooming') {
      headRotY = lerp(0, Math.sin(t * 2.5 + phase) * 0.5, tp); // head turns side-to-side
      tailRotZ = lerp(tailRotZ, 0, tp); // tail still
      headRotZ = lerp(headRotZ, 0, tp);
    } else if (mode === 'playing') {
      tailRotZ = lerp(tailRotZ, Math.sin(t * 6 + position[2]) * 0.8, tp); // faster, bigger tail wag
      posYOffset = lerp(0, Math.abs(Math.sin(t * 5 + phase)) * 0.12, tp); // small hops
      scaleY = lerp(scaleY, 1 + Math.sin(t * 3 + phase) * 0.03, tp); // slightly bouncier breathing
    } else if (mode === 'loaf') {
      legScale = lerp(1, 0, tp); // legs hidden
      bodyScaleX = lerp(1, 1.2, tp); // body wider
      tailRotZ = lerp(tailRotZ, Math.sin(t * 1.5 + position[2]) * 0.1, tp); // minimal tail
      tailRotBase = lerp(0.8, 0.3, tp); // tail tucked closer to body
      headRotZ = lerp(headRotZ, 0, tp);
    }
    // 'idle' uses defaults, no lerp needed

    // --- Apply values ---
    groupRef.current.scale.y = scaleY;
    groupRef.current.scale.x = scaleX;
    groupRef.current.position.y = position[1] + posYOffset;

    if (bodyRef.current) {
      bodyRef.current.scale.x = bodyScaleX;
    }

    if (tailRef.current) {
      tailRef.current.rotation.z = tailRotZ;
      tailRef.current.rotation.x = tailRotBase;
    }

    if (headRef.current) {
      headRef.current.rotation.y = headRotY;
      headRef.current.rotation.z = headRotZ;
    }

    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = eyeScaleY;
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = eyeScaleY;
    }

    if (legFLRef.current) legFLRef.current.scale.y = legScale;
    if (legFRRef.current) legFRRef.current.scale.y = legScale;
    if (legBLRef.current) legBLRef.current.scale.y = legScale;
    if (legBRRef.current) legBRRef.current.scale.y = legScale;
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* Selection ring */}
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.5, 0.6, 16]} />
          <meshBasicMaterial color="#50C878" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.7]} />
        <meshToonMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={glowIntensity} />
      </mesh>

      {/* Belly (lighter) */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.4, 0.15, 0.55]} />
        <meshToonMaterial color={accentColor} />
      </mesh>

      {/* Head */}
      <group ref={headRef}>
        <mesh position={[0, 0.6, 0.3]} castShadow>
          <boxGeometry args={[0.4, 0.35, 0.35]} />
          <meshToonMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={glowIntensity} />
        </mesh>

        {/* Snoot (pink nose area) */}
        <mesh position={[0, 0.53, 0.48]}>
          <boxGeometry args={[0.15, 0.1, 0.05]} />
          <meshToonMaterial color="#FFB6C1" />
        </mesh>

        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[-0.1, 0.65, 0.48]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshBasicMaterial color="#111" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.1, 0.65, 0.48]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshBasicMaterial color="#111" />
        </mesh>

        {/* Left ear */}
        <mesh position={[-0.14, 0.82, 0.3]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[0.1, 0.15, 0.08]} />
          <meshToonMaterial color={bodyColor} />
        </mesh>
        {/* Right ear */}
        <mesh position={[0.14, 0.82, 0.3]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[0.1, 0.15, 0.08]} />
          <meshToonMaterial color={bodyColor} />
        </mesh>
        {/* Inner ears */}
        <mesh position={[-0.14, 0.82, 0.33]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.06, 0.1, 0.02]} />
          <meshToonMaterial color="#FFB6C1" />
        </mesh>
        <mesh position={[0.14, 0.82, 0.33]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.06, 0.1, 0.02]} />
          <meshToonMaterial color="#FFB6C1" />
        </mesh>
      </group>

      {/* Legs */}
      <mesh ref={legFLRef} position={[-0.15, 0.1, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh ref={legFRRef} position={[0.15, 0.1, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh ref={legBLRef} position={[-0.15, 0.1, -0.2]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh ref={legBRRef} position={[0.15, 0.1, -0.2]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>

      {/* Tail */}
      <mesh ref={tailRef} position={[0, 0.45, -0.45]} rotation={[0.8, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.5, 5]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>

      {/* Star glow effect */}
      {starVisual && starVisual.visual !== 'none' && (
        <pointLight
          position={[0, 0.8, 0]}
          intensity={cat.stars * 0.15}
          color={realm.color}
          distance={2}
        />
      )}

      {/* Happiness indicator (small heart above head when happy) */}
      {cat.happiness > 80 && (
        <mesh position={[0, 1.1, 0.3]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#FF69B4" />
        </mesh>
      )}
    </group>
  );
}
