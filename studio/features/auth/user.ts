import { getSession } from "@auth0/nextjs-auth0";

export const getUserToken = async () => {
  const session = await getSession();

  if (!session?.user?.sub) throw new Error("Unauthorized");

  return {
    id: session?.user?.sub,
    email: session?.user?.email,
    picture: session?.user?.picture,
  };
};
