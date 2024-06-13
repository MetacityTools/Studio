"use client";

import {
  Button,
  ButtonGroup,
  Flex,
  Form,
  TextArea,
  TextField,
} from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContentContainer } from "@core/components/ContentContainer";
import Header from "@features/projects/components/Header";
import { useCreateProjects } from "@features/projects/hooks/useCreateProject";
import { createProject } from "@features/projects/mutations/createProject";
import { FormEvent, useCallback } from "react";

function SecretPage() {
  //const { call, inProgress } = useCreateProjects();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());
      console.log(data);
      try {
        await createProject(data as unknown as any);
      } catch (error) {
        console.error(error);
      }
      event.preventDefault();
      event.stopPropagation();
    },
    []
  );

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
        <Form
          maxWidth="size-6000"
          onSubmit={handleSubmit}
          validationBehavior="native"
        >
          <TextField label="Project name" name="name" isRequired />
          <TextArea label="Description" name="description" isRequired />
          <ButtonGroup marginTop={20}>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </ButtonGroup>
        </Form>
      </ContentContainer>
    </Flex>
  );
}

export default withPageAuthRequired(SecretPage);
