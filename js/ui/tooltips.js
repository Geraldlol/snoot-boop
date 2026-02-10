/**
 * tooltips.js - Tooltip System
 * Snoot Booper: Idle Wuxia Cat Sanctuary
 *
 * Lightweight tooltip system that attaches to elements with data-tooltip attributes.
 * Supports hover (desktop) and tap (mobile).
 */

console.log('Loading Tooltip System...');

// ===================================
// TOOLTIP DEFINITIONS
// ===================================

const TOOLTIP_DATA = {
  // Currencies
  bp: { title: 'Boop Points (BP)', text: 'Earned by booping cats. Spend on upgrades, buildings, and equipment.' },
  pp: { title: 'Purr Power (PP)', text: 'Generated passively by happy cats. The backbone of your sect\'s cultivation.' },
  qi: { title: 'Qi Energy', text: 'Capped by your cultivation realm. Used for special techniques and breakthroughs.' },
  jc: { title: 'Jade Catnip', text: 'Premium currency earned from events, achievements, and the Wheel of Fate.' },
  ss: { title: 'Spirit Stones', text: 'Found in dungeons. Used for equipment socketing and enhancement.' },
  hs: { title: 'Heavenly Seals', text: 'Earned through Ascension. Permanent upgrades that persist across resets.' },
  wt: { title: 'Waifu Tokens', text: 'Earned from bond activities. Spend on gifts and waifu-related upgrades.' },
  gf: { title: 'Goose Feathers', text: 'Dropped only by geese. Spend at the Goose Feather Shop for rare items.' },
  rep: { title: 'Sect Reputation', text: 'Earned from events and social features. Unlocks special content.' },

  // Core Mechanics
  combo: { title: 'Combo System', text: 'Consecutive boops build combos. Max 100x combo = 2x damage multiplier. Resets after 2 seconds of inactivity.' },
  crit: { title: 'Critical Boops', text: 'Chance for a powerful boop dealing 10x damage. Increased by Nik\'s passive and upgrades.' },
  happiness: { title: 'Cat Happiness', text: 'Happy cats produce more PP. Boop them regularly and keep them fed!' },
  cultivation: { title: 'Cultivation Realm', text: 'Your martial arts progression. Advance through 10 realms by earning XP and passing tribulations.' },
  tribulation: { title: 'Tribulation', text: 'A challenging trial required to break through to the next cultivation realm.' },

  // Stances
  stance: { title: 'Boop Stance', text: 'Different stances modify your booping style. Each has unique bonuses and a mastery track.' },
  jade_palm: { title: 'Jade Palm Stance', text: 'Balanced stance. +20% BP, +10% crit damage. The foundation of all booping.' },
  iron_finger: { title: 'Iron Finger Stance', text: 'Heavy hits. +50% BP but -20% speed. Chance for Mountain Crusher mega-hit.' },
  drunken_paw: { title: 'Drunken Paw Stance', text: 'Random damage range (0.5x-3x). Lucky Stumble can trigger bonus effects.' },
  shadow_step: { title: 'Shadow Step Stance', text: 'Combo-focused. Shadow Burst deals massive damage at high combo counts.' },
  flowing_river: { title: 'Flowing River Stance', text: 'Prevents combo decay. Steady, methodical damage over time.' },
  forbidden: { title: 'Thousand Snoot Annihilation', text: 'The forbidden technique. Devastating power at great cost.' },

  // Systems
  ascension: { title: 'Ascension', text: 'Reset your progress for Heavenly Seals. Permanent multipliers and unlocks carry over.' },
  reincarnation: { title: 'Reincarnation', text: 'Deeper reset after 10+ Ascensions. Earn Karma for the Karma Shop.' },
  transcendence: { title: 'Transcendence', text: 'Ultimate reset. Unlocks the Celestial Realm and endgame content.' },
  expedition: { title: 'Expedition', text: 'Send cats on timed missions for materials, XP, and rare rewards.' },
  golden_snoot: { title: 'Golden Snoot', text: 'Rare clickable event! Grants powerful temporary bonuses when clicked.' },
  drama: { title: 'Drama Meter', text: 'Fills as waifus interact. Harvest for BP or resolve to calm things down.' },
  nemesis: { title: 'Nemesis', text: 'Enemies that remember your cats. They grow stronger each encounter!' },
  parasites: { title: 'Parasites', text: 'Wrinkler-style drains. They steal production but return it multiplied when popped.' },

  // Equipment
  set_bonus: { title: 'Set Bonus', text: 'Equip multiple items from the same set for powerful bonus effects.' },
  socket: { title: 'Spirit Stone Socket', text: 'Embed spirit stones into equipment for bonus stats.' },
  enchant: { title: 'Enchantment', text: 'Apply magical effects to equipment using crafting materials.' },
  salvage: { title: 'Salvage', text: 'Break down unwanted equipment into crafting materials.' },

  // Dungeons
  pagoda: { title: 'Infinite Pagoda', text: 'Roguelike dungeon with 100+ floors. Bosses every 10th floor.' },
  bamboo_forest: { title: 'Bamboo Forest', text: 'Vampire Survivors-style wave survival. Survive 30 minutes!' },
  tournament: { title: 'Celestial Tournament', text: 'Weekly PvP bracket vs AI versions of the Seven Masters.' },
  dream_realm: { title: 'Dream Realm', text: 'Procedural dungeon shaped by your playstyle. AFK auto-pilot available.' },
  goose_dimension: { title: 'Goose Dimension', text: 'Comedy horror dungeon. Everything is geese. HONK.' },
  memory_fragments: { title: 'Memory Fragments', text: 'Story-driven dungeons that unlock pieces of lore.' }
};

