'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import {
  SLOT_SYMBOLS,
  RACE_GEESE,
  WHEEL_SEGMENTS,
  type SlotResult,
  type RaceResult,
  type WheelResult,
} from '@/engine/systems/meta/catino-system';

const COLOR = '#8B0000';

const SYMBOL_EMOJI: Record<string, string> = {
  cat: '🐱', snoot: '👃', fish: '🐟', yarn: '🧶', goose: '🦢', star: '⭐',
};

export default function CatinoPanel() {
  const bp = useGameStore((s) => s.currencies.bp);
  const [tab, setTab] = useState<'slots' | 'race' | 'wheel'>('slots');

  const stats = engine.catino.stats;

  return (
    <div>
      <h2 className="text-sm font-mono font-bold mb-3" style={{ color: '#E94560' }}>
        🎰 Cat-ino
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        {(['slots', 'race', 'wheel'] as const).map((t) => (
          <button
            key={t}
            className="text-xs font-mono px-3 py-1.5 rounded cursor-pointer capitalize"
            style={{
              backgroundColor: tab === t ? '#E9456030' : 'rgba(255,255,255,0.05)',
              color: tab === t ? '#E94560' : 'rgba(255,255,255,0.4)',
              borderBottom: tab === t ? '2px solid #E94560' : '2px solid transparent',
            }}
            onClick={() => setTab(t)}
          >
            {t === 'race' ? 'Goose Race' : t === 'wheel' ? 'Wheel' : 'Slots'}
          </button>
        ))}
      </div>

      {tab === 'slots' && <SlotsTab bp={bp} />}
      {tab === 'race' && <RaceTab bp={bp} />}
      {tab === 'wheel' && <WheelTab bp={bp} />}

      {/* Stats footer */}
      <div className="mt-3 pt-2 border-t border-white/5">
        <div className="flex justify-between text-[9px] font-mono text-white/50">
          <span>Gambled: {formatNumber(stats.totalGambled)}</span>
          <span>Won: {formatNumber(stats.totalWon)}</span>
          <span>Net: {formatNumber(stats.totalWon - stats.totalLost)}</span>
        </div>
      </div>
    </div>
  );
}

function SlotsTab({ bp }: { bp: number }) {
  const [bet, setBet] = useState(100);
  const [result, setResult] = useState<SlotResult | null>(null);
  const [spinning, setSpinning] = useState(false);

  const presets = [100, 500, 1000, 5000];

  const handleSpin = () => {
    const r = engine.playSlots(bet);
    if (r) {
      setSpinning(true);
      setTimeout(() => {
        setResult(r);
        setSpinning(false);
      }, 400);
    }
  };

  return (
    <div>
      {/* Bet presets */}
      <div className="flex gap-1 mb-3">
        {presets.map((p) => (
          <button
            key={p}
            className="text-[10px] font-mono px-2 py-1 rounded cursor-pointer"
            style={{
              backgroundColor: bet === p ? '#E9456020' : 'rgba(255,255,255,0.05)',
              color: bet === p ? '#E94560' : 'rgba(255,255,255,0.3)',
            }}
            onClick={() => setBet(p)}
          >
            {formatNumber(p)}
          </button>
        ))}
        <button
          className="text-[10px] font-mono px-2 py-1 rounded cursor-pointer"
          style={{
            backgroundColor: bet === bp ? '#E9456020' : 'rgba(255,255,255,0.05)',
            color: '#E94560',
          }}
          onClick={() => setBet(bp)}
        >
          Max
        </button>
      </div>

      {/* Reels */}
      <div className="flex justify-center gap-4 mb-3 py-4 bg-black/30 rounded-lg border border-white/5">
        {(result?.reels ?? ['cat', 'cat', 'cat']).map((sym, i) => (
          <div
            key={i}
            className="w-12 h-12 flex items-center justify-center text-2xl bg-black/40 rounded-lg border border-white/10"
            style={{ opacity: spinning ? 0.3 : 1 }}
          >
            {spinning ? '?' : SYMBOL_EMOJI[sym] ?? sym}
          </div>
        ))}
      </div>

      {/* Spin button */}
      <div className="text-center mb-3">
        <button
          className="text-xs font-mono px-6 py-2 rounded-lg font-bold cursor-pointer"
          style={{
            backgroundColor: bp >= bet ? '#E9456030' : 'rgba(255,255,255,0.05)',
            color: bp >= bet ? '#E94560' : 'rgba(255,255,255,0.2)',
            border: bp >= bet ? '1px solid #E9456050' : '1px solid transparent',
            cursor: bp >= bet ? 'pointer' : 'not-allowed',
          }}
          onClick={handleSpin}
          disabled={bp < bet || spinning}
        >
          SPIN ({formatNumber(bet)} BP)
        </button>
      </div>

      {/* Result */}
      {result && !spinning && (
        <div className="text-center p-2 rounded bg-black/20">
          {result.isTriple ? (
            <div className="text-[12px] font-mono font-bold text-[#FFD700]">
              🎉 TRIPLE! x{result.multiplier}
            </div>
          ) : result.isPair ? (
            <div className="text-[11px] font-mono font-bold text-[#50C878]">
              PAIR! x{result.multiplier}
            </div>
          ) : (
            <div className="text-xs font-mono text-white/40">Miss</div>
          )}
          <div className="text-[9px] font-mono" style={{ color: result.netGain >= 0 ? '#50C878' : '#E94560' }}>
            {result.netGain >= 0 ? '+' : ''}{formatNumber(result.netGain)} BP
          </div>
        </div>
      )}
    </div>
  );
}

