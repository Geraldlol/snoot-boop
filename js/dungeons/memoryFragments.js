/**
 * memoryFragments.js - Memory Fragments Dungeon System
 * "Every cat has a tale. Every master, a secret."
 *
 * Short story-driven dungeons that unlock lore pieces about
 * the Seven Masters, the Waifus, and hidden secrets of the Sect.
 */

// ============================================
// LORE ENTRIES - Full stories for each character
// ============================================
const LORE_ENTRIES = {
  // === GERALD - THE JADE PALM ===
  gerald_founding: {
    id: 'gerald_founding',
    title: 'The Founding',
    masterId: 'gerald',
    fragments: 5,
    fullText: `
In the twilight years of the old dynasty, a young scholar named Gerald wandered the Jianghu,
seeking purpose in a world torn by conflict.

He had studied the ancient arts, mastered the flowing scripts, yet felt empty. The prestigious
academies valued power over wisdom, strength over compassion.

One evening, sheltering from a storm in a forgotten temple, Gerald discovered the Snoot Scrolls
hidden behind a crumbling statue of the Cat Deity. The scrolls spoke not of warfare or dominion,
but of harmony - of finding balance through the simple act of connecting with another soul.

"Every snoot holds the universe," the scrolls declared. "To boop is to acknowledge. To acknowledge
is to love. To love is to cultivate the highest truth."

Gerald laughed at first. Then he wept. Then he understood.

That night, a stray cat wandered into the temple. Gerald reached out, touching its nose gently.
In that moment, he felt a rush of Qi unlike anything his masters had taught him.

The Celestial Snoot Sect was born not from ambition, but from a single, gentle boop.
    `,
    reward: { lore: true, jadeCatnip: 500 }
  },

  gerald_burden: {
    id: 'gerald_burden',
    title: 'The Weight of Leadership',
    masterId: 'gerald',
    fragments: 7,
    fullText: `
The Sect grew faster than Gerald anticipated. Word spread of the strange cultivation method
that required no violence, no competition, only compassion.

Six extraordinary individuals found their way to him. Rusty, fleeing his violent past. Steve,
seeking meaning beyond mere calculation. Andrew, tired of running without purpose. Nik,
emerging from shadows that had consumed him. Yuelin, hearing whispers that led her true.
Scott, awakening from a meditation that lasted a thousand days.

Gerald saw them not as disciples, but as equals. "I am not your master," he told them.
"The cats are our masters. I am merely the one who found the scrolls first."

But leadership carries weight whether one seeks it or not. When the Imperial Court demanded
the Sect demonstrate its power, Gerald faced a choice: prove worth through combat, or be
destroyed.

He chose a third path.

Standing before the Emperor himself, Gerald simply... booped the royal cat.

The feline, notoriously hostile to all who approached, began to purr.

The Emperor, for the first time in decades, smiled.

"This sect," the Emperor declared, "shall be under my protection. Any who harm them answer to me."

Gerald bowed low, hiding the tears in his jade-green eyes. The weight had not lessened.
But now, he did not carry it alone.
    `,
    reward: { lore: true, technique: 'leaders_resolve' }
  },

  gerald_secret: {
    id: 'gerald_secret',
    title: 'The Eighth Scroll',
    masterId: 'gerald',
    fragments: 10,
    unlockCondition: { allMasterLoreComplete: true },
    fullText: `
There were not seven Snoot Scrolls, as Gerald always claimed.

There were eight.

The eighth scroll spoke of something Gerald dared not share with his friends. It prophesied
that one day, a cultivator would arise who could boop the Ultimate Snoot - a celestial cat
whose nose, when touched, would grant the power to reshape reality itself.

But the scroll also warned: "The one who seeks the Ultimate Snoot for power shall unmake
themselves. Only one who seeks it for love shall find it."

Gerald hid the eighth scroll in a place only he knew. He watched his friends grow stronger,
watched the Sect flourish, and every night, he wondered: which of them might one day seek
the Ultimate Snoot? And would they seek it for the right reasons?

He suspected one of them already knew.

The Eighth Master.

The one who had been there since the beginning.

The one Gerald had erased from every record.

The one who still watched from the shadows, waiting.

But that... is a story for another time.
    `,
    reward: { lore: true, cat: 'memory_jade_cat', unlocksEighthMasterHint: true }
  },

  // === RUSTY - THE CRIMSON FIST ===
  rusty_redemption: {
    id: 'rusty_redemption',
    title: 'The Redemption',
    masterId: 'rusty',
    fragments: 5,
    fullText: `
Before he was the Crimson Fist, Rusty was the Crimson Terror.

Leader of the most feared bandit clan in the northern territories, he had earned his name
from the blood that stained his hands. Gold, power, respect through fear - these were all
he knew.

Then came the winter of his thirty-third year.

His clan ambushed a traveling merchant caravan. Standard work. Easy prey. But as Rusty's
blade descended upon the lead wagon, he heard a sound that stopped him cold.

Mewing.

A cat, injured, protecting a litter of kittens hidden beneath the merchant's seat. Despite
its wounds, despite certain death, it refused to flee. It stood its ground, tiny and
trembling, between Rusty and the innocent lives behind it.

Something broke inside him. Or perhaps, something healed.

Rusty sheathed his blade. "Take what you want," he told his confused followers. "Leave
the cats."

He stayed behind as the others moved on. He tended to the wounded cat. He found homes for
each kitten in nearby villages.

And when the Imperial soldiers came to arrest him three days later, he did not resist.

"I deserve death," he told the magistrate.

"Perhaps," the magistrate replied. "But a strange scholar named Gerald has petitioned for
your release. He says there's another path for you."

Rusty laughed bitterly. "What could a scholar offer a murderer?"

The magistrate slid a single document across the table.

On it was written: "EVERY SNOOT DESERVES A CHANCE."

For the first time in thirty-three years, Rusty wept.
    `,
    reward: { lore: true, jadeCatnip: 500 }
  },

  rusty_fury: {
    id: 'rusty_fury',
    title: 'The Thousand Boop Barrage',
    masterId: 'rusty',
    fragments: 7,
    fullText: `
"You're holding back," Gerald observed during training.

Rusty grunted, sweat dripping from his brow. He had been practicing the basic boop technique
for three months. Every other master had advanced to intermediate forms. He remained stuck.

"I'm afraid," Rusty admitted. "When I strike... I remember what these hands have done.
I'm afraid the violence is all I am."

Gerald sat beside him. For a long moment, neither spoke.

"Your passion is not your enemy," Gerald finally said. "It is your gift. The problem
was never your intensity - it was your direction."

"What do you mean?"

"A river can flood a village or power a mill. The water is the same. Only the channel
differs." Gerald stood, whistling softly. A dozen cats appeared from various hiding
spots around the training ground.

"Boop them all," Gerald commanded. "As fast as you can. Don't hold back."

Rusty hesitated.

"BOOP!" Gerald shouted.

Something snapped. Rusty moved - truly moved - for the first time since joining the Sect.
His hands were blurs of crimson energy, touching snoot after snoot after snoot. The cats,
far from frightened, began purring so loudly the building trembled.

When he stopped, exactly one thousand boops later, Rusty stood surrounded by ecstatic
felines all demanding more attention.

"The Thousand Boop Barrage," Gerald said, grinning. "I knew you had it in you."

Rusty looked at his hands. They were still deadly. But now, they were also gentle.

"I think," Rusty said slowly, "I understand."

"EXCELLENT!" Gerald clapped his back. "Now do it again. Faster."

"THOUSAND BOOP BARRAGE!" Rusty bellowed, and the cats rejoiced.
    `,
    reward: { lore: true, technique: 'crimson_compassion' }
  },

  rusty_legacy: {
    id: 'rusty_legacy',
    title: 'The General\'s Heart',
    masterId: 'rusty',
    fragments: 8,
    fullText: `
Years later, when the Sect faced its greatest crisis, it was Rusty who stepped forward.

A rival sect had declared war. Not for territory or resources, but out of pure spite.
They could not understand the Celestial Snoot Sect's philosophy and hated what they
could not comprehend.

"Let me handle this," Rusty said.

"No violence," Gerald reminded him.

"I know." Rusty cracked his knuckles. "Trust me."

He walked alone into the enemy camp. Five hundred warriors surrounded him, blades drawn.

"I am Rusty, the Crimson Fist," he announced. "Formerly the Crimson Terror. I have
killed more men than you have soldiers in this camp. And I am here to tell you..."

He reached into his coat.

The warriors tensed.

Rusty pulled out... a kitten.

"...that this little one needs a home. Any volunteers?"

For the next three hours, Rusty stood in the middle of five hundred confused warriors,
letting them pet a kitten while telling them stories of the Sect.

By morning, the rival sect had disbanded.

"How?" Gerald asked, incredulous.

Rusty shrugged. "Turns out most of them just wanted something to care about. The kitten
helped them remember that."

"And if they had attacked?"

Rusty's eyes went cold for just a moment. "They would have learned that my Thousand
Boop Barrage works on people too. Just... less gently."

Gerald sighed. "You're terrifying."

"Only when I have to be." Rusty grinned. "Now, who wants more kittens? I found a whole
litter behind their armory."

Twenty-three warriors adopted cats that day.

The war ended before it began.
    `,
    reward: { lore: true, cat: 'memory_crimson_cat' }
  },

  // === STEVE - THE FLOWING RIVER ===
  steve_optimization: {
    id: 'steve_optimization',
    title: 'The Calculation',
    masterId: 'steve',
    fragments: 5,
    fullText: `
Steve had calculated everything.

The optimal angle of approach to a snoot. The ideal pressure of a boop. The precise
frequency of purrs that indicated maximum happiness. He had charts. He had graphs.
He had a seventeen-page treatise on the thermodynamic efficiency of cat cuddling.

And yet, something was missing.

"Your technique is flawless," Gerald told him. "Your cats are well-cared for. Your
productivity is unmatched."

"But?"

"But the cats go to Yuelin when they're sad."

Steve's eye twitched. He had calculated everything. How could the cats prefer anyone else?

He observed Yuelin for a week. She had no system. She didn't track metrics. She simply...
sat with the cats. Hummed to them. Let them come to her in their own time.

Inefficient. Suboptimal. Completely illogical.

And yet, cats flocked to her.

Steve added a new variable to his calculations: Love.

It broke every formula he had ever written.

He spent a month trying to quantify it. Failed. Spent another month trying to optimize it.
Failed again. Finally, exhausted and desperate, he simply sat down next to a cat and
did nothing.

The cat climbed into his lap.

"I don't understand," Steve whispered.

The cat purred.

"That's not an answer."

The cat purred louder.

Steve, for the first time in his adult life, stopped calculating. He simply... was.

When he opened his eyes three hours later, he was surrounded by seventeen cats, all asleep.

"Ah," he said softly. "I think I understand now."

He still kept his charts. But they had a new section: "Unexplainable Variance (Love)."

It was always the largest column.
    `,
    reward: { lore: true, jadeCatnip: 500 }
  },

  steve_patience: {
    id: 'steve_patience',
    title: 'The Eternal Flow',
    masterId: 'steve',
    fragments: 7,
    fullText: `
"Teach me patience," Steve asked Scott one day.

Scott, who had not moved from his meditation spot in three days, slowly opened one eye.

"Why?"

"Because I've calculated that patience increases cultivation efficiency by 47.3% but
I cannot seem to achieve it naturally."

Scott closed his eye. "You just did."

"Did what?"

"Demonstrated impatience by trying to calculate patience."

Steve frowned. "That doesn't make sense."

"Exactly."

Days passed. Steve kept returning to Scott's rock, asking questions. Scott kept giving
answers that weren't really answers. Steve's frustration grew, then peaked, then...
disappeared.

One morning, Steve simply sat beside Scott's rock. Not asking. Not calculating. Just sitting.

A river flowed nearby. Steve watched it.

"The river doesn't hurry," he murmured.

"Mmm," Scott agreed.

"It doesn't calculate the optimal path. It simply flows around obstacles."

"Mmm."

"And yet it always reaches the sea."

"Mmm."

Steve closed his eyes. When he opened them, a full day had passed. He had achieved
perfect meditation for the first time.

"I understand," Steve said.

"Mmm."

"My cultivation will be like the river. I will not force it. I will let it flow."

"Mmm."

"Is 'Mmm' the only thing you're going to say?"

"Mmm."

Steve laughed - genuinely laughed - for the first time anyone could remember. "You
know what? That's a perfect answer."

His new technique - Eternal Flow - doubled the Sect's offline cultivation efficiency.

When asked how he achieved it, Steve simply smiled and said: "Mmm."
    `,
    reward: { lore: true, technique: 'river_patience' }
  },

  steve_truth: {
    id: 'steve_truth',
    title: 'The Strategist\'s Heart',
    masterId: 'steve',
    fragments: 8,
    fullText: `
Steve had a secret he told no one.

His calculations, his endless optimization, his obsession with efficiency - they were
not born from a love of numbers. They were born from fear.

As a child, Steve's family had lost everything due to a single miscalculation in their
merchant business. One wrong number, one small error, and they went from prosperity
to poverty overnight.

Young Steve swore he would never let that happen again. He would calculate everything.
Control everything. Leave nothing to chance.

It was a lonely way to live.

The Sect changed that.

Here, his calculations were valued but not essential. Here, people cared about him,
not just his usefulness. Here, a cat would sleep on his calculations and somehow that
was okay.

"You're crying," Gerald observed one night.

Steve wiped his eyes quickly. "Allergies."

"We don't have to pretend here."

Steve was silent for a long moment. Then: "I spent my whole life trying to eliminate
uncertainty. But the Sect is nothing but uncertainty. Cats are chaos incarnate. And
yet... I've never felt safer."

Gerald sat beside him. "That's because safety doesn't come from control. It comes
from trust."

"That's not logical."

"No. It's not."

Steve looked at the stars. "I think... I think I've been calculating the wrong things
my whole life."

"What should you calculate instead?"

Steve smiled. "How lucky I am to have found this place."

The math was simple: Seven friends. Infinite cats. One family.

That calculation always balanced perfectly.
    `,
    reward: { lore: true, cat: 'memory_river_cat' }
  },

  // === ANDREW - THE THUNDER STEP ===
  andrew_speed: {
    id: 'andrew_speed',
    title: 'The Runner',
    masterId: 'andrew',
    fragments: 5,
    fullText: `
Andrew was born running.

The midwife said she'd never seen a baby crawl so fast. By three, he was outpacing
adults. By ten, no horse could catch him. By twenty, he ran messages for the Imperial
Court faster than their best courier birds.

But speed without purpose is just running away.

"Why do you run?" Gerald asked him after witnessing Andrew's three-second lap of
the entire Sect grounds.

"Because I can."

"That's not an answer."

Andrew stopped - truly stopped - for perhaps the first time in years. "I... I don't
know how to stop. If I stop, I have to think. If I think, I have to feel. If I feel..."

"You have to face yourself."

Andrew looked away. "There's nothing to face. I'm just fast."

Gerald nodded. "Then race me."

"You?" Andrew laughed. "No offense, but you couldn't beat me in a hundred years."

"I didn't say a running race." Gerald pointed to a sleeping cat. "Whoever can get
that cat to come to them first, wins."

Andrew's smile faded. "That's... that's not the same."

"No. It isn't."

It took Andrew three hours. Three hours of sitting still, of waiting, of not running.
The cat eventually wandered over, curious about the unusual stillness.

"Congratulations," Gerald said. "You just discovered that sometimes, the fastest
way to reach something... is to let it come to you."

Andrew looked at the cat in his lap. He hadn't moved. The world hadn't ended.

Maybe stopping wasn't so bad after all.
    `,
    reward: { lore: true, jadeCatnip: 500 }
  },

  andrew_discovery: {
    id: 'andrew_discovery',
    title: 'Lightning Reflexes',
    masterId: 'andrew',
    fragments: 7,
    fullText: `
Andrew discovered his true purpose by accident.

He was running through the western mountains when he spotted something strange: a
cave that didn't appear on any map. His courier instincts screamed "shortcut!" His
new Sect training whispered "maybe investigate slowly."

He compromised. He investigated at medium speed.

Inside, he found a colony of cats that had never seen humans before. Wild, beautiful,
and extremely rare. Within hours, he had located three new species previously unknown
to cultivation science.

He raced back to tell Gerald, barely able to contain his excitement.

"Think about what your speed could accomplish," Gerald said after hearing the report.
"Not running away, not delivering messages, but discovering. You could find things
no one else can reach in time."

Andrew's eyes widened. "I could... I could find all the rare cats in the Jianghu."

"Among other things."

"I could be first to every event, every opportunity, every..."

"Now you understand."

Andrew grinned. "I'm not just fast. I'm Lightning Reflexes. I see opportunities
before anyone else because I reach them first!"

"That's the spirit."

Andrew practically vibrated with energy. "There's so much to find! New cats, new
techniques, new territories! I have to go!"

He vanished in a flash of golden light.

Gerald smiled. Some people found themselves by standing still.

Others found themselves by running toward something instead of away from it.

Andrew had finally found his direction.
    `,
    reward: { lore: true, technique: 'scouts_insight' }
  },

  andrew_heart: {
    id: 'andrew_heart',
    title: 'The Scout\'s Promise',
    masterId: 'andrew',
    fragments: 8,
    fullText: `
Andrew made a promise to himself after finding the mountain cats.

Every rare creature deserves to be found. Every lost cat deserves a home. Every
undiscovered corner of the Jianghu deserves to be explored.

He became the Sect's eyes. Moving too fast for danger to touch, he mapped territories
no one else dared approach. He rescued cats from floods, fires, and forgotten ruins.
He was first to every natural disaster, every strange occurrence, every hint of the
extraordinary.

But his greatest discovery wasn't a place or a cat.

It was a person.

In a village being evacuated during a volcanic eruption, Andrew found a child refusing
to leave. "My kitten is still inside!" she cried.

Andrew could have grabbed her and run. He would have been within his rights. The
volcano was minutes from erupting.

Instead, he ran into the collapsing building. Found the kitten. Ran out.

Made it with three seconds to spare.

"That was reckless," Steve said later, while patching Andrew's burns.

"Calculated risk," Andrew replied.

"That's my line."

"Well, I'm fast. I steal things before people notice."

Steve shook his head. "You could have died."

Andrew looked at the little girl reunited with her kitten. She was crying. Happy tears.

"Some things are worth slowing down for," Andrew said quietly. "I'm finally fast
enough to understand that."

Steve had no response to that.

Neither did anyone else.

Sometimes, the fastest man in the Jianghu was also the most patient when it truly
mattered.
    `,
    reward: { lore: true, cat: 'memory_thunder_cat' }
  },

  // === NIK - THE SHADOW MOON ===
  nik_shadows: {
    id: 'nik_shadows',
    title: 'The Shadow\'s Birth',
    masterId: 'nik',
    fragments: 5,
    fullText: `
...

Before the silence, there was screaming.

Nik doesn't remember much about his childhood. The pieces that remain are sharp,
jagged things he keeps locked away. A burning village. Running through smoke. Hands
reaching for him that he slipped away from.

The shadows welcomed him when no one else would.

He learned to move without sound, exist without presence, strike without warning.
The assassin guilds called him prodigy. The underworld called him ghost. He called
himself nothing.

Names were for people who existed.

Then, one night, his target was an old scholar in a dilapidated temple. Easy work.
Quick payment.

Nik materialized from the shadows, blade ready.

The scholar didn't flinch. "You move well," he said. "But you move without purpose."

Nik hesitated. Targets weren't supposed to speak to him.

"I am Gerald. I run a small sanctuary. Would you like some tea before you kill me?"

It was the strangest sentence Nik had ever heard.

"...why?"

"Because you look cold. And tired. And lonely."

Nik's blade trembled.

"I don't need your pity."

"It's not pity. It's tea."

Nik killed many people in his career. Gerald was not one of them.

He drank the tea.

He never left.
    `,
    reward: { lore: true, jadeCatnip: 500 }
  },

  nik_trust: {
    id: 'nik_trust',
    title: 'The Phantom Boop',
    masterId: 'nik',
    fragments: 7,
    fullText: `
Nik struggled with the basic techniques.

Not because he lacked skill - his precision was unmatched. Not because he lacked
speed - his strikes came faster than thought. The problem was simpler, sadder.

He couldn't bring himself to touch anything gently.

Every time he reached for a snoot, his body remembered: hands that grab, hands that
hurt, hands that end lives. His fingers would curl into claws instinctively. The cats
sensed his tension and fled.

"Try closing your eyes," Yuelin suggested one day.

"Closing my eyes makes me more aware of threats."

"There are no threats here."

"..."

Yuelin sat beside him. "You don't have to speak. I understand silence. But maybe...
maybe let the silence be soft for once?"

Nik had no response. But he didn't leave.

Days passed. Yuelin simply sat with him, asking nothing, expecting nothing. Sometimes
she hummed. Sometimes cats came to her, and by extension, sat near him.

One evening, a small kitten crawled into his lap.

His hands twitched toward his hidden blade.

Then stopped.

The kitten began to purr.

Nik's hands, slowly - so slowly - uncurled.

He touched the kitten's nose.

From the shadows, without violence, without fear.

A phantom boop.

A critical strike to his own heart's defenses.

He made no sound.

But Yuelin saw the tears.

And said nothing.

Some victories don't need words.
    `,
    reward: { lore: true, technique: 'shadows_embrace' }
  },

  nik_voice: {
    id: 'nik_voice',
    title: 'When the Shadow Speaks',
    masterId: 'nik',
    fragments: 10,
    fullText: `
Nik spoke exactly seven words in his first year at the Sect.

"Thank you." (To Gerald, for the tea.)

"Sorry." (To a cat he accidentally startled.)

"No." (To Rusty's offer of sparring.)

"...okay." (To Yuelin's invitation to sit in silence.)

The other masters learned to read his body language. A slight nod meant approval.
A raised eyebrow meant skepticism. Complete stillness meant danger - someone was
about to have a very bad day.

Then came the incident.

A group of bandits attempted to raid the Sect, thinking it an easy target. They had
heard stories of cat-cuddling pacifists and expected no resistance.

They did not expect Nik.

He appeared from nowhere, a shadow given form. But he did not strike them. He simply...
stood in their path.

And spoke.

"These snoots are under my protection."

It was the longest sentence any Sect member had heard from him.

"Move aside, shadow-man," the bandit leader laughed. "What can one person do against
thirty?"

Nik tilted his head slightly. "...watch."

He moved.

Thirty bandits lay unconscious before any could draw a weapon. Not one was seriously
harmed. Not one would remember how it happened.

But they would remember his words.

"Never return."

They never did.

That night, Gerald found Nik in his usual corner, silently petting a cat.

"You protected us," Gerald said.

"..."

"Thank you."

Nik was silent for a long moment. Then, barely audible: "...family."

Gerald smiled. Some words meant more when they came rarely.

From Nik, that single word meant everything.
    `,
    reward: { lore: true, cat: 'memory_shadow_cat' }
  },

  // === YUELIN - THE LOTUS SAGE ===
  yuelin_whispers: {
    id: 'yuelin_whispers',
    title: 'The Cat\'s Tongue',
    masterId: 'yuelin',
    fragments: 5,
    fullText: `
Yuelin heard the voices since birth.

Not human voices - those were simple, straightforward. No, Yuelin heard the other
voices. The ones that spoke in rustles and chirps and mews. The ones that carried
the thoughts of creatures without words.

Her family thought her mad. "Stop talking to animals," they scolded. "Stop pretending
they answer."

But they did answer. In ways only Yuelin could understand.

The village cats told her when storms approached. The birds warned her of travelers.
The dogs shared gossip better than any human.

And always, always, they told her: "There is a place for you. Keep listening. You
will hear the way."

Years of searching. Years of following whispered directions. Through mountains and
rivers and forests, guided by creatures that owed her nothing yet gave her everything.

Finally, a cat's voice louder than any before: "Here. The one who understands."

Yuelin looked up at a temple gate. A sign read: "Celestial Snoot Sect."

A man stood there, smiling. "The cats said you were coming."

"You... you hear them too?"

"No. But I've learned to trust their judgment."

Yuelin wept. "I thought I was alone."

"Never." Gerald's smile widened. "The cats told me to tell you: 'Welcome home, Sister
of the Whispers.'"

For the first time, the voices in Yuelin's head sang with joy instead of loneliness.

She had finally found her people.
    `,
    reward: { lore: true, jadeCatnip: 500 }
  },

  yuelin_harmony: {
    id: 'yuelin_harmony',
    title: 'Harmonious Aura',
    masterId: 'yuelin',
    fragments: 7,
    fullText: `
"Why are the cats happiest with you?" Steve asked one day, genuinely puzzled.

Yuelin considered the question. "I don't think they're happiest with me. I think
they're simply... themselves with me."

"That doesn't make sense."

"It makes perfect sense. To them, anyway."

She explained: most people projected expectations onto cats. They wanted the cat
to be cuddly, or playful, or calm. Cats sensed these expectations like pressure -
invisible but ever-present.

"I project nothing," Yuelin said. "I simply receive. Whatever the cat wishes to be
in that moment, I accept completely."

"So you have no expectations?"

"I have one: that they are cats. Which they are. So they always meet my expectations."

Steve's brain visibly struggled with this logic. "That's... that's circular reasoning."

"Is it? Or is it harmonious reasoning?"

A cat wandered over, flopping into Yuelin's lap with complete abandon. No hesitation.
No testing. Just pure trust.

"They know I will never judge them," Yuelin murmured, stroking the cat. "Not for
scratching furniture. Not for refusing affection. Not for being difficult. They
are cats. Cats do cat things. This is harmony."

Steve watched for a long moment. Then, tentatively, he tried to project nothing.

It was the hardest thing he had ever attempted.

But the cat in Yuelin's lap looked at him.

And for just a moment, didn't run away.

It was a start.
    `,
    reward: { lore: true, technique: 'lotus_acceptance' }
  },

  yuelin_love: {
    id: 'yuelin_love',
    title: 'The Sage\'s Heart',
    masterId: 'yuelin',
    fragments: 8,
    fullText: `
Yuelin loved everyone in the Sect.

This was not metaphor. Not exaggeration. She genuinely, deeply, completely loved
each member of their strange little family.

Gerald, for his wisdom and quiet strength.
Rusty, for his passion turned to purpose.
Steve, for his mind that never stopped seeking.
Andrew, for his joy in discovery.
Nik, for his loyalty that spoke louder than words.
Scott, for his patience that could move mountains.

And the cats. All the cats. Each unique, each precious, each worthy of infinite love.

"Doesn't it hurt?" Scott asked once, in one of his rare moments of conversation.

"Loving this much?"

"Mmm."

Yuelin smiled. "It hurts every day. When a cat is sad, I feel it. When a friend
struggles, I struggle with them. When the world is cruel, my heart breaks."

"Then why?"

"Because the alternative is not loving. And that..." She touched a nearby cat gently.
"That would hurt far more."

Scott contemplated this for several hours. "Mmm."

"Thank you, Scott."

"Mmm?"

"For loving us too. In your own way."

Scott's expression didn't change. But his Qi, for just a moment, flickered with
warmth.

Yuelin smiled.

She heard everything, after all.

Even the words people didn't say.
    `,
    reward: { lore: true, cat: 'memory_lotus_cat' }
  },

  // === SCOTT - THE MOUNTAIN ===
  scott_meditation: {
    id: 'scott_meditation',
    title: 'The Thousand Day Meditation',
    masterId: 'scott',
    fragments: 5,
    fullText: `
On the first day, Scott sat.

He had heard of a cultivation technique that required absolute stillness. Most
masters attempted it for hours. The greatest, for days.

Scott intended to master it completely.

Days passed. Weeks. Months. His family assumed he had died and held a funeral.
The spot where he sat became overgrown with moss. Birds built nests in his hair.

And on day 273, a cat settled into his lap.

On day 274, more cats came.

By day 500, Scott had become a living cat tree. Felines covered every available
surface of his body, finding warmth in his stillness, peace in his presence.

By day 750, local villagers had begun leaving offerings, believing him a saint or
statue.

On day 999, Scott finally understood the true nature of stillness.

It was not the absence of movement.

It was the presence of absolute acceptance.

The world moved. He did not. And in that gap between motion and stillness, he found
enlightenment.

On day 1000, Scott opened his eyes.

"Mmm," he said, to the seventeen cats sleeping on him.

Then he stood - slowly, so the cats could adjust - and walked toward the distant
temple he had heard whispers about.

A place called the Celestial Snoot Sect.

A place where stillness would be understood.

The cats followed him.

They always would.
    `,
    reward: { lore: true, jadeCatnip: 500 }
  },

  scott_foundation: {
    id: 'scott_foundation',
    title: 'Unshakeable Foundation',
    masterId: 'scott',
    fragments: 7,
    fullText: `
"How do you do it?" Rusty demanded. "How do you stay so calm?"

Scott considered the question for three days.

"Mmm."

"That's not an answer!"

"Mmm." (This one meant: It is, if you understand.)

Rusty didn't understand. But he kept coming back, day after day, demanding answers
in increasingly creative ways.

Scott appreciated the persistence.

Finally, he spoke more than one syllable: "The mountain does not care about the wind."

Rusty blinked. "What?"

"The wind blows. The mountain stands. The wind feels important. The mountain knows
better."

"So... you just ignore everything?"

"No. I accept everything. There is a difference."

Rusty sat beside him, genuinely confused. "Help me understand."

Scott was silent for a long moment. Then he raised one hand, very slowly, and placed
it on Rusty's shoulder.

"You carry anger. Old anger. It blows through you like wind."

Rusty tensed. "I'm working on it."

"I know. But you fight the wind. You want it to stop."

"Of course I do!"

"Mmm." Scott's hand was warm, steady. "What if, instead, you let it blow... and
remained still anyway?"

"I don't know how."

"Sit with me. I will teach you."

Rusty sat. Hours passed. Days.

The wind still blew.

But Rusty, slowly, learned to be the mountain.

It took years.

Scott had nothing but time.
    `,
    reward: { lore: true, technique: 'mountains_patience' }
  },

  scott_truth: {
    id: 'scott_truth',
    title: 'The Guardian\'s Truth',
    masterId: 'scott',
    fragments: 8,
    fullText: `
Scott said very little.

But he saw everything.

He saw Gerald's sleepless nights, the weight of leadership grinding him down. He
saw Rusty's fists clench when old memories surfaced. He saw Steve's fear hiding
behind calculations. He saw Andrew's constant motion that was really running. He
saw Nik's pain, silent and sharp. He saw Yuelin's love that was also a burden.

He saw, and he remembered, and he was always exactly where he was needed.

When Gerald needed someone to lean on, Scott was there - a silent, solid presence.

When Rusty needed to hit something, Scott offered his palm - unmoving, uncomplaining.

When Steve needed certainty, Scott provided it simply by existing.

When Andrew needed to stop, Scott's stillness was contagious.

When Nik needed silence that understood, Scott's silence matched perfectly.

When Yuelin needed rest from feeling everything, Scott's presence was a calm void,
demanding nothing.

"You're always there," Gerald observed once. "How?"

"Mmm."

"That's not an answer."

Scott's lips twitched - the closest he came to smiling. "I am the mountain. Mountains
do not arrive. Mountains simply are."

"But you must want something. Need something."

Scott was quiet for a very long time.

Then: "I need my family to be well. Nothing more. Nothing less."

Gerald's eyes glistened. "Scott..."

"Mmm."

No more words were needed.

Some loves express themselves in presence, not proclamation.

Scott loved through stillness.

And the Sect stood stronger for it.
    `,
    reward: { lore: true, cat: 'memory_mountain_cat' }
  },

  // === SECRET CHAPTERS ===
  secret_eighth_master: {
    id: 'secret_eighth_master',
    title: 'The Eighth Master',
    type: 'secret',
    fragments: 15,
    unlockCondition: { allMasterLoreComplete: true },
    fullText: `
They were always eight.

Before Gerald found the scrolls, before Rusty's redemption, before Steve's
calculations or Andrew's speed or Nik's shadows or Yuelin's whispers or Scott's
meditation...

There was another.

The records call them the Forgotten One. The Eighth Master. The one who was erased.

Why? That answer is locked in memories even Gerald refuses to access.

But fragments remain.

A figure in old paintings, painted over but still visible beneath the surface.

A name scratched out of every ledger, but leaving indentations that could be traced.

A technique - the most powerful in the Sect's history - that no one remembers learning
but everyone somehow knows.

The Eighth Master walked among them. Laughed with them. Loved them.

Then, one day... didn't.

"What happened?" the cats whisper in the night.

"Something terrible," comes the reply. "Something necessary."

"Will they return?"

"..."

The silence speaks volumes.

Somewhere, in the space between memory and forgetting, the Eighth Master waits.

For what? For when?

Perhaps for someone worthy.

Perhaps for you.

[LORE UNLOCKED: The Eighth Master exists. Further investigation may reveal more...]
    `,
    reward: { lore: true, cat: 'echo_of_eight', unlocksEighthMasterPath: true }
  },

  secret_cobra_chicken_origin: {
    id: 'secret_cobra_chicken_origin',
    title: 'The Birth of Chaos',
    type: 'secret',
    fragments: 12,
    unlockCondition: { cobraChickenDefeated: true },
    fullText: `
In the beginning, there was order.

Cats walked the earth. Dogs followed. Humans served. The hierarchy was clear, the
rules unbroken.

Then came the Mistake.

A cultivator, long forgotten, attempted to create the perfect guardian animal. Strong
as an ox. Fierce as a tiger. Loyal as a hound.

Something went wrong.

What emerged from the cultivation chamber was neither ox nor tiger nor hound.

It was... a goose.

But not just any goose. A goose touched by chaos itself. A goose that defied all
natural law. A goose that looked at the ordered universe and said:

"HONK."

The cultivator's laboratory was destroyed. Then the village. Then the countryside.

Other cultivators came to stop it. They failed. Armies marched. They failed. Gods
themselves descended.

They, too, failed.

The creature that would become known as the Cobra Chicken could not be defeated. It
could only be... redirected.

The most powerful sects of the age combined their strength to create a prison
dimension - a place where the Cobra Chicken could honk to its heart's content without
destroying reality.

It worked. For a time.

But prisons weaken. Seals fade. And the Cobra Chicken remembers.

It remembers the taste of chaos.

It remembers the world it nearly consumed.

And it remembers the descendants of those who imprisoned it.

The Celestial Snoot Sect.

HONK.
    `,
    reward: { lore: true, technique: 'chaos_understanding', gooseFeathers: 50 }
  },

  secret_ultimate_snoot: {
    id: 'secret_ultimate_snoot',
    title: 'The Ultimate Snoot',
    type: 'secret',
    fragments: 20,
    unlockCondition: { transcendenceReached: true },
    fullText: `
The Eighth Scroll speaks of it.

The Ultimate Snoot.

A celestial cat that exists beyond time, beyond space, beyond comprehension. Its
nose contains the essence of all creation - every joy, every sorrow, every moment
of connection between beings.

To boop the Ultimate Snoot is to touch infinity itself.

But the scroll warns: only the worthy may approach.

What makes one worthy?

Not power. The strongest cultivators in history tried and failed.

Not wisdom. The wisest scholars could not comprehend its location.

Not purity. Even saints were turned away.

The answer, hidden in the scroll's final lines, is simple:

"The Ultimate Snoot seeks the one who does not seek it. The one who would boop
not for power, not for enlightenment, not for any reward at all. The one who
would boop simply because the snoot is there, and snoots deserve booping."

In other words: someone who loves cats for being cats.

Not what they offer.

Not what they represent.

Just... cats.

Gerald read this passage once. He smiled. He hid the scroll.

And he wondered: among his friends, his family, his Sect...

Was one of them already worthy?

Or were they all?

Perhaps that was the ultimate secret.

The Ultimate Snoot wasn't a destination.

It was a journey.

Every boop, every purr, every moment of connection...

All of it was the Ultimate Snoot, distributed across infinity.

You've been booping it all along.

You just didn't know.
    `,
    reward: { lore: true, cat: 'cosmic_seer', permanentPPBonus: 0.1 }
  },

  secret_waifu_council: {
    id: 'secret_waifu_council',
    title: 'The Council of Masters',
    type: 'secret',
    fragments: 10,
    unlockCondition: { allWaifuMaxBond: true },
    fullText: `
They gather once a year, in secret.

The waifus of the Celestial Snoot Sect.

Not the Twelve Immortal Masters of legend - the real ones. Mochi-chan, Luna
Whiskerbell, Captain Nyanta, and all the others who have guided cultivators
through the ages.

They meet to discuss a single question: Is there one worthy?

Worthy of what?

That's the secret they've kept for generations.

The Celestial Snoot Sect was not founded by Gerald alone. The scrolls he found
were not accidents. The seven masters who gathered were not coincidences.

Everything was arranged.

By the waifus.

They are older than the Sect. Older than recorded history. They are the original
cultivators, the first to discover the power of the boop.

And they have been searching, across millennia, for the one who can complete the
circuit.

Seven masters. Twelve waifus. One worthy soul.

Together, they form a pattern. A technique. A key.

A key to what?

"The next age," Mochi-chan says, adjusting her teacup.

"The true cultivation," Luna yawns, "beyond anything currently imagined."

"Adventure without end," Nyanta grins.

What does this mean for you, the reader of these words?

Only this: they are watching.

And if your bonds are true...

You may already be invited.

Look for the sign.

A lotus. A moon. A teacup.

When all three appear in the same night...

The Council awaits.
    `,
    reward: { lore: true, cosmetic: 'council_emblem', permanentBondBonus: 0.05 }
  },

  secret_the_void: {
    id: 'secret_the_void',
    title: 'What the Void Knows',
    type: 'secret',
    fragments: 25,
    unlockCondition: { voidElementUnlocked: true, loreFragments: 100 },
    fullText: `
Beyond the five elements lies the sixth.

Beyond light lies darkness.

Beyond existence lies...

The Void.

Most cultivators fear it. They should. The Void cares nothing for life, for love,
for meaning. It is the space between stars. The silence between heartbeats. The
nothing from which everything came and to which everything returns.

But here is what they don't tell you:

The Void loves cats.

It sounds absurd. It is absurd. The fundamental emptiness of existence, the
primordial non-being from which reality itself shudders away...

...has a soft spot for small fluffy creatures that knock things off tables.

Why?

Perhaps because cats, alone among all creatures, understand the Void intuitively.
They sit in empty boxes. They stare at nothing. They exist in perfect contentment
with their own being, neither needing validation nor fearing oblivion.

Cats are, in their own way, enlightened.

The Void recognizes this.

And so, the most powerful cultivation technique ever conceived wasn't forged by
humans. It was given freely by the universe itself, to the only beings it respected:

The Void Boop.

A touch that transcends physicality. A connection that spans dimensions. A love
that even nothingness cannot erase.

You'll know when you're ready to learn it.

A cat will come to you in a dream.

Its eyes will be the color of the spaces between stars.

And it will say, in a voice like the absence of sound:

"Boop me, and understand everything."

"Boop me, and understand nothing."

"They are the same."

VOID ELEMENT DEEPENED: +10% power when using Void techniques
    `,
    reward: { lore: true, technique: 'void_comprehension', voidMastery: 0.1 }
  }
};

