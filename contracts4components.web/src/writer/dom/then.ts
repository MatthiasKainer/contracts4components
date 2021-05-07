import { isThenEventListenerStatement } from "../../blocks/types";
import { ThenBlock, ThenStatement } from "../../parser";
import { addThen } from "../../store";

export const then = (statement: ThenStatement) => {
    if (isThenEventListenerStatement(statement)) {
        addThen(`(${statement.assert.toString()})(${statement.name})`)
    }
}
    