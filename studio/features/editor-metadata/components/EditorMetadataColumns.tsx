"use client";

import {
  ActionBar,
  ActionBarContainer,
  ActionButton,
  ActionGroup,
  AlertDialog,
  DialogContainer,
  DialogTrigger,
  Flex,
  Item,
  Key,
  ListView,
  TagGroup,
  Text,
  View,
} from "@adobe/react-spectrum";
import { PositioningContainer } from "@core/components/PositioningContainer";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import Delete from "@spectrum-icons/workflow/Delete";
import Rename from "@spectrum-icons/workflow/Rename";
import { useCallback, useState } from "react";
import useMetadataContext from "../hooks/useMetadataContext";
import useMetadataEdits from "../hooks/useMetadataEdits";
import AddColumnDialog from "./EditorMetadataAddColumnDialog";
import { RenameColumnDialog } from "./EditorMetadataRenameColumnDialog";

export default function EditorMetadataColumns() {
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
