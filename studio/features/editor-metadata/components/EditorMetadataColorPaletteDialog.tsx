import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Heading,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useCallback, useState } from "react";
import { colorMaps } from "../constants";

type AddValueDialogProps = {
  close: () => void;
};

export default function ColorPaletteDialog({ close }: AddValueDialogProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!value) {
      ToastQueue.negative("Value is required");
      return;
    }

    try {
      ToastQueue.positive("Value added successfully");
      close();
    } catch (error) {
      console.error(error);
      ToastQueue.negative("Failed to add value");
    }
  }, [value, close]);

  const gradientCss = useCallback((colorizer: (value: number) => string) => {
    //interpolate over
    //d3ScaleChromatic.interpolateBlues();
    //with 9 steps

    const colors = [];
    for (let i = 0; i < 9; i++) {
      colors.push(colorizer(i / 8));
    }

    const gradient = colors.map((color, index) => {
      const step = index / (colors.length - 1);
      return `${color} ${step * 100}%`;
    });

    return `linear-gradient(to right, ${gradient.join(", ")})`;
  }, []);

  return (
    <Dialog onDismiss={close}>
      <Heading>Pick color pallete</Heading>
      <Content>
        {colorMaps.map(([name, colorMap]) => (
          <div
            key={name}
            style={{
              width: "100%",
              height: 50,
              background: gradientCss(colorMap),
            }}
          />
        ))}
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
