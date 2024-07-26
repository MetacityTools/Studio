"use client";

import { useQuery } from "@core/hooks/useQuery";
import { useCallback } from "react";
import { getProjectById } from "../queries/getProjectById";

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
