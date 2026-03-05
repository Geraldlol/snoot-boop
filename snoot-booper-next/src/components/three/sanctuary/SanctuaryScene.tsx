/**
 * SanctuaryScene - Base 3D world: ground, dynamic lighting, sky, decorations.
 * Voxel-Wuxia aesthetic using MeshToonMaterial.
 * Day/night cycle + seasonal effects driven by effects-store.
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CatPopulation from '../cats/CatPopulation';
import GooseInSanctuary from '../goose/GooseInSanctuary';
import BuildingsInSanctuary from '../buildings/BuildingsInSanctuary';
import DayNightLighting from '../effects/DayNightLighting';
import SkyDomeAnimated from '../effects/SkyDomeAnimated';
import SeasonalEffects from '../effects/SeasonalEffects';
import QiParticles from '../effects/QiParticles';
import BoopEffect3D from '../effects/BoopEffect3D';
import ScreenShake from '../effects/ScreenShake';

export default function SanctuaryScene() {
  return (
    <group>
      {/* Dynamic Lighting */}
      <DayNightLighting />

      {/* Ground */}
      <Ground />

      {/* Decorations */}
      <StonePath />
      <Pond />
      <CherryTree position={[-6, 0, -4]} />
      <CherryTree position={[7, 0, -6]} scale={0.8} />
      <CherryTree position={[-3, 0, 5]} scale={1.1} />
      <Lantern position={[-2, 0, -2]} />
      <Lantern position={[2, 0, -2]} />

      {/* 3D Cats */}
      <CatPopulation />

      {/* Buildings */}
      <BuildingsInSanctuary />

      {/* Active Goose */}
      <GooseInSanctuary />

      {/* Effects */}
      <BoopEffect3D />
      <ScreenShake />
      <SeasonalEffects />
      <QiParticles />

      {/* Animated Sky */}
      <SkyDomeAnimated />
    </group>
  );
}

// ─── Ground ──────────────────────────────────────────────────

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshToonMaterial color="#2d5a27" />
    </mesh>
  );
}

// ─── Stone Path ──────────────────────────────────────────────

function StonePath() {
  const stones: [number, number, number][] = [];
  for (let i = -8; i <= 8; i += 1.2) {
    stones.push([i * 0.3, 0.02, i * 0.1 + Math.sin(i) * 0.3]);
  }

  return (
    <group>
      {stones.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[-Math.PI / 2, Math.random() * 0.3, 0]} receiveShadow>
          <circleGeometry args={[0.3 + Math.random() * 0.15, 6]} />
          <meshToonMaterial color="#8B8682" />
        </mesh>
      ))}
    </group>
  );
}

// ─── Pond ────────────────────────────────────────────────────

function Pond() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = -0.15 + Math.sin(clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group position={[5, 0, 2]}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 16]} />
        <meshToonMaterial color="#4169E1" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[2.3, 2.7, 16]} />
        <meshToonMaterial color="#696969" />
      </mesh>
    </group>
  );
}

// ─── Cherry Tree ─────────────────────────────────────────────

function CherryTree({ position = [0, 0, 0] as [number, number, number], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 2.4, 6]} />
        <meshToonMaterial color="#5D3A1A" />
      </mesh>
      <mesh position={[-0.4, 2.2, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 1, 5]} />
        <meshToonMaterial color="#5D3A1A" />
      </mesh>
      <mesh position={[0.3, 2.0, 0.2]} rotation={[0.2, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 0.8, 5]} />
        <meshToonMaterial color="#5D3A1A" />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshToonMaterial color="#FFB6C1" />
      </mesh>
      <mesh position={[-0.6, 2.5, 0.3]} castShadow>
        <sphereGeometry args={[0.7, 6, 5]} />
        <meshToonMaterial color="#FF69B4" />
      </mesh>
      <mesh position={[0.5, 2.4, -0.2]} castShadow>
        <sphereGeometry args={[0.6, 6, 5]} />
        <meshToonMaterial color="#FFB6C1" />
      </mesh>
    </group>
  );
}

// ─── Lantern ─────────────────────────────────────────────────

function Lantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 4]} />
        <meshToonMaterial color="#333" />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.3]} />
        <meshToonMaterial color="#E94560" emissive="#E94560" emissiveIntensity={0.3} />
      </mesh>
      <pointLight position={[0, 1.7, 0]} intensity={0.5} color="#E94560" distance={4} />
    </group>
  );
}
