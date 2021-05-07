import { parse, ThenBlock, ThenEventListenerStatement, UserActionStatement, WhenBlock } from "."
import { cleanStore, toContract } from "../store";

jest.mock("../events", () => ({
    __esModule: true,
    expectEvent: jest.fn()
}))

describe("Parser", () => {
    const searchQuery = { query: "some text" }

    beforeEach(() => {
        cleanStore()
    })

    it("End2End", () => {
        const container = document.createElement("search-form")
        const definition = {
            provider: "checkout",
            consumer: "product-detail",
            element: "search-form",
            given: {
                props: {
                    label: "my search"
                },
                events: {
                    "search": { detail: searchQuery }
                }
            },
            when: [
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
                        },
                        searchQuery.query
                    ]
                },
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
                        }
                    ],
                    triggers: "search"
                } as UserActionStatement
            ] as WhenBlock,
            then: [
                {
                    type: "eventListener",
                    name: "search",
                    assert: (search: jest.Mock) => {
                        expect(search).toBeCalledTimes(1);
                        expect(search.mock.calls[0][0].detail).toEqual(searchQuery);
                    }
                } as ThenEventListenerStatement
            ] as ThenBlock
        }

        parse(container, definition)

        expect(toContract(definition)).toEqual([
            "const {screen,getByRole,getByLabelText,getByText,} = require(\"@testing-library/dom\");",
            "const {default: userAction} = require(\"@testing-library/user-event\");",
            "module.exports = {",
            "contract: { consumer: \"product-detail\", provider: \"checkout\", element: \"search-form\" },",
            "expectedContract: async (container) => {",
            "container.setAttribute(\"label\", \"my search\");",
            "await new Promise((resolve) => setImmediate(resolve));",
            "const search = jest.fn();",
            "container.addEventListener(\"search\", search);",
            "const block_0_0 = screen.getByLabelText(/my search/gi);",
            "const block_0 = userAction.type(block_0_0,\"some text\");",
            "const block_1_0 = screen.getByRole(\"button\",{ name: /search/i });",
            "const block_1 = userAction.click(block_1_0);",
            "(function (search) {",
            "expect(search).toBeCalledTimes(1);",
            "expect(search.mock.calls[0][0].detail).toEqual(searchQuery);",
            "})(search)",
            "}",
            "}",
        ])
    })
})