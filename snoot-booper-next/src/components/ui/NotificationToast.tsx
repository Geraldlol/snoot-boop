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

  // Expose a method for adding toasts via window event
  const addToast = useCallback((notification: Notification) => {
    const id = ++toastId;
    setToasts(prev => {
      const next = [...prev, { ...notification, id, fadeOut: false }];
      // Keep only MAX_VISIBLE
      if (next.length > MAX_VISIBLE) return next.slice(-MAX_VISIBLE);
      return next;
    });

    // Start fade out
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, fadeOut: true } : t));
    }, TOAST_DURATION - 500);

    // Remove
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  // Listen for custom events from the game loop
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
    <div className="absolute top-16 right-4 z-30 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => {
        const color = TYPE_COLORS[toast.type] ?? TYPE_COLORS.default;
        const prefix = TYPE_PREFIXES[toast.type] ?? '';
        return (
          <div
            key={toast.id}
            className="px-4 py-2 rounded-lg border backdrop-blur-sm font-mono text-xs transition-all duration-500"
            style={{
              borderColor: color,
              backgroundColor: `${color}15`,
              color,
              opacity: toast.fadeOut ? 0 : 1,
              transform: toast.fadeOut ? 'translateX(100px)' : 'translateX(0)',
            }}
          >
            {prefix}{toast.message}
          </div>
        );
      })}
    </div>
  );
}
