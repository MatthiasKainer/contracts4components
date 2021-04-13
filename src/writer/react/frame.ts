export const frame = (...inner: any[]) => [
    `const React = require("react");`,
    `const {screen, render} = require("@testing-library/react");`,
    `const {default: userAction} = require("@testing-library/user-event");`,
    `module.exports = {`,
    `expectedContract: async (container) => {`,
    ...inner,
    `}`,
    `}`]