import { parseGiven } from "./given";
import { parseThen } from "./then";
import { Definition } from "./types";
import { parseWhen } from "./when";

export { GivenBlock, WhenStatement, UserActionStatement, QueryStatement, WhenBlock, ThenStatement, ThenEventListenerStatement, ThenBlock, Definition } from "./types";

export const parse = (container: HTMLElement, definition: Definition) => {
    parseGiven(container, definition.given);
    parseWhen(container, definition.when);
    parseThen(container, definition.then);
}