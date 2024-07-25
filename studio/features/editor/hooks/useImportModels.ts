import * as GL from "@bananagl/bananagl";
import {
  DEFAULT_UNIFORMS,
  EditorModel,
  EditorModelData,
} from "@editor/data/EditorModel";
import {
  noEdgesShader,
  solidShader,
  wireframeShader,
} from "@editor/data/EditorModelShader";
import { PrimitiveType } from "@editor/data/types";
import { vec3 } from "gl-matrix";
import { useCallback } from "react";
import { useEditorContext } from "./useEditorContext";
import { useUpdateMetadata } from "./useMetadataUpdate";

export interface EditorImportOptions {
  overwriteCurrent?: boolean;
}

export function useImportModels() {
  const { globalShift, scene, setGlobalShift, setModels } = useEditorContext();
  const updateMetadata = useUpdateMetadata();

  const importModels = useCallback(
    async (data: EditorModelData[], options?: EditorImportOptions) => {
      let shift = globalShift;
      const createdModels = [];

      //sort out the alignment
      for (const model of data) {
        shift = alignModels(model.geometry.position, shift);
      }

      //generate geometry and metadata
      for (const model of data) {
        const glmodel = await importModel(model);
        if (!glmodel) continue;
        createdModels.push(glmodel);
      }

      if (options?.overwriteCurrent) {
        const objCopy = scene.objects.slice();
        for (const obj of objCopy) {
          if (obj instanceof EditorModel) scene.remove(obj);
        }
      }

      //add to scene
      for (const model of createdModels) {
        scene.add(model);
      }

      //all current models
      const models = scene.objects.filter(
        (obj) => obj instanceof EditorModel,
      ) as EditorModel[];

      //cleanup metadata
      for (const model of models) {
        model.cleanUpMetadata();
      }

      setGlobalShift(shift);
      setModels(models);
      updateMetadata(models);

      return createdModels;
    },
    [globalShift, scene, setGlobalShift, setModels, updateMetadata],
  );

  return importModels;
}

async function importModel(model: EditorModelData) {
  if (model.metadata.primitive === PrimitiveType.TRIANGLES) {
    return await addTriangleModel(model);
  }
}

async function addTriangleModel(data: EditorModelData) {
  let { geometry, metadata, position, rotation, scale, uniforms } = data;

  position = position || vec3.create();
  rotation = rotation || vec3.create();
  scale = scale || vec3.fromValues(1, 1, 1);

  const glmodel = new EditorModel();
  const vertices = geometry.position;
  const submodel = geometry.submodel;

  const byteSubmodel = new Uint8Array(submodel.buffer);
  const colors = new Uint8Array(vertices.length).fill(255);
  const selected = new Uint8Array(vertices.length).fill(0);
  const bar = new Uint8Array(vertices.length);
  for (let i = 0; i < vertices.length; i++) bar[i] = i % 3;

  const normals = computeNormals(vertices);
  glmodel.attributes.add(
    new GL.Attribute("position", new GL.Buffer(vertices), 3),
  );
  glmodel.attributes.add(new GL.Attribute("normal", new GL.Buffer(normals), 3));
  glmodel.attributes.add(
    new GL.Attribute("color", new GL.Buffer(colors), 3, true),
  );
  glmodel.attributes.add(
    new GL.Attribute("selected", new GL.Buffer(selected), 1, true),
  );
  glmodel.attributes.add(
    new GL.Attribute("submodel", new GL.Buffer(byteSubmodel), 4),
  );
  glmodel.attributes.add(new GL.Attribute("barCoord", new GL.Buffer(bar), 1));
  glmodel.shader = solidShader;
  glmodel.solidShader = solidShader;
  glmodel.wireframeShader = wireframeShader;
  glmodel.noEdgesShader = noEdgesShader;
  glmodel.name = metadata.name;
  glmodel.metadata = metadata.data;
  if (uniforms) glmodel.uniforms = GL.cloneUniforms(uniforms);
  else glmodel.uniforms = DEFAULT_UNIFORMS;
  glmodel.position = position.slice() as vec3;
  glmodel.rotation = rotation.slice() as vec3;
  glmodel.scale = scale.slice() as vec3;
  glmodel.primitive = PrimitiveType.TRIANGLES;
  glmodel.mode = 4;

  await glmodel.initTrianglePicking();
  return glmodel;
}

function alignModels(positions: Float32Array, shift: vec3 | null = null) {
  if (shift === null) {
    //if this is the first model we are importing, align it to the center
    shift = vec3.create();
    alignToCenter(positions, shift);
  } else {
    shiftModel(positions, shift);
  }

  return shift;
}

function alignToCenter(model: Float32Array, shift: vec3 | null = null) {
  const minCoords = [Infinity, Infinity, Infinity];
  const maxCoords = [-Infinity, -Infinity, -Infinity];

  for (let i = 0; i < model.length; i += 3) {
    const x = model[i];
    const y = model[i + 1];
    const z = model[i + 2];

    minCoords[0] = Math.min(minCoords[0], x);
    minCoords[1] = Math.min(minCoords[1], y);
    minCoords[2] = Math.min(minCoords[2], z);

    maxCoords[0] = Math.max(maxCoords[0], x);
    maxCoords[1] = Math.max(maxCoords[1], y);
    maxCoords[2] = Math.max(maxCoords[2], z);
  }

  const center = [
    (maxCoords[0] + minCoords[0]) / 2,
    (maxCoords[1] + minCoords[1]) / 2,
    (maxCoords[2] + minCoords[2]) / 2,
  ];

  for (let i = 0; i < model.length; i += 3) {
    model[i] -= center[0];
    model[i + 1] -= center[1];
    //model[i + 2] -= center[2];
  }

  if (shift) {
    shift[0] = -center[0];
    shift[1] = -center[1];
    shift[2] = 0;
  }

  return model;
}

function shiftModel(model: Float32Array, shift: vec3) {
  for (let i = 0; i < model.length; i += 3) {
    model[i] += shift[0];
    model[i + 1] += shift[1];
    model[i + 2] += shift[2];
  }
}

function cross(a: number[], b: number[], out: number[]) {
  out[0] = a[1] * b[2] - a[2] * b[1];
  out[1] = a[2] * b[0] - a[0] * b[2];
  out[2] = a[0] * b[1] - a[1] * b[0];
}

function normalize(v: number[]) {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  v[0] /= length;
  v[1] /= length;
  v[2] /= length;
}

function computeNormals(positions: number[] | Float32Array) {
  const normals = new Float32Array(positions.length);
  const v2 = [0, 0, 0];
  const v3 = [0, 0, 0];
  const n = [0, 0, 0];
  let j = 0;

  for (let i = 0; i < positions.length; i += 9) {
    v2[0] = positions[i + 3] - positions[i];
    v2[1] = positions[i + 4] - positions[i + 1];
    v2[2] = positions[i + 5] - positions[i + 2];
    v3[0] = positions[i + 6] - positions[i];
    v3[1] = positions[i + 7] - positions[i + 1];
    v3[2] = positions[i + 8] - positions[i + 2];

    cross(v2, v3, n);
    normalize(n);

    normals[j++] = n[0];
    normals[j++] = n[1];
    normals[j++] = n[2];
    normals[j++] = n[0];
    normals[j++] = n[1];
    normals[j++] = n[2];
    normals[j++] = n[0];
    normals[j++] = n[1];
    normals[j++] = n[2];
  }

  return normals;
}
function useCalback(
  arg0: (
    data: EditorModelData[],
    options?: EditorImportOptions,
  ) => Promise<EditorModel[]>,
) {
  throw new Error("Function not implemented.");
}
