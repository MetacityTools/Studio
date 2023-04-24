import { mat4 } from 'gl-matrix';
import { UserInputModel } from 'types';

import { loadModels } from '@utils/formats/loader';
import { alignToOrigin } from '@utils/geometry/grid';

import * as GL from '@bananagl/bananagl';

import { computeNormals } from '../geometry/normals';
import { EditorModel } from './EditorModel';
import { solidShader, wireframeShader } from './EditorModelShader';
import { modelToGltf } from './export';

export async function addUserModels(
    scene: GL.Scene,
    selection: GL.SelectionManager,
    models: UserInputModel[]
) {
    const modelData = await loadModels(models);

    modelData.forEach((model) => {
        const glmodel = new EditorModel();
        const vertices = model.geometry.position;
        const submodel = model.geometry.submodel;

        const byteSubmodel = new Uint8Array(submodel.buffer);
        alignToOrigin([vertices]);

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

        glmodel.uniforms = {
            uZMin: 0,
            uZMax: 10,
        };

        glmodel.onPick = (object, idx, ray, t, addToSelection) => {
            const submodel = object.attributes.getAttribute('submodel') as GL.Attribute;
            const submodelBuffer = submodel.buffer.getView(Uint32Array);
            if (!submodel) return;
            const id = submodelBuffer[idx * 3];

            if (!addToSelection) selection.clearSelection();
            selection.toggleSelection(id, object as EditorModel);
        };

        scene.add(glmodel, true);
    });
}
