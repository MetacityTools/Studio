"use client";

import {
  Button,
  ButtonGroup,
  Flex,
  Form,
  TextField,
} from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContentContainer } from "@core/components/ContentContainer";
import Header from "@features/projects/components/Header";
import { useCreateProjects } from "@features/projects/hooks/useCreateProject";

function SecretPage() {
  const { call, inProgress } = useCreateProjects();

  //TODO handle submit

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
            key: "create",
            children: "Create Project",
          },
        ]}
      />
      <ContentContainer>
        <Form maxWidth="size-6000">
          <TextField label="Project name" />
          <ButtonGroup>
            <Button type="submit" variant="primary" isDisabled={inProgress}>
              Create
            </Button>
          </ButtonGroup>
        </Form>
      </ContentContainer>
    </Flex>
  );
}

export default withPageAuthRequired(SecretPage);
