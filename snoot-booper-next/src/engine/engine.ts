/**
 * Engine - Central manager for all game systems.
 *
 * Pure TypeScript, zero React imports.
 * Holds system instances, runs game tick, bridges to Zustand via callbacks.
 */

import { MasterSystem, BoopSystem, EconomySystem, UpgradeSystem, CatSystem, WaifuSystem, IdleSystem } from './systems/core';
import { GooseSystem, EventSystem, TimeSystem, DailySystem, ParasiteSystem, GoldenSnootSystem } from './systems/events';
import { AchievementSystem, SectWarSystem } from './systems/social';
import { CultivationSystem, PrestigeSystem, BuildingSystem, TechniqueSystem, BlessingSystem } from './systems/progression';
import { EquipmentSystem, CraftingSystem, RelicSystem } from './systems/equipment';
import { BLUEPRINTS, type CraftJob } from './systems/equipment/crafting-system';
import { PagodaSystem, WaveSurvivalSystem, CelestialTournamentSystem, DreamRealmSystem, GooseDimensionSystem, MemoryFragmentsSystem, ElementalSystem } from './systems/combat';
import { LoreSystem, SecretSystem, CatinoSystem, DramaSystem, NemesisSystem, HardcoreSystem, IRLIntegrationSystem, PartnerSystem } from './systems/meta';
import { gameLoop, type GameLoopContext } from './game-loop';
import { eventBus, EVENTS } from './event-bus';
import type { MasterId, Currencies, CurrencyId, GameModifiers } from './types';
import type { BattleResult, TournamentRewards } from './systems/combat/tournament-system';
import type { LootItem } from './systems/combat/pagoda-system';

export interface TournamentTeamMember {
  id: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  critChance: number;
  critDamage: number;
  power: number;
}

export class Engine {
  // Core systems
  readonly master = new MasterSystem();
  readonly boop = new BoopSystem();
  readonly economy = new EconomySystem();
  readonly upgrade = new UpgradeSystem();
  readonly cat = new CatSystem();
  readonly waifu = new WaifuSystem();

  // Event systems
  readonly goose = new GooseSystem();
  readonly event = new EventSystem();
  readonly time = new TimeSystem();
  readonly daily = new DailySystem();

  // Social systems
  readonly achievement = new AchievementSystem();

  // Progression systems (Phase 4)
  readonly cultivation = new CultivationSystem();
  readonly prestige = new PrestigeSystem();
  readonly building = new BuildingSystem();
  readonly technique = new TechniqueSystem();
  readonly blessing = new BlessingSystem();

  // Equipment systems (Phase 5)
  readonly equipment = new EquipmentSystem();
  readonly crafting = new CraftingSystem();
  readonly relic = new RelicSystem();

  // Combat/Dungeon systems (Phase 6)
  readonly pagoda = new PagodaSystem();
  readonly survival = new WaveSurvivalSystem();
  readonly tournament = new CelestialTournamentSystem();
  readonly dream = new DreamRealmSystem();
  readonly gooseDimension = new GooseDimensionSystem();
  readonly memory = new MemoryFragmentsSystem();
  readonly elemental = new ElementalSystem();

  // Meta systems (Phase 7)
  readonly lore = new LoreSystem();
  readonly secret = new SecretSystem();
  readonly catino = new CatinoSystem();
  readonly drama = new DramaSystem();
  readonly nemesis = new NemesisSystem();
  readonly hardcore = new HardcoreSystem();
  readonly irl = new IRLIntegrationSystem();
  readonly partner = new PartnerSystem();

  // Event systems (Phase 7)
  readonly parasite = new ParasiteSystem();
  readonly goldenSnoot = new GoldenSnootSystem();

  // Social systems (Phase 7)
  readonly sectWar = new SectWarSystem();

  // Core systems (Phase 7)
  readonly idle = new IdleSystem();

  // Auto-boop accumulator (fractional boops per tick)
  private autoBoopAccumulator = 0;
  private catTrainingXPAccumulator = 0;
  private spiritStoneAccumulator = 0;
  private catsDirty = false;
  private buildingsDirty = false;

  // Throttle: only check events/achievements every N seconds
  private eventCheckAccumulator = 0;
  private achievementCheckAccumulator = 0;

  // Cultivation XP accumulator (from boops/passive)
  private cultivationXPAccumulator = 0;

  // Notification queue (consumed by UI)
  private notifications: Notification[] = [];

  // Callback to push state changes to Zustand (set by React layer)
  private onStateChange: ((patch: EnginePatch) => void) | null = null;

  /**
   * Set the callback that pushes engine state changes to Zustand stores.
   */
  setOnStateChange(cb: (patch: EnginePatch) => void): void {
    this.onStateChange = cb;
  }

  /**
   * Initialize from save data or fresh start.
   */
  init(saveData?: {
    master?: MasterId | null;
    resources?: Partial<Currencies>;
    stats?: { totalBoops?: number; maxCombo?: number; criticalBoops?: number; boopPower?: number };
    upgrades?: { upgrades?: Record<string, number> };
    economy?: Parameters<EconomySystem['deserialize']>[0];
    cats?: { cats?: unknown[]; catIdCounter?: number; version?: number };
    waifus?: Record<string, unknown>;
    goose?: Record<string, unknown>;
    events?: Record<string, unknown>;
    time?: Record<string, unknown>;
    daily?: Record<string, unknown>;
    achievements?: Record<string, unknown>;
    // Phase 4
    cultivation?: Record<string, unknown>;
    prestige?: Record<string, unknown>;
    buildings?: Record<string, unknown>;
    techniques?: Record<string, unknown>;
    blessings?: Record<string, unknown>;
    // Phase 5
    equipment?: Record<string, unknown>;
    crafting?: Record<string, unknown>;
    // Phase 6
    pagoda?: Record<string, unknown>;
    survival?: Record<string, unknown>;
    tournament?: Record<string, unknown>;
    dreamRealm?: Record<string, unknown>;
    gooseDimension?: Record<string, unknown>;
    memoryFragments?: Record<string, unknown>;
    // Phase 7
    lore?: Record<string, unknown>;
    secrets?: Record<string, unknown>;
    catino?: Record<string, unknown>;
    drama?: Record<string, unknown>;
    nemesis?: Record<string, unknown>;
    hardcore?: Record<string, unknown>;
    irlIntegration?: Record<string, unknown>;
    partners?: Record<string, unknown>;
    parasites?: Record<string, unknown>;
    goldenSnoot?: Record<string, unknown>;
    elemental?: Record<string, unknown>;
    sectWar?: Record<string, unknown>;
    idle?: Record<string, unknown>;
  }): void {
    if (saveData) {
      if (saveData.master) this.master.selectMaster(saveData.master);
      if (saveData.resources) {
        this.economy.setBalances({
          bp: saveData.resources.bp ?? 0,
          pp: saveData.resources.pp ?? 0,
          qi: saveData.resources.qi ?? 0,
          jadeCatnip: saveData.resources.jadeCatnip ?? 0,
          spiritStones: saveData.resources.spiritStones ?? 0,
          heavenlySeals: saveData.resources.heavenlySeals ?? 0,
          sectReputation: saveData.resources.sectReputation ?? 0,
          destinyThreads: saveData.resources.destinyThreads ?? 0,
          waifuTokens: saveData.resources.waifuTokens ?? 0,
          gooseFeathers: saveData.resources.gooseFeathers ?? 0,
        });
      }
      if (saveData.stats) {
        this.boop.restore(saveData.stats);
      }
      if (saveData.upgrades) {
        this.upgrade.deserialize(saveData.upgrades);
      }
      if (saveData.economy) {
        this.economy.deserialize(saveData.economy);
      }
      if (saveData.cats) {
        this.cat.deserialize(saveData.cats);
      }
      if (saveData.waifus) {
        this.waifu.deserialize(saveData.waifus as Parameters<WaifuSystem['deserialize']>[0]);
      }
      if (saveData.goose) {
        this.goose.deserialize(saveData.goose);
      }
      if (saveData.events) {
        this.event.deserialize(saveData.events);
      }
      if (saveData.time) {
        this.time.deserialize(saveData.time);
      }
      if (saveData.daily) {
        this.daily.deserialize(saveData.daily);
      }
      if (saveData.achievements) {
        this.achievement.deserialize(saveData.achievements);
      }
      // Phase 4 deserialization
      if (saveData.cultivation) {
        this.cultivation.deserialize(saveData.cultivation);
      }
      if (saveData.prestige) {
        this.prestige.deserialize(saveData.prestige);
      }
      if (saveData.buildings) {
        this.building.deserialize(saveData.buildings);
        this.buildingsDirty = true;
      }
      if (saveData.techniques) {
        this.technique.deserialize(saveData.techniques);
      }
      if (saveData.blessings) {
        this.blessing.deserialize(saveData.blessings);
      }
      // Phase 5 deserialization
      if (saveData.equipment) {
        this.equipment.deserialize(saveData.equipment);
      }
      if (saveData.crafting) {
        this.crafting.deserialize(saveData.crafting);
      }
      // Phase 6 deserialization
      if (saveData.pagoda) {
        this.pagoda.deserialize(saveData.pagoda as unknown as Parameters<PagodaSystem['deserialize']>[0]);
      }
      if (saveData.survival) {
        this.survival.deserialize(saveData.survival as unknown as Parameters<WaveSurvivalSystem['deserialize']>[0]);
      }
      if (saveData.tournament) {
        this.tournament.deserialize(saveData.tournament);
      }
      if (saveData.dreamRealm) {
        this.dream.deserialize(saveData.dreamRealm as unknown as Parameters<DreamRealmSystem['deserialize']>[0]);
      }
      if (saveData.gooseDimension) {
        this.gooseDimension.deserialize(saveData.gooseDimension as unknown as Parameters<GooseDimensionSystem['deserialize']>[0]);
      }
      if (saveData.memoryFragments) {
        this.memory.deserialize(saveData.memoryFragments as unknown as Parameters<MemoryFragmentsSystem['deserialize']>[0]);
      }
      // Phase 7 deserialization
      if (saveData.lore) {
        this.lore.deserialize(saveData.lore as unknown as Parameters<LoreSystem['deserialize']>[0]);
      }
      if (saveData.secrets) {
        this.secret.deserialize(saveData.secrets as unknown as Parameters<SecretSystem['deserialize']>[0]);
      }
      if (saveData.catino) {
        this.catino.deserialize(saveData.catino as unknown as Parameters<CatinoSystem['deserialize']>[0]);
      }
      if (saveData.drama) {
        this.drama.deserialize(saveData.drama as unknown as Parameters<DramaSystem['deserialize']>[0]);
      }
      if (saveData.nemesis) {
        this.nemesis.deserialize(saveData.nemesis as unknown as Parameters<NemesisSystem['deserialize']>[0]);
      }
      if (saveData.hardcore) {
        this.hardcore.deserialize(saveData.hardcore as unknown as Parameters<HardcoreSystem['deserialize']>[0]);
      }
      if (saveData.irlIntegration) {
        this.irl.deserialize(saveData.irlIntegration);
      }
      if (saveData.partners) {
        this.partner.deserialize(saveData.partners);
      }
      if (saveData.parasites) {
        this.parasite.deserialize(saveData.parasites);
      }
      if (saveData.goldenSnoot) {
        this.goldenSnoot.deserialize(saveData.goldenSnoot);
      }
      if (saveData.elemental) {
        this.elemental.deserialize(saveData.elemental);
      }
      if (saveData.sectWar) {
        this.sectWar.deserialize(saveData.sectWar);
      }
      if (saveData.idle) {
        this.idle.deserialize(saveData.idle);
      }
    }

    // Initialize waifu (starter unlock)
    this.waifu.init();

    // Fresh saves start at Mortal Rank 1, so its rank-1 passive should be live.
    this.cultivation.ensureCurrentRankPassivesUnlocked();

    // Check stance unlocks based on cultivation realm
    this.technique.checkStanceUnlocks(this.cultivation.currentRealm);

    // Apply upgrade effects to boop system
    this.recalculate();

    // Check daily login
    const loginResult = this.daily.checkDailyLogin();
    if (loginResult.isNew && loginResult.reward) {
      for (const r of loginResult.reward.rewards) {
        this.economy.addCurrency(r.type as CurrencyId, r.value, 'daily_login');
      }
      this.addNotification('daily', `Day ${loginResult.streak} streak! Rewards claimed.`);
    }

    // Register game loop tick
    gameLoop.register(this.tick);
  }

