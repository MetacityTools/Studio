"use client";

import { defaultTheme, Provider } from "@adobe/react-spectrum";
import { useRouter } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useState } from "react";

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

type CoreContextProps = {
  setColorScheme: Dispatch<SetStateAction<"light" | "dark">>;
};

export const CoreContext = createContext<CoreContextProps>(
  {} as CoreContextProps,
);

export function ClientProviders(props: ClientProvidersProps) {
  const { children } = props;
  let router = useRouter();

  //get OS default color scheme
  let colorScheme: "light" | "dark" = "light";
  // if (typeof window !== "undefined") {
  //   colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  //     ? "dark"
  //     : "light";
  // }

  const [colorSchemeState, setColorSchemeState] = useState<"light" | "dark">(
    colorScheme,
  );

  return (
    <CoreContext.Provider value={{ setColorScheme: setColorSchemeState }}>
      <Provider
        theme={defaultTheme}
        colorScheme={colorSchemeState}
        router={{ navigate: router.push }}
        width="100vw"
        minHeight="100vh"
      >
        {children}
      </Provider>
    </CoreContext.Provider>
  );
}
