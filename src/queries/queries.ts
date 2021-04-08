import { capitalize, getValidText } from "../utils";

export const getByRole = (
  fn: (container: HTMLElement, ...args: any[]) => HTMLElement
) => (container: HTMLElement, ...args: any[]) => {
  const element = document.createElement("div");
  const [role, opts] = args;
  element.setAttribute("role", role);
  if (opts?.name) {
    element.innerHTML = getValidText(opts.name);
  }
  container.appendChild(element);
  return fn(container, ...args);
};

export const getByLabelText = (
  fn: (container: HTMLElement, ...args: any[]) => HTMLElement
) => (container: HTMLElement, ...args: any[]) => {
  const element = document.createElement("div");
  const [name] = args;
  const validName = getValidText(name);
  const label = document.createElement("label");
  label.setAttribute("for", validName);
  label.innerHTML = capitalize(validName);
  const input = document.createElement("input");
  input.setAttribute("id", validName);
  element.appendChild(label);
  element.appendChild(input);
  container.appendChild(element);
  
  const result = fn(container, ...args)
  return result;
};

export const getByText = (
  fn: (container: HTMLElement, ...args: any[]) => HTMLElement
) => (container: HTMLElement, ...args: any[]) => {
  const element = document.createElement("div");
  const [text] = args;
  element.innerHTML = getValidText(text);
  container.appendChild(element);
  return fn(container, ...args);
};
export const getAllByText = getByText
