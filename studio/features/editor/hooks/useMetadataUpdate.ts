import { EditorModel } from "@editor/data/EditorModel";
import { Metadata } from "@editor/data/types";
import { recursiveExtractMetadata } from "@editor/utils/metadata";
import { useEditorContext } from "./useEditorContext";
import { useUpdateStyles } from "./useStyleUpdate";

export function useUpdateMetadata() {
  const ctx = useEditorContext();
  const updateStyle = useUpdateStyles();

  const update = (models?: EditorModel[]) => {
    const data = extractMetadata(models ?? ctx.models);
    ctx.setMetadata(data);
    //update the existing style based on the new metadata
    updateStyle(undefined, data);
  };

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
