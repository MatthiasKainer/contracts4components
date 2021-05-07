import RandExp from "randexp"

const capitalize = (s?: string) => `${s?.charAt(0).toUpperCase()}${s?.slice(1).toLowerCase()}`;

const isRequired = (name: string) => {
  throw new TypeError(`${name} parameter is required`);
};

const getValidText = (text: RegExp | undefined) =>
  text && text.test ? new RandExp(text).gen().toLocaleUpperCase() : (text?.toString() ?? "")

const parameterize = (arg: any) => {
  if (arg.test) {
    return arg
  }
  if (arg instanceof HTMLElement) {
    // naive assumption that every non-resolved instance is the container...
    return "container"
  }
  if ("string" === typeof arg) {
    return JSON.stringify(arg)
  }
  if ("object" === typeof arg) {
    return `{ ${Object.entries(arg).map(([key, value]) => `${key}: ${parameterize(value)}`).join(",")} }`
  }
  if ("function" === typeof arg) {
    return `(${arg.toString()})()`
  }

  return arg
}

const javaDateNow = () => {
  /*
  [
      2021,
      6,
      12,
      0,
      0
  ]
  */
  const date = new Date(Date.now())
  return [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDay(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  ]
}

export { capitalize, isRequired, getValidText, parameterize, javaDateNow }