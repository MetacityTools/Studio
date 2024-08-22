import { useProvider } from "@adobe/react-spectrum";
import * as GL from "@bananagl/bananagl";
import { EditorModel } from "@editor/data/EditorModel";
import { Style } from "@editor/data/types";
import { vec3 } from "gl-matrix";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export type SelectFunction = (
  selection: SelectionType,
  toggle?: boolean,
  extend?: boolean,
) => void;
export type SelectionType = Map<EditorModel, Set<number>>;
export type Tooltip = { data: any; x: number; y: number } | null;

type EditorContextProps = {
  scene: GL.Scene;
  renderer: GL.Renderer;
  activeView: number;
  models: EditorModel[];
  setModels: Dispatch<SetStateAction<EditorModel[]>>;
  selection: SelectionType;
  setSelection: Dispatch<SetStateAction<SelectionType>>;
  tooltip: Tooltip | null;
  setTooltip: Dispatch<SetStateAction<Tooltip | null>>;
  camTargetZ: number;
  setCamTargetZ: Dispatch<SetStateAction<number>>;
  minShade: number;
  setMinShade: Dispatch<SetStateAction<number>>;
  maxShade: number;
  setMaxShade: Dispatch<SetStateAction<number>>;
  globalShift: vec3 | null;
  setGlobalShift: Dispatch<SetStateAction<vec3 | null>>;
  styles: Style;
  setStyles: Dispatch<SetStateAction<Style>>;
  greyscale: boolean;
  setGreyscale: Dispatch<SetStateAction<boolean>>;
  activeMetadataColumn: string;
  setActiveMetadataColumn: Dispatch<SetStateAction<string>>;
};

export const context = createContext<EditorContextProps>(
  {} as EditorContextProps,
);

export function EditorProvider(props: { children: ReactNode }) {
  const [renderer] = useState(new GL.Renderer());
  const [scene] = useState(new GL.Scene());
  const [models, setModels] = useState<EditorModel[]>([]);
  const [selection, setSelection] = useState<SelectionType>(new Map());
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [camTargetZ, setCamTargetZ] = useState<number>(0);
  const [minShade, setMinShade] = useState<number>(0);
  const [maxShade, setMaxShade] = useState<number>(10);
  const [globalShift, setGlobalShift] = useState<vec3 | null>(null);
  const [styles, setStyles] = useState<Style>({});
  const [greyscale, setGreyscale] = useState<boolean>(false);
  const [activeMetadataColumn, setActiveMetadataColumn] = useState<string>("");

  //TODO darkmode load from user device settings
  const { colorScheme } = useProvider();

  const activeView = 0;

  useEffect(() => {
    let minZ = Infinity;
    let maxZ = -Infinity;

    for (const model of models) {
      const bbox = model.boundingBox;
      minZ = Math.min(minZ, bbox.min[2]);
      maxZ = Math.max(maxZ, bbox.max[2]);
    }
    setMinShade(minZ);
    setMaxShade(maxZ);
    if (isFinite(minZ)) setCamTargetZ(minZ);
  }, [models]);

  useEffect(() => {
    models.forEach((object) => {
      if (object instanceof EditorModel) {
        object.uniforms = {
          uZMin: minShade,
        };
      }
    });
  }, [minShade, models]);

  useEffect(() => {
    models.forEach((object) => {
      if (object instanceof EditorModel) {
        object.uniforms = {
          uZMax: maxShade,
        };
      }
    });
  }, [maxShade, models]);

  useEffect(() => {
    console.debug("models", models);
  }, [models]);

  useEffect(() => {
    const view = renderer.views?.[activeView].view;
    if (!view) return;
    view.camera.z = camTargetZ;
  }, [activeView, renderer.views, camTargetZ]);

  useEffect(() => {
    if (colorScheme === "dark") {
      renderer.clearColor = [0.1, 0.1, 0.1, 1];
      document.documentElement.style.setProperty("color-scheme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkmode", "true");
    } else {
      renderer.clearColor = [1, 1, 1, 1];
      document.documentElement.style.setProperty("color-scheme", "light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkmode", "false");
    }
  }, [colorScheme, renderer]);

  return (
    <context.Provider
      value={{
        scene,
        renderer,
        activeView: activeView,
        models,
        setModels,
        selection,
        setSelection,
        tooltip,
        setTooltip,
        camTargetZ,
        setCamTargetZ,
        minShade,
        setMinShade,
        maxShade,
        setMaxShade,
        globalShift,
        setGlobalShift,
        styles,
        setStyles,
        greyscale,
        setGreyscale,
        activeMetadataColumn,
        setActiveMetadataColumn,
      }}
    >
      {props.children}
    </context.Provider>
  );
}
