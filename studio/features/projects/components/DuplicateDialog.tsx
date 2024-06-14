import { AlertDialog, DialogContainer } from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback } from "react";
import { useDuplicateProject } from "../hooks/useDuplicateProject";

type DeleteDialogProps = {
  open: boolean;
  close: () => void;
  projectId: number | null;
};

export default function DuplicateDialog({
  open,
  close,
  projectId,
}: DeleteDialogProps) {
  const { call } = useDuplicateProject();

  const handleDelete = useCallback(async () => {
    if (!projectId) {
      ToastQueue.negative("Invalid project id");
      return;
    }

    try {
      await call(projectId);
      ToastQueue.info("Project duplicated successfully");
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Failed to duplicate project");
    }
  }, [call, close, projectId]);

  return (
    <DialogContainer onDismiss={close}>
      {open && (
        <AlertDialog
          title="Duplicate"
          variant="confirmation"
          primaryActionLabel="Duplicate"
          onPrimaryAction={handleDelete}
        >
          Are you sure you want to duplicate this item?
        </AlertDialog>
      )}
    </DialogContainer>
  );
}
