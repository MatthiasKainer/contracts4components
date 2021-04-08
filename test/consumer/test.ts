import { ThenBlock, ThenEventListenerStatement, UserActionStatement, WhenBlock } from "../../src/parser";
import {test} from "../../src"
import * as path from "path"
import { toContract } from "../../src/store";

describe("consumer <search molecule>", () => {

    it("provides a valid component", async () => {
        // given
        const searchQuery = { query: "some text" }
        const container = document.createElement("search-form")
        const definition = {
            provider: "search",
            consumer: "navigation",
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
                                container,
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
                                container,
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
        
        expect(await test(container, definition, path.join(__dirname, ".."))).toMatchSnapshot()
        expect(toContract()).toMatchSnapshot()
        expect(container.outerHTML).toMatchSnapshot()
    })
})