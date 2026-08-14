import { angleTo } from './collision.js';

export function aimed(x, y, tx, ty, speed) {
  const a = angleTo(x, y, tx, ty);
  return { x: Math.cos(a) * speed, y: Math.sin(a) * speed };
}

export function ring(x, y, count, speed, rng, offset = 0) {
  const bullets = [];
  const step = (Math.PI * 2) / count;
  const base = rng ? rng.range(0, Math.PI * 2) : 0;
  for (let i = 0; i < count; i++) {
    const a = base + offset + i * step;
    bullets.push({ x: Math.cos(a) * speed, y: Math.sin(a) * speed });
  }
  return bullets;
}

export function spiral(x, y, count, speed, rng) {
  const bullets = [];
  const base = rng ? rng.range(0, Math.PI * 2) : 0;
  for (let i = 0; i < count; i++) {
    const a = base + i * 0.35;
    bullets.push({ x: Math.cos(a) * speed, y: Math.sin(a) * speed });
  }
  return bullets;
}

export function fan(x, y, tx, ty, count, spread, speed) {
  const center = angleTo(x, y, tx, ty);
  const bullets = [];
  for (let i = 0; i < count; i++) {
    const a = center - spread / 2 + (spread * i) / (count - 1);
    bullets.push({ x: Math.cos(a) * speed, y: Math.sin(a) * speed });
  }
  return bullets;
}
