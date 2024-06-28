import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Form,
  Heading,
  TextField,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback, useEffect, useState } from "react";
import { useModel } from "../hooks/useModel";
import { useRenameModel } from "../hooks/useRenameModel";

type ModelRenameDialogProps = {
  open: boolean;
  close: () => void;
  modelId: number | null;
};

export default function ModelRenameDialog({
  open,
  close,
  modelId,
}: ModelRenameDialogProps) {
  const { data } = useModel(modelId);
  const { call, inProgress } = useRenameModel();
  const [name, setName] = useState("");

  useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  const handleRename = useCallback(async () => {
    if (!modelId) {
      ToastQueue.negative("Invalid model id");
      return;
    }

    const data = {
      name,
    };

    try {
      await call(modelId, data);
      ToastQueue.info("Model renamed successfully");
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Failed to rename model");
    }
  }, [call, close, modelId, name]);

  return (
    <DialogContainer onDismiss={close}>
      {open && modelId && (
        <Dialog>
          <Heading>Rename Model</Heading>
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
            </Form>
          </Content>
          <ButtonGroup marginTop={20}>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              variant="accent"
              isPending={inProgress}
              onPress={handleRename}
            >
              Rename
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogContainer>
  );
}
