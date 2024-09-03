import {
  Content,
  Dialog,
  DialogContainer,
  Flex,
  ProgressCircle,
  Text,
} from "@adobe/react-spectrum";
import useLoadEmbed from "@features/embeds/hooks/useLoadEmbed";
import Header from "@features/projects/components/Header";
import { useGetProjectById } from "@features/projects/hooks/useGetProjectById";
import { useEffect, useState } from "react";

type ViewerHeaderProps = {
  embedId: number;
};

export default function ViewerHeader({ embedId }: ViewerHeaderProps) {
  const { data } = useGetProjectById(embedId);
  const loadEmbed = useLoadEmbed();
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);
  const [isSavingDialogOpen, setIsSavingDialogOpen] = useState(false);

  useEffect(() => {
    async function loadProject() {
      setIsLoadingDialogOpen(true);
      await loadEmbed(embedId);
      setIsLoadingDialogOpen(false);
    }
    void loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedId]);

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
      />
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
    </>
  );
}
