# Contracts4Components

> <span style="color:red;font-weight:bold;">NOTE:</span> This project is a proof of concept and provides an example of how one could do something like this.
> It is not complete, does not handle other cases than the ones shown in the example and I'm currently not planning to extend it

This example does not support any frameworks, only plain HTMLElements.

The idea is to bring contract tests to the frontend world.

The workflow is like the following:

```txt
      ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
      │             │  │             │  │              │
      │ Consumer    │  │ Broker      │  │ Provider     │
      │             │  │             │  │              │
      └─────┬───────┘  └──────┬──────┘  └───────┬──────┘
            │                 │                 │
┌───────────┤                 │                 │
│           │                 │                 │
│create     │                 │                 │
│green      │                 │                 │
│test       │                 │                 │
└───────────► mock            │                 │
            │ component       │                 │
            │                 │                 │
            │  share          │                 │
            ├─────────────────►                 │
            │  mock           │                 │
            │                 │  receive mock   │
            │                 ├─────────────────►
            │                 │                 │
            │                 │                 ├────────────┐
            │                 ◄─────────────────┤            │
            │                 │  test red       │ implement  │
            │                 ◄─────────────────┤ component  │
            │                 │                 │            │
            │                 │                 ◄────────────┘
            │                 │  test green     │
            │                 ◄─────────────────┤
            │                 │                 │
            │                 │                 │
```

Assume we have two teams, search and navigation. The search team provides a sophisticated component with autocomplete, dropdown results and animated cat gifs, that the navigation team wants to use. They are not interested in all the funky details, their look at it is a text box with a label they want to customise, and they need the final search query as they want to route it to different result tests based on an a/b testing strategy that's ongoing on their end.

Using this methology, everybody can make sure they get what they need.

## Consumer

First, the navigation create a definition for their requirement. They specify their setup in the `given` block, which is a description of the component they need.

```js
const container = document.createElement("top-bar-search-form")
const definition = {
      // the name of the provider team
      provider: "search",
      // the name of the consuming team
      consumer: "navigation",
      // the name of the element for this contract
      element: "top-bar-search-form",
      // given is used to describe the component
      given: {
            // props are the properties/attributes that are expected
            props: {
                  // this team wants to specify the label
                  label: "Find on page"
            },
            // events are the events dispatched by the component
            events: {
                  // this component has a search event, with 
                  //    details in the providing the search query 
                  "search": { detail: { query: "some text" } }
            }
      }
```

this sets up the component how the team wants to interact with it.

Next the team has to specify expected user actions in the `when` block

```js

const definition = {
      // ...
      when: [
            // `when` is an array of elements
            //    elements can be either `userAction` or `query`
            //    - `userAction`: action triggered by user, can be 
            //          either `type` or `click`
            //    - `query`: get a specific element. You can get them
            //          by `getByRole`, `getByText`, or `getByLabelText`
            //    the arguments are following https://testing-library.com/docs/dom-testing-library/api
            {
                  type: "userAction",
                  action: "type",
                  args: [
                        {
                              type: "query",
                              action: "getByLabelText",
                              args: [
                                    container,
                                    /my search/gi
                              ]
                        },
                        searchQuery.query
                  ]
            },
            {
                  type: "userAction",
                  action: "click",
                  args: [
                        {
                              type: "query",
                              action: "getByRole",
                              args: [
                                    container,
                                    "button",
                                    { name: /search/i }
                              ]
                        }
                  ],
                  // userActions can be defined as trigger elements
                  //    for events specified in the `given` block.
                  //    In this case, the click on the button will
                  //    have to be the initiator on the search event.
                  triggers: "search"
            }
      ]
}
```

Finally, the team can assert what should have happened after all elements from given has been executed.

```js

const definition = {
      // ...
      then: [
            {
                  // an event listener will attach to the specified event.
                  //    It is required that this event was created in the
                  //    `given` block
                  type: "eventListener",
                  name: "search",
                  assert: (search) => {
                        // search is an jest.Mock
                        expect(search).toBeCalledTimes(1);
                        expect(search.mock.calls[0][0].detail).toEqual({ query: "some text" });
                  }
            }
      ]
}
```

This definition can be executed via the test method provided by this library:

```js
await test(
      container, // the container under test
      definition, // the definition to execute
      path.join(__dirname, "..") // the location where to put the contract
)
```

Running `test` will perform multiple things:

- it will create a contract test that can be shared with the other team
- it will create an implementation that matches the specification, and runs all tests against it. If your specification cannot be tested, the contract will not be created and your test is red. You can take a look at the created dom by running `expect(container.outerHTML).toMatchSnapshot()` after `test`. In our example, it looks like this:

```html
<search-form label="my search">
      <div>
            <label for="MY SEARCH">My search</label>
            <input id="MY SEARCH">
      </div>
      <div role="button">SEARCH</div>
</search-form>
```

This might not have been exactly what a control like this looks like - but the important part of this test is that we don't want to specify HOW the HTML looks like, but what BEHAVIOUR we expect from it.

## Provider

All the provider has to do is link this up with their component.

```js
// the element under test
import { search } from "./element";
// the contract that was created by the consumer
import { expectedContract } from "../search-navigation-search-form.contract";

describe("Provider", () => {
    it("should pass the provided test with my component", () => {
        const component = search()
        // this will run all tests
        expectedContract(component)
    })
})
```

If the team would not provide a way to customize the label, or the `search` event was not triggered, the test will fail.

The generated tests look like the following:

```js
const { getByRole, getByLabelText, getByText, } = require("@testing-library/dom");
const userAction = require("@testing-library/user-event");
module.exports = {
    expectedContract: async (container) => {
        container.setAttribute("label", "my search");
        await new Promise((resolve) => setImmediate(resolve));
        const search = jest.fn();
        container.addEventListener("search", search);
        const block_0_0 = getByLabelText(container, /my search/gi);
        const block_0 = userAction.type(block_0_0, "some text");
        const block_1_0 = getByRole(container, "button", { name: /search/i });
        const block_1 = userAction.click(block_1_0);
        (function (search) {
            expect(search).toBeCalledTimes(1);
            expect(search.mock.calls[0][0].detail).toEqual(searchQuery);
        })(search)
    }
}
```