function RaceTab({ bp }: { bp: number }) {
  const [bets, setBets] = useState<Record<string, number>>({});
  const [result, setResult] = useState<RaceResult | null>(null);

  const totalBet = Object.values(bets).reduce((s, v) => s + v, 0);

  const handleRace = () => {
    const r = engine.startGooseRace(bets);
    if (r) setResult(r);
  };

  return (
    <div>
      <div className="text-[9px] font-mono text-white/40 mb-2">Place your bets:</div>

      <div className="flex flex-col gap-1.5 mb-3">
        {RACE_GEESE.map((goose) => (
          <div key={goose.id} className="flex items-center gap-2 p-2 rounded bg-black/20 border border-white/5">
            <div className="flex-1">
              <div className="text-[9px] font-mono text-white/60">🦢 {goose.name}</div>
              <div className="text-[9px] font-mono text-white/50">Odds: {goose.odds}:1</div>
            </div>
            <input
              type="number"
              className="w-20 text-[9px] font-mono bg-black/30 border border-white/10 rounded px-2 py-1 text-white/70"
              min={0}
              value={bets[goose.id] ?? 0}
              onChange={(e) => setBets({ ...bets, [goose.id]: Math.max(0, Number(e.target.value)) })}
            />
          </div>
        ))}
      </div>

      <div className="text-center mb-3">
        <button
          className="text-xs font-mono px-6 py-2 rounded-lg font-bold"
          style={{
            backgroundColor: totalBet > 0 && bp >= totalBet ? '#E9456030' : 'rgba(255,255,255,0.05)',
            color: totalBet > 0 && bp >= totalBet ? '#E94560' : 'rgba(255,255,255,0.2)',
            cursor: totalBet > 0 && bp >= totalBet ? 'pointer' : 'not-allowed',
          }}
          onClick={handleRace}
        >
          Start Race ({formatNumber(totalBet)} BP)
        </button>
      </div>

      {result && (
        <div className="text-center p-2 rounded bg-black/20">
          <div className="text-[11px] font-mono font-bold text-[#FFD700] mb-1">
            🦢 Winner: {result.winnerName}!
          </div>
          <div className="text-[9px] font-mono" style={{ color: result.netGain >= 0 ? '#50C878' : '#E94560' }}>
            {result.netGain >= 0 ? '+' : ''}{formatNumber(result.netGain)} BP
          </div>
        </div>
      )}
    </div>
  );
}

function WheelTab({ bp }: { bp: number }) {
  const [result, setResult] = useState<WheelResult | null>(null);
  const [, forceUpdate] = useState(0);
  const cost = 10000;
  const canSpin = bp >= cost;
  const activeEffects = engine.catino.getActiveEffectDescriptions();

  const handleSpin = () => {
    const r = engine.spinWheel();
    if (r) {
      setResult(r);
      forceUpdate((n) => n + 1);
    }
  };

  return (
    <div>
      {/* Segments */}
      <div className="mb-3 p-2 rounded bg-black/20 border border-white/5">
        <div className="text-[10px] font-mono text-white/50 mb-1">Wheel Segments:</div>
        <div className="grid grid-cols-2 gap-0.5">
          {WHEEL_SEGMENTS.map((seg) => (
            <div key={seg.id} className="text-[9px] font-mono text-white/40 px-1">
              {seg.name}
            </div>
          ))}
        </div>
      </div>

      {/* Spin */}
      <div className="text-center mb-3">
        <button
          className="text-xs font-mono px-6 py-2 rounded-lg font-bold"
          style={{
            backgroundColor: canSpin ? '#E9456030' : 'rgba(255,255,255,0.05)',
            color: canSpin ? '#E94560' : 'rgba(255,255,255,0.2)',
            cursor: canSpin ? 'pointer' : 'not-allowed',
          }}
          onClick={handleSpin}
        >
          SPIN WHEEL ({formatNumber(cost)} BP)
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="text-center p-2 rounded bg-black/20 mb-3">
          <div className="text-[11px] font-mono font-bold text-[#FFD700]">
            {result.segmentName}
          </div>
          <div className="text-[10px] font-mono text-white/40">
            {result.effect.description}
          </div>
        </div>
      )}

      {/* Active effects */}
      {activeEffects.length > 0 && (
        <div className="p-2 rounded border border-white/5 bg-black/20">
          <div className="text-[10px] font-mono text-white/50 mb-1">Active Effects:</div>
          {activeEffects.map((desc, i) => (
            <div key={i} className="text-[10px] font-mono text-[#50C878]">{desc}</div>
          ))}
        </div>
      )}
    </div>
  );
}
