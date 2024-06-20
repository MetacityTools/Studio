import { expect, test } from "vitest";
import { Model } from "../../db/entities/model";
import { getOwnModel } from "../queries/getOwnModel";
import { createOwnModel } from "./createOwnModel";
import { deleteOwnModel } from "./deleteOwnModel";

const modelFile = {
  stream: () =>
    new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("test"));
        controller.close();
      },
    }),
  name: "test.txt",
} as File;

const modelMetadata: Pick<Model, "name" | "coordinateSystem"> = {
  name: "My best model",
  coordinateSystem: "WGS84",
};

test("model CRD", async () => {
  let model: Model | null;

  // CREATE
  model = await createOwnModel(modelMetadata, [modelFile]);
  expect(model).toMatchObject(modelMetadata);

  // READ
  model = await getOwnModel(model.id);
  expect(model).toMatchObject(modelMetadata);
  expect(model?.files).toHaveLength(1);
  expect(model?.files?.[0]).toBe(modelFile.name);

  // DELETE
  await deleteOwnModel(model!.id);
  model = await getOwnModel(model!.id);
  expect(model).toBe(null);
});
