"use server";

import { getUserToken } from "../user";
import { injectRepository } from "@features/db/helpers";
import { User } from "@features/db/entities/user";

export async function hasAccess() {
  const user = await getUserToken();
  const userRepository = await injectRepository(User);

  const userModel = await userRepository.findOne({
    where: { idAuth0: user.id },
  });

  if (!userModel) {
    await userRepository.save({
      id: user.id,
      email: user.email,
      picture: user.picture,
      idAuth0: user.id,
    });
    return false;
  } else {
    return userModel.enabled;
  }
}
