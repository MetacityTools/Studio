"use client";

import { useQuery } from "@core/hooks/useQuery";
import { useCallback } from "react";
import getEmbed from "../queries/getEmbed";

export const useEmbed = (embedId: number | null) => {
  const queryFn = useCallback(async () => {
    if (embedId === null) return Promise.resolve(null);
    return getEmbed(embedId);
  }, [embedId]);

  return useQuery({
    queryFn,
    defaultValue: undefined,
  });
};
