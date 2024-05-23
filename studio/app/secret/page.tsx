// MK: this is page behind withPageAuthRequired, which forces Auth0 to log in
"use client";

import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { Project } from "@features/db/entities/project";
import { getOwnProjects } from "@features/projects";

function SecretPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#useeffect
  useEffect(() => {
    const updateProjects = async () => {
      const projects = await getOwnProjects();
      setProjects(projects);
    };
    updateProjects();
  }, []);

  const session = useUser();

  const userPicture = session?.user?.picture ?? "";

  return (
    <div>
      <h1>Studio Very Much Secret</h1>
      <p>This page is only accessible to authenticated users.</p>
      <h2>User</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <img src={userPicture} alt="User picture" />

      <h2>Projects</h2>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>{JSON.stringify(project, null, 2)}</li>
        ))}
      </ul>
    </div>
  );
}

export default withPageAuthRequired(SecretPage);