  /**
   * Perform a boop (called from UI).
   */
  performBoop(): { bp: number; isCrit: boolean; combo: number } {
    const modifiers = this.getModifiers();
    const upgradeEffects = this.upgrade.getCombinedEffects();

    const result = this.boop.boop(modifiers, upgradeEffects.bpPerBoop);

    // Add BP to economy
    this.economy.addCurrency('bp', result.bp, 'boop');

    // Track for prestige
    this.prestige.trackBP(result.bp);
    this.prestige.trackBoops(1);
    this.sectWar.updateProgress('boop_count', 1);

    // Cultivation XP from booping
    this.cultivationXPAccumulator += 1 + modifiers.allStats * 0.1;

    // Stance mastery XP
    const stance = this.technique.getCurrentStance();
    this.technique.gainStanceMasteryXP(stance.mastery.xpPerBoop);

    // Update daily commission progress
    this.updateDailyProgress('boops', 1);
    if (result.isCrit) this.updateDailyProgress('criticalBoops', 1);

    // Emit boop event for UI/effects
    eventBus.emit(EVENTS.BOOP, { bp: result.bp, isCrit: result.isCrit, combo: result.combo });

    // Push state
    this.pushState();

    return { bp: result.bp, isCrit: result.isCrit, combo: result.combo };
  }

  /**
   * Purchase an upgrade.
   */
  purchaseUpgrade(upgradeId: string): boolean {
    const bp = this.economy.getBalance('bp');

    if (!this.upgrade.canPurchase(upgradeId, bp)) return false;

    const spent = this.upgrade.purchase(upgradeId);
    if (spent > 0) {
      this.economy.spendCurrency('bp', spent, `upgrade_${upgradeId}`);
      this.recalculate();
      this.pushState();
      return true;
    }
    return false;
  }

  /**
   * Recruit a cat (costs BP based on realm).
   */
  recruitCat(realm?: import('./types').CatRealmId): import('./types').Cat | null {
    const targetRealm = realm ?? 'kittenMortal';
    const cost = this.cat.getRecruitmentCost(targetRealm);
    if (this.economy.getBalance('bp') < cost) return null;
    if (this.cat.getAllCats().length >= this.getCatCapacity()) return null;
    this.economy.spendCurrency('bp', cost, `recruit_cat_${targetRealm}`);
    const cat = this.cat.recruitCat(targetRealm);
    if (cat) {
      this.catsDirty = true;
      this.prestige.trackCat();
      this.sectWar.updateProgress('cats_recruited', 1);
      this.updateDailyProgress('cats', 1);
      this.pushState();
    }
    return cat;
  }

  getCatCapacity(): number {
    return Math.max(1, Math.floor(this.getModifiers().catCapacity));
  }

  /**
   * Attempt to boop an active goose.
   */
  boopGoose(): import('./systems/events/goose-system').GooseBoopResult | null {
    if (!this.goose.activeGoose) return null;

    const modifiers = this.getModifiers();
    const critChance = 0.05 + modifiers.critChanceBonus;
    const result = this.goose.attemptBoop(critChance);

    if (result.defeated && result.rewards) {
      this.economy.addCurrency('bp', result.rewards.bp, 'goose_boop');
      if (result.rewards.feathers > 0) {
        this.economy.addCurrency('gooseFeathers', result.rewards.feathers, 'goose_boop');
      }
      if (result.rewards.goldenFeathers > 0) {
        this.economy.addCurrency('jadeCatnip', result.rewards.goldenFeathers, 'goose_golden');
      }
      this.prestige.trackGooseBoops(1);
      this.sectWar.updateProgress('goose_boops', 1);
      this.updateDailyProgress('goose', 1);
      this.addNotification('goose', result.message);
    }

    this.pushState();
    return result;
  }

  /**
   * Build or upgrade a building.
   */
  buildBuilding(buildingId: string): boolean {
    const bp = this.economy.getBalance('bp');
    if (!this.building.canBuild(buildingId, bp)) return false;

    const cost = this.building.build(buildingId);
    if (cost > 0) {
      this.economy.spendCurrency('bp', cost, `build_${buildingId}`);
      this.buildingsDirty = true;
      this.recalculate();
      this.addNotification('event', `Building upgraded: ${buildingId}`);
      this.pushState();
      return true;
    }
    return false;
  }

  /**
   * Attempt realm breakthrough.
   */
  attemptBreakthrough(): { success: boolean; newRealm?: string } {
    const result = this.cultivation.attemptBreakthrough();
    if (result.success && result.newRealm) {
      this.prestige.trackRealmReached(result.newRealm as import('./types').CultivationRealm);
      this.technique.checkStanceUnlocks(result.newRealm);
      this.addNotification('achievement', `Breakthrough! Reached ${result.newRealm}!`);
    } else if (!result.success) {
      this.addNotification('event', 'Breakthrough failed... Try again.');
    }
    this.pushState();
    return result;
  }

  /**
   * Unlock a territory (costs BP).
   */
  unlockTerritory(territoryId: import('./types').TerritoryId): boolean {
    const bp = this.economy.getBalance('bp');
    if (!this.building.canUnlockTerritory(territoryId, bp)) return false;
    const cost = this.building.unlockTerritory(territoryId);
    if (cost > 0) {
      this.economy.spendCurrency('bp', cost, `unlock_territory_${territoryId}`);
      this.buildingsDirty = true;
      this.recalculate();
      this.addNotification('event', `Territory unlocked: ${territoryId}`);
      this.pushState();
      return true;
    }
    return false;
  }

