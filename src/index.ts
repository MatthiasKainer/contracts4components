import {
    getByRole,
    getByLabelText,
    getByText,
} from "@testing-library/dom";
import { Definition, parse } from "./parser";
import { replaceQueries } from "./queries"
import { cleanStore, toContract } from "./store";

import * as fs from "fs"
import * as path from "path"

export const queries = {
    ...replaceQueries({
        getByRole,
        getByLabelText,
        getByText
    })
}

export const test = (container: HTMLElement, definition: Definition, store: string) => {
    return new Promise((resolve, reject) => {
        cleanStore()
        parse(container, definition)
        const location = path.join(store, `${definition.provider}-${definition.consumer}-${definition.element}.contract.js`)
        fs.writeFile(location, toContract().join("\n"), (err) => {
            if (err) return reject(err)
            resolve(`${location} written`)
        })
    })
}


export * from "./events"
export * from "./actions"