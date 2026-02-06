/**
 * notifications.js - Wuxia-themed Toast Notification System
 * "The heavens announce great deeds to all who listen."
 *
 * Features:
 * - Multiple notification types (success, warning, achievement, lore, error)
 * - Queue system to prevent spam
 * - Stacking with smooth animations
 * - Auto-dismiss with progress indicator
 */

console.log('Loading Notification System...');

// ===================================
// NOTIFICATION TYPES
// ===================================

const NOTIFICATION_TYPES = {
  success: {
    icon: '✅',
    bgColor: 'linear-gradient(135deg, #1a4a2e, #0d2818)',
    borderColor: '#50C878',
    glowColor: 'rgba(80, 200, 120, 0.3)',
    sound: 'success'
  },
  warning: {
    icon: '⚠️',
    bgColor: 'linear-gradient(135deg, #4a3a1a, #2d2410)',
    borderColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.3)',
    sound: 'warning'
  },
  error: {
    icon: '❌',
    bgColor: 'linear-gradient(135deg, #4a1a1a, #2d1010)',
    borderColor: '#DC143C',
    glowColor: 'rgba(220, 20, 60, 0.3)',
    sound: 'error'
  },
  achievement: {
    icon: '🏆',
    bgColor: 'linear-gradient(135deg, #3a3a1a, #2d2d10)',
    borderColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.5)',
    sound: 'achievement',
    animation: 'achievement'
  },
  lore: {
    icon: '📜',
    bgColor: 'linear-gradient(135deg, #2a1a3a, #1a102a)',
    borderColor: '#9370DB',
    glowColor: 'rgba(147, 112, 219, 0.3)',
    sound: 'lore',
    animation: 'lore'
  },
  cat: {
    icon: '🐱',
    bgColor: 'linear-gradient(135deg, #1a3a4a, #102a3a)',
    borderColor: '#00CED1',
    glowColor: 'rgba(0, 206, 209, 0.3)',
    sound: 'meow'
  },
  waifu: {
    icon: '💕',
    bgColor: 'linear-gradient(135deg, #4a1a3a, #3a102a)',
    borderColor: '#FFB6C1',
    glowColor: 'rgba(255, 182, 193, 0.3)',
    sound: 'bond'
  },
  goose: {
    icon: '🦢',
    bgColor: 'linear-gradient(135deg, #3a3a3a, #2a2a2a)',
    borderColor: '#F5F5F5',
    glowColor: 'rgba(245, 245, 245, 0.3)',
    sound: 'honk',
    animation: 'shake'
  },
  cultivation: {
    icon: '☯️',
    bgColor: 'linear-gradient(135deg, #1a2a4a, #102040)',
    borderColor: '#87CEEB',
    glowColor: 'rgba(135, 206, 235, 0.3)',
    sound: 'breakthrough'
  },
  prestige: {
    icon: '🌟',
    bgColor: 'linear-gradient(135deg, #4a4a1a, #3a3a10)',
    borderColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    sound: 'ascend',
    animation: 'achievement'
  }
};

// ===================================
// NOTIFICATION SYSTEM CLASS
// ===================================

class NotificationSystem {
  constructor() {
    this.container = null;
    this.queue = [];
    this.activeNotifications = [];
    this.maxVisible = 5;
    this.defaultDuration = 4000;
    this.isProcessing = false;
    this.enabled = true;

    this.init();
  }

