import { useModels } from "@features/editor/hooks/useModels";
import { useSelected } from "@features/editor/hooks/useSelected";
import { useCallback } from "react";

export default function useMetadataEdits() {
  const selected = useSelected();
  const [models, setModels] = useModels();

  const assignValue = useCallback(
    (value: number | string, columnName?: string) => {
      if (!columnName) return;

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
    [selected, setModels],
  );

  const removeValue = useCallback(
    (columnName?: string) => {
      if (!columnName) return;

      for (const [model, submodelIds] of selected) {
        for (const submodelId of submodelIds) {
          delete model.metadata[submodelId][columnName];
        }
      }

      //here just to trigger a rerender
      setModels((prev) => {
        const next = prev.slice();
        return next;
      });
    },
    [selected, setModels],
  );

  const deleteColumns = useCallback(
    (columnNames: string[]) => {
      for (const model of models) {
        for (const submodelId of model.submodelIDs) {
          for (const column of columnNames)
            delete model.metadata[submodelId][column];
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

  const renameColumn = useCallback(
    (oldColumnName: string, newColumnName: string) => {
      //TODO beware, the new column name can already exist so
      //we might be overwriting it
      for (const model of models) {
        for (const submodelId of model.submodelIDs) {
          const metadata = model.metadata[submodelId];
          if (metadata[oldColumnName] !== undefined) {
            metadata[newColumnName] = metadata[oldColumnName];
            delete metadata[oldColumnName];
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

  return {
    assignValue,
    removeValue,
    deleteColumns,
    renameColumn,
  };
}
