/**
 * Diagnostics & Utility Controls Module (<100 lines)
 * Encapsulates diagnostic logs console reading, log clearing, Steam stats reset, and camera reset UI listeners.
 */

export function setupDiagnosticsUI({ ipcRenderer, showSpeechBubble, resetCameraAndPosition }) {
  const diagnosticsOutput = document.getElementById('diagnostics-log-output');
  const diagnosticsDetails = document.querySelector('.diagnostics-details');
  const refreshLogsBtn = document.getElementById('refresh-logs-btn');
  const clearLogsBtn = document.getElementById('clear-logs-btn');

  const loadDiagnosticsLogs = () => {
    if (diagnosticsOutput && ipcRenderer) {
      const logs = ipcRenderer.sendSync('get-diagnostic-logs');
      diagnosticsOutput.textContent = logs;
      diagnosticsOutput.scrollTop = diagnosticsOutput.scrollHeight;
    }
  };

  if (diagnosticsDetails) {
    diagnosticsDetails.addEventListener('toggle', () => {
      if (diagnosticsDetails.open) loadDiagnosticsLogs();
    });
  }

  if (refreshLogsBtn) {
    refreshLogsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loadDiagnosticsLogs();
    });
  }

  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (ipcRenderer && ipcRenderer.sendSync('clear-diagnostic-logs')) loadDiagnosticsLogs();
    });
  }

  const resetSteamStatsBtn = document.getElementById('reset-steam-stats-btn');
  if (resetSteamStatsBtn) {
    resetSteamStatsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const success = ipcRenderer && ipcRenderer.sendSync('reset-steam-stats');
      loadDiagnosticsLogs();
      if (success) {
        if (showSpeechBubble) showSpeechBubble("🧹 Steam Cloud stats & achievements reset!", 4000);
      } else {
        if (showSpeechBubble) showSpeechBubble("⚠️ Reset requested (Check Steam console).", 4000);
      }
    });
  }

  const resetCameraBtn = document.getElementById('reset-camera-btn');
  if (resetCameraBtn) {
    resetCameraBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resetCameraAndPosition) resetCameraAndPosition();
      if (showSpeechBubble) showSpeechBubble("Camera & Position reset to initial state! 🔄", 2500);
    });
  }
}
