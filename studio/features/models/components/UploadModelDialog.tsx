"use client";

import {
  ActionMenu,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DropZone,
  FileTrigger,
  Flex,
  Form,
  Heading,
  IllustratedMessage,
  InlineAlert,
  Item,
  ListView,
  Text,
  TextField,
} from "@adobe/react-spectrum";
// import { ToastQueue } from "@react-spectrum/toast";
import { FormEvent, useCallback, useState } from "react";
import Upload from "@spectrum-icons/illustrations/Upload";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import File from "@spectrum-icons/illustrations/File";

type UploadModelDialogProps = {
  close: () => void;
  refetch: () => void;
};

export default function UploadModelDialog({
  close,
  refetch,
}: UploadModelDialogProps) {
  //   const { call, inProgress } = useCreateProjects();

  const [name, setName] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [noFiles, setNoFiles] = useState<boolean>(false);
  const [emptyName, setEmptyName] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    // check if files are empty
    if (!files.length) {
      // show alert
      setNoFiles(true);
    }
    if (!name) {
      // show alert
      setEmptyName(true);
    }
    if (!files.length || !name) {
      return;
    }
    console.log("submitting");
    // display loading state
    setIsUploading(true);
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
      refetch();
    } else {
    }
  }, [name, files, close, refetch]);

  return (
    <Dialog>
      <Heading>Create Project</Heading>
      <Content>
        <Form
          validationBehavior="native"
          width="size-4000"
          //   onSubmit={handleSubmit}
        >
          <>
            {noFiles || emptyName ? (
              <InlineAlert variant="negative" autoFocus>
                <Heading>Unable to submit</Heading>
                <Content>
                  <Flex direction="column" gap="size-125">
                    {noFiles && <Text>No files selected.</Text>}
                    {emptyName && <Text>Name cannot be empty.</Text>}
                  </Flex>
                </Content>
              </InlineAlert>
            ) : null}
          </>
          <TextField
            label="Model name"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e);
              !!e && setEmptyName(false);
            }}
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
              // hide alert if displayed
              setNoFiles(false);
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
                onSelect={(e) => {
                  if (!!e) {
                    const newFiles = Array.from(e).filter(
                      (file) =>
                        files.findIndex((f) => f.name === file.name) === -1
                    );
                    if (newFiles.length != 0) {
                      // hide alert if displayed
                      setNoFiles(false);
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
          isPending={isUploading}
          onPress={handleSubmit}
        >
          Create
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
