import { expect, test } from 'vitest';
import { StateProperty } from './StateProperty.js';

test('stateField returns the correct state value and setter function', () => {
  let state = {};
  const setState = (next) => {
    state = next(state);
    main({ state, setState });
  };

  const current = {};
  const main = () => {
    const stateProperty = StateProperty({
      state,
      setState,
    });
    const [name, setName] = stateProperty('name');
    current.name = name;
    current.setName = setName;
  };

  main();
  expect(current.name).toBe(undefined);

  current.setName('Alice');
  expect(current.name).toBe('Alice');

  current.setName('Bob');
  expect(current.name).toBe('Bob');
});

test('functional setter', () => {
  let state = {};
  const setState = (next) => {
    state = next(state);
    main({ state, setState });
  };

  const current = {};
  const main = () => {
    const stateProperty = StateProperty({
      state,
      setState,
    });
    const [count, setCount] = stateProperty('name');
    current.count = count;
    current.setCount = setCount;
  };

  main();
  expect(current.count).toBe(undefined);

  current.setCount((count = 0) => count + 1);
  expect(current.count).toBe(1);

  current.setCount((count = 0) => count + 1);
  expect(current.count).toBe(2);
});
