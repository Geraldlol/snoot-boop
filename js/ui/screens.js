/**
 * screens.js - Screen Management System
 * Snoot Booper: Idle Wuxia Cat Sanctuary
 * "Navigate the halls of the Celestial Snoot Sect with grace."
 *
 * Features:
 * - Screen transitions with CSS animations
 * - Screen stack for modal-like navigation
 * - Screen registration for extensibility
 * - History tracking for back navigation
 */

console.log('Loading Screen Manager...');

// ===================================
// SCREEN CONFIGURATIONS
// ===================================

const SCREEN_CONFIGS = {
  main: {
    id: 'main',
    name: 'Main Sanctuary',
    icon: '🏠',
    description: 'Your sect headquarters',
    allowBack: false,
    persistent: true
  },
  cats: {
    id: 'cats',
    name: 'Cat Collection',
    icon: '🐱',
    description: 'Manage your feline cultivators',
    allowBack: true,
    parent: 'main'
  },
  waifus: {
    id: 'waifus',
    name: 'Immortal Masters',
    icon: '💕',
    description: 'Bond with the Twelve Immortal Masters',
    allowBack: true,
    parent: 'main'
  },
  dungeons: {
    id: 'dungeons',
    name: 'Dungeons',
    icon: '⚔️',
    description: 'Enter the Infinite Pagoda and beyond',
    allowBack: true,
    parent: 'main'
  },
  buildings: {
    id: 'buildings',
    name: 'Sect Buildings',
    icon: '🏛️',
    description: 'Expand your sanctuary',
    allowBack: true,
    parent: 'main'
  },
  prestige: {
    id: 'prestige',
    name: 'Ascension',
    icon: '🌟',
    description: 'Transcend to greater power',
    allowBack: true,
    parent: 'main'
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    description: 'Configure your cultivation experience',
    allowBack: true,
    parent: 'main',
    modal: true
  },
  codex: {
    id: 'codex',
    name: 'Codex',
    icon: '📜',
    description: 'Lore, achievements, and secrets',
    allowBack: true,
    parent: 'main',
    modal: true
  },
  social: {
    id: 'social',
    name: 'Sect Network',
    icon: '🤝',
    description: 'Connect with the Seven Wandering Masters',
    allowBack: true,
    parent: 'main',
    modal: true
  },
  techniques: {
    id: 'techniques',
    name: 'Techniques',
    icon: '☯️',
    description: 'Master the sacred boop arts',
    allowBack: true,
    parent: 'main'
  },
  equipment: {
    id: 'equipment',
    name: 'Equipment',
    icon: '🗡️',
    description: 'Gear up your cats for battle',
    allowBack: true,
    parent: 'main'
  },
  crafting: {
    id: 'crafting',
    name: 'Crafting',
    icon: '🔧',
    description: 'Create powerful items and potions',
    allowBack: true,
    parent: 'main'
  },
  expeditions: {
    id: 'expeditions',
    name: 'Expeditions',
    icon: '🗺️',
    description: 'Send cats on adventures',
    allowBack: true,
    parent: 'main'
  }
};

// Screen transition types
const TRANSITION_TYPES = {
  fade: {
    enter: 'screen-fade-in',
    exit: 'screen-fade-out',
    duration: 300
  },
  slide: {
    enter: 'screen-slide-in',
    exit: 'screen-slide-out',
    duration: 400
  },
  scale: {
    enter: 'screen-scale-in',
    exit: 'screen-scale-out',
    duration: 350
  },
  none: {
    enter: '',
    exit: '',
    duration: 0
  }
};

// ===================================
// SCREEN MANAGER CLASS
// ===================================

class ScreenManager {
  constructor() {
    this.currentScreen = null;
    this.previousScreen = null;
    this.screenStack = [];
    this.screens = { ...SCREEN_CONFIGS };
    this.transitionType = 'fade';
    this.isTransitioning = false;
    this.screenElements = {};
    this.onScreenChangeCallbacks = [];
    this.initialized = false;

    this.init();
  }

  init() {
    // Add transition styles
    this.addStyles();

    // Cache screen elements
    this.cacheScreenElements();

    // Set up keyboard shortcuts
    this.setupKeyboardShortcuts();

    this.initialized = true;
    console.log('  Screen Manager initialized');
  }

