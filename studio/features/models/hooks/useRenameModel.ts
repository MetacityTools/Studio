"use client";

import { useMutation } from "@core/hooks/useMutation";
import { renameModel } from "../mutations/renameModel";

export const useRenameModel = () => {
  return useMutation(renameModel);
};