// ===================================
// TOOLTIP SYSTEM CLASS
// ===================================

class TooltipSystem {
  constructor() {
    this.tooltipEl = null;
    this.activeTarget = null;
    this.hideTimeout = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    this.createTooltipElement();
    this.addStyles();
    this.bindEvents();
    this.initialized = true;
    console.log('  Tooltip System initialized');
  }

  createTooltipElement() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.id = 'game-tooltip';
    this.tooltipEl.className = 'game-tooltip hidden';
    this.tooltipEl.setAttribute('role', 'tooltip');
    this.tooltipEl.innerHTML = `
      <div class="tooltip-title"></div>
      <div class="tooltip-text"></div>
    `;
    document.body.appendChild(this.tooltipEl);
  }

  addStyles() {
    if (document.getElementById('tooltip-styles')) return;

    const style = document.createElement('style');
    style.id = 'tooltip-styles';
    style.textContent = `
      .game-tooltip {
        position: fixed;
        z-index: 9999;
        max-width: 280px;
        padding: 10px 14px;
        background: linear-gradient(135deg, #2a1f14, #1a1510);
        border: 2px solid var(--jade, #50C878);
        border-radius: 4px;
        color: #e8d4a8;
        font-family: 'VT323', monospace;
        font-size: 1rem;
        line-height: 1.4;
        pointer-events: none;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.15s ease, transform 0.15s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(80, 200, 120, 0.1);
      }
      .game-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .game-tooltip.hidden {
        display: none;
      }
      .game-tooltip .tooltip-title {
        font-size: 1.1rem;
        color: var(--jade-light, #7FFFD4);
        margin-bottom: 4px;
        font-weight: bold;
      }
      .game-tooltip .tooltip-text {
        color: #c4b49a;
        font-size: 0.95rem;
      }
      [data-tooltip] {
        cursor: help;
      }
    `;
    document.head.appendChild(style);
  }

  bindEvents() {
    // Delegate hover events on document
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (target) this.show(target, e);
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (target) this.scheduleHide();
    });

    document.addEventListener('mousemove', (e) => {
      if (this.activeTarget) this.position(e);
    });

    // Touch support
    document.addEventListener('touchstart', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (target) {
        this.show(target, e.touches[0]);
      } else {
        this.hide();
      }
    }, { passive: true });
  }

  show(target, event) {
    clearTimeout(this.hideTimeout);
    this.activeTarget = target;

    const tooltipKey = target.getAttribute('data-tooltip');
    const customTitle = target.getAttribute('data-tooltip-title');
    const customText = target.getAttribute('data-tooltip-text');

    let title = customTitle || '';
    let text = customText || '';

    // Check predefined tooltips
    if (TOOLTIP_DATA[tooltipKey]) {
      title = title || TOOLTIP_DATA[tooltipKey].title;
      text = text || TOOLTIP_DATA[tooltipKey].text;
    }

    // Fallback: use the tooltip key as text
    if (!title && !text) {
      text = tooltipKey;
    }

    const titleEl = this.tooltipEl.querySelector('.tooltip-title');
    const textEl = this.tooltipEl.querySelector('.tooltip-text');
    titleEl.textContent = title;
    titleEl.style.display = title ? '' : 'none';
    textEl.textContent = text;

    this.tooltipEl.classList.remove('hidden');
    // Force reflow then show
    this.tooltipEl.offsetHeight;
    this.tooltipEl.classList.add('visible');

    this.position(event);
  }

  position(event) {
    if (!this.tooltipEl || this.tooltipEl.classList.contains('hidden')) return;

    const x = event.clientX || event.pageX || 0;
    const y = event.clientY || event.pageY || 0;
    const rect = this.tooltipEl.getBoundingClientRect();
    const pad = 12;

    let left = x + pad;
    let top = y + pad;

    // Keep in viewport
    if (left + rect.width > window.innerWidth) {
      left = x - rect.width - pad;
    }
    if (top + rect.height > window.innerHeight) {
      top = y - rect.height - pad;
    }
    if (left < 0) left = pad;
    if (top < 0) top = pad;

    this.tooltipEl.style.left = left + 'px';
    this.tooltipEl.style.top = top + 'px';
  }

  scheduleHide() {
    this.hideTimeout = setTimeout(() => this.hide(), 100);
  }

  hide() {
    this.activeTarget = null;
    if (this.tooltipEl) {
      this.tooltipEl.classList.remove('visible');
      setTimeout(() => {
        if (!this.activeTarget) {
          this.tooltipEl.classList.add('hidden');
        }
      }, 150);
    }
  }
}

// ===================================
// INITIALIZATION
// ===================================

const tooltipSystem = new TooltipSystem();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => tooltipSystem.init());
} else {
  tooltipSystem.init();
}

// ===================================
// EXPORTS
// ===================================

window.TOOLTIP_DATA = TOOLTIP_DATA;
window.tooltipSystem = tooltipSystem;
window.TooltipSystem = TooltipSystem;

console.log('Tooltip System loaded!');
