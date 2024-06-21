"use server";

import { canReadModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import { getUserModelBucketName, readFileStream } from "@features/storage";

export async function downloadModelFile(modelId: number, fileName: string) {
    if (!(await canReadModels())) throw new Error("Unauthorized");
  
    const user = (await getUserToken())!;
  
    const modelRepository = await injectRepository(Model);
  
    const model = await modelRepository.findOne({
      where: { id: modelId, user: { id: user.id } },
    });
    if (!model) throw new Error("Not found");
  
    const bucketName = getUserModelBucketName(user.id, model.id);
  
    return await readFileStream(fileName, bucketName);
  }