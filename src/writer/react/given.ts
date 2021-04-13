import { GivenBlock } from "../../parser";
import { addGiven } from "../../store";

export const given = ({props, events}: GivenBlock) => addGiven(
    ...Object.entries(events).map(([key]) => `const ${key} = jest.fn();`),
    `render(React.createElement(container, {${Object.entries(props).map(([key, value]) => `${key}: "${value}"`).join(",")}, ${Object.entries(events).map(([key]) => `${key}`).join(",")}}))`,
)