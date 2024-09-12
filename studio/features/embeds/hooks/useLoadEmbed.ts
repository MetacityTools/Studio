import { readFileZipContents } from "@features/editor-models/utils/readZipContents";
import { load } from "@features/editor/utils/formats/loader";
import { useCallback } from "react";

import getEmbedArchive from "@features/api-sdk/getEmbedArchive";
import { useImportModels } from "@features/editor/hooks/useImportModels";
import getEmbed from "../queries/getEmbed";

export default function useLoadEmbed() {
  const importModels = useImportModels();

  const handleLoad = useCallback(
    async (embedId: number) => {
      try {
        const embed = await getEmbed(embedId);
        if (!embed) return;
        const blob = await getEmbedArchive(embed.id);
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

  return handleLoad;
}
