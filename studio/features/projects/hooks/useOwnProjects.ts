"use client";

import { getOwnProjects } from "../queries/getOwnProjects";
import { useQuery } from "@core/hooks/useQuery";

export const useOwnProjects = () => {
  return useQuery({
    queryFn: getOwnProjects,
  });
};
