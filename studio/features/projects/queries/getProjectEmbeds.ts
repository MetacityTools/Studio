import { canReadOwnProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export async function getProjectEmbeds(projectId: number) {
  if (!(await canReadOwnProjects())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const embedRepository = await injectRepository(Embed);

  const embeds = await embedRepository.find({
    where: { project: { id: projectId, user: { id: user.id } } },
  });

  return toPlain(embeds);
}
