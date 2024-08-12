export const memoize = (container) => {
  let invocationCount = 0;
  return (fn, dependencies) => {
    const property = `__d3_rosetta_memoized-${invocationCount}`;
    invocationCount++;
    const node =
      typeof container.node === 'function'
        ? container.node()
        : container;
    const memoized = node[property];
    const fnString = fn.toString();

    if (
      memoized &&
      dependencies.length ===
        memoized.dependencies.length &&
      memoized.fnString === fnString
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

    const value = fn();
    node[property] = {
      dependencies,
      fnString,
      value,
    };
    return value;
  };
};
