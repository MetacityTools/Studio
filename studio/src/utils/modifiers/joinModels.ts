import { vec3 } from 'gl-matrix';

import { EditorModel } from '@utils/models/EditorModel';
import { EditorModelData, Metadata } from '@utils/utils';

export async function joinModels(models: EditorModel[]) {
    if (models.length === 0) throw new Error('No models to convert.');

    const positions: Float32Array[] = [];
    const submodels: Uint32Array[] = [];
    let submodelCount = 0;

    const uniforms = {
        uZMin: 0,
        uZMax: 0,
    };

    const joinedMetadata: Metadata = {};

    for (const model of models) {
        //get required attributes
        const p = model.attributes.getAttribute('position');
        const s = model.attributes.getAttribute('submodel');
        if (!p || !s) throw new Error('Required attributes not found during conversion.');

        //get model nodes
        const modelMetadata = model.metadata;

        //apply positions
        const pi = new Float32Array(p.buffer.data.length);
        pi.set(p.buffer.data);
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
        const view = s.buffer.getView(Uint32Array);
        //init updated submodel ids
        const si = new Uint32Array(view.length);
        si.set(view);
        //array of unique old ids
        const uniqueOldIDs = Array.from(new Set<number>(si));
        //conversion map
        const map = new Map<number, number>();
        let data: any, id: number | undefined;
        //create mapping
        for (let i = 0; i < uniqueOldIDs.length; i++) map.set(uniqueOldIDs[i], i);
        //apply mapping
        for (let i = 0; i < si.length; i++) {
            //update submodel id
            id = si[i];
            si[i] = map.get(id)! + submodelCount;
            //update metadata
            data = modelMetadata[id];
            joinedMetadata[si[i]] = data ?? {};
        }
        submodels.push(si);
        uniforms.uZMin = model.uniforms.uZMin as number;
        uniforms.uZMax = model.uniforms.uZMax as number;

        //epilogue
        submodelCount += uniqueOldIDs.length;
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
    const modelData: EditorModelData = {
        geometry: {
            position,
            submodel,
        },
        metadata: {
            data: joinedMetadata,
            name: 'Joined Model',
            primitive: models[0].primitive, //TODO this is gonna be triangle but maybe we should change it up in the future
        },
        uniforms,
    };

    return modelData;
}
