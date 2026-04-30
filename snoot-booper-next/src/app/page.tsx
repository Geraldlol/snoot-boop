'use client';

import dynamic from 'next/dynamic';

const GameApp = dynamic(() => import('@/components/screens/GameApp'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--bg-0)' }}>
      <div
        className="w-16 h-16 mb-6 flex items-center justify-center font-display text-3xl font-black"
        style={{
          color: '#fff7df',
          textShadow: '0 0 18px rgba(255,225,170,0.8)',
          background: 'radial-gradient(circle at 35% 30%, rgba(255,225,170,0.5), rgba(120,80,30,0.6) 60%, rgba(0,0,0,0.4))',
          border: '1px solid var(--gold)',
          boxShadow: '0 0 32px rgba(230,194,117,0.5), inset 0 1px 0 rgba(255,225,170,0.4)',
          borderRadius: 2,
          animation: 'orbBreath 4s ease-in-out infinite',
        }}
      >
        鼻
      </div>
      <p className="font-display text-sm tracking-[0.32em] uppercase gold-text">The Sect Awakens</p>
      <p className="font-mono text-[10px] mt-2" style={{ color: 'var(--ink-dim)', letterSpacing: '0.24em' }}>
        loading celestial snoot scriptures...
      </p>
    </div>
  ),
});

export default function Home() {
  return <GameApp />;
}
