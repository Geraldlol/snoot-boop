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

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const TIER_COLORS: Record<string, string> = {
  common: '#A0A0A0',
  rare: '#4169E1',
  legendary: '#FFD700',
  special: '#FF69B4',
};

const TIER_EMOJI: Record<string, string> = {
  common: '.',
  rare: '*',
  legendary: '!',
  special: '!!',
};

export default function AFKReturnModal({ result, masterId, onCollect }: AFKReturnModalProps) {
  const master = MASTERS[masterId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="w-[420px] max-h-[80vh] overflow-y-auto rounded-lg border p-6 space-y-4"
        style={{
          background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
          borderColor: 'rgba(255,255,255,0.15)',
          boxShadow: '0 0 40px rgba(80,200,120,0.15)',
        }}
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-mono font-bold text-[#50C878]">
            Welcome back, {master?.name ?? 'Cultivator'}!
          </h2>
          {master && (
            <p className="text-xs font-mono text-white/40">{master.title}</p>
          )}
          <p className="text-xs font-mono text-white/50">
            You were away for{' '}
            <span className="text-white/80">{formatDuration(result.timeAway)}</span>
          </p>
        </div>

        {/* Gains Summary */}
        <div className="bg-black/30 rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-mono text-white/60 uppercase tracking-wider text-center">
            Cultivation Gains
          </h3>

          <div className="flex justify-center gap-6">
            {result.pp > 0 && (
              <div className="text-center">
                <p className="text-xl font-mono font-bold text-[#FFD700]">
                  +{formatNumber(result.pp)}
                </p>
                <p className="text-[10px] font-mono text-[#FFD700]/60">PP</p>
              </div>
            )}
            {result.bp > 0 && (
              <div className="text-center">
                <p className="text-xl font-mono font-bold text-[#50C878]">
                  +{formatNumber(result.bp)}
                </p>
                <p className="text-[10px] font-mono text-[#50C878]/60">BP</p>
              </div>
            )}
          </div>

          {result.happinessDecay > 1 && (
            <p className="text-[10px] font-mono text-[#FF6347] text-center">
              Cat happiness decreased by {result.happinessDecay.toFixed(1)}% while away
            </p>
          )}
        </div>

        {/* Events */}
        {result.events.length > 0 && (
          <div className="bg-black/30 rounded-lg p-3 space-y-2">
            <h3 className="text-xs font-mono text-white/60 uppercase tracking-wider">
              Events ({result.events.length})
            </h3>

            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              {result.events.map((evt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-1.5 rounded"
                  style={{
                    backgroundColor:
                      evt.event.tier === 'legendary' || evt.event.tier === 'special'
                        ? 'rgba(255,215,0,0.05)'
                        : 'transparent',
                  }}
                >
                  <span
                    className="text-xs font-mono font-bold shrink-0"
                    style={{ color: TIER_COLORS[evt.event.tier] ?? '#888' }}
                  >
                    {TIER_EMOJI[evt.event.tier] ?? '.'}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-mono font-bold truncate"
                      style={{ color: TIER_COLORS[evt.event.tier] ?? '#888' }}
                    >
                      {evt.event.name}
                    </p>
                    <p className="text-[10px] font-mono text-white/40">
                      {evt.event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collect Button */}
        <button
          className="w-full py-3 rounded-lg font-mono text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #50C878, #3D9970)',
            border: '2px solid #50C878',
            boxShadow: '0 4px 0 #2d7a50, 0 0 20px rgba(80,200,120,0.3)',
            textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
          }}
          onClick={onCollect}
        >
          Collect Gains
        </button>
      </div>
    </div>
  );
}
