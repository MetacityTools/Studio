import {
  ActionGroup,
  Item,
  Selection,
  Tooltip,
  TooltipTrigger,
  View,
} from "@adobe/react-spectrum";
import { CameraView } from "@bananagl/bananagl";
import {
  CubeEmpty,
  CubeLeft,
  CubeRight,
  CubeTop,
} from "@core/components/Icons";
import { useActiveView } from "@features/editor/hooks/useActiveView";
import { useRenderer } from "@features/editor/hooks/useRender";
import { useCallback, useState } from "react";

export default function CameraViewToolbar() {
  const renderer = useRenderer();
  const activeView = useActiveView();

  const [mode, setMode] = useState<CameraView>(CameraView.Free);

  const handleAction = useCallback(
    (keys: Selection) => {
      //ignore if all keys are selected
      if (keys === "all") return;

      //get first key
      const viewMode = keys.values().next().value as CameraView;
      const view = renderer.views?.[activeView].view;
      if (!view) return;
      view.cameraLock.mode = viewMode;
      setMode(viewMode);
    },

    [activeView, renderer.views, setMode],
  );

  return (
    <View
      backgroundColor="gray-50"
      padding="size-50"
      borderRadius="medium"
      borderColor="gray-300"
      borderWidth="thin"
      gridArea="camera"
    >
      <ActionGroup
        selectionMode="single"
        overflowMode="collapse"
        onSelectionChange={handleAction}
        selectedKeys={[mode]}
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
