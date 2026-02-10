# Snoot Booper - Bug Tracker

*Generated: 2026-02-10*

This document tracks identified bugs and edge cases that need to be addressed.

---

## HIGH PRIORITY

### ~~HP-1: Missing Method - `addHappinessToAll()`~~ FIXED
- **File:** `js/waifus.js:1186`
- **Issue:** Calls `catSystem.addHappinessToAll()` which doesn't exist in CatSystem
- **Fix:** ~~Replace with `catSystem.boostHappiness()`~~ DONE
- **Impact:** Bond activity effects on cat happiness silently fail

### ~~HP-2: Resource Underflow - No Atomic Transactions~~ FIXED
- **Files:** Multiple (`catino.js`, `buildings.js`, `crafting.js`, `gifts.js`, `drama.js`)
- **Issue:** Resources subtracted without atomic transactions; race conditions can cause negative values
- **Fix:** ~~Added `Math.max(0, ...)` guards to all resource subtractions~~ DONE
- **Impact:** Resources can become negative, breaking prestige/balance

### ~~HP-3: Missing Font Imports~~ FIXED
- **File:** `css/main.css`
- **Issue:** 'VT323' and 'Press Start 2P' fonts declared but no @import rules
- **Fix:** ~~Added `@import url(...)` at top of main.css~~ DONE
- **Impact:** Fonts may not display correctly

### ~~HP-4: DOM Null References~~ FIXED
- **File:** `js/game.js`
- **Issue:** Element references with no null checks before use
- **Fix:** ~~Added safe helper functions (`safeSetText`, `safeAddClass`, etc.) and `validateCriticalElements()`~~ DONE
- **Impact:** Crashes if HTML elements are missing

### HP-5: Missing Fusion Modal - RECLASSIFIED AS FEATURE REQUEST
- **Status:** Not a bug - CatFusionSystem exists but UI was never implemented
- **Action:** Move to feature backlog if cat fusion UI is desired

---

## MEDIUM PRIORITY

### ~~MP-1: Modifiers Not Recalculated After Load~~ FIXED
- **File:** `js/game.js` (loadGame function)
- **Issue:** `recalculateModifiers()` never called after loading a save
- **Fix:** ~~Added `recalculateModifiers()` call before AFK gains calculation~~ DONE

### ~~MP-2: AFK Gains with Stale Modifiers~~ FIXED
- **File:** `js/game.js`
- **Issue:** `recalculateModifiers()` not called before `calculateAfkGains()`
- **Fix:** ~~Fixed alongside MP-1 — modifiers now recalculated before AFK calc~~ DONE

### ~~MP-3: Combo Timer Not Cleared on Reset~~ FIXED
- **File:** `js/game.js` (handleRebirth function)
- **Issue:** Timer references old gameState after prestige/reset
- **Fix:** ~~Added `clearTimeout(gameState.comboTimer)` and reset comboCount in handleRebirth~~ DONE

### ~~MP-4: Memory Leak - Floating Text~~ FIXED
- **File:** `js/game.js` (showFloatingText function)
- **Issue:** Rapid booping accumulates DOM elements without cleanup
- **Fix:** ~~Added MAX_FLOATING_TEXT=20 cap; oldest elements pruned before adding new ones~~ DONE

### ~~MP-5: Division by Zero in Team Calculations~~ FIXED
- **File:** `js/dungeons/tournament.js` (getTeamHpPercent)
- **Issue:** `totalCurrent / totalMax` when team is empty or all maxHp is 0
- **Fix:** ~~Added guard clauses for empty team and zero totalMax~~ DONE

### ~~MP-6: NaN Display in PP Rate~~ FIXED
- **File:** `js/game.js` (updateResourceDisplay)
- **Issue:** PP rate can show `+NaN/s` if calculation fails
- **Fix:** ~~Added `isNaN()` and `isFinite()` guards, defaults to 0~~ DONE

### ~~MP-7: Crit Multiplier Addition vs Multiplication~~ FIXED
- **File:** `js/game.js` (recalculateModifiers)
- **Issue:** `critMultiplier` used `+` instead of `*` for technique bonus
- **Fix:** ~~Changed to `(base || 1) * (1 + (techniqueBonus || 0))` pattern~~ DONE

---

## CSS ISSUES

### ~~CSS-1: Duplicate `.jade-button` Definitions~~ FIXED
- **Files:** `css/components.css`, `css/main.css`
- **Fix:** ~~Removed duplicate from main.css; components.css is canonical source~~ DONE

### ~~CSS-2: Duplicate `.scroll-panel` Definitions~~ FIXED
- **Files:** `css/components.css`, `css/main.css`
- **Fix:** ~~Removed duplicate from main.css; components.css is canonical source~~ DONE

### ~~CSS-3: Z-Index Stacking Order~~ FIXED
- **File:** `css/modals.css`
- **Note:** Stacking order was actually correct (2500 > 2000). Report was backwards.
- **Fix:** ~~Added z-index hierarchy documentation comment block to modals.css~~ DONE

### ~~CSS-4: CSS Variable `--anim-normal`~~ FIXED
- **Note:** Already defined in `base.css:61`. Was missing from main.css `:root` only.
- **Fix:** ~~Added `--anim-fast`, `--anim-normal`, `--anim-slow` to main.css `:root` for reference~~ DONE

