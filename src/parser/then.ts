import { ThenBlock, ThenEventListenerStatement, ThenStatement } from "."
import { addThen } from "../store"

function isThenEventListenerStatement(block: ThenStatement): block is ThenEventListenerStatement {
    return block.type === "eventListener"
}

export const parseThen = (container: HTMLElement, then: ThenBlock) => {
    then.forEach((block) => {
        if (isThenEventListenerStatement(block)) {
            addThen(`(${block.assert.toString()})(${block.name})`)
        }
    })
}