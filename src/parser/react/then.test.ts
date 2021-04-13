import { ThenEventListenerStatement } from ".."
import { cleanStore, toContract } from "../../store";
import { parseThen } from "./then";

jest.mock("../../events", () => ({
    __esModule: true,
    expectEvent: jest.fn()
}))

describe("Parser", () => {
    const searchQuery = { query: "some text" }

    beforeEach(() => {
        cleanStore()
    })
    it("Then block", () => {
        const container = document.createElement("search-form")
        const then = [
            {
                type: "eventListener",
                name: "search",
                assert: (search: jest.Mock) => {
                    expect(search).toBeCalledTimes(1);
                    expect(search.mock.calls[0][0].detail).toEqual(searchQuery);
                }
            } as ThenEventListenerStatement
        ]

        parseThen(container, then);

        expect(toContract()).toEqual([
            "const {screen,getByRole,getByLabelText,getByText,} = require(\"@testing-library/dom\");",
            "const {default: userAction} = require(\"@testing-library/user-event\");",
            "module.exports = {",
            "expectedContract: async (container) => {",
            "(function (search) {",
            "expect(search).toBeCalledTimes(1);",
            "expect(search.mock.calls[0][0].detail).toEqual(searchQuery);",
            "})(search)",
            "}",
            "}",
        ])
    })
})