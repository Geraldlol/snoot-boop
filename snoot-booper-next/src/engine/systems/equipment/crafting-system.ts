/**
 * CraftingSystem - Materials, blueprints, crafting queue, enchantments
 * Ported from js/crafting.js (~1,524 lines)
 */

// ─── Material Types ──────────────────────────────────────────

export type MaterialCategory = 'basic' | 'refined' | 'rare' | 'legendary' | 'mythic';

export interface MaterialTemplate {
  id: string;
  name: string;
  category: MaterialCategory;
  emoji: string;
  description: string;
  maxStack: number;
}

export interface BlueprintData {
  id: string;
  name: string;
  result: string;
  resultType: 'equipment' | 'material';
  materials: Record<string, number>;
  craftTime: number; // ms
  unlocked: boolean;
}

export interface CraftJob {
  id: string;
  blueprintId: string;
  startTime: number;
  duration: number;
  complete: boolean;
}

export interface EnchantmentData {
  id: string;
  name: string;
  tier: 'common' | 'rare' | 'legendary';
  stats: Record<string, number>;
  scrollRequired: string;
  bpCost: number;
  materialsRequired: Record<string, number>;
}

// ─── Static Data ─────────────────────────────────────────────

export const MATERIAL_TEMPLATES: MaterialTemplate[] = [
  // Basic
  { id: 'iron_scrap',     name: 'Iron Scrap',      category: 'basic',     emoji: '🔩', description: 'Common metallic scrap.',      maxStack: 999 },
  { id: 'leather_strip',  name: 'Leather Strip',   category: 'basic',     emoji: '🟫', description: 'Tanned animal hide.',         maxStack: 999 },
  { id: 'cloth_scrap',    name: 'Cloth Scrap',     category: 'basic',     emoji: '🧵', description: 'Woven fabric remnants.',       maxStack: 999 },
  { id: 'wood_splinter',  name: 'Wood Splinter',   category: 'basic',     emoji: '🪵', description: 'Sturdy wood fragment.',        maxStack: 999 },
  { id: 'monster_fang',   name: 'Monster Fang',    category: 'basic',     emoji: '🦷', description: 'Tooth from a beast.',          maxStack: 999 },
  // Refined
  { id: 'steel_ingot',    name: 'Steel Ingot',     category: 'refined',   emoji: '⚙️', description: 'Refined metalwork.',          maxStack: 500 },
  { id: 'fine_leather',   name: 'Fine Leather',    category: 'refined',   emoji: '👜', description: 'Quality crafting leather.',    maxStack: 500 },
  { id: 'silk_thread',    name: 'Silk Thread',     category: 'refined',   emoji: '🪡', description: 'Delicate silk filament.',      maxStack: 500 },
  { id: 'enchanted_wood', name: 'Enchanted Wood',  category: 'refined',   emoji: '🌿', description: 'Magically infused wood.',     maxStack: 500 },
  { id: 'beast_core',     name: 'Beast Core',      category: 'refined',   emoji: '💎', description: 'Energy from a beast.',         maxStack: 500 },
  // Rare
  { id: 'mithril_ore',    name: 'Mithril Ore',     category: 'rare',      emoji: '✨', description: 'Silvery magical metal.',       maxStack: 200 },
  { id: 'dragon_scale',   name: 'Dragon Scale',    category: 'rare',      emoji: '🐉', description: 'Nearly indestructible.',       maxStack: 200 },
  { id: 'phoenix_feather',name: 'Phoenix Feather',  category: 'rare',      emoji: '🔥', description: 'Burns with eternal flame.',    maxStack: 200 },
  { id: 'moonstone',      name: 'Moonstone',       category: 'rare',      emoji: '🌙', description: 'Glows with lunar energy.',     maxStack: 200 },
  { id: 'spirit_essence', name: 'Spirit Essence',  category: 'rare',      emoji: '👻', description: 'Concentrated spiritual energy.',maxStack: 200 },
  // Legendary
  { id: 'void_essence',   name: 'Void Essence',    category: 'legendary', emoji: '🕳️', description: 'Fragment of the void.',       maxStack: 100 },
  { id: 'celestial_dust', name: 'Celestial Dust',  category: 'legendary', emoji: '⭐', description: 'Star dust from the heavens.',  maxStack: 100 },
  { id: 'time_fragment',  name: 'Time Fragment',   category: 'legendary', emoji: '⏳', description: 'Crystallized time.',           maxStack: 100 },
  { id: 'divine_thread',  name: 'Divine Thread',   category: 'legendary', emoji: '🧶', description: 'Woven by celestial beings.',   maxStack: 100 },
  { id: 'ancient_rune',   name: 'Ancient Rune',    category: 'legendary', emoji: '🪨', description: 'Power inscription.',           maxStack: 100 },
  // Mythic
  { id: 'primordial_matter',name: 'Primordial Matter',category: 'mythic', emoji: '🌌', description: 'From before creation.',        maxStack: 50 },
  { id: 'reality_shard',  name: 'Reality Shard',   category: 'mythic',    emoji: '💫', description: 'A piece of reality itself.',    maxStack: 50 },
  { id: 'cosmic_heart',   name: 'Cosmic Heart',    category: 'mythic',    emoji: '💜', description: 'Heart of a dying star.',        maxStack: 50 },
  // Enchantment scrolls
  { id: 'enchant_scroll_common',    name: 'Common Enchant Scroll',    category: 'rare',      emoji: '📜', description: 'A simple relic inscription.',   maxStack: 99 },
  { id: 'enchant_scroll_rare',      name: 'Rare Enchant Scroll',      category: 'rare',      emoji: '📘', description: 'A focused relic inscription.',  maxStack: 99 },
  { id: 'enchant_scroll_legendary', name: 'Legendary Enchant Scroll', category: 'legendary', emoji: '📕', description: 'A heavenly relic inscription.', maxStack: 50 },
];

