/**
 * Building3D - Procedural voxel buildings for the sanctuary.
 * Each building type has a unique shape. Level affects scale/glow.
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Building3DProps {
  buildingId: string;
  level: number;
  position: [number, number, number];
}

// Building visual configs
const BUILDING_VISUALS: Record<string, { color: string; accentColor: string; type: 'pagoda' | 'garden' | 'dojo' | 'vault' | 'tower' | 'house' }> = {
  cat_pagoda:       { color: '#DC143C', accentColor: '#FFD700', type: 'pagoda' },
  meditation_garden: { color: '#50C878', accentColor: '#C4A7E7', type: 'garden' },
  training_dojo:    { color: '#8B4513', accentColor: '#FF8C00', type: 'dojo' },
  treasury_vault:   { color: '#FFD700', accentColor: '#8B4513', type: 'vault' },
  alchemy_lab:      { color: '#9370DB', accentColor: '#00CED1', type: 'house' },
  library:          { color: '#4169E1', accentColor: '#FFD700', type: 'pagoda' },
  spirit_mine:      { color: '#708090', accentColor: '#87CEEB', type: 'vault' },
  waifu_quarters:   { color: '#FFB6C1', accentColor: '#FF69B4', type: 'house' },
  hot_springs:      { color: '#00CED1', accentColor: '#F5F5F5', type: 'garden' },
  celestial_kitchen: { color: '#FF8C00', accentColor: '#E94560', type: 'house' },
  goose_watchtower: { color: '#F5F5F5', accentColor: '#FFD700', type: 'tower' },
  observatory:      { color: '#483D8B', accentColor: '#C4A7E7', type: 'tower' },
  hall_of_legends:  { color: '#FFD700', accentColor: '#DC143C', type: 'pagoda' },
  pagoda_entrance:  { color: '#DC143C', accentColor: '#FFD700', type: 'pagoda' },
};

function easeOutBounce(x: number): number {
  if (x < 1 / 2.75) return 7.5625 * x * x;
  if (x < 2 / 2.75) { x -= 1.5 / 2.75; return 7.5625 * x * x + 0.75; }
  if (x < 2.5 / 2.75) { x -= 2.25 / 2.75; return 7.5625 * x * x + 0.9375; }
  x -= 2.625 / 2.75;
  return 7.5625 * x * x + 0.984375;
}

export default function Building3D({ buildingId, level, position }: Building3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const constructionProgress = useRef(0);
  const visual = BUILDING_VISUALS[buildingId] ?? { color: '#888', accentColor: '#FFF', type: 'house' as const };
  const scale = 0.8 + level * 0.05;
  const baseEmissive = Math.min(0.4, level * 0.04);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    // Construction pop animation (scale up over 1 second on mount)
    if (constructionProgress.current < 1) {
      constructionProgress.current = Math.min(1, constructionProgress.current + delta);
    }
    const constructionScale = constructionProgress.current < 1
      ? easeOutBounce(constructionProgress.current)
      : 1;
    groupRef.current.scale.y = constructionScale * scale;

    // Gentle bob for higher-level buildings
    groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5 + position[0]) * 0.02 * level;

    // Enhanced glow pulse on building materials
    const glowPulse = Math.sin(clock.elapsedTime * 2) * 0.05 * level;
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material;
        if (mat && 'emissiveIntensity' in mat && (mat as THREE.MeshToonMaterial).emissiveIntensity !== undefined) {
          const toonMat = mat as THREE.MeshToonMaterial;
          // Only pulse materials that already have emissive set (not zero-emissive accent pieces)
          if (toonMat.emissive && toonMat.emissive.r + toonMat.emissive.g + toonMat.emissive.b > 0) {
            toonMat.emissiveIntensity = Math.max(0, baseEmissive + glowPulse);
          }
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {visual.type === 'pagoda' && <PagodaModel color={visual.color} accent={visual.accentColor} level={level} emissive={baseEmissive} />}
      {visual.type === 'garden' && <GardenModel color={visual.color} accent={visual.accentColor} emissive={baseEmissive} />}
      {visual.type === 'dojo' && <DojoModel color={visual.color} accent={visual.accentColor} emissive={baseEmissive} />}
      {visual.type === 'vault' && <VaultModel color={visual.color} accent={visual.accentColor} emissive={baseEmissive} />}
      {visual.type === 'tower' && <TowerModel color={visual.color} accent={visual.accentColor} level={level} emissive={baseEmissive} />}
      {visual.type === 'house' && <HouseModel color={visual.color} accent={visual.accentColor} emissive={baseEmissive} />}
      {/* Level glow */}
      {level >= 5 && <pointLight intensity={0.3} color={visual.accentColor} distance={3} position={[0, 2, 0]} />}
    </group>
  );
}