  /**
   * Perform a rebirth (Tier 1 prestige).
   */
  performRebirth(): { success: boolean; tier?: number; perks?: string[] } {
    const result = this.prestige.rebirth();
    if (result.success) {
      this.addNotification('achievement', `Rebirth! Now Tier ${result.tier}: ${result.perks?.join(', ')}`);
      this.pushState();
    }
    return result;
  }

  /**
   * Perform a reincarnation (Tier 2 prestige).
   */
  performReincarnation(): { success: boolean; karmaEarned?: number } {
    const result = this.prestige.reincarnate();
    if (result.success) {
      this.addNotification('achievement', `Reincarnated! +${result.karmaEarned} Karma Points`);
      this.pushState();
    }
    return result;
  }

  /**
   * Purchase a karma shop item.
   */
  purchaseKarma(itemId: string): boolean {
    const result = this.prestige.purchaseKarma(itemId);
    if (result) {
      this.addNotification('event', `Karma purchase: ${itemId}`);
      this.pushState();
    }
    return result;
  }

  /**
   * Perform transcendence (Tier 3 prestige).
   */
  performTranscendence(): { success: boolean } {
    const result = this.prestige.transcend();
    if (result.success) {
      this.addNotification('achievement', 'Transcendence achieved! A new era begins.');
      this.pushState();
    }
    return result;
  }

  /**
   * Start a waifu activity.
   */
  startWaifuActivity(waifuId: string, activityId: string): { success: boolean; dialogue?: string } {
    const buildingEffects = this.building.getCombinedEffects();
    let bondMultiplier = 1;
    if (typeof buildingEffects.bondGainBonus === 'number') bondMultiplier *= buildingEffects.bondGainBonus;
    if (typeof buildingEffects.bondActivityBonus === 'number') bondMultiplier *= buildingEffects.bondActivityBonus;
    return this.waifu.startActivity(waifuId, activityId, bondMultiplier);
  }

  cancelWaifuActivity(): void {
    this.waifu.cancelActivity();
  }

  // ─── Equipment Actions ───────────────────────────────────
  equipItem(catId: string, equipmentId: string): boolean {
    const ok = this.equipment.equip(catId, equipmentId);
    if (ok) this.pushState();
    return ok;
  }

  unequipItem(catId: string, slot: string): boolean {
    const ok = this.equipment.unequip(catId, slot as import('./systems/equipment/equipment-system').EquipmentSlotId);
    if (ok) this.pushState();
    return ok;
  }

  levelUpEquipment(equipmentId: string): boolean {
    const cost = this.equipment.getLevelUpCost(equipmentId);
    if (!this.equipment.canLevelUp(equipmentId) || !this.economy.canAfford({ bp: cost })) return false;
    this.economy.spendCurrency('bp', cost, 'equipment_levelup');
    this.equipment.levelUp(equipmentId);
    this.pushState();
    return true;
  }

  salvageEquipment(equipmentId: string): { scrap: number; essence: number } | null {
    const result = this.equipment.salvage(equipmentId);
    if (result) {
      this.economy.addCurrency('bp', result.scrap, 'equipment_salvage');
      this.crafting.addMaterial('iron_scrap', result.scrap);
      this.crafting.addMaterial('spirit_essence', Math.max(1, result.essence));
      this.addNotification('crafting', `Salvaged relic: +${result.scrap} scrap, +${Math.max(1, result.essence)} essence`);
      this.pushState();
    }
    return result;
  }

  socketStone(equipmentId: string, socketIndex: number, stoneId: string): boolean {
    const ok = this.equipment.socketStone(equipmentId, socketIndex, stoneId);
    if (ok) this.pushState();
    return ok;
  }

  enchantEquipment(equipmentId: string, enchantId: string): boolean {
    const enchant = this.crafting.getEnchantment(enchantId);
    if (!enchant || !this.equipment.getEquipment(equipmentId)) return false;
    if (!this.crafting.canEnchant(enchantId, this.economy.getBalance('bp'))) return false;

    const result = this.crafting.enchant(enchantId);
    if (!result.success || !result.stats) return false;
    if (!this.economy.spendCurrency('bp', enchant.bpCost, 'equipment_enchant')) return false;

    const ok = this.equipment.applyEnchant(equipmentId, result.stats);
    if (ok) {
      const item = this.equipment.getEquipment(equipmentId);
      this.addNotification('crafting', `Enchanted: ${item?.name ?? 'Relic'}`);
      this.pushState();
    }
    return ok;
  }

  // ─── Crafting Actions ────────────────────────────────────
  startCraft(blueprintId: string): import('./systems/equipment/crafting-system').CraftJob | null {
    const job = this.crafting.startCraft(blueprintId);
    if (job) this.pushState();
    return job;
  }

  cancelCraft(jobId: string): Record<string, number> | null {
    const refund = this.crafting.cancelCraft(jobId);
    if (refund) this.pushState();
    return refund;
  }

  // Crafting completion rewards
  private grantCompletedCraft(job: CraftJob): void {
    const blueprint = BLUEPRINTS.find((bp) => bp.id === job.blueprintId);
    if (!blueprint) return;

    if (blueprint.resultType === 'equipment') {
      const item = this.equipment.createEquipment(blueprint.result);
      if (item) {
        this.addNotification('crafting', `Forged: ${item.name}`);
      }
      return;
    }

    this.crafting.addMaterial(blueprint.result, 1);
    this.addNotification('crafting', `Crafted: ${blueprint.result}`);
  }

  // ─── Goose Ally ────────────────────────────────────────────
  selectGooseAlly(allyId: import('./types').GooseAllyType): boolean {
    const ok = this.goose.selectAlly(allyId);
    if (ok) this.pushState();
    return ok;
  }

  // ─── AFK Return ───────────────────────────────────────────
  calculateAFKReturn(): import('./systems/core/idle-system').AFKGainsResult | null {
    const lastSaveTime = this.idle.getLastActiveTime();
    const elapsed = Date.now() - lastSaveTime;
    if (elapsed < 60_000) return null; // less than 1 minute

    const modifiers = this.getModifiers();
    const ue = this.upgrade.getCombinedEffects();
    const buildingEffects = this.building.getCombinedEffects();
    const passiveBpPerSec = ue.passiveBpPerSecond + ((buildingEffects.passiveBpPerSecond as number) ?? 0);

    return this.idle.calculateAFKGains(lastSaveTime, {
      ppPerSec: this.cat.calculatePPPerSecond(modifiers),
      bpPerSec: passiveBpPerSec,
      afkMultiplier: modifiers.afkMultiplier,
      masterAfkBonus: 1,
      waifuAfkBonus: 1,
    });
  }

  applyAFKReturn(result: import('./systems/core/idle-system').AFKGainsResult): void {
    if (result.pp > 0) this.economy.addCurrency('pp', result.pp, 'afk_return');
    if (result.bp > 0) this.economy.addCurrency('bp', result.bp, 'afk_return');

    // Apply event rewards
    for (const evt of result.events) {
      const reward = evt.event.reward;
      const value = reward.isPercent
        ? reward.value * (reward.type === 'bp' ? this.economy.getBalance('bp') : this.economy.getBalance('pp'))
        : evt.resolvedValue;

      switch (reward.type) {
        case 'bp': this.economy.addCurrency('bp', value, 'afk_event'); break;
        case 'pp': this.economy.addCurrency('pp', value, 'afk_event'); break;
        case 'jadeCatnip': this.economy.addCurrency('jadeCatnip', value, 'afk_event'); break;
        case 'gooseFeather': this.economy.addCurrency('gooseFeathers', value, 'afk_event'); break;
        case 'cat':
          this.cat.recruitCat(undefined, this.getModifiers().rareCatBonus);
          this.catsDirty = true;
          break;
      }
    }

    // Apply happiness decay
    if (result.happinessDecay > 0) {
      for (const cat of this.cat.getAllCats()) {
        cat.happiness = Math.max(0, cat.happiness - result.happinessDecay);
      }
      this.catsDirty = true;
    }

    // Reset idle timestamps
    this.idle.recordActivity();
    this.pushState();
  }

  // ─── Cat-ino Actions ─────────────────────────────────────
  playSlots(bet: number): import('./systems/meta/catino-system').SlotResult | null {
    if (!this.economy.canAfford({ bp: bet }) || bet <= 0) return null;
    this.economy.spendCurrency('bp', bet, 'catino_slots');
    const result = this.catino.playSlots(bet);
    if (result.payout > 0) this.economy.addCurrency('bp', result.payout, 'catino_slots_win');
    this.pushState();
    return result;
  }

  startGooseRace(bets: Record<string, number>): import('./systems/meta/catino-system').RaceResult | null {
    const totalBet = Object.values(bets).reduce((s, v) => s + v, 0);
    if (!this.economy.canAfford({ bp: totalBet }) || totalBet <= 0) return null;
    this.economy.spendCurrency('bp', totalBet, 'catino_race');
    const result = this.catino.startGooseRace(bets);
    if (result.totalPayout > 0) this.economy.addCurrency('bp', result.totalPayout, 'catino_race_win');
    this.pushState();
    return result;
  }

