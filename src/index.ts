import { Definition, parse } from "./parser";
import { cleanStore, toContract } from "./store";

import * as fs from "fs"
import * as path from "path"
import { setFramework } from "./config";

export const setAsDOM = () => setFramework("dom")
export const setAsReact = () => setFramework("react")

const test = (container: HTMLElement | any, definition: Definition, store: string) => {
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

export const testForDOM = (container: HTMLElement | any, definition: Definition, store: string) => (setAsDOM(), test(container, definition, store))
export const testForReact = (container: HTMLElement | any, definition: Definition, store: string) => (setAsReact(), test(container, definition, store))

export * from "./events"
export * from "./actions"
export * from "./queries"
export * from "./blocks/types"