import { GeometryMode } from "@features/editor/data/types";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { EditorModelListItem } from "@features/editor/types";
import { useMemo } from "react";
import { MetadataModelListItem } from "../type";

export default function useMetadataModels(modelList: EditorModelListItem[]) {
  const { activeMetadataColumn, modelStyles } = useEditorContext();

  const metadataModelList: MetadataModelListItem[] = useMemo(() => {
    const activeStyle = modelStyles[activeMetadataColumn] ?? {};

    return modelList.map((model) => {
      const modelStyle = activeStyle[model.key];
      return {
        ...model,
        geometryMode: modelStyle?.geometryMode ?? GeometryMode.SOLID,
      };
    });
  }, [modelList, modelStyles, activeMetadataColumn]);

  return metadataModelList;
}
