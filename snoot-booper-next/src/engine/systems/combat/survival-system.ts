// survival-system.ts - Vampire Survivors-style wave survival mode
// "Survive 30 minutes. Peace was never an option."

// ---------------------------------------------------------------------------
// Data Constants
// ---------------------------------------------------------------------------

export interface SurvivalUpgrade {
  id: string;
  name: string;
  category: 'damage' | 'defense' | 'utility' | 'special';
  description: string;
  effect: Record<string, number>;
  weight: number;
}

export const SURVIVAL_UPGRADES: SurvivalUpgrade[] = [
  // Damage
  { id: 'damage_up', name: 'Qi Sharpening', category: 'damage', description: '+10% damage', effect: { damageMult: 0.10 }, weight: 100 },
  { id: 'crit_chance', name: 'Meridian Precision', category: 'damage', description: '+5% crit chance', effect: { critChance: 0.05 }, weight: 80 },
  { id: 'crit_damage', name: 'Heaven-Splitting Strike', category: 'damage', description: '+20% crit damage', effect: { critDamage: 0.20 }, weight: 70 },
  { id: 'attack_speed', name: 'Thousand Paw Technique', category: 'damage', description: '+15% attack speed', effect: { attackSpeed: 0.15 }, weight: 90 },
  { id: 'projectile', name: 'Shadow Clone Claw', category: 'damage', description: '+1 projectile', effect: { projectiles: 1 }, weight: 40 },

  // Defense
  { id: 'hp_up', name: 'Iron Body Sutra', category: 'defense', description: '+20 max HP (heals too)', effect: { maxHp: 20 }, weight: 100 },
  { id: 'dodge', name: 'Phantom Step', category: 'defense', description: '+5% dodge chance', effect: { dodge: 0.05 }, weight: 80 },
  { id: 'armor', name: 'Floof Armor', category: 'defense', description: '+5 armor', effect: { armor: 5 }, weight: 90 },
  { id: 'regen', name: 'Inner Purr Healing', category: 'defense', description: '+1 HP/sec regen', effect: { regenPerSec: 1 }, weight: 70 },
  { id: 'lifesteal', name: 'Vampire Fang Technique', category: 'defense', description: '+5% lifesteal', effect: { lifesteal: 0.05 }, weight: 50 },

  // Utility
  { id: 'xp_gain', name: 'Wisdom Eye', category: 'utility', description: '+15% XP gain', effect: { xpMult: 0.15 }, weight: 80 },
  { id: 'pickup_radius', name: 'Magnetic Aura', category: 'utility', description: '+20% pickup radius', effect: { pickupRadius: 0.20 }, weight: 90 },
  { id: 'luck', name: 'Fortune Cat Blessing', category: 'utility', description: '+10% luck', effect: { luck: 0.10 }, weight: 70 },
  { id: 'cooldown', name: 'Haste Mantra', category: 'utility', description: '-10% cooldowns', effect: { cdReduction: 0.10 }, weight: 60 },

  // Special
  { id: 'fire_aura', name: 'Blazing Qi Aura', category: 'special', description: 'Burn nearby enemies (100px)', effect: { auraDmg: 1, auraRange: 100 }, weight: 30 },
  { id: 'frost_nova', name: 'Frost Nova', category: 'special', description: 'Freeze enemies for 2s on hit', effect: { freezeDuration: 2000 }, weight: 25 },
  { id: 'companion', name: 'Spirit Cat Companion', category: 'special', description: 'Summon an auto-attack cat (10 dmg, 200px range)', effect: { companions: 1, companionDmg: 10, companionRange: 200 }, weight: 20 },
  { id: 'ultimate_charge', name: 'Celestial Charge', category: 'special', description: '+1 ultimate charge', effect: { ultimateCharges: 1 }, weight: 15 },
];

export interface WaveEnemy {
  id: string;
  name: string;
  hp: number;
  damage: number;
  speed: number;
  xp: number;
  weight: number;
  timeRange: [number, number]; // [minMs, maxMs]
}

