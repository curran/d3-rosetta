import { expect, test } from 'vitest';
import { createSideEffect } from './createSideEffect';

test('runs a side effect synchronously', () => {
  const sideEffect = createSideEffect({});
  let result = 0;
  sideEffect(() => {
    result = 1 + 2;
    return () => {
      result = 0; // Optional cleanup function
    };
  }, []);
  expect(result).toBe(3);
});

test('does not re-run if dependencies unchanged (zero dependencies)', () => {
  const container = {};
  let invocationCount = 0;
  let cleanupCount = 0;
  const main = () => {
    const sideEffect = createSideEffect(container);
    sideEffect(() => {
      invocationCount++;
      return () => {
        cleanupCount++;
      };
    }, []);
  };

  main();
  expect(invocationCount).toBe(1);
  expect(cleanupCount).toBe(0);

  main();
  expect(invocationCount).toBe(1);
  expect(cleanupCount).toBe(0);
});

test('does not re-run if dependencies unchanged (2 dependencies)', () => {
  const container = {};
  let invocationCount = 0;
  let cleanupCount = 0;
  let a = 1;
  let b = 2;
  const main = () => {
    const sideEffect = createSideEffect(container);
    sideEffect(() => {
      invocationCount++;
      return () => {
        cleanupCount++;
      };
    }, [a, b]);
  };

  main();
  expect(invocationCount).toBe(1);
  expect(cleanupCount).toBe(0);

  main();
  expect(invocationCount).toBe(1);
  expect(cleanupCount).toBe(0);
});

test('does re-run if dependencies changed, and invokes cleanup function', () => {
  const container = {};
  let invocationCount = 0;
  let cleanupCount = 0;
  let a = 1;
  let b = 2;
  const main = () => {
    const sideEffect = createSideEffect(container);
    sideEffect(() => {
      invocationCount++;
      return () => {
        cleanupCount++;
      };
    }, [a, b]);
  };

  main();
  expect(invocationCount).toBe(1);
  expect(cleanupCount).toBe(0);

  a = 2; // Change dependency
  main();
  expect(invocationCount).toBe(2);
  expect(cleanupCount).toBe(1); // Cleanup from previous effect should run

  main(); // No change
  expect(invocationCount).toBe(2);
  expect(cleanupCount).toBe(1);
});

test('multiple invocations on one instance', () => {
  const container = {};
  let effectAInvocations = 0;
  let cleanupAInvocations = 0;
  let effectBInvocations = 0;
  let cleanupBInvocations = 0;
  let a = 1;
  let b = 2;

  const main = () => {
    const sideEffect = createSideEffect(container);

    sideEffect(() => {
      effectAInvocations++;
      return () => {
        cleanupAInvocations++;
      };
    }, [a]);

    sideEffect(() => {
      effectBInvocations++;
      return () => {
        cleanupBInvocations++;
      };
    }, [b]);
  };

  main();
  expect(effectAInvocations).toBe(1);
  expect(cleanupAInvocations).toBe(0);
  expect(effectBInvocations).toBe(1);
  expect(cleanupBInvocations).toBe(0);

  main(); // No change
  expect(effectAInvocations).toBe(1);
  expect(cleanupAInvocations).toBe(0);
  expect(effectBInvocations).toBe(1);
  expect(cleanupBInvocations).toBe(0);

  a = 2; // Change dependency for effect A
  main();
  expect(effectAInvocations).toBe(2);
  expect(cleanupAInvocations).toBe(1);
  expect(effectBInvocations).toBe(1);
  expect(cleanupBInvocations).toBe(0);

  b = 3; // Change dependency for effect B
  main();
  expect(effectAInvocations).toBe(2);
  expect(cleanupAInvocations).toBe(1);
  expect(effectBInvocations).toBe(2);
  expect(cleanupBInvocations).toBe(1);

  main(); // No change
  expect(effectAInvocations).toBe(2);
  expect(cleanupAInvocations).toBe(1);
  expect(effectBInvocations).toBe(2);
  expect(cleanupBInvocations).toBe(1);

  // TODO test that invoking sideEffect.cleanup() cleans up all effects
  // sideEffect.cleanup();
});
