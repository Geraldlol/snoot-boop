'use client';

import { useState, useCallback } from 'react';
import { useEffectsStore } from '@/store/effects-store';
import { useUIStore } from '@/store/ui-store';
import { engine } from '@/engine/engine';
import { SaveManager } from '@/engine/save';

const saveManager = new SaveManager();

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
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const handleExport = useCallback(() => {
    try {
      const data = engine.buildSaveData();
      const encoded = btoa(JSON.stringify(data));
      navigator.clipboard.writeText(encoded);
      setImportStatus('Save copied to clipboard!');
      setTimeout(() => setImportStatus(null), 3000);
    } catch {
      setImportStatus('Export failed.');
    }
  }, []);

  const handleImport = useCallback(() => {
    try {
      const decoded = atob(importText.trim());
      const data = JSON.parse(decoded);
      if (!data.master && !data.resources) {
        setImportStatus('Invalid save data.');
        return;
      }
      // Save to localStorage and reload
      localStorage.setItem('celestial_snoot_sect_v3', JSON.stringify({
        version: '3.0.0',
        timestamp: Date.now(),
        ...data,
      }));
      setImportStatus('Import successful! Reloading...');
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      setImportStatus('Invalid save data.');
    }
  }, [importText]);

  const handleHardReset = useCallback(() => {
    localStorage.removeItem('celestial_snoot_sect_v3');
    localStorage.removeItem('celestial_snoot_sect');
    window.location.reload();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-mono font-bold" style={{ color: '#888' }}>
        Settings
      </h2>

      {/* Audio Section */}
      <div className="bg-black/30 rounded-lg p-3 space-y-3">
        <h3 className="text-xs font-mono text-white/70 uppercase tracking-wider">Audio</h3>

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-white/60">Master Volume</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(masterVolume * 100)}
              onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
              className="w-24 accent-[#50C878]"
            />
            <span className="text-xs font-mono text-white/40 w-8 text-right">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-white/60">Music</span>
          <button
            className="px-3 py-1 rounded text-xs font-mono border transition-colors"
            style={{
              borderColor: musicEnabled ? '#50C878' : 'rgba(255,255,255,0.2)',
              color: musicEnabled ? '#50C878' : 'rgba(255,255,255,0.4)',
              backgroundColor: musicEnabled ? 'rgba(80,200,120,0.1)' : 'transparent',
            }}
            onClick={() => setMusicEnabled(!musicEnabled)}
          >
            {musicEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-white/60">SFX</span>
          <button
            className="px-3 py-1 rounded text-xs font-mono border transition-colors"
            style={{
              borderColor: sfxEnabled ? '#50C878' : 'rgba(255,255,255,0.2)',
              color: sfxEnabled ? '#50C878' : 'rgba(255,255,255,0.4)',
              backgroundColor: sfxEnabled ? 'rgba(80,200,120,0.1)' : 'transparent',
            }}
            onClick={() => setSfxEnabled(!sfxEnabled)}
          >
            {sfxEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Save Section */}
      <div className="bg-black/30 rounded-lg p-3 space-y-3">
        <h3 className="text-xs font-mono text-white/70 uppercase tracking-wider">Save Data</h3>

        <button
          className="w-full px-3 py-2 rounded text-xs font-mono border border-[#50C878]/50 text-[#50C878] hover:bg-[#50C878]/10 transition-colors"
          onClick={handleExport}
        >
          Export Save (Copy to Clipboard)
        </button>

        <textarea
          className="w-full h-16 bg-black/40 border border-white/10 rounded text-xs font-mono text-white/60 p-2 resize-none"
          placeholder="Paste save data here..."
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />

        <button
          className="w-full px-3 py-2 rounded text-xs font-mono border border-[#4169E1]/50 text-[#4169E1] hover:bg-[#4169E1]/10 transition-colors"
          onClick={handleImport}
          disabled={!importText.trim()}
        >
          Import Save
        </button>

        {importStatus && (
          <p className="text-xs font-mono text-[#FFD700] text-center">{importStatus}</p>
        )}

        <div className="pt-2 border-t border-white/10">
          {!showReset ? (
            <button
              className="w-full px-3 py-2 rounded text-xs font-mono border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={() => setShowReset(true)}
            >
              Hard Reset
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-mono text-red-400 text-center">
                This will delete ALL save data. Are you sure?
              </p>
              <div className="flex gap-2">
                <button
                  className="flex-1 px-3 py-2 rounded text-xs font-mono bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30"
                  onClick={handleHardReset}
                >
                  Yes, Reset
                </button>
                <button
                  className="flex-1 px-3 py-2 rounded text-xs font-mono border border-white/20 text-white/50 hover:bg-white/5"
                  onClick={() => setShowReset(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debug Section */}
      <div className="bg-black/30 rounded-lg p-3 space-y-3">
        <button
          className="flex items-center justify-between w-full text-xs font-mono text-white/40 hover:text-white/60"
          onClick={() => setShowDebug(!showDebug)}
        >
          <span>Debug</span>
          <span>{showDebug ? '▼' : '▶'}</span>
        </button>

        {showDebug && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/50">Debug Mode</span>
              <button
                className="px-3 py-1 rounded text-xs font-mono border transition-colors"
                style={{
                  borderColor: debugMode ? '#FFD700' : 'rgba(255,255,255,0.2)',
                  color: debugMode ? '#FFD700' : 'rgba(255,255,255,0.4)',
                  backgroundColor: debugMode ? 'rgba(255,215,0,0.1)' : 'transparent',
                }}
                onClick={() => setDebugMode(!debugMode)}
              >
                {debugMode ? 'ON' : 'OFF'}
              </button>
            </div>
            <p className="text-xs font-mono text-white/50">
              Version: 3.0.0 (React Rewrite)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
