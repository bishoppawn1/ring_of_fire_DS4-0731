import * as CONFIG from './config.js';
import { clamp, normalize } from './collision.js';
import { spawnPlayerBullet } from './bullet.js';
import { aimed } from './patterns.js';

export function updatePlayer(state, input, dt) {
  const p = state.player;

  p.dashTimer = Math.max(0, p.dashTimer - dt);
  p.dashCooldown = Math.max(0, p.dashCooldown - dt);
  p.invulnTimer = Math.max(0, p.invulnTimer - dt);
  p.fireCooldown = Math.max(0, p.fireCooldown - dt);

  const ix = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const iy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  const dir = normalize(ix, iy);

  if (p.dashTimer > 0) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  } else {
    p.vx += dir.x * CONFIG.PLAYER.accel * dt;
    p.vy += dir.y * CONFIG.PLAYER.accel * dt;
    p.vx *= CONFIG.PLAYER.friction;
    p.vy *= CONFIG.PLAYER.friction;

    const sp = Math.hypot(p.vx, p.vy);
    if (sp > CONFIG.PLAYER.maxSpeed) {
      p.vx = (p.vx / sp) * CONFIG.PLAYER.maxSpeed;
      p.vy = (p.vy / sp) * CONFIG.PLAYER.maxSpeed;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }

  if (input.dash && p.dashCooldown <= 0 && p.dashTimer <= 0) {
    const d = normalize(ix, iy);
    const dx = d.x !== 0 || d.y !== 0 ? d.x : Math.cos(p.facing);
    const dy = d.x !== 0 || d.y !== 0 ? d.y : Math.sin(p.facing);
    p.vx = dx * CONFIG.PLAYER.dashSpeed;
    p.vy = dy * CONFIG.PLAYER.dashSpeed;
    p.dashTimer = CONFIG.PLAYER.dashTime;
    p.dashCooldown = CONFIG.PLAYER.dashCooldown;
    p.invulnTimer = Math.max(p.invulnTimer, CONFIG.PLAYER.invulnTime);
  }

  if (Math.hypot(p.vx, p.vy) > 1) p.facing = Math.atan2(p.vy, p.vx);

  const cx = CONFIG.ARENA_R;
  const cy = CONFIG.ARENA_R;
  const dxc = p.x - cx;
  const dyc = p.y - cy;
  const dist = Math.hypot(dxc, dyc);
  const maxDist = CONFIG.ARENA_R - CONFIG.PLAYER.radius;
  if (dist > maxDist) {
    const s = maxDist / dist;
    p.x = cx + dxc * s;
    p.y = cy + dyc * s;
  }

  if (p.fireCooldown <= 0) {
    shoot(state);
    p.fireCooldown = CONFIG.PLAYER.fireCooldown;
  }
}

function shoot(state) {
  const p = state.player;
  let tx = p.x + Math.cos(p.facing) * 100;
  let ty = p.y + Math.sin(p.facing) * 100;
  let best = Infinity;
  for (const e of state.enemies) {
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    if (d < best) {
      best = d;
      tx = e.x;
      ty = e.y;
    }
  }
  if (state.boss) {
    const d = Math.hypot(state.boss.x - p.x, state.boss.y - p.y);
    if (d < best) {
      tx = state.boss.x;
      ty = state.boss.y;
    }
  }
  const v = aimed(p.x, p.y, tx, ty, CONFIG.PLAYER.bulletSpeed);
  spawnPlayerBullet(state, p.x, p.y, v.x, v.y);
}

export function damagePlayer(state, amount) {
  const p = state.player;
  if (p.invulnTimer > 0 || state.phase !== 'playing') return false;
  p.hp -= amount;
  p.invulnTimer = CONFIG.PLAYER.invulnTime;
  state.shake = 0.4;
  if (p.hp <= 0) {
    p.hp = 0;
    state.phase = 'gameover';
    state.over = true;
  }
  return true;
}

export function isPlayerInvulnerable(state) {
  return state.player.invulnTimer > 0;
}
