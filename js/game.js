/**
 * game.js - Main game initialization and loop
 * Snoot Booper: Idle Wuxia Cat Sanctuary
 * "The journey of a thousand boops begins with a single snoot."
 */

console.log('Snoot Booper: game.js loading...');

// ===================================
// FALLBACK CLASS DEFINITIONS
// If external files fail to load, use these minimal implementations
// ===================================

if (typeof PartnerGenerator === 'undefined') {
  console.warn('PartnerGenerator not found, using fallback');
  window.PartnerGenerator = class PartnerGenerator {
    constructor() {
      this.ownedPartners = [];
      this.stats = { partnersGenerated: 0 };
    }
    generate() { return null; }
    serialize() { return { ownedPartners: [], stats: this.stats }; }
    deserialize(data) { if (data) { this.ownedPartners = data.ownedPartners || []; this.stats = data.stats || this.stats; } }
  };
}

if (typeof IRLIntegrationSystem === 'undefined') {
  console.warn('IRLIntegrationSystem not found, using fallback');
  window.IRLIntegrationSystem = class IRLIntegrationSystem {
    constructor() { this.currentTimeBonus = null; this.stats = {}; }
    update() {}
    getCombinedEffects() { return { bpMultiplier: 1, ppMultiplier: 1 }; }
    serialize() { return { stats: this.stats }; }
    deserialize(data) { if (data) this.stats = data.stats || {}; }
  };
}

if (typeof DramaSystem === 'undefined') {
  console.warn('DramaSystem not found, using fallback');
  window.DramaSystem = class DramaSystem {
    constructor() { this.dramaPoints = 0; this.dramaLog = []; this.maxDrama = 100; this.stats = {}; }
    update() {}
    serialize() { return { drama: 0, stats: this.stats }; }
    deserialize(data) { if (data) this.stats = data.stats || {}; }
  };
}

if (typeof NemesisSystem === 'undefined') {
  console.warn('NemesisSystem not found, using fallback');
  window.NemesisSystem = class NemesisSystem {
    constructor() { this.nemeses = []; this.stats = {}; }
    serialize() { return { nemeses: [], stats: this.stats }; }
    deserialize(data) { if (data) this.stats = data.stats || {}; }
  };
}

if (typeof CatinoSystem === 'undefined') {
  console.warn('CatinoSystem not found, using fallback');
  window.CatinoSystem = class CatinoSystem {
    constructor() { this.unlocked = false; this.stats = {}; }
    serialize() { return { chips: 0, stats: this.stats }; }
    deserialize(data) { if (data) this.stats = data.stats || {}; }
  };
}

if (typeof HardcoreSystem === 'undefined') {
  console.warn('HardcoreSystem not found, using fallback');
  window.HardcoreSystem = class HardcoreSystem {
    constructor() { this.activeMode = null; this.stats = {}; }
    getCurrentModeStatus() { return null; }
    serialize() { return { completedModes: [], stats: this.stats }; }
    deserialize(data) { if (data) this.stats = data.stats || {}; }
  };
}

// ===================================
// GAME STATE
// ===================================

const gameState = {
  // Resources
  boopPoints: 0,
  purrPower: 0,
  jadeCatnip: 0,
  destinyThreads: 0,
  gooseFeathers: 0,
  goldenFeathers: 0,

  // Boop stats
  totalBoops: 0,
  boopPower: 1,
  critChance: 0.05,
  critMultiplier: 10,
  comboCount: 0,
  maxCombo: 0,
  comboTimer: null,
  criticalBoops: 0,

  // AFK stats
  totalAfkTime: 0,
  playtime: 0,

  // Goose stats
  gooseBoops: 0,
  cobraChickenDefeated: false,
  gooseAlly: null,

  // Crafting materials
  craftingMaterials: {},

  // Modifiers (calculated from all sources)
  modifiers: {},

  // Timing
  lastUpdate: Date.now(),
  lastSave: Date.now(),

  // Active cat for display
  activeCatIndex: 0
};

// ===================================
// SYSTEMS
// ===================================

let masterSystem, catSystem, waifuSystem, upgradeSystem, eventSystem;
let achievementSystem, gooseSystem, giftSystem, expeditionSystem, jadeDotGame;
let prestigeSystem, audioSystem;
let elementalSystem, equipmentSystem, craftingSystem, pagodaSystem, techniqueSystem;
let blessingSystem, waveSurvivalSystem, goldenSnootSystem, dailySystem, parasiteSystem;
let irlIntegrationSystem, dramaSystem, nemesisSystem, catinoSystem, hardcoreSystem, partnerGenerator;

function createSystem(name, constructorFn) {
  if (typeof constructorFn === 'undefined') {
    console.warn('  ⚠ ' + name + ' class not found, skipping');
    return null;
  }
  try {
    const instance = new constructorFn();
    console.log('  ✓ ' + name);
    return instance;
  } catch (e) {
    console.error('  ✗ ' + name + ':', e.message);
    return null;
  }
}

console.log('Creating core systems...');
masterSystem = createSystem('MasterSystem', MasterSystem);
catSystem = createSystem('CatSystem', CatSystem);
waifuSystem = createSystem('WaifuSystem', WaifuSystem);
upgradeSystem = createSystem('UpgradeSystem', UpgradeSystem);
eventSystem = createSystem('EventSystem', EventSystem);
achievementSystem = createSystem('AchievementSystem', AchievementSystem);
gooseSystem = createSystem('GooseSystem', GooseSystem);
giftSystem = createSystem('GiftSystem', GiftSystem);
expeditionSystem = createSystem('ExpeditionSystem', ExpeditionSystem);
jadeDotGame = createSystem('JadeDotGame', JadeDotGame);
prestigeSystem = createSystem('PrestigeSystem', PrestigeSystem);
audioSystem = createSystem('AudioSystem', AudioSystem);

console.log('Creating Phase 3 systems...');
elementalSystem = createSystem('ElementalSystem', ElementalSystem);
equipmentSystem = createSystem('EquipmentSystem', EquipmentSystem);
craftingSystem = createSystem('CraftingSystem', CraftingSystem);
pagodaSystem = createSystem('PagodaSystem', PagodaSystem);
techniqueSystem = createSystem('TechniqueSystem', TechniqueSystem);
blessingSystem = createSystem('BlessingSystem', BlessingSystem);
waveSurvivalSystem = createSystem('WaveSurvivalSystem', WaveSurvivalSystem);
goldenSnootSystem = createSystem('GoldenSnootSystem', GoldenSnootSystem);
dailySystem = createSystem('DailySystem', DailySystem);
parasiteSystem = createSystem('ParasiteSystem', ParasiteSystem);

console.log('Creating POST-LAUNCH systems...');
irlIntegrationSystem = createSystem('IRLIntegrationSystem', IRLIntegrationSystem);
dramaSystem = createSystem('DramaSystem', DramaSystem);
nemesisSystem = createSystem('NemesisSystem', NemesisSystem);
catinoSystem = createSystem('CatinoSystem', CatinoSystem);
hardcoreSystem = createSystem('HardcoreSystem', HardcoreSystem);
partnerGenerator = createSystem('PartnerGenerator', PartnerGenerator);

console.log('System creation complete');

// Make systems globally accessible
window.gameState = gameState;
window.masterSystem = masterSystem;
window.catSystem = catSystem;
window.waifuSystem = waifuSystem;
window.upgradeSystem = upgradeSystem;
window.eventSystem = eventSystem;
window.achievementSystem = achievementSystem;
window.gooseSystem = gooseSystem;
window.giftSystem = giftSystem;
window.expeditionSystem = expeditionSystem;
window.jadeDotGame = jadeDotGame;
window.prestigeSystem = prestigeSystem;
window.audioSystem = audioSystem;

// Phase 3 Systems (global)
window.elementalSystem = elementalSystem;
window.equipmentSystem = equipmentSystem;
window.craftingSystem = craftingSystem;
window.pagodaSystem = pagodaSystem;
window.techniqueSystem = techniqueSystem;
window.blessingSystem = blessingSystem;
window.waveSurvivalSystem = waveSurvivalSystem;
window.goldenSnootSystem = goldenSnootSystem;
window.dailySystem = dailySystem;
window.parasiteSystem = parasiteSystem;

// POST-LAUNCH Systems (global)
window.irlIntegrationSystem = irlIntegrationSystem;
window.dramaSystem = dramaSystem;
window.nemesisSystem = nemesisSystem;
window.catinoSystem = catinoSystem;
window.hardcoreSystem = hardcoreSystem;
window.partnerGenerator = partnerGenerator;

console.log('Snoot Booper: All systems created successfully');

// ===================================
// DOM ELEMENTS
// ===================================

const elements = {
  // Screens
  masterSelectScreen: document.getElementById('master-select-screen'),
  gameScreen: document.getElementById('game-screen'),

  // Master Select
  mastersGrid: document.getElementById('masters-grid'),
  masterPreview: document.getElementById('master-preview'),
  previewPortrait: document.getElementById('preview-portrait'),
  previewName: document.getElementById('preview-name'),
  previewTitle: document.getElementById('preview-title'),
  previewRole: document.getElementById('preview-role'),
  previewDescription: document.getElementById('preview-description'),
  previewPassiveName: document.getElementById('preview-passive-name'),
  previewPassiveDesc: document.getElementById('preview-passive-desc'),
  selectMasterBtn: document.getElementById('select-master-btn'),

  // Game Header
  bpDisplay: document.getElementById('bp-display'),
  ppDisplay: document.getElementById('pp-display'),
  ppRate: document.getElementById('pp-rate'),
  ppResourceContainer: document.getElementById('pp-resource-container'),
  ppBreakdown: document.getElementById('pp-breakdown'),
  ppBreakdownContent: document.getElementById('pp-breakdown-content'),
  catCountDisplay: document.getElementById('cat-count-display'),
  comboDisplay: document.getElementById('combo-display'),
  comboCount: document.getElementById('combo-count'),
  currentMasterName: document.getElementById('current-master-name'),

  // Boop Area
  activeCat: document.getElementById('active-cat'),
  activeCatName: document.getElementById('active-cat-name'),
  boopButton: document.getElementById('boop-button'),
  boopPowerDisplay: document.getElementById('boop-power-display'),
  floatingTextContainer: document.getElementById('floating-text-container'),
  masterQuote: document.getElementById('master-quote'),

  // Waifu Panel
  waifuEmoji: document.getElementById('waifu-emoji'),
  waifuPortrait: document.getElementById('waifu-portrait'),
  waifuName: document.getElementById('waifu-name'),
  waifuTitle: document.getElementById('waifu-title'),
  bondFill: document.getElementById('bond-fill'),
  bondLevel: document.getElementById('bond-level'),
  waifuDialogue: document.getElementById('waifu-dialogue'),
  waifuBonusText: document.getElementById('waifu-bonus-text'),

  // Tabs
  tabBtns: document.querySelectorAll('.tab-btn'),
  catsTab: document.getElementById('cats-tab'),
  upgradesTab: document.getElementById('upgrades-tab'),
  pagodaTab: document.getElementById('pagoda-tab'),
  equipmentTab: document.getElementById('equipment-tab'),
  expeditionsTab: document.getElementById('expeditions-tab'),
  facilitiesTab: document.getElementById('facilities-tab'),
  statsTab: document.getElementById('stats-tab'),
  catinoTab: document.getElementById('catino-tab'),
  partnersTab: document.getElementById('partners-tab'),
  techniquesTab: document.getElementById('techniques-tab'),
  forgeTab: document.getElementById('forge-tab'),

  // Mobile Navigation
  mobileNav: document.getElementById('mobile-nav'),
  mobileNavBtns: document.querySelectorAll('.mobile-nav-btn'),
  mobileTabModal: document.getElementById('mobile-tab-modal'),
  mobileTabTitle: document.getElementById('mobile-tab-title'),
  mobileTabContent: document.getElementById('mobile-tab-content'),
  mobileTabClose: document.getElementById('mobile-tab-close'),
  mobileMoreMenu: document.getElementById('mobile-more-menu'),
  moreMenuBtns: document.querySelectorAll('.more-menu-btn'),

  // Settings & Help
  settingsBtn: document.getElementById('settings-btn'),
  settingsModal: document.getElementById('settings-modal'),
  settingsCloseBtn: document.getElementById('settings-close-btn'),
  helpBtn: document.getElementById('help-btn'),
  helpModal: document.getElementById('help-modal'),
  helpCloseBtn: document.getElementById('help-close-btn'),
  sfxToggle: document.getElementById('sfx-toggle'),
  musicToggle: document.getElementById('music-toggle'),
  volumeSlider: document.getElementById('volume-slider'),
  volumeValue: document.getElementById('volume-value'),
  particlesToggle: document.getElementById('particles-toggle'),
  screenshakeToggle: document.getElementById('screenshake-toggle'),
  exportSaveBtn: document.getElementById('export-save-btn'),
  importSaveBtn: document.getElementById('import-save-btn'),
  saveCodeInput: document.getElementById('save-code'),

  // Goose Ally
  gooseAllySection: document.getElementById('goose-ally-section'),
  allyEmoji: document.getElementById('ally-emoji'),
  allyName: document.getElementById('ally-name'),
  allyEffect: document.getElementById('ally-effect'),
  allyQuote: document.getElementById('ally-quote'),
  allyBtns: document.querySelectorAll('.ally-btn'),

  // Codex
  codexModal: document.getElementById('codex-modal'),
  codexCloseBtn: document.getElementById('codex-close-btn'),
  codexContent: document.getElementById('codex-content'),
  codexTabs: document.querySelectorAll('.codex-tab'),
  openCodexBtn: document.getElementById('open-codex-btn'),
  loreCount: document.getElementById('lore-count'),
  loreTotal: document.getElementById('lore-total'),

  // Stats
  statTotalBoops: document.getElementById('stat-total-boops'),
  statCritBoops: document.getElementById('stat-crit-boops'),
  statMaxCombo: document.getElementById('stat-max-combo'),
  statCats: document.getElementById('stat-cats'),
  statGeese: document.getElementById('stat-geese'),
  statHighestRealm: document.getElementById('stat-highest-realm'),
  statPlaytime: document.getElementById('stat-playtime'),
  statAfkTime: document.getElementById('stat-afk-time'),
  achievementCount: document.getElementById('achievement-count'),
  achievementTotal: document.getElementById('achievement-total'),
  achievementBar: document.getElementById('achievement-bar'),

  // Cats
  recruitBtn: document.getElementById('recruit-btn'),
  recruitCost: document.getElementById('recruit-cost'),
  catCollection: document.getElementById('cat-collection'),
  catCapacityCurrent: document.getElementById('cat-capacity-current'),
  catCapacityMax: document.getElementById('cat-capacity-max'),

  // Upgrades
  snootArtsList: document.getElementById('snoot-arts-list'),
  innerCultivationList: document.getElementById('inner-cultivation-list'),
  facilitiesList: document.getElementById('facilities-list'),

  // AFK Modal
  afkModal: document.getElementById('afk-modal'),
  afkTimeAway: document.getElementById('afk-time-away'),
  afkPpGained: document.getElementById('afk-pp-gained'),
  afkBpGained: document.getElementById('afk-bp-gained'),
  afkEvents: document.getElementById('afk-events'),
  afkCloseBtn: document.getElementById('afk-close-btn'),

  // Goose
  gooseOverlay: document.getElementById('goose-overlay'),
  gooseTarget: document.getElementById('goose-target'),
  gooseContainer: document.getElementById('goose-container'),
  gooseTimerBar: document.getElementById('goose-timer-bar'),
  gooseMood: document.getElementById('goose-mood'),

  // Expeditions
  expeditionDestinations: document.getElementById('expedition-destinations'),
  expeditionSelection: document.getElementById('expedition-selection'),
  catSelectGrid: document.getElementById('cat-select-grid'),
  startExpeditionBtn: document.getElementById('start-expedition-btn'),
  activeExpeditionsList: document.getElementById('active-expeditions-list'),
  minigameBtn: document.getElementById('minigame-btn'),

  // Prestige
  prestigeTierName: document.getElementById('prestige-tier-name'),
  prestigeMultiplier: document.getElementById('prestige-multiplier'),
  prestigeProgressFill: document.getElementById('prestige-progress-fill'),
  prestigeCurrent: document.getElementById('prestige-current'),
  prestigeRequirement: document.getElementById('prestige-requirement'),
  rebirthBtn: document.getElementById('rebirth-btn'),
  prestigePerksList: document.getElementById('prestige-perks-list')
};

// Currently previewed master
let previewedMasterId = null;

// ===================================
// INITIALIZATION
// ===================================

function init() {
  try {
    console.log('Snoot Booper: Initializing...');

    // Check for existing save
    const saveData = SaveSystem.load();
    console.log('Save data loaded:', saveData ? 'found' : 'none');

    if (saveData && saveData.master) {
      // Load existing game
      console.log('Loading saved game...');
      loadGame(saveData);
    } else {
      // New game - show master select
      console.log('New game - showing master select...');
      renderMasterCards();
      console.log('Master cards rendered');
      setupEventListeners();
      console.log('Event listeners set up');
    }

    console.log('Snoot Booper: Init complete!');
  } catch (error) {
    console.error('Snoot Booper init error:', error);
    alert('Game initialization failed: ' + error.message + '\n\nCheck browser console for details.');
  }
}

function loadGame(saveData) {
  // Restore master
  masterSystem.selectMaster(saveData.master);

  // Restore resources
  gameState.boopPoints = saveData.resources.bp || 0;
  gameState.purrPower = saveData.resources.pp || 0;
  gameState.jadeCatnip = saveData.resources.jadeCatnip || 0;
  gameState.gooseFeathers = saveData.resources.gooseFeathers || 0;
  gameState.goldenFeathers = saveData.resources.goldenFeathers || 0;
  gameState.destinyThreads = saveData.resources.destinyThreads || 0;

  // Restore stats
  gameState.totalBoops = saveData.stats?.totalBoops || 0;
  gameState.maxCombo = saveData.stats?.maxCombo || 0;
  gameState.criticalBoops = saveData.stats?.criticalBoops || 0;
  gameState.totalAfkTime = saveData.stats?.totalAfkTime || 0;
  gameState.playtime = saveData.stats?.playtime || 0;
  gameState.rageGooseBooped = saveData.stats?.rageGooseBooped || false;
  gameState.goldenGooseCrit = saveData.stats?.goldenGooseCrit || false;

  // Restore systems
  catSystem.deserialize(saveData.cats || {});
  waifuSystem.deserialize(saveData.waifus || {});
  if (giftSystem) {
    giftSystem.deserialize(saveData.gifts || {});
    // If no gifts loaded, init with starter gifts
    if (Object.keys(giftSystem.inventory).length === 0) {
      giftSystem.init();
    }
  }
  upgradeSystem.deserialize(saveData.upgrades || {});

  // Restore goose system
  if (saveData.goose) {
    gooseSystem.deserialize(saveData.goose);
    gameState.gooseBoops = gooseSystem.gooseBoops;
    gameState.cobraChickenDefeated = gooseSystem.cobraChickenDefeated;
    gameState.gooseAlly = gooseSystem.selectedAlly;
  }

  // Restore achievements
  if (saveData.achievements) {
    achievementSystem.deserialize(saveData.achievements);
  }

  // Restore expeditions
  if (saveData.expeditions) {
    expeditionSystem.deserialize(saveData.expeditions);
  }

  // Restore prestige
  if (saveData.prestige) {
    prestigeSystem.deserialize(saveData.prestige);
  }

  // Restore Phase 3 systems (with null checks)
  if (saveData.elemental && elementalSystem) {
    elementalSystem.deserialize(saveData.elemental);
  }
  if (saveData.equipment && equipmentSystem) {
    equipmentSystem.deserialize(saveData.equipment);
  }
  if (saveData.crafting && craftingSystem) {
    craftingSystem.deserialize(saveData.crafting);
  }
  if (saveData.pagoda && pagodaSystem) {
    pagodaSystem.deserialize(saveData.pagoda);
  }
  if (saveData.techniques && techniqueSystem) {
    techniqueSystem.deserialize(saveData.techniques);
  }
  if (saveData.blessings && blessingSystem) {
    blessingSystem.deserialize(saveData.blessings);
  }
  if (saveData.survival && waveSurvivalSystem) {
    waveSurvivalSystem.deserialize(saveData.survival);
  }
  if (saveData.goldenSnoot && goldenSnootSystem) {
    goldenSnootSystem.deserialize(saveData.goldenSnoot);
  }
  if (saveData.daily && dailySystem) {
    dailySystem.deserialize(saveData.daily);
  }
  if (saveData.parasites && parasiteSystem) {
    parasiteSystem.deserialize(saveData.parasites);
  }

  // Restore POST-LAUNCH systems (with null checks)
  if (saveData.irlIntegration && irlIntegrationSystem) {
    irlIntegrationSystem.deserialize(saveData.irlIntegration);
  }
  if (saveData.drama && dramaSystem) {
    dramaSystem.deserialize(saveData.drama);
  }
  if (saveData.nemesis && nemesisSystem) {
    nemesisSystem.deserialize(saveData.nemesis);
  }
  if (saveData.catino && catinoSystem) {
    catinoSystem.deserialize(saveData.catino);
  }
  if (saveData.hardcore && hardcoreSystem) {
    hardcoreSystem.deserialize(saveData.hardcore);
  }
  if (saveData.partners && partnerGenerator) {
    partnerGenerator.deserialize(saveData.partners);
  }

  // If no waifus loaded, init with starter
  if (waifuSystem.getUnlockedWaifus().length === 0) {
    waifuSystem.init();
  }

  // Calculate AFK gains
  const afkGains = SaveSystem.calculateAFKGains(
    saveData, masterSystem, catSystem, waifuSystem, upgradeSystem
  );

  // Setup UI and listeners
  renderMasterCards();
  setupEventListeners();

  // Start game directly
  startGameWithSave(afkGains);
}

