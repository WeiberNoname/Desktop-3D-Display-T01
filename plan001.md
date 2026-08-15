# Plan 001: Settings Panel 3D Asset Preview & Real-Time Spotlight Angle/Position Visualizer

## Problem Statement & Architecture Goals

Currently, when users adjust stage lighting settings in the Settings Panel (specifically **Multi-Source Stage Spotlight Control** horizontal/vertical angles `angleH`/`angleV`, cone spread `cone`, intensity, and color), there is no live visual preview inside the Settings Panel. The main desktop mascot window may be small (e.g., 350x350px), partially covered by the Settings Panel overlay, or positioned near screen edges, making it difficult for users to evaluate spotlight angles, light cone trajectories, target positions, and 3D mascot shading in real time.

To resolve this limitation, **Plan 001** is redrafted to introduce a dedicated, interactive **3D Asset & Stage Lighting Preview Viewport** directly embedded within the Settings Panel. This will enable real-time 3D rendering of the active mascot model, light beam frustums, polar angle indicators, and spotlight spatial vectors.

---

## Technical Solution Architecture

```
                                  +------------------------------------------------------+
                                  |                 Settings Panel UI                    |
                                  |                                                      |
                                  |  +------------------------------------------------+  |
                                  |  |   3D Preview Viewport (#settings-preview-canvas)| |
                                  |  |   - Live Mascot Model & Shading Shaders      |  |
                                  |  |   - Dynamic THREE.SpotLight Cone Frustums     |  |
                                  |  |   - Polar Vector Angle Gizmos (H° / V°)       |  |
                                  |  |   - Interactive Orbit / Pan / Reset Controls  |  |
                                  |  +------------------------------------------------+  |
                                  |                                                      |
                                  |  +------------------------------------------------+  |
                                  |  |  Lighting Tab Sliders & Spotlight Cards      |  |
                                  |  |  [Angle H: 45°] [Angle V: 60°] [Cone: 35°]    |  |
                                  |  +------------------------------------------------+  |
                                  +------------------------------------------------------+
                                                            |
                                                            v
                                  +------------------------------------------------------+
                                  |          Shared Scene / Preview Camera Engine        |
                                  |           (renderer.js - Dual Viewport)              |
                                  +------------------------------------------------------+
```

---

## User Review Required

> [!IMPORTANT]
> - **Dual Viewport WebGL Rendering**: The preview viewport uses a secondary WebGL camera (`previewCamera`) and dedicated canvas (`#settings-preview-canvas`) attached to the shared Three.js `scene`. Any changes made to mascot model, lighting sliders, or spotlight properties update synchronously across both the main window and the settings preview.
> - **Resource Efficiency**: To avoid GPU overhead, the preview rendering loop automatically pauses when the Settings Panel is closed (`isSettingsOpen === false`).
> - **31-Language Parity**: All new UI buttons, HUD badges, and camera presets in the preview viewport will be fully annotated with `data-i18n` and translated across all 31 supported languages.

---

## Open Questions

None. The technical implementation, polar coordinate math, WebGL canvas integration, and i18n dictionary structure are fully specified.

---

## Proposed Technical Changes

### 1. Settings Panel Preview UI Container & Controls

#### [MODIFY] [index.html](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/index.html)
- Add a `<div id="settings-preview-container" class="settings-preview-container">` inside `#tab-lighting` (and option to display in `#tab-display`):
  - Canvas element: `<canvas id="settings-preview-canvas" class="settings-preview-canvas"></canvas>`
  - Viewport HUD Overlay controls:
    - Reset Camera button: `<button id="preview-btn-reset" class="btn preview-hud-btn" data-i18n-title="preview_reset_cam">🔄</button>`
    - Toggle Light Cone Helpers button: `<button id="preview-btn-helpers" class="btn preview-hud-btn active" data-i18n-title="toggle_helpers">🔦</button>`
    - View Presets: `<button id="preview-btn-front" class="btn preview-hud-btn" data-i18n="cam_front">Front</button>`, `<button id="preview-btn-top" class="btn preview-hud-btn" data-i18n="cam_top">Top</button>`, `<button id="preview-btn-iso" class="btn preview-hud-btn" data-i18n="cam_iso">Iso</button>`
  - Polar Angle HUD readout: `<div id="preview-angle-hud" class="preview-angle-hud"></div>`

