export const Memoize = (container) => {
  let invocationCount = 0;
  return (callback, dependencies) => {
    const property = `@memoized-${invocationCount}`;
    invocationCount++;
    const node =
      typeof container.node === 'function'
        ? container.node()
        : container;
    const memoized = node[property];
    const callbackString = callback.toString();

    if (
      memoized &&
      dependencies.length ===
        memoized.dependencies.length &&
      memoized.callbackString === callbackString
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
    node[property] = {
      dependencies,
      callbackString,
      value,
    };
    return value;
  };
};
