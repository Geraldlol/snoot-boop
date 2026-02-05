/**
 * goose.js - The Way of the Goose
 * "Peace was never an option."
 */

// Goose Mood States
const GOOSE_MOODS = {
  calm: {
    id: 'calm',
    name: 'Calm',
    speed: 1,
    dodgeChance: 0.1,
    rewardMultiplier: 10,
    color: '#87CEEB'
  },
  suspicious: {
    id: 'suspicious',
    name: 'Suspicious',
    speed: 2,
    dodgeChance: 0.3,
    rewardMultiplier: 25,
    color: '#FFD700'
  },
  aggressive: {
    id: 'aggressive',
    name: 'Aggressive',
    speed: 3,
    dodgeChance: 0.5,
    rewardMultiplier: 50,
    color: '#FF6347'
  },
  rage: {
    id: 'rage',
    name: 'RAGE',
    speed: 5,
    dodgeChance: 0.7,
    rewardMultiplier: 100,
    color: '#FF0000'
  }
};

// Legendary Geese
const LEGENDARY_GEESE = {
  untitled: {
    id: 'untitled',
    name: 'The Untitled Goose',
    title: 'Horrible',
    description: "It's a lovely day in the Jianghu, and you are a horrible goose.",
    emoji: '🦢',
    baseMood: 'aggressive',
    special: 'steals_items',
    hp: 1,
    rarity: 0.15, // 15% of goose spawns
    drops: ['stolen_treasure', 'chaos_energy'],
    stealAmount: 0.1, // Steals 10% of BP on escape
    dialogue: [
      "*menacing waddle*",
      "HONK! (Translation: Your stuff is mine now.)",
      "*stares at your inventory*"
    ]
  },

  elder: {
    id: 'elder',
    name: 'Goose Elder',
    title: 'The Honking Sage',
    description: 'His honk shattered a mountain. His waddle toppled an empire.',
    emoji: '🧙',
    baseMood: 'calm',
    special: 'wisdom_test',
    hp: 3, // Requires 3 boops
    rarity: 0.10,
    drops: ['elder_feather', 'wisdom_of_honk'],
    rewardMultiplier: 2,
    dialogue: [
      "HONK... (Translation: You seek wisdom?)",
      "*ancient honking*",
      "The path of the Goose is long..."
    ]
  },

  golden: {
    id: 'golden',
    name: 'The Golden Goose',
    title: 'Fortune Incarnate',
    description: 'Legends say its feathers are made of pure Jade Catnip.',
    emoji: '✨',
    baseMood: 'suspicious',
    special: 'extreme_speed',
    hp: 1,
    rarity: 0.05, // 5% of goose spawns - very rare
    drops: ['golden_feather', 'lucky_egg'],
    speedMultiplier: 2,
    goldReward: true,
    dialogue: [
      "*sparkles magnificently*",
      "HONK! (Translation: Catch me if you can!)",
      "*leaves golden trail*"
    ]
  },

  cobraChicken: {
    id: 'cobraChicken',
    name: 'Cobra Chicken',
    title: 'Avatar of Chaos',
    description: 'Not a cobra. Not a chicken. Somehow worse than both.',
    emoji: '🐍',
    baseMood: 'rage',
    special: 'final_boss',
    hp: 10, // Requires 10 boops!
    rarity: 0, // Only spawns after 1000 goose boops
    unlockCondition: { gooseBoops: 1000 },
    drops: ['chaos_feather', 'goose_ally_unlock'],
    dialogue: [
      "HJÖNK HJÖNK AM GOOSE",
      "*reality warps around it*",
      "CHAOS REIGNS!"
    ]
  }
};

