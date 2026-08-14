# Ring of Fire

A fast, readable bullet hell game built around circular danger patterns, tight movement, and escalating enemy waves. Move, shoot, dodge, take damage, restart, and defeat the boss.

## Play it

**GitHub Pages:** https://bishoppawn1.github.io/ring_of_fire_DS4-0731/

> Note: enable GitHub Pages in **Settings → Pages** (deploy from the `main` branch) to make the link live.

**Tokens used to build:** 33.2k

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

## Initial Build Prompt

> # Ring of Fire — Reproducible Build Prompt
>
> Use this single prompt to test another model with the same specs and user inputs that produced this project with opencode + GLM-5,2 on 2026-07-01.
>
> ---
>
> ## Project Spec (from PLAN.md)
>
> `Ring of Fire` is a fast, readable bullet hell game built around circular danger patterns, tight movement, and escalating enemy waves. The first goal is a small but complete playable loop: move, shoot, dodge, take damage, restart, and eventually defeat a first boss.
>
> ### Recommended Stack
>
> - Runtime: Browser
> - Language: JavaScript
>
> ## Architecture Guide (from AGENT.md)
>
> `Ring of Fire` is a browser-based JavaScript bullet hell game. The game is centered on a large circular arena, a small green player, tight movement, dash-based survival, health-based damage, floor progression, and enemy projectile patterns.
>
> The goal is to architect this game from prototype to finished game without letting the code collapse into one giant scene file. Treat modularity as part of the product, not cleanup for later.
>
> ---
>
> ## User Inputs (in order)
>
> 1. "Let's build this game!"
> 2. "keyboard WASD doesn't appear to do anything? Can you build in automatic test? i.e., user shouldn't be forced to test"
> 3. "Did you get stuck?"
> 4. "Did you get stuck?"
> 5. "It does appear to work now. Let's Work on building an automated testing pathway, so that you can fully run the game (or rather, a test suite can fully run the game). Since it must be reproducible, it's probably true that and random generation must be seeded."
> 6. "Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed."
> 7. "AFter you do this, explain what methodology you used for the automated testing. Explain the limits, and also where it works well. Present alternatives."
> 8. "continue"
> 9. "continue"
> 10. "continue, but work in small chunks so you don't hit your 35k output-per-response limit"
> 11. "Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed."
>
> ---
>
> ## How to run the test
>
> Feed the model the Project Spec + Architecture Guide as the initial context, then deliver the User Inputs one at a time in order, waiting for the model's response before sending the next input. The expected deliverable is a modular browser-based JS bullet hell game with a seeded, reproducible automated test suite.
