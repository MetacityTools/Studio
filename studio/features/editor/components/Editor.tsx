"use client";

import {
  Grid,
  Item,
  TabList,
  TabPanels,
  Tabs,
  Text,
  View,
} from "@adobe/react-spectrum";
import { ToastContainer } from "@react-spectrum/toast";
//import Brush from "@spectrum-icons/workflow/Brush";
import { PositioningContainer } from "@core/components/PositioningContainer";
import EditorMetadata from "@features/editor-metadata/components/EditorMetadata";
import EditorModels from "@features/editor-models/components/EditorModels";
import CameraViewToolbar from "@features/editor-toolbar/components/CameraViewToolbar";
import ProjectionToolbar from "@features/editor-toolbar/components/ProjectionToolbar";
import SelectionToolbar from "@features/editor-toolbar/components/SelectionToolbar";
import ShaderToolbar from "@features/editor-toolbar/components/ShaderToolbar";
import BoxExport from "@spectrum-icons/workflow/BoxExport";
import Code from "@spectrum-icons/workflow/Code";
import Data from "@spectrum-icons/workflow/Data";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { CanvasWrapper } from "./Canvas/CanvasWrapper";
import "./Editor.css";

type EditorProps = SidePanelProps;

export default function Editor(props: EditorProps) {
  return (
    <Allotment>
      <Allotment.Pane snap minSize={100} preferredSize={500}>
        <SidePanel {...props} />
      </Allotment.Pane>
      <Allotment.Pane>
        <View width="100%" height="100%" position="relative">
          <CanvasWrapper />
          <View position="absolute" top="size-100" left="size-100">
            <Grid
              areas={["projection camera shader selection"]}
              columns={["auto auto auto auto"]}
              rows={["auto"]}
              gap="size-100"
              width="size-100"
            >
              <ProjectionToolbar />
              <CameraViewToolbar />
              <ShaderToolbar />
              <SelectionToolbar />
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
      <Tabs height="100%" aria-label="Editor tabs">
        <View
          borderBottomWidth="thin"
          borderBottomColor="light"
          paddingX="size-200"
          backgroundColor="gray-50"
        >
          <TabList>
            <Item key="models" textValue="Models">
              <Data />
              <Text>Models</Text>
            </Item>
            <Item key="metadata" textValue="Metadata">
              <Code />
              <Text>Metadata</Text>
            </Item>
            <Item key="style" textValue="Style">
              <BoxExport />
              <Text>Exports</Text>
            </Item>
          </TabList>
        </View>
        <View
          position="relative"
          height="100%"
          overflow="auto"
          backgroundColor="gray-50"
        >
          <TabPanels height="100%" UNSAFE_className="borderless">
            <Item key="models">
              <EditorModels {...props} />
            </Item>
            <Item key="metadata">
              <EditorMetadata {...props} />
            </Item>
            <Item key="style">style</Item>
          </TabPanels>
        </View>
      </Tabs>
      <ToastContainer />
    </PositioningContainer>
  );
}
