"use server";

import { canAccessProjects } from "@/app/lib/auth/acl";
import { AppDataSource } from "@/app/lib/db/data-source";
import { Project } from "@/app/lib/db/entities/project";
import { initDatabase } from "@/app/lib/db/init-database";

export async function getProjects() {
  if (!(await canAccessProjects())) {
    return [];
  }

  await initDatabase();
  const ProjectRepository = AppDataSource.getRepository(Project);

  const projects = await ProjectRepository.find();
  return projects;
}
