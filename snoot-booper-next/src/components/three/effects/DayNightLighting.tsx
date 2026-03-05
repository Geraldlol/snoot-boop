'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffectsStore } from '@/store/effects-store';

export default function DayNightLighting() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);

  const targetAmbientColor = useRef(new THREE.Color('#FFFBE6'));
  const currentAmbientColor = useRef(new THREE.Color('#FFFBE6'));

  useFrame(() => {
    const { skyAmbientColor, sunIntensity } = useEffectsStore.getState();

    targetAmbientColor.current.set(skyAmbientColor);

    // Lerp ambient color
    if (ambientRef.current) {
      currentAmbientColor.current.lerp(targetAmbientColor.current, 0.02);
      ambientRef.current.color.copy(currentAmbientColor.current);
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, 0.3 + sunIntensity * 0.3, 0.02);
    }

    // Lerp sun intensity
    if (sunRef.current) {
      sunRef.current.intensity = THREE.MathUtils.lerp(sunRef.current.intensity, sunIntensity * 1.2, 0.02);
    }

    // Fill light (jade glow) — brighter at night
    if (fillRef.current) {
      fillRef.current.intensity = THREE.MathUtils.lerp(fillRef.current.intensity, 0.1 + (1 - sunIntensity) * 0.4, 0.02);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.4} color="#c4a7e7" />
      <directionalLight
        ref={sunRef}
        position={[10, 15, 8]}
        intensity={1.2}
        color="#FFE4B5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <pointLight ref={fillRef} position={[0, 5, 0]} intensity={0.3} color="#50C878" />
    </>
  );
}
