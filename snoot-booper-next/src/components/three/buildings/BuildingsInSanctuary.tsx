/**
 * BuildingsInSanctuary - Reads building state from engine and renders Building3D components.
 */

'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/store/game-store';
import Building3D from './Building3D';

// Layout positions for buildings in the sanctuary (arranged in a semicircle)
const BUILDING_POSITIONS: [number, number, number][] = [
  [-8, 0, -6],
  [-5, 0, -8],
  [-2, 0, -9],
  [2, 0, -9],
  [5, 0, -8],
  [8, 0, -6],
  [-9, 0, -2],
  [9, 0, -2],
  [-9, 0, 2],
  [9, 0, 2],
  [-7, 0, 5],
  [7, 0, 5],
  [-4, 0, 7],
  [4, 0, 7],
];

export default function BuildingsInSanctuary() {
  const buildings = useGameStore((s) => s.buildings);

  const builtBuildings = useMemo(() => {
    if (!buildings) return [];
    return Object.entries(buildings)
      .filter(([, level]) => level > 0)
      .map(([id, level], i) => ({
        id,
        level,
        position: BUILDING_POSITIONS[i % BUILDING_POSITIONS.length],
      }));
  }, [buildings]);

  if (builtBuildings.length === 0) return null;

  return (
    <group>
      {builtBuildings.map((b) => (
        <Building3D key={b.id} buildingId={b.id} level={b.level} position={b.position} />
      ))}
    </group>
  );
}
