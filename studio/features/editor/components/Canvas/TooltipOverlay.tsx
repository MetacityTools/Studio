import { Heading, Text, View } from "@adobe/react-spectrum";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";

export function TooltipOverlay() {
  const { tooltip, activeMetadataColumn } = useEditorContext();

  if (!tooltip) return null;

  const value = tooltip.data[activeMetadataColumn];
  //if (value === undefined) return null;

  return (
    <View
      position="absolute"
      width="100%"
      height="100%"
      top="size-0"
      left="size-0"
      UNSAFE_style={{
        pointerEvents: "none",
      }}
      zIndex={100}
    >
      <View
        top={tooltip.y + 10}
        left={tooltip.x + 10}
        position="absolute"
        backgroundColor="gray-50"
        padding="size-100"
        borderRadius="regular"
      >
        <View>
          <Heading level={6} margin="0">
            {activeMetadataColumn}
          </Heading>
        </View>
        <View>
          <Text>{value ?? "N/A"}</Text>
        </View>
      </View>
    </View>
  );
}
