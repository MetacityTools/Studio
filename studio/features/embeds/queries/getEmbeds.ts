"use server";

import { canReadProjects } from "@features/auth/acl";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export default async function getEmbeds(projectId: number) {
  if (!(await canReadProjects())) throw new Error("Unauthorized");

  const embedRepository = await injectRepository(Embed);

  const embeds = await embedRepository.find({
    where: { project: { id: projectId } },
  });

  if (!embeds) throw new Error("Not found");
  return toPlain(embeds);
}
