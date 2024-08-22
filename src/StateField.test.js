import { expect, test } from 'vitest';
import { StateField } from './StateField.js';

test('stateField returns the correct state value and setter function', () => {
  const current = {};
  const main = ({ state, setState }) => {
    const stateField = StateField({ state, setState });
    const [name, setName] = stateField('name');
    current.name = name;
    current.setName = setName;
  };

  let state = {};
  const setState = (next) => {
    state = next(state);
    main({ state, setState });
  };

  main({ state, setState });
  expect(current.name).toBe(undefined);

  current.setName('Alice');
  expect(current.name).toBe('Alice');

  current.setName('Bob');
  expect(current.name).toBe('Bob');
});

test('functional setter', () => {
  const current = {};
  const main = ({ state, setState }) => {
    const stateField = StateField({ state, setState });
    const [count, setCount] = stateField('name');
    current.count = count;
    current.setCount = setCount;
  };

  let state = {};
  const setState = (next) => {
    state = next(state);
    main({ state, setState });
  };

  main({ state, setState });
  expect(current.count).toBe(undefined);

  current.setCount((count = 0) => count + 1);
  expect(current.count).toBe(1);

  current.setCount((count = 0) => count + 1);
  expect(current.count).toBe(2);
});
