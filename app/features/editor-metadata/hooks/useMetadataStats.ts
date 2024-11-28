import { useMemo } from "react";
import useMetadataContext from "./useMetadataContext";

export default function useMetadataStats() {
  const { aggregatedRows } = useMetadataContext();

  const stats = useMemo(() => {
    const stringValues = new Set<string>();
    const numberValues = new Set<number>();
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    aggregatedRows.forEach((row) => {
      if (typeof row.value === "string") {
        stringValues.add(row.value);
      } else if (typeof row.value === "number") {
        numberValues.add(row.value);
        min = Math.min(min, row.value);
        max = Math.max(max, row.value);
      }
    });

    return {
      min,
      max,
      numberCount: numberValues.size,
      stringCount: stringValues.size,
    };
  }, [aggregatedRows]);

  return {
    aggregatedRows,
    stats,
  };
}
