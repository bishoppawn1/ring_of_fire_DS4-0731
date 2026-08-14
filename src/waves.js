import * as CONFIG from './config.js';
import { createEnemy } from './enemy.js';

const TYPES = ['chaser', 'shooter', 'spiral', 'tank'];

export function createWave(state) {
  const floor = state.floor;
  const isBossFloor = floor % CONFIG.FLOOR.bossEvery === 0;
  if (isBossFloor) {
    return { boss: true, enemies: [] };
  }
  const count = Math.min(
    CONFIG.FLOOR.baseEnemies + (floor - 1) * CONFIG.FLOOR.enemiesPerFloor,
    CONFIG.FLOOR.maxEnemies
  );
  const enemies = [];
  for (let i = 0; i < count; i++) {
    const type = TYPES[state.rng.int(0, TYPES.length - 1)];
    const hp = Math.max(1, CONFIG.ENEMY.baseHp + Math.floor(floor / 2));
    const pos = spawnPosition(state.rng);
    enemies.push(createEnemy(pos.x, pos.y, type, hp, state.rng));
  }
  return { boss: false, enemies };
}

function spawnPosition(rng) {
  const a = rng.range(0, Math.PI * 2);
  const r = rng.range(80, CONFIG.ARENA_R - 60);
  return {
    x: CONFIG.ARENA_R + Math.cos(a) * r,
    y: CONFIG.ARENA_R + Math.sin(a) * r,
  };
}
