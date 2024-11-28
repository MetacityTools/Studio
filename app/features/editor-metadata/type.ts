import { ModelMetadataRecord } from "@features/editor/data/types";
import { EditorModelListItem } from "@features/editor/types";

export type MetadataListItem = {
  mid: string;
  values: ModelMetadataRecord;
};

export type MetadataAggListItem = {
  column: string;
  value: number | string;
  key: string;
  count: number;
  selected: number;
  color: string;
};

export type MetadataModelListItem = EditorModelListItem & {
  geometryMode: string;
};