function startGameWithSave(afkGains) {
  // Update UI
  updateMasterUI();
  updateWaifuUI();
  renderCatCollection();
  renderUpgrades();
  updateResourceDisplay();

  // Switch to game screen
  elements.masterSelectScreen.classList.remove('active');
  elements.gameScreen.classList.add('active');

  // Show AFK gains if significant
  if (afkGains && afkGains.timeAway > 60000) {
    gameState.purrPower += afkGains.ppGained;
    gameState.boopPoints += afkGains.bpGained;
    gameState.totalAfkTime += afkGains.timeAway;
    showAfkModal(afkGains);
  }

  // Start all systems
  requestAnimationFrame(gameLoop);
  startAutoSave();
  if (gooseSystem) gooseSystem.start();
  if (eventSystem) eventSystem.start();
  if (expeditionSystem) expeditionSystem.start();

  // Render new UI elements
  renderExpeditions();
  renderPrestige();
  updateExpeditionsUI();
  renderDailyCommissions();
  renderPagoda();
  renderEquipment();

  // Start achievement checking interval
  setInterval(checkAchievements, 5000);

  // Update daily commissions periodically
  setInterval(renderDailyCommissions, 5000);

  // Update expeditions UI periodically
  setInterval(updateExpeditionsUI, 1000);

  // Update upgrades UI periodically (so affordability updates with BP changes)
  setInterval(renderUpgrades, 2000);
}

/**
 * Check for new achievements
 */
function checkAchievements() {
  if (!achievementSystem) return;

  const newAchievements = achievementSystem.checkAchievements(
    gameState, catSystem, waifuSystem, upgradeSystem
  );

  // Achievements are auto-notified by the system
  if (newAchievements.length > 0) {
    updateStatsDisplay();
  }
}

// ===================================
// MASTER SELECT
// ===================================

function renderMasterCards() {
  try {
    console.log('renderMasterCards starting...');

    if (!elements.mastersGrid) {
      console.error('ERROR: mastersGrid element is null!');
      alert('Error: Master selection grid not found in HTML!');
      return;
    }

    const masters = masterSystem.getAllMasters();
    console.log('Got masters:', masters.length);

    if (!masters || masters.length === 0) {
      console.error('ERROR: No masters returned from getAllMasters!');
      elements.mastersGrid.innerHTML = '<p style="color: red; text-align: center;">Error: No masters available. Check console.</p>';
      return;
    }

    elements.mastersGrid.innerHTML = masters.map(master => `
      <div class="master-card"
           data-master="${master.id}"
           onclick="window.showMasterPreview('${master.id}')"
           style="--master-color: ${master.color}; cursor: pointer;">
        <div class="master-portrait">
          ${master.portrait
            ? `<img src="${master.portrait}" alt="${master.name}" onerror="this.outerHTML='${master.emoji}'">`
            : master.emoji}
        </div>
        <h3>${master.name}</h3>
        <p class="title">${master.title}</p>
      </div>
    `).join('');

    console.log('Master cards rendered successfully');
  } catch (error) {
    console.error('Error rendering master cards:', error);
    if (elements.mastersGrid) {
      elements.mastersGrid.innerHTML = '<p style="color: red; text-align: center;">Error rendering masters: ' + error.message + '</p>';
    }
  }
}

// Make showMasterPreview globally accessible
window.showMasterPreview = showMasterPreview;

function showMasterPreview(masterId) {
  console.log('showMasterPreview called with:', masterId);
  const master = masterSystem.getMasterById(masterId);
  if (!master) {
    console.error('Master not found:', masterId);
    return;
  }
  console.log('Master found:', master.name);

  previewedMasterId = masterId;

  // Set portrait image or emoji fallback
  if (master.portrait) {
    elements.previewPortrait.innerHTML = `<img src="${master.portrait}" alt="${master.name}" onerror="this.outerHTML='${master.emoji}'">`;
  } else {
    elements.previewPortrait.textContent = master.emoji;
  }
  elements.previewPortrait.style.borderColor = master.color;
  elements.previewName.textContent = master.name;
  elements.previewName.style.color = master.color;
  elements.previewTitle.textContent = master.title;
  elements.previewRole.textContent = master.role;
  elements.previewDescription.textContent = master.description;
  elements.previewPassiveName.textContent = master.passive.name;
  elements.previewPassiveDesc.textContent = master.passive.description;

  elements.masterPreview.classList.remove('hidden');

  document.querySelectorAll('.master-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.master === masterId);
  });
}

function startGame() {
  if (!previewedMasterId) return;

  // Select master
  masterSystem.selectMaster(previewedMasterId);

  // Initialize waifu system with starter
  waifuSystem.init();

  // Initialize gift system with starter gifts
  if (giftSystem) giftSystem.init();

  // Setup UI
  updateMasterUI();
  updateWaifuUI();
  renderCatCollection();
  renderUpgrades();
  updateResourceDisplay();

  // Switch screens
  elements.masterSelectScreen.classList.remove('active');
  elements.gameScreen.classList.add('active');

  // Start all systems
  requestAnimationFrame(gameLoop);
  startAutoSave();
  if (gooseSystem) gooseSystem.start();
  if (eventSystem) eventSystem.start();
  if (expeditionSystem) expeditionSystem.start();

  // Render Phase 3 UI elements
  renderExpeditions();
  renderPrestige();
  updateExpeditionsUI();
  renderDailyCommissions();
  renderPagoda();
  renderEquipment();

  // Start achievement checking interval
  setInterval(checkAchievements, 5000);

  // Update daily commissions periodically
  setInterval(renderDailyCommissions, 5000);

  // Update expeditions UI periodically
  setInterval(updateExpeditionsUI, 1000);

  // Update upgrades UI periodically (so affordability updates with BP changes)
  setInterval(renderUpgrades, 2000);
}

// Make startGame globally accessible
window.startGame = startGame;

function updateMasterUI() {
  if (!masterSystem) return;
  const master = masterSystem.selectedMaster;
  if (!master) return;

  if (elements.currentMasterName) {
    elements.currentMasterName.textContent = master.name;
    elements.currentMasterName.style.color = master.color;
  }
  if (elements.masterQuote) {
    elements.masterQuote.textContent = `"${masterSystem.getRandomQuote()}"`;
  }
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
  console.log('Setting up event listeners...');

  // Master select
  if (!elements.mastersGrid) {
    console.error('mastersGrid element not found!');
  } else {
    console.log('mastersGrid found, adding click listener');
    elements.mastersGrid.addEventListener('click', (e) => {
      console.log('Masters grid clicked', e.target);
      const card = e.target.closest('.master-card');
      if (card) {
        console.log('Master card found:', card.dataset.master);
        showMasterPreview(card.dataset.master);
      } else {
        console.log('No master card found in click target');
      }
    });
  }

  if (!elements.selectMasterBtn) {
    console.error('selectMasterBtn element not found!');
  } else {
    console.log('selectMasterBtn found, adding click listener');
    elements.selectMasterBtn.addEventListener('click', startGame);
  }

  // Boop button
  elements.boopButton.addEventListener('click', handleBoop);

  // Keyboard boop
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && elements.gameScreen.classList.contains('active')) {
      e.preventDefault();
      if (!elements.gooseOverlay.classList.contains('hidden')) {
        // Goose is active, try to boop it
        attemptGooseBoop();
      } else {
        handleBoop();
      }
    }
  });

  // Tabs
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      switchTab(tabId);
    });
  });

  // Mobile Navigation
  setupMobileNavigation();

  // Settings & Help modals
  setupSettingsAndHelp();

  // PP Breakdown hover
  setupPPBreakdown();

  // Goose Ally selection
  setupGooseAllyUI();

  // Codex
  setupCodex();

  // Waifu modal
  setupWaifuModal();

  // Recruit cat
  elements.recruitBtn.addEventListener('click', recruitCat);

  // AFK modal close
  elements.afkCloseBtn.addEventListener('click', () => {
    elements.afkModal.classList.add('hidden');
  });

  // Goose click - both target and container
  if (elements.gooseTarget) {
    elements.gooseTarget.addEventListener('click', attemptGooseBoop);
  }
  if (elements.gooseContainer) {
    elements.gooseContainer.addEventListener('click', attemptGooseBoop);
  }

  // Mini-game button
  if (elements.minigameBtn) {
    elements.minigameBtn.addEventListener('click', () => {
      jadeDotGame.start(1);
    });
  }

  // Expedition start button
  if (elements.startExpeditionBtn) {
    elements.startExpeditionBtn.addEventListener('click', startSelectedExpedition);
  }

  // Rebirth button
  if (elements.rebirthBtn) {
    elements.rebirthBtn.addEventListener('click', handleRebirth);
  }

  // Pagoda start button
  const startPagodaBtn = document.getElementById('start-pagoda-btn');
  if (startPagodaBtn) {
    startPagodaBtn.addEventListener('click', startPagodaRun);
  }

  // Pagoda command buttons
  document.querySelectorAll('.cmd-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmdId = btn.dataset.cmd;
      executePagodaCommand(cmdId);
    });
  });

  // Golden snoot click
  const goldenSnoot = document.getElementById('golden-snoot');
  if (goldenSnoot) {
    goldenSnoot.addEventListener('click', () => {
      if (!goldenSnootSystem) return;
      const result = goldenSnootSystem.clickGoldenSnoot();
      if (result) {
        // Apply rewards
        if (result.rewards.bp) gameState.boopPoints += result.rewards.bp;
        if (result.rewards.pp) gameState.purrPower += result.rewards.pp;
        updateResourceDisplay();
        showFloatingText(`${result.event.emoji} ${result.event.name}!`, true);

        // Track for daily commissions
        if (dailySystem) dailySystem.trackProgress('goldenSnoots', 1);
      }
    });
  }

  // Reset button
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetGame);
  }

  // Claim all daily rewards button
  const claimAllDailyBtn = document.getElementById('claim-all-daily');
  if (claimAllDailyBtn) {
    claimAllDailyBtn.addEventListener('click', () => {
      if (!dailySystem) return;
      const rewards = dailySystem.claimAllRewards();
      if (rewards.bp > 0 || rewards.pp > 0) {
        gameState.boopPoints += rewards.bp;
        gameState.purrPower += rewards.pp;
        updateResourceDisplay();
        renderDailyCommissions();
        showFloatingText(`Claimed ${formatNumber(rewards.bp)} BP!`, true);
      }
    });
  }

  // Cycle quotes periodically
  setInterval(() => {
    if (masterSystem.selectedMaster) {
      elements.masterQuote.textContent = `"${masterSystem.getRandomQuote()}"`;
    }
  }, 15000);

  // Cycle waifu dialogue
  setInterval(() => {
    updateWaifuDialogue();
  }, 20000);
}

function switchTab(tabId) {
  elements.tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  // Toggle all tab content visibility with null checks
  if (elements.catsTab) {
    elements.catsTab.classList.toggle('active', tabId === 'cats');
  }
  if (elements.upgradesTab) {
    elements.upgradesTab.classList.toggle('active', tabId === 'upgrades');
  }
  if (elements.pagodaTab) {
    elements.pagodaTab.classList.toggle('active', tabId === 'pagoda');
  }
  if (elements.equipmentTab) {
    elements.equipmentTab.classList.toggle('active', tabId === 'equipment');
  }
  if (elements.expeditionsTab) {
    elements.expeditionsTab.classList.toggle('active', tabId === 'expeditions');
  }
  if (elements.facilitiesTab) {
    elements.facilitiesTab.classList.toggle('active', tabId === 'facilities');
  }
  if (elements.statsTab) {
    elements.statsTab.classList.toggle('active', tabId === 'stats');
  }
  if (elements.catinoTab) {
    elements.catinoTab.classList.toggle('active', tabId === 'catino');
  }
  if (elements.partnersTab) {
    elements.partnersTab.classList.toggle('active', tabId === 'partners');
  }
  if (elements.techniquesTab) {
    elements.techniquesTab.classList.toggle('active', tabId === 'techniques');
  }
  if (elements.forgeTab) {
    elements.forgeTab.classList.toggle('active', tabId === 'forge');
  }

  // Update content when switching tabs
  if (tabId === 'stats') {
    updateStatsDisplay();
  } else if (tabId === 'expeditions') {
    renderExpeditions();
    updateExpeditionsUI();
  } else if (tabId === 'facilities') {
    renderPrestige();
  } else if (tabId === 'pagoda') {
    renderPagoda();
  } else if (tabId === 'equipment') {
    renderEquipment();
  } else if (tabId === 'cats') {
    renderCatCollection();
  } else if (tabId === 'upgrades') {
    renderUpgrades();
  } else if (tabId === 'catino') {
    renderCatino();
  } else if (tabId === 'partners') {
    renderPartners();
  } else if (tabId === 'techniques') {
    renderTechniquesPanel();
  } else if (tabId === 'forge') {
    renderForgeTab();
  }
}

// ===================================
// MOBILE NAVIGATION
// ===================================

const TAB_TITLES = {
  cats: '🐱 Cat Collection',
  upgrades: '⚔️ Snoot Arts',
  pagoda: '🏯 Infinite Pagoda',
  equipment: '⚙️ Equipment',
  expeditions: '🗺️ Expeditions',
  catino: '🎰 Cat-sino',
  partners: '💕 Partners',
  facilities: '☯️ Sect Facilities',
  techniques: '📜 Skills & Techniques',
  stats: '📊 Stats',
  waifu: '💝 Waifu Master'
};

let mobileMoreMenuOpen = false;

function setupMobileNavigation() {
  // Mobile nav button clicks
  if (elements.mobileNavBtns) {
    elements.mobileNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        if (tabId === 'more') {
          toggleMobileMoreMenu();
        } else {
          closeMobileMoreMenu();
          openMobileTab(tabId);

          // Update active state
          elements.mobileNavBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
  }

  // More menu button clicks
  if (elements.moreMenuBtns) {
    elements.moreMenuBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        closeMobileMoreMenu();
        openMobileTab(tabId);

        // Clear main nav active state
        elements.mobileNavBtns.forEach(b => b.classList.remove('active'));
      });
    });
  }

  // Close modal button
  if (elements.mobileTabClose) {
    elements.mobileTabClose.addEventListener('click', closeMobileTabModal);
  }

  // Close modal on backdrop click
  if (elements.mobileTabModal) {
    elements.mobileTabModal.addEventListener('click', (e) => {
      if (e.target === elements.mobileTabModal) {
        closeMobileTabModal();
      }
    });
  }

  // Close more menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMoreMenuOpen &&
        !e.target.closest('.mobile-more-menu') &&
        !e.target.closest('[data-tab="more"]')) {
      closeMobileMoreMenu();
    }
  });

  // Escape key closes mobile modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!elements.mobileTabModal?.classList.contains('hidden')) {
        closeMobileTabModal();
      }
      closeMobileMoreMenu();
    }
  });
}

function openMobileTab(tabId) {
  if (!elements.mobileTabModal || !elements.mobileTabContent) return;

  // Handle waifu panel specially
  if (tabId === 'waifu') {
    openMobileWaifuPanel();
    return;
  }

  // Get the source tab content
  const sourceTab = document.getElementById(`${tabId}-tab`);
  if (!sourceTab) return;

  // Set title
  if (elements.mobileTabTitle) {
    elements.mobileTabTitle.textContent = TAB_TITLES[tabId] || tabId;
  }

  // Clone content into mobile modal
  elements.mobileTabContent.innerHTML = '';
  const clone = sourceTab.cloneNode(true);
  clone.classList.add('active');
  clone.style.display = 'block';
  elements.mobileTabContent.appendChild(clone);

  // Re-attach event listeners for cloned content
  reattachMobileEventListeners(tabId, clone);

  // Show modal
  elements.mobileTabModal.classList.remove('hidden');

  // Also switch the desktop tab (for state consistency)
  switchTab(tabId);
}

function openMobileWaifuPanel() {
  if (!elements.mobileTabModal || !elements.mobileTabContent) return;

  // Set title
  if (elements.mobileTabTitle) {
    elements.mobileTabTitle.textContent = TAB_TITLES.waifu;
  }

  // Get waifu panel content
  const waifuPanel = document.querySelector('.waifu-panel');
  if (!waifuPanel) return;

  // Clone and show
  elements.mobileTabContent.innerHTML = '';
  const clone = waifuPanel.cloneNode(true);
  clone.style.display = 'block';
  elements.mobileTabContent.appendChild(clone);

  elements.mobileTabModal.classList.remove('hidden');
}

function closeMobileTabModal() {
  if (elements.mobileTabModal) {
    elements.mobileTabModal.classList.add('hidden');
  }
  if (elements.mobileTabContent) {
    elements.mobileTabContent.innerHTML = '';
  }
}

function toggleMobileMoreMenu() {
  if (elements.mobileMoreMenu) {
    mobileMoreMenuOpen = !mobileMoreMenuOpen;
    elements.mobileMoreMenu.classList.toggle('hidden', !mobileMoreMenuOpen);
  }
}

function closeMobileMoreMenu() {
  if (elements.mobileMoreMenu) {
    mobileMoreMenuOpen = false;
    elements.mobileMoreMenu.classList.add('hidden');
  }
}

function reattachMobileEventListeners(tabId, container) {
  // Re-attach button listeners for cloned content
  switch (tabId) {
    case 'cats':
      const recruitBtn = container.querySelector('#recruit-btn');
      if (recruitBtn) {
        recruitBtn.addEventListener('click', recruitCat);
      }
      break;

    case 'upgrades':
      container.querySelectorAll('.upgrade-card').forEach(card => {
        card.addEventListener('click', () => {
          const upgradeId = card.dataset.upgrade;
          if (upgradeId) {
            purchaseUpgrade(upgradeId);
            // Refresh the modal content
            openMobileTab(tabId);
          }
        });
      });
      break;

    case 'pagoda':
      const startPagodaBtn = container.querySelector('#start-pagoda-btn');
      if (startPagodaBtn) {
        startPagodaBtn.addEventListener('click', startPagodaRun);
      }
      container.querySelectorAll('.cmd-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cmd = btn.dataset.cmd;
          if (cmd) executePagodaCommand(cmd);
        });
      });
      break;

    case 'expeditions':
      container.querySelectorAll('.expedition-dest').forEach(dest => {
        dest.addEventListener('click', () => {
          selectExpeditionDestination(dest.dataset.destination);
        });
      });
      const startExpBtn = container.querySelector('#start-expedition-btn');
      if (startExpBtn) {
        startExpBtn.addEventListener('click', startSelectedExpedition);
      }
      break;

    case 'catino':
      const spinBtn = container.querySelector('#spin-slots-btn');
      if (spinBtn) {
        spinBtn.addEventListener('click', spinSlots);
      }
      const raceBtn = container.querySelector('#start-race-btn');
      if (raceBtn) {
        raceBtn.addEventListener('click', startGooseRace);
      }
      container.querySelectorAll('.mystery-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const rarity = btn.textContent.includes('Common') ? 'common' :
                         btn.textContent.includes('Rare') ? 'rare' : 'legendary';
          openMysteryBox(rarity);
        });
      });
      break;

    case 'partners':
      const summonBtn = container.querySelector('#summon-partner-btn');
      if (summonBtn) {
        summonBtn.addEventListener('click', summonPartner);
      }
      break;

    case 'facilities':
      const rebirthBtn = container.querySelector('#rebirth-btn');
      if (rebirthBtn) {
        rebirthBtn.addEventListener('click', handleRebirth);
      }
      break;

    case 'stats':
      const resetBtn = container.querySelector('#reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
      }
      break;
  }
}

// ===================================
// SETTINGS & HELP
// ===================================

// Settings state
const settings = {
  sfxEnabled: true,
  musicEnabled: true,
  volume: 70,
  particlesEnabled: true,
  screenshakeEnabled: true
};

function setupSettingsAndHelp() {
  // Settings button
  if (elements.settingsBtn) {
    elements.settingsBtn.addEventListener('click', openSettings);
  }

  // Settings close button
  if (elements.settingsCloseBtn) {
    elements.settingsCloseBtn.addEventListener('click', closeSettings);
  }

  // Settings modal backdrop click
  if (elements.settingsModal) {
    elements.settingsModal.addEventListener('click', (e) => {
      if (e.target === elements.settingsModal) {
        closeSettings();
      }
    });
  }

  // Help button
  if (elements.helpBtn) {
    elements.helpBtn.addEventListener('click', openHelp);
  }

  // Help close button
  if (elements.helpCloseBtn) {
    elements.helpCloseBtn.addEventListener('click', closeHelp);
  }

  // Help modal backdrop click
  if (elements.helpModal) {
    elements.helpModal.addEventListener('click', (e) => {
      if (e.target === elements.helpModal) {
        closeHelp();
      }
    });
  }

  // Toggle buttons
  if (elements.sfxToggle) {
    elements.sfxToggle.addEventListener('click', () => toggleSetting('sfx'));
  }
  if (elements.musicToggle) {
    elements.musicToggle.addEventListener('click', () => toggleSetting('music'));
  }
  if (elements.particlesToggle) {
    elements.particlesToggle.addEventListener('click', () => toggleSetting('particles'));
  }
  if (elements.screenshakeToggle) {
    elements.screenshakeToggle.addEventListener('click', () => toggleSetting('screenshake'));
  }

  // Volume slider
  if (elements.volumeSlider) {
    elements.volumeSlider.addEventListener('input', (e) => {
      settings.volume = parseInt(e.target.value);
      if (elements.volumeValue) {
        elements.volumeValue.textContent = settings.volume + '%';
      }
      if (audioSystem) {
        audioSystem.setVolume(settings.volume / 100);
      }
    });
  }

  // Export/Import save
  if (elements.exportSaveBtn) {
    elements.exportSaveBtn.addEventListener('click', exportSave);
  }
  if (elements.importSaveBtn) {
    elements.importSaveBtn.addEventListener('click', importSave);
  }

  // Load saved settings
  loadSettings();
}