export const WAVE_ENEMIES: WaveEnemy[] = [
  { id: 'slime', name: 'Qi Slime', hp: 10, damage: 5, speed: 0.8, xp: 5, weight: 100, timeRange: [0, 300_000] },
  { id: 'bat', name: 'Shadow Bat', hp: 8, damage: 8, speed: 1.5, xp: 7, weight: 80, timeRange: [0, 600_000] },
  { id: 'skeleton', name: 'Bone Cultivator', hp: 25, damage: 12, speed: 1.0, xp: 15, weight: 70, timeRange: [300_000, 900_000] },
  { id: 'ghost', name: 'Vengeful Ghost', hp: 20, damage: 15, speed: 1.2, xp: 18, weight: 60, timeRange: [300_000, 1_200_000] },
  { id: 'wolf', name: 'Dire Wolf', hp: 35, damage: 18, speed: 1.8, xp: 20, weight: 50, timeRange: [600_000, 1_500_000] },
  { id: 'demon', name: 'Pagoda Demon', hp: 60, damage: 25, speed: 1.0, xp: 35, weight: 40, timeRange: [900_000, 1_800_000] },
  { id: 'golem', name: 'Jade Golem', hp: 100, damage: 20, speed: 0.5, xp: 50, weight: 30, timeRange: [900_000, 1_800_000] },
  { id: 'dragon', name: 'Lesser Dragon', hp: 80, damage: 35, speed: 1.3, xp: 60, weight: 20, timeRange: [1_200_000, 1_800_000] },
  { id: 'reaper', name: 'Soul Reaper', hp: 150, damage: 50, speed: 2.0, xp: 100, weight: 10, timeRange: [1_500_000, 1_800_000] },
  { id: 'elder_god', name: 'Elder God', hp: 500, damage: 100, speed: 0.7, xp: 250, weight: 5, timeRange: [1_500_000, 1_800_000] },
];

export interface SurvivalRewardTier {
  id: string;
  name: string;
  timeThreshold: number; // ms survived to earn this tier
  bp: number;
  materials: number;
  tokens: number;
  bonusItem?: string;
}

export const SURVIVAL_REWARDS: SurvivalRewardTier[] = [
  { id: 'bronze', name: 'Bronze', timeThreshold: 300_000, bp: 500, materials: 5, tokens: 0 },
  { id: 'silver', name: 'Silver', timeThreshold: 900_000, bp: 2000, materials: 15, tokens: 5 },
  { id: 'gold', name: 'Gold', timeThreshold: 1_500_000, bp: 5000, materials: 30, tokens: 15 },
  { id: 'platinum', name: 'Platinum', timeThreshold: 1_800_000, bp: 15000, materials: 50, tokens: 30, bonusItem: 'survivor_crown' },
];

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface PlayerStats {
  damageMult: number;
  critChance: number;
  critDamage: number;
  attackSpeed: number;
  projectiles: number;
  dodge: number;
  armor: number;
  regenPerSec: number;
  lifesteal: number;
  xpMult: number;
  pickupRadius: number;
  luck: number;
  cdReduction: number;
  companions: number;
  ultimateCharges: number;
  auraDmg: number;
  auraRange: number;
  freezeDuration: number;
  companionDmg: number;
  companionRange: number;
}

interface ActiveEnemy {
  id: string;
  templateId: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  damage: number;
  speed: number;
  xp: number;
  frozenUntil: number; // gameTime when freeze ends
}

interface XpOrb {
  x: number;
  y: number;
  amount: number;
}

interface Companion {
  x: number;
  y: number;
  damage: number;
  range: number;
  cooldown: number; // ms remaining
}

interface SurvivalStats {
  totalRuns: number;
  bestTime: number;
  totalKills: number;
  totalXpGained: number;
  highestLevel: number;
}

interface RunState {
  inRun: boolean;
  gameTime: number;
  playerX: number;
  playerY: number;
  playerHp: number;
  playerMaxHp: number;
  playerStats: PlayerStats;
  enemies: ActiveEnemy[];
  xpOrbs: XpOrb[];
  companions: Companion[];
  level: number;
  xp: number;
  xpToNextLevel: number;
  upgrades: string[];
  pendingLevelUp: SurvivalUpgrade[] | null;
  attackCooldown: number;
  spawnAccumulator: number;
  regenAccumulator: number;
  auraAccumulator: number;
  companionBaseCount: number;
  killCount: number;
}

export interface SurvivalEndResult {
  reason: 'victory' | 'defeat';
  timeMs: number;
  kills: number;
  level: number;
  rewards: {
    tier: string;
    bp: number;
    materials: number;
    tokens: number;
    bonusItem?: string;
  } | null;
}

