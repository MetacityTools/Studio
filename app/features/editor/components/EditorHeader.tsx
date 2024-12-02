import {
  ActionButton,
  Content,
  Dialog,
  DialogContainer,
  DialogTrigger,
  Flex,
  ProgressCircle,
  Text,
} from "@adobe/react-spectrum";
import Header from "@core/components/Header";
import ActiveColumnToolbar from "@features/editor/components/Header/ActiveColumnToolbar";
import CameraViewToolbar from "@features/editor/components/Header/CameraViewToolbar";
import ColorSchemeToolbar from "@features/editor/components/Header/ColorSchemeToolbar";
import ProjectionToolbar from "@features/editor/components/Header/ProjectionToolbar";
import SelectionToolbar from "@features/editor/components/Header/SelectionToolbar";
import AddColumnDialog from "@features/metadata/components/EditorMetadataAddColumnDialog";
import useMetadataAssignValue from "@features/metadata/hooks/useMetadataAssignValue";
import { useCallback, useState } from "react";
import { useEditorContext } from "../hooks/useEditorContext";
import AddModelMenu from "./Header/AddModelMenu";

export default function EditorHeader() {
  const [isSavingDialogOpen, setIsSavingDialogOpen] = useState(false);
  const { selection } = useEditorContext();
  const assignValue = useMetadataAssignValue();

  const handleCreateColumn = useCallback(
    (columnName: string, defaultValue: string | number, type: "string" | "number") => {
      assignValue(defaultValue, columnName, type);
    },
    [assignValue]
  );

  return (
    <>
      <Header>
        <Flex gap="size-100" flex="1" justifyContent="start" marginStart="size-100" alignItems="center">
          <AddModelMenu />
          <DialogTrigger>
            <ActionButton isDisabled={selection.size === 0} isQuiet>
              <Text>Add Data Column to Selection</Text>
            </ActionButton>
            {(close) => <AddColumnDialog close={close} onSubmit={handleCreateColumn} />}
          </DialogTrigger>
        </Flex>
        <Flex gap="size-300" flex="1" justifyContent="end" marginEnd="size-100" alignItems="center">
          <ActiveColumnToolbar />
          <ProjectionToolbar />
          <CameraViewToolbar />
          <SelectionToolbar />
          <ColorSchemeToolbar />
        </Flex>
      </Header>
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
