/**
 * CatinoPanel — gambling den (wuxia reskin).
 * Three sub-games: Slots / Goose Race / Wheel of Fortune.
 */

'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import {
  RACE_GEESE,
  WHEEL_SEGMENTS,
  type SlotResult,
  type RaceResult,
  type WheelResult,
} from '@/engine/systems/meta/catino-system';

const SYMBOL_EMOJI: Record<string, string> = {
  cat: '🐱', snoot: '👃', fish: '🐟', yarn: '🧶', goose: '🦢', star: '⭐',
};

export default function CatinoPanel() {
  const bp = useGameStore((s) => s.currencies.bp);
  const [tab, setTab] = useState<'slots' | 'race' | 'wheel'>('slots');
  const [, refreshPanel] = useState(0);
  const stats = engine.catino.stats;
  const refresh = () => refreshPanel((n) => n + 1);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: '#8B0000', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>賭</span>
        </div>
        <div>
          <div className="h-section">Cat-ino</div>
          <div className="h-eyebrow">A discipline of luck — gambled {formatNumber(stats.totalGambled)} bp lifetime</div>
        </div>
      </div>

      <div className="flex gap-0 mb-4 border-b" style={{ borderColor: 'var(--rule)' }}>
        {([['slots', 'Slots'], ['race', 'Goose Race'], ['wheel', 'Wheel of Fortune']] as const).map(([id, label]) => {
          const a = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="font-display text-[11px] tracking-[0.16em] uppercase px-4 py-2 cursor-pointer"
              style={{
                color: a ? 'var(--vermillion-bright)' : 'var(--ink-mute)',
                borderBottom: `2px solid ${a ? 'var(--vermillion)' : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === 'slots' && <Slots bp={bp} onChange={refresh} />}
      {tab === 'race' && <Race bp={bp} onChange={refresh} />}
      {tab === 'wheel' && <Wheel bp={bp} onChange={refresh} />}

      {/* Lifetime stats footer */}
      <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--rule)' }}>
        <div className="flex justify-between font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>
          <span>gambled · {formatNumber(stats.totalGambled)}</span>
          <span>won · <span style={{ color: 'var(--jade-bright)' }}>{formatNumber(stats.totalWon)}</span></span>
          <span>net · <span style={{ color: stats.totalWon - stats.totalLost >= 0 ? 'var(--jade-bright)' : 'var(--vermillion-bright)' }}>{formatNumber(stats.totalWon - stats.totalLost)}</span></span>
        </div>
      </div>
    </div>
  );
}

// ─── Slots ─────────────────────────────────────────────────

function Slots({ bp, onChange }: { bp: number; onChange: () => void }) {
  const [bet, setBet] = useState(100);
  const [result, setResult] = useState<SlotResult | null>(null);
  const [spinning, setSpinning] = useState(false);

  const presets = [100, 500, 1000, 5000, 25000];

  function spin() {
    const r = engine.playSlots(bet);
    if (r) {
      onChange();
      setSpinning(true);
      setTimeout(() => {
        setResult(r);
        setSpinning(false);
      }, 400);
    }
  }

  return (
    <div>
      {/* Bet picker */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {presets.map((p) => {
          const active = bet === p;
          return (
            <button
              key={p}
              onClick={() => setBet(p)}
              className="font-display text-[10px] tracking-[0.10em] uppercase px-3 py-1.5 cursor-pointer"
              style={{
                background: active ? 'rgba(214,91,64,0.16)' : 'rgba(0,0,0,0.3)',
                border: `1px solid ${active ? 'var(--vermillion)' : 'var(--rule)'}`,
                color: active ? 'var(--vermillion-bright)' : 'var(--ink-mute)',
                borderRadius: 1,
              }}
            >
              {formatNumber(p)}
            </button>
          );
        })}
        <button
          onClick={() => setBet(bp)}
          className="font-display text-[10px] tracking-[0.10em] uppercase px-3 py-1.5 cursor-pointer"
          style={{
            background: 'rgba(214,91,64,0.16)',
            border: '1px solid var(--vermillion)',
            color: 'var(--vermillion-bright)',
            borderRadius: 1,
          }}
        >
          MAX
        </button>
      </div>

      {/* Reels */}
      <div
        className="flex justify-center gap-4 mb-4 py-6 panel"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(214,91,64,0.08), rgba(0,0,0,0.5) 80%)',
          border: '1px solid var(--vermillion-bright)',
        }}
      >
        {(result?.reels ?? ['cat', 'cat', 'cat']).map((sym, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{
              width: 56, height: 56, fontSize: 28,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid var(--gold-deep)',
              opacity: spinning ? 0.3 : 1,
              transition: 'opacity 200ms ease-out',
            }}
          >
            {spinning ? '?' : SYMBOL_EMOJI[sym] ?? sym}
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary w-full mb-3"
        style={{ borderColor: 'var(--vermillion-bright)', background: 'linear-gradient(180deg, rgba(214,91,64,0.36), rgba(91,30,20,0.24))', color: 'var(--vermillion-bright)' }}
        disabled={bet <= 0 || bp < bet || spinning}
        onClick={spin}
      >
        SPIN · {formatNumber(bet)} bp
      </button>

      {result && !spinning && (
        <div className="panel p-3 text-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          {result.isTriple ? (
            <div className="font-display text-[14px] tracking-[0.16em] gold-text uppercase">🎉 TRIPLE · ×{result.multiplier}</div>
          ) : result.isPair ? (
            <div className="font-display text-[12px] tracking-[0.16em] uppercase" style={{ color: 'var(--jade-bright)' }}>PAIR · ×{result.multiplier}</div>
          ) : (
            <div className="font-mono text-[11px]" style={{ color: 'var(--ink-dim)' }}>miss</div>
          )}
          <div className="font-mono text-[11px] mt-1" style={{ color: result.netGain >= 0 ? 'var(--jade-bright)' : 'var(--vermillion-bright)' }}>
            {result.netGain >= 0 ? '+' : ''}{formatNumber(result.netGain)} bp
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Goose Race ────────────────────────────────────────────

function Race({ bp, onChange }: { bp: number; onChange: () => void }) {
  const [bets, setBets] = useState<Record<string, number>>({});
  const [result, setResult] = useState<RaceResult | null>(null);
  const totalBet = Object.values(bets).reduce((s, v) => s + v, 0);
  const canRace = totalBet > 0 && bp >= totalBet;

  function go() {
    const r = engine.startGooseRace(bets);
    if (r) {
      setResult(r);
      onChange();
    }
  }

  return (
    <div>
      <div className="h-eyebrow mb-2">Place your bets</div>
      <div className="flex flex-col gap-2 mb-4">
        {RACE_GEESE.map((g) => (
          <div key={g.id} className="flex items-center gap-3 p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--rule)' }}>
            <div className="rune flex-shrink-0" style={{ width: 36, height: 36, fontSize: 16, background: 'rgba(245,245,245,0.2)', border: '1px solid rgba(245,245,245,0.5)', color: '#fff7df' }}>
              鵝
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>{g.name}</div>
              <div className="h-eyebrow">odds · {g.odds}:1</div>
            </div>
            <input
              type="number"
              min={0}
              value={bets[g.id] ?? 0}
              onChange={(e) => setBets({ ...bets, [g.id]: Math.max(0, Number(e.target.value)) })}
              className="w-24 font-mono text-[11px] px-2 py-1.5 text-right"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--rule)', color: 'var(--gold-bright)', borderRadius: 1 }}
            />
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary w-full mb-3"
        style={{ borderColor: 'var(--vermillion-bright)', background: 'linear-gradient(180deg, rgba(214,91,64,0.36), rgba(91,30,20,0.24))', color: 'var(--vermillion-bright)' }}
        disabled={!canRace}
        onClick={go}
      >
        Start Race · {formatNumber(totalBet)} bp
      </button>

      {result && (
        <div className="panel p-3 text-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="font-display text-[12px] tracking-[0.16em] gold-text">🦢 Winner · {result.winnerName}</div>
          <div className="font-mono text-[11px] mt-1" style={{ color: result.netGain >= 0 ? 'var(--jade-bright)' : 'var(--vermillion-bright)' }}>
            {result.netGain >= 0 ? '+' : ''}{formatNumber(result.netGain)} bp
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Wheel ─────────────────────────────────────────────────

function Wheel({ bp, onChange }: { bp: number; onChange: () => void }) {
  const [result, setResult] = useState<WheelResult | null>(null);
  const [, force] = useState(0);
  const cost = 10000;
  const freeSpins = engine.catino.getFreeWheelSpins();
  const canSpin = freeSpins > 0 || bp >= cost;
  const activeEffects = engine.catino.getActiveEffectDescriptions();

  function go() {
    const r = engine.spinWheel();
    if (r) {
      setResult(r);
      force((n) => n + 1);
      onChange();
    }
  }

  return (
    <div>
      <div className="panel p-3 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-eyebrow mb-2">Wheel Segments</div>
        <div className="grid grid-cols-2 gap-1">
          {WHEEL_SEGMENTS.map((seg) => (
            <div key={seg.id} className="font-mono text-[10px] px-2 py-1" style={{ color: 'var(--ink-mute)' }}>
              · {seg.name}
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn btn-primary w-full mb-3"
        style={{ borderColor: 'var(--gold-bright)' }}
        disabled={!canSpin}
        onClick={go}
      >
        {freeSpins > 0 ? `Spin Wheel - free (${freeSpins})` : `Spin Wheel - ${formatNumber(cost)} bp`}
      </button>

      {result && (
        <div className="panel panel-elite p-3 text-center mb-3">
          <div className="font-display text-[14px] tracking-[0.16em] gold-text">{result.segmentName}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--ink-mute)' }}>{result.effect.description}</div>
        </div>
      )}

      {activeEffects.length > 0 && (
        <div className="panel p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="h-eyebrow mb-1">Active Effects</div>
          {activeEffects.map((d, i) => (
            <div key={i} className="font-mono text-[11px]" style={{ color: 'var(--jade-bright)' }}>✦ {d}</div>
          ))}
        </div>
      )}
    </div>
  );
}
