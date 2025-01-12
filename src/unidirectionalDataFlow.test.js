import { expect, test } from 'vitest';
import { unidirectionalDataFlow } from './unidirectionalDataFlow';

test('initializes with empty state', () => {
  let renderedState;
  const container = {};

  unidirectionalDataFlow({
    container,
    main: (container, { state }) => {
      renderedState = state;
    },
  });

  expect(renderedState).toEqual({});
});

test('calls cleanup function before re-rendering', () => {
  let cleanupCalled = 0;
  let renderCount = 0;
  let setterFunction;
  const container = {};

  const app = unidirectionalDataFlow({
    container,
    main: (container, { state, setState }) => {
      renderCount++;
      setterFunction = setState;
      return () => {
        cleanupCalled++;
      };
    },
  });

  expect(renderCount).toBe(1);
  expect(cleanupCalled).toBe(0);

  // Test cleanup during setState
  setterFunction((state) => ({ ...state, count: 1 }));
  expect(cleanupCalled).toBe(1);
  expect(renderCount).toBe(2);

  // Test cleanup during hot reload
  app.hotReload((container, { state, setState }) => {
    renderCount++;
    return () => {
      cleanupCalled++;
    };
  });

  expect(cleanupCalled).toBe(2);
  expect(renderCount).toBe(3);
});

test('setState updates state and triggers render', () => {
  let renderedState;
  let setterFunction;
  const container = {};

  unidirectionalDataFlow({
    container,
    main: (container, { state, setState }) => {
      renderedState = state;
      setterFunction = setState;
    },
  });

  setterFunction((state) => ({ ...state, count: 1 }));
  expect(renderedState).toEqual({ count: 1 });

  setterFunction((state) => ({ ...state, count: 2 }));
  expect(renderedState).toEqual({ count: 2 });
});

test('hot reload updates main function and rerenders', () => {
  let renderCount = 0;
  const container = {};

  const app = unidirectionalDataFlow({
    container,
    main: (container, { state }) => {
      renderCount++;
    },
  });

  expect(renderCount).toBe(1);

  app.hotReload((container, { state }) => {
    renderCount++;
  });

  expect(renderCount).toBe(2);
});

test('maintains state during hot reload', () => {
  let renderedState;
  let setterFunction;
  const container = {};

  const app = unidirectionalDataFlow({
    container,
    main: (container, { state, setState }) => {
      renderedState = state;
      setterFunction = setState;
    },
  });

  setterFunction((state) => ({ ...state, count: 42 }));
  expect(renderedState).toEqual({ count: 42 });

  app.hotReload((container, { state, setState }) => {
    renderedState = state;
    setterFunction = setState;
  });

  expect(renderedState).toEqual({ count: 42 });
});
