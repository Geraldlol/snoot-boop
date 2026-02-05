/**
 * nemesis.js - Nemesis System
 * "They remember. They always remember."
 */

const NEMESIS_TITLES = [
  '{enemy}, Slayer of {cat}',
  '{enemy} the {cat}-Bane',
  '{enemy}, Who Ended {cat}',
  'Dread {enemy}, Terror of Snoots',
  '{enemy} the Unbooped',
  '{enemy}, Scourge of the Sect',
  'Nightmare {enemy}'
];

const NEMESIS_TAUNTS = [
  "Ah, {cat}'s friends. Come to join them?",
  "I remember {cat}. They screamed. Will you?",
  "*laughs* You dare return?",
  "{cat} put up more of a fight than you.",
  "The Sect sends more victims? How kind.",
  "Your friend {cat} begged for mercy. I showed none.",
  "Another fool seeking vengeance for {cat}?",
  "I've been waiting for you..."
];

const REVENGE_QUOTES = [
  "That was for {cat}.",
  "Balance has been restored.",
  "Justice is served.",
  "{cat} can rest now.",
  "The debt is paid.",
  "Never forget. Never forgive.",
  "Vengeance... is MINE."
];

const NEMESIS_ABILITIES = [
  { id: 'enrage', name: 'Enrage', effect: { damageMultiplier: 1.5, duration: 3 } },
  { id: 'regen', name: 'Dark Regeneration', effect: { healPercent: 0.05 } },
  { id: 'armor', name: 'Hardened Scales', effect: { damageReduction: 0.2 } },
  { id: 'thorns', name: 'Vengeful Thorns', effect: { reflectDamage: 0.1 } },
  { id: 'summon', name: 'Call Minions', effect: { summonCount: 2 } },
  { id: 'execute', name: 'Execution', effect: { executeThreshold: 0.2 } },
  { id: 'lifesteal', name: 'Soul Drain', effect: { lifesteal: 0.15 } },
  { id: 'fear', name: 'Terrifying Presence', effect: { attackReduction: 0.2 } }
];

/**
 * NemesisSystem - Tracks and manages nemesis enemies
 */
class NemesisSystem {
  constructor() {
    this.nemeses = []; // Active nemeses
    this.defeatedNemeses = []; // Killed nemeses
    this.defectedNemeses = []; // Nemeses that joined you

    this.stats = {
      nemesesCreated: 0,
      nemesesDefeated: 0,
      nemesesDefected: 0,
      totalKillsByNemeses: 0,
      highestNemesisLevel: 0
    };
  }

  /**
   * Create a nemesis when an enemy kills a cat
   */
  createNemesis(enemy, killedCat) {
    const nemesis = {
      id: `nemesis_${Date.now()}`,
      baseEnemy: { ...enemy },
      name: enemy.name,
      emoji: enemy.emoji,
      level: 1,
      kills: [killedCat.name],
      killCount: 1,
      title: this.generateTitle(enemy, killedCat),
      taunts: this.generateTaunts(enemy, killedCat),
      abilities: [this.rollAbility()],
      createdAt: Date.now(),
      lastEncounter: Date.now(),
      timesEncountered: 1,
      timesEscaped: 0,

      // Stat bonuses per level
      hpMultiplier: 1.5,
      damageMultiplier: 1.3,

      // Track grudge
      grudgeTarget: killedCat.name
    };

    this.nemeses.push(nemesis);
    this.stats.nemesesCreated++;

    console.log(`[NEMESIS] ${nemesis.title} has risen!`);

    return nemesis;
  }

  /**
   * Generate title for nemesis
   */
  generateTitle(enemy, killedCat) {
    const template = NEMESIS_TITLES[Math.floor(Math.random() * NEMESIS_TITLES.length)];
    return template
      .replace('{enemy}', enemy.name)
      .replace('{cat}', killedCat.name);
  }

  /**
   * Generate taunts for nemesis
   */
  generateTaunts(enemy, killedCat) {
    const count = 3;
    const taunts = [];
    const available = [...NEMESIS_TAUNTS];

    for (let i = 0; i < count && available.length > 0; i++) {
      const index = Math.floor(Math.random() * available.length);
      const taunt = available.splice(index, 1)[0]
        .replace('{enemy}', enemy.name)
        .replace('{cat}', killedCat.name);
      taunts.push(taunt);
    }

    return taunts;
  }

  /**
   * Roll a random ability for nemesis
   */
  rollAbility() {
    return NEMESIS_ABILITIES[Math.floor(Math.random() * NEMESIS_ABILITIES.length)];
  }

  /**
   * Level up a nemesis after another kill
   */
  levelUpNemesis(nemesisId, killedCat) {
    const nemesis = this.nemeses.find(n => n.id === nemesisId);
    if (!nemesis) return null;

    nemesis.level++;
    nemesis.kills.push(killedCat.name);
    nemesis.killCount++;
    this.stats.totalKillsByNemeses++;

    if (nemesis.level > this.stats.highestNemesisLevel) {
      this.stats.highestNemesisLevel = nemesis.level;
    }

    // Update title based on level
    const levelTitles = ['', '', 'the Feared', 'the Dreaded', 'the Legendary', 'the ETERNAL'];
    if (nemesis.level < levelTitles.length && levelTitles[nemesis.level]) {
      nemesis.title = `${nemesis.baseEnemy.name} ${levelTitles[nemesis.level]}`;
    }

    // Gain abilities
    if (nemesis.level % 2 === 0 && nemesis.abilities.length < 4) {
      nemesis.abilities.push(this.rollAbility());
    }

    // Update multipliers
    nemesis.hpMultiplier = 1 + (nemesis.level * 0.5);
    nemesis.damageMultiplier = 1 + (nemesis.level * 0.25);

    console.log(`[NEMESIS] ${nemesis.title} has grown stronger! (Level ${nemesis.level})`);

    return nemesis;
  }

