import { useModels } from "@features/editor/hooks/useModels";
import { useSelected } from "@features/editor/hooks/useSelected";
import { useEffect, useState } from "react";
import { MetadataAggListItem } from "../type";

export default function useMetadataTable(activeColumnName?: string) {
  const [models] = useModels();
  const [columns, setColumns] = useState<{ key: string }[]>([]);

  useEffect(() => {
    const columnNames = new Set<string>();
    for (const model of models) {
      for (const submodelId in Object.values(model.metadata)) {
        for (const key in model.metadata[submodelId]) {
          columnNames.add(key);
        }
      }
    }

    const newColumns = Array.from(columnNames).map((key) => ({ key }));

    setColumns(newColumns);
  }, [models]);

  const selected = useSelected();
  const [aggregatedRows, setAggregatedColumns] = useState<
    MetadataAggListItem[]
  >([]);
  const [undefinedItems, setUndefinedItems] = useState<MetadataAggListItem>();

  useEffect(() => {
    //create aggregation only for the active column
    if (!activeColumnName) {
      setAggregatedColumns([]);
      setUndefinedItems(undefined);
      return;
    }

    const columnValues = new Map<
      string | number,
      {
        count: number;
        selected: number;
      }
    >();

    const undefinedItems = { count: 0, selected: 0 };

    for (const model of models) {
      const selectedModel = selected.get(model);

      for (const submodelId in Object.values(model.metadata)) {
        const value = model.metadata[submodelId]?.[activeColumnName];

        if (typeof value === "string" || typeof value === "number") {
          //has defined value
          const item = columnValues.get(value) || { count: 0, selected: 0 };
          item.count++;
          if (selectedModel?.has(parseInt(submodelId))) item.selected++;
          columnValues.set(value, item);
        } else {
          //does not have defined value
          undefinedItems.count++;
          if (selectedModel?.has(parseInt(submodelId)))
            undefinedItems.selected++;
        }
      }
    }

    const newAggregatedRows: MetadataAggListItem[] = [];
    for (const [value, count] of columnValues.entries()) {
      newAggregatedRows.push({ column: activeColumnName, value, ...count });
    }

    newAggregatedRows.sort((a, b) => {
      if (typeof a.value === "string" && typeof b.value === "string") {
        return a.value.localeCompare(b.value);
      } else if (typeof a.value === "number" && typeof b.value === "number") {
        return a.value - b.value;
      } else if (typeof a.value === "string" && typeof b.value === "number") {
        return -1;
      } else {
        return 1;
      }
    });

    setAggregatedColumns(newAggregatedRows);
    setUndefinedItems({
      column: activeColumnName,
      value: "undefined",
      ...undefinedItems,
    });
  }, [models, activeColumnName, selected]);

  return {
    undefinedItems,
    aggregatedRows,
    columns,
  };
}
