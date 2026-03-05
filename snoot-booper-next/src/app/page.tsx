'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR for the game (Three.js, Zustand, etc.)
const GameApp = dynamic(() => import('@/components/screens/GameApp'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">🐱</div>
        <p className="text-[#50C878] font-mono text-sm">Loading the Celestial Snoot Sect...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <GameApp />;
}