function openSettings() {
  if (elements.settingsModal) {
    elements.settingsModal.classList.remove('hidden');
    updateSettingsUI();
  }
}

function closeSettings() {
  if (elements.settingsModal) {
    elements.settingsModal.classList.add('hidden');
  }
  saveSettings();
}

function openHelp() {
  if (elements.helpModal) {
    elements.helpModal.classList.remove('hidden');
  }
}

function closeHelp() {
  if (elements.helpModal) {
    elements.helpModal.classList.add('hidden');
  }
}

function toggleSetting(setting) {
  switch (setting) {
    case 'sfx':
      settings.sfxEnabled = !settings.sfxEnabled;
      if (audioSystem) audioSystem.setSFXEnabled(settings.sfxEnabled);
      break;
    case 'music':
      settings.musicEnabled = !settings.musicEnabled;
      if (audioSystem) audioSystem.setMusicEnabled(settings.musicEnabled);
      break;
    case 'particles':
      settings.particlesEnabled = !settings.particlesEnabled;
      break;
    case 'screenshake':
      settings.screenshakeEnabled = !settings.screenshakeEnabled;
      break;
  }
  updateSettingsUI();
  saveSettings();
}

function updateSettingsUI() {
  if (elements.sfxToggle) {
    elements.sfxToggle.textContent = settings.sfxEnabled ? 'ON' : 'OFF';
    elements.sfxToggle.setAttribute('aria-pressed', settings.sfxEnabled);
  }
  if (elements.musicToggle) {
    elements.musicToggle.textContent = settings.musicEnabled ? 'ON' : 'OFF';
    elements.musicToggle.setAttribute('aria-pressed', settings.musicEnabled);
  }
  if (elements.particlesToggle) {
    elements.particlesToggle.textContent = settings.particlesEnabled ? 'ON' : 'OFF';
    elements.particlesToggle.setAttribute('aria-pressed', settings.particlesEnabled);
  }
  if (elements.screenshakeToggle) {
    elements.screenshakeToggle.textContent = settings.screenshakeEnabled ? 'ON' : 'OFF';
    elements.screenshakeToggle.setAttribute('aria-pressed', settings.screenshakeEnabled);
  }
  if (elements.volumeSlider) {
    elements.volumeSlider.value = settings.volume;
  }
  if (elements.volumeValue) {
    elements.volumeValue.textContent = settings.volume + '%';
  }
}

function saveSettings() {
  localStorage.setItem('snoot_booper_settings', JSON.stringify(settings));
}

function loadSettings() {
  const saved = localStorage.getItem('snoot_booper_settings');
  if (saved) {
    try {
      const loaded = JSON.parse(saved);
      Object.assign(settings, loaded);
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }
  updateSettingsUI();
}

function exportSave() {
  const encoded = SaveSystem.exportSave();
  if (encoded && elements.saveCodeInput) {
    elements.saveCodeInput.value = encoded;
    elements.saveCodeInput.select();
    try {
      document.execCommand('copy');
      showFloatingText('Save code copied!', 0, 0, false);
    } catch (e) {
      showFloatingText('Code ready - copy manually', 0, 0, false);
    }
  }
}

function importSave() {
  if (!elements.saveCodeInput) return;

  const code = elements.saveCodeInput.value.trim();
  if (!code) {
    showFloatingText('Paste a save code first!', 0, 0, false);
    return;
  }

  if (SaveSystem.importSave(code)) {
    showFloatingText('Save imported! Reloading...', 0, 0, false);
    setTimeout(() => location.reload(), 1000);
  } else {
    showFloatingText('Invalid save code!', 0, 0, false);
  }
}

// ===================================
// PP BREAKDOWN
// ===================================

function setupPPBreakdown() {
  if (elements.ppResourceContainer && elements.ppBreakdown) {
    elements.ppResourceContainer.addEventListener('mouseenter', showPPBreakdown);
    elements.ppResourceContainer.addEventListener('mouseleave', hidePPBreakdown);
    elements.ppResourceContainer.addEventListener('click', togglePPBreakdown);
  }
}

let ppBreakdownVisible = false;

function togglePPBreakdown() {
  ppBreakdownVisible = !ppBreakdownVisible;
  if (ppBreakdownVisible) {
    showPPBreakdown();
  } else {
    hidePPBreakdown();
  }
}

function showPPBreakdown() {
  if (!elements.ppBreakdown || !elements.ppBreakdownContent) return;

  const breakdown = calculatePPBreakdown();
  renderPPBreakdown(breakdown);
  elements.ppBreakdown.classList.remove('hidden');
}

function hidePPBreakdown() {
  if (ppBreakdownVisible) return; // Keep open if toggled on
  if (elements.ppBreakdown) {
    elements.ppBreakdown.classList.add('hidden');
  }
}

function calculatePPBreakdown() {
  const breakdown = {
    basePP: 0,
    catContributions: [],
    realmBonuses: { mortal: 0, earth: 0, sky: 0, heaven: 0, divine: 0 },
    happinessMultiplier: 1,
    waifuMultiplier: 1,
    masterMultiplier: 1,
    upgradeMultiplier: 1,
    total: 0
  };

  if (!catSystem) return breakdown;

  const cats = catSystem.getAllCats();
  const realms = { mortal: 1, earth: 2, sky: 5, heaven: 15, divine: 50 };

  // Calculate base PP from each cat
  cats.forEach(cat => {
    const realm = cat.realm || 'mortal';
    const realmMult = realms[realm] || 1;
    const happiness = cat.happiness || 50;
    const happinessMult = 0.5 + (happiness / 100);
    const innerPurr = cat.stats?.innerPurr || 1;
    const loafMastery = cat.stats?.loafMastery || 1;

    const catPP = innerPurr * loafMastery * realmMult * happinessMult;
    breakdown.basePP += catPP;
    breakdown.realmBonuses[realm] = (breakdown.realmBonuses[realm] || 0) + catPP;
  });

  // Happiness average
  if (cats.length > 0) {
    const avgHappiness = cats.reduce((sum, c) => sum + (c.happiness || 50), 0) / cats.length;
    breakdown.happinessMultiplier = 0.5 + (avgHappiness / 100);
  }

  // Waifu bonuses
  if (waifuSystem) {
    const waifuBonuses = waifuSystem.getCombinedBonuses();
    breakdown.waifuMultiplier = waifuBonuses.ppMultiplier || 1;
  }

  // Master bonuses
  if (masterSystem) {
    const masterEffects = masterSystem.getPassiveEffects(gameState);
    if (masterEffects.catHappinessMultiplier) {
      breakdown.masterMultiplier *= masterEffects.catHappinessMultiplier;
    }
  }

  // Upgrade bonuses
  if (upgradeSystem) {
    const upgradeEffects = upgradeSystem.getCombinedEffects();
    breakdown.upgradeMultiplier = upgradeEffects.ppMultiplier || 1;
  }

  // Calculate total
  breakdown.total = breakdown.basePP * breakdown.waifuMultiplier * breakdown.upgradeMultiplier;

  return breakdown;
}

function renderPPBreakdown(breakdown) {
  if (!elements.ppBreakdownContent) return;

  let html = '';

  // Realm contributions
  const realmEmoji = { mortal: '⬜', earth: '🟫', sky: '🟦', heaven: '🟨', divine: '⬛' };
  const realmNames = { mortal: 'Mortal', earth: 'Earth', sky: 'Sky', heaven: 'Heaven', divine: 'Divine' };

  for (const [realm, pp] of Object.entries(breakdown.realmBonuses)) {
    if (pp > 0) {
      html += `
        <div class="pp-breakdown-row">
          <span class="label">${realmEmoji[realm]} ${realmNames[realm]} Cats</span>
          <span class="value">+${formatNumber(pp)}/s</span>
        </div>
      `;
    }
  }

  // Multipliers
  if (breakdown.waifuMultiplier !== 1) {
    html += `
      <div class="pp-breakdown-row">
        <span class="label">💕 Waifu Bonus</span>
        <span class="value">×${breakdown.waifuMultiplier.toFixed(2)}</span>
      </div>
    `;
  }

  if (breakdown.upgradeMultiplier !== 1) {
    html += `
      <div class="pp-breakdown-row">
        <span class="label">⚔️ Upgrades</span>
        <span class="value">×${breakdown.upgradeMultiplier.toFixed(2)}</span>
      </div>
    `;
  }

  if (breakdown.masterMultiplier !== 1) {
    html += `
      <div class="pp-breakdown-row">
        <span class="label">👤 Master</span>
        <span class="value">×${breakdown.masterMultiplier.toFixed(2)}</span>
      </div>
    `;
  }

  // Total
  html += `
    <div class="pp-breakdown-row total">
      <span class="label">TOTAL</span>
      <span class="value">${formatNumber(breakdown.total)}/s</span>
    </div>
  `;

  elements.ppBreakdownContent.innerHTML = html;
}

// ===================================
// GOOSE ALLY UI
// ===================================

function setupGooseAllyUI() {
  if (elements.allyBtns) {
    elements.allyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const allyId = btn.dataset.ally;
        selectGooseAlly(allyId);
      });
    });
  }
}

function selectGooseAlly(allyId) {
  if (!gooseSystem || !gooseSystem.gooseAllyUnlocked) {
    showFloatingText('Defeat Cobra Chicken first!', 0, 0, false);
    return;
  }

  const ally = gooseSystem.selectAlly(allyId);
  if (ally) {
    showFloatingText(`${ally.name} selected!`, 0, 0, false);
    updateGooseAllyUI();
    if (audioSystem) audioSystem.playSFX('upgrade');
  }
}

function updateGooseAllyUI() {
  // Check if goose ally is unlocked
  const unlocked = gooseSystem && gooseSystem.gooseAllyUnlocked;

  // Show/hide the section
  if (elements.gooseAllySection) {
    if (unlocked || (gameState && gameState.cobraChickenDefeated)) {
      elements.gooseAllySection.classList.remove('hidden');
    } else {
      elements.gooseAllySection.classList.add('hidden');
      return;
    }
  }

  // Get current ally
  const currentAlly = gooseSystem?.selectedAlly || gameState?.gooseAlly;

  // Update display
  if (currentAlly) {
    if (elements.allyEmoji) {
      elements.allyEmoji.textContent = currentAlly.emoji || '🦢';
    }
    if (elements.allyName) {
      elements.allyName.textContent = currentAlly.name;
    }
    if (elements.allyEffect) {
      elements.allyEffect.textContent = currentAlly.description;
    }
    if (elements.allyQuote) {
      elements.allyQuote.textContent = currentAlly.quote || '';
    }
  } else {
    if (elements.allyEmoji) elements.allyEmoji.textContent = '🦢';
    if (elements.allyName) elements.allyName.textContent = 'Select an Ally';
    if (elements.allyEffect) elements.allyEffect.textContent = 'Choose a goose to aid your cultivation!';
    if (elements.allyQuote) elements.allyQuote.textContent = '';
  }

  // Update button states
  if (elements.allyBtns) {
    elements.allyBtns.forEach(btn => {
      const allyId = btn.dataset.ally;
      const isSelected = currentAlly && currentAlly.id === allyId;
      btn.classList.toggle('selected', isSelected);
    });
  }
}

// ===================================
// CODEX SYSTEM
// ===================================

// Lore entries for the codex
const CODEX_ENTRIES = {
  masters: [
    { id: 'gerald', emoji: '🐉', title: 'Gerald - The Jade Palm', subtitle: 'Sect Leader', unlocked: true,
      story: "Gerald founded the Celestial Snoot Sect after discovering the Ancient Snoot Scrolls in a forgotten temple.\n\nOnce a wandering cultivator, he realized that true power came not from combat, but from the gentle art of the boop.\n\n\"Balance in all things,\" he would say. \"Especially snoots.\"\n\nHis jade palm technique allows him to channel qi directly through snoot meridians, achieving perfect cultivation harmony." },
    { id: 'rusty', emoji: '👊', title: 'Rusty - The Crimson Fist', subtitle: 'War General', unlocked: true,
      story: "Before joining the Sect, Rusty was known as the Crimson Bandit King - feared across seven provinces.\n\nHis legendary Thousand Boop Barrage could overwhelm any opponent. But one day, a small tabby cat booped HIM.\n\n\"That day, I understood,\" Rusty recalls. \"The true path isn't about destroying enemies. It's about booping snoots.\"\n\nHe now serves as the Sect's War General, protecting all cats under their care with his reformed fury." },
    { id: 'steve', emoji: '🌊', title: 'Steve - The Flowing River', subtitle: 'Strategist', unlocked: true,
      story: "Steve spent 10,000 hours calculating the optimal snoot-to-boop ratio.\n\nHis spreadsheets are legendary. His patience, infinite.\n\n\"The math is clear,\" Steve explains while adjusting his glasses. \"Maximum PP generation requires exactly 2.7 boops per cat per minute, adjusted for happiness decay.\"\n\nHis Eternal Flow technique allows cultivation to continue even while sleeping. Some say he never actually stops calculating." },
    { id: 'andrew', emoji: '⚡', title: 'Andrew - The Thunder Step', subtitle: 'Scout', unlocked: true,
      story: "No one has ever seen Andrew standing still. Legend says he was born running.\n\n\"Already found three cats while you were reading this,\" is his catchphrase.\n\nHis Lightning Reflexes allow him to discover events before they happen. Some theorize he exists slightly in the future.\n\nHe serves as the Sect's scout, always first to find new snoots in need of booping." },
    { id: 'nik', emoji: '🌙', title: 'Nik - The Shadow Moon', subtitle: 'Assassin', unlocked: true,
      story: "...\n\n*appears from shadows*\n\n...boop.\n\n*disappears*\n\nNo one knows Nik's full story. The cats trust him completely. No one knows why.\n\nHis Phantom Boop technique strikes without warning, achieving critical damage before the target even realizes they've been booped.\n\nSome say he isn't human at all, but a manifestation of the night itself." },
    { id: 'yuelin', emoji: '🪷', title: 'Yuelin - The Lotus Sage', subtitle: 'Healer', unlocked: true,
      story: "Yuelin can speak to cats in their ancient tongue - a language lost to all others.\n\n\"The cats tell me you have a kind heart,\" she often says to newcomers.\n\nHer Harmonious Aura brings peace to all felines, increasing their happiness merely by her presence.\n\nSome whisper that she was once a cat herself, transformed by the Jade Emperor as a reward for perfect cultivation." },
    { id: 'scott', emoji: '⛰️', title: 'Scott - The Mountain', subtitle: 'Guardian', unlocked: true,
      story: "Scott meditated for exactly 1,000 days without moving.\n\nA cat sat on him the entire time. Worth it.\n\nHis Unshakeable Foundation technique prevents any decay or reset of his cultivation multipliers.\n\n\"I am the mountain,\" he says. \"The cats are my snow.\"\n\nTo this day, if you look closely, you can see the faint outline of a cat's pawprint on his shoulder." }
  ],
  waifus: [
    { id: 'mochi', emoji: '🍡', title: 'Mochi-chan', subtitle: 'The Welcoming Dawn', unlocked: true,
      story: "Mochi-chan runs the Celestial Teahouse at the heart of the Sect.\n\n\"Welcome back to the teahouse, cultivator~\"\n\nFew know that she was once a fierce warrior, wielding the legendary Dango Blade. She retired after realizing that hospitality brought more joy than combat.\n\nHer special tea can restore any cultivator's spirit. The secret ingredient? Love. (And catnip.)" },
    { id: 'luna', emoji: '🌙', title: 'Luna Whiskerbell', subtitle: 'The Midnight Watcher', unlocked: false, unlockHint: 'Reach 24 hours of total AFK time',
      story: "Luna doesn't sleep. Not because she can't - because she's afraid of the dreams.\n\n*yawn* \"The night shift... is peaceful...\"\n\nShe watches over all sleeping cats, ensuring their dreams are filled with endless treats and warm sunbeams.\n\nSome say her sleepy demeanor hides immense power - power she once used to seal away a nightmare demon." },
    { id: 'nyanta', emoji: '🏴‍☠️', title: 'Captain Nyanta', subtitle: 'The Sea Sovereign', unlocked: false, unlockHint: 'Recruit 50 cats',
      story: "YARR! Captain Nyanta sailed the seven seas seeking gold!\n\nWhat she found instead was the greatest treasure of all: friendship. (And also a lot of gold.)\n\nHer ship, the Whisker Wind, can sail to dimensions unknown, discovering rare cats across infinite worlds.\n\n\"The seas be calm and full of snoots today!\"" }
  ],
  cats: [
    { id: 'ceiling_cat', emoji: '😺', title: 'Ceiling Cat', subtitle: 'The All-Seeing', unlocked: false, unlockHint: 'Reach 10,000 total boops',
      story: "In the beginning, there was only the Ceiling. And upon it, the Cat.\n\nCeiling Cat watches from above, judging all boops. Those deemed worthy receive his blessing.\n\nAncient scriptures speak of a prophecy: when one achieves one million critical boops, Ceiling Cat will descend to grant the ultimate technique.\n\nUntil then, he watches. Always watches." },
    { id: 'keyboard_cat', emoji: '🎹', title: 'Keyboard Cat', subtitle: 'Melody of Ages', unlocked: false, unlockHint: 'Achieve a 100-hit combo',
      story: "The legendary Keyboard Cat once played a melody so beautiful, it brought peace to warring nations.\n\nNow semi-retired, he occasionally graces the Sect with impromptu concerts.\n\nHis music has special properties - it can boost cultivation speed by up to 500% for those who truly appreciate the arts." }
  ],
  geese: [
    { id: 'untitled', emoji: '🦢', title: 'The Untitled Goose', subtitle: 'Horrible', unlocked: true,
      story: "It's a lovely day in the Jianghu, and you are a horrible goose.\n\nNo one knows where the Untitled Goose came from. Some say it was born from pure chaos energy. Others say it escaped from a peaceful village after causing untold mayhem.\n\nIt steals. It honks. It feels no remorse.\n\nHONK." },
    { id: 'cobra_chicken', emoji: '🐔', title: 'Cobra Chicken', subtitle: 'Avatar of Chaos', unlocked: false, unlockHint: 'Reach 1,000 goose boops',
      story: "Not a cobra. Not a chicken. Somehow worse than both.\n\nThe Cobra Chicken is the final form of goose rage - a being of pure, concentrated HONK energy.\n\nLegend says defeating it grants access to tame goose allies. But few have ever succeeded...\n\nThose who have speak only in hushed whispers: \"It honked... so loud...\"" }
  ]
};

let currentCodexCategory = 'masters';

function setupCodex() {
  // Open codex button
  if (elements.openCodexBtn) {
    elements.openCodexBtn.addEventListener('click', openCodex);
  }

  // Close codex button
  if (elements.codexCloseBtn) {
    elements.codexCloseBtn.addEventListener('click', closeCodex);
  }

  // Codex modal backdrop click
  if (elements.codexModal) {
    elements.codexModal.addEventListener('click', (e) => {
      if (e.target === elements.codexModal) {
        closeCodex();
      }
    });
  }

  // Codex tabs
  if (elements.codexTabs) {
    elements.codexTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.codex;
        switchCodexCategory(category);
      });
    });
  }
}

function openCodex() {
  if (elements.codexModal) {
    elements.codexModal.classList.remove('hidden');
    renderCodex();
    updateLoreCount();
  }
}

function closeCodex() {
  if (elements.codexModal) {
    elements.codexModal.classList.add('hidden');
  }
}

function switchCodexCategory(category) {
  currentCodexCategory = category;

  // Update tab states
  if (elements.codexTabs) {
    elements.codexTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.codex === category);
    });
  }

  renderCodex();
}

function renderCodex() {
  if (!elements.codexContent) return;

  const entries = CODEX_ENTRIES[currentCodexCategory] || [];
  let html = '';

  entries.forEach(entry => {
    const isUnlocked = checkCodexUnlock(entry);

    html += `
      <div class="codex-entry ${isUnlocked ? '' : 'locked'}" onclick="${isUnlocked ? `showCodexEntry('${currentCodexCategory}', '${entry.id}')` : ''}">
        <div class="codex-entry-header">
          <span class="codex-entry-emoji">${isUnlocked ? entry.emoji : '❓'}</span>
          <div>
            <div class="codex-entry-title">${isUnlocked ? entry.title : '???'}</div>
            <div class="codex-entry-subtitle">${isUnlocked ? entry.subtitle : 'Locked'}</div>
          </div>
        </div>
        <div class="codex-entry-preview">
          ${isUnlocked ? entry.story.split('\n')[0].substring(0, 100) + '...' : entry.unlockHint || 'Keep playing to unlock...'}
        </div>
      </div>
    `;
  });

  elements.codexContent.innerHTML = html || '<p style="text-align: center; color: #888;">No entries yet...</p>';
}

