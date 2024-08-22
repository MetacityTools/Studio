import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { Color } from "@react-spectrum/color";
import { vec3 } from "gl-matrix";
import { useCallback } from "react";

export default function useStyles() {
  const { setStyles } = useEditorContext();

  const setStyle = useCallback(
    (column: string, value: string | number, color: Color) => {
      setStyles((prev) => {
        const next = { ...prev };
        if (!next[column]) {
          next[column] = {};
        }

        const nextColor = {
          code: color.toString("css"),
          vec: getColor(color),
        };

        next[column][value] = nextColor;
        return next;
      });
    },
    [setStyles],
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
