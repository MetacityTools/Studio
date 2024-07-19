// src/MyWebComponent.js
import React from "react";
import ReactDOM from "react-dom/client";

type Attributes<P extends string> = Partial<Record<P, string | null>>;

export function registerAsWebComponent<P extends string>(
  elementName: string,
  component: React.FC<Attributes<P>>,
  propNames: P[]
) {
  class StudioWebComponent extends HTMLElement {
    private attrs: Attributes<P> = {};

    private reactRoot?: ReactDOM.Root;

    static observedAttributes = propNames;

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    attributeChangedCallback(name: P, oldValue: string, newValue: string) {
      this.attrs[name] = newValue as any;
      this.render();
    }

    connectedCallback() {
      this.reactRoot = ReactDOM.createRoot(this.shadowRoot!);
      this.render();
    }

    render() {
      if (!this.reactRoot) return;

      // typescript workaround
      const C = component as React.FC<any>;

      this.reactRoot.render(<C {...this.attrs} />);
    }
  }

  Object.defineProperty(StudioWebComponent, "name", {
    value: component.name,
  });

  customElements.define(elementName, StudioWebComponent);
}

// now can be used in HTML like <create-project-dialog></create-project-dialog>
