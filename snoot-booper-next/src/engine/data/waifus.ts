/**
 * Waifu data — templates, activities, schools
 * Ported from js/waifus.js + data/waifus.json
 */

// ─── Waifu Templates ─────────────────────────────────────────

export interface WaifuTemplate {
  id: string;
  name: string;
  title: string;
  role: string;
  cultivationStyle: string;
  description: string;
  emoji: string;
  color: string;
  bonus: { type: string; value: number; description: string };
  unlockCondition: { type: string; value?: number | string };
  maxBondReward: string;  // cat template id
  giftAffinities: { loves: string[]; likes: string[]; neutral: string[]; dislikes: string[] };
  dialogues: Record<string, string[]>;
}

export const WAIFU_TEMPLATES: Record<string, WaifuTemplate> = {
  mochi: {
    id: 'mochi', name: 'Mochi-chan', title: 'The Welcoming Dawn',
    role: 'Innkeeper of the Celestial Teahouse', cultivationStyle: 'Hospitality Arts',
    description: 'Warm and welcoming. Makes the best tea in the Jianghu.',
    emoji: '🍡', color: '#FFB7C5',
    bonus: { type: 'bpMultiplier', value: 1.10, description: '+10% BP from all boops' },
    unlockCondition: { type: 'starter' },
    maxBondReward: 'lucky_teacup_cat',
    giftAffinities: { loves: ['rare_tea', 'jade_cup', 'silk_ribbon'], likes: ['yarn_ball', 'fish_treats'], neutral: ['catnip', 'bells'], dislikes: ['loud_toys', 'spicy_food'] },
    dialogues: {
      greeting: ['Welcome back to the teahouse, cultivator~', 'The cats have been waiting for you, nya~'],
      lowBond: ['Every guest is a friend. Every snoot, a blessing.', 'Would you like some tea while you cultivate?'],
      midBond: ['Your dedication to the sect is admirable!', 'The cats speak highly of your booping technique~'],
      highBond: ['You\'ve become like family to us all.', 'I... I made this tea specially for you. *blush*'],
      maxBond: ['With you by my side, our teahouse will flourish forever.', 'You are the greatest cultivator I have ever known, nya~'],
      onBoop: ['Nice boop~!', 'Keep going!'],
    },
  },
  sakura: {
    id: 'sakura', name: 'Sakura Pawson', title: 'The Healing Petal',
    role: 'Sanctuary Healer', cultivationStyle: 'Nature Arts',
    description: 'Gentle healer who speaks the language of flowers and cats.',
    emoji: '🌸', color: '#FF69B4',
    bonus: { type: 'catHappinessBonus', value: 1.25, description: '+25% cat happiness gain' },
    unlockCondition: { type: 'catCount', value: 10 },
    maxBondReward: 'cherry_blossom_cat',
    giftAffinities: { loves: ['flower_bouquet', 'healing_herb'], likes: ['cat_treats'], neutral: ['catnip'], dislikes: ['weapons'] },
    dialogues: {
      greeting: ['The flowers bloom brighter when you visit~', 'Welcome, gentle cultivator.'],
      lowBond: ['The cats need gentle care...', 'Nature teaches patience.'],
      midBond: ['I feel the garden growing around us.', 'Your kindness nourishes all.'],
      highBond: ['Stay... the cherry blossoms are beautiful today.', 'My heart blooms for you.'],
      maxBond: ['Together, we make the world bloom.', 'Forever in full flower.'],
    },
  },
  luna: {
    id: 'luna', name: 'Luna Whiskerbell', title: 'The Midnight Watcher',
    role: 'Night Cultivation Instructor', cultivationStyle: 'Yin Energy Arts',
    description: 'Sleepy but powerful. Watches over the sect through the night.',
    emoji: '🌙', color: '#C4A7E7',
    bonus: { type: 'afkMultiplier', value: 1.50, description: '+50% offline gains' },
    unlockCondition: { type: 'afkTime', value: 86400 },
    maxBondReward: 'moonlight_siamese',
    giftAffinities: { loves: ['moon_crystal', 'dream_pillow'], likes: ['warm_milk', 'starmap'], neutral: ['catnip'], dislikes: ['alarm_clock'] },
    dialogues: {
      greeting: ['*yawn* Oh... you\'re here... good...', 'The night shift... is peaceful...'],
      lowBond: ['While others sleep... we cultivate... *yawn*', 'The moon... watches over our snoots...'],
      midBond: ['Your presence makes the night... warmer.', 'I saved you a spot under the stars.'],
      highBond: ['I feel... most awake... when you\'re here...', 'Stay with me... through the night...? *sleepy smile*'],
      maxBond: ['You are my brightest star.', 'Even in dreams, I think of you...'],
    },
  },
  nyanta: {
    id: 'nyanta', name: 'Captain Nyanta', title: 'The Sea Sovereign',
    role: 'Expedition Leader', cultivationStyle: 'Adventure Arts',
    description: 'Bold pirate captain with a heart of gold and a love for snoots.',
    emoji: '🏴‍☠️', color: '#8B0000',
    bonus: { type: 'expeditionUnlock', value: 1, description: 'Unlocks rare cat expeditions' },
    unlockCondition: { type: 'catCount', value: 50 },
    maxBondReward: 'kraken_kitty',
    giftAffinities: { loves: ['treasure_map', 'sea_compass'], likes: ['rum_bottle', 'fish'], neutral: ['catnip'], dislikes: ['anchor'] },
    dialogues: {
      greeting: ['YARR! Welcome aboard, matey!', 'The seas be calm and full of snoots today!'],
      lowBond: ['The greatest snoots lie beyond the horizon!', 'Adventure awaits!'],
      midBond: ['Ye be proving yerself a true sailor!', 'I\'d trust ye with me ship!'],
      highBond: ['Ye be the finest first mate a captain could ask for!', 'Together we\'ll find the legendary treasures!'],
      maxBond: ['My compass always points to you.', 'Ye are my greatest treasure.'],
    },
  },
  fluffington: {
    id: 'fluffington', name: 'Professor Fluffington', title: 'The Grand Scholar',
    role: 'Research Director', cultivationStyle: 'Knowledge Arts',
    description: 'Brilliant mind behind a magnificent beard. Knows everything about cats.',
    emoji: '🎓', color: '#9370DB',
    bonus: { type: 'ppMultiplier', value: 2.0, description: '+100% PP generation' },
    unlockCondition: { type: 'allBasicUpgrades' },
    maxBondReward: 'wisdom_sphinx',
    giftAffinities: { loves: ['ancient_scroll', 'rare_book'], likes: ['spectacles', 'ink'], neutral: ['catnip'], dislikes: ['loud_noise'] },
    dialogues: {
      greeting: ['Ah, a fellow seeker of knowledge!', 'The library is always open for you.'],
      lowBond: ['There is much to learn about the feline arts.', 'Have you read the latest research?'],
      midBond: ['Your insights are surprisingly astute!', 'I\'ve saved a spot at my reading table for you.'],
      highBond: ['You understand me like no one else.', 'Perhaps... we could collaborate on a paper?'],
      maxBond: ['You are my greatest discovery.', 'Together, our research shall change the world!'],
    },
  },
  meowlina: {
    id: 'meowlina', name: 'Empress Meowlina', title: 'The Cat Sovereign',
    role: 'Supreme Ruler of All Cats', cultivationStyle: 'Imperial Arts',
    description: 'Rules all cats from her celestial throne. The final waifu.',
    emoji: '👑', color: '#FFD700',
    bonus: { type: 'allLegendary', value: 1, description: 'All snoots become LEGENDARY' },
    unlockCondition: { type: 'maxBondAll' },
    maxBondReward: 'imperial_sovereign',
    giftAffinities: { loves: ['imperial_jade', 'crown_jewel'], likes: ['golden_fish'], neutral: ['catnip'], dislikes: ['commoner_food'] },
    dialogues: {
      greeting: ['We acknowledge your presence, cultivator.', 'Approach the throne.'],
      lowBond: ['You dare speak to the Empress?', 'Prove your worth.'],
      midBond: ['Perhaps you are worthy of Our attention.', 'You may sit beside the throne.'],
      highBond: ['You have earned Our respect, dear one.', 'The crown... feels lighter with you here.'],
      maxBond: ['For you, I would set aside the crown.', 'You are the one the prophecy foretold.'],
    },
  },
};

