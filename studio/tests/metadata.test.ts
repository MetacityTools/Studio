import { expect } from "vitest";

import { ModelMetadata } from "@features/db/entities/modelMetadata";
import { omit } from "@features/helpers/objects";
import { deleteModelMetadata } from "@features/modelMetadata/mutations/deleteModelMetadata";
import { saveModelMetadata } from "@features/modelMetadata/mutations/saveModelMetadata";
import { getAllProjectMetadata } from "@features/modelMetadata/queries/getAllProjectMetadata";
import { testWithFixtures } from "./helpers";

testWithFixtures("create metadata", async ({ project, model }) => {
  const modelMetadataData: Pick<
    ModelMetadata,
    "project_id" | "model_id" | "object_id" | "key" | "value" | "type"
  > = {
    project_id: project.id,
    model_id: model!.id,
    object_id: "testObjectId",
    type: "color",
    key: "testKey",
    value: "testValue",
  };

  const metadata = await saveModelMetadata(modelMetadataData);
  expect(metadata).toMatchObject(modelMetadataData);
});

testWithFixtures("get metadata", async ({ project, model, metadata }) => {
  const allMetadata = await getAllProjectMetadata(project.id);
  expect(allMetadata[0]).toMatchObject(
    omit(metadata, ["project", "model", "user"]),
  );
});

testWithFixtures("update metadata", async ({ project, model, metadata }) => {
  const updatedMetadata = await saveModelMetadata({
    ...metadata,
    value: "updatedValue",
  });
  expect(updatedMetadata.value).toBe("updatedValue");
});

testWithFixtures("delete metadata", async ({ project, model, metadata }) => {
  await deleteModelMetadata({
    project_id: project.id,
    model_id: model!.id,
    key: "testKey",
  });
  expect(await getAllProjectMetadata(project.id)).toEqual([]);
});
