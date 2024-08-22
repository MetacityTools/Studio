import { MetacityData, UserInputModel } from "@editor/data/types";

import { readModels } from "./read";
import { EditorData } from "./types";

export function parse(model: UserInputModel): EditorData {
  const parsedModel = readModels((model.data as MetacityData).buffer);
  return parsedModel;
}
