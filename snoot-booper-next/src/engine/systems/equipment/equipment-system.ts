/**
 * EquipmentSystem - Equipment slots, rarities, sets, substats, leveling, salvage
 * Ported from js/equipment.js (~1,815 lines)
 */

// ─── Types & Data ────────────────────────────────────────────

export type EquipmentSlotId = 'hat' | 'collar' | 'weapon' | 'armor' | 'paws' | 'tail';
export type EquipmentRarityId = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'transcendent';
export type ElementId = 'light' | 'water' | 'fire' | 'nature' | 'void';

export interface EquipmentSlot {
  id: EquipmentSlotId;
  name: string;
  emoji: string;
  primaryStats: string[];
}

export interface EquipmentRarity {
  id: EquipmentRarityId;
  name: string;
  color: string;
  multiplier: number;
  maxSubs: number;
  maxLevel: number;
  socketSlots: number;
}

export interface EquipmentTemplate {
  id: string;
  name: string;
  slot: EquipmentSlotId;
  rarity: EquipmentRarityId;
  set?: string;
  element?: ElementId;
  stats: Record<string, number>;
  flavorText: string;
}

export interface EquipmentInstance {
  id: string;
  templateId: string;
  name: string;
  slot: EquipmentSlotId;
  rarity: EquipmentRarityId;
  set: string | null;
  element: ElementId | null;
  level: number;
  maxLevel: number;
  stats: Record<string, number>;
  substats: Record<string, number>;
  sockets: (string | null)[];  // spirit stone IDs
  flavorText: string;
  createdAt: number;
}

export interface EquipmentSetData {
  id: string;
  name: string;
  pieces: string[];  // template IDs
  bonuses: Record<number, { description: string; effects: Record<string, number | boolean> }>;
}

export interface SpiritStone {
  id: string;
  name: string;
  stats: Record<string, number | boolean>;
  stackable: boolean;
  rarity: EquipmentRarityId;
}

// ─── Static Data ─────────────────────────────────────────────

export const EQUIPMENT_SLOTS: Record<EquipmentSlotId, EquipmentSlot> = {
  hat:     { id: 'hat',     name: 'Hat',     emoji: '🎩', primaryStats: ['wisdom', 'critDamage'] },
  collar:  { id: 'collar',  name: 'Collar',  emoji: '📿', primaryStats: ['hp', 'defense'] },
  weapon:  { id: 'weapon',  name: 'Weapon',  emoji: '⚔️', primaryStats: ['attack', 'critChance'] },
  armor:   { id: 'armor',   name: 'Armor',   emoji: '🛡️', primaryStats: ['defense', 'hp'] },
  paws:    { id: 'paws',    name: 'Paws',    emoji: '🐾', primaryStats: ['speed', 'dodge'] },
  tail:    { id: 'tail',    name: 'Tail',    emoji: '🌀', primaryStats: ['luck', 'allStats'] },
};

export const EQUIPMENT_RARITIES: Record<EquipmentRarityId, EquipmentRarity> = {
  common:       { id: 'common',       name: 'Common',       color: '#A0A0A0', multiplier: 1.0,  maxSubs: 1, maxLevel: 5,  socketSlots: 0 },
  uncommon:     { id: 'uncommon',     name: 'Uncommon',     color: '#50C878', multiplier: 1.25, maxSubs: 2, maxLevel: 10, socketSlots: 1 },
  rare:         { id: 'rare',         name: 'Rare',         color: '#4169E1', multiplier: 1.5,  maxSubs: 3, maxLevel: 15, socketSlots: 2 },
  epic:         { id: 'epic',         name: 'Epic',         color: '#9370DB', multiplier: 2.0,  maxSubs: 4, maxLevel: 20, socketSlots: 3 },
  legendary:    { id: 'legendary',    name: 'Legendary',    color: '#FFD700', multiplier: 3.0,  maxSubs: 4, maxLevel: 25, socketSlots: 4 },
  mythic:       { id: 'mythic',       name: 'Mythic',       color: '#DC143C', multiplier: 5.0,  maxSubs: 4, maxLevel: 30, socketSlots: 6 },
  transcendent: { id: 'transcendent', name: 'Transcendent', color: '#FFFFFF', multiplier: 10.0, maxSubs: 5, maxLevel: 40, socketSlots: 6 },
};

