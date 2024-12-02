import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useCallback } from "react";

export default function useMetadataMap() {
  const { models, setModels } = useEditorContext();

  const handleMapping = useCallback(
    (
      sourceColumn: string,
      data: any[],
      targetColumn: string,
      removeExisting: boolean,
    ) => {
      //create a map of the data
      const dataMap = new Map();
      for (const item of data) {
        dataMap.set(item[sourceColumn], item);
      }

      //assign the data to the models
      for (const model of models) {
        const submodelIds = model.submodelIDs;
        for (const submodelId of submodelIds) {
          const metadata = model.metadata[submodelId];
          if (!metadata) continue;
          const value = metadata[targetColumn];
          const data = dataMap.get(value);
          if (data) {
            if (removeExisting) {
              model.metadata[submodelId] = { ...data };
            } else {
              model.metadata[submodelId] = { ...metadata, ...data };
            }
          } else {
            if (removeExisting) {
              delete model.metadata[submodelId];
            }
          }
        }
      }

      //here just to trigger a rerender
      setModels((prev) => {
        const next = prev.slice();
        return next;
      });
    },
    [models, setModels],
  );

  return handleMapping;
}
