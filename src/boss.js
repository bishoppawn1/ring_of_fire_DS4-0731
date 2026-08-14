import * as CONFIG from './config.js';
import { spawnEnemyBullet } from './bullet.js';
import * as PATTERNS from './patterns.js';

export function createBoss(state) {
  return {
    x: CONFIG.ARENA_R,
    y: CONFIG.ARENA_R - 120,
    radius: 40,
    hp: 80 + state.floor * 8,
    maxHp: 80 + state.floor * 8,
    fireTimer: 1.0,
    phase: 0,
    angle: 0,
  };
}

export function updateBoss(state, dt) {
  const boss = state.boss;
  if (!boss) return;
  const p = state.player;

  boss.fireTimer -= dt;
  boss.angle += dt * 1.2;

  const hpRatio = boss.hp / boss.maxHp;
  boss.phase = hpRatio < 0.5 ? 1 : 0;

  if (boss.fireTimer <= 0) {
    fireBoss(state, boss);
    boss.fireTimer = boss.phase === 1 ? 0.5 : 0.8;
  }
}

function fireBoss(state, boss) {
  const rng = state.rng;
  const p = state.player;
  if (boss.phase === 0) {
    const bullets = PATTERNS.ring(boss.x, boss.y, 18, 160, rng, boss.angle);
    for (const b of bullets) spawnEnemyBullet(state, boss.x, boss.y, b.x, b.y);
  } else {
    const bullets = PATTERNS.ring(boss.x, boss.y, 24, 190, rng, boss.angle);
    for (const b of bullets) spawnEnemyBullet(state, boss.x, boss.y, b.x, b.y);
    const aimed = PATTERNS.aimed(boss.x, boss.y, p.x, p.y, 260);
    spawnEnemyBullet(state, boss.x, boss.y, aimed.x, aimed.y);
  }
}