function showCodexEntry(category, entryId) {
  const entries = CODEX_ENTRIES[category] || [];
  const entry = entries.find(e => e.id === entryId);
  if (!entry || !elements.codexContent) return;

  elements.codexContent.innerHTML = `
    <div class="codex-full-entry">
      <h3>${entry.emoji} ${entry.title}</h3>
      <p class="story">${entry.story}</p>
      <button class="jade-button small codex-back-btn" onclick="renderCodex()">← Back to List</button>
    </div>
  `;
}

function checkCodexUnlock(entry) {
  if (entry.unlocked) return true;

  // Check various unlock conditions
  if (entry.unlockHint) {
    // Simple checks based on game state
    if (entry.unlockHint.includes('AFK time') && gameState.totalAfkTime >= 86400000) return true;
    if (entry.unlockHint.includes('50 cats') && catSystem && catSystem.getCatCount() >= 50) return true;
    if (entry.unlockHint.includes('10,000 total boops') && gameState.totalBoops >= 10000) return true;
    if (entry.unlockHint.includes('100-hit combo') && gameState.maxCombo >= 100) return true;
    if (entry.unlockHint.includes('1,000 goose boops') && gooseSystem && gooseSystem.gooseBoops >= 1000) return true;
  }

  return false;
}

function updateLoreCount() {
  let unlocked = 0;
  let total = 0;

  for (const category of Object.values(CODEX_ENTRIES)) {
    for (const entry of category) {
      total++;
      if (checkCodexUnlock(entry)) {
        unlocked++;
      }
    }
  }

  if (elements.loreCount) elements.loreCount.textContent = unlocked;
  if (elements.loreTotal) elements.loreTotal.textContent = total;
}

// Make showCodexEntry available globally for onclick
window.showCodexEntry = showCodexEntry;

// ===================================
// CATINO (CASINO) UI
// ===================================

function renderCatino() {
  if (!catinoSystem) return;

  const chipsEl = document.getElementById('catino-chips');
  const unlockBtn = document.getElementById('buy-chips-btn');

  // Auto-unlock for easier testing
  if (!catinoSystem.unlocked) {
    catinoSystem.unlocked = true;
  }

  if (chipsEl) {
    chipsEl.textContent = formatNumber(gameState.boopPoints);
  }

  // Update status
  const statusEl = document.getElementById('catino-status');
  if (statusEl) {
    const status = catinoSystem.getStatus();
    statusEl.textContent = `Won: ${formatNumber(status.totalWon)} | Lost: ${formatNumber(status.totalLost)}`;
  }
}

function buyCatinoChips() {
  // Chips are just BP now - this adds bonus BP
  if (gameState.boopPoints >= 1000) {
    gameState.boopPoints -= 1000;
    gameState.boopPoints += 1100; // Slight bonus for "buying chips"
    renderCatino();
    updateResourceDisplay();
    showFloatingText('+100 Bonus BP!', false);
  } else {
    showFloatingText('Not enough BP!', false);
  }
}

function spinSlots() {
  if (!catinoSystem) {
    document.getElementById('slot-result').textContent = 'Casino not available!';
    return;
  }

  const betSelect = document.getElementById('slot-bet');
  const betMultiplier = parseInt(betSelect.value);
  const bet = betMultiplier * 100; // 1 chip = 100 BP

  if (gameState.boopPoints < bet) {
    document.getElementById('slot-result').textContent = 'Not enough BP!';
    return;
  }

  const result = catinoSystem.playSlots(bet);

  if (!result) {
    document.getElementById('slot-result').textContent = 'Casino not available!';
    return;
  }

  // Animate reels
  const reels = ['reel-1', 'reel-2', 'reel-3'];
  reels.forEach((reelId, i) => {
    const reelEl = document.getElementById(reelId);
    if (reelEl) {
      reelEl.classList.add('spinning');
      setTimeout(() => {
        reelEl.textContent = result.reels[i];
        reelEl.classList.remove('spinning');
      }, 500 + i * 200);
    }
  });

  setTimeout(() => {
    const resultEl = document.getElementById('slot-result');
    if (result.win) {
      const winAmount = bet * result.multiplier;
      resultEl.textContent = `🎉 ${result.name}! +${formatNumber(winAmount)} BP!`;
      resultEl.className = 'slot-result win';
      if (result.multiplier >= 100) {
        triggerScreenShake();
        showFloatingText('JACKPOT!!!', true);
      }
    } else {
      resultEl.textContent = 'No luck this time...';
      resultEl.className = 'slot-result';
    }
    renderCatino();
    updateResourceDisplay();
  }, 1100);
}

function startGooseRace() {
  if (!catinoSystem) {
    document.getElementById('race-result').textContent = 'Race not available!';
    return;
  }

  const pickSelect = document.getElementById('race-pick');
  const betInput = document.getElementById('race-bet');
  const pickIndex = parseInt(pickSelect.value);
  const betChips = parseInt(betInput.value);
  const bet = betChips * 100; // Convert chips to BP

  if (gameState.boopPoints < bet) {
    document.getElementById('race-result').textContent = 'Not enough BP!';
    return;
  }

  // Get the goose by index
  const geese = RACE_GEESE;
  const selectedGoose = geese[pickIndex];

  // Create bets object
  const bets = {};
  bets[selectedGoose.id] = bet;

  const result = catinoSystem.startGooseRace(bets);

  if (!result) {
    document.getElementById('race-result').textContent = 'Race not available!';
    return;
  }

  // Animate race
  const lanes = document.querySelectorAll('.race-lane');
  lanes.forEach(lane => lane.classList.add('racing'));

  setTimeout(() => {
    lanes.forEach(lane => lane.classList.remove('racing'));

    const resultEl = document.getElementById('race-result');
    if (result.winnings > 0) {
      resultEl.textContent = `🎉 ${result.results.winner.name} wins! +${formatNumber(result.winnings)} BP!`;
      resultEl.className = 'race-result win';
    } else {
      resultEl.textContent = `${result.results.winner.name} wins! You picked wrong.`;
      resultEl.className = 'race-result';
    }
    renderCatino();
    updateResourceDisplay();
  }, 2000);
}

function openMysteryBox(tier) {
  if (!catinoSystem) {
    document.getElementById('mystery-result').textContent = 'Casino not available!';
    return;
  }

  const costs = { common: 500, rare: 2500, legendary: 10000 };
  const cost = costs[tier];

  if (gameState.boopPoints < cost) {
    document.getElementById('mystery-result').textContent = 'Not enough BP!';
    return;
  }

  gameState.boopPoints -= cost;
  const result = catinoSystem.openMysteryBox();

  const resultEl = document.getElementById('mystery-result');
  const emoji = result.type === 'jackpot' ? '⭐' : (result.type === 'bp' ? '💰' : (result.type === 'pp' ? '✨' : '📦'));
  resultEl.textContent = `${emoji} ${result.description}`;
  resultEl.className = `mystery-result ${tier}`;

  renderCatino();
  updateResourceDisplay();
}

// Make catino functions global
window.buyCatinoChips = buyCatinoChips;
window.spinSlots = spinSlots;
window.startGooseRace = startGooseRace;
window.openMysteryBox = openMysteryBox;

// ===================================
// PARTNER GENERATOR UI
// ===================================

let lastGeneratedPartner = null;

