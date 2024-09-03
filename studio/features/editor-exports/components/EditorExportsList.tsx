"use client";

import {
  ActionBarContainer,
  ActionButton,
  Flex,
  Image,
  Item,
  ListView,
  Text,
  View,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";

import { PositioningContainer } from "@core/components/PositioningContainer";
import useEmbeds from "@features/embeds/hooks/useEmbeds";

type EditorExportListProps = {
  projectId: number;
};

export default function EditorExportList({ projectId }: EditorExportListProps) {
  const { embeds } = useEmbeds(projectId);

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View
          position="relative"
          flex
          height="100%"
          overflow="hidden"
          marginTop="size-200"
          marginBottom="size-100"
        >
          <ActionBarContainer height="100%" width="100%">
            <ListView
              aria-label="Embed list"
              width="100%"
              marginBottom="size-100"
              height="100%"
              items={embeds}
              renderEmptyState={() => (
                <NoData heading="No embeds in the project" />
              )}
            >
              {(embed) => (
                <Item key={embed.id} textValue={embed.name}>
                  <Image
                    src={embed.thumbnailContents}
                    alt={embed.name}
                    objectFit="cover"
                  />
                  <Text>{embed.name}</Text>
                  <ActionButton
                    onPress={() => {
                      window.open(`/embeds/${embed.id}`, "_blank");
                    }}
                  >
                    View
                  </ActionButton>
                </Item>
              )}
            </ListView>
          </ActionBarContainer>
        </View>
      </Flex>
    </PositioningContainer>
  );
}
