"use client";

import {
  ActionButton,
  Button,
  Dialog,
  DialogTrigger,
  Flex,
  Item,
  ListView,
  Text,
} from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContentContainer } from "@core/components/ContentContainer";
import { NoData } from "@core/components/Empty";
import { withUserEnabled } from "@core/utils/withUserEnabled";
import CreateProjectDialog from "@features/projects/components/CreateDialog";
import Header from "@features/projects/components/Header";
import { useOwnProjects } from "@features/projects/hooks/useOwnProjects";
import File from "@spectrum-icons/illustrations/File";
import Link from "next/link";
import { ToastContainer } from "@react-spectrum/toast";

function SecretPage() {
  const { data: projects, isLoading } = useOwnProjects();

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
          },
        ]}
      />
      <ContentContainer>
        <DialogTrigger>
          <ActionButton>Create Project</ActionButton>
          {(close) => <CreateProjectDialog close={close} />}
        </DialogTrigger>
        <ListView
          width="size-6000"
          minHeight="size-3000"
          selectionMode="multiple"
          aria-label="ListView multiple selection example"
          renderEmptyState={() => <NoData />}
          selectionStyle="highlight"
        >
          {projects.map((project) => (
            <Item key={project.id}>
              <File />
              <Text>{project.name}</Text>
            </Item>
          ))}
        </ListView>
      </ContentContainer>
      <ToastContainer />
    </Flex>
  );
}

export default withPageAuthRequired(withUserEnabled(SecretPage));

/*

        >
          {projects ? (
            projects?.map((project) => (
              <Item key="Charmander">
                <File />
                <Text>Onboarding</Text>
              </Item>
            ))
          ) : (
            <NoData />
          )}
<p>This page is only accessible to authenticated users.</p>
      <h2>User</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <img src={userPicture} alt="User picture" />

      <h2>Projects</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
*/
