/**
 * PartnerSystem - Procedural partner generation
 * Ported from js/partner-generator.js
 * "RNG Waifu/Husbando machine go brrr"
 */

// ─── Types ──────────────────────────────────────────────────

export interface PartnerNameParts {
  prefixes: string[];
  cores: string[];
  suffixes: string[];
  titles: string[];
}

export interface PersonalityDialogues {
  greeting: string;
  happy: string;
  sad: string;
}

export interface PersonalityTrait {
  id: string;
  name: string;
  description: string;
  dialogueStyle: string;
  effects: Record<string, number | boolean>;
  dialogues: PersonalityDialogues;
}

export type PartnerRarityId = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface PartnerRarityData {
  id: PartnerRarityId;
  name: string;
  color: string;
  traitCount: number;
  abilityPower: number;
  accessoryCount: number;
  uniqueAppearance?: boolean;
}

export type PartnerElement = 'Fire' | 'Water' | 'Nature' | 'Void' | 'Light' | 'Storm' | 'Ice' | 'Shadow';

export interface PartnerAbility {
  name: string;
  category: 'offensive' | 'defensive' | 'utility';
  effect: string;
  power: number;
  cooldown: number;
}

export interface PartnerStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface PartnerName {
  first: string;
  title: string;
  full: string;
}

export interface Partner {
  id: string;
  name: string;
  firstName: string;
  title: string;
  rarity: PartnerRarityId;
  element: PartnerElement;
  traits: PersonalityTrait[];
  abilities: PartnerAbility[];
  level: number;
  exp: number;
  bondLevel: number;
  createdAt: number;
  stats: PartnerStats;
}

export interface PartnerEffects {
  critBonus: number;
  afkBonus: number;
  eventChance: number;
  partyProtection: number;
  chaosBonus: number;
  steadyBonus: number;
  loyaltyBonus: number;
  waifuInteractionBonus: number;
}

export interface PartnerSystemStats {
  partnersGenerated: number;
  mythicsGenerated: number;
  partnersTraded: number;
}

export interface PartnerSerializedData {
  ownedPartners: Partner[];
  stats: PartnerSystemStats;
}

// ─── Data ───────────────────────────────────────────────────

export const NAME_PARTS: PartnerNameParts = {
  prefixes: [
    'Azure', 'Crimson', 'Silent', 'Jade', 'Shadow',
    'Golden', 'Storm', 'Gentle', 'Frost', 'Ember',
    'Void', 'Celestial', 'Iron', 'Silver', 'Midnight',
  ],
  cores: [
    'Lotus', 'Blade', 'Moon', 'Petal', 'Thunder',
    'Mist', 'Fang', 'Willow', 'Dragon', 'Phoenix',
    'Tiger', 'Serpent', 'Crane', 'Wolf', 'Hawk',
  ],
  suffixes: [
    'heart', 'dancer', 'weaver', 'keeper', 'walker',
    'singer', 'bringer', 'caller', 'seeker', 'watcher',
    'hunter', 'dreamer', 'whisper', 'shade', 'flame',
  ],
  titles: [
    'the Serene', 'the Fierce', 'the Wandering', 'the Eternal',
    'of the Hidden Valley', 'the Wise', 'the Bold',
    'the Mysterious', 'of the Northern Wind', 'the Unyielding',
  ],
};

export const PERSONALITY_TRAITS: Record<string, PersonalityTrait> = {
  tsundere: {
    id: 'tsundere',
    name: 'Tsundere',
    description: 'Bonus on crit, penalty on miss',
    dialogueStyle: "\"I-it's not like I wanted to help!\"",
    effects: { critBonus: 0.5, missPenalty: 0.1 },
    dialogues: {
      greeting: "D-don't get the wrong idea! I'm only here because I have nothing better to do!",
      happy: "I-it's not like I'm happy or anything! Hmph!",
      sad: "I'm not upset! My eyes are just... sweating!",
    },
  },
  kuudere: {
    id: 'kuudere',
    name: 'Kuudere',
    description: 'Steady bonuses, no variance',
    dialogueStyle: '"...I see. Acceptable."',
    effects: { steadyBonus: 0.1, noVariance: true },
    dialogues: {
      greeting: '...Hello.',
      happy: '...Satisfactory.',
      sad: '...I see.',
    },
  },
  genki: {
    id: 'genki',
    name: 'Genki',
    description: 'High variance, exciting events',
    dialogueStyle: '"YEAH! LET\'S GOOOO!"',
    effects: { eventChance: 0.3, varianceMultiplier: 2 },
    dialogues: {
      greeting: 'HEY HEY HEY! Ready for adventure?!',
      happy: 'WOOHOO! THIS IS AMAZING!',
      sad: "Aww... but we can turn it around! Let's GO!",
    },
  },
  dandere: {
    id: 'dandere',
    name: 'Dandere',
    description: 'AFK bonuses, shy in combat',
    dialogueStyle: '"...um... I\'ll try my best..."',
    effects: { afkBonus: 0.5, combatPenalty: 0.1 },
    dialogues: {
      greeting: '...h-hello...',
      happy: "...t-that's nice...",
      sad: '...oh...',
    },
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
      sad: "You weren't... talking to someone else... were you?",
    },
  },
  himejoshi: {
    id: 'himejoshi',
    name: 'Himejoshi',
    description: 'Bonus when waifus interact',
    dialogueStyle: '"Ohoho~ How interesting~"',
    effects: { waifuInteractionBonus: 0.3 },
    dialogues: {
      greeting: 'My my, what do we have here~?',
      happy: 'Ohohoho! Delightful!',
      sad: 'How... disappointing.',
    },
  },
  bigSibling: {
    id: 'bigSibling',
    name: 'Big Brother/Sister',
    description: 'Protects other party members',
    dialogueStyle: '"Leave it to me."',
    effects: { partyProtection: 0.2 },
    dialogues: {
      greeting: "Don't worry. I'll take care of everything.",
      happy: 'Seeing everyone happy makes me happy.',
      sad: "I couldn't protect them...",
    },
  },
  gremlin: {
    id: 'gremlin',
    name: 'Gremlin',
    description: 'Chaos bonuses, random effects',
    dialogueStyle: '"CHAOS CHAOS CHAOS"',
    effects: { chaosBonus: 0.2, randomEffects: true },
    dialogues: {
      greeting: 'HEHEHE time for CHAOS!',
      happy: 'AHAHAHAHA!',
      sad: '...no more chaos? ;-;',
    },
  },
};