interface SerializedSurvivalSystem {
  stats: SurvivalStats;
  unlocks: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MAX_GAME_TIME = 1_800_000; // 30 minutes
const PLAYER_SPEED = 5;
const BASE_ATTACK_DAMAGE = 10;
const COLLISION_RADIUS = 30;
const MAX_ENEMIES = 50;
const COMPANION_ATTACK_INTERVAL = 1000; // ms

let _enemyIdCounter = 0;
function nextEnemyId(): string {
  return `e_${++_enemyIdCounter}`;
}

function weightedRandom<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function defaultPlayerStats(): PlayerStats {
  return {
    damageMult: 1,
    critChance: 0.1,
    critDamage: 1.5,
    attackSpeed: 1,
    projectiles: 1,
    dodge: 0,
    armor: 0,
    regenPerSec: 0,
    lifesteal: 0,
    xpMult: 1,
    pickupRadius: 50,
    luck: 0,
    cdReduction: 0,
    companions: 0,
    ultimateCharges: 0,
    auraDmg: 0,
    auraRange: 0,
    freezeDuration: 0,
    companionDmg: 10,
    companionRange: 200,
  };
}

// ---------------------------------------------------------------------------
// WaveSurvivalSystem
// ---------------------------------------------------------------------------

export class WaveSurvivalSystem {
  // Persistent state
  public stats: SurvivalStats;
  public unlocks: string[];

  // Transient run state
  private run: RunState | null = null;

  constructor() {
    this.stats = {
      totalRuns: 0,
      bestTime: 0,
      totalKills: 0,
      totalXpGained: 0,
      highestLevel: 0,
    };
    this.unlocks = [];
  }

  // ---- Accessors for UI ----

  get inRun(): boolean {
    return this.run?.inRun ?? false;
  }

  get gameTime(): number {
    return this.run?.gameTime ?? 0;
  }

  get playerX(): number {
    return this.run?.playerX ?? 0;
  }

  get playerY(): number {
    return this.run?.playerY ?? 0;
  }

  get playerHp(): number {
    return this.run?.playerHp ?? 0;
  }

  get playerMaxHp(): number {
    return this.run?.playerMaxHp ?? 100;
  }

  get playerStats(): PlayerStats | null {
    return this.run?.playerStats ?? null;
  }

  get enemies(): ActiveEnemy[] {
    return this.run?.enemies ?? [];
  }

  get xpOrbs(): XpOrb[] {
    return this.run?.xpOrbs ?? [];
  }

  get companionsList(): Companion[] {
    return this.run?.companions ?? [];
  }

  get level(): number {
    return this.run?.level ?? 1;
  }

  get xp(): number {
    return this.run?.xp ?? 0;
  }

  get xpToNextLevel(): number {
    return this.run?.xpToNextLevel ?? 100;
  }

  get upgrades(): string[] {
    return this.run?.upgrades ?? [];
  }

  get pendingLevelUp(): SurvivalUpgrade[] | null {
    return this.run?.pendingLevelUp ?? null;
  }

  // ---- Core Methods ----

  startGame(): void {
    _enemyIdCounter = 0;

    this.run = {
      inRun: true,
      gameTime: 0,
      playerX: 400,
      playerY: 300,
      playerHp: 100,
      playerMaxHp: 100,
      playerStats: defaultPlayerStats(),
      enemies: [],
      xpOrbs: [],
      companions: [],
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      upgrades: [],
      pendingLevelUp: null,
      attackCooldown: 0,
      spawnAccumulator: 0,
      regenAccumulator: 0,
      auraAccumulator: 0,
      companionBaseCount: 0,
      killCount: 0,
    };

    this.stats.totalRuns++;
  }

  update(deltaMs: number): SurvivalEndResult | null {
    const run = this.run;
    if (!run || !run.inRun) return null;

    // Pause during level-up selection
    if (run.pendingLevelUp !== null) return null;

    run.gameTime += deltaMs;

    // --- Spawn enemies ---
    const spawnInterval = Math.max(200, 1000 - run.gameTime * 0.0005);
    run.spawnAccumulator += deltaMs;
    while (run.spawnAccumulator >= spawnInterval) {
      run.spawnAccumulator -= spawnInterval;
      if (run.enemies.length < MAX_ENEMIES) {
        this.spawnEnemy();
      }
    }

    // --- Move enemies toward player ---
    const timeScale = 1 + run.gameTime / 600_000;
    for (const enemy of run.enemies) {
      if (enemy.frozenUntil > run.gameTime) continue;
      const dx = run.playerX - enemy.x;
      const dy = run.playerY - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        const moveSpeed = enemy.speed * timeScale;
        enemy.x += (dx / dist) * moveSpeed;
        enemy.y += (dy / dist) * moveSpeed;
      }
    }

