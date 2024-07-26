import { useModels } from "@features/editor/hooks/useModels";
import { useEffect, useState } from "react";
import { MetadataListItem } from "../type";

const EmptyColumns = [{ cid: "key", name: "key" }];

export default function useMetadataTable() {
  const [models] = useModels();
  const [rows, setRows] = useState<MetadataListItem[]>([]);
  const [columns, setColumns] =
    useState<{ cid: string; name: string }[]>(EmptyColumns);

  useEffect(() => {
    const newMetadata = [];
    for (const model of models) {
      for (const [key, values] of Object.entries(model.metadata)) {
        newMetadata.push({ mid: `${model.uuid}_${key}`, values: values });
      }
    }

    const columnNames = new Set<string>();
    for (const item of newMetadata) {
      for (const key of Object.keys(item.values)) {
        columnNames.add(key);
      }
    }

    const newColumns = Array.from(columnNames).map((key) => ({
      cid: key,
      name: key,
    }));

    setColumns(newColumns);
    setRows(newMetadata);
  }, [models]);

  return {
    rows: rows,
    columns: columns,
  };
}
