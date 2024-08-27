import {
  ActionGroup,
  Item,
  Selection,
  Tooltip,
  TooltipTrigger,
  View,
} from "@adobe/react-spectrum";
import { ProjectionType } from "@bananagl/bananagl";
import { useActiveView } from "@features/editor/hooks/useActiveView";
import { useRenderer } from "@features/editor/hooks/useRender";
import { useCallback, useState } from "react";
import { BiRectangle } from "react-icons/bi";
import { TbPerspective } from "react-icons/tb";

export default function ProjectionToolbar() {
  const renderer = useRenderer();
  const activeView = useActiveView();

  const [projection, setProjection] = useState<ProjectionType>(
    ProjectionType.ORTHOGRAPHIC,
  );

  const handleAction = useCallback(
    (keys: Selection) => {
      //ignore if all keys are selected
      if (keys === "all") return;

      //get first key
      const key =
        (keys.values().next().value as ProjectionType) ??
        ProjectionType.ORTHOGRAPHIC;
      const view = renderer.views?.[activeView].view;
      if (!view) return;
      view.camera.projectionType = key;
      setProjection(key);
    },
    [activeView, renderer.views],
  );

  return (
    <View
      backgroundColor="gray-50"
      padding="size-50"
      borderRadius="medium"
      borderColor="gray-300"
      borderWidth="thin"
      gridArea="projection"
    >
      <ActionGroup
        selectionMode="single"
        overflowMode="collapse"
        onSelectionChange={handleAction}
        selectedKeys={[projection]}
        isQuiet
      >
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={ProjectionType.ORTHOGRAPHIC}>
            <BiRectangle className="text-2xl" />
          </Item>
          <Tooltip>Orthographic projection</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={ProjectionType.PERSPECTIVE}>
            <TbPerspective className="text-2xl" />
          </Item>
          <Tooltip>Perspective projection</Tooltip>
        </TooltipTrigger>
      </ActionGroup>
    </View>
  );
}
