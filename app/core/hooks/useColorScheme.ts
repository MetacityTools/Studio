import { CoreContext } from "@core/providers/ClientProvider";
import { useContext } from "react";

export default function useColorScheme() {
  const ctx = useContext(CoreContext);

  if (!ctx) {
    throw new Error("useColorScheme must be used within a CoreProvider");
  }

  return ctx.setColorScheme;
}
