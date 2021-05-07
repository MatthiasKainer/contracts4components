import {SearchForm} from "./component"
import {verifyContract} from "../../../src"
import pck from "../../../package.json"

describe("Provider", () => {
    it("should pass the provided test with my component", async () => {
        await verifyContract(SearchForm, { 
            url: "http://0.0.0.0:8097/contracts",
            provider: "search",
            consumer: "navigation",
            element: "SearchForm",
            version: pck.version
        })
    })
})