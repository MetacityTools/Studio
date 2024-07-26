import { Dispatch, SetStateAction } from "react";
import { useEditorContext } from "./useEditorContext";

export function useDarkmode(): [boolean, Dispatch<SetStateAction<boolean>>] {
  const ctx = useEditorContext();
  return [ctx.darkmode, ctx.setDarkmode];
}
