"use client";

import { Flex, View } from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { withUserEnabled } from "@core/utils/withUserEnabled";
import { MetadataProvider } from "@features/editor-metadata/providers/MetadataProvider";

import { EditorProvider } from "@features/editor/providers/EditorProvider";
import Viewer from "@features/viewer/components/Viewer";
import ViewerHeader from "@features/viewer/components/ViewerHeader";

type ProjectPageProps = {
  params: {
    embedId: string;
  };
};

function EmbedPage({ params }: ProjectPageProps) {
  const embedId = params.embedId;
  const sanitizedId = parseInt(embedId, 10);

  return (
    <EditorProvider>
      <MetadataProvider>
        <Flex width="100vw" height="100vh" direction="column">
          <View gridArea="header" width="100%">
            <ViewerHeader embedId={sanitizedId} />
          </View>
          <View gridArea="content" overflow="hidden" width="100%" height="100%">
            <Viewer embedId={sanitizedId} />
          </View>
        </Flex>
      </MetadataProvider>
    </EditorProvider>
  );
}

export default withPageAuthRequired(withUserEnabled(EmbedPage));
