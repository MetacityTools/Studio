import { TypedArray } from "@bananagl/bananagl";

import { EditorModelData } from "@editor/data/EditorModel";

import { WriteOnlyMemoryStream } from "./streams";
import { ProjectData } from "./types";

export function exportModel(models: EditorModelData[], params: ProjectData) {
  const stream = new WriteOnlyMemoryStream();
  //write version
  writeString("mtctv3", stream);

  //write project data
  writeProjectData(params, stream);

  //write models
  for (const model of models) writeModel(model, stream);

  stream.close();

  const file = new File(stream.buffers, "project.metacity", {
    type: "application/octet-stream",
  });
  return file;

  // const url = URL.createObjectURL(file);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = `${title}.mcmodel`;
  // a.click();
  // URL.revokeObjectURL(url);

  //export styles
  //sleep a bit
  // setTimeout(() => {
  //   const styleData = JSON.stringify(styles);
  //   const styleFile = new File([styleData], "styles.json", {
  //     type: "application/json",
  //   });
  //   const styleUrl = URL.createObjectURL(styleFile);
  //   const styleA = document.createElement("a");
  //   styleA.href = styleUrl;
  //   styleA.download = `${title}.mcstyle`;
  //   styleA.click();
  //   URL.revokeObjectURL(styleUrl);
  // }, 1000);
}

function writeModel(model: EditorModelData, stream: WriteOnlyMemoryStream) {
  writeString(model.uuid, stream);
  writeTypedArray(model.geometry.position, stream);
  writeTypedArray(model.geometry.submodel, stream);
  const metadata = JSON.stringify(model.metadata.data);
  writeString(metadata, stream);
  writeString(model.metadata.name, stream);
  stream.writeInt32(model.metadata.visible ? 1 : 0);
  stream.writeInt32(model.metadata.primitive);
}

function writeProjectData(params: ProjectData, stream: WriteOnlyMemoryStream) {
  const style = JSON.stringify(params.style);
  writeString(style, stream);
  const modelStyle = JSON.stringify(params.modelStyle);
  writeString(modelStyle, stream);
  writeString(params.activeMetadataColumn, stream);
  writeString(params.projectionType, stream);
  writeString(params.cameraView, stream);
  writeTypedArray(new Float32Array(params.cameraPosition), stream);
  writeTypedArray(new Float32Array(params.cameraTarget), stream);
  writeTypedArray(new Float32Array(params.globalShift), stream);
}

export interface ConstructableTypedArray {
  new (buffer: ArrayBuffer): TypedArray;
  BYTES_PER_ELEMENT: number;
}

function writeTypedArray(array: TypedArray, stream: WriteOnlyMemoryStream) {
  const length = array.length;
  stream.writeInt32(length);
  stream.writeUint8Array(array.buffer as ArrayBuffer);
}

function writeString(string: string, stream: WriteOnlyMemoryStream) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(string);
  stream.writeInt32(encoded.length);
  stream.writeUint8Array(encoded);
}
