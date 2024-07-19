import { EditorModel } from "@editor/data/EditorModel";
import { Metadata } from "@editor/data/types";
import { recursiveExtractMetadata } from "@editor/utils/metadata";
import { useCallback } from "react";
import { useEditorContext } from "./useEditorContext";
import { useUpdateStyles } from "./useStyleUpdate";

export function useUpdateMetadata() {
  const { models, setMetadata } = useEditorContext();
  const updateStyle = useUpdateStyles();

  const update = useCallback(
    (newModels?: EditorModel[]) => {
      const data = extractMetadata(newModels ?? models);
      setMetadata(data);
      //update the existing style based on the new metadata
      updateStyle(undefined, data);
    },
    [models, setMetadata, updateStyle],
  );

  return update;
}

function extractMetadata(models: EditorModel[]) {
  const aggregated: Metadata = {};

  models.forEach((model) => {
    Object.entries(model.metadata).forEach(([key, data]) => {
      recursiveExtractMetadata(data, aggregated);
    });
  });

  return aggregated;
}
