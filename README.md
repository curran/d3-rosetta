# d3-rosetta

A framework-agnostic utility for bringing D3’s powerful data visualization capabilities into your favorite front-end frameworks. Write your visualization logic once, and use it anywhere.

```bash
npm i d3-rosetta
```

## Why d3-rosetta?

- **Framework-Agnostic**: Use the same visualization logic across React, Vue, Svelte, Angular, and more.
- **Unidirectional Data Flow**: Simplify state management and rendering logic with a clean, idempotent approach.
- **Optimized for Performance**: Includes utilities like memoization to ensure your visualizations stay fast and responsive.
- **Minimal Boilerplate**: Get started quickly without the need for extensive setup or configuration.

## Quick Start

### 1. Create Your Visualization

Your visualization logic is a single function that takes a container and a state object. Here’s an example:

```js
export const main = (container, { state, setState }) => {
  // Your reusable D3-based rendering logic goes here!
};
```

To instantiate this with vanilla JavaScript and the dead simple state management solution provided by `d3-rosetta`, it can be invoked like this:

```js
import { createRoot } from 'd3-rosetta'
import { main } from './viz';
const container = document.getElementById('viz-container');
createRoot(container).render(main)
```

### 2. Integrate with Your Framework

Here’s how you can integrate it with React:

```jsx
import { useEffect, useRef, useState } from 'react';
import { main } from './viz';

export function App() {
  const ref = useRef(null);
  const [state, setState] = useState({});

  useEffect(() => {
    const container = ref.current;
    main(container, { state, setState });
  }, [state]);

  return <div ref={ref}></div>;
}
```

For other framework examples see the `/rosetta-stone` directory.

### 3. Enjoy Reusable, Framework-Independent Visualizations!

Visualizations implemented with `d3-rosetta` patterns are flexible in that they can be invoked cleanly from components in various frameworks. This makes it a perfect choice for client services agencies who want to streamline their D3 data visualization development, and simultaneously deliver codebases that clients will love. A client uses Vue but your team doesn't? No problem! Need to deliver a `create-react-app` project for compliance purposes? No problem! Just write your visualization logic using these patterns, and your data visualization practice can flourish.

## Core Concepts

### Unidirectional Data Flow

The key to `d3-rosetta`'s flexibility is its adherence to unidirectional data flow. Your visualization function is called every time the state changes, ensuring a consistent and predictable rendering process.

```js
export const main = (container, { state, setState }) => {
  // Your reusable D3-based rendering logic goes here!
  // Calling `setState` triggers a re-execution of `main` with the fresh `state`!
};
```

### Utilities

`d3-rosetta` includes several built-in utilities to make your life easier:

- **`one`**: Simplifies managing single DOM elements within a D3 selection
- **`Memoize`**: Caches expensive computations and reuses them when inputs remain unchanged
- **`StateField`**: Makes it easy to manage individual properties within your state object

### Why d3-rosetta over plain D3?

- **Cross-Framework Compatibility**: Write once, use anywhere
- **Simplified State Management**: Leverage consistent patterns to keep your visualizations dynamic and responsive
- **Less Boilerplate**: Get started faster with less code
- **High Performance**: Optimize when you need to for blazing fast interactions

---

## Recipes

### Using `one` for Simplified DOM Management

```js
const xAxisG = one(selection, 'g', 'x-axis');
```

### Memoizing Expensive Computations

```js
const memoize = Memoize(container);
const computed = memoize(() => a + b, [a, b]);
```

### Managing State Fields with `StateField`

```js
const stateField = StateField({ state, setState });
const [a, setA] = stateField('a');
```

## Comparison with Other Solutions

- **Plain D3**: Great for quick prototypes but can become cumbersome in complex apps
- **Framework-Specific Solutions**: Often involve more boilerplate and less flexibility

## Best Practices

- **Modularize Your Code**: Keep your D3 logic modular to ensure it's reusable across different projects
- **Use Memoization**: Avoid unnecessary recalculations by caching results when appropriate
- **Centralize State Management**: Keep your state logic in one place to maintain clarity and consistency

## Community & Support

Join our [Discord community](https://discord.gg/your-discord-link) to get help, share your work, or contribute to the project!

## Similar Projects

- [Zustand](https://github.com/pmndrs/zustand)
- [D3](https://d3js.org/)
