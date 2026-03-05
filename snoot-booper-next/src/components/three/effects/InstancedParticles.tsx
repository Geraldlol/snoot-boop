'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  scale: number;
}

interface InstancedParticlesProps {
  count: number;
  size: number;
  color: string | THREE.Color;
  opacity?: number;
  initParticle: (particle: Particle, index: number) => void;
  updateParticle: (particle: Particle, delta: number, index: number) => boolean; // return false to respawn
}

const _dummy = new THREE.Object3D();

export default function InstancedParticles({ count, size, color, opacity = 1, initParticle, updateParticle }: InstancedParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const p: Particle = {
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
        scale: 1,
      };
      initParticle(p, i);
      arr.push(p);
    }
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const alive = updateParticle(p, delta, i);
      if (!alive) {
        initParticle(p, i);
      }

      _dummy.position.copy(p.position);
      _dummy.scale.setScalar(p.scale * (p.life / p.maxLife));
      _dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, _dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const materialColor = useMemo(() => (typeof color === 'string' ? new THREE.Color(color) : color), [color]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color={materialColor} transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  );
}
