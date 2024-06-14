import { Key, useCallback, useState } from "react";

//TODO refactor this mess
export const useHandleProjectAction = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);

  const dispatchAction = useCallback((projectId: number, action: Key) => {
    if (action === "edit") {
      setEditDialogOpen(true);
      setProjectId(projectId);
    } else if (action === "delete") {
      setDeleteDialogOpen(true);
      setProjectId(projectId);
    } else if (action === "duplicate") {
      setDuplicateDialogOpen(true);
      setProjectId(projectId);
    }
  }, []);

  const closeDialog = useCallback(() => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setDuplicateDialogOpen(false);
    setProjectId(null);
  }, []);

  return [
    dispatchAction,
    closeDialog,
    {
      edit: editDialogOpen,
      delete: deleteDialogOpen,
      duplicate: duplicateDialogOpen,
      projectId,
    },
  ] as const;
};
