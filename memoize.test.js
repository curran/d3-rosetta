import { expect, test } from "vitest";
import { memoize } from "./memoize";

test("adds 1 + 2 to equal 3", () => {
  const container = {};
  const memo = memoize(container);
  const computed = memo(() => 1 + 2, []);
  expect(computed).toBe(3);
});

test("does not recompute if dependencies unchanged", () => {
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