const SUBSTAT_POOL: { stat: string; base: number }[] = [
  { stat: 'attack', base: 5 },
  { stat: 'defense', base: 3 },
  { stat: 'hp', base: 10 },
  { stat: 'critChance', base: 0.01 },
  { stat: 'critDamage', base: 0.05 },
  { stat: 'speed', base: 2 },
  { stat: 'luck', base: 2 },
  { stat: 'dodge', base: 0.02 },
];

export const SPIRIT_STONES: Record<string, SpiritStone> = {
  attack_stone:     { id: 'attack_stone',     name: 'Attack Stone',     stats: { attack: 10 },           stackable: true,  rarity: 'common' },
  defense_stone:    { id: 'defense_stone',     name: 'Defense Stone',    stats: { defense: 10 },          stackable: true,  rarity: 'common' },
  hp_stone:         { id: 'hp_stone',          name: 'HP Stone',         stats: { hp: 50 },               stackable: true,  rarity: 'common' },
  crit_stone:       { id: 'crit_stone',        name: 'Crit Stone',       stats: { critChance: 0.02 },     stackable: false, rarity: 'rare' },
  crit_damage_stone:{ id: 'crit_damage_stone', name: 'Crit Damage Stone',stats: { critDamage: 0.1 },      stackable: false, rarity: 'rare' },
  speed_stone:      { id: 'speed_stone',       name: 'Speed Stone',      stats: { attackSpeed: 0.05 },    stackable: true,  rarity: 'uncommon' },
  void_stone:       { id: 'void_stone',        name: 'Void Stone',       stats: { voidDamage: 0.1 },      stackable: false, rarity: 'legendary' },
  chaos_stone:      { id: 'chaos_stone',       name: 'Chaos Stone',      stats: { randomBonus: true },     stackable: false, rarity: 'mythic' },
};

export const EQUIPMENT_TEMPLATES: EquipmentTemplate[] = [
  // Common weapons
  { id: 'wooden_claws',    name: 'Wooden Claws',     slot: 'weapon', rarity: 'common',   stats: { attack: 5 },                  flavorText: 'Better than nothing.' },
  { id: 'fish_blade',      name: 'Ancient Fish Blade',slot: 'weapon', rarity: 'rare',    stats: { attack: 25, critChance: 0.05 },flavorText: 'Forged from a legendary tuna.' },
  { id: 'laser_claw',      name: 'Laser-Guided Claws',slot: 'weapon', rarity: 'epic',    set: 'tech_cat',  stats: { attack: 40, speed: 20 }, flavorText: 'The red dot was inside you all along.' },
  { id: 'cardboard_sword', name: 'Cardboard Sword',   slot: 'weapon', rarity: 'legendary',set: 'box_knight',stats: { attack: 100, critChance: 0.25 }, flavorText: 'The box is mightier than the sword.' },
  // Armor
  { id: 'leather_vest',    name: 'Leather Vest',     slot: 'armor',  rarity: 'common',   stats: { defense: 5, hp: 20 },         flavorText: 'Standard issue.' },
  { id: 'cardboard_chest', name: 'Cardboard Chestplate',slot: 'armor',rarity: 'rare',    set: 'box_knight',stats: { defense: 30, hp: 100 },   flavorText: 'Comfy inside.' },
  { id: 'void_cloak',      name: 'Cloak of the Void',slot: 'armor',  rarity: 'epic',     set: 'void_stalker', stats: { defense: 20, dodge: 0.3 }, flavorText: 'Now you see me...' },
  // Hats
  { id: 'training_cap',    name: 'Training Cap',     slot: 'hat',    rarity: 'common',   stats: { wisdom: 3 },                  flavorText: 'Every cultivator starts here.' },
  { id: 'tiny_wizard_hat', name: 'Tiny Wizard Hat',  slot: 'hat',    rarity: 'uncommon', stats: { wisdom: 15, critDamage: 0.1 }, flavorText: 'Arcane floof.' },
  { id: 'battle_helmet',   name: 'Battle Helmet',    slot: 'hat',    rarity: 'legendary',stats: { defense: 50, hp: 200, attack: 30 }, flavorText: 'Worn by General Meowcius.' },
  { id: 'jade_crown',      name: 'Jade Crown',       slot: 'hat',    rarity: 'legendary',set: 'jade_emperor', stats: { allStats: 0.1, wisdom: 50 }, flavorText: 'For the true emperor.' },
  // Collars
  { id: 'leather_collar',  name: 'Leather Collar',   slot: 'collar', rarity: 'common',   stats: { hp: 15, defense: 2 },         flavorText: 'Reliable.' },
  { id: 'storm_collar',    name: 'Storm Collar',     slot: 'collar', rarity: 'rare',     set: 'thunder_god', stats: { hp: 50, attack: 15 }, flavorText: 'Crackles with energy.' },
  // Paws
  { id: 'basic_paws',      name: 'Basic Paw Guards', slot: 'paws',   rarity: 'common',   stats: { speed: 3, dodge: 0.01 },      flavorText: 'Keep those beans safe.' },
  { id: 'silent_paws',     name: 'Silent Paws',      slot: 'paws',   rarity: 'rare',     set: 'void_stalker', stats: { speed: 15, dodge: 0.1 }, flavorText: 'Not a sound.' },
  { id: 'lightning_claws', name: 'Lightning Claws',  slot: 'paws',   rarity: 'epic',     set: 'thunder_god', stats: { attack: 25, speed: 20 }, flavorText: 'Zap.' },
  // Tails
  { id: 'fluffy_tail',     name: 'Fluffy Tail Charm',slot: 'tail',   rarity: 'common',   stats: { luck: 3 },                    flavorText: 'So fluffy!' },
  { id: 'ghost_tail',      name: 'Ghost Tail',       slot: 'tail',   rarity: 'rare',     set: 'void_stalker', stats: { luck: 10, dodge: 0.08 }, flavorText: 'Phasing in and out.' },
];

