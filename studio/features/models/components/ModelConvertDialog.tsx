"use client";

import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Heading,
  TextField,
} from "@adobe/react-spectrum";
import { useState } from "react";
import { useModel } from "../hooks/useModel";
import { convertModel } from "../mutations/convertModel";

type ModelConvertDialogProps = {
  open: boolean;
  close: () => void;
  modelId: number | null;
};

export default function ModelConvertDialog({
  open,
  close,
  modelId,
}: ModelConvertDialogProps) {
  const { data: model, isLoading } = useModel(modelId);

  const [isConverting, setIsConverting] = useState<boolean>(false);

  const [targetInputValue, setTargetInputValue] = useState<string>("4326");

  async function runConvertModel(modelId: number, targetEPSG: string) {
    setIsConverting(true);

    const response = await convertModel(modelId, targetEPSG);

    console.log("Converting response:", response);

    setIsConverting(false);
    close();
  }

  return (
    <DialogContainer onDismiss={close}>
      {open && model && (
        <Dialog>
          <Heading>Convert model: {model?.name}</Heading>
          <Content>
            <TextField
              label="Target EPSG code"
              value={targetInputValue}
              onChange={setTargetInputValue}
            ></TextField>
          </Content>
          <ButtonGroup marginTop={20}>
            <Button variant="secondary" onPress={close}>
              Close
            </Button>
            <Button
              variant="primary"
              onPress={() => runConvertModel(model.id, targetInputValue)}
              isDisabled={isConverting}
            >
              {isConverting ? "Converting..." : "Convert"}
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogContainer>
  );
}
