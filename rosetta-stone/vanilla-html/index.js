import { unidirectionalDataFlow } from 'd3-rosetta';
import { viz } from './viz/index.js';

const container = document.getElementById('viz-container');

// Use the unidirectionalDataFlow utility to manage state and rendering.
// The 'viz' function from viz/index.js is our D3 rendering logic.
unidirectionalDataFlow(container, viz);
