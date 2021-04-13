import { GivenBlock } from "../../blocks/types"
import { expectEvent } from "../../events"
import { writer } from "../../writer"

export const parseGiven = (container: HTMLElement, given: GivenBlock) => {
    Object.entries(given.props).forEach(([key, value]) => container.setAttribute(key, value))
    Object.entries(given.events).forEach(([key, value]) => expectEvent(container, key, value))
    writer.given(given)
}