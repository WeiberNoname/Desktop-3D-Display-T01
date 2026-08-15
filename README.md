# 3D Desktop Mascot Pet 🐰

A borderless, transparent, interactive 3D desktop companion pet for Windows powered by **Electron**, **Three.js**, and **i18next**.

> 📖 **Full User Manual:** For complete guides on controls, custom 3D model loading, FPS camera flight, physics throwing, stage spotlights, and 31-language setup, please see **[USER_MANUAL.md](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T01%20V1/USER_MANUAL.md)**.

---

## 🛠️ How to Rebuild Executable from GitHub Repository

Follow these step-by-step instructions to clone, set up dependencies, run tests, and compile the standalone Windows executable from the source code.

### 1. System Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Git**: ([Download Git](https://git-scm.com/))
- **Windows OS**: Windows 10 or 11 (x64)

---

### 2. Clone the Repository
Open Command Prompt (`cmd`) or Terminal and clone the repository:
```bash
git clone https://github.com/your-username/desktop-3d-pet.git
cd desktop-3d-pet
```

---

### 3. Install Dependencies
Install all required Node modules (`three`, `i18next`, `@skyatnpm/steamworks-js`, `electron`, `electron-packager`):
```bash
npm install
```

---

## 🌐 Language Localization Prerequisites & Setup

Desktop Pet uses **i18next** to support **31 international languages** natively across all UI controls, studio tabs, 3D preview viewports, and HUD badges.

### 1. Localization Prerequisites
- **`i18next` Package**: Installed automatically during `npm install` (`"i18next": "^26.3.6"` in `package.json`).
- **Locale Folder Structure**: The application expects translation files in `locales/<lang-code>/translation.json`.

### 2. Generating & Building Locale Files (Mandatory)
Before starting the dev server or packaging the application executable, you **must run the locale generator script**:
```bash
node scratch_create_locales.js
```
This script performs a 100% key parity build across all 31 supported language codes:
- Creates `locales/<lang>/translation.json` for all 31 languages.
- Ensures all **95 UI keys** exist in every language dictionary with fallback protection to guarantee no missing text errors.

### 3. Supported Languages Scope (31 Locales)
| Language Code | Language Name |
| :--- | :--- |
| `en` | English |
| `zh-CN` | 简体中文 (Simplified Chinese) |
| `zh-TW` | 繁體中文 (Traditional Chinese) |
| `ja` | 日本語 (Japanese) |
| `ko` | 한국어 (Korean) |
| `fr` | Français (French) |
| `de` | Deutsch (German) |
| `es` | Español - España (Spanish - Spain) |
| `es-419` | Español - Latinoamérica (Spanish - Latin America) |
| `it` | Italiano (Italian) |
| `pt-BR` | Português - Brasil (Portuguese - Brazil) |
| `pt-PT` | Português - Portugal (Portuguese - Portugal) |
| `ru` | Русский (Russian) |
| `uk` | Українська (Ukrainian) |
| `pl` | Polski (Polish) |
| `tr` | Türkçe (Turkish) |
| `vi` | Tiếng Việt (Vietnamese) |
| `ar` | العربية (Arabic) |
| `bg` | Български (Bulgarian) |
| `cs` | Čeština (Czech) |
| `da` | Dansk (Danish) |
| `nl` | Nederlands (Dutch) |
| `fi` | Suomi (Finnish) |
| `el` | Ελληνικά (Greek) |
| `hu` | Magyar (Hungarian) |
| `id` | Bahasa Indonesia (Indonesian) |
| `ms` | Bahasa Melayu (Malay) |
| `no` | Norsk (Norwegian) |
| `ro` | Română (Romanian) |
| `sv` | Svenska (Swedish) |
| `th` | ไทย (Thai) |

### 4. Adding or Updating Custom Translations
If you add new UI elements or want to edit existing translations:
1. Open `scratch_create_locales.js`.
2. Add or modify translation keys inside `newTranslations`.
3. Run `node scratch_create_locales.js` to propagate the changes to all 31 `translation.json` files.
4. Rebuild the app binary with `npm run build`.

---

## 🚀 Running, Testing & Packaging

### 1. Run & Test in Development Mode
Launch the application in development mode:
```bash
npm start
```
To run the automated unit test suite (SettingsManager & PhysicsEngine tests):
```bash
npm test
```

### 2. Build Standalone Production Executable
To package the app into a standalone Windows executable binary (`DesktopPet.exe` inside `DesktopPet-win32-x64/`):
```bash
npm run build
```

Alternatively, if building directly via Command Prompt:
```cmd
npx electron-packager . DesktopPet --platform=win32 --arch=x64 --overwrite
```

---

### ⚠️ PowerShell Build Troubleshooting

If running `npm run build` inside PowerShell returns an execution policy restriction error:
> *npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.*

**Solution Option A (Recommended):** Use standard Windows Command Prompt (`cmd`):
```cmd
cmd /c npm run build
```

**Solution Option B:** Temporarily bypass script execution policy in PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm run build
```

---

## 📁 Output Build Artifacts

After running `npm run build`, the production output will be generated at:
```
DesktopPet-win32-x64/
  ├── DesktopPet.exe         <-- Standalone executable
  ├── resources/app/         <-- Bundled source code & assets
  ├── steam_appid.txt        <-- Steam integration configuration
  └── ...
```
Double-click `DesktopPet.exe` to launch the standalone application!
