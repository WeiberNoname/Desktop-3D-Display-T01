# 31 Languages Localization Architecture & Completion Plan (Plan 001)

Comprehensive technical plan for achieving **100% native multi-language localization** across all 31 supported international languages for every tab, header, label, control card, slider, button, and help text in the Studio Settings Control Suite.

---

## 🎯 Plan Objectives & Core Architecture

1. **100% International Key Coverage**:
   - Guarantee native translation for all 85 UI elements across all 6 Studio Tabs (`Display & Model`, `Motion & Spin`, `Stage Lighting`, `Physics Engine`, `Camera & Spatial`, `System & Locales`).
2. **Supported 31 International Locales**:
   - `en`, `zh-CN`, `zh-TW`, `ja`, `ko`, `es`, `fr`, `de`, `it`, `pt-BR`, `ru`, `tr`, `vi`, `pl`, `ar`, `bg`, `cs`, `da`, `nl`, `fi`, `el`, `hu`, `id`, `ms`, `no`, `pt-PT`, `ro`, `es-419`, `sv`, `th`, `uk`.
3. **Zero-Restart Live UI Translation**:
   - Selecting any language in the System Tab dropdown instantly re-translates all 6 studio tab headers, spotlight control cards, slider labels, and diagnostic buttons in real-time (0ms delay) without requiring an app restart or reload.
4. **Guaranteed Master Fallback Merge**:
   - Fallback merging algorithm (`Object.assign({}, newTranslations["en"], newTranslations[code])`) ensures no missing translation keys or raw string fallbacks.

---

## 🛠️ Proposed Technical Implementation

### 1. Master Template & Automated Dictionary Generator

#### [MODIFY] [scratch_create_locales.js](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/scratch_create_locales.js)
- Maintain master 85-key English template (`newTranslations["en"]`) containing all UI strings:
  - Studio Tab Labels (`tab_display`, `tab_motion`, `tab_lighting`, `tab_physics`, `tab_camera`, `tab_system`)
  - Stage Spotlight & Ambient Controls (`spotlight_section`, `enable_spotlight`, `spotlight_angle_h`, `spotlight_angle_v`, `spotlight_cone`, `spotlight_intensity`, `spotlight_color`, `dark_stage_preset`, `add_spotlight`, `remove_spotlight`, `spotlight_num`, `dual_concert_preset`)
  - Physics Engine Controls (`physics_section`, `enable_physics`, `physics_hint_title`, `physics_hint_body`, `physics_floor`, `physics_gravity`, `physics_elasticity`)
  - First-Person Camera Flight & Spatial Coordinates (`fps_mode_section`, `enable_fps_mode`, `fps_sub`, `fps_hint_title`, `fps_hint_body`, `reset_camera`, `show_xyz_coords`, `show_xyz_sub`, `show_ground_grid`, `xyz_hud_title`)
  - Blender Viewport Controls (`viewport_controls`, `orbit`, `orbit_sub`, `pan`, `pan_sub`, `zoom`, `zoom_sub`, `ortho`, `ortho_sub`, `reset_view`, `reset_view_sub`)
- Implement fallback merge loop iterating over all 31 locale codes:
  ```javascript
  const merged = Object.assign({}, newTranslations["en"], newTranslations[code] || {});
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  ```

---

### 2. HTML DOM i18n Binding

#### [MODIFY] [index.html](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/index.html)
- Annotate all HTML tags across all 6 tabs with `data-i18n="key_name"` attributes:
  - Studio tab buttons: `<button class="studio-tab-btn" data-i18n="tab_display">🎯 Display & Model</button>`
  - Checkbox labels, range titles, shortcut notes, section headers, and action buttons.

---

### 3. Dynamic Live Language Switching Engine

#### [MODIFY] [renderer.js](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/renderer.js)
- Attach live `change` event listener to `#lang-select`:
  ```javascript
  if (langSelect) {
    langSelect.addEventListener('change', async () => {
      currentSettings.language = langSelect.value;
      await changeLanguage(langSelect.value); // Triggers updateDOMTranslations()
      saveSettingsFile();
    });
  }
  ```
- Re-render dynamic components (such as spotlight cards) with `t('spotlight_num')` and `t('remove_spotlight')` on locale change.

---

### 4. International Typography & Layout Fallbacks

#### [MODIFY] [style.css](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/style.css)
- Implement global font stack with CJK and RTL typography fallbacks:
  ```css
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               'PingFang SC', 'Hiragino Sans', 'Meiryo', 'Malgun Gothic',
               'Noto Sans CJK', sans-serif;
  ```
- Enforce strict arrow button max-width limits (`flex: 0 0 24px !important`, `max-width: 32px !important`) to ensure compact tab layout across long translated tab titles.

---

## 🧪 Verification & Validation Plan

### Automated Verification
1. Run `node scratch_create_locales.js` to build all 31 language files under `locales/`.
2. Validate JSON structure of generated `locales/<code kiến>/translation.json` files to ensure 100% 85-key parity.

### Manual Verification
1. Launch app via `npm start` or compiled executable [DesktopPet.exe](file:///C:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/DesktopPet-win32-x64/DesktopPet.exe).
2. Open Settings Panel (`⚙️`) ➔ Navigate to **System Tab** ➔ Change language selector across various locales (`French`, `Japanese`, `German`, `Spanish`, `Simplified Chinese`, `Korean`, `Russian`, `Thai`, `Arabic`).
3. Confirm all 6 studio tab titles, section headers, range sliders, spotlight cards, and diagnostic buttons re-translate live in real-time.
4. Recompile production package using `cmd.exe /c "npm run build"`.
