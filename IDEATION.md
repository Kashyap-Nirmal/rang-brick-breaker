# Rang — Ideation & Experiments

> This document is deliberately loose. These are ideas to prototype, test, combine, reject, or replace. An idea does **not** become a requirement just because it appears here.

## Design Principle

Rang should feel **simple enough to understand immediately, but clever enough to make players think “oh, that's nice.”**

Borrow interaction patterns from great games, apps, web experiences, toys, TV interfaces, arcade games, puzzle games, and console games where useful. Borrow the *principle*, not copyrighted assets, characters, or branding.

The filter for every experiment:

> **Does this make the next 30 seconds more fun without making the game harder to understand?**

## Branding / Return Hook

- Animated Rang logo reveal on first launch.
- Tiny bouncing/colour-changing ball as the brand mascot.
- Home screen with floating bricks slowly forming and breaking the Rang mark.
- Lightweight CSS/canvas “loader” instead of a heavy GIF where possible.
- Different tiny home-screen ambient animation by time of day.
- A daily visual variation without requiring daily login.
- “Continue” card showing the last unlocked level.
- Tiny “best score” celebration when returning after beating a record.
- Optional rotating one-line game tips.

## Level Design Ideas

Possible early sequence:

1. **First Light** — two vertical side lines.
2. **Open Sky** — inverted U.
3. **Home Run** — simple U.
4. **Four Walls** — square.
5. **Moon Gate** — broken circle/ring.
6. **Twin Rivers** — moving side columns.
7. **Crosswind** — moving cross.
8. **Orbit Break** — moving ring.

Other geometry experiments:

- Diamond.
- Zig-zag.
- Staircase.
- Hourglass.
- Spiral.
- Two islands with a narrow passage.
- Symmetric vs intentionally asymmetric layouts.
- A central hole that becomes useful only if the player gets the right angle.
- Shapes that appear impossible until the player discovers a gap.

## Ball / Tile Colour Experiments

The ball changing colour after a tile hit is a strong mechanic worth preserving.

Possible extensions:

- Ball leaves a short colour trail.
- Matching colour gives a tiny score multiplier.
- Three consecutive same-colour hits create a small “flow” bonus.
- A tile's colour gradually fades after being hit.
- Colour changes can become part of puzzles in later levels.
- Rare rainbow tile: next hit cycles the ball through colours.

Do not make colour matching mandatory until it proves fun.

## Natural Elements

### Ice

- Two hits.
- First hit visibly cracks it.
- Tiny “2 HITS” hint on first introduction.
- Fire-state ball melts it immediately.

### Fire

- Hitting fire wraps the ball in a visible flame.
- Next brick hit triggers a small burst.
- Maximum four adjacent bricks destroyed.
- Fire state ends immediately after the burst.

### Bounce

- Ball becomes faster or gains a more energetic rebound.
- Keep the effect temporary and readable.

### Water

- Ball slows until the next meaningful hit.
- Visual could be a small ripple around the ball.

### Wind

Experiments:

- A gentle horizontal force affects the ball.
- Direction can be shown with subtle particles.
- Wind should never feel like random loss of control.

### Thunder

- A lightning path follows or predicts the ball's trajectory.
- Can destroy a short line of bricks.
- Rare event so it feels special.

### Teleport

- Ball enters portal A and exits portal B.
- Preserve velocity vector when possible.
- Possible variations: deterministic paired portals, rotating destination, or a short preview of the destination.
- Avoid teleporting the ball directly into an impossible collision.

## Board Experiments

- Board/paddle shrinks on difficult levels.
- Board grows after a difficult sequence.
- Temporary board expansion bonus.
- Moving paddle zones.
- A board that subtly oscillates rather than randomly jumps.
- Special levels where the paddle is deliberately asymmetric.

## Bonus Levels

Possible structure:

- Every 4–5 normal levels, a bonus stage.
- Three respawns.
- Shorter session.
- More stars.
- No game-over anxiety.
- High score opportunity.
- Special background/audio.

## Environment

Potential layers:

- Morning: birds, sun, clouds, warm bright sky.
- Afternoon: clean bright sky.
- Evening: sunset gradient, subtle clouds.
- Night: stars, moon, clouds.
- Rare regional visuals such as aurora or seasonal vegetation.
- Japan-inspired environmental theme experiments: cherry blossom, wisteria, etc.
- US-inspired regional experiments.
- Indian regional/festival-inspired experiments.

