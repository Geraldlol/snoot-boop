'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useEffectsStore } from '@/store/effects-store';
import * as THREE from 'three';
import { formatNumber } from '@/engine/big-number';

interface ParticleBurst {
  id: number;
  particles: { pos: THREE.Vector3; vel: THREE.Vector3; life: number }[];
  isCrit: boolean;
  startTime: number;
}

export default function BoopEffect3D() {
  const boopEffects = useEffectsStore((s) => s.boopEffects);
  const clearOld = useEffectsStore((s) => s.clearOldBoopEffects);
  const burstsRef = useRef<ParticleBurst[]>([]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  // Clean old effects periodically
  useEffect(() => {
    const interval = setInterval(clearOld, 1000);
    return () => clearInterval(interval);
  }, [clearOld]);

  // Spawn particle bursts for new effects
  const lastProcessed = useRef(0);
  useEffect(() => {
    for (const effect of boopEffects) {
      if (effect.id <= lastProcessed.current) continue;
      lastProcessed.current = effect.id;

      const count = effect.isCrit ? 10 : 6;
      const particles = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const speed = 1.5 + Math.random() * 2;
        particles.push({
          pos: new THREE.Vector3(effect.position[0], effect.position[1], effect.position[2]),
          vel: new THREE.Vector3(
            Math.cos(angle) * speed,
            2 + Math.random() * 3,
            Math.sin(angle) * speed
          ),
          life: 1.5,
        });
      }
      burstsRef.current.push({
        id: effect.id,
        particles,
        isCrit: effect.isCrit,
        startTime: Date.now(),
      });
    }
    // Cap bursts
    if (burstsRef.current.length > 10) {
      burstsRef.current = burstsRef.current.slice(-10);
    }
  }, [boopEffects]);

  // Animate particles
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    let idx = 0;
    const maxParticles = 100;

    // Update bursts
    burstsRef.current = burstsRef.current.filter((burst) => {
      let anyAlive = false;
      for (const p of burst.particles) {
        p.life -= delta;
        if (p.life <= 0) continue;
        anyAlive = true;

        p.vel.y -= 5 * delta; // gravity
        p.pos.x += p.vel.x * delta;
        p.pos.y += p.vel.y * delta;
        p.pos.z += p.vel.z * delta;

        if (idx < maxParticles) {
          const scale = p.life * 0.15;
          dummy.current.position.copy(p.pos);
          dummy.current.scale.setScalar(scale);
          dummy.current.updateMatrix();
          meshRef.current!.setMatrixAt(idx, dummy.current.matrix);
          idx++;
        }
      }
      return anyAlive;
    });

    // Hide unused instances
    for (let i = idx; i < maxParticles; i++) {
      dummy.current.position.set(0, -100, 0);
      dummy.current.scale.setScalar(0);
      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Particle burst mesh */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, 100]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00BFFF" transparent opacity={0.8} depthWrite={false} />
      </instancedMesh>

      {/* Floating text labels */}
      {boopEffects.slice(-5).map((effect) => (
        <FloatingText key={effect.id} effect={effect} />
      ))}
    </group>
  );
}

function FloatingText({ effect }: { effect: { id: number; position: [number, number, number]; bp: number; isCrit: boolean; timestamp: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const startY = effect.position[1] + 1.5;

  useFrame(() => {
    if (!groupRef.current) return;
    const elapsed = (Date.now() - effect.timestamp) / 1000;
    groupRef.current.position.y = startY + elapsed * 1.5;
    // Fade handled by CSS
  });

  const age = Date.now() - effect.timestamp;
  if (age > 1500) return null;

  return (
    <group ref={groupRef} position={[effect.position[0], startY, effect.position[2]]}>
      <Html center style={{ pointerEvents: 'none' }}>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: effect.isCrit ? '14px' : '10px',
            color: effect.isCrit ? '#FFD700' : '#00BFFF',
            textShadow: '1px 1px 2px #000, -1px -1px 2px #000',
            whiteSpace: 'nowrap',
            animation: 'fadeUp 1.5s ease-out forwards',
          }}
        >
          {effect.isCrit && '\u26A1'}+{formatNumber(effect.bp)} BP
        </div>
      </Html>
    </group>
  );
}
