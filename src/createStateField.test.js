import { expect, test } from 'vitest';
import { createStateField } from './createStateField.js';
import { unidirectionalDataFlow } from './unidirectionalDataFlow.js';

test('createStateField returns the correct state value and setter function using unidirectionalDataFlow', () => {
  const mockContainer = {}; // Mock container for unidirectionalDataFlow
  const testScope = {}; // To store values/setters from main for assertions
  // The main function will be called by unidirectionalDataFlow on init and after each setState
  const main = (container, { state, setState }) => {
    const stateField = createStateField(state, setState);
    const [name, setName] = stateField('name');
    testScope.name = name;
    testScope.setName = setName;

    const [age, setAge] = stateField('age');
    testScope.age = age;
    testScope.setAge = setAge;

    // Store the current state for direct verification if needed
    testScope.currentState = state;
  };

  // Initialize unidirectionalDataFlow. This will call main once.
  // unidirectionalDataFlow's internal state starts as {}.
  unidirectionalDataFlow(mockContainer, main);

  // Initial checks (after first main run)
  // `name` and `age` will be undefined as they don't exist in UDF's initial {} state.
  expect(testScope.name).toBe(undefined);
  expect(testScope.currentState.name).toBe(undefined);
  expect(testScope.age).toBe(undefined);
  expect(testScope.currentState.age).toBe(undefined);

  // Test setting name
  testScope.setName('Alice'); // This triggers setState in UDF, then UDF calls main again
  // After main runs, testScope.name and testScope.currentState are updated
  expect(testScope.name).toBe('Alice');
  expect(testScope.currentState.name).toBe('Alice');

  testScope.setName('Bob');
  expect(testScope.name).toBe('Bob');
  expect(testScope.currentState.name).toBe('Bob');

  // Test setting age
  testScope.setAge(30);
  expect(testScope.age).toBe(30);
  expect(testScope.currentState.age).toBe(30);
  // Name should be unaffected
  expect(testScope.name).toBe('Bob');
  expect(testScope.currentState.name).toBe('Bob');

  testScope.setAge(31);
  expect(testScope.age).toBe(31);
  expect(testScope.currentState.age).toBe(31);

  // Test that setting one field does not affect the other
  testScope.setName('Charlie');
  expect(testScope.name).toBe('Charlie');
  expect(testScope.currentState.name).toBe('Charlie');
  // Age should remain unchanged from its last update
  expect(testScope.age).toBe(31);
  expect(testScope.currentState.age).toBe(31);

  testScope.setAge(32);
  expect(testScope.name).toBe('Charlie'); // Name should remain unchanged
  expect(testScope.currentState.name).toBe('Charlie');
  expect(testScope.age).toBe(32);
  expect(testScope.currentState.age).toBe(32);
});
