# d3-rosetta

Utilities for authoring D3 rendering logic with maximum compatibility with frameworks.

Example usage: [zoomable-county-choropleth](https://vizhub.com/curran/zoomable-county-choropleth)

## Utilities

Here’s the reworked documentation for the `one` utility, following the same style as the previous sections:

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

### `Memoize`

**`Memoize(container)`**

The `Memoize` function is a factory function that creates a specialized memoization utility that stores memoized values on the provided `container` (which is either a DOM element or a D3 selection). This utility is designed to optimize expensive calculations within D3 rendering logic by caching the results of those calculations and reusing them when the same inputs are encountered again. This approach minimizes unnecessary recalculations, enhancing the performance of your D3 visualizations.

```js
const memoize = Memoize(container);
```

**`memoize(callback, dependencies)`**

The `memoize` function, created by the `Memoize` factory function, accepts a `callback` function and an array of `dependencies`. It invokes the `callback` only when one or more of the `dependencies` have changed since the last invocation. If the `dependencies` remain the same, the previously cached result is returned, avoiding the need for repeated computation. This pattern is similar to React's `useMemo` hook and is particularly useful in D3 when dealing with computationally intensive tasks.

```js
import { Memoize } from 'd3-rosetta';

export const main = (container, { state, setState }) => {
  const { a, b } = state;
  const memoize = Memoize(container);
  const computed = memoize(() => {
    // Imagine that this is a very expensive calculation
    return a + b;
  }, [a, b]);
  console.log(computed); // Outputs the sum of a and b
};
```

In this example, `Memoize` is used to create a `memoize` function associated with the `container`. This `memoize` function optimizes the sum calculation by caching the result and only recalculating it when `a` or `b` changes.

---

### `StateProperty`

**`StateProperty({ state, setState })`**

The `StateProperty` function is factory function that creates a utility that simplifies the management of individual properties within a state object. It returns a function that allows easy access to a specific state property's value and provides a setter function to update that property. This is particularly useful in complex applications where state is passed down through various components or functions.

```js
const stateProperty = StateProperty({ state, setState });
```

**`stateProperty(fieldName[,defaultValue])`**

The `stateProperty` function, created by the `StateProperty` factory function, binds to a specific property in the state. It returns an array with two elements: the current value of the field and a setter function to update that field. This pattern enables you to manage stateful values in a concise and intuitive way, ensuring that your D3 visualizations remain responsive to changes in state. This pattern is similar to React's `useState` hook.

Example without using `StateProperty`:

```js
export const main = (container, { state, setState }) => {
  const a = state.a;
  const setA = (value) => setState({ ...state, a: value });

  const b = state.b;
  const setB = (value) => setState({ ...state, b: value });

  // ... D3 rendering logic using a, setA, b, and setB
};
```

Example using `StateProperty`:

```js
import { StateProperty } from 'd3-rosetta';

export const main = (container, { state, setState }) => {
  const stateProperty = StateProperty({ state, setState });
  const [a, setA] = stateProperty('a');
  const [b, setB] = stateProperty('b');

  // ... D3 rendering logic using a, setA, b, and setB
};
```
