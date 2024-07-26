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
import { EditorModel } from "@features/editor/data/EditorModel";
import { useModels } from "@features/editor/hooks/useModels";
import { useCallback, useEffect, useState } from "react";

type EditDialogProps = {
  open: boolean;
  close: () => void;
  model: EditorModel | null;
};

export default function EditorRenameModelDialog({
  open,
  close,
  model,
}: EditDialogProps) {
  const [models, setModels] = useModels();

  const [name, setName] = useState("");

  useEffect(() => {
    if (model) {
      setName(model.name);
    }
  }, [model]);

  const handleSubmit = useCallback(async () => {
    if (!model) return;
    if (!name) return;
    model.name = name;
    setModels([...models]);
    close();
  }, [name, model, models, setModels, close]);

  return (
    <DialogContainer onDismiss={close}>
      {open && (
        <Dialog>
          <Heading>Update Model</Heading>
          <Content>
            <Form maxWidth="size-6000" validationBehavior="native">
              <TextField
                label="Model name"
                name="name"
                isRequired
                validate={(value) => {
                  if (!value) {
                    return "Model name is required";
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
            <Button variant="accent" onPress={handleSubmit}>
              Update
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogContainer>
  );
}
