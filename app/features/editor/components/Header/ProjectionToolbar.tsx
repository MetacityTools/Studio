import { ActionGroup, Item, Selection, Tooltip, TooltipTrigger, View } from "@adobe/react-spectrum";
import { ProjectionType } from "@bananagl/bananagl";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useCallback } from "react";
import { BiRectangle } from "react-icons/bi";
import { TbPerspective } from "react-icons/tb";

export default function ProjectionToolbar() {
  const { projection, setProjection } = useEditorContext();

  const handleAction = useCallback(
    (keys: Selection) => {
      //ignore if all keys are selected
      if (keys === "all") return;

      //get first key
      const key = (keys.values().next().value as ProjectionType) ?? ProjectionType.ORTHOGRAPHIC;

      setProjection(key);
    },
    [setProjection]
  );

  return (
    <View padding="size-50" borderRadius="medium" gridArea="projection">
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
