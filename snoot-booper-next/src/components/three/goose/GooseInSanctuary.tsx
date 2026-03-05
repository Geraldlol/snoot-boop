/**
 * GooseInSanctuary - Renders the active goose (if any) in the 3D scene.
 * Reads from useGameStore which gets activeGoose from engine patches.
 */

'use client';

import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import Goose3D from './Goose3D';

export default function GooseInSanctuary() {
  const activeGoose = useGameStore((s) => s.activeGoose);

  if (!activeGoose) return null;

  const handleClick = () => {
    engine.boopGoose();
  };

  return <Goose3D goose={activeGoose} onClick={handleClick} />;
}