  addStyles() {
    if (document.getElementById('screen-manager-styles')) return;

    const style = document.createElement('style');
    style.id = 'screen-manager-styles';
    style.textContent = `
      /* Screen base states */
      .screen {
        display: none;
        opacity: 0;
        transform-origin: center center;
      }

      .screen.active {
        display: block;
        opacity: 1;
      }

      .screen.transitioning {
        pointer-events: none;
      }

      /* Fade transitions */
      .screen-fade-in {
        animation: screenFadeIn 0.3s ease-out forwards;
      }

      .screen-fade-out {
        animation: screenFadeOut 0.3s ease-out forwards;
      }

      @keyframes screenFadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes screenFadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      /* Slide transitions */
      .screen-slide-in {
        animation: screenSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .screen-slide-out {
        animation: screenSlideOut 0.4s ease-out forwards;
      }

      @keyframes screenSlideIn {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes screenSlideOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(-30px);
        }
      }

      /* Scale transitions */
      .screen-scale-in {
        animation: screenScaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .screen-scale-out {
        animation: screenScaleOut 0.35s ease-out forwards;
      }

      @keyframes screenScaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes screenScaleOut {
        from {
          opacity: 1;
          transform: scale(1);
        }
        to {
          opacity: 0;
          transform: scale(0.95);
        }
      }

      /* Screen stack overlay */
      .screen-stack-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 900;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .screen-stack-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }

      /* Stacked screen styling */
      .screen.stacked {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
      }

      /* Navigation breadcrumb */
      .screen-breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 15px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        margin-bottom: 15px;
        font-size: 9px;
      }

      .breadcrumb-item {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #888;
        cursor: pointer;
        transition: color 0.2s;
      }

      .breadcrumb-item:hover {
        color: var(--jade);
      }

      .breadcrumb-item.current {
        color: var(--jade-light);
        cursor: default;
      }

      .breadcrumb-separator {
        color: #555;
      }

      /* Back button */
      .screen-back-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        color: #aaa;
        font-family: var(--font-pixel);
        font-size: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .screen-back-btn:hover {
        background: rgba(80, 200, 120, 0.1);
        border-color: var(--jade);
        color: var(--jade);
      }

      .screen-back-btn .back-arrow {
        font-size: 12px;
      }
    `;
    document.head.appendChild(style);
  }

