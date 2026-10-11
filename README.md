# Rang v0.1.4

Mobile-web-first, portrait-friendly brick breaker.

## Current focus

This build restores a conventional frontend project structure while keeping the game implementation deliberately simple.

### Critical physics fix
The paddle now sits **above** the loss boundary. Previously the paddle was below `lossY`, so a ball could collide with the paddle and immediately trigger the loss check in the same update frame.

The new rule is:

`play area -> paddle -> loss boundary -> outside screen`

The ball is clamped to the loss boundary and the run ends if it passes the paddle.

### Included project files

- `package.json` — development/build scripts and frontend dependencies
- `tsconfig.json` — TypeScript configuration kept ready for gradual migration
- `requirements.txt` — runtime dependency marker
- `REQUIREMENTS.md` — complete product/game requirements
- `index.html` — app shell
- `src/main.js` — current game implementation
- `src/style.css` — responsive UI/theme styles

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

The game itself has no backend dependency and can be hosted as a static site.

## Adaptive themes

Rang automatically selects a Morning, Afternoon, Evening, or Night palette from
the current time in the best available timezone. It uses local clock bands as a
fallback and, when approximate coordinates are available, estimates sunrise and
sunset locally to refine the morning and evening transitions. Solar estimates
are intentionally lightweight; polar day/night and unusually short or long
daylight fall back to the clock bands.

Open **Settings → Personalise your Rang** to choose a theme manually. A manual
choice pauses automatic switching and is saved on this device. Turn on
**Automatic theme** to recalculate immediately and resume time-based changes.
The existing System/Light/Dark appearance choice remains available. In System
mode, morning and afternoon use bright daylight palettes, while night uses a
dark palette; explicitly choosing Light or Dark overrides that contrast choice.
All time palettes are blue-dominant with no green accents, and use distinct
ambient tints so the active time theme is visible. Sunrise and sunset may use
restrained warm highlights.
The canvas also paints a restrained time-of-day sky: a clock-positioned sun,
drifting blue-white clouds, and migrating bird flocks by day; a crescent moon,
twinkling stars, and occasional shooting stars at night. The scene animates
behind the menu and gameplay, pauses while the page is hidden, and becomes
static when reduced motion is requested.

On startup, Rang renders immediately using the browser's system timezone and
system light/dark preference. The system timezone always takes priority.
Approximate device coordinates are used for sunrise/sunset only when the player
has already granted location permission; Rang never prompts for it. If device
location is denied, unavailable, or cannot be read, Rang makes one best-effort
IPWHO request for approximate timezone and coordinates/country (2.2-second
timeout). IPWHO's timezone is used only if the system timezone cannot be
identified; browser-local time is the final fallback. The game remains playable
offline if the optional lookup fails.

When device location is not available, the IPWHO request sends a network
request to a third-party service, which may process the requester's public IP
address. Rang does not claim the request is anonymous. IP-derived timezone,
coordinates, and country remain in memory only; they are not written to local
storage, cookies, analytics, or logs. Only explicit user preferences such as
the selected/manual theme mode are persisted locally.

### Theme development and testing

- Theme palettes and token application live in `src/adaptive-theme.js`.
- To reset saved theme choices on the next published frontend build, set the
  build environment variable `VITE_RESET_THEME_PREFERENCES=true`. The reset
  happens once per generated JavaScript bundle, so refreshes do not keep
  overriding choices a player makes afterward. It clears only appearance,
  automatic/manual time theme, and nature-accent preferences; score, unlocked
  levels, language, sound, and other saved data are preserved. Disable the
  variable after the rollout if you do not want later deploys to reset themes.
- The reset runs only after the browser receives the new JavaScript bundle.
  Configure the static host/CDN to revalidate `index.html` on visits; hashed
  files under `assets/` can remain cached as immutable assets.
- IPWHO validation, timeout, and request memoization live in `src/ip-context.js`.
- `src/main.js` initializes immediately with the system timezone, uses already
  permitted device location first, falls back to IPWHO, and manages
  visibility/minute-boundary updates without restarting gameplay.
- The solar approximation uses the NOAA sunrise equation. It is not intended
  for astronomical precision; missing or unusable events fall back to the
  four local-time bands.
- Run `npm test` for deterministic timezone, band-boundary, solar, response
  validation, failure, and timeout tests. Tests make no network requests.
- Run `npm run check` and `npm run build` for syntax and production checks.


## v0.1.5 focus

- Restored the product/experiment split with `REQUIREMENTS.md` and `IDEATION.md`.
- Added `AGENTS.md` for AI-assisted development rules.
- Preserved project infrastructure (`package.json`, `tsconfig.json`, Vite scripts).
- Fixed retry to restart from Level 1.
- Personal-best celebration now triggers once when a run first crosses the previous best; the final best is persisted when the run ends.
- Restored colourful tiles and ball-colour changes after brick hits.
- Added lightweight branded splash/loading state and animated home visual.
- Added local like/share/feedback entry points.
- Resize/orientation now preserves active game state instead of rebuilding the level.
- Added water as a restrained experimental natural element.

## Product docs

- `REQUIREMENTS.md` — requirements Rang should satisfy.
- `IDEATION.md` — experiments, mechanics and UX ideas that may be kept, changed or rejected.
- `AGENTS.md` — rules for AI-assisted development and repository safety.

### Current UX direction
Rang is intentionally small: a branded home, quick level selection, responsive MWeb gameplay, colourful tiles, clear feedback, and optional bonus moments. New mechanics should earn their place by making the next 30 seconds more enjoyable rather than by increasing feature count.
