import {
  ComboBox,
  Flex,
  Item,
  ListView,
  Text,
  View,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { PositioningContainer } from "@core/components/PositioningContainer";
import { useState } from "react";
import useMetadataTable from "../hooks/useMetadataTable";

type EditorMetadataProps = {
  projectId: number;
};

export default function EditorMetadata({ projectId }: EditorMetadataProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>();

  const { aggregatedRows, undefinedItems, columns } =
    useMetadataTable(selectedColumn);
  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View marginTop="size-200" width="100%">
          <ComboBox
            label="Selected property"
            items={columns}
            width="100%"
            onSelectionChange={(key) =>
              setSelectedColumn(key?.toString() || undefined)
            }
          >
            {(item) => <Item key={item.key}>{item.key}</Item>}
          </ComboBox>
        </View>
        <View position="relative" flex height="100%" overflow="hidden">
          <ListView
            selectionMode="multiple"
            aria-label="Model list"
            width="100%"
            height="100%"
            items={aggregatedRows}
            renderEmptyState={() => <NoData heading="No column selected" />}
          >
            {(record) => (
              <Item
                key={record.value}
                textValue={record.value?.toString() || "-"}
              >
                <Text>{record.value?.toString() || "-"}</Text>
                <Text slot="description">
                  {record.count} items, {record.selected} selected
                </Text>
              </Item>
            )}
          </ListView>
        </View>
        <View position="relative" overflow="hidden">
          <View
            position="relative"
            overflow="hidden"
            marginBottom="size-200"
            padding="size-100"
            borderRadius="small"
          >
            {undefinedItems && (
              <Text>{undefinedItems?.count} items with undefined value</Text>
            )}
          </View>
        </View>
      </Flex>
    </PositioningContainer>
  );
}
