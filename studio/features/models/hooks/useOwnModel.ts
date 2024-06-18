"use client";

import { useQuery } from "@core/hooks/useQuery";
import { useCallback } from "react";
import { getOwnModel } from "../queries/getOwnModel";

export const useOwnModel = (modelId : number | null) => {
  const queryFn = useCallback(async () => {
    if (modelId === null) return Promise.resolve(null);
    return getOwnModel(modelId);
  }, [modelId]);

  return useQuery({
    queryFn,
    defaultValue: null,
  });
};
