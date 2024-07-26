import { Tooltip } from "@editor/providers/EditorProvider";
import { Dispatch, SetStateAction } from "react";
import { useEditorContext } from "./useEditorContext";

export function useTooltip(): [Tooltip, Dispatch<SetStateAction<Tooltip>>] {
  const ctx = useEditorContext();
  return [ctx.tooltip, ctx.setTooltip];
}
