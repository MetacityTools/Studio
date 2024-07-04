import { useEditorContext } from "./useEditorContext";

export function useRenderer() {
  const ctx = useEditorContext();
  return ctx.renderer;
}
