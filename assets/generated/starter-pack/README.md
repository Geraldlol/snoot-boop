# Snoot Boop Starter Asset Pack

Generated May 1, 2026 as a first reusable art pack for the wuxia Snoot Boop rebuild.

## Files

- `snoot-icons-starter-sheet.png`: 12 item and currency icons in a 4x3 sheet.
- `snoot-masters-starter-sheet.png`: 6 cat sect master portrait busts in a 3x2 sheet.
- `snoot-backgrounds-starter-sheet.png`: 4 environment concepts in a 2x2 sheet.
- `snoot-ui-starter-sheet.png`: reusable panel, badge, divider, and ornament concepts.
- `sliced/`: individual PNG source crops kept for recropping and repaint passes.
- `runtime/`: optimized app-facing PNGs generated through the Game Studio sprite pipeline.
  - `runtime/icons/`: 128x128 HUD and navigation icons.
  - `runtime/masters/`: 256x256 master portraits.
  - `runtime/previews/`: contact sheets for quick asset review.
- `sliced/masters/flowing-river-strategist.png`: blue strategist Steve variant so every master has distinct portrait art.

## Wired In

- HUD and resource bars use optimized runtime icons.
- Master select uses optimized runtime portrait art and UI ornaments.
- Main game, dungeon, and result screens use generated environment backdrops.
- Key panels use generated UI texture crops as soft blended surfaces.

## Style Direction

- Cozy wuxia cat cultivation game art.
- Jade green, antique gold, crimson, parchment cream, and deep ink shadows.
- No labels or text baked into the images, so the sheets can be cropped and reused in UI.
