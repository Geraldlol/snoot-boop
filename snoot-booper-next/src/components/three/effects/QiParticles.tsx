'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 60;
const _dummy = new THREE.Object3D();

interface QiParticle {
  pos: THREE.Vector3;
  speed: number;
  offset: number;
  size: number;
}

export default function QiParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const arr: QiParticle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 24,
          Math.random() * 8,
          (Math.random() - 0.5) * 16
        ),
        speed: 0.2 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        size: 0.03 + Math.random() * 0.04,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      // Float upward + gentle sway
      p.pos.y += p.speed * 0.01;
      const swayX = Math.sin(t * 0.5 + p.offset) * 0.01;
      const swayZ = Math.cos(t * 0.3 + p.offset) * 0.01;
      p.pos.x += swayX;
      p.pos.z += swayZ;

      // Respawn at bottom when too high
      if (p.pos.y > 10) {
        p.pos.y = -0.5;
        p.pos.x = (Math.random() - 0.5) * 24;
        p.pos.z = (Math.random() - 0.5) * 16;
      }

      const pulse = 1 + Math.sin(t * 2 + p.offset) * 0.3;
      _dummy.position.copy(p.pos);
      _dummy.scale.setScalar(p.size * pulse);
      _dummy.rotation.set(t * 0.5 + p.offset, t * 0.3, 0);
      _dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, _dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00BFFF" transparent opacity={0.35} depthWrite={false} />
    </instancedMesh>
  );
}
