// Creates a memoizer function that stores memoized values on a DOM node.
//
// @param { object } container - The DOM node on which to store memoized values.
export const createMemoizer = (node) => {
  // Track the invocation count.
  let invocationCount = 0;

  // Define the memoize function to be returned.
  const memoize = (callback, dependencies) => {
    // Define the property name to use on the DOM node
    // for storing the memoized value of this invocation.
    const property = `@memoized-${invocationCount++}`;

    // Check if there is a memoized value already stored.
    const memoized = node[property];

    // Check if dependencies have changed.
    if (
      memoized &&
      dependencies.length === memoized.dependencies.length
    ) {
      let dependenciesMatch = true;
      for (let i = 0; i < dependencies.length; i++) {
        if (dependencies[i] !== memoized.dependencies[i]) {
          dependenciesMatch = false;
          break;
        }
      }
      // If dependencies have not changed, return the memoized value.
      if (dependenciesMatch) {
        return memoized.value;
      }
    }

    // Otherwise, recompute the value and update the memoized value.
    const value = callback();
    node[property] = { dependencies, value };
    return value;
  };

  return memoize;
};
