"use server";

import { canCreateModel, canReadOwnModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import {
  deleteFile,
  ensureBucket,
  getUserModelBucketName,
  listFilesInBucket,
  readFileStream,
  saveFileStream,
} from "@features/storage";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export async function createOwnModel(
  metadata: Partial<Pick<Model, "name" | "coordinateSystem">>,
  files: File[]
) {
  if (!(await canCreateModel())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.save({
    ...metadata,
    user: { id: user.id },
  });

  try {
    // save files
    const bucketName = getUserModelBucketName(user.id, model.id);
    await ensureBucket(bucketName);

    for (const file of files) {
      const fileStream = Readable.fromWeb(file.stream() as ReadableStream);
      await saveFileStream(file.name, bucketName, fileStream);
    }
  } catch (e) {
    await modelRepository.remove(model);
    throw e;
  }

  return toPlain({
    ...model,
    files: files.map((f) => f.name),
  });
}

export async function downloadOwnModelFile(modelId: number, fileName: string) {
  if (!(await canReadOwnModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.findOne({
    where: { id: modelId, user: { id: user.id } },
  });
  if (!model) throw new Error("Not found");

  const bucketName = getUserModelBucketName(user.id, model.id);

  return await readFileStream(fileName, bucketName);
}

export async function deleteOwnModel(modelId: number) {
  if (!(await canReadOwnModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.findOne({
    where: { id: modelId, user: { id: user.id } },
  });
  if (!model) throw new Error("Not found");

  // delete files
  const bucketName = getUserModelBucketName(user.id, model.id);

  const files = await listFilesInBucket(bucketName);
  for (const file of files) {
    await deleteFile(file, bucketName);
  }

  // delete model
  await modelRepository.remove(model);
}

export async function listOwnModels() {
  if (!(await canReadOwnModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const models = await modelRepository.find({
    where: { user: { id: user.id } },
  });

  return toPlain(models);
}

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

  return toPlain({
    ...model,
    files,
  });
}
