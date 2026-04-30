/**
 * Goose3D - Procedural voxel goose with improved shapes.
 * Rounded body, cone beak, wings, better waddle, booped reaction.
 */

'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { ActiveGoose } from '@/engine/systems/events/goose-system';

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
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const [boopFlash, setBoopFlash] = useState(0);

  const moodColor = useMemo(() => new THREE.Color(MOOD_COLORS[goose.mood] ?? '#FFFFFF'), [goose.mood]);
  const bodyColor = useMemo(() => new THREE.Color('#F5F5F5'), []);
  const beakColor = useMemo(() => new THREE.Color('#FF8C00'), []);

  const worldX = (goose.position.x / 100) * 30 - 15;
  const worldZ = (goose.position.y / 100) * 25 - 12;

  const handleClick = () => {
    setBoopFlash(1);
    onClick?.();
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    wobbleRef.current += delta * 8;
    const w = wobbleRef.current;

    // Body tilt waddle (Z-axis)
    groupRef.current.rotation.z = Math.sin(w) * 0.12;

    // Bob up and down
    groupRef.current.position.y = 0.8 + Math.sin(w * 0.5) * 0.1;

    // Smooth move toward target position
    groupRef.current.position.x += (worldX - groupRef.current.position.x) * 0.05;
    groupRef.current.position.z += (worldZ - groupRef.current.position.z) * 0.05;

    // Alternating leg movement
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(w) * 0.3;
      rightLegRef.current.rotation.x = Math.sin(w + Math.PI) * 0.3;
    }

    // Head bob forward/backward
    if (headGroupRef.current) {
      headGroupRef.current.position.z = -0.2 + Math.sin(w * 0.5) * 0.05;
    }

    // Wing flap (subtle)
    if (leftWingRef.current && rightWingRef.current) {
      const wingAngle = Math.sin(w * 0.7) * 0.1;
      leftWingRef.current.rotation.z = -0.2 + wingAngle;
      rightWingRef.current.rotation.z = 0.2 - wingAngle;
    }

    // Booped flash decay
    if (boopFlash > 0) {
      setBoopFlash((prev) => Math.max(0, prev - delta * 4));
    }
  });

  const isLegendary = goose.isLegendary;
  const emissive = isLegendary ? 0.3 : 0.1;
  const flashWhite = boopFlash > 0.5;

  return (
    <group ref={groupRef} position={[worldX, 0.8, worldZ]} onClick={handleClick}>
      {/* Body (rounded) */}
      <mesh position={[0, 0, 0]} castShadow>
        <RoundedBox args={[0.6, 0.5, 0.8]} radius={0.1} smoothness={4}>
          <meshToonMaterial
            color={flashWhite ? '#ffffff' : bodyColor}
            emissive={moodColor}
            emissiveIntensity={emissive + boopFlash * 0.5}
          />
        </RoundedBox>
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.4, -0.2]} castShadow>
        <RoundedBox args={[0.2, 0.5, 0.2]} radius={0.06} smoothness={4}>
          <meshToonMaterial color={bodyColor} emissive={moodColor} emissiveIntensity={emissive} />
        </RoundedBox>
      </mesh>

      {/* Head group */}
      <group ref={headGroupRef}>
        <mesh position={[0, 0.7, -0.3]} castShadow>
          <RoundedBox args={[0.35, 0.3, 0.35]} radius={0.08} smoothness={4}>
            <meshToonMaterial color={bodyColor} emissive={moodColor} emissiveIntensity={emissive} />
          </RoundedBox>
        </mesh>

        {/* Beak (cone) */}
        <mesh position={[0, 0.65, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.08, 0.25, 8]} />
          <meshToonMaterial color={beakColor} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.1, 0.75, -0.45]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0.1, 0.75, -0.45]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {/* Eye highlights */}
        <mesh position={[-0.09, 0.76, -0.47]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.11, 0.76, -0.47]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Wings */}
      <mesh ref={leftWingRef} position={[-0.35, 0.1, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh ref={rightWingRef} position={[0.35, 0.1, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>

      {/* Left foot (wider, flatter) */}
      <mesh ref={leftLegRef} position={[-0.15, -0.3, 0.05]}>
        <boxGeometry args={[0.15, 0.04, 0.25]} />
        <meshToonMaterial color={beakColor} />
      </mesh>
      {/* Right foot */}
      <mesh ref={rightLegRef} position={[0.15, -0.3, 0.05]}>
        <boxGeometry args={[0.15, 0.04, 0.25]} />
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