export const BLUEPRINTS: BlueprintData[] = [
  // Basic equipment
  { id: 'bp_training_cap',    name: 'Craft Training Cap',      result: 'training_cap',    resultType: 'equipment', materials: { iron_scrap: 5, cloth_scrap: 3 },                craftTime: 5000,   unlocked: true },
  { id: 'bp_leather_collar',  name: 'Craft Leather Collar',    result: 'leather_collar',  resultType: 'equipment', materials: { leather_strip: 5 },                              craftTime: 5000,   unlocked: true },
  { id: 'bp_wooden_claws',    name: 'Craft Wooden Claws',      result: 'wooden_claws',    resultType: 'equipment', materials: { wood_splinter: 8 },                              craftTime: 5000,   unlocked: true },
  { id: 'bp_leather_vest',    name: 'Craft Leather Vest',      result: 'leather_vest',    resultType: 'equipment', materials: { leather_strip: 8, cloth_scrap: 3 },              craftTime: 8000,   unlocked: true },
  { id: 'bp_basic_paws',      name: 'Craft Paw Guards',        result: 'basic_paws',      resultType: 'equipment', materials: { leather_strip: 5, iron_scrap: 3 },               craftTime: 5000,   unlocked: true },
  { id: 'bp_fluffy_tail',     name: 'Craft Tail Charm',        result: 'fluffy_tail',     resultType: 'equipment', materials: { cloth_scrap: 5, monster_fang: 2 },               craftTime: 5000,   unlocked: true },
  // Refined equipment
  { id: 'bp_fish_blade',      name: 'Forge Fish Blade',        result: 'fish_blade',      resultType: 'equipment', materials: { steel_ingot: 5, beast_core: 2 },                 craftTime: 30000,  unlocked: false },
  { id: 'bp_tiny_wizard_hat', name: 'Craft Wizard Hat',        result: 'tiny_wizard_hat', resultType: 'equipment', materials: { silk_thread: 3, spirit_essence: 1 },              craftTime: 30000,  unlocked: false },
  { id: 'bp_storm_collar',    name: 'Forge Storm Collar',      result: 'storm_collar',    resultType: 'equipment', materials: { steel_ingot: 8, beast_core: 3, spirit_essence: 2 }, craftTime: 60000, unlocked: false },
  // Legendary blueprints
  { id: 'bp_jade_crown',      name: 'Forge Jade Crown',        result: 'jade_crown',      resultType: 'equipment', materials: { mithril_ore: 5, celestial_dust: 3, ancient_rune: 1 }, craftTime: 300000, unlocked: false },
  { id: 'bp_battle_helmet',   name: 'Forge Battle Helmet',     result: 'battle_helmet',   resultType: 'equipment', materials: { mithril_ore: 8, dragon_scale: 3, void_essence: 1 },  craftTime: 300000, unlocked: false },
  // Material refinement
  { id: 'bp_refine_steel',    name: 'Refine Steel',            result: 'steel_ingot',     resultType: 'material',  materials: { iron_scrap: 10 },                                craftTime: 10000,  unlocked: true },
  { id: 'bp_refine_leather',  name: 'Refine Leather',          result: 'fine_leather',    resultType: 'material',  materials: { leather_strip: 8 },                              craftTime: 10000,  unlocked: true },
  { id: 'bp_refine_silk',     name: 'Refine Silk',             result: 'silk_thread',     resultType: 'material',  materials: { cloth_scrap: 10 },                               craftTime: 10000,  unlocked: true },
  { id: 'bp_refine_wood',     name: 'Enchant Wood',            result: 'enchanted_wood',  resultType: 'material',  materials: { wood_splinter: 10, spirit_essence: 1 },           craftTime: 15000,  unlocked: false },
];

