import { Definition, setAsReact } from "../..";
import { expectEvent } from "../../events";
import { cleanStore, toContract } from "../../store";
import { parseGiven } from "./given";

jest.mock("../../events", () => ({
    __esModule: true,
    expectEvent: jest.fn()
}))

describe("Parser", () => {
    const searchQuery = { query: "some text" }

    beforeEach(() => {
        setAsReact()
        cleanStore()
    })

    it("Given block", () => {
        const container = document.createElement("search-form")
        const given = {
            props: {
                label: "my search"
            },
            events: {
                "search": { detail: searchQuery }
            }
        }

        parseGiven(container, given)

        expect(container.getAttribute("label")).toBe("my search")
        expect(expectEvent).toBeCalledWith(container, "search", { detail: searchQuery })

        expect(toContract({given} as any as Definition)).toEqual([
            "const React = require(\"react\");",
            "const {screen, render} = require(\"@testing-library/react\");",
            "const {default: userAction} = require(\"@testing-library/user-event\");",
            "module.exports = {",
            "contract: { consumer: undefined, provider: undefined, element: undefined },",
            "expectedContract: async (container) => {",
            "const search = jest.fn();",
            "render(React.createElement(container, {label: \"my search\", search}))",
            "}",
            "}",
        ])
    })
})