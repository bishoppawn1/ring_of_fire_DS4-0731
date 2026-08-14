import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../src/game.js';
import * as CONFIG from '../src/config.js';

test('wave on a non-boss floor spawns enemies inside the arena', () => {
  const game = new Game(7);
  assert.equal(game.state.floor, 1);
  assert.ok(game.state.enemies.length > 0);
  for (const e of game.state.enemies) {
    const d = Math.hypot(e.x - CONFIG.ARENA_R, e.y - CONFIG.ARENA_R);
    assert.ok(d < CONFIG.ARENA_R, 'enemy spawned outside arena');
  }
});

test('wave on a boss floor spawns a boss and no enemies', () => {
  const game = new Game(7);
  game.state.floor = CONFIG.FLOOR.bossEvery;
  game.startFloor();
  assert.ok(game.state.boss, 'expected a boss');
  assert.equal(game.state.enemies.length, 0);
});

test('wave generation is deterministic for the same seed', () => {
  const a = new Game(11);
  const b = new Game(11);
  assert.deepEqual(a.state.enemies, b.state.enemies);
});

test('enemy count scales with floor up to the cap', () => {
  const game = new Game(2);
  const count1 = game.state.enemies.length;
  game.state.floor = 6;
  game.startFloor();
  const count6 = game.state.enemies.length;
  assert.ok(count6 >= count1);
  assert.ok(count6 <= CONFIG.FLOOR.maxEnemies);
});