export const EQUIPMENT_SETS: Record<string, EquipmentSetData> = {
  box_knight: {
    id: 'box_knight', name: 'Box Knight Set', pieces: ['cardboard_sword', 'cardboard_chest'],
    bonuses: {
      2: { description: '+20% defense', effects: { defense: 0.2 } },
    },
  },
  void_stalker: {
    id: 'void_stalker', name: 'Void Stalker Set', pieces: ['void_cloak', 'silent_paws', 'ghost_tail'],
    bonuses: {
      2: { description: '+30% dodge', effects: { dodge: 0.3 } },
      3: { description: 'First attack from stealth deals 3x damage', effects: { stealthStrike: 3.0 } },
    },
  },
  tech_cat: {
    id: 'tech_cat', name: 'Tech Cat Set', pieces: ['laser_claw'],
    bonuses: {},
  },
  thunder_god: {
    id: 'thunder_god', name: 'Thunder God Set', pieces: ['storm_collar', 'lightning_claws'],
    bonuses: {
      2: { description: '+15% crit damage, 15% stun chance', effects: { critDamage: 0.15, stunChance: 0.15 } },
    },
  },
  jade_emperor: {
    id: 'jade_emperor', name: 'Jade Emperor Set', pieces: ['jade_crown'],
    bonuses: {},
  },
};

const WEAPON_EVOLUTIONS: Record<string, { requires: string; maxLevel: number; result: EquipmentTemplate }> = {
  laser_claw: {
    requires: 'battery_pack', maxLevel: 100,
    result: { id: 'orbital_laser_array', name: 'Orbital Laser Array', slot: 'weapon', rarity: 'mythic', stats: { attack: 200, speed: 50, critChance: 0.3 }, flavorText: "That's no moon..." },
  },
  fish_blade: {
    requires: 'chef_hat', maxLevel: 100,
    result: { id: 'sashimi_slasher', name: 'Sashimi Slasher', slot: 'weapon', rarity: 'mythic', stats: { attack: 180, critDamage: 0.5 }, flavorText: 'Slice and dice.' },
  },
  cardboard_sword: {
    requires: 'duct_tape', maxLevel: 100,
    result: { id: 'mega_cardboard_mech', name: 'MEGA Cardboard Mech', slot: 'weapon', rarity: 'transcendent', set: 'box_knight', stats: { attack: 500, hp: 500, defense: 100 }, flavorText: 'UNLIMITED BOX WORKS' },
  },
};

