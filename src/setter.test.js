import { expect, test } from 'vitest';
import { setter } from './setter.js';

test('stateField returns the correct state value and setter function', () => {
  const current = {};
  const main = ({ state, setState }) => {
    current.name = state.name;
    current.setName = setter(setState, 'name');
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
