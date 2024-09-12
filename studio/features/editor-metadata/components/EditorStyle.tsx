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
import EditorMetadataModels from "./EditorMetadataModels";
import EditorMetadataValues from "./EditorMetadataValues";

type EditorMetadataProps = {
  projectId: number;
};

export default function EditorStyle({ projectId }: EditorMetadataProps) {
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
            <Item key="values" textValue="Values">
              <Text>Values</Text>
            </Item>
            <Item key="additional" textValue="Additional Styles">
              <Text>Model Styles</Text>
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
            <Item key="values">
              <EditorMetadataValues />
            </Item>
            <Item key="additional">
              <EditorMetadataModels />
            </Item>
          </TabPanels>
        </View>
      </Tabs>
    </PositioningContainer>
  );
}
