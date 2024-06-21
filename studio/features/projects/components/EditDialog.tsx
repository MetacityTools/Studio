import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Form,
  Heading,
  TextArea,
  TextField,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback, useEffect, useState } from "react";
import { useGetProjectById } from "../hooks/useProjectData";
import { useUpdateProject } from "../hooks/useUpdateProject";

type EditDialogProps = {
  open: boolean;
  close: () => void;
  projectId: number | null;
};

export default function EditDialog({
  open,
  close,
  projectId,
}: EditDialogProps) {
  const { data } = useGetProjectById(projectId);
  const { call, inProgress } = useUpdateProject();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (data) {
      console.log("data", data);
      setName(data.name);
      setDescription(data.description);
    }
  }, [data]);

  const handleSubmit = useCallback(async () => {
    if (!name || !description) {
      ToastQueue.negative("Project name and description are required");
      return;
    }

    if (!projectId) {
      ToastQueue.negative("Invalid project id");
      return;
    }

    const data = {
      name,
      description,
    };

    try {
      await call(projectId, data);
      ToastQueue.positive("Project updated successfully");
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Failed to create project");
    }
  }, [name, description, projectId, call, close]);

  return (
    <DialogContainer onDismiss={close}>
      {open && (
        <Dialog>
          <Heading>Update Project</Heading>
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
            <Button
              variant="accent"
              isPending={inProgress}
              onPress={handleSubmit}
            >
              Update
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogContainer>
  );
}
