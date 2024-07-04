"use client";

import {
  ActionButton,
  ActionMenu,
  DialogTrigger,
  Item,
  ListView,
  Text,
  useAsyncList,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { Model } from "@features/db/entities/model";
import ModelDeleteDialog from "@features/models/components/ModelDeleteDialog";
import ModelRenameDialog from "@features/models/components/ModelRenameDialog";
import ModelUploadDialog from "@features/models/components/ModelUploadDialog";
import File from "@spectrum-icons/illustrations/File";
import { Key, useCallback, useState } from "react";
import { getModelsByUser } from "../queries/getModelsByUser";
import { downloadModelArchiveFile } from "../utils/downloadModel";

export default function ModelList() {
  const { items, isLoading, reload } = useAsyncList<Model>({
    load: async () => {
      return { items: await getModelsByUser() };
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  const handleCloseActionDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setRenameDialogOpen(false);
    setSelectedModelId(null);
    reload();
  }, [reload]);

  const dispatchAction = useCallback((modelId: number, key: Key) => {
    if (key === "delete") {
      setDeleteDialogOpen(true);
      setSelectedModelId(modelId);
    } else if (key === "download") {
      downloadModelArchiveFile(modelId);
    } else if (key === "rename") {
      setRenameDialogOpen(true);
      setSelectedModelId(modelId);
    }
  }, []);

  return (
    <>
      <DialogTrigger>
        <ActionButton marginBottom="size-100">Upload New Model</ActionButton>
        {(close) => (
          <ModelUploadDialog
            close={() => {
              close();
              reload();
            }}
          />
        )}
      </DialogTrigger>
      <ListView
        minHeight="size-3000"
        aria-label="ListView"
        renderEmptyState={() => <NoData />}
        items={items}
      >
        {(model) => (
          <Item key={model.id} textValue={model.name}>
            <File />
            <Text>{model.name}</Text>
            <ActionMenu onAction={(key) => dispatchAction(model.id, key)}>
              <Item key="rename" textValue="Rename">
                <Text>Rename</Text>
              </Item>
              <Item key="download" textValue="Download">
                <Text>Download</Text>
              </Item>
              <Item key="delete" textValue="Delete">
                <Text>Delete</Text>
              </Item>
            </ActionMenu>
          </Item>
        )}
      </ListView>
      <ModelDeleteDialog
        open={deleteDialogOpen}
        close={handleCloseActionDialog}
        modelId={selectedModelId}
      />
      <ModelRenameDialog
        open={renameDialogOpen}
        close={handleCloseActionDialog}
        modelId={selectedModelId}
      />
    </>
  );
}
