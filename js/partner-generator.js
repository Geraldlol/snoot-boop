/**
 * partner-generator.js - Procedural Partner Generator
 * "RNG Waifu/Husbando machine go brrr"
 */

const NAME_PARTS = {
  prefixes: ['Azure', 'Crimson', 'Silent', 'Jade', 'Shadow', 'Golden', 'Storm', 'Gentle', 'Frost', 'Ember', 'Void', 'Celestial', 'Iron', 'Silver', 'Midnight'],
  cores: ['Lotus', 'Blade', 'Moon', 'Petal', 'Thunder', 'Mist', 'Fang', 'Willow', 'Dragon', 'Phoenix', 'Tiger', 'Serpent', 'Crane', 'Wolf', 'Hawk'],
  suffixes: ['heart', 'dancer', 'weaver', 'keeper', 'walker', 'singer', 'bringer', 'caller', 'seeker', 'watcher', 'hunter', 'dreamer', 'whisper', 'shade', 'flame'],
  titles: ['the Serene', 'the Fierce', 'the Wandering', 'the Eternal', 'of the Hidden Valley', 'the Wise', 'the Bold', 'the Mysterious', 'of the Northern Wind', 'the Unyielding']
};

const PERSONALITY_TRAITS = {
  tsundere: {
    id: 'tsundere',
    name: 'Tsundere',
    description: 'Bonus on crit, penalty on miss',
    dialogueStyle: '"I-it\'s not like I wanted to help!"',
    effects: { critBonus: 0.5, misspenalty: 0.1 },
    dialogues: {
      greeting: "D-don't get the wrong idea! I'm only here because I have nothing better to do!",
      happy: "I-it's not like I'm happy or anything! Hmph!",
      sad: "I'm not upset! My eyes are just... sweating!"
    }
  },
  kuudere: {
    id: 'kuudere',
    name: 'Kuudere',
    description: 'Steady bonuses, no variance',
    dialogueStyle: '"...I see. Acceptable."',
    effects: { steadyBonus: 0.1, noVariance: true },
    dialogues: {
      greeting: "...Hello.",
      happy: "...Satisfactory.",
      sad: "...I see."
    }
  },
  genki: {
    id: 'genki',
    name: 'Genki',
    description: 'High variance, exciting events',
    dialogueStyle: '"YEAH! LET\'S GOOOO!"',
    effects: { eventChance: 0.3, varianceMultiplier: 2 },
    dialogues: {
      greeting: "HEY HEY HEY! Ready for adventure?!",
      happy: "WOOHOO! THIS IS AMAZING!",
      sad: "Aww... but we can turn it around! Let's GO!"
    }
  },
  dandere: {
    id: 'dandere',
    name: 'Dandere',
    description: 'AFK bonuses, shy in combat',
    dialogueStyle: '"...um... I\'ll try my best..."',
    effects: { afkBonus: 0.5, combatPenalty: 0.1 },
    dialogues: {
      greeting: "...h-hello...",
      happy: "...t-that's nice...",
      sad: "...oh..."
    }
  },
  yandere: {
    id: 'yandere',
    name: 'Yandere',
    description: 'Massive bonuses IF loyal to them',
    dialogueStyle: '"You only need ME, right? RIGHT?"',
    effects: { loyaltyBonus: 1.0, jealousyPenalty: 0.5 },
    dialogues: {
      greeting: "I've been waiting for you... only you... forever...",
      happy: "As long as we're together, nothing else matters!",
      sad: "You weren't... talking to someone else... were you?"
    }
  },
  himejoshi: {
    id: 'himejoshi',
    name: 'Himejoshi',
    description: 'Bonus when waifus interact',
    dialogueStyle: '"Ohoho~ How interesting~"',
    effects: { waifuInteractionBonus: 0.3 },
    dialogues: {
      greeting: "My my, what do we have here~?",
      happy: "Ohohoho! Delightful!",
      sad: "How... disappointing."
    }
  },
  bigSibling: {
    id: 'bigSibling',
    name: 'Big Brother/Sister',
    description: 'Protects other party members',
    dialogueStyle: '"Leave it to me."',
    effects: { partyProtection: 0.2 },
    dialogues: {
      greeting: "Don't worry. I'll take care of everything.",
      happy: "Seeing everyone happy makes me happy.",
      sad: "I couldn't protect them..."
    }
  },
  gremlin: {
    id: 'gremlin',
    name: 'Gremlin',
    description: 'Chaos bonuses, random effects',
    dialogueStyle: '"CHAOS CHAOS CHAOS"',
    effects: { chaosBonus: 0.2, randomEffects: true },
    dialogues: {
      greeting: "HEHEHE time for CHAOS!",
      happy: "AHAHAHAHA!",
      sad: "...no more chaos? ;-;"
    }
  }
};

