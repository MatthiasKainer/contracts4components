import { createComponent } from "./element";
import { expectedContract } from "../search-navigation-search-form.contract";

describe("Provider", () => {
    it("should pass the provided test with my component", async () => {
        const component = createComponent({ label: "anything" })
        document.body.appendChild(component)
        await expectedContract(component)
    })
})