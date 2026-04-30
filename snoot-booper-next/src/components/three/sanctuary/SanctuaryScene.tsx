/**
 * SanctuaryScene - Base 3D world: ground, dynamic lighting, sky, decorations.
 * Voxel-Wuxia aesthetic using MeshToonMaterial.
 * Day/night cycle + seasonal effects driven by effects-store.
 * Includes fog, scattered rocks, fireflies at night, ambient dust motes.
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffectsStore } from '@/store/effects-store';
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
      {/* Fog for depth */}
      <fog attach="fog" args={['#1a2a1a', 15, 45]} />

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

      {/* Scattered rocks */}
      <ScatteredRocks />

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

      {/* Ambient dust motes */}
      <DustMotes />

      {/* Night fireflies */}
      <Fireflies />

      {/* Animated Sky */}
      <SkyDomeAnimated />
    </group>
  );
}

// ─── Ground ──────────────────────────────────────────────────

function Ground() {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshToonMaterial color="#2d5a27" />
      </mesh>
      {/* Slightly raised textured layer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.0, 0]}>
        <planeGeometry args={[38, 38]} />
        <meshToonMaterial color="#336b2c" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ─── Scattered Rocks ────────────────────────────────────────

function ScatteredRocks() {
  const rocks = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; rot: number }[] = [];
    const seed = [
      [-8, -5], [6, 3], [-4, 8], [10, -3], [-12, 1],
      [3, -8], [-7, 6], [9, 7],
    ];
    for (const [x, z] of seed) {
      arr.push({
        pos: [x, 0.1, z],
        scale: 0.1 + Math.abs(Math.sin(x * z)) * 0.2,
        rot: x + z,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.pos} rotation={[0, rock.rot, 0]} scale={rock.scale} castShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshToonMaterial color="#808080" />
        </mesh>
      ))}
    </group>
  );
}

// ─── Dust Motes ─────────────────────────────────────────────

const DUST_COUNT = 25;
const _dustDummy = new THREE.Object3D();

function DustMotes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    return Array.from({ length: DUST_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 6 + 0.5,
      z: (Math.random() - 0.5) * 14,
      speed: 0.05 + Math.random() * 0.1,
      offset: i * 0.73,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < DUST_COUNT; i++) {
      const p = particles[i];
      const y = p.y + Math.sin(t * p.speed + p.offset) * 0.5;
      const x = p.x + Math.sin(t * 0.2 + p.offset) * 0.3;
      _dustDummy.position.set(x, y, p.z);
      _dustDummy.scale.setScalar(0.02);
      _dustDummy.updateMatrix();
      meshRef.current.setMatrixAt(i, _dustDummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, DUST_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.15} depthWrite={false} />
    </instancedMesh>
  );
}

// ─── Fireflies (night only) ────────────────────────────────

function Fireflies() {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: 1 + Math.random() * 3,
      z: (Math.random() - 0.5) * 14,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const { sunIntensity } = useEffectsStore.getState();
    const isNight = sunIntensity < 0.3;
    const t = clock.elapsedTime;

    groupRef.current.children.forEach((child, i) => {
      const light = child as THREE.PointLight;
      const p = positions[i];
      light.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 2,
        p.y + Math.sin(t * p.speed * 0.7 + p.phase) * 0.5,
        p.z + Math.cos(t * p.speed * 0.5 + p.phase) * 2,
      );
      const targetIntensity = isNight ? 0.3 + Math.sin(t * 2 + p.phase) * 0.1 : 0;
      light.intensity = THREE.MathUtils.lerp(light.intensity, targetIntensity, 0.05);
    });
  });

  return (
    <group ref={groupRef}>
      {positions.map((_, i) => (
        <pointLight key={i} intensity={0} color="#FFFF88" distance={2} />
      ))}
    </group>
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
