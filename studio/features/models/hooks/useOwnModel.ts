"use client";

import { getOwnModel } from "../queries/getOwnModel";
import { useQuery } from "@core/hooks/useQuery";
import { useCallback } from "react";

export const useOwnModel = (modelId : number) => {
  return useQuery({
    queryFn: useCallback(() => getOwnModel(modelId), [modelId]),
    defaultValue: null,
  });
};
