import { expect, test, vi } from 'vitest';
import { unidirectionalDataFlow } from './unidirectionalDataFlow.js';

test('unidirectionalDataFlow initializes and updates state', () => {
  const container = {}; // Mock container
  const vizMock = vi.fn(); // Mock viz function

  // Initial call
  unidirectionalDataFlow(container, vizMock);

  // Check initial call
  expect(vizMock).toHaveBeenCalledTimes(1);
  expect(vizMock).toHaveBeenCalledWith(
    container,
    {},
    expect.any(Function),
  );

  // Get the setState function from the first call's arguments
  const setState = vizMock.mock.calls[0][2];

  // Simulate a state update
  const newState = { count: 1 };
  setState(() => newState);

  // Check if vizMock was called again with the new state
  expect(vizMock).toHaveBeenCalledTimes(2);
  expect(vizMock).toHaveBeenCalledWith(
    container,
    newState,
    setState,
  );

  // Simulate another state update
  const newerState = { count: 2 };
  setState((prevState) => ({
    ...prevState,
    ...newerState,
  }));

  expect(vizMock).toHaveBeenCalledTimes(3);
  expect(vizMock).toHaveBeenCalledWith(
    container,
    newerState,
    setState,
  );
});

test('unidirectionalDataFlow uses initial state from viz if provided', () => {
  const container = {};
  const initialVizState = { message: 'hello' };

  // viz function that sets an initial state if state is empty
  const vizWithInitialState = (
    container,
    state,
    setState,
  ) => {
    if (Object.keys(state).length === 0) {
      setState(() => initialVizState);
    }
  };

  const vizSpy = vi.fn(vizWithInitialState);

  unidirectionalDataFlow(container, vizSpy);

  // Called once for initialization, then once for setState from within viz
  expect(vizSpy).toHaveBeenCalledTimes(2);
  expect(vizSpy).toHaveBeenNthCalledWith(
    1,
    container,
    {},
    expect.any(Function),
  );
  expect(vizSpy).toHaveBeenNthCalledWith(
    2,
    container,
    initialVizState,
    expect.any(Function),
  );
});
