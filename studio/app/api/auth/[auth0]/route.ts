// MK: this file handles OAuth with Auth0
// https://auth0.com/docs/quickstart/webapp/nextjs/01-login

import { handleAuth } from "@auth0/nextjs-auth0";

export const GET = handleAuth();
