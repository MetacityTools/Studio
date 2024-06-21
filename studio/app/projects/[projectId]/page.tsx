"use client";

import { Flex, View } from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { withUserEnabled } from "@core/utils/withUserEnabled";
import Editor from "@features/editor/components/Editor";
import Header from "@features/projects/components/Header";
import { useGetProjectById } from "@features/projects/hooks/useGetProjectById";

type ProjectPageProps = {
  params: {
    projectId: string;
  };
};

function ProjectPage({ params }: ProjectPageProps) {
  const projectId = params.projectId;
  const sanitizedId = parseInt(projectId, 10);
  const { data } = useGetProjectById(sanitizedId);

  return (
    <Flex width="100vw" height="100vh" direction="column">
      <View gridArea="header" width="100%">
        <Header
          nav={[
            {
              key: "projects",
              children: "Projects",
              link: "/projects",
            },
            {
              key: data?.name ?? "loading",
              children: data?.name ?? "loading",
            },
          ]}
        />
      </View>
      <View gridArea="content" overflow="hidden" width="100%" height="100%">
        <Editor />
      </View>
    </Flex>
  );
}

export default withPageAuthRequired(withUserEnabled(ProjectPage));
