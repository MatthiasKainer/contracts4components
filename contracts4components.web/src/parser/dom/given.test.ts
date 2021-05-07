import { Definition } from "../../blocks/types";
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
            "const {screen,getByRole,getByLabelText,getByText,} = require(\"@testing-library/dom\");",
            "const {default: userAction} = require(\"@testing-library/user-event\");",
            "module.exports = {",
            "contract: { consumer: undefined, provider: undefined, element: undefined },",
            "expectedContract: async (container) => {",
            "container.setAttribute(\"label\", \"my search\");",
            "await new Promise((resolve) => setImmediate(resolve));",
            "const search = jest.fn();",
            "container.addEventListener(\"search\", search);",
            "}",
            "}",
        ])
    })
})