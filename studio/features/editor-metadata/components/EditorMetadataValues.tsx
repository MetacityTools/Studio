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
import { MdiArrowRightBold } from "@core/icons/MdiArrowRightBold";
import { MdiPalette } from "@core/icons/MdiPalette";
import { MdiSortAscending } from "@core/icons/MdiSortAscending";
import { MdiTrash } from "@core/icons/MdiTrash";
import useSelectedSubmodelCount from "@editor/hooks/useSelectedSubmodelCount";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useCallback, useState } from "react";
import useMetadataContext from "../hooks/useMetadataContext";
import useMetadataEdits from "../hooks/useMetadataEdits";
import useMetadataSelection from "../hooks/useMetadataSelection";
import useStyles from "../hooks/useStyles";
import DebouncedColorPicker from "./DebouncedColorPicker";
import AddValueDialog from "./EditorMetadataAddValueDialog";
import ColorPaletteDialog from "./EditorMetadataColorPaletteDialog";

export default function EditorMetadataValues() {
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
          assignValue(value, activeMetadataColumn);
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

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View width="100%" marginTop="size-100">
          <ComboBox
            label="Metadata column"
            defaultItems={columns}
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
                    <MdiPalette />
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
                  <MdiSortAscending />
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
                    {typeof record.value} - {record.count} items,{" "}
                    {record.selected} selected{" "}
                  </Text>
                  <ActionGroup
                    isQuiet
                    onAction={(key) => handleItemAction(key, record.value)}
                  >
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="assignSingleValue" textValue="Assign Value">
                        <MdiArrowRightBold />
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
                <MdiArrowRightBold />
                <Text>Add new value</Text>
              </Item>

              <Item key="deleteAllValues">
                <MdiTrash />
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
            onSubmit={(value, type) =>
              assignValue(value, activeMetadataColumn, type)
            }
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
