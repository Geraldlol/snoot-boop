'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useUIStore } from '@/store/ui-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import type {
  BoopCommand,
  SkillCategory,
  UpgradeType,
  LootItem,
  FloorModifier,
  ActiveEnemy,
  PlayerState,
  CombatState,
  RunRecord,
} from '@/engine/systems/combat/pagoda-system';

// ─── Helpers ──────────────────────────────────────────────

const RARITY_COLORS: Record<string, string> = {
  common: '#A0A0A0',
  uncommon: '#50C878',
  rare: '#4169E1',
  legendary: '#FFD700',
  mythic: '#FF69B4',
};

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#E94560',
  water: '#4169E1',
  nature: '#50C878',
  light: '#FFD700',
  void: '#9370DB',
};

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  basic: 'Basic',
  offensive: 'Offensive',
  defensive: 'Defensive',
  utility: 'Utility',
  ultimate: 'Ultimate',
  meme: 'Meme',
};

const UPGRADE_INFO: Record<UpgradeType, { name: string; emoji: string; desc: string }> = {
  maxHpBonus: { name: 'Max HP', emoji: '❤️', desc: '+20 HP per level' },
  damageBonus: { name: 'Damage', emoji: '⚔️', desc: '+3 DMG per level' },
  defenseBonus: { name: 'Defense', emoji: '🛡️', desc: '+2 DEF per level' },
  startingShields: { name: 'Shields', emoji: '💠', desc: '+1 starting shield per level' },
  healingBonus: { name: 'Healing', emoji: '💚', desc: '+5% healing per level' },
};

function useForceUpdate() {
  const [, setTick] = useState(0);
  return useCallback(() => setTick((t) => t + 1), []);
}

// ─── Main Component ───────────────────────────────────────

export default function DungeonScreen() {
  const forceUpdate = useForceUpdate();
  const setScreen = useUIStore((s) => s.setScreen);

  const pagoda = engine.pagoda;
  const inRun = pagoda.inRun;
  const combatState = pagoda.combatState;

  if (inRun && combatState === 'victory') {
    return <VictoryView onContinue={() => { engine.advancePagodaFloor(); forceUpdate(); }} onReturn={() => setScreen('game')} />;
  }
  if (inRun && (combatState === 'defeat' || combatState === 'fled')) {
    return <DefeatView onReturn={() => { forceUpdate(); }} />;
  }
  if (inRun) {
    return <CombatView forceUpdate={forceUpdate} />;
  }
  return <LobbyView forceUpdate={forceUpdate} onBack={() => setScreen('game')} />;
}

// ─── Lobby View ───────────────────────────────────────────

