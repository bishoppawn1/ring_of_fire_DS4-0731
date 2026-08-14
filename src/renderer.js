import * as CONFIG from './config.js';

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  return {
    ctx,
    draw(state) {
      const ctx = this.ctx;
      const cx = CONFIG.ARENA_R;
      const cy = CONFIG.ARENA_R;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      if (state.shake > 0) {
        const mag = state.shake * 12;
        ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
      }

      ctx.fillStyle = CONFIG.COLORS.arena;
      ctx.beginPath();
      ctx.arc(cx, cy, CONFIG.ARENA_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = CONFIG.COLORS.arenaRing;
      ctx.lineWidth = 3;
      ctx.stroke();

      for (const b of state.playerBullets) {
        ctx.fillStyle = CONFIG.COLORS.playerBullet;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const b of state.enemyBullets) {
        ctx.fillStyle = CONFIG.COLORS.enemyBullet;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const e of state.enemies) {
        ctx.fillStyle = CONFIG.COLORS.enemy;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (state.boss) {
        ctx.fillStyle = CONFIG.COLORS.boss;
        ctx.beginPath();
        ctx.arc(state.boss.x, state.boss.y, state.boss.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const p = state.player;
      ctx.fillStyle = CONFIG.COLORS.player;
      ctx.beginPath();
      ctx.arc(p.x, p.y, CONFIG.PLAYER.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },
  };
}
