import { Definition } from "../..";

export const frame = (definition: Definition, ...inner: any[]) => [
    `const {screen,getByRole,getByLabelText,getByText,} = require("@testing-library/dom");`,
    `const {default: userAction} = require("@testing-library/user-event");`,
    `module.exports = {`,
    `contract: { consumer: ${JSON.stringify(definition.consumer)}, provider: ${JSON.stringify(definition.provider)}, element: ${JSON.stringify(definition.element)} },`,
    `expectedContract: async (container) => {`,
    ...inner,
    `}`,
    `}`]