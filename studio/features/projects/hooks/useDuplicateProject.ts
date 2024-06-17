"use client";

import { useMutation } from "@core/hooks/useMutation";
import { duplicateProject } from "../mutations/duplicateProject";

export const useDuplicateProject = () => {
  return useMutation(duplicateProject);
};
