import { main } from './viz/index.js';

const container = document.getElementById('viz-container');
let state = {};

const setState = (next) => {
  state = next(state);
  render();
};

const render = () => {
  main(container, { state, setState });
};

render();
