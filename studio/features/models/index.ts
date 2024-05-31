import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import { canCreateModel, canReadOwnModels } from "../auth/acl";
import { getUserToken } from "../auth/user";
import { Model } from "../db/entities/model";
import { injectRepository } from "../db/helpers";
import {
  deleteFile,
  ensureDirectory,
  getUserModelDirectory,
  listFilesInDirectory,
  readFileStream,
  saveFileStream,
} from "../storage";

export async function createOwnModel(
  metadata: Partial<Pick<Model, "name" | "coordinateSystem">>,
  files: File[]
) {
  if (!(await canCreateModel())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.save({
    ...metadata,
    user: { id: user.id },
  });

  try {
    // save files
    const dir = getUserModelDirectory(user.id, model.id);

    await ensureDirectory(dir);

    for (const file of files) {
      const fileStream = Readable.fromWeb(file.stream() as ReadableStream);
      await saveFileStream(file.name, dir, fileStream);
    }
  } catch (e) {
    await modelRepository.remove(model);
    throw e;
  }

  return {
    ...model,
    files: files.map((f) => f.name),
  };
}

export async function downloadOwnModelFile(modelId: number, fileName: string) {
  if (!(await canReadOwnModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.findOne({
    where: { id: modelId, user: { id: user.id } },
  });
  if (!model) throw new Error("Not found");

  const dir = getUserModelDirectory(user.id, model.id);

  return await readFileStream(fileName, dir);
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
  const dir = getUserModelDirectory(user.id, model.id);

  const files = await listFilesInDirectory(dir);
  for (const file of files) {
    await deleteFile(file, dir);
  }

  // delete model
  await modelRepository.remove(model);
}

export async function listOwnModels() {
  if (!(await canReadOwnModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  return await modelRepository.find({
    where: { user: { id: user.id } },
  });
}

export async function getOwnModel(modelId: number) {
  if (!(await canReadOwnModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.findOne({
    where: { id: modelId, user: { id: user.id } },
  });
  if (!model) return null;

  const dir = getUserModelDirectory(user.id, model.id);
  const files = await listFilesInDirectory(dir);

  return {
    ...model,
    files,
  };
}
