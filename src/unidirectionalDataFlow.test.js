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
