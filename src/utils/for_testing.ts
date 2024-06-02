const reverse = (str: string) => {
  return str.split("").reverse().join("");
};

const average = (array: number[]) => {
  const reducer = (sum: number, item: number) => {
    return sum + item;
  };

  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

export default {
  reverse,
  average,
};
