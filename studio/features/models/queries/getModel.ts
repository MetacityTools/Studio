"use server";

import { canReadModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import { getModelBucketName, listFilesInBucket } from "@features/storage";

import { Model } from "@features/db/entities/model";

export async function getModel(modelId: number) {
  if (!(await canReadModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.findOne({
    where: { id: modelId, user: { id: user.id } },
    relations: ["user"],
  });
  if (!model) return null;

  const bucketName = getModelBucketName(model.id);
  const files = await listFilesInBucket(bucketName);

  return toPlain({
    ...model,
    files,
  });
}
