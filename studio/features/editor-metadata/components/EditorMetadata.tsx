"use client";

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
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useSelected } from "@features/editor/hooks/useSelected";
import {
  Color,
  ColorEditor,
  ColorPicker,
  parseColor,
} from "@react-spectrum/color";
import Add from "@spectrum-icons/workflow/Add";
import ArrowRight from "@spectrum-icons/workflow/ArrowRight";
import ColorPalette from "@spectrum-icons/workflow/ColorPalette";
import Delete from "@spectrum-icons/workflow/Delete";
import MultipleExclude from "@spectrum-icons/workflow/MultipleExclude";
import Rename from "@spectrum-icons/workflow/Rename";
import SortOrderDown from "@spectrum-icons/workflow/SortOrderDown";
import { useCallback, useEffect, useState } from "react";
import useMetadataEdits from "../hooks/useMetadataEdits";
import useMetadataModelColors from "../hooks/useMetadataModelColors";
import useMetadataSelection from "../hooks/useMetadataSelection";
import useMetadataTable from "../hooks/useMetadataTable";
import useStyles from "../hooks/useStyles";
import AddColumnDialog from "./EditorMetadataAddColumnDialog";
import AddValueDialog from "./EditorMetadataAddValueDialog";
import ColorPaletteDialog from "./EditorMetadataColorPaletteDialog";
import DeleteMultipleColumnsDialog from "./EditorMetadataDeleteMultipleColumnsDialog";
import { RenameColumnDialog } from "./EditorMetadataRenameColumnDialog";

type EditorMetadataProps = {
  projectId: number;
};

export default function EditorMetadata({ projectId }: EditorMetadataProps) {
  const { activeMetadataColumn, setActiveMetadataColumn } = useEditorContext();
  const [isSorted, setIsSorted] = useState(false);

  const [addValueDialogOpen, setAddValueDialogOpen] = useState(false);
  const [deleteValuesDialogOpen, setDeleteValuesDialogOpen] = useState(false);

  const selected = useSelected();
  const selectedCount = useSelectedSubmodelCount();

  const { setStyle } = useStyles();

  const { aggregatedRows, undefinedItems, columns, selectedValueKeys } =
    useMetadataTable(activeMetadataColumn, isSorted);

  const { handleSelection, select } = useMetadataSelection(
    selectedValueKeys,
    activeMetadataColumn,
  );
  const { assignValue, removeValue, deleteColumns, renameColumn } =
    useMetadataEdits();

  const handleCreateColumn = useCallback(
    (columnName: string, defaultValue: string | number) => {
      assignValue(defaultValue, columnName);
      setActiveMetadataColumn(columnName);
    },
    [assignValue, setActiveMetadataColumn],
  );

  const handleRenameColumn = useCallback(
    (newColumnName: string) => {
      renameColumn(activeMetadataColumn, newColumnName);
      setActiveMetadataColumn(newColumnName);
    },
    [renameColumn, activeMetadataColumn, setActiveMetadataColumn],
  );

  const handleDeleteColumn = useCallback(() => {
    if (!activeMetadataColumn) return;
    deleteColumns([activeMetadataColumn]);
    setActiveMetadataColumn("");
  }, [deleteColumns, activeMetadataColumn, setActiveMetadataColumn]);

  const handleDeleteColumns = useCallback(
    (columns: string[]) => {
      deleteColumns(columns);
      setActiveMetadataColumn("");
    },
    [deleteColumns, setActiveMetadataColumn],
  );

  const handleItemAction = useCallback(
    (key: Key, value: string | number) => {
      switch (key) {
        case "assignSingleValue":
          if (!activeMetadataColumn) return;
          assignValue(value, activeMetadataColumn || "");
          break;
      }
    },
    [assignValue, activeMetadataColumn],
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

  useMetadataModelColors();

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
                setActiveMetadataColumn(key?.toString() || "")
              }
              selectedKey={activeMetadataColumn}
            >
              {(item) => <Item key={item.key}>{item.key}</Item>}
            </ComboBox>
            <DialogTrigger>
              <TooltipTrigger delay={0} placement="bottom">
                <ActionButton isDisabled={columns.length === 0}>
                  <MultipleExclude />
                </ActionButton>
                <Tooltip>Remove Multiple Columns</Tooltip>
              </TooltipTrigger>
              {(close) => (
                <DeleteMultipleColumnsDialog
                  columns={columns}
                  close={close}
                  onSubmit={handleDeleteColumns}
                />
              )}
            </DialogTrigger>
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
                  <ActionButton isDisabled={activeMetadataColumn === undefined}>
                    <ColorPalette />
                  </ActionButton>
                  <Tooltip>Assign Color Pallete</Tooltip>
                </TooltipTrigger>
                {(close) => <ColorPaletteDialog close={close} />}
              </DialogTrigger>
              <DialogTrigger>
                <TooltipTrigger delay={0} placement="bottom">
                  <ActionButton isDisabled={activeMetadataColumn === undefined}>
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
                  <ActionButton isDisabled={activeMetadataColumn === undefined}>
                    <Delete />
                  </ActionButton>
                  <Tooltip>Delete column</Tooltip>
                </TooltipTrigger>
                {(close) => (
                  <AlertDialog
                    title={`Delete column ${activeMetadataColumn}?`}
                    variant="destructive"
                    primaryActionLabel="Delete"
                    secondaryActionLabel="Cancel"
                    onPrimaryAction={handleDeleteColumn}
                    onCancel={close}
                    autoFocusButton="primary"
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
                  <Text slot="image">
                    <DebouncedColorPicker
                      value={record.color}
                      onChange={(color) => {
                        setStyle(activeMetadataColumn, record.value, color);
                      }}
                    />
                  </Text>
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
                    isQuiet
                    onAction={(key) => handleItemAction(key, record.value)}
                  >
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="assignSingleValue" textValue="Assign Value">
                        <ArrowRight />
                      </Item>
                      <Tooltip>Assign to selected</Tooltip>
                    </TooltipTrigger>
                  </ActionGroup>
                </Item>
              )}
            </ListView>
            <ActionBar
              isEmphasized
              selectedItemCount={activeMetadataColumn ? selectedCount : 0}
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
            onSubmit={(value) => assignValue(value, activeMetadataColumn)}
          />
        )}
      </DialogContainer>
      <DialogContainer onDismiss={() => setDeleteValuesDialogOpen(false)}>
        {deleteValuesDialogOpen && (
          <AlertDialog
            title={`Delete addigned values for column ${activeMetadataColumn}?`}
            variant="destructive"
            primaryActionLabel="Delete"
            secondaryActionLabel="Cancel"
            onPrimaryAction={() => removeValue(activeMetadataColumn)}
            onCancel={close}
            autoFocusButton="primary"
          >
            Are you sure you want to delete the values?
          </AlertDialog>
        )}
      </DialogContainer>
    </PositioningContainer>
  );
}

type DebouncedColorPickerProps = {
  value: string;
  onChange: (color: Color) => void;
};

function DebouncedColorPicker({ value, onChange }: DebouncedColorPickerProps) {
  const [color, setColor] = useState<Color>(parseColor(value).toFormat("hsb"));

  useEffect(() => {
    const timeout = setTimeout(() => {
      color && onChange(color);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  useEffect(() => {
    if (value === color.toString("css")) return;
    setColor(parseColor(value).toFormat("hsb"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <ColorPicker value={color} onChange={setColor}>
      <ColorEditor hideAlphaChannel />
    </ColorPicker>
  );
}
