import { useModels } from "@features/editor/hooks/useModels";
import { useSelected } from "@features/editor/hooks/useSelected";
import { useSelection } from "@features/editor/hooks/useSelection";
import { Key, useCallback } from "react";

export default function useMetadataSelection(
  selectedKeys: Set<Key>,
  columnName?: string,
) {
  const [models] = useModels();
  const selected = useSelected();
  const select = useSelection();

  const handleSelection = useCallback(
    (keys: Set<Key> | "all") => {
      if (!columnName) return;

      if (keys === "all") {
        //select all where tke key is in the model
        select(new Map(models.map((model) => [model, model.submodelIDs])));
      } else {
        const newSelection = new Map(selected);
        //keys to deselect
        const keysToDeselect = selectedKeys.difference(keys);

        //go through all models and if that model has a metadata
        //that is in the selected keys, mark him as selected
        for (const model of models) {
          const selectedIds = new Set<number>(newSelection.get(model) || []);
          for (const submodelId of model.submodelIDs) {
            const metadata = model.metadata[submodelId];
            const value = metadata ? metadata[columnName] : undefined;
            if (value === undefined) continue;

            if (keys.has(value.toString())) {
              selectedIds.add(submodelId);
            } else if (keysToDeselect.has(value.toString())) {
              selectedIds.delete(submodelId);
            }
          }

          if (selectedIds.size === 0) {
            newSelection.delete(model);
          } else {
            newSelection.set(model, selectedIds);
          }
        }

        select(newSelection);
      }
    },
    [models, select, selected, columnName, selectedKeys],
  );

  return { handleSelection, select };
}