const PARTNER_RARITIES = {
  common: { id: 'common', name: 'Common', color: '#9CA3AF', traitCount: 1, abilityPower: 0.8, accessoryCount: 0 },
  rare: { id: 'rare', name: 'Rare', color: '#3B82F6', traitCount: 2, abilityPower: 1.0, accessoryCount: 1 },
  epic: { id: 'epic', name: 'Epic', color: '#8B5CF6', traitCount: 2, abilityPower: 1.2, accessoryCount: 2 },
  legendary: { id: 'legendary', name: 'Legendary', color: '#F59E0B', traitCount: 3, abilityPower: 1.5, accessoryCount: 3 },
  mythic: { id: 'mythic', name: 'MYTHIC', color: '#EF4444', traitCount: 3, abilityPower: 2.0, accessoryCount: 4, uniqueAppearance: true }
};

const ABILITY_TEMPLATES = {
  offensive: {
    names: ['{element} Strike', '{element} Barrage', 'Wrath of {name}', '{trait} Assault', 'Devastating {element}'],
    effects: ['damage', 'dot', 'execute', 'aoe']
  },
  defensive: {
    names: ['{name}\'s Aegis', 'Shield of {element}', 'Unyielding {trait}', '{element} Ward', 'Protective {trait}'],
    effects: ['shield', 'taunt', 'heal', 'cleanse']
  },
  utility: {
    names: ['{trait} Insight', 'Way of the {element}', '{name}\'s Blessing', 'Empowering {element}', '{trait} Mastery'],
    effects: ['buff', 'debuff', 'resource', 'summon']
  }
};

const PARTNER_ELEMENTS = ['Fire', 'Water', 'Nature', 'Void', 'Light', 'Storm', 'Ice', 'Shadow'];
const PORTRAITS = ['👤', '👩', '👨', '🧝', '🧙', '🥷', '💃', '🕺', '🧚', '🧜', '🦸', '🦹'];

/**
 * PartnerGenerator - Creates procedural partners
 */
class PartnerGenerator {
  constructor() {
    this.generatedPartners = [];
    this.ownedPartners = [];

    this.stats = {
      partnersGenerated: 0,
      mythicsGenerated: 0,
      partnersTraded: 0
    };
  }

