"use server";

import { canReadModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

type GetModelsByProjectParams = {
  projectId: number;
};

export async function getModelsByProject(params: GetModelsByProjectParams) {
  if (!(await canReadModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const models = await modelRepository.find({
    where: { user: { id: user.id }, projects: { id: params.projectId } },
  });

  return toPlain(models);
}
