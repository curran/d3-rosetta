export const createSideEffect = (node) => {
  let invocationCount = 0;

  const sideEffect = (effect, dependencies) => {
    const property = `@side-effect-${invocationCount++}`;
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
        return;
      }
    }

    if (memoized && memoized.cleanup) {
      memoized.cleanup();
    }

    const cleanup = effect();
    node[property] = { dependencies, cleanup };
  };

  sideEffect.cleanup = () => {
    Object.keys(node).forEach((key) => {
      if (key.startsWith('@side-effect-')) {
        const memoized = node[key];
        if (memoized && memoized.cleanup) {
          memoized.cleanup();
        }
        delete node[key];
      }
    });
  };

  return sideEffect;
};
