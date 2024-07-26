import {
  Cell,
  Column,
  ComboBox,
  Flex,
  Item,
  Row,
  TableBody,
  TableHeader,
  TableView,
  View,
} from "@adobe/react-spectrum";
import { PositioningContainer } from "@core/components/PositioningContainer";
import { useMemo, useState } from "react";
import useMetadataTable from "../hooks/useMetadataTable";

type EditorMetadataProps = {
  projectId: number;
};

type ColumnType = {
  cid: string;
  name: string;
};

const emptyColumns = { cid: "nothing", name: "Nothing selected" };

export default function EditorMetadata({ projectId }: EditorMetadataProps) {
  const { rows, columns } = useMetadataTable();

  const [selectedColumn, setSelectedColumn] =
    useState<ColumnType>(emptyColumns);

  const activeColumns = useMemo(() => [selectedColumn], [selectedColumn]);

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View
          //   position="relative"
          //   overflow="hidden"
          marginTop="size-200"
          width="100%"
        >
          <ComboBox
            label="Selected column"
            defaultItems={columns}
            width="100%"
            onSelectionChange={(item) =>
              setSelectedColumn(() => {
                const newColumn = columns.find((column) => column.cid === item);
                if (newColumn) return newColumn;
                else return emptyColumns;
              })
            }
          >
            {(item) => <Item key={item.cid}>{item.name}</Item>}
          </ComboBox>
        </View>
        <View
          position="relative"
          flex
          height="100%"
          overflow="hidden"
          marginTop="size-200"
          marginBottom="size-200"
        >
          <TableView width="100%" height="100%" aria-label="Metadata Table">
            <TableHeader columns={activeColumns}>
              {(column) => (
                <Column minWidth={200} key={column.cid}>
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <Row key={item.mid}>
                  {(columnKey) => (
                    <Cell>{item.values[columnKey as keyof typeof item]}</Cell>
                  )}
                </Row>
              )}
            </TableBody>
          </TableView>
        </View>
      </Flex>
    </PositioningContainer>
  );
}
