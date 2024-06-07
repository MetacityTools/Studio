"use server";

import { canReadOwnModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { injectRepository } from "@features/db/helpers";
import { getUserModelBucketName, listFilesInBucket } from "@features/storage";

import { Model } from "@features/db/entities/model";
  
export async function getOwnModel(modelId: number) {
    if (!(await canReadOwnModels())) throw new Error("Unauthorized");
  
    const user = (await getUserToken())!;
  
    const modelRepository = await injectRepository(Model);
  
    const model = await modelRepository.findOne({
      where: { id: modelId, user: { id: user.id } },
    });
    if (!model) return null;
  
    const bucketName = getUserModelBucketName(user.id, model.id);
    const files = await listFilesInBucket(bucketName);
  
    return {
      ...model,
      files,
    };
  }