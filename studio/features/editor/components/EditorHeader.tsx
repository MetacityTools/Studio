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
import uploadProjectVerion from "@features/api-sdk/uploadProjectVersion";
import Header from "@features/projects/components/Header";
import { useGetProjectById } from "@features/projects/hooks/useGetProjectById";
import { useCallback, useEffect, useState } from "react";
import { useExportModels } from "../hooks/useExportModels";
import useLoadLatestVersion from "../hooks/useLoadLatestVersion";

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

  const handleAction = useCallback(
    async (action: Key) => {
      switch (action) {
        case "save":
          setIsSavingDialogOpen(true);
          const file = exportModels();
          if (!file) return;
          await uploadProjectVerion(sanitizedId, file);
          setIsSavingDialogOpen(false);
          // Save
          break;
        case "share":
          // Share
          break;
      }
    },
    [exportModels, sanitizedId],
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
