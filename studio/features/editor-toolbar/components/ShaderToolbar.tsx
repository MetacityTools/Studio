import {
  ActionGroup,
  Item,
  Selection,
  Tooltip,
  TooltipTrigger,
  View,
} from "@adobe/react-spectrum";
import { TriangleFull, TriangleFullFilled } from "@core/components/Icons";
import { EditorModel } from "@features/editor/data/EditorModel";
import { GeometryMode } from "@features/editor/data/types";
import { useScene } from "@features/editor/hooks/useScene";
import { useCallback, useState } from "react";
import { TbVectorTriangle } from "react-icons/tb";

export default function ShaderToolbar() {
  const [geometryMode, setGeometryMode] = useState<GeometryMode>(
    GeometryMode.SOLID,
  );

  const scene = useScene();

  const setWireframe = useCallback(() => {
    setGeometryMode(GeometryMode.WIREFRAME);

    scene.objects.forEach((obj) => {
      if (obj instanceof EditorModel) {
        obj.geometryMode = GeometryMode.WIREFRAME;
        obj.attributes.needsRebind = true;
      }
    });

    scene.shadersChanged = true;
  }, [scene]);

  const setSolid = useCallback(() => {
    setGeometryMode(GeometryMode.SOLID);

    scene.objects.forEach((obj) => {
      if (obj instanceof EditorModel) {
        obj.geometryMode = GeometryMode.SOLID;
        obj.attributes.needsRebind = true;
      }
    });

    scene.shadersChanged = true;
  }, [scene]);

  const setNoEdges = useCallback(() => {
    setGeometryMode(GeometryMode.NOEDGES);

    scene.objects.forEach((obj) => {
      if (obj instanceof EditorModel) {
        obj.geometryMode = GeometryMode.NOEDGES;
        obj.attributes.needsRebind = true;
      }
    });

    scene.shadersChanged = true;
  }, [scene]);

  const handleAction = useCallback(
    (keys: Selection) => {
      //ignore if all keys are selected
      if (keys === "all") return;

      //get first key
      const key = keys.values().next().value as GeometryMode;
      if (key === GeometryMode.NOEDGES) setNoEdges();
      else if (key === GeometryMode.SOLID) setSolid();
      else if (key === GeometryMode.WIREFRAME) setWireframe();
    },

    [setNoEdges, setSolid, setWireframe],
  );

  return (
    <View
      backgroundColor="gray-50"
      padding="size-50"
      borderRadius="medium"
      borderColor="gray-300"
      borderWidth="thin"
      gridArea="shader"
    >
      <ActionGroup
        selectionMode="single"
        overflowMode="collapse"
        onSelectionChange={handleAction}
        selectedKeys={[geometryMode]}
        isQuiet
      >
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={GeometryMode.NOEDGES}>
            <TriangleFullFilled />
          </Item>
          <Tooltip>No edges</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={GeometryMode.SOLID}>
            <TriangleFull />
          </Item>
          <Tooltip>Solid</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={GeometryMode.WIREFRAME}>
            <TbVectorTriangle />
          </Item>
          <Tooltip>Wireframe</Tooltip>
        </TooltipTrigger>
      </ActionGroup>
    </View>
  );
}
