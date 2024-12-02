import {
  ActionGroup,
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
import SidebarHeader from "@core/components/SidebarHeader";
import { TriangleEmpty } from "@core/icons/TriangleEmpty";
import { TriangleFull } from "@core/icons/TriangleFull";
import { TriangleFullFilled } from "@core/icons/TriangleFullFilled";
import { GeometryMode } from "@features/editor/data/types";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import useModelList from "@features/editor/hooks/useModelList";
import useMetadataContext from "@features/metadata/hooks/useMetadataContext";
import useModelSelection from "@features/model/hooks/useModelSelection";
import { useCallback } from "react";
import useMetadataModels from "../hooks/useMetadataModels";

export default function EditorMetadataModels() {
  return (
    <PositioningContainer>
      <View position="relative" height="100%" overflow="auto" backgroundColor="gray-50">
        <EditorMetadataModelList />
      </View>
    </PositioningContainer>
  );
}

function EditorMetadataModelList() {
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
      <Flex direction="column" height="100%">
        <SidebarHeader title="Model Shaders" />
        <View position="relative" flex height="100%" overflow="hidden" marginBottom="size-200">
          <ListView
            isQuiet
            density="spacious"
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
                {/* <Text
                  slot="description"
                  UNSAFE_style={{
                    opacity: model.selectedSubmodels > 0 ? 1 : 0.6,
                  }}
                >
                  {model.selectedSubmodels} of {model.totalSubmodels} submodels selected
                </Text> */}
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