function LobbyView({ forceUpdate, onBack }: { forceUpdate: () => void; onBack: () => void }) {
  const pagoda = engine.pagoda;
  const [autoClearTarget, setAutoClearTarget] = useState(Math.max(1, pagoda.highestFloor - 1));

  const maxAuto = Math.max(0, pagoda.highestFloor - 1);

  const handleStartRun = () => {
    engine.startPagodaRun();
    forceUpdate();
  };

  const handleAutoClear = () => {
    engine.autoClearPagoda(autoClearTarget);
    forceUpdate();
  };

  const handleBuyUpgrade = (type: UpgradeType) => {
    engine.purchasePagodaUpgrade(type);
    forceUpdate();
  };

  return (
    <div className="relative w-full h-screen bg-[#1a1a2e] overflow-y-auto font-mono text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#1a1a2e]/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-3 py-1 rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-xs cursor-pointer"
        >
          &larr; Sanctuary
        </button>
        <h1 className="text-xl font-bold text-[#FFD700]">The Infinite Pagoda</h1>
        {pagoda.highestFloor > 0 && (
          <span className="text-xs bg-[#FFD700]/20 text-[#FFD700] px-2 py-0.5 rounded">
            Highest: Floor {pagoda.highestFloor}
          </span>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Tokens" value={pagoda.tokens} emoji="🪙" />
          <StatCard label="Total Runs" value={pagoda.stats.totalRuns} emoji="🏃" />
          <StatCard label="Boss Kills" value={pagoda.stats.bossKills} emoji="💀" />
          <StatCard label="Highest DMG" value={pagoda.stats.highestDamage} emoji="💥" />
        </div>

        {/* Start Run */}
        <div className="bg-[#16213e] border border-white/10 rounded-lg p-6 text-center">
          <button
            onClick={handleStartRun}
            className="px-8 py-3 rounded-lg font-bold text-lg cursor-pointer transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #E94560, #b8304f)',
              border: '3px solid #8B0000',
              boxShadow: '0 4px 0 #5c0a0a, 0 0 20px rgba(233,69,96,0.3)',
              textShadow: '1px 1px 0 #000',
            }}
          >
            Enter the Pagoda
          </button>
          <p className="text-white/40 text-xs mt-2">Your cats&apos; stats contribute to your power</p>
        </div>

        {/* Auto-Clear */}
        {maxAuto > 0 && (
          <div className="bg-[#16213e] border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-bold text-white/80 mb-3">Auto-Clear (50% rewards)</h3>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={maxAuto}
                value={Math.min(autoClearTarget, maxAuto)}
                onChange={(e) => setAutoClearTarget(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-[#FFD700] w-16 text-right">
                Floor {Math.min(autoClearTarget, maxAuto)}
              </span>
              <button
                onClick={handleAutoClear}
                className="px-3 py-1 rounded bg-[#50C878]/20 text-[#50C878] border border-[#50C878]/30 text-xs hover:bg-[#50C878]/30 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Upgrades */}
        <div className="bg-[#16213e] border border-white/10 rounded-lg p-4">
          <h3 className="text-sm font-bold text-white/80 mb-3">Upgrades</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.keys(UPGRADE_INFO) as UpgradeType[]).map((type) => {
              const info = UPGRADE_INFO[type];
              const level = pagoda.upgrades[type];
              const cost = pagoda.getUpgradeCost(type);
              const canAfford = pagoda.tokens >= cost;
              return (
                <div key={type} className="bg-black/30 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{info.emoji}</span>
                    <span className="text-sm font-bold">{info.name}</span>
                    <span className="text-xs text-white/40 ml-auto">Lv {level}</span>
                  </div>
                  <p className="text-[10px] text-white/40 mb-2">{info.desc}</p>
                  <button
                    onClick={() => handleBuyUpgrade(type)}
                    disabled={!canAfford}
                    className="w-full px-2 py-1 rounded text-xs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: canAfford ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${canAfford ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      color: canAfford ? '#FFD700' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    🪙 {cost}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Run History */}
        {pagoda.runHistory.length > 0 && (
          <div className="bg-[#16213e] border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-bold text-white/80 mb-3">Recent Runs</h3>
            <div className="space-y-2">
              {pagoda.runHistory.slice(0, 5).map((run) => (
                <RunHistoryRow key={run.id} run={run} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div className="bg-[#16213e] border border-white/10 rounded-lg p-3 text-center">
      <span className="text-lg">{emoji}</span>
      <div className="text-lg font-bold text-[#FFD700]">{formatNumber(value)}</div>
      <div className="text-[10px] text-white/40">{label}</div>
    </div>
  );
}

function RunHistoryRow({ run }: { run: RunRecord }) {
  const reasonColor = run.reason === 'defeat' ? '#E94560' : run.reason === 'fled' ? '#FFD700' : '#50C878';
  return (
    <div className="flex items-center gap-3 text-xs bg-black/20 rounded px-3 py-2">
      <span className="font-bold text-white/80">Floor {run.floorsCleared}</span>
      <span style={{ color: reasonColor }}>{run.reason}</span>
      <span className="text-white/40 ml-auto">
        +{formatNumber(run.rewards.bp)} BP, +{run.rewards.tokens} tokens
      </span>
    </div>
  );
}

// ─── Combat View ──────────────────────────────────────────

function CombatView({ forceUpdate }: { forceUpdate: () => void }) {
  const pagoda = engine.pagoda;
  const player = pagoda.player;
  const enemy = pagoda.enemy;
  const [activeTab, setActiveTab] = useState<SkillCategory>('basic');
  const [combatLog, setCombatLog] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [combatLog]);

  const addLog = useCallback((entry: LogEntry) => {
    setCombatLog((prev) => [...prev.slice(-30), entry]);
  }, []);

  const handleCommand = useCallback((commandId: string) => {
    const result = engine.executePagodaCommand(commandId);
    if (!result.success) {
      addLog({ text: result.error || 'Failed!', color: '#E94560' });
      forceUpdate();
      return;
    }

    // Player action log
    const pa = result.playerAction as Record<string, unknown> | undefined;
    if (pa) {
      if (pa.fled) {
        addLog({ text: 'You fled the Pagoda!', color: '#FFD700' });
      } else if (pa.type === 'damage') {
        const critTag = pa.hits ? '' : '';
        addLog({ text: `You dealt ${formatNumber(pa.damage as number)} damage!${pa.stunned ? ' (STUNNED!)' : ''}`, color: '#50C878' });
      } else if (pa.type === 'heal') {
        addLog({ text: `Healed for ${formatNumber(pa.healed as number)} HP!`, color: '#4169E1' });
      } else if (pa.type === 'shield') {
        addLog({ text: `Shield raised! (${pa.shields} charges)`, color: '#4169E1' });
      } else if (pa.buffApplied) {
        addLog({ text: `Buffed ${pa.buffApplied as string}!`, color: '#9370DB' });
      } else if (pa.debuffApplied) {
        addLog({ text: `Debuffed enemy ${pa.debuffApplied as string}!`, color: '#9370DB' });
      } else if (pa.dodgeCharges) {
        addLog({ text: `Gained dodge charges! (${pa.dodgeCharges})`, color: '#4169E1' });
      } else if (pa.stunned) {
        addLog({ text: 'Enemy stunned!', color: '#FFD700' });
      } else if (pa.whiffed) {
        addLog({ text: 'It did nothing...', color: '#A0A0A0' });
      }
      if (pa.healed && pa.type === 'damage') {
        addLog({ text: `Lifesteal: +${formatNumber(pa.healed as number)} HP`, color: '#50C878' });
      }
      if (pa.selfDamage) {
        addLog({ text: `Self damage: ${formatNumber(pa.selfDamage as number)}`, color: '#E94560' });
      }
    }

    // Enemy defeated
    if (pa?.enemyDefeated) {
      addLog({ text: `${pa.enemyName as string} defeated!`, color: '#FFD700' });
      if (pa.bpEarned) addLog({ text: `+${formatNumber(pa.bpEarned as number)} BP`, color: '#FFD700' });
      if (pa.bossRewards) {
        const br = pa.bossRewards as { bp: number; tokens: number };
        addLog({ text: `BOSS LOOT: +${br.bp} BP, +${br.tokens} tokens!`, color: '#FF69B4' });
      }
      if (pa.loot) {
        const item = pa.loot as LootItem;
        addLog({ text: `Loot: ${item.name} (${item.rarity})`, color: RARITY_COLORS[item.rarity] || '#A0A0A0' });
      }
    }

    // Enemy action log
    const ea = result.enemyAction as Record<string, unknown> | undefined;
    if (ea && !pa?.enemyDefeated) {
      if (ea.stunned) {
        addLog({ text: 'Enemy is stunned!', color: '#FFD700' });
      } else if (ea.dodged) {
        addLog({ text: `Dodged! (${ea.dodgeChargesLeft} left)`, color: '#4169E1' });
      } else if (ea.shielded) {
        addLog({ text: `Shield absorbed the hit! (${ea.shieldChargesLeft} left)`, color: '#4169E1' });
      } else if (ea.countered) {
        addLog({ text: `Countered for ${formatNumber(ea.counterDamage as number)} damage!`, color: '#50C878' });
      } else if (ea.damage) {
        addLog({ text: `Enemy attacks for ${formatNumber(ea.damage as number)} damage!`, color: '#E94560' });
        if ((ea.reflected as number) > 0) {
          addLog({ text: `Reflected ${formatNumber(ea.reflected as number)} back!`, color: '#9370DB' });
        }
      }
    }

    forceUpdate();
  }, [forceUpdate, addLog]);

  if (!enemy) return null;

  const commands = pagoda.getAllCommands();
  const tabCommands = commands.filter((c) => c.category === activeTab);

  return (
    <div className="relative w-full h-screen bg-[#1a1a2e] font-mono text-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#16213e]/95 border-b border-white/10 px-4 py-2 flex items-center gap-3">
        <span className="text-sm font-bold text-[#FFD700]">Floor {pagoda.currentFloor}</span>
        {enemy.isBoss && <span className="text-[10px] bg-[#E94560]/20 text-[#E94560] px-2 py-0.5 rounded">BOSS</span>}
        {pagoda.floorModifiers.map((mod) => (
          <ModifierBadge key={mod.id} mod={mod} />
        ))}
      </div>

      {/* Main combat area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Player + Enemy + Commands */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          {/* Enemy Display */}
          <div className="flex-shrink-0 bg-[#16213e] border border-white/10 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{enemy.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{enemy.name}</span>
                  {enemy.element && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${ELEMENT_COLORS[enemy.element]}20`, color: ELEMENT_COLORS[enemy.element] }}
                    >
                      {enemy.element}
                    </span>
                  )}
                  {enemy.isBoss && enemy.maxPhases > 1 && (
                    <span className="text-[10px] text-white/40">Phase {enemy.phase}/{enemy.maxPhases}</span>
                  )}
                </div>
                {/* Enemy HP Bar */}
                <HPBar current={enemy.hp} max={enemy.maxHp} color="#E94560" />
                <div className="text-[10px] text-white/40 mt-1">
                  ATK: {enemy.damage} | DEF: {enemy.defense} | SPD: {enemy.speed.toFixed(1)}
                </div>
              </div>
            </div>
            {/* Enemy buffs/debuffs */}
            <StatusEffects buffs={enemy.buffs} debuffs={enemy.debuffs} />
          </div>

          {/* Player Display */}
          <div className="flex-shrink-0 bg-[#16213e] border border-white/10 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐱</span>
              <div className="flex-1">
                <HPBar current={player.hp} max={player.maxHp} color="#50C878" />
                <div className="flex items-center gap-3 mt-1 text-[10px] text-white/50">
                  <span>ATK: {player.damage}</span>
                  <span>DEF: {player.defense}</span>
                  <span>CRIT: {(player.crit * 100).toFixed(0)}%</span>
                  {player.shieldCharges > 0 && (
                    <span className="text-[#4169E1]">🛡️ x{player.shieldCharges}</span>
                  )}
                  {player.dodgeCharges > 0 && (
                    <span className="text-[#FFD700]">💨 x{player.dodgeCharges}</span>
                  )}
                </div>
              </div>
            </div>
            <StatusEffects buffs={player.buffs} debuffs={player.debuffs} />
          </div>

          {/* Command Tabs */}
          <div className="flex-shrink-0 flex gap-1 mb-2 flex-wrap">
            {(Object.keys(CATEGORY_LABELS) as SkillCategory[]).map((cat) => {
              const count = commands.filter((c) => c.category === cat && !c.locked).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all"
                  style={{
                    backgroundColor: activeTab === cat ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                    borderColor: activeTab === cat ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)',
                    color: activeTab === cat ? '#FFD700' : 'rgba(255,255,255,0.5)',
                    border: '1px solid',
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>

          {/* Command Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tabCommands.map((cmd) => (
              <CommandButton key={cmd.id} cmd={cmd} onClick={handleCommand} />
            ))}
          </div>
        </div>

        {/* Right: Combat Log */}
        <div className="w-64 border-l border-white/10 bg-black/20 flex flex-col">
          <div className="px-3 py-2 border-b border-white/10 text-[10px] text-white/40 font-bold">
            Combat Log
          </div>
          <div ref={logRef} className="flex-1 overflow-y-auto p-2 space-y-1">
            {combatLog.map((entry, i) => (
              <div key={i} className="text-[10px]" style={{ color: entry.color }}>
                {entry.text}
              </div>
            ))}
            {combatLog.length === 0 && (
              <div className="text-[10px] text-white/20 text-center mt-4">Choose a command to begin...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LogEntry {
  text: string;
  color: string;
}

function CommandButton({ cmd, onClick }: {
  cmd: BoopCommand & { locked: boolean; onCooldown: boolean; cooldownLeft: number; used: boolean };
  onClick: (id: string) => void;
}) {
  const disabled = cmd.locked || cmd.onCooldown || cmd.used;

  return (
    <button
      onClick={() => !disabled && onClick(cmd.id)}
      disabled={disabled}
      className="relative px-2 py-2 rounded text-left cursor-pointer disabled:cursor-not-allowed transition-all hover:bg-white/5"
      style={{
        backgroundColor: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)'}`,
        opacity: disabled ? 0.4 : 1,
      }}
      title={`${cmd.description}${cmd.cooldown > 0 ? ` (CD: ${cmd.cooldown})` : ''}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{cmd.emoji}</span>
        <span className="text-[10px] font-bold truncate">{cmd.name}</span>
      </div>
      {cmd.onCooldown && (
        <div className="absolute top-0 right-0 bg-black/70 text-[10px] text-[#E94560] px-1 rounded-bl">
          {cmd.cooldownLeft}
        </div>
      )}
      {cmd.used && (
        <div className="absolute top-0 right-0 bg-black/70 text-[10px] text-white/30 px-1 rounded-bl">
          Used
        </div>
      )}
      {cmd.locked && (
        <div className="absolute top-0 right-0 bg-black/70 text-[10px] text-white/20 px-1 rounded-bl">
          🔒
        </div>
      )}
    </button>
  );
}

// ─── Victory View ─────────────────────────────────────────

function VictoryView({ onContinue, onReturn }: { onContinue: () => void; onReturn: () => void }) {
  const pagoda = engine.pagoda;

  return (
    <div className="relative w-full h-screen bg-[#1a1a2e] font-mono text-white flex items-center justify-center">
      <div className="bg-[#16213e] border border-[#FFD700]/30 rounded-lg p-8 text-center max-w-md">
        <div className="text-4xl mb-2">⚔️</div>
        <h2 className="text-xl font-bold text-[#FFD700] mb-2">Enemy Defeated!</h2>
        <p className="text-sm text-white/60 mb-4">Floor {pagoda.currentFloor} cleared</p>

        {/* Recent loot */}
        {pagoda.rewards.items.length > 0 && (
          <div className="mb-4 text-xs">
            <span className="text-white/40">Latest loot: </span>
            <span style={{ color: RARITY_COLORS[pagoda.rewards.items[pagoda.rewards.items.length - 1].rarity] }}>
              {pagoda.rewards.items[pagoda.rewards.items.length - 1].name}
            </span>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={onContinue}
            className="px-6 py-2 rounded-lg font-bold text-sm cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #50C878, #3D9970)',
              border: '2px solid #2D7B50',
              textShadow: '1px 1px 0 #000',
            }}
          >
            Next Floor &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Defeat/Fled View ─────────────────────────────────────

function DefeatView({ onReturn }: { onReturn: () => void }) {
  const pagoda = engine.pagoda;
  const setScreen = useUIStore((s) => s.setScreen);
  const reason = pagoda.combatState === 'fled' ? 'Fled' : 'Defeated';
  const lastRun = pagoda.runHistory[0];

  return (
    <div className="relative w-full h-screen bg-[#1a1a2e] font-mono text-white flex items-center justify-center">
      <div className="bg-[#16213e] border border-[#E94560]/30 rounded-lg p-8 text-center max-w-md">
        <div className="text-4xl mb-2">{reason === 'Fled' ? '🏃' : '💀'}</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: reason === 'Fled' ? '#FFD700' : '#E94560' }}>
          {reason === 'Fled' ? 'Tactical Retreat!' : 'Run Over'}
        </h2>

        {lastRun && (
          <div className="text-sm text-white/60 mb-4 space-y-1">
            <p>Floors Cleared: {lastRun.floorsCleared}</p>
            <p className="text-[#FFD700]">+{formatNumber(lastRun.rewards.bp)} BP</p>
            <p className="text-[#FFD700]">+{lastRun.rewards.tokens} Tokens</p>
            {lastRun.rewards.items.length > 0 && (
              <p className="text-white/40">{lastRun.rewards.items.length} items collected</p>
            )}
          </div>
        )}

        <button
          onClick={() => { onReturn(); setScreen('dungeon'); }}
          className="px-6 py-2 rounded-lg font-bold text-sm cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          Return to Lobby
        </button>
      </div>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────

function HPBar({ current, max, color }: { current: number; max: number; color: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  return (
    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
      <div className="relative -top-3 text-[9px] text-white/80 text-center font-bold" style={{ textShadow: '0 1px 2px #000' }}>
        {formatNumber(current)}/{formatNumber(max)}
      </div>
    </div>
  );
}

function StatusEffects({ buffs, debuffs }: { buffs: { id: string; stat: string; turnsLeft: number }[]; debuffs: { id: string; stat: string; turnsLeft: number }[] }) {
  if (buffs.length === 0 && debuffs.length === 0) return null;
  return (
    <div className="flex gap-1 mt-1 flex-wrap">
      {buffs.map((b, i) => (
        <span key={`b-${i}`} className="text-[9px] bg-[#50C878]/20 text-[#50C878] px-1 rounded">
          {b.stat} +{b.turnsLeft}t
        </span>
      ))}
      {debuffs.map((d, i) => (
        <span key={`d-${i}`} className="text-[9px] bg-[#E94560]/20 text-[#E94560] px-1 rounded">
          {d.stat} {d.turnsLeft}t
        </span>
      ))}
    </div>
  );
}

function ModifierBadge({ mod }: { mod: FloorModifier }) {
  return (
    <span className="text-[10px] bg-[#9370DB]/20 text-[#9370DB] px-1.5 py-0.5 rounded" title={mod.description}>
      {mod.name}
    </span>
  );
}
