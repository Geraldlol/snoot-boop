/**
 * particles.js - Hades-level Particle Effects System
 * "Every boop creates ripples in the Qi of the world."
 *
 * Pool-based particle management for optimal performance
 */

console.log('Loading Particle System...');

// ===================================
// PARTICLE CONFIGURATIONS
// ===================================

const PARTICLE_CONFIGS = {
  qi: {
    emoji: ['✨', '💫', '⭐', '🌟'],
    colors: ['#00BFFF', '#87CEEB', '#00CED1', '#40E0D0'],
    size: { min: 12, max: 24 },
    duration: { min: 800, max: 1200 },
    count: { min: 3, max: 6 },
    animation: 'qi-float-up'
  },
  critical: {
    emoji: ['💥', '⚡', '🔥', '✨', '💫'],
    colors: ['#FFD700', '#FF6600', '#FF4500', '#FFFF00'],
    size: { min: 16, max: 32 },
    duration: { min: 600, max: 1000 },
    count: { min: 8, max: 15 },
    animation: 'qi-burst'
  },
  combo: {
    emoji: ['🔥', '⚡', '💥'],
    colors: ['#FF4500', '#FF6600', '#FF8C00', '#FFA500'],
    size: { min: 14, max: 28 },
    duration: { min: 700, max: 1100 },
    count: { min: 5, max: 10 },
    animation: 'qi-spiral'
  },
  heal: {
    emoji: ['💚', '💖', '✨', '🌸'],
    colors: ['#50C878', '#7FFFD4', '#98FB98', '#90EE90'],
    size: { min: 14, max: 22 },
    duration: { min: 900, max: 1300 },
    count: { min: 4, max: 7 },
    animation: 'qi-float-up'
  },
  gold: {
    emoji: ['💰', '🪙', '💎', '✨'],
    colors: ['#FFD700', '#FFA500', '#DAA520', '#F0E68C'],
    size: { min: 12, max: 20 },
    duration: { min: 800, max: 1100 },
    count: { min: 4, max: 8 },
    animation: 'qi-float-up'
  },
  goose: {
    emoji: ['🪶', '🦢', '💨', '❗'],
    colors: ['#FFFFFF', '#F5F5F5', '#FFFAF0', '#FFFFF0'],
    size: { min: 16, max: 28 },
    duration: { min: 600, max: 900 },
    count: { min: 6, max: 12 },
    animation: 'qi-burst'
  },
  realm: {
    mortal: { colors: ['#A0A0A0', '#808080', '#696969'] },
    qiCondensation: { colors: ['#87CEEB', '#00BFFF', '#1E90FF'] },
    foundationEstablishment: { colors: ['#8B4513', '#A0522D', '#CD853F'] },
    coreFormation: { colors: ['#FFD700', '#FFA500', '#FF8C00'] },
    nascentSoul: { colors: ['#9370DB', '#8A2BE2', '#9400D3'] },
    spiritSevering: { colors: ['#DC143C', '#B22222', '#8B0000'] },
    daoSeeking: { colors: ['#4169E1', '#0000CD', '#191970'] },
    immortalAscension: { colors: ['#FFD700', '#FFFFFF', '#FFFACD'] },
    trueImmortal: { colors: ['#FFFFFF', '#F0FFFF', '#E0FFFF'] },
    heavenlySovereign: { colors: ['#FFD700', '#FFFFFF', '#FF69B4', '#00FFFF'] }
  }
};

// ===================================
// PARTICLE POOL
// ===================================

class ParticlePool {
  constructor(maxSize = 100) {
    this.pool = [];
    this.maxSize = maxSize;
    this.activeCount = 0;
  }

