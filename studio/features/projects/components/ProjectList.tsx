"use client";

import {
  ActionButton,
  ActionMenu,
  DialogTrigger,
  Flex,
  Image,
  Item,
  Text,
  View,
} from "@adobe/react-spectrum";
import { Project } from "@features/db/entities/project";
import CreateProjectDialog from "@features/projects/components/CreateDialog";
import DeleteDialog from "@features/projects/components/DeleteDialog";
import DuplicateDialog from "@features/projects/components/DuplicateDialog";
import EditDialog from "@features/projects/components/EditDialog";
import Link from "next/link";
import { Key, useCallback, useState } from "react";
import useProjects from "../hooks/useProjects";

export default function ProjectList() {
  const { projects, isLoading, refetch } = useProjects();

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
      <Flex direction="row" gap="size-100">
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            dispatchAction={dispatchAction}
          />
        ))}
      </Flex>
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

type ProjectItemProps = {
  project: Project;
  dispatchAction: (projectId: number, action: Key) => void;
};

function ProjectItem({ project, dispatchAction }: ProjectItemProps) {
  return (
    <View
      paddingTop="size-200"
      paddingX="size-200"
      paddingBottom="size-100"
      borderWidth="thin"
      borderColor="gray-500"
      borderRadius="regular"
      backgroundColor="gray-50"
    >
      <Link
        href={`/projects/${project.id}`}
        passHref
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Image
          src={project.thumbnail || "/viewer.png"}
          width="size-3000"
          height="size-3000"
          marginBottom="size-100"
          alt={`Thumbnail for ${project.name}`}
          objectFit="cover"
          UNSAFE_style={{
            borderRadius: "var(--spectrum-alias-border-radius-regular)",
          }}
        />
      </Link>
      <Flex direction="row" alignItems="center" justifyContent="space-between">
        <Link
          href={`/projects/${project.id}`}
          passHref
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Text>{project.name}</Text>
        </Link>
        <ActionMenu
          onAction={(action: Key) => dispatchAction(project.id, action)}
          isQuiet
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
      </Flex>
    </View>
  );
}
