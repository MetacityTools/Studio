import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { createContext, ReactNode, useEffect, useState } from "react";
import { defaultColor } from "../constants";
import { MetadataAggListItem } from "../type";

type MetadataContextType = {
  columns: { key: string }[];
  sort: boolean;
  setSort: (sort: boolean) => void;
  aggregatedRows: MetadataAggListItem[];
  undefinedItems?: MetadataAggListItem;
  selectedValueKeys: Set<string>;
};

export const MetadataContext = createContext<MetadataContextType>(
  {} as MetadataContextType,
);

export function MetadataProvider({ children }: { children: ReactNode }) {
  const { models, selection, activeMetadataColumn, styles } =
    useEditorContext();

  const [columns, setColumns] = useState<{ key: string }[]>([]);
  const [sort, setSort] = useState<boolean>(false);
  const [aggregatedRows, setAggregatedColumns] = useState<
    MetadataAggListItem[]
  >([]);
  const [undefinedItems, setUndefinedItems] = useState<MetadataAggListItem>();
  const [selectedValueKeys, setSelectedValueKeys] = useState<Set<string>>(
    new Set(),
  );
  const [colorizedAggregatedRows, setColorizedAggregatedRows] = useState<
    MetadataAggListItem[]
  >([]);

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

  useEffect(() => {
    //create aggregation only for the active column
    if (!activeMetadataColumn) {
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
      const selectedModel = selection.get(model);

      for (const submodelId of model.submodelIDs) {
        const value = model.metadata[submodelId]?.[activeMetadataColumn];

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
        column: activeMetadataColumn,
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
      column: activeMetadataColumn,
      value: "undefined",
      key: "undefined",
      ...undefinedItems,
      color: defaultColor,
    });
  }, [models, activeMetadataColumn, selection, sort]);

  useEffect(() => {
    if (!activeMetadataColumn)
      return setColorizedAggregatedRows(aggregatedRows);

    const columnStyles = styles[activeMetadataColumn];
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
  }, [styles, aggregatedRows, activeMetadataColumn]);

  return (
    <MetadataContext.Provider
      value={{
        columns,
        sort,
        setSort,
        aggregatedRows: colorizedAggregatedRows,
        undefinedItems,
        selectedValueKeys,
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
}