// ============================================
// MEMORY CHAPTER DEFINITIONS
// ============================================
const MEMORY_CHAPTERS = {
  // === GERALD CHAPTERS ===
  gerald_ch1: {
    id: 'gerald_ch1',
    name: 'The Founding',
    description: 'How Gerald discovered the Snoot Scrolls and founded the Celestial Snoot Sect.',
    masterId: 'gerald',
    chapter: 1,
    loreEntryId: 'gerald_founding',
    enemies: {
      pool: ['memory_shadow', 'past_doubt', 'forgotten_fear'],
      count: 3,
      boss: 'young_gerald_reflection'
    },
    floors: 5,
    difficulty: 'normal',
    unlockCondition: { loreFragments: 10 },
    reward: { lore: 'gerald_founding', cat: null, technique: null, jadeCatnip: 500, cosmetic: null }
  },
  gerald_ch2: {
    id: 'gerald_ch2',
    name: 'The Weight of Leadership',
    description: 'The burden of founding a Sect and the friends who shared the load.',
    masterId: 'gerald',
    chapter: 2,
    loreEntryId: 'gerald_burden',
    enemies: {
      pool: ['memory_shadow', 'imperial_phantom', 'doubt_incarnate'],
      count: 5,
      boss: 'emperor_memory'
    },
    floors: 7,
    difficulty: 'hard',
    unlockCondition: { chaptersComplete: ['gerald_ch1'] },
    reward: { lore: 'gerald_burden', technique: 'leaders_resolve', jadeCatnip: 750, cosmetic: null }
  },
  gerald_ch3: {
    id: 'gerald_ch3',
    name: 'The Eighth Scroll',
    description: 'A secret Gerald has never shared. Until now.',
    masterId: 'gerald',
    chapter: 3,
    loreEntryId: 'gerald_secret',
    enemies: {
      pool: ['memory_shadow', 'scroll_guardian', 'truth_seeker'],
      count: 7,
      boss: 'eighth_master_shadow'
    },
    floors: 10,
    difficulty: 'nightmare',
    unlockCondition: { chaptersComplete: ['gerald_ch2'], allMasterLoreComplete: true },
    reward: { lore: 'gerald_secret', cat: 'memory_jade_cat', unlocksEighthMasterHint: true, jadeCatnip: 1500 }
  },

  // === RUSTY CHAPTERS ===
  rusty_ch1: {
    id: 'rusty_ch1',
    name: 'The Redemption',
    description: 'Rusty\'s life before the Sect - the blood, the guilt, and the cat that changed everything.',
    masterId: 'rusty',
    chapter: 1,
    loreEntryId: 'rusty_redemption',
    enemies: {
      pool: ['past_bandit', 'guilt_phantom', 'blood_memory'],
      count: 4,
      boss: 'crimson_terror'
    },
    floors: 6,
    difficulty: 'normal',
    unlockCondition: { loreFragments: 10 },
    reward: { lore: 'rusty_redemption', jadeCatnip: 500 }
  },
  rusty_ch2: {
    id: 'rusty_ch2',
    name: 'The Thousand Boop Barrage',
    description: 'How Rusty transformed violence into love through sheer intensity.',
    masterId: 'rusty',
    chapter: 2,
    loreEntryId: 'rusty_fury',
    enemies: {
      pool: ['training_dummy', 'inner_beast', 'rage_shadow'],
      count: 6,
      boss: 'berserker_rusty'
    },
    floors: 8,
    difficulty: 'hard',
    unlockCondition: { chaptersComplete: ['rusty_ch1'] },
    reward: { lore: 'rusty_fury', technique: 'crimson_compassion', jadeCatnip: 750 }
  },
  rusty_ch3: {
    id: 'rusty_ch3',
    name: 'The General\'s Heart',
    description: 'The day Rusty ended a war with a single kitten.',
    masterId: 'rusty',
    chapter: 3,
    loreEntryId: 'rusty_legacy',
    enemies: {
      pool: ['rival_sect_warrior', 'war_phantom', 'hatred_incarnate'],
      count: 8,
      boss: 'war_lord_memory'
    },
    floors: 10,
    difficulty: 'nightmare',
    unlockCondition: { chaptersComplete: ['rusty_ch2'] },
    reward: { lore: 'rusty_legacy', cat: 'memory_crimson_cat', jadeCatnip: 1500 }
  },

  // === STEVE CHAPTERS ===
  steve_ch1: {
    id: 'steve_ch1',
    name: 'The Calculation',
    description: 'Steve\'s endless pursuit of optimization, and the variable he could never quantify.',
    masterId: 'steve',
    chapter: 1,
    loreEntryId: 'steve_optimization',
    enemies: {
      pool: ['logic_error', 'paradox_shadow', 'unquantifiable_variable'],
      count: 3,
      boss: 'perfect_formula'
    },
    floors: 5,
    difficulty: 'normal',
    unlockCondition: { loreFragments: 10 },
    reward: { lore: 'steve_optimization', jadeCatnip: 500 }
  },
  steve_ch2: {
    id: 'steve_ch2',
    name: 'The Eternal Flow',
    description: 'Learning patience from Scott, and the river that never hurries.',
    masterId: 'steve',
    chapter: 2,
    loreEntryId: 'steve_patience',
    enemies: {
      pool: ['impatience_demon', 'rushing_phantom', 'anxiety_swarm'],
      count: 5,
      boss: 'time_pressure'
    },
    floors: 7,
    difficulty: 'hard',
    unlockCondition: { chaptersComplete: ['steve_ch1'] },
    reward: { lore: 'steve_patience', technique: 'river_patience', jadeCatnip: 750 }
  },
  steve_ch3: {
    id: 'steve_ch3',
    name: 'The Strategist\'s Heart',
    description: 'The fear behind the formulas, and the family that saved him.',
    masterId: 'steve',
    chapter: 3,
    loreEntryId: 'steve_truth',
    enemies: {
      pool: ['childhood_trauma', 'poverty_memory', 'fear_of_failure'],
      count: 7,
      boss: 'young_steve_reflection'
    },
    floors: 10,
    difficulty: 'nightmare',
    unlockCondition: { chaptersComplete: ['steve_ch2'] },
    reward: { lore: 'steve_truth', cat: 'memory_river_cat', jadeCatnip: 1500 }
  },

  // === ANDREW CHAPTERS ===
  andrew_ch1: {
    id: 'andrew_ch1',
    name: 'The Runner',
    description: 'Andrew ran from everything - until he found something worth stopping for.',
    masterId: 'andrew',
    chapter: 1,
    loreEntryId: 'andrew_speed',
    enemies: {
      pool: ['racing_phantom', 'time_blur', 'restless_spirit'],
      count: 3,
      boss: 'endless_runner'
    },
    floors: 5,
    difficulty: 'normal',
    unlockCondition: { loreFragments: 10 },
    reward: { lore: 'andrew_speed', jadeCatnip: 500 }
  },
  andrew_ch2: {
    id: 'andrew_ch2',
    name: 'Lightning Reflexes',
    description: 'The discovery that changed everything - running toward, not away.',
    masterId: 'andrew',
    chapter: 2,
    loreEntryId: 'andrew_discovery',
    enemies: {
      pool: ['cave_guardian', 'wild_cat_spirit', 'undiscovered_mystery'],
      count: 5,
      boss: 'first_discovery'
    },
    floors: 7,
    difficulty: 'hard',
    unlockCondition: { chaptersComplete: ['andrew_ch1'] },
    reward: { lore: 'andrew_discovery', technique: 'scouts_insight', jadeCatnip: 750 }
  },
  andrew_ch3: {
    id: 'andrew_ch3',
    name: 'The Scout\'s Promise',
    description: 'Some things are worth slowing down for. Even for the fastest man in the Jianghu.',
    masterId: 'andrew',
    chapter: 3,
    loreEntryId: 'andrew_heart',
    enemies: {
      pool: ['volcanic_spirit', 'emergency_phantom', 'seconds_remaining'],
      count: 7,
      boss: 'moment_of_decision'
    },
    floors: 10,
    difficulty: 'nightmare',
    unlockCondition: { chaptersComplete: ['andrew_ch2'] },
    reward: { lore: 'andrew_heart', cat: 'memory_thunder_cat', jadeCatnip: 1500 }
  },

  // === NIK CHAPTERS ===
  nik_ch1: {
    id: 'nik_ch1',
    name: 'The Shadow\'s Birth',
    description: 'Before the silence, there was screaming. Nik\'s origin.',
    masterId: 'nik',
    chapter: 1,
    loreEntryId: 'nik_shadows',
    enemies: {
      pool: ['burning_memory', 'assassin_phantom', 'silence_incarnate'],
      count: 3,
      boss: 'child_of_shadows'
    },
    floors: 5,
    difficulty: 'normal',
    unlockCondition: { loreFragments: 10 },
    reward: { lore: 'nik_shadows', jadeCatnip: 500 }
  },
  nik_ch2: {
    id: 'nik_ch2',
    name: 'The Phantom Boop',
    description: 'Learning to touch gently when your hands only knew violence.',
    masterId: 'nik',
    chapter: 2,
    loreEntryId: 'nik_trust',
    enemies: {
      pool: ['violent_instinct', 'defensive_reflex', 'fear_of_touch'],
      count: 5,
      boss: 'clenched_fist'
    },
    floors: 7,
    difficulty: 'hard',
    unlockCondition: { chaptersComplete: ['nik_ch1'] },
    reward: { lore: 'nik_trust', technique: 'shadows_embrace', jadeCatnip: 750 }
  },
  nik_ch3: {
    id: 'nik_ch3',
    name: 'When the Shadow Speaks',
    description: 'Seven words in a year. But when Nik spoke, worlds changed.',
    masterId: 'nik',
    chapter: 3,
    loreEntryId: 'nik_voice',
    enemies: {
      pool: ['invading_bandit', 'threat_to_family', 'word_unspoken'],
      count: 7,
      boss: 'thirty_enemies'
    },
    floors: 10,
    difficulty: 'nightmare',
    unlockCondition: { chaptersComplete: ['nik_ch2'] },
    reward: { lore: 'nik_voice', cat: 'memory_shadow_cat', jadeCatnip: 1500 }
  },

  // === YUELIN CHAPTERS ===
  yuelin_ch1: {
    id: 'yuelin_ch1',
    name: 'The Cat\'s Tongue',
    description: 'Yuelin heard voices since birth. They led her home.',
    masterId: 'yuelin',
    chapter: 1,
    loreEntryId: 'yuelin_whispers',
    enemies: {
      pool: ['misunderstood_whisper', 'lonely_voice', 'searching_spirit'],
      count: 3,
      boss: 'voice_in_wilderness'
    },
    floors: 5,
    difficulty: 'normal',
    unlockCondition: { loreFragments: 10 },
    reward: { lore: 'yuelin_whispers', jadeCatnip: 500 }
  },
  yuelin_ch2: {
    id: 'yuelin_ch2',
    name: 'Harmonious Aura',
    description: 'The secret to making cats truly happy - expect nothing, accept everything.',
    masterId: 'yuelin',
    chapter: 2,
    loreEntryId: 'yuelin_harmony',
    enemies: {
      pool: ['expectation_weight', 'judgment_phantom', 'conditional_love'],
      count: 5,
      boss: 'perfect_expectation'
    },
    floors: 7,
    difficulty: 'hard',
    unlockCondition: { chaptersComplete: ['yuelin_ch1'] },
    reward: { lore: 'yuelin_harmony', technique: 'lotus_acceptance', jadeCatnip: 750 }
  },
  yuelin_ch3: {
    id: 'yuelin_ch3',
    name: 'The Sage\'s Heart',
    description: 'Loving this much hurts. But the alternative is worse.',
    masterId: 'yuelin',
    chapter: 3,
    loreEntryId: 'yuelin_love',
    enemies: {
      pool: ['empathy_overload', 'others_pain', 'world_cruelty'],
      count: 7,
      boss: 'love_that_hurts'
    },
    floors: 10,
    difficulty: 'nightmare',
    unlockCondition: { chaptersComplete: ['yuelin_ch2'] },
    reward: { lore: 'yuelin_love', cat: 'memory_lotus_cat', jadeCatnip: 1500 }
  },

  // === SCOTT CHAPTERS ===
  scott_ch1: {
    id: 'scott_ch1',
    name: 'The Thousand Day Meditation',
    description: 'One thousand days of stillness. One moment of enlightenment.',
    masterId: 'scott',
    chapter: 1,
    loreEntryId: 'scott_meditation',
    enemies: {
      pool: ['restless_thought', 'passing_day', 'distraction_swarm'],
      count: 3,
      boss: 'one_thousand_days'
    },
    floors: 5,
    difficulty: 'normal',
    unlockCondition: { loreFragments: 10 },
    reward: { lore: 'scott_meditation', jadeCatnip: 500 }
  },
  scott_ch2: {
    id: 'scott_ch2',
    name: 'Unshakeable Foundation',
    description: 'Teaching Rusty patience. Learning that the mountain does not care about the wind.',
    masterId: 'scott',
    chapter: 2,
    loreEntryId: 'scott_foundation',
    enemies: {
      pool: ['howling_wind', 'shaking_ground', 'impermanence_fear'],
      count: 5,
      boss: 'storm_of_emotion'
    },
    floors: 7,
    difficulty: 'hard',
    unlockCondition: { chaptersComplete: ['scott_ch1'] },
    reward: { lore: 'scott_foundation', technique: 'mountains_patience', jadeCatnip: 750 }
  },
  scott_ch3: {
    id: 'scott_ch3',
    name: 'The Guardian\'s Truth',
    description: 'He said little. But he saw everything. And he was always exactly where needed.',
    masterId: 'scott',
    chapter: 3,
    loreEntryId: 'scott_truth',
    enemies: {
      pool: ['unseen_need', 'silent_burden', 'weight_of_watching'],
      count: 7,
      boss: 'love_without_words'
    },
    floors: 10,
    difficulty: 'nightmare',
    unlockCondition: { chaptersComplete: ['scott_ch2'] },
    reward: { lore: 'scott_truth', cat: 'memory_mountain_cat', jadeCatnip: 1500 }
  },

  // === SECRET CHAPTERS ===
  secret_ch1: {
    id: 'secret_ch1',
    name: 'The Eighth Master',
    description: '???',
    type: 'secret',
    chapter: 1,
    loreEntryId: 'secret_eighth_master',
    enemies: {
      pool: ['erased_memory', 'forgotten_truth', 'void_remnant'],
      count: 10,
      boss: 'eighth_master_echo'
    },
    floors: 15,
    difficulty: 'legendary',
    unlockCondition: { allMasterLoreComplete: true },
    reward: { lore: 'secret_eighth_master', cat: 'echo_of_eight', unlocksEighthMasterPath: true, jadeCatnip: 3000 }
  },
  secret_ch2: {
    id: 'secret_ch2',
    name: 'The Birth of Chaos',
    description: 'Before there was the Cobra Chicken, there was... a mistake.',
    type: 'secret',
    chapter: 2,
    loreEntryId: 'secret_cobra_chicken_origin',
    enemies: {
      pool: ['proto_goose', 'chaos_fragment', 'dimension_tear'],
      count: 12,
      boss: 'primordial_honk'
    },
    floors: 15,
    difficulty: 'legendary',
    unlockCondition: { cobraChickenDefeated: true },
    reward: { lore: 'secret_cobra_chicken_origin', technique: 'chaos_understanding', gooseFeathers: 50, jadeCatnip: 3000 }
  },
  secret_ch3: {
    id: 'secret_ch3',
    name: 'The Ultimate Snoot',
    description: 'What lies at the end of cultivation? The answer will surprise you.',
    type: 'secret',
    chapter: 3,
    loreEntryId: 'secret_ultimate_snoot',
    enemies: {
      pool: ['cosmic_guardian', 'enlightenment_test', 'infinite_love'],
      count: 15,
      boss: 'ultimate_snoot_guardian'
    },
    floors: 20,
    difficulty: 'legendary',
    unlockCondition: { transcendenceReached: true },
    reward: { lore: 'secret_ultimate_snoot', cat: 'cosmic_seer', permanentPPBonus: 0.1, jadeCatnip: 5000 }
  },
  secret_ch4: {
    id: 'secret_ch4',
    name: 'The Council of Masters',
    description: 'The waifus meet in secret. What do they discuss?',
    type: 'secret',
    chapter: 4,
    loreEntryId: 'secret_waifu_council',
    enemies: {
      pool: ['council_memory', 'ancient_waifu_guardian', 'bond_incarnate'],
      count: 12,
      boss: 'council_challenge'
    },
    floors: 15,
    difficulty: 'legendary',
    unlockCondition: { allWaifuMaxBond: true },
    reward: { lore: 'secret_waifu_council', cosmetic: 'council_emblem', permanentBondBonus: 0.05, jadeCatnip: 3000 }
  },
  secret_ch5: {
    id: 'secret_ch5',
    name: 'What the Void Knows',
    description: 'The Void has a secret. It loves cats.',
    type: 'secret',
    chapter: 5,
    loreEntryId: 'secret_the_void',
    enemies: {
      pool: ['void_whisper', 'nothingness_fragment', 'primordial_emptiness'],
      count: 15,
      boss: 'void_itself'
    },
    floors: 20,
    difficulty: 'legendary',
    unlockCondition: { voidElementUnlocked: true, loreFragments: 100 },
    reward: { lore: 'secret_the_void', technique: 'void_comprehension', voidMastery: 0.1, jadeCatnip: 5000 }
  }
};

