# Plan 001: Settings Panel 31-Language Localization Failure Analysis & Completion Strategy

## Problem Statement & Root Cause Analysis

While basic mascot and window settings in the Settings Panel translate correctly across languages, newer features (such as Physics Engine controls, Multi-Source Stage Spotlights, First-Person Camera Perspective, Viewport Controls, Spatial XYZ HUD, and Tab Scroll Arrows) exhibit partial or complete translation failure (displaying raw English keys or unrendered text).

Through technical audit of `i18nManager.js`, `scratch_create_locales.js`, `index.html`, `renderer.js`, and `locales/`, five primary root causes were identified:

### 1. Key Disparity & Feature Evolution (Temporal Desynchronization)
- **Root Cause**: Features like Physics Engine, Spotlight Sources, FPS Flight Controls, Viewport Controls, and Spatial HUD were built in later development iterations.
- **Impact**: When third-party locale files (`locales/<lang>/translation.json`) were originally generated, they only contained 15–20 original keys (`active_mascot`, `win_width`, etc.). The ~35 newly added keys (`physics_section`, `spotlight_section`, `fps_mode_section`, `tab_display`, `tab_motion`, etc.) were missing from non-English locale dictionaries, causing fallback failures.

### 2. Missing `data-i18n` Annotations in Recently Added HTML Elements
- **Root Cause**: Later UI additions in [index.html](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/index.html) (e.g. Tab Navigation left/right scroll arrows `#tab-nav-left` and `#tab-nav-right`, spotlight dropdown options, and drag header hints) lacked `data-i18n` or `data-i18n-title` attributes.
- **Impact**: `updateDOMTranslations()` scans `document.querySelectorAll('[data-i18n]')` and skips unannotated elements, leaving them permanently in hardcoded English.

### 3. Dynamic JavaScript Component Re-rendering Gaps
- **Root Cause**: Spotlight control cards, animation dropdown options, and mascot grid cards are dynamically created in [renderer.js](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/renderer.js) using template strings (`Spotlight Light #${id}`, `Remove Spotlight`).
- **Impact**: When a user changes language in the System tab, `updateDOMTranslations()` updates static DOM nodes, but dynamically appended JS components are not re-rendered with `t(key)` calls or re-bound to locale change events.

### 4. Flawed Fallback Merge in Locale Dictionaries
- **Root Cause**: In [i18nManager.js](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/i18nManager.js), `i18next` fallback (`fallbackLng: 'en'`) only triggers if a key is completely absent. If a translation file contained empty strings (`""`) or missing sub-keys, `i18next` rendered blank labels or unformatted key strings.

### 5. Layout Clipping & Text Overflow
- **Root Cause**: Long translated text in German, French, or Russian (e.g. *Bühnen-Spotlichtsteuerung* for *Stage Spotlight Control*) clips within fixed-width container cards.

---

## User Review Required

> [!IMPORTANT]
> - **100% Key Parity**: All 31 supported locale JSON files will be updated via automated fallback merge script (`scratch_create_locales.js`) to guarantee that all 85+ keys exist in every language.
> - **Dynamic Component Re-translation**: Dynamic JS elements (spotlight cards, dropdowns) will be bound to live locale change listeners for instant, zero-restart re-rendering.

---

## Open Questions
None. The root causes are identified and the solution strategy is fully bounded.

---

## Proposed Technical Changes

### 1. Dictionary Parity & Fallback Merge Automation

#### [MODIFY] [scratch_create_locales.js](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/scratch_create_locales.js)
- Maintain a complete master 85+ key English template (`newTranslations["en"]`).
- Implement an automated fallback merge loop across all 31 supported locales:
  ```javascript
  const masterEN = newTranslations["en"];
  for (const code of Object.keys(newTranslations)) {
    const merged = Object.assign({}, masterEN, newTranslations[code] || {});
    // Write out normalized translation.json for each locale
  }
  ```
- Run `node scratch_create_locales.js` to build all 31 `locales/<lang>/translation.json` files with 100% key coverage.

---

### 2. Complete HTML DOM i18n Annotations

#### [MODIFY] [index.html](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/index.html)
- Annotate all un-translated tags across all 6 tabs with `data-i18n` and `data-i18n-title`:
  - Tab navigation arrow buttons: `<button id="tab-nav-left" class="btn studio-tab-nav-arrow" data-i18n-title="nav_prev_tab">◀</button>`
  - Section titles, slider labels, shortcut descriptions, and action buttons.

---

### 3. Dynamic JS Component Re-translation Engine

#### [MODIFY] [renderer.js](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/renderer.js)
- Update dynamic card rendering (e.g., `renderSpotlightCards()`) to use `t('spotlight_num')` and `t('remove_spotlight')`.
- Register locale change callbacks to trigger `renderSpotlightCards()` and dynamic component updates live when language dropdown changes.

---

### 4. Dynamic Typography & Layout Scaling

#### [MODIFY] [style.css](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/style.css)
- Add CSS font stacks for CJK (Japanese, Chinese, Korean) and RTL (Arabic) fonts.
- Add `hyphens: auto; word-break: break-word;` to setting card labels to handle longer European translated words gracefully.

---

## Verification & Quality Plan

### Automated Verification
1. Run `node scratch_create_locales.js` to build all 31 locale files under `locales/`.
2. Run automated validation script to verify that every `locales/<lang>/translation.json` contains 100% of master English keys with zero missing keys.

### Manual Verification
1. Launch app (`npm start` / `DesktopPet.exe`).
2. Open Settings Panel ➔ System Tab ➔ Change language dropdown across `German`, `Japanese`, `French`, `Spanish`, `Simplified Chinese`, `Russian`, `Arabic`, `Korean`, `Thai`.
3. Confirm all 6 studio tab headers, spotlight control cards, slider labels, shortcut hints, and diagnostic buttons re-translate live without restart.
