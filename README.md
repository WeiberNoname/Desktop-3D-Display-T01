<img width="400" height="236" alt="Recording 2026-07-04 002226" src="https://github.com/user-attachments/assets/ec017b5e-f488-409f-ae98-e225e1fadb53" />


# 3D Transparent Desktop Mascot Pet 🐰 (V7.1)

A floating, borderless, fully transparent (RGBA 0,0,0,0) 3D interactive companion pet application for Windows, powered by **Electron**, **Three.js (WebGL)**, and **i18next**.

The mascot floats on top of your working windows, bobbing gently. It captures clicks and drags when hovered directly, and passes clicks straight through to the applications underneath when clicking in transparent areas.

---

## 🚀 How to Run the App

> [!IMPORTANT]
> If the Steam app is not logged in yet, the Steam overlay will not appear on the screen (the app automatically operates using offline fallback mode).

### Option A: Standalone Executable (No Setup Required)
Perfect for instant use without running terminal commands.

1. Open **File Explorer** and navigate to:
   [DesktopPet-win32-x64](file:///C:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/DesktopPet-win32-x64)
2. Double-click **`DesktopPet.exe`** to start your pet mascot.

> [!TIP]
> Right-click `DesktopPet.exe` ➔ *Send to* ➔ *Desktop (create shortcut)* to launch it directly from your desktop.

---

### Option B: Local Development & GitHub Reproduction
Ideal if you download the source code from GitHub to inspect, debug, or extend the app.

1. Ensure [Node.js](https://nodejs.org) is installed.
2. Open terminal and navigate to the project directory:
   ```bash
   cd "C:\Users\space\.gemini\antigravity-ide\scratch\Desktop-3D-Display-T01 V1"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. **Generate multi-language (i18n) dictionaries (Crucial Step):**
   ```bash
   node scratch_create_locales.js
   ```
   > [!IMPORTANT]
   > Running `node scratch_create_locales.js` populates all 31 language folders inside [locales/](file:///c:/Users/space/.gemini/antigravity-ide/scratch/desktop%20pet%20V7.1/locales) (e.g., `locales/en/translation.json`). Running `npm install` alone is not enough; this step is required for language switching to work.

5. Start the dev app:
   ```bash
   npm start
   ```
6. Recompile the production executable after modifying code:
   ```bash
   npm run build
   ```

### ⚠️ PowerShell Build Troubleshooting
If running `npm run build` in PowerShell returns an execution policy restriction error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```
Or build directly using standard Windows Command Prompt (`cmd`).

---

## 🌍 Multi-Language (i18n) Support (31 Languages)

Desktop Pet V7.1 includes an enterprise-grade internationalization system built on the **i18next framework**. The application automatically detects your operating system locale or allows you to select any of the **31 supported languages** directly from the Settings Panel:

| Region / Scope | Supported Languages & Locales |
| :--- | :--- |
| **Americas & Europe** | English (`en`), French (`fr`), Italian (`it`), German (`de`), Spanish - Spain (`es`), Spanish - Latin America (`es-419`), Portuguese - Brazil (`pt-BR`), Portuguese - Portugal (`pt-PT`), Dutch (`nl`), Danish (`da`), Finnish (`fi`), Norwegian (`no`), Swedish (`sv`) |
| **Eastern Europe & Eurasia** | Russian (`ru`), Ukrainian (`uk`), Polish (`pl`), Czech (`cs`), Hungarian (`hu`), Bulgarian (`bg`), Romanian (`ro`), Greek (`el`), Turkish (`tr`) |
| **Asia & Middle East** | Simplified Chinese (`zh-CN`), Traditional Chinese (`zh-TW`), Japanese (`ja`), Korean (`ko`), Vietnamese (`vi`), Thai (`th`), Bahasa Indonesia (`id`), Bahasa Melayu (`ms`), Arabic (`ar`) |

* **Dynamic Locale Switching**: Changing the language instantly updates all panel headers, labels, view control guides, and diagnostics buttons without restarting.
* **Global Typography Fallbacks**: Integrated CJK font stacks (`PingFang SC`, `Hiragino Sans`, `Meiryo`, `Malgun Gothic`, `Noto Sans CJK`) and RTL styling for seamless international text rendering.
* **Editing & Adding Languages**: Edit JSON dictionary files directly in [locales/](file:///c:/Users/space/.gemini/antigravity-ide/scratch/desktop%20pet%20V7.1/locales) and register new locale codes in `SUPPORTED_LANGUAGES` inside [i18nManager.js](file:///c:/Users/space/.gemini/antigravity-ide/scratch/desktop%20pet%20V7.1/i18nManager.js). Run `node scratch_create_locales.js` to refresh dictionary files.

---

## 🕹️ Controls & Interaction Guide

| Mouse / Key Action | Target | Description |
| :--- | :--- | :--- |
| **Hover** | Over character | Cursor changes to a pointer, enabling interaction and showing quick controls. |
| **Hover ➔ Click ⚙️** | Top edge | Toggles (Opens or Closes) the glassmorphic Settings Panel. |
| **Hover ➔ Click ✖** | Beside ⚙️ Button | **Close Application:** Safely exits and quits the application window instantly. |
| **Left Click** | On character | Procedural mascot: plays jump and spin. Custom models: plays animation loop at accelerated speed. |
| **Left Click + Drag** | On character / Quick Buttons / Panel | Smoothly repositions the mascot window anywhere on your monitor(s). |
| **Ctrl + Shift + F** | Globally | Toggles **First-Person Camera Perspective Mode** (WASD + Mouse 360° look). |
| **Mouse Movement (in FPS Mode)** | Viewport | **360° Pointer Lock Mouse Look:** Transparent cursor locked at center to aim view smoothly in all directions. |
| **W / A / S / D** | In FPS Mode | **FPS Movement:** Move camera forward (`W`), backward (`S`), strafe left (`A`), strafe right (`D`). |
| **Space / Shift** | In FPS Mode | **Vertical Flight:** Fly UP (`Space`) or DOWN (`Shift`) along Y axis in 3D space. |
| **ESC Key** | In FPS Mode | **Exit FPS Mode:** Releases pointer lock, restores OS cursor, and exits FPS mode. |
| **Ctrl + Shift + C** | Globally | Toggles live **Spatial XYZ Coordinates HUD** display overlay. |
| **Alt + Left-Drag** (or MMB-Drag) | Anywhere | **Orbit View (3D Rotate):** Changes the 3D view perspective, rotating the pet. |
| **Shift + Left-Drag** | Anywhere | **Pan View (3D Translate):** Moves the pet model up/down and left/right inside the canvas boundaries. |
| **Scroll Wheel** (or Ctrl + Left-Drag) | Anywhere | **Zoom View (3D Scale/Depth):** Moves the pet model closer or further away. |
| **Alt + Double-Click** | On mascot | **Reset View:** Instantly centers and resets the model's 3D orientation back to default. |
| **Click** | Outside character | Passed through to the folders, IDE, or browser behind the window. |
| **Ctrl + V** | Globally | Toggles **View Only Mode** on/off (only active when not typing inside input fields). |

---

## 🎥 First-Person Perspective (FPS) & Spatial XYZ Coordinates (Plan 001)

Desktop Pet includes an advanced **First-Person Perspective Camera Engine** and spatial tracking system:

* **Pointer Lock 360° Mouse Look**: Entering FPS mode (`Ctrl + Shift + F` or via Settings) locks the pointer to the canvas center, hides the mouse cursor (`cursor: none`), and activates a centered **`+` crosshair target overlay**. Mouse movements provide infinite, smooth 360-degree look rotation without reaching display edges.
* **3D Flight Controls**: Navigate the 3D environment seamlessly using `WASD` for planar movement and `Space` / `Shift` for vertical elevation flight.
* **Instant Exit via `ESC`**: Press `ESC` at any time to release pointer lock and return to default mascot mode.
* **Spatial XYZ Coordinates HUD**: Live glassmorphism badge overlay displaying real-time **Camera/Mascot Position `(X, Y, Z)`** and **Rotation `(RX, RY, RZ)`**.
* **3D Ground Spatial Grid**: Enable/disable ground reference spatial grid for spatial depth perspective.
* **Reset Camera & Position Button**: One-click reset button in Settings Panel (`Reset Camera & Position 🔄`) to instantly restore camera `(0, 0, 5.5)` and mascot origin.

---

## 💡 Customize with Your Own 3D Models (Frictionless Import)

The app automatically detects, centers, and displays any 3D asset:

* **Drag-and-Drop Loader**: Simply drag any `.glb` or `.gltf` file directly from Windows Explorer and drop it onto the pet's window. The app will automatically copy the file into the `assets/` folder and load it immediately.
* **Auto-Grounding**: Bounding boxes are calculated automatically to scale the mascot and anchor its feet flush with the taskbar, preventing floating or clipping.
* **Auto-Animation Mapping**: Inspects animation clips and automatically maps idle tracks (`"idle"`, `"stay"`, `"breathe"`) and click reactions (`"jump"`, `"spin"`, `"click"`, `"react"`).

Alternatively, you can manually manage models:
1. Locate the **`assets/`** folder:
   - Development path: [assets/](file:///C:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/assets)
   - Executable path: [DesktopPet-win32-x64/assets/](file:///C:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/DesktopPet-win32-x64/resources/app/assets)
2. Drop any **`.glb`** or **`.gltf`** model file into this directory.
3. Reload or select it inside the Settings Panel.
4. **Fallback:** If you empty the `assets/` folder, the application immediately falls back to rendering the default pink bunny mascot.

---

## ⚙️ Interactive Settings Panel

1. **How to Enable:** Place a text file named **`settings`** (or `settings.txt`) in your `assets/` folder. (Automatically created on first launch).
2. **Accessing the Panel:** Hover your mouse cursor over the mascot. Quick buttons `⚙️` (Settings) and `✖` (Close App) will appear. Click `⚙️` to toggle the Settings Panel open or closed.
3. **Editable Settings:**
   - **Language**: Select your preferred interface language from **31 international options**.
   - **Enable First-Person Camera Mode**: Toggle WASD 3D flight & 360-degree pointer lock camera aiming (`Ctrl + Shift + F`).
   - **Enable XYZ Coordinates Display**: Show live spatial position & rotation readout HUD badge (`Ctrl + Shift + C`).
   - **Show 3D Ground Spatial Grid**: Toggle ground level reference spatial grid.
   - **Reset Camera & Position Button**: One-click reset to default camera `(0, 0, 5.5)` and mascot origin.
   - **Active Mascot**: Select between default procedural bunny and custom models dropped in the `assets/` folder.
   - **Active Animation**: Lists and plays embedded animation clips, plus a **None (Static Pose)** option.
   - **Window Width & Height:** Adjust window dimensions from **30px** up to full monitor resolution.
   - **Model Scale:** Zoom/scale 3D character from **0.10x** to **5.00x** with **0.01** step precision.
   - **Panel Text Size:** Scalable slider from **0.80x** to **2.00x** to dynamically resize settings panel typography.
   - **Enable Idle Bobbing:** Toggle the slow floating vertical idle animation.
   - **View Only Mode**: Enable transparency on hover (`Ctrl + V`). The pet fades to fully transparent when mouse enters area.
   - **Lock Mascot Position**: Freeze window coordinates to prevent accidental dragging.
   - **Force High-Performance GPU:** Request discrete high-speed graphics card. *(Requires restart)*.
   - **Seamless Performance Mode**: Toggle between Seamless Mode (throttled proxy raycasting) and Precise Mode.
   - **Place Settings Icon on Left**: Shift quick buttons `⚙️` and `✖` position to top-left margin.
   - **Axis Spinning (X, Y, and Z):** Enable continuous rotation spinning on X, Y, and Z axes with independent speed sliders.

---

## ⚡ Performance & Clean Architecture Notes (V7.1 Refactoring)

* **Clean Steam Overlay Publishing Baseline**: Steam achievement system purged to eliminate unused API overhead and prevent partner dashboard configuration mismatch.
* **Steam Overlay Input Focus Resolution**: Clears background polling timers (`edgeCheckInterval`) and releases `alwaysOnTop` window layer locks when Steam Overlay activates, guaranteeing 100% click responsiveness on overlay controls.
* **Central Diagnostics Console**: System alerts and config recovery messages output directly to the collapsible Diagnostics Console (`assets/diagnostics.log`), keeping the visual canvas unobstructed.

---

## 🛡️ Robustness & Troubleshooting

* **Sub-Viewport Canvas Margins**: 10px padding constraint on HTML container with DOM target validation (`event.target.tagName !== 'CANVAS'`) in [renderer.js](file:///C:/Users/space/.gemini/antigravity-ide/scratch/desktop%20pet%20V7.1/renderer.js) to instantly reset hover states and clear click-through.
* **Main Process Edge Check Polling**: 100ms interval query in [main.js](file:///C:/Users/space/.gemini/antigravity-ide/scratch/desktop%20pet%20V7.1/main.js) checking cursor positions and forcing hover exits when crossing boundaries.
* **Atomic Settings Staging**: Atomic writes via temporary file staging and synchronous renaming in [renderer.js](file:///C:/Users/space/.gemini/antigravity-ide/scratch/desktop%20pet%20V7.1/renderer.js) to prevent settings file corruption during unexpected shutdowns.
