"use client";

import {
  ActionButton,
  ActionMenu,
  Button,
  Flex,
  Item,
  ListView,
  Text,
} from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContentContainer } from "@core/components/ContentContainer";
import { NoData } from "@core/components/Empty";
import Header from "@features/projects/components/Header";
import File from "@spectrum-icons/illustrations/File";
import { useOwnModel } from "@features/models/hooks/useOwnModel";

function ModelDetailPage({ params }: { params: { id: string } }) {
  const { data: model, isLoading } = useOwnModel(Number(params.id));

  async function downloadModelFile(model: number, file: string) {
    const response = await fetch(`/api/models/${model}/data/${file}`, {
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
            key: "detail",
            children: "Model Detail",
          },
        ]}
      />
      <ContentContainer>
        <Text>{model?.name}</Text>
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
      </ContentContainer>
    </Flex>
  );
}

export default withPageAuthRequired(ModelDetailPage);
