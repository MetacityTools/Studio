import { ActionGroup, Item, Tooltip, TooltipTrigger, View } from "@adobe/react-spectrum";
import { MdiSelectAll } from "@core/icons/MdiSelectAll";
import { MdiSelectRemove } from "@core/icons/MdiSelectRemove";
import { useModels } from "@features/editor/hooks/useModels";
import { useSelection } from "@features/editor/hooks/useSelection";
import { Key, useCallback } from "react";

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

    [selectAll, deselect]
  );

  return (
    <View padding="size-50" borderRadius="medium" gridArea="selection">
      <ActionGroup overflowMode="collapse" onAction={handleAction} isQuiet>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key="all">
            <MdiSelectAll />
          </Item>
          <Tooltip>Select all</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key="none">
            <MdiSelectRemove />
          </Item>
          <Tooltip>Deselect all</Tooltip>
        </TooltipTrigger>
      </ActionGroup>
    </View>
  );
}