// ============================================
// WAIFU LORE ENTRIES
// ============================================
const WAIFU_LORE_ENTRIES = {
  mochi_origin: {
    id: 'mochi_origin',
    title: 'The Teahouse Keeper',
    waifuId: 'mochi',
    fullText: `
Before she was Mochi-chan, she was a warrior.

Few know this. Even fewer believe it.

She wielded twin blades with deadly precision. Her tea ceremony training - once a
cover for assassination techniques - made her movements impossibly fluid. In the
shadowy war between sects, she was a weapon.

Then she killed the wrong person.

Not a target - a bystander. An old man making tea in a shop she was fighting through.

He died with a smile on his face, offering her a cup even as the life left his body.

That smile broke her.

She hung up her blades that night. Took the old man's teahouse. Learned to make the
perfect cup of tea. Transformed every deadly technique into a gesture of welcome.

"The way of hospitality," she calls it now. "Every guest is a friend. Every enemy,
a guest I haven't met yet."

When cultivators come to her teahouse, angry and ready for violence, they leave
calm and questioning their choices. Her tea has that effect.

Some say it's magic.

She says it's love.

And perhaps there's no difference.
    `,
    reward: { lore: true, jadeCatnip: 600 }
  },

  mochi_secret: {
    id: 'mochi_secret',
    title: 'The Hidden Blades',
    waifuId: 'mochi',
    fullText: `
She still has the blades.

Hidden beneath the floor of the teahouse, wrapped in silk, they wait.

Not because she fears returning to her old life - she has made peace with that
darkness. But because some evils in the world require steel, not tea.

"If anyone threatens this place," she told Gerald once, "if anyone hurts my family,
I will become what I was. Just once more."

Gerald nodded. He understood.

"Let us hope," he said, "that your tea is always enough."

It has been. So far.

But Mochi-chan still practices. In the deep of night, when the guests are sleeping,
she moves through forms she swore to forget. Her hands remember.

They always will.

And perhaps that's not a weakness.

Perhaps the best defender of peace is one who truly understands violence.

Perhaps the warmest heart is one that knows how cold the world can be.

Mochi-chan makes tea.

And somewhere beneath her feet, twin blades dream of the day they might be needed.

"I hope it never comes," she whispers.

But if it does, she'll be ready.

For her family, she would become a monster again.

And that, perhaps, is the truest form of love.
    `,
    reward: { lore: true, technique: 'hospitalitys_edge', jadeCatnip: 1000 }
  },

  luna_past: {
    id: 'luna_past',
    title: 'Why She Watches the Night',
    waifuId: 'luna',
    fullText: `
Luna doesn't sleep because she fears the dreams.

In her dreams, she sees her village burning. In her dreams, she hears her family's
screams. In her dreams, she is a child again, running through smoke while the world
ends around her.

The night was her only refuge then.

While the fires raged, she hid in shadows. While others died in daylight, she
survived in darkness. The moon became her guardian when everyone else was gone.

"I owe the night my life," she explains, when asked about her sleepy demeanor.
"The least I can do is stay awake to keep it company."

It sounds poetic. It is poetic.

It's also deeply, profoundly sad.

But the Celestial Snoot Sect is teaching her something new:

The night doesn't need company. But maybe she does.

Gerald checks on her when she stands alone on the watchtower. Yuelin leaves warm
blankets where she'll find them. Scott simply sits nearby, a mountain she can lean
against.

And slowly, very slowly, Luna is learning that watching over others means letting
others watch over her too.

She still doesn't sleep much.

But she's started having different dreams.

Dreams where the fire is just a campfire.

Dreams where her family is the Sect.

Dreams where she can finally rest.

*yawn*

Maybe tonight.
    `,
    reward: { lore: true, jadeCatnip: 800, afkBonus: 0.05 }
  },

  nyanta_treasure: {
    id: 'nyanta_treasure',
    title: 'The Real Treasure',
    waifuId: 'nyanta',
    fullText: `
Captain Nyanta sailed the seven seas seeking gold.

She found plenty. Chests of it. Caves of it. Sunken ships bursting with it.

None of it filled the hole in her heart.

"More," she would tell her crew. "There's always more."

But there wasn't. Not enough, anyway.

Then came the storm.

Her ship sank. Her crew scattered. Nyanta washed up on a strange shore with nothing
but the clothes on her back and a stubborn refusal to die.

A cat found her there.

Half-drowned, barely conscious, she felt a tiny nose touch her face. A small body
curl against her for warmth. A purr that said: "You're not alone."

When she woke, she was surrounded by cats. Dozens of them. They had kept her warm
through the night.

"Why?" she asked the first cat.

It just purred.

That purr was worth more than all the gold she'd ever found.

Nyanta rebuilt. Not a pirate fleet this time, but an expedition company. She still
seeks treasure - but now the treasure is cats. Lost cats. Rare cats. Cats that need
someone to find them.

"YARR!" she shouts when she spots one. "TREASURE!"

Her crew thinks she's eccentric.

They're not wrong.

But they've never seen her smile the way she smiles when a lost cat is finally home.

That smile is the real treasure.

And Nyanta finally has enough.
    `,
    reward: { lore: true, jadeCatnip: 800, expeditionBonus: 0.1 }
  }
};

