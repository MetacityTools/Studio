"use client";

import {
  ActionMenu,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Heading,
  Item,
  ListView,
  Text,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { ToastQueue } from "@react-spectrum/toast";
import File from "@spectrum-icons/illustrations/File";
import { useOwnModel } from "../hooks/useOwnModel";

type ModelDetailDialogProps = {
  open: boolean;
  close: () => void;
  modelId: number | null;
};

export default function ModelDetailDialog({
  open,
  close,
  modelId,
}: ModelDetailDialogProps) {
  const { data: model, isLoading } = useOwnModel(modelId);

  async function downloadModelFile(modelId: number, file: string) {
    const response = await fetch(`/api/models/${modelId}/data/${file}`, {
      method: "GET",
    });
    const data = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(data);
    link.download = file;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <DialogContainer onDismiss={close}>
      {open && (
        <Dialog>
          <Heading>Model detail: {model?.name}</Heading>
          <Content>
            {model && model.files.length > 0 ? (
              <ListView
                width="size-3000"
                minHeight="size-3000"
                aria-label="ListView multiple selection example"
                renderEmptyState={() => <NoData />}
              >
                {model.files.map((file) => (
                  <Item key={file} textValue={file}>
                    <File />
                    <Text>{file}</Text>
                    <ActionMenu
                      onAction={(key) => {
                        if (key === "download") {
                          downloadModelFile(model.id, file);
                          ToastQueue.info("Downloading file...");
                        }
                      }}
                    >
                      <Item key="download" textValue="Download">
                        <Text>Download</Text>
                      </Item>
                    </ActionMenu>
                  </Item>
                ))}
              </ListView>
            ) : (
              <NoData />
            )}
          </Content>
          <ButtonGroup marginTop={20}>
            <Button variant="secondary" onPress={close}>
              Close
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogContainer>
  );
}
