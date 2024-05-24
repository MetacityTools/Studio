"use client";

import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useOwnProjects } from "@features/projects/hooks/useOwnProjects";

function SecretPage() {
  const { data, isLoading } = useOwnProjects();
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
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

export default withPageAuthRequired(SecretPage);
