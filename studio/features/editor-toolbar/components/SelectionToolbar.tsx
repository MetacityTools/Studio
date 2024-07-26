import { ActionGroup, Item, View } from "@adobe/react-spectrum";
import { useModels } from "@features/editor/hooks/useModels";
import { useSelection } from "@features/editor/hooks/useSelection";
import { Key, useCallback } from "react";
import { MdDeselect, MdSelectAll } from "react-icons/md";

export default function SelectionToolbar() {
  const [models] = useModels();
  const select = useSelection();

  const selectAll = useCallback(() => {
    const selected = new Map();
    models.forEach((model) => {
      const submodels = Object.keys(model.metadata).map((key) => parseInt(key));
      selected.set(model, new Set(submodels));
    });
    select(selected);
  }, [models, select]);

  const deselect = useCallback(() => {
    select(new Map());
  }, [select]);

  const handleAction = useCallback(
    (key: Key) => {
      if (key === "all") selectAll();
      else if (key === "none") deselect();
    },

    [selectAll, deselect],
  );

  return (
    <View
      backgroundColor="gray-50"
      padding="size-50"
      borderRadius="medium"
      borderColor="gray-300"
      borderWidth="thin"
      gridArea="selection"
    >
      <ActionGroup overflowMode="collapse" onAction={handleAction} isQuiet>
        <Item key="all">
          <MdSelectAll />
        </Item>
        <Item key="none">
          <MdDeselect />
        </Item>
      </ActionGroup>
    </View>
  );
}
