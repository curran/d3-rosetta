import { unidirectionalDataFlow } from 'd3-rosetta';
import { main } from './viz/index.js';

const container = document.getElementById('viz-container');

// Use the unidirectionalDataFlow utility to manage state and rendering.
// The 'main' function from viz/index.js is our D3 rendering logic.
unidirectionalDataFlow(container, main);
