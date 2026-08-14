import { createInitialState } from './state.js';
import { updatePlayer, damagePlayer } from './player.js';
import { updateEnemies } from './enemy.js';
import { updateBoss, createBoss } from './boss.js';
import { updateBullets, isOffArena } from './bullet.js';
import { createWave } from './waves.js';
import { circlesOverlap } from './collision.js';
import * as CONFIG from './config.js';

export class Game {
  constructor(seed = 1) {
    this.state = createInitialState(seed);
    this.startFloor();
  }

  startFloor() {
    const s = this.state;
    s.playerBullets = [];
    s.enemyBullets = [];
    s.boss = null;
    s.floorCleared = false;
    s.floorTransitionTimer = 0;
    const wave = createWave(s);
    s.enemies = wave.enemies;
    if (wave.boss) {
      s.boss = createBoss(s);
    }
  }

  nextFloor() {
    this.state.floor += 1;
    this.state.floorCleared = false;
    const p = this.state.player;
    p.hp = Math.min(p.maxHp, p.hp + CONFIG.PLAYER.regenPerFloor);
    this.startFloor();
  }

  update(dt, input) {
    const s = this.state;
    if (s.phase === 'gameover' || s.phase === 'victory') return;

    s.time += dt;
    s.shake = Math.max(0, s.shake - dt);

    updatePlayer(s, input, dt);
    updateEnemies(s, dt);
    updateBoss(s, dt);

    updateBullets(s.playerBullets, dt);
    updateBullets(s.enemyBullets, dt);

    this.handleCollisions();
    this.cleanup();
    this.checkFloorClear();
  }

  handleCollisions() {
    const s = this.state;
    const p = s.player;

    for (let i = s.playerBullets.length - 1; i >= 0; i--) {
      const b = s.playerBullets[i];
      let hit = false;
      for (let j = s.enemies.length - 1; j >= 0; j--) {
        const e = s.enemies[j];
        if (circlesOverlap(b.x, b.y, b.radius, e.x, e.y, e.radius)) {
          e.hp -= b.damage;
          hit = true;
          if (e.hp <= 0) {
            s.enemies.splice(j, 1);
            s.kills += 1;
            s.score += 10;
          }
          break;
        }
      }
      if (!hit && s.boss && circlesOverlap(b.x, b.y, b.radius, s.boss.x, s.boss.y, s.boss.radius)) {
        s.boss.hp -= b.damage;
        hit = true;
        if (s.boss.hp <= 0) {
          s.score += 100;
          s.boss = null;
          s.floorCleared = true;
        }
      }
      if (hit) s.playerBullets.splice(i, 1);
    }

    for (let i = s.enemyBullets.length - 1; i >= 0; i--) {
      const b = s.enemyBullets[i];
      if (circlesOverlap(b.x, b.y, b.radius, p.x, p.y, CONFIG.PLAYER.radius)) {
        s.enemyBullets.splice(i, 1);
        damagePlayer(s, CONFIG.BULLET.damage);
      }
    }

    for (let i = s.enemies.length - 1; i >= 0; i--) {
      const e = s.enemies[i];
      if (circlesOverlap(e.x, e.y, e.radius, p.x, p.y, CONFIG.PLAYER.radius)) {
        damagePlayer(s, CONFIG.ENEMY.touchDamage);
      }
    }

    if (s.boss && circlesOverlap(s.boss.x, s.boss.y, s.boss.radius, p.x, p.y, CONFIG.PLAYER.radius)) {
      damagePlayer(s, CONFIG.BOSS.touchDamage);
    }
  }

  cleanup() {
    const s = this.state;
    s.playerBullets = s.playerBullets.filter((b) => !isOffArena(b));
    s.enemyBullets = s.enemyBullets.filter((b) => !isOffArena(b));
  }

  checkFloorClear() {
    const s = this.state;
    if (s.floorCleared) return;
    if (s.enemies.length === 0 && !s.boss) {
      s.floorCleared = true;
      this.nextFloor();
    }
  }
}

export function createInput() {
  return { up: false, down: false, left: false, right: false, dash: false };
}
