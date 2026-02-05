/**
 * minigame.js - Chase the Jade Dot Mini-Game
 * "The path to enlightenment is paved with laser pointers."
 */

/**
 * JadeDotGame - A clicking mini-game for bonus rewards
 */
class JadeDotGame {
  constructor() {
    this.isActive = false;
    this.score = 0;
    this.timeRemaining = 0;
    this.gameDuration = 15000; // 15 seconds
    this.dotElement = null;
    this.containerElement = null;
    this.timerInterval = null;
    this.moveInterval = null;
    this.difficulty = 1;
    this.dotsCaught = 0;
    this.dotsSpawned = 0;
    this.combo = 0;
    this.maxCombo = 0;

    // Difficulty scaling
    this.baseMoveSpeed = 1500; // ms between moves
    this.minMoveSpeed = 300;

    // Rewards
    this.baseRewardPerDot = 10;
    this.comboMultiplier = 0.1;
  }

  /**
   * Check if mini-game can be started
   */
  canStart() {
    return !this.isActive;
  }

  /**
   * Start the mini-game
   */
  start(difficulty = 1) {
    if (!this.canStart()) return false;

    this.isActive = true;
    this.score = 0;
    this.difficulty = difficulty;
    this.dotsCaught = 0;
    this.dotsSpawned = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.timeRemaining = this.gameDuration;

    // Create game UI
    this.createGameUI();

    // Play start sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('event');
    }

    // Start timers
    this.startTimers();

