import { useEditorContext } from "./useEditorContext";

export function useActiveView(): number {
  const ctx = useEditorContext();
  return ctx.activeView;
}
