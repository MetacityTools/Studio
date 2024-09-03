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
import uploadProjectVersion from "@features/api-sdk/uploadProjectVersion";
import Header from "@features/projects/components/Header";
import { useGetProjectById } from "@features/projects/hooks/useGetProjectById";
import { useCallback, useEffect, useState } from "react";
import { useExportModels } from "../hooks/useExportModels";
import useLoadLatestVersion from "../hooks/useLoadLatestVersion";
import { useRenderer } from "../hooks/useRender";

type EditorHeaderProps = {
  sanitizedId: number;
};

export default function EditorHeader({ sanitizedId }: EditorHeaderProps) {
  const { data } = useGetProjectById(sanitizedId);
  const loadLatestVersion = useLoadLatestVersion();
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);
  const [isSavingDialogOpen, setIsSavingDialogOpen] = useState(false);

  useEffect(() => {
    async function loadProject() {
      setIsLoadingDialogOpen(true);
      await loadLatestVersion(sanitizedId);
      setIsLoadingDialogOpen(false);
    }
    void loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanitizedId]);

  const exportModels = useExportModels();
  const renderer = useRenderer();

  const saveProject = useCallback(() => {
    async function handleUploadProjectVersion(
      dataFile: File,
      thumbnailFileContents: string,
    ) {
      await uploadProjectVersion(sanitizedId, dataFile, thumbnailFileContents);

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
  }, [renderer, sanitizedId, exportModels]);

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
    [saveProject],
  );

  return (
    <>
      <Header
        nav={[
          {
            key: "projects",
            children: "Projects",
            link: "/projects",
          },
          {
            key: data?.name ?? "loading",
            children: data?.name ?? "loading",
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
