import { useCallback } from "react";
import { EditorModel } from "../data/EditorModel";
import { useModels } from "./useModels";

export default function useModelToggleVisibility() {
  const [models, setModels] = useModels();

  const setVisibility = useCallback(
    (model: EditorModel, visibility: boolean) => {
      setModels((prev) => {
        const next = Array.from(prev);
        console.log("start", next);

        next
          .filter((m) => m.uuid === model.uuid)
          .map((m) => {
            console.log("loop", m.visible);
            m.visible = visibility;
            console.log("loop", m.visible);
          });

        console.log("done", next);
        return next;
      });
    },
    [],
  );

  return setVisibility;
}
