/**
 * modals.js - Modal Dialog System
 * Snoot Booper: Idle Wuxia Cat Sanctuary
 * "Important messages from the heavens demand attention."
 *
 * Features:
 * - Flexible modal configuration
 * - Queue system for multiple modals
 * - Pre-built modal types for common scenarios
 * - Smooth animations and transitions
 * - Keyboard support (ESC to close, Enter to confirm)
 */

console.log('Loading Modal Manager...');

// ===================================
// MODAL TYPES AND TEMPLATES
// ===================================

const MODAL_THEMES = {
  default: {
    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.98), rgba(22, 33, 62, 0.98))',
    borderColor: 'var(--jade)',
    glowColor: 'rgba(80, 200, 120, 0.3)'
  },
  warning: {
    background: 'linear-gradient(135deg, rgba(74, 58, 26, 0.98), rgba(45, 36, 16, 0.98))',
    borderColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.3)'
  },
  danger: {
    background: 'linear-gradient(135deg, rgba(74, 26, 26, 0.98), rgba(45, 16, 16, 0.98))',
    borderColor: '#DC143C',
    glowColor: 'rgba(220, 20, 60, 0.3)'
  },
  success: {
    background: 'linear-gradient(135deg, rgba(26, 74, 46, 0.98), rgba(13, 40, 24, 0.98))',
    borderColor: '#50C878',
    glowColor: 'rgba(80, 200, 120, 0.4)'
  },
  legendary: {
    background: 'linear-gradient(135deg, rgba(58, 58, 26, 0.98), rgba(45, 45, 16, 0.98))',
    borderColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.5)'
  },
  goose: {
    background: 'linear-gradient(135deg, rgba(58, 58, 58, 0.98), rgba(42, 42, 42, 0.98))',
    borderColor: '#F5F5F5',
    glowColor: 'rgba(245, 245, 245, 0.3)'
  },
  waifu: {
    background: 'linear-gradient(135deg, rgba(74, 26, 58, 0.98), rgba(58, 16, 42, 0.98))',
    borderColor: '#FFB6C1',
    glowColor: 'rgba(255, 182, 193, 0.3)'
  },
  cultivation: {
    background: 'linear-gradient(135deg, rgba(42, 26, 74, 0.98), rgba(26, 16, 58, 0.98))',
    borderColor: '#9370DB',
    glowColor: 'rgba(147, 112, 219, 0.4)'
  }
};

const MODAL_ANIMATIONS = {
  scale: {
    enter: 'modal-scale-in',
    exit: 'modal-scale-out',
    duration: 300
  },
  slide: {
    enter: 'modal-slide-in',
    exit: 'modal-slide-out',
    duration: 350
  },
  bounce: {
    enter: 'modal-bounce-in',
    exit: 'modal-scale-out',
    duration: 400
  },
  shake: {
    enter: 'modal-shake-in',
    exit: 'modal-scale-out',
    duration: 500
  }
};

// ===================================
// MODAL MANAGER CLASS
// ===================================

class ModalManager {
  constructor() {
    this.activeModals = [];
    this.modalQueue = [];
    this.modalContainer = null;
    this.overlayElement = null;
    this.nextModalId = 1;
    this.isProcessing = false;
    this.defaultAnimation = 'scale';

    this.init();
  }

  init() {
    this.createContainer();
    this.addStyles();
    this.setupKeyboardHandlers();

    console.log('  Modal Manager initialized');
  }

  createContainer() {
    // Create modal container if it doesn't exist
    this.modalContainer = document.getElementById('modal-container');
    if (!this.modalContainer) {
      this.modalContainer = document.createElement('div');
      this.modalContainer.id = 'modal-container';
      document.body.appendChild(this.modalContainer);
    }
  }

