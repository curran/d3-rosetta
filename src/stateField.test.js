import { expect, test } from 'vitest';
import { stateField } from './stateField.js';

test('stateField returns the correct state value and setter function', () => {
  let state = {};
  const setState = (next) => {
    state = next(state);
    main({ state, setState });
  };

  const current = {};
  const main = () => {
    const field = stateField({ state, setState });
    const [name, setName] = field('name', 'Alice');
    current.name = name;
    current.setName = setName;
  };

  main();
  expect(current.name).toBe('Alice');

  current.setName('Bob');
  expect(current.name).toBe('Bob');
});
