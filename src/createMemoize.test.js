import { expect, test } from 'vitest';
import { createMemoize } from './createMemoize';

test('adds 1 + 2 to equal 3', () => {
  const memoize = createMemoize({});
  expect(memoize(() => 1 + 2, [])).toBe(3);
});

test('does not recompute if dependencies unchanged (zero dependencies)', () => {
  const container = {};
  let invocationCount = 0;
  const main = () => {
    const memoize = createMemoize(container);
    const computed = memoize(() => {
      invocationCount++;
      return 1 + 2;
    }, []);
    expect(computed).toBe(3);
  };

  main();
  expect(invocationCount).toBe(1);
  main();
  expect(invocationCount).toBe(1);
});

test('does not recompute if dependencies unchanged (2 dependencies)', () => {
  const container = {};
  let invocationCount = 0;
  let a = 1;
  let b = 2;
  const main = () => {
    const memoize = createMemoize(container);
    const computed = memoize(() => {
      invocationCount++;
      return a + b;
    }, [a, b]);
    expect(computed).toBe(3);
  };

  main();
  expect(invocationCount).toBe(1);
  main();
  expect(invocationCount).toBe(1);
});

test('does recompute if dependencies changed', () => {
  const container = {};
  let invocationCount = 0;
  let a = 1;
  let b = 2;
  const main = () => {
    const memoize = createMemoize(container);
    const computed = memoize(() => {
      invocationCount++;
      return a + b;
    }, [a, b]);
    expect(computed).toBe(a + b);
  };

  main();
  expect(invocationCount).toBe(1);
  a = 2;
  main();
  expect(invocationCount).toBe(2);
});

test('multiple invocations on one instance', () => {
  let invocationCountASquared = 0;
  let invocationCountBSquared = 0;
  let a = 1;
  let b = 2;
  const main = ({ container }) => {
    const memoize = createMemoize(container);

    const aSquared = memoize(() => {
      invocationCountASquared++;
      return a * a;
    }, [a]);
    expect(aSquared).toBe(a * a);

    const bSquared = memoize(() => {
      invocationCountBSquared++;
      return b * b;
    }, [b]);
    expect(bSquared).toBe(b * b);
  };

  expect(invocationCountASquared).toBe(0);
  expect(invocationCountBSquared).toBe(0);

  const container = {};
  main({ container });
  expect(invocationCountASquared).toBe(1);
  expect(invocationCountBSquared).toBe(1);

  main({ container });
  expect(invocationCountASquared).toBe(1);
  expect(invocationCountBSquared).toBe(1);

  a = 2;
  main({ container });
  expect(invocationCountASquared).toBe(2);
  expect(invocationCountBSquared).toBe(1);

  b = 3;
  main({ container });
  expect(invocationCountASquared).toBe(2);
  expect(invocationCountBSquared).toBe(2);

  main({ container });
  expect(invocationCountASquared).toBe(2);
  expect(invocationCountBSquared).toBe(2);

  a = 3;
  b = 4;
  main({ container });
  expect(invocationCountASquared).toBe(3);
  expect(invocationCountBSquared).toBe(3);
});

test('recomputes if object dependency reference changes, not if content mutates', () => {
  const container = {};
  let callCount = 0;
  let depObj = { val: 1 };

  const run = () => {
    const memoize = createMemoize(container);
    return memoize(() => {
      callCount++;
      return depObj.val * 2;
    }, [depObj]);
  };

  run();
  expect(callCount).toBe(1);

  // Mutate content, but same reference: should not recompute
  depObj.val = 2;
  run();
  expect(callCount).toBe(1); // Still 1 because depObj reference hasn't changed

  // Change reference, even if content is "same": should recompute
  depObj = { val: 2 };
  run();
  expect(callCount).toBe(2);

  // Change reference to new content: should recompute
  depObj = { val: 3 };
  run();
  expect(callCount).toBe(3);
});

test('recomputes if array dependency reference changes, not if content mutates', () => {
  const container = {};
  let callCount = 0;
  let depArray = [1];

  const run = () => {
    const memoize = createMemoize(container);
    return memoize(() => {
      callCount++;
      return depArray[0] * 2;
    }, [depArray]);
  };

  run();
  expect(callCount).toBe(1);

  // Mutate content, but same reference: should not recompute
  depArray[0] = 2;
  run();
  expect(callCount).toBe(1);

  // Change reference, even if content is "same": should recompute
  depArray = [2];
  run();
  expect(callCount).toBe(2);

  // Change reference to new content: should recompute
  depArray = [3];
  run();
  expect(callCount).toBe(3);
});

test('handles null and undefined dependencies correctly', () => {
  const container = {};
  let callCount = 0;
  let dep = null;

  const run = () => {
    const memoize = createMemoize(container);
    return memoize(() => {
      callCount++;
      return String(dep);
    }, [dep]);
  };

  run(); // dep is null
  expect(callCount).toBe(1);
  expect(run()).toBe('null'); // dep is still null
  expect(callCount).toBe(1);

  dep = undefined;
  run(); // dep is undefined
  expect(callCount).toBe(2);
  expect(run()).toBe('undefined'); // dep is still undefined
  expect(callCount).toBe(2);

  dep = null;
  run(); // dep is null again
  expect(callCount).toBe(3);
  expect(run()).toBe('null');
  expect(callCount).toBe(3);
});

test('recomputes if a dependency was NaN and is still NaN', () => {
  const container = {};
  let callCount = 0;
  let dep = NaN;

  const run = () => {
    const memoize = createMemoize(container);
    return memoize(() => {
      callCount++;
      return String(dep);
    }, [dep]);
  };

  run(); // dep is NaN
  expect(callCount).toBe(1);

  // dep is still NaN. Because NaN !== NaN is true, it will recompute.
  run();
  expect(callCount).toBe(2);

  dep = 1;
  run();
  expect(callCount).toBe(3);
  run(); // dep is still 1
  expect(callCount).toBe(3);

  dep = NaN;
  run();
  expect(callCount).toBe(4);
});

// test('accepts a D3 selection', () => {
//   const domNode = {};
//   let invocationCount = 0;
//   let a = 1;
//   let b = 2;
//   const main = () => {
//     const container = { node: () => domNode };
//     const memoize = Memoize(container);
//     const computed = memoize(() => {
//       invocationCount++;
//       return a + b;
//     }, [a, b]);
//     expect(computed).toBe(a + b);
//   };

//   main();
//   expect(invocationCount).toBe(1);
//   a = 2;
//   main();
//   expect(invocationCount).toBe(2);
// });
