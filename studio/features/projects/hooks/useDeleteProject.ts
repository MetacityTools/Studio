"use client";

import { useMutation } from "@core/hooks/useMutation";
import { deleteProject } from "../mutations/deleteProject";

export const useDeleteProject = () => {
  return useMutation(deleteProject);
};
