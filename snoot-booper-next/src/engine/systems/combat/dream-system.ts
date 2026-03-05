// Dream Realm - Personalized dungeon system shaped by the player's journey

export type DreamFloorType = 'memory' | 'nightmare' | 'wish' | 'reflection' | 'void';
export type DreamModifierRarity = 'uncommon' | 'rare' | 'epic';
export type DreamCosmeticRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type CultivationRealm =
  | 'mortal'
  | 'qi_condensation'
  | 'foundation'
  | 'core_formation'
  | 'nascent_soul'
  | 'dao_seeking'
  | 'tribulation'
  | 'immortal'
  | 'heavenly_sovereign';

export interface DreamModifier {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: DreamModifierRarity;
  effect: Record<string, number | boolean>;
}

export interface DreamFloorDef {
  type: DreamFloorType;
  weight: number;
  rewardMult: number;
  bonusLoot?: boolean;
  encounterType?: 'boss';
}

export interface DreamEnemy {
  id: string;
  name: string;
  emoji: string;
  baseHp: number;
  baseDamage: number;
  isBoss: boolean;
}

export interface DreamCosmetic {
  id: string;
  name: string;
  rarity: DreamCosmeticRarity;
  description: string;
}

export interface DreamShopItem {
  id: string;
  name: string;
  cost: number;
  description: string;
  effect: Record<string, number | boolean>;
}

export interface DreamPlayerState {
  hp: number;
  maxHp: number;
  power: number;
  defense: number;
  critChance: number;
  critMult: number;
}

export interface ActiveDreamEnemy {
  templateId: string;
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  damage: number;
  isBoss: boolean;
}

export interface DreamFloor {
  index: number;
  type: DreamFloorType;
  rewardMult: number;
  bonusLoot: boolean;
  enemies: ActiveDreamEnemy[];
  currentEnemyIndex: number;
  completed: boolean;
}

export interface DreamReward {
  dreamEssence: number;
  loreFragments: string[];
  cosmetics: string[];
  walkerCatUnlocked: boolean;
}

export interface DreamPermanentBonuses {
  hp: number;
  power: number;
  maxDepthBonus: number;
  essenceMultiplier: number;
}

export interface DreamStats {
  totalDreams: number;
  floorsExplored: number;
  bossesDefeated: number;
  dreamEssenceEarned: number;
  deepestFloorReached: number;
  enemiesDefeated: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
}

export interface PlayerData {
  cultivationProgress: number;
  catCount: number;
  totalBonds: number;
  pagodaFloor: number;
  cultivationRealm: CultivationRealm;
}

export interface DreamPersistent {
  dreamEssence: number;
  unlockedCosmetics: string[];
  hasWalkerCat: boolean;
  deepestDream: number;
  permanentBonuses: DreamPermanentBonuses;
  stats: DreamStats;
  purchasedShopItems: string[];
}

// --- DATA CONSTANTS ---

