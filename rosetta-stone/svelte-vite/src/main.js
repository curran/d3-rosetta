import { mount } from 'svelte';
import App from './App.svelte';
import './app.css'; // Global styles

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app;
