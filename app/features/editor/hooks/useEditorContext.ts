import { useContext } from "react";
import { context } from "../providers/EditorProvider";

export function useEditorContext() {
  const ctx = useContext(context);

  if (!ctx) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }

  return ctx;
}
