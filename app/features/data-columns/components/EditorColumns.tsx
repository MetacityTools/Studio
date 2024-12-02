import {
  ActionBar,
  ActionBarContainer,
  ActionGroup,
  AlertDialog,
  DialogContainer,
  Flex,
  Item,
  Key,
  ListView,
  TagGroup,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { PositioningContainer } from "@core/components/PositioningContainer";
import SidebarHeader from "@core/components/SidebarHeader";
import { MdiRename } from "@core/icons/MdiRename";
import { MdiTrash } from "@core/icons/MdiTrash";
import useMetadataContext from "@features/metadata/hooks/useMetadataContext";
import useMetadataEdits from "@features/metadata/hooks/useMetadataEdits";
import { useCallback, useState } from "react";
import { RenameColumnDialog } from "./EditorRenameColumnDialog";

export default function EditorColumns() {
  return (
    <PositioningContainer>
      <View position="relative" height="100%" overflow="auto" backgroundColor="gray-50">
        <EditorColumnsList />
      </View>
    </PositioningContainer>
  );
}

function EditorColumnsList() {
  const { columns } = useMetadataContext();

  const [columnsToDelete, setColumnsToDelete] = useState<string[]>([]);
  const [columnToRename, setColumnToRename] = useState<string>();

  const { deleteColumns, renameColumn } = useMetadataEdits();

  const handleRenameColumn = useCallback(
    (newColumnName: string) => {
      if (!columnToRename) return;
      renameColumn(columnToRename, newColumnName);
    },
    [renameColumn, columnToRename]
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
    [selectedKeys]
  );

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%">
        <SidebarHeader title="Data Columns" />
        <View position="relative" height="100%" overflow="hidden">
          <ActionBarContainer height="100%" width="100%">
            <ListView
              isQuiet
              density="spacious"
              aria-label="Column list"
              width="100%"
              height="100%"
              items={columns}
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              renderEmptyState={() => <NoData heading="No metadata columns available" />}
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
                  <Text
                    UNSAFE_style={{
                      fontFamily: "monospace",
                    }}
                  >
                    {item.key}
                  </Text>
                  <ActionGroup isQuiet onAction={(key) => handleItemAction(key, item.key)}>
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="renameColumn" textValue="Rename Column">
                        <MdiRename />
                      </Item>
                      <Tooltip>Rename Column</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="deleteColumn" textValue="Delete Column">
                        <MdiTrash />
                      </Item>
                      <Tooltip>Delete Column</Tooltip>
                    </TooltipTrigger>
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
                <MdiTrash />
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
            initialColumnName={columnToRename}
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
              This action cannot be undone. All values assigned to the columns will be removed.
            </Text>
          </AlertDialog>
        )}
      </DialogContainer>
    </PositioningContainer>
  );
}