These should remain tasteful and broad. Avoid turning location into surveillance or making exact-location claims.

## Audio

- Morning bird chirps.
- Night soft ambience.
- Distinct but tiny brick-hit sounds.
- Colour-change chime.
- Star sparkle.
- Fire crackle.
- Ice crack.
- Water ripple.
- Thunder strike.
- Level-clear sting.
- Personal-best celebration.

## Personal Best Celebration

Desired behaviour:

- If previous best is 100, scoring 10 → 50 → 90: normal.
- Crossing 100: one celebration.
- Scoring 110 → 150 → 200: no repeated “new best” celebration.
- At run end, save 200 as the new best.
- Next run starts with 200 as the comparison point.

Possible celebration:

- small confetti burst,
- score glow,
- short ascending sound,
- tiny “NEW BEST” label.

Keep it short enough not to interrupt play.

## Level Selection

Concept:

- Large card.
- 2 columns on mobile.
- Roughly six visible cards before scrolling.
- Each card can contain a tiny preview of its brick geometry.
- Locked card can show the shape silhouette without revealing every mechanic.
- Completed levels can have a small completion mark.
- Current level gets a subtle “PLAY” treatment.

Possible card structure:

```text
┌───────────────────┐
│ LEVEL 05          │
│                   │
│     ▪ ▪ ▪         │
│   ▪       ▪       │
│                   │
│ MOON GATE         │
│ Find the opening  │
│                   │
│ PLAY              │
└───────────────────┘
```

## Story Mode

Potential concept:

> Rang is travelling through different skies/worlds, and each world introduces one new idea.

Example worlds:

- Sky
- Frost
- Flame
- Water
- Storm
- Cosmos

Story should remain optional and lightweight.

## Game Modes

Experiments:

- Classic.
- Story.
- Endless.
- Time attack.
- Bonus rush.
- One-ball challenge.
- Colour challenge.
- Daily pattern — only if we can do it without accounts/backend.

## Social / Sharing

- “I liked Rang” button.
- Native share with current level + score.
- Shareable result card generated locally.
- Feedback form without login.
- Avoid spammy prompts.

## Borrowing Good UX Patterns

Look for useful principles from:

- arcade games: instant feedback,
- puzzle games: readable rules,
- mobile games: one-thumb interaction,
- console games: satisfying transitions,
- web apps: clear cards and hierarchy,
- casual games: short sessions and instant restart,
- meditation/weather apps: subtle ambient environments,
- TV interfaces: large readable selection cards.

Do not copy protected artwork, characters, music, UI assets, or branding.

## Things to Avoid

- Too many mechanics in one level.
- Random physics that feels unfair.
- Long tutorials.
- Forced login.
- Excessive popups.
- Ads before the core game is fun.
- Heavy dependencies for tiny features.
- Location permission before the user understands why it helps.
- Effects that obscure the ball.
- Animations that reduce gameplay clarity.
- Feature additions that destabilise the ball/paddle collision system.

## Bonus Round Experiment — Floating Skies

A bonus round should feel like a small change of genre, not just “more bricks.”

### Trigger
- During a normal level, crossing the previous personal-best score arms the bonus.
- The player must then **complete that same level**.
- Only when both conditions are true does the bonus round unlock.
- If the player loses that level, the bonus is lost.

### Gameplay
- The normal brick grid disappears.
- Colourful tiles float freely around the upper/middle play area.
- Tiles drift gently in different directions and bounce off invisible boundaries.
- The player still controls the same paddle and ball.
- Every floating tile gives a small score reward.
- Star tiles can appear more frequently.
- There are **3 respawns** in this round.
- The round is short and forgiving; it should feel like a reward, not another stressful level.

### Visual identity
- Name the round something playful such as **Floating Skies**, never “Rang 1”, “Rang 2”, etc.
- Background can become lighter/airier with soft clouds, particles, or a subtle parallax effect.
- Floating tiles can leave tiny trails.
- Completing the round gets a stronger celebration than a normal level clear.
- Failing it simply forfeits the bonus; it should not erase the normal run.

### Possible future variations
- Tiles slowly orbit a centre point.
- Tiles form temporary constellations.
- Some tiles move toward the ball rather than randomly.
- A golden star tile is worth a larger reward.
- A “last 5 seconds” phase where all tiles gently speed up.
- A no-paddle bonus variant where the player relies entirely on trajectory.

The important principle is that bonus rounds should feel like **“the game gave me a little toy to play with”**, not like another level with a different layout.
