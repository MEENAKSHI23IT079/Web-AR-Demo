# Open AR Experience

An English-first, brand-neutral starter for building image-tracked AR on the web using A-Frame and MindAR. It includes a preload landing page, an AR scene with sensible controls, offline caching, and PWA metadata—ready to drop into GitHub Pages or any static host.

## What’s inside

- Landing entry at index.html with lightweight preload and camera permission gating.
- MindAR image-tracked scene (ar-scene.html) with rotate/zoom gestures, reset, help overlay, and optional free/WebXR mode.
- Service worker (sw.js) with versioned caches driven by version.json.
- PWA manifest, neutral icon (app-icon.svg), and responsive styles tuned for mobile.

## Tech stack

- A-Frame 1.5.0
- MindAR image tracking 1.2.5
- three.js loaders (GLTF, KTX2, Meshopt) for optimized model loading
- Progressive Web App basics (manifest + service worker)

## Project structure

- index.html — landing/preload entry point
- ar-scene.html — AR scene (MindAR + A-Frame)
- sw.js — service worker for offline/versioning
- manifest.json — PWA configuration and icons
- assets/
  - style.css, reset-button.css — styling
  - Gltf/model.glb — sample 3D model
  - Mind/targets.mind — sample marker set
  - img/Icon/app-icon.svg — app icon

## Run locally

1. Serve the folder with any static server (camera access on mobile requires HTTPS):

```sh
npx serve .
```

or use VS Code Live Server and open index.html.

2. On a mobile device, open the served URL, allow the camera, and start the AR scene.

## Customization guide

- Models: Replace assets/Gltf/model.glb. If you rename it, update the src references in ar-scene.html (MindAR) and the free-mode glTF loader.
- Markers: Swap assets/Mind/targets.mind with your MindAR-trained targets; keep the query string version for cache busting.
- Branding: Swap app-icon.svg and adjust landing copy in index.html.
- Colors/styles: Tweak assets/style.css and reset-button.css.
- Versioning: Keep version.json and the LOCAL_SITE_VERSION/SITE_VERSION constants (index.html, ar-scene.html, sw.js) in sync so cached assets refresh on deploy. Bump ?v=… query strings on heavy assets when they change.

## Controls (AR scene)

- Rotate: one-finger drag (horizontal = yaw, vertical = pitch)
- Zoom: two-finger pinch with smooth clamping
- Reset: restores the model’s initial pose/scale
- Play animation: triggers embedded glTF animations
- Help: in-app overlay with usage tips

## Service worker & updates

- Versioned cache name: open-ar-${SITE_VERSION} (see sw.js)
- Core assets cached on install; GLB/MIND fetched with cache-first + background refresh
- Clients receive SW_VERSION messages; new versions trigger skipWaiting when version.json changes

## Deployment

- Works on any static host (GitHub Pages included); all paths are relative for subfolder hosting.
- Always serve over HTTPS for camera access (localhost/LAN is allowed for development).

## Troubleshooting

- Camera blocked: ensure HTTPS and grant permission; iOS Safari requires secure origin.
- No model shown: check lighting, marker print quality, and that assets/Mind/targets.mind matches your marker.
- Stale assets: bump version.json and query-string versions, then reload to refresh caches.