// Goose Ally Types
const GOOSE_ALLIES = {
  guard: {
    id: 'guard',
    name: 'Guard Goose',
    emoji: '🛡️',
    description: 'Protects your AFK gains from random theft events',
    effect: { preventTheft: true },
    quote: "HONK! (Translation: None shall pass!)"
  },
  attack: {
    id: 'attack',
    name: 'Attack Goose',
    emoji: '⚔️',
    description: '+25% damage to all boops',
    effect: { boopDamageBonus: 1.25 },
    quote: "HONK! (Translation: Violence is always the answer.)"
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos Goose',
    emoji: '🎲',
    description: 'Random events happen 2x more often (good AND bad)',
    effect: { eventFrequencyMult: 2.0 },
    quote: "HONK! (Translation: Let's make things interesting.)"
  },
  honk: {
    id: 'honk',
    name: 'Honk Goose',
    emoji: '📢',
    description: 'Intimidates cats into working harder (+25% PP)',
    effect: { ppGenerationBonus: 1.25 },
    quote: "HONK! (Translation: WORK HARDER, FELINES.)"
  }
};

/**
 * GooseSystem - Handles goose encounters and allies
 */
class GooseSystem {
  constructor() {
    this.activeGoose = null;
    this.gooseTimer = null;
    this.timeRemaining = 0;
    this.spawnChance = 0.15; // 15% per minute base
    this.timeLimit = 30000; // 30 seconds
    this.spawnInterval = null;

    // Stats
    this.gooseBoops = 0;
    this.goldenGooseBoops = 0;
    this.cobraChickenDefeated = false;
    this.gooseAllyUnlocked = false;
    this.selectedAlly = null;
    this.rageGooseBooped = false;
    this.goldenGooseCrit = false;
  }

  /**
   * Start the goose spawn timer
   */
  start() {
    this.spawnInterval = setInterval(() => {
      if (!this.activeGoose) {
        this.checkForSpawn();
      }
    }, 20000); // Check every 20 seconds
  }

