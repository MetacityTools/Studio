import {
  ActionButton,
  Content,
  Dialog,
  DialogContainer,
  Flex,
  Item,
  Key,
  Menu,
  MenuTrigger,
  ProgressCircle,
  Text,
} from "@adobe/react-spectrum";
import Header from "@core/components/Header";
import { MdiCube } from "@core/icons/MdiCube";
import { MdiTable } from "@core/icons/MdiTable";
import { useCallback, useState } from "react";
import { useExportModels } from "../hooks/useExportModels";
import useModelImport from "../hooks/useModelImport";
import { useRenderer } from "../hooks/useRender";

export default function EditorHeader() {
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);
  const [isSavingDialogOpen, setIsSavingDialogOpen] = useState(false);

  const exportModels = useExportModels();
  const renderer = useRenderer();

  const saveProject = useCallback(() => {
    async function handleUploadProjectVersion(dataFile: File, thumbnailFileContents: string) {
      //TODO offer to download file

      setIsSavingDialogOpen(false);
    }

    renderer.afterRenderOnce = async () => {
      //save contents of the canvas to a png file
      setIsSavingDialogOpen(true);
      const canvas: HTMLCanvasElement = renderer.window.rawCanvas;
      const image = canvas.toDataURL("image/png");

      //export project data
      const dataFile = exportModels();
      if (!dataFile) return;

      //upload project version
      void handleUploadProjectVersion(dataFile, image);
    };
  }, [renderer, exportModels]);

  const handleModelLoad = useModelImport();

  const handleAction = useCallback(
    async (action: Key) => {
      setIsLoadingDialogOpen(true);
      switch (action) {
        case "shp":
          await handleModelLoad([".shp", ".shx", ".dbf", ".prj", ".cpg"]);
          break;
        case "gltf":
          await handleModelLoad([".gltf", ".glb"]);
          break;
        case "metacity":
          await handleModelLoad([".metacity"]);
          break;
        //TODO handle CSV import
      }
      setIsLoadingDialogOpen(false);
    },
    [saveProject]
  );

  return (
    <>
      <Header
        nav={[
          {
            key: "metacity-studio",
            children: "Metacity Studio",
          },
        ]}
      >
        <MenuTrigger>
          <ActionButton isQuiet>Import</ActionButton>
          <Menu onAction={handleAction}>
            <Item key="shp">
              <MdiCube />
              <Text>Import Shapefile</Text>
            </Item>
            <Item key="gltf">
              <MdiCube />
              <Text>Import GLTF</Text>
            </Item>
            <Item key="metacity">
              <MdiCube />
              <Text>Import Metacity</Text>
            </Item>
            <Item key="csv">
              <MdiTable />
              <Text>Import CSV</Text>
            </Item>
          </Menu>
        </MenuTrigger>
      </Header>
      <DialogContainer onDismiss={() => {}}>
        {isLoadingDialogOpen && (
          <Dialog>
            <Content>
              <Flex direction="row" gap="size-200" alignItems="center">
                <ProgressCircle aria-label="Loading…" isIndeterminate />
                <Text>Loading model data</Text>
              </Flex>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
      <DialogContainer onDismiss={() => {}}>
        {isSavingDialogOpen && (
          <Dialog>
            <Content>
              <Flex direction="row" gap="size-200" alignItems="center">
                <ProgressCircle aria-label="Saving…" isIndeterminate />
                <Text>Saving project data</Text>
              </Flex>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </>
  );
}
