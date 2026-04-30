'use client';

import { useState, useRef, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import { useGameStore } from '@/store/game-store';
import { useCatStore } from '@/store/cat-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';

interface Toast {
  id: string;
  x: number;
  y: number;
  text: string;
  crit: boolean;
}
interface Ripple {
  id: string;
  crit: boolean;
}
interface Spark {
  id: string;
  dx: number;
  dy: number;
  crit: boolean;
  ttlMs: number;
}

function rand(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * The Snoot Altar — primary boop ritual.
 * Renders the orb, rune circles, sigil orbits, click ripples, sparks, and floating BP pops.
 * Click anywhere to boop. Wired to engine.performBoop().
 *
 * Phase 1: visual + boop dispatch only. Phase 2 will hook combo provider, bark provider, and audio.
 */
export default function SnootAltar() {
  const altarRef = useRef<HTMLDivElement | null>(null);
  const modifiers = useGameStore((s) => s.modifiers);
  const boop = useGameStore((s) => s.boop);
  const bp = useGameStore((s) => s.currencies.bp);
  const catCount = useCatStore((s) => s.cats.length);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [orbFlash, setOrbFlash] = useState(false);
  const [shake, setShake] = useState(false);

  const onBoop = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const result = engine.performBoop();
    const { bp: burst, isCrit, combo } = result;

    // Forward as DOM event so future systems (barks, audio, combo HUD) can react without coupling.
    window.dispatchEvent(
      new CustomEvent('snoot:boop', { detail: { bp: burst, isCrit, combo } })
    );

    setOrbFlash(true);
    setTimeout(() => setOrbFlash(false), 280);

    if (isCrit) {
      setShake(true);
      setTimeout(() => setShake(false), 280);
    }

    const rect = altarRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left + (Math.random() * 40 - 20);
    const y = e.clientY - rect.top - 10;
    const id = rand();

    // Floating pop
    const text = `${isCrit ? '✦ ' : ''}+${formatNumber(burst)} BP${combo > 5 ? `  ×${combo}` : ''}`;
    setToasts((t) => [...t, { id, x, y, text, crit: isCrit }]);
    setTimeout(() => setToasts((t) => t.filter((p) => p.id !== id)), 1300);

    // Ripple
    const rid = rand();
    setRipples((r) => [...r, { id: rid, crit: isCrit }]);
    setTimeout(() => setRipples((r) => r.filter((p) => p.id !== rid)), 900);

    // Sparks
    const n = isCrit ? 22 : 10;
    const newSparks: Spark[] = [];
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const v = (isCrit ? 90 : 50) + Math.random() * (isCrit ? 80 : 40);
      newSparks.push({
        id: rand(),
        dx: Math.cos(a) * v,
        dy: Math.sin(a) * v - (isCrit ? 30 : 10),
        crit: isCrit,
        ttlMs: isCrit ? 1000 : 700,
      });
    }
    setSparks((s) => [...s, ...newSparks]);
    const ttl = isCrit ? 1000 : 700;
    setTimeout(() => {
      const ids = new Set(newSparks.map((s) => s.id));
      setSparks((s) => s.filter((p) => !ids.has(p.id)));
    }, ttl);
  }, []);

  const critChancePct = Math.min(
    100,
    Math.floor((boop.critChance + modifiers.critChanceBonus) * 100)
  );

  return (
    <div className={`grid grid-cols-12 gap-6 ${shake ? 'shake' : ''}`}>
      <div
        className="col-span-12 lg:col-span-12 panel panel-ornate panel-elite"
        style={{ minHeight: 620 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b" style={{ borderColor: 'var(--rule)' }}>
          <div className="flex items-center gap-3">
            <div
              className="glyph-badge"
              style={{ color: 'var(--gold-bright)', width: 38, height: 38 }}
            >
              <span style={{ fontSize: 16 }}>鼻</span>
            </div>
            <div>
              <div className="h-section">The Snoot Altar</div>
              <div className="h-eyebrow">Tap the orb to channel qi</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Mult label="boop ×" value={modifiers.bpMultiplier.toFixed(2)} />
            <Mult label="qi ×"   value={modifiers.ppMultiplier.toFixed(2)} />
            <Mult label="bond ×" value={modifiers.catHappinessMultiplier.toFixed(2)} />
            <Mult label="crit"   value={`${critChancePct}%`} />
          </div>
        </div>

        {/* Altar surface */}
        <div className="p-4 pt-3">
          <div
            ref={altarRef}
            className="altar"
            onClick={onBoop}
            role="button"
            aria-label="Boop the snoot"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                const rect = altarRef.current?.getBoundingClientRect();
                if (!rect) return;
                onBoop({
                  clientX: rect.left + rect.width / 2,
                  clientY: rect.top + rect.height * 0.54,
                } as ReactMouseEvent<HTMLDivElement>);
              }
            }}
          >
            <div className="altar-runes-3" />
            <div className="altar-runes-2" />
            <div className="altar-runes" />
            <div className="altar-rays" />
            <div className={`altar-orb ${orbFlash ? 'boop-flash' : ''}`} />
            <div className="altar-glyph">鼻</div>

            {/* Inner sigil ring */}
            <div className="sigil-orbit">
              <div className="sigil">道</div>
              <div className="sigil" style={{ left: 'auto', right: -8, top: '50%', transform: 'translateY(-50%)' }}>
                聚
              </div>
              <div className="sigil" style={{ left: '50%', top: 'auto', bottom: -8, transform: 'translateX(-50%)' }}>
                鳴
              </div>
              <div className="sigil" style={{ left: -8, top: '50%', transform: 'translateY(-50%)' }}>
                尾
              </div>
            </div>
            {/* Outer sigil ring */}
            <div className="sigil-orbit sigil-orbit-2">
              <div className="sigil" style={{ top: -10 }}>玄</div>
              <div className="sigil" style={{ left: 'auto', right: -10, top: '50%', transform: 'translateY(-50%)' }}>
                火
              </div>
              <div className="sigil" style={{ left: '50%', top: 'auto', bottom: -10, transform: 'translateX(-50%)' }}>
                霜
              </div>
              <div className="sigil" style={{ left: -10, top: '50%', transform: 'translateY(-50%)' }}>
                速
              </div>
            </div>

            {/* Ripples */}
            {ripples.map((r) => (
              <div key={r.id} className={`ripple ${r.crit ? 'crit' : ''}`} />
            ))}

            {/* Sparks */}
            {sparks.map((s) => (
              <div
                key={s.id}
                className={`spark ${s.crit ? 'crit' : ''}`}
                style={
                  {
                    left: '50%',
                    top: '54%',
                    '--dx': `${s.dx}px`,
                    '--dy': `${s.dy}px`,
                    animation: `sparkFly ${s.ttlMs}ms ease-out forwards`,
                  } as React.CSSProperties
                }
              />
            ))}

            {/* Floating pops */}
            {toasts.map((t) => (
              <div
                key={t.id}
                className={`pop ${t.crit ? 'crit' : ''}`}
                style={{ left: t.x, top: t.y }}
              >
                {t.text}
              </div>
            ))}

            <div className="altar-vignette" />

            {/* Footer readout */}
            <div className="absolute left-0 right-0 bottom-0 p-6 flex items-end justify-between pointer-events-none">
              <div>
                <div className="h-eyebrow mb-1">Channeled</div>
                <div
                  className="font-display text-[36px] font-black nums leading-none"
                  style={{ color: '#fff7df', textShadow: '0 0 22px rgba(230,194,117,0.6)' }}
                >
                  {formatNumber(bp)}{' '}
                  <span
                    className="text-base font-mono"
                    style={{ color: 'var(--ink-mute)' }}
                  >
                    bp
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="h-eyebrow mb-1">Disciples</div>
                <div
                  className="font-display text-[28px] font-black nums leading-none"
                  style={{ color: 'var(--jade-bright)', textShadow: '0 0 18px rgba(109,197,168,0.5)' }}
                >
                  {catCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mult({ label, value }: { label: string; value: string }) {
  return (
    <div className="leading-tight text-right">
      <div className="h-eyebrow">{label}</div>
      <div
        className="font-display nums text-[15px] font-bold"
        style={{ color: 'var(--gold-bright)' }}
      >
        {value}
      </div>
    </div>
  );
}
