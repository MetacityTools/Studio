"use client";

import {
  Button,
  ButtonGroup,
  Content,
  ContextualHelp,
  Dialog,
  Flex,
  Heading,
  Item,
  ListView,
  Selection,
  Text,
  useAsyncList,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { Model } from "@features/db/entities/model";
import { getModelsNotInProject } from "@features/models/queries/getModelsNotInProject";
import { fetchModelArchive } from "@features/models/utils/downloadModel";
import { ToastQueue } from "@react-spectrum/toast";
import File from "@spectrum-icons/illustrations/File";
import { useCallback } from "react";
import { readFileZipContents } from "../utils/readZipContents";

type EditorAddModelDialogProps = {
  projectId: number;
  close: () => void;
};

export default function EditorAddModelDialog({
  projectId,
  close,
}: EditorAddModelDialogProps) {
  const sourceList = useAsyncList<Model>({
    load: async () => {
      return { items: await getModelsNotInProject({ projectId }) };
    },
  });

  const handleSubmit = useCallback(async () => {
    const modelList = Array.from(sourceList.selectedKeys);
    console.log(modelList);

    if (modelList.length === 0) {
      close();
      ToastQueue.info("No models selected");
      return;
    }

    const fileMap = new Map<string, Blob>();

    // Add models to project
    for (const modelId of modelList) {
      const id = parseInt(modelId as string);
      const blob = await fetchModelArchive(id);
      readFileZipContents(blob, fileMap);
    }

    //TODO load models from blobs here into editor context
  }, [sourceList, close]);

  return (
    <Dialog>
      <Heading>Add Models to Project</Heading>
      <Content marginY="size-100">
        <Flex gap="size-100" direction="column">
          <Flex alignItems="center" gap="size-100">
            <ContextualHelp variant="info">
              <Heading level={5}>Adding Models to Project</Heading>
              <Content>
                <Text>
                  The editor downloads the selected files and converts them to a
                  format that is compatible with the editor. This process may
                  take some time.
                </Text>
              </Content>
            </ContextualHelp>
            <Text>Select models to add to the project</Text>
          </Flex>
          <ListView
            minHeight="size-3000"
            selectionMode="multiple"
            renderEmptyState={() => (
              <NoData heading="No unused models available" />
            )}
            onSelectionChange={sourceList.setSelectedKeys}
            items={sourceList.items}
          >
            {(model) => (
              <Item key={model.id} textValue={model.name}>
                <File />
                <Text>{model.name}</Text>
              </Item>
            )}
          </ListView>
          <Text alignSelf="end">
            {formatSelectedKeys(sourceList.selectedKeys)} models selected
          </Text>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
        <Button variant="accent" onPress={handleSubmit}>
          Add
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

function formatSelectedKeys(selectedKeys: Selection) {
  if (selectedKeys === "all") return selectedKeys;
  return Array.from(selectedKeys).length;
}
