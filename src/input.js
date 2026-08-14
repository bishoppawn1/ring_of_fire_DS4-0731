import { createInput } from './game.js';

const KEY_MAP = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  Space: 'dash',
};

export function attachInput(target = window) {
  const input = createInput();
  const onDown = (e) => {
    const action = KEY_MAP[e.code];
    if (action) {
      input[action] = true;
      e.preventDefault();
    }
  };
  const onUp = (e) => {
    const action = KEY_MAP[e.code];
    if (action) {
      input[action] = false;
      e.preventDefault();
    }
  };
  target.addEventListener('keydown', onDown);
  target.addEventListener('keyup', onUp);
  return {
    input,
    detach() {
      target.removeEventListener('keydown', onDown);
      target.removeEventListener('keyup', onUp);
    },
  };
}