export const PARTNER_RARITIES: Record<PartnerRarityId, PartnerRarityData> = {
  common:    { id: 'common',    name: 'Common',    color: '#9CA3AF', traitCount: 1, abilityPower: 0.8, accessoryCount: 0 },
  rare:      { id: 'rare',      name: 'Rare',      color: '#3B82F6', traitCount: 2, abilityPower: 1.0, accessoryCount: 1 },
  epic:      { id: 'epic',      name: 'Epic',      color: '#8B5CF6', traitCount: 2, abilityPower: 1.2, accessoryCount: 2 },
  legendary: { id: 'legendary', name: 'Legendary', color: '#F59E0B', traitCount: 3, abilityPower: 1.5, accessoryCount: 3 },
  mythic:    { id: 'mythic',    name: 'MYTHIC',    color: '#EF4444', traitCount: 3, abilityPower: 2.0, accessoryCount: 4, uniqueAppearance: true },
};

export const PARTNER_ELEMENTS: PartnerElement[] = [
  'Fire', 'Water', 'Nature', 'Void', 'Light', 'Storm', 'Ice', 'Shadow',
];

const ABILITY_TEMPLATES: Record<string, { names: string[]; effects: string[] }> = {
  offensive: {
    names: ['{element} Strike', '{element} Barrage', 'Wrath of {name}', '{trait} Assault', 'Devastating {element}'],
    effects: ['damage', 'dot', 'execute', 'aoe'],
  },
  defensive: {
    names: ["{name}'s Aegis", 'Shield of {element}', 'Unyielding {trait}', '{element} Ward', 'Protective {trait}'],
    effects: ['shield', 'taunt', 'heal', 'cleanse'],
  },
  utility: {
    names: ['{trait} Insight', 'Way of the {element}', "{name}'s Blessing", 'Empowering {element}', '{trait} Mastery'],
    effects: ['buff', 'debuff', 'resource', 'summon'],
  },
};

// ─── PartnerSystem Class ────────────────────────────────────

export class PartnerSystem {
  ownedPartners: Partner[] = [];

  stats: PartnerSystemStats = {
    partnersGenerated: 0,
    mythicsGenerated: 0,
    partnersTraded: 0,
  };

  // ── Generation ──────────────────────────────────────────────

