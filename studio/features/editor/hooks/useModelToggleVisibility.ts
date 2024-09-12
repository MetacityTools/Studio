import { useCallback } from "react";
import { EditorModel } from "../data/EditorModel";
import { useModels } from "./useModels";

export default function useModelToggleVisibility() {
  const [models, setModels] = useModels();

  const setVisibility = useCallback(
    (model: EditorModel, visibility: boolean) => {
      setModels((prev) => {
        const next = Array.from(prev);

        next
          .filter((m) => m.uuid === model.uuid)
          .map((m) => {
            m.visible = visibility;
          });

        return next;
      });
    },
    [],
  );

  return setVisibility;
}