// ─── Building Models ──────────────────────────────────────

function PagodaModel({ color, accent, level, emissive }: { color: string; accent: string; level: number; emissive: number }) {
  const tiers = Math.min(3, 1 + Math.floor(level / 3));
  return (
    <group>
      {/* Base platform */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.4, 0.2, 1.4]} />
        <meshToonMaterial color="#696969" />
      </mesh>
      {/* Tiers */}
      {Array.from({ length: tiers }).map((_, i) => (
        <group key={i} position={[0, 0.2 + i * 0.8, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2 - i * 0.25, 0.6, 1.2 - i * 0.25]} />
            <meshToonMaterial color={color} emissive={color} emissiveIntensity={emissive} />
          </mesh>
          {/* Roof */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.4 - i * 0.25, 0.1, 1.4 - i * 0.25]} />
            <meshToonMaterial color={accent} />
          </mesh>
        </group>
      ))}
      {/* Spire */}
      <mesh position={[0, 0.2 + tiers * 0.8 + 0.3, 0]} castShadow>
        <coneGeometry args={[0.1, 0.6, 4]} />
        <meshToonMaterial color={accent} emissive={accent} emissiveIntensity={emissive * 2} />
      </mesh>
    </group>
  );
}

function GardenModel({ color, accent, emissive }: { color: string; accent: string; emissive: number }) {
  return (
    <group>
      {/* Stone border */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.0, 8]} />
        <meshToonMaterial color="#696969" />
      </mesh>
      {/* Garden bed */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 8]} />
        <meshToonMaterial color="#3d6b35" />
      </mesh>
      {/* Small bushes */}
      {[[-0.3, 0, -0.3], [0.3, 0, 0.3], [0.3, 0, -0.3]].map(([x, _, z], i) => (
        <mesh key={i} position={[x!, 0.25, z!]} castShadow>
          <sphereGeometry args={[0.2, 6, 5]} />
          <meshToonMaterial color={color} emissive={color} emissiveIntensity={emissive} />
        </mesh>
      ))}
      {/* Spirit crystal */}
      <mesh position={[0, 0.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <octahedronGeometry args={[0.15]} />
        <meshToonMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function DojoModel({ color, accent, emissive }: { color: string; accent: string; emissive: number }) {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.6, 0.1, 1.2]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Pillars */}
      {[[-0.7, 0, -0.5], [0.7, 0, -0.5], [-0.7, 0, 0.5], [0.7, 0, 0.5]].map(([x, _, z], i) => (
        <mesh key={i} position={[x!, 0.5, z!]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.9, 6]} />
          <meshToonMaterial color={accent} />
        </mesh>
      ))}
      {/* Roof */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.1, 1.4]} />
        <meshToonMaterial color={color} emissive={color} emissiveIntensity={emissive} />
      </mesh>
    </group>
  );
}

function VaultModel({ color, accent, emissive }: { color: string; accent: string; emissive: number }) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.0, 0.8, 0.8]} />
        <meshToonMaterial color="#555" />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.35, 0.41]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.02]} />
        <meshToonMaterial color={color} emissive={color} emissiveIntensity={emissive} />
      </mesh>
      {/* Lock */}
      <mesh position={[0, 0.4, 0.43]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshToonMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function TowerModel({ color, accent, level, emissive }: { color: string; accent: string; level: number; emissive: number }) {
  const height = 1.2 + level * 0.15;
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.3, 6]} />
        <meshToonMaterial color="#696969" />
      </mesh>
      {/* Tower body */}
      <mesh position={[0, height / 2 + 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, height, 6]} />
        <meshToonMaterial color={color} emissive={color} emissiveIntensity={emissive} />
      </mesh>
      {/* Top platform */}
      <mesh position={[0, height + 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.35, 0.15, 6]} />
        <meshToonMaterial color={accent} />
      </mesh>
      {/* Beacon */}
      <pointLight position={[0, height + 0.5, 0]} intensity={0.4} color={accent} distance={5} />
    </group>
  );
}

function HouseModel({ color, accent, emissive }: { color: string; accent: string; emissive: number }) {
  return (
    <group>
      {/* Walls */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.0, 0.8, 0.8]} />
        <meshToonMaterial color={color} emissive={color} emissiveIntensity={emissive} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.95, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.75, 0.4, 4]} />
        <meshToonMaterial color={accent} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.25, 0.41]}>
        <boxGeometry args={[0.25, 0.4, 0.02]} />
        <meshToonMaterial color="#5D3A1A" />
      </mesh>
    </group>
  );
}
