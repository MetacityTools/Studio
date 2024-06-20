"use client";

import { useQuery } from "@core/hooks/useQuery";
import { Project } from "@features/db/entities/project";
import { getProjects } from "../queries/getProjects";

export const useProjects = () => {
  return useQuery({
    queryFn: getProjects,
    defaultValue: [] as Project[],
  });
};
