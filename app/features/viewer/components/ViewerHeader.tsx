import { Content, Dialog, DialogContainer, Flex, ProgressCircle, Text } from "@adobe/react-spectrum";
import Header from "@core/components/Header";
import { useEffect, useState } from "react";

export default function ViewerHeader() {
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);

  useEffect(() => {
    async function loadProject() {
      setIsLoadingDialogOpen(true);

      //TODO handle embed loading

      setIsLoadingDialogOpen(false);
    }
    void loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header
        nav={[
          {
            key: "metacity-studio",
            children: "Metacity Studio Viewers",
          },
        ]}
      />
      <DialogContainer onDismiss={() => {}}>
        {isLoadingDialogOpen && (
          <Dialog>
            <Content>
              <Flex direction="row" gap="size-200" alignItems="center">
                <ProgressCircle aria-label="Loading…" isIndeterminate />
                <Text>Loading embed data</Text>
              </Flex>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </>
  );
}