// ============================================
// WAIFU MEMORY CHAPTERS
// ============================================
const WAIFU_MEMORY_CHAPTERS = {
  mochi_ch1: {
    id: 'mochi_ch1',
    name: 'The Teahouse Keeper',
    description: 'Before she was Mochi-chan, she was a warrior.',
    waifuId: 'mochi',
    chapter: 1,
    loreEntryId: 'mochi_origin',
    enemies: {
      pool: ['past_target', 'assassin_memory', 'guilt_shadow'],
      count: 5,
      boss: 'warrior_mochi'
    },
    floors: 7,
    difficulty: 'hard',
    unlockCondition: { waifuBond: { mochi: 50 } },
    reward: { lore: 'mochi_origin', jadeCatnip: 600 }
  },
  mochi_ch2: {
    id: 'mochi_ch2',
    name: 'The Hidden Blades',
    description: 'She still has the blades. They dream of the day they might be needed.',
    waifuId: 'mochi',
    chapter: 2,
    loreEntryId: 'mochi_secret',
    enemies: {
      pool: ['blade_memory', 'protective_instinct', 'love_turned_weapon'],
      count: 7,
      boss: 'dual_blade_phantom'
    },
    floors: 10,
    difficulty: 'nightmare',
    unlockCondition: { chaptersComplete: ['mochi_ch1'], waifuBond: { mochi: 100 } },
    reward: { lore: 'mochi_secret', technique: 'hospitalitys_edge', jadeCatnip: 1000 }
  },

  luna_ch1: {
    id: 'luna_ch1',
    name: 'Why She Watches the Night',
    description: 'Luna doesn\'t sleep because she fears the dreams.',
    waifuId: 'luna',
    chapter: 1,
    loreEntryId: 'luna_past',
    enemies: {
      pool: ['nightmare_fragment', 'burning_memory', 'childhood_fear'],
      count: 5,
      boss: 'fire_nightmare'
    },
    floors: 7,
    difficulty: 'hard',
    unlockCondition: { waifuBond: { luna: 50 } },
    reward: { lore: 'luna_past', jadeCatnip: 800, afkBonus: 0.05 }
  },

  nyanta_ch1: {
    id: 'nyanta_ch1',
    name: 'The Real Treasure',
    description: 'Captain Nyanta sailed the seven seas seeking gold. She found something better.',
    waifuId: 'nyanta',
    chapter: 1,
    loreEntryId: 'nyanta_treasure',
    enemies: {
      pool: ['greed_phantom', 'empty_chest', 'storm_memory'],
      count: 5,
      boss: 'golden_void'
    },
    floors: 7,
    difficulty: 'hard',
    unlockCondition: { waifuBond: { nyanta: 50 } },
    reward: { lore: 'nyanta_treasure', jadeCatnip: 800, expeditionBonus: 0.1 }
  }
};

