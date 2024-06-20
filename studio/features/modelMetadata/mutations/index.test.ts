import { expect, test } from "vitest";

import { Model } from "@features/db/entities/model";
import { Project } from "@features/db/entities/project";

import { ModelMetadata } from "@features/db/entities/modelMetadata";
import { createModel } from "@features/models/mutations/createModel";
import { deleteModel } from "@features/models/mutations/deleteModel";
import { deleteProject } from "@features/projects/mutations/deleteProject";
import { createProject } from "../../projects/mutations/createProject";
import { getAllProjectMetadata } from "../queries/getAllProjectMetadata";
import { deleteModelMetadata } from "./deleteModelMetadata";
import { saveModelMetadata } from "./saveModelMetadata";

test("project CRUD", async () => {
  let project: Project | null;
  let model: Model | null;

  project = await createProject({
    name: "Test Project",
    description: "This is a test project",
  });

  model = await createModel(
    {
      name: "Test Model",
    },
    []
  );

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

  // CREATE
  const metadata = await saveModelMetadata(modelMetadataData);
  expect(metadata).toMatchObject(modelMetadataData);

  // READ
  const allMetadata = await getAllProjectMetadata(project.id);
  expect(allMetadata[0]).toMatchObject(modelMetadataData);

  // UPDATE
  const updatedMetadata = await saveModelMetadata({
    ...modelMetadataData,
    value: "updatedValue",
  });
  expect(updatedMetadata.value).toBe("updatedValue");

  // DELETE
  await deleteModelMetadata({
    project_id: project.id,
    model_id: model!.id,
    key: "testKey",
  });
  expect(await getAllProjectMetadata(project.id)).toEqual([]);

  // CLEANUP
  await deleteProject(project.id);
  await deleteModel(model!.id);
});