  addStyles() {
    if (document.getElementById('modal-manager-styles')) return;

    const style = document.createElement('style');
    style.id = 'modal-manager-styles';
    style.textContent = `
      /* Modal container */
      #modal-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5000;
        display: none;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }

      #modal-container.active {
        display: flex;
        pointer-events: auto;
      }

      /* Modal overlay */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .modal-overlay.active {
        opacity: 1;
      }

      /* Modal wrapper */
      .modal-wrapper {
        position: relative;
        z-index: 1;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
      }

      /* Modal content */
      .modal-dialog {
        background: var(--modal-bg);
        border: 4px solid var(--modal-border);
        border-radius: 12px;
        padding: 25px;
        max-width: 450px;
        width: 100%;
        box-shadow: 0 0 60px var(--modal-glow), 0 20px 60px rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
      }

      .modal-dialog.large {
        max-width: 600px;
      }

      .modal-dialog.small {
        max-width: 350px;
      }

      /* Modal header */
      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .modal-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-pixel);
        font-size: 14px;
        color: var(--jade-light);
      }

      .modal-icon {
        font-size: 24px;
      }

      .modal-close {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #888;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
      }

      /* Modal body */
      .modal-body {
        font-family: var(--font-pixel);
        font-size: 10px;
        color: #ccc;
        line-height: 1.6;
        margin-bottom: 20px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .modal-body p {
        margin-bottom: 10px;
      }

      .modal-body p:last-child {
        margin-bottom: 0;
      }

      /* Modal footer */
      .modal-footer {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      /* Modal buttons */
      .modal-btn {
        padding: 10px 20px;
        font-family: var(--font-pixel);
        font-size: 9px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        border: 2px solid;
      }

      .modal-btn-primary {
        background: linear-gradient(135deg, var(--jade-light), var(--jade-dark));
        border-color: var(--jade-dark);
        color: white;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
      }

      .modal-btn-primary:hover {
        filter: brightness(1.1);
        box-shadow: 0 0 15px var(--jade);
      }

      .modal-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
        color: #ccc;
      }

      .modal-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
      }

      .modal-btn-danger {
        background: linear-gradient(135deg, #DC143C, #8B0000);
        border-color: #8B0000;
        color: white;
      }

      .modal-btn-danger:hover {
        filter: brightness(1.1);
        box-shadow: 0 0 15px #DC143C;
      }

      .modal-btn-gold {
        background: linear-gradient(135deg, #FFD700, #B8860B);
        border-color: #B8860B;
        color: #1a1a2e;
      }

      .modal-btn-gold:hover {
        filter: brightness(1.1);
        box-shadow: 0 0 15px #FFD700;
      }

      /* Modal input */
      .modal-input {
        width: 100%;
        padding: 10px 12px;
        font-family: var(--font-pixel);
        font-size: 10px;
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        color: #fff;
        margin-bottom: 15px;
        transition: border-color 0.2s;
      }

      .modal-input:focus {
        outline: none;
        border-color: var(--jade);
      }

      .modal-input::placeholder {
        color: #666;
      }

      /* Animation keyframes */
      @keyframes modal-scale-in {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes modal-scale-out {
        from {
          opacity: 1;
          transform: scale(1);
        }
        to {
          opacity: 0;
          transform: scale(0.8);
        }
      }

      @keyframes modal-slide-in {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes modal-slide-out {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(30px);
        }
      }

      @keyframes modal-bounce-in {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.95);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes modal-shake-in {
        0% {
          opacity: 0;
          transform: translateX(-10px);
        }
        20% {
          transform: translateX(10px);
        }
        40% {
          transform: translateX(-10px);
        }
        60% {
          transform: translateX(10px);
        }
        80% {
          transform: translateX(-5px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .modal-wrapper.modal-scale-in { animation: modal-scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      .modal-wrapper.modal-scale-out { animation: modal-scale-out 0.3s ease-out forwards; }
      .modal-wrapper.modal-slide-in { animation: modal-slide-in 0.35s ease-out forwards; }
      .modal-wrapper.modal-slide-out { animation: modal-slide-out 0.35s ease-out forwards; }
      .modal-wrapper.modal-bounce-in { animation: modal-bounce-in 0.4s ease-out forwards; }
      .modal-wrapper.modal-shake-in { animation: modal-shake-in 0.5s ease-out forwards; }

      /* Special modal decorations */
      .modal-dialog::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, transparent, var(--modal-border), transparent);
      }

      /* Responsive */
      @media (max-width: 480px) {
        .modal-dialog {
          padding: 20px 15px;
          margin: 10px;
        }

        .modal-title {
          font-size: 12px;
        }

        .modal-body {
          font-size: 9px;
        }

        .modal-btn {
          padding: 8px 15px;
          font-size: 8px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setupKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      if (this.activeModals.length === 0) return;

      const topModal = this.activeModals[this.activeModals.length - 1];
      if (!topModal) return;

      // ESC to close
      if (e.key === 'Escape' && topModal.config.closable !== false) {
        this.hide(topModal.id);
      }

      // Enter to confirm (if there's a primary button)
      if (e.key === 'Enter' && !e.shiftKey) {
        const primaryBtn = topModal.element?.querySelector('.modal-btn-primary');
        if (primaryBtn) {
          primaryBtn.click();
        }
      }
    });
  }

  // ===================================
  // PUBLIC METHODS
  // ===================================

  /**
   * Show a modal with the given configuration
   * @param {Object} config - Modal configuration
   * @returns {number} Modal ID
   */
  show(config) {
    const modalId = this.nextModalId++;

    const modalConfig = {
      id: modalId,
      title: config.title || '',
      icon: config.icon || '',
      content: config.content || '',
      buttons: config.buttons || [{ label: 'OK', primary: true, callback: () => this.hide(modalId) }],
      closable: config.closable !== false,
      overlay: config.overlay !== false,
      animation: config.animation || this.defaultAnimation,
      theme: config.theme || 'default',
      size: config.size || 'normal',
      onShow: config.onShow || null,
      onHide: config.onHide || null,
      data: config.data || null
    };

    // If there's already an active modal, queue this one
    if (this.activeModals.length > 0 && config.queue !== false) {
      this.modalQueue.push(modalConfig);
      return modalId;
    }

    this.displayModal(modalConfig);
    return modalId;
  }

  /**
   * Hide a modal by ID
   * @param {number} modalId - Modal ID to hide
   */
  hide(modalId) {
    const modalIndex = this.activeModals.findIndex(m => m.id === modalId);
    if (modalIndex === -1) return false;

    const modal = this.activeModals[modalIndex];
    const animation = MODAL_ANIMATIONS[modal.config.animation];

    // Add exit animation
    if (modal.element) {
      const wrapper = modal.element.querySelector('.modal-wrapper');
      if (wrapper) {
        wrapper.classList.remove(animation.enter);
        wrapper.classList.add(animation.exit);
      }
    }

    // Remove after animation
    setTimeout(() => {
      if (modal.element) {
        modal.element.remove();
      }

      // Call onHide callback
      if (modal.config.onHide) {
        modal.config.onHide(modal.config.data);
      }

      this.activeModals.splice(modalIndex, 1);

      // Hide container if no modals left
      if (this.activeModals.length === 0) {
        this.modalContainer.classList.remove('active');
      }

      // Process queue
      this.processQueue();
    }, animation.duration);

    return true;
  }

  /**
   * Confirmation dialog
   * @param {string} title - Dialog title
   * @param {string} message - Confirmation message
   * @param {Function} onConfirm - Callback on confirm
   * @param {Function} onCancel - Callback on cancel
   */
  confirm(title, message, onConfirm, onCancel) {
    return this.show({
      title,
      icon: '❓',
      content: `<p>${message}</p>`,
      theme: 'warning',
      animation: 'bounce',
      buttons: [
        {
          label: 'Cancel',
          callback: () => {
            this.hide(modalId);
            if (onCancel) onCancel();
          }
        },
        {
          label: 'Confirm',
          primary: true,
          callback: () => {
            this.hide(modalId);
            if (onConfirm) onConfirm();
          }
        }
      ]
    });
    var modalId = this.nextModalId - 1;
  }

  /**
   * Alert dialog
   * @param {string} title - Alert title
   * @param {string} message - Alert message
   */
  alert(title, message) {
    return this.show({
      title,
      icon: 'ℹ️',
      content: `<p>${message}</p>`,
      buttons: [{ label: 'OK', primary: true }]
    });
  }

  /**
   * Input prompt dialog
   * @param {string} title - Prompt title
   * @param {string} message - Prompt message
   * @param {string} defaultValue - Default input value
   * @returns {Promise} Resolves with input value or null if cancelled
   */
  prompt(title, message, defaultValue = '') {
    return new Promise((resolve) => {
      const modalId = this.show({
        title,
        icon: '✏️',
        content: `
          <p>${message}</p>
          <input type="text" class="modal-input" id="modal-prompt-input" value="${defaultValue}" placeholder="Enter value...">
        `,
        buttons: [
          {
            label: 'Cancel',
            callback: () => {
              this.hide(modalId);
              resolve(null);
            }
          },
          {
            label: 'OK',
            primary: true,
            callback: () => {
              const input = document.getElementById('modal-prompt-input');
              const value = input ? input.value : defaultValue;
              this.hide(modalId);
              resolve(value);
            }
          }
        ],
        onShow: () => {
          // Focus input
          setTimeout(() => {
            const input = document.getElementById('modal-prompt-input');
            if (input) {
              input.focus();
              input.select();
            }
          }, 100);
        }
      });
    });
  }

  /**
   * Custom modal with full configuration
   * @param {Object} config - Full modal configuration
   */
  custom(config) {
    return this.show(config);
  }

  /**
   * Hide all modals
   */
  hideAll() {
    const ids = this.activeModals.map(m => m.id);
    ids.forEach(id => this.hide(id));
    this.modalQueue = [];
  }

  // ===================================
  // PRE-BUILT MODAL TYPES
  // ===================================

  /**
   * Tribulation modal for realm breakthrough
   */
  showTribulation(tribulation, onAccept, onDecline) {
    return this.show({
      title: tribulation.name,
      icon: '⚡',
      theme: 'cultivation',
      animation: 'shake',
      size: 'large',
      content: `
        <div class="tribulation-modal-content">
          <p class="tribulation-warning">The heavens test your resolve!</p>
          <p>${tribulation.description || 'Prepare to face your tribulation.'}</p>

          <div class="tribulation-details" style="margin: 15px 0; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px;">
            <p><strong>Type:</strong> ${tribulation.type}</p>
            ${tribulation.enemy ? `<p><strong>Enemy:</strong> ${tribulation.enemy}</p>` : ''}
            ${tribulation.waves ? `<p><strong>Waves:</strong> ${tribulation.waves}</p>` : ''}
          </div>

          <div class="tribulation-rewards" style="margin-top: 15px;">
            <p style="color: var(--jade);"><strong>Success Rewards:</strong></p>
            <ul style="list-style: none; padding: 0; margin: 5px 0;">
              ${tribulation.rewards?.jadeCatnip ? `<li>+${tribulation.rewards.jadeCatnip} Jade Catnip</li>` : ''}
              ${tribulation.rewards?.technique ? `<li>New Technique: ${tribulation.rewards.technique}</li>` : ''}
              ${tribulation.rewards?.cat ? `<li>New Cat!</li>` : ''}
            </ul>
          </div>

          <p class="tribulation-fail" style="color: #DC143C; margin-top: 15px;">
            <strong>Failure Penalty:</strong> ${tribulation.failPenalty?.xpLoss ? `${tribulation.failPenalty.xpLoss * 100}% XP loss` : 'None'}
          </p>
        </div>
      `,
      closable: true,
      buttons: [
        {
          label: 'Retreat',
          callback: () => {
            this.hide(modalId);
            if (onDecline) onDecline();
          }
        },
        {
          label: 'Face Tribulation',
          primary: true,
          callback: () => {
            this.hide(modalId);
            if (onAccept) onAccept();
          }
        }
      ]
    });
    var modalId = this.nextModalId - 1;
  }

  /**
   * Gacha/Wheel of Fate result modal
   */
  showGachaResult(result) {
    const rarityColors = {
      common: '#9CA3AF',
      uncommon: '#10B981',
      rare: '#3B82F6',
      epic: '#8B5CF6',
      legendary: '#F59E0B'
    };

    return this.show({
      title: 'Wheel of Fate',
      icon: '🎰',
      theme: result.rarity === 'legendary' ? 'legendary' : 'default',
      animation: result.rarity === 'legendary' ? 'bounce' : 'scale',
      content: `
        <div class="gacha-result" style="text-align: center;">
          <div class="gacha-rarity" style="
            font-size: 24px;
            margin-bottom: 15px;
            color: ${rarityColors[result.rarity]};
            text-transform: uppercase;
            text-shadow: 0 0 10px ${rarityColors[result.rarity]};
          ">
            ${result.rarity}!
          </div>

          <div class="gacha-reward" style="
            font-size: 48px;
            margin: 20px 0;
          ">
            ${result.reward?.icon || '✨'}
          </div>

          <p style="font-size: 12px; color: var(--jade-light); margin-bottom: 10px;">
            ${result.reward?.message || 'You received a reward!'}
          </p>

          ${result.pityCounter > 0 ? `
            <p style="font-size: 8px; color: #888;">
              Pity Counter: ${result.pityCounter}/50
            </p>
          ` : ''}
        </div>
      `,
      buttons: [{ label: 'Claim', primary: true }]
    });
  }

  /**
   * Achievement unlock modal
   */
  showAchievement(achievement) {
    return this.show({
      title: 'Achievement Unlocked!',
      icon: '🏆',
      theme: 'legendary',
      animation: 'bounce',
      content: `
        <div class="achievement-modal" style="text-align: center;">
          <div class="achievement-icon" style="font-size: 64px; margin: 20px 0;">
            ${achievement.icon || '🏆'}
          </div>

          <h3 style="font-size: 14px; color: var(--gold-accent); margin-bottom: 10px;">
            ${achievement.name}
          </h3>

          <p style="font-size: 10px; color: #aaa; margin-bottom: 15px;">
            ${achievement.description}
          </p>

          ${achievement.reward ? `
            <div class="achievement-reward" style="
              background: rgba(255, 215, 0, 0.1);
              padding: 10px;
              border-radius: 4px;
              font-size: 9px;
              color: var(--gold-accent);
            ">
              Reward: ${achievement.reward}
            </div>
          ` : ''}
        </div>
      `,
      buttons: [{ label: 'Amazing!', primary: true }]
    });
  }

  /**
   * Lore fragment modal
   */
  showLore(lore) {
    return this.show({
      title: lore.title,
      icon: '📜',
      theme: 'cultivation',
      animation: 'slide',
      size: 'large',
      content: `
        <div class="lore-modal" style="text-align: center;">
          <p style="font-style: italic; color: #888; margin-bottom: 20px;">
            ${lore.category || 'Ancient Knowledge'}
          </p>

          <div class="lore-text" style="
            background: rgba(0, 0, 0, 0.2);
            padding: 20px;
            border-radius: 8px;
            border-left: 3px solid #9370DB;
            text-align: left;
            font-size: 10px;
            line-height: 1.8;
            white-space: pre-wrap;
          ">
            ${lore.story || lore.content}
          </div>

          ${lore.fragmentsCollected ? `
            <p style="font-size: 8px; color: #666; margin-top: 15px;">
              Fragments Collected: ${lore.fragmentsCollected}/${lore.totalFragments}
            </p>
          ` : ''}
        </div>
      `,
      buttons: [{ label: 'Close', primary: true }]
    });
  }

  /**
   * Goose encounter modal
   */
  showGoose(goose, onBoop, onFlee) {
    return this.show({
      title: goose.name || 'Wild Goose Appeared!',
      icon: '🦢',
      theme: 'goose',
      animation: 'shake',
      closable: false,
      content: `
        <div class="goose-modal" style="text-align: center;">
          <p style="color: ${goose.mood === 'rage' ? '#FF4500' : '#F5F5F5'}; font-size: 12px; margin-bottom: 15px;">
            ${goose.title || 'Wandering Terror'}
          </p>

          <div class="goose-display" style="font-size: 80px; margin: 20px 0;">
            🦢
          </div>

          <p style="font-size: 10px; margin-bottom: 10px;">
            ${goose.description || 'HONK!'}
          </p>

          <div class="goose-mood" style="
            padding: 8px 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            font-size: 9px;
            color: ${goose.mood === 'rage' ? '#FF4500' : '#FFD700'};
          ">
            Mood: ${goose.mood?.toUpperCase() || 'SUSPICIOUS'}
          </div>
        </div>
      `,
      buttons: [
        {
          label: 'Flee',
          callback: () => {
            this.hide(modalId);
            if (onFlee) onFlee();
          }
        },
        {
          label: 'BOOP THE SNOOT',
          primary: true,
          callback: () => {
            this.hide(modalId);
            if (onBoop) onBoop();
          }
        }
      ]
    });
    var modalId = this.nextModalId - 1;
  }

  // ===================================
  // INTERNAL METHODS
  // ===================================

  displayModal(config) {
    const theme = MODAL_THEMES[config.theme];
    const animation = MODAL_ANIMATIONS[config.animation];

    // Create modal element
    const modalElement = document.createElement('div');
    modalElement.className = 'modal-instance';
    modalElement.setAttribute('data-modal-id', config.id);

    // Build buttons HTML
    const buttonsHtml = config.buttons.map((btn, index) => `
      <button
        class="modal-btn ${btn.primary ? 'modal-btn-primary' : btn.danger ? 'modal-btn-danger' : btn.gold ? 'modal-btn-gold' : 'modal-btn-secondary'}"
        data-btn-index="${index}"
      >
        ${btn.label}
      </button>
    `).join('');

    modalElement.innerHTML = `
      ${config.overlay ? '<div class="modal-overlay active"></div>' : ''}
      <div class="modal-wrapper ${animation.enter}" style="
        --modal-bg: ${theme.background};
        --modal-border: ${theme.borderColor};
        --modal-glow: ${theme.glowColor};
      ">
        <div class="modal-dialog ${config.size === 'large' ? 'large' : config.size === 'small' ? 'small' : ''}">
          <div class="modal-header">
            <div class="modal-title">
              ${config.icon ? `<span class="modal-icon">${config.icon}</span>` : ''}
              <span>${config.title}</span>
            </div>
            ${config.closable ? `<button class="modal-close" aria-label="Close">&times;</button>` : ''}
          </div>

          <div class="modal-body">
            ${config.content}
          </div>

          <div class="modal-footer">
            ${buttonsHtml}
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    if (config.closable) {
      const closeBtn = modalElement.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hide(config.id));
      }

