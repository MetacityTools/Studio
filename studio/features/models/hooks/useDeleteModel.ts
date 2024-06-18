"use client";

import { useMutation } from "@core/hooks/useMutation";
import { deleteModel } from "../mutations/deleteModel";

export const useDeleteModel = () => {
  return useMutation(deleteModel);
};
