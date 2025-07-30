import './style.css';
import { unidirectionalDataFlow } from '../../src/unidirectionalDataFlow.js';
import { viz } from './viz/index.js';

const container = document.getElementById('viz-container');

unidirectionalDataFlow(container, viz);
