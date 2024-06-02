import { test, describe } from "node:test";
import assert from "node:assert";
import input from "../utils/for_testing";

describe("average", () => {
  test("of one value is the value itself", () => {
    assert.strictEqual(input.average([1]), 1);
  });

  test("of many is calculated right", () => {
    assert.strictEqual(input.average([1, 2, 3, 4, 5, 6]), 3.5);
  });

  test("of empty array is zero", () => {
    assert.strictEqual(input.average([]), 0);
  });
});
