import { test } from "node:test";
import assert from "node:assert";

import input from "../utils/for_testing";

test("reverse of a", () => {
  const result = input.reverse("a");
  assert.strictEqual(result, "a");
});

test("reverse of react", () => {
  const result = input.reverse("react");

  assert.strictEqual(result, "tcaer");
});


