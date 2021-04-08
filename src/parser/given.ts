import { GivenBlock } from "."
import { expectEvent } from ".."
import { addGiven } from "../store"

export const parseGiven = (container: HTMLElement, given: GivenBlock) => {
    Object.entries(given.props).forEach(([key, value]) => container.setAttribute(key, value))
    Object.entries(given.events).forEach(([key, value]) => expectEvent(container, key, value))
    addGiven(
        ...Object.entries(given.props).map(([key, value]) => `container.setAttribute("${key}", "${value}");`),
        `await new Promise((resolve) => setImmediate(resolve));`,
        ...Object.entries(given.events).map(([key]) => `const ${key} = jest.fn();
container.addEventListener("${key}", ${key});`),
    )
}