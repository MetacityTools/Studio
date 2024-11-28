import {
  ActionGroup,
  ComboBox,
  Flex,
  Item,
  ListView,
  Selection,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";

import { PositioningContainer } from "@core/components/PositioningContainer";
import { TriangleEmpty } from "@core/icons/TriangleEmpty";
import { TriangleFull } from "@core/icons/TriangleFull";
import { TriangleFullFilled } from "@core/icons/TriangleFullFilled";
import useModelSelection from "@features/editor-models/hooks/useModelSelection";
import { GeometryMode } from "@features/editor/data/types";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import useModelList from "@features/editor/hooks/useModelList";
import { useCallback } from "react";
import useMetadataContext from "../hooks/useMetadataContext";
import useMetadataModels from "../hooks/useMetadataModels";

export default function EditorMetadataModels() {
  const { activeMetadataColumn, setActiveMetadataColumn, setModelStyles, setModels } = useEditorContext();
  const { columns } = useMetadataContext();

  const [modelList, selectedModelKeys] = useModelList();
  const { handleSelection } = useModelSelection(selectedModelKeys);
  const modelMetadataList = useMetadataModels(modelList);

  const handleAction = useCallback(
    (keys: Selection, modelKey: string) => {
      //ignore if all keys are selected
      if (keys === "all") return;

      //get first key
      const key = keys.values().next().value as GeometryMode;

      //set model style
      const models = modelList.filter((model) => model.key === modelKey);
      if (models.length === 0) return;
      const model = models[0];

      setModelStyles((prev) => {
        return {
          ...prev,
          [activeMetadataColumn]: {
            ...prev[activeMetadataColumn],
            [model.item.uuid]: {
              geometryMode: key,
            },
          },
        };
      });

      setModels((prev) => [...prev]);
    },
    [modelList, activeMetadataColumn, setModelStyles, setModels]
  );

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View width="100%" marginTop="size-100">
          <ComboBox
            label="Metadata column"
            defaultItems={columns}
            width="100%"
            onSelectionChange={(key) => setActiveMetadataColumn(key?.toString() || "")}
            selectedKey={activeMetadataColumn}
          >
            {(item) => <Item key={item.key}>{item.key}</Item>}
          </ComboBox>
        </View>
        <View position="relative" flex height="100%" overflow="hidden" marginBottom="size-200">
          <ListView
            selectionMode="multiple"
            aria-label="Model list"
            width="100%"
            marginBottom="size-100"
            height="100%"
            onSelectionChange={handleSelection}
            items={activeMetadataColumn ? modelMetadataList : []}
            selectedKeys={selectedModelKeys}
            renderEmptyState={() => <NoData heading="No models or no column selected" />}
          >
            {(model) => (
              <Item key={model.key} textValue={model.item.name}>
                <Text
                  UNSAFE_style={{
                    opacity: model.selectedSubmodels > 0 ? 1 : 0.6,
                  }}
                >
                  {model.item.name}
                </Text>
                <Text
                  slot="description"
                  UNSAFE_style={{
                    opacity: model.selectedSubmodels > 0 ? 1 : 0.6,
                  }}
                >
                  {model.selectedSubmodels} of {model.totalSubmodels} submodels selected
                </Text>
                <ActionGroup
                  selectionMode="single"
                  overflowMode="collapse"
                  onSelectionChange={(key) => handleAction(key, model.key)}
                  selectedKeys={[model.geometryMode]}
                  isQuiet
                >
                  <TooltipTrigger delay={0} placement="bottom">
                    <Item key={GeometryMode.NOEDGES}>
                      <TriangleFullFilled />
                    </Item>
                    <Tooltip>Solid with No Edges</Tooltip>
                  </TooltipTrigger>
                  <TooltipTrigger delay={0} placement="bottom">
                    <Item key={GeometryMode.SOLID}>
                      <TriangleFull />
                    </Item>
                    <Tooltip>Solid</Tooltip>
                  </TooltipTrigger>
                  <TooltipTrigger delay={0} placement="bottom">
                    <Item key={GeometryMode.WIREFRAME}>
                      <TriangleEmpty />
                    </Item>
                    <Tooltip>Wireframe</Tooltip>
                  </TooltipTrigger>
                </ActionGroup>
              </Item>
            )}
          </ListView>
        </View>
      </Flex>
    </PositioningContainer>
  );
}