// ============================================
// ENEMY DEFINITIONS FOR MEMORY DUNGEONS
// ============================================
const MEMORY_ENEMIES = {
  memory_shadow: {
    id: 'memory_shadow',
    name: 'Memory Shadow',
    emoji: '👤',
    baseHp: 80,
    baseDamage: 15,
    baseDefense: 5,
    description: 'A fragment of forgotten memories, seeking to be remembered.'
  },
  past_doubt: {
    id: 'past_doubt',
    name: 'Past Doubt',
    emoji: '❓',
    baseHp: 60,
    baseDamage: 20,
    baseDefense: 3,
    description: 'The doubts that once plagued the mind, given form.'
  },
  forgotten_fear: {
    id: 'forgotten_fear',
    name: 'Forgotten Fear',
    emoji: '😱',
    baseHp: 70,
    baseDamage: 25,
    baseDefense: 2,
    description: 'A fear buried so deep it was almost forgotten. Almost.'
  },
  past_bandit: {
    id: 'past_bandit',
    name: 'Past Bandit',
    emoji: '🗡️',
    baseHp: 100,
    baseDamage: 18,
    baseDefense: 8,
    description: 'Echoes of Rusty\'s former followers.'
  },
  guilt_phantom: {
    id: 'guilt_phantom',
    name: 'Guilt Phantom',
    emoji: '💔',
    baseHp: 90,
    baseDamage: 22,
    baseDefense: 5,
    description: 'Guilt given form. It never truly dies.'
  },
  logic_error: {
    id: 'logic_error',
    name: 'Logic Error',
    emoji: '⚠️',
    baseHp: 50,
    baseDamage: 30,
    baseDefense: 0,
    description: 'When calculations go wrong.'
  },
  burning_memory: {
    id: 'burning_memory',
    name: 'Burning Memory',
    emoji: '🔥',
    baseHp: 85,
    baseDamage: 20,
    baseDefense: 4,
    description: 'A village burns eternally in someone\'s mind.'
  },
  erased_memory: {
    id: 'erased_memory',
    name: 'Erased Memory',
    emoji: '⬛',
    baseHp: 150,
    baseDamage: 35,
    baseDefense: 15,
    description: 'What was forgotten fights to be remembered.'
  },
  void_remnant: {
    id: 'void_remnant',
    name: 'Void Remnant',
    emoji: '🕳️',
    baseHp: 200,
    baseDamage: 40,
    baseDefense: 20,
    description: 'A piece of nothingness that shouldn\'t exist.'
  },
  proto_goose: {
    id: 'proto_goose',
    name: 'Proto-Goose',
    emoji: '🦆',
    baseHp: 180,
    baseDamage: 45,
    baseDefense: 10,
    description: 'HONK? (A goose from before the Cobra Chicken existed.)'
  }
};

