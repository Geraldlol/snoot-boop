/**
 * CatSystem - Cat collection, cultivation, PP generation, techniques
 * Ported from js/cats.js (2,461 lines)
 */

import type {
  Cat, CatStats, CatRealmId, ElementType, CatPersonality,
  CatTechniques, SerializedCat, GameModifiers,
} from '../../types';
import {
  CAT_REALMS, REALM_ORDER, LEGACY_REALM_MAP, CAT_ELEMENTS, BASIC_ELEMENTS,
  CAT_PERSONALITIES, STAR_BONUSES, RECRUITMENT_COSTS, CAT_TECHNIQUES,
  CAT_TEMPLATES, type CatTemplate, type RealmData,
} from '../../data/cats';

// ─── CatSystem ───────────────────────────────────────────────

export class CatSystem {
  private ownedCats: Cat[] = [];
  private catIdCounter = 0;

  // ── Recruitment ────────────────────────────────────────────

  /** Recruit a random cat. Optionally force a realm. Returns the new cat or null on failure. */
  recruitCat(realm?: CatRealmId): Cat | null {
    const targetRealm = realm ?? this.rollRealm();
    const templates = CAT_TEMPLATES.filter((t) => t.baseRealm === targetRealm && !t.unlockedBy);
    if (templates.length === 0) return null;

    const template = templates[Math.floor(Math.random() * templates.length)];

    // Check for duplicate → star upgrade
    const existing = this.ownedCats.find((c) => c.id === template.id);
    if (existing) {
      this.addDuplicateCat(existing);
      return existing;
    }

    const cat = this.createCatInstance(template);
    this.ownedCats.push(cat);
    return cat;
  }

  /** Recruit a specific template by id (for unlock rewards, fusions, etc.) */
  recruitSpecific(templateId: string): Cat | null {
    const template = CAT_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return null;

    const existing = this.ownedCats.find((c) => c.id === templateId);
    if (existing) {
      this.addDuplicateCat(existing);
      return existing;
    }

    const cat = this.createCatInstance(template);
    this.ownedCats.push(cat);
    return cat;
  }

  getRecruitmentCost(realm: CatRealmId): number {
    return RECRUITMENT_COSTS[realm] ?? 100;
  }

  // ── Realm Rolling ──────────────────────────────────────────

  private rollRealm(): CatRealmId {
    const roll = Math.random();
    let cumulative = 0;
    for (const realmId of REALM_ORDER) {
      cumulative += CAT_REALMS[realmId].dropRate;
      if (roll <= cumulative) return realmId;
    }
    return 'kittenMortal';
  }

  // ── Cat Instance Creation ──────────────────────────────────

  private createCatInstance(template: CatTemplate): Cat {
    this.catIdCounter++;
    const instanceId = `cat_${this.catIdCounter}_${Date.now()}`;

    // Random stat variation (0.9-1.1 per stat)
    const statKeys: (keyof CatStats)[] = ['snootMeridians', 'innerPurr', 'floofArmor', 'zoomieSteps', 'loafMastery'];
    const statVariation: Record<string, number> = {};
    for (const key of statKeys) {
      statVariation[key] = 0.9 + Math.random() * 0.2;
    }

    const cat: Cat = {
      id: template.id,
      instanceId,
      name: template.name,
      school: template.school,
      realm: template.baseRealm,
      element: template.element,
      personality: template.personality,
      description: template.description,
      stats: { ...template.baseStats },
      baseStats: { ...template.baseStats },
      statVariation,
      calculatedStats: {},
      happiness: 100,
      level: 1,
      stars: 1,
      cultivationXP: 0,
      techniques: { active: [null, null, null, null], passive: [null, null] },
      learnedTechniques: [],
      techniqueXP: {},
      equipment: { weapon: null, armor: null, accessory: null },
      braveHeart: false,
      legendary: template.legendary ?? false,
      mythic: template.mythic,
      obtainedAt: Date.now(),
      totalBoops: 0,
      emoji: template.emoji,
      quotes: template.quotes,
    };

    this.recalculateStats(cat);
    return cat;
  }

  // ── Star Upgrade (Duplicates) ──────────────────────────────

  private addDuplicateCat(cat: Cat): void {
    if (cat.stars >= 6) {
      // Max stars — convert to jade catnip (handled by caller via return value)
      return;
    }
    cat.stars++;
    this.recalculateStats(cat);
  }

  isMaxStars(cat: Cat): boolean {
    return cat.stars >= 6;
  }

  // ── Stat Calculation ───────────────────────────────────────

