const reverse = (str: string) => {
  return str.split("").reverse().join("");
};

const average = (array: []) => {
  const reducer = (sum: number, item: number) => {
    return sum + item;
  };

  return array.reduce(reducer, 0) / array.length;
};

export default {
  reverse,
  average,
};
