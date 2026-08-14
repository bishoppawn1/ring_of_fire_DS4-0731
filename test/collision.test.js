import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circlesOverlap, angleTo, clamp, normalize } from '../src/collision.js';

test('circlesOverlap detects overlap', () => {
  assert.ok(circlesOverlap(0, 0, 5, 3, 0, 5));
  assert.ok(circlesOverlap(0, 0, 5, 5, 0, 5));
});

test('circlesOverlap rejects non-overlap', () => {
  assert.ok(!circlesOverlap(0, 0, 5, 20, 0, 5));
  assert.ok(!circlesOverlap(0, 0, 1, 5, 0, 1));
});

test('circlesOverlap touches at exact sum of radii', () => {
  assert.ok(circlesOverlap(0, 0, 5, 10, 0, 5));
});

test('angleTo returns correct angle', () => {
  assert.equal(angleTo(0, 0, 1, 0), 0);
  assert.equal(angleTo(0, 0, 0, 1), Math.PI / 2);
});

test('clamp bounds values', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-3, 0, 10), 0);
  assert.equal(clamp(15, 0, 10), 10);
});

test('normalize produces unit vectors', () => {
  const v = normalize(3, 4);
  assert.ok(Math.abs(Math.hypot(v.x, v.y) - 1) < 1e-9);
  const z = normalize(0, 0);
  assert.equal(z.x, 0);
  assert.equal(z.y, 0);
});
