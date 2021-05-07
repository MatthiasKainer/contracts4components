import { getFramework } from "../config"
import * as dom from "./dom"
import * as react from "./react"

const choice = {
    dom,
    react
}

export const writer = () => ({...choice[getFramework()]})