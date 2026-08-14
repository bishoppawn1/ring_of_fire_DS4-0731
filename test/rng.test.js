import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mulberry32, createRng } from '../src/rng.js';

test('mulberry32 is deterministic for the same seed', () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  const seqA = Array.from({ length: 100 }, () => a());
  const seqB = Array.from({ length: 100 }, () => b());
  assert.deepEqual(seqA, seqB);
});

test('mulberry32 produces values in [0, 1)', () => {
  const r = mulberry32(7);
  for (let i = 0; i < 1000; i++) {
    const v = r();
    assert.ok(v >= 0 && v < 1, `value ${v} out of range`);
  }
});

test('different seeds produce different sequences', () => {
  const a = mulberry32(1);
  const b = mulberry32(2);
  let diff = 0;
  for (let i = 0; i < 100; i++) if (a() !== b()) diff++;
  assert.ok(diff > 0);
});

test('createRng.range respects bounds', () => {
  const r = createRng(99);
  for (let i = 0; i < 1000; i++) {
    const v = r.range(5, 10);
    assert.ok(v >= 5 && v < 10);
  }
});

test('createRng.int is inclusive of both bounds', () => {
  const r = createRng(123);
  const seen = new Set();
  for (let i = 0; i < 5000; i++) {
    const v = r.int(1, 4);
    assert.ok(v >= 1 && v <= 4);
    seen.add(v);
  }
  assert.deepEqual([...seen].sort(), [1, 2, 3, 4]);
});

test('same seed through createRng reproduces the same draws', () => {
  const draws = (seed) => {
    const r = createRng(seed);
    return [r.next(), r.range(0, 1), r.int(0, 10), r.chance(0.5)];
  };
  assert.deepEqual(draws(5), draws(5));
});
