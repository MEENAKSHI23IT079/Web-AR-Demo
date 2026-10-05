# AR Home Interior Designer

A mobile-first augmented reality home interior design demo built from the original A-Frame + MindAR starter.

## What changed

- Added a **rule-based interior design recommendation engine**.
- User selects room, style, budget, room size and accent colour.
- The logic generates a furniture plan, estimated budget and design tips.
- Added a **WebXR AR interior mode** that detects a floor/surface and lets the user place furniture.
- Furniture is generated from lightweight A-Frame primitives, so no extra 3D asset pack is required for the demo.
- Added controls to choose furniture, rotate, resize, move, reset and remove items.
- Kept the original MindAR image-tracking scene and project structure as a fallback/reference.

## Logic used in the project

1. Room type selects the essential furniture set.
2. Room size decides whether optional furniture should be added.
3. Style changes the colour palette and estimated cost factor.
4. Budget acts as a constraint; optional items are removed if the estimated plan exceeds the selected budget.
5. The final plan is stored in `localStorage` and loaded by the AR scene.
6. WebXR hit-test finds a real-world surface; a tap places the selected furniture at that location.

This gives the project an explicit **input → decision logic → AR visualization** pipeline, which is useful for an academic demonstration.

## Run

Use a secure origin for camera/WebXR, for example GitHub Pages or localhost through a development server.

The main flow is:

`index.html` → choose design preferences → generate plan → `ar-scene.html?mode=free` → scan floor → place furniture.

## Browser note

Surface-placement AR requires WebXR AR support. Chrome on supported Android devices is the safest demo target. If a browser does not support WebXR hit-test, the original MindAR image-tracking mode remains in the project and can be opened by removing `?mode=free` from the scene URL.
