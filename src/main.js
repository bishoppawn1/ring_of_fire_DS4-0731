import { Game } from './game.js';
import { createRenderer } from './renderer.js';
import { attachInput } from './input.js';
import * as CONFIG from './config.js';

const canvas = document.getElementById('game');
const hudFloor = document.getElementById('hud-floor');
const hudHp = document.getElementById('hud-hp');
const hudScore = document.getElementById('hud-score');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlaySub = document.getElementById('overlay-sub');
const overlayBtn = document.getElementById('overlay-btn');

const renderer = createRenderer(canvas);
const { input } = attachInput();

let game = null;
let running = false;
let last = 0;

function renderHud() {
  hudFloor.textContent = `Floor ${game.state.floor}`;
  hudScore.textContent = game.state.score;
  const hp = game.state.player.hp;
  let html = '';
  for (let i = 0; i < CONFIG.PLAYER.maxHp; i++) {
    html += `<span class="hp-cell ${i < hp ? 'full' : ''}"></span>`;
  }
  hudHp.innerHTML = html;
}

function frame(now) {
  if (!running) return;
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (game) {
    game.update(dt, input);
    renderer.draw(game.state);
    renderHud();

    if (game.state.phase === 'gameover') {
      running = false;
      showOverlay('Game Over', `You reached floor ${game.state.floor}`, 'Restart');
    }
  }
  requestAnimationFrame(frame);
}

function showOverlay(title, sub, btn) {
  overlayTitle.textContent = title;
  overlaySub.textContent = sub;
  overlayBtn.textContent = btn;
  overlay.classList.remove('hidden');
}

function start() {
  overlay.classList.add('hidden');
  game = new Game(Date.now() % 100000);
  running = true;
  last = performance.now();
  requestAnimationFrame(frame);
}

overlayBtn.addEventListener('click', start);

showOverlay('Ring of Fire', 'WASD to move · Space to dash', 'Start');
