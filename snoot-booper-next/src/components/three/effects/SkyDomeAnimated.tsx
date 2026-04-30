'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffectsStore } from '@/store/effects-store';

// Sky color presets by time of day
const SKY_COLORS: Record<string, { top: string; bottom: string }> = {
  morning: { top: '#87CEEB', bottom: '#FFD4A0' },
  afternoon: { top: '#4A90D9', bottom: '#87CEEB' },
  evening: { top: '#2C1654', bottom: '#FF6040' },
  night: { top: '#0a0a1e', bottom: '#1a1a3e' },
};

export default function SkyDomeAnimated() {
  const meshRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);
  const brightStarsRef = useRef<THREE.Points>(null);

  const currentTopColor = useRef(new THREE.Color('#4A90D9'));
  const currentBottomColor = useRef(new THREE.Color('#87CEEB'));

  // Create shader material for gradient
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color('#4A90D9') },
        bottomColor: { value: new THREE.Color('#87CEEB') },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          float t = max(0.0, h);
          gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
        }
      `,
    });
  }, []);

  // Star positions (regular + bright)
  const starGeometry = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      const r = 45;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // 3 bright stars
  const brightStarGeometry = useMemo(() => {
    const positions = new Float32Array(3 * 3);
    const angles = [0.5, 2.1, 4.3];
    for (let i = 0; i < 3; i++) {
      const theta = angles[i];
      const phi = 0.2 + i * 0.15;
      const r = 44;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const { timeOfDay, sunIntensity } = useEffectsStore.getState();
    const preset = SKY_COLORS[timeOfDay] ?? SKY_COLORS.afternoon;

    const targetTop = new THREE.Color(preset.top);
    const targetBottom = new THREE.Color(preset.bottom);

    currentTopColor.current.lerp(targetTop, 0.02);
    currentBottomColor.current.lerp(targetBottom, 0.02);

    material.uniforms.topColor.value.copy(currentTopColor.current);
    material.uniforms.bottomColor.value.copy(currentBottomColor.current);

    // Stars — gradual opacity based on sun
    const targetStarOpacity = sunIntensity < 0.5
      ? THREE.MathUtils.mapLinear(sunIntensity, 0.5, 0, 0, 0.8)
      : 0;

    if (starsRef.current) {
      const starMat = starsRef.current.material as THREE.PointsMaterial;
      starMat.opacity = THREE.MathUtils.lerp(starMat.opacity, targetStarOpacity, 0.02);
    }

    // Bright stars twinkle
    if (brightStarsRef.current) {
      const bMat = brightStarsRef.current.material as THREE.PointsMaterial;
      const twinkle = 0.6 + Math.sin(clock.elapsedTime * 3) * 0.2;
      bMat.opacity = THREE.MathUtils.lerp(bMat.opacity, targetStarOpacity * twinkle, 0.02);
    }
  });

  return (
    <>
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[50, 16, 16]} />
      </mesh>
      <points ref={starsRef} geometry={starGeometry}>
        <pointsMaterial color="#ffffff" size={0.3} transparent opacity={0} depthWrite={false} />
      </points>
      <points ref={brightStarsRef} geometry={brightStarGeometry}>
        <pointsMaterial color="#ffffcc" size={0.8} transparent opacity={0} depthWrite={false} />
      </points>
    </>
  );
}
