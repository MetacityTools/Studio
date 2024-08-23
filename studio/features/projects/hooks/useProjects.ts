import { useQuery } from "@core/hooks/useQuery";
import { getProjects } from "../queries/getProjects";

export default function useProjects() {
  const { data, isLoading, refetch } = useQuery({
    queryFn: getProjects,
    defaultValue: [],
  });

  return { projects: data, isLoading, refetch };
}
