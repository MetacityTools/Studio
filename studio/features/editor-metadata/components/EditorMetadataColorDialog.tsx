import { Content, Dialog, Flex, Heading } from "@adobe/react-spectrum";
import {
  Color,
  ColorEditor,
  ColorField,
  ColorPicker,
} from "@react-spectrum/color";
import { parseColor } from "@react-stately/color";
import { useState } from "react";

function rgbToHsb(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0
      ? 0
      : n && v === r
        ? (g - b) / n
        : v === g
          ? 2 + (b - r) / n
          : 4 + (r - g) / n;
  const value = [
    60 * (h < 0 ? h + 6 : h),
    v && (n / v) * 100,
    v * 100,
  ] as const;
  return `hsb(${value[0]},${value[1]}%,${value[2]}%)`;
}

function hsbToRgb(h: number, s: number, b: number) {
  s /= 100;
  b /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) =>
    b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  const value = [255 * f(5), 255 * f(3), 255 * f(1)] as const;
  return `rgb(${value[0]},${value[1]},${value[2]})`;
}

function colorToHsb(color: Color) {
  const space = color.getColorSpace();
  if (space === "hsb") {
    return color;
  } else if (space === "rgb") {
    return parseColor(
      rgbToHsb(
        color.getChannelValue("red"),
        color.getChannelValue("green"),
        color.getChannelValue("blue"),
      ),
    );
  } else {
    throw new Error(`Unsupported color space: ${space}`);
  }
}

function colorToRgb(color: Color) {
  const space = color.getColorSpace();
  if (space === "rgb") {
    return color;
  } else if (space === "hsb") {
    return parseColor(
      hsbToRgb(
        color.getChannelValue("hue"),
        color.getChannelValue("saturation"),
        color.getChannelValue("brightness"),
      ),
    );
  } else {
    throw new Error(`Unsupported color space: ${space}`);
  }
}

function colorToRgbString(color: Color) {
  const converted = colorToRgb(color);
  return `rgb(${converted.getChannelValue("red")}, ${converted.getChannelValue("green")}, ${converted.getChannelValue("blue")})`;
}

function colorToRgbArray(color: Color) {
  const converted = colorToRgb(color);
  return [
    converted.getChannelValue("red"),
    converted.getChannelValue("green"),
    converted.getChannelValue("blue"),
  ] as const;
}

type DialogProps = {
  rbgColor: readonly [number, number, number];
  close: (color: readonly [number, number, number]) => void;
};

export default function EditorMetadataColorDialog({
  rbgColor,
  close,
}: DialogProps) {
  const parsedColor = parseColor(rgbToHsb(...rbgColor));
  const [hsbColor, setColor] = useState(parsedColor);

  return (
    <Dialog
      width="size-4000"
      isDismissable
      onDismiss={() => close(colorToRgbArray(hsbColor))}
    >
      <Heading>Edit Color</Heading>
      <Content>
        <Flex direction="row" gap="size-100" marginY="size-100">
          <ColorPicker onChange={setColor} value={hsbColor}>
            <ColorEditor hideAlphaChannel />
          </ColorPicker>
          <ColorField
            isQuiet
            aria-label="Color"
            value={hsbColor}
            onChange={(color) => {
              if (color) return setColor(colorToHsb(color));
            }}
          />
        </Flex>
      </Content>
    </Dialog>
  );
}
