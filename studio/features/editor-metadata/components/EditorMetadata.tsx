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
  TabList,
  TabPanels,
  Tabs,
  TagGroup,
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
import ArrowRight from "@spectrum-icons/workflow/ArrowRight";
import ColorPalette from "@spectrum-icons/workflow/ColorPalette";
import Delete from "@spectrum-icons/workflow/Delete";
import Rename from "@spectrum-icons/workflow/Rename";
import SortOrderDown from "@spectrum-icons/workflow/SortOrderDown";
import { useCallback, useState } from "react";
import useMetadataContext from "../hooks/useMetadataContext";
import useMetadataEdits from "../hooks/useMetadataEdits";
import useMetadataModelColors from "../hooks/useMetadataModelColors";
import useMetadataSelection from "../hooks/useMetadataSelection";
import useStyles from "../hooks/useStyles";
import { MetadataProvider } from "../providers/MetadataProvider";
import DebouncedColorPicker from "./DebouncedColorPicker";
import AddColumnDialog from "./EditorMetadataAddColumnDialog";
import AddValueDialog from "./EditorMetadataAddValueDialog";
import ColorPaletteDialog from "./EditorMetadataColorPaletteDialog";
import { RenameColumnDialog } from "./EditorMetadataRenameColumnDialog";

type EditorMetadataProps = {
  projectId: number;
};

export default function EditorMetadata({ projectId }: EditorMetadataProps) {
  return (
    <MetadataProvider>
      <PositioningContainer>
        <Tabs height="100%" aria-label="Editor tabs">
          <View
            borderBottomWidth="thin"
            borderBottomColor="light"
            paddingX="size-200"
            backgroundColor="gray-50"
          >
            <TabList>
              <Item key="columns" textValue="Columns">
                <Text>Columns</Text>
              </Item>
              <Item key="values" textValue="Values">
                <Text>Values</Text>
              </Item>
            </TabList>
          </View>
          <View
            position="relative"
            height="100%"
            overflow="auto"
            backgroundColor="gray-50"
          >
            <TabPanels height="100%" UNSAFE_className="borderless">
              <Item key="columns">
                <EditorMetadataColumns projectId={projectId} />
              </Item>
              <Item key="values">
                <EditorMetadataValues projectId={projectId} />
              </Item>
            </TabPanels>
          </View>
        </Tabs>
      </PositioningContainer>
    </MetadataProvider>
  );
}

function EditorMetadataValues({ projectId }: EditorMetadataProps) {
  const { activeMetadataColumn, setActiveMetadataColumn } = useEditorContext();
  const selectedCount = useSelectedSubmodelCount();
  const { setStyle } = useStyles();

  const [addValueDialogOpen, setAddValueDialogOpen] = useState(false);
  const [deleteValuesDialogOpen, setDeleteValuesDialogOpen] = useState(false);

  const {
    aggregatedRows,
    undefinedItems,
    columns,
    selectedValueKeys,
    sort,
    setSort,
  } = useMetadataContext();

  const { handleSelection, select } = useMetadataSelection(
    selectedValueKeys,
    activeMetadataColumn,
  );
  const { assignValue, removeValue } = useMetadataEdits();

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
              <TooltipTrigger delay={0} placement="bottom">
                <ToggleButton
                  aria-label="Sort"
                  isSelected={sort}
                  onPress={() => setSort(!sort)}
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
            onCancel={() => setDeleteValuesDialogOpen(false)}
            autoFocusButton="primary"
          >
            Are you sure you want to delete the values?
          </AlertDialog>
        )}
      </DialogContainer>
    </PositioningContainer>
  );
}

