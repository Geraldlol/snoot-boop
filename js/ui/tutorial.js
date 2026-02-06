/**
 * tutorial.js - Progressive Disclosure Tutorial System
 * Snoot Booper: Idle Wuxia Cat Sanctuary
 * "Every master was once a student. Every journey begins with a single step."
 *
 * Features:
 * - Step-by-step tutorial progression
 * - Contextual tooltips and highlights
 * - Skip functionality with confirmation
 * - Re-accessible from settings
 * - Saves progress to localStorage
 */

console.log('Loading Tutorial System...');

// ===================================
// TUTORIAL STEPS CONFIGURATION
// ===================================

const TUTORIAL_STEPS = {
  // === CORE MECHANICS ===
  welcome: {
    id: 'welcome',
    order: 1,
    title: 'Welcome, Young Cultivator!',
    message: 'Welcome to the Celestial Snoot Sect! You have been chosen to walk the path of the Snoot Booper.',
    icon: '🙏',
    highlight: null,
    action: 'continue',
    reward: null,
    nextStep: 'first_boop'
  },

  first_boop: {
    id: 'first_boop',
    order: 2,
    title: 'The Sacred Boop',
    message: 'Click the BOOP button to perform your first sacred boop! This is the foundation of all cultivation.',
    icon: '👆',
    highlight: '.boop-button',
    action: 'boop',
    actionCount: 1,
    reward: { bp: 100 },
    nextStep: 'boop_combo'
  },

  boop_combo: {
    id: 'boop_combo',
    order: 3,
    title: 'Combo Mastery',
    message: 'Keep booping to build a combo! Each consecutive boop increases your power. Try to reach a 10-combo!',
    icon: '🔥',
    highlight: '.combo-display',
    action: 'combo',
    actionCount: 10,
    reward: { bp: 500 },
    nextStep: 'first_cat'
  },

  first_cat: {
    id: 'first_cat',
    order: 4,
    title: 'Your First Disciple',
    message: 'Excellent! Now let\'s recruit your first cat disciple. Cats generate Purr Power (PP) even while you\'re away!',
    icon: '🐱',
    highlight: '[data-tab="cats"]',
    action: 'navigate',
    target: 'cats',
    reward: { jadeCatnip: 50 },
    nextStep: 'cat_happiness'
  },

  cat_happiness: {
    id: 'cat_happiness',
    order: 5,
    title: 'Cat Happiness',
    message: 'Happy cats produce more PP! Boop your cats regularly to keep them content.',
    icon: '😺',
    highlight: '.cat-card',
    action: 'boop_cat',
    reward: null,
    nextStep: 'first_waifu'
  },

  first_waifu: {
    id: 'first_waifu',
    order: 6,
    title: 'The Immortal Masters',
    message: 'The Twelve Immortal Masters can teach you powerful techniques. Visit the Waifus tab to meet them!',
    icon: '💕',
    highlight: '[data-tab="waifus"]',
    action: 'navigate',
    target: 'waifus',
    reward: { waifuTokens: 10 },
    nextStep: 'waifu_bond'
  },

  waifu_bond: {
    id: 'waifu_bond',
    order: 7,
    title: 'Building Bonds',
    message: 'Interact with Mochi-chan to increase your bond! Higher bonds unlock new techniques and rewards.',
    icon: '💖',
    highlight: '.waifu-card',
    action: 'interact_waifu',
    reward: null,
    nextStep: 'first_goose'
  },

  // === GOOSE SYSTEM ===
  first_goose: {
    id: 'first_goose',
    order: 8,
    title: 'HONK! A Wild Goose!',
    message: 'Sometimes a goose will appear! Boop its snoot before it escapes for bonus rewards. Be quick!',
    icon: '🦢',
    highlight: null,
    action: 'info',
    reward: null,
    nextStep: 'techniques_intro'
  },

  // === TECHNIQUES ===
  techniques_intro: {
    id: 'techniques_intro',
    order: 9,
    title: 'Technique Stances',
    message: 'As you progress, you\'ll unlock different boop techniques. Each has unique strengths!',
    icon: '☯️',
    highlight: '[data-tab="techniques"]',
    action: 'navigate',
    target: 'techniques',
    reward: null,
    nextStep: 'first_dungeon'
  },

  // === DUNGEONS ===
  first_dungeon: {
    id: 'first_dungeon',
    order: 10,
    title: 'The Infinite Pagoda',
    message: 'When your cats are strong enough, challenge the Infinite Pagoda! Form a team of 4 cats and climb as high as you can.',
    icon: '⚔️',
    highlight: '[data-tab="dungeons"]',
    action: 'navigate',
    target: 'dungeons',
    reward: null,
    nextStep: 'buildings_intro'
  },

  // === BUILDINGS ===
  buildings_intro: {
    id: 'buildings_intro',
    order: 11,
    title: 'Sect Expansion',
    message: 'Build structures to expand your sect! Each building provides unique bonuses.',
    icon: '🏛️',
    highlight: '[data-tab="buildings"]',
    action: 'navigate',
    target: 'buildings',
    reward: { bp: 1000 },
    nextStep: 'cultivation_intro'
  },

  // === CULTIVATION ===
  cultivation_intro: {
    id: 'cultivation_intro',
    order: 12,
    title: 'Cultivation Realms',
    message: 'Your cultivation realm determines your power. Progress through realms by gaining XP and passing tribulations!',
    icon: '🌟',
    highlight: '.cultivation-display',
    action: 'info',
    reward: null,
    nextStep: 'afk_intro'
  },

  // === AFK SYSTEM ===
  afk_intro: {
    id: 'afk_intro',
    order: 13,
    title: 'Idle Cultivation',
    message: 'Your cats generate PP even when you\'re away! Check back later to collect your gains. Steve\'s passive doubles offline PP!',
    icon: '😴',
    highlight: null,
    action: 'info',
    reward: null,
    nextStep: 'tutorial_complete'
  },

  // === COMPLETION ===
  tutorial_complete: {
    id: 'tutorial_complete',
    order: 99,
    title: 'Tutorial Complete!',
    message: 'You have learned the basics of the Celestial Snoot Sect! Continue your journey to reach the highest realms of cultivation!',
    icon: '🎉',
    highlight: null,
    action: 'complete',
    reward: { bp: 5000, jadeCatnip: 100 },
    nextStep: null
  }
};

