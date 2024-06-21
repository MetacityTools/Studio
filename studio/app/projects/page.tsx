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
import { Loading, NoData } from "@core/components/Empty";
import { withUserEnabled } from "@core/utils/withUserEnabled";
import CreateProjectDialog from "@features/projects/components/CreateDialog";
import DeleteDialog from "@features/projects/components/DeleteDialog";
import DuplicateDialog from "@features/projects/components/DuplicateDialog";
import EditDialog from "@features/projects/components/EditDialog";
import Header from "@features/projects/components/Header";
import { useHandleProjectAction } from "@features/projects/hooks/useHandleProjectAction";
import { useProjects } from "@features/projects/hooks/useProjects";
import { ToastContainer } from "@react-spectrum/toast";
import File from "@spectrum-icons/illustrations/File";
import { Key, useCallback } from "react";

function ProjectListPage() {
  const { data: projects, isLoading, refetch } = useProjects();
  const [dispatchAction, closeDialog, dialogState] = useHandleProjectAction();

  const handleCloseActionDialog = useCallback(() => {
    closeDialog();
    refetch();
  }, [closeDialog, refetch]);

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
            key: "projects",
            children: "Projects",
          },
        ]}
      />
      <ContentContainer>
        <DialogTrigger>
          <ActionButton>Create Project</ActionButton>
          {(close) => (
            <CreateProjectDialog
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
          selectionMode="multiple"
          aria-label="ListView multiple selection example"
          renderEmptyState={() => (isLoading ? <Loading /> : <NoData />)}
          selectionStyle="highlight"
        >
          {projects.map((project) => (
            <Item key={project.id}>
              <File />
              <Text>{project.name}</Text>
              <ActionMenu
                onAction={(action: Key) => dispatchAction(project.id, action)}
              >
                <Item key="edit" textValue="Edit">
                  <Text>Edit</Text>
                </Item>
                <Item key="duplicate" textValue="Duplicate">
                  <Text>Duplicate</Text>
                </Item>
                <Item key="delete" textValue="Delete">
                  <Text>Delete</Text>
                </Item>
              </ActionMenu>
            </Item>
          ))}
        </ListView>
      </ContentContainer>
      <EditDialog
        open={dialogState.edit}
        close={handleCloseActionDialog}
        projectId={dialogState.projectId}
      />
      <DeleteDialog
        open={dialogState.delete}
        close={handleCloseActionDialog}
        projectId={dialogState.projectId}
      />
      <DuplicateDialog
        open={dialogState.duplicate}
        close={handleCloseActionDialog}
        projectId={dialogState.projectId}
      />
      <ToastContainer />
    </Flex>
  );
}

export default withPageAuthRequired(withUserEnabled(ProjectListPage));
