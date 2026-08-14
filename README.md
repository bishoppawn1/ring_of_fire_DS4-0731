# Ring of Fire

A fast, readable bullet hell game built around circular danger patterns, tight movement, and escalating enemy waves. Move, shoot, dodge, take damage, restart, and defeat the boss.

## Play it

**GitHub Pages:** https://bishoppawn1.github.io/ring_of_fire_DS4-0731/

> Note: enable GitHub Pages in **Settings → Pages** (deploy from the `main` branch) to make the link live.

## Controls

- **WASD / Arrow keys** — move
- **Space** — dash (brief invulnerability)

## Run locally

```bash
npm start        # serve at http://localhost:8080
npm test         # run the automated test suite
npm run test:run # headless full-game simulation report
```

## Architecture

Modular ES modules under `src/`, with pure game logic separated from rendering so the game is fully deterministic and testable headlessly:

- `game.js` — deterministic `Game.update(dt, input)` orchestrator
- `player.js`, `enemy.js`, `boss.js`, `waves.js` — entities & floor progression
- `patterns.js`, `bullet.js` — bullet patterns & management
- `rng.js` — seeded PRNG (mulberry32) for reproducible runs
- `renderer.js`, `input.js`, `main.js` — canvas, keyboard, game loop

## Testing

The test suite (`test/`) uses a seeded RNG and fixed-dt stepping, so any run with the same seed reproduces identical outcomes. It verifies determinism, movement, shooting, damage, floor progression, and game-over — all headlessly in Node with zero external dependencies.
