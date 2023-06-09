import { vec3 } from 'gl-matrix';

import { EditorModel } from '@utils/models/EditorModel';
import { CoordinateMode, addEditorModels } from '@utils/models/addEditorModel';
import { ModelData } from '@utils/types';

import { Scene } from '@bananagl/bananagl';

export async function joinModels(scene: Scene, models: EditorModel[]) {
    if (models.length === 0) throw new Error('No models to convert.');

    const positions: Float32Array[] = [];
    const submodels: Uint32Array[] = [];
    const meta: any[] = [];
    let submodelCount = 0;

    const uniforms = {
        uZMin: 0,
        uZMax: 0,
    };

    for (const model of models) {
        //get required attributes
        const p = model.attributes.getAttribute('position');
        const s = model.attributes.getAttribute('submodel');
        if (!p || !s) throw new Error('Required attributes not found during conversion.');

        //convert positions
        const pi = p.buffer.data;
        const v = vec3.create();
        for (let i = 0; i < pi.length; i += 3) {
            vec3.set(v, pi[i], pi[i + 1], pi[i + 2]);
            vec3.transformMat4(v, v, model.transform);
            pi[i] = v[0];
            pi[i + 1] = v[1];
            pi[i + 2] = v[2];
        }
        positions.push(pi as Float32Array);

        //convert submodels
        const si = new Uint32Array(s.buffer.data.buffer);
        const ids = Array.from(new Set<number>(si));
        const map = new Map<number, number>();
        for (let i = 0; i < ids.length; i++) map.set(ids[i], i), meta.push(model.data[ids[i]]);
        for (let i = 0; i < si.length; i++) si[i] = map.get(si[i])! + submodelCount;
        submodels.push(si);

        uniforms.uZMin = model.uniforms.uZMin as number;
        uniforms.uZMax = model.uniforms.uZMax as number;

        //epilogue
        submodelCount += ids.length;
        scene.remove(model);
    }

    //concat buffers
    const position = new Float32Array(positions.reduce((a, b) => a + b.length, 0));
    const submodel = new Uint32Array(submodels.reduce((a, b) => a + b.length, 0));
    let offset = 0;
    for (let i = 0; i < positions.length; i++) {
        position.set(positions[i], offset);
        offset += positions[i].length;
    }

    offset = 0;
    for (let i = 0; i < submodels.length; i++) {
        submodel.set(submodels[i], offset);
        offset += submodels[i].length;
    }

    //create model data
    const modelData: ModelData = {
        geometry: {
            position,
            submodel,
        },
        metadata: {
            name: 'main',
            data: {},
            primitive: models[0].primitive, //TODO this is gonna be triangle but maybe we should change it up in the future
        },
    };

    //create model
    await addEditorModels({
        models: [modelData],
        scene,
        coordMode: CoordinateMode.None,
        uniforms,
        globalShift: [0, 0, 0],
    });

    return { submodelCount, meta };
}
