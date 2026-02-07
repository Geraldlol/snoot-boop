# Systems Reference - Snoot Booper

> Code examples and data structures for all game systems.
> **Note:** These are reference examples. See actual implementations in `js/` files.

---

## Table of Contents

1. [Cultivation System](#cultivation-system)
2. [Masters System](#masters-system)
3. [Technique Stances](#technique-stances)
4. [Cat System](#cat-system)
5. [Waifu System](#waifu-system)
6. [Goose System](#goose-system)
7. [Economy System](#economy-system)
8. [Prestige System](#prestige-system)

---

## Cultivation System

**File:** `js/cultivation.js` | **Data:** `data/cultivation.json`

### Realm Structure

```javascript
{
  id: 'coreFormation',
  name: 'Core Formation',
  order: 4,
  ranks: 9,
  description: 'A golden core forms within you.',
  color: '#FFD700',
  xpBase: 100000,
  xpScale: 1.15,
  realmScale: 3.0,
  tribulation: {
    name: 'Tribulation of the Golden Core',
    type: 'boss',
    enemy: 'shadow_goose',
    failPenalty: { xpLoss: 0.5 },
    rewards: { jadeCatnip: 2000 }
  },
  unlocks: ['infinite_pagoda', 'equipment_system'],
  passives: {
    1: { name: 'Golden Core', effect: { allStats: 1.1 } },
    5: { name: 'Core Resonance', effect: { catSynergy: 1.25 } },
    9: { name: 'Perfect Core', effect: { critDamage: 1.5 } }
  }
}
```

### 10 Realms (in order)

| # | Realm | XP Base | Color |
|---|-------|---------|-------|
| 1 | Mortal | 100 | #A0A0A0 |
| 2 | Qi Condensation | 1K | #87CEEB |
| 3 | Foundation Establishment | 10K | #8B4513 |
| 4 | Core Formation | 100K | #FFD700 |
| 5 | Nascent Soul | 1M | #9370DB |
| 6 | Spirit Severing | 10M | #DC143C |
| 7 | Dao Seeking | 100M | #4169E1 |
| 8 | Immortal Ascension | 1B | #FFD700 |
| 9 | True Immortal | 10B | #FFFFFF |
| 10 | Heavenly Sovereign | 100B+ | #FFD700 |

---

## Masters System

**File:** `js/masters.js` | **Data:** `data/masters.json`

### Master Structure

```javascript
{
  id: 'gerald',
  name: 'Gerald',
  title: 'The Jade Palm',
  role: 'Sect Leader',
  passive: {
    name: 'Tranquil Boop',
    description: 'Boops during meditation generate +25% BP',
    effect: { bpMultiplier: 1.25, condition: 'isMeditating' }
  },
  color: '#50C878',
  quotes: ["Balance in all things. Especially snoots."]
}
```

### The Seven Masters

| Master | Title | Passive |
|--------|-------|---------|
| Gerald | Jade Palm | +25% BP during meditation |
| Rusty | Crimson Fist | Thousand Boop Barrage (active) |
| Steve | Flowing River | 2x offline PP |
| Andrew | Thunder Step | +50% event/rare cat discovery |
| Nik | Shadow Moon | +50% crit chance |
| Yuelin | Lotus Sage | +50% cat happiness |
| Scott | The Mountain | No multiplier decay |
| ??? | The Eighth | All passives at 25% |

---

## Technique Stances

**File:** `js/techniques.js` | **Data:** `data/techniques.json`

### Stance Structure

```javascript
{
  id: 'ironFinger',
  name: 'Iron Finger',
  unlockRealm: 'qiCondensation',
  stats: {
    boopPower: 3.0,
    boopSpeed: 0.5,
    critChance: 0.15,
    critMultiplier: 15,
    comboDecay: 3000
  },
  special: {
    name: 'Mountain Crusher',
    trigger: { everyNBoops: 10 },
    effect: { damageMultiplier: 10 }
  },
  mastery: { maxLevel: 10, xpPerBoop: 2 }
}
```

### 6 Stances

| Stance | Unlock | Style |
|--------|--------|-------|
| Jade Palm | Mortal | Balanced |
| Iron Finger | Qi Condensation | Slow, powerful |
| Drunken Paw | Foundation | Random, jackpot |
| Shadow Step | Core Formation | Fast, burst |
| Flowing River | Nascent Soul | Steady, AFK |
| Forbidden Technique | Spirit Severing | Ultimate |

---

## Cat System

**File:** `js/cats.js` | **Data:** `data/cats.json`

### Cat Structure

```javascript
{
  id: 'shaolin_tabby',
  name: 'Shaolin Tabby',
  school: 'shaolin',
  element: 'earth',
  baseRealm: 'kittenMortal',
  personality: 'disciplined',
  baseStats: {
    snootMeridians: 1.0,
    innerPurr: 1.0,
    floofArmor: 1.2,
    zoomieSteps: 0.8,
    loafMastery: 1.1
  },
  learnableTechniques: ['pawSwipe', 'ironPaw']
}
```

### Elements (Five + Hidden)

| Element | Color | Strong vs | Weak vs |
|---------|-------|-----------|---------|
| Metal | #C0C0C0 | Wood | Fire |
| Wood | #228B22 | Earth | Metal |
| Water | #4169E1 | Fire | Earth |
| Fire | #FF4500 | Metal | Water |
| Earth | #8B4513 | Water | Wood |
| Void | #000000 | All | None |
| Chaos | #FF00FF | Random | Random |

### Cat Realms

| Realm | PP Multiplier |
|-------|---------------|
| Mortal Kitten | 1x |
| Earth Kitten | 2x |
| Sky Kitten | 5x |
| Heaven Kitten | 15x |
| Divine Beast | 50x |
| Celestial Beast | 200x |
| Cosmic Entity | 1000x |

---

## Waifu System

**File:** `js/waifus.js` | **Data:** `data/waifus.json`

### Waifu Structure

```javascript
{
  id: 'mochi',
  name: 'Mochi-chan',
  title: 'The Welcoming Dawn',
  school: 'hospitalityArts',
  element: 'earth',
  bonus: { type: 'bpMultiplier', value: 1.10 },
  unlockCondition: 'starter',
  maxBondReward: { cat: 'lucky_teacup_cat' },
  giftAffinities: {
    loves: ['rare_tea', 'jade_cup'],
    likes: ['yarn_ball'],
    dislikes: ['loud_toys']
  }
}
```

### 12+ Waifus

| Waifu | Unlock | Bonus |
|-------|--------|-------|
| Mochi | Starter | +10% BP |
| Luna | 24h AFK | +50% AFK |
| Nyanta | 50 cats | Expeditions |
| Mei | Pagoda 20 | +25% dungeon |
| Sakura | Garden Lv3 | +20% happiness |
| Yuki | 100h meditation | +50% meditation |
| Jade | 1 prestige | +30% crit damage |
| Crimson | 50 equipment | +40% crafting |
| Grandmother | 50 lore | +15% all stats |
| Rival | Beat 3x tournament | +25% competitive |
| Void | Transcendence | 2x void power |
| Honk Maiden | 1000 goose boops | 2x goose bonus |

---

## Goose System

**File:** `js/goose.js`

### Goose Moods

| Mood | Speed | Dodge | Reward |
|------|-------|-------|--------|
| Calm | 1x | 10% | 10x |
| Suspicious | 2x | 30% | 25x |
| Aggressive | 3x | 50% | 50x |
| Rage | 5x | 70% | 100x |

### Legendary Geese

- **Untitled Goose** - Steals items on escape
- **Goose Elder** - Wisdom test
- **Golden Goose** - 1% spawn, extreme speed
- **Cobra Chicken** - Final boss, unlocks allies

### Goose Allies (post Cobra Chicken)

| Ally | Effect |
|------|--------|
| Guard | Prevents AFK theft |
| Attack | +25% boop damage |
| Chaos | 2x event frequency |
| Honk | +25% PP generation |

---

## Economy System

**File:** `js/economy.js`

### 9 Currencies

| Currency | Source | Primary Use |
|----------|--------|-------------|
| Boop Points (BP) | Active booping | Basic upgrades |
| Purr Power (PP) | Passive cats | Technique upgrades |
| Qi | Cultivation | Abilities |
| Jade Catnip | Rare drops | Premium cats |
| Spirit Stones | Dungeons | Equipment |
| Heavenly Seals | Ascension | Permanent upgrades |
| Sect Reputation | Social | Cosmetics |
| Waifu Tokens | Bond activities | Gifts |
| Goose Feathers | Goose kills | Joke shop |

---

## Prestige System

**File:** `js/prestige.js` | **Data:** `data/cultivation.json`

### Three Layers

| Layer | Threshold | Currency | Keeps |
|-------|-----------|----------|-------|
| Ascension | 1B PP | Heavenly Seals | Waifus (50%), achievements |
| Reincarnation | 10 ascensions + 500 seals | Karma | Core unlocks, 10% seals |
| Transcendence | 5 reincarnations + True Immortal | Transcendence Points | Almost nothing |

### Heavenly Seal Milestones

| Seals | Bonus |
|-------|-------|
| 1 | +10% production |
| 5 | Start with 3 Earth cats |
| 10 | Forbidden Techniques |
| 25 | Start with 50% waifu bond |
| 50 | +1 goose mood level |
| 100 | Unlock Eighth Master |
| 200 | Reincarnation preview |
| 500 | 2x all stats |

---

## Quick Reference

### Key Formulas

```
BP = basePower × upgradeBonus × masterBonus × waifuBonus × combo × (crit ? critMult : 1)
PP = Σ(cat.purr × happiness × loafMastery × realmMult) × waifuBonus × (AFK ? masterAFKBonus : 1)
Combo = 1 + (min(count, 100) × 0.01)  // Max 2x at 100
```

### File Quick Reference

| System | JS File | JSON Data |
|--------|---------|-----------|
| Cultivation | cultivation.js | cultivation.json |
| Masters | masters.js | masters.json |
| Techniques | techniques.js | techniques.json |
| Cats | cats.js | cats.json |
| Waifus | waifus.js | waifus.json |
| Equipment | equipment.js | equipment.json |
| Relics | systems/relics.js | relics.json |
| Events | events.js | events.json |
| Achievements | achievements.js | achievements.json |
| Enemies | pagoda.js | enemies.json |
| Balance | game.js | balance.json |
