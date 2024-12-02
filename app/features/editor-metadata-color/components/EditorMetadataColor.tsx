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
  Text,
  Tooltip,
  TooltipTrigger,
  View,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";

import { PositioningContainer } from "@core/components/PositioningContainer";
import SidebarHeader from "@core/components/SidebarHeader";
import { MdiArrowRightBold } from "@core/icons/MdiArrowRightBold";
import { MdiPalette } from "@core/icons/MdiPalette";
import { MdiTrash } from "@core/icons/MdiTrash";
import useSelectedSubmodelCount from "@editor/hooks/useSelectedSubmodelCount";
import ColorPaletteDialog from "@features/editor-metadata-color/components/EditorMetadataColorPaletteDialog";
import useMetadataAssignValue from "@features/editor-metadata/hooks/useMetadataAssignValue";
import useMetadataContext from "@features/editor-metadata/hooks/useMetadataContext";
import useMetadataEdits from "@features/editor-metadata/hooks/useMetadataEdits";
import useMetadataSelection from "@features/editor-metadata/hooks/useMetadataSelection";
import useStyles from "@features/editor-metadata/hooks/useStyles";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useCallback, useMemo, useState } from "react";
import DebouncedColorPicker from "./DebouncedColorPicker";
import AddValueDialog from "./EditorMetadataAddValueDialog";

export default function EditorMetadataColor() {
  return (
    <PositioningContainer>
      <View position="relative" height="100%" overflow="auto" backgroundColor="gray-50">
        <EditorMetadataColorList />
      </View>
    </PositioningContainer>
  );
}

function EditorMetadataColorList() {
  const { activeMetadataColumn } = useEditorContext();
  const selectedCount = useSelectedSubmodelCount();
  const { setStyle } = useStyles();

  const [addValueDialogOpen, setAddValueDialogOpen] = useState(false);
  const [deleteValuesDialogOpen, setDeleteValuesDialogOpen] = useState(false);

  const { aggregatedRows, selectedValueKeys } = useMetadataContext();

  const { handleSelection, select } = useMetadataSelection(selectedValueKeys, activeMetadataColumn);
  const assignValue = useMetadataAssignValue();
  const { removeValue } = useMetadataEdits();

  const handleItemAction = useCallback(
    (key: Key, value: string | number) => {
      switch (key) {
        case "assignSingleValue":
          if (!activeMetadataColumn) return;
          assignValue(value, activeMetadataColumn);
          break;
      }
    },
    [assignValue, activeMetadataColumn]
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

  const disabledKeysOnNoSelection = useMemo(
    () => (selectedCount === 0 ? ["assignSingleValue"] : undefined),
    [selectedCount]
  );

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100">
        {/* <View position="relative" overflow="hidden" marginTop="size-100">
          <Flex marginY="size-100" direction="row" width="100%" alignItems="center" gap="size-100">
            <Text flex>{undefinedItems?.count} additional items with undefined value</Text>
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
              <ToggleButton aria-label="Sort" isSelected={sort} onPress={() => setSort(!sort)}>
                <MdiSortAscending />
              </ToggleButton>
              <Tooltip>Sort values</Tooltip>
            </TooltipTrigger>
          </Flex>
        </View> */}

        <SidebarHeader title="Metadata Values in Active Column">
          <DialogTrigger>
            <TooltipTrigger delay={0} placement="bottom">
              <ActionButton isDisabled={activeMetadataColumn === undefined} isQuiet>
                <MdiPalette />
              </ActionButton>
              <Tooltip>Assign Color Pallete</Tooltip>
            </TooltipTrigger>
            {(close) => <ColorPaletteDialog close={close} />}
          </DialogTrigger>
        </SidebarHeader>

        <View position="relative" overflow="hidden" height="100%">
          <ActionBarContainer height="100%">
            <ListView
              isQuiet
              density="spacious"
              selectionMode="multiple"
              aria-label="Model list"
              items={aggregatedRows}
              selectedKeys={selectedValueKeys}
              renderEmptyState={() => <NoData heading="No column selected" />}
              onSelectionChange={handleSelection}
            >
              {(record) => (
                <Item key={record.key} textValue={record.value.toString() || "empty string"}>
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
                      fontFamily: "monospace",
                      opacity: record.selected > 0 ? 1 : 0.6,
                    }}
                  >
                    [{String(record.selected).padStart(4, "0")} of {String(record.count).padStart(4, "0")}]{" "}
                    {record.value}
                  </Text>
                  <ActionGroup
                    isQuiet
                    onAction={(key) => handleItemAction(key, record.value)}
                    disabledKeys={disabledKeysOnNoSelection}
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
            onSubmit={(value, type) => assignValue(value, activeMetadataColumn, type)}
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
