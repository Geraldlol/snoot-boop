'use client';

import { useState, useCallback } from 'react';
import { engine } from '@/engine/engine';
import { useGameStore } from '@/store/game-store';
import { useCatStore } from '@/store/cat-store';
import { MASTERS } from '@/engine/data/masters';
import { formatNumber } from '@/engine/big-number';
import { SaveManager } from '@/engine/save/save-manager';
import SectWarPanel from './SectWarPanel';

type SubTab = 'card' | 'war' | 'save';

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: 'card', label: 'Sect Card' },
  { id: 'war', label: 'Sect War' },
  { id: 'save', label: 'Save Sharing' },
];

export default function SocialPanel() {
  const [activeTab, setActiveTab] = useState<SubTab>('card');

  return (
    <div>
      <h2 className="text-sm font-mono text-[#E94560] font-bold mb-2">📜 Social</h2>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-4">
        {SUB_TABS.map(tab => (
          <button
            key={tab.id}
            className="px-3 py-1 text-[10px] font-mono rounded transition-all cursor-pointer"
            style={{
              backgroundColor: activeTab === tab.id ? '#E9456030' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.id ? '#E94560' : 'rgba(255,255,255,0.4)',
              borderBottom: activeTab === tab.id ? '2px solid #E94560' : '2px solid transparent',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'card' && <SectCardTab />}
      {activeTab === 'war' && <SectWarPanel />}
      {activeTab === 'save' && <SaveSharingTab />}
    </div>
  );
}

// ─── Sect Card ───────────────────────────────────────────────

function SectCardTab() {
  const selectedMaster = useGameStore((s) => s.selectedMaster);
  const currencies = useGameStore((s) => s.currencies);
  const stats = useGameStore((s) => s.stats);
  const catCount = useCatStore((s) => s.cats.length);
  const [copied, setCopied] = useState(false);

  const master = selectedMaster ? MASTERS[selectedMaster] : null;
  const achProgress = engine.achievement.getProgress();
  const waifus = engine.waifu.getUnlockedWaifus();

  const powerScore = Math.floor(
    stats.totalBoops * 0.01 +
    catCount * 100 +
    currencies.bp * 0.001 +
    currencies.pp * 0.01 +
    achProgress.unlocked * 500
  );

  const handleCopyToDiscord = useCallback(() => {
    if (!master) return;

    const text = [
      `⚔️ **${master.name} ${master.title}** — Celestial Snoot Sect`,
      ``,
      `📊 Power Score: ${formatNumber(powerScore)}`,
      `👆 Total Boops: ${formatNumber(stats.totalBoops)}`,
      `🐱 Cats: ${catCount}`,
      `💕 Waifus: ${waifus.length}`,
      `🏆 Achievements: ${achProgress.unlocked}/${achProgress.total} (${achProgress.percentage.toFixed(1)}%)`,
      `💰 BP: ${formatNumber(currencies.bp)} | PP: ${formatNumber(currencies.pp)}`,
      `🔥 Max Combo: ${stats.maxCombo} | Crits: ${formatNumber(stats.criticalBoops)}`,
      ``,
      `*"Every snoot shall be booped."*`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [master, powerScore, stats, catCount, waifus.length, achProgress, currencies]);

  if (!master) return null;

  return (
    <div>
      {/* Master info */}
      <div className="p-3 rounded-lg bg-black/20 border border-white/10 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: master.color + '40', border: `2px solid ${master.color}` }} />
          <div>
            <div className="text-[10px] font-mono font-bold" style={{ color: master.color }}>{master.name}</div>
            <div className="text-[9px] font-mono text-white/40">{master.title} — {master.role}</div>
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <StatBox label="Power Score" value={formatNumber(powerScore)} color="#FFD700" />
        <StatBox label="Total Boops" value={formatNumber(stats.totalBoops)} color="#E94560" />
        <StatBox label="Cats" value={String(catCount)} color="#FFD700" />
        <StatBox label="Waifus" value={String(waifus.length)} color="#FFB6C1" />
        <StatBox label="Max Combo" value={String(stats.maxCombo)} color="#00BFFF" />
        <StatBox label="Crits" value={formatNumber(stats.criticalBoops)} color="#7FFFD4" />
      </div>

      {/* Achievement progress */}
      <div className="p-2 rounded-lg bg-black/20 border border-white/10 mb-3">
        <div className="text-[9px] font-mono text-white/50 mb-1">
          🏆 Achievements: {achProgress.unlocked}/{achProgress.total}
        </div>
        <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
          <div className="h-full bg-[#FFD700] transition-all" style={{ width: `${achProgress.percentage}%` }} />
        </div>
      </div>

      {/* Copy for Discord */}
      <button
        className="w-full py-2 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/30 hover:bg-[#5865F2]/30"
        onClick={handleCopyToDiscord}
      >
        {copied ? '✓ Copied!' : '📋 Copy Sect Card for Discord'}
      </button>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-2 rounded bg-black/20 border border-white/5">
      <div className="text-[8px] font-mono text-white/30">{label}</div>
      <div className="text-[11px] font-mono font-bold" style={{ color }}>{value}</div>
    </div>
  );
}

// ─── Save Sharing ────────────────────────────────────────────

function SaveSharingTab() {
  const [exportedCode, setExportedCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const saveManager = new SaveManager();

  const handleExport = () => {
    const code = saveManager.exportSave();
    if (code) {
      setExportedCode(code);
      navigator.clipboard.writeText(code);
    }
  };

  const handleImport = () => {
    if (!importCode.trim()) return;
    const result = saveManager.importSave(importCode.trim());
    if (result) {
      setImportStatus('success');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  return (
    <div>
      {/* Export */}
      <div className="mb-4">
        <p className="text-[10px] font-mono text-white/50 mb-2">Export your save as a shareable code:</p>
        <button
          className="w-full py-2 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all bg-[#50C878]/20 text-[#50C878] border border-[#50C878]/30 hover:bg-[#50C878]/30 mb-2"
          onClick={handleExport}
        >
          📤 Export Save (copies to clipboard)
        </button>
        {exportedCode && (
          <textarea
            className="w-full h-16 bg-black/30 border border-white/10 rounded text-[8px] font-mono text-white/60 p-2 resize-none"
            readOnly
            value={exportedCode}
          />
        )}
      </div>

      {/* Import */}
      <div>
        <p className="text-[10px] font-mono text-white/50 mb-2">Import a save code:</p>
        <textarea
          className="w-full h-16 bg-black/30 border border-white/10 rounded text-[8px] font-mono text-white/60 p-2 resize-none mb-2"
          placeholder="Paste save code here..."
          value={importCode}
          onChange={(e) => setImportCode(e.target.value)}
        />
        <button
          className={`w-full py-2 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
            importStatus === 'success'
              ? 'bg-[#50C878]/20 text-[#50C878] border border-[#50C878]/30'
              : importStatus === 'error'
              ? 'bg-[#E94560]/20 text-[#E94560] border border-[#E94560]/30'
              : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
          }`}
          onClick={handleImport}
          disabled={importStatus === 'success'}
        >
          {importStatus === 'success' ? '✓ Imported! Reloading...' : importStatus === 'error' ? '✗ Invalid save code' : '📥 Import Save'}
        </button>
        {importStatus === 'idle' && (
          <p className="text-[8px] font-mono text-[#E94560]/50 mt-1">⚠️ This will overwrite your current save!</p>
        )}
      </div>
    </div>
  );
}
