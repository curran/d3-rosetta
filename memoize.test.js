import { expect, test } from "vitest";
import { memoize } from "./memoize";

test("adds 1 + 2 to equal 3", () => {
  const container = {};
  const memo = memoize(container);
  const computed = memo(() => 1 + 2, []);
  expect(computed).toBe(3);
});

test("does not recompute if dependencies unchanged (zero dependencies)", () => {
  const container = {};
  let invocationCount = 0;
  const main = () => {
    const memo = memoize(container);
    const computed = memo(() => {
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

test("does not recompute if dependencies unchanged (2 dependencies)", () => {
  // test("does recompute if dependencies changed", () => {
  const container = {};
  let invocationCount = 0;
  let a = 1;
  let b = 2;
  const main = () => {
    const memo = memoize(container);
    const computed = memo(() => {
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

test("does recompute if dependencies changed", () => {
  const container = {};
  let invocationCount = 0;
  let a = 1;
  let b = 2;
  const main = () => {
    const memo = memoize(container);
    const computed = memo(() => {
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

test("multiple invocations on one instance", () => {
  const container = {};
  let invocationCountASquared = 0;
  let invocationCountBSquared = 0;
  let a = 1;
  let b = 2;
  const main = () => {
    const memo = memoize(container);

    const aSquared = memo(() => {
      invocationCountASquared++;
      return a * a;
    }, [a]);
    expect(aSquared).toBe(a * a);

    const bSquared = memo(() => {
      invocationCountBSquared++;
      return b * b;
    }, [b]);
    expect(bSquared).toBe(b * b);
  };

  expect(invocationCountASquared).toBe(0);
  expect(invocationCountBSquared).toBe(0);

  main();
  expect(invocationCountASquared).toBe(1);
  expect(invocationCountBSquared).toBe(1);

  main();
  expect(invocationCountASquared).toBe(1);
  expect(invocationCountBSquared).toBe(1);

  a = 2;
  main();
  expect(invocationCountASquared).toBe(2);
  expect(invocationCountBSquared).toBe(1);

  b = 3;
  main();
  expect(invocationCountASquared).toBe(2);
  expect(invocationCountBSquared).toBe(2);

  main();
  expect(invocationCountASquared).toBe(2);
  expect(invocationCountBSquared).toBe(2);

  a = 3;
  b = 4;
  main();
  expect(invocationCountASquared).toBe(3);
  expect(invocationCountBSquared).toBe(3);
});
