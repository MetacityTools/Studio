import {
  ActionBar,
  ActionBarContainer,
  Content,
  Dialog,
  DialogContainer,
  Flex,
  Item,
  Key,
  ListView,
  ProgressCircle,
  Text,
  TextField,
  View,
} from "@adobe/react-spectrum";

import { PositioningContainer } from "@core/components/PositioningContainer";
import { MdiExport } from "@core/icons/MdiExport";
import useMetadataContext from "@features/editor-metadata/hooks/useMetadataContext";
import useExportEmbed from "@features/editor/hooks/useExportModels";
import { useRenderer } from "@features/editor/hooks/useRender";
import { useCallback, useState } from "react";

export default function EditorExportsCreate() {
  const { columns } = useMetadataContext();

  const [name, setName] = useState<string>("Untitled Embed");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isSavingDialogOpen, setIsSavingDialogOpen] = useState(false);

  const exportEmbeds = useExportEmbed();
  const renderer = useRenderer();

  const saveEmbed = useCallback(() => {
    async function handleUploadEmbed(dataFile: File, thumbnailFileContents: string) {
      //TODO download embed file
      setIsSavingDialogOpen(false);
    }

    renderer.afterRenderOnce = async () => {
      //save contents of the canvas to a png file
      setIsSavingDialogOpen(true);
      const canvas: HTMLCanvasElement = renderer.window.rawCanvas;
      const image = canvas.toDataURL("image/png");

      //export project data
      const dataFile = exportEmbeds(new Set(selectedKeys));
      if (!dataFile) return;

      //upload project version
      void handleUploadEmbed(dataFile, image);
    };
  }, [name, exportEmbeds, renderer, selectedKeys]);

  const handleGlobalAction = useCallback(
    (key: Key) => {
      if (key === "deleteColumns") {
        saveEmbed();
      }
    },
    [saveEmbed]
  );

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" marginX="size-200">
        <View width="100%" marginTop="size-200" marginBottom="size-100">
          <TextField label="Export Name" width="100%" value={name} onChange={setName} />
        </View>
        <View width="100%" marginBottom="size-50">
          <Text
            UNSAFE_style={{
              fontSize: "var(--spectrum-fieldlabel-text-size, var(--spectrum-global-dimension-font-size-75))",
              fontWeight: "var(--spectrum-fieldlabel-text-font-weight, var(--spectrum-global-font-weight-regular))",
              lineHeight: "var(--spectrum-fieldlabel-text-line-height, var(--spectrum-global-font-line-height-small))",
              color: "var(--spectrum-fieldlabel-text-color, var(--spectrum-alias-label-text-color))",
              WebkitFontSmoothing: "subpixel-antialiased",
              MozOsxFontSmoothing: "auto",
              fontSmooth: "subpixel-antialiased",
            }}
          >
            Choose columns to export
          </Text>
        </View>
        <View position="relative" flex height="100%" overflow="hidden" marginBottom="size-200">
          <ActionBarContainer height="100%" width="100%">
            <ListView
              aria-label="Column list"
              width="100%"
              height="100%"
              items={columns}
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  setSelectedKeys(columns.map((item) => item.key));
                } else {
                  setSelectedKeys(Array.from(keys) as string[]);
                }
              }}
            >
              {(item) => (
                <Item key={item.key} textValue={item.key}>
                  <Text>{item.key}</Text>
                </Item>
              )}
            </ListView>
            <ActionBar
              isEmphasized
              selectedItemCount={selectedKeys.length}
              onAction={handleGlobalAction}
              onClearSelection={() => setSelectedKeys([])}
            >
              <Item key="deleteColumns">
                <MdiExport />
                <Text>Create export</Text>
              </Item>
            </ActionBar>
          </ActionBarContainer>
        </View>
      </Flex>
      <DialogContainer onDismiss={() => {}}>
        {isSavingDialogOpen && (
          <Dialog>
            <Content>
              <Flex direction="row" gap="size-200" alignItems="center">
                <ProgressCircle aria-label="Saving…" isIndeterminate />
                <Text>Saving embed</Text>
              </Flex>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </PositioningContainer>
  );
}
