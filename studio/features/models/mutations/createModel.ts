"use server";

import { canCreateModel } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import {
  ensureBucket,
  getModelBucketName,
  saveFileStream,
} from "@features/storage";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export async function createModel(
  metadata: Partial<Pick<Model, "name" | "coordinateSystem">>,
  files: File[],
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
    const bucketName = getModelBucketName(model.id);
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