function EditorMetadataColumns({ projectId }: EditorMetadataProps) {
  const { selection } = useEditorContext();
  const { columns } = useMetadataContext();

  const [columnsToDelete, setColumnsToDelete] = useState<string[]>([]);
  const [columnToRename, setColumnToRename] = useState<string>();

  const { assignValue, deleteColumns, renameColumn } = useMetadataEdits();

  const handleCreateColumn = useCallback(
    (columnName: string, defaultValue: string | number) => {
      assignValue(defaultValue, columnName);
    },
    [assignValue],
  );

  const handleRenameColumn = useCallback(
    (newColumnName: string) => {
      if (!columnToRename) return;
      renameColumn(columnToRename, newColumnName);
    },
    [renameColumn, columnToRename],
  );

  const handleDeleteColumns = useCallback(() => {
    if (columnsToDelete.length === 0) return;
    deleteColumns(columnsToDelete);
  }, [deleteColumns, columnsToDelete]);

  const handleItemAction = useCallback((key: Key, columnKey: string) => {
    switch (key) {
      case "renameColumn":
        setColumnToRename(columnKey);
        break;
      case "deleteColumn":
        setColumnsToDelete([columnKey]);
        break;
    }
  }, []);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleGlobalAction = useCallback(
    (key: Key) => {
      switch (key) {
        case "deleteColumns":
          setColumnsToDelete(selectedKeys);
          break;
      }
    },
    [selectedKeys],
  );

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View width="100%" marginTop="size-200">
          <Flex gap="size-100" direction="row" alignItems="end">
            <DialogTrigger>
              <ActionButton isDisabled={selection.size === 0}>
                <Text>Add Column</Text>
              </ActionButton>
              {(close) => (
                <AddColumnDialog close={close} onSubmit={handleCreateColumn} />
              )}
            </DialogTrigger>
          </Flex>
        </View>
        <View
          position="relative"
          flex
          height="100%"
          overflow="hidden"
          marginBottom="size-100"
        >
          <ActionBarContainer height="100%" width="100%">
            <ListView
              aria-label="Column list"
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
              {(item) => (
                <Item key={item.key} textValue={item.key}>
                  <Text>{item.key}</Text>
                  <ActionGroup
                    isQuiet
                    onAction={(key) => handleItemAction(key, item.key)}
                  >
                    <Item key="renameColumn" textValue="Rename Column">
                      <Rename />
                    </Item>
                    <Item key="deleteColumn" textValue="Delete Column">
                      <Delete />
                    </Item>
                  </ActionGroup>
                </Item>
              )}
            </ListView>
            <ActionBar
              isEmphasized
              selectedItemCount={selectedKeys.length}
              onAction={(key) => handleGlobalAction(key)}
              onClearSelection={() => setSelectedKeys([])}
            >
              <Item key="deleteColumns">
                <Delete />
                <Text>Delete Columns</Text>
              </Item>
            </ActionBar>
          </ActionBarContainer>
        </View>
      </Flex>
      <DialogContainer onDismiss={() => setColumnToRename(undefined)}>
        {columnToRename && (
          <RenameColumnDialog
            close={() => setColumnToRename(undefined)}
            existingColumns={columns}
            onSubmit={handleRenameColumn}
          />
        )}
      </DialogContainer>
      <DialogContainer onDismiss={() => setColumnsToDelete([])}>
        {columnsToDelete.length > 0 && (
          <AlertDialog
            title="Delete columns"
            variant="destructive"
            primaryActionLabel="Delete"
            secondaryActionLabel="Cancel"
            onPrimaryAction={handleDeleteColumns}
            onCancel={() => setColumnsToDelete([])}
            autoFocusButton="primary"
          >
            <Text>Are you sure you want to delete following columns?</Text>
            <View marginY="size-200">
              <TagGroup aria-label="Static TagGroup items example">
                {columnsToDelete.map((column) => (
                  <Item key={column}>{column}</Item>
                ))}
              </TagGroup>
            </View>
            <Text
              UNSAFE_style={{
                fontSize: "0.9rem",
              }}
            >
              This action cannot be undone. All values assigned to the columns
              will be removed.
            </Text>
          </AlertDialog>
        )}
      </DialogContainer>
    </PositioningContainer>
  );
}