// Boss enemies
const MEMORY_BOSSES = {
  young_gerald_reflection: {
    id: 'young_gerald_reflection',
    name: 'Young Gerald\'s Reflection',
    emoji: '🪞',
    baseHp: 300,
    baseDamage: 30,
    baseDefense: 15,
    phases: 2,
    description: 'Gerald as he was before finding the scrolls - lost and purposeless.'
  },
  crimson_terror: {
    id: 'crimson_terror',
    name: 'The Crimson Terror',
    emoji: '👹',
    baseHp: 400,
    baseDamage: 45,
    baseDefense: 20,
    phases: 2,
    description: 'Rusty\'s former self - the bandit king who knew only violence.'
  },
  eighth_master_shadow: {
    id: 'eighth_master_shadow',
    name: 'The Eighth Master\'s Shadow',
    emoji: '❓',
    baseHp: 800,
    baseDamage: 60,
    baseDefense: 30,
    phases: 3,
    description: 'A shadow of someone who was erased from history.'
  },
  eighth_master_echo: {
    id: 'eighth_master_echo',
    name: 'Echo of the Eighth',
    emoji: '🔮',
    baseHp: 1500,
    baseDamage: 80,
    baseDefense: 40,
    phases: 4,
    description: 'The true form of the Forgotten One. Finally remembered.'
  },
  primordial_honk: {
    id: 'primordial_honk',
    name: 'The Primordial HONK',
    emoji: '🦢',
    baseHp: 2000,
    baseDamage: 100,
    baseDefense: 50,
    phases: 5,
    description: 'HONK HONK HONK (The first honk. The source of all chaos.)'
  },
  ultimate_snoot_guardian: {
    id: 'ultimate_snoot_guardian',
    name: 'Guardian of the Ultimate Snoot',
    emoji: '🐱',
    baseHp: 3000,
    baseDamage: 120,
    baseDefense: 60,
    phases: 5,
    description: 'The final test. Are you worthy of the Ultimate Snoot?'
  }
};

