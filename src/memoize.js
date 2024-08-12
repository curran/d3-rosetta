export const memoize = (domNodeOrD3Selection) => {
  let invocationCount = 0;
  return (fn, dependencies) => {
    const property = `__d3_rosetta_memoized-${invocationCount}`;
    invocationCount++;
    const domNode = domNodeOrD3Selection.node
      ? domNodeOrD3Selection.node()
      : domNodeOrD3Selection;
    const memoized = domNode[property];
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
    domNode[property] = {
      dependencies,
      fnString,
      value,
    };
    return value;
  };
};
