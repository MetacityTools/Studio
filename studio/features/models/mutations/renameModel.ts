"use server";

import { canEditModel } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import { z } from "zod";

const renameModelData = z.object({
  name: z.string().optional(),
});

export async function renameModel(
  id: number,
  modelData: Partial<Pick<Model, "name">>
): Promise<Model | null> {
  modelData = renameModelData.parse(modelData);

  console.log(modelData);

  if (!(await canEditModel())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.findOne({
    where: { id, user: { id: user.id } },
  });

  if (!model) throw new Error("Not Found");
  console.log(modelData.name);
  return modelRepository.save({
    id,
    name: modelData.name ?? model.name,
  });
}
