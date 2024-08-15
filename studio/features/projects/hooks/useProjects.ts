import { useQuery } from "@core/hooks/useQuery";
import { Project } from "@features/db/entities/project";
import { getProjects } from "../queries/getProjects";

export default function useProjects() {
  const { data, isLoading, refetch } = useQuery<Project[]>({
    queryFn: getProjects,
    defaultValue: [],
  });

  return { projects: data, isLoading, refetch };
}
