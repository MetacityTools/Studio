"use client";

import { Model } from "@features/db/entities/model";
import { listOwnModels } from "../queries/listOwnModels";
import { useQuery } from "@core/hooks/useQuery";

export const useOwnModels = () => {
  return useQuery({
    queryFn: listOwnModels,
    defaultValue: [] as Model[],
  });
};