// ============================================
// MEMORY FRAGMENTS SYSTEM CLASS
// ============================================
class MemoryFragmentsSystem {
  constructor() {
    // All chapters (master + waifu + secret)
    this.chapters = { ...MEMORY_CHAPTERS, ...WAIFU_MEMORY_CHAPTERS };
    this.loreEntries = { ...LORE_ENTRIES, ...WAIFU_LORE_ENTRIES };
    this.enemies = MEMORY_ENEMIES;
    this.bosses = MEMORY_BOSSES;

    // Player progress
    this.completedChapters = [];
    this.unlockedLore = [];
    this.collectedFragments = {};
    this.totalFragmentsCollected = 0;

    // Current run state
    this.currentRun = null;

    // Statistics
    this.stats = {
      totalChaptersCompleted: 0,
      totalLoreUnlocked: 0,
      secretsDiscovered: 0,
      memoriesExplored: 0
    };
  }

  /**
   * Initialize the system
   */
  init() {
    // Check for any auto-unlocks based on game state
    this.checkUnlocks();
  }

  /**
   * Check if Memory Fragments dungeon is unlocked
   */
  isUnlocked() {
    return this.totalFragmentsCollected >= 10;
  }

  /**
   * Get all available chapters based on player progress
   */
  getAvailableChapters(playerProgress = {}) {
    const available = [];

    for (const [chapterId, chapter] of Object.entries(this.chapters)) {
      if (this.completedChapters.includes(chapterId)) {
        continue; // Already completed
      }

      if (this.meetsUnlockCondition(chapter.unlockCondition, playerProgress)) {
        available.push({
          ...chapter,
          available: true,
          locked: false
        });
      }
    }

    // Sort by difficulty and chapter number
    const difficultyOrder = { normal: 1, hard: 2, nightmare: 3, legendary: 4 };
    available.sort((a, b) => {
      if (a.masterId !== b.masterId) {
        return (a.masterId || 'z').localeCompare(b.masterId || 'z');
      }
      return (a.chapter || 0) - (b.chapter || 0);
    });

    return available;
  }

  /**
   * Get all chapters (for display purposes)
   */
  getAllChapters(playerProgress = {}) {
    const all = [];

    for (const [chapterId, chapter] of Object.entries(this.chapters)) {
      const isCompleted = this.completedChapters.includes(chapterId);
      const isUnlocked = this.meetsUnlockCondition(chapter.unlockCondition, playerProgress);

      all.push({
        ...chapter,
        completed: isCompleted,
        available: isUnlocked && !isCompleted,
        locked: !isUnlocked
      });
    }

    return all;
  }

  /**
   * Check if unlock condition is met
   */
  meetsUnlockCondition(condition, playerProgress = {}) {
    if (!condition) return true;

    // Basic lore fragments requirement
    if (condition.loreFragments) {
      if (this.totalFragmentsCollected < condition.loreFragments) return false;
    }

    // Chapter prerequisites
    if (condition.chaptersComplete) {
      for (const chapterId of condition.chaptersComplete) {
        if (!this.completedChapters.includes(chapterId)) return false;
      }
    }

    // All master lore complete
    if (condition.allMasterLoreComplete) {
      const masterIds = ['gerald', 'rusty', 'steve', 'andrew', 'nik', 'yuelin', 'scott'];
      for (const masterId of masterIds) {
        const ch3 = `${masterId}_ch3`;
        if (!this.completedChapters.includes(ch3)) return false;
      }
    }

    // Cobra Chicken defeated
    if (condition.cobraChickenDefeated) {
      if (!playerProgress.cobraChickenDefeated) return false;
    }

    // Transcendence reached
    if (condition.transcendenceReached) {
      if (!playerProgress.transcendenceReached) return false;
    }

    // All waifu max bond
    if (condition.allWaifuMaxBond) {
      if (!playerProgress.allWaifuMaxBond) return false;
    }

    // Void element unlocked
    if (condition.voidElementUnlocked) {
      if (!playerProgress.voidElementUnlocked) return false;
    }

    // Waifu bond requirements
    if (condition.waifuBond) {
      for (const [waifuId, requiredBond] of Object.entries(condition.waifuBond)) {
        const currentBond = playerProgress.waifuBonds?.[waifuId] || 0;
        if (currentBond < requiredBond) return false;
      }
    }

    return true;
  }

  /**
   * Start a chapter run
   */
  startChapter(chapterId, playerProgress = {}) {
    const chapter = this.chapters[chapterId];
    if (!chapter) {
      return { success: false, error: 'Chapter not found.' };
    }

    if (this.completedChapters.includes(chapterId)) {
      return { success: false, error: 'Chapter already completed.' };
    }

    if (!this.meetsUnlockCondition(chapter.unlockCondition, playerProgress)) {
      return { success: false, error: 'Chapter requirements not met.' };
    }

    // Initialize run state
    this.currentRun = {
      chapterId,
      chapter,
      currentFloor: 0,
      maxFloors: chapter.floors,
      playerHp: 100,
      playerMaxHp: 100,
      enemies: [],
      combatLog: [],
      startTime: Date.now()
    };

    // Calculate player stats based on game state
    this.calculatePlayerStats(playerProgress);

    // Generate first floor
    this.advanceFloor();

    return {
      success: true,
      chapter,
      run: this.currentRun
    };
  }

  /**
   * Calculate player stats for the run
   */
  calculatePlayerStats(playerProgress = {}) {
    if (!this.currentRun) return;

    let hp = 100;
    let damage = 15;
    let defense = 5;

    // Add bonuses from cultivation realm
    if (playerProgress.cultivationRealm) {
      const realmBonuses = {
        mortal: { hp: 0, damage: 0, defense: 0 },
        qiCondensation: { hp: 20, damage: 5, defense: 2 },
        foundationEstablishment: { hp: 50, damage: 10, defense: 5 },
        coreFormation: { hp: 100, damage: 20, defense: 10 },
        nascentSoul: { hp: 200, damage: 35, defense: 18 },
        spiritSevering: { hp: 350, damage: 55, defense: 28 },
        daoSeeking: { hp: 500, damage: 80, defense: 40 },
        immortalAscension: { hp: 800, damage: 120, defense: 60 },
        trueImmortal: { hp: 1200, damage: 180, defense: 90 },
        heavenlySovereign: { hp: 2000, damage: 300, defense: 150 }
      };
      const bonus = realmBonuses[playerProgress.cultivationRealm] || realmBonuses.mortal;
      hp += bonus.hp;
      damage += bonus.damage;
      defense += bonus.defense;
    }

    this.currentRun.playerMaxHp = hp;
    this.currentRun.playerHp = hp;
    this.currentRun.playerDamage = damage;
    this.currentRun.playerDefense = defense;
  }

