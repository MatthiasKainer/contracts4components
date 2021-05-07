import { GivenBlock } from "../../parser";
import { addGiven } from "../../store";
import { parameterize } from "../../utils";

export const given = ({props, events}: GivenBlock) => addGiven(
    ...Object.entries(events).map(([key]) => `const ${key} = jest.fn();`),
    `render(React.createElement(container, {${Object.entries(props).map(([key, value]) => `${key}: ${parameterize(value)}`).join(",")}${Object.entries(props).length > 0 ? ", " : ""}${Object.entries(events).map(([key]) => `${key}`).join(",")}}))`,
)