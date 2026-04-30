/**
 * NotificationToast - Shows floating notifications for game events.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Notification } from '@/engine/engine';

const TOAST_DURATION = 4000;
const MAX_VISIBLE = 5;

interface ToastItem extends Notification {
  id: number;
  fadeOut: boolean;
  index: number;
}

const TYPE_COLORS: Record<string, string> = {
  achievement: '#FFD700',
  goose: '#FF6347',
  event: '#00BFFF',
  waifu: '#FFB6C1',
  daily: '#50C878',
  default: '#FFFFFF',
};

const TYPE_PREFIXES: Record<string, string> = {
  achievement: '',
  goose: 'HONK! ',
  event: '',
  waifu: '',
  daily: '',
};

let toastId = 0;

export default function NotificationToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((notification: Notification) => {
    const id = ++toastId;
    setToasts(prev => {
      const next = [...prev, { ...notification, id, fadeOut: false, index: prev.length }];
      if (next.length > MAX_VISIBLE) return next.slice(-MAX_VISIBLE);
      return next;
    });

    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, fadeOut: true } : t));
    }, TOAST_DURATION - 500);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, fadeOut: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Notification>).detail;
      addToast(detail);
    };
    window.addEventListener('game-notification', handler);
    return () => window.removeEventListener('game-notification', handler);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="absolute top-16 right-4 z-30 flex flex-col gap-2">
      {toasts.map((toast, idx) => {
        const color = TYPE_COLORS[toast.type] ?? TYPE_COLORS.default;
        const prefix = TYPE_PREFIXES[toast.type] ?? '';
        return (
          <div
            key={toast.id}
            className="flex items-stretch rounded-lg border backdrop-blur-sm font-mono text-xs cursor-pointer transition-all duration-500"
            style={{
              borderColor: color,
              backgroundColor: `${color}25`,
              color,
              opacity: toast.fadeOut ? 0 : 1,
              transform: toast.fadeOut ? 'translateX(100px)' : 'translateX(0)',
              animationDelay: `${idx * 50}ms`,
              animation: toast.fadeOut ? 'none' : 'toastSlideIn 0.3s ease-out',
            }}
            onClick={() => dismissToast(toast.id)}
          >
            {/* Color accent bar */}
            <div className="w-1 rounded-l-lg flex-shrink-0" style={{ backgroundColor: color }} />
            <div className="px-3 py-2">
              {prefix}{toast.message}
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(80px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
