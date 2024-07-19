import { ActionGroup, Item, Key } from "@adobe/react-spectrum";
import uploadProjectVerion from "@features/api-sdk/uploadProjectVersion";
import Header from "@features/projects/components/Header";
import { useGetProjectById } from "@features/projects/hooks/useGetProjectById";
import { useCallback, useEffect } from "react";
import { useExportModels } from "../hooks/useExportModels";
import useLoadLatestVersion from "../hooks/useLoadLatestVersion";

type EditorHeaderProps = {
  sanitizedId: number;
};

export default function EditorHeader({ sanitizedId }: EditorHeaderProps) {
  const { data } = useGetProjectById(sanitizedId);
  const loadLatestVersion = useLoadLatestVersion();

  useEffect(() => {
    void loadLatestVersion(sanitizedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanitizedId]);

  const exportModels = useExportModels();

  const handleAction = useCallback(
    async (action: Key) => {
      switch (action) {
        case "save":
          const file = exportModels();
          if (!file) return;
          await uploadProjectVerion(sanitizedId, file);
          // Save
          break;
        case "share":
          // Share
          break;
      }
    },
    [exportModels, sanitizedId],
  );

  return (
    <Header
      nav={[
        {
          key: "projects",
          children: "Projects",
          link: "/projects",
        },
        {
          key: data?.name ?? "loading",
          children: data?.name ?? "loading",
        },
      ]}
    >
      <ActionGroup isQuiet onAction={handleAction}>
        <Item key="save">Save</Item>
        <Item key="share">Share</Item>
      </ActionGroup>
    </Header>
  );
}
