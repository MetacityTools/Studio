"use client";

import { Project } from "@features/db/entities/project";
import { getOwnProjects } from "../queries/getOwnProjects";
import { useQuery } from "@core/hooks/useQuery";

export const useOwnProjects = () => {
  return useQuery({
    queryFn: getOwnProjects,
    defaultValue: [] as Project[],
  });
};
