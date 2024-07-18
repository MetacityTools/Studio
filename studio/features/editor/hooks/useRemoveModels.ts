import { EditorModel } from "@editor/data/EditorModel";
import { context } from "@editor/providers/EditorProvider";
import React from "react";
import { useUpdateMetadata } from "./useMetadataUpdate";
import { useSelection } from "./useSelection";

export function useRemoveModels() {
  const ctx = React.useContext(context);
  const select = useSelection();
  const updateMetadata = useUpdateMetadata();

  const removeModels = (models: EditorModel[]) => {
    for (const model of models) ctx.scene.remove(model);
    select(new Map());

    const copy = ctx.scene.objects.filter(
      (obj) => obj instanceof EditorModel,
    ) as EditorModel[];

    ctx.setModels(copy);
    updateMetadata(copy);
  };

  return removeModels;
}
