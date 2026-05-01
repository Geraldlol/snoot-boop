# Snoot Booper Next.js — UI/UX & Graphics Fix Prompt

Use this prompt in Claude Code to fix the visual and UX issues in the `snoot-booper-next/` React/Three.js game.

---

## Prompt

You are working on `snoot-booper-next/`, a React + Three.js (react-three-fiber) idle game. The game works functionally but has significant UI/UX and visual issues. Fix everything described below. Read the existing code before making changes — preserve all game logic and functionality.

### CRITICAL FIXES

**1. Fix black screen on 3D load (GameScreen.tsx line 78)**
- `<Suspense fallback={null}>` causes a blank black screen while the 3D scene loads
- Replace with a proper loading fallback — a centered loading spinner or "Loading Sanctuary..." text overlay with the game's jade green color (#50C878)
- Use an HTML div overlay that sits on top of the canvas area, not a 3D fallback

**2. Fix nav sidebar overflow (GameScreen.tsx lines 102-131)**
- There are 16+ nav buttons in a vertical column that overflow the screen height
- Wrap the nav button container in a scrollable div with `overflow-y-auto max-h-[calc(100vh-5rem)]`
- Add subtle scroll indicators (gradient fade at bottom when more buttons exist)
- Consider grouping related buttons: Core (Upgrades, Cats, Waifus), Combat (Techniques, Equipment, Crafting), Systems (Cultivation, Buildings, Prestige), Info (Achievements, Social, Daily, Lore), Fun (Cat-ino, Goose), Meta (Settings)
- Add small group labels (text-[9px] text-white/20 uppercase) between groups

**3. Fix side panel mobile responsiveness (GameScreen.tsx lines 134-213)**
- All panels use `w-96` (384px fixed) which breaks on mobile
- Change to `w-96 max-w-[calc(100vw-8rem)]` so panels shrink on small screens
- On screens < 768px, panels should be full-width overlay with a close button

### 3D MODEL IMPROVEMENTS

**4. Improve Cat3D model (components/three/cats/Cat3D.tsx)**
- The cats are ~15 plain box primitives that look very blocky
- Round the body: Replace the body `boxGeometry` with a slightly rounded shape — use `<RoundedBox>` from `@react-three/drei` (args: [0.5, 0.35, 0.7], radius: 0.08, smoothness: 4) for the body, head, and belly
- Add whiskers: 4 thin cylinders (radius 0.005, length 0.15) extending from the snoot area, 2 per side angled outward
- Improve eyes: Replace flat box eyes with small spheres (radius 0.04) with a glossy `meshPhysicalMaterial` (roughness: 0.1, metalness: 0.3) for a shiny look. Add small white sphere highlights (radius 0.015) offset slightly to simulate eye shine
- Add a subtle mouth: small curved line or tiny cylinder below the nose
- Improve tail: Replace cylinder with a series of 4-5 small spheres in a curved chain (catmull-rom path) for a more organic fluffy tail
- Add ear tufts: tiny sphere at inner ear tips for fluffiness
- Smooth the sleep transition: animate eyeScaleY with easing (use `THREE.MathUtils.lerp` with 0.1 factor instead of instant 0→1)
- Add purr vibration: when happiness > 70, add a very subtle rapid micro-shake (amplitude 0.003, frequency 15Hz) to the body
- Divine realm cats: Add a ring of small orbiting particles (4-6 tiny spheres orbiting the cat slowly)