  recalculateStats(cat: Cat): void {
    const realm = CAT_REALMS[cat.realm];
    const starBonus = STAR_BONUSES[cat.stars]?.stats ?? 1.0;
    const levelBonus = 1 + (cat.level - 1) * 0.05;

    const statKeys: (keyof CatStats)[] = ['snootMeridians', 'innerPurr', 'floofArmor', 'zoomieSteps', 'loafMastery'];
    for (const key of statKeys) {
      const base = cat.baseStats[key] ?? 0;
      const variation = cat.statVariation[key] ?? 1.0;
      cat.stats[key] = base * variation * starBonus * realm.statsMultiplier * levelBonus;
    }

    // Update calculatedStats mirror
    for (const key of statKeys) {
      cat.calculatedStats[key] = cat.stats[key] ?? 0;
    }
  }

  // ── Cultivation / Leveling ─────────────────────────────────

  getXPToLevel(cat: Cat): number {
    const realm = CAT_REALMS[cat.realm];
    return Math.floor(realm.xpBase * Math.pow(realm.xpScale, cat.level - 1));
  }

  addCultivationXP(catId: string, amount: number): { leveledUp: boolean; breakthroughReady: boolean } {
    const cat = this.getCatById(catId);
    if (!cat) return { leveledUp: false, breakthroughReady: false };

    cat.cultivationXP += amount;
    let leveledUp = false;

    const realm = CAT_REALMS[cat.realm];
    while (cat.cultivationXP >= this.getXPToLevel(cat) && cat.level < realm.maxLevel) {
      cat.cultivationXP -= this.getXPToLevel(cat);
      cat.level++;
      leveledUp = true;
      this.recalculateStats(cat);
    }

    const breakthroughReady = cat.level >= realm.maxLevel && realm.maxLevel !== Infinity;
    return { leveledUp, breakthroughReady };
  }

  canBreakthrough(catId: string, currencies: Record<string, number>): boolean {
    const cat = this.getCatById(catId);
    if (!cat) return false;

    const realm = CAT_REALMS[cat.realm];
    if (cat.level < realm.maxLevel) return false;

    const nextRealmIdx = REALM_ORDER.indexOf(cat.realm) + 1;
    if (nextRealmIdx >= REALM_ORDER.length) return false;

    const nextRealm = CAT_REALMS[REALM_ORDER[nextRealmIdx]];
    const cost = nextRealm.breakthroughCost ?? realm.breakthroughCost;
    for (const [key, amount] of Object.entries(cost)) {
      if ((currencies[key] ?? 0) < (amount ?? 0)) return false;
    }
    return true;
  }

  getBreakthroughCost(catId: string): Record<string, number> {
    const cat = this.getCatById(catId);
    if (!cat) return {};
    const nextRealmIdx = REALM_ORDER.indexOf(cat.realm) + 1;
    if (nextRealmIdx >= REALM_ORDER.length) return {};
    const nextRealm = CAT_REALMS[REALM_ORDER[nextRealmIdx]];
    return { ...nextRealm.breakthroughCost } as Record<string, number>;
  }

  performBreakthrough(catId: string): CatRealmId | null {
    const cat = this.getCatById(catId);
    if (!cat) return null;

    const nextRealmIdx = REALM_ORDER.indexOf(cat.realm) + 1;
    if (nextRealmIdx >= REALM_ORDER.length) return null;

    const nextRealmId = REALM_ORDER[nextRealmIdx];
    cat.realm = nextRealmId;
    cat.level = 1;
    cat.cultivationXP = 0;
    this.recalculateStats(cat);

    return nextRealmId;
  }

  // ── Techniques ─────────────────────────────────────────────

  canLearnTechnique(catId: string, techniqueId: string): boolean {
    const cat = this.getCatById(catId);
    if (!cat) return false;
    if (cat.learnedTechniques.includes(techniqueId)) return false;

    const tech = CAT_TECHNIQUES[techniqueId];
    if (!tech) return false;
    if (cat.level < tech.levelReq) return false;
    if (tech.realmReq) {
      const catRealmOrder = REALM_ORDER.indexOf(cat.realm);
      const reqRealmOrder = REALM_ORDER.indexOf(tech.realmReq);
      if (catRealmOrder < reqRealmOrder) return false;
    }
    if (tech.element && tech.element !== cat.element && !['void', 'chaos'].includes(cat.element)) return false;
    if ((cat.techniqueXP[techniqueId] ?? 0) < tech.xpCost) return false;

    return true;
  }

  learnTechnique(catId: string, techniqueId: string): boolean {
    if (!this.canLearnTechnique(catId, techniqueId)) return false;
    const cat = this.getCatById(catId)!;
    cat.learnedTechniques.push(techniqueId);
    return true;
  }

