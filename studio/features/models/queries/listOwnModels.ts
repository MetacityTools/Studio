"use server";

import { canReadOwnModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";

export async function listOwnModels() {
    if (!(await canReadOwnModels())) throw new Error("Unauthorized");
  
    const user = (await getUserToken())!;
  
    const modelRepository = await injectRepository(Model);
  
    return await modelRepository.find({
      where: { user: { id: user.id } },
    });
  }