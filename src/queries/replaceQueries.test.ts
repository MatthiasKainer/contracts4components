import {
  getByRole,
  getByLabelText,
  getByText,
  getByAltText,
} from "@testing-library/dom";
import { replaceQueries } from "./replaceQueries";

const createDocument = () => {
  if (document.body.querySelector("#render-container")) {
    document.body.removeChild(document.body.querySelector("#render-container"));
  }
  const container = document.createElement("div");
  container.id = "render-container";
  document.body.appendChild(container);
  return document.body.querySelector("#render-container") as HTMLElement;
};

describe("Replace Query", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = createDocument();
  });

  describe("getByRole", () => {
    it("creates a dom tree for an element with a role text", () => {
      const element = replaceQueries({
        getByRole,
      }).getByRole(container, "text");
      expect(element.outerHTML).toEqual(`<div role="text"></div>`);
      expect(document.body.innerHTML.toLowerCase()).toBe(
        `<div id="render-container"><div role="text"></div></div>`
      );
    });
    it("creates a dom tree for an element with a role button", () => {
      replaceQueries({
        getByRole,
      }).getByRole(container, "button");
      expect(document.body.innerHTML.toLowerCase()).toBe(
        `<div id="render-container"><div role="button"></div></div>`
      );
    });
    it("creates a dom tree for an element with a role button and a name", () => {
      replaceQueries({
        getByRole,
      }).getByRole(container, "button", { name: /submit/i });
      expect(document.body.innerHTML.toLowerCase()).toBe(
        `<div id="render-container"><div role="button">submit</div></div>`
      );
    });
  });

  describe("getByLabelText", () => {
    it("creates a dom tree for an element with a label with text", () => {
      const element = replaceQueries({
        getByLabelText,
      }).getByLabelText(container, /username/i);
      expect(element.outerHTML.toLowerCase()).toEqual(`<input id="username">`);
      expect(document.body.innerHTML.toLowerCase()).toBe(
        `<div id="render-container"><div><label for="username">username</label><input id="username"></div></div>`
      );
    });
  });

  describe("getByText", () => {
    it("creates a dom tree for an element with a text", () => {
      const element = replaceQueries({
        getByText,
      }).getByText(container, /some text/i);
      expect(element.outerHTML.toLowerCase()).toEqual(`<div>some text</div>`);
      expect(document.body.innerHTML.toLowerCase()).toBe(
        `<div id="render-container"><div>some text</div></div>`
      );
    });
  });

  describe("unsupported", () => {
    it("throws an exception", () => {
      console.log = jest.fn();
      replaceQueries({
        getByAltText,
      });
      expect(console.log).toBeCalledWith(
        "Query getByAltText not supported at the moment"
      );
    });
  });
});
