import { ThenBlock } from "../../blocks/types"
import { writer } from "../../writer"


export const parseThen = (container: HTMLElement, then: ThenBlock) => {
    then.forEach((block) => {
        writer.then(block)
    })
}