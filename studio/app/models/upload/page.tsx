"use client";

import {
  Button,
  ButtonGroup,
  Flex,
  Form,
  TextField,
  DropZone,
  IllustratedMessage,
  Heading,
  ListView,
  Item,
  Text,
  ActionMenu,
  FileTrigger,
  Content,
  InlineAlert,
} from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContentContainer } from "@core/components/ContentContainer";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import { withUserEnabled } from "@core/utils/withUserEnabled";
import Header from "@features/projects/components/Header";
import File from "@spectrum-icons/illustrations/File";
import Upload from "@spectrum-icons/illustrations/Upload";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function ModelUploadPage() {
  const [name, setName] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const [noFiles, setNoFiles] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // check if files are empty
    if (!files.length) {
      // show alert
      setNoFiles(true);
      return;
    }
    // display loading state
    setIsUploading(true);
    const formData = new FormData(event.currentTarget);
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
    // redirect to models page if successful
    response.ok && router.push(`/models`);
  }

  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      gap="size-10"
      justifyContent="start"
      alignItems="start"
    >
      <Header
        nav={[
          {
            key: "models",
            children: "Models",
            link: "/models",
          },
          {
            key: "upload",
            children: "Upload Model",
          },
        ]}
      />
      <ContentContainer>
        <Form
          validationBehavior="native"
          maxWidth="size-6000"
          onSubmit={onSubmit}
        >
          <>
            {noFiles ? (
              <InlineAlert variant="negative" autoFocus>
                <Heading>Unable to submit</Heading>
                <Content>No files selected.</Content>
              </InlineAlert>
            ) : null}
          </>
          <TextField
            label="Model name"
            name="name"
            value={name}
            onChange={(e) => setName(e)}
            isRequired
          />
          <DropZone
            width="size-3000"
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
          <ButtonGroup>
            <Button type="submit" variant="primary" isPending={isUploading}>
              Upload
            </Button>
          </ButtonGroup>
        </Form>
      </ContentContainer>
    </Flex>
  );
}

export default withPageAuthRequired(withUserEnabled(ModelUploadPage));
