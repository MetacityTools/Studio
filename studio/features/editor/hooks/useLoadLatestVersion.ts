import getProjectVersionArchive from "@features/api-sdk/getProjectVersionArchive";
import { readFileZipContents } from "@features/editor-models/utils/readZipContents";
import { load } from "@features/editor/utils/formats/loader";
import getLatestProjectVersions from "@features/projects-versions/queries/getLatestProjectVersion";
import { useCallback } from "react";
import { useImportModels } from "./useImportModels";

export default function useLoadLatestVersion() {
  const importModels = useImportModels();

  const getLatestVersion = useCallback(
    async (projectId: number) => {
      try {
        const version = await getLatestProjectVersions(projectId);
        if (!version) return;
        const blob = await getProjectVersionArchive(version.id);
        const fileMap = new Map<string, Blob>();
        await readFileZipContents(blob, fileMap);
        const data = await load(fileMap);
        await importModels(data, {
          overwriteCurrent: true,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [importModels],
  );

  return getLatestVersion;
}
