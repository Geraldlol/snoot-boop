'use client';

/**
 * StatOverlay — bottom-left HUD that appears while Shift is held.
 * Shows the live multiplier breakdown so theorycrafters can read the math.
 */

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';

export default function StatOverlay() {
  const [held, setHeld] = useState(false);
  const modifiers = useGameStore((s) => s.modifiers);
  const stats = useGameStore((s) => s.stats);

  useEffect(() => {
    function onDown(e: KeyboardEvent) {
      if (e.key === 'Shift') setHeld(true);
    }
    function onUp(e: KeyboardEvent) {
      if (e.key === 'Shift') setHeld(false);
    }
    function onBlur() {
      setHeld(false);
    }
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  if (!held) return null;

  const traitMods = engine.cat.getTraitMultipliers();
  const ppPerSec = engine.cat.calculatePPPerSecond(modifiers);
  const passiveBp = engine.upgrade.getCombinedEffects().passiveBpPerSecond;

  return (
    <div
      className="panel pointer-events-none fixed left-4 bottom-4 z-40 p-3 w-72 text-[11px]"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      <div className="h-eyebrow mb-2" style={{ color: 'var(--gold-bright)' }}>
        Mult Inspector · hold shift
      </div>

      <Row label="Boop ×"  value={modifiers.bpMultiplier.toFixed(3)} />
      <Row label="Qi ×"    value={modifiers.ppMultiplier.toFixed(3)} />
      <Row label="AFK ×"   value={modifiers.afkMultiplier.toFixed(3)} />
      <Row label="Crit %"  value={`${(modifiers.critChanceBonus * 100).toFixed(1)}%`} />
      <Row label="Bond ×"  value={modifiers.catHappinessMultiplier.toFixed(3)} />
      <Row label="Loot ×"  value={modifiers.lootBonus.toFixed(3)} />

      <hr className="my-2" style={{ border: 0, borderTop: '1px dashed var(--rule)' }} />

      <Row label="Trait Boop ×"   value={traitMods.bp.toFixed(3)} subtle />
      <Row label="Trait Qi ×"     value={traitMods.pp.toFixed(3)} subtle />
      <Row label="Trait Bond ×"   value={traitMods.bond.toFixed(3)} subtle />
      <Row label="Trait Crit +%"  value={`+${(traitMods.crit * 100).toFixed(1)}%`} subtle />
      <Row label="Trait Dungeon ×" value={traitMods.dungeon.toFixed(3)} subtle />

      <hr className="my-2" style={{ border: 0, borderTop: '1px dashed var(--rule)' }} />

      <Row label="PP / sec"    value={`${formatNumber(ppPerSec)}/s`} />
      <Row label="Auto BP / s" value={`${formatNumber(passiveBp)}/s`} />
      <Row label="Total Boops" value={formatNumber(stats.totalBoops)} />
      <Row label="Max Combo"   value={String(stats.maxCombo)} />
    </div>
  );
}

function Row({ label, value, subtle }: { label: string; value: string; subtle?: boolean }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: subtle ? 'var(--ink-dim)' : 'var(--ink-mute)' }}>{label}</span>
      <span style={{ color: subtle ? 'var(--ink-mute)' : 'var(--gold-bright)' }}>{value}</span>
    </div>
  );
}
