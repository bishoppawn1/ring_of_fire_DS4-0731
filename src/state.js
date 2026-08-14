import { createRng } from './rng.js';
import * as CONFIG from './config.js';

export function createInitialState(seed) {
  return {
    seed,
    rng: createRng(seed),
    phase: 'playing',
    time: 0,
    floor: 1,
    score: 0,
    kills: 0,
    player: {
      x: CONFIG.ARENA_R,
      y: CONFIG.ARENA_R,
      vx: 0,
      vy: 0,
      hp: CONFIG.PLAYER.maxHp,
      maxHp: CONFIG.PLAYER.maxHp,
      dashTimer: 0,
      dashCooldown: 0,
      fireCooldown: 0,
      invulnTimer: 0,
      facing: 0,
    },
    playerBullets: [],
    enemyBullets: [],
    enemies: [],
    boss: null,
    shake: 0,
    floorCleared: false,
    floorTransitionTimer: 0,
    over: false,
  };
}
