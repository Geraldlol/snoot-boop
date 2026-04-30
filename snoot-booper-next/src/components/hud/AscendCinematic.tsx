'use client';

/**
 * AscendCinematic — full-screen ritual flash on rebirth/reincarnation/transcendence.
 * Listens for the snoot:ascend window event (fired from PrestigePanel after
 * the engine reset is complete). Renders the .cinematic flash + a Cinzel
 * banner for ~2.2s, then unmounts.
 */

import { useEffect, useState } from 'react';

interface AscendDetail {
  title?: string;
  subtitle?: string;
}

export default function AscendCinematic() {
  const [active, setActive] = useState<AscendDetail | null>(null);

  useEffect(() => {
    function onAscend(e: Event) {
      const detail = (e as CustomEvent<AscendDetail>).detail ?? {};
      setActive({
        title: detail.title ?? 'Ascended',
        subtitle: detail.subtitle ?? 'the dao deepens',
      });
      setTimeout(() => setActive(null), 2300);
    }
    window.addEventListener('snoot:ascend', onAscend);
    return () => window.removeEventListener('snoot:ascend', onAscend);
  }, []);

  if (!active) return null;

  return (
    <>
      <div className="cinematic" />
      <div className="cinematic-text">
        {active.title}
        <span className="sub">{active.subtitle}</span>
      </div>
    </>
  );
}
