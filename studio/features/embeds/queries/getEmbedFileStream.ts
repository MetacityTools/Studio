import { canReadOwnProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";

export async function getEmbedFileStream(embedId: number, fileName: string) {
  if (!(await canReadOwnProjects())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const embedRepository = await injectRepository(Embed);

  const model = await embedRepository.findOne({
    where: { id: embedId, project: { user: { id: user.id } } },
  });
  if (!model) throw new Error("Not found");

  const bucketName = getUserModelBucketName(user.id, model.id);

  return await readFileStream(fileName, bucketName);
}
