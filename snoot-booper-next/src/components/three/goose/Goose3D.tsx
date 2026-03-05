/**
 * Goose3D - Procedural voxel goose rendered in the 3D sanctuary.
 * White body with orange beak and feet. Mood-based glow color.
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ActiveGoose } from '@/engine/systems/events/goose-system';
import { GOOSE_MOODS } from '@/engine/systems/events/goose-system';

interface Goose3DProps {
  goose: ActiveGoose;
  onClick?: () => void;
}

const MOOD_COLORS: Record<string, string> = {
  calm: '#87CEEB',
  suspicious: '#FFD700',
  aggressive: '#FF6347',
  rage: '#FF0000',
};

export default function Goose3D({ goose, onClick }: Goose3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const wobbleRef = useRef(0);

  const moodColor = useMemo(() => new THREE.Color(MOOD_COLORS[goose.mood] ?? '#FFFFFF'), [goose.mood]);
  const bodyColor = useMemo(() => new THREE.Color('#F5F5F5'), []);
  const beakColor = useMemo(() => new THREE.Color('#FF8C00'), []);

  // Convert goose 2D position (0-100) to 3D world coords
  const worldX = (goose.position.x / 100) * 30 - 15;
  const worldZ = (goose.position.y / 100) * 25 - 12;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Waddle animation
    wobbleRef.current += delta * 8;
    groupRef.current.rotation.z = Math.sin(wobbleRef.current) * 0.1;

    // Bob up and down
    groupRef.current.position.y = 0.8 + Math.sin(wobbleRef.current * 0.5) * 0.1;

    // Smooth move toward target position
    groupRef.current.position.x += (worldX - groupRef.current.position.x) * 0.05;
    groupRef.current.position.z += (worldZ - groupRef.current.position.z) * 0.05;
  });

  const isLegendary = goose.isLegendary;
  const emissive = isLegendary ? 0.3 : 0.1;

  return (
    <group ref={groupRef} position={[worldX, 0.8, worldZ]} onClick={onClick}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.8]} />
        <meshToonMaterial color={bodyColor} emissive={moodColor} emissiveIntensity={emissive} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.4, -0.2]} castShadow>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshToonMaterial color={bodyColor} emissive={moodColor} emissiveIntensity={emissive} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.7, -0.3]} castShadow>
        <boxGeometry args={[0.35, 0.3, 0.35]} />
        <meshToonMaterial color={bodyColor} emissive={moodColor} emissiveIntensity={emissive} />
      </mesh>

      {/* Beak */}
      <mesh position={[0, 0.65, -0.55]}>
        <boxGeometry args={[0.15, 0.08, 0.2]} />
        <meshToonMaterial color={beakColor} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.1, 0.75, -0.45]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 0.75, -0.45]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Left foot */}
      <mesh position={[-0.15, -0.3, 0.05]}>
        <boxGeometry args={[0.12, 0.05, 0.2]} />
        <meshToonMaterial color={beakColor} />
      </mesh>
      {/* Right foot */}
      <mesh position={[0.15, -0.3, 0.05]}>
        <boxGeometry args={[0.12, 0.05, 0.2]} />
        <meshToonMaterial color={beakColor} />
      </mesh>

      {/* Tail */}
      <mesh position={[0, 0.15, 0.45]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.15]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>

      {/* Mood glow ring */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 16]} />
        <meshBasicMaterial color={moodColor} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Legendary crown */}
      {isLegendary && (
        <mesh position={[0, 0.9, -0.3]}>
          <coneGeometry args={[0.12, 0.15, 4]} />
          <meshToonMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* Point light for mood */}
      <pointLight color={moodColor} intensity={isLegendary ? 2 : 0.5} distance={4} />
    </group>
  );
}
