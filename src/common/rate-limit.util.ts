export const delay = (maximumRequestPerSecond: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(1), 1000 / (maximumRequestPerSecond - 10));
  });
};
