import * as availableQueries from "./queries";

export const replaceQueries = <T>(queries: T = {} as T): T => {
  return {
    ...Object.entries(queries).reduce((prev, [fnName, fn]) => {
      if (availableQueries[fnName]) {
        prev[fnName] = availableQueries[fnName](fn);
      } else {
        console.log(`Query ${fnName} not supported at the moment`);
        prev[fnName] = fn;
      }
      return prev;
    }, {}),
  } as T;
};

