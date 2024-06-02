"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const for_testing_1 = __importDefault(require("../utils/for_testing"));
(0, node_test_1.test)("reverse of a", () => {
    const result = for_testing_1.default.reverse("a");
    node_assert_1.default.strictEqual(result, "a");
});
(0, node_test_1.test)("reverse of react", () => {
    const result = for_testing_1.default.reverse("react");
    node_assert_1.default.strictEqual(result, "tcaer");
});
