'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated world backdrop: drifting embers + soft cloud blobs + twinkling stars.
 * Pure 2D canvas, fixed full-viewport, pointer-events: none.
 * Mounted once at the root of the game shell, behind everything.
 */
export default function WorldCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    const dpr = window.devicePixelRatio || 1;
    let raf = 0;
    let mounted = true;

    function resize() {
      if (!c || !ctx) return;
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = `${W}px`;
      c.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const clouds = Array.from({ length: 8 }, () => ({
      x: Math.random() * W,
      y: 0.55 * H + Math.random() * 0.3 * H,
      r: 80 + Math.random() * 160,
      vx: 0.05 + Math.random() * 0.08,
      a: 0.05 + Math.random() * 0.06,
    }));
    const embers = Array.from({ length: 50 }, () => ({
      x: Math.random() * W,
      y: H + Math.random() * H,
      r: 0.6 + Math.random() * 1.4,
      vy: -0.2 - Math.random() * 0.6,
      vx: -0.2 + Math.random() * 0.4,
      flicker: Math.random() * Math.PI * 2,
      hue: 30 + Math.random() * 30,
    }));
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.55,
      r: 0.4 + Math.random() * 1.0,
      base: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    function tick(t: number) {
      if (!mounted || !ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Stars
      stars.forEach((s) => {
        const a = s.base + Math.sin(t * 0.001 + s.phase) * 0.3;
        ctx.fillStyle = `rgba(255, 235, 180, ${Math.max(0, a)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'lighter';

      // Cloud blobs
      clouds.forEach((cd) => {
        cd.x += cd.vx;
        if (cd.x - cd.r > W) cd.x = -cd.r;
        const grad = ctx.createRadialGradient(cd.x, cd.y, 0, cd.x, cd.y, cd.r);
        grad.addColorStop(0, `rgba(180, 200, 220, ${cd.a})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cd.x, cd.y, cd.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Embers
      embers.forEach((e) => {
        e.y += e.vy;
        e.x += e.vx + Math.sin(t * 0.001 + e.flicker) * 0.2;
        if (e.y < -10) {
          e.y = H + 10;
          e.x = Math.random() * W;
        }
        const flick = 0.6 + Math.sin(t * 0.005 + e.flicker) * 0.4;
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
        grad.addColorStop(0, `hsla(${e.hue}, 95%, 65%, ${0.8 * flick})`);
        grad.addColorStop(0.4, `hsla(${e.hue}, 95%, 50%, ${0.3 * flick})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="world-canvas" aria-hidden />;
}
