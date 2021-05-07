import { createComponent } from "./element";
import pck from "../../../package.json"
import {verifyContract} from "../../../src"

describe("Provider", () => {
    it("should pass the provided test with my component", async () => {
        const component = createComponent({ label: "anything" })
        document.body.appendChild(component)
        await verifyContract(component, { 
            url: "http://0.0.0.0:8097/contracts",
            provider: "search",
            consumer: "navigation",
            element: "search-form",
            version: pck.version
        })
    })
})