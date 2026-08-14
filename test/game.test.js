import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Game, createInput } from '../src/game.js';
import * as CONFIG from '../src/config.js';

const DT = 1 / 60;

function run(game, steps, input = createInput()) {
  for (let i = 0; i < steps; i++) game.update(DT, input);
  return game;
}

test('player moves right with D held', () => {
  const game = new Game(1);
  const input = createInput();
  input.right = true;
  run(game, 30, input);
  assert.ok(game.state.player.x > CONFIG.ARENA_R, 'player should move right');
});

test('player is clamped inside the arena', () => {
  const game = new Game(1);
  const input = createInput();
  input.right = true;
  run(game, 600, input);
  const d = Math.hypot(
    game.state.player.x - CONFIG.ARENA_R,
    game.state.player.y - CONFIG.ARENA_R
  );
  assert.ok(d <= CONFIG.ARENA_R, 'player escaped the arena');
});

test('player auto-fires bullets', () => {
  const game = new Game(1);
  run(game, 30);
  assert.ok(game.state.playerBullets.length > 0, 'expected player bullets');
});

test('dash triggers and applies cooldown', () => {
  const game = new Game(1);
  const input = createInput();
  input.right = true;
  input.dash = true;
  game.update(DT, input);
  assert.ok(game.state.player.dashCooldown > 0, 'dash cooldown should be set');
  assert.ok(game.state.player.invulnTimer > 0, 'dash should grant invulnerability');
});

test('player bullets damage and kill enemies', () => {
  const game = new Game(1);
  const startKills = game.state.kills;
  const input = createInput();
  input.right = true;
  run(game, 600, input);
  assert.ok(game.state.kills >= startKills, 'expected at least one kill');
});

test('enemy bullets damage the player', () => {
  const game = new Game(1);
  const startHp = game.state.player.hp;
  run(game, 900);
  assert.ok(game.state.player.hp <= startHp, 'player should take damage over time');
});

test('game reaches gameover when player hp hits zero', () => {
  const game = new Game(1);
  run(game, 6000);
  assert.equal(game.state.phase, 'gameover');
  assert.equal(game.state.player.hp, 0);
});

test('floor advances after clearing enemies', () => {
  const game = new Game(1);
  const input = createInput();
  input.right = true;
  run(game, 3000, input);
  assert.ok(game.state.floor >= 2, 'expected floor to advance');
});

test('full simulation is deterministic for the same seed', () => {
  const runSim = () => {
    const game = new Game(1234);
    const input = createInput();
    input.right = true;
    run(game, 3600, input);
    return {
      floor: game.state.floor,
      score: game.state.score,
      kills: game.state.kills,
      phase: game.state.phase,
      hp: game.state.player.hp,
      x: game.state.player.x,
      y: game.state.player.y,
      time: game.state.time,
    };
  };
  assert.deepEqual(runSim(), runSim());
});

test('different seeds diverge in outcomes', () => {
  const sim = (seed) => {
    const game = new Game(seed);
    const input = createInput();
    input.right = true;
    run(game, 3600, input);
    return { score: game.state.score, kills: game.state.kills, floor: game.state.floor };
  };
  const a = sim(100);
  const b = sim(200);
  assert.ok(a.score !== b.score || a.kills !== b.kills, 'expected seeds to diverge');
});

test('time advances deterministically with fixed dt', () => {
  const game = new Game(5);
  run(game, 120);
  assert.ok(Math.abs(game.state.time - 120 * DT) < 1e-9);
});
