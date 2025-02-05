import { useMemo } from "react";
import { EditorModelListItem } from "../types";
import { useModels } from "./useModels";
import { useSelected } from "./useSelected";

export default function useModelList(): [EditorModelListItem[], Set<string>] {
  const [models] = useModels();
  const selected = useSelected();

  const modelList = useMemo(
    () =>
      models.map((model) => ({
        item: model,
        key: model.uuid,
        totalSubmodels: Object.keys(model.metadata).length,
        selectedSubmodels: selected.get(model)?.size || 0,
      })),
    [models, selected],
  );

  const selectedKeys = useMemo(
    () =>
      new Set(
        modelList
          .filter((model) => model.totalSubmodels === model.selectedSubmodels)
          .map((model) => model.key),
      ),
    [modelList],
  );

  return [modelList, selectedKeys] as const;
}