const ENCHANTMENTS: EnchantmentData[] = [
  { id: 'enchant_attack',  name: 'Sharpening',       tier: 'common',    stats: { attack: 10 },        scrollRequired: 'enchant_scroll_common', bpCost: 500,   materialsRequired: { spirit_essence: 3 } },
  { id: 'enchant_defense', name: 'Reinforcement',     tier: 'common',    stats: { defense: 8 },        scrollRequired: 'enchant_scroll_common', bpCost: 500,   materialsRequired: { spirit_essence: 3 } },
  { id: 'enchant_hp',      name: 'Vitality',          tier: 'common',    stats: { hp: 50 },            scrollRequired: 'enchant_scroll_common', bpCost: 500,   materialsRequired: { spirit_essence: 3 } },
  { id: 'enchant_crit',    name: 'Precision',         tier: 'rare',      stats: { critChance: 0.03 },  scrollRequired: 'enchant_scroll_rare',   bpCost: 3000,  materialsRequired: { spirit_essence: 5, moonstone: 2 } },
  { id: 'enchant_speed',   name: 'Swiftness',         tier: 'rare',      stats: { speed: 15 },         scrollRequired: 'enchant_scroll_rare',   bpCost: 3000,  materialsRequired: { spirit_essence: 5, moonstone: 2 } },
  { id: 'enchant_void',    name: 'Void Touch',        tier: 'legendary', stats: { voidDamage: 0.15 },  scrollRequired: 'enchant_scroll_legendary', bpCost: 25000, materialsRequired: { void_essence: 2, ancient_rune: 1 } },
];

// ─── Drop Generation ──────────────────────────────────────────

const TIER_DROP_CHANCES: Record<MaterialCategory, { base: number; floorScale: number }> = {
  basic:     { base: 0.6,  floorScale: -0.005 },
  refined:   { base: 0.25, floorScale: 0.003 },
  rare:      { base: 0.1,  floorScale: 0.004 },
  legendary: { base: 0.04, floorScale: 0.002 },
  mythic:    { base: 0.01, floorScale: 0.001 },
};

// ─── CraftingSystem Class ────────────────────────────────────

export class CraftingSystem {
  private materials: Record<string, number> = {};
  private unlockedBlueprints = new Set<string>(
    BLUEPRINTS.filter(b => b.unlocked).map(b => b.id)
  );
  private craftingQueue: CraftJob[] = [];
  private maxQueueSize = 3;
  private craftingSpeed = 1;

  private stats = {
    totalCrafted: 0,
    totalEnchanted: 0,
    totalMaterialsUsed: 0,
  };

  // ── Materials ────────────────────────────────────────────

  addMaterial(materialId: string, count: number): void {
    const template = MATERIAL_TEMPLATES.find(m => m.id === materialId);
    const max = template?.maxStack ?? 999;
    this.materials[materialId] = Math.min((this.materials[materialId] ?? 0) + count, max);
  }