  spinWheel(): import('./systems/meta/catino-system').WheelResult | null {
    const cost = 10000;
    const usedFreeSpin = this.catino.consumeFreeWheelSpin();
    if (!usedFreeSpin && !this.economy.canAfford({ bp: cost })) return null;
    if (!usedFreeSpin && !this.economy.spendCurrency('bp', cost, 'catino_wheel')) return null;
    const result = this.catino.spinWheel(cost);
    this.applyWheelEffect(result, cost);
    this.pushState();
    return result;
  }

  // --- Cat-ino wheel rewards ---

  private grantCatinoCat(message = 'Wheel reward: a cat joined your sect.'): void {
    const cat = this.cat.recruitCat(undefined, this.getModifiers().rareCatBonus);
    if (!cat) {
      this.addNotification('catino', 'Wheel reward fizzled: no recruitable cat was available.');
      return;
    }

    this.catsDirty = true;
    this.prestige.trackCat();
    this.sectWar.updateProgress('cats_recruited', 1);
    this.updateDailyProgress('cats', 1);
    this.addNotification('catino', message);
  }

  private applyWheelEffect(result: import('./systems/meta/catino-system').WheelResult, cost: number): void {
    switch (result.effect.type) {
      case 'bp_multiplier':
        this.addNotification('catino', `Wheel blessing: ${result.effect.description}`);
        break;

      case 'free_cat':
        this.grantCatinoCat('Wheel reward: a cat joined your sect.');
        break;

      case 'happiness_penalty': {
        const happinessDelta = result.effect.value ?? -50;
        const cats = this.cat.getAllCats();
        for (const cat of cats) {
          cat.happiness = Math.max(0, Math.min(100, cat.happiness + happinessDelta));
        }
        if (cats.length > 0) this.catsDirty = true;
        this.addNotification('catino', `Wheel backlash: all cats ${happinessDelta} happiness.`);
        break;
      }

      case 'goose_attack': {
        const goose = this.goose.forceSpawnGoose();
        this.addNotification('goose', `${goose.name} burst out of the Cat-ino!`);
        break;
      }

      case 'mystery_box':
        this.openCatinoMysteryBox(cost);
        break;

      case 'bp_loss': {
        const lossPercent = Math.abs(result.effect.value ?? 0.5);
        const loss = Math.floor(this.economy.getBalance('bp') * lossPercent);
        if (loss > 0) {
          this.economy.spendCurrency('bp', loss, 'catino_wheel_loss');
          this.catino.recordWheelLoss(loss);
        }
        this.addNotification('catino', `Wheel tax collected: -${loss} bp.`);
        break;
      }

      case 'bp_multiplier_payout': {
        const payout = Math.floor(cost * (result.effect.value ?? 0));
        if (payout > 0) {
          this.economy.addCurrency('bp', payout, 'catino_wheel_jackpot');
          this.prestige.trackBP(payout);
        }
        this.addNotification('catino', `JACKPOT: +${payout} bp.`);
        break;
      }

      case 'spin_again':
        this.catino.addFreeWheelSpin();
        this.addNotification('catino', 'Wheel reward: free spin banked.');
        break;
    }
  }

  private openCatinoMysteryBox(cost: number): void {
    const roll = Math.random();

    if (roll < 0.25) {
      const bpReward = cost * (2 + Math.floor(Math.random() * 4));
      this.economy.addCurrency('bp', bpReward, 'catino_mystery_box');
      this.prestige.trackBP(bpReward);
      this.catino.recordWheelPayout(bpReward);
      this.addNotification('catino', `Mystery box: +${bpReward} bp.`);
      return;
    }

    if (roll < 0.45) {
      const ppReward = Math.max(250, Math.floor(cost * 0.25));
      this.economy.addCurrency('pp', ppReward, 'catino_mystery_box');
      this.prestige.trackPP(ppReward);
      this.addNotification('catino', `Mystery box: +${ppReward} pp.`);
      return;
    }

    if (roll < 0.65) {
      const feathers = 1 + Math.floor(Math.random() * 3);
      this.economy.addCurrency('gooseFeathers', feathers, 'catino_mystery_box');
      this.addNotification('catino', `Mystery box: +${feathers} goose feathers.`);
      return;
    }

    if (roll < 0.85) {
      this.catino.addFreeWheelSpin();
      this.addNotification('catino', 'Mystery box: free spin banked.');
      return;
    }

    this.grantCatinoCat('Mystery box: a cat joined your sect.');
  }

  // --- Tournament Actions ---

  getTournamentTeamPreview(): TournamentTeamMember[] {
    return this.buildTournamentTeam();
  }

  enterTournament(): { success: boolean; error?: string } {
    this.tournament.checkWeeklyReset();

    const masterId = this.master.getSelectedId();
    if (!masterId) return { success: false, error: 'Choose a master before entering the tournament.' };

    const team = this.buildTournamentTeam();
    if (team.length < 4) {
      return { success: false, error: `Recruit ${4 - team.length} more cats to field a full team.` };
    }

    const result = this.tournament.startTournament(team, masterId);
    if (result.success) {
      this.addNotification('event', 'Celestial Tournament bracket opened.');
      this.pushState();
    }
    return result;
  }

  runTournamentRound(): { success: boolean; error?: string; result?: BattleResult } {
    const team = this.buildTournamentTeam();
    if (team.length < 4) {
      return { success: false, error: `Recruit ${4 - team.length} more cats to field a full team.` };
    }

    const started = this.tournament.startBattle(team);
    if (!started.success) return { success: false, error: started.error };

    const result = this.tournament.simulateBattle();
    if (!result) return { success: false, error: 'Tournament battle did not resolve.' };

    const opponent = this.master.getMasterById(result.opponentId);
    this.addNotification(
      'event',
      result.victory
        ? `Tournament victory over ${opponent?.name ?? result.opponentId}.`
        : `Tournament run ended against ${opponent?.name ?? result.opponentId}.`
    );
    this.pushState();
    return { success: true, result };
  }

  claimTournamentRewards(): TournamentRewards | null {
    const rewards = this.tournament.claimRewards();
    if (!rewards) return null;

    if (rewards.reputation > 0) {
      this.economy.addCurrency('sectReputation', rewards.reputation, 'tournament');
    }
    if (rewards.jadeCatnip > 0) {
      this.economy.addCurrency('jadeCatnip', rewards.jadeCatnip, 'tournament');
    }
    if (rewards.destinyThreads > 0) {
      this.economy.addCurrency('destinyThreads', rewards.destinyThreads, 'tournament');
    }

    this.addNotification('event', `Tournament rewards claimed: +${rewards.reputation} rep.`);
    this.pushState();
    return rewards;
  }

  private buildTournamentTeam(): TournamentTeamMember[] {
    const globalStatMultiplier = Math.max(1, this.getModifiers().allStats);

    return this.cat.getAllCats()
      .map((cat) => {
        const equipmentStats = this.equipment.calculateEquipmentStats(cat.instanceId);
        const equipmentMultiplier = Math.max(0.1, 1 + (equipmentStats.allStats ?? 0));
        const statMultiplier = globalStatMultiplier * equipmentMultiplier;
        const happiness = Math.max(0.75, Math.min(1.25, 0.75 + cat.happiness / 200));
        const snoot = cat.stats.snootMeridians ?? 0;
        const purr = cat.stats.innerPurr ?? 0;
        const floof = cat.stats.floofArmor ?? 0;
        const zoom = cat.stats.zoomieSteps ?? 0;
        const loaf = cat.stats.loafMastery ?? 0;

        const hp = Math.max(1, Math.floor(((120 + floof * 120 + loaf * 45) * happiness + (equipmentStats.hp ?? 0)) * statMultiplier));
        const attack = Math.max(1, Math.floor(((18 + snoot * 52 + purr * 20) * happiness + (equipmentStats.attack ?? 0)) * statMultiplier));
        const defense = Math.max(0, Math.floor((8 + floof * 34 + loaf * 10 + (equipmentStats.defense ?? 0)) * statMultiplier));
        const speed = Math.max(0.5, zoom + (equipmentStats.speed ?? 0) / 10);
        const critChance = Math.min(0.6, 0.05 + snoot * 0.025 + zoom * 0.01 + (equipmentStats.critChance ?? 0));
        const critDamage = Math.min(4.5, 1.4 + purr * 0.12 + (equipmentStats.critDamage ?? 0));
        const power = Math.floor(hp + attack * 4 + defense * 2 + speed * 35 + critChance * 500 + critDamage * 80);

        return {
          id: cat.instanceId,
          name: cat.name,
          hp,
          attack,
          defense,
          speed,
          critChance,
          critDamage,
          power,
        };
      })
      .sort((a, b) => b.power - a.power)
      .slice(0, 4);
  }

