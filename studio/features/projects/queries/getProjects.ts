"use server";

import { canReadProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export async function getProjects(): Promise<
  (Project & { thumbnail_contents: string })[]
> {
  if (!(await canReadProjects())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const ProjectRepository = await injectRepository(Project);

  const projects = await ProjectRepository.query(
    `
    SELECT projects.*, latest_project_version.thumbnail_contents
    FROM projects
    LEFT JOIN (
        SELECT project_id, thumbnail_contents
        FROM project_version
        WHERE (project_id, created_at) IN (
            SELECT project_id, MAX(created_at)
            FROM project_version
            GROUP BY project_id
        )
    ) AS latest_project_version ON latest_project_version.project_id = projects.id
    WHERE projects.user_id = $1`,
    [user.id],
  );

  return toPlain(projects);
}