    return true;
  }

  /**
   * Create the game UI overlay
   */
  createGameUI() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'jade-dot-overlay';
    overlay.className = 'jade-dot-overlay';
    overlay.innerHTML = `
      <div class="jade-dot-header">
        <div class="jade-dot-score">
          <span class="score-label">Score:</span>
          <span id="jade-dot-score" class="score-value">0</span>
        </div>
        <div class="jade-dot-combo ${this.combo > 0 ? '' : 'hidden'}">
          <span id="jade-dot-combo" class="combo-value">${this.combo}x</span> COMBO
        </div>
        <div class="jade-dot-timer">
          <div id="jade-dot-timer-bar" class="timer-bar"></div>
        </div>
      </div>
      <div id="jade-dot-container" class="jade-dot-container">
        <div id="jade-dot" class="jade-dot">💎</div>
      </div>
      <div class="jade-dot-instructions">
        Click the jade dot before it moves!
      </div>
    `;

    document.body.appendChild(overlay);

    this.containerElement = document.getElementById('jade-dot-container');
    this.dotElement = document.getElementById('jade-dot');

    // Add click handler
    this.dotElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.catchDot();
    });

    // Miss handler (clicking container but not dot)
    this.containerElement.addEventListener('click', () => {
      this.missDot();
    });

    // Initial position
    this.moveDot();

    // Fade in
    setTimeout(() => overlay.classList.add('visible'), 10);
  }

  /**
   * Start game timers
   */
  startTimers() {
    // Main game timer
    this.timerInterval = setInterval(() => {
      this.timeRemaining -= 100;
      this.updateTimerUI();

      if (this.timeRemaining <= 0) {
        this.endGame();
      }
    }, 100);

    // Dot movement timer
    const moveSpeed = Math.max(
      this.minMoveSpeed,
      this.baseMoveSpeed - (this.difficulty * 200)
    );

    this.moveInterval = setInterval(() => {
      this.moveDot();
    }, moveSpeed);
  }

  /**
   * Move the dot to a random position
   */
  moveDot() {
    if (!this.dotElement || !this.containerElement) return;

    const container = this.containerElement.getBoundingClientRect();
    const dotSize = 50;

    const maxX = container.width - dotSize - 20;
    const maxY = container.height - dotSize - 20;

    const newX = 10 + Math.random() * maxX;
    const newY = 10 + Math.random() * maxY;

    this.dotElement.style.left = newX + 'px';
    this.dotElement.style.top = newY + 'px';

    this.dotsSpawned++;

    // Increase difficulty over time
    if (this.dotsSpawned % 5 === 0) {
      this.increaseDifficulty();
    }
  }

  /**
   * Player caught the dot
   */
  catchDot() {
    this.dotsCaught++;
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);

    // Calculate score with combo
    const comboBonus = 1 + (this.combo * this.comboMultiplier);
    const pointsEarned = Math.floor(this.baseRewardPerDot * this.difficulty * comboBonus);
    this.score += pointsEarned;

    // Update UI
    this.updateScoreUI();
    this.showCatchEffect(pointsEarned);

    // Play sound
    if (window.audioSystem) {
      if (this.combo >= 5) {
        window.audioSystem.playSFX('critical');
      } else {
        window.audioSystem.playSFX('boop');
      }
    }

    // Move dot immediately
    this.moveDot();
  }

  /**
   * Player missed (clicked but didn't hit dot)
   */
  missDot() {
    this.combo = 0;
    this.updateComboUI();

    // Play miss sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('error');
    }

    // Visual feedback
    this.containerElement.classList.add('miss');
    setTimeout(() => {
      this.containerElement.classList.remove('miss');
    }, 200);
  }

  /**
   * Increase difficulty mid-game
   */
  increaseDifficulty() {
    // Speed up dot movement
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }

    const moveSpeed = Math.max(
      this.minMoveSpeed,
      this.baseMoveSpeed - (this.difficulty * 200) - (this.dotsSpawned * 10)
    );

    this.moveInterval = setInterval(() => {
      this.moveDot();
    }, moveSpeed);
  }

  /**
   * Update score display
   */
  updateScoreUI() {
    const scoreEl = document.getElementById('jade-dot-score');
    if (scoreEl) {
      scoreEl.textContent = this.score;
    }
    this.updateComboUI();
  }

  /**
   * Update combo display
   */
  updateComboUI() {
    const comboEl = document.getElementById('jade-dot-combo');
    const comboContainer = comboEl?.parentElement;

    if (comboEl) {
      comboEl.textContent = this.combo + 'x';
    }

    if (comboContainer) {
      if (this.combo > 0) {
        comboContainer.classList.remove('hidden');
        if (this.combo >= 10) {
          comboContainer.classList.add('mega');
        } else if (this.combo >= 5) {
          comboContainer.classList.add('super');
        }
      } else {
        comboContainer.classList.add('hidden');
        comboContainer.classList.remove('mega', 'super');
      }
    }
  }

  /**
   * Update timer display
   */
  updateTimerUI() {
    const timerBar = document.getElementById('jade-dot-timer-bar');
    if (timerBar) {
      const percent = (this.timeRemaining / this.gameDuration) * 100;
      timerBar.style.width = percent + '%';

      // Change color as time runs out
      if (percent < 20) {
        timerBar.classList.add('critical');
      } else if (percent < 50) {
        timerBar.classList.add('warning');
      }
    }
  }

  /**
   * Show catch effect
   */
  showCatchEffect(points) {
    const effect = document.createElement('div');
    effect.className = 'jade-catch-effect';
    effect.textContent = '+' + points;

    if (this.combo >= 5) {
      effect.classList.add('combo-bonus');
    }

    const dotRect = this.dotElement.getBoundingClientRect();
    effect.style.left = dotRect.left + 'px';
    effect.style.top = dotRect.top + 'px';

    document.body.appendChild(effect);

    setTimeout(() => effect.remove(), 1000);
  }

  /**
   * End the game
   */
  endGame() {
    this.isActive = false;

    // Stop timers
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }

    // Calculate final rewards
    const rewards = this.calculateRewards();

    // Apply rewards
    if (window.gameState) {
      window.gameState.boopPoints += rewards.bp;
      window.gameState.purrPower += rewards.pp;
    }

    // Play end sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('levelup');
    }

    // Show results
    this.showResultsUI(rewards);
  }

  /**
   * Calculate end-game rewards
   */
  calculateRewards() {
    const accuracy = this.dotsSpawned > 0 ? this.dotsCaught / this.dotsSpawned : 0;

    // Base rewards from score
    let bp = this.score * 10;
    let pp = Math.floor(this.score / 2);

    // Bonus for high accuracy
    if (accuracy >= 0.9) {
      bp = Math.floor(bp * 1.5);
      pp = Math.floor(pp * 1.5);
    } else if (accuracy >= 0.7) {
      bp = Math.floor(bp * 1.25);
      pp = Math.floor(pp * 1.25);
    }

    // Combo bonus
    if (this.maxCombo >= 10) {
      bp = Math.floor(bp * 1.5);
    } else if (this.maxCombo >= 5) {
      bp = Math.floor(bp * 1.25);
    }

    // Jade Catnip for exceptional performance
    let jadeCatnip = 0;
    if (this.score >= 500 && accuracy >= 0.8) {
      jadeCatnip = 1;
      if (window.gameState) {
        window.gameState.jadeCatnip = (window.gameState.jadeCatnip || 0) + 1;
      }
    }

    return {
      bp,
      pp,
      jadeCatnip,
      score: this.score,
      dotsCaught: this.dotsCaught,
      dotsSpawned: this.dotsSpawned,
      accuracy: Math.floor(accuracy * 100),
      maxCombo: this.maxCombo
    };
  }

  /**
   * Show results screen
   */
  showResultsUI(rewards) {
    const overlay = document.getElementById('jade-dot-overlay');
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="jade-dot-results">
        <h2 class="results-title">✨ Game Complete! ✨</h2>

        <div class="results-score">
          <span class="big-score">${rewards.score}</span>
          <span class="score-label">points</span>
        </div>

        <div class="results-stats">
          <div class="stat-row">
            <span class="stat-label">Dots Caught:</span>
            <span class="stat-value">${rewards.dotsCaught}/${rewards.dotsSpawned}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Accuracy:</span>
            <span class="stat-value ${rewards.accuracy >= 80 ? 'good' : ''}">${rewards.accuracy}%</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Max Combo:</span>
            <span class="stat-value ${rewards.maxCombo >= 5 ? 'good' : ''}">${rewards.maxCombo}x</span>
          </div>
        </div>

        <div class="results-rewards">
          <h3>Rewards</h3>
          <div class="reward-row">
            <span class="reward-label">BP:</span>
            <span class="reward-value">+${rewards.bp}</span>
          </div>
          <div class="reward-row">
            <span class="reward-label">PP:</span>
            <span class="reward-value">+${rewards.pp}</span>
          </div>
          ${rewards.jadeCatnip > 0 ? `
            <div class="reward-row rare">
              <span class="reward-label">Jade Catnip:</span>
              <span class="reward-value">+${rewards.jadeCatnip}</span>
            </div>
          ` : ''}
        </div>

        <button id="jade-dot-close" class="jade-button">Continue</button>
      </div>
    `;

    // Add close handler
    document.getElementById('jade-dot-close').addEventListener('click', () => {
      this.closeGame();
    });
  }

  /**
   * Close and cleanup
   */
  closeGame() {
    const overlay = document.getElementById('jade-dot-overlay');
    if (overlay) {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 300);
    }

    // Update displays
    if (window.updateResourceDisplay) {
      window.updateResourceDisplay();
    }
  }

  /**
   * Serialize (nothing to save for mini-game)
   */
  serialize() {
    return {
      highScore: this.highScore || 0
    };
  }

  /**
   * Deserialize
   */
  deserialize(data) {
    if (data?.highScore) {
      this.highScore = data.highScore;
    }
  }
}

// Export
window.JadeDotGame = JadeDotGame;
