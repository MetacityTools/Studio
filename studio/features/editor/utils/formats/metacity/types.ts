import { ProjectionType } from "@features/bananagl/camera/cameraInterface";
import { CameraView } from "@features/bananagl/camera/cameraView";
import { EditorModelData } from "@features/editor/data/EditorModel";
import { Style } from "@features/editor/data/types";
import { vec3 } from "gl-matrix";

export type ProjectData = {
  style: Style;
  globalShift: vec3;
  activeMetadataColumn: string;
  cameraView: CameraView;
  cameraPosition: vec3;
  cameraTarget: vec3;
  projectionType: ProjectionType;
};

export type EditorData = {
  models: EditorModelData[];
  project?: ProjectData;
};
