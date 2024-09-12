"use client";

import {
  Item,
  TabList,
  TabPanels,
  Tabs,
  Text,
  View,
} from "@adobe/react-spectrum";
import { PositioningContainer } from "@core/components/PositioningContainer";
import EditorMetadataColumns from "./EditorMetadataColumns";
import EditorMetadataImport from "./EditorMetadataImport";

type EditorMetadataProps = {
  projectId: number;
};

export default function EditorColumns({ projectId }: EditorMetadataProps) {
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
            <Item key="columns" textValue="Columns">
              <Text>Columns</Text>
            </Item>
            <Item key="import" textValue="Import Data from CSV">
              <Text>Import Data from CSV</Text>
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
            <Item key="columns">
              <EditorMetadataColumns />
            </Item>
            <Item key="import">
              <EditorMetadataImport />
            </Item>
          </TabPanels>
        </View>
      </Tabs>
    </PositioningContainer>
  );
}
