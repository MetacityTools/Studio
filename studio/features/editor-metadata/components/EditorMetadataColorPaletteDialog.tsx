import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Grid,
  Heading,
  RangeSlider,
  repeat,
  Text,
  View,
} from "@adobe/react-spectrum";
import { Style } from "@features/editor/data/types";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { parseColor } from "@react-spectrum/color";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import { colorMaps } from "../constants";
import useMetadataStats from "../hooks/useMetadataStats";

type AddValueDialogProps = {
  close: () => void;
};

const NoneMapping = ["none", (_?: number) => "#FFFFFF"] as const;

export default function ColorPaletteDialog({ close }: AddValueDialogProps) {
  const [value, setValue] = useState("none");
  const [range, setRange] = useState({ start: 0, end: 1 });

  const { aggregatedRows, stats } = useMetadataStats();
  const { styles, activeMetadataColumn, setStyles } = useEditorContext();

  useEffect(() => {
    if (stats.numberCount > 0) {
      setRange({ start: stats.min, end: stats.max });
    }
  }, [stats.numberCount, stats.min, stats.max]);

  const handleSubmit = useCallback(async () => {
    if (!value) {
      return;
    }

    try {
      //apply color to styles
      setStyles((prev) => {
        const next: Style = { ...prev };

        //get colorizer function
        const mappingRecord =
          colorMaps.find(([name]) => name === value) ?? NoneMapping;
        const colorizer = mappingRecord[1];

        //get active style column
        const column = next[activeMetadataColumn] ?? {};

        //apply color to each value
        aggregatedRows.forEach((row) => {
          const value = row.value;
          //if value is number, apply color based on range
          if (typeof value === "number") {
            const indicator = clamp(
              (value - range.start) / (range.end - range.start),
              0,
              1,
            );
            const color = colorizer(indicator);
            const colorParsed = parseColor(color).toFormat("rgb");
            column[value] = {
              code: colorParsed.toString("css"),
              vec: [
                colorParsed.getChannelValue("red") / 255,
                colorParsed.getChannelValue("green") / 255,
                colorParsed.getChannelValue("blue") / 255,
              ],
            };
            //if value is string, apply random color
          } else if (typeof value === "string") {
            const color = colorizer(Math.random());
            const colorParsed = parseColor(color).toFormat("rgb");

            column[value] = {
              code: colorParsed.toString("css"),
              vec: [
                colorParsed.getChannelValue("red") / 255,
                colorParsed.getChannelValue("green") / 255,
                colorParsed.getChannelValue("blue") / 255,
              ],
            };
          }
        });

        next[activeMetadataColumn] = column;
        return next;
      });

      ToastQueue.positive("Color map applied successfully");
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Applying color map failed");
    }
  }, [value, close, setStyles, activeMetadataColumn, aggregatedRows, range]);

  const gradientCss = useCallback((colorizer: (value: number) => string) => {
    const colors = [];
    for (let i = 0; i < 9; i++) {
      colors.push(colorizer(i / 8));
    }

    const gradient = colors.map((color, index) => {
      const step = index / (colors.length - 1);
      return `${color} ${step * 100}%`;
    });

    return `linear-gradient(to bottom right, ${gradient.join(", ")})`;
  }, []);

  const mappedGradientCss = useMemo(() => {
    if (value === "none") return undefined;
    if (stats.numberCount === 0) return undefined;
    const mappingRecord =
      colorMaps.find(([name]) => name === value) ?? NoneMapping;

    const colorizer = mappingRecord[1];
    const { min, max } = stats;
    const rangeMinAsPct = (range.start - min) / (max - min);
    const rangeMaxAsPct = (range.end - min) / (max - min);
    const pctRange = rangeMaxAsPct - rangeMinAsPct;

    const colors = [];
    for (let i = 0; i < 9; i++) {
      colors.push(colorizer(i / 8));
    }

    const gradient = colors.map((color, index) => {
      const step = index / (colors.length - 1);
      return `${color} ${rangeMinAsPct * 100 + step * pctRange * 100}%`;
    });

    return `linear-gradient(to right, ${gradient.join(", ")})`;
  }, [value, stats, range]);

  return (
    <Dialog onDismiss={close}>
      <Heading>Pick color palette</Heading>
      <Content>
        <Text>
          Select color palette. The selected palette will be applied to the
          active data column.
        </Text>
        <Grid
          columns={repeat("auto-fit", "size-600")}
          autoRows="size-600"
          justifyContent="center"
          gap="size-100"
          marginY="size-400"
        >
          <ColorMapButton
            name="none"
            onClick={() => setValue("none")}
            selected={value === "none"}
            background="repeating-linear-gradient(-45deg, #f0f0f0, #f0f0f0 10px, #ffffff 10px, #ffffff 20px)"
          />
          {colorMaps.map(([name, colorMap]) => (
            <ColorMapButton
              key={name}
              name={name}
              onClick={() => setValue(name)}
              selected={value === name}
              background={gradientCss(colorMap)}
            />
          ))}
        </Grid>
        {stats.numberCount > 0 && (
          <View>
            <Heading level={4} marginBottom="size-50">
              Number values
            </Heading>
            <Text>
              {stats.numberCount} unique number values found in the column.
            </Text>
            <View marginTop="size-100">
              <RangeSlider
                label="Mappable range"
                width="100%"
                minValue={stats.min}
                maxValue={stats.max}
                value={range}
                onChange={setRange}
              />
            </View>
            <View
              height="size-300"
              width="100%"
              position="relative"
              borderColor="gray-300"
              borderWidth="thin"
              borderRadius="regular"
              UNSAFE_style={{
                background: mappedGradientCss,
              }}
            >
              {stats.min < 0 && stats.max > 0 && (
                <View
                  height="100%"
                  width="1px"
                  borderColor="gray-300"
                  borderWidth="thin"
                  position="absolute"
                  left={`${((0 - stats.min) / (stats.max - stats.min)) * 100}%`}
                />
              )}
            </View>
          </View>
        )}
        {stats.stringCount > 0 && (
          <View>
            <Heading level={4} marginBottom="size-50">
              String values
            </Heading>
            <Text>
              {stats.stringCount} unique string values found in the column.
              Colors will be assigned randomly to each unique string value.
            </Text>
          </View>
        )}
      </Content>
      <ButtonGroup marginTop={20}>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
        <Button variant="accent" onPress={handleSubmit}>
          Apply
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

type ColorMapButtonProps = {
  name: string;
  background: string;
  onClick: () => void;
  selected: boolean;
};

function ColorMapButton({
  name,
  onClick,
  selected,
  background,
}: ColorMapButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        all: "unset",
        font: "inherit",
        color: "inherit",
        borderRadius: "var(--spectrum-alias-border-radius-regular)",
        cursor: "pointer",
        boxShadow: selected
          ? "0 0 0 2px var(--spectrum-global-color-gray-800)"
          : "none",
        background: background,
      }}
    />
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
