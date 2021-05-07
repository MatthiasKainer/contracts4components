import * as availableActions from "./userActions"

export const replaceActions = <T>(actions: T = {} as T): T => {
    return {
      ...Object.entries(actions).reduce((prev, [fnName, fn]) => {
        if (availableActions[fnName]) {
          prev[fnName] = availableActions[fnName](fn);
        } else {
          console.log(`Query ${fnName} not supported at the moment`);
          prev[fnName] = fn;
        }
        return prev;
      }, {}),
    } as T;
  };
  