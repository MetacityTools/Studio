import { useCallback } from "react";
import { useImportModels } from "./useImportModels";

export default function useLoadLatestVersion() {
  const importModels = useImportModels();

  const getLatestVersion = useCallback(async () => {
    try {
      //load file contents
      // await importModels(data, {
      //   overwriteCurrent: true,
      // });
    } catch (error) {
      console.error(error);
    }
  }, [importModels]);

  return getLatestVersion;
}
