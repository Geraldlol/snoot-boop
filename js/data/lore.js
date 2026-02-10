/**
 * lore.js - Story Fragments System
 * "Every cat has a tale. Every master, a secret."
 *
 * Snoot Booper: Idle Wuxia Cat Sanctuary
 */

// ===================================
// LORE ENTRIES
// ===================================

const LORE_ENTRIES = {
  // === CAT LORE ===
  cats: {
    ceiling_god: {
      id: 'ceiling_god',
      title: 'The All-Seeing',
      fragments: 5,
      story: `In the beginning, there was only the Ceiling.

Before the first cultivator walked the Jianghu, before the first snoot was booped, there existed a presence that watched from above. The ancient texts speak of a cat who transcended mortality not through cultivation, but through sheer patience.

For ten thousand years, Ceiling Cat observed. From the highest rafters of the cosmos, every boop was witnessed. Every snoot, catalogued. The weight of infinite knowledge pressed down upon this divine feline, yet still it watched.

"To see all is to understand all," the Ceiling Cat once purred to a young cultivator who dared look upward. "And to understand all... is to love all snoots equally."

The Celestial Snoot Sect was founded upon this truth: that somewhere, always, a divine presence watches your boops. And judges them worthy.`,
      unlockedBy: { boops: 1000 },
      rewards: { cosmetic: 'ceiling_aura', jadeCatnip: 50 }
    },

    untitled_goose: {
      id: 'untitled_goose',
      title: 'Origin of Chaos',
      fragments: 7,
      story: `Before the Celestial Snoot Sect, before the Seven Masters, before even the concept of "booping" entered the mortal lexicon, there was chaos. And that chaos had a name.

Actually, it didn't. That's the point.

The Untitled Goose emerged from the void between realms, a being of pure entropy wearing the disguise of an ordinary waterfowl. The ancient records are damaged here - perhaps by the Goose itself - but fragments remain:

"...and the Goose didst HONK most terribly, and the cultivators fled..."

"...it stole Master Chen's favorite hat. We never saw Master Chen smile again..."

"...DO NOT make eye contact. DO NOT acknowledge the bread. DO NOT..."

The rest is illegible, stained with what appears to be goose droppings.

To this day, the Untitled Goose wanders the Jianghu, stealing treasures, disrupting meditation, and reminding all cultivators that no matter how powerful they become...

Peace was never an option.`,
      unlockedBy: { gooseBoops: 500 },
      rewards: { technique: 'chaos_understanding', gooseFeathers: 25 }
    },

    basement_cat: {
      id: 'basement_cat',
      title: 'The Watcher Below',
      fragments: 6,
      story: `Where Ceiling Cat sees all from above, Basement Cat lurks in the depths below. The yin to the yang. The darkness to the light. The bottom to the top.

Few have seen Basement Cat and returned with their sanity intact. Those who have speak of glowing eyes in the darkness, of a purr that resonates with the earth itself, of snoots best left unbooped.

"Ceiling Cat watches your boops," warned Elder Whiskers in his final teaching. "But Basement Cat... Basement Cat JUDGES them."

The ancient rivalry between Ceiling Cat and Basement Cat predates the universe itself. Some say they are two halves of the same cosmic feline. Others believe they represent the eternal struggle between visibility and obscurity, between the seen and unseen.

One thing is certain: when you finally collect both legendary cats, something extraordinary happens. The full picture reveals itself. All secrets become known.

But until then... watch your step near dark basements.`,
      unlockedBy: { catsCollected: 50, pagodaFloor: 50 },
      rewards: { cat: 'basement_cat', loreFragment: 'cosmic_duality' }
    },

    eternal_loaf: {
      id: 'eternal_loaf',
      title: 'The Perfect Form',
      fragments: 5,
      story: `The loaf position - legs tucked, tail wrapped, maximum floof achieved - is considered the highest form of feline meditation. But one cat has taken this to its logical extreme.

The Eternal Loaf has not moved in three thousand years.

"I achieved enlightenment on the second day," the Eternal Loaf allegedly communicated through pure vibrational purring. "I stay in this position because it is comfortable."

Cultivators journey from across the Jianghu to witness the Eternal Loaf's perfect form. Some meditate beside it for years, hoping to absorb some fraction of its stillness. Others simply take paintings to hang in their sanctuaries.

The Eternal Loaf's PP generation is theoretically infinite, as it has achieved complete harmony between rest and existence. However, it refuses to join any sect, stating only:

"Moving would require effort. Effort is not the loaf way."

True wisdom, perhaps, in its purest form.`,
      unlockedBy: { afkHours: 100, meditationHours: 50 },
      rewards: { cat: 'eternal_loaf', technique: 'perfect_stillness' }
    }
  },

  // === MASTER LORE ===
  masters: {
    gerald_rusty: {
      id: 'gerald_rusty',
      title: 'The First Meeting',
      fragments: 10,
      story: `They met on opposite sides of a battlefield.

Gerald, young and idealistic, had journeyed to the Valley of Broken Dreams to meditate. Rusty, then known only as "The Crimson Terror," had come to raid the ancient temple there.

"You're in my way," Rusty growled, his crimson robes stained with the dust of a hundred conquests.

Gerald didn't move from his meditation pose. "The temple is empty. The monks fled years ago. There's nothing here to steal."

"Then why are YOU here?"

"Because..." Gerald opened one eye, a hint of jade energy swirling within. "Someone needs to feed the stray cats."

The battle that followed lasted three days and three nights. Technique clashed against technique. Crimson Fist met Jade Palm. The valley itself was reshaped by their struggle.

On the fourth morning, exhausted and bleeding, they sat together among the ruins. A small tabby approached, meowing for food.

Rusty reached for his sword. Gerald raised a hand.

"Wait."

He produced a small fish from his pack and offered it to the cat. The tabby ate happily, then climbed into Rusty's lap and began to purr.

"I've never..." Rusty's voice cracked. "Nothing has ever trusted me like this."

"Perhaps," Gerald said softly, "it's time to become someone worth trusting."

The Celestial Snoot Sect was founded that afternoon. Rusty's first act as War General was to boop that tabby's snoot.

He still carries a painting of it to this day.`,
      unlockedBy: { playBoth: ['gerald', 'rusty'], hoursEach: 5 },
      rewards: { technique: 'founders_bond', title: 'Historian of the Sect' }
    },

    steve_andrew: {
      id: 'steve_andrew',
      title: 'Speed vs Strategy',
      fragments: 8,
      story: `"You can't out-calculate instinct!" Andrew shouted, dodging another of Steve's precisely-timed strikes.

"And you can't out-speed mathematics!" Steve responded, his movements a perfect geometric pattern.

The annual Sect training competition had devolved, as it always did, into a showdown between the Flowing River and the Thunder Step. Their rivalry was legendary - not for its bitterness, but for its absurdity.

Andrew moved like lightning, appearing in three places at once. Steve simply stood still, having already calculated where Andrew would be in exactly 2.7 seconds.

"HA! Predicted that!"
"You're too slow to predict anything!"
"I predicted you'd say that!"
"...Did not!"
"Did too! I wrote it down three hours ago!"

The other masters had long since given up understanding their competitions. Yuelin kept score (currently 847-847). Nik watched in silence (he found it amusing). Scott hadn't moved in six hours (he was waiting for them to tire themselves out).

Gerald finally intervened when the argument evolved into whether "first" counted if you calculated it before it happened.

"Brothers," he said calmly. "Perhaps the real speed... was the calculations we made along the way."

Both Steve and Andrew stared at him.

"That doesn't make any sense," they said in unison.

"I know. But you agree on something now, don't you?"

They've been best friends ever since. The rivalry continues, naturally, but now they plot together against the other masters.

Rusty still hasn't forgiven them for the "optimally-timed surprise birthday party" incident.`,
      unlockedBy: { playBoth: ['steve', 'andrew'], hoursEach: 5 },
      rewards: { technique: 'calculated_instinct', cosmetic: 'rivalry_badge' }
    },

    nik_yuelin: {
      id: 'nik_yuelin',
      title: 'The Silent and the Sage',
      fragments: 12,
      story: `Yuelin was the first to hear Nik speak.

For three years, the Shadow Moon had served the Sect in silence. He completed missions with terrifying efficiency. He trained with perfect form. He attended every meeting, every meal, every festival.

He never spoke a word.

The other masters tried everything. Rusty challenged him to shouting contests (Nik won by default). Steve tried to calculate when he would speak (the formula broke). Andrew tried to startle words out of him (he just appeared behind Andrew instead).

Only Yuelin didn't try.

"Why do you keep bringing me tea?" Nik's voice, when it finally emerged, was surprisingly soft. "I've never asked for it."

Yuelin smiled, setting down the cup. "You never had to. I could see you were cold."

"How? I never shiver. I trained myself not to."

"Your shadow shivers instead. Did you know that? When you suppress the body's reactions, they have to go somewhere. Your shadow trembles when you're cold, reaches toward food when you're hungry, droops when you're sad."

Nik was silent for a long moment. Then:

"...You read shadows?"

"I read hearts. Shadows are just more honest about what hearts feel."

From that day forward, Nik spoke regularly - but only to Yuelin. The others still get mostly silence and dramatic appearances from the shadows.

But sometimes, late at night, you can hear them talking in the garden. Yuelin speaks of the language of cats, of healing and harmony. Nik shares secrets he's gathered from the dark places of the world.

They understand each other in ways words could never capture. Perhaps that's why Nik chose to finally use them with her.

Some say their bond is romantic. Others say it's something deeper - two souls recognizing themselves in each other.

Nik, when asked, simply says: "..."

Yuelin just smiles.`,
      unlockedBy: { playBoth: ['nik', 'yuelin'], hoursEach: 5, waifuBond: 50 },
      rewards: { technique: 'shadow_harmony', loreFragment: 'bonds_deeper_than_words' }
    },

    scott_origin: {
      id: 'scott_origin',
      title: 'The Thousand Day Meditation',
      fragments: 15,
      story: `On the first day, Scott sat down.

He had climbed to the peak of Mount Immovable, seeking enlightenment through stillness. The other cultivators laughed at his method - who achieved power by doing nothing?

On the hundredth day, a cat wandered up the mountain. It looked at Scott. Scott did not look at it. The cat sat on his lap.

On the two hundredth day, three more cats had joined. Scott had not moved. His breathing had slowed to once per hour. His heartbeat, once per minute.

On the three hundredth day, the cats began to teach him.

Not through words - cats don't speak the human tongue. But through purrs that resonated with the mountain itself. Through the warmth that seeped into his frozen bones. Through the simple, profound truth of being present.

On the five hundredth day, Scott understood that stillness wasn't the absence of motion. It was the presence of everything else.

On the seven hundredth day, cultivators began to journey to the mountain. They came seeking the Immovable Master. They found a man covered in cats, snow, and contentment.

On the nine hundredth day, Gerald arrived.

"I'm founding a sect," Gerald said. "We boop cat snoots. You seem qualified."

Scott considered this for a hundred days.

"...Okay," he finally said. "But I'm not standing up to leave. Someone will have to carry me."

It took all six other masters to lift him. The cats came too, of course.

To this day, Scott rarely moves unless absolutely necessary. His power comes not from action, but from the accumulated energy of a thousand days of perfect stillness - and the cats who taught him what stillness truly means.

"I am the mountain," Scott often says. "The cats are my snow."

Then he goes back to not moving for another six hours.

Worth it, apparently.`,
      unlockedBy: { afkHours: 100, masterPlaytime: { scott: 10 } },
      rewards: { technique: 'mountain_stillness', cat: 'meditation_cat', title: 'Disciple of Stillness' }
    },

    gerald_origin: {
      id: 'gerald_origin',
      title: 'The Snoot Scrolls',
      fragments: 10,
      story: `Before Gerald found the Snoot Scrolls, he was nobody.

A wandering cultivator with no sect, no master, no future. His jade palm technique was self-taught and considered "unorthodox" by the major schools. He survived on odd jobs and the kindness of strangers.

Then came the dream.

A cat made of starlight appeared before him, its snoot glowing with cosmic energy. It spoke without words, directly into Gerald's soul:

"The snoots call out in darkness. Who will answer?"

Gerald woke in a cave he didn't remember entering. Before him lay seven scrolls, each depicting a different technique for the sacred art of snoot-booping. The first scroll was Jade Palm - his own technique, but perfected beyond anything he'd imagined.

The other six were blank.

"Fill them," the starlight cat's voice echoed in his mind. "Find the masters. Build the Sect. And boop... boop every snoot."

Gerald emerged from that cave a changed man. He had a purpose now. A destiny.

It took ten years to find all seven masters. Ten years of wandering, fighting, and endless snoot-booping. Each master he recruited filled another scroll with their unique technique.

But the seventh scroll? That one remains blank to this day.

"It's for the Eighth Master," Gerald says when asked. "They haven't revealed themselves yet."

Some say the Eighth Master is a legend. Others say they're already among us. Gerald simply smiles and continues his training.

"The Sect does not rush destiny," he says. "It only boops what snoots present themselves."

The Snoot Scrolls remain in the Sect library, available for all disciples to study. All except the seventh.

That one waits.`,
      unlockedBy: { masterPlaytime: { gerald: 20 }, loreFragments: 10 },
      rewards: { technique: 'founders_wisdom', title: 'Keeper of the Scrolls' }
    }
  },

  // === WAIFU LORE ===
  waifus: {
    mochi_secret: {
      id: 'mochi_secret',
      title: "The Warrior's Tea",
      fragments: 10,
      story: `Few know that Mochi-chan was once a fierce warrior.

Before she became the Welcoming Dawn, keeper of the Celestial Teahouse, she was known as Mochi the Crimson. Her tea-serving skills were actually combat techniques, refined over a decade of battle.

The way she pours from three feet above the cup? That's a precision strike technique.
The grace with which she carries a dozen cups? Balance training from walking on sword blades.
Her welcoming smile? Originally designed to unsettle opponents before a duel.

She doesn't talk about why she left that life. The scars hidden beneath her sleeves tell part of the story. The way she flinches at loud noises tells more.

But one night, when her bond with you has grown deep enough, she shares the truth.

"I hurt people," she whispers, her usual cheerfulness replaced with something raw. "I was good at it. The best, some said. But one day I served tea to a child whose parents I had... I..."

She can't finish. You don't make her.

"I decided then," she continues eventually, "that I would only use my skills to bring comfort. Every cup of tea is an apology. Every warm welcome, a prayer for forgiveness."

She looks at you with eyes that have seen too much.

"Do you still want my tea, knowing what these hands have done?"

The question isn't really about tea. You both know that.

How you answer determines everything.`,
      unlockedBy: { waifuBond: { mochi: 100 } },
      rewards: { technique: 'warriors_tea', cosmetic: 'crimson_teacup', waifuOutfit: 'mochi_warrior' }
    },

    luna_past: {
      id: 'luna_past',
      title: 'Why She Watches the Night',
      fragments: 12,
      story: `Luna doesn't sleep because she fears the dreams.

The Midnight Watcher earned her title through necessity, not choice. Every time she closes her eyes, she sees it again: the village where she grew up, consumed by shadows. The faces of those she couldn't save. The creature that emerged from the darkness, wearing her sister's smile.

"I was the only one who escaped," she tells you one moonlit night, her usual sleepiness replaced by haunting clarity. "Because I was the only one awake. I had insomnia as a child. A curse, I thought. Turned out to be a blessing."

She cultivated her Yin Energy Arts not to gain power, but to fight the darkness on its own terms. To enter the realm between waking and sleeping, where nightmares dwell, and hunt them there.

"Every night, while the world sleeps, I patrol the borders of dreams. I find the nightmares before they find others. I... consume them."

She shows you her true form then - not the sleepy, gentle soul you know, but something vast and luminous. A being of moonlight and shadow, eternally vigilant.

"It's why I'm always tired," she admits, shrinking back to her normal self. "Fighting nightmares every night for two hundred years is... exhausting."

"Two hundred?!"

"I don't age while I'm awake. Another curse. Another blessing. I've watched so many friends grow old while I..."

She trails off into one of her characteristic yawns.

"That's why I cherish every moment with you. Because I know... I'll remember you. Forever. Long after..."

She falls asleep mid-sentence, as she often does.

But now you understand: she's not lazy. She's saving her energy for the endless war she fights while you dream safely.

Every night, Luna protects you from the darkness.

The least you can do is let her nap on your shoulder.`,
      unlockedBy: { waifuBond: { luna: 100 }, afkHours: 50 },
      rewards: { technique: 'moonlight_vigil', cat: 'nightmare_hunter', waifuOutfit: 'luna_guardian' }
    },

    nyanta_treasure: {
      id: 'nyanta_treasure',
      title: 'The Real Treasure',
      fragments: 8,
      story: `Captain Nyanta sailed the seven seas seeking gold, but found something far more valuable.

Her legend began with greed. The most feared pirate in the Jade Ocean, she accumulated wealth beyond imagination. Temples full of gold. Mountains of spirit stones. Artifacts that kingdoms would wage war for.

And she was miserable.

"It's a curse, you know," she tells you one evening, her usual boisterous demeanor softened by rum and honesty. "The more treasure you acquire, the more you realize it means nothing. I had everything. I had nothing."

The turning point came when she found an island that wasn't on any map. There, in a cave that shouldn't exist, she discovered... a cat.

Just an ordinary tabby, abandoned on that impossible shore.

"I went in looking for the legendary Jade Dragon's hoard," she laughs. "And all I found was this mangy little furball. No gold. No artifacts. Just one hungry, scared cat."

She carried that cat back to her ship. Named it First Mate Whiskers. And everything changed.

"Cats don't care about gold," she realized. "They care about warmth, and food, and someone who'll scratch behind their ears. All my treasure couldn't buy what that cat gave me freely."

She disbanded her crew, gave away her wealth, and founded the first cat rescue in the Jade Ocean. The ship that once terrorized merchants now roamed the seas, rescuing stray cats from every port.

"The Sea Sovereign, they call me now. But I'm just a taxi service for snoots."

First Mate Whiskers passed away thirty years ago. Nyanta still keeps the collar.

"The real treasure," she says whenever anyone asks about her past, "was the cats we adopted along the way."

She's not wrong.`,
      unlockedBy: { waifuBond: { nyanta: 100 }, catsCollected: 75 },
      rewards: { technique: 'treasure_heart', cat: 'pirate_tabby', title: 'True Treasure Hunter' }
    },

    grandmother_wisdom: {
      id: 'grandmother_wisdom',
      title: 'The First Watcher',
      fragments: 15,
      story: `Grandmother Whiskers is older than the Sect.

Older than the Seven Masters. Older than the Snoot Scrolls themselves. She was ancient when the first cultivators learned that cats possessed spiritual significance.

"I've had many names," she says, her wrinkled features shifting in the lamplight. "The First Watcher. The Eternal Grandmother. She Who Saw the First Boop."

Wait. The First Boop?

"Oh yes, child. I was there. Before humans learned cultivation, before the concept of Qi entered mortal understanding, a single proto-human touched a single proto-cat's snoot. The resonance of that moment created the first spiritual energy in the universe."

She pours tea with hands that have poured tea for gods.

"Everything - cultivation, magic, even the Jianghu itself - traces back to that one boop. I witnessed it. I've spent eternity trying to recreate that perfect, pure moment."

"Why tell me this?"

Her ancient eyes meet yours, and for a moment you see something vast behind them. Galaxies. Eternities. Countless snoots, booped across infinite timelines.

"Because you, child, have come closer than anyone in millennia. Your booping... it reminds me of that first touch. Pure intention. Pure joy. No seeking of power or wealth. Just the simple desire to make a cat happy."

She smiles, and centuries fall away from her face.

"The Eighth Master will reveal themselves when someone achieves what I've been seeking. The Perfect Boop. The one that echoes that primordial moment."

"And then?"

"And then, child... everything changes."

She won't say more. But now you understand why she watches you so carefully.

You might be the one she's been waiting for.`,
      unlockedBy: { waifuBond: { grandmother: 100 }, totalBoops: 100000, loreFragments: 30 },
      rewards: { technique: 'primordial_touch', cat: 'ancient_witness', title: 'Seeker of the First Boop' }
    }
  },

  // === SECT LORE ===
  sect: {
    founding_story: {
      id: 'founding_story',
      title: 'Birth of the Celestial Snoot Sect',
      fragments: 8,
      story: `The Celestial Snoot Sect was not planned. It emerged, like all true spiritual movements, from a single act of compassion.

Gerald sat in the ruins. Rusty sat beside him. Between them, a stray cat purred contentedly.

"We should do something about this," Gerald said.

"About what?"

"About... all of it. The strays. The fighting. The endless competition between sects over power that doesn't matter. What if we built something different?"

Rusty laughed. "A sect for cats? They'd laugh us out of the Jianghu."

"Let them laugh. We'd have cats. And each other. And..." Gerald reached out, gently touching the tabby's snoot. "This feeling. This simple joy."

The cat chirped.

"What would we even call it?"

Gerald looked up at the sky, where celestial energies swirled in patterns only cultivators could see.

"The Celestial Snoot Sect. Dedicated to the proposition that every snoot deserves a boop, and every cat deserves a home."

Rusty considered this. Then he booped the cat's snoot too.

"...I'm in."

Within a year, five more masters had joined. Within five years, they had rescued their thousandth cat. Within a decade, the Celestial Snoot Sect was the most talked-about cultivation school in the Jianghu.

Not for their power. Not for their techniques.

For their happiness.

In a world of endless struggle and bitter competition, they had found another way. A way of snoots. A way of cats. A way of joy.

"The Sect does not seek power," Gerald still says at every initiation. "It seeks contentment. All else follows naturally."

And somehow, impossibly, it does.`,
      unlockedBy: { playtimeHours: 10, catsCollected: 25 },
      rewards: { title: 'Sect Historian', cosmetic: 'founders_medallion' }
    },

    eighth_master_mystery: {
      id: 'eighth_master_mystery',
      title: 'The Eighth Master',
      fragments: 20,
      story: `The Seven Masters know the truth.

There was always supposed to be eight.

The Snoot Scrolls number seven, but the space in the Sect's great hall has always had room for eight meditation cushions. Gerald sets a place at the table for eight. The founding documents reference "the Celestial Eight."

"The Eighth Master will reveal themselves when the time is right," Gerald always says when asked.

But the other masters have their own theories:

Rusty believes the Eighth Master is a legendary warrior, waiting to emerge when the Sect faces its greatest battle.

Steve has calculated seventeen thousand possible identities for the Eighth Master, but admits his data is incomplete.

Andrew claims to have seen the Eighth Master once, in a blur of movement too fast for anyone else to perceive.

Nik says nothing, but his shadow sometimes seems to bow toward an empty corner of the room.

Yuelin senses another presence in the Sect, one that moves through the bonds between all living things.

Scott hasn't offered a theory. He's been meditating on the question for six years and hasn't moved since.

The truth? The truth is stranger than any of them imagine.

The Eighth Master is not hidden. The Eighth Master is not waiting.

The Eighth Master is being created.

Every boop, every rescued cat, every moment of joy in the Sect... it all feeds into something. Someone. A being of accumulated positive energy, slowly coalescing into existence.

When enough snoots have been booped with enough love, the Eighth Master will emerge fully formed. Not from hiding, but from the collective spirit of the Sect itself.

They are the sum of every happy cat. The embodiment of every master's hopes. The physical manifestation of what the Celestial Snoot Sect truly represents.

And they're almost ready.`,
      unlockedBy: { totalBoops: 1000000, allMastersPlayed: true, heavenlySeals: 100 },
      rewards: { unlock: 'eighth_master', title: 'Witness to the Eighth', technique: 'unity_of_eight' }
    },

    primordial_snoot: {
      id: 'primordial_snoot',
      title: 'The Primordial Snoot',
      fragments: 25,
      story: `Before time, before space, before the first cat purred...

There was the Primordial Snoot.

Not a cat's snoot, for cats did not yet exist. Not a physical snoot, for matter had not yet condensed from the cosmic void. The Primordial Snoot was an idea - the platonic form of all snoots to come.

And it waited to be booped.

The first Boop - the one Grandmother Whiskers witnessed - was not the beginning. It was a echo. A reflection of an event that happened before events were possible.

Something, somewhere, somewhen, booped the Primordial Snoot.

The resulting resonance created everything. The Big Bang, cultivators now understand, was simply a very enthusiastic boop echoing through eternity.

Every snoot that has ever existed carries within it a fragment of the Primordial Snoot. Every boop performed is a pale imitation of that first, perfect touch. Cultivation itself is merely the process of bringing oneself closer to that primordial moment.

The highest levels of enlightenment don't grant power or immortality. They grant understanding.

Understanding that we are all, in some way, seeking to recreate the first Boop. That the universe exists because someone, something, couldn't resist touching that cute little snoot.

The Celestial Snoot Sect's ultimate goal, known only to its most senior members, is not world peace or universal salvation.

It's to boop the Primordial Snoot again.

To touch the source of all existence.

To see if, perhaps, the universe will boop back.

"All snoots lead to the Primordial," Gerald writes in his secret journals. "All boops are practice for the ultimate touch. And one day..."

The entry ends there. Even Gerald doesn't know how to finish that sentence.

But he keeps booping. They all do.

Because somewhere, in the infinite void before creation, the Primordial Snoot still waits.

And it's very, very cute.`,
      unlockedBy: { transcendence: true, allLoreCollected: true },
      rewards: { unlock: 'true_ending', title: 'Seeker of the Primordial', cosmetic: 'primordial_aura' }
    }
  }
};

