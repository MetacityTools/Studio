import { useModels } from "@features/editor/hooks/useModels";
import { useSelected } from "@features/editor/hooks/useSelected";
import { useCallback } from "react";

export default function useMetadataAssignValue() {
  const selected = useSelected();
  const [models, setModels] = useModels();

  const assignValue = useCallback(
    (value: string | number, columnName?: string, type?: "string" | "number") => {
      if (!columnName) return;

      const numValue = typeof value === "string" && type === "number" ? parseFloat(value) : value;
      if (typeof numValue === "number" && !isNaN(numValue)) value = numValue;

      for (const [model, submodelIds] of selected) {
        for (const submodelId of submodelIds) {
          model.metadata[submodelId] = {
            ...model.metadata[submodelId],
            [columnName]: value,
          };
        }
      }

      //here just to trigger a rerender
      setModels((prev) => {
        const next = prev.slice();
        return next;
      });
    },
    [selected, setModels]
  );

  return assignValue;
}
