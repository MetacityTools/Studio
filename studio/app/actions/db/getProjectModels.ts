// MK: function that runs on server and gets data
"use server";

import { canAccessProjects } from "../../lib/auth/acl";

export async function getProjectModels() {
  return (await canAccessProjects()) ? "projects" : "not projects";
}
