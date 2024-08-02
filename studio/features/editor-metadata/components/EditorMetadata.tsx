import {
  ActionBar,
  ActionBarContainer,
  ActionButton,
  ActionGroup,
  AlertDialog,
  ComboBox,
  DialogContainer,
  DialogTrigger,
  Flex,
  Item,
  Key,
  ListView,
  Text,
  ToggleButton,
  Tooltip,
  TooltipTrigger,
  View,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { PositioningContainer } from "@core/components/PositioningContainer";
import useSelectedSubmodelCount from "@editor/hooks/useSelectedSubmodelCount";
import { useSelected } from "@features/editor/hooks/useSelected";
import { ColorEditor, ColorPicker } from "@react-spectrum/color";
import Add from "@spectrum-icons/workflow/Add";
import ArrowRight from "@spectrum-icons/workflow/ArrowRight";
import Delete from "@spectrum-icons/workflow/Delete";
import Rename from "@spectrum-icons/workflow/Rename";
import SortOrderDown from "@spectrum-icons/workflow/SortOrderDown";
import { useCallback, useState } from "react";
import useMetadataEdits from "../hooks/useMetadataEdits";
import useMetadataSelection from "../hooks/useMetadataSelection";
import useMetadataTable from "../hooks/useMetadataTable";
import AddColumnDialog from "./EditorMetadataAddColumnDialog";
import AddValueDialog from "./EditorMetadataAddValueDialog";
import { RenameColumnDialog } from "./EditorMetadataRenameColumnDialog";

type EditorMetadataProps = {
  projectId: number;
};

export default function EditorMetadata({ projectId }: EditorMetadataProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [isSorted, setIsSorted] = useState(false);

  const [addValueDialogOpen, setAddValueDialogOpen] = useState(false);
  const [deleteValuesDialogOpen, setDeleteValuesDialogOpen] = useState(false);

  const selected = useSelected();
  const selectedCount = useSelectedSubmodelCount();

  const { aggregatedRows, undefinedItems, columns, selectedValueKeys } =
    useMetadataTable(selectedColumn, isSorted);

  const { handleSelection, select } = useMetadataSelection(
    selectedValueKeys,
    selectedColumn,
  );
  const { assignValue, removeValue, deleteColumn, renameColumn } =
    useMetadataEdits();

  const handleCreateColumn = useCallback(
    (columnName: string, defaultValue: string | number) => {
      assignValue(defaultValue, columnName);
      setSelectedColumn(columnName);
    },
    [assignValue, setSelectedColumn],
  );

  const handleRenameColumn = useCallback(
    (newColumnName: string) => {
      console.log("renameColumn", selectedColumn, newColumnName);
      renameColumn(selectedColumn, newColumnName);
      setSelectedColumn(newColumnName);
    },
    [renameColumn, selectedColumn],
  );

  const handleDeleteColumn = useCallback(() => {
    if (!selectedColumn) return;
    deleteColumn(selectedColumn);
    setSelectedColumn("");
  }, [deleteColumn, selectedColumn]);

  const handleItemAction = useCallback(
    (key: Key, value: string | number) => {
      switch (key) {
        case "assignSingleValue":
          if (!selectedColumn) return;
          assignValue(value, selectedColumn || "");
          break;
        case "colorSingleValue":
          console.log("Setting color for", value);
          break;
      }
    },
    [assignValue, selectedColumn],
  );

  const handleGlobalAction = useCallback((key: Key) => {
    switch (key) {
      case "assignNewValue":
        setAddValueDialogOpen(true);
        break;
      case "deleteAllValues":
        setDeleteValuesDialogOpen(true);
        break;
    }
  }, []);

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View width="100%" marginTop="size-100">
          <Flex gap="size-100" direction="row" alignItems="end">
            <ComboBox
              label="Metadata column"
              items={columns}
              width="100%"
              onSelectionChange={(key) =>
                setSelectedColumn(key?.toString() || "")
              }
              selectedKey={selectedColumn}
            >
              {(item) => <Item key={item.key}>{item.key}</Item>}
            </ComboBox>
            <DialogTrigger>
              <TooltipTrigger delay={0} placement="bottom">
                <ActionButton isDisabled={selected.size === 0}>
                  <Add />
                </ActionButton>
                <Tooltip>Add Column</Tooltip>
              </TooltipTrigger>
              {(close) => (
                <AddColumnDialog close={close} onSubmit={handleCreateColumn} />
              )}
            </DialogTrigger>
          </Flex>
        </View>
        {undefinedItems && (
          <View position="relative" overflow="hidden">
            <Flex
              marginY="size-100"
              direction="row"
              width="100%"
              alignItems="center"
              gap="size-100"
            >
              <Text flex>
                {undefinedItems?.count} additional items with undefined value
              </Text>
              <DialogTrigger>
                <TooltipTrigger delay={0} placement="bottom">
                  <ActionButton isDisabled={selectedColumn === undefined}>
                    <Rename />
                  </ActionButton>
                  <Tooltip>Rename column</Tooltip>
                </TooltipTrigger>
                {(close) => (
                  <RenameColumnDialog
                    close={close}
                    existingColumns={columns}
                    onSubmit={handleRenameColumn}
                  />
                )}
              </DialogTrigger>
              <DialogTrigger>
                <TooltipTrigger delay={0} placement="bottom">
                  <ActionButton isDisabled={selectedColumn === undefined}>
                    <Delete />
                  </ActionButton>
                  <Tooltip>Delete column</Tooltip>
                </TooltipTrigger>
                {(close) => (
                  <AlertDialog
                    title={`Delete column ${selectedColumn}?`}
                    variant="destructive"
                    primaryActionLabel="Delete"
                    secondaryActionLabel="Cancel"
                    onPrimaryAction={handleDeleteColumn}
                    onCancel={close}
                  >
                    Are you sure you want to delete the column?
                  </AlertDialog>
                )}
              </DialogTrigger>
              <TooltipTrigger delay={0} placement="bottom">
                <ToggleButton
                  aria-label="Sort"
                  isSelected={isSorted}
                  onPress={() => setIsSorted(!isSorted)}
                >
                  <SortOrderDown />
                </ToggleButton>
                <Tooltip>Sort values</Tooltip>
              </TooltipTrigger>
            </Flex>
          </View>
        )}
        <View
          position="relative"
          flex
          height="100%"
          overflow="hidden"
          marginBottom="size-100"
        >
          <ActionBarContainer height="100%" width="100%">
            <ListView
              selectionMode="multiple"
              aria-label="Model list"
              width="100%"
              height="100%"
              marginBottom="size-100"
              items={aggregatedRows}
              selectedKeys={selectedValueKeys}
              renderEmptyState={() => <NoData heading="No column selected" />}
              onSelectionChange={handleSelection}
            >
              {(record) => (
                <Item
                  key={record.key}
                  textValue={record.value.toString() || "empty string"}
                >
                  <Text
                    UNSAFE_style={{
                      opacity: record.selected > 0 ? 1 : 0.6,
                    }}
                  >
                    {record.value}
                  </Text>
                  <Text
                    slot="description"
                    UNSAFE_style={{
                      opacity: record.selected > 0 ? 1 : 0.6,
                    }}
                  >
                    {record.count} items, {record.selected} selected
                  </Text>
                  <ActionGroup
                    onAction={(key) => handleItemAction(key, record.value)}
                  >
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="assignSingleValue" textValue="Assign">
                        <ArrowRight />
                      </Item>
                      <Tooltip>Assign to selected</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="colorSingleValue" textValue="Assign color">
                        <View>
                          <ColorPicker
                            aria-label="Fill color"
                            defaultValue="#184"
                          >
                            <ColorEditor />
                          </ColorPicker>
                        </View>
                      </Item>
                      <Tooltip>Assign Color</Tooltip>
                    </TooltipTrigger>
                  </ActionGroup>
                </Item>
              )}
            </ListView>

            <ActionBar
              isEmphasized
              selectedItemCount={selectedColumn ? selectedCount : 0}
              onAction={(key) => handleGlobalAction(key)}
              onClearSelection={() => select(new Map())}
            >
              <Item key="assignNewValue">
                <ArrowRight />
                <Text>Add new value</Text>
              </Item>

              <Item key="deleteAllValues">
                <Delete />
                <Text>Remove values</Text>
              </Item>
            </ActionBar>
          </ActionBarContainer>
        </View>
      </Flex>
      <DialogContainer onDismiss={() => setAddValueDialogOpen(false)}>
        {addValueDialogOpen && (
          <AddValueDialog
            close={() => setAddValueDialogOpen(false)}
            onSubmit={(value) => assignValue(value, selectedColumn)}
          />
        )}
      </DialogContainer>
      <DialogContainer onDismiss={() => setDeleteValuesDialogOpen(false)}>
        {deleteValuesDialogOpen && (
          <AlertDialog
            title={`Delete addigned values for column ${selectedColumn}?`}
            variant="destructive"
            primaryActionLabel="Delete"
            secondaryActionLabel="Cancel"
            onPrimaryAction={() => removeValue(selectedColumn)}
            onCancel={close}
          >
            Are you sure you want to delete the values?
          </AlertDialog>
        )}
      </DialogContainer>
    </PositioningContainer>
  );
}
