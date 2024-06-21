"use client";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { withUserEnabled } from "@core/utils/withUserEnabled";

type ProjectPageProps = {
  projectId: string;
};

function ProjectPage({ projectId }: ProjectPageProps) {
  console.log(projectId);

  return (
    <div>
      <h1>Project Page</h1>
    </div>
  );
}

export default withPageAuthRequired(withUserEnabled(ProjectPage));
