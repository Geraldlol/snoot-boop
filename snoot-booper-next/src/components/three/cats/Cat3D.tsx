/**
 * Cat3D - Procedural voxel cat with rounded shapes, whiskers, shiny eyes.
 * MeshToonMaterial for cel-shaded Wuxia look.
 * Realm tier adds glow effects. Divine cats get orbiting particles.
 * Supports 5 animation states: idle, sleeping, grooming, playing, loaf.
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
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

// Tail chain positions along a curved path
function getTailSegments(t: number, tailRotZ: number, tailRotBase: number): [number, number, number][] {
  const segments: [number, number, number][] = [];
  for (let i = 0; i < 5; i++) {
    const frac = i / 4;
    const y = 0.45 + frac * 0.35;
    const z = -0.45 - frac * 0.15;
    const sway = Math.sin(t * 2 + frac * 2) * tailRotZ * 0.3 * frac;
    const curve = Math.sin(frac * Math.PI * 0.5) * tailRotBase * 0.15;
    segments.push([sway, y + curve, z]);
  }
  return segments;
}

export default function Cat3D({ cat, position, onClick, selected, animState }: Cat3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const legFLRef = useRef<THREE.Mesh>(null);
  const legFRRef = useRef<THREE.Mesh>(null);
  const legBLRef = useRef<THREE.Mesh>(null);
  const legBRRef = useRef<THREE.Mesh>(null);
  const eyeScaleRef = useRef(1);
  const orbitRef = useRef(0);

  const realm = CAT_REALMS[cat.realm];
  const element = CAT_ELEMENTS[cat.element];
  const starVisual = STAR_BONUSES[cat.stars];

  const bodyColor = useMemo(() => element?.color ?? '#888888', [element]);
  const accentColor = useMemo(() => {
    const col = new THREE.Color(bodyColor);
    col.lerp(new THREE.Color('#ffffff'), 0.4);
    return '#' + col.getHexString();
  }, [bodyColor]);

  const glowIntensity = useMemo(() => {
    if (realm.order <= 2) return 0;
    return (realm.order - 2) * 0.15;
  }, [realm.order]);

  const isDivine = realm.order >= 4;

  const mode = animState?.mode ?? 'idle';
  const tp = animState?.transitionProgress ?? 1;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const phase = position[0];

    let scaleY = 1 + Math.sin(t * 2 + phase) * 0.02;
    let scaleX = 1;
    let bodyScaleX = 1;
    let tailRotZ = Math.sin(t * 3 + position[2]) * 0.4;
    let headRotY = 0;
    let headRotZ = cat.happiness > 70 ? Math.sin(t * 4 + phase) * 0.05 : 0;
    let targetEyeScaleY = 1;
    let legScale = 1;
    let posYOffset = 0;

    // Purr vibration when happy
    const purrOffset = cat.happiness > 70 ? Math.sin(t * 94) * 0.003 : 0;

    if (mode === 'sleeping') {
      const sleepBreath = 1 + Math.sin(t * 1 + phase) * 0.01;
      scaleY = lerp(scaleY, sleepBreath * 0.7, tp);
      targetEyeScaleY = lerp(1, 0, tp);
      tailRotZ = lerp(tailRotZ, Math.sin(t * 0.5 + position[2]) * 0.1, tp);
      headRotZ = lerp(headRotZ, 0, tp);
    } else if (mode === 'grooming') {
      headRotY = lerp(0, Math.sin(t * 2.5 + phase) * 0.5, tp);
      tailRotZ = lerp(tailRotZ, 0, tp);
      headRotZ = lerp(headRotZ, 0, tp);
    } else if (mode === 'playing') {
      tailRotZ = lerp(tailRotZ, Math.sin(t * 6 + position[2]) * 0.8, tp);
      posYOffset = lerp(0, Math.abs(Math.sin(t * 5 + phase)) * 0.12, tp);
      scaleY = lerp(scaleY, 1 + Math.sin(t * 3 + phase) * 0.03, tp);
    } else if (mode === 'loaf') {
      legScale = lerp(1, 0, tp);
      bodyScaleX = lerp(1, 1.2, tp);
      tailRotZ = lerp(tailRotZ, Math.sin(t * 1.5 + position[2]) * 0.1, tp);
      headRotZ = lerp(headRotZ, 0, tp);
    }

    // Smooth eye transition
    eyeScaleRef.current = THREE.MathUtils.lerp(eyeScaleRef.current, targetEyeScaleY, 0.1);

    groupRef.current.scale.y = scaleY;
    groupRef.current.scale.x = scaleX;
    groupRef.current.position.y = position[1] + posYOffset + purrOffset;

    if (bodyRef.current) bodyRef.current.scale.x = bodyScaleX;

    if (headRef.current) {
      headRef.current.rotation.y = headRotY;
      headRef.current.rotation.z = headRotZ;
    }

    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleRef.current;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleRef.current;

    if (legFLRef.current) legFLRef.current.scale.y = legScale;
    if (legFRRef.current) legFRRef.current.scale.y = legScale;
    if (legBLRef.current) legBLRef.current.scale.y = legScale;
    if (legBRRef.current) legBRRef.current.scale.y = legScale;

    // Divine orbit
    orbitRef.current = t;
  });

  const tailSegs = getTailSegments(0, 0.4, 0.8);

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* Selection ring */}
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.5, 0.6, 16]} />
          <meshBasicMaterial color="#50C878" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Body (rounded) */}
      <mesh ref={bodyRef} position={[0, 0.35, 0]} castShadow>
        <RoundedBox args={[0.5, 0.35, 0.7]} radius={0.08} smoothness={4}>
          <meshToonMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={glowIntensity} />
        </RoundedBox>
      </mesh>

      {/* Belly (lighter, rounded) */}
      <mesh position={[0, 0.25, 0]}>
        <RoundedBox args={[0.4, 0.15, 0.55]} radius={0.06} smoothness={4}>
          <meshToonMaterial color={accentColor} />
        </RoundedBox>
      </mesh>

      {/* Head */}
      <group ref={headRef}>
        <mesh position={[0, 0.6, 0.3]} castShadow>
          <RoundedBox args={[0.4, 0.35, 0.35]} radius={0.08} smoothness={4}>
            <meshToonMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={glowIntensity} />
          </RoundedBox>
        </mesh>

        {/* Snoot (pink nose area) */}
        <mesh position={[0, 0.53, 0.48]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshToonMaterial color="#FFB6C1" />
        </mesh>

        {/* Mouth — tiny line below nose */}
        <mesh position={[0, 0.50, 0.485]}>
          <cylinderGeometry args={[0.003, 0.003, 0.06, 4]} />
          <meshBasicMaterial color="#333" />
        </mesh>

        {/* Eyes — shiny spheres */}
        <mesh ref={leftEyeRef} position={[-0.1, 0.65, 0.48]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshPhysicalMaterial color="#111" roughness={0.1} metalness={0.3} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.1, 0.65, 0.48]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshPhysicalMaterial color="#111" roughness={0.1} metalness={0.3} />
        </mesh>
        {/* Eye highlights */}
        <mesh position={[-0.09, 0.66, 0.51]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.11, 0.66, 0.51]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Whiskers — 4 thin cylinders */}
        {/* Left whiskers */}
        <mesh position={[-0.12, 0.55, 0.47]} rotation={[0, 0.3, -0.1]}>
          <cylinderGeometry args={[0.005, 0.003, 0.15, 3]} />
          <meshBasicMaterial color="#ccc" transparent opacity={0.5} />
        </mesh>
        <mesh position={[-0.11, 0.53, 0.47]} rotation={[0, 0.2, 0.05]}>
          <cylinderGeometry args={[0.005, 0.003, 0.15, 3]} />
          <meshBasicMaterial color="#ccc" transparent opacity={0.5} />
        </mesh>
        {/* Right whiskers */}
        <mesh position={[0.12, 0.55, 0.47]} rotation={[0, -0.3, 0.1]}>
          <cylinderGeometry args={[0.005, 0.003, 0.15, 3]} />
          <meshBasicMaterial color="#ccc" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.11, 0.53, 0.47]} rotation={[0, -0.2, -0.05]}>
          <cylinderGeometry args={[0.005, 0.003, 0.15, 3]} />
          <meshBasicMaterial color="#ccc" transparent opacity={0.5} />
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
        {/* Ear tufts — tiny spheres at inner ear tips */}
        <mesh position={[-0.14, 0.89, 0.32]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshToonMaterial color={accentColor} />
        </mesh>
        <mesh position={[0.14, 0.89, 0.32]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshToonMaterial color={accentColor} />
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

      {/* Tail — chain of spheres for organic look */}
      {tailSegs.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.04 - i * 0.005, 6, 6]} />
          <meshToonMaterial color={bodyColor} />
        </mesh>
      ))}

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

      {/* Divine realm orbiting particles */}
      {isDivine && <DivineOrbitParticles color={realm.color} />}
    </group>
  );
}

// Small orbiting particles for divine cats
function DivineOrbitParticles({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const r = 0.6;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0.2 + Math.sin(angle * 2) * 0.1, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}