// ─── EquipmentSystem Class ───────────────────────────────────

export class EquipmentSystem {
  private inventory: EquipmentInstance[] = [];
  private equipped: Record<string, Record<EquipmentSlotId, string | null>> = {}; // catId -> slot -> equipId
  private nextId = 1;

  private stats = {
    totalEquipped: 0,
    totalSalvaged: 0,
    totalLeveled: 0,
    highestRarity: 'common' as EquipmentRarityId,
  };

  // ── Creation ─────────────────────────────────────────────

  createEquipment(templateId: string, bonusRarity?: EquipmentRarityId): EquipmentInstance | null {
    const template = EQUIPMENT_TEMPLATES.find(t => t.id === templateId);
    if (!template) return null;

    const rarity = bonusRarity ?? template.rarity;
    const rarityData = EQUIPMENT_RARITIES[rarity];

    const instance: EquipmentInstance = {
      id: `equip_${this.nextId++}`,
      templateId: template.id,
      name: template.name,
      slot: template.slot,
      rarity,
      set: template.set ?? null,
      element: template.element ?? null,
      level: 1,
      maxLevel: rarityData.maxLevel,
      stats: { ...template.stats },
      substats: this.generateSubstats(template.slot, rarityData),
      sockets: Array(rarityData.socketSlots).fill(null),
      flavorText: template.flavorText,
      createdAt: Date.now(),
    };

    // Apply rarity multiplier to stats
    for (const key of Object.keys(instance.stats)) {
      instance.stats[key] *= rarityData.multiplier;
    }

    this.inventory.push(instance);
    this.updateHighestRarity(rarity);
    return instance;
  }

  private generateSubstats(slot: EquipmentSlotId, rarityData: EquipmentRarity): Record<string, number> {
    const primaryStats = EQUIPMENT_SLOTS[slot].primaryStats;
    const pool = SUBSTAT_POOL.filter(s => !primaryStats.includes(s.stat));
    const substats: Record<string, number> = {};

    const count = Math.min(rarityData.maxSubs, pool.length);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
      const s = shuffled[i];
      const variance = 0.5 + Math.random();
      substats[s.stat] = Math.round(s.base * variance * rarityData.multiplier * 100) / 100;
    }

