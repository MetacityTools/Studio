import { Readable } from "stream";
import { canCreateModel } from "../auth/acl";
import { saveFileStream } from "../storage";

export async function saveModel(model: Readable) {
  if (!(await canCreateModel())) throw new Error("Unauthorized");

  await saveFileStream("model", "models", model);
}
