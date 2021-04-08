import * as RandExp from "randexp"

const capitalize = (s?: string) => `${s?.charAt(0).toUpperCase()}${s?.slice(1).toLowerCase()}`;

const isRequired = (name: string) => {
  throw new TypeError(`${name} parameter is required`);
};

const getValidText = (text: RegExp | undefined) => 
    text && text.test ? new RandExp(text).gen().toLocaleUpperCase() : (text?.toString() ?? "")

export {capitalize, isRequired, getValidText}