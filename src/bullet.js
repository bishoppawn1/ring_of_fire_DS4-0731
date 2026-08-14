import * as CONFIG from './config.js';

export function updateBullets(bullets, dt) {
  for (const b of bullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life = (b.life || 0) + dt;
  }
}

export function isOffArena(b, margin = 40) {
  const r = CONFIG.ARENA_R + margin;
  const dx = b.x - CONFIG.ARENA_R;
  const dy = b.y - CONFIG.ARENA_R;
  return dx * dx + dy * dy > r * r;
}

export function spawnPlayerBullet(state, x, y, vx, vy) {
  state.playerBullets.push({
    x,
    y,
    vx,
    vy,
    radius: CONFIG.PLAYER.bulletRadius,
    damage: CONFIG.PLAYER.bulletDamage,
    life: 0,
  });
}

export function spawnEnemyBullet(state, x, y, vx, vy) {
  state.enemyBullets.push({
    x,
    y,
    vx,
    vy,
    radius: CONFIG.BULLET.radius,
    life: 0,
  });
}
