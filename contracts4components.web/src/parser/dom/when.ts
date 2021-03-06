import { WhenStatement, UserActionStatement, QueryStatement, WhenBlock } from "../../blocks/types";
import { queries, expectedAction } from "../..";
import { addWhen } from "../../store";
import { parameterize } from "../../utils";

function isUserActionStatement(block: WhenStatement): block is UserActionStatement {
    return block.type === "userAction"
}

function isQueryStatement(block: any): block is QueryStatement {
    return block && block.type === "query"
}

const argsExpand = (container: HTMLElement, base: string, args: any[]) => args.map((arg, index) => {
    if (isUserActionStatement(arg)) {
        return {
            var: `${base}_${index}`,
            fn: userAction(container, `${base}_${index}`, arg)
        };
    }
    if (isQueryStatement(arg)) {
        return {
            var: `${base}_${index}`,
            fn: queryAction(container,`${base}_${index}`, arg)
        };
    }

    return {
        var: parameterize(arg),
        fn: arg
    };
})

const queryAction = (container: HTMLElement, base: string, block: QueryStatement): string[] => {
    const args = argsExpand(container, base, block.args);
    addWhen(`const ${base} = screen.${block.action}(${args.map(a => a.var).join(",")});`)
    return (queries[block.action] as any)(container, ...args.map(a => a.fn))
}

const userAction = (container: HTMLElement, base: string, block: UserActionStatement): string[] => {
    const args = argsExpand(container, base, block.args);

    addWhen(`const ${base} = userAction.${block.action}(${args.map(a => a.var).join(",")});`)
    return (expectedAction[block.action] as any)(...args.map(a => a.fn))
}

export const parseWhen = (container: HTMLElement, when: WhenBlock) => {
    const lines: string[] = [];
    when.forEach((block, index) => {
        if (isUserActionStatement(block)) {
            lines.push(...userAction(container, `block_${index}`, block))
        }
        else if (isQueryStatement(block)) {
            lines.push(...queryAction(container, `block_${index}`, block))
        }
    })
    return lines
}
