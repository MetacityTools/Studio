import {
  Button,
  ButtonGroup,
  ComboBox,
  Content,
  Dialog,
  DialogContainer,
  Form,
  Heading,
  Item,
} from "@adobe/react-spectrum";
import { EditorModel } from "@features/editor/data/EditorModel";
import { useModels } from "@features/editor/hooks/useModels";
import { useProjectModels } from "@features/editor/hooks/useProjectModels";
import { useCallback, useState } from "react";

type EditDialogProps = {
  open: boolean;
  close: () => void;
  model: EditorModel | null;
};

export default function EditorProjectModelDialog({
  open,
  close,
  model,
}: EditDialogProps) {
  const [models, setModels] = useModels();
  const [targetModel, setTargetModel] = useState<EditorModel | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleProject = useProjectModels();

  const handleSubmit = useCallback(async () => {
    async function projectModel() {
      setIsRunning(true);
      if (!model) return;
      if (!targetModel) return;
      await handleProject(model, targetModel);
      setIsRunning(false);
      close();
    }

    if (!model) return;

    projectModel();
  }, [model, targetModel, models, close, handleProject]);

  return (
    <DialogContainer onDismiss={close}>
      {open && (
        <Dialog>
          <Heading>Project onto Model</Heading>
          <Content>
            <Form maxWidth="size-6000" validationBehavior="native">
              <ComboBox
                label="Identification column"
                defaultItems={models}
                width="100%"
                onSelectionChange={(key) =>
                  setTargetModel(models.find((m) => m.uuid === key) ?? null)
                }
                selectedKey={targetModel?.uuid}
              >
                {(model) => <Item key={model.uuid}>{model.name}</Item>}
              </ComboBox>
            </Form>
          </Content>
          <ButtonGroup marginTop={20}>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              variant="accent"
              onPress={handleSubmit}
              isDisabled={targetModel === null}
              isPending={isRunning}
            >
              Project
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogContainer>
  );
}
