/**
 * SocialPanel — Friends (wuxia reskin).
 * Sub-tabs: Sect Card / Sect War / Save Sharing.
 */

'use client';

import { useState, useCallback } from 'react';
import { engine } from '@/engine/engine';
import { useGameStore } from '@/store/game-store';
import { useCatStore } from '@/store/cat-store';
import { MASTERS } from '@/engine/data/masters';
import { formatNumber } from '@/engine/big-number';
import { SaveManager } from '@/engine/save/save-manager';
import SectWarPanel from './SectWarPanel';

type Sub = 'card' | 'war' | 'save';

const SUB: { id: Sub; label: string }[] = [
  { id: 'card', label: 'Sect Card' },
  { id: 'war',  label: 'Sect War' },
  { id: 'save', label: 'Save Sharing' },
];

export default function SocialPanel() {
  const [sub, setSub] = useState<Sub>('card');

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: 'var(--vermillion-bright)', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>朋</span>
        </div>
        <div>
          <div className="h-section">Friends &amp; Sect</div>
          <div className="h-eyebrow">Compare cultivation, declare war, share scrolls</div>
        </div>
      </div>

      <div className="flex gap-0 mb-4 border-b" style={{ borderColor: 'var(--rule)' }}>
        {SUB.map((t) => {
          const a = sub === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSub(t.id)}
              className="font-display text-[11px] tracking-[0.16em] uppercase px-4 py-2 cursor-pointer"
              style={{
                color: a ? 'var(--vermillion-bright)' : 'var(--ink-mute)',
                borderBottom: `2px solid ${a ? 'var(--vermillion)' : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {sub === 'card' && <SectCard />}
      {sub === 'war'  && <SectWarPanel />}
      {sub === 'save' && <SaveSharing />}
    </div>
  );
}

// ─── Sect Card ─────────────────────────────────────────────

function SectCard() {
  const selectedMaster = useGameStore((s) => s.selectedMaster);
  const currencies = useGameStore((s) => s.currencies);
  const stats = useGameStore((s) => s.stats);
  const catCount = useCatStore((s) => s.cats.length);
  const [copied, setCopied] = useState(false);

  const master = selectedMaster ? MASTERS[selectedMaster] : null;
  const ach = engine.achievement.getProgress();
  const waifus = engine.waifu.getUnlockedWaifus();

  const power = Math.floor(
    stats.totalBoops * 0.01 +
    catCount * 100 +
    currencies.bp * 0.001 +
    currencies.pp * 0.01 +
    ach.unlocked * 500
  );

  const copyToClipboard = useCallback(() => {
    if (!master) return;
    const text = [
      `⚔️ **${master.name} ${master.title}** — Celestial Snoot Sect`,
      ``,
      `📊 Power Score: ${formatNumber(power)}`,
      `👆 Total Boops: ${formatNumber(stats.totalBoops)}`,
      `🐱 Cats: ${catCount}`,
      `💕 Waifus: ${waifus.length}`,
      `🏆 Achievements: ${ach.unlocked}/${ach.total} (${ach.percentage.toFixed(1)}%)`,
      `💰 BP: ${formatNumber(currencies.bp)} | PP: ${formatNumber(currencies.pp)}`,
      `🔥 Max Combo: ${stats.maxCombo} | Crits: ${formatNumber(stats.criticalBoops)}`,
      ``,
      `*"Every snoot shall be booped."*`,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [master, power, stats, catCount, waifus.length, ach, currencies]);

  if (!master) return null;

  return (
    <div>
      {/* Master hero */}
      <div className="panel panel-ornate p-4 mb-4" style={{ borderColor: master.color }}>
        <div className="flex items-center gap-3">
          <div
            className="rune"
            style={{
              width: 56, height: 56, fontSize: 24,
              background: `radial-gradient(circle at 35% 30%, ${master.color}55, ${master.color}22 60%, rgba(0,0,0,0.4))`,
              border: `1px solid ${master.color}`,
              color: '#fff7df',
              textShadow: `0 0 12px ${master.color}cc`,
            }}
          >
            尊
          </div>
          <div>
            <div className="font-display text-[16px] font-black tracking-[0.08em]" style={{ color: master.color }}>{master.name}</div>
            <div className="h-eyebrow">{master.title} · {master.role}</div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        <StatBox label="Power Score"  value={formatNumber(power)}                  tone="var(--gold-bright)" />
        <StatBox label="Total Boops"  value={formatNumber(stats.totalBoops)}        tone="var(--vermillion-bright)" />
        <StatBox label="Cats"         value={String(catCount)}                       tone="var(--gold-bright)" />
        <StatBox label="Waifus"       value={String(waifus.length)}                  tone="#FFB6C1" />
        <StatBox label="Max Combo"    value={String(stats.maxCombo)}                 tone="var(--jade-bright)" />
        <StatBox label="Crits"        value={formatNumber(stats.criticalBoops)}      tone="var(--gold-bright)" />
      </div>

      {/* Achievement progress */}
      <div className="panel p-3 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="flex justify-between h-eyebrow mb-1.5">
          <span>Achievements</span>
          <span>{ach.unlocked} / {ach.total} ({ach.percentage.toFixed(1)}%)</span>
        </div>
        <div className="meter">
          <div className="meter-fill" style={{ width: `${ach.percentage}%` }} />
        </div>
      </div>

      <button
        className="btn btn-primary w-full"
        onClick={copyToClipboard}
        style={copied ? { borderColor: 'var(--jade-bright)', color: 'var(--jade-bright)' } : undefined}
      >
        {copied ? '✓ Copied to clipboard' : 'Copy Sect Card · Discord'}
      </button>
    </div>
  );
}

function StatBox({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--rule)' }}>
      <div className="h-eyebrow">{label}</div>
      <div className="font-display nums text-[14px] mt-0.5" style={{ color: tone }}>{value}</div>
    </div>
  );
}

// ─── Save Sharing ──────────────────────────────────────────

function SaveSharing() {
  const [exportedCode, setExportedCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const saveManager = new SaveManager();

  function exportSave() {
    const code = saveManager.exportSave();
    if (code) {
      setExportedCode(code);
      navigator.clipboard.writeText(code);
    }
  }

  function importSave() {
    if (!importCode.trim()) return;
    const ok = saveManager.importSave(importCode.trim());
    if (ok) {
      setImportStatus('success');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  }

  return (
    <div>
      <div className="panel p-4 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-section text-left mb-2" style={{ fontSize: 11 }}>Export</div>
        <p className="text-xs mb-3" style={{ color: 'var(--ink-mute)' }}>
          Share your save as a code. Send it to a sect-mate so they can clone your sanctuary.
        </p>
        <button className="btn btn-primary w-full mb-2" onClick={exportSave}>
          📤 Export Save · copies to clipboard
        </button>
        {exportedCode && (
          <textarea
            readOnly
            value={exportedCode}
            className="w-full h-16 font-mono text-[10px] p-2 resize-none"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--rule)', color: 'var(--ink-mute)' }}
          />
        )}
      </div>

      <div className="panel p-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-section text-left mb-2" style={{ fontSize: 11 }}>Import</div>
        <p className="text-xs mb-2" style={{ color: 'var(--vermillion-bright)' }}>
          ⚠ This overwrites your current save.
        </p>
        <textarea
          placeholder="Paste save code here..."
          value={importCode}
          onChange={(e) => setImportCode(e.target.value)}
          className="w-full h-20 font-mono text-[10px] p-2 resize-none mb-2"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--rule)', color: 'var(--ink-mute)' }}
        />
        <button
          className="btn w-full"
          onClick={importSave}
          disabled={importStatus === 'success'}
          style={
            importStatus === 'success' ? { borderColor: 'var(--jade-bright)', color: 'var(--jade-bright)' }
            : importStatus === 'error' ? { borderColor: 'var(--vermillion)', color: 'var(--vermillion-bright)' }
            : undefined
          }
        >
          {importStatus === 'success' ? '✓ Imported · reloading' : importStatus === 'error' ? '✗ Invalid save code' : '📥 Import Save'}
        </button>
      </div>
    </div>
  );
}
