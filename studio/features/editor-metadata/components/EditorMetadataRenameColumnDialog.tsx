import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Form,
  Heading,
  Text,
  TextField,
  View,
} from "@adobe/react-spectrum";
import { useCallback, useMemo, useState } from "react";

type RenameColumnDialogProps = {
  close: () => void;
  existingColumns: { key: string }[];
  onSubmit: (newColumnName: string) => void;
};

export function RenameColumnDialog({
  close,
  onSubmit,
  existingColumns,
}: RenameColumnDialogProps) {
  const [newColumnName, setNewColumnName] = useState("");

  const handleSubmit = useCallback(() => {
    if (!newColumnName) {
      return;
    }

    onSubmit(newColumnName);
    close();
  }, [newColumnName, onSubmit, close]);

  const isOverwritingExistingColumn = useMemo(() => {
    return existingColumns.some((column) => column.key === newColumnName);
  }, [existingColumns, newColumnName]);

  return (
    <Dialog onDismiss={close}>
      <Heading>Rename Column</Heading>
      <Content>
        <Form maxWidth="size-6000" validationBehavior="native">
          <TextField
            label="New column name"
            name="value"
            isRequired
            validate={(value) => {
              if (!value) {
                return "Column name is required";
              }
            }}
            value={newColumnName}
            onChange={setNewColumnName}
          />
        </Form>
        {isOverwritingExistingColumn && (
          <View marginTop="size-100">
            <Text>
              This column name already exists. The value in the existing column
              will be overwritten for models with data in both columns.
            </Text>
          </View>
        )}
      </Content>
      <ButtonGroup marginTop={20}>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
        <Button variant="accent" onPress={handleSubmit}>
          Rename
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
