"use client";

import { useQuery } from "@core/hooks/useQuery";
import { Model } from "@features/db/entities/model";
import { listModels } from "../queries/listModels";

export const useOwnModels = () => {
  return useQuery({
    queryFn: listModels,
    defaultValue: [] as Model[],
  });
};
