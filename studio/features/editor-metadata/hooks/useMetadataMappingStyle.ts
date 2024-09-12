import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { vec3 } from "gl-matrix";
import { useEffect, useMemo } from "react";

export default function useMetadataMappingStyle(
  sourceColumn: string,
  data: any,
  targetColumn: string,
) {
  const { models, activeMetadataColumn, setActiveMetadataColumn } =
    useEditorContext();

  useEffect(() => {
    let last = "";
    setActiveMetadataColumn((prev) => {
      last = prev;
      return "";
    });

    return () => {
      setActiveMetadataColumn(last);
    };
  }, [activeMetadataColumn, setActiveMetadataColumn]);

  //gather all accepted values
  const acceptedValues = useMemo(() => {
    if (!data) return new Set();

    const values = new Set<string>();
    for (const item of data) {
      if (item[sourceColumn] !== undefined && item[sourceColumn] !== null)
        values.add(item[sourceColumn]);
    }

    return values;
  }, [data, sourceColumn]);

  //colorize models where the target column is in the accepted values
  useEffect(() => {
    if (activeMetadataColumn) return;

    const colorMap = new Map<number, vec3>();
    for (const model of models) {
      const submodelIds = model.submodelIDs;
      for (const submodelId of submodelIds) {
        const metadata = model.metadata[submodelId];
        if (!metadata) continue;
        const value = metadata[targetColumn];
        if (acceptedValues.has(value)) {
          colorMap.set(submodelId, [0.5, 0.5, 1]);
        } else {
          colorMap.set(submodelId, [1, 1, 1]);
        }
      }
      model.setColorMap(colorMap);
    }

    return () => {
      for (const model of models) {
        model.whiten();
      }
    };
  }, [models, activeMetadataColumn, acceptedValues, targetColumn]);
}
