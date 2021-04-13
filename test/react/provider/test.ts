import { expectedContract } from "../search-navigation-SearchForm.contract";
import {SearchForm} from "./component"

describe("Provider", () => {
    it("should pass the provided test with my component", async () => {
        await expectedContract(SearchForm)
    })
})