    return substats;
  }

  // ── Equip/Unequip ────────────────────────────────────────

  equip(catId: string, equipmentId: string): boolean {
    const item = this.inventory.find(e => e.id === equipmentId);
    if (!item) return false;

    if (!this.equipped[catId]) {
      this.equipped[catId] = { hat: null, collar: null, weapon: null, armor: null, paws: null, tail: null };
    }

    // Unequip current item in slot
    const current = this.equipped[catId][item.slot];
    if (current) this.unequip(catId, item.slot);

    this.equipped[catId][item.slot] = equipmentId;
    this.stats.totalEquipped++;
    return true;
  }

  unequip(catId: string, slot: EquipmentSlotId): boolean {
    if (!this.equipped[catId]?.[slot]) return false;
    this.equipped[catId][slot] = null;
    return true;
  }

  getEquippedItems(catId: string): Record<EquipmentSlotId, EquipmentInstance | null> {
    const result = {} as Record<EquipmentSlotId, EquipmentInstance | null>;
    const slots = this.equipped[catId];

    for (const slotId of Object.keys(EQUIPMENT_SLOTS) as EquipmentSlotId[]) {
      const eqId = slots?.[slotId];
      result[slotId] = eqId ? (this.inventory.find(e => e.id === eqId) ?? null) : null;
    }
    return result;
  }

  isEquipped(equipmentId: string): boolean {
    for (const catSlots of Object.values(this.equipped)) {
      for (const eqId of Object.values(catSlots)) {
        if (eqId === equipmentId) return true;
      }
    }
    return false;
  }

  // ── Stat Calculation ─────────────────────────────────────

  calculateEquipmentStats(catId: string): Record<string, number> {
    const totalStats: Record<string, number> = {};
    const equipped = this.getEquippedItems(catId);

    for (const item of Object.values(equipped)) {
      if (!item) continue;
      const levelBonus = 1 + (item.level - 1) * 0.1;

      for (const [stat, value] of Object.entries(item.stats)) {
        totalStats[stat] = (totalStats[stat] ?? 0) + value * levelBonus;
      }
      for (const [stat, value] of Object.entries(item.substats)) {
        totalStats[stat] = (totalStats[stat] ?? 0) + value * levelBonus;
      }

      // Socket bonuses
      for (const stoneId of item.sockets) {
        if (!stoneId) continue;
        const stone = SPIRIT_STONES[stoneId];
        if (!stone) continue;
        for (const [stat, value] of Object.entries(stone.stats)) {
          if (typeof value === 'number') {
            totalStats[stat] = (totalStats[stat] ?? 0) + value;
          }
        }
      }
    }

    // Set bonuses
    const setBonuses = this.calculateSetBonuses(catId);
    for (const bonus of setBonuses) {
      for (const [stat, value] of Object.entries(bonus.effects)) {
        if (typeof value === 'number') {
          totalStats[stat] = (totalStats[stat] ?? 0) + value;
        }
      }
    }

    return totalStats;
  }

  calculateSetBonuses(catId: string): Array<{ setId: string; count: number; description: string; effects: Record<string, number | boolean> }> {
    const equipped = this.getEquippedItems(catId);
    const setCounts: Record<string, number> = {};

    for (const item of Object.values(equipped)) {
      if (!item?.set) continue;
      setCounts[item.set] = (setCounts[item.set] ?? 0) + 1;
    }

    const activeBonuses: Array<{ setId: string; count: number; description: string; effects: Record<string, number | boolean> }> = [];

    for (const [setId, count] of Object.entries(setCounts)) {
      const setData = EQUIPMENT_SETS[setId];
      if (!setData) continue;

      for (const [threshold, bonus] of Object.entries(setData.bonuses)) {
        if (count >= parseInt(threshold)) {
          activeBonuses.push({ setId, count, ...bonus });
        }
      }
    }

    return activeBonuses;
  }

  // ── Leveling ─────────────────────────────────────────────

  canLevelUp(equipmentId: string): boolean {
    const item = this.inventory.find(e => e.id === equipmentId);
    if (!item) return false;
    return item.level < item.maxLevel;
  }

  levelUp(equipmentId: string): boolean {
    const item = this.inventory.find(e => e.id === equipmentId);
    if (!item || item.level >= item.maxLevel) return false;

    item.level++;
    this.stats.totalLeveled++;
    return true;
  }

  getLevelUpCost(equipmentId: string): number {
    const item = this.inventory.find(e => e.id === equipmentId);
    if (!item) return Infinity;
    const rarityData = EQUIPMENT_RARITIES[item.rarity];
    return Math.floor(100 * rarityData.multiplier * Math.pow(1.3, item.level - 1));
  }

  // ── Socketing ────────────────────────────────────────────

  socketStone(equipmentId: string, socketIndex: number, stoneId: string): boolean {
    const item = this.inventory.find(e => e.id === equipmentId);
    if (!item) return false;
    if (socketIndex < 0 || socketIndex >= item.sockets.length) return false;
    if (!SPIRIT_STONES[stoneId]) return false;

    item.sockets[socketIndex] = stoneId;
    return true;
  }

  removeStone(equipmentId: string, socketIndex: number): string | null {
    const item = this.inventory.find(e => e.id === equipmentId);
    if (!item || socketIndex < 0 || socketIndex >= item.sockets.length) return null;

    const stoneId = item.sockets[socketIndex];
    item.sockets[socketIndex] = null;
    return stoneId;
  }

  applyEnchant(equipmentId: string, stats: Record<string, number>): boolean {
    const item = this.inventory.find(e => e.id === equipmentId);
    if (!item) return false;

    for (const [stat, value] of Object.entries(stats)) {
      item.substats[stat] = Math.round(((item.substats[stat] ?? 0) + value) * 100) / 100;
    }
    return true;
  }

  // ── Salvage ──────────────────────────────────────────────

  salvage(equipmentId: string): { scrap: number; essence: number } | null {
    if (this.isEquipped(equipmentId)) return null;
    const idx = this.inventory.findIndex(e => e.id === equipmentId);
    if (idx < 0) return null;

    const item = this.inventory[idx];
    const rarityData = EQUIPMENT_RARITIES[item.rarity];

    const result = {
      scrap: Math.floor(10 * rarityData.multiplier),
      essence: Math.floor(item.level * rarityData.multiplier),
    };

    this.inventory.splice(idx, 1);
    this.stats.totalSalvaged++;
    return result;
  }

  // ── Drop Generation ──────────────────────────────────────

  generateDrop(floor: number, bonusLuck = 0): EquipmentInstance | null {
    const rarity = this.rollDropRarity(floor, bonusLuck);
    const templates = EQUIPMENT_TEMPLATES.filter(t => {
      const rarityOrder: EquipmentRarityId[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'transcendent'];
      return rarityOrder.indexOf(t.rarity) <= rarityOrder.indexOf(rarity);
    });

    if (templates.length === 0) return null;
    const template = templates[Math.floor(Math.random() * templates.length)];
    return this.createEquipment(template.id, rarity);
  }

  private rollDropRarity(floor: number, bonusLuck: number): EquipmentRarityId {
    const roll = Math.random() + bonusLuck * 0.01 + floor * 0.002;

    if (floor >= 76 && roll > 0.99) return 'transcendent';
    if (floor >= 51 && roll > 0.96) return 'mythic';
    if (floor >= 26 && roll > 0.9)  return 'legendary';
    if (floor >= 11 && roll > 0.8)  return 'epic';
    if (roll > 0.6)                 return 'rare';
    if (roll > 0.35)                return 'uncommon';
    return 'common';
  }

  // ── Weapon Evolution ─────────────────────────────────────

  canEvolve(equipmentId: string, passiveId: string): boolean {
    const item = this.inventory.find(e => e.id === equipmentId);
    if (!item) return false;
    const evo = WEAPON_EVOLUTIONS[item.templateId];
    if (!evo) return false;
    return evo.requires === passiveId && item.level >= evo.maxLevel;
  }

  evolve(equipmentId: string): EquipmentInstance | null {
    const item = this.inventory.find(e => e.id === equipmentId);
    if (!item) return null;
    const evo = WEAPON_EVOLUTIONS[item.templateId];
    if (!evo) return null;

    // Replace the item with evolved version
    const rarityData = EQUIPMENT_RARITIES[evo.result.rarity];
    item.templateId = evo.result.id;
    item.name = evo.result.name;
    item.rarity = evo.result.rarity;
    item.maxLevel = rarityData.maxLevel;
    item.stats = { ...evo.result.stats };
    item.flavorText = evo.result.flavorText;
    if (evo.result.set) item.set = evo.result.set;

    // Apply rarity multiplier
    for (const key of Object.keys(item.stats)) {
      item.stats[key] *= rarityData.multiplier;
    }

    return item;
  }

  // ── Queries ──────────────────────────────────────────────

  getInventory(): EquipmentInstance[] { return [...this.inventory]; }
  getInventoryBySlot(slot: EquipmentSlotId): EquipmentInstance[] { return this.inventory.filter(e => e.slot === slot); }
  getInventoryByRarity(rarity: EquipmentRarityId): EquipmentInstance[] { return this.inventory.filter(e => e.rarity === rarity); }
  getEquipment(equipmentId: string): EquipmentInstance | null { return this.inventory.find(e => e.id === equipmentId) ?? null; }
  getInventoryCount(): number { return this.inventory.length; }

  private updateHighestRarity(rarity: EquipmentRarityId): void {
    const order: EquipmentRarityId[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'transcendent'];
    if (order.indexOf(rarity) > order.indexOf(this.stats.highestRarity)) {
      this.stats.highestRarity = rarity;
    }
  }

  // ── Serialization ────────────────────────────────────────

  serialize() {
    return {
      inventory: this.inventory.map(e => ({ ...e })),
      equipped: JSON.parse(JSON.stringify(this.equipped)),
      nextId: this.nextId,
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.inventory) this.inventory = data.inventory as EquipmentInstance[];
    if (data.equipped) this.equipped = data.equipped as Record<string, Record<EquipmentSlotId, string | null>>;
    if (data.nextId) this.nextId = data.nextId as number;
  }
}
