# Rang — Product Requirements

> This document contains **requirements**, not a backlog of every idea discussed during development.
> A requirement is something Rang should satisfy unless it is explicitly changed here.
>
> Experimental mechanics and concepts belong in [`IDEATION.md`](./IDEATION.md).

## Product

- [R] Rang is a **Mobile Web (MWeb) first** brick-breaker game.
- [R] Portrait play must be the primary experience.
- [R] The game should also work reasonably on desktop browsers.
- [R] The game should try to accommodate fold and flip phones and unusual aspect ratios.
- [R] The core game must remain simple enough to understand immediately.
- [R] UX should prioritize clarity, responsiveness, satisfying feedback, and short sessions.

## Core gameplay

- [R] The ball must remain inside the playable screen area.
- [R] The ball must never visually travel outside/below the playable boundary.
- [R] The paddle/board must be a real collision surface.
- [R] If the ball reaches the loss boundary without a valid paddle collision, the run ends.
- [R] Ball movement must feel predictable and responsive rather than random or sluggish.
- [R] Brick collision must produce a sensible bounce direction.
- [R] Ball/paddle/brick coordinates must remain coherent after resize or orientation changes.
- [R] Retry means **restart the run from Level 1**, not restart the failed level.

## Colour system

- [R] Bricks/tiles must visibly use multiple colours.
- [R] When the ball hits a coloured normal tile, the ball changes to that tile's colour.
- [R] Colour must remain readable in both light and dark themes.
- [R] Special tiles may have their own visual language while still belonging to the overall colour system.

## Themes and visual accessibility

- [R] Support system light and dark themes.
- [R] Text and controls must maintain strong contrast in both themes.
- [R] The game must not depend on the user's system font being a particular font.
- [R] System/browser zoom must not break the intended game layout or collision coordinate system.
- [R] Avoid UI scaling assumptions tied to one phone size.
- [R] Respect safe-area insets where available.
- [R] Reduced-motion preferences should be respected where practical.

## Level progression

- [R] Initial levels should be simple and progressively become harder.
- [R] Level selection uses large visual cards.
- [R] Mobile level selection should show approximately six cards before the user scrolls further.
- [R] Level cards should communicate level number, name, visual identity, and short description.
- [R] Level names should be memorable and thematic rather than simply “Rang 1”, “Rang 2”, etc.
- [R] A branded home/initial screen should introduce Rang before gameplay.
- [R] A lightweight loader should appear while a level is being prepared.
- [R] A home/Rang control should provide a clear path back to the home screen.

## Score and personal best

- [R] Personal best is compared against the best score from the previous completed run.
- [R] Crossing the previous best during a run triggers the personal-best effect **once per run**.
- [R] Scoring further above that record does not repeatedly trigger the effect.
- [R] The final run score is persisted as the new personal best when the run ends if it is higher.
- [R] Star tiles provide a visible score reward and visual feedback.
- [R] Level completion has a small, non-intrusive celebration/sound.
- [R] A stronger celebration can be used for a new personal best.

## Bonus rounds

- [R] Some later gameplay can award bonus rounds.
- [R] A bonus round is earned when the player crosses the previous personal best **and** completes the same normal level.
- [R] If the player fails that level, the bonus is not awarded.
- [R] Bonus rounds provide three allowed respawns.
- [R] Bonus rounds should have their own name and visual identity; they should not be called “Rang 1”, “Rang 2”, etc.
- [R] Failing a bonus round forfeits the bonus but should not unnecessarily erase the normal progression already earned.

## Natural / special elements

The game should support a small vocabulary of special tile effects. Individual effects can be introduced experimentally and tuned in `IDEATION.md`.

- [R/I] Ice can require two hits, with a small first-introduction hint.
- [R/I] Fire can temporarily wrap the ball in a fire state and enable a limited nearby-brick burst.
- [R/I] A fire-state ball can destroy an ice tile in one hit.
- [R/I] Bounce can temporarily increase the ball's pace until the next meaningful hit.
- [R/I] Water can temporarily slow the ball until the next meaningful hit.
- [R/I] Additional natural elements such as wind and thunder may be prototyped only if they remain readable and fair.
- [I] Teleport tiles may preserve trajectory while moving the ball to another location.

## Localisation and environment

- [R] The game should support multiple UI languages.
- [R] UI language may be selected using approximate region/country information where available, with browser-language fallback.
- [R] If an approximate IP-location service is unavailable, the game must fall back safely to a default/browser language and default environment.
- [R] Approximate location should be used for broad language/theme decisions, not precise location tracking.
- [R] Time-of-day can influence ambient presentation.
- [I] Regional environmental themes may be experimented with after the core game is stable.

## Local-first data

- [R] No login is required for the core game.
- [R] Progress, best score, unlocks, and simple preferences can be stored locally on the device/browser.
- [R] Core gameplay should not require a backend.

## Community

- [R] Provide a feedback path without requiring login.
- [R] Provide an “I liked it” interaction.
- [R] Provide a native/shareable sharing action where the platform supports it.
- [R] Provide a visible GitHub/community link.
- [R] Provide an About page explaining that Rang is open source, MWeb based, community-friendly, and developed with AI-assisted/vibe-coded workflows.

## Engineering guardrails

- [R] Keep the project small and understandable.
- [R] Do not remove working project configuration just to simplify a single build.
- [R] Keep `package.json`, `tsconfig.json`, source files, and documentation in the repository.
- [R] Avoid unnecessary runtime dependencies.
- [R] A new feature must not destabilize ball/paddle/brick collision.
- [R] Experimental ideas must be reversible without damaging core gameplay.
