import {
    getByRole,
    getByLabelText,
    getByText,
} from "@testing-library/dom";
import { replaceQueries } from "..";

export const queries = {
    ...replaceQueries({
        getByRole,
        getByLabelText,
        getByText
    })
  }