"use client";

import { Flex } from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { withUserEnabled } from "@core/utils/withUserEnabled";
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
    <Flex
      direction="column"
      width="100%"
      height="100%"
      gap="size-10"
      justifyContent="start"
      alignItems="start"
    >
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
    </Flex>
  );
}

export default withPageAuthRequired(withUserEnabled(ProjectPage));
