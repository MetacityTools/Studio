import { useQuery } from "@core/hooks/useQuery";
import { useCallback } from "react";
import getEmbeds from "../queries/getEmbeds";

export default function useEmbeds(projectId: number) {
  const queryFn = useCallback(() => getEmbeds(projectId), [projectId]);

  const { data, isLoading, refetch } = useQuery({
    queryFn,
    defaultValue: [],
  });

  return { embeds: data, isLoading, refetch };
}
