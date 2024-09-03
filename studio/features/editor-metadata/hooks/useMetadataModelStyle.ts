import { GeometryMode } from "@features/editor/data/types";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { vec3 } from "gl-matrix";
import { useEffect } from "react";

export default function useMetadataModelStyle() {
  const {
    models,
    styles,
    modelStyles,
    activeMetadataColumn,
    setModels,
    scene,
  } = useEditorContext();

  useEffect(() => {
    if (!activeMetadataColumn) {
      return;
    }

    const stylesheet = styles[activeMetadataColumn];
    if (!stylesheet) return; //TODO color all to default

    const colorMap = new Map<number, vec3>();
    for (const model of models) {
      const submodelIds = model.submodelIDs;
      for (const submodelId of submodelIds) {
        const metadata = model.metadata[submodelId];
        if (!metadata) continue;
        const value = metadata[activeMetadataColumn];
        if (typeof value === "string" || typeof value === "number")
          colorMap.set(submodelId, stylesheet[value]?.vec || [1, 1, 1]);
      }
      model.setColorMap(colorMap);
    }

    return () => {
      for (const model of models) {
        model.whiten();
      }
    };
  }, [models, activeMetadataColumn, styles]);

  useEffect(() => {
    if (activeMetadataColumn) {
      const modelStyleColumn = modelStyles[activeMetadataColumn];

      models.forEach((model) => {
        const modelStyle = modelStyleColumn?.[model.uuid];
        model.geometryMode = modelStyle?.geometryMode ?? GeometryMode.SOLID;
        model.skipPicking = modelStyle?.geometryMode === GeometryMode.WIREFRAME;
        model.attributes.needsRebind = true;
      });

      scene.shadersChanged = true;
    }

    return () => {
      models.forEach((model) => {
        model.geometryMode = GeometryMode.SOLID;
        model.skipPicking = false;
        model.attributes.needsRebind = true;
      });

      scene.shadersChanged = true;
    };
  }, [models, activeMetadataColumn, modelStyles, scene]);
}
