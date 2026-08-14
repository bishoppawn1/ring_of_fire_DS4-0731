import * as CONFIG from './config.js';
import { normalize } from './collision.js';
import { spawnEnemyBullet } from './bullet.js';
import * as PATTERNS from './patterns.js';

export function createEnemy(x, y, type, hp, rng) {
  return {
    x,
    y,
    type,
    hp,
    maxHp: hp,
    radius: CONFIG.ENEMY.radius,
    fireTimer: rng.range(0.6, 1.6),
    fireInterval: fireIntervalFor(type, rng),
    spin: rng.range(0, Math.PI * 2),
    angle: rng.range(0, Math.PI * 2),
  };
}

function fireIntervalFor(type, rng) {
  switch (type) {
    case 'spiral':
      return rng.range(0.5, 0.9);
    case 'tank':
      return rng.range(1.6, 2.4);
    default:
      return rng.range(0.9, 1.5);
  }
}

export function updateEnemies(state, dt) {
  const p = state.player;
  for (const e of state.enemies) {
    e.fireTimer -= dt;
    switch (e.type) {
      case 'chaser': {
        const d = normalize(p.x - e.x, p.y - e.y);
        e.x += d.x * 70 * dt;
        e.y += d.y * 70 * dt;
        break;
      }
      case 'shooter':
      case 'spiral':
      case 'tank':
        break;
    }

    if (e.fireTimer <= 0) {
      fire(state, e);
      e.fireTimer = e.fireInterval;
    }
  }
}

function fire(state, e) {
  const p = state.player;
  const rng = state.rng;
  switch (e.type) {
    case 'shooter': {
      const v = PATTERNS.aimed(e.x, e.y, p.x, p.y, 200);
      spawnEnemyBullet(state, e.x, e.y, v.x, v.y);
      break;
    }
    case 'spiral': {
      const bullets = PATTERNS.spiral(e.x, e.y, 6, 180, rng);
      for (const b of bullets) spawnEnemyBullet(state, e.x, e.y, b.x, b.y);
      break;
    }
    case 'tank': {
      const bullets = PATTERNS.ring(e.x, e.y, 12, 150, rng);
      for (const b of bullets) spawnEnemyBullet(state, e.x, e.y, b.x, b.y);
      break;
    }
    case 'chaser':
      break;
  }
}
