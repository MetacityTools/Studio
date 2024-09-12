import { EditorModel } from "./data/EditorModel";

export type EditorModelListItem = {
  item: EditorModel;
  key: string;
  totalSubmodels: number;
  selectedSubmodels: number;
};
