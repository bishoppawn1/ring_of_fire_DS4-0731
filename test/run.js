import { Game, createInput } from '../src/game.js';

const DT = 1 / 60;
const SEED = 20260701;
const MAX_STEPS = 60 * 60 * 3;

const game = new Game(SEED);
const input = createInput();
input.right = true;

let step = 0;
for (; step < MAX_STEPS; step++) {
  game.update(DT, input);
  if (game.state.phase === 'gameover' || game.state.phase === 'victory') break;
}

const s = game.state;
console.log('=== Ring of Fire — Headless Simulation ===');
console.log(`seed            : ${SEED}`);
console.log(`steps simulated : ${step}`);
console.log(`simulated time  : ${s.time.toFixed(2)}s`);
console.log(`phase           : ${s.phase}`);
console.log(`floor reached   : ${s.floor}`);
console.log(`score           : ${s.score}`);
console.log(`kills           : ${s.kills}`);
console.log(`player hp       : ${s.player.hp}/${s.player.maxHp}`);
console.log('==========================================');
