import { ComboBox, Item } from "@adobe/react-spectrum";
import useMetadataContext from "@features/editor-metadata/hooks/useMetadataContext";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";

export default function ActiveColumnToolbar() {
  const { columns } = useMetadataContext();
  const { activeMetadataColumn, setActiveMetadataColumn } = useEditorContext();

  return (
    <ComboBox
      label="Active Column"
      labelPosition="side"
      gridArea="style"
      aria-label="Metadata column"
      defaultItems={columns}
      width="size-5000"
      marginEnd="size-200"
      isDisabled={columns.length === 0}
      onSelectionChange={(key) => setActiveMetadataColumn(key?.toString() || "")}
      selectedKey={activeMetadataColumn}
    >
      {(item) => <Item key={item.key}>{item.key}</Item>}
    </ComboBox>
  );
}
