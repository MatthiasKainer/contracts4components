
export function isThenEventListenerStatement(block: ThenStatement): block is ThenEventListenerStatement {
    return block.type === "eventListener"
}
export type GivenBlock = {
    props: {[key:string]: string | object},
    events: {[key:string]: CustomEventInit<any> | any}
}

export type StatementType = "userAction" | "query" | "eventListener"
export type UserActionType = "type" | "click"
export type QueryType = "getByLabelText" | "getByText" | "getByRole"

export type UserActionStatement = WhenStatement & {
    type: "userAction",
    action: UserActionType,
}
export type QueryStatement = WhenStatement & {
    type: "query",
    action: QueryType,
}
export type WhenStatement = {
    type: StatementType
    args: any[]
}
export type WhenBlock = WhenStatement[]

export type ThenEventListenerStatement = ThenStatement & {
    type: "eventListener",
    name: string
}
export type ThenStatement = {
    type: StatementType
    assert: (...args: any[]) => void
}
export type ThenBlock = ThenStatement[]

export type ContractIdentifier = {
    provider: string,
    consumer: string,
    element: string,
}

export type Definition = ContractIdentifier & {
    given: GivenBlock,
    when: WhenBlock,
    then: ThenBlock
}