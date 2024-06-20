"use server";

import { canReadOwnModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import { getUserModelBucketName, listFilesInBucket, readFile } from "@features/storage";
import { ZipArchive } from "@shortercode/webzip";

export async function downloadModelArchive(modelId: number) {
    if (!(await canReadOwnModels())) throw new Error("Unauthorized");
  
    const user = (await getUserToken())!;
  
    const modelRepository = await injectRepository(Model);
  
    const model = await modelRepository.findOne({
      where: { id: modelId, user: { id: user.id } },
    });
    if (!model) throw new Error("Not found");
  
    const bucketName = getUserModelBucketName(user.id, model.id);
    const files = await listFilesInBucket(bucketName);

    const archive = new ZipArchive;
    for (const file of files) {
        const data = await readFile(file, bucketName);
        await archive.set(file, data);
    }
    return archive.to_blob().stream();
  }