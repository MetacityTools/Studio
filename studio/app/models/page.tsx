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
// import ModelDetailDialog from "@features/models/components/ModelDetailDialog";
import ModelUploadDialog from "@features/models/components/ModelUploadDialog";
import { useOwnModels } from "@features/models/hooks/useOwnModels";
import Header from "@features/projects/components/Header";
import { ToastContainer } from "@react-spectrum/toast";
import File from "@spectrum-icons/illustrations/File";

function ModelListPage() {
  const { data: models, isLoading, refetch } = useOwnModels();

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
            <Item key={model.id}>
              <File />
              <Text>{model.name}</Text>
              <ActionMenu
                onAction={(key) => {
                  if (key === "delete") {
                    fetch(`/api/models/${model.id}`, {
                      method: "DELETE",
                    }).then(() => refetch());
                  } else if (key === "detail") {
                    console.log("Detail");
                  }
                }}
              >
                <Item key="detail" textValue="View">
                  <Text>Detail</Text>
                </Item>
                <Item key="delete" textValue="Delete">
                  <Text>Delete</Text>
                </Item>
              </ActionMenu>
            </Item>
          ))}
        </ListView>
      </ContentContainer>
      {/* <ModelDetailDialog
        open={dialogState.edit}
        close={handleCloseActionDialog}
        modelId={dialogState.projectId}
      /> */}
      <ToastContainer />
    </Flex>
  );
}

export default withPageAuthRequired(withUserEnabled(ModelListPage));