  equipTechnique(catId: string, techniqueId: string, slotType: 'active' | 'passive', slotIndex: number): boolean {
    const cat = this.getCatById(catId);
    if (!cat) return false;
    if (!cat.learnedTechniques.includes(techniqueId)) return false;

    const tech = CAT_TECHNIQUES[techniqueId];
    if (!tech || tech.type !== slotType) return false;

    const maxSlots = slotType === 'active' ? 4 : 2;
    if (slotIndex < 0 || slotIndex >= maxSlots) return false;

    cat.techniques[slotType][slotIndex] = techniqueId;
    return true;
  }

  addTechniqueXP(catId: string, techniqueId: string, amount: number): void {
    const cat = this.getCatById(catId);
    if (!cat) return;

    const personalityData = CAT_PERSONALITIES[cat.personality];
    const bonus = 1 + (personalityData?.effects.techniqueXPBonus ?? 0);

    cat.techniqueXP[techniqueId] = (cat.techniqueXP[techniqueId] ?? 0) + amount * bonus;
  }

  // ── Happiness ──────────────────────────────────────────────

  updateHappiness(deltaSeconds: number, modifiers: Partial<GameModifiers>): void {
    const decayRate = 0.01; // 1% per minute base
    const decayPerSecond = decayRate / 60;

    for (const cat of this.ownedCats) {
      let decay = decayPerSecond * deltaSeconds;

      // Personality modifiers
      const personalityData = CAT_PERSONALITIES[cat.personality];
      if (personalityData?.effects.happinessDecay) {
        decay *= (1 + personalityData.effects.happinessDecay);
      }

      // Yuelin master bonus
      if (modifiers.catHappinessMultiplier) {
        // Higher happiness mult → slower decay
        decay /= modifiers.catHappinessMultiplier;
      }

      cat.happiness = Math.max(0, cat.happiness - decay);
    }
  }

  boostHappiness(amount: number): void {
    for (const cat of this.ownedCats) {
      cat.happiness = Math.min(100, cat.happiness + amount);
    }
  }

  // ── PP Generation ──────────────────────────────────────────

  calculatePPPerSecond(modifiers: Partial<GameModifiers>): number {
    let totalPP = 0;

    for (const cat of this.ownedCats) {
      const realm = CAT_REALMS[cat.realm];
      const starBonus = STAR_BONUSES[cat.stars]?.stats ?? 1.0;
      const happinessMult = 0.5 + cat.happiness / 100; // 0.5x at 0 happiness, 1.5x at 100

      let catPP = cat.stats.innerPurr * cat.stats.loafMastery
        * realm.ppMultiplier
        * starBonus
        * happinessMult;

      // Master happiness multiplier (Yuelin)
      if (modifiers.catHappinessMultiplier) {
        catPP *= modifiers.catHappinessMultiplier;
      }

      // Personality AFK bonus
      const personalityData = CAT_PERSONALITIES[cat.personality];
      if (personalityData?.effects.afkBonus) {
        catPP *= (1 + personalityData.effects.afkBonus);
      }

      // Passive technique bonus (eternaLoaf etc.)
      for (const techId of cat.techniques.passive) {
        if (!techId) continue;
        const tech = CAT_TECHNIQUES[techId];
        if (tech?.effects.ppGeneration) {
          catPP *= (1 + tech.effects.ppGeneration);
        }
      }

      totalPP += catPP;
    }

    return totalPP;
  }

  // ── Team Resonance ─────────────────────────────────────────

  calculateTeamResonance(catIds: string[]): number {
    const cats = catIds.map((id) => this.getCatById(id)).filter(Boolean) as Cat[];
    if (cats.length < 2) return 0;

    let resonance = 0;
    for (let i = 0; i < cats.length; i++) {
      for (let j = i + 1; j < cats.length; j++) {
        const elemA = CAT_ELEMENTS[cats[i].element];
        const elemB = CAT_ELEMENTS[cats[j].element];
        if (elemA && elemB) {
          resonance += elemA.resonance[cats[j].element] ?? 0;
          resonance += elemB.resonance[cats[i].element] ?? 0;
        }
      }
    }
    return resonance;
  }

  // ── Queries ────────────────────────────────────────────────

  getAllCats(): Cat[] {
    return this.ownedCats;
  }

  getCatById(catId: string): Cat | null {
    return this.ownedCats.find((c) => c.instanceId === catId || c.id === catId) ?? null;
  }

  getCatsByRealm(realm: CatRealmId): Cat[] {
    return this.ownedCats.filter((c) => c.realm === realm);
  }

  getCatsByElement(element: ElementType): Cat[] {
    return this.ownedCats.filter((c) => c.element === element);
  }

