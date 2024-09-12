"use client";

import { Flex, View } from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { withUserEnabled } from "@core/utils/withUserEnabled";
import { MetadataProvider } from "@features/editor-metadata/providers/MetadataProvider";
import Editor from "@features/editor/components/Editor";

import EditorHeader from "@features/editor/components/EditorHeader";
import { EditorProvider } from "@features/editor/providers/EditorProvider";

type ProjectPageProps = {
  params: {
    projectId: string;
  };
};

function ProjectPage({ params }: ProjectPageProps) {
  const projectId = params.projectId;
  const sanitizedId = parseInt(projectId, 10);

  return (
    <EditorProvider>
      <MetadataProvider>
        <Flex width="100vw" height="100vh" direction="column">
          <View gridArea="header" width="100%">
            <EditorHeader sanitizedId={sanitizedId} />
          </View>
          <View gridArea="content" overflow="hidden" width="100%" height="100%">
            <Editor projectId={sanitizedId} />
          </View>
        </Flex>
      </MetadataProvider>
    </EditorProvider>
  );
}

export default withPageAuthRequired(withUserEnabled(ProjectPage));