export const DREAM_MODIFIERS: DreamModifier[] = [
  { id: 'gravity_shift', name: 'Gravity Shift', emoji: '\u{1F30C}', description: 'Controls feel inverted - disorienting but powerful', rarity: 'uncommon', effect: { invertControls: true } },
  { id: 'time_loop', name: 'Time Loop', emoji: '\u{23F0}', description: 'Every 5 floors the dream loops, enemies grow stronger', rarity: 'rare', effect: { loopEvery: 5, strengthMultiplier: 1.5 } },
  { id: 'mirror_world', name: 'Mirror World', emoji: '\u{1FA9E}', description: 'Mirror copies appear, dealing 75% of your damage back', rarity: 'rare', effect: { spawnMirrors: true, mirrorDamagePercent: 0.75 } },
  { id: 'memory_lane', name: 'Memory Lane', emoji: '\u{1F9E0}', description: 'Enemies drawn from your play history', rarity: 'epic', effect: { usePlayerHistory: true } },
  { id: 'fading_reality', name: 'Fading Reality', emoji: '\u{1F32B}\u{FE0F}', description: '20% chance enemies phase through attacks', rarity: 'uncommon', effect: { phaseChance: 0.2 } },
  { id: 'dream_cascade', name: 'Dream Cascade', emoji: '\u{1F30A}', description: 'Attacks echo 3 times at 30% damage', rarity: 'epic', effect: { echoHits: 3, echoDamage: 0.3 } },
  { id: 'nightmare_surge', name: 'Nightmare Surge', emoji: '\u{1F608}', description: 'Enemies deal 50% more but drop double loot', rarity: 'uncommon', effect: { enemyDamageBonus: 0.5, lootBonus: 1.0 } },
  { id: 'lucid_control', name: 'Lucid Control', emoji: '\u{2728}', description: 'Cooldowns reduced by 50% - you shape the dream', rarity: 'rare', effect: { cooldownReduction: 0.5 } },
  { id: 'collective_unconscious', name: 'Collective Unconscious', emoji: '\u{1F54A}\u{FE0F}', description: 'All cats share HP pool but gain bonus power', rarity: 'epic', effect: { sharedHP: true, powerBonus: 1.0 } },
  { id: 'deja_vu', name: 'Deja Vu', emoji: '\u{1F440}', description: 'See enemy attacks before they happen, +25% dodge', rarity: 'uncommon', effect: { dodgeBonus: 0.25, previewAttacks: true } },
];

export const DREAM_FLOORS: DreamFloorDef[] = [
  { type: 'memory', weight: 30, rewardMult: 1.2 },
  { type: 'nightmare', weight: 20, rewardMult: 1.5 },
  { type: 'wish', weight: 25, rewardMult: 1.3, bonusLoot: true },
  { type: 'reflection', weight: 15, rewardMult: 1.4, encounterType: 'boss' },
  { type: 'void', weight: 10, rewardMult: 2.0 },
];

export const DREAM_ENEMIES: DreamEnemy[] = [
  { id: 'shadow_cat', name: 'Shadow Cat', emoji: '\u{1F408}\u{200D}\u{2B1B}', baseHp: 100, baseDamage: 15, isBoss: false },
  { id: 'echo_goose', name: 'Echo Goose', emoji: '\u{1F9A2}', baseHp: 150, baseDamage: 25, isBoss: false },
  { id: 'phantom_waifu', name: 'Phantom Waifu', emoji: '\u{1F47B}', baseHp: 200, baseDamage: 20, isBoss: false },
  { id: 'memory_fragment', name: 'Memory Fragment', emoji: '\u{1F4AD}', baseHp: 80, baseDamage: 10, isBoss: false },
  { id: 'nightmare_self', name: 'Nightmare Self', emoji: '\u{1F525}', baseHp: 300, baseDamage: 35, isBoss: true },
  { id: 'dream_doppelganger', name: 'Dream Doppelganger', emoji: '\u{1FA9E}', baseHp: 250, baseDamage: 30, isBoss: true },
  { id: 'void_entity', name: 'Void Entity', emoji: '\u{1F573}\u{FE0F}', baseHp: 400, baseDamage: 40, isBoss: true },
  { id: 'celestial_memory', name: 'Celestial Memory', emoji: '\u{1F31F}', baseHp: 500, baseDamage: 50, isBoss: true },
];

export const DREAM_COSMETICS: DreamCosmetic[] = [
  { id: 'dreamweaver_hat', name: 'Dreamweaver Hat', rarity: 'rare', description: 'A hat woven from pure dream silk' },
  { id: 'nightmare_cloak', name: 'Nightmare Cloak', rarity: 'epic', description: 'Shadows cling to the wearer' },
  { id: 'lucid_aura', name: 'Lucid Aura', rarity: 'legendary', description: 'Glowing rings of dream energy orbit you' },
  { id: 'void_eyes', name: 'Void Eyes', rarity: 'epic', description: 'Eyes that have seen beyond the veil' },
  { id: 'starlight_collar', name: 'Starlight Collar', rarity: 'rare', description: 'A collar that twinkles with captured starlight' },
  { id: 'memory_ribbon', name: 'Memory Ribbon', rarity: 'uncommon', description: 'A ribbon that shifts colors with your mood' },
  { id: 'echo_bell', name: 'Echo Bell', rarity: 'common', description: 'A tiny bell whose ring never quite fades' },
  { id: 'celestial_crown', name: 'Celestial Crown', rarity: 'legendary', description: 'Worn by those who conquered the deepest dreams' },
];