    // --- Update companions ---
    this.updateCompanions(deltaMs);

    // --- Move xp orbs toward player (magnet) ---
    const pickupDist = run.playerStats.pickupRadius * (1 + run.playerStats.pickupRadius);
    // Note: pickupRadius stat starts at 50 and gets multiplied by % bonuses
    const effectivePickup = 50 * (1 + (run.playerStats.pickupRadius - 50) / 50);
    // Simpler: just use the raw stat value as radius in pixels
    const magnetRadius = run.playerStats.pickupRadius;
    for (let i = run.xpOrbs.length - 1; i >= 0; i--) {
      const orb = run.xpOrbs[i];
      const dist = distance(run.playerX, run.playerY, orb.x, orb.y);
      if (dist < magnetRadius) {
        // Pull toward player
        const pullSpeed = 4;
        const dx = run.playerX - orb.x;
        const dy = run.playerY - orb.y;
        orb.x += (dx / dist) * pullSpeed;
        orb.y += (dy / dist) * pullSpeed;
      }
      // Collect if close enough
      if (dist < 20) {
        this.collectXp(orb.amount);
        run.xpOrbs.splice(i, 1);
      }
    }

    // --- Player auto-attack ---
    run.attackCooldown -= deltaMs;
    if (run.attackCooldown <= 0) {
      this.playerAttack();
      const baseInterval = 1000;
      const speedMult = run.playerStats.attackSpeed;
      const cdMult = 1 - run.playerStats.cdReduction;
      run.attackCooldown = Math.max(100, (baseInterval / speedMult) * cdMult);
    }

    // --- Aura damage ---
    if (run.playerStats.auraDmg > 0) {
      run.auraAccumulator += deltaMs;
      if (run.auraAccumulator >= 500) {
        run.auraAccumulator -= 500;
        const auraRange = run.playerStats.auraRange;
        const auraDmg = run.playerStats.auraDmg * timeScale;
        for (const enemy of [...run.enemies]) {
          const dist = distance(run.playerX, run.playerY, enemy.x, enemy.y);
          if (dist <= auraRange) {
            this.damageEnemy(enemy, auraDmg);
          }
        }
      }
    }

    // --- Regen ---
    if (run.playerStats.regenPerSec > 0) {
      run.regenAccumulator += deltaMs;
      if (run.regenAccumulator >= 1000) {
        run.regenAccumulator -= 1000;
        run.playerHp = Math.min(run.playerMaxHp, run.playerHp + run.playerStats.regenPerSec);
      }
    }

    // --- Check collisions (enemy -> player) ---
    this.checkCollisions();

    // --- Check win ---
    if (run.gameTime >= MAX_GAME_TIME) {
      return this.endGame('victory');
    }

    // --- Check death ---
    if (run.playerHp <= 0) {
      return this.endGame('defeat');
    }

    return null;
  }

  spawnEnemy(): void {
    const run = this.run;
    if (!run) return;

    const eligible = WAVE_ENEMIES.filter(
      (e) => run.gameTime >= e.timeRange[0] && run.gameTime <= e.timeRange[1]
    );
    if (eligible.length === 0) return;

    const template = weightedRandom(eligible);
    const timeScale = 1 + run.gameTime / 600_000;

    // Spawn at random screen edge
    let x: number;
    let y: number;
    const side = Math.floor(Math.random() * 4);
    switch (side) {
      case 0: x = Math.random() * 800; y = 0; break;       // top
      case 1: x = 800; y = Math.random() * 600; break;     // right
      case 2: x = Math.random() * 800; y = 600; break;     // bottom
      default: x = 0; y = Math.random() * 600; break;      // left
    }

    const enemy: ActiveEnemy = {
      id: nextEnemyId(),
      templateId: template.id,
      x,
      y,
      hp: Math.floor(template.hp * timeScale),
      maxHp: Math.floor(template.hp * timeScale),
      damage: Math.floor(template.damage * timeScale),
      speed: template.speed,
      xp: Math.floor(template.xp * timeScale),
      frozenUntil: 0,
    };

    run.enemies.push(enemy);
  }