  // --- Pagoda/Dungeon Actions ---
  startPagodaRun(): { success: boolean; error?: string } {
    this.recalculate();
    const cats = this.cat.getAllCats();
    const catStats = cats.map(c => {
      const equipmentStats = this.equipment.calculateEquipmentStats(c.instanceId);
      const equipmentMultiplier = Math.max(0.1, 1 + (equipmentStats.allStats ?? 0));
      return {
        hp: Math.floor(((c.stats?.floofArmor ?? 1) * 10 + (equipmentStats.hp ?? 0)) * equipmentMultiplier),
        attack: Math.floor(((c.stats?.snootMeridians ?? 1) * 5 + (equipmentStats.attack ?? 0)) * equipmentMultiplier),
        defense: Math.floor(((c.stats?.loafMastery ?? 1) * 3 + (equipmentStats.defense ?? 0)) * equipmentMultiplier),
        crit: Math.min(0.75, 0.1 + ((c.stats?.zoomieSteps ?? 0) * 0.01) + (equipmentStats.critChance ?? 0)),
        critMult: Math.min(4.5, 2 + ((c.stats?.innerPurr ?? 0) * 0.05) + (equipmentStats.critDamage ?? 0)),
      };
    });
    const result = this.pagoda.startRun(catStats);
    if (result.success) {
      this.pagoda.advanceFloor();
    }
    this.pushState();
    return result;
  }

  advancePagodaFloor(): ReturnType<PagodaSystem['advanceFloor']> {
    const result = this.pagoda.advanceFloor();
    this.pushState();
    return result;
  }

  executePagodaCommand(commandId: string): ReturnType<PagodaSystem['executeCommand']> {
    this.recalculate();
    const result = this.pagoda.executeCommand(commandId);
    if (result.success) {
      const state = this.pagoda.combatState;
      if (state === 'victory') {
        this.sectWar.updateProgress('dungeon_floors', 1);
      }
      if (state === 'defeat' || state === 'fled') {
        this.grantPagodaRunCurrencies(this.pagoda.rewards);
        this.grantPagodaRunLoot(this.pagoda.rewards.items, Math.max(0, this.pagoda.currentFloor - 1));
      }
    }
    this.pushState();
    return result;
  }

  retreatPagodaRun(): import('./systems/combat/pagoda-system').RunRecord | null {
    if (!this.pagoda.inRun || this.pagoda.combatState !== 'victory') return null;
    const record = this.pagoda.endRun('retreated');
    this.grantPagodaRunCurrencies(record.rewards);
    this.grantPagodaRunLoot(record.rewards.items, record.floorsCleared);
    this.pushState();
    return record;
  }

  purchasePagodaUpgrade(type: import('./systems/combat/pagoda-system').UpgradeType): ReturnType<PagodaSystem['purchaseUpgrade']> {
    const result = this.pagoda.purchaseUpgrade(type);
    this.pushState();
    return result;
  }

  autoClearPagoda(targetFloor: number): ReturnType<PagodaSystem['autoClear']> {
    const result = this.pagoda.autoClear(targetFloor);
    if ('rewards' in result) {
      this.grantPagodaRunCurrencies(result.rewards, 'pagoda_autoclear');
      this.grantPagodaAutoClearLoot(result.floorsCleared);
      this.sectWar.updateProgress('dungeon_floors', result.floorsCleared);
    }
    this.pushState();
    return result;
  }

  private grantPagodaRunCurrencies(
    rewards: { bp: number; spiritStones?: number },
    source = 'pagoda_run'
  ): void {
    if (rewards.bp > 0) {
      this.economy.addCurrency('bp', rewards.bp, source);
      this.prestige.trackBP(rewards.bp);
    }
    if ((rewards.spiritStones ?? 0) > 0) {
      this.economy.addCurrency('spiritStones', rewards.spiritStones ?? 0, source);
    }
  }

  private grantPagodaRunLoot(items: LootItem[], floorCleared: number): void {
    const materialTotals = new Map<string, number>();
    let gearDrops = 0;

    for (const item of items) {
      for (const drop of this.getMaterialRewardsForLoot(item)) {
        materialTotals.set(drop.materialId, (materialTotals.get(drop.materialId) ?? 0) + drop.count);
      }

      const gearChanceByRarity: Record<LootItem['rarity'], number> = {
        common: 0.18,
        uncommon: 0.32,
        rare: 0.52,
        legendary: 0.82,
        mythic: 1,
      };
      const luckByRarity: Record<LootItem['rarity'], number> = {
        common: 0,
        uncommon: 4,
        rare: 10,
        legendary: 22,
        mythic: 40,
      };
      if (Math.random() < gearChanceByRarity[item.rarity]) {
        const gear = this.equipment.generateDrop(item.floor, luckByRarity[item.rarity]);
        if (gear) gearDrops++;
      }
    }

    const totalMaterials = this.grantMaterialTotals(materialTotals);
    const unlocked = this.unlockPagodaBlueprints(floorCleared);

    if (totalMaterials > 0) {
      this.addNotification('crafting', `Recovered ${totalMaterials} forge materials from Pagoda loot.`);
    }
    if (gearDrops > 0) {
      this.addNotification('crafting', `Recovered ${gearDrops} relic${gearDrops === 1 ? '' : 's'} from the Pagoda.`);
    }
    for (const name of unlocked) {
      this.addNotification('crafting', `Blueprint unlocked: ${name}`);
    }

  }

  private grantPagodaAutoClearLoot(floorsCleared: number): void {
    const materialTotals = new Map<string, number>();
    const luck = Math.max(0, (this.getModifiers().lootBonus - 1) * 100);

    for (let floor = 1; floor <= floorsCleared; floor++) {
      const drops = this.crafting.generateMaterialDrop(floor, floor % 10 === 0, luck);
      for (const drop of drops) {
        materialTotals.set(drop.materialId, (materialTotals.get(drop.materialId) ?? 0) + Math.max(1, Math.floor(drop.count * 0.5)));
      }
    }

    const totalMaterials = this.grantMaterialTotals(materialTotals);
    const unlocked = this.unlockPagodaBlueprints(floorsCleared);

    if (totalMaterials > 0) {
      this.addNotification('crafting', `Auto-clear recovered ${totalMaterials} forge materials.`);
    }
    for (const name of unlocked) {
      this.addNotification('crafting', `Blueprint unlocked: ${name}`);
    }
  }

  private grantMaterialTotals(totals: Map<string, number>): number {
    let total = 0;
    for (const [materialId, count] of totals) {
      if (count <= 0) continue;
      this.crafting.addMaterial(materialId, count);
      total += count;
    }
    return total;
  }

  private getMaterialRewardsForLoot(item: LootItem): Array<{ materialId: string; count: number }> {
    const materialPools: Record<LootItem['rarity'], string[]> = {
      common: ['iron_scrap', 'leather_strip', 'cloth_scrap', 'wood_splinter', 'monster_fang'],
      uncommon: ['iron_scrap', 'leather_strip', 'cloth_scrap', 'wood_splinter', 'steel_ingot', 'fine_leather', 'silk_thread'],
      rare: ['steel_ingot', 'fine_leather', 'silk_thread', 'beast_core', 'spirit_essence', 'moonstone', 'mithril_ore', 'dragon_scale'],
      legendary: ['mithril_ore', 'dragon_scale', 'phoenix_feather', 'moonstone', 'spirit_essence', 'void_essence', 'celestial_dust', 'ancient_rune', 'divine_thread'],
      mythic: ['void_essence', 'celestial_dust', 'ancient_rune', 'time_fragment', 'divine_thread', 'primordial_matter', 'reality_shard', 'cosmic_heart'],
    };
    const rollsByRarity: Record<LootItem['rarity'], number> = {
      common: 1,
      uncommon: 2,
      rare: 3,
      legendary: 4,
      mythic: 5,
    };
    const countByRarity: Record<LootItem['rarity'], number> = {
      common: 2,
      uncommon: 3,
      rare: 2,
      legendary: 2,
      mythic: 1,
    };

    const rewards: Array<{ materialId: string; count: number }> = [];
    const pool = materialPools[item.rarity];
    const floorScale = 1 + Math.min(item.floor, 100) / 50;

    for (let i = 0; i < rollsByRarity[item.rarity]; i++) {
      const materialId = pool[Math.floor(Math.random() * pool.length)];
      const count = Math.max(1, Math.floor(countByRarity[item.rarity] * floorScale * (0.75 + Math.random() * 0.5)));
      rewards.push({ materialId, count });
    }

    const scrollRoll = Math.random();
    if (item.rarity === 'common' && scrollRoll < 0.15) rewards.push({ materialId: 'enchant_scroll_common', count: 1 });
    if (item.rarity === 'uncommon' && scrollRoll < 0.25) rewards.push({ materialId: 'enchant_scroll_common', count: 1 });
    if (item.rarity === 'rare') {
      rewards.push({ materialId: 'enchant_scroll_common', count: 1 });
      if (scrollRoll < 0.35) rewards.push({ materialId: 'enchant_scroll_rare', count: 1 });
    }
    if (item.rarity === 'legendary') {
      rewards.push({ materialId: 'enchant_scroll_rare', count: 1 });
      if (scrollRoll < 0.5) rewards.push({ materialId: 'enchant_scroll_legendary', count: 1 });
    }
    if (item.rarity === 'mythic') {
      rewards.push({ materialId: 'enchant_scroll_rare', count: 1 });
      rewards.push({ materialId: 'enchant_scroll_legendary', count: 1 });
    }

    return rewards;
  }

