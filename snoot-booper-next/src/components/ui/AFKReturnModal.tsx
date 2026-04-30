/**
 * AFKReturnModal — wuxia cinematic return.
 * Full-screen scrim with a center scroll showing time-away gains and events.
 */

'use client';

import { formatNumber } from '@/engine/big-number';
import { MASTERS } from '@/engine/data/masters';
import type { AFKGainsResult } from '@/engine/systems/core/idle-system';
import type { MasterId } from '@/engine/types';

interface AFKReturnModalProps {
  result: AFKGainsResult;
  masterId: MasterId;
  onCollect: () => void;
}

const TIER_TONES: Record<string, string> = {
  common:    'var(--ink-mute)',
  rare:      '#4169E1',
  legendary: 'var(--gold-bright)',
  special:   '#FF69B4',
};

const TIER_GLYPHS: Record<string, string> = {
  common: '·', rare: '✦', legendary: '✧', special: '⊕',
};

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function AFKReturnModal({ result, masterId, onCollect }: AFKReturnModalProps) {
  const master = MASTERS[masterId];
  const greeting = master?.quotes?.[0] ?? 'The path continues.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-back">
      <div
        className="panel panel-ornate panel-elite p-8 w-[480px] max-w-[92vw] max-h-[88vh] overflow-y-auto"
        style={{ borderColor: 'var(--gold-bright)' }}
      >
        {/* Hero */}
        <div className="text-center mb-5">
          <div
            className="rune mx-auto mb-3"
            style={{
              width: 80, height: 80, fontSize: 36,
              background: master
                ? `radial-gradient(circle at 35% 30%, ${master.color}77, ${master.color}33 60%, rgba(0,0,0,0.4))`
                : 'radial-gradient(circle at 35% 30%, rgba(255,225,170,0.6), rgba(120,80,30,0.4) 60%, rgba(0,0,0,0.4))',
              border: `1px solid ${master?.color ?? 'var(--gold-bright)'}`,
              color: '#fff7df',
              textShadow: `0 0 18px ${master?.color ?? 'rgba(255,225,170,0.8)'}`,
              animation: 'orbBreath 4s ease-in-out infinite',
            }}
          >
            道
          </div>
          <h2 className="font-display text-[20px] font-black tracking-[0.10em] gold-text">
            Welcome Back
          </h2>
          {master && (
            <p className="font-display text-[12px] tracking-[0.10em] uppercase mt-1" style={{ color: master.color }}>
              {master.name} · {master.title}
            </p>
          )}
          <p className="text-sm italic mt-3" style={{ color: 'var(--ink-mute)' }}>
            &ldquo;{greeting}&rdquo;
          </p>
          <div className="h-eyebrow mt-3">
            Away for · {formatDuration(result.timeAway)}
          </div>
        </div>

        {/* Gains */}
        <div className="panel p-4 mb-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="h-section text-center mb-3" style={{ fontSize: 11 }}>Cultivation Gains</div>
          <div className="flex justify-center gap-8">
            {result.pp > 0 && (
              <div className="text-center">
                <div className="font-display nums text-[28px] font-black" style={{ color: 'var(--gold-bright)', textShadow: '0 0 16px rgba(230,194,117,0.6)' }}>
                  +{formatNumber(result.pp)}
                </div>
                <div className="h-eyebrow">PP</div>
              </div>
            )}
            {result.bp > 0 && (
              <div className="text-center">
                <div className="font-display nums text-[28px] font-black" style={{ color: 'var(--jade-bright)', textShadow: '0 0 16px rgba(109,197,168,0.6)' }}>
                  +{formatNumber(result.bp)}
                </div>
                <div className="h-eyebrow">BP</div>
              </div>
            )}
          </div>
          {result.happinessDecay > 1 && (
            <p className="text-xs text-center mt-3" style={{ color: 'var(--vermillion-bright)' }}>
              Cat happiness decreased by {result.happinessDecay.toFixed(1)}% in your absence.
            </p>
          )}
        </div>

        {/* Events */}
        {result.events.length > 0 && (
          <div className="panel p-3 mb-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="h-eyebrow mb-2">Events · {result.events.length}</div>
            <div className="max-h-44 overflow-y-auto flex flex-col gap-1.5 pr-1">
              {result.events.map((evt, i) => {
                const tone = TIER_TONES[evt.event.tier] ?? 'var(--ink-mute)';
                const glyph = TIER_GLYPHS[evt.event.tier] ?? '·';
                const elite = evt.event.tier === 'legendary' || evt.event.tier === 'special';
                return (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-2 py-1.5"
                    style={{
                      background: elite ? 'rgba(255,225,170,0.06)' : 'transparent',
                      border: `1px solid ${elite ? 'rgba(230,194,117,0.3)' : 'transparent'}`,
                    }}
                  >
                    <span className="font-display text-[14px]" style={{ color: tone }}>{glyph}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-[11px] tracking-[0.06em]" style={{ color: tone }}>
                        {evt.event.name}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--ink-mute)' }}>{evt.event.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Collect button */}
        <button className="btn ascend-btn ready w-full" onClick={onCollect}>
          Collect Gains
        </button>
      </div>
    </div>
  );
}
