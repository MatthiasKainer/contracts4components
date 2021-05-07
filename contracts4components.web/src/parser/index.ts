import { Definition } from "../blocks/types";
import * as dom from "./dom"

export { GivenBlock, WhenStatement, UserActionStatement, QueryStatement, WhenBlock, ThenStatement, ThenEventListenerStatement, ThenBlock, Definition } from "../blocks/types";

export const parse = (container: HTMLElement, definition: Definition) => {
    dom.parseGiven(container, definition.given);
    dom.parseWhen(container, definition.when);
    dom.parseThen(container, definition.then);
}