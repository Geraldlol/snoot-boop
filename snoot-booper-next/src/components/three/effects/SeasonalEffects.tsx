'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffectsStore } from '@/store/effects-store';

const BOUNDS = { x: 20, y: 15, z: 20 };

interface SeasonParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rotSpeed: number;
  life: number;
}

const _dummy = new THREE.Object3D();

export default function SeasonalEffects() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const seasonRef = useRef('spring');
  const count = 250;

  const particles = useMemo(() => {
    const arr: SeasonParticle[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * BOUNDS.x * 2,
          Math.random() * BOUNDS.y,
          (Math.random() - 0.5) * BOUNDS.z * 2
        ),
        vel: new THREE.Vector3(0, -1, 0),
        rotSpeed: Math.random() * 2 - 1,
        life: Math.random(),
      });
    }
    return arr;
  }, [count]);

  const colorRef = useRef(new THREE.Color('#FFB6C1'));

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const season = useEffectsStore.getState().season;
    const sunIntensity = useEffectsStore.getState().sunIntensity;
    seasonRef.current = season;

    // Update color based on season
    const targetColor = season === 'spring' ? '#FFB6C1' :
      season === 'summer' ? '#FFFF66' :
      season === 'autumn' ? '#FF8C00' : '#FFFFFF';
    colorRef.current.lerp(new THREE.Color(targetColor), 0.02);
    (meshRef.current.material as THREE.MeshBasicMaterial).color.copy(colorRef.current);

    // Season-specific behavior
    const isFirefly = season === 'summer';
    const visibleCount = isFirefly ? (sunIntensity < 0.4 ? count : Math.floor(count * 0.2)) : count;

    for (let i = 0; i < count; i++) {
      const p = particles[i];

      if (i >= visibleCount) {
        _dummy.position.set(0, -100, 0);
        _dummy.scale.setScalar(0);
        _dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, _dummy.matrix);
        continue;
      }

      // Movement
      if (season === 'spring') {
        // Cherry blossom petals — sway side to side
        p.vel.set(
          Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.8,
          -0.5 - Math.random() * 0.3,
          Math.cos(state.clock.elapsedTime * 0.3 + i * 0.5) * 0.5
        );
      } else if (season === 'summer') {
        // Fireflies — erratic
        p.vel.set(
          Math.sin(state.clock.elapsedTime * 2 + i * 3) * 1.5,
          Math.sin(state.clock.elapsedTime * 1.5 + i * 2) * 0.5,
          Math.cos(state.clock.elapsedTime * 1.8 + i * 2.5) * 1.5
        );
      } else if (season === 'autumn') {
        // Tumbling leaves
        p.vel.set(
          Math.sin(state.clock.elapsedTime * 0.4 + i) * 1.2,
          -0.8 - Math.random() * 0.2,
          Math.cos(state.clock.elapsedTime * 0.35 + i * 0.7) * 0.6
        );
      } else {
        // Snow — gentle fall
        p.vel.set(
          Math.sin(state.clock.elapsedTime * 0.2 + i * 0.5) * 0.3,
          -0.4 - Math.random() * 0.2,
          Math.cos(state.clock.elapsedTime * 0.15 + i * 0.3) * 0.2
        );
      }

      p.pos.x += p.vel.x * delta;
      p.pos.y += p.vel.y * delta;
      p.pos.z += p.vel.z * delta;

      // Respawn at top when below ground
      if (p.pos.y < -1) {
        p.pos.y = BOUNDS.y;
        p.pos.x = (Math.random() - 0.5) * BOUNDS.x * 2;
        p.pos.z = (Math.random() - 0.5) * BOUNDS.z * 2;
      }

      // Wrap horizontally
      if (Math.abs(p.pos.x) > BOUNDS.x) p.pos.x *= -0.9;
      if (Math.abs(p.pos.z) > BOUNDS.z) p.pos.z *= -0.9;

      const size = isFirefly ? 0.03 + Math.sin(state.clock.elapsedTime * 5 + i) * 0.02 : 0.06;
      _dummy.position.copy(p.pos);
      _dummy.scale.setScalar(size);
      _dummy.rotation.set(
        p.rotSpeed * state.clock.elapsedTime,
        p.rotSpeed * state.clock.elapsedTime * 0.5,
        0
      );
      _dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, _dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#FFB6C1" transparent opacity={0.7} depthWrite={false} />
    </instancedMesh>
  );
}