---

### 2. Viewport Styling & Glassmorphism Design System

#### [MODIFY] [style.css](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/style.css)
- Define `.settings-preview-container`:
  - `position: relative; width: 100%; height: 180px; border-radius: 8px; border: 1px solid rgba(230, 126, 34, 0.4); background: rgba(0, 0, 0, 0.4); overflow: hidden; margin-bottom: 12px;`
- Define `.settings-preview-canvas`:
  - `width: 100%; height: 100%; display: block;`
- Define `.preview-angle-hud`:
  - `position: absolute; top: 6px; left: 8px; font-size: 10px; font-family: monospace; color: #f39c12; background: rgba(0, 0, 0, 0.6); padding: 2px 6px; border-radius: 4px; pointer-events: none;`
- Define `.preview-hud-controls`:
  - `position: absolute; bottom: 6px; right: 8px; display: flex; gap: 4px; z-index: 10;`

---

### 3. Dual-Viewport WebGL Rendering & Spotlight Visualizer Engine

#### [MODIFY] [renderer.js](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/renderer.js)
- **Preview Engine Initialization**:
  - Instantiate `previewRenderer`, `previewCamera` (`THREE.PerspectiveCamera(45, width/height, 0.1, 100)`), and `previewControls` (OrbitControls for preview canvas).
- **Synchronized Render Loop**:
  - In `animate()`, check if `isSettingsOpen` is true and `#settings-preview-container` is visible.
  - Execute `previewRenderer.render(scene, previewCamera)`.
- **Spotlight Polar Coordinate Visualizer**:
  - Update spotlight light positions and helper frustums in real time based on angles:
    $$\text{radH} = \text{angleH} \times \frac{\pi}{180}, \quad \text{radV} = \text{angleV} \times \frac{\pi}{180}$$
    $$X = R \cdot \cos(\text{radV}) \cdot \cos(\text{radH})$$
    $$Y = R \cdot \sin(\text{radV})$$
    $$Z = R \cdot \cos(\text{radV}) \cdot \sin(\text{radH})$$
- **Live Angle HUD Badge Updater**:
  - `updatePreviewHUD()` formats active spotlight horizontal angle, vertical angle, and cone spread into formatted HUD overlay text.

---

### 4. Locale Dictionary Key Parity Across 31 Languages

#### [MODIFY] [scratch_create_locales.js](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/scratch_create_locales.js)
- Add preview viewport localization keys to the master English dictionary (`newTranslations["en"]`):
  - `preview_title`: "3D Asset & Lighting Viewport"
  - `preview_reset_cam`: "Reset Preview Camera"
  - `toggle_helpers`: "Toggle Spotlight Rays & Frustums"
  - `cam_front`: "Front"
  - `cam_top`: "Top"
  - `cam_iso`: "Isometric"
  - `spotlight_hud`: "Light #{{id}}: H:{{h}}° V:{{v}}° Cone:{{cone}}°"
- Run automated locale generator `node scratch_create_locales.js` to propagate all preview keys to all 31 supported locale files under `locales/`.

---

## Verification & Quality Plan

### Automated Verification
1. Run `node scratch_create_locales.js` to ensure all 31 `translation.json` files contain the new preview viewport keys with 100% key parity.
2. Verify JS build syntax with `npx eslint` or node execution checks.

### Manual Verification
1. Launch application via `npm start` or standalone executable.
2. Open Settings Panel ➔ Navigate to **Lighting Tab**.
3. Confirm 3D Asset Preview Viewport renders the active 3D mascot model smoothly inside the Settings Panel.
4. Drag horizontal angle slider (`angleH`), vertical angle slider (`angleV`), and cone slider (`cone`).
5. Confirm spotlight light beam frustums, position vectors, and shading on the 3D mascot adjust live in real-time in the preview canvas.
6. Click camera view preset buttons (Front, Top, Isometric) and verify preview camera repositions cleanly.
7. Switch system language to German, Japanese, Spanish, Simplified Chinese, Arabic, Korean, etc., and verify all viewport labels and HUD badges re-translate seamlessly.
