import { createComponent } from "./element";
import { expectedContract } from "../search-navigation-search-form.contract";

describe("Provider", () => {
    it("should pass the provided test with my component", () => {
        const component = createComponent({ label: "anything" })
        expectedContract(component)
    })
})