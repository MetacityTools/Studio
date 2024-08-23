"use client";

import {
  ActionGroup,
  ComboBox,
  Flex,
  Item,
  ListView,
  Selection,
  Text,
  View,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import {
  TriangleEmpty,
  TriangleFull,
  TriangleFullFilled,
} from "@core/components/Icons";
import { PositioningContainer } from "@core/components/PositioningContainer";
import useModelSelection from "@features/editor-models/hooks/useModelSelection";
import { GeometryMode } from "@features/editor/data/types";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import useModelList from "@features/editor/hooks/useModelList";
import { useCallback, useEffect } from "react";
import useMetadataContext from "../hooks/useMetadataContext";
import useMetadataModelColors from "../hooks/useMetadataModelColors";

export default function EditorMetadataModels() {
  const {
    activeMetadataColumn,
    setActiveMetadataColumn,
    modelStyles,
    setModelStyles,
    scene,
    setModels,
  } = useEditorContext();
  const { columns } = useMetadataContext();

  useMetadataModelColors();

  const [modelList, selectedModelKeys] = useModelList();
  const { handleSelection, select } = useModelSelection(selectedModelKeys);

  useEffect(() => {
    if (activeMetadataColumn) {
      const modelStyleColumn = modelStyles[activeMetadataColumn];
      if (!modelStyleColumn) return;

      setModels((prev) => {
        prev.forEach((model) => {
          const modelStyle = modelStyleColumn[model.uuid];
          if (!modelStyle) return;
          model.geometryMode = modelStyle.geometryMode;
          model.attributes.needsRebind = true;
        });

        return prev.slice();
      });

      scene.shadersChanged = true;
    }
  }, [activeMetadataColumn, modelStyles, scene, setModels]);

  const handleAction = useCallback(
    (keys: Selection, modelKey: string) => {
      console.log(keys, modelKey);
      //ignore if all keys are selected
      if (keys === "all") return;

      //get first key
      const key = keys.values().next().value as GeometryMode;

      //set model style
      const models = modelList.filter((model) => model.key === modelKey);
      if (models.length === 0) return;
      const model = models[0];

      console.log(model.item, key);
      model.item.geometryMode = key;
      model.item.attributes.needsRebind = true;
      scene.shadersChanged = true;

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
    [modelList, scene, activeMetadataColumn, setModelStyles, setModels],
  );

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
            marginBottom="size-100"
            height="100%"
            onSelectionChange={handleSelection}
            items={activeMetadataColumn ? modelList : []}
            selectedKeys={selectedModelKeys}
            renderEmptyState={() => (
              <NoData heading="No models or no column selected" />
            )}
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
                  {model.selectedSubmodels} of {model.totalSubmodels} submodels
                  selected
                </Text>
                <ActionGroup
                  selectionMode="single"
                  overflowMode="collapse"
                  onSelectionChange={(key) => handleAction(key, model.key)}
                  selectedKeys={[model.geometryMode]}
                  isQuiet
                >
                  <Item key={GeometryMode.NOEDGES}>
                    <TriangleFullFilled />
                  </Item>
                  <Item key={GeometryMode.SOLID}>
                    <TriangleFull />
                  </Item>
                  <Item key={GeometryMode.WIREFRAME}>
                    <TriangleEmpty />
                  </Item>
                </ActionGroup>
              </Item>
            )}
          </ListView>
        </View>
      </Flex>
    </PositioningContainer>
  );
}
