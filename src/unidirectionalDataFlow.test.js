import { expect, test, vi } from 'vitest';
import { unidirectionalDataFlow } from './unidirectionalDataFlow.js';

test('unidirectionalDataFlow initializes and updates state', () => {
  const container = {}; // Mock container
  const mainMock = vi.fn(); // Mock main function

  // Initial call
  unidirectionalDataFlow(container, mainMock);

  // Check initial call
  expect(mainMock).toHaveBeenCalledTimes(1);
  expect(mainMock).toHaveBeenCalledWith(container, {
    state: {},
    setState: expect.any(Function),
  });

  // Get the setState function from the first call's arguments
  const { setState } = mainMock.mock.calls[0][1];

  // Simulate a state update
  const newState = { count: 1 };
  setState(() => newState);

  // Check if mainMock was called again with the new state
  expect(mainMock).toHaveBeenCalledTimes(2);
  expect(mainMock).toHaveBeenCalledWith(container, {
    state: newState,
    setState,
  });

  // Simulate another state update
  const newerState = { count: 2 };
  setState((prevState) => ({
    ...prevState,
    ...newerState,
  }));

  expect(mainMock).toHaveBeenCalledTimes(3);
  expect(mainMock).toHaveBeenCalledWith(container, {
    state: newerState,
    setState,
  });
});

test('unidirectionalDataFlow uses initial state from main if provided', () => {
  const container = {};
  const initialMainState = { message: 'hello' };

  // main function that sets an initial state if state is empty
  const mainWithInitialState = (
    container,
    { state, setState },
  ) => {
    if (Object.keys(state).length === 0) {
      setState(() => initialMainState);
    }
  };

  const mainSpy = vi.fn(mainWithInitialState);

  unidirectionalDataFlow(container, mainSpy);

  // Called once for initialization, then once for setState from within main
  expect(mainSpy).toHaveBeenCalledTimes(2);
  expect(mainSpy).toHaveBeenNthCalledWith(1, container, {
    state: {},
    setState: expect.any(Function),
  });
  expect(mainSpy).toHaveBeenNthCalledWith(2, container, {
    state: initialMainState,
    setState: expect.any(Function),
  });
});
