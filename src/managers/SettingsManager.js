export class SettingsManager {
  static getDefaultSettings() {
    return {
      width: 350,
      height: 350,
      scale: 1.0,
      bobbing: true,
      spinX: false,
      spinY: false,
      spinZ: false,
      speedX: 1.0,
      speedY: 1.0,
      speedZ: 1.0,
      gpuOptimize: true,
      mouseOptimize: true,
      settingsLeft: false,
      lockPosition: false,
      viewOnly: false,
      enablePhysics: false,
      physicsGravity: 9.8,
      physicsElasticity: 0.7,
      physicsFloor: true,
      showXYZCoords: false,
      showGroundGrid: false,
      enableFPSMode: false,
      spotlights: [
        { id: 1, enabled: true, angleH: 45, angleV: 60, cone: 35, intensity: 2.0, color: '#ffffff' }
      ],
      enableStudioLights: true,
      ambientIntensity: 0.70,
      activeModel: 'procedural',
      activeAnimation: 'default',
      clickCount: 0,
      fontSizeScale: 1.0,
      language: 'en'
    };
  }

  static mergeWithDefaults(savedSettings) {
    const defaults = SettingsManager.getDefaultSettings();
    if (!savedSettings || typeof savedSettings !== 'object') {
      return defaults;
    }
    return Object.assign({}, defaults, savedSettings);
  }
}
