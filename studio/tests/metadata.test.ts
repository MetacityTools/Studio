import { expect } from "vitest";

import { Metadata } from "@features/db/entities/metadata";
import { omit } from "@features/helpers/objects";
import { deleteMetadata } from "@features/metadata/mutations/deleteMetadata";
import { saveMetadata } from "@features/metadata/mutations/saveMetadata";
import { getAllProjectMetadata } from "@features/metadata/queries/getAllProjectMetadata";
import { testWithFixtures } from "./helpers";

testWithFixtures("create metadata", async ({ project, model }) => {
  const metadataData: Pick<
    Metadata,
    "project_id" | "model_id" | "object_id" | "key" | "value" | "type"
  > = {
    project_id: project.id,
    model_id: model!.id,
    object_id: "testObjectId",
    type: "color",
    key: "testKey",
    value: "testValue",
  };

  const metadata = await saveMetadata(metadataData);
  expect(metadata).toMatchObject(metadataData);
});

testWithFixtures("get metadata", async ({ project, model, metadata }) => {
  const allMetadata = await getAllProjectMetadata(project.id);
  expect(allMetadata[0]).toMatchObject(
    omit(metadata, ["project", "model", "user"]),
  );
});

testWithFixtures("update metadata", async ({ project, model, metadata }) => {
  const updatedMetadata = await saveMetadata({
    ...metadata,
    value: "updatedValue",
  });
  expect(updatedMetadata.value).toBe("updatedValue");
});

testWithFixtures("delete metadata", async ({ project, model, metadata }) => {
  await deleteMetadata({
    project_id: project.id,
    model_id: model!.id,
    key: "testKey",
  });
  expect(await getAllProjectMetadata(project.id)).toEqual([]);
});
