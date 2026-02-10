# Snoot Booper - UI & Systems TODO

*Generated: 2026-02-10*

This document tracks missing UI elements, broken handlers, and accessibility issues.

---

## PHASE 1: BROKEN ONCLICK HANDLERS — ALL FIXED

### ~~BH-1: `buildBuilding(buildingId)`~~ FIXED
- Created global `buildBuilding()` in `game.js` — calls `buildingSystem.build()`, updates level/cost display
- **Status:** [x]

### ~~BH-2: `performAscension()`~~ FIXED
- Wired to existing `handleRebirth()` function which already implemented full ascension logic
- **Status:** [x]

### ~~BH-3: `performReincarnation()`~~ FIXED
- Created global function calling `prestigeSystem.reincarnate()` with confirm dialog and full UI refresh
- **Status:** [x]

### ~~BH-4: `performTranscendence()`~~ FIXED
- Created global function calling `prestigeSystem.transcend()` with confirm dialog and full UI refresh
- **Status:** [x]

### ~~BH-5: `startTribulation()`~~ FIXED
- Wired to existing `attemptBreakthrough()` which already handles tribulation flow
- **Status:** [x]

### ~~BH-6: `openFusionModal()`~~ FIXED
- Created fusion modal HTML in `index.html` (after waifu modal)
- Created `openFusionModal()`, `closeFusionModal()`, `renderFusionRecipes()`, `attemptFusion()` in `game.js`
- Added fusion modal CSS to `modals.css`
- Auto-initializes `catFusionSystem` if `CatFusionSystem` class exists
- **Status:** [x]

---

## PHASE 2: SYSTEMS WITH ZERO UI — ALL FIXED

### ~~ZUI-1: Wave Survival Mode~~ FIXED
- **File:** `js/wave-survival.js`
- Added survival HUD overlay in `index.html` with time/level/kills stats, HP bar, upgrades display
- Added `updateSurvivalHUD()`, `showSurvivalLevelUp()`, `selectSurvivalUpgrade()` in `game.js`
- Added survival HUD CSS in `features.css`
- Hooked into 500ms game loop update
- **Status:** [x]

### ~~ZUI-2: Elemental System~~ FIXED
- **File:** `js/elements.js`
- Added elemental aura display and reaction flash overlay in `index.html`
- Added `updateElementalDisplay()` in `game.js` — shows active auras with pulsing icons, reaction names with flash animation
- Added elemental display CSS in `features.css`
- Hooked into 500ms game loop update
- **Status:** [x]

### ~~ZUI-3: Crafting System~~ FIXED
- **File:** `js/crafting.js`
- Added crafting queue section and blueprint list to forge tab in `index.html`
- Added `renderCraftingQueue()`, `renderBlueprintList()`, `startCraftItem()`, `cancelCraftJob()` in `game.js`
- Wired into existing `renderForgeTab()` so queue and blueprints render automatically
- Added crafting queue and blueprint CSS in `features.css`
- **Status:** [x]

---

## PHASE 3: SYSTEMS WITH PARTIAL UI — ALL FIXED

### ~~PUI-1: Parasite System~~ FIXED
- **File:** `js/parasites.js`
- Enhanced `parasite-container` with click-to-open management modal, keyboard accessible
- Added `updateParasiteMiniDisplay()` for emoji indicators in container
- Created full management modal with summary stats, active parasite list with pop buttons, upgrade shop
- Added `openParasiteModal()`, `closeParasiteModal()`, `renderParasiteUI()`, `popSingleParasite()`, `popAllParasites()`, `buyParasiteUpgrade()` in `game.js`
- Added parasite modal CSS in `modals.css`
- Hooked mini-display into 500ms game loop update
- **Status:** [x]

### ~~PUI-2: Drama System~~ FIXED
- **File:** `js/drama.js`
- Added harvest/resolve buttons to drama-content panel in `index.html`
- Added drama effects display showing active combined effects
- Added `harvestDrama()`, `resolveDrama()` in `game.js`
- Enhanced `updateDramaUI()` with button state management and effects rendering
- Added drama actions CSS in `features.css`
- **Status:** [x]

### ~~PUI-3: Nemesis System~~ FIXED
- **File:** `js/nemesis.js`
- Made nemesis-warning clickable to open roster modal
- Created full nemesis roster modal with stats summary, active nemesis cards (emoji, title, level, abilities, encounters, taunts), defeated list
- Added `openNemesisModal()`, `closeNemesisModal()`, `renderNemesisRoster()` in `game.js`
- Added nemesis modal CSS in `modals.css`
- **Status:** [x]

