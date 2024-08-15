import { ModelMetadataRecord } from "@features/editor/data/types";

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
