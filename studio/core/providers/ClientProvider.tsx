"use client";

import { useRouter } from "next/navigation";
import { defaultTheme, Provider } from "@adobe/react-spectrum";

declare module "@adobe/react-spectrum" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

type ClientProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function ClientProviders(props: ClientProvidersProps) {
  const { children } = props;
  let router = useRouter();

  return (
    <Provider
      theme={defaultTheme}
      router={{ navigate: router.push }}
      width="100vw"
      height="100vh"
    >
      {children}
    </Provider>
  );
}