  /**
   * Generate a fully procedural partner.
   * @param forcedRarity  Override the rarity roll (for guaranteed drops, testing, etc.)
   */
  generate(forcedRarity?: PartnerRarityId): Partner {
    const rarity = forcedRarity ?? this.rollRarity();
    const rarityData = PARTNER_RARITIES[rarity];
    const name = this.generateName();
    const element = PARTNER_ELEMENTS[Math.floor(Math.random() * PARTNER_ELEMENTS.length)];
    const traits = this.pickTraits(rarityData.traitCount);
    const abilities = this.generateAbilities(name, element, traits, rarityData);
    const stats = this.generateStats(rarityData);

    const partner: Partner = {
      id: `partner_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      name: name.full,
      firstName: name.first,
      title: name.title,
      rarity,
      element,
      traits,
      abilities,
      level: 1,
      exp: 0,
      bondLevel: 0,
      createdAt: Date.now(),
      stats,
    };

    this.stats.partnersGenerated++;
    if (rarity === 'mythic') this.stats.mythicsGenerated++;

    return partner;
  }

  /**
   * Roll rarity with weighted distribution.
   * <1% mythic, <5% legendary, <20% epic, <45% rare, else common
   */
  rollRarity(): PartnerRarityId {
    const roll = Math.random() * 100;
    if (roll < 1) return 'mythic';
    if (roll < 5) return 'legendary';
    if (roll < 20) return 'epic';
    if (roll < 45) return 'rare';
    return 'common';
  }

  /**
   * Generate a Wuxia-flavoured name: prefix + core + suffix, maybe title.
   */
  generateName(): PartnerName {
    const prefix = NAME_PARTS.prefixes[Math.floor(Math.random() * NAME_PARTS.prefixes.length)];
    const core = NAME_PARTS.cores[Math.floor(Math.random() * NAME_PARTS.cores.length)];
    const suffix = NAME_PARTS.suffixes[Math.floor(Math.random() * NAME_PARTS.suffixes.length)];
    const title = NAME_PARTS.titles[Math.floor(Math.random() * NAME_PARTS.titles.length)];

    const firstName = `${prefix} ${core}${suffix}`;
    // ~60% chance to include a title
    const includeTitle = Math.random() < 0.6;

    return {
      first: firstName,
      title,
      full: includeTitle ? `${firstName}, ${title}` : firstName,
    };
  }

  /**
   * Generate base stats scaled by rarity power multiplier (0.8-1.2 variance each).
   */
  generateStats(rarityData: PartnerRarityData): PartnerStats {
    const m = rarityData.abilityPower;
    const v = () => 0.8 + Math.random() * 0.4; // 0.8-1.2
    return {
      hp: Math.floor(100 * m * v()),
      attack: Math.floor(20 * m * v()),
      defense: Math.floor(10 * m * v()),
      speed: Math.floor(10 * m * v()),
    };
  }

  // ── Trait Helpers ────────────────────────────────────────────

  private pickTraits(count: number): PersonalityTrait[] {
    const available = Object.keys(PERSONALITY_TRAITS);
    const picked: PersonalityTrait[] = [];

    for (let i = 0; i < count && available.length > 0; i++) {
      const idx = Math.floor(Math.random() * available.length);
      const traitId = available.splice(idx, 1)[0];
      picked.push(PERSONALITY_TRAITS[traitId]);
    }

    return picked;
  }

  private generateAbilities(
    name: PartnerName,
    element: PartnerElement,
    traits: PersonalityTrait[],
    rarityData: PartnerRarityData,
  ): PartnerAbility[] {
    const abilities: PartnerAbility[] = [];
    const count = 2 + Math.floor(rarityData.abilityPower);
    const categories: Array<'offensive' | 'defensive' | 'utility'> = ['offensive', 'defensive', 'utility'];

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
        category,
        effect,
        power: Math.floor(10 * rarityData.abilityPower * (0.8 + Math.random() * 0.4)),
        cooldown: Math.floor(5 + Math.random() * 10),
      });
    }

    return abilities;
  }

  // ── Ownership & Leveling ────────────────────────────────────

  addToOwned(partner: Partner): boolean {
    if (this.ownedPartners.find(p => p.id === partner.id)) return false;
    this.ownedPartners.push(partner);
    return true;
  }

  /**
   * Level up a partner: 1.1x hp/atk/def, 1.05x speed per level.
   */
  levelUp(partnerId: string): Partner | null {
    const partner = this.ownedPartners.find(p => p.id === partnerId);
    if (!partner) return null;

    partner.level++;
    partner.stats.hp = Math.floor(partner.stats.hp * 1.1);
    partner.stats.attack = Math.floor(partner.stats.attack * 1.1);
    partner.stats.defense = Math.floor(partner.stats.defense * 1.1);
    partner.stats.speed = Math.floor(partner.stats.speed * 1.05);

    return partner;
  }

  // ── Effects ─────────────────────────────────────────────────

  /**
   * Aggregate numeric trait effects for a partner.
   */
  getPartnerEffects(partner: Partner): PartnerEffects {
    const effects: PartnerEffects = {
      critBonus: 0,
      afkBonus: 0,
      eventChance: 0,
      partyProtection: 0,
      chaosBonus: 0,
      steadyBonus: 0,
      loyaltyBonus: 0,
      waifuInteractionBonus: 0,
    };

    for (const trait of partner.traits) {
      for (const [key, value] of Object.entries(trait.effects)) {
        if (typeof value === 'number' && key in effects) {
          (effects as unknown as Record<string, number>)[key] += value;
        }
      }
    }

    return effects;
  }

  /**
   * Get a dialogue line from the partner's first trait.
   */
  getDialogue(partner: Partner, type: keyof PersonalityDialogues = 'greeting'): string {
    for (const trait of partner.traits) {
      if (trait.dialogues && trait.dialogues[type]) {
        return trait.dialogues[type];
      }
    }
    return '...';
  }

  // ── Serialization ───────────────────────────────────────────

  serialize(): PartnerSerializedData {
    return {
      ownedPartners: this.ownedPartners,
      stats: { ...this.stats },
    };
  }

  deserialize(data: Record<string, unknown>): void {
    const d = data as Partial<PartnerSerializedData>;
    if (d.ownedPartners) this.ownedPartners = d.ownedPartners;
    if (d.stats) this.stats = { ...this.stats, ...d.stats };
  }
}
