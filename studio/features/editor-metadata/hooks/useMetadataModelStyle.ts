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

  useEffect(() => {
    if (activeMetadataColumn) {
      const modelStyleColumn = modelStyles[activeMetadataColumn];

      setModels((prev) => {
        prev.forEach((model) => {
          const modelStyle = modelStyleColumn?.[model.uuid];
          model.geometryMode = modelStyle?.geometryMode ?? GeometryMode.SOLID;
          model.attributes.needsRebind = true;
        });

        return prev.slice();
      });

      scene.shadersChanged = true;
    }

    return () => {
      setModels((prev) => {
        prev.forEach((model) => {
          model.geometryMode = GeometryMode.SOLID;
          model.attributes.needsRebind = true;
        });

        return prev.slice();
      });
      scene.shadersChanged = true;
    };
  }, [activeMetadataColumn, modelStyles, scene, setModels]);
}
