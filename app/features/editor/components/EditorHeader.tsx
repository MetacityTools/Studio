import {
  ActionGroup,
  Content,
  Dialog,
  DialogContainer,
  Flex,
  Item,
  Key,
  ProgressCircle,
  Text,
} from "@adobe/react-spectrum";
import Header from "@core/components/Header";
import { useCallback, useState } from "react";
import { useExportModels } from "../hooks/useExportModels";
import useLoadLatestVersion from "../hooks/useLoadLatestVersion";
import { useRenderer } from "../hooks/useRender";

export default function EditorHeader() {
  //TODO initialize data
  const data = {};
  const loadLatestVersion = useLoadLatestVersion();
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);
  const [isSavingDialogOpen, setIsSavingDialogOpen] = useState(false);

  //TODO do this after user uploads model
  // useEffect(() => {
  //   async function loadProject() {
  //     setIsLoadingDialogOpen(true);
  //     await loadLatestVersion();
  //     setIsLoadingDialogOpen(false);
  //   }
  //   void loadProject();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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

  const handleAction = useCallback(
    async (action: Key) => {
      switch (action) {
        case "save":
          saveProject();
        // break;
        case "share":
          // Share
          break;
      }
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
        <ActionGroup isQuiet onAction={handleAction}>
          <Item key="save">Save</Item>
        </ActionGroup>
      </Header>
      <DialogContainer onDismiss={() => {}}>
        {isLoadingDialogOpen && (
          <Dialog>
            <Content>
              <Flex direction="row" gap="size-200" alignItems="center">
                <ProgressCircle aria-label="Loading…" isIndeterminate />
                <Text>Loading project data</Text>
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
