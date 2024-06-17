"use client";

import { updateProject } from "../mutations/updateProject";
import { useMutation } from "@core/hooks/useMutation";

export const useUpdateProject = () => {
  return useMutation(updateProject);
};
