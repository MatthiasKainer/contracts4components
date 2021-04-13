// rollup.config.js

import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import filesize from "rollup-plugin-filesize";
import pkg from "./package.json"

export default {
  input: `./src/index.ts`,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  external: [
    "fs",
    "path",
    "react",
    "react-dom",
    "@testing-library/dom",
    "@testing-library/react",
    "@testing-library/user-event",
  ],
  plugins: [
    typescript(),
    replace({ "Reflect.decorate": "undefined", preventAssignment: true }),
    commonjs(),
    resolve({
        preferBuiltins: true
    }),
    terser({
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    filesize({
      showBrotliSize: true,
    }),
  ],
};
