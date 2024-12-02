import { Flex, View } from "@adobe/react-spectrum";
import { MetadataProvider } from "@features/metadata/providers/MetadataProvider";

import { EditorProvider } from "@features/editor/providers/EditorProvider";
import Viewer from "@features/viewer/components/Viewer";
import ViewerHeader from "@features/viewer/components/ViewerHeader";

export default function EmbedRoot() {
  return (
    <EditorProvider>
      <MetadataProvider>
        <Flex width="100vw" height="100vh" direction="column">
          <View gridArea="header" width="100%">
            <ViewerHeader />
          </View>
          <View gridArea="content" overflow="hidden" width="100%" height="100%">
            <Viewer />
          </View>
        </Flex>
      </MetadataProvider>
    </EditorProvider>
  );
}
