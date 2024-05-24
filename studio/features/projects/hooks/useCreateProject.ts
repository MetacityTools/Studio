"use client";

import { createProject } from "../mutations/createProject";
import { useMutation } from "@core/hooks/useMutation";

export const useCreateProjects = () => {
  return useMutation(createProject);
};