  movePlayer(dx: number, dy: number): void {
    const run = this.run;
    if (!run || !run.inRun) return;

    // Normalize diagonal movement
    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag === 0) return;

    const nx = (dx / mag) * PLAYER_SPEED;
    const ny = (dy / mag) * PLAYER_SPEED;

    run.playerX = clamp(run.playerX + nx, 20, 780);
    run.playerY = clamp(run.playerY + ny, 20, 580);
  }

  playerAttack(): void {
    const run = this.run;
    if (!run || run.enemies.length === 0) return;

    // Sort enemies by distance to player
    const sorted = [...run.enemies].sort((a, b) => {
      const da = distance(run.playerX, run.playerY, a.x, a.y);
      const db = distance(run.playerX, run.playerY, b.x, b.y);
      return da - db;
    });

    // Hit the nearest N enemies (one per projectile)
    const targets = sorted.slice(0, run.playerStats.projectiles);
    for (const target of targets) {
      this.damageEnemy(target, BASE_ATTACK_DAMAGE);
    }
  }

  damageEnemy(enemy: ActiveEnemy, baseDmg: number): void {
    const run = this.run;
    if (!run) return;

    let totalDmg = baseDmg * run.playerStats.damageMult;

    // Crit check
    const isCrit = Math.random() < run.playerStats.critChance;
    if (isCrit) {
      totalDmg *= run.playerStats.critDamage;
    }

    totalDmg = Math.floor(totalDmg);
    enemy.hp -= totalDmg;

    // Lifesteal
    if (run.playerStats.lifesteal > 0) {
      const healed = Math.floor(totalDmg * run.playerStats.lifesteal);
      run.playerHp = Math.min(run.playerMaxHp, run.playerHp + healed);
    }

    // Freeze on hit
    if (run.playerStats.freezeDuration > 0) {
      enemy.frozenUntil = Math.max(
        enemy.frozenUntil,
        run.gameTime + run.playerStats.freezeDuration
      );
    }

    // On kill
    if (enemy.hp <= 0) {
      // Spawn xp orb at enemy position
      run.xpOrbs.push({
        x: enemy.x,
        y: enemy.y,
        amount: enemy.xp,
      });

      // Remove enemy
      const idx = run.enemies.indexOf(enemy);
      if (idx !== -1) {
        run.enemies.splice(idx, 1);
      }

      run.killCount++;
      this.stats.totalKills++;
    }
  }

  checkCollisions(): void {
    const run = this.run;
    if (!run) return;

    for (const enemy of run.enemies) {
      if (enemy.frozenUntil > run.gameTime) continue;

      const dist = distance(run.playerX, run.playerY, enemy.x, enemy.y);
      if (dist < COLLISION_RADIUS) {
        // Dodge check
        if (Math.random() < run.playerStats.dodge) {
          continue; // Dodged!
        }

        const dmg = Math.max(1, enemy.damage - run.playerStats.armor);
        run.playerHp -= dmg;

        // Push enemy back slightly to prevent constant overlap damage
        const dx = enemy.x - run.playerX;
        const dy = enemy.y - run.playerY;
        const pushDist = dist > 0 ? dist : 1;
        enemy.x += (dx / pushDist) * 15;
        enemy.y += (dy / pushDist) * 15;
      }
    }
  }

  collectXp(amount: number): void {
    const run = this.run;
    if (!run) return;

    const adjusted = Math.floor(amount * run.playerStats.xpMult);
    run.xp += adjusted;
    this.stats.totalXpGained += adjusted;

    while (run.xp >= run.xpToNextLevel) {
      run.xp -= run.xpToNextLevel;
      this.levelUp();
    }
  }

  levelUp(): void {
    const run = this.run;
    if (!run) return;

    run.level++;
    run.xpToNextLevel = Math.floor(100 * Math.pow(1.15, run.level - 1));

    if (run.level > this.stats.highestLevel) {
      this.stats.highestLevel = run.level;
    }

    this.offerUpgradeSelection();
  }

  offerUpgradeSelection(): void {
    const run = this.run;
    if (!run) return;

    const choices: SurvivalUpgrade[] = [];
    const available = [...SURVIVAL_UPGRADES];

    for (let i = 0; i < 3 && available.length > 0; i++) {
      const pick = weightedRandom(available);
      choices.push(pick);
      // Remove from pool so we don't offer duplicates in the same selection
      const idx = available.indexOf(pick);
      if (idx !== -1) {
        available.splice(idx, 1);
      }
    }

    run.pendingLevelUp = choices;
  }

  selectUpgrade(upgradeId: string): boolean {
    const run = this.run;
    if (!run || !run.pendingLevelUp) return false;

    const upgrade = run.pendingLevelUp.find((u) => u.id === upgradeId);
    if (!upgrade) return false;

    // Apply effects
    for (const [key, value] of Object.entries(upgrade.effect)) {
      const k = key as keyof PlayerStats;
      if (k in run.playerStats) {
        (run.playerStats as unknown as Record<string, number>)[k] += value;
      }
    }

    // HP upgrade also heals
    if (upgrade.id === 'hp_up') {
      const hpGain = upgrade.effect['maxHp'] ?? 0;
      run.playerMaxHp += hpGain;
      run.playerHp = Math.min(run.playerMaxHp, run.playerHp + hpGain);
    }

    // Companion upgrade: spawn a new companion
    if (upgrade.id === 'companion') {
      run.companionBaseCount++;
      run.companions.push({
        x: run.playerX,
        y: run.playerY,
        damage: run.playerStats.companionDmg,
        range: run.playerStats.companionRange,
        cooldown: 0,
      });
    }

    run.upgrades.push(upgradeId);
    run.pendingLevelUp = null;

    return true;
  }

  endGame(reason: 'victory' | 'defeat'): SurvivalEndResult {
    const run = this.run!;
    run.inRun = false;

    // Update persistent stats
    if (run.gameTime > this.stats.bestTime) {
      this.stats.bestTime = run.gameTime;
    }

    // Determine reward tier (highest qualifying)
    let rewardTier: SurvivalRewardTier | null = null;
    for (const tier of SURVIVAL_REWARDS) {
      if (run.gameTime >= tier.timeThreshold) {
        rewardTier = tier;
      }
    }

    let rewards: SurvivalEndResult['rewards'] = null;
    if (rewardTier) {
      const luckMult = 1 + run.playerStats.luck;
      rewards = {
        tier: rewardTier.id,
        bp: Math.floor(rewardTier.bp * luckMult),
        materials: Math.floor(rewardTier.materials * luckMult),
        tokens: Math.floor(rewardTier.tokens * luckMult),
        bonusItem: rewardTier.bonusItem,
      };
    }

    const result: SurvivalEndResult = {
      reason,
      timeMs: run.gameTime,
      kills: run.killCount,
      level: run.level,
      rewards,
    };

    // Clear transient run state
    this.run = null;

    return result;
  }

  // ---- Companion Logic ----

  private updateCompanions(deltaMs: number): void {
    const run = this.run;
    if (!run) return;

    for (const comp of run.companions) {
      // Follow player loosely
      const dx = run.playerX - comp.x;
      const dy = run.playerY - comp.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 40) {
        comp.x += (dx / dist) * 3;
        comp.y += (dy / dist) * 3;
      }

      // Attack nearest enemy in range
      comp.cooldown -= deltaMs;
      if (comp.cooldown <= 0) {
        let nearest: ActiveEnemy | null = null;
        let nearestDist = Infinity;
        for (const enemy of run.enemies) {
          const d = distance(comp.x, comp.y, enemy.x, enemy.y);
          if (d <= comp.range && d < nearestDist) {
            nearest = enemy;
            nearestDist = d;
          }
        }
        if (nearest) {
          this.damageEnemy(nearest, comp.damage);
          comp.cooldown = COMPANION_ATTACK_INTERVAL;
        } else {
          comp.cooldown = 200; // Short retry delay
        }
      }
    }
  }

  // ---- Serialization (persistent data only) ----

  serialize(): SerializedSurvivalSystem {
    return {
      stats: { ...this.stats },
      unlocks: [...this.unlocks],
    };
  }

  deserialize(data: SerializedSurvivalSystem): void {
    if (data.stats) {
      this.stats = {
        totalRuns: data.stats.totalRuns ?? 0,
        bestTime: data.stats.bestTime ?? 0,
        totalKills: data.stats.totalKills ?? 0,
        totalXpGained: data.stats.totalXpGained ?? 0,
        highestLevel: data.stats.highestLevel ?? 0,
      };
    }
    if (data.unlocks) {
      this.unlocks = [...data.unlocks];
    }
    // Run state is never persisted - runs are transient
    this.run = null;
  }
}
