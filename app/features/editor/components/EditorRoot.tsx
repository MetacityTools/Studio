import { Flex, View } from "@adobe/react-spectrum";
import Editor from "@features/editor/components/Editor";
import EditorHeader from "@features/editor/components/EditorHeader";
import { EditorProvider } from "@features/editor/providers/EditorProvider";
import { MetadataProvider } from "@features/metadata/providers/MetadataProvider";

export default function EditorRoot() {
  return (
    <EditorProvider>
      <MetadataProvider>
        <Flex width="100vw" height="100vh" direction="column">
          <View gridArea="header" width="100%">
            <EditorHeader />
          </View>
          <View gridArea="content" overflow="hidden" width="100%" height="100%">
            <Editor />
          </View>
        </Flex>
      </MetadataProvider>
    </EditorProvider>
  );
}