// Step categories for progress display
const TUTORIAL_CATEGORIES = {
  basics: {
    name: 'Basics',
    steps: ['welcome', 'first_boop', 'boop_combo'],
    icon: '📚'
  },
  cats: {
    name: 'Cat Disciples',
    steps: ['first_cat', 'cat_happiness'],
    icon: '🐱'
  },
  waifus: {
    name: 'Immortal Masters',
    steps: ['first_waifu', 'waifu_bond'],
    icon: '💕'
  },
  advanced: {
    name: 'Advanced',
    steps: ['first_goose', 'techniques_intro', 'first_dungeon', 'buildings_intro', 'cultivation_intro', 'afk_intro'],
    icon: '⚔️'
  }
};

// ===================================
// TUTORIAL SYSTEM CLASS
// ===================================

class TutorialSystem {
  constructor() {
    this.completedSteps = [];
    this.currentStep = null;
    this.tutorialActive = false;
    this.tooltipElement = null;
    this.highlightElement = null;
    this.overlayElement = null;
    this.stepProgress = {};
    this.initialized = false;

    this.init();
  }

  init() {
    this.loadProgress();
    this.addStyles();
    this.createElements();
    this.setupEventListeners();

    this.initialized = true;
    console.log('  Tutorial System initialized');

    // Auto-start tutorial for new players
    if (this.completedSteps.length === 0 && !this.hasSkippedTutorial()) {
      setTimeout(() => this.start(), 1000);
    }
  }

