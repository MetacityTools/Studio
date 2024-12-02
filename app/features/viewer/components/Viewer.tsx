import { Grid, View } from "@adobe/react-spectrum";
//import Brush from "@spectrum-icons/workflow/Brush";
import ActiveColumnToolbar from "@features/editor/components/Header/ActiveColumnToolbar";
import CameraViewToolbar from "@features/editor/components/Header/CameraViewToolbar";
import ColorSchemeToolbar from "@features/editor/components/Header/ColorSchemeToolbar";
import ProjectionToolbar from "@features/editor/components/Header/ProjectionToolbar";
import SelectionToolbar from "@features/editor/components/Header/SelectionToolbar";
import useMetadataModelStyle from "@features/metadata/hooks/useMetadataModelStyle";

import { CanvasWrapper } from "@features/editor/components/Canvas/CanvasWrapper";
import { TooltipOverlay } from "@features/editor/components/Canvas/TooltipOverlay";

export default function Viewer() {
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