  /**
   * Advance to next floor in current run
   */
  advanceFloor() {
    if (!this.currentRun) return null;

    this.currentRun.currentFloor++;

    const chapter = this.currentRun.chapter;
    const isBossFloor = this.currentRun.currentFloor >= chapter.floors;

    if (isBossFloor) {
      // Spawn boss
      this.spawnBoss();
    } else {
      // Spawn regular enemy
      this.spawnEnemy();
    }

    this.logCombat(`Floor ${this.currentRun.currentFloor}/${chapter.floors}`);

    return {
      floor: this.currentRun.currentFloor,
      maxFloors: chapter.floors,
      isBoss: isBossFloor,
      enemy: this.currentRun.currentEnemy
    };
  }

  /**
   * Spawn a regular enemy
   */
  spawnEnemy() {
    const chapter = this.currentRun.chapter;
    const pool = chapter.enemies.pool;
    const enemyId = pool[Math.floor(Math.random() * pool.length)];
    const template = this.enemies[enemyId] || this.enemies.memory_shadow;

    // Scale based on floor
    const scaling = 1 + (this.currentRun.currentFloor - 1) * 0.15;
    const difficultyMult = {
      normal: 1.0,
      hard: 1.3,
      nightmare: 1.6,
      legendary: 2.0
    }[chapter.difficulty] || 1.0;

    this.currentRun.currentEnemy = {
      ...template,
      isBoss: false,
      maxHp: Math.floor(template.baseHp * scaling * difficultyMult),
      hp: Math.floor(template.baseHp * scaling * difficultyMult),
      damage: Math.floor(template.baseDamage * scaling * difficultyMult),
      defense: Math.floor(template.baseDefense * scaling * difficultyMult)
    };

    this.logCombat(`${template.emoji} ${template.name} emerges from the memories!`);
  }

  /**
   * Spawn boss enemy
   */
  spawnBoss() {
    const chapter = this.currentRun.chapter;
    const bossId = chapter.enemies.boss;
    const template = this.bosses[bossId] || this.bosses.young_gerald_reflection;

    const difficultyMult = {
      normal: 1.0,
      hard: 1.3,
      nightmare: 1.6,
      legendary: 2.0
    }[chapter.difficulty] || 1.0;

    this.currentRun.currentEnemy = {
      ...template,
      isBoss: true,
      maxHp: Math.floor(template.baseHp * difficultyMult),
      hp: Math.floor(template.baseHp * difficultyMult),
      damage: Math.floor(template.baseDamage * difficultyMult),
      defense: Math.floor(template.baseDefense * difficultyMult),
      currentPhase: 1,
      maxPhases: template.phases || 1
    };

    this.logCombat(`BOSS: ${template.emoji} ${template.name} blocks your path!`);

    if (window.audioSystem) {
      window.audioSystem.playSFX('bossSpawn');
    }
  }

  /**
   * Execute a boop attack
   */
  boop(multiplier = 1.0) {
    if (!this.currentRun || !this.currentRun.currentEnemy) return null;

    const enemy = this.currentRun.currentEnemy;
    let damage = this.currentRun.playerDamage * multiplier;

    // Apply enemy defense
    damage = Math.max(1, damage - enemy.defense * 0.5);

    // Check for critical
    const isCrit = Math.random() < 0.15;
    if (isCrit) {
      damage *= 2;
    }

    damage = Math.floor(damage);
    enemy.hp = Math.max(0, enemy.hp - damage);

    this.logCombat(`You deal ${damage} damage!${isCrit ? ' CRITICAL!' : ''}`);

    // Check if enemy defeated
    if (enemy.hp <= 0) {
      return this.onEnemyDefeated();
    }

    // Enemy attacks back
    return this.enemyAttack();
  }

  /**
   * Enemy attack
   */
  enemyAttack() {
    if (!this.currentRun || !this.currentRun.currentEnemy) return null;

    const enemy = this.currentRun.currentEnemy;
    let damage = enemy.damage;

    // Apply player defense
    damage = Math.max(1, damage - this.currentRun.playerDefense);
    damage = Math.floor(damage);

    this.currentRun.playerHp = Math.max(0, this.currentRun.playerHp - damage);

    this.logCombat(`${enemy.emoji} deals ${damage} damage!`);

    // Check for player defeat
    if (this.currentRun.playerHp <= 0) {
      return this.onPlayerDefeated();
    }

    return {
      status: 'ongoing',
      playerHp: this.currentRun.playerHp,
      enemyHp: enemy.hp
    };
  }

  /**
   * Handle enemy defeated
   */
  onEnemyDefeated() {
    const enemy = this.currentRun.currentEnemy;
    const chapter = this.currentRun.chapter;

    this.logCombat(`${enemy.emoji} ${enemy.name} defeated!`);

    if (enemy.isBoss) {
      // Boss defeated - chapter complete!
      return this.completeChapter();
    }

    // Regular enemy - advance to next floor
    this.advanceFloor();

    return {
      status: 'floor_cleared',
      nextFloor: this.currentRun.currentFloor,
      playerHp: this.currentRun.playerHp
    };
  }

  /**
   * Handle player defeated
   */
  onPlayerDefeated() {
    this.logCombat('You have fallen in the memories...');

    const result = {
      status: 'defeat',
      chapterId: this.currentRun.chapterId,
      floorReached: this.currentRun.currentFloor,
      timeElapsed: Date.now() - this.currentRun.startTime
    };

    this.currentRun = null;

    return result;
  }

  /**
   * Complete a chapter
   */
  completeChapter(chapterId = null) {
    const id = chapterId || this.currentRun?.chapterId;
    if (!id) return null;

    const chapter = this.chapters[id];
    if (!chapter) return null;

    // Mark as completed
    if (!this.completedChapters.includes(id)) {
      this.completedChapters.push(id);
      this.stats.totalChaptersCompleted++;
    }

    // Unlock lore
    const loreEntry = this.loreEntries[chapter.loreEntryId];
    if (loreEntry && !this.unlockedLore.includes(chapter.loreEntryId)) {
      this.unlockedLore.push(chapter.loreEntryId);
      this.stats.totalLoreUnlocked++;

      if (chapter.type === 'secret') {
        this.stats.secretsDiscovered++;
      }
    }

    // Prepare rewards
    const rewards = { ...chapter.reward };

    // Clear current run
    const runData = this.currentRun ? {
      timeElapsed: Date.now() - this.currentRun.startTime,
      floorsCleared: this.currentRun.currentFloor
    } : {};

    this.currentRun = null;

    this.logCombat(`Chapter Complete: ${chapter.name}!`);

    if (window.audioSystem) {
      window.audioSystem.playSFX('victory');
    }

    return {
      status: 'victory',
      chapterId: id,
      chapter,
      loreEntry,
      rewards,
      ...runData
    };
  }

  /**
   * Get a specific lore entry
   */
  getLoreEntry(entryId) {
    const entry = this.loreEntries[entryId];
    if (!entry) return null;

    return {
      ...entry,
      unlocked: this.unlockedLore.includes(entryId)
    };
  }

  /**
   * Get all unlocked lore entries
   */
  getUnlockedLore() {
    return this.unlockedLore.map(id => this.loreEntries[id]).filter(Boolean);
  }

  /**
   * Get lore entries grouped by character
   */
  getLoreByCharacter() {
    const grouped = {
      masters: {},
      waifus: {},
      secrets: []
    };

    for (const [id, entry] of Object.entries(this.loreEntries)) {
      const unlocked = this.unlockedLore.includes(id);

      if (entry.masterId) {
        if (!grouped.masters[entry.masterId]) {
          grouped.masters[entry.masterId] = [];
        }
        grouped.masters[entry.masterId].push({ ...entry, unlocked });
      } else if (entry.waifuId) {
        if (!grouped.waifus[entry.waifuId]) {
          grouped.waifus[entry.waifuId] = [];
        }
        grouped.waifus[entry.waifuId].push({ ...entry, unlocked });
      } else if (entry.type === 'secret') {
        grouped.secrets.push({ ...entry, unlocked });
      }
    }

    return grouped;
  }

  /**
   * Add collected fragments
   */
  addFragments(amount = 1) {
    this.totalFragmentsCollected += amount;
    this.checkUnlocks();
  }

  /**
   * Check for any unlock triggers
   */
  checkUnlocks() {
    // Could trigger notifications for newly available chapters
    // For now, just update state
  }

  /**
   * Log combat message
   */
  logCombat(message) {
    if (this.currentRun) {
      this.currentRun.combatLog.push({
        message,
        timestamp: Date.now()
      });

      // Keep only last 50 messages
      if (this.currentRun.combatLog.length > 50) {
        this.currentRun.combatLog = this.currentRun.combatLog.slice(-50);
      }
    }
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      completedChapters: this.completedChapters,
      unlockedLore: this.unlockedLore,
      collectedFragments: this.collectedFragments,
      totalFragmentsCollected: this.totalFragmentsCollected,
      stats: this.stats
    };
  }

  /**
   * Load from save data
   */
  deserialize(data) {
    if (data.completedChapters) this.completedChapters = data.completedChapters;
    if (data.unlockedLore) this.unlockedLore = data.unlockedLore;
    if (data.collectedFragments) this.collectedFragments = data.collectedFragments;
    if (data.totalFragmentsCollected !== undefined) this.totalFragmentsCollected = data.totalFragmentsCollected;
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
  }

  /**
   * Reset for prestige
   */
  reset(keepLore = true) {
    this.completedChapters = [];
    this.currentRun = null;

    if (!keepLore) {
      this.unlockedLore = [];
      this.collectedFragments = {};
      this.totalFragmentsCollected = 0;
      this.stats = {
        totalChaptersCompleted: 0,
        totalLoreUnlocked: 0,
        secretsDiscovered: 0,
        memoriesExplored: 0
      };
    }
  }
}

// ============================================
// EXPORTS
// ============================================
window.MEMORY_CHAPTERS = MEMORY_CHAPTERS;
window.WAIFU_MEMORY_CHAPTERS = WAIFU_MEMORY_CHAPTERS;
window.MEMORY_LORE_ENTRIES = LORE_ENTRIES;
window.WAIFU_LORE_ENTRIES = WAIFU_LORE_ENTRIES;
window.MEMORY_ENEMIES = MEMORY_ENEMIES;
window.MEMORY_BOSSES = MEMORY_BOSSES;
window.MemoryFragmentsSystem = MemoryFragmentsSystem;