  private unlockPagodaBlueprints(floorCleared: number): string[] {
    const unlocks: Array<[number, string]> = [
      [5, 'bp_fish_blade'],
      [8, 'bp_tiny_wizard_hat'],
      [12, 'bp_storm_collar'],
      [20, 'bp_refine_wood'],
      [30, 'bp_jade_crown'],
      [40, 'bp_battle_helmet'],
    ];

    const unlockedNames: string[] = [];
    for (const [floor, blueprintId] of unlocks) {
      if (floorCleared < floor) continue;
      if (this.crafting.unlockBlueprint(blueprintId)) {
        unlockedNames.push(BLUEPRINTS.find((bp) => bp.id === blueprintId)?.name ?? blueprintId);
      }
    }
    return unlockedNames;
  }

  /**
   * Get pending notifications and clear them.
   */
  consumeNotifications(): Notification[] {
    const notes = [...this.notifications];
    this.notifications = [];
    return notes;
  }

  addNotification(type: string, message: string): void {
    this.notifications.push({ type, message, time: Date.now() });
  }

  private updateDailyProgress(type: string, amount: number): void {
    const completed = this.daily.updateProgress(type, amount);
    for (const commission of completed) {
      for (const reward of commission.rewards) {
        const currency = reward.type === 'gooseFeather' ? 'gooseFeathers' : reward.type;
        this.economy.addCurrency(currency as CurrencyId, reward.value, 'daily_commission');
      }
      this.addNotification('daily', `Commission complete: ${commission.name}`);
    }
  }

  /**
   * Get aggregated game modifiers from all systems.
   */
  getModifiers(): GameModifiers {
    const base: GameModifiers = {
      bpMultiplier: 1,
      ppMultiplier: 1,
      afkMultiplier: 1,
      critChanceBonus: 0,
      critMultiplier: 10,
      catHappinessMultiplier: 1,
      happinessDecayReduction: 0,
      happinessGain: 0,
      catCapacity: 10,
      eventDiscoveryBonus: 1,
      gooseSpawnBonus: 0,
      rareCatBonus: 1,
      boopSpeedMultiplier: 1,
      preventDecay: false,
      lootBonus: 1,
      qiRegen: 1,
      allStats: 1,
      boopDamage: 1,
    };

    // Master passives
    const masterEffects = this.master.getPassiveEffects({});
    if (masterEffects.bpMultiplier) base.bpMultiplier *= masterEffects.bpMultiplier;
    if (masterEffects.afkMultiplier) base.afkMultiplier *= masterEffects.afkMultiplier;
    if (masterEffects.critChanceBonus) base.critChanceBonus += masterEffects.critChanceBonus;
    if (masterEffects.catHappinessMultiplier) base.catHappinessMultiplier *= masterEffects.catHappinessMultiplier;
    if (masterEffects.eventDiscoveryBonus) base.eventDiscoveryBonus *= masterEffects.eventDiscoveryBonus;
    if (masterEffects.rareCatBonus) base.rareCatBonus *= masterEffects.rareCatBonus;
    if (masterEffects.boopSpeedMultiplier) base.boopSpeedMultiplier *= masterEffects.boopSpeedMultiplier;
    if (masterEffects.preventDecay) base.preventDecay = true;

    // Upgrade effects
    const ue = this.upgrade.getCombinedEffects();
    base.bpMultiplier += ue.bpMultiplier - 1;
    base.ppMultiplier += ue.ppMultiplier - 1;
    base.afkMultiplier += ue.afkMultiplier - 1;
    base.critChanceBonus += ue.critChance;
    base.critMultiplier += ue.critMultiplier;
    base.happinessDecayReduction += ue.happinessDecayReduction;
    base.happinessGain += ue.happinessGain;
    base.catCapacity += Math.max(0, ue.catCapacity - 10);
    base.eventDiscoveryBonus *= (1 + ue.eventChanceBonus);

    // Economy temporary effects
    base.bpMultiplier *= this.economy.getEffectMultiplier('bp_mult');
    base.ppMultiplier *= this.economy.getEffectMultiplier('pp_mult');
    base.bpMultiplier *= this.catino.getBpMultiplier();

    // Waifu bonuses
    const waifuBonuses = this.waifu.getCombinedBonuses();
    base.bpMultiplier *= waifuBonuses.bpMultiplier;
    base.ppMultiplier *= waifuBonuses.ppMultiplier;
    base.afkMultiplier *= waifuBonuses.afkMultiplier;
    base.catHappinessMultiplier *= waifuBonuses.catHappinessBonus;

    // Goose ally effects
    const gooseEffects = this.goose.getAllyEffects();
    if (gooseEffects.boopDamageBonus) base.boopDamage *= gooseEffects.boopDamageBonus as number;
    if (gooseEffects.ppGenerationBonus) base.ppMultiplier *= gooseEffects.ppGenerationBonus as number;
    if (gooseEffects.eventFrequencyMult) base.eventDiscoveryBonus *= gooseEffects.eventFrequencyMult as number;

    // Cat trait aggregate (Phase 2)
    const traitMods = this.cat.getTraitMultipliers();
    base.bpMultiplier *= traitMods.bp;
    base.ppMultiplier *= traitMods.pp;
    base.catHappinessMultiplier *= traitMods.bond;
    base.critChanceBonus += traitMods.crit;
    base.lootBonus *= traitMods.loot;

    // Event temporary multipliers
    base.bpMultiplier *= this.event.getActiveEffectMultiplier('bpMult');
    base.ppMultiplier *= this.event.getActiveEffectMultiplier('ppMult');

    // Time-of-day modifiers
    const timeMods = this.time.getTimeModifiers();
    base.afkMultiplier *= timeMods.afkGains;

    // ── Phase 4: Progression modifiers ──

    // Cultivation passives
    const cultPassives = this.cultivation.getCombinedPassiveEffects();
    if (typeof cultPassives.boopPower === 'number') base.bpMultiplier *= cultPassives.boopPower;
    if (typeof cultPassives.ppGeneration === 'number') base.ppMultiplier *= cultPassives.ppGeneration;
    if (typeof cultPassives.afkEfficiency === 'number') base.afkMultiplier *= cultPassives.afkEfficiency;
    if (typeof cultPassives.critChance === 'number') base.critChanceBonus += cultPassives.critChance;
    if (typeof cultPassives.allStats === 'number') base.allStats *= cultPassives.allStats;
    if (typeof cultPassives.catCapacity === 'number') base.catCapacity += cultPassives.catCapacity;
    if (typeof cultPassives.allMultipliers === 'number') {
      base.bpMultiplier *= cultPassives.allMultipliers;
      base.ppMultiplier *= cultPassives.allMultipliers;
    }

    // Prestige multipliers (rebirth * reincarnation * transcendence)
    const prestigeMult = this.prestige.getTotalMultiplier()
      * this.prestige.getReincarnationMultiplier()
      * this.prestige.getTranscendenceMultiplier();
    base.bpMultiplier *= prestigeMult;
    base.ppMultiplier *= prestigeMult;

    // Karma shop effects
    const karmaEffects = this.prestige.getKarmaShopEffects();
    if (typeof karmaEffects.productionMult === 'number') {
      base.bpMultiplier *= karmaEffects.productionMult;
      base.ppMultiplier *= karmaEffects.productionMult;
    }
    if (typeof karmaEffects.critChance === 'number') base.critChanceBonus += karmaEffects.critChance;
    if (typeof karmaEffects.afkMult === 'number') base.afkMultiplier *= karmaEffects.afkMult;

    // Celestial effects (transcendence bonuses)
    const celestialEffects = this.prestige.getCelestialEffects();
    if (typeof celestialEffects.allStats === 'number') base.allStats *= celestialEffects.allStats;

    // Building effects
    const buildingEffects = this.building.getCombinedEffects();
    if (typeof buildingEffects.bpMult === 'number') base.bpMultiplier *= buildingEffects.bpMult;
    if (typeof buildingEffects.ppMult === 'number') base.ppMultiplier *= buildingEffects.ppMult;
    if (typeof buildingEffects.afkMult === 'number') base.afkMultiplier *= buildingEffects.afkMult;
    if (typeof buildingEffects.allStats === 'number') base.allStats *= buildingEffects.allStats;
    if (typeof buildingEffects.catCapacity === 'number') base.catCapacity += buildingEffects.catCapacity;
    if (typeof buildingEffects.happinessDecayReduction === 'number') {
      base.happinessDecayReduction += buildingEffects.happinessDecayReduction;
    }
    if (typeof buildingEffects.happinessRegen === 'number') base.happinessGain += buildingEffects.happinessRegen / 100;
    if (typeof buildingEffects.idlePPBonus === 'number') base.ppMultiplier *= (1 + buildingEffects.idlePPBonus);
    if (typeof buildingEffects.eventDiscoveryBonus === 'number') base.eventDiscoveryBonus *= (1 + buildingEffects.eventDiscoveryBonus);
    if (typeof buildingEffects.gooseSpawnBonus === 'number') base.gooseSpawnBonus += buildingEffects.gooseSpawnBonus;
    if (typeof buildingEffects.visitorBonus === 'number') base.bpMultiplier *= buildingEffects.visitorBonus;
    if (typeof buildingEffects.nightBonus === 'number') {
      const hour = new Date().getHours();
      if (hour >= 20 || hour < 6) {
        base.bpMultiplier *= buildingEffects.nightBonus;
        base.ppMultiplier *= buildingEffects.nightBonus;
      }
    }

    // Technique stance modifiers
    const stanceMods = this.technique.getStanceBoopModifiers();
    base.bpMultiplier *= stanceMods.boopPower;
    base.boopSpeedMultiplier *= stanceMods.boopSpeed;
    base.critChanceBonus += stanceMods.critChance;
    base.critMultiplier *= stanceMods.critMultiplier / 10; // normalize from base 10

    // Technique hidden skill effects
    const techEffects = this.technique.getCombinedEffects();
    if (typeof techEffects.ppMult === 'number') base.ppMultiplier *= techEffects.ppMult;
    if (typeof techEffects.afkMult === 'number') base.afkMultiplier *= techEffects.afkMult;

    // Blessing effects (per-run)
    const blessingEffects = this.blessing.getCombinedEffects();
    if (typeof blessingEffects.critChance === 'number') base.critChanceBonus += blessingEffects.critChance;
    if (typeof blessingEffects.critDamage === 'number') base.critMultiplier *= (1 + blessingEffects.critDamage);
    if (typeof blessingEffects.damageMult === 'number') base.boopDamage *= blessingEffects.damageMult;
    if (typeof blessingEffects.bpMult === 'number') base.bpMultiplier *= blessingEffects.bpMult;
    if (typeof blessingEffects.ppMult === 'number') base.ppMultiplier *= blessingEffects.ppMult;
    if (typeof blessingEffects.attackSpeed === 'number') base.boopSpeedMultiplier *= blessingEffects.attackSpeed;
    if (typeof blessingEffects.lootBonus === 'number') base.lootBonus *= blessingEffects.lootBonus;

    // ── Phase 5: Equipment modifiers ──
    // Relic modifiers (during dungeon runs)
    const relicMods = this.relic.getModifiers();
    if (typeof relicMods.lootBonus === 'number' && relicMods.lootBonus > 1) base.lootBonus *= relicMods.lootBonus;
    if (typeof relicMods.qiRegen === 'number' && relicMods.qiRegen > 1) base.qiRegen *= relicMods.qiRegen;
    if (typeof relicMods.allStats === 'number' && relicMods.allStats > 1) base.allStats *= relicMods.allStats;
    if (typeof relicMods.boopDamage === 'number' && relicMods.boopDamage > 1) base.boopDamage *= relicMods.boopDamage;
    if (typeof relicMods.critChance === 'number' && relicMods.critChance > 0) base.critChanceBonus += relicMods.critChance;

    return base;
  }