function renderPartners() {
  if (!partnerGenerator) return;

  const countEl = document.getElementById('partner-count');
  const collectionEl = document.getElementById('partner-collection');
  const summonedEl = document.getElementById('partners-summoned');
  const mythicsEl = document.getElementById('mythics-found');

  if (countEl) countEl.textContent = partnerGenerator.ownedPartners.length;
  if (summonedEl) summonedEl.textContent = partnerGenerator.stats.partnersGenerated;
  if (mythicsEl) mythicsEl.textContent = partnerGenerator.stats.mythicsGenerated;

  if (collectionEl) {
    if (partnerGenerator.ownedPartners.length === 0) {
      collectionEl.innerHTML = '<p class="empty-message">No partners yet. Summon your first!</p>';
    } else {
      collectionEl.innerHTML = partnerGenerator.ownedPartners.map(partner => {
        const rarity = window.PARTNER_RARITIES[partner.rarity];
        return `
          <div class="partner-card" style="border-color: ${rarity.color}">
            <span class="partner-portrait">${partner.portrait}</span>
            <div class="partner-details">
              <span class="partner-name" style="color: ${rarity.color}">${partner.firstName}</span>
              <span class="partner-traits">${partner.traits.map(t => t.name).join(', ')}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function summonPartner() {
  try {
    console.log('summonPartner called');
    console.log('  partnerGenerator:', !!partnerGenerator);
    console.log('  BP:', gameState.boopPoints);

    if (!partnerGenerator) {
      console.error('partnerGenerator is null/undefined');
      showFloatingText('Partners not available!', false);
      return;
    }

    const cost = 1000;
    if (gameState.boopPoints < cost) {
      showFloatingText('Not enough BP! Need 1000', false);
      return;
    }

    gameState.boopPoints -= cost;
    updateResourceDisplay();

    console.log('Generating partner...');
    const partner = partnerGenerator.generate();
    console.log('Generated partner:', partner);
    lastGeneratedPartner = partner;

    if (!partner) {
      console.error('Partner generation failed');
      showFloatingText('Partner generation failed!', false);
      gameState.boopPoints += cost; // Refund
      updateResourceDisplay();
      return;
    }

    const rarity = window.PARTNER_RARITIES[partner.rarity];
    if (!rarity) {
      console.error('Unknown rarity:', partner.rarity);
      return;
    }

    // Show result
    const resultDiv = document.getElementById('partner-result');
    if (resultDiv) {
      resultDiv.classList.remove('hidden');
    } else {
      console.error('partner-result element not found');
    }

    const portraitEl = document.getElementById('new-partner-portrait');
    const nameEl = document.getElementById('new-partner-name');
    const rarityEl = document.getElementById('new-partner-rarity');
    const elementEl = document.getElementById('new-partner-element');
    const traitsEl = document.getElementById('new-partner-traits');

    if (portraitEl) portraitEl.textContent = partner.portrait;
    if (nameEl) {
      nameEl.textContent = partner.name;
      nameEl.style.color = rarity.color;
    }
    if (rarityEl) {
      rarityEl.textContent = `${rarity.name} Partner`;
      rarityEl.style.color = rarity.color;
    }
    if (elementEl) elementEl.textContent = `Element: ${partner.element}`;
    if (traitsEl) traitsEl.textContent = partner.traits.map(t => t.name).join(', ');

    // Special effects for rare partners
    if (partner.rarity === 'legendary' || partner.rarity === 'mythic') {
      triggerScreenShake();
      showFloatingText(`${rarity.name.toUpperCase()}!`, true);
    }

    renderPartners();
    console.log('summonPartner completed successfully');
  } catch (error) {
    console.error('Error in summonPartner:', error);
    showFloatingText('Error summoning partner!', false);
  }
}

function keepPartner() {
  if (lastGeneratedPartner && partnerGenerator) {
    partnerGenerator.addToOwned(lastGeneratedPartner);
    lastGeneratedPartner = null;
    document.getElementById('partner-result').classList.add('hidden');
    renderPartners();
    showFloatingText('Partner added!', false);
  }
}

// Make partner functions global
window.summonPartner = summonPartner;
window.keepPartner = keepPartner;

// ===================================
// IRL INTEGRATION UI
// ===================================

function updateIRLBonusUI() {
  if (!irlIntegrationSystem) return;

  const iconEl = document.getElementById('irl-time-icon');
  const nameEl = document.getElementById('irl-time-name');
  const bonusEl = document.getElementById('irl-time-bonus');

  const timeBonus = irlIntegrationSystem.currentTimeBonus;
  if (timeBonus && iconEl && nameEl && bonusEl) {
    iconEl.textContent = timeBonus.emoji;
    nameEl.textContent = timeBonus.name;
    bonusEl.textContent = timeBonus.description;
  }
}

// ===================================
// DRAMA SYSTEM UI
// ===================================

function toggleDramaPanel() {
  const content = document.getElementById('drama-content');
  if (content) {
    content.classList.toggle('hidden');
    if (!content.classList.contains('hidden')) {
      updateDramaUI();
    }
  }
}

function updateDramaUI() {
  if (!dramaSystem) return;

  const levelEl = document.getElementById('drama-level');
  const fillEl = document.getElementById('drama-fill');
  const statusEl = document.getElementById('drama-status');
  const eventsEl = document.getElementById('drama-events');

  if (levelEl) levelEl.textContent = Math.floor(dramaSystem.dramaPoints);
  if (fillEl) fillEl.style.width = (dramaSystem.dramaPoints / dramaSystem.maxDrama) * 100 + '%';

  if (statusEl) {
    if (dramaSystem.dramaPoints < 20) {
      statusEl.textContent = 'All is peaceful...';
    } else if (dramaSystem.dramaPoints < 50) {
      statusEl.textContent = 'Tensions are rising...';
    } else if (dramaSystem.dramaPoints < 80) {
      statusEl.textContent = 'Drama brewing!';
    } else {
      statusEl.textContent = '🔥 MAXIMUM DRAMA! 🔥';
    }
  }

  if (eventsEl && dramaSystem.dramaLog) {
    eventsEl.innerHTML = dramaSystem.dramaLog.slice(-3).map(event =>
      `<div class="drama-event">${event.emoji} ${event.message}</div>`
    ).join('');
  }
}

// Make drama function global
window.toggleDramaPanel = toggleDramaPanel;

// ===================================
// HARDCORE MODE UI
// ===================================

function updateHardcoreUI() {
  const indicator = document.getElementById('hardcore-indicator');
  const iconEl = document.getElementById('hardcore-icon');
  const nameEl = document.getElementById('hardcore-name');
  const timerEl = document.getElementById('hardcore-timer');

  if (!indicator || !hardcoreSystem) return;

  const status = hardcoreSystem.getCurrentModeStatus();

  if (status) {
    indicator.classList.remove('hidden');
    iconEl.textContent = status.mode.emoji;
    nameEl.textContent = status.mode.name;

    if (status.mode.modifiers.timerEnabled) {
      const minutes = Math.floor(status.duration / 60000);
      const seconds = Math.floor((status.duration % 60000) / 1000);
      timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      timerEl.textContent = '';
    }
  } else {
    indicator.classList.add('hidden');
  }
}

// ===================================
// NEMESIS UI
// ===================================

function showNemesisWarning(nemesis) {
  if (!nemesisSystem) return;

  const warning = document.getElementById('nemesis-warning');
  const titleEl = document.getElementById('nemesis-title');
  const tauntEl = document.getElementById('nemesis-taunt');

  if (!warning) return;

  titleEl.textContent = `💀 ${nemesis.title} 💀`;
  tauntEl.textContent = `"${nemesisSystem.getTaunt(nemesis)}"`;

  warning.classList.remove('hidden');

  // Auto-hide after 5 seconds
  setTimeout(() => {
    warning.classList.add('hidden');
  }, 5000);
}

/**
 * Update the stats display
 */
function updateStatsDisplay() {
  if (elements.statTotalBoops) {
    elements.statTotalBoops.textContent = formatNumber(gameState.totalBoops);
  }
  if (elements.statCritBoops) {
    elements.statCritBoops.textContent = formatNumber(gameState.criticalBoops);
  }
  if (elements.statMaxCombo) {
    elements.statMaxCombo.textContent = gameState.maxCombo;
  }
  if (elements.statCats && catSystem) {
    elements.statCats.textContent = catSystem.getCatCount();
  }
  if (elements.statGeese && gooseSystem) {
    elements.statGeese.textContent = gooseSystem.gooseBoops;
  }
  if (elements.statHighestRealm) {
    elements.statHighestRealm.textContent = getHighestRealm();
  }
  if (elements.statPlaytime) {
    elements.statPlaytime.textContent = formatPlaytime(gameState.playtime);
  }
  if (elements.statAfkTime) {
    elements.statAfkTime.textContent = formatPlaytime(gameState.totalAfkTime);
  }

  // Update achievement progress
  if (achievementSystem) {
    const progress = achievementSystem.getProgress();
    if (elements.achievementCount) {
      elements.achievementCount.textContent = progress.unlocked;
    }
    if (elements.achievementTotal) {
      elements.achievementTotal.textContent = progress.total;
    }
    if (elements.achievementBar) {
      elements.achievementBar.style.width = progress.percent + '%';
    }
  }

  // Update goose ally section
  updateGooseAllyUI();
}

/**
 * Get highest realm cat owned
 */
function getHighestRealm() {
  const cats = catSystem.getAllCats();
  if (cats.length === 0) return 'None';

  const realmOrder = ['divine', 'heaven', 'sky', 'earth', 'mortal'];
  for (const realm of realmOrder) {
    if (cats.some(c => c.realm === realm)) {
      return REALMS[realm].name;
    }
  }
  return 'Mortal';
}

/**
 * Format playtime
 */
function formatPlaytime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

// ===================================
// BOOPING
// ===================================

function handleBoop() {
  // Recalculate modifiers
  recalculateModifiers();

  // Calculate base BP
  let bp = gameState.boopPower;
  bp += gameState.modifiers.bpPerBoop || 0;
  bp *= gameState.modifiers.bpMultiplier || 1;

  // Waifu bonus
  const waifuBonuses = waifuSystem ? waifuSystem.getCombinedBonuses() : { bpMultiplier: 1 };
  bp *= waifuBonuses.bpMultiplier || 1;

  // Check critical
  let critChance = gameState.critChance + (gameState.modifiers.critChance || 0);
  const masterEffects = masterSystem ? masterSystem.getPassiveEffects(gameState) : {};
  if (masterEffects.critChanceBonus) {
    critChance += masterEffects.critChanceBonus;
  }

  const isCrit = Math.random() < critChance;
  if (isCrit) {
    const critMult = gameState.critMultiplier + (gameState.modifiers.critMultiplier || 0);
    bp *= critMult;
    gameState.criticalBoops++;
    if (audioSystem) audioSystem.playSFX('critical');
  } else {
    if (audioSystem) audioSystem.playSFX('boop');
  }

  // Combo system
  gameState.comboCount++;
  if (gameState.comboCount > gameState.maxCombo) {
    gameState.maxCombo = gameState.comboCount;
  }

  // Track combo for daily commissions
  if (dailySystem) dailySystem.trackProgress('combo', gameState.comboCount);

  clearTimeout(gameState.comboTimer);
  gameState.comboTimer = setTimeout(() => {
    gameState.comboCount = 0;
    if (elements.comboDisplay) elements.comboDisplay.classList.add('hidden');
  }, 4000); // 4 second combo window (was 2s)

  // Combo multiplier (up to 2x at 100)
  const comboMult = 1 + (Math.min(gameState.comboCount, 100) * 0.01);
  bp *= comboMult;

  // Update state
  gameState.boopPoints += bp;
  gameState.totalBoops++;

  // Track lifetime BP for prestige
  if (prestigeSystem) prestigeSystem.trackBP(bp);

  // Track daily commission progress
  if (dailySystem) {
    dailySystem.trackProgress('boops', 1);
    dailySystem.trackProgress('bpEarned', bp);
    if (isCrit) {
      dailySystem.trackProgress('criticalBoops', 1);
    }
  }

  // Increase waifu bond through booping
  if (waifuSystem) {
    const activeWaifu = waifuSystem.getActiveWaifu();
    if (activeWaifu) {
      let bondGain = 0;

      // Critical boops always give bond
      if (isCrit) {
        bondGain = 0.5;
      }
      // High combo bonus (50+)
      else if (gameState.currentCombo >= 50 && Math.random() < 0.1) {
        bondGain = 0.3;
      }
      // Regular boop chance (5%)
      else if (Math.random() < 0.05) {
        bondGain = 0.2;
      }

      if (bondGain > 0) {
        waifuSystem.increaseBond(activeWaifu.id, bondGain);
      }
    }
  }

  // Update active cat's boop count
  if (catSystem) {
    const cats = catSystem.getAllCats();
    if (cats && cats.length > 0) {
      const activeCat = cats[gameState.activeCatIndex % cats.length];
      if (activeCat) activeCat.totalBoops++;
    }
  }

  // Visual feedback
  showFloatingText(bp, isCrit);
  animateBoopButton();
  updateComboDisplay();

  // Enhanced visual effects for crits
  if (isCrit) {
    triggerScreenShake();
    triggerCritFlash();
  }

  // Animate cat on boop
  const activeCatEl = document.querySelector('.active-cat');
  if (activeCatEl) {
    activeCatEl.classList.add('booped');
    setTimeout(() => activeCatEl.classList.remove('booped'), 300);
  }

  // Waifu reaction
  if (isCrit && Math.random() < 0.3) {
    showWaifuReaction('onCritical');
  }

  updateResourceDisplay();

  // Flash resource display on gain
  const bpResource = elements.bpDisplay?.closest('.resource');
  if (bpResource) {
    bpResource.classList.add('gained');
    setTimeout(() => bpResource.classList.remove('gained'), 400);
  }
}

function showFloatingText(amountOrMessage, isCrit) {
  if (!elements.boopButton || !elements.floatingTextContainer) return;

  const text = document.createElement('div');
  text.className = 'floating-text' + (isCrit ? ' critical' : '');

  if (isCrit && typeof amountOrMessage === 'number') {
    // Critical hit with BP amount
    const critMessages = ['CRITICAL!', 'QI BURST!', 'PERFECT BOOP!', 'HEAVEN-SHAKING!'];
    text.textContent = critMessages[Math.floor(Math.random() * critMessages.length)];
  } else if (typeof amountOrMessage === 'string') {
    // Text message (e.g., "New: Cat Name!")
    text.textContent = amountOrMessage;
  } else {
    // Regular BP amount
    text.textContent = `+${formatNumber(amountOrMessage)} BP`;
  }

  const rect = elements.boopButton.getBoundingClientRect();
  const containerRect = elements.floatingTextContainer.getBoundingClientRect();

  text.style.left = (rect.left - containerRect.left + rect.width / 2 + (Math.random() - 0.5) * 100) + 'px';
  text.style.top = (rect.top - containerRect.top + (Math.random() - 0.5) * 50) + 'px';

  elements.floatingTextContainer.appendChild(text);
  setTimeout(() => text.remove(), isCrit ? 1500 : 1200);
}

function animateBoopButton() {
  if (!elements.boopButton) return;
  elements.boopButton.style.transform = 'translateY(4px) scale(0.95)';
  setTimeout(() => {
    if (elements.boopButton) elements.boopButton.style.transform = '';
  }, 100);
}

function updateComboDisplay() {
  if (!elements.comboDisplay || !elements.comboCount) return;

  if (gameState.comboCount > 5) {
    elements.comboDisplay.classList.remove('hidden');
    elements.comboCount.textContent = gameState.comboCount;

    // Add high-combo class for special effects at 50+ combo
    if (gameState.comboCount >= 50) {
      elements.comboDisplay.classList.add('high-combo');
    } else {
      elements.comboDisplay.classList.remove('high-combo');
    }
  }
}

/**
 * Trigger screen shake effect for critical hits
 */
function triggerScreenShake() {
  const gameContainer = document.getElementById('game-container');
  if (gameContainer) {
    gameContainer.classList.add('screen-shake');
    setTimeout(() => gameContainer.classList.remove('screen-shake'), 300);
  }
}

/**
 * Trigger critical hit flash effect
 */
function triggerCritFlash() {
  const gameMain = document.querySelector('.game-main');
  if (gameMain) {
    gameMain.classList.add('crit-flash');
    setTimeout(() => gameMain.classList.remove('crit-flash'), 400);
  }
}

// Make visual effect functions globally available
window.triggerScreenShake = triggerScreenShake;
window.triggerCritFlash = triggerCritFlash;

// ===================================
// CATS
// ===================================

function recruitCat() {
  if (!catSystem) return;

  // Check cat capacity from upgrades
  const catCapacity = gameState.modifiers.catCapacity || 10;
  const currentCats = catSystem.getCatCount();
  if (currentCats >= catCapacity) {
    if (audioSystem) audioSystem.playSFX('error');
    showFloatingText(`Sect full! (${currentCats}/${catCapacity} cats)`);
    return;
  }

  const cost = catSystem.getRecruitmentCost();
  if (gameState.boopPoints < cost) {
    if (audioSystem) audioSystem.playSFX('error');
    return;
  }

  gameState.boopPoints -= cost;
  const newCat = catSystem.recruitCat();

  if (newCat) {
    // Play sound based on rarity
    if (audioSystem) {
      if (newCat.realm === 'divine' || newCat.realm === 'heaven') {
        audioSystem.playSFX('achievement');
      } else {
        audioSystem.playSFX('cat_recruit');
      }
    }

    // Show notification
    showFloatingText(`New: ${newCat.name}!`, newCat.realm !== 'mortal');
    renderCatCollection();
    updateResourceDisplay();

    // Check for waifu unlocks
    checkWaifuUnlocks();
  }
}

function renderCatCollection() {
  if (!catSystem || !elements.catCollection) return;

  const cats = catSystem.getAllCats();

  if (!cats || cats.length === 0) {
    elements.catCollection.innerHTML = '<p class="empty-message">No cats yet. Recruit your first disciple!</p>';
  } else {
    // Group cats by template ID for stacking
    const catStacks = {};
    cats.forEach((cat, index) => {
      const key = cat.templateId;
      if (!catStacks[key]) {
        catStacks[key] = {
          template: cat,
          count: 0,
          totalPP: 0,
          indices: []
        };
      }
      catStacks[key].count++;
      catStacks[key].indices.push(index);
      // Calculate this cat's PP contribution
      const catPP = cat.stats.innerPurr * cat.stats.loafMastery * (REALMS[cat.realm]?.ppMultiplier || 1);
      catStacks[key].totalPP += catPP;
    });

    // Sort stacks by realm (highest first), then by count
    const realmOrder = ['divine', 'heaven', 'sky', 'earth', 'mortal'];
    const sortedStacks = Object.values(catStacks).sort((a, b) => {
      const realmDiff = realmOrder.indexOf(a.template.realm) - realmOrder.indexOf(b.template.realm);
      if (realmDiff !== 0) return realmDiff;
      return b.count - a.count;
    });

    // Render stacked cat cards
    elements.catCollection.innerHTML = `
      <div class="cat-stacks-grid">
        ${sortedStacks.map(stack => {
          const cat = stack.template;
          const isActive = stack.indices.includes(gameState.activeCatIndex);
          const realmClass = `realm-${cat.realm}`;
          const legendaryClass = cat.legendary ? 'legendary' : '';

          return `
            <div class="cat-stack ${realmClass} ${legendaryClass} ${isActive ? 'selected' : ''}"
                 data-template="${cat.templateId}"
                 data-indices="${stack.indices.join(',')}"
                 style="--realm-color: ${REALMS[cat.realm]?.color || '#888'}"
                 onclick="selectCatStack('${cat.templateId}')">
              ${stack.count > 1 ? `<span class="cat-count">x${stack.count}</span>` : ''}
              <span class="cat-emoji">${cat.emoji}</span>
              <p class="cat-name">${cat.name}</p>
              <p class="cat-realm">${REALMS[cat.realm]?.name || 'Unknown'}</p>
              <p class="cat-pp">+${stack.totalPP.toFixed(1)}/s</p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Update active cat display
  updateActiveCatDisplay();

  // Update recruit cost
  if (elements.recruitCost) {
    elements.recruitCost.textContent = `${formatNumber(catSystem.getRecruitmentCost())} BP`;
  }
  if (elements.recruitBtn) {
    elements.recruitBtn.disabled = gameState.boopPoints < catSystem.getRecruitmentCost();
  }
}

function selectCatStack(templateId) {
  // Find the first cat index with this template
  const cats = catSystem.getAllCats();
  const index = cats.findIndex(c => c.templateId === templateId);
  if (index !== -1) {
    gameState.activeCatIndex = index;
    renderCatCollection();
  }
}

function selectCat(index) {
  gameState.activeCatIndex = index;
  renderCatCollection();
}

function updateActiveCatDisplay() {
  const cats = catSystem.getAllCats();

  if (cats.length === 0) {
    elements.activeCat.textContent = '🐱';
    elements.activeCatName.textContent = 'Recruit a cat!';
  } else {
    const cat = cats[gameState.activeCatIndex % cats.length];
    elements.activeCat.textContent = cat.emoji;
    elements.activeCatName.textContent = cat.name;
  }
}

// Make selectCat and selectCatStack global for onclick
window.selectCat = selectCat;
window.selectCatStack = selectCatStack;

// ===================================
// WAIFUS
// ===================================

function updateWaifuUI() {
  if (!waifuSystem) return;
  const waifu = waifuSystem.getActiveWaifu();
  if (!waifu) return;

  const template = waifuSystem.getTemplate(waifu.id);
  if (!template) return;

  if (elements.waifuEmoji) elements.waifuEmoji.textContent = template.emoji;
  if (elements.waifuPortrait) {
    elements.waifuPortrait.textContent = template.emoji;
    elements.waifuPortrait.style.borderColor = template.color;
  }
  if (elements.waifuName) elements.waifuName.textContent = template.name;
  if (elements.waifuTitle) elements.waifuTitle.textContent = template.title;
  if (elements.bondFill) elements.bondFill.style.width = `${waifu.bondLevel}%`;
  if (elements.bondLevel) elements.bondLevel.textContent = Math.floor(waifu.bondLevel);
  if (elements.waifuBonusText) elements.waifuBonusText.textContent = template.bonus?.description || '';

  updateWaifuDialogue();
}

function updateWaifuDialogue() {
  if (!waifuSystem) return;
  const waifu = waifuSystem.getActiveWaifu();
  if (!waifu) return;

  const dialogue = waifuSystem.getDialogue(waifu.id, 'bond');
  if (elements.waifuDialogue) elements.waifuDialogue.textContent = `"${dialogue}"`;
}

// Lightweight function to update just the bond display (called frequently)
function updateWaifuBondDisplay() {
  if (!waifuSystem) return;
  const waifu = waifuSystem.getActiveWaifu();
  if (!waifu) return;

  const bondLevel = Math.floor(waifu.bondLevel);
  if (elements.bondFill) elements.bondFill.style.width = `${waifu.bondLevel}%`;
  if (elements.bondLevel) elements.bondLevel.textContent = bondLevel;
}

function showWaifuReaction(type) {
  if (!waifuSystem) return;
  const waifu = waifuSystem.getActiveWaifu();
  if (!waifu) return;

  const dialogue = waifuSystem.getDialogue(waifu.id, type);
  elements.waifuDialogue.textContent = `"${dialogue}"`;
}

function checkWaifuUnlocks() {
  const checkState = {
    catCount: catSystem.getCatCount(),
    totalAfkTime: gameState.totalAfkTime,
    allBasicUpgradesPurchased: upgradeSystem.areAllBasicUpgradesPurchased()
  };

  const newUnlocks = waifuSystem.checkUnlockConditions(checkState);

  if (newUnlocks.length > 0) {
    // Show notification for new waifu
    newUnlocks.forEach(waifu => {
      showFloatingText(`${waifu.name} joined!`, true);
    });
    updateWaifuUI();
  }
}

// ===================================
// WAIFU MODAL SYSTEM
// ===================================

let selectedWaifuForDetail = null;
let currentWaifuTab = 'collection';

function setupWaifuModal() {
  // Make waifu panel clickable
  const waifuPanel = document.querySelector('.waifu-panel');
  if (waifuPanel) {
    waifuPanel.addEventListener('click', openWaifuModal);
  }

  // Close button
  const closeBtn = document.getElementById('waifu-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeWaifuModal);
  }

  // Modal backdrop click
  const modal = document.getElementById('waifu-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeWaifuModal();
    });
  }

  // Tab switching
  document.querySelectorAll('.waifu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchWaifuTab(tab.dataset.waifuTab);
    });
  });

  // Set active waifu button
  const setActiveBtn = document.getElementById('set-active-waifu-btn');
  if (setActiveBtn) {
    setActiveBtn.addEventListener('click', setSelectedWaifuAsActive);
  }

  // Give gift button
  const giveGiftBtn = document.getElementById('give-gift-btn');
  if (giveGiftBtn) {
    giveGiftBtn.addEventListener('click', () => switchWaifuTab('inventory'));
  }
}

function openWaifuModal() {
  const modal = document.getElementById('waifu-modal');
  if (modal) {
    modal.classList.remove('hidden');
    renderWaifuModal();
  }
}

function closeWaifuModal() {
  const modal = document.getElementById('waifu-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
  selectedWaifuForDetail = null;
  hideWaifuDetail();
}

function switchWaifuTab(tabName) {
  currentWaifuTab = tabName;

  // Update tab buttons
  document.querySelectorAll('.waifu-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.waifuTab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.waifu-tab-content').forEach(content => {
    content.classList.remove('active');
  });
  const activeContent = document.getElementById(`waifu-${tabName}-tab`);
  if (activeContent) {
    activeContent.classList.add('active');
  }

  // Render content
  if (tabName === 'collection') renderWaifuGrid();
  else if (tabName === 'gifts') renderGiftShop();
  else if (tabName === 'inventory') renderGiftInventory();
}

function renderWaifuModal() {
  switchWaifuTab(currentWaifuTab);
}

function renderWaifuGrid() {
  const container = document.getElementById('waifu-grid');
  if (!container || !waifuSystem) return;

  const activeWaifu = waifuSystem.getActiveWaifu();
  let html = '';

  // Render all waifu templates
  for (const [id, template] of Object.entries(WAIFU_TEMPLATES)) {
    const unlockedWaifu = waifuSystem.getWaifu(id);
    const isUnlocked = !!unlockedWaifu;
    const isActive = activeWaifu && activeWaifu.id === id;
    const bondLevel = unlockedWaifu ? Math.floor(unlockedWaifu.bondLevel) : 0;

    html += `
      <div class="waifu-card ${isUnlocked ? '' : 'locked'} ${isActive ? 'active' : ''}"
           style="--waifu-color: ${template.color}"
           onclick="${isUnlocked ? `selectWaifuForDetail('${id}')` : ''}"
           data-waifu="${id}">
        <div class="waifu-card-portrait">${template.emoji}</div>
        <div class="waifu-card-name">${isUnlocked ? template.name : '???'}</div>
        <div class="waifu-card-title">${isUnlocked ? template.title : 'Locked'}</div>
        ${isUnlocked ? `
          <div class="bond-bar">
            <div class="bond-fill" style="width: ${bondLevel}%"></div>
          </div>
          <div style="font-size: 6px; color: #aaa;">Bond: ${bondLevel}/100</div>
        ` : `
          <div class="waifu-card-unlock">${getWaifuUnlockHint(template)}</div>
        `}
        ${isActive ? '<div style="font-size: 6px; color: var(--gold-accent); margin-top: 5px;">ACTIVE</div>' : ''}
      </div>
    `;
  }

  container.innerHTML = html;
}

function getWaifuUnlockHint(template) {
  const cond = template.unlockCondition;
  switch (cond.type) {
    case 'starter': return 'Starting waifu';
    case 'catCount': return `Recruit ${cond.value} cats`;
    case 'afkTime': return `${Math.floor(cond.value / 3600)} hours AFK time`;
    case 'allBasicUpgrades': return 'Buy all basic upgrades';
    case 'maxBondAll': return 'Max bond with all others';
    default: return 'Unknown requirement';
  }
}

function selectWaifuForDetail(waifuId) {
  selectedWaifuForDetail = waifuId;
  showWaifuDetail(waifuId);
}

function showWaifuDetail(waifuId) {
  const waifu = waifuSystem.getWaifu(waifuId);
  const template = WAIFU_TEMPLATES[waifuId];
  if (!waifu || !template) return;

  const detail = document.getElementById('waifu-detail');
  if (detail) detail.classList.remove('hidden');

  const portrait = document.getElementById('waifu-detail-portrait');
  if (portrait) {
    portrait.textContent = template.emoji;
    portrait.style.borderColor = template.color;
  }

  const name = document.getElementById('waifu-detail-name');
  if (name) name.textContent = template.name;

  const title = document.getElementById('waifu-detail-title');
  if (title) {
    title.textContent = template.title;
    title.style.color = template.color;
  }

  const bondFill = document.getElementById('waifu-detail-bond-fill');
  if (bondFill) bondFill.style.width = `${waifu.bondLevel}%`;

  const bondText = document.getElementById('waifu-detail-bond');
  if (bondText) bondText.textContent = Math.floor(waifu.bondLevel);

  const dialogue = document.getElementById('waifu-detail-dialogue');
  if (dialogue) dialogue.textContent = `"${waifuSystem.getDialogue(waifuId, 'bond')}"`;

  const bonus = document.getElementById('waifu-detail-bonus');
  if (bonus) bonus.textContent = template.bonus?.description || '';

  // Update active button state
  const activeWaifu = waifuSystem.getActiveWaifu();
  const setActiveBtn = document.getElementById('set-active-waifu-btn');
  if (setActiveBtn) {
    if (activeWaifu && activeWaifu.id === waifuId) {
      setActiveBtn.textContent = 'Currently Active';
      setActiveBtn.disabled = true;
    } else {
      setActiveBtn.textContent = 'Set as Active';
      setActiveBtn.disabled = false;
    }
  }
}

function hideWaifuDetail() {
  const detail = document.getElementById('waifu-detail');
  if (detail) detail.classList.add('hidden');
}

function setSelectedWaifuAsActive() {
  if (!selectedWaifuForDetail) return;

  // Move selected waifu to first position (makes it active)
  const waifu = waifuSystem.getWaifu(selectedWaifuForDetail);
  if (!waifu) return;

  // Reorder unlocked waifus array
  const idx = waifuSystem.unlockedWaifus.findIndex(w => w.id === selectedWaifuForDetail);
  if (idx > 0) {
    const [selected] = waifuSystem.unlockedWaifus.splice(idx, 1);
    waifuSystem.unlockedWaifus.unshift(selected);
  }

  // Update UI
  updateWaifuUI();
  renderWaifuGrid();
  showWaifuDetail(selectedWaifuForDetail);
  showFloatingText(`${WAIFU_TEMPLATES[selectedWaifuForDetail].name} is now active!`, true);
}

function renderGiftShop() {
  const container = document.getElementById('gift-shop');
  if (!container || !giftSystem) return;

  const gifts = giftSystem.getPurchasableGifts();
  let html = '';

  gifts.forEach(gift => {
    const canAfford = giftSystem.canAfford(gift.id, gameState);
    let costText = '';

    if (gift.cost.bp) costText = `${formatNumber(gift.cost.bp)} BP`;
    else if (gift.cost.pp) costText = `${formatNumber(gift.cost.pp)} PP`;
    else if (gift.cost.jadeCatnip) costText = `${gift.cost.jadeCatnip} Jade`;
    else if (gift.cost.destinyThreads) costText = `${gift.cost.destinyThreads} Thread`;

    html += `
      <div class="gift-item rarity-${gift.rarity} ${canAfford ? '' : 'disabled'}"
           onclick="${canAfford ? `purchaseGift('${gift.id}')` : ''}"
           title="${gift.description}">
        <div class="gift-emoji">${gift.emoji}</div>
        <div class="gift-name">${gift.name}</div>
        <div class="gift-cost">${costText}</div>
      </div>
    `;
  });

  container.innerHTML = html || '<p style="text-align: center; color: #888;">No gifts available</p>';
}

function renderGiftInventory() {
  const container = document.getElementById('gift-inventory');
  if (!container || !giftSystem) return;

  const inventory = giftSystem.inventory;
  let html = '';

  for (const [itemId, count] of Object.entries(inventory)) {
    if (count <= 0) continue;
    const gift = GIFT_ITEMS[itemId];
    if (!gift) continue;

    html += `
      <div class="gift-item rarity-${gift.rarity}"
           onclick="giveGiftToWaifu('${itemId}')"
           title="${gift.description}">
        <div class="gift-emoji">${gift.emoji}</div>
        <div class="gift-name">${gift.name}</div>
        <div class="gift-count">x${count}</div>
      </div>
    `;
  }

  container.innerHTML = html || '<p style="text-align: center; color: #888;">No gifts in inventory. Visit the Gift Shop!</p>';
}

function purchaseGift(giftId) {
  if (!giftSystem) return;

  const success = giftSystem.purchaseGift(giftId, gameState);
  if (success) {
    const gift = GIFT_ITEMS[giftId];
    showFloatingText(`Bought ${gift.name}!`, false);
    if (audioSystem) audioSystem.playSFX('purchase');
    updateResourceDisplay();
    renderGiftShop();
    renderGiftInventory();
  } else {
    showFloatingText("Can't afford!", false);
    if (audioSystem) audioSystem.playSFX('error');
  }
}

function giveGiftToWaifu(giftId) {
  if (!giftSystem || !waifuSystem) return;

  const activeWaifu = waifuSystem.getActiveWaifu();
  if (!activeWaifu) {
    showFloatingText('No active waifu!', false);
    return;
  }

  const result = giftSystem.giveGift(giftId, activeWaifu.id, waifuSystem);
  if (result) {
    const gift = GIFT_ITEMS[giftId];

    // Show reaction
    showFloatingText(`${result.reaction}`, result.affinity === 'loves' || result.affinity === 'likes');

    // Show bond increase
    setTimeout(() => {
      showFloatingText(`+${result.bondIncrease} Bond!`, true);
    }, 500);

    // Update dialogue
    if (elements.waifuDialogue) {
      elements.waifuDialogue.textContent = `"${result.reaction}"`;
    }

    // Update UI
    updateWaifuUI();
    renderGiftInventory();

    // If detail panel is open, update it
    if (selectedWaifuForDetail === activeWaifu.id) {
      showWaifuDetail(activeWaifu.id);
    }

    renderWaifuGrid();
  }
}

// Make functions global
window.selectWaifuForDetail = selectWaifuForDetail;
window.purchaseGift = purchaseGift;
window.giveGiftToWaifu = giveGiftToWaifu;

// ===================================
// UPGRADES
// ===================================

function renderUpgrades() {
  // Snoot Arts
  if (elements.snootArtsList) {
    const snootArts = upgradeSystem.getUpgradesByCategory('snootArts');
    elements.snootArtsList.innerHTML = snootArts.map(u => renderUpgradeCard(u)).join('');
  }

  // Inner Cultivation
  if (elements.innerCultivationList) {
    const innerCult = upgradeSystem.getUpgradesByCategory('innerCultivation');
    elements.innerCultivationList.innerHTML = innerCult.map(u => renderUpgradeCard(u)).join('');
  }

  // Facilities
  if (elements.facilitiesList) {
    const facilities = upgradeSystem.getUpgradesByCategory('sectFacilities');
    elements.facilitiesList.innerHTML = facilities.map(u => renderUpgradeCard(u)).join('');
  }

  // Add click handlers
  document.querySelectorAll('.upgrade-card').forEach(card => {
    card.addEventListener('click', () => {
      const upgradeId = card.dataset.upgrade;
      purchaseUpgrade(upgradeId);
    });
  });
}

function renderUpgradeCard(upgrade) {
  const level = upgradeSystem.getLevel(upgrade.id);
  const cost = upgradeSystem.getCost(upgrade.id);
  const canAfford = gameState.boopPoints >= cost;
  const isMaxed = level >= upgrade.maxLevel;

  // Check requirements separately from cost
  const meetsRequirements = checkUpgradeRequirements(upgrade);
  const canPurchase = meetsRequirements && canAfford && !isMaxed;

  // Determine status class with better logic
  let statusClass = '';
  let requirementText = '';

  if (isMaxed) {
    statusClass = 'maxed';
  } else if (!meetsRequirements) {
    statusClass = 'locked';
    requirementText = getRequirementText(upgrade);
  } else if (canAfford) {
    statusClass = 'affordable';
  }
  // If meets requirements but can't afford, no special class (normal state)

  const effectValue = upgradeSystem.getEffectValue(upgrade.id);
  const effectDisplay = getEffectDisplayText(upgrade, level);

  return `
    <div class="upgrade-card ${statusClass}" data-upgrade="${upgrade.id}">
      <div class="upgrade-header">
        <span class="upgrade-name">${upgrade.emoji} ${upgrade.name}</span>
        <span class="upgrade-level">${level}/${upgrade.maxLevel}</span>
      </div>
      <p class="upgrade-effect">${upgrade.description}</p>
      ${level > 0 ? `<p class="upgrade-current-effect">${effectDisplay}</p>` : ''}
      ${requirementText ? `<p class="upgrade-requirement">${requirementText}</p>` : ''}
      <p class="upgrade-cost ${canAfford ? 'affordable' : ''}">
        ${isMaxed ? 'MAXED' : formatNumber(cost) + ' BP'}
      </p>
    </div>
  `;
}

// Format the current effect for display
function getEffectDisplayText(upgrade, level) {
  if (level === 0) return '';

  const value = upgrade.effect.baseValue + (upgrade.effect.perLevel * level);

  switch (upgrade.effect.type) {
    case 'bpPerBoop':
      return `Current: +${value.toFixed(1)} BP/boop`;
    case 'bpMultiplier':
      return `Current: ${value.toFixed(2)}x BP`;
    case 'ppMultiplier':
      return `Current: ${value.toFixed(2)}x PP`;
    case 'afkMultiplier':
      return `Current: ${value.toFixed(2)}x AFK gains`;
    case 'critChance':
      return `Current: +${(value * 100).toFixed(0)}% crit chance`;
    case 'critMultiplier':
      return `Current: +${value.toFixed(0)}x crit damage`;
    case 'autoBoopRate':
      return `Current: ${value.toFixed(1)} auto-boops/sec`;
    case 'passiveBpPerSecond':
      return `Current: +${value.toFixed(0)} BP/sec`;
    case 'catCapacity':
      return `Current: ${Math.floor(value)} cat slots`;
    case 'happinessDecayReduction':
      return `Current: ${(value * 100).toFixed(0)}% slower decay`;
    case 'happinessGain':
      return `Current: +${value.toFixed(1)} happiness/tick`;
    case 'eventChanceBonus':
      return `Current: +${(value * 100).toFixed(0)}% event chance`;
    case 'megaBoopMultiplier':
      return `Current: +${(value * 100).toFixed(0)}% mega boop power`;
    default:
      return `Current: ${value.toFixed(2)}`;
  }
}

// Check if upgrade requirements are met (without cost check)
function checkUpgradeRequirements(upgrade) {
  if (!upgrade.requires) return true;

  for (const [reqId, reqLevel] of Object.entries(upgrade.requires)) {
    if (upgradeSystem.getLevel(reqId) < reqLevel) {
      return false;
    }
  }
  return true;
}

// Get human-readable requirement text
function getRequirementText(upgrade) {
  if (!upgrade.requires) return '';

  const unmet = [];
  for (const [reqId, reqLevel] of Object.entries(upgrade.requires)) {
    const currentLevel = upgradeSystem.getLevel(reqId);
    if (currentLevel < reqLevel) {
      const reqUpgrade = UPGRADE_TEMPLATES[reqId];
      const name = reqUpgrade ? reqUpgrade.name : reqId;
      unmet.push(`${name} Lv.${reqLevel}`);
    }
  }

  return unmet.length > 0 ? `Requires: ${unmet.join(', ')}` : '';
}

function purchaseUpgrade(upgradeId) {
  if (!upgradeSystem.canPurchase(upgradeId, gameState.boopPoints)) {
    if (audioSystem) audioSystem.playSFX('error');
    return;
  }

  const cost = upgradeSystem.purchase(upgradeId);
  gameState.boopPoints -= cost;

  // Track for daily commissions
  if (dailySystem) dailySystem.trackProgress('upgradesPurchased', 1);

  // Play purchase sound
  if (audioSystem) audioSystem.playSFX('purchase');

  recalculateModifiers();
  renderUpgrades();
  updateResourceDisplay();

  // Check for waifu unlocks (Professor Fluffington)
  checkWaifuUnlocks();
}

// ===================================
// MODIFIERS
// ===================================

function recalculateModifiers() {
  // Get upgrade effects
  const upgradeEffects = upgradeSystem ? upgradeSystem.getCombinedEffects() : {
    bpPerBoop: 0, bpMultiplier: 1, ppMultiplier: 1, afkMultiplier: 1,
    critChance: 0, critMultiplier: 1, autoBoopRate: 0, passiveBpPerSecond: 0,
    catCapacity: 10, happinessDecayReduction: 0
  };

  // Get master effects
  const masterEffects = masterSystem ? masterSystem.getPassiveEffects(gameState) : {};

  // Get waifu effects
  const waifuEffects = waifuSystem ? waifuSystem.getCombinedBonuses() : {
    bpMultiplier: 1, ppMultiplier: 1, afkMultiplier: 1, catHappinessBonus: 0
  };

  // Get technique effects (skills, passives, legendary internals)
  const techniqueEffects = techniqueSystem ? techniqueSystem.getCombinedEffects() : {
    bpMultiplier: 1, ppMultiplier: 1, afkMultiplier: 1, critChance: 0, critDamage: 0
  };

  // Combine all modifiers
  gameState.modifiers = {
    bpPerBoop: (upgradeEffects.bpPerBoop || 0) + (techniqueEffects.bpPerBoop || 0),
    bpMultiplier: (upgradeEffects.bpMultiplier || 1) * (masterEffects.bpMultiplier || 1) * (techniqueEffects.bpMultiplier || 1),
    ppMultiplier: (upgradeEffects.ppMultiplier || 1) * (waifuEffects.ppMultiplier || 1) * (techniqueEffects.ppMultiplier || 1),
    afkMultiplier: (upgradeEffects.afkMultiplier || 1) * (waifuEffects.afkMultiplier || 1) * (masterEffects.afkMultiplier || 1) * (techniqueEffects.afkMultiplier || 1),
    critChance: (upgradeEffects.critChance || 0) + (techniqueEffects.critChance || 0),
    critMultiplier: (upgradeEffects.critMultiplier || 1) + (techniqueEffects.critDamage || 0),
    autoBoopRate: upgradeEffects.autoBoopRate || 0,
    passiveBpPerSecond: upgradeEffects.passiveBpPerSecond || 0,
    catCapacity: upgradeEffects.catCapacity || 10,
    happinessDecayReduction: upgradeEffects.happinessDecayReduction || 0,
    catHappinessMultiplier: (masterEffects.catHappinessMultiplier || 1) + (waifuEffects.catHappinessBonus || 0),
    // Technique-specific modifiers
    damageReduction: techniqueEffects.damageReduction || 0,
    maxHpBonus: techniqueEffects.maxHpBonus || 0,
    dodgeChance: techniqueEffects.dodgeChance || 0,
    attackSpeedBonus: techniqueEffects.attackSpeedBonus || 0
  };

  // Update boop power display
  if (elements.boopPowerDisplay) {
    const totalBoopPower = gameState.boopPower + (gameState.modifiers.bpPerBoop || 0);
    elements.boopPowerDisplay.textContent = `+${formatNumber(totalBoopPower * (gameState.modifiers.bpMultiplier || 1))} BP per boop`;
  }
}

// ===================================
// TECHNIQUES UI
// ===================================

function renderTechniquesPanel() {
  renderLegendaryInternals();
  renderSecretTechniques();
  renderHiddenSkills();
  renderCultivationPassives();
  renderConsumables();
}

function renderLegendaryInternals() {
  const container = document.getElementById('legendary-internals-list');
  if (!container || !window.LEGENDARY_INTERNALS) return;

  const internals = Object.values(window.LEGENDARY_INTERNALS);

  if (internals.length === 0) {
    container.innerHTML = '<p class="empty-message">No legendary internals available.</p>';
    return;
  }

  container.innerHTML = internals.map(internal => {
    const data = techniqueSystem?.legendaryInternals[internal.id];
    const isUnlocked = data?.unlocked;
    const currentStage = data?.stage || 0;
    const canUnlock = techniqueSystem?.canUnlockLegendaryInternal(internal.id, gameState);

    if (!isUnlocked) {
      return `
        <div class="legendary-internal-card locked">
          <div class="legendary-internal-header">
            <span class="legendary-internal-icon">${internal.emoji || '📜'}</span>
            <div class="legendary-internal-info">
              <div class="legendary-internal-name">${internal.name}</div>
              <div class="legendary-internal-category">${internal.category}</div>
            </div>
          </div>
          <div class="legendary-internal-description">${internal.description}</div>
          <div class="unlock-requirements">
            <div class="requirement-label">Requirements</div>
            <div class="requirement-text">${canUnlock?.reason || 'Unknown requirements'}</div>
          </div>
          ${canUnlock?.can ? `
            <button class="unlock-btn" onclick="unlockLegendaryInternal('${internal.id}')">
              ${canUnlock.cost ? `Sacrifice ${formatNumber(canUnlock.cost)} BP to Unlock` : 'Unlock'}
            </button>
          ` : ''}
        </div>
      `;
    }

    const stage = internal.stages[currentStage - 1];
    return `
      <div class="legendary-internal-card">
        <div class="legendary-internal-header">
          <span class="legendary-internal-icon">${internal.emoji || '📜'}</span>
          <div class="legendary-internal-info">
            <div class="legendary-internal-name">${internal.name}</div>
            <div class="legendary-internal-category">${internal.category}</div>
          </div>
          <div class="legendary-internal-stage">
            <div class="stage-label">Stage</div>
            <div class="stage-value">${currentStage}/${internal.stages.length}</div>
          </div>
        </div>
        <div class="legendary-internal-description">${stage?.name || internal.description}</div>
        <div class="legendary-internal-effects">
          ${stage?.effects ? Object.entries(stage.effects).map(([key, val]) =>
            `<div class="internal-effect">${formatEffectName(key)}: ${formatEffectValue(key, val)}</div>`
          ).join('') : ''}
        </div>
        <div class="legendary-internal-abilities">
          ${internal.activeAbility ? `
            <div class="internal-ability">
              <div class="ability-name">${internal.activeAbility.name}</div>
              <div class="ability-desc">Cooldown: ${internal.activeAbility.cooldown / 1000}s</div>
            </div>
          ` : ''}
          ${internal.ultimateAbility ? `
            <div class="internal-ability">
              <div class="ability-name">★ ${internal.ultimateAbility.name}</div>
              <div class="ability-desc">Cooldown: ${internal.ultimateAbility.cooldown / 1000}s</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderSecretTechniques() {
  const container = document.getElementById('secret-techniques-list');
  if (!container || !techniqueSystem) return;

  const techniques = techniqueSystem.getAllLearnedTechniques();

  if (techniques.length === 0) {
    container.innerHTML = '<p class="empty-message">Defeat Pagoda bosses to learn their secret techniques.</p>';
    return;
  }

  container.innerHTML = techniques.map(tech => `
    <div class="technique-card ${tech.tier}">
      <div class="technique-header">
        <span class="technique-emoji">${tech.emoji || '📜'}</span>
        <span class="technique-name">${tech.name}</span>
        <span class="technique-tier ${tech.tier}">${tech.tier}</span>
      </div>
      <div class="technique-description">${tech.description}</div>
      ${tech.effects ? `
        <div class="technique-effects">
          ${Object.entries(tech.effects).map(([key, val]) =>
            `<span class="technique-effect">${formatEffectName(key)}: ${formatEffectValue(key, val)}</span>`
          ).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
}

function renderHiddenSkills() {
  const container = document.getElementById('hidden-skills-list');
  if (!container || !techniqueSystem) return;

  const skills = techniqueSystem.getAllLearnedSkills();

  if (skills.length === 0) {
    container.innerHTML = '<p class="empty-message">Achieve great feats to discover hidden skills.</p>';
    return;
  }

  container.innerHTML = skills.map(skill => `
    <div class="skill-card">
      <div class="skill-header">
        <span class="skill-emoji">${skill.emoji || '🔮'}</span>
        <span class="skill-name">${skill.name}</span>
      </div>
      <div class="skill-description">${skill.description}</div>
      ${skill.effects ? `
        <div class="technique-effects">
          ${Object.entries(skill.effects).map(([key, val]) =>
            `<span class="technique-effect">${formatEffectName(key)}: ${formatEffectValue(key, val)}</span>`
          ).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
}

function renderCultivationPassives() {
  const container = document.getElementById('cultivation-passives-list');
  if (!container || !techniqueSystem) return;

  const passives = techniqueSystem.getAllCultivationPassives();

  if (passives.length === 0) {
    container.innerHTML = '<p class="empty-message">Progress through the game to unlock cultivation passives.</p>';
    return;
  }

  container.innerHTML = passives.map(passive => `
    <div class="passive-card">
      <span class="passive-icon">${passive.emoji || '✨'}</span>
      <div class="passive-info">
        <div class="passive-name">${passive.name}</div>
        <div class="passive-effect">${passive.description}</div>
      </div>
    </div>
  `).join('');
}

function renderConsumables() {
  const container = document.getElementById('consumables-list');
  if (!container || !techniqueSystem || !window.CULTIVATION_CONSUMABLES) return;

  const consumables = techniqueSystem.consumables;
  const items = Object.entries(consumables).filter(([id, count]) => count > 0);

  if (items.length === 0) {
    container.innerHTML = '<p class="empty-message">Collect consumables from the Pagoda.</p>';
    return;
  }

  container.innerHTML = items.map(([id, count]) => {
    const item = window.CULTIVATION_CONSUMABLES[id];
    if (!item) return '';

    return `
      <div class="consumable-card ${item.rarity}">
        <div class="consumable-emoji">${item.emoji}</div>
        <div class="consumable-name">${item.name}</div>
        <div class="consumable-count">x${count}</div>
        <button class="consumable-use-btn" onclick="useConsumable('${id}')">Use</button>
      </div>
    `;
  }).join('');
}

function formatEffectName(key) {
  const names = {
    bpMultiplier: 'BP Mult',
    ppMultiplier: 'PP Mult',
    afkMultiplier: 'AFK Mult',
    critChance: 'Crit Chance',
    critDamage: 'Crit Damage',
    damageReduction: 'Damage Red',
    maxHpBonus: 'Max HP',
    dodgeChance: 'Dodge',
    attackSpeedBonus: 'Atk Speed',
    bpPerBoop: 'BP/Boop',
    ppPerSecond: 'PP/Sec'
  };
  return names[key] || key;
}

function formatEffectValue(key, val) {
  if (key.includes('Multiplier') || key.includes('Mult')) {
    return `x${val.toFixed(2)}`;
  }
  if (key.includes('Chance') || key.includes('Reduction')) {
    return `+${(val * 100).toFixed(0)}%`;
  }
  if (typeof val === 'number') {
    return `+${formatNumber(val)}`;
  }
  return val;
}

function unlockLegendaryInternal(internalId) {
  if (!techniqueSystem) return;

  const result = techniqueSystem.unlockLegendaryInternal(internalId, gameState);
  if (result.success) {
    showFloatingText(`🐉 ${result.internal.name} UNLOCKED!`, true);
    if (audioSystem) audioSystem.playSFX('achievement');
    renderTechniquesPanel();
    recalculateModifiers();
  } else {
    showFloatingText(result.reason || 'Cannot unlock', false);
  }
}

function useConsumable(consumableId) {
  if (!techniqueSystem) return;

  const result = techniqueSystem.useConsumable(consumableId, gameState);
  if (result) {
    showFloatingText(`Used ${result.name}!`, true);
    if (audioSystem) audioSystem.playSFX('powerup');
    renderConsumables();
    recalculateModifiers();
  }
}

// ===================================
// DISPLAY UPDATES
// ===================================

function updateResourceDisplay() {
  if (elements.bpDisplay) elements.bpDisplay.textContent = formatNumber(gameState.boopPoints);
  if (elements.ppDisplay) elements.ppDisplay.textContent = formatNumber(gameState.purrPower);
  if (elements.catCountDisplay && catSystem) elements.catCountDisplay.textContent = catSystem.getCatCount();

  // Update PP rate
  if (elements.ppRate && catSystem) {
    const ppPerSecond = catSystem.calculatePPPerSecond(gameState.modifiers);
    elements.ppRate.textContent = `+${ppPerSecond.toFixed(1)}/s`;
  }

  // Update recruit button
  if (elements.recruitBtn && catSystem) {
    const capacity = gameState.modifiers.catCapacity || 10;
    const currentCats = catSystem.getCatCount();
    const cost = catSystem.getRecruitmentCost();

    // Disable if can't afford OR at capacity
    elements.recruitBtn.disabled = gameState.boopPoints < cost || currentCats >= capacity;
  }

  // Update cat capacity display
  if (elements.catCapacityCurrent && catSystem) {
    const capacity = gameState.modifiers.catCapacity || 10;
    const currentCats = catSystem.getCatCount();
    elements.catCapacityCurrent.textContent = currentCats;
    elements.catCapacityMax.textContent = capacity;

    // Color coding - red if at capacity
    if (currentCats >= capacity) {
      elements.catCapacityCurrent.style.color = '#ff6b6b';
    } else {
      elements.catCapacityCurrent.style.color = 'var(--jade)';
    }
  }
}

function formatNumber(n) {
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qi', 'Dao', 'Xian', 'Tian', 'Shen'];

  if (n < 1000) return Math.floor(n).toString();

  const tier = Math.min(
    Math.floor(Math.log10(Math.abs(n)) / 3),
    suffixes.length - 1
  );

  const suffix = suffixes[tier];
  const scaled = n / Math.pow(10, tier * 3);

  return scaled.toFixed(1) + suffix;
}

// ===================================
// AFK MODAL
// ===================================

function showAfkModal(afkGains) {
  elements.afkTimeAway.textContent = `You were away for ${afkGains.timeAwayFormatted}`;
  elements.afkPpGained.textContent = formatNumber(afkGains.ppGained);
  elements.afkBpGained.textContent = formatNumber(afkGains.bpGained);

  if (afkGains.events && afkGains.events.length > 0) {
    elements.afkEvents.innerHTML = afkGains.events.map(e => `
      <div class="afk-event">${e.emoji} ${e.message}</div>
    `).join('');
  } else {
    elements.afkEvents.innerHTML = '';
  }

  elements.afkModal.classList.remove('hidden');
}

// ===================================
// GOOSE SYSTEM (Basic)
// ===================================

/**
 * Attempt to boop the goose (delegates to GooseSystem)
 */
function attemptGooseBoop() {
  if (!gooseSystem) return;
  const result = gooseSystem.attemptBoop();
  if (result) {
    updateResourceDisplay();
  }
}

/**
 * Global floating text function for goose system
 */
window.showFloatingText = showFloatingText;

// ===================================
// EXPEDITION SYSTEM
// ===================================

let selectedDestination = null;
let selectedCats = new Set();

function renderExpeditions() {
  if (!elements.expeditionDestinations || !expeditionSystem) return;

  const destinations = Object.values(EXPEDITION_DESTINATIONS);

  elements.expeditionDestinations.innerHTML = destinations.map(dest => {
    const isUnlocked = expeditionSystem.isDestinationUnlocked(dest.id, catSystem);
    const isActive = selectedDestination === dest.id;

    return `
      <div class="destination-card ${isUnlocked ? '' : 'locked'} ${isActive ? 'active' : ''}"
           data-destination="${dest.id}">
        <div class="destination-header">
          <span class="destination-emoji">${dest.emoji}</span>
          <span class="destination-name">${dest.name}</span>
          <span class="destination-difficulty">${'⭐'.repeat(dest.difficulty)}</span>
        </div>
        <p class="destination-description">${dest.description}</p>
        <p class="destination-rewards">
          ${dest.rewards.bp.min}-${dest.rewards.bp.max} BP |
          ${dest.rewards.pp.min}-${dest.rewards.pp.max} PP |
          ${Math.floor(dest.duration / 60000)}min
        </p>
      </div>
    `;
  }).join('');

  // Add click handlers for destinations
  elements.expeditionDestinations.querySelectorAll('.destination-card:not(.locked)').forEach(card => {
    card.addEventListener('click', () => {
      selectDestination(card.dataset.destination);
    });
  });
}

function selectDestination(destId) {
  selectedDestination = destId;
  selectedCats.clear();

  // Highlight selected destination
  elements.expeditionDestinations.querySelectorAll('.destination-card').forEach(card => {
    card.classList.toggle('active', card.dataset.destination === destId);
  });

  // Show cat selection
  renderCatSelection();
  elements.expeditionSelection.classList.remove('hidden');
}

function renderCatSelection() {
  if (!elements.catSelectGrid || !expeditionSystem) return;

  const availableCats = expeditionSystem.getAvailableCats(catSystem);
  const destination = EXPEDITION_DESTINATIONS[selectedDestination];

  elements.catSelectGrid.innerHTML = availableCats.map(cat => {
    const power = expeditionSystem.calculateCatPower(cat);
    // Use instanceId for unique identification, convert to string for consistent comparison
    const catId = String(cat.instanceId || cat.id);
    const isSelected = selectedCats.has(catId);
    const realmEmoji = { mortal: '⚪', earth: '🟤', sky: '🔵', heaven: '🟡', divine: '⚪✨' }[cat.realm] || '⚪';

    return `
      <div class="cat-select-item ${isSelected ? 'selected' : ''}" data-cat-id="${catId}">
        <span class="cat-emoji">${cat.emoji}</span>
        <span class="cat-power">${realmEmoji} ${power}</span>
      </div>
    `;
  }).join('');

  if (availableCats.length === 0) {
    elements.catSelectGrid.innerHTML = '<p style="font-size: 8px; color: #888; grid-column: 1/-1;">No cats available</p>';
  }

  // Add click handlers
  elements.catSelectGrid.querySelectorAll('.cat-select-item').forEach(item => {
    item.addEventListener('click', () => {
      toggleCatSelection(item.dataset.catId);
    });
  });

  updateExpeditionButton();
}

function toggleCatSelection(catId) {
  if (selectedCats.has(catId)) {
    selectedCats.delete(catId);
  } else {
    const destination = EXPEDITION_DESTINATIONS[selectedDestination];
    if (selectedCats.size < destination.maxCats) {
      selectedCats.add(catId);
    }
  }

  // Update visual state
  elements.catSelectGrid.querySelectorAll('.cat-select-item').forEach(item => {
    item.classList.toggle('selected', selectedCats.has(item.dataset.catId));
  });

  updateExpeditionButton();
}

function updateExpeditionButton() {
  if (!elements.startExpeditionBtn) return;

  const destination = EXPEDITION_DESTINATIONS[selectedDestination];
  if (!destination) {
    elements.startExpeditionBtn.disabled = true;
    elements.startExpeditionBtn.textContent = 'Select a destination';
    return;
  }

  const canStart = selectedCats.size >= destination.minCats && selectedCats.size <= destination.maxCats;

  elements.startExpeditionBtn.disabled = !canStart;
  elements.startExpeditionBtn.textContent = canStart
    ? `Start Expedition (${selectedCats.size}/${destination.maxCats} cats)`
    : `Select ${destination.minCats}-${destination.maxCats} cats`;
}

function startSelectedExpedition() {
  console.log('startSelectedExpedition called');
  console.log('  selectedDestination:', selectedDestination);
  console.log('  selectedCats:', Array.from(selectedCats));
  console.log('  expeditionSystem:', !!expeditionSystem);

  if (!selectedDestination || selectedCats.size === 0 || !expeditionSystem) {
    console.log('Early return - missing requirements');
    showFloatingText('Select a destination and cats first!', false);
    return;
  }

  const catIds = Array.from(selectedCats);
  console.log('Starting expedition with cats:', catIds);

  const result = expeditionSystem.startExpedition(
    selectedDestination,
    catIds,
    catSystem
  );

  console.log('Expedition result:', result);

  if (result.success) {
    selectedDestination = null;
    selectedCats.clear();
    elements.expeditionSelection.classList.add('hidden');
    renderExpeditions();
    updateExpeditionsUI();
    renderCatCollection();
    showFloatingText('Expedition started!', false);
  } else {
    console.log('Expedition failed:', result.reason);
    showFloatingText(result.reason || 'Expedition failed!', false);
  }
}

function updateExpeditionsUI() {
  if (!elements.activeExpeditionsList || !expeditionSystem) return;

  const activeExps = expeditionSystem.activeExpeditions;

  if (activeExps.length === 0) {
    elements.activeExpeditionsList.innerHTML = '<p style="font-size: 8px; color: #666;">No active expeditions</p>';
    return;
  }

  elements.activeExpeditionsList.innerHTML = activeExps.map(exp => {
    const timeRemaining = expeditionSystem.getTimeRemaining(exp.id);
    const progress = ((exp.destination.duration - timeRemaining) / exp.destination.duration) * 100;

    return `
      <div class="expedition-item">
        <div class="expedition-item-header">
          <span class="expedition-item-name">${exp.destination.emoji} ${exp.destination.name}</span>
          <span class="expedition-item-time">${expeditionSystem.formatTime(timeRemaining)}</span>
        </div>
        <div class="expedition-progress-bar">
          <div class="expedition-progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="expedition-cats">${exp.catDetails.map(c => c.name).join(', ')}</div>
      </div>
    `;
  }).join('');
}

// Expedition functions - make global for onclick handlers
window.startSelectedExpedition = startSelectedExpedition;
window.selectDestination = selectDestination;
window.toggleCatSelection = toggleCatSelection;
window.renderExpeditions = renderExpeditions;

// ===================================
// PRESTIGE SYSTEM
// ===================================

function renderPrestige() {
  if (!elements.prestigeTierName || !prestigeSystem) return;

  const currentTier = prestigeSystem.getCurrentTier();
  const nextTier = prestigeSystem.getNextTier();
  const multiplier = prestigeSystem.getTotalMultiplier();
  const progress = prestigeSystem.getProgress();

  // Update tier display
  elements.prestigeTierName.textContent = currentTier ? currentTier.name : 'Mortal';
  elements.prestigeMultiplier.textContent = multiplier.toFixed(1) + 'x';

  // Update progress bar
  elements.prestigeProgressFill.style.width = progress + '%';
  elements.prestigeCurrent.textContent = formatNumber(prestigeSystem.lifetimeBP) + ' BP';
  elements.prestigeRequirement.textContent = nextTier ? formatNumber(nextTier.requirement) + ' BP' : 'MAX';

  // Update rebirth button
  const canRebirth = prestigeSystem.canRebirth(gameState);
  elements.rebirthBtn.disabled = !canRebirth.can;
  elements.rebirthBtn.textContent = nextTier
    ? `🔄 Ascend to ${nextTier.name}`
    : '✨ Maximum Realm Reached';

  // Update perks list
  renderPrestigePerks();
}

function renderPrestigePerks() {
  if (!elements.prestigePerksList) return;

  const unlockedPerks = Array.from(prestigeSystem.unlockedPerks);

  if (unlockedPerks.length === 0) {
    elements.prestigePerksList.innerHTML = '<p style="font-size: 8px; color: #666;">Ascend to unlock perks!</p>';
    return;
  }

  elements.prestigePerksList.innerHTML = unlockedPerks.map(perkId => {
    const perk = REBIRTH_PERKS[perkId];
    if (!perk) return '';

    return `
      <div class="perk-item">
        <span class="perk-icon">✓</span>
        <div>
          <span class="perk-name">${perk.name}</span>
          <span class="perk-desc">${perk.description}</span>
        </div>
      </div>
    `;
  }).join('');
}

function handleRebirth() {
  if (!prestigeSystem) return;
  const canRebirth = prestigeSystem.canRebirth(gameState);
  if (!canRebirth.can) return;

  // Confirm rebirth
  const nextTier = prestigeSystem.getNextTier();
  if (!confirm(`Ascend to ${nextTier.name}?\n\nThis will reset your progress but grant permanent bonuses.`)) {
    return;
  }

  const result = prestigeSystem.rebirth(
    gameState,
    masterSystem,
    catSystem,
    waifuSystem,
    upgradeSystem
  );

  if (result.success) {
    // Update all displays
    updateResourceDisplay();
    renderCatCollection();
    renderUpgrades();
    renderPrestige();
    updateWaifuUI();
    recalculateModifiers();

    // Play sound
    if (audioSystem) audioSystem.playSFX('achievement');

    // Show notification
    showFloatingText(`Ascended to ${result.tierInfo.name}!`, true);
  }
}

// Make updateResourceDisplay available globally
window.updateResourceDisplay = updateResourceDisplay;

// ===================================
// PAGODA SYSTEM UI
// ===================================

function renderPagoda() {
  if (!pagodaSystem) return;

  const highestFloor = document.getElementById('pagoda-highest-floor');
  const tokens = document.getElementById('pagoda-tokens');
  const startBtn = document.getElementById('start-pagoda-btn');
  const combatDiv = document.getElementById('pagoda-combat');

  if (highestFloor) {
    highestFloor.textContent = pagodaSystem.highestFloor;
  }
  if (tokens) {
    tokens.textContent = pagodaSystem.tokens;
  }

  if (pagodaSystem.inRun) {
    if (startBtn) startBtn.classList.add('hidden');
    if (combatDiv) combatDiv.classList.remove('hidden');
    updatePagodaCombat();
  } else {
    if (startBtn) startBtn.classList.remove('hidden');
    if (combatDiv) combatDiv.classList.add('hidden');
  }
}

function updatePagodaCombat() {
  if (!pagodaSystem) return;

  const enemyEmoji = document.getElementById('enemy-emoji');
  const enemyName = document.getElementById('enemy-name');
  const enemyHpFill = document.getElementById('enemy-hp-fill');
  const playerHpFill = document.getElementById('player-hp-fill');
  const playerHpText = document.getElementById('player-hp-text');
  const combatLog = document.getElementById('combat-log');

  if (pagodaSystem.currentEnemy) {
    if (enemyEmoji) enemyEmoji.textContent = pagodaSystem.currentEnemy.emoji;
    if (enemyName) enemyName.textContent = `Floor ${pagodaSystem.currentFloor}: ${pagodaSystem.currentEnemy.name}`;
    if (enemyHpFill) {
      const enemyHpPercent = (pagodaSystem.enemyHp / pagodaSystem.enemyMaxHp) * 100;
      enemyHpFill.style.width = enemyHpPercent + '%';
    }
  }

  if (playerHpFill) {
    const playerHpPercent = (pagodaSystem.playerHp / pagodaSystem.playerMaxHp) * 100;
    playerHpFill.style.width = playerHpPercent + '%';
  }
  if (playerHpText) {
    playerHpText.textContent = `${Math.floor(pagodaSystem.playerHp)}/${pagodaSystem.playerMaxHp}`;
  }

  if (combatLog) {
    combatLog.innerHTML = pagodaSystem.combatLog.slice(-10).map(log =>
      `<div>${log.message}</div>`
    ).join('');
    combatLog.scrollTop = combatLog.scrollHeight;
  }

  // Update command button states
  document.querySelectorAll('.cmd-btn').forEach(btn => {
    const cmdId = btn.dataset.cmd;
    const cooldown = pagodaSystem.getCooldownRemaining(cmdId);
    btn.disabled = cooldown > 0 || pagodaSystem.combatState !== 'selecting';
    if (cooldown > 0) {
      btn.textContent = `${Math.ceil(cooldown / 1000)}s`;
    }
  });
}

function startPagodaRun() {
  if (!pagodaSystem || !catSystem) return;

  const cats = catSystem.getAllCats();
  const catIds = cats.slice(0, 3).map(c => c.id); // Use first 3 cats

  if (pagodaSystem.startRun(catIds)) {
    renderPagoda();
  }
}

function executePagodaCommand(cmdId) {
  if (!pagodaSystem) return;
  if (pagodaSystem.executeCommand(cmdId)) {
    updatePagodaCombat();

    // Check for run end
    if (!pagodaSystem.inRun) {
      setTimeout(() => {
        const rewards = pagodaSystem.runRewards;
        gameState.boopPoints += rewards.bp;

        // Build loot summary
        let summary = `Floor ${pagodaSystem.currentFloor} reached!\n\n`;
        summary += `💰 BP Gained: ${formatNumber(rewards.bp)}\n`;
        summary += `🎟️ Tokens: ${rewards.tokens}\n`;

        if (rewards.materials && rewards.materials.length > 0) {
          summary += `📦 Materials: ${rewards.materials.length}\n`;
        }

        if (rewards.equipment && rewards.equipment.length > 0) {
          summary += `🗡️ Equipment:\n`;
          rewards.equipment.forEach(eq => {
            summary += `  - ${eq.name} (${eq.rarity})\n`;
          });
        }

        alert(summary);
        renderPagoda();
        updateResourceDisplay();
      }, 500);
    }
  }
}

// ===================================
// EQUIPMENT SYSTEM UI
// ===================================

function renderEquipment() {
  renderEquipmentStats();
  renderEquipmentSlots();
  renderEquipmentInventory();
}

function renderEquipmentStats() {
  if (!equipmentSystem) return;

  const statsEl = document.getElementById('equipment-stats-summary');
  if (!statsEl) return;

  const activeCatId = getActiveCatId();
  const totalStats = equipmentSystem.getCombinedStats ? equipmentSystem.getCombinedStats(activeCatId) : {};

  const statNames = {
    attack: '⚔️ Attack',
    hp: '❤️ HP',
    defense: '🛡️ Defense',
    critChance: '💥 Crit%',
    critDamage: '💢 Crit DMG',
    dodge: '💨 Dodge',
    attackSpeed: '⚡ Atk Speed',
    wisdom: '🧠 Wisdom',
    bpMultiplier: '💰 BP Mult',
    ppMultiplier: '😺 PP Mult'
  };

  const statEntries = Object.entries(totalStats).filter(([k, v]) => v !== 0 && statNames[k]);

  if (statEntries.length === 0) {
    statsEl.innerHTML = '<p class="empty-message">Equip items to see stats</p>';
    return;
  }

  statsEl.innerHTML = statEntries.map(([key, value]) => {
    const displayValue = key.includes('Chance') || key.includes('Multiplier') || key === 'dodge'
      ? `+${(value * 100).toFixed(0)}%`
      : `+${Math.floor(value)}`;
    return `<span class="stat-chip">${statNames[key] || key}: ${displayValue}</span>`;
  }).join('');
}

function renderEquipmentSlots() {
  if (!equipmentSystem) return;

  const slots = ['hat', 'collar', 'weapon', 'armor', 'paws', 'tail'];
  const activeCatId = getActiveCatId();

  slots.forEach(slot => {
    const slotEl = document.getElementById(`equip-${slot}`);
    if (!slotEl) return;

    const equipped = equipmentSystem.equipped[activeCatId];
    const equipId = equipped ? equipped[slot] : null;
    const equipment = equipId ? equipmentSystem.getEquipment(equipId) : null;

    if (equipment) {
      const rarity = EQUIPMENT_RARITIES[equipment.rarity];
      const statsText = formatEquipmentStats(equipment.stats);
      slotEl.innerHTML = `
        <div class="equipped-item">
          <span class="equip-name" style="color: ${rarity.color}">${equipment.name}</span>
          <span class="equip-stats">${statsText}</span>
        </div>
      `;
    } else {
      slotEl.innerHTML = '<span class="equip-empty">Empty</span>';
    }
  });
}

function renderEquipmentInventory() {
  if (!equipmentSystem) return;

  const inventoryEl = document.getElementById('equipment-inventory');
  const countEl = document.getElementById('inventory-count');
  if (!inventoryEl) return;

  const inventory = equipmentSystem.inventory;
  if (countEl) countEl.textContent = inventory.length;

  if (inventory.length === 0) {
    inventoryEl.innerHTML = '<p class="empty-message">No equipment yet! Run the Pagoda to find loot.</p>';
    return;
  }

  inventoryEl.innerHTML = inventory.map(eq => {
    const rarity = EQUIPMENT_RARITIES[eq.rarity];
    const statsText = formatEquipmentStats(eq.stats);
    return `
      <div class="inventory-item ${eq.rarity}" data-equip-id="${eq.id}">
        <div class="inv-item-header">
          <span class="inv-item-icon">${EQUIPMENT_SLOTS[eq.slot]?.emoji || '📦'}</span>
          <span class="inv-item-name" style="color: ${rarity.color}">${eq.name}</span>
        </div>
        <div class="inv-item-stats">${statsText}</div>
        <button class="equip-btn" data-equip-id="${eq.id}">Equip</button>
      </div>
    `;
  }).join('');

  // Add click handlers
  inventoryEl.querySelectorAll('.equip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const equipId = btn.dataset.equipId;
      equipItemToActiveCat(equipId);
    });
  });
}

function formatEquipmentStats(stats) {
  if (!stats || Object.keys(stats).length === 0) return 'No stats';

  const shortNames = {
    attack: 'ATK',
    hp: 'HP',
    defense: 'DEF',
    critChance: 'CRIT%',
    critDamage: 'CDMG',
    dodge: 'DODGE',
    attackSpeed: 'SPD',
    wisdom: 'WIS',
    bpMultiplier: 'BP%',
    ppMultiplier: 'PP%',
    boopDamage: 'BOOP',
    fireDamage: 'FIRE',
    allStats: 'ALL%',
    regenPerSecond: 'REGEN'
  };

  return Object.entries(stats).map(([key, value]) => {
    const name = shortNames[key] || key;
    const displayValue = key.includes('Chance') || key.includes('Multiplier') || key === 'dodge' || key.includes('Damage') || key === 'allStats' || key === 'regenPerSecond'
      ? `${(value * 100).toFixed(0)}%`
      : Math.floor(value);
    return `${name}:${displayValue}`;
  }).join(' ');
}

function getActiveCatId() {
  const cats = catSystem.getAllCats();
  if (cats.length === 0) return 'default';
  return cats[gameState.activeCatIndex % cats.length].id;
}

function equipItemToActiveCat(equipId) {
  if (!equipmentSystem) return;
  const catId = getActiveCatId();
  if (equipmentSystem.equip(catId, equipId)) {
    renderEquipment();
  }
}

// ===================================
// FORGE UI (Equipment Upgrade & Enchant)
// ===================================

let selectedForgeItem = null;

function renderForgeTab() {
  if (!equipmentSystem || !craftingSystem) return;

  const itemSelect = document.getElementById('forge-item-select');
  const materialsDisplay = document.getElementById('materials-display');

  if (!itemSelect) return;

  // Populate item dropdown with all equipment (inventory + equipped)
  const inventory = equipmentSystem.inventory || [];
  const equippedItems = [];

  // Gather equipped items
  if (equipmentSystem.equipped) {
    for (const catId in equipmentSystem.equipped) {
      const catEquipped = equipmentSystem.equipped[catId];
      for (const slot in catEquipped) {
        const eqId = catEquipped[slot];
        if (eqId) {
          const eq = equipmentSystem.getEquipment(eqId);
          if (eq) equippedItems.push({ ...eq, isEquipped: true, equippedTo: catId });
        }
      }
    }
  }

  const allItems = [...inventory.map(i => ({ ...i, isEquipped: false })), ...equippedItems];

  itemSelect.innerHTML = '<option value="">-- Select Item --</option>' +
    allItems.map(eq => {
      const rarity = window.EQUIPMENT_RARITIES?.[eq.rarity] || { color: '#fff' };
      const level = eq.upgradeLevel || 0;
      const equipped = eq.isEquipped ? ' (Equipped)' : '';
      return `<option value="${eq.id}" style="color: ${rarity.color}">${eq.name} +${level}${equipped}</option>`;
    }).join('');

  // Materials display
  if (materialsDisplay) {
    const materials = craftingSystem?.materials || {};
    const materialList = [
      { key: 'upgrade_stone_common', name: 'Common Stone', emoji: '🪨' },
      { key: 'upgrade_stone_rare', name: 'Rare Stone', emoji: '💎' },
      { key: 'upgrade_stone_epic', name: 'Epic Stone', emoji: '⭐' },
      { key: 'upgrade_stone_legendary', name: 'Legendary Stone', emoji: '🌟' },
      { key: 'enchant_scroll_common', name: 'Common Scroll', emoji: '📜' },
      { key: 'enchant_scroll_rare', name: 'Rare Scroll', emoji: '📕' },
      { key: 'enchant_scroll_legendary', name: 'Legendary Scroll', emoji: '📗' },
      { key: 'protection_charm', name: 'Protection Charm', emoji: '🛡️' },
      { key: 'lucky_clover', name: 'Lucky Clover', emoji: '🍀' }
    ];

    materialsDisplay.innerHTML = materialList.map(mat => {
      const count = materials[mat.key] || 0;
      return `<div class="material-item">
        <span class="material-emoji">${mat.emoji}</span>
        <span class="material-name">${mat.name}</span>
        <span class="material-count">${count}</span>
      </div>`;
    }).join('');
  }

  // Update protection/clover counts
  const protectionCount = document.getElementById('protection-count');
  const cloverCount = document.getElementById('clover-count');
  if (protectionCount) protectionCount.textContent = craftingSystem?.materials?.protection_charm || 0;
  if (cloverCount) cloverCount.textContent = craftingSystem?.materials?.lucky_clover || 0;

  // Clear selection
  selectedForgeItem = null;
  updateForgeItemDisplay();
}

function onForgeItemSelect(selectEl) {
  const equipId = selectEl.value;
  if (!equipId || !equipmentSystem) {
    selectedForgeItem = null;
    updateForgeItemDisplay();
    return;
  }

  // Find the equipment
  selectedForgeItem = equipmentSystem.getEquipment(equipId);
  if (!selectedForgeItem) {
    // Try inventory
    selectedForgeItem = equipmentSystem.inventory.find(eq => eq.id === equipId);
  }

  updateForgeItemDisplay();
  updateEnchantDropdown();
}

function updateForgeItemDisplay() {
  const display = document.getElementById('forge-item-display');
  const nameEl = document.getElementById('forge-item-name');
  const levelEl = document.getElementById('forge-item-level');
  const statsEl = document.getElementById('forge-item-stats');
  const enchantsEl = document.getElementById('forge-item-enchants');
  const upgradeCostEl = document.getElementById('upgrade-cost');

  if (!display) return;

  if (!selectedForgeItem) {
    display.classList.add('hidden');
    if (upgradeCostEl) upgradeCostEl.innerHTML = '';
    return;
  }

  display.classList.remove('hidden');

  const rarity = window.EQUIPMENT_RARITIES?.[selectedForgeItem.rarity] || { color: '#fff', name: 'Common' };
  const level = selectedForgeItem.upgradeLevel || 0;

  if (nameEl) {
    nameEl.textContent = selectedForgeItem.name;
    nameEl.style.color = rarity.color;
  }
  if (levelEl) levelEl.textContent = `+${level}`;

  // Stats display
  if (statsEl) {
    const stats = selectedForgeItem.stats || {};
    statsEl.innerHTML = Object.entries(stats).map(([key, val]) => {
      const displayVal = key.includes('Chance') || key.includes('Multiplier')
        ? `${(val * 100).toFixed(0)}%`
        : Math.floor(val);
      return `<div class="stat-line">${key}: ${displayVal}</div>`;
    }).join('');
  }

  // Enchants display
  if (enchantsEl) {
    const enchants = selectedForgeItem.enchantments || [];
    if (enchants.length > 0) {
      enchantsEl.innerHTML = '<div class="enchant-header">Enchantments:</div>' +
        enchants.map((e, i) => {
          const enchDef = window.ENCHANTMENTS?.[e.id] || { name: e.id, tier: 'common' };
          const tierColors = { common: '#aaa', rare: '#5af', legendary: '#fa5' };
          return `<div class="enchant-line" style="color: ${tierColors[enchDef.tier] || '#aaa'}">
            ${enchDef.name} +${e.level || 1}
            <button class="remove-enchant-btn" onclick="removeEnchant(${i})">X</button>
          </div>`;
        }).join('');
    } else {
      enchantsEl.innerHTML = '<div class="no-enchants">No enchantments</div>';
    }
  }

  // Upgrade cost
  if (upgradeCostEl && craftingSystem) {
    const cost = craftingSystem.getUpgradeCost(selectedForgeItem);
    if (cost) {
      const canAfford = checkCanAffordUpgrade(cost);
      upgradeCostEl.innerHTML = `
        <div class="cost-header">Upgrade Cost:</div>
        <div class="cost-list ${canAfford ? 'affordable' : 'expensive'}">
          ${cost.bp ? `<span>💰 ${formatNumber(cost.bp)} BP</span>` : ''}
          ${cost.materials ? Object.entries(cost.materials).map(([mat, count]) => {
            const have = craftingSystem?.materials?.[mat] || 0;
            return `<span class="${have >= count ? 'have' : 'need'}">${mat.replace(/_/g, ' ')}: ${have}/${count}</span>`;
          }).join('') : ''}
        </div>
        <div class="success-rate">Success: ${(cost.successRate * 100).toFixed(0)}%</div>
      `;
    } else {
      upgradeCostEl.innerHTML = '<div class="maxed-out">MAX LEVEL</div>';
    }
  }
}

function checkCanAffordUpgrade(cost) {
  if (!cost) return false;
  if (cost.bp && gameState.boopPoints < cost.bp) return false;
  if (cost.materials) {
    for (const [mat, count] of Object.entries(cost.materials)) {
      if ((craftingSystem?.materials?.[mat] || 0) < count) return false;
    }
  }
  return true;
}

function updateEnchantDropdown() {
  const select = document.getElementById('enchant-select');
  const costEl = document.getElementById('enchant-cost');
  if (!select || !craftingSystem) return;

  if (!selectedForgeItem) {
    select.innerHTML = '<option value="">-- Select Item First --</option>';
    if (costEl) costEl.innerHTML = '';
    return;
  }

  const slot = selectedForgeItem.slot;
  const availableEnchants = craftingSystem.getAvailableEnchantments(slot);

  select.innerHTML = '<option value="">-- Select Enchantment --</option>' +
    availableEnchants.map(ench => {
      const enchDef = window.ENCHANTMENTS?.[ench] || { name: ench, tier: 'common' };
      const tierColors = { common: '#aaa', rare: '#5af', legendary: '#fa5' };
      return `<option value="${ench}" style="color: ${tierColors[enchDef.tier]}">${enchDef.name} (${enchDef.tier})</option>`;
    }).join('');
}

function onEnchantSelect(selectEl) {
  const enchantId = selectEl.value;
  const costEl = document.getElementById('enchant-cost');

  if (!enchantId || !costEl || !craftingSystem) {
    if (costEl) costEl.innerHTML = '';
    return;
  }

  const cost = craftingSystem.getEnchantCost({ id: enchantId, tier: window.ENCHANTMENTS?.[enchantId]?.tier || 'common' });

  costEl.innerHTML = `
    <div class="cost-header">Enchant Cost:</div>
    <div class="cost-list">
      ${cost.bp ? `<span>💰 ${formatNumber(cost.bp)} BP</span>` : ''}
      ${cost.scrolls ? `<span>📜 Scrolls: ${cost.scrolls}</span>` : ''}
    </div>
  `;
}

function upgradeSelectedItem() {
  if (!selectedForgeItem || !craftingSystem) {
    showForgeResult('upgrade', false, 'No item selected!');
    return;
  }

  const useProtection = document.getElementById('use-protection')?.checked || false;
  const useClover = document.getElementById('use-clover')?.checked || false;

  // Check if we have the consumables
  if (useProtection && (craftingSystem?.materials?.protection_charm || 0) < 1) {
    showForgeResult('upgrade', false, 'No Protection Charms!');
    return;
  }
  if (useClover && (craftingSystem?.materials?.lucky_clover || 0) < 1) {
    showForgeResult('upgrade', false, 'No Lucky Clovers!');
    return;
  }

  const result = craftingSystem.upgradeEquipment(selectedForgeItem, gameState, useProtection, useClover);

  if (result.error) {
    showForgeResult('upgrade', false, result.error);
    return;
  }

  // Consume materials
  if (useProtection) craftingSystem.materials.protection_charm--;
  if (useClover) craftingSystem.materials.lucky_clover--;

  // Deduct BP
  if (result.bpCost) {
    gameState.boopPoints -= result.bpCost;
  }

  // Deduct materials
  if (result.materialsCost) {
    for (const [mat, count] of Object.entries(result.materialsCost)) {
      craftingSystem.materials[mat] = (craftingSystem.materials[mat] || 0) - count;
    }
  }

  if (result.success) {
    showForgeResult('upgrade', true, `SUCCESS! ${selectedForgeItem.name} is now +${selectedForgeItem.upgradeLevel}!`);
    if (audioSystem) audioSystem.playSFX('levelup');
  } else {
    const msg = result.protected
      ? `Failed! Protection Charm saved your item!`
      : `Failed! Item remains at +${selectedForgeItem.upgradeLevel}`;
    showForgeResult('upgrade', false, msg);
    if (audioSystem) audioSystem.playSFX('error');
  }

  // Refresh UI
  updateForgeItemDisplay();
  renderForgeTab();
  updateResourceDisplay();
}

function enchantSelectedItem() {
  if (!selectedForgeItem || !craftingSystem) {
    showForgeResult('enchant', false, 'No item selected!');
    return;
  }

  const enchantSelect = document.getElementById('enchant-select');
  const enchantId = enchantSelect?.value;

  if (!enchantId) {
    showForgeResult('enchant', false, 'No enchantment selected!');
    return;
  }

  const result = craftingSystem.applyEnchantment(selectedForgeItem, enchantId, gameState);

  if (result.error) {
    showForgeResult('enchant', false, result.error);
    return;
  }

  // Deduct costs
  if (result.bpCost) gameState.boopPoints -= result.bpCost;
  if (result.scrollsCost) {
    const scrollKey = `enchant_scroll_${window.ENCHANTMENTS?.[enchantId]?.tier || 'common'}`;
    craftingSystem.materials[scrollKey] = (craftingSystem.materials[scrollKey] || 0) - result.scrollsCost;
  }

  showForgeResult('enchant', true, `Applied ${window.ENCHANTMENTS?.[enchantId]?.name || enchantId}!`);
  if (audioSystem) audioSystem.playSFX('powerup');

  updateForgeItemDisplay();
  renderForgeTab();
  updateResourceDisplay();
}

function removeEnchant(index) {
  if (!selectedForgeItem || !craftingSystem) return;

  const result = craftingSystem.removeEnchantment(selectedForgeItem, index);
  if (result.success) {
    showForgeResult('enchant', true, 'Enchantment removed!');
    updateForgeItemDisplay();
  }
}

function showForgeResult(type, success, message) {
  const resultEl = document.getElementById(type === 'upgrade' ? 'upgrade-result' : 'enchant-cost');
  if (!resultEl) return;

  const resultDiv = document.createElement('div');
  resultDiv.className = `forge-result-msg ${success ? 'success' : 'fail'}`;
  resultDiv.textContent = message;

  // For upgrade result, use the dedicated element
  if (type === 'upgrade') {
    const upgradeResult = document.getElementById('upgrade-result');
    if (upgradeResult) {
      upgradeResult.innerHTML = '';
      upgradeResult.appendChild(resultDiv);
      setTimeout(() => upgradeResult.innerHTML = '', 3000);
    }
  } else {
    // For enchant, show temporarily
    const temp = document.createElement('div');
    temp.className = `forge-result-msg ${success ? 'success' : 'fail'}`;
    temp.textContent = message;
    resultEl.appendChild(temp);
    setTimeout(() => temp.remove(), 3000);
  }
}

// Initialize forge item select event listener
document.addEventListener('DOMContentLoaded', () => {
  const forgeSelect = document.getElementById('forge-item-select');
  if (forgeSelect) {
    forgeSelect.addEventListener('change', (e) => onForgeItemSelect(e.target));
  }

  const enchantSelect = document.getElementById('enchant-select');
  if (enchantSelect) {
    enchantSelect.addEventListener('change', (e) => onEnchantSelect(e.target));
  }
});

// Make forge functions globally available
window.upgradeSelectedItem = upgradeSelectedItem;
window.enchantSelectedItem = enchantSelectedItem;
window.removeEnchant = removeEnchant;
window.renderForgeTab = renderForgeTab;

// ===================================
// RESET GAME
// ===================================

function resetGame() {
  if (!confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
    return;
  }
  if (!confirm('FINAL WARNING: All your cats, upgrades, and progress will be lost forever!')) {
    return;
  }

  SaveSystem.deleteSave();
  location.reload();
}

// Make reset available globally
window.resetGame = resetGame;

// ===================================
// GOLDEN SNOOT UI
// ===================================

function updateGoldenSnootUI() {
  if (!goldenSnootSystem) return;

  const container = document.getElementById('golden-snoot-container');
  const snootEl = document.getElementById('golden-snoot');
  const timerBar = document.getElementById('golden-snoot-timer-bar');

  if (!container || !snootEl) return;

  const snootData = goldenSnootSystem.getSnootRenderData();

  if (snootData) {
    container.classList.remove('hidden');
    container.style.left = snootData.position.x + 'px';
    container.style.top = snootData.position.y + 'px';

    if (timerBar) {
      timerBar.style.width = (snootData.progress * 100) + '%';
    }
  } else {
    container.classList.add('hidden');
  }
}

// ===================================
// DAILY COMMISSIONS UI
// ===================================

function toggleDailyPanel() {
  const content = document.getElementById('daily-content');
  if (content) {
    content.classList.toggle('hidden');
    if (!content.classList.contains('hidden')) {
      renderDailyCommissions();
    }
  }
}

function renderDailyCommissions() {
  if (!dailySystem) return;

  const listEl = document.getElementById('daily-list');
  const progressEl = document.getElementById('daily-progress');
  const streakEl = document.getElementById('streak-count');

  if (!listEl) return;

  const status = dailySystem.getCommissionStatus();
  if (!status || !status.commissions) return;

  if (progressEl) {
    const completed = status.commissions.filter(c => c.completed).length;
    progressEl.textContent = `${completed}/${status.commissions.length}`;
  }

  if (streakEl) {
    streakEl.textContent = status.streak;
  }

  listEl.innerHTML = status.commissions.map(comm => {
    const progress = Math.min(comm.progress, comm.target);
    const percent = (progress / comm.target) * 100;
    return `
      <div class="daily-item ${comm.completed ? 'completed' : ''}">
        <div class="daily-item-name">${comm.type.emoji} ${comm.type.name}</div>
        <div class="daily-item-progress">${progress}/${comm.target}</div>
        <div class="bond-bar" style="height: 4px; margin-top: 4px;">
          <div class="bond-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

// Make toggleDailyPanel global
window.toggleDailyPanel = toggleDailyPanel;

// ===================================
// ACTIVE EFFECTS UI
// ===================================

function updateActiveEffectsUI() {
  if (!goldenSnootSystem) return;

  const container = document.getElementById('active-effects');
  if (!container) return;

  const effects = goldenSnootSystem.getActiveEffectsStatus();

  if (effects.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = effects.map(effect => `
    <div class="active-effect" style="border-left-color: ${effect.color}">
      <span class="effect-emoji">${effect.emoji}</span>
      <div class="effect-info">
        <span class="effect-name">${effect.name}</span>
        <span class="effect-timer">${Math.ceil(effect.remainingTime / 1000)}s</span>
      </div>
    </div>
  `).join('');
}

// ===================================
// SAVE SYSTEM
// ===================================

function saveGame() {
  SaveSystem.save(gameState, masterSystem, catSystem, waifuSystem, upgradeSystem);
}

function startAutoSave() {
  SaveSystem.startAutoSave(saveGame);
}

// ===================================
// GAME LOOP
// ===================================

let lastFrameTime = 0;

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;
  const deltaSeconds = deltaTime / 1000;

  // Update playtime
  gameState.playtime += deltaTime;

  // Generate PP from cats
  const ppPerSecond = catSystem.calculatePPPerSecond(gameState.modifiers);
  gameState.purrPower += ppPerSecond * deltaSeconds;

  // Generate passive BP from upgrades
  if (gameState.modifiers.passiveBpPerSecond > 0) {
    gameState.boopPoints += gameState.modifiers.passiveBpPerSecond * deltaSeconds;
  }

  // Auto-boop from upgrades
  if (gameState.modifiers.autoBoopRate > 0) {
    const autoBoops = gameState.modifiers.autoBoopRate * deltaSeconds;
    const autoBP = autoBoops * gameState.boopPower * (gameState.modifiers.bpMultiplier || 1);
    gameState.boopPoints += autoBP;
    gameState.totalBoops += autoBoops;
  }

  // Update cat happiness
  if (catSystem) catSystem.updateHappiness(deltaSeconds, gameState.modifiers);

  // Update Phase 3 systems (with null checks)
  if (elementalSystem) elementalSystem.update(deltaTime);
  if (craftingSystem) craftingSystem.update(deltaTime);
  if (goldenSnootSystem) goldenSnootSystem.update(deltaTime);
  if (dailySystem) dailySystem.update(deltaTime);

  // Update parasites (they drain BP/PP)
  const ppRate = catSystem ? catSystem.calculatePPPerSecond(gameState.modifiers) : 0;
  const bpRate = gameState.modifiers.passiveBpPerSecond || 0;
  if (parasiteSystem) parasiteSystem.update(deltaTime, bpRate, ppRate);

  // Update POST-LAUNCH systems (with null checks)
  if (irlIntegrationSystem) irlIntegrationSystem.update(deltaTime);
  if (dramaSystem) dramaSystem.update(deltaTime);

  // Apply IRL bonuses to production
  const irlEffects = irlIntegrationSystem ? irlIntegrationSystem.getCombinedEffects() : {};
  if (irlEffects.bpMultiplier && irlEffects.bpMultiplier > 1) {
    const irlBonusBP = (bpRate * deltaSeconds) * (irlEffects.bpMultiplier - 1);
    gameState.boopPoints += irlBonusBP;
  }
  if (irlEffects.ppMultiplier && irlEffects.ppMultiplier > 1) {
    const irlBonusPP = (ppRate * deltaSeconds) * (irlEffects.ppMultiplier - 1);
    gameState.purrPower += irlBonusPP;
  }

  // Apply golden snoot multiplier to production
  const goldenMultiplier = goldenSnootSystem ? goldenSnootSystem.getBpMultiplier() : 1;
  if (goldenMultiplier > 1) {
    // Extra BP from golden snoot effects
    const bonusBP = (bpRate * deltaSeconds) * (goldenMultiplier - 1);
    gameState.boopPoints += bonusBP;
  }

  // Update display periodically (not every frame)
  if (timestamp % 500 < deltaTime) {
    updateResourceDisplay();
    updateWaifuBondDisplay();
    updateGoldenSnootUI();
    updateActiveEffectsUI();
    updateIRLBonusUI();
    updateHardcoreUI();

    // Update pagoda combat if in run
    if (pagodaSystem && pagodaSystem.inRun) {
      updatePagodaCombat();
    }
  }

  // Update drama UI less frequently
  if (timestamp % 2000 < deltaTime) {
    updateDramaUI();
  }

  // Check for waifu unlocks every 5 seconds
  if (timestamp % 5000 < deltaTime) {
    checkWaifuUnlocks();

    // Check for technique skill and passive discoveries
    if (techniqueSystem) {
      const newSkills = techniqueSystem.checkSkillDiscovery(gameState);
      for (const skill of newSkills) {
        showFloatingText(`🔮 HIDDEN SKILL: ${skill.name}!`, true);
        console.log(`Discovered hidden skill: ${skill.name}`);
        if (audioSystem) audioSystem.playSFX('achievement');
      }

      const newPassives = techniqueSystem.checkCultivationPassives(gameState);
      for (const passive of newPassives) {
        showFloatingText(`✨ ${passive.name} learned!`, true);
        console.log(`Learned cultivation passive: ${passive.name}`);
      }
    }
  }

  requestAnimationFrame(gameLoop);
}

// ===================================
// DEBUG FUNCTIONS
// ===================================

// Debug function to check game state
window.debugGame = function() {
  console.log('=== SNOOT BOOPER DEBUG ===');
  console.log('MasterSystem:', typeof MasterSystem);
  console.log('masterSystem:', masterSystem);
  console.log('masterSystem.allMasters:', masterSystem?.allMasters);
  console.log('getAllMasters result:', masterSystem?.getAllMasters());
  console.log('elements.mastersGrid:', elements.mastersGrid);
  console.log('elements.selectMasterBtn:', elements.selectMasterBtn);
  console.log('previewedMasterId:', previewedMasterId);
  console.log('===========================');
};

// Force start with default master
window.forceStart = function(masterId = 'gerald') {
  console.log('Force starting game with master:', masterId);
  previewedMasterId = masterId;
  startGame();
};

// Force render masters
window.forceRenderMasters = function() {
  console.log('Force rendering master cards...');
  renderMasterCards();
};

// Debug: Spawn a goose manually
window.spawnGoose = function() {
  if (!gooseSystem) {
    console.error('GooseSystem not initialized');
    return;
  }
  console.log('Spawning goose...');
  gooseSystem.spawnGoose();
};

// Debug: Add test techniques
window.addTestTechniques = function() {
  if (!techniqueSystem) {
    console.error('TechniqueSystem not initialized');
    return;
  }
  techniqueSystem.learnTechnique('dream_walker');
  techniqueSystem.learnTechnique('honk_of_authority');
  techniqueSystem.addConsumable('qi_pill_minor', 5);
  techniqueSystem.addConsumable('boop_elixir', 3);
  techniqueSystem.addConsumable('golden_catnip', 1);
  techniqueSystem.learnedSkills.push('thousand_paw_strike');
  techniqueSystem.learnedSkills.push('critical_meridian');
  techniqueSystem.cultivationPassives.push('iron_body_1');
  console.log('Test techniques added! Switch to Skills tab to see them.');
  renderTechniquesPanel();
};

// Debug: Give resources
window.giveResources = function(bp = 100000, pp = 10000) {
  gameState.boopPoints += bp;
  gameState.purrPower += pp;
  updateResourceDisplay();
  console.log(`Added ${bp} BP and ${pp} PP`);
};

// Debug: Test expeditions
window.testExpedition = function() {
  console.log('=== EXPEDITION DEBUG ===');
  console.log('expeditionSystem:', expeditionSystem);
  console.log('catSystem:', catSystem);
  if (catSystem) {
    console.log('All cats:', catSystem.getAllCats());
  }
  if (expeditionSystem) {
    console.log('Active expeditions:', expeditionSystem.activeExpeditions);
    console.log('Destinations:', Object.keys(EXPEDITION_DESTINATIONS));
    for (const [id, dest] of Object.entries(EXPEDITION_DESTINATIONS)) {
      const unlocked = expeditionSystem.isDestinationUnlocked(id, catSystem);
      console.log(`  ${dest.name}: ${unlocked ? 'UNLOCKED' : 'LOCKED'} (needs ${dest.requiredRealm})`);
    }
  }
  renderExpeditions();
};

// Debug: Test partners
window.testPartners = function() {
  console.log('=== PARTNER DEBUG ===');
  console.log('partnerGenerator:', partnerGenerator);
  if (partnerGenerator) {
    console.log('Owned partners:', partnerGenerator.ownedPartners);
    console.log('Stats:', partnerGenerator.stats);
    // Generate a test partner
    const partner = partnerGenerator.generate();
    console.log('Generated test partner:', partner);
    partnerGenerator.addToOwned(partner);
    renderPartners();
    console.log('Partner added to collection!');
  }
};

// Debug: Force add a cat for testing
window.addTestCat = function() {
  if (catSystem) {
    const cat = catSystem.generateCat('mortal');
    catSystem.addCat(cat);
    renderCatCollection();
    console.log('Added test cat:', cat);
  }
};

// ===================================
// START
// ===================================

document.addEventListener('DOMContentLoaded', init);
