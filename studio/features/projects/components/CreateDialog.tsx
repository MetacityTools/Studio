"use client";

import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Flex,
  Form,
  Heading,
  TextArea,
  TextField,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useCreateProjects } from "@features/projects/hooks/useCreateProject";
import { FormEvent, useCallback, useState } from "react";

type CreateProjectDialogProps = {
  close: () => void;
};

export default function CreateProjectDialog({
  close,
}: CreateProjectDialogProps) {
  const { call, inProgress } = useCreateProjects();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!name || !description) {
      ToastQueue.negative("Project name and description are required");
      return;
    }

    const data = {
      name,
      description,
    };

    try {
      await call(data);
      ToastQueue.positive("Project created successfully");
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Failed to create project");
    }
  }, [name, description, call, close]);

  return (
    <Dialog>
      <Heading>Create Project</Heading>
      <Content>
        <Form maxWidth="size-6000" validationBehavior="native">
          <TextField
            label="Project name"
            name="name"
            isRequired
            validate={(value) => {
              if (!value) {
                return "Project name is required";
              }
            }}
            value={name}
            onChange={setName}
          />
          <TextArea
            label="Description"
            name="description"
            isRequired
            validate={(value) => {
              if (!value) {
                return "Description is required";
              }
            }}
            value={description}
            onChange={setDescription}
          />
        </Form>
      </Content>
      <ButtonGroup marginTop={20}>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
        <Button variant="accent" isPending={inProgress} onPress={handleSubmit}>
          Create
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
