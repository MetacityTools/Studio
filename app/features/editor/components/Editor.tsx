import { Item, TabList, TabPanels, Tabs, View } from "@adobe/react-spectrum";
import { ToastContainer } from "@react-spectrum/toast";
//import Brush from "@spectrum-icons/workflow/Brush";
import { PositioningContainer } from "@core/components/PositioningContainer";
import { MdiCube } from "@core/icons/MdiCube";
import { MdiExport } from "@core/icons/MdiExport";
import { MdiPalette } from "@core/icons/MdiPalette";
import { MdiTable } from "@core/icons/MdiTable";
import EditorExports from "@features/editor-exports/components/EditorExports";
import EditorMetadataColor from "@features/editor-metadata-color/components/EditorMetadataColor";
import EditorColumns from "@features/editor-metadata-columns/components/EditorColumns";
import useMetadataModelStyle from "@features/editor-metadata/hooks/useMetadataModelStyle";
import EditorModels from "@features/editor-models/components/EditorModels";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { CanvasWrapper } from "./Canvas/CanvasWrapper";
import { TooltipOverlay } from "./Canvas/TooltipOverlay";
import "./Editor.css";

export default function Editor() {
  useMetadataModelStyle();

  return (
    <Allotment>
      <Allotment.Pane snap minSize={100} preferredSize={500}>
        <SidePanel />
      </Allotment.Pane>
      <Allotment.Pane>
        <View width="100%" height="100%" position="relative">
          <CanvasWrapper />
          <TooltipOverlay />
        </View>
      </Allotment.Pane>
    </Allotment>
  );
}

function SidePanel() {
  return (
    <PositioningContainer>
      <Tabs height="100%" aria-label="Editor tabs" orientation="vertical">
        <View borderBottomWidth="thin" borderBottomColor="light" backgroundColor="gray-50">
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
              <EditorModels />
            </Item>
            <Item key="columns">
              <EditorColumns />
            </Item>
            <Item key="style">
              <EditorMetadataColor />
            </Item>
            <Item key="exports">
              <EditorExports />
            </Item>
          </TabPanels>
        </View>
      </Tabs>
      <ToastContainer />
    </PositioningContainer>
  );
}
