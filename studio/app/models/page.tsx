"use client";

import {
  ActionButton,
  ActionMenu,
  DialogTrigger,
  Flex,
  Item,
  ListView,
  Text,
} from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContentContainer } from "@core/components/ContentContainer";
import { NoData } from "@core/components/Empty";
import { withUserEnabled } from "@core/utils/withUserEnabled";
import ModelDeleteDialog from "@features/models/components/ModelDeleteDialog";
import ModelDetailDialog from "@features/models/components/ModelDetailDialog";
import ModelUploadDialog from "@features/models/components/ModelUploadDialog";
import { useOwnModels } from "@features/models/hooks/useOwnModels";
import Header from "@features/projects/components/Header";
import { ToastContainer } from "@react-spectrum/toast";
import File from "@spectrum-icons/illustrations/File";
import { useState } from "react";

function ModelListPage() {
  const { data: models, isLoading, refetch } = useOwnModels();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelId, setModelId] = useState<number | null>(null);

  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      gap="size-10"
      justifyContent="start"
      alignItems="start"
    >
      <Header
        nav={[
          {
            key: "models",
            children: "Models",
          },
        ]}
      />
      <ContentContainer>
        <DialogTrigger>
          <ActionButton>Upload New Model</ActionButton>
          {(close) => (
            <ModelUploadDialog
              close={() => {
                close();
                refetch();
              }}
            />
          )}
        </DialogTrigger>
        <ListView
          width="size-6000"
          minHeight="size-3000"
          aria-label="ListView"
          renderEmptyState={() => <NoData />}
        >
          {models.map((model) => (
            <Item key={model.id} textValue={model.name}>
              <File />
              <Text>{model.name}</Text>
              <ActionMenu
                onAction={(key) => {
                  if (key === "delete") {
                    setDeleteDialogOpen(true);
                    setModelId(model.id);
                  } else if (key === "detail") {
                    setDetailDialogOpen(true);
                    setModelId(model.id);
                  }
                }}
              >
                <Item key="detail" textValue="View">
                  <Text>View</Text>
                </Item>
                <Item key="download" textValue="Download">
                  <Text>Download</Text>
                </Item>
                <Item key="delete" textValue="Delete">
                  <Text>Delete</Text>
                </Item>
              </ActionMenu>
            </Item>
          ))}
        </ListView>
      </ContentContainer>
      <ModelDetailDialog
        open={detailDialogOpen}
        close={() => {
          setDetailDialogOpen(false);
          setModelId(null);
        }}
        modelId={modelId}
      />
      <ModelDeleteDialog
        open={deleteDialogOpen}
        close={() => {
          setDeleteDialogOpen(false);
          setModelId(null);
          refetch();
        }}
        modelId={modelId}
      />
      <ToastContainer />
    </Flex>
  );
}

export default withPageAuthRequired(withUserEnabled(ModelListPage));
