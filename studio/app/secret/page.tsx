// MK: this is page behind withPageAuthRequired, which forces Auth0 to log in
"use client";

import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import { getProjectModels } from "../actions/db/getProjectModels";

function SecretPage() {
  const [projectModels, setProjectModels] = useState<string>("");

  const onClick = async () => {
    const models = await getProjectModels();
    setProjectModels(models);
  };

  const session = useUser();

  const userPicture = session?.user?.picture ?? "";

  return (
    <div>
      <h1>Studio Very Much Secret</h1>
      <p>This page is only accessible to authenticated users.</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <img src={userPicture} alt="User picture" />
      <button onClick={onClick}>Load project models</button>
      {projectModels}
    </div>
  );
}

export default withPageAuthRequired(SecretPage);
