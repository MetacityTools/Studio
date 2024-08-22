"use client";

import {
  Color,
  ColorEditor,
  ColorPicker,
  parseColor,
} from "@react-spectrum/color";
import { useEffect, useState } from "react";

type DebouncedColorPickerProps = {
  value: string;
  onChange: (color: Color) => void;
};

export default function DebouncedColorPicker({
  value,
  onChange,
}: DebouncedColorPickerProps) {
  const [color, setColor] = useState<Color>(parseColor(value).toFormat("hsb"));

  useEffect(() => {
    const timeout = setTimeout(() => {
      color && onChange(color);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  useEffect(() => {
    if (value === color.toString("css")) return;
    setColor(parseColor(value).toFormat("hsb"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <ColorPicker value={color} onChange={setColor}>
      <ColorEditor hideAlphaChannel />
    </ColorPicker>
  );
}
