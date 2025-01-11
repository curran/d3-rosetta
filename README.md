# d3-rosetta

## The D3 Rosetta Stone for Frameworks and Plugins

**Write your interactive data visualization logic once using vanilla JavaScript and D3, and wrap it as a component in any framework.**

`d3-rosetta` serves two main purposes:

- **A utility library** for simplifying [D3](https://d3js.org/) rendering logic with unidirectional data flow
- **A rosetta stone** of example implementations of the unidirectional data flow pattern across various frameworks (work in progress)

https://github.com/user-attachments/assets/c23aa1c2-f86b-4f7e-9ff4-979987cd090f

Fully working examples:

- [US States with Hover](https://vizhub.com/curran/us-states-with-hover?edit=files&file=index.js) - leverages utilities `one`, `stateField`, and `memoize` which makes the interaction so snappy!
- [Multidimensional Filtering](https://vizhub.com/curran/multidimensional-filtering) - brushing on multiple histograms with filtering - a solution to a classic complex problem with interactive visualization

### The Problem: Re-using D3 Rendering Logic Across Frameworks

While frameworks like React, Svelte, Vue, and Angular offer state management and DOM manipulation solutions, D3 excels in data transformation and visualization, particularly with axes, transitions, and behaviors (e.g. zoom, drag, and brush). These D3 features require direct access to the DOM, making it challenging to replicate them effectively within frameworks.

### The Solution: Unidirectional Data Flow

Unidirectional data flow is a pattern that can be cleanly invoked from multiple frameworks. In this paradigm, a single function is responsible for updating the DOM or rendering visuals based on a single, central state. As the state updates, the function re-renders the visualization in an idempotent manner, meaning it can run multiple times without causing side effects. Here's what the entry point function looks like for a D3-based visualization that uses unidirectional data flow:

```js
export const main = (container, { state, setState }) => {
  // Your reusable D3-based rendering logic goes here
};
```

- **`container`**: A DOM element where the visualization will be rendered
- **`state`**: An object representing the current state of the application, initially empty
- **`setState`**: A function that updates the state using immutable update patterns

Whenever `setState` is invoked, `main` re-executes with the new state, ensuring that the rendering logic is both dynamic and responsive. This pattern is implemented in the [VizHub](https://vizhub.com/) runtime environment and can be invoked from different frameworks as needed.

## Utilities

`d3-rosetta` provides several utilities designed to enhance the unidirectional data flow pattern by optimizing performance and simplifying common tasks in D3-based visualizations.

- [`one`](#one) - Simplifies the management of single DOM elements within a D3 selection
- [`createMemoizer`](#createMemoizer) - Optimizes expensive calculations by caching results and reusing them when the same inputs are encountered
- [`setter`](#setter) - Simplifies the management of individual properties within a state object
- [`unidirectionalDataFlow`](#unidirectionalDataFlow) - Creates a self-contained unidirectional data flow system with hot reload support

---

### `one`

**`one(selection, tagName[, className])`**

The `one` function is a convenience utility designed to simplify the management of single DOM elements within a D3 selection. It ensures that only one element of the specified `tagName` exists within the given `selection`. Ooptionally, it can also apply a `className` to disambiguate between siblings of the same tag.

#### Example:

Consider the following traditional D3 logic for managing an axis container:

```js
const xAxisG = selection
  .selectAll('g.x-axis')
  .data([null])
  .join('g')
  .attr('class', 'x-axis');
```

This can be expressed more concisely using `one`:

```js
const xAxisG = one(selection, 'g', 'x-axis');
```

In this example, `one` simplifies the creation and management of a single `g` element with the class `x-axis` within the `selection`. This utility reduces boilerplate code and enhances the clarity of your D3 logic, particularly when dealing with elements that should only have a single instance within a selection.

---

### `createMemoizer`

**`createMemoizer(container)`**

The `createMemoizer` function creates a specialized memoization utility that stores memoized values on the provided `container` (which is either a DOM element or a D3 selection). This utility optimizes expensive calculations within D3 rendering logic by caching results and reusing them when the same inputs are encountered again. This minimizes unnecessary recalculations, enhancing visualization performance.

```js
const memoize = createMemoizer(container);
```

**`memoize(callback, dependencies)`**

The `memoize` function accepts a `callback` function and an array of `dependencies`. It invokes the `callback` only when dependencies have changed since the last invocation. If dependencies remain the same, it returns the cached result. This pattern is similar to React's `useMemo` hook and is particularly useful for computationally intensive data processing or DOM rendering operations.

```js
import { createMemoizer } from 'd3-rosetta';

export const main = (container, { state, setState }) => {
  const { a, b } = state;
  const memoize = createMemoizer(container);
  const computed = memoize(() => {
    // Imagine that this is a very expensive calculation
    return a + b;
  }, [a, b]);
  console.log(computed); // Outputs the sum of a and b
};
```

---

### `setter`

**`setter(setState, propertyName)`**

The `setter` function creates a specialized setter function for managing individual properties within the state object. It returns a function that updates a specific property while preserving the rest of the state.

```js
import { setter } from 'd3-rosetta';

export const main = (container, { state, setState }) => {
  const setName = setter(setState, 'name');

  // Later in your code:
  setName('Alice'); // Updates state.name to 'Alice'
};
```

This utility simplifies state management by providing a clean way to update individual properties without manually spreading the state object. For reference, here's what it would look like without `setter`:

```js
const setName = (name) => {
  setState((prev) => ({ ...prev, name }));
};
```

If you need to update multiple properties at once, you can use the `setState` function directly. However, for updating individual properties, `setter` offers a more concise and readable alternative.

---

### `unidirectionalDataFlow`

**`unidirectionalDataFlow({ container, main })`**

The `unidirectionalDataFlow` function creates a self-contained unidirectional data flow system. It manages state updates and rendering, while also supporting hot reloading for development workflows.

```js
import { unidirectionalDataFlow } from 'd3-rosetta';

const app = unidirectionalDataFlow({
  container,
  main: (container, { state, setState }) => {
    // Your visualization logic here
  },
});
```

The function returns an object with a `hotReload` method that can be used to update the main rendering function while preserving state:

```js
// During development, when the main function changes:
app.hotReload((container, { state, setState }) => {
  // Updated visualization logic
});
```

This utility eliminates the need to manually implement the state management infrastructure shown in the vanilla JS example below. It's particularly useful during development when you want to iterate on your visualization code while maintaining the current state.

## Rosetta Stone

### Vanilla JS

Here's how you can implement the state management infrastructure for unidirectional data flow in vanilla JavaScript, using the `unidirectionalDataFlow` utility:

```js
import { unidirectionalDataFlow } from 'd3-rosetta';
import { main } from './viz';
const container = document.querySelector('.viz-container');
unidirectionalDataFlow({ container, main });
```

### React

Here's an example of how it can be used in a React component:

```jsx
import { useEffect, useRef, useState } from 'react';
import { main } from './viz';
export const App = () => {
  const ref = useRef(null);
  const [state, setState] = useState({});

  useEffect(() => {
    const container = ref.current;
    main(container, { state, setState });
  }, [state]);

  return <div className="viz-container" ref={ref}></div>;
};
```

### Svelte

Here's an example of how it can be used in a Svelte component:

```svelte
<script>
  import { onMount } from 'svelte';
  import { main } from './viz';
  let container;
  let state = {};
  
  const setState = (next) => {
    state = next(state);
    main(container, { state, setState });
  };

  onMount(() => {
    main(container, { state, setState });
  });
</script>

<div bind:this={container} class="viz-container"></div>
```

### Vue

Here's an example of how it can be used in a Vue component:

```vue
<template>
  <div ref="container" class="viz-container"></div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';
import { main } from './viz';

export default {
  setup() {
    const container = ref(null);
    const state = reactive({});

    const setState = (next) => {
      const newState = next(state);
      Object.assign(state, newState);
      main(container.value, { state, setState });
    };

    onMounted(() => {
      main(container.value, { state, setState });
    });

    return { container };
  },
};
</script>
```

### Angular

Here's an example of how it can be used in an Angular component:

```typescript
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { main } from './viz';

@Component({
  selector: 'app-viz',
  template: '<div class="viz-container" #container></div>',
})
export class VizComponent implements AfterViewInit {
  @ViewChild('container') containerRef!: ElementRef;
  private state = {};

  constructor() {}

  ngAfterViewInit(): void {
    const container = this.containerRef.nativeElement;
    const setState = (next: (state: any) => any) => {
      this.state = next(this.state);
      main(container, { state: this.state, setState });
    };
    
    main(container, { state: this.state, setState });
  }
}
```
