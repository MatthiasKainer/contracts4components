const label = (forControl: string, text: string) => {
  const label = document.createElement("label");
  label.setAttribute("for", forControl);
  label.innerHTML = text;
  return label;
};

const input = (type: string, id: string, text: string) => {
  const input = document.createElement("input");
  input.setAttribute("type", type);
  input.setAttribute("id", id);
  input.placeholder = text;
  return input;
};

const inputWithLabel = (id: string, text: string, type: string = "text") => {
  const container = document.createElement("div");
  container.appendChild(label(id, text));
  const field = input(type, id, text);
  container.appendChild(field);
  return {
    container,
    value: () => field.value,
  };
};

const button = (text: string, click: () => void) => {
  const container = document.createElement("button");
  container.innerHTML = text;
  container.addEventListener("click", click);
  return container;
};

type Prop = {
    label: string | undefined
}

export const createComponent = (prop: Prop) => {
  const element = document.createElement("div");
  const search = inputWithLabel("query", prop.label ?? "Search");
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type == "attributes" && mutation.attributeName === "label") {
        const element = (mutation.target as HTMLDivElement)
        element.querySelector("label").innerHTML = element.getAttribute("label")
      }
    });
  });
  
  observer.observe(element, {
    attributes: true 
  });
  element.appendChild(search.container);
  element.appendChild(
    button("Search", () => {
      element.dispatchEvent(
        new CustomEvent("search", { detail: { query: search.value() } })
      );
    })
  );
  return element;
};