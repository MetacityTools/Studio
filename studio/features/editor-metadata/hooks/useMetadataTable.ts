import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useModels } from "@features/editor/hooks/useModels";
import { useSelected } from "@features/editor/hooks/useSelected";
import { useEffect, useState } from "react";
import { defaultColor } from "../constants";
import { MetadataAggListItem } from "../type";

export default function useMetadataTable(
  activeColumnName?: string,
  sort?: boolean,
) {
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
  const [selectedValueKeys, setSelectedValueKeys] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    //create aggregation only for the active column
    if (!activeColumnName) {
      setAggregatedColumns([]);
      setUndefinedItems(undefined);
      setSelectedValueKeys(new Set());
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

      for (const submodelId of model.submodelIDs) {
        const value = model.metadata[submodelId]?.[activeColumnName];

        if (typeof value === "string" || typeof value === "number") {
          //has defined value
          const item = columnValues.get(value) || { count: 0, selected: 0 };
          item.count++;
          if (selectedModel?.has(submodelId)) item.selected++;
          columnValues.set(value, item);
        } else {
          //does not have defined value
          undefinedItems.count++;
          if (selectedModel?.has(submodelId)) undefinedItems.selected++;
        }
      }
    }

    const newAggregatedRows: MetadataAggListItem[] = [];
    for (const [value, count] of columnValues.entries()) {
      newAggregatedRows.push({
        column: activeColumnName,
        value,
        ...count,
        key: value.toString(),
        color: defaultColor,
      });
    }

    if (sort) {
      newAggregatedRows.sort((a, b) => {
        if (a.selected === a.count && b.selected !== b.count) return -1;
        if (a.selected !== a.count && b.selected === b.count) return 1;

        if (a.selected > 0 && b.selected === 0) return -1;
        if (a.selected === 0 && b.selected > 0) return 1;

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
    }

    //go through all items and if selected is equal to count, add to selectedValueKeys
    const selectedKeys = new Set<string>();
    for (const item of newAggregatedRows) {
      if (item.count === item.selected) selectedKeys.add(item.key);
    }

    setSelectedValueKeys(selectedKeys);
    setAggregatedColumns(newAggregatedRows);
    setUndefinedItems({
      column: activeColumnName,
      value: "undefined",
      key: "undefined",
      ...undefinedItems,
      color: defaultColor,
    });
  }, [models, activeColumnName, selected, sort]);

  const [colorizedAggregatedRows, setColorizedAggregatedRows] = useState<
    MetadataAggListItem[]
  >([]);

  //add trigger for styles separately
  const { styles } = useEditorContext();
  useEffect(() => {
    if (!activeColumnName) return setColorizedAggregatedRows(aggregatedRows);

    const columnStyles = styles[activeColumnName];
    if (!columnStyles) return setColorizedAggregatedRows(aggregatedRows);

    const colorized = [];
    for (const item of aggregatedRows) {
      const style = columnStyles[item.value];
      let copy = item;
      if (style) {
        copy = { ...item, color: style.code };
      }
      colorized.push(copy);
    }
    setColorizedAggregatedRows(colorized);
  }, [styles, aggregatedRows, activeColumnName]);

  return {
    selectedValueKeys,
    undefinedItems,
    aggregatedRows: colorizedAggregatedRows,
    columns,
  };
}
