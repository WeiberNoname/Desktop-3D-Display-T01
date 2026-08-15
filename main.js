const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

const Logger = require('./src/main/Logger.js');
const SteamService = require('./src/main/SteamService.js');

function getAssetsPath() {
  return Logger.getAssetsPath();
}

function logDiagnostic(message) {
  Logger.logDiagnostic(message);
}

logDiagnostic('=== Application Session Started ===');

const isDevMode = process.argv.includes('--dev');
logDiagnostic(`Developer Mode active: ${isDevMode}`);

let isSteamOverlayActive = false;
let edgeCheckInterval = null;
const steamService = new SteamService();

steamService.initialize((active) => {
  isSteamOverlayActive = active;
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (active) {
      if (edgeCheckInterval) {
        clearInterval(edgeCheckInterval);
        edgeCheckInterval = null;
      }
      mainWindow.setAlwaysOnTop(false);
      mainWindow.setIgnoreMouseEvents(false);
      mainWindow.focus();
      mainWindow.setFullScreen(true);
      mainWindow.webContents.send('steam-overlay-active', true);
    } else {
      mainWindow.setFullScreen(false);
      mainWindow.setAlwaysOnTop(true);
      mainWindow.setIgnoreMouseEvents(true, { forward: true });
      mainWindow.webContents.send('steam-overlay-active', false);
    }
  }
});

let steamClient = steamService.getClient();

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  const winWidth = 350;
  const winHeight = 350;

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    // Position near the bottom-right of the primary screen, just above the taskbar
    x: screenWidth - winWidth - 50,
    y: screenHeight - winHeight - 50,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Start with click-through enabled (ignoring clicks) for transparent parts (unless in dev mode).
  // forward: true ensures mouse movements are still tracked inside the window.
  mainWindow.setIgnoreMouseEvents(!isDevMode, { forward: true });

  if (isDevMode) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    logDiagnostic('Developer mode: Detached DevTools window opened.');
  }

  // Repaint invalidator for Steam overlay rendering correctness
  mainWindow.steamworksRepaintInterval = setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (!mainWindow.webContents.isPainting()) {
        mainWindow.webContents.invalidate();
      }
    } else {
      clearInterval(mainWindow.steamworksRepaintInterval);
    }
  }, 1000 / 60);

  mainWindow.on('closed', function () {
    if (mainWindow && mainWindow.steamworksRepaintInterval) {
      clearInterval(mainWindow.steamworksRepaintInterval);
    }
    if (edgeCheckInterval) {
      clearInterval(edgeCheckInterval);
      edgeCheckInterval = null;
    }
    mainWindow = null;
  });
}

function shouldOptimizeGPU() {
  const assetsDir = getAssetsPath();
  const settingsFile = path.join(assetsDir, 'settings');
  const settingsTxtFile = path.join(assetsDir, 'settings.txt');
  let filePath = null;
  if (fs.existsSync(settingsFile)) filePath = settingsFile;
  else if (fs.existsSync(settingsTxtFile)) filePath = settingsTxtFile;
  
  if (filePath && fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n');
      let optimize = true; // Default to true if not specified
      lines.forEach(line => {
        const parts = line.split('=');
        if (parts.length === 2 && parts[0].trim() === 'gpuOptimize') {
          optimize = (parts[1].trim() !== 'false');
        }
      });
      return optimize;
    } catch (e) {
      console.error('Error reading settings in main:', e);
    }
  }
  return true; // Default to true if file missing
}

// Disable GPU occlusion tracking to prevent chromium from suspending rendering
// when window overlaps with other apps
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows', 'true');

// Conditionally append GPU optimizations based on user preference config
if (shouldOptimizeGPU()) {
  // Force Electron to request the high-performance dedicated GPU (discrete graphics)
  app.commandLine.appendSwitch('force-high-performance-gpu', 'true');

  // Bypass Chromium driver blocklists to ensure hardware acceleration is active
  app.commandLine.appendSwitch('ignore-gpu-blocklist', 'true');
}

// Disable automatic DPI scaling to prevent window enlarging/shrinking when dragging across monitors
app.commandLine.appendSwitch('force-device-scale-factor', '1');

