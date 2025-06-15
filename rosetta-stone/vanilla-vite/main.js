import './style.css';
import { unidirectionalDataFlow } from '../../src/unidirectionalDataFlow.js';
import { main } from './viz/index.js';

const container = document.getElementById('viz-container');

unidirectionalDataFlow(container, main);