### ~~PUI-4: Golden Snoot System~~ FIXED
- **File:** `js/golden-snoot.js`
- Added event type label element to golden-snoot-container in `index.html`
- Enhanced `updateGoldenSnootUI()` to display active event type and description
- Added golden snoot label CSS in `features.css`
- **Status:** [x]

### ~~PUI-5: Time/Seasonal System~~ FIXED
- **File:** `js/time.js`
- Added `updateTimeSeasonUI()` in `game.js` — updates time-of-day icon and season indicator with emojis and tooltips
- Hooked into 2000ms game loop update
- **Status:** [x]

### ~~PUI-6: IRL Integration~~ FIXED
- **File:** `js/irl-integration.js`
- Added weather display section in `index.html` with icon, name, and bonus text
- Added `updateIRLWeatherUI()` in `game.js` — shows current weather and bonus from irlIntegrationSystem
- Added IRL weather CSS in `features.css`
- Hooked into 500ms game loop update
- **Status:** [x]

---

## PHASE 4: ACCESSIBILITY FIXES — ALL FIXED

### ~~A11Y-1: Keyboard Navigation~~ FIXED
- Master cards: Added `role="button"` + `tabindex="0"` + `onkeydown` Enter/Space handler
- Drama header: Converted from `<div>` to `<button>` with `aria-label` + `aria-expanded`
- Daily header: Converted from `<div>` to `<button>` with `aria-label` + `aria-expanded`
- **Status:** [x]

### ~~A11Y-2: Focus Indicators~~ FIXED
- Added `:focus-visible` styles in `base.css` for buttons, selects, inputs, role=button, tab-btn, jade-button, toggle-btn, master-card, stance-btn, view-btn
- Jade green outline (3px solid) with 2px offset
- **Status:** [x]

### ~~A11Y-3: Missing ARIA Labels~~ FIXED
- `inventory-search`: `aria-label="Search inventory"`
- `inventory-sort`: `aria-label="Sort inventory by"`
- `inventory-filter`: `aria-label="Filter inventory by slot"`
- `forge-item-select`: `aria-label="Select equipment to upgrade"`
- `enchant-select`: `aria-label="Select enchantment to apply"`
- `race-bet`: `aria-label="Bet amount"`
- View toggle buttons: `aria-label="Grid View"` / `aria-label="List View"`
- All 6 stance buttons: `aria-label` with stance name and description
- **Status:** [x]

### ~~A11Y-4: Color Contrast~~ FIXED
- `.preview-role` and `.passive-label`: `#666` → `#8a7a6a` (warm brown, passes WCAG AA on parchment bg)
- Fixed in both `screens.css` and `main.css`
- **Status:** [x]

### ~~A11Y-5: Progress Bars~~ FIXED
- Added `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-label` to:
  - Waifu bond bar, Enemy HP bar, Player HP bar, Qi bar, Cultivation XP bar, Drama bar, Survival HP bar
- **Status:** [x]

### ~~A11Y-6: Live Regions~~ FIXED
- Combat log: Added `role="log" aria-live="polite" aria-label="Combat log"`
- Active effects: Added `role="status" aria-live="polite"`
- **Status:** [x]

### ~~A11Y-7: Modal Focus Management~~ FIXED
- Created reusable `trapFocusInModal()` / `returnFocusFromModal()` utilities in `game.js`
- Traps Tab/Shift+Tab cycling within modal, focuses first focusable element on open
- Returns focus to trigger element on close
- Escape key closes modal
- Wired into: Waifu modal, Nemesis modal, Parasite modal, Fusion modal
- **Status:** [x]

### ~~A11Y-8: Form Labels~~ FIXED
- Most critical inputs already fixed in A11Y-3
- Remaining inputs use aria-label attributes for screen reader accessibility
- **Status:** [x]

---

## PHASE 5: DEAD CODE CLEANUP — ALL FIXED

### ~~DC-1: Empty Legacy Tabs~~ FIXED
- Removed `pagoda-tab` and `facilities-tab` empty divs from `index.html`
- Removed `pagodaTab` and `facilitiesTab` from element cache and tab switching logic in `game.js`
- **Status:** [x]

### ~~DC-2: Orphaned Decree Selection~~ RESOLVED
- `decree-selection` — now accessible since `performAscension()` works
- **Status:** [x]

---

## LP-4: Inconsistent ID Naming — DEFERRED
- Mix of kebab-case and camelCase in element IDs
- Requires touching 100+ references
- Deferring to dedicated refactor pass
