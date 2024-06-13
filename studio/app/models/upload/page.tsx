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
} from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContentContainer } from "@core/components/ContentContainer";
import { NoData } from "@core/components/Empty";
import Header from "@features/projects/components/Header";
import File from "@spectrum-icons/illustrations/File";
import Upload from "@spectrum-icons/illustrations/Upload";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function ModelUploadPage() {
  const [name, setName] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    for (const file of files) {
      formData.append("files", file);
    }
    const response = await fetch("/api/models", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    router.push("/models");
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
        <Form maxWidth="size-6000" onSubmit={onSubmit}>
          <TextField
            label="Model name"
            name="name"
            value={name}
            onChange={(e) => setName(e)}
          />
          <DropZone
            maxWidth="size-3000"
            isFilled={!!files.length}
            replaceMessage="Drop file to add"
            onDrop={async (e) => {
              const newFiles = [];
              for (const item of e.items) {
                if (
                  item.kind === "file" &&
                  files.findIndex((file) => file.name === item.name) === -1
                ) {
                  newFiles.push(await item.getFile());
                }
              }
              if (newFiles.length != 0) {
                setFiles([...files, ...newFiles]);
              }
            }}
          >
            {files.length ? (
              <ListView
                width="size-3000"
                minHeight="size-3000"
                aria-label="ListView multiple selection example"
                renderEmptyState={() => <NoData />}
              >
                {files.map((file) => (
                  <Item key={file.name} textValue={file.name}>
                    <File />
                    <Text>{file.name}</Text>
                    <ActionMenu
                      onAction={(key) => {
                        const splitKey = key.toString().split("/");
                        splitKey[0] === "delete" &&
                          setFiles(files.filter((f) => f.name !== splitKey[1]));
                      }}
                    >
                      <Item key={`delete/${file.name}`} textValue="Delete">
                        <Text>Delete</Text>
                      </Item>
                    </ActionMenu>
                  </Item>
                ))}
              </ListView>
            ) : (
              <IllustratedMessage>
                <Upload />
                <Heading>Drag and drop here</Heading>
              </IllustratedMessage>
            )}
          </DropZone>
          <ButtonGroup>
            <Button type="submit" variant="primary">
              Upload
            </Button>
          </ButtonGroup>
        </Form>
      </ContentContainer>
    </Flex>
  );
}

export default withPageAuthRequired(ModelUploadPage);
