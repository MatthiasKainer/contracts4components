import { ThenBlock, ThenEventListenerStatement, UserActionStatement, WhenBlock } from "../../../src/parser";
import {testForReact} from "../../../src"
import * as path from "path"
import { toContract } from "../../../src/store";

describe("consumer <search molecule>", () => {

    it("provides a valid component", async () => {
        // given
        const container = document.createElement("search-form")
        const definition = {
            provider: "search",
            consumer: "navigation",
            element: "SearchForm",
            given: {
                props: {
                    label: "my search"
                },
                events: {
                    "search": { detail: { query: "some text" } }
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
                        "some text"
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
                        expect(search.mock.calls[0][0].detail).toEqual({ query: "some text" });
                    }
                } as ThenEventListenerStatement
            ] as ThenBlock
        }
        
        await testForReact(container, definition, {
            url: "http://localhost:8097/contracts"
        })
        expect(toContract(definition)).toMatchSnapshot()
        expect(container.outerHTML).toMatchSnapshot()
    })
})