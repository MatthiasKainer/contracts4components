import { Definition, parse } from "./parser";
import { cleanStore, toContract } from "./store";

import * as fs from "fs"
import * as path from "path"
import * as vm from "vm"

import { setFramework } from "./config";
import { request } from "./net/request";
import { Contract } from "./domain/contract";
import { ContractIdentifier } from "./blocks/types";
import { javaDateNow } from "./utils";

export const setAsDOM = () => setFramework("dom")
export const setAsReact = () => setFramework("react")

type StoreOptions = {
    file?: string,
    url?: string
}

const test = (container: HTMLElement | any, definition: Definition, store: StoreOptions) => {
    return new Promise((resolve, reject) => {
        cleanStore()
        parse(container, definition)
        const name = `${definition.provider}-${definition.consumer}-${definition.element}`
        const promiseFile = new Promise((resolve, reject) => {
            if (store.file) {
                const location = path.join(store.file, `${name}.contract.js`)
                fs.writeFile(location, toContract(definition).join("\n"), (err) => {
                    if (err) return reject(err)
                    resolve(`${location} written`)
                })
            } else {
                resolve("no file provided")
            }
        })
        const promiseUrl = new Promise((resolve, reject) => {
            if (store.url) {
                const data = {
                    provider: definition.provider,
                    consumer: definition.consumer,
                    element: definition.element,
                    fileLines: toContract(definition)
                }
                request(store.url, { method: "POST", expectedStatus: 201 }, data)
                    .then(resolve)
                    .catch(reject)
            } else {
                resolve("no url provided")
            }
        })
        Promise.all([promiseFile, promiseUrl])
            .then(resolve)
            .catch(reject)
    })
}

export const testForDOM = (container: HTMLElement | any, definition: Definition, store: StoreOptions) => (setAsDOM(), test(container, definition, store))
export const testForReact = (container: HTMLElement | any, definition: Definition, store: StoreOptions) => (setAsReact(), test(container, definition, store))

export const verifyContract = async (container: HTMLElement | any, options: StoreOptions & ContractIdentifier & {version: string}) => {
    if (options.file) {
        await (require(options.file)).expectedContract(container)
    } else if (options.url) {
        const contracts = JSON.parse(await request(`${options.url}?provider=${options.provider}&consumer=${options.consumer}&element=${options.element}`, { method: "GET", expectedStatus: 200 })) as Contract[]
        if (contracts.length > 1) {
            throw new Error("More than one contract returned, combination of provider, consumer and element not unique.")
        }
        if (contracts.length < 1) {
            throw new Error("No contract found. Please provide an url to an existing contract.")
        }
        const [contract] = contracts
        const latestVersion = Object.values(contract.versions).pop()
        try {
            await eval(latestVersion.fileLines.join("\n")).expectedContract(container)

            await request(`${options.url}/${contract.id}/testResults`, { method: "PUT", expectedStatus: 202 }, {
                date: javaDateNow(),
                result: "Success",
                version: options.version
            })

        } catch (e) {
            await request(`${options.url}/${contract.id}/testResults`, { method: "PUT", expectedStatus: 202 }, {
                date: javaDateNow(),
                result: "Failure",
                version: options.version
            })
            throw e
        }
    }
}

export * from "./events"
export * from "./actions"
export * from "./queries"
export * from "./blocks/types"