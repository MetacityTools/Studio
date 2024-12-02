import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Form,
  Heading,
  Radio,
  RadioGroup,
  TextField,
} from "@adobe/react-spectrum";
import { toasterOptions } from "@core/defaults";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback, useState } from "react";

type AddColumnDialogProps = {
  close: () => void;
  onSubmit: (name: string, defaultValue: string | number, defaultType: "string" | "number") => void;
};

export default function AddColumnDialog({ close, onSubmit }: AddColumnDialogProps) {
  const [name, setName] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [defaultType, setDefaultType] = useState<"string" | "number">("string");

  const handleSubmit = useCallback(async () => {
    if (!name) {
      ToastQueue.negative("Column name is required", toasterOptions);
      return;
    }

    try {
      onSubmit(name, defaultValue, defaultType);
      ToastQueue.positive("Column created successfully", toasterOptions);
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Failed to create column", toasterOptions);
    }
  }, [name, defaultValue, defaultType, onSubmit, close]);

  return (
    <Dialog onDismiss={close}>
      <Heading>Add Column</Heading>
      <Content>
        <Form maxWidth="size-6000" validationBehavior="native">
          <TextField
            label="Column name"
            name="name"
            isRequired
            validate={(value) => {
              if (!value) {
                return "Column name is required";
              }
            }}
            value={name}
            onChange={setName}
          />
          <TextField
            label="Default value"
            name="defaultValue"
            isRequired
            validate={(value) => {
              if (!value) {
                return "Default value is required";
              }
            }}
            value={defaultValue}
            onChange={setDefaultValue}
          />
          <RadioGroup
            label="Assign as number or string?"
            value={defaultType}
            onChange={(value) => setDefaultType(value as "string" | "number")}
          >
            <Radio value="string">String</Radio>
            <Radio value="number">Number</Radio>
          </RadioGroup>
        </Form>
      </Content>
      <ButtonGroup marginTop={20}>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
        <Button variant="accent" onPress={handleSubmit}>
          Create
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
