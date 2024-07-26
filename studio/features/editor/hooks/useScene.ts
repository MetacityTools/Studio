import { useEditorContext } from "./useEditorContext";

export function useScene() {
  const ctx = useEditorContext();
  return ctx.scene;
}
