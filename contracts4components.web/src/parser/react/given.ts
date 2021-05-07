import { GivenBlock } from "../../blocks/types"
import { expectEvent } from "../../events"
import { writer } from "../../writer"

const createAttribute = (container: HTMLElement, key: string, value: string | object) => {
    if (typeof value === "string") {
        container.setAttribute(key, value)
    } else {
        container[key] = value
    }
}

export const parseGiven = (container: HTMLElement, given: GivenBlock) => {
    Object.entries(given.props).forEach(([key, value]) => createAttribute(container, key, value))
    Object.entries(given.events).forEach(([key, value]) => expectEvent(container, key, value))
    writer().given(given)
}