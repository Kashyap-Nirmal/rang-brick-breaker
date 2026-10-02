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