  removeMaterial(materialId: string, count: number): boolean {
    if ((this.materials[materialId] ?? 0) < count) return false;
    this.materials[materialId] -= count;
    if (this.materials[materialId] <= 0) delete this.materials[materialId];
    return true;
  }

  getMaterialCount(materialId: string): number {
    return this.materials[materialId] ?? 0;
  }

  getAllMaterials(): Record<string, number> {
    return { ...this.materials };
  }

  // ── Material Drops ───────────────────────────────────────

  generateMaterialDrop(floor: number, isBoss = false, luck = 0): { materialId: string; count: number }[] {
    const drops: { materialId: string; count: number }[] = [];
    const floorBonus = Math.min(floor * 0.005, 0.3);
    const luckBonus = luck * 0.001;

    // Roll how many drops (1-3, more on boss)
    const dropCount = 1 + Math.floor(Math.random() * (isBoss ? 3 : 2));

    for (let i = 0; i < dropCount; i++) {
      const category = this.rollMaterialCategory(floorBonus, luckBonus);
      const materialsInCategory = MATERIAL_TEMPLATES.filter(m => m.category === category);
      if (materialsInCategory.length === 0) continue;

      const template = materialsInCategory[Math.floor(Math.random() * materialsInCategory.length)];
      const baseCount = category === 'basic' ? 2 + Math.floor(Math.random() * 4) :
                        category === 'refined' ? 1 + Math.floor(Math.random() * 3) :
                        category === 'rare' ? 1 + Math.floor(Math.random() * 2) : 1;
      const count = baseCount * (isBoss ? 2 : 1);

      drops.push({ materialId: template.id, count });
    }

    return drops;
  }

  private rollMaterialCategory(floorBonus: number, luckBonus: number): MaterialCategory {
    const chances: [MaterialCategory, number][] = [
      ['mythic',    Math.max(0, TIER_DROP_CHANCES.mythic.base + floorBonus * 0.1 + luckBonus * 0.3)],
      ['legendary', Math.max(0, TIER_DROP_CHANCES.legendary.base + floorBonus * 0.2 + luckBonus * 0.5)],
      ['rare',      Math.max(0, TIER_DROP_CHANCES.rare.base + floorBonus * 0.4 + luckBonus)],
      ['refined',   Math.max(0, TIER_DROP_CHANCES.refined.base + floorBonus * 0.3)],
      ['basic',     Math.max(0.2, TIER_DROP_CHANCES.basic.base - floorBonus)],
    ];

    const total = chances.reduce((s, [, w]) => s + w, 0);
    let roll = Math.random() * total;

    for (const [cat, weight] of chances) {
      roll -= weight;
      if (roll <= 0) return cat;
    }
    return 'basic';
  }

  // ── Blueprints ───────────────────────────────────────────

  unlockBlueprint(blueprintId: string): boolean {
    if (this.unlockedBlueprints.has(blueprintId)) return false;
    const bp = BLUEPRINTS.find(b => b.id === blueprintId);
    if (!bp) return false;
    this.unlockedBlueprints.add(blueprintId);
    return true;
  }

  isUnlocked(blueprintId: string): boolean {
    return this.unlockedBlueprints.has(blueprintId);
  }

  getAvailableBlueprints(): BlueprintData[] {
    return BLUEPRINTS.filter(b => this.unlockedBlueprints.has(b.id));
  }

  // ── Crafting Queue ───────────────────────────────────────

  canCraft(blueprintId: string): boolean {
    if (!this.unlockedBlueprints.has(blueprintId)) return false;
    if (this.craftingQueue.length >= this.maxQueueSize) return false;

    const bp = BLUEPRINTS.find(b => b.id === blueprintId);
    if (!bp) return false;

    for (const [matId, count] of Object.entries(bp.materials)) {
      if (this.getMaterialCount(matId) < count) return false;
    }
    return true;
  }

