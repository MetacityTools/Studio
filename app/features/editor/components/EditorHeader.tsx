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
import AddColumnDialog from "@features/editor-metadata/components/EditorMetadataAddColumnDialog";
import useMetadataAssignValue from "@features/editor-metadata/hooks/useMetadataAssignValue";
import ActiveColumnToolbar from "@features/editor-toolbar/components/ActiveColumnToolbar";
import CameraViewToolbar from "@features/editor-toolbar/components/CameraViewToolbar";
import ColorSchemeToolbar from "@features/editor-toolbar/components/ColorSchemeToolbar";
import ProjectionToolbar from "@features/editor-toolbar/components/ProjectionToolbar";
import SelectionToolbar from "@features/editor-toolbar/components/SelectionToolbar";
import { useCallback, useState } from "react";
import { useEditorContext } from "../hooks/useEditorContext";
import EditorAddModelMenu from "./Header/EditorAddModelMenu";

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
          <EditorAddModelMenu />
          <DialogTrigger>
            <ActionButton isDisabled={selection.size === 0} isQuiet>
              <Text>Add Column to Selection</Text>
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
