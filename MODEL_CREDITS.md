# 3D Model Credits

This project uses free public-domain (CC0) GLB assets from Innerscene's public 3D Parts Library as optional realistic furniture models.

- Sofa: Lowline - Low Three-Seat Sofa — CC0, textured/PBR, real-world scale.
- Coffee table: TRIO - Nesting Coffee Table Set — CC0, textured/PBR, real-world scale.
- Rug: Rug rectangle — CC0.
- Plant: Anthurium shrubs — CC0, photoreal PBR model from Poly Haven.
- TV: Television modern — CC0.
- Dining table: Wooden table — CC0, photoreal PBR model from Poly Haven.

The application keeps simple procedural furniture as a fallback if a remote model is unavailable.

The models are loaded from the source library at runtime rather than bundled into the repository, which keeps the GitHub Pages repository smaller. For a completely offline deployment, download the cited GLB files and place them under `assets/models/`, then change `MODEL_URLS` in `ar-scene.html` to the local paths.
