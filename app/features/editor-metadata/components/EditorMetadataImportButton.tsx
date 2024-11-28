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
import { ToastQueue } from "@react-spectrum/toast";
import { parse } from "csv-parse/browser/esm/sync";
import { useCallback, useState } from "react";

type EditorAddModelDialogProps = {
  setTableData: (data: any) => void;
};

const supportedFileTypes = [".csv"];

export default function EditorMetadataImportButton({ setTableData }: EditorAddModelDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const modelList = Array.from(files);
      setLoading(true);
      if (modelList.length === 0) {
        setLoading(false);
        ToastQueue.info("No table selected");
        return;
      }

      const file = modelList[0];
      const fileContents = await file.text();
      const data = parse(fileContents, {
        columns: true,
        skipRecordsWithEmptyValues: true,
        skipEmptyLines: true,
        cast: true,
      });

      //filter data - if a column is empty, remove the column from the row record

      for (const row of data) {
        for (const key of Object.keys(row)) {
          if (row[key] === "") {
            delete row[key];
          }
        }
      }

      setTableData(data);
      setLoading(false);
    },
    [setTableData]
  );

  return (
    <FileTrigger acceptedFileTypes={supportedFileTypes} onSelect={handleSubmit}>
      <Button variant="primary">Load table data</Button>
      <DialogContainer onDismiss={() => {}}>
        {loading && (
          <Dialog>
            <Content>
              <Flex direction="row" gap="size-200" alignItems="center">
                <ProgressCircle aria-label="Loading…" isIndeterminate />
                <Text>Loading table data</Text>
              </Flex>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </FileTrigger>
  );
}
