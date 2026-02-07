# CLAUDE.md - Snoot Booper Development Guide

> *"The journey of a thousand boops begins with a single snoot."*

**Version:** 2.1 (Streamlined)

---

## Project Overview

**Game:** Snoot Booper: Idle Wuxia Cat Sanctuary
**Genre:** 8-bit AFK Idle/Clicker with Wuxia Theme
**Platform:** Web (Discord-shareable)
**Stack:** HTML5, CSS3, Vanilla JavaScript
**Vibe:** Cats + Martial Arts + Waifus + BOOP THE SNOOTS

### Design Pillars

1. **Deep Progression** — Cookie Clicker depth with meaningful choices
2. **Wuxia Authenticity** — Age of Wushu theming
3. **Polish & Juice** — Hades-level feedback
4. **Social Competition** — Built for Discord friends
5. **Respect Player Time** — AFK should feel rewarding

---

## The Seven Masters

| Master | Title | Passive |
|--------|-------|---------|
| **Gerald** | Jade Palm | +25% BP during meditation |
| **Rusty** | Crimson Fist | Thousand Boop Barrage |
| **Steve** | Flowing River | 2x offline PP |
| **Andrew** | Thunder Step | +50% event discovery |
| **Nik** | Shadow Moon | +50% crit chance |
| **Yuelin** | Lotus Sage | +50% cat happiness |
| **Scott** | The Mountain | No multiplier decay |

---

## The Three Sacred Laws

1. **Every snoot must be boopable** — If it has a snoot, boop it
2. **Cats are never wrong** — Balance serves cat happiness
3. **The Sect comes first** — Features should be fun for the group

---

## Architecture

```
snoot-booper/
├── index.html              # Main game
├── css/
│   ├── main.css            # Core styles
│   ├── wuxia-theme.css     # Chinese aesthetic
│   ├── 8bit.css            # Pixel art utilities
│   ├── animations.css      # Effects
│   └── dungeon.css         # Dungeon styles
├── js/
│   ├── core/
│   │   ├── game.js         # Main loop & state
│   │   ├── eventBus.js     # Cross-system events
│   │   ├── bigNumber.js    # Large number handling
│   │   ├── constants.js    # Global constants
│   │   └── dataLoader.js   # JSON data loading
│   ├── systems/
│   │   ├── masters.js      # The Seven Masters
│   │   ├── cultivation.js  # 10 realms, tribulations
│   │   ├── techniques.js   # 6 stances, mastery
│   │   ├── cats.js         # Collection, teams, fusion
│   │   ├── waifus.js       # 12+ waifus, bonding
│   │   ├── goose.js        # HONK system
│   │   ├── buildings.js    # 15+ buildings
│   │   ├── equipment.js    # Gear & sets
│   │   ├── prestige.js     # 3-layer prestige
│   │   ├── economy.js      # 9 currencies
│   │   ├── idle.js         # AFK calculations
│   │   └── relics.js       # Dungeon relics
│   ├── dungeons/
│   │   ├── pagoda.js       # Infinite Pagoda
│   │   ├── dreamRealm.js   # Procedural story
│   │   ├── tournament.js   # PvP bracket
│   │   ├── gooseDimension.js # Comedy horror
│   │   └── memoryFragments.js # Lore chapters
│   ├── ui/
│   │   ├── screens.js      # Screen management
│   │   ├── modals.js       # Dialogs
│   │   ├── notifications.js # Toasts
│   │   ├── particles.js    # Effects
│   │   └── tutorial.js     # Onboarding
│   ├── data/
│   │   ├── save.js         # Save/Load
│   │   ├── lore.js         # Story fragments
│   │   └── secrets.js      # Easter eggs
│   └── social/
│       ├── sectwar.js      # Competitions
│       └── sharing.js      # Discord integration
├── data/                   # JSON data files
│   ├── masters.json
│   ├── cats.json
│   ├── waifus.json
│   ├── techniques.json
│   ├── cultivation.json
│   ├── equipment.json
│   ├── relics.json
│   ├── enemies.json
│   ├── events.json
│   ├── achievements.json
│   ├── lore.json
│   └── balance.json
└── docs/                   # Reference documentation
    ├── systems-reference.md
    └── dungeons-reference.md
```

