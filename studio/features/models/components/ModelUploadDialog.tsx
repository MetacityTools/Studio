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
  Item,
  ListView,
  Text,
  TextField,
} from "@adobe/react-spectrum";

import { ToastQueue } from "@react-spectrum/toast";
import { DropEvent } from "@react-types/shared";
import File from "@spectrum-icons/illustrations/File";
import { Dispatch, Key, SetStateAction, useCallback, useState } from "react";

type UploadModelDialogProps = {
  close: () => void;
};

export default function ModelUploadDialog({ close }: UploadModelDialogProps) {
  const [name, setName] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    // check if files are empty
    if (!files.length) {
      ToastQueue.negative("At least one file is required");
    }
    if (!name) {
      ToastQueue.negative("Model name is required");
    }
    if (!files.length || !name) {
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
    if (response.ok) {
      close();
    } else {
      ToastQueue.negative("Failed to upload model");
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
        <Flex direction="column" gap="size-100" marginY="size-100">
          <DialogDropZone files={files} setFiles={setFiles} />
          <FileList files={files} setFiles={setFiles} />
        </Flex>
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

type DialogDropZoneProps = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
};

function DialogDropZone(props: DialogDropZoneProps) {
  const { files, setFiles } = props;

  const handleDrop = useCallback(
    async (e: DropEvent) => {
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
    },
    [files, setFiles],
  );

  const handleSelect = useCallback(
    (e: FileList | null) => {
      if (!!e) {
        const newFiles = Array.from(e).filter(
          (file) => files.findIndex((f) => f.name === file.name) === -1,
        );
        if (newFiles.length != 0) {
          // add new files to existing files
          setFiles([...files, ...newFiles]);
        }
      }
    },
    [files, setFiles],
  );

  return (
    <DropZone
      isFilled={!!files.length}
      replaceMessage="Drop file to add"
      onDrop={handleDrop}
    >
      <FileTrigger onSelect={handleSelect} allowsMultiple>
        <Content>Drop files here or</Content>
        <Button variant="primary" marginTop="size-100">
          Select Files
        </Button>
      </FileTrigger>
    </DropZone>
  );
}

function NoSelectedData() {
  return <Text marginTop="size-0">Nothing selected yet</Text>;
}

type FileListProps = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
};

function FileList(props: FileListProps) {
  const { files, setFiles } = props;

  const handleAction = useCallback(
    (key: Key, file: File) => {
      // delete file from list
      key === "delete" && setFiles(files.filter((f) => f.name !== file.name));
    },
    [files, setFiles],
  );

  return (
    <ListView
      items={files}
      width="100%"
      minHeight="size-600"
      aria-label="ListView multiple selection example"
      renderEmptyState={() => <NoSelectedData />}
    >
      {(file) => (
        <Item key={file.name} textValue={file.name}>
          <File />
          <Text>{file.name}</Text>
          <ActionMenu onAction={(key) => handleAction(key, file)}>
            <Item key="delete" textValue="Delete">
              <Text>Delete</Text>
            </Item>
          </ActionMenu>
        </Item>
      )}
    </ListView>
  );
}
