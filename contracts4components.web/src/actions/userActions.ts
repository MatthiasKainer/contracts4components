export type ActionResult = {
    triggers: (event: () => void) => void
} & any

const Action: ActionResult = {
    triggers: (event: () => void) => {
        event()
    }
}

export const type = 
    (fn: (container: HTMLElement, ...args: any[]) => void) =>
    (container: HTMLElement, ...args: any[]) => {
    fn(container, ...args)
    return {...Action}
}
export const click = 
    (fn: (container: HTMLElement, ...args: any[]) => void) =>
    (container: HTMLElement, ...args: any[]) => {
    fn(container, ...args)
    return {...Action}
}