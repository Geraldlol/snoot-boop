/**
 * NotificationToast — wuxia toast stack (top-right).
 * Receives custom 'game-notification' window events from engine.setOnStateChange.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Notification } from '@/engine/engine';

const TOAST_DURATION = 4500;
const MAX_VISIBLE = 5;

interface ToastItem extends Notification {
  toastId: number;
  fadeOut: boolean;
}

const TYPE_TONES: Record<string, string> = {
  achievement: 'var(--gold-bright)',
  goose:       'var(--vermillion-bright)',
  event:       '#4169E1',
  waifu:       '#FFB6C1',
  daily:       'var(--jade-bright)',
  default:     'var(--ink)',
};

const TYPE_GLYPHS: Record<string, string> = {
  achievement: '勳',
  goose:       '鵝',
  event:       '事',
  waifu:       '情',
  daily:       '務',
};

let counter = 0;

export default function NotificationToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((n: Notification) => {
    const toastId = ++counter;
    setToasts((prev) => {
      const next = [...prev, { ...n, toastId, fadeOut: false }];
      return next.length > MAX_VISIBLE ? next.slice(-MAX_VISIBLE) : next;
    });
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.toastId === toastId ? { ...t, fadeOut: true } : t)));
    }, TOAST_DURATION - 400);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, TOAST_DURATION);
  }, []);

  const dismissToast = useCallback((toastId: number) => {
    setToasts((prev) => prev.map((t) => (t.toastId === toastId ? { ...t, fadeOut: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, 300);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      addToast((e as CustomEvent<Notification>).detail);
    };
    window.addEventListener('game-notification', handler);
    return () => window.removeEventListener('game-notification', handler);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-24 z-40 flex flex-col gap-2 max-w-[320px]">
      {toasts.map((t) => {
        const tone = TYPE_TONES[t.type] ?? TYPE_TONES.default;
        const glyph = TYPE_GLYPHS[t.type] ?? '事';
        return (
          <button
            key={t.toastId}
            onClick={() => dismissToast(t.toastId)}
            className="panel cursor-pointer overflow-hidden text-left p-0 transition-all duration-300"
            style={{
              borderColor: tone,
              background: 'rgba(8,14,22,0.95)',
              opacity: t.fadeOut ? 0 : 1,
              transform: t.fadeOut ? 'translateX(80px)' : 'translateX(0)',
              animation: t.fadeOut ? 'none' : 'toastSlideIn 320ms ease-out',
            }}
          >
            <div className="flex items-stretch">
              <div
                className="flex items-center justify-center font-display"
                style={{
                  width: 40, fontSize: 18,
                  color: tone,
                  background: `linear-gradient(180deg, ${tone}22, ${tone}05)`,
                  borderRight: `1px solid ${tone}55`,
                }}
              >
                {glyph}
              </div>
              <div className="px-3 py-2 flex-1 min-w-0">
                <div className="font-display text-[10px] tracking-[0.16em] uppercase mb-0.5" style={{ color: tone }}>
                  {t.type}
                </div>
                <div className="text-xs leading-tight" style={{ color: 'var(--ink)' }}>
                  {t.message}
                </div>
              </div>
            </div>
          </button>
        );
      })}
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
