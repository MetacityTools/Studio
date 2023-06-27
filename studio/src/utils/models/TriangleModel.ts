import { vec3 } from 'gl-matrix';

import { computeNormals } from '@utils/modifiers/computeNormals';
import { ModelData, PrimitiveType } from '@utils/types';

import * as GL from '@bananagl/bananagl';

import { DEFAULT_UNIFORMS, EditorModel } from './EditorModel';
import { noEdgesShader, solidShader, wireframeShader } from './EditorModelShader';

export interface EditorModelData extends ModelData {
    position?: vec3;
    rotation?: vec3;
    scale?: vec3;
    uniforms?: { [name: string]: any };
}

export async function addTriangleModel(data: EditorModelData) {
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
    glmodel.attributes.add(new GL.Attribute('position', new GL.Buffer(vertices), 3));
    glmodel.attributes.add(new GL.Attribute('normal', new GL.Buffer(normals), 3));
    glmodel.attributes.add(new GL.Attribute('color', new GL.Buffer(colors), 3, true));
    glmodel.attributes.add(new GL.Attribute('selected', new GL.Buffer(selected), 1, true));
    glmodel.attributes.add(new GL.Attribute('submodel', new GL.Buffer(byteSubmodel), 4));
    glmodel.attributes.add(new GL.Attribute('barCoord', new GL.Buffer(bar), 1));
    glmodel.shader = solidShader;
    glmodel.solidShader = solidShader;
    glmodel.wireframeShader = wireframeShader;
    glmodel.noEdgesShader = noEdgesShader;
    glmodel.name = metadata.name;
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
