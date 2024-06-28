"use server";

import { canReadModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

type GetModelsNotInProjectParams = {
  projectId: number;
};

export async function getModelsNotInProject(
  params: GetModelsNotInProjectParams,
) {
  const { projectId } = params;
  if (!(await canReadModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const models = await modelRepository
    .createQueryBuilder("model")
    .leftJoinAndSelect("model.projects", "project")
    .where("project.id IS NULL OR project.id != :projectId", { projectId })
    .andWhere("model.user.id = :userId", { userId: user.id })
    .getMany();

  return toPlain(models);
}
