import { useUser as auth0useUser } from "@auth0/nextjs-auth0/client";
import { useUser as auth0useUser } from "@auth0/nextjs-auth0/client";

export const useUser = () => {
  const session = auth0useUser();
  if (!session) return null;
  return session.user;
};
