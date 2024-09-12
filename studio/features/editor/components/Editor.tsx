"use client";

import {
  Grid,
  Item,
  TabList,
  TabPanels,
  Tabs,
  View,
} from "@adobe/react-spectrum";
import { ToastContainer } from "@react-spectrum/toast";
//import Brush from "@spectrum-icons/workflow/Brush";
import { PositioningContainer } from "@core/components/PositioningContainer";
import { MdiCube } from "@core/icons/MdiCube";
import { MdiExport } from "@core/icons/MdiExport";
import { MdiPalette } from "@core/icons/MdiPalette";
import { MdiTable } from "@core/icons/MdiTable";
import EditorExports from "@features/editor-exports/components/EditorExports";
import EditorColumns from "@features/editor-metadata/components/EditorColumns";
import EditorStyle from "@features/editor-metadata/components/EditorStyle";
import useMetadataModelStyle from "@features/editor-metadata/hooks/useMetadataModelStyle";
import EditorModels from "@features/editor-models/components/EditorModels";
import ActiveColumnToolbar from "@features/editor-toolbar/components/ActiveColumnToolbar";
import CameraViewToolbar from "@features/editor-toolbar/components/CameraViewToolbar";
import ColorSchemeToolbar from "@features/editor-toolbar/components/ColorSchemeToolbar";
import ProjectionToolbar from "@features/editor-toolbar/components/ProjectionToolbar";
import SelectionToolbar from "@features/editor-toolbar/components/SelectionToolbar";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { CanvasWrapper } from "./Canvas/CanvasWrapper";
import { TooltipOverlay } from "./Canvas/TooltipOverlay";
import "./Editor.css";

type EditorProps = SidePanelProps;

export default function Editor(props: EditorProps) {
  useMetadataModelStyle();

  return (
    <Allotment>
      <Allotment.Pane snap minSize={100} preferredSize={500}>
        <SidePanel {...props} />
      </Allotment.Pane>
      <Allotment.Pane>
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
      </Allotment.Pane>
    </Allotment>
  );
}

type SidePanelProps = {
  projectId: number;
};

function SidePanel(props: SidePanelProps) {
  return (
    <PositioningContainer>
      <Tabs height="100%" aria-label="Editor tabs" orientation="vertical">
        <View
          borderBottomWidth="thin"
          borderBottomColor="light"
          backgroundColor="gray-50"
        >
          <TabList
            UNSAFE_style={{
              paddingRight: "var(--spectrum-global-dimension-size-50)",
            }}
          >
            <Item key="models" textValue="Models">
              <MdiCube />
            </Item>
            <Item key="columns" textValue="Columns">
              <MdiTable />
            </Item>
            <Item key="style" textValue="Style">
              <MdiPalette />
            </Item>
            <Item key="exports" textValue="Exports">
              <MdiExport />
            </Item>
          </TabList>
        </View>
        <View
          position="relative"
          height="100%"
          width="100%"
          overflow="auto"
          backgroundColor="gray-50"
          borderStartWidth="thin"
          borderStartColor="light"
        >
          <TabPanels height="100%" UNSAFE_className="borderless">
            <Item key="models">
              <EditorModels {...props} />
            </Item>
            <Item key="columns">
              <EditorColumns {...props} />
            </Item>
            <Item key="style">
              <EditorStyle {...props} />
            </Item>
            <Item key="exports">
              <EditorExports {...props} />
            </Item>
          </TabPanels>
        </View>
      </Tabs>
      <ToastContainer />
    </PositioningContainer>
  );
}
