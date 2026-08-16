/**
 * Render Loop & Preview Viewport Delegates Module (<70 lines)
 * Encapsulates Three.js animation frame rendering, FPS camera WASD updates, spatial grid HUD toggles, and offscreen preview viewport rendering.
 */

export function createRenderLoopDelegates(deps) {
  const {
    clock,
    THREE,
    updateAnimationFrameUtil,
    updateFPSCameraUtil,
    updateXYZVisibilityUtil,
    previewViewportEngine,
    getContext
  } = deps;

  const animate = () => {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    const now = Date.now();

    const ctx = getContext();
    updateAnimationFrameUtil({
      delta,
      elapsed,
      now,
      THREE,
      ...ctx
    });
  };

  const updateFPSCamera = (delta) => {
    const ctx = getContext();
    updateFPSCameraUtil({
      currentSettings: ctx.currentSettings,
      camera: ctx.camera,
      THREE,
      keys: ctx.keys,
      delta
    });
  };

  const updateXYZVisibility = () => {
    const ctx = getContext();
    updateXYZVisibilityUtil({
      axesHelper: ctx.axesHelper,
      gridHelper: ctx.gridHelper,
      currentSettings: ctx.currentSettings,
      isSettingsOpen: ctx.isSettingsOpen,
      renderer: ctx.renderer,
      isMouseOverCharacter: ctx.isMouseOverCharacter
    });
  };

  const initPreviewViewport = () => {
    previewViewportEngine.initPreviewViewport();
  };

  const renderPreviewViewport = () => {
    const ctx = getContext();
    previewViewportEngine.renderPreviewViewport({
      isSettingsOpen: ctx.isSettingsOpen,
      scene: ctx.scene,
      stageSpotLightHelpers: ctx.stageSpotLightHelpers,
      currentSettings: ctx.currentSettings,
      t: ctx.t
    });
  };

  return {
    animate,
    updateFPSCamera,
    updateXYZVisibility,
    initPreviewViewport,
    renderPreviewViewport
  };
}
