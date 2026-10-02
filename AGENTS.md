# Rang — AI Agent Instructions

## Mission

Build Rang as a simple, polished, mobile-web-first brick breaker. Optimise for **game feel, clarity, reliability, and fun**, not feature count.

## Source of Truth

- `REQUIREMENTS.md` = accepted product requirements.
- `IDEATION.md` = experiments and ideas; ideas are optional until accepted.
- `AGENTS.md` = rules for AI agents working on the repository.
- `README.md` = setup and developer-facing project information.

## Non-Negotiable Rules

1. **Do not delete project infrastructure casually.** Preserve `package.json`, `tsconfig.json`, source files, build scripts, and documentation unless there is an explicit reason.
2. **Do not replace the project with a throwaway single-file demo.** Keep the repository runnable and maintainable.
3. **Do not silently remove working gameplay.** If a mechanic is intentionally removed, document why in the changelog/commit message.
4. **Do not rewrite core physics to add a cosmetic feature.** Isolate feature behaviour where possible.
5. **Do not add every idea immediately.** Prototype one idea at a time and keep only ideas that improve player experience.
6. **Do not invent requirements.** If something is not in `REQUIREMENTS.md`, treat it as an experiment unless the user explicitly accepts it.
7. **Prefer dependency-free solutions** for small UI, animation, sound, and gameplay effects.
8. **Keep gameplay static-first.** Do not introduce a backend, login, database, analytics SDK, or location service unless the relevant requirement has been accepted for that phase.

## Physics Invariants

These must remain true after every gameplay change:

- The ball cannot render outside the viewport/play area.
- The ball cannot pass below the loss boundary.
- The paddle is above the loss boundary.
- A valid paddle collision is resolved before checking for loss.
- Paddle collision must reverse vertical velocity upward.
- Side-wall collisions must reverse horizontal velocity.
- Top-wall collision must reverse vertical velocity.
- Brick collision must reverse the appropriate velocity component and must not leave the ball embedded in the brick.
- Resize/orientation changes must not arbitrarily reset an active ball.
- The ball should remain controllable on narrow, tall, wide, fold, and flip aspect ratios.

## Personal Best Rules

Example: previous best = 100.

- Scores below/equal to 100: normal feedback.
- First score crossing from <=100 to >100: trigger the new-best celebration once.
- Later scores in the same run: no repeated new-best celebration.
- Do not persist the new best on every score increment.
- At run end, if final score > stored best, persist final score as the new best.
- A new run compares against the persisted best from the previous completed run.

If stored best is 0, the first run may be treated as a first-record event, but it must still trigger at most once.

## Retry Rules

- `Retry` always starts from **Level 1**.
- It must reset the run score and run state.
- It must not resume the failed level.
- `Next` after a successful level clear may continue to the next level while preserving run score.

## Colour Rules

- Normal bricks should have a coherent palette.
- The ball should visibly change colour after hitting a coloured brick.
- Special tiles may override the ball colour temporarily, but the player must always be able to distinguish the ball from the background and paddle.
- Light and dark themes must both maintain contrast.

## UI Rules

- Mobile portrait is the primary layout.
- Avoid tiny controls.
- Avoid dense level lists.
- Prefer large cards and clear hierarchy.
- Do not rely on a specific system font being installed.
- Do not rely on browser/system zoom being 100%.
- Respect safe-area insets.
- Use `prefers-color-scheme` unless an explicit in-game theme setting is later introduced.
- Respect `prefers-reduced-motion` for non-essential effects.

## Branding / Home

Rang should have an intentional entry experience:

- lightweight branded splash/loader,
- clear Rang identity,
- playful but restrained home visual,
- immediate Play action,
- no unnecessary waiting before the game is ready.

A CSS/canvas animation is preferred over shipping a large GIF asset unless a GIF genuinely provides a better result.

## Code Quality

- Keep functions reasonably small.
- Use descriptive names.
- Avoid hidden global state where practical.
- Avoid DOM updates every animation frame when canvas can handle the visual.
- Use localStorage carefully and namespace Rang keys.
- Never use `eval`.
- Never inject unsanitised user input with `innerHTML`.
- Keep external network calls optional and failure-safe.

## Validation Before Delivering a Build

At minimum:

1. `npm install` succeeds.
2. `npm run check` succeeds when applicable.
3. `npm run build` succeeds.
4. Start a new run from Level 1.
5. Verify paddle collision.
6. Verify loss boundary.
7. Verify brick collision.
8. Verify ball colour change.
9. Verify retry starts Level 1.
10. Verify personal-best celebration triggers once per run.
11. Verify final best is persisted at run end.
12. Verify light/dark readability.
13. Verify a narrow/tall viewport.
14. Verify orientation/resize does not destroy the active ball state.

## Documentation

When changing product behaviour:

- Update `REQUIREMENTS.md` only when a requirement changes.
- Put unaccepted experiments in `IDEATION.md`.
- Update `README.md` when setup/build behaviour changes.
- Do not create duplicate requirement documents with conflicting information.

## Product Philosophy

The best version of Rang is not the one with the most mechanics. It is the one where a new player understands the game in seconds, enjoys the first minute, discovers a clever interaction, and voluntarily presses Play again.