// Steam Overlay hooks for Electron
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('disable-direct-composition');

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (steamClient && steamClient.isInitialized) {
    steamClient.shutdown();
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// IPC handler to toggle mouse click-through capability
ipcMain.on('set-ignore-mouse', (event, ignore) => {
  if (isSteamOverlayActive) return; // Prevent renderer from overriding active overlay focus
  if (mainWindow) {
    const finalIgnore = isDevMode ? false : ignore;
    mainWindow.setIgnoreMouseEvents(finalIgnore, { forward: true });

    // Active polling fallback: check if cursor is outside window boundaries when click-through is enabled
    if (finalIgnore) {
      if (!edgeCheckInterval) {
        edgeCheckInterval = setInterval(() => {
          if (!mainWindow || mainWindow.isDestroyed()) {
            clearInterval(edgeCheckInterval);
            edgeCheckInterval = null;
            return;
          }
          const { x, y } = screen.getCursorScreenPoint();
          const bounds = mainWindow.getBounds();

          const isOutside = x < bounds.x || x > bounds.x + bounds.width ||
                            y < bounds.y || y > bounds.y + bounds.height;

          if (isOutside) {
            mainWindow.setIgnoreMouseEvents(false);
            mainWindow.webContents.send('force-hover-exit');
            clearInterval(edgeCheckInterval);
            edgeCheckInterval = null;
          }
        }, 100);
      }
    } else {
      if (edgeCheckInterval) {
        clearInterval(edgeCheckInterval);
        edgeCheckInterval = null;
      }
    }
  }
});

// IPC handler to return the assets path synchronously
ipcMain.on('get-assets-path', (event) => {
  event.returnValue = getAssetsPath();
});

// IPC handler to move the window when dragging the character
ipcMain.on('move-window', (event, delta) => {
  if (mainWindow) {
    const [x, y] = mainWindow.getPosition();
    mainWindow.setPosition(Math.round(x + delta.x), Math.round(y + delta.y));
  }
});

// IPC handler to dynamically resize the window based on 3D asset dimensions
ipcMain.on('resize-window', (event, size) => {
  if (mainWindow) {
    const [x, y] = mainWindow.getPosition();
    const [w, h] = mainWindow.getSize();
    const deltaW = Math.round(size.width - w);
    const deltaH = Math.round(size.height - h);
    
    // Adjust position coordinates by the size delta so the bottom-right corner stays anchored
    mainWindow.setBounds({
      x: Math.round(x - deltaW),
      y: Math.round(y - deltaH),
      width: Math.round(size.width),
      height: Math.round(size.height)
    });
  }
});


// IPC handler to return absolute diagnostic log contents
ipcMain.on('get-diagnostic-logs', (event) => {
  try {
    const diagnosticsLogPath = path.join(getAssetsPath(), 'diagnostics.log');
    if (fs.existsSync(diagnosticsLogPath)) {
      event.returnValue = fs.readFileSync(diagnosticsLogPath, 'utf8');
    } else {
      event.returnValue = 'No diagnostic logs found.';
    }
  } catch (e) {
    event.returnValue = `Error reading diagnostics log: ${e.message}`;
  }
});

// IPC handler to clear diagnostics log
ipcMain.on('clear-diagnostic-logs', (event) => {
  try {
    const diagnosticsLogPath = path.join(getAssetsPath(), 'diagnostics.log');
    fs.writeFileSync(diagnosticsLogPath, `[${new Date().toISOString()}] Diagnostics cleared.\n`, 'utf8');
    event.returnValue = true;
  } catch (e) {
    event.returnValue = false;
  }
});

// IPC handler to query developer mode status
ipcMain.on('is-dev-mode', (event) => {
  event.returnValue = isDevMode;
});

// IPC handler for renderer diagnostics logging
ipcMain.on('log-diagnostic', (event, message) => {
  logDiagnostic(message);
});

// IPC handler to close the application cleanly
ipcMain.on('close-app', () => {
  logDiagnostic('Close application requested via UI close button.');
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  } else {
    app.quit();
  }
});

// Developer utility: IPC handler to reset Steam user stats/achievements for testing
ipcMain.on('reset-steam-stats', (event) => {
  if (steamClient && steamClient.isInitialized && steamClient.userStats && typeof steamClient.userStats.resetAllStats === 'function') {
    try {
      steamClient.userStats.resetAllStats(true);
      if (typeof steamClient.userStats.storeStats === 'function') {
        steamClient.userStats.storeStats();
      }
      logDiagnostic('[Steam Dev Utility] Successfully triggered resetAllStats(true) on Steam Cloud.');
      event.returnValue = true;
    } catch (err) {
      logDiagnostic(`[Steam Dev Utility] Error resetting stats: ${err.message || err}`);
      event.returnValue = false;
    }
  } else {
    logDiagnostic('[Steam Dev Utility] resetAllStats not available on current steamClient.');
    event.returnValue = false;
  }
});