  cacheScreenElements() {
    // Find all screen elements in the DOM
    const screenElements = document.querySelectorAll('[data-screen], .screen');
    screenElements.forEach(el => {
      const screenId = el.dataset.screen || el.id?.replace('-screen', '');
      if (screenId) {
        this.screenElements[screenId] = el;
      }
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // ESC to go back
      if (e.key === 'Escape' && this.screenStack.length > 0) {
        this.pop();
        return;
      }

      // Number keys for quick navigation (1-9)
      if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.altKey) {
        const screenKeys = Object.keys(this.screens).filter(k => !this.screens[k].modal);
        const index = parseInt(e.key) - 1;
        if (screenKeys[index]) {
          this.show(screenKeys[index]);
        }
      }
    });
  }

  // ===================================
  // PUBLIC METHODS
  // ===================================

  /**
   * Register a new screen configuration
   * @param {string} id - Screen identifier
   * @param {Object} config - Screen configuration
   */
  registerScreen(id, config) {
    this.screens[id] = {
      id,
      name: config.name || id,
      icon: config.icon || '📄',
      description: config.description || '',
      allowBack: config.allowBack !== false,
      parent: config.parent || 'main',
      modal: config.modal || false,
      onShow: config.onShow || null,
      onHide: config.onHide || null,
      ...config
    };

    console.log(`  Registered screen: ${id}`);
    return this.screens[id];
  }

  /**
   * Show a screen with transition
   * @param {string} screenId - Screen to show
   * @param {Object} options - Transition options
   */
  show(screenId, options = {}) {
    const screen = this.screens[screenId];
    if (!screen) {
      console.warn(`Screen not found: ${screenId}`);
      return false;
    }

    if (this.isTransitioning) {
      console.warn('Screen transition in progress');
      return false;
    }

    if (this.currentScreen === screenId && !options.force) {
      return false;
    }

    const transition = TRANSITION_TYPES[options.transition || this.transitionType];

    // Store previous screen
    if (this.currentScreen) {
      this.previousScreen = this.currentScreen;
    }

    // Handle modal screens with stack
    if (screen.modal) {
      this.push(screenId, options);
      return true;
    }

    // Clear stack when showing non-modal screen
    if (this.screenStack.length > 0) {
      this.clearStack();
    }

    this.performTransition(this.currentScreen, screenId, transition, options);
    return true;
  }

  /**
   * Hide a specific screen
   * @param {string} screenId - Screen to hide
   */
  hide(screenId) {
    const element = this.getScreenElement(screenId);
    if (!element) return false;

    const transition = TRANSITION_TYPES[this.transitionType];

    element.classList.add('transitioning');
    element.classList.add(transition.exit);

    setTimeout(() => {
      element.classList.remove('active', 'transitioning', transition.exit);

      // Call onHide callback
      const screen = this.screens[screenId];
      if (screen?.onHide) {
        screen.onHide();
      }
    }, transition.duration);

    return true;
  }

  /**
   * Go back to previous screen
   */
  back() {
    // First try to pop from stack
    if (this.screenStack.length > 0) {
      this.pop();
      return true;
    }

    // Otherwise go to parent screen
    const currentConfig = this.screens[this.currentScreen];
    if (currentConfig?.parent) {
      this.show(currentConfig.parent);
      return true;
    }

    // Or go to previous screen
    if (this.previousScreen) {
      this.show(this.previousScreen);
      return true;
    }

    return false;
  }

  /**
   * Push a screen onto the stack (for modals/overlays)
   * @param {string} screenId - Screen to push
   * @param {Object} options - Options
   */
  push(screenId, options = {}) {
    const screen = this.screens[screenId];
    if (!screen) {
      console.warn(`Screen not found: ${screenId}`);
      return false;
    }

    // Add overlay if this is the first stacked screen
    if (this.screenStack.length === 0) {
      this.showStackOverlay();
    }

    // Store current screen in stack
    this.screenStack.push({
      screenId,
      timestamp: Date.now(),
      options
    });

    // Show the screen as stacked
    const element = this.getScreenElement(screenId);
    if (element) {
      element.classList.add('active', 'stacked', 'screen-scale-in');

      setTimeout(() => {
        element.classList.remove('screen-scale-in');
      }, 350);

      // Call onShow callback
      if (screen.onShow) {
        screen.onShow(options.data);
      }
    }

    this.notifyScreenChange(screenId, 'push');
    return true;
  }

  /**
   * Pop the top screen from the stack
   */
  pop() {
    if (this.screenStack.length === 0) {
      return false;
    }

    const { screenId } = this.screenStack.pop();
    const element = this.getScreenElement(screenId);

    if (element) {
      element.classList.add('screen-scale-out');

      setTimeout(() => {
        element.classList.remove('active', 'stacked', 'screen-scale-out');

        // Call onHide callback
        const screen = this.screens[screenId];
        if (screen?.onHide) {
          screen.onHide();
        }
      }, 350);
    }

    // Hide overlay if stack is empty
    if (this.screenStack.length === 0) {
      this.hideStackOverlay();
    }

    this.notifyScreenChange(
      this.screenStack.length > 0 ? this.screenStack[this.screenStack.length - 1].screenId : this.currentScreen,
      'pop'
    );

    return true;
  }

  /**
   * Get the current screen ID
   */
  getCurrentScreen() {
    // If there's a stacked screen, that's the "current" one
    if (this.screenStack.length > 0) {
      return this.screenStack[this.screenStack.length - 1].screenId;
    }
    return this.currentScreen;
  }

  /**
   * Get the screen configuration
   * @param {string} screenId - Screen ID
   */
  getScreenConfig(screenId) {
    return this.screens[screenId] || null;
  }

  /**
   * Check if a screen is currently visible
   * @param {string} screenId - Screen ID
   */
  isScreenVisible(screenId) {
    if (this.currentScreen === screenId) return true;
    return this.screenStack.some(s => s.screenId === screenId);
  }

  /**
   * Set the transition type
   * @param {string} type - Transition type (fade, slide, scale, none)
   */
  setTransitionType(type) {
    if (TRANSITION_TYPES[type]) {
      this.transitionType = type;
    }
  }

  /**
   * Register a callback for screen changes
   * @param {Function} callback - Callback function
   */
  onScreenChange(callback) {
    if (typeof callback === 'function') {
      this.onScreenChangeCallbacks.push(callback);
    }
  }

  /**
   * Generate breadcrumb for current screen
   */
  generateBreadcrumb() {
    const breadcrumb = [];
    let current = this.currentScreen;

    while (current) {
      const config = this.screens[current];
      breadcrumb.unshift({
        id: current,
        name: config?.name || current,
        icon: config?.icon || ''
      });
      current = config?.parent;
    }

    return breadcrumb;
  }

  /**
   * Render a back button
   */
  renderBackButton() {
    const config = this.screens[this.currentScreen];
    if (!config?.allowBack && this.screenStack.length === 0) {
      return '';
    }

    return `
      <button class="screen-back-btn" onclick="screenManager.back()">
        <span class="back-arrow">\u2190</span>
        <span>Back</span>
      </button>
    `;
  }

  // ===================================
  // INTERNAL METHODS
  // ===================================

  performTransition(fromScreenId, toScreenId, transition, options) {
    this.isTransitioning = true;

    const fromElement = fromScreenId ? this.getScreenElement(fromScreenId) : null;
    const toElement = this.getScreenElement(toScreenId);

    // Hide current screen
    if (fromElement) {
      fromElement.classList.add('transitioning');
      if (transition.exit) {
        fromElement.classList.add(transition.exit);
      }

      setTimeout(() => {
        fromElement.classList.remove('active', 'transitioning', transition.exit);

        // Call onHide callback
        const fromScreen = this.screens[fromScreenId];
        if (fromScreen?.onHide) {
          fromScreen.onHide();
        }
      }, transition.duration);
    }

    // Show new screen
    if (toElement) {
      // Small delay for exit animation
      setTimeout(() => {
        toElement.classList.add('active', 'transitioning');
        if (transition.enter) {
          toElement.classList.add(transition.enter);
        }

        setTimeout(() => {
          toElement.classList.remove('transitioning', transition.enter);
          this.isTransitioning = false;

          // Call onShow callback
          const toScreen = this.screens[toScreenId];
          if (toScreen?.onShow) {
            toScreen.onShow(options.data);
          }
        }, transition.duration);
      }, fromElement ? transition.duration / 2 : 0);
    } else {
      this.isTransitioning = false;
    }

    this.currentScreen = toScreenId;
    this.notifyScreenChange(toScreenId, 'show');
  }

  getScreenElement(screenId) {
    // Check cache first
    if (this.screenElements[screenId]) {
      return this.screenElements[screenId];
    }

    // Try to find by data attribute or ID
    const element = document.querySelector(`[data-screen="${screenId}"]`) ||
      document.getElementById(`${screenId}-screen`) ||
      document.getElementById(screenId);

    if (element) {
      this.screenElements[screenId] = element;
    }

    return element;
  }

  showStackOverlay() {
    let overlay = document.getElementById('screen-stack-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'screen-stack-overlay';
      overlay.className = 'screen-stack-overlay';
      overlay.addEventListener('click', () => this.pop());
      document.body.appendChild(overlay);
    }
    setTimeout(() => overlay.classList.add('active'), 10);
  }

  hideStackOverlay() {
    const overlay = document.getElementById('screen-stack-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  clearStack() {
    while (this.screenStack.length > 0) {
      this.pop();
    }
  }

  notifyScreenChange(screenId, action) {
    this.onScreenChangeCallbacks.forEach(callback => {
      try {
        callback(screenId, action, this);
      } catch (e) {
        console.error('Screen change callback error:', e);
      }
    });
  }

  // ===================================
  // DEBUG METHODS
  // ===================================

  getDebugInfo() {
    return {
      currentScreen: this.currentScreen,
      previousScreen: this.previousScreen,
      stackDepth: this.screenStack.length,
      stack: this.screenStack.map(s => s.screenId),
      registeredScreens: Object.keys(this.screens),
      isTransitioning: this.isTransitioning
    };
  }
}

// ===================================
// GLOBAL INSTANCE
// ===================================

let screenManager = null;

function initScreenManager() {
  screenManager = new ScreenManager();
  window.screenManager = screenManager;
  console.log('Screen Manager loaded successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScreenManager);
} else {
  initScreenManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ScreenManager, SCREEN_CONFIGS, TRANSITION_TYPES };
}
