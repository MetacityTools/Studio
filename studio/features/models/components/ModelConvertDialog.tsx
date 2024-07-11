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

  const [targetInputValue, setTargetInputValue] = useState<string>("4326");

  async function convertModel(modelId: number, targetEPSG: string) {
    // TODO: call convert
    console.log(`convertModel called ${targetEPSG}`);
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
              onPress={() => convertModel(model.id, targetInputValue)}
            >
              Convert
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogContainer>
  );
}
