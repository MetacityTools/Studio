import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { Color } from "@react-spectrum/color";
import { vec3 } from "gl-matrix";
import { useCallback } from "react";

export default function useStyles() {
  const { setStyles } = useEditorContext();

  const setStyle = useCallback(
    (column: string, value: string | number, color: Color) => {
      setStyles((prev) => {
        const columnValues = prev[column] ?? {};

        const nextColor = {
          code: color.toString("css"),
          vec: getColor(color),
        };

        //check if the value is already in the column
        if (columnValues[value]?.code === nextColor.code) {
          return prev;
        }

        const next = { ...prev };
        columnValues[value] = nextColor;
        next[column] = columnValues;
        return next;
      });
    },
    [setStyles]
  );

  return { setStyle };
}

function getColor(color: Color) {
  const rgb = color.toFormat("rgb");
  return [
    rgb.getChannelValue("red") / 255,
    rgb.getChannelValue("green") / 255,
    rgb.getChannelValue("blue") / 255,
  ] as vec3;
}
