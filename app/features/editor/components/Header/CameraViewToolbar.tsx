import { ActionGroup, Item, Selection, Tooltip, TooltipTrigger, View } from "@adobe/react-spectrum";
import { CameraView } from "@bananagl/bananagl";
import { CubeEmpty } from "@core/icons/CubeEmpty";
import { CubeLeft } from "@core/icons/CubeLeft";
import { CubeRight } from "@core/icons/CubeRight";
import { CubeTop } from "@core/icons/CubeTop";

import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useCallback } from "react";

export default function CameraViewToolbar() {
  const { viewMode, setViewMode } = useEditorContext();

  const handleAction = useCallback(
    (keys: Selection) => {
      //ignore if all keys are selected
      if (keys === "all") return;

      //get first key
      const viewMode = (keys.values().next().value as CameraView) ?? CameraView.Free;
      setViewMode(viewMode);
    },

    [setViewMode]
  );

  return (
    <View padding="size-50" borderRadius="medium" gridArea="camera">
      <ActionGroup
        selectionMode="single"
        overflowMode="collapse"
        onSelectionChange={handleAction}
        selectedKeys={[viewMode]}
        isQuiet
      >
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={CameraView.Free}>
            <CubeEmpty />
          </Item>
          <Tooltip>Free camera</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={CameraView.Top}>
            <CubeTop />
          </Item>
          <Tooltip>Top view</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={CameraView.Front}>
            <CubeLeft />
          </Item>
          <Tooltip>Front view</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={CameraView.Right}>
            <CubeRight />
          </Item>
          <Tooltip>Right view</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={CameraView.Left}>
            <CubeLeft />
          </Item>
          <Tooltip>Left view</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key={CameraView.Back}>
            <CubeRight />
          </Item>
          <Tooltip>Back view</Tooltip>
        </TooltipTrigger>
      </ActionGroup>
    </View>
  );
}