### ~~CSS-5: Dungeon Mobile Responsiveness~~ FIXED
- **File:** `css/dungeon.css`
- **Fix:** ~~Added `@media (max-width: 768px)` breakpoint: single-column grid, auto height, scrollable~~ DONE

---

## LOW PRIORITY / ACCESSIBILITY

### ~~LP-1: Missing Form Labels~~ FIXED
- **File:** `index.html`
- **Fix:** ~~Added `<label class="sr-only">` + `aria-label` for all three cat filter selects~~ DONE

### ~~LP-2: Missing ARIA Labels~~ FIXED
- **File:** `index.html`
- **Fix:** ~~Added `aria-label` to recruit button, save-code textarea. Most other elements already had ARIA.~~ DONE

### ~~LP-3: Modal Z-Index Documentation~~ FIXED
- **Fix:** ~~Added z-index hierarchy comment block at top of modals.css~~ DONE (alongside CSS-3)

### LP-4: Inconsistent ID Naming — DEFERRED
- **Files:** `index.html`, `js/game.js`
- **Issue:** Mix of kebab-case and camelCase in element IDs
- **Status:** Low-risk cosmetic issue. Standardizing would require touching 100+ references across HTML and JS. Deferring to a dedicated refactor pass.

---

## ~~EDGE CASES~~ ALL FIXED

1. ~~**Empty cat array in synergy calculations** - `cats.js:2361`~~ Already had guard clause
2. ~~**Parasite drain exceeding generation rate**~~ FIXED - Clamped `drainRate` to max 1.0 in `parasites.js:332`
3. ~~**Auto-boop with 0 boop power**~~ FIXED - Added `boopPower > 0` guard in `game.js:6705`
4. ~~**Fallback BuildingSystem returns Infinity**~~ FIXED - Changed to `Number.MAX_SAFE_INTEGER` in `game.js:86`
5. ~~**Null master after corrupted save load**~~ FIXED - Added null check with fallback to 'gerald' in `game.js:614`
6. ~~**Log of zero in big number formatting**~~ FIXED - Guard `n > 0` before `Math.log10()` in `bigNumber.js:80`

---

## COMPLETED FIXES

### Critical (2026-02-10)
- [x] ~~Missing `window.` prefix in cats.js dataLoader~~
- [x] ~~Array `includes()` on object array in waifus.js~~
- [x] ~~Corrupted save crash - missing guard clause~~
- [x] ~~Duplicate setInterval stacking~~
- [x] ~~Null modifiers in game loop~~

### High Priority (2026-02-10)
- [x] ~~HP-1: Missing method `addHappinessToAll()` - replaced with `boostHappiness()`~~
- [x] ~~HP-2: Resource underflow - added `Math.max(0, ...)` guards~~
- [x] ~~HP-3: Missing font imports - added @import to main.css~~
- [x] ~~HP-4: DOM null references - added safe helper functions~~

### Medium Priority (2026-02-10)
- [x] ~~MP-1: Modifiers not recalculated after load - added call before AFK calc~~
- [x] ~~MP-2: AFK gains with stale modifiers - fixed alongside MP-1~~
- [x] ~~MP-3: Combo timer not cleared on reset - clear in handleRebirth~~
- [x] ~~MP-4: Memory leak floating text - added MAX_FLOATING_TEXT=20 cap~~
- [x] ~~MP-5: Division by zero in team HP - added guard clauses~~
- [x] ~~MP-6: NaN display in PP rate - added isNaN/isFinite guard~~
- [x] ~~MP-7: Crit multiplier addition vs multiplication - changed to `* (1 + bonus)` pattern~~

### CSS Issues (2026-02-10)
- [x] ~~CSS-1: Duplicate `.jade-button` - removed from main.css~~
- [x] ~~CSS-2: Duplicate `.scroll-panel` - removed from main.css~~
- [x] ~~CSS-3: Z-index documentation - added hierarchy comment block~~
- [x] ~~CSS-4: `--anim-normal` - added animation vars to main.css :root~~
- [x] ~~CSS-5: Dungeon mobile - added @media breakpoint~~

### Low Priority (2026-02-10)
- [x] ~~LP-1: Form labels - added sr-only labels + aria-label to filter selects~~
- [x] ~~LP-2: ARIA labels - added to recruit button, save-code textarea~~
- [x] ~~LP-3: Z-index docs - added alongside CSS-3~~
- [ ] LP-4: Inconsistent ID naming - deferred to dedicated refactor

### Edge Cases (2026-02-10)
- [x] ~~EC-1: Empty cat array - already guarded in cats.js:2361~~
- [x] ~~EC-2: Parasite drain overflow - clamped to max 1.0~~
- [x] ~~EC-3: Auto-boop with 0 power - added boopPower > 0 guard~~
- [x] ~~EC-4: Fallback BuildingSystem Infinity - changed to MAX_SAFE_INTEGER~~
- [x] ~~EC-5: Null master on corrupted save - fallback to gerald~~
- [x] ~~EC-6: Log of zero - guarded Math.log10 with n > 0 check~~
