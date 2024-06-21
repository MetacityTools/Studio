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
import { Loading, NoData } from "@core/components/Empty";
import CreateProjectDialog from "@features/projects/components/CreateDialog";
import DeleteDialog from "@features/projects/components/DeleteDialog";
import DuplicateDialog from "@features/projects/components/DuplicateDialog";
import EditDialog from "@features/projects/components/EditDialog";
import { useHandleProjectAction } from "@features/projects/hooks/useHandleProjectAction";
import { useProjects } from "@features/projects/hooks/useProjects";
import File from "@spectrum-icons/illustrations/File";
import { Key, useCallback } from "react";

export default function ProjectList() {
  const { data: projects, isLoading, refetch } = useProjects();
  const [dispatchAction, closeDialog, dialogState] = useHandleProjectAction();

  const handleCloseActionDialog = useCallback(() => {
    closeDialog();
    refetch();
  }, [closeDialog, refetch]);

  return (
    <Flex direction="column" gap="size-100" alignItems="start" flex="1 0">
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
        width="100%"
        minHeight="size-3000"
        selectionMode="multiple"
        renderEmptyState={() => (isLoading ? <Loading /> : <NoData />)}
        selectionStyle="highlight"
      >
        {projects.map((project) => (
          <Item
            key={project.id}
            href={`/projects/${project.id}`}
            target="_blank"
            textValue={project.name}
          >
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
    </Flex>
  );
}