  init() {
    // Create notification container
    this.container = document.getElementById('notification-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        max-width: 400px;
        width: calc(100% - 40px);
      `;
      document.body.appendChild(this.container);
    }

    // Add styles
    this.addStyles();

    console.log('  Notification System initialized');
  }

  addStyles() {
    if (document.getElementById('notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification-toast {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 8px;
        border: 2px solid;
        font-family: var(--font-pixel, 'Press Start 2P', monospace);
        font-size: 10px;
        color: #f0f0f0;
        pointer-events: auto;
        position: relative;
        overflow: hidden;
        transform-origin: top right;
        animation: notification-slide-in 0.3s ease-out;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      .notification-toast.removing {
        animation: notification-slide-out 0.3s ease-out forwards;
      }

      .notification-toast.shake {
        animation: notification-shake 0.5s ease;
      }

      .notification-toast.achievement {
        animation: notification-bounce-in 0.5s ease-out, achievement-glow 2s ease-in-out infinite;
      }

      .notification-toast.lore {
        animation: notification-bounce-in 0.5s ease-out, lore-reveal 0.6s ease-out;
      }

      .notification-icon {
        font-size: 20px;
        flex-shrink: 0;
        line-height: 1;
      }

      .notification-content {
        flex: 1;
        min-width: 0;
      }

      .notification-title {
        font-size: 11px;
        font-weight: bold;
        margin-bottom: 4px;
        line-height: 1.3;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
      }

      .notification-message {
        font-size: 9px;
        opacity: 0.9;
        line-height: 1.4;
        word-wrap: break-word;
      }

      .notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #fff;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s, background 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
      }

      .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.2);
      }

      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.5);
        transition: width linear;
      }

      .notification-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .notification-action {
        padding: 4px 8px;
        font-size: 8px;
        font-family: var(--font-pixel, 'Press Start 2P', monospace);
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .notification-action:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
      }

      .notification-action.primary {
        background: var(--jade, #50C878);
        border-color: var(--jade-dark, #3D9970);
      }

      /* Realm-specific notification colors */
      .notification-toast.realm-mortal {
        border-color: #A0A0A0 !important;
        box-shadow: 0 0 15px rgba(160, 160, 160, 0.3) !important;
      }

      .notification-toast.realm-qi {
        border-color: #87CEEB !important;
        box-shadow: 0 0 15px rgba(135, 206, 235, 0.3) !important;
      }

      .notification-toast.realm-foundation {
        border-color: #8B4513 !important;
        box-shadow: 0 0 15px rgba(139, 69, 19, 0.3) !important;
      }

      .notification-toast.realm-core {
        border-color: #FFD700 !important;
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.3) !important;
      }

      .notification-toast.realm-nascent {
        border-color: #9370DB !important;
        box-shadow: 0 0 15px rgba(147, 112, 219, 0.3) !important;
      }

      .notification-toast.realm-immortal {
        border-color: #FFD700 !important;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5) !important;
        animation: achievement-glow 1.5s ease-in-out infinite;
      }

      @media (max-width: 480px) {
        #notification-container {
          top: 10px;
          right: 10px;
          left: 10px;
          width: auto;
          max-width: none;
        }

        .notification-toast {
          padding: 10px 12px;
        }

        .notification-title {
          font-size: 10px;
        }

        .notification-message {
          font-size: 8px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ===================================
  // PUBLIC METHODS
  // ===================================

  /**
   * Show a notification
   * @param {Object} options - Notification options
   */
  show(options) {
    if (!this.enabled) return;

    const notification = {
      id: Date.now() + Math.random(),
      type: options.type || 'success',
      title: options.title || '',
      message: options.message || '',
      duration: options.duration !== undefined ? options.duration : this.defaultDuration,
      icon: options.icon,
      actions: options.actions || [],
      dismissible: options.dismissible !== false,
      sound: options.sound !== false,
      priority: options.priority || 0,
      realmClass: options.realmClass || ''
    };

    // Add to queue based on priority
    if (notification.priority > 0) {
      this.queue.unshift(notification);
    } else {
      this.queue.push(notification);
    }

    this.processQueue();
  }

  // Convenience methods
  success(title, message, options = {}) {
    this.show({ ...options, type: 'success', title, message });
  }

  warning(title, message, options = {}) {
    this.show({ ...options, type: 'warning', title, message });
  }

  error(title, message, options = {}) {
    this.show({ ...options, type: 'error', title, message });
  }

  achievement(title, message, options = {}) {
    this.show({ ...options, type: 'achievement', title, message, priority: 1, duration: 6000 });
  }

  lore(title, message, options = {}) {
    this.show({ ...options, type: 'lore', title, message, duration: 8000 });
  }

  cat(title, message, options = {}) {
    this.show({ ...options, type: 'cat', title, message });
  }

  waifu(title, message, options = {}) {
    this.show({ ...options, type: 'waifu', title, message });
  }

  goose(title, message, options = {}) {
    this.show({ ...options, type: 'goose', title, message });
  }

  cultivation(title, message, options = {}) {
    this.show({ ...options, type: 'cultivation', title, message, priority: 1 });
  }

  prestige(title, message, options = {}) {
    this.show({ ...options, type: 'prestige', title, message, priority: 2, duration: 8000 });
  }

  // ===================================
  // INTERNAL METHODS
  // ===================================

  processQueue() {
    if (this.isProcessing) return;
    if (this.queue.length === 0) return;
    if (this.activeNotifications.length >= this.maxVisible) return;

    this.isProcessing = true;

    const notification = this.queue.shift();
    this.displayNotification(notification);

    // Small delay before processing next
    setTimeout(() => {
      this.isProcessing = false;
      this.processQueue();
    }, 100);
  }

  displayNotification(notification) {
    const config = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.success;

    // Create notification element
    const element = document.createElement('div');
    element.className = `notification-toast ${notification.type}`;
    if (config.animation) {
      element.classList.add(config.animation);
    }
    if (notification.realmClass) {
      element.classList.add(notification.realmClass);
    }

    element.style.cssText = `
      background: ${config.bgColor};
      border-color: ${config.borderColor};
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), 0 0 15px ${config.glowColor};
    `;

    // Build HTML
    let html = `
      <span class="notification-icon">${notification.icon || config.icon}</span>
      <div class="notification-content">
        ${notification.title ? `<div class="notification-title">${notification.title}</div>` : ''}
        ${notification.message ? `<div class="notification-message">${notification.message}</div>` : ''}
    `;

    // Add action buttons
    if (notification.actions.length > 0) {
      html += '<div class="notification-actions">';
      notification.actions.forEach((action, index) => {
        html += `<button class="notification-action ${action.primary ? 'primary' : ''}" data-action="${index}">${action.label}</button>`;
      });
      html += '</div>';
    }

    html += '</div>';

    // Add close button
    if (notification.dismissible) {
      html += '<button class="notification-close" aria-label="Close">×</button>';
    }

    // Add progress bar
    if (notification.duration > 0) {
      html += '<div class="notification-progress"></div>';
    }

    element.innerHTML = html;

    // Event handlers
    if (notification.dismissible) {
      const closeBtn = element.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => this.dismiss(notification.id));
    }

    // Action button handlers
    notification.actions.forEach((action, index) => {
      const btn = element.querySelector(`[data-action="${index}"]`);
      if (btn) {
        btn.addEventListener('click', () => {
          if (action.callback) action.callback();
          if (action.dismiss !== false) this.dismiss(notification.id);
        });
      }
    });

    // Add to container
    this.container.appendChild(element);

    // Track active notification
    this.activeNotifications.push({
      id: notification.id,
      element: element
    });

    // Play sound
    if (notification.sound && window.audioSystem) {
      window.audioSystem.playSFX(config.sound || 'notification');
    }

    // Start progress animation
    if (notification.duration > 0) {
      const progressBar = element.querySelector('.notification-progress');
      if (progressBar) {
        progressBar.style.width = '100%';
        requestAnimationFrame(() => {
          progressBar.style.width = '0%';
          progressBar.style.transitionDuration = `${notification.duration}ms`;
        });
      }

      // Auto-dismiss
      setTimeout(() => this.dismiss(notification.id), notification.duration);
    }
  }

  dismiss(id) {
    const index = this.activeNotifications.findIndex(n => n.id === id);
    if (index === -1) return;

    const { element } = this.activeNotifications[index];

    // Add removing class for animation
    element.classList.add('removing');

    // Remove after animation
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.activeNotifications.splice(index, 1);
      this.processQueue();
    }, 300);
  }

  dismissAll() {
    const ids = this.activeNotifications.map(n => n.id);
    ids.forEach(id => this.dismiss(id));
    this.queue = [];
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.dismissAll();
    }
  }

  setMaxVisible(max) {
    this.maxVisible = max;
  }

  setDefaultDuration(duration) {
    this.defaultDuration = duration;
  }
}

// ===================================
// GLOBAL INSTANCE
// ===================================

let notificationSystem = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNotificationSystem);
} else {
  initNotificationSystem();
}

function initNotificationSystem() {
  notificationSystem = new NotificationSystem();
  window.notificationSystem = notificationSystem;

  // Convenience functions - supports both object-style and simple (message, type) patterns
  window.showNotification = (optionsOrMessage, type = 'info') => {
    if (!notificationSystem) return;

    // Support simple (message, type) pattern for backward compatibility
    if (typeof optionsOrMessage === 'string') {
      notificationSystem.show({
        type: type,
        title: '',
        message: optionsOrMessage
      });
    } else {
      // Object-style options
      notificationSystem.show(optionsOrMessage);
    }
  };
  window.showSuccess = (title, message) => notificationSystem?.success(title, message);
  window.showWarning = (title, message) => notificationSystem?.warning(title, message);
  window.showError = (title, message) => notificationSystem?.error(title, message);
  window.showAchievement = (title, message) => notificationSystem?.achievement(title, message);
  window.showLore = (title, message) => notificationSystem?.lore(title, message);

  console.log('Notification System loaded successfully');
}
