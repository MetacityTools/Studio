import { AlertDialog, DialogContainer } from "@adobe/react-spectrum";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback } from "react";

type DeleteDialogProps = {
  open: boolean;
  close: () => void;
  projectId: number | null;
};

export default function DeleteDialog({
  open,
  close,
  projectId,
}: DeleteDialogProps) {
  const { call } = useDeleteProject();

  const handleDelete = useCallback(async () => {
    if (!projectId) {
      ToastQueue.negative("Invalid project id");
      return;
    }

    try {
      await call(projectId);
      ToastQueue.info("Project deleted successfully");
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Failed to delete project");
    }
  }, [call, close, projectId]);

  return (
    <DialogContainer onDismiss={close}>
      {open && (
        <AlertDialog
          title="Delete"
          variant="destructive"
          primaryActionLabel="Delete"
          onPrimaryAction={handleDelete}
        >
          Are you sure you want to delete this item?
        </AlertDialog>
      )}
    </DialogContainer>
  );
}