  /**
   * Generate a new partner
   */
  generate(forcedRarity = null) {
    // Determine rarity
    const rarity = forcedRarity || this.rollRarity();
    const rarityData = PARTNER_RARITIES[rarity];

    // Generate name
    const name = this.generateName();

    // Generate element
    const element = PARTNER_ELEMENTS[Math.floor(Math.random() * PARTNER_ELEMENTS.length)];

    // Pick traits
    const traits = this.pickTraits(rarityData.traitCount);

    // Generate abilities
    const abilities = this.generateAbilities(name, element, traits, rarityData);

    // Generate portrait
    const portrait = PORTRAITS[Math.floor(Math.random() * PORTRAITS.length)];

    // Create partner
    const partner = {
      id: `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.full,
      firstName: name.first,
      title: name.title,
      rarity: rarity,
      element: element,
      traits: traits,
      abilities: abilities,
      portrait: portrait,
      level: 1,
      exp: 0,
      bondLevel: 0,
      createdAt: Date.now(),
      stats: this.generateStats(rarityData)
    };

    this.generatedPartners.push(partner);
    this.stats.partnersGenerated++;

    if (rarity === 'mythic') {
      this.stats.mythicsGenerated++;
    }

    return partner;
  }

  /**
   * Roll for rarity
   */
  rollRarity() {
    const roll = Math.random() * 100;

    if (roll < 1) return 'mythic';
    if (roll < 5) return 'legendary';
    if (roll < 20) return 'epic';
    if (roll < 45) return 'rare';
    return 'common';
  }

  /**
   * Generate a name
   */
  generateName() {
    const prefix = NAME_PARTS.prefixes[Math.floor(Math.random() * NAME_PARTS.prefixes.length)];
    const core = NAME_PARTS.cores[Math.floor(Math.random() * NAME_PARTS.cores.length)];
    const suffix = NAME_PARTS.suffixes[Math.floor(Math.random() * NAME_PARTS.suffixes.length)];
    const title = NAME_PARTS.titles[Math.floor(Math.random() * NAME_PARTS.titles.length)];

    const firstName = `${prefix} ${core}${suffix}`;

    return {
      first: firstName,
      title: title,
      full: `${firstName}, ${title}`
    };
  }

  /**
   * Pick random traits
   */
  pickTraits(count) {
    const available = Object.keys(PERSONALITY_TRAITS);
    const picked = [];

    for (let i = 0; i < count && available.length > 0; i++) {
      const index = Math.floor(Math.random() * available.length);
      const traitId = available.splice(index, 1)[0];
      picked.push(PERSONALITY_TRAITS[traitId]);
    }

    return picked;
  }

  /**
   * Generate abilities
   */
  generateAbilities(name, element, traits, rarityData) {
    const abilities = [];
    const count = 2 + Math.floor(rarityData.abilityPower);

    const categories = ['offensive', 'defensive', 'utility'];

    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length];
      const template = ABILITY_TEMPLATES[category];

      const nameTemplate = template.names[Math.floor(Math.random() * template.names.length)];
      const effect = template.effects[Math.floor(Math.random() * template.effects.length)];

      const traitName = traits.length > 0 ? traits[0].name : 'Swift';

      const abilityName = nameTemplate
        .replace('{element}', element)
        .replace('{name}', name.first.split(' ')[0])
        .replace('{trait}', traitName);

      abilities.push({
        name: abilityName,
        category: category,
        effect: effect,
        power: Math.floor(10 * rarityData.abilityPower * (0.8 + Math.random() * 0.4)),
        cooldown: Math.floor(5 + Math.random() * 10)
      });
    }

    return abilities;
  }

  /**
   * Generate stats for partner
   */
  generateStats(rarityData) {
    const multiplier = rarityData.abilityPower;
    return {
      hp: Math.floor(100 * multiplier * (0.8 + Math.random() * 0.4)),
      attack: Math.floor(20 * multiplier * (0.8 + Math.random() * 0.4)),
      defense: Math.floor(10 * multiplier * (0.8 + Math.random() * 0.4)),
      speed: Math.floor(10 * multiplier * (0.8 + Math.random() * 0.4))
    };
  }

  /**
   * Add partner to owned
   */
  addToOwned(partner) {
    if (!this.ownedPartners.find(p => p.id === partner.id)) {
      this.ownedPartners.push(partner);
      return true;
    }
    return false;
  }

  /**
   * Get combined effects from partner traits
   */
  getPartnerEffects(partner) {
    const effects = {
      critBonus: 0,
      afkBonus: 0,
      eventChance: 0,
      partyProtection: 0,
      chaosBonus: 0,
      steadyBonus: 0
    };

    for (const trait of partner.traits) {
      if (trait.effects) {
        for (const [key, value] of Object.entries(trait.effects)) {
          if (typeof value === 'number' && effects[key] !== undefined) {
            effects[key] += value;
          }
        }
      }
    }

    return effects;
  }

  /**
   * Get dialogue from partner
   */
  getDialogue(partner, type = 'greeting') {
    for (const trait of partner.traits) {
      if (trait.dialogues && trait.dialogues[type]) {
        return trait.dialogues[type];
      }
    }
    return "...";
  }

  /**
   * Level up partner
   */
  levelUp(partnerId) {
    const partner = this.ownedPartners.find(p => p.id === partnerId);
    if (!partner) return null;

    partner.level++;
    partner.stats.hp = Math.floor(partner.stats.hp * 1.1);
    partner.stats.attack = Math.floor(partner.stats.attack * 1.1);
    partner.stats.defense = Math.floor(partner.stats.defense * 1.1);
    partner.stats.speed = Math.floor(partner.stats.speed * 1.05);

    return partner;
  }

  /**
   * Get partner display info
   */
  getPartnerDisplay(partner) {
    const rarityData = PARTNER_RARITIES[partner.rarity];
    return {
      ...partner,
      rarityColor: rarityData.color,
      rarityName: rarityData.name,
      traitNames: partner.traits.map(t => t.name),
      effects: this.getPartnerEffects(partner)
    };
  }

  /**
   * Serialize
   */
  serialize() {
    return {
      ownedPartners: this.ownedPartners,
      stats: this.stats
    };
  }

  /**
   * Deserialize
   */
  deserialize(data) {
    if (data.ownedPartners) this.ownedPartners = data.ownedPartners;
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
  }
}

// Export
window.NAME_PARTS = NAME_PARTS;
window.PERSONALITY_TRAITS = PERSONALITY_TRAITS;
window.PARTNER_RARITIES = PARTNER_RARITIES;
window.PartnerGenerator = PartnerGenerator;
