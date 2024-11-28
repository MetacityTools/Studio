import { EditorModel } from "@editor/data/EditorModel";
import { context } from "@editor/providers/EditorProvider";
import React, { useCallback } from "react";
import { useSelection } from "./useSelection";

export function useRemoveModels() {
  const { scene, setModels } = React.useContext(context);
  const select = useSelection();

  const removeModels = useCallback(
    (models: EditorModel[]) => {
      for (const model of models) scene.remove(model);
      select(new Map());

      const copy = scene.objects.filter(
        (obj) => obj instanceof EditorModel,
      ) as EditorModel[];

      setModels(copy);
    },
    [scene, setModels, select],
  );

  return removeModels;
}
