import { AlertDialog, DialogContainer } from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback } from "react";
import { useDeleteModel } from "../hooks/useDeleteModel";

type ModelDeleteDialogProps = {
  open: boolean;
  close: () => void;
  modelId: number | null;
};

export default function ModelDeleteDialog({
  open,
  close,
  modelId,
}: ModelDeleteDialogProps) {
  const { call } = useDeleteModel();

  const handleDelete = useCallback(async () => {
    if (!modelId) {
      ToastQueue.negative("Invalid model id");
      return;
    }

    try {
      await call(modelId);
      ToastQueue.info("Model deleted successfully");
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Failed to delete model");
    }
  }, [call, close, modelId]);

  return (
    <DialogContainer onDismiss={close}>
      {open && (
        <AlertDialog
          title="Delete"
          variant="destructive"
          primaryActionLabel="Delete"
          onPrimaryAction={handleDelete}
          cancelLabel="Cancel"
        >
          Are you sure you want to delete this item?
        </AlertDialog>
      )}
    </DialogContainer>
  );
}
