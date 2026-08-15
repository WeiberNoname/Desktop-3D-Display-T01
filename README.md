# 3D Desktop Mascot Pet 🐰

A borderless, transparent 3D desktop companion pet for Windows built with **Electron**, **Three.js**, and **i18next**.

> 📖 **Full User Manual:** For complete guides on controls, custom 3D model loading, FPS camera flight, physics throwing, stage spotlights, and 31-language setup, please see **[USER_MANUAL.md](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/USER_MANUAL.md)**.

---

## 🚀 Quick Launch & Build Instructions

### Run Standalone Executable
Double-click **[`DesktopPet.exe`](file:///C:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/DesktopPet-win32-x64/DesktopPet.exe)** inside `DesktopPet-win32-x64/`.

### Run & Rebuild from Source
```bash
# 1. Install dependencies
npm install

# 2. Generate 31 locale translation dictionaries (Required)
node scratch_create_locales.js

# 3. Start dev server
npm start

# 4. Rebuild production executable binary
npm run build
```

### ⚠️ PowerShell Build Troubleshooting
If running `npm run build` in PowerShell returns an execution policy restriction error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```
Or build directly using standard Windows Command Prompt (`cmd`).

