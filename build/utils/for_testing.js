"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reverse = (str) => {
    return str.split("").reverse().join("");
};
const average = (array) => {
    const reducer = (sum, item) => {
        return sum + item;
    };
    return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};
exports.default = {
    reverse,
    average,
};
