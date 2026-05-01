'use client';

/**
 * BarkToast — listens for snoot:boop, picks a random cat, shows a bark line.
 * Phase 2 ships a corner toast so we can hear the cats. Phase 3 adds a
 * cat-localized bubble inside the reskinned roster panel.
 */

import { useEffect, useRef, useState } from 'react';
import { useCatStore } from '@/store/cat-store';

const BARKS = ['nyo', 'mrrp', '*purr*', 'snoot!', 'hisss', 'beep?', 'mew', 'mraow', 'prrt', 'eep'];

interface Bark {
  id: string;
  name: string;
  line: string;
  isCrit: boolean;
}

export default function BarkToast() {
  const cats = useCatStore((s) => s.cats);
  const [barks, setBarks] = useState<Bark[]>([]);
  const lastBarkAtRef = useRef(0);

  useEffect(() => {
    function onBoop(e: Event) {
      const detail = (e as CustomEvent<{ isCrit?: boolean; combo?: number }>).detail ?? {};
      if (cats.length === 0) return;

      const now = Date.now();
      const isCrit = !!detail.isCrit;
      const isComboMilestone = !!detail.combo && detail.combo >= 25 && detail.combo % 25 === 0;
      if (!isCrit && !isComboMilestone) {
        if (now - lastBarkAtRef.current < 2800 || Math.random() > 0.18) return;
      } else if (now - lastBarkAtRef.current < 900) {
        return;
      }
      lastBarkAtRef.current = now;

      const cat = cats[Math.floor(Math.random() * cats.length)];
      const line = BARKS[Math.floor(Math.random() * BARKS.length)];
      const id = Math.random().toString(36).slice(2, 8);
      const bark: Bark = {
        id,
        name: cat.name,
        line: isCrit ? line.toUpperCase() + '!' : line,
        isCrit,
      };

      // Also notify any listening cat row component to flash itself.
      window.dispatchEvent(
        new CustomEvent('snoot:bark', { detail: { catInstanceId: cat.instanceId, line: bark.line, isCrit: bark.isCrit } })
      );

      setBarks((b) => [...b.slice(-1), bark]);
      setTimeout(() => {
        setBarks((b) => b.filter((p) => p.id !== id));
      }, 1200);
    }
    window.addEventListener('snoot:boop', onBoop);
    return () => window.removeEventListener('snoot:boop', onBoop);
  }, [cats]);

  if (barks.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-6 top-28 z-40 flex flex-col gap-1 items-end">
      {barks.map((b) => (
        <div
          key={b.id}
          className="panel px-3 py-1.5 text-[11px]"
          style={{
            color: b.isCrit ? 'var(--crit)' : 'var(--ink)',
            borderColor: b.isCrit ? 'var(--gold-bright)' : 'var(--rule)',
            animation: 'barkPop 1.2s ease-out forwards',
            transform: 'translateY(-100%)',
          }}
        >
          <span className="h-eyebrow mr-2" style={{ color: 'var(--ink-dim)' }}>
            {b.name}
          </span>
          <span className="font-display tracking-[0.10em]">&ldquo;{b.line}&rdquo;</span>
        </div>
      ))}
    </div>
  );
}
