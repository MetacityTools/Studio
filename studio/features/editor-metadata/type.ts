import { ModelMetadataRecord } from "@features/editor/data/types";

export type MetadataListItem = {
  mid: string;
  values: ModelMetadataRecord;
};

export type MetadataAggListItem = {
  column: string;
  value: number | string;
  count: number;
  selected: number;
};
