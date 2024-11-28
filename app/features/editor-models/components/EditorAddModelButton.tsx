import {
  Button,
  Content,
  Dialog,
  DialogContainer,
  FileTrigger,
  Flex,
  ProgressCircle,
  Text,
} from "@adobe/react-spectrum";
import { useImportModels } from "@features/editor/hooks/useImportModels";
import { load } from "@features/editor/utils/formats/loader";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback, useState } from "react";

type EditorAddModelDialogProps = {};

const supportedFileTypes = [".gltf", ".glb", ".shp", ".shx", ".dbf", ".prj", ".cpg", ".metacity"];

export default function EditorAddModelButton({}: EditorAddModelDialogProps) {
  const [loading, setLoading] = useState(false);

  const importModels = useImportModels();

  const handleSubmit = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const modelList = Array.from(files);
      setLoading(true);
      if (modelList.length === 0) {
        setLoading(false);
        ToastQueue.info("No models selected");
        return;
      }
      const fileMap = new Map<string, Blob>();
      // Add models to project
      for (const file of modelList) {
        fileMap.set(file.name, file);
      }
      const data = await load(fileMap);
      await importModels(data);
      setLoading(false);
    },
    [importModels]
  );

  return (
    <FileTrigger allowsMultiple acceptedFileTypes={supportedFileTypes} onSelect={handleSubmit}>
      <Button variant="primary">Add models</Button>
      <DialogContainer onDismiss={() => {}}>
        {loading && (
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
    </FileTrigger>
  );
}