  acquire() {
    // Try to reuse an inactive particle
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        this.pool[i].active = true;
        this.activeCount++;
        return this.pool[i];
      }
    }

    // Create new particle if pool not full
    if (this.pool.length < this.maxSize) {
      const particle = this.createParticle();
      this.pool.push(particle);
      this.activeCount++;
      return particle;
    }

    // Pool is full, return null
    return null;
  }

  release(particle) {
    if (particle && particle.active) {
      particle.active = false;
      particle.element.style.display = 'none';
      this.activeCount--;
    }
  }

  createParticle() {
    const element = document.createElement('div');
    element.className = 'particle';
    element.style.cssText = `
      position: absolute;
      pointer-events: none;
      z-index: 1000;
      display: none;
      font-size: 16px;
      text-shadow: 0 0 5px currentColor;
      will-change: transform, opacity;
    `;
    return { element, active: false };
  }

  getStats() {
    return {
      total: this.pool.length,
      active: this.activeCount,
      available: this.pool.length - this.activeCount
    };
  }
}

// ===================================
// PARTICLE SYSTEM
// ===================================

class ParticleSystem {
  constructor() {
    this.container = null;
    this.pool = new ParticlePool(150);
    this.enabled = true;
    this.performanceMode = false;
    this.init();
  }

