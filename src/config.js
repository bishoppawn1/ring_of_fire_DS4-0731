export const ARENA_R = 360;

export const PLAYER = {
  radius: 10,
  maxHp: 5,
  accel: 1400,
  maxSpeed: 320,
  friction: 0.86,
  fireCooldown: 0.18,
  bulletSpeed: 520,
  bulletRadius: 4,
  bulletDamage: 1,
  dashSpeed: 900,
  dashTime: 0.16,
  dashCooldown: 0.9,
  invulnTime: 0.5,
};

export const ENEMY = {
  radius: 18,
  baseHp: 3,
  touchDamage: 1,
};

export const BULLET = {
  radius: 5,
};

export const FLOOR = {
  baseEnemies: 3,
  enemiesPerFloor: 1,
  maxEnemies: 9,
  bossEvery: 5,
  transitionTime: 1.2,
};

export const COLORS = {
  player: '#4ade80',
  playerBullet: '#a7f3d0',
  enemy: '#f87171',
  enemyBullet: '#fb923c',
  boss: '#c084fc',
  arena: '#1a1a28',
  arenaRing: '#2a2a3a',
  dash: '#e0f2fe',
};
