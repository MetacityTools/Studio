import EditorRoot from "@features/editor/components/EditorRoot";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Metacity Studio" }, { name: "description", content: "Metacity Studio Editor" }];
}

export default function Home() {
  return <EditorRoot />;
}
