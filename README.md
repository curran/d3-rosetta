# d3-rosetta

Utilities for authoring D3 rendering logic with maximum compatibility with frameworks.

Example usage: [zoomable-county-choropleth](https://vizhub.com/curran/zoomable-county-choropleth)

## Utilities

### `one`

<b>one</b>(<i>selection</i>, <i>name</i>[, <i>class</i>])

A convenience utility for managing a single element of the given <i>name</i> within the given <i>selection</i>. Optionally a <i>class</i> can be specified to disambiguate between siblings of the same name.

For example, consider the following logic for managing an axis container:

```js
const xAxisG = selection
  .selectAll(`g.x-axis`)
  .data([null])
  .join('g')
  .attr('class', 'x-axis');
```

The above logic can be expressed more concisely as:

```js
const xAxisG = one(selection, 'g', 'x-axis');
```

### `memoize`

<b>memoize</b>(<i>selection</i>)

Invoking `memoize` on a `selection` (a D3 selection or DOM element) creates a new instance of `memo`, a function that can memoize values.

<b>memo</b>(<i>callback</i>,<i>dependencies</i>)

A function that can memoize values by caching the results of `callback` function invocations based on the `dependencies` array. This API is similar to React's `useMemo` hook. It is particularly useful for optimizing expensive calculations in D3 rendering logic by avoiding unnecessary recalculations.

```js
import { memoize } from 'd3-rosetta';
export const main = (container, { state, setState }) => {
  // Assume a and b are numbers that can be updated by the user
  const { a, b } = state;

  const memo = memoize(container);

  const computed = memo(() => {
    // Imagine that this is a very expensive calculation
    return a + b;
  }, [a, b]);
  console.log(computed); // 3
};
```

**WORK IN PROGRESS BELOW - NOT READY FOR USE**

#### The D3 Rosetta Stone for frameworks and plugins

Write your interactive dataviz logic _once_ using vanilla JavaScript and D3. Wrap it as a component in any framework.

This project `d3-rosetta` is two things:

- A library of utilities for simplifying [D3](https://d3js.org/) rendering logic with unidirectional data flow
- A rosetta stone of example implementations of the unidirectional data flow pattern across frameworks

## The Problem: Re-use D3 rendering logic across frameworks

React, Svelte, Vue, Angular, and other frameworks provide various solutions for state management and DOM manipulation. D3 provides data transformation utilities for data visualization and other uses, and can also manipulate the DOM. When a technical challenge in interactive data visualization is solved, ideally that solution can be re-used across various frameworks, thus avoiding the need to re-implement the solution multiple times for multiple frameworks. This is why `d3-rosetta` exists.

Why not re-implement logic in your favorite framework every time? Because D3 is the "best tool for the job" when it comes to:

- Axes
- Transitions
- Behaviors (zoom, drag, brush)

For D3 axes, transitions, and behaviors to work, they really do need access to the DOM. Replicating these in frameworks is notoriously difficult.

## The Solution: Unidirectional Data Flow

One pattern that can be invoked cleanly from multiple frameworks is that of unidirectional data flow. In this paradigm, a single monolithic function is responsible for updating the DOM or otherwise rendering pixels based on updates to a single monolithic state. A similar pattern is commonly seen in React logic with a combination of `useState` and `useEffect`. A simple implementation of unidirectional data flow works well for small problems, but as complexity and data scale up, a need arises for performance optimization. That's why `d3-rosetta` exists; to provide utilities for performance optimization and other needs that commonly arise when working within the unidirectional data flow paradigm.

```js
export const main = (container, { state, setState }) => {
  // Your reusable d3-based rendering logic goes here
};
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

This is the logic implemented in the [VizHub](https://vizhub.com/) runtime environment.

## Usage in React (untested)

Implementing the state management infrastructure that invokes `main` can look like this in React:

```js
import { main } from './viz/index.js';
export const App = () => {
  const [state, setState] = useState({});
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    main(container, { state, setState });
  }, [state]);
  return <div ref={ref} />;
};
```

## Usage in Svelte (untested)

In Svelte, we can leverage reactive statements and the `onMount` lifecycle hook to implement the state management infrastructure that invokes `main`. Here's an example:

```svelte
<script>
  import { onMount } from 'svelte';
  import { main } from './viz/index.js';

  let state = {};
  let container;

  const setState = (next) => {
    state = next(state);
  };

  $: render = () => {
    if (container) {
      main(container, {
        state,
        setState,
      });
    }
  };

  onMount(() => {
    render();
  });
