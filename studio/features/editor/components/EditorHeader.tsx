import { ActionGroup, Item, Key } from "@adobe/react-spectrum";
import Header from "@features/projects/components/Header";
import { useGetProjectById } from "@features/projects/hooks/useGetProjectById";
import { useCallback } from "react";
import { useExportModels } from "../hooks/useExportModels";

type EditorHeaderProps = {
  sanitizedId: number;
};

export default function EditorHeader({ sanitizedId }: EditorHeaderProps) {
  const { data } = useGetProjectById(sanitizedId);

  const exportModels = useExportModels();

  const handleAction = useCallback(
    (action: Key) => {
      switch (action) {
        case "save":
          const file = exportModels();
          console.log(file);
          // Save
          break;
        case "share":
          // Share
          break;
      }
    },
    [exportModels],
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
