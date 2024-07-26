"use client";

import {
  ActionButton,
  ActionGroup,
  ActionMenu,
  DialogTrigger,
  Flex,
  Item,
  ListView,
  Text,
  View,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { PositioningContainer } from "@core/components/PositioningContainer";
import useModelSelection from "@features/editor-models/hooks/useModelSelection";
import { EditorModel } from "@features/editor/data/EditorModel";
import useModelList from "@features/editor/hooks/useModelList";
import useModelToggleVisibility from "@features/editor/hooks/useModelToggleVisibility";
import { useRemoveModels } from "@features/editor/hooks/useRemoveModels";
import { useRemoveSubmodels } from "@features/editor/hooks/useRemoveSubmodels";
import { useSelected } from "@features/editor/hooks/useSelected";
import { useSplitModel } from "@features/editor/hooks/useSplitModel";
import Delete from "@spectrum-icons/workflow/Delete";
import Rename from "@spectrum-icons/workflow/Rename";
import SplitView from "@spectrum-icons/workflow/SplitView";
import Visibility from "@spectrum-icons/workflow/Visibility";
import VisibilityOff from "@spectrum-icons/workflow/VisibilityOff";
import { Key, useCallback, useState } from "react";
import EditorAddModelDialog from "./EditorAddModelDialog";
import EditorRenameModelDialog from "./EditorRenameModelDialog";

type EditorModelsProps = {
  projectId: number;
};

export default function EditorModels({ projectId }: EditorModelsProps) {
  const removeModels = useRemoveModels();
  const setVisibility = useModelToggleVisibility();
  const removeSubmodels = useRemoveSubmodels();
  const splitModel = useSplitModel();
  const selected = useSelected();

  const [editingModel, setEditingModel] = useState<EditorModel | null>(null);

  const dispatchAction = useCallback(
    async (model: EditorModel, action: Key) => {
      switch (action) {
        case "delete":
          removeModels([model]);
          break;
        case "hide":
          setVisibility(model, false);
          break;
        case "show":
          setVisibility(model, true);
          break;
        case "deleteSubmodels":
          await removeSubmodels(model, selected.get(model) || new Set());
          break;
        case "split":
          await splitModel(model, selected.get(model) || new Set());
          break;
        case "rename":
          setEditingModel(model);
          break;
      }
    },
    [setVisibility, removeModels, removeSubmodels, splitModel, selected],
  );

  const [modelList, selectedModelKeys] = useModelList();
  const handleSelection = useModelSelection(selectedModelKeys);

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View position="relative" overflow="hidden" marginTop="size-200">
          <DialogTrigger>
            <ActionButton>Add Model</ActionButton>
            {(close) => <EditorAddModelDialog close={close} />}
          </DialogTrigger>
        </View>
        <EditorRenameModelDialog
          close={() => setEditingModel(null)}
          model={editingModel}
          open={!!editingModel}
        />
        <View
          position="relative"
          flex
          height="100%"
          overflow="hidden"
          marginBottom="size-200"
        >
          <ListView
            selectionMode="multiple"
            aria-label="Model list"
            width="100%"
            height="100%"
            onSelectionChange={handleSelection}
            items={modelList}
            selectedKeys={selectedModelKeys}
            renderEmptyState={() => (
              <NoData heading="No models in the project" />
            )}
          >
            {(model) => (
              <Item key={model.key} textValue={model.item.name}>
                <Text>{model.item.name}</Text>
                <Text slot="description">
                  {model.selectedSubmodels} of {model.totalSubmodels} submodels
                  selected
                </Text>
                <ActionGroup
                  onAction={(key) => dispatchAction(model.item, key)}
                >
                  <Item key="delete" textValue="Delete">
                    <Delete />
                  </Item>
                  {model.item.visible ? (
                    <Item key="hide" textValue="Hide">
                      <Visibility />
                    </Item>
                  ) : (
                    <Item key="show" textValue="Show">
                      <VisibilityOff />
                    </Item>
                  )}
                </ActionGroup>
                <ActionMenu onAction={(key) => dispatchAction(model.item, key)}>
                  <Item key="rename" textValue="Rename model">
                    <Rename />
                    <Text>Rename model</Text>
                  </Item>
                  <Item key="deleteSubmodels" textValue="Delete submodels">
                    <Delete />
                    <Text>Delete selected submodels</Text>
                  </Item>
                  <Item key="split" textValue="Split model">
                    <SplitView />
                    <Text>Split model</Text>
                  </Item>
                </ActionMenu>
              </Item>
            )}
          </ListView>
        </View>
      </Flex>
    </PositioningContainer>
  );
}
