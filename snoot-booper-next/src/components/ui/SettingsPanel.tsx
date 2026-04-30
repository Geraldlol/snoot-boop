/**
 * SettingsPanel — wuxia reskin.
 */

'use client';

import { useState, useCallback } from 'react';
import { useEffectsStore } from '@/store/effects-store';
import { useUIStore } from '@/store/ui-store';
import { engine } from '@/engine/engine';

export default function SettingsPanel() {
  const musicEnabled = useEffectsStore((s) => s.musicEnabled);
  const sfxEnabled = useEffectsStore((s) => s.sfxEnabled);
  const masterVolume = useEffectsStore((s) => s.masterVolume);
  const setMusicEnabled = useEffectsStore((s) => s.setMusicEnabled);
  const setSfxEnabled = useEffectsStore((s) => s.setSfxEnabled);
  const setMasterVolume = useEffectsStore((s) => s.setMasterVolume);
  const debugMode = useUIStore((s) => s.debugMode);
  const setDebugMode = useUIStore((s) => s.setDebugMode);

  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  const exportSave = useCallback(() => {
    try {
      const data = engine.buildSaveData();
      const encoded = btoa(JSON.stringify(data));
      navigator.clipboard.writeText(encoded);
      setStatus('Save copied to clipboard.');
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus('Export failed.');
    }
  }, []);

  const importSave = useCallback(() => {
    try {
      const decoded = atob(importText.trim());
      const data = JSON.parse(decoded);
      if (!data.master && !data.resources) {
        setStatus('Invalid save data.');
        return;
      }
      localStorage.setItem('celestial_snoot_sect_v3', JSON.stringify({
        version: '3.0.0',
        timestamp: Date.now(),
        ...data,
      }));
      setStatus('Import successful — reloading...');
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      setStatus('Invalid save data.');
    }
  }, [importText]);

  const hardReset = useCallback(() => {
    localStorage.removeItem('celestial_snoot_sect_v3');
    localStorage.removeItem('celestial_snoot_sect');
    window.location.reload();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: 'var(--ink-mute)', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>齒</span>
        </div>
        <div>
          <div className="h-section">Settings</div>
          <div className="h-eyebrow">Sect tools and configuration</div>
        </div>
      </div>

      {/* Audio */}
      <Section title="Audio">
        <Row label="Master Volume">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(masterVolume * 100)}
              onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
              className="w-32"
            />
            <span className="font-mono text-[11px]" style={{ color: 'var(--gold-bright)', minWidth: 36, textAlign: 'right' }}>
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
        </Row>
        <Row label="Music">
          <ToggleBtn on={musicEnabled} onClick={() => setMusicEnabled(!musicEnabled)} />
        </Row>
        <Row label="SFX">
          <ToggleBtn on={sfxEnabled} onClick={() => setSfxEnabled(!sfxEnabled)} />
        </Row>
      </Section>

      {/* Save */}
      <Section title="Save Data">
        <button className="btn btn-primary w-full mb-2" onClick={exportSave}>
          Export Save · copy to clipboard
        </button>
        <textarea
          className="w-full h-20 font-mono text-[10px] p-2 resize-none mb-2"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--rule)', color: 'var(--ink-mute)' }}
          placeholder="Paste save data here..."
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />
        <button className="btn w-full" disabled={!importText.trim()} onClick={importSave}>
          Import Save
        </button>
        {status && (
          <div className="mt-2 text-center font-mono text-[11px]" style={{ color: 'var(--gold-bright)' }}>{status}</div>
        )}
      </Section>

      {/* Danger zone */}
      <Section title="Danger Zone" tone="vermillion">
        {!showReset ? (
          <button
            className="btn w-full"
            style={{ borderColor: 'var(--vermillion)', color: 'var(--vermillion-bright)' }}
            onClick={() => setShowReset(true)}
          >
            Hard Reset
          </button>
        ) : (
          <>
            <p className="text-xs text-center mb-2" style={{ color: 'var(--vermillion-bright)' }}>
              ⚠ This deletes all save data. Cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                className="btn flex-1"
                style={{ borderColor: 'var(--vermillion)', background: 'rgba(214,91,64,0.16)', color: 'var(--vermillion-bright)' }}
                onClick={hardReset}
              >
                Yes · Reset
              </button>
              <button className="btn flex-1" onClick={() => setShowReset(false)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </Section>

      {/* Debug */}
      <Section title="Debug">
        <Row label="Debug Mode">
          <ToggleBtn on={debugMode} onClick={() => setDebugMode(!debugMode)} />
        </Row>
        <p className="font-mono text-[10px] mt-2" style={{ color: 'var(--ink-dim)' }}>
          Build: 3.0.0 · React Rewrite · Wuxia Shell
        </p>
      </Section>
    </div>
  );
}

function Section({ title, tone, children }: { title: string; tone?: 'vermillion'; children: React.ReactNode }) {
  return (
    <div className="panel p-4 mb-3" style={{ background: 'rgba(0,0,0,0.3)', borderColor: tone === 'vermillion' ? 'var(--vermillion)' : 'var(--rule)' }}>
      <div className="h-section text-left mb-3" style={{ fontSize: 11, color: tone === 'vermillion' ? 'var(--vermillion-bright)' : 'var(--gold-bright)' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2 last:mb-0">
      <span className="text-sm" style={{ color: 'var(--ink)' }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

function ToggleBtn({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="font-display text-[10px] tracking-[0.16em] uppercase px-3 py-1 cursor-pointer"
      style={{
        background: on ? 'rgba(109,197,168,0.10)' : 'rgba(0,0,0,0.4)',
        border: `1px solid ${on ? 'var(--jade)' : 'var(--rule)'}`,
        color: on ? 'var(--jade-bright)' : 'var(--ink-dim)',
        borderRadius: 1,
        minWidth: 56,
      }}
    >
      {on ? 'On' : 'Off'}
    </button>
  );
}