export const DREAM_SHOP: DreamShopItem[] = [
  { id: 'dream_clarity', name: 'Dream Clarity', cost: 50, description: '+25% dream essence gained on next run', effect: { essenceMultiplier: 0.25 } },
  { id: 'resilient_dreamer', name: 'Resilient Dreamer', cost: 100, description: '+10 permanent max HP in dreams', effect: { hp: 10 } },
  { id: 'dream_mastery', name: 'Dream Mastery', cost: 150, description: '+2 permanent power in dreams', effect: { power: 2 } },
  { id: 'deep_dreaming', name: 'Deep Dreaming', cost: 200, description: '+2 max dream depth', effect: { maxDepthBonus: 2 } },
  { id: 'lucid_selection', name: 'Lucid Selection', cost: 300, description: 'Choose your dream modifier instead of random', effect: { chooseModifier: true } },
];

export const REALM_STAT_MULTIPLIERS: Record<CultivationRealm, number> = {
  mortal: 1,
  qi_condensation: 1.5,
  foundation: 2,
  core_formation: 2.5,
  nascent_soul: 3,
  dao_seeking: 5,
  tribulation: 10,
  immortal: 25,
  heavenly_sovereign: 50,
};

// --- SYSTEM CLASS ---

export class DreamRealmSystem {
  // Persistent state
  dreamEssence: number = 0;
  unlockedCosmetics: string[] = [];
  hasWalkerCat: boolean = false;
  deepestDream: number = 0;
  permanentBonuses: DreamPermanentBonuses = { hp: 0, power: 0, maxDepthBonus: 0, essenceMultiplier: 0 };
  stats: DreamStats = {
    totalDreams: 0,
    floorsExplored: 0,
    bossesDefeated: 0,
    dreamEssenceEarned: 0,
    deepestFloorReached: 0,
    enemiesDefeated: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
  };
  purchasedShopItems: string[] = [];

  // Run state
  inDream: boolean = false;
  currentFloor: number = 0;
  maxDepth: number = 10;
  floorSequence: DreamFloor[] = [];
  activeModifiers: DreamModifier[] = [];
  player: DreamPlayerState = this.emptyPlayer();
  enemy: ActiveDreamEnemy | null = null;
  rewards: DreamReward = this.emptyRewards();
  startTime: number = 0;

  // --- Helpers ---

  private emptyPlayer(): DreamPlayerState {
    return { hp: 100, maxHp: 100, power: 10, defense: 5, critChance: 0.15, critMult: 2.0 };
  }

  private emptyRewards(): DreamReward {
    return { dreamEssence: 0, loreFragments: [], cosmetics: [], walkerCatUnlocked: false };
  }

  private rollFloorType(): DreamFloorDef {
    const totalWeight = DREAM_FLOORS.reduce((s, f) => s + f.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const floor of DREAM_FLOORS) {
      roll -= floor.weight;
      if (roll <= 0) return floor;
    }
    return DREAM_FLOORS[0];
  }

  private pickRegularEnemy(): DreamEnemy {
    const regulars = DREAM_ENEMIES.filter(e => !e.isBoss);
    return regulars[Math.floor(Math.random() * regulars.length)];
  }

  private pickBossEnemy(): DreamEnemy {
    const bosses = DREAM_ENEMIES.filter(e => e.isBoss);
    return bosses[Math.floor(Math.random() * bosses.length)];
  }

  private scaleEnemy(template: DreamEnemy, floor: number): ActiveDreamEnemy {
    const scaling = 1 + (floor - 1) * 0.15;
    return {
      templateId: template.id,
      name: template.name,
      emoji: template.emoji,
      hp: Math.floor(template.baseHp * scaling),
      maxHp: Math.floor(template.baseHp * scaling),
      damage: Math.floor(template.baseDamage * scaling),
      isBoss: template.isBoss,
    };
  }

