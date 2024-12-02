import { toasterOptions } from "@core/defaults";
import { useImportModels } from "@features/editor/hooks/useImportModels";
import { load } from "@features/editor/utils/formats/loader";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback } from "react";

export default function useModelImport() {
  const importModels = useImportModels();

  const handleSubmit = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const modelList = Array.from(files);
      if (modelList.length === 0) {
        ToastQueue.info("No models selected", toasterOptions);
        return;
      }
      const fileMap = new Map<string, Blob>();
      // Add models to project
      for (const file of modelList) {
        fileMap.set(file.name, file);
      }
      const data = await load(fileMap);
      await importModels(data);
    },
    [importModels]
  );

  return useCallback(
    (acceptedFormats: string[]) =>
      new Promise<void>((resolve, reject) => {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.type = "file";
        input.accept = acceptedFormats.join(",");
        input.multiple = true;

        input.addEventListener("change", async () => {
          await handleSubmit(input.files);
          input.remove();
          resolve();
        });

        input.addEventListener("cancel", () => {
          console.log("cancel");
          input.remove();
          resolve();
        });

        input.click();
      }),
    [handleSubmit]
  );
}
