'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/ui-store';

const FALLBACK_LINES = [
  'All quiet on the mountain. The cats are loafing.',
  'A goose was spotted near the bamboo grove.',
  'The incense in the Inner Sanctum burns slow tonight.',
  'Mochi-chan brewed a fresh pot of jade tea for the guests.',
  'Something mewed in the dao garden. No cat present.',
];

/**
 * Sect Wire — single-line ticker that cycles recent notifications.
 * In Phase 2, the engine's notifications + custom event-bus events feed it.
 * For Phase 1, it pulls from the existing notification queue and falls back
 * to a small pool of flavor lines when the queue is empty.
 */
export default function SectTicker() {
  const notifications = useUIStore((s) => s.notifications);
  const [i, setI] = useState(0);

  const lines =
    notifications.length > 0
      ? notifications.slice(-6).map((n) => n.title || n.message)
      : FALLBACK_LINES;

  useEffect(() => {
    const id = setInterval(
      () => setI((x) => (x + 1) % Math.max(1, lines.length)),
      4400
    );
    return () => clearInterval(id);
  }, [lines.length]);

  return (
    <div
      className="hidden md:flex items-center gap-3 px-4 py-2 panel mb-4"
      style={{ height: 42 }}
      role="status"
      aria-live="polite"
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: 'var(--jade-bright)', boxShadow: '0 0 10px var(--jade-bright)' }}
      />
      <span className="h-eyebrow">Sect Wire</span>
      <span className="text-sm truncate flex-1" style={{ color: 'var(--ink)' }}>
        {lines[i] || 'All quiet on the mountain.'}
      </span>
    </div>
  );
}
