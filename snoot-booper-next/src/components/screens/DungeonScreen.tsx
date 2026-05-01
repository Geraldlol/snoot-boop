/**
 * DungeonScreen — The Infinite Pagoda (wuxia reskin).
 *
 * Same combat logic and engine surface as before; visuals updated to match
 * the wuxia shell (parallax bg, .panel framing, glyph badges, .meter bars,
 * Cinzel/Cormorant typography).
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useUIStore } from '@/store/ui-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import { starterArt } from '@/lib/art-assets';
import type {
  BoopCommand,
  SkillCategory,
  UpgradeType,
  LootItem,
  FloorModifier,
  RunRecord,
} from '@/engine/systems/combat/pagoda-system';

import WorldCanvas from '../shell/WorldCanvas';
import ParallaxMountains from '../shell/ParallaxMountains';
import SceneBackdrop from '../shell/SceneBackdrop';

// ─── Helpers ──────────────────────────────────────────────

const RARITY_COLORS: Record<string, string> = {
  common:    '#A0A0A0',
  uncommon:  'var(--jade)',
  rare:      '#4169E1',
  legendary: 'var(--gold-bright)',
  mythic:    '#FF69B4',
};

const ELEMENT_COLORS: Record<string, string> = {
  fire:   'var(--vermillion)',
  water:  '#4169E1',
  nature: 'var(--jade)',
  light:  'var(--gold-bright)',
  void:   '#9370DB',
};

const ELEMENT_GLYPHS: Record<string, string> = {
  fire: '火', water: '水', nature: '木', light: '光', void: '玄',
};

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  basic:     'Basic',
  offensive: 'Offensive',
  defensive: 'Defensive',
  utility:   'Utility',
  ultimate:  'Ultimate',
  meme:      'Meme',
};

const UPGRADE_INFO: Record<UpgradeType, { name: string; glyph: string; desc: string }> = {
  maxHpBonus:       { name: 'Max HP',  glyph: '心', desc: '+20 HP per level' },
  damageBonus:      { name: 'Damage',  glyph: '刃', desc: '+3 DMG per level' },
  defenseBonus:     { name: 'Defense', glyph: '盾', desc: '+2 DEF per level' },
  startingShields:  { name: 'Shields', glyph: '陣', desc: '+1 starting shield per level' },
  healingBonus:     { name: 'Healing', glyph: '癒', desc: '+5% healing per level' },
};

function useForceUpdate() {
  const [, setTick] = useState(0);
  return useCallback(() => setTick((t) => t + 1), []);
}

// ─── Main Component ───────────────────────────────────────

export default function DungeonScreen() {
  const forceUpdate = useForceUpdate();
  const setScreen = useUIStore((s) => s.setScreen);
  const openPanel = useUIStore((s) => s.openPanel);

  const pagoda = engine.pagoda;
  const inRun = pagoda.inRun;
  const combatState = pagoda.combatState;

  if (inRun && combatState === 'victory') {
    return (
      <VictoryView
        onContinue={() => { engine.advancePagodaFloor(); forceUpdate(); }}
        onReturn={() => { engine.retreatPagodaRun(); forceUpdate(); }}
      />
    );
  }
  if (inRun && (combatState === 'defeat' || combatState === 'fled')) {
    return <DefeatView onReturn={forceUpdate} />;
  }
  if (inRun) {
    return <CombatView forceUpdate={forceUpdate} />;
  }
  return <LobbyView forceUpdate={forceUpdate} onBack={() => { openPanel('sanctuary'); setScreen('game'); }} />;
}

// ─── Lobby View ───────────────────────────────────────────

function LobbyView({ forceUpdate, onBack }: { forceUpdate: () => void; onBack: () => void }) {
  const pagoda = engine.pagoda;
  const [autoClearTarget, setAutoClearTarget] = useState(Math.max(1, pagoda.highestFloor - 1));
  const maxAuto = Math.max(0, pagoda.highestFloor - 1);

  return (
    <div className="relative min-h-screen overflow-y-auto" style={{ background: 'var(--bg-0)' }}>
      <SceneBackdrop src={starterArt.backgrounds.pagoda} tone="combat" />
      <WorldCanvas />
      <ParallaxMountains />

      {/* Sticky header */}
      <div className="hud-top sticky top-0 z-20 relative">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 min-h-[68px] py-3 flex items-center gap-3 sm:gap-4">
          <button
            className="btn shrink-0"
            style={{ padding: '6px 12px', fontSize: 10 }}
            onClick={onBack}
          >
            ← Sanctuary
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="glyph-badge" style={{ color: 'var(--gold-bright)', width: 38, height: 38 }}>
              <span style={{ fontSize: 16 }}>塔</span>
            </div>
            <div className="min-w-0 leading-tight">
              <div className="font-display text-[16px] sm:text-[18px] font-black tracking-[0.08em] sm:tracking-[0.10em] gold-text">
                The Infinite Pagoda
              </div>
              <div className="h-eyebrow leading-relaxed [overflow-wrap:anywhere]">Each floor a tribulation, each victory a step toward heaven</div>
            </div>
          </div>
          {pagoda.highestFloor > 0 && (
            <span className="font-display text-[11px] tracking-[0.16em] uppercase px-3 py-1.5"
              style={{ color: 'var(--gold-bright)', background: 'rgba(230,194,117,0.10)', border: '1px solid var(--gold)' }}>
              Highest · Floor {pagoda.highestFloor}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5 sm:py-6 relative" style={{ zIndex: 5 }}>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <PagodaStat label="Tokens"      value={pagoda.tokens}                  glyph="幣" />
          <PagodaStat label="Total Runs"  value={pagoda.stats.totalRuns}         glyph="行" />
          <PagodaStat label="Boss Kills"  value={pagoda.stats.bossKills}         glyph="魁" />
          <PagodaStat label="Highest DMG" value={pagoda.stats.highestDamage}     glyph="撃" />
        </div>

        {/* Enter pagoda hero */}
        <div className="panel panel-ornate panel-elite p-6 mb-5 text-center">
          <button
            className="btn ascend-btn ready"
            style={{ padding: '14px 32px', fontSize: 13 }}
            onClick={() => { engine.startPagodaRun(); forceUpdate(); }}
          >
            ⚡ Enter the Pagoda
          </button>
          <p className="text-xs italic mt-3" style={{ color: 'var(--ink-mute)' }}>
            Your cats&apos; aggregate stats determine your power within.
          </p>
        </div>

        {/* Auto-clear */}
        {maxAuto > 0 && (
          <div className="panel p-4 mb-5" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="h-section text-left mb-3" style={{ fontSize: 11 }}>Auto-Clear · 50% rewards</div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={maxAuto}
                value={Math.min(autoClearTarget, maxAuto)}
                onChange={(e) => setAutoClearTarget(Number(e.target.value))}
                className="flex-1"
              />
              <span className="font-display nums text-[14px]" style={{ color: 'var(--gold-bright)', minWidth: 90, textAlign: 'right' }}>
                Floor {Math.min(autoClearTarget, maxAuto)}
              </span>
              <button className="btn btn-primary" onClick={() => { engine.autoClearPagoda(autoClearTarget); forceUpdate(); }}>
                Sweep
              </button>
            </div>
          </div>
        )}

        {/* Upgrades */}
        <div className="panel p-4 mb-5" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="h-section text-left mb-3" style={{ fontSize: 11 }}>Pagoda Upgrades</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.keys(UPGRADE_INFO) as UpgradeType[]).map((type) => {
              const info = UPGRADE_INFO[type];
              const level = pagoda.upgrades[type];
              const cost = pagoda.getUpgradeCost(type);
              const canAfford = pagoda.tokens >= cost;
              return (
                <div key={type} className="panel p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="rune flex-shrink-0"
                      style={{
                        width: 32, height: 32, fontSize: 16,
                        background: 'radial-gradient(circle at 35% 30%, rgba(255,225,170,0.3), rgba(120,80,30,0.25) 60%, rgba(0,0,0,0.4))',
                        border: '1px solid var(--gold-deep)',
                        color: '#fff7df',
                      }}
                    >
                      {info.glyph}
                    </div>
                    <span className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>{info.name}</span>
                    <span className="ml-auto font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>Lv {level}</span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--ink-mute)' }}>{info.desc}</p>
                  <button
                    className="btn w-full"
                    disabled={!canAfford}
                    onClick={() => { engine.purchasePagodaUpgrade(type); forceUpdate(); }}
                    style={{ padding: '6px 8px', fontSize: 10 }}
                  >
                    {cost} tokens
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent runs */}
        {pagoda.runHistory.length > 0 && (
          <div className="panel p-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="h-section text-left mb-3" style={{ fontSize: 11 }}>Recent Runs</div>
            <div className="flex flex-col gap-1">
              {pagoda.runHistory.slice(0, 5).map((run) => <RunHistoryRow key={run.id} run={run} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PagodaStat({ label, value, glyph }: { label: string; value: number; glyph: string }) {
  return (
    <div className="panel p-3 text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div
        className="rune mx-auto mb-1.5"
        style={{
          width: 36, height: 36, fontSize: 16,
          background: 'radial-gradient(circle at 35% 30%, rgba(255,225,170,0.3), rgba(120,80,30,0.25) 60%, rgba(0,0,0,0.4))',
          border: '1px solid var(--gold-deep)',
          color: '#fff7df',
        }}
      >
        {glyph}
      </div>
      <div className="font-display nums text-[16px]" style={{ color: 'var(--gold-bright)' }}>{formatNumber(value)}</div>
      <div className="h-eyebrow">{label}</div>
    </div>
  );
}

function RunHistoryRow({ run }: { run: RunRecord }) {
  const reasonColor = run.reason === 'defeat'
    ? 'var(--vermillion-bright)'
    : run.reason === 'fled'
    ? 'var(--gold-bright)'
    : 'var(--jade-bright)';
  return (
    <div className="flex items-center gap-3 px-3 py-2 font-mono text-xs" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--rule)' }}>
      <span className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>Floor {run.floorsCleared}</span>
      <span className="font-display text-[10px] tracking-[0.16em] uppercase" style={{ color: reasonColor }}>{run.reason}</span>
      <span className="ml-auto" style={{ color: 'var(--ink-mute)' }}>
        +{formatNumber(run.rewards.bp)} bp · +{run.rewards.tokens} tokens · +{formatNumber(run.rewards.spiritStones ?? 0)} stones
      </span>
    </div>
  );
}

// ─── Combat View ──────────────────────────────────────────

interface LogEntry { text: string; color: string; }

function CombatView({ forceUpdate }: { forceUpdate: () => void }) {
  const pagoda = engine.pagoda;
  const player = pagoda.player;
  const enemy = pagoda.enemy;
  const [activeTab, setActiveTab] = useState<SkillCategory>('basic');
  const [combatLog, setCombatLog] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [combatLog]);

  const addLog = useCallback((entry: LogEntry) => {
    setCombatLog((prev) => [...prev.slice(-30), entry]);
  }, []);

  const handleCommand = useCallback((commandId: string) => {
    const result = engine.executePagodaCommand(commandId);
    if (!result.success) {
      addLog({ text: result.error || 'Failed!', color: 'var(--vermillion-bright)' });
      forceUpdate();
      return;
    }

    const pa = result.playerAction as Record<string, unknown> | undefined;
    if (pa) {
      if (pa.fled)                                 addLog({ text: 'You fled the Pagoda!',                                     color: 'var(--gold-bright)' });
      else if (pa.type === 'damage')               addLog({ text: `You dealt ${formatNumber(pa.damage as number)} damage!${pa.stunned ? ' (STUNNED!)' : ''}`, color: 'var(--jade-bright)' });
      else if (pa.type === 'heal')                 addLog({ text: `Healed for ${formatNumber(pa.healed as number)} HP!`,      color: '#4169E1' });
      else if (pa.type === 'shield')               addLog({ text: `Shield raised! (${pa.shields} charges)`,                   color: '#4169E1' });
      else if (pa.buffApplied)                     addLog({ text: `Buffed ${pa.buffApplied as string}!`,                       color: '#9370DB' });
      else if (pa.debuffApplied)                   addLog({ text: `Debuffed enemy ${pa.debuffApplied as string}!`,             color: '#9370DB' });
      else if (pa.dodgeCharges)                    addLog({ text: `Gained dodge charges! (${pa.dodgeCharges})`,                color: '#4169E1' });
      else if (pa.stunned)                         addLog({ text: 'Enemy stunned!',                                            color: 'var(--gold-bright)' });
      else if (pa.whiffed)                         addLog({ text: 'It did nothing...',                                         color: 'var(--ink-dim)' });

      if (pa.healed && pa.type === 'damage')       addLog({ text: `Lifesteal · +${formatNumber(pa.healed as number)} HP`,      color: 'var(--jade-bright)' });
      if (pa.selfDamage)                           addLog({ text: `Self damage · ${formatNumber(pa.selfDamage as number)}`,    color: 'var(--vermillion-bright)' });
    }

    if (pa?.enemyDefeated) {
      addLog({ text: `${pa.enemyName as string} defeated!`, color: 'var(--gold-bright)' });
      if (pa.bpEarned) addLog({ text: `+${formatNumber(pa.bpEarned as number)} BP`, color: 'var(--gold-bright)' });
      if (pa.spiritStonesEarned) addLog({ text: `+${formatNumber(pa.spiritStonesEarned as number)} spirit stones`, color: '#9370DB' });
      if (pa.bossRewards) {
        const br = pa.bossRewards as { bp: number; tokens: number; spiritStones?: number };
        addLog({ text: `BOSS LOOT · +${br.bp} BP · +${br.tokens} tokens · +${br.spiritStones ?? 0} stones`, color: '#FF69B4' });
      }
      if (pa.loot) {
        const item = pa.loot as LootItem;
        addLog({ text: `Loot · ${item.name} (${item.rarity})`, color: RARITY_COLORS[item.rarity] || 'var(--ink-mute)' });
      }
    }

    const ea = result.enemyAction as Record<string, unknown> | undefined;
    if (ea && !pa?.enemyDefeated) {
      if (ea.stunned)                              addLog({ text: 'Enemy is stunned!',                                       color: 'var(--gold-bright)' });
      else if (ea.dodged)                          addLog({ text: `Dodged! (${ea.dodgeChargesLeft} left)`,                   color: '#4169E1' });
      else if (ea.shielded)                        addLog({ text: `Shield absorbed the hit! (${ea.shieldChargesLeft} left)`, color: '#4169E1' });
      else if (ea.countered)                       addLog({ text: `Countered for ${formatNumber(ea.counterDamage as number)} damage!`, color: 'var(--jade-bright)' });
      else if (ea.damage) {
        addLog({ text: `Enemy attacks for ${formatNumber(ea.damage as number)} damage!`, color: 'var(--vermillion-bright)' });
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
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg-0)' }}>
      <SceneBackdrop src={starterArt.backgrounds.pagoda} tone="combat" />
      <WorldCanvas />
      <ParallaxMountains />

      {/* Top bar */}
      <div className="hud-top relative z-20">
        <div className="max-w-[1300px] mx-auto px-4 h-[58px] flex items-center gap-3">
          <span className="font-display text-[14px] tracking-[0.10em]" style={{ color: 'var(--gold-bright)' }}>
            Floor {pagoda.currentFloor}
          </span>
          {enemy.isBoss && (
            <span className="font-display text-[10px] tracking-[0.16em] uppercase px-2 py-0.5" style={{ color: 'var(--vermillion-bright)', background: 'rgba(214,91,64,0.16)', border: '1px solid var(--vermillion)' }}>
              BOSS
            </span>
          )}
          <div className="flex gap-1.5 flex-wrap ml-2">
            {pagoda.floorModifiers.map((mod) => <ModifierBadge key={mod.id} mod={mod} />)}
          </div>
        </div>
      </div>

      {/* Combat area */}
      <div className="flex-1 flex overflow-hidden relative" style={{ zIndex: 5 }}>
        {/* Left column */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto max-w-[900px] mx-auto w-full">
          {/* Enemy */}
          <div className="panel panel-ornate p-4 mb-3" style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'var(--vermillion)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="rune flex-shrink-0"
                style={{
                  width: 56, height: 56, fontSize: 28,
                  background: enemy.element
                    ? `radial-gradient(circle at 35% 30%, ${ELEMENT_COLORS[enemy.element]}55, ${ELEMENT_COLORS[enemy.element]}22 60%, rgba(0,0,0,0.4))`
                    : 'radial-gradient(circle at 35% 30%, rgba(214,91,64,0.45), rgba(91,30,20,0.45) 60%, rgba(0,0,0,0.4))',
                  border: `1px solid ${enemy.element ? ELEMENT_COLORS[enemy.element] : 'var(--vermillion)'}`,
                  color: '#fff7df',
                }}
              >
                {enemy.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display text-[14px] tracking-[0.06em]" style={{ color: '#fff7df' }}>{enemy.name}</span>
                  {enemy.element && (
                    <span className="trait-chip" style={{ color: ELEMENT_COLORS[enemy.element], borderColor: `${ELEMENT_COLORS[enemy.element]}66` }}>
                      {ELEMENT_GLYPHS[enemy.element] ?? '?'} {enemy.element}
                    </span>
                  )}
                  {enemy.isBoss && enemy.maxPhases > 1 && (
                    <span className="font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>
                      Phase {enemy.phase}/{enemy.maxPhases}
                    </span>
                  )}
                </div>
                <HPBar current={enemy.hp} max={enemy.maxHp} variant="crimson" />
                <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--ink-mute)' }}>
                  ATK {enemy.damage} · DEF {enemy.defense} · SPD {enemy.speed.toFixed(1)}
                </div>
                <StatusEffects buffs={enemy.buffs} debuffs={enemy.debuffs} />
              </div>
            </div>
          </div>

          {/* Player */}
          <div className="panel p-4 mb-4" style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'var(--jade)' }}>
            <div className="flex items-center gap-3">
              <div
                className="rune flex-shrink-0"
                style={{
                  width: 48, height: 48, fontSize: 22,
                  background: 'radial-gradient(circle at 35% 30%, rgba(109,197,168,0.45), rgba(42,104,86,0.4) 60%, rgba(0,0,0,0.4))',
                  border: '1px solid var(--jade)',
                  color: '#fff7df',
                }}
              >
                貓
              </div>
              <div className="flex-1 min-w-0">
                <HPBar current={player.hp} max={player.maxHp} variant="jade" />
                <div className="flex items-center gap-3 mt-1.5 font-mono text-[10px] flex-wrap" style={{ color: 'var(--ink-mute)' }}>
                  <span>ATK {player.damage}</span>
                  <span>DEF {player.defense}</span>
                  <span>CRIT {(player.crit * 100).toFixed(0)}%</span>
                  {player.shieldCharges > 0 && <span style={{ color: '#4169E1' }}>🛡 ×{player.shieldCharges}</span>}
                  {player.dodgeCharges > 0 && <span style={{ color: 'var(--gold-bright)' }}>💨 ×{player.dodgeCharges}</span>}
                </div>
                <StatusEffects buffs={player.buffs} debuffs={player.debuffs} />
              </div>
            </div>
          </div>

          {/* Command tabs */}
          <div className="flex gap-0 mb-2 flex-wrap border-b" style={{ borderColor: 'var(--rule)' }}>
            {(Object.keys(CATEGORY_LABELS) as SkillCategory[]).map((cat) => {
              const count = commands.filter((c) => c.category === cat && !c.locked).length;
              if (count === 0) return null;
              const active = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className="font-display text-[10px] tracking-[0.16em] uppercase px-3 py-1.5 cursor-pointer"
                  style={{
                    color: active ? 'var(--gold-bright)' : 'var(--ink-mute)',
                    borderBottom: `2px solid ${active ? 'var(--gold)' : 'transparent'}`,
                    marginBottom: -1,
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>

          {/* Command grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tabCommands.map((cmd) => <CommandButton key={cmd.id} cmd={cmd} onClick={handleCommand} />)}
          </div>
        </div>

        {/* Right: combat log */}
        <div className="w-72 panel flex flex-col" style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 0, borderTop: 0, borderRight: 0, borderBottom: 0 }}>
          <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--rule)' }}>
            <div className="h-eyebrow">Combat Log</div>
          </div>
          <div ref={logRef} className="flex-1 overflow-y-auto p-3 space-y-1">
            {combatLog.length === 0 && (
              <div className="text-xs italic text-center mt-4" style={{ color: 'var(--ink-dim)' }}>
                Choose a command to begin...
              </div>
            )}
            {combatLog.map((entry, i) => (
              <div key={i} className="font-mono text-[11px]" style={{ color: entry.color }}>{entry.text}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
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
      className="relative card-row text-left px-3 py-2 cursor-pointer disabled:cursor-not-allowed"
      style={{
        background: disabled ? 'rgba(0,0,0,0.4)' : 'rgba(230,194,117,0.06)',
        border: `1px solid ${disabled ? 'var(--rule)' : 'var(--gold-deep)'}`,
        opacity: disabled ? 0.45 : 1,
      }}
      title={`${cmd.description}${cmd.cooldown > 0 ? ` (CD: ${cmd.cooldown})` : ''}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{cmd.emoji}</span>
        <span className="font-display text-[11px] tracking-[0.06em] truncate" style={{ color: '#fff7df' }}>
          {cmd.name}
        </span>
      </div>
      {cmd.onCooldown && (
        <div className="absolute top-0 right-0 px-1.5 font-mono text-[10px]" style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--vermillion-bright)' }}>
          {cmd.cooldownLeft}
        </div>
      )}
      {cmd.used && (
        <div className="absolute top-0 right-0 px-1.5 font-mono text-[10px]" style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--ink-dim)' }}>
          used
        </div>
      )}
      {cmd.locked && (
        <div className="absolute top-0 right-0 px-1.5 font-mono text-[10px]" style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--ink-dim)' }}>
          🔒
        </div>
      )}
    </button>
  );
}

// ─── Victory / Defeat Views ───────────────────────────────

function VictoryView({ onContinue, onReturn }: { onContinue: () => void; onReturn: () => void }) {
  const pagoda = engine.pagoda;
  const lastItem = pagoda.rewards.items[pagoda.rewards.items.length - 1];

  return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-0)' }}>
      <SceneBackdrop src={starterArt.backgrounds.tournament} tone="tournament" />
      <WorldCanvas />
      <ParallaxMountains />
      <div className="panel panel-ornate panel-elite p-8 text-center max-w-md relative" style={{ zIndex: 5, borderColor: 'var(--gold-bright)' }}>
        <div
          className="rune mx-auto mb-4"
          style={{
            width: 72, height: 72, fontSize: 32,
            background: 'radial-gradient(circle at 35% 30%, rgba(255,225,170,0.6), rgba(120,80,30,0.5) 60%, rgba(0,0,0,0.4))',
            border: '1px solid var(--gold-bright)',
            color: '#fff7df',
            textShadow: '0 0 18px rgba(255,225,170,0.9)',
            animation: 'orbBreath 4s ease-in-out infinite',
          }}
        >
          勝
        </div>
        <h2 className="font-display text-[20px] font-black tracking-[0.10em] mb-2 gold-text">
          Enemy Defeated
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--ink-mute)' }}>
          Floor {pagoda.currentFloor} cleared
        </p>

        <div className="mb-3 font-mono text-[11px]" style={{ color: 'var(--gold-bright)' }}>
          Banked · +{formatNumber(pagoda.rewards.bp)} BP · +{pagoda.rewards.tokens} tokens · +{formatNumber(pagoda.rewards.spiritStones)} stones
        </div>

        {lastItem && (
          <div className="mb-5 font-mono text-[11px]">
            <span style={{ color: 'var(--ink-dim)' }}>latest loot · </span>
            <span style={{ color: RARITY_COLORS[lastItem.rarity] }}>{lastItem.name}</span>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button className="btn" style={{ padding: '10px 18px' }} onClick={onReturn}>
            Return with Loot
          </button>
        <button className="btn ascend-btn ready" style={{ padding: '10px 24px' }} onClick={onContinue}>
          Next Floor →
        </button>
        </div>
      </div>
    </div>
  );
}

function DefeatView({ onReturn }: { onReturn: () => void }) {
  const pagoda = engine.pagoda;
  const setScreen = useUIStore((s) => s.setScreen);
  const reason = pagoda.combatState === 'fled' ? 'fled' : 'defeated';
  const lastRun = pagoda.runHistory[0];
  const isFled = reason === 'fled';

  return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-0)' }}>
      <SceneBackdrop src={starterArt.backgrounds.pagoda} tone="combat" />
      <WorldCanvas />
      <ParallaxMountains />
      <div className="panel panel-ornate p-8 text-center max-w-md relative" style={{ zIndex: 5, borderColor: isFled ? 'var(--gold)' : 'var(--vermillion)' }}>
        <div
          className="rune mx-auto mb-4"
          style={{
            width: 72, height: 72, fontSize: 32,
            background: isFled
              ? 'radial-gradient(circle at 35% 30%, rgba(230,194,117,0.55), rgba(120,80,30,0.4) 60%, rgba(0,0,0,0.4))'
              : 'radial-gradient(circle at 35% 30%, rgba(214,91,64,0.55), rgba(91,30,20,0.4) 60%, rgba(0,0,0,0.4))',
            border: `1px solid ${isFled ? 'var(--gold-bright)' : 'var(--vermillion)'}`,
            color: '#fff7df',
          }}
        >
          {isFled ? '退' : '亡'}
        </div>
        <h2 className="font-display text-[20px] font-black tracking-[0.10em] mb-2"
          style={{ color: isFled ? 'var(--gold-bright)' : 'var(--vermillion-bright)' }}>
          {isFled ? 'Tactical Retreat' : 'Run Ended'}
        </h2>

        {lastRun && (
          <div className="mb-5 font-mono text-[11px] space-y-0.5" style={{ color: 'var(--ink-mute)' }}>
            <p>Floors Cleared · {lastRun.floorsCleared}</p>
            <p style={{ color: 'var(--gold-bright)' }}>+{formatNumber(lastRun.rewards.bp)} BP</p>
            <p style={{ color: 'var(--gold-bright)' }}>+{lastRun.rewards.tokens} tokens</p>
            <p style={{ color: '#9370DB' }}>+{formatNumber(lastRun.rewards.spiritStones ?? 0)} spirit stones</p>
            {lastRun.rewards.items.length > 0 && (
              <p>{lastRun.rewards.items.length} items collected</p>
            )}
          </div>
        )}

        <button
          className="btn"
          style={{ padding: '10px 24px' }}
          onClick={() => { onReturn(); setScreen('dungeon'); }}
        >
          Return to Lobby
        </button>
      </div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────

function HPBar({ current, max, variant }: { current: number; max: number; variant: 'jade' | 'crimson' }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  return (
    <div className="relative">
      <div className="meter" style={{ height: 12 }}>
        <div className={`meter-fill ${variant}`} style={{ width: `${pct}%` }} />
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center font-mono text-[10px]"
        style={{ color: '#fff7df', textShadow: '0 1px 2px #000' }}
      >
        {formatNumber(current)} / {formatNumber(max)}
      </div>
    </div>
  );
}

function StatusEffects({ buffs, debuffs }: {
  buffs: { id: string; stat: string; turnsLeft: number }[];
  debuffs: { id: string; stat: string; turnsLeft: number }[];
}) {
  if (buffs.length === 0 && debuffs.length === 0) return null;
  return (
    <div className="flex gap-1 mt-1.5 flex-wrap">
      {buffs.map((b, i) => (
        <span key={`b-${i}`} className="font-mono text-[9px] px-1.5 py-0.5"
          style={{ color: 'var(--jade-bright)', background: 'rgba(109,197,168,0.15)', border: '1px solid var(--jade-deep)' }}>
          {b.stat} +{b.turnsLeft}t
        </span>
      ))}
      {debuffs.map((d, i) => (
        <span key={`d-${i}`} className="font-mono text-[9px] px-1.5 py-0.5"
          style={{ color: 'var(--vermillion-bright)', background: 'rgba(214,91,64,0.15)', border: '1px solid var(--vermillion)' }}>
          {d.stat} {d.turnsLeft}t
        </span>
      ))}
    </div>
  );
}

function ModifierBadge({ mod }: { mod: FloorModifier }) {
  return (
    <span
      className="font-mono text-[10px] px-1.5 py-0.5"
      style={{ color: '#9370DB', background: 'rgba(147,112,219,0.15)', border: '1px solid rgba(147,112,219,0.55)' }}
      title={mod.description}
    >
      {mod.name}
    </span>
  );
}