      const overlay = modalElement.querySelector('.modal-overlay');
      if (overlay) {
        overlay.addEventListener('click', () => this.hide(config.id));
      }
    }

    // Button handlers
    config.buttons.forEach((btn, index) => {
      const btnElement = modalElement.querySelector(`[data-btn-index="${index}"]`);
      if (btnElement) {
        btnElement.addEventListener('click', () => {
          if (btn.callback) {
            btn.callback(config.data);
          } else {
            this.hide(config.id);
          }
        });
      }
    });

    // Add to container
    this.modalContainer.appendChild(modalElement);
    this.modalContainer.classList.add('active');

    // Store reference
    this.activeModals.push({
      id: config.id,
      config,
      element: modalElement
    });

    // Call onShow callback
    if (config.onShow) {
      config.onShow(config.data);
    }

    // Play sound
    if (window.audioSystem) {
      window.audioSystem.playSFX('modal_open');
    }
  }

  processQueue() {
    if (this.modalQueue.length === 0) return;
    if (this.activeModals.length > 0) return;

    const nextModal = this.modalQueue.shift();
    this.displayModal(nextModal);
  }

  // ===================================
  // DEBUG
  // ===================================

  getDebugInfo() {
    return {
      activeCount: this.activeModals.length,
      queueLength: this.modalQueue.length,
      activeIds: this.activeModals.map(m => m.id)
    };
  }
}

// ===================================
// GLOBAL INSTANCE
// ===================================

let modalManager = null;

function initModalManager() {
  modalManager = new ModalManager();
  window.modalManager = modalManager;

  // Convenience functions
  window.showModal = (config) => modalManager?.show(config);
  window.hideModal = (id) => modalManager?.hide(id);
  window.confirmModal = (title, msg, onConfirm, onCancel) => modalManager?.confirm(title, msg, onConfirm, onCancel);
  window.alertModal = (title, msg) => modalManager?.alert(title, msg);
  window.promptModal = (title, msg, defaultVal) => modalManager?.prompt(title, msg, defaultVal);

  console.log('Modal Manager loaded successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModalManager);
} else {
  initModalManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModalManager, MODAL_THEMES, MODAL_ANIMATIONS };
}