  /**
   * Get nemesis stats for combat
   */
  getNemesisStats(nemesis) {
    const base = nemesis.baseEnemy;
    return {
      hp: Math.floor(base.baseHp * nemesis.hpMultiplier),
      damage: Math.floor(base.baseDamage * nemesis.damageMultiplier),
      defense: base.baseDefense + nemesis.level * 2,
      speed: base.speed,
      abilities: nemesis.abilities
    };
  }

  /**
   * Get a random taunt from nemesis
   */
  getTaunt(nemesis) {
    if (!nemesis.taunts || nemesis.taunts.length === 0) return "...";
    return nemesis.taunts[Math.floor(Math.random() * nemesis.taunts.length)];
  }

  /**
   * Record nemesis encounter
   */
  onEncounter(nemesisId) {
    const nemesis = this.nemeses.find(n => n.id === nemesisId);
    if (nemesis) {
      nemesis.timesEncountered++;
      nemesis.lastEncounter = Date.now();
    }
  }

  /**
   * Nemesis defeated
   */
  onNemesisDefeated(nemesisId, avengerCat) {
    const index = this.nemeses.findIndex(n => n.id === nemesisId);
    if (index < 0) return null;

    const nemesis = this.nemeses.splice(index, 1)[0];
    nemesis.defeatedAt = Date.now();
    nemesis.defeatedBy = avengerCat?.name || 'Unknown';

    this.defeatedNemeses.push(nemesis);
    this.stats.nemesesDefeated++;

    // Generate revenge quote
    const quote = REVENGE_QUOTES[Math.floor(Math.random() * REVENGE_QUOTES.length)]
      .replace('{cat}', nemesis.grudgeTarget);

    console.log(`[NEMESIS] ${nemesis.title} has been defeated! "${quote}"`);

    // Calculate rewards
    const rewards = this.calculateNemesisRewards(nemesis);

    return {
      nemesis,
      quote,
      rewards
    };
  }

  /**
   * Calculate rewards for defeating a nemesis
   */
  calculateNemesisRewards(nemesis) {
    const levelMultiplier = Math.pow(2, nemesis.level - 1);
    return {
      bp: 1000 * levelMultiplier,
      tokens: 10 * nemesis.level,
      trophy: {
        id: `trophy_${nemesis.id}`,
        name: `Trophy: ${nemesis.title}`,
        description: `Defeated ${nemesis.title} after ${nemesis.killCount} kill(s)`,
        level: nemesis.level
      }
    };
  }

  /**
   * Check if nemesis offers to defect (rare)
   */
  checkDefection(nemesis) {
    // Only level 4+ can defect
    if (nemesis.level < 4) return false;

    // 5% chance
    return Math.random() < 0.05;
  }

  /**
   * Accept nemesis defection
   */
  acceptDefection(nemesisId) {
    const index = this.nemeses.findIndex(n => n.id === nemesisId);
    if (index < 0) return null;

    const nemesis = this.nemeses.splice(index, 1)[0];
    nemesis.defectedAt = Date.now();
    nemesis.isAlly = true;

    this.defectedNemeses.push(nemesis);
    this.stats.nemesesDefected++;

    console.log(`[NEMESIS] ${nemesis.title} has joined your cause!`);

    return nemesis;
  }

  /**
   * Get active nemeses that could appear
   */
  getActiveNemeses() {
    return this.nemeses;
  }

  /**
   * Check if a nemesis should appear in a floor
   */
  shouldNemesisAppear(floor) {
    if (this.nemeses.length === 0) return null;

    // Higher chance on higher floors
    const baseChance = 0.1 + (floor * 0.005);

    for (const nemesis of this.nemeses) {
      // Nemeses are more likely to appear the longer since last encounter
      const daysSinceEncounter = (Date.now() - nemesis.lastEncounter) / (24 * 60 * 60 * 1000);
      const adjustedChance = baseChance + (daysSinceEncounter * 0.05);

      if (Math.random() < adjustedChance) {
        return nemesis;
      }
    }

    return null;
  }

  /**
   * Get nemesis for UI display
   */
  getNemesisDisplay(nemesis) {
    return {
      id: nemesis.id,
      title: nemesis.title,
      emoji: nemesis.emoji,
      level: nemesis.level,
      kills: nemesis.kills,
      abilities: nemesis.abilities.map(a => a.name),
      stats: this.getNemesisStats(nemesis)
    };
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      nemeses: this.nemeses,
      defeatedNemeses: this.defeatedNemeses.slice(-20), // Keep last 20
      defectedNemeses: this.defectedNemeses,
      stats: this.stats
    };
  }

  /**
   * Load from save
   */
  deserialize(data) {
    if (data.nemeses) this.nemeses = data.nemeses;
    if (data.defeatedNemeses) this.defeatedNemeses = data.defeatedNemeses;
    if (data.defectedNemeses) this.defectedNemeses = data.defectedNemeses;
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
  }
}

// Export
window.NEMESIS_TITLES = NEMESIS_TITLES;
window.NEMESIS_TAUNTS = NEMESIS_TAUNTS;
window.NEMESIS_ABILITIES = NEMESIS_ABILITIES;
window.NemesisSystem = NemesisSystem;