</script>

<div bind:this={container} class="viz-container"></div>

```

## Usage in Vue (untested)

In Vue, we can use the `ref` and `watchEffect` functions from Vue's Composition API to manage state and trigger updates. Here's an example:

```vue
<template>
  <div ref="container" class="viz-container"></div>
</template>

<script>
import { ref, watchEffect, onMounted } from 'vue';
import { main } from './viz/index.js';

export default {
  setup() {
    const state = ref({});
    const container = ref(null);

    const setState = (next) => {
      state.value = next(state.value);
    };

    onMounted(() => {
      watchEffect(() => {
        if (container.value) {
          main(container.value, {
            state: state.value,
            setState,
          });
        }
      });
    });

    return {
      container,
    };
  },
};
</script>
```

In both Svelte and Vue examples, we bind the container DOM element to a variable and use the appropriate lifecycle hooks to manage state updates and re-rendering of the visualization. The `setState` function is responsible for updating the state and re-invoking the `main` function with the new state.

## Usage in Angular (untested)

In Angular, we can use Angular's lifecycle hooks and `@ViewChild` decorator to implement the state management infrastructure that invokes `main`. Here's an example:

```typescript
import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { main } from './viz/index.js';

@Component({
  selector: 'app-root',
  template: `<div #container class="viz-container"></div>`,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('container', { static: true })
  container!: ElementRef;
  private stateSubject = new BehaviorSubject<any>({});
  state$ = this.stateSubject.asObservable();

  setState = (next: (state: any) => any) => {
    const currentState = this.stateSubject.getValue();
    const newState = next(currentState);
    this.stateSubject.next(newState);
  };

  render() {
    main(this.container.nativeElement, {
      state: this.stateSubject.getValue(),
      setState: this.setState,
    });
  }

  ngAfterViewInit() {
    this.state$.subscribe(() => {
      this.render();
    });
  }
}
```

## Memoization

The pattern of unidirectional data flow includes a single monolithic function that executes every time state changes. Therefore, it is likely that not all of the internals of that function must execute on each and every update to the state. Especially for relatively expensive computations like data processing (e.g. filtering or aggregation), it makes sense to avoid recomputing the same derived values unnecessarily. This is the problem solved by memoization.

In React, memoization can be achieved with the `useMemo` hook. The `d3-rosetta` library introduces a similar construct for memoization based on the idea of storing memoized values on the DOM. This approach makes the utility compatible with hot reloading, wherein new code is injected at runtime. If the memoized values were stored in a JavaScript closure, they would be lost on each hot reload. Here's how this memoization utility can be used:

```js
import { memoize } from 'd3-rosetta';
import { loadData } from './loadData';
import { processData } from './processData';

export const main = (container, { state, setState }) => {
  const data = loadData({ state, setState });
  if (!data) return;

  const memo = memoize(container);

  const processedData = memo(
    () => processData(data),
    [data],
  );

  visualize(container, { processedData });
};
```

## Data Fetching

In the unidirectional data flow pattern, data fetching is typically done in a separate function that is called before the main rendering function. This function is responsible for fetching data from an API or other source and updating the state with the new data. Here's an example of how data fetching can be implemented:

```js
const gistURL =
  'https://gist.githubusercontent.com/curran/9729d3a8ef2a874eedf4fc22f349b2fa/raw/79ce147f4bd1914719bedbe156347ad572ec8e3f/react.json';

export const loadData = ({ state, setState }) => {
  if (state.data === undefined) {
    setState((state) => ({
      ...state,
      data: null, // Indicate that data is loading
    }));
    fetch(gistURL)
      .then((response) => response.json())
      .then((data) => {
        setState((state) => ({
          ...state,
          data, // Update state with fetched data
        }));
      });
  }
  return state.data;
};
```

## Measuring Dimensions

A common need when developing data visualizations is to measure the dimensions of the container element and respond to changes in its size. This is useful for creating responsive visualizations that adapt to various screen sizes. Here's an example of how to measure the dimensions of the container element using the ResizeObserver API and unidirectional data flow:

```js
export const measure = ({ state, setState, container }) => {
  const { width, height } = state;
  if (width === undefined) {
    // Set up a ResizeObserver on `container`
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setState((state) => ({ ...state, width, height }));
    });
    resizeObserver.observe(container);
    return null;
  }
  return { width, height };
};
```