  private selectModifiers(count: number): DreamModifier[] {
    const pool = [...DREAM_MODIFIERS];
    const selected: DreamModifier[] = [];
    const n = Math.min(count, pool.length);
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      selected.push(pool.splice(idx, 1)[0]);
    }
    return selected;
  }

  private hasModifier(id: string): boolean {
    return this.activeModifiers.some(m => m.id === id);
  }

  private getModifierEffect<T>(id: string, key: string, fallback: T): T {
    const mod = this.activeModifiers.find(m => m.id === id);
    if (!mod) return fallback;
    const val = mod.effect[key];
    return val !== undefined ? (val as unknown as T) : fallback;
  }

  // --- Core Methods ---

  generateDreamDungeon(playerData: PlayerData): DreamFloor[] {
    const realmMult = REALM_STAT_MULTIPLIERS[playerData.cultivationRealm] ?? 1;
    const cultivationBonus = Math.floor(playerData.cultivationProgress / 100);
    this.maxDepth = 10 + cultivationBonus + this.permanentBonuses.maxDepthBonus;

    // Select 1-3 modifiers based on depth
    const modCount = this.maxDepth >= 20 ? 3 : this.maxDepth >= 15 ? 2 : 1;
    this.activeModifiers = this.selectModifiers(modCount);

    // Calculate player stats from realm and permanent bonuses
    const baseHp = 100 + this.permanentBonuses.hp;
    const basePower = 10 + this.permanentBonuses.power;
    this.player = {
      hp: Math.floor(baseHp * realmMult),
      maxHp: Math.floor(baseHp * realmMult),
      power: Math.floor(basePower * realmMult),
      defense: Math.floor(5 * realmMult),
      critChance: 0.15,
      critMult: 2.0,
    };

    // Apply collective_unconscious power bonus
    if (this.hasModifier('collective_unconscious')) {
      const bonus = this.getModifierEffect<number>('collective_unconscious', 'powerBonus', 0);
      this.player.power = Math.floor(this.player.power * (1 + bonus));
    }

    // Generate floor sequence
    this.floorSequence = [];
    for (let i = 1; i <= this.maxDepth; i++) {
      const def = this.rollFloorType();
      const isBossFloor = def.encounterType === 'boss' || i % 5 === 0;

      const enemies: ActiveDreamEnemy[] = [];
      if (isBossFloor) {
        enemies.push(this.scaleEnemy(this.pickBossEnemy(), i));
      } else {
        const enemyCount = 1 + Math.floor(Math.random() * 3); // 1-3
        for (let e = 0; e < enemyCount; e++) {
          enemies.push(this.scaleEnemy(this.pickRegularEnemy(), i));
        }
      }

      this.floorSequence.push({
        index: i,
        type: def.type,
        rewardMult: def.rewardMult,
        bonusLoot: def.bonusLoot ?? false,
        enemies,
        currentEnemyIndex: 0,
        completed: false,
      });
    }

    this.inDream = true;
    this.currentFloor = 0;
    this.rewards = this.emptyRewards();
    this.startTime = Date.now();
    this.stats.totalDreams++;

    return this.floorSequence;
  }

  advanceFloor(): { floor: DreamFloor; enemy: ActiveDreamEnemy } | { ended: true; reason: string } {
    this.currentFloor++;

    if (this.currentFloor > this.floorSequence.length) {
      return this.endDream('completed');
    }

    const floor = this.floorSequence[this.currentFloor - 1];
    floor.currentEnemyIndex = 0;
    this.enemy = floor.enemies[0] ?? null;

    this.stats.floorsExplored++;
    if (this.currentFloor > this.stats.deepestFloorReached) {
      this.stats.deepestFloorReached = this.currentFloor;
    }
    if (this.currentFloor > this.deepestDream) {
      this.deepestDream = this.currentFloor;
    }

    if (!this.enemy) {
      return this.endDream('error');
    }

    return { floor, enemy: this.enemy };
  }

  dreamAttack(multiplier: number = 1.0): {
    damage: number;
    isCrit: boolean;
    echoDamage: number;
    enemyDefeated: boolean;
    floorCleared: boolean;
  } {
    if (!this.enemy) {
      return { damage: 0, isCrit: false, echoDamage: 0, enemyDefeated: false, floorCleared: false };
    }

    // Fading reality: phase chance causes miss
    if (this.hasModifier('fading_reality')) {
      const phaseChance = this.getModifierEffect<number>('fading_reality', 'phaseChance', 0);
      if (Math.random() < phaseChance) {
        return { damage: 0, isCrit: false, echoDamage: 0, enemyDefeated: false, floorCleared: false };
      }
    }

    // Calculate base damage
    const isCrit = Math.random() < this.player.critChance;
    const critFactor = isCrit ? this.player.critMult : 1.0;
    const rawDamage = this.player.power * multiplier * critFactor;
    const effectiveDefense = Math.max(0, this.enemy.damage * 0.1); // enemies have implicit defense
    const damage = Math.max(1, Math.floor(rawDamage - effectiveDefense));

    this.enemy.hp -= damage;
    this.stats.totalDamageDealt += damage;

    // Echo hits from dream_cascade
    let echoDamage = 0;
    if (this.hasModifier('dream_cascade')) {
      const echoHits = this.getModifierEffect<number>('dream_cascade', 'echoHits', 0);
      const echoMult = this.getModifierEffect<number>('dream_cascade', 'echoDamage', 0);
      for (let i = 0; i < echoHits; i++) {
        const echo = Math.max(1, Math.floor(damage * echoMult));
        this.enemy.hp -= echo;
        echoDamage += echo;
        this.stats.totalDamageDealt += echo;
      }
    }

    const enemyDefeated = this.enemy.hp <= 0;
    let floorCleared = false;

    if (enemyDefeated) {
      floorCleared = this.handleEnemyDefeated();
    }

    return { damage, isCrit, echoDamage, enemyDefeated, floorCleared };
  }

  dreamHeal(): { healed: number; newHp: number } {
    const healAmount = Math.floor(this.player.maxHp * 0.25);
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
    return { healed: healAmount, newHp: this.player.hp };
  }

  enemyTurn(): { damage: number; playerHp: number; playerDefeated: boolean } {
    if (!this.enemy || this.enemy.hp <= 0) {
      return { damage: 0, playerHp: this.player.hp, playerDefeated: false };
    }

    // Deja vu dodge bonus
    let dodged = false;
    if (this.hasModifier('deja_vu')) {
      const dodgeBonus = this.getModifierEffect<number>('deja_vu', 'dodgeBonus', 0);
      if (Math.random() < dodgeBonus) {
        dodged = true;
      }
    }

    if (dodged) {
      return { damage: 0, playerHp: this.player.hp, playerDefeated: false };
    }

    let enemyDamage = this.enemy.damage;

    // Nightmare surge: enemies deal more damage
    if (this.hasModifier('nightmare_surge')) {
      const bonus = this.getModifierEffect<number>('nightmare_surge', 'enemyDamageBonus', 0);
      enemyDamage = Math.floor(enemyDamage * (1 + bonus));
    }

    // Mirror world: take mirror damage back
    if (this.hasModifier('mirror_world')) {
      const mirrorPct = this.getModifierEffect<number>('mirror_world', 'mirrorDamagePercent', 0);
      enemyDamage += Math.floor(this.player.power * mirrorPct);
    }

    const damage = Math.max(1, enemyDamage - this.player.defense);
    this.player.hp -= damage;
    this.stats.totalDamageTaken += damage;

    const playerDefeated = this.player.hp <= 0;
    if (playerDefeated) {
      this.endDream('defeated');
    }

    return { damage, playerHp: this.player.hp, playerDefeated };
  }

  private handleEnemyDefeated(): boolean {
    if (!this.enemy) return false;

    this.stats.enemiesDefeated++;
    if (this.enemy.isBoss) {
      this.stats.bossesDefeated++;
    }

    this.onEnemyDefeated();

    // Check if more enemies on this floor
    const floor = this.floorSequence[this.currentFloor - 1];
    if (!floor) return true;

    floor.currentEnemyIndex++;
    if (floor.currentEnemyIndex < floor.enemies.length) {
      this.enemy = floor.enemies[floor.currentEnemyIndex];
      return false; // floor not cleared yet
    }

    // Floor cleared
    floor.completed = true;
    this.enemy = null;
    return true;
  }

  private onEnemyDefeated(): void {
    if (!this.enemy) return;
    const floor = this.floorSequence[this.currentFloor - 1];
    if (!floor) return;

    // Award dream essence: 10 * floorIndex * rewardMult
    let essenceBase = 10 * this.currentFloor * floor.rewardMult;

    // Nightmare surge loot bonus
    if (this.hasModifier('nightmare_surge')) {
      const lootBonus = this.getModifierEffect<number>('nightmare_surge', 'lootBonus', 0);
      essenceBase *= (1 + lootBonus);
    }

    // Permanent essence multiplier
    essenceBase *= (1 + this.permanentBonuses.essenceMultiplier);

    const essence = Math.floor(essenceBase);
    this.rewards.dreamEssence += essence;

    // 15% chance for lore fragment
    if (Math.random() < 0.15) {
      const fragmentId = `lore_dream_f${this.currentFloor}_${Date.now()}`;
      this.rewards.loreFragments.push(fragmentId);
    }

    // Boss-specific drops
    if (this.enemy.isBoss) {
      // 5% cosmetic on boss kill
      if (Math.random() < 0.05) {
        const unowned = DREAM_COSMETICS.filter(c => !this.unlockedCosmetics.includes(c.id));
        if (unowned.length > 0) {
          const cosmetic = unowned[Math.floor(Math.random() * unowned.length)];
          this.rewards.cosmetics.push(cosmetic.id);
        }
      }

      // 1% dream walker cat on floor >= 8 boss
      if (this.currentFloor >= 8 && !this.hasWalkerCat && Math.random() < 0.01) {
        this.rewards.walkerCatUnlocked = true;
      }
    }
  }

  endDream(reason: string): { ended: true; reason: string; rewards: DreamReward } {
    // Apply rewards to persistent state
    this.dreamEssence += this.rewards.dreamEssence;
    this.stats.dreamEssenceEarned += this.rewards.dreamEssence;

    for (const cosmeticId of this.rewards.cosmetics) {
      if (!this.unlockedCosmetics.includes(cosmeticId)) {
        this.unlockedCosmetics.push(cosmeticId);
      }
    }

    if (this.rewards.walkerCatUnlocked) {
      this.hasWalkerCat = true;
    }

    const result = { ended: true as const, reason, rewards: { ...this.rewards } };

    // Reset run state
    this.inDream = false;
    this.currentFloor = 0;
    this.floorSequence = [];
    this.activeModifiers = [];
    this.player = this.emptyPlayer();
    this.enemy = null;
    this.rewards = this.emptyRewards();
    this.startTime = 0;

    return result;
  }

  purchaseShopItem(itemId: string): { success: boolean; error?: string } {
    const item = DREAM_SHOP.find(i => i.id === itemId);
    if (!item) return { success: false, error: 'Item not found' };

    // lucid_selection is one-time purchase
    if (itemId === 'lucid_selection' && this.purchasedShopItems.includes('lucid_selection')) {
      return { success: false, error: 'Already purchased' };
    }

    if (this.dreamEssence < item.cost) {
      return { success: false, error: 'Not enough dream essence' };
    }

    this.dreamEssence -= item.cost;
    this.purchasedShopItems.push(itemId);

    // Apply permanent bonus effects
    if (item.effect.hp !== undefined && typeof item.effect.hp === 'number') {
      this.permanentBonuses.hp += item.effect.hp;
    }
    if (item.effect.power !== undefined && typeof item.effect.power === 'number') {
      this.permanentBonuses.power += item.effect.power;
    }
    if (item.effect.maxDepthBonus !== undefined && typeof item.effect.maxDepthBonus === 'number') {
      this.permanentBonuses.maxDepthBonus += item.effect.maxDepthBonus;
    }
    if (item.effect.essenceMultiplier !== undefined && typeof item.effect.essenceMultiplier === 'number') {
      this.permanentBonuses.essenceMultiplier += item.effect.essenceMultiplier;
    }

    return { success: true };
  }

  // --- Serialize / Deserialize ---

  serialize(): DreamPersistent & { run?: Record<string, unknown> } {
    const persistent: DreamPersistent & { run?: Record<string, unknown> } = {
      dreamEssence: this.dreamEssence,
      unlockedCosmetics: [...this.unlockedCosmetics],
      hasWalkerCat: this.hasWalkerCat,
      deepestDream: this.deepestDream,
      permanentBonuses: { ...this.permanentBonuses },
      stats: { ...this.stats },
      purchasedShopItems: [...this.purchasedShopItems],
    };

    if (this.inDream) {
      persistent.run = {
        currentFloor: this.currentFloor,
        maxDepth: this.maxDepth,
        floorSequence: this.floorSequence.map(f => ({
          ...f,
          enemies: f.enemies.map(e => ({ ...e })),
        })),
        activeModifiers: this.activeModifiers.map(m => ({ ...m, effect: { ...m.effect } })),
        player: { ...this.player },
        enemy: this.enemy ? { ...this.enemy } : null,
        rewards: {
          ...this.rewards,
          loreFragments: [...this.rewards.loreFragments],
          cosmetics: [...this.rewards.cosmetics],
        },
        startTime: this.startTime,
      };
    }

    return persistent;
  }

  deserialize(data: ReturnType<DreamRealmSystem['serialize']>): void {
    this.dreamEssence = data.dreamEssence ?? 0;
    this.unlockedCosmetics = data.unlockedCosmetics ?? [];
    this.hasWalkerCat = data.hasWalkerCat ?? false;
    this.deepestDream = data.deepestDream ?? 0;
    this.permanentBonuses = {
      hp: data.permanentBonuses?.hp ?? 0,
      power: data.permanentBonuses?.power ?? 0,
      maxDepthBonus: data.permanentBonuses?.maxDepthBonus ?? 0,
      essenceMultiplier: data.permanentBonuses?.essenceMultiplier ?? 0,
    };
    this.stats = {
      totalDreams: data.stats?.totalDreams ?? 0,
      floorsExplored: data.stats?.floorsExplored ?? 0,
      bossesDefeated: data.stats?.bossesDefeated ?? 0,
      dreamEssenceEarned: data.stats?.dreamEssenceEarned ?? 0,
      deepestFloorReached: data.stats?.deepestFloorReached ?? 0,
      enemiesDefeated: data.stats?.enemiesDefeated ?? 0,
      totalDamageDealt: data.stats?.totalDamageDealt ?? 0,
      totalDamageTaken: data.stats?.totalDamageTaken ?? 0,
    };
    this.purchasedShopItems = data.purchasedShopItems ?? [];

    if (data.run && typeof data.run === 'object') {
      const run = data.run as Record<string, unknown>;
      this.inDream = true;
      this.currentFloor = (run.currentFloor as number) ?? 0;
      this.maxDepth = (run.maxDepth as number) ?? 10;
      this.floorSequence = (run.floorSequence as DreamFloor[]) ?? [];
      this.activeModifiers = (run.activeModifiers as DreamModifier[]) ?? [];
      this.player = (run.player as DreamPlayerState) ?? this.emptyPlayer();
      this.enemy = (run.enemy as ActiveDreamEnemy | null) ?? null;
      this.rewards = (run.rewards as DreamReward) ?? this.emptyRewards();
      this.startTime = (run.startTime as number) ?? 0;
    } else {
      this.inDream = false;
      this.currentFloor = 0;
      this.maxDepth = 10;
      this.floorSequence = [];
      this.activeModifiers = [];
      this.player = this.emptyPlayer();
      this.enemy = null;
      this.rewards = this.emptyRewards();
      this.startTime = 0;
    }
  }
}
