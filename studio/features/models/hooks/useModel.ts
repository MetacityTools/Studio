"use client";

import { useQuery } from "@core/hooks/useQuery";
import { useCallback } from "react";
import { getModel } from "../queries/getModel";

export const useModel = (modelId : number | null) => {
  const queryFn = useCallback(async () => {
    if (modelId === null) return Promise.resolve(null);
    return getModel(modelId);
  }, [modelId]);

  return useQuery({
    queryFn,
    defaultValue: null,
  });
};
