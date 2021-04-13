import { QueryStatement, UserActionStatement, WhenBlock } from "../../blocks/types"
import { getByLabelText, getByRole } from "@testing-library/dom";
import { cleanStore, toContract } from "../../store";
import { parseWhen } from "./when";

jest.mock("../../events", () => ({
    __esModule: true,
    expectEvent: jest.fn()
}))

describe("Parser", () => {
    const searchQuery = { query: "some text" }

    beforeEach(() => {
        cleanStore()
    })
    
    it("When block", () => {
        const container = document.createElement("search-form")
        const when: WhenBlock = [
            {
                type: "userAction",
                action: "type",
                args: [
                    {
                        type: "query",
                        action: "getByLabelText",
                        args: [
                            /my search/gi
                        ]
                    } as QueryStatement,
                    searchQuery.query
                ]
            } as UserActionStatement,
            {
                type: "userAction",
                action: "click",
                args: [
                    {
                        type: "query",
                        action: "getByRole",
                        args: [
                            "button",
                            { name: /search/i }
                        ]
                    } as QueryStatement
                ],
                triggers: "search"
            } as UserActionStatement
        ];
        parseWhen(container, when)
        // elements have been added
        expect(() => getByLabelText(container, /my search/gi)).not.toThrowError()
        expect(() => getByRole(container, "button", { name: /search/i })).not.toThrowError()

        expect(toContract()).toEqual([
            "const {getByRole,getByLabelText,getByText,} = require(\"@testing-library/dom\");",
            "const {default: userAction} = require(\"@testing-library/user-event\");",
            "module.exports = {",
            "expectedContract: async (container) => {",
            "const block_0_0 = getByLabelText(container,/my search/gi);",
            "const block_0 = userAction.type(block_0_0,\"some text\");",
            "const block_1_0 = getByRole(container,\"button\",{ name: /search/i });",
            "const block_1 = userAction.click(block_1_0);",
            "}",
            "}",
        ])
    })

})