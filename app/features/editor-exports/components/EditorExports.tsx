import { Item, TabList, TabPanels, Tabs, Text, View } from "@adobe/react-spectrum";
import { PositioningContainer } from "@core/components/PositioningContainer";
import EditorExportsCreate from "./EditorExportsCreate";

export default function EditorExports() {
  return (
    <PositioningContainer>
      <Tabs height="100%" aria-label="Editor tabs">
        <View borderBottomWidth="thin" borderBottomColor="light" paddingX="size-200" backgroundColor="gray-50">
          <TabList>
            <Item key="create" textValue="Create Export">
              <Text>Create Export</Text>
            </Item>
            <Item key="exports" textValue="Exports">
              <Text>Exports</Text>
            </Item>
          </TabList>
        </View>
        <View position="relative" height="100%" overflow="auto" backgroundColor="gray-50">
          <TabPanels height="100%" UNSAFE_className="borderless">
            <Item key="create">
              <EditorExportsCreate />
            </Item>
          </TabPanels>
        </View>
      </Tabs>
    </PositioningContainer>
  );
}
