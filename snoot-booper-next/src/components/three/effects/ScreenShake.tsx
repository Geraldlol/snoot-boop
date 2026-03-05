'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffectsStore } from '@/store/effects-store';
import { useRef } from 'react';

export default function ScreenShake() {
  const { camera } = useThree();
  const basePosition = useRef({ x: camera.position.x, y: camera.position.y, z: camera.position.z });
  const shakeOffset = useRef({ x: 0, y: 0, z: 0 });
  const localIntensity = useRef(0);

  useFrame(() => {
    const storeIntensity = useEffectsStore.getState().shakeIntensity;

    // Pick up new shake triggers
    if (storeIntensity > localIntensity.current) {
      localIntensity.current = storeIntensity;
      // Reset store intensity
      useEffectsStore.setState({ shakeIntensity: 0 });
    }

    if (localIntensity.current > 0.001) {
      const maxOffset = Math.min(localIntensity.current, 0.3);
      shakeOffset.current.x = (Math.random() - 0.5) * 2 * maxOffset;
      shakeOffset.current.y = (Math.random() - 0.5) * 2 * maxOffset;
      shakeOffset.current.z = (Math.random() - 0.5) * 2 * maxOffset;

      camera.position.x += shakeOffset.current.x;
      camera.position.y += shakeOffset.current.y;
      camera.position.z += shakeOffset.current.z;

      // Decay
      localIntensity.current *= 0.9;
    }
  });

  return null;
}
