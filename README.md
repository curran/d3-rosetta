# d3-rosetta

The [D3](https://d3js.org/) Rosetta Stone for maximum framework interoperability

WORK IN PROGRESS - NOT READY FOR USE

## The Problem: Re-use D3-based logic across component frameworks

React, Svelte, Vue, Angular and other frameworks provide various solutions for state management and DOM manipulation. D3 provides data transormation utilities for data visualization and other uses, and can also manipulate the DOM. When a technical challenge in interactive data visualization is solved, ideally that solution an be re-used across various frameworks, thus avoiding the need to re-implement the solution multiple times for multiple frameworks. This is why `d3-rosetta` exists.

Why not re-implement logic in your favorite framework every time? Because D3 is the "best tool for the job" when it comes to:
- Axes
- Transitions
- Behaviors (zoom, drag, brush)

For D3 axes, transitions, and behaviors to work, they really do need access to the DOM. Replicating these in frameworks is notoriously difficult.

## Unidirectional Data Flow

One pattern that can be invoked cleanly from multiple frameworks is that of unidirectional data flow. In this paradigm, a single monolithic function is responsible for updating the DOM or otherwise rendering pixels based on updates to a single monolithic state. A similar pattern is commonly seen in React logic with a combination of `useState` and `useEffect`. A simple implementation of unidirectional data flow works well for small problems, but as complexity and data scale up, a need arises for performance optimization. That's why `d3-rosetta` exists; to provide utilities for performance optimization and other needs that commonly arise when working within the unidirectional data flow paradigm.

```js
export const main = (container, { state, setState }) => {
  // Your reusable d3-based rendering logic goes here
}
```

The above code snippet defines `main`, the entry point of our rendering logic.

- `container` is a DIV DOM element
- `state` is initially an empty object `{}` and can be updated using `setState`
- `setState` is a function that updates the state using [immutable update patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns)

Whenever `setState` is invoked, `main` is executed _again_ and passed the new definition of `state`. Therefore `main` needs to be [idempotent](https://en.wikipedia.org/wiki/Idempotence), in other words `main` needs to be able to run multiple times without causing problems.

## Usage in Vanilla JS

Implementing the state management infrastructure that invokes `main` can look like this in Vanilla JS:

```js
import { main } from './viz/index.js';

let state = {};

const container = document.querySelector('.viz-container');

const render = () => {
  main(container, {
    state,
    setState,
  });
};

const setState = (next) => {
  state = next(state);
  render();
};

render();
```


## Usage in React


Implementing the state management infrastructure that invokes `main` can look like this in Vanilla JS (plus [Vite hot module replacement](https://vitejs.dev/guide/api-hmr)):

```js
import { main } from './viz/index.js';
export const App = () => {
  const [state, setState] = useState({});
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    main(container, { state, setState });
  },[state])
  return <div ref={ref}/>;
}
```

## Usage in Svelte
## Usage in Vue



## Memoization

The pattern of unidirectional data flow includes a single monolithic function that executes every time state changes. Therefore, it is likely that not all of the internals of that function must execute on each and every update to the state. Especially for relatively expensive computations like data processing (e.g. filtering or aggregation), it makes sense to avoid recomputing the same derived values unnecessarily. This is the problem solved by memoization.

In React, memoization can be achieved with the `useMemo` hook. The `d3-rosetta` library introduces a similar construct for memoization based on the idea of storing memoized values on the DOM. This approach makes the utility compatible with hot reloading, wherein new code is injected at runtime. If the memoized values were stored in a JavaScript closure, they would be lost on each hot reload. Here's how this memoization utility can be used:

```js
import { Memoize } from 'd3-rosetta';
import { processData } from './processData';

export const main = (container, { state, setState }) => {

  const data = loadData({ state, setState });
  if(!data) return;

  const memoize = Memoize(container);

  const processedData = memoize(() => {
    return processData(data);
  }, [
    data
  ]);

  visualize(container, { processedData });
}
```




