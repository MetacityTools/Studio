import ExampleReactComponent from "./ExampleReactComponent";
import { registerAsWebComponent } from "./registerAsWebComponent";

registerAsWebComponent("example-web-component", ExampleReactComponent, [
  "mytitle",
  "otherProp",
]);