**5. Improve Goose3D model (components/three/goose/Goose3D.tsx)**
- Replace boxy body with `<RoundedBox>` (radius: 0.1) or an elongated sphere
- Improve beak: Use a cone geometry (slightly larger, orange #FF8C00) instead of a box
- Add wing shapes: Two flattened boxes (0.3 x 0.02 x 0.2) on each side of the body, angled slightly
- Improve feet: Replace boxes with flat triangular shapes (use `extrudeGeometry` or wider, thinner boxes angled outward) in orange
- Improve waddle: Add Z-axis body tilt AND alternating leg movement during waddle, plus head bob forward/backward
- Add a "caught" reaction animation: When goose is booped, briefly flash white and play a scale-down bounce

**6. Improve Building3D models (components/three/buildings/Building3D.tsx)**
- Pagoda: Add slight roof overhang (each tier's roof should extend 0.1 beyond the walls) and upturned corners (small rotated boxes at roof edges)
- Garden: Add more flower spheres (6-8 instead of 3), vary colors, add a small fountain (stacked cylinders with a sphere on top)
- All buildings: Add a subtle float/bob animation (amplitude 0.02, speed 0.5) to make them feel alive
- Add a construction particle effect when a building is first placed (small rising dust particles for 2 seconds)

**7. Improve SanctuaryScene (components/three/sanctuary/SanctuaryScene.tsx)**
- Add fog: `<fog attach="fog" args={['#1a2a1a', 15, 45]}/>` inside Canvas for depth
- Improve ground: Add a second slightly-raised plane with noise displacement or use a simple grid texture (you can create a procedural texture with a canvas element — draw a grass-like pattern)
- Add more decorations: Scatter 5-8 small rocks (icosahedron geometry, scale 0.1-0.3, gray color) randomly across the ground
- Add fireflies at night: Small point lights (intensity 0.3, distance 2) that slowly drift around when DayNightLighting indicates nighttime
- Add ambient particles: Very subtle floating dust motes (20-30 tiny spheres, slowly drifting upward, semi-transparent)

### UI COMPONENT IMPROVEMENTS

**8. Improve ResourceBar (components/ui/ResourceBar.tsx)**
- Increase font sizes: labels from text-[10px] to text-xs, values from text-xs to text-sm
- Improve contrast: Change `text-white/40` labels to `text-white/60`
- Add subtle dividers between currency groups (a 1px `border-r border-white/10` between each)
- Add tooltip on hover showing full number (not abbreviated) and resource description
- On mobile (< 640px), show only BP and PP; put others in a "..." dropdown

**9. Improve MasterSelect screen (components/screens/MasterSelect.tsx)**
- The master portraits are just emoji in colored squares — very placeholder
- Generate a unique visual for each master: Create a small 3D-style icon per master using CSS. Each card should have a larger icon area (w-20 h-20 instead of w-16 h-16) with a gradient background matching the master's color, a border glow, and an inner shadow for depth
- Add a subtle pulse animation on hover (scale 1.0 → 1.05 with box-shadow glow)
- Fix the "Hover over a master" text for mobile — change to "Tap a master to see their details" when on touch devices (check `window.matchMedia('(hover: none)')`)
- Make the detail panel slide in with a transition instead of appearing instantly
- Increase footer quote font from text-[10px] to text-xs and opacity from white/20 to white/40
- Add a subtle particle or shimmer effect behind the title "CHOOSE YOUR PATH"

**10. Improve panel transitions (all panels in GameScreen.tsx)**
- Panels currently appear/disappear instantly
- Add a slide-in animation from the left: Use CSS transition on transform, starting at `translateX(-20px) opacity-0` and transitioning to `translateX(0) opacity-100` over 200ms
- Add a subtle backdrop blur increase when a panel is open

**11. Improve boop button feedback (GameScreen.tsx lines 216-249)**
- The boop feedback text disappears instantly between boops
- Add a small floating number that rises and fades (position: absolute, animate translateY from 0 to -30px while fading opacity from 1 to 0 over 600ms)
- Add a ring pulse effect on the boop button when clicked (expanding circle that fades out)
- Crit boops should have a screen flash effect (brief white overlay at 10% opacity for 100ms)
- Show combo counter more prominently: larger text, persistent display that glows brighter as combo increases

**12. Improve bottom stats bar (GameScreen.tsx lines 252-271)**
- Text is text-[10px] and barely readable
- Increase to text-xs
- Change text-white/30 to text-white/50 for better readability
- Add icons before each stat (small emoji or SVG icons)
- Add a subtle separator between stats

**13. Improve NotificationToast (components/ui/NotificationToast.tsx)**
- Add stagger animation: Each toast should slide in from the right with a slight delay
- Increase toast background opacity from 15% to 25% for better readability
- Add a thin left-side color accent bar (4px wide, matching notification type color)
- Allow click-to-dismiss on toasts

### VISUAL POLISH

**14. Improve DayNightLighting (components/three/effects/DayNightLighting.tsx)**
- The fill light is always jade green regardless of time — make it warmer (pale yellow #FFF8DC) during day and cooler (blue-gray #4a6fa5) at night
- Increase color lerp speed from 0.02 to 0.05 for smoother transitions
- Add a subtle ambient color shift: warm golden during morning, neutral during afternoon, warm orange during evening, deep blue during night

**15. Improve SkyDomeAnimated (components/three/effects/SkyDomeAnimated.tsx)**
- Make star appearance gradual: Lerp star opacity from 0 to 0.8 over the transition instead of instant threshold switch
- Add 2-3 larger "bright stars" that twinkle by pulsing their opacity slightly

**16. Improve QiParticles (components/three/effects/QiParticles.tsx)**
- Change qi particle shape from box to sphere geometry
- Add lateral drift: particles should sway slightly left/right as they rise (add sin wave to x position)
- Color particles based on the selected master's color theme instead of always blue

### ACCESSIBILITY FIXES

**17. Font size and contrast minimum**
- Find and replace ALL instances of `text-[10px]` with `text-xs` (12px) as minimum
- Find and replace ALL instances of `text-white/20` and `text-white/30` with at minimum `text-white/50`
- Ensure all interactive elements have visible focus-visible outlines (add `focus-visible:ring-2 focus-visible:ring-[#50C878]` to all buttons)

**18. Add ARIA labels**
- ResourceBar currencies: add `aria-label` with full name (e.g., "Boop Points: 1,234")
- Nav buttons: add `aria-label` with panel name
- Boop button: `aria-label="Boop the snoot"`
- Side panels: add `role="dialog"` and `aria-label` with panel title

**19. Touch target sizes**
- All nav buttons should be at minimum 44x44px tap targets (currently ~32px tall)
- Increase nav button padding from `px-3 py-2` to `px-3 py-3`

### IMPLEMENTATION NOTES

- Use `@react-three/drei` components where available (RoundedBox, Html, Float, Sparkles, etc.)
- Test that `npx tsc --noEmit` still passes after all changes
- Preserve all existing game logic — these are purely visual/UX changes
- Test on both desktop (1920x1080) and simulated mobile (375x812) viewport
- Keep the Wuxia theme consistent — jade green (#50C878), crimson (#E94560), parchment (#f4e4bc) as primary accents
