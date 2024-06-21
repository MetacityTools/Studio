import {
  Flex,
  Grid,
  Item,
  TabList,
  TabPanels,
  Tabs,
  Text,
  View,
} from "@adobe/react-spectrum";
import Brush from "@spectrum-icons/workflow/Brush";
import Code from "@spectrum-icons/workflow/Code";
import Data from "@spectrum-icons/workflow/Data";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import EditorMetadata from "./EditorMetadata";
import EditorModels from "./EditorModels";
import EditorStyle from "./EditorStyle";

export default function Editor() {
  return (
    <Allotment height="100%">
      <Allotment.Pane snap>
        <SidePanel />
      </Allotment.Pane>
      <Allotment.Pane>
        <div>Component B</div>
      </Allotment.Pane>
    </Allotment>
  );
}

function SidePanel() {
  return (
    <PositioningContainer>
      <Tabs aria-label="Chat log orientation example">
        <View
          borderBottomWidth="thin"
          borderBottomColor="light"
          paddingX="size-200"
        >
          <Flex
            direction="row"
            width="100%"
            gap="size-10"
            justifyContent="space-between"
            alignItems="center"
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
          </Flex>
        </View>
        <TabPanels>
          <Item key="models">
            <EditorModels />
          </Item>
          <Item key="metadata">
            <EditorMetadata />
          </Item>
          <Item key="style">
            <EditorStyle />
          </Item>
        </TabPanels>
      </Tabs>
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
      <View gridArea="content">{children}</View>
    </Grid>
  );
}
