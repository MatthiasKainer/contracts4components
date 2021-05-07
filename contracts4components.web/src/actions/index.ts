import {replaceActions} from "./replaceActions"
import userEvent from "@testing-library/user-event"

const {type, click} = userEvent

export const expectedAction = {
    ...replaceActions({
        type,
        click
    })
}