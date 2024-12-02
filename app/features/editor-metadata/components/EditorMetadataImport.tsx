import { Button, Checkbox, ComboBox, Flex, Item, Text, View } from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { PositioningContainer } from "@core/components/PositioningContainer";
import { toasterOptions } from "@core/defaults";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback, useMemo, useState } from "react";
import useMetadataContext from "../hooks/useMetadataContext";
import useMetadataMap from "../hooks/useMetadataMap";
import useMetadataMappingStyle from "../hooks/useMetadataMappingStyle";
import EditorMetadataImportButton from "./EditorMetadataImportButton";

export default function EditorMetadataImport() {
  const [tableData, setTableData] = useState<any>(null);

  const [sourceMetadataColumn, setSourceMetadataColumn] = useState<string>("");
  const [targetMetadataColumn, setTargetMetadataColumn] = useState<string>("");
  const [removeExisting, setRemoveExisting] = useState<boolean>(false);

  const sourceColumns = useMemo(() => {
    if (!tableData) return [];
    return Object.keys(tableData[0]).map((key) => ({ key }));
  }, [tableData]);

  const { columns } = useMetadataContext();
  const handleMapping = useMetadataMap();

  useMetadataMappingStyle(sourceMetadataColumn, tableData, targetMetadataColumn);

  const onSubmit = useCallback(() => {
    if (!tableData) return;

    handleMapping(sourceMetadataColumn, tableData, targetMetadataColumn, removeExisting);
    ToastQueue.positive("Data mapped successfully", toasterOptions);
  }, [handleMapping, sourceMetadataColumn, tableData, targetMetadataColumn, removeExisting]);

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View position="relative" overflow="hidden" marginTop="size-200">
          <EditorMetadataImportButton setTableData={setTableData} />
        </View>
        <View position="relative" overflow="hidden" flex>
          {!tableData && (
            <Flex height="100%" justifyContent="center" direction="column">
              <NoData
                heading="No table selected"
                content="Plase select a .csv table you want to pair with the geometry."
              />
            </Flex>
          )}
          {tableData && (
            <Flex height="100%" direction="column" gap="size-100" marginTop="size-200">
              <Text>Map data from the table based on:</Text>
              <ComboBox
                label="Identification column"
                defaultItems={sourceColumns}
                width="100%"
                onSelectionChange={(key) => setSourceMetadataColumn(key?.toString() || "")}
                selectedKey={sourceMetadataColumn}
              >
                {(item) => <Item key={item.key}>{item.key}</Item>}
              </ComboBox>
              <Text>Map to:</Text>
              <ComboBox
                label="Existing Metadata column"
                defaultItems={columns}
                width="100%"
                onSelectionChange={(key) => setTargetMetadataColumn(key?.toString() || "")}
                selectedKey={targetMetadataColumn}
              >
                {(item) => <Item key={item.key}>{item.key}</Item>}
              </ComboBox>
              <Checkbox marginTop="size-100" isSelected={removeExisting} onChange={setRemoveExisting}>
                Remove all existing data
              </Checkbox>
              <Button
                variant="accent"
                marginTop="size-100"
                isDisabled={targetMetadataColumn === "" || sourceMetadataColumn === ""}
                onPress={onSubmit}
              >
                Map data
              </Button>
            </Flex>
          )}
        </View>
      </Flex>
    </PositioningContainer>
  );
}
