import {
  Button,
  ButtonGroup,
  Checkbox,
  Content,
  Dialog,
  Flex,
  Heading,
  Item,
  ListView,
  View,
} from "@adobe/react-spectrum";
import { PositioningContainer } from "@core/components/PositioningContainer";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback, useState } from "react";

type DeleteMultipleColumnsDialogProps = {
  columns: {
    key: string;
  }[];
  close: () => void;
  onSubmit: (value: string[]) => void;
};

export default function DeleteMultipleColumnsDialog({
  columns,
  close,
  onSubmit,
}: DeleteMultipleColumnsDialogProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleSubmit = useCallback(async () => {
    try {
      onSubmit(selectedKeys);
      ToastQueue.positive("Columns deleted");
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Failed to delete columns");
    }
  }, [selectedKeys, onSubmit, close]);

  return (
    <Dialog onDismiss={close}>
      <Heading>Select columns to delete</Heading>
      <Content marginTop="size-200">
        <PositioningContainer>
          <Flex direction="column" gap="size-100" height="100%">
            {columns.length > 1 && (
              <View overflow="hidden" position="relative">
                <Checkbox
                  marginX="size-160"
                  isSelected={selectedKeys.length === columns.length}
                  isIndeterminate={
                    selectedKeys.length > 0 &&
                    selectedKeys.length < columns.length
                  }
                  onChange={(isSelected) => {
                    if (isSelected) {
                      setSelectedKeys(columns.map((item) => item.key));
                    } else {
                      setSelectedKeys([]);
                    }
                  }}
                >
                  Select all columns
                </Checkbox>
              </View>
            )}
            <View height="100%" overflow="hidden" position="relative">
              <ListView
                width="100%"
                height="100%"
                items={columns}
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => {
                  if (keys === "all") {
                    setSelectedKeys(columns.map((item) => item.key));
                  } else {
                    setSelectedKeys(Array.from(keys) as string[]);
                  }
                }}
              >
                {(item) => <Item key={item.key}>{item.key}</Item>}
              </ListView>
            </View>
          </Flex>
        </PositioningContainer>
      </Content>
      <ButtonGroup marginTop={20}>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
        <Button variant="negative" onPress={handleSubmit}>
          Delete
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
