"use client";

import {
  ActionMenu,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DropZone,
  FileTrigger,
  Form,
  Heading,
  IllustratedMessage,
  Item,
  ListView,
  Text,
  TextField,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import File from "@spectrum-icons/illustrations/File";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import Upload from "@spectrum-icons/illustrations/Upload";
import { useCallback, useState } from "react";

type UploadModelDialogProps = {
  close: () => void;
};

export default function ModelUploadDialog({ close }: UploadModelDialogProps) {
  const [name, setName] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    // check if files are empty
    let errorText = "";
    if (!files.length) {
      errorText = "At least one file is required.";
    }
    if (!name) {
      if (errorText) {
        errorText += " ";
      }
      errorText += "Name is required.";
    }
    if (!files.length || !name) {
      ToastQueue.negative(errorText);
      return;
    }
    // display loading state
    setIsPending(true);
    const formData = new FormData();
    // append name to form data
    formData.append("name", name);
    // append files to form data
    for (const file of files) {
      formData.append("files", file);
    }
    // send form data to server
    const response = await fetch("/api/models", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      close();
    } else {
    }
  }, [name, files, close]);

  return (
    <Dialog>
      <Heading>Create Project</Heading>
      <Content>
        <Form validationBehavior="native" width="size-4000">
          <TextField
            label="Model name"
            name="name"
            value={name}
            onChange={(e) => setName(e)}
            isRequired
            validate={(value) => (value ? "" : "Name is required")}
          />
        </Form>
        <DropZone
          width="size-4000"
          isFilled={!!files.length}
          replaceMessage="Drop file to add"
          onDrop={async (e) => {
            const newFiles = [];
            for (const item of e.items) {
              if (
                item.kind === "file" &&
                files.findIndex((file) => file.name === item.name) === -1 // check if file already exists
              ) {
                newFiles.push(await item.getFile());
              }
            }

            if (newFiles.length != 0) {
              // add new files to existing files
              setFiles([...files, ...newFiles]);
            }
          }}
        >
          <IllustratedMessage>
            <Upload />
            <Heading>Drag and drop here</Heading>
            <Content>
              <FileTrigger
                allowsMultiple
                onSelect={(e) => {
                  if (!!e) {
                    const newFiles = Array.from(e).filter(
                      (file) =>
                        files.findIndex((f) => f.name === file.name) === -1,
                    );
                    if (newFiles.length != 0) {
                      // add new files to existing files
                      setFiles([...files, ...newFiles]);
                    }
                  }
                }}
              >
                <Button variant="primary">Browse</Button>
              </FileTrigger>
            </Content>
          </IllustratedMessage>
        </DropZone>
        <ListView
          minHeight="size-3000"
          aria-label="ListView multiple selection example"
          renderEmptyState={() => (
            <IllustratedMessage>
              <NotFound />
              <Heading>No Data</Heading>
              <Content>No files have been selected yet</Content>
            </IllustratedMessage>
          )}
        >
          {files.map((file) => (
            <Item key={file.name} textValue={file.name}>
              <File />
              <Text>{file.name}</Text>
              <ActionMenu
                onAction={(key) => {
                  // delete file from list
                  key === "delete" &&
                    setFiles(files.filter((f) => f.name !== file.name));
                }}
              >
                <Item key="delete" textValue="Delete">
                  <Text>Delete</Text>
                </Item>
              </ActionMenu>
            </Item>
          ))}
        </ListView>
      </Content>
      <ButtonGroup marginTop={20}>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
        <Button
          variant="accent"
          type="submit"
          isPending={isPending}
          onPress={handleSubmit}
        >
          Upload
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