  /**
   * Recalculate derived values after upgrades/equipment change.
   */
  private recalculate(): void {
    const ue = this.upgrade.getCombinedEffects();
    this.boop.setBoopPower(1 + ue.bpPerBoop);

    const buildingEffects = this.building.getCombinedEffects();
    const craftingSpeed = typeof buildingEffects.craftingSpeed === 'number' ? buildingEffects.craftingSpeed : 1;
    const recipeSlots = typeof buildingEffects.recipeSlots === 'number' ? buildingEffects.recipeSlots : 0;
    this.crafting.setCraftingSpeed(Math.max(1, craftingSpeed));
    this.crafting.setMaxQueueSize(3 + Math.max(0, Math.floor(recipeSlots)));

    const blessingEffects = this.blessing.getCombinedEffects();
    let megaBoopMultiplier = ue.megaBoopMultiplier;
    if (typeof blessingEffects.megaBoopDamage === 'number') {
      megaBoopMultiplier *= blessingEffects.megaBoopDamage;
    }
    this.pagoda.setCommandDamageMultiplier('mega_boop', megaBoopMultiplier);
  }

  /**
   * Game loop tick - runs every frame.
   */
  private tick = (ctx: GameLoopContext): void => {
    const deltaSec = ctx.deltaMs / 1000;
    this.catino.update();
    const ue = this.upgrade.getCombinedEffects();
    const modifiers = this.getModifiers();

    // Passive BP generation (upgrades + buildings)
    const buildingEffects = this.building.getCombinedEffects();
    const passiveBpPerSec = ue.passiveBpPerSecond + ((buildingEffects.passiveBpPerSecond as number) ?? 0);
    if (passiveBpPerSec > 0) {
      const passiveBP = passiveBpPerSec * deltaSec;
      this.economy.addCurrency('bp', passiveBP, 'passive');
      this.prestige.trackBP(passiveBP);
    }

    const catExpPerHour = typeof buildingEffects.catExpPerHour === 'number' ? buildingEffects.catExpPerHour : 0;
    const trainedCats = this.cat.getAllCats();
    if (catExpPerHour > 0 && trainedCats.length > 0) {
      this.catTrainingXPAccumulator += (catExpPerHour / 3600) * deltaSec;
      if (this.catTrainingXPAccumulator >= 1) {
        const xp = Math.floor(this.catTrainingXPAccumulator);
        this.catTrainingXPAccumulator -= xp;
        let leveledUp = false;
        for (const cat of trainedCats) {
          const result = this.cat.addCultivationXP(cat.instanceId, xp);
          leveledUp ||= result.leveledUp;
        }
        this.catsDirty = true;
        if (leveledUp) this.addNotification('achievement', 'Training Dojo advanced a feline disciple.');
      }
    }

    const spiritStonesPerHour = typeof buildingEffects.spiritStonesPerHour === 'number' ? buildingEffects.spiritStonesPerHour : 0;
    if (spiritStonesPerHour > 0) {
      this.spiritStoneAccumulator += (spiritStonesPerHour / 3600) * deltaSec;
      if (this.spiritStoneAccumulator >= 1) {
        const stones = Math.floor(this.spiritStoneAccumulator);
        this.spiritStoneAccumulator -= stones;
        this.economy.addCurrency('spiritStones', stones, 'spirit_mine');
      }
    }

    // Auto-boop
    if (ue.autoBoopRate > 0) {
      this.autoBoopAccumulator += ue.autoBoopRate * deltaSec * modifiers.boopSpeedMultiplier;
      while (this.autoBoopAccumulator >= 1) {
        this.autoBoopAccumulator -= 1;
        const bp = this.boop.getBoopPower() * modifiers.bpMultiplier * modifiers.boopDamage * 0.5;
        this.economy.addCurrency('bp', bp, 'auto_boop');
        this.prestige.trackBP(bp);
        this.prestige.trackBoops(1);
      }
    }

    // PP generation from cats
    const catPP = this.cat.calculatePPPerSecond(modifiers) * modifiers.ppMultiplier * deltaSec;
    const basePP = catPP > 0 ? catPP : 0.1 * modifiers.ppMultiplier * deltaSec;
    if (basePP > 0) {
      this.economy.addCurrency('pp', basePP, 'passive');
      this.prestige.trackPP(basePP);
    }

    // Cat happiness decay
    this.cat.updateHappiness(deltaSec, modifiers);
    const happiestCat = Math.max(0, ...this.cat.getAllCats().map((cat) => cat.happiness));
    this.updateDailyProgress('happiness', happiestCat);

    // Goose update (movement, escape timer)
    const gooseUpdate = this.goose.update(ctx.deltaMs);
    if (gooseUpdate.escaped && this.goose.activeGoose === null) {
      this.addNotification('goose', 'The goose escaped! HONK!');
    }

    // Waifu activity check
    const activityResult = this.waifu.checkPendingActivity();
    if (activityResult) {
      this.addNotification('waifu', `Activity complete! +${activityResult.bondGain} bond`);
      this.sectWar.updateProgress('waifu_bonds', activityResult.bondGain);
      this.updateDailyProgress('waifu', 1);
    }

    // Crafting queue update
    const completedCrafts = this.crafting.update(ctx.deltaMs);
    for (const job of completedCrafts) {
      this.grantCompletedCraft(job);
    }

    // Playtime tracking
    this.time.updatePlaytime(deltaSec);

    // Cultivation XP from passive play (0.5 XP/sec base, scaled by allStats)
    this.cultivationXPAccumulator += 0.5 * modifiers.allStats * deltaSec;
    if (this.cultivationXPAccumulator >= 1) {
      const xpToAdd = Math.floor(this.cultivationXPAccumulator);
      this.cultivationXPAccumulator -= xpToAdd;
      const cultResult = this.cultivation.addXP(xpToAdd);
      this.sectWar.updateProgress('cultivation_xp', xpToAdd);
      if (cultResult.leveledUp) {
        this.addNotification('achievement', `Cultivation rank up! Now Rank ${this.cultivation.currentRank}`);
        // Check new stance unlocks on rank up
        this.technique.checkStanceUnlocks(this.cultivation.currentRealm);
      }
      for (const passiveName of cultResult.newPassives) {
        this.addNotification('achievement', `Passive unlocked: ${passiveName}`);
      }
    }

    // Periodic checks (every ~5 seconds)
    this.eventCheckAccumulator += deltaSec;
    if (this.eventCheckAccumulator >= 5) {
      this.eventCheckAccumulator = 0;

      // Goose spawn check
      const gooseSpawn = this.goose.checkForSpawn(modifiers);
      if (gooseSpawn) {
        this.addNotification('goose', `${gooseSpawn.name} has appeared! HONK!`);
      }

      // Random event check
      const event = this.event.checkForEvent(modifiers);
      if (event) {
        // Apply instant effects
        for (const effect of event.effects) {
          if (effect.duration) {
            this.event.addTemporaryEffect(effect.type, effect.value, effect.duration);
          } else {
            switch (effect.type) {
              case 'bp': this.economy.addCurrency('bp', effect.value, 'event'); break;
              case 'pp': this.economy.addCurrency('pp', effect.value, 'event'); break;
              case 'jadeCatnip': this.economy.addCurrency('jadeCatnip', effect.value, 'event'); break;
              case 'gooseFeather': this.economy.addCurrency('gooseFeathers', effect.value, 'event'); break;
              case 'happiness':
                for (const cat of this.cat.getAllCats()) {
                  cat.happiness = Math.min(100, cat.happiness + effect.value);
                }
                this.catsDirty = true;
                break;
              case 'catDrop':
                this.cat.recruitCat(undefined, modifiers.rareCatBonus);
                this.catsDirty = true;
                break;
            }
          }
        }
        this.addNotification('event', `${event.emoji} ${event.name}: ${event.description}`);
      }

      // Waifu unlock check
      const newWaifus = this.waifu.checkUnlockConditions({
        catCount: this.cat.getAllCats().length,
        totalAfkTime: this.time.getTotalAfkTime(),
        allBasicUpgrades: this.upgrade.areAllBasicUpgradesPurchased(),
        allWaifusMaxBond: this.waifu.allMaxBond(),
      });
      for (const id of newWaifus) {
        this.addNotification('waifu', `New companion unlocked: ${id}!`);
      }

      // Hidden skill discovery check
      const gameStateForSkills: Record<string, number | boolean> = {
        maxCombo: this.boop.getMaxCombo(),
        criticalBoops: this.boop.getCriticalBoops(),
        totalAfkHours: this.time.getTotalAfkTime() / 3600,
        totalPP: this.economy.getBalance('pp'),
        catCount: this.cat.getAllCats().length,
        maxWaifuBond: this.waifu.getUnlockedWaifus().length > 0 ? Math.max(0, ...this.waifu.getUnlockedWaifus().map(w => w.bondLevel)) : 0,
        gooseBoops: this.goose.gooseBoops,
        cobraChickenDefeated: this.goose.cobraChickenDefeated,
      };
      const newSkills = this.technique.checkSkillDiscovery(gameStateForSkills);
      for (const skill of newSkills) {
        this.addNotification('achievement', `Hidden Skill discovered: ${skill.name}!`);
      }
    }

    // Achievement checks (every ~10 seconds)
    this.achievementCheckAccumulator += deltaSec;
    if (this.achievementCheckAccumulator >= 10) {
      this.achievementCheckAccumulator = 0;

      const newAchievements = this.achievement.checkAll({
        totalBoops: this.boop.getTotalBoops(),
        criticalBoops: this.boop.getCriticalBoops(),
        maxCombo: this.boop.getMaxCombo(),
        catCount: this.cat.getAllCats().length,
        gooseBoops: this.goose.gooseBoops,
        rageGooseBooped: this.goose.rageGooseBooped,
        cobraChickenDefeated: this.goose.cobraChickenDefeated,
        goldenGooseCrit: this.goose.goldenGooseCrit,
        waifuCount: this.waifu.getUnlockedWaifus().length,
        maxBond: this.waifu.getUnlockedWaifus().length > 0 ? Math.max(0, ...this.waifu.getUnlockedWaifus().map(w => w.bondLevel)) : 0,
        upgradeCount: Object.keys(this.upgrade.serialize().upgrades).length,
        totalBP: this.economy.getBalance('bp'),
        highestCatRealm: this.cat.getAllCats().reduce((best, c) => {
          const realmOrder = ['kittenMortal', 'earthKitten', 'skyKitten', 'heavenKitten', 'divineBeast', 'celestialBeast', 'cosmicEntity'];
          return realmOrder.indexOf(c.realm) > realmOrder.indexOf(best) ? c.realm : best;
        }, 'kittenMortal' as string),
      });

      for (const ach of newAchievements) {
        this.addNotification('achievement', `${ach.emoji} Achievement: ${ach.name}`);
        // Apply achievement rewards
        if (ach.reward) {
          switch (ach.reward.type) {
            case 'bp': this.economy.addCurrency('bp', ach.reward.value as number, 'achievement'); break;
            case 'pp': this.economy.addCurrency('pp', ach.reward.value as number, 'achievement'); break;
            case 'jadeCatnip': this.economy.addCurrency('jadeCatnip', ach.reward.value as number, 'achievement'); break;
            case 'gooseFeather': this.economy.addCurrency('gooseFeathers', ach.reward.value as number, 'achievement'); break;
            case 'waifuTokens': this.economy.addCurrency('waifuTokens', ach.reward.value as number, 'achievement'); break;
          }
        }
      }
    }

    // Push state to Zustand
    this.pushState();
  };