---

## Core Systems Summary

### Cultivation (10 Realms × 9 Ranks)

Mortal → Qi Condensation → Foundation → Core Formation → Nascent Soul → Spirit Severing → Dao Seeking → Immortal Ascension → True Immortal → Heavenly Sovereign

Each realm has tribulations, unlocks, and passives. See `docs/systems-reference.md`.

### Technique Stances (6)

Jade Palm (balanced) → Iron Finger (slow/powerful) → Drunken Paw (random) → Shadow Step (fast/burst) → Flowing River (AFK) → Forbidden Technique (ultimate)

### Cats

- 7 realms: Mortal Kitten → Cosmic Entity
- 7 elements: Metal, Wood, Water, Fire, Earth, Void, Chaos
- 6 personalities: Disciplined, Lazy, Playful, Mysterious, Brave, Gluttonous
- Teams of 4 + reserve, synergies, fusion

### Waifus (12+)

Bond through activities, teaching schools, gift giving. Max bond = legendary rewards.

### Dungeons (5)

1. **Infinite Pagoda** — Core roguelike
2. **Dream Realm** — Procedural from player data
3. **Celestial Tournament** — PvP vs AI masters
4. **Goose Dimension** — Comedy horror, HONK
5. **Memory Fragments** — Story chapters

### Economy (9 Currencies)

BP, PP, Qi, Jade Catnip, Spirit Stones, Heavenly Seals, Sect Reputation, Waifu Tokens, Goose Feathers

### Prestige (3 Layers)

1. **Ascension** (1B PP) → Heavenly Seals
2. **Reincarnation** (10 ascensions) → Karma Points
3. **Transcendence** (5 reincarnations) → Celestial Realm

---

## Key Formulas

```
BP = basePower × upgrades × master × waifu × combo × (crit ? critMult : 1)
PP = Σ(cat.purr × happiness × realm) × waifu × (AFK ? masterBonus : 1)
Combo = 1 + min(count, 100) × 0.01
```

See `data/balance.json` for all scaling values.

---

## Testing Checklist

### Core
- [ ] Boop registers, particles appear
- [ ] Master passives work
- [ ] Combo tracks correctly
- [ ] Critical boops trigger

### Cultivation
- [ ] All 10 realms progress
- [ ] Tribulations trigger at boundaries
- [ ] Realm passives unlock

### Cats & Waifus
- [ ] Cat realms and elements work
- [ ] Team synergies calculate
- [ ] Bond activities function
- [ ] Gift affinities apply

### Dungeons
- [ ] Pagoda floors generate
- [ ] Combat resolves correctly
- [ ] Relics apply effects
- [ ] Boss fights work

### Prestige
- [ ] Ascension at 1B PP
- [ ] Seals calculate correctly
- [ ] Reincarnation at 10 ascensions

### Save/Load
- [ ] Auto-save every 30s
- [ ] All systems persist
- [ ] AFK gains calculate on return

---

## Documentation

| Doc | Content |
|-----|---------|
| `docs/systems-reference.md` | All system data structures |
| `docs/dungeons-reference.md` | Dungeon mechanics |
| `data/*.json` | Actual game data |

---

## The Seven Maxims

1. *"The journey of a thousand boops begins with a single snoot."*
2. *"In stillness, the cat cultivates. In booping, the master cultivates."*
3. *"Gerald says: Balance in all things. Especially snoots."*
4. *"Rusty says: When in doubt, boop harder."*
5. *"Steve says: Optimal cultivation requires optimal patience."*
6. *"Nik says: ..."*
7. *"The ultimate technique? Enjoying the journey with friends."*

---

## Version History

### 2.1 — Streamlined (Current)
- Moved code examples to `docs/` reference files
- Reduced from 6,369 lines to ~300 lines
- All systems fully implemented in codebase

### 2.0 — Grand Enhancement
- 10 cultivation realms
- 6 technique stances
- 12+ waifus with schools
- 5 dungeon types
- 3-layer prestige
- 9-currency economy

### 1.0 — Original
- Basic boop mechanics
- 7 masters
- Cat collection
- Goose system
