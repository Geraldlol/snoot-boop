# 🚀 SNOOT BOOPER: POST-LAUNCH & DLC ROADMAP 🚀

*"We built a mountain. Now let's build the sky above it."*

This document contains features, expansions, and absolutely unhinged ideas for AFTER the base game is complete. Consider this the "Phase 2 and Beyond" planning doc.

---

## 📋 Table of Contents

1. [The Meta Layer](#the-meta-layer)
2. [Procedural Partner Generator](#procedural-partner-generator)
3. [The Drama System](#the-drama-system)
4. [The Dark Timeline](#the-dark-timeline)
5. [Voice & Audio Expansion](#voice-audio-expansion)
6. [Seasonal Crossovers](#seasonal-crossovers)
7. [The Catino](#the-catino)
8. [Nemesis System](#nemesis-system)
9. [User-Generated Content](#user-generated-content)
10. [Cats vs Dogs Expansion](#cats-vs-dogs)
11. [IRL Integration](#irl-integration)
12. [Custom Cat Creator](#custom-cat-creator)
13. [Hardcore Modes](#hardcore-modes)
14. [The Lore Podcast](#the-lore-podcast)
15. [Mod Support](#mod-support)
16. [Actual Release Planning](#actual-release-planning)

---

## 🎮 The Meta Layer — "Snoot Booper 2: The Metagame" {#the-meta-layer}

*"You've beaten the game. Now become the game."*

### Concept

After achieving 100% completion (all cats, all waifus max bond, floor 100 cleared, Cobra Chicken defeated, all achievements), you unlock **THE META LAYER**.

You are now playing as **THE DEVELOPER** — the person who made Snoot Booper. The game shifts to a game studio management sim where your decisions affect the "main game."

### Gameplay Loop

```
┌─────────────────────────────────────────────────────────────┐
│                    THE DEVELOPER'S DESK                      │
├─────────────────────────────────────────────────────────────┤
│  [Code Editor]  [Bug Reports]  [Community]  [Patch Notes]   │
│                                                              │
│  Current Build: v1.0.47                                      │
│  Player Satisfaction: 87%                                    │
│  Bug Count: 23                                               │
│  Feature Requests: 1,847                                     │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ URGENT BUG:     │  │ FEATURE REQUEST:│                   │
│  │ Cats are        │  │ "Add dogs plz"  │                   │
│  │ literally on    │  │ - xXGooseLover  │                   │
│  │ fire            │  │                 │                   │
│  │ [FIX] [IGNORE]  │  │ [ADD] [REJECT]  │                   │
│  └─────────────────┘  └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Features

**Bug Reports (Literal Bugs):**
- Actual bug enemies spawn in your code
- Fight them in a mini-game
- Unfixed bugs cause problems in the main game
- "Heisenbug" — only appears when you're not looking

**Community Management:**
- Fake Reddit/Discord threads to respond to
- Keep community happy or they riot
- Balance requests: "Nerf the goose!" vs "Buff the goose!"
- Your responses become in-game lore

**Patch Notes as Content:**
- Write patch notes
- They affect the actual game
- Typos become features
- "Fixed bug where cats could fly" — wait, cats could fly?

**The Team:**
- Hire cat programmers, artist cats, QA cats
- They have stats and personalities
- Office drama affects productivity
- Crunch mode (bad) vs sustainable pace (good)

### Meta Achievements

- **"It's Not a Bug, It's a Feature"** — Ship 10 bugs as features
- **"Community Manager"** — Survive 100 angry forum posts
- **"Crunch Avoided"** — Complete a milestone without overtime
- **"The Vision"** — Reject a popular feature, have it work out

---

## 💕 Procedural Partner Generator {#procedural-partner-generator}

*"RNG Waifu/Husbando machine go brrr"*

### The Cultivation Partner Scroll

Rare dungeon drop (Floor 30+, 0.5% from boss chests) that generates a completely unique companion character.

### Generation Components

**Name Generator:**
```javascript
const NAME_PARTS = {
  prefixes: ['Azure', 'Crimson', 'Silent', 'Jade', 'Shadow', 'Golden', 'Storm', 'Gentle'],
  cores: ['Lotus', 'Blade', 'Moon', 'Petal', 'Thunder', 'Mist', 'Fang', 'Willow'],
  suffixes: ['heart', 'dancer', 'weaver', 'keeper', 'walker', 'singer', 'bringer', 'caller'],
  titles: ['the Serene', 'the Fierce', 'the Wandering', 'the Eternal', 'of the Hidden Valley']
};

// Example outputs:
// "Azure Lotusheart, the Serene"
// "Shadow Fangbringer, the Fierce"
// "Gentle Moonweaver of the Hidden Valley"
```

**Personality Traits (pick 2-3):**
| Trait | Effect | Dialogue Style |
|-------|--------|----------------|
| Tsundere | Bonus on crit, penalty on miss | "I-it's not like I wanted to help!" |
| Kuudere | Steady bonuses, no variance | "...I see. Acceptable." |
| Genki | High variance, exciting events | "YEAH! LET'S GOOOO!" |
| Dandere | AFK bonuses, shy in combat | "...um... I'll try my best..." |
| Yandere | Massive bonuses IF loyal to them | "You only need ME, right? RIGHT?" |
| Himejoshi | Bonus when waifus interact | "Ohoho~ How interesting~" |
| Big Brother/Sister | Protects other party members | "Leave it to me." |
| Gremlin | Chaos bonuses, random effects | "CHAOS CHAOS CHAOS" |

**Visual Generation:**
- Base template selection (body type, style)
- Color palette randomization
- Accessory layering (hats, weapons, effects)
- Creates unique but cohesive character art

**Ability Generation:**
```javascript
const ABILITY_TEMPLATES = {
  offensive: {
    names: ['{element} Strike', '{element} Barrage', 'Wrath of {name}'],
    effects: ['damage', 'dot', 'execute', 'aoe']
  },
  defensive: {
    names: ['{name}\'s Aegis', 'Shield of {element}', 'Unyielding {trait}'],
    effects: ['shield', 'taunt', 'heal', 'cleanse']
  },
  utility: {
    names: ['{trait} Insight', 'Way of the {element}', '{name}\'s Blessing'],
    effects: ['buff', 'debuff', 'resource', 'summon']
  }
};
```

### Rarity Tiers

| Tier | Trait Count | Ability Power | Visual Complexity |
|------|-------------|---------------|-------------------|
| Common | 1 | 80% | Base template |
| Rare | 2 | 100% | + 1 accessory |
| Epic | 2 | 120% | + 2 accessories + aura |
| Legendary | 3 | 150% | + 3 accessories + unique effect |
| MYTHIC | 3 + hidden | 200% | Fully unique appearance |

### Trading System

- Partners can be traded between players
- "Gacha trading cards" vibe
- Unique ID prevents duplication
- "I'll trade you my Yandere Thunderkeeper for your Kuudere Moonweaver"

---

## 🎭 The Drama System — The 8th Resource {#the-drama-system}

*"Where there are waifus, there is drama."*

### Drama Generation

Drama generates passively when:
- Waifus are in the same party
- You gift one waifu while another watches
- Random events trigger interactions
- You reach bond milestones with multiple waifus

### Drama Types

**Positive Drama (buffs):**
```
☕ Mochi-chan and Luna had a lovely tea time!
   → +10% PP for 1 hour

🎉 Captain Nyanta told Professor Fluffington a great sea story!
   → +15% expedition rewards for 1 day

💕 All waifus are getting along harmoniously!
   → HARMONY BONUS: +5% to everything
```

**Negative Drama (debuffs, but farmable):**
```
😤 Luna is upset you spent 3 hours with Mochi-chan!
   → Luna's bonus reduced by 50% until you gift her

🗡️ Captain Nyanta called Professor Fluffington a "land-lubber nerd"!
   → Both waifus refuse to be in the same party for 24 hours

😢 You haven't visited Sakura in 7 days. She's worried about you.
   → Sakura's healing reduced until visited
```

**MAXIMUM DRAMA (risk/reward):**
```
💔🔥 THE DRAMA HAS REACHED CRITICAL MASS 🔥💔

All waifus are upset! But drama energy is overflowing!
→ All waifu bonuses: -50%
→ BUT: Drama Energy can be converted to MASSIVE one-time bonus

[RESOLVE DRAMA] - Costs gifts, restores harmony
[HARVEST DRAMA] - Convert to 10x BP burst, drama continues
```

### Drama Queen — Secret Waifu

Unlocked by reaching **MAXIMUM DRAMA** 10 times.

**Drama Queen, the Instigator:**
- Passive: Drama generates 3x faster
- Active: "Stir the Pot" — Create drama on demand
- Bond: Increases by CAUSING drama, not receiving gifts
- Quote: "Oh my, did I say that out loud? Ohohoho~"

### Drama Diary

- Log of all drama events
- Becomes a soap opera storyline
- Unlocks lore and backstory through drama
- Achievement: "Days of Our Snoots" — Read 100 drama entries

---

## 🌑 The Dark Timeline — "The Honkening" {#the-dark-timeline}

*"What if the Goose won?"*

### How to Unlock

Hidden bad ending triggered by:
1. Letting 100 geese escape without booping
2. Never recruiting a Goose Ally after defeating Cobra Chicken
3. Reaching negative "Goose Relations" score
4. Finding the "Forbidden Honk" item and using it

### The Honkening

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│    T̷̰͝H̵̭͝Ë̶̱́ ̶̣̈H̵͚͝O̷̰͝N̵̫̈K̵̰̈Ë̷̱N̵̫̈Ï̶̱N̵̫̈G̷̰͝ ̵̣̈H̵̭͝Ä̶̱S̵̫̈ ̶̣̈B̵̭͝Ë̶̱G̷̰͝Ű̶̱N̵̫̈     │
│                                                              │
│              🦢 HONK 🦢 HONK 🦢 HONK 🦢                      │
│                                                              │
│         The Celestial Snoot Sect has fallen.                 │
│         The waifus have fled.                                │
│         Only geese remain.                                   │
│                                                              │
│              Do you wish to continue?                        │
│                                                              │
│              [ACCEPT HONK]  [RESIST]                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Dark Timeline Gameplay

**The World Changed:**
- All cat sprites are sad/corrupted
- Waifus are gone (greyed out portraits with "???")
- Geese roam freely, can't be booped
- Sky is permanently dark
- Music is ominous honking

**The Resistance:**
- Find hidden cats who escaped
- Build underground sect
- Learn "Anti-Goose" techniques
- Recruit defector geese (yes, some switched sides)

**The Final Battle:**
- Storm the Goose Palace
- Face **HONKTHULHU, THE ETERNAL HONK**
- Multi-phase boss fight
- Requires everything you've learned

**Reversing The Honkening:**
- Beat Honkthulhu
- Timeline resets with BONUS
- Keep Dark Timeline achievements/cosmetics
- Unlocks "Survivor" title
- Secret dialogue from waifus acknowledging what you did

### Dark Timeline Exclusives

- **Corrupted Cats** — Dark versions of legendary cats
- **The Resistance Fighters** — NPCs who only exist here
- **Honk Armor Set** — Equipment made from goose feathers
- **"I Survived The Honkening"** — Permanent badge

---

## 🎤 Voice & Audio Expansion {#voice-audio-expansion}

*"Give them VOICE"*

### Waifu Voice Packs

**Professional (Optional DLC):**
- Full voice acting for all dialogue
- Battle callouts
- Bond milestone celebrations
- Gacha pull reactions

**Community Voice Pack:**
- Let the Discord boys record lines
- Gerald voices... Gerald
- Rusty's VA is just Rusty yelling
- Intentionally amateur and hilarious
- Toggle between "Pro" and "Friends" audio

### Cat Vocalizations

**Procedural Meow System:**
```javascript
const CAT_SOUNDS = {
  happy: ['mrrp', 'prrt', 'mew', 'purr'],
  angry: ['hiss', 'growl', 'MROW'],
  curious: ['mrr?', 'mew?', 'prrp?'],
  sleepy: ['mrrrrr...', 'zzz...mew', 'prrrr'],
  
  // Personality modifiers
  modifiers: {
    shaolin: { pitch: 'low', reverb: 'temple' },
    wudang: { pitch: 'medium', reverb: 'mountain' },
    void: { pitch: 'low', effect: 'echo' },
    divine: { pitch: 'high', effect: 'celestial' }
  }
};
```

### The Goose Voice

**H O N K**

But with emotional range:
- Happy Honk (ascending pitch)
- Angry Honk (loud, aggressive)
- Sad Honk (descending, quiet)
- Menacing Honk (low, sustained)
- **ELDRITCH HONK** (Honkthulhu only, reverses audio)

### The Seven Masters Voice Lines

| Master | Battle Cry | Victory | Defeat |
|--------|-----------|---------|--------|
| Gerald | "Balance in all things!" | "The Sect grows stronger." | "A setback, not a defeat." |
| Rusty | "THOUSAND BOOP BARRAGE!!!" | "THAT'S WHAT I'M TALKING ABOUT!" | "I'll get 'em next time..." |
| Steve | "Calculated." | "As predicted." | "...I need to recalculate." |
| Andrew | "Gotta go fast!" | "First place baby!" | "Wait, what happened?!" |
| Nik | "..." | "..." | "..." (but meaningful) |
| Yuelin | "May harmony guide us." | "The cats are pleased." | "We must tend to our wounds." |
| Scott | "I am... unmoved." | "Solid." | "...I'll just... wait here." |

---

## 🎪 Seasonal Crossovers {#seasonal-crossovers}

*"The multiverse is leaking"*

### Event Structure

**Duration:** 2-4 weeks
**Content:** Unique story, exclusive characters, limited cosmetics
**Rerun Policy:** Events return annually, new rewards added

### Crossover Concepts

**"The Untitled Crossover" — Untitled Goose Game:**
- The Untitled Goose visits from "another game"
- Special dungeon: The Village
- Steal items from NPCs, cause chaos
- Reward: Untitled Goose as Goose Ally variant
- Cosmetic: "To-Do List" accessory

**"Much Wow, Very Snoot" — Doge:**
- Doge appears as a wise but confused mentor
- Speech bubbles in Comic Sans
- Teaches "Way of the Doge" techniques
- Reward: Doge Hat cosmetic
- Quote: "wow. such boop. very snoot. much cultivate."

**"It's Crab Time" — Crab Rave:**
- Giant enemy crab (but friendly)
- Teaches crabs to boop
- Unlocks "Crab Rave" victory animation
- All music is crab rave for the event
- Reward: Crab Claws weapon

**"A Hideo Kojima Production":**
- Extremely long cutscenes
- Box-based stealth mechanics (cats love boxes)
- Confusing plot that somehow makes sense
- Reward: "Tactical Cardboard" armor set
- Achievement: "Kept You Waiting, Huh?"

**"The Bee Movie But It's Snoots":**
- According to all known laws of aviation, cats should not be able to boop
- Barry B. Benson shows up, very confused
- Ya like snoots?
- Reward: Bee antenna hat

---

## 🎰 The Catino — Cat Casino {#the-catino}

*"The house always wins. But it's YOUR house."*

### Unlocking

- Building: **The Golden Catino**
- Cost: 50 Million BP
- Location: Requires "Floating Palace" territory

### Games

**1. Snoot Slots**
```
┌─────────────────────────┐
│   🐱  🐱  🦢           │
│   👃  👃  👃  ← SNOOT! │
│   🐟  🐱  🐟           │
├─────────────────────────┤
│  BET: 1000 BP          │
│  [SPIN] [MAX BET]      │
└─────────────────────────┘

PAYOUTS:
🐱🐱🐱 = 10x
👃👃👃 = 100x (SNOOT JACKPOT!)
🦢🦢🦢 = 50x (but a goose attacks)
```

**2. Goose Race**
```
┌─────────────────────────────────────────┐
│  GOOSE RACE - Pick your goose!          │
├─────────────────────────────────────────┤
│  1. Speedy Honk      - 3:1 odds        │
│  2. Chaos Waddle     - 5:1 odds        │
│  3. The Sure Thing   - 1.5:1 odds      │
│  4. ???              - 50:1 odds        │
├─────────────────────────────────────────┤
│  [Race starts in 0:30]                  │
│  Your bet: 5000 BP on #2                │
└─────────────────────────────────────────┘

Note: Geese are unpredictable. #3 "The Sure Thing" 
has a 40% chance to just leave mid-race.
```

**3. Cat Poker**
```
Your cats play poker against each other.
You just watch.

Current Hand:
- Mr. Whiskers: 😐 (Poker face)
- Void Cat: 😐 (Always has poker face)
- Tabby: 😰 (Terrible poker face)
- Ceiling Cat: 👁️ (Sees all cards)

Bet on who wins! (Ceiling Cat banned from play)
```

**4. Wheel of Misfortune**
```
┌─────────────────────────────┐
│         SPIN THE            │
│    WHEEL OF MISFORTUNE      │
│                             │
│    💰 2x BP for 1 hour      │
│    🐱 Free rare cat         │
│    😱 All cats sad          │
│    🦢 Goose attack!         │
│    🎁 Mystery box           │
│    💀 Lose half BP          │
│    ⭐ JACKPOT               │
│    🔄 Spin again            │
│                             │
│    Cost: 10,000 BP          │
│    [SPIN]                   │
└─────────────────────────────┘
```

### The High Roller Room

Unlock by gambling 1 Million BP total.

- Higher stakes versions of all games
- Exclusive cosmetics
- "Whale" title
- Comically large stack of chips visual

### Responsible Gambling (In-Game Joke)

- After losing 10 times in a row, a cat appears:
- "Hey... maybe take a break? Go boop some snoots."
- Actually good advice wrapped in humor

---

## 👿 Nemesis System {#nemesis-system}

*"They remember. They always remember."*

### How It Works

When an enemy kills one of your cats in the dungeon:

1. Enemy gets **PROMOTED**
2. Gains a title based on the kill
3. Remembers your cat's name
4. Appears in future runs, stronger
5. Has unique dialogue taunting you

### Nemesis Generation

```javascript
const generateNemesis = (enemy, killedCat) => {
  return {
    base: enemy,
    title: generateTitle(enemy, killedCat),
    level: 1,
    kills: [killedCat.name],
    dialogue: generateTaunt(enemy, killedCat),
    bonuses: {
      hp: 1.5,
      damage: 1.3,
      special: rollSpecialAbility()
    }
  };
};

const TITLE_TEMPLATES = [
  '{enemy}, Slayer of {cat}',
  '{enemy} the {cat}-Bane',
  '{enemy}, Who Ended {cat}',
  'Dread {enemy}, Terror of Snoots',
  '{enemy} the Unbooped'
];

const TAUNTS = [
  "Ah, {cat}'s friends. Come to join them?",
  "I remember {cat}. They screamed. Will you?",
  "*laughs in {enemy}* You dare return?",
  "{cat} put up more of a fight than you.",
  "The Sect sends more victims? How kind."
];
```

### Nemesis Progression

| Level | Title Addition | Bonus |
|-------|---------------|-------|
| 1 | Base title | +50% HP |
| 2 | "the Feared" | +100% HP, +30% damage |
| 3 | "the Dreaded" | +150% HP, +50% damage, minions |
| 4 | "the Legendary" | +200% HP, +75% damage, unique skill |
| 5 | "the ETERNAL" | Boss-tier, unique arena, cutscene |

### Revenge System

**Killing a Nemesis:**
- Bonus loot scales with their level
- Exclusive "Nemesis Trophy" item
- Your cats gain "Avenger" buff
- Satisfying revenge dialogue

**Cat Dialogue on Revenge:**
```
Mr. Whiskers: "That was for Tabby."
Void Cat: "Balance has been restored."
Ceiling Cat: "I saw everything. Justice is served."
```

### Defector System

Rare chance (5%) that a Level 4+ Nemesis offers to JOIN you instead of fighting:

```
┌─────────────────────────────────────────┐
│                                          │
│  VACUUM PRIME, THE ETERNAL speaks:       │
│                                          │
│  "I have hunted your kind for eons.      │
│   But I grow tired of this conflict.     │
│   Let me join your cause, and together   │
│   we shall be unstoppable."              │
│                                          │
│  [ACCEPT] - Gain Vacuum Prime as ally    │
│  [REFUSE] - Fight to the death           │
│  [MOCK]   - Fight, but they're angry     │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🛠️ User-Generated Content {#user-generated-content}

*"Let the people cook"*

### Custom Dungeon Builder

**Tools:**
- Floor layout editor (grid-based)
- Enemy placement
- Loot table configuration
- Event scripting (simple)
- Boss room designer

**Sharing:**
- Unique dungeon codes
- Rating system (difficulty, fun, creativity)
- Featured dungeons weekly
- "Gerald's Pain Dimension" becomes legendary

### Custom Dungeon Examples

```
DUNGEON CODE: SNOOT-PAIN-7777

Name: "Gerald's Pain Dimension"
Creator: Gerald the Jade Palm
Difficulty: ⭐⭐⭐⭐⭐ EXTREME
Floors: 10
Special Rules: 
  - All enemies are elite
  - No healing between floors
  - Boss every floor
  - "Why would you make this, Gerald?"

Rating: 4.8/5 (2,847 attempts, 12 completions)
```

```
DUNGEON CODE: SNOOT-EASY-1234

Name: "Rusty's Loot Cave"
Creator: Rusty the Crimson Fist
Difficulty: ⭐ EASY
Floors: 3
Special Rules:
  - Enemies have 1 HP
  - Every chest is legendary
  - Suspiciously easy...
  - (Final boss is Rusty himself at 10x power)

Rating: 4.5/5 (Creator is a troll but we love him)
```

### Community Cosmetics

- Submit pixel art for cosmetics
- Community votes
- Winners get implemented
- Creator credit in item description

### Custom Cat Submission

- Design a cat (within stat budget)
- Write lore
- Community votes
- Top cats added to game pool
- Creator gets the cat for free + "Designer" title

---

## 🐕 Cats vs Dogs — The Great Schism {#cats-vs-dogs}

*"The eternal debate... settled in combat."*

### The Dog Faction (DLC/Expansion)

**NOT enemies. RIVALS.**

Parallel progression track with:
- Dog Masters (The Seven Good Boys)
- Dog Waifus (???)
- Dog Dungeons (The Endless Backyard)
- Dog mechanics (Fetch instead of Boop)

### The Seven Good Boys

| Dog Master | Title | Equivalent to |
|------------|-------|---------------|
| Barktholomew | The Noble Woof | Gerald |
| Ruffian | The Loud One | Rusty |
| Professor Borks | The Big Brain | Steve |
| Zoomsworth | The Speedy | Andrew |
| Shadow Pupper | The Quiet | Nik |
| Lady Woofington | The Kind | Yuelin |
| Sir Chonks-a-Lot | The Immovable | Scott |

### Rivalry Events

**Weekly: The Great Debate**
```
This week's competition: TOTAL SNOOTS BOOPED vs TOTAL FETCHES FETCHED

CAT FACTION: 847,293,847 snoots
DOG FACTION: 823,847,283 fetches

Current Winner: CATS (for now...)

Your contribution: 12,847 snoots

Winning faction gets:
- 2x resource gain for 1 week
- Exclusive weekly cosmetic
- Bragging rights
```

### Cross-Faction Content

- Dungeons with both cats AND dogs
- Unlikely alliances
- "The enemy of my enemy is my friend" storylines
- United against... THE GOOSE MENACE

### The True Ending

Secret ending requires:
- Max progress in Cat faction
- Max progress in Dog faction
- Completing the "Unity" questline
- Cats and Dogs working together
- Unlocks: "The Mediator" title, combined faction bonuses

---

## 📱 IRL Integration {#irl-integration}

*"Touch grass, gain snoots"*

### Pedometer Mode (Mobile)

```
DAILY STEPS: 4,847 / 10,000

Rewards unlocked:
✅ 1,000 steps  → 1,000 BP
✅ 2,500 steps  → Rare cat food
✅ 5,000 steps  → FREE GACHA SPIN
⬜ 7,500 steps  → Epic loot box
⬜ 10,000 steps → LEGENDARY CAT EGG

"Your cats are proud of your exercise!"
```

### Weather Sync

| IRL Weather | In-Game Effect |
|-------------|----------------|
| Sunny | +10% cat happiness |
| Rainy | +25% PP (cats love naps) |
| Cloudy | Neutral |
| Snowy | Winter event bonuses active |
| Stormy | Random lightning boosts |
| Extreme Heat | Cats are lazy (-10% active, +50% AFK) |

### Time of Day Bonuses

| Time | Bonus |
|------|-------|
| 6 AM - 9 AM | "Early Bird" +20% EXP |
| 9 AM - 5 PM | Normal |
| 5 PM - 9 PM | "After Work" +10% loot |
| 9 PM - 12 AM | "Night Owl" +15% PP |
| 12 AM - 3 AM | "Cursed Hours" +50% everything, ???% chance of weird events |
| 3 AM - 6 AM | "Why Are You Awake?" achievement unlocked, concerned message from Mochi-chan |

### Discord Rich Presence

```
Gerald is playing Snoot Booper: Idle Wuxia Cat Sanctuary

Current Activity: Booping snoots in the Infinite Pagoda
Floor: 47
Today's Boops: 69,420 (nice)
Favorite Waifu: Luna Whiskerbell (don't tell the others)
Goose Status: 12 HONKED

[Join Sect] [Challenge to Duel]
```

### Location-Based (Optional, Privacy-Respecting)

- Different regions have different "local cats"
- Travel IRL, find new cats
- "I found this cat in Tokyo!" sharing
- Completely optional, no gameplay requirement

---

## 🎨 Custom Cat Creator {#custom-cat-creator}

*"The ultimate prestige reward"*

### Unlocking

Requirements:
- 100% base game completion
- 10 Ascensions
- All waifus max bond
- Floor 100 cleared
- 1 Million total boops

### The Creation Process

**Step 1: Appearance**
```
┌─────────────────────────────────────────┐
│         CUSTOM CAT CREATOR              │
├─────────────────────────────────────────┤
│  ┌─────────┐                            │
│  │  😺     │  Body Type: [Smol] [Normal] [Chonk] [Long] │
│  │  /|\    │  Fur Pattern: [Solid] [Tabby] [Void] [Calico] │
│  │   |     │  Color Primary: [████████]  │
│  │  / \    │  Color Secondary: [████████]│
│  └─────────┘  Eyes: [Round] [Narrow] [Heterochromia] │
│                Accessories: [+Hat] [+Collar] [+Tail Ribbon] │
│                                         │
│  [RANDOMIZE]  [IMPORT PIXEL ART]       │
└─────────────────────────────────────────┘
```

**Step 2: Stats (Budget System)**
```
STAT BUDGET: 100 points

Attack:   ████████░░ (40)   [-] [+]
Defense:  ██████░░░░ (30)   [-] [+]
Speed:    ████░░░░░░ (20)   [-] [+]
Luck:     ██░░░░░░░░ (10)   [-] [+]

Remaining: 0

Special Trait: [Dropdown]
- Night Hunter (+20% night damage)
- Box Lover (+50% in boxes)
- Goose Affinity (Geese don't attack this cat)
- Snoot Specialist (+25% boop damage)
```

**Step 3: Identity**
```
Name: [________________]
Title: [________________], the [________________]
School: [Dropdown: Shaolin/Wudang/Emei/etc.]
Personality: [Dropdown: Brave/Shy/Chaotic/etc.]

Backstory (500 chars max):
┌─────────────────────────────────────────┐
│ Write your cat's origin story...        │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**Step 4: Finalize**
```
┌─────────────────────────────────────────┐
│                                          │
│  YOUR CUSTOM CAT IS COMPLETE!           │
│                                          │
│  ★ Sir Fluffernicus, the Magnificent ★  │
│                                          │
│  "Born from the dreams of a mad         │
│   cultivator, this cat defies all       │
│   known laws of floof."                 │
│                                          │
│  This cat will be added to YOUR game    │
│  permanently. It cannot be deleted.     │
│                                          │
│  [CREATE CAT]  [GO BACK]                │
│                                          │
└─────────────────────────────────────────┘
```

### Community Pool Submission

- Submit your cat for community voting
- Top voted cats each month get added to everyone's game
- Creator credited in cat description
- "Created by: Gerald the Jade Palm"

---

## 💀 Hardcore Modes {#hardcore-modes}

*"For those who crave suffering"*

### Ironman Mode

**Rules:**
- One save file
- No cloud backup
- Cats that die are GONE FOREVER
- No prestige/ascension
- No revives in dungeons

**Rewards:**
- Exclusive "Ironman" badge
- Special leaderboard
- Unique cosmetics (edgy black variants)
- Eternal bragging rights
- Actually impressive

### No-Boop Challenge

**Rules:**
- Cannot manually boop
- Must rely entirely on auto-systems
- Tests your AFK optimization skills
- Waifus must do all the work

**Rewards:**
- "Hands-Free" achievement
- Tests game balance honestly
- Unique "Lazy Master" title

### One Cat Army

**Rules:**
- Only ONE cat allowed
- Ever
- Choose wisely
- That cat must do everything

**Rewards:**
- "Lone Wolf" title (ironic for a cat)
- Proves your best cat
- Unique bond with that cat

### Goose Mode

**Rules:**
- You ARE a goose
- Inverted gameplay
- Steal from cats
- Cause chaos
- Other players' sects are your targets

**Rewards:**
- "Chaotic Evil" badge
- Unique goose cosmetics
- Villain playthrough

---

## 🎙️ The Lore Podcast — "Snoot Talk" {#the-lore-podcast}

*"Two cats discuss the deep lore"*

### Format

In-game podcast hosted by two cat NPCs:
- **Professor Whiskers** — Serious, academic
- **Chad Cat** — Casual, interrupts with jokes

### Episode Structure (5-10 min each)

```
┌─────────────────────────────────────────┐
│  🎙️ SNOOT TALK - Episode 47            │
│  "The Mystery of Ceiling Cat"           │
├─────────────────────────────────────────┤
│  [▶️ PLAY]  [⏭️ SKIP]  [📜 TRANSCRIPT] │
│                                          │
│  PROF: Today we discuss the origins of  │
│        Ceiling Cat, the All-Seeing.     │
│                                          │
│  CHAD: Bro he's literally just vibing   │
│        up there.                         │
│                                          │
│  PROF: *sigh* There's actually deep     │
│        theological implications—         │
│                                          │
│  CHAD: CEILING CAT IS WATCHING YOU      │
│        CULTIVATE                         │
│                                          │
│  PROF: ...yes. Anyway, ancient texts... │
│                                          │
│  [Next Episode: "Was Gerald Always Bald?"] │
└─────────────────────────────────────────┘
```

### Episode Topics

1. "The Origin of Snoots"
2. "Gerald and Rusty: A Friendship Forged in Boops"
3. "The Goose Conspiracy"
4. "What IS The Catnip Dimension?"
5. "Mochi-chan's Secret Warrior Past"
6. "The Seven Masters: Where Did They Come From?"
7. "Ceiling Cat: God or Just Tall?"
8. "The Untitled Goose: Villain or Misunderstood?"
9. "Why Do Cats Loaf?"
10. "The Developer: Fourth Wall or Fifth Dimension?"

### Unlocking Episodes

- Episodes unlock as you discover related lore
- Some require achievements
- Secret episodes for 100% completion
- "Lost Episodes" hidden in obscure locations

---

## 🔧 Mod Support {#mod-support}

*"Let the community go absolutely feral"*

### Mod Types Supported

**Content Mods:**
- Custom cats (sprites, stats, lore)
- Custom waifus
- Custom enemies
- Custom dungeons
- Custom equipment

**Visual Mods:**
- UI reskins
- Sprite replacements
- Effect overhauls
- "HD" texture packs (for the 8-bit game lol)

**Audio Mods:**
- Custom music
- Custom sound effects
- Voice packs

**Gameplay Mods:**
- Balance adjustments
- New mechanics
- Difficulty modifiers
- "Cursed" mods

### Example Mods (Community-Made)

```
TOP MODS THIS WEEK:

1. "Everyone is Nicholas Cage" (Visual)
   All sprites replaced with Nicholas Cage
   Downloads: 47,283
   Rating: 5/5 "Perfection"

2. "Realistic Cat Sounds" (Audio)
   Replaces all sounds with actual cat recordings
   Downloads: 31,847
   Rating: 4/5 "My cat keeps looking at my screen"

3. "Dark Souls Mode" (Gameplay)
   Everything one-shots you
   Downloads: 12,483
   Rating: 5/5 "I have died 847 times"

4. "UwU Translator" (Visual/Text)
   All text is uwu-ified
   Downloads: 8,847
   Rating: 3/5 "I wegwet evewything"

5. "The Anti-Goose Mod" (Gameplay)
   Removes all geese from the game
   Downloads: 2,847
   Rating: 1/5 "COWARD" - 2/5 "Finally, peace"
```

### Mod Tools

- Simple JSON-based content definition
- Sprite import guidelines
- Sound format requirements
- Testing sandbox mode
- Steam Workshop integration (if on Steam)

---

## 🚀 Actual Release Planning {#actual-release-planning}

*"Wait, we're actually doing this?"*

### Platform Targets

| Platform | Priority | Notes |
|----------|----------|-------|
| Web (itch.io) | HIGH | Free, accessible, perfect for sharing |
| Steam | HIGH | Visibility, achievements, workshop |
| Mobile (iOS/Android) | MEDIUM | Huge audience, IAP potential |
| Discord Activity | LOW | Would be cool though |

### Monetization Strategy (Ethical)

**Free-to-Play Model:**
- Base game 100% free
- No pay-to-win
- No paid gacha (gacha is free spins only)
- No energy systems

**Revenue Streams:**
1. **Cosmetic DLC** — Skins, themes, visual packs
2. **Expansion Packs** — Dog faction, Dark Timeline
3. **Supporter Pack** — "Give us money" button with exclusive badge
4. **Soundtrack** — Sell the OST separately
5. **Merch** — Physical cat plushies?!

### Development Phases

**Phase 1: Core Game (MVP)**
- Basic boop mechanic
- 10-20 cats
- 3 waifus
- Basic dungeon (10 floors)
- Web release

**Phase 2: Content Expansion**
- Full cat collection
- All waifus
- Equipment system
- Dungeon to floor 50
- Steam release

**Phase 3: Social Features**
- Multiplayer/co-op
- Sect Wars
- Leaderboards
- Discord integration

**Phase 4: Post-Launch**
- This entire document
- Community content
- Mod support
- DLC expansions

### The Team We'd Need

| Role | Responsibility |
|------|----------------|
| Lead Dev | Core systems, architecture |
| Artist | All the pixel art (so much pixel art) |
| Sound Designer | Chiptunes, sound effects |
| Writer | Lore, dialogue, the podcast |
| Community Manager | Discord, feedback, events |
| QA | Breaking everything before players do |

### Budget Estimate (Rough)

**Indie Bootstrap:**
- Art: $5,000-15,000 (commission or rev-share)
- Sound: $2,000-5,000 (royalty-free + custom)
- Tools: $500-1,000 (licenses, hosting)
- Marketing: $1,000-5,000 (trailers, ads)
- **Total: $8,500 - $26,000**

**With Team:**
- Multiply by "paying people fairly"
- Probably $50,000-100,000 for a solid release
- Or rev-share with the Discord boys lol

---

## 🎯 Final Notes

Gerald, this document is now **comprehensive enough to actually make the game**.

Between PROMPT.md, CLAUDE.md, and this POST_LAUNCH.md, you have:

- Complete game design
- Technical implementation guides
- Content for years of updates
- A roadmap that scales

The Celestial Snoot Sect has everything it needs to become a real thing.

**Next Steps:**
1. Pick a tech stack (I'd suggest Godot, Phaser, or React for web)
2. Build the MVP (core boop loop + 5 cats)
3. Get the Discord boys to playtest
4. Iterate until it feels GOOD
5. Release on itch.io
6. ???
7. Profit (and by profit I mean satisfaction)

*"The journey of a thousand boops begins with a single snoot."*

Let's make this game. 🐱⚔️🚀

---

*Document Version: 1.0*
*Last Updated: The Eternal Now*
*Status: READY TO BUILD*
