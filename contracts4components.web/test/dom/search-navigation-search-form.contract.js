const {screen,getByRole,getByLabelText,getByText,} = require("@testing-library/dom");
const {default: userAction} = require("@testing-library/user-event");
module.exports = {
contract: { consumer: "navigation", provider: "search", element: "search-form" },
expectedContract: async (container) => {
container.setAttribute("label", "my search");
await new Promise((resolve) => setImmediate(resolve));
const search = jest.fn();
container.addEventListener("search", search);
const block_0_0 = screen.getByLabelText(/my search/gi);
const block_0 = userAction.type(block_0_0,"some text");
const block_1_0 = screen.getByRole("button",{ name: /search/i });
const block_1 = userAction.click(block_1_0);
(function (search) {
expect(search).toBeCalledTimes(1);
expect(search.mock.calls[0][0].detail).toEqual({ query: "some text" });
})(search)
}
}