  getCatCount(): number {
    return this.ownedCats.length;
  }

  getRandomCatQuote(): string | null {
    if (this.ownedCats.length === 0) return null;
    const cat = this.ownedCats[Math.floor(Math.random() * this.ownedCats.length)];
    if (!cat.quotes || cat.quotes.length === 0) return null;
    return cat.quotes[Math.floor(Math.random() * cat.quotes.length)];
  }

  // ── Reset (for prestige) ───────────────────────────────────

  reset(): void {
    this.ownedCats = [];
    this.catIdCounter = 0;
  }

  // ── Serialization ──────────────────────────────────────────

  serialize(): { cats: SerializedCat[]; catIdCounter: number; version: number } {
    return {
      cats: this.ownedCats.map((cat) => ({
        id: cat.id,
        instanceId: cat.instanceId,
        name: cat.name,
        school: cat.school,
        realm: cat.realm,
        element: cat.element,
        personality: cat.personality,
        happiness: cat.happiness,
        level: cat.level,
        stars: cat.stars,
        cultivationXP: cat.cultivationXP,
        statVariation: cat.statVariation,
        techniques: cat.techniques,
        learnedTechniques: cat.learnedTechniques,
        techniqueXP: cat.techniqueXP,
        equipment: cat.equipment,
        braveHeart: cat.braveHeart,
        totalBoops: cat.totalBoops,
        obtainedAt: cat.obtainedAt,
      })),
      catIdCounter: this.catIdCounter,
      version: 2,
    };
  }

  deserialize(data: { cats?: unknown[]; catIdCounter?: number; version?: number }): void {
    if (data.catIdCounter) this.catIdCounter = data.catIdCounter;
    if (!data.cats || !Array.isArray(data.cats)) return;

    this.ownedCats = [];
    for (const raw of data.cats) {
      const catData = raw as Record<string, unknown>;
      const cat = this.hydrateCat(catData, data.version ?? 2);
      if (cat) this.ownedCats.push(cat);
    }
  }

  private hydrateCat(data: Record<string, unknown>, version: number): Cat | null {
    const templateId = data.id as string;
    const template = CAT_TEMPLATES.find((t) => t.id === templateId);

    // Migrate legacy realm
    let realm = (data.realm as string) ?? 'kittenMortal';
    if (LEGACY_REALM_MAP[realm]) realm = LEGACY_REALM_MAP[realm];

    const personality = (data.personality as CatPersonality) ?? template?.personality ?? 'disciplined';
    const element = (data.element as ElementType) ?? template?.element ?? BASIC_ELEMENTS[Math.floor(Math.random() * BASIC_ELEMENTS.length)];

    const cat: Cat = {
      id: templateId,
      instanceId: (data.instanceId as string) ?? `cat_migrated_${this.catIdCounter++}`,
      name: (data.name as string) ?? template?.name ?? 'Unknown Cat',
      school: (data.school as string) ?? template?.school ?? 'wanderer',
      realm: realm as CatRealmId,
      element,
      personality,
      description: template?.description ?? '',
      stats: { ...(template?.baseStats ?? { snootMeridians: 1, innerPurr: 1, floofArmor: 1, zoomieSteps: 1, loafMastery: 1 }) },
      baseStats: { ...(template?.baseStats ?? { snootMeridians: 1, innerPurr: 1, floofArmor: 1, zoomieSteps: 1, loafMastery: 1 }) },
      statVariation: (data.statVariation as Record<string, number>) ?? { snootMeridians: 1, innerPurr: 1, floofArmor: 1, zoomieSteps: 1, loafMastery: 1 },
      calculatedStats: {},
      happiness: (data.happiness as number) ?? 100,
      level: (data.level as number) ?? (data.cultivationLevel as number) ?? 1,
      stars: (data.stars as number) ?? 1,
      cultivationXP: (data.cultivationXP as number) ?? (data.experience as number) ?? 0,
      techniques: (data.techniques as CatTechniques) ?? { active: [null, null, null, null], passive: [null, null] },
      learnedTechniques: (data.learnedTechniques as string[]) ?? [],
      techniqueXP: (data.techniqueXP as Record<string, number>) ?? {},
      equipment: (data.equipment as Record<string, string | null>) ?? { weapon: null, armor: null, accessory: null },
      braveHeart: (data.braveHeart as boolean) ?? false,
      legendary: template?.legendary ?? false,
      mythic: template?.mythic,
      obtainedAt: (data.obtainedAt as number) ?? Date.now(),
      totalBoops: (data.totalBoops as number) ?? 0,
      emoji: template?.emoji,
      quotes: template?.quotes,
    };

    this.recalculateStats(cat);
    return cat;
  }
}
