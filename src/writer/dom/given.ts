import { GivenBlock } from "../../parser";
import { addGiven } from "../../store";

export const given = ({props, events}: GivenBlock) => addGiven(
    ...Object.entries(props).map(([key, value]) => `container.setAttribute("${key}", "${value}");`),
    `await new Promise((resolve) => setImmediate(resolve));`,
    ...Object.entries(events).map(([key]) => `const ${key} = jest.fn();
container.addEventListener("${key}", ${key});`),
)