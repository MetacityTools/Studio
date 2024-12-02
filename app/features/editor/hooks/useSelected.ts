import React from "react";

import { SelectionType, context } from "@editor/providers/EditorProvider";

export function useSelected(): SelectionType {
  const ctx = React.useContext(context);
  return ctx.selection;
}
