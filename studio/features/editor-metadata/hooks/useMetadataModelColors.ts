import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { vec3 } from "gl-matrix";
import { useEffect } from "react";

export default function useMetadataModelColors() {
  const { models, styles, activeMetadataColumn } = useEditorContext();

  useEffect(() => {
    if (!activeMetadataColumn) {
      return;
    }

    const stylesheet = styles[activeMetadataColumn];
    if (!stylesheet) return; //TODO color all to default

    const colorMap = new Map<number, vec3>();
    const modelsCopy = [...models];
    for (const model of modelsCopy) {
      const submodelIds = model.submodelIDs;
      for (const submodelId of submodelIds) {
        const metadata = model.metadata[submodelId];
        const value = metadata[activeMetadataColumn];
        colorMap.set(submodelId, stylesheet[value]?.vec || [1, 1, 1]);
      }
      model.setColorMap(colorMap);
    }

    return () => {
      for (const model of modelsCopy) {
        model.whiten();
      }
    };
  }, [models, activeMetadataColumn, styles]);
}