  init() {
    // Create or find particle container
    this.container = document.getElementById('particle-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'particle-container';
      this.container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      `;
      document.body.appendChild(this.container);
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enabled = false;
    }

    console.log('  Particle System initialized');
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.clearAll();
    }
  }

  setPerformanceMode(enabled) {
    this.performanceMode = enabled;
  }

  // ===================================
  // CORE PARTICLE CREATION
  // ===================================

  createParticle(x, y, config, customOptions = {}) {
    if (!this.enabled) return;

    const particle = this.pool.acquire();
    if (!particle) return; // Pool exhausted

    const options = { ...config, ...customOptions };
    const element = particle.element;

    // Set content
    if (options.text) {
      element.textContent = options.text;
    } else if (options.emoji) {
      const emojis = Array.isArray(options.emoji) ? options.emoji : [options.emoji];
      element.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    }

    // Set color
    const colors = options.colors || ['#FFFFFF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    element.style.color = color;

    // Set size
    const minSize = options.size?.min || 16;
    const maxSize = options.size?.max || 24;
    const size = minSize + Math.random() * (maxSize - minSize);
    element.style.fontSize = `${size}px`;

    // Set position
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    // Set animation variables for drift
    const driftX = (Math.random() - 0.5) * 60;
    const burstX = (Math.random() - 0.5) * 120;
    const burstY = -30 - Math.random() * 80;
    element.style.setProperty('--drift-x', `${driftX}px`);
    element.style.setProperty('--burst-x', `${burstX}px`);
    element.style.setProperty('--burst-y', `${burstY}px`);

    // Set duration
    const minDuration = options.duration?.min || 800;
    const maxDuration = options.duration?.max || 1200;
    const duration = minDuration + Math.random() * (maxDuration - minDuration);

    // Apply animation
    const animation = options.animation || 'qi-float-up';
    element.style.animation = `${animation} ${duration}ms ease-out forwards`;

    // Show and attach
    element.style.display = 'block';
    this.container.appendChild(element);

    // Schedule release
    setTimeout(() => {
      this.pool.release(particle);
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, duration + 50);
  }

  createMultipleParticles(x, y, config, count) {
    if (!this.enabled) return;

    // Reduce particle count in performance mode
    const actualCount = this.performanceMode ? Math.ceil(count / 2) : count;

    for (let i = 0; i < actualCount; i++) {
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;
      const delay = Math.random() * 100;

      setTimeout(() => {
        this.createParticle(x + offsetX, y + offsetY, config);
      }, delay);
    }
  }

  // ===================================
  // EFFECT METHODS
  // ===================================

  /**
   * Create Qi particles for normal boops
   */
  createQiParticles(x, y, realm = 'mortal') {
    if (!this.enabled) return;

    const config = { ...PARTICLE_CONFIGS.qi };

    // Use realm-specific colors if available
    if (PARTICLE_CONFIGS.realm[realm]) {
      config.colors = PARTICLE_CONFIGS.realm[realm].colors;
    }

    const count = this.randomRange(config.count.min, config.count.max);
    this.createMultipleParticles(x, y, config, count);
  }

  /**
   * Create explosive particles for critical hits
   */
  createCriticalExplosion(x, y) {
    if (!this.enabled) return;

    const config = PARTICLE_CONFIGS.critical;
    const count = this.randomRange(config.count.min, config.count.max);

    // Create central flash
    this.createExplosionRing(x, y, '#FFD700');

    // Create burst particles
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = 20 + Math.random() * 30;
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      setTimeout(() => {
        this.createParticle(x + offsetX, y + offsetY, config);
      }, Math.random() * 50);
    }

    // Create star burst effect
    this.createStarBurst(x, y);
  }

  /**
   * Create explosion ring effect
   */
  createExplosionRing(x, y, color = '#FFD700') {
    if (!this.enabled) return;

    const ring = document.createElement('div');
    ring.className = 'explosion-ring';
    ring.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 40px;
      height: 40px;
      border: 4px solid ${color};
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: crit-explosion-ring 0.4s ease-out forwards;
    `;

    this.container.appendChild(ring);
    setTimeout(() => ring.remove(), 400);
  }

  /**
   * Create star burst pattern
   */
  createStarBurst(x, y) {
    if (!this.enabled) return;

    const star = document.createElement('div');
    star.textContent = '✦';
    star.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      font-size: 40px;
      color: #FFD700;
      text-shadow: 0 0 20px #FFD700, 0 0 40px #FF6600;
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: crit-star-burst 0.5s ease-out forwards;
    `;

    this.container.appendChild(star);
    setTimeout(() => star.remove(), 500);
  }

  /**
   * Create combo milestone particles
   */
  createComboParticles(x, y, comboLevel) {
    if (!this.enabled) return;

    const config = { ...PARTICLE_CONFIGS.combo };

    // Adjust intensity based on combo level
    if (comboLevel >= 100) {
      config.count = { min: 15, max: 25 };
      config.colors = ['#FF0000', '#FF6600', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF'];
    } else if (comboLevel >= 50) {
      config.count = { min: 10, max: 18 };
      config.colors = ['#00FFFF', '#0099FF', '#00FF99'];
    } else if (comboLevel >= 25) {
      config.count = { min: 8, max: 12 };
    }

    const count = this.randomRange(config.count.min, config.count.max);
    this.createMultipleParticles(x, y, config, count);

    // Add combo text particle
    this.createParticle(x, y - 30, {
      text: `${comboLevel}x!`,
      colors: config.colors,
      size: { min: 24, max: 32 },
      duration: { min: 1000, max: 1200 },
      animation: 'qi-float-up'
    });
  }

  /**
   * Create gold/reward particles
   */
  createGoldParticles(x, y, amount = 'normal') {
    if (!this.enabled) return;

    const config = { ...PARTICLE_CONFIGS.gold };

    if (amount === 'large') {
      config.count = { min: 8, max: 15 };
    } else if (amount === 'huge') {
      config.count = { min: 15, max: 25 };
    }

    const count = this.randomRange(config.count.min, config.count.max);
    this.createMultipleParticles(x, y, config, count);
  }

  /**
   * Create heal/happiness particles
   */
  createHealParticles(x, y) {
    if (!this.enabled) return;

    const config = PARTICLE_CONFIGS.heal;
    const count = this.randomRange(config.count.min, config.count.max);
    this.createMultipleParticles(x, y, config, count);
  }

  /**
   * Create goose-related particles
   */
  createGooseParticles(x, y, type = 'normal') {
    if (!this.enabled) return;

    const config = { ...PARTICLE_CONFIGS.goose };

    if (type === 'rage') {
      config.colors = ['#FF4500', '#FF0000', '#FF6600'];
      config.emoji = ['🔥', '💢', '❗', '‼️'];
    } else if (type === 'golden') {
      config.colors = ['#FFD700', '#FFA500', '#FFFF00'];
      config.emoji = ['✨', '💰', '👑', '🪶'];
    } else if (type === 'defeat') {
      config.count = { min: 15, max: 25 };
    }

    const count = this.randomRange(config.count.min, config.count.max);
    this.createMultipleParticles(x, y, config, count);
  }

  /**
   * Create realm breakthrough particles
   */
  createBreakthroughParticles(x, y, realmId) {
    if (!this.enabled) return;

    const realmColors = PARTICLE_CONFIGS.realm[realmId]?.colors || ['#FFFFFF'];

    // Create massive burst
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      setTimeout(() => {
        this.createParticle(x + offsetX, y + offsetY, {
          emoji: ['✨', '💫', '⭐', '🌟'],
          colors: realmColors,
          size: { min: 16, max: 32 },
          duration: { min: 1000, max: 1500 },
          animation: 'qi-burst'
        });
      }, i * 30);
    }

    // Create expanding rings
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createExplosionRing(x, y, realmColors[i % realmColors.length]);
      }, i * 150);
    }
  }

  /**
   * Create floating text particle
   */
  createTextParticle(x, y, text, options = {}) {
    if (!this.enabled) return;

    this.createParticle(x, y, {
      text: text,
      colors: options.colors || ['#FFFFFF'],
      size: options.size || { min: 14, max: 20 },
      duration: options.duration || { min: 1000, max: 1200 },
      animation: options.animation || 'qi-float-up'
    });
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  randomRange(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  clearAll() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.pool = new ParticlePool(150);
  }

  getStats() {
    return this.pool.getStats();
  }
}

// ===================================
// SCREEN SHAKE SYSTEM
// ===================================

class ScreenShakeSystem {
  constructor() {
    this.container = null;
    this.enabled = true;
    this.init();
  }

  init() {
    this.container = document.getElementById('game-container');
    console.log('  Screen Shake System initialized');
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  shake(intensity = 'medium') {
    if (!this.enabled || !this.container) return;

    // Remove any existing shake class
    this.container.classList.remove(
      'screen-shake', 'screen-shake-light', 'screen-shake-medium',
      'screen-shake-heavy', 'screen-shake-epic'
    );

    // Force reflow
    void this.container.offsetWidth;

    // Add appropriate shake class
    const shakeClass = `screen-shake-${intensity}`;
    this.container.classList.add(shakeClass);

    // Remove class after animation
    const durations = {
      light: 200,
      medium: 300,
      heavy: 400,
      epic: 500
    };

    setTimeout(() => {
      this.container.classList.remove(shakeClass);
    }, durations[intensity] || 300);
  }

  // Convenience methods
  light() { this.shake('light'); }
  medium() { this.shake('medium'); }
  heavy() { this.shake('heavy'); }
  epic() { this.shake('epic'); }
}

// ===================================
// GLOBAL INSTANCES
// ===================================

let particleSystem = null;
let screenShakeSystem = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticleSystems);
} else {
  initParticleSystems();
}

function initParticleSystems() {
  particleSystem = new ParticleSystem();
  screenShakeSystem = new ScreenShakeSystem();

  // Make globally available
  window.particleSystem = particleSystem;
  window.screenShakeSystem = screenShakeSystem;

  // Convenience functions
  window.createQiParticles = (x, y, realm) => particleSystem?.createQiParticles(x, y, realm);
  window.createCriticalExplosion = (x, y) => particleSystem?.createCriticalExplosion(x, y);
  window.createComboParticles = (x, y, level) => particleSystem?.createComboParticles(x, y, level);
  window.createGoldParticles = (x, y, amount) => particleSystem?.createGoldParticles(x, y, amount);
  window.createGooseParticles = (x, y, type) => particleSystem?.createGooseParticles(x, y, type);
  window.createBreakthroughParticles = (x, y, realm) => particleSystem?.createBreakthroughParticles(x, y, realm);

  window.screenShake = (intensity) => screenShakeSystem?.shake(intensity);

  console.log('Particle System loaded successfully');
}
