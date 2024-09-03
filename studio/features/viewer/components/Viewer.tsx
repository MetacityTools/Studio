"use client";

import { Grid, View } from "@adobe/react-spectrum";
//import Brush from "@spectrum-icons/workflow/Brush";
import useMetadataModelStyle from "@features/editor-metadata/hooks/useMetadataModelStyle";
import ActiveColumnToolbar from "@features/editor-toolbar/components/ActiveColumnToolbar";
import CameraViewToolbar from "@features/editor-toolbar/components/CameraViewToolbar";
import ColorSchemeToolbar from "@features/editor-toolbar/components/ColorSchemeToolbar";
import ProjectionToolbar from "@features/editor-toolbar/components/ProjectionToolbar";
import SelectionToolbar from "@features/editor-toolbar/components/SelectionToolbar";

import { CanvasWrapper } from "@features/editor/components/Canvas/CanvasWrapper";
import { TooltipOverlay } from "@features/editor/components/Canvas/TooltipOverlay";

type ViewerProps = {
  embedId: number;
};

export default function Viewer(props: ViewerProps) {
  useMetadataModelStyle();

  return (
    <View width="100%" height="100%" position="relative">
      <CanvasWrapper />
      <TooltipOverlay />
      <View position="absolute" top="size-100" left="size-100">
        <Grid
          areas={["projection camera selection scheme style"]}
          columns={["auto auto auto auto"]}
          rows={["auto"]}
          gap="size-100"
          width="size-100"
        >
          <ProjectionToolbar />
          <CameraViewToolbar />
          <SelectionToolbar />
          <ColorSchemeToolbar />
          <ActiveColumnToolbar />
        </Grid>
      </View>
    </View>
  );
}
