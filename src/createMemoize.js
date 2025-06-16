export const createMemoize = (node) => {
  let invocationCount = 0;

  return (callback, dependencies) => {
    const property = `@memoized-${invocationCount++}`;
    const memoized = node[property];

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
      if (dependenciesMatch) {
        return memoized.value;
      }
    }

    const value = callback();
    node[property] = { dependencies, value };
    return value;
  };
};
