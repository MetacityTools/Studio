import { defaultTheme, Provider } from "@adobe/react-spectrum";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type ClientProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

type CoreContextProps = {
  setColorScheme: Dispatch<SetStateAction<"light" | "dark">>;
};

export const CoreContext = createContext<CoreContextProps>({} as CoreContextProps);

export function ClientProviders(props: ClientProvidersProps) {
  const { children } = props;

  //get OS default color scheme
  let colorScheme: "light" | "dark" = "light";
  if (typeof window !== "undefined") {
    colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  const [colorSchemeState, setColorSchemeState] = useState<"light" | "dark">(colorScheme);

  return (
    <CoreContext.Provider value={{ setColorScheme: setColorSchemeState }}>
      <Provider theme={defaultTheme} colorScheme={colorSchemeState} width="100vw" minHeight="100vh">
        {children}
      </Provider>
    </CoreContext.Provider>
  );
}
