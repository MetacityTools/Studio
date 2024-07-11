"use client";

import {
  ActionButton,
  DialogTrigger,
  Heading,
  Item,
  ListView,
  Text,
  View,
  useAsyncList,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { Model } from "@features/db/entities/model";
import File from "@spectrum-icons/illustrations/File";
import EditorAddModelDialog from "./EditorAddModelDialog";

type EditorModelsProps = {
  projectId: number;
};

export default function EditorModels({ projectId }: EditorModelsProps) {
  //TODO sync the list of models with the context locally
  const modelList = useAsyncList<Model>({
    load: async () => {
      return { items: [] };
    },
  });

  return (
    <View position="relative" overflow="auto" margin="size-100" height="100%">
      <View>
        <Heading level={4}>Project Models</Heading>
        <DialogTrigger>
          <ActionButton marginBottom="size-100">Add Model</ActionButton>
          {(close) => (
            <EditorAddModelDialog projectId={projectId} close={close} />
          )}
        </DialogTrigger>
        <ListView
          selectionMode="multiple"
          aria-label="Models"
          minHeight="size-3000"
          height="100%"
          items={modelList.items}
          renderEmptyState={() => <NoData heading="No models in the project" />}
        >
          {(model) => (
            <Item key={model.id} textValue={model.name}>
              <File />
              <Text>{model.name}</Text>
            </Item>
          )}
        </ListView>
      </View>
    </View>
  );
}
