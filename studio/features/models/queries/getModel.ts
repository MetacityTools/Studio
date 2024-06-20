"use server";

import { canReadModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import { getUserModelBucketName, listFilesInBucket } from "@features/storage";

import { Model } from "@features/db/entities/model";

export async function getModel(modelId: number) {
  if (!(await canReadModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.findOne({
    where: { id: modelId, user: { id: user.id } },
  });
  if (!model) return null;

  const bucketName = getUserModelBucketName(user.id, model.id);
  const files = await listFilesInBucket(bucketName);

  return toPlain({
    ...model,
    files,
  });
}