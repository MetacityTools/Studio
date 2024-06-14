"use client";

import { useMutation } from "@core/hooks/useMutation";
import { createProject } from "../mutations/createProject";

export const useCreateProjects = () => {
  return useMutation(createProject);
};
