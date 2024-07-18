import { Key, useCallback } from "react";
import { useModels } from "./useModels";
import { useSelected } from "./useSelected";
import { useSelection } from "./useSelection";

export default function useModelSelection(fullySelectedModelKeys: Set<string>) {
  const [models] = useModels();
  const selected = useSelected();
  const select = useSelection();

  const handleSelection = useCallback(
    (keys: Set<Key> | "all") => {
      if (keys === "all") {
        select(new Map(models.map((model) => [model, model.submodelIDs])));
      } else {
        //select fully those in keys which are not already selected
        const newlySelected = models.filter((model) => keys.has(model.uuid));

        //give all of those that were previously partially selected
        //and are not included in the newly selected
        const partiallySelectedModels = Array.from(selected.keys()).filter(
          (model) =>
            !fullySelectedModelKeys.has(model.uuid) && !keys.has(model.uuid),
        );

        const persistedSelections = partiallySelectedModels.map(
          (model) => [model, selected.get(model) || new Set()] as const,
        );

        //combine the two in a safe way
        const combined = newlySelected
          .map((model) => [model, model.submodelIDs] as const)
          .concat(persistedSelections);

        select(new Map(combined));
      }
    },
    [models, select, fullySelectedModelKeys, selected],
  );

  return handleSelection;
}
