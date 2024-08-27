import { ModelData, ModelStyle, Style } from "@editor/data/types";

import { CameraView, ProjectionType } from "@features/bananagl/bananagl";
import { vec3 } from "gl-matrix";
import { ReadOnlyMemoryStream } from "./streams";
import { EditorData, ProjectData } from "./types";
import { ConstructableTypedArray } from "./write";

export function readModels(buffer: ArrayBuffer): EditorData {
  const stream = new ReadOnlyMemoryStream(buffer);
  const version = readString(stream);

  if (version === "mtctv3") return readV3(stream);

  if (version === "mtctv2")
    return {
      models: readV2(stream),
    };
  return {
    models: readLegacy(stream),
  };
}

function readLegacy(stream: ReadOnlyMemoryStream): ModelData[] {
  console.warn("Legacy metacity file detected, please re-export");
  stream.seek(0);
  return [readModel(stream)];
}

function readV2(stream: ReadOnlyMemoryStream): ModelData[] {
  const data: ModelData[] = [];
  while (!stream.empty()) {
    const model = readModel(stream);
    data.push(model);
  }
  return data;
}

function readV3(stream: ReadOnlyMemoryStream): EditorData {
  const models: ModelData[] = [];
  const project = readProjectData(stream);

  while (!stream.empty()) {
    const model = readModel(stream, true);
    models.push(model);
  }

  return { models, project };
}

function readModel(stream: ReadOnlyMemoryStream, hasUUID = false): ModelData {
  const uuid = hasUUID ? readString(stream) : self.crypto.randomUUID();
  const positions = readTypedArray(stream, Float32Array) as Float32Array;
  const submodel = readTypedArray(stream, Uint32Array) as Uint32Array;
  const metaString = readString(stream);
  const metadata = JSON.parse(metaString);
  const name = readString(stream);
  const primitive = stream.readInt32();

  return {
    uuid: uuid,
    geometry: {
      position: positions,
      submodel: submodel,
    },
    metadata: {
      data: metadata,
      name: name,
      primitive: primitive,
    },
  };
}

function readTypedArray(
  stream: ReadOnlyMemoryStream,
  array: ConstructableTypedArray,
) {
  const length = stream.readInt32();
  const buffer = stream.readUint8Array(length * array.BYTES_PER_ELEMENT);
  return new array(buffer.buffer);
}

function readString(stream: ReadOnlyMemoryStream) {
  const length = stream.readInt32();
  const buffer = stream.readUint8Array(length);
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

function readProjectData(stream: ReadOnlyMemoryStream): ProjectData {
  const style = JSON.parse(readString(stream)) as Style;
  const modelStyle = JSON.parse(readString(stream)) as ModelStyle;
  const activeMetadataColumn = readString(stream);
  const projectionType = readString(stream) as ProjectionType;
  const cameraView = readString(stream) as CameraView;
  const cameraPosition = readTypedArray(stream, Float32Array) as vec3;
  const cameraTarget = readTypedArray(stream, Float32Array) as vec3;
  const globalShift = readTypedArray(stream, Float32Array) as vec3;

  return {
    style,
    modelStyle,
    activeMetadataColumn,
    projectionType,
    cameraView,
    cameraPosition,
    cameraTarget,
    globalShift,
  };
}
