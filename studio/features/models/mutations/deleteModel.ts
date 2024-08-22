"use server";

import { canReadModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import {
  deleteFile,
  getModelBucketName,
  listFilesInBucket,
} from "@features/storage";

export async function deleteModel(modelId: number) {
  if (!(await canReadModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.findOne({
    where: { id: modelId, user: { id: user.id } },
  });
  if (!model) throw new Error("Not found");

  // delete files
  const bucketName = getModelBucketName(model.id);

  const files = await listFilesInBucket(bucketName);
  for (const file of files) {
    await deleteFile(file, bucketName);
  }

  // delete model
  await modelRepository.remove(model);
}
