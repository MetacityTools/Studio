import { describe, expect, test } from "vitest";
import { createOwnModel, deleteOwnModel, getOwnModel } from ".";
import { Model } from "../db/entities/model";

describe("model actions", () => {
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
});