  startCraft(blueprintId: string): CraftJob | null {
    if (!this.canCraft(blueprintId)) return null;

    const bp = BLUEPRINTS.find(b => b.id === blueprintId)!;

    // Consume materials
    for (const [matId, count] of Object.entries(bp.materials)) {
      this.removeMaterial(matId, count);
      this.stats.totalMaterialsUsed += count;
    }

    const job: CraftJob = {
      id: `craft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      blueprintId,
      startTime: Date.now(),
      duration: Math.floor(bp.craftTime / this.craftingSpeed),
      complete: false,
    };

    this.craftingQueue.push(job);
    return job;
  }

  update(_deltaMs: number): CraftJob[] {
    const completed: CraftJob[] = [];
    const now = Date.now();

    for (const job of this.craftingQueue) {
      if (!job.complete && now >= job.startTime + job.duration) {
        job.complete = true;
        completed.push(job);
        this.stats.totalCrafted++;
      }
    }

    // Remove completed from queue
    this.craftingQueue = this.craftingQueue.filter(j => !j.complete);

    return completed;
  }

  getCraftProgress(jobId: string): number {
    const job = this.craftingQueue.find(j => j.id === jobId);
    if (!job) return 1;
    const elapsed = Date.now() - job.startTime;
    return Math.min(1, elapsed / job.duration);
  }

  cancelCraft(jobId: string): Record<string, number> | null {
    const idx = this.craftingQueue.findIndex(j => j.id === jobId);
    if (idx < 0) return null;

    const job = this.craftingQueue[idx];
    const bp = BLUEPRINTS.find(b => b.id === job.blueprintId);
    this.craftingQueue.splice(idx, 1);

    // Refund 50%
    const refund: Record<string, number> = {};
    if (bp) {
      for (const [matId, count] of Object.entries(bp.materials)) {
        const refunded = Math.ceil(count * 0.5);
        this.addMaterial(matId, refunded);
        refund[matId] = refunded;
      }
    }

    return refund;
  }

  getQueue(): CraftJob[] { return [...this.craftingQueue]; }

  setCraftingSpeed(mult: number): void { this.craftingSpeed = mult; }
  setMaxQueueSize(size: number): void { this.maxQueueSize = size; }

  // ── Enchantments ─────────────────────────────────────────

  getAvailableEnchantments(): EnchantmentData[] {
    return [...ENCHANTMENTS];
  }

  getEnchantment(enchantId: string): EnchantmentData | null {
    const enchant = ENCHANTMENTS.find(e => e.id === enchantId);
    return enchant
      ? { ...enchant, stats: { ...enchant.stats }, materialsRequired: { ...enchant.materialsRequired } }
      : null;
  }

  canEnchant(enchantId: string, currentBP: number): boolean {
    const enchant = ENCHANTMENTS.find(e => e.id === enchantId);
    if (!enchant) return false;
    if (currentBP < enchant.bpCost) return false;

    // Check scroll
    if (this.getMaterialCount(enchant.scrollRequired) < 1) return false;

    // Check materials
    for (const [matId, count] of Object.entries(enchant.materialsRequired)) {
      if (this.getMaterialCount(matId) < count) return false;
    }
    return true;
  }

  enchant(enchantId: string): { success: boolean; stats?: Record<string, number>; bpCost?: number } {
    const enchant = ENCHANTMENTS.find(e => e.id === enchantId);
    if (!enchant) return { success: false };
    if (this.getMaterialCount(enchant.scrollRequired) < 1) return { success: false };
    for (const [matId, count] of Object.entries(enchant.materialsRequired)) {
      if (this.getMaterialCount(matId) < count) return { success: false };
    }

    // Consume scroll + materials
    this.removeMaterial(enchant.scrollRequired, 1);
    for (const [matId, count] of Object.entries(enchant.materialsRequired)) {
      this.removeMaterial(matId, count);
    }

    this.stats.totalEnchanted++;
    return { success: true, stats: { ...enchant.stats }, bpCost: enchant.bpCost };
  }

  // ── Serialization ────────────────────────────────────────

  serialize() {
    return {
      materials: { ...this.materials },
      blueprints: Object.fromEntries([...this.unlockedBlueprints].map(id => [id, true])),
      craftingQueue: this.craftingQueue.map(j => ({ ...j })),
    };
  }

  deserialize(data: Record<string, unknown>): void {
    if (data.materials) this.materials = data.materials as Record<string, number>;
    if (data.blueprints) {
      this.unlockedBlueprints = new Set(Object.keys(data.blueprints as Record<string, boolean>));
    }
    if (data.craftingQueue) this.craftingQueue = data.craftingQueue as CraftJob[];
  }
}
