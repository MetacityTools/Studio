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

type CreateProjectFormData = {
  name: string;
  description: string;
};

type CreateProjectDialogProps = {
  close: () => void;
};

export default function CreateProjectDialog({
  close,
}: CreateProjectDialogProps) {
  const { call, inProgress } = useCreateProjects();

  //form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = useCallback(async () => {
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

  console.log("rendering create project page");

  return (
    <Dialog>
      <Heading>Create Project</Heading>
      <Content>
        <Form maxWidth="size-6000" validationBehavior="native">
          <TextField
            label="Project name"
            name="name"
            isRequired
            value={name}
            onChange={setName}
          />
          <TextArea
            label="Description"
            name="description"
            isRequired
            value={description}
            onChange={setDescription}
          />
        </Form>
      </Content>
      <ButtonGroup marginTop={20}>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
        <Button
          variant="accent"
          type="submit"
          isPending={inProgress}
          onPress={handleSubmit}
        >
          Create
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
