import { context } from "@editor/providers/EditorProvider";
import React from "react";

export function useModels() {
  const ctx = React.useContext(context);
  return [ctx.models, ctx.setModels] as const;
}
