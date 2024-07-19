import archiveFiles from "@core/utils/archiveFiles";
import { canReadModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import { getUserModelBucketName, listFilesInBucket } from "@features/storage";

export async function getModelArchive(modelId: number) {
  if (!(await canReadModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.findOne({
    where: { id: modelId, user: { id: user.id } },
  });
  if (!model) throw new Error("Not found");

  const bucketName = getUserModelBucketName(user.id, model.id);
  const files = await listFilesInBucket(bucketName);
  const archive = await archiveFiles(files, bucketName);

  return archive.to_blob().stream();
}
