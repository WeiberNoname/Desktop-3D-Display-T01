# Plan 001: Z-Axis Model Spin Rotation via Ctrl + Drag Interaction

## Problem Statement & Architecture Goals

Currently in `InteractionManager.js`:
- **`Alt + Drag`** (or MMB without modifiers) performs 3D orbit rotation on the **X and Y axes** (`rotation.y += deltaX * 0.01` and `rotation.x += deltaY * 0.01`).
- **`Shift + Drag`** performs 2D viewport panning on **X and Y positions**.
- **`Ctrl + Drag`** currently controls depth translation (`position.z` zoom).

There is currently **no mouse interaction shortcut to spin/rotate the 3D mascot model around its Z-axis (Roll / Tilt Spin)**. Users must manually open the Settings Panel and adjust the Z-rotation slider.

This plan details 3 technical alternatives and proposes a recommended solution for enabling intuitive Z-axis spin rotation when holding `Ctrl` and dragging the mouse.

---

## 💡 Evaluation of 3 Alternatives

### Alternative 1: Direct Linear Horizontal Drag (`Ctrl + Horizontal Drag`)
* **Mechanism:** When holding `Ctrl` and left-clicking + dragging, horizontal mouse movement `deltaX` directly rotates the model around the Z-axis:
  $$\text{rotation.z} = \text{navStartRotationZ} + \Delta X \times 0.01$$
  Zooming is handled exclusively via the mouse scroll wheel (`wheel` event).
* **Pros:**
  * Clean, 1:1 linear mapping parallel to X/Y orbit rotation.
  * Computationally simple with minimal code changes.
* **Cons:**
  * Vertical mouse movement (`deltaY`) is ignored during Z-spin, which can feel less fluid.

---

### Alternative 2: Tangential Polar Arc "Steering Wheel" Angle Calculation (Recommended 🌟)
* **Mechanism:** When holding `Ctrl` and left-clicking + dragging, calculate the polar angle $\theta$ of the mouse cursor relative to the center of the mascot window $(C_x, C_y)$:
  $$\theta = \text{Math.atan2}(Y_{\text{cursor}} - C_y, X_{\text{cursor}} - C_x)$$
  As the mouse moves in an arc around the mascot center, $\text{rotation.z}$ updates dynamically to match the angular delta:
  $$\Delta \theta = \theta_{\text{current}} - \theta_{\text{start}}$$
  $$\text{rotation.z} = \text{navStartRotationZ} + \Delta \theta$$
* **Pros:**
  * **Extremely Natural Rotational Feel:** Dragging clockwise spins the mascot clockwise; dragging counter-clockwise spins it counter-clockwise (like turning a steering wheel or dial).
  * Smooth 360-degree continuous rotation on both X and Y mouse movements.
* **Cons:**
  * Requires calculating screen center coordinates $(C_x, C_y)$ on `mousedown`.

---

### Alternative 3: Dual-Modifier Combo (`Ctrl + Alt + Drag`)
* **Mechanism:** Retain `Ctrl + Drag` for depth zoom, and require holding `Ctrl + Alt + Drag` specifically to trigger Z-axis roll spin rotation.
* **Pros:**
  * Preserves existing `Ctrl + Drag` depth zoom behavior.
* **Cons:**
  * Requiring three simultaneous inputs (`Ctrl + Alt + Drag`) is clunky, unintuitive, and difficult on laptop trackpads.

---

## 🎯 Recommended Solution Architecture (Alternative 2)

We recommend **Alternative 2 (Tangential Polar Arc Rotation)**.

```
                    +---------------------------------------------------+
                    |         User holds Ctrl + Left-Click Drag         |
                    +---------------------------------------------------+
                                              |
                                              v
                    +---------------------------------------------------+
                    |   InteractionManager.js (mousedown event)         |
                    |   - Detect event.ctrlKey                          |
                    |   - Set navType = 'roll'                          |
                    |   - Compute center (Cx, Cy) & start angle theta_0 |
                    +---------------------------------------------------+
                                              |
                                              v
                    +---------------------------------------------------+
                    |   InteractionManager.js (mousemove event)         |
                    |   - Compute theta_current = atan2(y - Cy, x - Cx) |
                    |   - deltaTheta = theta_current - theta_0          |
                    |   - innerModelGroup.rotation.z = startZ + delta   |
                    +---------------------------------------------------+
                                              |
                                              v
                    +---------------------------------------------------+
                    |   Settings & UI Sync                              |
                    |   - Update currentSettings.rotZ                   |
                    |   - Sync rotZ slider in Motion Studio Tab         |
                    +---------------------------------------------------+
```

---

## 🛠️ Proposed File Changes

### 1. `InteractionManager.js`
#### [MODIFY] [InteractionManager.js](file:///c:/Users/space/.gemini/antigravity-ide/scratch/Desktop-3D-Display-T03/src/core/InteractionManager.js)
* In `mousedown`:
  * Detect `event.ctrlKey` as `isRoll` (or Z-Spin).
  * Calculate mascot center coordinates `(navCenterX, navCenterY)`.
  * Compute `navStartAngle = Math.atan2(event.clientY - navCenterY, event.clientX - navCenterX)`.
  * Store `navStartRotationZ = innerModelGroup.rotation.z`.
* In `mousemove`:
  * Handle `state.navType === 'roll'`:
    * `currentAngle = Math.atan2(event.clientY - navCenterY, event.clientX - navCenterX)`
    * `innerModelGroup.rotation.z = navStartRotationZ + (currentAngle - navStartAngle)`
    * Update `currentSettings.rotZ` and sync UI rotZ slider if visible.

---

## 🧪 Verification Plan

### Manual Verification
1. Run `npm start` to launch the application.
2. Hold **`Ctrl`** key and **Left-Click + Drag** the mouse around the mascot in a circular motion.
3. Verify that the 3D mascot model spins smoothly around its Z-axis (roll tilt) following the circular cursor path.
4. Open Settings Panel ➔ Motion Tab and confirm the Z-rotation slider updates smoothly in real time during the drag.
5. Verify that `Alt + Drag` still performs standard X/Y Orbit rotation and `Shift + Drag` performs X/Y Pan movement.
