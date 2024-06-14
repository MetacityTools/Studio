"use client";

import { useQuery } from "@core/hooks/useQuery";
import { getProjectById } from "../queries/getProjectbyId";
import { useCallback } from "react";

export const useGetProjectById = (projectId: number | null) => {
  const queryFn = useCallback(async () => {
    if (projectId === null) return Promise.resolve(null);
    return getProjectById(projectId);
  }, [projectId]);

  return useQuery({
    queryFn,
    defaultValue: undefined,
  });
};
