import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Form,
  Heading,
  TextField,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback, useState } from "react";

type AddValueDialogProps = {
  close: () => void;
  onSubmit: (value: string | number) => void;
};

export default function AddValueDialog({
  close,
  onSubmit,
}: AddValueDialogProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!value) {
      ToastQueue.negative("Value is required");
      return;
    }

    try {
      onSubmit(value);
      ToastQueue.positive("Value added successfully");
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Failed to add value");
    }
  }, [value, onSubmit, close]);

  return (
    <Dialog onDismiss={close}>
      <Heading>Add Value</Heading>
      <Content>
        <Form maxWidth="size-6000" validationBehavior="native">
          <TextField
            label="Value"
            name="value"
            isRequired
            validate={(value) => {
              if (!value) {
                return "Value is required";
              }
            }}
            value={value}
            onChange={setValue}
          />
        </Form>
      </Content>
      <ButtonGroup marginTop={20}>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
        <Button variant="accent" onPress={handleSubmit}>
          Add
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
