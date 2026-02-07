# Dungeons Reference - Snoot Booper

> Roguelike dungeon systems and mechanics.

---

## Table of Contents

1. [Infinite Pagoda](#infinite-pagoda)
2. [Dream Realm](#dream-realm)
3. [Celestial Tournament](#celestial-tournament)
4. [Goose Dimension](#goose-dimension)
5. [Memory Fragments](#memory-fragments)
6. [Bamboo Forest (Wave Survival)](#bamboo-forest)
7. [Equipment System](#equipment-system)
8. [Relic System](#relic-system)

---

## Infinite Pagoda

**File:** `js/pagoda.js`

The core roguelike dungeon. Climb floors, defeat enemies, collect loot.

### Floor Types

| Type | Weight | Description |
|------|--------|-------------|
| Combat | 60% | Normal enemy encounter |
| Elite | 15% | Stronger enemy, better loot |
| Boss | Every 10 | Major boss fight |
| Treasure | 10% | Loot room |
| Event | 10% | Random event |
| Shop | 5% | Buy items |

### Boop Commands (Combat Abilities)

| Command | Qi Cost | Effect |
|---------|---------|--------|
| Power Boop | 1 | 2x damage |
| Healing Boop | 1 | Heal 20% HP |
| Shield Boop | 1 | Block next hit |
| Mega Boop | 3 | AOE damage |
| Emergency Boop | 5 | Revive at 30% |

### Scaling

```javascript
enemyHp = baseHp * pow(1.15, floor)
enemyDamage = baseDamage * pow(1.1, floor)
rewards = baseReward * pow(1.08, floor)
```

---

## Dream Realm

**File:** `js/dungeons/dreamRealm.js`

Procedural dungeon generated from YOUR play data.

### Generation Sources

- Playtime patterns
- Favorite cats
- Waifu bond levels
- Achievement progress
- Failed tribulations become bosses

### Surreal Modifiers

| Modifier | Effect |
|----------|--------|
| Gravity Shift | Up is down |
| Time Loop | Every 5th floor repeats |
| Mirror World | Fight shadow versions |
| Memory Lane | Relive past moments |

### Rewards

- Lore fragments
- Dream Essence currency
- Exclusive: Dream Walker Cat

---

## Celestial Tournament

**File:** `js/dungeons/tournament.js`

PvP bracket against AI versions of the Seven Masters.

### Structure

- 6 rounds (face each master)
- Team of 4 cats
- Master abilities active

### AI Styles

| Master | Style |
|--------|-------|
| Gerald | Meditation bursts |
| Rusty | Constant pressure |
| Steve | Optimal timing |
| Andrew | Speed rush |
| Nik | Crit fishing |
| Yuelin | Healing focus |
| Scott | Stack and wait |

### Rewards

- Per win: +100 Sect Reputation
- Champion: Title + Crown cosmetic
- Weekly: 5000 Jade Catnip

---

## Goose Dimension

**File:** `js/dungeons/gooseDimension.js`

Comedy horror. EVERYTHING is geese.

### Mechanics

- **HONK Meter**: Fill to progress floors
- **Sanity**: Cats lose sanity, affects abilities
- **Environment**: Goose trees, goose floors, goose sky

### Enemy Types

| Enemy | Special |
|-------|---------|
| Normal Goose | Standard |
| Goose with Knife | High damage |
| Stealth Goose | Ambush |
| Mecha Goose | Elite |
| Goose Hydra | Multi-head boss |

### Final Boss: THE PRIMORDIAL HONK

- 5 phases
- The first goose, the last goose, the eternal goose

### Rewards

- Title: "Goose Dimension Survivor"
- Cat: Goose-Touched Cat
- Permanent: 0.5x goose spawn rate, 2x goose rewards

---

## Memory Fragments

**File:** `js/dungeons/memoryFragments.js`

Story-driven chapters unlocking lore.

### Chapter Structure

- 3 chapters per master
- 2 chapters per waifu
- 5 secret chapters

### Sample Chapters

| Chapter | Content |
|---------|---------|
| Gerald Ch1 | The Founding - How Gerald found the Snoot Scrolls |
| Rusty Ch1 | The Redemption - Life before the Sect |
| Secret Ch1 | The Eighth Master - ??? |

### Rewards

- Lore entries
- Exclusive cats
- Unique techniques

---

## Bamboo Forest

**File:** `js/wave-survival.js`

Vampire Survivors-style wave survival.

### Rules

- Single cat
- 30 minutes to "win"
- Auto-attack weapons
- Level up = choose upgrade

### Weapon Evolution

| Weapon | + Passive | = Evolution |
|--------|-----------|-------------|
| Claw Swipe | Zoomies | Thousand Claw Barrage |
| Laser Eyes | Fluffy Armor | Death Star Beam |
| Hairball | Caffeine | Infinite Yarn Dimension |

### Rewards

- Per minute: 10 Jade Catnip
- Completion: Bamboo Guardian cat
- High score: Leaderboard

---

## Equipment System

**File:** `js/equipment.js` | **Data:** `data/equipment.json`

### 6 Slots

| Slot | Unlock |
|------|--------|
| Weapon | Start |
| Armor | Start |
| Accessory | Start |
| Mount | Core Formation |
| Companion | Nascent Soul |
| Secret Scroll | Spirit Severing |

### Rarities

| Rarity | Color | Sockets |
|--------|-------|---------|
| Common | White | 0 |
| Uncommon | Green | 1 |
| Rare | Blue | 2 |
| Epic | Purple | 3 |
| Legendary | Orange | 4 |
| Mythic | Red | 6 |

### Set Bonuses Example

**Box Knight Set** (3 pieces)
- 2pc: +20% defense
- 3pc: Immune to first hit each room
- Full: Transform into MEGA BOX

---

## Relic System

**File:** `js/systems/relics.js` | **Data:** `data/relics.json`

Run-wide powerful buffs collected in dungeons.

### Rarity Distribution by Floor

| Floor | Common | Rare | Epic | Legendary |
|-------|--------|------|------|-----------|
| 1-10 | 70% | 25% | 5% | 0% |
| 11-30 | 50% | 35% | 12% | 3% |
| 31-50 | 30% | 40% | 22% | 8% |
| 51+ | 15% | 35% | 35% | 15% |

### Sample Relics

| Relic | Rarity | Effect |
|-------|--------|--------|
| Lucky Coin | Common | +10% loot |
| Nine Lives Charm | Rare | 15% auto-revive |
| Goose Horn | Epic | Summon goose every 5 floors |
| Eternal Catnip | Legendary | +20% all stats, start full Qi |
| Snoot Prime | Mythic | 3x boop damage |

---

## Quick Combat Reference

### Damage Calculation

```
damage = catAttack * stanceMultiplier * (1 + combo * 0.01) * critMult * relicBonus
```

### Defense

```
actualDamage = incomingDamage * (100 / (100 + defense))
```

### Death Defiance

- Nascent Soul passive grants 1 charge
- Revives party at 30% HP
- Can stack with relics
