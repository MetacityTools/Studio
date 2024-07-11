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
import { Loading, NoData } from "@core/components/Empty";
import { Project } from "@features/db/entities/project";
import CreateProjectDialog from "@features/projects/components/CreateDialog";
import DeleteDialog from "@features/projects/components/DeleteDialog";
import DuplicateDialog from "@features/projects/components/DuplicateDialog";
import EditDialog from "@features/projects/components/EditDialog";
import { Key, useCallback, useState } from "react";
import { getProjects } from "../queries/getProjects";

export default function ProjectList() {
  const { items, isLoading, reload } = useAsyncList<Project>({
    load: async () => {
      return { items: await getProjects() };
    },
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const dispatchAction = useCallback((projectId: number, action: Key) => {
    setSelectedProjectId(projectId);
    if (action === "edit") {
      setEditDialogOpen(true);
    } else if (action === "delete") {
      setDeleteDialogOpen(true);
    } else if (action === "duplicate") {
      setDuplicateDialogOpen(true);
    }
  }, []);

  const closeDialog = useCallback(() => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setDuplicateDialogOpen(false);
    setSelectedProjectId(null);
  }, []);

  const handleCloseActionDialog = useCallback(() => {
    closeDialog();
    reload();
  }, [closeDialog, reload]);

  return (
    <>
      <DialogTrigger>
        <ActionButton marginBottom="size-100">Create Project</ActionButton>
        {(close) => (
          <CreateProjectDialog
            close={() => {
              close();
              reload();
            }}
          />
        )}
      </DialogTrigger>
      <ListView
        minHeight="size-3000"
        selectionMode="single"
        items={items}
        renderEmptyState={() => (isLoading ? <Loading /> : <NoData />)}
        selectionStyle="highlight"
        overflowMode="truncate"
        aria-label="Projects"
      >
        {(project) => (
          <Item
            key={project.id}
            href={`/projects/${project.id}`}
            target="_blank"
            textValue={project.name}
          >
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
        open={editDialogOpen}
        close={handleCloseActionDialog}
        projectId={selectedProjectId}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        close={handleCloseActionDialog}
        projectId={selectedProjectId}
      />
      <DuplicateDialog
        open={duplicateDialogOpen}
        close={handleCloseActionDialog}
        projectId={selectedProjectId}
      />
    </>
  );
}
