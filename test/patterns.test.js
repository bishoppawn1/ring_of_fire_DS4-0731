import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as PATTERNS from '../src/patterns.js';
import { createRng } from '../src/rng.js';

test('aimed points at target', () => {
  const v = PATTERNS.aimed(0, 0, 10, 0, 100);
  assert.ok(Math.abs(v.x - 100) < 1e-9);
  assert.ok(Math.abs(v.y) < 1e-9);
});

test('ring produces count bullets at given speed', () => {
  const rng = createRng(1);
  const bullets = PATTERNS.ring(0, 0, 12, 150, rng);
  assert.equal(bullets.length, 12);
  for (const b of bullets) {
    assert.ok(Math.abs(Math.hypot(b.x, b.y) - 150) < 1e-9);
  }
});

test('ring is deterministic for the same seed', () => {
  const a = PATTERNS.ring(0, 0, 10, 100, createRng(9));
  const b = PATTERNS.ring(0, 0, 10, 100, createRng(9));
  assert.deepEqual(a, b);
});

test('spiral produces count bullets', () => {
  const bullets = PATTERNS.spiral(0, 0, 8, 120, createRng(3));
  assert.equal(bullets.length, 8);
});

test('fan produces count bullets within spread', () => {
  const bullets = PATTERNS.fan(0, 0, 10, 0, 5, Math.PI / 2, 100);
  assert.equal(bullets.length, 5);
});