  /**
   * Stop the goose system
   */
  stop() {
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
    }
    if (this.gooseTimer) {
      clearInterval(this.gooseTimer);
    }
  }

  /**
   * Check if a goose should spawn
   */
  checkForSpawn() {
    let chance = this.spawnChance;

    // Chaos Goose ally doubles event frequency
    if (this.selectedAlly?.id === 'chaos') {
      chance *= 2;
    }

    if (Math.random() < chance) {
      this.spawnGoose();
    }
  }

  /**
   * Spawn a goose encounter
   */
  spawnGoose() {
    let goose = this.selectGooseType();

    // Create goose instance
    this.activeGoose = {
      ...goose,
      currentHp: goose.hp,
      mood: GOOSE_MOODS[goose.baseMood],
      position: this.randomPosition()
    };

    this.timeRemaining = this.timeLimit;

    // Play goose sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('goose');
    }

    // Show goose UI
    this.showGooseUI();

    // Start countdown
    this.gooseTimer = setInterval(() => {
      this.timeRemaining -= 100;
      this.updateTimerUI();

      // Random movement based on speed
      if (Math.random() < this.activeGoose.mood.speed * 0.03) {
        this.moveGoose();
      }

      if (this.timeRemaining <= 0) {
        this.gooseEscapes();
      }
    }, 100);

    // Scatter cats (happiness drop)
    this.scatterCats();
  }

  /**
   * Select which type of goose to spawn
   */
  selectGooseType() {
    // Check for Cobra Chicken unlock
    if (this.gooseBoops >= 1000 && !this.cobraChickenDefeated && Math.random() < 0.1) {
      return { ...LEGENDARY_GEESE.cobraChicken };
    }

    // Roll for legendary goose
    const roll = Math.random();
    let cumulative = 0;

    for (const legendary of Object.values(LEGENDARY_GEESE)) {
      if (legendary.id === 'cobraChicken') continue; // Skip, handled above
      cumulative += legendary.rarity;
      if (roll < cumulative) {
        return { ...legendary };
      }
    }

    // Normal goose
    return this.createNormalGoose();
  }

  /**
   * Create a normal goose
   */
  createNormalGoose() {
    const mood = this.rollMood();
    return {
      id: 'normal_' + Date.now(),
      name: 'Wild Goose',
      title: 'Wandering Terror',
      emoji: '🦢',
      description: 'A wild goose has appeared!',
      baseMood: mood,
      hp: 1,
      drops: ['goose_feather'],
      dialogue: ['HONK!', '*aggressive waddling*', '*stares menacingly*']
    };
  }

  /**
   * Roll for mood
   */
  rollMood() {
    const roll = Math.random();
    if (roll < 0.4) return 'calm';
    if (roll < 0.7) return 'suspicious';
    if (roll < 0.95) return 'aggressive';
    return 'rage';
  }

  /**
   * Random position within container
   */
  randomPosition() {
    return {
      x: 10 + Math.random() * 80, // 10-90%
      y: 10 + Math.random() * 70  // 10-80%
    };
  }

  /**
   * Move the goose to a new position
   */
  moveGoose() {
    if (!this.activeGoose) return;
    this.activeGoose.position = this.randomPosition();
    this.updateGoosePosition();
  }

  /**
   * Attempt to boop the goose
   */
  attemptBoop() {
    if (!this.activeGoose) return null;

    const goose = this.activeGoose;

    // Check for dodge
    if (Math.random() < goose.mood.dodgeChance) {
      this.moveGoose();
      this.playDodgeAnimation();
      return { hit: false, dodged: true };
    }

    // Hit! Reduce HP
    goose.currentHp--;

    // Check for critical (uses player's crit chance)
    const critChance = window.gameState?.critChance || 0.05;
    const isCrit = Math.random() < critChance;

    if (isCrit && goose.currentHp > 0) {
      goose.currentHp--; // Crits deal double damage
    }

    // Check if defeated
    if (goose.currentHp <= 0) {
      return this.gooseDefeated(isCrit);
    }

    // Multi-hit boss still alive
    this.playHitAnimation();
    this.updateHpUI();

    return { hit: true, defeated: false, hpRemaining: goose.currentHp };
  }

  /**
   * Goose has been defeated
   */
  gooseDefeated(isCrit) {
    clearInterval(this.gooseTimer);

    const goose = this.activeGoose;

    // Calculate rewards
    const baseReward = 1000;
    let reward = baseReward * goose.mood.rewardMultiplier;

    // Legendary bonus
    if (goose.rewardMultiplier) {
      reward *= goose.rewardMultiplier;
    }

    // Critical bonus
    if (isCrit) {
      reward *= 3;
    }

    // Attack Goose ally bonus
    if (this.selectedAlly?.id === 'attack') {
      reward *= 1.25;
    }

    // Apply reward
    if (window.gameState) {
      window.gameState.boopPoints += reward;
      window.gameState.gooseFeathers = (window.gameState.gooseFeathers || 0) + 1;

      // Golden Goose special rewards
      if (goose.goldReward) {
        window.gameState.goldenFeathers = (window.gameState.goldenFeathers || 0) + 1;
        window.gameState.jadeCatnip = (window.gameState.jadeCatnip || 0) + 1;
        this.goldenGooseBoops++;
        if (isCrit) {
          this.goldenGooseCrit = true;
          window.gameState.goldenGooseCrit = true;
        }
      }
    }

    // Update stats
    this.gooseBoops++;
    if (window.gameState) {
      window.gameState.gooseBoops = this.gooseBoops;
    }

    // Track rage goose
    if (goose.mood.id === 'rage') {
      this.rageGooseBooped = true;
      if (window.gameState) {
        window.gameState.rageGooseBooped = true;
      }
    }

    // Special handling for Cobra Chicken
    if (goose.id === 'cobraChicken') {
      this.cobraChickenDefeated = true;
      this.gooseAllyUnlocked = true;
      if (window.gameState) {
        window.gameState.cobraChickenDefeated = true;
      }
      this.showAllyUnlockUI();
    }

    // Check for brave cats
    this.checkBraveHearts();

    // Play victory sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('goose_hit');
      // Play achievement sound for legendary geese
      if (goose.id !== 'normal_' && !goose.id.startsWith('normal_')) {
        window.audioSystem.playSFX('achievement');
      }
    }

    // Show victory
    this.showVictoryUI(reward, isCrit, goose);

    // Hide goose
    this.hideGooseUI();
    this.activeGoose = null;

    return {
      hit: true,
      defeated: true,
      reward,
      isCrit,
      gooseType: goose.id
    };
  }

  /**
   * Goose escapes
   */
  gooseEscapes() {
    clearInterval(this.gooseTimer);

    const goose = this.activeGoose;

    // Play escape sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('error');
    }

    // Apply escape penalty
    if (goose.special === 'steals_items' && window.gameState) {
      const stealAmount = Math.floor(window.gameState.boopPoints * (goose.stealAmount || 0.05));
      window.gameState.boopPoints = Math.max(0, window.gameState.boopPoints - stealAmount);
      this.showEscapeUI(stealAmount);
    } else {
      this.showEscapeUI(0);
    }

    this.hideGooseUI();
    this.activeGoose = null;
  }

  /**
   * Scatter cats when goose appears
   */
  scatterCats() {
    if (!window.catSystem) return;

    const cats = window.catSystem.getAllCats();
    for (const cat of cats) {
      // Divine cats are immune
      if (cat.realm === 'divine') continue;

      // Check courage
      const courage = cat.braveHeart ? 1.0 : 0.1;
      if (Math.random() > courage) {
        cat.temporaryFear = true;
        cat.happiness = Math.max(0, cat.happiness - 20);
      } else {
        cat.facedGoose = true;
      }
    }
  }

  /**
   * Check for brave heart buff
   */
  checkBraveHearts() {
    if (!window.catSystem) return;

    const cats = window.catSystem.getAllCats();
    for (const cat of cats) {
      if (cat.facedGoose && !cat.braveHeart) {
        cat.braveHeart = true;
        // Could show notification here
      }
      cat.facedGoose = false;
      cat.temporaryFear = false;
      cat.happiness = Math.min(100, cat.happiness + 10);
    }
  }

  /**
   * Select a goose ally
   */
  selectAlly(allyId) {
    if (!this.gooseAllyUnlocked) return false;

    const ally = GOOSE_ALLIES[allyId];
    if (!ally) return false;

    this.selectedAlly = ally;
    if (window.gameState) {
      window.gameState.gooseAlly = ally;
    }

    return ally;
  }

  /**
   * Get ally effects
   */
  getAllyEffects() {
    if (!this.selectedAlly) return {};
    return this.selectedAlly.effect;
  }

  // === UI Methods ===

  showGooseUI() {
    const overlay = document.getElementById('goose-overlay');
    const target = document.getElementById('goose-target');
    const mood = document.getElementById('goose-mood');

    if (overlay && target && this.activeGoose) {
      target.textContent = this.activeGoose.emoji || '🦢';
      target.style.left = this.activeGoose.position.x + '%';
      target.style.top = this.activeGoose.position.y + '%';

      mood.textContent = `Mood: ${this.activeGoose.mood.name}`;
      mood.style.color = this.activeGoose.mood.color;

      // Show HP for multi-hit bosses
      if (this.activeGoose.hp > 1) {
        mood.textContent += ` | HP: ${this.activeGoose.currentHp}/${this.activeGoose.hp}`;
      }

      overlay.classList.remove('hidden');
    }
  }

  hideGooseUI() {
    const overlay = document.getElementById('goose-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  updateGoosePosition() {
    const target = document.getElementById('goose-target');
    if (target && this.activeGoose) {
      target.style.left = this.activeGoose.position.x + '%';
      target.style.top = this.activeGoose.position.y + '%';
    }
  }

  updateTimerUI() {
    const timerBar = document.getElementById('goose-timer-bar');
    if (timerBar) {
      const percent = (this.timeRemaining / this.timeLimit) * 100;
      timerBar.style.width = percent + '%';
    }
  }

  updateHpUI() {
    const mood = document.getElementById('goose-mood');
    if (mood && this.activeGoose && this.activeGoose.hp > 1) {
      mood.textContent = `Mood: ${this.activeGoose.mood.name} | HP: ${this.activeGoose.currentHp}/${this.activeGoose.hp}`;
    }
  }

  playDodgeAnimation() {
    const target = document.getElementById('goose-target');
    if (target) {
      target.style.transform = 'scale(1.2) rotate(10deg)';
      setTimeout(() => {
        target.style.transform = '';
      }, 200);
    }
  }

  playHitAnimation() {
    const target = document.getElementById('goose-target');
    if (target) {
      target.style.filter = 'brightness(2)';
      setTimeout(() => {
        target.style.filter = '';
      }, 100);
    }

    // Play hit sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('goose_hit');
    }
  }

  showVictoryUI(reward, isCrit, goose) {
    const message = isCrit
      ? `CRITICAL HONK! +${reward} BP!`
      : `Goose defeated! +${reward} BP!`;

    // Use the game's floating text if available
    if (window.showFloatingText) {
      window.showFloatingText(message, true);
    }
  }

  showEscapeUI(stolenAmount) {
    const message = stolenAmount > 0
      ? `Goose escaped! Stole ${stolenAmount} BP!`
      : `Goose escaped! HONK!`;

    if (window.showFloatingText) {
      window.showFloatingText(message, false);
    }
  }

  showAllyUnlockUI() {
    // Show modal or notification for ally selection
    const notification = document.createElement('div');
    notification.className = 'goose-ally-unlock';
    notification.innerHTML = `
      <h2>🦢 COBRA CHICKEN DEFEATED! 🦢</h2>
      <p>You may now recruit a Goose Ally!</p>
      <div class="ally-options">
        ${Object.values(GOOSE_ALLIES).map(ally => `
          <button class="ally-option" onclick="window.gooseSystem.selectAlly('${ally.id}'); this.parentElement.parentElement.remove();">
            <span class="ally-emoji">${ally.emoji}</span>
            <span class="ally-name">${ally.name}</span>
            <span class="ally-desc">${ally.description}</span>
          </button>
        `).join('')}
      </div>
    `;
    document.body.appendChild(notification);
  }

  /**
   * Serialize for saving
   */
  serialize() {
    return {
      gooseBoops: this.gooseBoops,
      goldenGooseBoops: this.goldenGooseBoops,
      cobraChickenDefeated: this.cobraChickenDefeated,
      gooseAllyUnlocked: this.gooseAllyUnlocked,
      selectedAlly: this.selectedAlly,
      rageGooseBooped: this.rageGooseBooped,
      goldenGooseCrit: this.goldenGooseCrit
    };
  }

  /**
   * Load from save
   */
  deserialize(data) {
    if (!data) return;
    this.gooseBoops = data.gooseBoops || 0;
    this.goldenGooseBoops = data.goldenGooseBoops || 0;
    this.cobraChickenDefeated = data.cobraChickenDefeated || false;
    this.gooseAllyUnlocked = data.gooseAllyUnlocked || false;
    this.selectedAlly = data.selectedAlly || null;
    this.rageGooseBooped = data.rageGooseBooped || false;
    this.goldenGooseCrit = data.goldenGooseCrit || false;
  }
}

// Export
window.GOOSE_MOODS = GOOSE_MOODS;
window.LEGENDARY_GEESE = LEGENDARY_GEESE;
window.GOOSE_ALLIES = GOOSE_ALLIES;
window.GooseSystem = GooseSystem;
