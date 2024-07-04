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
import Brush from "@spectrum-icons/workflow/Brush";
import Code from "@spectrum-icons/workflow/Code";
import Data from "@spectrum-icons/workflow/Data";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import EditorMetadata from "./EditorMetadata";
import EditorModels from "./EditorModels";
import EditorStyle from "./EditorStyle";

type EditorProps = SidePanelProps;

export default function Editor(props: EditorProps) {
  return (
    <Allotment>
      <Allotment.Pane snap minSize={100} preferredSize={500}>
        <SidePanel {...props} />
      </Allotment.Pane>
      <Allotment.Pane>
        <div />
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
      <Tabs height="100%">
        <View
          borderBottomWidth="thin"
          borderBottomColor="light"
          paddingX="size-200"
          backgroundColor="gray-50"
        >
          <TabList>
            <Item key="models">
              <Data />
              <Text>Models</Text>
            </Item>
            <Item key="metadata">
              <Code />
              <Text>Metadata</Text>
            </Item>
            <Item key="style">
              <Brush />
              <Text>Style</Text>
            </Item>
          </TabList>
        </View>
        <View
          position="relative"
          height="100%"
          overflow="auto"
          backgroundColor="gray-50"
        >
          <TabPanels>
            <Item key="models">
              <EditorModels {...props} />
            </Item>
            <Item key="metadata">
              <EditorMetadata {...props} />
            </Item>
            <Item key="style">
              <EditorStyle {...props} />
            </Item>
          </TabPanels>
        </View>
      </Tabs>
      <ToastContainer />
    </PositioningContainer>
  );
}

function PositioningContainer({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      areas={{
        base: ["content"],
      }}
      width="100%"
      height="100%"
      gap="size-100"
    >
      <View
        gridArea="content"
        position="relative"
        overflow="hidden"
        width="100%"
        height="100%"
      >
        {children}
      </View>
    </Grid>
  );
}
