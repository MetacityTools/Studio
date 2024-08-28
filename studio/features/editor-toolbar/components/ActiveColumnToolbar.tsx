import { ComboBox, Item, View } from "@adobe/react-spectrum";
import useMetadataContext from "@features/editor-metadata/hooks/useMetadataContext";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";

export default function ActiveColumnToolbar() {
  const { columns } = useMetadataContext();
  const { activeMetadataColumn, setActiveMetadataColumn } = useEditorContext();

  return (
    <View
      backgroundColor="gray-50"
      padding="size-50"
      borderRadius="medium"
      borderColor="gray-300"
      borderWidth="thin"
      gridArea="style"
    >
      <ComboBox
        aria-label="Metadata column"
        items={columns}
        width="size-3000"
        onSelectionChange={(key) =>
          setActiveMetadataColumn(key?.toString() || "")
        }
        selectedKey={activeMetadataColumn}
      >
        {(item) => <Item key={item.key}>{item.key}</Item>}
      </ComboBox>
    </View>
  );
}
