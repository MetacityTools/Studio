import { vec3 } from 'gl-matrix';

import { alignToCenter, shiftModel } from '@utils/geometry/align';
import { computeNormals } from '@utils/geometry/normals';
import { ModelData, PrimitiveType } from '@utils/types';

import * as GL from '@bananagl/bananagl';

import { CoordinateMode, EditorModelData } from '../addEditorModel';
import { solidShader, wireframeShader } from '../shaders/EditorModelShader';
import { DEFAULT_UNIFORMS, EditorModel } from './EditorModel';

export async function addTriangleModel(model: ModelData, ctx: EditorModelData) {
    let { coordMode, globalShift, position, rotation, scale, scene, uniforms } = ctx;

    position = position || vec3.create();
    rotation = rotation || vec3.create();
    scale = scale || vec3.fromValues(1, 1, 1);

    const glmodel = new EditorModel();
    const vertices = model.geometry.position;
    const submodel = model.geometry.submodel;

    const byteSubmodel = new Uint8Array(submodel.buffer);

    if (coordMode === CoordinateMode.Center) alignToCenter(vertices);
    if (coordMode === CoordinateMode.Keep) {
        if (globalShift === null) {
            globalShift = vec3.create();
            alignToCenter(vertices, globalShift);
        } else {
            shiftModel(vertices, globalShift);
        }
    }

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
    glmodel.data = model.metadata.data;
    glmodel.name = model.metadata.name;
    if (uniforms) glmodel.uniforms = GL.cloneUniforms(uniforms);
    else glmodel.uniforms = DEFAULT_UNIFORMS;
    glmodel.position = position.slice() as vec3;
    glmodel.rotation = rotation.slice() as vec3;
    glmodel.scale = scale.slice() as vec3;
    glmodel.primitive = PrimitiveType.TRIANGLES;
    glmodel.mode = 4;

    glmodel.addPickListener((object, primitiveIndices, shiftFlag) => {
        const submodel = object.attributes.getAttribute('submodel') as GL.Attribute;
        const submodelIds = submodel.buffer.getView(Uint32Array);

        const multiselect = Array.isArray(primitiveIndices);
        const arrIdxs = multiselect ? primitiveIndices : [primitiveIndices];
        const submodelIDs = new Set<number>();
        for (const idx of arrIdxs) submodelIDs.add(submodelIds[idx * 3]);
        const submodelIDsArr = Array.from(submodelIDs);
        let toggle = false;
        let extend = false;

        if (multiselect) {
            if (shiftFlag) extend = true;
            else toggle = true;
        } else if (shiftFlag) toggle = true;

        //TODO problem here is that the select is old/previous state
        ctx.selection.updateSelection(glmodel, submodelIDsArr, toggle, extend);
    });

    await glmodel.initTrianglePicking();
    scene.add(glmodel);
    return globalShift;
}
