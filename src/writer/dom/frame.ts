export const frame = (...inner: any[]) => [
    `const {screen,getByRole,getByLabelText,getByText,} = require("@testing-library/dom");`,
    `const {default: userAction} = require("@testing-library/user-event");`,
    `module.exports = {`,
    `expectedContract: async (container) => {`,
    ...inner,
    `}`,
    `}`]