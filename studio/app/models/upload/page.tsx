"use client";

import {
  Button,
  ButtonGroup,
  Flex,
  Form,
  TextField,
  DropZone,
  FileTrigger,
  IllustratedMessage,
  Heading,
} from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContentContainer } from "@core/components/ContentContainer";
import Header from "@features/projects/components/Header";

import { FormEvent, useState } from 'react'

function ModelUploadPage() {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<string[]>([]);
  let [isFilled, setIsFilled] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const response = await fetch('/api/models', {
      method: 'POST',
      body: formData,
    })
 
    // Handle response if necessary
    const data = await response.json()
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
            onChange={(e) => setName(e)}/>
          {/* <FileTrigger
            onSelect={(e) => {
              let files = Array.from(e);
              let filenames = files.map((file) => file.name);
              setFile(filenames);
              console.log(file);
            }}>
            <Button variant="accent">Select a file</Button>
          </FileTrigger> */}
          <DropZone
            maxWidth="size-3000"
            isFilled={isFilled}
            onDrop={() => setIsFilled(true)}>
            <IllustratedMessage>
              <Heading>
                {isFilled ? 'You dropped something!' : 'Drag and drop your file'}
              </Heading>
            </IllustratedMessage>
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