// ─── Bond Activities ─────────────────────────────────────────

export interface BondActivity {
  id: string;
  name: string;
  emoji: string;
  description: string;
  duration: number;     // seconds
  bondGain: number;
  preferredBy: string[];
  unlockBond: number;
  afkCompatible: boolean;
  timeRestriction?: 'night' | 'day';
  effects?: Record<string, number>;
}

export const BOND_ACTIVITIES: BondActivity[] = [
  { id: 'tea_ceremony', name: 'Tea Ceremony', emoji: '🍵', description: 'Share a quiet cup of tea', duration: 300, bondGain: 10, preferredBy: ['mochi', 'fluffington'], unlockBond: 0, afkCompatible: true },
  { id: 'sparring', name: 'Sparring Match', emoji: '⚔️', description: 'Test each other\'s strength', duration: 600, bondGain: 15, preferredBy: ['nyanta'], unlockBond: 20, afkCompatible: false },
  { id: 'meditation', name: 'Meditation', emoji: '🧘', description: 'Meditate together', duration: 900, bondGain: 20, preferredBy: ['luna'], unlockBond: 30, afkCompatible: true },
  { id: 'stargazing', name: 'Stargazing', emoji: '🌟', description: 'Watch the stars together', duration: 600, bondGain: 25, preferredBy: ['luna'], unlockBond: 40, afkCompatible: false, timeRestriction: 'night' },
  { id: 'cooking', name: 'Cooking Together', emoji: '🍳', description: 'Prepare a meal together', duration: 450, bondGain: 18, preferredBy: ['mochi'], unlockBond: 25, afkCompatible: false, effects: { producesItem: 1 } },
  { id: 'exploration', name: 'Sect Exploration', emoji: '🗺️', description: 'Explore the sect grounds', duration: 1200, bondGain: 30, preferredBy: ['nyanta'], unlockBond: 50, afkCompatible: false, effects: { secretChance: 0.15 } },
  { id: 'hot_springs', name: 'Hot Springs Visit', emoji: '♨️', description: 'Relax in the hot springs', duration: 600, bondGain: 35, preferredBy: ['mochi', 'sakura', 'luna', 'nyanta', 'fluffington', 'meowlina'], unlockBond: 60, afkCompatible: true },
  { id: 'training', name: 'Joint Training', emoji: '💪', description: 'Train cultivation together', duration: 480, bondGain: 12, preferredBy: ['nyanta'], unlockBond: 15, afkCompatible: false, effects: { cultivationXP: 50 } },
  { id: 'reading', name: 'Reading Together', emoji: '📚', description: 'Read ancient scrolls', duration: 540, bondGain: 14, preferredBy: ['fluffington', 'luna'], unlockBond: 10, afkCompatible: true, effects: { loreChance: 0.20 } },
  { id: 'cat_watching', name: 'Cat Watching', emoji: '🐱', description: 'Watch the cats play', duration: 360, bondGain: 8, preferredBy: ['sakura', 'meowlina'], unlockBond: 0, afkCompatible: true, effects: { catHappiness: 5 } },
];

export const ACTIVITY_PREFERENCE_BONUS = 1.5;