  addStyles() {
    if (document.getElementById('tutorial-styles')) return;

    const style = document.createElement('style');
    style.id = 'tutorial-styles';
    style.textContent = `
      /* Tutorial overlay */
      .tutorial-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 8000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .tutorial-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }

      /* Tutorial highlight box */
      .tutorial-highlight {
        position: fixed;
        border: 3px solid var(--gold-accent);
        border-radius: 8px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px var(--gold-accent);
        z-index: 8001;
        pointer-events: none;
        opacity: 0;
        transition: all 0.3s ease;
      }

      .tutorial-highlight.active {
        opacity: 1;
      }

      .tutorial-highlight::after {
        content: '';
        position: absolute;
        top: -6px;
        left: -6px;
        right: -6px;
        bottom: -6px;
        border: 2px dashed var(--gold-accent);
        border-radius: 12px;
        animation: highlight-pulse 1.5s ease-in-out infinite;
      }

      @keyframes highlight-pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.02); }
      }

      /* Tutorial tooltip */
      .tutorial-tooltip {
        position: fixed;
        max-width: 350px;
        background: linear-gradient(135deg, rgba(40, 30, 60, 0.98), rgba(26, 26, 46, 0.98));
        border: 3px solid var(--gold-accent);
        border-radius: 12px;
        padding: 20px;
        z-index: 8002;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.2);
      }

      .tutorial-tooltip.active {
        opacity: 1;
        transform: translateY(0);
      }

      .tutorial-tooltip-arrow {
        position: absolute;
        width: 0;
        height: 0;
        border: 10px solid transparent;
      }

      .tutorial-tooltip-arrow.top {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-bottom-color: var(--gold-accent);
      }

      .tutorial-tooltip-arrow.bottom {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-top-color: var(--gold-accent);
      }

      .tutorial-tooltip-arrow.left {
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        border-right-color: var(--gold-accent);
      }

      .tutorial-tooltip-arrow.right {
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        border-left-color: var(--gold-accent);
      }

      .tutorial-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
      }

      .tutorial-icon {
        font-size: 28px;
      }

      .tutorial-title {
        font-family: var(--font-pixel);
        font-size: 12px;
        color: var(--gold-accent);
      }

      .tutorial-step-indicator {
        font-family: var(--font-pixel);
        font-size: 8px;
        color: #888;
        margin-left: auto;
      }

      .tutorial-message {
        font-family: var(--font-pixel);
        font-size: 10px;
        color: #ccc;
        line-height: 1.6;
        margin-bottom: 15px;
      }

      .tutorial-progress {
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        margin-bottom: 15px;
        overflow: hidden;
      }

      .tutorial-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--jade), var(--gold-accent));
        transition: width 0.3s ease;
      }

      .tutorial-actions {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }

      .tutorial-btn {
        padding: 8px 15px;
        font-family: var(--font-pixel);
        font-size: 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        border: 2px solid;
      }

      .tutorial-btn-primary {
        background: linear-gradient(135deg, var(--gold-accent), #B8860B);
        border-color: #B8860B;
        color: #1a1a2e;
      }

      .tutorial-btn-primary:hover {
        filter: brightness(1.1);
        box-shadow: 0 0 15px var(--gold-accent);
      }

      .tutorial-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
        color: #aaa;
      }

      .tutorial-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .tutorial-reward {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 10px;
        background: rgba(255, 215, 0, 0.1);
        border-radius: 6px;
        margin-bottom: 15px;
        font-size: 9px;
        color: var(--gold-accent);
      }

      .tutorial-reward-icon {
        font-size: 18px;
      }

      /* Progress panel for settings */
      .tutorial-progress-panel {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 15px;
      }

      .tutorial-category {
        margin-bottom: 15px;
      }

      .tutorial-category:last-child {
        margin-bottom: 0;
      }

      .tutorial-category-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 10px;
        color: var(--jade);
      }

      .tutorial-category-steps {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
      }

      .tutorial-step-badge {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
      }

      .tutorial-step-badge.completed {
        background: var(--jade);
        border-color: var(--jade-dark);
        color: white;
      }

      .tutorial-step-badge.current {
        background: var(--gold-accent);
        border-color: #B8860B;
        color: #1a1a2e;
        animation: current-pulse 1s ease-in-out infinite;
      }

      @keyframes current-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
        50% { box-shadow: 0 0 0 8px rgba(255, 215, 0, 0); }
      }

      /* Contextual help button */
      .tutorial-help-btn {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--gold-accent);
        border: none;
        color: #1a1a2e;
        font-size: 20px;
        cursor: pointer;
        z-index: 100;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        transition: all 0.2s;
      }

      .tutorial-help-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
      }

      .tutorial-help-btn.hidden {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  createElements() {
    // Create overlay
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'tutorial-overlay';
    document.body.appendChild(this.overlayElement);

    // Create highlight box
    this.highlightElement = document.createElement('div');
    this.highlightElement.className = 'tutorial-highlight';
    document.body.appendChild(this.highlightElement);

    // Create tooltip
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'tutorial-tooltip';
    document.body.appendChild(this.tooltipElement);

    // Create help button
    const helpBtn = document.createElement('button');
    helpBtn.className = 'tutorial-help-btn';
    helpBtn.innerHTML = '?';
    helpBtn.title = 'Tutorial Help';
    helpBtn.addEventListener('click', () => this.showHelpMenu());
    document.body.appendChild(helpBtn);
    this.helpButton = helpBtn;
  }

  setupEventListeners() {
    // Listen for tutorial-relevant game events
    window.addEventListener('boop', () => this.onBoop());
    window.addEventListener('cat-recruited', () => this.onCatRecruited());
    window.addEventListener('waifu-interact', () => this.onWaifuInteract());
    window.addEventListener('goose-booped', () => this.onGooseBooped());
    window.addEventListener('navigation', (e) => this.onNavigation(e.detail?.screen));

    // Resize handler
    window.addEventListener('resize', () => {
      if (this.currentStep) {
        this.positionTooltip();
      }
    });
  }

  // ===================================
  // PUBLIC METHODS
  // ===================================

  /**
   * Start the tutorial from the beginning or resume
   */
  start() {
    if (this.tutorialActive) return;

    this.tutorialActive = true;

    // Find first incomplete step
    const sortedSteps = Object.values(TUTORIAL_STEPS).sort((a, b) => a.order - b.order);
    const nextStep = sortedSteps.find(step => !this.isStepComplete(step.id));

    if (nextStep) {
      this.showStep(nextStep.id);
    } else {
      this.tutorialActive = false;
    }
  }

  /**
   * Advance to the next tutorial step
   */
  nextStep() {
    if (!this.currentStep) return;

    const current = TUTORIAL_STEPS[this.currentStep];
    if (!current) return;

    // Mark current as complete
    this.markComplete(this.currentStep);

    // Grant reward
    if (current.reward) {
      this.grantReward(current.reward);
    }

    // Move to next step
    if (current.nextStep) {
      this.showStep(current.nextStep);
    } else {
      this.completeTutorial();
    }
  }

  /**
   * Skip the tutorial with confirmation
   */
  skipTutorial() {
    if (window.modalManager) {
      window.modalManager.confirm(
        'Skip Tutorial?',
        'Are you sure you want to skip the tutorial? You can restart it from the Settings menu.',
        () => {
          this.forceSkip();
        }
      );
    } else {
      if (confirm('Skip the tutorial?')) {
        this.forceSkip();
      }
    }
  }

  /**
   * Force skip without confirmation
   */
  forceSkip() {
    this.tutorialActive = false;
    this.hideTooltip();
    this.hideHighlight();
    localStorage.setItem('tutorial_skipped', 'true');
    this.saveProgress();

    if (window.showNotification) {
      window.showNotification({
        type: 'warning',
        title: 'Tutorial Skipped',
        message: 'You can restart the tutorial from Settings.'
      });
    }
  }

  /**
   * Check if a step is complete
   * @param {string} stepId - Step identifier
   */
  isStepComplete(stepId) {
    return this.completedSteps.includes(stepId);
  }

  /**
   * Mark a step as complete
   * @param {string} stepId - Step identifier
   */
  markComplete(stepId) {
    if (!this.completedSteps.includes(stepId)) {
      this.completedSteps.push(stepId);
      this.saveProgress();
    }
  }

  /**
   * Show a contextual tooltip on an element
   * @param {string|Element} element - Selector or element
   * @param {string} message - Tooltip message
   * @param {Object} options - Additional options
   */
  showTooltip(element, message, options = {}) {
    const targetEl = typeof element === 'string' ? document.querySelector(element) : element;
    if (!targetEl) return;

    const content = `
      <div class="tutorial-header">
        <span class="tutorial-icon">${options.icon || 'ℹ️'}</span>
        <span class="tutorial-title">${options.title || 'Tip'}</span>
      </div>
      <div class="tutorial-message">${message}</div>
      <div class="tutorial-actions">
        <button class="tutorial-btn tutorial-btn-primary" onclick="tutorialSystem.hideTooltip()">Got it!</button>
      </div>
      <div class="tutorial-tooltip-arrow ${options.position || 'bottom'}"></div>
    `;

    this.tooltipElement.innerHTML = content;
    this.positionTooltipNear(targetEl, options.position || 'bottom');
    this.tooltipElement.classList.add('active');
  }

  /**
   * Highlight an element
   * @param {string} selector - CSS selector
   */
  highlightElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      this.hideHighlight();
      return;
    }

    const rect = element.getBoundingClientRect();
    const padding = 8;

    this.highlightElement.style.cssText = `
      top: ${rect.top - padding}px;
      left: ${rect.left - padding}px;
      width: ${rect.width + padding * 2}px;
      height: ${rect.height + padding * 2}px;
    `;

    this.highlightElement.classList.add('active');
    this.overlayElement.classList.add('active');

    // Allow clicks on highlighted element
    element.style.position = 'relative';
    element.style.zIndex = '8003';
  }

  /**
   * Hide the tooltip
   */
  hideTooltip() {
    this.tooltipElement.classList.remove('active');
  }

  /**
   * Hide the highlight
   */
  hideHighlight() {
    this.highlightElement.classList.remove('active');
    this.overlayElement.classList.remove('active');
  }

  /**
   * Get tutorial progress percentage
   */
  getProgress() {
    const totalSteps = Object.keys(TUTORIAL_STEPS).length;
    const completed = this.completedSteps.length;
    return Math.round((completed / totalSteps) * 100);
  }

  /**
   * Reset tutorial progress
   */
  resetTutorial() {
    this.completedSteps = [];
    this.currentStep = null;
    this.stepProgress = {};
    localStorage.removeItem('tutorial_skipped');
    this.saveProgress();

    if (window.showNotification) {
      window.showNotification({
        type: 'success',
        title: 'Tutorial Reset',
        message: 'The tutorial has been reset. Start it from Settings.'
      });
    }
  }

  /**
   * Render progress panel for settings
   */
  renderProgressPanel() {
    let html = '<div class="tutorial-progress-panel">';

    for (const [categoryId, category] of Object.entries(TUTORIAL_CATEGORIES)) {
      html += `
        <div class="tutorial-category">
          <div class="tutorial-category-header">
            <span>${category.icon}</span>
            <span>${category.name}</span>
          </div>
          <div class="tutorial-category-steps">
      `;

      category.steps.forEach((stepId, index) => {
        const isComplete = this.isStepComplete(stepId);
        const isCurrent = this.currentStep === stepId;
        const statusClass = isCurrent ? 'current' : isComplete ? 'completed' : '';

        html += `
          <div class="tutorial-step-badge ${statusClass}" title="${TUTORIAL_STEPS[stepId]?.title || stepId}">
            ${isComplete ? '✓' : isCurrent ? '→' : index + 1}
          </div>
        `;
      });

      html += '</div></div>';
    }

    html += `
      <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
        <button class="tutorial-btn tutorial-btn-primary" onclick="tutorialSystem.start()">
          ${this.completedSteps.length > 0 ? 'Resume' : 'Start'} Tutorial
        </button>
        <button class="tutorial-btn tutorial-btn-secondary" onclick="tutorialSystem.resetTutorial()">
          Reset
        </button>
      </div>
    </div>`;

    return html;
  }

  // ===================================
  // INTERNAL METHODS
  // ===================================

  showStep(stepId) {
    const step = TUTORIAL_STEPS[stepId];
    if (!step) {
      this.completeTutorial();
      return;
    }

    this.currentStep = stepId;
    this.stepProgress[stepId] = 0;

    // Highlight element if specified
    if (step.highlight) {
      this.highlightElement(step.highlight);
    } else {
      this.hideHighlight();
    }

    // Build tooltip content
    const progress = this.getProgress();
    const rewardHtml = step.reward ? this.renderRewardPreview(step.reward) : '';

    const content = `
      <div class="tutorial-header">
        <span class="tutorial-icon">${step.icon}</span>
        <span class="tutorial-title">${step.title}</span>
        <span class="tutorial-step-indicator">${step.order}/${Object.keys(TUTORIAL_STEPS).length}</span>
      </div>

      <div class="tutorial-progress">
        <div class="tutorial-progress-fill" style="width: ${progress}%"></div>
      </div>

      <div class="tutorial-message">${step.message}</div>

      ${rewardHtml}

      <div class="tutorial-actions">
        <button class="tutorial-btn tutorial-btn-secondary" onclick="tutorialSystem.skipTutorial()">
          Skip Tutorial
        </button>
        <button class="tutorial-btn tutorial-btn-primary" onclick="tutorialSystem.nextStep()">
          ${step.action === 'continue' || step.action === 'info' ? 'Continue' : 'Got it!'}
        </button>
      </div>

      <div class="tutorial-tooltip-arrow top"></div>
    `;

    this.tooltipElement.innerHTML = content;
    this.positionTooltip();
    this.tooltipElement.classList.add('active');
  }

  positionTooltip() {
    const step = TUTORIAL_STEPS[this.currentStep];
    if (!step) return;

    if (step.highlight) {
      const target = document.querySelector(step.highlight);
      if (target) {
        this.positionTooltipNear(target, 'bottom');
        return;
      }
    }

    // Center on screen
    const rect = this.tooltipElement.getBoundingClientRect();
    this.tooltipElement.style.left = `${(window.innerWidth - rect.width) / 2}px`;
    this.tooltipElement.style.top = `${(window.innerHeight - rect.height) / 2}px`;
  }

  positionTooltipNear(target, position) {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const padding = 15;

    let left, top;

    switch (position) {
      case 'bottom':
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        top = targetRect.bottom + padding;
        break;
      case 'top':
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        top = targetRect.top - tooltipRect.height - padding;
        break;
      case 'left':
        left = targetRect.left - tooltipRect.width - padding;
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        left = targetRect.right + padding;
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        break;
    }

    // Keep on screen
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));

    this.tooltipElement.style.left = `${left}px`;
    this.tooltipElement.style.top = `${top}px`;
  }

  renderRewardPreview(reward) {
    const items = [];

    if (reward.bp) items.push(`<span>+${reward.bp} BP</span>`);
    if (reward.pp) items.push(`<span>+${reward.pp} PP</span>`);
    if (reward.jadeCatnip) items.push(`<span>+${reward.jadeCatnip} Jade Catnip</span>`);
    if (reward.waifuTokens) items.push(`<span>+${reward.waifuTokens} Waifu Tokens</span>`);

    if (items.length === 0) return '';

    return `
      <div class="tutorial-reward">
        <span class="tutorial-reward-icon">🎁</span>
        ${items.join(' ')}
      </div>
    `;
  }

  grantReward(reward) {
    if (typeof gameState !== 'undefined') {
      if (reward.bp) gameState.boopPoints = (gameState.boopPoints || 0) + reward.bp;
      if (reward.pp) gameState.purrPower = (gameState.purrPower || 0) + reward.pp;
      if (reward.jadeCatnip) gameState.jadeCatnip = (gameState.jadeCatnip || 0) + reward.jadeCatnip;
      if (reward.waifuTokens) gameState.waifuTokens = (gameState.waifuTokens || 0) + reward.waifuTokens;
    }

    if (window.showNotification) {
      const items = [];
      if (reward.bp) items.push(`+${reward.bp} BP`);
      if (reward.jadeCatnip) items.push(`+${reward.jadeCatnip} Jade Catnip`);

      window.showNotification({
        type: 'success',
        title: 'Reward Claimed!',
        message: items.join(', ')
      });
    }
  }

  completeTutorial() {
    this.tutorialActive = false;
    this.currentStep = null;
    this.hideTooltip();
    this.hideHighlight();

    if (window.showNotification) {
      window.showNotification({
        type: 'achievement',
        title: 'Tutorial Complete!',
        message: 'You have mastered the basics of the Celestial Snoot Sect!'
      });
    }

    this.saveProgress();
  }

  showHelpMenu() {
    if (window.modalManager) {
      window.modalManager.show({
        title: 'Tutorial Help',
        icon: '📚',
        content: `
          <p style="margin-bottom: 15px;">Need help? Here are your options:</p>
          ${this.renderProgressPanel()}
        `,
        buttons: [{ label: 'Close', primary: true }]
      });
    }
  }

  // ===================================
  // EVENT HANDLERS
  // ===================================

  onBoop() {
    if (!this.tutorialActive) return;

    if (this.currentStep === 'first_boop') {
      this.nextStep();
    } else if (this.currentStep === 'boop_combo') {
      this.stepProgress['boop_combo'] = (this.stepProgress['boop_combo'] || 0) + 1;
      if (this.stepProgress['boop_combo'] >= 10) {
        this.nextStep();
      }
    }
  }

  onCatRecruited() {
    if (!this.tutorialActive) return;
    if (this.currentStep === 'first_cat') {
      this.nextStep();
    }
  }

  onWaifuInteract() {
    if (!this.tutorialActive) return;
    if (this.currentStep === 'waifu_bond') {
      this.nextStep();
    }
  }

  onGooseBooped() {
    if (!this.tutorialActive) return;
    if (this.currentStep === 'first_goose') {
      this.nextStep();
    }
  }

  onNavigation(screen) {
    if (!this.tutorialActive) return;

    const step = TUTORIAL_STEPS[this.currentStep];
    if (step?.action === 'navigate' && step.target === screen) {
      this.nextStep();
    }
  }

  // ===================================
  // PERSISTENCE
  // ===================================

  saveProgress() {
    const data = {
      completedSteps: this.completedSteps,
      currentStep: this.currentStep,
      stepProgress: this.stepProgress
    };
    localStorage.setItem('tutorial_progress', JSON.stringify(data));
  }

  loadProgress() {
    try {
      const data = JSON.parse(localStorage.getItem('tutorial_progress'));
      if (data) {
        this.completedSteps = data.completedSteps || [];
        this.stepProgress = data.stepProgress || {};
      }
    } catch (e) {
      console.warn('Failed to load tutorial progress:', e);
    }
  }

  hasSkippedTutorial() {
    return localStorage.getItem('tutorial_skipped') === 'true';
  }

  // ===================================
  // DEBUG
  // ===================================

  getDebugInfo() {
    return {
      isActive: this.tutorialActive,
      currentStep: this.currentStep,
      completedSteps: this.completedSteps,
      progress: this.getProgress(),
      stepProgress: this.stepProgress
    };
  }
}

// ===================================
// GLOBAL INSTANCE
// ===================================

let tutorialSystem = null;

function initTutorialSystem() {
  tutorialSystem = new TutorialSystem();
  window.tutorialSystem = tutorialSystem;
  console.log('Tutorial System loaded successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTutorialSystem);
} else {
  initTutorialSystem();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TutorialSystem, TUTORIAL_STEPS, TUTORIAL_CATEGORIES };
}
