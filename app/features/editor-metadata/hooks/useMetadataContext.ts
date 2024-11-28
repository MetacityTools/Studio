import { useContext } from "react";
import { MetadataContext } from "../providers/MetadataProvider";

export default function useMetadataContext() {
  const ctx = useContext(MetadataContext);

  if (!ctx) {
    throw new Error(
      "useMetadataContext must be used within a MetadataProvider",
    );
  }

  return ctx;
}