  /**
   * Push current engine state to Zustand.
   */
  private pushState(): void {
    if (!this.onStateChange) return;

    const patch: EnginePatch = {
      currencies: this.economy.getAllBalances(),
      stats: {
        totalBoops: this.boop.getTotalBoops(),
        maxCombo: this.boop.getMaxCombo(),
        criticalBoops: this.boop.getCriticalBoops(),
        gooseBoops: this.goose.gooseBoops,
      },
      modifiers: this.getModifiers(),
    };

    if (this.catsDirty) {
      patch.cats = this.cat.getAllCats();
      this.catsDirty = false;
    }

    if (this.buildingsDirty) {
      patch.buildings = this.building.serialize().buildings;
      this.buildingsDirty = false;
    }

    // Always include goose state so the UI can clear a defeated or escaped goose.
    patch.activeGoose = this.goose.activeGoose ? { ...this.goose.activeGoose } : null;

    // Include notifications
    const notes = this.consumeNotifications();
    if (notes.length > 0) {
      patch.notifications = notes;
    }

    this.onStateChange(patch);
  }

  /**
   * Build save data from current engine state.
   */
  buildSaveData() {
    return {
      master: this.master.getSelectedId(),
      resources: this.economy.getAllBalances(),
      stats: {
        totalBoops: this.boop.getTotalBoops(),
        maxCombo: this.boop.getMaxCombo(),
        criticalBoops: this.boop.getCriticalBoops(),
      },
      upgrades: this.upgrade.serialize(),
      economy: this.economy.serialize(),
      cats: this.cat.serialize(),
      waifus: this.waifu.serialize(),
      goose: this.goose.serialize(),
      events: this.event.serialize(),
      time: this.time.serialize(),
      daily: this.daily.serialize(),
      achievements: this.achievement.serialize(),
      // Phase 4
      cultivation: this.cultivation.serialize(),
      prestige: this.prestige.serialize(),
      buildings: this.building.serialize(),
      techniques: this.technique.serialize(),
      blessings: this.blessing.serialize(),
      // Phase 5
      equipment: this.equipment.serialize(),
      crafting: this.crafting.serialize(),
      // Phase 6
      pagoda: this.pagoda.serialize(),
      survival: this.survival.serialize(),
      tournament: this.tournament.serialize(),
      dreamRealm: this.dream.serialize(),
      gooseDimension: this.gooseDimension.serialize(),
      memoryFragments: this.memory.serialize(),
      // Phase 7
      lore: this.lore.serialize(),
      secrets: this.secret.serialize(),
      catino: this.catino.serialize(),
      drama: this.drama.serialize(),
      nemesis: this.nemesis.serialize(),
      hardcore: this.hardcore.serialize(),
      irlIntegration: this.irl.serialize(),
      partners: this.partner.serialize(),
      parasites: this.parasite.serialize(),
      goldenSnoot: this.goldenSnoot.serialize(),
      elemental: this.elemental.serialize(),
      sectWar: this.sectWar.serialize(),
      idle: this.idle.serialize(),
    };
  }
}

export interface Notification {
  type: string;
  message: string;
  time: number;
}

export interface EnginePatch {
  currencies?: Currencies;
  stats?: Partial<{
    totalBoops: number;
    maxCombo: number;
    criticalBoops: number;
    playtime: number;
    gooseBoops: number;
    totalAfkTime: number;
    rageGooseBooped: boolean;
    goldenGooseCrit: boolean;
    catsRecruited: number;
    gooseCriticals: number;
  }>;
  modifiers?: GameModifiers;
  cats?: import('./types').Cat[];
  buildings?: Record<string, number>;
  activeGoose?: import('./systems/events/goose-system').ActiveGoose | null;
  notifications?: Notification[];
}

// Singleton
export const engine = new Engine();
