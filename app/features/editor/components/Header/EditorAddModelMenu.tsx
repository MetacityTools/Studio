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
import { MdiCube } from "@core/icons/MdiCube";
import { MdiTable } from "@core/icons/MdiTable";
import { useCallback, useState } from "react";
import useModelImport from "../../hooks/useModelImport";

export default function EditorAddModelMenu() {
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);
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
    [handleModelLoad]
  );

  return (
    <>
      <MenuTrigger>
        <ActionButton isQuiet>Import</ActionButton>
        <Menu onAction={handleAction}>
          <Item key="shp" textValue="Import Shapefile">
            <MdiCube />
            <Text>Import Shapefile</Text>
          </Item>
          <Item key="gltf" textValue="Import GLTF">
            <MdiCube />
            <Text>Import GLTF</Text>
          </Item>
          <Item key="metacity" textValue="Import Metacity">
            <MdiCube />
            <Text>Import Metacity</Text>
          </Item>
          <Item key="csv" textValue="Import CSV">
            <MdiTable />
            <Text>Import CSV</Text>
          </Item>
        </Menu>
      </MenuTrigger>

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
    </>
  );
}
