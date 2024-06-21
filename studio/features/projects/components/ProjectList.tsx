"use client";

import {
  ActionButton,
  ActionMenu,
  DialogTrigger,
  Item,
  ListView,
  Text,
} from "@adobe/react-spectrum";
import { Loading, NoData } from "@core/components/Empty";
import CreateProjectDialog from "@features/projects/components/CreateDialog";
import DeleteDialog from "@features/projects/components/DeleteDialog";
import DuplicateDialog from "@features/projects/components/DuplicateDialog";
import EditDialog from "@features/projects/components/EditDialog";
import { useHandleProjectAction } from "@features/projects/hooks/useHandleProjectAction";
import { useProjects } from "@features/projects/hooks/useProjects";
import { Key, useCallback } from "react";

export default function ProjectList() {
  const { data: projects, isLoading, refetch } = useProjects();
  const [dispatchAction, closeDialog, dialogState] = useHandleProjectAction();

  const handleCloseActionDialog = useCallback(() => {
    closeDialog();
    refetch();
  }, [closeDialog, refetch]);

  return (
    <>
      <DialogTrigger>
        <ActionButton marginBottom="size-100">Create Project</ActionButton>
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
        minHeight="size-3000"
        selectionMode="single"
        items={projects}
        renderEmptyState={() => (isLoading ? <Loading /> : <NoData />)}
        selectionStyle="highlight"
        overflowMode="truncate"
      >
        {(project) => (
          <Item key={project.id} textValue={project.name}>
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
        )}
      </ListView>
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
    </>
  );
}