// ===================================
// LORE SYSTEM CLASS
// ===================================

class LoreSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.collectedFragments = {};
    this.unlockedStories = [];
    this.fragmentDropChance = 0.01; // 1% per boop
    this.stats = {
      totalFragmentsFound: 0,
      storiesUnlocked: 0,
      lastFragmentTime: null
    };
  }

  /**
   * Check for a fragment drop on boop
   * @returns {Object|null} Fragment info if dropped, null otherwise
   */
  checkForFragmentDrop() {
    if (Math.random() > this.fragmentDropChance) {
      return null;
    }

    // Find eligible lore entries
    const eligible = this.getEligibleLoreEntries();
    if (eligible.length === 0) {
      return null;
    }

    // Pick random entry
    const entry = eligible[Math.floor(Math.random() * eligible.length)];

    // Add fragment
    if (!this.collectedFragments[entry.id]) {
      this.collectedFragments[entry.id] = 0;
    }
    this.collectedFragments[entry.id]++;
    this.stats.totalFragmentsFound++;
    this.stats.lastFragmentTime = Date.now();

    // Check if complete
    if (this.collectedFragments[entry.id] >= entry.data.fragments) {
      this.unlockStory(entry.id, entry.data);
      return {
        entryId: entry.id,
        current: this.collectedFragments[entry.id],
        required: entry.data.fragments,
        title: entry.data.title,
        category: entry.category,
        completed: true
      };
    }

    return {
      entryId: entry.id,
      current: this.collectedFragments[entry.id],
      required: entry.data.fragments,
      title: entry.data.title,
      category: entry.category,
      completed: false
    };
  }

  /**
   * Get all lore entries the player can currently find fragments for
   * @returns {Array} Eligible entries
   */
  getEligibleLoreEntries() {
    const eligible = [];

    for (const [category, entries] of Object.entries(LORE_ENTRIES)) {
      for (const [id, data] of Object.entries(entries)) {
        // Skip already unlocked stories
        if (this.unlockedStories.includes(id)) {
          continue;
        }

        // Check if player meets unlock conditions
        if (this.meetsUnlockCondition(data.unlockedBy)) {
          eligible.push({ id, data, category });
        }
      }
    }

    return eligible;
  }

  /**
   * Check if player meets the unlock condition for a lore entry
   * @param {Object} condition - Unlock condition object
   * @returns {boolean} Whether condition is met
   */
  meetsUnlockCondition(condition) {
    if (!condition) return true;

    const state = this.gameState;

    // Check total boops
    if (condition.boops && (state.totalBoops || 0) < condition.boops) {
      return false;
    }

    // Check goose boops
    if (condition.gooseBoops && (state.gooseBoops || 0) < condition.gooseBoops) {
      return false;
    }

    // Check cats collected
    if (condition.catsCollected) {
      const catCount = state.cats?.length || state.catsRecruited || 0;
      if (catCount < condition.catsCollected) {
        return false;
      }
    }

    // Check pagoda floor
    if (condition.pagodaFloor) {
      const floor = state.highestPagodaFloor || state.pagoda?.highestFloor || 0;
      if (floor < condition.pagodaFloor) {
        return false;
      }
    }

    // Check specific waifu bond
    if (condition.waifuBond) {
      for (const [waifuId, requiredBond] of Object.entries(condition.waifuBond)) {
        const currentBond = state.waifuBonds?.[waifuId] || 0;
        if (currentBond < requiredBond) {
          return false;
        }
      }
    }

    // Check AFK hours
    if (condition.afkHours) {
      const afkMs = state.totalAfkTime || 0;
      const afkHours = afkMs / (1000 * 60 * 60);
      if (afkHours < condition.afkHours) {
        return false;
      }
    }

    // Check meditation hours
    if (condition.meditationHours) {
      const meditationMs = state.totalMeditationTime || 0;
      const meditationHours = meditationMs / (1000 * 60 * 60);
      if (meditationHours < condition.meditationHours) {
        return false;
      }
    }

    // Check play time with specific masters
    if (condition.playBoth) {
      const requiredHours = condition.hoursEach || 5;
      for (const masterId of condition.playBoth) {
        const playTimeMs = state.masterPlaytime?.[masterId] || 0;
        const playTimeHours = playTimeMs / (1000 * 60 * 60);
        if (playTimeHours < requiredHours) {
          return false;
        }
      }
    }

    // Check specific master playtime
    if (condition.masterPlaytime) {
      for (const [masterId, requiredHours] of Object.entries(condition.masterPlaytime)) {
        const playTimeMs = state.masterPlaytime?.[masterId] || 0;
        const playTimeHours = playTimeMs / (1000 * 60 * 60);
        if (playTimeHours < requiredHours) {
          return false;
        }
      }
    }

    // Check total playtime hours
    if (condition.playtimeHours) {
      const playtimeMs = state.totalPlaytime || 0;
      const playtimeHours = playtimeMs / (1000 * 60 * 60);
      if (playtimeHours < condition.playtimeHours) {
        return false;
      }
    }

    // Check lore fragments collected
    if (condition.loreFragments) {
      if (this.stats.totalFragmentsFound < condition.loreFragments) {
        return false;
      }
    }

    // Check heavenly seals
    if (condition.heavenlySeals) {
      if ((state.heavenlySeals || 0) < condition.heavenlySeals) {
        return false;
      }
    }

    // Check all masters played
    if (condition.allMastersPlayed) {
      const masters = ['gerald', 'rusty', 'steve', 'andrew', 'nik', 'yuelin', 'scott'];
      for (const masterId of masters) {
        if (!(state.masterPlaytime?.[masterId] > 0)) {
          return false;
        }
      }
    }

    // Check transcendence
    if (condition.transcendence) {
      if (!state.transcendenceUnlocked && !state.hasTranscended) {
        return false;
      }
    }

    // Check all lore collected
    if (condition.allLoreCollected) {
      const totalEntries = this.getTotalLoreEntryCount();
      if (this.unlockedStories.length < totalEntries - 1) { // -1 for this entry itself
        return false;
      }
    }

    return true;
  }

  /**
   * Unlock a story when all fragments are collected
   * @param {string} id - Lore entry ID
   * @param {Object} data - Lore entry data
   */
  unlockStory(id, data) {
    if (this.unlockedStories.includes(id)) {
      return;
    }

    this.unlockedStories.push(id);
    this.stats.storiesUnlocked++;

    // Send notification
    if (this.gameState.notifications?.push) {
      this.gameState.notifications.push({
        type: 'lore_unlocked',
        title: `Lore Unlocked: ${data.title}`,
        message: 'Visit the Codex to read the full story!',
        rewards: data.rewards
      });
    }

    // Apply rewards
    if (data.rewards) {
      this.applyRewards(data.rewards);
    }
  }

  /**
   * Apply rewards from completing a lore entry
   * @param {Object} rewards - Rewards object
   */
  applyRewards(rewards) {
    const state = this.gameState;

    if (rewards.jadeCatnip) {
      state.jadeCatnip = (state.jadeCatnip || 0) + rewards.jadeCatnip;
    }

    if (rewards.gooseFeathers) {
      state.gooseFeathers = (state.gooseFeathers || 0) + rewards.gooseFeathers;
    }

    if (rewards.cosmetic) {
      state.cosmeticsOwned = state.cosmeticsOwned || [];
      if (!state.cosmeticsOwned.includes(rewards.cosmetic)) {
        state.cosmeticsOwned.push(rewards.cosmetic);
      }
    }

    if (rewards.technique) {
      state.unlockedTechniques = state.unlockedTechniques || [];
      if (!state.unlockedTechniques.includes(rewards.technique)) {
        state.unlockedTechniques.push(rewards.technique);
      }
    }

    if (rewards.title) {
      state.unlockedTitles = state.unlockedTitles || [];
      if (!state.unlockedTitles.includes(rewards.title)) {
        state.unlockedTitles.push(rewards.title);
      }
    }

    if (rewards.cat) {
      state.catsToUnlock = state.catsToUnlock || [];
      state.catsToUnlock.push(rewards.cat);
    }

    if (rewards.unlock) {
      state.unlocked = state.unlocked || {};
      state.unlocked[rewards.unlock] = true;
    }

    if (rewards.waifuOutfit) {
      state.waifuOutfits = state.waifuOutfits || [];
      if (!state.waifuOutfits.includes(rewards.waifuOutfit)) {
        state.waifuOutfits.push(rewards.waifuOutfit);
      }
    }

    if (rewards.loreFragment) {
      state.specialLoreFragments = state.specialLoreFragments || [];
      state.specialLoreFragments.push(rewards.loreFragment);
    }
  }

  /**
   * Get fragments collected for a specific entry
   * @param {string} entryId - Lore entry ID
   * @returns {number} Fragments collected
   */
  getCollectedFragments(entryId) {
    return this.collectedFragments[entryId] || 0;
  }

  /**
   * Get all unlocked stories
   * @returns {Array} Unlocked story IDs
   */
  getUnlockedStories() {
    return [...this.unlockedStories];
  }

  /**
   * Get the full story data for an unlocked entry
   * @param {string} entryId - Lore entry ID
   * @returns {Object|null} Story data or null if not unlocked
   */
  getStoryData(entryId) {
    if (!this.unlockedStories.includes(entryId)) {
      return null;
    }

    for (const [category, entries] of Object.entries(LORE_ENTRIES)) {
      if (entries[entryId]) {
        return { ...entries[entryId], category };
      }
    }

    return null;
  }

  /**
   * Get total count of lore entries
   * @returns {number} Total entries
   */
  getTotalLoreEntryCount() {
    let count = 0;
    for (const entries of Object.values(LORE_ENTRIES)) {
      count += Object.keys(entries).length;
    }
    return count;
  }

  /**
   * Get lore progress summary
   * @returns {Object} Progress summary
   */
  getProgress() {
    const total = this.getTotalLoreEntryCount();
    const unlocked = this.unlockedStories.length;
    const eligible = this.getEligibleLoreEntries().length;
    const inProgress = Object.keys(this.collectedFragments).filter(
      id => !this.unlockedStories.includes(id)
    ).length;

    return {
      total,
      unlocked,
      eligible,
      inProgress,
      totalFragments: this.stats.totalFragmentsFound,
      percentComplete: Math.floor((unlocked / total) * 100)
    };
  }

  /**
   * Serialize for save
   * @returns {Object} Serialized data
   */
  serialize() {
    return {
      collectedFragments: this.collectedFragments,
      unlockedStories: this.unlockedStories,
      stats: this.stats
    };
  }

  /**
   * Deserialize from save
   * @param {Object} data - Saved data
   */
  deserialize(data) {
    if (!data) return;

    this.collectedFragments = data.collectedFragments || {};
    this.unlockedStories = data.unlockedStories || [];
    this.stats = data.stats || {
      totalFragmentsFound: 0,
      storiesUnlocked: 0,
      lastFragmentTime: null
    };
  }

  /**
   * Reset for prestige (preserves unlocked stories)
   */
  reset() {
    // Keep unlocked stories as permanent progress
    // Reset fragment collection progress
    this.collectedFragments = {};
    this.stats.lastFragmentTime = null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LORE_ENTRIES, LoreSystem };
}

// Also make available globally
window.LORE_ENTRIES = LORE_ENTRIES;
window.LoreSystem = LoreSystem;

console.log('Snoot Booper: lore.js loaded - "Every cat has a tale. Every master, a secret."');
