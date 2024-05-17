import { getSession } from "@auth0/nextjs-auth0";

export const getUser = async () => {
  const session = await getSession();
  return session ? session.user : null;
};
