import { writer } from "./writer"

const given: string[] = []
const when: string[] = []
const then: string[] = []

const normaliseLines = (line: string[]) => line.map(l => l.split("\n").map(l => l.trim())).reduce((prev, curr) => [...prev, ...curr], [])

export const cleanStore = () => {
    given.splice(0, given.length)
    when.splice(0, when.length)
    then.splice(0, then.length)
}

export const addGiven = (...line: string[]) => {
    given.push(...normaliseLines(line))
}
export const addWhen = (...line: string[]) => {
    when.push(...normaliseLines(line))
}
export const addThen = (...line: string[]) => {
    then.push(...normaliseLines(line))
}

export const toContract = () => {
    return writer().frame(...given,
        ...when,
        ...then)
}